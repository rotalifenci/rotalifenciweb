const fs = require('fs');

const appPath = 'js/app.js';
let appCode = fs.readFileSync(appPath, 'utf8');

// 1. Update initSvgMap district listener and rendering
const svgStart = appCode.indexOf('// 17 İlçeyi Gerçek SVG Sınırlarıyla Çiz');
const svgEnd = appCode.indexOf('// Harita Boş Noktasına Tıklandığında İlçe Seçimini Kaldır', svgStart);

const newSvgDistrictBlock = `// 17 İlçeyi Gerçek SVG Sınırlarıyla Çiz
    districtsGroup.innerHTML = window.SIVAS_MAP_DATA.districts
      .map(
        (d) => \`
        <g class="district-g" data-district="\${d.id}" id="g-dist-\${d.id}">
          <path id="dist-\${d.id}" class="district-polygon" data-district="\${d.id}" d="\${d.path}" fill="\${d.color || '#fbf2df'}" />
          <g class="district-badge-group" transform="translate(\${d.center.x}, \${d.center.y})">
            <text class="district-svg-label" text-anchor="middle" y="-2">\${d.name}</text>
            <text class="district-svg-count" id="badge-count-\${d.id}" text-anchor="middle" y="12"></text>
          </g>
        </g>
      \`
      )
      .join("");

    // Nehirleri Çiz
    riversGroup.innerHTML = window.SIVAS_MAP_DATA.rivers
      .map(
        (r) => \`
        <path class="river-path" d="\${r.path}" title="\${r.name}" />
      \`
      )
      .join("");

    // 17 İlçe Etkileşimleri (Hover, Tooltip, Tıklama ve Seçim)
    const tooltip = document.getElementById("districtTooltip");
    document.querySelectorAll(".district-g").forEach((g) => {
      const distId = g.getAttribute("data-district");
      const distObj = window.SIVAS_MAP_DATA.districts.find((d) => d.id === distId);

      g.addEventListener("mouseenter", (e) => {
        if (distObj && tooltip) {
          const registeredMonuments = this.getMonumentsForDistrict(distObj);
          tooltip.innerHTML = \`
            <strong>\${distObj.name} İlçesi</strong><br>
            <span style="color:#d97706;font-weight:700;"><i class="fa-solid fa-landmark"></i> \${registeredMonuments.length} Tarihî Eser</span><br>
            <span style="color:#475569;font-size:0.75rem;">\${distObj.desc}</span>
          \`;
          tooltip.style.display = "block";
        }
      });

      g.addEventListener("mousemove", (e) => {
        if (tooltip) {
          tooltip.style.left = \`\${e.clientX + 16}px\`;
          tooltip.style.top = \`\${e.clientY + 16}px\`;
        }
      });

      g.addEventListener("mouseleave", () => {
        if (tooltip) tooltip.style.display = "none";
      });

      // Tıklama Olayı (Doğrudan İlçeyi Seç ve Odaklan)
      g.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.selectDistrict(distId);
      });
    });
`;

appCode = appCode.substring(0, svgStart) + newSvgDistrictBlock + appCode.substring(svgEnd);

// 2. Update selectDistrict to bring element to front and trigger guide info
const selDistStart = appCode.indexOf('selectDistrict(districtId) {');
const selDistEnd = appCode.indexOf('\n  // Seçimi Kaldırıp Tüm Sivas\'ı Gösterme', selDistStart);

const newSelectDistrictBlock = `selectDistrict(districtId) {
    if (!window.SIVAS_MAP_DATA) return;
    const dist = window.SIVAS_MAP_DATA.districts.find(
      (d) => d.id === districtId.toLowerCase() || d.name.toLowerCase() === districtId.toLowerCase()
    );
    if (!dist) return;

    this.selectedDistrict = dist.id;
    this.currentDistrictFilter = dist.name.toLowerCase();

    // SVG Sınır Vurgusu (.selected-district) ve Öne Getirme
    document.querySelectorAll(".district-polygon").forEach((p) => {
      const isTarget = p.id === \`dist-\${dist.id}\`;
      p.classList.toggle("selected-district", isTarget);
      if (isTarget) {
        const parentG = p.closest(".district-g");
        if (parentG && parentG.parentNode) {
          parentG.parentNode.appendChild(parentG);
        }
      }
    });

    // Filtre Dropdown Senkronizasyonu
    const select = document.getElementById("districtFilter");
    if (select) select.value = dist.id;
    const ribSelect = document.getElementById("filterDistrictRibbon");
    if (ribSelect) ribSelect.value = dist.id;

    // "Tüm Sivas'ı Göster" butonunu toolbar'da görünür yap
    const resetBtn = document.getElementById("btnResetDistrict");
    if (resetBtn) resetBtn.style.display = "inline-flex";

    // Yan Bilgi Panelini Aç ve Doldur
    this.renderDistrictInfoPanel(dist);

    // Eser Pinlerini Yeniden Filtrele
    this.renderMapMarkers();
    this.renderMonumentsGrid();

    // Dijital Rehber Eren/Aybüke Bilgilendirmesi
    if (window.SIVAS_GUIDES) {
      const registered = this.getMonumentsForDistrict(dist);
      const text = registered.length > 0 
        ? \`\${dist.name} ilçesindeyiz! Burada tescilli \${registered.length} tarihî ve kültürel miras eseri bulunuyor. Eserleri haritadan ve aşağıdaki panelden inceleyebilirsin.\`
        : \`\${dist.name} ilçesini seçtin. \${dist.desc} Bu ilçeye henüz kayıtlı bir eser eklenmemiş; istersen Yönetim Paneli'nden ilk eseri sen ekleyebilirsin!\`;
      window.SIVAS_GUIDES.showSpeech(text, "map");
    }
  },`;

appCode = appCode.substring(0, selDistStart) + newSelectDistrictBlock + appCode.substring(selDistEnd);

// 3. Update getSvgCoordsForMonument
const coordsStart = appCode.indexOf('getSvgCoordsForMonument(monument, isZoomed) {');
const coordsEnd = appCode.indexOf('\n  // 4. Madde: Antik Estetikli Harita Pinleri', coordsStart);

const newCoordsBlock = `getSvgCoordsForMonument(monument, isZoomed) {
    // 1. Doğrudan SVG koordinatı atanmışsa (Yönetim panelinden seçilmiş veya özel ayarlanmış)
    if (monument.svgCoords && typeof monument.svgCoords.x === "number" && typeof monument.svgCoords.y === "number") {
      return { x: monument.svgCoords.x, y: monument.svgCoords.y };
    }

    // 2. Divriği Ulu Camii için kesin koordinat (Divriği Bölgesi)
    if (monument.id === "divrigi-ulu-camii" || (monument.district && monument.district.toLowerCase() === "divriği")) {
      return { x: 714, y: 432 };
    }

    // 3. Sivas Merkez Kümesi Spiderfy Dağılımı (Merkez İlçesi Poligonu İçinde Dengeli Dağılım):
    const merkezOffsets = {
      "cifte-minareli-medrese": { dx: -14, dy: -14 },
      "sifaiye-medresesi": { dx: 14, dy: -14 },
      "buruciye-medresesi": { dx: -18, dy: 10 },
      "kale-camii": { dx: -4, dy: 24 },
      "sivas-hukumet-konagi": { dx: 22, dy: 10 },
      "ataturk-kongre-muzesi": { dx: -28, dy: 0 },
      "gok-medrese": { dx: 10, dy: 34 },
      "sivas-ulu-camii": { dx: 22, dy: -24 },
      "egri-kopru": { dx: 8, dy: 56 }
    };

    const baseMerkez = { x: 422, y: 304 };
    const offset = merkezOffsets[monument.id];

    if (offset) {
      if (isZoomed) {
        return {
          x: baseMerkez.x + offset.dx * 3.0,
          y: baseMerkez.y + offset.dy * 3.0
        };
      } else {
        return {
          x: baseMerkez.x + offset.dx * 1.0,
          y: baseMerkez.y + offset.dy * 1.0
        };
      }
    }

    // 4. Eğer gerçek enlem/boylam varsa ve projeksiyon tanımlıysa
    if (typeof monument.lon === "number" && typeof monument.lat === "number" && window.SIVAS_MAP_DATA?.projection?.project) {
      return window.SIVAS_MAP_DATA.projection.project(monument.lon, monument.lat);
    }

    // 5. Belirtilen İlçenin Merkez Noktası (Eser merkez dışındaysa kendi ilçesine yerleşir)
    if (monument.district && window.SIVAS_MAP_DATA) {
      const dist = window.SIVAS_MAP_DATA.districts.find(
        (d) => d.id === monument.district.toLowerCase() || d.name.toLowerCase() === monument.district.toLowerCase()
      );
      if (dist && dist.center) {
        return { x: dist.center.x, y: dist.center.y };
      }
    }

    return baseMerkez;
  },`;

appCode = appCode.substring(0, coordsStart) + newCoordsBlock + appCode.substring(coordsEnd);

// 4. Update initMapPicker scale to 1000x760
appCode = appCode.replace('const scaleX = 1024 / rect.width;', 'const scaleX = 1000 / rect.width;');
appCode = appCode.replace('const scaleY = 682 / rect.height;', 'const scaleY = 760 / rect.height;');
appCode = appCode.replace('x = Math.max(10, Math.min(1014, x));', 'x = Math.max(10, Math.min(990, x));');
appCode = appCode.replace('y = Math.max(10, Math.min(672, y));', 'y = Math.max(10, Math.min(750, y));');

fs.writeFileSync(appPath, appCode, 'utf8');
console.log('js/app.js updated successfully.');
