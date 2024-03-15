import requests
import os

BASE_URL = "http://127.0.0.1:5000/"
API_KEY = "key-f905fbca-2161-4add-8270-165c47c18df6"
BASE_HEADERS = {
    "apikey" : API_KEY
}

import os

def auth():
    endpoint = 'auth'

    response = requests.get(BASE_URL + endpoint, headers=BASE_HEADERS).json()
    
    return dict(response)

def upload_file(dataset):
    endpoint = 'upload_file'

    headers = {'apikey': API_KEY}

    with open(dataset , 'rb') as file:
        files = {'file': (file.name, file)}

        response = requests.post(BASE_URL + endpoint, headers=headers, files=files)

    if response.status_code == 200:
        print("Success! Response:", response.json())
    else:
        print("Error! Response:", response.text)
    
    return True