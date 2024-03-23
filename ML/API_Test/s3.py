import requests


headers = {
    "bucket_name" : "newbuckettestyuno",
    "filename" : "nig.csv",
    "delimiter" : ";",
    "user_id" : "danig",
}

url = "https://test-api-neg.onrender.com/add_dataset_infos"

r = requests.post(url, headers=headers)
print(r.json())

headers2 = {
    
}