// scratch/parts/room_puzzles.js
module.exports = {
    // Detailed data for each of the 8 rooms
    rooms: [
        {
            id: 1,
            num: 1,
            title: "ACİL DURUM: İSTASYONU KURTAR",
            subtitle: "Kontrol Odası & Enerji Yönetimi",
            badge: "İSTASYON MÜHENDİSİ",
            code: "2045", // İstasyon arıza yılı
            audioBrief: "Uzay kâşifi, dikkat! ORBITAL-7 istasyonunda kritik bir sistem arızası tespit edildi. Dünya ile bağlantımız kesildi. Güvenli dönüş sistemini etkinleştirmek için bilimsel görevleri tamamlamalısın. Kontrol odasını incele, enerji akışını doğru öncelikle devreye sok ve ana şalteri aç!",
            hints: [
                "Terminal 1, 2 ve 3 üzerindeki sistem raporlarını sırayla incele.",
                "Bilimsel ipucu: Uzay istasyonunda yaşam destek üniteleri ve ana reaktör (enerji) devreye girmeden laboratuvar kapıları açılamaz.",
                "Çözüm: Enerji terminallerini sırayla 'Reaktör', 'Yaşam Destek' ve 'Haberleşme Gücü' olarak aktive et veya terminale 2045 kodunu gir."
            ]
        },
        {
            id: 2,
            num: 2,
            title: "UZAY TEKNOLOJİLERİ LABORATUVARI",
            subtitle: "Araç Karşılaştırma & Görev Eşleştirme",
            badge: "UZAY TEKNOLOJİLERİ UZMANI",
            code: "1957", // İlk yapay uydu Sputnik 1
            audioBrief: "Uzay Teknolojileri Laboratuvarına hoş geldin! Burada roket, yapay uydu, uzay sondası, uzay mekiği, istasyon ve uzay teleskobu gibi 3D modeller bulunuyor. Araçları 360 derece incele, görev gereksinimlerine göre doğru teknolojiyi seç ve laboratuvar kilidini aç!",
            hints: [
                "Uzak bir gök cismini insansız keşfetmek için 'Uzay Sondası', Dünya yörüngesinde sinyal ve gözlem için 'Yapay Uydu', atmosferden çıkış için 'Roket' kullanılır.",
                "Bilimsel ipucu: Uzay mekiği yeniden kullanılabilir ve uçak gibi iniş yapabilirken, geleneksel roketler kademeli yakıt tanklarını atar.",
                "Çözüm: Görev istasyonlarına 3 doğru aracı eşleştir veya kapı şifresi olan 1957 kodunu gir."
            ]
        },
        {
            id: 3,
            num: 3,
            title: "TÜRKİYE VE UYDU KONTROL MERKEZİ",
            subtitle: "Millî Uydular & Yörünge Simülasyonu",
            badge: "UYDU OPERATÖRÜ",
            code: "1994", // Türksat 1B (ilk başarılı Türk uydusu)
            audioBrief: "Türkiye ve Uydu Kontrol Merkezine bağlandın! Pencereden mavi vatan ve Dünya harika görünüyor. TÜRKSAT 6A, İMECE, RASAT ve BİLSAT uydularımızın görevlerini eşleştir, çanak anteni 42 Doğu yörüngesine kilitle ve Dünya ile bağlantı kur!",
            hints: [
                "TÜRKSAT uyduları haberleşme ve televizyon yayını sağlar; İMECE, RASAT ve GÖKTÜRK ise yüksek çözünürlüklü yer gözlem uydularımızdır.",
                "Bilimsel ipucu: Türkiye'nin ilk yerli ve millî haberleşme uydusu TÜRKSAT 6A'dır. Alper Gezeravcı ise Türkiye'nin ilk astronotu olarak Uluslararası Uzay İstasyonu'nda 13 bilimsel deney yapmıştır.",
                "Çözüm: Çanak anten frekansını 42 dereceye ayarla veya Türkiye'nin ilk başarılı uydusu Türksat 1B'nin fırlatılış yılı olan 1994'ü yaz."
            ]
        },
        {
            id: 4,
            num: 4,
            title: "UZAY KİRLİLİĞİ: ÇARPIŞMAYI ÖNLE",
            subtitle: "Yörünge Radarı & Enkaz Yönetimi",
            badge: "UZAY KİRLİLİĞİ DEDEKTİFİ",
            code: "7800", // 7.8 km/s yörünge hızı
            audioBrief: "Dikkat! Radar sistemi yaklaşan bir uzay enkazı tespit etti! İşlevini yitirmiş uydular ve roket gövdeleri 7.8 kilometre saniye hızla dönüyor. Patlatmak kirliliği daha da artırır; istasyonu güvenli yörüngeye taşıyacak kaçınma manevrasını hesapla ve savunma kalkanını devreye sok!",
            hints: [
                "Uzay kirliliğini oluşturan etkenler: Ömrü tükenen uydular, roket parçaları, patlama enkazlarıdır (Kessler Sendromu). Doğal gök cisimleri uzay kirliliği sayılmaz.",
                "Bilimsel ipucu: Enkazı patlatmak sorunu çözmez, aksine binlerce küçük şarapnel parçası üreterek tehlikeyi katlar! Güvenli çözüm: Yörünge değiştirme (kaçınma manevrası) ve kontrollü atmosferde yakmadır.",
                "Çözüm: Kaçınma manevrasını seçip iticileri ateşle veya yörünge hızı kodu olan 7800'ü gir."
            ]
        },
        {
            id: 5,
            num: 5,
            title: "TELESKOP TASARIM LABORATUVARI",
            subtitle: "Optik Sistemler & Rasathane Konumu",
            badge: "TELESKOP TASARIMCISI",
            code: "1609", // Galileo'nun ilk gökyüzü gözlemi
            audioBrief: "Teleskop Tasarım Laboratuvarına ulaştın! Işık kirliliğinden uzak bir gözlem sistemi kurmamız gerekiyor. Mercek, çukur ayna ve sensör parçalarını birleştir; Hubble ve James Webb teleskoplarının farklarını analiz ederek gözlem kubbesini aç!",
            hints: [
                "Teleskop türleri: Kırıcı (mercekli), yansıtıcı (aynalı) ve radyo teleskoplarıdır.",
                "Bilimsel ipucu: Rasathaneler (gözlemevleri) şehir ışık kirliliğinden uzak, yüksek, havası kuru ve bulutsuz dağ tepelerine kurulur. Hubble Dünya yörüngesinde, James Webb ise Güneş-Dünya L2 noktasında çalışır.",
                "Çözüm: Teleskop optik modelini tamamla veya Galileo'nun teleskobu gökyüzüne çevirdiği yıl olan 1609 kodunu gir."
            ]
        },
        {
            id: 6,
            num: 6,
            title: "YILDIZLARIN YAŞAM DÖNGÜSÜ",
            subtitle: "Bulutsu, Süpernova & Karadelik",
            badge: "YILDIZ ASTROFİZİKÇİSİ",
            code: "5800", // Güneş yüzey sıcaklığı (~5800 K)
            audioBrief: "Holografik Yıldız Laboratuvarına hoş geldin! Yıldızlar nebulalarda (bulutsularda) doğar. Yıldızın nasıl öleceğini ise başlangıç kütlesi belirler. Küçük/orta kütleli ve büyük kütleli yıldızların yaşam evrelerini doğru sıraya diz ve çekirdek füzyon simülasyonunu tamamla!",
            hints: [
                "Küçük/Orta kütleli yıldız: Bulutsu → Önyıldız → Ana Kol (Güneş gibi) → Kırmızı Dev → Gezegenimsi Bulutsu → Beyaz Cüce.",
                "Büyük kütleli yıldız: Bulutsu → Önyıldız → Büyük Kütleli Yıldız → Kırmızı Süperdev → Süpernova Patlaması → Nötron Yıldızı (Pulsar) veya Kara Delik.",
                "Çözüm: Güneş asla süpernova patlaması geçirip kara deliğe dönüşmez! Küçük kütleli yolu tamamla veya Güneş sıcaklık kodu olan 5800'ü gir."
            ]
        },
        {
            id: 7,
            num: 7,
            title: "GALAKSİ VE EVREN HARİTASI",
            subtitle: "Takımyıldızlar, Samanyolu & Işık Yılı",
            badge: "KOZMİK GALAKSİ KÂŞİFİ",
            code: "9460", // 1 Işık Yılı ~ 9.46 trilyon km
            audioBrief: "Kozmik Harita Odasındasın! Karşında devasa Samanyolu galaksisi, Andromeda, Büyükayı ve Avcı takımyıldızları parıldıyor. Unutma; takımyıldızlar Dünya'dan bakıldığında desen oluşturur ama yıldızlar uzayda yan yana değildir. Işık yılının zaman değil mesafe olduğunu kanıtla ve haritayı onar!",
            hints: [
                "Hiyerarşik sıralama (Küçükten Büyüğe): Gezegen → Yıldız (Güneş) → Yıldız Sistemi → Galaksi (Samanyolu) → Uzay → Evren.",
                "Bilimsel ipucu: 'Işık Yılı' bir zaman birimi DEĞİLDİR! Işığın boşlukta 1 yılda kat ettiği devasa mesafe birimidir (~9.46 trilyon kilometre).",
                "Çözüm: Kozmik büyüklük merdivenini eşleştir veya 1 ışık yılı mesafe kodu olan 9460'ı gir."
            ]
        },
        {
            id: 8,
            num: 8,
            title: "DÜNYA'YA DÖNÜŞ: GÜVENLİ İNİŞ",
            subtitle: "Son Ayrılma & Atmosfere Giriş Kapsülü",
            badge: "UZAYDAN KAÇIŞ KAHRAMANI",
            code: "2026", // 2026 Türkiye Yüzyılı Maarif Modeli
            audioBrief: "Mükemmel iş başardın Uzay Kâşifi! Yedi laboratuvarın tüm sistemlerini kurtardın. Şimdi ana kontrol odasındaki dönüş kapsülünü hazırla, atmosfere giriş açısını ve ısı kalkanını doğrula. Dünya'ya güvenle dönmeye hazır mısın? Motorları ateşle!",
            hints: [
                "Atmosfere giriş açısı çok dik olursa kapsül aşırı ısınır ve basınca dayanamaz; çok yatay olursa atmosfere çarpıp uzaya geri seker.",
                "Bilimsel ipucu: Isı kalkanı 2000°C plazma sürtünmesini engeller. Son evrede paraşütler açılarak güvenli iniş sağlanır.",
                "Çözüm: Son onay kodu 2026'dır. Tüm sistemler hazır olduğunda dönüş butonuna bas!"
            ]
        }
    ]
};
