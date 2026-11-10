// MİRAS-3B: Osmanlı Eserleri Veri Tabanı — Bölüm 6 (İl İçi Karşılaştırma ve Bölgesel Tamamlayıcı Eserler)
// TÜBİTAK 2204-B Tarih Projesi — Sivas Kurşunlu Hamamı, Konya Sultan Selim Camii, Trabzon Gülbahar Hatun Külliyesi, Antalya Murat Paşa Camii

(function () {
  const PART6_MONUMENTS = [
    {
      id: "sivas-kursunlu-hamami",
      eserAdi: "Sivas Kurşunlu Hamamı (Behram Paşa Hamamı)",
      il: "Sivas",
      ilId: "sivas",
      plaka: "58",
      bolge: "İç Anadolu",
      ilce: "Merkez",
      eserTuru: "Hamam",
      donem: "Klasik Dönem (1453–1600)",
      yapimYili: "1576 (III. Murad Dönemi)",
      mimar: "Klasik Dönem Osmanlı Mimarları",
      kullanimDurumu: "Özgün İşleviyle Yaşayan Tarihi Hamam",
      konum: "Behrampaşa Hanı Karşısı, Merkez / Sivas (39.7478° K, 37.0155° D)",
      kisaAciklama: "Behram Paşa tarafından 1576'da Sivas Behrampaşa Hanı'nın hemen karşısına yaptırılan; taş duvarlarında eritilmiş kurşun kenetler kullanılan, simetrik çifte hamam planlı klasik dönem su yapısıdır.",
      ayrintiliAciklama: "Eski Yemen Beylerbeyi Behram Paşa tarafından Hicri 984 (Miladi 1576) yılında Behrampaşa Hanı'nın hemen karşısında inşa ettirilmiştir. Kesme taş bloklarının arasına demir kenetlerle eritilmiş kurşun dökülerek sağlamlaştırıldığı için halk arasında 'Kurşunlu Hamam' adını almıştır. Kadınlar ve erkekler bölümü yan yana (çifte hamam) olarak dört eyvanlı ve köşe halvetli klasik şemada tasarlanmıştır. Han ile hamamın karşılıklı konumu, uzun yoldan gelen kervan tüccarlarının konaklama ve temizlik ihtiyacının birlikte planlandığını kanıtlar.",
      modelTipi: "hamam",
      modelConfig: {
        baseColor: "#cfc1a8",
        brickColor: "#8c6d53",
        domeColor: "#525e69"
      },
      kitabeBilgisi: {
        yeri: "Kadınlar kısmı giriş kapısı üzerindeki Hicri 984 (Miladi 1576) tarihli sülüs mermer kitabe",
        metinOzeti: "Mustafa Paşa oğlu Behram Paşa tarafından Hicri 984 (1576) yılında hayrat olarak inşa ettirildiği kayıtlıdır.",
        tarihselKanitDegeri: "Karşısındaki Behrampaşa Hanı'nın kitabesi kaybolmuşken, Kurşunlu Hamamı'nın üzerindeki 1576 tarihli sağlam kitabe, her iki ikiz yapının da tarihlendirilmesini sağlayan kilit epigrafik kanıttır!"
      },
      planBilgisi: {
        semaTipi: "Yan Yana İkiz Planlı, Dört Eyvanlı ve Köşe Halvetli Çifte Hamam",
        mekansalDuzen: "Erkekler ve kadınlar için ayrı girişler; her iki bölümde de kubbeli soyunmalık (camekân), ılıklık, dört eyvanlı ve dört köşe halvet hücreli sıcaklık ile arkada ortak su deposu ve külhan.",
        planAciklamasi: "İstanbul Haseki Hürrem Sultan Hamamı'ndaki boyuna sırt sırta simetrinin aksine, burada Anadolu'da yaygın olan 'yan yana ikiz çifte hamam' planı uygulanmıştır."
      },
      kullanimAmaci: {
        ilkIslev: "Behrampaşa Hanı'na gelen kervan yolcularının ve Sivas halkının yıkanma, temizlik ve sağlık merkezi.",
        kullaniciKitlesi: "Sivas halkı (kadınlar ve erkekler bölümleri) ve kervan tüccarları."
      },
      bugunkuIslev: {
        guncelKullanim: "450 yıldır kesintisiz olarak özgün hamam işleviyle hizmet vermektedir.",
        degisimVeSureklilik: "1576'dan günümüze hiçbir işlev değişikliğine uğramadan çalışan nadir Osmanlı hamamlarından biridir."
      },
      malzemeBilgisi: {
        anaMalzemeler: "Sivas kesme kalker taşı, demir kenetler ve eritilmiş kurşun bağlantılar, tuğla kubbeler ve cam fil gözleri.",
        yapimTeknigi: "Taş blokların depremde ayrılmaması için demir kenet yuvalarına eritilmiş kurşun dökülerek yapılan kagir yığma sistem."
      },
      mimariOzellikler: [
        "Taş bağlantılarında ve kubbelerinde kullanılan kurşun nedeniyle 'Kurşunlu Hamam' adı",
        "1576 tarihli özgün inşa kitabesi",
        "Yan yana simetrik çifte hamam (erkekler ve kadınlar bölümü) planı",
        "Dört eyvanlı ve dört köşe halvetli klasik sıcaklık düzeni",
        "Behrampaşa Hanı ile karşılıklı oluşturduğu 'Han-Hamam' ikilisi"
      ],
      korunmaDurumu: {
        durum: "Çok İyi Korunmuş (Aktif Kullanımda)",
        restorasyonBilgisi: "Vakıflar Genel Müdürlüğü tarafından 2005 yılında restore edilmiş olup özgün işlevini sürdürmektedir."
      },
      tarihselBaglam: {
        donemOzelligi: "16. yüzyılda kervan yolları üzerinde hanların hemen yanına hamam yapılarak yolcuların bulaşıcı hastalık ve kirden arındırıldığı halk sağlığı anlayışı.",
        sosyoKulturelRol: "Aynı ildeki Behrampaşa Hanı ile birlikte incelendiğinde, Osmanlı'da ticaret ve konaklama altyapısının hijyen yapılarıyla (hamam) ayrılmaz bir bütün olduğunu kanıtlar."
      },
      hotspots: [
        {
          id: "kitabe",
          kategori: "Kitabe",
          baslik: "1. 1576 Tarihli Behram Paşa Kitabesi",
          pos: [0, 2.0, 4.0],
          kisaBilgi: "Giriş kapısı üzerindeki 1576 tarihli kitabe, hem bu hamamın hem de hemen karşısındaki Behrampaşa Hanı'nın yapım tarihini aydınlatır.",
          tarihselKanitIpucu: "Bir yapının kitabesi kaybolduğunda, aynı külliyenin diğer yapısındaki kitabenin nasıl çapraz kanıt olarak kullanıldığını gösterir.",
          sesliMetin: "Kurşunlu Hamamı'nın girişindeki 1576 tarihli kitabe, tarihçiler için çok değerlidir; çünkü hemen karşısındaki Behrampaşa Hanı'nın kayıp kitabesinin tarihini de bu kitabe sayesinde kesin olarak öğreniyoruz."
        },
        {
          id: "plan",
          kategori: "Plan",
          baslik: "2. Yan Yana İkiz Çifte Hamam Planı",
          pos: [-2.6, 1.8, 0],
          kisaBilgi: "Erkekler ve kadınlar bölümleri yan yana bitişik inşa edilmiş, arkadaki külhan ve su deposu her iki bölümü ısıtacak şekilde ortak planlanmıştır.",
          tarihselKanitIpucu: "İstanbul Hürrem Sultan Hamamı (boyuna sırt sırta) ile Sivas Kurşunlu Hamamı (enine yan yana) karşılaştırması çifte hamam plan tiplerini öğretir.",
          sesliMetin: "İstanbul Hürrem Sultan Hamamı'nda iki bölüm sırt sırta dizilmişken, Sivas Kurşunlu Hamamı'nda erkekler ve kadınlar bölümleri yan yana ikiz plan şemasıyla inşa edilmiştir."
        },
        {
          id: "kullanim",
          kategori: "Kullanım Amacı",
          baslik: "3. Kervan Yolcuları İçin Karantina ve Hijyen",
          pos: [2.6, 1.8, 0],
          kisaBilgi: "Uzak diyarlardan gelen kervan tüccarları Behrampaşa Hanı'na yerleştikten sonra hemen karşıdaki bu hamamda yıkanarak temizlenirdi.",
          tarihselKanitIpucu: "Han ile hamamın karşılıklı yapılması, ticaret yollarında halk sağlığı ve hijyenin kurumsal olarak planlandığını kanıtlar.",
          sesliMetin: "Hemen yolun karşısındaki Behrampaşa Hanı'na inen yorgun kervan yolcuları, önce Kurşunlu Hamamı'na gelerek yıkanır ve temizlenirdi. Bu yerleşim, Osmanlı'da salgın hastalıklara karşı alınan doğal bir hijyen önlemiydi."
        },
        {
          id: "bugunku",
          kategori: "Bugünkü İşlev",
          baslik: "4. 450 Yıllık Kesintisiz Hamam İşlevi",
          pos: [0, 1.2, -3.5],
          kisaBilgi: "1576 yılından bugüne kadar işlevini hiç değiştirmeden Sivas halkına hizmet vermeye devam etmektedir.",
          tarihselKanitIpucu: "Beş asra yakın süredir aynı işlevle çalışması tarihsel sürekliliğin en güçlü örneklerinden biridir.",
          sesliMetin: "Kurşunlu Hamamı, 1576 yılından günümüze kadar tam 450 yıldır kesintisiz olarak hamam işleviyle hizmet vermeye devam etmektedir."
        },
        {
          id: "malzeme",
          kategori: "Malzeme ve Yapı Tekniği",
          baslik: "5. Kurşunlu Demir Kenetler ve Kesme Taş",
          pos: [-2.4, 1.0, 2.5],
          kisaBilgi: "Kesme taş blokların birbirine demir kenetlerle bağlanıp üzerlerine eritilmiş kurşun dökülmesi yapıya adını ve sağlamlığını vermiştir.",
          tarihselKanitIpucu: "Kurşunun paslanmayı önlemesi ve deprem sarsıntısını emmesi, 16. yüzyıl malzeme bilimini gösterir.",
          sesliMetin: "Taş blokları birbirine bağlayan demir kenetlerin paslanmaması ve depremde esnemesi için yuvalarına eritilmiş kurşun dökülmüştür. Yapı adını bu tekniğe borçludur."
        },
        {
          id: "mimari",
          kategori: "Mimari Özellikler",
          baslik: "6. Fil Gözlü Kubbeler ve Göbek Taşı",
          pos: [0, 3.2, 0.5],
          kisaBilgi: "Sıcaklık ve soyunmalık kubbelerindeki aydınlık feneri ve cam fil gözleri.",
          tarihselKanitIpucu: "Kışın çok soğuk olan Sivas'ta ısıyı içeride tutmak için duvarlar kalın ve penceresiz, kubbeler ise çift kat yalıtımlıdır.",
          sesliMetin: "Sivas'ın dondurucu kış günlerinde içerideki sıcaklığı korumak için duvarlar oldukça kalın örülmüş ve kubbeler yalıtılmıştır."
        },
        {
          id: "korunma",
          kategori: "Korunma Durumu",
          baslik: "7. Özgün Cehennemlik ve Su Tesisatının Korunumu",
          pos: [2.2, 2.0, -2.0],
          kisaBilgi: "Zemin altındaki ısıtma kanalları ve mermer kurnalar özenle korunmuştur.",
          tarihselKanitIpucu: "Sürekli kullanılan yapıların bakımlı kaldığını gösterir.",
          sesliMetin: "Yapının kesintisiz kullanılması, ısıtma ve su sistemlerinin yüzyıllar boyunca düzenli bakım görmesini sağlamıştır."
        },
        {
          id: "baglam",
          kategori: "Tarihsel Bağlam",
          baslik: "8. Aynı İldeki İki Eser: Behrampaşa Hanı ve Kurşunlu Hamamı",
          pos: [1.8, 0.9, 3.0],
          kisaBilgi: "Aynı devlet adamının (Behram Paşa) aynı yıl (1576) Sivas'ta karşılıklı yaptırdığı han ve hamam, şehir planlamasının birbirini nasıl tamamladığını gösterir.",
          tarihselKanitIpucu: "Aynı ildeki iki eseri karşılaştırarak ticaret ve sosyal/hijyen altyapısının bütünlüğünü kanıtlar.",
          sesliMetin: "Behram Paşa'nın Sivas'ta yolun bir tarafına han, tam karşısına ise hamam yaptırması, Osmanlı şehirciliğinde yapıların birbirini tamamlayan bir sistem olarak kurgulandığını kanıtlar."
        }
      ],
      karsilastirilabilirEserler: ["sivas-behrampasa-hani", "istanbul-hurrem-sultan-hamami", "diyarbakir-behram-pasa-camii"],
      kanitTemelliSorular: [
        {
          id: "skh-q1",
          tip: "gorsel_kanit",
          zorluk: "Kolay",
          ilgiliAlan: "Aynı İldeki Eserler Arası Karşılaştırma",
          kanitMetni: "KANIT 1 (Kentsel Yerleşim): 1576 yılında Behram Paşa, Sivas'ta kervanların konakladığı Behrampaşa Hanı'nı inşa ettirirken, hemen yolun karşısına da Kurşunlu Hamamı'nı yaptırmıştır.",
          soru: "Aynı baninin Sivas'ta bir ticaret hanının tam karşısına anıtsal bir hamam inşa ettirmesinin temel amacı nedir?",
          secenekler: [
            "Uzun yoldan gelen kervan tüccarlarının ve şehir halkının konaklama, temizlik ve hijyen ihtiyaçlarını birbirini tamamlayan bir bütün olarak karşılamak ve vakfa gelir sağlamak",
            "Hanın manzarasını kapatmak",
            "Kervan develerini hamamın sıcaklığında yıkamak",
            "Sivas'ta cami yapılmasını engellemek"
          ],
          dogruIndeks: 0,
          ipucu: "'3. Kervan Yolcuları İçin Karantina ve Hijyen' ve '8. Aynı İldeki İki Eser' bilgi noktalarını inceleyin.",
          aciklama: "Doğru! Osmanlı kervan menzillerinde han ve hamam ikilisi hem yolcuların temizlik/sağlık ihtiyacını karşılar hem de vakıf sistemine düzenli gelir üretirdi.",
          kanitDosyasiBasligi: "Şehircilik Kanıtı: Han ve Hamam İkilisinin Tamamlayıcılığı"
        }
      ],
      kaynakca: [
        "Kültür Portalı, 'Kurşunlu Hamamı - Sivas', T.C. Kültür ve Turizm Bakanlığı.",
        "Acun, Hakkı (1988). Sivas'ta Türk Mimarisi."
      ],
      ogretmenNotlari: {
        kazanimlar: [
          "Aynı ildeki iki eseri (Sivas Behrampaşa Hanı ve Sivas Kurşunlu Hamamı) ve farklı illerdeki aynı tür eserleri (İstanbul Hürrem Sultan Hamamı ve Sivas Kurşunlu Hamamı) karşılaştırır."
        ],
        etkinlikOnerisi: "Öğrencilerden Sivas'taki iki eseri (Han ve Hamam) veya İstanbul ile Sivas'taki iki hamamı karşılaştırmalarını isteyin."
      }
    },
    {
      id: "konya-sultan-selim-camii",
      eserAdi: "Konya Sultan Selim Camii (Selimiye Camii)",
      il: "Konya",
      ilId: "konya",
      plaka: "42",
      bolge: "İç Anadolu",
      ilce: "Karatay",
      eserTuru: "Cami",
      donem: "Klasik Dönem (1453–1600)",
      yapimYili: "1558–1567 (Kanuni / II. Selim Dönemi)",
      mimar: "Klasik Dönem Hassa Mimarları (Mimar Sinan Ekolü)",
      kullanimDurumu: "Aktif İbadethane (Mevlana Külliyesi Yanı)",
      konum: "Mevlana Meydanı, Karatay / Konya (37.8706° K, 32.5042° D)",
      kisaAciklama: "Sultan II. Selim'in Konya Valiliği (Şehzadeliği) sırasında yapımına başlanıp padişahlığında (1567) tamamlanan; Mevlana Dergâhı'nın hemen batısında yer alan, Klasik Osmanlı mimarisinin Konya'daki en anıtsal temsilcisidir.",
      ayrintiliAciklama: "Sultan II. Selim'in Konya Sancakbeyi (Valisi) olduğu dönemde 1558'de inşasına başlanan ve tahta çıktıktan sonra 1567'de tamamlanan eser, Konya'daki en büyük Klasik Dönem Osmanlı selatin camisidir. İstanbul Eski Fatih Camii şemasına benzer biçimde merkezi ana kubbenin kıble yönünde bir yarım kubbeyle desteklendiği, yanlarda üçer küçük kubbeli sahınların yer aldığı, yedi kubbeli son cemaat yeri ve çift minaresiyle 16. yüzyıl klasik üslubunun tüm ağırbaşlılığını yansıtır. Aynı şehirdeki 19. yüzyıl Aziziye Camii ile karşılaştırıldığında Klasik ve Geç Osmanlı üslup farkını aynı ilde gözlemleme imkânı sunar.",
      modelTipi: "cami",
      modelConfig: {
        baseColor: "#d9ccb8",
        domeColor: "#4f5b66",
        minaretCount: 2,
        centralDomeRadius: 2.3,
        baldachin: "tetragonal"
      },
      kitabeBilgisi: {
        yeri: "Kuzey cümle kapısı üzerindeki Hicri 974 (Miladi 1566/1567) tarihli kitabe ve arşiv kayıtları",
        metinOzeti: "Kanuni Sultan Süleyman'ın oğlu Sultan II. Selim Han tarafından şehzadeliğinde başlatılıp saltanatının ilk yılında (1567) tamamlandığı kayıtlıdır.",
        tarihselKanitDegeri: "II. Selim'in şehzadeliğinde Konya'da bu camiyi, padişahlığında ise Edirne'de Selimiye Camii'ni yaptırması iki eser arasında tarihsel bir bağ kurar."
      },
      planBilgisi: {
        semaTipi: "Mihrap Yönünde Yarım Kubbeyle Destekli Merkezi Kubbeli Klasik Plan",
        mekansalDuzen: "Önde 6 antik sütunlu ve 7 kubbeli son cemaat yeri, iki yanda tek şerefeli çift minare; harimde merkezi büyük kubbe, kıble yönünde bir yarım kubbe ve yanlarda üçer kubbeli yan sahınlar.",
        planAciklamasi: "15. yüzyıl sonu İstanbul Fatih Camii ile 16. yüzyıl Süleymaniye Camii geleneğini Anadolu'nun kalbi Konya'ya taşıyan klasik selatin camii planıdır."
      },
      kullanimAmaci: {
        ilkIslev: "Mevlana Dergâhı'nı ziyaret edenlerin ve Konya halkının Cuma ve vakit namazlarını kıldığı selatin külliyesi (cami, kütüphane ve imaret).",
        kullaniciKitlesi: "Konya halkı, Mevlevi dervişleri, seyyahlar ve hac kervanları."
      },
      bugunkuIslev: {
        guncelKullanim: "Aktif ibadethane ve Mevlana Meydanı'nın batı odak noktası.",
        degisimVeSureklilik: "460 yıldır Mevlana Müzesi/Dergâhı ile yan yana ibadet işlevini kesintisiz sürdürmektedir."
      },
      malzemeBilgisi: {
        anaMalzemeler: "Kesme Gödene ve Sille taşı, beyaz-kırmızı mermer (taçkapı ve minber), kurşun kaplı kubbeler.",
        yapimTeknigi: "Klasik dönem kesme taş yığma sistem, mukarnaslı taş işçiliği ve kurşun örtülü kubbe/yarım kubbe statiği."
      },
      mimariOzellikler: [
        "Merkezi kubbe ve kıble yönünde yarım kubbeli Klasik Osmanlı planı",
        "7 kubbeli anıtsal son cemaat yeri ve iki yanda klasik çift minare",
        "Mukarnas kavsaralı, iki renkli taş geçmeli görkemli cümle kapısı",
        "Beyaz mermerden oyulmuş geometrik şebekeli klasik minber ve mihrap",
        "Selçuklu başkenti Konya'da Mevlana Külliyesi ile kurduğu tarihsel komşuluk"
      ],
      korunmaDurumu: {
        durum: "Çok İyi Korunmuş",
        restorasyonBilgisi: "1685 ve 1888 yıllarında ve 2015-2020 döneminde Vakıflar Genel Müdürlüğü tarafından restore edilmiştir."
      },
      tarihselBaglam: {
        donemOzelligi: "16. yüzyılda Anadolu Selçuklu başkenti Konya'nın Osmanlı şehzade sancağı ve hac yolu menzili olarak yeniden imar edildiği dönem.",
        sosyoKulturelRol: "Aynı şehirdeki (Konya) 1567 tarihli Sultan Selim Camii ile 1874 tarihli Aziziye Camii'ni yan yana karşılaştırarak Klasik Dönem ile Geç Dönem arasındaki 300 yıllık farkı tek şehirde görmeyi sağlar."
      },
      hotspots: [
        {
          id: "kitabe",
          kategori: "Kitabe",
          baslik: "1. 1567 Sultan II. Selim Kitabesi",
          pos: [0, 2.1, 4.0],
          kisaBilgi: "Sultan II. Selim'in Konya Valiliği sırasında başlattığı ve padişah olduğunda 1567'de tamamladığı selatin camisidir.",
          tarihselKanitIpucu: "Aynı padişahın Konya'da Sultan Selim Camii'ni, Edirne'de ise Selimiye Camii'ni yaptırması iki şehir arasında karşılaştırma imkânı sunar.",
          sesliMetin: "Sultan İkinci Selim, Konya'da şehzade sancakbeyi olarak görev yaparken bu caminin inşasını başlatmış, padişah olduktan sonra da Edirne'deki ünlü Selimiye Camii'ni yaptırmıştır."
        },
        {
          id: "plan",
          kategori: "Plan",
          baslik: "2. Yarım Kubbeli Klasik Selatin Camii Planı",
          pos: [-2.4, 2.0, 0],
          kisaBilgi: "Ortada merkezi kubbe, mihrap önünde yarım kubbe ve iki yanda üçer küçük kubbeden oluşan klasik plan şeması.",
          tarihselKanitIpucu: "Başkent İstanbul'daki selatin camii planının Konya'da birebir uygulandığını gösterir.",
          sesliMetin: "Caminin plan şeması, İstanbul'daki klasik selatin camilerinin mimari dilini Anadolu'nun kalbi Konya'ya taşımıştır."
        },
        {
          id: "kullanim",
          kategori: "Kullanım Amacı",
          baslik: "3. Mevlana Dergâhı Komşuluğunda İbadet ve Hac Menzili",
          pos: [2.4, 1.8, 0],
          kisaBilgi: "İstanbul'dan Şam ve Mekke'ye giden hac kervanlarının Konya'da Mevlana Dergâhı'nı ziyaret ettikten sonra namaz kıldığı ve imaretinde ağırlandığı merkezdi.",
          tarihselKanitIpucu: "Mevlana Külliyesi'nin hemen batısına yapılması, Osmanlı padişahlarının Mevlana ve Selçuklu mirasına verdiği değeri kanıtlar.",
          sesliMetin: "Caminin hemen Mevlana Dergâhı'nın yanına inşa edilmesi, Osmanlı sultanlarının Anadolu'nun manevi mirasına ve Selçuklu geçmişine duyduğu derin saygının kanıtıdır."
        },
        {
          id: "bugunku",
          kategori: "Bugünkü İşlev",
          baslik: "4. Mevlana Meydanı'nın Yaşayan Klasik Anıtı",
          pos: [0, 1.0, -3.0],
          kisaBilgi: "Günümüzde Mevlana Müzesi'ni ziyaret eden milyonlarca insanın karşılaştığı ve aktif ibadetin sürdüğü anıtsal yapıdır.",
          tarihselKanitIpucu: "460 yıldır kesintisiz ibadet işlevini korumaktadır.",
          sesliMetin: "Günümüzde Konya Mevlana Meydanı'nda yükselen yapı, Selçuklu ve Osmanlı mimarisinin yan yana uyumunu binlerce ziyaretçiye göstermektedir."
        },
        {
          id: "malzeme",
          kategori: "Malzeme ve Yapı Tekniği",
          baslik: "5. Kesme Gödene Taşı ve Kurşun Kubbeler",
          pos: [-2.2, 2.4, -1.8],
          kisaBilgi: "Düzgün kesme taş cepheler, mukarnaslı mermer taçkapı ve kurşun kaplı kubbe dizisi.",
          tarihselKanitIpucu: "Klasik dönem taş işçiliğinin sade ve anıtsal oranlarını yansıtır.",
          sesliMetin: "Kesme taş duvarların sadeliği ve kubbe kurşunlarının kademeli yükselişi, Klasik Dönem Osmanlı mimarisinin ağırbaşlı estetiğini yansıtır."
        },
        {
          id: "mimari",
          kategori: "Mimari Özellikler",
          baslik: "6. Mukarnaslı Taçkapı, Mermer Minber ve Çift Minare",
          pos: [0, 3.6, 0],
          kisaBilgi: "Aynı ildeki Aziziye Camii'nin Barok kıvrımlarının aksine, burada mukarnaslı başlıklar, sivri kemerler ve klasik geometrik mermer minber yer alır.",
          tarihselKanitIpucu: "Konya'daki iki camiyi (Sultan Selim ve Aziziye) karşılaştırırken mukarnas (16. yy) ile Barok kıvrım (19. yy) farkı en net kanıttır.",
          sesliMetin: "Konya'daki bu caminin mukarnaslı klasik taçkapısını, birkaç yüz metre ilerideki 19. yüzyıl Aziziye Camii'nin Barok pencereleriyle karşılaştırdığınızda iki dönem arasındaki farkı hemen yakalayabilirsiniz."
        },
        {
          id: "korunma",
          kategori: "Korunma Durumu",
          baslik: "7. Payandalar ve Kubbe Statiğinin Korunumu",
          pos: [2.2, 2.0, -2.0],
          kisaBilgi: "Güney cephedeki kemerli payandalar yarım kubbenin yükünü karşılayarak yapıyı yüzyıllarca ayakta tutmuştur.",
          tarihselKanitIpucu: "Dış payandalar kubbenin yatay itki kuvvetini toprağa aktaran mühendislik elemanlarıdır.",
          sesliMetin: "Kıble duvarının dışındaki güçlü taş payandalar, yarım kubbenin yatay basıncını dengeleyerek yapının 460 yıl sağlam kalmasını sağlamıştır."
        },
        {
          id: "baglam",
          kategori: "Tarihsel Bağlam",
          baslik: "8. Konya'da İki Dönem: Sultan Selim (1567) ve Aziziye (1874)",
          pos: [-1.8, 0.9, 3.0],
          kisaBilgi: "Birbirine yürüme mesafesindeki bu iki Konya camisi, öğrencilere Klasik Dönem ile Geç Osmanlı Dönemi'ni aynı şehirde karşılaştırma fırsatı verir.",
          tarihselKanitIpucu: "Aynı il ve aynı iklimde yapılan iki cami arasındaki farkın doğrudan 'dönemsel üslup değişimi'nden kaynaklandığını kanıtlar.",
          sesliMetin: "Konya'da birbirine çok yakın olan 1567 tarihli Sultan Selim Camii ile 1874 tarihli Aziziye Camii'ni karşılaştırmak, aynı şehirde üç yüz yıl arayla mimari zevkin nasıl değiştiğini kanıtlar."
        }
      ],
      karsilastirilabilirEserler: ["konya-aziziye-camii", "edirne-selimiye-camii", "istanbul-suleymaniye-camii"],
      kanitTemelliSorular: [
        {
          id: "kss-q1",
          tip: "gorsel_kanit",
          zorluk: "Orta",
          ilgiliAlan: "Aynı İlde Dönemsel Karşılaştırma",
          kanitMetni: "KANIT 1 (Aynı Şehirde İki Cami): Konya'da bulunan 1567 tarihli Sultan Selim Camii'nde sivri kemerler, mukarnaslı sütun başlıkları ve ölçülü pencereler yer alırken; yine Konya'da bulunan 1874 tarihli Aziziye Camii'nde kapılardan büyük yuvarlak kemerli pencereler, şadırvanlı Barok minareler ve S-C kıvrımlı bezemeler yer almaktadır.",
          soru: "Her iki cami de aynı şehirde (Konya) ve aynı yerel taşla yapıldığı halde mimari üsluplarının bu kadar farklı olmasının temel nedeni nedir?",
          secenekler: [
            "İnşa edildikleri tarihsel dönemlerin (16. yüzyıl Klasik Dönem ile 19. yüzyıl Geç Osmanlı/Batılılaşma Dönemi) sanat ve estetik anlayışlarının farklı olması",
            "Konya'nın ikliminin 19. yüzyılda tropikal iklime dönüşmesi",
            "Aziziye Camii'nin aslında bir kale olarak inşa edilmesi",
            "Sultan Selim Camii'nin ahşaptan yapılmış olması"
          ],
          dogruIndeks: 0,
          ipucu: "'6. Mukarnaslı Taçkapı' ve '8. Konya'da İki Dönem: Sultan Selim (1567) ve Aziziye (1874)' noktalarını inceleyin.",
          aciklama: "Mükemmel! Coğrafya ve malzeme sabit tutulduğunda (her ikisi de Konya'da ve Gödene taşından), iki eser arasındaki fark bize doğrudan 'zamansal/dönemsel değişimi' (16. yy Klasik vs 19. yy Barok-Ampir) kanıtlar!",
          kanitDosyasiBasligi: "Kontrollü Karşılaştırma Kanıtı: Aynı Şehirde Klasik ve Geç Dönem Farkı"
        }
      ],
      kaynakca: [
        "Kültür Portalı, 'Selimiye Camii - Konya', T.C. Kültür ve Turizm Bakanlığı.",
        "Karpuz, Haşim (2009). Türk Kültür Varlıkları Envanteri: Konya, TTK Yayınları."
      ],
      ogretmenNotlari: {
        kazanimlar: [
          "Aynı ildeki (Konya) iki camiyi (1567 Sultan Selim Camii ve 1874 Aziziye Camii) karşılaştırarak coğrafya sabitken dönemsel üslup değişimini kanıtlar."
        ],
        etkinlikOnerisi: "Öğrencilerden Karşılaştırma Ekranında Konya Sultan Selim Camii ile Konya Aziziye Camii'ni yan yana açarak hem 'Aynı İldeki Eserler' hem de 'Dönemsel Karşılaştırma' yapmalarını isteyin."
      }
    }
  ];

  window.OTTOMAN_MONUMENTS = (window.OTTOMAN_MONUMENTS || []).concat(PART6_MONUMENTS);
})();
