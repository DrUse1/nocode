from supabase import create_client
import json
from dotenv import load_dotenv
import os
load_dotenv()

url = os.getenv("URL")
key = os.getenv("SERVICE_ROLE")

supabase = create_client(url, key)

import requests

def testUploadFile():
    url = 'http://127.0.0.1:5000/upload' 
    file_path = 'AmesHousing.csv'    
    bucket_name = 'newbuckettestyuno'       

    files = {'file': open(file_path, 'rb')}
    headers = {'bucket_name': bucket_name}

    response = requests.post(url, files=files, headers=headers)

    print(response.json())

def testData():
    url = 'https://test-api-neg.onrender.com/get_dataset_head'
    headers = {
        "dataset_id" : "155e59e8199d59a638c48a55eabe4aa9",
        "bucket_name" : "newbuckettestyuno",
        "delimiter" : ";"
    }

    resp = requests.get(url, headers=headers)
    print(resp.json())
    
testData()
