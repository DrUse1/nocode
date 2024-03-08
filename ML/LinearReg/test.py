# LINEAR REG TESTS

import main
import pandas as pd

reg_data = "regression_sample.csv"

def testLinearRegression():
    df = pd.read_csv(reg_data)
    model = main.perform_linear_regression(df, "median_house_value")
    return model
    