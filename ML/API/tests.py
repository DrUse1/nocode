import requests, upload_dataset

BASE_URL = "http://127.0.0.1:5000/"
ENDPOINT = "protected-resource"
API_KEY = "key-f905fbca-2161-4add-8270-165c47c18df6"  # Replace with a valid API key for testing

def test_protected_resource():
    headers = {'API_KEY': API_KEY}

    response = requests.get(BASE_URL + ENDPOINT, headers=headers)

    if response.status_code == 200:
        print("Success! Response:", response.json())
    else:
        print("Error! Response:", response.text)

def test_upload_file():
    x = upload_dataset.clean_and_upload("AmesHousing.csv")
    return x
    
if __name__ == "__main__":
    print(test_upload_file())