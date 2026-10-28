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

// Soruya ait görseli güvenle zenginleştirir ve cevap sızıntılarını 100% temizler:
// 1. Görselde KESİNLİKLE hiçbir sorunun cevabı, kavram adı veya ipucu yazmaz.
// 2. Yalnızca soru ile ilgili gök cismi gösterilir (Güneş soruluyorsa Ay eklenmez).
// 3. Basit vektör daireler yerine NASA yüksek çözünürlüklü gerçek fotoğrafları kullanılır.
function enhanceCelestialVisual(visual_svg, question, options = {}, correctLetterOrText = '') {
  if (!visual_svg || typeof visual_svg !== 'string' || !visual_svg.includes('<svg')) return '';

  let svg = visual_svg;

  // Doğru cevabı ve soru metnini analiz et
  let correctText = '';
  if (options && correctLetterOrText && options[correctLetterOrText]) {
    correctText = String(options[correctLetterOrText] || '');
  } else if (correctLetterOrText) {
    correctText = String(correctLetterOrText || '');
  }
  const correctNorm = normTr(correctText);
  const qNorm = normTr(question);

  // Soru gök cisminin adını veya sınıfını mı soruyor? ("... gök cisminin adı nedir?", "... sınıfına girer?")
  const asksNameOrClass = /(ad[ıi]\s+(nedir|hangisidir)|hangisidir|hangi\s+(g[öo]k\s+cismi|y[ıi]ld[ıi]z|gezegen|uydu|evre|katman)|nas[ıi]l\s+adland[ıi]r[ıi]l[ıi]r|s[ıi]n[ıi]f[ıi]na\s+girer|ne\s+ad\s+verilir|nedir\s*\?)/i.test(question || '');

  // Soru geometrik şekli mi soruyor?
  const asksShape = /(geometrik\s+sekil|sekli\s+nedir|hangi\s+sekil|sekli\s+hangi)/i.test(qNorm);

  // Asla görselde yer almaması gereken cevap sızıntısı kelimeleri
  const bannedKeywords = [
    'küre', 'kuresel', 'yıldız', 'yildiz', 'ışık kaynağı değil', 'isik kaynagi degil',
    'ışık kaynağı', 'isik kaynagi', 'doğal ışık ve ısı kaynağı', 'doğal uydu', 'dogal uydu',
    'geometrik şekil', 'en büyük', 'en kücük', 'orta büyüklükte', 'krater', 'kraterler',
    'kratersiz', 'atmosfer yok', 'su yok', 'toz tabakası', 'regolit', 'gaz küresi'
  ];

  if (correctNorm && correctNorm.length >= 2) {
    bannedKeywords.push(correctNorm);
    correctNorm.split(' ').forEach(w => {
      if (w.length >= 3) bannedKeywords.push(w);
    });
  }

  // Eğer soru adı/türü soruyorsa gök cisimlerinin adları da etikette YER ALAMAZ!
  if (asksNameOrClass) {
    bannedKeywords.push('güneş', 'gunes', 'dünya', 'dunya', 'ay');
  }

  // 1) SVG içindeki metin etiketlerini kontrol et; cevap sızdıranları veya karşılaştırma işaretlerini '?' yap
  svg = svg.replace(/<text([^>]*)>([\s\S]*?)<\/text>/gi, (m, attrs, inner) => {
    const rawClean = inner.replace(/<[^>]+>/g, '').trim();
    const inNorm = normTr(rawClean);

    // Tek başına karşılaştırma operatörleri (>, <, >=, <=) cevap sızdırdığı için '?' yapılır
    if (/^[><=≥≤]+$/.test(rawClean.trim()) || rawClean.trim() === '&gt;' || rawClean.trim() === '&lt;') {
      return '<text' + attrs + '>?</text>';
    }

    if (asksShape && inNorm.includes('kure')) {
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

  // 2) SADECE SORULAN GÖK CİSMİ GÖSTERİLMELİDİR
  // Soru yalnızca Güneş'i soruyorsa ve görselde hem Ay hem Güneş varsa, sadece Güneş gösterilsin
  const mentionsSunOnly = (qNorm.includes('gunes') || correctNorm.includes('gunes')) && !qNorm.includes('ay') && !qNorm.includes('dunya') && !qNorm.includes('karsilastir');
  const mentionsMoonOnly = (qNorm.includes('ay') || correctNorm.includes('ay')) && !qNorm.includes('gunes') && !qNorm.includes('dunya') && !qNorm.includes('karsilastir');

  if (mentionsSunOnly && svg.includes('/images/moon.jpg')) {
    const clipId = 'sunCleanClip_' + Math.random().toString(36).slice(2, 7);
    svg = `<svg viewBox="0 0 520 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
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
  } else if (mentionsMoonOnly && svg.includes('/images/sun.jpg')) {
    const clipId = 'moonCleanClip_' + Math.random().toString(36).slice(2, 7);
    svg = `<svg viewBox="0 0 520 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <clipPath id="${clipId}"><circle cx="260" cy="95" r="68"/></clipPath>
  </defs>
  <rect x="0" y="0" width="520" height="220" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
  <image href="/images/moon.jpg" xlink:href="/images/moon.jpg" x="192" y="27" width="136" height="136" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice"/>
  <circle cx="260" cy="95" r="68" fill="none" stroke="#94a3b8" stroke-width="2"/>
  <text x="260" y="190" text-anchor="middle" fill="#0f172a" font-family="'Times New Roman', Times, serif" font-size="14" font-weight="700">${asksNameOrClass ? '?' : 'Ay'}</text>
</svg>`;
  }

  // 3) GERÇEK FOTOĞRAF KULLANIMI: Eğer SVG'de <image> etiketi yoksa ve düz renkli vektör çemberler çizilmişse gerçek fotoğraflarla donat
  if (!svg.includes('<image')) {
    if (qNorm.includes('gunes') && !qNorm.includes('ay')) {
      const clipId = 'sunAutoClip_' + Math.random().toString(36).slice(2, 7);
      svg = `<svg viewBox="0 0 520 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
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
    } else if (qNorm.includes('ay') && !qNorm.includes('gunes')) {
      const clipId = 'moonAutoClip_' + Math.random().toString(36).slice(2, 7);
      svg = `<svg viewBox="0 0 520 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <clipPath id="${clipId}"><circle cx="260" cy="95" r="68"/></clipPath>
  </defs>
  <rect x="0" y="0" width="520" height="220" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
  <image href="/images/moon.jpg" xlink:href="/images/moon.jpg" x="192" y="27" width="136" height="136" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice"/>
  <circle cx="260" cy="95" r="68" fill="none" stroke="#94a3b8" stroke-width="2"/>
  <text x="260" y="190" text-anchor="middle" fill="#0f172a" font-family="'Times New Roman', Times, serif" font-size="14" font-weight="700">${asksNameOrClass ? '?' : 'Ay'}</text>
</svg>`;
    } else if (qNorm.includes('dunya') && !qNorm.includes('gunes') && !qNorm.includes('ay')) {
      const clipId = 'earthAutoClip_' + Math.random().toString(36).slice(2, 7);
      svg = `<svg viewBox="0 0 520 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
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
