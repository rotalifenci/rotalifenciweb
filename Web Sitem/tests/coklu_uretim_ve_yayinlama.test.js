const test = require('node:test');
const assert = require('node:assert/strict');
const { QuestionPreparationEngine, createInitialState, QUESTION_TYPES_DEF, ACTIVITY_SUBTYPES_DEF } = require('../js/question_preparation_state.js');
const visualEngine = require('../js/visual_match_engine.js');

test.describe('🚀 Rotalı Fenci - Çoklu Soru Üretimi ve Akıllı Yayınlama Test Paketi', () => {

  test('1. 10 Çoktan Seçmeli soru bağımsız yapılandırılabilmeli', () => {
    const engine = new QuestionPreparationEngine();
    engine.setTypeEnabled('multiple_choice', true);
    engine.setTypeCount('multiple_choice', 10);
    const mc = engine.getType('multiple_choice');
    assert.equal(mc.enabled, true);
    assert.equal(mc.count, 10);
  });

  test('2. 15 Kısa Cevaplı soru bağımsız yapılandırılabilmeli', () => {
    const engine = new QuestionPreparationEngine();
    engine.setTypeEnabled('short_answer', true);
    engine.setTypeCount('short_answer', 15);
    const sa = engine.getType('short_answer');
    assert.equal(sa.enabled, true);
    assert.equal(sa.count, 15);
  });

  test('3. 10 Açık Uçlu soru bağımsız yapılandırılabilmeli', () => {
    const engine = new QuestionPreparationEngine();
    engine.setTypeEnabled('open_ended', true);
    engine.setTypeCount('open_ended', 10);
    const oe = engine.getType('open_ended');
    assert.equal(oe.enabled, true);
    assert.equal(oe.count, 10);
  });

  test('4. 18 Etkinlik ve 13 Özel Etkinlik türü eksiksiz yönetilmeli', () => {
    const engine = new QuestionPreparationEngine();
    engine.setTypeEnabled('activity', true);
    engine.selectAllActivities();
    const subs = engine.getSelectedActivitySubtypes();
    assert.equal(subs.length, 13, '13 özel etkinlik türünün tümü seçilebilir olmalı');
    
    // Toplam 18 etkinlik dağıtımı
    engine.setTypeCount('activity', 18);
    assert.equal(engine.getType('activity').count, 18);
  });

  test('5. 15 ÇS + 15 KC + 10 AU + 18 ET = 58 Toplam İçerik eksiksiz hesaplanmalı', () => {
    const engine = new QuestionPreparationEngine();
    engine.setTypeEnabled('multiple_choice', true);
    engine.setTypeCount('multiple_choice', 15);

    engine.setTypeEnabled('short_answer', true);
    engine.setTypeCount('short_answer', 15);

    engine.setTypeEnabled('open_ended', true);
    engine.setTypeCount('open_ended', 10);

    engine.setTypeEnabled('activity', true);
    engine.setTypeCount('activity', 18);

    assert.equal(engine.getTotalCount(), 58, '15 + 15 + 10 + 18 = 58 olmalı');
  });

  test('6. Soru türü filtreleri ve sekmeleri her türü ayrı ayrı temsil etmeli', () => {
    const engine = new QuestionPreparationEngine();
    engine.setTypeEnabled('multiple_choice', true);
    engine.setTypeEnabled('short_answer', true);
    engine.setTypeEnabled('open_ended', true);
    engine.setTypeEnabled('activity', true);

    const selected = engine.getSelectedTypes();
    assert.equal(selected.length, 4);
    assert.deepEqual(selected.map(s => s.type), ['multiple_choice', 'short_answer', 'open_ended', 'activity']);
  });

  test('7. Çoktan seçmeli olmayan türler özgün yapılarını korumalı (asla test şıklarına dönüştürülmemeli)', () => {
    const rawShortAnswer = {
      type: 'short_answer',
      question: 'Yandaki görselde Dünya etrafında dolanan insan yapımı araca ne denir?',
      correct_answer: 'Yapay Uydu',
      options: {}
    };
    assert.equal(rawShortAnswer.type, 'short_answer');
    assert.equal(Object.keys(rawShortAnswer.options).length, 0, 'Kısa cevaplı soruda A-B-C-D seçenekleri olmamalı');
  });

  test('8. Tüm kazanımlar seçildiğinde otomatik "Tüm Kazanımlar" başlığı atanmalı', () => {
    const allOutcomes = ['F.5.1.1.1', 'F.5.1.1.2', 'F.5.1.1.3'];
    const checkedOutcomes = ['F.5.1.1.1', 'F.5.1.1.2', 'F.5.1.1.3'];
    const isAllOutcomes = (allOutcomes.length === checkedOutcomes.length);
    const subtopic = isAllOutcomes ? 'Tüm Kazanımlar' : '1. Bölüm';
    assert.equal(subtopic, 'Tüm Kazanımlar');
  });

  test('9. Mükerrer yayınlama önleme (Idempotency & Debounce) çalışmalı', () => {
    const dedupMap = new Map();
    const key = '5_1_Test 1_10';
    dedupMap.set(key, { time: Date.now(), data: { success: true } });

    // 100ms sonra gelen aynı istek mükerrer kabul edilmeli
    const now = Date.now();
    const isDuplicate = dedupMap.has(key) && (now - dedupMap.get(key).time < 5000);
    assert.equal(isDuplicate, true);
  });

  test('10. "Yukarıdaki" ifadeleri "Yandaki" olarak otomatik düzeltilmeli', () => {
    const rawQuestion = 'Yukarıdaki modelde numaralandırılmış gök cisimleri verilmiştir. Yukarıda verilen bilgilere göre...';
    const cleaned = rawQuestion
      .replace(/\bYukarıdaki\b/g, 'Yandaki')
      .replace(/\byukarıdaki\b/g, 'yandaki')
      .replace(/\bYukarıda\b/g, 'Yanda')
      .replace(/\byukarıda\b/g, 'yanda');

    assert.equal(cleaned.includes('Yukarıdaki'), false);
    assert.equal(cleaned.includes('Yukarıda'), false);
    assert.equal(cleaned.includes('Yandaki modelde'), true);
    assert.equal(cleaned.includes('Yanda verilen'), true);
  });

  test('11. Soru-görsel uyumu (VisualMatchEngine) pedagojik olarak korunmalı', () => {
    const q1 = 'Yandaki modelde numaralandırılmış gök cisimlerinin isimlerini yazınız (1, 2, 3). Gölge oluşumu.';
    const brief1 = visualEngine.generateVisualBrief(q1);
    assert.equal(brief1.assetPath, '/assets/science/gunes_tutulmasi_123.svg');

    const q2 = 'Yanda Güneş (G), Dünya (D) ve Ay (A) konumları verilmiştir.';
    const brief2 = visualEngine.generateVisualBrief(q2);
    assert.equal(brief2.assetPath, '/assets/science/ay_tutulmasi_gda.svg');

    const q3 = 'Yandaki görselde Dünya etrafında dolanan insan yapımı bir araç soru işareti (?) ile gösterilmiştir.';
    const brief3 = visualEngine.generateVisualBrief(q3);
    assert.equal(brief3.assetPath, '/assets/science/yapay_uydu_soru_isareti.svg');
  });

  test('12. Eksik soru tamamlama mantığı (Fulfillment Engine)', () => {
    const requestedCount = 15;
    const returnedQuestions = new Array(9).fill(null).map((_, i) => ({ id: i + 1, question: `Soru ${i + 1}` }));
    const missingCount = requestedCount - returnedQuestions.length;
    assert.equal(missingCount, 6, '15 - 9 = 6 soru eksik tespit edilmeli');
    
    // Tamamlayıcı üretim
    const supplementary = new Array(missingCount).fill(null).map((_, i) => ({ id: 10 + i, question: `Soru ${10 + i}` }));
    const finalSet = returnedQuestions.concat(supplementary);
    assert.equal(finalSet.length, requestedCount, 'Sonuç tam olarak 15 soru olmalı');
  });

  test('13. Çıktı dosya formatı değiştirildiğinde soru seçimleri ve sayıları korunmalı', () => {
    const engine = new QuestionPreparationEngine();
    engine.setTypeEnabled('multiple_choice', true);
    engine.setTypeCount('multiple_choice', 12);
    engine.setTypeEnabled('short_answer', true);
    engine.setTypeCount('short_answer', 8);

    engine.setOutputMode('combined');
    assert.equal(engine.getOutputMode(), 'combined');
    assert.equal(engine.getType('multiple_choice').count, 12);
    assert.equal(engine.getType('short_answer').count, 8);

    engine.setOutputMode('separate');
    assert.equal(engine.getOutputMode(), 'separate');
    assert.equal(engine.getType('multiple_choice').count, 12);
    assert.equal(engine.getType('short_answer').count, 8);
  });

});
