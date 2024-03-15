import requests

BASE_URL = "http://127.0.0.1:5000/"
ENDPOINT = "auth"

headers = {"apikey" : "key-f905fbca-2161-4add-8270-165c47c18df6"}

r = requests.get(BASE_URL + ENDPOINT, headers=headers)

print(r.text)
