// Vercel Serverless Function: POST /api/generate-questions
const CANDIDATE_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
  "gemini-3.1-flash-lite",
  "gemini-3.6-flash"
];

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
  return text.trim();
}

function normTr(str) {
  return String(str || '')
    .toLocaleLowerCase('tr-TR')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[^a-z0-9çğıöşü ]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function sanitizeToWhiteBackground(svgContent) {
  if (!svgContent) return '';
  let cleaned = svgContent;
  if (!cleaned.includes('xmlns:xlink')) {
    cleaned = cleaned.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  }
  cleaned = cleaned.replace(/font-family=["'][^"']*["']/gi, 'font-family="\'Times New Roman\', Times, serif"');
  cleaned = cleaned.replace(/fill=["']#(070a12|090d16|0b0f19|000000|0f172a|030712|1e1b4b|1e293b|000)["']/gi, 'fill="#ffffff" stroke="#e2e8f0" stroke-width="1"');
  cleaned = cleaned.replace(/fill=["']black["']/gi, 'fill="#ffffff" stroke="#e2e8f0" stroke-width="1"');
  cleaned = cleaned.replace(/fill=["']rgba?\(\s*0\s*,\s*0\s*,\s*0[^)]*\)["']/gi, 'fill="#ffffff" stroke="#e2e8f0" stroke-width="1"');
  cleaned = cleaned.replace(/<circle[^>]*opacity=["']0\.[0-9]+["'][^>]*fill=["']#(fff|ffffff)["'][^>]*\/?>/gi, '');
  cleaned = cleaned.replace(/<circle[^>]*fill=["']#(fff|ffffff)["'][^>]*opacity=["']0\.[0-9]+["'][^>]*\/?>/gi, '');
  cleaned = cleaned.replace(/fill=["']#fbbf24["']/gi, 'fill="#b45309"');
  cleaned = cleaned.replace(/fill=["']#38bdf8["']/gi, 'fill="#0369a1"');
  cleaned = cleaned.replace(/fill=["']#e2e8f0["']/gi, 'fill="#334155"');
  cleaned = cleaned.replace(/fill=["']#(f8fafc|ffffff|fff)["'](?=[^>]*font-)/gi, 'fill="#0f172a"');
  return cleaned;
}

// Soruya ait görseli güvenle döndürür:
//  - Sabit/hazır (soruyla ilgisiz) görseller KULLANILMAZ; yalnızca yapay zekânın bu soru için ürettiği SVG kullanılır.
//  - Görsel cevabı ifşa ediyorsa (doğru cevap etiketi / cevabın fotoğrafı) maskelenir ya da kaldırılır.
function enhanceCelestialVisual(visual_svg, question, options = {}, correctLetter = '') {
  if (!visual_svg || typeof visual_svg !== 'string' || !visual_svg.includes('<svg')) return '';

  const correctText = correctLetter && options ? String(options[correctLetter] || '') : '';
  const correctNorm = normTr(correctText);
  const asksIdentification = /(ad[ıi]\s+nedir|ad[ıi]\s+hangisidir|hangisidir|hangi\s+(g[öo]k\s+cismi|evre|kat|y[üu]zey)|nas[ıi]l\s+adland[ıi]r[ıi]l[ıi]r|nedir\s*\?)/i.test(question || '');

  let svg = visual_svg;

  // 1) Cevap etiketini görselde gizle
  if (correctNorm && correctNorm.length >= 2) {
    svg = svg.replace(/<text([^>]*)>([\s\S]*?)<\/text>/gi, (m, attrs, inner) => {
      const innerNorm = normTr(inner);
      if (innerNorm && (innerNorm === correctNorm || innerNorm.includes(correctNorm) || (innerNorm.length >= 3 && correctNorm.includes(innerNorm)))) {
        return '<text' + attrs + '>?</text>';
      }
      return m;
    });
  }

  // 2) "... nedir?" tipi tanıma sorularında cevabın fotoğrafı görselde varsa görseli kaldır (ifşa olmasın)
  if (asksIdentification && correctNorm) {
    const imageMap = [
      { key: 'güneş', file: 'sun' }, { key: 'dünya', file: 'earth' }, { key: 'ay', file: 'moon' }
    ];
    for (const it of imageMap) {
      const answerMatches = correctNorm === it.key || correctNorm.split(' ').includes(it.key);
      if (answerMatches && new RegExp('/images/' + it.file + '\\.jpg', 'i').test(svg)) {
        return '';
      }
    }
  }

  return sanitizeToWhiteBackground(svg);
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const {
      grade = "5",
      subject = "Fen Bilimleri",
      learning_area = "",
      selected_outcomes = [],
      question_count = 5,
      difficulty = "Karma (Dengeli)",
      question_type = "multiple_choice",
      source_files = [],
      source_text = ""
    } = req.body || {};

    const outcomesList = Array.isArray(selected_outcomes) && selected_outcomes.length > 0
      ? selected_outcomes
      : (req.body && req.body.learning_outcome ? [req.body.learning_outcome] : []);

    const hasSourceFiles = (Array.isArray(source_files) && source_files.length > 0) || Boolean(source_text && String(source_text).trim());

    if (outcomesList.length === 0 && !hasSourceFiles) {
      return res.status(400).json({ error: "Lütfen en az bir öğrenme çıktısı seçiniz veya kaynak dosya yükleyiniz." });
    }

    const FALLBACK_KEY = Buffer.from("QVEuQWI4Uk42SVV1RzRyV25fS2VHb1VCcWxNR1UtVGpvdjZvTVdNYmN2eGt1OFNrSm1UZnc=", "base64").toString("utf8");
    const apiKey = (req.body && req.body.api_key && String(req.body.api_key).trim())
      || process.env.GEMINI_API_KEY
      || FALLBACK_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY ortam değişkeni tanımlanmamış." });
    }

    const outcomesText = outcomesList.length > 0
      ? outcomesList.map((o, idx) => `${idx + 1}. ${o}`).join('\n')
      : "Yüklenen kaynak dosyadaki konu ve kazanımları esas al.";

    // Kaynak dosyalardan çıkarılan metinleri birleştir
    let combinedSourceText = String(source_text || "").trim();
    const inlineParts = [];

    if (Array.isArray(source_files)) {
      source_files.forEach((sf, i) => {
        if (!sf) return;
        if (sf.extractedText && String(sf.extractedText).trim()) {
          combinedSourceText += `\n\n--- KAYNAK DOSYA ${i + 1}: ${sf.name || 'Belge'} ---\n${String(sf.extractedText).trim().slice(0, 18000)}`;
        }
        if (sf.base64Data && sf.mimeType && (sf.mimeType.startsWith("image/") || sf.mimeType === "application/pdf")) {
          const cleanBase64 = String(sf.base64Data).includes(",")
            ? String(sf.base64Data).split(",")[1]
            : String(sf.base64Data);
          if (cleanBase64 && cleanBase64.length < 8 * 1024 * 1024) {
            inlineParts.push({
              inlineData: {
                mimeType: sf.mimeType,
                data: cleanBase64
              }
            });
          }
        }
      });
    }

    let typeSpecificInstructions = "";
    if (question_type === "short_answer") {
      typeSpecificInstructions = `SORU TÜRÜ: KISA CEVAPLI / BOŞLUK DOLDURMA
- Sorular tek kelimelik veya kısa ifadelerle net cevaplanabilecek şekilde kurgulanmalıdır.
- "options" alanını {} yap.
- "type" alanına "short_answer" yaz.
- "correct_answer" alanına beklenen net kısa cevabı yaz.`;
    } else if (question_type === "open_ended") {
      typeSpecificInstructions = `SORU TÜRÜ: AÇIK UÇLU (KLASİK / SÜREÇ VE DENEY ANALİZİ)
- Öğrencinin neden-sonuç ilişkisini veya bilimsel gerekçeyi açıklamasını isteyen derinlikli sorular yaz.
- "options" alanını {} yap.
- "type" alanına "open_ended" yaz.
- "correct_answer" veya "explanation" alanına model cevabı yaz.`;
    } else {
      typeSpecificInstructions = `SORU TÜRÜ: ÇOKTAN SEÇMELİ (4 SEÇENEKLİ)
- Her soruda mutlaka "options" altında A, B, C, D seçenekleri ve tek net "correct_answer" bulunmalıdır.
- "type" alanına "multiple_choice" yaz.`;
    }

    const sourceInstructionBlock = (combinedSourceText || inlineParts.length > 0)
      ? `\nKAYNAK DOSYA VE OCR TALİMATI:
- Kullanıcı soru üretimi için kaynak dosya/görsel yüklemiştir.
- Eklenen görsellerdeki (OCR ile metin, tablo, deney şeması) ve belgelerdeki bilgileri dikkatlice oku ve analiz et.
- Soruları doğrudan bu kaynak içerikteki bilimsel bilgiler, kavramlar ve kazanımlar üzerinden özgünleştirerek hazırla.\n${combinedSourceText ? `\nKAYNAK METİN İÇERİĞİ:\n${combinedSourceText}\n` : ''}`
      : "";

    const systemPrompt = `Sen Milli Eğitim Bakanlığı (MEB) müfredatına ve yeni nesil soru yazım standartlarına tam hakim, uzman bir ${grade}. Sınıf ${subject} soru yazarısın.
GÖREVİN:
Verilen sınıf seviyesi (${grade}. Sınıf), ders (${subject}), seçilen öğrenme çıktıları, varsa yüklenen kaynak dosyalar ve İSTENEN SORU TÜRÜNE UYGUN, görsel ve pedagojik kalitede sorular üretmek.

${typeSpecificInstructions}
${sourceInstructionBlock}

GÖRSEL KURALLARI (ÇOK ÖNEMLİ):
- "visual_svg" yalnızca o sorunun çözümü için GEREKLİ olan bilimsel şekli/deney düzeneğini göstermelidir. Soruyla ilgisi olmayan hiçbir cisim, etiket veya süs öğesi çizilmeyecektir.
- Görsel soruyu CEVAPLAMAMALIDIR: Soru bir şeyin adını, türünü veya evresini soruyorsa (örn. "... gök cisminin adı nedir?") görselde doğru cevabın ADI yazılmayacak, doğru cevabın GERÇEK FOTOĞRAFI (/images/sun.jpg vb.) kullanılmayacak, o öğe yalnızca nötr bir şekil ve "?" işareti ile gösterilecektir.
- Soruda sorulmayan başka gök cisimlerini/nesneleri (ör. soru yalnızca Güneş'i soruyorsa Ay'ı) görsele KOYMA. Seçeneklerde yer alan cevapları görselde etiketleme.
- Görselin her etiketi bilimsel olarak doğru olmalı, soru metniyle çelişmemeli, soru kökünün cevabını vermemelidir.
- Soru görsel gerektirmiyorsa "visual_svg" alanını boş string ("") bırak. Anlamsız/genel/dekoratif görsel ÜRETME.
- Arka plan mutlaka SAF BEYAZ (#ffffff) veya şeffaf olmalıdır. Siyah veya koyu zemin KESİNLİKLE YASAKTIR.
- Gerekirse Güneş, Dünya, Ay için /images/sun.jpg, /images/earth.jpg, /images/moon.jpg dokuları yalnızca soruda cevap olarak İSTENMEYEN cisimler için kullanılabilir.

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
]`;

    const userPrompt = `Aşağıdaki bilgilere göre tam olarak ${question_count} adet soru hazırla:
- Sınıf: ${grade}. Sınıf
- Ders: ${subject}
- Ünite: ${learning_area || "Genel"}
- Kazanımlar:
${outcomesText}
- Toplam Soru: ${question_count}
- Zorluk: ${difficulty}
- Tür: ${question_type}

SADECE geçerli JSON dizisi döndür.`;

    let responseText = null;
    let lastError = null;

    const requestParts = [
      { text: `${systemPrompt}\n\n${userPrompt}` },
      ...inlineParts
    ];

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const fetchRes = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: requestParts
              }
            ],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.35
            }
          })
        });

        if (fetchRes.ok) {
          const resData = await fetchRes.json();
          if (resData.candidates && resData.candidates[0]?.content?.parts?.[0]?.text) {
            responseText = resData.candidates[0].content.parts[0].text;
            break;
          }
        } else {
          const errData = await fetchRes.json().catch(() => ({}));
          console.warn(`[Gemini API] ${modelName} HTTP ${fetchRes.status}:`, errData);
          lastError = new Error(errData.error?.message || `HTTP ${fetchRes.status}`);
        }
      } catch (err) {
        console.warn(`[Gemini API] ${modelName} çağrısı hatası:`, err.message);
        lastError = err;
      }
    }

    if (!responseText) {
      throw lastError || new Error("Hiçbir Gemini modeli yanıt veremedi.");
    }

    let questions;
    try {
      questions = JSON.parse(responseText);
    } catch (parseError) {
      return res.status(500).json({ error: "Gemini API yanıtı JSON formatına dönüştürülemedi.", raw: responseText });
    }

    if (!Array.isArray(questions)) {
      if (questions.questions && Array.isArray(questions.questions)) {
        questions = questions.questions;
      } else {
        questions = [questions];
      }
    }

    const normalizedQuestions = questions.map((q, idx) => {
      const opts = q.options && Object.keys(q.options).length > 0 ? {
        A: cleanTurkishAndLatex(q.options?.A || ""),
        B: cleanTurkishAndLatex(q.options?.B || ""),
        C: cleanTurkishAndLatex(q.options?.C || ""),
        D: cleanTurkishAndLatex(q.options?.D || "")
      } : {};

      // Doğru cevabı A-D harfine normalle (metin olarak gelmişse seçenekle eşleştir)
      let correct = cleanTurkishAndLatex((q.correct_answer || "").trim());
      if (Object.keys(opts).length > 0) {
        const letterMatch = correct.toUpperCase().match(/^([ABCD])(?:[\s).:-]|$)/);
        if (letterMatch) {
          correct = letterMatch[1];
        } else {
          const found = ['A', 'B', 'C', 'D'].find(L => normTr(opts[L]) && normTr(opts[L]) === normTr(correct));
          if (found) correct = found;
        }
      }

      const questionText = cleanTurkishAndLatex(q.question || "");
      return {
        id: q.id || idx + 1,
        type: q.type || question_type || "multiple_choice",
        visual_svg: enhanceCelestialVisual(q.visual_svg || "", questionText, opts, correct),
        grid_items: Array.isArray(q.grid_items) ? q.grid_items.map(cleanTurkishAndLatex) : [],
        question: questionText,
        options: opts,
        correct_answer: correct,
        learning_outcome: q.learning_outcome || outcomesList[0] || "Kaynak Belge Kazanımı",
        difficulty: q.difficulty || difficulty,
        explanation: cleanTurkishAndLatex(q.explanation || "")
      };
    });

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json({
      success: true,
      meta: {
        grade,
        subject,
        learning_area: learning_area || "Genel",
        question_count: normalizedQuestions.length,
        difficulty,
        question_type,
        generated_at: new Date().toISOString()
      },
      questions: normalizedQuestions
    });
  } catch (error) {
    console.error("Soru üretim hatası:", error);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(500).json({
      error: "Soru üretimi sırasında bir hata oluştu.",
      details: error.message
    });
  }
};
