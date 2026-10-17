import re, os, sys

# Execute the slides definition safely
with open('scripts/build_presentation_5_1.py', 'r', encoding='utf-8') as f:
    code = f.read()

# Grab slides list
namespace = {}
# Execute up to where build/write starts
exec_code = code.split('def build_presentation()')[0]
exec(exec_code, namespace)

slides = namespace.get('slides', [])
print(f"Total slides found: {len(slides)}")

for s in slides:
    num = s.get('num')
    title = s.get('title')
    html = s.get('html', '')
    imgs = re.findall(r'<img[^>]+src=[\'"]([^\'"]+)[\'"]', html)
    # Check if any img contains slide_ref
    is_ref = any('slide_ref' in img for img in imgs)
    # Check if files exist on disk
    missing = []
    for img in imgs:
        # resolve path
        p = img.replace('../', '')
        if not os.path.exists(p):
            missing.append(img)
    print(f"Slayt {num:2d}: {title[:35]:35s} | Imgs: {len(imgs)} | Ref: {is_ref} | Missing: {missing}")
