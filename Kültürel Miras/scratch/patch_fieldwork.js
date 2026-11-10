const fs = require('fs');
const path = require('path');

const appPath = path.join(process.cwd(), 'js/app.js');
let code = fs.readFileSync(appPath, 'utf8');

const sIdx = code.indexOf('initFieldworkModule() {');
const sNext = code.indexOf('\n  initMapPicker() {', sIdx);

const newFieldworkCode = `initFieldworkModule() {
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
            (t, idx) => \`
            <label class="task-item">
              <input type="checkbox" id="taskChk_\${idx}">
              <span>\${t}</span>
            </label>
          \`
          )
          .join("");
      }
    };

    btnDigital?.addEventListener("click", () => {
      btnDigital.classList.add("active");
      btnPhysical?.classList.remove("active");
      if (title) title.innerHTML = \`<i class="fa-solid fa-laptop"></i> 1. Dijital Gezi Gözlem Görevleri (Sınıf/Ev)\`;
      if (desc) desc.innerText = "3B dijital modeller üzerinden tamamlamanız gereken keşif adımları:";
      renderTasks(digitalTasks);
    });

    btnPhysical?.addEventListener("click", () => {
      btnPhysical.classList.add("active");
      btnDigital?.classList.remove("active");
      if (title) title.innerHTML = \`<i class="fa-solid fa-person-walking"></i> 2. Yerinde Keşif Saha Görevleri (Mekânda)\`;
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
        (q, qIdx) => \`
        <div class="q-block">
          <div class="q-header-row">
            <span class="q-num">\${qIdx + 1}. Soru</span>
            \${q.dimension ? \`<span class="badge-evidence \${q.dimension.includes('Kanıt') ? 'verified' : 'academic'}">\${q.dimension}</span>\` : ''}
          </div>
          <div class="q-text">\${q.question}</div>
          <div class="q-options">
            \${q.options
              .map(
                (opt, oIdx) => \`
              <label class="q-opt">
                <input type="radio" name="\${q.id}" value="\${oIdx}">
                <span>\${opt}</span>
              </label>
            \`
              )
              .join("")}
          </div>
        </div>
      \`
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
      const selected = document.querySelector(\`input[name="\${q.id}"]:checked\`);
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

    if (scoreNum) scoreNum.innerText = \`\${score} / \${questions.length}\`;
    if (scoreLabel) scoreLabel.innerText = this.testMode === "pre" ? "Ön Test Puanı" : "Son Test Puanı";

    let fbText = "";
    if (this.testScores.pre !== null && this.testScores.post !== null) {
      const diff = this.testScores.post - this.testScores.pre;
      fbText = \`TÜBİTAK 2204-B Başarı Değerlendirmesi: Ön Test: \${this.testScores.pre} Puan | Son Test: \${this.testScores.post} Puan. Öğrenme Kazanımı Artışı: +\${diff} net doğru! Harika bir akademik gelişim sergilediniz.\`;
    } else {
      fbText = \`Tebrikler! \${this.testMode === 'pre' ? 'Ön Testi' : 'Son Testi'} başarıyla tamamladınız. \${score >= 4 ? 'Üstün bir kültürel miras ve kanıt okuma kavrayışı sergilediniz.' : 'Eser detaylarını ve kitabeleri tekrar inceleyerek bilginizi pekiştirebilirsiniz.'}\`;
    }

    if (feedback) feedback.innerText = fbText;
    if (resultBox) resultBox.style.display = "block";

    // Dijital Rehber Eren/Aybüke Konuşması
    if (window.SIVAS_GUIDES) {
      const guideText = \`Tebrik ederim! \${this.testMode === 'pre' ? 'Ön test' : 'Son test'} sonucun: \${score}/\${questions.length}. Şimdi test sonuçlarını CSV formatında indirerek TÜBİTAK proje raporuna ekleyebilirsin!\`;
      window.SIVAS_GUIDES.showSpeech(guideText, "fieldwork");
    }
  },

  exportTestResultsCsv() {
    if (window.SIVAS_EVALUATION && typeof window.SIVAS_EVALUATION.exportToCsv === 'function') {
      window.SIVAS_EVALUATION.exportToCsv();
    } else {
      const csvContent =
        "\\uFEFF" +
        "Test_Türü;Puan;Toplam_Soru;Tarih\\n" +
        \`Ön Test;\${this.testScores.pre || 0};5;\${new Date().toLocaleDateString()}\\n\` +
        \`Son Test;\${this.testScores.post || 0};5;\${new Date().toLocaleDateString()}\\n\`;

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.setAttribute("href", URL.createObjectURL(blob));
      link.setAttribute("download", \`tubitak_2204b_sivas_test_verileri_\${Date.now()}.csv\`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },`;

code = code.substring(0, sIdx) + newFieldworkCode + code.substring(sNext);
fs.writeFileSync(appPath, code, 'utf8');
console.log('Fieldwork & Evaluation module patched successfully.');
