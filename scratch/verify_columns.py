import psycopg2
try:
    conn = psycopg2.connect('postgresql://postgres:rami@localhost:5432/nutrition_app')
    cur = conn.cursor()
    cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'nutritionist_profiles'")
    cols = [c[0] for c in cur.fetchall()]
    print(f"Columns: {cols}")
    print(f"plan_features exists: {'plan_features' in cols}")
    print(f"sample_plan_data exists: {'sample_plan_data' in cols}")
    cur.close()
    conn.close()
except Exception as e:
    print(f"Verification error: {e}")
