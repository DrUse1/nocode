# LOGIT TESTS
import pandas as pd
import main

data = "classification_sample.csv"

def testLogitRegression():
    deta = pd.read_csv(data, delimiter=";")
    model = main.perform_logistic_regression(deta, "Remboursement")
    return model