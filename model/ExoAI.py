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
        
    def load_data(self):
        """Load the KOI dataset"""
        # read koi csv file, skip comment lines starting with #
        self.koi_data = pd.read_csv('KOI.csv', comment='#', on_bad_lines='skip', low_memory=False)
        
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
            'Stellar Surface Gravity',
            'Stellar Metallicity'
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
            error_msg += f"  - Stellar Metallicity\n"
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
    
    def save_model(self):
        """Save trained model for future use"""
        print("\nSaving Model...")
        
        # serialize model and preprocessors to disk
        joblib.dump(self.model, "exoai_stacking_model.pkl")
        joblib.dump(self.scaler, "exoai_scaler.pkl")
        joblib.dump(self.label_encoder, "exoai_label_encoder.pkl")
        joblib.dump(self.best_threshold, "exoai_threshold.pkl")

        
        print("   Model saved successfully!")
    
    def create_visualizations(self, X_test, y_test, y_pred):
        # 1. Confusion Matrix
        cm = confusion_matrix(y_test, y_pred)
        plt.figure(figsize=(6,6))
        sns.heatmap(cm, annot=True, fmt="d", cmap="Blues")
        plt.xlabel("Predicted")
        plt.ylabel("Actual")
        plt.title("Confusion Matrix")
        plt.savefig('exoai_confusion_matrix.png', dpi=300, bbox_inches='tight')
        plt.show()

        # 2. Feature Importances
        plt.figure(figsize=(8,6))
        importances = self.model.feature_importances_
        indices = np.argsort(importances)[::-1]
        plt.bar(range(len(importances)), importances[indices])
        plt.xticks(range(len(importances)), np.array(X_test.columns)[indices], rotation=90)
        plt.title("Feature Importances")
        plt.savefig('exoai_feature_importances.png', dpi=300, bbox_inches='tight')
        plt.show()

        # 3. ROC Curve
        probs = self.model.predict_proba(X_test)[:, 1]
        fpr, tpr, _ = roc_curve(y_test, probs)
        roc_auc = auc(fpr, tpr)
        plt.figure(figsize=(6,6))
        plt.plot(fpr, tpr, label=f'ROC Curve (AUC = {roc_auc:.2f})')
        plt.plot([0,1],[0,1],'--', color='gray')
        plt.xlabel("False Positive Rate")
        plt.ylabel("True Positive Rate")
        plt.title("ROC Curve")
        plt.legend(loc="lower right")
        plt.savefig('exoai_roc_curve.png', dpi=300, bbox_inches='tight')
        plt.show()

        # 4. Precision-Recall Curve
        precision, recall, _ = precision_recall_curve(y_test, probs)
        ap = average_precision_score(y_test, probs)
        plt.figure(figsize=(6,6))
        plt.plot(recall, precision, label=f'PR Curve (AP = {ap:.2f})')
        plt.xlabel("Recall")
        plt.ylabel("Precision")
        plt.title("Precision-Recall Curve")
        plt.legend(loc="upper right")
        plt.savefig('exoai_pr_curve.png', dpi=300, bbox_inches='tight')
        plt.show()

        # 5. Classification Report Heatmap
        report = classification_report(y_test, y_pred, output_dict=True)
        sns.heatmap(pd.DataFrame(report).iloc[:-1, :].T, annot=True, cmap="Blues")
        plt.title("Classification Report Heatmap")
        plt.savefig('exoai_classification_report.png', dpi=300, bbox_inches='tight')
        plt.show()


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
    exoai.create_visualizations(X_test_scaled, y_test, results['predictions'])
    exoai.save_model()
    
    # demonstrate prediction on single example
    print("\n" + "="*60)
    print("Example Prediction:")
    
    print(f"\nExoAI Pipeline Complete!")
    print(f"Final Test Accuracy: {results['accuracy']:.4f}")

if __name__ == "__main__":
    main()