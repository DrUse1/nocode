import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC, SVR
from sklearn.metrics import accuracy_score, mean_absolute_error, mean_squared_error, r2_score

def perform_svm_regression(data, target_variable, kernel='rbf', C=1.0, gamma='scale', random_state=None):
    """
    Perform SVM regression using scikit-learn.

    Parameters:
    - data: Dataset (pandas DataFrame)
    - target_variable: Name of the target variable (column in the DataFrame)
    - kernel: Specifies the kernel type (default: 'rbf')
    - C: Regularization parameter (default: 1.0)
    - gamma: Kernel coefficient (default: 'scale')
    - random_state: Seed for random number generation (default: None)

    Returns:
    - results: Dictionary containing SVM regression evaluation metrics
    """
    # Check if the target variable exists in the dataset
    if target_variable not in data.columns:
        raise ValueError(f"Target variable '{target_variable}' not found in the dataset.")

    # Extract features (X) and target variable (y)
    X = data.drop(columns=[target_variable])
    y = data[target_variable]

    # Split the dataset into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=random_state)

    # Create an SVM regression model
    model = SVR(kernel=kernel, C=C, gamma=gamma)
    model.fit(X_train, y_train)

    # Make predictions on the test set
    y_pred = model.predict(X_test)

    # Calculate evaluation metrics
    mae = mean_absolute_error(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    rmse = mean_squared_error(y_test, y_pred, squared=False)
    r2 = r2_score(y_test, y_pred)

    # Create a dictionary to store results
    results = {
        "MAE": mae,
        "MSE": mse,
        "RMSE": rmse,
        "R²": r2,
    }

    return results
