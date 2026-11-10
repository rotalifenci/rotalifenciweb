// MİRAS-3B: Osmanlı Eserleri Veri Tabanı — Bölüm 2 (Anadolu ve Rumeli Seçkisi)
// TÜBİTAK 2204-B Tarih Projesi — Karşılaştırmalı Tarih ve Kanıt Temelli Öğrenme Veri Katmanı

(function () {
  const MORE_MONUMENTS = [
    {
      id: "edirne-bayezid-darussifasi",
      eserAdi: "Edirne II. Bayezid Külliyesi Darüşşifası ve Tıp Medresesi",
      il: "Edirne",
      ilId: "edirne",
      plaka: "22",
      bolge: "Marmara",
      ilce: "Merkez",
      eserTuru: "Medrese",
      donem: "Erken Osmanlı (1299–1453)",
      yapimYili: "1484–1488 (II. Bayezid Dönemi)",
      mimar: "Mimar Hayreddin",
      kullanimDurumu: "Müze (Sağlık Müzesi - Avrupa Konseyi Ödüllü)",
      konum: "Yeniimaret Mahallesi, Tunca Nehri Kıyısı / Edirne (41.6860° K, 26.5432° D)",
      kisaAciklama: "Tunca Nehri kıyısında 1488'de tamamlanan; su sesi, musiki, güzel kokular ve merkezi kubbeli şifahane mimarisiyle akıl ve beden hastalarının ücretsiz tedavi edildiği tıp merkezi ve medresesidir.",
      ayrintiliAciklama: "Sultan II. Bayezid tarafından Mimar Hayreddin'e 1484-1488 yılları arasında Tunca Nehri kıyısında inşa ettirilen külliye; cami, tıp medresesi (Medresetü'l-Etıbba), darüşşifa (hastane), imaret, hamam ve köprüden oluşur. Özellikle altıgen şemalı merkezi kubbeli darüşşifa bölümü, akustik yapısı, ortasındaki şadırvanı ve musiki sahnesiyle 15. yüzyılda ruh ve sinir hastalıklarının su sesi ve Türk musikisi makamlarıyla tedavi edildiği öncü bir tıp kurumudur.",
      modelTipi: "medrese",
      modelConfig: {
        baseColor: "#ded3be",
        domeColor: "#576570",
        hasHexagonHospital: true,
        courtyardArches: 6
      },
      kitabeBilgisi: {
        yeri: "Cami ve Darüşşifa taçkapısı üzerindeki mermer sülüs kitabe (Şeyh Hamdullah hattı)",
        metinOzeti: "Hicri 889'da (1484) temeli atılıp Hicri 893'te (1488) Sultan II. Bayezid Han tarafından tamamlandığı kayıtlıdır; yazı hattat Şeyh Hamdullah'a aittir.",
        tarihselKanitDegeri: "Vakfiye kayıtlarında hekimbaşı, cerrah, kehhal (göz doktoru), eczacı ve haftada üç gün musiki faslı icra eden 10 kişilik hanende-sazende kadrosunun maaş listesi yer alır."
      },
      planBilgisi: {
        semaTipi: "Avlulu Tıp Medresesi ve Altıgen Merkezi Kubbeli Darüşşifa Planı",
        mekansalDuzen: "18 öğrenci odalı ve kubbeli dershaneli Tıp Medresesi; yanında iki ön avlu ve en arkada ortası şadırvanlı, yüksek kubbeli ve fenerli altıgen Darüşşifa (şifahane) bloğu.",
        planAciklamasi: "Altıgen merkezi şifahane planı, hem tek bir noktadan tüm hasta odalarının gözetlenmesini (modern hemşire istasyonu mantığı) hem de musiki ve su sesinin tüm odalara eşit dağılmasını sağlamıştır."
      },
      kullanimAmaci: {
        ilkIslev: "Tıp doktoru yetiştiren uygulamalı üniversite (Tıp Medresesi) ve her din/milletten hastanın ücretsiz tedavi edildiği tam teşekküllü hastane (Darüşşifa).",
        kullaniciKitlesi: "Müderris hekimler, tıp öğrencileri, hastalar, cerrahlar, göz hekimleri (kehhaller) ve musikişinaslar."
      },
      bugunkuIslev: {
        guncelKullanim: "Trakya Üniversitesi Sultan II. Bayezid Külliyesi Sağlık Müzesi (2004 Avrupa Konseyi Müze Ödülü sahibi).",
        degisimVeSureklilik: "Klinik tedavi işlevi modern hastanelere geçmiş; ancak tıp tarihi eğitimi ve kültür mirası işlevi cansız mankenli canlandırmalarla yaşayan bir müze olarak sürmektedir."
      },
      malzemeBilgisi: {
        anaMalzemeler: "Kesme küfeki taşı, tuğla kubbe ve bacalar, kurşun üst örtü, mermer şadırvan ve sütunlar.",
        yapimTeknigi: "Kesme taş duvar işçiliği, merkezi kubbe tepesinde kirli havayı tahliye eden ve ışık sağlayan 'aydınlık feneri' sistemi."
      },
      mimariOzellikler: [
        "Altıgen merkezi planlı ve aydınlık fenerli Darüşşifa kubbesi",
        "Merkezde su sesi terapisi sağlayan mermer şadırvan ve musiki sahnesi",
        "18 kubbeli hücreden oluşan revaklı Tıp Medresesi avlusu",
        "Tunca Nehri taşkınlarına karşı kemerli köprü ve yükseltilmiş subasman",
        "Her hasta odasında bağımsız ocak ve havalandırma bacası"
      ],
      korunmaDurumu: {
        durum: "Çok İyi Korunmuş (UNESCO Dünya Mirası Geçici Listesi & Avrupa Konseyi Müze Ödüllü)",
        restorasyonBilgisi: "Trakya Üniversitesi ve Vakıflar Genel Müdürlüğü iş birliğiyle restore edilerek 1997'de Sağlık Müzesi'ne dönüştürülmüş, 2004'te Avrupa Konseyi Müze Ödülü'nü kazanmıştır."
      },
      tarihselBaglam: {
        donemOzelligi: "Avrupa'da akıl hastalarının toplum dışına itildiği 15. yüzyıl sonunda, Osmanlı'da bilimsel tıp, müzikterapi ve insani bakımın kurumsallaştığı dönem.",
        sosyoKulturelRol: "Tıp teorisi (medrese) ile klinik uygulamayı (darüşşifa) yan yana konumlandıran modern tıp fakültesi modelinin 15. yüzyıldaki öncüsüdür."
      },
      hotspots: [
        {
          id: "kitabe",
          kategori: "Kitabe",
          baslik: "1. Şeyh Hamdullah Hatlı Kitabe ve 1488 Vakfiyesi",
          pos: [0, 2.0, 4.1],
          kisaBilgi: "Taçkapıdaki kitabe 1488 tarihini verirken, vakfiye belgesi hastanede çalışan hekim, cerrah ve müzisyenlerin görev tanımlarını ayrıntılarıyla kaydeder.",
          tarihselKanitIpucu: "Vakfiyede 10 kişilik musiki topluluğuna maaş bağlandığının yazması, müzikle tedavinin resmi bir tıp uygulaması olduğunun yazılı kanıtıdır.",
          sesliMetin: "Külliye kitabesi Türk hat sanatının piri Şeyh Hamdullah tarafından yazılmıştır. Külliyenin vakfiyesinde hekim ve cerrahların yanı sıra hastalara haftada üç gün konser verecek on kişilik sazende ve hanende kadrosu açıkça kayıtlıdır."
        },
        {
          id: "plan",
          kategori: "Plan",
          baslik: "2. Altıgen Merkezi Şifahane Planı (Akustik ve Gözetim)",
          pos: [0, 3.2, -1.8],
          kisaBilgi: "Altıgen planlı merkezi kubbe etrafında sıralanan kışlık ve yazlık hasta odaları, hem tek merkezden gözetim hem de mükemmel ses dağılımı sağlar.",
          tarihselKanitIpucu: "Hasta odalarının merkeze bakacak şekilde altıgen dizilmesi, musiki sesinin her odaya eşit ulaşması için tasarlandığının mimari kanıtıdır.",
          sesliMetin: "Darüşşifanın altıgen merkezi planı, dönemi için olağanüstü bir mimari yeniliktir. Ortadaki sahnede icra edilen musiki ve şadırvandan gelen su sesi, kubbe akustik yapısı sayesinde tüm hasta odalarına eşit biçimde yayılır."
        },
        {
          id: "kullanim",
          kategori: "Kullanım Amacı",
          baslik: "3. Tıp Medresesi ve Darüşşifa: Teorik ve Uygulamalı Eğitim",
          pos: [-3.2, 1.4, 1.2],
          kisaBilgi: "Sol taraftaki Tıp Medresesi'nde İbn-i Sina ve Hipokrat eserlerini okuyan öğrenciler, hemen yan binadaki Darüşşifa'da usta hekimlerle hasta başı pratiği yapardı.",
          tarihselKanitIpucu: "Medrese ile hastanenin bitişik inşa edilmesi, Osmanlı tıp eğitiminde usta-çırak ve klinik uygulamanın esas alındığını kanıtlar.",
          sesliMetin: "Tıp Medresesi ile Darüşşifanın yan yana olması tesadüf değildir. Tıp öğrencileri sabah dershanede teorik ders alır, öğleden sonra ise darüşşifada hekimbaşı eşliğinde hasta muayenesine katılırdı."
        },
        {
          id: "bugunku",
          kategori: "Bugünkü İşlev",
          baslik: "4. Ödüllü Sağlık Müzesi ve Okul Dışı Öğrenme Ortamı",
          pos: [3.2, 1.4, 1.2],
          kisaBilgi: "Günümüzde Trakya Üniversitesi Sağlık Müzesi olarak hizmet vermekte ve öğrencilere Osmanlı tıp tarihini yerinde deneyimleme imkânı sunmaktadır.",
          tarihselKanitIpucu: "Yapının bugün Sağlık Müzesi olarak işlev görmesi, mekanın tıp ve eğitim kimliğinin korunduğunu gösterir.",
          sesliMetin: "2004 yılında Avrupa Konseyi Müze Ödülü'ne layık görülen yapı, bugün öğrencilerin tıp tarihini ve kültürel mirası yerinde incelediği örnek bir okul dışı öğrenme ortamıdır."
        },
        {
          id: "malzeme",
          kategori: "Malzeme ve Yapı Tekniği",
          baslik: "5. Kesme Küfeki Taşı ve Aydınlık Feneri",
          pos: [0, 4.2, -1.8],
          kisaBilgi: "Merkezi kubbenin tepesindeki 'aydınlık feneri', hastanedeki ağır havayı dışarı atarken doğal gün ışığını içeri alır.",
          tarihselKanitIpucu: "Kubbe tepesindeki aydınlık feneri, 15. yüzyıl hastane mimarisinde hijyen ve havalandırma bilincinin kanıtıdır.",
          sesliMetin: "Büyük kubbenin tam tepesinde gördüğünüz aydınlık feneri, hem şifahanenin doğal ışıkla aydınlanmasını hem de içerideki havanın sürekli temizlenmesini sağlayan ekolojik bir mimari çözümdür."
        },
        {
          id: "mimari",
          kategori: "Mimari Özellikler",
          baslik: "6. Şadırvan, Musiki Sahnesi ve Yüksek Bacalar",
          pos: [1.8, 2.5, -0.5],
          kisaBilgi: "Şifahanenin merkezindeki mermer şadırvan, yüksek ilaç mutfağı (şırahane) bacaları ve revaklı medrese avlusu yapının silüetini belirler.",
          tarihselKanitIpucu: "İlaç hazırlanan mutfak ve şırahane bölümlerinin yüksek bacaları, hastane içinde eczacılık üretimi yapıldığının kanıtıdır.",
          sesliMetin: "Avlunun çevresinde yükselen uzun konik bacalar, hasta odalarındaki ocaklara ve şifalı macunların kaynatıldığı ilaç mutfağına aittir."
        },
        {
          id: "korunma",
          kategori: "Korunma Durumu",
          baslik: "7. Tunca Nehri Köprüsü ve Külliye Korunumu",
          pos: [-2.5, 0.8, 3.2],
          kisaBilgi: "Tunca Nehri üzerindeki kemerli taş köprü külliyeyi şehre bağlar; külliye binaları özgün taş ve tuğla dokusuyla günümüze ulaşmıştır.",
          tarihselKanitIpucu: "Nehir kıyısı seçimi, hastaların doğa ve su sesiyle iç içe iyileşmesi için bilinçli yer seçimi yapıldığını kanıtlar.",
          sesliMetin: "Külliyenin şehir gürültüsünden uzakta, Tunca Nehri'nin sakin kıyısında kurulması, hastaların ruhsal dinginliği için doğayla bütünleşik bir çevre seçildiğini kanıtlar."
        },
        {
          id: "baglam",
          kategori: "Tarihsel Bağlam",
          baslik: "8. Evliya Çelebi Seyahatnamesi'nde Darüşşifa",
          pos: [2.5, 0.8, -3.0],
          kisaBilgi: "Evliya Çelebi 17. yüzyılda burayı ziyaret etmiş; neva, rast, dügâh makamlarıyla ve gül, karanfil, yasemin kokularıyla hastaların nasıl iyileştirildiğini kaydetmiştir.",
          tarihselKanitIpucu: "Evliya Çelebi Seyahatnamesi, darüşşifadaki müzik ve koku terapisini doğrulayan en önemli anlatısal tarihsel kanıttır.",
          sesliMetin: "17. yüzyıl seyyahı Evliya Çelebi, Seyahatname'sinde bu darüşşifayı ayrıntılarıyla anlatmış; bahar aylarında hastalara gül, sümbül ve karanfil koklatılarak ve çeşitli Türk müziği makamları dinletilerek şifa verildiğini yazmıştır."
        }
      ],
      karsilastirilabilirEserler: ["istanbul-suleymaniye-camii", "edirne-selimiye-camii", "amasya-bayezid-kulliyesi"],
      kanitTemelliSorular: [
        {
          id: "ebd-q1",
          tip: "gorsel_kanit",
          zorluk: "Orta",
          ilgiliAlan: "Plan ve Kullanım Amacı",
          kanitMetni: "KANIT 1 (Mimari ve Yazılı Kanıt): Edirne II. Bayezid Darüşşifası'nda hasta odaları altıgen bir merkezi kubbenin etrafına dizilmiştir. Merkezde bir su şadırvanı ve musiki sahnesi vardır. Ayrıca hemen bitişiğinde 18 odalı Tıp Medresesi yer almaktadır.",
          soru: "Bu mimari düzenleme aşağıdaki tarihsel çıkarımlardan hangisini doğrudan kanıtlar?",
          secenekler: [
            "Osmanlı'da teorik tıp eğitimi ile klinik hastane uygulamasının bütünleştirildiğini ve mimarinin su/müzik terapisine uygun tasarlandığını",
            "Darüşşifanın yalnızca askeri mühimmat deposu olarak kullanıldığını",
            "Tıp öğrencilerinin hastaları görmesinin kesinlikle yasak olduğunu",
            "Yapının 19. yüzyılda Batılı mimarlar tarafından betonarme olarak inşa edildiğini"
          ],
          dogruIndeks: 0,
          ipucu: "'2. Altıgen Merkezi Şifahane Planı' ve '3. Tıp Medresesi ve Darüşşifa' noktalarını inceleyin.",
          aciklama: "Harika! Hem altıgen merkezi planın akustik/gözetim işlevi hem de Tıp Medresesi'nin hemen bitişikte yer alması, bütüncül ve uygulamalı tıp anlayışını kanıtlar.",
          kanitDosyasiBasligi: "Tıp Tarihi Kanıtı: Uygulamalı Eğitim ve Müzikterapi Mimarisi"
        },
        {
          id: "ebd-q2",
          tip: "coktan_secmeli",
          zorluk: "Orta",
          ilgiliAlan: "Tarihsel Bağlam (Değişim ve Karşılaştırma)",
          kanitMetni: "KANIT 2 (Evliya Çelebi Seyahatnamesi): 'Merhum ve mağfur Bayezid-i Veli Hazretleri vakfiyesinde hastalara deva, dertlilere şifa, divanelerin ruhuna gıda ve def'i sevda olmak üzere on adet hanende ve sazende tayin etmiştir.'",
          soru: "Evliya Çelebi'nin aktardığı bu bilgi, 15. yüzyıl Osmanlı toplumunun ruh ve akıl sağlığına yaklaşımı hakkında neyi göstermektedir?",
          secenekler: [
            "Ruhsal hastalıkların tedavi edilebilir bir sağlık sorunu olarak görüldüğünü ve estetik/insani yöntemler kullanıldığını",
            "Hastaların tedavi edilmek yerine şehir dışına sürgün edildiğini",
            "Darüşşifada ilaç ve hekim yerine yalnızca müzik kullanıldığını",
            "Vakıf hastanelerinin yalnızca ücret ödeyebilen zenginlere hizmet verdiğini"
          ],
          dogruIndeks: 0,
          ipucu: "'1. Vakfiye' ve '8. Evliya Çelebi Seyahatnamesi' bilgi noktalarına göz atın.",
          aciklama: "Doğru! Vakfiye ve Seyahatname kayıtları, hekim ve ilaç tedavisinin yanında musiki ve su sesiyle psikolojik destek sağlandığını kanıtlar.",
          kanitDosyasiBasligi: "İnsani Tıp Kanıtı: Vakfiye ve Seyahatname Kayıtları"
        }
      ],
      kaynakca: [
        "Kültür Portalı, 'II. Bayezid Külliyesi Sağlık Müzesi - Edirne', T.C. Kültür ve Turizm Bakanlığı.",
        "Sengir, Enver (2004). Trakya Üniversitesi Sultan II. Bayezid Külliyesi Sağlık Müzesi, Edirne.",
        "Evliya Çelebi, Seyahatnâme, Cilt 3 (Edirne Bölümü)."
      ],
      ogretmenNotlari: {
        kazanimlar: [
          "Osmanlı bilim ve sağlık kurumlarının (darüşşifa ve tıp medresesi) işleyişini birincil kaynaklar (vakfiye, seyahatname) üzerinden değerlendirir."
        ],
        etkinlikOnerisi: "Öğrencilerden aynı padişahın (II. Bayezid) Edirne'de yaptırdığı Darüşşifa ile Bursa'da bu vakıflara gelir sağlamak için yaptırdığı Koza Han arasındaki ilişkileri karşılaştırmalarını isteyin."
      }
    },
    {
      id: "istanbul-suleymaniye-camii",
      eserAdi: "İstanbul Süleymaniye Camii ve Külliyesi",
      il: "İstanbul",
      ilId: "istanbul",
      plaka: "34",
      bolge: "Marmara",
      ilce: "Fatih",
      eserTuru: "Cami",
      donem: "Klasik Dönem (1453–1600)",
      yapimYili: "1550–1557 (Kanuni Sultan Süleyman Dönemi)",
      mimar: "Mimar Sinan",
      kullanimDurumu: "Aktif İbadethane ve Kültür Alanı (UNESCO Dünya Mirası)",
      konum: "Süleymaniye Mahallesi, Fatih / İstanbul (41.0161° K, 28.9642° D)",
      kisaAciklama: "Kanuni Sultan Süleyman adına Mimar Sinan tarafından İstanbul'un üçüncü tepesinde 1550–1557 yıllarında inşa edilen; cami, dört medrese, tıp medresesi, darüşşifa ve imaretiyle Klasik Osmanlı şehirciliğinin zirvesi olan külliyedir.",
      ayrintiliAciklama: "Mimar Sinan'ın 'kalfalık eserim' olarak nitelendirdiği Süleymaniye Camii ve Külliyesi, Haliç'e hâkim üçüncü tepe üzerinde 1550-1557 yılları arasında inşa edilmiştir. Dört dev fil ayağı üzerine oturan 26,5 metre çapında ve 53 metre yüksekliğindeki ana kubbesi, kıble eksenindeki iki yarım kubbeyle desteklenir. Dört minaresi Kanuni'nin İstanbul'un fethinden sonraki dördüncü padişah oluşunu, toplam 10 şerefesi ise Osmanlı'nın onuncu padişahı oluşunu simgeler. İs odası sistemi, 255 akustik küpü ve Sahn-ı Süleymaniye medreseleriyle bilim ve mühendislik anıtıdır.",
      modelTipi: "cami",
      modelConfig: {
        baseColor: "#d8d2c5",
        domeColor: "#4f5b66",
        minaretCount: 4,
        centralDomeRadius: 2.3,
        baldachin: "tetragonal"
      },
      kitabeBilgisi: {
        yeri: "Cümle kapısı üzerindeki üç parçalı mermer kitabe (Şeyhülislam Ebussuud Efendi metni, Hattat Hasan Çelebi yazısı)",
        metinOzeti: "Kanuni Sultan Süleyman'ın adalet ve kanun koyucu vasıfları övülmekte, yapının Hicri 957'de (1550) başlayıp Hicri 964 (Miladi 1557) yılında tamamlandığı kaydedilmektedir.",
        tarihselKanitDegeri: "Ebussuud Efendi tarafından kaleme alınan kitabe ve inşaat defterleri (Süleymaniye İnşaat Defterleri), imparatorluğun dört bir yanından malzeme ve usta getirildiğini belgeleyen arşiv kanıtlarıdır."
      },
      planBilgisi: {
        semaTipi: "Dört Fil Ayağına Oturan, İki Yarım Kubbeyle Destekli Merkezi Kubbeli Plan",
        mekansalDuzen: "Önde 28 kubbeli revaklı ve dört minareli iç avlu; harimde 4 dev fil ayağı üzerinde 26,5 m çaplı ana kubbe, mihrap-giriş aksında iki yarım kubbe; çevrede Evvel, Sani, Salis, Rabi medreseleri, Tıp Medresesi, Darüşşifa, Darüzziyafe, Tabhane ve Türbeler.",
        planAciklamasi: "Ayasofya ve II. Bayezid Camii'nde kullanılan 'iki yarım kubbeli merkezi plan' şemasının Mimar Sinan tarafından statik ve estetik açıdan mükemmelleştirilmiş halidir."
      },
      kullanimAmaci: {
        ilkIslev: "İmparatorluğun en büyük selatin külliyesi: ibadet, yükseköğretim (matematik, astronomi, tıp, hukuk), hastane, kütüphane ve sosyal yardımlaşma merkezi.",
        kullaniciKitlesi: "Padişah ve devlet erkânı, İstanbul halkı, müderrisler, tıp ve fen bilimleri öğrencileri, seyyahlar ve yoksullar."
      },
      bugunkuIslev: {
        guncelKullanim: "Cami ibadete açık; külliye birimleri Süleymaniye Yazma Eser Kütüphanesi ve eğitim/kültür birimleri olarak işlev görmektedir.",
        degisimVeSureklilik: "İbadet ve kütüphane/araştırma işlevi 470 yıldır kesintisiz devam etmektedir."
      },
      malzemeBilgisi: {
        anaMalzemeler: "Bakırköy küfeki taşı, Marmara mermeri, Mısır İskenderiye ve Lübnan Baalbek'ten getirilen granit sütunlar, somaki, İznik çinileri, devekuşu yumurtaları.",
        yapimTeknigi: "Kademeli teras istinat duvarları, kurşun kenetli kesme taş örgü, hava akımıyla çalışan 'İs Odası' mürekkep üretim sistemi."
      },
      mimariOzellikler: [
        "53 m yüksekliğinde, iki yarım kubbeyle desteklenen merkezi kubbe",
        "4 minare ve 10 şerefe (4. ve 10. padişah sembolizmi)",
        "Kandil isini toplayıp hat mürekkebine dönüştüren 'İs Odası' mühendisliği",
        "Sarhoş İbrahim Usta'nın 130 renkli vitray (revzen) pencereleri",
        "Haliç yamacına oturan teraslı külliye yerleşimi (Evvel, Sani, Salis, Rabi medreseleri)"
      ],
      korunmaDurumu: {
        durum: "Çok İyi Korunmuş (UNESCO Dünya Mirası - 1985)",
        restorasyonBilgisi: "1660 yangını, 1766 ve 1894 depremlerini kubbesi yıkılmadan atlatmış; 2007-2010 yıllarında kapsamlı restorasyondan geçmiştir."
      },
      tarihselBaglam: {
        donemOzelligi: "16. yüzyıl ortası, Osmanlı İmparatorluğu'nun üç kıtada en geniş sınırlarına ve en güçlü ekonomik-bilimsel organizasyonuna ulaştığı çağ.",
        sosyoKulturelRol: "İstanbul'un kentsel silüetini taçlandıran, fen ve tıp bilimlerini medrese müfredatının merkezine yerleştiren anıtsal bilim ve inanç külliyesidir."
      },
      hotspots: [
        {
          id: "kitabe",
          kategori: "Kitabe",
          baslik: "1. Ebussuud Efendi Kitabesi ve İnşaat Defterleri (1557)",
          pos: [0, 2.2, 4.2],
          kisaBilgi: "Cümle kapısı kitabesi Şeyhülislam Ebussuud Efendi tarafından yazılmış, Hattat Hasan Çelebi tarafından mermer üzerine işlenmiştir.",
          tarihselKanitIpucu: "Topkapı Sarayı arşivindeki Süleymaniye İnşaat Defterleri, çalışan 3500'ü aşkın ustanın ücretli ve özgür işçiler olduğunu kanıtlar.",
          sesliMetin: "Süleymaniye'nin giriş kitabesi 1557 yılını işaret eder. Günümüze ulaşan inşaat muhasebe defterleri ise bu dev eserin yapımında çalışan binlerce taş ustası, demirci ve nakkaşın günlük ücretlerinin kuruşu kuruşuna ödendiğini kanıtlar."
        },
        {
          id: "plan",
          kategori: "Plan",
          baslik: "2. Dört Fil Ayağı ve İki Yarım Kubbeli Plan",
          pos: [-2.4, 2.2, 0],
          kisaBilgi: "Merkezi kubbe, dört dev ayak üzerine oturur ve kuzey-güney yönünde iki yarım kubbeyle genişletilerek derinlemesine bir harim oluşturur.",
          tarihselKanitIpucu: "Süleymaniye'deki 4 ayaklı ve 2 yarım kubbeli plan ile Edirne Selimiye'deki 8 ayaklı tek kubbeli plan arasındaki fark, Mimar Sinan'ın üslup gelişimini gösterir.",
          sesliMetin: "Süleymaniye'nin plan şemasında ana kubbe, mihrap ve giriş yönündeki iki yarım kubbeyle desteklenir. Yan sahınlarda ise büyük ve küçük kubbeler nöbetleşe dizilerek iç mekâna derinlik kazandırır."
        },
        {
          id: "kullanim",
          kategori: "Kullanım Amacı",
          baslik: "3. Sahn-ı Süleymaniye: Tıp ve Matematik Medreseleri",
          pos: [3.5, 1.2, -2.5],
          kisaBilgi: "Kanuni Sultan Süleyman bu külliyede Osmanlı'nın ilk bağımsız Tıp Medresesini ve matematik-astronomi ağırlıklı dört yüksek medreseyi kurmuştur.",
          tarihselKanitIpucu: "Külliyede bağımsız bir Tıp Medresesi ve Darüşşifa bulunması, 16. yüzyıl Osmanlı yükseköğretiminde pozitif bilimlerin yerini kanıtlar.",
          sesliMetin: "Süleymaniye Külliyesi, Osmanlı'da tıp ve matematik-astronomi bilimleri için özel ihtisas medreselerinin kurulduğu en yüksek eğitim kampüsüdür."
        },
        {
          id: "bugunku",
          kategori: "Bugünkü İşlev",
          baslik: "4. Süleymaniye Yazma Eser Kütüphanesi ve İbadet",
          pos: [-3.5, 1.2, -2.5],
          kisaBilgi: "Evvel ve Sani medreseleri bugün dünyanın en zengin İslam bilim tarihi ve el yazması koleksiyonlarından biri olan Süleymaniye Kütüphanesi'dir.",
          tarihselKanitIpucu: "16. yüzyıl medrese binalarının bugün dünya çapında bir araştırma kütüphanesi olarak kullanılması, bilimsel işlevin sürekliliğini kanıtlar.",
          sesliMetin: "Külliyenin medrese binaları günümüzde Süleymaniye Yazma Eser Kütüphanesi olarak hizmet vermekte ve yüz binlerce tarihi el yazması eseri araştırmacılarla buluşturmaktadır."
        },
        {
          id: "malzeme",
          kategori: "Malzeme ve Yapı Tekniği",
          baslik: "5. Dört Coğrafyadan Sütunlar ve Devekuşu Yumurtaları",
          pos: [2.2, 1.8, 1.5],
          kisaBilgi: "Yan sahınlardaki dört dev granit sütun İskenderiye (Mısır), Baalbek (Lübnan), Kıztaşı ve Saray-ı Âmire'den getirilerek imparatorluk coğrafyasını birleştirmiştir.",
          tarihselKanitIpucu: "Avizelerin arasına yerleştirilen devekuşu yumurtaları, örümcek ağlarını doğal yolla engelleyen geleneksel koruma tekniğinin kanıtıdır.",
          sesliMetin: "Mimar Sinan, kandil avizelerinin arasına devekuşu yumurtaları yerleştirmiştir. Kuru devekuşu yumurtasının yaydığı insan burnunun algılayamadığı koku, örümceklerin kubbede ağ kurmasını yüzyıllar boyunca doğal yoldan engellemiştir."
        },
        {
          id: "mimari",
          kategori: "Mimari Özellikler",
          baslik: "6. İs Odası (Geri Dönüşüm Mühendisliği) ve 10 Şerefe",
          pos: [0, 3.8, 3.5],
          kisaBilgi: "Binlerce yağ kandilinin isini hava akımıyla cümle kapısı üzerindeki tek bir odada toplayıp en kaliteli hat mürekkebine dönüştüren 'İs Odası' sistemi.",
          tarihselKanitIpucu: "İs odası kanalları, 16. yüzyılda Mimar Sinan'ın aerodinamik ve sıfır atık (geri dönüşüm) mühendisliği uyguladığının somut kanıtıdır.",
          sesliMetin: "Camide yanan binlerce yağ kandilinin dumanı duvarları karartmamıştır. Çünkü Mimar Sinan, içerideki hava akımını hesaplayarak tüm isin ana giriş kapısı üzerindeki İs Odası'nda toplanmasını sağlamış, bu isten de en değerli hat mürekkebi üretilmiştir."
        },
        {
          id: "korunma",
          kategori: "Korunma Durumu",
          baslik: "7. Haliç Yamacında Teraslama ve Deprem Direnci",
          pos: [0, 0.8, -4.0],
          kisaBilgi: "Eğimli Haliç yamacına kademeli istinat duvarları ve horasan harçlı kazık temellerle oturtulan yapı, İstanbul'un en büyük depremlerine dayanmıştır.",
          tarihselKanitIpucu: "1766 ve 1894 İstanbul depremlerinde ana kubbenin çökmemesi, temel ve statik sistemin başarısını kanıtlar.",
          sesliMetin: "Süleymaniye dik bir yamaç üzerine kurulmasına rağmen, Mimar Sinan'ın kademeli teraslama ve esnek temel sistemi sayesinde 470 yıldır tüm büyük İstanbul depremlerine meydan okumuştur."
        },
        {
          id: "baglam",
          kategori: "Tarihsel Bağlam",
          baslik: "8. 4 Minare ve 10 Şerefenin Tarihsel Sembolizmi",
          pos: [-3.6, 4.5, 3.6],
          kisaBilgi: "Avlunun dört köşesindeki 4 minare Kanuni'nin İstanbul'un fethinden sonraki 4. padişah, toplam 10 şerefe ise Osmanlı'nın 10. padişahı olduğunu simgeler.",
          tarihselKanitIpucu: "Minare ve şerefe sayılarının kronolojik sırayı yansıtması, Osmanlı mimarisinde sayısal sembolizmin kullanıldığını gösterir.",
          sesliMetin: "Avlunun camiye bitişik iki minaresi üçer şerefeli, ön köşelerdeki daha kısa iki minaresi ise ikişer şerefelidir. Dört minare Kanuni'nin fetihten sonraki dördüncü sultan, toplam on şerefe ise kuruluşundan itibaren onuncu Osmanlı padişahı olduğunu simgeler."
        }
      ],
      karsilastirilabilirEserler: ["edirne-selimiye-camii", "edirne-bayezid-darussifasi", "diyarbakir-behram-pasa-camii", "istanbul-ahmed-cesmesi"],
      kanitTemelliSorular: [
        {
          id: "sul-q1",
          tip: "gorsel_kanit",
          zorluk: "Orta",
          ilgiliAlan: "Mimari Özellikler ve Mühendislik",
          kanitMetni: "KANIT 1 (Mimari İnceleme): Süleymaniye Camii'nde binlerce kandilin dumanı duvarlara yapışmak yerine özel hava kanallarıyla cümle kapısı üzerindeki 'İs Odası'na yönlendirilmiş; burada biriken is kazınarak medreselerde kullanılan 'is mürekkebi' üretilmiştir.",
          soru: "Bu mimari uygulama Mimar Sinan'ın tasarım anlayışı hakkında aşağıdakilerden hangisini kanıtlar?",
          secenekler: [
            "Fizik (hava akımı) kurallarını kullanarak hem yapıyı koruduğunu hem de atığı faydalı bir ürüne (mürekkebe) dönüştürdüğünü",
            "Caminin içinde aydınlatma yapılmasına izin verilmediğini",
            "Mürekkebin yalnızca yurt dışından ithal edildiğini",
            "Havalandırma kanallarının 20. yüzyıldaki restorasyonda eklendiğini"
          ],
          dogruIndeks: 0,
          ipucu: "'6. İs Odası (Geri Dönüşüm Mühendisliği)' bilgi noktasını inceleyin.",
          aciklama: "Mükemmel! İs odası sistemi, 16. yüzyıl Osmanlı mimarisinde aerodinamik hesaplama, yapı koruma ve geri dönüşüm (sıfır atık) bilincinin somut kanıtıdır.",
          kanitDosyasiBasligi: "Ekoloji ve Mühendislik Kanıtı: Süleymaniye İs Odası"
        },
        {
          id: "sul-q2",
          tip: "coktan_secmeli",
          zorluk: "Zor",
          ilgiliAlan: "Karşılaştırmalı Plan (Süleymaniye vs Selimiye)",
          kanitMetni: "KANIT 2 (Karşılaştırmalı Mimari Veri): Mimar Sinan 1557'de tamamladığı İstanbul Süleymaniye Camii'nde ana kubbeyi 4 fil ayağı üzerine oturtup 2 yarım kubbeyle desteklemiştir. 1575'te tamamladığı Edirne Selimiye Camii'nde ise yarım kubbe kullanmayıp 31,25 metrelik tek kubbeyi 8 fil ayağı üzerine oturtmuştur.",
          soru: "Bu iki eser arasındaki plan değişimi Mimar Sinan'ın mimari arayışı hakkında hangi çıkarımı doğrular?",
          secenekler: [
            "Mimar Sinan'ın yıllar içinde parçalı kubbe sisteminden, iç mekânı tek bir merkezi kubbe altında birleştiren tam mekân bütünlüğüne doğru ilerlediğini",
            "Edirne'de yarım kubbe yapacak taş ustası bulunamadığını",
            "Süleymaniye Camii'nin Selimiye'den daha sonra inşa edildiğini",
            "Mimar Sinan'ın her şehirde birebir aynı kopya planı uyguladığını"
          ],
          dogruIndeks: 0,
          ipucu: "'2. Dört Fil Ayağı ve İki Yarım Kubbeli Plan' noktasını ve Edirne Selimiye ile karşılaştırma verilerini düşünün.",
          aciklama: "Harika bir karşılaştırmalı tarih çıkarımı! Sinan; Şehzade (4 ayak + 4 yarım kubbe), Süleymaniye (4 ayak + 2 yarım kubbe) ve nihayet Selimiye (8 ayak + tek dev kubbe) ile merkezi mekân bütünlüğünü zirveye taşımıştır.",
          kanitDosyasiBasligi: "Karşılaştırmalı Mimarlık Kanıtı: Dört Ayaktan Sekizgen Baldakene Evrim"
        }
      ],
      kaynakca: [
        "Kültür Portalı, 'Süleymaniye Camii ve Külliyesi - İstanbul', T.C. Kültür ve Turizm Bakanlığı.",
        "Barkan, Ömer Lütfi (1972). Süleymaniye Cami ve İmareti İnşaatı (1550-1557), TTK Yayınları.",
        "Kuban, Doğan (2007). Osmanlı Mimarisi, YEM Yayınları."
      ],
      ogretmenNotlari: {
        kazanimlar: [
          "Kanuni dönemi Süleymaniye Külliyesi üzerinden Osmanlı'da bilim, mühendislik ve şehircilik ilişkisini analiz eder."
        ],
        etkinlikOnerisi: "Süleymaniye Camii ile Edirne Selimiye Camii'ni Karşılaştırma Ekranında yan yana açarak kubbe çapı, taşıyıcı ayak sayısı ve külliye birimlerini karşılaştırın."
      }
    },
    {
      id: "istanbul-ahmed-cesmesi",
      eserAdi: "İstanbul Sultan III. Ahmed Çeşmesi ve Sebili",
      il: "İstanbul",
      ilId: "istanbul",
      plaka: "34",
      bolge: "Marmara",
      ilce: "Fatih (Sultanahmet)",
      eserTuru: "Çeşme",
      donem: "Geç Klasik / Lale Devri (1600–1730)",
      yapimYili: "1728–1729 (III. Ahmed / Lale Devri)",
      mimar: "Kayserili Mehmed Ağa",
      kullanimDurumu: "Anıtsal Meydan Çeşmesi (Kültürel Miras Alanı)",
      konum: "Topkapı Sarayı Bâb-ı Hümâyûn Önü, Sultanahmet / İstanbul (41.0082° K, 28.9808° D)",
      kisaAciklama: "Lale Devri'nin (1728–1729) en zarif simgesi olan; Topkapı Sarayı girişinde dört cepheli çeşmesi, köşelerdeki dört sebili, geniş ahşap saçakları ve vazoda çiçek kabartmalarıyla meydan çeşmesi geleneğini başlatan anıtsal su yapısıdır.",
      ayrintiliAciklama: "Sultan III. Ahmed tarafından Sadrazam Nevşehirli Damat İbrahim Paşa'nın önerisiyle 1728-1729 yıllarında Topkapı Sarayı'nın birinci kapısı (Bâb-ı Hümâyûn) önünde inşa ettirilmiştir. Doğu Roma döneminden kalma Perayton çeşmesinin yerine yapılan eser, duvara bitişik klasik çeşmelerden farklı olarak dört cepheden yaklaşılan bağımsız bir 'meydan çeşmesi ve sebil köşkü' olarak tasarlanmıştır. Lale Devri estetiğini yansıtan vazoda meyve ve çiçek natürmortları, kalemişi geniş saçakları ve bizzat padişahın yazdığı tarih mısrasıyla Osmanlı su medeniyetinin şaheseridir.",
      modelTipi: "cesme",
      modelConfig: {
        baseColor: "#ece5d5",
        roofColor: "#3d5466",
        goldColor: "#d4af37",
        domes: 5
      },
      kitabeBilgisi: {
        yeri: "Ayasofya cephesindeki sebil ve çeşme kemerinin üstündeki celî sülüs ve talik kitabe kuşağı",
        metinOzeti: "Şair Seyyid Vehbi'nin kasidesinin sonunda bizzat Sultan III. Ahmed tarafından yazılan ve talik hatla işlenen ünlü dize yer alır: 'Tarihi Sultan Ahmed'in cârî zebân-ı lüleden / Aç besmeleyle iç suyu Han Ahmed'e eyle dua' (Hicri 1141 / Miladi 1728-1729).",
        tarihselKanitDegeri: "Padişahın kendi el yazısıyla (hatt-ı hümayun) kitabe yazması ve ebced hesabını tamamlayabilmek için 'Aç' kelimesinin başına 'elif' harfi eklenmesi, Lale Devri sanat-edebiyat-mimari etkileşiminin birincil kanıtıdır."
      },
      planBilgisi: {
        semaTipi: "Kare Planlı, Dört Cepheli, Dört Köşe Sebilli Bağımsız Meydan Çeşmesi",
        mekansalDuzen: "Merkezde sekizgen su haznesi; dört cephenin ortasında birer musluklu çeşme nişi; pahlanmış dört köşede ise üçer şebekeli penceresi bulunan yuvarlak çıkmalı dört sebil.",
        planAciklamasi: "Klasik dönemde duvar cephesinde kalan çeşme mimarisi, Lale Devri'nde kentsel bir meydan mobilyasına ve kamusal buluşma noktasına dönüşmüştür."
      },
      kullanimAmaci: {
        ilkIslev: "Halkın, yolcuların ve saray ziyaretçilerinin ücretsiz temiz su (çeşme) ve kandil/bayram günlerinde soğuk şerbet (sebil) ihtiyacını karşılamak.",
        kullaniciKitlesi: "İstanbul halkı, seyyahlar, saray görevlileri, sebilciler (şerbet dağıtan vakıf görevlileri)."
      },
      bugunkuIslev: {
        guncelKullanim: "Tarihi Yarımada'nın en önemli kentsel anıtlarından biri olarak açık hava kültür mirası.",
        degisimVeSureklilik: "Kentin su şebekesi evlere girdiği için günlük su doldurma işlevi değişmiş; ancak meydan kimliğini belirleyen kamusal odak ve estetik anıt işlevi sürmektedir."
      },
      malzemeBilgisi: {
        anaMalzemeler: "Marmara mermeri, kırmızı somaki, İznik ve Tekfur Sarayı çinileri, altın varaklı bronz şebekeler, kurşun kaplı ahşap saçak ve 5 kubbecik.",
        yapimTeknigi: "Yüksek kabartma (rölyef) mermer oyma işçiliği, kalemişi bezemeli geniş ahşap saçak ve içte kagir su haznesi."
      },
      mimariOzellikler: [
        "Dört köşede yer alan bronz şebekeli ve dilimli kubbeli dört sebil",
        "Geniş ahşap saçaklar ve üzerinde yükselen 5 adet kurşun kaplı kubbe",
        "Mermer üzerine yüksek kabartma vazoda lale, gül, karanfil ve meyve natürmortları",
        "Sultan III. Ahmed'in bizzat yazdığı altın varaklı kitabe",
        "Bâb-ı Hümâyûn ve Ayasofya arasında kentsel odak oluşturan bağımsız konum"
      ],
      korunmaDurumu: {
        durum: "Çok İyi Korunmuş (UNESCO Dünya Mirası Alanı İçinde)",
        restorasyonBilgisi: "Ahşap saçakları, altın varaklı kitabeleri ve mermer kabartmaları Vakıflar Genel Müdürlüğü tarafından titizlikle korunmuş ve restore edilmiştir."
      },
      tarihselBaglam: {
        donemOzelligi: "1718 Pasarofça Antlaşması sonrasında başlayan Lale Devri (1718–1730); sivil mimarinin, bahçe kültürünün, matbaanın ve meydan çeşmelerinin öne çıktığı dönem.",
        sosyoKulturelRol: "16. yüzyılın devasa selatin camilerinden 18. yüzyılın zarif kamusal meydan çeşmelerine geçişi simgeleyen en önemli dönüm noktasıdır."
      },
      hotspots: [
        {
          id: "kitabe",
          kategori: "Kitabe",
          baslik: "1. Padişah Hattıyla Yazılan Kitabe (1728/1729)",
          pos: [0, 2.5, 2.2],
          kisaBilgi: "'Aç besmeleyle iç suyu Han Ahmed'e eyle dua' dizesi bizzat Sultan III. Ahmed tarafından yazılmış ve ebced hesabıyla 1141 (1728/29) yılını vermiştir.",
          tarihselKanitIpucu: "Kitabedeki tarih dizesinin bizzat padişah tarafından hattatlıkla yazılması, Osmanlı hükümdarlarının sanata doğrudan katılımının kanıtıdır.",
          sesliMetin: "Çeşmenin kuzeybatı cephesindeki kitabede yer alan 'Aç besmeleyle iç suyu Han Ahmed'e eyle dua' mısrası bizzat Padişah Üçüncü Ahmed tarafından kaleme alınmış ve kendi el yazısıyla işlenmiştir."
        },
        {
          id: "plan",
          kategori: "Plan",
          baslik: "2. Bağımsız Meydan Çeşmesi ve Dört Köşe Sebil Planı",
          pos: [-2.1, 1.5, 2.1],
          kisaBilgi: "Duvara bitişik değil, dört tarafı açık bir meydan köşkü olarak planlanmıştır; ortada çeşmeler, dört köşede ise şerbet dağıtılan sebiller yer alır.",
          tarihselKanitIpucu: "Çeşmenin bir bina duvarından ayrılıp meydanın ortasına bağımsız bir anıt olarak çıkması, 18. yüzyılda kamusal meydan bilincinin geliştiğini kanıtlar.",
          sesliMetin: "Klasik dönemde çeşmeler genellikle bir cami veya medrese duvarına bitişik yapılırdı. Lale Devri'nde ise Üçüncü Ahmed Çeşmesi ile birlikte çeşmeler meydanın ortasında dört cepheli bağımsız birer kent anıtına dönüşmüştür."
        },
        {
          id: "kullanim",
          kategori: "Kullanım Amacı",
          baslik: "3. Çeşme ve Sebil Farkı: Su ve Şerbet Vakfı",
          pos: [2.1, 1.5, 2.1],
          kisaBilgi: "Cephe ortalarındaki musluklardan sürekli su akarken, köşelerdeki yuvarlak pencereli 'sebil' bölümlerinde görevliler yolculara soğuk su, bal ve meyve şerbeti ikram ederdi.",
          tarihselKanitIpucu: "Köşelerdeki parmaklıklı sebil pencereleri, vakıfların yalnızca su değil ücretsiz ikram (şerbet) hizmeti sunduğunun mimari kanıtıdır.",
          sesliMetin: "Bu yapıda iki farklı su kültürü bir aradadır: Ortadaki musluklu çeşmelerden halk gün boyu su ihtiyacını karşılarken, köşelerdeki kafesli sebillerin içindeki görevliler özellikle sıcak günlerde ve kandil gecelerinde halka ücretsiz soğuk şerbet ikram ederdi."
        },
        {
          id: "bugunku",
          kategori: "Bugünkü İşlev",
          baslik: "4. Sultanahmet Meydanı'nın Kentsel Odak Noktası",
          pos: [0, 0.8, -2.3],
          kisaBilgi: "Günümüzde Topkapı Sarayı ile Ayasofya arasındaki tarihi meydanın en önemli görsel ve kültürel odak noktasıdır.",
          tarihselKanitIpucu: "300 yıldır bulunduğu meydanın kimliğini belirlemesi, kentsel mirasın sürekliliğini gösterir.",
          sesliMetin: "Günümüzde Topkapı Sarayı'nın ana kapısı önünde yükselen bu zarif anıt, Osmanlı su medeniyetini ve Lale Devri estetiğini dünyaya tanıtan bir kültür mirasıdır."
        },
        {
          id: "malzeme",
          kategori: "Malzeme ve Yapı Tekniği",
          baslik: "5. Mermer Rölyefler, Tekfur Sarayı Çinileri ve Geniş Saçak",
          pos: [-2.2, 2.2, 0],
          kisaBilgi: "Beyaz Marmara mermeri üzerine yüksek kabartmalar, çini kuşaklar, bronz şebekeler ve ziyaretçileri güneşten/yağmurdan koruyan geniş ahşap saçak.",
          tarihselKanitIpucu: "Geniş ahşap saçaklar, hem mermer cepheyi yağmurdan korumak hem de su içen insanlara gölgelik sağlamak için tasarlanmıştır.",
          sesliMetin: "Yapının üzerini örten geniş ahşap saçaklar, hem mermer ve altın varaklı bezemeleri yağmurdan korur hem de çeşme başında bekleyen insanlara gölgeli bir alan sunar."
        },
        {
          id: "mimari",
          kategori: "Mimari Özellikler",
          baslik: "6. Vazoda Çiçek ve Kâsede Meyve Natürmortları",
          pos: [2.2, 1.8, 0],
          kisaBilgi: "Klasik dönemin soyut geometrik motiflerinin yanı sıra, vazo içinde lale, gül, karanfil buketleri ve tabak içinde incir, şeftali, armut kabartmaları yer alır.",
          tarihselKanitIpucu: "Mermer üzerindeki natüralist çiçek ve meyve tabağı kabartmaları, 18. yüzyıl Lale Devri'nde sanat zevkinin doğalcı ve dünyevi bir üsluba yöneldiğinin kanıtıdır.",
          sesliMetin: "Mermer nişlerin içine dikkatle baktığınızda vazolar içinde lale ve gül demetleri, kâseler içinde ise şeftali, incir ve armut kabartmaları görürsünüz. Bu natürmortlar, Lale Devri'nin doğaya ve dünyevi güzelliklere olan ilgisini kanıtlar."
        },
        {
          id: "korunma",
          kategori: "Korunma Durumu",
          baslik: "7. Beş Kubbeli Üst Örtü ve Kalemişi Bezemelerin Korunumu",
          pos: [0, 3.6, 0],
          kisaBilgi: "Ortada bir büyük, dört sebil üzerinde dört küçük olmak üzere 5 kurşun kaplı kubbe ve saçak altındaki altın varaklı kalemişi nakışlar özgünlüğüyle korunmuştur.",
          tarihselKanitIpucu: "Kurşun kaplı kubbeler ve saçak sistemi, içteki su haznesini serin ve temiz tutmuştur.",
          sesliMetin: "Çatının üzerindeki beş adet kurşun kaplı kubbe ve alem, su yapısına adeta küçük bir saray köşkü görünümü kazandırmıştır."
        },
        {
          id: "baglam",
          kategori: "Tarihsel Bağlam",
          baslik: "8. Lale Devri ve Kamusal Mekânın Dönüşümü (1728)",
          pos: [1.8, 1.2, -2.0],
          kisaBilgi: "1727'de ilk Türk matbaasının (İbrahim Müteferrika) kurulduğu yıllarla eş zamanlı olarak inşa edilmiş, İstanbul'da sivil ve kamusal mimarinin yükselişini temsil etmiştir.",
          tarihselKanitIpucu: "Aynı dönemde İstanbul, Üsküdar ve Tophane'de art arda meydan çeşmeleri yapılması, dönemin şehircilik politikasının su ve meydan odaklı olduğunu kanıtlar.",
          sesliMetin: "Üçüncü Ahmed Çeşmesi, Osmanlı'da ilk matbaanın kurulduğu, kütüphanelerin ve su kemerlerinin çoğaldığı Lale Devri yenileşmesinin mimarideki en somut belgesidir."
        }
      ],
      karsilastirilabilirEserler: ["istanbul-suleymaniye-camii", "konya-aziziye-camii", "kastamonu-nasrullah-kulliyesi"],
      kanitTemelliSorular: [
        {
          id: "ahm-q1",
          tip: "gorsel_kanit",
          zorluk: "Orta",
          ilgiliAlan: "Mimari Özellikler ve Dönemsel Değişim",
          kanitMetni: "KANIT 1 (Sanat Tarihi Gözlemi): 16. yüzyıl Klasik Dönem eserlerinde (örneğin Süleymaniye Camii) taş bezemeler sade, geometrik ve mukarnas ağırlıklıdır. 1728 tarihli III. Ahmed Çeşmesi'nde ise mermer yüzeylerde vazo içinde lale-gül buketleri ve kâseler içinde armut, incir, şeftali kabartmaları (natürmortlar) yer almaktadır.",
          soru: "İki dönem arasındaki bu bezeme farkı Osmanlı sanat ve mimarlık tarihi açısından neyi kanıtlamaktadır?",
          secenekler: [
            "18. yüzyıl Lale Devri ile birlikte Osmanlı bezeme sanatında doğalcı (natüralist) çiçek-meyve motiflerinin ve sivil zarafetin öne çıktığını",
            "18. yüzyılda mermer işçiliğinin tamamen unutulduğunu",
            "Çeşmenin aslında bir manav dükkânı olarak inşa edildiğini",
            "Klasik dönemde taş kullanımının yasak olduğunu"
          ],
          dogruIndeks: 0,
          ipucu: "'6. Vazoda Çiçek ve Kâsede Meyve Natürmortları' bilgi noktasını inceleyin.",
          aciklama: "Harika! Klasik dönemin ağırbaşlı ve soyut bezeme anlayışından Lale Devri'nin natüralist çiçek ve meyve kompozisyonlarına geçiş, dönemsel üslup değişiminin en net kanıtıdır.",
          kanitDosyasiBasligi: "Dönemsel Üslup Kanıtı: Lale Devri Natürmort Kabartmaları"
        },
        {
          id: "ahm-q2",
          tip: "coktan_secmeli",
          zorluk: "Kolay",
          ilgiliAlan: "Kullanım Amacı (Çeşme ve Sebil)",
          kanitMetni: "KANIT 2 (Mimari Plan): III. Ahmed Çeşmesi'nin dört cephesinin ortasında musluklu çeşmeler, dört köşesinde ise parmaklıklı pencereleri olan ve içinde görevli bulunan dört adet 'sebil' yer almaktadır.",
          soru: "Osmanlı su mimarisinde 'çeşme' ile 'sebil'in aynı yapıda bir arada bulunmasının sosyal amacı nedir?",
          secenekler: [
            "Halkın günlük su ihtiyacını karşılamanın yanında, yolculara görevliler eliyle ücretsiz soğuk su ve şerbet ikram etmek",
            "Köşelerdeki odalarda su vergisi tahsil etmek",
            "Suyu yalnızca saray askerlerine parayla satmak",
            "Sebil bölümlerini hapishane hücresi olarak kullanmak"
          ],
          dogruIndeks: 0,
          ipucu: "'3. Çeşme ve Sebil Farkı: Su ve Şerbet Vakfı' bilgi noktasını okuyun.",
          aciklama: "Doğru! Sebiller, vakıf medeniyetinin inceliğini gösteren hayır kurumlarıdır; içindeki sebilci görevlisi gelip geçenlere ücretsiz soğuk su ve şerbet ikram ederdi.",
          kanitDosyasiBasligi: "Sosyal Vakıf Kanıtı: Çeşme ve Sebil Kültürünün Birlikteliği"
        }
      ],
      kaynakca: [
        "Kültür Portalı, 'Sultan III. Ahmet Çeşmesi - İstanbul', T.C. Kültür ve Turizm Bakanlığı.",
        "Önge, Yılmaz (1997). Türk Mimarisinde Selçuklu ve Osmanlı Dönemlerinde Su Yapıları, TTK Yayınları.",
        "Kuban, Doğan (1998). Kent ve Mimarlık Üzerine İstanbul Yazıları, YEM Yayınları."
      ],
      ogretmenNotlari: {
        kazanimlar: [
          "Lale Devri'nde Osmanlı mimari ve sanat anlayışındaki değişimi 16. yüzyıl Klasik Dönem eserleriyle karşılaştırarak açıklar."
        ],
        etkinlikOnerisi: "Öğrencilerden İstanbul Süleymaniye Camii (1557) ile III. Ahmed Çeşmesi'ni (1728) karşılaştırarak 16. yüzyıldan 18. yüzyıla mimari ölçek ve bezeme anlayışındaki değişimi tartışmalarını isteyin."
      }
    },
    {
      id: "sivas-behrampasa-hani",
      eserAdi: "Sivas Behrampaşa Hanı (Taşhan)",
      il: "Sivas",
      ilId: "sivas",
      plaka: "58",
      bolge: "İç Anadolu",
      ilce: "Merkez",
      eserTuru: "Han",
      donem: "Klasik Dönem (1453–1600)",
      yapimYili: "1573–1576 (II. Selim / III. Murad Dönemi)",
      mimar: "Klasik Dönem Hassa Mimarları",
      kullanimDurumu: "Yaşayan Kültürel Miras (Konaklama ve Kültür Alanı)",
      konum: "Bankalar Caddesi Yakını, Merkez / Sivas (39.7483° K, 37.0161° D)",
      kisaAciklama: "Eski Yemen Beylerbeyi Behram Paşa tarafından 1573–1576 yıllarında Sivas'ta yaptırılan; giriş kemerindeki karşılıklı aslan kabartmaları, tamamen kesme taş cephesi ve kapalı ahır bölümüyle İç Anadolu iklimine uyarlanmış klasik Osmanlı hanıdır.",
      ayrintiliAciklama: "Sokullu Mehmed Paşa'nın kardeşi Mustafa Paşa'nın oğlu olan Behram Paşa tarafından Hicri 980-984 (1573-1576) yılları arasında yaptırılmıştır. Doğu-Batı ticaret yollarının kavşağı olan Sivas'ta iki katlı, açık avlulu ve güney cephesine bitişik devasa kapalı ahır (develik) bölümüyle inşa edilmiştir. Giriş taçkapısı kemer köşeliklerindeki yüksek kabartma iki aslan figürü, Anadolu Selçuklu figürlü taş işçiliği geleneğinin 16. yüzyıl Osmanlı mimarisinde Sivas'ta yaşatıldığını gösteren çok nadir bir kanıttır.",
      modelTipi: "han",
      modelConfig: {
        baseColor: "#c8b99e",
        brickColor: "#b5a488",
        roofColor: "#5c6670",
        hasKioskMasjid: false,
        hasLionRelief: true,
        floors: 2,
        courtyardRatio: 0.58,
        archCountX: 6,
        archCountZ: 5
      },
      kitabeBilgisi: {
        yeri: "Özgün kitabesi günümüze ulaşmamış; ancak Hicri 984 (1576) tarihli Behram Paşa Vakfiyesi ve Şer'iyye Sicilleri yapının künyesini kesin olarak belgelemektedir.",
        metinOzeti: "1576 tarihli vakfiyede Behram Paşa'nın Sivas'ta iki katlı kervansaray, hamam ve Diyarbakır'daki camisi için gelir kaynakları vakfettiği kayıtlıdır.",
        tarihselKanitDegeri: "Taçkapı üzerinde fiziksel kitabe bulunmadığında vakfiye belgelerinin ve kadı sicillerinin bir yapıyı tarihlendirmede nasıl birincil kanıt olarak kullanıldığını gösterir."
      },
      planBilgisi: {
        semaTipi: "İki Katlı Revaklı Avlulu ve Güneyde Kapalı Ahır (Develik) Bölümlü Han Planı",
        mekansalDuzen: "Kareye yakın dikdörtgen açık avlu etrafında iki katlı revaklar ve ocaklı tüccar odaları; güney cephesi boyunca uzanan kalın duvarlı, tonoz örtülü kapalı ahır bölümü.",
        planAciklamasi: "Bursa Koza Han'dan farklı olarak Sivas'ın sert kış iklimi nedeniyle kervan hayvanlarının donmaması için güneye kalın taş tonozlu geniş bir kapalı ahır bloğu eklenmiştir."
      },
      kullanimAmaci: {
        ilkIslev: "İran-Tebriz-Erzurum-Sivas-Tokat-İstanbul kervan yolu üzerindeki tüccarların ve kervan hayvanlarının güvenli konaklama ve ticaret merkezi.",
        kullaniciKitlesi: "Doğu Anadolu ve İran'dan gelen ipek/baharat kervanları, Sivaslı tüccarlar ve seyyahlar."
      },
      bugunkuIslev: {
        guncelKullanim: "Restorasyon sonrasında tarihi dokusuna uygun konaklama, kültür ve sosyal etkinlik alanı.",
        degisimVeSureklilik: "Tarihi konaklama ve misafir ağırlama işlevi, modern kültür turizmiyle uyumlu biçimde yeniden canlandırılmıştır."
      },
      malzemeBilgisi: {
        anaMalzemeler: "Sarımtırak Sivas kesme kalker taşı, siyah bazalt (renkli kemer taşları), tuğla tonozlar ve kurşun/taş üst örtü.",
        yapimTeknigi: "Tamamen kesme taş yığma duvar tekniği; giriş cephesinde iki renkli (ablaq) kemer taşları ve yüksek kabartma taş oymacılığı."
      },
      mimariOzellikler: [
        "Giriş kemeri köşeliklerinde karşılıklı iki yüksek kabartma Aslan Figürü",
        "İki renkli (siyah-sarı) geçmeli taş kemerli anıtsal giriş",
        "Sivas'ın sert kış iklimine uygun kalın duvarlı kapalı ahır (develik) bloğu",
        "İki katlı kesme taş revaklı iç avlu",
        "Her odada ısınma amaçlı taş ocak (şömine) ve nişler"
      ],
      korunmaDurumu: {
        durum: "Çok İyi Korunmuş",
        restorasyonBilgisi: "19. yüzyıl sonunda askeri süvari kışlası olarak da kullanılmış; Vakıflar Genel Müdürlüğü tarafından restore edilerek özgün taş işçiliği ve tonozları korunmuştur."
      },
      tarihselBaglam: {
        donemOzelligi: "16. yüzyıl ikinci yarısında vezir ve beylerbeylerinin Anadolu kervan yolları üzerinde büyük vakıf yatırımları yaptığı dönem.",
        sosyoKulturelRol: "Aynı devlet adamının (Behram Paşa) hem Sivas'ta han ve hamam hem Diyarbakır'da cami yaptırarak Anadolu şehirlerini birbirine bağlayan bir imar ağı kurduğunu gösterir."
      },
      hotspots: [
        {
          id: "kitabe",
          kategori: "Kitabe ve Vakfiye",
          baslik: "1. 1576 Tarihli Vakfiye ve Aslan Kabartmalı Giriş",
          pos: [0, 2.2, 4.2],
          kisaBilgi: "Giriş kemerinin iki köşesinde yer alan zincirli aslan kabartmaları, Selçuklu taş işçiliği geleneğinin Sivas'ta Osmanlı döneminde de sürdüğünü kanıtlar.",
          tarihselKanitIpucu: "16. yüzyıl Osmanlı hanında aslan figürü görülmesi, yerel Selçuklu-Anadolu sanat hafızasının korunduğunun somut kanıtıdır.",
          sesliMetin: "Behrampaşa Hanı'nın cümle kapısı kemerine dikkatle baktığınızda karşılıklı iki aslan kabartması görürsünüz. Sivas'taki güçlü Selçuklu taş işçiliği geleneğinin 16. yüzyıl Osmanlı mimarisinde de yaşatıldığını gösteren çok değerli bir görsel kanıttır."
        },
        {
          id: "plan",
          kategori: "Plan",
          baslik: "2. Avlu ve Kışlık Kapalı Ahır (Develik) Planı",
          pos: [0, 1.6, -3.5],
          kisaBilgi: "İki katlı avlu odalarının yanı sıra, güney cephesinde Sivas'ın sıfırın altına düşen kış soğuğuna karşı kalın taş tonozlu dev bir kapalı ahır yer alır.",
          tarihselKanitIpucu: "Bursa Koza Han ile karşılaştırıldığında Sivas Behrampaşa Hanı'nda devasa kapalı ahır bulunması, coğrafi iklimin mimari planı doğrudan şekillendirdiğini kanıtlar.",
          sesliMetin: "Hanın güney kanadında kalın taş duvarlı ve tonozlu büyük bir kapalı ahır bölümü bulunur. Sivas'ın sert karasal ikliminde kervan hayvanlarını ve yükleri dondurucu soğuktan korumak için bu özel plan geliştirilmiştir."
        },
        {
          id: "kullanim",
          kategori: "Kullanım Amacı",
          baslik: "3. İran-İstanbul İpek ve Baharat Kervanlarının Menzili",
          pos: [-3.0, 1.5, 0],
          kisaBilgi: "Erzurum üzerinden Sivas'a ulaşan ve buradan Tokat-Amasya yoluyla İstanbul'a veya Kayseri-Halep yönüne giden kervanların ana konaklama merkeziydi.",
          tarihselKanitIpucu: "Sivas'ta Subaşı Hanı, Çorapçı Hanı ve Behrampaşa Hanı gibi yapıların yan yana toplanması, şehrin transit ticaret kavşağı olduğunu kanıtlar.",
          sesliMetin: "16. yüzyılda Sivas, Doğu'dan Batı'ya ve Kuzey'den Güney'e uzanan ticaret yollarının kesişim noktasıydı. Behrampaşa Hanı bu uzun yolculukta tüccarların hem dinlendiği hem de mallarını toptan sattığı güvenli bir limandı."
        },
        {
          id: "bugunku",
          kategori: "Bugünkü İşlev",
          baslik: "4. Günümüzde Konaklama ve Kültür İşlevi",
          pos: [3.0, 1.5, 0],
          kisaBilgi: "Yapı, restorasyon sonrasında özgün mimari dokusu bozulmadan yeniden konaklama ve kültür merkezi olarak işlevlendirilmiştir.",
          tarihselKanitIpucu: "450 yıl önce yolcuları ağırlayan bir hanın bugün de konaklama amacıyla kullanılması işlevsel sürekliliği gösterir.",
          sesliMetin: "Behrampaşa Hanı günümüzde aslına uygun restorasyonuyla ziyaretçilerini ağırlamaya devam etmekte, tarihsel konaklama işlevini modern çağda da sürdürmektedir."
        },
        {
          id: "malzeme",
          kategori: "Malzeme ve Yapı Tekniği",
          baslik: "5. Sivas Kesme Kalker Taşı ve İki Renkli Kemer Örgüsü",
          pos: [-2.8, 2.3, 3.2],
          kisaBilgi: "Bursa'daki taş-tuğla almaşık duvar yerine Sivas'ta tamamen kesme kalker taşı ve girişte siyah-sarı renkli taş geçmeler kullanılmıştır.",
          tarihselKanitIpucu: "Bölgedeki zengin taş ocakları ve don olaylarına dayanıklılık ihtiyacı, kesme taş kullanımının temel nedenidir.",
          sesliMetin: "Yapının duvarlarında tuğla yerine tamamen düzgün kesme taş kullanılmıştır. İç Anadolu'nun don ve buzlanma koşullarına en dayanıklı malzeme kesme taş olduğu için yerel malzeme tercihi öne çıkmıştır."
        },
        {
          id: "mimari",
          kategori: "Mimari Özellikler",
          baslik: "6. Ocaklı Odalar ve Taş Çörtenler",
          pos: [2.8, 2.4, -1.8],
          kisaBilgi: "Üst kattaki her tüccar odasında bağımsız bir taş ocak (şömine) ve çatıda kar sularını tahliye eden aslan/ejder başlı taş çörtenler yer alır.",
          tarihselKanitIpucu: "Her odada ocak bulunması ve taş çörtenler, yapının yılın dört mevsimi, özellikle kış aylarında aktif kullanıldığını kanıtlar.",
          sesliMetin: "Üst kattaki tüm odalarda tüccarların kış gecelerinde ısınabilmesi için birer taş ocak yer alır. Çatı kenarlarındaki taş çörtenler ise eriyen kar sularını duvarlara zarar vermeden dışarı akıtır."
        },
        {
          id: "korunma",
          kategori: "Korunma Durumu",
          baslik: "7. Kışla Dönemi ve Modern Restorasyon",
          pos: [-2.2, 0.8, -2.5],
          kisaBilgi: "Osmanlı'nın son döneminde bir süre askeri süvari kışlası olarak kullanılan han, Cumhuriyet döneminde tescillenerek restore edilmiştir.",
          tarihselKanitIpucu: "Geniş avlusu ve ahır kapasitesi nedeniyle 19. yüzyılda süvari birlikleri tarafından da kullanılmış olması, yapının sağlamlığını gösterir.",
          sesliMetin: "Sağlam taş mimarisi ve geniş ahır bölümleri sayesinde yapı 19. yüzyılda bir dönem süvari kışlası olarak da hizmet vermiş, günümüzde ise kültürel miras olarak korunmuştur."
        },
        {
          id: "baglam",
          kategori: "Tarihsel Bağlam",
          baslik: "8. Behram Paşa'nın Sivas ve Diyarbakır Vakıf Ağı",
          pos: [2.0, 0.8, 2.5],
          kisaBilgi: "Behram Paşa, Sivas'ta bu hanı ve Kurşunlu Hamamı'nı yaptırırken, beylerbeyi olarak görev yaptığı Diyarbakır'da da Mimar Sinan eseri Behram Paşa Camii'ni inşa ettirmiştir.",
          tarihselKanitIpucu: "Aynı baninin hem Sivas hem Diyarbakır'da eserler bırakması, Osmanlı devlet adamlarının görev yaptıkları illeri imar ettiğini kanıtlar.",
          sesliMetin: "Behram Paşa'nın hem Sivas'ta bu ticaret hanını hem de Diyarbakır'da ünlü Behram Paşa Camii'ni yaptırmış olması, Osmanlı yöneticilerinin Anadolu'nun farklı şehirlerini vakıf eserleriyle birbirine bağladığını gösterir."
        }
      ],
      karsilastirilabilirEserler: ["bursa-koza-han", "tokat-tashan", "diyarbakir-hasan-pasa-hani", "diyarbakir-behram-pasa-camii"],
      kanitTemelliSorular: [
        {
          id: "sbh-q1",
          tip: "gorsel_kanit",
          zorluk: "Orta",
          ilgiliAlan: "Karşılaştırmalı Mimari (Sivas vs Bursa)",
          kanitMetni: "KANIT 1 (Karşılaştırmalı Gözlem): Bursa Koza Han'da (Marmara Bölgesi) duvarlar taş-tuğla almaşık örgüyle yapılmış ve avlu ortasında açık bir köşk mescit yer almıştır. Sivas Behrampaşa Hanı'nda (İç Anadolu Bölgesi) ise duvarlar tamamen kalın kesme taştan örülmüş, her odaya taş ocak konulmuş ve güney cepheye devasa bir kapalı ahır (develik) eklenmiştir.",
          soru: "Farklı illerdeki bu iki Osmanlı hanı arasındaki mimari farklılıkların temel nedeni aşağıdakilerden hangisidir?",
          secenekler: [
            "Coğrafi koşullar, iklim şartları (Sivas'ın sert kış iklimi) ve yerel malzeme olanaklarının mimari tasarımı doğrudan etkilemesi",
            "Sivas'taki hanın ticaret için değil yalnızca ibadet için yapılmış olması",
            "Bursa'da taş malzemenin hiç bilinmemesi",
            "Osmanlı'da han yapımında hiçbir planlama yapılmaması"
          ],
          dogruIndeks: 0,
          ipucu: "'2. Avlu ve Kışlık Kapalı Ahır Planı' ile '5. Sivas Kesme Kalker Taşı' bilgi noktalarını inceleyin.",
          aciklama: "Mükemmel karşılaştırma! Osmanlı mimarisi standart bir kalıbı her yere dayatmamış; Bursa'nın ılıman iklimi ile Sivas'ın sert karasal iklimine göre malzeme ve planı uyarlamıştır.",
          kanitDosyasiBasligi: "Coğrafya ve Mimarlık Kanıtı: İklime Göre Han Tasarımı"
        },
        {
          id: "sbh-q2",
          tip: "coktan_secmeli",
          zorluk: "Orta",
          ilgiliAlan: "Mimari Özellikler (Kültürel Süreklilik)",
          kanitMetni: "KANIT 2 (Görsel Kanıt): 1576 yılında inşa edilen Sivas Behrampaşa Hanı'nın cümle kapısı kemer köşeliklerinde karşılıklı iki adet yüksek kabartma 'aslan figürü' yer almaktadır.",
          soru: "Klasik dönem Osmanlı mimarisinde çok nadir görülen bu figürlü taş kabartmanın Sivas'taki bir eserde yer alması neyi kanıtlar?",
          secenekler: [
            "Sivas'taki köklü Anadolu Selçuklu taş işçiliği ve figürlü bezeme geleneğinin Osmanlı dönemi ustalarınca da sürdürülüp sentezlendiğini",
            "Yapının Osmanlılardan 1000 yıl önce Romalılar tarafından yapıldığını",
            "Hanın içinde yırtıcı hayvanat bahçesi bulunduğunu",
            "Aslan kabartmalarının 21. yüzyılda rastgele eklendiğini"
          ],
          dogruIndeks: 0,
          ipucu: "'1. 1576 Tarihli Vakfiye ve Aslan Kabartmalı Giriş' bilgi noktasını okuyun.",
          aciklama: "Doğru! Sivas, Anadolu Selçuklularının en önemli merkezlerinden biriydi; Osmanlı döneminde yapılan Behrampaşa Hanı'ndaki aslan kabartmaları Selçuklu-Osmanlı sanatsal sürekliliğinin kanıtıdır.",
          kanitDosyasiBasligi: "Sanatsal Süreklilik Kanıtı: Selçuklu'dan Osmanlı'ya Figürlü Taş İşçiliği"
        }
      ],
      kaynakca: [
        "Kültür Portalı, 'Behrampaşa Hanı - Sivas', T.C. Kültür ve Turizm Bakanlığı.",
        "Acun, Hakkı (1988). 'Sivas Behrampaşa Hanı', Vakıflar Dergisi.",
        "Aslanapa, Oktay (1986). Osmanlı Devri Mimarisi, İstanbul."
      ],
      ogretmenNotlari: {
        kazanimlar: [
          "Farklı coğrafi bölgelerdeki aynı tür Osmanlı eserlerini (Bursa Koza Han, Sivas Behrampaşa Hanı, Tokat Taşhan) iklim, malzeme ve plan açısından karşılaştırır."
        ],
        etkinlikOnerisi: "Karşılaştırma ekranında Bursa Koza Han ile Sivas Behrampaşa Hanı'nı yan yana açarak öğrencilerden benzerlik ve farklılık tablosunu doldurmalarını isteyin."
      }
    },
    {
      id: "tokat-tashan",
      eserAdi: "Tokat Taşhan (Voyvoda Hanı)",
      il: "Tokat",
      ilId: "tokat",
      plaka: "60",
      bolge: "Karadeniz",
      ilce: "Merkez",
      eserTuru: "Han",
      donem: "Geç Klasik / Lale Devri (1600–1730)",
      yapimYili: "1626–1631 (IV. Murad Dönemi)",
      mimar: "17. Yüzyıl Osmanlı Mimarları",
      kullanimDurumu: "Yaşayan Kültür ve El Sanatları Merkezi (Taşhan Çarşısı)",
      konum: "Gazioğlu Mahallesi, Sulu Sokak Yakını, Merkez / Tokat (40.3178° K, 36.5512° D)",
      kisaAciklama: "1626–1631 yıllarında inşa edilen, 112 odalı dev ölçeğiyle Anadolu'nun en büyük Osmanlı şehir hanlarından biri olan; bugün de Tokat yazmacılığı ve geleneksel el sanatlarıyla yaşayan ticaret merkezidir.",
      ayrintiliAciklama: "Kuzey-Güney ve Doğu-Batı kervan yollarının kilit noktası olan Tokat'ta 1626-1631 yılları arasında inşa edilen Taşhan (Voyvoda Hanı), yaklaşık 44x72 metre boyutlarındaki anıtsal dikdörtgen planıyla Anadolu'daki en büyük Osmanlı şehir hanlarından biridir. İki katlı, geniş açık avlulu, kesme taş ve tuğla almaşık örgülü yapıda iç ve dış dükkânlarla birlikte toplam 112 birim yer alır. Günümüzde Tokat taş baskı yazmacılığı, bakırcılık ve yöresel zanaat atölyeleriyle 400 yıldır ticari ve kültürel işlevini kesintisiz sürdürmektedir.",
      modelTipi: "han",
      modelConfig: {
        baseColor: "#d4c3a3",
        brickColor: "#9c412d",
        roofColor: "#54606b",
        hasKioskMasjid: false,
        floors: 2,
        courtyardRatio: 0.72,
        archCountX: 9,
        archCountZ: 6
      },
      kitabeBilgisi: {
        yeri: "Kuzey taçkapısı nişi ve arşiv kayıtları (Evliya Çelebi ve Tokat Şer'iyye Sicilleri)",
        metinOzeti: "Yapının 1626-1631 (Hicri 1036-1041) yılları arasında Sultan IV. Murad döneminde inşa edildiği, Evliya Çelebi'nin de Tokat'ın muazzam hanları arasında zikrettiği bilinmektedir.",
        tarihselKanitDegeri: "Tokat Gümrük ve Şer'iyye Sicilleri, 17. yüzyılda Tokat'ın Halep, Diyarbakır, Erzurum ve Sinop limanlarını birbirine bağlayan bir gümrük merkezi olduğunu kanıtlar."
      },
      planBilgisi: {
        semaTipi: "Anıtsal Dikdörtgen Avlulu, İki Katlı, Dış Cephe Dükkânlı Şehir Hanı Planı",
        mekansalDuzen: "Kuzey-güney doğrultusunda uzanan geniş açık avlu; alt ve üst katta revaklar arkasına dizilmiş ocaklı odalar; ayrıca dış cephede sokağa açılan sıra dükkânlar (toplam 112 birim).",
        planAciklamasi: "Hem avlu içindeki toptan kervan ticaretine hem de dış cephedeki dükkânlarıyla şehir içi perakende ticaretine aynı anda hizmet eden çift yönlü bir plan şemasına sahiptir."
      },
      kullanimAmaci: {
        ilkIslev: "Karadeniz limanları ile İç Anadolu ve Mezopotamya arasında işleyen kervanların konaklama, gümrükleme, bakır ve dokuma ticareti merkezi.",
        kullaniciKitlesi: "Kervan tüccarları, Tokatlı bakır ve yazma ustaları, gümrük görevlileri ve seyyahlar."
      },
      bugunkuIslev: {
        guncelKullanim: "Tokat el sanatları (taş baskı yazmacılık, bakırcılık, dokuma), kültür atölyeleri ve sosyal yaşam merkezi.",
        degisimVeSureklilik: "Anadolu'da 400 yıldır ticari ve zanaat işlevini hiç kaybetmeden sürdüren en canlı Osmanlı hanlarından biridir."
      },
      malzemeBilgisi: {
        anaMalzemeler: "Kesme taş, tuğla (almaşık duvar ve kubbe/tonoz örgüsü), dövme demir kapı ve pencere şebekeleri, alaturka kiremit ve kurşun örtü.",
        yapimTeknigi: "Kesme taş ve tuğla almaşık duvar tekniği; revaklarda sivri tuğla kemerler ve odalarda beşik/aynali tonoz örtü."
      },
      mimariOzellikler: [
        "72 metre uzunluğundaki devasa dikdörtgen avlu ve 112 mekân kapasitesi",
        "Dış cephede sokağa açılan perakende dükkân sıraları",
        "Kesme taş ve tuğla almaşık duvar işçiliği",
        "Üst kat revaklarında tuğla kemerli galeri düzeni",
        "Her odada bağımsız taş ocak, baca ve eşya nişleri"
      ],
      korunmaDurumu: {
        durum: "Çok İyi Korunmuş (Aktif Kullanımda)",
        restorasyonBilgisi: "1939 Erzincan depreminde kısmi hasar görmüş, Vakıflar Genel Müdürlüğü tarafından 1960'larda ve 2000'li yıllarda restore edilerek tüm birimleriyle yaşatılmıştır."
      },
      tarihselBaglam: {
        donemOzelligi: "17. yüzyılda Tokat'ın İstanbul ve İzmir ile birlikte Anadolu'nun en önemli gümrük, bakır işleme ve dokuma merkezlerinden biri olduğu dönem.",
        sosyoKulturelRol: "Somut mimari miras (Taşhan) ile somut olmayan kültürel mirası (Tokat taş baskı yazmacılığı) aynı çatı altında buluşturan yaşayan okul dışı öğrenme ortamıdır."
      },
      hotspots: [
        {
          id: "kitabe",
          kategori: "Kitabe ve Arşiv",
          baslik: "1. Kuzey Taçkapısı ve 17. Yüzyıl Tokat Gümrük Kayıtları",
          pos: [0, 2.2, 4.4],
          kisaBilgi: "1626-1631 yıllarında inşa edilen anıtsal giriş kapısı, demir kaplama kanatlarıyla gece kapatılarak içerideki tüccarların ve malların güvenliğini sağlardı.",
          tarihselKanitIpucu: "Tek bir ana giriş kapısının bulunması ve demir zırhlı kanatlar, hanlarda güvenliğin birinci öncelik olduğunun mimari kanıtıdır.",
          sesliMetin: "Taşhan'ın anıtsal kuzey kapısından içeri giriyorsunuz. 1631 yılında tamamlanan bu kapının demir kaplamalı ağır kanatları akşam ezanıyla birlikte kapatılır, içerideki yüzlerce tüccarın can ve mal güvenliği devlet güvencesine alınırdı."
        },
        {
          id: "plan",
          kategori: "Plan",
          baslik: "2. Çift Yönlü Plan: İç Avlu Odaları ve Dış Cephe Dükkânları",
          pos: [-3.4, 1.6, 0],
          kisaBilgi: "İç avluya bakan odalar konaklama ve toptan ticaret için kullanılırken, dış cephede sokağa bakan dükkânlar şehir halkının günlük alışverişine ayrılmıştır.",
          tarihselKanitIpucu: "Dış cephede sokağa açılan dükkânların varlığı, hanın şehir çarşısıyla (Sulu Sokak) organik biçimde bütünleştiğini kanıtlar.",
          sesliMetin: "Taşhan'ın plan şeması çok akılcıdır: İç avluya bakan odalar uzak yoldan gelen kervan tüccarlarına hizmet verirken, dış cephedeki dükkânlar doğrudan Tokat çarşısına açılarak şehir halkıyla buluşur."
        },
        {
          id: "kullanim",
          kategori: "Kullanım Amacı",
          baslik: "3. Anadolu Gümrük, Bakır ve Dokuma Ticareti Merkezi",
          pos: [3.4, 1.6, 0],
          kisaBilgi: "17. yüzyılda Diyarbakır ve Ergani'den gelen ham bakırların işlenip dağıtıldığı, İran ipeği ve Tokat dokumalarının pazarlandığı ana merkezdi.",
          tarihselKanitIpucu: "Hanın 112 birimlik devasa kapasitesi, 17. yüzyılda Tokat'taki ticaret hacminin büyüklüğünü kanıtlar.",
          sesliMetin: "17. yüzyılda Fransız seyyah Tavernier ve Evliya Çelebi, Tokat'ın doğudan gelen tüm kervanların toplandığı büyük bir gümrük ve bakır merkezi olduğunu yazar. Taşhan'ın 112 odalı dev ölçeği bu ticari canlılığın en somut kanıtıdır."
        },
        {
          id: "bugunku",
          kategori: "Bugünkü İşlev",
          baslik: "4. Somut ve Somut Olmayan Miras: Taş Baskı Yazmacılık",
          pos: [0, 1.0, 0],
          kisaBilgi: "Günümüzde hanın odalarında geleneksel ıhlamur kalıplarla Tokat taş baskı yazmacılığı üretilmekte ve ziyaretçiler tarafından deneyimlenebilmektedir.",
          tarihselKanitIpucu: "400 yıllık handa geleneksel el sanatlarının üretilmeye devam etmesi, kültürel mirasın yaşatılarak korunduğunu gösterir.",
          sesliMetin: "Bugün Taşhan'ın revakları altında dolaşırken ıhlamur ağacından oyulmuş kalıplarla kumaşa desen vuran Tokat yazma ustalarının çekiç seslerini duyabilirsiniz. Bu durum, somut mimari miras ile somut olmayan el sanatı mirasının kusursuz buluşmasıdır."
        },
        {
          id: "malzeme",
          kategori: "Malzeme ve Yapı Tekniği",
          baslik: "5. Kesme Taş ve Tuğla Almaşık Örgü",
          pos: [-3.2, 2.3, -3.5],
          kisaBilgi: "Cephelerde kesme taş ve tuğla almaşık örgü, revak kemerlerinde ve tonozlarda ise kırmızı tuğla işçiliği kullanılmıştır.",
          tarihselKanitIpucu: "Tuğla kemer ve tonozlar, Kuzey Anadolu deprem kuşağındaki Tokat'ta yapıya esneklik kazandırmıştır.",
          sesliMetin: "Taşhan'ın duvarlarında kesme taş sağlamlığı sağlarken, revak kemerlerinde ve üst örtü tonozlarında kullanılan tuğla malzeme yapıya deprem esnekliği kazandırmıştır."
        },
        {
          id: "mimari",
          kategori: "Mimari Özellikler",
          baslik: "6. İki Katlı Sivri Kemerli Revaklar ve Ocak Bacaları",
          pos: [3.2, 2.5, -2.5],
          kisaBilgi: "Geniş avluyu dört yönden kuşatan iki katlı sivri kemerli revaklar ve çatı boyunca sıralanan kagir ocak bacaları.",
          tarihselKanitIpucu: "Simetrik baca dizileri, her odanın bağımsız ısıtma sistemine sahip olduğunu gösterir.",
          sesliMetin: "Avluyu çevreleyen iki katlı revaklar, yağışlı günlerde bile tüccarların odalar arasında ıslanmadan dolaşmasını ve mallarını sergilemesini sağlar."
        },
        {
          id: "korunma",
          kategori: "Korunma Durumu",
          baslik: "7. Kullanarak Koruma Modeli",
          pos: [0, 2.8, -4.2],
          kisaBilgi: "Boş bırakılan tarihi yapıların hızla yıprandığı bilinirken, Taşhan'ın aktif bir zanaat ve kültür çarşısı olarak kullanılması korunmasını güvence altına almıştır.",
          tarihselKanitIpucu: "Kültürel miras yönetiminde 'yaşatarak koruma' ilkesinin en başarılı örneklerinden biridir.",
          sesliMetin: "Tarihi eserleri korumanın en etkili yolu, onları özgün ruhuna uygun bir işlevle yaşatmaktır. Taşhan, terk edilmiş bir anıt değil, her gün yüzlerce insanın ürettiği yaşayan bir kültür mirasıdır."
        },
        {
          id: "baglam",
          kategori: "Tarihsel Bağlam",
          baslik: "8. Sulu Sokak Tarihi Kent Dokusu",
          pos: [2.2, 0.8, 3.2],
          kisaBilgi: "Taşhan; yakınındaki Arastalı Bedesten (Тоkat Müzesi), Paşa Hamamı, Takyeciler Camii ve Yağıbasan Medresesi ile 900 yıllık bir tarih koridorunun parçasıdır.",
          tarihselKanitIpucu: "Aynı cadde üzerinde Danişmendli, Selçuklu ve Osmanlı eserlerinin yan yana bulunması, Anadolu'daki tarihsel katmanlaşmayı kanıtlar.",
          sesliMetin: "Taşhan'ın yer aldığı bölge, Danişmendlilerden Selçuklulara ve Osmanlılara uzanan 900 yıllık kesintisiz bir Türk-İslam şehircilik laboratuvarıdır."
        }
      ],
      karsilastirilabilirEserler: ["bursa-koza-han", "sivas-behrampasa-hani", "diyarbakir-hasan-pasa-hani", "sanliurfa-gumruk-hani"],
      kanitTemelliSorular: [
        {
          id: "tt-q1",
          tip: "gorsel_kanit",
          zorluk: "Orta",
          ilgiliAlan: "Plan ve Ekonomik Tarih",
          kanitMetni: "KANIT 1 (Mimari Plan): Tokat Taşhan'da iç avluya bakan iki katlı tüccar/konaklama odalarının yanı sıra, hanın dış cephesinde doğrudan şehir sokağına açılan sıra dükkânlar yer almaktadır. Yapıda toplam 112 birim bulunmaktadır.",
          soru: "Taşhan'ın bu mimari planı 17. yüzyıl Tokat ekonomisi hakkında hangi çıkarımı doğrudan destekler?",
          secenekler: [
            "Hanın hem şehirlerarası toptan kervan ticaretine hem de şehir içi perakende çarşı alışverişine aynı anda hizmet edecek büyüklükte tasarlandığını",
            "Tokat'ta halkın hanın yakınına yaklaşmasının yasak olduğunu",
            "Hanın yalnızca askeri cephane saklamak için inşa edildiğini",
            "17. yüzyılda Anadolu'da ticaret yollarının tamamen kapandığını"
          ],
          dogruIndeks: 0,
          ipucu: "'2. Çift Yönlü Plan' ve '3. Anadolu Gümrük, Bakır ve Dokuma Ticareti Merkezi' noktalarını inceleyin.",
          aciklama: "Çok doğru! İç avlu kervanların toptan ticaretine ve konaklamasına, dış cephe dükkânları ise şehir halkıyla perakende ticarete hizmet ederek çift yönlü bir ekonomik merkez oluşturmuştur.",
          kanitDosyasiBasligi: "Ekonomik Ölçek Kanıtı: 112 Birimli Çift Yönlü Şehir Hanı"
        },
        {
          id: "tt-q2",
          tip: "coktan_secmeli",
          zorluk: "Kolay",
          ilgiliAlan: "Bugünkü İşlev ve Miras Koruma",
          kanitMetni: "KANIT 2 (Güncel Gözlem): 1631 yılında yapılan Tokat Taşhan'da günümüzde geleneksel ıhlamur kalıplarla Tokat taş baskı yazmacılığı ve el sanatları üretilip ziyaretçilere tanıtılmaktadır.",
          soru: "Bu durum kültürel mirasın korunması açısından nasıl değerlendirilmelidir?",
          secenekler: [
            "Somut mimari miras (Taşhan) ile somut olmayan kültürel mirasın (yazmacılık zanaatı) birbirini besleyerek 'yaşatarak koruma' sağladığı",
            "El sanatları üretiminin tarihi binanın kimliğine tamamen aykırı olduğu",
            "Tarihi yapıların içine hiçbir ziyaretçinin alınmaması gerektiği",
            "Taşhan'ın özgün ticari işlevini tamamen kaybettiği"
          ],
          dogruIndeks: 0,
          ipucu: "'4. Somut ve Somut Olmayan Miras' ve '7. Kullanarak Koruma Modeli' noktalarını okuyun.",
          aciklama: "Tebrikler! UNESCO'nun da vurguladığı gibi, tarihi ticaret ve zanaat yapılarını geleneksel el sanatlarıyla yaşatmak hem somut hem de somut olmayan kültürel mirası korur.",
          kanitDosyasiBasligi: "Miras Yönetimi Kanıtı: Somut ve Somut Olmayan Mirasın Birlikteliği"
        }
      ],
      kaynakca: [
        "Kültür Portalı, 'Taşhan (Voyvoda Hanı) - Tokat', T.C. Kültür ve Turizm Bakanlığı.",
        "Sevim, Mustafa (2001). Evliya Çelebi Seyahatnamesi'nde Tokat.",
        "Gündoğdu, Hamza (2006). Tokat'ta Türk Mimari Eserleri."
      ],
      ogretmenNotlari: {
        kazanimlar: [
          "Bursa Koza Han, Sivas Behrampaşa Hanı ve Tokat Taşhan üzerinden Osmanlı ticaret yolları ve han mimarisini karşılaştırır."
        ],
        etkinlikOnerisi: "Öğrencilerden Bursa, Sivas ve Tokat'taki üç Osmanlı hanını karşılaştırarak 'İpek ve Kervan Yolu üzerinde hanların ortak ve farklı mimari unsurları nelerdir?' sorusuna kanıt temelli yanıt vermelerini isteyin."
      }
    }
  ];

  window.OTTOMAN_MONUMENTS = (window.OTTOMAN_MONUMENTS || []).concat(MORE_MONUMENTS);
})();
