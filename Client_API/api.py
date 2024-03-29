from flask import Flask, jsonify, request
import json
import boto3
from supabase import create_client

from dotenv import load_dotenv
import os
load_dotenv()

url = os.getenv("URL")
key = os.getenv("SERVICE_ROLE")

supabase = create_client(url, key)

app = Flask(__name__)

data = dict()

@app.route('/retrieve_model_results', methods=["GET"])
def retrieve_model_results():
    run_id = request.headers.get('run_id')
    try:
        op = dict(supabase.table('core').select('*').eq("run_id", run_id).execute())['data'][0]
        op['results'] = json.loads(op['results'])
        return jsonify({
            "success" : True,
            "run_id" : run_id,
            "results" : op
        })
    except Exception as err:
        return jsonify({
            "success" : False,
            "Error" : err
        })

@app.route('/run_model', methods=["POST"])
def run_model():
    return jsonify({
        "success" : True
    })  

@app.route('/retrieve_dataset_infos', methods=["GET"])
def retrieve_data():
    dataset_s3_key_id = request.headers.get('s3_key_id')
    try:
        op = dict(supabase.table('datasets').select('*').eq('dataset_s3_key_id', dataset_s3_key_id).execute())['data'][0]
        return jsonify({
            "success" : True,
            "dataset_id" : dataset_s3_key_id,
            "results" : op
        })
    except Exception as err:
        return jsonify({
            "success" : False,
            "Error" : err
        })

AWS_DEFAULT_REGION = os.getenv("AWS_DEFAULT_REGION")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

s3 = boto3.resource(
    service_name='s3',
    region_name=AWS_DEFAULT_REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)

def upload_to_s3(bucket_name, filename):
    try:
        s3.Bucket(bucket_name).upload_file(Filename=filename, Key=filename)
    except Exception as err:
        return str(err)
    return True

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    bucket_name = request.headers.get('bucket_name')
    if not bucket_name:
        return jsonify({'error': 'Bucket name not provided'}), 400

    try:
        file.save(file.filename)
        upload_result = upload_to_s3(bucket_name, file.filename)
        if upload_result is True:
            return jsonify({'message': 'File uploaded successfully'}), 200
        else:
            return jsonify({'error': upload_result}), 500
    finally:
        print('')

if __name__ == '__main__':
    app.run(debug=True)