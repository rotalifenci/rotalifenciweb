import re

path = 'scripts/build_presentation_5_1.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. SLAYT 9
old_s9 = '''                    <div class="visual-panel">
                    <div class="visual-frame">
                        <img src="../assets/sunum5/slide_ref_8.jpg" alt="Güneş Sıcaklığı">
                    </div>
                </div>'''
new_s9 = '''                    <div class="visual-panel" style="flex: 1.1;">
                    <div class="visual-frame" style="border: 2px solid rgba(239, 68, 68, 0.6); box-shadow: 0 0 40px rgba(239, 68, 68, 0.35); border-radius: 24px; overflow: hidden; height: 100%;">
                        <img src="../assets/slides/slide_7_sun_layers.jpg" alt="Güneş Yüzey ve Çekirdek Sıcaklık Karşılaştırması" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                </div>'''

# 2. SLAYT 10
old_s10 = '''                    <div class="visual-panel">
                    <div class="visual-frame">
                        <img src="../assets/sunum5/slide_ref_7.jpg" alt="Güneş Büyüklüğü">
                    </div>
                </div>'''
new_s10 = '''                    <div class="visual-panel" style="flex: 1.1;">
                    <div class="visual-frame" style="border: 2px solid rgba(245, 158, 11, 0.6); box-shadow: 0 0 40px rgba(245, 158, 11, 0.35); border-radius: 24px; overflow: hidden; height: 100%;">
                        <img src="../assets/slides/slide_10_size_comparison.jpg" alt="Güneş ve Dünya Boyut Karşılaştırması 109 Kat" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                </div>'''

# 3. SLAYT 15
old_s15 = '''                    <div class="visual-panel">
                    <div class="visual-frame">
                        <img src="../assets/sunum5/slide_ref_9.jpg" alt="Güneş Gözlemi Güvenliği">
                    </div>
                </div>'''
new_s15 = '''                    <div class="visual-panel" style="flex: 1.1;">
                    <div class="visual-frame" style="border: 2px solid rgba(239, 68, 68, 0.6); box-shadow: 0 0 40px rgba(239, 68, 68, 0.35); border-radius: 24px; overflow: hidden; height: 100%;">
                        <img src="../assets/slides/slide_13_galileo.jpg" alt="Güneş Gözlemi Güvenlik ve Teleskop Projeksiyonu" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                </div>'''

# 4. SLAYT 19
old_s19 = '''                    <div class="visual-panel">
                    <div class="visual-frame">
                        <img src="../assets/sunum5/slide_ref_12.jpg" alt="Atmosfer ve Sıcaklık">
                    </div>
                </div>'''
new_s19 = '''                    <div class="visual-panel" style="flex: 1.1;">
                    <div class="visual-frame" style="border: 2px solid rgba(96, 165, 250, 0.6); box-shadow: 0 0 40px rgba(96, 165, 250, 0.35); border-radius: 24px; overflow: hidden; height: 100%;">
                        <img src="../assets/slides/slide_19_moon_atmosphere.jpg" alt="Ay Atmosferi ve Sessiz Uzay" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                </div>'''

# 5. SLAYT 20
old_s20 = '''                    <div class="visual-panel">
                    <div class="visual-frame">
                        <img src="../assets/sunum5/slide_ref_12.jpg" alt="Yer Çekimi">
                    </div>
                </div>'''
new_s20 = '''                    <div class="visual-panel" style="flex: 1.1;">
                    <div class="visual-frame" style="border: 2px solid rgba(56, 189, 248, 0.6); box-shadow: 0 0 40px rgba(56, 189, 248, 0.35); border-radius: 24px; overflow: hidden; height: 100%;">
                        <img src="../assets/slides/slide_16_moon_globe.jpg" alt="Ay Yer Çekimi ve Kütle Çekim Alanı" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                </div>'''

# 6. SLAYT 23
old_s23 = '''                    <div class="visual-panel">
                    <div class="visual-frame">
                        <img src="../assets/sunum5/slide_ref_14.jpg" alt="Ayın Hareketleri">
                    </div>
                </div>'''
new_s23 = '''                    <div class="visual-panel" style="flex: 1.1;">
                    <div class="visual-frame" style="border: 2px solid rgba(56, 189, 248, 0.6); box-shadow: 0 0 40px rgba(56, 189, 248, 0.35); border-radius: 24px; overflow: hidden; height: 100%;">
                        <img src="../assets/slides/slide_23_moon_motions.jpg" alt="Ay'ın 3 Temel Yörünge Hareketi" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                </div>'''

# 7. SLAYT 24
old_s24 = '''                    <div class="visual-panel">
                    <div class="visual-frame">
                        <img src="../assets/sunum5/slide_ref_14.jpg" alt="Aynı Yüzün Görünmesi">
                    </div>
                </div>'''
new_s24 = '''                    <div class="visual-panel" style="flex: 1.1;">
                    <div class="visual-frame" style="border: 2px solid rgba(192, 132, 252, 0.6); box-shadow: 0 0 40px rgba(192, 132, 252, 0.35); border-radius: 24px; overflow: hidden; height: 100%;">
                        <img src="../assets/slides/slide_16_moon_globe.jpg" alt="Ay'ın Senkronize Dönüşü ve Görünür Yüzü" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                </div>'''

# 8. SLAYT 25
old_s25 = '''                    <div class="visual-panel">
                    <div class="visual-frame">
                        <img src="../assets/sunum5/slide_ref_16.jpg" alt="Evre Süreleri">
                    </div>
                </div>'''
new_s25 = '''                    <div class="visual-panel" style="flex: 1.1;">
                    <div class="visual-frame" style="border: 2px solid rgba(251, 191, 36, 0.6); box-shadow: 0 0 40px rgba(251, 191, 36, 0.35); border-radius: 24px; overflow: hidden; height: 100%;">
                        <img src="../assets/slides/slide_23_moon_motions.jpg" alt="Dolanma 27.3 Gün ve Evre 29.5 Gün Farkı" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                </div>'''

# 9. SLAYT 26
old_s26 = '''                    <div class="visual-panel">
                    <div class="visual-frame">
                        <img src="../assets/sunum5/slide_ref_16.jpg" alt="Evrelerin Oluşumu">
                    </div>
                </div>'''
new_s26 = '''                    <div class="visual-panel" style="flex: 1.1;">
                    <div class="visual-frame" style="border: 2px solid rgba(56, 189, 248, 0.6); box-shadow: 0 0 40px rgba(56, 189, 248, 0.35); border-radius: 24px; overflow: hidden; height: 100%;">
                        <img src="../assets/slides/slide_34_eight_phases.jpg" alt="Ay'ın Evrelerinin Oluşum Mekanizması" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                </div>'''

# 10. SLAYT 35
old_s35 = '''<div class="visual-panel">
                    <div class="visual-frame">
                        <img src="../assets/sunum5/slide_ref_15.jpg" alt="Takvim İlişkisi">
                    </div>
                </div>'''
new_s35 = '''<div class="visual-panel" style="flex: 1.1;">
                    <div class="visual-frame" style="border: 2px solid rgba(251, 191, 36, 0.6); box-shadow: 0 0 40px rgba(251, 191, 36, 0.35); border-radius: 24px; overflow: hidden; height: 100%;">
                        <img src="../assets/slides/slide_30_dolunay.jpg" alt="Ay Evre Döngüsü ve Hicri Takvim" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                </div>'''

# 11. SLAYT 37
old_s37 = '''<div class="visual-panel">
                    <div class="visual-frame">
                        <img src="../assets/sunum5/slide_ref_7.jpg" alt="Model">
                    </div>
                </div>'''
new_s37 = '''<div class="visual-panel" style="flex: 1.1;">
                    <div class="visual-frame" style="border: 2px solid rgba(245, 158, 11, 0.6); box-shadow: 0 0 40px rgba(245, 158, 11, 0.35); border-radius: 24px; overflow: hidden; height: 100%;">
                        <img src="../assets/slides/slide_37_model_objects.jpg" alt="Güneş Dünya Ay Nesne Modellemesi" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                </div>'''

replacements = [
    (old_s9, new_s9, "Slayt 9"),
    (old_s10, new_s10, "Slayt 10"),
    (old_s15, new_s15, "Slayt 15"),
    (old_s19, new_s19, "Slayt 19"),
    (old_s20, new_s20, "Slayt 20"),
    (old_s23, new_s23, "Slayt 23"),
    (old_s24, new_s24, "Slayt 24"),
    (old_s25, new_s25, "Slayt 25"),
    (old_s26, new_s26, "Slayt 26"),
    (old_s35, new_s35, "Slayt 35"),
    (old_s37, new_s37, "Slayt 37"),
]

for old, new, label in replacements:
    if old in content:
        content = content.replace(old, new, 1)
        print(f"Replaced {label}")
    else:
        print(f"FAILED to find target for {label}")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Finished applying all remaining slide replacements!")
