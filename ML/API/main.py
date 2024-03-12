import requests

BASE = "http://127.0.0.1:5000/"
headers = {
    "X_API_KEY": 'key-69b6221d-8fc7-4077-b0bb-b14bab73c939'
}

# Making a GET request with headers
response = requests.get(f"{BASE}authorize", headers=headers)

# Printing the response content
print(response.text)
