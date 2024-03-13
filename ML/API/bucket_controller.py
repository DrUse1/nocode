from supabase import create_client
import config

supabase = create_client(config.URL, config.SERVICE_ROLE)

res = supabase.storage.list_buckets()

res1 = supabase.storage.from_('test1').list()