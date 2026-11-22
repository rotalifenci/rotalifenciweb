with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('function renderGradeUnitBasedHub')
idx_g7 = c.find('"7": {', idx)
print(c[idx_g7:idx_g7+1500])
