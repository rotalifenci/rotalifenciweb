document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const unitPills = document.getElementById('unitPills');
  const outcomesChecklist = document.getElementById('outcomesChecklist');
  const selectAllOutcomesBtn = document.getElementById('selectAllOutcomesBtn');
  const customOutcome = document.getElementById('customOutcome');
  const questionForm = document.getElementById('questionForm');
  const generateBtn = document.getElementById('generateBtn');
  const gradeInput = document.getElementById('gradeInput');
  const subjectInput = document.getElementById('subjectInput');
  const countInput = document.getElementById('countInput');
  const difficultyInput = document.getElementById('difficultyInput');

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

  // App State
  let curriculumData = null;
  let selectedUnitIndex = 0;
  let currentQuestions = [];
  let currentMeta = {};
  let showAnswers = false;
  let showSolutions = false;
  let editingQuestionIndex = -1;

  // 1. Müfredat Verisini Sunucudan Çek (Sınıf parametresiyle)
  async function loadCurriculum(grade = "5") {
    try {
      const res = await fetch(`/api/curriculum?grade=${grade}`);
      if (!res.ok) throw new Error('Müfredat verisi sunucudan alınamadı');
      curriculumData = await res.json();
      selectedUnitIndex = 0;
      renderUnits(curriculumData.units);
    } catch (err) {
      console.error('Müfredat hatası:', err);
      outcomesChecklist.innerHTML = '<div class="empty-hint" style="color:red;">Müfredat yüklenemedi. Özel kazanım alanını kullanarak soru üretebilirsiniz.</div>';
    }
  }

  // Sınıf Değiştiğinde Müfredatı Yeniden Yükle
  gradeInput.addEventListener('change', (e) => {
    const newGrade = e.target.value;
    loadCurriculum(newGrade);
  });

  // 1.b Gök Cisimleri Gerçekçi Varlıklarını (Güneş, Dünya, Ay) Önyükle
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
    // Strip LaTeX math delimiters ($...$ veya $$...$$)
    text = text.replace(/\$\$([\s\S]*?)\$\$/g, '$1');
    text = text.replace(/\$([^$]+)\$/g, '$1');
    // Strip common LaTeX commands
    text = text.replace(/\\(text|mathbf|mathrm|mathit)\{([^}]+)\}/g, '$2');
    // Replace escaped math relational symbols
    text = text.replace(/\\>/g, '>');
    text = text.replace(/\\</g, '<');
    text = text.replace(/\\ge(q)?/g, '≥');
    text = text.replace(/\\le(q)?/g, '≤');
    // Fix corrupt Turkish characters & spellings
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
    // Fix comparison spacing (örn: "Ay>Dünya>Güneş" -> "Ay > Dünya > Güneş")
    text = text.replace(/([A-Za-zÇĞİÖŞÜçğıöşü]+)\s*>\s*([A-Za-zÇĞİÖŞÜçğıöşü]+)/g, '$1 > $2');
    text = text.replace(/([A-Za-zÇĞİÖŞÜçğıöşü]+)\s*<\s*([A-Za-zÇĞİÖŞÜçğıöşü]+)/g, '$1 < $2');
    return text.trim();
  }

  function prepareSvgForDisplay(svgStr) {
    if (!svgStr) return '';
    let out = svgStr;
    if (!out.includes('xmlns:xlink')) {
      out = out.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    // Font ailesini Times New Roman standardına geçir
    out = out.replace(/font-family=["'][^"']*["']/gi, 'font-family="\'Times New Roman\', Times, serif"');

    // Siyah/koyu zemin rect'lerini beyaz/şeffaf ve ince gri bordürlü standarda dönüştür
    out = out.replace(/fill=["']#(070a12|090d16|0b0f19|000000|0f172a|030712|1e1b4b|1e293b|000)["']/gi, 'fill="#ffffff" stroke="#e2e8f0" stroke-width="1"');
    out = out.replace(/fill=["']black["']/gi, 'fill="#ffffff" stroke="#e2e8f0" stroke-width="1"');
    out = out.replace(/fill=["']rgba?\(\s*0\s*,\s*0\s*,\s*0[^)]*\)["']/gi, 'fill="#ffffff" stroke="#e2e8f0" stroke-width="1"');

    // Yıldız noktacıklarını temizle (mürekkep tasarrufu ve temiz beyaz sayfa)
    out = out.replace(/<circle[^>]*opacity=["']0\.[0-9]+["'][^>]*fill=["']#(fff|ffffff)["'][^>]*\/?>/gi, '');
    out = out.replace(/<circle[^>]*fill=["']#(fff|ffffff)["'][^>]*opacity=["']0\.[0-9]+["'][^>]*\/?>/gi, '');

    // Koyu zemindeki açık/beyaz metinleri beyaz zemin için yüksek kontrastlı koyu renklere dönüştür
    out = out.replace(/fill=["']#fbbf24["']/gi, 'fill="#b45309"'); // Güneş açık sarı -> koyu kehribar
    out = out.replace(/fill=["']#38bdf8["']/gi, 'fill="#0369a1"'); // Dünya açık mavi -> koyu okyanus mavisi
    out = out.replace(/fill=["']#e2e8f0["']/gi, 'fill="#334155"'); // Ay açık gri -> koyu arduvaz gri
    out = out.replace(/fill=["']#(f8fafc|ffffff|fff)["'](?=[^>]*font-)/gi, 'fill="#0f172a"'); // Beyaz yazılar -> koyu lacivert

    // SVG içindeki bozuk kelimeleri düzelt
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

  // 2. Ünite Butonlarını (Pills) Oluştur
  function renderUnits(units) {
    unitPills.innerHTML = '';
    units.forEach((unit, idx) => {
      const btn = document.createElement('div');
      btn.className = `unit-pill ${idx === 0 ? 'active' : ''}`;
      btn.innerHTML = `<span>${unit.icon || '📌'}</span> <span>${unit.name}</span>`;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.unit-pill').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        selectedUnitIndex = idx;
        renderOutcomes(unit.outcomes);
      });
      unitPills.appendChild(btn);
    });

    if (units.length > 0) {
      renderOutcomes(units[0].outcomes);
    }
  }

  // 3. Kazanım Onay Kutularını (Checklist) Oluştur
  function renderOutcomes(outcomes) {
    outcomesChecklist.innerHTML = '';
    outcomes.forEach((outcome, idx) => {
      const outcomeText = typeof outcome === 'object' ? outcome.text : outcome;
      const outcomeId = typeof outcome === 'object' ? outcome.id : `${idx + 1}`;

      const item = document.createElement('label');
      item.className = 'outcome-check-item';
      item.innerHTML = `
        <input type="checkbox" name="selectedOutcome" value="${escapeHtml(outcomeText)}" ${idx === 0 ? 'checked' : ''}>
        <span class="outcome-label"><strong>${outcomeId}.</strong> ${escapeHtml(outcomeText)}</span>
      `;
      outcomesChecklist.appendChild(item);
    });

    updateSelectAllButtonText();
  }

  // Tümünü Seç / Temizle Butonu
  selectAllOutcomesBtn.addEventListener('click', () => {
    const checkboxes = outcomesChecklist.querySelectorAll('input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);

    checkboxes.forEach(cb => {
      cb.checked = !allChecked;
    });

    updateSelectAllButtonText();
  });

  function updateSelectAllButtonText() {
    const checkboxes = outcomesChecklist.querySelectorAll('input[type="checkbox"]');
    const allChecked = checkboxes.length > 0 && Array.from(checkboxes).every(cb => cb.checked);
    selectAllOutcomesBtn.textContent = allChecked ? 'Seçimi Temizle' : 'Tümünü Seç';
  }

  outcomesChecklist.addEventListener('change', () => {
    updateSelectAllButtonText();
  });

  // 4. Soru Üretim Formu Gönderimi
  questionForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const checkedBoxes = outcomesChecklist.querySelectorAll('input[type="checkbox"]:checked');
    const selectedOutcomes = Array.from(checkedBoxes).map(cb => cb.value);
    const customText = customOutcome.value.trim();

    if (customText) {
      selectedOutcomes.push(customText);
    }

    if (selectedOutcomes.length === 0) {
      alert('Lütfen listeden en az bir öğrenme çıktısı (kazanım) seçiniz veya özel kazanım metni giriniz.');
      return;
    }

    const grade = gradeInput.value;
    const subject = subjectInput.value.trim();
    const count = parseInt(countInput.value, 10);
    const difficulty = difficultyInput.value;
    const question_type = document.getElementById('questionTypeInput')?.value || "multiple_choice";
    const unitName = curriculumData && curriculumData.units[selectedUnitIndex] ? curriculumData.units[selectedUnitIndex].name : "Genel";

    setLoading(true);

    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade,
          subject,
          learning_area: unitName,
          selected_outcomes: selectedOutcomes,
          question_count: count,
          difficulty,
          question_type
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || data.details || 'Sorular oluşturulamadı.');
      }

      currentQuestions = (data.questions || []).map(q => {
        const cleanedQ = { ...q };
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
        return cleanedQ;
      });
      currentMeta = data.meta;
      editingQuestionIndex = -1;
      renderQuestions();

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

    // Sayfa başına maksimum soru sayısı (3 sol + 3 sağ = 6 → A4 yüksekliğini aşmaz)
    const MAX_PER_PAGE = 6;

    let targetPages = 2; // Varsayılan: 2 Sayfa (1 Yaprak Önlü-Arkalı)

    if (mode === 1 || mode === '1') {
      targetPages = 1;
    } else if (mode === 2 || mode === '2') {
      targetPages = 2;
    } else if (mode === 4 || mode === '4') {
      targetPages = 4;
    } else if (mode === 6 || mode === '6') {
      targetPages = 6;
    } else {
      // OTOMATİK MOD: Soru sayısına göre sayfa belirle
      if (total <= 4) {
        targetPages = 1; // 1-4 soru için 1 sayfa
      } else if (total <= 10) {
        targetPages = 2; // 5-10 soru için kesinlikle 2 sayfa (önlü-arkalı)
      } else {
        targetPages = 4; // 11-20+ soru için kesinlikle 4 sayfa (tam deneme kitapçığı)
      }
    }

    // Sayfa sayısını soru kapasitesine göre yukarı yuvarlayarak taşmayı önle
    const minPagesForCapacity = Math.ceil(total / MAX_PER_PAGE);
    targetPages = Math.max(targetPages, minPagesForCapacity);
    targetPages = Math.min(targetPages, total);

    // Soruları sayfalara homojen ve dengeli dağıt
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

  // 5. Üretilen Soruları Ekrana Çizme (Profesyonel Sınav Kitapçığı)
  function renderQuestions() {
    const { grade = "5", subject = "Fen Bilimleri", learning_area = "", selected_outcomes = [] } = currentMeta;
    const total_questions = currentQuestions.length;

    const dynamicExamTitle = `${grade}. SINIF ${subject.toUpperCase()} DENEME SINAVI`;

    if (testMetaTitle) testMetaTitle.textContent = `${grade}. Sınıf ${subject} - ${learning_area}`;
    if (questionCountBadge) questionCountBadge.textContent = `${total_questions} Soru`;
    if (printTitle) printTitle.textContent = dynamicExamTitle;
    if (printOutcomeText) printOutcomeText.textContent = selected_outcomes.join(' | ');

    // Sınıf seviyesine göre gövde teması uygula (5, 6, 7 veya 8)
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

      // Başlık Alanı (İlk Sayfa: Tam Öğrenci Tablosu, Sonraki Sayfalar: Kompakt Başlık)
      let headerHtml = '';
      if (isFirstPage) {
        headerHtml = `
          <div class="booklet-exam-header">
            <div class="exam-header-top">
              <img src="rotali-fenci.jpg" class="exam-logo-left" alt="Logo">
              <div class="exam-title-center">
                <div class="exam-ministry">T.C. MİLLÎ EĞİTİM BAKANLIĞI</div>
                <h1 class="exam-main-title">${dynamicExamTitle}</h1>
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
            <span class="mini-header-title">${dynamicExamTitle}</span>
            <span class="mini-header-tag">Rotalı Fenci</span>
          </div>
        `;
      }

      // Sayfa Üst Bilgi Rozeti (Sadece Web Arayüzü İçin)
      const webBadgeHtml = `
        <div class="page-top-badge no-print">
          <span>📄 Sayfa ${pageNumber} / ${totalPagesCount}</span>
          <span>${pageQuestions.length} Soru (Bu Sayfada)</span>
        </div>
      `;

      // 2 Sütunlu Kararlı Mizanpaj (Sol ve Sağ Sütunlar)
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

        const diffClass = q.difficulty === 'Kolay' ? 'tag-diff-Kolay' : (q.difficulty === 'Zor' ? 'tag-diff-Zor' : 'tag-diff-Orta');

        let typeLabel = "Çoktan Seçmeli";
        if (q.type === "short_answer") typeLabel = "Kısa Cevaplı";
        else if (q.type === "open_ended") typeLabel = "Açık Uçlu";
        else if (q.type === "structured_grid") typeLabel = "Yapılandırılmış Grid";
        else if (q.type === "concept_map") typeLabel = "Kavram Haritası";
        else if (q.type === "v_diagram") typeLabel = "V Diyagramı";

        if (editingQuestionIndex === (qNum - 1)) {
          // DÜZENLEME MODU
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
          // NORMAL KART GÖRÜNÜMÜ
          const visualBoxHtml = q.visual_svg && q.visual_svg.trim() 
            ? `<div class="question-visual-box">${prepareSvgForDisplay(q.visual_svg)}</div>` 
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

          // Seçenek Yerleşimi (Dinamik 1 Satır / 2x2 / Alt Alta)
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
                <button type="button" class="btn-action-icon" title="Düzenle" onclick="startEditQuestion(${qNum - 1})">✏️</button>
                <button type="button" class="btn-action-icon" title="Yeniden Üret" onclick="regenerateQuestion(${qNum - 1})">🔄</button>
                <button type="button" class="btn-action-icon btn-action-delete" title="Sil" onclick="deleteQuestion(${qNum - 1})">🗑️</button>
              </div>
            </div>
            ${visualBoxHtml}
            ${gridHtml}
            <div class="question-text-and-options">
              <div class="question-body">${escapeHtml(q.question)}</div>
              ${contentBodyHtml}
            </div>
            <div class="solution-box" style="display: ${showSolutions ? 'block' : 'none'};">
              <strong>💡 Doğru Cevap: ${escapeHtml(q.correct_answer)}</strong>
              <div>${escapeHtml(q.explanation || 'Açıklama mevcut değil.')}</div>
            </div>
          `;
        }

        // Cevap Anahtarı Grid'ine Ekle
        const akItem = document.createElement('div');
        akItem.className = 'answer-key-item';
        akItem.innerHTML = `<span class="q-no">${qNum}.</span> <span class="q-ans">${escapeHtml(q.correct_answer || '-')}</span>`;
        answerKeyGrid.appendChild(akItem);

        return card;
      }

      // Sol sütuna soruları ekle
      leftPageQuestions.forEach(q => {
        const qNum = questionGlobalCounter++;
        leftColContainer.appendChild(buildCard(q, qNum));
      });

      // Sağ sütuna soruları ekle
      rightPageQuestions.forEach(q => {
        const qNum = questionGlobalCounter++;
        rightColContainer.appendChild(buildCard(q, qNum));
      });

      // Son Sayfanın Altına Mini Cevap Anahtarı Tablosu
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

    // En alta "Yeni Soru Ekle" Butonu
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

  window.cancelEditQuestion = () => {
    editingQuestionIndex = -1;
    renderQuestions();
  };

  window.saveEditQuestion = (idx) => {
    const card = document.getElementById(`q-card-${idx + 1}`);
    if (!card) return;

    const visualSvg = card.querySelector('.edit-visual-svg')?.value.trim() || '';
    const questionText = card.querySelector('.edit-q-text').value.trim();
    const optA = card.querySelector('.edit-opt-A').value.trim();
    const optB = card.querySelector('.edit-opt-B').value.trim();
    const optC = card.querySelector('.edit-opt-C').value.trim();
    const optD = card.querySelector('.edit-opt-D').value.trim();
    const correctAnswer = card.querySelector('.edit-correct-select').value;
    const difficulty = card.querySelector('.edit-diff-select').value;
    const explanation = card.querySelector('.edit-explanation').value.trim();

    if (!questionText || !optA || !optB || !optC || !optD) {
      alert('Lütfen soru metnini ve tüm şıkları doldurunuz.');
      return;
    }

    currentQuestions[idx] = {
      ...currentQuestions[idx],
      visual_svg: visualSvg,
      question: questionText,
      options: { A: optA, B: optB, C: optC, D: optD },
      correct_answer: correctAnswer,
      difficulty: difficulty,
      explanation: explanation
    };

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

  // 6. Bilgisayara Kaydetme: Word (.docx) İndir (Güncel Düzenlenmiş Sorularla)
  downloadDocxBtn.addEventListener('click', async () => {
    if (currentQuestions.length === 0) return;

    try {
      downloadDocxBtn.disabled = true;
      downloadDocxBtn.innerHTML = '<span class="icon">⏳</span> İndiriliyor...';

      const res = await fetch('/api/export-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: currentMeta.grade || "5",
          subject: currentMeta.subject || "Fen Bilimleri",
          learning_area: currentMeta.learning_area || "",
          questions: currentQuestions,
          include_answers: true
        })
      });

      if (!res.ok) throw new Error('Word belgesi oluşturulamadı.');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Yaprak_Test_${currentMeta.grade || '5'}_Sinif_${Date.now()}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Word indirme hatası:', err);
      alert(`Word dosyası indirilemedi: ${err.message}`);
    } finally {
      downloadDocxBtn.disabled = false;
      downloadDocxBtn.innerHTML = '<span class="icon">📄</span> Word (.docx) İndir';
    }
  });

  // 7. Bilgisayara Kaydetme: JSON İndir
  downloadJsonBtn.addEventListener('click', () => {
    if (currentQuestions.length === 0) return;

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      meta: currentMeta,
      questions: currentQuestions
    }, null, 2));

    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `Yaprak_Test_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  // 8. Bilgisayara Doğrudan PDF Olarak İndir (Önizleme İle %100 Birebir Net Çıktı)
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', async () => {
      if (currentQuestions.length === 0) return;

      const sheets = document.querySelectorAll('.a4-booklet-sheet');
      if (sheets.length === 0) return;

      try {
        downloadPdfBtn.disabled = true;
        downloadPdfBtn.innerHTML = '<span class="icon">⏳</span> PDF İndiriliyor...';

        // PDF dışa aktarma modunu aktifleştir (butonları ve arayüz rozetlerini gizle)
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

          // A4 boyutları: 210mm x 297mm - Orantılı ve taşmasız yerleşim
          const pdfW = 210;
          const pdfH = 297;
          const imgH = (canvas.height * pdfW) / canvas.width;
          const finalH = Math.min(imgH, pdfH);

          pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, finalH, undefined, 'FAST');
        }

        const filename = `${currentMeta.grade || '5'}_Sinif_Fen_Bilimleri_Deneme_Sinavi_${Date.now()}.pdf`;
        pdf.save(filename);

      } catch (err) {
        console.error('PDF indirme hatası:', err);
        // Hata durumunda standart tarayıcı penceresini aç
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
  copyAllBtn.addEventListener('click', () => {
    if (currentQuestions.length === 0) return;

    let text = `=== ${testMetaTitle.textContent} ===\n`;
    text += `Kazanımlar: ${(currentMeta.selected_outcomes || []).join(', ')}\n\n`;
    currentQuestions.forEach((q, idx) => {
      text += `Soru ${idx + 1}: ${q.question}\n`;
      text += `A) ${q.options.A}\n`;
      text += `B) ${q.options.B}\n`;
      text += `C) ${q.options.C}\n`;
      text += `D) ${q.options.D}\n`;
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

  // 10. Görünüm Ayarları (Cevap Anahtarı ve Çözüm Göster/Gizle)
  toggleAnswersBtn.addEventListener('click', () => {
    showAnswers = !showAnswers;
    updateAnswerVisibility();
  });

  function updateAnswerVisibility() {
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

  // UI Yükleniyor Durumu
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

  // 11. Sayfa Mizanpajı & Sayfa Sayısı Kontrolleri (Global Fonksiyon)
  window.setTargetPages = function(pages) {
    if (pages === 'auto' || pages === '"auto"') {
      targetPageCount = 'auto';
    } else {
      targetPageCount = parseInt(pages, 10) || 1;
    }

    // Butonların aktifliğini senkronize et
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

    // Geri Bildirim Banner'ını Güncelle
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

    // Eğer ekranda sorular varsa anında yeni sayfa sayısına göre yeniden çiz
    if (currentQuestions && currentQuestions.length > 0) {
      renderQuestions();
    }
  };

  // Sol paneldeki 1,2,3,4 butonları
  document.querySelectorAll('.btn-page-count').forEach(btn => {
    btn.addEventListener('click', () => {
      setTargetPages(btn.dataset.pages);
    });
  });

  // Üst araç çubuğundaki 1,2,3,4 butonları
  document.querySelectorAll('.btn-quick-page').forEach(btn => {
    btn.addEventListener('click', () => {
      setTargetPages(btn.dataset.pages);
    });
  });

  // Kolon & Yazı Boyutu Kontrolleri
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

  // Word İndirmede Sayfa Sayısı Gönder
  downloadDocxBtn.addEventListener('click', async () => {
    if (currentQuestions.length === 0) return;

    try {
      downloadDocxBtn.disabled = true;
      downloadDocxBtn.innerHTML = '<span class="icon">⏳</span> İndiriliyor...';

      const res = await fetch('/api/export-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
      a.download = `Yaprak_Test_${currentMeta.grade || '5'}_Sinif_${targetPageCount}_Sayfa_${Date.now()}.docx`;
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

  loadCurriculum();
});
