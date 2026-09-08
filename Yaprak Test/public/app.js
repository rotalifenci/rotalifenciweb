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

      currentQuestions = data.questions;
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

  let targetPageCount = 1;

  // 5. Üretilen Soruları Ekrana Çizme (Kesin Sayfa Sayısı ve Doğal Sütun Akışı)
  function renderQuestions() {
    const { grade = "5", subject = "Fen Bilimleri", learning_area = "", selected_outcomes = [] } = currentMeta;
    const total_questions = currentQuestions.length;

    testMetaTitle.textContent = `${grade}. Sınıf ${subject} - ${learning_area}`;
    questionCountBadge.textContent = `${total_questions} Soru (${targetPageCount} Sayfa)`;
    printTitle.textContent = `${grade}. SINIF ${subject.toUpperCase()} DERSİ YAPRAK TESTİ`;
    printOutcomeText.textContent = selected_outcomes.join(' | ');

    questionsContainer.innerHTML = '';
    answerKeyGrid.innerHTML = '';

    // Kullanıcının seçtiği KESİN sayfa sayısı (1, 2, 3, 4)
    const effectivePages = Math.min(targetPageCount, Math.max(1, total_questions));
    const questionsPerPage = Math.ceil(total_questions / effectivePages);

    // Her sayfa için dinamik ölçek sınıfı belirle (Taşmayı önlemek için)
    let densityClass = 'density-normal';
    if (questionsPerPage >= 5) densityClass = 'density-compact';
    else if (questionsPerPage >= 3) densityClass = 'density-medium';

    for (let pIdx = 0; pIdx < effectivePages; pIdx++) {
      const startIdx = pIdx * questionsPerPage;
      const endIdx = Math.min(startIdx + questionsPerPage, total_questions);
      const pageQuestions = currentQuestions.slice(startIdx, endIdx);

      if (pageQuestions.length === 0) continue;

      const pageSheet = document.createElement('div');
      pageSheet.className = `a4-sheet-container ${densityClass}`;
      pageSheet.id = `a4-page-${pIdx + 1}`;

      // Sayfa Üst Bilgi Başlığı (Web Görünümü ve Baskı Başlığı)
      const isFirstPage = (pIdx === 0);
      pageSheet.innerHTML = `
        <div class="page-top-badge no-print">
          <span>📄 Sayfa ${pIdx + 1} / ${effectivePages}</span>
          <span>${pageQuestions.length} Soru</span>
        </div>

        ${!isFirstPage ? `
          <div class="print-mini-header print-only">
            <div class="mini-header-text"><strong>${grade}. SINIF ${subject.toUpperCase()} YAPRAK TESTİ</strong> - Sayfa ${pIdx + 1}</div>
          </div>
        ` : ''}

        <!-- 2 Sütunlu Doğal Akış Alanı (Alt Alta Biterse Yana Geçer) -->
        <div class="a4-page-content-columns"></div>

        ${(pIdx === effectivePages - 1) ? `
          <!-- Son Sayfanın Altına Cevap Anahtarı Şeridi -->
          <div class="a4-page-footer-ans no-print">
            <span class="ans-strip-label">Cevap Anahtarı:</span>
            <span class="ans-strip-content" id="miniAnsStrip"></span>
          </div>
        ` : ''}
      `;

      const columnsContainer = pageSheet.querySelector('.a4-page-content-columns');

      pageQuestions.forEach((q, relIdx) => {
        const qIdx = startIdx + relIdx;
        const qNum = qIdx + 1;
        const card = document.createElement('div');
        card.className = `question-card ${editingQuestionIndex === qIdx ? 'is-editing' : ''}`;
        card.id = `q-card-${qNum}`;

        const diffClass = q.difficulty === 'Kolay' ? 'tag-diff-Kolay' : (q.difficulty === 'Zor' ? 'tag-diff-Zor' : 'tag-diff-Orta');

        let typeLabel = "Çoktan Seçmeli";
        if (q.type === "short_answer") typeLabel = "Kısa Cevaplı";
        else if (q.type === "open_ended") typeLabel = "Açık Uçlu";
        else if (q.type === "structured_grid") typeLabel = "Yapılandırılmış Grid";
        else if (q.type === "concept_map") typeLabel = "Kavram Haritası";
        else if (q.type === "v_diagram") typeLabel = "V Diyagramı";

        if (editingQuestionIndex === qIdx) {
          // DÜZENLEME MODU
          const isMultipleChoice = q.options && q.options.A;
          card.innerHTML = `
            <div class="question-header">
              <div class="question-number">Soru ${qNum} (Düzenleniyor)</div>
              <div class="tag tag-outcome">${typeLabel}</div>
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

            <div class="edit-field-group">
              <label><strong>Açıklama / Rubrik:</strong></label>
              <textarea class="edit-textarea edit-explanation" rows="2">${escapeHtml(q.explanation || '')}</textarea>
            </div>

            <div class="edit-actions-footer">
              <button type="button" class="btn btn-secondary btn-sm" onclick="cancelEditQuestion()">İptal</button>
              <button type="button" class="btn btn-primary btn-sm" onclick="saveEditQuestion(${qIdx})">💾 Kaydet</button>
            </div>
          `;
        } else {
          // NORMAL GÖRÜNÜM
          const visualBoxHtml = q.visual_svg && q.visual_svg.trim() 
            ? `<div class="question-visual-box">${q.visual_svg}</div>` 
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
            contentBodyHtml = `
              <div class="options-grid">
                ${['A', 'B', 'C', 'D'].map(opt => `
                  <div class="option-item ${opt === q.correct_answer ? 'is-correct' : ''}">
                    <div class="option-letter">${opt}</div>
                    <div class="option-text">${escapeHtml(q.options[opt] || '')}</div>
                  </div>
                `).join('')}
              </div>
            `;
          } else if (q.type === 'open_ended') {
            contentBodyHtml = `
              <div class="open-ended-answer-area">
                <div class="answer-lines-prompt">Cevabınızı aşağıdaki alana gerekçeleriyle yazınız:</div>
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
              <div class="question-number">${qNum}. Soru <span class="badge-type">${typeLabel}</span></div>
              <div class="question-meta-tags">
                <span class="tag ${diffClass}">${q.difficulty || 'Orta'}</span>
              </div>
              <div class="question-card-actions no-print">
                <button type="button" class="btn-action-icon" title="Düzenle" onclick="startEditQuestion(${qIdx})">✏️</button>
                <button type="button" class="btn-action-icon" title="Yeniden Üret" onclick="regenerateQuestion(${qIdx})">🔄</button>
                <button type="button" class="btn-action-icon btn-action-delete" title="Sil" onclick="deleteQuestion(${qIdx})">🗑️</button>
              </div>
            </div>
            ${visualBoxHtml}
            ${gridHtml}
            <div class="question-body">${escapeHtml(q.question)}</div>
            ${contentBodyHtml}
            <div class="solution-box" style="display: ${showSolutions ? 'block' : 'none'};">
              <strong>💡 Doğru Cevap: ${escapeHtml(q.correct_answer)}</strong>
              <div>${escapeHtml(q.explanation || 'Açıklama mevcut değil.')}</div>
            </div>
          `;
        }

        columnsContainer.appendChild(card);

        // Cevap Anahtarı Listesine Ekle
        const akItem = document.createElement('div');
        akItem.className = 'answer-key-item';
        akItem.innerHTML = `<span class="q-no">${qNum}.</span> <span class="q-ans">${escapeHtml(q.correct_answer || '-')}</span>`;
        answerKeyGrid.appendChild(akItem);
      });

      questionsContainer.appendChild(pageSheet);
    }

    // Mini Cevap Şeridini Doldur
    const miniStrip = document.getElementById('miniAnsStrip');
    if (miniStrip) {
      miniStrip.textContent = currentQuestions.map((q, idx) => `${idx + 1}-${q.correct_answer || '?'}`).join('  |  ');
    }

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

      currentQuestions[idx] = data.questions[0];
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

  // 8. Bilgisayara Kaydetme: PDF / Yazdır
  printBtn.addEventListener('click', () => {
    window.print();
  });

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

  // 11. 1, 2, 3, 4 Sayfa Buton Kontrolleri (Global Fonksiyon)
  window.setTargetPages = function(pages) {
    targetPageCount = parseInt(pages, 10) || 1;

    // Butonların aktifliğini senkronize et
    document.querySelectorAll('.btn-page-count').forEach(btn => {
      const p = parseInt(btn.getAttribute('data-pages'), 10);
      btn.classList.toggle('active', p === targetPageCount);
    });

    document.querySelectorAll('.btn-quick-page').forEach(btn => {
      const p = parseInt(btn.getAttribute('data-pages'), 10);
      btn.classList.toggle('active', p === targetPageCount);
    });

    const targetInput = document.getElementById('targetPageCount');
    if (targetInput) targetInput.value = targetPageCount;

    // Geri Bildirim Banner'ını Güncelle
    const feedback = document.getElementById('pageCountFeedback');
    if (feedback) {
      if (targetPageCount === 1) {
        feedback.innerHTML = `<span>⚡ <strong>1 Sayfa Seçildi:</strong> Test tek bir A4 yaprağına sığdırılacak.</span>`;
        feedback.style.borderColor = '#818cf8';
      } else if (targetPageCount === 2) {
        feedback.innerHTML = `<span>📑 <strong>2 Sayfa Seçildi:</strong> Test 2 sayfaya (önlü-arkalı) dengeli dağıtılacak.</span>`;
        feedback.style.borderColor = '#10b981';
      } else if (targetPageCount === 3) {
        feedback.innerHTML = `<span>📑 <strong>3 Sayfa Seçildi:</strong> Test 3 ayrı A4 sayfasına dağıtılacak.</span>`;
        feedback.style.borderColor = '#0ea5e9';
      } else if (targetPageCount === 4) {
        feedback.innerHTML = `<span>📚 <strong>4 Sayfa Seçildi:</strong> Test 4 tam sayfaya (kitapçık formatı) dağıtılacak.</span>`;
        feedback.style.borderColor = '#f59e0b';
      }
    }

    document.body.classList.toggle('fit-1-page-print', targetPageCount === 1);

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
