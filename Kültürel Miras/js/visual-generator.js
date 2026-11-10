// MİRAS-3B: Yüksek Çözünürlüklü Vektörel Eser Görseli ve Mimari Plan Şeması Üreticisi
// TÜBİTAK 2204-B Tarih Projesi — Lazy-Loading ve Yan Yana Plan Karşılaştırma Desteği

(function () {
  function generateMonumentCardSVG(monument) {
    const cfg = monument.modelConfig || {};
    const stone = cfg.baseColor || "#d9ccb8";
    const brick = cfg.brickColor || "#a64832";
    const dome = cfg.domeColor || cfg.roofColor || "#4f5b66";
    const type = monument.modelTipi || "cami";

    let buildingMarkup = "";

    if (type === "cami") {
      const isStriped = cfg.baldachin === "striped";
      const isBaroque = cfg.baldachin === "baroque";
      const isMulti = cfg.baldachin === "multidome";
      buildingMarkup = `
        <!-- Minarets -->
        <rect x="72" y="42" width="14" height="125" fill="${stone}" stroke="#4a3f35" stroke-width="1.2"/>
        <polygon points="72,42 79,18 86,42" fill="${dome}"/>
        <rect x="69" y="72" width="20" height="5" rx="2" fill="#efe7d6"/>
        <rect x="69" y="102" width="20" height="5" rx="2" fill="#efe7d6"/>
        ${
          (cfg.minaretCount || 2) >= 2
            ? `<rect x="314" y="42" width="14" height="125" fill="${stone}" stroke="#4a3f35" stroke-width="1.2"/>
               <polygon points="314,42 321,18 328,42" fill="${dome}"/>
               <rect x="311" y="72" width="20" height="5" rx="2" fill="#efe7d6"/>
               <rect x="311" y="102" width="20" height="5" rx="2" fill="#efe7d6"/>`
            : ""
        }
        ${
          (cfg.minaretCount || 2) === 4
            ? `<rect x="102" y="34" width="13" height="133" fill="${stone}" stroke="#4a3f35" stroke-width="1.2"/>
               <polygon points="102,34 108.5,12 115,34" fill="${dome}"/>
               <rect x="285" y="34" width="13" height="133" fill="${stone}" stroke="#4a3f35" stroke-width="1.2"/>
               <polygon points="285,34 291.5,12 298,34" fill="${dome}"/>`
            : ""
        }
        <!-- Main Dome / Multi Domes -->
        ${
          isMulti
            ? `<path d="M115,108 A32,30 0 0,1 172,108 Z" fill="${dome}"/>
               <path d="M172,102 A34,32 0 0,1 228,102 Z" fill="${dome}"/>
               <path d="M228,108 A32,30 0 0,1 285,108 Z" fill="${dome}"/>`
            : `<path d="M126,105 A74,66 0 0,1 274,105 Z" fill="${dome}" stroke="#39444d" stroke-width="1.5"/>
               <line x1="200" y1="39" x2="200" y2="24" stroke="#d4af37" stroke-width="2.5"/>
               <circle cx="200" cy="22" r="3.5" fill="#d4af37"/>`
        }
        <!-- Main Body -->
        <rect x="98" y="104" width="204" height="64" rx="2" fill="${stone}" stroke="#4a3f35" stroke-width="1.4"/>
        ${
          isStriped
            ? `<rect x="98" y="114" width="204" height="7" fill="#2d3136"/>
               <rect x="98" y="130" width="204" height="7" fill="#2d3136"/>
               <rect x="98" y="146" width="204" height="7" fill="#2d3136"/>`
            : ""
        }
        <!-- Windows & Portal -->
        <rect x="182" y="122" width="36" height="46" rx="18" fill="#2c2520"/>
        <rect x="120" y="${isBaroque ? 114 : 124}" width="${isBaroque ? 26 : 18}" height="${isBaroque ? 38 : 26}" rx="12" fill="#3a4e5c"/>
        <rect x="150" y="${isBaroque ? 114 : 124}" width="${isBaroque ? 24 : 18}" height="${isBaroque ? 38 : 26}" rx="12" fill="#3a4e5c"/>
        <rect x="226" y="${isBaroque ? 114 : 124}" width="${isBaroque ? 24 : 18}" height="${isBaroque ? 38 : 26}" rx="12" fill="#3a4e5c"/>
        <rect x="256" y="${isBaroque ? 114 : 124}" width="${isBaroque ? 26 : 18}" height="${isBaroque ? 38 : 26}" rx="12" fill="#3a4e5c"/>
      `;
    } else if (type === "han") {
      buildingMarkup = `
        <!-- Two-story Han Facade & Courtyard Perspective -->
        <rect x="56" y="78" width="288" height="90" rx="3" fill="${stone}" stroke="#4a3f35" stroke-width="1.5"/>
        <rect x="56" y="94" width="288" height="8" fill="${brick}" opacity="0.85"/>
        <rect x="56" y="120" width="288" height="8" fill="${brick}" opacity="0.85"/>
        <rect x="56" y="146" width="288" height="8" fill="${brick}" opacity="0.85"/>
        <!-- Domes on roof -->
        <path d="M75,78 A18,15 0 0,1 111,78 Z" fill="${dome}"/>
        <path d="M122,78 A18,15 0 0,1 158,78 Z" fill="${dome}"/>
        <path d="M242,78 A18,15 0 0,1 278,78 Z" fill="${dome}"/>
        <path d="M289,78 A18,15 0 0,1 325,78 Z" fill="${dome}"/>
        <!-- Monumental Taçkapı -->
        <rect x="166" y="64" width="68" height="104" fill="${stone}" stroke="#3e332a" stroke-width="1.8"/>
        <path d="M178,168 L178,112 Q200,88 222,112 L222,168 Z" fill="#251f1b"/>
        ${
          cfg.hasKioskMasjid
            ? `<!-- Köşk Mescit Dome Rising from Courtyard -->
               <path d="M176,64 A24,22 0 0,1 224,64 Z" fill="${dome}"/>
               <line x1="200" y1="42" x2="200" y2="30" stroke="#d4af37" stroke-width="2"/>`
            : ""
        }
        <!-- Arched Revak Windows -->
        ${[82, 114, 142, 246, 274, 304]
          .map(
            (x) => `<rect x="${x}" y="96" width="14" height="22" rx="7" fill="#2e2722"/>
                    <rect x="${x}" y="134" width="14" height="26" rx="7" fill="#2e2722"/>`
          )
          .join("")}
      `;
    } else if (type === "medrese") {
      buildingMarkup = `
        <!-- Central Dershane / Darüşşifa Dome -->
        <path d="M148,96 A52,48 0 0,1 252,96 Z" fill="${dome}" stroke="#39444d" stroke-width="1.4"/>
        ${
          cfg.hasHexagonHospital
            ? `<rect x="188" y="38" width="24" height="14" fill="#ece5d5" stroke="#4a3f35" stroke-width="1"/>
               <path d="M186,38 A14,10 0 0,1 214,38 Z" fill="${dome}"/>`
            : ""
        }
        <!-- Student Cell Wings & Chimneys -->
        <rect x="54" y="96" width="292" height="72" fill="${stone}" stroke="#4a3f35" stroke-width="1.4"/>
        ${[72, 104, 136, 264, 296, 324]
          .map(
            (x) => `<path d="M${x - 13},96 A13,12 0 0,1 ${x + 13},96 Z" fill="${dome}"/>
                    <rect x="${x - 3}" y="68" width="6" height="28" fill="${stone}" stroke="#4a3f35" stroke-width="0.8"/>`
          )
          .join("")}
        <!-- Revak Arches -->
        ${[76, 110, 144, 184, 222, 256, 290, 318]
          .map((x) => `<path d="M${x},168 L${x},130 Q${x + 10},116 ${x + 20},130 L${x + 20},168 Z" fill="#2d2620"/>`)
          .join("")}
      `;
    } else if (type === "turbe") {
      buildingMarkup = `
        <!-- Octagonal Turquoise Tomb (Yeşil Türbe) -->
        <path d="M145,78 A55,50 0 0,1 255,78 Z" fill="${dome}" stroke="#39444d" stroke-width="1.5"/>
        <line x1="200" y1="28" x2="200" y2="14" stroke="#d4af37" stroke-width="2.5"/>
        <rect x="148" y="76" width="104" height="14" fill="#e8dec8" stroke="#4a3f35" stroke-width="1"/>
        <rect x="136" y="90" width="128" height="78" fill="${stone}" stroke="#125e5e" stroke-width="1.5"/>
        <line x1="168" y1="90" x2="168" y2="168" stroke="#e8dec8" stroke-width="2"/>
        <line x1="232" y1="90" x2="232" y2="168" stroke="#e8dec8" stroke-width="2"/>
        <rect x="182" y="114" width="36" height="54" fill="#e8dec8" stroke="#4a3f35" stroke-width="1.2"/>
        <path d="M188,168 L188,132 Q200,118 212,132 L212,168 Z" fill="#1e2429"/>
      `;
    } else if (type === "cesme") {
      buildingMarkup = `
        <!-- III. Ahmed Meydan Çeşmesi -->
        <path d="M168,72 A32,28 0 0,1 232,72 Z" fill="${dome}"/>
        <path d="M114,76 A18,16 0 0,1 150,76 Z" fill="${dome}"/>
        <path d="M250,76 A18,16 0 0,1 286,76 Z" fill="${dome}"/>
        <!-- Wide Wooden Eaves -->
        <polygon points="84,76 316,76 296,92 104,92" fill="#6b4c32" stroke="#d4af37" stroke-width="1.5"/>
        <!-- Marble Body & Sebils -->
        <rect x="112" y="92" width="176" height="76" fill="${stone}" stroke="#bba988" stroke-width="1.4"/>
        <rect x="118" y="98" width="32" height="64" rx="8" fill="#dfd5c0" stroke="#c8a248" stroke-width="1.2"/>
        <rect x="250" y="98" width="32" height="64" rx="8" fill="#dfd5c0" stroke="#c8a248" stroke-width="1.2"/>
        <path d="M182,168 L182,118 Q200,102 218,118 L218,168 Z" fill="#2c4251" stroke="#d4af37" stroke-width="1.4"/>
      `;
    } else if (type === "kopru") {
      buildingMarkup = `
        <!-- Multi-Arch Stone Bridge (Uzunköprü) -->
        <rect x="0" y="148" width="400" height="32" fill="#2a6f97"/>
        <polygon points="24,122 200,104 376,122 376,154 24,154" fill="${stone}" stroke="#4a3f35" stroke-width="1.4"/>
        ${[55, 102, 152, 200, 248, 298, 345]
          .map(
            (x, idx) =>
              `<path d="M${x - 18},154 A18,${idx === 3 ? 28 : 22} 0 0,1 ${x + 18},154 Z" fill="#1e4f6e"/>
               <polygon points="${x - 24},154 ${x - 19},136 ${x - 14},154" fill="#bfb29a"/>`
          )
          .join("")}
        <!-- Tarih Köşkü -->
        <rect x="188" y="84" width="24" height="20" fill="${stone}" stroke="#4a3f35" stroke-width="1"/>
        <polygon points="185,84 200,68 215,84" fill="${dome}"/>
      `;
    } else if (type === "hamam") {
      buildingMarkup = `
        <!-- Symmetrical Çifte Hamam with Fil Gözü Domes -->
        <path d="M84,108 A46,42 0 0,1 176,108 Z" fill="${dome}"/>
        <path d="M224,108 A46,42 0 0,1 316,108 Z" fill="${dome}"/>
        <path d="M168,112 A32,28 0 0,1 232,112 Z" fill="${dome}"/>
        <!-- Fil Gözü Oculi -->
        ${[112, 130, 148, 190, 210, 252, 270, 288]
          .map((x) => `<circle cx="${x}" cy="92" r="3.2" fill="#f7e39c"/>`)
          .join("")}
        <rect x="68" y="108" width="264" height="60" fill="${stone}" stroke="#4a3f35" stroke-width="1.4"/>
        <rect x="68" y="124" width="264" height="7" fill="${brick}" opacity="0.85"/>
        <rect x="68" y="146" width="264" height="7" fill="${brick}" opacity="0.85"/>
        <path d="M118,168 L118,136 Q130,124 142,136 L142,168 Z" fill="#2b241f"/>
        <path d="M258,168 L258,136 Q270,124 282,136 L282,168 Z" fill="#2b241f"/>
      `;
    }

    return `
      <svg viewBox="0 0 400 190" xmlns="http://www.w3.org/2000/svg" class="monument-card-svg" role="img" aria-label="${monument.eserAdi}">
        <defs>
          <linearGradient id="sky-${monument.id}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1e2d3d"/>
            <stop offset="65%" stop-color="#3a5068"/>
            <stop offset="100%" stop-color="#c9b38c"/>
          </linearGradient>
        </defs>
        <rect width="400" height="190" fill="url(#sky-${monument.id})"/>
        <circle cx="340" cy="42" r="22" fill="#f3d078" opacity="0.22"/>
        <!-- Ground Horizon -->
        <rect x="0" y="166" width="400" height="24" fill="#3b3228"/>
        ${buildingMarkup}
      </svg>
    `;
  }

  function generateFloorPlanSVG(monument) {
    const type = monument.modelTipi || "cami";
    const cfg = monument.modelConfig || {};
    let planContent = "";

    if (type === "han") {
      planContent = `
        <!-- Outer Courtyard Han Walls -->
        <rect x="40" y="25" width="240" height="170" fill="#f3ebd9" stroke="#2c2219" stroke-width="4"/>
        <!-- Rooms grid around courtyard -->
        <rect x="68" y="52" width="184" height="116" fill="#fffdf8" stroke="#2c2219" stroke-width="2.5"/>
        <rect x="82" y="65" width="156" height="90" fill="none" stroke="#8c6d3f" stroke-width="1.5" stroke-dasharray="5,4"/>
        ${
          cfg.hasKioskMasjid
            ? `<polygon points="160,92 174,98 180,110 174,122 160,128 146,122 140,110 146,98" fill="#d7e8e8" stroke="#1d6d6d" stroke-width="2"/>
               <text x="160" y="113" text-anchor="middle" font-size="8.5" font-weight="700" fill="#124e4e">KÖŞK MESCİT</text>`
            : `<text x="160" y="113" text-anchor="middle" font-size="10" font-weight="700" fill="#5c4930">AÇIK AVLU VE REVAKLAR</text>`
        }
        ${
          cfg.hasLionRelief
            ? `<rect x="40" y="6" width="240" height="19" fill="#e5d8c0" stroke="#2c2219" stroke-width="2.5"/>
               <text x="160" y="18" text-anchor="middle" font-size="8" font-weight="700" fill="#3a2e21">KAPALI AHIR (DEVELİK) BLOĞU</text>`
            : ""
        }
        <!-- Portal -->
        <rect x="142" y="188" width="36" height="14" fill="#c99738" stroke="#2c2219" stroke-width="2"/>
        <text x="160" y="213" text-anchor="middle" font-size="9" font-weight="700" fill="#2c2219">TAÇKAPI (GİRİŞ)</text>
        <text x="160" y="42" text-anchor="middle" font-size="8.5" fill="#4a3b28">Tüccar &amp; Depo Odaları (Revaklı Galeri)</text>
      `;
    } else if (type === "cami") {
      const isOct = cfg.baldachin === "octagonal";
      const isMulti = cfg.baldachin === "multidome";
      planContent = `
        <!-- Courtyard / Son Cemaat -->
        <rect x="65" y="135" width="190" height="60" fill="#f7f2e7" stroke="#2c2219" stroke-width="2.5"/>
        <circle cx="160" cy="165" r="10" fill="#cfe5f0" stroke="#2a6f97" stroke-width="1.8"/>
        <text x="160" y="186" text-anchor="middle" font-size="8.5" fill="#2a6f97" font-weight="600">Şadırvanlı Avlu / Son Cemaat</text>
        <!-- Main Harim -->
        <rect x="65" y="28" width="190" height="107" fill="#efe6d4" stroke="#2c2219" stroke-width="4"/>
        ${
          isMulti
            ? `<circle cx="110" cy="56" r="16" fill="none" stroke="#8a5a2b" stroke-width="1.5"/>
               <circle cx="160" cy="56" r="16" fill="none" stroke="#8a5a2b" stroke-width="1.5"/>
               <circle cx="210" cy="56" r="16" fill="none" stroke="#8a5a2b" stroke-width="1.5"/>
               <circle cx="110" cy="96" r="16" fill="none" stroke="#8a5a2b" stroke-width="1.5"/>
               <circle cx="160" cy="96" r="16" fill="none" stroke="#8a5a2b" stroke-width="1.5"/>
               <circle cx="210" cy="96" r="16" fill="none" stroke="#8a5a2b" stroke-width="1.5"/>
               <text x="160" y="82" text-anchor="middle" font-size="9" font-weight="700" fill="#3a2b1c">9 EŞ KUBBELİ HARİM</text>`
            : `<circle cx="160" cy="82" r="42" fill="#e6dac2" stroke="#8a5a2b" stroke-width="2" stroke-dasharray="4,3"/>
               <text x="160" y="85" text-anchor="middle" font-size="9.5" font-weight="700" fill="#3a2b1c">${
                 isOct ? "8 FİL AYAKLI MERKEZİ KUBBE" : "MERKEZİ KUBBE (HARİM)"
               }</text>`
        }
        <!-- Mihrab Niche -->
        <rect x="148" y="20" width="24" height="10" fill="#1d8a8a" stroke="#2c2219" stroke-width="2"/>
        <text x="160" y="15" text-anchor="middle" font-size="8.5" font-weight="700" fill="#1d8a8a">MİHRAP (KIBLE)</text>
      `;
    } else if (type === "medrese") {
      planContent = `
        <!-- Medrese Courtyard & Cells -->
        <rect x="52" y="68" width="216" height="126" fill="#f3ebd9" stroke="#2c2219" stroke-width="3.5"/>
        <rect x="84" y="88" width="152" height="86" fill="#fffdf8" stroke="#2c2219" stroke-width="2"/>
        <text x="160" y="134" text-anchor="middle" font-size="9.5" font-weight="700" fill="#4a3926">MEDRESE AVLUSU &amp; HÜCRELER</text>
        <!-- Dershane / Darüşşifa -->
        <polygon points="118,68 132,20 188,20 202,68" fill="#dcece9" stroke="#1c6464" stroke-width="3"/>
        <circle cx="160" cy="45" r="18" fill="none" stroke="#1c6464" stroke-width="1.5" stroke-dasharray="3,3"/>
        <text x="160" y="48" text-anchor="middle" font-size="8.5" font-weight="700" fill="#124a4a">${
          cfg.hasHexagonHospital ? "ALTIGEN DARÜŞŞİFA" : "ANA DERSHANE"
        }</text>
      `;
    } else if (type === "turbe") {
      planContent = `
        <polygon points="160,24 208,44 228,92 208,140 160,160 112,140 92,92 112,44" fill="#d9f0ef" stroke="#166969" stroke-width="4"/>
        <circle cx="160" cy="92" r="46" fill="none" stroke="#166969" stroke-width="1.5" stroke-dasharray="4,3"/>
        <rect x="142" y="72" width="36" height="42" fill="#1d8a8a" stroke="#0f4c4c" stroke-width="2"/>
        <text x="160" y="96" text-anchor="middle" font-size="8" font-weight="700" fill="#ffffff">SANDUKA</text>
        <text x="160" y="185" text-anchor="middle" font-size="9.5" font-weight="700" fill="#166969">SEKİZGEN TÜRBE PLANI &amp; KRİPTA</text>
      `;
    } else if (type === "cesme") {
      planContent = `
        <rect x="92" y="38" width="136" height="136" fill="#f3ebd9" stroke="#2c2219" stroke-width="3.5"/>
        <circle cx="92" cy="38" r="20" fill="#e5d4b3" stroke="#8a6226" stroke-width="2.5"/>
        <circle cx="228" cy="38" r="20" fill="#e5d4b3" stroke="#8a6226" stroke-width="2.5"/>
        <circle cx="92" cy="174" r="20" fill="#e5d4b3" stroke="#8a6226" stroke-width="2.5"/>
        <circle cx="228" cy="174" r="20" fill="#e5d4b3" stroke="#8a6226" stroke-width="2.5"/>
        <circle cx="160" cy="106" r="36" fill="#d3eaf5" stroke="#246a8c" stroke-width="2"/>
        <text x="160" y="109" text-anchor="middle" font-size="8.5" font-weight="700" fill="#194d66">SU HAZNESİ</text>
        <text x="160" y="205" text-anchor="middle" font-size="9" font-weight="700" fill="#4a3926">4 Cephe Çeşme + 4 Köşe Sebil Planı</text>
      `;
    } else if (type === "kopru") {
      planContent = `
        <rect x="20" y="45" width="280" height="120" fill="#d9eef7"/>
        <rect x="20" y="88" width="280" height="34" fill="#efe5d1" stroke="#2c2219" stroke-width="3"/>
        ${[55, 105, 155, 205, 255]
          .map(
            (x) => `<polygon points="${x - 8},88 ${x + 8},88 ${x},66" fill="#bfb096" stroke="#2c2219" stroke-width="1.5"/>
                    <rect x="${x - 8}" y="122" width="16" height="12" fill="#bfb096" stroke="#2c2219" stroke-width="1.5"/>`
          )
          .join("")}
        <text x="160" y="109" text-anchor="middle" font-size="9" font-weight="700" fill="#2c2219">1.392 m TAŞ KÖPRÜ TABLİYESİ VE SELYARANLAR</text>
      `;
    } else if (type === "hamam") {
      planContent = `
        <rect x="32" y="54" width="256" height="104" fill="#f3ebd9" stroke="#2c2219" stroke-width="3.5"/>
        <line x1="160" y1="54" x2="160" y2="158" stroke="#c94a29" stroke-width="3" stroke-dasharray="4,3"/>
        <circle cx="72" cy="106" r="28" fill="#e8dcc4" stroke="#2c2219" stroke-width="2"/>
        <circle cx="248" cy="106" r="28" fill="#e8dcc4" stroke="#2c2219" stroke-width="2"/>
        <circle cx="130" cy="106" r="20" fill="#f7dfd4" stroke="#a63c22" stroke-width="2"/>
        <circle cx="190" cy="106" r="20" fill="#f7dfd4" stroke="#a63c22" stroke-width="2"/>
        <text x="72" y="109" text-anchor="middle" font-size="7.5" font-weight="700">CAMEKÂN</text>
        <text x="248" y="109" text-anchor="middle" font-size="7.5" font-weight="700">CAMEKÂN</text>
        <text x="130" y="109" text-anchor="middle" font-size="7.5" font-weight="700" fill="#8c2612">SICAKLIK</text>
        <text x="190" y="109" text-anchor="middle" font-size="7.5" font-weight="700" fill="#8c2612">SICAKLIK</text>
        <text x="160" y="182" text-anchor="middle" font-size="9" font-weight="700" fill="#3a2b1c">Simetrik Çifte Hamam ve Ortak Külhan Planı</text>
      `;
    }

    return `
      <svg viewBox="0 0 320 225" xmlns="http://www.w3.org/2000/svg" class="floor-plan-svg" role="img" aria-label="${monument.eserAdi} Mimari Plan Şeması">
        <rect width="320" height="225" rx="8" fill="#faf6ed" stroke="#d8ccb8" stroke-width="1.5"/>
        <!-- North Arrow -->
        <g transform="translate(292, 26)">
          <circle cx="0" cy="0" r="13" fill="#efe6d5" stroke="#6e5536" stroke-width="1.2"/>
          <polygon points="0,-10 -4,4 0,1 4,4" fill="#8c2d19"/>
          <text x="0" y="11" text-anchor="middle" font-size="7" font-weight="700" fill="#2c2219">K</text>
        </g>
        ${planContent}
      </svg>
    `;
  }

  window.MirasVisualGenerator = {
    generateMonumentCardSVG,
    generateFloorPlanSVG
  };
})();
