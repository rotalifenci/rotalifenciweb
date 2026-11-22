with open('scripts/run_hub_test.js', 'r', encoding='utf-8') as f:
    c = f.read()

c = "function getMaterialActionUI() { return { text: 'Oyna', icon: 'fa-play', bg: 'bg-amber-500' }; }\n" + c
with open('scripts/run_hub_test.js', 'w', encoding='utf-8') as f:
    f.write(c)
