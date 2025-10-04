# ExoAI: Exoplanet Discovery & Classification - Setup Guide

## 🚀 Quick Start

### Backend Setup (Python Flask API)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install Flask Flask-CORS joblib numpy pandas scikit-learn
   ```

3. **Start the backend server:**
   ```bash
   python back.py
   ```
   
   The API will be available at `http://localhost:8000`

### Frontend Setup (Next.js)

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   The frontend will be available at `http://localhost:3000`

## 🔧 Features

### Manual Classification
- Input exoplanet parameters manually
- Real-time classification with confidence scores
- SHAP explanations for interpretability

### CSV Batch Processing
- Upload CSV files with multiple exoplanet candidates
- Automatic classification of all entries
- Download results with new `is_exoplanet` and `confidence` columns

### CSV Format Requirements
Your CSV must contain these exact column names:
- `orbital_period_days`
- `transit_duration_hours` 
- `planetary_radius_re`
- `transit_depth_ppm`
- `teff_k`
- `rstar_rs`
- `logg`
- `feh`

### Sample CSV
Use `backend/sample_data.csv` as a template for testing.

## 🌐 API Endpoints

- `GET /health` - API health check
- `GET /models` - Available ML models
- `GET /metrics` - Model performance metrics
- `GET /features` - Feature importance rankings
- `POST /predict` - Single exoplanet classification
- `POST /predict-csv` - CSV batch classification
- `GET /dataset` - Sample dataset for exploration

## 🧪 Testing

1. **Test the backend:**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Test manual classification:**
   - Go to `http://localhost:3000/classify`
   - Use the "Manual Input" tab
   - Enter sample parameters and click "Classify"

3. **Test CSV upload:**
   - Go to `http://localhost:3000/classify`
   - Use the "CSV Upload" tab
   - Upload `backend/sample_data.csv`
   - Click "Process CSV" and download results

## 🔍 Troubleshooting

### Backend Issues
- Ensure all model files are in the `model/` directory
- Check that Python dependencies are installed
- Verify the backend is running on port 8000

### Frontend Issues
- Ensure Node.js dependencies are installed
- Check that the frontend is running on port 3000
- Verify the backend URL in `.env.local`

### Model Files
The following files must be present in the `model/` directory:
- `exoai_stacking_model.pkl`
- `exoai_scaler.pkl`
- `exoai_label_encoder.pkl`
- `exoai_adaboost_model.pkl`

## 📊 Model Performance

- **Stacking Ensemble**: 87% accuracy (recommended)
- **AdaBoost**: 82% accuracy
- Features: Orbital period, transit depth, planetary radius, and stellar parameters

## 🎯 Usage Examples

### Single Classification
```javascript
const response = await fetch('http://localhost:8000/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    features: {
      orbital_period_days: 365.25,
      transit_duration_hours: 13.5,
      planetary_radius_re: 1.0,
      transit_depth_ppm: 1000,
      teff_k: 5778,
      rstar_rs: 1.0,
      logg: 4.44,
      feh: 0.0
    }
  })
});
```

### CSV Upload
```javascript
const formData = new FormData();
formData.append('file', csvFile);
const response = await fetch('http://localhost:8000/predict-csv', {
  method: 'POST',
  body: formData
});
```

---

**Ready to discover exoplanets! 🪐✨**
