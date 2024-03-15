from flask import Flask, request, jsonify, send_file
from supabase import create_client
import config, json, time_controller, os, io, tempfile, requests
import pandas as pd

app = Flask(__name__)

supabase = create_client(config.URL, config.SERVICE_ROLE)

def authenticate_api_key(api_key):
    # Check if the provided API key exists in the Supabase table
    query = supabase.table("api_controller").select("*").eq("api_key", api_key)
    result = query.execute()
    try:
        data = json.loads(result.model_dump_json())['data'][0]

        apiKey = data["api_key"]

        return True
    
    except Exception as e:
        return False

@app.route('/auth', methods=['GET'])
def auth():
    key = request.headers.get('apikey')
    if key and authenticate_api_key(key):
        return jsonify({'message': 'authenticated', 'API_KEY' : key, 'status' : 'active'}), 200
    else:
        return jsonify({'message': 'Unauthorized access'}), 401

@app.route('/upload_file', methods=['POST'])
def upload_file():
    try:
        api_key = request.headers.get('apikey')
        if not api_key or not authenticate_api_key(api_key):
            return jsonify({'error': 'Invalid API key'}), 401

        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        current_directory = os.getcwd()
        file_path = os.path.join(current_directory, file.filename)

        file.save(file_path)

        with open(file_path, 'rb') as f:
            supabase.storage.from_("test1").upload(file=f, path=file.filename)

        return jsonify({'message': 'File uploaded successfully'})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_dataset_url', methods=['GET'])
def download_file():
    try:
        # Get the API key from the request headers
        api_key = request.headers.get('apikey')

        # Authenticate the API key
        if not api_key or not authenticate_api_key(api_key):
            return jsonify({'error': 'Invalid API key'}), 401

        # Get the file source (name) and bucket name from the query parameters
        source = request.args.get('source')
        bucket_name = request.args.get('bucket_name')
        if not source or not bucket_name:
            return jsonify({'error': 'Missing source or bucket_name parameter'}), 400

        # Get the public URL of the file from Supabase storage
        public_url = supabase.storage.from_(bucket_name).get_public_url(source)

        return jsonify({'data': public_url})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)

@app.route('/dataset_info')
def dataset_info():
    API_KEY = request.headers.get('API_KEY')
    dataset_id = request.header.get('DATASET_ID')





@app.route('/run_model', methods=["POST"])
def run_model():
    API_KEY = request.headers.get("API_KEY")
    algorithm_id = request.headers.get("algorithm_id")
    dataset_id = request.headers.get("dataset_id")

    # someLogicToCheckIfModelIsPossibleToRun():
        #pass

    #  nig = runLambdaFuncFromThere():
        #return results

    return jsonify({
        "results" : "s"
    })

if __name__ == '__main__':
    app.run(debug=True)
