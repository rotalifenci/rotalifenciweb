const { test, describe } = require('node:test');
const assert = require('node:assert');
const {
  QuestionPreparationEngine,
  QUESTION_TYPES_DEF,
  ACTIVITY_SUBTYPES_DEF,
  createInitialState
} = require('../js/question_preparation_state.js');

describe('🛡️ Rotalı Fenci - Soru Hazırlama Modülü Regresyon Test Paketi', () => {

  // TEST 1: Soru Türlerinin Bağımsız Yönetimi (Birbirini Bozmaması)
  test('1. Soru türleri checkbox ve sayıları birbirinden bağımsız yönetilmeli', () => {
    const engine = new QuestionPreparationEngine();

    // Varsayılan: Sadece çoktan seçmeli aktif
    assert.strictEqual(engine.getType('multiple_choice').enabled, true);
    assert.strictEqual(engine.getType('short_answer').enabled, false);
    assert.strictEqual(engine.getType('open_ended').enabled, false);
    assert.strictEqual(engine.getType('activity').enabled, false);

    // Kısa cevaplıyı aktif et ve sayısını 15 yap
    engine.setTypeEnabled('short_answer', true);
    engine.setTypeCount('short_answer', 15);

    assert.strictEqual(engine.getType('short_answer').enabled, true);
    assert.strictEqual(engine.getType('short_answer').count, 15);
    // Diğer türlerin bozulmadığını doğrula
    assert.strictEqual(engine.getType('multiple_choice').count, 10);
    assert.strictEqual(engine.getType('open_ended').enabled, false);
    assert.strictEqual(engine.getType('open_ended').count, 5);

    // Çoktan seçmeliyi kapat
    engine.setTypeEnabled('multiple_choice', false);
    assert.strictEqual(engine.getType('multiple_choice').enabled, false);
    // Kısa cevaplının kapanmadığını veya sayısının değişmediğini doğrula
    assert.strictEqual(engine.getType('short_answer').enabled, true);
    assert.strictEqual(engine.getType('short_answer').count, 15);
  });

  // TEST 2: Çoklu Soru Türü Seçimi ve Toplam Sayı Senaryosu
  test('2. Çoklu seçim: 20 Çoktan Seçmeli + 15 Kısa Cevaplı + 10 Açık Uçlu + 5 Etkinlik = 50 İçerik', () => {
    const engine = new QuestionPreparationEngine();

    engine.setTypeEnabled('multiple_choice', true);
    engine.setTypeCount('multiple_choice', 20);

    engine.setTypeEnabled('short_answer', true);
    engine.setTypeCount('short_answer', 15);

    engine.setTypeEnabled('open_ended', true);
    engine.setTypeCount('open_ended', 10);

    engine.setTypeEnabled('activity', true);
    engine.setTypeCount('activity', 5);

    const selected = engine.getSelectedTypes();
    assert.strictEqual(selected.length, 4);

    const total = engine.getTotalCount();
    assert.strictEqual(total, 50);

    // Sadece seçili olanlar dönmeli
    assert.deepStrictEqual(selected.map(s => s.type), ['multiple_choice', 'short_answer', 'open_ended', 'activity']);
  });

  // TEST 3: 13 Özel Etkinlik Türünün Eksiksiz Varlığı
  test('3. 13 Özel Etkinlik türünün tamamı mevcut ve tanımlı olmalı', () => {
    const expectedSubtypes = [
      'matching', 'ordering', 'table_completion', 'image_analysis',
      'diagram_labeling', 'visual_tagging', 'classification', 'experiment_analysis',
      'chart_interpretation', 'scientific_process', 'daily_life_problem',
      'cut_paste_coloring', 'stem_design'
    ];

    assert.strictEqual(Object.keys(ACTIVITY_SUBTYPES_DEF).length, 13);
    expectedSubtypes.forEach(k => {
      assert.ok(ACTIVITY_SUBTYPES_DEF[k], `Etkinlik türü tanımlı olmalı: ${k}`);
      assert.ok(ACTIVITY_SUBTYPES_DEF[k].title, `Başlık tanımlı olmalı: ${k}`);
      assert.ok(ACTIVITY_SUBTYPES_DEF[k].icon, `İkon tanımlı olmalı: ${k}`);
    });
  });

  // TEST 4: Etkinlik Türlerinin Birbirini Bozmaması
  test('4. Bir etkinlik türü üzerindeki değişiklik diğer 12 etkinlik türünü etkilememeli', () => {
    const engine = new QuestionPreparationEngine();

    // stem_design aktif et ve sayısını 5 yap
    engine.setActivitySubtypeEnabled('stem_design', true);
    engine.setActivitySubtypeCount('stem_design', 5);

    const stem = engine.state.activitySubtypes.stem_design;
    assert.strictEqual(stem.enabled, true);
    assert.strictEqual(stem.count, 5);

    // classification'ın bağımsız kaldığını kontrol et
    const classif = engine.state.activitySubtypes.classification;
    assert.strictEqual(classif.enabled, false);
    assert.strictEqual(classif.count, 2);

    // Hızlı buton: Tümünü seç
    engine.selectAllActivities();
    Object.keys(engine.state.activitySubtypes).forEach(k => {
      assert.strictEqual(engine.state.activitySubtypes[k].enabled, true);
    });

    // Hızlı buton: Temizle
    engine.clearAllActivities();
    Object.keys(engine.state.activitySubtypes).forEach(k => {
      assert.strictEqual(engine.state.activitySubtypes[k].enabled, false);
    });
  });

  // TEST 5: Çıktı Formatı Seçimi Soru Ayarlarını Bozmamalı
  test('5. Çıktı formatı değiştirildiğinde soru seçimleri ve sayıları korunmalı', () => {
    const engine = new QuestionPreparationEngine();

    engine.setTypeEnabled('multiple_choice', true);
    engine.setTypeCount('multiple_choice', 12);
    engine.setTypeEnabled('open_ended', true);
    engine.setTypeCount('open_ended', 8);

    // Başlangıç: separate
    assert.strictEqual(engine.getOutputMode(), 'separate');

    // combined olarak değiştir
    engine.setOutputMode('combined');
    assert.strictEqual(engine.getOutputMode(), 'combined');

    // Soru seçimlerinin sapasağlam kaldığını doğrula
    assert.strictEqual(engine.getType('multiple_choice').enabled, true);
    assert.strictEqual(engine.getType('multiple_choice').count, 12);
    assert.strictEqual(engine.getType('open_ended').enabled, true);
    assert.strictEqual(engine.getType('open_ended').count, 8);
    assert.strictEqual(engine.getTotalCount(), 20);
  });

  // TEST 6: Yapay Zekâ İstek Yükü Oluşturma
  test('6. Seçili soru türleri ve etkinlikler için doğru yapay zekâ istek yükleri oluşturulmalı', () => {
    const engine = new QuestionPreparationEngine();

    engine.setTypeEnabled('multiple_choice', true);
    engine.setTypeCount('multiple_choice', 10);
    engine.setTypeEnabled('activity', true);
    engine.setActivitySubtypeEnabled('matching', true);
    engine.setActivitySubtypeCount('matching', 3);
    engine.setActivitySubtypeEnabled('ordering', true);
    engine.setActivitySubtypeCount('ordering', 2);

    const requests = engine.buildGenerationRequests({
      grade: '6',
      subject: 'Fen Bilimleri',
      learning_area: 'Güneş Sistemi',
      selected_outcomes: ['F.6.1.1.1'],
      difficulty: 'hard'
    });

    assert.strictEqual(requests.length, 2);
    assert.strictEqual(requests[0].type, 'multiple_choice');
    assert.strictEqual(requests[0].count, 10);
    assert.strictEqual(requests[0].payload.grade, '6');

    assert.strictEqual(requests[1].type, 'activity');
    assert.ok(Array.isArray(requests[1].payload.activity_types));
    assert.ok(requests[1].payload.activity_types.some(a => a.type === 'matching' && a.count === 3));
    assert.ok(requests[1].payload.activity_types.some(a => a.type === 'ordering' && a.count === 2));
  });

  // TEST 7: Hiçbir Tür Seçili Olmadığında Güvenli Hata Fırlatma
  test('7. Hiçbir tür seçili değilse istek üretimi engellenmeli ve net hata bildirilmeli', () => {
    const engine = new QuestionPreparationEngine();
    engine.setTypeEnabled('multiple_choice', false);
    engine.setTypeEnabled('short_answer', false);
    engine.setTypeEnabled('open_ended', false);
    engine.setTypeEnabled('activity', false);

    assert.throws(() => {
      engine.buildGenerationRequests({});
    }, /en az bir soru türü seçiniz/i);
  });

  // TEST 8: Ayrı Dosyalar (Separate) ve Birleşik Dosya (Combined) Yayınlama Yükleri
  test('8. Çıktı modlarına göre yayınlama (publish) paketleri eksiksiz üretilmeli', () => {
    const engine = new QuestionPreparationEngine();

    // İki ayrı batch kaydet
    engine.saveBatch('multiple_choice', {
      label: 'Çoktan Seçmeli',
      questions: [{ id: 1, question: 'Soru 1', correct_answer: 'A' }, { id: 2, question: 'Soru 2', correct_answer: 'B' }],
      smartTitle: 'Test No: 1 - Çoktan Seçmeli'
    });

    engine.saveBatch('open_ended', {
      label: 'Açık Uçlu',
      questions: [{ id: 1, question: 'Soru 1 (Açık)', correct_answer: 'Model...' }],
      smartTitle: 'Test No: 2 - Açık Uçlu'
    });

    // 1. Separate modu testi: 2 ayrı dosya paketi
    engine.setOutputMode('separate');
    const separatePayloads = engine.buildPublishPayloads({ grade: '6', learning_area: 'Tutulmalar' });
    assert.strictEqual(separatePayloads.length, 2);
    assert.strictEqual(separatePayloads[0].title, 'Test No: 1 - Çoktan Seçmeli');
    assert.strictEqual(separatePayloads[0].questions.length, 2);
    assert.strictEqual(separatePayloads[1].title, 'Test No: 2 - Açık Uçlu');
    assert.strictEqual(separatePayloads[1].questions.length, 1);

    // 2. Combined modu testi: Tek birleşik dosya (1'den N'e ardışık numaralı)
    engine.setOutputMode('combined');
    const combinedPayloads = engine.buildPublishPayloads({ grade: '6', learning_area: 'Tutulmalar' });
    assert.strictEqual(combinedPayloads.length, 1);
    assert.strictEqual(combinedPayloads[0].questions.length, 3);
    assert.strictEqual(combinedPayloads[0].questions[0].id, 1);
    assert.strictEqual(combinedPayloads[0].questions[1].id, 2);
    assert.strictEqual(combinedPayloads[0].questions[2].id, 3);
  });

  // TEST 9: Batch Sekme Değişimi ve İzolasyon
  test('9. Batch sekmeleri arasında geçiş yapıldığında veriler karışmamalı', () => {
    const engine = new QuestionPreparationEngine();

    engine.saveBatch('multiple_choice', {
      label: 'Çoktan Seçmeli',
      questions: [{ id: 1, question: 'MC Q1' }],
      smartTitle: 'MC Title'
    });

    engine.saveBatch('activity', {
      label: 'Etkinlik',
      questions: [{ id: 1, question: 'Act Q1' }, { id: 2, question: 'Act Q2' }],
      smartTitle: 'Act Title'
    });

    assert.strictEqual(engine.getActiveBatch().type, 'multiple_choice');

    // Sekmeyi değiştir
    engine.setActiveBatch('activity');
    assert.strictEqual(engine.getActiveBatch().type, 'activity');
    assert.strictEqual(engine.getActiveBatch().questions.length, 2);

    // Tekrar çoktan seçmeliye dön
    engine.setActiveBatch('multiple_choice');
    assert.strictEqual(engine.getActiveBatch().type, 'multiple_choice');
    assert.strictEqual(engine.getActiveBatch().questions.length, 1);
  });

  // TEST 10: Sayı Sınırları ve Güvenli Giriş Doğrulaması
  test('10. Geçersiz veya sınır dışı sayı girişleri güvenli aralığa normalize edilmeli', () => {
    const engine = new QuestionPreparationEngine();

    // Negatif veya sıfır girilirse min: 1 olmalı
    engine.setTypeCount('multiple_choice', -5);
    assert.strictEqual(engine.getType('multiple_choice').count, 1);

    engine.setTypeCount('multiple_choice', 0);
    assert.strictEqual(engine.getType('multiple_choice').count, 1);

    // 30'dan büyük girilirse max: 30 olmalı
    engine.setTypeCount('multiple_choice', 999);
    assert.strictEqual(engine.getType('multiple_choice').count, 30);

    // Sayı olmayan değer girilirse min: 1 olmalı
    engine.setTypeCount('multiple_choice', 'abc');
    assert.strictEqual(engine.getType('multiple_choice').count, 1);
  });
});
