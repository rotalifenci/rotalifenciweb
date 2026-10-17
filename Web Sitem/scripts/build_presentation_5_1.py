# -*- coding: utf-8 -*-
import os

slides = [
    # SLAYT 1 — KAPAK
    {
        "num": 1,
        "kicker": "5. SINIF FEN BİLİMLERİ • 1. ÜNİTE",
        "title": "GÜNEŞ, DÜNYA VE AY",
        "subtitle": "Akıllı Tahta Sinematik Konu Anlatımı & İnteraktif Öğrenme Sunumu",
        "html": """
            <div class="slide-body" style="align-items: center; justify-content: center; position: relative;">
                <div style="flex: 1.2; display: flex; flex-direction: column; gap: 24px; z-index: 10;">
                    <div style="display: inline-flex; align-items: center; gap: 12px; padding: 10px 24px; background: rgba(239, 68, 68, 0.25); border: 2px solid #ef4444; border-radius: 50px; width: fit-content;">
                        <i class="fa-solid fa-rocket text-red-400 text-2xl"></i>
                        <span style="font-size: 22px; font-weight: 800; color: #fecaca; letter-spacing: 1px;">YENİ MÜFREDAT • TÜRKİYE YÜZYILI MAARİF MODELİ</span>
                    </div>
                    <h1 style="font-size: 76px; font-weight: 900; line-height: 1.05; letter-spacing: -1px; background: linear-gradient(135deg, #ffffff 20%, #fef08a 50%, #f97316 80%, #ef4444 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                        GÜNEŞ, DÜNYA<br>VE AY
                    </h1>
                    <p style="font-size: 30px; font-weight: 600; color: #93c5fd; line-height: 1.4; max-width: 850px;">
                        Evrenin en muazzam üç gök cisminin sırlarını, katmanlarını, akıl almaz hareketlerini ve büyüleyici evrelerini keşfetmeye hazır mısın?
                    </p>
                    <div style="display: flex; gap: 20px; margin-top: 15px;">
                        <button onclick="nextSlide()" class="tool-btn primary" style="height: 64px; padding: 0 38px; font-size: 24px; border-radius: 32px;">
                            <i class="fa-solid fa-play"></i> <span>Ders Başlasın</span>
                        </button>
                        <button onclick="toggleDrawer()" class="tool-btn" style="height: 64px; padding: 0 32px; font-size: 22px; border-radius: 32px;">
                            <i class="fa-solid fa-list-ol"></i> <span>Ünite Rotaları (41 Slayt)</span>
                        </button>
                    </div>
                </div>
                <div style="flex: 1; height: 100%; display: flex; align-items: center; justify-content: center; position: relative;">
                    <div class="visual-frame" style="border: none; background: transparent; box-shadow: none;">
                        <img src="../assets/sunum-5-1-referans-kapak.jpg" alt="Güneş Dünya ve Ay" style="object-fit: cover; border-radius: 32px; box-shadow: 0 25px 60px rgba(0,0,0,0.8); border: 3px solid rgba(255,255,255,0.18);">
                    </div>
                </div>
            </div>
        """
    },

    # SLAYT 2 — ÜNİTE KONULARIMIZ
    {
        "num": 2,
        "kicker": "1. ÜNİTE • GÜNEŞ, DÜNYA VE AY",
        "title": "ÜNİTE KONULARIMIZ VE ÖĞRENME ROTAMIZ",
        "subtitle": "Bu ünitede 8 ana bölümü adım adım keşfedeceğiz!",
        "html": """
            <div class="slide-body" style="padding: 0; position: relative; width: 100%; height: 100%; min-height: 820px; background: url('../assets/sunum5/slide_unite_konularimiz_ultra.jpg') no-repeat center center / 100% 100%; border-radius: 28px; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.8);">
                <!-- 8 Bölüm İnteraktif Tıklama Alanları -->
                <div style="position: absolute; top: 38%; left: 22%; width: 16%; height: 23%; cursor: pointer; border-radius: 20px;" title="1. Güneş'in Yapısı ve Özellikleri" onclick="showSlide(5)"></div>
                <div style="position: absolute; top: 38%; left: 40%; width: 16%; height: 23%; cursor: pointer; border-radius: 20px;" title="2. Güneş'in Dünya'ya Etkileri" onclick="showSlide(14)"></div>
                <div style="position: absolute; top: 38%; left: 58%; width: 16%; height: 23%; cursor: pointer; border-radius: 20px;" title="3. Dünya'nın Hareketleri ve Sonuçları" onclick="showSlide(12)"></div>
                <div style="position: absolute; top: 38%; left: 76%; width: 16%; height: 23%; cursor: pointer; border-radius: 20px;" title="4. Ay'ın Yapısı ve Özellikleri" onclick="showSlide(16)"></div>

                <div style="position: absolute; top: 64%; left: 22%; width: 16%; height: 23%; cursor: pointer; border-radius: 20px;" title="5. Ay'ın Hareketleri ve Sonuçları" onclick="showSlide(22)"></div>
                <div style="position: absolute; top: 64%; left: 40%; width: 16%; height: 23%; cursor: pointer; border-radius: 20px;" title="6. Ay'ın Evreleri" onclick="showSlide(26)"></div>
                <div style="position: absolute; top: 64%; left: 58%; width: 16%; height: 23%; cursor: pointer; border-radius: 20px;" title="7. Güneş, Dünya ve Ay'ın Karşılaştırılması" onclick="showSlide(35)"></div>
                <div style="position: absolute; top: 64%; left: 76%; width: 16%; height: 23%; cursor: pointer; border-radius: 20px;" title="8. Ünite Değerlendirme" onclick="showSlide(38)"></div>
            </div>
        """
    },

    # SLAYT 3 — UZAYI TANIYALIM
    {
        "num": 3,
        "kicker": "TEMEL ASTRONOMİ KAVRAMLARI",
        "title": "Uzay ve Evren Nedir? Gök Cisimleri Nelerdir?",
        "subtitle": "Kavramları doğru öğrenelim, birbirine karıştırmayalım!",
        "html": """
            <div class="slide-body">
                <div style="flex: 1.1; display: flex; flex-direction: column; gap: 20px;">
                    <div class="info-card glow-blue">
                        <ul class="bullet-list">
                            <li class="bullet-item"><i class="fa-solid fa-infinity text-blue-400"></i> <span><strong class="highlight-cyan">Evren:</strong> Dünya'mız da dâhil olmak üzere var olan tüm maddeleri, enerjiyi, galaksileri ve sonsuz boşluğu içine alan bütündür. (Evren HER ŞEYİ kapsar!)</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-circle-notch text-blue-400"></i> <span><strong class="highlight-cyan">Uzay:</strong> Dünya'mızın atmosferi dışında kalan, gök cisimlerinin yüzdüğü sonsuz boşluktur.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-meteor text-amber-400"></i> <span><strong class="highlight-gold">Gök Cismi:</strong> Uzay boşluğunda bulunan yıldızlar, gezegenler, uydular, asteroitler ve kuyruklu yıldızların her birine gök cismi denir.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-satellite text-emerald-400"></i> <span><strong class="highlight-green">Doğal Uydu:</strong> Bir gezegenin çekiminde bulunarak onun etrafında dolanan gök cismidir (Ay, Dünya'nın tek doğal uydusudur).</span></li>
                        </ul>
                    </div>
                    <div class="callout-box tip">
                        <i class="fa-solid fa-lightbulb"></i>
                        <div><strong>BÜYÜKLÜK SIRALAMASI:</strong> EVREN > UZAY > DÜNYA<br><span style="font-size: 18px; font-weight: 500; opacity: 0.9;">Dünya uzayın içinde, uzay ise evrenin içindedir!</span></div>
                    </div>
                </div>
                <div class="visual-panel">
                    <div class="visual-frame">
                        <img src="../assets/sunum5/slide_ref_1.jpg" alt="Uzay ve Evren">
                    </div>
                </div>
            </div>
        """
    },

    # SLAYT 4 — DÜNYA'MIZI TANIYALIM
    {
        "num": 4,
        "kicker": "GEZEGENİMİZ DÜNYA",
        "title": "Mavi Gezegen Dünya'nın Temel Özellikleri",
        "subtitle": "Canlıların ev sahibi, uzayın masmavi incisi!",
        "html": """
            <div class="slide-body">
                <div style="flex: 1.1; display: flex; flex-direction: column; gap: 20px;">
                    <div class="info-card glow-cyan">
                        <ul class="bullet-list">
                            <li class="bullet-item"><i class="fa-solid fa-globe text-cyan-400"></i> <span>Dünya bir <strong>GEZEGENDİR</strong>. Kendi ışığını üretemez, Güneş'ten aldığı ışığı yansıtır.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-shapes text-cyan-400"></i> <span>Şekli <strong>KÜRESELDİR</strong> (Kutuplardan hafif basık, ekvatordan şişkin geoit biçimdedir).</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-water text-blue-400"></i> <span>Yüzeyinin yaklaşık <strong>%71'i (3/4'ü) sularla</strong>, %29'u (1/4'ü) karalarla kaplıdır. Bu yüzden uzaydan mavi görünür ve <span class="highlight-cyan">'Mavi Gezegen'</span> denir.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-heart-pulse text-red-400"></i> <span>Evrende üzerinde yaşam olduğu kesin olarak bilinen <strong>TEK</strong> gök cismidir.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-layer-group text-amber-400"></i> <span>Katmanları: Hava küre (Atmosfer), Su küre, Taş küre, Ateş küre (Manto) ve Ağır küre (Çekirdek).</span></li>
                        </ul>
                    </div>
                    <div class="callout-box remember">
                        <i class="fa-solid fa-compass"></i>
                        <div><strong>TARİH NOTU:</strong> Ferdinand Macellan, Dünya çevresinde sürekli aynı yöne yelken açarak Dünya'nın küresel olduğunu deniz yoluyla ilk kez kanıtlamıştır!</div>
                    </div>
                </div>
                <div class="visual-panel">
                    <div class="visual-frame">
                        <img src="../assets/sunum5/slide_ref_10.jpg" alt="Dünya">
                    </div>
                </div>
            </div>
        """
    },

    # SLAYT 5 — GÜNEŞ NEDİR?
    # SLAYT 5 — GÜNEŞ NEDİR?
    {
        "num": 5,
        "kicker": "1. BÖLÜM: GÜNEŞ'İN YAPISI VE ÖZELLİKLERİ",
        "title": "1.1 GÜNEŞ NEDİR?",
        "subtitle": "Kendi ışık ve ısısını üreten yaşam kaynağımız dev yıldız!",
        "html": """
            <div class="slide-body" style="padding: 0; position: relative; width: 100%; height: 100%; min-height: 820px; background: url('../assets/sunum5/slide_1_1_gunes_nedir_ultra.jpg') no-repeat center center / 100% 100%; border-radius: 28px; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.8);">
                <!-- 5 İnteraktif Bilgi Kartı Dokunma Alanları -->
                <div style="position: absolute; top: 22%; right: 2%; width: 32%; height: 25%; cursor: pointer; border-radius: 24px;" title="Güneş bir Yıldızdır" onclick="playChime(true)"></div>
                <div style="position: absolute; top: 49%; right: 2%; width: 32%; height: 18%; cursor: pointer; border-radius: 24px;" title="Güneş Çok Sıcaktır (5.500 °C / 15 Milyon °C)" onclick="playChime(true)"></div>
                <div style="position: absolute; top: 69%; right: 2%; width: 28%; height: 28%; cursor: pointer; border-radius: 24px;" title="Güneş Çok Yaşlıdır (4,6 Milyar Yıl)" onclick="playChime(true)"></div>
                <div style="position: absolute; top: 69%; left: 17%; width: 30%; height: 28%; cursor: pointer; border-radius: 24px;" title="Güneş Çevresine Isı ve Işık Yayar" onclick="playChime(true)"></div>
                <div style="position: absolute; top: 69%; left: 48%; width: 23%; height: 28%; cursor: pointer; border-radius: 24px;" title="Güneş Gazlardan Oluşur (Hidrojen & Helyum)" onclick="playChime(true)"></div>
                <div style="position: absolute; top: 16%; left: 24%; width: 42%; height: 52%; border-radius: 50%; cursor: pointer;" title="Güneş Küresi" onclick="playChime(true)"></div>
            </div>
        """
    },

    # SLAYT 6 — GÜNEŞ'İN YAPISI
    {
        "num": 6,
        "kicker": "1. BÖLÜM: GÜNEŞ'İN YAPISI VE ÖZELLİKLERİ",
        "title": "1. GÜNEŞ'İN YAPISI VE ÖZELLİKLERİ",
        "subtitle": "İç içe geçmiş katmanlar, dev sıcaklık ve 3D kesit modeli!",
        "html": """
            <div class="slide-body" style="padding: 0; position: relative; width: 100%; height: 100%; min-height: 820px; background: url('../assets/sunum5/slide_1_gunes_yapisi_ozellikleri_ultra.jpg') no-repeat center center / 100% 100%; border-radius: 28px; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.8);">
                <!-- Katmanlar ve Bilgi Panelleri İnteraktif Alanları -->
                <div style="position: absolute; top: 24%; right: 2%; width: 14%; height: 10%; cursor: pointer;" title="Taç Katmanı (Korona)" onclick="playChime(true)"></div>
                <div style="position: absolute; top: 36%; right: 2%; width: 14%; height: 10%; cursor: pointer;" title="Renk Küre (Kromosfer)" onclick="playChime(true)"></div>
                <div style="position: absolute; top: 48%; right: 2%; width: 14%; height: 10%; cursor: pointer;" title="Işık Küre (Fotosfer)" onclick="playChime(true)"></div>
                <div style="position: absolute; top: 60%; right: 2%; width: 14%; height: 10%; cursor: pointer;" title="Taş Küre" onclick="playChime(true)"></div>
                <div style="position: absolute; top: 61%; left: 51%; width: 12%; height: 12%; cursor: pointer;" title="Çekirdek (15 Milyon °C)" onclick="playChime(true)"></div>
            </div>
        """
    },

    # SLAYT 7 — GÜNEŞ'İN KATMANLARININ ÖZELLİKLERİ
    {
        "num": 7,
        "kicker": "1. BÖLÜM: GÜNEŞ'İN YAPISI VE ÖZELLİKLERİ",
        "title": "Güneş Katmanlarının Ayrıntılı Özellikleri",
        "subtitle": "Merkezden uzaya doğru dev bir nükleer fırın!",
        "html": """
            <div class="slide-body" style="align-items: stretch;">
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; width: 100%;">
                    <div class="info-card glow-red">
                        <div class="card-header-bar">
                            <div class="card-icon" style="background: rgba(239,68,68,0.2); color: #f87171;"><i class="fa-solid fa-fire-burner"></i></div>
                            <div class="card-title">1. Çekirdek (Merkez)</div>
                        </div>
                        <ul class="bullet-list">
                            <li class="bullet-item"><i class="fa-solid fa-check text-red-400"></i> <span>Güneş'in kalbidir ve enerjinin doğduğu yerdir.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-check text-red-400"></i> <span>Sıcaklığı yaklaşık <strong>15 MİLYON °C</strong>'dir.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-check text-red-400"></i> <span>Hidrojen gazları burada helyuma dönüşür.</span></li>
                        </ul>
                    </div>

                    <div class="info-card glow-gold">
                        <div class="card-header-bar">
                            <div class="card-icon" style="background: rgba(245,158,11,0.2); color: #fbbf24;"><i class="fa-solid fa-eye"></i></div>
                            <div class="card-title">2. Işık Küre (Fotosfer)</div>
                        </div>
                        <ul class="bullet-list">
                            <li class="bullet-item"><i class="fa-solid fa-check text-amber-400"></i> <span>Güneş'in görünür parlak yüzeyidir.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-check text-amber-400"></i> <span>Sıcaklığı yaklaşık <strong>5.500 °C - 6.000 °C</strong>'dir.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-check text-amber-400"></i> <span>Güneş lekeleri bu katman üzerinde yer alır.</span></li>
                        </ul>
                    </div>

                    <div class="info-card" style="border-color: rgba(251, 146, 60, 0.4);">
                        <div class="card-header-bar">
                            <div class="card-icon" style="background: rgba(251,146,60,0.2); color: #fb923c;"><i class="fa-solid fa-cloud-bolt"></i></div>
                            <div class="card-title">3. Renk Küre (Kromosfer)</div>
                        </div>
                        <ul class="bullet-list">
                            <li class="bullet-item"><i class="fa-solid fa-check text-orange-400"></i> <span>Işık kürenin hemen üzerindeki atmosfer katmanıdır.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-check text-orange-400"></i> <span>Kırmızımsı renkte gaz patlamaları görülür.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-check text-orange-400"></i> <span>Kalınlığı yaklaşık 2.000 kilometredir.</span></li>
                        </ul>
                    </div>

                    <div class="info-card" style="border-color: rgba(192, 132, 252, 0.4);">
                        <div class="card-header-bar">
                            <div class="card-icon" style="background: rgba(192,132,252,0.2); color: #c084fc;"><i class="fa-solid fa-crown"></i></div>
                            <div class="card-title">4. Taç Küre (Korona)</div>
                        </div>
                        <ul class="bullet-list">
                            <li class="bullet-item"><i class="fa-solid fa-check text-purple-400"></i> <span>En dıştaki dev gaz halesidir.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-check text-purple-400"></i> <span>Sıcaklığı şaşırtıcı şekilde <strong>1.000.000 °C</strong>'den fazladır!</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-check text-purple-400"></i> <span>Tam Güneş tutulmasında çıplak gözle beyaz taç gibi ışıldar.</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        """
    },

    # SLAYT 8 — GÜNEŞ'İN İÇERİĞİ VE ENERJİSİ
    {
        "num": 8,
        "kicker": "1. BÖLÜM: GÜNEŞ'İN YAPISI VE ÖZELLİKLERİ",
        "title": "Güneş'in Gaz İçeriği ve Sonsuz Enerjisi",
        "subtitle": "Hidrojenin Helyuma dönüşüm reaksiyonu!",
        "html": """
            <div class="slide-body">
                <div style="flex: 1.1; display: flex; flex-direction: column; gap: 20px;">
                    <div class="info-card glow-gold">
                        <ul class="bullet-list">
                            <li class="bullet-item"><i class="fa-solid fa-flask text-amber-400"></i> <span>Güneş katı veya sıvı değildir; sıcak gazlardan oluşur.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-atom text-blue-400"></i> <span>Güneş'in yaklaşık <strong>%73'ü Hidrojen (H)</strong> gazıdır.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-fire text-amber-400"></i> <span>Yaklaşık <strong>%25'i Helyum (He)</strong> gazıdır. Kalan %2'lik kısım ise diğer ağır elementlerdir.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-bolt text-yellow-300"></i> <span><strong>Enerjinin Kaynağı:</strong> Çekirdekteki devasa basınç ve sıcaklıkta hidrojen gazı helyum gazına dönüşür (Füzyon). Bu dönüşüm sırasında akıl almaz bir enerji uzaya ısı ve ışık olarak yayılır!</span></li>
                        </ul>
                    </div>
                    <div class="callout-box tip">
                        <i class="fa-solid fa-calculator"></i>
                        <div>Güneş her bir saniyede 4 milyon ton maddeyi saf enerjiye dönüştürür ve bu enerji 5 milyar yıldır hiç durmadan devam etmektedir!</div>
                    </div>
                </div>
                <div class="visual-panel">
                    <div class="visual-frame">
                        <img src="../assets/sunum5/slide_ref_6.jpg" alt="Güneş İçeriği">
                    </div>
                </div>
            </div>
        """
    },

    # SLAYT 9 — GÜNEŞ'İN SICAKLIĞI
    {
        "num": 9,
        "kicker": "1. BÖLÜM: GÜNEŞ'İN YAPISI VE ÖZELLİKLERİ",
        "title": "Güneş'in Sıcaklığı: Yüzey vs Çekirdek",
        "subtitle": "Demiri ve taşları anında buharlaştıran dev sıcaklık!",
        "html": """
            <div class="slide-body">
                <div style="flex: 1.1; display: flex; flex-direction: column; gap: 20px;">
                    <div class="info-card glow-red">
                        <div class="card-header-bar">
                            <div class="card-icon" style="background: rgba(239,68,68,0.2); color: #ef4444;"><i class="fa-solid fa-temperature-arrow-up"></i></div>
                            <div class="card-title">Sıcaklık Karşılaştırması</div>
                        </div>
                        <ul class="bullet-list">
                            <li class="bullet-item"><i class="fa-solid fa-sun text-amber-400"></i> <span><strong>Yüzey Sıcaklığı (Işık Küre):</strong> Yaklaşık <span class="highlight-gold">5.500 °C - 6.000 °C</span></span></li>
                            <li class="bullet-item"><i class="fa-solid fa-volcano text-red-400"></i> <span><strong>Merkez (Çekirdek) Sıcaklığı:</strong> Yaklaşık <span class="highlight-red">15 MİLYON °C (15.000.000 °C)</span></span></li>
                            <li class="bullet-item"><i class="fa-solid fa-crown text-purple-400"></i> <span><strong>Taç Küre (Dış Atmosfer):</strong> Yaklaşık <span class="highlight-cyan">1.000.000 °C'den fazla</span></span></li>
                        </ul>
                    </div>
                    <div class="callout-box warning">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <div><strong>GÜNLÜK YAŞAM KARŞILAŞTIRMASI:</strong> Suyun kaynama sıcaklığı 100 °C, bir volkan lavı 1.200 °C'dir. Güneş yüzeyi bir volkandan 5 kat, çekirdeği ise tam 12.500 kat daha sıcaktır!</div>
                    </div>
                </div>
                <div class="visual-panel">
                    <div class="visual-frame">
                        <img src="../assets/sunum5/slide_ref_8.jpg" alt="Güneş Sıcaklığı">
                    </div>
                </div>
            </div>
        """
    },

    # SLAYT 10 — GÜNEŞ'İN BÜYÜKLÜĞÜ
    {
        "num": 10,
        "kicker": "1. BÖLÜM: GÜNEŞ'İN YAPISI VE ÖZELLİKLERİ",
        "title": "Güneş'in Büyüklüğü: Dünya ile Kıyaslama",
        "subtitle": "Güneş o kadar büyüktür ki içine yüz binlerce gezegen sığabilir!",
        "html": """
            <div class="slide-body">
                <div style="flex: 1.1; display: flex; flex-direction: column; gap: 20px;">
                    <div class="info-card glow-gold">
                        <ul class="bullet-list">
                            <li class="bullet-item"><i class="fa-solid fa-ruler-horizontal text-amber-400"></i> <span><strong>Güneş'in Çapı:</strong> Yaklaşık <span class="highlight-gold">1.392.000 km</span></span></li>
                            <li class="bullet-item"><i class="fa-solid fa-ruler-horizontal text-blue-400"></i> <span><strong>Dünya'nın Çapı:</strong> Yaklaşık <span class="highlight-cyan">12.742 km</span></span></li>
                            <li class="bullet-item"><i class="fa-solid fa-calculator text-green-400"></i> <span>Güneş'in çapı, Dünya'nın çapının yaklaşık <span class="highlight-gold">109 KATIDIR!</span></span></li>
                            <li class="bullet-item"><i class="fa-solid fa-boxes-stacked text-purple-400"></i> <span>İç hacim olarak Güneş'in içine yaklaşık <span class="highlight-cyan">1 MİLYON 300 BİN (1.300.000) TANE DÜNYA</span> sığabilir!</span></li>
                        </ul>
                    </div>
                    <div class="scale-bar-container">
                        <div class="scale-bar-item">
                            <span class="scale-bar-label">Güneş (Çap):</span>
                            <div class="scale-bar-track">
                                <div class="scale-bar-fill" style="width: 100%; background: linear-gradient(90deg, #f59e0b, #ef4444);">1.392.000 km (109 Kat)</div>
                            </div>
                        </div>
                        <div class="scale-bar-item">
                            <span class="scale-bar-label">Dünya (Çap):</span>
                            <div class="scale-bar-track">
                                <div class="scale-bar-fill" style="width: 1.5%; min-width: 120px; background: #38bdf8;">12.742 km (1 Kat)</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="visual-panel">
                    <div class="visual-frame">
                        <img src="../assets/sunum5/slide_ref_7.jpg" alt="Güneş Büyüklüğü">
                    </div>
                </div>
            </div>
        """
    },

    # SLAYT 11 — GÜNEŞ NEDEN KÜÇÜK GÖRÜNÜR?
    {
        "num": 11,
        "kicker": "1. BÖLÜM: GÜNEŞ'İN YAPISI VE ÖZELLİKLERİ",
        "title": "Güneş Dünya'dan Neden Küçük Görünür?",
        "subtitle": "Perspektif etkisi: Uzaktaki cisimler küçük görünür!",
        "html": """
            <div class="slide-body">
                <div style="flex: 1.1; display: flex; flex-direction: column; gap: 20px;">
                    <div class="info-card glow-blue">
                        <ul class="bullet-list">
                            <li class="bullet-item"><i class="fa-solid fa-circle-question text-blue-400"></i> <span>Güneş, Dünya'dan 1.3 milyon kat büyük olmasına rağmen gökyüzünde neden küçük bir tabak gibi görünür?</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-route text-amber-400"></i> <span><strong>Cevap: UZAKLIK!</strong> Güneş ile Dünya arasındaki mesafe ortalama yaklaşık <span class="highlight-gold">150 MİLYON KİLOMETREDİR!</span></span></li>
                            <li class="bullet-item"><i class="fa-solid fa-glasses text-cyan-400"></i> <span>Cisimler bizden uzaklaştıkça gözümüze gelen ışık açısı küçülür ve cisim olduğundan çok daha ufak algılanır.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-bolt text-yellow-300"></i> <span>Işık hızı saniyede 300.000 km olmasına rağmen, Güneş ışığının Dünya'ya ulaşması yaklaşık <strong>8 DAKİKA 20 SANİYE</strong> sürer!</span></li>
                        </ul>
                    </div>
                    <div class="callout-box tip">
                        <i class="fa-solid fa-plane"></i>
                        <div><strong>GÜNLÜK YAŞAM ÖRNEĞİ:</strong> Gökyüzünde uçan dev bir yolcu uçağının yerden bakıldığında bir serçe kadar küçük görünmesi de aynı perspektif kuralındandır!</div>
                    </div>
                </div>
                <div class="visual-panel">
                    <div class="visual-frame" style="border: 2px solid rgba(56, 189, 248, 0.5); box-shadow: 0 0 35px rgba(56, 189, 248, 0.3);">
                        <img src="../assets/slides/slide_11_perspective.jpg" alt="Dünya Güneş Uzaklık ve Perspektif Modeli" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                </div>
            </div>
        """
    },

    # SLAYT 12 — GÜNEŞ'İN HAREKETLERİ
    {
        "num": 12,
        "kicker": "1. BÖLÜM: GÜNEŞ'İN YAPISI VE ÖZELLİKLERİ",
        "title": "Güneş'in Hareketleri: Kendi Ekseni ve Galaksi",
        "subtitle": "Güneş uzayda sabit midir, hareket eder mi?",
        "html": """
            <div class="slide-body">
                <div style="flex: 1.1; display: flex; flex-direction: column; gap: 20px;">
                    <div class="info-card glow-gold">
                        <ul class="bullet-list">
                            <li class="bullet-item"><i class="fa-solid fa-rotate text-amber-400"></i> <span><strong>1. Kendi Ekseni Etrafında Dönme Hareketi:</strong> Güneş, kendi ekseni etrafında <strong>SAAT YÖNÜNÜN TERSİNE</strong> (batıdan doğuya) döner.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-clock text-amber-400"></i> <span>Gaz yapıda olduğu için Güneş'in her yeri aynı hızda dönmez: Ekvator bölgesi yaklaşık <strong>25 günde</strong>, kutup bölgeleri ise yaklaşık <strong>35 günde</strong> bir tur döner.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-arrows-spin text-purple-400"></i> <span><strong>2. Samanyolu Galaksisi Etrafında Dolanma:</strong> Güneş sistemiyle birlikte Samanyolu merkezinin etrafında dev bir yörüngede dolanır (Bu dolanma yaklaşık 225-250 milyon yıl sürer).</span></li>
                        </ul>
                    </div>
                    <div class="callout-box remember">
                        <i class="fa-solid fa-compass"></i>
                        <div><strong>ALTIN KURAL:</strong> Güneş, Dünya ve Ay'ın üçü de kendi eksenleri etrafında SAAT YÖNÜNÜN TERSİNE (soldan sağa / batıdan doğuya) döner!</div>
                    </div>
                </div>
                <div class="visual-panel">
                    <div class="visual-frame">
                        <img src="../assets/slides/slide_14_sun_earth.jpg" alt="Güneş ve Gezegenler Hareketi">
                    </div>
                </div>
            </div>
        """
    },

    # SLAYT 13 — GÜNEŞ LEKELERİ
    {
        "num": 13,
        "kicker": "1. BÖLÜM: GÜNEŞ'İN YAPISI VE ÖZELLİKLERİ",
        "title": "GÜNEŞ LEKELERİ VE GALILEO GALILEI",
        "subtitle": "Yüzeydeki soğuk adacıklar ve Güneş'in dönmesinin kanıtı!",
        "html": """
            <div class="slide-body" style="flex-direction: column; gap: 14px;">
                <div style="display: flex; gap: 28px; flex: 1; min-height: 0;">
                    <!-- Sol: 3D Güneş Yüzeyi & Güneş Lekesi Görseli -->
                    <div style="flex: 1.15; position: relative; border-radius: 24px; overflow: hidden; border: 2px solid rgba(249, 115, 22, 0.6); box-shadow: 0 0 40px rgba(249, 115, 22, 0.25); background: #000;">
                        <img src="../assets/slides/slide_13_sunspots.jpg" alt="Güneş Lekeleri Yakın Plan" style="width: 100%; height: 100%; object-fit: cover;">
                        <div style="position: absolute; top: 45%; left: 30%; background: rgba(10,15,30,0.92); border: 2px solid #22d3ee; border-radius: 14px; padding: 6px 14px; box-shadow: 0 0 20px #22d3ee; font-size: 16px; font-weight: 800;">
                            <span style="color: #ef4444;">●</span> GÜNEŞ LEKESİ <span style="color: #fef08a;">(~3.500 °C)</span>
                        </div>
                    </div>

                    <!-- Sağ: 3 Büyük Neon Bilgi Kartı -->
                    <div style="flex: 1.1; display: flex; flex-direction: column; gap: 14px;">
                        <div class="info-card glow-cyan" style="padding: 16px 20px;">
                            <div style="font-size: 22px; font-weight: 800; color: #22d3ee; margin-bottom: 4px;"><i class="fa-solid fa-circle-dot mr-2"></i> GÜNEŞ LEKELERİ NEDİR?</div>
                            <p style="font-size: 19px; color: #f1f5f9; line-height: 1.4;">Güneş'in görünür yüzeyinde (ışık küre) yer alan, çevresindeki akkor gazlara göre <strong>daha soğuk</strong> oldukları için koyu renkli görünen bölgelerdir.</p>
                        </div>

                        <div class="info-card glow-gold" style="padding: 16px 20px;">
                            <div style="font-size: 22px; font-weight: 800; color: #fb923c; margin-bottom: 4px;"><i class="fa-solid fa-temperature-half mr-2"></i> NEDEN KOYU GÖRÜNÜRLER?</div>
                            <p style="font-size: 19px; color: #f1f5f9; line-height: 1.4;">Güneş yüzeyi ortalama <strong>5.500 °C</strong> iken, lekelerin sıcaklığı <strong>~3.500 °C</strong>'dir. Aradaki ~2.000 °C'lik sıcaklık farkı sebebiyle zıtlık oluşur ve koyu görünürler.</p>
                        </div>

                        <div class="info-card glow-purple" style="padding: 16px 20px;">
                            <div style="font-size: 22px; font-weight: 800; color: #c084fc; margin-bottom: 4px;"><i class="fa-solid fa-compass mr-2"></i> GALILEO GALILEI'NİN GÖZLEMLERİ</div>
                            <div style="display: flex; gap: 16px; align-items: center;">
                                <img src="../assets/slides/slide_13_galileo.jpg" alt="Galileo Teleskop" style="width: 110px; height: 110px; object-fit: cover; border-radius: 14px; border: 2px solid #c084fc;">
                                <p style="font-size: 18px; color: #f1f5f9; line-height: 1.35;">Galileo, 1610'lu yıllarda teleskopla lekelerin hep aynı yöne kaydığını gözlemleyerek <strong>Güneş'in kendi ekseni etrafında döndüğünü</strong> tarihte ilk kez kanıtlamıştır!</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Alt Dikkat & Kavram Yanılgısı Şeridi -->
                <div style="background: linear-gradient(90deg, rgba(127,29,29,0.92), rgba(185,28,28,0.92)); border: 2px solid #ef4444; border-radius: 16px; padding: 10px 20px; display: flex; align-items: center; gap: 14px; box-shadow: 0 0 25px rgba(239,68,68,0.4);">
                    <i class="fa-solid fa-triangle-exclamation text-yellow-300 text-2xl"></i>
                    <div style="font-size: 18px; font-weight: 700; color: #ffffff;">
                        <strong>DİKKAT!</strong> Güneş lekeleri Güneş'in yüzeyindeki delikler veya çukurlar <u>DEĞİLDİR!</u> Sadece çevresinden 2.000 °C daha soğuk gaz bölgeleridir.
                    </div>
                </div>
            </div>
        """
    },

    # SLAYT 14 — GÜNEŞ DÜNYA İÇİN NEDEN ÖNEMLİ?
    {
        "num": 14,
        "kicker": "1. BÖLÜM: GÜNEŞ'İN YAPISI VE ÖZELLİKLERİ",
        "title": "GÜNEŞ DÜNYA İÇİN NEDEN HAYATİDİR?",
        "subtitle": "Isı, ışık, fotosentez, su döngüsü ve hava olaylarının temeli!",
        "html": """
            <div class="slide-body" style="padding: 10px 0;">
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; width: 100%;">
                    <!-- 1. Isı ve Işık -->
                    <div class="info-card glow-gold" style="display: flex; flex-direction: row; gap: 18px; align-items: center; padding: 16px 20px;">
                        <img src="../assets/slides/slide_14_sun_earth.jpg" alt="Isı ve Işık" style="width: 250px; height: 160px; object-fit: cover; border-radius: 14px; border: 2px solid #fbbf24;">
                        <div>
                            <div style="font-size: 24px; font-weight: 800; color: #fbbf24; margin-bottom: 6px;"><i class="fa-solid fa-sun mr-1"></i> 1. ISI VE IŞIK</div>
                            <p style="font-size: 19px; color: #e2e8f0; line-height: 1.4;">Dünya'mızın temel doğal ısı ve ışık kaynağıdır. Gezegenimizin donmasını önler ve yaşamı sürdürür.</p>
                        </div>
                    </div>

                    <!-- 2. Fotosentez -->
                    <div class="info-card glow-green" style="display: flex; flex-direction: row; gap: 18px; align-items: center; padding: 16px 20px;">
                        <img src="../assets/slides/slide_14_photosynthesis.jpg" alt="Fotosentez" style="width: 250px; height: 160px; object-fit: cover; border-radius: 14px; border: 2px solid #4ade80;">
                        <div>
                            <div style="font-size: 24px; font-weight: 800; color: #4ade80; margin-bottom: 6px;"><i class="fa-solid fa-seedling mr-1"></i> 2. FOTOSENTEZ</div>
                            <p style="font-size: 19px; color: #e2e8f0; line-height: 1.4;">Yeşil bitkiler Güneş ışığını kullanarak besin ve oksijen üretir. Tüm besin zincirinin temeli Güneş'tir.</p>
                        </div>
                    </div>

                    <!-- 3. Su Döngüsü -->
                    <div class="info-card glow-blue" style="display: flex; flex-direction: row; gap: 18px; align-items: center; padding: 16px 20px;">
                        <img src="../assets/slides/slide_14_water_cycle.jpg" alt="Su Döngüsü" style="width: 250px; height: 160px; object-fit: cover; border-radius: 14px; border: 2px solid #38bdf8;">
                        <div>
                            <div style="font-size: 24px; font-weight: 800; color: #38bdf8; margin-bottom: 6px;"><i class="fa-solid fa-cloud-showers-heavy mr-1"></i> 3. SU DÖNGÜSÜ</div>
                            <p style="font-size: 19px; color: #e2e8f0; line-height: 1.4;">Suyu buharlaştırarak bulutları oluşturur ve yağmur olarak yeryüzüne döndürerek su döngüsünü çalıştırır.</p>
                        </div>
                    </div>

                    <!-- 4. Hava Olayları -->
                    <div class="info-card glow-purple" style="display: flex; flex-direction: row; gap: 18px; align-items: center; padding: 16px 20px;">
                        <img src="../assets/slides/slide_14_weather.jpg" alt="Hava Olayları" style="width: 250px; height: 160px; object-fit: cover; border-radius: 14px; border: 2px solid #c084fc;">
                        <div>
                            <div style="font-size: 24px; font-weight: 800; color: #c084fc; margin-bottom: 6px;"><i class="fa-solid fa-wind mr-1"></i> 4. HAVA OLAYLARI</div>
                            <p style="font-size: 19px; color: #e2e8f0; line-height: 1.4;">Dünya'yı farklı oranlarda ısıtarak sıcaklık ve basınç farkları yaratır; rüzgârları ve hava olaylarını oluşturur.</p>
                        </div>
                    </div>
                </div>
            </div>
        """
    },

    # SLAYT 15 — GÜNEŞ'İ GÜVENLİ GÖZLEMLEME
    {
        "num": 15,
        "kicker": "HAYATİ SAĞLIK VE GÜVENLİK UYARISI",
        "title": "Güneş'i Güvenli Gözlemleme Kuralları",
        "subtitle": "Gözlerimizi kalıcı körlükten nasıl koruruz?",
        "html": """
            <div class="slide-body">
                <div style="flex: 1.1; display: flex; flex-direction: column; gap: 20px;">
                    <div class="info-card glow-red">
                        <ul class="bullet-list">
                            <li class="bullet-item"><i class="fa-solid fa-ban text-red-400"></i> <span>Güneş'e <strong>ÇIPLAK GÖZLE DOĞRUDAN BAKILMAZ!</strong> Göz merceğimiz ışınları retinaya odaklar ve kalıcı körlüğe yol açabilir.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-triangle-exclamation text-amber-400"></i> <span>Teleskop, dürbün, büyüteç veya fotoğraf makinesiyle <strong>FİLTRESİZ ASLA BAKILMAZ!</strong> Mercekler Güneş ışığını toplayarak saniyeler içinde gözü yakar!</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-xmark text-red-400"></i> <span>Normal güneş gözlükleri, isli cam, röntgen filmi veya siyah poşetler <strong>GÜVENLİ DEĞİLDİR!</strong> Zararlı UV ışınlarını geçirirler.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-shield-halved text-green-400"></i> <span><strong>GÜVENLİ YÖNTEM:</strong> Yalnızca sertifikalı özel Güneş gözlem filtreleri (ISO 12312-2) veya Güneş tutulma gözlükleri kullanılmalıdır.</span></li>
                        </ul>
                    </div>
                    <div class="callout-box warning">
                        <i class="fa-solid fa-eye-slash"></i>
                        <div><strong>UNUTMA:</strong> Retinada acı reseptörü yoktur; gözün zarar gördüğünü o an hissetmezsiniz, ancak hasar kalıcıdır!</div>
                    </div>
                </div>
                <div class="visual-panel">
                    <div class="visual-frame">
                        <img src="../assets/sunum5/slide_ref_9.jpg" alt="Güneş Gözlemi Güvenliği">
                    </div>
                </div>
            </div>
        """
    },

    # SLAYT 16 — AY NEDİR?
    {
        "num": 16,
        "kicker": "2. BÖLÜM: AY'IN YAPISI VE ÖZELLİKLERİ",
        "title": "Ay Nedir? Dünya'mızın Tek Doğal Uydusu",
        "subtitle": "Gökyüzünün en yakın ve en gizemli komşusu!",
        "html": """
            <div class="slide-body">
                <div style="flex: 1.1; display: flex; flex-direction: column; gap: 20px;">
                    <div class="info-card glow-cyan">
                        <ul class="bullet-list">
                            <li class="bullet-item"><i class="fa-solid fa-satellite text-cyan-400"></i> <span>Ay, Dünya'mızın <strong>TEK DOĞAL UYDUSUDUR</strong>.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-circle text-slate-300"></i> <span>Şekli tıpkı Güneş ve Dünya gibi <strong>KÜRESELDİR</strong>.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-location-dot text-red-400"></i> <span>Dünya'mıza <strong>EN YAKIN</strong> gök cismidir! Ortalama uzaklığı yaklaşık <span class="highlight-cyan">384.400 KM</span>'dir.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-lightbulb text-amber-400"></i> <span>Ay bir ışık kaynağı <strong>DEĞİLDİR!</strong> Kendi ışığını üretemez. Güneş'ten üzerine çarpan ışığı bir ayna gibi Dünya'ya yansıtır.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-ruler-combined text-emerald-400"></i> <span>Çapı yaklaşık <strong>3.476 km</strong> olup, Dünya'nın çapının yaklaşık <strong>4'te 1'i (1/3.7)</strong> kadardır.</span></li>
                        </ul>
                    </div>
                    <div class="callout-box tip">
                        <i class="fa-solid fa-rocket"></i>
                        <div>Güneş'e arabayla gitmek yaklaşık 170 yıl sürerken, Ay'a giden Apollo astronotları bu mesafeyi sadece 3 günde katetmiştir!</div>
                    </div>
                </div>
                <div class="visual-panel">
                    <div class="visual-frame">
                        <img src="../assets/sunum5/slide_ref_11.jpg" alt="Ay Nedir">
                    </div>
                </div>
            </div>
        """
    },

    # SLAYT 17 — AY'IN YAPISI VE YÜZEYİ
    {
        "num": 17,
        "kicker": "2. BÖLÜM: AY'IN YAPISI VE ÖZELLİKLERİ",
        "title": "Ay'ın Yüzey Yapısı: Dağlar, Vadiler ve Düzlükler",
        "subtitle": "Ay'ın yüzeyi pürüzsüz ve düz bir zemin değildir!",
        "html": """
            <div class="slide-body">
                <div style="flex: 1.1; display: flex; flex-direction: column; gap: 20px;">
                    <div class="info-card glow-cyan">
                        <ul class="bullet-list">
                            <li class="bullet-item"><i class="fa-solid fa-mountain text-slate-300"></i> <span><strong>Ay Dağları ve Yaylaları (Terrae):</strong> Açık renkli, engebeli ve kayalık yüksek bölgelerdir.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-water text-blue-400"></i> <span><strong>Ay Denizleri (Maria):</strong> Koyu renkli görünen düzlüklerdir. Ancak buralarda su yoktur! Milyarlarca yıl önceki lav akıntılarının soğumasıyla oluşan bazalt taşlarıdır.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-circle-dot text-amber-400"></i> <span><strong>Kraterler:</strong> Yüzeyde gök taşlarının çarpmasıyla oluşmuş irili ufaklı milyonlarca derin çukur bulunur.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-wind text-cyan-400"></i> <span><strong>Regolit (Ay Tozu):</strong> Yüzey, meteor çarpmalarıyla ufalanmış çok ince ve keskin camımsı toz tabakasıyla kaplıdır.</span></li>
                        </ul>
                    </div>
                    <div class="callout-box remember">
                        <i class="fa-solid fa-circle-info"></i>
                        <div>Ay'daki koyu renkli bölgelere eski gökbilimciler su zannederek 'Deniz' (Maria) demiştir; ancak Ay yüzeyinde sıvı su kesinlikle yoktur!</div>
                    </div>
                </div>
                <div class="visual-panel">
                    <div class="visual-frame">
                        <img src="../assets/sunum5/slide_ref_12.jpg" alt="Ay Yüzeyi">
                    </div>
                </div>
            </div>
        """
    },

    # SLAYT 18 — AY'DAKİ KRATERLER
    {
        "num": 18,
        "kicker": "2. BÖLÜM: AY'IN YAPISI VE ÖZELLİKLERİ",
        "title": "Ay'daki Kraterler Nasıl Oluşmuştur?",
        "subtitle": "Uzay taşlarının yüzeyi bombalama tarihi!",
        "html": """
            <div class="slide-body">
                <div style="flex: 1.1; display: flex; flex-direction: column; gap: 20px;">
                    <div class="info-card glow-cyan">
                        <ul class="bullet-list">
                            <li class="bullet-item"><i class="fa-solid fa-meteor text-amber-400"></i> <span><strong>Krater Nedir?:</strong> Uzayda başıboş dolaşan gök taşlarının (meteorların) Ay yüzeyine yüksek hızla çarpması sonucu oluşan çanak şeklindeki derin çukurlardır.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-shield-halved text-red-400"></i> <span><strong>Neden Ay'da Çok Fazla Krater Var?:</strong> Ay'ın koruyucu bir atmosferi olmadığı için en küçük meteorlar bile yanıp yok olmadan doğrudan yüzeye çarpar!</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-clock-rotate-left text-cyan-400"></i> <span><strong>Neden Silinmezler?:</strong> Ay'da rüzgâr, yağmur ve akarsu gibi aşındırıcı hava olayları olmadığı için oluşan kraterler milyarlarca yıldır hiç bozulmadan kalmıştır!</span></li>
                        </ul>
                    </div>
                    <div class="callout-box tip">
                        <i class="fa-solid fa-earth-americas"></i>
                        <div>Dünya'mız da gök taşlarına maruz kalır; ancak kalın atmosferimiz meteorları sürtünmeyle yakar ve erozyon kraterleri zamanla siler!</div>
                    </div>
                </div>
                <div class="visual-panel">
                    <div class="visual-frame">
                        <img src="../assets/sunum5/slide_ref_12.jpg" alt="Kraterler">
                    </div>
                </div>
            </div>
        """
    },

    # SLAYT 19 — AY'IN ATMOSFERİ VE SICAKLIĞI
    {
        "num": 19,
        "kicker": "2. BÖLÜM: AY'IN YAPISI VE ÖZELLİKLERİ",
        "title": "Ay'ın İncecik Atmosferi ve Aşırı Sıcaklık Farkı",
        "subtitle": "Rüzgârsız, yağmursuz ve mutlak sessizlik dünyası!",
        "html": """
            <div class="slide-body">
                <div style="flex: 1.1; display: flex; flex-direction: column; gap: 20px;">
                    <div class="info-card glow-blue">
                        <ul class="bullet-list">
                            <li class="bullet-item"><i class="fa-solid fa-wind text-slate-400"></i> <span>Ay'ın atmosferi <strong>YOK DENECEK KADAR İNCEDİR</strong>. Bu yüzden;</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-cloud-sun-rain text-blue-400"></i> <span>Yağmur, kar, rüzgâr ve fırtına gibi hiçbir <strong>HAVA OLAYI GÖRÜLMEZ</strong>.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-shoe-prints text-amber-400"></i> <span>Rüzgâr olmadığı için Ay'a ayak basan astronotların <strong>AYAK İZLERİ MİLYONLARCA YIL</strong> hiç silinmeden kalacaktır!</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-volume-xmark text-red-400"></i> <span>Hava molekülü olmadığı için ses iletilemez; Ay'da <strong>MUTLAK SESSİZLİK</strong> hâkimdir (Astronotlar telsizle konuşur).</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-temperature-full text-red-400"></i> <span>Atmosfer yalıtımı olmadığı için: Gündüz Güneş gören taraf <strong class="highlight-red">+107 °C</strong>, gece karanlıkta kalan taraf <strong class="highlight-cyan">-153 °C</strong>'ye düşer! (Fark: 260 °C!)</span></li>
                        </ul>
                    </div>
                </div>
                <div class="visual-panel">
                    <div class="visual-frame">
                        <img src="../assets/sunum5/slide_ref_12.jpg" alt="Atmosfer ve Sıcaklık">
                    </div>
                </div>
            </div>
        """
    },

    # SLAYT 20 — AY'DA YER ÇEKİMİ
    {
        "num": 20,
        "kicker": "2. BÖLÜM: AY'IN YAPISI VE ÖZELLİKLERİ",
        "title": "Ay'da Yer Çekimi ve Süper Zıplayışlar!",
        "subtitle": "Dünya'nın altıda biri çekim gücü!",
        "html": """
            <div class="slide-body">
                <div style="flex: 1.1; display: flex; flex-direction: column; gap: 20px;">
                    <div class="info-card glow-cyan">
                        <ul class="bullet-list">
                            <li class="bullet-item"><i class="fa-solid fa-weight-scale text-cyan-400"></i> <span>Ay'ın kütlesi Dünya'dan çok daha küçüktür; bu nedenle çekim kuvveti de azdır.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-divide text-amber-400"></i> <span>Ay'daki yer çekimi kuvveti, Dünya'dakinin yaklaşık <span class="highlight-gold">ALTIDA BİRİ (1/6)</span> kadardır!</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-person-running text-green-400"></i> <span><strong>Ağırlık Etkisi:</strong> Dünya'da 60 kg ağırlık hisseden bir öğrenci, Ay'daki tartıda sadece <strong>10 kg</strong> hisseder!</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-angles-up text-cyan-400"></i> <span>Dünya'da 50 cm zıplayabilen bir sporcu, Ay'da aynı kas gücüyle yaklaşık <strong>3 METRE</strong> yukarı sıçrayabilir!</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-stopwatch text-purple-400"></i> <span>Dünya'da 1 saniyede yere düşen bir taş, Ay'da yer çekimi zayıf olduğu için süzülerek yaklaşık <strong>6 saniyede</strong> düşer.</span></li>
                        </ul>
                    </div>
                </div>
                <div class="visual-panel">
                    <div class="visual-frame">
                        <img src="../assets/sunum5/slide_ref_12.jpg" alt="Yer Çekimi">
                    </div>
                </div>
            </div>
        """
    },

    # SLAYT 21 — AY VE DÜNYA KARŞILAŞTIRMASI
    {
        "num": 21,
        "kicker": "2. BÖLÜM: AY'IN YAPISI VE ÖZELLİKLERİ",
        "title": "Dünya ve Ay'ın Karşılaştırma Tablosu",
        "subtitle": "İki komşunun benzer ve farklı yönleri bir arada!",
        "html": """
            <div class="slide-body" style="align-items: stretch;">
                <div class="info-card glow-blue" style="width: 100%; padding: 25px 35px;">
                    <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 24px;">
                        <thead>
                            <tr style="border-bottom: 3px solid rgba(255,255,255,0.25); color: #38bdf8;">
                                <th style="padding: 14px 10px;">ÖZELLİK</th>
                                <th style="padding: 14px 10px; color: #60a5fa;"><i class="fa-solid fa-earth-americas mr-2"></i> DÜNYA</th>
                                <th style="padding: 14px 10px; color: #cbd5e1;"><i class="fa-solid fa-moon mr-2"></i> AY</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                                <td style="padding: 14px 10px; font-weight: 800; color: #fde047;">Gök Cismi Türü</td>
                                <td style="padding: 14px 10px;">Gezegen</td>
                                <td style="padding: 14px 10px;">Doğal Uydu</td>
                            </tr>
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                                <td style="padding: 14px 10px; font-weight: 800; color: #fde047;">Çap</td>
                                <td style="padding: 14px 10px;">~12.742 km (Yaklaşık 3.7 kat büyük)</td>
                                <td style="padding: 14px 10px;">~3.476 km</td>
                            </tr>
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                                <td style="padding: 14px 10px; font-weight: 800; color: #fde047;">Atmosfer</td>
                                <td style="padding: 14px 10px; color: #4ade80;">Kalın ve koruyucu (Yaşam gazları)</td>
                                <td style="padding: 14px 10px; color: #f87171;">Yok denecek kadar ince</td>
                            </tr>
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                                <td style="padding: 14px 10px; font-weight: 800; color: #fde047;">Hava Olayları</td>
                                <td style="padding: 14px 10px; color: #4ade80;">Yağmur, kar, rüzgâr var</td>
                                <td style="padding: 14px 10px; color: #f87171;">Hiçbir hava olayı yok</td>
                            </tr>
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                                <td style="padding: 14px 10px; font-weight: 800; color: #fde047;">Sıcaklık Farkı</td>
                                <td style="padding: 14px 10px;">Ilıman ve dengeli</td>
                                <td style="padding: 14px 10px; color: #f87171;">Aşırı yüksek (-153 °C ile +107 °C)</td>
                            </tr>
                            <tr>
                                <td style="padding: 14px 10px; font-weight: 800; color: #fde047;">Yer Çekimi</td>
                                <td style="padding: 14px 10px;">1G (Güçlü çekim)</td>
                                <td style="padding: 14px 10px;">Dünya'nın yaklaşık 1/6'sı</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        """
    },

    # SLAYT 22 — AY NEDEN PARLAR?
    {
        "num": 22,
        "kicker": "3. BÖLÜM: AY'IN HAREKETLERİ VE EVRELERİ",
        "title": "Ay Neden Parlar? Işık Kaynağı Mıdır?",
        "subtitle": "Karanlık bir gök cismi gecemizi nasıl aydınlatır?",
        "html": """
            <div class="slide-body">
                <div style="flex: 1.1; display: flex; flex-direction: column; gap: 20px;">
                    <div class="info-card glow-cyan">
                        <ul class="bullet-list">
                            <li class="bullet-item"><i class="fa-solid fa-circle-question text-cyan-400"></i> <span>Geceleyin gökyüzüne baktığımızda Ay sanki devasa bir ampul gibi bembeyaz parlar. Peki bu ışık nereden gelir?</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-ban text-red-400"></i> <span><strong>AY IŞIK KAYNAĞI DEĞİLDİR!</strong> Kendi enerjisini ve ışığını kesinlikle kendisi üretemez.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-sun text-amber-400"></i> <span>Ay, <strong>GÜNEŞ'TEN ALDIĞI IŞIĞI YANSITIR</strong>. Tıpkı karanlık bir odada el feneri tutulan bir ayna gibi, üzerine düşen güneş ışığını Dünya'mıza geri saçar.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-shapes text-green-400"></i> <span><strong>Kavram Ayrımı:</strong><br>• <strong>Işık Kaynağı:</strong> Güneş, yıldızlar, yanan ampul, meşale.<br>• <strong>Yansıtıcı Cisim:</strong> Ay, Dünya, ayna, alüminyum folyo.</span></li>
                        </ul>
                    </div>
                </div>
                <div class="visual-panel">
                    <div class="visual-frame">
                        <img src="../assets/sunum5/slide_ref_11.jpg" alt="Ay Neden Parlar">
                    </div>
                </div>
            </div>
        """
    },

    # SLAYT 23 — AY'IN HAREKETLERİ
    {
        "num": 23,
        "kicker": "3. BÖLÜM: AY'IN HAREKETLERİ VE EVRELERİ",
        "title": "Ay'ın 3 Temel Hareketi",
        "subtitle": "Ay uzayda nasıl bir dans sergiler?",
        "html": """
            <div class="slide-body">
                <div style="flex: 1.1; display: flex; flex-direction: column; gap: 20px;">
                    <div class="info-card glow-blue">
                        <ul class="bullet-list">
                            <li class="bullet-item"><i class="fa-solid fa-rotate text-cyan-400"></i> <span><strong>1. Kendi Ekseni Etrafında Dönme:</strong> Ay, kendi ekseni etrafında saat yönünün tersine döner. Bu hareketini yaklaşık <strong>27,3 GÜNDE</strong> tamamlar.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-arrows-spin text-blue-400"></i> <span><strong>2. Dünya Etrafında Dolanma:</strong> Ay, Dünya'nın çevresinde saat yönünün tersine dolanır. Bu dolanmasını da yaklaşık <strong>27,3 GÜNDE</strong> tamamlar.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-circle-nodes text-amber-400"></i> <span><strong>3. Güneş Etrafında Dolanma:</strong> Ay, Dünya'nın uydusu olduğu için Dünya ile birlikte el ele Güneş'in etrafında dolanır. Bu dolanma <strong>1 YIL (365 gün 6 saat)</strong> sürer.</span></li>
                        </ul>
                    </div>
                    <div class="callout-box tip">
                        <i class="fa-solid fa-compass"></i>
                        <div><strong>HAREKET YÖNÜ KURALI:</strong> Dönme ve dolanma hareketlerinin tamamı SAAT YÖNÜNÜN TERSİNE (batıdan doğuya / soldan sağa) gerçekleşir!</div>
                    </div>
                </div>
                <div class="visual-panel">
                    <div class="visual-frame">
                        <img src="../assets/sunum5/slide_ref_14.jpg" alt="Ayın Hareketleri">
                    </div>
                </div>
            </div>
        """
    },

    # SLAYT 24 — AY'IN NEDEN HEP AYNI YÜZÜNÜ GÖRÜRÜZ?
    {
        "num": 24,
        "kicker": "3. BÖLÜM: AY'IN HAREKETLERİ VE EVRELERİ",
        "title": "Ay'ın Neden Hep Aynı Yüzünü Görürüz?",
        "subtitle": "Senkronize dönüş mucizesi!",
        "html": """
            <div class="slide-body">
                <div style="flex: 1.1; display: flex; flex-direction: column; gap: 20px;">
                    <div class="info-card glow-blue">
                        <ul class="bullet-list">
                            <li class="bullet-item"><i class="fa-solid fa-eye text-cyan-400"></i> <span>Dünya'dan gökyüzüne baktığımızda Ay'ın hep AYNI YÜZEYİNİ, aynı krater desenlerini görürüz. Arka tarafını göremeyiz. Neden?</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-equals text-amber-400"></i> <span><strong>BÜYÜK SIR:</strong> Ay'ın kendi ekseni etrafında dönme süresi ile Dünya etrafında dolanma süresi birbirine <strong>EŞİTTİR!</strong> (İkisi de 27 gün 8 saattir).</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-user-group text-green-400"></i> <span>İki süre eşit olduğu için Ay, Dünya etrafında dönerken yüzünü daima Dünya'ya dönük tutar (Senkronize Dönüş).</span></li>
                        </ul>
                    </div>
                    <div class="callout-box warning">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <div><strong>BİLİMSEL YANILGI UYARISI:</strong> Dünya'dan göremediğimiz yüze 'Görünmeyen Yüz' denir. Bu yüz SÜREKLİ KARANLIK DEĞİLDİR! Ay dolanırken görünmeyen yüz de Güneş ışığı alır. Örneğin Yeni Ay evresinde görünmeyen yüz tamamen aydınlıktır!</div>
                    </div>
                </div>
                <div class="visual-panel">
                    <div class="visual-frame">
                        <img src="../assets/sunum5/slide_ref_14.jpg" alt="Aynı Yüzün Görünmesi">
                    </div>
                </div>
            </div>
        """
    },

    # SLAYT 25 — AY'IN HAREKET VE EVRE SÜRELERİ
    {
        "num": 25,
        "kicker": "3. BÖLÜM: AY'IN HAREKETLERİ VE EVRELERİ",
        "title": "Ay'ın Süreleri: 27,3 Gün ile 29,5 Günün Farkı",
        "subtitle": "Dolanma süresi ile evre döngüsü neden farklıdır?",
        "html": """
            <div class="slide-body">
                <div style="flex: 1.1; display: flex; flex-direction: column; gap: 20px;">
                    <div class="info-card glow-gold">
                        <ul class="bullet-list">
                            <li class="bullet-item"><i class="fa-solid fa-calendar-day text-blue-400"></i> <span><strong>Dolanma Süresi:</strong> Ay'ın Dünya çevresindeki 1 tam turu <span class="highlight-cyan">27,3 GÜN (27 gün 8 saat)</span> sürer.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-calendar-week text-amber-400"></i> <span><strong>Evre Döngüsü Süresi:</strong> Bir Yeni Ay'dan sonraki Yeni Ay'a kadar geçen süre <span class="highlight-gold">29,5 GÜN (29 gün 12 saat)</span> sürer.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-route text-green-400"></i> <span><strong>Neden 2 Gün Fark Var?:</strong> Çünkü Ay, Dünya etrafında dönerken Dünya da Güneş etrafında ilerler! Ay'ın tekrar Güneş ile aynı hizaya gelip aynı evreyi göstermesi için fazladan 2 gün daha dolanması gerekir.</span></li>
                        </ul>
                    </div>
                    <div class="callout-box tip">
                        <i class="fa-solid fa-moon"></i>
                        <div>Bu 29,5 günlük evre döngüsü, atalarımızın takvimlerindeki "1 AY" kavramının temelini oluşturmuştur!</div>
                    </div>
                </div>
                <div class="visual-panel">
                    <div class="visual-frame">
                        <img src="../assets/sunum5/slide_ref_16.jpg" alt="Evre Süreleri">
                    </div>
                </div>
            </div>
        """
    },

    # SLAYT 26 — AY'IN EVRELERİ NASIL OLUŞUR?
    {
        "num": 26,
        "kicker": "3. BÖLÜM: AY'IN HAREKETLERİ VE EVRELERİ",
        "title": "Ay'ın Evreleri Nasıl Oluşur?",
        "subtitle": "Gökyüzündeki muazzam şekil değişiminin sırrı!",
        "html": """
            <div class="slide-body">
                <div style="flex: 1.1; display: flex; flex-direction: column; gap: 20px;">
                    <div class="info-card glow-cyan">
                        <ul class="bullet-list">
                            <li class="bullet-item"><i class="fa-solid fa-circle-nodes text-cyan-400"></i> <span>Ay, Dünya etrafında sürekli dolanır. Bu dolanma sırasında Ay'ın Güneş'e ve Dünya'ya göre uzaydaki <strong>KONUMU SÜREKLİ DEĞİŞİR</strong>.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-sun text-amber-400"></i> <span>Güneş, Ay'ın uzaya bakan yarısını DAİMA aydınlatır. Ancak Dünya'dan baktığımızda bu aydınlık kısmın bazen tamamını, bazen yarısını, bazen bir hilalini, bazen de hiçbir kısmını göremeyiz.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-moon text-blue-300"></i> <span>Ay'ın Dünya'dan gözlemlenen bu farklı aydınlık görünümlerine <strong class="highlight-cyan">AY'IN EVRELERİ</strong> denir.</span></li>
                        </ul>
                    </div>
                    <div class="callout-box warning">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <div><strong>EN BÜYÜK YANILGI UYARISI:</strong> Ay'ın evreleri DÜNYA'NIN GÖLGESİ YÜZÜNDEN OLUŞMAZ! Evreler, Ay'ın dolanması sonucu aydınlık kısmın Dünya'dan farklı açılarla görülmesiyle oluşur!</div>
                    </div>
                </div>
                <div class="visual-panel">
                    <div class="visual-frame">
                        <img src="../assets/sunum5/slide_ref_16.jpg" alt="Evrelerin Oluşumu">
                    </div>
                </div>
            </div>
        """
    },

    # SLAYT 27 — AY'IN 4 ANA EVRESİ
    {
        "num": 27,
        "kicker": "3. BÖLÜM: AY'IN HAREKETLERİ VE EVRELERİ",
        "title": "Ay'ın 4 Ana Evresi",
        "subtitle": "Her ana evre arasında yaklaşık 1 HAFTA vardır!",
        "html": """
            <div class="slide-body" style="align-items: stretch;">
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; width: 100%;">
                    <div class="info-card" style="border-color: rgba(148, 163, 184, 0.4); text-align: center; justify-content: space-between;" onclick="showSlide(28)">
                        <div>
                            <span style="font-size: 16px; font-weight: 800; color: #94a3b8;">1. HAFTA</span>
                            <h3 style="font-size: 28px; font-weight: 900; color: #fff; margin: 10px 0;">YENİ AY</h3>
                            <div style="width: 100px; height: 100px; border-radius: 50%; background: #0f172a; border: 3px dashed #64748b; margin: 20px auto;"></div>
                            <p style="font-size: 18px; color: #cbd5e1;">Dünya'ya bakan yüzü karanlıktır. Gökyüzünde görünmez.</p>
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
        """
    },

    # SLAYT 28 — YENİ AY
    {
        "num": 28,
        "kicker": "1. ANA EVRE",
        "title": "Yeni Ay Evresi: Gökyüzünde Kaybolan Ay",
        "subtitle": "Ay Güneş ile Dünya arasına girdiğinde oluşur!",
        "html": """
            <div class="slide-body">
                <div style="flex: 1.1; display: flex; flex-direction: column; gap: 20px;">
                    <div class="info-card glow-blue">
                        <ul class="bullet-list">
                            <li class="bullet-item"><i class="fa-solid fa-arrows-left-right text-blue-400"></i> <span><strong>Konum:</strong> Ay, Güneş ile Dünya arasına girdiğinde gerçekleşir (Güneş - Ay - Dünya).</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-moon text-slate-400"></i> <span>Ay'ın Güneş'e bakan arka yüzü aydınlanır; ancak Dünya'ya bakan ön yüzü tamamen karanlıkta kalır.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-eye-slash text-red-400"></i> <span>Bu nedenle Dünya'dan bakıldığında <strong>AY GÖKYÜZÜNDE GÖRÜLMEZ</strong>.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-clock text-amber-400"></i> <span>Güneş ile birlikte doğar ve Güneş ile birlikte batar.</span></li>
                        </ul>
                    </div>
                    <div class="callout-box tip">
                        <i class="fa-solid fa-lightbulb"></i>
                        <div>Yeni Ay evresinde Ay'ın Güneş alan 'Görünmeyen Yüzü' tamamen pırıl pırıl aydınlıktır; sadece Dünya'ya dönük yüzü karanlıktır!</div>
                    </div>
                </div>
                <div class="visual-panel">
                    <div class="visual-frame contain-img">
                        <img src="../assets/sunum5/slide_ref_15.jpg" alt="Yeni Ay">
                    </div>
                </div>
            </div>
        """
    },

    # SLAYT 29 — İLK DÖRDÜN
    {
        "num": 29,
        "kicker": "2. ANA EVRE",
        "title": "İlk Dördün Evresi: Sağ Taraf Aydınlık (D Harfi)",
        "subtitle": "Yeni Ay'dan yaklaşık 1 hafta (7 gün) sonra görülür!",
        "html": """
            <div class="slide-body">
                <div style="flex: 1.1; display: flex; flex-direction: column; gap: 20px;">
                    <div class="info-card glow-cyan">
                        <ul class="bullet-list">
                            <li class="bullet-item"><i class="fa-solid fa-calendar-check text-cyan-400"></i> <span>Yeni Ay evresinden yaklaşık <strong>1 HAFTA SONRA</strong> gerçekleşir.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-circle-half-stroke text-amber-400"></i> <span>Dünya'dan bakıldığında Ay'ın <strong>SAĞ TARAFI AYDINLIK</strong>, sol tarafı karanlık görünür.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-font text-green-400"></i> <span>Aydınlık olan sağ taraf düz <strong class="highlight-cyan">'D' HARFİNE</strong> benzer! (D = Düz / Doğru / İlk).</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-clock text-blue-400"></i> <span>Öğle saatlerinde doğar, gün batımında gökyüzünün en tepesinde pırıl pırıl parlar ve gece yarısı batar.</span></li>
                        </ul>
                    </div>
                    <div class="callout-box tip">
                        <i class="fa-solid fa-brain"></i>
                        <div><strong>ŞİFRE:</strong> 'D' harfi gibi olan İLK Dördün'dür! Sağ tarafı aydınlıktır.</div>
                    </div>
                </div>
                <div class="visual-panel">
                    <div class="visual-frame contain-img">
                        <img src="../assets/sunum5/slide_ref_15.jpg" alt="İlk Dördün">
                    </div>
                </div>
            </div>
        """
    },

    # SLAYT 30 — DOLUNAY
    {
        "num": 30,
        "kicker": "3. ANA EVRE",
        "title": "Dolunay Evresi: Işıl Işıl Parlayan Tam Daire",
        "subtitle": "İlk Dördün'den 1 hafta, Yeni Ay'dan 2 hafta sonra!",
        "html": """
            <div class="slide-body">
                <div style="flex: 1.1; display: flex; flex-direction: column; gap: 20px;">
                    <div class="info-card glow-gold">
                        <ul class="bullet-list">
                            <li class="bullet-item"><i class="fa-solid fa-arrows-left-right text-amber-400"></i> <span><strong>Konum:</strong> Dünya, Güneş ile Ay'ın arasındadır (Güneş - Dünya - Ay hizası).</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-circle text-yellow-300"></i> <span>Ay'ın Dünya'ya bakan yüzünün <strong>TAMAMI</strong> Güneş ışığı alır.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-certificate text-amber-400"></i> <span>Dünya'dan bakıldığında parlak, kusursuz bir <strong>DAİRE</strong> şeklinde görülür.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-moon text-blue-300"></i> <span>Güneş batarken doğar, bütün gece gökyüzünü aydınlatır ve sabah gün doğarken batar.</span></li>
                        </ul>
                    </div>
                    <div class="callout-box remember">
                        <i class="fa-solid fa-star"></i>
                        <div>Dolunay evresinde Ay'ın parlaklığı en üst seviyededir ve yüzeyindeki krater detayları harika bir şekilde gözlemlenir!</div>
                    </div>
                </div>
                <div class="visual-panel">
                    <div class="visual-frame contain-img">
                        <img src="../assets/sunum5/slide_ref_15.jpg" alt="Dolunay">
                    </div>
                </div>
            </div>
        """
    },

    # SLAYT 31 — SON DÖRDÜN
    {
        "num": 31,
        "kicker": "4. ANA EVRE",
        "title": "Son Dördün Evresi: Sol Taraf Aydınlık (Ters D)",
        "subtitle": "Dolunay'dan 1 hafta sonra gökyüzünde son durak!",
        "html": """
            <div class="slide-body">
                <div style="flex: 1.1; display: flex; flex-direction: column; gap: 20px;">
                    <div class="info-card glow-blue">
                        <ul class="bullet-list">
                            <li class="bullet-item"><i class="fa-solid fa-calendar-check text-blue-400"></i> <span>Dolunay evresinden yaklaşık <strong>1 HAFTA SONRA</strong> gerçekleşir.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-circle-half-stroke text-blue-300"></i> <span>Dünya'dan bakıldığında Ay'ın <strong>SOL TARAFI AYDINLIK</strong>, sağ tarafı karanlık görünür.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-font text-purple-400"></i> <span>Aydınlık olan sol taraf <strong class="highlight-cyan">TERS 'D' HARFİNE</strong> benzer!</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-clock text-amber-400"></i> <span>Gece yarısı doğar, sabah ve öğleye kadar gündüz gökyüzünde belirgin olarak görülebilir.</span></li>
                        </ul>
                    </div>
                    <div class="callout-box tip">
                        <i class="fa-solid fa-brain"></i>
                        <div><strong>KOLAY AYIRT ETME ŞİFRESİ:</strong><br>• Düz D harfi = <strong>İLK</strong> Dördün (Sağ aydınlık)<br>• Ters D harfi = <strong>SON</strong> Dördün (Sol aydınlık)</div>
                    </div>
                </div>
                <div class="visual-panel">
                    <div class="visual-frame contain-img">
                        <img src="../assets/sunum5/slide_ref_15.jpg" alt="Son Dördün">
                    </div>
                </div>
            </div>
        """
    },

    # SLAYT 32 — HİLAL EVRELERİ
    {
        "num": 32,
        "kicker": "ARA EVRELER",
        "title": "Hilal Evreleri: Büyüyen ve Küçülen Hilal",
        "subtitle": "Gökyüzünün en zarif iki yay şekli!",
        "html": """
            <div class="slide-body" style="align-items: stretch;">
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
            </div>
        """
    },

    # SLAYT 33 — ŞİŞKİN AY EVRELERİ
    {
        "num": 33,
        "kicker": "ARA EVRELER",
        "title": "Şişkin Ay Evreleri: Yarıdan Fazlası Aydınlık",
        "subtitle": "Dolunay öncesi ve sonrası şişmanlayan ve incelen Ay!",
        "html": """
            <div class="slide-body" style="align-items: stretch;">
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
            </div>
        """
    },

    # SLAYT 34 — AY'IN SEKİZ EVRESİ
    {
        "num": 34,
        "kicker": "3. BÖLÜM: AY'IN HAREKETLERİ VE EVRELERİ",
        "title": "Ay'ın 8 Evresinin Kusursuz Döngüsü",
        "subtitle": "Yeni Ay'dan başlayıp 29,5 günde tamamlanan büyük tur!",
        "html": """
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
        """
    },

    # SLAYT 35 — AY'IN EVRE DÖNGÜSÜ VE TAKVİM
    {
        "num": 35,
        "kicker": "3. BÖLÜM: AY'IN HAREKETLERİ VE EVRELERİ",
        "title": "Ay'ın Evre Döngüsü ve Takvim İlişkisi",
        "subtitle": "Ay gündüz de gökyüzünde görülür mü?",
        "html": """
            <div class="slide-body">
                <div style="flex: 1.1; display: flex; flex-direction: column; gap: 20px;">
                    <div class="info-card glow-cyan">
                        <ul class="bullet-list">
                            <li class="bullet-item"><i class="fa-solid fa-calendar-days text-cyan-400"></i> <span>Bir Yeni Ay'dan sonraki Yeni Ay'a kadar yaklaşık <strong>29 GÜN 12 SAAT (29,5 Gün)</strong> geçer. Bu süreye <strong class="highlight-cyan">1 AY</strong> denir.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-mosque text-emerald-400"></i> <span>Tarih boyunca kullanılan <strong>Hicri Takvim</strong>, doğrudan Ay'ın bu 29,5 günlük evre döngüsüne göre hesaplanmıştır.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-sun text-amber-400"></i> <span><strong>AY GÜNDÜZ DE GÖRÜLÜR!:</strong> Evet! Ay sadece geceleri değil, gündüzleri de sıkça gökyüzünde belirir.</span></li>
                            <li class="bullet-item"><i class="fa-solid fa-eye text-blue-300"></i> <span>Özellikle <strong>İlk Dördün</strong> öğleden sonra, <strong>Son Dördün</strong> ise sabah saatlerinde mavi gökyüzünde çok net şekilde izlenebilir.</span></li>
                        </ul>
                    </div>
                    <div class="callout-box tip">
                        <i class="fa-solid fa-clock"></i>
                        <div>Gündüz gökyüzünde Ay'ı görürseniz şaşırmayın; Ay kendi yörüngesinde dolanırken Güneş ışığını bize yansıtmaya devam etmektedir!</div>
                    </div>
                </div>
                <div class="visual-panel">
                    <div class="visual-frame">
                        <img src="../assets/sunum5/slide_ref_15.jpg" alt="Takvim ve Gündüz Ay">
                    </div>
                </div>
            </div>
        """
    },

    # SLAYT 36 — GÜNEŞ, DÜNYA VE AY'I KARŞILAŞTIRALIM
    {
        "num": 36,
        "kicker": "4. BÖLÜM: GÜNEŞ, DÜNYA VE AY",
        "title": "Güneş, Dünya ve Ay'ı Karşılaştıralım",
        "subtitle": "Üç kozmik kardeşin büyük ortak ve farklı yönleri!",
        "html": """
            <div class="slide-body" style="align-items: stretch;">
                <div class="info-card glow-gold" style="width: 100%; padding: 25px 35px;">
                    <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 24px;">
                        <thead>
                            <tr style="border-bottom: 3px solid rgba(255,255,255,0.25); color: #fbbf24;">
                                <th style="padding: 12px 10px;">ÖZELLİK</th>
                                <th style="padding: 12px 10px; color: #f59e0b;"><i class="fa-solid fa-sun mr-2"></i> GÜNEŞ</th>
                                <th style="padding: 12px 10px; color: #38bdf8;"><i class="fa-solid fa-earth-americas mr-2"></i> DÜNYA</th>
                                <th style="padding: 12px 10px; color: #cbd5e1;"><i class="fa-solid fa-moon mr-2"></i> AY</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                                <td style="padding: 12px 10px; font-weight: 800; color: #fde047;">Gök Cismi</td>
                                <td style="padding: 12px 10px;">Yıldız</td>
                                <td style="padding: 12px 10px;">Gezegen</td>
                                <td style="padding: 12px 10px;">Doğal Uydu</td>
                            </tr>
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                                <td style="padding: 12px 10px; font-weight: 800; color: #fde047;">Şekli</td>
                                <td style="padding: 12px 10px;">Küresel</td>
                                <td style="padding: 12px 10px;">Küresel (Geoit)</td>
                                <td style="padding: 12px 10px;">Küresel</td>
                            </tr>
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                                <td style="padding: 12px 10px; font-weight: 800; color: #fde047;">Işık Durumu</td>
                                <td style="padding: 12px 10px; color: #4ade80;">Işık Kaynağı</td>
                                <td style="padding: 12px 10px; color: #94a3b8;">Yansıtıcı Cisim</td>
                                <td style="padding: 12px 10px; color: #94a3b8;">Yansıtıcı Cisim</td>
                            </tr>
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                                <td style="padding: 12px 10px; font-weight: 800; color: #fde047;">Dönme Yönü</td>
                                <td style="padding: 12px 10px;">Saat yönü tersi</td>
                                <td style="padding: 12px 10px;">Saat yönü tersi</td>
                                <td style="padding: 12px 10px;">Saat yönü tersi</td>
                            </tr>
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                                <td style="padding: 12px 10px; font-weight: 800; color: #fde047;">Hareket Sayısı</td>
                                <td style="padding: 12px 10px;">1 Dönme + 1 Dolanma</td>
                                <td style="padding: 12px 10px;">1 Dönme + 1 Dolanma</td>
                                <td style="padding: 12px 10px; color: #38bdf8;"><strong>3 Hareket</strong></td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 10px; font-weight: 800; color: #fde047;">Büyüklük</td>
                                <td colspan="3" style="padding: 12px 10px; font-weight: 900; color: #f59e0b;">GÜNEŞ > DÜNYA > AY</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        """
    },

    # SLAYT 37 — GÜNEŞ, DÜNYA VE AY MODELİ
    {
        "num": 37,
        "kicker": "4. BÖLÜM: MODELLEME ETKİNLİĞİ",
        "title": "Sınıfta Gezegen Modeli Oluşturalım!",
        "subtitle": "Günlük yaşam nesneleriyle boyut karşılaştırması!",
        "html": """
            <div class="slide-body">
                <div style="flex: 1.1; display: flex; flex-direction: column; gap: 20px;">
                    <div class="info-card glow-cyan">
                        <div class="card-header-bar">
                            <div class="card-icon" style="background: rgba(6,182,212,0.2); color: #22d3ee;"><i class="fa-solid fa-shapes"></i></div>
                            <div class="card-title">En Uygun Nesne Eşleştirmeleri</div>
                        </div>
                        <ul class="bullet-list">
                            <li class="bullet-item"><i class="fa-solid fa-basketball text-amber-500"></i> <span><strong>1. Model:</strong> Güneş = <strong class="highlight-gold">PİLATES TOPU</strong> | Dünya = <strong class="highlight-cyan">ELMA</strong> | Ay = <strong class="highlight-green">BEZELYE TANESİ</strong></span></li>
                            <li class="bullet-item"><i class="fa-solid fa-circle text-orange-400"></i> <span><strong>2. Model:</strong> Güneş = <strong class="highlight-gold">BASKETBOL TOPU</strong> | Dünya = <strong class="highlight-cyan">NOHUT TANESİ</strong> | Ay = <strong class="highlight-green">TOPLU İĞNE BAŞI</strong></span></li>
                            <li class="bullet-item"><i class="fa-solid fa-apple-whole text-red-400"></i> <span><strong>3. Model:</strong> Güneş = <strong class="highlight-gold">BÜYÜK KARPUZ</strong> | Dünya = <strong class="highlight-cyan">KİRAZ</strong> | Ay = <strong class="highlight-green">MERCİMEK TANESİ</strong></span></li>
                        </ul>
                    </div>
                    <div class="callout-box warning">
                        <i class="fa-solid fa-ruler-combined"></i>
                        <div><strong>BİLİMSEL NOT:</strong> Gerçek boyut oranları ile gerçek uzaklık oranlarını sınıfta aynı anda modellemek imkânsızdır; çünkü basketbol topu sınıftaysa, nohut tanesini okuldan 25 metre uzağa koymak gerekir!</div>
                    </div>
                </div>
                <div class="visual-panel">
                    <div class="visual-frame">
                        <img src="../assets/sunum5/slide_ref_7.jpg" alt="Boyut Modeli">
                    </div>
                </div>
            </div>
        """
    },

    # SLAYT 38 — NELER ÖĞRENDİK?
    {
        "num": 38,
        "kicker": "ÖZET VE BİLİMSEL KONTROL",
        "title": "Neler Öğrendik? Doğru mu, Yanlış mı?",
        "subtitle": "Sınavlarda en çok tuzağa düşürülen yanılgılar!",
        "html": """
            <div class="slide-body" style="flex-direction: column; justify-content: center;">
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; width: 100%;">
                    <div class="interactive-quiz-card" onclick="answerQuiz(this, false, 'Ay\\'ın evreleri Dünya\\'nın gölgesiyle değil, Ay\\'ın dolanırken aydınlık yüzünün Dünya\\'dan farklı açılarda görülmesiyle oluşur!')">
                        <span style="font-size: 15px; font-weight: 800; color: #f87171;">Tıkla Cevabı Gör</span>
                        <div style="font-size: 22px; font-weight: 700; color: #fff; margin-top: 6px;">❌ 'Ay\\'ın evreleri Dünya\\'nın gölgesi yüzünden oluşur.'</div>
                        <div class="quiz-feedback"></div>
                    </div>

                    <div class="interactive-quiz-card" onclick="answerQuiz(this, true, 'Güneş, Dünya ve Ay\\'ın üçü de kendi eksenleri etrafında saat yönünün tersine (batıdan doğuya) döner.')">
                        <span style="font-size: 15px; font-weight: 800; color: #4ade80;">Tıkla Cevabı Gör</span>
                        <div style="font-size: 22px; font-weight: 700; color: #fff; margin-top: 6px;">✔️ 'Güneş, kendi ekseni etrafında saat yönünün tersine döner.'</div>
                        <div class="quiz-feedback"></div>
                    </div>

                    <div class="interactive-quiz-card" onclick="answerQuiz(this, false, 'Görünmeyen yüz sürekli karanlık değildir! Ay dolanırken o yüz de Güneş ışığı alır.')">
                        <span style="font-size: 15px; font-weight: 800; color: #f87171;">Tıkla Cevabı Gör</span>
                        <div style="font-size: 22px; font-weight: 700; color: #fff; margin-top: 6px;">❌ 'Ay\\'ın Dünya\\'dan görünmeyen yüzü sürekli karanlıktır.'</div>
                        <div class="quiz-feedback"></div>
                    </div>

                    <div class="interactive-quiz-card" onclick="answerQuiz(this, true, 'Ay\\'da atmosfer yok denecek kadar ince olduğu için yağmur, rüzgâr gibi hava olayları görülmez ve izler korunur.')">
                        <span style="font-size: 15px; font-weight: 800; color: #4ade80;">Tıkla Cevabı Gör</span>
                        <div style="font-size: 22px; font-weight: 700; color: #fff; margin-top: 6px;">✔️ 'Ay\\'da rüzgâr olmadığı için astronotların ayak izleri silinmez.'</div>
                        <div class="quiz-feedback"></div>
                    </div>
                </div>
            </div>
        """
    },

    # SLAYT 39 — ÜNİTE DEĞERLENDİRME
    {
        "num": 39,
        "kicker": "5. BÖLÜM: BİLGİ YARIŞMASI",
        "title": "Ünite Değerlendirme & Mini Sınav",
        "subtitle": "Akıllı tahtada şıklara tıkla, doğru cevabı anında gör!",
        "html": """
            <div class="slide-body" style="flex-direction: column; justify-content: center;">
                <div class="info-card glow-cyan" style="width: 100%; padding: 25px 30px;">
                    <div style="font-size: 26px; font-weight: 800; color: #ffffff; margin-bottom: 20px;">
                        <i class="fa-solid fa-circle-question text-amber-400 mr-2"></i> SORU 1: Dünya'dan bakıldığında Ay'ın sağ yarısının 'D' harfi gibi aydınlık görüldüğü ana evre hangisidir?
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
                        <div class="interactive-quiz-card" onclick="answerQuiz(this, false, 'Yeni Ay evresinde Ay gökyüzünde hiç görünmez!')">
                            <strong style="font-size: 22px;">A) Yeni Ay</strong>
                            <div class="quiz-feedback"></div>
                        </div>
                        <div class="interactive-quiz-card" onclick="answerQuiz(this, true, 'Tebrikler! İlk Dördün evresinde Ay sağ yarısı aydınlık olan düz D harfi şeklinde parlar!')">
                            <strong style="font-size: 22px;">B) İlk Dördün</strong>
                            <div class="quiz-feedback"></div>
                        </div>
                        <div class="interactive-quiz-card" onclick="answerQuiz(this, false, 'Dolunay evresinde Ay tam daire şeklinde aydınlıktır!')">
                            <strong style="font-size: 22px;">C) Dolunay</strong>
                            <div class="quiz-feedback"></div>
                        </div>
                        <div class="interactive-quiz-card" onclick="answerQuiz(this, false, 'Son Dördün evresinde Ay sol yarısı aydınlık olan TERS D harfi şeklindedir!')">
                            <strong style="font-size: 22px;">D) Son Dördün</strong>
                            <div class="quiz-feedback"></div>
                        </div>
                    </div>
                </div>
            </div>
        """
    },

    # SLAYT 40 — UZAY ARAŞTIRMALARI
    {
        "num": 40,
        "kicker": "ZENGİNLEŞTİRME VE BİLİM TARİHİ",
        "title": "Uzay Araştırmaları ve Tarihin Öncüleri",
        "subtitle": "İnsanlığın Dünya dışına ilk adımları!",
        "html": """
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
        """
    },

    # SLAYT 41 — TEBRİKLER & BİTİŞ KARTI
    {
        "num": 41,
        "kicker": "TEBRİKLER GENÇ BİLİM İNSANI!",
        "title": "1. Üniteyi Başarıyla Tamamladın!",
        "subtitle": "Rotamız Fen, Hedefimiz Bilim!",
        "html": """
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
        """
    }
]

# HTML Şablonu (16:9 Akıllı Tahta Uyarlamalı, Sinematik Uzay Teması, İnteraktif Kontroller)
html_template = """<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>5. Sınıf Fen Bilimleri 1. Ünite: Güneş, Dünya ve Ay | Rotalı Fenci</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,600;0,700;0,800;0,900;1,700&family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <!-- FontAwesome 6 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-tap-highlight-color: transparent;
        }

        :root {
            --stage-w: 1920px;
            --stage-h: 1080px;
            --bg-deep: #030712;
            --card-bg: rgba(15, 23, 42, 0.78);
            --card-border: rgba(255, 255, 255, 0.12);
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --accent-cyan: #38bdf8;
            --accent-gold: #fbbf24;
            --accent-blue: #60a5fa;
            --accent-green: #4ade80;
            --accent-red: #f87171;
            --accent-purple: #c084fc;
        }

        html, body {
            width: 100vw;
            height: 100vh;
            overflow: hidden;
            background-color: var(--bg-deep);
            font-family: 'Poppins', sans-serif;
            color: var(--text-main);
            user-select: none;
        }

        /* Sahne Taşıyıcı ve Otomatik 16:9 Ölçekleme */
        #stage-viewport {
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
            background: #02040a;
        }

        #presentation-stage {
            width: var(--stage-w);
            height: var(--stage-h);
            flex-shrink: 0;
            position: relative;
            background: radial-gradient(circle at 50% 25%, #0f172a 0%, #060913 65%, #02040a 100%);
            overflow: hidden;
            transform-origin: center center;
            box-shadow: 0 0 100px rgba(0, 0, 0, 0.95);
        }

        #stars-canvas {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }

        /* Üst İlerleme Çubuğu */
        .progress-bar-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 6px;
            background: rgba(255, 255, 255, 0.08);
            z-index: 60;
        }
        #slide-progress-bar {
            height: 100%;
            width: 2.4%;
            background: linear-gradient(90deg, #38bdf8, #818cf8, #f43f5e);
            box-shadow: 0 0 12px rgba(56, 189, 248, 0.8);
            transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* SABİT MARKA ÖGELERİ (HER SLAYTTA) */
        .fixed-branding {
            position: absolute;
            z-index: 50;
            display: flex;
            align-items: center;
            pointer-events: auto;
        }

        /* Sağ Üst: Rotalı Fenci Orijinal Logo */
        .branding-top-right {
            top: 24px;
            right: 36px;
            gap: 16px;
        }
        .branding-logo-img {
            height: 82px;
            width: auto;
            object-fit: contain;
            filter: drop-shadow(0 6px 18px rgba(0,0,0,0.6));
            transition: transform 0.2s ease;
        }
        .branding-logo-img:hover {
            transform: scale(1.04);
        }

        /* Sol Alt: Sabit Instagram Rozeti */
        .branding-bottom-left {
            bottom: 24px;
            left: 36px;
            display: flex;
            align-items: center;
            gap: 12px;
            background: rgba(15, 23, 42, 0.8);
            border: 1.5px solid rgba(244, 114, 182, 0.4);
            padding: 8px 20px;
            border-radius: 30px;
            backdrop-filter: blur(14px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }
        .insta-icon {
            font-size: 24px;
            background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .insta-handle {
            font-family: 'Montserrat', sans-serif;
            font-size: 21px;
            font-weight: 800;
            letter-spacing: 0.5px;
            color: #fce7f3;
        }

        /* ALT AKILLI TAHTA KONTROL ÇUBUĞU */
        .fixed-nav-bar {
            position: absolute;
            bottom: 22px;
            right: 36px;
            z-index: 55;
            display: flex;
            align-items: center;
            gap: 12px;
            background: rgba(15, 23, 42, 0.88);
            border: 1.5px solid rgba(255, 255, 255, 0.16);
            backdrop-filter: blur(20px);
            border-radius: 40px;
            padding: 8px 16px;
            box-shadow: 0 10px 35px rgba(0,0,0,0.6);
        }
        .nav-btn {
            background: rgba(30, 41, 59, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.14);
            color: #f1f5f9;
            width: 52px;
            height: 52px;
            border-radius: 26px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .nav-btn:hover {
            background: rgba(51, 65, 85, 1);
            border-color: var(--accent-cyan);
            color: #38bdf8;
            transform: translateY(-2px);
        }
        .nav-btn.primary {
            background: linear-gradient(135deg, #0284c7, #2563eb);
            border-color: #60a5fa;
            width: auto;
            padding: 0 22px;
            gap: 10px;
            font-weight: 800;
            font-size: 20px;
        }
        .nav-btn.primary:hover {
            filter: brightness(1.15);
        }
        .counter-badge {
            font-family: 'Montserrat', sans-serif;
            font-size: 21px;
            font-weight: 800;
            color: #f8fafc;
            min-width: 95px;
            text-align: center;
            padding: 0 8px;
            font-variant-numeric: tabular-nums;
        }

        /* SLAYT KAPLARI */
        .slide-container {
            display: none;
            width: 100%;
            height: 100%;
            padding: 44px 64px 92px 64px;
            flex-direction: column;
            position: relative;
            z-index: 10;
        }
        .slide-container.active {
            display: flex;
            animation: slideFadeIn 0.35s ease;
        }
        @keyframes slideFadeIn {
            from { opacity: 0; transform: scale(0.99); }
            to { opacity: 1; transform: scale(1); }
        }

        /* SLAYT BAŞLIKLARI (Arka Sıralardan Okunabilir 48-64px) */
        .slide-header {
            display: flex;
            flex-direction: column;
            gap: 4px;
            margin-bottom: 22px;
            max-width: 1450px;
        }
        .slide-kicker {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            font-size: 19px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: var(--accent-cyan);
        }
        .slide-title {
            font-size: 48px;
            font-weight: 900;
            line-height: 1.15;
            color: #ffffff;
            letter-spacing: -0.5px;
            text-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
        }
        .slide-subtitle {
            font-size: 22px;
            font-weight: 600;
            color: var(--text-muted);
            margin-top: 2px;
        }

        /* SLAYT GÖVDESİ VE KARTLAR */
        .slide-body {
            flex: 1;
            display: flex;
            gap: 36px;
            min-height: 0;
            position: relative;
            overflow: hidden;
        }

        .info-card {
            background: var(--card-bg);
            border: 1.5px solid var(--card-border);
            border-radius: 26px;
            backdrop-filter: blur(20px);
            box-shadow: 0 20px 45px rgba(0, 0, 0, 0.45);
            display: flex;
            flex-direction: column;
            padding: 28px 32px;
            transition: all 0.25s ease;
        }
        .glow-gold {
            border-color: rgba(245, 158, 11, 0.45);
            box-shadow: 0 0 35px rgba(245, 158, 11, 0.15);
        }
        .glow-cyan {
            border-color: rgba(34, 211, 238, 0.45);
            box-shadow: 0 0 35px rgba(34, 211, 238, 0.15);
        }
        .glow-blue {
            border-color: rgba(56, 189, 248, 0.45);
            box-shadow: 0 0 35px rgba(56, 189, 248, 0.15);
        }
        .glow-red {
            border-color: rgba(239, 68, 68, 0.45);
            box-shadow: 0 0 35px rgba(239, 68, 68, 0.15);
        }
        .glow-purple {
            border-color: rgba(168, 85, 247, 0.45);
            box-shadow: 0 0 35px rgba(168, 85, 247, 0.15);
        }
        .glow-green {
            border-color: rgba(34, 197, 94, 0.45);
            box-shadow: 0 0 35px rgba(34, 197, 94, 0.15);
        }

        /* LİSTE ÖGELERİ (26-30px Okunabilirlik) */
        .bullet-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        .bullet-item {
            display: flex;
            align-items: flex-start;
            gap: 16px;
            font-size: 23px;
            line-height: 1.45;
            color: #f1f5f9;
        }
        .bullet-item i {
            font-size: 24px;
            margin-top: 5px;
            flex-shrink: 0;
        }

        /* Vurgular */
        .highlight-cyan { color: var(--accent-cyan); font-weight: 800; }
        .highlight-gold { color: var(--accent-gold); font-weight: 800; }
        .highlight-green { color: var(--accent-green); font-weight: 800; }
        .highlight-red { color: var(--accent-red); font-weight: 800; }
        .highlight-blue { color: var(--accent-blue); font-weight: 800; }
        .highlight-purple { color: var(--accent-purple); font-weight: 800; }

        /* VURGU KUTULARI (Biliyor musun, Dikkat, Unutma) */
        .callout-box {
            display: flex;
            align-items: center;
            gap: 18px;
            padding: 16px 24px;
            border-radius: 20px;
            font-size: 21px;
            line-height: 1.4;
            margin-top: auto;
        }
        .callout-box.tip {
            background: rgba(30, 58, 138, 0.5);
            border: 1.5px solid #3b82f6;
            color: #bfdbfe;
        }
        .callout-box.remember {
            background: rgba(120, 53, 15, 0.5);
            border: 1.5px solid #f59e0b;
            color: #fef08a;
        }
        .callout-box.warning, .callout-box.attention {
            background: rgba(127, 29, 29, 0.5);
            border: 1.5px solid #ef4444;
            color: #fecaca;
        }
        .callout-box i {
            font-size: 32px;
            flex-shrink: 0;
        }

        /* GÖRSEL ÇERÇEVELERİ */
        .visual-panel {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 0;
        }
        .visual-frame {
            width: 100%;
            height: 100%;
            max-height: 620px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(10, 15, 30, 0.65);
            border: 2px solid rgba(255, 255, 255, 0.16);
            border-radius: 28px;
            overflow: hidden;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.65);
        }
        .visual-frame img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 26px;
        }

        /* ETKİLEŞİMLİ TEST KARTLARI */
        .interactive-quiz-card {
            background: rgba(15, 23, 42, 0.85);
            border: 2px solid rgba(255, 255, 255, 0.16);
            border-radius: 20px;
            padding: 22px 26px;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
        }
        .interactive-quiz-card:hover {
            transform: translateY(-3px);
            border-color: var(--accent-cyan);
            background: rgba(30, 41, 59, 0.9);
        }
        .interactive-quiz-card.correct {
            border-color: #22c55e !important;
            background: rgba(20, 83, 45, 0.5) !important;
            box-shadow: 0 0 30px rgba(34, 197, 94, 0.3) !important;
        }
        .interactive-quiz-card.wrong {
            border-color: #ef4444 !important;
            background: rgba(127, 29, 29, 0.5) !important;
            box-shadow: 0 0 30px rgba(239, 68, 68, 0.3) !important;
        }
        .quiz-feedback {
            display: none;
            margin-top: 12px;
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 18px;
            line-height: 1.45;
            font-weight: 600;
        }
        .quiz-feedback.show {
            display: block;
            animation: fadeIn 0.3s ease;
        }
        .quiz-feedback.fb-correct {
            background: rgba(34, 197, 94, 0.25);
            color: #86efac;
            border: 1px solid #22c55e;
        }
        .quiz-feedback.fb-wrong {
            background: rgba(239, 68, 68, 0.25);
            color: #fca5a5;
            border: 1px solid #ef4444;
        }

        /* GENEL BUTONLAR */
        .tool-btn {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            padding: 14px 28px;
            border-radius: 22px;
            background: rgba(30, 41, 59, 0.85);
            color: #fff;
            border: 1.5px solid rgba(255, 255, 255, 0.18);
            font-size: 21px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .tool-btn:hover {
            background: rgba(51, 65, 85, 0.95);
            border-color: var(--accent-cyan);
            transform: translateY(-2px);
        }
        .tool-btn.primary {
            background: linear-gradient(135deg, #0284c7, #2563eb);
            border-color: #60a5fa;
            box-shadow: 0 8px 30px rgba(37, 99, 235, 0.45);
        }
        .tool-btn.primary:hover {
            filter: brightness(1.15);
        }

        /* ÇEKMECE / TÜM SLAYTLAR MODALI */
        #drawer-modal {
            position: fixed;
            inset: 0;
            background: rgba(2, 6, 23, 0.88);
            backdrop-filter: blur(16px);
            z-index: 100;
            display: none;
            align-items: center;
            justify-content: center;
        }
        #drawer-modal.open {
            display: flex;
        }
        .drawer-panel {
            width: 92%;
            max-width: 1650px;
            max-height: 86vh;
            background: #0b1120;
            border: 2px solid rgba(255, 255, 255, 0.16);
            border-radius: 30px;
            padding: 32px 36px;
            display: flex;
            flex-direction: column;
            gap: 20px;
            box-shadow: 0 30px 80px rgba(0,0,0,0.9);
        }
        .drawer-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1.5px solid rgba(255, 255, 255, 0.1);
            padding-bottom: 16px;
        }
        .drawer-header h3 {
            font-size: 32px;
            font-weight: 900;
            color: #ffffff;
            display: flex;
            align-items: center;
            gap: 14px;
        }
        .drawer-close-btn {
            background: rgba(239, 68, 68, 0.2);
            border: 1.5px solid #ef4444;
            color: #fecaca;
            width: 46px;
            height: 46px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            cursor: pointer;
        }
        .drawer-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 16px;
            overflow-y: auto;
            padding-right: 10px;
        }
        .drawer-card {
            background: rgba(30, 41, 59, 0.75);
            border: 1.5px solid rgba(255, 255, 255, 0.1);
            border-radius: 18px;
            padding: 16px 20px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .drawer-card:hover {
            background: rgba(51, 65, 85, 0.95);
            border-color: var(--accent-cyan);
            transform: translateY(-2px);
        }
        .drawer-card.current {
            border-color: #38bdf8;
            background: rgba(2, 132, 199, 0.35);
        }
        .drawer-num {
            font-size: 14px;
            font-weight: 800;
            color: var(--accent-cyan);
            letter-spacing: 1px;
        }
        .drawer-title {
            font-size: 17px;
            font-weight: 700;
            color: #fff;
            margin-top: 4px;
            line-height: 1.3;
        }
        .drawer-kicker {
            font-size: 13px;
            color: var(--text-muted);
            margin-top: 4px;
        }

        /* YAZDIRMA / PDF ÇIKTISI */
        @media print {
            body {
                overflow: visible !important;
                background: #02040a !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            #stage-viewport {
                display: block !important;
                width: 100% !important;
                height: auto !important;
                overflow: visible !important;
            }
            #presentation-stage {
                transform: none !important;
                width: 100% !important;
                height: auto !important;
                box-shadow: none !important;
            }
            .fixed-nav-bar, #drawer-modal, .progress-bar-container {
                display: none !important;
            }
            .slide-container {
                display: flex !important;
                page-break-after: always !important;
                break-after: page !important;
                height: 100vh !important;
                box-sizing: border-box !important;
            }
        }
    </style>
</head>
<body>
    <div id="stage-viewport">
        <div id="presentation-stage">
            <!-- Arka Plan Dinamik Yıldızlar -->
            <canvas id="stars-canvas"></canvas>

            <!-- Üst İlerleme Çubuğu -->
            <div class="progress-bar-container">
                <div id="slide-progress-bar"></div>
            </div>

            <!-- SABİT LOGO (SAĞ ÜST) -->
            <div class="fixed-branding branding-top-right">
                <img src="../assets/rotali-logo-clean.png" alt="Rotalı Fenci Logo" class="branding-logo-img" title="Rotalı Fenci">
            </div>

            <!-- SABİT INSTAGRAM ROZETİ (SOL ALT) -->
            <div class="fixed-branding branding-bottom-left">
                <i class="fa-brands fa-instagram insta-icon"></i>
                <span class="insta-handle">@rotalifenci</span>
            </div>

            <!-- SLAYTLAR DİNAMİK ALANI -->
            __SLIDES_PLACEHOLDER__

            <!-- SABİT AKILLI TAHTA KONTROL ÇUBUĞU (SAĞ ALT) -->
            <div class="fixed-nav-bar">
                <button class="nav-btn" onclick="prevSlide()" title="Önceki Slayt (Sol Ok)"><i class="fa-solid fa-chevron-left"></i></button>
                <span id="slide-counter-badge" class="counter-badge">1 / 41</span>
                <button class="nav-btn primary" onclick="nextSlide()" title="Sonraki Slayt (Sağ Ok / Boşluk)">
                    <span>İleri</span> <i class="fa-solid fa-chevron-right"></i>
                </button>
                <button class="nav-btn" onclick="toggleDrawer()" title="Slayt Listesi / Rotalar (M)"><i class="fa-solid fa-layer-group"></i></button>
                <button class="nav-btn" onclick="toggleSound()" id="sound-btn" title="Ses Aç/Kapat"><i class="fa-solid fa-volume-high"></i></button>
                <button class="nav-btn" onclick="toggleFullscreen()" title="Tam Ekran (F)"><i class="fa-solid fa-expand"></i></button>
                <button class="nav-btn" onclick="window.print()" title="Sunumu Yazdır / PDF"><i class="fa-solid fa-print"></i></button>
            </div>
        </div>
    </div>

    <!-- ÇEKMECE / TÜM SLAYTLAR LİSTESİ MODALI -->
    <div id="drawer-modal" onclick="if(event.target === this) toggleDrawer()">
        <div class="drawer-panel">
            <div class="drawer-header">
                <h3><i class="fa-solid fa-compass text-amber-400"></i> Ünite Öğrenme Rotaları (41 Slayt)</h3>
                <button class="drawer-close-btn" onclick="toggleDrawer()"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="drawer-grid">
                __DRAWER_PLACEHOLDER__
            </div>
        </div>
    </div>

    <script>
        let currentSlide = 1;
        const totalSlides = 41;
        let soundEnabled = true;
        let audioCtx = null;

        // 16:9 Ekran Boyutlandırma Motoru (Akıllı Tahta / Pardus Uyumlu)
        function scaleStage() {
            const stage = document.getElementById('presentation-stage');
            if (!stage) return;
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const scale = Math.min(vw / 1920, vh / 1080);
            stage.style.transform = `scale(${scale})`;
        }
        window.addEventListener('resize', scaleStage);
        window.addEventListener('DOMContentLoaded', () => {
            scaleStage();
            initStars();
        });

        // Web Audio API Sentezleyici
        function getAudioContext() {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            return audioCtx;
        }

        function playWhoosh() {
            if (!soundEnabled) return;
            try {
                const ctx = getAudioContext();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(420, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.16);
                gain.gain.setValueAtTime(0.08, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.16);
            } catch (e) {}
        }

        function playChime(isCorrect) {
            if (!soundEnabled) return;
            try {
                const ctx = getAudioContext();
                const now = ctx.currentTime;
                if (isCorrect) {
                    const freqs = [523.25, 659.25, 783.99, 1046.5];
                    freqs.forEach((f, idx) => {
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.type = 'triangle';
                        osc.frequency.setValueAtTime(f, now + idx * 0.08);
                        gain.gain.setValueAtTime(0.12, now + idx * 0.08);
                        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.start(now + idx * 0.08);
                        osc.stop(now + idx * 0.08 + 0.35);
                    });
                } else {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(160, now);
                    osc.frequency.setValueAtTime(120, now + 0.14);
                    gain.gain.setValueAtTime(0.12, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.3);
                }
            } catch (e) {}
        }

        function toggleSound() {
            soundEnabled = !soundEnabled;
            const btn = document.getElementById('sound-btn');
            if (btn) {
                btn.innerHTML = soundEnabled ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark" style="color:#ef4444;"></i>';
            }
        }

        // Slayt Değiştirme
        function showSlide(n) {
            if (n < 1) n = 1;
            if (n > totalSlides) n = totalSlides;
            currentSlide = n;

            document.querySelectorAll('.slide-container').forEach(s => s.classList.remove('active'));
            const target = document.getElementById('slide-' + n);
            if (target) {
                target.classList.add('active');
                playWhoosh();
            }

            const badge = document.getElementById('slide-counter-badge');
            if (badge) badge.innerText = `${n} / ${totalSlides}`;

            const progress = document.getElementById('slide-progress-bar');
            if (progress) progress.style.width = `${(n / totalSlides) * 100}%`;

            // Çekmecede aktif slaytı işaretle
            document.querySelectorAll('.drawer-card').forEach((card, idx) => {
                card.classList.toggle('current', idx + 1 === n);
            });
        }

        function nextSlide() {
            if (currentSlide < totalSlides) showSlide(currentSlide + 1);
        }

        function prevSlide() {
            if (currentSlide > 1) showSlide(currentSlide - 1);
        }

        function toggleFullscreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {});
            } else {
                if (document.exitFullscreen) document.exitFullscreen();
            }
        }

        function toggleDrawer() {
            const drawer = document.getElementById('drawer-modal');
            if (drawer) {
                drawer.classList.toggle('open');
            }
        }

        // Test Cevaplama Fonksiyonu
        function answerQuiz(el, isCorrect, explanation) {
            if (el.classList.contains('answered')) return;
            el.classList.add('answered');

            playChime(isCorrect);

            if (isCorrect) {
                el.classList.add('correct');
            } else {
                el.classList.add('wrong');
            }

            const feedbackBox = el.querySelector('.quiz-feedback');
            if (feedbackBox) {
                feedbackBox.innerHTML = `
                    <div style="display: flex; align-items: flex-start; gap: 10px;">
                        <i class="fa-solid ${isCorrect ? 'fa-circle-check text-green-400' : 'fa-circle-xmark text-red-400'}" style="margin-top: 4px; font-size: 22px;"></i>
                        <div>
                            <strong>${isCorrect ? 'DOĞRU!' : 'DİKKAT!'}</strong> ${explanation}
                        </div>
                    </div>
                `;
                feedbackBox.className = `quiz-feedback show ${isCorrect ? 'fb-correct' : 'fb-wrong'}`;
            }
        }

        // Klavye Kontrolleri
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
                e.preventDefault();
                nextSlide();
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                e.preventDefault();
                prevSlide();
            } else if (e.key === 'f' || e.key === 'F') {
                toggleFullscreen();
            } else if (e.key === 'm' || e.key === 'M' || e.key === 'd' || e.key === 'D') {
                toggleDrawer();
            } else if (e.key === 'Escape') {
                const drawer = document.getElementById('drawer-modal');
                if (drawer && drawer.classList.contains('open')) {
                    drawer.classList.remove('open');
                }
            }
        });

        // Akıllı Tahta Dokunmatik Kaydırma (Swipe)
        let touchStartX = 0;
        let touchStartY = 0;
        window.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, {passive: true});

        window.addEventListener('touchend', (e) => {
            const diffX = e.changedTouches[0].screenX - touchStartX;
            const diffY = e.changedTouches[0].screenY - touchStartY;
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 60) {
                if (diffX < 0) nextSlide();
                else prevSlide();
            }
        }, {passive: true});

        // Kozmik Yıldızlar Animasyonu
        function initStars() {
            const canvas = document.getElementById('stars-canvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            let w = canvas.width = 1920;
            let h = canvas.height = 1080;
            const stars = Array.from({length: 180}, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 1.8 + 0.4,
                alpha: Math.random() * 0.8 + 0.2,
                speed: Math.random() * 0.02 + 0.005
            }));
            function draw() {
                ctx.clearRect(0, 0, w, h);
                for (let s of stars) {
                    s.alpha += s.speed;
                    if (s.alpha > 1 || s.alpha < 0.2) s.speed = -s.speed;
                    ctx.beginPath();
                    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, s.alpha)})`;
                    ctx.fill();
                }
                requestAnimationFrame(draw);
            }
            draw();
        }
    </script>
</body>
</html>
"""

# Slayt HTML parçalarını ve Çekmece kartlarını oluştur
slides_html = ""
drawer_items_html = ""

for s in slides:
    slides_html += f"""
    <!-- SLAYT {s['num']} -->
    <div class="slide-container {'active' if s['num'] == 1 else ''}" id="slide-{s['num']}">
        <div class="slide-header">
            <span class="slide-kicker"><i class="fa-solid fa-atom"></i> {s['kicker']}</span>
            <h2 class="slide-title">{s['title']}</h2>
            <div class="slide-subtitle">{s['subtitle']}</div>
        </div>
        {s['html']}
    </div>
    """
    drawer_items_html += f"""
    <div class="drawer-card {'current' if s['num'] == 1 else ''}" onclick="showSlide({s['num']}); toggleDrawer();">
        <span class="drawer-num">SLAYT {s['num']:02d}</span>
        <div class="drawer-title">{s['title']}</div>
        <div class="drawer-kicker">{s['kicker']}</div>
    </div>
    """

full_content = html_template.replace("__SLIDES_PLACEHOLDER__", slides_html).replace("__DRAWER_PLACEHOLDER__", drawer_items_html)

output_path = os.path.join("sunumlar", "5-sinif-1-unite-gunes-dunya-ay.html")
os.makedirs("sunumlar", exist_ok=True)
with open(output_path, "w", encoding="utf-8") as f:
    f.write(full_content)

print(f"Presentation generated successfully at: {output_path} ({len(slides)} slides)")

