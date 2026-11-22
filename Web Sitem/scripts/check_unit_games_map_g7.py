with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('const builtinUnitGamesMap = {')
idx_g7 = c.find('"7": {', idx)
idx_end = c.find('};', idx_g7)
print(c[idx_g7:idx_end])
