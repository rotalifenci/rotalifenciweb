with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('function renderGradeUnitBasedHub')
idx_cards_render = c.find('totalItems.map', idx)
print(c[idx_cards_render:idx_cards_render+2500])
