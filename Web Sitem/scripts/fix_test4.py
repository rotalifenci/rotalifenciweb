with open('scripts/run_hub_test.js', 'r', encoding='utf-8') as f:
    c = f.read()

c = "function renderWorkBadgeHTML() { return ''; }\n" + c
with open('scripts/run_hub_test.js', 'w', encoding='utf-8') as f:
    f.write(c)
