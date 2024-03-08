# SVM TESTS


# Classification = 0,1
# Regression = r²

import pandas as pd
import classifier, regressor


clf_data = "classification_sample.csv"
reg_data = "regression_sample.csv"

def testSVMClassifier():
    df = pd.read_csv(clf_data, delimiter=";")
    model = classifier.perform_svm_classification(df, "Remboursement")
    return model

def testSVMRegressor():
    df = pd.read_csv(reg_data)
    model = regressor.perform_svm_regression(df, "median_house_value")
    return model

summ = testSVMRegressor()
print(summ)
