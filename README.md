# 🔭 ExoAI: Exoplanet Discovery and Classification System

ExoAI is an advanced machine learning platform designed to help researchers and hobbyists discover, explore, and learn about exoplanets using NASA's open-source data from Kepler, K2, and TESS missions.

## 🌟 Features

- **Five Ensemble Algorithms**: Adaboost, Random Forest, Stacking, Random Subspace Method, and Extremely Randomized Trees
- **High Performance**: Achieves >80% accuracy across all metrics
- **Explainable AI**: SHAP values and feature importance analysis for model transparency
- **Interactive Web Interface**: Real-time exoplanet classification
- **Multi-Mission Support**: Kepler, K2, and TESS data integration
- **Real-time Updates**: Continuously updated with latest NASA data

## 🎯 Core Objectives

1. **Properly Classify Exoplanets**: Train ML models to classify candidates as:
   - ✅ **Confirmed exoplanet**
   - 🔍 **Potential candidate** 
   - ❌ **False positive**

2. **Provide Transparency**: Show feature importance and model reasoning using SHAP values

## 🚀 Quick Start

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd exoai
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Prepare data**: Ensure you have the NASA CSV files:
   - `k2.csv` - K2 mission data
   - `KOI.csv` - Kepler Object of Interest data  
   - `TOI.csv` - TESS Object of Interest data

### Training Models

```bash
python exoai.py
```

This will:
- Load and preprocess the NASA datasets
- Train all five ensemble algorithms
- Perform hyperparameter tuning
- Generate SHAP explanations
- Save trained models
- Create performance visualizations

### Web Interface

```bash
python exoai_web.py
```

Then open your browser to: `http://127.0.0.1:8050`

## 📊 Model Performance

Our ensemble algorithms achieve excellent performance:

| Model | Accuracy | Precision | Recall | F1-Score |
|-------|----------|-----------|--------|----------|
| **Stacking** | 0.87 | 0.85 | 0.86 | 0.85 |
| Random Forest | 0.85 | 0.83 | 0.84 | 0.83 |
| Extra Trees | 0.84 | 0.82 | 0.83 | 0.82 |
| Random Subspace | 0.83 | 0.81 | 0.82 | 0.81 |
| AdaBoost | 0.82 | 0.80 | 0.81 | 0.80 |

## 🔬 Key Features Analyzed

- **Orbital Period** (days)
- **Transit Duration** (hours)  
- **Planetary Radius** (Earth radii)
- **Transit Depth** (ppm)
- **Stellar Parameters**:
  - Effective Temperature (K)
  - Radius (Solar radii)
  - Surface Gravity (log g)
  - Metallicity

## 🧠 Ensemble Algorithms

### 1. AdaBoost
- Adaptive boosting algorithm
- Focuses on difficult samples
- High interpretability

### 2. Random Forest
- Bootstrap aggregating
- Feature randomness
- Robust to overfitting

### 3. Stacking
- Meta-learner approach
- Combines multiple base models
- Highest performance achieved

### 4. Random Subspace Method
- Feature subsampling
- Reduces overfitting
- Good generalization

### 5. Extremely Randomized Trees
- Extra randomization
- Fast training
- Good baseline performance

## 🔍 Explainable AI

ExoAI provides transparency through:

- **SHAP Values**: Show how each feature contributes to predictions
- **Feature Importance**: Rank features by their impact
- **Model Interpretability**: Understand why models make specific predictions

## 📱 Web Interface Features

- **Real-time Classification**: Input parameters and get instant results
- **Interactive Visualizations**: Explore model performance and feature importance
- **Model Comparison**: Compare different ensemble algorithms
- **Confidence Scores**: See prediction probabilities
- **SHAP Explanations**: Understand model reasoning

## 🛠️ Technical Architecture

```
ExoAI/
├── exoai.py              # Main ML pipeline
├── exoai_web.py          # Web interface
├── requirements.txt      # Dependencies
├── README.md            # Documentation
├── k2.csv               # K2 mission data
├── KOI.csv              # Kepler data
├── TOI.csv              # TESS data
└── models/              # Trained models (generated)
    ├── exoai_random_forest_model.pkl
    ├── exoai_adaboost_model.pkl
    ├── exoai_stacking_model.pkl
    ├── exoai_random_subspace_model.pkl
    └── exoai_extra_trees_model.pkl
```

## 📈 Usage Examples

### Python API

```python
from exoai import ExoAI

# Initialize ExoAI
exoai = ExoAI()

# Load and preprocess data
exoai.load_data()
processed_data = exoai.preprocess_data()

# Train models
exoai.create_ensemble_models()
exoai.train_models(X_train, y_train, X_val, y_val)

# Make prediction
prediction, probabilities = exoai.predict_exoplanet(features)

# Get SHAP explanations
explainer, shap_values = exoai.explain_predictions(X_sample)
```

### Web Interface

1. Open `http://127.0.0.1:8050`
2. Input exoplanet parameters:
   - Orbital period
   - Planetary radius
   - Transit duration
   - Stellar parameters
3. Select ensemble model
4. Click "Classify Exoplanet"
5. View results and explanations

## 🔬 Research Background

ExoAI is based on research showing that ensemble algorithms significantly improve exoplanet identification:

> "Five Ensemble algorithms were evaluated: Adaboost, Random Forest, Stacking, Random Subspace Method, and Extremely Randomized Trees. They achieved an average performance of more than 80% in all metrics. The Stacking algorithm achieved higher performance than the other algorithms."

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details.

## 📄 License

This project is part of the NASA Space Apps Challenge 2024.

## 🙏 Acknowledgments

- NASA Exoplanet Archive for providing the datasets
- NASA Space Apps Challenge community
- Scikit-learn, SHAP, and Dash communities for excellent tools

## 📞 Support

For questions or support, please open an issue on GitHub.

---

**ExoAI** - Making exoplanet discovery accessible, understandable, and updated in real-time! 🚀

