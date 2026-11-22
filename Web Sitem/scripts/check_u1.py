with open('scripts/rendered_hub_7.html', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('data-unit="1"')
print(c[idx-50:idx+300])
