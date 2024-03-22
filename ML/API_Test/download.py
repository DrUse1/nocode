import requests

BASE_URL = "http://127.0.0.1:5000/"
API_KEY = "key-f905fbca-2161-4add-8270-165c47c18df6"
BASE_HEADERS = {
    "apikey" : API_KEY
}

def download_csv(bucket_name, source):

    endpoint = 'get_dataset_url'
    params = {
        "bucket_name" : bucket_name,
        "source" : source
    }

    url = requests.get(BASE_URL + endpoint, headers=BASE_HEADERS, params=params).json()['data']
    
    response = requests.get(url)
    
    if response.status_code == 200:
        with open(f"{source}", "wb") as csv_file:
            csv_file.write(response.content)
        print("CSV file downloaded successfully.")
        return True
    else:
        print("Failed to download CSV file.")
        return False
