with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('function renderGradeUnitBasedHub')
idx_acc = c.find('${unitList.map((uTitle, idx) =>', idx + 2000)
print(c[idx_acc:idx_acc+3000])
