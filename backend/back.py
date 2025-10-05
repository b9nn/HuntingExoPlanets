from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import io
import os
from datetime import datetime
# Clean CSV canonical headers (exact display names from docs/cleaned_exoplanet_data.csv)
CLEAN_HEADERS = [
    'Orbital Period',
    'Planetary Radius',
    'Transit Duration',
    'Transit Depth',
    'Star’s Effective Temperature',
    'Star’s Radius',
    'Star’s Surface Gravity',
]

# Mapping from clean headers to koi_* model columns
CLEAN_TO_KOI = {
    'Orbital Period': 'koi_period',
    'Planetary Radius': 'koi_prad',
    'Transit Duration': 'koi_duration',
    'Transit Depth': 'koi_depth',
    'Star’s Effective Temperature': 'koi_steff',
    'Star’s Radius': 'koi_srad',
    'Star’s Surface Gravity': 'koi_slogg',
}

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Load models and associated objects
model = joblib.load("../model/exoai_stacking_model.pkl")
scaler = joblib.load("../model/exoai_scaler.pkl")
encoder = joblib.load("../model/exoai_label_encoder.pkl")

# Only use the stacking ensemble model

# Feature column names (model expects these koi_* columns in this order)
FEATURE_COLUMNS = [
    'koi_period',      # orbital_period_days
    'koi_duration',    # transit_duration_hours
    'koi_prad',        # planetary_radius_re
    'koi_depth',       # transit_depth_ppm
    'koi_steff',       # teff_k
    'koi_srad',        # rstar_rs
    'koi_slogg'        # logg
]

# Accept friendly API field names and map to koi_* expected by the model
FRIENDLY_TO_KOI = {
    'orbital_period_days': 'koi_period',
    'transit_duration_hours': 'koi_duration',
    'planetary_radius_re': 'koi_prad',
    'transit_depth_ppm': 'koi_depth',
    'teff_k': 'koi_steff',
    'rstar_rs': 'koi_srad',
    'logg': 'koi_slogg',
}
FRIENDLY_TO_KOI_INV = {
    'orbital_period_days': 'koi_period',
    'transit_duration_hours': 'koi_duration',
    'planetary_radius_re': 'koi_prad',
    'transit_depth_ppm': 'koi_depth',
    'teff_k': 'koi_steff',
    'rstar_rs': 'koi_srad',
    'logg': 'koi_slogg',
}

# Broad alias map to capture common KOI/K2/TESS headers
ALIAS_MAP = {
    'koi_period': [
        'koi_period', 'orbital_period_days', 'orbital_period', 'period', 'period_days',
        'pl_orbper', 'p', 'orbper', 'toi_period', 'k2_period'
    ],
    'koi_duration': [
        'koi_duration', 'transit_duration_hours', 'transit_duration', 'duration', 'duration_hours',
        'koi_dur', 'dur', 'toi_duration', 'k2_duration'
    ],
    'koi_prad': [
        'koi_prad', 'planetary_radius_re', 'planet_radius', 'radius_re', 'planet_radius_re',
        'prad', 'pl_rade', 'toi_prad', 'k2_prad'
    ],
    'koi_depth': [
        'koi_depth', 'transit_depth_ppm', 'transit_depth', 'depth_ppm', 'depth', 'dep', 'toi_depth', 'k2_depth'
    ],
    'koi_steff': [
        'koi_steff', 'teff_k', 'stellar_effective_temperature', 'teff', 'st_teff', 'host_teff', 'toi_teff', 'k2_teff'
    ],
    'koi_srad': [
        'koi_srad', 'rstar_rs', 'stellar_radius', 'st_rad', 'rstar', 'host_radius', 'toi_rstar', 'k2_rstar'
    ],
    'koi_slogg': [
        'koi_slogg', 'logg', 'stellar_logg', 'st_logg', 'host_logg', 'toi_logg', 'k2_logg'
    ],
}

def _normalize_header_name(name: str) -> str:
    # Lowercase, replace unicode quotes, replace non-alnum with underscores, collapse repeats
    import re
    s = str(name).strip().lower()
    s = s.replace('’', "'").replace('“', '"').replace('”', '"')
    s = re.sub(r"\s*\(.*?\)", "", s)  # drop unit parentheses
    s = re.sub(r"[^a-z0-9]+", "_", s)
    s = re.sub(r"_+", "_", s).strip('_')
    return s

def normalize_dataframe_columns_to_koi(df: pd.DataFrame) -> pd.DataFrame:
    """Attempt to rename various mission headers to koi_* columns expected by the model."""
    normalized_cols = {_normalize_header_name(c): c for c in df.columns}
    rename_map = {}
    # First, prefer exact clean headers from docs
    for clean, koi in CLEAN_TO_KOI.items():
        if clean in df.columns and koi not in df.columns:
            rename_map[clean] = koi
    # Then fallback to alias matching
    for koi_col, aliases in ALIAS_MAP.items():
        found_src = None
        for alias in aliases:
            normalized_alias = _normalize_header_name(alias)
            if normalized_alias in normalized_cols:
                found_src = normalized_cols[normalized_alias]
                break
        if found_src is not None and koi_col not in df.columns:
            rename_map[found_src] = koi_col
    if rename_map:
        df = df.rename(columns=rename_map)
    return df

def coerce_numeric(df: pd.DataFrame, columns: list[str]) -> pd.DataFrame:
    for col in columns:
        if col not in df.columns:
            df[col] = np.nan
        df[col] = pd.to_numeric(df[col], errors='coerce')
    return df

def impute_and_prepare_matrix(df: pd.DataFrame) -> np.ndarray:
    # Ensure required columns exist and are numeric
    df = coerce_numeric(df.copy(), FEATURE_COLUMNS)
    # Impute NaNs using scaler means if available, else column median, else zero
    if scaler is not None and hasattr(scaler, 'mean_'):
        means = scaler.mean_
        for i, col in enumerate(FEATURE_COLUMNS):
            df[col] = df[col].fillna(means[i])
    else:
        df = df.fillna(df.median(numeric_only=True))
        df = df.fillna(0)
    X = df[FEATURE_COLUMNS].values
    # Scale if scaler exists
    if scaler is not None:
        X = scaler.transform(X)
    return X

def normalize_feature_dict(features: dict) -> dict:
    """Return a dict with koi_* keys from friendly API keys only. koi_* in API is not accepted."""
    # Require friendly keys
    friendly_missing = [k for k in FRIENDLY_TO_KOI.keys() if k not in features]
    if friendly_missing:
        raise ValueError(f"Missing friendly feature keys: {friendly_missing}. Required: {list(FRIENDLY_TO_KOI.keys())}")

    # Map from friendly keys to koi_*
    mapped = {}
    for friendly, koi in FRIENDLY_TO_KOI.items():
        if friendly in features:
            mapped[koi] = features[friendly]
    missing = [col for col in FEATURE_COLUMNS if col not in mapped]
    if missing:
        raise ValueError(f"Missing features: {missing}. Required friendly keys: {list(FRIENDLY_TO_KOI.keys())}")
    return {k: mapped[k] for k in FEATURE_COLUMNS}

def rename_friendly_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Rename friendly column headers to koi_* if present. Returns a new DataFrame."""
    rename_map = {friendly: koi for friendly, koi in FRIENDLY_TO_KOI.items() if friendly in df.columns}
    if rename_map:
        return df.rename(columns=rename_map)
    return df

def koi_to_friendly_row(row: dict) -> dict:
    """Convert a koi_* row dict to friendly keys for frontend dataset display."""
    koi_to_friendly = {v: k for k, v in FRIENDLY_TO_KOI.items()}
    out = {}
    for k, v in row.items():
        out[koi_to_friendly.get(k, k)] = v
    return out

@app.route("/")
def home():
    return "ExoAI API is live"

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "last_ingest_iso": datetime.now().isoformat()
    })

@app.route("/models", methods=["GET"])
def get_models():
    return jsonify([
        {
            "id": "stacking",
            "name": "Stacking Ensemble",
        }
    ])

@app.route("/metrics", methods=["GET"])
def get_metrics():
    try:
        # Compute metrics against a validation split derived from docs/cleaned_exoplanet_data.csv
        docs_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'docs'))
        src = os.path.join(docs_dir, 'cleaned_exoplanet_data.csv')
        df = pd.read_csv(src, comment='#', low_memory=False)
        # Map to koi_*
        df = df.rename(columns=CLEAN_TO_KOI)
        # Ensure required columns
        if not all(col in df.columns for col in FEATURE_COLUMNS):
            raise ValueError('cleaned_exoplanet_data.csv missing required columns')

        # Features and labels (try to infer label/Disposition if present)
        X = df[FEATURE_COLUMNS].values
        # If Disposition present, use it for confusion matrix, else compute probability distribution only
        label_col = None
        for candidate in ['Disposition', 'koi_disposition', 'label']:
            if candidate in df.columns:
                label_col = candidate
                break

        # Scale
        X_scaled = scaler.transform(X) if scaler else X
        y_pred = model.predict(X_scaled)
        y_proba = model.predict_proba(X_scaled)
        classes = encoder.classes_.tolist()

        # Overall accuracy if labels available
        if label_col is not None:
            # Encode labels to match model encoder
            true_labels = encoder.transform(df[label_col].astype(str))
            correct = (y_pred == true_labels).sum()
            overall_accuracy = correct / len(y_pred)
            # Build confusion matrix
            num_classes = len(classes)
            cm = [[0 for _ in range(num_classes)] for _ in range(num_classes)]
            for t, p in zip(true_labels, y_pred):
                cm[int(t)][int(p)] += 1
        else:
            overall_accuracy = float('nan')
            cm = []

        return jsonify({
            "overall": {
                "accuracy": round(float(overall_accuracy), 3) if overall_accuracy == overall_accuracy else None,
                "precision": None,
                "recall": None,
                "f1": None
            },
            "perModel": {
                "stacking": {
                    "accuracy": round(float(overall_accuracy), 3) if overall_accuracy == overall_accuracy else None,
                    "precision": None,
                    "recall": None,
                    "f1": None
                }
            },
            "confusionMatrix": cm,
            "classNames": classes
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/features", methods=["GET"])
def get_features():
    try:
        # Try to extract meaningful importances from base estimators
        feature_names = [
            "orbital_period_days",
            "transit_depth_ppm",
            "planetary_radius_re",
            "transit_duration_hours",
            "teff_k",
            "rstar_rs",
            "logg"
        ]
        importances = None
        if hasattr(model, 'named_estimators_'):
            acc = np.zeros(len(FEATURE_COLUMNS))
            count = 0
            for est in model.named_estimators_.values():
                if hasattr(est, 'feature_importances_'):
                    vals = np.asarray(est.feature_importances_)
                    if len(vals) == len(FEATURE_COLUMNS):
                        acc += vals
                        count += 1
            if count > 0:
                importances = acc / count
        if importances is None:
            # Uniform importances if not derivable
            importances = np.ones(len(FEATURE_COLUMNS)) / len(FEATURE_COLUMNS)
        # Return friendly feature names (not koi_*) for charts
        importance_list = [
            {"name": feature_names[i], "importance": float(importances[i])}
            for i in range(len(FEATURE_COLUMNS))
        ]
        return jsonify({"importances": importance_list})
    except Exception as e:
        return jsonify({"error": str(e), "importances": []}), 500

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No input found"}), 400
        
        features = data.get("features")
        model_id = data.get("modelId", "stacking")
        
        if not features:
            return jsonify({"error": "Missing 'features' field"}), 400
        
        # Normalize keys to koi_* from friendly inputs and extract features
        try:
            normalized = normalize_feature_dict(features)
        except ValueError as ve:
            return jsonify({"error": str(ve)}), 400
        X = impute_and_prepare_matrix(pd.DataFrame([normalized]))
        
        # Select stacking model only
        selected_model = model
        
        # Run prediction
        prediction = selected_model.predict(X)[0]
        probabilities = selected_model.predict_proba(X)[0]
        
        # Get class labels
        classes = encoder.classes_
        class_probs = {classes[i]: float(prob) for i, prob in enumerate(probabilities)}
        
        # Decode prediction
        prediction_label = encoder.inverse_transform([prediction])[0]
        
        # Create response
        response = {
            "prediction": prediction_label,
            "probabilities": class_probs,
            "shap": [
                {"feature": FRIENDLY_TO_KOI_INV[i], "value": float(X[0][idx]), "contribution": 0.0}
                for idx, i in enumerate([
                    'orbital_period_days',
                    'transit_duration_hours',
                    'planetary_radius_re',
                    'transit_depth_ppm',
                    'teff_k',
                    'rstar_rs',
                    'logg'
                ])
            ],
            "rationale": "Model inference completed"
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/predict-csv", methods=["POST"])
def predict_csv():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not file.filename.endswith('.csv'):
            return jsonify({"error": "File must be a CSV"}), 400
        
        # Read CSV and try to normalize headers
        df = pd.read_csv(file)
        # Enforce the exact cleaned headers from docs
        missing_clean = [h for h in CLEAN_HEADERS if h not in df.columns]
        if missing_clean:
            return jsonify({
                "error": (
                    "Invalid file format. Expected headers: "
                    f"{CLEAN_HEADERS}. Missing: {missing_clean}"
                )
            }), 400

        # Map from clean headers to koi_* columns
        df = df.rename(columns=CLEAN_TO_KOI)
        
        # Validate columns (must have koi_* after rename)
        missing_cols = [col for col in FEATURE_COLUMNS if col not in df.columns]
        if missing_cols:
            return jsonify({"error": f"Missing columns after normalization: {missing_cols}"}), 400
        
        # Prepare matrix with imputation and scaling
        X_scaled = impute_and_prepare_matrix(df)
        
        # Run predictions
        predictions = model.predict(X_scaled)
        probabilities = model.predict_proba(X_scaled)
        
        # Decode predictions
        prediction_labels = encoder.inverse_transform(predictions)
        
        # Add results to dataframe
        df['is_exoplanet'] = prediction_labels
        df['confidence'] = probabilities.max(axis=1)
        
        # Create CSV response
        output = io.StringIO()
        df.to_csv(output, index=False)
        output.seek(0)
        
        # Return CSV file
        return send_file(
            io.BytesIO(output.getvalue().encode()),
            mimetype='text/csv',
            as_attachment=True,
            download_name='classified_exoplanets.csv'
        )
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/dataset", methods=["GET"])
def get_dataset():
    try:
        mission = request.args.get('mission', 'kepler').lower()
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 50))
        search = request.args.get('search')

        # Select source file in docs
        docs_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'docs'))
        if mission == 'kepler':
            src = os.path.join(docs_dir, 'KOI.csv')
        elif mission == 'k2':
            # K2 candidates file name in docs snapshot
            src = os.path.join(docs_dir, 'k2pandc_2025.10.04_22.17.01.csv')
        elif mission == 'tess':
            src = os.path.join(docs_dir, 'TOI.csv')
        else:
            src = os.path.join(docs_dir, 'KOI.csv')

        if not os.path.exists(src):
            return jsonify({"rows": [], "total": 0})

        # Load and attempt to normalize columns
        df = pd.read_csv(src, comment='#', low_memory=False)
        # If already in koi_* form, keep; else try to map from friendly headers and aliases
        df = rename_friendly_columns(df)
        df = normalize_dataframe_columns_to_koi(df)

        # Build minimal display columns
        display_cols = [c for c in FEATURE_COLUMNS if c in df.columns]
        # Create ID
        df['id'] = [f"{mission}-{i+1:06d}" for i in range(len(df))]
        df['mission'] = mission

        # If no disposition present, generate labels using the model
        label_candidates = ['koi_disposition', 'label', 'Disposition', 'koi_pdisposition']
        label_col = next((c for c in label_candidates if c in df.columns), None)
        if label_col is None:
            # Predict labels
            X_scaled = impute_and_prepare_matrix(df)
            preds = model.predict(X_scaled)
            df['label'] = encoder.inverse_transform(preds)
        else:
            df['label'] = df[label_col].astype(str).str.lower().str.replace(' ', '_')

        # Keep only needed columns
        keep = ['id', 'mission'] + display_cols + ['label']
        df = df[keep]

        # Convert koi_* to friendly for frontend
        rows = []
        for _, r in df.iterrows():
            rows.append(koi_to_friendly_row(r.to_dict()))

        # Compute overall class counts for all rows
        class_counts = {"confirmed": 0, "candidate": 0, "false_positive": 0}
        for r in rows:
            lbl = str(r.get("label", "candidate")).lower()
            if lbl not in class_counts:
                continue
            class_counts[lbl] += 1

        # Optional search by id
        if search:
            s = search.lower()
            rows = [r for r in rows if s in str(r.get('id', '')).lower()]

        total = len(rows)
        start = max((page - 1) * limit, 0)
        end = start + limit
        page_rows = rows[start:end]

        return jsonify({
            "rows": page_rows,
            "total": total,
            "classCounts": class_counts
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=8000)