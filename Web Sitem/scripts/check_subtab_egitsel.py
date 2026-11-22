with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx = 440973
idx_sub = c.find('egitsel-oyunlar', idx)
print("egitsel-oyunlar inside renderGradeSubTabContent at", idx_sub)
print(c[idx_sub-100:idx_sub+300])
