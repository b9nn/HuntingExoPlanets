"""
A Git Push to Mars Production:

ExoAI: Exoplanet Discovery and Classification
----------------------------------------------

A stacking ensemble machine learning system for classifying exoplanet candidates.
Built for NASA Space Apps Challenge using Kepler Objects of Interest (KOI) dataset.

Authors: Ben Gladney, Armaan Gupta
Date: October, 2025
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier, ExtraTreesClassifier, StackingClassifier
from sklearn.metrics import roc_curve, auc, precision_recall_curve, average_precision_score
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, f1_score
import joblib


class ExoAI:
    """
    ExoAI: Exoplanet Classification System using Stacking Ensemble on KOI Dataset
    """
    
    def __init__(self):
        # initialize storage for model components
        self.model = None
        self.scaler = None
        self.label_encoder = None
        self.feature_names = []
        
    def load_data(self, csv_path='../docs/KOI.csv'):
        """Load the KOI dataset"""
        # read koi csv file, skip comment lines starting with #
        self.koi_data = pd.read_csv(csv_path, comment='#', on_bad_lines='skip', low_memory=False)
        
        print(f"\nLoaded KOI: {len(self.koi_data)} rows, {len(self.koi_data.columns)} columns")
        
        return self.koi_data
    
    def preprocess_data(self):
        """Clean and preprocess the KOI data"""
        # define required features with descriptive names
        required_features = [
            'Orbital Period',
            'Planetary Radius',
            'Transit Duration',
            'Transit Depth',
            'Stellar Effective Temperature',
            'Stellar Radius',
            'Stellar Surface Gravity'
        ]
        
        label_col = 'koi_disposition'

        # validate that all required columns are present
        missing_columns = [col for col in required_features if col not in self.koi_data.columns]
        
        if missing_columns:
            error_msg = f"\nERROR: Missing required columns in CSV file:\n"
            for col in missing_columns:
                error_msg += f"  - {col}\n"
            error_msg += f"\nRequired columns:\n"
            error_msg += f"  - Orbital Period\n"
            error_msg += f"  - Planetary Radius\n"
            error_msg += f"  - Transit Duration\n"
            error_msg += f"  - Transit Depth\n"
            error_msg += f"  - Stellar Effective Temperature\n"
            error_msg += f"  - Stellar Radius\n"
            error_msg += f"  - Stellar Surface Gravity\n"
            raise ValueError(error_msg)
        
        # extract only the required features (ignore all other columns)
        X = self.koi_data[required_features].copy()
        X = X.select_dtypes(include=[np.number]).fillna(X.select_dtypes(include=[np.number]).median())
        
        # extract labels
        y = self.koi_data[label_col]
        
        # remove rows with missing labels
        valid_indices = ~y.isna()
        X = X[valid_indices]
        y = y[valid_indices]
        
        print(f"\nKOI Dataset: {X.shape[0]} samples, {X.shape[1]} features")
        print(f"Using required columns: {', '.join(required_features)}")
        
        return X, y
    
    def create_stacking_model(self):
        """Create the stacking ensemble model"""
        print("\nCreating Stacking Ensemble Model...")
        
        # define base estimators: random forest, extra trees, and svm
        base_estimators = [
            ('rf', RandomForestClassifier(n_estimators=100, random_state=42)),
            ('et', ExtraTreesClassifier(n_estimators=100, random_state=42)),
            ('svm', SVC(probability=True, random_state=42))
        ]
        
        # create stacking classifier with logistic regression as meta-learner
        self.model = StackingClassifier(
            estimators=base_estimators,
            final_estimator=LogisticRegression(max_iter=1000, random_state=42),
            cv=3
        )
        
        print("   Stacking model created with:")
        print("   - Base: Random Forest, Extra Trees, SVM")
        print("   - Meta: Logistic Regression")
        
        return self.model
    
    def train_model(self, X_train, y_train, X_val, y_val):
        """Train stacking model with hyperparameter tuning"""
        print("\nTraining Stacking Ensemble...")
        
        # define hyperparameter search space for base estimators
        param_grid = {
            'rf__n_estimators': [50, 100],
            'rf__max_depth': [10, 15, None],
            'et__n_estimators': [50, 100],
            'et__max_depth': [10, 15, None],
            'svm__C': [0.1, 1.0],
            'svm__kernel': ['rbf']
        }
        
        # perform grid search with cross-validation
        grid_search = GridSearchCV(
            self.model, 
            param_grid, 
            cv=3, 
            scoring='accuracy',
            verbose=1
        )
        
        grid_search.fit(X_train, y_train)
        self.model = grid_search.best_estimator_
        
        print(f"\nBest parameters: {grid_search.best_params_}")
        
        # evaluate on validation set
        y_pred = self.model.predict(X_val)
        accuracy = accuracy_score(y_val, y_pred)
        print(f"Validation Accuracy: {accuracy:.4f}")
        
        return accuracy
    
    def tune_threshold(self, X_val, y_val):
        """Optimize classification threshold on validation data"""
        print("\nTuning classification threshold...")
        probs = self.model.predict_proba(X_val)[:, 1]  # class 1 probabilities
        best_thresh, best_acc = 0.5, 0

        for t in np.linspace(0.1, 0.9, 81):
            preds = (probs > t).astype(int)
            acc = accuracy_score(y_val, preds)
            if acc > best_acc:
                best_thresh, best_acc = t, acc

        self.best_threshold = best_thresh
        print(f"   Best threshold: {best_thresh:.2f} (Accuracy: {best_acc:.4f})")
        return best_thresh, best_acc

    def evaluate_model(self, X_test, y_test):
        """Evaluate model with tuned threshold"""
        print("\n" + "="*60)
        print("Stacking Model Evaluation Results (with tuned threshold):")
        print("="*60)

        probs = self.model.predict_proba(X_test)[:, 1]
        y_pred = (probs > self.best_threshold).astype(int)

        accuracy = accuracy_score(y_test, y_pred)
        print(f"\nTest Accuracy: {accuracy:.4f}")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred))

        cm = confusion_matrix(y_test, y_pred)
        print("\nConfusion Matrix:")
        print(cm)

        return {
            'accuracy': accuracy,
            'predictions': y_pred,
            'confusion_matrix': cm
        }

    def predict_exoplanet(self, features):
        """Make prediction for a new exoplanet candidate with tuned threshold"""
        probs = self.model.predict_proba([features])[0]
        prediction = 1 if probs[1] > self.best_threshold else 0

        print("\nPredicting Exoplanet Classification...")
        print(f"Prediction: {prediction}")
        print(f"Confidence: {max(probs):.3f}")
        return prediction, probs
    
    def save_model(self, output_dir='../model'):
        """Save trained model for future use"""
        print("\nSaving Model...")
        
        # serialize model and preprocessors to disk
        import os
        os.makedirs(output_dir, exist_ok=True)
        
        joblib.dump(self.model, f"{output_dir}/exoai_stacking_model.pkl")
        joblib.dump(self.scaler, f"{output_dir}/exoai_scaler.pkl")
        joblib.dump(self.label_encoder, f"{output_dir}/exoai_label_encoder.pkl")
        joblib.dump(self.best_threshold, f"{output_dir}/exoai_threshold.pkl")
        
        print(f"   Model saved successfully to {output_dir}/")
    
    def create_visualizations(self, X_test, y_test, y_pred, output_dir='../docs'):
        """Create comprehensive visualizations"""
        print("\nCreating Visualizations...")
        
        import os
        os.makedirs(output_dir, exist_ok=True)
        
        fig = plt.figure(figsize=(12, 5))
        
        # plot confusion matrix heatmap
        plt.subplot(1, 2, 1)
        cm = confusion_matrix(y_test, y_pred)
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', cbar_kws={'label': 'Count'})
        plt.title('Confusion Matrix - Stacking Ensemble')
        plt.ylabel('True Label')
        plt.xlabel('Predicted Label')
        
        # plot top 10 feature importances from Random Forest base estimator
        plt.subplot(1, 2, 2)
        rf_model = self.model.named_estimators_['rf']
        importance = rf_model.feature_importances_
        
        top_indices = np.argsort(importance)[-10:]
        top_features = [self.feature_names[i] for i in top_indices]
        top_importance = importance[top_indices]
        
        plt.barh(range(len(top_features)), top_importance, color='steelblue')
        plt.yticks(range(len(top_features)), top_features)
        plt.title('Top Feature Importance (Random Forest)')
        plt.xlabel('Importance')
        
        plt.tight_layout()
        output_path = f'{output_dir}/exoai_stacking_analysis.png'
        plt.savefig(output_path, dpi=300, bbox_inches='tight')
        plt.close()
        
        print(f"   Visualizations saved to {output_path}")


def main():
    """Main ExoAI pipeline"""
    print("ExoAI: Exoplanet Discovery and Classification System")
    print("Stacking Ensemble Classifier - KOI Dataset")
    print("="*60)
    
    # initialize exoai system
    exoai = ExoAI()
    
    # load and preprocess koi dataset
    koi_data = exoai.load_data()
    X, y = exoai.preprocess_data()
    
    # encode categorical labels to numerical format
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)
    exoai.label_encoder = le
    
    # split data: 70% train, 15% validation, 15% test
    X_train, X_temp, y_train, y_temp = train_test_split(
        X, y_encoded, test_size=0.3, random_state=42, stratify=y_encoded
    )
    X_val, X_test, y_val, y_test = train_test_split(
        X_temp, y_temp, test_size=0.5, random_state=42, stratify=y_temp
    )
    
    exoai.feature_names = list(X.columns)
    
    # standardize features using z-score normalization
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_val_scaled = scaler.transform(X_val)
    X_test_scaled = scaler.transform(X_test)
    exoai.scaler = scaler
    
    # build and train stacking ensemble
    exoai.create_stacking_model()
    val_accuracy = exoai.train_model(X_train_scaled, y_train, X_val_scaled, y_val)
    
    # tune threshold before evaluation
    exoai.tune_threshold(X_val_scaled, y_val)
    
    # evaluate on test set
    results = exoai.evaluate_model(X_test_scaled, y_test)
    
    # create visualizations and save model
    exoai.create_visualizations(X_test, y_test, results['predictions'])
    exoai.save_model()
    
    # demonstrate prediction on single example
    print("\n" + "="*60)
    print("Example Prediction:")
    
    print(f"\nExoAI Pipeline Complete!")
    print(f"Final Test Accuracy: {results['accuracy']:.4f}")

if __name__ == "__main__":
    main()