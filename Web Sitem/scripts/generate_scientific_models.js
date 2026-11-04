const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, '../assets/science'),
  path.join(__dirname, '../../assets/science')
];

// Helper to write file to all target dirs
function saveAsset(fileName, content) {
  targetDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.writeFileSync(path.join(dir, fileName), content, 'utf8');
      console.log(`Saved ${fileName} to ${dir}`);
    }
  });
}

// 1. GÜNEŞ TUTULMASI MODELİ (1, 2, 3)
const svgGunesTutulmasi123 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 480" width="100%" height="100%" style="background: radial-gradient(circle at 30% 50%, #0c142b 0%, #030712 100%); font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;">
  <defs>
    <!-- Güneş Gradyanı -->
    <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fff8db" />
      <stop offset="25%" stop-color="#ffb703" />
      <stop offset="70%" stop-color="#fb8500" />
      <stop offset="100%" stop-color="#d62828" stop-opacity="0.9" />
    </radialGradient>
    <!-- Güneş Dış Işıma -->
    <radialGradient id="sunHalo" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffb703" stop-opacity="0.6" />
      <stop offset="50%" stop-color="#fb8500" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#fb8500" stop-opacity="0" />
    </radialGradient>
    <!-- Dünya Gradyanı -->
    <radialGradient id="earthGrad" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#64dfdf" />
      <stop offset="35%" stop-color="#2a9d8f" />
      <stop offset="65%" stop-color="#1d3557" />
      <stop offset="100%" stop-color="#0b1b33" />
    </radialGradient>
    <!-- Ay Gradyanı (Karanlık Yüzey) -->
    <radialGradient id="moonGrad" cx="30%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#ced4da" />
      <stop offset="30%" stop-color="#6c757d" />
      <stop offset="70%" stop-color="#343a40" />
      <stop offset="100%" stop-color="#11151a" />
    </radialGradient>
    <!-- Tam Gölge Konisi (Umbra) -->
    <linearGradient id="umbraGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.8" />
    </linearGradient>
    <!-- Yarı Gölge Konisi (Penumbra) -->
    <linearGradient id="penumbraGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3a0ca3" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#4361ee" stop-opacity="0.1" />
    </linearGradient>
  </defs>

  <!-- Yıldızlar Arka Planı -->
  <g fill="#ffffff" opacity="0.6">
    <circle cx="80" cy="60" r="1.5" /><circle cx="240" cy="40" r="1.2" /><circle cx="360" cy="80" r="1.8" />
    <circle cx="580" cy="70" r="1.5" /><circle cx="720" cy="50" r="2" /><circle cx="850" cy="80" r="1" />
    <circle cx="90" cy="410" r="2" /><circle cx="280" cy="430" r="1.5" /><circle cx="500" cy="420" r="1" />
    <circle cx="670" cy="440" r="1.8" /><circle cx="820" cy="410" r="1.3" />
  </g>

  <!-- BAŞLIK -->
  <rect x="250" y="20" width="400" height="38" rx="19" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5" opacity="0.9" />
  <text x="450" y="44" fill="#60a5fa" font-size="16" font-weight="700" text-anchor="middle" letter-spacing="1.5">GÜNEŞ TUTULMASI BİLİMSEL MODELİ</text>

  <!-- IŞIK IŞINLARI VE GÖLGE KONİLERİ -->
  <!-- Yarı Gölge Konisi (Güneş kenarlarından Ay kenarlarına) -->
  <polygon points="120,130 500,225 760,170 760,310 500,255 120,350" fill="url(#penumbraGrad)" />
  
  <!-- Tam Gölge Konisi (Umbra: Güneş tepe noktasından Ay tepesine, Güneş altından Ay altına Dünya üzerine konik odak) -->
  <polygon points="500,228 755,236 755,244 500,252" fill="url(#umbraGrad)" stroke="#ff0055" stroke-dasharray="3,3" stroke-width="0.8" />

  <!-- Ana Işık Işın Çizgileri -->
  <line x1="120" y1="130" x2="755" y2="236" stroke="#ffd166" stroke-width="1.2" stroke-opacity="0.5" stroke-dasharray="5,4" />
  <line x1="120" y1="350" x2="755" y2="244" stroke="#ffd166" stroke-width="1.2" stroke-opacity="0.5" stroke-dasharray="5,4" />
  <line x1="120" y1="130" x2="760" y2="310" stroke="#ffd166" stroke-width="1" stroke-opacity="0.3" stroke-dasharray="3,3" />
  <line x1="120" y1="350" x2="760" y2="170" stroke="#ffd166" stroke-width="1" stroke-opacity="0.3" stroke-dasharray="3,3" />

  <!-- 1. GÖK CİSMİ: GÜNEŞ -->
  <circle cx="120" cy="240" r="140" fill="url(#sunHalo)" />
  <circle cx="120" cy="240" r="110" fill="url(#sunGlow)" />
  <!-- Güneş Rozeti (1) -->
  <g transform="translate(120, 90)">
    <circle cx="0" cy="0" r="22" fill="#ef4444" stroke="#ffffff" stroke-width="3" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))" />
    <text x="0" y="8" fill="#ffffff" font-size="20" font-weight="900" text-anchor="middle">1</text>
  </g>
  <text x="120" y="380" fill="#fde047" font-size="16" font-weight="800" text-anchor="middle">1. Gök Cismi (Güneş)</text>
  <text x="120" y="402" fill="#94a3b8" font-size="13" text-anchor="middle">Doğal Işık Kaynağı</text>

  <!-- 2. GÖK CİSMİ: AY -->
  <circle cx="500" cy="240" r="16" fill="url(#moonGrad)" stroke="#475569" stroke-width="1" />
  <!-- Ay Gölge Vurgusu -->
  <path d="M 500,224 A 16,16 0 0,1 500,256 A 16,16 0 0,0 500,224" fill="#000000" opacity="0.8" />
  <!-- Ay Rozeti (2) -->
  <g transform="translate(500, 185)">
    <circle cx="0" cy="0" r="20" fill="#3b82f6" stroke="#ffffff" stroke-width="3" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))" />
    <text x="0" y="7" fill="#ffffff" font-size="18" font-weight="900" text-anchor="middle">2</text>
  </g>
  <text x="500" y="285" fill="#e2e8f0" font-size="15" font-weight="800" text-anchor="middle">2. Gök Cismi (Ay)</text>
  <text x="500" y="305" fill="#94a3b8" font-size="12" text-anchor="middle">Opak Cisim (Ortada)</text>

  <!-- 3. GÖK CİSMİ: DÜNYA -->
  <circle cx="760" cy="240" r="54" fill="url(#earthGrad)" stroke="#38bdf8" stroke-width="2" />
  <!-- Dünya Kıtaları Çizimi -->
  <path d="M 730,220 Q 745,210 755,225 Q 765,240 750,255 Q 735,250 730,220 Z" fill="#2d6a4f" opacity="0.8" />
  <path d="M 770,210 Q 785,225 780,245 Q 765,255 770,210 Z" fill="#2d6a4f" opacity="0.8" />
  <!-- Ay'ın Düşen Tam Gölge Noktası (Umbra Spot) -->
  <ellipse cx="738" cy="240" rx="4" ry="7" fill="#000000" stroke="#ef4444" stroke-width="1.5" />
  <line x1="738" y1="240" x2="680" y2="330" stroke="#ef4444" stroke-width="1.5" />
  <rect x="610" y="335" width="140" height="24" rx="6" fill="#ef4444" opacity="0.9" />
  <text x="680" y="351" fill="#ffffff" font-size="11" font-weight="700" text-anchor="middle">Tam Gölge (Tutulma Alanı)</text>

  <!-- Dünya Rozeti (3) -->
  <g transform="translate(760, 145)">
    <circle cx="0" cy="0" r="22" fill="#10b981" stroke="#ffffff" stroke-width="3" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))" />
    <text x="0" y="8" fill="#ffffff" font-size="20" font-weight="900" text-anchor="middle">3</text>
  </g>
  <text x="760" y="380" fill="#38bdf8" font-size="16" font-weight="800" text-anchor="middle">3. Gök Cismi (Dünya)</text>
  <text x="760" y="402" fill="#94a3b8" font-size="13" text-anchor="middle">Gözlemci Gezegen</text>

  <!-- Bilimsel Kural Kutusu -->
  <rect x="230" y="430" width="440" height="34" rx="8" fill="#0f172a" stroke="#475569" stroke-width="1" />
  <text x="450" y="452" fill="#cbd5e1" font-size="13" font-weight="600" text-anchor="middle">Sıralama: Güneş (1) ➔ Ay (2) ➔ Dünya (3) | Gündüz Gözlenir</text>
</svg>`;

// 2. AY TUTULMASI MODELİ (G, D, A)
const svgAyTutulmasiGDA = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 480" width="100%" height="100%" style="background: radial-gradient(circle at 30% 50%, #0c142b 0%, #030712 100%); font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;">
  <defs>
    <radialGradient id="sunGlowL" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fff8db" />
      <stop offset="25%" stop-color="#ffb703" />
      <stop offset="70%" stop-color="#fb8500" />
      <stop offset="100%" stop-color="#d62828" stop-opacity="0.9" />
    </radialGradient>
    <radialGradient id="sunHaloL" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffb703" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#fb8500" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="earthGradL" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#64dfdf" />
      <stop offset="35%" stop-color="#2a9d8f" />
      <stop offset="65%" stop-color="#1d3557" />
      <stop offset="100%" stop-color="#0b1b33" />
    </radialGradient>
    <!-- Kanlı Ay / Bakır Rengi Ay (Dünya Gölgesinde) -->
    <radialGradient id="bloodMoon" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#e07a5f" />
      <stop offset="40%" stop-color="#9d0208" />
      <stop offset="80%" stop-color="#6a040f" />
      <stop offset="100%" stop-color="#370617" />
    </radialGradient>
    <linearGradient id="earthShadow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#050814" stop-opacity="0.98" />
      <stop offset="100%" stop-color="#050814" stop-opacity="0.85" />
    </linearGradient>
    <linearGradient id="penumbraL" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2b2d42" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#4a4e69" stop-opacity="0.1" />
    </linearGradient>
  </defs>

  <g fill="#ffffff" opacity="0.6">
    <circle cx="90" cy="50" r="1.5" /><circle cx="270" cy="40" r="1.2" /><circle cx="410" cy="80" r="1.8" />
    <circle cx="620" cy="60" r="1.5" /><circle cx="780" cy="50" r="2" /><circle cx="870" cy="80" r="1" />
    <circle cx="100" cy="420" r="2" /><circle cx="310" cy="430" r="1.5" /><circle cx="560" cy="420" r="1" />
    <circle cx="710" cy="440" r="1.8" /><circle cx="840" cy="410" r="1.3" />
  </g>

  <!-- BAŞLIK -->
  <rect x="250" y="20" width="400" height="38" rx="19" fill="#1e293b" stroke="#a855f7" stroke-width="1.5" opacity="0.9" />
  <text x="450" y="44" fill="#c084fc" font-size="16" font-weight="700" text-anchor="middle" letter-spacing="1.5">AY TUTULMASI BİLİMSEL MODELİ</text>

  <!-- DÜNYA'NIN TAM VE YARI GÖLGE KONİSİ -->
  <polygon points="480,186 900,100 900,380 480,294" fill="url(#penumbraL)" />
  <polygon points="480,195 900,210 900,270 480,285" fill="url(#earthShadow)" stroke="#ef4444" stroke-dasharray="4,4" stroke-width="0.8" />

  <!-- IŞINLAR -->
  <line x1="120" y1="130" x2="480" y2="195" stroke="#ffd166" stroke-width="1.2" stroke-opacity="0.5" stroke-dasharray="5,4" />
  <line x1="120" y1="350" x2="480" y2="285" stroke="#ffd166" stroke-width="1.2" stroke-opacity="0.5" stroke-dasharray="5,4" />
  <line x1="120" y1="130" x2="900" y2="380" stroke="#ffd166" stroke-width="1" stroke-opacity="0.25" stroke-dasharray="3,3" />
  <line x1="120" y1="350" x2="900" y2="100" stroke="#ffd166" stroke-width="1" stroke-opacity="0.25" stroke-dasharray="3,3" />

  <!-- G: GÜNEŞ -->
  <circle cx="120" cy="240" r="140" fill="url(#sunHaloL)" />
  <circle cx="120" cy="240" r="110" fill="url(#sunGlowL)" />
  <g transform="translate(120, 90)">
    <circle cx="0" cy="0" r="22" fill="#ef4444" stroke="#ffffff" stroke-width="3" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))" />
    <text x="0" y="8" fill="#ffffff" font-size="20" font-weight="900" text-anchor="middle">G</text>
  </g>
  <text x="120" y="380" fill="#fde047" font-size="16" font-weight="800" text-anchor="middle">G (Güneş)</text>
  <text x="120" y="402" fill="#94a3b8" font-size="13" text-anchor="middle">Işık Kaynağı</text>

  <!-- D: DÜNYA -->
  <circle cx="480" cy="240" r="54" fill="url(#earthGradL)" stroke="#38bdf8" stroke-width="2" />
  <path d="M 450,220 Q 465,210 475,225 Q 485,240 470,255 Q 455,250 450,220 Z" fill="#2d6a4f" opacity="0.8" />
  <!-- Dünya Gece Tarafı Gölgesi -->
  <path d="M 480,186 A 54,54 0 0,1 480,294 Z" fill="#000000" opacity="0.6" />
  <g transform="translate(480, 145)">
    <circle cx="0" cy="0" r="22" fill="#10b981" stroke="#ffffff" stroke-width="3" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))" />
    <text x="0" y="8" fill="#ffffff" font-size="20" font-weight="900" text-anchor="middle">D</text>
  </g>
  <text x="480" y="380" fill="#38bdf8" font-size="16" font-weight="800" text-anchor="middle">D (Dünya)</text>
  <text x="480" y="402" fill="#94a3b8" font-size="13" text-anchor="middle">Ortada (Işığı Engeller)</text>

  <!-- A: AY (Dünya'nın Tam Gölgesinde) -->
  <circle cx="780" cy="240" r="18" fill="url(#bloodMoon)" stroke="#ef4444" stroke-width="1.5" />
  <g transform="translate(780, 180)">
    <circle cx="0" cy="0" r="20" fill="#a855f7" stroke="#ffffff" stroke-width="3" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))" />
    <text x="0" y="7" fill="#ffffff" font-size="18" font-weight="900" text-anchor="middle">A</text>
  </g>
  <text x="780" y="285" fill="#fca5a5" font-size="15" font-weight="800" text-anchor="middle">A (Ay)</text>
  <text x="780" y="305" fill="#94a3b8" font-size="12" text-anchor="middle">Tam Gölge İçinde (Kızıl Ay)</text>

  <!-- Bilimsel Kural Kutusu -->
  <rect x="210" y="430" width="480" height="34" rx="8" fill="#0f172a" stroke="#475569" stroke-width="1" />
  <text x="450" y="452" fill="#cbd5e1" font-size="13" font-weight="600" text-anchor="middle">Sıralama: Güneş (G) ➔ Dünya (D) ➔ Ay (A) | Dolunay Evresi &amp; Gece</text>
</svg>`;

// 3. AY TUTULMASI (X CİSMİ İLE)
const svgAyTutulmasiX = svgAyTutulmasiGDA
  .replace(/<text x="0" y="7" fill="#ffffff" font-size="18" font-weight="900" text-anchor="middle">A<\/text>/, '<text x="0" y="7" fill="#ffffff" font-size="18" font-weight="900" text-anchor="middle">X</text>')
  .replace(/A \(Ay\)/, 'X (Bilinmeyen Gök Cismi: Ay)');

// 4. GÜNEŞ TUTULMASI (Y CİSMİ İLE)
const svgGunesTutulmasiY = svgGunesTutulmasi123
  .replace(/<text x="0" y="7" fill="#ffffff" font-size="18" font-weight="900" text-anchor="middle">2<\/text>/, '<text x="0" y="7" fill="#ffffff" font-size="18" font-weight="900" text-anchor="middle">Y</text>')
  .replace(/2\. Gök Cismi \(Ay\)/, 'Y Gök Cismi (Ay)');

// 5. AY'IN YENİ AY EVRESİ (DÜNYA'DAN GÖRÜNÜM VE KONUM)
const svgYeniAyModeli = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 480" width="100%" height="100%" style="background: radial-gradient(circle at 50% 50%, #0d1b2a 0%, #030712 100%); font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;">
  <defs>
    <linearGradient id="sunRays" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffb703" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#ffd166" stop-opacity="0.1" />
    </linearGradient>
    <radialGradient id="earthSmall" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#64dfdf" />
      <stop offset="50%" stop-color="#1d3557" />
      <stop offset="100%" stop-color="#0b1b33" />
    </radialGradient>
  </defs>

  <rect x="250" y="20" width="400" height="38" rx="19" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" opacity="0.9" />
  <text x="450" y="44" fill="#38bdf8" font-size="16" font-weight="700" text-anchor="middle">AY'IN ANA EVRESİ: YENİ AY MODELİ</text>

  <!-- Güneş Işınları Okları (Sağdan Sola Geliyor) -->
  <g stroke="#f59e0b" stroke-width="2.5" fill="none">
    <line x1="880" y1="150" x2="720" y2="150" marker-end="url(#arrow)" />
    <line x1="880" y1="240" x2="720" y2="240" />
    <line x1="880" y1="330" x2="720" y2="330" />
    <polygon points="720,150 735,145 735,155" fill="#f59e0b" />
    <polygon points="720,240 735,235 735,245" fill="#f59e0b" />
    <polygon points="720,330 735,325 735,335" fill="#f59e0b" />
  </g>
  <text x="800" y="275" fill="#f59e0b" font-size="14" font-weight="700" text-anchor="middle">Güneş Işınları</text>

  <!-- Solda DÜNYA -->
  <circle cx="150" cy="240" r="50" fill="url(#earthSmall)" stroke="#38bdf8" stroke-width="2" />
  <text x="150" y="325" fill="#38bdf8" font-size="16" font-weight="800" text-anchor="middle">Dünya</text>
  <text x="150" y="345" fill="#94a3b8" font-size="12" text-anchor="middle">Gözlemci Konumu</text>

  <!-- Ortada AY'IN UZAYDAKİ KONUMU (Güneş ile Dünya Arasında) -->
  <g transform="translate(450, 240)">
    <!-- Aydınlık yarısı (Güneş'e bakan sağ taraf) -->
    <path d="M 0,-40 A 40,40 0 0,1 0,40 Z" fill="#ffd166" />
    <!-- Karanlık yarısı (Dünya'ya bakan sol taraf) -->
    <path d="M 0,-40 A 40,40 0 0,0 0,40 Z" fill="#1e293b" stroke="#475569" stroke-width="1.5" />
    <circle cx="0" cy="0" r="40" fill="none" stroke="#64748b" stroke-width="1.5" />
    <text x="0" y="70" fill="#e2e8f0" font-size="15" font-weight="800" text-anchor="middle">Ay (Uzaydaki Dizilimi)</text>
    <text x="0" y="90" fill="#94a3b8" font-size="12" text-anchor="middle">Dünya ile Güneş'in Arasında</text>
  </g>

  <!-- Bakış Açısı Çizgisi -->
  <line x1="205" y1="240" x2="400" y2="240" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4,4" />
  <polygon points="400,240 385,235 385,245" fill="#38bdf8" />
  <text x="300" y="225" fill="#38bdf8" font-size="12" text-anchor="middle">Dünya'dan Bakış ➔</text>

  <!-- SAĞDA AY'IN DÜNYA'DAN GÖRÜNÜMÜ KUTUSU -->
  <rect x="610" y="120" width="230" height="230" rx="16" fill="#0f172a" stroke="#475569" stroke-width="2" />
  <text x="725" y="150" fill="#f8fafc" font-size="14" font-weight="700" text-anchor="middle">Dünya'dan Görünüm</text>
  <!-- Tamamen Karanlık Daire (Yeni Ay) -->
  <circle cx="725" cy="225" r="50" fill="#020617" stroke="#475569" stroke-width="2.5" />
  <text x="725" y="305" fill="#cbd5e1" font-size="14" font-weight="700" text-anchor="middle">Yeni Ay Evresi</text>
  <text x="725" y="325" fill="#94a3b8" font-size="11" text-anchor="middle">(Görünmeyen Koyu Kısım: %100)</text>

  <!-- Alt Bilgi Notu -->
  <rect x="180" y="420" width="540" height="34" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1" />
  <text x="450" y="442" fill="#94a3b8" font-size="13" font-weight="600" text-anchor="middle">Yeni Ay: Ay Güneş ile Dünya arasındadır, aydınlık yüzü arkada kaldığından görünmez.</text>
</svg>`;

// 6. AY'IN BİRBİRİNİ TAKİP EDEN EVRELERİ (A ve B)
const svgAyEvreleriAB = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 480" width="100%" height="100%" style="background: radial-gradient(circle at 50% 50%, #0d1b2a 0%, #030712 100%); font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;">
  <rect x="230" y="20" width="440" height="38" rx="19" fill="#1e293b" stroke="#60a5fa" stroke-width="1.5" opacity="0.9" />
  <text x="450" y="44" fill="#93c5fd" font-size="16" font-weight="700" text-anchor="middle">AY'IN ARDIŞIK ANA EVRELERİ (A ve B)</text>

  <!-- PANEL A (İlk Dördün: Sağ Yarısı Aydınlık) -->
  <rect x="80" y="90" width="300" height="310" rx="16" fill="#0f172a" stroke="#3b82f6" stroke-width="2" />
  <circle cx="230" cy="190" r="60" fill="#020617" stroke="#475569" stroke-width="2" />
  <!-- Sağ yarısı aydınlık (D Şekli) -->
  <path d="M 230,130 A 60,60 0 0,1 230,250 Z" fill="#f8fafc" />
  <g transform="translate(230, 90)">
    <circle cx="0" cy="0" r="22" fill="#3b82f6" stroke="#ffffff" stroke-width="3" />
    <text x="0" y="8" fill="#ffffff" font-size="20" font-weight="900" text-anchor="middle">A</text>
  </g>
  <text x="230" y="295" fill="#60a5fa" font-size="18" font-weight="800" text-anchor="middle">A Evresi: İlk Dördün</text>
  <text x="230" y="325" fill="#94a3b8" font-size="13" text-anchor="middle">Sağ Yarısı Aydınlık (D Harfi)</text>
  <text x="230" y="355" fill="#cbd5e1" font-size="12" text-anchor="middle">Yarım Daire Şeklinde Görünür</text>

  <!-- GEÇİŞ OKU (ORTA) -->
  <g transform="translate(450, 240)">
    <line x1="-40" y1="0" x2="30" y2="0" stroke="#f59e0b" stroke-width="3" />
    <polygon points="40,0 25,-8 25,8" fill="#f59e0b" />
    <rect x="-60" y="-35" width="120" height="26" rx="6" fill="#f59e0b" />
    <text x="0" y="-18" fill="#000000" font-size="12" font-weight="800" text-anchor="middle">~ 7 GÜN</text>
    <text x="0" y="28" fill="#94a3b8" font-size="12" text-anchor="middle">(1 Hafta)</text>
  </g>

  <!-- PANEL B (Dolunay: Tamamı Aydınlık) -->
  <rect x="520" y="90" width="300" height="310" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2" />
  <!-- Tamamı Aydınlık Daire -->
  <circle cx="670" cy="190" r="60" fill="#fef08a" stroke="#facc15" stroke-width="3" />
  <!-- Hafif krater detayları -->
  <circle cx="650" cy="170" r="12" fill="#fde047" opacity="0.6" />
  <circle cx="690" cy="205" r="16" fill="#fde047" opacity="0.6" />
  <circle cx="660" cy="215" r="9" fill="#fde047" opacity="0.6" />
  <g transform="translate(670, 90)">
    <circle cx="0" cy="0" r="22" fill="#10b981" stroke="#ffffff" stroke-width="3" />
    <text x="0" y="8" fill="#ffffff" font-size="20" font-weight="900" text-anchor="middle">B</text>
  </g>
  <text x="670" y="295" fill="#34d399" font-size="18" font-weight="800" text-anchor="middle">B Evresi: Dolunay</text>
  <text x="670" y="325" fill="#94a3b8" font-size="13" text-anchor="middle">Tamamı Aydınlık Parlak Disk</text>
  <text x="670" y="355" fill="#cbd5e1" font-size="12" text-anchor="middle">Güneş Işığını Tam Olarak Yansıtır</text>

  <!-- Alt Bilgi Notu -->
  <rect x="180" y="425" width="540" height="34" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1" />
  <text x="450" y="447" fill="#cbd5e1" font-size="13" font-weight="600" text-anchor="middle">Ana evreler arasındaki geçiş süresi yaklaşık 1 haftadır (7 gün).</text>
</svg>`;

// 7. GÖK CİSİMLERİ X VE Y (GÜNEŞ VE AY)
const svgGokCisimleriXY = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 480" width="100%" height="100%" style="background: radial-gradient(circle at 50% 50%, #0d1b2a 0%, #030712 100%); font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;">
  <rect x="230" y="20" width="440" height="38" rx="19" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5" opacity="0.9" />
  <text x="450" y="44" fill="#fbbf24" font-size="16" font-weight="700" text-anchor="middle">X VE Y GÖK CİSİMLERİ MODELİ</text>

  <!-- X GÖK CİSMİ (GÜNEŞ) -->
  <rect x="90" y="90" width="320" height="320" rx="18" fill="#0f172a" stroke="#f59e0b" stroke-width="2" />
  <circle cx="250" cy="220" r="75" fill="#ffb703" filter="drop-shadow(0 0 25px rgba(251, 133, 0, 0.6))" />
  <g transform="translate(250, 90)">
    <circle cx="0" cy="0" r="24" fill="#ef4444" stroke="#ffffff" stroke-width="3" />
    <text x="0" y="9" fill="#ffffff" font-size="22" font-weight="900" text-anchor="middle">X</text>
  </g>
  <text x="250" y="325" fill="#fde047" font-size="18" font-weight="800" text-anchor="middle">X Gök Cismi</text>
  <text x="250" y="350" fill="#cbd5e1" font-size="13" text-anchor="middle">Sıcak Gaz Bulutu • Doğal Işık Kaynağı</text>
  <text x="250" y="375" fill="#94a3b8" font-size="12" text-anchor="middle">(Güneş)</text>

  <!-- Y GÖK CİSMİ (AY) -->
  <rect x="490" y="90" width="320" height="320" rx="18" fill="#0f172a" stroke="#94a3b8" stroke-width="2" />
  <circle cx="650" cy="220" r="50" fill="#94a3b8" stroke="#cbd5e1" stroke-width="2" />
  <circle cx="635" cy="205" r="9" fill="#64748b" opacity="0.7" />
  <circle cx="665" cy="235" r="12" fill="#64748b" opacity="0.7" />
  <g transform="translate(650, 90)">
    <circle cx="0" cy="0" r="24" fill="#3b82f6" stroke="#ffffff" stroke-width="3" />
    <text x="0" y="9" fill="#ffffff" font-size="22" font-weight="900" text-anchor="middle">Y</text>
  </g>
  <text x="650" y="325" fill="#e2e8f0" font-size="18" font-weight="800" text-anchor="middle">Y Gök Cismi</text>
  <text x="650" y="350" fill="#cbd5e1" font-size="13" text-anchor="middle">Soğuk ve Kayalık Yüzey • Kraterli Yapı</text>
  <text x="650" y="375" fill="#94a3b8" font-size="12" text-anchor="middle">(Ay)</text>
</svg>`;

// 8. JÜPİTER VE SATÜRN (GAZSAL DEVLER)
const svgJupiterSaturn = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 480" width="100%" height="100%" style="background: radial-gradient(circle at 50% 50%, #0d1b2a 0%, #030712 100%); font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;">
  <rect x="230" y="20" width="440" height="38" rx="19" fill="#1e293b" stroke="#eab308" stroke-width="1.5" opacity="0.9" />
  <text x="450" y="44" fill="#fde047" font-size="16" font-weight="700" text-anchor="middle">DIŞ GEZEGENLER: JÜPİTER VE SATÜRN</text>

  <!-- JÜPİTER -->
  <g transform="translate(250, 230)">
    <circle cx="0" cy="0" r="90" fill="#d97706" />
    <!-- Atmosfer Bantları -->
    <path d="M -85,-30 Q 0,-20 85,-30 L 85,-10 Q 0,0 -85,-10 Z" fill="#b45309" opacity="0.8" />
    <path d="M -90,10 Q 0,20 90,10 L 88,30 Q 0,40 -88,30 Z" fill="#92400e" opacity="0.85" />
    <!-- Büyük Kırmızı Leke -->
    <ellipse cx="40" cy="20" rx="20" ry="12" fill="#ef4444" opacity="0.9" stroke="#7f1d1d" stroke-width="1" />
    <text x="0" y="125" fill="#fde047" font-size="20" font-weight="800" text-anchor="middle">Jüpiter</text>
    <text x="0" y="148" fill="#94a3b8" font-size="13" text-anchor="middle">Güneş Sisteminin En Büyük Gezegeni</text>
  </g>

  <!-- SATÜRN -->
  <g transform="translate(650, 230)">
    <!-- Arka Halkalar -->
    <ellipse cx="0" cy="0" rx="140" ry="32" fill="none" stroke="#ca8a04" stroke-width="14" opacity="0.5" transform="rotate(-18)" />
    <circle cx="0" cy="0" r="65" fill="#eab308" />
    <!-- Ön Halkalar -->
    <path d="M -130,42 A 140,32 0 0,0 130,-42" fill="none" stroke="#fef08a" stroke-width="10" transform="rotate(-18)" />
    <text x="0" y="125" fill="#fde047" font-size="20" font-weight="800" text-anchor="middle">Satürn</text>
    <text x="0" y="148" fill="#94a3b8" font-size="13" text-anchor="middle">Görkemli Halka Sistemi ve Gazsal Yapı</text>
  </g>

  <!-- Ortak Özellikler Alt Şeridi -->
  <rect x="180" y="420" width="540" height="34" rx="8" fill="#0f172a" stroke="#475569" stroke-width="1" />
  <text x="450" y="442" fill="#cbd5e1" font-size="13" font-weight="600" text-anchor="middle">Ortak Özellik: Gazsal (Dış) Gezegenler • Karasal Yüzeyleri Yoktur • Çok Sayıda Uydu</text>
</svg>`;

// 9. AY EVRESİ HATALI ÇİZİM (Üstü Aydınlık, Altı Karanlık)
const svgAyHataliCizim = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 480" width="100%" height="100%" style="background: radial-gradient(circle at 50% 50%, #0d1b2a 0%, #030712 100%); font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;">
  <rect x="230" y="20" width="440" height="38" rx="19" fill="#1e293b" stroke="#f43f5e" stroke-width="1.5" opacity="0.9" />
  <text x="450" y="44" fill="#fda4af" font-size="16" font-weight="700" text-anchor="middle">MODEL: AY'IN YATAY BÖLÜNMÜŞ ÇİZİMİ</text>

  <g transform="translate(450, 220)">
    <!-- Daire Arka Planı -->
    <circle cx="0" cy="0" r="90" fill="#020617" stroke="#475569" stroke-width="2" />
    <!-- Üst Yarısı Aydınlık -->
    <path d="M -90,0 A 90,90 0 0,1 90,0 Z" fill="#f8fafc" />
    <!-- Yatay Ayırıcı Çizgi -->
    <line x1="-95" y1="0" x2="95" y2="0" stroke="#f43f5e" stroke-width="3" stroke-dasharray="6,4" />
    <circle cx="0" cy="0" r="90" fill="none" stroke="#94a3b8" stroke-width="2" />

    <text x="0" y="-40" fill="#0f172a" font-size="15" font-weight="800" text-anchor="middle">Aydınlık Üst Kısım</text>
    <text x="0" y="50" fill="#cbd5e1" font-size="15" font-weight="800" text-anchor="middle">Karanlık Alt Kısım</text>
  </g>

  <!-- Açıklama Kutusu -->
  <rect x="180" y="380" width="540" height="60" rx="10" fill="#0f172a" stroke="#f43f5e" stroke-width="1.5" />
  <text x="450" y="405" fill="#fda4af" font-size="14" font-weight="700" text-anchor="middle">Soru İnceleme Notu:</text>
  <text x="450" y="426" fill="#cbd5e1" font-size="13" text-anchor="middle">Ay Güneş'ten gelen ışığı yatay eksende alır; üst/alt şeklinde evre oluşamaz.</text>
</svg>`;

// Kaydet
saveAsset('gunes_tutulmasi_123.svg', svgGunesTutulmasi123);
saveAsset('ay_tutulmasi_gda.svg', svgAyTutulmasiGDA);
saveAsset('ay_tutulmasi_x.svg', svgAyTutulmasiX);
saveAsset('gunes_tutulmasi_y.svg', svgGunesTutulmasiY);
saveAsset('ay_yeni_ay_modeli.svg', svgYeniAyModeli);
saveAsset('ay_evreleri_a_ve_b.svg', svgAyEvreleriAB);
saveAsset('gok_cisimleri_x_y.svg', svgGokCisimleriXY);
saveAsset('jupiter_ve_saturn_gazsal_devler.svg', svgJupiterSaturn);
saveAsset('ay_hatali_alt_ust_aydinlanma.svg', svgAyHataliCizim);

console.log('✅ Bütün bilimsel SVG modelleri başarıyla oluşturuldu!');
