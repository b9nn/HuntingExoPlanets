# 🔭 ExoAI: Exoplanet Discovery and Classification System

ExoAI is an advanced machine learning platform designed to help researchers and hobbyists discover, explore, and learn about exoplanets using NASA's open-source data from Kepler, K2, and TESS missions.

## 🌟 Features

- **Five Ensemble Algorithms**: Adaboost, Random Forest, Stacking, Random Subspace Method, and Extremely Randomized Trees
- **High Performance**: Achieves >80% accuracy across all metrics
- **Explainable AI**: SHAP values and feature importance analysis for model transparency
- **Interactive Web Interface**: Real-time exoplanet classification
- **Multi-Mission Support**: Kepler, K2, and TESS data integration

## 🎯 Core Objectives

1. **Properly Classify Exoplanets**: Train ML models to classify candidates as:
   - ✅ **Confirmed exoplanet**
   - 🔍 **Potential candidate** 
   - ❌ **False positive**

2. **Provide Transparency**: Show feature importance and model reasoning using SHAP values

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

## 📱 Web Interface Features

- **Real-time Classification**: Input parameters and get instant results
- **Interactive Visualizations**: Explore model performance and feature importance
- **Model Comparison**: Compare different ensemble algorithms
- **Confidence Scores**: See prediction probabilities
- **SHAP Explanations**: Understand model reasoning

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

This project is part of the NASA Space Apps Challenge 2024.

## 🙏 Acknowledgments

- NASA Exoplanet Archive for providing the datasets
- NASA Space Apps Hackathon
- Scikit-learn for excellent tools

## 📞 Support

For questions or support, please open an issue on GitHub.

---

**ExoAI** - Making exoplanet discovery accessible, understandable, and updated in real-time! 🚀

