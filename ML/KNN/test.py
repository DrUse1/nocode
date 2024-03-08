# KNN TESTS
import pandas as pd
import classifier, regressor

clf_data = "classification_sample.csv"
reg_data = "regression_sample.csv"

def testKNNClassifier():
    data = pd.read_csv(clf_data, delimiter=';')
    model = classifier.perform_knn_classification(data, "Remboursement")
    return model

def testKNNRegressor():
    data = pd.read_csv(reg_data)
    model = regressor.perform_knn_regression(data, "median_house_value")
    return model