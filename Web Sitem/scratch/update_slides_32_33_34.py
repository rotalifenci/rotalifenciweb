path = 'scripts/build_presentation_5_1.py'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# SLAYT 32 Upgrade
old_32 = '''            <div class="slide-body" style="align-items: stretch;">
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 28px; width: 100%;">
                    <div class="info-card glow-cyan">
                        <div class="card-header-bar">
                            <div class="card-icon" style="background: rgba(6,182,212,0.2); color: #22d3ee;"><i class="fa-solid fa-moon"></i></div>
                            <div class="card-title">1. Hilal (Büyüyen Hilal)</div>
                        </div>
                        <ul class="bullet-list">
                            <li class="bullet-item"><i class="fa-solid fa-arrow-right text-cyan-400"></i> <span><strong>Yeni Ay ile İlk Dördün</strong> arasında görülür.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-font text-cyan-400"></i> <span>Dünya'dan bakıldığında <strong>TERS 'C' HARFİ</strong> gibidir.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-chart-line text-cyan-400"></i> <span>Günler geçtikçe aydınlık alan genişler ve İlk Dördün'e ulaşır.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-clock text-amber-400"></i> <span>Akşam gün batımından hemen sonra batı ufkunda görülür.</span></li>
                        </ul>
                    </div>

                    <div class="info-card glow-red">
                        <div class="card-header-bar">
                            <div class="card-icon" style="background: rgba(239,68,68,0.2); color: #ef4444;"><i class="fa-solid fa-flag"></i></div>
                            <div class="card-title">2. Hilal (Küçülen Hilal)</div>
                        </div>
                        <ul class="bullet-list">
                            <li class="bullet-item"><i class="fa-solid fa-arrow-right text-red-400"></i> <span><strong>Son Dördün ile Yeni Ay</strong> arasında görülür.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-font text-red-400"></i> <span>Dünya'dan bakıldığında düz <strong>'C' HARFİ</strong> gibidir.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-star text-amber-400"></i> <span><strong>TÜRK BAYRAĞIMIZDAKİ</strong> hilal bu evredir!</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-clock text-cyan-400"></i> <span>Sabah gün doğumundan hemen önce doğu ufkunda ışıldar.</span></li>
                        </ul>
                    </div>
                </div>
            </div>'''

new_32 = '''            <div class="slide-body" style="gap: 28px;">
                <div style="flex: 1.15; display: flex; flex-direction: column; gap: 14px;">
                    <div class="info-card glow-cyan" style="padding: 16px 20px;">
                        <div style="font-size: 22px; font-weight: 800; color: #38bdf8; margin-bottom: 6px;"><i class="fa-solid fa-moon mr-2"></i> 1. BÜYÜYEN HİLAL (TERS 'C')</div>
                        <p style="font-size: 19px; color: #f1f5f9; line-height: 1.4;"><strong>Yeni Ay ile İlk Dördün</strong> arasında görülür. Akşam gün batımından hemen sonra batı ufkunda incecik zarif bir yay olarak ışıldar.</p>
                    </div>

                    <div class="info-card glow-red" style="padding: 16px 20px;">
                        <div style="font-size: 22px; font-weight: 800; color: #f87171; margin-bottom: 6px;"><i class="fa-solid fa-flag mr-2"></i> 2. KÜÇÜLEN HİLAL (DÜZ 'C' — TÜRK BAYRAĞI)</div>
                        <p style="font-size: 19px; color: #f1f5f9; line-height: 1.4;"><strong>Son Dördün ile Yeni Ay</strong> arasında görülür. <strong>Şanlı Türk Bayrağımızdaki</strong> hilal bu evredir! Sabah gün doğumundan önce doğu ufkunda parlar.</p>
                    </div>

                    <div class="callout-box tip" style="margin-top: 4px; padding: 12px 18px;">
                        <i class="fa-solid fa-lightbulb text-yellow-300 text-2xl"></i>
                        <div style="font-size: 18px;"><strong>ŞİFRE:</strong> Düz 'C' = Bayrağımızın Hilali (Küçülen Hilal) &nbsp;|&nbsp; Ters 'C' = Büyüyen Hilal!</div>
                    </div>
                </div>

                <div class="visual-panel" style="flex: 1.1;">
                    <div class="visual-frame" style="border: 2px solid rgba(56, 189, 248, 0.6); box-shadow: 0 0 40px rgba(56, 189, 248, 0.35); border-radius: 24px; overflow: hidden; height: 100%;">
                        <img src="../assets/slides/slide_32_hilal.jpg" alt="Hilal Evresi 3D Model" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                </div>
            </div>'''

# SLAYT 33 Upgrade
old_33 = '''            <div class="slide-body" style="align-items: stretch;">
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 28px; width: 100%;">
                    <div class="info-card glow-gold">
                        <div class="card-header-bar">
                            <div class="card-icon" style="background: rgba(245,158,11,0.2); color: #fbbf24;"><i class="fa-solid fa-arrow-trend-up"></i></div>
                            <div class="card-title">1. Şişkin Ay (Büyüyen Şişkin)</div>
                        </div>
                        <ul class="bullet-list">
                            <li class="bullet-item"><i class="fa-solid fa-circle-dot text-amber-400"></i> <span><strong>İlk Dördün ile Dolunay</strong> arasında görülür.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-circle-half-stroke text-amber-400"></i> <span>Ay'ın görünen yüzünün <strong>yarıdan fazlası</strong> aydınlıktır.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-arrow-up text-green-400"></i> <span>İlk Dördün'deki D harfi her geçen gece şişmanlayarak Dolunay'a dönüşür!</span></li>
                        </ul>
                    </div>

                    <div class="info-card glow-blue">
                        <div class="card-header-bar">
                            <div class="card-icon" style="background: rgba(59,130,246,0.2); color: #60a5fa;"><i class="fa-solid fa-arrow-trend-down"></i></div>
                            <div class="card-title">2. Şişkin Ay (Küçülen Şişkin)</div>
                        </div>
                        <ul class="bullet-list">
                            <li class="bullet-item"><i class="fa-solid fa-circle-dot text-blue-400"></i> <span><strong>Dolunay ile Son Dördün</strong> arasında görülür.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-circle-half-stroke text-blue-400"></i> <span>Yine <strong>yarıdan fazlası</strong> aydınlıktır; ancak bu kez sağ tarafından incelmeye başlar.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-arrow-down text-cyan-400"></i> <span>Dolunay'dan Son Dördün'e doğru adım adım küçülür.</span></li>
                        </ul>
                    </div>
                </div>
            </div>'''

new_33 = '''            <div class="slide-body" style="gap: 28px;">
                <div style="flex: 1.15; display: flex; flex-direction: column; gap: 14px;">
                    <div class="info-card glow-gold" style="padding: 16px 20px;">
                        <div style="font-size: 22px; font-weight: 800; color: #fbbf24; margin-bottom: 6px;"><i class="fa-solid fa-arrow-trend-up mr-2"></i> 1. BÜYÜYEN ŞİŞKİN AY</div>
                        <p style="font-size: 19px; color: #f1f5f9; line-height: 1.4;"><strong>İlk Dördün ile Dolunay</strong> arasında görülür. Ay'ın Dünya'ya bakan yüzünün yarıdan fazlası aydınlıktır; her gece biraz daha şişmanlar.</p>
                    </div>

                    <div class="info-card glow-blue" style="padding: 16px 20px;">
                        <div style="font-size: 22px; font-weight: 800; color: #60a5fa; margin-bottom: 6px;"><i class="fa-solid fa-arrow-trend-down mr-2"></i> 2. KÜÇÜLEN ŞİŞKİN AY</div>
                        <p style="font-size: 19px; color: #f1f5f9; line-height: 1.4;"><strong>Dolunay ile Son Dördün</strong> arasında görülür. Dolunay'dan sonra sağ tarafından azar azar incelmeye başlayan evredir.</p>
                    </div>

                    <div class="callout-box tip" style="margin-top: 4px; padding: 12px 18px;">
                        <i class="fa-solid fa-lightbulb text-yellow-300 text-2xl"></i>
                        <div style="font-size: 18px;">Şişkin Ay evrelerinde Ay'ın %50'den fazlası parlaktır; ancak henüz tam bir daire (Dolunay) olmamıştır!</div>
                    </div>
                </div>

                <div class="visual-panel" style="flex: 1.1;">
                    <div class="visual-frame" style="border: 2px solid rgba(245, 158, 11, 0.6); box-shadow: 0 0 40px rgba(245, 158, 11, 0.35); border-radius: 24px; overflow: hidden; height: 100%;">
                        <img src="../assets/slides/slide_33_siskin_ay.jpg" alt="Şişkin Ay Evresi 3D Model" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                </div>
            </div>'''

if old_32 in text:
    text = text.replace(old_32, new_32, 1)
    print("Replaced Slide 32")
else:
    print("Could not find Slide 32")

if old_33 in text:
    text = text.replace(old_33, new_33, 1)
    print("Replaced Slide 33")
else:
    print("Could not find Slide 33")

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Slide 32 and 33 upgraded successfully!")
