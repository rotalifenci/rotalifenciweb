with open('scripts/build_presentation_5_1.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'SLAYT 27' in line or 'SLAYT 34' in line or 'SLAYT 40' in line or 'SLAYT 41' in line:
        print(f"Line {i+1}: {line.strip()}")
        # print next 5 lines
        for j in range(i+1, min(i+7, len(lines))):
            print(f"  {lines[j].strip()}")
