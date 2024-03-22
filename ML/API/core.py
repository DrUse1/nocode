from supabase import create_client
import config, creds

supabase = create_client(config.URL, config.ANON)

def create_new_run(dataset_id, user_id, ml_algorithm, algorithm_id, type_, results, billed_ms):
    run_id = creds.gen_run_id()
    try:
        op = supabase.table('core').insert({
            "run_id" : run_id,
            "dataset_id" : dataset_id,
            "user_id" : user_id,
            "ml_algorithm" :  ml_algorithm,
            "algorithm_id" : algorithm_id,
            "type" : type_, 
            "results" : results,
            "billed_ms" : billed_ms
        }).execute()

        return [True, run_id]
    
    except Exception as err:
        return f"Error: {err}"