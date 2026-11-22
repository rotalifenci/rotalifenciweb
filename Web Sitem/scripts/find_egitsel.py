with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

import re
matches = [m.start() for m in re.finditer(r'egitsel-oyunlar', c)]
print("Total occurrences of egitsel-oyunlar:", len(matches))
for m in matches[:10]:
    print('Match at', m)
    print(c[max(0, m-50):m+150])
    print('='*50)
