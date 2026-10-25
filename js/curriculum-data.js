/**
 * Rotalı Fenci - MEB Maarif Modeli Fen Bilimleri Müfredat Veritabanı
 * 5, 6, 7 ve 8. Sınıf Üniteleri ve Alt Başlıkları (Konu Numaralandırmaları)
 */

const MEB_CURRICULUM = {
  "5": {
    grade: "5",
    subject: "Fen Bilimleri",
    units: [
      {
        id: "unit1",
        num: 1,
        name: "1. Ünite: Güneş, Dünya ve Ay",
        icon: "☀️",
        gradient: "from-amber-500 via-orange-500 to-red-600",
        subtopics: [
          {
            num: 1,
            title: "Güneş'in Yapısı ve Özellikleri",
            keywords: ["güneş'in yapısı", "güneşin yapısı", "güneş'in özellikleri", "güneşin özellikleri", "güneş nedir", "katman", "fotosfer", "çekirdek", "taç", "leke", "sunspot", "plazma", "sıcaklık", "büyüklük", "5.1.4"]
          },
          {
            num: 2,
            title: "Ay'ın Yapısı ve Özellikleri",
            keywords: ["ay'ın yapısı", "ayın yapısı", "ay'ın özellikleri", "ayın özellikleri", "krater", "atmosfer", "toz", "yerçekimi", "apollon", "kayaç", "meteor"]
          },
          {
            num: 3,
            title: "Dünya'nın Şekli ve Hareketleri",
            keywords: ["dünya'nın şekli", "dünyanın şekli", "dünya'nın hareketleri", "dünyanın hareketleri", "dönme", "dolanma", "gece gündüz", "eksen", "yıllık", "24 saat", "365 gün", "5.1.3", "katmanları"]
          },
          {
            num: 4,
            title: "Ay'ın Hareketleri ve Evreleri",
            keywords: ["ay'ın hareketleri", "ayın hareketleri", "ay'ın evreleri", "ayın evreleri", "evre", "yeni ay", "ilk dördün", "dolunay", "son dördün", "hilal", "şişkin ay", "döngü", "takvim", "29 gün", "27 gün"]
          }
        ]
      },
      {
        id: "unit2",
        num: 2,
        name: "2. Ünite: Canlılar Dünyası",
        icon: "🌱",
        gradient: "from-emerald-500 via-teal-600 to-green-700",
        subtopics: [
          {
            num: 1,
            title: "Canlıların Sınıflandırılması ve Mikroskobik Canlılar",
            keywords: ["sınıflandırma", "mikroskop", "mikroskobik", "bakteri", "amip", "öglena", "paramesyum"]
          },
          {
            num: 2,
            title: "Mantarlar",
            keywords: ["mantar", "küf", "şapkalı", "maya", "parazit mantar", "mantarlar"]
          },
          {
            num: 3,
            title: "Bitkiler",
            keywords: ["bitki", "bitkiler", "çiçekli bitki", "çiçeksiz bitki", "kök", "gövde", "yaprak", "çiçek", "fotosentez"]
          },
          {
            num: 4,
            title: "Hayvanlar",
            keywords: ["hayvan", "hayvanlar", "omurgalı", "omurgasız", "memeli", "kuş", "sürüngen", "kurbağa", "balık"]
          }
        ]
      },
      {
        id: "unit3",
        num: 3,
        name: "3. Ünite: Kuvvetin Ölçülmesi ve Sürtünme",
        icon: "⚖️",
        gradient: "from-blue-500 via-indigo-600 to-cyan-600",
        subtopics: [
          {
            num: 1,
            title: "Kuvvetin Ölçülmesi (Dinamometre)",
            keywords: ["dinamometre", "kuvvetin ölçülmesi", "newton", "yay", "esneklik", "ölçüm"]
          },
          {
            num: 2,
            title: "Sürtünme Kuvveti (Pürüzlü ve Kaygan Yüzeyler)",
            keywords: ["sürtünme", "sürtünme kuvveti", "pürüzlü", "kaygan", "yüzey", "hareketi zorlaştıran"]
          },
          {
            num: 3,
            title: "Hava ve Su Direnci",
            keywords: ["hava direnci", "su direnci", "paraşüt", "akışkan", "direnç", "aerodinamik"]
          }
        ]
      },
      {
        id: "unit4",
        num: 4,
        name: "4. Ünite: Madde ve Değişim",
        icon: "🧪",
        gradient: "from-purple-500 via-indigo-600 to-violet-700",
        subtopics: [
          {
            num: 1,
            title: "Maddenin Hâl Değişimi",
            keywords: ["hâl değişimi", "hal değişimi", "erime", "donma", "buharlaşma", "yoğuşma", "kaynama", "süblimleşme", "kırağılaşma"]
          },
          {
            num: 2,
            title: "Maddenin Ayırt Edici Özellikleri",
            keywords: ["ayırt edici", "erime noktası", "donma noktası", "kaynama noktası"]
          },
          {
            num: 3,
            title: "Isı ve Sıcaklık",
            keywords: ["ısı", "sıcaklık", "termometre", "kalori", "joule", "ısı alışverişi"]
          },
          {
            num: 4,
            title: "Isı Maddeleri Etkiler (Genleşme ve Büzülme)",
            keywords: ["genleşme", "büzülme", "termostat", "gravzant halkası", "hacim artışı"]
          }
        ]
      },
      {
        id: "unit5",
        num: 5,
        name: "5. Ünite: Işığın Yayılması",
        icon: "💡",
        gradient: "from-amber-400 via-yellow-500 to-orange-500",
        subtopics: [
          {
            num: 1,
            title: "Işığın Yayılması",
            keywords: ["ışığın yayılması", "isigin yayilmasi", "doğrusal", "ışık ışını", "ışık kaynağı"]
          },
          {
            num: 2,
            title: "Işığın Yansıması",
            keywords: ["yansıma", "yansima", "düzgün yansıma", "dağınık yansıma", "gelen ışın", "yansıyan ışın", "normal"]
          },
          {
            num: 3,
            title: "Işığın Maddeyle Karşılaşması",
            keywords: ["saydam", "yarı saydam", "opak", "ışık geçirgenliği"]
          },
          {
            num: 4,
            title: "Tam Gölge",
            keywords: ["tam gölge", "gölge oluşumu", "gölge boyu", "perde"]
          }
        ]
      },
      {
        id: "unit6",
        num: 6,
        name: "6. Ünite: İnsan ve Çevre",
        icon: "🌍",
        gradient: "from-green-600 via-emerald-600 to-teal-700",
        subtopics: [
          {
            num: 1,
            title: "Biyoçeşitlilik",
            keywords: ["biyoçeşitlilik", "ekosistem", "nesli tükenen", "endemik", "doğal yaşam"]
          },
          {
            num: 2,
            title: "İnsan ve Çevre İlişkisi",
            keywords: ["çevre kirliliği", "hava kirliliği", "su kirliliği", "toprak kirliliği", "geri dönüşüm"]
          },
          {
            num: 3,
            title: "Yıkıcı Doğa Olayları",
            keywords: ["deprem", "heyelan", "sel", "volkan", "yanardağ", "fırtına", "kasırga", "doğal afet"]
          }
        ]
      },
      {
        id: "unit7",
        num: 7,
        name: "7. Ünite: Elektrik Devre Elemanları",
        icon: "⚡",
        gradient: "from-cyan-500 via-blue-600 to-indigo-700",
        subtopics: [
          {
            num: 1,
            title: "Devre Elemanlarının Sembollerle Gösterimi",
            keywords: ["devre elemanları", "sembol", "pil", "anahtar", "ampul", "bağlantı kablosu", "şema"]
          },
          {
            num: 2,
            title: "Basit Devrede Lamba Parlaklığını Etkileyen Değişkenler",
            keywords: ["lamba parlaklığı", "ampul parlaklığı", "bağımsız değişken", "bağımlı değişken", "kontrol edilen değişken", "pil sayısı", "ampul sayısı"]
          }
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
        num: 1,
        name: "1. Ünite: Güneş Sistemi ve Tutulmalar",
        icon: "🪐",
        gradient: "from-orange-500 via-amber-600 to-red-600",
        subtopics: [
          { num: 1, title: "Güneş Sistemi ve Gezegenler", keywords: ["gezegen", "iç gezegen", "dış gezegen", "merkür", "venüs", "dünya", "mars", "jüpiter", "satürn", "uranüs", "neptün"] },
          { num: 2, title: "Meteor, Gök Taşı ve Asteroitler", keywords: ["meteorit", "meteor", "gök taşı", "asteroit", "asteroit kuşağı"] },
          { num: 3, title: "Güneş Tutulması", keywords: ["güneş tutulması", "ay yeni ay", "ışık gölge"] },
          { num: 4, title: "Ay Tutulması", keywords: ["ay tutulması", "dolunay", "dünya gölgesi"] }
        ]
      },
      {
        id: "unit2",
        num: 2,
        name: "2. Ünite: Vücudumuzdaki Sistemler",
        icon: "🫀",
        gradient: "from-rose-500 via-red-600 to-pink-600",
        subtopics: [
          { num: 1, title: "Destek ve Hareket Sistemi", keywords: ["kemik", "eklem", "kas", "çizgili kas", "düz kas", "kıkırdak"] },
          { num: 2, title: "Sindirim Sistemi", keywords: ["sindirim", "mekanik sindirim", "kimyasal sindirim", "ağız", "mide", "ince bağırsak", "enzim"] },
          { num: 3, title: "Dolaşım Sistemi", keywords: ["kalp", "kan", "damar", "büyük dolaşım", "küçük dolaşım", "kan grupları", "alyuvar", "akyuvar"] },
          { num: 4, title: "Solunum Sistemi", keywords: ["akciğer", "soluk alıp verme", "diyafram", "bronş", "alveol", "oksijen"] },
          { num: 5, title: "Boşaltım Sistemi", keywords: ["böbrek", "nefron", "üreter", "idrar kesesi", "boşaltım"] }
        ]
      },
      {
        id: "unit3",
        num: 3,
        name: "3. Ünite: Kuvvet ve Hareket",
        icon: "🏎️",
        gradient: "from-blue-600 via-indigo-600 to-cyan-600",
        subtopics: [
          { num: 1, title: "Bileşke Kuvvet (Net Kuvvet)", keywords: ["bileşke kuvvet", "net kuvvet", "dengelenmiş kuvvet", "dengelenmemiş kuvvet"] },
          { num: 2, title: "Sabit Süratli Hareket", keywords: ["sürat", "yol zaman grafiği", "alınan yol", "geçen zaman"] }
        ]
      },
      {
        id: "unit4",
        num: 4,
        name: "4. Ünite: Madde ve Isı",
        icon: "🔥",
        gradient: "from-amber-600 via-red-600 to-yellow-600",
        subtopics: [
          { num: 1, title: "Maddenin Tanecikli Yapısı", keywords: ["tanecik", "boşluklu yapı", "öteleme", "dönme", "titreşim"] },
          { num: 2, title: "Yoğunluk", keywords: ["yoğunluk", "özkütle", "kütle hacim grafiği", "d=m/v"] },
          { num: 3, title: "Isı İletimi ve Yalıtım Malzemeleri", keywords: ["ısı iletkeni", "ısı yalıtkanı", "yalıtım malzemesi", "strafor", "cam yünü"] },
          { num: 4, title: "Yakıtlar ve Çevreye Etkileri", keywords: ["katı yakıt", "sıvı yakıt", "gaz yakıt", "kömür", "petrol", "soba zehirlenmesi"] }
        ]
      },
      {
        id: "unit5",
        num: 5,
        name: "5. Ünite: Ses ve Özellikleri",
        icon: "📢",
        gradient: "from-purple-600 via-violet-600 to-indigo-600",
        subtopics: [
          { num: 1, title: "Sesin Yayılması", keywords: ["sesin yayılması", "maddesel ortam", "katı sıvı gaz"] },
          { num: 2, title: "Sesin Farklı Ortamlarda Farklı Duyulması", keywords: ["farklı duyulması", "ses kaynağı"] },
          { num: 3, title: "Sesin Sürati", keywords: ["sesin sürati", "ışık sürati", "yankı"] },
          { num: 4, title: "Sesin Maddeyle Etkileşmesi ve Yalıtım", keywords: ["ses yalıtımı", "akustik", "sesin yansıması", "sesin soğrulması"] }
        ]
      },
      {
        id: "unit6",
        num: 6,
        name: "6. Ünite: Vücudumuzdaki Sistemler ve Sağlığı",
        icon: "🧠",
        gradient: "from-pink-600 via-rose-600 to-purple-600",
        subtopics: [
          { num: 1, title: "Denetleyici ve Düzenleyici Sistemler", keywords: ["beyin", "beyincik", "omurilik", "omurilik soğanı", "iç salgı bezleri", "refleks", "hipofiz", "tiroit"] },
          { num: 2, title: "Duyu Organları", keywords: ["göz", "kulak", "burun", "dil", "deri", "görme", "işitme"] },
          { num: 3, title: "Sistemlerin Sağlığı ve İlk Yardım", keywords: ["sağlık", "organ bağışı", "zararlı alışkanlıklar", "ilk yardım"] }
        ]
      },
      {
        id: "unit7",
        num: 7,
        name: "7. Ünite: Elektriğin İletimi",
        icon: "🔌",
        gradient: "from-cyan-600 via-blue-600 to-teal-600",
        subtopics: [
          { num: 1, title: "İletken ve Yalıtkan Maddeler", keywords: ["iletken", "yalıtkan", "elektrik iletimi", "tuzlu su", "bakır"] },
          { num: 2, title: "Elektriksel Direnç ve Bağlı Olduğu Faktörler", keywords: ["elektriksel direnç", "tel uzunluğu", "tel kesiti", "tel cinsi", "reosta"] }
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
        num: 1,
        name: "1. Ünite: Güneş Sistemi ve Ötesi",
        icon: "🌌",
        gradient: "from-indigo-600 via-purple-700 to-slate-900",
        subtopics: [
          { num: 1, title: "Uzay Araştırmaları ve Teleskoplar", keywords: ["teleskop", "uzay araştırmaları", "uydu", "rasathane", "uzay kirliliği", "hubble", "james webb"] },
          { num: 2, title: "Güneş Sistemi Ötesi: Yıldızlar ve Takımyıldızlar", keywords: ["yıldız", "bulutsu", "nebula", "süpernova", "karadelik", "takımyıldız", "büyükayı", "kutup yıldızı"] },
          { num: 3, title: "Galaksiler (Gök Adalar) ve Evren", keywords: ["galaksi", "samanyolu", "andromeda", "evren", "uzay"] }
        ]
      },
      {
        id: "unit2",
        num: 2,
        name: "2. Ünite: Hücre ve Bölünmeler",
        icon: "🔬",
        gradient: "from-emerald-600 via-teal-600 to-cyan-700",
        subtopics: [
          { num: 1, title: "Hücre ve Organeller", keywords: ["hücre", "çekirdek", "sitoplazma", "hücre zarı", "mitokondri", "kloroplast", "ribozom", "bitki hayvan hücresi"] },
          { num: 2, title: "Mitoz Bölünme", keywords: ["mitoz", "bölünme", "kromozom", "interfaz", "profaz", "metafaz", "anafaz", "telofaz", "vücut hücresi"] },
          { num: 3, title: "Mayoz Bölünme", keywords: ["mayoz", "üreme hücresi", "sperm", "yumurta", "parça değişimi", "crossing-over", "çeşitlilik"] }
        ]
      },
      {
        id: "unit3",
        num: 3,
        name: "3. Ünite: Kuvvet ve Enerji",
        icon: "⚡",
        gradient: "from-cyan-600 via-blue-700 to-indigo-800",
        subtopics: [
          { num: 1, title: "Kütle ve Ağırlık İlişkisi", keywords: ["kütle", "ağırlık", "yerçekimi ivmesi", "dinamometre", "terazi", "ay'da ağırlık"] },
          { num: 2, title: "Fiziksel Anlamda İş", keywords: ["fiziksel iş", "iş", "w=f.x", "kuvvet doğrultusu"] },
          { num: 3, title: "Kinetik ve Potansiyel Enerji", keywords: ["kinetik enerji", "potansiyel enerji", "çekim potansiyel", "esneklik potansiyel"] },
          { num: 4, title: "Enerjinin Korunumu ve Dönüşümü", keywords: ["enerji korunumu", "enerji dönüşümü", "sürtünme kuvveti", "ısıya dönüşüm"] }
        ]
      },
      {
        id: "unit4",
        num: 4,
        name: "4. Ünite: Saf Madde ve Karışımlar",
        icon: "⚗️",
        gradient: "from-purple-600 via-fuchsia-600 to-pink-600",
        subtopics: [
          { num: 1, title: "Maddenin Tanecikli Yapısı (Atom ve Molekül)", keywords: ["atom", "proton", "nötron", "elektron", "molekül", "democritus", "dalton", "thomson", "rutherford", "bohr"] },
          { num: 2, title: "Saf Maddeler: Element ve Bileşikler", keywords: ["element", "bileşik", "sembol", "formül", "h2o", "nacl"] },
          { num: 3, title: "Karışımlar ve Çözünme", keywords: ["karışım", "homojen", "heterojen", "çözelti", "çözücü", "çözünen", "çözünme hızı"] },
          { num: 4, title: "Karışımların Ayrılması", keywords: ["buharlaştırma", "damıtma", "yoğunluk farkı", "ayırma hunisi", "süzme", "mıknatıs"] }
        ]
      },
      {
        id: "unit5",
        num: 5,
        name: "5. Ünite: Işığın Madde ile Etkileşimi",
        icon: "🪞",
        gradient: "from-amber-500 via-orange-600 to-red-600",
        subtopics: [
          { num: 1, title: "Işığın Soğrulması ve Renkler", keywords: ["soğrulma", "renkler", "güneş enerjisi", "beyaz ışık", "prizma"] },
          { num: 2, title: "Aynalar ve Kullanım Alanları", keywords: ["düz ayna", "çukur ayna", "tümsek ayna", "odak noktası", "görüntü özellikleri"] },
          { num: 3, title: "Işığın Kırılması ve Mercekler", keywords: ["ışığın kırılması", "mercek", "ince kenarlı", "kalın kenarlı", "kırılma indisi"] }
        ]
      },
      {
        id: "unit6",
        num: 6,
        name: "6. Ünite: Canlılarda Üreme, Büyüme ve Gelişme",
        icon: "🐣",
        gradient: "from-emerald-500 via-green-600 to-teal-600",
        subtopics: [
          { num: 1, title: "İnsanda Üreme, Büyüme ve Gelişme", keywords: ["insanda üreme", "döllenme", "zigot", "embriyo", "fetüs", "bebek"] },
          { num: 2, title: "Hayvanlarda Üreme, Büyüme ve Gelişme", keywords: ["başkalaşım", "kurbağa", "kelebek", "doğurarak", "yumurtayla"] },
          { num: 3, title: "Bitkilerde Üreme, Büyüme ve Gelişme", keywords: ["tozlaşma", "çimlenme", "tohum", "vejetatif üreme"] }
        ]
      },
      {
        id: "unit7",
        num: 7,
        name: "7. Ünite: Elektrik Devreleri",
        icon: "🔋",
        gradient: "from-blue-600 via-indigo-600 to-cyan-600",
        subtopics: [
          { num: 1, title: "Seri ve Paralel Bağlama", keywords: ["seri bağlama", "paralel bağlama", "devre", "ampul parlaklığı"] },
          { num: 2, title: "Akım, Gerilim ve Direnç İlişkisi (Ohm Yasası)", keywords: ["akım", "gerilim", "volt", "amper", "ohm", "ampermetre", "voltmetre", "ohm yasası", "v=i.r"] }
        ]
      }
    ]
  },
  "8": {
    grade: "8",
    subject: "Fen Bilimleri (LGS)",
    units: [
      {
        id: "unit1",
        num: 1,
        name: "1. Ünite: Mevsimler ve İklim",
        icon: "🌦️",
        gradient: "from-amber-500 via-sky-600 to-indigo-700",
        subtopics: [
          { num: 1, title: "Mevsimlerin Oluşumu", keywords: ["mevsimlerin oluşumu", "eksen eğikliği", "21 haziran", "21 aralık", "21 mart", "23 eylül", "ekinoks", "gün dönümü", "ışığın geliş açısı"] },
          { num: 2, title: "İklim ve Hava Hareketleri", keywords: ["iklim", "hava hareketleri", "rüzgâr", "yüksek basınç", "alçak basınç", "nem", "yağış", "sera etkisi", "küresel iklim değişikliği"] }
        ]
      },
      {
        id: "unit2",
        num: 2,
        name: "2. Ünite: DNA ve Genetik Kod",
        icon: "🧬",
        gradient: "from-indigo-600 via-purple-600 to-pink-600",
        subtopics: [
          { num: 1, title: "DNA ve Genetik Kod", keywords: ["dna", "nükleotid", "gen", "kromozom", "adenin", "timin", "guanin", "sitozin", "dna eşlenmesi"] },
          { num: 2, title: "Kalıtım", keywords: ["kalıtım", "mendel", "alel", "genotip", "fenotip", "baskın", "çekinik", "saf döl", "melez döl", "çaprazlama", "akraba evliliği"] },
          { num: 3, title: "Mutasyon ve Modifikasyon", keywords: ["mutasyon", "modifikasyon", "gen yapısı", "gen işleyişi", "van kedisi", "himalaya tavşanı"] },
          { num: 4, title: "Adaptasyon (Çevreye Uyum)", keywords: ["adaptasyon", "kamuflaj", "doğal seçilim", "varyasyon"] },
          { num: 5, title: "Biyoteknoloji ve Genetik Mühendisliği", keywords: ["biyoteknoloji", "genetik mühendisliği", "klonlama", "gen aktarımı", "gen tedavisi", "aşı"] }
        ]
      },
      {
        id: "unit3",
        num: 3,
        name: "3. Ünite: Basınç",
        icon: "🧱",
        gradient: "from-blue-600 via-teal-600 to-emerald-700",
        subtopics: [
          { num: 1, title: "Katı Basıncı", keywords: ["katı basıncı", "yüzey alanı", "ağırlık", "p=g/s", "basınç kuvveti"] },
          { num: 2, title: "Sıvı Basıncı ve Pascal Prensibi", keywords: ["sıvı basıncı", "derinlik", "sıvı yoğunluğu", "p=h.d.g", "pascal prensibi", "su cenderesi", "hidrolik fren"] },
          { num: 3, title: "Gaz (Açık Hava) Basıncı", keywords: ["gaz basıncı", "açık hava basıncı", "torriçelli", "barometre", "manometre", "vakum"] }
        ]
      },
      {
        id: "unit4",
        num: 4,
        name: "4. Ünite: Madde ve Endüstri",
        icon: "🏭",
        gradient: "from-purple-600 via-red-600 to-amber-600",
        subtopics: [
          { num: 1, title: "Periyodik Sistem", keywords: ["periyodik sistem", "grup", "periyot", "metal", "ametal", "yarı metal", "soygaz"] },
          { num: 2, title: "Fiziksel ve Kimyasal Değişimler", keywords: ["fiziksel değişim", "kimyasal değişim", "renk değişimi", "gaz çıkışı", "çökelek"] },
          { num: 3, title: "Kimyasal Tepkimeler ve Kütlenin Korunumu", keywords: ["kimyasal tepkime", "girenler", "ürünler", "kütlenin korunumu", "bağ kırılımı", "bağ oluşumu"] },
          { num: 4, title: "Asitler ve Bazlar", keywords: ["asit", "baz", "ph", "turnusol", "asit yağmurları", "nötralleşme"] },
          { num: 5, title: "Maddenin Isı ile Etkileşimi", keywords: ["öz ısı", "ısınma eğrisi", "soğuma eğrisi", "erime ısısı", "buharlaşma ısısı"] },
          { num: 6, title: "Türkiye'de Kimya Endüstrisi", keywords: ["kimya endüstrisi", "ithalat", "ihracat", "petrokimya"] }
        ]
      },
      {
        id: "unit5",
        num: 5,
        name: "5. Ünite: Basit Makineler",
        icon: "⚙️",
        gradient: "from-slate-700 via-zinc-800 to-neutral-900",
        subtopics: [
          { num: 1, title: "Basit Makineler ve Makaralar", keywords: ["basit makineler", "kuvvet kazancı", "yoldan kayıp", "sabit makara", "hareketli makara", "palanga"] },
          { num: 2, title: "Kaldıraçlar", keywords: ["kaldıraç", "destek ortada", "yük ortada", "kuvvet ortada", "kuvvet kolu", "yük kolu"] },
          { num: 3, title: "Eğik Düzlem, Çıkrık, Vida, Dişli Çark ve Kasnaklar", keywords: ["eğik düzlem", "çıkrık", "vida", "dişli çark", "kasnak"] }
        ]
      },
      {
        id: "unit6",
        num: 6,
        name: "6. Ünite: Enerji Dönüşümleri ve Çevre Bilimi",
        icon: "🍃",
        gradient: "from-emerald-600 via-green-600 to-lime-600",
        subtopics: [
          { num: 1, title: "Besin Zinciri ve Enerji Akışı", keywords: ["besin zinciri", "ekolojik piramit", "üretici", "tüketici", "ayrıştırıcı", "biyolojik birikim"] },
          { num: 2, title: "Fotosentez", keywords: ["fotosentez", "klorofil", "glikoz", "oksijen", "karbondioksit", "ışık şiddeti"] },
          { num: 3, title: "Hücresel Solunum", keywords: ["solunum", "oksijenli solunum", "oksijensiz solunum", "fermantasyon", "atp"] },
          { num: 4, title: "Madde Döngüleri ve Çevre Sorunları", keywords: ["su döngüsü", "karbon döngüsü", "azot döngüsü", "oksijen döngüsü", "sera gazları", "karbon ayak izi"] },
          { num: 5, title: "Sürdürülebilir Kalkınma", keywords: ["sürdürülebilir kalkınma", "geri dönüşüm", "tasarruf"] }
        ]
      },
      {
        id: "unit7",
        num: 7,
        name: "7. Ünite: Elektrik Yükleri ve Elektrik Enerjisi",
        icon: "⚡",
        gradient: "from-blue-600 via-cyan-600 to-teal-700",
        subtopics: [
          { num: 1, title: "Elektrik Yükleri ve Elektriklenme", keywords: ["elektriklenme", "sürtünme ile elektriklenme", "dokunma ile elektriklenme", "etki ile elektriklenme", "pozitif yük", "negatif yük"] },
          { num: 2, title: "Elektroskop ve Topraklama", keywords: ["elektroskop", "topraklama", "nötr cisim", "yük dağılımı"] },
          { num: 3, title: "Elektrik Enerjisinin Dönüşümü", keywords: ["elektrik enerjisinin dönüşümü", "ısı enerjisi", "ışık enerjisi", "hareket enerjisi", "sigorta", "güvenli elektrik"] }
        ]
      }
    ]
  }
};

/**
 * Belirli bir sınıf ve ünite için alt başlıkları döndürür
 */
function getUnitSubtopics(gradeNum, unitNum) {
  const gStr = String(gradeNum).replace(/[^0-9]/g, '');
  const uNum = parseInt(unitNum, 10);
  if (MEB_CURRICULUM[gStr] && Array.isArray(MEB_CURRICULUM[gStr].units)) {
    const unitObj = MEB_CURRICULUM[gStr].units.find(u => u.num === uNum);
    if (unitObj && Array.isArray(unitObj.subtopics)) {
      return unitObj.subtopics;
    }
  }
  return [];
}

/**
 * Bir materyalin belirli bir alt başlıkla eşleşip eşleşmediğini kontrol eder
 */
function isMaterialMatchingSubtopic(material, subtopic) {
  if (!material || !subtopic) return false;
  if (material.subtopicNum && parseInt(material.subtopicNum, 10) === subtopic.num) return true;
  if (material.subtopicId && material.subtopicId === subtopic.id) return true;

  const titleLower = String(material.title || '').toLowerCase();
  const descLower = String(material.desc || '').toLowerCase();
  const tagsStr = Array.isArray(material.tags) ? material.tags.join(' ').toLowerCase() : String(material.tags || '').toLowerCase();
  const fullText = `${titleLower} ${descLower} ${tagsStr}`;

  // Alt başlık adının doğrudan geçmesi
  const subTitleClean = subtopic.title.toLowerCase().replace(/[^a-z0-9ğüşöçıİĞÜŞÖÇ]/gi, ' ');
  if (titleLower.includes(subTitleClean) || fullText.includes(subTitleClean)) return true;

  // Anahtar kelime eşleşmesi
  if (Array.isArray(subtopic.keywords)) {
    for (const kw of subtopic.keywords) {
      const kwClean = kw.toLowerCase().trim();
      if (kwClean.length >= 3 && fullText.includes(kwClean)) {
        return true;
      }
    }
  }

  return false;
}

if (typeof window !== 'undefined') {
  window.MEB_CURRICULUM = MEB_CURRICULUM;
  window.ALL_CURRICULUM = MEB_CURRICULUM;
  window.getUnitSubtopics = getUnitSubtopics;
  window.isMaterialMatchingSubtopic = isMaterialMatchingSubtopic;
}

if (typeof module !== 'undefined') {
  module.exports = {
    MEB_CURRICULUM,
    ALL_CURRICULUM: MEB_CURRICULUM,
    getUnitSubtopics,
    isMaterialMatchingSubtopic
  };
}
