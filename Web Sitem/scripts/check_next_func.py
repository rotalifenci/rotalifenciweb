with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx_start = 351354
idx_next_func = c.find('\nfunction ', idx_start + 100)
print("Next function at:", idx_next_func)
print(c[idx_next_func:idx_next_func+200])
