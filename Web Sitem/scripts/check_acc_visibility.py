with open('scripts/rendered_hub_7.html', 'r', encoding='utf-8') as f:
    c = f.read()

import re
matches = [m.start() for m in re.finditer(r'unit-accordion-card', c)]
for m in matches:
    print(c[m:m+150])
