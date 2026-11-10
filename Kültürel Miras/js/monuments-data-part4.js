// MİRAS-3B: Osmanlı Eserleri Veri Tabanı — Bölüm 4 (7 Coğrafi Bölge Temsili)
// TÜBİTAK 2204-B Tarih Projesi — Amasya, Erzurum, Manisa, Adana, Şanlıurfa, Kastamonu, Ankara, İzmir, Van, Trabzon

(function () {
  const PART4_MONUMENTS = [
    {
      id: "amasya-bayezid-kulliyesi",
      eserAdi: "Amasya Sultan II. Bayezid Külliyesi ve Medresesi",
      il: "Amasya",
      ilId: "amasya",
      plaka: "05",
      bolge: "Karadeniz",
      ilce: "Merkez",
      eserTuru: "Medrese",
      donem: "Erken Osmanlı (1299–1453)",
      yapimYili: "1485–1486 (II. Bayezid Dönemi)",
      mimar: "Mimar Şemseddin Ahmed",
      kullanimDurumu: "Aktif İbadethane ve İl Halk / Yazma Eser Kütüphanesi",
      konum: "Hacılar Meydanı, Yeşilırmak Kıyısı, Merkez / Amasya (40.6524° K, 35.8286° D)",
      kisaAciklama: "Amasya'da 27 yıl sancakbeyliği yapan Sultan II. Bayezid'in tahta çıktıktan hemen sonra Yeşilırmak kıyısında inşa ettirdiği; cami, U planlı medrese, imaret ve kütüphaneden oluşan şehzadeler şehri külliyesidir.",
      ayrintiliAciklama: "Tahta çıkmadan önce 27 yıl Amasya Valiliği (Şehzadeliği) yapan Sultan II. Bayezid, padişah olunca Amasya halkına şükran borcu olarak 1485–1486 yıllarında Mimar Şemseddin Ahmed'e bu külliyeyi yaptırmıştır. Art arda iki kubbeli (tabhaneli) camisi, 18 kubbeli hücreye ve büyük kubbeli dershaneye sahip U planlı medresesi, muvakkithanesi ve avludaki asırlık çınarlarıyla Osmanlı şehzade sancağı kültürünün en seçkin anıtıdır.",
      modelTipi: "medrese",
      modelConfig: {
        baseColor: "#d9ceb8",
        domeColor: "#54606b",
        hasHexagonHospital: false,
        courtyardArches: 6
      },
      kitabeBilgisi: {
        yeri: "Cami cümle kapısı üzerindeki Hicri 891 (Miladi 1486) tarihli Şeyh Hamdullah hattı mermer kitabe",
        metinOzeti: "Sultan II. Bayezid Han'ın emriyle Amasya Sancakbeyi Şehzade Ahmed döneminde Mimar Şemseddin Ahmed nezaretinde Hicri 891 (1486) yılında tamamlandığı yazılıdır.",
        tarihselKanitDegeri: "Aynı padişahın (II. Bayezid) 1486'da Amasya'da, 1488'de Edirne'de ve 1491'de Bursa'da (Koza Han) eserler yaptırması, tek bir hükümdar dönemindeki imparatorluk çapı imar programını kanıtlar."
      },
      planBilgisi: {
        semaTipi: "U Planlı Revaklı Medrese ve Yan Mekânlı (Tabhaneli) İki Kubbeli Cami",
        mekansalDuzen: "Yeşilırmak paralelinde geniş dış avlu; batıda U biçiminde dizilmiş 18 öğrenci odalı ve kubbeli dershaneli medrese; merkezde arka arkaya iki büyük kubbeli cami ve doğuda imaret.",
        planAciklamasi: "Medresenin açık U planı, öğrencilerin doğuya (camiye) ve Yeşilırmak vadisine bakan ferah bir avlu etrafında eğitim görmesini sağlamıştır."
      },
      kullanimAmaci: {
        ilkIslev: "Şehzadelerin yetiştiği Amasya'da en üst düzey dini ve ilmi eğitim veren Sultaniye Medresesi, cami ve aşevi (imaret).",
        kullaniciKitlesi: "Şehzadeler, müderrisler (Amasya müftüsü ve alimleri), medrese öğrencileri ve Amasya halkı."
      },
      bugunkuIslev: {
        guncelKullanim: "Cami ibadete açık; medrese bölümü ise Amasya Beyazıt İl Halk Kütüphanesi ve Yazma Eserler Kütüphanesi olarak kullanılmaktadır.",
        degisimVeSureklilik: "1486'da eğitim ve kitap okuma amacıyla kurulan medresenin bugün de kütüphane olarak hizmet vermesi 540 yıllık eğitim sürekliliğini kanıtlar."
      },
      malzemeBilgisi: {
        anaMalzemeler: "Amasya kesme kalker taşı, kırmızı-beyaz kemer taşları, kurşun kaplı kubbeler, kündekâri ahşap kapılar.",
        yapimTeknigi: "Kesme taş duvar örgüsü, mihrap önü ve son cemaat yerinde renkli taş geçmeli kemerler."
      },
      mimariOzellikler: [
        "18 kubbeli öğrenci hücresi ve anıtsal dershaneli U planlı Medrese",
        "Arka arkaya iki merkezi kubbeli ve yan tabhaneli Cami planı",
        "Mavi-beyaz çini bilezikli ve taş külahlı iki zarif minare",
        "Yeşilırmak kıyısında simetrik külliye yerleşimi ve teras duvarları",
        "Avluda denge kontrolü için konulan tarihi 'Terazi Taşları' (Dönen Sütunlar)"
      ],
      korunmaDurumu: {
        durum: "Çok İyi Korunmuş",
        restorasyonBilgisi: "1590 ve 1939 depremlerinden sonra onarılmış, köşe kulelerindeki döner denge taşları ve kesme taş örgüsüyle günümüze sağlam ulaşmıştır."
      },
      tarihselBaglam: {
        donemOzelligi: "Amasya'nın Osmanlı şehzadelerinin devlet yönetimi eğitimi aldığı en önemli sancak merkezi ('Tahtgâh-ı Kadîm') olduğu dönem.",
        sosyoKulturelRol: "Bir şehzade sancağının başkent standartlarında yükseköğretim ve kütüphane kurumlarıyla donatıldığını gösterir."
      },
      hotspots: [
        {
          id: "kitabe",
          kategori: "Kitabe",
          baslik: "1. 1486 Tarihli Şeyh Hamdullah Kitabesi",
          pos: [0, 2.0, 4.0],
          kisaBilgi: "Amasya'da yetişen büyük hattat Şeyh Hamdullah tarafından yazılan kitabe, 1486 yılında Sultan II. Bayezid adına tamamlandığını belgeler.",
          tarihselKanitIpucu: "Hem Amasya hem Edirne II. Bayezid Külliyesi kitabelerinin Şeyh Hamdullah tarafından yazılması, Amasya ekolünün başkent sanatını şekillendirdiğini kanıtlar.",
          sesliMetin: "Külliye kitabesi, bizzat Amasya'da yetişmiş olan Türk hat sanatının kurucusu Şeyh Hamdullah tarafından yazılmıştır."
        },
        {
          id: "plan",
          kategori: "Plan",
          baslik: "2. U Planlı Medrese ve İki Kubbeli Cami Yerleşimi",
          pos: [-3.2, 1.5, 0],
          kisaBilgi: "Külliyenin batısında U planlı 18 odalı medrese, merkezinde iki kubbeli cami ve doğusunda imaret (aşevi) Yeşilırmak kıyısı boyunca dengeli biçimde dizilmiştir.",
          tarihselKanitIpucu: "Nehir kıyısındaki düz şerit araziye uyum sağlamak için külliye binalarının yan yana doğrusal dizilmesi, topografyaya uyumlu planlamayı kanıtlar.",
          sesliMetin: "Dar ve derin Yeşilırmak vadisinde düz alan sınırlı olduğu için, mimar külliye binalarını nehir kıyısına paralel bir hat üzerinde yan yana sıralamıştır."
        },
        {
          id: "kullanim",
          kategori: "Kullanım Amacı",
          baslik: "3. Şehzade Sancağında Yükseköğretim (Medrese)",
          pos: [-3.0, 2.2, -2.0],
          kisaBilgi: "Amasya Medresesi, Osmanlı'da müftü ve müderrislerin ders verdiği en prestijli taşra üniversitelerinden biriydi.",
          tarihselKanitIpucu: "Vakfiyede medrese müderrisliğinin doğrudan Amasya Müftüsü'ne verilmesi, kurumun akademik seviyesini kanıtlar.",
          sesliMetin: "Sultan İkinci Bayezid, vakfiyesinde bu medresenin başmüderrisliğini doğrudan Amasya'nın en bilgili alimi olan Amasya Müftüsü'ne şart koşmuştur."
        },
        {
          id: "bugunku",
          kategori: "Bugünkü İşlev",
          baslik: "4. 540 Yıllık Süreklilik: Medreseden Kütüphaneye",
          pos: [3.2, 1.4, 0],
          kisaBilgi: "Medrese binası günümüzde Beyazıt İl Halk ve Yazma Eser Kütüphanesi olarak öğrencilere ve araştırmacılara hizmet vermektedir.",
          tarihselKanitIpucu: "15. yüzyılda kitap okunan medrese hücrelerinin 21. yüzyılda da kütüphane olması işlevsel sürekliliğin en güzel örneğidir.",
          sesliMetin: "Beş yüz kırk yıl önce medrese öğrencilerinin mum ışığında kitap okuduğu bu kubbeli odalar, bugün de kütüphane olarak gençlere ve araştırmacılara hizmet vermektedir."
        },
        {
          id: "malzeme",
          kategori: "Malzeme ve Yapı Tekniği",
          baslik: "5. Kesme Kalker Taşı ve Renkli Kemer Taşları",
          pos: [0, 2.4, 1.8],
          kisaBilgi: "Son cemaat yeri kemerlerinde kırmızı ve beyaz taşların nöbetleşe dizilmesi ve kurşun kaplı kubbeler.",
          tarihselKanitIpucu: "Kemerlerdeki kırmızı-beyaz taş işçiliği Erken Osmanlı döneminin karakteristik cephe estetiğidir.",
          sesliMetin: "Son cemaat yeri kemerlerindeki kırmızı ve beyaz renkli taş geçmeler, yapıya sıcak ve davetkâr bir ritim kazandırmıştır."
        },
        {
          id: "mimari",
          kategori: "Mimari Özellikler",
          baslik: "6. Deprem Terazisi (Dönen Taş Sütunlar)",
          pos: [2.5, 1.8, 3.0],
          kisaBilgi: "Köşelerde yer alan silindirik 'terazi taşları', Kuzey Anadolu fay hattındaki depremlerin binada yol açtığı oturmaları test etmek için konulmuştur.",
          tarihselKanitIpucu: "Dönen denge sütunları, Osmanlı mimarlarının deprem kuşağındaki yapılarda statik kontrol mekanizması kurduğunun somut kanıtıdır.",
          sesliMetin: "Yapının köşelerinde bulunan silindirik denge taşları kendi ekseni etrafında dönebilecek şekilde yerleştirilmiştir. Eğer bir deprem sonrasında bu taş sıkışır ve dönmezse, binanın temelinde kayma olduğu anlaşılır ve hemen onarım yapılırdı."
        },
        {
          id: "korunma",
          kategori: "Korunma Durumu",
          baslik: "7. Yeşilırmak Taşkın Duvarları ve Asırlık Çınarlar",
          pos: [0, 0.8, 4.2],
          kisaBilgi: "Nehir kıyısındaki güçlü taş istinat duvarları külliyeyi taşkınlardan korumuş, avludaki 500 yıllık çınar ağaçları ise doğal miras olarak günümüze ulaşmıştır.",
          tarihselKanitIpucu: "Avludaki anıt çınar ağaçları, Osmanlı külliyelerinde mimari ile peyzajın (doğanın) birlikte tasarlandığını gösterir.",
          sesliMetin: "Külliyenin avlusundaki beş asırlık anıt çınar ağaçları, Osmanlı mimarisinin doğayla ve ağaçla kurduğu saygılı ilişkinin yaşayan tanıklarıdır."
        },
        {
          id: "baglam",
          kategori: "Tarihsel Bağlam",
          baslik: "8. II. Bayezid'in Üç Şehirdeki Vakıf Ağı (Amasya-Edirne-Bursa)",
          pos: [0, 3.6, -1.5],
          kisaBilgi: "Bu platformda yer alan Amasya Külliyesi (1486), Edirne Darüşşifası (1488) ve Bursa Koza Han (1491) aynı padişahın 5 yıl içinde kurduğu üç büyük eserdir.",
          tarihselKanitIpucu: "Öğrenciler bu üç eseri karşılaştırarak tek bir padişah dönemindeki eğitim, sağlık ve ticaret yatırımlarını bütüncül olarak analiz edebilir.",
          sesliMetin: "Platformumuzda incelediğiniz Amasya Külliyesi, Edirne Darüşşifası ve Bursa Koza Han, Sultan İkinci Bayezid'in yalnızca beş yıl içinde Anadolu ve Rumeli'de kurduğu muazzam eğitim, sağlık ve ticaret ağının üç halkasıdır."
        }
      ],
      karsilastirilabilirEserler: ["edirne-bayezid-darussifasi", "bursa-koza-han", "adana-ramazanoglu-medresesi", "istanbul-suleymaniye-camii"],
      kanitTemelliSorular: [
        {
          id: "abk-q1",
          tip: "gorsel_kanit",
          zorluk: "Orta",
          ilgiliAlan: "Mimari Özellikler ve Mühendislik",
          kanitMetni: "KANIT 1 (Mimari Gözlem): Kuzey Anadolu deprem kuşağında yer alan Amasya II. Bayezid Külliyesi'nde köşelere kendi ekseni etrafında dönebilen silindirik 'terazi (denge) taşları' yerleştirilmiştir. Deprem sonrasında bu taşların dönüp dönmediği kontrol edilerek binanın statiğinde kayma olup olmadığı tespit edilmiştir.",
          soru: "Bu mimari uygulama 15. yüzyıl Osmanlı yapı teknolojisi hakkında aşağıdakilerden hangisini kanıtlar?",
          secenekler: [
            "Deprem riskinin bilindiğini ve yapı güvenliğini düzenli denetlemek için mekanik erken uyarı/kontrol sistemleri geliştirildiğini",
            "Sütunların yalnızca süs amacıyla rastgele konulduğunu",
            "Amasya'da hiç deprem yaşanmadığını",
            "Taşların rüzgâr değirmeni olarak un öğütmek için kullanıldığını"
          ],
          dogruIndeks: 0,
          ipucu: "'6. Deprem Terazisi (Dönen Taş Sütunlar)' bilgi noktasını inceleyin.",
          aciklama: "Kesinlikle doğru! Dönen terazi taşları, Osmanlı mimarlarının deprem kuşağındaki anıtsal yapılarda zemin oturmasını ve duvar kaymasını ölçmek için kullandıkları bilimsel bir kontrol düzeneğidir.",
          kanitDosyasiBasligi: "Deprem Mühendisliği Kanıtı: Amasya Külliyesi Terazi Taşları"
        }
      ],
      kaynakca: [
        "Kültür Portalı, 'Sultan II. Bayezid Külliyesi - Amasya', T.C. Kültür ve Turizm Bakanlığı.",
        "Yüksel, İ. Aydın (1983). Osmanlı Mimarisinde II. Bayezid ve Yavuz Selim Devri, İstanbul Fetih Cemiyeti."
      ],
      ogretmenNotlari: {
        kazanimlar: [
          "II. Bayezid döneminde Amasya (eğitim), Edirne (sağlık) ve Bursa'da (ticaret) yapılan eserleri karşılaştırarak Osmanlı imar politikasını kavrar."
        ],
        etkinlikOnerisi: "Öğrencilerden Amasya II. Bayezid Medresesi ile Edirne II. Bayezid Darüşşifası'nı karşılaştırmalarını isteyin."
      }
    },
    {
      id: "erzurum-lala-pasa-camii",
      eserAdi: "Erzurum Lala Mustafa Paşa Camii",
      il: "Erzurum",
      ilId: "erzurum",
      plaka: "25",
      bolge: "Doğu Anadolu",
      ilce: "Yakutiye",
      eserTuru: "Cami",
      donem: "Klasik Dönem (1453–1600)",
      yapimYili: "1562–1563 (Kanuni Sultan Süleyman Dönemi)",
      mimar: "Mimar Sinan",
      kullanimDurumu: "Aktif İbadethane (Merkez Tarihi Eser)",
      konum: "Cumhuriyet Caddesi, Yakutiye / Erzurum (39.9065° K, 41.2722° D)",
      kisaAciklama: "Erzurum Beylerbeyi (sonradan Kıbrıs Fatihi) Lala Mustafa Paşa tarafından 1562'de Mimar Sinan planıyla inşa ettirilen; dört fil ayağına oturan merkezi kubbesi ve Doğu Anadolu kış iklimine uyarlanmış kapalı kurgusuyla Erzurum'daki ilk Osmanlı selatin/vezir camisidir.",
      ayrintiliAciklama: "Erzurum Beylerbeyi Lala Mustafa Paşa tarafından 1562-1563 yıllarında yaptırılan cami, Mimar Sinan'ın eser listelerini içeren 'Tuhfetü'l-Mimarin' ve 'Tezkiretü'l-Ebniye'de kayıtlıdır. İstanbul Şehzade ve Diyarbakır Fatih Paşa camilerinde görülen 'dört ayak üzerine merkezi kubbe ve dört yönde yarım kubbe/tonoz' şemasının Erzurum'un sert iklimine uyarlanmış halidir. Açık revaklı iç avlu yerine yapı kütlesinin kompakt tutulması ve iki renkli Erzurum kehribar/kalker taş işçiliği dikkat çeker.",
      modelTipi: "cami",
      modelConfig: {
        baseColor: "#c9baa3",
        domeColor: "#4a5560",
        minaretCount: 1,
        centralDomeRadius: 2.2,
        baldachin: "tetragonal"
      },
      kitabeBilgisi: {
        yeri: "Cümle kapısı üzerindeki Hicri 970 (Miladi 1562/1563) tarihli sülüs mermer kitabe ve son cemaat yerindeki 1670 tarihli Vergi Fermanı Kitabesi",
        metinOzeti: "Hicri 970 (1562/63) yılında Lala Mustafa Paşa tarafından yaptırıldığı; ayrıca son cemaat duvarındaki 1670 tarihli taş ferman kitabesinde Erzurum halkından alınan ağır vergilerin kaldırıldığı ilan edilmektedir.",
        tarihselKanitDegeri: "Son cemaat duvarına kazınan 1670 tarihli 'Vergi Muafiyeti Fermanı Kitabesi', cami duvarlarının Osmanlı'da halkın haklarını güvenceye alan resmi ilan panosu olarak kullanıldığını kanıtlar!"
      },
      planBilgisi: {
        semaTipi: "Dört Fil Ayağına Oturan Merkezi Kubbe ve Dört Yönde Tonozlu Haçvari Plan",
        mekansalDuzen: "Önde beş kubbeli son cemaat yeri, harimde dört sekizgen taş ayak üzerine oturan merkezi kubbe, dört ana yönde beşik tonozlar ve köşelerde dört küçük kubbe.",
        planAciklamasi: "Erzurum'un ağır kış ve kar yağışı koşulları nedeniyle açık şadırvanlı avlu yapılmamış, kompakt ve ısıyı koruyan kalın taş duvarlı bir kütle tercih edilmiştir."
      },
      kullanimAmaci: {
        ilkIslev: "Doğu sınırının kilit kalesi Erzurum'da merkez Cuma camii ve kamu duyuru alanı.",
        kullaniciKitlesi: "Erzurum halkı, serhat (sınır) askerleri, Doğu kervan tüccarları."
      },
      bugunkuIslev: {
        guncelKullanim: "Aktif ibadethane ve Yakutiye Medresesi yanındaki tarihi kent meydanının odak yapısı.",
        degisimVeSureklilik: "464 yıldır Erzurum kent merkezinde ibadet işlevini kesintisiz sürdürmektedir."
      },
      malzemeBilgisi: {
        anaMalzemeler: "Sarı-boz Erzurum kesme taşı, kırmızımsı kehribar taşı, kurşun kaplama ve çini alınlıklar.",
        yapimTeknigi: "Kalın kesme taş duvarlar, sekizgen yekpare taş payeler ve kar yüküne dayanıklı kurşun kubbe/tonoz sistemi."
      },
      mimariOzellikler: [
        "Son cemaat duvarında taş üzerine kazınmış 1670 tarihli 'Vergi İndirimi Fermanı Kitabesi'",
        "Dört sekizgen fil ayağına oturan merkezi kubbeli Mimar Sinan planı",
        "Erzurum'un sert kış iklimine uygun avlusuz kompakt kütle ve kalın taş duvarlar",
        "Pencere alınlıklarında 16. yüzyıl sıraltı çini panoları",
        "Mukarnas kavsaralı, iki renkli taş işçilikli anıtsal taçkapı"
      ],
      korunmaDurumu: {
        durum: "Çok İyi Korunmuş",
        restorasyonBilgisi: "1859 Erzurum depreminde zarar gören minaresi ve son cemaat yeri onarılmış, Vakıflar Genel Müdürlüğü tarafından restore edilmiştir."
      },
      tarihselBaglam: {
        donemOzelligi: "16. yüzyılda Erzurum'un Osmanlı'nın doğu sınırındaki en büyük askeri, idari ve ticari üssü haline geldiği dönem.",
        sosyoKulturelRol: "Hemen yanındaki İlhanlı eseri Yakutiye Medresesi (1310) ile yan yana durarak Erzurum'da Selçuklu-İlhanlı ve Klasik Osmanlı mimarisinin tarihsel diyalogunu oluşturur."
      },
      hotspots: [
        {
          id: "kitabe",
          kategori: "Kitabe ve Ferman",
          baslik: "1. 1562 İnşa Kitabesi ve 1670 Tarihli Taş Ferman Kitabesi",
          pos: [0, 2.0, 3.8],
          kisaBilgi: "Son cemaat duvarına mermer üzerine kazınmış 1670 (IV. Mehmed) tarihli fermanda, kıtlık ve savaşlar nedeniyle Erzurum halkından alınan tekâlif-i şakka vergilerinin kaldırıldığı yazılıdır.",
          tarihselKanitIpucu: "Padişah fermanının kağıt yerine cami duvarındaki mermere kazınması, hiçbir valinin bu vergiyi tekrar toplayamaması için halka verilen hukuki güvencenin kanıtıdır.",
          sesliMetin: "Son cemaat yerinde çok ilginç bir tarihsel kanıt yer alır: 1670 yılında Padişah Dördüncü Mehmed, Erzurum halkının şikâyeti üzerine haksız vergileri kaldırmış ve bu fermanın herkes tarafından görülüp değiştirilememesi için caminin duvarına taş kitabe olarak kazınmasını emretmiştir."
        },
        {
          id: "plan",
          kategori: "Plan",
          baslik: "2. İklime Uyarlanmış Mimar Sinan Planı (Avlusuz Kompakt Kütle)",
          pos: [-2.4, 1.8, 0],
          kisaBilgi: "İstanbul ve Edirne'deki Mimar Sinan camilerinde geniş açık revaklı avlular varken, kışın -30 dereceyi gören Erzurum'da açık avlu yapılmamış, ısıyı tutan kompakt bir plan uygulanmıştır.",
          tarihselKanitIpucu: "Mimar Sinan'ın iklim koşullarına göre planı değiştirdiğinin en güçlü kanıtlarından biridir.",
          sesliMetin: "Edirne Selimiye ile Erzurum Lala Paşa Camii'ni karşılaştırdığınızda önemli bir fark görürsünüz: Erzurum'un dondurucu kış soğuğu nedeniyle burada açık şadırvanlı iç avlu yapılmamış, ısıyı koruyan kalın duvarlı kompakt bir plan uygulanmıştır."
        },
        {
          id: "kullanim",
          kategori: "Kullanım Amacı",
          baslik: "3. İbadet ve Kamusal İlan Mekânı",
          pos: [2.4, 1.8, 1.5],
          kisaBilgi: "Cuma namazlarının kılındığı merkez cami olmasının yanı sıra, taş ferman kitabesiyle halkın ekonomik haklarının ilan edildiği kamusal merkezdir.",
          tarihselKanitIpucu: "Caminin Osmanlı şehirlerinde hem dini hem de hukuki/kamusal iletişim merkezi olduğunu gösterir.",
          sesliMetin: "Bu yapı, Osmanlı'da camilerin yalnızca ibadet yeri olmadığını, aynı zamanda devlet ile halk arasındaki hukuki fermanların ilan edildiği kamusal bir meydan olduğunu kanıtlar."
        },
        {
          id: "bugunku",
          kategori: "Bugünkü İşlev",
          baslik: "4. Cumhuriyet Caddesi'nin Tarihi Odağı",
          pos: [2.2, 1.0, -2.0],
          kisaBilgi: "Günümüzde Yakutiye Medresesi ile yan yana Erzurum kent merkezinin en önemli tarihi ve dini odak noktasıdır.",
          tarihselKanitIpucu: "14. yüzyıl İlhanlı medresesi ile 16. yüzyıl Osmanlı camisinin yan yana korunması, kültürel sürekliliği gösterir.",
          sesliMetin: "Günümüzde Erzurum'un kalbinde yer alan Lala Paşa Camii, hemen yanındaki Yakutiye Medresesi ile birlikte öğrencilere farklı Türk devletlerinin mimarisini yan yana karşılaştırma fırsatı sunar."
        },
        {
          id: "malzeme",
          kategori: "Malzeme ve Yapı Tekniği",
          baslik: "5. Erzurum Kesme Taşı ve Kırmızı-Beyaz Kemer İşçiliği",
          pos: [-2.2, 2.2, -1.8],
          kisaBilgi: "Don olaylarına dayanıklı Erzurum kesme taşı ve kapı kemerlerinde iki renkli taş geçmeler kullanılmıştır.",
          tarihselKanitIpucu: "Soğuk iklimde sıva ve tuğlanın donarak dökülmesini önlemek için cephede tamamen kesme taş tercih edilmiştir.",
          sesliMetin: "Erzurum'un şiddetli don ve buzlanma koşullarına dayanabilmesi için yapının tüm dış cephesinde kalın kesme taş bloklar kullanılmıştır."
        },
        {
          id: "mimari",
          kategori: "Mimari Özellikler",
          baslik: "6. Dört Sekizgen Fil Ayağı ve Mukarnaslı Taçkapı",
          pos: [0, 3.5, 0],
          kisaBilgi: "Merkezi kubbeyi taşıyan dört sekizgen taş sütun (fil ayağı) ve Selçuklu taçkapılarını hatırlatan derin mukarnaslı giriş nişi.",
          tarihselKanitIpucu: "Derin mukarnaslı taçkapı nişi, Erzurum'daki Çifte Minareli ve Yakutiye medreselerinin Selçuklu taş geleneğiyle kurulan bağı gösterir.",
          sesliMetin: "Girişteki derin mukarnaslı taçkapı, Erzurum'daki asırlık Selçuklu taş işçiliği geleneğine duyulan saygının bir yansımasıdır."
        },
        {
          id: "korunma",
          kategori: "Korunma Durumu",
          baslik: "7. Pencere Alınlığı Çinileri ve Hünkâr Mahfili",
          pos: [1.8, 1.5, 2.5],
          kisaBilgi: "İç mekân pencere alınlıklarındaki lacivert-turkuaz sıraltı çini kitabeler (Ayetü'l-Kürsi) özgünlüğünü koruyarak günümüze ulaşmıştır.",
          tarihselKanitIpucu: "Binlerce kilometre uzaktaki İznik/Kütahya atölyelerinden Erzurum'a çini gönderildiğini kanıtlar.",
          sesliMetin: "Pencere üstlerindeki çini panolar, 16. yüzyılda Batı Anadolu'daki çini atölyelerinden Doğu Anadolu'nun serhat şehri Erzurum'a kadar uzanan sanat ağını kanıtlar."
        },
        {
          id: "baglam",
          kategori: "Tarihsel Bağlam",
          baslik: "8. Lala Mustafa Paşa'nın Anadolu-Şam-Kıbrıs Vakıfları",
          pos: [-1.8, 1.0, 2.8],
          kisaBilgi: "Lala Mustafa Paşa Erzurum Beylerbeyi iken bu camiyi, Konya Ilgın'da ise yine Mimar Sinan eseri büyük Lala Mustafa Paşa Külliyesi'ni yaptırmıştır.",
          tarihselKanitIpucu: "Devlet adamlarının görev yaptıkları her güzergâhta vakıf eserleri bıraktığını gösterir.",
          sesliMetin: "Lala Mustafa Paşa, görev yaptığı Erzurum'da bu camiyi inşa ettirdiği gibi, kervan yolu üzerindeki Konya Ilgın'da da Mimar Sinan'a büyük bir külliye yaptırmıştır."
        }
      ],
      karsilastirilabilirEserler: ["diyarbakir-behram-pasa-camii", "istanbul-suleymaniye-camii", "edirne-selimiye-camii", "sivas-behrampasa-hani"],
      kanitTemelliSorular: [
        {
          id: "elp-q1",
          tip: "coktan_secmeli",
          zorluk: "Orta",
          ilgiliAlan: "Kitabe ve Sosyal/Hukuk Tarihi",
          kanitMetni: "KANIT 1 (Epigrafik Kanıt - 1670): Erzurum Lala Mustafa Paşa Camii'nin son cemaat yeri duvarında mermer üzerine kazınmış bir 'Ferman Kitabesi' bulunmaktadır. Kitabede, Erzurum halkının şikâyeti üzerine padişahın haksız ve ağır vergileri yasakladığı yazılıdır.",
          soru: "Bir vergi fermanının kağıt üzerinde kalmayıp caminin giriş duvarına taş kitabe olarak kazınmasının temel amacı nedir?",
          secenekler: [
            "Halkın sahip olduğu hukuki muafiyeti herkesin görebileceği kamusal bir alanda kalıcı hale getirmek ve yöneticilerin keyfi vergi toplamasını engellemek",
            "Caminin duvarındaki kırık taşları kapatmak",
            "Halkın camiye girmesini zorlaştırmak",
            "Taş ustalarına yazı alıştırması yaptırmak"
          ],
          dogruIndeks: 0,
          ipucu: "'1. 1562 İnşa Kitabesi ve 1670 Tarihli Taş Ferman Kitabesi' bilgi noktasını inceleyin.",
          aciklama: "Harika bir tarihsel kanıt okuması! Osmanlı'da cami duvarlarına kazınan adaletnameler ve vergi fermanları, halkın haklarını yerel yöneticilere karşı koruyan somut hukuk belgeleridir.",
          kanitDosyasiBasligi: "Hukuk Tarihi Kanıtı: Cami Duvarındaki Taş Ferman Kitabesi"
        }
      ],
      kaynakca: [
        "Kültür Portalı, 'Lala Mustafa Paşa Camii - Erzurum', T.C. Kültür ve Turizm Bakanlığı.",
        "Konyalı, İbrahim Hakkı (1960). Abideleri ve Kitabeleri ile Erzurum Tarihi, İstanbul."
      ],
      ogretmenNotlari: {
        kazanimlar: [
          "Mimar Sinan'ın farklı iklim bölgelerindeki camilerini (Edirne, Diyarbakır, Erzurum) karşılaştırarak coğrafyanın mimariye etkisini analiz eder."
        ],
        etkinlikOnerisi: "Erzurum Lala Mustafa Paşa Camii ile Diyarbakır Behram Paşa Camii'ni karşılaştırarak Doğu Anadolu (soğuk iklim - kompakt plan) ile Güneydoğu Anadolu (sıcak iklim - çift revaklı son cemaat yeri) arasındaki farkları inceletin."
      }
    },
    {
      id: "adana-ramazanoglu-medresesi",
      eserAdi: "Adana Ulu Cami Külliyesi ve Ramazanoğlu Medresesi",
      il: "Adana",
      ilId: "adana",
      plaka: "01",
      bolge: "Akdeniz",
      ilce: "Seyhan",
      eserTuru: "Medrese",
      donem: "Klasik Dönem (1453–1600)",
      yapimYili: "1540 (Kanuni Sultan Süleyman / Ramazanoğlu Piri Mehmed Paşa Dönemi)",
      mimar: "16. Yüzyıl Çukurova Mimarları",
      kullanimDurumu: "Kültür ve Eğitim Vakfı / Ziyaret Alanı",
      konum: "Kızılay Caddesi, Ulucami Mahallesi, Seyhan / Adana (36.9852° K, 35.3308° D)",
      kisaAciklama: "Osmanlı'ya bağlı Adana Sancakbeyi Ramazanoğlu Piri Mehmed Paşa tarafından 1540'ta yaptırılan; Memlük, Selçuklu ve Klasik Osmanlı mimari unsurlarını (siyah-beyaz taş işçiliği ve kubbeli dershane) Akdeniz iklimine uygun açık avluda buluşturan medresedir.",
      ayrintiliAciklama: "Ramazanoğulları Beyliği'nin Osmanlı idaresine katılmasından sonra Sancakbeyi Piri Mehmed Paşa tarafından Hicri 947 (Miladi 1540) yılında Ulu Cami Külliyesi'nin parçası olarak inşa ettirilmiştir. Açık avlulu, revaklı öğrenci hücreleri ve iki kubbeli dershanesiyle Çukurova'daki en önemli Osmanlı dönemi yükseköğretim yapısıdır.",
      modelTipi: "medrese",
      modelConfig: {
        baseColor: "#ded4c1",
        domeColor: "#5c6670",
        hasHexagonHospital: false,
        courtyardArches: 5
      },
      kitabeBilgisi: {
        yeri: "Batı taçkapısı üzerindeki Hicri 947 (1540) tarihli üç satırlık Arapça sülüs kitabe",
        metinOzeti: "Halil Bey oğlu Piri Mehmed Paşa tarafından Hicri 947 (Miladi 1540) yılında ilim tahsili için inşa ettirildiği yazılıdır.",
        tarihselKanitDegeri: "Çukurova'da Ramazanoğulları'nın Osmanlı sancakbeyi statüsüyle eğitim ve kültür yatırımlarını sürdürdüğünü kanıtlar."
      },
      planBilgisi: {
        semaTipi: "Açık Avlulu, Üç Yönde Revaklı Öğrenci Odalı ve İki Kubbeli Dershaneli Medrese",
        mekansalDuzen: "23x32 m boyutlarında dikdörtgen plan; kuzey, doğu ve güneyde ocaklı öğrenci hücreleri, doğu kanadında iki kubbeli büyük dershane (mescit-dershane) ve ortada kuyu/havuzlu açık avlu.",
        planAciklamasi: "Adana'nın sıcak Akdeniz iklimine uyum sağlamak üzere geniş gölgeli revaklar, hava akımı sağlayan pencereler ve açık avlu düzeni kullanılmıştır."
      },
      kullanimAmaci: {
        ilkIslev: "Çukurova bölgesinin en yüksek dini ve ilmi eğitim kurumu (medrese).",
        kullaniciKitlesi: "Müderrisler ve medrese öğrencileri."
      },
      bugunkuIslev: {
        guncelKullanim: "Kültürel etkinlikler, ilmi sohbetler ve okul dışı tarih öğrenme alanı.",
        degisimVeSureklilik: "Kültür ve eğitim odaklı işlevini Çukurova'nın tarihi merkezinde sürdürmektedir."
      },
      malzemeBilgisi: {
        anaMalzemeler: "Kesme kalker taşı, siyah-beyaz mermer (taçkapı), kırmızı tuğla (kubbe ve bacalar).",
        yapimTeknigi: "Beden duvarlarında kesme taş, revak tonozları ve dershane kubbelerinde ise tuğla örgü tekniği."
      },
      mimariOzellikler: [
        "Memlük, Selçuklu ve Osmanlı üsluplarını birleştiren siyah-beyaz taşlı taçkapı",
        "Tuğla örgülü ikiz dershane kubbesi ve karakteristik konik ocak bacaları",
        "Sıcak iklime uygun geniş revaklı açık avlu",
        "Öğrenci odalarında kitap nişleri ve davlumbazlı ocaklar",
        "Ulu Cami, Türbe ve Tuz Hanı ile oluşturduğu külliye bütünlüğü"
      ],
      korunmaDurumu: {
        durum: "İyi Korunmuş",
        restorasyonBilgisi: "1998 Adana depreminden sonra Vakıflar Genel Müdürlüğü tarafından güçlendirilerek restore edilmiştir."
      },
      tarihselBaglam: {
        donemOzelligi: "16. yüzyılda Mısır ve Suriye seferleri sonrasında Çukurova'nın Osmanlı idari ve kültürel sistemiyle bütünleştiği dönem.",
        sosyoKulturelRol: "Anadolu Selçuklu, Memlük ve Osmanlı mimari geleneklerinin Adana'da nasıl kültürel bir sentez oluşturduğunu gösterir."
      },
      hotspots: [
        {
          id: "kitabe",
          kategori: "Kitabe",
          baslik: "1. 1540 Tarihli Piri Mehmed Paşa Kitabesi",
          pos: [0, 2.0, 3.8],
          kisaBilgi: "Batı taçkapısı üzerindeki sülüs kitabe, medresenin 1540 yılında Ramazanoğlu Piri Mehmed Paşa tarafından yaptırıldığını belgeler.",
          tarihselKanitIpucu: "Kitabe, yerel beylik ailesinin Osmanlı sancakbeyi olarak şehri imar etmeye devam ettiğini kanıtlar.",
          sesliMetin: "Taçkapı üzerindeki kitabe, medresenin 1540 yılında Kanuni Sultan Süleyman'ın sadık sancakbeyi Ramazanoğlu Piri Mehmed Paşa tarafından yaptırıldığını gösterir."
        },
        {
          id: "plan",
          kategori: "Plan",
          baslik: "2. Akdeniz İklimine Uygun Açık Avlu ve Revak Planı",
          pos: [-2.8, 1.5, 0],
          kisaBilgi: "Sıcak Çukurova ikliminde öğrencilerin serin bir ortamda ders çalışabilmesi için avlu açık tutulmuş ve odaların önüne derin gölgeli revaklar eklenmiştir.",
          tarihselKanitIpucu: "İklimin eğitim yapılarının plan şemasını nasıl etkilediğini gösterir.",
          sesliMetin: "Adana'nın sıcak yaz aylarında öğrencilerin bunalmaması için medrese avlusu geniş ve açık bırakılmış, hücrelerin önüne derin gölgeli revaklar yerleştirilmiştir."
        },
        {
          id: "kullanim",
          kategori: "Kullanım Amacı",
          baslik: "3. İki Kubbeli Dershane ve Öğrenci Hücreleri",
          pos: [2.8, 2.2, 0],
          kisaBilgi: "Doğu kanadındaki iki kubbeli büyük salon ortak dershane ve mescit olarak, avlu etrafındaki küçük tonozlu odalar ise öğrencilerin yatakhane ve çalışma odası olarak kullanılmıştır.",
          tarihselKanitIpucu: "Büyük kubbeli salon (dershane) ile küçük odaların (hücrelerin) ayrımı, bir yapının eğitim kurumu (medrese) olduğunun mimari kanıtıdır.",
          sesliMetin: "Bir yapının han mı yoksa medrese mi olduğunu planından anlayabilirsiniz: Medreselerde avlu etrafındaki öğrenci odalarının yanı sıra mutlaka büyük kubbeli bir ana dershane salonu bulunur ve ahır bölümü yer almaz."
        },
        {
          id: "bugunku",
          kategori: "Bugünkü İşlev",
          baslik: "4. Günümüzde Kültür ve Eğitim Alanı",
          pos: [0, 1.0, -2.5],
          kisaBilgi: "Günümüzde Adana Ulu Cami Külliyesi içinde kültürel ve eğitsel etkinliklere ev sahipliği yapmaktadır.",
          tarihselKanitIpucu: "485 yıldır eğitim ve kültür kimliğini korumaktadır.",
          sesliMetin: "Ramazanoğlu Medresesi günümüzde de Adana'nın tarihi merkezinde kültür ve eğitim faaliyetlerine ev sahipliği yapmaktadır."
        },
        {
          id: "malzeme",
          kategori: "Malzeme ve Yapı Tekniği",
          baslik: "5. Kesme Taş Duvarlar ve Tuğla Kubbeler",
          pos: [-2.5, 2.3, -2.0],
          kisaBilgi: "Beden duvarlarında beyaz kesme taş, dershane kubbeleri ve bacalarda ise pişmiş kırmızı tuğla kullanılmıştır.",
          tarihselKanitIpucu: "Taş ve tuğlanın birlikte kullanımı hem ısı yalıtımı hem de statik hafiflik sağlamıştır.",
          sesliMetin: "Duvarlarda kesme kalker taşı kullanılırken, kubbe ve bacalarda hafif ve sıcağa dayanıklı kırmızı tuğla tercih edilmiştir."
        },
        {
          id: "mimari",
          kategori: "Mimari Özellikler",
          baslik: "6. Memlük-Selçuklu-Osmanlı Sentezli Taçkapı",
          pos: [2.2, 1.8, 2.5],
          kisaBilgi: "Siyah-beyaz taş geçmeler (Memlük etkisi), geometrik yıldız örgüler (Selçuklu etkisi) ve klasik revak düzeni (Osmanlı etkisi) tek yapıda buluşmuştur.",
          tarihselKanitIpucu: "Coğrafi geçiş bölgesindeki yapıların birden fazla medeniyetin mimari izlerini taşıdığını kanıtlar.",
          sesliMetin: "Adana, Anadolu ile Suriye-Mısır arasındaki geçiş noktasında yer aldığı için bu eserde Selçuklu, Memlük ve Osmanlı mimari özellikleri bir arada görülür."
        },
        {
          id: "korunma",
          kategori: "Korunma Durumu",
          baslik: "7. 1998 Depremi Sonrası Restorasyon",
          pos: [-2.0, 0.9, 2.5],
          kisaBilgi: "1998 Ceyhan-Adana depreminden sonra bilimsel yöntemlerle onarılarak sağlamlaştırılmıştır.",
          tarihselKanitIpucu: "Afetler sonrası yapılan restorasyonlar kültürel mirasın geleceğe aktarılmasını sağlar.",
          sesliMetin: "Yapı 1998 depreminden sonra Vakıflar Genel Müdürlüğü tarafından kapsamlı biçimde restore edilerek geleceğe taşınmıştır."
        },
        {
          id: "baglam",
          kategori: "Tarihsel Bağlam",
          baslik: "8. Ramazanoğlu Külliyesi Bütünlüğü",
          pos: [0, 3.0, -1.5],
          kisaBilgi: "Ulu Cami, Medrese, Ramazanoğlu Konağı (1495), Hamam ve Tuz Hanı ile Adana'nın tarihi çekirdeğini oluşturur.",
          tarihselKanitIpucu: "Dini, eğitim, sivil (konak) ve ticari yapıların bir arada planlandığını gösterir.",
          sesliMetin: "Medrese; hemen yanındaki Ulu Cami ve Türkiye'nin en eski sivil konut örneklerinden biri olan 1495 tarihli Ramazanoğlu Konağı ile bütüncül bir tarih adası oluşturur."
        }
      ],
      karsilastirilabilirEserler: ["amasya-bayezid-kulliyesi", "edirne-bayezid-darussifasi", "istanbul-suleymaniye-camii"],
      kanitTemelliSorular: [
        {
          id: "arm-q1",
          tip: "gorsel_kanit",
          zorluk: "Kolay",
          ilgiliAlan: "Plan ve Kullanım Amacı",
          kanitMetni: "KANIT 1 (Mimari Karşılaştırma): Osmanlı hanlarında (örneğin Koza Han veya Behrampaşa Hanı) avlu etrafında depo/konaklama odaları ve kervan hayvanları için ahır bölümleri bulunur. Adana Ramazanoğlu Medresesi'nde ise ahır ve depo bulunmaz; bunun yerine kitap nişli öğrenci odaları (hücreler) ve doğu kanadında iki kubbeli büyük bir 'dershane salonu' yer alır.",
          soru: "Bu mimari kanıt, dışarıdan bakıldığında birbirine benzeyebilen avlulu yapılardan Ramazanoğlu Medresesi'nin hangi amaçla kullanıldığını kanıtlar?",
          secenekler: [
            "Eğitim ve öğretim (medrese) amacıyla kullanıldığını",
            "Kervanların mal depoladığı gümrük hanı olduğunu",
            "Süvari birliklerinin at yetiştirdiği kışla olduğunu",
            "Sıcak suyla yıkanılan çifte hamam olduğunu"
          ],
          dogruIndeks: 0,
          ipucu: "'3. İki Kubbeli Dershane ve Öğrenci Hücreleri' bilgi noktasını inceleyin.",
          aciklama: "Doğru! Avlulu bir Osmanlı yapısında büyük kubbeli ana 'dershane' salonunun varlığı ve odalardaki kitap nişleri, o yapının eğitim amacıyla (medrese olarak) inşa edildiğini gösteren en temel mimari kanıttır.",
          kanitDosyasiBasligi: "Eğitim İşlevi Kanıtı: Kubbeli Dershane ve Kitap Nişli Hücreler"
        }
      ],
      kaynakca: [
        "Kültür Portalı, 'Ramazanoğlu Medresesi - Adana', T.C. Kültür ve Turizm Bakanlığı.",
        "Çam, Nusret (1988). Adana Ulu Camii Külliyesi, Kültür ve Turizm Bakanlığı Yayınları."
      ],
      ogretmenNotlari: {
        kazanimlar: [
          "Bir yapının eğitim amacıyla (medrese) kullanıldığını gösteren mimari kanıtları (dershane, öğrenci hücreleri, kitap nişleri) ticari yapılardan (han) ayırt eder."
        ],
        etkinlikOnerisi: "Öğrencilerden Amasya II. Bayezid Medresesi ile Adana Ramazanoğlu Medresesi'ni karşılaştırmalarını isteyin."
      }
    },
    {
      id: "manisa-muradiye-camii",
      eserAdi: "Manisa Muradiye Camii ve Külliyesi",
      il: "Manisa",
      ilId: "manisa",
      plaka: "45",
      bolge: "Ege",
      ilce: "Şehzadeler",
      eserTuru: "Cami",
      donem: "Klasik Dönem (1453–1600)",
      yapimYili: "1583–1586 (III. Murad Dönemi)",
      mimar: "Mimar Sinan (Tasarım) / Mimar Mahmud Ağa ve Mehmed Ağa (Uygulama)",
      kullanimDurumu: "Aktif İbadethane ve Manisa Müzesi (Medrese/İmaret)",
      konum: "Muradiye Mahallesi, Şehzadeler / Manisa (38.6085° K, 27.4292° D)",
      kisaAciklama: "Manisa'da sancakbeyliği yapan Sultan III. Murad tarafından 1583–1586 yıllarında Mimar Sinan'ın planıyla inşa ettirilen; Ege Bölgesi'ndeki en görkemli Klasik Osmanlı külliyesidir.",
      ayrintiliAciklama: "Tahta çıkmadan önce Manisa'da şehzadelik yapan Sultan III. Murad adına 1583–1586 yıllarında inşa edilmiştir. Planı Başmimar Sinan tarafından İstanbul'da çizilmiş, inşaatını ise Sinan'ın kalfaları Mimar Mahmud Ağa ve Mimar Mehmed Ağa yürütmüştür. Merkezi kubbeyi üç yönden kuşatan yarım kubbeli (üç eyvanlı) planı, İznik mercan kırmızısı çinileri, altın varaklı kalemişleri ve külliye medresesiyle Ege'deki Osmanlı mimarisinin zirvesidir.",
      modelTipi: "cami",
      modelConfig: {
        baseColor: "#ded2bd",
        domeColor: "#505d68",
        minaretCount: 2,
        centralDomeRadius: 2.2,
        baldachin: "tetragonal"
      },
      kitabeBilgisi: {
        yeri: "Cümle kapısı üzerindeki Hicri 994 (Miladi 1586) tarihli celî sülüs kitabe",
        metinOzeti: "Sultan III. Murad Han'ın emriyle Hicri 991'de (1583) başlanıp Hicri 994'te (1586) tamamlandığı kayıtlıdır.",
        tarihselKanitDegeri: "Mimar Sinan'ın Hacca gitmesi nedeniyle projeyi İstanbul'da çizip uygulama için kalfası Mahmud Ağa'yı Manisa'ya göndermesi, Hassa Mimarlar Ocağı'nın merkezden taşraya proje yönetim sistemini kanıtlar."
      },
      planBilgisi: {
        semaTipi: "Merkezi Kubbeli ve Üç Yönde Yarım Kubbeli (Ters T / Eyvanlı Gelişmiş) Plan",
        mekansalDuzen: "Beş kubbeli son cemaat yeri, merkezde yüksek kasnaklı ana kubbe, mihrap ve iki yan yönde yarım kubbeli üç eyvan, kuzey köşelerde iki minare; yanında medrese, imaret ve sıbyan mektebi.",
        planAciklamasi: "Erken Osmanlı'nın zaviyeli/tabhaneli plan geleneğini Klasik dönemin merkezi kubbe bütünlüğüyle birleştiren özgün bir Mimar Sinan tasarımıdır."
      },
      kullanimAmaci: {
        ilkIslev: "Şehzadeler şehri Manisa'da selatin camii, medrese ve imaret külliyesi.",
        kullaniciKitlesi: "Manisa halkı, şehzade sancağı görevlileri ve medrese öğrencileri."
      },
      bugunkuIslev: {
        guncelKullanim: "Cami ibadete açık; külliyenin medrese ve imaret binaları ise uzun yıllar Manisa Arkeoloji ve Etnografya Müzesi olarak hizmet vermiştir.",
        degisimVeSureklilik: "İbadet ve kültür/müze işlevi 440 yıldır kesintisiz sürmektedir."
      },
      malzemeBilgisi: {
        anaMalzemeler: "Kesme küfeki ve Manisa taşı, kırmızı-beyaz kemer taşları, 16. yüzyıl İznik sıraltı çinileri, ceviz üzerine sedef kakmalı kapılar.",
        yapimTeknigi: "Kesme taş yığma yapı, kurşun kaplı kubbeler ve üstün İznik çini / kalemişi bezeme programı."
      },
      mimariOzellikler: [
        "Mimar Sinan'ın Ege Bölgesi'ndeki tek büyük külliye tasarımı",
        "Mercan kırmızısı ve turkuaz renkli 16. yüzyıl İznik çini alınlıkları",
        "Merkezi kubbeyi üç yönden genişleten yarım kubbeli/eyvanlı harim",
        "İki şerefeli zarif kesme taş minareler",
        "Cami, medrese ve imaretten oluşan külliye bütünlüğü"
      ],
      korunmaDurumu: {
        durum: "Çok İyi Korunmuş",
        restorasyonBilgisi: "Vakıflar Genel Müdürlüğü tarafından restore edilerek özgün çini ve kalemişi bezemeleri korunmuştur."
      },
      tarihselBaglam: {
        donemOzelligi: "Amasya ile birlikte Osmanlı'nın en önemli iki şehzade sancağından biri olan Manisa'nın ('Darü'l-Mülk') 16. yüzyıl sonundaki ihtişamı.",
        sosyoKulturelRol: "İki şehzade sancağı olan Amasya (II. Bayezid Külliyesi) ile Manisa'daki (III. Murad Külliyesi) padişah yatırımlarını karşılaştırma imkânı sunar."
      },
      hotspots: [
        {
          id: "kitabe",
          kategori: "Kitabe",
          baslik: "1. 1586 Tarihli Cümle Kapısı Kitabesi",
          pos: [0, 2.1, 3.8],
          kisaBilgi: "Sultan III. Murad tarafından 1583-1586 yıllarında yaptırıldığını belgeleyen cümle kapısı kitabesi.",
          tarihselKanitIpucu: "Arşivdeki hüküm defterleri, İstanbul'dan Manisa'ya Mimar Mahmud Ağa ve nakkaşların gönderildiğini belgeler.",
          sesliMetin: "Cümle kapısı üzerindeki kitabe 1586 yılını verir. Arşiv belgeleri, Mimar Sinan'ın planı İstanbul'da hazırladığını ve uygulama için kalfalarını Manisa'ya gönderdiğini kanıtlar."
        },
        {
          id: "plan",
          kategori: "Plan",
          baslik: "2. Hassa Mimarlar Ocağı'nın Uzaktan Proje Yönetimi",
          pos: [-2.4, 1.8, 0],
          kisaBilgi: "Mimar Sinan Manisa'ya bizzat gelmeden maket ve plan çizimi göndererek eseri inşa ettirmiştir.",
          tarihselKanitIpucu: "16. yüzyılda Osmanlı'da mimari proje çizimi ve maket kullanımının kurumsallaştığını kanıtlar.",
          sesliMetin: "Bu eser, 16. yüzyılda Hassa Mimarlar Ocağı'nın İstanbul'da çizilen mimari projeleri ve maketleri eyaletlere göndererek standartlara uygun inşaat yürütebildiğini kanıtlar."
        },
        {
          id: "kullanim",
          kategori: "Kullanım Amacı",
          baslik: "3. Şehzadeler Şehri Manisa'nın Selatin Külliyesi",
          pos: [2.4, 1.8, 0],
          kisaBilgi: "Cami, medrese, imaret ve sıbyan mektebiyle Manisa'nın en büyük eğitim ve ibadet külliyesi olarak kurulmuştur.",
          tarihselKanitIpucu: "Amasya gibi Manisa'nın da şehzade sancağı olması nedeniyle padişah külliyeleriyle ödüllendirildiğini gösterir.",
          sesliMetin: "Tıpkı Amasya'da İkinci Bayezid'in yaptığı gibi, Üçüncü Murad da şehzadelik yıllarını geçirdiği Manisa'ya vefa borcu olarak bu görkemli külliyeyi armağan etmiştir."
        },
        {
          id: "bugunku",
          kategori: "Bugünkü İşlev",
          baslik: "4. İbadet ve Müze İşlevi",
          pos: [2.2, 1.0, -2.2],
          kisaBilgi: "Cami ibadete açıkken külliye binaları müze ve kültür merkezi olarak Manisa'nın kültürel hafızasını korumaktadır.",
          tarihselKanitIpucu: "Külliye yapılarının kültür ve müze işleviyle yaşatılması okul dışı öğrenmeyi destekler.",
          sesliMetin: "Günümüzde cami ibadete açık olup külliyenin medrese ve imaret bölümleri Manisa'nın tarihini tanıtan müze ve kültür birimleri olarak işlev görmektedir."
        },
        {
          id: "malzeme",
          kategori: "Malzeme ve Yapı Tekniği",
          baslik: "5. İznik Mercan Kırmızısı Çiniler ve Kesme Taş",
          pos: [-2.2, 2.2, -1.5],
          kisaBilgi: "Mihrap ve pencere alınlıklarındaki kabarık mercan kırmızısı İznik çinileri, 16. yüzyıl seramik teknolojisinin zirvesidir.",
          tarihselKanitIpucu: "İznik çinilerinin saray nakkaşhanesi siparişiyle Manisa'ya gönderildiği arşiv kayıtlarında yer alır.",
          sesliMetin: "Harim duvarlarını süsleyen mercan kırmızısı ve zümrüt yeşili çiniler, doğrudan İznik çini fırınlarında üretilerek Manisa'ya getirilmiştir."
        },
        {
          id: "mimari",
          kategori: "Mimari Özellikler",
          baslik: "6. Üç Eyvanlı Merkezi Kubbe ve Çift Minare",
          pos: [0, 3.6, 0],
          kisaBilgi: "Merkezi kubbeyi doğu, batı ve güney yönlerinde genişleten üç tonozlu/yarım kubbeli eyvan ve kuzeyde iki şerefeli çift minare.",
          tarihselKanitIpucu: "Çift minare kullanımı, Osmanlı'da eserin bir padişah (selatin) yapısı olduğunun mimari göstergesidir.",
          sesliMetin: "Osmanlı mimari protokolünde birden fazla minare yaptırma hakkı kural olarak padişahlara ve hanedan üyelerine aitti. Muradiye'nin çift minaresi onun bir selatin camii olduğunu simgeler."
        },
        {
          id: "korunma",
          kategori: "Korunma Durumu",
          baslik: "7. Kalemişi Nakışlar ve Kündekâri Kapı",
          pos: [0, 1.5, 2.2],
          kisaBilgi: "Saray başnakkaşı Nakkaş Hasan Paşa ekolünü yansıtan altın varaklı kalemişleri ve sedef kakmalı kapılar korunmuştur.",
          tarihselKanitIpucu: "Nakkaşların İstanbul'dan gönderilmesi saray üslubunun taşraya taşındığını kanıtlar.",
          sesliMetin: "Kubbelerdeki kalemişi bezemeler, İstanbul'dan gönderilen saray nakkaşlarının elinden çıkmıştır."
        },
        {
          id: "baglam",
          kategori: "Tarihsel Bağlam",
          baslik: "8. İki Şehzade Sancağı Karşılaştırması: Amasya ve Manisa",
          pos: [-1.8, 0.9, 2.8],
          kisaBilgi: "Amasya II. Bayezid Külliyesi (1486) ile Manisa Muradiye Külliyesi (1586) arasında tam 100 yıl vardır ve iki şehzade şehrinin gelişimini karşılaştırma fırsatı verir.",
          tarihselKanitIpucu: "1486'dan 1586'ya Osmanlı külliye mimarisinin gelişimini iki şehzade şehri üzerinden okumayı sağlar.",
          sesliMetin: "Amasya İkinci Bayezid Külliyesi 1486'da, Manisa Muradiye Külliyesi ise tam yüz yıl sonra 1586'da tamamlanmıştır. İki şehzade sancağındaki bu iki eseri karşılaştırmak, bir asırlık mimari gelişimi anlamak için eşsiz bir fırsattır."
        }
      ],
      karsilastirilabilirEserler: ["amasya-bayezid-kulliyesi", "edirne-selimiye-camii", "istanbul-suleymaniye-camii", "diyarbakir-behram-pasa-camii"],
      kanitTemelliSorular: [
        {
          id: "mm-q1",
          tip: "coktan_secmeli",
          zorluk: "Orta",
          ilgiliAlan: "Tarihsel Bağlam ve Mimarlık Teşkilatı",
          kanitMetni: "KANIT 1 (Arşiv Belgesi): Manisa Muradiye Camii'nin planı Başmimar Sinan tarafından İstanbul'daki Hassa Mimarlar Ocağı'nda çizilmiş, uygulama için kalfası Mimar Mahmud Ağa ve saray nakkaşları İstanbul'dan Manisa'ya gönderilmiştir.",
          soru: "Bu arşiv kanıtı 16. yüzyıl Osmanlı mimarlık teşkilatı hakkında aşağıdakilerden hangisini kanıtlar?",
          secenekler: [
            "Merkezi bir mimarlık teşkilatının (Hassa Mimarlar Ocağı) bulunduğunu ve mimari proje/plan çizimiyle uzaktan inşaat yönetiminin yapılabildiğini",
            "Taşradaki yapıların hiçbir plan çizilmeden rastgele inşa edildiğini",
            "Mimar Sinan'ın yalnızca Edirne'de çalıştığını",
            "Ege Bölgesi'nde hiç taş yapı bulunmadığını"
          ],
          dogruIndeks: 0,
          ipucu: "'2. Hassa Mimarlar Ocağı'nın Uzaktan Proje Yönetimi' bilgi noktasını inceleyin.",
          aciklama: "Doğru! Hassa Mimarlar Ocağı, imparatorluğun farklı illerindeki anıtsal yatırımlar için plan, maket ve keşif defteri hazırlayan gelişmiş bir mühendislik ve mimarlık kurumuydu.",
          kanitDosyasiBasligi: "Kurumsal Mimarlık Kanıtı: Hassa Mimarlar Ocağı Proje Sistemi"
        }
      ],
      kaynakca: [
        "Kültür Portalı, 'Muradiye Camii ve Külliyesi - Manisa', T.C. Kültür ve Turizm Bakanlığı.",
        "Acun, Hakkı (1999). Manisa'da Türk Devri Yapıları, TTK Yayınları."
      ],
      ogretmenNotlari: {
        kazanimlar: [
          "Osmanlı şehzade sancakları olan Amasya ve Manisa'daki padişah külliyelerini tarihsel ve mimari açıdan karşılaştırır."
        ],
        etkinlikOnerisi: "Öğrencilerden Amasya II. Bayezid Külliyesi (1486) ile Manisa Muradiye Külliyesi'ni (1586) karşılaştırma ekranında yan yana incelemelerini isteyin."
      }
    }
  ];

  window.OTTOMAN_MONUMENTS = (window.OTTOMAN_MONUMENTS || []).concat(PART4_MONUMENTS);
})();
