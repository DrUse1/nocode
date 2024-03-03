from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

def train_and_evaluate_regressor(data, target_variable, n_estimators=100, max_depth=None, random_state=None):
    X = data.drop(columns=[target_variable])
    y = data[target_variable]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=random_state)

    regressor = RandomForestRegressor(n_estimators=n_estimators, max_depth=max_depth, random_state=random_state)
    regressor.fit(X_train, y_train)

    y_pred = regressor.predict(X_test)

    mae = mean_absolute_error(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_test, y_pred)

    return {
        "MAE": mae,
        "MSE": mse,
        "RMSE": rmse,
        "R²": r2,
    }

regression_results = train_and_evaluate_regressor(data, "target")
print(regression_results)
