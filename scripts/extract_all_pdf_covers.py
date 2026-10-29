import json
import os
import fitz

DATA_FILE = 'data/materials.json'
with open(DATA_FILE, 'r', encoding='utf-8') as f:
    materials = json.load(f)

print(f'Checking {len(materials)} materials...')
os.makedirs('assets/materials', exist_ok=True)
os.makedirs('../assets/materials', exist_ok=True)

updated_count = 0

for m in materials:
    file_url = m.get('fileUrl', '')
    file_name = m.get('fileName', '')
    img_url = m.get('imageUrl', '')
    kapak = m.get('kapakResmi', '')

    is_pdf = (file_url and '.pdf' in file_url.lower()) or (file_name and file_name.lower().endswith('.pdf'))
    if not is_pdf:
        continue

    # Find the local pdf file
    local_pdf = None
    # 1. Direct path check
    candidates = [
        file_url,
        os.path.join('assets/materials', os.path.basename(file_url)),
        os.path.join('../assets/materials', os.path.basename(file_url)),
        os.path.join('assets/docs', os.path.basename(file_url)),
        os.path.join('../assets/docs', os.path.basename(file_url)),
        file_name,
        os.path.join('assets/materials', os.path.basename(file_name)),
        os.path.join('../assets/materials', os.path.basename(file_name)),
    ]

    for c in candidates:
        if c and os.path.exists(c) and os.path.isfile(c) and c.lower().endswith('.pdf'):
            local_pdf = c
            break

    needs_cover = (not kapak or not img_url or kapak == '#' or img_url == '#' or 
                   'smart' in kapak or 'smart' in img_url or 
                   kapak.startswith('data:image/svg') or img_url.startswith('data:image/svg') or
                   'placeholder' in kapak or 'placeholder' in img_url)

    print(f"Material {m.get('id')} ({m.get('title')}): local_pdf={local_pdf}, needs_cover={needs_cover}")

    if local_pdf:
        try:
            doc = fitz.open(local_pdf)
            if len(doc) > 0:
                page = doc[0]
                pix = page.get_pixmap(dpi=150)
                base_name = os.path.splitext(os.path.basename(local_pdf))[0]
                cover_filename = f"{base_name}_cover.jpg"
                out_path1 = os.path.join('assets/materials', cover_filename)
                out_path2 = os.path.join('../assets/materials', cover_filename)
                pix.save(out_path1)
                pix.save(out_path2)
                
                rel_url = f"assets/materials/{cover_filename}"
                m['kapakResmi'] = rel_url
                m['imageUrl'] = rel_url
                m['cover'] = rel_url
                updated_count += 1
                print(f"  -> Generated cover {rel_url} ({pix.width}x{pix.height})")
        except Exception as e:
            print(f"  -> Error generating cover: {e}")

with open(DATA_FILE, 'w', encoding='utf-8') as f:
    json.dump(materials, f, ensure_ascii=False, indent=2)

with open('../data/materials.json', 'w', encoding='utf-8') as f:
    json.dump(materials, f, ensure_ascii=False, indent=2)

print(f"\nDone! Updated {updated_count} materials.")
