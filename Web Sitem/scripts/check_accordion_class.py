with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('class="unit-accordion-card')
print(c[idx-200:idx+200])
