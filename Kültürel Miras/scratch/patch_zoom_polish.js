const fs = require('fs');

const appPath = 'js/app.js';
let appCode = fs.readFileSync(appPath, 'utf8');

// 1. Update selectDistrict and resetDistrictSelection
const selStart = appCode.indexOf('selectDistrict(districtId) {');
const selEnd = appCode.indexOf('\n  // İlçe Eserleri Yardımcı Fonksiyonu', selStart);

const newSelectDistrictWithZoom = `selectDistrict(districtId) {
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

    // Haritayı Seçilen İlçeye Yumuşak Şekilde Yakınlaştır (Akıllı Odak)
    const svgMap = document.getElementById("sivasSvgMap");
    if (svgMap && dist.center) {
      svgMap.style.transition = "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)";
      svgMap.style.transformOrigin = \`\${dist.center.x}px \${dist.center.y}px\`;
      svgMap.style.transform = dist.id === "merkez" ? "scale(2.0)" : "scale(1.8)";
    }

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
  },

  // Seçimi Kaldırıp Tüm Sivas'ı Gösterme
  resetDistrictSelection() {
    this.selectedDistrict = null;
    this.currentDistrictFilter = "all";

    document.querySelectorAll(".district-polygon").forEach((p) => {
      p.classList.remove("selected-district");
    });

    // Haritayı Sivas İl Geneline Sıfırla
    const svgMap = document.getElementById("sivasSvgMap");
    if (svgMap) {
      svgMap.style.transition = "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)";
      svgMap.style.transformOrigin = "center center";
      svgMap.style.transform = "scale(1)";
    }

    const select = document.getElementById("districtFilter");
    if (select) select.value = "all";
    const ribSelect = document.getElementById("filterDistrictRibbon");
    if (ribSelect) ribSelect.value = "all";

    const resetBtn = document.getElementById("btnResetDistrict");
    if (resetBtn) resetBtn.style.display = "none";

    const panel = document.getElementById("districtInfoPanel");
    if (panel) {
      panel.classList.remove("active");
      panel.style.display = "none";
    }

    this.renderMapMarkers();
    this.renderMonumentsGrid();
  },`;

appCode = appCode.substring(0, selStart) + newSelectDistrictWithZoom + appCode.substring(selEnd);

// 2. Update focusTarihiKentMeydani coords to 422 304
appCode = appCode.replace('svgMap.style.transformOrigin = "410px 310px";', 'svgMap.style.transformOrigin = "422px 304px";');

fs.writeFileSync(appPath, appCode, 'utf8');
console.log('js/app.js updated with zoom and selection polish.');
