with open('scripts/build_presentation_5_1.py', 'r', encoding='utf-8') as f:
    code = f.read()

namespace = {}
exec_code = code.split('def build_presentation()')[0]
exec(exec_code, namespace)
slides = {s['num']: s for s in namespace.get('slides', [])}
print("=== SLAYT 27 ===")
print(slides[27]['html'])

print("=== SLAYT 34 ===")
print(slides[34]['html'])
