with open('scripts/rendered_hub_7.html', 'r', encoding='utf-8') as f:
    c = f.read()

import re
matches = [m.start() for m in re.finditer(r'data-active="true"', c)]
print("Total data-active='true':", len(matches))
for m in matches:
    print(c[m-100:m+200])
