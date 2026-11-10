import json
import re

with open('oyunlar/uzay-ekspresi.html', 'r', encoding='utf-8') as f:
    template = f.read()

with open('data/sorular_7_1_uzay.json', 'r', encoding='utf-8') as f:
    questions_140 = json.load(f)

print(f"Loaded template of length {len(template)} and {len(questions_140)} questions.")

content = template

# 1. Update Title and Meta
content = content.replace(
    "<title>Rotalı Fenci - Uzay Ekspresi | 6. Sınıf Güneş Sistemi 3D Bilim Treni</title>",
    "<title>Rotalı Fenci - Uzay Ekspresi | 7. Sınıf Güneş Sistemi ve Ötesi 3D Bilim Treni</title>"
)

# 2. Update HUD Badges and Labels
content = content.replace("TÜRK ASTRONOT • 6. SINIF", "TÜRK ASTRONOT • 7. SINIF")
content = content.replace("Güneş Sistemi Keşif Kuşağı", "Güneş Sistemi ve Ötesi Kuşağı")
content = content.replace("Güneş Sistemi Bilgi Kapısı", "Güneş Sistemi ve Ötesi Bilgi Kapısı")
content = content.replace("GÜNEŞ SİSTEMİ BİLGİ KAPISI", "GÜNEŞ SİSTEMİ VE ÖTESİ BİLGİ KAPISI")
content = content.replace("100 Maarif Sorusu", "140 Maarif Sorusu")
content = content.replace("100 Soruluk", "140 Soruluk")
content = content.replace("100 Maarif Modeli", "140 Maarif Modeli")
content = content.replace("6. Sınıf Fen Bilimleri", "7. Sınıf Fen Bilimleri")

# 3. Add Image Container to question-card-top in HUD
img_hud_html = """
                <div id="question-image-container" class="hidden my-1 flex justify-center">
                    <img id="question-image" src="" alt="Soru Görseli" class="max-h-24 sm:max-h-32 rounded-lg border border-amber-400 shadow-md object-contain bg-slate-950/80">
                </div>
"""
old_q_h3 = """<h3 id="question-text" class="text-xs sm:text-sm md:text-base font-black text-white leading-tight font-orbitron">
                    Kızıl Gezegen hangisidir?
                </h3>"""
new_q_h3 = img_hud_html + old_q_h3
content = content.replace(old_q_h3, new_q_h3)

# 4. Add Image Container to question-pause-modal
old_pause_h2 = """<h2 id="pause-q-text" class="text-base sm:text-xl font-black text-white leading-snug font-orbitron drop-shadow">
                    Kızıl Gezegen hangisidir?
                </h2>"""
img_pause_html = """
                <div id="pause-q-image-container" class="hidden my-2 flex justify-center">
                    <img id="pause-q-image" src="" alt="Soru Görseli" class="max-h-36 sm:max-h-48 rounded-xl border-2 border-cyan-400 shadow-xl object-contain bg-slate-900/90">
                </div>
"""
new_pause_h2 = img_pause_html + old_pause_h2
content = content.replace(old_pause_h2, new_pause_h2)

# 5. Update CELESTIAL_BODIES for 7th Grade
celestial_7_js = """        // --- 7. SINIF GÖK CİSİMLERİ & DERİN UZAY KEŞİF KUŞAĞI ---
        const PLANETS = [
            { id: 'earth_orbit', name: 'Alçak Dünya Yörüngesi', type: 'Uzay İstasyonu & Yapay Uydular', color: 0x2277bb, size: 5.0, desc: 'ISS ve milli uydularımızın (Türksat, Göktürk, İMECE) görev alanı.' },
            { id: 'moon', name: 'Ay ve Kraterleri', type: "Dünya'nın Doğal Uydusu", color: 0xcccccc, size: 3.0, desc: "Apollo 11 inişi ve ilk haritasını çıkaran Ali Kuşçu'nun adını taşıyan krater." },
            { id: 'sun', name: 'Güneş (Merkez Yıldız)', type: 'Orta Büyüklükte Sarı Yıldız', color: 0xffaa00, size: 14.0, desc: '6.000 °C yüzey sıcaklığına sahip orta kütleli ana kol yıldızımız.' },
            { id: 'asteroid_belt', name: 'Asteroit Kuşağı', type: 'Mars - Jüpiter Sınırı', color: 0x887766, size: 4.5, desc: 'Karasal iç gezegenler ile gazsal dış gezegenler arasındaki kayaç kuşağı.' },
            { id: 'orion_nebula', name: 'Orion & Atbaşı Bulutsusu', type: 'Karanlık & Parlak Bulutsu', color: 0x9933cc, size: 10.0, desc: 'Yeni yıldızların doğduğu devasa gaz ve toz bulutu (Yıldız Doğumevi).' },
            { id: 'helix_nebula', name: 'Helis (Helix) Bulutsusu', type: 'Gezegenimsi Bulutsu', color: 0x00ccff, size: 9.0, desc: "Dünya'ya en yakın sarmal bulutsu (700 ışık yılı), ömrünü tamamlayan yıldız kalıntısı." },
            { id: 'black_hole', name: 'Süper Kütleli Kara Delik', type: 'Sonsuz Çekim Kozmik Alanı', color: 0x111122, size: 8.0, desc: 'Işığın dahi kaçamadığı, süpernova patlaması sonrası oluşan kozmik çekim.' },
            { id: 'andromeda', name: 'Andromeda Galaksisi', type: 'Dev Komşu Sarmal Gök Ada', color: 0xee88ff, size: 16.0, desc: "Samanyolu galaksimize en yakın (2.5 milyon ışık yılı) dev komşu galaksi." }
        ];"""

planets_pattern = re.compile(r'// --- 6\. SINIF GEZEGENLER & SORU HAVUZU ---\s+const PLANETS = \[.*?\];', re.DOTALL)
content = planets_pattern.sub(celestial_7_js, content)

# 6. Replace ALL_100_MAARIF_QUESTIONS with ALL_140_MAARIF_QUESTIONS
questions_json_formatted = json.dumps(questions_140, ensure_ascii=False, indent=12)
new_questions_js = f"""// --- 7. SINIF 1. ÜNİTE 140 SORULUK RESMİ MAARİF MODELİ SORU HAVUZU ---
        const ALL_140_MAARIF_QUESTIONS = {questions_json_formatted};"""

q_pattern = re.compile(r'// --- 100 SORULUK RESMİ SORU HAVUZU ---\s+const ALL_100_MAARIF_QUESTIONS = \[.*?\];', re.DOTALL)
content = q_pattern.sub(new_questions_js, content)

# Replace references to ALL_100_MAARIF_QUESTIONS
content = content.replace("ALL_100_MAARIF_QUESTIONS", "ALL_140_MAARIF_QUESTIONS")

# 7. Update showQuestionBanner to display image
banner_func_old = """            document.getElementById('question-text').textContent = q.q;
            document.getElementById('gate-option-left').textContent = isLeftCorrect ? q.correct : q.wrong;
            document.getElementById('gate-option-right').textContent = !isLeftCorrect ? q.correct : q.wrong;
            banner.classList.remove('hidden');"""

banner_func_new = """            document.getElementById('question-text').textContent = q.q;
            document.getElementById('gate-option-left').textContent = isLeftCorrect ? q.correct : q.wrong;
            document.getElementById('gate-option-right').textContent = !isLeftCorrect ? q.correct : q.wrong;
            
            const qImgCont = document.getElementById('question-image-container');
            const qImg = document.getElementById('question-image');
            if (q.image && qImgCont && qImg) {
                qImg.src = q.image;
                qImgCont.classList.remove('hidden');
            } else if (qImgCont) {
                qImgCont.classList.add('hidden');
            }

            banner.classList.remove('hidden');"""
content = content.replace(banner_func_old, banner_func_new)

# 8. Update startQuestionPause to display image
pause_func_old = """            document.getElementById('pause-q-text').textContent = q.q;
            document.getElementById('pause-option-left').textContent = isLeftCorrect ? q.correct : q.wrong;
            document.getElementById('pause-option-right').textContent = !isLeftCorrect ? q.correct : q.wrong;"""

pause_func_new = """            document.getElementById('pause-q-text').textContent = q.q;
            document.getElementById('pause-option-left').textContent = isLeftCorrect ? q.correct : q.wrong;
            document.getElementById('pause-option-right').textContent = !isLeftCorrect ? q.correct : q.wrong;

            const pauseImgCont = document.getElementById('pause-q-image-container');
            const pauseImg = document.getElementById('pause-q-image');
            if (q.image && pauseImgCont && pauseImg) {
                pauseImg.src = q.image;
                pauseImgCont.classList.remove('hidden');
            } else if (pauseImgCont) {
                pauseImgCont.classList.add('hidden');
            } else if (pauseImgCont) {
                pauseImgCont.classList.add('hidden');
            }"""
content = content.replace(pause_func_old, pause_func_new)

# Save to oyunlar/uzay-ekspresi-7.html
with open('oyunlar/uzay-ekspresi-7.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Başarıyla oyunlar/uzay-ekspresi-7.html oluşturuldu! Boyut:", len(content))
