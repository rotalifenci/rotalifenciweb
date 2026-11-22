with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('function renderGradeEducationalGames')
print(c[idx:idx+2500])
