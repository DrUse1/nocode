from supabase import create_client
import config, creds, os
import pandas as pd

supabase = create_client(config.URL, config.SERVICE_ROLE)

def add_new_dataset_in_db(dataset_id,bucket_name, filename, user_id, size, rows, columns, is_valid, _type):
    try:
        op = supabase.table("datasets").insert({
            "dataset_s3_key_id" : dataset_id,
            "bucket_name" : bucket_name,
            "filename" : filename,
            "user_id" : user_id,
            "size" : size, 
            "rows" : rows,
            "columns" : columns,
            "ml_ready" : is_valid,
            "type" : _type
        }).execute()
        return [True, dataset_id ,201]
    except Exception as e:
        return ('Error: ', e)

def updateMlReadyness(dataset_id, ml_readyness):
    try:
        op = supabase.table('datasets').update({'ml_ready': ml_readyness}).eq('dataset_s3_key_id', dataset_id).execute()
        return f'dataset_id : {dataset_id} ml_readyness has been updated at {ml_readyness}'
    except Exception as err:
        return f'Error: {err}'

def dataset_info(dfName, delimiter=","):
    file_size_bytes = (os.stat(dfName).st_size)/1024
    file_size_mb = round(file_size_bytes / 1024, 2)
        
    df = pd.read_csv(dfName, delimiter=delimiter)
    
    shape = df.shape
    rows = shape[0]
    columns = shape[1]
    types = df.dtypes  # Replace with the actual path to your file

    out = {
        "dataset_name" : dfName.replace(".csv", ""),
        "rows" : rows,
        "columns" : columns,
        "size_in_mb" : file_size_mb,
        "columns_dtypes" : dict(types)
    }

    return out

def typesList(dfName, delimiter=","):
    types = list()
    df = pd.read_csv(dfName, delimiter=delimiter)
    for i in df.dtypes:
        types.append(str(i))
    
    return types
    
def isDatasetMLReady(dfName, delimiter=","):
    types = typesList(dfName, delimiter)

    for i in types:
        if i != "float64":
            return False
    
    return True

import boto3
import pandas as pd

S3 = boto3.client('s3')

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

def get_file_s3_key_id(file, bucket="newbuckettestyuno"):
    '''
    file = name on S3 (e.g "AmesHousing.csv")
    '''
    try:
        if file in get_all_files_in_bucket(bucket):
            x = S3.list_objects_v2(Bucket=bucket)['Contents']
            for i in x:
                if (i['Key'] == file):
                    key_id = i['ETag']
                    return key_id.replace('"', '')
        else:
            return f'no file named {file}'
                
    except Exception as err:
        return f'Error: {err}'
    

def typesList(df):
    types = list()
    for i in df.dtypes:
        types.append(str(i))
    
    return types


def isDatasetMLReady(df):
    types = typesList(df)
    for i in types:
        if i != "float64":
            return False
    
    return True