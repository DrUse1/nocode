from supabase import create_client
import config, creds, time_controller

supabase = create_client(config.URL, config.ANON)

def generate_api_key(user_id):
    try:
        op = supabase.table("api_controller").insert({
            "api_key" : creds.gen_api_key(),
            "user_id" : user_id,
            "createdAt" : time_controller.fullDate()
        }).execute()
    
    except Exception as e:
        return ("Error", e)

generate_api_key("user-c976c2ab-c377-4845-a3b7-89b0a88d2499")

