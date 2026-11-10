const fs = require('fs');
const path = require('path');

const appPath = path.join(process.cwd(), 'js/app.js');
let currentApp = fs.readFileSync(appPath, 'utf8');

// Find where selectDistrict begins in currentApp
const selectDistrictIdx = currentApp.indexOf('selectDistrict(districtId) {');
if (selectDistrictIdx === -1) {
  console.error('Could not find selectDistrict in currentApp!');
  process.exit(1);
}

const restOfApp = currentApp.substring(selectDistrictIdx);

const topOfApp = `// ============================================================================
// TÜBİTAK 2204-B – SİVAS'IN DİJİTAL TARİH ATLASI
// Ana Uygulama Mantığı ve Etkileşim Kontrolörü
// ============================================================================

window.SivasApp = {
  activeTab: "tab-map",
  activeMonument: null,
  viewer3D: null,
  routeStops: [],
  currentPeriodFilter: "all",
  currentTypeFilter: "all",
  currentDistrictFilter: "all",
  selectedDistrict: null,
  pickerCoords: null,
  editingMonumentId: null,
  isKentMeydaniZoomed: false,
  mapZoom: 1,
  mapPan: { x: 0, y: 0 },
  audioUtterance: null,
  isAudioPlaying: false,
  testMode: "pre", // 'pre' or 'post'
  testScores: { pre: null, post: null },

  init() {
    this.initNavigation();
    this.initSvgMap();
    this.initHeroSection();
    this.renderMonumentsGrid();
    this.init3DViewer();
    this.initComparisonModule();
    this.initTimeline();
    this.initFieldworkModule();
    this.initAdminPanel();
    this.initMapPicker();
    this.initGuides();
    this.initEvaluation();
    this.loadPersistedData();
  },

  // --------------------------------------------------------------------------
  // 1. ÜST NAVİGASYON (7 ANA SEÇENEK + YÖNETİM PANELİ)
  // --------------------------------------------------------------------------
  // DİJİTAL KEŞİF REHBERLERİ: EREN VE AYBÜKE
  // --------------------------------------------------------------------------
  initGuides() {
    if (!window.SIVAS_GUIDES) return;
    window.SIVAS_GUIDES.init();

    // Rehber Seçim Butonları
    document.getElementById("btnPickEren")?.addEventListener("click", () => {
      window.SIVAS_GUIDES.setGuide("eren");
      document.getElementById("btnPickEren")?.classList.add("active");
      document.getElementById("btnPickAybuke")?.classList.remove("active");
    });

    document.getElementById("btnPickAybuke")?.addEventListener("click", () => {
      window.SIVAS_GUIDES.setGuide("aybuke");
      document.getElementById("btnPickAybuke")?.classList.add("active");
      document.getElementById("btnPickEren")?.classList.remove("active");
    });

    // Sesli Anlatım Düğmeleri
    document.getElementById("btnToggleGuideVoice")?.addEventListener("click", () => {
      window.SIVAS_GUIDES.toggleVoice();
    });
    document.getElementById("btnGuideVoicePlay")?.addEventListener("click", () => {
      const txt = document.getElementById("guideSpeechText")?.textContent;
      if (txt) window.SIVAS_GUIDES.speak(txt);
    });

    // Rehber Balonu Küçültme / Gizleme
    document.getElementById("btnGuideMinimize")?.addEventListener("click", () => {
      window.SIVAS_GUIDES.toggleMinimize();
    });
    document.getElementById("btnToggleGuideVisibility")?.addEventListener("click", () => {
      window.SIVAS_GUIDES.toggleMinimize();
    });

    // İlk açılış hoş geldin mesajı
    setTimeout(() => {
      window.SIVAS_GUIDES.showSpeech();
    }, 600);
  },

  initNavigation() {
    const navButtons = document.querySelectorAll(".nav-btn[data-tab]");
    navButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetTab = btn.getAttribute("data-tab");
        this.switchTab(targetTab);
      });
    });

    document.getElementById("btnOpenAdmin")?.addEventListener("click", () => {
      this.populateAdminMonumentsDropdown();
      const authOverlay = document.getElementById("adminAuthLock");
      if (authOverlay) {
        authOverlay.style.display = this.isAdminUnlocked ? "none" : "flex";
      }
      document.getElementById("modalAdmin").style.display = "flex";
    });

    // Modal Kapatma Butonları ve Arka Plan Tıklamaları
    document.querySelectorAll(".modal-close, .modal-cancel").forEach((btn) => {
      btn.addEventListener("click", () => this.closeModals());
    });
    window.addEventListener("click", (e) => {
      if (e.target && e.target.classList && e.target.classList.contains("atlas-modal")) {
        this.closeModals();
      }
    });
  },

  switchTab(tabId) {
    this.activeTab = tabId;

    document.querySelectorAll(".nav-btn[data-tab]").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-tab") === tabId);
    });

    document.querySelectorAll(".content-tab").forEach((tab) => {
      tab.classList.toggle("active", tab.id === tabId);
    });

    if (tabId === "tab-3d" && this.viewer3D) {
      setTimeout(() => this.viewer3D.onResize(), 100);
    }

    // Dijital Rehber Eren & Aybüke Bağlamsal Yönlendirmesi
    if (window.SIVAS_GUIDES) {
      const contextMap = {
        "tab-map": "map",
        "tab-monuments": "monuments",
        "tab-3d": "viewer3d",
        "tab-comparison": "comparison",
        "tab-timeline": "timeline",
        "tab-fieldwork": "fieldwork",
        "tab-sources": "sources"
      };
      const key = contextMap[tabId];
      if (key) {
        window.SIVAS_GUIDES.showSpeech(null, key);
      }
    }
  },

  // --------------------------------------------------------------------------
  // 2. SİVAS ETKİLEŞİMLİ TARİH HARİTASI (SVG & GERÇEK İLÇE SINIRLARI)
  // --------------------------------------------------------------------------
  initSvgMap() {
    const svgMap = document.getElementById("sivasSvgMap");
    const districtsGroup = document.getElementById("districtsGroup");
    const riversGroup = document.getElementById("riversGroup");

    // Antik Harita Arka Planını Ata
    const antiqueImg = document.getElementById("antiqueMapImage");
    if (antiqueImg && window.SIVAS_ANTIQUE_MAP) {
      antiqueImg.setAttribute("href", window.SIVAS_ANTIQUE_MAP);
    }

    if (!districtsGroup || !window.SIVAS_MAP_DATA) return;

    // 17 İlçeyi Gerçek SVG Sınırlarıyla Çiz
    districtsGroup.innerHTML = window.SIVAS_MAP_DATA.districts
      .map(
        (d) => \`
        <g class="district-g" data-district="\${d.id}">
          <path id="dist-\${d.id}" class="district-polygon" data-district="\${d.id}" d="\${d.path}" fill="\${d.color || '#e4d5be'}" />
          <g class="district-badge-group" transform="translate(\${d.center.x}, \${d.center.y})">
            <text class="district-svg-label" text-anchor="middle" y="0">\${d.name}</text>
            <text class="district-svg-count" id="badge-count-\${d.id}" text-anchor="middle" y="14"></text>
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

    // 1. Madde: 17 İlçe Etkileşimleri (Hover, Tooltip, Tıklama)
    const tooltip = document.getElementById("districtTooltip");
    document.querySelectorAll(".district-g").forEach((g) => {
      const distId = g.getAttribute("data-district");
      const distObj = window.SIVAS_MAP_DATA.districts.find((d) => d.id === distId);

      g.addEventListener("mouseenter", (e) => {
        if (distObj && tooltip) {
          const registeredMonuments = this.getMonumentsForDistrict(distObj);
          tooltip.innerHTML = \`
            <strong>\${distObj.name} İlçesi</strong><br>
            <span style="color:#f59e0b;font-weight:700;"><i class="fa-solid fa-landmark"></i> \${registeredMonuments.length} Tarihî Eser</span><br>
            <span style="color:#94a3b8;font-size:0.75rem;">\${distObj.desc}</span>
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

      g.addEventListener("click", (e) => {
        e.stopPropagation();
        this.selectDistrict(distId);
      });
    });

    // Harita Boş Noktasına Tıklandığında İlçe Seçimini Kaldır
    svgMap?.addEventListener("click", (e) => {
      if (e.target.id === "sivasSvgMap" || e.target.id === "antiqueMapImage" || e.target.tagName === "svg") {
        this.resetDistrictSelection();
      }
    });

    // Harita Filtre Şeridi (Dönem Pills, Yapı Türü, İlçe Odaklan, Görünüm Sıfırla)
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

    // Rota Çekmecesi Aç/Kapat Dinleyicileri
    document.getElementById("btnToggleRouteDrawer")?.addEventListener("click", () => {
      const drawer = document.getElementById("routePlannerDrawer");
      if (drawer) {
        drawer.style.display = drawer.style.display === "none" ? "flex" : "none";
      }
    });
    document.getElementById("btnCloseRouteDrawer")?.addEventListener("click", () => {
      const drawer = document.getElementById("routePlannerDrawer");
      if (drawer) drawer.style.display = "none";
    });

    // Harita Görünüm Modu Değiştirici (Gravür / Vektörel)
    document.getElementById("btnViewParchment")?.addEventListener("click", () => this.setMapViewMode("parchment"));
    document.getElementById("btnViewVector")?.addEventListener("click", () => this.setMapViewMode("vector"));

    // Harita Kontrolleri (Zoom & Pan)
    document.getElementById("btnZoomIn")?.addEventListener("click", () => this.zoomMap(1.3));
    document.getElementById("btnZoomOut")?.addEventListener("click", () => this.zoomMap(0.77));
    document.getElementById("btnResetMap")?.addEventListener("click", () => this.resetMapZoom());

    // Tarihi Kent Meydanı Odaklama (Cluster Çözücü)
    document.getElementById("btnFocusMerkezSquare")?.addEventListener("click", () => {
      this.focusTarihiKentMeydani();
    });

    // "Tüm Sivas'ı Göster" Sıfırlama Butonları
    document.getElementById("btnResetDistrict")?.addEventListener("click", () => this.resetDistrictSelection());
    document.getElementById("btnCloseDistrictPanel")?.addEventListener("click", () => this.resetDistrictSelection());
    document.getElementById("btnResetFromPanel")?.addEventListener("click", () => this.resetDistrictSelection());

    // İlçe Paneli İçinden "Bu İlçeye Eser Ekle" Butonu
    document.getElementById("btnAddMonumentForDistrict")?.addEventListener("click", () => {
      if (this.selectedDistrict) {
        this.populateAdminMonumentsDropdown();
        const admDist = document.getElementById("admDistrict");
        if (admDist) admDist.value = this.selectedDistrict;
        document.getElementById("modalAdmin").style.display = "flex";
      }
    });

    // Dropdown Filtre Dinleyicileri
    document.getElementById("typeFilter")?.addEventListener("change", (e) => {
      this.currentTypeFilter = e.target.value;
      this.renderMapMarkers();
      this.renderMonumentsGrid();
    });

    document.getElementById("districtFilter")?.addEventListener("change", (e) => {
      const val = e.target.value;
      if (val === "all") {
        this.resetDistrictSelection();
      } else {
        this.selectDistrict(val);
      }
    });

    // Harita Eser Pinlerini Oluştur
    this.renderMapMarkers();

    // Rota Butonları
    document.getElementById("btnClearRoute")?.addEventListener("click", () => this.clearRoute());
    document.getElementById("btnPrintRoute")?.addEventListener("click", () => this.printRouteGuide());
    document.getElementById("btnClosePopup")?.addEventListener("click", () => {
      document.getElementById("mapPopup").style.display = "none";
    });
  },

  // 1. & 5. Madde: İlçeye Tıklama ve Seçim Durumu
  `;

const fullAppCode = topOfApp + restOfApp;
fs.writeFileSync(appPath, fullAppCode, 'utf8');
console.log('js/app.js rebuilt cleanly. Total length:', fullAppCode.length);
