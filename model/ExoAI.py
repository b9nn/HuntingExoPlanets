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
from sklearn.ensemble import RandomForestClassifier, ExtraTreesClassifier, StackingClassifier, GradientBoostingClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, f1_score
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
import joblib
import os


class ExoAI:
    """
    ExoAI: Exoplanet Classification System using Stacking Ensemble on KOI Dataset
    """
    
    def __init__(self, low_compute=True):
        self.model = None
        self.scaler = None
        self.label_encoder = None
        self.feature_names = []
        self.low_compute = low_compute  # switch for lightweight training
        
    def load_data(self, csv_path='../docs/KOI.csv'):
        """Load the KOI dataset"""
        self.koi_data = pd.read_csv(csv_path, comment='#', on_bad_lines='skip', low_memory=False)
        print(f"\nLoaded KOI: {len(self.koi_data)} rows, {len(self.koi_data.columns)} columns")
        return self.koi_data
    
    def preprocess_data(self):
        """Clean and preprocess the KOI data"""
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
        missing_columns = [col for col in required_features if col not in self.koi_data.columns]
        if missing_columns:
            raise ValueError(f"Missing required columns: {missing_columns}")
        
        X = self.koi_data[required_features].copy()
        X = X.select_dtypes(include=[np.number]).fillna(X.median(numeric_only=True))
        y = self.koi_data[label_col]
        
        valid_indices = ~y.isna()
        X = X[valid_indices]
        y = y[valid_indices]

        # downsample if in low compute mode
        if self.low_compute:
            X = X.sample(frac=0.1, random_state=42)
            y = y.loc[X.index]
        
        print(f"\nKOI Dataset: {X.shape[0]} samples, {X.shape[1]} features")
        return X, y
    
    def create_stacking_model(self):
        """Create the stacking ensemble model"""
        print("\nCreating Stacking Ensemble...")
        
        # lighter estimators if low_compute
        n_est = 50 if self.low_compute else 200
        base_estimators = [
            ('rf', RandomForestClassifier(n_estimators=n_est, random_state=42)),
            ('et', ExtraTreesClassifier(n_estimators=n_est, random_state=42)),
            ('gb', GradientBoostingClassifier(n_estimators=n_est, random_state=42)),
            ('svm', SVC(probability=True, random_state=42)),
            ('nb', GaussianNB())
        ]
        
        self.model = StackingClassifier(
            estimators=base_estimators,
            final_estimator=LogisticRegression(max_iter=2000, random_state=42),
            cv=3 if self.low_compute else 5
        )
        
        return self.model
    
    def train_model(self, X_train, y_train, X_val, y_val):
        """Train stacking model"""
        if self.low_compute:
            print("\n[Light Mode] Training without GridSearch...")
            self.model.fit(X_train, y_train)
        else:
            print("\n[Full Mode] Training with GridSearchCV...")
            param_grid = {
                'rf__n_estimators': [200],
                'rf__max_depth': [20],
                'et__n_estimators': [200],
                'gb__n_estimators': [200],
                'gb__learning_rate': [0.1],
                'svm__C': [1.0],
            }
            grid_search = GridSearchCV(
                self.model, param_grid,
                cv=3, scoring='accuracy',
                n_jobs=1 if self.low_compute else -1,
                verbose=1
            )
            grid_search.fit(X_train, y_train)
            self.model = grid_search.best_estimator_
        
        y_pred = self.model.predict(X_val)
        accuracy = accuracy_score(y_val, y_pred)
        f1 = f1_score(y_val, y_pred, average='weighted')
        print(f"\nValidation Accuracy: {accuracy:.4f}")
        print(f"Validation F1-Score: {f1:.4f}")
        return accuracy
    
    def evaluate_model(self, X_test, y_test):
        """Evaluate model on test set"""
        print("\n" + "="*60)
        print("Evaluation Results")
        print("="*60)
        
        y_pred = self.model.predict(X_test)
        acc = accuracy_score(y_test, y_pred)
        print(f"Test Accuracy: {acc:.4f}")
        print(classification_report(y_test, y_pred))
        
        cm = confusion_matrix(y_test, y_pred, labels=np.unique(y_test))
        print("Confusion Matrix:\n", cm)
        return {'accuracy': acc, 'predictions': y_pred, 'confusion_matrix': cm}
    
    def save_model(self, output_dir='../model'):
        """Save trained model"""
        os.makedirs(output_dir, exist_ok=True)
        joblib.dump(self.model, f"{output_dir}/exoai_stacking_model.pkl")
        joblib.dump(self.scaler, f"{output_dir}/exoai_scaler.pkl")
        joblib.dump(self.label_encoder, f"{output_dir}/exoai_label_encoder.pkl")
        print(f"\nModel saved to {output_dir}/")
        

def main():
    print("ExoAI: Exoplanet Discovery and Classification")
    print("="*60)
    
    # ⚡ switch here: low_compute=True for local, False for full run
    exoai = ExoAI(low_compute=True)
    
    # load + preprocess
    exoai.load_data()
    X, y = exoai.preprocess_data()
    
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)
    exoai.label_encoder = le
    
    X_train, X_temp, y_train, y_temp = train_test_split(X, y_encoded, test_size=0.3, stratify=y_encoded, random_state=42)
    X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, stratify=y_temp, random_state=42)
    
    exoai.feature_names = list(X.columns)
    
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_val = scaler.transform(X_val)
    X_test = scaler.transform(X_test)
    exoai.scaler = scaler
    
    # train + evaluate
    exoai.create_stacking_model()
    exoai.train_model(X_train, y_train, X_val, y_val)
    results = exoai.evaluate_model(X_test, y_test)
    exoai.save_model()
    
    print(f"\nPipeline Complete! Final Test Accuracy: {results['accuracy']:.4f}")


if __name__ == "__main__":
    main()
