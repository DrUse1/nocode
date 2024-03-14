from flask import Flask, request, jsonify
from supabase import create_client
import config, json, time_controller

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
    api_key = request.headers.get('API_KEY')
    if api_key and authenticate_api_key(api_key):
        return jsonify({'message': 'Access granted to protected resource'}), 200
    else:
        return jsonify({'message': 'Unauthorized access'}), 401

@app.route('/upload-file', methods=['POST'])
def upload_file():
    try:
        # Get the API key from the headers
        api_key = request.headers.get('API_KEY')

        # Check if the API key is valid
        if not api_key or not authenticate_api_key(api_key):
            return jsonify({'error': 'Invalid API key'}), 401

        # Check if the 'file' key is in the request files
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['file']

        # Check if the file is not empty
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        # Upload the file to Supabase storage
        with open(file.filename, 'rb') as f:
            supabase.storage.from_("test1").upload(file=f, path=file.filename)

        return jsonify({'message': 'File uploaded successfully'})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/dataset_info')
def dataset_info():
    api_key = request.headers.get('API_KEY')
    dataset_id = request.header.get('DATASET_ID')

    



@app.route('/run_model')
def run_model():
    pass

if __name__ == '__main__':
    app.run(debug=True)
