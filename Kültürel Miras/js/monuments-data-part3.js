// MİRAS-3B: Osmanlı Eserleri Veri Tabanı — Bölüm 3 (Bölgelerarası ve Dönemsel Karşılaştırma Seçkisi)
// TÜBİTAK 2204-B Tarih Projesi — Diyarbakır, Konya, Edirne (Köprü), İstanbul (Hamam), Amasya, Erzurum, Manisa, Adana, Şanlıurfa, Kastamonu

(function () {
  const PART3_MONUMENTS = [
    {
      id: "diyarbakir-behram-pasa-camii",
      eserAdi: "Diyarbakır Behram Paşa Camii",
      il: "Diyarbakır",
      ilId: "diyarbakir",
      plaka: "21",
      bolge: "Güneydoğu Anadolu",
      ilce: "Sur",
      eserTuru: "Cami",
      donem: "Klasik Dönem (1453–1600)",
      yapimYili: "1564–1572 (Kanuni / II. Selim Dönemi)",
      mimar: "Mimar Sinan (Tasarım)",
      kullanimDurumu: "Aktif İbadethane ve Kültür Mirası",
      konum: "Ziya Gökalp Mahallesi, Sur / Diyarbakır (37.9112° K, 40.2335° D)",
      kisaAciklama: "Mimar Sinan'ın merkezi tek kubbeli klasik Osmanlı cami tasarımının, Diyarbakır'ın yerel siyah bazalt ve beyaz kalker taşı işçiliğiyle (almaşık taş örgüsü) sentezlendiği 1572 tarihli başyapıttır.",
      ayrintiliAciklama: "Diyarbakır Beylerbeyi Behram Paşa tarafından 1564–1572 yılları arasında yaptırılan ve Mimar Sinan'ın tezkirelerinde kayıtlı olan eser, merkez-taşra mimari etkileşiminin en güçlü örneğidir. İstanbul'dan gönderilen klasik tek kubbeli ve çift son cemaat yerli plan şeması, Diyarbakırlı taş ustalarının asırlık siyah bazalt ve beyaz kalker almaşık taş örgüsü, mukarnaslı sütun başlıkları ve geometrik taş kakma sanatıyla birleşmiştir.",
      modelTipi: "cami",
      modelConfig: {
        baseColor: "#d9d2c5",
        alternateStoneColor: "#2f3338",
        domeColor: "#4b5661",
        minaretCount: 1,
        centralDomeRadius: 2.2,
        baldachin: "striped"
      },
      kitabeBilgisi: {
        yeri: "Cümle kapısı üzerindeki Hicri 980 (1572) tarihli Arapça sülüs kitabe",
        metinOzeti: "Yemen fatihi Mustafa Paşa'nın oğlu Diyarbakır Valisi Behram Paşa tarafından Hicri 980 (Miladi 1572/73) yılında tamamlandığı yazılıdır.",
        tarihselKanitDegeri: "Hem Sivas Behrampaşa Hanı hem Diyarbakır Behram Paşa Camii kitabe/vakfiyelerinde aynı baninin adının geçmesi, Osmanlı bürokratlarının Anadolu'nun farklı bölgelerinde imar faaliyeti yürüttüğünü kanıtlar."
      },
      planBilgisi: {
        semaTipi: "Tek Kubbeli, Çift Revaklı Son Cemaat Yerli Klasik Plan",
        mekansalDuzen: "Önde sekiz köşeli abdest şadırvanı, beş kubbeli iç ve sundurmalı dış son cemaat yeri (çift revak), tromplarla geçilen 15,9 m çapında tek kubbeli kare harim.",
        planAciklamasi: "Çift son cemaat yeri, Diyarbakır'ın yakıcı yaz güneşine karşı cemaat için geniş ve gölgeli bir yarı-açık ibadet alanı oluşturur."
      },
      kullanimAmaci: {
        ilkIslev: "Diyarbakır Sur içinde Cuma ve vakit namazlarının kılındığı merkez camii.",
        kullaniciKitlesi: "Diyarbakır halkı, eyalet divanı üyeleri ve İpek/Baharat yolu tüccarları."
      },
      bugunkuIslev: {
        guncelKullanim: "Aktif ibadethane ve tarihi Sur içi kültür rotası durağı.",
        degisimVeSureklilik: "454 yıldır özgün ibadet işlevini ve siyah-beyaz taş dokusunu kesintisiz sürdürmektedir."
      },
      malzemeBilgisi: {
        anaMalzemeler: "Karacadağ siyah bazalt taşı, beyaz kalker taşı, kurşun kubbe kaplaması, 16. yüzyıl çini kaplamaları ve ceviz kündekâri kapı/minber.",
        yapimTeknigi: "Bir sıra siyah bazalt, bir sıra beyaz kalker taşından oluşan 'cizye/almaşık taş örgü' tekniği."
      },
      mimariOzellikler: [
        "Siyah bazalt ve beyaz kalker taşlı almaşık (iki renkli) cephe ve minare",
        "İklim koşullarına uygun çift revaklı (10 sütunlu) son cemaat yeri",
        "15,9 metre çapında merkezi tek kubbe",
        "Sekiz sütunlu, sivri kemerli ve piramidal çatılı avlu şadırvanı",
        "İç mekânda taş işçiliği ile İznik/Diyarbakır çinilerinin uyumu"
      ],
      korunmaDurumu: {
        durum: "Çok İyi Korunmuş",
        restorasyonBilgisi: "1929 yılında yıldırım düşmesi sonucu zarar gören minaresi ve 2016 sonrasında cephe/çatı bölümleri Vakıflar Genel Müdürlüğü tarafından aslına uygun onarılmıştır."
      },
      tarihselBaglam: {
        donemOzelligi: "16. yüzyılda Diyarbakır'ın Osmanlı'nın Doğu ve Güneydoğu'daki en stratejik eyalet merkezi (Amid Beylerbeyliği) olduğu dönem.",
        sosyoKulturelRol: "Başkent İstanbul'un mimari planı (Mimar Sinan) ile Diyarbakır'ın yerel taş ustalığının nasıl uyum içinde bütünleştiğini kanıtlar."
      },
      hotspots: [
        {
          id: "kitabe",
          kategori: "Kitabe",
          baslik: "1. 1572 Tarihli Cümle Kapısı Kitabesi ve Behram Paşa",
          pos: [0, 2.1, 3.8],
          kisaBilgi: "Giriş kapısı üzerindeki kitabe, eserin 1572 yılında Diyarbakır Beylerbeyi Behram Paşa tarafından tamamlandığını belgeler.",
          tarihselKanitIpucu: "Sivas'taki Behrampaşa Hanı ile bu caminin aynı devlet adamı tarafından yaptırılması, bölgelerarası vakıf bağını kanıtlar.",
          sesliMetin: "Caminin ana kapısı üzerindeki kitabe Hicri 980 yani Miladi 1572 yılını verir. Yapının banisi Behram Paşa, aynı yıllarda Sivas'ta da ünlü Behrampaşa Hanı'nı inşa ettirmiştir."
        },
        {
          id: "plan",
          kategori: "Plan",
          baslik: "2. Mimar Sinan'ın Tek Kubbeli ve Çift Revaklı Planı",
          pos: [-2.2, 1.8, 1.5],
          kisaBilgi: "Mimar Sinan'ın başkentten gönderdiği merkezi tek kubbeli plan, sıcak iklime uygun çift kademeli son cemaat revakıyla birleştirilmiştir.",
          tarihselKanitIpucu: "Mimar Sinan'ın Tezkiretü'l-Ebniye adlı eserinde bu caminin adının yer alması, planın Hassa Mimarlar Ocağı'ndan çıktığının yazılı kanıtıdır.",
          sesliMetin: "Caminin planı Mimar Sinan tarafından tasarlanmıştır. Ön cephedeki çift sıra revaklı son cemaat yeri, Diyarbakır'ın sıcak yaz günlerinde cemaate serin ve gölgeli bir ibadet alanı sunar."
        },
        {
          id: "kullanim",
          kategori: "Kullanım Amacı",
          baslik: "3. Eyalet Merkezinde Cuma Camii İşlevi",
          pos: [0, 3.6, -0.5],
          kisaBilgi: "Osmanlı'nın en önemli eyalet merkezlerinden biri olan Diyarbakır'da ibadet ve toplumsal buluşma mekânı olarak inşa edilmiştir.",
          tarihselKanitIpucu: "Geniş son cemaat yeri ve şadırvanlı avlusu, kalabalık Cuma cemaatini ağırlamak üzere planlandığını gösterir.",
          sesliMetin: "Behram Paşa Camii, 16. yüzyılda önemli bir idari ve ticari merkez olan Diyarbakır'ın en görkemli Osmanlı selatin/vezir camisi olarak inşa edilmiştir."
        },
        {
          id: "bugunku",
          kategori: "Bugünkü İşlev",
          baslik: "4. Sur İçinin Yaşayan Mimarlık Anıtı",
          pos: [2.5, 1.0, 2.2],
          kisaBilgi: "Evliya Çelebi'nin 'Diyarbakır'ın en aydınlık ve ferah camisi' diye övdüğü yapı, bugün de ibadete açık bir kültür mirasıdır.",
          tarihselKanitIpucu: "450 yılı aşkın süredir kesintisiz ibadethane olarak kullanılması tarihsel sürekliliğin kanıtıdır.",
          sesliMetin: "Evliya Çelebi'nin hayranlıkla anlattığı Behram Paşa Camii, dört buçuk asırdır Diyarbakır Sur içinde hem ibadet hem de mimari miras işlevini sürdürmektedir."
        },
        {
          id: "malzeme",
          kategori: "Malzeme ve Yapı Tekniği",
          baslik: "5. Siyah Bazalt ve Beyaz Kalker Taşı (İki Renkli Örgü)",
          pos: [-2.4, 2.2, -1.2],
          kisaBilgi: "Karacadağ'dan çıkarılan sert siyah bazalt taşı ile beyaz kalker taşının sıra sıra dizilmesi, Güneydoğu Anadolu taş mimarisinin imzasıdır.",
          tarihselKanitIpucu: "İstanbul/Edirne'deki küfeki taşı yerine burada siyah bazalt ve beyaz kalker kullanılması, yerel malzemenin klasik planla sentezlendiğini kanıtlar.",
          sesliMetin: "Duvarlara ve kemerlere baktığınızda bir sıra siyah bazalt, bir sıra beyaz kalker taşı kullanıldığını görürsünüz. Bu teknik, Mimar Sinan'ın merkezi planının Diyarbakır'ın yerel taş geleneğiyle nasıl bütünleştiğini kanıtlar."
        },
        {
          id: "mimari",
          kategori: "Mimari Özellikler",
          baslik: "6. Mukarnaslı Sütun Başlıkları, Şadırvan ve Tek Minare",
          pos: [2.4, 3.2, 1.2],
          kisaBilgi: "Avludaki sekiz sütunlu şadırvan, burmalı ve mukarnaslı sütunlar ile siyah-beyaz kuşaklı tek şerefeli minare.",
          tarihselKanitIpucu: "Minare gövdesinin bile siyah-beyaz taş kuşaklarla örülmesi, bölgesel estetik kimliğin korunduğunu gösterir.",
          sesliMetin: "Avludaki sekiz sütunlu şadırvan ve arkasında yükselen siyah-beyaz kuşaklı minare, Diyarbakır taş işçiliğinin ulaştığı zarafeti gözler önüne serer."
        },
        {
          id: "korunma",
          kategori: "Korunma Durumu",
          baslik: "7. Kündekâri Kapı ve Çini Panoların Korunumu",
          pos: [0, 1.5, -2.5],
          kisaBilgi: "Harim duvarlarındaki 16. yüzyıl çinileri ve ceviz ağacından kündekâri kapı kanatları özenle korunmuştur.",
          tarihselKanitIpucu: "Taş mimarinin sağlamlığı sayesinde kubbe ve beden duvarları 1572'den bu yana özgün yapısını korumuştur.",
          sesliMetin: "Sert bazalt taşının dayanıklılığı sayesinde caminin beden duvarları ve kubbesi 16. yüzyıldan günümüze sağlam biçimde ulaşmıştır."
        },
        {
          id: "baglam",
          kategori: "Tarihsel Bağlam",
          baslik: "8. Merkez (İstanbul) ve Eyalet (Diyarbakır) Sentezi",
          pos: [-1.8, 0.9, 3.2],
          kisaBilgi: "Osmanlı mimarisinin yerel kültürleri yok etmeyip, merkezi planı yerel malzeme ve ustalıkla zenginleştirdiğinin en parlak örneğidir.",
          tarihselKanitIpucu: "Edirne Selimiye (küfeki taşı) ile Diyarbakır Behram Paşa (bazalt-kalker) karşılaştırıldığında plan benzerliği ve malzeme çeşitliliği net biçimde görülür.",
          sesliMetin: "Bu eser bize çok önemli bir tarihsel ders verir: Osmanlı klasik mimarisi Anadolu ve Mezopotamya'nın yerel taş geleneklerini bastırmamış, aksine onlarla birleşerek zenginleşmiştir."
        }
      ],
      karsilastirilabilirEserler: ["edirne-selimiye-camii", "istanbul-suleymaniye-camii", "diyarbakir-hasan-pasa-hani", "sivas-behrampasa-hani"],
      kanitTemelliSorular: [
        {
          id: "dbp-q1",
          tip: "gorsel_kanit",
          zorluk: "Orta",
          ilgiliAlan: "Malzeme ve Bölgesel Karşılaştırma",
          kanitMetni: "KANIT 1 (Karşılaştırmalı Gözlem): Mimar Sinan'ın Edirne ve İstanbul'daki camilerinde açık renkli küfeki taşı kullanılırken, yine Mimar Sinan'ın eser listesinde yer alan Diyarbakır Behram Paşa Camii'nde Karacadağ siyah bazalt taşı ile beyaz kalker taşı nöbetleşe (almaşık) kullanılmıştır.",
          soru: "Bu mimari kanıttan hareketle Klasik Dönem Osmanlı mimarisi hakkında hangi çıkarıma ulaşılabilir?",
          secenekler: [
            "Merkezi plan anlayışının korunduğu, ancak yapım malzemesi ve cephe bezemesinde her bölgenin yerel taş ve ustalık geleneğine uyum sağlandığı",
            "Diyarbakır'daki caminin Mimar Sinan'dan habersiz ve plansız yapıldığı",
            "Bütün taşların İstanbul'dan Diyarbakır'a gemiyle taşındığı",
            "Güneydoğu Anadolu'da taş işçiliğinin hiç gelişmediği"
          ],
          dogruIndeks: 0,
          ipucu: "'5. Siyah Bazalt ve Beyaz Kalker Taşı' ve '8. Merkez ve Eyalet Sentezi' noktalarını inceleyin.",
          aciklama: "Harika! Klasik Osmanlı mimarisi, başkentten gönderilen plan şemasını yerel coğrafyanın malzemesi (siyah bazalt-beyaz kalker) ve taş ustalarının birikimiyle sentezlemiştir.",
          kanitDosyasiBasligi: "Merkez-Taşra Sentezi Kanıtı: Siyah Bazalt ve Klasik Plan"
        }
      ],
      kaynakca: [
        "Kültür Portalı, 'Behram Paşa Camii - Diyarbakır', T.C. Kültür ve Turizm Bakanlığı.",
        "Sözen, Metin (1971). Diyarbakır'da Türk Mimarisi, İstanbul.",
        "Kuban, Doğan (2007). Osmanlı Mimarisi, YEM Yayınları."
      ],
      ogretmenNotlari: {
        kazanimlar: [
          "Merkez (İstanbul/Edirne) ile eyalet (Diyarbakır) arasındaki mimari etkileşimi plan ve malzeme kanıtlarıyla karşılaştırır."
        ],
        etkinlikOnerisi: "Öğrencilerden aynı baninin (Behram Paşa) Sivas'ta yaptırdığı Behrampaşa Hanı ile Diyarbakır'da yaptırdığı Behram Paşa Camii'ni karşılaştırmalarını isteyin."
      }
    },
    {
      id: "diyarbakir-hasan-pasa-hani",
      eserAdi: "Diyarbakır Hasan Paşa Hanı",
      il: "Diyarbakır",
      ilId: "diyarbakir",
      plaka: "21",
      bolge: "Güneydoğu Anadolu",
      ilce: "Sur",
      eserTuru: "Han",
      donem: "Klasik Dönem (1453–1600)",
      yapimYili: "1572–1575 (II. Selim / III. Murad Dönemi)",
      mimar: "16. Yüzyıl Diyarbakır Taş Ustaları",
      kullanimDurumu: "Yaşayan Kültürel ve Sosyal Mekân",
      konum: "Ulu Cami Karşısı, Gazi Caddesi, Sur / Diyarbakır (37.9128° K, 40.2369° D)",
      kisaAciklama: "Sokullu Mehmed Paşa'nın oğlu Diyarbakır Beylerbeyi Vezirzade Hasan Paşa tarafından 1572–1575 yıllarında Ulu Cami'nin karşısına yaptırılan; siyah-beyaz çizgili taş cephesi ve kubbeli şadırvanıyla ünlü iki katlı şehir hanıdır.",
      ayrintiliAciklama: "Diyarbakır Beylerbeyi Hasan Paşa tarafından 1572-1575 yılları arasında inşa ettirilen han, Ulu Cami'nin doğu girişinin tam karşısında yer alır. Bodrum (ahır) katı üzerinde yükselen iki katlı revaklı avlusu, siyah bazalt ve beyaz kalker taşından örülmüş çizgili cepheleri ve avlu ortasındaki altı sütunlu kubbeli şadırvanıyla Güneydoğu Anadolu han mimarisinin başyapıtıdır.",
      modelTipi: "han",
      modelConfig: {
        baseColor: "#ded6c6",
        brickColor: "#2d3136",
        roofColor: "#505a63",
        hasKioskMasjid: true,
        floors: 2,
        courtyardRatio: 0.64,
        archCountX: 7,
        archCountZ: 5
      },
      kitabeBilgisi: {
        yeri: "Batı ve güney taçkapıları üzerindeki sülüs kitabeler (Hicri 981 ve 983 / Miladi 1573–1575)",
        metinOzeti: "Sokullu Mehmed Paşa'nın büyük oğlu Beylerbeyi Hasan Paşa tarafından 1572'de başlatılıp 1575'te tamamlandığı üç ayrı kitabede kayıtlıdır.",
        tarihselKanitDegeri: "Üç cephesinde yer alan kitabeler, yapının başlangıç ve bitiş tarihlerini kesin olarak belgeleyen birincil epigrafik kanıtlardır."
      },
      planBilgisi: {
        semaTipi: "Bodrum Ahır Katlı, İki Katlı Revaklı Avlulu ve Şadırvanlı Şehir Hanı",
        mekansalDuzen: "Alt kotta 500 hayvan kapasiteli tonozlu ahır katı; zemin ve birinci katta dikdörtgen avluyu çevreleyen revaklı odalar ve ortada altı sütunlu şadırvan.",
        planAciklamasi: "Ahır bölümünün bodrum kota alınması sayesinde avlu ve üst katlar tamamen tüccarların temiz ve ferah ticaret/konaklama kullanımına ayrılmıştır."
      },
      kullanimAmaci: {
        ilkIslev: "Musul-Bağdat-Halep-Tebriz-İstanbul ticaret yollarının kesişimindeki Diyarbakır'da uluslararası tüccarların konaklama ve ticaret merkezi.",
        kullaniciKitlesi: "İpek, baharat ve bakır tüccarları, seyyahlar (1611'de Polonyalı Simeon dahil)."
      },
      bugunkuIslev: {
        guncelKullanim: "Geleneksel el sanatları, gümüş/telkari dükkânları, kitapçılar ve yöresel gastronomi/kültür alanı.",
        degisimVeSureklilik: "Tarihi ticaret ve buluşma işlevi, günümüzde kültür turizmi ve sosyal buluşma mekânı olarak kesintisiz sürmektedir."
      },
      malzemeBilgisi: {
        anaMalzemeler: "Karacadağ siyah bazalt taşı ve beyaz kalker taşı, demir pencere şebekeleri.",
        yapimTeknigi: "Siyah ve beyaz kesme taşların yatay kuşaklar halinde dizildiği almaşık taş örgü ve mukarnaslı kemer işçiliği."
      },
      mimariOzellikler: [
        "Siyah bazalt ve beyaz kalker taşından yatay çizgili (almaşık) revak ve cepheler",
        "Avlu ortasında altı mermer sütunlu ve kubbeli abdest/serinleme şadırvanı",
        "Alt kotta 500 binek hayvanı kapasiteli tonozlu ahır bölümü",
        "Üç ayrı cephede kitabeli anıtsal giriş kapıları",
        "Dış cephede Gazi Caddesi'ne bakan sıra dükkânlar"
      ],
      korunmaDurumu: {
        durum: "Çok İyi Korunmuş (Aktif Kullanımda)",
        restorasyonBilgisi: "2005-2009 yılları arasında Vakıflar Genel Müdürlüğü tarafından restore edilerek özgün taş dokusuyla kentin en canlı kültür mekânlarından biri haline getirilmiştir."
      },
      tarihselBaglam: {
        donemOzelligi: "16. yüzyılın ikinci yarısında Diyarbakır'ın Halep ve Bağdat ile birlikte Doğu ticaretinin en zengin merkezlerinden biri olduğu dönem.",
        sosyoKulturelRol: "Hemen karşısındaki Ulu Cami ile birlikte Diyarbakır kent merkezinde ibadet ve ticaretin yan yana yürüdüğü klasik İslam-Osmanlı şehir modelini temsil eder."
      },
      hotspots: [
        {
          id: "kitabe",
          kategori: "Kitabe",
          baslik: "1. Batı Taçkapısı ve 1575 Tarihli Kitabe",
          pos: [0, 2.2, 4.3],
          kisaBilgi: "Gazi Caddesi'ne açılan ana taçkapı üzerindeki sülüs kitabe, yapının Sokullu Mehmed Paşa'nın oğlu Hasan Paşa tarafından 1575'te tamamlandığını yazar.",
          tarihselKanitIpucu: "Yapıda üç ayrı kitabenin bulunması, inşa sürecinin evrelerini takip etmeyi sağlar.",
          sesliMetin: "Hasan Paşa Hanı'nın batı taçkapısı üzerindeki kitabe, eserin Sadrazam Sokullu Mehmed Paşa'nın oğlu Diyarbakır Beylerbeyi Hasan Paşa tarafından 1575 yılında tamamlandığını belgeler."
        },
        {
          id: "plan",
          kategori: "Plan",
          baslik: "2. Bodrum Ahır Katı ve İki Katlı Avlu Planı",
          pos: [-3.2, 1.6, 0],
          kisaBilgi: "Kervan hayvanları için alt kotta ayrı bir tonozlu ahır katı yapılmış, böylece zemin ve üst kat avlusu tamamen insanlara ve ticarete ayrılmıştır.",
          tarihselKanitIpucu: "Ahırların alt kota alınması, şehir merkezindeki handa hijyen ve gürültü kontrolü sağlandığının mimari kanıtıdır.",
          sesliMetin: "Sivas Behrampaşa Hanı'nda ahırlar yan blokta yer alırken, Diyarbakır Hasan Paşa Hanı'nda 500 hayvan kapasiteli ahır bölümü bodrum kata yerleştirilmiş, böylece avlu tamamen temiz ve ferah kalmıştır."
        },
        {
          id: "kullanim",
          kategori: "Kullanım Amacı",
          baslik: "3. Seyyah Polonyalı Simeon'un Kayıtlarında Hasan Paşa Hanı",
          pos: [3.2, 1.6, 0],
          kisaBilgi: "1611'de Diyarbakır'a gelen Polonyalı Simeon, hanın büyüklüğünü, üç katlı yapısını ve 500 beygirlik ahırlarını hayranlıkla kaydetmiştir.",
          tarihselKanitIpucu: "Yabancı bir seyyahın gözlemleri, hanın uluslararası ticaret ağındaki önemini doğrulayan bağımsız yazılı kanıttır.",
          sesliMetin: "1611 yılında Diyarbakır'ı ziyaret eden Polonyalı seyyah Simeon, seyahatnamesinde Hasan Paşa Hanı'nın görkemli taş işçiliğini ve yüzlerce kervan hayvanını barındıran kapasitesini övgüyle anlatmıştır."
        },
        {
          id: "bugunku",
          kategori: "Bugünkü İşlev",
          baslik: "4. Yaşayan Kültür ve Sosyal Buluşma Alanı",
          pos: [2.2, 0.8, -2.4],
          kisaBilgi: "Günümüzde kitapçıları, el sanatları atölyeleri ve avlusuyla Diyarbakır'ın en canlı kültür ve turizm noktalarından biridir.",
          tarihselKanitIpucu: "450 yıldır insanların buluştuğu bir kamusal mekân olması, sosyal sürekliliğin kanıtıdır.",
          sesliMetin: "Hasan Paşa Hanı bugün de yerli ve yabancı ziyaretçilerin buluştuğu, tarihi dokunun günlük yaşamla iç içe geçtiği canlı bir kültür merkezidir."
        },
        {
          id: "malzeme",
          kategori: "Malzeme ve Yapı Tekniği",
          baslik: "5. Siyah Bazalt ve Beyaz Kalker Taşı İşçiliği",
          pos: [-3.2, 2.3, -3.0],
          kisaBilgi: "Aynı ildeki Behram Paşa Camii gibi burada da volkanik siyah bazalt taşı ile beyaz kalker taşı yatay şeritler halinde kullanılmıştır.",
          tarihselKanitIpucu: "Aynı şehirdeki cami ve handa aynı siyah-beyaz taş tekniğinin kullanılması, yerel mimari kimliği kanıtlar.",
          sesliMetin: "Diyarbakır'daki Behram Paşa Camii ile Hasan Paşa Hanı'nı karşılaştırdığınızda, her iki yapıda da şehrin imzası olan siyah bazalt ve beyaz kalker taşının kullanıldığını görürsünüz."
        },
        {
          id: "mimari",
          kategori: "Mimari Özellikler",
          baslik: "6. Avlu Ortasındaki Kubbeli Şadırvan",
          pos: [0, 2.2, 0],
          kisaBilgi: "Avlunun merkezinde altı sütun üzerine oturan, kurşun kubbeli şadırvan hem abdest alma yeri hem de sıcak Diyarbakır günlerinde serinleme noktasıdır.",
          tarihselKanitIpucu: "Sıcak iklim kuşağındaki hanların avlu merkezinde su ögesinin (şadırvan/havuz) bulunması, mikroklima tasarımının kanıtıdır.",
          sesliMetin: "Avlunun ortasındaki kubbeli şadırvan, Diyarbakır'ın sıcak yaz aylarında su sesi ve buharlaşma yoluyla avlu içinde doğal bir serinlik sağlar."
        },
        {
          id: "korunma",
          kategori: "Korunma Durumu",
          baslik: "7. Özgün Taş Kemerlerin ve Tonozların Korunumu",
          pos: [0, 2.8, -4.1],
          kisaBilgi: "Sert bazalt taşından örülen taşıyıcı ayaklar ve kemerler 450 yıl boyunca aşınmadan günümüze ulaşmıştır.",
          tarihselKanitIpucu: "Bazalt taşının yüksek sertlik derecesi, yapının fiziksel ömrünü uzatan temel faktördür.",
          sesliMetin: "Karacadağ bazaltının olağanüstü sağlamlığı sayesinde hanın sütunları, kemerleri ve taş merdivenleri yüzyıllara meydan okumuştur."
        },
        {
          id: "baglam",
          kategori: "Tarihsel Bağlam",
          baslik: "8. Ulu Cami Karşısında Ticaret ve İbadet Aksı",
          pos: [-2.0, 0.8, 3.0],
          kisaBilgi: "Anadolu'nun en eski camilerinden Diyarbakır Ulu Camii'nin hemen karşısında yer alarak şehrin dini ve ticari kalbini birleştirmiştir.",
          tarihselKanitIpucu: "Ulu Cami ile Hasan Paşa Hanı'nın karşılıklı konumu, İslam-Osmanlı şehir merkezlerinde cami ve çarşı/han bütünlüğünü kanıtlar.",
          sesliMetin: "Hasan Paşa Hanı, tarihi Ulu Cami'nin tam karşısında konumlanarak Diyarbakır'ın dini merkezi ile ticari merkezini tek bir meydanda buluşturmuştur."
        }
      ],
      karsilastirilabilirEserler: ["diyarbakir-behram-pasa-camii", "bursa-koza-han", "sivas-behrampasa-hani", "tokat-tashan"],
      kanitTemelliSorular: [
        {
          id: "dhp-q1",
          tip: "gorsel_kanit",
          zorluk: "Orta",
          ilgiliAlan: "Aynı İldeki Eserler Arası Karşılaştırma",
          kanitMetni: "KANIT 1 (Aynı İl Karşılaştırması): Diyarbakır'da 1572'de tamamlanan Behram Paşa Camii ile 1575'te tamamlanan Hasan Paşa Hanı incelendiğinde; birinin ibadet (tek kubbeli cami), diğerinin ticaret/konaklama (iki katlı avlulu han) işlevi taşıdığı, ancak her ikisinde de siyah bazalt ve beyaz kalker taşından çizgili (almaşık) duvar tekniği ve avlu şadırvanı kullanıldığı görülmektedir.",
          soru: "Aynı ildeki bu iki farklı tür Osmanlı eserinin karşılaştırılmasından aşağıdaki sonuçlardan hangisine ulaşılır?",
          secenekler: [
            "Yapıların işlevleri (ibadet ve ticaret) plan şemalarını farklılaştırırken, bulundukları şehrin iklimi ve yerel taş malzemesinin ortak bir bölgesel üslup yarattığına",
            "Cami ve hanın birebir aynı plan şemasına sahip olduğuna",
            "Diyarbakır'da yalnızca ticari yapıların inşa edildiğine",
            "Malzeme seçiminin coğrafyayla hiçbir ilgisi olmadığına"
          ],
          dogruIndeks: 0,
          ipucu: "'5. Siyah Bazalt ve Beyaz Kalker Taşı İşçiliği' bilgi noktasını ve Karşılaştırma Ekranını inceleyin.",
          aciklama: "Harika! Aynı ildeki iki farklı tür eseri karşılaştırdığımızda; işlevin planı belirlediğini (tek kubbeli harim vs odalı avlu), ancak coğrafya ve yerel malzemenin ortak bir mimari kimlik oluşturduğunu görürüz.",
          kanitDosyasiBasligi: "İl İçi Karşılaştırma Kanıtı: İşlev Farkı ve Malzeme Birliği"
        }
      ],
      kaynakca: [
        "Kültür Portalı, 'Hasan Paşa Hanı - Diyarbakır', T.C. Kültür ve Turizm Bakanlığı.",
        "Sözen, Metin (1971). Diyarbakır'da Türk Mimarisi.",
        "Andreasyan, Hrand D. (1964). Polonyalı Simeon'un Seyahatnamesi (1608-1619)."
      ],
      ogretmenNotlari: {
        kazanimlar: [
          "Aynı ildeki iki farklı Osmanlı eserini (Behram Paşa Camii ve Hasan Paşa Hanı) işlev ve mimari açıdan karşılaştırır."
        ],
        etkinlikOnerisi: "Öğrencilerden Karşılaştırma Ekranında 'Aynı İldeki Eserler' filtresini seçerek Diyarbakır Behram Paşa Camii ile Hasan Paşa Hanı'nı yan yana incelemelerini isteyin."
      }
    },
    {
      id: "konya-aziziye-camii",
      eserAdi: "Konya Aziziye Camii",
      il: "Konya",
      ilId: "konya",
      plaka: "42",
      bolge: "İç Anadolu",
      ilce: "Karatay",
      eserTuru: "Cami",
      donem: "Geç Osmanlı / Batılılaşma (1730–1922)",
      yapimYili: "1872–1874 (Sultan Abdülaziz Dönemi)",
      mimar: "Geç Dönem Osmanlı Mimarları",
      kullanimDurumu: "Aktif İbadethane (Tarihi Çarşı Merkezi)",
      konum: "Aziziye Mahallesi, Bedesten Çarşısı, Karatay / Konya (37.8714° K, 32.5018° D)",
      kisaAciklama: "Sultan Abdülaziz ve annesi Pertevniyal Valide Sultan'ın katkılarıyla 1874'te inşa edilen; şadırvanlı ikiz minareleri, camiden bile büyük devasa pencereleri ve Barok-Ampir-Klasik sentezli mimarisiyle Geç Dönem Osmanlı camilerinin Anadolu'daki en özgün örneğidir.",
      ayrintiliAciklama: "1671'de Şeyh Ahmed Efendi tarafından yaptırılan ilk caminin 1867 Konya Çarşı yangınında yanması üzerine, Sultan Abdülaziz ve annesi Pertevniyal Valide Sultan adına 1872–1874 yıllarında tamamen kesme Gödene taşından yeniden inşa edilmiştir. Türk mimarlık tarihinde minare kürsülerinin şadırvan olarak tasarlandığı (şadırvanlı ikiz minare) tek camidir. Kapılardan daha büyük tutulan yuvarlak kemerli pencereleri ve Barok-Rokoko-Ampir üslubu taş oymalarıyla 19. yüzyıl Geç Osmanlı mimarisini temsil eder.",
      modelTipi: "cami",
      modelConfig: {
        baseColor: "#d9c2a3",
        domeColor: "#546373",
        minaretCount: 2,
        centralDomeRadius: 2.1,
        baldachin: "baroque"
      },
      kitabeBilgisi: {
        yeri: "Kuzey giriş kapısı üzerindeki altın varaklı talik kitabe",
        metinOzeti: "1867 yangınından sonra Sultan Abdülaziz Han döneminde Hicri 1291 (Miladi 1874) yılında yeniden inşa edildiği kayıtlıdır.",
        tarihselKanitDegeri: "Kitabe ve Konya Salnameleri, 19. yüzyılda bir Anadolu şehrinde yangın sonrası çarşı ve caminin merkezi hükümet desteğiyle nasıl modernleştirilerek ihya edildiğini kanıtlar."
      },
      planBilgisi: {
        semaTipi: "Tek Kubbeli, Üç Kubbeli Son Cemaat Yerli ve Şadırvan Kürsülü İkiz Minareli Plan",
        mekansalDuzen: "Kare planlı, sekizgen kasnaklı tek kubbeli harim; kuzeyde altı mermer sütunlu son cemaat yeri ve iki uçta alt kısmı altıgen kubbeli şadırvan olan ikiz minareler.",
        planAciklamasi: "Yoğun Konya Çarşısı içinde bağımsız bir avlu şadırvanı için yer darlığı bulunduğundan, mimar dahiyane bir çözümle şadırvanları iki minarenin kaidesine (kürsüsüne) yerleştirmiştir."
      },
      kullanimAmaci: {
        ilkIslev: "Konya Bedesten ve Çarşı esnafının merkez ibadethanesi.",
        kullaniciKitlesi: "Konya çarşı esnafı, tüccarlar ve şehir halkı."
      },
      bugunkuIslev: {
        guncelKullanim: "Aktif ibadethane ve Konya Tarihi Bedesten Çarşısı'nın simge yapısı.",
        degisimVeSureklilik: "1874'ten bu yana Konya çarşısının kalbinde ibadet ve su (minare altı şadırvan) işlevini kesintisiz sürdürmektedir."
      },
      malzemeBilgisi: {
        anaMalzemeler: "Sarımtırak Gödene kesme taşı, gözenekli hafif Sille taşı (kubbe), kurşun kaplama ve mermer sütunlar.",
        yapimTeknigi: "Tamamen kesme taş yığma sistem; yangına karşı ahşap yerine kagir kubbe ve taş minare kullanımı."
      },
      mimariOzellikler: [
        "Minare kaidelerinin şadırvan olarak tasarlandığı benzersiz 'Şadırvanlı İkiz Minareler'",
        "Kapılardan daha büyük boyutlu, bol ışık sağlayan devasa Barok pencereler",
        "Türk Barok, Rokoko ve Ampir üslubunda S ve C kıvrımlı taş kabartmalar",
        "Yivli (dilimli) gövdeli ve akantus yapraklı şerefeli minareler",
        "Altı mermer sütunlu ve üç kubbeli anıtsal son cemaat revakı"
      ],
      korunmaDurumu: {
        durum: "Çok İyi Korunmuş (Aktif Kullanımda)",
        restorasyonBilgisi: "1867 yangınından ders alınarak tamamen kagir (taş) yapıldığı için günümüze hiçbir yangın hasarı almadan ulaşmıştır."
      },
      tarihselBaglam: {
        donemOzelligi: "19. yüzyıl Tanzimat ve Sultan Abdülaziz dönemi; Osmanlı mimarisinin klasik oranları Avrupa Barok ve Ampir bezemeleriyle sentezlediği dönem.",
        sosyoKulturelRol: "16. yüzyıl Klasik Dönem camileri (Selimiye, Süleymaniye) ile 19. yüzyıl Geç Dönem camileri arasındaki üslup ve aydınlatma değişimini anlamak için en ideal karşılaştırma eseridir."
      },
      hotspots: [
        {
          id: "kitabe",
          kategori: "Kitabe",
          baslik: "1. 1874 Sultan Abdülaziz Kitabesi ve Yangın Sonrası İhya",
          pos: [0, 2.2, 3.6],
          kisaBilgi: "1867 büyük Konya çarşı yangınında yanan ahşap çatılı eski caminin yerine, yangına dayanıklı kesme taştan 1874'te inşa edildiğini belgeler.",
          tarihselKanitIpucu: "Ahşap caminin yangında kül olması üzerine yeni yapının tamamen kesme taştan yapılması, afet deneyimlerinin mimari malzemeyi değiştirdiğini kanıtlar.",
          sesliMetin: "1867 yılında Konya çarşısında çıkan büyük yangında eski cami tamamen yanmıştır. Bunun üzerine Sultan Abdülaziz ve annesi Pertevniyal Valide Sultan'ın desteğiyle 1874 yılında yangına dayanıklı kesme Gödene taşından bugünkü Aziziye Camii inşa edilmiştir."
        },
        {
          id: "plan",
          kategori: "Plan",
          baslik: "2. Şadırvanlı İkiz Minare Planı (Mekânsal Çözüm)",
          pos: [-2.8, 1.5, 2.8],
          kisaBilgi: "Çarşı içinde geniş bir avlu alanı olmadığı için şadırvanlar son cemaat yerinin iki ucundaki minarelerin altına (kürsüsüne) yerleştirilmiştir.",
          tarihselKanitIpucu: "Minare kürsüsünün şadırvan yapılması, kentsel alan darlığına karşı geliştirilmiş özgün bir mühendislik ve tasarım çözümüdür.",
          sesliMetin: "Son cemaat yerinin sağ ve sol ucundaki iki minarenin alt kısmına dikkatle bakın! Çarşı içinde geniş bir avlu yeri olmadığı için mimar, altıgen şadırvanları doğrudan minarelerin kaidesine yerleştirmiştir. Bu özellik Türk mimarisinde benzersizdir."
        },
        {
          id: "kullanim",
          kategori: "Kullanım Amacı",
          baslik: "3. Konya Bedesten Çarşısı Merkez Camii",
          pos: [0, 3.4, 0],
          kisaBilgi: "Tarihi Konya Bedesteni ve çarşı esnafının hem su ihtiyacını karşılayan hem de ibadet ettiği merkez yapıdır.",
          tarihselKanitIpucu: "Dört yönden çarşı sokaklarına açılan kapıları, yapının ticaret hayatının tam kalbinde yer aldığını gösterir.",
          sesliMetin: "Aziziye Camii, Konya'nın tarihi Bedesten Çarşısı'nın tam merkezinde yer alır ve esnafın günlük yaşamıyla bütünleşmiştir."
        },
        {
          id: "bugunku",
          kategori: "Bugünkü İşlev",
          baslik: "4. Günümüzde Yaşayan Çarşı ve Cami Bütünlüğü",
          pos: [2.8, 1.5, 2.8],
          kisaBilgi: "Restore edilen tarihi Konya Bedesteni ile birlikte günümüzde de şehrin en hareketli ibadet ve kültür noktasıdır.",
          tarihselKanitIpucu: "150 yılı aşkın süredir çarşı merkezi kimliğini koruması kentsel sürekliliği gösterir.",
          sesliMetin: "Günümüzde Konya Bedesten Çarşısı'nı gezen herkesin karşılaştığı bu zarif yapı, 19. yüzyıl Osmanlı mimarisinin yaşayan bir temsilcisidir."
        },
        {
          id: "malzeme",
          kategori: "Malzeme ve Yapı Tekniği",
          baslik: "5. Gödene Taşı ve Hafif Gözenekli Sille Taşı Kubbe",
          pos: [-2.2, 2.5, -1.0],
          kisaBilgi: "Duvarlarda sağlam Gödene taşı, kubbede ise ağırlığı azaltmak için gözenekli ve hafif Sille taşı kullanılmıştır.",
          tarihselKanitIpucu: "Duvar ve kubbede farklı yoğunlukta iki yerel taşın seçilmesi, statik mühendislik bilgisini kanıtlar.",
          sesliMetin: "Yapının taşıyıcı duvarlarında sert Gödene taşı kullanılırken, kubbede binaya aşırı yük bindirmemek için gözenekli ve hafif olan Sille taşı tercih edilmiştir."
        },
        {
          id: "mimari",
          kategori: "Mimari Özellikler",
          baslik: "6. Kapılardan Büyük Pencereler ve Barok-Ampir Üslup",
          pos: [2.2, 1.8, -0.5],
          kisaBilgi: "Klasik dönem camilerinin küçük pencerelerinin aksine, burada kapılardan bile büyük tutulan pencereler iç mekânı gündüz ışığıyla doldurur.",
          tarihselKanitIpucu: "Devasa pencereler, yivli minareler ve S-C kıvrımlı taş motifler, eserin 19. yüzyıl Geç Osmanlı (Batılılaşma) dönemine ait olduğunun kesin kanıtıdır.",
          sesliMetin: "Caminin pencerelerine baktığınızda kapılardan bile daha büyük olduğunu fark edersiniz. 19. yüzyıl Osmanlı mimarisinde iç mekânı çok daha aydınlık kılma arzusu ve Avrupa Barok-Ampir etkisi bu büyük pencerelerde somutlaşmıştır."
        },
        {
          id: "korunma",
          kategori: "Korunma Durumu",
          baslik: "7. Kagir Mimari Sayesinde Yangınlara Direnç",
          pos: [0, 1.5, -2.5],
          kisaBilgi: "Tamamen kesme taş ve kurşun örtüyle inşa edildiği için 1874'ten bu yana özgün mimarisini eksiksiz korumuştur.",
          tarihselKanitIpucu: "Malzeme seçiminin (ahşaptan taşa geçiş) yapıların korunma durumu üzerindeki etkisini kanıtlar.",
          sesliMetin: "Tamamen taş ve kurşun malzemeyle inşa edilen yapı, 1874 yılından bu yana hiçbir büyük tahribata uğramadan korunmuştur."
        },
        {
          id: "baglam",
          kategori: "Tarihsel Bağlam",
          baslik: "8. Klasik Dönemden Geç Döneme Osmanlı Cami Evrimi",
          pos: [1.8, 0.9, 2.2],
          kisaBilgi: "Edirne Selimiye (1575) ile Konya Aziziye (1874) arasındaki 300 yıllık süreçte Osmanlı mimarisinin nasıl dönüşüm geçirdiğini gösterir.",
          tarihselKanitIpucu: "Dönemsel karşılaştırma yapmak için en güçlü somut kanıtlardan biridir.",
          sesliMetin: "16. yüzyıldaki Edirne Selimiye Camii ile 19. yüzyıldaki Konya Aziziye Camii'ni karşılaştırdığınızda, Osmanlı mimarisinin üç asır içinde Klasik üsluptan Barok-Ampir sentezine nasıl evrildiğini açıkça görebilirsiniz."
        }
      ],
      karsilastirilabilirEserler: ["edirne-selimiye-camii", "istanbul-suleymaniye-camii", "diyarbakir-behram-pasa-camii", "istanbul-ahmed-cesmesi"],
      kanitTemelliSorular: [
        {
          id: "kaz-q1",
          tip: "gorsel_kanit",
          zorluk: "Orta",
          ilgiliAlan: "Dönemsel Karşılaştırma (16. yy vs 19. yy)",
          kanitMetni: "KANIT 1 (Dönemsel Karşılaştırma): 16. yüzyıl Klasik Dönem camilerinde (örneğin Süleymaniye ve Selimiye) mukarnaslı başlıklar, sivri kemerler ve ölçülü pencereler kullanılırken; 1874 tarihli Konya Aziziye Camii'nde yuvarlak kemerli kapıdan büyük pencereler, yivli minareler ve Barok/Ampir kıvrımlı taş bezemeler kullanılmıştır.",
          soru: "Bu karşılaştırmalı kanıt Osmanlı mimarlık tarihindeki hangi süreci doğrulamaktadır?",
          secenekler: [
            "19. yüzyıl Geç Osmanlı döneminde geleneksel cami planının Barok ve Ampir gibi Batı etkili bezeme ve aydınlatma unsurlarıyla sentezlendiğini (değişim ve süreklilik)",
            "Konya Aziziye Camii'nin 14. yüzyılda Erken Osmanlı döneminde yapıldığını",
            "19. yüzyılda camilerde kubbe ve minare kullanımının tamamen bırakıldığını",
            "Osmanlı mimarisinin 600 yıl boyunca hiç değişmeden aynı kaldığını"
          ],
          dogruIndeks: 0,
          ipucu: "'6. Kapılardan Büyük Pencereler ve Barok-Ampir Üslup' ile '8. Klasik Dönemden Geç Döneme' noktalarını inceleyin.",
          aciklama: "Tebrikler! Kubbe ve minare gibi ana unsurlar sürerken (süreklilik), pencere boyutları, kemer formları ve taş bezemeler 19. yüzyıl Barok-Ampir zevkine göre değişmiştir (değişim).",
          kanitDosyasiBasligi: "Dönemsel Evrim Kanıtı: Klasik Üsluptan 19. Yüzyıl Barok-Ampir Sentezine"
        }
      ],
      kaynakca: [
        "Kültür Portalı, 'Aziziye Camii - Konya', T.C. Kültür ve Turizm Bakanlığı.",
        "Karpuz, Haşim (2009). Türk Kültür Varlıkları Envanteri: Konya, TTK Yayınları.",
        "Goodwin, Godfrey (1971). A History of Ottoman Architecture."
      ],
      ogretmenNotlari: {
        kazanimlar: [
          "Klasik Dönem (16. yy) ile Geç Osmanlı Dönemi (19. yy) cami mimarisini dönemsel değişim ve süreklilik bağlamında karşılaştırır."
        ],
        etkinlikOnerisi: "Karşılaştırma ekranında 'Dönemsel Karşılaştırma' modunu seçerek Edirne Selimiye Camii (1575) ile Konya Aziziye Camii'ni (1874) yan yana karşılaştırın."
      }
    },
    {
      id: "edirne-uzunkopru",
      eserAdi: "Edirne Uzunköprü (Cisr-i Ergene)",
      il: "Edirne",
      ilId: "edirne",
      plaka: "22",
      bolge: "Marmara",
      ilce: "Uzunköprü",
      eserTuru: "Köprü",
      donem: "Erken Osmanlı (1299–1453)",
      yapimYili: "1426–1443 (II. Murad Dönemi)",
      mimar: "Mimar Müslihiddin",
      kullanimDurumu: "Anıtsal Taş Köprü (UNESCO Dünya Mirası Geçici Listesi)",
      konum: "Ergene Nehri Üzeri, Uzunköprü / Edirne (41.2764° K, 26.6789° D)",
      kisaAciklama: "Sultan II. Murad tarafından Başmimar Müslihiddin'e 1426–1443 yılları arasında Ergene Nehri üzerinde yaptırılan; 1.392 metre uzunluğu ve 174 taş kemeriyle dünyanın üzerinde geçilebilen en uzun tarihi taş köprüsüdür.",
      ayrintiliAciklama: "Anadolu'yu Balkanlar'a ve Avrupa'ya bağlayan stratejik güzergâhta, Ergene Nehri'nin sık sık taşan bataklık vadisini aşmak üzere Sultan II. Murad tarafından 1426-1443 yılları arasında Mimar Müslihiddin'e inşa ettirilmiştir. 1.392 metre uzunluğu, 6,80 metre genişliği ve 174 sivri/yuvarlak kemeriyle dünya mühendislik tarihinin en uzun taş köprüsüdür. Köprünün inşasıyla birlikte başında cami, imaret ve medrese kurularak bugünkü 'Uzunköprü' (Cisr-i Ergene) şehri doğmuştur.",
      modelTipi: "kopru",
      modelConfig: {
        baseColor: "#d6ccb8",
        waterColor: "#2a6f97",
        archCount: 11
      },
      kitabeBilgisi: {
        yeri: "Köprü ortasındaki tarih köşkü (kitabe köşkü) ve Aşıkpaşazade / Neşri kronikleri",
        metinOzeti: "Hicri 830 (1426/27) yılında başlayıp Hicri 847 (1443) yılında Sultan II. Murad tarafından tamamlandığı, açılış törenine bizzat padişahın katıldığı kroniklerde kayıtlıdır.",
        tarihselKanitDegeri: "Bir altyapı mühendislik eserinin (köprü) yeni bir şehrin (Uzunköprü ilçesinin) kurulmasına ve adlandırılmasına doğrudan kaynaklık ettiğini kanıtlar."
      },
      planBilgisi: {
        semaTipi: "174 Kemerli, Selyaranlı ve Tahliye Gözlü Anıtsal Taşkın Köprüsü",
        mekansalDuzen: "1.392 metre boyunca uzanan yüksek ve alçak kemer dizileri, su basıncını kıran üçgen selyaranlar (mahmuzlar), taşkın suyunu boşaltan tahliye gözleri ve dinlenme balkonları.",
        planAciklamasi: "Yalnızca nehir yatağını değil, Ergene'nin kışın taşarak oluşturduğu yaklaşık 1,4 kilometrelik bataklık ve taşkın ovasını kesintisiz geçmek üzere tasarlanmıştır."
      },
      kullanimAmaci: {
        ilkIslev: "İstanbul ve Edirne'yi Balkanlar'a bağlayan kervan ve askeri sefer yolunun dört mevsim kesintisiz ve güvenli işlemesini sağlamak.",
        kullaniciKitlesi: "Ticaret kervanları, yolcular, posta tatarları ve Osmanlı ordusu."
      },
      bugunkuIslev: {
        guncelKullanim: "UNESCO Dünya Mirası Geçici Listesi'nde yer alan ve restorasyonu tamamlanan tarihi mühendislik anıtı.",
        degisimVeSureklilik: "580 yılı aşkın süredir iki yakayı birbirine bağlama işlevini sürdürmekte, ağır motorlu taşıt trafiğinden korunarak kültür mirası olarak yaşatılmaktadır."
      },
      malzemeBilgisi: {
        anaMalzemeler: "Kalker kesme taşı, traverten, demir kenetler, eritilmiş kurşun ve horasan harcı.",
        yapimTeknigi: "Bataklık zeminde ardıç/meşe kazıklar üzerine oturan taş temeller, selyaranlar ve kilit taşlı kemer mühendisliği."
      },
      mimariOzellikler: [
        "1.392 metre uzunluk ve 174 adet taş kemer (Dünyanın en uzun tarihi taş köprüsü)",
        "Su akıntısını bölerek ayakları koruyan üçgen selyaranlar (mahmuzlar)",
        "Kilit taşlarında ve ayaklarda aslan, fil, kuş ve geometrik taş kabartmalar",
        "Nehir taşkınlarında köprü üzerindeki yükü azaltan tahliye gözleri",
        "Köprü inşasıyla doğan 'Cisr-i Ergene (Uzunköprü)' şehir yerleşimi"
      ],
      korunmaDurumu: {
        durum: "Çok İyi Korunmuş (2021-2024 Kapsamlı Restorasyon)",
        restorasyonBilgisi: "1960'larda üzerine dökülen beton tabliye son dönem bilimsel restorasyonunda kaldırılarak köprü özgün taş döşemesine ve kemer yapısına kavuşturulmuştur."
      },
      tarihselBaglam: {
        donemOzelligi: "15. yüzyıl ilk yarısı (II. Murad dönemi); Rumeli'de ulaşım güvenliği ve şehirleşmenin altyapı yatırımlarıyla kurumsallaştığı dönem.",
        sosyoKulturelRol: "Bir mühendislik yapısının etrafında cami ve imaret kurularak bataklık bir alanın nasıl mamur bir şehre dönüştürüldüğünü gösterir."
      },
      hotspots: [
        {
          id: "kitabe",
          kategori: "Kitabe ve Kronikler",
          baslik: "1. 1443 Açılış Töreni ve Cisr-i Ergene Adı",
          pos: [0, 2.0, 0.8],
          kisaBilgi: "17 yıl süren inşaat 1443'te tamamlandığında Sultan II. Murad Edirne'den gelerek açılışa katılmış ve köprü başına kurulan kasabaya 'Cisr-i Ergene' (Ergene Köprüsü / Uzunköprü) adı verilmiştir.",
          tarihselKanitIpucu: "Bir ilçenin adını doğrudan üzerindeki Osmanlı eserinden alması, mimarinin coğrafyayı ve yerleşim tarihini şekillendirdiğinin kanıtıdır.",
          sesliMetin: "Uzunköprü ilçesi, adını doğrudan üzerinde bulunduğunuz bu 1392 metrelik şaheserden alır. Osmanlı döneminde Cisr-i Ergene yani Ergene Köprüsü olarak adlandırılan yerleşim, bu köprü sayesinde kurulmuştur."
        },
        {
          id: "plan",
          kategori: "Plan",
          baslik: "2. 1.392 Metre ve 174 Kemerli Taşkın Ovası Planı",
          pos: [-3.5, 1.5, 0],
          kisaBilgi: "Köprü neden bu kadar uzundur? Çünkü Ergene Nehri kış aylarında taşarak 1,5 kilometrelik vadiyi bataklığa çeviriyordu; Mimar Müslihiddin tüm taşkın ovasını kemerlerle aşmıştır.",
          tarihselKanitIpucu: "Köprünün 174 kemerli uzunluğu, coğrafi/hidrolojik bir soruna (taşkın ovası) üretilen mühendislik çözümünün kanıtıdır.",
          sesliMetin: "Bir nehir köprüsünün neden yaklaşık bir buçuk kilometre uzunluğunda yapıldığını hiç düşündünüz mü? Ergene Nehri yağışlı mevsimlerde yatağından taşarak tüm vadiyi geçilmez bir bataklığa dönüştürüyordu. Mimar Müslihiddin 174 kemerle tüm taşkın ovasını boydan boya geçmiştir."
        },
        {
          id: "kullanim",
          kategori: "Kullanım Amacı",
          baslik: "3. Rumeli Kervan ve Sefer Yolu Güvenliği",
          pos: [3.5, 1.5, 0],
          kisaBilgi: "Köprü yapılmadan önce bataklık ve sık ormanda kervanlar soyuluyor veya selde boğuluyordu; köprü ve başındaki vakıf kasabası yolu tamamen güvenli hale getirdi.",
          tarihselKanitIpucu: "Aşıkpaşazade Tarihi'nde 'Orası haramilerin (eşkıyaların) yatağıydı, Padişah orayı mamur edip köprü ve imaret yaptı' kaydı yer alır.",
          sesliMetin: "Dönemin tarihçisi Aşıkpaşazade, köprü yapılmadan önce bu bataklık ve ormanlık geçişte kervanların büyük tehlike yaşadığını, İkinci Murad'ın köprüyle birlikte cami ve imaret kurarak bölgeyi güvenli bir şehre dönüştürdüğünü yazar."
        },
        {
          id: "bugunku",
          kategori: "Bugünkü İşlev",
          baslik: "4. Dünyanın En Uzun Tarihi Taş Köprüsü (UNESCO Adayı)",
          pos: [0, 1.2, -1.2],
          kisaBilgi: "2015'ten beri UNESCO Dünya Mirası Geçici Listesi'nde yer alan eser, son restorasyonuyla özgün taş döşemesine kavuşarak kültür mirası olarak korunmaktadır.",
          tarihselKanitIpucu: "1960'larda dökülen betonun kaldırılıp özgün taş döşemeye dönülmesi, bilimsel restorasyon anlayışının gelişimini gösterir.",
          sesliMetin: "Günümüzde dünyanın ayakta kalan en uzun tarihi taş köprüsü unvanını taşıyan Uzunköprü, UNESCO Dünya Mirası Geçici Listesi'nde yer almaktadır."
        },
        {
          id: "malzeme",
          kategori: "Malzeme ve Yapı Tekniği",
          baslik: "5. Horasan Harcı, Demir Kenetler ve Kazık Temeller",
          pos: [-1.8, 0.8, 1.0],
          kisaBilgi: "Bataklık zemine çakılan suya dayanıklı ahşap kazıklar üzerine horasan harcı ve kurşunlu demir kenetlerle bağlanan kesme taş bloklar oturtulmuştur.",
          tarihselKanitIpucu: "Yumuşak alüvyon zeminde 580 yıl çökmeden ayakta kalması, 15. yüzyıl zemin mühendisliğinin kanıtıdır.",
          sesliMetin: "Bataklık bir zeminde 174 taş kemeri 580 yıl boyunca ayakta tutabilmek için su altında çürümeyen ahşap kazık temeller, horasan harcı ve kurşunla sabitlenmiş demir kenetler kullanılmıştır."
        },
        {
          id: "mimari",
          kategori: "Mimari Özellikler",
          baslik: "6. Selyaranlar, Tahliye Gözleri ve Hayvan Figürleri",
          pos: [1.8, 0.9, 1.0],
          kisaBilgi: "Ayakların önündeki üçgen selyaranlar suyun çarpma gücünü ikiye böler; kemer taşlarındaki aslan, fil ve kuş kabartmaları ise estetik zenginlik katar.",
          tarihselKanitIpucu: "Üçgen selyaranlar ve tahliye gözleri, akışkanlar mekaniği (hidrolik) bilgisinin mimaride kullanıldığının kanıtıdır.",
          sesliMetin: "Köprü ayaklarının suyun geldiği yöndeki sivri üçgen çıkıntılarına selyaran denir. Selyaranlar coşkun akan nehir suyunu ikiye yararak köprü ayaklarının yıkılmasını önler."
        },
        {
          id: "korunma",
          kategori: "Korunma Durumu",
          baslik: "7. Ağır Taşıt Trafiğinden Arındırma ve Koruma",
          pos: [-2.8, 1.8, -0.8],
          kisaBilgi: "Yüzyıllarca kervanları, orduları ve 20. yüzyılda kamyonları taşıyan köprü, bugün yaya ve kültür rotası olarak korunmaktadır.",
          tarihselKanitIpucu: "Kültürel mirasın korunması için modern alternatif köprü yapılıp tarihi köprünün yaya kullanımına ayrılması doğru koruma politikasıdır.",
          sesliMetin: "Tarihi köprünün titreşimden zarar görmemesi için motorlu araç trafiği yeni köprüye aktarılmış ve Uzunköprü özgün taş dokusuyla koruma altına alınmıştır."
        },
        {
          id: "baglam",
          kategori: "Tarihsel Bağlam",
          baslik: "8. İmaretle Şehir Kurma Geleneği (Şenlendirme)",
          pos: [2.8, 1.8, -0.8],
          kisaBilgi: "Osmanlı'da ıssız ve tehlikeli geçitlere köprü, cami ve aşevi (imaret) yapılarak vergi muafiyetiyle halkın yerleştirilmesi ('şenlendirme') politikasının en somut örneğidir.",
          tarihselKanitIpucu: "Köprü ile birlikte Muradiye Camii ve imaretinin yapılması, altyapı ile iskan politikasının birlikte yürütüldüğünü kanıtlar.",
          sesliMetin: "Osmanlı şehirciliğinde ıssız bir geçide önce köprü, yanına cami, aşevi ve han yapılarak insanların yerleşmesi teşvik edilirdi. Tarihte buna 'şenlendirme' yani imar ederek canlandırma denir."
        }
      ],
      karsilastirilabilirEserler: ["edirne-selimiye-camii", "edirne-bayezid-darussifasi", "kastamonu-nasrullah-kulliyesi"],
      kanitTemelliSorular: [
        {
          id: "uzk-q1",
          tip: "gorsel_kanit",
          zorluk: "Orta",
          ilgiliAlan: "Plan ve Mühendislik",
          kanitMetni: "KANIT 1 (Coğrafi ve Mimari Gözlem): Ergene Nehri'nin normal yatak genişliği çok daha dar olmasına rağmen, Mimar Müslihiddin Uzunköprü'yü 1.392 metre uzunluğunda ve 174 kemerli olarak inşa etmiş; ayrıca kemerlerin arasına boşaltma (tahliye) gözleri ve üçgen selyaranlar yerleştirmiştir.",
          soru: "Köprünün nehir yatağından çok daha uzun ve 174 kemerli yapılmasının temel bilimsel/coğrafi nedeni nedir?",
          secenekler: [
            "Nehrin kış ve bahar aylarında taşarak oluşturduğu 1,4 kilometrelik bataklık ve taşkın ovasını her mevsim kesintisiz geçebilmek",
            "Taş ustalarının ellerindeki fazla taşları bitirmek istemesi",
            "Köprünün üstünde at yarışı düzenlenmesi",
            "Ergene Nehri'nin o dönemde bir okyanus boğazı olması"
          ],
          dogruIndeks: 0,
          ipucu: "'2. 1.392 Metre ve 174 Kemerli Taşkın Ovası Planı' ile '6. Selyaranlar' bilgi noktalarını inceleyin.",
          aciklama: "Kesinlikle doğru! Uzunköprü yalnızca normal nehir yatağını değil, tüm taşkın ovasını ve bataklık zemini aşmak için 1.392 metre uzunluğunda tasarlanmış bir hidrolik mühendislik harikasıdır.",
          kanitDosyasiBasligi: "Hidrolik Mühendislik Kanıtı: 174 Kemerli Taşkın Ovası Geçişi"
        }
      ],
      kaynakca: [
        "Kültür Portalı, 'Uzunköprü - Edirne', T.C. Kültür ve Turizm Bakanlığı.",
        "Çulpan, Cevdet (1975). Türk Taş Köprüleri (Ortaçağdan Osmanlı Devri Sonuna Kadar), TTK Yayınları.",
        "UNESCO World Heritage Tentative List, 'The Bridge of Uzunköprü' (2015)."
      ],
      ogretmenNotlari: {
        kazanimlar: [
          "Osmanlı ulaşım altyapısının (köprü, derbent, imaret) ticaret güvenliği ve yeni şehirlerin kuruluşundaki ('şenlendirme') rolünü kanıtlarla açıklar."
        ],
        etkinlikOnerisi: "Aynı ildeki Edirne Uzunköprü (1443), II. Bayezid Darüşşifası (1488) ve Selimiye Camii'ni (1575) karşılaştırarak Edirne'nin 15. ve 16. yüzyıldaki çok yönlü gelişimini inceletin."
      }
    },
    {
      id: "istanbul-hurrem-sultan-hamami",
      eserAdi: "İstanbul Haseki Hürrem Sultan Hamamı",
      il: "İstanbul",
      ilId: "istanbul",
      plaka: "34",
      bolge: "Marmara",
      ilce: "Fatih (Sultanahmet)",
      eserTuru: "Hamam",
      donem: "Klasik Dönem (1453–1600)",
      yapimYili: "1556–1557 (Kanuni Sultan Süleyman Dönemi)",
      mimar: "Mimar Sinan",
      kullanimDurumu: "Özgün İşleviyle Yaşayan Tarihi Hamam",
      konum: "Cankurtaran Mahallesi, Ayasofya Meydanı, Fatih / İstanbul (41.0068° K, 28.9788° D)",
      kisaAciklama: "Kanuni Sultan Süleyman'ın eşi Hürrem Sultan adına Mimar Sinan tarafından 1556'da Ayasofya ile Sultanahmet arasında inşa edilen; erkekler ve kadınlar bölümleri aynı eksen üzerinde simetrik kurgulanan anıtsal çifte hamamdır.",
      ayrintiliAciklama: "Mimar Sinan tarafından 1556–1557 yıllarında Antik Zeuksippos Hamamları'nın bulunduğu alanda Haseki Hürrem Sultan adına inşa edilmiştir. 75 metre uzunluğundaki yapı, Türk hamam mimarisinde bir devrim niteliği taşır: Geleneksel çifte hamamlarda kadınlar ve erkekler bölümleri yan yana yapılırken, Mimar Sinan burada iki bölümü aynı boyuna eksen üzerinde sırt sırta (sıcaklıkları ve külhanı ortada birleşecek şekilde) ayna simetrisiyle planlamıştır.",
      modelTipi: "hamam",
      modelConfig: {
        baseColor: "#ded5c5",
        brickColor: "#a84a32",
        domeColor: "#525e69"
      },
      kitabeBilgisi: {
        yeri: "Kuzey (erkekler) giriş kapısı üzerindeki manzum kitabe ve Mimar Sinan tezkireleri",
        metinOzeti: "Hicri 964 (Miladi 1556/1557) yılında Kanuni Sultan Süleyman döneminde Haseki Hürrem Sultan hayratı ve vakfı olarak Mimar Sinan tarafından bina edildiği kayıtlıdır.",
        tarihselKanitDegeri: "Hamam gelirlerinin Haseki Külliyesi'ndeki (cami, medrese, darüşşifa) hayır işlerine vakfedildiğini gösterir."
      },
      planBilgisi: {
        semaTipi: "Boyuna Eksen Üzerinde Sırt Sırta Simetrik Çifte Hamam Planı",
        mekansalDuzen: "Kuzey uçta erkekler soyunmalığı (camekân), ılıklık, dört eyvanlı ve dört halvetli sıcaklık; tam ortada ortak su deposu ve külhan (ısıtma merkezi); güney uçta ise aynı planın ayna simetriği olan kadınlar sıcaklığı, ılıklığı ve soyunmalığı.",
        planAciklamasi: "İki sıcaklık bölümünün tam ortadaki tek bir külhan (ateşlik) ve su haznesi etrafında sırt sırta yerleştirilmesi, yakıt ve ısı tasarrufu sağlayan üstün bir termodinamik mühendislik çözümüdür."
      },
      kullanimAmaci: {
        ilkIslev: "Halkın temizlik ve sağlık ihtiyacını karşılayan kamusal çifte hamam ve Haseki Külliyesi'nin vakıf gelir kaynağı.",
        kullaniciKitlesi: "İstanbul halkı (kadınlar ve erkekler ayrı bölümlerde), seyyahlar."
      },
      bugunkuIslev: {
        guncelKullanim: "2008-2011 restorasyonu sonrasında yeniden özgün hamam işleviyle hizmet veren kültürel miras yapısı.",
        degisimVeSureklilik: "Yüzyıllar içinde bir dönem kağıt/benzin deposu ve halı sergi alanı olarak kullanılmış (değişim), 2011'den itibaren ise yeniden 16. yüzyıldaki özgün hamam işlevine kavuşmuştur (süreklilik)."
      },
      malzemeBilgisi: {
        anaMalzemeler: "Kesme küfeki taşı, almaşık tuğla, Marmara mermeri (göbek taşı ve kurnalar), kurşun kubbeler ve kubbelerde cam 'fil gözü' aydınlatma fanusları.",
        yapimTeknigi: "Döşeme altından geçen sıcak duman kanallarıyla (cehennemlik / hipokaust sistemi) alttan ısıtma ve duvar içi pişmiş toprak künklerle sıcak-soğuk su tesisatı."
      },
      mimariOzellikler: [
        "75 metre uzunluğunda boyuna simetrik çifte hamam planı",
        "Kubbelerde gün ışığını yıldız gibi içeri süzerek aydınlatma sağlayan cam 'Fil Gözleri'",
        "Bir sıra kesme taş ve üç sıra tuğladan oluşan almaşık duvar cephesi",
        "Merkezde tek külhanla iki sıcaklığı ısıtan enerji verimli mühendislik",
        "Dört eyvanlı ve dört köşe halvet hücreli klasik sıcaklık şeması"
      ],
      korunmaDurumu: {
        durum: "Çok İyi Korunmuş (Aktif Kullanımda)",
        restorasyonBilgisi: "1910'lara kadar hamam olarak çalışmış, uzun süre depo ve halı galerisi olduktan sonra 2008-2011'de bilimsel restorasyonla özgün işlevine döndürülmüştür."
      },
      tarihselBaglam: {
        donemOzelligi: "16. yüzyıl Klasik Osmanlı döneminde su medeniyetinin, kamusal hijyenin ve kadın banilerin (Hürrem Sultan, Mihrimah Sultan, Nurbanu Sultan) vakıf yatırımlarının zirveye çıktığı dönem.",
        sosyoKulturelRol: "Hem kadınlara hem erkeklere eşit büyüklükte ve eşit mimari kalitede anıtsal mekân sunan simetrik tasarımıyla sosyal tarih açısından çok önemli bir kanıttır."
      },
      hotspots: [
        {
          id: "kitabe",
          kategori: "Kitabe",
          baslik: "1. 1556 Tarihli Giriş Kitabesi ve Hürrem Sultan Vakfı",
          pos: [0, 2.0, 4.2],
          kisaBilgi: "Kuzey cephedeki taçkapı kitabesi, eserin 1556 yılında Haseki Hürrem Sultan adına Mimar Sinan tarafından inşa edildiğini belgeler.",
          tarihselKanitIpucu: "Osmanlı'da valide ve haseki sultanların şehir merkezlerinde büyük sosyal ve gelir getirici vakıf eserleri kurduğunun kanıtıdır.",
          sesliMetin: "Ayasofya'ya bakan kuzey giriş kapısı üzerindeki kitabe, bu anıtsal çifte hamamın 1556 yılında Haseki Hürrem Sultan adına Başmimar Sinan tarafından inşa edildiğini belgeler."
        },
        {
          id: "plan",
          kategori: "Plan",
          baslik: "2. Sırt Sırta Ayna Simetrili Çifte Hamam Planı",
          pos: [-2.8, 1.8, 0],
          kisaBilgi: "Mimar Sinan, erkekler ve kadınlar bölümlerini yan yana değil, aynı eksende sırt sırta ve eşit büyüklükte yerleştirerek ortadaki tek bir külhandan her iki bölümü ısıtmıştır.",
          tarihselKanitIpucu: "Kadınlar ve erkekler bölümlerinin birebir aynı ölçekte ve aynı kubbe yüksekliğinde yapılması, kamusal hizmette eşit mimari standart sunulduğunu kanıtlar.",
          sesliMetin: "Mimar Sinan bu eserde hamam mimarisine yepyeni bir plan kazandırmıştır. Erkekler ve kadınlar bölümlerini aynı eksen üzerinde sırt sırta simetrik olarak yerleştirmiş, tam ortaya koyduğu tek bir ısıtma merkeziyle her iki bölümü minimum yakıtla ısıtmıştır."
        },
        {
          id: "kullanim",
          kategori: "Kullanım Amacı",
          baslik: "3. Kamusal Hijyen ve Haseki Külliyesi Finansmanı",
          pos: [2.8, 1.8, 0],
          kisaBilgi: "Soyunmalık (camekân), ılıklık ve sıcaklık aşamalarıyla beden temizliği sağlarken, elde edilen gelir Hürrem Sultan'ın darüşşifa ve imaretini finanse etmiştir.",
          tarihselKanitIpucu: "Ücretli hamam işletmesinin ücretsiz hastane ve aşevini finanse etmesi, vakıf ekonomisinin işleyişini kanıtlar.",
          sesliMetin: "Osmanlı şehirlerinde hamamlar hem halk sağlığı ve temizlik merkeziydi hem de elde ettikleri gelirle ücretsiz hizmet veren darüşşifa ve aşevlerini yaşatan vakıf işletmeleriydi."
        },
        {
          id: "bugunku",
          kategori: "Bugünkü İşlev",
          baslik: "4. Depodan Yeniden Özgün Hamam İşlevine Dönüş",
          pos: [0, 1.2, -4.0],
          kisaBilgi: "20. yüzyılda bir süre depo ve halı satış yeri olarak kullanılan yapı, 2011 restorasyonuyla yeniden 450 yıl önceki özgün hamam işlevine kavuşmuştur.",
          tarihselKanitIpucu: "Bir yapının zamanla işlev kaybedip sonra bilimsel restorasyonla özgün işlevine dönmesi, değişim ve süreklilik analizi için somut bir örnektir.",
          sesliMetin: "Tarihi yapıların işlev serüveni her zaman düz bir çizgide ilerlemez. Yirminci yüzyılda depo ve sergi salonu olarak kullanılan yapı, 2011 yılındaki restorasyonla yeniden özgün hamam işlevine kavuşmuştur."
        },
        {
          id: "malzeme",
          kategori: "Malzeme ve Yapı Tekniği",
          baslik: "5. Cehennemlik (Alttan Isıtma) ve Almaşık Duvar",
          pos: [-2.4, 0.8, 2.5],
          kisaBilgi: "Külhanda yanan ateşin sıcak dumanı, mermer zeminin altındaki 'cehennemlik' kanallarında dolaşarak tüm hamamı alttan ısıtır.",
          tarihselKanitIpucu: "Döşeme altı duman kanalları ve duvar içi pişmiş toprak su boruları (künkler), 16. yüzyıl tesisat ve ısı mühendisliğinin kanıtıdır.",
          sesliMetin: "Mermer göbek taşının ve zeminin altında cehennemlik adı verilen tuğla ayaklı boşluklar bulunur. Külhandaki ateşin sıcaklığı bu kanallarda dolaşarak bugünkü yerden ısıtma sisteminin 16. yüzyıldaki karşılığını oluşturur."
        },
        {
          id: "mimari",
          kategori: "Mimari Özellikler",
          baslik: "6. Kubbelerdeki Cam 'Fil Gözleri' ve Kurşun Örtü",
          pos: [0, 3.5, 1.5],
          kisaBilgi: "Hamamda mahremiyet ve ısı kaybını önlemek için yan duvarlarda pencere açılmaz; bunun yerine kubbelerdeki yüzlerce cam fanus (fil gözü) içeriye doğal ışık süzülmesini sağlar.",
          tarihselKanitIpucu: "Yan duvarlarda pencere olmayıp kubbede cam fil gözleri bulunması, bir yapının hamam olduğunu gösteren en karakteristik mimari kanıttır.",
          sesliMetin: "Hamamların yan duvarlarında neden pencere bulunmadığını düşündünüz mü? Hem içerideki sıcak buharın kaçmasını önlemek hem de mahremiyeti sağlamak için yan duvarlar sağır bırakılmış, aydınlatma ise kubbelerdeki cam fil gözleriyle sağlanmıştır."
        },
        {
          id: "korunma",
          kategori: "Korunma Durumu",
          baslik: "7. Suya ve Buhara Dayanıklı Horasan Sıvası",
          pos: [2.4, 2.2, -2.0],
          kisaBilgi: "Tuğla tozu ve kireçten yapılan horasan harcı ve sıvası, su buharıyla temas ettikçe daha da sertleşerek kubbeleri 470 yıl korumuştur.",
          tarihselKanitIpucu: "Horasan harcının hidrolik (suyla sertleşen) özelliği, su yapılarının uzun ömürlü olmasının kimyasal kanıtıdır.",
          sesliMetin: "Sürekli yoğun su buharına maruz kalan hamam kubbelerinin çökmemesini sağlayan malzeme, tuğla kırığı ve kireçle hazırlanan su geçirmez horasan harcıdır."
        },
        {
          id: "baglam",
          kategori: "Tarihsel Bağlam",
          baslik: "8. Ayasofya ve Sultanahmet Arasındaki Kentsel Konum",
          pos: [2.0, 1.0, 3.2],
          kisaBilgi: "Doğu Roma'nın ünlü Zeuksippos Hamamları'nın bulunduğu tarihi aks üzerinde inşa edilerek şehrin bin yıllık su ve yıkanma kültürünü sürdürmüştür.",
          tarihselKanitIpucu: "Aynı kentsel alanda Roma ve Osmanlı su yapılarının ardışık kurulması, İstanbul'daki mekânsal sürekliliği gösterir.",
          sesliMetin: "Ayasofya ile Sultanahmet Meydanı arasında uzanan bu zarif yapı, İstanbul'un tarihi merkezinde su ve temizlik medeniyetinin anıtsal temsilcisidir."
        }
      ],
      karsilastirilabilirEserler: ["istanbul-suleymaniye-camii", "istanbul-ahmed-cesmesi", "edirne-bayezid-darussifasi"],
      kanitTemelliSorular: [
        {
          id: "hsh-q1",
          tip: "gorsel_kanit",
          zorluk: "Orta",
          ilgiliAlan: "Plan ve Mimari Özellikler",
          kanitMetni: "KANIT 1 (Mimari Gözlem): Haseki Hürrem Sultan Hamamı incelendiğinde; yan duvarlarda hiç pencere bulunmadığı, aydınlatmanın kubbelerdeki cam 'fil gözleri' ile sağlandığı ve erkekler ile kadınlar sıcaklık bölümlerinin tam ortadaki tek bir külhan (ateşlik) etrafında sırt sırta yerleştirildiği görülmektedir.",
          soru: "Yukarıdaki mimari özellikler Mimar Sinan'ın bu yapıyı tasarlarken hangi ilkeleri gözettiğini kanıtlar?",
          secenekler: [
            "Isı kaybını önleme, mahremiyeti koruma ve tek ısıtma merkeziyle iki bölümü birden ısıtarak enerji tasarrufu sağlama",
            "Yapıyı kışın soğuk tutarak gıda deposu olarak kullanma",
            "İçerideki dumanı pencerelerden sokağa verme",
            "Sadece tek bir kişinin kullanabileceği küçük bir oda yapma"
          ],
          dogruIndeks: 0,
          ipucu: "'2. Sırt Sırta Ayna Simetrili Çifte Hamam Planı' ve '6. Kubbelerdeki Cam Fil Gözleri' noktalarını inceleyin.",
          aciklama: "Harika çıkarım! Yan duvarlarda pencere açmayıp kubbeden ışık almak ısı kaybını ve mahremiyeti çözerken, iki sıcaklığı tek külhana bağlamak yüksek enerji verimliliği sağlamıştır.",
          kanitDosyasiBasligi: "Termodinamik ve Mahremiyet Kanıtı: Fil Gözlü Kubbe ve Ortak Külhan"
        }
      ],
      kaynakca: [
        "Kültür Portalı, 'Ayasofya Haseki Hürrem Sultan Hamamı - İstanbul', T.C. Kültür ve Turizm Bakanlığı.",
        "Yılmazkaya, Orhan (2002). Aydınlık Kubbenin Altındaki Sıcaklık: Türk Hamamı, İstanbul.",
        "Kuban, Doğan (2007). Osmanlı Mimarisi, YEM Yayınları."
      ],
      ogretmenNotlari: {
        kazanimlar: [
          "Osmanlı su medeniyetini çeşme (III. Ahmed Çeşmesi), şifahane (Edirne Darüşşifası) ve hamam (Hürrem Sultan Hamamı) yapıları üzerinden karşılaştırır."
        ],
        etkinlikOnerisi: "İstanbul'daki iki Osmanlı su yapısını (III. Ahmed Çeşmesi ve Haseki Hürrem Sultan Hamamı) karşılaştırarak Osmanlı toplumunda suyun kamusal ve sıhhi kullanımını tartışın."
      }
    }
  ];

  window.OTTOMAN_MONUMENTS = (window.OTTOMAN_MONUMENTS || []).concat(PART3_MONUMENTS);
})();
