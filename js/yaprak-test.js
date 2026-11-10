document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const unitPills = document.getElementById('unitPills');
  const outcomesDropdownWrapper = document.getElementById('outcomesDropdownWrapper');
  const outcomesDropdownTrigger = document.getElementById('outcomesDropdownTrigger');
  const outcomesSummaryText = document.getElementById('outcomesSummaryText');
  const outcomesChecklist = document.getElementById('outcomesChecklist');
  const selectAllOutcomesBtn = document.getElementById('selectAllOutcomesBtn');
  const customOutcome = document.getElementById('customOutcome');
  const questionForm = document.getElementById('questionForm');
  const generateBtn = document.getElementById('generateBtn');
  const gradeInput = document.getElementById('gradeInput');
  const subjectInput = document.getElementById('subjectInput');
  const countInput = document.getElementById('countInput');
  const difficultyInput = document.getElementById('difficultyInput');
  const questionTypeInput = document.getElementById('questionTypeInput');
  // Konu / Alt Başlık ve Mevcut Yaprak Testler
  const subtopicGroup = document.getElementById('subtopicGroup');
  const subtopicPills = document.getElementById('subtopicPills');
  const subtopicCountBadge = document.getElementById('subtopicCountBadge');
  const existingTestsSection = document.getElementById('existingTestsSection');
  const existingTestsList = document.getElementById('existingTestsList');
  const existingTestsCountBadge = document.getElementById('existingTestsCountBadge');
  let selectedSubtopicNum = 'all';
  let cachedMaterials = [];

  // ========================================================
  // 🎯 4 SORU TÜRÜ ÇOKLU SEÇİM VE BAĞIMSIZ SAYI YÖNETİMİ
  // ========================================================
  const qtTotalCountBadge = document.getElementById('qtTotalCountBadge');
  const batchFileTabsBar = document.getElementById('batchFileTabsBar');
  const batchTabsList = document.getElementById('batchTabsList');
  const batchPublishAllBtn = document.getElementById('batchPublishAllBtn');

  let generatedBatches = {}; // { [type]: { type, label, count, questions, meta, smartTitle } }
  let activeBatchKey = null;

        // 13 Alt Etkinlik Türü
  const activitySubtypes = [
    'matching', 'ordering', 'table_completion', 'image_analysis',
    'diagram_labeling', 'visual_tagging', 'classification', 'experiment_analysis',
    'chart_interpretation', 'scientific_process', 'daily_life_problem',
    'cut_paste_coloring', 'stem_design'
  ];

  function syncActivitySubtypesUI() {
    const actCb = document.getElementById('qt_cb_activity');
    const panel = document.getElementById('qtActivitySubtypesPanel');
    const actCountInput = document.getElementById('qt_count_activity');
    const isActChecked = Boolean(actCb && actCb.checked);

    if (panel) {
      panel.style.display = isActChecked ? 'block' : 'none';
    }

    if (!isActChecked) {
      if (actCountInput) actCountInput.disabled = true;
      return;
    }

    if (actCountInput) actCountInput.disabled = false;

    let subTotal = 0;
    let checkedCount = 0;
    activitySubtypes.forEach(key => {
      const cb = document.getElementById(`act_cb_${key}`);
      const countInput = document.getElementById(`act_count_${key}`);
      const card = cb ? cb.closest('.qt-act-card') : null;
      if (cb && countInput) {
        if (cb.checked) {
          checkedCount++;
          countInput.disabled = false;
          if (card) card.classList.add('is-selected');
          subTotal += parseInt(countInput.value, 10) || 1;
        } else {
          countInput.disabled = true;
          if (card) card.classList.remove('is-selected');
        }
      }
    });

    // İlk kez tıklandıysa ve hiçbiri seçili değilse varsayılan 3 türü seç
    if (checkedCount === 0 && isActChecked) {
      ['matching', 'ordering', 'table_completion'].forEach(k => {
        const c = document.getElementById(`act_cb_${k}`);
        const inp = document.getElementById(`act_count_${k}`);
        const card = c ? c.closest('.qt-act-card') : null;
        if (c) {
          c.checked = true;
          if (inp) {
            inp.disabled = false;
            subTotal += parseInt(inp.value, 10) || 2;
          }
          if (card) card.classList.add('is-selected');
        }
      });
    }

    const badge = document.getElementById('qtActSubTotalBadge');
    if (badge) badge.textContent = `${subTotal} Etkinlik`;

    if (actCountInput && subTotal > 0) {
      actCountInput.value = String(subTotal);
    }
  }

  function updateQtTotalCount() {
    const types = ['multiple_choice', 'short_answer', 'open_ended', 'activity'];
    let total = 0;

    types.forEach(t => {
      const cb = document.getElementById(`qt_cb_${t}`);
      const countInputEl = document.getElementById(`qt_count_${t}`);
      const row = document.getElementById(`qt_row_${t}`);
      if (cb && countInputEl) {
        if (cb.checked) {
          countInputEl.disabled = false;
          if (row) row.classList.add('is-active');
          const val = parseInt(countInputEl.value, 10) || 0;
          total += val;
          if (window.questionPrepEngine) {
            window.questionPrepEngine.setTypeEnabled(t, true);
            window.questionPrepEngine.setTypeCount(t, val);
          }
        } else {
          countInputEl.disabled = true;
          if (row) row.classList.remove('is-active');
          if (window.questionPrepEngine) {
            window.questionPrepEngine.setTypeEnabled(t, false);
          }
        }
      }
    });

    syncActivitySubtypesUI();

    if (window.questionPrepEngine) {
      total = window.questionPrepEngine.getTotalCount();
    }

    if (qtTotalCountBadge) {
      qtTotalCountBadge.textContent = `📊 Toplam: ${total} Soru / İçerik`;
    }
    const hiddenCount = document.getElementById('countInput');
    if (hiddenCount) hiddenCount.value = String(total || 10);
  }
  window.updateQtTotalCount = updateQtTotalCount;

  function initQuestionTypesAndActivities() {
    const types = ['multiple_choice', 'short_answer', 'open_ended', 'activity'];

    types.forEach(t => {
      const cb = document.getElementById(`qt_cb_${t}`);
      const countInputEl = document.getElementById(`qt_count_${t}`);
      const row = document.getElementById(`qt_row_${t}`);

      if (cb) {
        cb.addEventListener('change', () => {
          updateQtTotalCount();
        });
        cb.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }

      if (countInputEl) {
        countInputEl.addEventListener('input', () => {
          updateQtTotalCount();
        });
        countInputEl.addEventListener('change', () => {
          updateQtTotalCount();
        });
        countInputEl.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }

      if (row && cb) {
        row.addEventListener('click', (e) => {
          // Label, input veya buton tıklamalarında doğal davranışı bozma
          if (e.target.closest('label') || e.target.closest('.qt-count-box') || e.target === cb) {
            return;
          }
          cb.checked = !cb.checked;
          updateQtTotalCount();
        });
      }
    });

    // Wire activity quick buttons
    const actSelectAllBtn = document.getElementById('qtActSelectAllBtn');
    if (actSelectAllBtn) {
      actSelectAllBtn.onclick = (e) => {
        e.preventDefault();
        activitySubtypes.forEach(k => {
          const cb = document.getElementById(`act_cb_${k}`);
          if (cb) cb.checked = true;
        });
        updateQtTotalCount();
      };
    }

    const actClearBtn = document.getElementById('qtActClearBtn');
    if (actClearBtn) {
      actClearBtn.onclick = (e) => {
        e.preventDefault();
        activitySubtypes.forEach(k => {
          const cb = document.getElementById(`act_cb_${k}`);
          if (cb) cb.checked = false;
        });
        updateQtTotalCount();
      };
    }

    const actDistBtn = document.getElementById('qtActDefaultDistBtn');
    if (actDistBtn) {
      actDistBtn.onclick = (e) => {
        e.preventDefault();
        const top5 = ['matching', 'ordering', 'table_completion', 'classification', 'experiment_analysis'];
        activitySubtypes.forEach(k => {
          const cb = document.getElementById(`act_cb_${k}`);
          const inp = document.getElementById(`act_count_${k}`);
          if (cb) {
            cb.checked = top5.includes(k);
            if (inp) inp.value = top5.includes(k) ? '2' : '1';
          }
        });
        updateQtTotalCount();
      };
    }

    // Wire activity subtype inputs and cards
    activitySubtypes.forEach(k => {
      const cb = document.getElementById(`act_cb_${k}`);
      const inp = document.getElementById(`act_count_${k}`);
      const card = cb ? cb.closest('.qt-act-card') : null;

      if (cb) {
        cb.addEventListener('change', () => {
          updateQtTotalCount();
        });
        cb.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }
      if (inp) {
        inp.addEventListener('input', () => {
          updateQtTotalCount();
        });
        inp.addEventListener('change', () => {
          updateQtTotalCount();
        });
        inp.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }
      if (card && cb) {
        card.addEventListener('click', (e) => {
          if (e.target.closest('label') || e.target.closest('.qt-act-count-box') || e.target === cb) {
            return;
          }
          cb.checked = !cb.checked;
          updateQtTotalCount();
        });
      }
    });

        document.querySelectorAll('input[name="qtOutputMode"]').forEach(radio => {
      radio.addEventListener('change', () => {
        if (window.questionPrepEngine) {
          window.questionPrepEngine.setOutputMode(radio.value);
        }
      });
    });

    updateQtTotalCount();
  }

  // Hem anında hem DOM hazır olduğunda çalıştır
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuestionTypesAndActivities);
  } else {
    initQuestionTypesAndActivities();
  }





  // Kaynak Dosya Yükleme (Drag & Drop) Elements
  const sourceFileDropzone = document.getElementById('sourceFileDropzone');
  const sourceFileInput = document.getElementById('sourceFileInput');
  const sourceFilePreviewList = document.getElementById('sourceFilePreviewList');

  // Akıllı Otomatik Başlıklandırma Elements
  const smartTitleBanner = document.getElementById('smartTitleBanner');
  const smartTitleDisplay = document.getElementById('smartTitleDisplay');
  const smartAutoTitleHeading = document.getElementById('smartAutoTitleHeading');
  const editSmartTitleBtn = document.getElementById('editSmartTitleBtn');
  const smartTitleEditor = document.getElementById('smartTitleEditor');
  const smartTitleInput = document.getElementById('smartTitleInput');
  const saveSmartTitleBtn = document.getElementById('saveSmartTitleBtn');
  const cancelSmartTitleBtn = document.getElementById('cancelSmartTitleBtn');

  // Preview & Export Elements
  const actionToolbar = document.getElementById('actionToolbar');
  const viewControlsBar = document.getElementById('viewControlsBar');
  const loadingState = document.getElementById('loadingState');
  const emptyState = document.getElementById('emptyState');
  const questionsContainer = document.getElementById('questionsContainer');
  const answerKeyBox = document.getElementById('answerKeyBox');
  const answerKeyGrid = document.getElementById('answerKeyGrid');
  const testMetaTitle = document.getElementById('testMetaTitle');
  const questionCountBadge = document.getElementById('questionCountBadge');
  const printTitle = document.getElementById('printTitle');
  const printOutcomeText = document.getElementById('printOutcomeText');

  // Action Buttons
  const downloadPdfBtn = document.getElementById('downloadPdfBtn');
  const downloadDocxBtn = document.getElementById('downloadDocxBtn');
  const downloadJsonBtn = document.getElementById('downloadJsonBtn');
  const copyAllBtn = document.getElementById('copyAllBtn');
  const printBtn = document.getElementById('printBtn');
  const toggleAnswersBtn = document.getElementById('toggleAnswersBtn');
  const toggleSolutionsBtn = document.getElementById('toggleSolutionsBtn');

  // 3D Space Viewer Elements
  const ypSpaceViewerModal = document.getElementById('ypSpaceViewerModal');
  const ypSpaceDocTitle = document.getElementById('ypSpaceDocTitle');
  const ypSpaceScrollStream = document.getElementById('ypSpaceScrollStream');
  const ypSpaceSlideCounter = document.getElementById('ypSpaceSlideCounter');
  const ypSpacePrevBtn = document.getElementById('ypSpacePrevBtn');
  const ypSpaceNextBtn = document.getElementById('ypSpaceNextBtn');
  const ypSpaceRoutesBtn = document.getElementById('ypSpaceRoutesBtn');
  const ypSpaceRoutesDrawer = document.getElementById('ypSpaceRoutesDrawer');
  const ypSpaceRoutesList = document.getElementById('ypSpaceRoutesList');
  const closeYpSpaceRoutesBtn = document.getElementById('closeYpSpaceRoutesBtn');
  const ypSpaceSoundBtn = document.getElementById('ypSpaceSoundBtn');
  const ypSpaceFullscreenBtn = document.getElementById('ypSpaceFullscreenBtn');
  const ypSpacePrintBtn = document.getElementById('ypSpacePrintBtn');
  const ypSpaceSaveBtn = document.getElementById('ypSpaceSaveBtn');
  const closeYpSpaceViewerBtn = document.getElementById('closeYpSpaceViewerBtn');
  // 🌓 Açık / Koyu Tema Değiştirme
  const ypSpaceThemeToggleBtn = document.getElementById('ypSpaceThemeToggleBtn');
  const ypSpaceThemeText = document.getElementById('ypSpaceThemeText');
  if (ypSpaceThemeToggleBtn && ypSpaceViewerModal) {
    ypSpaceThemeToggleBtn.addEventListener('click', () => {
      const isDark = ypSpaceViewerModal.classList.toggle('theme-dark');
      if (ypSpaceThemeText) {
        ypSpaceThemeText.textContent = isDark ? 'Açık Mod' : 'Koyu Mod';
      }
      try { localStorage.setItem('rotali_space_viewer_theme', isDark ? 'dark' : 'light'); } catch(e) {}
    });
    try {
      if (localStorage.getItem('rotali_space_viewer_theme') === 'dark') {
        ypSpaceViewerModal.classList.add('theme-dark');
        if (ypSpaceThemeText) ypSpaceThemeText.textContent = 'Açık Mod';
      }
    } catch(e) {}
  }

  const open3DSpaceViewBtn = document.getElementById('open3DSpaceViewBtn');
  const headerSpaceViewerBtn = document.getElementById('headerSpaceViewerBtn');
  const emptyStateSpaceViewerBtn = document.getElementById('emptyStateSpaceViewerBtn');
  const ypSpaceDirectFileInput = document.getElementById('ypSpaceDirectFileInput');

  // App State
  let curriculumData = null;
  let selectedUnitIndex = 0;
  let currentQuestions = [];
  let currentMeta = {};
  let showAnswers = false;
  let showSolutions = false;
  let editingQuestionIndex = -1;
  let uploadedSourceFiles = []; // [{ id, name, size, mimeType, base64Data, extractedText }]
  let currentSmartTitle = 'Test No: 1 - Çoktan Seçmeli LGS';
  let testSequenceCounter = parseInt(sessionStorage.getItem('rotali_test_seq_counter') || '0', 10);

  // PDF.js Worker ayarı
  if (typeof window !== 'undefined' && window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  // ==========================================================================
  // 1. MÜFREDAT VERİSİNİ YÜKLE & HEDEF ÖĞRENME ÇIKTILARI ÇOKLU SEÇİM MENÜSÜ
  // ==========================================================================
  // Anında Müfredatı Başlat
  setTimeout(() => {
    try { loadCurriculum(gradeInput ? gradeInput.value : '5'); } catch(e){}
  }, 10);

  async function loadCurriculum(grade = "5") {
    selectedSubtopicNum = 'all';
    if (cachedMaterials.length === 0) {
      loadYaprakMaterials();
    }
    const cleanGrade = String(grade).replace(/^grade-/, "");

    // A. İlk olarak yerleşik çevrimdışı müfredattan anında yükle
    if (typeof window !== 'undefined' && window.ALL_CURRICULUM && window.ALL_CURRICULUM[cleanGrade]) {
      curriculumData = window.ALL_CURRICULUM[cleanGrade];
      selectedUnitIndex = 0;
      renderUnits(curriculumData.units);
    }

    // B. Arka planda sunucu API'sini çağır (opsiyonel güncel veri için)
    try {
      const res = await fetch(`/api/curriculum?grade=${cleanGrade}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.units && data.units.length > 0) {
          curriculumData = data;
          selectedUnitIndex = 0;
          renderUnits(curriculumData.units);
          return;
        }
      }
    } catch (err) {
      console.warn('API müfredat senkronizasyonu uyarısı (yerleşik veri devrede):', err);
    }

    // C. Yedek kontrol
    if (!curriculumData || !curriculumData.units || curriculumData.units.length === 0) {
      if (typeof window !== 'undefined' && window.ALL_CURRICULUM && window.ALL_CURRICULUM[cleanGrade]) {
        curriculumData = window.ALL_CURRICULUM[cleanGrade];
        selectedUnitIndex = 0;
        renderUnits(curriculumData.units);
      } else {
        outcomesChecklist.innerHTML = '<div class="empty-hint" style="color:red;">Müfredat yüklenemedi. Özel kazanım alanını kullanarak soru üretebilirsiniz.</div>';
      }
    }
  }

  // Sınıf Değiştiğinde Müfredatı Yeniden Yükle
  gradeInput.addEventListener('change', (e) => {
    const newGrade = e.target.value;
    loadCurriculum(newGrade);
  });

  // Gök Cisimleri Gerçekçi Varlıklarını (Güneş, Dünya, Ay) Önyükle
  let celestialAssets = { sun: '', earth: '', moon: '' };
  async function loadCelestialAssets() {
    try {
      const res = await fetch('/api/celestial-assets');
      if (res.ok) {
        const data = await res.json();
        if (data.assets) {
          celestialAssets = data.assets;
          window.CELESTIAL_ASSETS = data.assets;
        }
      }
    } catch (err) {
      console.warn('Gök cismi varlıkları yüklenirken hata:', err);
    }
  }
  loadCelestialAssets();

  // LaTeX ve Bozuk Karakter Temizleme Motoru
  function cleanTurkishAndLatex(str) {
    if (typeof str !== 'string') return str || '';
    let text = str;
    text = text.replace(/\$\$([\s\S]*?)\$\$/g, '$1');
    text = text.replace(/\$([^$]+)\$/g, '$1');
    text = text.replace(/\\(text|mathbf|mathrm|mathit)\{([^}]+)\}/g, '$2');
    text = text.replace(/\\>/g, '>');
    text = text.replace(/\\</g, '<');
    text = text.replace(/\\ge(q)?/g, '≥');
    text = text.replace(/\\le(q)?/g, '≤');
    text = text.replace(/\bDiinya\b/g, 'Dünya');
    text = text.replace(/\bdiinya\b/g, 'dünya');
    text = text.replace(/\bGiines\b/g, 'Güneş');
    text = text.replace(/\bgiines\b/g, 'güneş');
    text = text.replace(/\bGunes\b/g, 'Güneş');
    text = text.replace(/\bgunes\b/g, 'güneş');
    text = text.replace(/\bDunya\b/g, 'Dünya');
    text = text.replace(/\bdunya\b/g, 'dünya');
    text = text.replace(/\bisik\b/g, 'ışık');
    text = text.replace(/\bIsik\b/g, 'Işık');
    text = text.replace(/rotamenci/gi, 'Rotalı Fenci');
    text = text.replace(/([A-Za-zÇĞİÖŞÜçğıöşü]+)\s*>\s*([A-Za-zÇĞİÖŞÜçğıöşü]+)/g, '$1 > $2');
    text = text.replace(/([A-Za-zÇĞİÖŞÜçğıöşü]+)\s*<\s*([A-Za-zÇĞİÖŞÜçğıöşü]+)/g, '$1 < $2');
    // Kullanıcı Talimatı: "sorularda yukarıdaki demiş yandaki diye düzelt tüm sorular için bunu yap"
    text = text.replace(/Yukarıdakilerden/g, 'Yandakilerden')
      .replace(/yukarıdakilerden/g, 'yandakilerden')
      .replace(/Yukarıdakiler/g, 'Yandakiler')
      .replace(/yukarıdakiler/g, 'yandakiler')
      .replace(/Yukarıdaki/g, 'Yandaki')
      .replace(/yukarıdaki/g, 'yandaki')
      .replace(/Yukardaki/g, 'Yandaki')
      .replace(/yukardaki/g, 'yandaki')
      .replace(/Yukarıdan/g, 'Yandan')
      .replace(/yukarıdan/g, 'yandan')
      .replace(/Yukarıda/g, 'Yanda')
      .replace(/yukarıda/g, 'yanda');

    return text.trim();
  }

    function prepareSvgForDisplay(svgStr, question = '', options = {}, correctAnswer = '') {
    if (!svgStr || typeof svgStr !== 'string' || !svgStr.includes('<svg')) return '';
    let out = svgStr;

    // 1. Cevap sızıntılarını ve ipuçlarını temizle
    const qNorm = String(question || '').toLowerCase();
    const cNorm = String(correctAnswer || '').toLowerCase();

    const bannedKeywords = [
      'küre', 'kuresel', 'yıldız', 'yildiz', 'ışık kaynağı değil', 'isik kaynagi degil',
      'ışık kaynağı', 'isik kaynagi', 'doğal ışık ve ısı kaynağı', 'doğal uydu', 'dogal uydu',
      'geometrik şekil', 'en büyük', 'en kücük', 'orta büyüklükte', 'krater', 'kraterler',
      'kratersiz', 'atmosfer yok', 'su yok', 'toz tabakası', 'regolit', 'gaz küresi'
    ];

    if (cNorm && cNorm.length >= 2) {
      bannedKeywords.push(cNorm);
      cNorm.split(' ').forEach(w => { if (w.length >= 3) bannedKeywords.push(w); });
    }

    const asksNameOrClass = /(ad[ıi]\s+(nedir|hangisidir)|hangisidir|hangi\s+(g[öo]k\s+cismi|y[ıi]ld[ıi]z|gezegen|uydu|evre|katman)|nas[ıi]l\s+adland[ıi]r[ıi]l[ıi]r|s[ıi]n[ıi]f[ıi]na\s+girer|ne\s+ad\s+verilir|nedir\s*\?)/i.test(question || '');

    if (asksNameOrClass) {
      bannedKeywords.push('güneş', 'gunes', 'dünya', 'dunya', 'ay');
    }

    out = out.replace(/<text([^>]*)>([\s\S]*?)<\/text>/gi, (m, attrs, inner) => {
      const rawClean = inner.replace(/<[^>]+>/g, '').trim();
      const inNorm = rawClean.toLowerCase();

      if (/^[><=≥≤]+$/.test(rawClean.trim()) || rawClean.trim() === '&gt;' || rawClean.trim() === '&lt;') {
        return '<text' + attrs + '>?</text>';
      }

      if (qNorm.includes('geometrik') && inNorm.includes('kure')) {
        return '<text' + attrs + '>?</text>';
      }

      for (const kw of bannedKeywords) {
        if (!kw) continue;
        if (inNorm === kw || inNorm.includes(kw) || (kw.length >= 4 && kw.includes(inNorm))) {
          return '<text' + attrs + '>?</text>';
        }
      }

      return m;
    });

    // 2. Yalnızca soruyla ilgili gök cismi gösterilsin (Güneş soruluyorsa Ay eklenmesin)
    const mentionsSunOnly = (qNorm.includes('güneş') || qNorm.includes('gunes') || cNorm.includes('güneş')) && !qNorm.includes('ay') && !qNorm.includes('dünya') && !qNorm.includes('karşılaştır');
    const mentionsMoonOnly = (qNorm.includes('ay') || cNorm.includes('ay')) && !qNorm.includes('güneş') && !qNorm.includes('dünya') && !qNorm.includes('karşılaştır');

    if (mentionsSunOnly && out.includes('/images/moon.jpg')) {
      const clipId = 'sunCleanClip_' + Math.random().toString(36).slice(2, 7);
      out = `<svg viewBox="0 0 520 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <clipPath id="${clipId}"><circle cx="260" cy="95" r="70"/></clipPath>
    <radialGradient id="${clipId}_glow" cx="50%" cy="50%" r="50%">
      <stop offset="65%" stop-color="#f59e0b" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect x="0" y="0" width="520" height="220" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
  <circle cx="260" cy="95" r="90" fill="url(#${clipId}_glow)"/>
  <image href="/images/sun.jpg" xlink:href="/images/sun.jpg" x="190" y="25" width="140" height="140" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice"/>
  <circle cx="260" cy="95" r="70" fill="none" stroke="#f59e0b" stroke-width="2"/>
  <text x="260" y="190" text-anchor="middle" fill="#0f172a" font-family="'Times New Roman', Times, serif" font-size="14" font-weight="700">${asksNameOrClass ? '?' : 'Güneş'}</text>
</svg>`;
    } else if (mentionsMoonOnly && out.includes('/images/sun.jpg')) {
      const clipId = 'moonCleanClip_' + Math.random().toString(36).slice(2, 7);
      out = `<svg viewBox="0 0 520 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <clipPath id="${clipId}"><circle cx="260" cy="95" r="68"/></clipPath>
  </defs>
  <rect x="0" y="0" width="520" height="220" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
  <image href="/images/moon.jpg" xlink:href="/images/moon.jpg" x="192" y="27" width="136" height="136" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice"/>
  <circle cx="260" cy="95" r="68" fill="none" stroke="#94a3b8" stroke-width="2"/>
  <text x="260" y="190" text-anchor="middle" fill="#0f172a" font-family="'Times New Roman', Times, serif" font-size="14" font-weight="700">${asksNameOrClass ? '?' : 'Ay'}</text>
</svg>`;
    }

    // 3. Basit vektör daireleri gerçek uzay fotoğraflarıyla donat
    if (!out.includes('<image')) {
      if ((qNorm.includes('güneş') || qNorm.includes('gunes')) && !qNorm.includes('ay')) {
        const clipId = 'sunAutoClip_' + Math.random().toString(36).slice(2, 7);
        out = `<svg viewBox="0 0 520 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <clipPath id="${clipId}"><circle cx="260" cy="95" r="70"/></clipPath>
    <radialGradient id="${clipId}_glow" cx="50%" cy="50%" r="50%">
      <stop offset="65%" stop-color="#f59e0b" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect x="0" y="0" width="520" height="220" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
  <circle cx="260" cy="95" r="90" fill="url(#${clipId}_glow)"/>
  <image href="/images/sun.jpg" xlink:href="/images/sun.jpg" x="190" y="25" width="140" height="140" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice"/>
  <circle cx="260" cy="95" r="70" fill="none" stroke="#f59e0b" stroke-width="2"/>
  <text x="260" y="190" text-anchor="middle" fill="#0f172a" font-family="'Times New Roman', Times, serif" font-size="14" font-weight="700">${asksNameOrClass ? '?' : 'Güneş'}</text>
</svg>`;
      } else if (qNorm.includes('ay') && !qNorm.includes('güneş')) {
        const clipId = 'moonAutoClip_' + Math.random().toString(36).slice(2, 7);
        out = `<svg viewBox="0 0 520 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <clipPath id="${clipId}"><circle cx="260" cy="95" r="68"/></clipPath>
  </defs>
  <rect x="0" y="0" width="520" height="220" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
  <image href="/images/moon.jpg" xlink:href="/images/moon.jpg" x="192" y="27" width="136" height="136" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice"/>
  <circle cx="260" cy="95" r="68" fill="none" stroke="#94a3b8" stroke-width="2"/>
  <text x="260" y="190" text-anchor="middle" fill="#0f172a" font-family="'Times New Roman', Times, serif" font-size="14" font-weight="700">${asksNameOrClass ? '?' : 'Ay'}</text>
</svg>`;
      } else if (qNorm.includes('dünya') && !qNorm.includes('güneş') && !qNorm.includes('ay')) {
        const clipId = 'earthAutoClip_' + Math.random().toString(36).slice(2, 7);
        out = `<svg viewBox="0 0 520 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <clipPath id="${clipId}"><circle cx="260" cy="95" r="68"/></clipPath>
  </defs>
  <rect x="0" y="0" width="520" height="220" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
  <image href="/images/earth.jpg" xlink:href="/images/earth.jpg" x="192" y="27" width="136" height="136" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice"/>
  <circle cx="260" cy="95" r="68" fill="none" stroke="#0284c7" stroke-width="2"/>
  <text x="260" y="190" text-anchor="middle" fill="#0f172a" font-family="'Times New Roman', Times, serif" font-size="14" font-weight="700">${asksNameOrClass ? '?' : 'Dünya'}</text>
</svg>`;
      }
    }

    if (!out.includes('xmlns:xlink')) {
      out = out.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }
    out = out.replace(/font-family=["'][^"']*["']/gi, 'font-family="Times New Roman, Times, serif"');
    out = out.replace(/fill=["']#(070a12|090d16|0b0f19|000000|0f172a|030712|1e1b4b|1e293b|000)["']/gi, 'fill="#ffffff" stroke="#e2e8f0" stroke-width="1"');
    out = out.replace(/fill=["']black["']/gi, 'fill="#ffffff" stroke="#e2e8f0" stroke-width="1"');
    out = out.replace(/fill=["']rgba?\(\s*0\s*,\s*0\s*,\s*0[^)]*\)["']/gi, 'fill="#ffffff" stroke="#e2e8f0" stroke-width="1"');
    out = out.replace(/<circle[^>]*opacity=["']0\.[0-9]+["'][^>]*fill=["']#(fff|ffffff)["'][^>]*\/?>/gi, '');
    out = out.replace(/<circle[^>]*fill=["']#(fff|ffffff)["'][^>]*opacity=["']0\.[0-9]+["'][^>]*\/?>/gi, '');
    out = out.replace(/fill=["']#fbbf24["']/gi, 'fill="#b45309"');
    out = out.replace(/fill=["']#38bdf8["']/gi, 'fill="#0369a1"');
    out = out.replace(/fill=["']#e2e8f0["']/gi, 'fill="#334155"');
    out = out.replace(/fill=["']#(f8fafc|ffffff|fff)["'](?=[^>]*font-)/gi, 'fill="#0f172a"');
    out = out.replace(/\bDiinya\b/g, 'Dünya');
    out = out.replace(/\bdiinya\b/g, 'dünya');
    out = out.replace(/\bGiines\b/g, 'Güneş');
    out = out.replace(/\bgiines\b/g, 'güneş');
    out = out.replace(/\bGunes\b/g, 'Güneş');
    out = out.replace(/\bgunes\b/g, 'güneş');
    out = out.replace(/\bDunya\b/g, 'Dünya');
    out = out.replace(/\bdunya\b/g, 'dünya');

    if (celestialAssets.sun && out.includes('/images/sun.jpg')) {
      out = out.split('/images/sun.jpg').join(celestialAssets.sun);
    }
    if (celestialAssets.earth && out.includes('/images/earth.jpg')) {
      out = out.split('/images/earth.jpg').join(celestialAssets.earth);
    }
    if (celestialAssets.moon && out.includes('/images/moon.jpg')) {
      out = out.split('/images/moon.jpg').join(celestialAssets.moon);
    }
    return out;
  }

  // Ünite Seçimi Butonlarını (Pills) Oluştur
  function renderUnits(units) {
    unitPills.innerHTML = '';
    if (!Array.isArray(units) || units.length === 0) return;

    units.forEach((unit, idx) => {
      const btn = document.createElement('div');
      btn.className = `unit-pill ${idx === selectedUnitIndex ? 'active' : ''}`;
      btn.innerHTML = `<span>${unit.icon || '📘'}</span> <span>${unit.name}</span>`;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.unit-pill').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        selectedUnitIndex = idx;
        selectedSubtopicNum = 'all';
        renderSubtopics(unit);
        const unitOutcomes = getUnitOutcomesList(unit, 'all');
        renderOutcomes(unitOutcomes, true);
        renderMatchingYaprakTests(gradeInput ? gradeInput.value : '5', unit, 'all');
      });
      unitPills.appendChild(btn);
    });

    const activeUnit = units[selectedUnitIndex] || units[0];
    renderSubtopics(activeUnit);
    const firstUnitOutcomes = getUnitOutcomesList(activeUnit, 'all');
    renderOutcomes(firstUnitOutcomes, false);
    renderMatchingYaprakTests(gradeInput ? gradeInput.value : '5', activeUnit, 'all');
  }

  // Türkiye Yüzyılı Maarif Modeli: Konu / Alt Başlık Butonlarını (Pills) Oluştur
  function renderSubtopics(unit) {
    if (!subtopicPills) return;
    subtopicPills.innerHTML = '';

    const subtopics = Array.isArray(unit.subtopics) ? unit.subtopics : [];
    if (subtopicCountBadge) {
      subtopicCountBadge.textContent = subtopics.length > 0 ? `${subtopics.length} Konu` : 'Tüm Ünite';
    }

    if (subtopics.length === 0) {
      subtopicPills.innerHTML = '<span class="subtopic-pill active">★ Tüm Ünite Konuları</span>';
      return;
    }

    // 1. "Tüm Konular" Butonu
    const allBtn = document.createElement('div');
    allBtn.className = `subtopic-pill ${selectedSubtopicNum === 'all' ? 'active' : ''}`;
    allBtn.setAttribute('data-subtopic', 'all');
    allBtn.innerHTML = '<span>★</span> <span>Tüm Konular (Genel)</span>';
    allBtn.addEventListener('click', () => {
      document.querySelectorAll('.subtopic-pill').forEach(p => p.classList.remove('active'));
      allBtn.classList.add('active');
      selectedSubtopicNum = 'all';
      const outcomes = getUnitOutcomesList(unit, 'all');
      renderOutcomes(outcomes, false);
      renderMatchingYaprakTests(gradeInput ? gradeInput.value : '5', unit, 'all');
    });
    subtopicPills.appendChild(allBtn);

    // 2. Her bir Alt Konu Butonu (1.1, 1.2, 1.3...)
    subtopics.forEach((st) => {
      const btn = document.createElement('div');
      const isSubActive = (String(selectedSubtopicNum) === String(st.num));
      btn.className = `subtopic-pill ${isSubActive ? 'active' : ''}`;
      btn.setAttribute('data-subtopic', st.num);
      btn.innerHTML = `<span class="subtopic-pill-code">${st.code || st.num}</span> <span>${st.shortTitle || st.title}</span>`;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.subtopic-pill').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        selectedSubtopicNum = st.num;
        const subOutcomes = getUnitOutcomesList(unit, st.num);
        renderOutcomes(subOutcomes, false);
        renderMatchingYaprakTests(gradeInput ? gradeInput.value : '5', unit, st.num);
      });
      subtopicPills.appendChild(btn);
    });
  }

  function getUnitOutcomesList(unit, subtopicNum = 'all') {
    if (!unit) return [];

    // Belirli bir alt konu seçilmişse yalnızca o konunun öğrenme çıktılarını getir
    if (subtopicNum && subtopicNum !== 'all' && Array.isArray(unit.subtopics)) {
      const foundSub = unit.subtopics.find(s => String(s.num) === String(subtopicNum) || String(s.code) === String(subtopicNum));
      if (foundSub && Array.isArray(foundSub.outcomes) && foundSub.outcomes.length > 0) {
        return foundSub.outcomes;
      }
    }

    // Tüm ünitenin öğrenme çıktıları
    if (Array.isArray(unit.outcomes) && unit.outcomes.length > 0) {
      return unit.outcomes;
    }

    if (Array.isArray(unit.subtopics) && unit.subtopics.length > 0) {
      const allOuts = [];
      unit.subtopics.forEach(st => {
        if (Array.isArray(st.outcomes)) {
          st.outcomes.forEach(o => allOuts.push(o));
        } else {
          allOuts.push({ id: st.code || 'FB', text: st.title });
        }
      });
      if (allOuts.length > 0) return allOuts;
    }

    return [{ id: 'FB.1', text: `${unit.name} temel kavram ve öğrenme çıktıları` }];
  }

  // Materyalleri Yükle ve Önbelleğe Al
  async function loadYaprakMaterials() {
    try {
      const res = await fetch('data/materials.json?v=' + Date.now());
      if (res.ok) {
        cachedMaterials = await res.json();
      }
    } catch(e) {
      console.warn('materials.json yükleme uyarısı:', e);
    }
    try {
      const local = JSON.parse(localStorage.getItem('rotali_custom_materials') || '[]');
      if (Array.isArray(local) && local.length > 0) {
        const ids = new Set(cachedMaterials.map(m => m.id));
        local.forEach(lm => {
          if (!ids.has(lm.id)) cachedMaterials.push(lm);
        });
      }
    } catch(e) {}
  }

  // Seçilen Sınıf → Ünite → Konu'ya Göre Mevcut Yaprak Testleri Listele
  function renderMatchingYaprakTests(grade, unit, subtopicNum = 'all') {
    if (!existingTestsList) return;
    existingTestsList.innerHTML = '';

    const cleanGrade = String(grade).replace(/^grade-/, '').trim();
    const curUnitName = unit ? (unit.name || '') : '';
    const curUnitNum = unit ? (unit.num || 1) : 1;

    // A. Bu sınıfa ve üniteye ait test formatındaki materyalleri filtrele
    const tests = cachedMaterials.filter(m => {
      if (!m || !m.id) return false;
      const mGrade = String(m.grade || '').replace(/^grade-/, '').trim();
      if (mGrade !== cleanGrade && mGrade !== 'all') return false;

      // Ünite eşleşmesi: numaraya veya isme göre
      const mUnit = String(m.unit || '');
      const unitMatches = mUnit.includes(`${curUnitNum}. Ünite`) || 
                          mUnit.includes(`${curUnitNum}.Ünite`) || 
                          mUnit.toLowerCase().includes(curUnitName.toLowerCase()) ||
                          (curUnitName && mUnit.toLowerCase().includes(curUnitName.toLowerCase().replace(/^\d+\.\s*ünite:\s*/i, '')));
      if (!unitMatches) return false;

      // Kategori / format kontrolü (Yaprak test veya Soru bankası veya Deneme)
      const cat = String(m.category || '').toLowerCase();
      const fmt = String(m.format || '').toLowerCase();
      const title = String(m.title || '').toLowerCase();
      const isTest = cat === 'soru-bankasi' || cat === 'yaprak-test' || cat === 'denemeler' ||
                     fmt.includes('yaprak test') || fmt.includes('test') || fmt.includes('sınav') ||
                     title.includes('yaprak test') || title.includes('test') || title.includes('sınav');
      return isTest;
    });

    // B. Eğer belirli bir alt konu seçilmişse filtrele
    let filteredTests = tests;
    if (subtopicNum && subtopicNum !== 'all' && Array.isArray(unit.subtopics)) {
      const targetSub = unit.subtopics.find(s => String(s.num) === String(subtopicNum) || String(s.code) === String(subtopicNum));
      if (targetSub) {
        filteredTests = tests.filter(item => {
          if (typeof isMaterialMatchingSubtopic === 'function') {
            return isMaterialMatchingSubtopic(item, targetSub);
          }
          const tText = (item.title + ' ' + (item.desc || '')).toLowerCase();
          return tText.includes(String(targetSub.code).toLowerCase()) || 
                 (targetSub.keywords && targetSub.keywords.some(k => tText.includes(k.toLowerCase())));
        });
      }
    }

    if (existingTestsCountBadge) {
      existingTestsCountBadge.textContent = `${filteredTests.length} Test`;
    }

    if (filteredTests.length === 0) {
      existingTestsList.innerHTML = `
        <div class="existing-test-empty">
          <span>ℹ️ Bu ${subtopicNum === 'all' ? 'üniteye' : 'alt konuya'} ait henüz yayınlanmış yaprak test bulunamadı.</span>
          <div style="margin-top: 4px; font-weight: 700; color: #2563eb;">Yukarıdaki formdan "Soruları Gemini AI İle Üret" butonuna basarak anında yeni test üretebilirsiniz.</div>
        </div>`;
      return;
    }

    filteredTests.forEach(t => {
      const card = document.createElement('div');
      card.className = 'existing-test-card';
      const solveUrl = t.fileUrl || t.url || '#';
      const isHtml = solveUrl.endsWith('.html');
      const isPdf = solveUrl.endsWith('.pdf');

      card.innerHTML = `
        <div class="existing-test-info">
          <div class="existing-test-title" title="${escapeHtml(t.title)}">${escapeHtml(t.title)}</div>
          <div class="existing-test-meta">
            <span class="format-tag">${escapeHtml(t.format || 'YAPRAK TEST')}</span>
            <span>🎯 ${cleanGrade}. Sınıf • ${curUnitNum}. Ünite</span>
          </div>
        </div>
        <div class="existing-test-actions">
          ${isHtml ? `<a href="${solveUrl}" target="_blank" class="btn-test-action btn-test-solve">🚀 Çöz</a>` : ''}
          ${isPdf ? `<a href="${solveUrl}" target="_blank" class="btn-test-action btn-test-pdf">📄 PDF</a>` : ''}
        </div>
      `;
      existingTestsList.appendChild(card);
    });
  }

  function renderOutcomes(outcomes, openDropdownOnSelect = false) {
    outcomesChecklist.innerHTML = '';
    const safeOutcomes = Array.isArray(outcomes) ? outcomes : [];

    if (safeOutcomes.length === 0) {
      if (outcomesDropdownTrigger) {
        outcomesDropdownTrigger.disabled = true;
        outcomesDropdownTrigger.classList.add('is-disabled');
        outcomesDropdownTrigger.classList.remove('is-open');
      }
      if (selectAllOutcomesBtn) selectAllOutcomesBtn.disabled = true;
      if (outcomesSummaryText) outcomesSummaryText.textContent = 'Önce yukarıdan bir ünite seçiniz...';
      outcomesChecklist.classList.remove('is-open');
      outcomesChecklist.innerHTML = '<div class="empty-hint">Lütfen yukarıdan bir ünite seçiniz...</div>';
      return;
    }

    // Ünite seçildiğinde kutuyu ve "Tümünü Seç" butonunu aktif (enabled) yap
    if (outcomesDropdownTrigger) {
      outcomesDropdownTrigger.disabled = false;
      outcomesDropdownTrigger.classList.remove('is-disabled');
    }
    if (selectAllOutcomesBtn) {
      selectAllOutcomesBtn.disabled = false;
    }

    safeOutcomes.forEach((outcome, idx) => {
      const outcomeText = typeof outcome === 'object' ? (outcome.text || outcome.title || '') : String(outcome);
      const outcomeId = typeof outcome === 'object' ? (outcome.id || outcome.code || `${idx + 1}`) : `${idx + 1}`;

      const item = document.createElement('label');
      item.className = 'outcome-check-item';
      item.innerHTML = `
        <input type="checkbox" name="selectedOutcome" value="${escapeHtml(outcomeText)}" ${idx === 0 ? 'checked' : ''}>
        <span class="outcome-label"><strong>${escapeHtml(outcomeId)}.</strong> ${escapeHtml(outcomeText)}</span>
      `;
      outcomesChecklist.appendChild(item);
    });

    if (openDropdownOnSelect) {
      outcomesChecklist.classList.add('is-open');
      if (outcomesDropdownTrigger) {
        outcomesDropdownTrigger.classList.add('is-open');
        outcomesDropdownTrigger.setAttribute('aria-expanded', 'true');
      }
    }

    updateOutcomesSelectionSummary();
  }

  // Çoklu Seçim Açılır Menüsünü (Multi-select dropdown) Aç / Kapat
  if (outcomesDropdownTrigger) {
    outcomesDropdownTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (outcomesDropdownTrigger.disabled) return;
      const isOpen = outcomesChecklist.classList.toggle('is-open');
      outcomesDropdownTrigger.classList.toggle('is-open', isOpen);
      outcomesDropdownTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Dışarı tıklandığında açılır menüyü kapat
  document.addEventListener('click', (e) => {
    if (outcomesDropdownWrapper && !outcomesDropdownWrapper.contains(e.target) && e.target !== selectAllOutcomesBtn) {
      outcomesChecklist.classList.remove('is-open');
      if (outcomesDropdownTrigger) {
        outcomesDropdownTrigger.classList.remove('is-open');
        outcomesDropdownTrigger.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // Tümünü Seç Butonu İşlevi
  if (selectAllOutcomesBtn) {
    selectAllOutcomesBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (selectAllOutcomesBtn.disabled) return;
      const checkboxes = outcomesChecklist.querySelectorAll('input[type="checkbox"]');
      if (checkboxes.length === 0) return;

      const allChecked = Array.from(checkboxes).every(cb => cb.checked);
      checkboxes.forEach(cb => {
        cb.checked = !allChecked;
      });

      // Menü kapalıysa kullanıcı seçimleri görsün diye aç
      outcomesChecklist.classList.add('is-open');
      if (outcomesDropdownTrigger) {
        outcomesDropdownTrigger.classList.add('is-open');
        outcomesDropdownTrigger.setAttribute('aria-expanded', 'true');
      }

      updateOutcomesSelectionSummary();
    });
  }

  function updateOutcomesSelectionSummary() {
    const checkboxes = outcomesChecklist.querySelectorAll('input[type="checkbox"]');
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    const totalCount = checkboxes.length;
    const allChecked = totalCount > 0 && checkedCount === totalCount;

    if (selectAllOutcomesBtn) {
      selectAllOutcomesBtn.textContent = allChecked ? 'Seçimi Temizle' : 'Tümünü Seç';
    }

    if (outcomesSummaryText) {
      if (checkedCount > 0) {
        outcomesSummaryText.textContent = `${checkedCount} adet çıktı seçildi`;
      } else if (totalCount > 0) {
        outcomesSummaryText.textContent = `Kazanım seçmek için tıklayınız (0 / ${totalCount} seçili)`;
      } else {
        outcomesSummaryText.textContent = 'Önce yukarıdan bir ünite seçiniz...';
      }
    }
  }

  outcomesChecklist.addEventListener('change', () => {
    updateOutcomesSelectionSummary();
  });

  // ==========================================================================
  // 2. KAYNAK DOSYA YÜKLEME ALANI (DRAG & DROP: .DOCX, .PDF, .PNG, .JPG)
  // ==========================================================================
  function formatByteSize(bytes) {
    if (!bytes || bytes < 1024) return `${bytes || 0} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  }

  async function extractTextFromDocxFile(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      if (window.mammoth && typeof window.mammoth.extractRawText === 'function') {
        const result = await window.mammoth.extractRawText({ arrayBuffer });
        if (result && result.value) return result.value.trim();
      }
    } catch (err) {
      console.warn('Mammoth .docx okuma uyarısı:', err);
    }
    return '';
  }

  async function extractTextFromPdfFile(file) {
    try {
      if (!window.pdfjsLib) return '';
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      const maxPages = Math.min(pdf.numPages, 25);
      for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        const strings = content.items.map(item => item.str);
        fullText += strings.join(' ') + '\n\n';
      }
      return fullText.trim();
    } catch (err) {
      console.warn('PDF.js metin okuma uyarısı (Gemini multimodal OCR devrede):', err);
      return '';
    }
  }

  function readFileAsBase64DataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result || '');
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }

  async function handleIncomingSourceFiles(fileList) {
    if (!fileList || fileList.length === 0) return;

    const allowedExts = ['docx', 'pdf', 'png', 'jpg', 'jpeg'];

    for (const file of Array.from(fileList)) {
      const ext = (file.name.split('.').pop() || '').toLowerCase();
      if (!allowedExts.includes(ext)) {
        alert(`"${file.name}" desteklenmeyen bir dosya formatıdır. Lütfen Word (.docx), PDF (.pdf) veya Görsel (.png, .jpg) yükleyiniz.`);
        continue;
      }

      const fileId = `src_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      let extractedText = '';
      let base64Data = '';
      let mimeType = file.type;

      if (ext === 'docx') {
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        extractedText = await extractTextFromDocxFile(file);
      } else if (ext === 'pdf') {
        mimeType = 'application/pdf';
        extractedText = await extractTextFromPdfFile(file);
        base64Data = await readFileAsBase64DataUrl(file);
      } else if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') {
        mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
        base64Data = await readFileAsBase64DataUrl(file);
      }

      uploadedSourceFiles.push({
        id: fileId,
        name: file.name,
        size: file.size,
        ext,
        mimeType,
        base64Data,
        extractedText
      });
    }

    renderSourceFilePreviewList();
  }

  function renderSourceFilePreviewList() {
    if (!sourceFilePreviewList) return;
    sourceFilePreviewList.innerHTML = '';

    uploadedSourceFiles.forEach((f) => {
      const icon = f.ext === 'docx' ? '📘' : (f.ext === 'pdf' ? '📕' : '🖼️');
      const statusLabel = f.ext === 'docx'
        ? (f.extractedText ? `${f.extractedText.length} karakter metin okundu` : 'Word belgesi hazır')
        : (f.ext === 'pdf' ? 'PDF Metin & OCR Hazır' : 'Görsel OCR Hazır');

      const card = document.createElement('div');
      card.className = 'source-file-card';
      card.innerHTML = `
        <div class="source-file-left">
          <div class="source-file-icon">${icon}</div>
          <div class="source-file-meta">
            <div class="source-file-name" title="${escapeHtml(f.name)}">${escapeHtml(f.name)}</div>
            <div class="source-file-size">${formatByteSize(f.size)} • ${statusLabel}</div>
          </div>
        </div>
        <div class="source-file-actions">
          <button type="button" class="source-file-view-btn" data-view-id="${f.id}" title="Bu dosyayı 3D Sinematik Uzay Görüntüleyicide aç">🌌 3D Gör</button>
          <button type="button" class="source-file-remove-btn" data-remove-id="${f.id}" title="Dosyayı Kaldır (Sil)">✕</button>
        </div>
      `;

      const removeBtn = card.querySelector('[data-remove-id]');
      if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          uploadedSourceFiles = uploadedSourceFiles.filter(item => item.id !== f.id);
          renderSourceFilePreviewList();
        });
      }

      const viewBtn = card.querySelector('[data-view-id]');
      if (viewBtn) {
        viewBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          open3DSpaceViewerForSourceFile(f);
        });
      }

      sourceFilePreviewList.appendChild(card);
    });
  }

  if (sourceFileDropzone && sourceFileInput) {
    sourceFileDropzone.addEventListener('click', () => {
      sourceFileInput.click();
    });

    sourceFileDropzone.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        sourceFileInput.click();
      }
    });

    sourceFileInput.addEventListener('change', async (e) => {
      await handleIncomingSourceFiles(e.target.files);
      sourceFileInput.value = '';
    });

    ['dragenter', 'dragover'].forEach(evtName => {
      sourceFileDropzone.addEventListener(evtName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        sourceFileDropzone.classList.add('drag-over');
      });
    });

    ['dragleave', 'drop'].forEach(evtName => {
      sourceFileDropzone.addEventListener(evtName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        sourceFileDropzone.classList.remove('drag-over');
      });
    });

    sourceFileDropzone.addEventListener('drop', async (e) => {
      const dt = e.dataTransfer;
      if (dt && dt.files && dt.files.length > 0) {
        await handleIncomingSourceFiles(dt.files);
      }
    });
  }

  // ==========================================================================
  // 3. AKILLI OTOMATİK BAŞLIKLANDIRMA MODÜLÜ
  // ==========================================================================
  function getQuestionTypeShortLabel() {
    if (!questionTypeInput) return 'Çoktan Seçmeli LGS';
    const selectedOpt = questionTypeInput.options[questionTypeInput.selectedIndex];
    if (selectedOpt && selectedOpt.dataset.shortLabel) {
      return selectedOpt.dataset.shortLabel;
    }
    const map = {
      multiple_choice: 'Çoktan Seçmeli LGS',
      short_answer: 'Kısa Cevaplı / Boşluk Doldurma',
      open_ended: 'Açık Uçlu Klasik',
      structured_grid: 'Yapılandırılmış Grid',
      concept_map: 'Kavram Haritası',
      v_diagram: 'V Diyagramı',
      mixed: 'Karma Ölçme Testi'
    };
    return map[questionTypeInput.value] || 'Çoktan Seçmeli LGS';
  }

  function generateNextSmartTitle() {
    testSequenceCounter += 1;
    sessionStorage.setItem('rotali_test_seq_counter', String(testSequenceCounter));
    const formatLabel = getQuestionTypeShortLabel();
    currentSmartTitle = `Test No: ${testSequenceCounter} - ${formatLabel}`;
    applySmartTitleToUI(currentSmartTitle);
    return currentSmartTitle;
  }

  function applySmartTitleToUI(newTitle) {
    currentSmartTitle = (newTitle || '').trim() || `Test No: ${Math.max(1, testSequenceCounter)} - ${getQuestionTypeShortLabel()}`;
    if (smartAutoTitleHeading) {
      smartAutoTitleHeading.textContent = currentSmartTitle;
    }
    if (smartTitleInput) {
      smartTitleInput.value = currentSmartTitle;
    }
    if (testMetaTitle) {
      testMetaTitle.textContent = currentSmartTitle;
    }
    document.querySelectorAll('.exam-main-title, .mini-header-title').forEach(el => {
      el.textContent = currentSmartTitle;
    });
  }

  function getSanitizedSmartFilename(ext) {
    const raw = (currentSmartTitle || 'Yaprak_Test').trim();
    const safe = raw
      .replace(/[\\/:*?"<>|]+/g, ' - ')
      .replace(/\s+/g, ' ')
      .trim();
    return `${safe || 'Yaprak_Test'}.${ext}`;
  }

  if (editSmartTitleBtn) {
    editSmartTitleBtn.addEventListener('click', () => {
      if (smartTitleDisplay) smartTitleDisplay.style.display = 'none';
      if (smartTitleEditor) smartTitleEditor.style.display = 'flex';
      if (smartTitleInput) {
        smartTitleInput.value = currentSmartTitle;
        smartTitleInput.focus();
        smartTitleInput.select();
      }
    });
  }

  function commitSmartTitleEdit() {
    if (smartTitleInput && smartTitleInput.value.trim()) {
      applySmartTitleToUI(smartTitleInput.value.trim());
    }
    if (smartTitleEditor) smartTitleEditor.style.display = 'none';
    if (smartTitleDisplay) smartTitleDisplay.style.display = 'flex';
  }

  if (saveSmartTitleBtn) {
    saveSmartTitleBtn.addEventListener('click', commitSmartTitleEdit);
  }

  if (cancelSmartTitleBtn) {
    cancelSmartTitleBtn.addEventListener('click', () => {
      if (smartTitleEditor) smartTitleEditor.style.display = 'none';
      if (smartTitleDisplay) smartTitleDisplay.style.display = 'flex';
    });
  }

  if (smartTitleInput) {
    smartTitleInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        commitSmartTitleEdit();
      } else if (e.key === 'Escape') {
        if (smartTitleEditor) smartTitleEditor.style.display = 'none';
        if (smartTitleDisplay) smartTitleDisplay.style.display = 'flex';
      }
    });
  }

  // ==========================================================================
  // 4. SORU ÜRETİM FORMU GÖNDERİMİ (KAYNAK DOSYA + KAZANIM + OTOMATİK BAŞLIK)
  // ==========================================================================
  questionForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const checkedBoxes = outcomesChecklist.querySelectorAll('input[type="checkbox"]:checked');
    const selectedOutcomes = Array.from(checkedBoxes).map(cb => cb.value);
    const customText = customOutcome.value.trim();

    if (customText) {
      selectedOutcomes.push(customText);
    }

    if (selectedOutcomes.length === 0 && uploadedSourceFiles.length === 0) {
      alert('Lütfen listeden en az bir öğrenme çıktısı (kazanım) seçiniz, özel kazanım giriniz veya bir kaynak dosya (.docx, .pdf, .png, .jpg) yükleyiniz.');
      return;
    }

    if (selectedOutcomes.length === 0 && uploadedSourceFiles.length > 0) {
      selectedOutcomes.push(`Yüklenen kaynak dosyadaki (${uploadedSourceFiles.map(f => f.name).join(', ')}) konu ve kazanımlar`);
    }

    // Seçili Soru Türlerini Topla
    const selectedTypes = [];
    const qTypesList = [
      { key: 'multiple_choice', label: 'Çoktan Seçmeli', icon: '🔘' },
      { key: 'short_answer', label: 'Kısa Cevaplı / Boşluk Doldurma', icon: '✏️' },
      { key: 'open_ended', label: 'Açık Uçlu (Klasik)', icon: '📝' },
      { key: 'activity', label: 'Etkinlik', icon: '🎯' }
    ];

    qTypesList.forEach(item => {
      const cb = document.getElementById(`qt_cb_${item.key}`);
      const countInputEl = document.getElementById(`qt_count_${item.key}`);
      if (cb && cb.checked) {
        let actSubTypes = [];
        if (item.key === 'activity') {
          activitySubtypes.forEach(k => {
            const acb = document.getElementById(`act_cb_${k}`);
            const ainp = document.getElementById(`act_count_${k}`);
            if (acb && acb.checked) {
              actSubTypes.push({
                type: k,
                title: acb.dataset.title || k,
                count: parseInt(ainp ? ainp.value : '1', 10) || 1
              });
            }
          });
          if (actSubTypes.length === 0) {
            actSubTypes = [
              { type: 'matching', title: 'Eşleştirme', count: 2 },
              { type: 'ordering', title: 'Sıralama', count: 1 },
              { type: 'table_completion', title: 'Tablo Tamamlama', count: 2 }
            ];
          }
        }

        selectedTypes.push({
          type: item.key,
          label: item.label,
          icon: item.icon,
          count: parseInt(countInputEl ? countInputEl.value : '5', 10) || 5,
          activity_types: actSubTypes
        });
      }
    });

    if (selectedTypes.length === 0) {
      alert('Lütfen en az bir soru türü seçiniz (Çoktan Seçmeli, Kısa Cevaplı, Açık Uçlu veya Etkinlik).');
      return;
    }

    const grade = gradeInput.value;
    const subject = subjectInput.value.trim();
    const difficulty = difficultyInput.value;
    const unitName = curriculumData && curriculumData.units[selectedUnitIndex] ? curriculumData.units[selectedUnitIndex].name : "Genel";
    const outputMode = document.querySelector('input[name="qtOutputMode"]:checked')?.value || 'separate';

    setLoading(true);

    try {
      const combinedSourceText = uploadedSourceFiles
        .map(f => f.extractedText ? `[Dosya: ${f.name}]\n${f.extractedText}` : '')
        .filter(Boolean)
        .join('\n\n');

      generatedBatches = {};
      let allMergedQuestions = [];

      // Her seçili soru türü için döngüyle üretim yap
      for (let i = 0; i < selectedTypes.length; i++) {
        const item = selectedTypes[i];
        if (loadingState) {
          const loadingText = loadingState.querySelector('p');
          if (loadingText) {
            loadingText.innerHTML = `✨ <strong>${item.icon} ${item.label}</strong> soruları üretiliyor (${item.count} Soru)... [${i + 1} / ${selectedTypes.length}]`;
          }
        }

        const res = await fetch('/api/generate-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: localStorage.getItem('gemini_api_key') || '',
            grade,
            subject,
            learning_area: unitName,
            selected_outcomes: selectedOutcomes,
            question_count: item.count,
            difficulty,
            question_type: item.type,
            activity_types: item.activity_types || [],
            source_text: combinedSourceText,
            source_files: uploadedSourceFiles.map(f => ({
              name: f.name,
              mimeType: f.mimeType,
              base64Data: f.base64Data,
              extractedText: f.extractedText
            }))
          })
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || data.details || `${item.label} soruları oluşturulamadı.`);
        }

        const cleanedQuestions = (data.questions || []).map(q => {
          const cq = { ...q };
          cq.type = q.type || item.type;
          cq.question = cleanTurkishAndLatex(cq.question)
            .replace(/\bYukarıdaki\b/g, 'Yandaki')
            .replace(/\byukarıdaki\b/g, 'yandaki')
            .replace(/\bYukarıda\b/g, 'Yanda')
            .replace(/\byukarıda\b/g, 'yanda')
            .replace(/\bYukardaki\b/g, 'Yandaki')
            .replace(/\byukardaki\b/g, 'yandaki')
            .replace(/yukarıda\s+verilen/gi, 'yanda verilen')
            .replace(/yukarıdaki\s+görsel/gi, 'yandaki görsel')
            .replace(/yukarıdaki\s+model/gi, 'yandaki model')
            .replace(/yukarıdaki\s+şekil/gi, 'yandaki şekil');
          if (cq.options) {
            cq.options = { ...cq.options };
            ['A', 'B', 'C', 'D'].forEach(opt => {
              if (cq.options[opt]) cq.options[opt] = cleanTurkishAndLatex(cq.options[opt]);
            });
          }
          if (cq.correct_answer) cq.correct_answer = cleanTurkishAndLatex(cq.correct_answer);
          if (cq.explanation) cq.explanation = cleanTurkishAndLatex(cq.explanation);
          return cq;
        });

        const batchSmartTitle = item.type === 'activity' 
          ? `Etkinlik ${testSequenceCounter + 1} - Fen Bilimleri Etkinlikleri` 
          : `Test No: ${testSequenceCounter + 1} - ${item.label}`;

        generatedBatches[item.type] = {
          type: item.type,
          label: item.label,
          icon: item.icon,
          count: cleanedQuestions.length,
          questions: cleanedQuestions,
          meta: data.meta || { grade, subject, learning_area: unitName, selected_outcomes: selectedOutcomes, question_type: item.type },
          smartTitle: batchSmartTitle
        };

        allMergedQuestions = allMergedQuestions.concat(cleanedQuestions);
      }

      testSequenceCounter++;
      sessionStorage.setItem('rotali_test_seq_counter', String(testSequenceCounter));

      if (outputMode === 'separate' && selectedTypes.length > 1) {
        // Ayrı Dosyalar Modu: Sekmeleri göster
        renderBatchTabs(selectedTypes);
        const firstType = selectedTypes[0].type;
        switchBatch(firstType);
      } else if (outputMode === 'separate' && selectedTypes.length === 1) {
        if (batchFileTabsBar) batchFileTabsBar.style.display = 'none';
        const singleType = selectedTypes[0].type;
        const b = generatedBatches[singleType];
        currentQuestions = b.questions;
        currentMeta = b.meta;
        currentSmartTitle = b.smartTitle;
        editingQuestionIndex = -1;
        renderQuestions();
      } else {
        // Birleştirilmiş Mod: Bütün soruları tek listede numaralandır
        if (batchFileTabsBar) batchFileTabsBar.style.display = 'none';
        currentQuestions = allMergedQuestions;
        currentMeta = { grade, subject, learning_area: unitName, selected_outcomes: selectedOutcomes, question_type: 'mixed' };
        currentSmartTitle = `Test No: ${testSequenceCounter} - Bütünleşik Sınav (${allMergedQuestions.length} Soru)`;
        editingQuestionIndex = -1;
        renderQuestions();
      }

    } catch (err) {
      console.error('Soru üretim hatası:', err);
      alert(`Hata: ${err.message}`);
    } finally {
      setLoading(false);
    }
  });

  let targetPageCount = 'auto'; // 'auto' | 1 | 2 | 4 | 6

  // Profesyonel Kitapçık Sayfa Hesaplayıcı (2 veya 4 Sayfa Standardı)
  function partitionQuestions(questions, mode) {
    const total = questions.length;
    if (total === 0) return [];

    const MAX_PER_PAGE = 6;
    let targetPages = 2;

    if (mode === 1 || mode === '1') {
      targetPages = 1;
    } else if (mode === 2 || mode === '2') {
      targetPages = 2;
    } else if (mode === 4 || mode === '4') {
      targetPages = 4;
    } else if (mode === 6 || mode === '6') {
      targetPages = 6;
    } else {
      if (total <= 4) {
        targetPages = 1;
      } else if (total <= 10) {
        targetPages = 2;
      } else {
        targetPages = 4;
      }
    }

    const minPagesForCapacity = Math.ceil(total / MAX_PER_PAGE);
    targetPages = Math.max(targetPages, minPagesForCapacity);
    targetPages = Math.min(targetPages, total);

    const basePer = Math.floor(total / targetPages);
    let remainder = total % targetPages;
    const pages = [];
    let currentIdx = 0;

    for (let p = 0; p < targetPages; p++) {
      const take = basePer + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;
      const pageSlice = questions.slice(currentIdx, currentIdx + take);
      if (pageSlice.length > 0) {
        pages.push(pageSlice);
      }
      currentIdx += take;
    }

    return pages;
  }

  // 5. Üretilen Soruları Ekrana Çizme (Profesyonel Sınav Kitapçığı + Akıllı Başlık)
  
  function getActivityTypeMeta(actType) {
    const map = {
      matching: { name: 'Eşleştirme', icon: '🧩' },
      ordering: { name: 'Sıralama', icon: '🔢' },
      table_completion: { name: 'Tablo Tamamlama', icon: '📊' },
      image_analysis: { name: 'Görsel Yorumlama', icon: '🔍' },
      diagram_labeling: { name: 'Kavram Yerleştirme', icon: '🏷️' },
      visual_tagging: { name: 'Görsel Etiketleme', icon: '📌' },
      classification: { name: 'Sınıflandırma', icon: '📂' },
      experiment_analysis: { name: 'Deney Düzeneği İnceleme', icon: '🧪' },
      chart_interpretation: { name: 'Grafik Okuma', icon: '📈' },
      scientific_process: { name: 'Bilimsel Süreç', icon: '🔬' },
      daily_life_problem: { name: 'Yaşam Problemi', icon: '💡' },
      cut_paste_coloring: { name: 'Kes-Yapıştır & Boya', icon: '✂️' },
      stem_design: { name: 'STEM Tasarım', icon: '🚀' }
    };
    return map[actType] || { name: 'Etkinlik', icon: '🎯' };
  }

  function renderActivityBodyHtml(q) {
    const data = q.activity_data || {};
    let out = '';

    if (q.activity_type === 'matching' || (data.items_left && data.items_right)) {
      const lefts = data.items_left || [
        { id: 'A', text: '1. Kavram / Olay' },
        { id: 'B', text: '2. Kavram / Olay' },
        { id: 'C', text: '3. Kavram / Olay' }
      ];
      const rights = data.items_right || [
        { id: '1', text: 'Açıklama / Tanım 1' },
        { id: '2', text: 'Açıklama / Tanım 2' },
        { id: '3', text: 'Açıklama / Tanım 3' }
      ];

      out += `
        <div class="activity-matching-grid">
          <div class="activity-match-col">
            ${lefts.map(it => `
              <div class="activity-match-item">
                <span class="activity-match-tag">${it.id}</span>
                <span>${escapeHtml(it.text || it)}</span>
              </div>
            `).join('')}
          </div>
          <div class="activity-match-col">
            ${lefts.map(() => `
              <div class="activity-match-box">( ..... )</div>
            `).join('')}
          </div>
          <div class="activity-match-col">
            ${rights.map(it => `
              <div class="activity-match-item">
                <span class="activity-match-tag" style="background:#475569;">${it.id}</span>
                <span>${escapeHtml(it.text || it)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (q.activity_type === 'ordering' || data.order_items) {
      const items = data.order_items || ['1. Basamak', '2. Basamak', '3. Basamak', '4. Basamak'];
      out += `
        <div class="activity-ordering-list">
          ${items.map((it, idx) => `
            <div class="activity-order-row">
              <span class="activity-order-circle">${idx + 1}</span>
              <div class="activity-order-text">${escapeHtml(it)}</div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (q.activity_type === 'table_completion' || (data.table_headers && data.table_rows)) {
      const headers = data.table_headers || ['Kavram / Nesne', 'Temel Özellik', 'Örnek Durum'];
      const rows = data.table_rows || [
        ['Örnek 1', '................................', '................................'],
        ['Örnek 2', '................................', '................................']
      ];
      out += `
        <table class="activity-table">
          <thead>
            <tr>${headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${rows.map(row => `
              <tr>${row.map(cell => {
                const isBlank = String(cell).includes('...') || String(cell).includes('[ ]');
                return `<td class="${isBlank ? 'is-blank' : ''}">${escapeHtml(cell)}</td>`;
              }).join('')}</tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (q.activity_type === 'classification' || data.categories) {
      const cats = data.categories || ['1. Grup', '2. Grup'];
      const pool = data.category_items || ['Öğe A', 'Öğe B', 'Öğe C', 'Öğe D'];
      out += `
        <div style="font-size:11px; font-weight:700; color:#475569; margin-bottom:6px;">Kavram Havuzu: ${pool.map(p => `<span style="display:inline-block; padding:2px 8px; margin:2px; background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; font-weight:600;">${escapeHtml(p)}</span>`).join('')}</div>
        <div class="activity-class-boxes">
          ${cats.map(cat => `
            <div class="activity-class-col">
              <div class="activity-class-col-header">${escapeHtml(cat)}</div>
              <div class="activity-class-col-body">
                <div style="border-bottom:1px dashed #cbd5e1; height:24px;"></div>
                <div style="border-bottom:1px dashed #cbd5e1; height:24px;"></div>
                <div style="border-bottom:1px dashed #cbd5e1; height:24px;"></div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (q.activity_type === 'cut_paste_coloring') {
      out += `
        <div class="activity-cut-box">
          <span class="activity-cut-tag">✂️ KESİM ALANI</span>
          <div style="display:flex; gap:8px; flex-wrap:wrap; padding-top:6px;">
            ${(data.cut_cards || ['Kart 1', 'Kart 2', 'Kart 3']).map(c => `
              <div style="border:1.5px dashed #dc2626; border-radius:6px; padding:6px 12px; font-size:11px; font-weight:700; background:#fff; color:#991b1b;">
                ✂ ${escapeHtml(c)}
              </div>
            `).join('')}
          </div>
        </div>
        <div style="margin-top:8px; font-size:11px; font-weight:700; color:#475569;">Yukarıdaki parçaları keserek aşağıdaki yapıştırma kutularına yerleştiriniz:</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:6px;">
          <div style="border:1.5px dashed #3b82f6; border-radius:8px; height:60px; background:#f8fafc; display:flex; align-items:center; justify-content:center; color:#94a3b8; font-size:11px; font-weight:600;">[ Yapıştırma Alanı 1 ]</div>
          <div style="border:1.5px dashed #3b82f6; border-radius:8px; height:60px; background:#f8fafc; display:flex; align-items:center; justify-content:center; color:#94a3b8; font-size:11px; font-weight:600;">[ Yapıştırma Alanı 2 ]</div>
        </div>
      `;
    } else if (q.activity_type === 'stem_design' || q.activity_type === 'experiment_analysis') {
      out += `
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:8px 10px; margin:8px 0; font-size:11px;">
          ${data.materials ? `<div><strong>🧪 Gerekli Malzemeler:</strong> ${escapeHtml(Array.isArray(data.materials) ? data.materials.join(', ') : data.materials)}</div>` : ''}
          ${data.steps ? `<div style="margin-top:4px;"><strong>📋 Uygulama Basamakları:</strong> ${escapeHtml(Array.isArray(data.steps) ? data.steps.join(' → ') : data.steps)}</div>` : ''}
        </div>
        <div style="border:1.5px dashed #3b82f6; border-radius:8px; padding:10px; min-height:75px; background:#ffffff; margin-top:8px;">
          <div style="font-size:11px; font-weight:700; color:#2563eb; margin-bottom:4px;">✏️ Çözüm, Hipotez veya Tasarım Çizim Alanınız:</div>
          <div style="border-bottom:1px dashed #e2e8f0; height:24px;"></div>
          <div style="border-bottom:1px dashed #e2e8f0; height:24px;"></div>
        </div>
      `;
    } else {
      out += `
        <div class="open-ended-answer-area">
          <div class="answer-lines-prompt">Etkinlik çalışmanızı ve açıklamalarınızı yazınız:</div>
          <div class="student-writing-lines">
            <div class="write-line"></div>
            <div class="write-line"></div>
          </div>
        </div>
      `;
    }

    return out;
  }

  function renderQuestions() {
    const placeholder = document.getElementById('previewEmptyPlaceholder');
    if (placeholder) placeholder.style.display = 'none';
    const { grade = "5", subject = "Fen Bilimleri", learning_area = "", selected_outcomes = [] } = currentMeta;
    const total_questions = currentQuestions.length;

    const dynamicExamTitle = currentSmartTitle || `${grade}. SINIF ${subject.toUpperCase()} DENEME SINAVI`;

    if (smartTitleBanner) smartTitleBanner.style.display = 'block';
    if (smartAutoTitleHeading) smartAutoTitleHeading.textContent = dynamicExamTitle;
    if (testMetaTitle) testMetaTitle.textContent = dynamicExamTitle;
    if (questionCountBadge) questionCountBadge.textContent = `${total_questions} Soru`;
    if (printTitle) printTitle.textContent = dynamicExamTitle;
    if (printOutcomeText) printOutcomeText.textContent = selected_outcomes.join(' | ');

    document.body.classList.remove('grade-theme-5', 'grade-theme-6-7', 'grade-theme-8');
    if (grade === "5") document.body.classList.add('grade-theme-5');
    else if (grade === "8") document.body.classList.add('grade-theme-8');
    else document.body.classList.add('grade-theme-6-7');

    if (questionsContainer) questionsContainer.innerHTML = '';
    if (answerKeyGrid) answerKeyGrid.innerHTML = '';

    const targetMode = targetPageCount === 'auto' ? 'auto' : parseInt(targetPageCount, 10);
    const pages = partitionQuestions(currentQuestions, targetMode);
    const totalPagesCount = pages.length;

    if (questionCountBadge) {
      questionCountBadge.textContent = `${total_questions} Soru (${totalPagesCount} Sayfa)`;
    }

    let questionGlobalCounter = 1;

    pages.forEach((pageQuestions, pIdx) => {
      const pageNumber = pIdx + 1;
      const isFirstPage = (pageNumber === 1);
      const isLastPage = (pageNumber === totalPagesCount);

      const pageSheet = document.createElement('div');
      pageSheet.className = `a4-booklet-sheet ${totalPagesCount === 1 ? 'density-compact' : ''}`;
      pageSheet.id = `booklet-page-${pageNumber}`;

      let headerHtml = '';
      if (isFirstPage) {
        headerHtml = `
          <div class="booklet-exam-header">
            <div class="exam-header-top">
              <img src="rotali-fenci.jpg" class="exam-logo-left" alt="Logo">
              <div class="exam-title-center">
                <div class="exam-ministry">T.C. MİLLÎ EĞİTİM BAKANLIĞI • ${escapeHtml(grade)}. SINIF ${escapeHtml(subject.toUpperCase())}</div>
                <h1 class="exam-main-title">${escapeHtml(dynamicExamTitle)}</h1>
                <div class="exam-subtitle">${escapeHtml(learning_area || 'Kazanım Değerlendirme & Yaprak Test')}</div>
              </div>
              <img src="rotali-fenci.jpg" class="exam-logo-right" alt="Logo">
            </div>

            <div class="student-exam-table">
              <div class="st-field st-field-name">
                <span class="st-label">Adı Soyadı:</span>
                <span class="st-fill-line"></span>
              </div>
              <div class="st-field st-field-class">
                <span class="st-label">Sınıf / Şube:</span>
                <span class="st-fill-line st-fill-short"></span>
              </div>
              <div class="st-field st-field-no">
                <span class="st-label">Okul No:</span>
                <span class="st-fill-line st-fill-short"></span>
              </div>
              <div class="st-field st-field-date">
                <span class="st-label">Tarih:</span>
                <span class="st-date-val">..... / ..... / 2026</span>
              </div>
              <div class="st-field st-field-score">
                <span class="st-score-tag">D: <span class="st-box"></span></span>
                <span class="st-score-tag">Y: <span class="st-box"></span></span>
                <span class="st-score-tag">Puan: <span class="st-box st-box-wide"></span></span>
              </div>
            </div>
          </div>
        `;
      } else {
        headerHtml = `
          <div class="booklet-mini-header">
            <span class="mini-header-title">${escapeHtml(dynamicExamTitle)}</span>
            <span class="mini-header-tag">Rotalı Fenci</span>
          </div>
        `;
      }

      const webBadgeHtml = `
        <div class="page-top-badge no-print">
          <span>📄 Sayfa ${pageNumber} / ${totalPagesCount}</span>
          <span>${pageQuestions.length} Soru (Bu Sayfada)</span>
        </div>
      `;

      pageSheet.innerHTML = `
        ${webBadgeHtml}
        ${headerHtml}
        <div class="booklet-columns-grid">
          <div class="booklet-col booklet-col-left"></div>
          <div class="booklet-col-divider">
            <svg class="gutter-brand-svg" viewBox="0 0 16 180" width="16" height="180" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="10" width="16" height="160" fill="#ffffff" />
              <text x="8" y="90" text-anchor="middle" dominant-baseline="central" transform="rotate(90 8 90)" fill="#94a3b8" font-family="'Times New Roman', Times, serif" font-size="9" font-weight="700" letter-spacing="4">ROTALI FENCİ</text>
            </svg>
          </div>
          <div class="booklet-col booklet-col-right"></div>
        </div>
        <div class="booklet-page-footer">
          <div class="footer-left-brand">
            <svg class="instagram-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            <span class="instagram-username">Rotalı Fenci</span>
          </div>
          <div class="footer-page-center">
            Sayfa ${pageNumber} / ${totalPagesCount}
          </div>
          <div class="footer-right-web">
            <span class="footer-website-text">https://rotalifenci.vercel.app/</span>
          </div>
        </div>
      `;

      const leftColContainer = pageSheet.querySelector('.booklet-col-left');
      const rightColContainer = pageSheet.querySelector('.booklet-col-right');

      const mid = Math.ceil(pageQuestions.length / 2);
      const leftPageQuestions = pageQuestions.slice(0, mid);
      const rightPageQuestions = pageQuestions.slice(mid);

      function buildCard(q, qNum) {
        const card = document.createElement('div');
        card.className = `question-card ${editingQuestionIndex === (qNum - 1) ? 'is-editing' : ''}`;
        card.id = `q-card-${qNum}`;

        if (editingQuestionIndex === (qNum - 1)) {
          const isMultipleChoice = q.options && q.options.A;
          card.innerHTML = `
            <div class="question-header">
              <div class="question-number">${qNum}. Soru (Düzenleniyor)</div>
            </div>
            
            <div class="edit-field-group">
              <label><strong>Görsel / Çizim SVG Kodu:</strong></label>
              <textarea class="edit-textarea edit-visual-svg" rows="2">${escapeHtml(q.visual_svg || '')}</textarea>
            </div>

            <div class="edit-field-group">
              <label><strong>Soru Metni:</strong></label>
              <textarea class="edit-textarea edit-q-text" rows="2">${escapeHtml(q.question)}</textarea>
            </div>

            ${isMultipleChoice ? `
              <div class="edit-field-group">
                <label><strong>Seçenekler:</strong></label>
                ${['A', 'B', 'C', 'D'].map(opt => `
                  <div class="edit-opt-row">
                    <span class="edit-opt-letter">${opt})</span>
                    <input type="text" class="form-control edit-opt-${opt}" value="${escapeHtml(q.options[opt] || '')}">
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <div class="form-row" style="margin-top:8px;">
              <div class="form-group flex-1">
                <label><strong>Doğru Cevap:</strong></label>
                <input type="text" class="form-control edit-correct-text" value="${escapeHtml(q.correct_answer || '')}">
              </div>
              <div class="form-group flex-1">
                <label><strong>Zorluk:</strong></label>
                <select class="form-control edit-diff-select">
                  <option value="Kolay" ${q.difficulty === 'Kolay' ? 'selected' : ''}>Kolay</option>
                  <option value="Orta" ${q.difficulty === 'Orta' || !q.difficulty ? 'selected' : ''}>Orta</option>
                  <option value="Zor" ${q.difficulty === 'Zor' ? 'selected' : ''}>Zor</option>
                </select>
              </div>
            </div>

            <div class="edit-actions-footer">
              <button type="button" class="btn btn-secondary btn-sm" onclick="cancelEditQuestion()">İptal</button>
              <button type="button" class="btn btn-primary btn-sm" onclick="saveEditQuestion(${qNum - 1})">💾 Kaydet</button>
            </div>
          `;
        } else {
          const visualBoxHtml = q.visual_svg && q.visual_svg.trim() 
            ? `<div class="question-visual-box">${prepareSvgForDisplay(q.visual_svg, q.question, q.options, q.correct_answer)}</div>` 
            : '';

          let gridHtml = '';
          if (q.grid_items && q.grid_items.length > 0) {
            gridHtml = `
              <div class="structured-grid-container">
                <div class="grid-boxes-3x3">
                  ${q.grid_items.map((item, gIdx) => `
                    <div class="grid-box-cell">
                      <span class="grid-box-num">${gIdx + 1}</span>
                      <span class="grid-box-content">${escapeHtml(item)}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          }

          let contentBodyHtml = '';
          if (q.options && q.options.A) {
            const maxOptLen = Math.max(
              (q.options.A || '').length,
              (q.options.B || '').length,
              (q.options.C || '').length,
              (q.options.D || '').length
            );

            let optLayoutClass = 'options-stacked';
            if (maxOptLen <= 4) optLayoutClass = 'options-inline-row';
            else if (maxOptLen <= 24) optLayoutClass = 'options-grid-2x2';

            contentBodyHtml = `
              <div class="options-container ${optLayoutClass}">
                ${['A', 'B', 'C', 'D'].map(opt => `
                  <div class="option-item ${opt === q.correct_answer ? 'is-correct' : ''}">
                    <span class="option-letter">${opt}</span>
                    <span class="option-text">${escapeHtml(q.options[opt] || '')}</span>
                  </div>
                `).join('')}
              </div>
            `;
          } else if (q.type === 'open_ended') {
            contentBodyHtml = `
              <div class="open-ended-answer-area">
                <div class="answer-lines-prompt">Cevabınızı ve bilimsel gerekçenizi yazınız:</div>
                <div class="student-writing-lines">
                  <div class="write-line"></div>
                  <div class="write-line"></div>
                </div>
              </div>
            `;
          } else if (q.type === 'short_answer') {
            contentBodyHtml = `
              <div class="short-answer-area">
                <span class="short-ans-label">Cevap:</span>
                <span class="short-ans-line">......................................................................</span>
              </div>
            `;
          }

          card.innerHTML = `
            <div class="question-header">
              <div class="question-number">${qNum}. Soru</div>
              <div class="question-card-actions no-print">
                <button type="button" class="btn-zk-single-preview" title="Bu Soruyu Z-Kitap Akıllı Tahta Formatında Önizle" onclick="window.openZKitapQuestion(${qNum - 1})">📖 Z-Kitap Önizle</button>
                <button type="button" class="btn-action-icon" title="Düzenle" onclick="startEditQuestion(${qNum - 1})">✏️</button>
                <button type="button" class="btn-action-icon" title="Yeniden Üret" onclick="regenerateQuestion(${qNum - 1})">🔄</button>
                <button type="button" class="btn-action-icon btn-action-delete" title="Sil" onclick="deleteQuestion(${qNum - 1})">🗑️</button>
              </div>
            </div>
            ${visualBoxHtml}
            ${gridHtml}
            <div class="question-text-and-options">
              <div class="question-body">${escapeHtml(cleanTurkishAndLatex(q.question))}</div>
              ${contentBodyHtml}
            </div>
            <div class="solution-box" style="display: ${showSolutions ? 'block' : 'none'};">
              <strong>💡 Doğru Cevap: ${escapeHtml(q.correct_answer)}</strong>
              <div>${escapeHtml(q.explanation || 'Açıklama mevcut değil.')}</div>
            </div>
          `;
        }

        const akItem = document.createElement('div');
        akItem.className = 'answer-key-item';
        akItem.innerHTML = `<span class="q-no">${qNum}.</span> <span class="q-ans">${escapeHtml(q.correct_answer || '-')}</span>`;
        answerKeyGrid.appendChild(akItem);

        return card;
      }

      leftPageQuestions.forEach(q => {
        const qNum = questionGlobalCounter++;
        leftColContainer.appendChild(buildCard(q, qNum));
      });

      rightPageQuestions.forEach(q => {
        const qNum = questionGlobalCounter++;
        rightColContainer.appendChild(buildCard(q, qNum));
      });

      if (isLastPage) {
        const answerKeyStrip = document.createElement('div');
        answerKeyStrip.className = 'booklet-answer-key-strip';
        answerKeyStrip.innerHTML = `
          <div class="ans-strip-title">🎯 CEVAP VE KODLAMA ANAHTARI</div>
          <div class="ans-strip-items">
            ${currentQuestions.map((cq, cIdx) => `
              <div class="ans-strip-cell">
                <span class="cell-q">${cIdx + 1}</span>
                <span class="cell-a">${escapeHtml(cq.correct_answer || '-')}</span>
              </div>
            `).join('')}
          </div>
        `;
        const footer = pageSheet.querySelector('.booklet-page-footer');
        if (footer) {
          pageSheet.insertBefore(answerKeyStrip, footer);
        } else {
          pageSheet.appendChild(answerKeyStrip);
        }
      }

      questionsContainer.appendChild(pageSheet);
    });

    const addQBar = document.createElement('div');
    addQBar.className = 'add-question-bar no-print';
    addQBar.innerHTML = `
      <button type="button" class="btn btn-secondary btn-sm" onclick="addNewQuestion()">
        ➕ Yeni Soru Ekle
      </button>
    `;
    questionsContainer.appendChild(addQBar);

    emptyState.style.display = 'none';
    loadingState.style.display = 'none';
    questionsContainer.style.display = 'flex';
    actionToolbar.style.display = 'flex';
    viewControlsBar.style.display = 'flex';
    answerKeyBox.style.display = 'block';

    updateAnswerVisibility();
  }

  // Soru Düzenleme Fonksiyonları
  window.startEditQuestion = (idx) => {
    editingQuestionIndex = idx;
    renderQuestions();
  };

  
  // ==========================================================================
  // AKILLI SORU–GÖRSEL EŞLEŞTİRME VE DÜZENLEME KONTROLLERİ (ÖĞRETMEN ARAÇLARI)
  // ==========================================================================
  window.harmonizeQuestionVisual = (idx) => {
    if (idx < 0 || idx >= currentQuestions.length) return;
    const q = currentQuestions[idx];
    if (window.visualMatchEngine) {
      const brief = window.visualMatchEngine.generateVisualBrief(q.question, q.options || {}, q.correct_answer || '');
      q.visual_svg = brief.renderedHtml;
      renderQuestions();
      alert('✨ Görsel, soru metnindeki konu, kavram ve pedagojik işaretlere göre başarıyla uyarlandı:\n\n' + brief.coreConcept + ' (' + brief.assetAlt + ')');
    } else {
      alert('Görsel eşleştirme motoru hazır değil.');
    }
  };

  window.removeQuestionVisual = (idx) => {
    if (idx < 0 || idx >= currentQuestions.length) return;
    if (confirm('Bu soruya ait görseli kaldırmak istediğinizden emin misiniz?')) {
      currentQuestions[idx].visual_svg = '';
      renderQuestions();
    }
  };

  window.cancelEditQuestion = () => {
    editingQuestionIndex = -1;
    renderQuestions();
  };

  window.saveEditQuestion = (idx) => {
    const card = document.getElementById(`q-card-${idx + 1}`);
    if (!card) return;

    const visualSvg = card.querySelector('.edit-visual-svg')?.value.trim() || '';
    const questionText = card.querySelector('.edit-q-text')?.value.trim() || '';
    const optA = card.querySelector('.edit-opt-A')?.value.trim() || '';
    const optB = card.querySelector('.edit-opt-B')?.value.trim() || '';
    const optC = card.querySelector('.edit-opt-C')?.value.trim() || '';
    const optD = card.querySelector('.edit-opt-D')?.value.trim() || '';
    const correctAnswer = (card.querySelector('.edit-correct-text') || card.querySelector('.edit-correct-select'))?.value.trim() || 'A';
    const difficulty = card.querySelector('.edit-diff-select')?.value || 'Orta';

    if (!questionText) {
      alert('Lütfen soru metnini doldurunuz.');
      return;
    }

    const updated = {
      ...currentQuestions[idx],
      visual_svg: visualSvg,
      question: questionText,
      correct_answer: correctAnswer,
      difficulty: difficulty
    };

    if (currentQuestions[idx].options && currentQuestions[idx].options.A) {
      updated.options = { A: optA, B: optB, C: optC, D: optD };
    }

    currentQuestions[idx] = updated;
    editingQuestionIndex = -1;
    renderQuestions();
  };

  window.duplicateQuestion = (idx) => {
    if (idx < 0 || idx >= currentQuestions.length) return;
    const clone = JSON.parse(JSON.stringify(currentQuestions[idx]));
    if (clone.activity_title) {
      clone.activity_title += " (Kopya)";
    }
    currentQuestions.splice(idx + 1, 0, clone);
    editingQuestionIndex = -1;
    renderQuestions();
  };

  window.deleteQuestion = (idx) => {
    if (!confirm(`${idx + 1}. soruyu silmek istediğinize emin misiniz?`)) return;
    currentQuestions.splice(idx, 1);
    editingQuestionIndex = -1;
    if (currentQuestions.length === 0) {
      emptyState.style.display = 'block';
      questionsContainer.style.display = 'none';
      actionToolbar.style.display = 'none';
      viewControlsBar.style.display = 'none';
      answerKeyBox.style.display = 'none';
      if (smartTitleBanner) smartTitleBanner.style.display = 'none';
    } else {
      renderQuestions();
    }
  };

  window.regenerateQuestion = async (idx) => {
    const targetOutcome = currentQuestions[idx].learning_outcome || (currentMeta.selected_outcomes && currentMeta.selected_outcomes[0]) || "";
    const grade = currentMeta.grade || "5";
    const subject = currentMeta.subject || "Fen Bilimleri";
    const difficulty = currentQuestions[idx].difficulty || "Orta";

    const card = document.getElementById(`q-card-${idx + 1}`);
    if (card) {
      card.style.opacity = '0.5';
    }

    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: localStorage.getItem('gemini_api_key') || '',
          grade,
          subject,
          learning_area: currentMeta.learning_area || "Genel",
          selected_outcomes: [targetOutcome],
          question_count: 1,
          difficulty
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.questions || data.questions.length === 0) {
        throw new Error('Soru yeniden üretilemedi.');
      }

      const rawQ = data.questions[0];
      const cleanedQ = { ...rawQ };
      cleanedQ.question = cleanTurkishAndLatex(cleanedQ.question);
      if (cleanedQ.options) {
        cleanedQ.options = { ...cleanedQ.options };
        ['A', 'B', 'C', 'D'].forEach(opt => {
          if (cleanedQ.options[opt]) cleanedQ.options[opt] = cleanTurkishAndLatex(cleanedQ.options[opt]);
        });
      }
      if (cleanedQ.correct_answer) cleanedQ.correct_answer = cleanTurkishAndLatex(cleanedQ.correct_answer);
      if (cleanedQ.explanation) cleanedQ.explanation = cleanTurkishAndLatex(cleanedQ.explanation);
      if (cleanedQ.grid_items && Array.isArray(cleanedQ.grid_items)) {
        cleanedQ.grid_items = cleanedQ.grid_items.map(item => cleanTurkishAndLatex(item));
      }
      currentQuestions[idx] = cleanedQ;
      editingQuestionIndex = -1;
      renderQuestions();

    } catch (err) {
      alert(`Hata: ${err.message}`);
      if (card) card.style.opacity = '1';
    }
  };

  window.addNewQuestion = () => {
    const newQ = {
      id: currentQuestions.length + 1,
      question: "Yeni soru metnini buraya yazınız...",
      options: { A: "A şıkkı", B: "B şıkkı", C: "C şıkkı", D: "D şıkkı" },
      correct_answer: "A",
      learning_outcome: (currentMeta.selected_outcomes && currentMeta.selected_outcomes[0]) || "Genel Kazanım",
      difficulty: "Orta",
      explanation: "Doğru cevap açıklaması..."
    };

    currentQuestions.push(newQ);
    editingQuestionIndex = currentQuestions.length - 1;
    renderQuestions();
  };

  // 6. Bilgisayara Kaydetme: Word (.docx) İndir (Akıllı Otomatik Başlık Varsayılan Dosya Adı İle)
  if (downloadDocxBtn) {
    downloadDocxBtn.addEventListener('click', async () => {
      if (currentQuestions.length === 0) return;

      try {
        downloadDocxBtn.disabled = true;
        downloadDocxBtn.innerHTML = '<span class="icon">⏳</span> İndiriliyor...';

        const res = await fetch('/api/export-docx', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: currentSmartTitle,
            grade: currentMeta.grade || "5",
            subject: currentMeta.subject || "Fen Bilimleri",
            learning_area: currentMeta.learning_area || "",
            questions: currentQuestions,
            target_pages: targetPageCount,
            include_answers: true
          })
        });

        if (!res.ok) throw new Error('Word belgesi oluşturulamadı.');

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = getSanitizedSmartFilename('docx');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

      } catch (err) {
        console.error('Word indirme hatası:', err);
        alert(`Word dosyası indirilemedi: ${err.message}`);
      } finally {
        downloadDocxBtn.disabled = false;
        downloadDocxBtn.innerHTML = '<span class="icon">📄</span> Word (.docx)';
      }
    });
  }

  // 7. Bilgisayara Kaydetme: JSON İndir (Akıllı Başlık Dosya Adı İle)
  if (downloadJsonBtn) {
    downloadJsonBtn.addEventListener('click', () => {
      if (currentQuestions.length === 0) return;

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
        title: currentSmartTitle,
        meta: currentMeta,
        questions: currentQuestions
      }, null, 2));

      const a = document.createElement('a');
      a.href = dataStr;
      a.download = getSanitizedSmartFilename('json');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  // 8. Bilgisayara Doğrudan PDF Olarak İndir (Akıllı Başlık Varsayılan Dosya Adı İle)
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', async () => {
      if (currentQuestions.length === 0) return;

      const sheets = document.querySelectorAll('.a4-booklet-sheet');
      if (sheets.length === 0) return;

      try {
        downloadPdfBtn.disabled = true;
        downloadPdfBtn.innerHTML = '<span class="icon">⏳</span> PDF İndiriliyor...';

        document.body.classList.add('pdf-export-mode');
        await new Promise(resolve => setTimeout(resolve, 150));

        const jsPdfLib = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
        if (!jsPdfLib || !window.html2canvas) {
          throw new Error('PDF kütüphanesi yüklenemedi.');
        }

        const pdf = new jsPdfLib({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: true
        });

        for (let i = 0; i < sheets.length; i++) {
          const sheet = sheets[i];

          const canvas = await html2canvas(sheet, {
            scale: 2.2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            scrollX: 0,
            scrollY: 0,
            windowWidth: 794
          });

          const imgData = canvas.toDataURL('image/jpeg', 0.98);

          if (i > 0) {
            pdf.addPage('a4', 'portrait');
          }

          const pdfW = 210;
          const pdfH = 297;
          const imgH = (canvas.height * pdfW) / canvas.width;
          const finalH = Math.min(imgH, pdfH);

          pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, finalH, undefined, 'FAST');
        }

        pdf.save(getSanitizedSmartFilename('pdf'));

      } catch (err) {
        console.error('PDF indirme hatası:', err);
        window.print();
      } finally {
        document.body.classList.remove('pdf-export-mode');
        downloadPdfBtn.disabled = false;
        downloadPdfBtn.innerHTML = '<span class="icon">📥</span> PDF İndir';
      }
    });
  }

  // Doğrudan Yazıcıya Gönder (Yazdır Butonu)
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // 9. Metin Olarak Kopyala
  if (copyAllBtn) {
    copyAllBtn.addEventListener('click', () => {
      if (currentQuestions.length === 0) return;

      let text = `=== ${currentSmartTitle || testMetaTitle.textContent} ===\n`;
      text += `Kazanımlar: ${(currentMeta.selected_outcomes || []).join(', ')}\n\n`;
      currentQuestions.forEach((q, idx) => {
        text += `Soru ${idx + 1}: ${q.question}\n`;
        if (q.options) {
          text += `A) ${q.options.A}\n`;
          text += `B) ${q.options.B}\n`;
          text += `C) ${q.options.C}\n`;
          text += `D) ${q.options.D}\n`;
        }
        text += `Doğru Cevap: ${q.correct_answer}\n`;
        if (q.explanation) text += `Çözüm: ${q.explanation}\n`;
        text += `\n`;
      });

      navigator.clipboard.writeText(text).then(() => {
        const orig = copyAllBtn.innerHTML;
        copyAllBtn.innerHTML = '<span class="icon">✅</span> Kopyalandı!';
        setTimeout(() => { copyAllBtn.innerHTML = orig; }, 2000);
      });
    });
  }

  // 10. Görünüm Ayarları (Cevap Anahtarı ve Çözüm Göster/Gizle)
  if (toggleAnswersBtn) {
    toggleAnswersBtn.addEventListener('click', () => {
      showAnswers = !showAnswers;
      updateAnswerVisibility();
    });
  }

  function updateAnswerVisibility() {
    if (!questionsContainer || !toggleAnswersBtn) return;
    if (showAnswers) {
      questionsContainer.classList.add('show-answers');
      toggleAnswersBtn.classList.add('active');
      toggleAnswersBtn.innerHTML = '<span class="icon">🙈</span> Cevapları Gizle';
    } else {
      questionsContainer.classList.remove('show-answers');
      toggleAnswersBtn.classList.remove('active');
      toggleAnswersBtn.innerHTML = '<span class="icon">👁️</span> Cevap Anahtarını Göster';
    }
  }

  if (toggleSolutionsBtn) {
    toggleSolutionsBtn.addEventListener('click', () => {
      showSolutions = !showSolutions;
      document.querySelectorAll('.solution-box').forEach(box => {
        box.style.display = showSolutions ? 'block' : 'none';
      });
      toggleSolutionsBtn.classList.toggle('active', showSolutions);
      toggleSolutionsBtn.innerHTML = showSolutions 
        ? '<span class="icon">🔒</span> Çözümleri Kapat' 
        : '<span class="icon">💡</span> Çözüm ve Açıklamalar';
    });
  }

  function setLoading(isLoading) {
    if (isLoading) {
      loadingState.style.display = 'block';
      emptyState.style.display = 'none';
      questionsContainer.style.display = 'none';
      actionToolbar.style.display = 'none';
      viewControlsBar.style.display = 'none';
      answerKeyBox.style.display = 'none';
      generateBtn.disabled = true;
      generateBtn.innerHTML = '<span class="spinner" style="width:16px;height:16px;margin:0 6px 0 0;border-width:2px;display:inline-block;vertical-align:middle;"></span><span>Sorular Hazırlanıyor...</span>';
    } else {
      loadingState.style.display = 'none';
      generateBtn.disabled = false;
      generateBtn.innerHTML = '<span class="btn-icon">✨</span><span class="btn-text">Soruları Gemini AI İle Üret</span>';
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // 11. Sayfa Mizanpajı & Sayfa Sayısı Kontrolleri
  window.setTargetPages = function(pages) {
    if (pages === 'auto' || pages === '"auto"') {
      targetPageCount = 'auto';
    } else {
      targetPageCount = parseInt(pages, 10) || 1;
    }

    document.querySelectorAll('.btn-page-count').forEach(btn => {
      const p = btn.getAttribute('data-pages');
      btn.classList.toggle('active', p === String(targetPageCount));
    });

    document.querySelectorAll('.btn-quick-page').forEach(btn => {
      const p = btn.getAttribute('data-pages');
      btn.classList.toggle('active', p === String(targetPageCount));
    });

    const targetInput = document.getElementById('targetPageCount');
    if (targetInput) targetInput.value = targetPageCount;

    const feedback = document.getElementById('pageCountFeedback');
    if (feedback) {
      if (targetPageCount === 'auto') {
        feedback.innerHTML = `<span>🎯 <strong>Akıllı Otomatik Mod:</strong> Soru hacmine göre A4 sayfaları %90-95 dolulukla otomatik ayarlanır.</span>`;
        feedback.style.borderColor = '#4f46e5';
      } else if (targetPageCount === 1) {
        feedback.innerHTML = `<span>⚡ <strong>1 Sayfa Seçildi:</strong> Test tek bir A4 yaprağına sığdırılacak.</span>`;
        feedback.style.borderColor = '#818cf8';
      } else if (targetPageCount === 2) {
        feedback.innerHTML = `<span>📑 <strong>2 Sayfa Seçildi:</strong> Test 2 sayfaya (önlü-arkalı) dengeli dağıtılacak.</span>`;
        feedback.style.borderColor = '#10b981';
      } else if (targetPageCount === 4) {
        feedback.innerHTML = `<span>📚 <strong>4 Sayfa Seçildi:</strong> Test 4 tam sayfaya (LGS kitapçık formatı) dağıtılacak.</span>`;
        feedback.style.borderColor = '#f59e0b';
      } else if (targetPageCount === 6) {
        feedback.innerHTML = `<span>📖 <strong>6 Sayfa Seçildi:</strong> Kapsamlı ünite değerlendirme kitapçığı formatı.</span>`;
        feedback.style.borderColor = '#ec4899';
      }
    }

    if (currentQuestions && currentQuestions.length > 0) {
      renderQuestions();
    }
  };

  document.querySelectorAll('.btn-page-count').forEach(btn => {
    btn.addEventListener('click', () => {
      setTargetPages(btn.dataset.pages);
    });
  });

  document.querySelectorAll('.btn-quick-page').forEach(btn => {
    btn.addEventListener('click', () => {
      setTargetPages(btn.dataset.pages);
    });
  });

  const toggleColumnsBtn = document.getElementById('toggleColumnsBtn');
  const fontSizeDownBtn = document.getElementById('fontSizeDownBtn');
  const fontSizeUpBtn = document.getElementById('fontSizeUpBtn');

  if (toggleColumnsBtn) {
    toggleColumnsBtn.addEventListener('click', () => {
      const grids = document.querySelectorAll('.page-questions-grid');
      const isTwoCol = toggleColumnsBtn.classList.toggle('active');
      grids.forEach(g => g.classList.toggle('two-columns', isTwoCol));
    });
  }

  let currentFontSize = 14;
  if (fontSizeDownBtn) {
    fontSizeDownBtn.addEventListener('click', () => {
      currentFontSize = Math.max(10, currentFontSize - 1);
      questionsContainer.style.fontSize = `${currentFontSize}px`;
    });
  }

  if (fontSizeUpBtn) {
    fontSizeUpBtn.addEventListener('click', () => {
      currentFontSize = Math.min(18, currentFontSize + 1);
      questionsContainer.style.fontSize = `${currentFontSize}px`;
    });
  }

  // ==========================================================================
  // 🌌 1. DOSYA GÖRÜNTÜLEYİCİ VE ARAYÜZ TASARIMI (3D SİNEMATİK DERİN UZAY MODU)
  // ==========================================================================
  let ypSpaceSlides = [];
  let ypActiveSlideIdx = 0;
  let ypSpeechActive = false;

  function buildDefaultSpaceIllustrationSvg(title, idx) {
    const colors = [
      ['#38bdf8', '#818cf8', '#facc15'],
      ['#a855f7', '#ec4899', '#38bdf8'],
      ['#f97316', '#facc15', '#10b981'],
      ['#10b981', '#38bdf8', '#a855f7']
    ];
    const [c1, c2, c3] = colors[idx % colors.length];
    return `
      <svg viewBox="0 0 520 380" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="planetGlow_${idx}" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${c1}" stop-opacity="0.85"/>
            <stop offset="60%" stop-color="${c2}" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#050a18" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="ringGrad_${idx}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${c3}" stop-opacity="0.9"/>
            <stop offset="100%" stop-color="${c1}" stop-opacity="0.2"/>
          </linearGradient>
        </defs>
        <rect width="520" height="380" rx="18" fill="#050a18"/>
        <circle cx="85" cy="70" r="2" fill="#ffffff" opacity="0.8"/>
        <circle cx="440" cy="60" r="2.5" fill="${c3}" opacity="0.9"/>
        <circle cx="410" cy="310" r="1.8" fill="#ffffff" opacity="0.7"/>
        <circle cx="95" cy="300" r="2" fill="${c1}" opacity="0.8"/>
        <circle cx="260" cy="180" r="135" fill="url(#planetGlow_${idx})"/>
        <ellipse cx="260" cy="180" rx="165" ry="52" fill="none" stroke="url(#ringGrad_${idx})" stroke-width="5" transform="rotate(-18 260 180)"/>
        <circle cx="260" cy="180" r="74" fill="${c1}" opacity="0.9"/>
        <circle cx="240" cy="160" r="18" fill="#ffffff" opacity="0.25"/>
        <circle cx="385" cy="115" r="22" fill="${c3}" opacity="0.95"/>
        <text x="260" y="345" text-anchor="middle" fill="#e2e8f0" font-family="'Outfit', sans-serif" font-size="15" font-weight="700">${escapeHtml((title || 'Rotalı Fenci 3D Uzay Modülü').slice(0, 42))}</text>
      </svg>
    `;
  }

  function buildSlidesFromCurrentState() {
    // 1. Eğer üretilmiş sorular varsa soruları 3D Sinematik Uzay Slaytlarına dönüştür
    if (currentQuestions && currentQuestions.length > 0) {
      const unitTitle = currentMeta.learning_area || 'Fen Bilimleri Yaprak Test & Deneme';
      return currentQuestions.map((q, idx) => {
        const cards = [];
        cards.push({
          neon: 'neon-blue',
          html: `<strong>Soru ${idx + 1}:</strong> ${escapeHtml(q.question)}`
        });
        if (q.options && q.options.A) {
          ['A', 'B', 'C', 'D'].forEach((letter, oIdx) => {
            const neonColors = ['neon-blue', 'neon-purple', 'neon-orange', 'neon-emerald'];
            cards.push({
              neon: neonColors[oIdx % neonColors.length],
              html: `<strong>${letter})</strong> ${escapeHtml(q.options[letter] || '')}`
            });
          });
        }
        return {
          category: `🚀 ${currentMeta.grade || gradeInput.value}. SINIF • ${unitTitle}`,
          title: `${currentSmartTitle} — Soru ${idx + 1}`,
          subtitle: q.learning_outcome || 'MEB Türkiye Yüzyılı Maarif Modeli Kazanım Sorusu',
          cards,
          goldenRule: `Doğru Cevap: ${q.correct_answer || '-'} — ${q.explanation || 'Kavramları karşılaştırarak bilimsel çıkarım yapınız.'}`,
          visualHtml: (q.visual_svg && q.visual_svg.trim())
            ? q.visual_svg
            : buildDefaultSpaceIllustrationSvg(`Soru ${idx + 1} - ${unitTitle}`, idx)
        };
      });
    }

    // 2. Eğer kaynak dosya yüklendiyse kaynak dosyayı 3D Uzay Slaytlarına ayrıştır
    if (uploadedSourceFiles.length > 0) {
      return convertSourceFileToSlides(uploadedSourceFiles[uploadedSourceFiles.length - 1]);
    }

    // 3. Seçili ünitenin kazanımlarını 3D Sinematik Uzay Sunumu olarak göster
    const unit = (curriculumData && curriculumData.units && curriculumData.units[selectedUnitIndex])
      ? curriculumData.units[selectedUnitIndex]
      : { name: '1. Ünite: Güneş, Dünya ve Ay', outcomes: [] };
    const outcomes = getUnitOutcomesList(unit);

    return outcomes.map((out, idx) => {
      const text = typeof out === 'object' ? out.text : String(out);
      const code = typeof out === 'object' ? (out.id || `FB.${idx + 1}`) : `FB.${idx + 1}`;
      return {
        category: `🌌 ${gradeInput.value}. SINIF FEN BİLİMLERİ • ${unit.name}`,
        title: `${code} — Öğrenme Çıktısı & Konu Özeti`,
        subtitle: 'Akıllı Tahta (16:9) Uyumlu 3D Sinematik Derin Uzay Eğitim Modülü',
        cards: [
          { neon: 'neon-blue', html: `<strong>Hedef Öğrenme Çıktısı:</strong> ${escapeHtml(text)}` },
          { neon: 'neon-purple', html: `<strong>Bilimsel Süreç:</strong> Gözlem, modelleme ve veriye dayalı karşılaştırma becerilerini içerir.` },
          { neon: 'neon-orange', html: `<strong>Soru Üretim İpucu:</strong> Sol panelden bu kazanımı işaretleyip <em>"Soruları Gemini AI İle Üret"</em> butonuna basarak yeni nesil şekilli sorular oluşturabilirsiniz.` }
        ],
        goldenRule: `Altın Kural: ${unit.name} ünitesindeki "${code}" kazanımı LGS ve yazılı sınavlarda görsel/model yorumlama sorusu olarak sıkça karşımıza çıkar.`,
        visualHtml: buildDefaultSpaceIllustrationSvg(`${code} • ${unit.name}`, idx)
      };
    });
  }

  function convertSourceFileToSlides(sourceFile) {
    if (!sourceFile) return [];
    if (sourceFile.ext === 'png' || sourceFile.ext === 'jpg' || sourceFile.ext === 'jpeg') {
      return [{
        category: `🖼️ YÜKLENEN GÖRSEL KAYNAK • ${sourceFile.name}`,
        title: sourceFile.name,
        subtitle: 'Görsel İçerik ve Gemini AI OCR Soru Üretim Kaynağı',
        cards: [
          { neon: 'neon-blue', html: `<strong>Dosya Adı:</strong> ${escapeHtml(sourceFile.name)} (${formatByteSize(sourceFile.size)})` },
          { neon: 'neon-purple', html: `<strong>OCR & Görsel Analiz:</strong> Bu görseldeki metinler, tablolar ve şekiller Gemini AI tarafından okunarak soru üretiminde doğrudan veri olarak kullanılır.` }
        ],
        goldenRule: 'İpucu: Görsel kaynağınız yüklendi! Şimdi "Soruları Gemini AI İle Üret" butonuna tıklayarak bu görseldeki içerikten yeni sorular üretebilirsiniz.',
        visualHtml: `<img src="${sourceFile.base64Data}" alt="${escapeHtml(sourceFile.name)}" />`
      }];
    }

    const rawText = (sourceFile.extractedText || '').trim();
    if (!rawText) {
      return [{
        category: `📄 YÜKLENEN BELGE • ${sourceFile.name}`,
        title: sourceFile.name,
        subtitle: 'Eğitim Sunumu / Kaynak Dosya Görüntüleyici',
        cards: [
          { neon: 'neon-blue', html: `<strong>Dosya:</strong> ${escapeHtml(sourceFile.name)} (${formatByteSize(sourceFile.size)})` },
          { neon: 'neon-emerald', html: `<strong>Durum:</strong> Belge sisteme başarıyla yüklendi ve Gemini AI soru üretim motoruna bağlandı.` }
        ],
        goldenRule: 'Altın Kural: Bu dosyadan otomatik soru üretmek için sol paneldeki "Soruları Gemini AI İle Üret" butonuna tıklayabilirsiniz.',
        visualHtml: buildDefaultSpaceIllustrationSvg(sourceFile.name, 0)
      }];
    }

    const paragraphs = rawText
      .split(/\n+/)
      .map(p => p.trim())
      .filter(p => p.length > 2);

    const chunkSize = 4;
    const slides = [];
    for (let i = 0; i < paragraphs.length; i += chunkSize) {
      const slice = paragraphs.slice(i, i + chunkSize);
      const heading = slice[0].length < 95 ? slice[0] : `${sourceFile.name} — Bölüm ${slides.length + 1}`;
      const bodyLines = slice[0].length < 95 ? slice.slice(1) : slice;
      const goldenLine = bodyLines.find(l => /özet|ipucu|altın kural|dikkat|not|önemli/i.test(l))
        || bodyLines[bodyLines.length - 1]
        || heading;

      const neonClasses = ['neon-blue', 'neon-purple', 'neon-orange', 'neon-emerald'];
      const cards = (bodyLines.length > 0 ? bodyLines : [heading]).map((line, lIdx) => ({
        neon: neonClasses[lIdx % neonClasses.length],
        html: escapeHtml(line)
      }));

      slides.push({
        category: `📂 KAYNAK İÇERİK • ${sourceFile.name}`,
        title: heading,
        subtitle: `Bölüm ${slides.length + 1} • 3D Sinematik Akıllı Tahta Görünümü`,
        cards,
        goldenRule: goldenLine,
        visualHtml: buildDefaultSpaceIllustrationSvg(heading, slides.length)
      });
    }

    return slides.length > 0 ? slides : [{
      category: `📂 KAYNAK İÇERİK • ${sourceFile.name}`,
      title: sourceFile.name,
      subtitle: 'Eğitim İçeriği',
      cards: [{ neon: 'neon-blue', html: escapeHtml(rawText.slice(0, 600)) }],
      goldenRule: 'Özet: Kaynak dosya başarıyla ayrıştırıldı.',
      visualHtml: buildDefaultSpaceIllustrationSvg(sourceFile.name, 0)
    }];
  }

  
  // ========================================================
  // 📖 ROTALI FENCİ – Z-KİTAP AKILLI TAHTA ÖNİZLEME MOTORU
  // ========================================================
  let zkActiveSlideIdx = 0;
  let zkFontScale = 1.0;
  let zkIsSplitMode = false;
  let zkShowSolutions = false;
  let zkTimerInterval = null;
  let zkTimerSeconds = 1200;
  let zkTimerIsPaused = false;
  let zkUserAnswers = {};
  let zkCurrentQuestions = [];

  function formatQuestionStemText(rawText) {
    if (typeof cleanSpatialReferences === 'function') {
      rawText = cleanSpatialReferences(rawText);
    }
    rawText = cleanTurkishAndLatex(rawText);
    let text = String(rawText || '').trim();
    text = text.replace(/^Soru\s*\d+\s*[:.-]\s*/i, '');
    const keywordsToUnderline = [
      'değildir', 'degildir', 'olamaz', 'ulaşılamaz', 'ulasilamaz', 'söylenemez',
      'soylenemez', 'kesinlikle', 'en fazladır', 'en azdır', 'yanlıştır', 'dogru degildir',
      'beklenmez', 'gösterilemez', 'gosterilemez', 'hangisidir'
    ];
    keywordsToUnderline.forEach(kw => {
      const reg = new RegExp(`\\b(${kw})\\b`, 'gi');
      text = text.replace(reg, '<u>$1</u>');
    });
    return text;
  }

  function renderZKitapPreview(questionsOrSlides, initialIndex = 0, docTitle = '') {
    if (!ypSpaceViewerModal || !ypSpaceScrollStream) return;

    // Soru listesini doğrula veya mevcut durumdan al
    let qList = [];
    if (Array.isArray(questionsOrSlides) && questionsOrSlides.length > 0) {
      if (questionsOrSlides[0].question) {
        qList = questionsOrSlides;
      } else {
        qList = questionsOrSlides.map((s, i) => ({
          id: i + 1,
          question: (s.cards && s.cards[0] ? s.cards[0].html.replace(/<[^>]+>/g, '') : s.title) || `Soru ${i + 1}`,
          visual_svg: s.visualHtml || '',
          options: {},
          correct_answer: s.goldenRule ? s.goldenRule.replace(/<[^>]+>/g, '') : '',
          explanation: s.subtitle || ''
        }));
      }
    } else if (currentQuestions && currentQuestions.length > 0) {
      qList = currentQuestions;
    } else {
      // Örnek soru ile Z-Kitap modunu başlat
      const uName = (curriculumData && curriculumData.units && curriculumData.units[selectedUnitIndex])
        ? curriculumData.units[selectedUnitIndex].name
        : 'Fen Bilimleri';
      qList = [{
        id: 1,
        question: `${gradeInput ? gradeInput.value : '5'}. Sınıf ${uName} konusu için hazırlanan sorunun bilimsel açıklaması ve yorumu aşağıdakilerden hangisinde doğru verilmiştir?`,
        options: {
          A: "Gözlemler doğrudan bilimsel kanıt olarak değerlendirilir.",
          B: "Model üzerinde yapılan ölçümler hatalı sonuç verebilir.",
          C: "Farklı kaynaklardan toplanan veriler birbiriyle karşılaştırılmalıdır.",
          D: "Bilimsel sonuçlar yalnızca tek bir deneye dayanır."
        },
        correct_answer: "C",
        explanation: "Bilimsel çalışmalarda doğrulanabilirlik için farklı kaynaklardan elde edilen veriler karşılaştırılmalıdır."
      }];
    }

    zkCurrentQuestions = qList;
    zkActiveSlideIdx = Math.max(0, Math.min(initialIndex, qList.length - 1));

    // Modal Üst Bilgileri
    const zkModalUnitTag = document.getElementById('zkModalUnitTag');
    const zkModalCounterPill = document.getElementById('zkModalCounterPill');
    const ypSpaceDocTitle = document.getElementById('ypSpaceDocTitle');

    const gradeVal = currentMeta.grade || (gradeInput ? gradeInput.value : '5');
    const unitTitle = currentMeta.learning_area || (curriculumData && curriculumData.units && curriculumData.units[selectedUnitIndex] ? curriculumData.units[selectedUnitIndex].name : 'Fen Bilimleri');

    if (zkModalUnitTag) {
      zkModalUnitTag.textContent = `${gradeVal}. SINIF • ${unitTitle.toUpperCase()}`;
    }
    if (ypSpaceDocTitle) {
      ypSpaceDocTitle.textContent = docTitle || currentSmartTitle || `${gradeVal}. Sınıf Fen Bilimleri Z-Kitap`;
    }

    // Kronometre Başlat (Soru Başı 1 Dakika)
    initZKitapTimer(Math.max(1, qList.length) * 60);

    // Soruları Z-Kitap Slaytlarına Dönüştür
    ypSpaceScrollStream.innerHTML = '';
    const routesList = document.getElementById('ypSpaceRoutesList');
    if (routesList) routesList.innerHTML = '';

    qList.forEach((q, idx) => {
      const qNum = idx + 1;
      const isMultipleChoice = q.options && q.options.A;
      const isShortAnswer = q.type === 'short_answer';
      const isOpenEnded = q.type === 'open_ended' || (!isMultipleChoice && !isShortAnswer);

      const correctAns = String(q.correct_answer || '').trim();
      const formattedStem = formatQuestionStemText(q.question);
      const stemLen = formattedStem.length;

      let sizeClass = 'zk-size-large';
      if (stemLen > 280) sizeClass = 'zk-size-compact';
      else if (stemLen > 140) sizeClass = 'zk-size-medium';

      // Soru Görseli (Varsa temizle ve üstte göster)
      let visualHtml = '';
      if (q.visual_svg && q.visual_svg.trim()) {
        const cleanedSvg = prepareSvgForDisplay(q.visual_svg, q.question, q.options, q.correct_answer);
        if (cleanedSvg) {
          visualHtml = `<div class="zk-visual-container">${cleanedSvg}</div>`;
        }
      }

      // Seçenekler (A, B, C, D Alt alta ferah Z-Kitap kartları)
      let optionsHtml = '';
      if (isMultipleChoice) {
        optionsHtml = `
          <div class="zk-options-list" data-qid="${qNum}">
            ${['A', 'B', 'C', 'D'].map(let => `
              <div class="zk-option-item ${zkUserAnswers[qNum] === let ? 'is-selected' : ''}" data-qid="${qNum}" data-opt="${let}" onclick="window.selectZKitapOption(${qNum}, '${let}')">
                <span class="zk-opt-letter">${let})</span>
                <span class="zk-opt-text">${escapeHtml(q.options[let] || '')}</span>
              </div>
            `).join('')}
          </div>
        `;
      }

      // Kısa Cevap / Açık Uçlu Soru İçi Giriş Alanı
      let inlineAnswerHtml = '';
      if (isShortAnswer) {
        inlineAnswerHtml = `
          <div class="zk-inline-short-box">
            <span class="zk-inline-label">✍️ Cevabınız:</span>
            <input type="text" class="zk-inline-input" id="zk-inline-input-${qNum}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Cevabınızı buraya yazınız..." value="${escapeHtml(zkUserAnswers[qNum] || '')}" oninput="window.recordZKitapAnswer(${qNum}, this.value)">
          </div>
        `;
      } else if (isOpenEnded) {
        inlineAnswerHtml = `
          <div class="zk-inline-open-box">
            <span class="zk-inline-label">✍️ Cevabınız ve Açıklamanız:</span>
            <textarea class="zk-inline-textarea" id="zk-inline-input-${qNum}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" rows="3" placeholder="Bilimsel açıklamanızı buraya yazınız..." oninput="window.recordZKitapAnswer(${qNum}, this.value)">${escapeHtml(zkUserAnswers[qNum] || '')}</textarea>
          </div>
        `;
      }

      // Çözüm Kutusu
      const solutionHtml = `
        <div class="zk-solution-box" id="zk-sol-box-${qNum}" style="display: ${zkShowSolutions ? 'block' : 'none'};">
          <div class="zk-solution-badge">💡 ÇÖZÜM &amp; DOĞRU CEVAP</div>
          <div class="zk-solution-text">
            <strong>Doğru Cevap:</strong> <span class="zk-correct-val">${escapeHtml(correctAns)}</span>
            ${q.explanation ? `<p class="zk-expl-text">${escapeHtml(q.explanation)}</p>` : ''}
          </div>
        </div>
      `;

      // Sağ Panel (%40 Mod 2)
      let rightPanelContent = '';
      if (isMultipleChoice) {
        rightPanelContent = `
          <div class="zk-answer-panel">
            <div class="zk-panel-header">
              <h3>✍️ ÖĞRENCİ CEVABI</h3>
              <span class="zk-panel-hint">Şıkkı Seçiniz</span>
            </div>
            <div class="zk-choice-buttons">
              ${['A', 'B', 'C', 'D'].map(let => `
                <button type="button" class="zk-choice-btn ${zkUserAnswers[qNum] === let ? 'is-active' : ''}" data-qid="${qNum}" data-opt="${let}" onclick="window.selectZKitapOption(${qNum}, '${let}')">
                  <span class="zk-choice-circle">${let}</span>
                  <span class="zk-choice-label">${let} Şıkkı</span>
                </button>
              `).join('')}
            </div>
            <div class="zk-notes-box">
              <label class="zk-notes-label">📝 Öğretmen / Çözüm Notu:</label>
              <textarea class="zk-notes-textarea" id="zk-notes-${qNum}" rows="4" placeholder="Çözüm basamakları ve öğretmen notları..."></textarea>
            </div>
          </div>
        `;
      } else {
        rightPanelContent = `
          <div class="zk-answer-panel">
            <div class="zk-panel-header">
              <h3>✍️ CEVABINIZ</h3>
              <span class="zk-panel-hint">${isShortAnswer ? 'Kısa Cevap' : 'Açık Uçlu'}</span>
            </div>
            <div class="zk-textarea-box">
              <textarea class="zk-open-textarea" id="zk-right-input-${qNum}" rows="5" placeholder="Cevabınızı buraya yazınız..." oninput="window.recordZKitapAnswer(${qNum}, this.value)">${escapeHtml(zkUserAnswers[qNum] || '')}</textarea>
            </div>
            <div class="zk-notes-box" style="margin-top: 14px;">
              <label class="zk-notes-label">📝 Öğretmen Notu / İpuçları:</label>
              <textarea class="zk-notes-textarea" id="zk-notes-${qNum}" rows="3" placeholder="Öğrenciye dönüt ve açıklamalar..."></textarea>
            </div>
          </div>
        `;
      }

      const sec = document.createElement('section');
      sec.className = `zk-slide-section ${idx === zkActiveSlideIdx ? 'is-active' : ''}`;
      sec.id = `yp-zk-slide-${idx}`;
      sec.dataset.slideIndex = String(idx);

      sec.innerHTML = `
        <div class="zk-slide-grid">
          <!-- Sol Sütun (%60 / %100) -->
          <div class="zk-col-left">
            <div class="zk-question-card">
              <div class="zk-question-header">
                <span class="zk-qnum-tag">${qNum}. Soru</span>
              </div>
              
              ${visualHtml}
              
              <div class="zk-question-stem ${sizeClass}">
                ${formattedStem}
              </div>

              ${optionsHtml}
              ${inlineAnswerHtml}
              ${solutionHtml}
            </div>
          </div>

          <!-- Sağ Sütun (%40) -->
          <div class="zk-col-right">
            ${rightPanelContent}
          </div>
        </div>
      `;

      ypSpaceScrollStream.appendChild(sec);

      // Soru Rotaları Çekmecesi Butonu
      if (routesList) {
        const routeBtn = document.createElement('button');
        routeBtn.type = 'button';
        routeBtn.className = `zk-route-item ${idx === zkActiveSlideIdx ? 'active' : ''}`;
        routeBtn.textContent = `${qNum}. Soru`;
        routeBtn.addEventListener('click', () => {
          showZKitapSlide(idx);
          const drawer = document.getElementById('ypSpaceRoutesDrawer');
          if (drawer) drawer.style.display = 'none';
        });
        routesList.appendChild(routeBtn);
      }
    });

    showZKitapSlide(zkActiveSlideIdx);

    ypSpaceViewerModal.style.display = 'flex';
    ypSpaceViewerModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function showZKitapSlide(idx) {
    if (!zkCurrentQuestions || zkCurrentQuestions.length === 0) return;
    zkActiveSlideIdx = Math.max(0, Math.min(idx, zkCurrentQuestions.length - 1));

    // Slaytları güncelle
    const allSections = document.querySelectorAll('.zk-slide-section');
    allSections.forEach((sec, i) => {
      sec.classList.toggle('is-active', i === zkActiveSlideIdx);
      sec.style.display = (i === zkActiveSlideIdx) ? 'block' : 'none';
    });

    // Sayaç güncelle
    const zkModalCounterPill = document.getElementById('zkModalCounterPill');
    if (zkModalCounterPill) {
      zkModalCounterPill.textContent = `${zkActiveSlideIdx + 1} / ${zkCurrentQuestions.length}`;
    }

    // Buton aktiflik durumları
    if (ypSpacePrevBtn) ypSpacePrevBtn.style.opacity = zkActiveSlideIdx === 0 ? '0.5' : '1';
    if (ypSpaceNextBtn) ypSpaceNextBtn.style.opacity = zkActiveSlideIdx === zkCurrentQuestions.length - 1 ? '0.5' : '1';

    // Rota çekmecesi butonları
    const routesList = document.getElementById('ypSpaceRoutesList');
    if (routesList) {
      Array.from(routesList.children).forEach((btn, i) => {
        btn.classList.toggle('active', i === zkActiveSlideIdx);
      });
    }

    // Başa kaydır
    if (ypSpaceScrollStream) ypSpaceScrollStream.scrollTop = 0;
  }

  function initZKitapTimer(totalSeconds) {
    if (zkTimerInterval) clearInterval(zkTimerInterval);
    zkTimerSeconds = totalSeconds;
    zkTimerIsPaused = false;

    function renderTime() {
      const m = Math.floor(zkTimerSeconds / 60);
      const s = zkTimerSeconds % 60;
      const timeStr = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
      const timerEl = document.getElementById('zkModalTimerText');
      if (timerEl) timerEl.textContent = timeStr;
    }

    renderTime();
    zkTimerInterval = setInterval(() => {
      if (!zkTimerIsPaused && zkTimerSeconds > 0) {
        zkTimerSeconds--;
        renderTime();
        if (zkTimerSeconds <= 0) {
          clearInterval(zkTimerInterval);
          alert('⏱️ Sınav süresi tamamlandı!');
        }
      }
    }, 1000);

    const timerBadge = document.getElementById('zkModalTimer');
    if (timerBadge && !timerBadge._hasClickListener) {
      timerBadge._hasClickListener = true;
      timerBadge.addEventListener('click', () => {
        zkTimerIsPaused = !zkTimerIsPaused;
        timerBadge.classList.toggle('is-paused', zkTimerIsPaused);
        const icon = timerBadge.querySelector('.zk-timer-state-icon');
        if (icon) icon.textContent = zkTimerIsPaused ? '⏸️' : '⏱️';
      });
    }
  }

  window.selectZKitapOption = function(qNum, letter) {
    zkUserAnswers[qNum] = letter;
    const slide = document.getElementById(`yp-zk-slide-${qNum - 1}`);
    if (!slide) return;

    // Sol panel şıkları güncelle
    slide.querySelectorAll('.zk-option-item').forEach(el => {
      const isSel = el.getAttribute('data-opt') === letter;
      el.classList.toggle('is-selected', isSel);
    });

    // Sağ panel butonları güncelle
    slide.querySelectorAll('.zk-choice-btn').forEach(btn => {
      const isAct = btn.getAttribute('data-opt') === letter;
      btn.classList.toggle('is-active', isAct);
    });
  };

  window.recordZKitapAnswer = function(qNum, val) {
    zkUserAnswers[qNum] = val;
    // İki inputu senkronize tut
    const inlineInput = document.getElementById(`zk-inline-input-${qNum}`);
    const rightInput = document.getElementById(`zk-right-input-${qNum}`);
    if (inlineInput && inlineInput.value !== val) inlineInput.value = val;
    if (rightInput && rightInput.value !== val) rightInput.value = val;
  };

  window.openZKitapQuestion = function(idx) {
    renderZKitapPreview(currentQuestions, idx);
  };

  // Font Boyutlandırma (A- / A+)
  const zkFontDownBtn = document.getElementById('zkModalFontDownBtn');
  const zkFontUpBtn = document.getElementById('zkModalFontUpBtn');
  if (zkFontDownBtn) {
    zkFontDownBtn.addEventListener('click', () => {
      zkFontScale = Math.max(0.75, +(zkFontScale - 0.1).toFixed(2));
      document.documentElement.style.setProperty('--zk-font-scale', zkFontScale);
    });
  }
  if (zkFontUpBtn) {
    zkFontUpBtn.addEventListener('click', () => {
      zkFontScale = Math.min(1.4, +(zkFontScale + 0.1).toFixed(2));
      document.documentElement.style.setProperty('--zk-font-scale', zkFontScale);
    });
  }

  // Z-Kitap / Çözüm Modu Geçiş Butonu
  const zkModalModeToggleBtn = document.getElementById('zkModalModeToggleBtn');
  if (zkModalModeToggleBtn) {
    zkModalModeToggleBtn.addEventListener('click', () => {
      zkIsSplitMode = !zkIsSplitMode;
      ypSpaceViewerModal.classList.toggle('zk-mode-split', zkIsSplitMode);
      const icon = document.getElementById('zkModalModeIcon');
      const label = document.getElementById('zkModalModeLabel');
      if (icon) icon.textContent = zkIsSplitMode ? '✍️' : '📖';
      if (label) label.textContent = zkIsSplitMode ? 'Çözüm Modu' : 'Z-Kitap Modu';
    });
  }

  // Çözümleri Aç / Kapat Butonu
  const zkModalToggleSolutionsBtn = document.getElementById('zkModalToggleSolutionsBtn');
  if (zkModalToggleSolutionsBtn) {
    zkModalToggleSolutionsBtn.addEventListener('click', () => {
      zkShowSolutions = !zkShowSolutions;
      const lbl = document.getElementById('zkModalSolutionsBtnLabel');
      if (lbl) lbl.textContent = zkShowSolutions ? 'Çözümleri Gizle' : 'Çözümleri Göster';
      document.querySelectorAll('.zk-solution-box').forEach(box => {
        box.style.display = zkShowSolutions ? 'block' : 'none';
      });
    });
  }

  // Testi Bitir & Puanla Butonu
  const zkModalFinishBtn = document.getElementById('zkModalFinishBtn');
  if (zkModalFinishBtn) {
    zkModalFinishBtn.addEventListener('click', () => {
      if (!zkCurrentQuestions || zkCurrentQuestions.length === 0) return;
      let correct = 0;
      let answered = 0;
      zkCurrentQuestions.forEach((q, i) => {
        const userAns = String(zkUserAnswers[i + 1] || '').trim().toUpperCase();
        const corrAns = String(q.correct_answer || '').trim().toUpperCase();
        if (userAns) {
          answered++;
          if (userAns === corrAns || corrAns.includes(userAns) || userAns.includes(corrAns)) {
            correct++;
          }
        }
      });
      const total = zkCurrentQuestions.length;
      const score = Math.round((correct / total) * 100);
      alert(`🏁 TEST DEĞERLENDİRME RAPORU\n\nToplam Soru: ${total}\nCevaplanan: ${answered}\nDoğru Sayısı: ${correct}\nYanlış / Boş: ${total - correct}\n\nBAŞARI PUANI: ${score} / 100\n\nÇözümler ve doğru cevaplar şimdi ekranda açılıyor.`);
      
      // Çözümleri otomatik aç
      zkShowSolutions = true;
      const lbl = document.getElementById('zkModalSolutionsBtnLabel');
      if (lbl) lbl.textContent = 'Çözümleri Gizle';
      document.querySelectorAll('.zk-solution-box').forEach(box => {
        box.style.display = 'block';
      });
    });
  }

  // Klavye Yön Tuşları ile Geçiş
  window.addEventListener('keydown', (e) => {
    if (!ypSpaceViewerModal || ypSpaceViewerModal.style.display === 'none') return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      showZKitapSlide(zkActiveSlideIdx + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      showZKitapSlide(zkActiveSlideIdx - 1);
    } else if (e.key === 'Escape') {
      if (closeYpSpaceViewerBtn) closeYpSpaceViewerBtn.click();
    }
  });

  // Dokunmatik Tahtalar İçin Kaydırma (Swipe)
  let touchStartX = 0;
  if (ypSpaceScrollStream) {
    ypSpaceScrollStream.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) touchStartX = e.touches[0].clientX;
    }, { passive: true });
    ypSpaceScrollStream.addEventListener('touchend', (e) => {
      if (e.changedTouches && e.changedTouches[0]) {
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        if (deltaX < -50) showZKitapSlide(zkActiveSlideIdx + 1);
        else if (deltaX > 50) showZKitapSlide(zkActiveSlideIdx - 1);
      }
    }, { passive: true });
  }

  // A4 vs Z-Kitap Mod Sekmeleri
  const viewModeA4Btn = document.getElementById('viewModeA4Btn');
  const viewModeZKitapBtn = document.getElementById('viewModeZKitapBtn');
  if (viewModeZKitapBtn) {
    viewModeZKitapBtn.addEventListener('click', () => {
      renderZKitapPreview(currentQuestions, 0);
    });
  }
  if (viewModeA4Btn) {
    viewModeA4Btn.addEventListener('click', () => {
      if (ypSpaceViewerModal) ypSpaceViewerModal.style.display = 'none';
      const container = document.getElementById('questionsContainer');
      if (container) container.scrollIntoView({ behavior: 'smooth' });
    });
  }

  function render3DSpaceViewer(slides, docTitle) {
    renderZKitapPreview(slides, 0, docTitle);
  }

  function updateSpaceSlideCounter(idx) {
    showZKitapSlide(idx);
  }

  function scrollToSpaceSlide(targetIdx) {
    showZKitapSlide(targetIdx);
  }

  function open3DSpaceViewerForSourceFile(fileObj) {
    const slides = convertSourceFileToSlides(fileObj);
    renderZKitapPreview(slides, 0, `📖 ${fileObj.name} — Z-Kitap Önizleme`);
  }

  [open3DSpaceViewBtn, headerSpaceViewerBtn, emptyStateSpaceViewerBtn].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        renderZKitapPreview(currentQuestions, 0, currentSmartTitle);
      });
    }
  });

  if (closeYpSpaceViewerBtn) {
    closeYpSpaceViewerBtn.addEventListener('click', () => {
      if (ypSpaceViewerModal) {
        ypSpaceViewerModal.style.display = 'none';
        ypSpaceViewerModal.setAttribute('aria-hidden', 'true');
      }
      document.body.style.overflow = '';
      if (zkTimerInterval) clearInterval(zkTimerInterval);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    });
  }

  if (ypSpacePrevBtn) {
    ypSpacePrevBtn.addEventListener('click', () => {
      showZKitapSlide(zkActiveSlideIdx - 1);
    });
  }

  if (ypSpaceNextBtn) {
    ypSpaceNextBtn.addEventListener('click', () => {
      showZKitapSlide(zkActiveSlideIdx + 1);
    });
  }

  if (ypSpaceRoutesBtn && ypSpaceRoutesDrawer) {
    ypSpaceRoutesBtn.addEventListener('click', () => {
      const isHidden = ypSpaceRoutesDrawer.style.display === 'none';
      ypSpaceRoutesDrawer.style.display = isHidden ? 'flex' : 'none';
    });
  }

  if (closeYpSpaceRoutesBtn && ypSpaceRoutesDrawer) {
    closeYpSpaceRoutesBtn.addEventListener('click', () => {
      ypSpaceRoutesDrawer.style.display = 'none';
    });
  }

  if (ypSpaceFullscreenBtn) {
    ypSpaceFullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        ypSpaceViewerModal?.requestFullscreen?.().catch(() => {});
      } else {
        document.exitFullscreen?.().catch(() => {});
      }
    });
  }

  if (ypSpaceSoundBtn) {
    ypSpaceSoundBtn.addEventListener('click', () => {
      if (!('speechSynthesis' in window)) {
        alert('Tarayıcınız sesli okuma özelliğini desteklemiyor.');
        return;
      }
      if (ypSpeechActive) {
        window.speechSynthesis.cancel();
        ypSpeechActive = false;
        ypSpaceSoundBtn.textContent = '🔊';
        return;
      }
      const q = zkCurrentQuestions[zkActiveSlideIdx];
      if (!q) return;
      const utterance = new SpeechSynthesisUtterance(`${zkActiveSlideIdx + 1}. Soru. ${q.question}`);
      utterance.lang = 'tr-TR';
      utterance.onend = () => {
        ypSpeechActive = false;
        ypSpaceSoundBtn.textContent = '🔊';
      };
      ypSpeechActive = true;
      ypSpaceSoundBtn.textContent = '🔇';
      window.speechSynthesis.speak(utterance);
    });
  }

  if (ypSpacePrintBtn) {
    ypSpacePrintBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (ypSpaceSaveBtn) {
    ypSpaceSaveBtn.addEventListener('click', () => {
      if (currentQuestions && currentQuestions.length > 0 && downloadPdfBtn) {
        downloadPdfBtn.click();
      } else {
        window.print();
      }
    });
  }

  if (ypSpaceDirectFileInput) {
    ypSpaceDirectFileInput.addEventListener('change', async (e) => {
      if (e.target.files && e.target.files.length > 0) {
        await handleIncomingSourceFiles(e.target.files);
        const latest = uploadedSourceFiles[uploadedSourceFiles.length - 1];
        if (latest) {
          open3DSpaceViewerForSourceFile(latest);
        }
        ypSpaceDirectFileInput.value = '';
      }
    });
  }

  // ==========================================================================
  // 🚀 WEB SİTESİNE OTOMATİK YAYINLAMA MODALI VE ENTEGRASYONU
  // ==========================================================================
  const publishToWebBtn = document.getElementById('publishToWebBtn');
  const publishModal = document.getElementById('publishModal');
  const closePublishModalBtn = document.getElementById('closePublishModalBtn');
  const cancelPublishBtn = document.getElementById('cancelPublishBtn');
  const confirmPublishBtn = document.getElementById('confirmPublishBtn');

  const publishFormStep = document.getElementById('publishFormStep');
  const publishLoadingStep = document.getElementById('publishLoadingStep');
  const publishSuccessStep = document.getElementById('publishSuccessStep');
  const publishModalFooter = document.getElementById('publishModalFooter');

  const pubTitle = document.getElementById('pubTitle');
  const pubGrade = document.getElementById('pubGrade');
  const pubCategory = document.getElementById('pubCategory');
  const pubUnit = document.getElementById('pubUnit');
  const pubSection = document.getElementById('pubSection');
  const pubDesc = document.getElementById('pubDesc');
  const pubAutoDeploy = document.getElementById('pubAutoDeploy');
  const publishSuccessText = document.getElementById('publishSuccessText');
  const viewInWebsiteBtn = document.getElementById('viewInWebsiteBtn');
  const viewDirectTestBtn = document.getElementById('viewDirectTestBtn');

  function openPublishModal() {
    if (!currentQuestions || currentQuestions.length === 0) {
      alert("Lütfen önce soru üretiniz.");
      return;
    }

    const curGrade = currentMeta.grade || gradeInput.value || "5";
    const curUnitObj = (curriculumData && curriculumData.units && curriculumData.units[selectedUnitIndex]) ? curriculumData.units[selectedUnitIndex] : null;
    const curUnitName = currentMeta.learning_area || (curUnitObj ? curUnitObj.name : "1. Ünite: Güneş, Dünya ve Ay");
    const curSectionNum = (selectedUnitIndex + 1) || 1;

    pubGrade.value = curGrade;
    const selectedQType = questionTypeInput ? questionTypeInput.value : 'multiple_choice';
    const isOpenEnded = selectedQType === 'open_ended' || (currentQuestions && currentQuestions.every(q => q.type === 'open_ended' || (!q.options || !q.options.A)));
    pubCategory.value = isOpenEnded ? "denemeler" : "soru-bankasi";
    pubUnit.value = curUnitName;
    pubSection.value = curSectionNum;

    pubTitle.value = currentSmartTitle || `${curGrade}. Sınıf ${curUnitName} Yaprak Testi`;
    pubDesc.value = `${curGrade}. Sınıf Fen Bilimleri ${curUnitName} için MEB Maarif Modeli uyumlu şekilli yaprak test. Cevap anahtarlı ve çözümlü.`;

    publishFormStep.style.display = 'block';
    publishLoadingStep.style.display = 'none';
    publishSuccessStep.style.display = 'none';
    publishModalFooter.style.display = 'flex';
    confirmPublishBtn.disabled = false;
    confirmPublishBtn.innerHTML = '<span>🚀</span> Web Siteme Ekle ve Yayınla';

    publishModal.style.display = 'flex';
  }

  function closePublishModal() {
    publishModal.style.display = 'none';
  }

  if (publishToWebBtn) {
    publishToWebBtn.addEventListener('click', openPublishModal);
  }
  if (closePublishModalBtn) {
    closePublishModalBtn.addEventListener('click', closePublishModal);
  }
  if (cancelPublishBtn) {
    cancelPublishBtn.addEventListener('click', closePublishModal);
  }
  if (publishModal) {
    publishModal.addEventListener('click', (e) => {
      if (e.target === publishModal) closePublishModal();
    });
  }

  if (confirmPublishBtn) {
    confirmPublishBtn.addEventListener('click', async () => {
      const payload = {
        questions: currentQuestions,
        grade: pubGrade.value,
        unit: pubUnit.value,
        targetSection: pubSection.value,
        category: pubCategory.value,
        title: pubTitle.value.trim() || currentSmartTitle || `${pubGrade.value}. Sınıf Yaprak Testi`,
        desc: pubDesc.value.trim(),
        subject: currentMeta.subject || "Fen Bilimleri",
        autoDeploy: pubAutoDeploy ? pubAutoDeploy.checked : false
      };

      try {
        publishFormStep.style.display = 'none';
        publishLoadingStep.style.display = 'block';
        publishModalFooter.style.display = 'none';

        const res = await fetch('/api/publish-test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const errMsg = errData.details ? `${errData.error} (${errData.details})` : (errData.error || 'Yayınlama başarısız oldu.');
          throw new Error(errMsg);
        }

        const data = await res.json();

        publishLoadingStep.style.display = 'none';
        publishSuccessStep.style.display = 'block';

        if (data.material) {
          try {
            const localMats = JSON.parse(localStorage.getItem('rotali_custom_materials') || '[]');
            const existingIdx = localMats.findIndex(m => m.id === data.material.id);
            if (existingIdx > -1) {
              localMats[existingIdx] = data.material;
            } else {
              localMats.unshift(data.material);
            }
            localStorage.setItem('rotali_custom_materials', JSON.stringify(localMats));
            // Z-Kitap dosyaları doğrudan sunucudan/dosyadan yüklenir, localStorage önbelleklenmez.
          } catch (e) {}
        }

        publishSuccessText.innerHTML = `<strong>"${escapeHtml(data.title)}"</strong> başarıyla Rotalı Fenci web sitenize eklendi.<br><br>
          <span style="display:inline-block; padding: 4px 10px; background:#e0f2fe; color:#0369a1; border-radius:8px; font-weight:700; font-size:12.5px;">
            📍 Konum: ${data.grade}. Sınıf &gt; Test / Deneme &amp; Yazılıya Hazırlık &gt; ${escapeHtml(data.unit)}
          </span>`;

        const targetTab = data.category === 'denemeler' ? 'denemeler' : 'soru-bankasi';
        viewInWebsiteBtn.href = `index.html#grade-${data.grade || '5'}/${targetTab}`;
        
        let directUrl = '/api/test-viewer?file=' + encodeURIComponent(data.material ? data.material.fileName : data.fileUrl.split('/').pop());
        if (data.htmlContent) {
          try {
            const blob = new Blob([data.htmlContent], { type: 'text/html;charset=utf-8' });
            directUrl = URL.createObjectURL(blob);
          } catch (e) {}
        }
        viewDirectTestBtn.href = directUrl;

      } catch (err) {
        console.error('Yayınlama hatası:', err);
        alert(`Hata: ${err.message}`);
        publishFormStep.style.display = 'block';
        publishLoadingStep.style.display = 'none';
        publishModalFooter.style.display = 'flex';
      }
    });
  }

  const apiKeyBtn = document.getElementById('apiKeySettingsBtn');
  if (apiKeyBtn) {
    apiKeyBtn.addEventListener('click', () => {
      const current = localStorage.getItem('gemini_api_key') || '';
      const entered = prompt('Kendi Google Gemini API Anahtarınızı girebilirsiniz (Boş bırakırsanız sistemin hazır anahtarı kullanılır):', current);
      if (entered !== null) {
        if (entered.trim()) {
          localStorage.setItem('gemini_api_key', entered.trim());
          alert('✅ Özel Gemini API anahtarınız kaydedildi.');
        } else {
          localStorage.removeItem('gemini_api_key');
          alert('ℹ️ Özel anahtar kaldırıldı, sistemin varsayılan anahtarı kullanılacak.');
        }
      }
    });
  }

  loadCurriculum();

  // ========================================================
  // 📁 ÇOKLU DOSYA SEKME VE GEÇİŞ MOTORU
  // ========================================================
  function renderBatchTabs(types) {
    if (!batchFileTabsBar || !batchTabsList) return;
    batchTabsList.innerHTML = '';

    types.forEach((item, idx) => {
      const b = generatedBatches[item.type];
      if (!b) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `batch-tab-btn ${idx === 0 ? 'is-active' : ''}`;
      btn.dataset.type = item.type;
      const unit = item.type === 'activity' ? 'Etkinlik' : 'Soru';
      btn.innerHTML = `<span class="tab-icon">${item.icon}</span> <strong class="tab-label">${item.label}</strong> <span class="tab-count-badge" style="background:#e0f2fe; color:#0369a1; padding:2px 8px; border-radius:6px; font-size:11px; margin-left:4px; font-weight:800;">${b.questions.length} ${unit}</span>`;
      btn.addEventListener('click', () => {
        switchBatch(item.type);
      });
      batchTabsList.appendChild(btn);
    });

    // Bütünleşik (Tümü) sekmesi
    if (types.length > 1) {
      let totalAll = 0;
      types.forEach(t => {
        if (generatedBatches[t.type]) totalAll += generatedBatches[t.type].questions.length;
      });
      const allBtn = document.createElement('button');
      allBtn.type = 'button';
      allBtn.className = 'batch-tab-btn';
      allBtn.dataset.type = 'all';
      allBtn.innerHTML = `<span class="tab-icon">📚</span> <strong class="tab-label">Tümü (Bütünleşik)</strong> <span class="tab-count-badge" style="background:#f1f5f9; color:#334155; padding:2px 8px; border-radius:6px; font-size:11px; margin-left:4px; font-weight:800;">${totalAll} Soru</span>`;
      allBtn.addEventListener('click', () => {
        switchBatch('all');
      });
      batchTabsList.appendChild(allBtn);
    }

    batchFileTabsBar.style.display = 'flex';
  }

  function switchBatch(typeKey) {
    activeBatchKey = typeKey;

    if (batchTabsList) {
      batchTabsList.querySelectorAll('.batch-tab-btn').forEach(btn => {
        const isActive = btn.dataset.type === typeKey;
        btn.classList.toggle('is-active', isActive);
      });
    }

    if (typeKey === 'all') {
      let merged = [];
      Object.keys(generatedBatches).forEach(k => {
        merged = merged.concat(generatedBatches[k].questions);
      });
      currentQuestions = merged;
      currentSmartTitle = `Bütünleşik Fen Bilimleri Sınavı (${merged.length} Soru / İçerik)`;
      const metaTitle = document.getElementById('testMetaTitle');
      if (metaTitle) metaTitle.textContent = currentSmartTitle;
      const countBadge = document.getElementById('questionCountBadge');
      if (countBadge) countBadge.textContent = `${merged.length} Soru`;
    } else {
      const b = generatedBatches[typeKey];
      if (!b) return;
      currentQuestions = b.questions;
      currentMeta = b.meta;
      currentSmartTitle = b.smartTitle;
      const metaTitle = document.getElementById('testMetaTitle');
      if (metaTitle) metaTitle.textContent = b.smartTitle;
      const countBadge = document.getElementById('questionCountBadge');
      if (countBadge) countBadge.textContent = `${b.questions.length} ${b.type === 'activity' ? 'Etkinlik' : 'Soru'}`;
    }

    editingQuestionIndex = -1;
    renderQuestions();
  }

  // Toplu Olarak Tüm Dosyaları Web Sitesine Aktar
  if (batchPublishAllBtn) {
    batchPublishAllBtn.addEventListener('click', async () => {
      const batchKeys = Object.keys(generatedBatches);
      if (batchKeys.length === 0) {
        alert('Yayınlanacak soru grubu bulunamadı.');
        return;
      }

      if (!confirm(`Üretilen ${batchKeys.length} farklı soru grubunun her biri ayrı bir yaprak test dosyası olarak web sitenize otomatik aktarılacaktır.\n\nDevam etmek istiyor musunuz?`)) {
        return;
      }

      batchPublishAllBtn.disabled = true;
      batchPublishAllBtn.innerHTML = '<span>⏳</span> <span>Yayınlanıyor...</span>';

      const curGrade = currentMeta.grade || gradeInput.value || '5';
      const curUnitObj = (curriculumData && curriculumData.units && curriculumData.units[selectedUnitIndex]) ? curriculumData.units[selectedUnitIndex] : null;
      const curUnitName = currentMeta.learning_area || (curUnitObj ? curUnitObj.name : 'Genel');
      const curSectionNum = (selectedUnitIndex + 1) || 1;

      let successCount = 0;
      for (const k of batchKeys) {
        const b = generatedBatches[k];
        const payload = {
          questions: b.questions,
          grade: curGrade,
          unit: curUnitName,
          targetSection: curSectionNum,
          category: b.type === 'open_ended' ? 'denemeler' : 'soru-bankasi',
          title: b.smartTitle,
          desc: `${curGrade}. Sınıf ${curUnitName} - ${b.label} Yaprak Testi (${b.questions.length} Soru).`,
          subject: currentMeta.subject || 'Fen Bilimleri',
          autoDeploy: true
        };

        try {
          const res = await fetch('/api/publish-test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) successCount++;
        } catch (e) {
          console.error('Yayınlama hatası:', e);
        }
      }

      batchPublishAllBtn.disabled = false;
      batchPublishAllBtn.innerHTML = '<span>🚀</span> <span>Tüm Dosyaları Web Siteme Aktar</span>';

      if (successCount > 0) {
        alert(`🎉 TEBRİKLER!\n\nToplam ${successCount} adet test dosyası başarıyla oluşturuldu, web sitesine eklendi ve GitHub ile senkronize edildi!`);
        if (typeof loadYaprakMaterials === 'function') loadYaprakMaterials();
      } else {
        alert('Yayınlama sırasında bir hata oluştu.');
      }
    });
  }

});
