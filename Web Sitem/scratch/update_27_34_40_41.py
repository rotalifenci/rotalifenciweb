import re

file_path = 'scripts/build_presentation_5_1.py'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. UPGRADE SLAYT 27
old_s27 = """    # SLAYT 27 — AY'IN 4 ANA EVRESİ
    {
        "num": 27,
        "kicker": "1.3 AY'IN HAREKETLERİ VE EVRELERİ",
        "title": "Ay'ın 4 Ana Evresi",
        "subtitle": "Ay'ın evreleri yaklaşık 29,5 günde bir tamamlanır. Ana evreler arası yaklaşık 1 haftadır (7 gün)!",
        "html": \"\"\"
            <div class="slide-body" style="align-items: stretch;">
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; width: 100%;">
                    <div class="info-card" style="border-color: rgba(148, 163, 184, 0.4); text-align: center; justify-content: space-between;" onclick="showSlide(28)">
                        <div>
                            <span style="font-size: 16px; font-weight: 800; color: #94a3b8;">1. HAFTA</span>
                            <h3 style="font-size: 28px; font-weight: 900; color: #fff; margin: 10px 0;">YENİ AY</h3>
                            <div style="width: 100px; height: 100px; border-radius: 50%; background: #0f172a; border: 3px dashed #64748b; margin: 20px auto;"></div>
                            <p style="font-size: 18px; color: #cbd5e1;">Dünya'ya bakan yüzü ışık almaz, <strong>gökyüzünde görünmez</strong>.</p>
                        </div>
                        <span style="font-size: 15px; font-weight: 700; color: #38bdf8;">Tıkla ve İncele <i class="fa-solid fa-arrow-right"></i></span>
                    </div>

                    <div class="info-card glow-cyan" style="text-align: center; justify-content: space-between;" onclick="showSlide(29)">
                        <div>
                            <span style="font-size: 16px; font-weight: 800; color: #38bdf8;">2. HAFTA (~7 Gün Sonra)</span>
                            <h3 style="font-size: 28px; font-weight: 900; color: #fff; margin: 10px 0;">İLK DÖRDÜN</h3>
                            <div style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(90deg, #0f172a 50%, #f8fafc 50%); border: 3px solid #38bdf8; margin: 20px auto; box-shadow: 0 0 20px rgba(56,189,248,0.4);"></div>
                            <p style="font-size: 18px; color: #cbd5e1;">Sağ yarısı aydınlıktır. <strong>D harfi</strong> gibidir.</p>
                        </div>
                        <span style="font-size: 15px; font-weight: 700; color: #38bdf8;">Tıkla ve İncele <i class="fa-solid fa-arrow-right"></i></span>
                    </div>

                    <div class="info-card glow-gold" style="text-align: center; justify-content: space-between;" onclick="showSlide(30)">
                        <div>
                            <span style="font-size: 16px; font-weight: 800; color: #fbbf24;">3. HAFTA (~14 Gün Sonra)</span>
                            <h3 style="font-size: 28px; font-weight: 900; color: #fff; margin: 10px 0;">DOLUNAY</h3>
                            <div style="width: 100px; height: 100px; border-radius: 50%; background: #fef08a; border: 3px solid #f59e0b; margin: 20px auto; box-shadow: 0 0 30px rgba(254,240,138,0.7);"></div>
                            <p style="font-size: 18px; color: #cbd5e1;">Tamamı aydınlıktır. Parlak bir daire şeklinde görülür.</p>
                        </div>
                        <span style="font-size: 15px; font-weight: 700; color: #38bdf8;">Tıkla ve İncele <i class="fa-solid fa-arrow-right"></i></span>
                    </div>

                    <div class="info-card glow-blue" style="text-align: center; justify-content: space-between;" onclick="showSlide(31)">
                        <div>
                            <span style="font-size: 16px; font-weight: 800; color: #60a5fa;">4. HAFTA (~21 Gün Sonra)</span>
                            <h3 style="font-size: 28px; font-weight: 900; color: #fff; margin: 10px 0;">SON DÖRDÜN</h3>
                            <div style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(90deg, #f8fafc 50%, #0f172a 50%); border: 3px solid #60a5fa; margin: 20px auto; box-shadow: 0 0 20px rgba(96,165,250,0.4);"></div>
                            <p style="font-size: 18px; color: #cbd5e1;">Sol yarısı aydınlıktır. <strong>Ters D harfi</strong> gibidir.</p>
                        </div>
                        <span style="font-size: 15px; font-weight: 700; color: #38bdf8;">Tıkla ve İncele <i class="fa-solid fa-arrow-right"></i></span>
                    </div>
                </div>
            </div>
        \"\"\"
    },"""

new_s27 = """    # SLAYT 27 — AY'IN 4 ANA EVRESİ
    {
        "num": 27,
        "kicker": "1.3 AY'IN HAREKETLERİ VE EVRELERİ",
        "title": "Ay'ın 4 Ana Evresi: Sinematik Karşılaştırma",
        "subtitle": "Ay'ın evreleri yaklaşık 29,5 günde bir tamamlanır. Ana evreler arası tam 1 haftadır (7 gün)!",
        "html": \"\"\"
            <div class="slide-body" style="align-items: stretch;">
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; width: 100%;">
                    <div class="info-card glow-slate" style="text-align: center; justify-content: space-between; cursor: pointer; border: 2px solid rgba(148, 163, 184, 0.5);" onclick="showSlide(28)">
                        <div>
                            <div style="display: inline-block; padding: 4px 12px; background: rgba(148, 163, 184, 0.2); border-radius: 20px; font-size: 15px; font-weight: 800; color: #94a3b8; margin-bottom: 8px;">1. HAFTA (BAŞLANGIÇ)</div>
                            <h3 style="font-size: 26px; font-weight: 900; color: #ffffff; margin: 6px 0 14px;">YENİ AY</h3>
                            <div style="width: 140px; height: 140px; border-radius: 50%; overflow: hidden; margin: 10px auto; border: 3px solid #64748b; box-shadow: 0 0 25px rgba(100,116,139,0.5); background: #000;">
                                <img src="../assets/slides/slide_28_yeni_ay.jpg" alt="Yeni Ay 3D" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                            <p style="font-size: 18px; color: #cbd5e1; line-height: 1.4; margin-top: 10px;">Dünya'ya bakan yüzü Güneş ışığı almaz. <strong>Gökyüzünde görünmez!</strong></p>
                        </div>
                        <div style="margin-top: 12px; padding: 8px; background: rgba(255,255,255,0.06); border-radius: 12px; font-size: 15px; font-weight: 800; color: #38bdf8;">
                            Slayta Git <i class="fa-solid fa-arrow-right ml-1"></i>
                        </div>
                    </div>

                    <div class="info-card glow-cyan" style="text-align: center; justify-content: space-between; cursor: pointer; border: 2px solid #38bdf8;" onclick="showSlide(29)">
                        <div>
                            <div style="display: inline-block; padding: 4px 12px; background: rgba(56, 189, 248, 0.2); border-radius: 20px; font-size: 15px; font-weight: 800; color: #38bdf8; margin-bottom: 8px;">2. HAFTA (~7 GÜN)</div>
                            <h3 style="font-size: 26px; font-weight: 900; color: #ffffff; margin: 6px 0 14px;">İLK DÖRDÜN</h3>
                            <div style="width: 140px; height: 140px; border-radius: 50%; overflow: hidden; margin: 10px auto; border: 3px solid #38bdf8; box-shadow: 0 0 30px rgba(56,189,248,0.5); background: #000;">
                                <img src="../assets/slides/slide_29_ilk_dordun.jpg" alt="İlk Dördün 3D" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                            <p style="font-size: 18px; color: #cbd5e1; line-height: 1.4; margin-top: 10px;">Ay'ın sağ yarısı aydınlıktır. Gökyüzünde <strong>düz «D» harfi</strong> gibi görünür.</p>
                        </div>
                        <div style="margin-top: 12px; padding: 8px; background: rgba(56,189,248,0.15); border-radius: 12px; font-size: 15px; font-weight: 800; color: #38bdf8;">
                            Slayta Git <i class="fa-solid fa-arrow-right ml-1"></i>
                        </div>
                    </div>

                    <div class="info-card glow-gold" style="text-align: center; justify-content: space-between; cursor: pointer; border: 2px solid #fbbf24;" onclick="showSlide(30)">
                        <div>
                            <div style="display: inline-block; padding: 4px 12px; background: rgba(251, 191, 36, 0.2); border-radius: 20px; font-size: 15px; font-weight: 800; color: #fbbf24; margin-bottom: 8px;">3. HAFTA (~14 GÜN)</div>
                            <h3 style="font-size: 26px; font-weight: 900; color: #ffffff; margin: 6px 0 14px;">DOLUNAY</h3>
                            <div style="width: 140px; height: 140px; border-radius: 50%; overflow: hidden; margin: 10px auto; border: 3px solid #fbbf24; box-shadow: 0 0 35px rgba(251,191,36,0.6); background: #000;">
                                <img src="../assets/slides/slide_30_dolunay.jpg" alt="Dolunay 3D" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                            <p style="font-size: 18px; color: #cbd5e1; line-height: 1.4; margin-top: 10px;">Dünya'ya bakan yüzü tamamen aydınlıktır. <strong>Işıl ışıl tam dairedir.</strong></p>
                        </div>
                        <div style="margin-top: 12px; padding: 8px; background: rgba(251,191,36,0.15); border-radius: 12px; font-size: 15px; font-weight: 800; color: #fbbf24;">
                            Slayta Git <i class="fa-solid fa-arrow-right ml-1"></i>
                        </div>
                    </div>

                    <div class="info-card glow-blue" style="text-align: center; justify-content: space-between; cursor: pointer; border: 2px solid #60a5fa;" onclick="showSlide(31)">
                        <div>
                            <div style="display: inline-block; padding: 4px 12px; background: rgba(96, 165, 250, 0.2); border-radius: 20px; font-size: 15px; font-weight: 800; color: #60a5fa; margin-bottom: 8px;">4. HAFTA (~21 GÜN)</div>
                            <h3 style="font-size: 26px; font-weight: 900; color: #ffffff; margin: 6px 0 14px;">SON DÖRDÜN</h3>
                            <div style="width: 140px; height: 140px; border-radius: 50%; overflow: hidden; margin: 10px auto; border: 3px solid #60a5fa; box-shadow: 0 0 30px rgba(96,165,250,0.5); background: #000;">
                                <img src="../assets/slides/slide_31_son_dordun.jpg" alt="Son Dördün 3D" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                            <p style="font-size: 18px; color: #cbd5e1; line-height: 1.4; margin-top: 10px;">Ay'ın sol yarısı aydınlıktır. Gökyüzünde <strong>ters «D» harfi</strong> gibi görünür.</p>
                        </div>
                        <div style="margin-top: 12px; padding: 8px; background: rgba(96,165,250,0.15); border-radius: 12px; font-size: 15px; font-weight: 800; color: #60a5fa;">
                            Slayta Git <i class="fa-solid fa-arrow-right ml-1"></i>
                        </div>
                    </div>
                </div>
            </div>
        \"\"\"
    },"""

if old_s27 in content:
    content = content.replace(old_s27, new_s27)
    print("Replaced Slide 27 with 3D photorealistic lunar spheres!")
else:
    print("WARNING: Could not find exact Slide 27 match!")

# 2. UPGRADE SLAYT 34
old_s34 = """    # SLAYT 34 — AY'IN 8 EVRESİ
    {
        "num": 34,
        "kicker": "1.3 AY'IN HAREKETLERİ VE EVRELERİ",
        "title": "Ay'ın 8 Evresinin Kusursuz Döngüsü",
        "subtitle": "Yeni Ay ile başlar, 4 ana ve 4 ara evre sırasıyla birbirini takip eder!",
        "html": \"\"\"
            <div class="slide-body" style="flex-direction: column; justify-content: center;">
                <div class="info-card glow-gold" style="width: 100%; padding: 25px 20px;">
                    <div style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 12px; text-align: center;">
                        <div style="background: rgba(255,255,255,0.05); padding: 15px 8px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
                            <span style="font-size: 13px; font-weight: 800; color: #94a3b8;">1. ANA</span>
                            <div style="width: 55px; height: 55px; border-radius: 50%; background: #0f172a; border: 2px dashed #64748b; margin: 10px auto;"></div>
                            <strong style="font-size: 17px; color: #fff;">Yeni Ay</strong>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); padding: 15px 8px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
                            <span style="font-size: 13px; font-weight: 800; color: #38bdf8;">2. ARA</span>
                            <div style="width: 55px; height: 55px; border-radius: 50%; background: #0f172a; border-right: 8px solid #f8fafc; margin: 10px auto;"></div>
                            <strong style="font-size: 17px; color: #38bdf8;">Hilal</strong>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); padding: 15px 8px; border-radius: 16px; border: 2px solid #38bdf8;">
                            <span style="font-size: 13px; font-weight: 800; color: #38bdf8;">3. ANA</span>
                            <div style="width: 55px; height: 55px; border-radius: 50%; background: linear-gradient(90deg, #0f172a 50%, #f8fafc 50%); margin: 10px auto;"></div>
                            <strong style="font-size: 17px; color: #38bdf8;">İlk Dördün</strong>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); padding: 15px 8px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
                            <span style="font-size: 13px; font-weight: 800; color: #fde047;">4. ARA</span>
                            <div style="width: 55px; height: 55px; border-radius: 50%; background: linear-gradient(90deg, #0f172a 20%, #f8fafc 20%); margin: 10px auto;"></div>
                            <strong style="font-size: 17px; color: #fde047;">Şişkin Ay</strong>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); padding: 15px 8px; border-radius: 16px; border: 2px solid #f59e0b;">
                            <span style="font-size: 13px; font-weight: 800; color: #f59e0b;">5. ANA</span>
                            <div style="width: 55px; height: 55px; border-radius: 50%; background: #fef08a; margin: 10px auto; box-shadow: 0 0 15px #fef08a;"></div>
                            <strong style="font-size: 17px; color: #fef08a;">Dolunay</strong>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); padding: 15px 8px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
                            <span style="font-size: 13px; font-weight: 800; color: #fde047;">6. ARA</span>
                            <div style="width: 55px; height: 55px; border-radius: 50%; background: linear-gradient(90deg, #f8fafc 80%, #0f172a 80%); margin: 10px auto;"></div>
                            <strong style="font-size: 17px; color: #fde047;">Şişkin Ay</strong>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); padding: 15px 8px; border-radius: 16px; border: 2px solid #60a5fa;">
                            <span style="font-size: 13px; font-weight: 800; color: #60a5fa;">7. ANA</span>
                            <div style="width: 55px; height: 55px; border-radius: 50%; background: linear-gradient(90deg, #f8fafc 50%, #0f172a 50%); margin: 10px auto;"></div>
                            <strong style="font-size: 17px; color: #60a5fa;">Son Dördün</strong>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); padding: 15px 8px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
                            <span style="font-size: 13px; font-weight: 800; color: #f87171;">8. ARA</span>
                            <div style="width: 55px; height: 55px; border-radius: 50%; background: #0f172a; border-left: 8px solid #f8fafc; margin: 10px auto;"></div>
                            <strong style="font-size: 17px; color: #f87171;">Hilal</strong>
                        </div>
                    </div>
                </div>
            </div>
        \"\"\"
    },"""

new_s34 = """    # SLAYT 34 — AY'IN 8 EVRESİ
    {
        "num": 34,
        "kicker": "1.3 AY'IN HAREKETLERİ VE EVRELERİ",
        "title": "Ay'ın 8 Evresinin Kusursuz Döngüsü",
        "subtitle": "Yeni Ay ile başlar, 4 ana ve 4 ara evre sırasıyla birbirini takip eder!",
        "html": \"\"\"
            <div class="slide-body" style="flex-direction: column; gap: 18px; justify-content: space-between;">
                <!-- 3D 8 Evre Yörünge Panoraması -->
                <div class="visual-frame" style="width: 100%; height: 380px; border: 2px solid rgba(56, 189, 248, 0.6); box-shadow: 0 0 35px rgba(56, 189, 248, 0.25); border-radius: 20px; overflow: hidden;">
                    <img src="../assets/slides/slide_34_eight_phases.jpg" alt="Ay'ın 8 Evresi 3D Yörünge Modeli" style="width: 100%; height: 100%; object-fit: cover;">
                </div>

                <!-- 8 Evre Kronolojik Kartları -->
                <div class="info-card glow-cyan" style="width: 100%; padding: 16px 20px;">
                    <div style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 10px; text-align: center;">
                        <div style="background: rgba(255,255,255,0.05); padding: 10px 6px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.15);">
                            <span style="font-size: 12px; font-weight: 800; color: #94a3b8;">1. ANA</span>
                            <div style="width: 48px; height: 48px; border-radius: 50%; overflow: hidden; margin: 6px auto; border: 2px solid #64748b;">
                                <img src="../assets/slides/slide_28_yeni_ay.jpg" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                            <strong style="font-size: 15px; color: #fff;">Yeni Ay</strong>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); padding: 10px 6px; border-radius: 14px; border: 1px solid rgba(56,189,248,0.3);">
                            <span style="font-size: 12px; font-weight: 800; color: #38bdf8;">2. ARA</span>
                            <div style="width: 48px; height: 48px; border-radius: 50%; overflow: hidden; margin: 6px auto; border: 2px solid #38bdf8;">
                                <img src="../assets/slides/slide_32_hilal.jpg" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                            <strong style="font-size: 15px; color: #38bdf8;">Hilal</strong>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); padding: 10px 6px; border-radius: 14px; border: 2px solid #38bdf8;">
                            <span style="font-size: 12px; font-weight: 800; color: #38bdf8;">3. ANA</span>
                            <div style="width: 48px; height: 48px; border-radius: 50%; overflow: hidden; margin: 6px auto; border: 2px solid #38bdf8; box-shadow: 0 0 10px rgba(56,189,248,0.5);">
                                <img src="../assets/slides/slide_29_ilk_dordun.jpg" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                            <strong style="font-size: 15px; color: #38bdf8;">İlk Dördün</strong>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); padding: 10px 6px; border-radius: 14px; border: 1px solid rgba(253,224,71,0.3);">
                            <span style="font-size: 12px; font-weight: 800; color: #fde047;">4. ARA</span>
                            <div style="width: 48px; height: 48px; border-radius: 50%; overflow: hidden; margin: 6px auto; border: 2px solid #fde047;">
                                <img src="../assets/slides/slide_33_siskin_ay.jpg" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                            <strong style="font-size: 15px; color: #fde047;">Şişkin Ay</strong>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); padding: 10px 6px; border-radius: 14px; border: 2px solid #f59e0b;">
                            <span style="font-size: 12px; font-weight: 800; color: #f59e0b;">5. ANA</span>
                            <div style="width: 48px; height: 48px; border-radius: 50%; overflow: hidden; margin: 6px auto; border: 2px solid #f59e0b; box-shadow: 0 0 15px #fef08a;">
                                <img src="../assets/slides/slide_30_dolunay.jpg" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                            <strong style="font-size: 15px; color: #fef08a;">Dolunay</strong>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); padding: 10px 6px; border-radius: 14px; border: 1px solid rgba(253,224,71,0.3);">
                            <span style="font-size: 12px; font-weight: 800; color: #fde047;">6. ARA</span>
                            <div style="width: 48px; height: 48px; border-radius: 50%; overflow: hidden; margin: 6px auto; border: 2px solid #fde047;">
                                <img src="../assets/slides/slide_33_siskin_ay.jpg" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                            <strong style="font-size: 15px; color: #fde047;">Şişkin Ay</strong>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); padding: 10px 6px; border-radius: 14px; border: 2px solid #60a5fa;">
                            <span style="font-size: 12px; font-weight: 800; color: #60a5fa;">7. ANA</span>
                            <div style="width: 48px; height: 48px; border-radius: 50%; overflow: hidden; margin: 6px auto; border: 2px solid #60a5fa; box-shadow: 0 0 10px rgba(96,165,250,0.5);">
                                <img src="../assets/slides/slide_31_son_dordun.jpg" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                            <strong style="font-size: 15px; color: #60a5fa;">Son Dördün</strong>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); padding: 10px 6px; border-radius: 14px; border: 1px solid rgba(248,113,113,0.3);">
                            <span style="font-size: 12px; font-weight: 800; color: #f87171;">8. ARA</span>
                            <div style="width: 48px; height: 48px; border-radius: 50%; overflow: hidden; margin: 6px auto; border: 2px solid #f87171;">
                                <img src="../assets/slides/slide_32_hilal.jpg" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                            <strong style="font-size: 15px; color: #f87171;">Hilal</strong>
                        </div>
                    </div>
                </div>
            </div>
        \"\"\"
    },"""

if old_s34 in content:
    content = content.replace(old_s34, new_s34)
    print("Replaced Slide 34 with 3D diagram and real lunar thumbnails!")
else:
    print("WARNING: Could not find exact Slide 34 match!")

# 3. UPGRADE SLAYT 40 (Uzay Tarihi & Öncüler)
old_s40 = """    # SLAYT 40 — BİLİM İNSANLARI & TARİH
    {
        "num": 40,
        "kicker": "UZAY BİLİM TARİHİ",
        "title": "Uzay Araştırmaları ve Tarihin Öncüleri",
        "subtitle": "İnsanlığın uzaya açılma yolculuğunda önemli kilometre taşları!",
        "html": \"\"\"
            <div class="slide-body" style="align-items: stretch;">
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; width: 100%;">
                    <div class="info-card glow-blue">
                        <span style="font-size: 18px; font-weight: 800; color: #38bdf8;">1957</span>
                        <h3 style="font-size: 24px; font-weight: 800; color: #fff; margin: 8px 0;">Sputnik-1</h3>
                        <p style="font-size: 18px; color: #cbd5e1; line-height: 1.4;">Uzaya gönderilen ilk yapay uydudur (Sovyetler Birliği tarafından fırlatılmıştır).</p>
                    </div>

                    <div class="info-card glow-cyan">
                        <span style="font-size: 18px; font-weight: 800; color: #22d3ee;">1957</span>
                        <h3 style="font-size: 24px; font-weight: 800; color: #fff; margin: 8px 0;">Laika (Layka)</h3>
                        <p style="font-size: 18px; color: #cbd5e1; line-height: 1.4;">Sputnik-2 aracıyla uzay yörüngesine çıkan ilk canlı köpek olmuştur.</p>
                    </div>

                    <div class="info-card glow-gold">
                        <span style="font-size: 18px; font-weight: 800; color: #fbbf24;">1961</span>
                        <h3 style="font-size: 24px; font-weight: 800; color: #fff; margin: 8px 0;">Yuri Gagarin</h3>
                        <p style="font-size: 18px; color: #cbd5e1; line-height: 1.4;">Vostok-1 ile uzaya çıkan ilk insan olmuştur: 'Dünya mavidir, ne kadar harika!' demiştir.</p>
                    </div>

                    <div class="info-card glow-red">
                        <span style="font-size: 18px; font-weight: 800; color: #f87171;">1969</span>
                        <h3 style="font-size: 24px; font-weight: 800; color: #fff; margin: 8px 0;">Neil Armstrong</h3>
                        <p style="font-size: 18px; color: #cbd5e1; line-height: 1.4;">Apollo-11 ile Ay'a ayak basan ilk insan: 'Benim için küçük, insanlık için dev bir adım!' demiştir.</p>
                    </div>
                </div>
            </div>
        \"\"\"
    },"""

new_s40 = """    # SLAYT 40 — BİLİM İNSANLARI & TARİH
    {
        "num": 40,
        "kicker": "UZAY BİLİM TARİHİ",
        "title": "Uzay Araştırmaları ve Tarihin Öncüleri",
        "subtitle": "İnsanlığın uzaya açılma yolculuğunda en büyük 4 tarihi adım!",
        "html": \"\"\"
            <div class="slide-body" style="align-items: stretch; gap: 20px;">
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; width: 100%;">
                    <div class="info-card glow-blue" style="border: 2px solid #38bdf8; display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                                <span style="font-size: 22px; font-weight: 900; color: #38bdf8;">1957</span>
                                <i class="fa-solid fa-satellite text-cyan-400 text-3xl"></i>
                            </div>
                            <h3 style="font-size: 26px; font-weight: 800; color: #fff; margin-bottom: 12px;">Sputnik-1</h3>
                            <div style="width: 100%; height: 140px; border-radius: 14px; overflow: hidden; margin-bottom: 14px; border: 1px solid rgba(56,189,248,0.3);">
                                <img src="../assets/slides/slide_3_universe_space.jpg" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                            <p style="font-size: 17px; color: #cbd5e1; line-height: 1.4;">Uzaya gönderilen ve Dünya yörüngesine yerleşen <strong>ilk yapay uydu</strong> olmuştur.</p>
                        </div>
                        <div style="padding: 8px; background: rgba(56,189,248,0.1); border-radius: 10px; font-size: 14px; font-weight: 700; color: #38bdf8; text-align: center;">Uzay Çağının Başlangıcı</div>
                    </div>

                    <div class="info-card glow-cyan" style="border: 2px solid #22d3ee; display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                                <span style="font-size: 22px; font-weight: 900; color: #22d3ee;">1957</span>
                                <i class="fa-solid fa-paw text-cyan-300 text-3xl"></i>
                            </div>
                            <h3 style="font-size: 26px; font-weight: 800; color: #fff; margin-bottom: 12px;">Laika (Layka)</h3>
                            <div style="width: 100%; height: 140px; border-radius: 14px; overflow: hidden; margin-bottom: 14px; border: 1px solid rgba(34,211,238,0.3);">
                                <img src="../assets/slides/slide_4_earth_globe.jpg" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                            <p style="font-size: 17px; color: #cbd5e1; line-height: 1.4;">Sputnik-2 ile yörüngeye çıkan ve uzay ortamının canlılar üzerindeki etkisini kanıtlayan <strong>ilk canlı köpek</strong>.</p>
                        </div>
                        <div style="padding: 8px; background: rgba(34,211,238,0.1); border-radius: 10px; font-size: 14px; font-weight: 700; color: #22d3ee; text-align: center;">İlk Canlı Yolcu</div>
                    </div>

                    <div class="info-card glow-gold" style="border: 2px solid #fbbf24; display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                                <span style="font-size: 22px; font-weight: 900; color: #fbbf24;">1961</span>
                                <i class="fa-solid fa-user-astronaut text-yellow-400 text-3xl"></i>
                            </div>
                            <h3 style="font-size: 26px; font-weight: 800; color: #fff; margin-bottom: 12px;">Yuri Gagarin</h3>
                            <div style="width: 100%; height: 140px; border-radius: 14px; overflow: hidden; margin-bottom: 14px; border: 1px solid rgba(251,191,36,0.3);">
                                <img src="../assets/slides/slide_earth_hd.jpg" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                            <p style="font-size: 17px; color: #cbd5e1; line-height: 1.4;">Vostok-1 ile <strong>uzaya çıkan ilk insan</strong> olmuştur: <em>«Dünya masmavidir, ne kadar harika!»</em></p>
                        </div>
                        <div style="padding: 8px; background: rgba(251,191,36,0.1); border-radius: 10px; font-size: 14px; font-weight: 700; color: #fbbf24; text-align: center;">Uzaydaki İlk İnsan</div>
                    </div>

                    <div class="info-card glow-red" style="border: 2px solid #f87171; display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                                <span style="font-size: 22px; font-weight: 900; color: #f87171;">1969</span>
                                <i class="fa-solid fa-shoe-prints text-red-400 text-3xl"></i>
                            </div>
                            <h3 style="font-size: 26px; font-weight: 800; color: #fff; margin-bottom: 12px;">Neil Armstrong</h3>
                            <div style="width: 100%; height: 140px; border-radius: 14px; overflow: hidden; margin-bottom: 14px; border: 1px solid rgba(248,113,113,0.3);">
                                <img src="../assets/slides/slide_20_astronaut_gravity.jpg" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                            <p style="font-size: 17px; color: #cbd5e1; line-height: 1.4;">Apollo-11 ile <strong>Ay'a ayak basan ilk insan</strong>: <em>«Benim için küçük, insanlık için dev bir adım!»</em></p>
                        </div>
                        <div style="padding: 8px; background: rgba(248,113,113,0.1); border-radius: 10px; font-size: 14px; font-weight: 700; color: #f87171; text-align: center;">Ay'a İlk Ayak Basış</div>
                    </div>
                </div>
            </div>
        \"\"\"
    },"""

if old_s40 in content:
    content = content.replace(old_s40, new_s40)
    print("Replaced Slide 40 with 3D historical cards!")
else:
    print("WARNING: Could not find exact Slide 40 match!")

# 4. UPGRADE SLAYT 41 (Final Tebrikler & Başarı Kartı)
old_s41 = """    # SLAYT 41 — TEBRİKLER & ÖZET BİTİŞ
    {
        "num": 41,
        "kicker": "TEBRİKLER!",
        "title": "1. Üniteyi Başarıyla Tamamladın!",
        "subtitle": "Güneş, Dünya ve Ay'ın tüm sırlarını ve hareket modellerini öğrendin!",
        "html": \"\"\"
            <div class="slide-body" style="align-items: center; justify-content: center; text-align: center;">
                <div class="info-card glow-gold" style="max-width: 1000px; padding: 50px 60px; align-items: center;">
                    <div style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, #f59e0b, #ef4444); color: white; display: flex; align-items: center; justify-content: center; font-size: 48px; box-shadow: 0 0 40px rgba(239,68,68,0.5);">
                        <i class="fa-solid fa-trophy"></i>
                    </div>
                    <h2 style="font-size: 52px; font-weight: 900; color: #ffffff; margin-top: 15px;">HARİKA BİR BAŞARI!</h2>
                    <p style="font-size: 26px; font-weight: 600; color: #cbd5e1; line-height: 1.5; margin: 15px 0;">
                        Güneş'in dev enerjisini, Ay'ın kraterlerini, senkronize dönüşünü ve sekiz evresini başarıyla öğrendin. Artık gece gökyüzüne baktığında Ay'ın hangi evrede olduğunu bir bilim insanı gibi söyleyebilirsin!
                    </p>
                    <div style="display: flex; gap: 20px; margin-top: 25px;">
                        <button onclick="showSlide(1)" class="tool-btn primary" style="height: 60px; padding: 0 32px; font-size: 22px; border-radius: 30px;">
                            <i class="fa-solid fa-rotate-left"></i> <span>En Başa Dön</span>
                        </button>
                        <button onclick="window.print()" class="tool-btn" style="height: 60px; padding: 0 32px; font-size: 22px; border-radius: 30px;">
                            <i class="fa-solid fa-print"></i> <span>Sunumu Yazdır / PDF</span>
                        </button>
                    </div>
                </div>
            </div>
        \"\"\"
    }"""

new_s41 = """    # SLAYT 41 — TEBRİKLER & ÖZET BİTİŞ
    {
        "num": 41,
        "kicker": "TEBRİKLER! • ÜNİTE TAMAMLANDI",
        "title": "1. Üniteyi Başarıyla Tamamladın!",
        "subtitle": "Güneş, Dünya ve Ay'ın tüm sırlarını, katmanlarını ve hareket modellerini keşfettin!",
        "html": \"\"\"
            <div class="slide-body" style="align-items: center; justify-content: center;">
                <div class="info-card glow-gold" style="max-width: 1200px; width: 100%; padding: 40px 50px; display: flex; flex-direction: row; gap: 40px; align-items: center; border: 3px solid #fbbf24; box-shadow: 0 0 60px rgba(251,191,36,0.3);">
                    <div style="flex: 1; text-align: left;">
                        <div style="display: inline-flex; align-items: center; gap: 10px; padding: 8px 20px; background: rgba(251,191,36,0.2); border: 2px solid #fbbf24; border-radius: 30px; font-size: 18px; font-weight: 800; color: #fbbf24; margin-bottom: 16px;">
                            <i class="fa-solid fa-award text-2xl"></i> GENÇ BİLİM İNSANI ROZETİ KAZANILDI
                        </div>
                        <h2 style="font-size: 54px; font-weight: 900; line-height: 1.1; color: #ffffff; margin-bottom: 16px;">
                            HARİKA BİR BAŞARI!
                        </h2>
                        <p style="font-size: 22px; font-weight: 600; color: #cbd5e1; line-height: 1.5; margin-bottom: 24px;">
                            Güneş'in dev enerjisini ve katmanlarını, Ay'ın kraterlerini ve atmosferini, Dünya ve Ay'ın dönme/dolanma sürelerini, ve 8 Ay evresinin sıralamasını eksiksiz öğrendin!
                        </p>
                        <div style="display: flex; gap: 16px;">
                            <button onclick="showSlide(1)" class="tool-btn primary" style="height: 60px; padding: 0 32px; font-size: 22px; border-radius: 30px;">
                                <i class="fa-solid fa-rotate-left"></i> <span>En Başa Dön</span>
                            </button>
                            <button onclick="toggleDrawer()" class="tool-btn" style="height: 60px; padding: 0 28px; font-size: 20px; border-radius: 30px;">
                                <i class="fa-solid fa-list-check"></i> <span>Tüm Slayt Listesi</span>
                            </button>
                        </div>
                    </div>
                    <div style="flex: 0.9; height: 380px; border-radius: 24px; overflow: hidden; border: 3px solid rgba(255,255,255,0.2); box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
                        <img src="../assets/sunum-5-1-referans-kapak.jpg" alt="Ünite Tamamlandı" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                </div>
            </div>
        \"\"\"
    }"""

if old_s41 in content:
    content = content.replace(old_s41, new_s41)
    print("Replaced Slide 41 with celebratory 3D layout!")
else:
    print("WARNING: Could not find exact Slide 41 match!")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Finished updating scripts/build_presentation_5_1.py!")
