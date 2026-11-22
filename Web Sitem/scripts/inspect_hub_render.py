with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('function renderGradeUnitBasedHub')
idx_render = c.find('return `', idx)
print(c[idx_render:idx_render+3000])
