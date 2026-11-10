const fs = require('fs');
const path = require('path');

const appPath = path.join(process.cwd(), 'js/app.js');
let code = fs.readFileSync(appPath, 'utf8');

const sIdx = code.indexOf('// Harita Üstü Dönem Filtre Butonları');
const eIdx = code.indexOf('// Rota Çekmecesi Aç/Kapat Dinleyicileri', sIdx);

const newRibbonWiring = `// Harita Filtre Şeridi (Dönem Pills, Yapı Türü, İlçe Odaklan, Görünüm Sıfırla)
    document.querySelectorAll("#mapPeriodFilterBar .map-period-btn, #mapPeriodFilterBar .period-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("#mapPeriodFilterBar .map-period-btn, #mapPeriodFilterBar .period-pill").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentPeriodFilter = btn.getAttribute("data-period");

        // Diğer dönem etiketleriyle senkronize et
        document.querySelectorAll("#periodFilters .filter-tag").forEach((t) => {
          t.classList.toggle("active", t.getAttribute("data-period") === this.currentPeriodFilter);
        });

        this.renderMapMarkers();
        this.renderMonumentsGrid();

        if (this.selectedDistrict) {
          const distObj = window.SIVAS_MAP_DATA.districts.find((d) => d.id === this.selectedDistrict);
          if (distObj) this.renderDistrictInfoPanel(distObj);
        }
      });
    });

    // Yapı Türü Şerit Seçimi
    document.getElementById("filterTypeRibbon")?.addEventListener("change", (e) => {
      this.currentTypeFilter = e.target.value;
      this.renderMapMarkers();
      this.renderMonumentsGrid();
      if (this.selectedDistrict) {
        const distObj = window.SIVAS_MAP_DATA.districts.find((d) => d.id === this.selectedDistrict);
        if (distObj) this.renderDistrictInfoPanel(distObj);
      }
    });

    // İlçe Şerit Seçimi ve Hızlı Odaklanma
    document.getElementById("filterDistrictRibbon")?.addEventListener("change", (e) => {
      const distId = e.target.value;
      if (distId === "all") {
        this.resetMapToFull();
      } else {
        const distObj = window.SIVAS_MAP_DATA.districts.find((d) => d.id === distId);
        if (distObj) {
          this.selectDistrict(distObj);
        }
      }
    });

    // Görünümü Sıfırla Butonu
    document.getElementById("btnResetMapView")?.addEventListener("click", () => {
      this.resetMapToFull();
      const distSelect = document.getElementById("filterDistrictRibbon");
      if (distSelect) distSelect.value = "all";
      const typeSelect = document.getElementById("filterTypeRibbon");
      if (typeSelect) typeSelect.value = "all";
      this.currentTypeFilter = "all";
      this.currentPeriodFilter = "all";
      document.querySelectorAll("#mapPeriodFilterBar .map-period-btn, #mapPeriodFilterBar .period-pill").forEach((b, idx) => {
        b.classList.toggle("active", idx === 0);
      });
      this.renderMapMarkers();
      this.renderMonumentsGrid();
    });
`;

code = code.substring(0, sIdx) + newRibbonWiring + code.substring(eIdx);
fs.writeFileSync(appPath, code, 'utf8');
console.log('Ribbon filters wired successfully.');
