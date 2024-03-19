try:
    import pandas as pd
    import numpy as np
    import pandas as pd
    import boto3
    import numpy as np
    from sklearn.linear_model import LinearRegression
    from sklearn.metrics import r2_score
    from sklearn.metrics import mean_squared_error
    from sklearn.metrics import mean_absolute_error
    from sklearn.metrics import mean_absolute_percentage_error
    print("All imports ok ...")
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

try:
    import pandas as pd
    import numpy as np
    import pandas as pd
    import numpy as np
    from sklearn.linear_model import LinearRegression
    from sklearn.metrics import r2_score
    from sklearn.metrics import mean_squared_error
    from sklearn.metrics import mean_absolute_error
    from sklearn.metrics import mean_absolute_percentage_error
    print("All imports ok ...")
except Exception as e:
    print("Error Imports : {} ".format(e))


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

def lambda_handler(event, context):
    if validateEvent(event)[1]:
        bucket = event['bucket_name']
        filename = event['filename']
        delimiter = event["delimiter"]
        download_from_s3(bucket, filename)
        df_json = make_dataset_usable(bucket, filename, delimiter=delimiter)
        df = pd.DataFrame.from_dict(df_json)
        if event['target']:
            results = perform_linear_regression(df, event['target'])
        return {
            "statusCode" : 200,
            "res" : results
        }
        
    else:
        return {
            "status" : "Bucket or file not found"
        }
