with open('scripts/rendered_hub_7.html', 'r', encoding='utf-8') as f:
    c = f.read()

import re
matches = [m.start() for m in re.finditer(r'Uzay Ekspresi', c)]
print(f"Total occurrences in rendered_hub_7.html: {len(matches)}")
for m in matches:
    print('--- at', m)
    print(c[m-100:m+400])
