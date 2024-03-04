import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from sklearn.metrics import accuracy_score, mean_absolute_error, mean_squared_error, r2_score

def perform_knn_regression(data, target_variable, n_neighbors=5, weights='uniform', random_state=None):
    """
    Perform k-Nearest Neighbors (KNN) regression using scikit-learn.

    Parameters:
    - data: Dataset (pandas DataFrame)
    - target_variable: Name of the target variable (column in the DataFrame)
    - n_neighbors: Number of neighbors to use (default: 5)
    - weights: Weight function used in predictions ('uniform' or 'distance', default: 'uniform')
    - random_state: Seed for random number generation (default: None)

    Returns:
    - results: Dictionary containing KNN regression evaluation metrics
    """
    if target_variable not in data.columns:
        raise ValueError(f"Target variable '{target_variable}' not found in the dataset.")

    X = data.drop(columns=[target_variable])
    y = data[target_variable]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=random_state)

    model = KNeighborsRegressor(n_neighbors=n_neighbors, weights=weights)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)

    mae = mean_absolute_error(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    rmse = mean_squared_error(y_test, y_pred, squared=False)
    r2 = r2_score(y_test, y_pred)

    results = {
        "MAE": mae,
        "MSE": mse,
        "RMSE": rmse,
        "R²": r2,
    }

    return results
