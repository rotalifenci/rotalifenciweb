import re, os

with open('sunumlar/5-sinif-1-unite-gunes-dunya-ay.html', 'r', encoding='utf-8') as f:
    html = f.read()

imgs = re.findall(r'<img[^>]+src=[\'"]([^\'"]+)[\'"]', html)
bg_imgs = re.findall(r'url\([\'"]?([^\'"\)]+)[\'"]?\)', html)
all_refs = set(imgs + bg_imgs)

print(f"Total distinct image references in compiled HTML: {len(all_refs)}")
missing = []
for ref in all_refs:
    if ref.startswith('data:') or ref.startswith('http'):
        continue
    if ref.startswith('../'):
        path = ref[3:]
    else:
        path = ref
    if not os.path.exists(path):
        missing.append((ref, path))

print(f"Missing files: {len(missing)}")
for m in missing:
    print("  MISSING:", m)
