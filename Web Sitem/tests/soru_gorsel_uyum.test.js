const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const visualEngine = require('../js/visual_match_engine.js');
const { QuestionPreparationEngine } = require('../js/question_preparation_state.js');

describe('🎯 Rotalı Fenci - Soru–Görsel Eşleştirme ve Uyum Test Paketi', () => {

  it('1. Soru işareti (?) içeren soruda mutlaka (?) etiketli model seçilmeli (Yapay Uydu)', () => {
    const qText = 'Yandaki görselde Dünya etrafında dolanan insan yapımı bir araç soru işareti (?) ile gösterilmiştir. Bu araç türünün görevlerini açıklayınız.';
    const brief = visualEngine.generateVisualBrief(qText);

    assert.equal(brief.hasQuestionMark, true, 'Soru işareti bayrağı true olmalı');
    assert.match(brief.assetPath, /yapay_uydu_soru_isareti\.svg$/, 'Yapay uydu (?) modeli atanmalı');
    assert.match(brief.assetAlt, /\(\?\)/, 'Görsel alternatif metninde (?) yer almalı');
  });

  it('2. Gözlemci kelimeleri (Dünya\'dan bakıldığında) soru konusunu saptırmamalı (Güneş sorusu)', () => {
    const qText = 'Yanda geometrik şekli ve temel özelliklerinden biri soru işareti ile belirtilen gök cisminin ne olduğunu ve Dünya\'dan çok küçük görünmesinin temel sebebini açıklayınız.';
    const brief = visualEngine.generateVisualBrief(qText, {}, 'Güneş');

    assert.match(brief.assetPath, /gok_cismi_soru_isareti_gunes\.svg$/, 'Dünya kelimesi geçmesine rağmen Güneş modeli seçilmeli');
    assert.doesNotMatch(brief.assetPath, /earth_globe/, 'Güneş sorusuna Dünya küresi atanmamalı');
  });

  it('3. Gözlemci araçları (teleskopla bakıldığında) soru konusunu saptırmamalı (Ay kraterleri)', () => {
    const qText = 'Geometrik şekli küreye benzeyen bu gök cismi üzerine teleskopla bakıldığında yüzeyinde çukurlar olduğu görülür. Gece parlak görünme nedenini açıklayınız.';
    const brief = visualEngine.generateVisualBrief(qText, {}, 'Ay');

    assert.match(brief.assetPath, /slide_18_krater_detay\.jpg$/, 'Teleskop geçmesine rağmen Ay kraterleri görseli seçilmeli');
    assert.doesNotMatch(brief.assetPath, /space_telescope/, 'Ay kraterleri sorusuna uzay teleskobu atanmamalı');
  });

  it('4. Numaralandırılmış (1, 2, 3) sorularda doğrudan numaralandırılmış model şeması bağlanmalı', () => {
    const qText = 'Yandaki modelde numaralandırılmış gök cisimlerinin isimlerini yazarak bu dizilimin hangi doğa olayını temsil ettiğini (1: Güneş, 2: Ay, 3: Dünya) açıklayınız.';
    const brief = visualEngine.generateVisualBrief(qText);

    assert.equal(brief.hasNumbers, true, 'Numaralandırma bayrağı true olmalı');
    assert.match(brief.assetPath, /gunes_tutulmasi_123\.svg$/, 'Güneş tutulması 1, 2, 3 modeli atanmalı');
  });

  it('5. Harfli (G, D, A) modellerde birebir harfli Ay tutulması şeması bağlanmalı', () => {
    const qText = 'Yanda Güneş (G), Dünya (D) ve Ay (A) konumları verilmiştir. Bu dizilim gerçekleştiğinde Dünya\'dan gözlenen olayı açıklayınız.';
    const brief = visualEngine.generateVisualBrief(qText);

    assert.equal(brief.hasLetters, true, 'Harf dizilimi bayrağı true olmalı');
    assert.match(brief.assetPath, /ay_tutulmasi_gda\.svg$/, 'G, D, A harfli Ay tutulması şeması seçilmeli');
  });

  it('6. Soru-görsel uyumsuzluğu (Mismatch) otomatik tespit edilmeli', () => {
    const qText = 'Yandaki görselde Dünya etrafında dolanan araç soru işareti (?) ile gösterilmiştir.';
    const plainPhoto = '<img src="/assets/science/satellite_orbit.jpg" alt="Düz Uydu">';

    const check = visualEngine.checkVisualCompatibility(qText, plainPhoto);
    assert.equal(check.isCompatible, false, 'Düz fotoğraf (?) sorusuna uyumsuz sayılmalı');
    assert.match(check.reason, /soru işareti \(\?\)/, 'Uyumsuzluk sebebi net açıklanmalı');
    assert.match(check.recommendedVisual, /yapay_uydu_soru_isareti\.svg/, 'Önerilen görsel (?) modeli olmalı');
  });

  it('7. Soru metni güncellendiğinde (Edit) görsel otomatik yeni kavrama uyarlanmalı', () => {
    let questionText = 'Güneş tutulmasında 1, 2, 3 numaralı dizilimi açıklayınız.';
    let currentVisual = visualEngine.getHarmonizedVisual(questionText);
    assert.match(currentVisual, /gunes_tutulmasi_123\.svg/);

    // Öğretmen soruyu Ay Tutulması G, D, A ile değiştirdi
    questionText = 'Yanda Güneş (G), Dünya (D) ve Ay (A) konumları verilmiştir.';
    const check = visualEngine.checkVisualCompatibility(questionText, currentVisual);
    assert.equal(check.isCompatible, false, 'Eski Güneş tutulması görseli yeni Ay tutulması metnine uyumsuz olmalı');

    const updatedVisual = visualEngine.getHarmonizedVisual(questionText, {}, '', currentVisual);
    assert.match(updatedVisual, /ay_tutulmasi_gda\.svg/, 'Yeni soru metnine uygun Ay tutulması görseli atanmalı');
  });

  it('8. Çoktan Seçmeli ve Açık Uçlu soru tiplerinde pedagojik görsel ayrımı korunmalı', () => {
    const mcQuestion = 'Aşağıdaki yapay uydulardan hangisi ülkemizin aktif haberleşme uydusudur?';
    const mcBrief = visualEngine.generateVisualBrief(mcQuestion);
    assert.equal(mcBrief.hasQuestionMark, false);
    assert.match(mcBrief.assetPath, /satellite_orbit\.jpg/, 'Çoktan seçmeli genel soruda gerçek uydu fotoğrafı kullanılır');

    const oeQuestion = 'Yandaki modelde soru işareti (?) ile gösterilen uydunun görevini açıklayınız.';
    const oeBrief = visualEngine.generateVisualBrief(oeQuestion);
    assert.equal(oeBrief.hasQuestionMark, true);
    assert.match(oeBrief.assetPath, /yapay_uydu_soru_isareti\.svg/, 'Açık uçlu analiz sorusunda soru işaretli pedagojik model kullanılır');
  });

  it('9. Tek dosya ve ayrı dosya çıktı paketlerinde görseller sorularla birlikte eksiksiz korunmalı', () => {
    const engine = new QuestionPreparationEngine();
    engine.setTypeEnabled('multiple_choice', true);
    engine.setTypeCount('multiple_choice', 2);

    const questionsWithVisuals = [
      { id: 1, question: 'Soru 1', visual_svg: '<img src="/assets/science/yapay_uydu_soru_isareti.svg">' },
      { id: 2, question: 'Soru 2', visual_svg: '<img src="/assets/science/gunes_tutulmasi_123.svg">' }
    ];

    engine.saveBatch('multiple_choice', {
      type: 'multiple_choice',
      label: 'Çoktan Seçmeli',
      questions: questionsWithVisuals,
      smartTitle: 'Test No: 1'
    });

    const payloads = engine.buildPublishPayloads({ grade: '7', unit: 'Güneş Sistemi' });
    assert.equal(payloads.length, 1);
    assert.equal(payloads[0].questions[0].visual_svg, '<img src="/assets/science/yapay_uydu_soru_isareti.svg">');
    assert.equal(payloads[0].questions[1].visual_svg, '<img src="/assets/science/gunes_tutulmasi_123.svg">');
  });

  it('10. Alakasız genel stok görseller yerine soru bağlamına özel odaklanmış modeller kullanılmalı', () => {
    const issQuestion = 'Uluslararası Uzay İstasyonu (ISS) astronotların içinde kaldığı laboratuvardır.';
    const issBrief = visualEngine.generateVisualBrief(issQuestion);
    assert.match(issBrief.assetPath, /iss_space_station\.jpg/, 'ISS sorusuna özel uzay istasyonu görseli bağlanmalı');
    assert.doesNotMatch(issBrief.assetPath, /slide_3_universe_space/, 'Genel uzay stok fotoğrafı kullanılmamalı');
  });

});
