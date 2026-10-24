// Vercel Serverless Function: POST /api/generate-questions
const CANDIDATE_MODELS = [
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

function enhanceCelestialVisual(visual_svg, question, options = {}) {
  const textToScan = `${question || ''} ${Object.values(options || {}).join(' ')} ${visual_svg || ''}`.toLowerCase();
  const hasGunes = textToScan.includes('güneş') || textToScan.includes('gunes') || textToScan.includes('sun');
  const hasDunya = textToScan.includes('dünya') || textToScan.includes('dunya') || textToScan.includes('earth');
  const hasAy = textToScan.includes('ay') || textToScan.includes('moon') || textToScan.includes('hilal') || textToScan.includes('dolunay');

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

  if (visual_svg && visual_svg.includes('/images/') && visual_svg.includes('<image')) {
    return sanitizeToWhiteBackground(visual_svg);
  }

  const isSizeComparison = (hasGunes && hasDunya && hasAy) || 
                           ((textToScan.includes('büyüklük') || textToScan.includes('boyut') || textToScan.includes('kıyas') || textToScan.includes('basketbol topu') || textToScan.includes('sıralama') || textToScan.includes('hacim')) && (hasGunes || hasDunya || hasAy));
  const isLightReflection = textToScan.includes('ışık kaynağı') || textToScan.includes('isik kaynagi') || textToScan.includes('yansıt') || textToScan.includes('yansit');
  const isShapeQuestion = (textToScan.includes('geometrik şekil') || textToScan.includes('geometrik sekil') || textToScan.includes('küre') || textToScan.includes('kure')) && (hasGunes && hasAy);

  if (isSizeComparison || (hasGunes && hasDunya && hasAy)) {
    return `<svg viewBox="0 0 520 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <clipPath id="sunScaleClip"><circle cx="110" cy="95" r="76"/></clipPath>
    <clipPath id="earthScaleClip"><circle cx="315" cy="95" r="28"/></clipPath>
    <clipPath id="moonScaleClip"><circle cx="435" cy="95" r="12"/></clipPath>
  </defs>
  <rect x="0" y="0" width="520" height="220" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
  <line x1="190" y1="95" x2="280" y2="95" stroke="#cbd5e1" stroke-dasharray="4,4" stroke-width="1.5"/>
  <line x1="348" y1="95" x2="418" y2="95" stroke="#cbd5e1" stroke-dasharray="4,4" stroke-width="1.5"/>
  <image href="/images/sun.jpg" xlink:href="/images/sun.jpg" x="34" y="19" width="152" height="152" clip-path="url(#sunScaleClip)" preserveAspectRatio="xMidYMid slice"/>
  <circle cx="110" cy="95" r="76" fill="none" stroke="#f59e0b" stroke-width="2"/>
  <image href="/images/earth.jpg" xlink:href="/images/earth.jpg" x="287" y="67" width="56" height="56" clip-path="url(#earthScaleClip)" preserveAspectRatio="xMidYMid slice"/>
  <circle cx="315" cy="95" r="28" fill="none" stroke="#0284c7" stroke-width="1.5"/>
  <image href="/images/moon.jpg" xlink:href="/images/moon.jpg" x="423" y="83" width="24" height="24" clip-path="url(#moonScaleClip)" preserveAspectRatio="xMidYMid slice"/>
  <circle cx="435" cy="95" r="12" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="110" y="186" text-anchor="middle" fill="#b45309" font-family="'Times New Roman', Times, serif" font-size="13.5" font-weight="800" letter-spacing="1">GÜNEŞ</text>
  <text x="110" y="204" text-anchor="middle" fill="#64748b" font-family="'Times New Roman', Times, serif" font-size="10" font-weight="600">En Büyük (Yıldız)</text>
  <text x="315" y="186" text-anchor="middle" fill="#0369a1" font-family="'Times New Roman', Times, serif" font-size="13.5" font-weight="800" letter-spacing="1">DÜNYA</text>
  <text x="315" y="204" text-anchor="middle" fill="#64748b" font-family="'Times New Roman', Times, serif" font-size="10" font-weight="600">Orta Büyüklükte (Gezegen)</text>
  <text x="435" y="186" text-anchor="middle" fill="#334155" font-family="'Times New Roman', Times, serif" font-size="13.5" font-weight="800" letter-spacing="1">AY</text>
  <text x="435" y="204" text-anchor="middle" fill="#64748b" font-family="'Times New Roman', Times, serif" font-size="10" font-weight="600">En Küçük (Uydu)</text>
</svg>`;
  }

  if (isLightReflection && hasGunes && hasAy) {
    return `<svg viewBox="0 0 520 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <clipPath id="sunLightClip"><circle cx="410" cy="95" r="68"/></clipPath>
    <clipPath id="moonLightClip"><circle cx="110" cy="95" r="38"/></clipPath>
    <marker id="arrowLight" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#d97706"/>
    </marker>
  </defs>
  <rect x="0" y="0" width="520" height="220" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
  <line x1="335" y1="80" x2="155" y2="80" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#arrowLight)"/>
  <line x1="335" y1="95" x2="155" y2="95" stroke="#d97706" stroke-width="2.5" marker-end="url(#arrowLight)"/>
  <line x1="335" y1="110" x2="155" y2="110" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#arrowLight)"/>
  <rect x="195" y="83" width="110" height="24" rx="4" fill="#f8fafc" stroke="#cbd5e1"/>
  <text x="250" y="99" text-anchor="middle" fill="#b45309" font-family="'Times New Roman', Times, serif" font-size="10.5" font-weight="700">IŞIK IŞINLARI</text>
  <image href="/images/moon.jpg" xlink:href="/images/moon.jpg" x="72" y="57" width="76" height="76" clip-path="url(#moonLightClip)" preserveAspectRatio="xMidYMid slice"/>
  <circle cx="110" cy="95" r="38" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="110" y="186" text-anchor="middle" fill="#334155" font-family="'Times New Roman', Times, serif" font-size="13.5" font-weight="800" letter-spacing="1">AY</text>
  <text x="110" y="204" text-anchor="middle" fill="#64748b" font-family="'Times New Roman', Times, serif" font-size="10" font-weight="600">Işık Kaynağı Değil (Yansıtıcı)</text>
  <image href="/images/sun.jpg" xlink:href="/images/sun.jpg" x="342" y="27" width="136" height="136" clip-path="url(#sunLightClip)" preserveAspectRatio="xMidYMid slice"/>
  <circle cx="410" cy="95" r="68" fill="none" stroke="#f59e0b" stroke-width="2"/>
  <text x="410" y="186" text-anchor="middle" fill="#b45309" font-family="'Times New Roman', Times, serif" font-size="13.5" font-weight="800" letter-spacing="1">GÜNEŞ</text>
  <text x="410" y="204" text-anchor="middle" fill="#64748b" font-family="'Times New Roman', Times, serif" font-size="10" font-weight="600">Doğal Işık ve Isı Kaynağı</text>
</svg>`;
  }

  if (isShapeQuestion || (hasGunes && hasAy && !hasDunya)) {
    return `<svg viewBox="0 0 520 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <clipPath id="sunComp2Clip"><circle cx="145" cy="95" r="72"/></clipPath>
    <clipPath id="moonComp2Clip"><circle cx="375" cy="95" r="46"/></clipPath>
  </defs>
  <rect x="0" y="0" width="520" height="220" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
  <image href="/images/sun.jpg" xlink:href="/images/sun.jpg" x="73" y="23" width="144" height="144" clip-path="url(#sunComp2Clip)" preserveAspectRatio="xMidYMid slice"/>
  <circle cx="145" cy="95" r="72" fill="none" stroke="#f59e0b" stroke-width="2"/>
  <text x="145" y="186" text-anchor="middle" fill="#b45309" font-family="'Times New Roman', Times, serif" font-size="13.5" font-weight="800" letter-spacing="1">GÜNEŞ</text>
  <text x="145" y="204" text-anchor="middle" fill="#64748b" font-family="'Times New Roman', Times, serif" font-size="10" font-weight="600">Geometrik Şekil: Küre</text>
  <image href="/images/moon.jpg" xlink:href="/images/moon.jpg" x="329" y="49" width="92" height="92" clip-path="url(#moonComp2Clip)" preserveAspectRatio="xMidYMid slice"/>
  <circle cx="375" cy="95" r="46" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="375" y="186" text-anchor="middle" fill="#334155" font-family="'Times New Roman', Times, serif" font-size="13.5" font-weight="800" letter-spacing="1">AY</text>
  <text x="375" y="204" text-anchor="middle" fill="#64748b" font-family="'Times New Roman', Times, serif" font-size="10" font-weight="600">Geometrik Şekil: Küre</text>
</svg>`;
  }

  if (visual_svg) {
    return sanitizeToWhiteBackground(visual_svg);
  }

  return `<svg viewBox="0 0 520 180" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="520" height="180" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
  <circle cx="260" cy="75" r="40" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
  <text x="260" y="80" text-anchor="middle" fill="#0369a1" font-family="'Times New Roman', Times, serif" font-size="18" font-weight="700">🔬</text>
  <text x="260" y="145" text-anchor="middle" fill="#0f172a" font-family="'Times New Roman', Times, serif" font-size="13" font-weight="700">Fen Bilimleri Deney & Gözlem Şeması</text>
</svg>`;
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
      question_type = "multiple_choice"
    } = req.body || {};

    const outcomesList = Array.isArray(selected_outcomes) && selected_outcomes.length > 0
      ? selected_outcomes
      : (req.body && req.body.learning_outcome ? [req.body.learning_outcome] : []);

    if (outcomesList.length === 0) {
      return res.status(400).json({ error: "Lütfen en az bir öğrenme çıktısı seçiniz veya belirtiniz." });
    }

    const FALLBACK_KEY = Buffer.from("QVEuQWI4Uk42SVV1RzRyV25fS2VHb1VCcWxNR1UtVGpvdjZvTVdNYmN2eGt1OFNrSm1UZnc=", "base64").toString("utf8");
    const apiKey = (req.body && req.body.api_key && String(req.body.api_key).trim())
      || process.env.GEMINI_API_KEY
      || FALLBACK_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY ortam değişkeni tanımlanmamış." });
    }

    const outcomesText = outcomesList.map((o, idx) => `${idx + 1}. ${o}`).join('\n');

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

    const systemPrompt = `Sen Milli Eğitim Bakanlığı (MEB) müfredatına ve yeni nesil soru yazım standartlarına tam hakim, uzman bir ${grade}. Sınıf ${subject} soru yazarısın.
GÖREVİN:
Verilen sınıf seviyesi (${grade}. Sınıf), ders (${subject}), seçilen öğrenme çıktıları ve İSTENEN SORU TÜRÜNE UYGUN, görsel ve pedagojik kalitede sorular üretmek.

${typeSpecificInstructions}

GÖRSEL KURALLARI:
- Her soru için "visual_svg" alanında soruya ait bilimsel şekli veya deney düzeneğini gösteren GEÇERLİ bir inline SVG kodu üret.
- Arka plan mutlaka SAF BEYAZ (#ffffff) veya şeffaf olmalıdır. Siyah veya koyu zemin KESİNLİKLE YASAKTIR.
- Güneş, Dünya, Ay için /images/sun.jpg, /images/earth.jpg, /images/moon.jpg görsel dokuları kullanılabilir.

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
                parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
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

    const normalizedQuestions = questions.map((q, idx) => ({
      id: q.id || idx + 1,
      type: q.type || question_type || "multiple_choice",
      visual_svg: enhanceCelestialVisual(q.visual_svg || "", q.question || "", q.options || {}),
      grid_items: Array.isArray(q.grid_items) ? q.grid_items.map(cleanTurkishAndLatex) : [],
      question: cleanTurkishAndLatex(q.question || ""),
      options: q.options && Object.keys(q.options).length > 0 ? {
        A: cleanTurkishAndLatex(q.options?.A || ""),
        B: cleanTurkishAndLatex(q.options?.B || ""),
        C: cleanTurkishAndLatex(q.options?.C || ""),
        D: cleanTurkishAndLatex(q.options?.D || "")
      } : {},
      correct_answer: cleanTurkishAndLatex((q.correct_answer || "").trim()),
      learning_outcome: q.learning_outcome || outcomesList[0],
      difficulty: q.difficulty || difficulty,
      explanation: cleanTurkishAndLatex(q.explanation || "")
    }));

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
