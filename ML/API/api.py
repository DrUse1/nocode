from flask import Flask, request, jsonify, send_file
from supabase import create_client
import config, json, time_controller, os
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


import s3_handler
import datasets

@app.route('/add_dataset_infos', methods=['POST'])
def add_dataset():
    bucket_name = request.headers.get('bucket_name')
    filename = request.headers.get('filename')
    delimiter = request.headers.get('delimiter')
    user_id = request.headers.get('user_id')

    if not all([bucket_name, filename, delimiter, user_id]):
        return jsonify({"success": False, "message": "Missing required headers"}), 400

    all_buckets = s3_handler.get_all_buckets()
    if bucket_name not in all_buckets:
        return jsonify({"success": False, "message": f"Bucket '{bucket_name}' not found"}), 404

    all_files = s3_handler.get_all_files_in_bucket(bucket_name)
    
    if filename not in all_files:
        return jsonify({"success": False, "message": f"File '{filename}' not found in bucket '{bucket_name}'"}), 404

    data = s3_handler.get_file_s3_key_id_and_size(filename, bucket_name)
    key_id = data[0]
    size = data[1]
    df = s3_handler.make_dataset_usable(bucket_name, filename, delimiter)
    infos = s3_handler.dataset_info(df)

    op = datasets.add_new_dataset_in_db(key_id,bucket_name,  filename, user_id, size, infos["rows"], infos['columns'], None, None)

    return jsonify({
        "success": True,
        "dataset_s3_key_id": key_id,
        "db_status": op[2]
    })


@app.route('/is_dataset_ml_ready', methods=['GET', 'PUT'])
def ml_ready():
    dataset_id = request.headers.get('dataset_id')
    bucket_name = request.headers.get('bucket_name')
    delimiter = request.headers.get('delimiter')
    import s3_handler
    try:
        df = s3_handler.make_dataset_usable_from_etag(bucket_name, dataset_id , delimiter = delimiter) 
        import datasets
        ml_ready = datasets.isDatasetMLReady(df)
        datasets.updateMlReadyness(dataset_id, str(ml_ready))
        return jsonify({
                "success" :True,
                "ml_ready" : ml_ready
            })
    except Exception as err:
            return jsonify({"Error" : f"No dataset_id known : {dataset_id}"})

@app.route('/run_data', methods=["POST"])
def run_data():
    import core
    API_KEY = request.headers.get("API_KEY")
    algorithm_id = request.headers.get("algorithm_id")
    dataset_id = request.headers.get("dataset_id")
    user_id = request.headers.get("user_id")
    ml_algorithm = request.headers.get("ml_algorithm")
    algorithm_id = request.headers.get("algorithm_id")
    type_ = request.headers.get("type")
    results = request.headers.get("results")
    billed_ms = request.headers.get("billed_ms")

    try:
        op = core.create_new_run(dataset_id, user_id, ml_algorithm, algorithm_id, type_, results, billed_ms)
        run_id = op[1]
        
        return jsonify({
            "run_id" : run_id,
            "success" : True
        }) 

    except Exception as err:
        return jsonify({
            "success" : False,
            "Error" : err
        })

if __name__ == '__main__':
    app.run(debug=True)
