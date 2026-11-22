with open('oyunlar/dinamometre-laboratuvari.html', 'r', encoding='utf-8') as f:
    c = f.read()

# Fix literal newline inside double quotes for csv string
c = c.replace(
    'let csv = "Deney No,Dinamometre,Yay Turu,Uygulanan Kuvvet (N),Uzama (cm),Durum\n";',
    'let csv = "Deney No,Dinamometre,Yay Turu,Uygulanan Kuvvet (N),Uzama (cm),Durum\\n";'
)
c = c.replace(
    'csv += `${r.id},"${r.capacity}","${r.springType}",${r.force},${r.deltaL},"${r.status}"\n`;',
    'csv += `${r.id},"${r.capacity}","${r.springType}",${r.force},${r.deltaL},"${r.status}"\\n`;'
)

targets = [
    'oyunlar/dinamometre-laboratuvari.html',
    '../oyunlar/dinamometre-laboratuvari.html',
    '../Eğitsel Oyun/dinamometre-laboratuvari.html'
]
for t in targets:
    with open(t, 'w', encoding='utf-8') as f:
        f.write(c)

print("Fixed newlines in CSV strings!")
