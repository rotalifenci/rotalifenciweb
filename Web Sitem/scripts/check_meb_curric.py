with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('MEB_CURRICULUM')
if idx != -1:
    idx7 = c.find('"7":', idx)
    print(c[idx7:idx7+500])
else:
    print("MEB_CURRICULUM not found")
