with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('function renderGradeUnitBasedHub')
idx_end = c.find('function renderGradeDersNotuAccordion', idx)
hub_code = c[idx:idx_end]

import re
matches = [m.start() for m in re.finditer(r'Uzay Ekspresi|BAŞYAPIT', hub_code)]
print("Total occurrences of Uzay Ekspresi/BAŞYAPIT in renderGradeUnitBasedHub:", len(matches))
for m in matches:
    print('Match in hub at', m)
    print(hub_code[m-50:m+150])
