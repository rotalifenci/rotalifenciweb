/**
 * Rotalı Fenci - 16:9 Sinematik 3D Yaprak Test & Açık Uçlu Sınav Kapak Motoru
 * Her üretilen sınav için otomatik olarak sınıf, ünite, test numarası ve soru sayısını içeren
 * profesyonel 3D astronotlu ve Rotalı Fenci logolu kapak görseli üretir.
 */

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateTestCoverSvg({
  grade = "5",
  section = "1",
  unitName = "Güneş, Dünya ve Ay",
  testType = "YAPRAK TESTİ",
  testNumber = 1,
  questionCount = 10
}) {
  const g = String(grade).replace(/[^0-9]/g, '') || "5";
  const s = String(section).replace(/[^0-9]/g, '') || "1";
  const cleanUnitName = String(unitName || "Fen Bilimleri")
    .replace(/^[0-9]+\.\s*Ünite[:\s]*/i, '')
    .trim()
    .toLocaleUpperCase('tr-TR');

  let typeLabel = "YAPRAK TESTİ";
  if (String(testType).toUpperCase().includes("AÇIK UÇLU") || String(testType).toUpperCase().includes("KLASİK")) {
    typeLabel = "AÇIK UÇLU SINAV";
  } else if (String(testType).toUpperCase().includes("DENEME")) {
    typeLabel = "DENEME SINAVI";
  }

  const ribbonText = `${typeLabel}-${testNumber}`;
  const qCountText = `${questionCount} SORU`;

  // Benzersiz ID'ler için rastgele anahtar
  const uid = Math.random().toString(36).substring(2, 8);

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1280 720" width="1280" height="720">
  <defs>
    <!-- Uzay Arka Plan Degradeleri -->
    <radialGradient id="bgGrad_${uid}" cx="50%" cy="40%" r="75%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="35%" stop-color="#0f172a"/>
      <stop offset="70%" stop-color="#050814"/>
      <stop offset="100%" stop-color="#02040a"/>
    </radialGradient>

    <radialGradient id="nebulaPink_${uid}" cx="20%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#ec4899" stop-opacity="0.35"/>
      <stop offset="50%" stop-color="#8b5cf6" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#050814" stop-opacity="0"/>
    </radialGradient>

    <radialGradient id="nebulaCyan_${uid}" cx="80%" cy="60%" r="50%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.30"/>
      <stop offset="60%" stop-color="#3b82f6" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="#050814" stop-opacity="0"/>
    </radialGradient>

    <!-- 3D Güneş Parıltısı -->
    <radialGradient id="sunGrad_${uid}" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#fffbeb"/>
      <stop offset="20%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="80%" stop-color="#ea580c"/>
      <stop offset="100%" stop-color="#9a3412"/>
    </radialGradient>
    <radialGradient id="sunCorona_${uid}" cx="50%" cy="50%" r="50%">
      <stop offset="40%" stop-color="#fbbf24" stop-opacity="0.9"/>
      <stop offset="70%" stop-color="#f97316" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#ef4444" stop-opacity="0"/>
    </radialGradient>

    <!-- 3D Dünya Küresi -->
    <radialGradient id="earthGrad_${uid}" cx="45%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#67e8f9"/>
      <stop offset="25%" stop-color="#0284c7"/>
      <stop offset="60%" stop-color="#0369a1"/>
      <stop offset="85%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>

    <!-- 3D Ay Küresi -->
    <radialGradient id="moonGrad_${uid}" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="35%" stop-color="#cbd5e1"/>
      <stop offset="70%" stop-color="#64748b"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </radialGradient>

    <!-- Rozet Degradeleri -->
    <linearGradient id="cyanBadgeGrad_${uid}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>

    <linearGradient id="goldBadgeGrad_${uid}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fde047"/>
      <stop offset="50%" stop-color="#eab308"/>
      <stop offset="100%" stop-color="#ca8a04"/>
    </linearGradient>

    <linearGradient id="ribbonGrad_${uid}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7dd3fc"/>
      <stop offset="50%" stop-color="#bae6fd"/>
      <stop offset="100%" stop-color="#7dd3fc"/>
    </linearGradient>

    <!-- 3D Altın Yazı Degradeleri -->
    <linearGradient id="goldTextGrad_${uid}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="25%" stop-color="#fef08a"/>
      <stop offset="60%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>

    <!-- Filtreler: Parlama ve 3D Gölgeler -->
    <filter id="glow_${uid}" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
    <filter id="shadow3d_${uid}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
    <filter id="badgeShadow_${uid}">
      <feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#0284c7" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- 1. Uzay ve Kozmik Nebula Katmanı -->
  <rect width="1280" height="720" fill="url(#bgGrad_${uid})"/>
  <rect width="1280" height="720" fill="url(#nebulaPink_${uid})"/>
  <rect width="1280" height="720" fill="url(#nebulaCyan_${uid})"/>

  <!-- Yıldızlar ve Işıltılar -->
  <g fill="#ffffff" opacity="0.8">
    <circle cx="95" cy="120" r="1.5"/><circle cx="180" cy="80" r="2.5" opacity="0.9"/>
    <circle cx="260" cy="190" r="1.2"/><circle cx="340" cy="70" r="1.8"/>
    <circle cx="480" cy="110" r="2.2"/><circle cx="590" cy="60" r="1.5"/>
    <circle cx="720" cy="95" r="2"/><circle cx="850" cy="140" r="1.5"/>
    <circle cx="940" cy="75" r="2.5" opacity="0.9"/><circle cx="1060" cy="160" r="1.8"/>
    <circle cx="1180" cy="100" r="2.2"/><circle cx="1220" cy="220" r="1.5"/>
    <circle cx="70" cy="380" r="1.8"/><circle cx="140" cy="480" r="1.2"/>
    <circle cx="1120" cy="380" r="2"/><circle cx="1230" cy="450" r="2.4"/>
    <circle cx="1190" cy="600" r="1.5"/><circle cx="1040" cy="640" r="1.8"/>
    <circle cx="880" cy="680" r="1.2"/><circle cx="410" cy="660" r="1.5"/>
  </g>

  <!-- 4 Köşeli Parlayan Yıldızlar -->
  <g fill="#fef08a" opacity="0.85" filter="url(#glow_${uid})">
    <path d="M 940 75 Q 940 85 950 85 Q 940 85 940 95 Q 940 85 930 85 Q 940 85 940 75 Z"/>
    <path d="M 340 70 Q 340 78 348 78 Q 340 78 340 86 Q 340 78 332 78 Q 340 78 340 70 Z" transform="scale(0.8) translate(80, 20)"/>
    <path d="M 1180 280 Q 1180 290 1190 290 Q 1180 290 1180 300 Q 1180 290 1170 290 Q 1180 290 1180 280 Z"/>
    <path d="M 220 320 Q 220 328 228 328 Q 220 328 220 336 Q 220 328 212 328 Q 220 328 220 320 Z"/>
  </g>

  <!-- 2. Sol Üst: Büyüleyici 3D Parlayan Güneş -->
  <g>
    <circle cx="60" cy="60" r="280" fill="url(#sunCorona_${uid})"/>
    <circle cx="40" cy="40" r="210" fill="url(#sunCorona_${uid})" opacity="0.8"/>
    <circle cx="0" cy="0" r="190" fill="url(#sunGrad_${uid})" filter="url(#glow_${uid})"/>
    <!-- Güneş Granülleri / Flare Detayları -->
    <circle cx="30" cy="50" r="170" fill="none" stroke="#fef08a" stroke-width="3" stroke-dasharray="15 35 45 20" opacity="0.6"/>
    <circle cx="10" cy="20" r="185" fill="none" stroke="#fdba74" stroke-width="4" stroke-dasharray="40 60 20 50" opacity="0.7"/>
  </g>

  <!-- 3. Alt Orta: Büyüleyici Planet Dünya -->
  <g transform="translate(640, 780)">
    <!-- Atmosfer Parıltısı -->
    <ellipse cx="0" cy="0" rx="340" ry="240" fill="#38bdf8" opacity="0.35" filter="url(#glow_${uid})"/>
    <ellipse cx="0" cy="0" rx="325" ry="225" fill="#0284c7" opacity="0.4"/>
    <!-- Dünya Küresi -->
    <ellipse cx="0" cy="0" rx="310" ry="215" fill="url(#earthGrad_${uid})"/>
    <!-- Kıtalar / Karalar (Yeşil ve Altın detaylar) -->
    <path d="M -160 -110 Q -110 -150 -30 -130 Q 50 -120 120 -80 Q 90 -20 20 -40 Q -70 -30 -140 -70 Z" fill="#22c55e" opacity="0.85"/>
    <path d="M -80 -60 Q 10 -70 80 -30 Q 130 30 70 60 Q -10 50 -60 10 Z" fill="#eab308" opacity="0.8"/>
    <path d="M -220 -30 Q -180 -90 -120 -60 Q -130 10 -190 20 Z" fill="#15803d" opacity="0.8"/>
    <!-- Bulut Sarmalları -->
    <path d="M -260 -80 Q -140 -120 0 -90 Q 160 -60 270 -40" fill="none" stroke="#ffffff" stroke-width="12" opacity="0.65" stroke-linecap="round" filter="url(#glow_${uid})"/>
    <path d="M -180 20 Q -40 -10 110 30 Q 210 60 250 80" fill="none" stroke="#ffffff" stroke-width="8" opacity="0.55" stroke-linecap="round"/>
  </g>

  <!-- Yörünge Çizgileri -->
  <ellipse cx="640" cy="620" rx="480" ry="120" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="10 14" opacity="0.4"/>
  <ellipse cx="640" cy="620" rx="550" ry="140" fill="none" stroke="#818cf8" stroke-width="1.5" opacity="0.3"/>

  <!-- 4. Sağ Alt: Detaylı 3D Ay Küresi -->
  <g transform="translate(1080, 560)">
    <circle cx="0" cy="0" r="115" fill="#000000" opacity="0.4" filter="url(#shadow3d_${uid})"/>
    <circle cx="0" cy="0" r="110" fill="url(#moonGrad_${uid})"/>
    <!-- Kraterler -->
    <ellipse cx="-35" cy="-30" rx="22" ry="18" fill="#475569" opacity="0.6"/>
    <ellipse cx="-37" cy="-28" rx="19" ry="15" fill="#334155" opacity="0.8"/>
    <ellipse cx="25" cy="-45" rx="15" ry="12" fill="#475569" opacity="0.5"/>
    <ellipse cx="40" cy="20" rx="28" ry="24" fill="#334155" opacity="0.65"/>
    <ellipse cx="42" cy="22" rx="23" ry="19" fill="#1e293b" opacity="0.75"/>
    <ellipse cx="-20" cy="40" rx="18" ry="14" fill="#475569" opacity="0.55"/>
    <circle cx="2" cy="-10" r="9" fill="#64748b" opacity="0.6"/>
    <!-- Ay Atmosfer Kenar Işığı -->
    <circle cx="0" cy="0" r="110" fill="none" stroke="#e2e8f0" stroke-width="2.5" opacity="0.7"/>
  </g>

  <!-- Küçük Satürn (Sağ Kenar) -->
  <g transform="translate(1210, 640)">
    <ellipse cx="0" cy="0" rx="36" ry="10" fill="none" stroke="#fde047" stroke-width="3" opacity="0.7" transform="rotate(-20)"/>
    <circle cx="0" cy="0" r="18" fill="#ca8a04"/>
    <ellipse cx="0" cy="0" rx="36" ry="10" fill="none" stroke="#fef08a" stroke-width="1.5" opacity="0.9" stroke-dasharray="25 15" transform="rotate(-20)"/>
  </g>

  <!-- 5. Sol Alt: Sevimli 3D Astronot Karakteri -->
  <g transform="translate(110, 560)" filter="url(#shadow3d_${uid})">
    <!-- Karakter Görseli (Varsa embed / yoksa yüksek kaliteli vektör) -->
    <image href="assets/astronot-karakter-hd.png" xlink:href="assets/astronot-karakter-hd.png" x="-110" y="-220" width="280" height="350" preserveAspectRatio="xMidYMid meet" onerror="this.style.display='none'"/>
    <!-- Vektör Astronot Destek / Fallback -->
    <g id="vectorAstronaut_${uid}" opacity="0.95">
      <!-- Beden / Uzay Kıyafeti -->
      <ellipse cx="30" cy="40" rx="65" ry="70" fill="#f8fafc" stroke="#0284c7" stroke-width="4"/>
      <!-- Göğüs Arması -->
      <circle cx="30" cy="40" r="22" fill="#0284c7"/>
      <path d="M 18 40 L 42 40 M 30 28 L 30 52" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
      <!-- Sol Kol / El (Yukarı İşaret Eden) -->
      <path d="M 85 20 Q 120 -30 145 -70 Q 155 -60 140 -20 Q 125 10 95 35 Z" fill="#ffffff" stroke="#0284c7" stroke-width="4"/>
      <!-- Kask -->
      <circle cx="30" cy="-65" r="72" fill="#ffffff" stroke="#0284c7" stroke-width="5"/>
      <!-- Kask Camı / Vizör (Altın Yansımalı) -->
      <ellipse cx="34" cy="-60" rx="54" ry="46" fill="url(#goldBadgeGrad_${uid})" stroke="#0284c7" stroke-width="3"/>
      <ellipse cx="25" cy="-75" rx="35" ry="16" fill="#ffffff" opacity="0.65"/>
      <!-- Sevimli Gülümseyen Gözler (Vizör İçi) -->
      <ellipse cx="18" cy="-58" rx="7" ry="10" fill="#0f172a"/>
      <ellipse cx="50" cy="-58" rx="7" ry="10" fill="#0f172a"/>
      <circle cx="16" cy="-62" r="2.5" fill="#ffffff"/>
      <circle cx="48" cy="-62" r="2.5" fill="#ffffff"/>
      <path d="M 24 -42 Q 34 -34 44 -42" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
    </g>
  </g>

  <!-- 6. Sağ Üst: Rotalı Fenci Gemi Dümeni Logosu -->
  <g transform="translate(1120, 140)" filter="url(#shadow3d_${uid})">
    <image href="assets/rotali-logo-transparent.png" xlink:href="assets/rotali-logo-transparent.png" x="-105" y="-105" width="210" height="210" preserveAspectRatio="xMidYMid meet" onerror="this.style.display='none'"/>
    <!-- Vektör Dümen Fallback -->
    <g id="vectorHelm_${uid}" opacity="0.9">
      <circle cx="0" cy="0" r="76" fill="#ffffff" stroke="#854d0e" stroke-width="6"/>
      <circle cx="0" cy="0" r="66" fill="#991b1b" stroke="#ca8a04" stroke-width="4"/>
      <!-- Dümen Parmakları -->
      <rect x="-8" y="-95" width="16" height="190" rx="8" fill="#a16207"/>
      <rect x="-8" y="-95" width="16" height="190" rx="8" fill="#a16207" transform="rotate(45)"/>
      <rect x="-8" y="-95" width="16" height="190" rx="8" fill="#a16207" transform="rotate(90)"/>
      <rect x="-8" y="-95" width="16" height="190" rx="8" fill="#a16207" transform="rotate(135)"/>
      <circle cx="0" cy="0" r="54" fill="#ffffff"/>
      <text x="0" y="-30" fill="#dc2626" font-size="11" font-weight="900" font-family="'Plus Jakarta Sans', sans-serif" text-anchor="middle" letter-spacing="1">ROTALI FENCİ</text>
      <!-- Öğretmen İkonu -->
      <circle cx="0" cy="8" r="24" fill="#1e293b"/>
      <circle cx="0" cy="2" r="10" fill="#fde047"/>
      <ellipse cx="0" cy="26" rx="16" ry="10" fill="#38bdf8"/>
    </g>
  </g>

  <!-- 7. MERKEZ BAŞLIK VE 3D TİPOGRAFİ ALANI -->
  <g transform="translate(640, 140)" text-anchor="middle">
    <!-- Işıltı Işınları -->
    <path d="M -140 -20 L -180 -35 M -145 0 L -195 0 M -140 20 L -180 35" stroke="#fde047" stroke-width="7" stroke-linecap="round" filter="url(#glow_${uid})"/>
    <path d="M 140 -20 L 180 -35 M 145 0 L 195 0 M 140 20 L 180 35" stroke="#fde047" stroke-width="7" stroke-linecap="round" filter="url(#glow_${uid})"/>

    <!-- SINIF ROZETİ (Cyan Bubble Badge) -->
    <g filter="url(#badgeShadow_${uid})">
      <rect x="-140" y="-45" width="280" height="74" rx="37" fill="url(#cyanBadgeGrad_${uid})" stroke="#ffffff" stroke-width="4.5"/>
      <rect x="-132" y="-39" width="264" height="28" rx="14" fill="#ffffff" opacity="0.3"/>
      <text x="0" y="8" fill="#ffffff" font-size="42" font-weight="900" font-family="'Plus Jakarta Sans', Outfit, sans-serif" letter-spacing="0.5" filter="url(#shadow3d_${uid})">${g}. SINIF</text>
    </g>

    <!-- ÜNİTE ROZETİ (Golden Pill Badge) -->
    <g transform="translate(0, 72)" filter="url(#badgeShadow_${uid})">
      <rect x="-115" y="-22" width="230" height="52" rx="26" fill="url(#goldBadgeGrad_${uid})" stroke="#ffffff" stroke-width="3.5"/>
      <rect x="-108" y="-18" width="216" height="20" rx="10" fill="#ffffff" opacity="0.4"/>
      <text x="0" y="14" fill="#451a03" font-size="28" font-weight="900" font-family="'Plus Jakarta Sans', Outfit, sans-serif" letter-spacing="1">${s}. ÜNİTE</text>
    </g>

    <!-- ANA ÜNİTE BAŞLIĞI (3D Dev Altın Yazı) -->
    <g transform="translate(0, 185)">
      <!-- 3D Derinlik Katmanları (Mavi/Lacivert Gölgeler) -->
      <text x="0" y="8" fill="#0c4a6e" font-size="64" font-weight="900" font-family="'Plus Jakarta Sans', Outfit, sans-serif" stroke="#082f49" stroke-width="14" stroke-linejoin="round" letter-spacing="-0.5">${escapeXml(cleanUnitName)}</text>
      <text x="0" y="4" fill="#0284c7" font-size="64" font-weight="900" font-family="'Plus Jakarta Sans', Outfit, sans-serif" stroke="#0284c7" stroke-width="10" stroke-linejoin="round" letter-spacing="-0.5">${escapeXml(cleanUnitName)}</text>
      <!-- Altın Degrade Yüzey -->
      <text x="0" y="0" fill="url(#goldTextGrad_${uid})" font-size="64" font-weight="900" font-family="'Plus Jakarta Sans', Outfit, sans-serif" stroke="#ffffff" stroke-width="2.5" letter-spacing="-0.5">${escapeXml(cleanUnitName)}</text>
    </g>

    <!-- 8. TEST TÜRÜ VE NUMARASI ŞERİT ROZETİ (YAPRAK TESTİ-1 / AÇIK UÇLU SINAV-1) -->
    <g transform="translate(0, 275)" filter="url(#shadow3d_${uid})">
      <!-- Şerit Arkalığı (Ribbon) -->
      <path d="M -260 -28 L 260 -28 Q 285 5 260 38 L -260 38 Q -285 5 -260 -28 Z" fill="url(#ribbonGrad_${uid})" stroke="#ffffff" stroke-width="4"/>
      <!-- Şerit Dikiş Efekti -->
      <path d="M -245 -22 L 245 -22 Q 265 5 245 32 L -245 32 Q -265 5 -245 -22 Z" fill="none" stroke="#0284c7" stroke-width="2" stroke-dasharray="6 4" opacity="0.6"/>
      <!-- Şerit Metni -->
      <text x="0" y="16" fill="#0f172a" font-size="34" font-weight="900" font-family="'Plus Jakarta Sans', Outfit, sans-serif" letter-spacing="1">${ribbonText}</text>
    </g>

    <!-- 9. SORU SAYISI & MAARİF MODELİ BİLGİ ROZETİ -->
    <g transform="translate(0, 345)" filter="url(#shadow3d_${uid})">
      <rect x="-190" y="-18" width="380" height="38" rx="19" fill="#0f172a" fill-opacity="0.85" stroke="#38bdf8" stroke-width="2"/>
      <text x="0" y="7" fill="#f8fafc" font-size="16" font-weight="800" font-family="'Plus Jakarta Sans', sans-serif" letter-spacing="1">
        <tspan fill="#fde047">★</tspan> <tspan fill="#38bdf8" font-weight="900">${qCountText}</tspan> • MEB MAARİF MODELİ <tspan fill="#fde047">★</tspan>
      </text>
    </g>
  </g>
</svg>`;
}

module.exports = {
  generateTestCoverSvg
};
