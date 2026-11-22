with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('function getMaterialTargetSection')
print(c[idx:idx+1500])
