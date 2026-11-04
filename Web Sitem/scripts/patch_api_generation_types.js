const fs = require('fs');

function patchApiGenerate() {
  const filePath = 'api/generate-questions.js';
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace lines 384-427 with type-tailored quality rules and sample JSON
  const targetOldPrompt = `    const systemPrompt = \`Sen Milli Eğitim Bakanlığı (MEB) müfredatına ve yeni nesil soru yazım standartlarına tam hakim, uzman bir \${grade}. Sınıf \${subject} soru yazarısın.
GÖREVİN:
Verilen sınıf seviyesi (\${grade}. Sınıf), ders (\${subject}), seçilen öğrenme çıktıları, varsa yüklenen kaynak dosyalar ve İSTENEN SORU TÜRÜNE UYGUN, görsel ve pedagojik kalitede sorular üretmek.

\${typeSpecificInstructions}
\${sourceInstructionBlock}

GÖRSEL KURALLARI (HAYATİ ÖNEMDE KESİN KURALLAR):
1. KESİNLİKLE VE ASLA CEVABI GÖRSELE YAZMA (SIFIR İPUCU KURALI):
   - Soru neyi soruyorsa (kavram adı, geometrik şekil, cisim adı, evre, büyüklük sıralaması, özellik vb.) görselde o cevabı veya ipucunu KESİNLİKLE YAZMA!
   - Örneğin:
     - Soru geometrik şekli soruyorsa görsele "Küre" KESİNLİKLE YAZILAMAZ!
     - Soru gök cisminin sınıfını soruyorsa görsele "Yıldız" KESİNLİKLE YAZILAMAZ!
     - Soru ışık kaynağı olup olmamasını soruyorsa görsele "Işık Kaynağı Değil" KESİNLİKLE YAZILAMAZ!
     - Soru büyüklük karşılaştırmasını soruyorsa araya büyüktür/küçüktür ('>', '<') işareti KESİNLİKLE KONULAMAZ! Araya sadece '?' veya nötr çizgiler konulur.
     - Soru gök cisminin adını soruyorsa ("Görseldeki dev kütleli gök cisminin adı nedir?") görselin altına o cismin adı (Güneş, Ay vb.) YAZILAMAZ! Sadece '?' veya 'X' yazılır.

2. SADECE VE SADECE SORUYLA İLGİLİ GÖK CİSMİNİ / NESNEYİ GÖSTER:
   - Soru yalnızca Güneş'i soruyorsa görsele ASLA Ay veya Dünya ekleme! Sadece Güneş gösterilmelidir.
   - Soru yalnızca Ay'ın yapısını soruyorsa gereksiz yere Güneş çizme! Sadece Ay gösterilmelidir.

3. GERÇEK UZAY FOTOĞRAFLARI KULLANILACAKTIR:
   - Basit, düz renkli sarı/mavi/gri çizim daireler (<circle fill="#f59e0b"> vb.) KESİNLİKLE KULLANILMAYACAKTIR.
   - Güneş, Dünya veya Ay görseli gerektiğinde NASA'nın gerçek fotoğraflarını dairesel clipPath ile içeren SVG <image> kullanılacaktır:
     - Güneş: <image href="/images/sun.jpg" xlink:href="/images/sun.jpg" ... clip-path="url(#...)" preserveAspectRatio="xMidYMid slice"/>
     - Dünya: <image href="/images/earth.jpg" xlink:href="/images/earth.jpg" ... clip-path="url(#...)" preserveAspectRatio="xMidYMid slice"/>
     - Ay: <image href="/images/moon.jpg" xlink:href="/images/moon.jpg" ... clip-path="url(#...)" preserveAspectRatio="xMidYMid slice"/>
   - Arka plan mutlaka SAF BEYAZ (#ffffff), yazılar koyu (#0f172a), font "'Times New Roman', Times, serif" olmalıdır.

SORU KALİTE KURALLARI:
- Her sorunun TEK ve bilimsel olarak kesin doğru cevabı olmalı; "correct_answer" mutlaka "A", "B", "C" veya "D" harfi olmalı ve seçeneklerle birebir tutarlı olmalıdır.
- Soru kökü cevabı ima etmemeli ya da içinde vermemelidir. Çeldiriciler makul ama kesin YANLIŞ olmalıdır; seçenekler birbirinin aynısı olmamalıdır.
- Doğru cevaplar A, B, C, D arasında dengeli dağılmalıdır.
- Soru metni, seçenekler, görsel ve açıklama birbiriyle tamamen tutarlı olmalıdır; "explanation" doğru cevabı bilimsel gerekçesiyle açıklamalıdır.
- Soru, seçilen kazanımla ve sınıf seviyesiyle birebir uyumlu olmalıdır.

TİPOGRAFİ VE İMLA KURALLARI:
- KESİNLİKLE LaTeX ($...$, $$...$$) KULLANILMAYACAKTIR!
- Düzgün Türkçe karakterler kullanılmalıdır.
- SVG'deki metinlerde font-family="'Times New Roman', Times, serif" kullanılmalıdır.

Yanıtı SADECE ve SADECE JSON formatında bir dizi (Array) olarak ver:
[
  {
    "id": 1,
    "type": "multiple_choice",
    "visual_svg": "<svg viewBox=\\"0 0 520 220\\" width=\\"100%\\" height=\\"100%\\" xmlns=\\"http://www.w3.org/2000/svg\\">...</svg>",
    "question": "Soru metni...",
    "options": {
      "A": "A seçeneği",
      "B": "B seçeneği",
      "C": "C seçeneği",
      "D": "D seçeneği"
    },
    "correct_answer": "A",
    "learning_outcome": "Ölçülen çıktı",
    "difficulty": "Kolay | Orta | Zor",
    "explanation": "Detaylı açıklama..."
  }
]\`;

    const userPrompt = \`Aşağıdaki bilgilere göre tam olarak \${question_count} adet soru hazırla:
- Sınıf: \${grade}. Sınıf
- Ders: \${subject}
- Ünite: \${learning_area || "Genel"}
- Kazanımlar:
\${outcomesText}
- Toplam Soru: \${question_count}
- Zorluk: \${difficulty}
- Tür: \${question_type}

SADECE geçerli JSON dizisi döndür.\`;`;

  const newPromptLogic = `    // Soru türüne göre dinamik kalite kuralları ve örnek JSON şeması
    let qualityRules = "";
    let sampleJson = "";

    if (question_type === "short_answer") {
      qualityRules = \`SORU KALİTE KURALLARI (KISA CEVAPLI / BOŞLUK DOLDURMA):
- Sorular tek kelimelik veya kısa ifadeli net cevaplar gerektirmelidir.
- KESİNLİKLE seçenek (A, B, C, D) ÜRETİLMEYECEKTİR! "options" alanı BOŞ OBJE {} olmalıdır.
- "type" alanı mutlaka "short_answer" olmalıdır.
- "correct_answer" doğrudan beklenen net kısa cevaptır.\`;
      sampleJson = \`[
  {
    "id": 1,
    "type": "short_answer",
    "visual_svg": "",
    "question": "Ay'ın Dünya etrafındaki dolanma süresi ile kendi ekseni etrafındaki dönme süresi yaklaşık ................ gündür.",
    "options": {},
    "correct_answer": "27,3 gün",
    "learning_outcome": "Ay'ın dönme ve dolanma hareketleri",
    "difficulty": "Orta",
    "explanation": "Ay'ın kendi ekseni etrafında dönme süresi ile Dünya etrafında dolanma süresi birbirine eşittir."
  }
]\`;
    } else if (question_type === "open_ended") {
      qualityRules = \`SORU KALİTE KURALLARI (AÇIK UÇLU / KLASİK):
- Sorular öğrencinin neden-sonuç ilişkisini, bilimsel gerekçesini veya deney analizini yazılı olarak açıklamasını gerektirir.
- KESİNLİKLE seçenek (A, B, C, D) ÜRETİLMEYECEKTİR! "options" alanı BOŞ OBJE {} olmalıdır.
- "type" alanı mutlaka "open_ended" olmalıdır.
- "correct_answer" model bilimsel çözüm ve değerlendirme ölçütüdür.\`;
      sampleJson = \`[
  {
    "id": 1,
    "type": "open_ended",
    "visual_svg": "",
    "question": "Ay tutulmasının her dolunay evresinde gerçekleşmemesinin bilimsel nedenini açıklayınız.",
    "options": {},
    "correct_answer": "Model Çözüm: Ay'ın dolanma düzlemi ile Dünya'nın yörünge düzlemi arasında yaklaşık 5 derecelik bir eğiklik bulunur.",
    "learning_outcome": "Ay tutulmasının oluşumu ve özellikleri",
    "difficulty": "Zor",
    "explanation": "Yörünge düzlemlerinin 5 derece eğik olması tutulmanın her ay olmasını engeller."
  }
]\`;
    } else if (question_type === "activity") {
      qualityRules = \`SORU KALİTE KURALLARI (ETKİNLİKLER - 13 ÖZEL TÜR):
- Çoktan seçmeli soru KESİNLİKLE üretilmeyecektir. "options" alanı BOŞ OBJE {} olmalıdır.
- "type" alanı mutlaka "activity" olmalıdır.
- "activity_type", "activity_title", "instruction" ve zengin "activity_data" alanları zorunludur.\`;
      sampleJson = \`[
  {
    "id": 1,
    "type": "activity",
    "activity_type": "matching",
    "activity_title": "Gök Cisimleri ve Özellikleri Eşleştirmesi",
    "instruction": "Sol sütundaki kavramları sağ sütundaki tanımlarla eşleştiriniz.",
    "activity_data": {
      "items_left": [{"id": "1", "text": "Güneş"}, {"id": "2", "text": "Ay"}],
      "items_right": [{"id": "A", "text": "Dünya'nın uydusu"}, {"id": "B", "text": "Doğal ışık kaynağı"}]
    },
    "visual_svg": "",
    "question": "Aşağıdaki eşleştirme etkinliğini tamamlayınız.",
    "options": {},
    "correct_answer": "1 - B, 2 - A",
    "learning_outcome": "Güneş, Dünya ve Ay'ın temel özellikleri",
    "difficulty": "Orta",
    "explanation": "Güneş bir yıldızdır, Ay doğal uydudur."
  }
]\`;
    } else {
      qualityRules = \`SORU KALİTE KURALLARI (ÇOKTAN SEÇMELİ):
- Her sorunun TEK ve bilimsel olarak kesin doğru cevabı olmalı; "correct_answer" mutlaka "A", "B", "C" veya "D" harfi olmalı ve seçeneklerle birebir tutarlı olmalıdır.
- Soru kökü cevabı ima etmemeli ya da içinde vermemelidir. Çeldiriciler makul ama kesin YANLIŞ olmalıdır.
- "type" alanı mutlaka "multiple_choice" olmalıdır.\`;
      sampleJson = \`[
  {
    "id": 1,
    "type": "multiple_choice",
    "visual_svg": "",
    "question": "Aşağıdakilerden hangisi Güneş'in temel özelliklerinden biri değildir?",
    "options": {
      "A": "Orta büyüklükte bir yıldızdır.",
      "B": "Yüzeyi katı ve kayalık bir yapıya sahiptir.",
      "C": "Kendi ekseni etrafında döner.",
      "D": "Isı ve ışık kaynağıdır."
    },
    "correct_answer": "B",
    "learning_outcome": "Güneş'in yapısı ve özellikleri",
    "difficulty": "Kolay",
    "explanation": "Güneş katı veya kayalık değildir; gaz küresidir."
  }
]\`;
    }

    const systemPrompt = \`Sen Milli Eğitim Bakanlığı (MEB) müfredatına ve yeni nesil soru yazım standartlarına tam hakim, uzman bir \${grade}. Sınıf \${subject} soru yazarısın.
GÖREVİN:
Verilen sınıf seviyesi (\${grade}. Sınıf), ders (\${subject}), seçilen öğrenme çıktıları, varsa yüklenen kaynak dosyalar ve İSTENEN SORU TÜRÜNE (\${question_type}) UYGUN, görsel ve pedagojik kalitede içerikler üretmek.

\${typeSpecificInstructions}
\${sourceInstructionBlock}

GÖRSEL KURALLARI (HAYATİ ÖNEMDE KESİN KURALLAR):
1. KESİNLİKLE VE ASLA CEVABI GÖRSELE YAZMA (SIFIR İPUCU KURALI).
2. SADECE VE SADECE SORUYLA İLGİLİ NESNEYİ / KAVRAMI GÖSTER.
3. Arka plan SAF BEYAZ (#ffffff), yazılar koyu (#0f172a), font "'Times New Roman', Times, serif" olmalıdır.

\${qualityRules}

TİPOGRAFİ VE İMLA KURALLARI:
- KESİNLİKLE LaTeX ($...$, $$...$$) KULLANILMAYACAKTIR!
- Düzgün Türkçe karakterler kullanılmalıdır.

Yanıtı SADECE ve SADECE JSON formatında bir dizi (Array) olarak ver:
\${sampleJson}\`;

    const userPrompt = \`Aşağıdaki bilgilere göre tam olarak \${question_count} adet \${question_type} hazırla:
- Sınıf: \${grade}. Sınıf
- Ders: \${subject}
- Ünite: \${learning_area || "Genel"}
- Kazanımlar:
\${outcomesText}
- Toplam Sayı: \${question_count}
- Zorluk: \${difficulty}
- Hedef Tür: \${question_type}

SADECE geçerli JSON dizisi döndür.\`;`;

  content = content.replace(targetOldPrompt, newPromptLogic);

  // Normalization logic update: enforce exact question_type and empty options for non-MC
  const targetOldNorm = `    const normalizedQuestions = questions.map((q, idx) => {
      const opts = q.options && Object.keys(q.options).length > 0 ? {
        A: cleanTurkishAndLatex(q.options?.A || ""),
        B: cleanTurkishAndLatex(q.options?.B || ""),
        C: cleanTurkishAndLatex(q.options?.C || ""),
        D: cleanTurkishAndLatex(q.options?.D || "")
      } : {};

      // Doğru cevabı A-D harfine normalle (metin olarak gelmişse seçenekle eşleştir)
      let correct = cleanTurkishAndLatex((q.correct_answer || "").trim());
      if (Object.keys(opts).length > 0) {
        const letterMatch = correct.toUpperCase().match(/^([ABCD])(?:[\\s).:-]|$)/);
        if (letterMatch) {
          correct = letterMatch[1];
        } else {
          const found = ['A', 'B', 'C', 'D'].find(L => normTr(opts[L]) && normTr(opts[L]) === normTr(correct));
          if (found) correct = found;
        }
      }

      const questionText = cleanTurkishAndLatex(q.question || "");
      const isAct = (q.type === 'activity' || question_type === 'activity');
      const actType = q.activity_type || (isAct ? ((activity_types[idx % (activity_types.length || 1)] || {}).type || 'matching') : null);

      return {
        id: q.id || idx + 1,
        type: isAct ? 'activity' : (q.type || question_type || "multiple_choice"),
        activity_type: actType,
        activity_title: cleanTurkishAndLatex(q.activity_title || (isAct ? \`Etkinlik \${idx + 1}\` : "")),
        instruction: cleanTurkishAndLatex(q.instruction || ""),
        activity_data: q.activity_data || null,
        visual_svg: enhanceCelestialVisual(q.visual_svg || "", questionText, opts, correct),
        grid_items: Array.isArray(q.grid_items) ? q.grid_items.map(cleanTurkishAndLatex) : [],
        question: questionText,
        options: opts,
        correct_answer: correct,
        learning_outcome: q.learning_outcome || outcomesList[0] || "Kaynak Belge Kazanımı",
        difficulty: q.difficulty || difficulty,
        explanation: cleanTurkishAndLatex(q.explanation || "")
      };
    });`;

  const newNormLogic = `    const isAct = (question_type === 'activity');
    const isOE = (question_type === 'open_ended');
    const isSA = (question_type === 'short_answer');
    const enforcedType = isAct ? 'activity' : (isOE ? 'open_ended' : (isSA ? 'short_answer' : 'multiple_choice'));

    let normalizedQuestions = questions.map((q, idx) => {
      // Çoktan seçmeli olmayan sorularda options KESİNLİKLE boş nesne {} olmalıdır
      const opts = (enforcedType === 'multiple_choice' && q.options && Object.keys(q.options).length > 0) ? {
        A: cleanTurkishAndLatex(q.options?.A || ""),
        B: cleanTurkishAndLatex(q.options?.B || ""),
        C: cleanTurkishAndLatex(q.options?.C || ""),
        D: cleanTurkishAndLatex(q.options?.D || "")
      } : {};

      let correct = cleanTurkishAndLatex((q.correct_answer || "").trim());
      if (enforcedType === 'multiple_choice' && Object.keys(opts).length > 0) {
        const letterMatch = correct.toUpperCase().match(/^([ABCD])(?:[\\s).:-]|$)/);
        if (letterMatch) {
          correct = letterMatch[1];
        } else {
          const found = ['A', 'B', 'C', 'D'].find(L => normTr(opts[L]) && normTr(opts[L]) === normTr(correct));
          if (found) correct = found;
        }
      }

      const questionText = cleanTurkishAndLatex(q.question || "");
      const actType = q.activity_type || (isAct ? ((activity_types[idx % (activity_types.length || 1)] || {}).type || 'matching') : null);

      return {
        id: q.id || idx + 1,
        type: enforcedType,
        activity_type: actType,
        activity_title: cleanTurkishAndLatex(q.activity_title || (isAct ? \`Etkinlik \${idx + 1}\` : "")),
        instruction: cleanTurkishAndLatex(q.instruction || ""),
        activity_data: q.activity_data || null,
        visual_svg: enhanceCelestialVisual(q.visual_svg || "", questionText, opts, correct),
        grid_items: Array.isArray(q.grid_items) ? q.grid_items.map(cleanTurkishAndLatex) : [],
        question: questionText,
        options: opts,
        correct_answer: correct,
        learning_outcome: q.learning_outcome || outcomesList[0] || "Kaynak Belge Kazanımı",
        difficulty: q.difficulty || difficulty,
        explanation: cleanTurkishAndLatex(q.explanation || "")
      };
    });`;

  content = content.replace(targetOldNorm, newNormLogic);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully patched api/generate-questions.js');
}

patchApiGenerate();
