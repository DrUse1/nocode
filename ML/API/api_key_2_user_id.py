from supabase import create_client
import config

supabase = create_client(config.URL, config.ANON)

def retrieve_user_id_from_api_key(api_key):
    try:
        op = dict(supabase.table("api_controller").select('user_id').eq("api_key", api_key).execute())['data'][0]['user_id']
        return op
    except Exception as err:
        return f'Error : {err}'
        
print(retrieve_user_id_from_api_key("key-f905fbca-2161-4add-8270-165c47c18df6"))