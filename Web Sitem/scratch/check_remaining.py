import re

with open('scripts/build_presentation_5_1.py', encoding='utf-8') as f:
    text = f.read()

pattern = re.compile(r'\{\s*"num":\s*(\d+).*?"html":\s*"""(.*?)"""', re.DOTALL)
remaining = []
for match in pattern.finditer(text):
    num, html = match.groups()
    if 'slide_ref_' in html:
        remaining.append(int(num))

print("Remaining slide numbers with slide_ref_:", remaining)
