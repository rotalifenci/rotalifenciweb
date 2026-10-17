import re

with open('scripts/build_presentation_5_1.py', encoding='utf-8') as f:
    text = f.read()

pattern = re.compile(r'\{\s*"num":\s*(\d+),\s*"kicker":\s*"([^"]*)",\s*"title":\s*"([^"]*)".*?"html":\s*"""(.*?)"""', re.DOTALL)
for match in pattern.finditer(text):
    num, kicker, title, html = match.groups()
    imgs = re.findall(r'src=["\']([^"\']+)["\']|background:\s*url\([\'"]?([^\'")]+)[\'"]?\)', html)
    img_list = [i[0] or i[1] for i in imgs if not i[0].endswith('.svg') and not i[1].endswith('.svg')]
    is_old = any('slide_ref_' in img for img in img_list)
    status = "ESKİ (slide_ref)" if is_old else ("3D SİNEMATİK" if any('assets/slides/' in img or 'ultra' in img for img in img_list) else "DİĞER")
    print(f"Slayt {int(num):2d}: [{status:15s}] {title[:45]:45s} -> {img_list}")
