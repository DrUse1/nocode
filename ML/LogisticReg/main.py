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
    # Check if the target variable exists in the dataset
    if target_variable not in data.columns:
        raise ValueError(f"Target variable '{target_variable}' not found in the dataset.")

    # Extract features (X) and target variable (y)
    X = data.drop(columns=[target_variable])
    y = data[target_variable]

    # Convert DataFrame to NumPy arrays if needed
    if isinstance(X, pd.DataFrame):
        X = X.values

    if isinstance(y, pd.Series):
        y = y.values

    # Split the dataset into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=42)

    # Create a logistic regression model
    model = LogisticRegression()
    model.fit(X_train, y_train)

    # Make predictions on the test set
    y_pred = model.predict(X_test)

    # Calculate evaluation metrics
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_pred)
    confusion = confusion_matrix(y_test, y_pred)

    # Create a dictionary to store results
    results = {
        "Accuracy": accuracy,
        "Precision": precision,
        "Recall": recall,
        "F1 Score": f1,
        "ROC AUC": roc_auc,
        "Confusion Matrix": confusion,
    }

    return results

# Example usage
df = pd.read_csv("GermanCreditSimple.csv", delimiter=";")
print(df)

logistic_regression_results = perform_logistic_regression(df, "Remboursement")
print(logistic_regression_results)
