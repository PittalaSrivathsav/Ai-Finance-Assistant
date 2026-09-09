import os
import re
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, 'data', 'raw_transactions.csv')
MODELS_DIR = os.path.join(BASE_DIR, 'saved_models')
os.makedirs(MODELS_DIR, exist_ok=True)

def preprocess_text(text: str) -> str:
    """Preprocesses a transaction description for ML categorization."""
    if not isinstance(text, str):
        return ""
    text = text.lower()
    # Remove special punctuation and digits
    text = re.sub(r'[^a-zA-Z\s]', ' ', text)
    # Remove extra spaces
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def train_model():
    print(f"Loading dataset from {DATA_PATH}...")
    df = pd.read_csv(DATA_PATH)
    
    # Preprocessing
    df['cleaned_description'] = df['description'].apply(preprocess_text)
    
    X = df['cleaned_description']
    y = df['category']
    
    print(f"Dataset summary: {len(df)} records across {y.nunique()} categories.")
    print("Categories:", df['category'].unique())

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Feature extraction via TF-IDF
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=2500,
        sublinear_tf=True
    )
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    # Train Classifier
    classifier = LogisticRegression(
        C=2.0,
        max_iter=1000,
        random_state=42
    )
    classifier.fit(X_train_vec, y_train)

    # Evaluation
    y_pred = classifier.predict(X_test_vec)
    acc = accuracy_score(y_test, y_pred)
    print("\n--- Model Evaluation Results ---")
    print(f"Accuracy: {acc * 100:.2f}%\n")
    print("Classification Report:")
    print(classification_report(y_test, y_pred, zero_division=0))

    # Retrain on full dataset for maximum real-world inference coverage
    X_full_vec = vectorizer.fit_transform(X)
    classifier.fit(X_full_vec, y)

    # Save models
    vec_path = os.path.join(MODELS_DIR, 'tfidf_vectorizer.joblib')
    model_path = os.path.join(MODELS_DIR, 'expense_classifier.joblib')
    
    joblib.dump(vectorizer, vec_path)
    joblib.dump(classifier, model_path)
    print(f"\nModels successfully saved to:\n  {vec_path}\n  {model_path}")

if __name__ == '__main__':
    train_model()
