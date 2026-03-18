
import os
import re

# Directory to scan
ROOT_DIR = r"c:\Users\anmol\OneDrive\Desktop\ArthaNova\frontend\src\styles"

# Patterns to remove (redundant imports already handled by global injection)
PATTERNS = [
    r'@import [\"\'](.*)variables[\"\'];?',
    r'@use [\"\'](.*)variables[\"\'] as \*;?',
    r'@use [\"\'](.*)variables[\"\'];?'
]

def clean_scss():
    print(f"🧹 Starting SCSS cleanup in {ROOT_DIR}...")
    count = 0
    for root, dirs, files in os.walk(ROOT_DIR):
        for file in files:
            if file.endswith(".scss"):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = content
                for pattern in PATTERNS:
                    new_content = re.sub(pattern, '', new_content)
                
                if new_content != content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"✨ Cleaned: {file}")
                    count += 1
    
    print(f"🏁 Done! {count} files cleaned.")

if __name__ == "__main__":
    clean_scss()
