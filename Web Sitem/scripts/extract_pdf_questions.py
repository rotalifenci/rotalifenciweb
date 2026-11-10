import fitz
import json
import os

pdf_path = r"C:\Users\my pc\.gemini\antigravity\brain\76e370d0-33ce-4a14-8375-08210d748d8a\.user_uploaded\media_1794342356814_2eeefefd.pdf"
doc = fitz.open(pdf_path)
print(f"Total pages: {len(doc)}")

full_text = ""
pages_text = []

for i, page in enumerate(doc):
    txt = page.get_text()
    pages_text.append(txt)
    full_text += f"\n--- PAGE {i+1} ---\n" + txt

with open("scripts/extracted_pdf_text.txt", "w", encoding="utf-8") as f:
    f.write(full_text)

print("Saved scripts/extracted_pdf_text.txt. Total length:", len(full_text))

# Also inspect images on page 4 (0-indexed page 3)
p4 = doc[3]
images = p4.get_images()
print(f"Page 4 has {len(images)} images")
os.makedirs("assets/science/7_1_questions", exist_ok=True)
for img_idx, img_info in enumerate(images):
    xref = img_info[0]
    base_image = doc.extract_image(xref)
    image_bytes = base_image["image"]
    image_ext = base_image["ext"]
    out_name = f"assets/science/7_1_questions/q_{136+img_idx}.{image_ext}"
    with open(out_name, "wb") as img_file:
        img_file.write(image_bytes)
    print(f"Extracted image {img_idx+1} to {out_name} ({len(image_bytes)} bytes)")
