// Vercel Serverless Function: GET /api/curriculum?grade=5
// Türkiye Yüzyılı Maarif Modeli Resmi Fen Bilimleri Müfredatı (5, 6, 7) + LGS (8)

const ALL_CURRICULUM = {
  "5": {
    "grade": "5",
    "subject": "Fen Bilimleri",
    "model": "Türkiye Yüzyılı Maarif Modeli",
    "units": [
      {
        "id": "unit1",
        "num": 1,
        "name": "1. Ünite: Gökyüzündeki Komşularımız ve Biz",
        "icon": "☀️",
        "gradient": "from-amber-500 via-orange-500 to-red-600",
        "subtopics": [
          {
            "num": 1,
            "code": "1.1",
            "title": "1.1. Gökyüzündeki Komşumuz: Güneş",
            "shortTitle": "Gökyüzündeki Komşumuz: Güneş",
            "outcomeCode": "FB.5.1.1",
            "outcomes": [
              {
                "id": "FB.5.1.1",
                "code": "FB.5.1.1",
                "text": "Güneş'in yapısı ve dönme hareketi ile ilgili bilgi toplayabilme."
              }
            ],
            "keywords": [
              "güneş",
              "güneşin yapısı",
              "güneşin özellikleri",
              "güneş lekesi",
              "fotosfer",
              "çekirdek",
              "dönme hareketi",
              "gaz küresi",
              "plazma",
              "1.1"
            ]
          },
          {
            "num": 2,
            "code": "1.2",
            "title": "1.2. Gökyüzündeki Komşumuz: Ay",
            "shortTitle": "Gökyüzündeki Komşumuz: Ay",
            "outcomeCode": "FB.5.1.2",
            "outcomes": [
              {
                "id": "FB.5.1.2",
                "code": "FB.5.1.2",
                "text": "Ay'ın özellikleri, dönme ve dolanma hareketleri ile ilgili bilimsel çıkarım yapabilme."
              },
              {
                "id": "FB.5.1.3",
                "code": "FB.5.1.3",
                "text": "Ay'ın evrelerini temsil eden bilimsel model oluşturabilme."
              }
            ],
            "keywords": [
              "ay",
              "ayın yapısı",
              "ayın özellikleri",
              "krater",
              "atmosfer",
              "toz tabakası",
              "regolit",
              "dönme",
              "dolanma",
              "ayın evreleri",
              "yeni ay",
              "ilk dördün",
              "dolunay",
              "son dördün",
              "hilal",
              "şişkin ay",
              "1.2"
            ]
          },
          {
            "num": 3,
            "code": "1.3",
            "title": "1.3. Dünya’mız ve Gökyüzündeki Komşularımız",
            "shortTitle": "Dünya’mız ve Gökyüzündeki Komşularımız",
            "outcomeCode": "FB.5.1.4",
            "outcomes": [
              {
                "id": "FB.5.1.4",
                "code": "FB.5.1.4",
                "text": "Güneş, Dünya ve Ay'ın birbirlerine göre hareketlerini ve hacimsel büyüklüklerini temsil eden bilimsel model oluşturabilme."
              }
            ],
            "keywords": [
              "dünya",
              "dünyamız",
              "dünyanın şekli",
              "dünyanın hareketleri",
              "büyüklük ilişkisi",
              "model",
              "gök cisimleri",
              "uzaklık",
              "perspektif",
              "1.3"
            ]
          }
        ],
        "outcomes": [
          {
            "id": "FB.5.1.1",
            "code": "FB.5.1.1",
            "text": "Güneş'in yapısı ve dönme hareketi ile ilgili bilgi toplayabilme.",
            "subtopicNum": 1,
            "subtopicTitle": "Gökyüzündeki Komşumuz: Güneş"
          },
          {
            "id": "FB.5.1.2",
            "code": "FB.5.1.2",
            "text": "Ay'ın özellikleri, dönme ve dolanma hareketleri ile ilgili bilimsel çıkarım yapabilme.",
            "subtopicNum": 2,
            "subtopicTitle": "Gökyüzündeki Komşumuz: Ay"
          },
          {
            "id": "FB.5.1.3",
            "code": "FB.5.1.3",
            "text": "Ay'ın evrelerini temsil eden bilimsel model oluşturabilme.",
            "subtopicNum": 2,
            "subtopicTitle": "Gökyüzündeki Komşumuz: Ay"
          },
          {
            "id": "FB.5.1.4",
            "code": "FB.5.1.4",
            "text": "Güneş, Dünya ve Ay'ın birbirlerine göre hareketlerini ve hacimsel büyüklüklerini temsil eden bilimsel model oluşturabilme.",
            "subtopicNum": 3,
            "subtopicTitle": "Dünya’mız ve Gökyüzündeki Komşularımız"
          }
        ]
      },
      {
        "id": "unit2",
        "num": 2,
        "name": "2. Ünite: Kuvveti Tanıyalım",
        "icon": "⚖️",
        "gradient": "from-blue-600 via-indigo-600 to-violet-700",
        "subtopics": [
          {
            "num": 1,
            "code": "2.1",
            "title": "2.1. Kuvvet ve Kuvvetin Ölçülmesi",
            "shortTitle": "Kuvvet ve Kuvvetin Ölçülmesi",
            "outcomeCode": "FB.5.2.1",
            "outcomes": [
              {
                "id": "FB.5.2.1",
                "code": "FB.5.2.1",
                "text": "Kuvveti büyüklüğü ile tanımlayabilme (operasyonel tanım)."
              },
              {
                "id": "FB.5.2.2",
                "code": "FB.5.2.2",
                "text": "Basit araç gereçler kullanarak bir dinamometre modeli tasarlayabilme."
              }
            ],
            "keywords": [
              "kuvvet",
              "dinamometre",
              "newton",
              "kuvvetin ölçülmesi",
              "yay",
              "esneklik",
              "ölçüm",
              "2.1"
            ]
          },
          {
            "num": 2,
            "code": "2.2",
            "title": "2.2. Kütle ve Ağırlık İlişkisi",
            "shortTitle": "Kütle ve Ağırlık İlişkisi",
            "outcomeCode": "FB.5.2.3",
            "outcomes": [
              {
                "id": "FB.5.2.3",
                "code": "FB.5.2.3",
                "text": "Kütle ve ağırlık kavramlarını karşılaştırabilme; yer çekimi kuvvetini ağırlık olarak tanımlayabilme."
              }
            ],
            "keywords": [
              "kütle",
              "ağırlık",
              "yer çekimi",
              "yerçekimi kuvveti",
              "kütle ve ağırlık",
              "karşılaştırma",
              "2.2"
            ]
          },
          {
            "num": 3,
            "code": "2.3",
            "title": "2.3. Sürtünme Kuvveti",
            "shortTitle": "Sürtünme Kuvveti",
            "outcomeCode": "FB.5.2.4",
            "outcomes": [
              {
                "id": "FB.5.2.4",
                "code": "FB.5.2.4",
                "text": "Sürtünme kuvvetinin çeşitli ortamlardaki etkilerine yönelik tümevarımsal akıl yürütebilme ve günlük yaşam uygulamaları tasarlayabilme."
              }
            ],
            "keywords": [
              "sürtünme",
              "sürtünme kuvveti",
              "hava direnci",
              "su direnci",
              "pürüzlü yüzey",
              "kaygan yüzey",
              "sürtünmeyi artırma",
              "sürtünmeyi azaltma",
              "2.3"
            ]
          }
        ],
        "outcomes": [
          {
            "id": "FB.5.2.1",
            "code": "FB.5.2.1",
            "text": "Kuvveti büyüklüğü ile tanımlayabilme (operasyonel tanım).",
            "subtopicNum": 1,
            "subtopicTitle": "Kuvvet ve Kuvvetin Ölçülmesi"
          },
          {
            "id": "FB.5.2.2",
            "code": "FB.5.2.2",
            "text": "Basit araç gereçler kullanarak bir dinamometre modeli tasarlayabilme.",
            "subtopicNum": 1,
            "subtopicTitle": "Kuvvet ve Kuvvetin Ölçülmesi"
          },
          {
            "id": "FB.5.2.3",
            "code": "FB.5.2.3",
            "text": "Kütle ve ağırlık kavramlarını karşılaştırabilme; yer çekimi kuvvetini ağırlık olarak tanımlayabilme.",
            "subtopicNum": 2,
            "subtopicTitle": "Kütle ve Ağırlık İlişkisi"
          },
          {
            "id": "FB.5.2.4",
            "code": "FB.5.2.4",
            "text": "Sürtünme kuvvetinin çeşitli ortamlardaki etkilerine yönelik tümevarımsal akıl yürütebilme ve günlük yaşam uygulamaları tasarlayabilme.",
            "subtopicNum": 3,
            "subtopicTitle": "Sürtünme Kuvveti"
          }
        ]
      },
      {
        "id": "unit3",
        "num": 3,
        "name": "3. Ünite: Canlıların Yapısına Yolculuk",
        "icon": "🔬",
        "gradient": "from-emerald-500 via-teal-600 to-cyan-700",
        "subtopics": [
          {
            "num": 1,
            "code": "3.1",
            "title": "3.1. Hücre ve Organelleri",
            "shortTitle": "Hücre ve Organelleri",
            "outcomeCode": "FB.5.3.1",
            "outcomes": [
              {
                "id": "FB.5.3.1",
                "code": "FB.5.3.1",
                "text": "Bitki ve hayvan hücrelerini temel kısımları ve organelleri açısından karşılaştırabilme; hücre-doku-organ-sistem-organizma ilişkisini yapılandırabilme."
              }
            ],
            "keywords": [
              "hücre",
              "organel",
              "hücre zarı",
              "sitoplazma",
              "çekirdek",
              "bitki hücresi",
              "hayvan hücresi",
              "hücre doku organ sistem organizma",
              "mikroskop",
              "3.1"
            ]
          },
          {
            "num": 2,
            "code": "3.2",
            "title": "3.2. Destek ve Hareket Sistemi",
            "shortTitle": "Destek ve Hareket Sistemi",
            "outcomeCode": "FB.5.3.2",
            "outcomes": [
              {
                "id": "FB.5.3.2",
                "code": "FB.5.3.2",
                "text": "Destek ve hareket sistemine ait yapıları (kemik, kıkırdak, eklem, kas) sınıflandırabilme ve sağlığını koruma yollarını açıklayabilme."
              }
            ],
            "keywords": [
              "destek ve hareket",
              "kemik",
              "kıkırdak",
              "eklem",
              "kas",
              "çizgili kas",
              "düz kas",
              "kalp kası",
              "iskelet",
              "kemik çeşitleri",
              "3.2"
            ]
          }
        ],
        "outcomes": [
          {
            "id": "FB.5.3.1",
            "code": "FB.5.3.1",
            "text": "Bitki ve hayvan hücrelerini temel kısımları ve organelleri açısından karşılaştırabilme; hücre-doku-organ-sistem-organizma ilişkisini yapılandırabilme.",
            "subtopicNum": 1,
            "subtopicTitle": "Hücre ve Organelleri"
          },
          {
            "id": "FB.5.3.2",
            "code": "FB.5.3.2",
            "text": "Destek ve hareket sistemine ait yapıları (kemik, kıkırdak, eklem, kas) sınıflandırabilme ve sağlığını koruma yollarını açıklayabilme.",
            "subtopicNum": 2,
            "subtopicTitle": "Destek ve Hareket Sistemi"
          }
        ]
      },
      {
        "id": "unit4",
        "num": 4,
        "name": "4. Ünite: Işığın Dünyası",
        "icon": "💡",
        "gradient": "from-amber-400 via-yellow-500 to-orange-500",
        "subtopics": [
          {
            "num": 1,
            "code": "4.1",
            "title": "4.1. Işığın Yayılması",
            "shortTitle": "Işığın Yayılması",
            "outcomeCode": "FB.5.4.1",
            "outcomes": [
              {
                "id": "FB.5.4.1",
                "code": "FB.5.4.1",
                "text": "Işığın doğrusal yolla yayıldığını gösteren bilimsel model oluşturabilme."
              }
            ],
            "keywords": [
              "ışık",
              "ışığın yayılması",
              "doğrusal yayılma",
              "ışık ışını",
              "ışık kaynağı",
              "4.1"
            ]
          },
          {
            "num": 2,
            "code": "4.2",
            "title": "4.2. Maddenin Işık Geçirgenliği",
            "shortTitle": "Maddenin Işık Geçirgenliği",
            "outcomeCode": "FB.5.4.2",
            "outcomes": [
              {
                "id": "FB.5.4.2",
                "code": "FB.5.4.2",
                "text": "Maddeleri ışığı geçirme özelliklerine göre saydam, yarı saydam ve opak olarak sınıflandırabilme."
              }
            ],
            "keywords": [
              "ışık geçirgenliği",
              "saydam",
              "yarı saydam",
              "opak",
              "mat",
              "saydam madde",
              "4.2"
            ]
          },
          {
            "num": 3,
            "code": "4.3",
            "title": "4.3. Tam Gölgenin Oluşumu",
            "shortTitle": "Tam Gölgenin Oluşumu",
            "outcomeCode": "FB.5.4.3",
            "outcomes": [
              {
                "id": "FB.5.4.3",
                "code": "FB.5.4.3",
                "text": "Tam gölge oluşumunu ve gölge büyüklüğünü etkileyen değişkenleri deney yoluyla açıklayabilme."
              }
            ],
            "keywords": [
              "gölge",
              "tam gölge",
              "gölge boyu",
              "ışık ve gölge",
              "ekran",
              "perde",
              "4.3"
            ]
          }
        ],
        "outcomes": [
          {
            "id": "FB.5.4.1",
            "code": "FB.5.4.1",
            "text": "Işığın doğrusal yolla yayıldığını gösteren bilimsel model oluşturabilme.",
            "subtopicNum": 1,
            "subtopicTitle": "Işığın Yayılması"
          },
          {
            "id": "FB.5.4.2",
            "code": "FB.5.4.2",
            "text": "Maddeleri ışığı geçirme özelliklerine göre saydam, yarı saydam ve opak olarak sınıflandırabilme.",
            "subtopicNum": 2,
            "subtopicTitle": "Maddenin Işık Geçirgenliği"
          },
          {
            "id": "FB.5.4.3",
            "code": "FB.5.4.3",
            "text": "Tam gölge oluşumunu ve gölge büyüklüğünü etkileyen değişkenleri deney yoluyla açıklayabilme.",
            "subtopicNum": 3,
            "subtopicTitle": "Tam Gölgenin Oluşumu"
          }
        ]
      },
      {
        "id": "unit5",
        "num": 5,
        "name": "5. Ünite: Maddenin Doğası",
        "icon": "🧪",
        "gradient": "from-purple-600 via-pink-600 to-rose-600",
        "subtopics": [
          {
            "num": 1,
            "code": "5.1",
            "title": "5.1. Maddenin Tanecikli Yapısı",
            "shortTitle": "Maddenin Tanecikli Yapısı",
            "outcomeCode": "FB.5.5.1",
            "outcomes": [
              {
                "id": "FB.5.5.1",
                "code": "FB.5.5.1",
                "text": "Maddenin tanecikli, boşluklu ve hareketli yapısını modeller üzerinde açıklayabilme."
              }
            ],
            "keywords": [
              "madde",
              "tanecikli yapı",
              "katı",
              "sıvı",
              "gaz",
              "tanecik hareketi",
              "boşluklu yapı",
              "titreşim",
              "öteleme",
              "dönme",
              "5.1"
            ]
          },
          {
            "num": 2,
            "code": "5.2",
            "title": "5.2. Isı ve Sıcaklık",
            "shortTitle": "Isı ve Sıcaklık",
            "outcomeCode": "FB.5.5.2",
            "outcomes": [
              {
                "id": "FB.5.5.2",
                "code": "FB.5.5.2",
                "text": "Isı ve sıcaklık kavramları arasındaki farkları bilimsel verilerle ayırt edebilme."
              }
            ],
            "keywords": [
              "ısı",
              "sıcaklık",
              "termometre",
              "kalorimetre",
              "joule",
              "kalori",
              "derece selsiyus",
              "ısı ve sıcaklık farkı",
              "5.2"
            ]
          },
          {
            "num": 3,
            "code": "5.3",
            "title": "5.3. Maddenin Hâl Değişimi",
            "shortTitle": "Maddenin Hâl Değişimi",
            "outcomeCode": "FB.5.5.3",
            "outcomes": [
              {
                "id": "FB.5.5.3",
                "code": "FB.5.5.3",
                "text": "Maddenin hâl değişimlerini (erime, donma, buharlaşma, yoğuşma, süblimleşme, kırağılaşma) ısı alışverişi ile ilişkilendirebilme."
              }
            ],
            "keywords": [
              "hâl değişimi",
              "erime",
              "donma",
              "buharlaşma",
              "kaynama",
              "yoğuşma",
              "süblimleşme",
              "kırağılaşma",
              "ısı alışverişi",
              "5.3"
            ]
          },
          {
            "num": 4,
            "code": "5.4",
            "title": "5.4. Madde ve Isı",
            "shortTitle": "Madde ve Isı",
            "outcomeCode": "FB.5.5.4",
            "outcomes": [
              {
                "id": "FB.5.5.4",
                "code": "FB.5.5.4",
                "text": "Isı alışverişi ve ısı yalıtımının günlük yaşam ve teknolojik uygulamalarını değerlendirebilme."
              }
            ],
            "keywords": [
              "madde ve ısı",
              "ısı iletimi",
              "ısı yalıtımı",
              "yalıtım malzemesi",
              "enerji tasarrufu",
              "5.4"
            ]
          }
        ],
        "outcomes": [
          {
            "id": "FB.5.5.1",
            "code": "FB.5.5.1",
            "text": "Maddenin tanecikli, boşluklu ve hareketli yapısını modeller üzerinde açıklayabilme.",
            "subtopicNum": 1,
            "subtopicTitle": "Maddenin Tanecikli Yapısı"
          },
          {
            "id": "FB.5.5.2",
            "code": "FB.5.5.2",
            "text": "Isı ve sıcaklık kavramları arasındaki farkları bilimsel verilerle ayırt edebilme.",
            "subtopicNum": 2,
            "subtopicTitle": "Isı ve Sıcaklık"
          },
          {
            "id": "FB.5.5.3",
            "code": "FB.5.5.3",
            "text": "Maddenin hâl değişimlerini (erime, donma, buharlaşma, yoğuşma, süblimleşme, kırağılaşma) ısı alışverişi ile ilişkilendirebilme.",
            "subtopicNum": 3,
            "subtopicTitle": "Maddenin Hâl Değişimi"
          },
          {
            "id": "FB.5.5.4",
            "code": "FB.5.5.4",
            "text": "Isı alışverişi ve ısı yalıtımının günlük yaşam ve teknolojik uygulamalarını değerlendirebilme.",
            "subtopicNum": 4,
            "subtopicTitle": "Madde ve Isı"
          }
        ]
      },
      {
        "id": "unit6",
        "num": 6,
        "name": "6. Ünite: Yaşamımızdaki Elektrik",
        "icon": "⚡",
        "gradient": "from-cyan-500 via-blue-600 to-indigo-700",
        "subtopics": [
          {
            "num": 1,
            "code": "6.1",
            "title": "6.1. Devre Elemanlarının Sembolleri ve Devre Şeması",
            "shortTitle": "Devre Elemanlarının Sembolleri ve Devre Şeması",
            "outcomeCode": "FB.5.6.1",
            "outcomes": [
              {
                "id": "FB.5.6.1",
                "code": "FB.5.6.1",
                "text": "Devre elemanlarını standart sembollerle gösterebilme ve devre şemalarını çizebilme."
              }
            ],
            "keywords": [
              "devre elemanları",
              "sembol",
              "devre şeması",
              "pil",
              "ampul",
              "anahtar",
              "bağlantı kablosu",
              "basit elektrik devresi",
              "6.1"
            ]
          },
          {
            "num": 2,
            "code": "6.2",
            "title": "6.2. Basit Bir Elektrik Devresinde Ampul Parlaklığını Etkileyen Değişkenler",
            "shortTitle": "Ampul Parlaklığını Etkileyen Değişkenler",
            "outcomeCode": "FB.5.6.2",
            "outcomes": [
              {
                "id": "FB.5.6.2",
                "code": "FB.5.6.2",
                "text": "Basit bir elektrik devresinde pil sayısı ve ampul sayısının ampul parlaklığına etkisini bağımlı, bağımsız ve kontrol edilen değişkenlerle test edebilme."
              }
            ],
            "keywords": [
              "ampul parlaklığı",
              "pil sayısı",
              "ampul sayısı",
              "bağımlı değişken",
              "bağımsız değişken",
              "kontrol edilen değişken",
              "parlaklık",
              "6.2"
            ]
          }
        ],
        "outcomes": [
          {
            "id": "FB.5.6.1",
            "code": "FB.5.6.1",
            "text": "Devre elemanlarını standart sembollerle gösterebilme ve devre şemalarını çizebilme.",
            "subtopicNum": 1,
            "subtopicTitle": "Devre Elemanlarının Sembolleri ve Devre Şeması"
          },
          {
            "id": "FB.5.6.2",
            "code": "FB.5.6.2",
            "text": "Basit bir elektrik devresinde pil sayısı ve ampul sayısının ampul parlaklığına etkisini bağımlı, bağımsız ve kontrol edilen değişkenlerle test edebilme.",
            "subtopicNum": 2,
            "subtopicTitle": "Ampul Parlaklığını Etkileyen Değişkenler"
          }
        ]
      },
      {
        "id": "unit7",
        "num": 7,
        "name": "7. Ünite: Sürdürülebilir Yaşam ve Geri Dönüşüm",
        "icon": "🌱",
        "gradient": "from-emerald-600 via-green-600 to-lime-600",
        "subtopics": [
          {
            "num": 1,
            "code": "7.1",
            "title": "7.1. Evsel Atıklar ve Geri Dönüşüm",
            "shortTitle": "Evsel Atıklar ve Geri Dönüşüm",
            "outcomeCode": "FB.5.7.1",
            "outcomes": [
              {
                "id": "FB.5.7.1",
                "code": "FB.5.7.1",
                "text": "Evsel atıkların ayrıştırılması, yeniden kullanımı, geri dönüşümü ve kompost üretiminin çevre ve kaynak tasarrufuna katkılarını değerlendirebilme."
              }
            ],
            "keywords": [
              "evsel atık",
              "geri dönüşüm",
              "atık ayrıştırma",
              "yeniden kullanım",
              "kompost",
              "kaynak tasarrufu",
              "sürdürülebilir yaşam",
              "çevre kirliliği",
              "sıfır atık",
              "7.1"
            ]
          }
        ],
        "outcomes": [
          {
            "id": "FB.5.7.1",
            "code": "FB.5.7.1",
            "text": "Evsel atıkların ayrıştırılması, yeniden kullanımı, geri dönüşümü ve kompost üretiminin çevre ve kaynak tasarrufuna katkılarını değerlendirebilme.",
            "subtopicNum": 1,
            "subtopicTitle": "Evsel Atıklar ve Geri Dönüşüm"
          }
        ]
      }
    ]
  },
  "6": {
    "grade": "6",
    "subject": "Fen Bilimleri",
    "model": "Türkiye Yüzyılı Maarif Modeli",
    "units": [
      {
        "id": "unit1",
        "num": 1,
        "name": "1. Ünite: Güneş Sistemi ve Tutulmalar",
        "icon": "🪐",
        "gradient": "from-indigo-600 via-purple-600 to-pink-600",
        "subtopics": [
          {
            "num": 1,
            "code": "1.1",
            "title": "1.1. Güneş Sistemi",
            "shortTitle": "Güneş Sistemi",
            "outcomeCode": "FB.6.1.1",
            "outcomes": [
              {
                "id": "FB.6.1.1",
                "code": "FB.6.1.1",
                "text": "Güneş sistemindeki gezegenleri niteliklerine (iç/dış gezegen, büyüklük, sıralama) göre sınıflandırabilme."
              },
              {
                "id": "FB.6.1.2",
                "code": "FB.6.1.2",
                "text": "Güneş sistemini temsil eden bilimsel modeller oluşturabilme."
              }
            ],
            "keywords": [
              "güneş sistemi",
              "gezegen",
              "iç gezegen",
              "dış gezegen",
              "karasal",
              "gazsal",
              "merkür",
              "venüs",
              "dünya",
              "mars",
              "jüpiter",
              "satürn",
              "uranüs",
              "neptün",
              "asteroit",
              "meteor",
              "gök taşı",
              "1.1"
            ]
          },
          {
            "num": 2,
            "code": "1.2",
            "title": "1.2. Güneş ve Ay Tutulmaları",
            "shortTitle": "Güneş ve Ay Tutulmaları",
            "outcomeCode": "FB.6.1.3",
            "outcomes": [
              {
                "id": "FB.6.1.3",
                "code": "FB.6.1.3",
                "text": "Güneş ve Ay tutulmalarını karşılaştırabilme; özellik ve süreç bileşenlerini tanımlayabilme."
              },
              {
                "id": "FB.6.1.4",
                "code": "FB.6.1.4",
                "text": "Güneş ve Ay tutulmalarını temsil eden modeller tasarlayabilme."
              }
            ],
            "keywords": [
              "tutulma",
              "güneş tutulması",
              "ay tutulması",
              "ışığın doğrusal yayılması",
              "gölge",
              "yeni ay evresi",
              "dolunay evresi",
              "karşılaştırma",
              "1.2"
            ]
          }
        ],
        "outcomes": [
          {
            "id": "FB.6.1.1",
            "code": "FB.6.1.1",
            "text": "Güneş sistemindeki gezegenleri niteliklerine (iç/dış gezegen, büyüklük, sıralama) göre sınıflandırabilme.",
            "subtopicNum": 1,
            "subtopicTitle": "Güneş Sistemi"
          },
          {
            "id": "FB.6.1.2",
            "code": "FB.6.1.2",
            "text": "Güneş sistemini temsil eden bilimsel modeller oluşturabilme.",
            "subtopicNum": 1,
            "subtopicTitle": "Güneş Sistemi"
          },
          {
            "id": "FB.6.1.3",
            "code": "FB.6.1.3",
            "text": "Güneş ve Ay tutulmalarını karşılaştırabilme; özellik ve süreç bileşenlerini tanımlayabilme.",
            "subtopicNum": 2,
            "subtopicTitle": "Güneş ve Ay Tutulmaları"
          },
          {
            "id": "FB.6.1.4",
            "code": "FB.6.1.4",
            "text": "Güneş ve Ay tutulmalarını temsil eden modeller tasarlayabilme.",
            "subtopicNum": 2,
            "subtopicTitle": "Güneş ve Ay Tutulmaları"
          }
        ]
      },
      {
        "id": "unit2",
        "num": 2,
        "name": "2. Ünite: Kuvvetin Etkisinde Hareket",
        "icon": "🚀",
        "gradient": "from-blue-600 via-cyan-600 to-teal-600",
        "subtopics": [
          {
            "num": 1,
            "code": "2.1",
            "title": "2.1. Bileşke Kuvvet",
            "shortTitle": "Bileşke Kuvvet",
            "outcomeCode": "FB.6.2.1",
            "outcomes": [
              {
                "id": "FB.6.2.1",
                "code": "FB.6.2.1",
                "text": "Bir cisme etki eden aynı doğrultudaki kuvvetlerin bileşkesini (net kuvvet) hesaplayabilme ve yönünü belirleyebilme."
              },
              {
                "id": "FB.6.2.2",
                "code": "FB.6.2.2",
                "text": "Dengelenmiş ve dengelenmemiş kuvvetlerin cisimlerin hareket durumuna etkisini açıklayabilme."
              }
            ],
            "keywords": [
              "bileşke kuvvet",
              "net kuvvet",
              "doğrultu",
              "yön",
              "büyüklük",
              "dengelenmiş kuvvet",
              "dengelenmemiş kuvvet",
              "kuvvetin etkisi",
              "2.1"
            ]
          },
          {
            "num": 2,
            "code": "2.2",
            "title": "2.2. Sabit Süratli ve Sabit Hızlı Hareket",
            "shortTitle": "Sabit Süratli ve Sabit Hızlı Hareket",
            "outcomeCode": "FB.6.2.3",
            "outcomes": [
              {
                "id": "FB.6.2.3",
                "code": "FB.6.2.3",
                "text": "Sabit süratli ve sabit hızlı hareket eden cisimlerin yol-zaman ve sürat-zaman grafiklerini yorumlayabilme."
              }
            ],
            "keywords": [
              "sürat",
              "hız",
              "sabit sürat",
              "yol zaman grafiği",
              "sürat zaman grafiği",
              "yol",
              "zaman",
              "hareket",
              "2.2"
            ]
          }
        ],
        "outcomes": [
          {
            "id": "FB.6.2.1",
            "code": "FB.6.2.1",
            "text": "Bir cisme etki eden aynı doğrultudaki kuvvetlerin bileşkesini (net kuvvet) hesaplayabilme ve yönünü belirleyebilme.",
            "subtopicNum": 1,
            "subtopicTitle": "Bileşke Kuvvet"
          },
          {
            "id": "FB.6.2.2",
            "code": "FB.6.2.2",
            "text": "Dengelenmiş ve dengelenmemiş kuvvetlerin cisimlerin hareket durumuna etkisini açıklayabilme.",
            "subtopicNum": 1,
            "subtopicTitle": "Bileşke Kuvvet"
          },
          {
            "id": "FB.6.2.3",
            "code": "FB.6.2.3",
            "text": "Sabit süratli ve sabit hızlı hareket eden cisimlerin yol-zaman ve sürat-zaman grafiklerini yorumlayabilme.",
            "subtopicNum": 2,
            "subtopicTitle": "Sabit Süratli ve Sabit Hızlı Hareket"
          }
        ]
      },
      {
        "id": "unit3",
        "num": 3,
        "name": "3. Ünite: Canlılarda Sistemler",
        "icon": "🧬",
        "gradient": "from-rose-500 via-pink-600 to-purple-600",
        "subtopics": [
          {
            "num": 1,
            "code": "3.1",
            "title": "3.1. Bitki ve Hayvanlarda Üreme, Büyüme ve Gelişme",
            "shortTitle": "Bitki ve Hayvanlarda Üreme, Büyüme ve Gelişme",
            "outcomeCode": "FB.6.3.1",
            "outcomes": [
              {
                "id": "FB.6.3.1",
                "code": "FB.6.3.1",
                "text": "Bitki ve hayvanlarda eşeyli ve eşeysiz üreme biçimlerini karşılaştırabilme."
              },
              {
                "id": "FB.6.3.2",
                "code": "FB.6.3.2",
                "text": "Canlılarda büyüme ve gelişmeye etki eden faktörleri analiz edebilme."
              }
            ],
            "keywords": [
              "üreme",
              "büyüme",
              "gelişme",
              "eşeyli üreme",
              "eşeysiz üreme",
              "vejetatif",
              "tomurcuklanma",
              "bölünme",
              "rejenerasyon",
              "başkalaşım",
              "çimlenme",
              "tozlaşma",
              "tohum",
              "3.1"
            ]
          },
          {
            "num": 2,
            "code": "3.2",
            "title": "3.2. Denetleyici ve Düzenleyici Sistemler",
            "shortTitle": "Denetleyici ve Düzenleyici Sistemler",
            "outcomeCode": "FB.6.3.3",
            "outcomes": [
              {
                "id": "FB.6.3.3",
                "code": "FB.6.3.3",
                "text": "Sinir sistemi (beyin, beyincik, omurilik, omurilik soğanı) ve iç salgı bezlerinin görevlerini model üzerinde açıklayabilme."
              },
              {
                "id": "FB.6.3.4",
                "code": "FB.6.3.4",
                "text": "Duyu organlarının yapısını ve sağlığını koruma yollarını değerlendirebilme."
              }
            ],
            "keywords": [
              "denetleyici ve düzenleyici",
              "sinir sistemi",
              "beyin",
              "beyincik",
              "omurilik",
              "omurilik soğanı",
              "refleks",
              "iç salgı bezleri",
              "hormon",
              "duyu organları",
              "göz",
              "kulak",
              "burun",
              "dil",
              "deri",
              "3.2"
            ]
          }
        ],
        "outcomes": [
          {
            "id": "FB.6.3.1",
            "code": "FB.6.3.1",
            "text": "Bitki ve hayvanlarda eşeyli ve eşeysiz üreme biçimlerini karşılaştırabilme.",
            "subtopicNum": 1,
            "subtopicTitle": "Bitki ve Hayvanlarda Üreme, Büyüme ve Gelişme"
          },
          {
            "id": "FB.6.3.2",
            "code": "FB.6.3.2",
            "text": "Canlılarda büyüme ve gelişmeye etki eden faktörleri analiz edebilme.",
            "subtopicNum": 1,
            "subtopicTitle": "Bitki ve Hayvanlarda Üreme, Büyüme ve Gelişme"
          },
          {
            "id": "FB.6.3.3",
            "code": "FB.6.3.3",
            "text": "Sinir sistemi (beyin, beyincik, omurilik, omurilik soğanı) ve iç salgı bezlerinin görevlerini model üzerinde açıklayabilme.",
            "subtopicNum": 2,
            "subtopicTitle": "Denetleyici ve Düzenleyici Sistemler"
          },
          {
            "id": "FB.6.3.4",
            "code": "FB.6.3.4",
            "text": "Duyu organlarının yapısını ve sağlığını koruma yollarını değerlendirebilme.",
            "subtopicNum": 2,
            "subtopicTitle": "Denetleyici ve Düzenleyici Sistemler"
          }
        ]
      },
      {
        "id": "unit4",
        "num": 4,
        "name": "4. Ünite: Işığın Yansıması ve Renkler",
        "icon": "🪞",
        "gradient": "from-amber-500 via-orange-600 to-red-600",
        "subtopics": [
          {
            "num": 1,
            "code": "4.1",
            "title": "4.1. Işığın Yansıması",
            "shortTitle": "Işığın Yansıması",
            "outcomeCode": "FB.6.4.1",
            "outcomes": [
              {
                "id": "FB.6.4.1",
                "code": "FB.6.4.1",
                "text": "Işığın düzgün ve dağınık yansımasını inceleyerek yansıma kanunlarını deneyle keşfedebilme."
              }
            ],
            "keywords": [
              "yansıma",
              "yansıma kanunları",
              "gelen ışın",
              "yansıyan ışın",
              "yüzey normali",
              "gelme açısı",
              "yansıma açısı",
              "düzgün yansıma",
              "dağınık yansıma",
              "4.1"
            ]
          },
          {
            "num": 2,
            "code": "4.2",
            "title": "4.2. Aynalar",
            "shortTitle": "Aynalar",
            "outcomeCode": "FB.6.4.2",
            "outcomes": [
              {
                "id": "FB.6.4.2",
                "code": "FB.6.4.2",
                "text": "Düzlem, çukur ve tümsek aynalarda görüntü oluşumunu ve günlük yaşamdaki kullanım alanlarını karşılaştırabilme."
              }
            ],
            "keywords": [
              "ayna",
              "düzlem ayna",
              "küresel ayna",
              "çukur ayna",
              "tümsek ayna",
              "odak noktası",
              "görüntü özellikleri",
              "aynaların kullanım alanları",
              "4.2"
            ]
          },
          {
            "num": 3,
            "code": "4.3",
            "title": "4.3. Işığın Soğurulması ve Renkler",
            "shortTitle": "Işığın Soğurulması ve Renkler",
            "outcomeCode": "FB.6.4.3",
            "outcomes": [
              {
                "id": "FB.6.4.3",
                "code": "FB.6.4.3",
                "text": "Işığın maddeler tarafından soğurulmasını, cisimlerin renkli algılanmasını ve güneş enerjisinden yararlanma yollarını açıklayabilme."
              }
            ],
            "keywords": [
              "ışığın soğurulması",
              "renkler",
              "beyaz ışık",
              "ışık spektrumu",
              "güneş enerjisi",
              "renk oluşumu",
              "4.3"
            ]
          }
        ],
        "outcomes": [
          {
            "id": "FB.6.4.1",
            "code": "FB.6.4.1",
            "text": "Işığın düzgün ve dağınık yansımasını inceleyerek yansıma kanunlarını deneyle keşfedebilme.",
            "subtopicNum": 1,
            "subtopicTitle": "Işığın Yansıması"
          },
          {
            "id": "FB.6.4.2",
            "code": "FB.6.4.2",
            "text": "Düzlem, çukur ve tümsek aynalarda görüntü oluşumunu ve günlük yaşamdaki kullanım alanlarını karşılaştırabilme.",
            "subtopicNum": 2,
            "subtopicTitle": "Aynalar"
          },
          {
            "id": "FB.6.4.3",
            "code": "FB.6.4.3",
            "text": "Işığın maddeler tarafından soğurulmasını, cisimlerin renkli algılanmasını ve güneş enerjisinden yararlanma yollarını açıklayabilme.",
            "subtopicNum": 3,
            "subtopicTitle": "Işığın Soğurulması ve Renkler"
          }
        ]
      },
      {
        "id": "unit5",
        "num": 5,
        "name": "5. Ünite: Maddenin Ayırt Edici Özellikleri",
        "icon": "⚗️",
        "gradient": "from-teal-500 via-emerald-600 to-green-700",
        "subtopics": [
          {
            "num": 1,
            "code": "5.1",
            "title": "5.1. Genleşme ve Büzülme",
            "shortTitle": "Genleşme ve Büzülme",
            "outcomeCode": "FB.6.5.1",
            "outcomes": [
              {
                "id": "FB.6.5.1",
                "code": "FB.6.5.1",
                "text": "Katı, sıvı ve gazlarda genleşme ve büzülme olaylarını deneylerle açıklayabilme."
              }
            ],
            "keywords": [
              "genleşme",
              "büzülme",
              "termometre",
              "sıcaklık etkisi",
              "hacim değişimi",
              "gravzant halkası",
              "5.1"
            ]
          },
          {
            "num": 2,
            "code": "5.2",
            "title": "5.2. Maddenin Hâl Değişim Noktaları",
            "shortTitle": "Maddenin Hâl Değişim Noktaları",
            "outcomeCode": "FB.6.5.2",
            "outcomes": [
              {
                "id": "FB.6.5.2",
                "code": "FB.6.5.2",
                "text": "Erime, donma ve kaynama noktalarının saf maddeler için ayırt edici özellik olduğunu grafiklerle analiz edebilme."
              }
            ],
            "keywords": [
              "hâl değişim noktaları",
              "erime noktası",
              "donma noktası",
              "kaynama noktası",
              "saf madde",
              "ayırt edici özellik",
              "ısınma eğrisi",
              "soğuma eğrisi",
              "5.2"
            ]
          },
          {
            "num": 3,
            "code": "5.3",
            "title": "5.3. Yoğunluk",
            "shortTitle": "Yoğunluk",
            "outcomeCode": "FB.6.5.3",
            "outcomes": [
              {
                "id": "FB.6.5.3",
                "code": "FB.6.5.3",
                "text": "Kütle ve hacim ölçümleri yaparak saf maddelerin yoğunluğunu hesaplayabilme ve ayırt edici özellik olarak yorumlayabilme."
              }
            ],
            "keywords": [
              "yoğunluk",
              "özkütle",
              "kütle",
              "hacim",
              "d=m/V",
              "suyun yoğunluğu",
              "sıvıların yoğunluğu",
              "5.3"
            ]
          }
        ],
        "outcomes": [
          {
            "id": "FB.6.5.1",
            "code": "FB.6.5.1",
            "text": "Katı, sıvı ve gazlarda genleşme ve büzülme olaylarını deneylerle açıklayabilme.",
            "subtopicNum": 1,
            "subtopicTitle": "Genleşme ve Büzülme"
          },
          {
            "id": "FB.6.5.2",
            "code": "FB.6.5.2",
            "text": "Erime, donma ve kaynama noktalarının saf maddeler için ayırt edici özellik olduğunu grafiklerle analiz edebilme.",
            "subtopicNum": 2,
            "subtopicTitle": "Maddenin Hâl Değişim Noktaları"
          },
          {
            "id": "FB.6.5.3",
            "code": "FB.6.5.3",
            "text": "Kütle ve hacim ölçümleri yaparak saf maddelerin yoğunluğunu hesaplayabilme ve ayırt edici özellik olarak yorumlayabilme.",
            "subtopicNum": 3,
            "subtopicTitle": "Yoğunluk"
          }
        ]
      },
      {
        "id": "unit6",
        "num": 6,
        "name": "6. Ünite: Elektriğin İletimi ve Direnç",
        "icon": "🔌",
        "gradient": "from-blue-600 via-indigo-700 to-purple-800",
        "subtopics": [
          {
            "num": 1,
            "code": "6.1",
            "title": "6.1. Elektriğin İletimi",
            "shortTitle": "Elektriğin İletimi",
            "outcomeCode": "FB.6.6.1",
            "outcomes": [
              {
                "id": "FB.6.6.1",
                "code": "FB.6.6.1",
                "text": "Maddeleri elektriği iletme durumlarına göre iletken ve yalıtkan olarak sınıflandırabilme."
              }
            ],
            "keywords": [
              "elektriğin iletimi",
              "iletken",
              "yalıtkan",
              "iletken maddeler",
              "yalıtkan maddeler",
              "elektrik çarpması",
              "güvenlik",
              "6.1"
            ]
          },
          {
            "num": 2,
            "code": "6.2",
            "title": "6.2. Elektriksel Direnç ve Bağlı Olduğu Faktörler",
            "shortTitle": "Elektriksel Direnç ve Bağlı Olduğu Faktörler",
            "outcomeCode": "FB.6.6.2",
            "outcomes": [
              {
                "id": "FB.6.6.2",
                "code": "FB.6.6.2",
                "text": "Elektriksel direncin iletkenin boyu, kesit alanı ve cinsine bağlı olduğunu deneyle keşfedebilme."
              }
            ],
            "keywords": [
              "elektriksel direnç",
              "direnç",
              "iletkenin boyu",
              "kesit alanı",
              "iletkenin cinsi",
              "reosta",
              "ohm",
              "ampul parlaklığı ve direnç",
              "6.2"
            ]
          }
        ],
        "outcomes": [
          {
            "id": "FB.6.6.1",
            "code": "FB.6.6.1",
            "text": "Maddeleri elektriği iletme durumlarına göre iletken ve yalıtkan olarak sınıflandırabilme.",
            "subtopicNum": 1,
            "subtopicTitle": "Elektriğin İletimi"
          },
          {
            "id": "FB.6.6.2",
            "code": "FB.6.6.2",
            "text": "Elektriksel direncin iletkenin boyu, kesit alanı ve cinsine bağlı olduğunu deneyle keşfedebilme.",
            "subtopicNum": 2,
            "subtopicTitle": "Elektriksel Direnç ve Bağlı Olduğu Faktörler"
          }
        ]
      },
      {
        "id": "unit7",
        "num": 7,
        "name": "7. Ünite: Sürdürülebilir Yaşam ve Etkileşim",
        "icon": "🌍",
        "gradient": "from-green-600 via-emerald-600 to-teal-700",
        "subtopics": [
          {
            "num": 1,
            "code": "7.1",
            "title": "7.1. Biyoçeşitlilik",
            "shortTitle": "Biyoçeşitlilik",
            "outcomeCode": "FB.6.7.1",
            "outcomes": [
              {
                "id": "FB.6.7.1",
                "code": "FB.6.7.1",
                "text": "Biyoçeşitliliğin ekosistemler, doğal denge ve ülkemiz için önemini değerlendirebilme."
              }
            ],
            "keywords": [
              "biyoçeşitlilik",
              "ekosistem",
              "endemik türler",
              "nesli tükenen canlılar",
              "tür çeşitliliği",
              "doğal denge",
              "7.1"
            ]
          },
          {
            "num": 2,
            "code": "7.2",
            "title": "7.2. İnsan ve Çevre Etkileşimi",
            "shortTitle": "İnsan ve Çevre Etkileşimi",
            "outcomeCode": "FB.6.7.2",
            "outcomes": [
              {
                "id": "FB.6.7.2",
                "code": "FB.6.7.2",
                "text": "İnsan faaliyetlerinin çevreye etkilerini ve yakıt kullanımının sonuçlarını mantıksal olarak sorgulayabilme."
              },
              {
                "id": "FB.6.7.3",
                "code": "FB.6.7.3",
                "text": "Çevre sorunlarının çözümüne yönelik sürdürülebilir öneriler geliştirebilme."
              }
            ],
            "keywords": [
              "insan ve çevre",
              "çevre sorunları",
              "sera etkisi",
              "küresel ısınma",
              "asit yağmurları",
              "yakıtlar",
              "hava kirliliği",
              "sürdürülebilirlik",
              "7.2"
            ]
          }
        ],
        "outcomes": [
          {
            "id": "FB.6.7.1",
            "code": "FB.6.7.1",
            "text": "Biyoçeşitliliğin ekosistemler, doğal denge ve ülkemiz için önemini değerlendirebilme.",
            "subtopicNum": 1,
            "subtopicTitle": "Biyoçeşitlilik"
          },
          {
            "id": "FB.6.7.2",
            "code": "FB.6.7.2",
            "text": "İnsan faaliyetlerinin çevreye etkilerini ve yakıt kullanımının sonuçlarını mantıksal olarak sorgulayabilme.",
            "subtopicNum": 2,
            "subtopicTitle": "İnsan ve Çevre Etkileşimi"
          },
          {
            "id": "FB.6.7.3",
            "code": "FB.6.7.3",
            "text": "Çevre sorunlarının çözümüne yönelik sürdürülebilir öneriler geliştirebilme.",
            "subtopicNum": 2,
            "subtopicTitle": "İnsan ve Çevre Etkileşimi"
          }
        ]
      }
    ]
  },
  "7": {
    "grade": "7",
    "subject": "Fen Bilimleri",
    "model": "Türkiye Yüzyılı Maarif Modeli",
    "units": [
      {
        "id": "unit1",
        "num": 1,
        "name": "1. Ünite: Uzay Çağı",
        "icon": "🛰️",
        "gradient": "from-indigo-600 via-purple-700 to-slate-900",
        "subtopics": [
          {
            "num": 1,
            "code": "1.1",
            "title": "1.1. Türkiye ve Uzay Araştırmaları",
            "shortTitle": "Türkiye ve Uzay Araştırmaları",
            "outcomeCode": "FB.7.1.1",
            "outcomes": [
              {
                "id": "FB.7.1.1",
                "code": "FB.7.1.1",
                "text": "Uzay teknolojilerini, teleskopları ve gözlemevlerini araştırarak uzay çalışmalarının günlük yaşama katkılarını değerlendirebilme."
              },
              {
                "id": "FB.7.1.2",
                "code": "FB.7.1.2",
                "text": "Uzay kirliliğinin nedenlerini ve olası sonuçlarını sorgulayabilme."
              }
            ],
            "keywords": [
              "uzay çağı",
              "uzay araştırmaları",
              "teleskop",
              "yapay uydu",
              "uzay istasyonu",
              "uzay mekiği",
              "uzay sondası",
              "uzay kirliliği",
              "türkiye uzay ajansı",
              "alper gezeravcı",
              "türksat",
              "göktürk",
              "imece",
              "rasathane",
              "gözlemevi",
              "1.1"
            ]
          },
          {
            "num": 2,
            "code": "1.2",
            "title": "1.2. Uzayda Neler Var?",
            "shortTitle": "Uzayda Neler Var?",
            "outcomeCode": "FB.7.1.3",
            "outcomes": [
              {
                "id": "FB.7.1.3",
                "code": "FB.7.1.3",
                "text": "Yıldızların yaşam döngüsünü (nebula, süpernova, kara delik) modelleyebilme."
              },
              {
                "id": "FB.7.1.4",
                "code": "FB.7.1.4",
                "text": "Yıldız, takımyıldız, galaksi ve evren kavramlarını büyüklük ve kapsam ilişkisine göre sınıflandırabilme."
              }
            ],
            "keywords": [
              "yıldız",
              "nebula",
              "bulutsu",
              "süpernova",
              "kara delik",
              "ışık yılı",
              "takımyıldız",
              "galaksi",
              "samanyolu",
              "evren",
              "uzay",
              "1.2"
            ]
          }
        ],
        "outcomes": [
          {
            "id": "FB.7.1.1",
            "code": "FB.7.1.1",
            "text": "Uzay teknolojilerini, teleskopları ve gözlemevlerini araştırarak uzay çalışmalarının günlük yaşama katkılarını değerlendirebilme.",
            "subtopicNum": 1,
            "subtopicTitle": "Türkiye ve Uzay Araştırmaları"
          },
          {
            "id": "FB.7.1.2",
            "code": "FB.7.1.2",
            "text": "Uzay kirliliğinin nedenlerini ve olası sonuçlarını sorgulayabilme.",
            "subtopicNum": 1,
            "subtopicTitle": "Türkiye ve Uzay Araştırmaları"
          },
          {
            "id": "FB.7.1.3",
            "code": "FB.7.1.3",
            "text": "Yıldızların yaşam döngüsünü (nebula, süpernova, kara delik) modelleyebilme.",
            "subtopicNum": 2,
            "subtopicTitle": "Uzayda Neler Var?"
          },
          {
            "id": "FB.7.1.4",
            "code": "FB.7.1.4",
            "text": "Yıldız, takımyıldız, galaksi ve evren kavramlarını büyüklük ve kapsam ilişkisine göre sınıflandırabilme.",
            "subtopicNum": 2,
            "subtopicTitle": "Uzayda Neler Var?"
          }
        ]
      },
      {
        "id": "unit2",
        "num": 2,
        "name": "2. Ünite: Kuvvet ve Enerjiyi Keşfedelim",
        "icon": "⚡",
        "gradient": "from-blue-600 via-indigo-600 to-cyan-600",
        "subtopics": [
          {
            "num": 1,
            "code": "2.1",
            "title": "2.1. Kuvvet, İş ve Enerji İlişkisi",
            "shortTitle": "Kuvvet, İş ve Enerji İlişkisi",
            "outcomeCode": "FB.7.2.1",
            "outcomes": [
              {
                "id": "FB.7.2.1",
                "code": "FB.7.2.1",
                "text": "Fiziksel anlamda iş kavramını kuvvet ve yer değiştirme değişkenleri ile ilişkilendirebilme; Joule birimini kullanabilme."
              }
            ],
            "keywords": [
              "iş",
              "fiziksel iş",
              "kuvvet",
              "yer değiştirme",
              "joule",
              "enerji",
              "iş ve enerji",
              "2.1"
            ]
          },
          {
            "num": 2,
            "code": "2.2",
            "title": "2.2. Enerji Dönüşümleri",
            "shortTitle": "Enerji Dönüşümleri",
            "outcomeCode": "FB.7.2.2",
            "outcomes": [
              {
                "id": "FB.7.2.2",
                "code": "FB.7.2.2",
                "text": "Kinetik ve potansiyel (çekim ve esneklik) enerji türlerini karşılaştırabilme."
              },
              {
                "id": "FB.7.2.3",
                "code": "FB.7.2.3",
                "text": "Enerjinin korunumu ilkesini mekanik ve sürtünmeli sistemlerde enerji dönüşümleri üzerinden açıklayabilme."
              }
            ],
            "keywords": [
              "kinetik enerji",
              "potansiyel enerji",
              "çekim potansiyel enerjisi",
              "esneklik potansiyel enerjisi",
              "enerji dönüşümü",
              "enerjinin korunumu",
              "sürtünme ve enerji",
              "ısı enerjisi",
              "2.2"
            ]
          }
        ],
        "outcomes": [
          {
            "id": "FB.7.2.1",
            "code": "FB.7.2.1",
            "text": "Fiziksel anlamda iş kavramını kuvvet ve yer değiştirme değişkenleri ile ilişkilendirebilme; Joule birimini kullanabilme.",
            "subtopicNum": 1,
            "subtopicTitle": "Kuvvet, İş ve Enerji İlişkisi"
          },
          {
            "id": "FB.7.2.2",
            "code": "FB.7.2.2",
            "text": "Kinetik ve potansiyel (çekim ve esneklik) enerji türlerini karşılaştırabilme.",
            "subtopicNum": 2,
            "subtopicTitle": "Enerji Dönüşümleri"
          },
          {
            "id": "FB.7.2.3",
            "code": "FB.7.2.3",
            "text": "Enerjinin korunumu ilkesini mekanik ve sürtünmeli sistemlerde enerji dönüşümleri üzerinden açıklayabilme.",
            "subtopicNum": 2,
            "subtopicTitle": "Enerji Dönüşümleri"
          }
        ]
      },
      {
        "id": "unit3",
        "num": 3,
        "name": "3. Ünite: Vücudumuzdaki Sistemler",
        "icon": "🫀",
        "gradient": "from-red-600 via-rose-600 to-pink-700",
        "subtopics": [
          {
            "num": 1,
            "code": "3.1",
            "title": "3.1. Sindirim Sistemi",
            "shortTitle": "Sindirim Sistemi",
            "outcomeCode": "FB.7.3.1",
            "outcomes": [
              {
                "id": "FB.7.3.1",
                "code": "FB.7.3.1",
                "text": "Sindirim sistemini oluşturan yapı ve organların görevlerini mekanik ve kimyasal sindirim bağlamında açıklayabilme."
              }
            ],
            "keywords": [
              "sindirim sistemi",
              "mekanik sindirim",
              "kimyasal sindirim",
              "ağız",
              "mide",
              "ince bağırsak",
              "karaciğer",
              "pankreas",
              "enzim",
              "safra",
              "emilim",
              "villus",
              "3.1"
            ]
          },
          {
            "num": 2,
            "code": "3.2",
            "title": "3.2. Dolaşım Sistemi",
            "shortTitle": "Dolaşım Sistemi",
            "outcomeCode": "FB.7.3.2",
            "outcomes": [
              {
                "id": "FB.7.3.2",
                "code": "FB.7.3.2",
                "text": "Kalp, kan damarları ve kanın yapısını inceleyerek büyük ve küçük kan dolaşımını model üzerinde gösterebilme; kan bağışının önemini kavrayabilme."
              }
            ],
            "keywords": [
              "dolaşım sistemi",
              "kalp",
              "damarlar",
              "atardamar",
              "toplardamar",
              "kılcal damar",
              "büyük kan dolaşımı",
              "küçük kan dolaşımı",
              "kan grupları",
              "kan bağışı",
              "3.2"
            ]
          },
          {
            "num": 3,
            "code": "3.3",
            "title": "3.3. Solunum Sistemi",
            "shortTitle": "Solunum Sistemi",
            "outcomeCode": "FB.7.3.3",
            "outcomes": [
              {
                "id": "FB.7.3.3",
                "code": "FB.7.3.3",
                "text": "Solunum sistemini oluşturan organların görevlerini ve gaz alışveriş mekanizmasını açıklayabilme."
              }
            ],
            "keywords": [
              "solunum sistemi",
              "akciğer",
              "burun",
              "soluk borusu",
              "bronş",
              "bronşçuk",
              "alveol",
              "diyafram",
              "soluk alma",
              "soluk verme",
              "gaz alışverişi",
              "3.3"
            ]
          },
          {
            "num": 4,
            "code": "3.4",
            "title": "3.4. Boşaltım Sistemi",
            "shortTitle": "Boşaltım Sistemi",
            "outcomeCode": "FB.7.3.4",
            "outcomes": [
              {
                "id": "FB.7.3.4",
                "code": "FB.7.3.4",
                "text": "Boşaltım sistemi organlarının vücuttaki atık maddeleri uzaklaştırmadaki rolünü ve organ bağışının toplumsal önemini açıklayabilme."
              }
            ],
            "keywords": [
              "boşaltım sistemi",
              "böbrek",
              "üreter",
              "idrar kesesi",
              "üretra",
              "nefron",
              "boşaltım",
              "organ bağışı",
              "diyaliz",
              "3.4"
            ]
          }
        ],
        "outcomes": [
          {
            "id": "FB.7.3.1",
            "code": "FB.7.3.1",
            "text": "Sindirim sistemini oluşturan yapı ve organların görevlerini mekanik ve kimyasal sindirim bağlamında açıklayabilme.",
            "subtopicNum": 1,
            "subtopicTitle": "Sindirim Sistemi"
          },
          {
            "id": "FB.7.3.2",
            "code": "FB.7.3.2",
            "text": "Kalp, kan damarları ve kanın yapısını inceleyerek büyük ve küçük kan dolaşımını model üzerinde gösterebilme; kan bağışının önemini kavrayabilme.",
            "subtopicNum": 2,
            "subtopicTitle": "Dolaşım Sistemi"
          },
          {
            "id": "FB.7.3.3",
            "code": "FB.7.3.3",
            "text": "Solunum sistemini oluşturan organların görevlerini ve gaz alışveriş mekanizmasını açıklayabilme.",
            "subtopicNum": 3,
            "subtopicTitle": "Solunum Sistemi"
          },
          {
            "id": "FB.7.3.4",
            "code": "FB.7.3.4",
            "text": "Boşaltım sistemi organlarının vücuttaki atık maddeleri uzaklaştırmadaki rolünü ve organ bağışının toplumsal önemini açıklayabilme.",
            "subtopicNum": 4,
            "subtopicTitle": "Boşaltım Sistemi"
          }
        ]
      },
      {
        "id": "unit4",
        "num": 4,
        "name": "4. Ünite: Işığın Kırılması ve Mercekler",
        "icon": "🔍",
        "gradient": "from-amber-500 via-yellow-600 to-orange-600",
        "subtopics": [
          {
            "num": 1,
            "code": "4.1",
            "title": "4.1. Işığın Kırılması",
            "shortTitle": "Işığın Kırılması",
            "outcomeCode": "FB.7.4.1",
            "outcomes": [
              {
                "id": "FB.7.4.1",
                "code": "FB.7.4.1",
                "text": "Işığın farklı ortamlara geçerken doğrultu değiştirmesini (kırılma) gelme ve kırılma açıları ile deneyle açıklayabilme."
              }
            ],
            "keywords": [
              "ışığın kırılması",
              "kırılma",
              "ortam yoğunluğu",
              "kırılma indisi",
              "normale yaklaşma",
              "normalden uzaklaşma",
              "gelme açısı",
              "kırılma açısı",
              "sınır açısı",
              "tam yansıma",
              "4.1"
            ]
          },
          {
            "num": 2,
            "code": "4.2",
            "title": "4.2. Mercekler",
            "shortTitle": "Mercekler",
            "outcomeCode": "FB.7.4.2",
            "outcomes": [
              {
                "id": "FB.7.4.2",
                "code": "FB.7.4.2",
                "text": "İnce ve kalın kenarlı merceklerin ışığı kırma özelliklerini ve optik araçlardaki kullanım alanlarını karşılaştırabilme."
              }
            ],
            "keywords": [
              "mercek",
              "ince kenarlı mercek",
              "kalın kenarlı mercek",
              "yakınsak mercek",
              "ıraksak mercek",
              "odak noktası",
              "odak uzaklığı",
              "göz kusurları",
              "miyop",
              "hipermetrop",
              "merceklerin kullanım alanları",
              "4.2"
            ]
          }
        ],
        "outcomes": [
          {
            "id": "FB.7.4.1",
            "code": "FB.7.4.1",
            "text": "Işığın farklı ortamlara geçerken doğrultu değiştirmesini (kırılma) gelme ve kırılma açıları ile deneyle açıklayabilme.",
            "subtopicNum": 1,
            "subtopicTitle": "Işığın Kırılması"
          },
          {
            "id": "FB.7.4.2",
            "code": "FB.7.4.2",
            "text": "İnce ve kalın kenarlı merceklerin ışığı kırma özelliklerini ve optik araçlardaki kullanım alanlarını karşılaştırabilme.",
            "subtopicNum": 2,
            "subtopicTitle": "Mercekler"
          }
        ]
      },
      {
        "id": "unit5",
        "num": 5,
        "name": "5. Ünite: Maddenin Doğasına Yolculuk",
        "icon": "⚛️",
        "gradient": "from-purple-600 via-fuchsia-600 to-violet-700",
        "subtopics": [
          {
            "num": 1,
            "code": "5.1",
            "title": "5.1. Maddenin Tanecikli Yapısı",
            "shortTitle": "Maddenin Tanecikli Yapısı",
            "outcomeCode": "FB.7.5.1",
            "outcomes": [
              {
                "id": "FB.7.5.1",
                "code": "FB.7.5.1",
                "text": "Atomun yapısını oluşturan temel parçacıkları (proton, nötron, elektron) ve geçmişten günümüze atom modellerini açıklayabilme."
              }
            ],
            "keywords": [
              "atom",
              "çekirdek",
              "katman",
              "proton",
              "nötron",
              "elektron",
              "atom modelleri",
              "democritus",
              "dalton",
              "thomson",
              "rutherford",
              "bohr",
              "modern atom teorisi",
              "molekül",
              "5.1"
            ]
          },
          {
            "num": 2,
            "code": "5.2",
            "title": "5.2. Saf Maddeler",
            "shortTitle": "Saf Maddeler",
            "outcomeCode": "FB.7.5.2",
            "outcomes": [
              {
                "id": "FB.7.5.2",
                "code": "FB.7.5.2",
                "text": "Element ve bileşik kavramlarını ayırt edebilme; ilk 18 element ile yaygın bileşiklerin sembol ve formüllerini tanıyabilme."
              }
            ],
            "keywords": [
              "saf madde",
              "element",
              "bileşik",
              "sembol",
              "formül",
              "ilk 18 element",
              "yaygın bileşikler",
              "su",
              "tuz",
              "karbondioksit",
              "moleküler yapıda element",
              "5.2"
            ]
          },
          {
            "num": 3,
            "code": "5.3",
            "title": "5.3. Karışımlar",
            "shortTitle": "Karışımlar",
            "outcomeCode": "FB.7.5.3",
            "outcomes": [
              {
                "id": "FB.7.5.3",
                "code": "FB.7.5.3",
                "text": "Homojen ve heterojen karışımları sınıflandırabilme; çözünme hızına etki eden değişkenleri deneyle keşfedebilme."
              }
            ],
            "keywords": [
              "karışım",
              "homojen karışım",
              "heterojen karışım",
              "çözelti",
              "çözücü",
              "çözünen",
              "çözünme hızı",
              "sıcaklık",
              "temas yüzeyi",
              "karıştırma",
              "5.3"
            ]
          },
          {
            "num": 4,
            "code": "5.4",
            "title": "5.4. Karışımların Ayrılması",
            "shortTitle": "Karışımların Ayrılması",
            "outcomeCode": "FB.7.5.4",
            "outcomes": [
              {
                "id": "FB.7.5.4",
                "code": "FB.7.5.4",
                "text": "Karışımları ayırma yöntemlerini (buharlaştırma, yoğunluk farkı, damıtma, mıknatıs vb.) uygun deneylerle uygulayabilme."
              }
            ],
            "keywords": [
              "karışımları ayırma",
              "buharlaştırma",
              "damıtma",
              "ayrımsal damıtma",
              "yoğunluk farkı",
              "ayırma hunisi",
              "süzme",
              "mıknatısla ayırma",
              "yüzdürme",
              "5.4"
            ]
          }
        ],
        "outcomes": [
          {
            "id": "FB.7.5.1",
            "code": "FB.7.5.1",
            "text": "Atomun yapısını oluşturan temel parçacıkları (proton, nötron, elektron) ve geçmişten günümüze atom modellerini açıklayabilme.",
            "subtopicNum": 1,
            "subtopicTitle": "Maddenin Tanecikli Yapısı"
          },
          {
            "id": "FB.7.5.2",
            "code": "FB.7.5.2",
            "text": "Element ve bileşik kavramlarını ayırt edebilme; ilk 18 element ile yaygın bileşiklerin sembol ve formüllerini tanıyabilme.",
            "subtopicNum": 2,
            "subtopicTitle": "Saf Maddeler"
          },
          {
            "id": "FB.7.5.3",
            "code": "FB.7.5.3",
            "text": "Homojen ve heterojen karışımları sınıflandırabilme; çözünme hızına etki eden değişkenleri deneyle keşfedebilme.",
            "subtopicNum": 3,
            "subtopicTitle": "Karışımlar"
          },
          {
            "id": "FB.7.5.4",
            "code": "FB.7.5.4",
            "text": "Karışımları ayırma yöntemlerini (buharlaştırma, yoğunluk farkı, damıtma, mıknatıs vb.) uygun deneylerle uygulayabilme.",
            "subtopicNum": 4,
            "subtopicTitle": "Karışımların Ayrılması"
          }
        ]
      },
      {
        "id": "unit6",
        "num": 6,
        "name": "6. Ünite: Elektriklenme",
        "icon": "⚡",
        "gradient": "from-cyan-600 via-blue-700 to-indigo-800",
        "subtopics": [
          {
            "num": 1,
            "code": "6.1",
            "title": "6.1. Elektrik Yükleri ve Elektriklenme",
            "shortTitle": "Elektrik Yükleri ve Elektriklenme",
            "outcomeCode": "FB.7.6.1",
            "outcomes": [
              {
                "id": "FB.7.6.1",
                "code": "FB.7.6.1",
                "text": "Pozitif ve negatif elektrik yüklerini tanıyabilme; sürtünme, dokunma ve etki ile elektriklenme çeşitlerini açıklayabilme."
              },
              {
                "id": "FB.7.6.2",
                "code": "FB.7.6.2",
                "text": "Elektroskop ile yük durumunu belirleyebilme ve yıldırım/şimşek gibi doğa olaylarında topraklamanın önemini kavrayabilme."
              }
            ],
            "keywords": [
              "elektriklenme",
              "elektrik yükleri",
              "pozitif yük",
              "negatif yük",
              "nötr cisim",
              "sürtünme ile elektriklenme",
              "dokunma ile elektriklenme",
              "etki ile elektriklenme",
              "elektroskop",
              "topraklama",
              "şimşek",
              "yıldırım",
              "paratoner",
              "6.1"
            ]
          }
        ],
        "outcomes": [
          {
            "id": "FB.7.6.1",
            "code": "FB.7.6.1",
            "text": "Pozitif ve negatif elektrik yüklerini tanıyabilme; sürtünme, dokunma ve etki ile elektriklenme çeşitlerini açıklayabilme.",
            "subtopicNum": 1,
            "subtopicTitle": "Elektrik Yükleri ve Elektriklenme"
          },
          {
            "id": "FB.7.6.2",
            "code": "FB.7.6.2",
            "text": "Elektroskop ile yük durumunu belirleyebilme ve yıldırım/şimşek gibi doğa olaylarında topraklamanın önemini kavrayabilme.",
            "subtopicNum": 1,
            "subtopicTitle": "Elektrik Yükleri ve Elektriklenme"
          }
        ]
      },
      {
        "id": "unit7",
        "num": 7,
        "name": "7. Ünite: Sürdürülebilir Yaşam ve Enerji",
        "icon": "🌿",
        "gradient": "from-emerald-600 via-green-600 to-teal-700",
        "subtopics": [
          {
            "num": 1,
            "code": "7.1",
            "title": "7.1. Besin Zinciri ve Enerji Akışı",
            "shortTitle": "Besin Zinciri ve Enerji Akışı",
            "outcomeCode": "FB.7.7.1",
            "outcomes": [
              {
                "id": "FB.7.7.1",
                "code": "FB.7.7.1",
                "text": "Ekosistemdeki üretici, tüketici ve ayrıştırıcılar arasındaki besin zincirini ve enerji piramidini modelleyebilme."
              }
            ],
            "keywords": [
              "besin zinciri",
              "besin ağı",
              "enerji akışı",
              "enerji piramidi",
              "üretici",
              "tüketici",
              "ayrıştırıcı",
              "biyolojik birikim",
              "7.1"
            ]
          },
          {
            "num": 2,
            "code": "7.2",
            "title": "7.2. Sürdürülebilir Yaşam",
            "shortTitle": "Sürdürülebilir Yaşam",
            "outcomeCode": "FB.7.7.2",
            "outcomes": [
              {
                "id": "FB.7.7.2",
                "code": "FB.7.7.2",
                "text": "Madde döngülerini (su, karbon, oksijen, azot) ve ekolojik ayak izini azaltarak sürdürülebilir bir gelecek kurma bilincini değerlendirebilme."
              }
            ],
            "keywords": [
              "sürdürülebilir yaşam",
              "madde döngüleri",
              "su döngüsü",
              "karbon döngüsü",
              "azot döngüsü",
              "oksijen döngüsü",
              "küresel iklim değişikliği",
              "ekolojik ayak izi",
              "karbon ayak izi",
              "yenilenebilir enerji",
              "7.2"
            ]
          }
        ],
        "outcomes": [
          {
            "id": "FB.7.7.1",
            "code": "FB.7.7.1",
            "text": "Ekosistemdeki üretici, tüketici ve ayrıştırıcılar arasındaki besin zincirini ve enerji piramidini modelleyebilme.",
            "subtopicNum": 1,
            "subtopicTitle": "Besin Zinciri ve Enerji Akışı"
          },
          {
            "id": "FB.7.7.2",
            "code": "FB.7.7.2",
            "text": "Madde döngülerini (su, karbon, oksijen, azot) ve ekolojik ayak izini azaltarak sürdürülebilir bir gelecek kurma bilincini değerlendirebilme.",
            "subtopicNum": 2,
            "subtopicTitle": "Sürdürülebilir Yaşam"
          }
        ]
      }
    ]
  },
  "8": {
    "grade": "8",
    "subject": "Fen Bilimleri",
    "model": "MEB Fen Bilimleri Öğretim Programı (LGS)",
    "units": [
      {
        "id": "unit1",
        "num": 1,
        "name": "1. Ünite: Mevsimler ve İklim",
        "icon": "🌍",
        "gradient": "from-sky-500 via-blue-600 to-indigo-700",
        "subtopics": [
          {
            "num": 1,
            "code": "1.1",
            "title": "1.1. Mevsimlerin Oluşumu",
            "shortTitle": "Mevsimlerin Oluşumu",
            "outcomeCode": "F.8.1.1.1",
            "outcomes": [
              {
                "id": "F.8.1.1.1",
                "code": "F.8.1.1.1",
                "text": "Mevsimlerin oluşumuna yönelik tahminlerde bulunur."
              }
            ],
            "keywords": [
              "mevsimlerin oluşumu",
              "eksen eğikliği",
              "dolanma",
              "güneş ışınlarının geliş açısı",
              "gün dönümü",
              "ekinoks",
              "1.1"
            ]
          },
          {
            "num": 2,
            "code": "1.2",
            "title": "1.2. İklim ve Hava Hareketleri",
            "shortTitle": "İklim ve Hava Hareketleri",
            "outcomeCode": "F.8.1.2.1",
            "outcomes": [
              {
                "id": "F.8.1.2.1",
                "code": "F.8.1.2.1",
                "text": "İklim ve hava olayları arasındaki farkı açıklar."
              },
              {
                "id": "F.8.1.2.2",
                "code": "F.8.1.2.2",
                "text": "İklim biliminin (klimatoloji) bir bilim dalı olduğunu ve bu alanda çalışan uzmanlara iklim bilimci (klimatolog) adı verildiğini belirtir."
              }
            ],
            "keywords": [
              "iklim",
              "hava olayları",
              "rüzgar",
              "alçak basınç",
              "yüksek basınç",
              "nem",
              "yağış",
              "sera etkisi",
              "küresel iklim değişikliği",
              "klimatoloji",
              "meteoroloji",
              "1.2"
            ]
          }
        ],
        "outcomes": [
          {
            "id": "F.8.1.1.1",
            "code": "F.8.1.1.1",
            "text": "Mevsimlerin oluşumuna yönelik tahminlerde bulunur.",
            "subtopicNum": 1,
            "subtopicTitle": "Mevsimlerin Oluşumu"
          },
          {
            "id": "F.8.1.2.1",
            "code": "F.8.1.2.1",
            "text": "İklim ve hava olayları arasındaki farkı açıklar.",
            "subtopicNum": 2,
            "subtopicTitle": "İklim ve Hava Hareketleri"
          },
          {
            "id": "F.8.1.2.2",
            "code": "F.8.1.2.2",
            "text": "İklim biliminin (klimatoloji) bir bilim dalı olduğunu ve bu alanda çalışan uzmanlara iklim bilimci (klimatolog) adı verildiğini belirtir.",
            "subtopicNum": 2,
            "subtopicTitle": "İklim ve Hava Hareketleri"
          }
        ]
      },
      {
        "id": "unit2",
        "num": 2,
        "name": "2. Ünite: DNA ve Genetik Kod",
        "icon": "🧬",
        "gradient": "from-purple-600 via-pink-600 to-rose-600",
        "subtopics": [
          {
            "num": 1,
            "code": "2.1",
            "title": "2.1. DNA ve Genetik Kod",
            "shortTitle": "DNA ve Genetik Kod",
            "outcomeCode": "F.8.2.1.1",
            "outcomes": [
              {
                "id": "F.8.2.1.1",
                "code": "F.8.2.1.1",
                "text": "Nükleotid, gen, DNA ve kromozom kavramlarını açıklayarak bu kavramlar arasında ilişki kurar."
              },
              {
                "id": "F.8.2.1.2",
                "code": "F.8.2.1.2",
                "text": "DNA'nın yapısını model üzerinde gösterir."
              },
              {
                "id": "F.8.2.1.3",
                "code": "F.8.2.1.3",
                "text": "DNA'nın kendini nasıl eşlediğini açıklar."
              }
            ],
            "keywords": [
              "dna",
              "genetik kod",
              "nükleotid",
              "gen",
              "kromozom",
              "adenin",
              "timin",
              "guanin",
              "sitozin",
              "dna eşlenmesi",
              "2.1"
            ]
          },
          {
            "num": 2,
            "code": "2.2",
            "title": "2.2. Kalıtım",
            "shortTitle": "Kalıtım",
            "outcomeCode": "F.8.2.2.1",
            "outcomes": [
              {
                "id": "F.8.2.2.1",
                "code": "F.8.2.2.1",
                "text": "Kalıtım ile ilgili kavramları tanımlar ve çaprazlamalar yapar."
              }
            ],
            "keywords": [
              "kalıtım",
              "genotip",
              "fenotip",
              "alel gen",
              "homozigot",
              "heterozigot",
              "baskın gen",
              "çekinik gen",
              "çaprazlama",
              "akraba evliliği",
              "2.2"
            ]
          },
          {
            "num": 3,
            "code": "2.3",
            "title": "2.3. Mutasyon ve Modifikasyon",
            "shortTitle": "Mutasyon ve Modifikasyon",
            "outcomeCode": "F.8.2.3.1",
            "outcomes": [
              {
                "id": "F.8.2.3.1",
                "code": "F.8.2.3.1",
                "text": "Mutasyonla modifikasyon arasındaki farklar ile ilgili çıkarımda bulunur."
              }
            ],
            "keywords": [
              "mutasyon",
              "modifikasyon",
              "gen yapısı",
              "gen işleyişi",
              "kalıtsal",
              "kalıtsal olmayan",
              "2.3"
            ]
          },
          {
            "num": 4,
            "code": "2.4",
            "title": "2.4. Adaptasyon",
            "shortTitle": "Adaptasyon",
            "outcomeCode": "F.8.2.4.1",
            "outcomes": [
              {
                "id": "F.8.2.4.1",
                "code": "F.8.2.4.1",
                "text": "Canlıların yaşadıkları çevreye uyumlarını (adaptasyon) gözlem yaparak açıklar."
              }
            ],
            "keywords": [
              "adaptasyon",
              "çevreye uyum",
              "kamuflaj",
              "doğal seçilim",
              "varyasyon",
              "2.4"
            ]
          },
          {
            "num": 5,
            "code": "2.5",
            "title": "2.5. Biyoteknoloji",
            "shortTitle": "Biyoteknoloji",
            "outcomeCode": "F.8.2.5.1",
            "outcomes": [
              {
                "id": "F.8.2.5.1",
                "code": "F.8.2.5.1",
                "text": "Genetik mühendisliği ve biyoteknoloji uygulamalarının olumlu ve olumsuz etkilerini tartışır."
              }
            ],
            "keywords": [
              "biyoteknoloji",
              "genetik mühendisliği",
              "gen aktarımı",
              "klonlama",
              "aşılama",
              "gdo",
              "gen tedavisi",
              "2.5"
            ]
          }
        ],
        "outcomes": [
          {
            "id": "F.8.2.1.1",
            "code": "F.8.2.1.1",
            "text": "Nükleotid, gen, DNA ve kromozom kavramlarını açıklayarak bu kavramlar arasında ilişki kurar.",
            "subtopicNum": 1,
            "subtopicTitle": "DNA ve Genetik Kod"
          },
          {
            "id": "F.8.2.1.2",
            "code": "F.8.2.1.2",
            "text": "DNA'nın yapısını model üzerinde gösterir.",
            "subtopicNum": 1,
            "subtopicTitle": "DNA ve Genetik Kod"
          },
          {
            "id": "F.8.2.1.3",
            "code": "F.8.2.1.3",
            "text": "DNA'nın kendini nasıl eşlediğini açıklar.",
            "subtopicNum": 1,
            "subtopicTitle": "DNA ve Genetik Kod"
          },
          {
            "id": "F.8.2.2.1",
            "code": "F.8.2.2.1",
            "text": "Kalıtım ile ilgili kavramları tanımlar ve çaprazlamalar yapar.",
            "subtopicNum": 2,
            "subtopicTitle": "Kalıtım"
          },
          {
            "id": "F.8.2.3.1",
            "code": "F.8.2.3.1",
            "text": "Mutasyonla modifikasyon arasındaki farklar ile ilgili çıkarımda bulunur.",
            "subtopicNum": 3,
            "subtopicTitle": "Mutasyon ve Modifikasyon"
          },
          {
            "id": "F.8.2.4.1",
            "code": "F.8.2.4.1",
            "text": "Canlıların yaşadıkları çevreye uyumlarını (adaptasyon) gözlem yaparak açıklar.",
            "subtopicNum": 4,
            "subtopicTitle": "Adaptasyon"
          },
          {
            "id": "F.8.2.5.1",
            "code": "F.8.2.5.1",
            "text": "Genetik mühendisliği ve biyoteknoloji uygulamalarının olumlu ve olumsuz etkilerini tartışır.",
            "subtopicNum": 5,
            "subtopicTitle": "Biyoteknoloji"
          }
        ]
      },
      {
        "id": "unit3",
        "num": 3,
        "name": "3. Ünite: Basınç (Katı, Sıvı, Gaz)",
        "icon": "⚖️",
        "gradient": "from-blue-600 via-indigo-700 to-slate-900",
        "subtopics": [
          {
            "num": 1,
            "code": "3.1",
            "title": "3.1. Katı Basıncı",
            "shortTitle": "Katı Basıncı",
            "outcomeCode": "F.8.3.1.1",
            "outcomes": [
              {
                "id": "F.8.3.1.1",
                "code": "F.8.3.1.1",
                "text": "Katı basıncını etkileyen değişkenleri deneyerek keşfeder."
              }
            ],
            "keywords": [
              "katı basıncı",
              "kuvvet",
              "ağırlık",
              "yüzey alanı",
              "pascal",
              "basınç formülü",
              "3.1"
            ]
          },
          {
            "num": 2,
            "code": "3.2",
            "title": "3.2. Sıvı Basıncı",
            "shortTitle": "Sıvı Basıncı",
            "outcomeCode": "F.8.3.1.2",
            "outcomes": [
              {
                "id": "F.8.3.1.2",
                "code": "F.8.3.1.2",
                "text": "Sıvı basıncını etkileyen değişkenleri tahmin eder ve tahminlerini test eder."
              }
            ],
            "keywords": [
              "sıvı basıncı",
              "sıvı yoğunluğu",
              "derinlik",
              "pascal prensibi",
              "su cenderesi",
              "hidrolik sistemler",
              "3.2"
            ]
          },
          {
            "num": 3,
            "code": "3.3",
            "title": "3.3. Gaz Basıncı",
            "shortTitle": "Gaz Basıncı",
            "outcomeCode": "F.8.3.1.3",
            "outcomes": [
              {
                "id": "F.8.3.1.3",
                "code": "F.8.3.1.3",
                "text": "Katı, sıvı ve gazların basınç özelliklerinin günlük yaşam ve teknolojideki uygulamalarına örnekler verir."
              }
            ],
            "keywords": [
              "gaz basıncı",
              "açık hava basıncı",
              "atmosfer basıncı",
              "barometre",
              "manometre",
              "torricelli",
              "kapalı kap basıncı",
              "3.3"
            ]
          }
        ],
        "outcomes": [
          {
            "id": "F.8.3.1.1",
            "code": "F.8.3.1.1",
            "text": "Katı basıncını etkileyen değişkenleri deneyerek keşfeder.",
            "subtopicNum": 1,
            "subtopicTitle": "Katı Basıncı"
          },
          {
            "id": "F.8.3.1.2",
            "code": "F.8.3.1.2",
            "text": "Sıvı basıncını etkileyen değişkenleri tahmin eder ve tahminlerini test eder.",
            "subtopicNum": 2,
            "subtopicTitle": "Sıvı Basıncı"
          },
          {
            "id": "F.8.3.1.3",
            "code": "F.8.3.1.3",
            "text": "Katı, sıvı ve gazların basınç özelliklerinin günlük yaşam ve teknolojideki uygulamalarına örnekler verir.",
            "subtopicNum": 3,
            "subtopicTitle": "Gaz Basıncı"
          }
        ]
      },
      {
        "id": "unit4",
        "num": 4,
        "name": "4. Ünite: Madde ve Endüstri",
        "icon": "🧪",
        "gradient": "from-teal-600 via-emerald-600 to-green-700",
        "subtopics": [
          {
            "num": 1,
            "code": "4.1",
            "title": "4.1. Periyodik Sistem",
            "shortTitle": "Periyodik Sistem",
            "outcomeCode": "F.8.4.1.1",
            "outcomes": [
              {
                "id": "F.8.4.1.1",
                "code": "F.8.4.1.1",
                "text": "Periyodik sistemde, grup ve periyotların nasıl oluşturulduğunu açıklar; elementleri metaller, ametaller ve yarı metaller olarak sınıflandırır."
              }
            ],
            "keywords": [
              "periyodik sistem",
              "periyot",
              "grup",
              "metal",
              "ametal",
              "yarı metal",
              "soygaz",
              "atom numarası",
              "4.1"
            ]
          },
          {
            "num": 2,
            "code": "4.2",
            "title": "4.2. Fiziksel ve Kimyasal Değişimler",
            "shortTitle": "Fiziksel ve Kimyasal Değişimler",
            "outcomeCode": "F.8.4.2.1",
            "outcomes": [
              {
                "id": "F.8.4.2.1",
                "code": "F.8.4.2.1",
                "text": "Fiziksel ve kimyasal değişim arasındaki farkları, çeşitli olayları gözlemleyerek açıklar."
              }
            ],
            "keywords": [
              "fiziksel değişim",
              "kimyasal değişim",
              "renk değişimi",
              "gaz çıkışı",
              "çökelek",
              "hâl değişimi",
              "kırılma",
              "yırtılma",
              "yanma",
              "paslanma",
              "çürüme",
              "4.2"
            ]
          },
          {
            "num": 3,
            "code": "4.3",
            "title": "4.3. Kimyasal Tepkimeler",
            "shortTitle": "Kimyasal Tepkimeler",
            "outcomeCode": "F.8.4.3.1",
            "outcomes": [
              {
                "id": "F.8.4.3.1",
                "code": "F.8.4.3.1",
                "text": "Bileşiklerin kimyasal tepkime sonucunda oluştuğunu bilir ve kütlenin korunduğunu gösterir."
              }
            ],
            "keywords": [
              "kimyasal tepkime",
              "girenler",
              "ürünler",
              "kütlenin korunumu",
              "atom sayısı",
              "atom türü",
              "bağ kırılımı",
              "bağ oluşumu",
              "4.3"
            ]
          },
          {
            "num": 4,
            "code": "4.4",
            "title": "4.4. Asitler ve Bazlar",
            "shortTitle": "Asitler ve Bazlar",
            "outcomeCode": "F.8.4.4.1",
            "outcomes": [
              {
                "id": "F.8.4.4.1",
                "code": "F.8.4.4.1",
                "text": "Asit ve bazların genel özelliklerini ifade eder; pH cetveli ve asit yağmurlarını açıklar."
              }
            ],
            "keywords": [
              "asit",
              "baz",
              "ph",
              "turnusol",
              "belirteç",
              "asit yağmuru",
              "nötralleşme",
              "tuz ve su",
              "4.4"
            ]
          },
          {
            "num": 5,
            "code": "4.5",
            "title": "4.5. Maddenin Isı ile Etkileşimi",
            "shortTitle": "Maddenin Isı ile Etkileşimi",
            "outcomeCode": "F.8.4.5.1",
            "outcomes": [
              {
                "id": "F.8.4.5.1",
                "code": "F.8.4.5.1",
                "text": "Öz ısı kavramını açıklar ve ısınma/soğuma eğrilerini yorumlar."
              }
            ],
            "keywords": [
              "öz ısı",
              "ısınma eğrisi",
              "soğuma eğrisi",
              "erime ısısı",
              "buharlaşma ısısı",
              "hâl değişim ısısı",
              "4.5"
            ]
          },
          {
            "num": 6,
            "code": "4.6",
            "title": "4.6. Türkiye'de Kimya Endüstrisi",
            "shortTitle": "Türkiye'de Kimya Endüstrisi",
            "outcomeCode": "F.8.4.6.1",
            "outcomes": [
              {
                "id": "F.8.4.6.1",
                "code": "F.8.4.6.1",
                "text": "Türkiye'deki kimya endüstrisinin gelişimini ve meslek alanlarını araştırır."
              }
            ],
            "keywords": [
              "kimya endüstrisi",
              "ithalat",
              "ihracat",
              "kimya mühendisliği",
              "petrokimya",
              "4.6"
            ]
          }
        ],
        "outcomes": [
          {
            "id": "F.8.4.1.1",
            "code": "F.8.4.1.1",
            "text": "Periyodik sistemde, grup ve periyotların nasıl oluşturulduğunu açıklar; elementleri metaller, ametaller ve yarı metaller olarak sınıflandırır.",
            "subtopicNum": 1,
            "subtopicTitle": "Periyodik Sistem"
          },
          {
            "id": "F.8.4.2.1",
            "code": "F.8.4.2.1",
            "text": "Fiziksel ve kimyasal değişim arasındaki farkları, çeşitli olayları gözlemleyerek açıklar.",
            "subtopicNum": 2,
            "subtopicTitle": "Fiziksel ve Kimyasal Değişimler"
          },
          {
            "id": "F.8.4.3.1",
            "code": "F.8.4.3.1",
            "text": "Bileşiklerin kimyasal tepkime sonucunda oluştuğunu bilir ve kütlenin korunduğunu gösterir.",
            "subtopicNum": 3,
            "subtopicTitle": "Kimyasal Tepkimeler"
          },
          {
            "id": "F.8.4.4.1",
            "code": "F.8.4.4.1",
            "text": "Asit ve bazların genel özelliklerini ifade eder; pH cetveli ve asit yağmurlarını açıklar.",
            "subtopicNum": 4,
            "subtopicTitle": "Asitler ve Bazlar"
          },
          {
            "id": "F.8.4.5.1",
            "code": "F.8.4.5.1",
            "text": "Öz ısı kavramını açıklar ve ısınma/soğuma eğrilerini yorumlar.",
            "subtopicNum": 5,
            "subtopicTitle": "Maddenin Isı ile Etkileşimi"
          },
          {
            "id": "F.8.4.6.1",
            "code": "F.8.4.6.1",
            "text": "Türkiye'deki kimya endüstrisinin gelişimini ve meslek alanlarını araştırır.",
            "subtopicNum": 6,
            "subtopicTitle": "Türkiye'de Kimya Endüstrisi"
          }
        ]
      },
      {
        "id": "unit5",
        "num": 5,
        "name": "5. Ünite: Basit Makineler",
        "icon": "⚙️",
        "gradient": "from-amber-600 via-orange-600 to-yellow-600",
        "subtopics": [
          {
            "num": 1,
            "code": "5.1",
            "title": "5.1. Basit Makinelerin Genel Özellikleri",
            "shortTitle": "Basit Makinelerin Genel Özellikleri",
            "outcomeCode": "F.8.5.1.1",
            "outcomes": [
              {
                "id": "F.8.5.1.1",
                "code": "F.8.5.1.1",
                "text": "Basit makinelerin sağladığı avantajları (kuvvet kazancı, yoldan kayıp vb.) açıklar."
              }
            ],
            "keywords": [
              "basit makineler",
              "kuvvet kazancı",
              "yoldan kayıp",
              "iş kolaylığı",
              "enerji kazancı yoktur",
              "5.1"
            ]
          },
          {
            "num": 2,
            "code": "5.2",
            "title": "5.2. Makaralar",
            "shortTitle": "Makaralar",
            "outcomeCode": "F.8.5.1.2",
            "outcomes": [
              {
                "id": "F.8.5.1.2",
                "code": "F.8.5.1.2",
                "text": "Sabit ve hareketli makaralar ile palangaları tasarlar ve kuvvet kazancını hesaplar."
              }
            ],
            "keywords": [
              "sabit makara",
              "hareketli makara",
              "palanga",
              "makara",
              "kuvvetin yönü",
              "5.2"
            ]
          },
          {
            "num": 3,
            "code": "5.3",
            "title": "5.3. Kaldıraçlar",
            "shortTitle": "Kaldıraçlar",
            "outcomeCode": "F.8.5.1.3",
            "outcomes": [
              {
                "id": "F.8.5.1.3",
                "code": "F.8.5.1.3",
                "text": "Kaldıraç tiplerini (destek, yük, kuvvet noktaları) karşılaştırır ve günlük yaşam örneklerini verir."
              }
            ],
            "keywords": [
              "kaldıraç",
              "destek noktası",
              "kuvvet kolu",
              "yük kolu",
              "kaldıraç tipleri",
              "5.3"
            ]
          },
          {
            "num": 4,
            "code": "5.4",
            "title": "5.4. Eğik Düzlem, Çıkrık, Dişli Çarklar ve Kasnaklar",
            "shortTitle": "Eğik Düzlem, Çıkrık, Dişli Çarklar ve Kasnaklar",
            "outcomeCode": "F.8.5.1.4",
            "outcomes": [
              {
                "id": "F.8.5.1.4",
                "code": "F.8.5.1.4",
                "text": "Eğik düzlem, çıkrık, dişli çark, kasnak ve vida sistemlerini açıklar; bileşik makineleri analiz eder."
              }
            ],
            "keywords": [
              "eğik düzlem",
              "çıkrık",
              "dişli çark",
              "kasnak",
              "vida",
              "kama",
              "bileşik makineler",
              "5.4"
            ]
          }
        ],
        "outcomes": [
          {
            "id": "F.8.5.1.1",
            "code": "F.8.5.1.1",
            "text": "Basit makinelerin sağladığı avantajları (kuvvet kazancı, yoldan kayıp vb.) açıklar.",
            "subtopicNum": 1,
            "subtopicTitle": "Basit Makinelerin Genel Özellikleri"
          },
          {
            "id": "F.8.5.1.2",
            "code": "F.8.5.1.2",
            "text": "Sabit ve hareketli makaralar ile palangaları tasarlar ve kuvvet kazancını hesaplar.",
            "subtopicNum": 2,
            "subtopicTitle": "Makaralar"
          },
          {
            "id": "F.8.5.1.3",
            "code": "F.8.5.1.3",
            "text": "Kaldıraç tiplerini (destek, yük, kuvvet noktaları) karşılaştırır ve günlük yaşam örneklerini verir.",
            "subtopicNum": 3,
            "subtopicTitle": "Kaldıraçlar"
          },
          {
            "id": "F.8.5.1.4",
            "code": "F.8.5.1.4",
            "text": "Eğik düzlem, çıkrık, dişli çark, kasnak ve vida sistemlerini açıklar; bileşik makineleri analiz eder.",
            "subtopicNum": 4,
            "subtopicTitle": "Eğik Düzlem, Çıkrık, Dişli Çarklar ve Kasnaklar"
          }
        ]
      },
      {
        "id": "unit6",
        "num": 6,
        "name": "6. Ünite: Enerji Dönüşümleri ve Çevre Bilimi",
        "icon": "🌱",
        "gradient": "from-emerald-600 via-green-600 to-lime-600",
        "subtopics": [
          {
            "num": 1,
            "code": "6.1",
            "title": "6.1. Besin Zinciri ve Enerji Akışı",
            "shortTitle": "Besin Zinciri ve Enerji Akışı",
            "outcomeCode": "F.8.6.1.1",
            "outcomes": [
              {
                "id": "F.8.6.1.1",
                "code": "F.8.6.1.1",
                "text": "Besin zincirindeki üretici, tüketici ve ayrıştırıcılara örnekler verir; enerji piramidini açıklar."
              }
            ],
            "keywords": [
              "besin zinciri",
              "enerji piramidi",
              "üretici",
              "tüketici",
              "ayrıştırıcı",
              "biyolojik birikim",
              "aktarılan enerji",
              "6.1"
            ]
          },
          {
            "num": 2,
            "code": "6.2",
            "title": "6.2. Fotosentez ve Solunum",
            "shortTitle": "Fotosentez ve Solunum",
            "outcomeCode": "F.8.6.2.1",
            "outcomes": [
              {
                "id": "F.8.6.2.1",
                "code": "F.8.6.2.1",
                "text": "Fotosentezin canlılar için önemini açıklar; fotosentez ve solunum denklemlerini ilişkilendirir."
              }
            ],
            "keywords": [
              "fotosentez",
              "solunum",
              "kloroplast",
              "mitokondri",
              "oksijenli solunum",
              "oksijensiz solunum",
              "fermantasyon",
              "ışık şiddeti",
              "klorofil",
              "6.2"
            ]
          },
          {
            "num": 3,
            "code": "6.3",
            "title": "6.3. Madde Döngüleri ve Çevre Sorunları",
            "shortTitle": "Madde Döngüleri ve Çevre Sorunları",
            "outcomeCode": "F.8.6.3.1",
            "outcomes": [
              {
                "id": "F.8.6.3.1",
                "code": "F.8.6.3.1",
                "text": "Madde döngülerini açıklar; küresel iklim değişikliği ve ekolojik ayak izini sorgular."
              }
            ],
            "keywords": [
              "madde döngüleri",
              "su döngüsü",
              "karbon döngüsü",
              "azot döngüsü",
              "küresel iklim değişikliği",
              "sera gazları",
              "ekolojik ayak izi",
              "sürdürülebilir kalkınma",
              "6.3"
            ]
          }
        ],
        "outcomes": [
          {
            "id": "F.8.6.1.1",
            "code": "F.8.6.1.1",
            "text": "Besin zincirindeki üretici, tüketici ve ayrıştırıcılara örnekler verir; enerji piramidini açıklar.",
            "subtopicNum": 1,
            "subtopicTitle": "Besin Zinciri ve Enerji Akışı"
          },
          {
            "id": "F.8.6.2.1",
            "code": "F.8.6.2.1",
            "text": "Fotosentezin canlılar için önemini açıklar; fotosentez ve solunum denklemlerini ilişkilendirir.",
            "subtopicNum": 2,
            "subtopicTitle": "Fotosentez ve Solunum"
          },
          {
            "id": "F.8.6.3.1",
            "code": "F.8.6.3.1",
            "text": "Madde döngülerini açıklar; küresel iklim değişikliği ve ekolojik ayak izini sorgular.",
            "subtopicNum": 3,
            "subtopicTitle": "Madde Döngüleri ve Çevre Sorunları"
          }
        ]
      },
      {
        "id": "unit7",
        "num": 7,
        "name": "7. Ünite: Elektrik Yükleri ve Elektrik Enerjisi",
        "icon": "⚡",
        "gradient": "from-cyan-600 via-blue-700 to-indigo-800",
        "subtopics": [
          {
            "num": 1,
            "code": "7.1",
            "title": "7.1. Elektrik Yükleri ve Elektriklenme",
            "shortTitle": "Elektrik Yükleri ve Elektriklenme",
            "outcomeCode": "F.8.7.1.1",
            "outcomes": [
              {
                "id": "F.8.7.1.1",
                "code": "F.8.7.1.1",
                "text": "Elektriklenmeyi açıklar ve elektrik yüklerini sınıflandırır."
              }
            ],
            "keywords": [
              "elektriklenme",
              "sürtünme",
              "dokunma",
              "etki",
              "pozitif yük",
              "negatif yük",
              "nötr",
              "itme çekme",
              "7.1"
            ]
          },
          {
            "num": 2,
            "code": "7.2",
            "title": "7.2. Elektrik Yüklü Cisimler",
            "shortTitle": "Elektrik Yüklü Cisimler",
            "outcomeCode": "F.8.7.2.1",
            "outcomes": [
              {
                "id": "F.8.7.2.1",
                "code": "F.8.7.2.1",
                "text": "Elektroskopun çalışma prensibini açıklar ve topraklamayı kavrar."
              }
            ],
            "keywords": [
              "elektroskop",
              "yapraklar",
              "topraklama",
              "yıldırım",
              "şimşek",
              "paratoner",
              "7.2"
            ]
          },
          {
            "num": 3,
            "code": "7.3",
            "title": "7.3. Elektrik Enerjisinin Dönüşümü",
            "shortTitle": "Elektrik Enerjisinin Dönüşümü",
            "outcomeCode": "F.8.7.3.1",
            "outcomes": [
              {
                "id": "F.8.7.3.1",
                "code": "F.8.7.3.1",
                "text": "Elektrik enerjisinin ısı, ışık ve hareket enerjisine dönüşümünü; sigorta ve elektrik güvenliğini açıklar."
              }
            ],
            "keywords": [
              "elektrik enerjisinin dönüşümü",
              "ısı enerjisi",
              "ışık enerjisi",
              "hareket enerjisi",
              "elektrik motoru",
              "dinamo",
              "sigorta",
              "güç",
              "enerji tasarrufu",
              "7.3"
            ]
          }
        ],
        "outcomes": [
          {
            "id": "F.8.7.1.1",
            "code": "F.8.7.1.1",
            "text": "Elektriklenmeyi açıklar ve elektrik yüklerini sınıflandırır.",
            "subtopicNum": 1,
            "subtopicTitle": "Elektrik Yükleri ve Elektriklenme"
          },
          {
            "id": "F.8.7.2.1",
            "code": "F.8.7.2.1",
            "text": "Elektroskopun çalışma prensibini açıklar ve topraklamayı kavrar.",
            "subtopicNum": 2,
            "subtopicTitle": "Elektrik Yüklü Cisimler"
          },
          {
            "id": "F.8.7.3.1",
            "code": "F.8.7.3.1",
            "text": "Elektrik enerjisinin ısı, ışık ve hareket enerjisine dönüşümünü; sigorta ve elektrik güvenliğini açıklar.",
            "subtopicNum": 3,
            "subtopicTitle": "Elektrik Enerjisinin Dönüşümü"
          }
        ]
      }
    ]
  }
};

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const grade = String(req.query.grade || "5").replace(/^grade-/, "");
  const curriculum = ALL_CURRICULUM[grade] || ALL_CURRICULUM["5"];

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
  return res.status(200).json(curriculum);
};
