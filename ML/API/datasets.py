from supabase import create_client
import config, creds, os
import pandas as pd

supabase = create_client(config.URL, config.SERVICE_ROLE)

def add_new_dataset_in_db(user_id, size, rows, columns, is_valid, _type):
    try:
        op = supabase.table("datasets").insert({
            "dataset_id" : creds.gen_dataset_id(),
            "user_id" : user_id,
            "size" : size, 
            "rows" : rows,
            "columns" : columns,
            "ml_ready" : is_valid,
            "type" : _type
        }).execute()
        return ''
    except Exception as e:
        return ('Error: ', e)

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

def retrieve_dataset_from_bucket(bucket_name, dataset_name):
    try:
        with open(dataset_name, 'wb+') as f:
            res = supabase.storage.from_(bucket_name).download(dataset_name)
            f.write(res)
            infos = dataset_info(dataset_name)
        isValid = isDatasetMLReady(dataset_name)
        infos["valid"] = isValid
    except Exception as err:
        print(f'Error : {err}')
        infos = dict()
        
    print(add_new_dataset_in_db("sample_id", infos["size_in_mb"], infos["rows"], infos["columns"], infos["valid"]))
    return infos

print(retrieve_dataset_from_bucket("test1", "AmesHousing.csv"))