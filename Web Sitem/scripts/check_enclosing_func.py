with open('js/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx = 459297
start_func = c.rfind('function ', 0, idx)
print(c[start_func:start_func+200])
