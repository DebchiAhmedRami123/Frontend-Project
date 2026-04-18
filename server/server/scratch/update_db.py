import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

conn_str = "postgresql://postgres:rami@localhost:5432/nutrition_app"
try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    
    # 1. Create enum type if it doesn't exist
    cur.execute("SELECT 1 FROM pg_type WHERE typname = 'activitylevelenum';")
    if not cur.fetchone():
        print("Creating ActivityLevelEnum type...")
        cur.execute("CREATE TYPE activitylevelenum AS ENUM ('sedentary', 'light', 'moderate', 'active', 'very_active');")
    
    # 2. Add columns
    columns_to_add = [
        ("activity_level", "activitylevelenum"),
        ("goal", "VARCHAR(50)"),
        ("allergies", "TEXT"),
        ("dietary_restrictions", "TEXT")
    ]
    
    for col_name, col_type in columns_to_add:
        cur.execute(f"SELECT column_name FROM information_schema.columns WHERE table_name = 'client' AND column_name = %s;", (col_name,))
        if not cur.fetchone():
            print(f"Adding column {col_name}...")
            cur.execute(f"ALTER TABLE client ADD COLUMN {col_name} {col_type};")
        else:
            print(f"Column {col_name} already exists.")
            
    conn.commit()
    print("Database update successful!")
    
    cur.close()
    conn.close()
except Exception as e:
    print("Error updating database:", e)
