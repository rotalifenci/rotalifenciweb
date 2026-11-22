with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

import re
matches = [m.start() for m in re.finditer(r'renderGradeEducationalGames', c)]
print("Total occurrences of renderGradeEducationalGames:", len(matches))
for m in matches:
    print('Match at', m)
    print(c[max(0, m-50):m+150])
