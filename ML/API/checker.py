from supabase import create_client
import json, config

supabase = create_client(config.URL, config.ANON)

from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/')
def health():
    return jsonify({"Health": "OK"})

@app.route('/authorize')
def authorize():
    given_api_key = request.headers.get("X_API_KEY")

    verify = json.loads(supabase.table("api_controller").select("api_key").eq("api_key", given_api_key).execute().json())["data"]
    if verify == list():
        status = 'inactive'
        return jsonify({
            "Error" : "X_API_KEY not found",
            "given_key" : given_api_key,
            "status" : status
            })
    else:
        verified_key = verify[0]["api_key"]
        user_id = dict(supabase.table("api_controller").select("user_id").eq("api_key", given_api_key).execute())
        user_id = user_id["data"][0]["user_id"]
        createdAt = dict(supabase.table("api_controller").select("createdAt").eq("api_key", given_api_key).execute())["data"][0]["createdAt"]
        status = "active"

        return jsonify({
            "user_id" : user_id,
            "api_key" : given_api_key,
            "createdAt" : createdAt,
            "status" : status
        })

if __name__ == '__main__':
    app.run(debug=True)