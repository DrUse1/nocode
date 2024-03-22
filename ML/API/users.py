from supabase import create_client
import config, creds

supabase = create_client(config.URL, config.ANON)

def add_new_user(username, email, login_method, plan):
    try:
        op = supabase.table("users").insert({
            "user_id" : creds.gen_user_id(),
            "username" : username,
            "email" : email,
            "login_method" : login_method,
            "plan" : plan
        }).execute()
        return ''
    except Exception as e:
        return ('Error: ', e)

print(add_new_user("nig212", "nig@example.com", "GitHub", "Free"))