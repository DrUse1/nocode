import requests, time, os
import pandas as pd

BASE_URL = "http://127.0.0.1:5000/"
ENDPOINT = "upload-file"
API_KEY = "key-f905fbca-2161-4add-8270-165c47c18df6"  

def clean_and_upload(dataset):

    df = pd.read_csv(dataset)
    filename = "testnZZig123" + ".csv"
    df.to_csv(filename , index=False)

    time.sleep(1)

    headers = {'API_KEY': API_KEY}


    FILE_PATH = filename

    with open(FILE_PATH, 'rb') as file:
        files = {'file': (file.name, file)}

        response = requests.post(BASE_URL + ENDPOINT, headers=headers, files=files)

    if response.status_code == 200:
        print("Success! Response:", response.json())
    else:
        print("Error! Response:", response.text)
    
    return True
