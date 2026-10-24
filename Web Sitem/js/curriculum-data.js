// Rotalı Fenci MEB Maarif Modeli 5, 6, 7 ve 8. Sınıf Fen Bilimleri Müfredat Veritabanı
// Çevrimdışı ve Sıfır Gecikmeli Doğrudan Erişim
const ALL_CURRICULUM = {
  "5": {
    "grade": "5",
    "subject": "Fen Bilimleri",
    "units": [
      {
        "id": "unit1",
        "name": "1. Ünite: Güneş, Dünya ve Ay",
        "icon": "☀️",
        "outcomes": [
          {
            "id": "1.1",
            "text": "Güneş ve Ay'ın geometrik şeklini ve temel özelliklerini açıklar."
          },
          {
            "id": "1.2",
            "text": "Ay'ın dönme ve dolanma hareketlerini ile ana/ara evrelerini model üzerinde gösterir."
          },
          {
            "id": "1.3",
            "text": "Güneş, Dünya ve Ay'ın birbirlerine göre hareketlerini ve boyut ilişkilerini kavrar."
          }
        ]
      },
      {
        "id": "unit2",
        "name": "2. Ünite: Canlılar Dünyası",
        "icon": "🌱",
        "outcomes": [
          {
            "id": "2.1",
            "text": "Mikroskobik canlılar, mantarlar, bitkiler ve hayvanlar olmak üzere canlıları benzerlik ve farklılıklarına göre sınıflandırır."
          },
          {
            "id": "2.2",
            "text": "Mikroskobik canlıların yararlı ve zararlı etkilerini ayırt eder."
          },
          {
            "id": "2.3",
            "text": "Çiçekli ve çiçeksiz bitkiler ile omurgalı ve omurgasız hayvanları örneklerle açıklar."
          }
        ]
      },
      {
        "id": "unit3",
        "name": "3. Ünite: Kuvvetin Ölçülmesi ve Sürtünme",
        "icon": "⚙️",
        "outcomes": [
          {
            "id": "3.1",
            "text": "Kuvvetin büyüklüğünü dinamometre ile ölçer ve birimini (Newton) ifade eder."
          },
          {
            "id": "3.2",
            "text": "Basit bir dinamometre modeli tasarlar."
          },
          {
            "id": "3.3",
            "text": "Sürtünme kuvvetinin özelliklerini, günlük yaşamdaki olumlu/olumsuz etkilerini ve sürtünmeyi artırma/azaltma yöntemlerini inceler."
          }
        ]
      },
      {
        "id": "unit4",
        "name": "4. Ünite: Madde ve Değişim",
        "icon": "🧪",
        "outcomes": [
          {
            "id": "4.1",
            "text": "Erime, donma, buharlaşma, yoğuşma, süblimleşme ve kırağılaşma olaylarını açıklar."
          },
          {
            "id": "4.2",
            "text": "Erime, donma ve kaynama noktalarının saf maddeler için ayırt edici olduğunu deneylerle gösterir."
          },
          {
            "id": "4.3",
            "text": "Isı ve sıcaklık kavramları arasındaki farkı açıklar."
          },
          {
            "id": "4.4",
            "text": "Isınma ve soğuma sonucu maddelerde genleşme ve büzülme olaylarını açıklar."
          }
        ]
      },
      {
        "id": "unit5",
        "name": "5. Ünite: Işığın Yayılması",
        "icon": "💡",
        "outcomes": [
          {
            "id": "5.1",
            "text": "Işığın doğrusal yayıldığını gösterir."
          },
          {
            "id": "5.2",
            "text": "Düzgün ve dağınık yansımayı karşılaştırır, yansıma kanunlarını uygular."
          },
          {
            "id": "5.3",
            "text": "Maddeleri saydam, yarı saydam ve opak olarak sınıflandırır."
          },
          {
            "id": "5.4",
            "text": "Tam gölgenin nasıl oluştuğunu ve gölge boyutunun neye göre değiştiğini modeller."
          }
        ]
      },
      {
        "id": "unit6",
        "name": "6. Ünite: İnsan ve Çevre",
        "icon": "🌍",
        "outcomes": [
          {
            "id": "6.1",
            "text": "Biyoçeşitliliğin önemini ve biyoçeşitliliği tehdit eden faktörleri değerlendirir."
          },
          {
            "id": "6.2",
            "text": "Çevre kirliliğinin nedenlerini ve çözüm yollarını tartışır."
          },
          {
            "id": "6.3",
            "text": "Deprem, heyelan, sel, volkanik patlama ve kasırga gibi yıkıcı doğa olaylarından korunma yöntemlerini açıklar."
          }
        ]
      },
      {
        "id": "unit7",
        "name": "7. Ünite: Elektrik Devre Elemanları",
        "icon": "⚡",
        "outcomes": [
          {
            "id": "7.1",
            "text": "Basit elektrik devresi elemanlarını (pil, ampul, anahtar, bağlantı kablosu) sembolleriyle çizer ve devre şeması oluşturur."
          },
          {
            "id": "7.2",
            "text": "Devredeki ampul sayısı ve pil sayısının ampul parlaklığı üzerindeki etkisini bağımsız, bağımlı ve kontrol edilen değişkenler üzerinden test eder."
          }
        ]
      }
    ]
  },
  "6": {
    "grade": "6",
    "subject": "Fen Bilimleri",
    "units": [
      {
        "id": "unit1",
        "name": "1. Ünite: Güneş Sistemi ve Tutulmalar",
        "icon": "🪐",
        "outcomes": [
          {
            "id": "1.1",
            "text": "Güneş Sistemi'ndeki gezegenleri birbirleri ile karşılaştırır (Güneş'e yakınlık, büyüklük, karasal/gazsal yapı)."
          },
          {
            "id": "1.2",
            "text": "Güneş ve Ay tutulmasını temsil eden bir model oluşturur ve açıklar."
          }
        ]
      },
      {
        "id": "unit2",
        "name": "2. Ünite: Vücudumuzdaki Sistemler",
        "icon": "🫀",
        "outcomes": [
          {
            "id": "2.1",
            "text": "Destek ve hareket sistemine ait yapı ve organları (kemik, eklem, kas) açıklar."
          },
          {
            "id": "2.2",
            "text": "Sindirim sistemini oluşturan yapı ve organların görevlerini, mekanik ve kimyasal sindirimi açıklar."
          },
          {
            "id": "2.3",
            "text": "Dolaşım sistemini (kalp, damarlar, kan, büyük ve küçük kan dolaşımı, kan grupları) açıklar."
          },
          {
            "id": "2.4",
            "text": "Solunum sistemini oluşturan yapı ve organların görevlerini açıklar."
          },
          {
            "id": "2.5",
            "text": "Boşaltım sistemini oluşturan yapı ve organların görevlerini açıklar."
          }
        ]
      },
      {
        "id": "unit3",
        "name": "3. Ünite: Kuvvet ve Hareket",
        "icon": "🏹",
        "outcomes": [
          {
            "id": "3.1",
            "text": "Bir cisme etki eden birden fazla kuvveti deneyerek keşfeder (Bileşke kuvvet, dengelenmiş ve dengelenmemiş kuvvetler)."
          },
          {
            "id": "3.2",
            "text": "Sabit süratli hareketlinin konum-zaman ve sürat-zaman grafiklerini çizer ve yorumlar."
          }
        ]
      },
      {
        "id": "unit4",
        "name": "4. Ünite: Madde ve Isı",
        "icon": "🔥",
        "outcomes": [
          {
            "id": "4.1",
            "text": "Maddelerin tanecikli, boşluklu ve hareketli yapıda olduğunu açıklar."
          },
          {
            "id": "4.2",
            "text": "Yoğunluğu tanımlar, saf maddelerin yoğunluğunu hesaplar ve ayırt edici özellik olduğunu kavrar."
          },
          {
            "id": "4.3",
            "text": "Isı iletimi, ısı yalıtımı ve yalıtım malzemelerinin önemini günlük yaşam örnekleriyle açıklar."
          },
          {
            "id": "4.4",
            "text": "Katı, sıvı ve gaz yakıtları sınıflandırarak çevreye etkilerini değerlendirir."
          }
        ]
      },
      {
        "id": "unit5",
        "name": "5. Ünite: Ses ve Özellikleri",
        "icon": "🔊",
        "outcomes": [
          {
            "id": "5.1",
            "text": "Sesin farklı ortamlarda (katı, sıvı, gaz) farklı yayıldığını ve farklı duyulduğunu açıklar."
          },
          {
            "id": "5.2",
            "text": "Sesin süratinin ortamın yoğunluğuna ve sıcaklığına bağlı olduğunu kavrar, ışık süratiyle kıyaslar."
          },
          {
            "id": "5.3",
            "text": "Sesin maddeyle etkileşimini (yansıma, iletim, soğurulma, yankı) ve ses yalıtımını inceler."
          }
        ]
      },
      {
        "id": "unit6",
        "name": "6. Ünite: Vücudumuzdaki Sistemler ve Sağlığı",
        "icon": "🧠",
        "outcomes": [
          {
            "id": "6.1",
            "text": "Denetleyici ve düzenleyici sistemleri (sinir sistemi ve iç salgı bezleri) açıklar."
          },
          {
            "id": "6.2",
            "text": "Duyu organlarının (göz, kulak, burun, dil, deri) yapı ve işleyişini açıklar."
          },
          {
            "id": "6.3",
            "text": "Sistemlerin sağlığını koruma, organ bağışı ve ilk yardımın önemini değerlendirir."
          }
        ]
      },
      {
        "id": "unit7",
        "name": "7. Ünite: Elektriğin İletimi",
        "icon": "🔌",
        "outcomes": [
          {
            "id": "7.1",
            "text": "Maddeleri elektriği iletme durumlarına göre iletken ve yalıtkan olarak sınıflandırır."
          },
          {
            "id": "7.2",
            "text": "Bir iletkenin direncinin bağlı olduğu faktörleri (uzunluk, kesit alanı, iletkenin cinsi) test eder."
          }
        ]
      }
    ]
  },
  "7": {
    "grade": "7",
    "subject": "Fen Bilimleri",
    "units": [
      {
        "id": "unit1",
        "name": "1. Ünite: Güneş Sistemi ve Ötesi",
        "icon": "🔭",
        "outcomes": [
          {
            "id": "1.1",
            "text": "Uzay araştırmaları, uzay araçları, yapay uydular ve uzay kirliliğini açıklar."
          },
          {
            "id": "1.2",
            "text": "Teleskobun yapısını ve gök bilimin gelişimindeki önemini açıklar."
          },
          {
            "id": "1.3",
            "text": "Yıldız, takımyıldız, galaksi (gök ada), kara delik ve evren kavramlarını açıklar."
          }
        ]
      },
      {
        "id": "unit2",
        "name": "2. Ünite: Hücre ve Bölünmeler",
        "icon": "🔬",
        "outcomes": [
          {
            "id": "2.1",
            "text": "Hayvan ve bitki hücrelerini temel kısımları ve organelleri açısından karşılaştırır."
          },
          {
            "id": "2.2",
            "text": "Hücre-doku-organ-sistem-organizma ilişkisini kavrar."
          },
          {
            "id": "2.3",
            "text": "Mitoz bölünmenin evrelerini ve canlılar için önemini açıklar."
          },
          {
            "id": "2.4",
            "text": "Mayoz bölünmenin evrelerini, önemini ve mitoz ile arasındaki farkları kavrar."
          }
        ]
      },
      {
        "id": "unit3",
        "name": "3. Ünite: Kuvvet ve Enerji",
        "icon": "🏃‍♂️",
        "outcomes": [
          {
            "id": "3.1",
            "text": "Kütle ve ağırlık kavramlarını karşılaştırır; yer çekimi kuvvetini açıklar."
          },
          {
            "id": "3.2",
            "text": "Fiziksel anlamda yapılan işi kuvvet ve alınan yol ilişkisiyle tanımlar."
          },
          {
            "id": "3.3",
            "text": "Kinetik ve potansiyel (çekim ve esneklik) enerji türlerini açıklar."
          },
          {
            "id": "3.4",
            "text": "Enerjinin korunduğunu, sürtünme kuvvetinin kinetik enerjiyi ısıya dönüştürdüğünü açıklar."
          }
        ]
      },
      {
        "id": "unit4",
        "name": "4. Ünite: Saf Madde ve Karışımlar",
        "icon": "⚗️",
        "outcomes": [
          {
            "id": "4.1",
            "text": "Atomun yapısını, temel parçacıklarını (proton, nötron, elektron) ve molekül kavramını açıklar."
          },
          {
            "id": "4.2",
            "text": "Element ve bileşik kavramlarını sembol ve formülleriyle açıklar."
          },
          {
            "id": "4.3",
            "text": "Homojen ve heterojen karışımları ayırt eder; çözünme hızını etkileyen faktörleri test eder."
          },
          {
            "id": "4.4",
            "text": "Karışımları ayırma yöntemlerini (buharlaştırma, damıtma, yoğunluk farkı, mıknatıs vb.) uygular."
          }
        ]
      },
      {
        "id": "unit5",
        "name": "5. Ünite: Işığın Madde ile Etkileşimi",
        "icon": "🌈",
        "outcomes": [
          {
            "id": "5.1",
            "text": "Işığın soğurulmasını, renklerin oluşumunu ve beyaz ışığın prizmada ayrılmasını açıklar."
          },
          {
            "id": "5.2",
            "text": "Düzlem, çukur ve tümsek aynalarda görüntü özelliklerini ve kullanım alanlarını açıklar."
          },
          {
            "id": "5.3",
            "text": "Işığın kırılmasını, ortam yoğunluğu ilişkisini ve merceklerin (ince/kalın kenarlı) özelliklerini kavrar."
          }
        ]
      },
      {
        "id": "unit6",
        "name": "6. Ünite: Canlılarda Üreme, Büyüme ve Gelişme",
        "icon": "🦋",
        "outcomes": [
          {
            "id": "6.1",
            "text": "İnsanda üremeyi sağlayan yapı ve organları, döllenme, embriyo ve bebek gelişimini açıklar."
          },
          {
            "id": "6.2",
            "text": "Hayvanlarda üreme, büyüme ve başkalaşım süreçlerini (kelebek, kurbağa vb.) açıklar."
          },
          {
            "id": "6.3",
            "text": "Bitkilerde eşeyli ve eşeysiz üreme, tozlaşma, döllenme ve çimlenme şartlarını açıklar."
          }
        ]
      },
      {
        "id": "unit7",
        "name": "7. Ünite: Elektrik Devreleri",
        "icon": "💡",
        "outcomes": [
          {
            "id": "7.1",
            "text": "Seri ve paralel bağlı ampullerden oluşan devreler kurar; ampul parlaklıklarını karşılaştırır."
          },
          {
            "id": "7.2",
            "text": "Devredeki elektrik akımını (ampermetre), gerilimi (voltmetre) ve Ohm Kanunu'nu (V=I*R) açıklar."
          }
        ]
      }
    ]
  },
  "8": {
    "grade": "8",
    "subject": "Fen Bilimleri",
    "units": [
      {
        "id": "unit1",
        "name": "1. Ünite: Mevsimler ve İklim (LGS)",
        "icon": "🌦️",
        "outcomes": [
          {
            "id": "1.1",
            "text": "Dünya'nın eksen eğikliği ve Güneş etrafındaki dolanma hareketine bağlı olarak mevsimlerin oluşumunu açıklar."
          },
          {
            "id": "1.2",
            "text": "İklim ve hava olayları arasındaki farkları açıklar; küresel iklim değişikliklerinin nedenlerini ve sonuçlarını değerlendirir."
          }
        ]
      },
      {
        "id": "unit2",
        "name": "2. Ünite: DNA ve Genetik Kod (LGS)",
        "icon": "🧬",
        "outcomes": [
          {
            "id": "2.1",
            "text": "Nükleotid, gen, DNA ve kromozom kavramlarını basitten karmaşığa sıralar ve DNA'nın yapısını açıklar."
          },
          {
            "id": "2.2",
            "text": "DNA'nın kendini eşlemesini model üzerinde açıklar."
          },
          {
            "id": "2.3",
            "text": "Kalıtım ile ilgili kavramları (genotip, fenotip, baskın/çekinik gen) ve tek karakter çaprazlamalarını yapar."
          },
          {
            "id": "2.4",
            "text": "Mutasyon, modifikasyon, adaptasyon, doğal seçilim ve varyasyon kavramlarını örneklerle açıklar."
          },
          {
            "id": "2.5",
            "text": "Biyoteknoloji uygulamalarını, insanlık için yararlarını ve risklerini değerlendirir."
          }
        ]
      },
      {
        "id": "unit3",
        "name": "3. Ünite: Basınç (LGS)",
        "icon": "📦",
        "outcomes": [
          {
            "id": "3.1",
            "text": "Katı basıncını etkileyen değişkenleri (kuvvet/ağırlık ve yüzey alanı) deneylerle keşfeder."
          },
          {
            "id": "3.2",
            "text": "Sıvı basıncını etkileyen değişkenleri (sıvı derinliği ve yoğunluğu) ve Pascal prensibini açıklar."
          },
          {
            "id": "3.3",
            "text": "Açık hava (gaz) basıncını ve günlük hayattaki uygulamalarını açıklar."
          }
        ]
      },
      {
        "id": "unit4",
        "name": "4. Ünite: Madde ve Endüstri (LGS)",
        "icon": "🧪",
        "outcomes": [
          {
            "id": "4.1",
            "text": "Periyodik sistemde grup/periyotları belirler; metaller, ametaller, yarı metaller ve soygazların özelliklerini açıklar."
          },
          {
            "id": "4.2",
            "text": "Fiziksel ve kimyasal değişimleri ayırt eder."
          },
          {
            "id": "4.3",
            "text": "Kimyasal tepkimeleri, kütlenin korunumunu ve tepkime denklemlerini yorumlar."
          },
          {
            "id": "4.4",
            "text": "Asitler ve bazların özelliklerini, pH ölçeğini, belirteçleri ve asit yağmurlarını açıklar."
          },
          {
            "id": "4.5",
            "text": "Maddenin ısı ile etkileşimini (öz ısı, hâl değiştirme ısısı ve ısınma/soğuma grafikleri) açıklar."
          },
          {
            "id": "4.6",
            "text": "Türkiye'de kimya endüstrisinin gelişimini değerlendirir."
          }
        ]
      },
      {
        "id": "unit5",
        "name": "5. Ünite: Basit Makineler (LGS)",
        "icon": "⚙️",
        "outcomes": [
          {
            "id": "5.1",
            "text": "Basit makinelerin sağladığı avantajları (kuvvet kazancı, yoldan kazanç, iş kolaylığı) açıklar; iş ve enerjiden kazanç olmadığını kavrar."
          },
          {
            "id": "5.2",
            "text": "Kaldıraç, makara (sabit, hareketli, palanga), eğik düzlem, çıkrık, dişli çark, kasnak ve vida sistemlerini açıklar."
          }
        ]
      },
      {
        "id": "unit6",
        "name": "6. Ünite: Enerji Dönüşümleri ve Çevre Bilimi (LGS)",
        "icon": "🌿",
        "outcomes": [
          {
            "id": "6.1",
            "text": "Besin zinciri, üreticiler, tüketiciler, ayrıştırıcılar ve ekolojik enerji piramidini açıklar."
          },
          {
            "id": "6.2",
            "text": "Fotosentez ve solunum olaylarını, denklemlerini ve aralarındaki ilişkiyi kavrar."
          },
          {
            "id": "6.3",
            "text": "Madde döngülerini (su, karbon, oksijen, azot) ve küresel çevre sorunlarını açıklar."
          },
          {
            "id": "6.4",
            "text": "Sürdürülebilir kalkınma ve ekolojik ayak izinin önemini değerlendirir."
          }
        ]
      },
      {
        "id": "unit7",
        "name": "7. Ünite: Elektrik Yükleri ve Elektrik Enerjisi (LGS)",
        "icon": "⚡",
        "outcomes": [
          {
            "id": "7.1",
            "text": "Elektriklenmeyi (sürtünme, dokunma, etki) ve elektroskopun çalışma prensibini açıklar."
          },
          {
            "id": "7.2",
            "text": "Topraklama olayını ve şimşek/yıldırım gibi doğa olaylarını kavrar."
          },
          {
            "id": "7.3",
            "text": "Elektrik enerjisinin ısı, ışık ve hareket enerjisine dönüşümünü; sigorta ve elektrik güvenliğini açıklar."
          }
        ]
      }
    ]
  }
};

if (typeof window !== 'undefined') {
  window.ALL_CURRICULUM = ALL_CURRICULUM;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ALL_CURRICULUM;
}
