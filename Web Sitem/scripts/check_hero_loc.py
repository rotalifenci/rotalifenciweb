with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

import re
matches = [m.start() for m in re.finditer(r'ÖNE ÇIKAN BAŞYAPIT', c)]
print("Total occurrences of ÖNE ÇIKAN BAŞYAPIT:", len(matches))
for m in matches:
    print('Match at', m)
    print(c[m-100:m+300])
