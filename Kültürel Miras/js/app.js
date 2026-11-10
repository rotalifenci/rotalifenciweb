// ============================================================================
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
        (d) => `
        <g class="district-g" data-district="${d.id}" id="g-dist-${d.id}">
          <path id="dist-${d.id}" class="district-polygon" data-district="${d.id}" d="${d.path}" fill="${d.color || '#fbf2df'}" />
          <g class="district-badge-group" transform="translate(${d.center.x}, ${d.center.y})">
            <text class="district-svg-label" text-anchor="middle" y="-2">${d.name}</text>
            <text class="district-svg-count" id="badge-count-${d.id}" text-anchor="middle" y="12"></text>
          </g>
        </g>
      `
      )
      .join("");

    // Nehirleri Çiz
    riversGroup.innerHTML = window.SIVAS_MAP_DATA.rivers
      .map(
        (r) => `
        <path class="river-path" d="${r.path}" title="${r.name}" />
      `
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
          tooltip.innerHTML = `
            <strong>${distObj.name} İlçesi</strong><br>
            <span style="color:#d97706;font-weight:700;"><i class="fa-solid fa-landmark"></i> ${registeredMonuments.length} Tarihî Eser</span><br>
            <span style="color:#475569;font-size:0.75rem;">${distObj.desc}</span>
          `;
          tooltip.style.display = "block";
        }
      });

      g.addEventListener("mousemove", (e) => {
        if (tooltip) {
          tooltip.style.left = `${e.clientX + 16}px`;
          tooltip.style.top = `${e.clientY + 16}px`;
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
  selectDistrict(districtId) {
    if (!window.SIVAS_MAP_DATA) return;
    const dist = window.SIVAS_MAP_DATA.districts.find(
      (d) => d.id === districtId.toLowerCase() || d.name.toLowerCase() === districtId.toLowerCase()
    );
    if (!dist) return;

    this.selectedDistrict = dist.id;
    this.currentDistrictFilter = dist.name.toLowerCase();

    // SVG Sınır Vurgusu (.selected-district) ve Öne Getirme
    document.querySelectorAll(".district-polygon").forEach((p) => {
      const isTarget = p.id === `dist-${dist.id}`;
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
      svgMap.style.transformOrigin = `${dist.center.x}px ${dist.center.y}px`;
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
        ? `${dist.name} ilçesindeyiz! Burada tescilli ${registered.length} tarihî ve kültürel miras eseri bulunuyor. Eserleri haritadan ve aşağıdaki panelden inceleyebilirsin.`
        : `${dist.name} ilçesini seçtin. ${dist.desc} Bu ilçeye henüz kayıtlı bir eser eklenmemiş; istersen Yönetim Paneli'nden ilk eseri sen ekleyebilirsin!`;
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
  },
  // İlçe Eserleri Yardımcı Fonksiyonu
  getMonumentsForDistrict(dist) {
    if (!dist || !window.SIVAS_MONUMENTS) return [];
    const targetName = dist.name.toLowerCase();
    const targetId = dist.id.toLowerCase();

    return window.SIVAS_MONUMENTS.filter((m) => {
      const mDist = (m.district || "").toLowerCase();
      return mDist === targetName || mDist === targetId;
    });
  },

  // 6. Madde: Dönem Filtresi Eşleştirme (Mengücekliler, Selçuklu, İlhanlı, Osmanlı, vb.)
  matchesPeriod(m, filter) {
    if (!filter || filter === "all") return true;
    const pg = (m.periodGroup || "").toLowerCase();
    const p = (m.period || "").toLowerCase();

    if (filter === "mengucekli") {
      return pg === "mengucekli" || pg === "beylikler" || p.includes("mengücek") || p.includes("mengucek") || p.includes("beylik");
    }
    if (filter === "selcuklu") {
      return pg === "selcuklu" || p.includes("selçuk") || p.includes("selcuk");
    }
    if (filter === "ilhanli") {
      return pg === "ilhanli" || p.includes("ilhanlı") || p.includes("ilhanli");
    }
    if (filter === "osmanli") {
      return pg === "osmanli" || p.includes("osmanlı") || p.includes("osmanli");
    }
    if (filter === "diger") {
      return pg === "cumhuriyet" || pg === "diger" || pg === "danismendli" || p.includes("cumhuriyet") || p.includes("danişmend");
    }
    return pg === filter;
  },

  // 5. Madde: İlçe Bilgi Paneli (Drawer / Bottom Sheet) İçeriğini Doldur
  renderDistrictInfoPanel(dist) {
    const panel = document.getElementById("districtInfoPanel");
    if (!panel) return;

    const title = document.getElementById("panelDistrictTitle");
    const badge = document.getElementById("panelMonumentCount") || document.getElementById("panelDistrictBadge");
    const summary = document.getElementById("panelDistrictDesc") || document.getElementById("panelDistrictSummary");
    const list = document.getElementById("panelMonumentsList");
    const filterTag = document.getElementById("panelActiveFilterTag");

    if (title) title.innerText = `${dist.name} İlçesi`;
    if (summary) summary.innerText = dist.desc;

    const allMonuments = this.getMonumentsForDistrict(dist);
    const filteredMonuments = allMonuments.filter((m) => this.matchesPeriod(m, this.currentPeriodFilter));

    if (badge) {
      badge.innerText = `${allMonuments.length} Tarihî Eser Kayıtlı`;
    }

    if (list) {
      if (allMonuments.length === 0) {
        // İstenen Boş Durum Mesajı
        list.innerHTML = `
          <div class="empty-district-box">
            <i class="fa-solid fa-map-location-dot"></i>
            <p><strong>Bu ilçeye henüz tarihî eser eklenmemiştir.</strong></p>
            <p class="text-sm">Yönetim panelindeki "Tarihî Eser Ekle" özelliğiyle bu ilçeye ait kültürel miras yapılarını ekleyebilirsiniz.</p>
          </div>
        `;
      } else if (filteredMonuments.length === 0) {
        list.innerHTML = `
          <div class="empty-district-box">
            <i class="fa-solid fa-filter"></i>
            <p><strong>Seçilen tarihî döneme uygun eser bulunamadı.</strong></p>
            <p class="text-sm">Bu ilçede toplam ${allMonuments.length} eser mevcuttur. Farklı bir dönem seçebilir veya "Tüm Dönemler"e tıklayabilirsiniz.</p>
          </div>
        `;
      } else {
        list.innerHTML = filteredMonuments
          .map((m) => {
            const imgSrc =
              m.id === "cifte-minareli-medrese" ? "assets/images/cifte_minareli_3d.jpg" : m.thumbnail;

            return `
              <div class="panel-monument-item" onclick="SivasApp.openMapPopup('${m.id}')">
                <img src="${imgSrc}" alt="${m.name}" class="panel-monument-thumb" />
                <div class="panel-monument-info">
                  <h5>${m.name}</h5>
                  <div class="panel-monument-meta">
                    <span class="period-badge ${m.periodGroup || 'selcuklu'}">${m.period || m.buildYear}</span>
                    <span>${m.type || 'Tarihî Yapı'}</span>
                  </div>
                  <div class="panel-monument-actions">
                    <button class="btn-sm-action" onclick="event.stopPropagation(); SivasApp.openMonumentDetail('${m.id}')">
                      <i class="fa-solid fa-book-open"></i> Eseri İncele
                    </button>
                    <button class="btn-sm-action" onclick="event.stopPropagation(); SivasApp.open3DForMonument('${m.id}')">
                      <i class="fa-solid fa-cube"></i> 3B Model
                    </button>
                  </div>
                </div>
              </div>
            `;
          })
          .join("");
      }
    }

    panel.style.display = "flex";
    panel.classList.add("active");
  },

  // Eserlerin Coğrafi Koordinatlarını SVG (1024x682 Antik Harita) Koordinatlarına Dönüştürme
  // ve Kent Meydanı'ndaki eserlerin üst üste binmesini önleyen 'Spiderfy' Çözücüsü
  getSvgCoordsForMonument(monument, isZoomed) {
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
  },
  // 4. Madde: Antik Estetikli Harita Pinleri ve İşaretçiler
  renderMapMarkers() {
    const markersGroup = document.getElementById("markersGroup");
    if (!markersGroup || !window.SIVAS_MONUMENTS) return;

    const filtered = window.SIVAS_MONUMENTS.filter((m) => {
      const matchPeriod = this.matchesPeriod(m, this.currentPeriodFilter);
      const matchType = this.currentTypeFilter === "all" || m.typeGroup === this.currentTypeFilter;
      const matchDistrict =
        this.currentDistrictFilter === "all" ||
        (m.district && m.district.toLowerCase() === this.currentDistrictFilter.toLowerCase());
      return matchPeriod && matchType && matchDistrict;
    });

    markersGroup.innerHTML = filtered
      .map((m) => {
        const pt = this.getSvgCoordsForMonument(m, this.isKentMeydaniZoomed);
        const periodColor = this.getPeriodColor(m.periodGroup);

        return `
        <g class="monument-pin" data-id="${m.id}" transform="translate(${pt.x}, ${pt.y})">
          <circle class="pin-pulse" r="14" fill="${periodColor}" opacity="0.35" />
          <path class="pin-core" d="M 0,-18 C -7,-18 -11,-12 -11,-6 C -11,2 0,16 0,16 C 0,16 11,2 11,-6 C 11,-12 7,-18 0,-18 Z" fill="${periodColor}" />
          <circle cx="0" cy="-7" r="4.5" fill="#ffffff" />
          <text x="0" y="26" text-anchor="middle" font-size="9" font-weight="700" fill="#ffffff" stroke="#0f172a" stroke-width="2.5" paint-order="stroke">${m.name.split(" ")[0]}</text>
        </g>
      `;
      })
      .join("");

    // Pin Tıklama Dinleyicileri
    document.querySelectorAll(".monument-pin").forEach((pin) => {
      pin.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = pin.getAttribute("data-id");
        this.openMapPopup(id);
      });
    });

    this.updateRouteLineSvg();
  },

  getPeriodColor(periodGroup) {
    switch (periodGroup) {
      case "selcuklu":
        return "#0d9488"; // Selçuklu Turkuazı
      case "beylikler":
      case "mengucekli":
        return "#d97706"; // Mengücek / Beylikler Altını
      case "ilhanli":
        return "#0284c7"; // İlhanlı Kobaltı
      case "osmanli":
        return "#dc2626"; // Osmanlı Kırmızısı
      case "cumhuriyet":
      case "diger":
        return "#10b981"; // Cumhuriyet Yeşili
      default:
        return "#d97706";
    }
  },

  // 4. Madde: Tıklandığında Açılan Eser Bilgi Kartı (Popup)
  openMapPopup(monumentId) {
    const monument = window.SIVAS_MONUMENTS.find((m) => m.id === monumentId);
    if (!monument) return;

    this.activeMonument = monument;
    const popup = document.getElementById("mapPopup");
    const img = document.getElementById("popupImg");
    const title = document.getElementById("popupTitle");
    const period = document.getElementById("popupPeriod");
    const districtTag = document.getElementById("popupDistrict");
    const typeTag = document.getElementById("popupType");
    const desc = document.getElementById("popupDesc");

    title.innerText = monument.name;
    period.innerText = `${monument.buildYear} • ${monument.period}`;
    period.className = `period-badge ${monument.periodGroup || 'selcuklu'}`;

    if (districtTag) districtTag.innerText = monument.district || "Sivas";
    if (typeTag) typeTag.innerText = monument.type || "Tarihî Yapı";

    desc.innerText = (monument.condition && monument.condition.surviving) ? monument.condition.surviving : monument.writtenHistory.substring(0, 110) + "...";

    if (monument.id === "cifte-minareli-medrese") {
      img.src = "assets/images/cifte_minareli_3d.jpg";
    } else {
      img.src = monument.thumbnail || "assets/images/monuments/cifte_minareli.jpg";
    }

    // Buton Eylemleri
    document.getElementById("btnPopupExplore").onclick = () => {
      this.openMonumentDetail(monument.id);
    };

    document.getElementById("btnPopupAddRoute").onclick = () => {
      this.addStopToRoute(monument);
    };

    popup.style.display = "block";
  },

    setMapViewMode(mode) {
    this.mapViewMode = mode;
    const svgMap = document.getElementById("sivasSvgMap");
    const btnParchment = document.getElementById("btnViewParchment");
    const btnVector = document.getElementById("btnViewVector");

    if (mode === "vector") {
      svgMap?.classList.add("vector-atlas-mode");
      btnVector?.classList.add("active");
      btnParchment?.classList.remove("active");
    } else {
      svgMap?.classList.remove("vector-atlas-mode");
      btnParchment?.classList.add("active");
      btnVector?.classList.remove("active");
    }
  },

focusTarihiKentMeydani() {
    this.isKentMeydaniZoomed = !this.isKentMeydaniZoomed;
    const svgMap = document.getElementById("sivasSvgMap");
    const btn = document.getElementById("btnFocusMerkezSquare");

    if (this.isKentMeydaniZoomed) {
      svgMap.style.transformOrigin = "422px 304px";
      svgMap.style.transform = "scale(2.5)";
      if (btn) btn.innerHTML = `<i class="fa-solid fa-compress"></i> Sivas İl Geneline Geri Dön`;
    } else {
      svgMap.style.transformOrigin = "center center";
      svgMap.style.transform = "scale(1)";
      if (btn) btn.innerHTML = `<i class="fa-solid fa-crosshairs"></i> Tarihî Kent Meydanı'na Yakınlaş (Cluster Çözücü)`;
    }

    this.renderMapMarkers();
  },

  zoomMap(factor) {
    this.mapZoom = Math.min(Math.max(this.mapZoom * factor, 0.8), 3.5);
    const svgMap = document.getElementById("sivasSvgMap");
    if (svgMap) {
      svgMap.style.transform = `scale(${this.mapZoom})`;
    }
  },

  resetMapZoom() {
    this.mapZoom = 1;
    this.isKentMeydaniZoomed = false;
    const svgMap = document.getElementById("sivasSvgMap");
    if (svgMap) {
      svgMap.style.transformOrigin = "center center";
      svgMap.style.transform = "scale(1)";
    }
    const btn = document.getElementById("btnFocusMerkezSquare");
    if (btn) btn.innerHTML = `<i class="fa-solid fa-crosshairs"></i> Tarihî Kent Meydanı'na Yakınlaş (Cluster Çözücü)`;
    this.renderMapMarkers();
  },

  filterByDistrict(districtId) {
    if (districtId === "all") {
      this.resetDistrictSelection();
    } else {
      this.selectDistrict(districtId);
    }
  },

  // --------------------------------------------------------------------------
  // ROTA OLUŞTURUCU VE SVG ROTA ÇİZGİSİ
  // --------------------------------------------------------------------------
  addStopToRoute(monument) {
    if (this.routeStops.find((s) => s.id === monument.id)) {
      alert(`${monument.name} zaten gezi rotanızda ekli.`);
      return;
    }

    this.routeStops.push(monument);
    this.renderRouteList();
    this.updateRouteLineSvg();
  },

  removeStopFromRoute(index) {
    this.routeStops.splice(index, 1);
    this.renderRouteList();
    this.updateRouteLineSvg();
  },

  clearRoute() {
    this.routeStops = [];
    this.renderRouteList();
    this.updateRouteLineSvg();
  },

  renderRouteList() {
    const list = document.getElementById("routeList");
    const footer = document.getElementById("routeFooter");
    const countSpan = document.getElementById("routeStopCount");

    if (!list) return;

    if (this.routeStops.length === 0) {
      list.innerHTML = `<li class="route-empty">Henüz rota noktası eklenmedi.</li>`;
      if (footer) footer.style.display = "none";
      return;
    }

    list.innerHTML = this.routeStops
      .map(
        (stop, idx) => `
        <li class="route-item">
          <div class="route-item-title">
            <span class="route-badge">${idx + 1}</span>
            <strong>${stop.name}</strong>
          </div>
          <button class="route-remove" onclick="SivasApp.removeStopFromRoute(${idx})">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </li>
      `
      )
      .join("");

    if (footer) {
      footer.style.display = "block";
      if (countSpan) countSpan.innerText = `${this.routeStops.length} Durak`;
    }
  },

  updateRouteLineSvg() {
    const pathElem = document.getElementById("routePathLine");
    if (!pathElem) return;

    if (this.routeStops.length < 2) {
      pathElem.setAttribute("d", "");
      return;
    }

    let dStr = "";
    this.routeStops.forEach((stop, idx) => {
      const pt = this.getSvgCoordsForMonument(stop, this.isKentMeydaniZoomed);
      if (idx === 0) dStr += `M ${pt.x},${pt.y} `;
      else dStr += `L ${pt.x},${pt.y} `;
    });

    pathElem.setAttribute("d", dStr);
  },

  printRouteGuide() {
    window.print();
  },

  // --------------------------------------------------------------------------
  // 3. VİTRİN: ÇİFTE MİNARELİ MEDRESE & GÖRSELİ
  // --------------------------------------------------------------------------
  initHeroSection() {
    const renderImg = document.getElementById("cifteRenderImg");
    if (renderImg && window.CIFTE_MINARELI_IMAGE) {
      renderImg.src = "assets/images/cifte_minareli_3d.jpg";
    }
  },

  // --------------------------------------------------------------------------
  // 4. ESER KARTLARI IZGARASI (10 SEÇKİN SİVAS ESERİ)
  // --------------------------------------------------------------------------
  renderMonumentsGrid() {
    const grid = document.getElementById("monumentsGrid");
    if (!grid) return;

    const filtered = window.SIVAS_MONUMENTS.filter((m) => {
      const matchPeriod = this.matchesPeriod(m, this.currentPeriodFilter);
      const matchType = this.currentTypeFilter === "all" || m.typeGroup === this.currentTypeFilter;
      const matchDistrict =
        this.currentDistrictFilter === "all" ||
        (m.district && m.district.toLowerCase() === this.currentDistrictFilter.toLowerCase());
      return matchPeriod && matchType && matchDistrict;
    });

    grid.innerHTML = filtered
      .map((m) => {
        const imgSrc =
          m.id === "cifte-minareli-medrese" ? "assets/images/cifte_minareli_3d.jpg" : m.thumbnail;

        return `
        <div class="monument-card">
          <div class="card-img-wrap">
            <img src="${imgSrc}" alt="${m.name}" loading="lazy">
            <span class="card-3d-indicator"><i class="fa-solid fa-cube"></i> 3B Model</span>
            <span class="card-period-tag period-badge ${m.periodGroup}">${m.period}</span>
          </div>
          <div class="card-body">
            <h4>${m.name}</h4>
            <div class="card-meta">
              <span><i class="fa-solid fa-calendar-days"></i> ${m.buildYear}</span> • 
              <span><i class="fa-solid fa-user-pen"></i> ${m.builder.split("(")[0]}</span>
            </div>
            <p class="card-desc">${m.digitalTablet.architecturalFeatures}</p>
            <div class="card-actions">
              <button class="btn-action-primary" onclick="SivasApp.openMonumentDetail('${m.id}')">
                <i class="fa-solid fa-book-open"></i> Eseri İncele
              </button>
              <button class="btn-action-secondary" onclick="SivasApp.open3DForMonument('${m.id}')">
                <i class="fa-solid fa-cube"></i> 3B Keşif
              </button>
            </div>
          </div>
        </div>
      `;
      })
      .join("");
  },

  // --------------------------------------------------------------------------
  // 5. 3B GÖRSELLEŞTİRME SİSTEMİ (THREE.JS & GLB YÜKLEYİCİ)
  // --------------------------------------------------------------------------
  init3DViewer() {
    const container = document.getElementById("canvas3DContainer");
    if (container && window.Sivas3DViewer) {
      this.viewer3D = new window.Sivas3DViewer("canvas3DContainer");
    }

    // Eser Seçiciyi Doldur
    const select = document.getElementById("select3DMonument");
    if (select) {
      select.innerHTML = window.SIVAS_MONUMENTS.map(
        (m) => `<option value="${m.id}">${m.name} (${m.buildYear})</option>`
      ).join("");

      select.addEventListener("change", (e) => {
        this.open3DForMonument(e.target.value);
      });
    }

    // Çifte Minareli Gerçek 3B Model Görselini Ata
    const cifteRealImg = document.getElementById("cifteReal3DImage");
    if (cifteRealImg && window.CIFTE_MINARELI_IMAGE) {
      cifteRealImg.src = "assets/images/cifte_minareli_3d.jpg";
    }

    // Gerçek 3B Model / Hotspot Mod Geçiş Butonu
    const btnToggleReal = document.getElementById("btnToggleCifteReal");
    btnToggleReal?.addEventListener("click", () => {
      if (this.viewer3D) {
        const mode = this.viewer3D.toggleCifteMode();
        btnToggleReal.classList.toggle("active", mode === "glb");
        btnToggleReal.innerHTML =
          mode === "glb"
            ? `<i class="fa-solid fa-cube"></i> 360° Gerçek 3B Model (GLB)`
            : `<i class="fa-solid fa-crosshairs"></i> Mimari Ayrıntı & Hotspot Modu`;
      }
    });

    // Yıkılmış Avlu Aç/Kapat Butonu
    document.getElementById("btnToggleLostSection")?.addEventListener("click", () => {
      if (this.viewer3D) {
        const isVisible = this.viewer3D.toggleLostSection();
        const btn = document.getElementById("btnToggleLostSection");
        if (btn) {
          btn.innerHTML = isVisible
            ? `<i class="fa-solid fa-ghost"></i> Yıkılmış Avluyu Gizle`
            : `<i class="fa-solid fa-ghost"></i> Yıkılmış Avluyu Göster (1963 Planı)`;
        }
      }
    });

    // 3B Sahneden Taş Dijital Kitabeyi Aç
    document.getElementById("btnOpenTabletFrom3D")?.addEventListener("click", () => {
      this.openCurrentTablet();
    });

    // 3B Sahneden Gerçek Kitabeyi Aç
    document.getElementById("btnOpenRealInscription3D")?.addEventListener("click", () => {
      if (this.viewer3D && this.viewer3D.currentMonument) {
        this.openRealInscriptionModal(this.viewer3D.currentMonument);
      }
    });

    // Kullanıcının / Öğretmenin GLB / GLTF Dosyası Yüklemesi
    const uploadInput = document.getElementById("file3DUpload");
    document.getElementById("btnTriggerUpload3D")?.addEventListener("click", () => {
      uploadInput?.click();
    });

    uploadInput?.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0] && this.viewer3D) {
        const file = e.target.files[0];
        this.viewer3D.loadCustom3DModelFile(file, (res) => {
          if (res.success) {
            alert(`Tebrikler! "${file.name}" 3B modeli başarıyla sahneye yüklendi ve 360 derece incelemeye açıldı.`);
          }
        });
      }
    });

    // Hotspot Kapat Butonu
    document.getElementById("btnCloseHotspot")?.addEventListener("click", () => {
      document.getElementById("hotspotOverlay").style.display = "none";
    });

    // Varsayılan olarak Çifte Minareli Medrese'yi Yükle
    this.open3DForMonument("cifte-minareli-medrese");
  },

  open3DForMonument(monumentId) {
    this.switchTab("tab-3d");
    const select = document.getElementById("select3DMonument");
    if (select) select.value = monumentId;

    const btnToggleReal = document.getElementById("btnToggleCifteReal");
    if (btnToggleReal) {
      btnToggleReal.style.display = monumentId === "cifte-minareli-medrese" ? "inline-flex" : "none";
    }

    if (this.viewer3D) {
      this.viewer3D.loadMonument(monumentId);
    }
  },

  showHotspotDetail(hotspot) {
    const overlay = document.getElementById("hotspotOverlay");
    const title = document.getElementById("hotspotTitle");
    const desc = document.getElementById("hotspotDesc");

    if (overlay && title && desc) {
      title.innerText = hotspot.name;
      desc.innerText = hotspot.desc;
      overlay.style.display = "block";
    }
  },

  showPinDetail(pinKey) {
    const pinMap = {
      "minare-sol": {
        name: "Sol Çinili Minare (Tuğla ve Firuze Mozaik)",
        desc: "Taş kaide üzerine yükselen, sekizgen pabuçlu ve silindirik gövdeli sol minare. Tuğla örgü arasına kakılmış firuze sırlı çinilerle geometrik örgü motifleri işlenmiştir. Şerefe altındaki mukarnaslı friz Selçuklu minare sanatının şaheseridir."
      },
      "minare-sag": {
        name: "Sağ Çinili Minare (Tuğla ve Geometrik Çini)",
        desc: "Yapının anıtsal simetrisini tamamlayan sağ minare. Firuze ve kobalt mavisi sırlı tuğlalarla bezeli gövdesi, dönemin 'gök kubbeyi yeryüzüne indiren' estetik anlayışını yansıtır. Günümüze şerefe seviyesine kadar sağlam ulaşmıştır."
      },
      "kufi-sol": {
        name: "Sol Geometrik Kûfî Çini Pano",
        desc: "Taçkapının sol üst cephesinde, minare kaidesinin hemen altında yer alan firuze sırlı tuğla ve çini mozaik pano. Kare Kûfî (Ma'kıli) hatla işlenmiş mukaddes lafızlar ve geometrik kompozisyonlar yer alır."
      },
      "kufi-sag": {
        name: "Sağ Geometrik Kûfî Çini Pano",
        desc: "Taçkapının sağ üst köşesindeki simetrik çini panosu. Çini ustalarının taş işçiliği ile sırlı tuğlayı kusursuz birleştirdiği 1271 yılındaki yüksek mimari ve zanaat dehasını kanıtlar."
      },
      "tackapi": {
        name: "Mukarnaslı Anıtsal Taçkapı ve Vakfiye Kitabesi",
        desc: "Kalker taşından oyulmuş derin mukarnas kavsaralı, bitkisel rumi ve palmet kabartmalarıyla bezeli anıtsal taçkapı. Üzerindeki celî sülüs kitabelerde yapının 1271 (H. 670) yılında İlhanlı Veziri Şemseddin Cüveyni tarafından yaptırıldığı tescil edilmiştir."
      },
      "eyvan-sol": {
        name: "Sol Giriş Yan Nişi ve Kemerli Eyvan",
        desc: "Taçkapıyı sol kanattan destekleyen derin sivri kemerli yan niş. Giriş cephesine anıtsallık ve statik dayanım kazandıran dışa taşkın taş mimari ögedir."
      },
      "eyvan-sag": {
        name: "Sağ Giriş Yan Nişi ve Kemerli Eyvan",
        desc: "Giriş cephesinin sağ kanadında yer alan simetrik kemerli niş. Taş yüzeydeki derin gölge-ışık oyunları, Selçuklu taş kabartma sanatının zirvesini temsil eder."
      }
    };

    const item = pinMap[pinKey];
    if (item) {
      this.showHotspotDetail(item);
    }
  },

  // --------------------------------------------------------------------------
  // 6. DİJİTAL BİLGİ KİTABESİ MODALI (8 ZORUNLU ALANLI TAŞ LEVHA)
  // --------------------------------------------------------------------------
  openDigitalTabletModalById(monumentId) {
    const monument = window.SIVAS_MONUMENTS.find((m) => m.id === monumentId);
    if (monument) this.openDigitalTabletModal(monument);
  },

  openCurrentTablet() {
    if (this.viewer3D && this.viewer3D.currentMonument) {
      this.openDigitalTabletModal(this.viewer3D.currentMonument);
    } else {
      this.openDigitalTabletModalById("cifte-minareli-medrese");
    }
  },

  openDigitalTabletModal(monument) {
    this.activeMonument = monument;
    const modal = document.getElementById("modalDigitalTablet");
    const grid = document.getElementById("tabletContentGrid");
    const t = monument.digitalTablet;

    if (!modal || !grid || !t) return;

    grid.innerHTML = `
      <div class="tablet-field">
        <label>1. Eserin Adı</label>
        <p><strong>${t.name}</strong></p>
      </div>
      <div class="tablet-field">
        <label>2. İnşa Tarihi</label>
        <p>${t.buildDate}</p>
      </div>
      <div class="tablet-field">
        <label>3. Ait Olduğu Dönem</label>
        <p>${t.period}</p>
      </div>
      <div class="tablet-field">
        <label>4. Yaptıran Kişi / Kurum (Bani)</label>
        <p>${t.patron}</p>
      </div>
      <div class="tablet-field full-span">
        <label>5. Özgün Kullanım Amacı</label>
        <p>${t.originalFunction}</p>
      </div>
      <div class="tablet-field full-span">
        <label>6. Mimari Özellikleri</label>
        <p>${t.architecturalFeatures}</p>
      </div>
      <div class="tablet-field full-span">
        <label>7. Tarihsel Önemi</label>
        <p>${t.historicalImportance}</p>
      </div>
      <div class="tablet-field full-span">
        <label>8. Günümüzdeki Kullanım Durumu</label>
        <p>${t.currentStatus}</p>
      </div>
    `;

    document.getElementById("btnSwitchToRealInscription").onclick = () => {
      this.closeModals();
      this.openRealInscriptionModal(monument);
    };

    modal.style.display = "flex";
  },

  // --------------------------------------------------------------------------
  // 7. GERÇEK TARİHÎ KİTABE İNCELEMESİ (ORİJİNAL ARAPÇA / TRANSKRİPSİYON / ANLAM)
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // 7. GERÇEK TARİHÎ KİTABE İNCELEME MODALI (EPİGRAFİK FİLTRELER & KANIT ANALİZİ)
  // --------------------------------------------------------------------------
  openRealInscriptionModal(monument) {
    if (!monument) return;

    const modal = document.getElementById("modalRealInscription");
    const ins = monument.realInscription;
    if (!modal || !ins) return;

    document.getElementById("insTitle").innerText = `${monument.name} – Özgün Taş Kitabesi`;
    document.getElementById("insLocation").innerText = `Kitabe Konumu: ${ins.location}`;
    document.getElementById("insArabic").innerText = ins.originalScript;
    document.getElementById("insTranscription").innerText = ins.transcription;
    document.getElementById("insTranslation").innerText = ins.translation;

    // Gerçek Kitabe Fotoğrafı ve Epigrafik Filtreler
    const photoImg = document.getElementById("insPhoto");
    if (photoImg) {
      photoImg.src = monument.id === "cifte-minareli-medrese" ? "assets/images/cifte_minareli_3d.jpg" : monument.thumbnail;
      photoImg.className = "ins-filter-normal";
    }

    // Epigrafik Filtre Düğmeleri (Normal, Yüksek Kontrast, Kabartma, Negatif)
    document.querySelectorAll(".btn-filter-epigraphy").forEach((btn) => {
      btn.onclick = () => {
        document.querySelectorAll(".btn-filter-epigraphy").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const filterType = btn.getAttribute("data-filter");
        if (photoImg) {
          photoImg.className = `ins-filter-${filterType}`;
        }
      };
    });

    // Kitabeden Elde Edilen Kanıtlar Listesi
    const evidenceList = document.getElementById("insEvidenceList");
    if (evidenceList) {
      evidenceList.innerHTML = `
        <li><strong>Bani (Yaptıran):</strong> ${monument.builder || 'Bilinmiyor'}</li>
        <li><strong>Dönem Hükümdarı:</strong> ${monument.period}</li>
        <li><strong>İnşa Yılı:</strong> ${monument.buildYear}</li>
        <li><strong>Özgün İşlev:</strong> ${monument.type}</li>
      `;
    }

    // Doğrulama Durumu
    const verEl = document.getElementById("insVerification");
    if (verEl) {
      verEl.innerHTML = `
        <i class="fa-solid fa-shield-halved"></i>
        <div>
          <strong>Bilimsel Tescil & Doğrulama:</strong>
          <p>${ins.verificationStatus}</p>
        </div>
      `;
    }

    // Öğrenci Kitabe Yorumu (LocalStorage)
    const storageKey = `sivas_ins_inference_${monument.id}`;
    const savedInference = localStorage.getItem(storageKey) || "";
    const txtBox = document.getElementById("txtInscriptionInference");
    const statusPill = document.getElementById("saveStatusInscription");
    if (txtBox) txtBox.value = savedInference;
    if (statusPill) statusPill.innerText = savedInference ? "Kayıtlı yorumunuz yüklendi." : "";

    document.getElementById("btnSaveInscriptionInference").onclick = () => {
      if (txtBox) {
        localStorage.setItem(storageKey, txtBox.value);
        if (statusPill) {
          statusPill.innerText = "✓ Yorumunuz başarıyla kaydedildi.";
          setTimeout(() => (statusPill.innerText = ""), 3000);
        }
      }
    };

    // Rehber Yönlendirmesi
    if (window.SIVAS_GUIDES) {
      window.SIVAS_GUIDES.showSpeech(
        `${monument.name} kitabesindeki bani ismine ve yapım yılına dikkat et. Filtreleri kullanarak taş oymaları inceleyebilirsin!`,
        "inscription"
      );
    }

    modal.style.display = "flex";
  },

  // --------------------------------------------------------------------------
  // 8. 14 BAŞLIKLI AKADEMİK ESER İNCELEME MODALI
  // --------------------------------------------------------------------------
  openMonumentDetail(monumentId) {
    const monument = window.SIVAS_MONUMENTS.find((m) => m.id === monumentId);
    if (!monument) return;

    this.activeMonument = monument;
    const modal = document.getElementById("modalMonumentDetail");

    // Başlık ve Kimlik Bilgileri
    document.getElementById("detailTitle").innerText = monument.name;
    const periodBadge = document.getElementById("detailPeriod");
    if (periodBadge) {
      periodBadge.innerText = monument.period;
      periodBadge.className = `period-badge ${monument.periodGroup || 'selcuklu'}`;
    }
    const distTag = document.getElementById("detailDistrictTag");
    if (distTag) distTag.innerHTML = `<i class="fa-solid fa-map-pin"></i> ${monument.district || 'Merkez'}`;
    document.getElementById("detailMeta").innerText = `İnşa: ${monument.buildYear} • Bani: ${monument.builder || 'Vakıf'} • Mimarlık: ${monument.architect || 'Geleneksel Usta'}`;

    // 1. Sekme: Tarihsel Kimlik ve Bağlam (Maddeler 1, 2, 3, 4)
    document.getElementById("detailWrittenText").innerHTML = `<p>${monument.writtenHistory}</p>`;
    document.getElementById("specType").innerText = monument.type || 'Tarihî Yapı';
    document.getElementById("specYear").innerText = monument.buildYear || '-';
    document.getElementById("specPeriod").innerText = monument.period || '-';
    document.getElementById("specBuilder").innerText = monument.builder || 'Bilinmiyor';
    document.getElementById("specArchitect").innerText = monument.architect || 'Geleneksel Selçuklu/Osmanlı Ustası';
    document.getElementById("specFunction").innerText = monument.digitalTablet ? monument.digitalTablet.originalFunction : monument.type;

    // Sesli Rehber Metni
    if (monument.audioGuide) {
      document.getElementById("detailAudioTranscript").innerText = monument.audioGuide.text;
      this.setupAudioGuide(monument.audioGuide.text);
    }

    // 2. Sekme: Mimari, Plan ve Süsleme (Maddeler 5, 6)
    const cmp = monument.comparisonData || {};
    document.getElementById("archPlanDesc").innerText = cmp.plan || "Dört eyvanlı veya avlulu geleneksel plan düzeni.";
    document.getElementById("archStoneworkDesc").innerText = cmp.stonework || "Yöresel kalker ve mermer üzeri kabartma mukarnas, rumi ve geometrik bezemeler.";

    // Hotspot Çipleri
    const chipsContainer = document.getElementById("detailHotspotsChips");
    if (chipsContainer && monument.hotspots) {
      chipsContainer.innerHTML = monument.hotspots
        .map((h) => `<span class="hotspot-chip" onclick="SivasApp.closeModals(); SivasApp.open3DForMonument('${monument.id}');"><i class="fa-solid fa-eye"></i> ${h.name}</span>`)
        .join("");
    }

    // 3. Sekme: Kitabeler ve Yazılı Kanıtlar (Maddeler 7, 12)
    const ins = monument.realInscription;
    if (ins) {
      document.getElementById("detailInsLocation").innerText = `Konum: ${ins.location}`;
      document.getElementById("detailInsArabic").innerText = ins.originalScript;
      document.getElementById("detailInsTranslation").innerText = ins.translation;
      document.getElementById("detailInsEvidenceText").innerText = `Kitabe; baninin ${monument.builder} olduğunu ve ${monument.buildYear} yılında inşa edildiğini birinci elden kanıtlar.`;
      document.getElementById("btnOpenFullInscriptionFromDetail").onclick = () => {
        this.openRealInscriptionModal(monument);
      };
    }

    // 4. Sekme: Değişim, Kazı ve Restorasyon (Maddeler 8, 9, 11)
    const cond = monument.condition || {};
    document.getElementById("evoSurvivingNote").innerText = cond.survivingNote || `Günümüze ${cond.surviving || 'ana gövdesi'} ulaşmıştır; zaman içerisindeki kayıplar tescillidir.`;
    document.getElementById("evoCurrentStatus").innerText = cmp.currentUsage || "Kültürel miras olarak koruma altındadır.";
    document.getElementById("btnEvoGo3D").onclick = () => {
      this.closeModals();
      this.open3DForMonument(monument.id);
    };

    // 5. Sekme: Gerçek Fotoğraf Galerisi (Madde 10)
    const mainImgSrc = monument.id === "cifte-minareli-medrese" ? "assets/images/cifte_minareli_3d.jpg" : monument.thumbnail;
    const galleryMain = document.getElementById("detailGalleryMainImg");
    if (galleryMain) galleryMain.src = mainImgSrc;

    const galleryGrid = document.getElementById("detailGalleryGrid");
    if (galleryGrid) {
      galleryGrid.innerHTML = `
        <div class="gallery-thumb-item active" onclick="document.getElementById('detailGalleryMainImg').src='${mainImgSrc}';">
          <img src="${mainImgSrc}" alt="${monument.name}" />
          <span>Ön Cephe</span>
        </div>
        <div class="gallery-thumb-item" onclick="document.getElementById('detailGalleryMainImg').src='${monument.thumbnail}';">
          <img src="${monument.thumbnail}" alt="Taçkapı Detayı" />
          <span>Taçkapı & Süsleme</span>
        </div>
      `;
    }

    // 6. Sekme: Çıkarım Soruları & Bilimsel Kaynakça (Maddeler 13, 14)
    const inquiryList = document.getElementById("detailInquiryList");
    if (inquiryList && monument.fieldStudy && monument.fieldStudy.tasks) {
      inquiryList.innerHTML = monument.fieldStudy.tasks
        .map((task, idx) => `<li><strong>Soru ${idx + 1}:</strong> ${task}</li>`)
        .join("");
    }

    const sourcesList = document.getElementById("detailSourcesList");
    if (sourcesList && monument.references) {
      sourcesList.innerHTML = monument.references.map((ref) => `<li><i class="fa-solid fa-bookmark"></i> ${ref}</li>`).join("");
    }

    // Üst Araç Butonları
    document.getElementById("btnDetailOpen3D").onclick = () => {
      this.closeModals();
      this.open3DForMonument(monument.id);
    };
    document.getElementById("btnDetailOpenTablet").onclick = () => {
      this.openRealInscriptionModal(monument);
    };

    // Sekme Geçiş Dinleyicileri
    document.querySelectorAll(".l-tab-btn").forEach((btn) => {
      btn.onclick = () => {
        document.querySelectorAll(".l-tab-btn").forEach((b) => b.classList.remove("active"));
        document.querySelectorAll(".l-tab-pane").forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        const target = btn.getAttribute("data-ltab");
        document.getElementById(target)?.classList.add("active");
      };
    });

    // İlk sekmeyi aktif yap
    document.querySelector('.l-tab-btn[data-ltab="ltab-identity"]')?.click();

    // Rehber Yönlendirmesi
    if (window.SIVAS_GUIDES) {
      window.SIVAS_GUIDES.showSpeech(
        `${monument.name} eserinin 14 başlıklı derinlemesine incelemesine hoş geldin! Kitabe ve mimari süsleme sekmelerine mutlaka göz at!`,
        "monuments"
      );
    }

    modal.style.display = "flex";
  },

  setupAudioGuide(text) {
    const playBtn = document.getElementById("btnAudioPlay");
    const restartBtn = document.getElementById("btnAudioRestart");
    const progressFill = document.getElementById("audioProgressFill");

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      this.isAudioPlaying = false;
      playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;

      this.audioUtterance = new SpeechSynthesisUtterance(text);
      this.audioUtterance.lang = "tr-TR";
      this.audioUtterance.rate = 0.95;

      this.audioUtterance.onend = () => {
        this.isAudioPlaying = false;
        playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
        progressFill.style.width = "100%";
      };

      playBtn.onclick = () => {
        if (!this.isAudioPlaying) {
          window.speechSynthesis.speak(this.audioUtterance);
          this.isAudioPlaying = true;
          playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
        } else {
          window.speechSynthesis.pause();
          this.isAudioPlaying = false;
          playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
        }
      };

      restartBtn.onclick = () => {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(this.audioUtterance);
        this.isAudioPlaying = true;
        playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
      };
    }
  },

  closeModals() {
    document.querySelectorAll(".atlas-modal").forEach((m) => (m.style.display = "none"));
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  },

  // --------------------------------------------------------------------------
  // 9. KARŞILAŞTIRMALI TARİH İNCELEME MODÜLÜ (10 ÖLÇÜT)
  // --------------------------------------------------------------------------
  initComparisonModule() {
    const sel1 = document.getElementById("compareSelect1");
    const sel2 = document.getElementById("compareSelect2");
    const sel3 = document.getElementById("compareSelect3");

    if (!sel1 || !sel2 || !sel3) return;

    const optionsHtml = window.SIVAS_MONUMENTS.map(
      (m) => `<option value="${m.id}">${m.name} (${m.buildYear})</option>`
    ).join("");

    sel1.innerHTML = optionsHtml;
    sel2.innerHTML = optionsHtml;
    sel3.innerHTML = `<option value="none">-- Seçilmedi (2'li Karşılaştırma) --</option>` + optionsHtml;

    // Varsayılan: Çifte Minareli vs Gök Medrese
    sel1.value = "cifte-minareli-medrese";
    sel2.value = "gok-medrese";

    const updateTable = () => this.renderComparisonTable(sel1.value, sel2.value, sel3.value);

    sel1.addEventListener("change", updateTable);
    sel2.addEventListener("change", updateTable);
    sel3.addEventListener("change", updateTable);

    // Hızlı Kıyaslama Butonları
    document.getElementById("btnPreset1271")?.addEventListener("click", () => {
      sel1.value = "cifte-minareli-medrese";
      sel2.value = "gok-medrese";
      sel3.value = "buruciye-medresesi";
      updateTable();
    });

    document.getElementById("btnPresetDarussifa")?.addEventListener("click", () => {
      sel1.value = "sifaiye-medresesi";
      sel2.value = "divrigi-ulu-camii";
      sel3.value = "none";
      updateTable();
    });

    // Kayıtlı 4 Aşamalı Araştırma Verilerini Yükle
    const savedClaim = localStorage.getItem("sivas_inquiry_claim");
    if (savedClaim && document.getElementById("txtInferenceClaim")) {
      document.getElementById("txtInferenceClaim").value = savedClaim;
    }
    const savedEvidence = localStorage.getItem("sivas_inquiry_evidence");
    if (savedEvidence && document.getElementById("txtInferenceEvidence")) {
      document.getElementById("txtInferenceEvidence").value = savedEvidence;
    }
    const savedReasoning = localStorage.getItem("sivas_inquiry_reasoning");
    if (savedReasoning && document.getElementById("txtInferenceReasoning")) {
      document.getElementById("txtInferenceReasoning").value = savedReasoning;
    }
    const savedInference = localStorage.getItem("sivas_student_inference");
    if (savedInference && document.getElementById("txtStudentInference")) {
      document.getElementById("txtStudentInference").value = savedInference;
    }

    // 4 Aşamalı Çıkarımı Kaydet
    document.getElementById("btnSaveInference")?.addEventListener("click", () => {
      const claim = document.getElementById("txtInferenceClaim")?.value || "";
      const evidence = document.getElementById("txtInferenceEvidence")?.value || "";
      const reasoning = document.getElementById("txtInferenceReasoning")?.value || "";
      const inference = document.getElementById("txtStudentInference")?.value || "";

      localStorage.setItem("sivas_inquiry_claim", claim);
      localStorage.setItem("sivas_inquiry_evidence", evidence);
      localStorage.setItem("sivas_inquiry_reasoning", reasoning);
      localStorage.setItem("sivas_student_inference", inference);

      const status = document.getElementById("saveStatusInference");
      if (status) {
        status.innerText = "✓ 4 Aşamalı Tarihsel Araştırma Çıkarımınız Başarıyla Kaydedildi.";
        setTimeout(() => (status.innerText = ""), 3500);
      }
    });

    // Rapor Yazdır / PDF İndir
    document.getElementById("btnExportInference")?.addEventListener("click", () => {
      window.print();
    });

    updateTable();
  },

  renderComparisonTable(id1, id2, id3) {
    const m1 = window.SIVAS_MONUMENTS.find((m) => m.id === id1);
    const m2 = window.SIVAS_MONUMENTS.find((m) => m.id === id2);
    const m3 = id3 !== "none" ? window.SIVAS_MONUMENTS.find((m) => m.id === id3) : null;

    if (!m1 || !m2) return;

    document.getElementById("thEser1").innerText = m1.name;
    document.getElementById("thEser2").innerText = m2.name;
    document.getElementById("thEser3").innerText = m3 ? m3.name : "-";

    const criteria = [
      { key: "buildYear", label: "1. İnşa Tarihi" },
      { key: "period", label: "2. Tarihî Dönem" },
      { key: "patron", label: "3. Yaptıran Kişi (Bani)" },
      { key: "purpose", label: "4. Yapım Amacı" },
      { key: "plan", label: "5. Mimari Plan" },
      { key: "materials", label: "6. Kullanılan Yapı Malzemeleri" },
      { key: "stonework", label: "7. Taş İşçiliği ve Süslemeler" },
      { key: "function", label: "8. Toplumsal ve Kültürel İşlev" },
      { key: "changes", label: "9. Zaman İçinde Geçirdiği Değişimler" },
      { key: "currentUsage", label: "10. Günümüzdeki Kullanım Durumu" }
    ];

    const tbody = document.getElementById("comparisonTableBody");
    tbody.innerHTML = criteria
      .map(
        (c) => `
        <tr>
          <td class="crit-col">${c.label}</td>
          <td>${(m1.comparisonData && m1.comparisonData[c.key]) || "-"}</td>
          <td>${(m2.comparisonData && m2.comparisonData[c.key]) || "-"}</td>
          <td>${m3 ? ((m3.comparisonData && m3.comparisonData[c.key]) || "-") : "-"}</td>
        </tr>
      `
      )
      .join("");
  },
  initTimeline() {
    const track = document.getElementById("timelineTrack");
    if (!track) return;

    // Kronolojik Sıralama
    const sorted = [...window.SIVAS_MONUMENTS].sort((a, b) => {
      const getYear = (str) => parseInt(str.match(/\d{4}/)?.[0] || "0");
      return getYear(a.buildYear) - getYear(b.buildYear);
    });

    track.innerHTML = sorted
      .map(
        (m) => `
        <div class="timeline-item" onclick="SivasApp.openMonumentDetail('${m.id}')">
          <div class="timeline-header-flex">
            <span class="timeline-year">${m.buildYear}</span>
            <span class="period-badge ${m.periodGroup}">${m.period}</span>
          </div>
          <div class="timeline-title">${m.name}</div>
          <p class="timeline-desc">${m.digitalTablet.historicalImportance}</p>
        </div>
      `
      )
      .join("");
  },

  // --------------------------------------------------------------------------
  // 11. OKUL DIŞI ÖĞRENME: GÖREVLER VE ÖN/SON TEST
  // --------------------------------------------------------------------------
  initFieldworkModule() {
    // Dijital vs Yerinde Keşif Mod Değişimi
    const btnDigital = document.getElementById("btnModeDigital");
    const btnPhysical = document.getElementById("btnModePhysical");
    const title = document.getElementById("modeCardTitle");
    const desc = document.getElementById("modeCardDesc");
    const list = document.getElementById("tasksChecklist");

    const digitalTasks = [
      "Çifte Minareli Medrese'nin 3B modelinde 'Yıkılmış Avlu' katmanını açınız ve 1963 kazı planını inceleyiniz.",
      "Gök Medrese'nin mermer taçkapısındaki 'Hayat Ağacı' kabartmasını 360 derece döndürerek bulunuz.",
      "Sivas Ulu Camii minaresinin eğikliğini Three.js sahnesinde farklı açılardan gözlemleyiniz.",
      "Divriği Cennet Kapısı ile Şifaiye Medresesi kapısındaki motif yoğunluğunu karşılaştırınız."
    ];

    const physicalTasks = [
      "Sivas Tarihî Kent Meydanı'nda durarak Çifte Minareli ile Şifaiye Medresesi taçkapılarının birbirine bakış açısını not ediniz.",
      "Kale Camii'nin doğu duvarındaki minyatür taş kuşevini yerinde bulup fotoğrafını çekiniz.",
      "Kızılırmak üzerindeki Eğri Köprü'nün 130 derecelik kırık aksını köprü üstünde yürüyerek adımlayınız.",
      "Atatürk Kongre Müzesi'ndeki telgraf odasında Mustafa Kemal Paşa'nın masasını ziyaret ediniz."
    ];

    const renderTasks = (tasks) => {
      if (list) {
        list.innerHTML = tasks
          .map(
            (t, idx) => `
            <label class="task-item">
              <input type="checkbox" id="taskChk_${idx}">
              <span>${t}</span>
            </label>
          `
          )
          .join("");
      }
    };

    btnDigital?.addEventListener("click", () => {
      btnDigital.classList.add("active");
      btnPhysical?.classList.remove("active");
      if (title) title.innerHTML = `<i class="fa-solid fa-laptop"></i> 1. Dijital Gezi Gözlem Görevleri (Sınıf/Ev)`;
      if (desc) desc.innerText = "3B dijital modeller üzerinden tamamlamanız gereken keşif adımları:";
      renderTasks(digitalTasks);
    });

    btnPhysical?.addEventListener("click", () => {
      btnPhysical.classList.add("active");
      btnDigital?.classList.remove("active");
      if (title) title.innerHTML = `<i class="fa-solid fa-person-walking"></i> 2. Yerinde Keşif Saha Görevleri (Mekânda)`;
      if (desc) desc.innerText = "Sivas'taki tarihî yapılara yapacağınız okul dışı saha gezisinde tamamlanacak adımlar:";
      renderTasks(physicalTasks);
    });

    renderTasks(digitalTasks);

    // Gözlem Notlarını Kaydet
    document.getElementById("btnSaveFieldNotes")?.addEventListener("click", () => {
      const val = document.getElementById("txtFieldNotes")?.value;
      localStorage.setItem("sivas_field_notes", val);
      alert("✓ Saha gözlem notlarınız başarıyla kaydedildi.");
    });
  },

  // --------------------------------------------------------------------------
  // TÜBİTAK 2204-B ÖLÇME & DEĞERLENDİRME MODÜLÜ (ÖN TEST & SON TEST)
  // --------------------------------------------------------------------------
  initEvaluation() {
    this.renderAssessmentQuestions();

    document.getElementById("btnTogglePreTest")?.addEventListener("click", () => {
      this.testMode = "pre";
      document.getElementById("btnTogglePreTest").classList.add("active");
      document.getElementById("btnTogglePostTest")?.classList.remove("active");
      const info = document.getElementById("testInfoText");
      if (info) info.innerText = "Gezi ÖNCESİ bilgi ve kanıt okuma düzeyinizi ölçmek için 5 bilimsel soruyu yanıtlayınız.";
    });

    document.getElementById("btnTogglePostTest")?.addEventListener("click", () => {
      this.testMode = "post";
      document.getElementById("btnTogglePostTest").classList.add("active");
      document.getElementById("btnTogglePreTest")?.classList.remove("active");
      const info = document.getElementById("testInfoText");
      if (info) info.innerText = "Gezi SONRASI edindiğiniz tarihsel çıkarım ve öğrenme kazanımlarını ölçmek için 5 soruyu yanıtlayınız.";
    });

    document.getElementById("btnSubmitTest")?.addEventListener("click", () => {
      this.gradeAssessment();
    });

    document.getElementById("btnExportTestResults")?.addEventListener("click", () => {
      this.exportTestResultsCsv();
    });
  },

  renderAssessmentQuestions() {
    const form = document.getElementById("assessmentForm");
    const evalData = window.SIVAS_EVALUATION || window.SIVAS_ASSESSMENT;
    if (!form || !evalData || !evalData.questions) return;

    form.innerHTML = evalData.questions
      .map(
        (q, qIdx) => `
        <div class="q-block">
          <div class="q-header-row">
            <span class="q-num">${qIdx + 1}. Soru</span>
            ${q.dimension ? `<span class="badge-evidence ${q.dimension.includes('Kanıt') ? 'verified' : 'academic'}">${q.dimension}</span>` : ''}
          </div>
          <div class="q-text">${q.question}</div>
          <div class="q-options">
            ${q.options
              .map(
                (opt, oIdx) => `
              <label class="q-opt">
                <input type="radio" name="${q.id}" value="${oIdx}">
                <span>${opt}</span>
              </label>
            `
              )
              .join("")}
          </div>
        </div>
      `
      )
      .join("");
  },

  gradeAssessment() {
    const evalData = window.SIVAS_EVALUATION || window.SIVAS_ASSESSMENT;
    if (!evalData || !evalData.questions) return;

    let score = 0;
    const questions = evalData.questions;
    const userAnswers = {};

    questions.forEach((q) => {
      const selected = document.querySelector(`input[name="${q.id}"]:checked`);
      const val = selected ? parseInt(selected.value) : -1;
      userAnswers[q.id] = val;
      const targetCorrect = typeof q.correctIndex !== 'undefined' ? q.correctIndex : q.correct;
      if (val === targetCorrect) {
        score++;
      }
    });

    this.testScores[this.testMode] = score;

    // Sonucu Kalıcı Olarak Kaydet
    if (window.SIVAS_EVALUATION && typeof window.SIVAS_EVALUATION.saveTestResult === 'function') {
      const openResp = document.getElementById("txtFieldNotes")?.value || "";
      window.SIVAS_EVALUATION.saveTestResult(
        "Öğrenci-" + (localStorage.getItem("sivas_student_code") || Math.floor(100 + Math.random() * 900)),
        this.testMode,
        userAnswers,
        score,
        openResp
      );
    }

    const resultBox = document.getElementById("testResultBox");
    const scoreNum = document.getElementById("scoreNum");
    const scoreLabel = document.getElementById("scoreLabel");
    const feedback = document.getElementById("scoreFeedback");

    if (scoreNum) scoreNum.innerText = `${score} / ${questions.length}`;
    if (scoreLabel) scoreLabel.innerText = this.testMode === "pre" ? "Ön Test Puanı" : "Son Test Puanı";

    let fbText = "";
    if (this.testScores.pre !== null && this.testScores.post !== null) {
      const diff = this.testScores.post - this.testScores.pre;
      fbText = `TÜBİTAK 2204-B Başarı Değerlendirmesi: Ön Test: ${this.testScores.pre} Puan | Son Test: ${this.testScores.post} Puan. Öğrenme Kazanımı Artışı: +${diff} net doğru! Harika bir akademik gelişim sergilediniz.`;
    } else {
      fbText = `Tebrikler! ${this.testMode === 'pre' ? 'Ön Testi' : 'Son Testi'} başarıyla tamamladınız. ${score >= 4 ? 'Üstün bir kültürel miras ve kanıt okuma kavrayışı sergilediniz.' : 'Eser detaylarını ve kitabeleri tekrar inceleyerek bilginizi pekiştirebilirsiniz.'}`;
    }

    if (feedback) feedback.innerText = fbText;
    if (resultBox) resultBox.style.display = "block";

    // Dijital Rehber Eren/Aybüke Konuşması
    if (window.SIVAS_GUIDES) {
      const guideText = `Tebrik ederim! ${this.testMode === 'pre' ? 'Ön test' : 'Son test'} sonucun: ${score}/${questions.length}. Şimdi test sonuçlarını CSV formatında indirerek TÜBİTAK proje raporuna ekleyebilirsin!`;
      window.SIVAS_GUIDES.showSpeech(guideText, "fieldwork");
    }
  },

  exportTestResultsCsv() {
    if (window.SIVAS_EVALUATION && typeof window.SIVAS_EVALUATION.exportToCsv === 'function') {
      window.SIVAS_EVALUATION.exportToCsv();
    } else {
      const csvContent =
        "\uFEFF" +
        "Test_Türü;Puan;Toplam_Soru;Tarih\n" +
        `Ön Test;${this.testScores.pre || 0};5;${new Date().toLocaleDateString()}\n` +
        `Son Test;${this.testScores.post || 0};5;${new Date().toLocaleDateString()}\n`;

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.setAttribute("href", URL.createObjectURL(blob));
      link.setAttribute("download", `tubitak_2204b_sivas_test_verileri_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },
  initMapPicker() {
    const btnOpen = document.getElementById("btnOpenMapPicker");
    const pickerSvg = document.getElementById("pickerSvgMap");
    const confirmBtn = document.getElementById("btnConfirmMapPicker");

    btnOpen?.addEventListener("click", () => {
      this.openMapPicker();
    });

    pickerSvg?.addEventListener("click", (e) => {
      const rect = pickerSvg.getBoundingClientRect();
      const scaleX = 1000 / rect.width;
      const scaleY = 760 / rect.height;
      let x = Math.round((e.clientX - rect.left) * scaleX);
      let y = Math.round((e.clientY - rect.top) * scaleY);
      x = Math.max(10, Math.min(990, x));
      y = Math.max(10, Math.min(750, y));

      this.pickerCoords = { x, y };
      this.updatePickerMarkerPosition(x, y);

      // Sınır ve İlçe Eşleşme Kontrolü (Ray-Casting Poligon Doğrulaması)
      const hitDist = window.SIVAS_MAP_DATA.getDistrictAtPoint ? window.SIVAS_MAP_DATA.getDistrictAtPoint(x, y) : null;
      const selDistVal = document.getElementById("admDistrict")?.value || "merkez";
      const warnBanner = document.getElementById("pickerDistrictWarning");
      const warnText = document.getElementById("pickerWarningText");

      if (!hitDist) {
        if (warnText) warnText.innerText = "Uyarı: Seçilen nokta Sivas ilçe sınırlarının dışında veya harita kenarında kalmaktadır.";
        if (warnBanner) warnBanner.style.display = "flex";
      } else if (hitDist.id !== selDistVal.toLowerCase() && hitDist.name.toLowerCase() !== selDistVal.toLowerCase()) {
        const targetDistObj = window.SIVAS_MAP_DATA.districts.find((d) => d.id === selDistVal.toLowerCase());
        const tName = targetDistObj ? targetDistObj.name : selDistVal;
        if (warnText) {
          warnText.innerText = `İpucu / Uyarı: Tıkladığınız nokta "${hitDist.name}" ilçesi sınırları içinde kalıyor. Formda seçili ilçe ise "${tName}". Lütfen doğru noktayı seçiniz veya formdaki ilçeyi güncelleyiniz.`;
        }
        if (warnBanner) warnBanner.style.display = "flex";
      } else {
        if (warnBanner) warnBanner.style.display = "none";
      }
    });

    confirmBtn?.addEventListener("click", () => {
      if (this.pickerCoords) {
        const xInput = document.getElementById("admSvgX");
        const yInput = document.getElementById("admSvgY");
        const lbl = document.getElementById("lblPickedCoords");
        if (xInput) xInput.value = this.pickerCoords.x;
        if (yInput) yInput.value = this.pickerCoords.y;
        if (lbl) {
          lbl.innerHTML = `<i class="fa-solid fa-location-dot" style="color:#f59e0b;"></i> Konum: X: ${this.pickerCoords.x}, Y: ${this.pickerCoords.y} (Özel Harita Noktası)`;
        }
      }
      this.closeMapPicker();
    });
  },

  openMapPicker() {
    const modal = document.getElementById("modalMapPicker");
    if (!modal) return;

    const selDistVal = document.getElementById("admDistrict")?.value || "merkez";
    const distObj = window.SIVAS_MAP_DATA.districts.find(
      (d) => d.id === selDistVal.toLowerCase() || d.name.toLowerCase() === selDistVal.toLowerCase()
    );

    const targetLabel = document.getElementById("pickerTargetDistrictLabel");
    if (targetLabel && distObj) {
      targetLabel.innerHTML = `<i class="fa-solid fa-compass"></i> Hedef İlçe: <strong>${distObj.name}</strong>`;
    }

    // Picker Haritasında 17 İlçeyi Çiz ve Hedef İlçeyi Vurgula
    const pDistGroup = document.getElementById("pickerDistrictsGroup");
    if (pDistGroup && window.SIVAS_MAP_DATA) {
      pDistGroup.innerHTML = window.SIVAS_MAP_DATA.districts
        .map(
          (d) => `
          <path id="picker-dist-${d.id}" class="district-polygon ${d.id === (distObj ? distObj.id : 'merkez') ? 'selected-district' : ''}" d="${d.path}" />
        `
        )
        .join("");
    }

    // Mevcut veya Varsayılan Konum
    const existingX = parseInt(document.getElementById("admSvgX")?.value);
    const existingY = parseInt(document.getElementById("admSvgY")?.value);

    let startX = distObj ? distObj.center.x : 423;
    let startY = distObj ? distObj.center.y : 403;

    if (!isNaN(existingX) && !isNaN(existingY) && existingX > 0 && existingY > 0) {
      startX = existingX;
      startY = existingY;
    }

    this.pickerCoords = { x: startX, y: startY };
    this.updatePickerMarkerPosition(startX, startY);

    const warnBanner = document.getElementById("pickerDistrictWarning");
    if (warnBanner) warnBanner.style.display = "none";

    modal.style.display = "flex";
  },

  updatePickerMarkerPosition(x, y) {
    const pin = document.getElementById("pickerPinMarker");
    const lbl = document.getElementById("lblPickerCoords");
    if (pin) {
      pin.setAttribute("transform", `translate(${x}, ${y})`);
      pin.style.display = "block";
    }
    if (lbl) {
      lbl.innerText = `X: ${x}, Y: ${y}`;
    }
  },

  closeMapPicker() {
    const modal = document.getElementById("modalMapPicker");
    if (modal) modal.style.display = "none";
  },

  // --------------------------------------------------------------------------
  // 13. YÖNETİM PANELİ (İÇERİK, DÜZENLEME, SİLME VE KALICI VERİ DEPOLAMA)
  // --------------------------------------------------------------------------
  populateAdminMonumentsDropdown() {
    const select = document.getElementById("admSelectMonument");
    if (!select || !window.SIVAS_MONUMENTS) return;

    select.innerHTML = `
      <option value="new">-- ➕ Yeni Tarihî Eser Ekle --</option>
      ${window.SIVAS_MONUMENTS.map(
        (m) => `<option value="${m.id}">${m.name} (${m.district || "Sivas"})</option>`
      ).join("")}
    `;

    if (this.editingMonumentId) {
      select.value = this.editingMonumentId;
    } else {
      select.value = "new";
    }
  },

  initAdminPanel() {
    this.isAdminUnlocked = false;
    const authOverlay = document.getElementById("adminAuthLock");
    const passInput = document.getElementById("txtAdminPassword");
    const btnUnlock = document.getElementById("btnUnlockAdmin");
    const authError = document.getElementById("adminAuthError");

    const checkPassword = () => {
      const val = (passInput?.value || "").trim().toLowerCase();
      if (val === "tubitak2204" || val === "admin58" || val === "sivas58" || val === "tubitak") {
        this.isAdminUnlocked = true;
        if (authOverlay) authOverlay.style.display = "none";
        if (authError) authError.style.display = "none";
      } else {
        if (authError) authError.style.display = "block";
      }
    };

    btnUnlock?.addEventListener("click", checkPassword);
    passInput?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        checkPassword();
      }
    });

    // JSON Veritabanı Yedekleme (Dışa Aktar)
    const exportJsonHandler = () => {
      const backupObj = {
        project: "TÜBİTAK 2204-B Sivas'ın Dijital Tarih Atlası",
        exportDate: new Date().toISOString(),
        monumentsCount: window.SIVAS_MONUMENTS.length,
        monuments: window.SIVAS_MONUMENTS,
        customMonuments: JSON.parse(localStorage.getItem("sivas_custom_monuments") || "[]"),
        deletedMonuments: JSON.parse(localStorage.getItem("sivas_deleted_monuments") || "[]"),
        evaluations: JSON.parse(localStorage.getItem("sivas_eval_results") || "[]")
      };
      const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `sivas_tarih_atlasi_veritabani_yedek_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    document.getElementById("btnExportJsonData")?.addEventListener("click", exportJsonHandler);
    document.getElementById("btnExportJSON")?.addEventListener("click", exportJsonHandler);

    // JSON Veritabanı Geri Yükleme (İçe Aktar)
    document.getElementById("btnImportJsonTrigger")?.addEventListener("click", () => {
      document.getElementById("fileImportJson")?.click();
    });

    document.getElementById("fileImportJson")?.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const parsed = JSON.parse(evt.target.result);
          const importedMonuments = Array.isArray(parsed) ? parsed : (parsed.monuments || parsed.customMonuments);
          if (!Array.isArray(importedMonuments) || importedMonuments.length === 0) {
            alert("Geçersiz JSON formatı! Dosyada 'monuments' dizisi bulunamadı.");
            return;
          }

          let customList = [];
          try {
            customList = JSON.parse(localStorage.getItem("sivas_custom_monuments") || "[]");
          } catch (err) {
            customList = [];
          }

          importedMonuments.forEach((im) => {
            const existIdx = customList.findIndex((m) => m.id === im.id);
            if (existIdx !== -1) {
              customList[existIdx] = im;
            } else {
              customList.push(im);
            }

            const runIdx = window.SIVAS_MONUMENTS.findIndex((m) => m.id === im.id);
            if (runIdx !== -1) {
              window.SIVAS_MONUMENTS[runIdx] = im;
            } else {
              window.SIVAS_MONUMENTS.push(im);
            }
          });

          localStorage.setItem("sivas_custom_monuments", JSON.stringify(customList));
          this.populateAdminMonumentsDropdown();
          this.renderMapMarkers();
          this.renderMonumentsGrid();
          alert(`✓ ${importedMonuments.length} adet tarihî eser başarıyla sisteme aktarıldı ve güncellendi!`);
        } catch (parseErr) {
          alert("JSON dosyası ayrıştırılamadı. Hata: " + parseErr.message);
        }
      };
      reader.readAsText(file);
    });

    const form = document.getElementById("adminMonumentForm");
    const selectMon = document.getElementById("admSelectMonument");
    const btnDelete = document.getElementById("btnDeleteMonument");
    const districtSelect = document.getElementById("admDistrict");

    // İlçe Değiştiğinde Varsayılan Konumu İlçe Merkezine Eşitle
    districtSelect?.addEventListener("change", (e) => {
      const distId = e.target.value;
      const distObj = window.SIVAS_MAP_DATA.districts.find((d) => d.id === distId);
      if (distObj && (!document.getElementById("admSvgX").value || this.editingMonumentId === null)) {
        document.getElementById("admSvgX").value = distObj.center.x;
        document.getElementById("admSvgY").value = distObj.center.y;
        const lbl = document.getElementById("lblPickedCoords");
        if (lbl) {
          lbl.innerHTML = `<i class="fa-solid fa-location-dot" style="color:#f59e0b;"></i> Konum: ${distObj.name} İlçe Merkezine Bağlandı`;
        }
      }
    });

    // Eser Seçildiğinde (Düzenleme veya Yeni Ekleme Modu)
    selectMon?.addEventListener("change", (e) => {
      const val = e.target.value;
      if (val === "new") {
        this.editingMonumentId = null;
        form.reset();
        document.getElementById("admSvgX").value = "";
        document.getElementById("admSvgY").value = "";
        document.getElementById("lblPickedCoords").innerHTML = `<i class="fa-solid fa-info-circle"></i> Konum: İlçe Merkezine Otomatik Bağlı`;
        document.getElementById("btnSaveMonument").innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Eseri Platforma Kaydet`;
        if (btnDelete) btnDelete.style.display = "none";
      } else {
        const mon = window.SIVAS_MONUMENTS.find((m) => m.id === val);
        if (mon) {
          this.editingMonumentId = mon.id;
          document.getElementById("admName").value = mon.name || "";

          // İlçe seçimi
          if (districtSelect && mon.district) {
            const foundDist = window.SIVAS_MAP_DATA.districts.find(
              (d) => d.name.toLowerCase() === mon.district.toLowerCase() || d.id === mon.district.toLowerCase()
            );
            if (foundDist) districtSelect.value = foundDist.id;
          }

          document.getElementById("admPeriod").value = mon.periodGroup || "selcuklu";
          document.getElementById("admBuildYear").value = mon.buildYear || "";
          document.getElementById("admType").value = mon.type || "";
          document.getElementById("admBuilder").value = mon.builder || "";
          document.getElementById("admHistory").value = mon.writtenHistory || "";
          document.getElementById("admAudioText").value = mon.audioGuide ? mon.audioGuide.text : "";

          const coords = this.getSvgCoordsForMonument(mon, false);
          document.getElementById("admSvgX").value = coords.x;
          document.getElementById("admSvgY").value = coords.y;
          document.getElementById("lblPickedCoords").innerHTML = `<i class="fa-solid fa-location-dot" style="color:#f59e0b;"></i> Konum: X: ${coords.x}, Y: ${coords.y}`;

          document.getElementById("btnSaveMonument").innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Değişiklikleri Güncelle`;
          if (btnDelete) btnDelete.style.display = "inline-flex";
        }
      }
    });

    // Silme Butonu
    btnDelete?.addEventListener("click", () => {
      if (!this.editingMonumentId) return;
      const targetMon = window.SIVAS_MONUMENTS.find((m) => m.id === this.editingMonumentId);
      const monName = targetMon ? targetMon.name : "Bu eser";

      if (confirm(`"${monName}" eserini sistemden silmek istediğinize emin misiniz?`)) {
        // Silinenler listesine kaydet
        let deletedList = [];
        try {
          deletedList = JSON.parse(localStorage.getItem("sivas_deleted_monuments") || "[]");
        } catch (e) {
          deletedList = [];
        }
        if (!deletedList.includes(this.editingMonumentId)) {
          deletedList.push(this.editingMonumentId);
          localStorage.setItem("sivas_deleted_monuments", JSON.stringify(deletedList));
        }

        // Custom listesinden çıkar
        let customList = [];
        try {
          customList = JSON.parse(localStorage.getItem("sivas_custom_monuments") || "[]");
          customList = customList.filter((m) => m.id !== this.editingMonumentId);
          localStorage.setItem("sivas_custom_monuments", JSON.stringify(customList));
        } catch (e) {}

        // Runtime listesinden sil
        const idx = window.SIVAS_MONUMENTS.findIndex((m) => m.id === this.editingMonumentId);
        if (idx !== -1) {
          window.SIVAS_MONUMENTS.splice(idx, 1);
        }

        this.editingMonumentId = null;
        form.reset();
        this.populateAdminMonumentsDropdown();
        this.renderMapMarkers();
        this.renderMonumentsGrid();

        if (this.selectedDistrict) {
          const distObj = window.SIVAS_MAP_DATA.districts.find((d) => d.id === this.selectedDistrict);
          if (distObj) this.renderDistrictInfoPanel(distObj);
        }

        this.closeModals();
        alert(`"${monName}" sistemden başarıyla silindi.`);
      }
    });

    // Form Gönderimi (Ekleme / Güncelleme)
    form?.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameVal = document.getElementById("admName").value.trim();
      const distId = document.getElementById("admDistrict").value;
      const distObj = window.SIVAS_MAP_DATA.districts.find((d) => d.id === distId);
      const distName = distObj ? distObj.name : "Sivas";

      const periodVal = document.getElementById("admPeriod").value;
      const yearVal = document.getElementById("admBuildYear").value.trim() || "Bilinmiyor";
      const typeVal = document.getElementById("admType").value.trim() || "Tarihî Yapı";
      const builderVal = document.getElementById("admBuilder").value.trim() || "Bilinmiyor";
      const historyVal = document.getElementById("admHistory").value.trim() || "Bilimsel kaynak açıklaması...";
      const audioVal = document.getElementById("admAudioText").value.trim() || `${nameVal}, Sivas'ın ${distName} ilçesinde yer alan kültürel miras yapısıdır.`;

      let svgX = parseInt(document.getElementById("admSvgX").value);
      let svgY = parseInt(document.getElementById("admSvgY").value);
      if (isNaN(svgX) || isNaN(svgY)) {
        svgX = distObj ? distObj.center.x : 423;
        svgY = distObj ? distObj.center.y : 403;
      }

      // Dönem Etiketi Metni
      let periodName = "Anadolu Selçuklu";
      if (periodVal === "mengucekli") periodName = "Mengücekliler Beyliği";
      else if (periodVal === "ilhanli") periodName = "İlhanlı Dönemi";
      else if (periodVal === "osmanli") periodName = "Osmanlı İmparatorluğu";
      else if (periodVal === "diger") periodName = "Cumhuriyet / Diğer";

      if (this.editingMonumentId) {
        const existing = window.SIVAS_MONUMENTS.find((m) => m.id === this.editingMonumentId);
        if (existing) {
          existing.name = nameVal;
          existing.district = distName;
          existing.period = periodName;
          existing.periodGroup = periodVal;
          existing.buildYear = yearVal;
          existing.type = typeVal;
          existing.builder = builderVal;
          existing.writtenHistory = historyVal;
          if (existing.audioGuide) existing.audioGuide.text = audioVal;
          existing.svgCoords = { x: svgX, y: svgY };
        }

        // Custom listesini güncelle
        let customList = [];
        try {
          customList = JSON.parse(localStorage.getItem("sivas_custom_monuments") || "[]");
        } catch (e) {
          customList = [];
        }
        const cIdx = customList.findIndex((m) => m.id === this.editingMonumentId);
        if (cIdx !== -1) {
          customList[cIdx] = existing;
        } else {
          customList.push(existing);
        }
        localStorage.setItem("sivas_custom_monuments", JSON.stringify(customList));

        alert(`"${nameVal}" başarıyla güncellendi!`);
      } else {
        const newId = "monument-" + Date.now();
        const newMonument = {
          id: newId,
          name: nameVal,
          district: distName,
          locationDesc: `${distName}, Sivas`,
          lat: 39.7483,
          lon: 37.0142,
          svgCoords: { x: svgX, y: svgY },
          period: periodName,
          periodGroup: periodVal,
          buildYear: yearVal,
          type: typeVal,
          typeGroup: typeVal.toLowerCase().includes("cami") ? "cami" : typeVal.toLowerCase().includes("köprü") ? "köprü" : "medrese",
          builder: builderVal,
          architect: "Bilinmiyor",
          thumbnail: "assets/images/monuments/cifte_minareli.jpg",
          condition: {
            surviving: "Yapı mevcuttur ve koruma altındadır.",
            lost: "İnceleme sürmektedir."
          },
          digitalTablet: {
            name: nameVal,
            buildDate: yearVal,
            period: periodName,
            patron: builderVal,
            originalFunction: typeVal,
            architecturalFeatures: "Geleneksel taş ve mimari detaylar.",
            historicalImportance: "Sivas kültürel mirasının tescilli parçasıdır.",
            currentStatus: "Koruma altında."
          },
          realInscription: {
            location: "Giriş cephesi",
            originalScript: "Kitabesi mevcuttur.",
            transcription: "Kitabe...",
            translation: "Anlamı...",
            verificationStatus: "Tescilli"
          },
          writtenHistory: historyVal,
          audioGuide: {
            title: "Sesli Rehber",
            text: audioVal
          },
          hotspots: [],
          comparisonData: {
            buildYear: yearVal,
            period: periodName,
            patron: builderVal,
            purpose: typeVal,
            plan: "Özgün plan",
            materials: "Kesme taş",
            stonework: "Taş işçiliği",
            function: typeVal,
            changes: "Onarılmıştır",
            currentUsage: "Kullanımda"
          },
          fieldStudy: { tasks: [] },
          references: ["Vakıflar Genel Müdürlüğü Envanteri", "Sivas Kültür Envanteri"]
        };

        window.SIVAS_MONUMENTS.push(newMonument);

        // Custom listesine ekle
        let customList = [];
        try {
          customList = JSON.parse(localStorage.getItem("sivas_custom_monuments") || "[]");
        } catch (e) {
          customList = [];
        }
        customList.push(newMonument);
        localStorage.setItem("sivas_custom_monuments", JSON.stringify(customList));

        alert(`"${nameVal}" başarıyla platforma ve haritaya eklendi!`);
      }

      this.populateAdminMonumentsDropdown();
      this.renderMapMarkers();
      this.renderMonumentsGrid();

      // Açık ilçe paneli varsa tazele
      if (this.selectedDistrict) {
        const distObj = window.SIVAS_MAP_DATA.districts.find((d) => d.id === this.selectedDistrict);
        if (distObj) this.renderDistrictInfoPanel(distObj);
      }

      this.closeModals();
      form.reset();
      this.editingMonumentId = null;
    });

    document.getElementById("btnExportJSON")?.addEventListener("click", () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.SIVAS_MONUMENTS, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "Sivas_Dijital_Tarih_Atlasi_Veritabanı.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  },

  loadPersistedData() {
    // 1. Silinmiş Eserleri Kaldır
    try {
      const deletedIds = JSON.parse(localStorage.getItem("sivas_deleted_monuments") || "[]");
      if (Array.isArray(deletedIds) && deletedIds.length > 0) {
        window.SIVAS_MONUMENTS = window.SIVAS_MONUMENTS.filter((m) => !deletedIds.includes(m.id));
      }
    } catch (e) {
      console.warn("Deleted monuments load error", e);
    }

    // 2. Özel Eklenen / Düzenlenen Eserleri Yükle
    try {
      const customMons = JSON.parse(localStorage.getItem("sivas_custom_monuments") || "[]");
      if (Array.isArray(customMons) && customMons.length > 0) {
        customMons.forEach((cm) => {
          const idx = window.SIVAS_MONUMENTS.findIndex((m) => m.id === cm.id);
          if (idx !== -1) {
            window.SIVAS_MONUMENTS[idx] = cm;
          } else {
            window.SIVAS_MONUMENTS.push(cm);
          }
        });
      }
    } catch (e) {
      console.warn("Custom monuments load error", e);
    }

    // 3. Saha Gözlem ve Öğrenci Notları
    const savedInference = localStorage.getItem("sivas_student_inference");
    if (savedInference && document.getElementById("txtStudentInference")) {
      document.getElementById("txtStudentInference").value = savedInference;
    }

    const savedNotes = localStorage.getItem("sivas_field_notes");
    if (savedNotes && document.getElementById("txtFieldNotes")) {
      document.getElementById("txtFieldNotes").value = savedNotes;
    }

    // Admin Listesini Güncelle
    this.populateAdminMonumentsDropdown();
  }
};

// Uygulamayı Başlat
window.addEventListener("DOMContentLoaded", () => {
  window.SivasApp.init();
});
