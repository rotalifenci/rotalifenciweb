const fs = require('fs');
const path = require('path');

const appPath = path.join(process.cwd(), 'js/app.js');
let code = fs.readFileSync(appPath, 'utf8');

// 1. Update initComparisonModule
const oldCompStart = code.indexOf('initComparisonModule() {');
const oldCompEnd = code.indexOf('\n  initTimeline() {', oldCompStart);

const newCompCode = `initComparisonModule() {
    const sel1 = document.getElementById("compareSelect1");
    const sel2 = document.getElementById("compareSelect2");
    const sel3 = document.getElementById("compareSelect3");

    if (!sel1 || !sel2 || !sel3) return;

    const optionsHtml = window.SIVAS_MONUMENTS.map(
      (m) => \`<option value="\${m.id}">\${m.name} (\${m.buildYear})</option>\`
    ).join("");

    sel1.innerHTML = optionsHtml;
    sel2.innerHTML = optionsHtml;
    sel3.innerHTML = \`<option value="none">-- Seçilmedi (2'li Karşılaştırma) --</option>\` + optionsHtml;

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
        (c) => \`
        <tr>
          <td class="crit-col">\${c.label}</td>
          <td>\${(m1.comparisonData && m1.comparisonData[c.key]) || "-"}</td>
          <td>\${(m2.comparisonData && m2.comparisonData[c.key]) || "-"}</td>
          <td>\${m3 ? ((m3.comparisonData && m3.comparisonData[c.key]) || "-") : "-"}</td>
        </tr>
      \`
      )
      .join("");
  },`;

code = code.substring(0, oldCompStart) + newCompCode + code.substring(oldCompEnd);
console.log('Comparison module updated successfully.');
fs.writeFileSync(appPath, code, 'utf8');
