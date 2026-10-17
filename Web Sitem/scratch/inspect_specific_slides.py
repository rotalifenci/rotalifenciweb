import re

with open('scripts/build_presentation_5_1.py', 'r', encoding='utf-8') as f:
    code = f.read()

namespace = {}
exec_code = code.split('def build_presentation()')[0]
exec(exec_code, namespace)
slides = {s['num']: s for s in namespace.get('slides', [])}

for num in [5, 6, 27, 34, 40, 41]:
    s = slides.get(num)
    if s:
        print(f"=== SLAYT {num}: {s['title']} ===")
        print(s['html'][:400])
        print("...\n")
