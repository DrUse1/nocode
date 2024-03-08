from supabase import create_client
import config

supabase = create_client(config.URL, config.ANON)


