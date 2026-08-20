// 5, 6 ve 7. Sınıf Genel Fen Bilimleri Passaparola Soru Havuzu
const PASSAPAROLA_DATA = [
  {
    "letter": "A",
    "question": "Basit bir elektrik devresinde elektrik enerjisini ışık enerjisine dönüştüren devre elemanı.",
    "answer": "AMPUL",
    "grade": "5. Sınıf",
    "category": "Elektrik Devreleri"
  },
  {
    "letter": "B",
    "question": "Kanımızı süzerek zararlı atıkları vücuttan uzaklaştıran fasulye şeklindeki boşaltım organımız.",
    "answer": "BÖBREK",
    "grade": "6. Sınıf",
    "category": "Vücudumuzdaki Sistemler"
  },
  {
    "letter": "C",
    "question": "Maddelerin işlenerek belirli bir şekil almış haline verilen genel ad (Örn: Tahta masa, cam bardak).",
    "answer": "CİSİM",
    "grade": "5. Sınıf",
    "category": "Madde ve Değişim"
  },
  {
    "letter": "Ç",
    "question": "Şekerin suda tamamen çözünmesi gibi bir maddenin diğeri içinde homojen dağılmasıyla oluşan karışım.",
    "answer": "ÇÖZELTİ",
    "grade": "7. Sınıf",
    "category": "Saf Madde ve Karışımlar"
  },
  {
    "letter": "D",
    "question": "Cisimlere uygulanan kuvvetin büyüklüğünü ölçmek için kullanılan yaylı alet.",
    "answer": "DİNAMOMETRE",
    "grade": "5. Sınıf",
    "category": "Kuvvetin Ölçülmesi"
  },
  {
    "letter": "E",
    "question": "Katı bir maddenin dışarıdan ısı alarak sıvı hale geçmesi olayı (Örn: Buzun suya dönüşmesi).",
    "answer": "ERİME",
    "grade": "5. Sınıf",
    "category": "Maddenin Değişimi"
  },
  {
    "letter": "F",
    "question": "Milyonlarca yıl önce yaşamış canlıların kayaçlar arasında taşlaşmış kalıntı veya izleri.",
    "answer": "FOSİL",
    "grade": "5. Sınıf",
    "category": "Yer Kabuğu ve Dünyamız"
  },
  {
    "letter": "G",
    "question": "Işık kaynağının önüne saydam olmayan (opak) bir cisim konulduğunda arkasında oluşan karanlık alan.",
    "answer": "GÖLGE",
    "grade": "5. Sınıf",
    "category": "Işığın Yayılması"
  },
  {
    "letter": "H",
    "question": "Canlıların canlılık özelliği gösteren en küçük yapı ve görev birimi (Canlılık tuğlası).",
    "answer": "HÜCRE",
    "grade": "5-7. Sınıf",
    "category": "Canlılar ve Hücre"
  },
  {
    "letter": "I",
    "question": "Sıcak maddeden soğuk maddeye doğru aktarılan, birimi Jul veya Kalori olan enerji türü.",
    "answer": "ISI",
    "grade": "5-6. Sınıf",
    "category": "Madde ve Isı"
  },
  {
    "letter": "İ",
    "question": "Elektrik akımını ya da ısıyı üzerinden kolayca geçiren maddelere verilen ad (Örn: Bakır tel, alüminyum).",
    "answer": "İLETKEN",
    "grade": "5-6. Sınıf",
    "category": "Elektrik ve Isı"
  },
  {
    "letter": "J",
    "question": "Fen bilimlerinde iş ve enerji birimi olarak kullanılan temel ölçü birimi.",
    "answer": "JOULE (JUL)",
    "grade": "7. Sınıf",
    "category": "Kuvvet ve Enerji"
  },
  {
    "letter": "K",
    "question": "Duran bir cismi hareket ettirebilen, hareket eden cismi durdurabilen veya yönünü değiştiren etki.",
    "answer": "KUVVET",
    "grade": "5-6. Sınıf",
    "category": "Kuvvet ve Hareket"
  },
  {
    "letter": "L",
    "question": "Sıvı maddelerin hacmini ölçmek için kullanılan temel hacim birimi.",
    "answer": "LİTRE",
    "grade": "5. Sınıf",
    "category": "Madde ve Ölçüm"
  },
  {
    "letter": "M",
    "question": "Vücut hücrelerinde büyümeyi, gelişmeyi ve yaraların onarılmasını sağlayan hücre bölünmesi.",
    "answer": "MİTOZ",
    "grade": "7. Sınıf",
    "category": "Hücre ve Bölünmeler"
  },
  {
    "letter": "N",
    "question": "Dinamometre ile ölçülen kuvvetin ve cisimlerin ağırlığının birimi (Kısaltması N).",
    "answer": "NEWTON",
    "grade": "5-7. Sınıf",
    "category": "Kuvvet"
  },
  {
    "letter": "O",
    "question": "Üzerine düşen ışığı hiç geçirmeyen ve arkasında tam gölge oluşturan maddeler (Örn: Tahta kapı).",
    "answer": "OPAK",
    "grade": "5. Sınıf",
    "category": "Işığın Yayılması"
  },
  {
    "letter": "Ö",
    "question": "Bir maddenin kütlesinin hacmine bölünmesiyle (Kütle / Hacim) hesaplanan ayırt edici özelliği.",
    "answer": "ÖZKÜTLE (YOĞUNLUK)",
    "grade": "6. Sınıf",
    "category": "Madde ve Isı"
  },
  {
    "letter": "P",
    "question": "Basit elektrik devrelerinde elektrik enerjisi üreten kimyasal güç kaynağı.",
    "answer": "PİL",
    "grade": "5-7. Sınıf",
    "category": "Elektrik Devreleri"
  },
  {
    "letter": "R",
    "question": "Vücudumuzun dış uyarılara karşı düşünmeden gösterdiği ani ve istemsiz tepki (Örn: İğne batan eli çekmek).",
    "answer": "REFLEKS",
    "grade": "6. Sınıf",
    "category": "Sinir Sistemi"
  },
  {
    "letter": "S",
    "question": "Hareket eden cisimlerin temas yüzeyleri arasında oluşan ve hareketi zorlaştıran kuvvet.",
    "answer": "SÜRTÜNME KUVVETİ",
    "grade": "5-6. Sınıf",
    "category": "Kuvvet ve Sürtünme"
  },
  {
    "letter": "Ş",
    "question": "Üzerine düşen ışığı tamamen geçiren ve arkasını net olarak gösteren maddeler (Örn: Pencere camı).",
    "answer": "ŞEFFAF (SAYDAM)",
    "grade": "5. Sınıf",
    "category": "Işık"
  },
  {
    "letter": "T",
    "question": "Maddelerin sıcaklığını derece Celsius cinsinden ölçen alet.",
    "answer": "TERMOMETRE",
    "grade": "5. Sınıf",
    "category": "Madde ve Isı"
  },
  {
    "letter": "U",
    "question": "Bir gezegenin etrafında dolanan doğal veya insan yapımı yapay gök cismi (Örn: Ay, Türksat).",
    "answer": "UYDU",
    "grade": "5-7. Sınıf",
    "category": "Güneş Sistemi ve Uzay"
  },
  {
    "letter": "Ü",
    "question": "Canlıların soylarını devam ettirebilmek için yeni yavrular meydana getirmesi olayı.",
    "answer": "ÜREME",
    "grade": "5-7. Sınıf",
    "category": "Canlılar"
  },
  {
    "letter": "V",
    "question": "Meyve ve sebzelerde bolca bulunan, vücudumuzu hastalıklara karşı koruyan düzenleyici besin içeriği.",
    "answer": "VİTAMİN",
    "grade": "5-6. Sınıf",
    "category": "Besinler"
  },
  {
    "letter": "Y",
    "question": "Işık ışınlarının parlak ve düzgün bir yüzeye çarpıp yön değiştirerek geri dönmesi olayı.",
    "answer": "YANSIMA",
    "grade": "5. Sınıf",
    "category": "Işık ve Aynalar"
  },
  {
    "letter": "Z",
    "question": "Yumurta hücresi ile sperm hücresinin birleşmesi (döllenme) sonucu oluşan ilk canlı hücresi.",
    "answer": "ZİGOT",
    "grade": "7. Sınıf",
    "category": "Üreme ve Gelişme"
  }
];
