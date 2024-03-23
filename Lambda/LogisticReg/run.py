try:
    import pandas as pd
    import numpy as np
    from sklearn.model_selection import train_test_split
    from sklearn.linear_model import LogisticRegression
    from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
    import requests
    import boto3
except Exception as e:
    print("Error Imports : {} ".format(e))

s3 = boto3.client('s3')

s3 = boto3.resource(
    service_name='s3',
    region_name= "eu-west-3",
    aws_access_key_id= "AKIAU6GDUXHQ453WIGMY",
    aws_secret_access_key= "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"
)

def upload_to_s3(bucket_name, filename):
    try:
        s3.Bucket(bucket_name).upload_file(Filename=filename, Key=filename)
    except Exception as err:
        return f'Error: {err}'
    
    return True

def download_from_s3(bucket_name, key):
    try:
        s3.Bucket(bucket_name).download_file(Key=key, Filename=key)
    except Exception as err:
        return f'Error {err}'
    return True

def make_dataset_usable(bucket_name, key, delimiter=','):
    try:
        obj = s3.Object(bucket_name, key)
        body = obj.get()['Body']
        df = pd.read_csv(body, delimiter=delimiter)
        return df
    except Exception as e:
        return f'Error: {e}'

def get_all_buckets():
    out = list()
    for bucket in s3.buckets.all():
        out.append(bucket.name)
    
    return out

def get_all_files_in_bucket(bucket_name="newbuckettestyuno"):
    out = list()
    for file in s3.Bucket(bucket_name).objects.all():
        out.append(file.key)
    
    return out

def validateEvent(event):
    buckets = get_all_buckets()
    if event["bucket_name"] in buckets:
        files = get_all_files_in_bucket(event["bucket_name"])
        if event['filename'] in files:
            return [event, True]
    
    return [event, False]

def perform_logistic_regression(data, target_variable, test_size=0.2):
    """
    Perform logistic regression using scikit-learn.

    Parameters:
    - data: Dataset (pandas DataFrame)
    - target_variable: Name of the binary target variable (column in the DataFrame)

    Returns:
    - results: Dictionary containing logistic regression evaluation metrics
    """
    if target_variable not in data.columns:
        raise ValueError(f"Target variable '{target_variable}' not found in the dataset.")

    X = data.drop(columns=[target_variable])
    y = data[target_variable]

    if isinstance(X, pd.DataFrame):
        X = X.values

    if isinstance(y, pd.Series):
        y = y.values

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=42)

    model = LogisticRegression()
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_pred)
    confusion = confusion_matrix(y_test, y_pred).tolist()

    results = {
        "Accuracy": accuracy,
        "Precision": precision,
        "Recall": recall,
        "F1 Score": f1,
        "ROC AUC": roc_auc,
        "Confusion Matrix": confusion,
    }

    return results

import json

def lambda_handler(event, context):
    if validateEvent(event)[1]:
        bucket = event['bucket_name']
        filename = event['filename']
        delimiter = event["delimiter"]
        download_from_s3(bucket, filename)
        df_json = make_dataset_usable(bucket, filename, delimiter=delimiter)
        df = pd.DataFrame.from_dict(df_json)

        type_ = "Classification"
        algorithm_id = "algorithm-cb3928d9-9658-4036-a0e5-26605c2beb5f"
        ml_algorithm = "Logistic Regression"
        user_id = "nig212"

        if event['target']:
            results = perform_logistic_regression(df, event['target'])

            headers = {
            "dataset_id" : filename,
            "user_id" : user_id,
            "ml_algorithm" :  ml_algorithm,
            "algorithm_id" : algorithm_id,
            "type" : type_, 
            "results" : json.dumps(results),
            "billed_ms" : str(5000)
            }
            
            r = requests.post("https://test-api-neg.onrender.com/run_data", headers=headers)
            run_id = r.json()['run_id']

        return {
            "statusCode" : 200,
            "res" : results,
            "run_id" : run_id
        }
        
    else:
        return {
            "status" : "Bucket or file not found"
        }