with open('scripts/build_presentation_5_1.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

def print_range(start, end):
    print(f"=== LINES {start} TO {end} ===")
    for i in range(start-1, end):
        print(f"{i+1}: {repr(lines[i])}")

print_range(1221, 1285)
print_range(1489, 1565)
