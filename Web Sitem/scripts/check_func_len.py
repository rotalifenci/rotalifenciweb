with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx_start = c.find('function renderGradeUnitBasedHub')
print("idx_start:", idx_start)
idx_end = c.find('function renderGradeDersNotuAccordion', idx_start)
print("idx_end:", idx_end)
