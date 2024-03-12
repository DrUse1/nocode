import requests, upload_dataset

BASE_URL = "http://127.0.0.1:5000/"
ENDPOINT = "protected-resource"
API_KEY = "key-69b6221d-8fc7-4077-b0bb-b14bab73c939"  # Replace with a valid API key for testing

def test_protected_resource():
    headers = {'API_KEY': API_KEY}

    response = requests.get(BASE_URL + ENDPOINT, headers=headers)

    if response.status_code == 200:
        print("Success! Response:", response.json())
    else:
        print("Error! Response:", response.text)

def test_upload_file():
    upload_dataset.clean_and_upload("regression_sample")
    
if __name__ == "__main__":
    test_upload_file()