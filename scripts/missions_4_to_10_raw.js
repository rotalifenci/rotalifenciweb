module.exports = [{
                id: 4,
                station: 'sun',
                title: "Güneş Lekeleri Dedektifi",
                shortDesc: "Teleskopla Güneş lekelerini tespit et ve sıcaklığını ölç.",
                questionPool: [
                    {
                        category: "GÜNEŞ'İN YAPISI VE ÖZELLİKLERİ",
                        title: "Güneş Lekeleri (Sunspots) Neden Koyu Görünür?",
                        body: "Güneş yüzeyini teleskopla gözlemlediğimizde bazı bölgelerin koyu renkli lekeler şeklinde olduğunu görürüz. Bu lekeler hakkında hangi ifade DOĞRUDUR?",
                        options: [
                            { text: "Güneş lekeleri, çevrelerine göre daha soğuk olan bölgelerdir", correct: true },
                            { text: "Güneş'in üzerindeki devasa krater çukurlarıdır", correct: false },
                            { text: "Güneş'in yanıp tükenmiş kömürleşmiş kısımlarıdır", correct: false },
                            { text: "Güneş'in arkasında kalan gölgelerdir", correct: false }
                        ],
                        explanation: "Mükemmel! Güneş lekeleri yüzeydeki çevrelerine (yaklaşık 6.000 °C) göre daha serin (yaklaşık 4.000 °C) olduğu için karanlık lekeler şeklinde görünür."
                    },
                    {
                        category: "GÜNEŞ'İN YAPISI VE ÖZELLİKLERİ",
                        title: "Güneş Gözlemi ve Güvenlik",
                        body: "Güneş lekelerini incelemek isteyen bir araştırmacı Güneş'e nasıl bakmalıdır?",
                        options: [
                            { text: "Özel onaylı güneş filtresine sahip teleskop veya koruyucu gözlükle", correct: true },
                            { text: "Normal güneş gözlüğü veya koyu renkli cam arkasından", correct: false },
                            { text: "Çıplak gözle doğrudan teleskop vizöründen", correct: false },
                            { text: "Büyüteç ile doğrudan odaklayarak", correct: false }
                        ],
                        explanation: "Çok önemli! Güneş'e filtresiz optik araçlarla veya çıplak gözle bakmak kalıcı körlüğe yol açabilir. Daima özel solar filtre kullanılmalıdır."
                    },
                    {
                        category: "GÜNEŞ'İN YAPISI VE ÖZELLİKLERİ",
                        title: "Güneş Lekelerinin Büyüklüğü",
                        body: "Güneş üzerinde küçük noktalar gibi gördüğümüz tipik bir güneş lekesinin gerçek büyüklüğü yaklaşık ne kadardır?",
                        options: [
                            { text: "Genellikle Dünya'mız kadar hatta birkaç katı büyüklükte olabilir", correct: true },
                            { text: "Bir futbol sahası kadardır", correct: false },
                            { text: "Bir otomobil büyüklüğündedir", correct: false },
                            { text: "Sadece mikroskopla görülebilir", correct: false }
                        ],
                        explanation: "İnanılmaz ama gerçek! Güneş devasa olduğu için yüzeyindeki minik bir leke bile içine birkaç Dünya alabilecek büyüklüktedir."
                    },
                    {
                        category: "GÜNEŞ'İN YAPISI VE ÖZELLİKLERİ",
                        title: "Güneş'in Gaz Bileşimi",
                        body: "Güneş'in kütlesinin yaklaşık %73'ünü ve %25'ini oluşturan en temel iki gaz elementi hangileridir?",
                        options: [
                            { text: "Hidrojen ve Helyum", correct: true },
                            { text: "Oksijen ve Karbondioksit", correct: false },
                            { text: "Azot ve Su buharı", correct: false },
                            { text: "Demir ve Kükürt", correct: false }
                        ],
                        explanation: "Harika kimya ve uzay bilgisi! Güneş devasa bir gaz küresidir; ana yakıtı hidrojen olup nükleer tepkimelerle helyuma dönüşür."
                    }
                ]
            },
            {
                id: 5,
                station: 'sun',
                title: "Galileo ve Dönme Yönü",
                shortDesc: "Güneş'in kendi ekseni etrafındaki dönüşünü kanıtla.",
                questionPool: [
                    {
                        category: "GÜNEŞ'İN YAPISI VE ÖZELLİKLERİ",
                        title: "Galileo Güneş'in Döndüğünü Nasıl Keşfetti?",
                        body: "Galileo Galilei 1610 yılında geliştirdiği teleskopla Güneş lekelerini kağıda yansıtarak takip etti. Lekelerin hep aynı yöne kaydığını gördü. Güneş'in dönme yönü hangisidir?",
                        options: [
                            { text: "Saat yönünün tersine (Batıdan Doğuya)", correct: true },
                            { text: "Saat yönünde (Doğudan Batıya)", correct: false },
                            { text: "Kuzeyden Güneye doğru", correct: false },
                            { text: "Güneş kendi ekseni etrafında hiç dönmez", correct: false }
                        ],
                        explanation: "Harika! Güneş, Dünya ve Ay'ın ortak özelliği; hem kendi eksenleri etrafında hem de dolanma yörüngelerinde saat yönünün tersine (Batıdan Doğuya) dönmeleridir!"
                    },
                    {
                        category: "GÜNEŞ'İN YAPISI VE ÖZELLİKLERİ",
                        title: "Güneş Gaz Mıdır, Katı Mıdır?",
                        body: "Güneş'in ekvator bölgesinin kutuplarından daha hızlı dönmesi (diferansiyel rotasyon) bize Güneş hakkında neyi kanıtlar?",
                        options: [
                            { text: "Güneş'in katı bir küre değil, gaz ve plazma yapısında olduğunu", correct: true },
                            { text: "Güneş'in içinin tamamen boş olduğunu", correct: false },
                            { text: "Güneş'in Dünya etrafında dolandığını", correct: false },
                            { text: "Güneş'in hızla soğuyup buz tuttuğunu", correct: false }
                        ],
                        explanation: "Doğru! Katı cisimler tek parça dönerken, Güneş plazma gazı olduğu için ekvatoru 25 günde, kutupları ise yaklaşık 35 günde döner."
                    },
                    {
                        category: "GÜNEŞ'İN YAPISI VE ÖZELLİKLERİ",
                        title: "Güneş'in Dönüş Süresi",
                        body: "Güneş'in kendi ekseni etrafındaki bir tam dönüşü ortalama kaç Dünya günü sürer?",
                        options: [
                            { text: "Yaklaşık 25-27 gün", correct: true },
                            { text: "Tam 24 saat", correct: false },
                            { text: "365 gün 6 saat", correct: false },
                            { text: "1 saat", correct: false }
                        ],
                        explanation: "Tebrikler! Güneş ekvatorunda yaklaşık 25 günde, genelde ortalama 27 günde kendi etrafında 1 tam tur atar."
                    },
                    {
                        category: "GÜNEŞ'İN YAPISI VE ÖZELLİKLERİ",
                        title: "Güneş Samanyolu Galaksisinde Hareketsiz midir?",
                        body: "Güneş sadece kendi etrafında mı döner, yoksa uzayda başka bir hareketi de var mıdır?",
                        options: [
                            { text: "Samanyolu Galaksisi'nin merkezi etrafında devasa bir yörüngede dolanır", correct: true },
                            { text: "Evrenin tam merkezinde tamamen hareketsiz çakılı durur", correct: false },
                            { text: "Dünya'nın etrafında dolanır", correct: false },
                            { text: "Sadece ileri-geri zıplama hareketi yapar", correct: false }
                        ],
                        explanation: "Mükemmel! Güneş Sistemi ile birlikte Samanyolu Galaksisi'nin merkezi etrafında saatte 828.000 km hızla dolanmaktadır."
                    }
                ]
            },
            {
                id: 6,
                station: 'sun',
                title: "Güneş Katmanları Tomografisi",
                shortDesc: "Güneş'in en içinden dışına doğru katmanlarını incele.",
                questionPool: [
                    {
                        category: "GÜNEŞ'İN YAPISI VE ÖZELLİKLERİ",
                        title: "Güneş'in Enerji Santrali Çekirdek",
                        body: "Güneş tıpkı Dünya gibi iç içe katmanlardan oluşur. En içte sıcaklığı yaklaşık 15 Milyon °C olan ve enerjinin üretildiği katman hangisidir?",
                        options: [
                            { text: "Çekirdek", correct: true },
                            { text: "Işık Küre (Fotosfer)", correct: false },
                            { text: "Renk Küre (Kromosfer)", correct: false },
                            { text: "Taç Küre (Korona)", correct: false }
                        ],
                        explanation: "Tebrikler! Güneş'in merkezinde 15 milyon °C sıcaklığa sahip Çekirdek yer alır. Hidrojen gazının helyuma dönüşmesiyle devasa enerji üretilir."
                    },
                    {
                        category: "GÜNEŞ'İN YAPISI VE ÖZELLİKLERİ",
                        title: "Güneş'in Gördüğümüz Parlak Yüzeyi",
                        body: "Dünya'dan baktığımızda Güneş'in sarı-parlak olarak gözümüzle seçtiğimiz yüzey katmanı hangisidir?",
                        options: [
                            { text: "Işık Küre (Fotosfer - yaklaşık 6.000 °C)", correct: true },
                            { text: "Çekirdek", correct: false },
                            { text: "Taç Küre (Korona)", correct: false },
                            { text: "Renk Küre (Kromosfer)", correct: false }
                        ],
                        explanation: "Doğru! Güneş'in çıplak gözle (filtre arkasından) gördüğümüz ışık saçan parlak yüzeyi Fotosfer (Işık Küre)'dir."
                    },
                    {
                        category: "GÜNEŞ'İN YAPISI VE ÖZELLİKLERİ",
                        title: "Güneş Tutulmasında Görülen Dış Katman",
                        body: "Tam Güneş tutulması anında Ay Güneş diskinin önünü kapattığında, Güneş'in çevresinde inci beyazı hale şeklinde parlayan en dış katman hangisidir?",
                        options: [
                            { text: "Taç Küre (Korona)", correct: true },
                            { text: "Çekirdek", correct: false },
                            { text: "Yer Kabuğu", correct: false },
                            { text: "Su Küre", correct: false }
                        ],
                        explanation: "Harika! Taç Küre (Korona), Güneş'in en dış gaz atmosferidir ve tam tutulma sırasında beyaz bir taç gibi gözlemlenebilir."
                    },
                    {
                        category: "GÜNEŞ'İN YAPISI VE ÖZELLİKLERİ",
                        title: "Güneş Katmanlarının Sıralaması",
                        body: "Güneş'in 4 temel katmanının İÇTEN DIŞA doğru doğru sıralanışı hangisidir?",
                        options: [
                            { text: "Çekirdek ➔ Işık Küre ➔ Renk Küre ➔ Taç Küre", correct: true },
                            { text: "Taç Küre ➔ Renk Küre ➔ Işık Küre ➔ Çekirdek", correct: false },
                            { text: "Işık Küre ➔ Çekirdek ➔ Taç Küre ➔ Renk Küre", correct: false },
                            { text: "Çekirdek ➔ Taç Küre ➔ Işık Küre ➔ Renk Küre", correct: false }
                        ],
                        explanation: "Kusursuz! MEB müfredatına göre içten dışa katmanlar: Çekirdek (merkez), Işık Küre (fotosfer), Renk Küre (kromosfer) ve Taç Küre (korona) dir."
                    }
                ]
            },
            {
                id: 7,
                station: 'orbit',
                title: "Yeni Ay ve İlk Dördün",
                shortDesc: "Ay'ı doğru konuma getirerek 'D' harfi şeklindeki evreyi oluştur.",
                questionPool: [
                    {
                        category: "AY'IN EVRELERİ VE HAREKETLERİ",
                        title: "İlk Dördün Evresinin Belirgin Özelliği",
                        body: "Yeni Ay evresinden yaklaşık 1 hafta sonra Ay'ın Dünya'dan bakıldığında sağ yarısının aydınlık ve 'D' harfi şeklinde göründüğü ana evre hangisidir?",
                        options: [
                            { text: "İlk Dördün", correct: true },
                            { text: "Son Dördün", correct: false },
                            { text: "Dolunay", correct: false },
                            { text: "Şişkin Ay", correct: false }
                        ],
                        explanation: "Kesinlikle doğru! İlk Dördün evresinde Ay'ın Dünya'ya bakan yüzünün sağ yarısı aydınlıktır ve düz 'D' harfine benzer."
                    },
                    {
                        category: "AY'IN EVRELERİ VE HAREKETLERİ",
                        title: "Yeni Ay Evresinde Ay Neden Görünmez?",
                        body: "Yeni Ay evresinde Ay'ın Dünya'dan bakıldığında gökyüzünde görünmemesinin temel nedeni nedir?",
                        options: [
                            { text: "Ay'ın aydınlık yüzünün Güneş'e, karanlık yüzünün Dünya'ya bakması", correct: true },
                            { text: "Ay'ın Güneş'in arkasına saklanması", correct: false },
                            { text: "Ay'ın kendi ışığını kapatması", correct: false },
                            { text: "Dünya'nın gölgesinin Ay'ın üstüne düşmesi", correct: false }
                        ],
                        explanation: "Harika! Ay Güneş ile Dünya arasına girdiğinde bize bakan tarafı ışık almaz ve karanlık kalır."
                    },
                    {
                        category: "AY'IN EVRELERİ VE HAREKETLERİ",
                        title: "Ters 'C' Harfi: Hilal Evresi",
                        body: "Yeni Ay evresinden hemen sonra Ay'ın Güneş'in doğusunda ince bir yay şeklinde görüldüğü ara evre hangisidir?",
                        options: [
                            { text: "Hilal", correct: true },
                            { text: "Şişkin Ay", correct: false },
                            { text: "Dolunay", correct: false },
                            { text: "İlk Dördün", correct: false }
                        ],
                        explanation: "Tebrikler! Hilal, Yeni Ay ile İlk Dördün arasında ve Son Dördün ile Yeni Ay arasında görülen bir ara evredir."
                    },
                    {
                        category: "AY'IN EVRELERİ VE HAREKETLERİ",
                        title: "Son Dördün Evresi ve 'Ters D'",
                        body: "Dolunaydan yaklaşık bir hafta sonra Ay'ın Dünya'dan bakıldığında sol yarısının aydınlandığı ve 'Ters D' şeklinde göründüğü ana evre hangisidir?",
                        options: [
                            { text: "Son Dördün", correct: true },
                            { text: "İlk Dördün", correct: false },
                            { text: "Yeni Ay", correct: false },
                            { text: "Hilal", correct: false }
                        ],
                        explanation: "Harika! Son Dördün evresinde Ay'ın sol yarısı aydınlıktır ve gökyüzünde 'ters D' harfi gibi görünür."
                    }
                ]
            },
            {
                id: 8,
                station: 'orbit',
                title: "Neden Hep Aynı Yüzü Görürüz?",
                shortDesc: "Dönme ve dolanma süresi eşitliğini keşfet.",
                questionPool: [
                    {
                        category: "AY'IN HAREKETLERİ",
                        title: "Ay'ın Görünmeyen Gizemli Yüzü",
                        body: "Dünya'dan gökyüzüne baktığımızda Ay'ın hep aynı yüzünü görürüz, arka yüzünü asla göremeyiz. Bunun temel sebebi nedir?",
                        options: [
                            { text: "Ay'ın kendi ekseni etrafında dönme süresi ile Dünya etrafında dolanma süresinin eşit olması (27.3 gün)", correct: true },
                            { text: "Ay'ın arka yüzünün karanlık olması ve hiç ışık almaması", correct: false },
                            { text: "Dünya'nın Ay'dan çok daha hızlı dönmesi", correct: false },
                            { text: "Ay'ın sadece gece gökyüzünde bulunması", correct: false }
                        ],
                        explanation: "Bravo! Ay kendi etrafında 1 tam dönüşünü yaklaşık 27.3 günde tamamlar. Dünya etrafında da tam 27.3 günde dolanır. Süreler eşit olduğu için Dünya'dan hep aynı yüzü görülür."
                    },
                    {
                        category: "AY'IN HAREKETLERİ",
                        title: "Eşzamanlı Dönme Hareketi",
                        body: "Bir arkadaşınızın etrafında sürekli yüzünüz ona dönük olarak dolanırsanız kendi ekseniniz etrafında dönmüş olur musunuz?",
                        options: [
                            { text: "Evet, 1 tur dolandığınızda kendi etrafınızda da tam 1 tur dönmüş olursunuz", correct: true },
                            { text: "Hayır, hiç dönmemiş olursunuz", correct: false },
                            { text: "Sadece arkadaşınız dönmüş olur", correct: false },
                            { text: "Kendi etrafınızda 365 tur dönmüş olursunuz", correct: false }
                        ],
                        explanation: "Doğru! Tıpkı Ay gibi, arkadaşınızın çevresinde yüzünüz ona dönük bir tur attığınızda kendi ekseninizde de 1 tam tur atmış olursunuz."
                    },
                    {
                        category: "AY'IN HAREKETLERİ",
                        title: "Ay'ın Hareket Sayısı",
                        body: "Ay uzayda kaç çeşit temel hareket gerçekleştirir?",
                        options: [
                            { text: "3 çeşit: Kendi etrafında dönme, Dünya etrafında dolanma ve Dünya ile birlikte Güneş etrafında dolanma", correct: true },
                            { text: "Yalnızca 1 çeşit: Sadece Dünya etrafında döner", correct: false },
                            { text: "Yalnızca 2 çeşit: Kendi etrafında ve Mars etrafında", correct: false },
                            { text: "Hiçbiri, Ay uzayda tamamen sabittir", correct: false }
                        ],
                        explanation: "Süper! Ay; 1) Kendi ekseni etrafında döner, 2) Dünya etrafında dolanır, 3) Dünya ile el ele tutuşarak Güneş etrafında dolanır."
                    },
                    {
                        category: "AY'IN HAREKETLERİ",
                        title: "Dönme ve Dolanma Yönü",
                        body: "Ay'ın hem kendi ekseni etrafındaki dönme yönü hem de Dünya etrafındaki dolanma yönü nasıldır?",
                        options: [
                            { text: "Saat yönünün tersine (Batıdan Doğuya)", correct: true },
                            { text: "Saat yönünde (Doğudan Batıya)", correct: false },
                            { text: "Yukarıdan aşağıya doğru", correct: false },
                            { text: "Rastgele sürekli yön değiştirir", correct: false }
                        ],
                        explanation: "Kusursuz! Güneş, Dünya ve Ay'ın dönme hareketleri genel olarak saat yönünün tersine (Batıdan Doğuya) gerçekleşir."
                    }
                ]
            },
            {
                id: 9,
                station: 'orbit',
                title: "Evrelerin Periyodu",
                shortDesc: "Ay'ın tüm evrelerini tamamlaması kaç gün sürer?",
                questionPool: [
                    {
                        category: "AY'IN EVRELERİ VE HAREKETLERİ",
                        title: "Ay Takvimi ve Evre Döngüsü",
                        body: "Bir Yeni Ay evresinden bir sonraki Yeni Ay evresine kadar geçen ve Ay'ın tüm ana ve ara evrelerini tamamladığı süre yaklaşık kaç gündür?",
                        options: [
                            { text: "Yaklaşık 29.5 gün (1 Ay)", correct: true },
                            { text: "Tam 365 gün 6 saat", correct: false },
                            { text: "Tam 7 gün", correct: false },
                            { text: "24 saat", correct: false }
                        ],
                        explanation: "Doğru! Ay'ın evrelerinin baştan sona tamamlanması yaklaşık 29.5 gün (1 ay) sürer. İki ana evre arasında ise yaklaşık 1 hafta (7 gün) süre vardır."
                    },
                    {
                        category: "AY'IN EVRELERİ VE HAREKETLERİ",
                        title: "Ana Evreler Arasındaki Süre",
                        body: "Yeni Ay evresinden Dolunay evresine kadar geçen süre yaklaşık ne kadardır?",
                        options: [
                            { text: "Yaklaşık 2 hafta (14-15 gün)", correct: true },
                            { text: "Yaklaşık 1 gün (24 saat)", correct: false },
                            { text: "Tam 1 yıl (365 gün)", correct: false },
                            { text: "Yaklaşık 1 ay (30 gün)", correct: false }
                        ],
                        explanation: "Tebrikler! Yeni Ay ➔ İlk Dördün (1 hafta) ➔ Dolunay (1 hafta). Toplam yaklaşık 2 haftadır."
                    },
                    {
                        category: "AY'IN EVRELERİ VE HAREKETLERİ",
                        title: "Ana Evrelerin Sayısı ve İsimleri",
                        body: "Ay'ın kaç tane ANA evresi vardır ve hangi sırayla gerçekleşir?",
                        options: [
                            { text: "4 ana evre: Yeni Ay ➔ İlk Dördün ➔ Dolunay ➔ Son Dördün", correct: true },
                            { text: "2 ana evre: Hilal ve Şişkin Ay", correct: false },
                            { text: "8 ana evre: Hepsi ana evredir", correct: false },
                            { text: "12 ana evre: Her aya bir tane düşer", correct: false }
                        ],
                        explanation: "Doğru! Ay'ın 4 ana evresi (Yeni Ay, İlk Dördün, Dolunay, Son Dördün) ve 4 ara evresi (Hilal ve Şişkin Ay'ın varyasyonları) vardır."
                    },
                    {
                        category: "AY'IN EVRELERİ VE HAREKETLERİ",
                        title: "Dolunay Evresi ve Gökyüzü",
                        body: "Ay'ın Dünya'ya bakan yüzünün tamamen aydınlık ve dairesel olarak pırıl pırıl parladığı evre hangisidir?",
                        options: [
                            { text: "Dolunay", correct: true },
                            { text: "Yeni Ay", correct: false },
                            { text: "İlk Dördün", correct: false },
                            { text: "Son Dördün", correct: false }
                        ],
                        explanation: "Harika! Dünya Güneş ile Ay arasındayken Ay'ın bize bakan yüzü Güneş ışığını tam olarak alır ve Dolunay evresi oluşur."
                    }
                ]
            },
            {
                id: 10,
                station: 'scale',
                title: "Kozmik Boyut ve Ölçek",
                shortDesc: "Güneş, Dünya ve Ay'ın büyüklük oranlarını doğrula.",
                questionPool: [
                    {
                        category: "KOZMİK BOYUT VE ÖLÇEKLENDİRME",
                        title: "Top, Nohut ve Mercimek Modeli",
                        body: "Fen Bilimleri dersinde Güneş, Dünya ve Ay'ın büyüklüklerini modellemek isteyen bir öğrenci sırasıyla hangi nesneleri seçmelidir?",
                        options: [
                            { text: "Güneş: Basketbol Topu, Dünya: Nohut, Ay: Mercimek", correct: true },
                            { text: "Güneş: Nohut, Dünya: Basketbol Topu, Ay: Mercimek", correct: false },
                            { text: "Güneş: Mercimek, Dünya: Nohut, Ay: Basketbol Topu", correct: false },
                            { text: "Üçü için de aynı boyutta tenis topları", correct: false }
                        ],
                        explanation: "Şampiyon! Güneş sistemimizdeki en büyük cisimdir (Dünya'dan 109 kat büyük çap, içine 1.3 milyon Dünya sığar). Dünya Ay'dan büyüktür (içine 64 Ay sığar). Sıralama: Güneş > Dünya > Ay!"
                    },
                    {
                        category: "KOZMİK BOYUT VE ÖLÇEKLENDİRME",
                        title: "Güneş ile Ay Gökyüzünde Neden Aynı Boyutta Görünür?",
                        body: "Güneş Ay'dan yaklaşık 400 kat daha büyük olmasına rağmen gökyüzünde yaklaşık aynı boyutta görünmelerinin nedeni nedir?",
                        options: [
                            { text: "Ay'ın Dünya'ya Güneş'ten çok daha yakın olması (Perspektif etkisi)", correct: true },
                            { text: "Güneş'in gündüzleri küçülmesi", correct: false },
                            { text: "Ay'ın geceleri genişlemesi", correct: false },
                            { text: "Gözlerimizin optik olarak bozuk olması", correct: false }
                        ],
                        explanation: "Harika! Cisimler uzaklaştıkça görünür boyutları küçülür. Güneş 400 kat büyüktür ama Dünya'ya 400 kat daha uzaktadır; bu yüzden gökyüzünde eşit büyüklükte görünürler."
                    },
                    {
                        category: "KOZMİK BOYUT VE ÖLÇEKLENDİRME",
                        title: "Dünya'nın İçine Kaç Tane Ay Sığabilir?",
                        body: "Dünya ve Ay'ın hacimsel büyüklükleri karşılaştırıldığında, Dünya'nın içine yaklaşık kaç tane Ay sığabilir?",
                        options: [
                            { text: "Yaklaşık 64 tane", correct: true },
                            { text: "Sadece 1 tane", correct: false },
                            { text: "1.300.000 tane", correct: false },
                            { text: "Tam 4 tane", correct: false }
                        ],
                        explanation: "Bravo! Ay'ın çapı Dünya'nın yaklaşık 1/4'üdür. Hacim formülünden hesaplandığında Dünya'nın içine yaklaşık 64 tane Ay sığabilir."
                    },
                    {
                        category: "KOZMİK BOYUT VE ÖLÇEKLENDİRME",
                        title: "Güneş'in İçine Kaç Tane Dünya Sığabilir?",
                        body: "Güneş devasa bir gaz devidir. Güneş'in içine yaklaşık kaç tane Dünya sığdırılabilir?",
                        options: [
                            { text: "Yaklaşık 1 milyon 300 bin (1.300.000) Dünya", correct: true },
                            { text: "109 Dünya", correct: false },
                            { text: "64 Dünya", correct: false },
                            { text: "100 Dünya", correct: false }
                        ],
                        explanation: "İnanılmaz bir kozmik büyüklük! Güneş'in çapı Dünya'nın 109 katıdır ve içine yaklaşık 1 milyon 300 bin adet Dünya sığabilir."
                    }
                ]
            }];