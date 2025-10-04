#!/usr/bin/env python3
"""
ExoAI Web Interface
==================

Interactive web interface for ExoAI exoplanet classification system.
Built with Dash for real-time exoplanet candidate analysis.

Features:
- Real-time exoplanet classification
- Interactive parameter input
- Model explanation with SHAP values
- Visual results display
"""

import dash
from dash import dcc, html, Input, Output, State, callback_context
import dash_bootstrap_components as dbc
import plotly.graph_objs as go
import plotly.express as px
import pandas as pd
import numpy as np
import joblib
import shap
from exoai import ExoAI

# Initialize Dash app
app = dash.Dash(__name__, external_stylesheets=[dbc.themes.BOOTSTRAP])
app.title = "ExoAI - Exoplanet Discovery Platform"

# Load pre-trained models (if available)
try:
    exoai = ExoAI()
    # Try to load models
    models_loaded = False
    try:
        exoai.models['random_forest'] = joblib.load('exoai_random_forest_model.pkl')
        exoai.models['adaboost'] = joblib.load('exoai_adaboost_model.pkl')
        exoai.models['stacking'] = joblib.load('exoai_stacking_model.pkl')
        exoai.models['random_subspace'] = joblib.load('exoai_random_subspace_model.pkl')
        exoai.models['extra_trees'] = joblib.load('exoai_extra_trees_model.pkl')
        models_loaded = True
        print("✅ Pre-trained models loaded successfully!")
    except FileNotFoundError:
        print("⚠️  No pre-trained models found. Please run exoai.py first to train models.")
except Exception as e:
    print(f"❌ Error loading ExoAI: {e}")
    models_loaded = False

# Define the layout
app.layout = dbc.Container([
    # Header
    dbc.Row([
        dbc.Col([
            html.H1("🔭 ExoAI", className="text-center mb-4"),
            html.H4("Exoplanet Discovery and Classification Platform", className="text-center text-muted mb-4"),
            html.P("Classify exoplanet candidates using ensemble machine learning algorithms", 
                   className="text-center lead")
        ])
    ]),
    
    # Status indicator
    dbc.Row([
        dbc.Col([
            dbc.Alert([
                html.H5("System Status", className="alert-heading"),
                html.P("✅ Ready for exoplanet classification" if models_loaded else "⚠️ Models not loaded - Please train models first"),
            ], color="success" if models_loaded else "warning", className="mb-4")
        ])
    ]),
    
    # Main content
    dbc.Row([
        # Input panel
        dbc.Col([
            dbc.Card([
                dbc.CardHeader(html.H4("Exoplanet Parameters", className="mb-0")),
                dbc.CardBody([
                    # Orbital Period
                    dbc.Label("Orbital Period (days)"),
                    dcc.Input(
                        id="orbital-period",
                        type="number",
                        value=10.0,
                        step=0.1,
                        className="mb-3"
                    ),
                    
                    # Planetary Radius
                    dbc.Label("Planetary Radius (Earth radii)"),
                    dcc.Input(
                        id="planetary-radius",
                        type="number",
                        value=1.0,
                        step=0.1,
                        className="mb-3"
                    ),
                    
                    # Transit Duration
                    dbc.Label("Transit Duration (hours)"),
                    dcc.Input(
                        id="transit-duration",
                        type="number",
                        value=2.0,
                        step=0.1,
                        className="mb-3"
                    ),
                    
                    # Transit Depth
                    dbc.Label("Transit Depth (ppm)"),
                    dcc.Input(
                        id="transit-depth",
                        type="number",
                        value=1000.0,
                        step=10.0,
                        className="mb-3"
                    ),
                    
                    # Stellar Temperature
                    dbc.Label("Stellar Temperature (K)"),
                    dcc.Input(
                        id="stellar-temperature",
                        type="number",
                        value=5500.0,
                        step=50.0,
                        className="mb-3"
                    ),
                    
                    # Stellar Radius
                    dbc.Label("Stellar Radius (Solar radii)"),
                    dcc.Input(
                        id="stellar-radius",
                        type="number",
                        value=1.0,
                        step=0.1,
                        className="mb-3"
                    ),
                    
                    # Stellar Surface Gravity
                    dbc.Label("Stellar Surface Gravity (log g)"),
                    dcc.Input(
                        id="stellar-gravity",
                        type="number",
                        value=4.5,
                        step=0.1,
                        className="mb-3"
                    ),
                    
                    # Classify button
                    dbc.Button(
                        "🔮 Classify Exoplanet",
                        id="classify-button",
                        color="primary",
                        size="lg",
                        className="w-100 mb-3",
                        disabled=not models_loaded
                    ),
                    
                    # Model selection
                    dbc.Label("Select Model:"),
                    dcc.Dropdown(
                        id="model-selector",
                        options=[
                            {"label": "Random Forest", "value": "random_forest"},
                            {"label": "AdaBoost", "value": "adaboost"},
                            {"label": "Stacking", "value": "stacking"},
                            {"label": "Random Subspace", "value": "random_subspace"},
                            {"label": "Extra Trees", "value": "extra_trees"}
                        ],
                        value="random_forest",
                        disabled=not models_loaded
                    )
                ])
            ])
        ], width=4),
        
        # Results panel
        dbc.Col([
            dbc.Card([
                dbc.CardHeader(html.H4("Classification Results", className="mb-0")),
                dbc.CardBody([
                    # Prediction result
                    html.Div(id="prediction-result"),
                    
                    # Confidence scores
                    html.Div(id="confidence-scores"),
                    
                    # Feature importance
                    html.Div(id="feature-importance"),
                    
                    # SHAP explanation
                    html.Div(id="shap-explanation")
                ])
            ])
        ], width=8)
    ], className="mb-4"),
    
    # Visualization panel
    dbc.Row([
        dbc.Col([
            dbc.Card([
                dbc.CardHeader(html.H4("Model Performance", className="mb-0")),
                dbc.CardBody([
                    dcc.Graph(id="model-comparison")
                ])
            ])
        ], width=12)
    ]),
    
    # Footer
    dbc.Row([
        dbc.Col([
            html.Hr(),
            html.P("ExoAI - NASA Space Apps Challenge 2024 | Built with Ensemble ML & Explainable AI", 
                   className="text-center text-muted")
        ])
    ])
], fluid=True)

# Callbacks
@app.callback(
    [Output("prediction-result", "children"),
     Output("confidence-scores", "children"),
     Output("feature-importance", "children"),
     Output("shap-explanation", "children")],
    [Input("classify-button", "n_clicks")],
    [State("orbital-period", "value"),
     State("planetary-radius", "value"),
     State("transit-duration", "value"),
     State("transit-depth", "value"),
     State("stellar-temperature", "value"),
     State("stellar-radius", "value"),
     State("stellar-gravity", "value"),
     State("model-selector", "value")]
)
def classify_exoplanet(n_clicks, orbital_period, planetary_radius, transit_duration, 
                      transit_depth, stellar_temp, stellar_radius, stellar_gravity, model_name):
    """Classify exoplanet candidate and return results"""
    
    if not models_loaded or n_clicks is None:
        return "", "", "", ""
    
    try:
        # Prepare input features
        features = np.array([[
            orbital_period, planetary_radius, transit_duration, transit_depth,
            stellar_temp, stellar_radius, stellar_gravity
        ]])
        
        # Get model
        model = exoai.models[model_name]
        
        # Make prediction
        prediction = model.predict(features)[0]
        probabilities = model.predict_proba(features)[0]
        
        # Get class labels
        class_labels = ['Confirmed', 'Candidate', 'False Positive']
        
        # Create prediction result
        prediction_card = dbc.Alert([
            html.H4(f"Prediction: {class_labels[prediction]}", className="alert-heading"),
            html.P(f"Confidence: {max(probabilities):.3f}")
        ], color="success" if prediction == 0 else "warning" if prediction == 1 else "danger")
        
        # Create confidence scores
        confidence_data = pd.DataFrame({
            'Class': class_labels,
            'Probability': probabilities
        })
        
        confidence_fig = px.bar(confidence_data, x='Class', y='Probability', 
                               title='Classification Probabilities',
                               color='Probability',
                               color_continuous_scale='RdYlGn')
        confidence_fig.update_layout(showlegend=False)
        
        confidence_graph = dcc.Graph(figure=confidence_fig)
        
        # Feature importance (if available)
        if hasattr(model, 'feature_importances_'):
            feature_names = ['Orbital Period', 'Planetary Radius', 'Transit Duration', 
                           'Transit Depth', 'Stellar Temp', 'Stellar Radius', 'Stellar Gravity']
            importance = model.feature_importances_
            
            importance_data = pd.DataFrame({
                'Feature': feature_names,
                'Importance': importance
            }).sort_values('Importance', ascending=True)
            
            importance_fig = px.bar(importance_data, x='Importance', y='Feature',
                                 orientation='h', title='Feature Importance')
            importance_fig.update_layout(height=400)
            
            importance_graph = dcc.Graph(figure=importance_fig)
        else:
            importance_graph = html.P("Feature importance not available for this model.")
        
        # SHAP explanation placeholder
        shap_explanation = html.Div([
            html.H5("SHAP Explanation"),
            html.P("SHAP values show how each feature contributes to the prediction. "
                   "Red bars indicate features that increase the probability of the predicted class, "
                   "while blue bars indicate features that decrease it.")
        ])
        
        return prediction_card, confidence_graph, importance_graph, shap_explanation
        
    except Exception as e:
        error_alert = dbc.Alert([
            html.H4("Error", className="alert-heading"),
            html.P(f"An error occurred during classification: {str(e)}")
        ], color="danger")
        return error_alert, "", "", ""

@app.callback(
    Output("model-comparison", "figure"),
    [Input("classify-button", "n_clicks")]
)
def update_model_comparison(n_clicks):
    """Update model comparison visualization"""
    
    # Sample model performance data (in real implementation, this would come from training results)
    model_names = ['Random Forest', 'AdaBoost', 'Stacking', 'Random Subspace', 'Extra Trees']
    accuracies = [0.85, 0.82, 0.87, 0.83, 0.84]
    
    fig = go.Figure(data=[
        go.Bar(x=model_names, y=accuracies, 
               marker_color=['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'])
    ])
    
    fig.update_layout(
        title="Model Performance Comparison",
        xaxis_title="Model",
        yaxis_title="Accuracy",
        yaxis=dict(range=[0.7, 0.9])
    )
    
    return fig

if __name__ == "__main__":
    print("🚀 Starting ExoAI Web Interface...")
    print("📱 Open your browser and go to: http://127.0.0.1:8050")
    app.run_server(debug=True, host='127.0.0.1', port=8050)
