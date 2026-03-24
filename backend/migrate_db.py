import sqlite3
import os

db_path = "c:/Users/anmol/OneDrive/Desktop/ArthaNova/backend/arthanova.db"

def migrate():
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check chat_messages
        cursor.execute("PRAGMA table_info(chat_messages);")
        columns = [col[1] for col in cursor.fetchall()]
        
        if "orchestration" not in columns:
            print("Adding 'orchestration' column to 'chat_messages'...")
            cursor.execute("ALTER TABLE chat_messages ADD COLUMN orchestration JSON;")
        
        if "sources" not in columns:
            print("Adding 'sources' column to 'chat_messages'...")
            cursor.execute("ALTER TABLE chat_messages ADD COLUMN sources JSON;")
            
        print("Schema update complete.")
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    migrate()
