from supabase import create_client
import config, creds

supabase = create_client(config.URL, config.ANON)

def add_new_algorithm(name, type):
    try:
        op = supabase.table("algorithms").insert({
            "algorithm_id" : creds.gen_algorithm_id(),
            "name" : name,
            "type" : type, 
        }).execute()
        return ''
    except Exception as e:
        return ('Error: ', e)
    
print(add_new_algorithm("Random Forest (RF Regressor)", "Regression"))