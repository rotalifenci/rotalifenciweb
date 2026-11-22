with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

import re
matches = [m.start() for m in re.finditer(r'renderGradeCategoryMaterials', c)]
print("Total occurrences of renderGradeCategoryMaterials:", len(matches))
for m in matches[:5]:
    print('Match at', m)
    print(c[m-50:m+200])
