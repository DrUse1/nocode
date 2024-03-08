# RF TESTS
import pandas as pd
import classifier, regressor

clf_data = "classification_sample.csv"
reg_data = "regression_sample.csv"

def testRFClassifier():
    df = pd.read_csv(clf_data, delimiter=";")
    model = classifier.classfier_random_forest(df, "Remboursement")
    return model

def testRFRegressor():
    df = pd.read_csv(reg_data)
    model = regressor.regressor_random_forest(df, "median_house_value")
    return model

summ = testRFRegressor()
print(summ)

