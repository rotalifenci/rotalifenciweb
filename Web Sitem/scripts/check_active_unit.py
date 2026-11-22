with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('function renderGradeUnitBasedHub')
idx_active = c.find('activeHubUnit', idx)
print(c[idx_active-100:idx_active+800])
