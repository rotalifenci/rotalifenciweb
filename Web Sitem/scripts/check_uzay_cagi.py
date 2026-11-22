with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

import re
matches = [m.start() for m in re.finditer(r'Uzay Çağı|Uzay Cagi', c)]
print("Total occurrences of Uzay Çağı:", len(matches))
for m in matches:
    print('Match at', m)
    print(c[m-50:m+100])
