from supabase import create_client
import config, creds

supabase = create_client(config.URL, config.ANON)

def add_new_dataset_in_db(size, rows, columns, containsCategorical):
    try:
        op = supabase.table("datasets").insert({
            "dataset_id" : creds.gen_dataset_id(),
            "user_id" : creds.gen_user_id(),
            "size" : size, 
            "rows" : rows,
            "columns" : columns,
            "containsCategorical" : containsCategorical
        }).execute()
        return ''
    except Exception as e:
        return ('Error: ', e)
