const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { generateTestCoverSvg } = require('../api/_cover-generator.js');

describe('🎨 Soru Dokümanları Kapak ve Başlık Otomasyonu Test Paketi', () => {

  it('1. Soru türü tam doğru olmalı: Kısa cevaplıda "Yaprak Testi" veya "Açık Uçlu" yazmamalı', () => {
    const svg = generateTestCoverSvg({
      grade: '5',
      section: '1',
      unitName: 'Güneş, Dünya ve Ay',
      testType: 'KISA CEVAPLI / BOŞLUK DOLDURMA',
      questionType: 'short_answer',
      testNumber: 2,
      questionCount: 15,
      learningOutcome: 'F.5.1.1.1 - Güneş\'in Yapısı'
    });

    assert.ok(svg.includes('KISA CEVAPLI ÇALIŞMA – 2'), 'Ribbon Kısa Cevaplı ÇALIŞMA – 2 içermeli');
    assert.ok(!svg.includes('YAPRAK TESTİ-2'), 'Kısa cevaplı kapakta asla YAPRAK TESTİ-2 yazmamalı');
    assert.ok(!svg.includes('AÇIK UÇLU SINAV-2'), 'Kısa cevaplı kapakta Açık Uçlu Sınav yazmamalı');
    assert.ok(svg.includes('15 SORU'), 'Soru sayısı doğru olmalı');
  });

  it('2. Etkinlik çalışmalarında kapağında "Test" yazmamalı ve "ETKİNLİK" ibaresi yer almalı', () => {
    const svg = generateTestCoverSvg({
      grade: '5',
      section: '1',
      unitName: 'Güneş, Dünya ve Ay',
      testType: 'ETKİNLİK ÇALIŞMASI',
      questionType: 'activity',
      testNumber: 1,
      questionCount: 8,
      learningOutcome: 'F.5.1.1.1'
    });

    assert.ok(svg.includes('ETKİNLİK ÇALIŞMASI – 1'), 'Kapakta ETKİNLİK ÇALIŞMASI – 1 yazmalı');
    assert.ok(svg.includes('8 ETKİNLİK'), 'Kapakta 8 ETKİNLİK yazmalı');
    assert.ok(!svg.includes('8 SORU'), 'Etkinlik kapaklarında SORU yazmamalı');
  });

  it('3. Öğrenme çıktısı rozeti kapağa ve karta dinamik basılmalı', () => {
    const outcomeText = "Güneş'in Yapısı ve Özellikleri";
    const outcomeCode = "F.5.1.1.1";
    const svg = generateTestCoverSvg({
      grade: '5',
      section: '1',
      unitName: 'Güneş, Dünya ve Ay',
      testType: 'ÇOKTAN SEÇMELİ TEST',
      questionType: 'multiple_choice',
      testNumber: 3,
      questionCount: 10,
      learningOutcome: outcomeText,
      outcomeCode: outcomeCode,
      isAllOutcomes: false
    });

    assert.ok(svg.includes('ÖĞRENME ÇIKTISI: F.5.1.1.1 - Güneş'), 'Kapakta kazanım kodu ve adı yer almalı');
  });

  it('4. Tüm kazanımlar seçildiğinde "ÖĞRENME ÇIKTISI: TÜM KAZANIMLAR" yazmalı', () => {
    const svg = generateTestCoverSvg({
      grade: '6',
      section: '1',
      unitName: 'Güneş Sistemi ve Tutulmalar',
      testType: 'ÇOKTAN SEÇMELİ TEST',
      questionType: 'multiple_choice',
      testNumber: 1,
      questionCount: 20,
      isAllOutcomes: true
    });

    assert.ok(svg.includes('ÖĞRENME ÇIKTISI: TÜM KAZANIMLAR'), 'Kapakta TÜM KAZANIMLAR rozeti yer almalı');
  });

  it('5. materials.json içerisindeki kayıtlar gerçek tür ve dinamik SVG kapaklarıyla uyumlu olmalı', () => {
    const materialsPath = path.resolve(__dirname, '..', 'data', 'materials.json');
    const materials = JSON.parse(fs.readFileSync(materialsPath, 'utf8'));

    const shortAnswers = materials.filter(m => m.question_type === 'short_answer');
    assert.ok(shortAnswers.length > 0, 'En az 1 kısa cevaplı test olmalı');

    shortAnswers.forEach(sa => {
      assert.ok(
        !sa.imageUrl.includes('5-1-yaprak-testi-1.jpg'),
        `Kısa cevaplı ${sa.id} hatalı olarak static yaprak test jpg görseline sahip olamaz`
      );
      assert.ok(
        sa.format.includes('KISA CEVAPLI'),
        `Kısa cevaplı ${sa.id} formatı KISA CEVAPLI içermeli`
      );
    });
  });

  it('6. main-layout ekran 1220px veya altında tek sütuna çökmemeli (yan tarafta kalmalı)', () => {
    const cssPath = path.resolve(__dirname, '..', 'css', 'yaprak-test.css');
    const css = fs.readFileSync(cssPath, 'utf8');

    assert.ok(!css.includes('@media (max-width: 1220px) {\n  .main-layout {\n    grid-template-columns: 1fr;'), '1220px media query kaldırılmış olmalı');
    assert.ok(css.includes('.control-panel {'), 'Control panel kuralı bulunmalı');
    assert.ok(css.includes('position: sticky;'), 'Control panel sticky olmalı');
  });

});
