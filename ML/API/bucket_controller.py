from supabase import create_client
import config

supabase = create_client(config.URL, config.SERVICE_ROLE)

res = supabase.storage.create_bucket("Testneg1")

print(res)
