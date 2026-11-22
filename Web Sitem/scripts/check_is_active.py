with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('function renderGradeUnitBasedHub')
idx_map = c.find('const isActive =', idx)
print(c[idx_map-100:idx_map+200])
