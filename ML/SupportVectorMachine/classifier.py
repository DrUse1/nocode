import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC, SVR
from sklearn.metrics import accuracy_score, mean_absolute_error, mean_squared_error, r2_score

def perform_svm_classification(data, target_variable, kernel='rbf', C=1.0, gamma='scale', random_state=None):
    """
    Perform SVM classification using scikit-learn.

    Parameters:
    - data: Dataset (pandas DataFrame)
    - target_variable: Name of the binary target variable (column in the DataFrame)
    - kernel: Specifies the kernel type (default: 'rbf')
    - C: Regularization parameter (default: 1.0)
    - gamma: Kernel coefficient (default: 'scale')
    - random_state: Seed for random number generation (default: None)

    Returns:
    - results: Dictionary containing SVM classification evaluation metrics
    """
  
    if target_variable not in data.columns:
        raise ValueError(f"Target variable '{target_variable}' not found in the dataset.")

    X = data.drop(columns=[target_variable])
    y = data[target_variable]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=random_state)

    model = SVC(kernel=kernel, C=C, gamma=gamma, random_state=random_state)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)

    results = {
        "Accuracy": accuracy,
    }

    return results
