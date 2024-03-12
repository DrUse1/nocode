import requests, time
import pandas as pd

BASE_URL = "http://127.0.0.1:5000/"
ENDPOINT = "upload-file"
API_KEY = "key-69b6221d-8fc7-4077-b0bb-b14bab73c939"  

def clean_and_upload(dataset):

    # Assume we cleaned the dataset
    df = pd.read_csv(dataset + ".csv")
    filename = "testdf123" + ".csv"
    df.to_csv(filename , index=False)

    time.sleep(1)

    headers = {'Api-Key': API_KEY}


    FILE_PATH = filename

    with open(FILE_PATH, 'rb') as file:
        files = {'file': (file.name, file)}

        response = requests.post(BASE_URL + ENDPOINT, headers=headers, files=files)

    if response.status_code == 200:
        print("Success! Response:", response.json())
    else:
        print("Error! Response:", response.text)
    return True
