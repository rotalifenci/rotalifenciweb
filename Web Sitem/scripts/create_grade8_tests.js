const fs = require('fs');
const path = require('path');
const { buildZKitapHtml } = require('./zkitap_engine.js');

console.log('Generating 8th grade MEB Maarif tests...');

// 1. Çoktan Seçmeli LGS Denemesi (20 Soru)
const g8McQuestions = [
  {
    question: "Dünya'nın dönme ekseninin 23° 27' eğik olması ve Güneş etrafında dolanması sonucunda mevsimler meydana gelir. 21 Haziran tarihinde Kuzey Yarım Küre'de en uzun gündüz yaşanırken, Güney Yarım Küre'de kış mevsimi başlar. Buna göre, Dünya 21 Haziran konumundayken Güneş ışınlarının yeryüzüne düşme açısı ve birim yüzeye aktarılan ısı enerjisi ile ilgili aşağıdakilerden hangisi doğrudur?",
    options: {
      A: "Yengeç Dönencesi'ne Güneş ışınları öğle vakti dik açıyla düşer ve birim yüzeye düşen enerji en fazladır.",
      B: "Oğlak Dönencesi'nde birim yüzeye aktarılan ısı enerjisi Kuzey Yarım Küre'den daha fazladır.",
      C: "Ekvator'da gece ve gündüz süreleri arasındaki fark maksimum değere ulaşır.",
      D: "Güney Yarım Küre'de Güneş ışınlarının gelme açısı dikleştiği için gölge boyları kısalır."
    },
    correct_answer: "A",
    explanation: "21 Haziran tarihinde Güneş ışınları Kuzey Yarım Küre'deki Yengeç Dönencesi'ne 90°'lik dik açıyla düşer. Işık dik düştüğü için birim alana aktarılan enerji maksimum olur ve yaz mevsimi başlar."
  },
  {
    question: "Gündüz ve gece sürelerinin tüm dünyada eşit olduğu (12 saat gündüz, 12 saat gece) tarihlere ekinoks denir. Ekinoks tarihleri 21 Mart ve 23 Eylül'dür. Ekinoks tarihlerinde Güneş ışınları öğle vakti Ekvator'a dik açıyla düşer. Buna göre, 23 Eylül tarihinde Türkiye'de ve Avustralya'da yaşanan durumlarla ilgili hangisi söylenemez?",
    options: {
      A: "Türkiye'de sonbahar mevsimi, Avustralya'da ilkbahar mevsimi başlar.",
      B: "Her iki ülkede de 24 saatlik gün içinde gece ve gündüz süreleri birbirine eşittir.",
      C: "Türkiye'de bu tarihten sonra gündüzler gecelerden daha uzun olmaya başlar.",
      D: "Ekvator çizgisi üzerindeki cisimlerin öğle vakti gölgesi oluşmaz."
    },
    correct_answer: "C",
    explanation: "23 Eylül'den sonra Kuzey Yarım Küre'de (Türkiye) gündüz süreleri kısalmaya ve geceler gündüzlerden daha uzun olmaya başlar. Dolayısıyla C şıkkı söylenemez."
  },
  {
    question: "İklim ve hava olayları fen bilimlerinde sıkça karşılaştırılan iki kavramdır. Geniş bir bölgede uzun yıllar boyunca gözlemlenen hava olaylarının ortalamasına iklim, dar bir alanda kısa süre içinde meydana gelen değişken atmosfer olaylarına ise hava durumu denir. Aşağıdaki ifadelerden hangisi bir hava olayını belirtir?",
    options: {
      A: "Karadeniz Bölgesi her mevsim yağışlı ve ılıman bir iklim yapısına sahiptir.",
      B: "Yarın sabah saatlerinde İç Anadolu genelinde yoğun sis ve buzlanma beklenmektedir.",
      C: "Akdeniz kıyılarında yazlar sıcak ve kurak, kışlar ılık ve yağışlı geçer.",
      D: "Kutup bölgelerinde yıllık ortalama sıcaklıklar sıfırın altındadır."
    },
    correct_answer: "B",
    explanation: "Yarın sabah saatlerinde sis ve buzlanma beklentisi kısa süreli, dar alanlı ve tahmini bir atmosfer olayı olduğundan hava durumudur."
  },
  {
    question: "Güneş ışınlarının yere düşme açısı ile gölge boyu arasında ters orantı vardır. Işınlar dik veya dike yakın açıyla geldiğinde gölge boyu kısa, eğik açıyla geldiğinde ise gölge boyu uzundur. 21 Aralık tarihinde Türkiye'de bir cismin öğle vaktindeki gölge boyu ölçüldüğünde yılın en uzun gölgesi gözlemlenmiştir. Bu durumun temel sebebi aşağıdakilerden hangisidir?",
    options: {
      A: "Dünya'nın Güneş'e olan mesafesinin en uzak noktada olması.",
      B: "Kuzey Yarım Küre'ye Güneş ışınlarının yıl içindeki en küçük (en eğik) açıyla gelmesi.",
      C: "Ay'ın Dünya ile Güneş arasına girerek gölge oluşturması.",
      D: "Atmosferdeki gaz yoğunluğunun kış aylarında azalması."
    },
    correct_answer: "B",
    explanation: "21 Aralık'ta Kuzey Yarım Küre kış başlangıcını yaşar ve Güneş ışınları yıl içindeki en eğik açıyla gelir. Eğik açı gölge boyunun maksimum (en uzun) olmasını sağlar."
  }
];

// 2. Kısa Cevaplı / Boşluk Doldurma (10 Soru)
const g8SaQuestions = [
  {
    question: "Dünya'nın dönme ekseninin yörünge düzlemine eğik olmasını sağlayan açı değeri kaç derece kaç dakikadır?",
    correct_answer: "23 derece 27 dakika",
    explanation: "Dünya'nın eksen eğikliği tam olarak 23° 27' (23 derece 27 dakika) değerindedir."
  },
  {
    question: "21 Mart ve 23 Eylül tarihlerinde gece ve gündüz sürelerinin eşit olması durumuna ne ad verilir?",
    correct_answer: "Ekinoks",
    explanation: "Gece-gündüz eşitliğine 'Ekinoks' adı verilir."
  },
  {
    question: "Geniş bir alanda uzun yıllar boyunca devam eden hava şartlarının ortalamasını inceleyen bilim dalına ne ad verilir?",
    correct_answer: "Klimatoloji",
    explanation: "İklim bilimine 'Klimatoloji', bu alanda çalışan bilim insanına ise 'Klimatolog' denir."
  },
  {
    question: "Havadaki su buharının soğuk hava etkisiyle yeryüzündeki yaprak ve taşlar üzerinde doğrudan donarak buz kristalleri oluşturması olayına ne ad verilir?",
    correct_answer: "Kırağı",
    explanation: "Su buharının doğrudan donarak oluşturduğu buz kristallerine kırağı denir."
  }
];

// 3. Açık Uçlu Klasik Sınav (5 Soru)
const g8OeQuestions = [
  {
    question: "Dünya'nın eksen eğikliği olmasaydı (eksen dik olsaydı) mevsimler, gece-gündüz süreleri ve sıcaklık değişimleri nasıl etkilenirdi? Bilimsel gerekçeleriyle açıklayınız.",
    correct_answer: "Mevsimler oluşmazdı, gece ve gündüz süreleri daima 12 saat eşit olurdu, bir noktaya Güneş ışınlarının geliş açısı yıl boyunca hiç değişmezdi.",
    explanation: "Eksen eğikliği Güneş ışınlarının yıl içindeki geliş açısını değiştiren temel faktördür. Eğiklik olmasaydı ışınların geliş açısı sabit kalır, mevsimsel sıcaklık farkları oluşmaz ve gece-gündüz süresi yıl boyu eşitlenirdi."
  },
  {
    question: "Küresel iklim değişikliğinin nedenlerini ve bu değişikliğin Dünya üzerindeki ekosistemlere olan olumsuz etkilerini ikişer madde halinde açıklayınız.",
    correct_answer: "Fosil yakıt kullanımı ve sanayileşme sera gazlarını artırır; buzulların erimesi ve kuraklık ekosistemleri bozar.",
    explanation: "Sera gazlarının artışı küresel ısınmaya yol açar; bu durum deniz seviyelerinin yükselmesine, kuraklığa ve canlı türlerinin yok olmasına neden olur."
  }
];

// Dosyaları testler/ ve ../testler/ içerisine yaz
const filesToCreate = [
  {
    fileName: '8-sinif-1-unite-test-1-coktan-secmeli-lgs-denemesi.html',
    title: 'Test 1 - Çoktan Seçmeli Yaprak Test (LGS)',
    grade: '8',
    unit: '1. Ünite: Mevsimler ve İklim',
    questions: g8McQuestions
  },
  {
    fileName: '8-sinif-1-unite-test-1-kisa-cevapli-bosluk-doldurma.html',
    title: 'Test 1 - Kısa Cevaplı / Boşluk Doldurma',
    grade: '8',
    unit: '1. Ünite: Mevsimler ve İklim',
    questions: g8SaQuestions
  },
  {
    fileName: '8-sinif-1-unite-test-1-acik-uclu-klasik-sinav.html',
    title: 'Test 1 - Açık Uçlu Klasik Sınav',
    grade: '8',
    unit: '1. Ünite: Mevsimler ve İklim',
    questions: g8OeQuestions
  }
];

filesToCreate.forEach(f => {
  const html = buildZKitapHtml({
    title: f.title,
    grade: f.grade,
    unit: f.unit,
    subject: 'Fen Bilimleri',
    questions: f.questions
  });

  ['testler', '../testler'].forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.writeFileSync(path.join(dir, f.fileName), html, 'utf8');
      console.log(`Created 8th grade test: ${dir}/${f.fileName}`);
    }
  });
});
