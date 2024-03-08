import pandas as pd
import os

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
