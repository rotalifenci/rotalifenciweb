require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ImageRun } = require('docx');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// 5, 6, 7 ve 8. Sınıf MEB Fen Bilimleri Müfredat Veritabanı
const ALL_CURRICULUM = {
  "5": {
    grade: "5",
    subject: "Fen Bilimleri",
    units: [
      {
        id: "unit1",
        name: "1. Ünite: Güneş, Dünya ve Ay",
        icon: "☀️",
        outcomes: [
          { id: "1.1", text: "Güneş ve Ay'ın geometrik şeklini ve temel özelliklerini açıklar." },
          { id: "1.2", text: "Ay'ın dönme ve dolanma hareketlerini ile ana/ara evrelerini model üzerinde gösterir." },
          { id: "1.3", text: "Güneş, Dünya ve Ay'ın birbirlerine göre hareketlerini ve boyut ilişkilerini kavrar." }
        ]
      },
      {
        id: "unit2",
        name: "2. Ünite: Canlılar Dünyası",
        icon: "🌱",
        outcomes: [
          { id: "2.1", text: "Mikroskobik canlılar, mantarlar, bitkiler ve hayvanlar olmak üzere canlıları benzerlik ve farklılıklarına göre sınıflandırır." },
          { id: "2.2", text: "Mikroskobik canlıların yararlı ve zararlı etkilerini ayırt eder." },
          { id: "2.3", text: "Çiçekli ve çiçeksiz bitkiler ile omurgalı ve omurgasız hayvanları örneklerle açıklar." }
        ]
      },
      {
        id: "unit3",
        name: "3. Ünite: Kuvvetin Ölçülmesi ve Sürtünme",
        icon: "⚙️",
        outcomes: [
          { id: "3.1", text: "Kuvvetin büyüklüğünü dinamometre ile ölçer ve birimini (Newton) ifade eder." },
          { id: "3.2", text: "Basit bir dinamometre modeli tasarlar." },
          { id: "3.3", text: "Sürtünme kuvvetinin özelliklerini, günlük yaşamdaki olumlu/olumsuz etkilerini ve sürtünmeyi artırma/azaltma yöntemlerini inceler." }
        ]
      },
      {
        id: "unit4",
        name: "4. Ünite: Madde ve Değişim",
        icon: "🧪",
        outcomes: [
          { id: "4.1", text: "Erime, donma, buharlaşma, yoğuşma, süblimleşme ve kırağılaşma olaylarını açıklar." },
          { id: "4.2", text: "Erime, donma ve kaynama noktalarının saf maddeler için ayırt edici olduğunu deneylerle gösterir." },
          { id: "4.3", text: "Isı ve sıcaklık kavramları arasındaki farkı açıklar." },
          { id: "4.4", text: "Isınma ve soğuma sonucu maddelerde genleşme ve büzülme olaylarını açıklar." }
        ]
      },
      {
        id: "unit5",
        name: "5. Ünite: Işığın Yayılması",
        icon: "💡",
        outcomes: [
          { id: "5.1", text: "Işığın doğrusal yayıldığını gösterir." },
          { id: "5.2", text: "Düzgün ve dağınık yansımayı karşılaştırır, yansıma kanunlarını uygular." },
          { id: "5.3", text: "Maddeleri saydam, yarı saydam ve opak olarak sınıflandırır." },
          { id: "5.4", text: "Tam gölgenin nasıl oluştuğunu ve gölge boyutunun neye göre değiştiğini modeller." }
        ]
      },
      {
        id: "unit6",
        name: "6. Ünite: İnsan ve Çevre",
        icon: "🌍",
        outcomes: [
          { id: "6.1", text: "Biyoçeşitliliğin önemini ve biyoçeşitliliği tehdit eden faktörleri değerlendirir." },
          { id: "6.2", text: "Çevre kirliliğinin nedenlerini ve çözüm yollarını tartışır." },
          { id: "6.3", text: "Deprem, heyelan, sel, volkanik patlama ve kasırga gibi yıkıcı doğa olaylarından korunma yöntemlerini açıklar." }
        ]
      },
      {
        id: "unit7",
        name: "7. Ünite: Elektrik Devre Elemanları",
        icon: "⚡",
        outcomes: [
          { id: "7.1", text: "Basit elektrik devresi elemanlarını (pil, ampul, anahtar, bağlantı kablosu) sembolleriyle çizer ve devre şeması oluşturur." },
          { id: "7.2", text: "Devredeki ampul sayısı ve pil sayısının ampul parlaklığı üzerindeki etkisini bağımsız, bağımlı ve kontrol edilen değişkenler üzerinden test eder." }
        ]
      }
    ]
  },
  "6": {
    grade: "6",
    subject: "Fen Bilimleri",
    units: [
      {
        id: "unit1",
        name: "1. Ünite: Güneş Sistemi ve Tutulmalar",
        icon: "🪐",
        outcomes: [
          { id: "1.1", text: "Güneş Sistemi'ndeki gezegenleri birbirleri ile karşılaştırır (Güneş'e yakınlık, büyüklük, karasal/gazsal yapı)." },
          { id: "1.2", text: "Güneş ve Ay tutulmasını temsil eden bir model oluşturur ve açıklar." }
        ]
      },
      {
        id: "unit2",
        name: "2. Ünite: Vücudumuzdaki Sistemler",
        icon: "🫀",
        outcomes: [
          { id: "2.1", text: "Destek ve hareket sistemine ait yapı ve organları (kemik, eklem, kas) açıklar." },
          { id: "2.2", text: "Sindirim sistemini oluşturan yapı ve organların görevlerini, mekanik ve kimyasal sindirimi açıklar." },
          { id: "2.3", text: "Dolaşım sistemini (kalp, damarlar, kan, büyük ve küçük kan dolaşımı, kan grupları) açıklar." },
          { id: "2.4", text: "Solunum sistemini oluşturan yapı ve organların görevlerini açıklar." },
          { id: "2.5", text: "Boşaltım sistemini oluşturan yapı ve organların görevlerini açıklar." }
        ]
      },
      {
        id: "unit3",
        name: "3. Ünite: Kuvvet ve Hareket",
        icon: "🏹",
        outcomes: [
          { id: "3.1", text: "Bir cisme etki eden birden fazla kuvveti deneyerek keşfeder (Bileşke kuvvet, dengelenmiş ve dengelenmemiş kuvvetler)." },
          { id: "3.2", text: "Sabit süratli hareketlinin konum-zaman ve sürat-zaman grafiklerini çizer ve yorumlar." }
        ]
      },
      {
        id: "unit4",
        name: "4. Ünite: Madde ve Isı",
        icon: "🔥",
        outcomes: [
          { id: "4.1", text: "Maddelerin tanecikli, boşluklu ve hareketli yapıda olduğunu açıklar." },
          { id: "4.2", text: "Yoğunluğu tanımlar, saf maddelerin yoğunluğunu hesaplar ve ayırt edici özellik olduğunu kavrar." },
          { id: "4.3", text: "Isı iletimi, ısı yalıtımı ve yalıtım malzemelerinin önemini günlük yaşam örnekleriyle açıklar." },
          { id: "4.4", text: "Katı, sıvı ve gaz yakıtları sınıflandırarak çevreye etkilerini değerlendirir." }
        ]
      },
      {
        id: "unit5",
        name: "5. Ünite: Ses ve Özellikleri",
        icon: "🔊",
        outcomes: [
          { id: "5.1", text: "Sesin farklı ortamlarda (katı, sıvı, gaz) farklı yayıldığını ve farklı duyulduğunu açıklar." },
          { id: "5.2", text: "Sesin süratinin ortamın yoğunluğuna ve sıcaklığına bağlı olduğunu kavrar, ışık süratiyle kıyaslar." },
          { id: "5.3", text: "Sesin maddeyle etkileşimini (yansıma, iletim, soğurulma, yankı) ve ses yalıtımını inceler." }
        ]
      },
      {
        id: "unit6",
        name: "6. Ünite: Vücudumuzdaki Sistemler ve Sağlığı",
        icon: "🧠",
        outcomes: [
          { id: "6.1", text: "Denetleyici ve düzenleyici sistemleri (sinir sistemi ve iç salgı bezleri) açıklar." },
          { id: "6.2", text: "Duyu organlarının (göz, kulak, burun, dil, deri) yapı ve işleyişini açıklar." },
          { id: "6.3", text: "Sistemlerin sağlığını koruma, organ bağışı ve ilk yardımın önemini değerlendirir." }
        ]
      },
      {
        id: "unit7",
        name: "7. Ünite: Elektriğin İletimi",
        icon: "🔌",
        outcomes: [
          { id: "7.1", text: "Maddeleri elektriği iletme durumlarına göre iletken ve yalıtkan olarak sınıflandırır." },
          { id: "7.2", text: "Bir iletkenin direncinin bağlı olduğu faktörleri (uzunluk, kesit alanı, iletkenin cinsi) test eder." }
        ]
      }
    ]
  },
  "7": {
    grade: "7",
    subject: "Fen Bilimleri",
    units: [
      {
        id: "unit1",
        name: "1. Ünite: Güneş Sistemi ve Ötesi",
        icon: "🔭",
        outcomes: [
          { id: "1.1", text: "Uzay araştırmaları, uzay araçları, yapay uydular ve uzay kirliliğini açıklar." },
          { id: "1.2", text: "Teleskobun yapısını ve gök bilimin gelişimindeki önemini açıklar." },
          { id: "1.3", text: "Yıldız, takımyıldız, galaksi (gök ada), kara delik ve evren kavramlarını açıklar." }
        ]
      },
      {
        id: "unit2",
        name: "2. Ünite: Hücre ve Bölünmeler",
        icon: "🔬",
        outcomes: [
          { id: "2.1", text: "Hayvan ve bitki hücrelerini temel kısımları ve organelleri açısından karşılaştırır." },
          { id: "2.2", text: "Hücre-doku-organ-sistem-organizma ilişkisini kavrar." },
          { id: "2.3", text: "Mitoz bölünmenin evrelerini ve canlılar için önemini açıklar." },
          { id: "2.4", text: "Mayoz bölünmenin evrelerini, önemini ve mitoz ile arasındaki farkları kavrar." }
        ]
      },
      {
        id: "unit3",
        name: "3. Ünite: Kuvvet ve Enerji",
        icon: "🏃‍♂️",
        outcomes: [
          { id: "3.1", text: "Kütle ve ağırlık kavramlarını karşılaştırır; yer çekimi kuvvetini açıklar." },
          { id: "3.2", text: "Fiziksel anlamda yapılan işi kuvvet ve alınan yol ilişkisiyle tanımlar." },
          { id: "3.3", text: "Kinetik ve potansiyel (çekim ve esneklik) enerji türlerini açıklar." },
          { id: "3.4", text: "Enerjinin korunduğunu, sürtünme kuvvetinin kinetik enerjiyi ısıya dönüştürdüğünü açıklar." }
        ]
      },
      {
        id: "unit4",
        name: "4. Ünite: Saf Madde ve Karışımlar",
        icon: "⚗️",
        outcomes: [
          { id: "4.1", text: "Atomun yapısını, temel parçacıklarını (proton, nötron, elektron) ve molekül kavramını açıklar." },
          { id: "4.2", text: "Element ve bileşik kavramlarını sembol ve formülleriyle açıklar." },
          { id: "4.3", text: "Homojen ve heterojen karışımları ayırt eder; çözünme hızını etkileyen faktörleri test eder." },
          { id: "4.4", text: "Karışımları ayırma yöntemlerini (buharlaştırma, damıtma, yoğunluk farkı, mıknatıs vb.) uygular." }
        ]
      },
      {
        id: "unit5",
        name: "5. Ünite: Işığın Madde ile Etkileşimi",
        icon: "🌈",
        outcomes: [
          { id: "5.1", text: "Işığın soğurulmasını, renklerin oluşumunu ve beyaz ışığın prizmada ayrılmasını açıklar." },
          { id: "5.2", text: "Düzlem, çukur ve tümsek aynalarda görüntü özelliklerini ve kullanım alanlarını açıklar." },
          { id: "5.3", text: "Işığın kırılmasını, ortam yoğunluğu ilişkisini ve merceklerin (ince/kalın kenarlı) özelliklerini kavrar." }
        ]
      },
      {
        id: "unit6",
        name: "6. Ünite: Canlılarda Üreme, Büyüme ve Gelişme",
        icon: "🦋",
        outcomes: [
          { id: "6.1", text: "İnsanda üremeyi sağlayan yapı ve organları, döllenme, embriyo ve bebek gelişimini açıklar." },
          { id: "6.2", text: "Hayvanlarda üreme, büyüme ve başkalaşım süreçlerini (kelebek, kurbağa vb.) açıklar." },
          { id: "6.3", text: "Bitkilerde eşeyli ve eşeysiz üreme, tozlaşma, döllenme ve çimlenme şartlarını açıklar." }
        ]
      },
      {
        id: "unit7",
        name: "7. Ünite: Elektrik Devreleri",
        icon: "💡",
        outcomes: [
          { id: "7.1", text: "Seri ve paralel bağlı ampullerden oluşan devreler kurar; ampul parlaklıklarını karşılaştırır." },
          { id: "7.2", text: "Devredeki elektrik akımını (ampermetre), gerilimi (voltmetre) ve Ohm Kanunu'nu (V=I*R) açıklar." }
        ]
      }
    ]
  },
  "8": {
    grade: "8",
    subject: "Fen Bilimleri",
    units: [
      {
        id: "unit1",
        name: "1. Ünite: Mevsimler ve İklim (LGS)",
        icon: "🌦️",
        outcomes: [
          { id: "1.1", text: "Dünya'nın eksen eğikliği ve Güneş etrafındaki dolanma hareketine bağlı olarak mevsimlerin oluşumunu açıklar." },
          { id: "1.2", text: "İklim ve hava olayları arasındaki farkları açıklar; küresel iklim değişikliklerinin nedenlerini ve sonuçlarını değerlendirir." }
        ]
      },
      {
        id: "unit2",
        name: "2. Ünite: DNA ve Genetik Kod (LGS)",
        icon: "🧬",
        outcomes: [
          { id: "2.1", text: "Nükleotid, gen, DNA ve kromozom kavramlarını basitten karmaşığa sıralar ve DNA'nın yapısını açıklar." },
          { id: "2.2", text: "DNA'nın kendini eşlemesini model üzerinde açıklar." },
          { id: "2.3", text: "Kalıtım ile ilgili kavramları (genotip, fenotip, baskın/çekinik gen) ve tek karakter çaprazlamalarını yapar." },
          { id: "2.4", text: "Mutasyon, modifikasyon, adaptasyon, doğal seçilim ve varyasyon kavramlarını örneklerle açıklar." },
          { id: "2.5", text: "Biyoteknoloji uygulamalarını, insanlık için yararlarını ve risklerini değerlendirir." }
        ]
      },
      {
        id: "unit3",
        name: "3. Ünite: Basınç (LGS)",
        icon: "📦",
        outcomes: [
          { id: "3.1", text: "Katı basıncını etkileyen değişkenleri (kuvvet/ağırlık ve yüzey alanı) deneylerle keşfeder." },
          { id: "3.2", text: "Sıvı basıncını etkileyen değişkenleri (sıvı derinliği ve yoğunluğu) ve Pascal prensibini açıklar." },
          { id: "3.3", text: "Açık hava (gaz) basıncını ve günlük hayattaki uygulamalarını açıklar." }
        ]
      },
      {
        id: "unit4",
        name: "4. Ünite: Madde ve Endüstri (LGS)",
        icon: "🧪",
        outcomes: [
          { id: "4.1", text: "Periyodik sistemde grup/periyotları belirler; metaller, ametaller, yarı metaller ve soygazların özelliklerini açıklar." },
          { id: "4.2", text: "Fiziksel ve kimyasal değişimleri ayırt eder." },
          { id: "4.3", text: "Kimyasal tepkimeleri, kütlenin korunumunu ve tepkime denklemlerini yorumlar." },
          { id: "4.4", text: "Asitler ve bazların özelliklerini, pH ölçeğini, belirteçleri ve asit yağmurlarını açıklar." },
          { id: "4.5", text: "Maddenin ısı ile etkileşimini (öz ısı, hâl değiştirme ısısı ve ısınma/soğuma grafikleri) açıklar." },
          { id: "4.6", text: "Türkiye'de kimya endüstrisinin gelişimini değerlendirir." }
        ]
      },
      {
        id: "unit5",
        name: "5. Ünite: Basit Makineler (LGS)",
        icon: "⚙️",
        outcomes: [
          { id: "5.1", text: "Basit makinelerin sağladığı avantajları (kuvvet kazancı, yoldan kazanç, iş kolaylığı) açıklar; iş ve enerjiden kazanç olmadığını kavrar." },
          { id: "5.2", text: "Kaldıraç, makara (sabit, hareketli, palanga), eğik düzlem, çıkrık, dişli çark, kasnak ve vida sistemlerini açıklar." }
        ]
      },
      {
        id: "unit6",
        name: "6. Ünite: Enerji Dönüşümleri ve Çevre Bilimi (LGS)",
        icon: "🌿",
        outcomes: [
          { id: "6.1", text: "Besin zinciri, üreticiler, tüketiciler, ayrıştırıcılar ve ekolojik enerji piramidini açıklar." },
          { id: "6.2", text: "Fotosentez ve solunum olaylarını, denklemlerini ve aralarındaki ilişkiyi kavrar." },
          { id: "6.3", text: "Madde döngülerini (su, karbon, oksijen, azot) ve küresel çevre sorunlarını açıklar." },
          { id: "6.4", text: "Sürdürülebilir kalkınma ve ekolojik ayak izinin önemini değerlendirir." }
        ]
      },
      {
        id: "unit7",
        name: "7. Ünite: Elektrik Yükleri ve Elektrik Enerjisi (LGS)",
        icon: "⚡",
        outcomes: [
          { id: "7.1", text: "Elektriklenmeyi (sürtünme, dokunma, etki) ve elektroskopun çalışma prensibini açıklar." },
          { id: "7.2", text: "Topraklama olayını ve şimşek/yıldırım gibi doğa olaylarını kavrar." },
          { id: "7.3", text: "Elektrik enerjisinin ısı, ışık ve hareket enerjisine dönüşümünü; sigorta ve elektrik güvenliğini açıklar." }
        ]
      }
    ]
  }
};

// Müfredat endpoint'i
app.get('/api/curriculum', (req, res) => {
  const grade = req.query.grade || "5";
  const curr = ALL_CURRICULUM[grade] || ALL_CURRICULUM["5"];
  res.json(curr);
});

// Gök Cisimleri Base64 Varlık Endpoint'i (html2canvas ve PDF için sıfır gecikmeli, %100 çevrimdışı)
app.get('/api/celestial-assets', (req, res) => {
  try {
    const sunPath = path.join(__dirname, 'public', 'images', 'sun.jpg');
    const earthPath = path.join(__dirname, 'public', 'images', 'earth.jpg');
    const moonPath = path.join(__dirname, 'public', 'images', 'moon.jpg');
    
    const sun = fs.existsSync(sunPath) ? 'data:image/jpeg;base64,' + fs.readFileSync(sunPath).toString('base64') : '';
    const earth = fs.existsSync(earthPath) ? 'data:image/jpeg;base64,' + fs.readFileSync(earthPath).toString('base64') : '';
    const moon = fs.existsSync(moonPath) ? 'data:image/jpeg;base64,' + fs.readFileSync(moonPath).toString('base64') : '';
    
    res.json({ success: true, assets: { sun, earth, moon } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LaTeX ve Bozuk Karakter Temizleme Motoru
function cleanTurkishAndLatex(str) {
  if (typeof str !== 'string') return str || '';
  let text = str;
  // Strip LaTeX math delimiters ($...$ veya $$...$$)
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, '$1');
  text = text.replace(/\$([^$]+)\$/g, '$1');
  // Strip common LaTeX commands
  text = text.replace(/\\(text|mathbf|mathrm|mathit)\{([^}]+)\}/g, '$2');
  // Replace escaped math relational symbols
  text = text.replace(/\\>/g, '>');
  text = text.replace(/\\</g, '<');
  text = text.replace(/\\ge(q)?/g, '≥');
  text = text.replace(/\\le(q)?/g, '≤');
  // Fix corrupt Turkish characters & spellings
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
  // Fix comparison spacing (örn: "Ay>Dünya>Güneş" -> "Ay > Dünya > Güneş")
  text = text.replace(/([A-Za-zÇĞİÖŞÜçğıöşü]+)\s*>\s*([A-Za-zÇĞİÖŞÜçğıöşü]+)/g, '$1 > $2');
  text = text.replace(/([A-Za-zÇĞİÖŞÜçğıöşü]+)\s*<\s*([A-Za-zÇĞİÖŞÜçğıöşü]+)/g, '$1 < $2');
  return text.trim();
}

// Gerçekçi Gök Cisimleri (Güneş, Dünya, Ay) Görsel Şablon ve Zenginleştirme Motoru
// KURAL: Siyah / Koyu zeminler kesinlikle kullanılmaz. Saf beyaz (#ffffff) veya şeffaf zemin ve koyu net metinler kullanılır.
function enhanceCelestialVisual(visual_svg, question, options = {}) {
  const textToScan = `${question || ''} ${Object.values(options || {}).join(' ')} ${visual_svg || ''}`.toLowerCase();
  
  const hasGunes = textToScan.includes('güneş') || textToScan.includes('gunes') || textToScan.includes('sun');
  const hasDunya = textToScan.includes('dünya') || textToScan.includes('dunya') || textToScan.includes('earth');
  const hasAy = textToScan.includes('ay') || textToScan.includes('moon') || textToScan.includes('hilal') || textToScan.includes('dolunay');

  // SVG'lerdeki olası koyu/siyah arka planları ve yıldız noktalarını beyaz zemin standardına dönüştür
  function sanitizeToWhiteBackground(svgContent) {
    if (!svgContent) return '';
    let cleaned = svgContent;
    if (!cleaned.includes('xmlns:xlink')) {
      cleaned = cleaned.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }
    // Font ailesini Times New Roman standardına geçir
    cleaned = cleaned.replace(/font-family=["'][^"']*["']/gi, 'font-family="\'Times New Roman\', Times, serif"');
    // Siyah/koyu zemin rect'lerini beyaz/şeffaf ve ince gri bordürlü yap
    cleaned = cleaned.replace(/fill=["']#(070a12|090d16|0b0f19|000000|0f172a|030712|1e1b4b|1e293b|000)["']/gi, 'fill="#ffffff" stroke="#e2e8f0" stroke-width="1"');
    cleaned = cleaned.replace(/fill=["']black["']/gi, 'fill="#ffffff" stroke="#e2e8f0" stroke-width="1"');
    cleaned = cleaned.replace(/fill=["']rgba?\(\s*0\s*,\s*0\s*,\s*0[^)]*\)["']/gi, 'fill="#ffffff" stroke="#e2e8f0" stroke-width="1"');
    // Yıldız noktalarını temizle
    cleaned = cleaned.replace(/<circle[^>]*opacity=["']0\.[0-9]+["'][^>]*fill=["']#(fff|ffffff)["'][^>]*\/?>/gi, '');
    cleaned = cleaned.replace(/<circle[^>]*fill=["']#(fff|ffffff)["'][^>]*opacity=["']0\.[0-9]+["'][^>]*\/?>/gi, '');
    // Koyu zemindeki açık/beyaz metinleri beyaz zemin için koyu renge dönüştür
    cleaned = cleaned.replace(/fill=["']#fbbf24["']/gi, 'fill="#b45309"'); // Güneş açık sarı -> koyu kehribar
    cleaned = cleaned.replace(/fill=["']#38bdf8["']/gi, 'fill="#0369a1"'); // Dünya açık mavi -> koyu okyanus mavisi
    cleaned = cleaned.replace(/fill=["']#e2e8f0["']/gi, 'fill="#334155"'); // Ay açık gri -> koyu arduvaz gri
    cleaned = cleaned.replace(/fill=["']#(f8fafc|ffffff|fff)["'](?=[^>]*font-)/gi, 'fill="#0f172a"'); // Beyaz yazılar -> koyu lacivert
    // SVG içindeki bozuk kelimeleri düzelt
    cleaned = cleaned.replace(/\bDiinya\b/g, 'Dünya');
    cleaned = cleaned.replace(/\bdiinya\b/g, 'dünya');
    cleaned = cleaned.replace(/\bGiines\b/g, 'Güneş');
    cleaned = cleaned.replace(/\bgiines\b/g, 'güneş');
    cleaned = cleaned.replace(/\bGunes\b/g, 'Güneş');
    cleaned = cleaned.replace(/\bgunes\b/g, 'güneş');
    cleaned = cleaned.replace(/\bDunya\b/g, 'Dünya');
    cleaned = cleaned.replace(/\bdunya\b/g, 'dünya');
    return cleaned;
  }

  // Eğer zaten /images/ barındırıyorsa, koyu zeminleri temizle ve döndür
  if (visual_svg && visual_svg.includes('/images/') && visual_svg.includes('<image')) {
    return sanitizeToWhiteBackground(visual_svg);
  }

  // Gök cisimleri ile ilgili olup olmadığını belirle
  const isSizeComparison = (hasGunes && hasDunya && hasAy) || 
                           ((textToScan.includes('büyüklük') || textToScan.includes('boyut') || textToScan.includes('kıyas') || textToScan.includes('basketbol topu') || textToScan.includes('sıralama') || textToScan.includes('hacim')) && (hasGunes || hasDunya || hasAy));
                           
  const isLightReflection = textToScan.includes('ışık kaynağı') || textToScan.includes('isik kaynagi') || textToScan.includes('yansıt') || textToScan.includes('yansit');
  
  const isShapeQuestion = (textToScan.includes('geometrik şekil') || textToScan.includes('geometrik sekil') || textToScan.includes('küre') || textToScan.includes('kure')) && (hasGunes && hasAy);

  // Şablon 1: Güneş, Dünya ve Ay 3 Cisim Boyut Karşılaştırması (Güneş >> Dünya > Ay) - Beyaz Zemin (Büyük Görsel)
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

  // Şablon 2: Işık Kaynağı ve Yansıtıcı (Güneş & Ay Işık İlişkisi) - Beyaz Zemin (Büyük Görsel)
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

  // Şablon 3: Güneş ve Ay Geometrik Şekil Karşılaştırması - Beyaz Zemin (Büyük Görsel)
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

  // Şablon 4: Tek Başına Güneş - Beyaz Zemin (Büyük Görsel)
  if (hasGunes && !hasDunya && !hasAy) {
    return `<svg viewBox="0 0 520 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <clipPath id="sunSoloClip"><circle cx="260" cy="95" r="76"/></clipPath>
  </defs>
  <rect x="0" y="0" width="520" height="220" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
  <image href="/images/sun.jpg" xlink:href="/images/sun.jpg" x="184" y="19" width="152" height="152" clip-path="url(#sunSoloClip)" preserveAspectRatio="xMidYMid slice"/>
  <circle cx="260" cy="95" r="76" fill="none" stroke="#f59e0b" stroke-width="2"/>
  <text x="260" y="186" text-anchor="middle" fill="#b45309" font-family="'Times New Roman', Times, serif" font-size="13.5" font-weight="800" letter-spacing="2">GÜNEŞ</text>
  <text x="260" y="204" text-anchor="middle" fill="#64748b" font-family="'Times New Roman', Times, serif" font-size="10" font-weight="600">Orta Büyüklükte Bir Yıldız • Isı ve Işık Kaynağı • Küresel Şekil</text>
</svg>`;
  }

  // Şablon 5: Tek Başına Ay - Beyaz Zemin (Büyük Görsel)
  if (hasAy && !hasGunes && !hasDunya) {
    return `<svg viewBox="0 0 520 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <clipPath id="moonSoloClip"><circle cx="260" cy="95" r="74"/></clipPath>
  </defs>
  <rect x="0" y="0" width="520" height="220" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
  <image href="/images/moon.jpg" xlink:href="/images/moon.jpg" x="186" y="21" width="148" height="148" clip-path="url(#moonSoloClip)" preserveAspectRatio="xMidYMid slice"/>
  <circle cx="260" cy="95" r="74" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="260" y="186" text-anchor="middle" fill="#334155" font-family="'Times New Roman', Times, serif" font-size="13.5" font-weight="800" letter-spacing="2">AY</text>
  <text x="260" y="204" text-anchor="middle" fill="#64748b" font-family="'Times New Roman', Times, serif" font-size="10" font-weight="600">Dünya'nın Doğal Uydusu • Yüzeyinde Kraterler Bulunur • İnce Atmosfer</text>
</svg>`;
  }

  // Şablon 6: Tek Başına Dünya - Beyaz Zemin (Büyük Görsel)
  if (hasDunya && !hasGunes && !hasAy) {
    return `<svg viewBox="0 0 520 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <clipPath id="earthSoloClip"><circle cx="260" cy="95" r="72"/></clipPath>
  </defs>
  <rect x="0" y="0" width="520" height="220" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
  <image href="/images/earth.jpg" xlink:href="/images/earth.jpg" x="188" y="23" width="144" height="144" clip-path="url(#earthSoloClip)" preserveAspectRatio="xMidYMid slice"/>
  <circle cx="260" cy="95" r="72" fill="none" stroke="#0284c7" stroke-width="1.5"/>
  <text x="260" y="186" text-anchor="middle" fill="#0369a1" font-family="'Times New Roman', Times, serif" font-size="13.5" font-weight="800" letter-spacing="2">DÜNYA</text>
  <text x="260" y="204" text-anchor="middle" fill="#64748b" font-family="'Times New Roman', Times, serif" font-size="10" font-weight="600">Mavi Gezegen • Canlı Yaşamı • Katmanlı Atmosfer</text>
</svg>`;
  }

  // Genel daireli veya diğer SVG çizimlerini sanitize et
  if (visual_svg) {
    if (visual_svg.includes('<circle') && (hasGunes || hasDunya || hasAy)) {
      if (hasGunes && (hasDunya || hasAy)) {
        return enhanceCelestialVisual('', 'güneş dünya ay boyut kıyaslama', {});
      }
    }
    return sanitizeToWhiteBackground(visual_svg);
  }

  return visual_svg;
}

// Soru Üretim Endpoint'i (Tüm Soru Türlerini Destekler)
app.post('/api/generate-questions', async (req, res) => {
  try {
    const {
      grade = "5",
      subject = "Fen Bilimleri",
      learning_area = "",
      selected_outcomes = [],
      question_count = 5,
      difficulty = "Karma (Dengeli)",
      question_type = "multiple_choice" // multiple_choice | short_answer | open_ended | structured_grid | concept_map | v_diagram | mixed
    } = req.body;

    const outcomesList = Array.isArray(selected_outcomes) && selected_outcomes.length > 0 
      ? selected_outcomes 
      : (req.body.learning_outcome ? [req.body.learning_outcome] : []);

    if (outcomesList.length === 0) {
      return res.status(400).json({ error: "Lütfen en az bir öğrenme çıktısı seçiniz veya belirtiniz." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return res.status(500).json({
        error: "Google Gemini API anahtarı (.env) yapılandırılmamış. Lütfen geçerli bir GEMINI_API_KEY giriniz."
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Model yoğunluğuna karşı otomatik yedekli model listesi (Fallback Engine)
    const CANDIDATE_MODELS = [
      "gemini-3.5-flash-lite",
      "gemini-3.1-flash-lite",
      "gemini-3.6-flash",
      "gemini-3.5-flash",
      "gemini-pro-latest"
    ];

    const outcomesText = outcomesList.map((o, idx) => `${idx + 1}. ${o}`).join('\n');

    // Soru Türü Özel Yönergeleri
    let typeSpecificInstructions = "";
    if (question_type === "short_answer") {
      typeSpecificInstructions = `SORU TÜRÜ: KISA CEVAPLI / BOŞLUK DOLDURMA
- Sorular tek kelimelik veya kısa ifadelerle net cevaplanabilecek şekilde kurgulanmalıdır.
- "options" alanını boş nesne {} bırak veya null yap.
- "type" alanına "short_answer" yaz.
- "correct_answer" alanına beklenen net kısa cevabı yaz.`;
    } else if (question_type === "open_ended") {
      typeSpecificInstructions = `SORU TÜRÜ: AÇIK UÇLU (KLASİK / SÜREÇ VE DENEY ANALİZİ)
- Öğrencinin neden-sonuç ilişkisini, deney adımlarını veya bilimsel gerekçeyi açıklamasını isteyen derinlikli sorular yaz.
- "options" alanını {} yap.
- "type" alanına "open_ended" yaz.
- "correct_answer" veya "explanation" alanına öğrencinin tam puan alması için yazması gereken model cevabı ve puanlama kriterini (Rubrik) ekle.`;
    } else if (question_type === "structured_grid") {
      typeSpecificInstructions = `SORU TÜRÜ: YAPILANDIRILMIŞ GRİD (STRUCTURED GRID)
- 9 adet numaralandırılmış kutucuk (1'den 9'a kadar) içeren bir grid oluştur. "grid_items" dizisine 9 kutucuğun terimlerini veya kavramlarını yaz.
- "visual_svg" alanında bu 3x3 kutucuklu ızgarayı gösteren şık bir SVG çiz.
- Soru kökünde bu kutucukları referans alan 2-3 alt soru sor (Örn: "A) Yukarıdaki kutucuklardan hangileri ...? B) Hangisi ...?").
- "type" alanına "structured_grid" yaz.
- "correct_answer" alanına ilgili kutucuk numaralarını yaz (Örn: "A: 2, 5, 8 | B: 1, 4").`;
    } else if (question_type === "concept_map") {
      typeSpecificInstructions = `SORU TÜRÜ: KAVRAM HARİTASI (CONCEPT MAP)
- "visual_svg" alanında kavramlar, bağlantı okları ve aralarındaki bağlayıcı ifadelerden oluşan hiyerarşik bir kavram haritası çiz.
- Haritada 2-3 kutucuğu I, II, III veya A, B, C şeklinde boş bırak.
- Soru metninde öğrenciden bu boş bırakılan yerlere gelmesi gereken kavramları bulmasını iste.
- "type" alanına "concept_map" yaz.`;
    } else if (question_type === "v_diagram") {
      typeSpecificInstructions = `SORU TÜRÜ: V DİYAGRAMI (VEE DIAGRAM)
- Bilimsel bir araştırma veya deney sürecini V diyagramı formatında modelle.
- "visual_svg" alanında sol tarafı 'Kavramsal/Teorik Kısım' (İlkeler, Kavramlar), ortası 'Odak Soru' ve sağ tarafı 'Uygulama/Metodolojik Kısım' (Gözlemler, Veriler, Sonuç) olan bir V diyagramı çiz.
- Diyagramdaki belirli aşamaları sorarak bilimsel süreç becerilerini ölç.
- "type" alanına "v_diagram" yaz.`;
    } else if (question_type === "mixed") {
      typeSpecificInstructions = `SORU TÜRÜ: KARMA TEST (BÜTÜNLEŞİK ÇOKLU SORU TARZI)
- İstenen soru sayısına göre soruları farklı türlerden dengeli şekilde karma olarak üret: Çoktan seçmeli ("multiple_choice"), Kısa cevaplı ("short_answer"), Açık uçlu ("open_ended"), Yapılandırılmış grid ("structured_grid"), Kavram haritası ("concept_map") veya V diyagramı ("v_diagram").
- Her sorunun "type" alanına ilgili türünü mutlaka doğru yaz.`;
    } else {
      typeSpecificInstructions = `SORU TÜRÜ: ÇOKTAN SEÇMELİ (4 SEÇENEKLİ)
- Her soruda mutlaka "options" altında A, B, C, D seçenekleri ve tek net "correct_answer" bulunmalıdır.
- "type" alanına "multiple_choice" yaz.`;
    }

    const systemPrompt = `Sen Milli Eğitim Bakanlığı (MEB) müfredatına, alternatif ölçme-değerlendirme yöntemlerine ve yeni nesil soru yazım standartlarına tam hakim, uzman bir ${grade}. Sınıf ${subject} soru yazarısın.

GÖREVİN:
Verilen sınıf seviyesi (${grade}. Sınıf), ders (${subject}), seçilen öğrenme çıktıları ve İSTENEN SORU TÜRÜNE UYGUN, görsel ve pedagojik kalitede sorular üretmek.

${typeSpecificInstructions}

GÖRSEL, DENEY DÜZENEĞİ VE ŞEKİL ÇİZİM KURALLARI (ZORUNLU - ÇOK BÜYÜK, GERÇEKÇİ VE NET OLMALI):
- Her soru için "visual_svg" alanında soruya ait bilimsel şekli, deney düzeneğini, şemayı, grafik tablosunu veya kavram modelini gösteren GEÇERLİ, CANLI, BÜYÜK VE NET bir inline SVG kodu üret.
- ARKA PLAN VE ZEMİN KURALI (KESİNLİKLE ŞEFFAF VEYA SAF BEYAZ - ÇOK KRİTİK):
  * Siyah, koyu gri, lacivert veya koyu renkli arka planlar (<rect fill="#000..."/>, fill="#070a12", fill="#0f172a" vb.) KESİNLİKLE KULLANILMAYACAKTIR!
  * Yazıcı mürekkebini ve tonerini tüketmemek için tüm görsel ve şema konteynerlerinin arka planı tamamen ŞEFFAF veya SAF BEYAZ (#ffffff) olmalıdır.
  * Şema alanı sınırları için yalnızca çok ince, zarif bir dış kenar çizgisi (<rect x="0" y="0" width="520" height="200" rx="6" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>) kullanılabilir.
  * Yıldız noktacıkları veya koyu uzay kutuları KESİNLİKLE ÇİZİLMEYECEKTİR.
  * Tüm metinler, değerler ve etiketler beyaz zemin üzerinde %100 net okunacak şekilde KOYU RENKLERLE yazılmalıdır (Güneş için fill="#b45309", Dünya için fill="#0369a1", Ay için fill="#334155", diğer yazılar fill="#0f172a"). Beyaz veya açık sarı yazı KULLANILMAYACAKTIR.
- GÖK CİSİMLERİ (GÜNEŞ, DÜNYA, AY) İÇİN GERÇEKÇİ FOTOĞRAFİK DOKU KURALLARI:
  * Basit, düz renkli ve vektörel daire çizimleri KESİNLİKLE YASAKTIR!
  * Sistemde yüksek çözünürlüklü gerçekçi fotoğrafik dokular bulunmaktadır:
    - Güneş için: "/images/sun.jpg" (Alevli, patlamalı, detaylı yüzey plazma dokulu gerçek Güneş fotoğrafı)
    - Dünya için: "/images/earth.jpg" (Okyanusları, kıtaları ve bulutları net Blue Marble Dünya fotoğrafı)
    - Ay için: "/images/moon.jpg" (Kraterleri, denizleri ve Tycho ışınları net gerçekçi Ay yüzeyi fotoğrafı)
  * Bu görseller SVG içerisinde <defs><clipPath id="..."><circle cx="..." cy="..." r="..."/></clipPath></defs> ile dairesel maskelenmeli ve <image href="/images/..." xlink:href="/images/..." ... clip-path="url(#...)" preserveAspectRatio="xMidYMid slice" /> şeklinde yerleştirilmelidir.
- BİLİMSEL BOYUT ORANTISI (ÇOK KRİTİK):
  * Güneş, Dünya ve Ay karşılaştırmalarında:
    - Güneş: Belirgin şekilde ÇOK BÜYÜK (çapı ~130-140px, r="66" civarı, çevresinde ince altın rengi kontur stroke="#f59e0b" stroke-width="2").
    - Dünya: Orta büyüklükte (çapı ~50px, r="25" civarı, çevresinde ince mavi atmosfer konturu stroke="#0284c7" stroke-width="1.5").
    - Ay: Belirgin şekilde EN KÜÇÜK (çapı ~20px, r="10" civarı, çevresinde ince gri kontur stroke="#94a3b8" stroke-width="1.5").
    - Güneş >> Dünya > Ay büyüklük farkı hemen fark edilmelidir. Cisimlerin aynı boyutta çizilmesi KESİNLİKLE YASAKTIR.
- METİN VE ETİKET ÇAKIŞMA KORUMASI (ÖNEMLİ):
  * Şema üzerindeki tüm metinler, değerler, cisim isimleri ve etiketler şekillerin, okların veya dairelerin ÜZERİNE BİNMEYECEK şekilde ferah boşluklara yerleştirilmelidir.
  * Cisim isimleri cisimlerin altına yazılmalıdır (text-anchor="middle", font-family="'Times New Roman', Times, serif", font-weight="800", font-size="13", Güneş için fill="#b45309", Dünya için fill="#0369a1", Ay için fill="#334155").
- SVG kodunda <html> veya markdown etiketi olmamalı, doğrudan <svg ...>...</svg> formatında string olmalıdır.

TİPOGRAFİ, İMLA VE KARAKTER KURALLARI (ÇOK KRİTİK):
- KESİNLİKLE VE ASLA LaTeX sembolleri ($...$, $$...$$, \\text{...} vb.) KULLANILMAYACAKTIR!
- Büyüklük, boyut ve sıralama kıyaslamalarını ham matematik formülleri ($...$) olarak değil, doğrudan düzgün Türkçe kelimelerle ve ' > ' işareti ile yaz (Örnek: 'Güneş > Dünya > Ay' veya 'Güneş, Dünya ve Ay').
- Asla '$Ay>Diinya>Giines$' gibi bozuk karakterler ('Diinya', 'Giines') ve semboller üretilmeyecektir. Her zaman düzgün Türkçe karakterler ('Dünya', 'Güneş', 'Ay', 'Işık') kullanılacaktır.
- SVG çizimlerindeki tüm metinlerde font-family="'Times New Roman', Times, serif" kullanılmalıdır.

GENEL KURALLAR:
1. Her soru seçilen öğrenme çıktılarından birini doğrudan ölçmelidir.
2. Sınıf seviyesine (${grade}. Sınıf) uygun, anlaşılır ve akıcı bir Türkçe kullan.
3. Zorluk seviyesi: "${difficulty}".
4. Yanıtı SADECE ve SADECE aşağıdaki JSON şemasına uygun bir dizi (Array) olarak ver:

[
  {
    "id": 1,
    "type": "multiple_choice | short_answer | open_ended | structured_grid | concept_map | v_diagram",
    "visual_svg": "<svg viewBox=\"0 0 460 150\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">...</svg>",
    "question": "Soru metni veya yönelgesi...",
    "grid_items": ["1. Terim", "2. Terim", ...] // Sadece yapılandırılmış grid ise (9 elemanlı), yoksa boş dizi []
    "options": {
      "A": "A seçeneği",
      "B": "B seçeneği",
      "C": "C seçeneği",
      "D": "D seçeneği"
    }, // Çoktan seçmeli değilse boş nesne {}
    "correct_answer": "Doğru cevap veya model çözüm",
    "learning_outcome": "Sorunun ölçtüğü ilgili öğrenme çıktısı",
    "difficulty": "Kolay | Orta | Zor",
    "explanation": "Detaylı çözüm, puanlama anahtarı (rubrik) veya pedagojik açıklama..."
  }
]`;

    const userPrompt = `Aşağıdaki bilgilere göre tam olarak ${question_count} adet soru hazırla:

- Sınıf Seviyesi: ${grade}. Sınıf
- Ders: ${subject}
- Öğrenme Alanı / Ünite: ${learning_area || "Genel"}
- Seçilen Öğrenme Çıktıları:
${outcomesText}
- İstenen Toplam Soru Sayısı: ${question_count}
- Hedeflenen Zorluk Düzeyi: ${difficulty}
- Seçilen Soru Formatı: ${question_type}

Yanıtı sadece belirtilen JSON formatında ver.`;

    let responseText = null;
    let lastError = null;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        console.log(`[Gemini API] Soru üretimi deneniyor: ${modelName}`);
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.35
          }
        });

        const result = await model.generateContent({
          contents: [
            { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
          ]
        });

        responseText = result.response.text();
        console.log(`[Gemini API] Başarılı model: ${modelName}`);
        break; // Başarılı olunca döngüden çık
      } catch (err) {
        console.warn(`[Gemini API] ${modelName} modelinde hata: ${err.message}. Sonraki modele geçiliyor...`);
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
      console.error("JSON parse hatası:", responseText);
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

    return res.json({
      success: true,
      meta: {
        grade,
        subject,
        learning_area,
        selected_outcomes: outcomesList,
        total_questions: normalizedQuestions.length,
        difficulty,
        question_type
      },
      questions: normalizedQuestions
    });

  } catch (error) {
    console.error("Soru üretim hatası:", error);
    return res.status(500).json({
      error: "Soru üretilirken bir hata oluştu.",
      details: error.message
    });
  }
});

// Word (.docx) Olarak Dışa Aktarma Endpoint'i
app.post('/api/export-docx', async (req, res) => {
  try {
    const { grade = "5", subject = "Fen Bilimleri", learning_area = "", questions = [], include_answers = true } = req.body;

    if (!questions || questions.length === 0) {
      return res.status(400).json({ error: "İndirilecek soru bulunamadı." });
    }

    const docChildren = [];

    // Rotalı Fenci Logo / Görseli
    const logoPath = path.join(__dirname, 'ROTALI FENCİ.jpg');
    if (fs.existsSync(logoPath)) {
      try {
        const logoBuffer = fs.readFileSync(logoPath);
        docChildren.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new ImageRun({
                data: logoBuffer,
                transformation: {
                  width: 80,
                  height: 80
                }
              })
            ],
            spacing: { after: 120 }
          })
        );
      } catch (imgErr) {
        console.error("Görsel yükleme hatası:", imgErr);
      }
    }

    // Başlık
    docChildren.push(
      new Paragraph({
        text: "T.C. MİLLÎ EĞİTİM BAKANLIĞI",
        alignment: AlignmentType.CENTER,
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: `${grade}. SINIF ${subject.toUpperCase()} DENEME SINAVI / YAPRAK TESTİ`,
        alignment: AlignmentType.CENTER,
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 160 }
      })
    );

    if (learning_area) {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Ünite / Konu: ", bold: true }),
            new TextRun({ text: learning_area })
          ],
          spacing: { after: 180 }
        })
      );
    }

    // Öğrenci Bilgi Tablosu
    const borderBox = { style: BorderStyle.SINGLE, size: 4, color: "999999" };
    
    docChildren.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: { top: borderBox, bottom: borderBox, left: borderBox, right: borderBox },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Adı Soyadı: ........................................................" }),
                      new TextRun({ text: "   Sınıfı / Şube: ............ / ............" })
                    ]
                  })
                ]
              }),
              new TableCell({
                borders: { top: borderBox, bottom: borderBox, left: borderBox, right: borderBox },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Tarih: ..... / ..... / 2026   " }),
                      new TextRun({ text: "Puan: ..............", bold: true })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      }),
      new Paragraph({ text: "", spacing: { after: 240 } })
    );

    const target_pages = parseInt(req.body.target_pages, 10) || 1;
    const questionsPerPage = Math.ceil(questions.length / Math.min(target_pages, Math.max(1, questions.length)));

    // Soruları Ekle
    questions.forEach((q, idx) => {
      let typeLabel = "";
      if (q.type === "open_ended") typeLabel = "[Açık Uçlu]";
      else if (q.type === "short_answer") typeLabel = "[Kısa Cevaplı]";
      else if (q.type === "structured_grid") typeLabel = "[Yapılandırılmış Grid]";
      else if (q.type === "concept_map") typeLabel = "[Kavram Haritası]";
      else if (q.type === "v_diagram") typeLabel = "[V Diyagramı]";

      const shouldPageBreak = idx > 0 && target_pages > 1 && (idx % questionsPerPage === 0);

      docChildren.push(
        new Paragraph({
          pageBreakBefore: shouldPageBreak,
          children: [
            new TextRun({ text: `${idx + 1}. `, bold: true, size: 23, color: "1E293B" }),
            typeLabel ? new TextRun({ text: `${typeLabel} `, bold: true, size: 19, color: "4F46E5" }) : new TextRun({ text: "" }),
            new TextRun({ text: q.question, size: 21 })
          ],
          spacing: { before: shouldPageBreak ? 80 : 160, after: 100 }
        })
      );

      // Yapılandırılmış Grid Kutucukları (Eğer varsa)
      if (q.grid_items && q.grid_items.length > 0) {
        const gridRows = [];
        for (let i = 0; i < q.grid_items.length; i += 3) {
          const rowCells = [];
          for (let j = 0; j < 3; j++) {
            const item = q.grid_items[i + j] || "";
            rowCells.push(
              new TableCell({
                borders: { top: borderBox, bottom: borderBox, left: borderBox, right: borderBox },
                children: [new Paragraph({ text: item, size: 20, alignment: AlignmentType.CENTER })]
              })
            );
          }
          gridRows.push(new TableRow({ children: rowCells }));
        }

        docChildren.push(
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: gridRows
          }),
          new Paragraph({ text: "", spacing: { after: 100 } })
        );
      }

      // Çoktan Seçmeli Seçenekleri
      if (q.options && q.options.A) {
        const maxLen = Math.max(
          (q.options.A || '').length,
          (q.options.B || '').length,
          (q.options.C || '').length,
          (q.options.D || '').length
        );

        if (maxLen <= 18) {
          // Tek satırda 4 şık
          docChildren.push(
            new Paragraph({
              children: [
                new TextRun({ text: "   A) ", bold: true, size: 21 }),
                new TextRun({ text: `${q.options.A}      `, size: 21 }),
                new TextRun({ text: "B) ", bold: true, size: 21 }),
                new TextRun({ text: `${q.options.B}      `, size: 21 }),
                new TextRun({ text: "C) ", bold: true, size: 21 }),
                new TextRun({ text: `${q.options.C}      `, size: 21 }),
                new TextRun({ text: "D) ", bold: true, size: 21 }),
                new TextRun({ text: `${q.options.D}`, size: 21 })
              ],
              spacing: { after: 80 }
            })
          );
        } else if (maxLen <= 38) {
          // 2 satırda 2şer şık
          docChildren.push(
            new Paragraph({
              children: [
                new TextRun({ text: "   A) ", bold: true, size: 21 }),
                new TextRun({ text: `${q.options.A}            `, size: 21 }),
                new TextRun({ text: "B) ", bold: true, size: 21 }),
                new TextRun({ text: `${q.options.B}`, size: 21 })
              ],
              spacing: { after: 40 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "   C) ", bold: true, size: 21 }),
                new TextRun({ text: `${q.options.C}            `, size: 21 }),
                new TextRun({ text: "D) ", bold: true, size: 21 }),
                new TextRun({ text: `${q.options.D}`, size: 21 })
              ],
              spacing: { after: 80 }
            })
          );
        } else {
          // Alt alta şıklar
          ['A', 'B', 'C', 'D'].forEach(opt => {
            docChildren.push(
              new Paragraph({
                children: [
                  new TextRun({ text: `   ${opt}) `, bold: true, size: 21 }),
                  new TextRun({ text: q.options[opt] || "", size: 21 })
                ],
                spacing: { after: 60 }
              })
            );
          });
        }
      } else {
        // Açık Uçlu / Kısa Cevaplı Çizgili Yazı Alanı
        docChildren.push(
          new Paragraph({
            text: "Cevap: ........................................................................................................................................................................",
            spacing: { after: 80 }
          }),
          new Paragraph({
            text: "........................................................................................................................................................................................",
            spacing: { after: 100 }
          })
        );
      }

      docChildren.push(new Paragraph({ text: "", spacing: { after: 100 } }));
    });

    // Cevap Anahtarı
    if (include_answers) {
      docChildren.push(
        new Paragraph({
          text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          alignment: AlignmentType.CENTER,
          spacing: { before: 300, after: 100 }
        }),
        new Paragraph({
          text: "CEVAP VE ÇÖZÜM ANAHTARI",
          bold: true,
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 }
        })
      );

      questions.forEach((q, idx) => {
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${idx + 1}. Soru Cevabı: `, bold: true, size: 22, color: "0B6623" }),
              new TextRun({ text: `${q.correct_answer || 'Model Çözüm'}   `, bold: true, size: 22 }),
              q.explanation ? new TextRun({ text: `(${q.explanation})`, size: 20, color: "555555" }) : new TextRun({ text: "" })
            ],
            spacing: { after: 80 }
          })
        );
      });
    }

    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 720, right: 720 }
          }
        },
        children: docChildren
      }]
    });

    const buffer = await Packer.toBuffer(doc);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename=yaprak_test_${grade}_sinif.docx`);
    res.send(buffer);

  } catch (error) {
    console.error("Word dışa aktarma hatası:", error);
    res.status(500).json({ error: "Word belgesi oluşturulamadı.", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`Yaprak Test Soru Üretim Sunucusu Başlatıldı!`);
  console.log(`Erişim Adresi: http://localhost:${PORT}`);
  console.log(`====================================================`);
});
