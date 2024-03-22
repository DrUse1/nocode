import uuid

def gen_sample_uuid():
    return str(uuid.uuid4())

def gen_user_id():
    return "user-" + gen_sample_uuid()

def gen_dataset_id():
    return "dataset-" + gen_sample_uuid()

def gen_run_id():
    return "run-" + gen_sample_uuid()

def gen_algorithm_id():
    return "algorithm-" + gen_sample_uuid()

def gen_api_key():
    return "key-" + gen_sample_uuid()