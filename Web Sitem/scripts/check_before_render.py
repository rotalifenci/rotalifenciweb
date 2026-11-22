with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx = 448980
print(c[idx-1000:idx+50])
