with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('const builtinUnitGamesMap = {')
print(c[idx:idx+4000])
