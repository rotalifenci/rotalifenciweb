const fs = require('fs');

// 1. UPDATE api/generate-questions.js AND ../api/generate-questions.js
['api/generate-questions.js', '../api/generate-questions.js'].forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  // Add question_type === "activity" instruction
  const actPromptSnippet = `} else if (question_type === "activity") {
      const subTypeNames = (Array.isArray(activity_types) && activity_types.length > 0)
        ? activity_types.map(a => \`\${a.title || a.type} (\${a.count || 1} adet)\`).join(', ')
        : "Eşleştirme, Sıralama, Tablo Tamamlama, Sınıflandırma, Deney Analizi";
      typeSpecificInstructions = \`SORU TÜRÜ: ETKİNLİK (FEN BİLİMLERİ ÇALIŞMA KAĞIDI VE ETKİLEŞİMLİ ETKİNLİKLER)
- Bu modül standart çoktan seçmeli sorular yerine öğrencilerin aktif olarak çözeceği, yazacağı veya eşleştireceği zengin çalışma etkinlikleri üretir.
- İstenen etkinlik türleri: \${subTypeNames}
- Her etkinlik objesinde aşağıdaki alanlar ZORUNLUDUR:
  * "type": "activity"
  * "activity_type": seçilen alt türlerden biri ("matching" | "ordering" | "table_completion" | "image_analysis" | "diagram_labeling" | "visual_tagging" | "classification" | "experiment_analysis" | "chart_interpretation" | "scientific_process" | "daily_life_problem" | "cut_paste_coloring" | "stem_design")
  * "activity_title": Etkinlik için anlaşılır bir başlık (örn: "Gök Cisimleri ve Özellikleri Eşleştirmesi")
  * "instruction": Öğrencinin ne yapması gerektiğini anlatan net bir yönerge (örn: "Sol sütunda verilen kavramları sağ sütundaki doğru açıklamalarıyla parantez içine harfleri yazarak eşleştiriniz.")
  * "activity_data": Etkinliğin türüne göre yapılandırılmış veri:
    - matching için: { "items_left": [{"id":"1","text":"..."}, {"id":"2","text":"..."}], "items_right": [{"id":"A","text":"..."}, {"id":"B","text":"..."}] }
    - ordering için: { "order_items": ["...", "...", "..."], "correct_order": [2, 1, 3] }
    - table_completion için: { "table_headers": ["Kavram", "Özellik", "Örnek"], "table_rows": [["Güneş", "...", "..."], ["Dünya", "...", "..."]] }
    - classification için: { "categories": ["Kategori 1", "Kategori 2"], "pool": ["Öğe 1", "Öğe 2", "Öğe 3"] }
    - cut_paste_coloring için: { "cut_items": ["Kesilecek parça 1", "Kesilecek parça 2"], "target_boxes": ["Hedef alan 1", "Hedef alan 2"] }
    - stem_design / experiment_analysis için: { "materials": ["..."], "steps": ["..."], "task": "..." }
  * "question": Etkinliğin çalışma metni ve yönergesi.
  * "options": {}
  * "correct_answer": Etkinliğin model çözümü ve doğru cevap anahtarı.
  * "visual_svg": Gerekli durumlarda temiz, anlaşılır SVG çizimi.\`;
    `;

  if (!code.includes('question_type === "activity"')) {
    code = code.replace(
      '} else if (question_type === "concept_map") {',
      actPromptSnippet + '} else if (question_type === "concept_map") {'
    );
    console.log('Added activity prompt instructions to:', filePath);
  }

  // Preserve activity fields in normalizedQuestions
  const targetNorm = `        question: questionText,
        options: opts,
        correct_answer: correct,`;

  const replaceNorm = `        activity_type: q.activity_type || null,
        activity_title: cleanTurkishAndLatex(q.activity_title || ""),
        instruction: cleanTurkishAndLatex(q.instruction || ""),
        activity_data: q.activity_data || null,
        question: questionText,
        options: opts,
        correct_answer: correct,`;

  if (!code.includes('activity_type: q.activity_type')) {
    code = code.replace(targetNorm, replaceNorm);
    console.log('Preserved activity fields in normalizedQuestions in:', filePath);
  }

  fs.writeFileSync(filePath, code, 'utf8');
});
