import re

with open('oyunlar/dinamometre-laboratuvari.html', 'r', encoding='utf-8') as f:
    c = f.read()

scripts = re.findall(r'<script>(.*?)</script>', c, re.DOTALL)
print(f"Found {len(scripts)} scripts.")
for i, s in enumerate(scripts):
    with open(f'scripts/temp_dyn_script_{i}.js', 'w', encoding='utf-8') as out:
        out.write(s)
    print(f"Script {i} length: {len(s)}")
