import re

slide_images = {
    9: ("slide_7_sun_layers.jpg", "Güneş Yüzey ve Çekirdek Sıcaklık Karşılaştırması", "rgba(239, 68, 68, 0.6)"),
    10: ("slide_10_size_comparison.jpg", "Güneş ve Dünya Boyut Karşılaştırması 109 Kat", "rgba(245, 158, 11, 0.6)"),
    15: ("slide_13_galileo.jpg", "Güneş Gözlemi Güvenlik ve Teleskop Projeksiyonu", "rgba(239, 68, 68, 0.6)"),
    19: ("slide_19_moon_atmosphere.jpg", "Ay Atmosferi ve Sessiz Uzay", "rgba(96, 165, 250, 0.6)"),
    20: ("slide_16_moon_globe.jpg", "Ay Yer Çekimi ve Kütle Çekim Alanı", "rgba(56, 189, 248, 0.6)"),
    23: ("slide_23_moon_motions.jpg", "Ay'ın 3 Temel Yörünge Hareketi", "rgba(56, 189, 248, 0.6)"),
    24: ("slide_16_moon_globe.jpg", "Ay'ın Senkronize Dönüşü ve Görünür Yüzü", "rgba(192, 132, 252, 0.6)"),
    25: ("slide_23_moon_motions.jpg", "Dolanma 27.3 Gün ve Evre 29.5 Gün Farkı", "rgba(251, 191, 36, 0.6)"),
    26: ("slide_34_eight_phases.jpg", "Ay'ın Evrelerinin Oluşum Mekanizması", "rgba(56, 189, 248, 0.6)"),
    32: ("slide_32_hilal.jpg", "Hilal Evresi 3D Model", "rgba(248, 113, 113, 0.6)"),
    33: ("slide_33_siskin_ay.jpg", "Şişkin Ay Evresi 3D Model", "rgba(251, 191, 36, 0.6)"),
    34: ("slide_34_eight_phases.jpg", "Ay'ın 8 Evresinin Kusursuz Döngüsü", "rgba(56, 189, 248, 0.6)"),
    35: ("slide_30_dolunay.jpg", "Ay Evre Döngüsü ve Hicri Takvim", "rgba(251, 191, 36, 0.6)"),
    37: ("slide_37_model_objects.jpg", "Güneş Dünya Ay Nesne Modellemesi", "rgba(245, 158, 11, 0.6)"),
}

path = 'scripts/build_presentation_5_1.py'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

for num, (img_file, alt_text, border_color) in slide_images.items():
    # Find the slide definition
    slide_pattern = re.compile(r'(\{\s*"num":\s*' + str(num) + r',.*?"html":\s*""")(.*?)("""\s*\},)', re.DOTALL)
    m = slide_pattern.search(text)
    if not m:
        print(f"Could not find slide {num}")
        continue
    
    header, html, footer = m.groups()
    # Check if there is an existing visual panel or image
    if 'slide_ref_' in html:
        # Replace the img tag and visual-frame styling
        html_new = re.sub(
            r'<div class="visual-panel">.*?<div class="visual-frame.*?>.*?<img\s+src="[^"]+".*?>.*?</div>\s*</div>',
            f'''<div class="visual-panel" style="flex: 1.1;">
                    <div class="visual-frame" style="border: 2px solid {border_color}; box-shadow: 0 0 40px {border_color}; border-radius: 24px; overflow: hidden; height: 100%;">
                        <img src="../assets/slides/{img_file}" alt="{alt_text}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                </div>''',
            html,
            flags=re.DOTALL
        )
        # Ensure slide-body has gap: 28px
        html_new = re.sub(r'<div class="slide-body">', '<div class="slide-body" style="gap: 28px;">', html_new)
        text = text[:m.start(2)] + html_new + text[m.end(2):]
        print(f"Successfully updated Slide {num} with {img_file}")
    elif num in [32, 33, 34]:
        # If slide 32, 33, 34 don't have visual panel yet, let's check
        print(f"Slide {num} does not use slide_ref, checking layout...")

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Done updating slides by number!")
