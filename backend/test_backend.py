#!/usr/bin/env python3

import sys
import os

# Add the parent directory to the path to import model files
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    import joblib
    import numpy as np
    
    print("Testing model loading...")
    
    # Test loading models
    model = joblib.load("../model/exoai_stacking_model.pkl")
    print("[OK] Stacking model loaded successfully")
    
    scaler = joblib.load("../model/exoai_scaler.pkl")
    print("[OK] Scaler loaded successfully")
    
    encoder = joblib.load("../model/exoai_label_encoder.pkl")
    print("[OK] Label encoder loaded successfully")
    
    # Test prediction (7 features: koi_period, koi_duration, koi_prad, koi_depth, koi_steff, koi_srad, koi_slogg)
    test_features = np.array([[365.25, 13.5, 1.0, 1000, 5778, 1.0, 4.44]])
    X_scaled = scaler.transform(test_features)
    prediction = model.predict(X_scaled)[0]
    probability = model.predict_proba(X_scaled)[0]
    
    print(f"[OK] Test prediction: {encoder.inverse_transform([prediction])[0]}")
    print(f"[OK] Confidence: {probability.max():.3f}")
    
    print("\n[SUCCESS] All tests passed! Backend is ready to run.")
    
except Exception as e:
    print(f"[ERROR] {e}")
    sys.exit(1)
