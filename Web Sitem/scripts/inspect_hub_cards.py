with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('function renderGradeUnitBasedHub')
idx_cards = c.find('unitList.map', idx + 1000)
print(c[idx_cards:idx_cards+3000])
