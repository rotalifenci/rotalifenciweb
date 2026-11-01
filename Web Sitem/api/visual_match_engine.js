/**
 * Rotalı Fenci - Soru–Görsel Eşleştirme ve Doğrulama Motoru (Visual Match Engine)
 * MEB ve Türkiye Yüzyılı Maarif Modeli Standartları
 */

(function (global) {
  'use strict';

  function normalizeText(str) {
    return String(str || '')
      .toLocaleLowerCase('tr-TR')
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/<[^>]+>/g, ' ')
      .replace(/[^a-z0-9 ]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function hasWord(normText, word) {
    const normWord = normalizeText(word);
    const regex = new RegExp(`(^|\\s)${normWord}(\\s|$)`);
    return regex.test(normText);
  }

  function makeImg(src, alt) {
    return `<img src="${src}" alt="${alt}" class="rf-science-img" style="max-width:100%; max-height:48vh; object-fit:contain; border-radius:12px; box-shadow:0 4px 14px rgba(0,0,0,0.08);">`;
  }

  function stripObserverPhrases(normText) {
    let clean = normText;
    clean = clean.replace(/dunya dan (bakildiginda|gorulen|gorunen|cok kucuk|kucuk gorunmesinin|gozlemlenen)/g, ' ');
    clean = clean.replace(/dunyadan (bakildiginda|gorulen|gorunen|cok kucuk|kucuk gorunmesinin|gozlemlenen)/g, ' ');
    clean = clean.replace(/dunya uzerinden (bakildiginda|gozlemlenen)/g, ' ');
    clean = clean.replace(/teleskopla (bakildiginda|incelendiginde|gozlemlendiginde|gorulen)/g, ' ');
    clean = clean.replace(/teleskop ile (bakildiginda|incelendiginde)/g, ' ');
    return clean.replace(/\s+/g, ' ').trim();
  }

  function generateVisualBrief(questionText, options = {}, correctAnswer = '', extraMeta = {}) {
    const qNorm = normalizeText(questionText);
    const cNorm = normalizeText(correctAnswer);
    const qClean = stripObserverPhrases(qNorm);

    const hasQuestionMark = qNorm.includes('soru isareti') || qNorm.includes(' ? ') || qNorm.includes('(?)');
    const hasNumbers = qNorm.includes('numaralandirilmis') || (qNorm.includes('1 ') && qNorm.includes('2 ') && qNorm.includes('3 '));
    const hasLetters = (qNorm.includes('g d a') || (qNorm.includes('gunes g') && qNorm.includes('dunya d')));

    let coreConcept = 'Genel Fen Bilimleri';
    let visualType = 'scientific_model';
    let requiredElements = [];
    let prohibitedElements = ['Cevap sızıntısı', 'Alakasız dekoratif stok görsel'];
    let pedagogicalGoal = 'Kavramsal anlama ve bilimsel süreç becerisi';
    let assetPath = '';
    let assetAlt = '';

    // 1. YAPAY UYDU & UZAY ARAŞTIRMALARI
    if (
      (qNorm.includes('dunya etrafinda dolanan') && (qNorm.includes('arac') || qNorm.includes('uydu'))) ||
      (qNorm.includes('insan yapimi') && (qNorm.includes('arac') || qNorm.includes('uydu'))) ||
      qNorm.includes('yapay uydu') || qNorm.includes('turksat') || qNorm.includes('gokturk') || qNorm.includes('imece') ||
      (qNorm.includes('uydu') && !qNorm.includes('dogal uydu') && !hasWord(qClean, 'ay'))
    ) {
      coreConcept = 'Yapay Uydu ve Yörünge Teknolojisi';
      visualType = hasQuestionMark ? 'annotated_model' : 'realistic_photo';
      if (hasQuestionMark) {
        requiredElements = ['Dünya küresi', 'Yörünge çizgisi', 'Güneş panelli uydu', '(?) Soru işareti rozeti'];
        assetPath = '/assets/science/yapay_uydu_soru_isareti.svg';
        assetAlt = 'Dünya Yörüngesinde Soru İşaretli (?) İnsan Yapımı Uydu Modeli';
      } else {
        requiredElements = ['Dünya yörüngesinde yapay uydu', 'Güneş panelleri'];
        assetPath = '/assets/science/satellite_orbit.jpg';
        assetAlt = 'Dünya Yörüngesinde Yapay Uydu';
      }
      pedagogicalGoal = 'Öğrencinin yapay uydunun tanımını, yapısını ve işlevlerini kavraması';
    }
    // 2. TUTULMALAR: GÜNEŞ TUTULMASI & NUMARALANDIRILMIŞ MODEL (1, 2, 3)
    else if (
      (qNorm.includes('numaralandirilmis') && (qNorm.includes('tutulma') || qNorm.includes('golge') || qNorm.includes('dizilim') || qNorm.includes('gok cisim') || qNorm.includes('konumlari'))) ||
      (qNorm.includes('2 numarali') && qNorm.includes('3 numarali')) ||
      (qNorm.includes('gunes tutulma') && (hasNumbers || qNorm.includes('model') || qNorm.includes('dizilim') || qNorm.includes('siralanis'))) ||
      (hasNumbers && qNorm.includes('dunya') && qNorm.includes('ay') && qNorm.includes('gunes'))
    ) {
      coreConcept = 'Güneş Tutulması Modeli';
      visualType = 'schematic_diagram';
      requiredElements = ['1: Güneş (Işık kaynağı)', '2: Ay (Opak engel)', '3: Dünya (Gölge alanı)', 'Işık ışınları'];
      prohibitedElements.push('Ay tutulması şeması', 'Gerçek dışı boyut oranları');
      assetPath = '/assets/science/gunes_tutulmasi_123.svg';
      assetAlt = 'Güneş Tutulması Bilimsel Modeli (1: Güneş, 2: Ay, 3: Dünya)';
      pedagogicalGoal = 'Güneş tutulmasında gök cisimlerinin sıralanışını ve gölge oluşumunu açıklama';
    }
    // 3. TUTULMALAR: AY TUTULMASI (G, D, A Modeli)
    else if (
      hasLetters ||
      (qNorm.includes('ay tutulma') && (qNorm.includes('dolunay') || qNorm.includes('gda') || qNorm.includes('dizilim') || qNorm.includes('konum') || qNorm.includes('gece'))) ||
      (qNorm.includes('ay tutulmasi bilimsel modeli'))
    ) {
      coreConcept = 'Ay Tutulması Modeli';
      visualType = 'schematic_diagram';
      requiredElements = ['G (Güneş)', 'D (Dünya)', 'A (Ay)', 'Tam gölge konisi', 'Dolunay evresi konumu'];
      prohibitedElements.push('Güneş tutulması sıralaması');
      assetPath = '/assets/science/ay_tutulmasi_gda.svg';
      assetAlt = 'Ay Tutulması Bilimsel Modeli (G: Güneş, D: Dünya, A: Ay)';
      pedagogicalGoal = "Ay tutulmasının mekanizmasını ve Dünya'nın tam gölgesinde kalan Ay'ı inceleme";
    }
    // 4. TUTULMALARDA X / Y BİLİNMEYENİ
    else if (qNorm.includes('x ile gosterilen') && (qNorm.includes('tutulma') || qNorm.includes('golge'))) {
      coreConcept = 'Ay Tutulmasında Bilinmeyen Gök Cismi (X)';
      visualType = 'schematic_diagram';
      assetPath = '/assets/science/ay_tutulmasi_x.svg';
      assetAlt = 'Ay Tutulması Modeli (Dünya Gölgesindeki X Gök Cismi)';
    } else if (qNorm.includes('y ile gosterilen') && (qNorm.includes('tutulma') || qNorm.includes('golge'))) {
      coreConcept = 'Güneş Tutulmasında Bilinmeyen Gök Cismi (Y)';
      visualType = 'schematic_diagram';
      assetPath = '/assets/science/gunes_tutulmasi_y.svg';
      assetAlt = 'Güneş Tutulması Modeli (Gölgesi Düşen Y Gök Cismi)';
    }
    // 5. GÖK CİSMİ TANIMA SORULARI (Soru İşaretli (?) Güneş veya Ay)
    else if (
      hasQuestionMark &&
      (qNorm.includes('gok cisminin ne oldugu') || qNorm.includes('gok cismi soru isareti') || qNorm.includes('geometrik sekli ve temel'))
    ) {
      const isSun = cNorm.includes('gunes') || qNorm.includes('isi ve isik') || qNorm.includes('yildiz');
      if (isSun) {
        coreConcept = "Güneş'in Küresel Yapısı ve Temel Özellikleri";
        visualType = 'annotated_model';
        requiredElements = ['Küresel parlak gök cismi', 'Isı ve ışık dalgaları', '(?) Soru işareti'];
        prohibitedElements.push('Dünya görseli', 'Ay kraterleri');
        assetPath = '/assets/science/gok_cismi_soru_isareti_gunes.svg';
        assetAlt = 'Güneş Bilimsel İnceleme Modeli (?)';
      } else {
        coreConcept = "Ay'ın Küresel Yapısı ve Temel Özellikleri";
        visualType = 'annotated_model';
        requiredElements = ['Kraterli küresel gök cismi', '(?) Soru işareti'];
        prohibitedElements.push('Güneş ışınları');
        assetPath = '/assets/science/gok_cismi_soru_isareti_ay.svg';
        assetAlt = 'Ay Bilimsel İnceleme Modeli (?)';
      }
    }
    // 6. AY KRATERLERİ & TELESKOPLA GÖZLEM
    else if (
      (qClean.includes('krater') || qClean.includes('cukurlar') || (qNorm.includes('cukurlar') && qNorm.includes('teleskopla'))) &&
      (cNorm.includes('ay') || qClean.includes('isik kaynagi olmadigi') || qClean.includes('ay'))
    ) {
      coreConcept = "Ay'ın Kraterli Yüzey Yapısı";
      visualType = 'realistic_photo';
      requiredElements = ['Ay yüzeyi', 'Meteor kraterleri ve çukurlar'];
      prohibitedElements.push('Teleskop binası', 'Optik tüp');
      assetPath = '/assets/slides/slide_18_krater_detay.jpg';
      assetAlt = 'Ay Yüzeyindeki Kraterler ve Çukurlar';
      pedagogicalGoal = "Ay'ın yüzeyindeki çukurların oluşumunu ve meteor çarpmalarını analiz etme";
    }
    // 7. GÖZLEMEVİ / RASATHANE
    else if (
      qClean.includes('gozlemevi') || qClean.includes('rasathane') ||
      (qClean.includes('daglarin yuksek zirve') && qClean.includes('aynali')) ||
      (qClean.includes('isik kirlilig') && qClean.includes('dag'))
    ) {
      coreConcept = 'Gözlemevi (Rasathane) Konumu ve Yapısı';
      visualType = 'realistic_photo';
      assetPath = '/assets/science/observatory_dome.jpg';
      assetAlt = 'Astronomik Gözlemevi (Rasathane)';
    }
    // 8. UZAY İSTASYONU (ISS)
    else if (
      qClean.includes('iss') || qClean.includes('istasyon') ||
      (qClean.includes('insanlarin icinde yasayip') && qClean.includes('laboratuvar'))
    ) {
      coreConcept = 'Uluslararası Uzay İstasyonu (ISS)';
      visualType = 'realistic_photo';
      assetPath = '/assets/science/iss_space_station.jpg';
      assetAlt = 'Uluslararası Uzay İstasyonu (ISS)';
    }
    // 9. UZAY TELESKOBU
    else if (
      qClean.includes('uzay teleskob') || qClean.includes('hubble') || qClean.includes('james webb') ||
      (qClean.includes('teleskop') && (qClean.includes('ayna ve mercek') || qClean.includes('optik')))
    ) {
      coreConcept = 'Uzay Teleskobu ve Optik Gözlem Araçları';
      visualType = 'realistic_photo';
      assetPath = '/assets/science/space_telescope.jpg';
      assetAlt = 'Gelişmiş Uzay Teleskobu';
    }
    // 10. AY'IN EVRELERİ
    else if (qClean.includes('ilk dordun') || (qClean.includes('sag yarisi aydinlik') && hasWord(qClean, 'ay'))) {
      coreConcept = "Ay'ın İlk Dördün Evresi";
      assetPath = '/assets/slides/slide_29_ilk_dordun.jpg';
      assetAlt = "Ay'ın İlk Dördün Evresi (D Harfi Görünümü)";
    } else if (qClean.includes('son dordun') || (qClean.includes('sol yarisi aydinlik') && hasWord(qClean, 'ay'))) {
      coreConcept = "Ay'ın Son Dördün Evresi";
      assetPath = '/assets/slides/slide_31_son_dordun.jpg';
      assetAlt = "Ay'ın Son Dördün Evresi (Ters D Görünümü)";
    } else if (qClean.includes('dolunay')) {
      coreConcept = "Ay'ın Dolunay Evresi";
      assetPath = '/assets/slides/slide_30_dolunay.jpg';
      assetAlt = "Ay'ın Dolunay Evresi";
    } else if (qClean.includes('yeni ay')) {
      coreConcept = "Ay'ın Yeni Ay Evresi";
      assetPath = '/assets/slides/slide_28_yeni_ay.jpg';
      assetAlt = "Ay'ın Yeni Ay Evresi";
    }
    // 11. DİNAMOMETRE & KUVVET
    else if (qClean.includes('dinamometre') || (qClean.includes('kuvvet') && qClean.includes('yay'))) {
      coreConcept = 'Dinamometre ile Kuvvet Ölçümü';
      visualType = 'scientific_model';
      assetPath = '/assets/science/dynamometer.jpg';
      assetAlt = 'Hassas Dinamometre (Kuvvet Ölçer)';
    }
    // 12. ELEKTRİK DEVRELERİ
    else if (
      (hasWord(qClean, 'devre') || hasWord(qClean, 'devresi')) &&
      (qClean.includes('ampul') || qClean.includes('pil') || qClean.includes('anahtar'))
    ) {
      coreConcept = 'Basit Elektrik Devresi';
      visualType = 'scientific_model';
      assetPath = '/assets/science/electric_circuit.jpg';
      assetAlt = 'Elektrik Devresi Deney Seti';
    }
    // 13. HÜCRE VE ORGANELLER
    else if (qClean.includes('hucre') || qClean.includes('mitokondri') || qClean.includes('kloroplast')) {
      coreConcept = 'Hücre ve Organeller';
      visualType = 'scientific_model';
      assetPath = '/assets/science/cell_structure.jpg';
      assetAlt = 'Bitki ve Hayvan Hücresi Karşılaştırmalı Modeli';
    }
    // 14. DNA VE GENETİK KOD
    else if (qClean.includes('dna') || qClean.includes('nukleotid') || qClean.includes('kromozom')) {
      coreConcept = 'DNA Çift Sarmalı ve Genetik Yapı';
      visualType = 'scientific_model';
      assetPath = '/assets/science/dna_structure.jpg';
      assetAlt = 'DNA Çift Sarmalı Modeli';
    }
    // 15. DÜNYA KÜRESİ
    else if (
      hasWord(qClean, 'dunya') &&
      !qClean.includes('gunes') && !hasWord(qClean, 'ay') &&
      (qClean.includes('katman') || qClean.includes('atmosfer') || qClean.includes('mavi gezegen'))
    ) {
      coreConcept = 'Dünya Gezegeni ve Katmanları';
      assetPath = '/assets/slides/slide_4_earth_globe.jpg';
      assetAlt = 'Dünya Gezegeni Küresi';
    }
    // 16. GÜNEŞ KÜRESİ
    else if (qClean.includes('gunes') && !hasWord(qClean, 'ay')) {
      coreConcept = "Güneş'in Küresel Yapısı";
      assetPath = '/images/sun.jpg';
      assetAlt = 'Güneş Küresi';
    }
    // 17. AY KÜRESİ
    else if (hasWord(qClean, 'ay') && !qClean.includes('gunes')) {
      coreConcept = "Ay'ın Küresel Yapısı";
      assetPath = '/assets/slides/slide_16_moon_globe.jpg';
      assetAlt = 'Ay Küresi';
    }
    // Varsayılan Derin Uzay
    else {
      coreConcept = 'Evren ve Fen Bilimleri İnceleme Alanı';
      assetPath = '/assets/slides/slide_3_universe_space.jpg';
      assetAlt = 'Bilimsel Uzay ve Fen İnceleme Modeli';
    }

    return {
      coreConcept,
      visualType,
      hasQuestionMark,
      hasNumbers,
      hasLetters,
      requiredElements,
      prohibitedElements,
      pedagogicalGoal,
      assetPath,
      assetAlt,
      renderedHtml: assetPath ? makeImg(assetPath, assetAlt) : ''
    };
  }

  function checkVisualCompatibility(questionText, currentVisualHtml = '', correctAnswer = '') {
    const brief = generateVisualBrief(questionText, {}, correctAnswer);
    const cur = String(currentVisualHtml || '');

    // 1. Soru işareti uyumsuzluğu
    if (brief.hasQuestionMark && !cur.includes('soru_isareti') && !cur.includes('?')) {
      return {
        isCompatible: false,
        reason: "Soru kökünde 'soru işareti (?)' belirtilmiş ancak görsel üzerinde soru işareti veya hedef etiketi bulunmuyor.",
        recommendedVisual: brief.renderedHtml,
        brief
      };
    }

    // 2. Numaralandırma uyumsuzluğu
    if (brief.hasNumbers && !cur.includes('123') && !cur.includes('numaralandirilmis')) {
      return {
        isCompatible: false,
        reason: "Soru kökünde 'numaralandırılmış gök cisimleri' belirtilmiş ancak görselde 1, 2, 3 şeması yer almıyor.",
        recommendedVisual: brief.renderedHtml,
        brief
      };
    }

    // 3. Güneş Tutulması vs Ay Tutulması Çapraz Uyumsuzluğu
    if (brief.assetPath.includes('ay_tutulmasi') && cur.includes('gunes_tutulmasi')) {
      return {
        isCompatible: false,
        reason: 'Soru Ay tutulmasını konu alıyor ancak mevcut görselde Güneş tutulması modeli bulunuyor.',
        recommendedVisual: brief.renderedHtml,
        brief
      };
    }

    if (brief.assetPath.includes('gunes_tutulmasi') && cur.includes('ay_tutulmasi')) {
      return {
        isCompatible: false,
        reason: 'Soru Güneş tutulmasını konu alıyor ancak mevcut görselde Ay tutulması modeli bulunuyor.',
        recommendedVisual: brief.renderedHtml,
        brief
      };
    }

    // 4. Kavram Çapraz Uyumsuzlukları (Ay kraterine teleskop, Güneş sorusuna Dünya atanması vb.)
    if (brief.coreConcept.includes("Ay'ın Kraterli") && cur.includes('space_telescope')) {
      return {
        isCompatible: false,
        reason: 'Soru Ay yüzeyindeki çukurları ölçüyor ancak görselde gök cismi yerine teleskop aracı bulunuyor.',
        recommendedVisual: brief.renderedHtml,
        brief
      };
    }

    if (brief.coreConcept.includes("Güneş'in Küresel") && cur.includes('earth_globe')) {
      return {
        isCompatible: false,
        reason: "Soru Güneş'i ölçüyor ancak 'Dünya'dan küçük görünen' ifadesi nedeniyle yanlışlıkla Dünya görseli atanmış.",
        recommendedVisual: brief.renderedHtml,
        brief
      };
    }

    return {
      isCompatible: true,
      reason: 'Soru ile görsel konu, kavram ve pedagojik işaretler bakımından tam uyumludur.',
      recommendedVisual: cur || brief.renderedHtml,
      brief
    };
  }

  function getHarmonizedVisual(questionText, options = {}, correctAnswer = '', currentVisual = '') {
    const brief = generateVisualBrief(questionText, options, correctAnswer);
    const check = checkVisualCompatibility(questionText, currentVisual, correctAnswer);
    if (check.isCompatible && currentVisual && (currentVisual.includes('<img') || currentVisual.includes('<svg'))) {
      return currentVisual;
    }
    return brief.renderedHtml;
  }

  const api = {
    normalizeText,
    hasWord,
    makeImg,
    stripObserverPhrases,
    generateVisualBrief,
    checkVisualCompatibility,
    getHarmonizedVisual
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  if (typeof window !== 'undefined') {
    window.visualMatchEngine = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
