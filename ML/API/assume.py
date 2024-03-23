import requests

BASE_URL = "https://test-api-neg.onrender.com/"
ENDPOINT = "auth"

headers = {"apikey" : "key-f905fbca-2161-4ad-8270-165c47c18df6"}

r = requests.get(BASE_URL + ENDPOINT, headers=headers)

print(r.text)
