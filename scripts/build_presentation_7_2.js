const fs = require('fs');
const path = require('path');

const BASE_DIR = 'c:/Users/my pc/Desktop/Antgravity Rotalı Fenci';

// 48 Slaytın Her Biri İçin Zengin İçerik Veritabanı
const slides = [
  // 1. KAPAK
  {
    num: 1,
    kicker: "7. SINIF FEN BİLİMLERİ • 2. ÜNİTE",
    title: "KUVVET VE ENERJİYİ KEŞFEDELİM",
    subtitle: "Türkiye Yüzyılı Maarif Modeli • Akıllı Tahta Sinematik Sunumu (16:9)",
    html: `
      <div class="slide-body grid-2-col" style="align-items: center;">
        <div class="col-text">
          <div class="badge-tag"><i class="fa-solid fa-atom"></i> TÜRKİYE YÜZYILI MAARİF MODELİ (2026–2027)</div>
          <h1 class="hero-title">KUVVET VE ENERJİYİ<br><span class="accent-text">KEŞFEDELİM</span></h1>
          <p class="hero-desc">Fiziksel Anlamda İş • Kinetik Enerji • Çekim & Esneklik Potansiyeli • Enerji Dönüşümleri ve Korunumu</p>
          <div class="hero-features">
            <span class="feat-pill"><i class="fa-solid fa-check"></i> 20+ Günlük Yaşam Örneği</span>
            <span class="feat-pill"><i class="fa-solid fa-check"></i> Çözümlü İş Problemleri</span>
            <span class="feat-pill"><i class="fa-solid fa-check"></i> İnteraktif Soru-Cevap</span>
          </div>
          <div class="hero-buttons">
            <button onclick="nextSlide()" class="btn-hero-primary"><i class="fa-solid fa-play"></i> Keşfe Başla</button>
            <button onclick="toggleDrawer()" class="btn-hero-secondary"><i class="fa-solid fa-list-ol"></i> Slayt İndeksi (48 Slayt)</button>
          </div>
        </div>
        <div class="col-visual flex-center">
          <div class="cover-card-container">
            <div class="cover-card">
              <div class="cover-icon-circle"><i class="fa-solid fa-bolt-lightning"></i></div>
              <h3>KUVVET • İŞ • ENERJİ</h3>
              <p>Maddenin hareketinden gökyüzündeki hız trenine enerjinin akıl almaz yolculuğu!</p>
              <div class="cover-badge">ROTALI FENCİ FARKIYLA</div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  // 2. ÖĞRENME ROTAMIZ
  {
    num: 2,
    kicker: "ÜNİTE HARİTASI",
    title: "Öğrenme Rotamız ve 3 Büyük İstasyon",
    subtitle: "Bu ünitede neleri keşfedeceğiz?",
    html: `
      <div class="slide-body grid-3-cards">
        <div class="info-card border-blue">
          <div class="card-num">01</div>
          <div class="card-icon"><i class="fa-solid fa-person-running"></i></div>
          <h3>Fiziksel Anlamda İş</h3>
          <p>Kuvvet her zaman iş yapar mı? Günlük hayattaki iş ile fizikteki işin farkı nedir? <strong>W = F · x</strong> bağıntısı ve 20 günlük yaşam örneği.</p>
        </div>
        <div class="info-card border-emerald">
          <div class="card-num">02</div>
          <div class="card-icon"><i class="fa-solid fa-gauge-high"></i></div>
          <h3>Enerji Çeşitleri</h3>
          <p>Hareketin gücü <strong>Kinetik Enerji</strong> ve konumun gizli gücü <strong>Potansiyel Enerji</strong> (Çekim ve Esneklik). Kütle, sürat ve yükseklik ilişkisi.</p>
        </div>
        <div class="info-card border-purple">
          <div class="card-num">03</div>
          <div class="card-icon"><i class="fa-solid fa-arrows-spin"></i></div>
          <h3>Enerji Dönüşümleri</h3>
          <p>Enerji asla yok olmaz! Lunapark hız treninde, salıncakta, yukarı atılan topta enerji nasıl el değiştirir? Sürtünme ve ısıl enerji.</p>
        </div>
      </div>
      <div class="bottom-callout"><i class="fa-solid fa-lightbulb"></i> <strong>DÜŞÜN - TARTIŞ:</strong> Hangi konuyla ilgili daha önce günlük yaşamda bir gözlem yaptın?</div>
    `
  },

  // 3. GÜNLÜK HAYATIN PARADOKSU
  {
    num: 3,
    kicker: "KUVVET VE İŞ • MERAK KÖPRÜSÜ",
    title: "Çok Yoruldum Ama Fiziksel İş Yaptım mı?",
    subtitle: "Günlük dildeki 'iş' ile fizik bilimindeki 'iş' arasındaki kritik fark",
    html: `
      <div class="slide-body grid-2-col">
        <div class="compare-card success-card">
          <div class="compare-badge bg-green">İŞ VAR ✅</div>
          <div class="visual-box">
            <svg viewBox="0 0 400 200" class="schema-svg">
              <rect x="20" y="140" width="360" height="8" fill="#94a3b8"/>
              <rect x="60" y="80" width="70" height="60" rx="6" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>
              <text x="95" y="115" text-anchor="middle" font-weight="900" fill="#fff" font-size="14">KOLİ</text>
              <!-- Kuvvet Oku -->
              <line x1="130" y1="110" x2="220" y2="110" stroke="#ef4444" stroke-width="4" marker-end="url(#arrow-red)"/>
              <text x="175" y="100" fill="#ef4444" font-weight="bold" font-size="13">Kuvvet (F) →</text>
              <!-- Yer Değiştirme Oku -->
              <line x1="60" y1="165" x2="240" y2="165" stroke="#10b981" stroke-width="4" stroke-dasharray="6,4" marker-end="url(#arrow-green)"/>
              <text x="150" y="185" fill="#10b981" font-weight="bold" font-size="13">Yer Değiştirme (x) →</text>
            </svg>
          </div>
          <h4>Koli İlerliyor</h4>
          <p>Koliye kuvvet uygulandı ve koli <strong>kuvvet doğrultusunda hareket etti</strong>. Bu durumda fiziksel anlamda iş yapılmıştır.</p>
        </div>

        <div class="compare-card danger-card">
          <div class="compare-badge bg-red">İŞ YOK ❌</div>
          <div class="visual-box">
            <svg viewBox="0 0 400 200" class="schema-svg">
              <rect x="20" y="140" width="360" height="8" fill="#94a3b8"/>
              <!-- Duvar -->
              <rect x="280" y="40" width="40" height="100" fill="#64748b" stroke="#334155" stroke-width="2"/>
              <!-- Kuvvet Oku -->
              <line x1="140" y1="90" x2="270" y2="90" stroke="#ef4444" stroke-width="4" marker-end="url(#arrow-red)"/>
              <text x="205" y="80" fill="#ef4444" font-weight="bold" font-size="13">Kuvvet (F) →</text>
              <text x="200" y="165" fill="#64748b" font-weight="bold" font-size="14">Yer Değiştirme: x = 0 m</text>
            </svg>
          </div>
          <h4>Duvar Sabit Duruyor</h4>
          <p>Öğrenci ter içinde kalıp yorulsa bile duvar <strong>yer değiştirmediği için</strong> uygulanan kuvvet fiziksel iş yapmamıştır!</p>
        </div>
      </div>
      <div class="bottom-callout"><i class="fa-solid fa-triangle-exclamation"></i> <strong>ÖNEMLİ KURAL:</strong> Yorulmak fizikte iş yapıldığını göstermez! Biyolojik enerji harcamak ile fiziksel iş birbirine karıştırılmamalıdır.</div>
    `
  },

  // 4. KUVVET BİZE NEYİ HATIRLATIR?
  {
    num: 4,
    kicker: "KUVVET VE İŞ • ÖN BİLGİ",
    title: "Kuvvet Bize Neyi Hatırlatır?",
    subtitle: "Duran cisimleri harekete geçiren, hareketlileri durduran veya yönünü değiştiren etki",
    html: `
      <div class="slide-body grid-4-cards">
        <div class="card-item">
          <div class="icon-bubble bg-blue"><i class="fa-solid fa-car-side"></i></div>
          <h4>Harekete Geçirme</h4>
          <p>Duran bir oyuncak arabayı iterek ileriye doğru hareket ettirmek.</p>
        </div>
        <div class="card-item">
          <div class="icon-bubble bg-amber"><i class="fa-solid fa-hand"></i></div>
          <h4>Yavaşlatma & Durdurma</h4>
          <p>Hareket eden bisiklette frene basarak tekerleği durdurmak.</p>
        </div>
        <div class="card-item">
          <div class="icon-bubble bg-emerald"><i class="fa-solid fa-futbol"></i></div>
          <h4>Yön Değiştirme</h4>
          <p>Gelen voleybol topuna smaç basarak topun yönünü tersine çevirmek.</p>
        </div>
        <div class="card-item">
          <div class="icon-bubble bg-purple"><i class="fa-solid fa-cookie"></i></div>
          <h4>Şekil Değiştirme</h4>
          <p>Oyun hamurunu veya süngeri iki elin arasında sıkıp şeklini bozmak.</p>
        </div>
      </div>
      <div class="bottom-callout"><i class="fa-solid fa-arrow-right"></i> <strong>BAĞLANTI:</strong> Kuvvet tek başına yeterli değildir; fiziksel iş için cismi kendi doğrultusunda yürütmelidir!</div>
    `
  },

  // 5. FİZİKSEL ANLAMDA İŞİN 2 ALTIN KURALI
  {
    num: 5,
    kicker: "KUVVET VE İŞ • BİLİMSEL TANIM",
    title: "Fiziksel Anlamda İşin 2 Altın Kuralı",
    subtitle: "Bir kuvvetin fiziksel anlamda iş yapabilmesi için iki şart AYNI ANDA sağlanmalıdır",
    html: `
      <div class="slide-body grid-2-col">
        <div class="rule-card rule-1">
          <div class="rule-header">
            <span class="rule-num">1</span>
            <h3>Kuvvet Uygulanmalı</h3>
          </div>
          <div class="rule-content">
            <p>Cisme sıfırdan farklı net bir kuvvet ($\vec{F}$) etki etmelidir.</p>
            <div class="rule-badge">Kuvvet: F &gt; 0 Newton</div>
          </div>
        </div>

        <div class="rule-card rule-2">
          <div class="rule-header">
            <span class="rule-num">2</span>
            <h3>Kuvvet Doğrultusunda Yer Değiştirmeli</h3>
          </div>
          <div class="rule-content">
            <p>Cisim, uygulanan <strong>kuvvetle aynı doğrultuda</strong> yol ($\Delta x$) almalıdır.</p>
            <div class="rule-badge">Yer Değiştirme: x &gt; 0 Metre</div>
          </div>
        </div>
      </div>
      <div class="formula-banner">
        <span>İŞ OLUŞMASI İÇİN:</span>
        <span class="formula-pill">KUVVET OLMALI + AYNI DOĞRULTUDA YOL ALINMALI</span>
      </div>
    `
  },

  // 6. KUTU İLERLİYOR: İŞ VAR
  {
    num: 6,
    kicker: "DURUM ANALİZİ 1",
    title: "Kutu İleri Gidiyor: İŞ VAR!",
    subtitle: "Uygulanan kuvvet ile yer değiştirme aynı doğrultuda olduğunda iş yapılır",
    html: `
      <div class="slide-body grid-2-col" style="align-items: center;">
        <div class="visual-card">
          <svg viewBox="0 0 440 220" class="schema-svg">
            <defs>
              <marker id="arr-f" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
              </marker>
              <marker id="arr-x" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
              </marker>
            </defs>
            <rect x="20" y="160" width="400" height="6" fill="#cbd5e1"/>
            <!-- Koli -->
            <rect x="70" y="90" width="90" height="70" rx="8" fill="#fed7aa" stroke="#f97316" stroke-width="2.5"/>
            <text x="115" y="130" text-anchor="middle" font-weight="900" fill="#9a3412" font-size="16">KOLİ</text>
            <!-- F Oku -->
            <line x1="160" y1="125" x2="280" y2="125" stroke="#ef4444" stroke-width="4.5" marker-end="url(#arr-f)"/>
            <text x="220" y="112" fill="#ef4444" font-weight="900" font-size="15">Kuvvet (F = 30 N) →</text>
            <!-- Yol Oku -->
            <line x1="70" y1="185" x2="310" y2="185" stroke="#10b981" stroke-width="4" stroke-dasharray="8,4" marker-end="url(#arr-x)"/>
            <text x="190" y="206" fill="#047857" font-weight="bold" font-size="14">Yer Değiştirme: x = 5 m (Sağa) →</text>
          </svg>
        </div>
        <div class="analysis-card">
          <div class="badge-status success"><i class="fa-solid fa-circle-check"></i> FİZİKSEL ANLAMDA İŞ VARDIR</div>
          <ul class="analysis-list">
            <li><strong>Kuvvet Yönü:</strong> Yatayda sağa doğru.</li>
            <li><strong>Hareket Yönü:</strong> Yatayda sağa doğru.</li>
            <li><strong>Doğrultu İlişkisi:</strong> Kuvvet ile yer değiştirme <strong>aynı doğrultudadır</strong> ($0^\circ$).</li>
            <li><strong>Hesaplama:</strong> $W = 30\text{ N} \times 5\text{ m} = 150\text{ Joule}$ iş yapılmıştır.</li>
          </ul>
        </div>
      </div>
    `
  },

  // 7. DUVAR SABİT: İŞ YOK
  {
    num: 7,
    kicker: "DURUM ANALİZİ 2",
    title: "Duvar Hareket Etmiyor: İŞ YOK!",
    subtitle: "Kuvvet ne kadar büyük olursa olsun yer değiştirme sıfırsa iş sıfırdır",
    html: `
      <div class="slide-body grid-2-col" style="align-items: center;">
        <div class="visual-card">
          <svg viewBox="0 0 440 220" class="schema-svg">
            <rect x="20" y="160" width="400" height="6" fill="#cbd5e1"/>
            <!-- Sabit Duvar -->
            <rect x="300" y="40" width="45" height="120" fill="#94a3b8" stroke="#475569" stroke-width="2"/>
            <line x1="300" y1="70" x2="345" y2="70" stroke="#475569" stroke-width="1.5"/>
            <line x1="300" y1="100" x2="345" y2="100" stroke="#475569" stroke-width="1.5"/>
            <line x1="300" y1="130" x2="345" y2="130" stroke="#475569" stroke-width="1.5"/>
            <text x="322" y="30" text-anchor="middle" font-weight="bold" fill="#334155" font-size="13">DUVAR</text>
            <!-- F Oku -->
            <line x1="150" y1="100" x2="295" y2="100" stroke="#ef4444" stroke-width="5" marker-end="url(#arr-f)"/>
            <text x="215" y="85" fill="#ef4444" font-weight="900" font-size="15">Kuvvet (F = 200 N) →</text>
            <!-- x = 0 -->
            <text x="220" y="190" fill="#dc2626" font-weight="900" font-size="16">Yer Değiştirme (x) = 0 m</text>
          </svg>
        </div>
        <div class="analysis-card">
          <div class="badge-status danger"><i class="fa-solid fa-circle-xmark"></i> FİZİKSEL ANLAMDA İŞ YOKTUR (W = 0)</div>
          <ul class="analysis-list">
            <li><strong>Uygulanan Kuvvet:</strong> $200\text{ Newton}$ (Çok büyük).</li>
            <li><strong>Yer Değiştirme:</strong> $0\text{ Metre}$ (Duvar kımıldamadı).</li>
            <li><strong>Hesaplama:</strong> $W = F \times x = 200\text{ N} \times 0\text{ m} = \mathbf{0\text{ Joule}}$.</li>
            <li><strong>Bilimsel Yorum:</strong> Cisim yer değiştirmediği sürece uygulanan kuvvet iş yapmış sayılmaz.</li>
          </ul>
        </div>
      </div>
    `
  },

  // 8. EN BÜYÜK TUZAK: ÇANTAYI KALDIRMAK VS. TAŞIMAK
  {
    num: 8,
    kicker: "SINAVLARIN EN ÇOK SORULAN TUZAĞI",
    title: "Çantayı Masaya Kaldırmak vs. Düz Yolda Taşımak",
    subtitle: "Kuvvet ile hareket birbirine dik olduğunda taşıma kuvveti iş yapmaz!",
    html: `
      <div class="slide-body grid-2-col">
        <div class="compare-box box-success">
          <div class="tag-header green">DURUM A: YUKARI KALDIRMA</div>
          <div class="schema-mini">
            <svg viewBox="0 0 300 160">
              <rect x="110" y="70" width="80" height="60" rx="6" fill="#bae6fd" stroke="#0284c7" stroke-width="2"/>
              <text x="150" y="105" text-anchor="middle" font-weight="bold" fill="#0369a1">ÇANTA</text>
              <line x1="150" y1="70" x2="150" y2="15" stroke="#ef4444" stroke-width="4" marker-end="url(#arr-f)"/>
              <text x="160" y="40" fill="#ef4444" font-weight="bold">F ↑ (Yukarı)</text>
              <line x1="85" y1="130" x2="85" y2="30" stroke="#10b981" stroke-width="3" stroke-dasharray="4,3" marker-end="url(#arr-x)"/>
              <text x="50" y="85" fill="#10b981" font-weight="bold">x ↑</text>
            </svg>
          </div>
          <h4>Fiziksel İş: VAR ✅</h4>
          <p>Kuvvet yukarı doğrudur ve çanta yukarı doğru yükselmektedir. Kuvvet ve hareket <strong>aynı doğrultuda</strong> olduğu için yer çekimine karşı iş yapılır.</p>
        </div>

        <div class="compare-box box-danger">
          <div class="tag-header red">DURUM B: DÜZ YOLDA TAŞIMA</div>
          <div class="schema-mini">
            <svg viewBox="0 0 300 160">
              <rect x="100" y="70" width="80" height="60" rx="6" fill="#fecdd3" stroke="#e11d48" stroke-width="2"/>
              <text x="140" y="105" text-anchor="middle" font-weight="bold" fill="#9f1239">ÇANTA</text>
              <line x1="140" y1="70" x2="140" y2="15" stroke="#ef4444" stroke-width="4" marker-end="url(#arr-f)"/>
              <text x="150" y="40" fill="#ef4444" font-weight="bold">F ↑ (Yukarı)</text>
              <line x1="100" y1="145" x2="230" y2="145" stroke="#10b981" stroke-width="3" stroke-dasharray="4,3" marker-end="url(#arr-x)"/>
              <text x="165" y="140" fill="#10b981" font-weight="bold">x → (Yatay)</text>
              <text x="155" y="65" fill="#000" font-weight="900" font-size="16">⟂ 90°</text>
            </svg>
          </div>
          <h4>Fiziksel İş: YOK ❌</h4>
          <p>Çantayı tutan kuvvet <strong>yukarı</strong>, hareket ise <strong>yataydadır</strong>. Kuvvet ile hareket birbirine dik ($90^\circ$) olduğu için taşıma kuvveti iş yapmaz!</p>
        </div>
      </div>
      <div class="bottom-callout"><i class="fa-solid fa-star"></i> <strong>PÜF NOKTASI:</strong> Öğrenci merdiven çıkarken hem dikey hem yatay yol alır; bu durumda dikeyde yükseldiği için taşıma kuvveti iş yapmış olur!</div>
    `
  },

  // 9. 20 GÜNLÜK YAŞAM OLAYI (1-10)
  {
    num: 9,
    kicker: "GÜNLÜK YAŞAM DEDEKTİFİ • BÖLÜM 1",
    title: "Günlük Yaşamda İş Var mı, Yok mu? (1 – 10)",
    subtitle: "Her olayı kuvvetin ve hareketin doğrultusuna göre sınıflandırıyoruz",
    html: `
      <div class="slide-body">
        <table class="life-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Günlük Yaşam Olayı</th>
              <th>Kuvvet Yönü</th>
              <th>Hareket Yönü</th>
              <th>Fiziksel İş?</th>
              <th>Gerekçe</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>Market arabasını ileriye itmek</td><td>Yatay →</td><td>Yatay →</td><td><span class="pill-yes">İŞ VAR ✅</span></td><td>Kuvvet ile yer değiştirme aynı yönde</td></tr>
            <tr><td>2</td><td>Halteri yerden yukarı kaldırmak</td><td>Dikey ↑</td><td>Dikey ↑</td><td><span class="pill-yes">İŞ VAR ✅</span></td><td>Yer çekimine karşı yukarı kaldırıldı</td></tr>
            <tr><td>3</td><td>Halteri havada hareketsiz tutmak</td><td>Dikey ↑</td><td>Hareketsiz</td><td><span class="pill-no">İŞ YOK ❌</span></td><td>Yer değiştirme sıfırdır (x = 0)</td></tr>
            <tr><td>4</td><td>Ağır dolabı itip kımıldatamamak</td><td>Yatay →</td><td>Hareketsiz</td><td><span class="pill-no">İŞ YOK ❌</span></td><td>Yer değiştirme sıfırdır</td></tr>
            <tr><td>5</td><td>Çekmeceyi çekip açmak</td><td>Yatay ←</td><td>Yatay ←</td><td><span class="pill-yes">İŞ VAR ✅</span></td><td>Çekme kuvveti doğrultusunda hareket</td></tr>
            <tr><td>6</td><td>Sırt çantasıyla düz koridorda yürümek</td><td>Dikey ↑</td><td>Yatay →</td><td><span class="pill-no">İŞ YOK ❌</span></td><td>Kuvvet harekete diktir (90°)</td></tr>
            <tr><td>7</td><td>Sırt çantasıyla merdiven çıkmak</td><td>Dikey ↑</td><td>Dikey ↑</td><td><span class="pill-yes">İŞ VAR ✅</span></td><td>Yukarı doğru yer değiştirme vardır</td></tr>
            <tr><td>8</td><td>Futbol topuna sertçe vurmak</td><td>Yatay →</td><td>Yatay →</td><td><span class="pill-yes">İŞ VAR ✅</span></td><td>Ayak topa kuvvet verip öteledi</td></tr>
            <tr><td>9</td><td>Kitabı masadan kitaplığa kaldırmak</td><td>Dikey ↑</td><td>Dikey ↑</td><td><span class="pill-yes">İŞ VAR ✅</span></td><td>Yer çekimine karşı iş yapıldı</td></tr>
            <tr><td>10</td><td>Büyük masayı iterek odada kaydırmak</td><td>Yatay →</td><td>Yatay →</td><td><span class="pill-yes">İŞ VAR ✅</span></td><td>Kuvvet yönünde yer değiştirme gerçekleşti</td></tr>
          </tbody>
        </table>
      </div>
    `
  },

  // 10. 20 GÜNLÜK YAŞAM OLAYI (11-20)
  {
    num: 10,
    kicker: "GÜNLÜK YAŞAM DEDEKTİFİ • BÖLÜM 2",
    title: "Günlük Yaşamda İş Var mı, Yok mu? (11 – 20)",
    subtitle: "Her olayı kuvvetin ve hareketin doğrultusuna göre sınıflandırıyoruz",
    html: `
      <div class="slide-body">
        <table class="life-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Günlük Yaşam Olayı</th>
              <th>Kuvvet Yönü</th>
              <th>Hareket Yönü</th>
              <th>Fiziksel İş?</th>
              <th>Gerekçe</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>11</td><td>Tepsiyi düz yolda taşıyan garson</td><td>Dikey ↑</td><td>Yatay →</td><td><span class="pill-no">İŞ YOK ❌</span></td><td>Taşıma kuvveti yatay yola diktir</td></tr>
            <tr><td>12</td><td>Ağaçtan elmanın yere düşmesi</td><td>Dikey ↓</td><td>Dikey ↓</td><td><span class="pill-yes">İŞ VAR ✅</span></td><td>Yer çekimi kuvveti iş yapmıştır</td></tr>
            <tr><td>13</td><td>Tekerlekli valizi çekerek yürümek</td><td>Çekme açısı</td><td>Yatay →</td><td><span class="pill-yes">İŞ VAR ✅</span></td><td>Kuvvetin yatay bileşeni iş yapar</td></tr>
            <tr><td>14</td><td>Karda kızağı çekerek götürmek</td><td>Çekme →</td><td>Yatay →</td><td><span class="pill-yes">İŞ VAR ✅</span></td><td>Kızak çekme doğrultusunda ilerler</td></tr>
            <tr><td>15</td><td>Ders kitabının sayfasını çevirmek</td><td>Çevirme yönü</td><td>Çevirme yönü</td><td><span class="pill-yes">İŞ VAR ✅</span></td><td>Sayfaya kuvvet uygulanıp yer değiştirildi</td></tr>
            <tr><td>16</td><td>Dalda hareketsiz duran armut</td><td>Dikey ↓ (Ağırlık)</td><td>Hareketsiz</td><td><span class="pill-no">İŞ YOK ❌</span></td><td>Yer değiştirme gerçekleşmedi</td></tr>
            <tr><td>17</td><td>Yay gerilerek okun geriye çekilmesi</td><td>Çekme ←</td><td>Çekme ←</td><td><span class="pill-yes">İŞ VAR ✅</span></td><td>Yayın esnekliğine karşı iş yapıldı</td></tr>
            <tr><td>18</td><td>Uydunun Dünya çevresinde dönmesi</td><td>Merkeze doğru</td><td>Teğet →</td><td><span class="pill-no">İŞ YOK ❌</span></td><td>Kuvvet yörünge hareketine diktir</td></tr>
            <tr><td>19</td><td>Odanın penceresini itip kapatmak</td><td>İtme →</td><td>İtme →</td><td><span class="pill-yes">İŞ VAR ✅</span></td><td>Pencere kanadı kuvvet yönünde kapandı</td></tr>
            <tr><td>20</td><td>Frene basan otomobilin durması</td><td>Sürtünme ←</td><td>İleri →</td><td><span class="pill-yes">İŞ VAR ✅</span></td><td>Sürtünme kuvveti negatif iş yapar (Isı üretir)</td></tr>
          </tbody>
        </table>
      </div>
    `
  },

  // 11. YAPILAN İŞ NEYE BAĞLIDIR?
  {
    num: 11,
    kicker: "KUVVET VE İŞ • HESAPLAMA",
    title: "Yapılan İş Neye Bağlıdır? Formül ve Birimler",
    subtitle: "İş = Kuvvet × Yer Değiştirme (W = F · x)",
    html: `
      <div class="slide-body grid-2-col" style="align-items: center;">
        <div class="formula-card">
          <div class="formula-title">FİZİKSEL İŞ BAĞINTISI</div>
          <div class="formula-main">W = F · x</div>
          <div class="unit-breakdown">
            <div class="unit-item">
              <span class="u-sym">W</span>
              <span class="u-name">Yapılan İş</span>
              <span class="u-unit">JOULE (J)</span>
            </div>
            <span class="math-op">=</span>
            <div class="unit-item">
              <span class="u-sym">F</span>
              <span class="u-name">Uygulanan Kuvvet</span>
              <span class="u-unit">NEWTON (N)</span>
            </div>
            <span class="math-op">×</span>
            <div class="unit-item">
              <span class="u-sym">x</span>
              <span class="u-name">Yer Değiştirme</span>
              <span class="u-unit">METRE (m)</span>
            </div>
          </div>
        </div>

        <div class="concept-card">
          <h4>İşin 2 Temel Bağımlılığı:</h4>
          <div class="dep-box">
            <i class="fa-solid fa-weight-hanging text-red"></i>
            <div>
              <strong>1. Kuvvetin Büyüklüğüne Doğru Orantılıdır:</strong>
              <p>Alınan yol aynıyken kuvvet arttıkça yapılan iş artar.</p>
            </div>
          </div>
          <div class="dep-box">
            <i class="fa-solid fa-arrows-left-right text-green"></i>
            <div>
              <strong>2. Yer Değiştirmenin Büyüklüğüne Doğru Orantılıdır:</strong>
              <p>Kuvvet aynıyken cisim ne kadar uzağa taşınırsa yapılan iş o kadar artar.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom-callout"><i class="fa-solid fa-award"></i> <strong>BİRİM BİLGİSİ:</strong> James Prescott Joule'ün anısına iş ve enerji birimi <strong>Joule (J)</strong> kabul edilmiştir. $1\text{ Joule} = 1\text{ Newton} \times 1\text{ Metre}$'dir.</div>
    `
  },

  // 12. DENEY 1: KUVVET ARTARSA?
  {
    num: 12,
    kicker: "KONTROLLÜ DENEY 1",
    title: "Yol Sabitken Kuvvet Artarsa Ne Olur?",
    subtitle: "Bağımsız Değişken: Kuvvet • Sabit Tutulan: Yer Değiştirme (3 m)",
    html: `
      <div class="slide-body grid-2-col">
        <div class="exp-card border-blue">
          <div class="exp-header">
            <h4>ÖĞRENCİ 1: AYŞE</h4>
            <span class="badge-exp">F = 10 N</span>
          </div>
          <div class="exp-diagram">
            <svg viewBox="0 0 320 120">
              <rect x="20" y="80" width="280" height="4" fill="#94a3b8"/>
              <rect x="40" y="40" width="50" height="40" rx="4" fill="#93c5fd" stroke="#2563eb" stroke-width="2"/>
              <line x1="90" y1="60" x2="160" y2="60" stroke="#ef4444" stroke-width="3" marker-end="url(#arr-f)"/>
              <text x="125" y="50" fill="#ef4444" font-size="12" font-weight="bold">10 N</text>
              <line x1="40" y1="95" x2="220" y2="95" stroke="#10b981" stroke-width="2.5" stroke-dasharray="4,3" marker-end="url(#arr-x)"/>
              <text x="130" y="112" fill="#047857" font-size="12">x = 3 m</text>
            </svg>
          </div>
          <div class="calc-box">
            $$W = 10\text{ N} \times 3\text{ m} = \mathbf{30\text{ Joule}}$$
          </div>
        </div>

        <div class="exp-card border-purple">
          <div class="exp-header">
            <h4>ÖĞRENCİ 2: MEHMET (2 Kat Kuvvet)</h4>
            <span class="badge-exp">F = 20 N</span>
          </div>
          <div class="exp-diagram">
            <svg viewBox="0 0 320 120">
              <rect x="20" y="80" width="280" height="4" fill="#94a3b8"/>
              <rect x="40" y="40" width="50" height="40" rx="4" fill="#c084fc" stroke="#7e22ce" stroke-width="2"/>
              <line x1="90" y1="60" x2="210" y2="60" stroke="#ef4444" stroke-width="4.5" marker-end="url(#arr-f)"/>
              <text x="150" y="50" fill="#ef4444" font-size="12" font-weight="bold">20 N</text>
              <line x1="40" y1="95" x2="220" y2="95" stroke="#10b981" stroke-width="2.5" stroke-dasharray="4,3" marker-end="url(#arr-x)"/>
              <text x="130" y="112" fill="#047857" font-size="12">x = 3 m</text>
            </svg>
          </div>
          <div class="calc-box">
            $$W = 20\text{ N} \times 3\text{ m} = \mathbf{60\text{ Joule}}$$
          </div>
        </div>
      </div>
      <div class="bottom-callout"><i class="fa-solid fa-check-double"></i> <strong>BİLİMSEL SONUÇ:</strong> Alınan yol eşitken uygulanan kuvvet 2 katına çıktığında, yapılan iş de tam 2 katına ($30\text{ J} \rightarrow 60\text{ J}$) çıkar!</div>
    `
  },

  // 13. DENEY 2: YOL ARTARSA?
  {
    num: 13,
    kicker: "KONTROLLÜ DENEY 2",
    title: "Kuvvet Sabitken Yol Artarsa Ne Olur?",
    subtitle: "Bağımsız Değişken: Yer Değiştirme • Sabit Tutulan: Kuvvet (10 N)",
    html: `
      <div class="slide-body grid-2-col">
        <div class="exp-card border-blue">
          <div class="exp-header">
            <h4>ÖĞRENCİ 1: ALİ (Kısa Mesafe)</h4>
            <span class="badge-exp">x = 2 m</span>
          </div>
          <div class="calc-box">
            $$W = 10\text{ N} \times 2\text{ m} = \mathbf{20\text{ Joule}}$$
          </div>
          <p style="margin-top:10px; font-size:14px; color:#475569;">10 Newtonluk kuvvet ile koli 2 metre itildi.</p>
        </div>

        <div class="exp-card border-purple">
          <div class="exp-header">
            <h4>ÖĞRENCİ 2: ZEYNEP (3 Kat Mesafe)</h4>
            <span class="badge-exp">x = 6 m</span>
          </div>
          <div class="calc-box">
            $$W = 10\text{ N} \times 6\text{ m} = \mathbf{60\text{ Joule}}$$
          </div>
          <p style="margin-top:10px; font-size:14px; color:#475569;">10 Newtonluk aynı kuvvet ile koli tam 6 metre itildi.</p>
        </div>
      </div>
      <div class="bottom-callout"><i class="fa-solid fa-check-double"></i> <strong>BİLİMSEL SONUÇ:</strong> Kuvvet eşit tutulduğunda yol 3 katına ($2\text{ m} \rightarrow 6\text{ m}$) çıktığında yapılan iş de tam 3 katına ($20\text{ J} \rightarrow 60\text{ J}$) çıkar!</div>
    `
  },

  // 14. ADIM ADIM PROBLEM 1
  {
    num: 14,
    kicker: "ÖRNEK PROBLEM ÇÖZÜMÜ",
    title: "Adım Adım Problem Çözümü: Raf Problemi",
    subtitle: "Soruyu okuma, verilenleri yazma ve formülü hatasız uygulama aşamaları",
    html: `
      <div class="slide-body grid-2-col">
        <div class="problem-text-card">
          <div class="prob-badge">SORU METNİ</div>
          <p class="prob-desc">Bir süpermarket çalışanı Ahmet Bey, yerde duran $40\text{ N}$ ağırlığındaki deterjan kolisini $2\text{ metre}$ yükseklikteki market rafına düzgün bir şekilde kaldırmıştır.</p>
          <p class="prob-q">Buna göre Ahmet Bey'in yer çekimi kuvvetine karşı yaptığı iş kaç Joule'dür?</p>
        </div>

        <div class="problem-solution-card">
          <div class="step-row">
            <span class="step-badge">1. Verilenler</span>
            <div>$F = 40\text{ N}$ (Ağırlığa eşit dikey kuvvet), $x = 2\text{ m}$ (Yükseklik)</div>
          </div>
          <div class="step-row">
            <span class="step-badge">2. İstenen</span>
            <div>Yapılan İş ($W = ?$)</div>
          </div>
          <div class="step-row">
            <span class="step-badge">3. Formül</span>
            <div>$W = F \times x$</div>
          </div>
          <div class="step-row">
            <span class="step-badge">4. İşlem</span>
            <div class="final-ans">$W = 40\text{ N} \times 2\text{ m} = \mathbf{80\text{ Joule}}$</div>
          </div>
        </div>
      </div>
      <div class="bottom-callout"><i class="fa-solid fa-circle-info"></i> <strong>DİKKAT:</strong> Cisim yukarı kaldırılırken en az ağırlığı kadar kuvvet uygulanmalıdır. Bu nedenle $F = 40\text{ N}$ alınmıştır.</div>
    `
  },

  // 15. ADIM ADIM PROBLEM 2 (SIRALAMA & GRAFİK)
  {
    num: 15,
    kicker: "BECERİ TEMELLİ PROBLEM",
    title: "K, L ve M Cisimlerinin Yaptığı İşleri Karşılaştıralım",
    subtitle: "Farklı kuvvet ve yol kombinasyonlarında yapılan işlerin sıralanması",
    html: `
      <div class="slide-body grid-3-cards">
        <div class="calc-item-card">
          <h4>K CİSMİ</h4>
          <div class="ci-param">Kuvvet: <strong>20 N</strong></div>
          <div class="ci-param">Yol: <strong>5 m</strong></div>
          <div class="ci-result">$W_K = 20 \times 5 = \mathbf{100\text{ J}}$</div>
        </div>

        <div class="calc-item-card">
          <h4>L CİSMİ</h4>
          <div class="ci-param">Kuvvet: <strong>40 N</strong></div>
          <div class="ci-param">Yol: <strong>2 m</strong></div>
          <div class="ci-result">$W_L = 40 \times 2 = \mathbf{80\text{ J}}$</div>
        </div>

        <div class="calc-item-card">
          <h4>M CİSMİ</h4>
          <div class="ci-param">Kuvvet: <strong>15 N</strong></div>
          <div class="ci-param">Yol: <strong>8 m</strong></div>
          <div class="ci-result highlighted">$W_M = 15 \times 8 = \mathbf{120\text{ J}}$</div>
        </div>
      </div>
      <div class="ranking-banner">
        <span>BÜYÜKLÜK SIRALAMASI:</span>
        <span class="rank-pill">W<sub>M</sub> (120 J) &gt; W<sub>K</sub> (100 J) &gt; W<sub>L</sub> (80 J)</span>
      </div>
    `
  },

  // 16. KAVRAM YANILGILARI
  {
    num: 16,
    kicker: "DİKKAT TUZAK!",
    title: "Fiziksel İş Konusunda 5 Kritik Kavram Yanılgısı",
    subtitle: "Öğrencilerin testlerde ve sınavlarda en çok düştüğü yanılgılar ve doğruları",
    html: `
      <div class="slide-body">
        <div class="misconception-grid">
          <div class="mc-item">
            <div class="mc-wrong"><i class="fa-solid fa-xmark"></i> YANILGI: "Ağır bir yükü elimde taşırken çok yoruluyorum, çok iş yapıyorum."</div>
            <div class="mc-right"><i class="fa-solid fa-check"></i> DOĞRUSU: Kuvvet dikey yukarı, hareket yatay ileriyse kuvvet iş YAPMAZ!</div>
          </div>
          <div class="mc-item">
            <div class="mc-wrong"><i class="fa-solid fa-xmark"></i> YANILGI: "Büyük kuvvet uygulanan her durumda mutlaka çok iş yapılır."</div>
            <div class="mc-right"><i class="fa-solid fa-check"></i> DOĞRUSU: Cisim kımıldamıyorsa ($x=0$) kuvvet ne kadar devasa olursa olsun iş SIFIRDIR.</div>
          </div>
          <div class="mc-item">
            <div class="mc-wrong"><i class="fa-solid fa-xmark"></i> YANILGI: "Kuvvet ile hareket zıt yönlü olursa iş olmaz."</div>
            <div class="mc-right"><i class="fa-solid fa-check"></i> DOĞRUSU: Sürtünme kuvveti harekete zıttır ve negatif iş yaparak kinetik enerjiyi ısıya çevirir.</div>
          </div>
          <div class="mc-item">
            <div class="mc-wrong"><i class="fa-solid fa-xmark"></i> YANILGI: "Merdiven çıkarken çantayı taşımak iş sayılmaz."</div>
            <div class="mc-right"><i class="fa-solid fa-check"></i> DOĞRUSU: Merdivende yukarı doğru yükselme olduğu için yer çekimine karşı İŞ YAPILIR.</div>
          </div>
        </div>
      </div>
    `
  },

  // 17. İNTERAKTİF SINIF GÖREVİ: İŞ DEDEKTİFİ
  {
    num: 17,
    kicker: "İNTERAKTİF SINIF ETKİNLİĞİ",
    title: "İş Dedektifi Sahada: Kararını Ver!",
    subtitle: "Akıllı tahtada senaryolara tıkla, iş yapılıp yapılmadığını gerekçesiyle keşfet",
    html: `
      <div class="slide-body grid-2-col">
        <div class="quiz-scenario-card" onclick="this.classList.toggle('revealed')">
          <span class="sc-badge">DURUM A</span>
          <h4>Paraşütle yere süzülen sporcu</h4>
          <p>Paraşütçü yer çekimi etkisiyle gökten yere doğru alçalmaktadır.</p>
          <div class="hidden-answer">
            <span class="pill-yes">İŞ VARDIR! ✅</span>
            <small>Yer çekimi kuvveti aşağı yönde iş yapar.</small>
          </div>
        </div>

        <div class="quiz-scenario-card" onclick="this.classList.toggle('revealed')">
          <span class="sc-badge">DURUM B</span>
          <h4>Karlı yolda patinaj yapan kamyon</h4>
          <p>Gaza basılmasına rağmen tekerlekler dönüyor ama araç ilerlemiyor.</p>
          <div class="hidden-answer">
            <span class="pill-no">İŞ YOKTUR! ❌</span>
            <small>Araç yer değiştirmediği için (x = 0) iş yapılmaz.</small>
          </div>
        </div>

        <div class="quiz-scenario-card" onclick="this.classList.toggle('revealed')">
          <span class="sc-badge">DURUM C</span>
          <h4>Rafta duran süs vazosu</h4>
          <p>Yüksek bir rafta saatlerdir hareketsiz bekleyen antika vazo.</p>
          <div class="hidden-answer">
            <span class="pill-no">İŞ YOKTUR! ❌</span>
            <small>Hareketsizdir, yer değiştirme sıfırdır.</small>
          </div>
        </div>

        <div class="quiz-scenario-card" onclick="this.classList.toggle('revealed')">
          <span class="sc-badge">DURUM D</span>
          <h4>Yaylı zımba ile kağıt delmek</h4>
          <p>Yukarıdan zımbaya bastırıp zımba kolunu aşağı itmek.</p>
          <div class="hidden-answer">
            <span class="pill-yes">İŞ VARDIR! ✅</span>
            <small>Kuvvet yönünde zımba kolu yer değiştirir.</small>
          </div>
        </div>
      </div>
      <div class="bottom-callout"><i class="fa-solid fa-hand-pointer"></i> <strong>ETKİLEŞİM:</strong> Kartlara dokunarak cevapları açabilirsiniz.</div>
    `
  },

  // 18. 1. BÖLÜM ÖZETİ
  {
    num: 18,
    kicker: "1. BÖLÜMÜN BÜYÜK ÖZETİ",
    title: "Fiziksel İş: Zihin Haritası",
    subtitle: "Birinci bölümün can damarı olan 4 temel kavrayış",
    html: `
      <div class="slide-body grid-4-cards">
        <div class="mind-card">
          <div class="mc-icon"><i class="fa-solid fa-bullseye"></i></div>
          <h4>Şartlar</h4>
          <p>1. Net kuvvet olmalı.<br>2. Cisim kuvvet doğrultusunda yer değiştirmeli.</p>
        </div>
        <div class="mind-card">
          <div class="mc-icon"><i class="fa-solid fa-calculator"></i></div>
          <h4>Formül</h4>
          <p><strong>W = F · x</strong><br>İş = Kuvvet × Yol</p>
        </div>
        <div class="mind-card">
          <div class="mc-icon"><i class="fa-solid fa-ruler-combined"></i></div>
          <h4>Birim</h4>
          <p><strong>Joule (J)</strong><br>1 Joule = 1 N × 1 m</p>
        </div>
        <div class="mind-card">
          <div class="mc-icon"><i class="fa-solid fa-ban"></i></div>
          <h4>İş Olmayan Hal</h4>
          <p>x = 0 ise İŞ YOK.<br>Kuvvet yola dik ise İŞ YOK.</p>
        </div>
      </div>
    `
  },

  // 19. ENERJİ NEDİR?
  {
    num: 19,
    kicker: "2. BÖLÜM: ENERJİ ÇEŞİTLERİ",
    title: "Enerji Nedir? (İş ile Enerjinin Kardeşliği)",
    subtitle: "Cisimlerin iş yapabilme potansiyeli ve evrenin en temel yakıtı",
    html: `
      <div class="slide-body grid-2-col" style="align-items: center;">
        <div class="definition-card">
          <div class="kicker-tag">BİLİMSEL TANIM</div>
          <h2>ENERJİ: İş Yapabilme Yeteneğidir</h2>
          <p>Bir cismin iş yapabilmesi için mutlaka enerjiye sahip olması gerekir. Cisme iş yaptığınızda ona enerji kazandırırsınız; cisim de sahip olduğu enerjiyle iş yapabilir.</p>
          <div class="shared-unit-box">
            <span>ORTAK BİRİM:</span>
            <strong>JOULE (J)</strong>
            <small>Hem işin hem enerjinin birimi aynıdır!</small>
          </div>
        </div>

        <div class="energy-tree-card">
          <h4>Bu Bölümde İnceleyeceğimiz 3 Enerji:</h4>
          <div class="tree-item tree-k">
            <i class="fa-solid fa-person-running"></i>
            <div><strong>1. Kinetik Enerji</strong> (Hareketten kaynaklanan enerji)</div>
          </div>
          <div class="tree-item tree-p">
            <i class="fa-solid fa-cloud-arrow-down"></i>
            <div><strong>2. Çekim Potansiyel Enerjisi</strong> (Yükseklikten kaynaklanan enerji)</div>
          </div>
          <div class="tree-item tree-e">
            <i class="fa-solid fa-arrows-split-up-and-left"></i>
            <div><strong>3. Esneklik Potansiyel Enerjisi</strong> (Gerilme/sıkışma enerjisi)</div>
          </div>
        </div>
      </div>
    `
  },

  // 20. KİNETİK ENERJİ
  {
    num: 20,
    kicker: "ENERJİ ÇEŞİTLERİ",
    title: "Kinetik Enerji (Hareketin Enerjisi)",
    subtitle: "Hareket halindeki tüm cisimlerin sahip olduğu kinetik enerji",
    html: `
      <div class="slide-body grid-2-col">
        <div class="concept-detail">
          <div class="bullet-point">
            <i class="fa-solid fa-wind text-blue"></i>
            <div>
              <strong>Hareket Eden Her Şey Kinetik Enerji Taşır:</strong>
              <p>Otoyolda giden otomobil, havada süzülen kuş, akan ırmak suyu, rüzgar türbininin dönen kanatları, şut çekilen futbol topu...</p>
            </div>
          </div>
          <div class="bullet-point">
            <i class="fa-solid fa-stop text-red"></i>
            <div>
              <strong>Duran Cisimlerin Kinetik Enerjisi SIFIRDIR:</strong>
              <p>Hareketsiz bir cismin sürati ($v=0$) olduğu için kinetik enerjisi de kesinlikle sıfırdır.</p>
            </div>
          </div>
          <div class="bullet-point">
            <i class="fa-solid fa-sliders text-purple"></i>
            <div>
              <strong>Kinetik Enerji 2 Değişkene Bağlıdır:</strong>
              <p>1. Cismin Kütlesi ($m$)<br>2. Cismin Sürati ($v$)</p>
            </div>
          </div>
        </div>

        <div class="visual-gallery">
          <div class="vg-item"><i class="fa-solid fa-bicycle"></i> Bisikletli Çocuk</div>
          <div class="vg-item"><i class="fa-solid fa-plane"></i> Uçan Uçak</div>
          <div class="vg-item"><i class="fa-solid fa-water"></i> Çağlayan Şelale</div>
          <div class="vg-item"><i class="fa-solid fa-train"></i> Hızlı Tren</div>
        </div>
      </div>
    `
  },

  // 21. KİNETİK ENERJİ: KÜTLE ETKİSİ
  {
    num: 21,
    kicker: "KİNETİK ENERJİ DEĞİŞKENLERİ",
    title: "Kütle Artarsa Kinetik Enerji Nasıl Değişir?",
    subtitle: "Süratleri eşit cisimlerde kütlesi büyük olanın kinetik enerjisi daha büyüktür",
    html: `
      <div class="slide-body grid-2-col" style="align-items:center;">
        <div class="vehicle-card small">
          <div class="v-tag">KÜÇÜK OTOMOBİL</div>
          <div class="v-icon"><i class="fa-solid fa-car"></i></div>
          <div class="v-specs">Kütle: <strong>1.000 kg</strong> | Sürat: <strong>60 km/sa</strong></div>
          <div class="v-energy low">Kinetik Enerji: <strong>ORTA</strong></div>
        </div>

        <div class="vehicle-card big">
          <div class="v-tag">AĞIR KAMYON (6 Kat Kütle)</div>
          <div class="v-icon"><i class="fa-solid fa-truck"></i></div>
          <div class="v-specs">Kütle: <strong>6.000 kg</strong> | Sürat: <strong>60 km/sa</strong></div>
          <div class="v-energy high">Kinetik Enerji: <strong>ÇOK YÜKSEK (6 Kat!)</strong></div>
        </div>
      </div>
      <div class="bottom-callout"><i class="fa-solid fa-bullhorn"></i> <strong>ÇIKARIM:</strong> Eşit süratle giden bir kamyon ile bir otomobil aynı duvara çarparsa, kamyon kütlesi daha büyük olduğu için çok daha büyük bir kinetik enerjiye ve tahrip gücüne sahiptir! ($E_k \propto m$)</div>
    `
  },

  // 22. KİNETİK ENERJİ: SÜRAT ETKİSİ
  {
    num: 22,
    kicker: "KİNETİK ENERJİ DEĞİŞKENLERİ",
    title: "Sürat Artarsa Kinetik Enerji Nasıl Değişir?",
    subtitle: "Kütleleri eşit cisimlerde sürati büyük olanın kinetik enerjisi katlanarak artar",
    html: `
      <div class="slide-body grid-2-col">
        <div class="speed-compare-card">
          <h4>BİSİKLETLİ: Sürat = 5 m/s (10 km/sa)</h4>
          <div class="meter-bar"><div class="fill" style="width: 25%;">25 Joule</div></div>
          <p>Düşük sürat, düşük kinetik enerji. Kolayca durabilir.</p>
        </div>

        <div class="speed-compare-card">
          <h4>BİSİKLETLİ: Sürat = 10 m/s (2 Kat Sürat!)</h4>
          <div class="meter-bar"><div class="fill red" style="width: 100%;">100 Joule (Tam 4 Katı!)</div></div>
          <p>Sürat 2 katına çıktığında kinetik enerji 2 kat değil, <strong>4 KATINA</strong> çıkar!</p>
        </div>
      </div>
      <div class="bottom-callout"><i class="fa-solid fa-circle-exclamation"></i> <strong>BİLİMSEL AYRINTI:</strong> Kinetik enerji süratin kendisiyle değil, <strong>süratin karesiyle ($v^2$)</strong> doğru orantılıdır! Sürat 3 katına çıkarsa enerji 9 katına fırlar.</div>
    `
  },

  // 23. TRAFİK GÜVENLİĞİ VE KİNETİK ENERJİ
  {
    num: 23,
    kicker: "GÜNLÜK YAŞAM VE BİLİM",
    title: "Trafik Güvenliği ve Kinetik Enerji İlişkisi",
    subtitle: "Hız sınırları, emniyet kemerleri ve fren mesafelerinin arkasındaki fizik kanunu",
    html: `
      <div class="slide-body grid-3-cards">
        <div class="traffic-card">
          <div class="tc-icon text-red"><i class="fa-solid fa-triangle-exclamation"></i></div>
          <h4>Fren Mesafesi Neden Uzar?</h4>
          <p>Hızınızı 50 km/sa'ten 100 km/sa'e çıkardığınızda durma mesafeniz 2 kat değil, yaklaşık <strong>4 kat uzar</strong>. Çünkü fren balataları 4 kat daha fazla kinetik enerjiyi ısıya çevirmek zorundadır.</p>
        </div>
        <div class="traffic-card">
          <div class="tc-icon text-blue"><i class="fa-solid fa-shield-halved"></i></div>
          <h4>Emniyet Kemerinin Rolü</h4>
          <p>Araç aniden durduğunda içindeki yolcular sahip oldukları kinetik enerji nedeniyle ileri doğru fırlamak ister. Emniyet kemeri bu enerjiyi göğse yayarak güvenle absorbe eder.</p>
        </div>
        <div class="traffic-card">
          <div class="tc-icon text-amber"><i class="fa-solid fa-helmet-safety"></i></div>
          <h4>Kask ve Koruyucu Ekipman</h4>
          <p>Bisiklet ve motosiklet sürücülerinin kaskı, kaza anında başın taşıdığı kinetik enerjiyi köpük katmanında ezilme işine dönüştürerek beyni darbelerden korur.</p>
        </div>
      </div>
    `
  },

  // 24. POTANSİYEL ENERJİYE GİRİŞ
  {
    num: 24,
    kicker: "ENERJİ ÇEŞİTLERİ",
    title: "Potansiyel Enerji Nedir? (Depolanmış Gizli Güç)",
    subtitle: "Cismin konumundan veya esnekliğinden dolayı içinde sakladığı enerji",
    html: `
      <div class="slide-body grid-2-col">
        <div class="pot-card pot-gravity">
          <div class="p-icon"><i class="fa-solid fa-water"></i></div>
          <h3>1. Çekim Potansiyel Enerjisi</h3>
          <p>Cismin yer çekimine karşı <strong>yükseğe çıkarılmasıyla</strong> depoladığı enerjidir.</p>
          <div class="p-examples">Örn: Baraj gölündeki sular, daldaki elma, yüksek raftaki kitap.</div>
        </div>

        <div class="pot-card pot-spring">
          <div class="p-icon"><i class="fa-solid fa-cubes"></i></div>
          <h3>2. Esneklik Potansiyel Enerjisi</h3>
          <p>Esnek cisimlerin <strong>sıkıştırılması veya gerilmesiyle</strong> depoladığı enerjidir.</p>
          <div class="p-examples">Örn: Sıkışmış amortisör yayı, gerilmiş ok yayı, zıplama trambolini.</div>
        </div>
      </div>
      <div class="bottom-callout"><i class="fa-solid fa-clock"></i> <strong>PÜF NOKTASI:</strong> Potansiyel kelimesi "henüz açığa çıkmamış, bekleyen güç" demektir. Cisim serbest bırakıldığı an bu enerji kinetik enerjiye dönüşür!</div>
    `
  },

  // 25. ÇEKİM POTANSİYEL ENERJİSİ
  {
    num: 25,
    kicker: "POTANSİYEL ENERJİ",
    title: "Çekim Potansiyel Enerjisi",
    subtitle: "Yerden yüksekte bulunan tüm cisimlerin yer çekimine karşı kazandığı konum enerjisi",
    html: `
      <div class="slide-body grid-2-col" style="align-items: center;">
        <div class="schema-card">
          <svg viewBox="0 0 380 220" class="schema-svg">
            <rect x="20" y="180" width="340" height="6" fill="#64748b"/>
            <!-- Masa / Raf -->
            <rect x="60" y="90" width="120" height="90" fill="#fed7aa" stroke="#c2410c" stroke-width="2"/>
            <!-- Kitap / Koli -->
            <rect x="90" y="60" width="60" height="30" fill="#3b82f6" rx="4"/>
            <text x="120" y="80" text-anchor="middle" fill="#fff" font-weight="bold">m = 2 kg</text>
            <!-- Yükseklik Çizgisi -->
            <line x1="220" y1="60" x2="220" y2="180" stroke="#f59e0b" stroke-width="3" stroke-dasharray="6,4"/>
            <text x="235" y="125" fill="#b45309" font-weight="900" font-size="16">h (Yükseklik)</text>
          </svg>
        </div>
        <div class="concept-detail">
          <h4>Çekim Potansiyeli 2 Şeye Bağlıdır:</h4>
          <div class="dep-box">
            <span class="badge-num">1</span>
            <div><strong>Cismin Ağırlığına / Kütlesine ($m$):</strong> Kütle arttıkça potansiyel enerji doğru orantılı artar.</div>
          </div>
          <div class="dep-box">
            <span class="badge-num">2</span>
            <div><strong>Cismin Bulunduğu Yüksekliğe ($h$):</strong> Cisim yerden ne kadar yükseğe çıkarsa potansiyel enerjisi o kadar artar.</div>
          </div>
          <div class="formula-mini-box">$$E_{p\text{ (çekim)}} = m \cdot g \cdot h$$</div>
        </div>
      </div>
    `
  },

  // 26. ÇEKİM POTANSİYELİ: YÜKSEKLİK ETKİSİ
  {
    num: 26,
    kicker: "DENEYSEL KARŞILAŞTIRMA",
    title: "Yükseklik Artarsa Çekim Potansiyel Enerjisi?",
    subtitle: "Kütleleri eşit (1 kg) iki kitabın farklı yüksekliklerdeki enerjileri",
    html: `
      <div class="slide-body grid-2-col">
        <div class="book-card low-h">
          <div class="bc-tag">1. RAF: DÜŞÜK YÜKSEKLİK</div>
          <div class="bc-specs">Kütle: <strong>1 kg</strong> | Yükseklik: <strong>1 metre</strong></div>
          <div class="energy-bar"><div class="fill" style="width: 33%;">10 Joule</div></div>
          <p>Yumuşak kuma düştüğünde kuma az gömülür ve küçük çukur açar.</p>
        </div>

        <div class="book-card high-h">
          <div class="bc-tag">3. RAF: YÜKSEK (3 Kat Yükseklik!)</div>
          <div class="bc-specs">Kütle: <strong>1 kg</strong> | Yükseklik: <strong>3 metre</strong></div>
          <div class="energy-bar"><div class="fill purple" style="width: 100%;">30 Joule (3 Kat Fazla!)</div></div>
          <p>Yumuşak kuma düştüğünde kuma çok daha derin bir çukur açar.</p>
        </div>
      </div>
      <div class="bottom-callout"><i class="fa-solid fa-check"></i> <strong>SONUÇ:</strong> Kütle sabitken cismin yüksekliği arttıkça çekim potansiyel enerjisi doğru orantılı olarak artar! ($E_p \propto h$)</div>
    `
  },

  // 27. ÇEKİM POTANSİYELİ: KÜTLE ETKİSİ
  {
    num: 27,
    kicker: "DENEYSEL KARŞILAŞTIRMA",
    title: "Kütle Artarsa Çekim Potansiyel Enerjisi?",
    subtitle: "Aynı rafta (2 metre) duran 2 kg ve 4 kg'lık kutuların karşılaştırması",
    html: `
      <div class="slide-body grid-2-col">
        <div class="box-card small-m">
          <div class="bc-tag">KUTU 1</div>
          <div class="bc-specs">Kütle: <strong>2 kg</strong> | Yükseklik: <strong>2 metre</strong></div>
          <div class="energy-bar"><div class="fill" style="width: 50%;">40 Joule</div></div>
        </div>

        <div class="box-card big-m">
          <div class="bc-tag">KUTU 2 (2 Kat Kütle!)</div>
          <div class="bc-specs">Kütle: <strong>4 kg</strong> | Yükseklik: <strong>2 metre</strong></div>
          <div class="energy-bar"><div class="fill green" style="width: 100%;">80 Joule (2 Kat Fazla!)</div></div>
        </div>
      </div>
      <div class="bottom-callout"><i class="fa-solid fa-check"></i> <strong>SONUÇ:</strong> Yükseklikleri eşit olan cisimlerden kütlesi büyük olanın çekim potansiyel enerjisi daha büyüktür! ($E_p \propto m$)</div>
    `
  },

  // 28. ESNEKLİK POTANSİYEL ENERJİSİ
  {
    num: 28,
    kicker: "POTANSİYEL ENERJİ TÜRÜ",
    title: "Esneklik Potansiyel Enerjisi (Yayların Gücü)",
    subtitle: "Kuvvet etkisiyle şekil değiştiren, kuvvet kalkınca eski haline dönen esnek cisimler",
    html: `
      <div class="slide-body grid-2-col" style="align-items: center;">
        <div class="spring-visual-card">
          <svg viewBox="0 0 360 200" class="schema-svg">
            <!-- Normal Yay -->
            <text x="30" y="30" font-weight="bold" fill="#475569" font-size="13">Normal Yay (Enerji = 0)</text>
            <path d="M 30 50 Q 50 35 70 50 T 110 50 T 150 50 T 190 50 T 230 50" fill="none" stroke="#64748b" stroke-width="4"/>
            <!-- Sıkıştırılmış Yay -->
            <text x="30" y="110" font-weight="bold" fill="#b45309" font-size="13">Sıkıştırılmış Yay (ENERJİ DEPOLANDI!)</text>
            <path d="M 30 135 Q 40 120 50 135 T 70 135 T 90 135 T 110 135 T 130 135" fill="none" stroke="#f59e0b" stroke-width="5"/>
            <!-- El Sıkıştırma Kuvveti -->
            <line x1="180" y1="135" x2="135" y2="135" stroke="#ef4444" stroke-width="4" marker-end="url(#arr-f)"/>
            <text x="185" y="140" fill="#ef4444" font-weight="bold">F (Sıkıştırma)</text>
          </svg>
        </div>

        <div class="concept-detail">
          <h4>Esneklik Enerjisi Depolayan Örnekler:</h4>
          <ul class="styled-list">
            <li><strong>Ok ve Yay:</strong> Yay gerildikçe esneklik potansiyel enerjisi birikir.</li>
            <li><strong>Trambolin:</strong> Çocuk tramboline bastığında file esneyerek enerji depolar ve çocuğu yukarı fırlatır.</li>
            <li><strong>Kurmalı Oyuncaklar:</strong> Anahtar çevrildikçe içindeki helezon yay sıkışarak enerji depolar.</li>
            <li><strong>Amortisörler:</strong> Arabaların çukurlarda sarsılmasını önleyen çelik yaylar.</li>
          </ul>
        </div>
      </div>
    `
  },

  // 29. ESNEKLİK ENERJİSİ NEYE BAĞLIDIR?
  {
    num: 29,
    kicker: "ESNEKLİK POTANSİYELİ DEĞİŞKENLERİ",
    title: "Esneklik Enerjisi Neye Bağlıdır?",
    subtitle: "Sıkışma/gerilme miktarı ve yayın yapısal özellikleri",
    html: `
      <div class="slide-body grid-2-col">
        <div class="factor-card">
          <div class="fc-badge">1. FAKTÖR</div>
          <h4>Sıkışma / Gerilme Miktarı ($x$)</h4>
          <p>Yayı ne kadar çok sıkıştırır veya gererseniz depolanan enerji o kadar artar.</p>
          <div class="mini-compare">
            <div>2 cm sıkışmış yay $\rightarrow$ <strong>Az Enerji</strong></div>
            <div>6 cm sıkışmış yay $\rightarrow$ <strong>Çok Yüksek Enerji!</strong></div>
          </div>
        </div>

        <div class="factor-card">
          <div class="fc-badge">2. FAKTÖR</div>
          <h4>Yayın Cinsi ve Kalınlığı ($k$)</h4>
          <p>Kalın, sert ve dirençli yaylar aynı miktar sıkıştırıldığında ince yaylara göre kat kat daha fazla enerji depolar.</p>
          <div class="mini-compare">
            <div>Tükenmez kalem yayı $\rightarrow$ <strong>Düşük Kapasite</strong></div>
            <div>Otomobil amortisör yayı $\rightarrow$ <strong>Devasa Enerji!</strong></div>
          </div>
        </div>
      </div>
    `
  },

  // 30. BİR CİSİMDE İKİ ENERJİ BİRDEN BULUNABİLİR Mİ?
  {
    num: 30,
    kicker: "MEKANİK ENERJİ KAVRAMI",
    title: "Bir Cisimde İki Enerji Birden Bulunabilir mi?",
    subtitle: "Hem sürati olan hem de yüksekte bulunan cisimler: Mekanik Enerji",
    html: `
      <div class="slide-body grid-2-col" style="align-items: center;">
        <div class="plane-card">
          <div class="plane-icon"><i class="fa-solid fa-plane-departure"></i></div>
          <h3>Havada Uçan Yolcu Uçağı</h3>
          <div class="energy-dual-tags">
            <span class="tag-k"><i class="fa-solid fa-gauge-high"></i> Sürati var $\rightarrow$ KİNETİK ENERJİ VAR!</span>
            <span class="tag-p"><i class="fa-solid fa-cloud"></i> Yüksekte $\rightarrow$ ÇEKİM POTANSİYELİ VAR!</span>
          </div>
        </div>

        <div class="formula-box-card">
          <h4>MEKANİK ENERJİ FORMÜLÜ</h4>
          <div class="big-formula">E<sub>Mekanik</sub> = E<sub>Kinetik</sub> + E<sub>Potansiyel</sub></div>
          <p>Bir cismin kinetik enerjisi ile potansiyel enerjisinin toplamına <strong>MEKANİK ENERJİ</strong> denir.</p>
          <div class="examples-tag-row">
            <span>Daldan düşen elma</span>
            <span>Uçan kuş</span>
            <span>Rampadan inen kaykaycı</span>
          </div>
        </div>
      </div>
    `
  },

  // 31. ENERJİ KARŞILAŞTIRMA MATRİSİ
  {
    num: 31,
    kicker: "2. BÖLÜM ÖZETİ",
    title: "Enerji Çeşitleri Karşılaştırma Matrisi",
    subtitle: "Kinetik, Çekim Potansiyeli ve Esneklik Potansiyeli tek ekranda",
    html: `
      <div class="slide-body">
        <table class="life-table">
          <thead>
            <tr>
              <th>Enerji Türü</th>
              <th>Kaynağı</th>
              <th>Bağlı Olduğu Faktörler</th>
              <th>Örnek Durum</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Kinetik Enerji</strong></td>
              <td>Cismin hareketi (sürati)</td>
              <td>Kütle ($m$) ve Sürat ($v$)</td>
              <td>Koşan çocuk, otoyoldaki araba, akan su</td>
            </tr>
            <tr>
              <td><strong>Çekim Potansiyel Enerjisi</strong></td>
              <td>Cismin yüksekliği (konumu)</td>
              <td>Kütle ($m$) ve Yükseklik ($h$)</td>
              <td>Raftaki vazo, barajdaki su, daldaki meyve</td>
            </tr>
            <tr>
              <td><strong>Esneklik Potansiyel Enerjisi</strong></td>
              <td>Esnek cismin gerilmesi/sıkışması</td>
              <td>Sıkışma miktarı ($x$) ve Yayın cinsi ($k$)</td>
              <td>Kurulmuş saat yayı, gerilmiş sapan lastiği</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  },

  // 32. ENERJİ DÖNÜŞÜMLERİ VE KORUNUMU AÇILIŞ
  {
    num: 32,
    kicker: "3. BÖLÜM: BÜYÜK DÖNÜŞÜM",
    title: "Enerji Asla Yok Olmaz, Sadece Dönüşür!",
    subtitle: "Evrenin en sarsılmaz kanunu: Enerjinin Korunumu Yasası",
    html: `
      <div class="slide-body grid-2-col" style="align-items: center;">
        <div class="law-card">
          <div class="law-kicker">ENERJİNİN KORUNUMU KANUNU</div>
          <h2>"Enerji yoktan var edilemez, var olan enerji de asla yok edilemez; sadece bir türden başka bir türe dönüşür."</h2>
          <p>Bir lunapark treninde, parktaki salıncakta veya yukarı fırlattığımız topta enerji hiçbir yere kaybolmaz; kinetikten potansiyele, potansiyelden kinetiğe veya ısıya dönüşür.</p>
        </div>

        <div class="cycle-visual">
          <div class="cycle-node node-k">KİNETİK ENERJİ</div>
          <div class="cycle-arrow">⇄</div>
          <div class="cycle-node node-p">POTANSİYEL ENERJİ</div>
          <div class="cycle-sub">Sürtünme varsa: Isı ve Ses Enerjisine dönüşür!</div>
        </div>
      </div>
    `
  },

  // 33. MODEL 1: DÜŞEN CİSİM (ELMA)
  {
    num: 33,
    kicker: "ENERJİ DÖNÜŞÜM MODELİ 1",
    title: "Daldan Düşen Elmanın Enerji Dönüşümü",
    subtitle: "Aşağı düşerken yükseklik azalır, sürat artar!",
    html: `
      <div class="slide-body grid-3-cards">
        <div class="phase-card">
          <span class="phase-badge">1. DALDA DURURKEN</span>
          <div class="phase-energy">
            <div>Potansiyel: <strong class="text-green">MAKSİMUM</strong></div>
            <div>Kinetik: <strong class="text-red">SIFIR (0)</strong></div>
          </div>
          <p>Elma hareketsizdir, sadece yüksekliğinden dolayı çekim potansiyel enerjisi vardır.</p>
        </div>

        <div class="phase-card highlighted">
          <span class="phase-badge">2. DÜŞERKEN (HAVADA)</span>
          <div class="phase-energy">
            <div>Potansiyel: <strong>AZALIR ↓</strong></div>
            <div>Kinetik: <strong>ARTAR ↑</strong></div>
          </div>
          <p>Yükseklik azaldıkça potansiyel enerji azalır, elma hızlandıkça bu enerji kinetik enerjiye dönüşür!</p>
        </div>

        <div class="phase-card">
          <span class="phase-badge">3. YERE ÇARPARKEN</span>
          <div class="phase-energy">
            <div>Potansiyel: <strong class="text-red">SIFIR (0)</strong></div>
            <div>Kinetik: <strong class="text-green">MAKSİMUM</strong></div>
          </div>
          <p>Yükseklik sıfırlanmıştır; tüm potansiyel enerji maksimum kinetik enerjiye dönüşmüştür!</p>
        </div>
      </div>
      <div class="bottom-callout"><i class="fa-solid fa-calculator"></i> <strong>SÜRTÜNMESİZ ORTAMDA:</strong> Toplam mekanik enerji ($E_k + E_p$) yol boyunca tamamen sabittir!</div>
    `
  },

  // 34. MODEL 2: YUKARI FIRLATILAN TOP
  {
    num: 34,
    kicker: "ENERJİ DÖNÜŞÜM MODELİ 2",
    title: "Yukarı Fırlatılan Topun Enerji Serüveni",
    subtitle: "Yükselirken Kinetik $\\rightarrow$ Potansiyel, İnerken Potansiyel $\\rightarrow$ Kinetik",
    html: `
      <div class="slide-body grid-4-cards">
        <div class="step-ball-card">
          <h4>1. Elden Çıkış Anı</h4>
          <div class="sb-val text-green">Kinetik: EN BÜYÜK</div>
          <div class="sb-val text-red">Potansiyel: EN KÜÇÜK</div>
          <p>En yüksek süratle elden fırlar.</p>
        </div>

        <div class="step-ball-card">
          <h4>2. Yukarı Tırmanış</h4>
          <div class="sb-val">Kinetik: Azalır ↓</div>
          <div class="sb-val">Potansiyel: Artar ↑</div>
          <p>Top yer çekimine karşı yavaşlar ($K \\rightarrow P$).</p>
        </div>

        <div class="step-ball-card highlight-top">
          <h4>3. En Tepe Noktası</h4>
          <div class="sb-val text-red">Kinetik: SIFIR (Durdu!)</div>
          <div class="sb-val text-green">Potansiyel: MAKSİMUM</div>
          <p>Anlık olarak durur, en tepeye ulaşmıştır.</p>
        </div>

        <div class="step-ball-card">
          <h4>4. Aşağı Düşüş</h4>
          <div class="sb-val">Kinetik: Artar ↑</div>
          <div class="sb-val">Potansiyel: Azalır ↓</div>
          <p>Yere doğru hızlanır ($P \\rightarrow K$).</p>
        </div>
      </div>
    `
  },

  // 35. MODEL 3: SALINCAK
  {
    num: 35,
    kicker: "ENERJİ DÖNÜŞÜM MODELİ 3",
    title: "Parktaki Salıncakta Enerji Dönüşümü",
    subtitle: "Uç noktalarda potansiyel maksimum, en dipte kinetik maksimum!",
    html: `
      <div class="slide-body grid-2-col" style="align-items: center;">
        <div class="swing-diagram-card">
          <svg viewBox="0 0 380 220" class="schema-svg">
            <circle cx="190" cy="20" r="6" fill="#334155"/>
            <!-- Sol Konum A -->
            <line x1="190" y1="20" x2="80" y2="120" stroke="#94a3b8" stroke-width="2"/>
            <circle cx="80" cy="120" r="16" fill="#f59e0b"/>
            <text x="80" y="155" text-anchor="middle" font-weight="900" font-size="14">A NOKTASI</text>
            <!-- Orta Konum B -->
            <line x1="190" y1="20" x2="190" y2="180" stroke="#94a3b8" stroke-width="2"/>
            <circle cx="190" cy="180" r="16" fill="#10b981"/>
            <text x="190" y="210" text-anchor="middle" font-weight="900" font-size="14">B NOKTASI (En Dip)</text>
            <!-- Sağ Konum C -->
            <line x1="190" y1="20" x2="300" y2="120" stroke="#94a3b8" stroke-width="2"/>
            <circle cx="300" cy="120" r="16" fill="#f59e0b"/>
            <text x="300" y="155" text-anchor="middle" font-weight="900" font-size="14">C NOKTASI</text>
          </svg>
        </div>

        <div class="swing-explanation">
          <div class="pt-item">
            <span class="pt-badge orange">A ve C Noktaları (Uçlar)</span>
            <p>Salıncak anlık durur. Yükseklik en fazladır $\rightarrow$ <strong>Çekim Potansiyel MAKSİMUM, Kinetik SIFIR!</strong></p>
          </div>
          <div class="pt-item">
            <span class="pt-badge green">B Noktası (En Dip Orta)</span>
            <p>Salıncağın en hızlı uçtuğu yerdir. Yükseklik minimumdur $\rightarrow$ <strong>Kinetik MAKSİMUM, Potansiyel EN AZ!</strong></p>
          </div>
        </div>
      </div>
    `
  },

  // 36. MODEL 4: LUNAPARKTAKİ HIZ TRENİ
  {
    num: 36,
    kicker: "ENERJİ DÖNÜŞÜM MODELİ 4",
    title: "Lunaparktaki Hız Treni (Roller Coaster)",
    subtitle: "Mühendisliğin ve enerji dönüşümünün nefes kesen gösterisi",
    html: `
      <div class="slide-body grid-2-col">
        <div class="roller-card">
          <h4>Hız Treninde Enerji Aşamaları:</h4>
          <ol class="rc-list">
            <li><strong>1. Tepeye Çıkış:</strong> Motor treni en yüksek tepeye çeker. Dev bir <em>çekim potansiyel enerjisi</em> depolanır.</li>
            <li><strong>İlk Çılgın İniş:</strong> Tren aşağı daldıkça potansiyel enerji devasa bir <em>kinetik enerjiye</em> dönüşür, hız tavan yapar!</li>
            <li><strong>Loop (Döngü) ve 2. Tepe:</strong> Tekrar yukarı çıkarken hız azalır, potansiyel enerji artar.</li>
          </ol>
        </div>

        <div class="why-card">
          <div class="why-icon"><i class="fa-solid fa-circle-question"></i></div>
          <h4>Neden Sonraki Tepeler İlkinden Hep Daha Alçaktır?</h4>
          <p>Çünkü raylardaki sürtünme ve hava direnci nedeniyle enerjinin bir kısmı <strong>ısı ve ses enerjisine</strong> dönüşür. Kaybolan mekanik enerji yüzünden tren ilk tepe kadar yükseğe çıkamaz!</p>
        </div>
      </div>
    `
  },

  // 37. MODEL 5: OK VE YAY
  {
    num: 37,
    kicker: "ENERJİ DÖNÜŞÜM MODELİ 5",
    title: "Ok ve Yayda Enerji Dönüşümü",
    subtitle: "Esneklik Potansiyel Enerjisi $\\rightarrow$ Kinetik Enerji",
    html: `
      <div class="slide-body grid-3-cards">
        <div class="arrow-step">
          <span class="as-num">1</span>
          <h4>Kiriş Gerilir</h4>
          <p>Okçu kol kası kuvvetiyle yayı geriye doğru çeker. Kirişte <strong>Esneklik Potansiyel Enerjisi</strong> depolanır.</p>
        </div>
        <div class="arrow-step highlight">
          <span class="as-num">2</span>
          <h4>Kiriş Serbest Bırakılır</h4>
          <p>Okçu parmaklarını açtığı an depolanan esneklik enerjisi oka aktarılır ve anında <strong>Kinetik Enerjiye</strong> dönüşür!</p>
        </div>
        <div class="arrow-step">
          <span class="as-num">3</span>
          <h4>Hedefe Uçar</h4>
          <p>Ok havada büyük bir süratle (kinetik enerji) hedefe doğru ilerler ve hedefe saplanır.</p>
        </div>
      </div>
    `
  },

  // 38. GİZLİ HIRSIZ: SÜRTÜNME KUVVETİ
  {
    num: 38,
    kicker: "ENERJİ KAYBI DEĞİL, DÖNÜŞÜMÜ",
    title: "Gizli Hırsız: Sürtünme Kuvveti ve Isıl Enerji",
    subtitle: "Salıncak neden bir süre sonra durur? Yoksa enerji yok mu oldu?!",
    html: `
      <div class="slide-body grid-2-col" style="align-items: center;">
        <div class="fric-card">
          <h3>HAYIR, ENERJİ ASLA YOK OLMADI!</h3>
          <p>Salıncağın menteşelerindeki sürtünme ve havanın sürtünme kuvveti (hava direnci) mekanik enerjiyi azar azar <strong>ISIL VE SES ENERJİSİNE</strong> dönüştürmüştür.</p>
          <div class="fric-formula">Mekanik Enerji $\\xrightarrow{\\text{Sürtünme}}$ Isıl Enerji + Ses Enerjisi</div>
        </div>

        <div class="hands-card">
          <div class="hc-icon"><i class="fa-solid fa-hands"></i></div>
          <h4>Hemen Şimdi Test Et!</h4>
          <p>Ellerini birbirine 10 saniye boyunca hızlıca sürt. Avuçlarının ısındığını hissedeceksin! Kolunun hareket enerjisi (kinetik), sürtünme sayesinde ısı enerjisine dönüşmüştür.</p>
        </div>
      </div>
    `
  },

  // 39. SÜRTÜNMELİ VS SÜRTÜNMESİZ ORTAM
  {
    num: 39,
    kicker: "BİLİMSEL KARŞILAŞTIRMA",
    title: "Sürtünmeli ve Sürtünmesiz Ortam Karşılaştırması",
    subtitle: "Mekanik enerjinin korunduğu ve korunmadığı durumlar",
    html: `
      <div class="slide-body grid-2-col">
        <div class="env-card ideal">
          <span class="env-badge">SÜRTÜNMESİZ (İDEAL) ORTAM</span>
          <div class="env-formula">E<sub>Mekanik</sub> = E<sub>k</sub> + E<sub>p</sub> = <strong>SABİTTİR</strong></div>
          <p>Mekanik enerji tamamen korunur. Salıncak veya top sonsuza kadar hareketine devam eder.</p>
        </div>

        <div class="env-card real">
          <span class="env-badge">SÜRTÜNMELİ (GERÇEK) ORTAM</span>
          <div class="env-formula">E<sub>İlk Mekanik</sub> = E<sub>Son Mekanik</sub> + <strong>E<sub>Isı</sub></strong></div>
          <p>Toplam enerji yine korunur! Ancak mekanik enerji ısıya dönüştüğü için cisim zamanla yavaşlar ve durur.</p>
        </div>
      </div>
    `
  },

  // 40. DENEY: PÜRÜZLÜ VS PÜRÜZSÜZ ZEMİN
  {
    num: 40,
    kicker: "DENEY KÖŞESİ",
    title: "Pürüzlü ve Pürüzsüz Rampada Oyuncak Araba",
    subtitle: "Sürtünmenin kinetik enerji üzerindeki etkisini gözlemleyelim",
    html: `
      <div class="slide-body grid-2-col">
        <div class="exp-compare-box">
          <h4>ZEMİN A: CAM / BUZ YÜZEY</h4>
          <div class="surface-badge low-fric">Çok Az Sürtünme</div>
          <p>Araba rampadan indikten sonra metrelerce uzağa gider. Kinetik enerji çok yavaş ısıya dönüşür.</p>
        </div>

        <div class="exp-compare-box">
          <h4>ZEMİN B: HALI / ZIMPARA YÜZEY</h4>
          <div class="surface-badge high-fric">Yüksek Sürtünme</div>
          <p>Araba rampadan iner inmez çabucak durur. Kinetik enerji hızla sürtünmeyle ısı enerjisine dönüşür.</p>
        </div>
      </div>
      <div class="bottom-callout"><i class="fa-solid fa-car-crash"></i> <strong>GÜNLÜK ÇIKARIM:</strong> Kışın araba lastiklerine zincir takılması veya kış lastiği kullanılması sürtünmeyi artırarak fren enerjisini yola aktarır.</div>
    `
  },

  // 41. BÜYÜK POSTER: ENERJİ DÖNÜŞÜM DÖNGÜSÜ
  {
    num: 41,
    kicker: "3. BÖLÜMÜN BÜYÜK POSTERİ",
    title: "Evrende Enerjinin Büyük Dönüşüm Çemberi",
    subtitle: "Güneş'ten besinlere, kaslarımızdan hareket ve ısıya enerjinin devasa döngüsü",
    html: `
      <div class="slide-body">
        <div class="poster-flow">
          <div class="flow-step">
            <i class="fa-solid fa-sun text-amber"></i>
            <strong>Güneş Işığı</strong>
            <small>Işık & Isı Enerjisi</small>
          </div>
          <span class="flow-arr">➔</span>
          <div class="flow-step">
            <i class="fa-solid fa-seedling text-emerald"></i>
            <strong>Bitkiler (Fotosentez)</strong>
            <small>Kimyasal Enerji</small>
          </div>
          <span class="flow-arr">➔</span>
          <div class="flow-step">
            <i class="fa-solid fa-apple-whole text-red"></i>
            <strong>Beslenme & Kas Gücü</strong>
            <small>Biyolojik Enerji</small>
          </div>
          <span class="flow-arr">➔</span>
          <div class="flow-step">
            <i class="fa-solid fa-person-running text-blue"></i>
            <strong>Koşma & İtme</strong>
            <small>Kinetik Enerji & İş</small>
          </div>
          <span class="flow-arr">➔</span>
          <div class="flow-step">
            <i class="fa-solid fa-fire text-orange"></i>
            <strong>Sürtünme & Terleme</strong>
            <small>Isıl Enerji</small>
          </div>
        </div>
      </div>
    `
  },

  // 42. AKILLI TAHTA SORUSU 1
  {
    num: 42,
    kicker: "AKILLI TAHTA PEKİŞTİRME SORUSU 1",
    title: "İş Var mı, Yok mu? (Akıllı Tahtada Cevapla)",
    subtitle: "Aşağıdaki senaryoyu inceleyiniz ve doğru seçeneği işaretleyiniz",
    html: `
      <div class="slide-body grid-2-col">
        <div class="quiz-question-box">
          <div class="qq-badge">SORU 1</div>
          <p class="qq-text">Fen bilimleri öğretmeni sınıfta şu olayı canlandırıyor:<br><br>
          <em>"Mert, $30\text{ N}$ ağırlığındaki okul çantasını yerden sırtına alarak kaldırıyor. Ardından çantayı sırtında sabit tutarak yatay okul koridorunda $10\text{ metre}$ boyunca düz yürüyüp duruyor."</em><br><br>
          Buna göre Mert'in çantaya uyguladığı taşıma kuvvetinin yaptığı iş ile ilgili hangisi doğrudur?</p>
        </div>

        <div class="quiz-options-group">
          <div class="quiz-opt" onclick="answerQuiz(this, false, 'Yerdeyken yukarı kaldırma sırasında kuvvet ve hareket aynı doğrultudadır; iş yapılmıştır.')">
            <span class="opt-key">A</span>
            <span class="opt-desc">Mert hem kaldırırken hem yürürken iş yapmamıştır.</span>
            <div class="quiz-feedback"></div>
          </div>
          <div class="quiz-opt" onclick="answerQuiz(this, true, 'TEBRİKLER! Kaldırırken yukarı hareket olduğu için İŞ VARDIR. Düz yürürken kuvvet yukarı, hareket yatay olduğu için taşıma kuvveti İŞ YAPMAZ!')">
            <span class="opt-key">B</span>
            <span class="opt-desc">Mert çantayı kaldırırken iş yapmıştır, düz yolda yürürken iş yapmamıştır.</span>
            <div class="quiz-feedback"></div>
          </div>
          <div class="quiz-opt" onclick="answerQuiz(this, false, 'Düz yolda taşırken kuvvet (yukarı) ile hareket (yatay) diktir; iş sıfırdır.')">
            <span class="opt-key">C</span>
            <span class="opt-desc">Mert hem kaldırırken hem düz yolda yürürken iş yapmıştır.</span>
            <div class="quiz-feedback"></div>
          </div>
          <div class="quiz-opt" onclick="answerQuiz(this, false, 'Kaldırırken yer çekimine karşı kesinlikle iş yapılır.')">
            <span class="opt-key">D</span>
            <span class="opt-desc">Mert sadece düz yolda yürürken iş yapmıştır.</span>
            <div class="quiz-feedback"></div>
          </div>
        </div>
      </div>
    `
  },

  // 43. SORU 1 ÇÖZÜM
  {
    num: 43,
    kicker: "PEDAGOJİK ÇÖZÜM & ANALİZ",
    title: "1. Sorunun Ayrıntılı Çözüm Analizi",
    subtitle: "Neden Doğru Cevap B Seçeneğidir?",
    html: `
      <div class="slide-body grid-2-col">
        <div class="sol-card sol-good">
          <h4>1. Aşama: Kaldırma Anı</h4>
          <p>Kuvvet yönü: <strong>YUKARI ↑</strong><br>Yer değiştirme yönü: <strong>YUKARI ↑</strong></p>
          <div class="sol-res">İŞ VARDIR ✅ (Kuvvet yer çekimine karşı yer değiştirtti)</div>
        </div>

        <div class="sol-card sol-warn">
          <h4>2. Aşama: Düz Yolda Yürüme</h4>
          <p>Taşıma kuvveti: <strong>YUKARI ↑</strong><br>Yer değiştirme yönü: <strong>YATAY →</strong></p>
          <div class="sol-res">İŞ YOKTUR ❌ (Kuvvet ile yer değiştirme birbirine diktir, 90°)</div>
        </div>
      </div>
      <div class="bottom-callout"><i class="fa-solid fa-award"></i> <strong>DOĞRU CEVAP: B SEÇENEĞİDİR.</strong> Öğrencilerin en sık yaptığı hata düz yolda yoruldukları için iş yapıldığını sanmalarıdır.</div>
    `
  },

  // 44. AKILLI TAHTA SORUSU 2 (LGS TARZI)
  {
    num: 44,
    kicker: "LGS TARZI YENİ NESİL SORU",
    title: "Hız Treninin Enerji Dönüşümü (Grafik Analizi)",
    subtitle: "Grafiği oku, bilimsel çıkarım yap ve doğru şıkkı işaretle",
    html: `
      <div class="slide-body grid-2-col">
        <div class="quiz-question-box">
          <div class="qq-badge">LGS GRAFİK SORUSU</div>
          <p class="qq-text">Sürtünmelerin ihmal edildiği bir lunapark hız treni rayında ilerleyen vagon K noktasından serbest bırakılıyor ve L noktasından geçerek M noktasına ulaşıyor.<br><br>
          Tren L noktasındayken rayın en alt çukurunda, M noktasındayken ise bir tümseğin tepesindedir.<br><br>
          Buna göre vagonun L noktasındaki kinetik enerjisi ve mekanik enerjisi hakkında ne söylenebilir?</p>
        </div>

        <div class="quiz-options-group">
          <div class="quiz-opt" onclick="answerQuiz(this, true, 'HARİKA! L en dip nokta olduğu için potansiyel minimum, kinetik maksimumdur. Sürtünme ihmal edildiği için mekanik enerji K, L ve M noktalarında daima sabittir!')">
            <span class="opt-key">A</span>
            <span class="opt-desc">Kinetik enerjisi en büyüktür, mekanik enerjisi K noktasındakiyle eşittir.</span>
            <div class="quiz-feedback"></div>
          </div>
          <div class="quiz-opt" onclick="answerQuiz(this, false, 'Sürtünmesiz ortamda mekanik enerji hiçbir zaman artmaz veya azalmaz, korunur.')">
            <span class="opt-key">B</span>
            <span class="opt-desc">Kinetik enerjisi sıfırdır, mekanik enerjisi artmıştır.</span>
            <div class="quiz-feedback"></div>
          </div>
          <div class="quiz-opt" onclick="answerQuiz(this, false, 'L noktasında tren en hızlı durumdadır, kinetik enerji en büyüktür.')">
            <span class="opt-key">C</span>
            <span class="opt-desc">Potansiyel enerjisi en büyüktür, kinetik enerjisi azalmıştır.</span>
            <div class="quiz-feedback"></div>
          </div>
          <div class="quiz-opt" onclick="answerQuiz(this, false, 'Mekanik enerji sürtünmesiz ortamda daima sabit kalır.')">
            <span class="opt-key">D</span>
            <span class="opt-desc">Kinetik enerjisi en büyüktür, mekanik enerjisi azalmıştır.</span>
            <div class="quiz-feedback"></div>
          </div>
        </div>
      </div>
    `
  },

  // 45. SORU 2 ÇÖZÜM
  {
    num: 45,
    kicker: "LGS GRAFİK ANALİZİ",
    title: "2. Sorunun Bilimsel Çözümü",
    subtitle: "Mekanik enerjinin korunumu ve kinetik/potansiyel paylaşımı",
    html: `
      <div class="slide-body grid-3-cards">
        <div class="lgs-card">
          <h4>K Noktası (Tepe)</h4>
          <p>Yükseklik maksimum $\rightarrow$ <strong>$E_p$ Maksimum</strong>.<br>Hız sıfır $\rightarrow$ <strong>$E_k = 0$</strong>.<br>Mekanik Enerji $= E_p$</p>
        </div>
        <div class="lgs-card highlight">
          <h4>L Noktası (Çukur)</h4>
          <p>Yükseklik minimum $\rightarrow$ <strong>$E_p = 0$</strong>.<br>Hız maksimum $\rightarrow$ <strong>$E_k$ MAKSİMUM</strong>.<br>Mekanik Enerji $= E_k$ (Aynı değer!)</p>
        </div>
        <div class="lgs-card">
          <h4>M Noktası (2. Tepe)</h4>
          <p>Kısmi yükseklik ve kısmi hız.<br>Mekanik Enerji $= E_k + E_p$ (Yine eşit!)</p>
        </div>
      </div>
      <div class="bottom-callout"><i class="fa-solid fa-award"></i> <strong>DOĞRU CEVAP: A SEÇENEĞİDİR.</strong> Sürtünme yoksa Mekanik Enerji asla değişmez!</div>
    `
  },

  // 46. 6 ALTIN KURALDA ÜNİTE ÖZETİ
  {
    num: 46,
    kicker: "ÜNİTE FİNALİ",
    title: "6 Altın Kuralda Ünitenin Özeti",
    subtitle: "Sınavlara girmeden önce aklında tutman gereken 6 temel prensip",
    html: `
      <div class="slide-body grid-3-cards">
        <div class="gold-rule-card">
          <span class="gr-num">01</span>
          <h4>Fiziksel İş Şartı</h4>
          <p>Kuvvet olmalı ve cisim kuvvet doğrultusunda yol almalıdır ($W = F \cdot x$).</p>
        </div>
        <div class="gold-rule-card">
          <span class="gr-num">02</span>
          <h4>İşin Sıfır Olduğu Haller</h4>
          <p>Cisim hareket etmiyorsa ($x=0$) veya kuvvet yola dikse ($90^\circ$) İŞ SIFIRDIR.</p>
        </div>
        <div class="gold-rule-card">
          <span class="gr-num">03</span>
          <h4>Kinetik Enerji</h4>
          <p>Hareket eden cisimlerde bulunur. Kütle ve süratin karesiyle doğru orantılıdır.</p>
        </div>
        <div class="gold-rule-card">
          <span class="gr-num">04</span>
          <h4>Potansiyel Enerji</h4>
          <p>Çekim potansiyeli kütle ve yüksekliğe; esneklik enerjisi sıkışma miktarına bağlıdır.</p>
        </div>
        <div class="gold-rule-card">
          <span class="gr-num">05</span>
          <h4>Enerjinin Korunumu</h4>
          <p>Enerji asla yok olmaz; potansiyelden kinetiğe, kinetikten potansiyele veya ısıya dönüşür.</p>
        </div>
        <div class="gold-rule-card">
          <span class="gr-num">06</span>
          <h4>Sürtünmenin Etkisi</h4>
          <p>Sürtünme mekanik enerjiyi ısıl enerjiye çevirir; ancak toplam enerji daima korunur.</p>
        </div>
      </div>
    `
  },

  // 47. KENDİNİ DEĞERLENDİRME KARNESİ
  {
    num: 47,
    kicker: "ÖĞRENCİ ÖZ DEĞERLENDİRME",
    title: "Bugün Neler Öğrendim? (Kontrol Listesi)",
    subtitle: "Aşağıdaki hedefleri başardıysan bu üniteye tamamen hazırsın!",
    html: `
      <div class="slide-body">
        <div class="checklist-grid">
          <div class="check-item"><i class="fa-solid fa-square-check text-green"></i> <span>Fiziksel anlamda iş yapılan ve yapılmayan durumları ayırt edebiliyorum.</span></div>
          <div class="check-item"><i class="fa-solid fa-square-check text-green"></i> <span>Kuvvet ve yol bağıntısını ($W=F \cdot x$) kullanarak basit problemleri çözebiliyorum.</span></div>
          <div class="check-item"><i class="fa-solid fa-square-check text-green"></i> <span>Kinetik enerjinin kütle ve süratle nasıl değiştiğini açıklayabiliyorum.</span></div>
          <div class="check-item"><i class="fa-solid fa-square-check text-green"></i> <span>Çekim ve esneklik potansiyel enerjilerini örneklerle karşılaştırabiliyorum.</span></div>
          <div class="check-item"><i class="fa-solid fa-square-check text-green"></i> <span>Salıncak, top ve hız treninde enerji dönüşümlerini aşama aşama gösterebiliyorum.</span></div>
          <div class="check-item"><i class="fa-solid fa-square-check text-green"></i> <span>Sürtünme kuvvetinin mekanik enerjiyi ısıya dönüştürdüğünü kavradım.</span></div>
        </div>
      </div>
    `
  },

  // 48. KAPANIŞ & ROTAMIZ FEN
  {
    num: 48,
    kicker: "TEBRİKLER!",
    title: "ROTAMIZ FEN! ÜNİTE TAMAMLANDI",
    subtitle: "Rotalı Fenci ile Fen Bilimlerinde Başarının Doğru Rotası",
    html: `
      <div class="slide-body flex-center" style="flex-direction: column; text-align: center; gap: 20px;">
        <div class="closing-logo-box">
          <img src="../assets/logo.jpg" alt="Rotalı Fenci" class="closing-logo">
        </div>
        <h1 class="closing-title">ROTAMIZ FEN!</h1>
        <p class="closing-sub">7. Sınıf 2. Ünite: Kuvvet ve Enerjiyi Keşfedelim Sunumu Başarıyla Tamamlandı.</p>
        <div class="closing-links">
          <span class="cl-badge"><i class="fa-solid fa-globe"></i> rotalifenci.vercel.app</span>
          <span class="cl-badge"><i class="fa-brands fa-instagram"></i> @rotalifenci</span>
        </div>
        <div style="margin-top: 15px; display: flex; gap: 15px;">
          <button onclick="showSlide(1)" class="btn-hero-secondary"><i class="fa-solid fa-rotate-right"></i> Sunumu Baştan Başlat</button>
          <button onclick="window.print()" class="btn-hero-primary"><i class="fa-solid fa-print"></i> Sunumu Yazdır / PDF İndir</button>
        </div>
      </div>
    `
  }
];

// HTML Şablonunu Oluştur
function buildPresentationHtml() {
  const totalSlides = slides.length;

  let slidesHtml = "";
  let drawerItemsHtml = "";

  slides.forEach(s => {
    slidesHtml += `
    <!-- SLAYT ${s.num} -->
    <div class="slide-container ${s.num === 1 ? 'active' : ''}" id="slide-${s.num}">
      <div class="slide-header">
        <div class="slide-header-left">
          <span class="slide-kicker"><i class="fa-solid fa-atom"></i> ${s.kicker}</span>
          <h2 class="slide-title">${s.title}</h2>
          <div class="slide-subtitle">${s.subtitle}</div>
        </div>
        <div class="slide-header-right">
          <img src="../assets/logo.jpg" alt="Rotalı Fenci" class="slide-brand-logo">
        </div>
      </div>
      <div class="slide-main-content">
        ${s.html}
      </div>
      <div class="slide-footer">
        <span class="footer-brand"><i class="fa-brands fa-instagram"></i> @rotalifenci • Rotalı Fenci Dijital Eğitim Portalı</span>
        <span class="footer-counter">${String(s.num).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}</span>
      </div>
    </div>`;

    drawerItemsHtml += `
    <div class="drawer-card ${s.num === 1 ? 'current' : ''}" onclick="showSlide(${s.num}); toggleDrawer();">
      <span class="drawer-num">SLAYT ${String(s.num).padStart(2, '0')}</span>
      <div class="drawer-title">${s.title}</div>
      <div class="drawer-kicker">${s.kicker}</div>
    </div>`;
  });

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>7. Sınıf 2. Ünite: Kuvvet ve Enerjiyi Keşfedelim | Rotalı Fenci Sunumu</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Outfit:wght@600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    :root {
      --bg: #f8fafc;
      --surface: #ffffff;
      --primary: #1e3a8a;
      --accent-blue: #0284c7;
      --accent-green: #059669;
      --accent-red: #dc2626;
      --accent-amber: #d97706;
      --accent-purple: #7c3aed;
      --text: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --radius: 16px;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    body {
      background: #090d16;
      color: var(--text);
      overflow: hidden;
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
    }

    /* 16:9 Master Sahne Kapsayıcısı */
    #viewport-wrapper {
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    #presentation-stage {
      width: 1920px;
      height: 1080px;
      background: var(--bg);
      border-radius: 0;
      box-shadow: 0 25px 70px rgba(0, 0, 0, 0.7);
      transform-origin: center center;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    /* Üst İlerleme Çubuğu */
    #progress-track {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 6px;
      background: rgba(0, 0, 0, 0.08);
      z-index: 100;
    }

    #slide-progress-bar {
      height: 100%;
      width: 2.08%;
      background: linear-gradient(90deg, #2563eb, #06b6d4, #10b981);
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Slayt Kapsayıcısı */
    .slide-container {
      display: none;
      width: 100%;
      height: 100%;
      padding: 36px 60px 48px 60px;
      flex-direction: column;
      justify-content: space-between;
      animation: slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .slide-container.active {
      display: flex;
    }

    @keyframes slideIn {
      from { opacity: 0; transform: scale(0.985) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    /* Slayt Başlık Alanı */
    .slide-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid var(--border);
      padding-bottom: 14px;
      margin-bottom: 18px;
    }

    .slide-header-left {
      flex: 1;
    }

    .slide-kicker {
      font-size: 14px;
      font-weight: 800;
      color: var(--accent-blue);
      text-transform: uppercase;
      letter-spacing: 1.5px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }

    .slide-title {
      font-size: 40px;
      font-weight: 900;
      line-height: 1.15;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #0284c7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .slide-subtitle {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .slide-header-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .slide-brand-logo {
      width: 58px;
      height: 58px;
      border-radius: 14px;
      border: 2px solid rgba(220, 38, 38, 0.4);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      object-fit: cover;
    }

    /* Slayt Gövdesi */
    .slide-main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow: hidden;
    }

    /* Slayt Alt Bilgisi */
    .slide-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1.5px solid var(--border);
      padding-top: 12px;
      margin-top: 14px;
      font-size: 14px;
      font-weight: 700;
      color: var(--text-muted);
    }

    .footer-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #b91c1c;
      font-weight: 800;
    }

    .footer-counter {
      background: #e2e8f0;
      color: #1e293b;
      padding: 4px 14px;
      border-radius: 20px;
      font-weight: 900;
      font-size: 13px;
    }

    /* Grid Şablonları */
    .grid-2-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 36px;
      height: 100%;
    }

    .grid-3-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 28px;
      height: 100%;
    }

    .grid-4-cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 22px;
      height: 100%;
    }

    .flex-center {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Tipografi & Bileşenler */
    .badge-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 18px;
      background: #fee2e2;
      color: #b91c1c;
      border: 1.5px solid #f87171;
      border-radius: 50px;
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 1px;
      width: fit-content;
      margin-bottom: 12px;
    }

    .hero-title {
      font-size: 68px;
      font-weight: 900;
      line-height: 1.05;
      letter-spacing: -1.5px;
      color: #0f172a;
      margin-bottom: 14px;
    }

    .hero-title .accent-text {
      background: linear-gradient(135deg, #dc2626 0%, #ea580c 50%, #d97706 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-desc {
      font-size: 24px;
      font-weight: 600;
      color: #475569;
      line-height: 1.4;
      margin-bottom: 24px;
      max-width: 820px;
    }

    .hero-features {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
      margin-bottom: 30px;
    }

    .feat-pill {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      padding: 8px 18px;
      border-radius: 30px;
      font-size: 15px;
      font-weight: 700;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.04);
    }

    .feat-pill i {
      color: #10b981;
    }

    .hero-buttons {
      display: flex;
      gap: 16px;
    }

    .btn-hero-primary {
      height: 60px;
      padding: 0 34px;
      background: linear-gradient(135deg, #dc2626, #b91c1c);
      color: #ffffff;
      border: none;
      border-radius: 14px;
      font-size: 19px;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      box-shadow: 0 6px 18px rgba(220, 38, 38, 0.35);
      transition: all 0.2s;
    }

    .btn-hero-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 24px rgba(220, 38, 38, 0.45);
    }

    .btn-hero-secondary {
      height: 60px;
      padding: 0 28px;
      background: #ffffff;
      color: #1e293b;
      border: 2px solid #cbd5e1;
      border-radius: 14px;
      font-size: 18px;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-hero-secondary:hover {
      background: #f1f5f9;
      border-color: #94a3b8;
    }

    /* Kapak Kartı */
    .cover-card-container {
      width: 100%;
      max-width: 540px;
    }

    .cover-card {
      background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);
      color: #ffffff;
      border-radius: 28px;
      padding: 44px 38px;
      box-shadow: 0 25px 60px rgba(15, 23, 42, 0.4);
      border: 3px solid rgba(255, 255, 255, 0.15);
      text-align: center;
    }

    .cover-icon-circle {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      color: #0f172a;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 42px;
      margin: 0 auto 20px auto;
      box-shadow: 0 10px 25px rgba(245, 158, 11, 0.4);
    }

    .cover-card h3 {
      font-size: 32px;
      font-weight: 900;
      margin-bottom: 12px;
      letter-spacing: 0.5px;
    }

    .cover-card p {
      font-size: 18px;
      color: #cbd5e1;
      line-height: 1.5;
      margin-bottom: 24px;
    }

    .cover-badge {
      display: inline-block;
      background: rgba(239, 68, 68, 0.3);
      border: 1.5px solid #ef4444;
      padding: 6px 18px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 900;
      letter-spacing: 1.5px;
      color: #fecaca;
    }

    /* Bilgi ve Karşılaştırma Kartları */
    .info-card {
      background: #ffffff;
      border-radius: 20px;
      padding: 32px 28px;
      border: 2px solid var(--border);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .info-card.border-blue { border-top: 8px solid #2563eb; }
    .info-card.border-emerald { border-top: 8px solid #10b981; }
    .info-card.border-purple { border-top: 8px solid #8b5cf6; }

    .card-num {
      font-size: 44px;
      font-weight: 900;
      color: #cbd5e1;
      line-height: 1;
      margin-bottom: 10px;
    }

    .card-icon {
      font-size: 36px;
      margin-bottom: 14px;
      color: var(--primary);
    }

    .info-card h3 {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 10px;
    }

    .info-card p {
      font-size: 16.5px;
      color: #475569;
      line-height: 1.55;
    }

    .bottom-callout {
      background: #eff6ff;
      border: 1.5px solid #bfdbfe;
      border-radius: 12px;
      padding: 12px 20px;
      margin-top: 16px;
      font-size: 16px;
      color: #1e3a8a;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    /* Tablolar */
    .life-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      border: 1.5px solid #cbd5e1;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
      font-size: 14.5px;
    }

    .life-table th {
      background: #0f172a;
      color: #ffffff;
      font-weight: 800;
      padding: 12px 14px;
      text-align: left;
      font-size: 14px;
      letter-spacing: 0.5px;
    }

    .life-table td {
      padding: 9px 14px;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
      font-weight: 600;
    }

    .life-table tr:last-child td {
      border-bottom: none;
    }

    .life-table tr:nth-child(even) td {
      background: #f8fafc;
    }

    .pill-yes {
      background: #dcfce7;
      color: #15803d;
      padding: 3px 10px;
      border-radius: 12px;
      font-weight: 800;
      font-size: 12.5px;
      display: inline-block;
    }

    .pill-no {
      background: #fee2e2;
      color: #b91c1c;
      padding: 3px 10px;
      border-radius: 12px;
      font-weight: 800;
      font-size: 12.5px;
      display: inline-block;
    }

    /* SVG Şemaları */
    .schema-svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    .visual-box, .visual-card {
      background: #ffffff;
      border: 2px solid #e2e8f0;
      border-radius: 16px;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 240px;
    }

    .compare-card {
      background: #ffffff;
      border-radius: 18px;
      padding: 22px;
      border: 2px solid #e2e8f0;
      box-shadow: 0 6px 20px rgba(0,0,0,0.05);
    }

    .compare-card.success-card { border-top: 6px solid #10b981; }
    .compare-card.danger-card { border-top: 6px solid #ef4444; }

    .compare-badge {
      display: inline-block;
      padding: 4px 14px;
      border-radius: 20px;
      font-weight: 900;
      font-size: 13px;
      color: #fff;
      margin-bottom: 10px;
    }
    .compare-badge.bg-green { background: #10b981; }
    .compare-badge.bg-red { background: #ef4444; }

    .compare-card h4 {
      font-size: 22px;
      font-weight: 800;
      margin: 12px 0 6px 0;
      color: #0f172a;
    }

    .compare-card p {
      font-size: 15.5px;
      color: #475569;
      line-height: 1.5;
    }

    /* Formül Kartı */
    .formula-card {
      background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);
      color: #ffffff;
      border-radius: 22px;
      padding: 34px;
      box-shadow: 0 15px 40px rgba(15, 23, 42, 0.35);
      border: 2px solid rgba(255, 255, 255, 0.15);
      text-align: center;
    }

    .formula-title {
      font-size: 14px;
      font-weight: 900;
      letter-spacing: 2px;
      color: #93c5fd;
      margin-bottom: 10px;
    }

    .formula-main {
      font-size: 58px;
      font-weight: 900;
      color: #fbbf24;
      letter-spacing: 2px;
      margin-bottom: 24px;
      text-shadow: 0 4px 15px rgba(251, 191, 36, 0.4);
    }

    .unit-breakdown {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }

    .unit-item {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .u-sym {
      font-size: 26px;
      font-weight: 900;
      color: #ffffff;
    }

    .u-name {
      font-size: 13px;
      color: #cbd5e1;
    }

    .u-unit {
      background: rgba(255, 255, 255, 0.15);
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 800;
      color: #a7f3d0;
    }

    .math-op {
      font-size: 26px;
      font-weight: 900;
      color: #93c5fd;
    }

    /* Kontrol Çubuğu (Sabit Alt Bar) */
    #bottom-control-bar {
      position: absolute;
      bottom: 14px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(15, 23, 42, 0.92);
      border: 1px solid rgba(255, 255, 255, 0.18);
      padding: 8px 16px;
      border-radius: 40px;
      backdrop-filter: blur(12px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      z-index: 999;
    }

    .nav-btn-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background: rgba(255, 255, 255, 0.12);
      color: #ffffff;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.18s;
    }

    .nav-btn-icon:hover {
      background: #dc2626;
      transform: scale(1.08);
    }

    .counter-badge-bar {
      color: #f8fafc;
      font-size: 14px;
      font-weight: 800;
      padding: 0 10px;
      min-width: 80px;
      text-align: center;
    }

    /* Çekmece (Drawer) */
    #drawer-modal {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(6px);
      z-index: 10000;
      display: none;
      align-items: center;
      justify-content: flex-end;
    }

    #drawer-modal.open {
      display: flex;
    }

    .drawer-panel {
      width: 460px;
      height: 100%;
      background: #0f172a;
      color: #ffffff;
      padding: 24px;
      overflow-y: auto;
      box-shadow: -10px 0 30px rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .drawer-card {
      background: #1e293b;
      border: 1.5px solid #334155;
      border-radius: 12px;
      padding: 12px 16px;
      cursor: pointer;
      transition: all 0.18s;
    }

    .drawer-card:hover {
      background: #334155;
      border-color: #38bdf8;
      transform: translateX(-4px);
    }

    .drawer-card.current {
      border-color: #ef4444;
      background: #450a0a;
    }

    .drawer-num {
      font-size: 11px;
      font-weight: 800;
      color: #94a3b8;
    }

    .drawer-title {
      font-size: 15px;
      font-weight: 800;
      margin: 2px 0;
      color: #f8fafc;
    }

    .drawer-kicker {
      font-size: 12px;
      color: #38bdf8;
    }

    /* İnteraktif Test Seçenekleri */
    .quiz-options-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 10px;
    }

    .quiz-opt {
      background: #ffffff;
      border: 2px solid #e2e8f0;
      border-radius: 14px;
      padding: 14px 18px;
      display: flex;
      align-items: center;
      gap: 14px;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }

    .quiz-opt:hover {
      border-color: #2563eb;
      background: #eff6ff;
    }

    .quiz-opt.correct {
      background: #ecfdf5 !important;
      border-color: #10b981 !important;
    }

    .quiz-opt.wrong {
      background: #fef2f2 !important;
      border-color: #ef4444 !important;
    }

    .opt-key {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #0f172a;
      color: #ffffff;
      font-weight: 900;
      font-size: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .quiz-opt.correct .opt-key { background: #10b981; }
    .quiz-opt.wrong .opt-key { background: #ef4444; }

    .opt-desc {
      font-size: 16px;
      font-weight: 700;
      color: #1e293b;
    }

    .quiz-feedback {
      position: absolute;
      bottom: -32px;
      left: 0;
      font-size: 13px;
      font-weight: 800;
      color: #15803d;
      display: none;
    }

    .quiz-opt.correct .quiz-feedback {
      display: block;
    }

    /* Yazdırma (@media print) */
    @page {
      size: 16in 9in landscape;
      margin: 0;
    }

    @media print {
      body {
        background: #ffffff !important;
        overflow: visible !important;
        width: auto !important;
        height: auto !important;
      }
      #viewport-wrapper {
        display: block !important;
        width: 100% !important;
        height: auto !important;
      }
      #presentation-stage {
        transform: none !important;
        width: 100% !important;
        height: auto !important;
        box-shadow: none !important;
      }
      #bottom-control-bar, #progress-track, #drawer-modal {
        display: none !important;
      }
      .slide-container {
        display: flex !important;
        page-break-after: always !important;
        break-after: page !important;
        height: 100vh !important;
        padding: 40px !important;
      }
    }
  </style>
</head>
<body>
  <div id="viewport-wrapper">
    <div id="presentation-stage">
      <!-- İlerleme Çubuğu -->
      <div id="progress-track"><div id="slide-progress-bar"></div></div>

      <!-- Slaytlar -->
      ${slidesHtml}

      <!-- Alt Kontrol Barı -->
      <div id="bottom-control-bar">
        <button onclick="prevSlide()" class="nav-btn-icon" title="Önceki Slayt (Sol Ok)"><i class="fa-solid fa-chevron-left"></i></button>
        <span class="counter-badge-bar" id="slide-counter-badge">01 / ${totalSlides}</span>
        <button onclick="nextSlide()" class="nav-btn-icon" title="Sonraki Slayt (Sağ Ok / Space)"><i class="fa-solid fa-chevron-right"></i></button>
        <span style="color:#64748b;">|</span>
        <button onclick="toggleDrawer()" class="nav-btn-icon" title="Slayt İndeksi"><i class="fa-solid fa-list-ol"></i></button>
        <button onclick="toggleSound()" class="nav-btn-icon" id="sound-btn" title="Ses Aç/Kapat"><i class="fa-solid fa-volume-high"></i></button>
        <button onclick="window.print()" class="nav-btn-icon" title="Yazdır / PDF Yap"><i class="fa-solid fa-print"></i></button>
        <button onclick="toggleFullscreen()" class="nav-btn-icon" title="Tam Ekran (F)"><i class="fa-solid fa-expand"></i></button>
      </div>

    </div>
  </div>

  <!-- Çekmece (Slayt Listesi Modalı) -->
  <div id="drawer-modal" onclick="if(event.target===this) toggleDrawer();">
    <div class="drawer-panel">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #334155; padding-bottom:12px; margin-bottom:8px;">
        <h3 style="font-size:18px; font-weight:900;"><i class="fa-solid fa-list-ol text-red-500"></i> ÜNİTE SLAYTLARI (48 Slayt)</h3>
        <button onclick="toggleDrawer()" style="background:none; border:none; color:#94a3b8; font-size:22px; cursor:pointer;">&times;</button>
      </div>
      ${drawerItemsHtml}
    </div>
  </div>

  <script>
    let currentSlide = 1;
    const totalSlides = ${totalSlides};
    let soundEnabled = true;
    let audioCtx = null;

    // 16:9 Ekran Boyutlandırma (Akıllı Tahta / Pardus Uyumlu)
    function scaleStage() {
      const stage = document.getElementById('presentation-stage');
      if (!stage) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scale = Math.min(vw / 1920, vh / 1080);
      stage.style.transform = "scale(" + scale + ")";
    }
    window.addEventListener('resize', scaleStage);
    window.addEventListener('DOMContentLoaded', () => {
      scaleStage();
      showSlide(1);
    });

    // Ses Sentezleyici
    function getAudioContext() {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      return audioCtx;
    }

    function playWhoosh() {
      if (!soundEnabled) return;
      try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(380, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.14);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.14);
      } catch (e) {}
    }

    function playChime(isCorrect) {
      if (!soundEnabled) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = isCorrect ? 'triangle' : 'sawtooth';
        osc.frequency.setValueAtTime(isCorrect ? 660 : 140, now);
        if (isCorrect) osc.frequency.setValueAtTime(880, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } catch (e) {}
    }

    function toggleSound() {
      soundEnabled = !soundEnabled;
      const btn = document.getElementById('sound-btn');
      if (btn) btn.innerHTML = soundEnabled ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark" style="color:#ef4444;"></i>';
    }

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
      if (badge) badge.innerText = String(n).padStart(2, '0') + ' / ' + String(totalSlides).padStart(2, '0');

      const progress = document.getElementById('slide-progress-bar');
      if (progress) progress.style.width = ((n / totalSlides) * 100) + '%';

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
      if (drawer) drawer.classList.toggle('open');
    }

    function answerQuiz(el, isCorrect, explanation) {
      const parent = el.closest('.quiz-options-group');
      if (parent.classList.contains('locked')) return;
      parent.classList.add('locked');

      playChime(isCorrect);
      el.classList.add(isCorrect ? 'correct' : 'wrong');

      const fb = el.querySelector('.quiz-feedback');
      if (fb) fb.innerText = explanation;
    }

    // Klavye Kısayolları (Sağ/Sol Ok, Space, F, M/D, ESC)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        prevSlide();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'm' || e.key === 'M' || e.key === 'd' || e.key === 'D') {
        toggleDrawer();
      } else if (e.key === 'Escape') {
        const drawer = document.getElementById('drawer-modal');
        if (drawer && drawer.classList.contains('open')) drawer.classList.remove('open');
      }
    });

    // Dokunmatik Swipe (Akıllı Tahta / Tablet)
    let touchStartX = 0;
    window.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});

    window.addEventListener('touchend', (e) => {
      const diffX = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diffX) > 60) {
        if (diffX < 0) nextSlide();
        else prevSlide();
      }
    }, {passive: true});
  </script>
</body>
</html>`;
}

// Dosyaları Kaydet
const presentationHtml = buildPresentationHtml();

const targets = [
  path.join(BASE_DIR, 'Web Sitem', 'sunumlar', '7-sinif-2-unite-kuvvet-ve-enerji.html'),
  path.join(BASE_DIR, 'sunumlar', '7-sinif-2-unite-kuvvet-ve-enerji.html')
];

targets.forEach(t => {
  const dir = path.dirname(t);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(t, presentationHtml, 'utf8');
  console.log('Saved presentation:', t);
});

// Materyaller Listesine (materials.json) Ekle
const newMaterial = {
  id: "mat-7-2-sunum-kuvvet-ve-enerji-3d",
  grade: "7",
  category: "ders-sunumu",
  targetSection: "2",
  title: "Kuvvet ve Enerjiyi Keşfedelim – 3D Akıllı Tahta Sunumu (48 Slayt)",
  unit: "2. Ünite: Kuvvet ve Enerjiyi Keşfedelim",
  desc: "Türkiye Yüzyılı Maarif Modeli uyumlu akıllı tahta sunumu. Fiziksel iş, kinetik enerji, çekim ve esneklik potansiyeli, enerji dönüşümleri, 20 günlük yaşam örneği ve LGS tarzı sorular.",
  fileName: "7-sinif-2-unite-kuvvet-ve-enerji.html",
  fileUrl: "sunumlar/7-sinif-2-unite-kuvvet-ve-enerji.html",
  imageUrl: "assets/test-kapak-7.svg",
  kapakResmi: "assets/test-kapak-7.svg",
  cover: "assets/test-kapak-7.svg",
  format: "İNTERAKTİF SUNUM",
  hasBlob: false,
  tags: [
    "7. sınıf",
    "2. ünite",
    "kuvvet ve enerji",
    "fiziksel iş",
    "kinetik enerji",
    "potansiyel enerji",
    "enerji dönüşümü",
    "maarif modeli",
    "akıllı tahta sunumu"
  ],
  visibility: "public",
  downloadCount: "🎬 48 Slayt",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const matPaths = [
  path.join(BASE_DIR, 'Web Sitem', 'data', 'materials.json'),
  path.join(BASE_DIR, 'data', 'materials.json')
];

matPaths.forEach(p => {
  if (fs.existsSync(p)) {
    const list = JSON.parse(fs.readFileSync(p, 'utf8'));
    const idx = list.findIndex(m => m.id === newMaterial.id || m.fileName === newMaterial.fileName);
    if (idx > -1) {
      list[idx] = newMaterial;
    } else {
      list.unshift(newMaterial);
    }
    fs.writeFileSync(p, JSON.stringify(list, null, 2), 'utf8');
    console.log('Updated materials.json in:', p);
  }
});
