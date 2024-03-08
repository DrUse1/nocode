import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix

def perform_logistic_regression(data, target_variable, test_size=0.2):
    """
    Perform logistic regression using scikit-learn.

    Parameters:
    - data: Dataset (pandas DataFrame)
    - target_variable: Name of the binary target variable (column in the DataFrame)

    Returns:
    - results: Dictionary containing logistic regression evaluation metrics
    """
    if target_variable not in data.columns:
        raise ValueError(f"Target variable '{target_variable}' not found in the dataset.")

    X = data.drop(columns=[target_variable])
    y = data[target_variable]

    if isinstance(X, pd.DataFrame):
        X = X.values

    if isinstance(y, pd.Series):
        y = y.values

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=42)

    model = LogisticRegression()
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_pred)
    confusion = confusion_matrix(y_test, y_pred)

    results = {
        "Accuracy": accuracy,
        "Precision": precision,
        "Recall": recall,
        "F1 Score": f1,
        "ROC AUC": roc_auc,
        "Confusion Matrix": confusion,
    }

    return results