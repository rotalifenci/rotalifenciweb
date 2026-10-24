import os

app_path = os.path.join(os.path.dirname(__file__), '..', 'js', 'app.js')
print("Path exists:", os.path.exists(app_path))
with open(app_path, 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'admin-nav-container' in l or 'admin-mobile-nav' in l or 'triggerUploadModal' in l:
        print(f'{i+1}: {l.strip()[:100]}')
