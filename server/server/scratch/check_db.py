import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

conn_str = "postgresql://postgres:rami@localhost:5432/nutrition_app"
try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'client';")
    columns = [row[0] for row in cur.fetchall()]
    print("Columns in 'client' table:", columns)
    
    cur.close()
    conn.close()
except Exception as e:
    print("Error:", e)
