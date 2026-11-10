const fs = require('fs');

const htmlPath = 'index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Update main sivasSvgMap
const oldSvgStart = html.indexOf('<svg id="sivasSvgMap"');
const oldSvgEnd = html.indexOf('</svg>', oldSvgStart) + 6;

const newSvg = `<svg id="sivasSvgMap" viewBox="0 0 1000 760" preserveAspectRatio="xMidYMid meet">
            <defs>
              <!-- Kartografik Zemin Gradyanı -->
              <linearGradient id="parchmentBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fdfbf5"/>
                <stop offset="35%" stop-color="#f7f0e1"/>
                <stop offset="70%" stop-color="#f4ecdc"/>
                <stop offset="100%" stop-color="#ede1cc"/>
              </linearGradient>

              <!-- Gölgelendirme ve Altın Işıma Filtreleri -->
              <filter id="mapShadow" x="-5%" y="-5%" width="110%" height="110%">
                <feDropShadow dx="1" dy="3" stdDeviation="4" flood-color="#3a2512" flood-opacity="0.25"/>
              </filter>
              <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComponentTransfer in="blur" result="glow">
                  <feFuncA type="linear" slope="1.8"/>
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode in="glow"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <!-- 1. Kartografik Antik Parşömen Zemin -->
            <rect width="1000" height="760" rx="14" fill="url(#parchmentBgGrad)" filter="url(#mapShadow)" />

            <!-- 2. Geleneksel Çerçeve ve Bordür Deseni -->
            <rect x="12" y="12" width="976" height="736" rx="10" fill="none" stroke="#d5b88c" stroke-width="2" stroke-dasharray="8 4" opacity="0.75" />
            <rect x="18" y="18" width="964" height="724" rx="8" fill="none" stroke="#b59463" stroke-width="1.2" opacity="0.6" />

            <!-- 3. Kartografik Pusula Gülü (Kuzey Oku) -->
            <g id="compassRose" transform="translate(920, 85)" opacity="0.85" pointer-events="none">
              <circle r="36" fill="rgba(255,255,255,0.6)" stroke="#b59463" stroke-width="1.2" />
              <circle r="33" fill="none" stroke="#d5b88c" stroke-width="0.8" stroke-dasharray="2 3" />
              <!-- 8 Uçlu Yıldız -->
              <polygon points="0,-32 4,-8 0,0 -4,-8" fill="#b45309" stroke="#78350f" stroke-width="0.8"/>
              <polygon points="0,32 4,8 0,0 -4,8" fill="#d97706" stroke="#78350f" stroke-width="0.8"/>
              <polygon points="-32,0 -8,-4 0,0 -8,4" fill="#d97706" stroke="#78350f" stroke-width="0.8"/>
              <polygon points="32,0 8,-4 0,0 8,4" fill="#b45309" stroke="#78350f" stroke-width="0.8"/>
              <polygon points="22,-22 6,-6 0,0 2,-8" fill="#f59e0b" opacity="0.7"/>
              <polygon points="-22,-22 -6,-6 0,0 -2,-8" fill="#f59e0b" opacity="0.7"/>
              <polygon points="22,22 6,6 0,0 2,8" fill="#f59e0b" opacity="0.7"/>
              <polygon points="-22,22 -6,6 0,0 -2,8" fill="#f59e0b" opacity="0.7"/>
              <!-- Yön Harfleri -->
              <text x="0" y="-36" text-anchor="middle" font-family="'Cinzel', serif" font-weight="900" font-size="12" fill="#78350f">K</text>
              <text x="0" y="46" text-anchor="middle" font-family="'Cinzel', serif" font-weight="700" font-size="10" fill="#78350f">G</text>
              <text x="44" y="4" text-anchor="middle" font-family="'Cinzel', serif" font-weight="700" font-size="10" fill="#78350f">D</text>
              <text x="-44" y="4" text-anchor="middle" font-family="'Cinzel', serif" font-weight="700" font-size="10" fill="#78350f">B</text>
            </g>

            <!-- 4. Kartografik Ölçek Çubuğu (0 - 80 km) -->
            <g id="scaleBar" transform="translate(45, 715)" opacity="0.85" pointer-events="none">
              <rect x="0" y="0" width="130" height="24" rx="4" fill="rgba(255,255,255,0.7)" stroke="#b59463" stroke-width="0.8" />
              <rect x="10" y="14" width="27" height="4" fill="#78350f" />
              <rect x="37" y="14" width="27" height="4" fill="#f59e0b" />
              <rect x="64" y="14" width="27" height="4" fill="#78350f" />
              <rect x="91" y="14" width="27" height="4" fill="#f59e0b" />
              <text x="10" y="10" font-size="8" font-family="'Inter', sans-serif" font-weight="700" fill="#78350f">0</text>
              <text x="64" y="10" font-size="8" font-family="'Inter', sans-serif" font-weight="700" fill="#78350f">40</text>
              <text x="118" y="10" font-size="8" font-family="'Inter', sans-serif" font-weight="700" fill="#78350f">80 km</text>
            </g>

            <!-- 5. Nehirler Grubu (Kızılırmak & Kelkit Vadileri) -->
            <g id="riversGroup" class="rivers-layer"></g>

            <!-- 6. 17 İlçe Gerçek Coğrafi SVG Sınırları Katmanı (100% Tıklanabilir) -->
            <g id="districtsGroup" class="districts-layer"></g>

            <!-- 7. Rota Çizgisi -->
            <path id="routePathLine" class="route-line-svg" d="" />

            <!-- 8. Eser Pinleri (Marker Layer) -->
            <g id="markersGroup" class="markers-layer"></g>

            <!-- 9. Tarihi Kent Meydanı Inset Alanı -->
            <g id="kentMeydaniInset" class="inset-layer" style="display: none;"></g>
          </svg>`;

html = html.substring(0, oldSvgStart) + newSvg + html.substring(oldSvgEnd);

// 2. Update pickerSvgMap in modalMapPicker
const oldPickerStart = html.indexOf('<svg id="pickerSvgMap"');
const oldPickerEnd = html.indexOf('</svg>', oldPickerStart) + 6;

const newPickerSvg = `<svg id="pickerSvgMap" viewBox="0 0 1000 760" preserveAspectRatio="xMidYMid meet">
          <rect width="1000" height="760" fill="#fbf5e8" stroke="#d5b88c" stroke-width="2" />
          <g id="pickerDistrictsGroup"></g>
          <g id="pickerPinMarker" style="display: none;">
            <circle class="pin-halo" r="22" fill="#f59e0b" opacity="0.4"></circle>
            <path d="M 0,-24 C -10,-24 -15,-16 -15,-9 C -15,4 0,20 0,20 C 0,20 15,4 15,-9 C 15,-16 10,-24 0,-24 Z" fill="#d97706" stroke="#ffffff" stroke-width="2"></path>
            <circle cx="0" cy="-9" r="5" fill="#ffffff"></circle>
            <circle cx="0" cy="-9" r="3" fill="#f59e0b"></circle>
            <rect x="-45" y="22" width="90" height="20" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="#f59e0b" stroke-width="1"></rect>
            <text x="0" y="36" text-anchor="middle" font-size="9" font-weight="700" fill="#ffffff">Seçilen Konum</text>
          </g>
        </svg>`;

html = html.substring(0, oldPickerStart) + newPickerSvg + html.substring(oldPickerEnd);

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('index.html SVG elements updated successfully.');
