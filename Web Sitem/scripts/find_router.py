with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

import re
matches = [m.start() for m in re.finditer(r'#grade|grade-\d|egitsel-oyunlar', c)]
for m in matches:
    snippet = c[max(0, m-50):m+100]
    if 'hash' in snippet or 'route' in snippet or 'function' in snippet or 'render' in snippet:
        print('--- at', m)
        print(snippet)
