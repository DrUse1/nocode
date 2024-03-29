from flask import Flask, jsonify, request
import json
import boto3

from dotenv import load_dotenv
import os
load_dotenv()
from flask_cors import CORS

import pandas as pd

def dataset_info(df):
    
    shape = df.shape
    rows = shape[0]
    columns = shape[1]

    out = {
        "rows" : rows,
        "columns" : columns,
    }

    return out

import boto3
import pandas as pd

S3 = boto3.client('s3')

import os

AWS_DEFAULT_REGION=os.getenv("AWS_DEFAULT_REGION")
AWS_ACCESS_KEY_ID=os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY=os.getenv("AWS_SECRET_ACCESS_KEY")

s3 = boto3.resource(
    service_name='s3',
    region_name= AWS_DEFAULT_REGION,
    aws_access_key_id= AWS_ACCESS_KEY_ID,
    aws_secret_access_key= AWS_SECRET_ACCESS_KEY
)

print(s3)
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

def get_file_s3_key_id_and_size(file, bucket="newbuckettestyuno"):
    '''
    file = name on S3 (e.g "AmesHousing.csv")
    '''
    try:
        if file in get_all_files_in_bucket(bucket):
            x = S3.list_objects_v2(Bucket=bucket)['Contents']
            for i in x:
                if (i['Key'] == file):
                    size = i['Size'] * 0.000001
                    key_id = i['ETag'].replace('"', '')
                    return [key_id, size]
            return f'no file named {file}'
                
    except Exception as err:
        return f'Error: {err}'
    
import boto3

def get_all_etags(bucket_name):
    s3_client = boto3.client('s3')

    try:
        response = s3_client.list_objects_v2(Bucket=bucket_name)
        etags = [obj['ETag'].strip('"') for obj in response.get('Contents', [])]

        return etags

    except Exception as e:
        print(f"An error occurred while listing object ETags: {e}")
        return []

def search_s3_object_by_etag(bucket_name, search_etag):
    """
    Search for an object in an Amazon S3 bucket by its ETag.

    Args:
    - bucket_name (str): The name of the S3 bucket.
    - search_etag (str): The ETag of the object to search for.

    Returns:
    - str or None: The key (name) of the found object, or None if not found.
    """

    # Initialize S3 client
    s3_client = boto3.client('s3')

    try:
        # List objects in the bucket
        response = s3_client.list_objects_v2(Bucket=bucket_name)

        # Iterate through objects
        for obj in response.get('Contents', []):
            if obj['ETag'].strip('"') == search_etag:  # Strip double quotes from ETag
                # Object found, return the key (name)
                return obj['Key']

        # Object not found
        return None

    except Exception as e:
        print(f"An error occurred while searching for the object: {e}")
        return None

def make_dataset_usable_from_etag(bucket_name, search_etag, delimiter=','):
    """
    Retrieve data from an object in an Amazon S3 bucket by its ETag and create a DataFrame.

    Args:
    - bucket_name (str): The name of the S3 bucket.
    - search_etag (str): The ETag of the object to retrieve.
    - delimiter (str, optional): The delimiter used in the CSV file. Defaults to ','.

    Returns:
    - pandas.DataFrame or None: The DataFrame created from the CSV file, or None if object not found or error occurred.
    """

    # Search for the object by its ETag
    object_key = search_s3_object_by_etag(bucket_name, search_etag)
    if object_key:
        try:
            # Initialize S3 client
            s3_client = boto3.client('s3')

            # Retrieve data from the object
            response = s3_client.get_object(Bucket=bucket_name, Key=object_key)
            body = response['Body']

            # Read CSV data into DataFrame
            df = pd.read_csv(body, delimiter=delimiter)

            return df

        except Exception as e:
            print(f"An error occurred while making dataset usable from ETag: {e}")
            return None

    else:
        print(f"No object found with ETag {search_etag}")
        return None

def get_dataset_head_tail(df):
    shape = df.shape
    cols = shape[1]
    rows = shape[0]
    
    if cols > 10 and rows > 10:
        top_left = df.iloc[:5, :4].values.tolist()
        top_right = df.iloc[:5, -4:].values.tolist()
        bottom_left = df.iloc[-5:, :4].values.tolist()
        bottom_right = df.iloc[-5:, -4:].values.tolist()
        return {
            "shape": shape,
            "topleft": {
                "columns": df.iloc[:5, :4].columns.tolist(),
                "data": top_left
            },
            "topright": {
                "columns": df.iloc[:5, -4:].columns.tolist(),
                "data": top_right
            },
            "bottomleft": {
                "columns": df.iloc[-5:, :4].columns.tolist(),
                "data": bottom_left
            },
            "bottomright": {
                "columns": df.iloc[-5:, -4:].columns.tolist(),
                "data": bottom_right
            }
        }
    elif cols < 10 and rows > 10:
        top = df.iloc[:5, :].values.tolist()
        bottom = df.iloc[-5:, :].values.tolist()
        return {
            "shape": shape,
            "top": {
                "columns": df.iloc[:5, :].columns.tolist(),
                "data": top
            },
            "bottom": {
                "columns": df.iloc[-5:, :].columns.tolist(),
                "data": bottom
            }
        }
    elif cols > 10 and rows < 10:
        left = df.iloc[:, :4].values.tolist()
        right = df.iloc[:, -4:].values.tolist()
        return {
            "shape": shape,
            "left": {
                "columns": df.iloc[:, :4].columns.tolist(),
                "data": left
            },
            "right": {
                "columns": df.iloc[:, -4:].columns.tolist(),
                "data": right
            }
        }
    else:
        return {
            "shape": shape,
            "data": {
                "columns": df.columns.tolist(),
                "data": df.values.tolist()
            }
        }

app = Flask(__name__)
CORS(app) 

@app.route('/', methods=['GET'])
def slash():
    return jsonify({
        "success" : 200
    })
@app.route('/preview_dataset', methods=["GET"])
def preview():
    dataset_id = request.headers.get('dataset_id')
    delimiter = request.headers.get('delimiter')
    try:
        df = make_dataset_usable_from_etag("newbuckettestyuno", dataset_id, delimiter)
        nig = get_dataset_head_tail(df)
        return jsonify({
  "statusCode": 200,
  "data": nig,
  "error": {}
})
    except Exception as err:
        return jsonify({
  "statusCode": 400,
  "data": {},
  "error": err,
})


if __name__ == '__main__':
    app.run(port=8080)