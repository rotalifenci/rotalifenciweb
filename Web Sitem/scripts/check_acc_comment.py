with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('<!-- Özel materyaller doğrudan kendi ünite akordeonlarına yerleştirildi -->')
print(c[idx-200:idx+300])
