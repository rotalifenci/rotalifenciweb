with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('function renderGradeEducationalGames')
print(c[idx-500:idx+200])
