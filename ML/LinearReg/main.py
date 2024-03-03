import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score
from sklearn.metrics import mean_squared_error
from sklearn.metrics import mean_absolute_error
from sklearn.metrics import mean_absolute_percentage_error

def perform_linear_regression(data, targetVariable):

    """
    Perform linear regression using scikit-learn.

    Parameters:
    - data: Dataset (pandas df)
    - y: Target variable (that needs to be predicted)

    Returns:
    - model: Trained LinearRegression model
    """

    X = data.drop(columns=[targetVariable])
    y = data[targetVariable]

    if isinstance(X, pd.DataFrame):
        X = X.values

    if isinstance(y, pd.Series):
        y = y.values

    
    if len(y.shape) == 1:
        y = y.reshape(-1, 1)

    model = LinearRegression()

    model.fit(X, y)

    y_pred = model.predict(X)
    mae = mean_absolute_error(y, y_pred)
    mse = mean_squared_error(y, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y, y_pred)
    mape = mean_absolute_percentage_error(y, y_pred)
    n = len(y)
    k = X.shape[1]

    adjusted_r2 = 1 - ((1 - r2) * (n - 1) / (n - k - 1))

    return {
        "MAE" : mae,
        "MSE" : mse,
        "RMSE" : rmse,
        "R²" :  r2,
        "mape" : mape,
        "adjusted_R²" : adjusted_r2,

    }


homeprices = pd.read_csv("homeprices.csv")

ln = (perform_linear_regression(homeprices, "price"))
print(ln)
