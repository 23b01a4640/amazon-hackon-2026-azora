import json
from database.supabase_client import supabase

with open("data/products.json", "r", encoding="utf-8") as file:
    products = json.load(file)

response = supabase.table("products").insert(products).execute()

print("Products imported successfully!")
print(response)