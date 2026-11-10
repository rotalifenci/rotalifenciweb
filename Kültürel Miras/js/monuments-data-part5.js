// MİRAS-3B: Osmanlı Eserleri Veri Tabanı — Bölüm 5 (Anadolu'nun 7 Bölgesinden Seçkin Eserler)
// TÜBİTAK 2204-B Tarih Projesi — Şanlıurfa, Kastamonu, Trabzon, Ankara, İzmir, Van

(function () {
  const PART5_MONUMENTS = [
    {
      id: "ankara-mahmud-pasa-bedesteni",
      eserAdi: "Ankara Mahmud Paşa Bedesteni ve Kurşunlu Han",
      il: "Ankara",
      ilId: "ankara",
      plaka: "06",
      bolge: "İç Anadolu",
      ilce: "Altındağ (Ulus)",
      eserTuru: "Han",
      donem: "Erken Osmanlı (1299–1453)",
      yapimYili: "1464–1471 (Fatih Sultan Mehmed Dönemi)",
      mimar: "Atik Sinan / Fatih Dönemi Mimarları",
      kullanimDurumu: "Müze (Anadolu Medeniyetleri Müzesi - Avrupa'da Yılın Müzesi Ödüllü)",
      konum: "Atpazarı, Ankara Kalesi Eteği, Altındağ / Ankara (39.9383° K, 32.8619° D)",
      kisaAciklama: "Fatih Sultan Mehmed'in sadrazamı Mahmud Paşa tarafından 1464–1471 yıllarında Ankara tiftik (sof) kumaşı ticareti için yaptırılan; 10 kubbeli kapalı bedesten ve bitişiğindeki iki katlı Kurşunlu Han'dan oluşan, günümüzde Anadolu Medeniyetleri Müzesi olarak hizmet veren külliyedir.",
      ayrintiliAciklama: "15. ve 16. yüzyıllarda dünyaca ünlü Ankara keçisi tiftiğinden dokunan 'sof' kumaşlarının uluslararası borsası olarak Fatih'in sadrazamı Veli Mahmud Paşa tarafından 1464-1471 yıllarında inşa ettirilmiştir. Ortada dört kalın taş paye üzerine oturan 10 kubbeli kapalı Bedesten ve hemen bitişiğindeki revaklı avlulu Kurşunlu Han'dan oluşur. 1881 yangınından sonra terk edilen yapı, Atatürk'ün talimatıyla 1938-1968 yılları arasında restore edilerek 1997'de 'Avrupa'da Yılın Müzesi' seçilen Anadolu Medeniyetleri Müzesi'ne dönüştürülmüştür.",
      modelTipi: "han",
      modelConfig: {
        baseColor: "#cfc3ae",
        brickColor: "#a4422c",
        roofColor: "#4f5b66",
        hasKioskMasjid: false,
        floors: 2,
        courtyardRatio: 0.60,
        archCountX: 7,
        archCountZ: 5
      },
      kitabeBilgisi: {
        yeri: "Mahmud Paşa Vakfiyesi ve Ankara Şer'iyye Sicilleri (Hicri 870–876 / Miladi 1464–1471)",
        metinOzeti: "Sadrazam Mahmud Paşa'nın Ankara'daki bu bedesten ve hanın gelirlerini İstanbul'daki Mahmudpaşa Külliyesi'ne vakfettiği kayıtlıdır.",
        tarihselKanitDegeri: "Kurşunlu Han onarımında duvar içinde bulunan Fatih Sultan Mehmed dönemi sikkeleri ve vakfiye kayıtları, yapının tarihlendirilmesini kesinleştiren arkeolojik ve yazılı kanıtlardır."
      },
      planBilgisi: {
        semaTipi: "10 Kubbeli Kapalı Bedesten ve İki Katlı Revaklı Kurşunlu Han Birleşik Planı",
        mekansalDuzen: "Bedesten bölümünde ortada 10 kubbeli güvenli değerli mal salonu ve çevresinde 102 kemerli arasta dükkânı; bitişiğindeki Kurşunlu Han'da ise bodrum ahır katı ve iki katlı revaklı avlu etrafında 56 tüccar odası.",
        planAciklamasi: "Değerli sof kumaşlarının yangın ve hırsızlığa karşı korunduğu kalın taş kubbeli 'Bedesten' ile kervanların konakladığı 'Han' yan yana planlanarak tam bir ticaret kompleksi oluşturulmuştur."
      },
      kullanimAmaci: {
        ilkIslev: "Ankara'nın dünyaca ünlü 'sof' (tiftik/angora) kumaşlarının saklandığı, mühürlendiği ve Venedik, Lehistan, İngiliz ve Osmanlı tüccarlarına satıldığı ticaret ve finans merkezi.",
        kullaniciKitlesi: "Sof tüccarları, Avrupalı ticaret kumpanyası temsilcileri, kervancılar."
      },
      bugunkuIslev: {
        guncelKullanim: "Anadolu Medeniyetleri Müzesi (Bedesten teşhir salonu, Kurşunlu Han ise müze idaresi, kütüphane ve eğitim salonları).",
        degisimVeSureklilik: "Ticari işlevinden kültürel/müze işlevine dönüşerek (işlev değişimi) Anadolu'nun binlerce yıllık tarihini koruyan ödüllü bir müze olarak yaşatılmaktadır."
      },
      malzemeBilgisi: {
        anaMalzemeler: "Ankara taşı (andezit), kesme taş, tuğla (almaşık duvar ve kubbeler), kurşun çatı kaplaması.",
        yapimTeknigi: "Kalın kagir taş-tuğla almaşık duvarlar ve yangına dayanıklı 10 adet kurşun kaplı kubbe."
      },
      mimariOzellikler: [
        "10 büyük kubbeyle örtülü yüksek güvenlikli kapalı Bedesten salonu",
        "Bitişiğinde iki katlı revaklı avlulu ve 56 odalı Kurşunlu Han",
        "Ankara andezit taşı ve tuğladan oluşan almaşık duvar örgüsü",
        "Dört yöne açılan demir kaplamalı anıtsal bedesten kapıları",
        "Tarihi bir ticaret yapısının modern müzeciliğe uyarlanmasının dünyadaki en başarılı örneklerinden biri"
      ],
      korunmaDurumu: {
        durum: "Çok İyi Korunmuş (1997 Avrupa'da Yılın Müzesi Ödüllü)",
        restorasyonBilgisi: "1881 yangınından sonra harabe halindeyken Cumhuriyet döneminde restore edilerek Anadolu Medeniyetleri Müzesi olarak dünya kültür mirasına kazandırılmıştır."
      },
      tarihselBaglam: {
        donemOzelligi: "15. ve 16. yüzyıllarda Ankara'nın yalnızca tiftik keçisiyle değil, binlerce dokuma tezgâhıyla küresel bir tekstil üretim ve ihracat merkezi olduğu dönem.",
        sosyoKulturelRol: "Geçmişteki işlev (15. yy uluslararası tekstil borsası) ile bugünkü işlev (21. yy dünya çapında arkeoloji müzesi) karşılaştırması için en güçlü örneklerden biridir."
      },
      hotspots: [
        {
          id: "kitabe",
          kategori: "Kitabe ve Arkeolojik Kanıt",
          baslik: "1. Mahmud Paşa Vakfiyesi ve 1471 Sikkeleri",
          pos: [0, 2.1, 4.2],
          kisaBilgi: "1946 restorasyonunda Kurşunlu Han duvarında bulunan Fatih Sultan Mehmed dönemi gümüş akçeleri ve vakfiye kayıtları yapının 1464-1471 tarihini kesinleştirmiştir.",
          tarihselKanitIpucu: "Nümismatik (sikke) buluntular ile yazılı vakfiye belgelerinin birbirini doğrulaması tarihsel araştırma yönteminin en güzel örneğidir.",
          sesliMetin: "1946 yılındaki restorasyon sırasında duvar içinde bulunan Fatih Sultan Mehmed dönemine ait gümüş sikkeler, vakfiye kayıtlarındaki 1464-1471 inşa tarihini arkeolojik olarak da kanıtlamıştır."
        },
        {
          id: "plan",
          kategori: "Plan",
          baslik: "2. Bedesten ve Han Birlikteliği (10 Kubbeli Salon + Avlu)",
          pos: [-3.0, 2.0, 0],
          kisaBilgi: "10 kubbeli kapalı Bedesten en değerli kumaş ve mücevherlerin kasası, yanındaki açık avlulu Kurşunlu Han ise kervanların konaklama yeri olarak planlanmıştır.",
          tarihselKanitIpucu: "Osmanlı ticaret mimarisinde 'Bedesten' (kapalı borsa/kasa) ile 'Han' (avlulu konaklama) arasındaki plan ve işlev farkını gösterir.",
          sesliMetin: "Bu külliye, öğrencilerin Bedesten ile Han arasındaki farkı anlaması için harika bir örnektir: Üzeri on kubbeyle tamamen kapalı olan Bedesten değerli kumaşların korunduğu yüksek güvenlikli borsa binasıdır; yanındaki açık avlulu Kurşunlu Han ise tüccarların konakladığı yerdir."
        },
        {
          id: "kullanim",
          kategori: "Kullanım Amacı",
          baslik: "3. Ankara Sof (Tiftik) Kumaşı ve Küresel Ticaret",
          pos: [3.0, 1.8, 0],
          kisaBilgi: "16. yüzyılda Ankara'da üretilen parlak sof kumaşları bu bedestende damgalanır ve Venedik, Lehistan ve İstanbul'a ihraç edilirdi.",
          tarihselKanitIpucu: "Hollandalı ressamların 16. yüzyılda çizdiği 'Ankara Manzarası' tablosunda bile sof dokuyan ve bedestene mal taşıyan tüccarlar betimlenmiştir.",
          sesliMetin: "15. ve 16. yüzyıllarda Ankara, yalnızca tiftik keçisi yetiştiren bir yer değil, dünyanın en pahalı ve parlak kumaşlarından biri olan Ankara sofunun dokunduğu bir sanayi şehriydi."
        },
        {
          id: "bugunku",
          kategori: "Bugünkü İşlev",
          baslik: "4. İşlev Değişimi: Ticaret Merkezinden Avrupa'da Yılın Müzesi'ne",
          pos: [0, 3.2, 0],
          kisaBilgi: "Günümüzde Anadolu Medeniyetleri Müzesi olarak hizmet vermekte; 10 kubbeli bedesten salonunda Anadolu'nun Paleolitik, Hitit, Frig ve Urartu hazineleri sergilenmektedir.",
          tarihselKanitIpucu: "15. yüzyılda değerli ticari malları koruyan kagir kubbeli mekanın, bugün paha biçilemez müze eserlerini koruması yeniden işlevlendirmenin (adaptive reuse) zirvesidir.",
          sesliMetin: "Beş yüz elli yıl önce en değerli kumaşları ve tüccar kasalarını koruyan on kubbeli Bedesten, bugün Anadolu Medeniyetleri Müzesi olarak insanlık tarihinin en değerli arkeolojik hazinelerini korumaktadır."
        },
        {
          id: "malzeme",
          kategori: "Malzeme ve Yapı Tekniği",
          baslik: "5. Ankara Andezit Taşı ve Kurşun Kubbeler",
          pos: [-2.8, 2.3, -2.5],
          kisaBilgi: "Yerel pembe-gri Ankara andezit taşı, kırmızı tuğla kuşaklar ve 10 kubbeyi örten kurşun levhalar (Kurşunlu Han adını buradan alır).",
          tarihselKanitIpucu: "Çatısında kullanılan kurşun kaplama nedeniyle hana halk arasında 'Kurşunlu Han' adı verilmiştir.",
          sesliMetin: "Hanın kubbe ve çatı örtüsünde kullanılan kurşun levhalar nedeniyle yapı tarihte Kurşunlu Han adıyla anılmıştır."
        },
        {
          id: "mimari",
          kategori: "Mimari Özellikler",
          baslik: "6. Dört Dev Taş Paye ve 10 Kubbeli Örtü",
          pos: [2.8, 2.3, -2.5],
          kisaBilgi: "Bedestenin ortasında sıralanan dört kalın taş ayak, 10 kubbeyi taşıyarak geniş ve güvenli bir iç salon oluşturur.",
          tarihselKanitIpucu: "Kalın taş duvarlar ve yüksek pencereler, bedestenlerin yangın ve soyguna karşı kale gibi tasarlandığını kanıtlar.",
          sesliMetin: "Bedestenlerin pencereleri çok yüksekte ve demir parmaklıklıdır; çünkü bu yapılar aynı zamanda şehrin merkez bankası ve emanet kasası gibi çalışırdı."
        },
        {
          id: "korunma",
          kategori: "Korunma Durumu",
          baslik: "7. Cumhuriyet Dönemi Restorasyonu ve Müzeye Dönüşüm",
          pos: [-2.0, 0.9, 2.8],
          kisaBilgi: "1881 yangınından sonra 57 yıl atıl kalan yapı, 1938'de başlatılan restorasyonla kurtarılmış ve 1997'de Avrupa'da Yılın Müzesi ödülünü almıştır.",
          tarihselKanitIpucu: "Harabe halindeki bir Osmanlı eserinin bilimsel restorasyonla dünya çapında bir müzeye dönüştürülebileceğini kanıtlar.",
          sesliMetin: "1881 yangınından sonra harabeye dönen bu iki yapı, Cumhuriyet'in kültür mirası vizyonuyla restore edilerek 1997 yılında İsviçre'de Avrupa'da Yılın Müzesi ödülünü kazanmıştır."
        },
        {
          id: "baglam",
          kategori: "Tarihsel Bağlam",
          baslik: "8. Bursa Koza Han ile Karşılaştırma: İpek ve Sof Ticareti",
          pos: [2.0, 0.9, 2.8],
          kisaBilgi: "Bursa Koza Han (ipek) ve Ankara Mahmud Paşa Bedesteni/Kurşunlu Han (sof/tiftik), her iki şehirdeki ticaret gelirlerinin İstanbul'daki külliyelere vakfedildiğini gösterir.",
          tarihselKanitIpucu: "Bursa'da ipek, Ankara'da sof ticaretinin Osmanlı şehir ekonomisindeki uzmanlaşmayı sağladığını kanıtlar.",
          sesliMetin: "Bursa Koza Han ipek ticaretinin merkeziyken, Ankara Kurşunlu Han ve Bedesteni tiftik yani sof kumaşı ticaretinin merkeziydi. Üstelik her ikisinin de vakıf gelirleri İstanbul'daki külliyeleri besliyordu."
        }
      ],
      karsilastirilabilirEserler: ["bursa-koza-han", "tokat-tashan", "sivas-behrampasa-hani", "sanliurfa-gumruk-hani"],
      kanitTemelliSorular: [
        {
          id: "amp-q1",
          tip: "coktan_secmeli",
          zorluk: "Orta",
          ilgiliAlan: "Geçmişteki İşlev – Bugünkü İşlev Karşılaştırması",
          kanitMetni: "KANIT 1 (Tarihsel Süreç): 1471 yılında Ankara'da değerli 'sof' kumaşlarının güvenli ticareti ve tüccar konaklaması için inşa edilen Mahmud Paşa Bedesteni ve Kurşunlu Han, 1881 yangınından sonra işlevini yitirmiş; Cumhuriyet döneminde restore edilerek bugün 'Anadolu Medeniyetleri Müzesi' olarak hizmet vermeye başlamıştır.",
          soru: "Bu tarihsel süreç, kültürel miras yapılarında 'geçmişteki işlev – bugünkü işlev' ilişkisi açısından aşağıdakilerden hangisini gösterir?",
          secenekler: [
            "Özgün ticari işlevi sona eren tarihi bir yapının, mimari dokusu korunarak 'müze ve eğitim' gibi topluma faydalı yeni bir kültürel işlevle yaşatılabileceğini",
            "Yangın geçiren bütün tarihi yapıların tamamen yıkılması gerektiğini",
            "Yapının 15. yüzyılda da arkeoloji müzesi olarak inşa edildiğini",
            "Osmanlı döneminde Ankara'da hiç ticaret yapılmadığını"
          ],
          dogruIndeks: 0,
          ipucu: "'4. İşlev Değişimi: Ticaret Merkezinden Avrupa'da Yılın Müzesi'ne' bilgi noktasını inceleyin.",
          aciklama: "Çok doğru! Mimarlık ve koruma biliminde buna 'yeniden işlevlendirme' (adaptive reuse) denir; tarihi yapı fiziksel olarak korunurken çağın ihtiyacına uygun saygın bir kültür-eğitim işlevi kazanmıştır.",
          kanitDosyasiBasligi: "Yeniden İşlevlendirme Kanıtı: Bedestenden Dünya Müzesine"
        }
      ],
      kaynakca: [
        "Kültür Portalı, 'Anadolu Medeniyetleri Müzesi (Mahmut Paşa Bedesteni ve Kurşunlu Han) - Ankara'.",
        "Öz규ç, Tahsin (1946). 'Kurşunlu Han ve Mahmut Paşa Bedesteni', TTK Belleten."
      ],
      ogretmenNotlari: {
        kazanimlar: [
          "Geçmişteki işlev ile bugünkü işlev karşılaştırmasını Ankara Mahmud Paşa Bedesteni (Ticaret -> Müze) ve Bursa Koza Han (Ticaret -> Ticaret) üzerinden yapar."
        ],
        etkinlikOnerisi: "Öğrencilerden Bursa Koza Han ile Ankara Kurşunlu Han / Bedesteni'ni karşılaştırarak ikisinin bugünkü kullanım farklarını analiz etmelerini isteyin."
      }
    },
    {
      id: "sanliurfa-gumruk-hani",
      eserAdi: "Şanlıurfa Gümrük Hanı",
      il: "Şanlıurfa",
      ilId: "sanliurfa",
      plaka: "63",
      bolge: "Güneydoğu Anadolu",
      ilce: "Eyyübiye",
      eserTuru: "Han",
      donem: "Klasik Dönem (1453–1600)",
      yapimYili: "1563–1566 (Kanuni Sultan Süleyman Dönemi)",
      mimar: "Halhallı Behram Paşa Dönemi Ustaları",
      kullanimDurumu: "Yaşayan Tarihi Han ve Kültür Alanı",
      konum: "Haşimiye Meydanı Yakını, Eyyübiye / Şanlıurfa (37.1512° K, 38.7915° D)",
      kisaAciklama: "Kanuni Sultan Süleyman döneminde 1563'te Urfa Sancakbeyi Halhallı Behram Paşa tarafından yaptırılan; avlusunun tam ortasından Balıklıgöl (Halilü'r-Rahman) suyunun aktığı, iki renkli kesme taş işçilikli klasik Osmanlı ticaret hanıdır.",
      ayrintiliAciklama: "Hicri 971 (Miladi 1563) yılında Urfa Sancakbeyi Halhallı Behram Paşa tarafından inşa ettirilen Gümrük Hanı, Evliya Çelebi'nin Seyahatnamesi'nde 'Yetmiş Hanı' olarak geçer. Kesme Urfa taşından iki katlı olarak inşa edilen hanın en özgün özelliği, Balıklıgöl'den (Halilü'r-Rahman gölünden) gelen berrak su kanalının hanın avlusunun tam ortasından geçmesidir. Giriş eyvanının üzerindeki askılı mescidi ve iki renkli taş süslemeleriyle Güneydoğu Anadolu hanlarının en canlı örneğidir.",
      modelTipi: "han",
      modelConfig: {
        baseColor: "#e6dabf",
        brickColor: "#8f6545",
        roofColor: "#5c6670",
        hasKioskMasjid: false,
        floors: 2,
        courtyardRatio: 0.62,
        archCountX: 6,
        archCountZ: 5
      },
      kitabeBilgisi: {
        yeri: "Şanlıurfa Şer'iyye Sicilleri, Salnameler ve Evliya Çelebi Seyahatnamesi",
        metinOzeti: "Hicri 971 (1563) yılında Kanuni Sultan Süleyman devrinde Halhallı Behram Paşa tarafından inşa edildiği Halep/Urfa salnamelerinde kayıtlıdır.",
        tarihselKanitDegeri: "Hanın 'Gümrük Hanı' adını taşıması, Osmanlı döneminde dışarıdan gelen kervan mallarının vergilendirildiği (gümrüklendiği) resmi merkez olduğunu kanıtlar."
      },
      planBilgisi: {
        semaTipi: "Avlusundan Su Kanalı Geçen, Giriş Üstü Mescitli İki Katlı Şehir Hanı",
        mekansalDuzen: "Kareye yakın açık avlu, ortasından geçen Balıklıgöl su arkı, zemin katta depolar, üst katta revaklı tüccar odaları ve giriş tonozu üzerinde yer alan mescit.",
        planAciklamasi: "Urfa'nın kurak ve çok sıcak ikliminde, Balıklıgöl suyunun doğrudan avlu içinden geçirilmesi hem doğal serinlik hem de abdest/temizlik imkânı sağlamıştır."
      },
      kullanimAmaci: {
        ilkIslev: "Halep, Bağdat ve Diyarbakır kervanlarının gümrükleme, konaklama ve toptan ticaret merkezi.",
        kullaniciKitlesi: "Gümrük eminleri, kervan tüccarları ve seyyahlar."
      },
      bugunkuIslev: {
        guncelKullanim: "Geleneksel terziler, tesbihçiler ve halkın buluştuğu yaşayan kültür/sosyal mekân.",
        degisimVeSureklilik: "460 yılı aşkın süredir Şanlıurfa tarihi çarşı dokusunun kalbinde aktif ticari ve sosyal işlevini sürdürmektedir."
      },
      malzemeBilgisi: {
        anaMalzemeler: "Sarı-beyaz Urfa kesme kalker taşı, kırmızı/kahverengi taş kakmalar ve kagir tonozlar.",
        yapimTeknigi: "Urfa'nın ünlü kesme kalker taşıyla yığma sistem; cephede iki renkli taş geçmeli kemerler."
      },
      mimariOzellikler: [
        "Avlunun tam ortasından akan tarihi Balıklıgöl (Halilü'r-Rahman) su kanalı",
        "Bursa Koza Han'daki orta mescidin aksine, giriş kapısı tonozu üzerine yerleştirilmiş 'Giriş Üstü Mescit'",
        "Sarımtırak Urfa kesme taşı ve renkli taş kakmalı taçkapı",
        "İki katlı yuvarlak ve sivri kemerli avlu revakları",
        "Tarihi Sipahi Pazarı ve Bedesten ile doğrudan bağlantılı çarşı konumu"
      ],
      korunmaDurumu: {
        durum: "Çok İyi Korunmuş (2001 Ağa Han Mimarlık Ödülü Adayı Restorasyon)",
        restorasyonBilgisi: "1990'ların sonunda aslına uygun restore edilerek Türkiye'de tarihi çarşı korumasının örnek projelerinden biri olmuştur."
      },
      tarihselBaglam: {
        donemOzelligi: "16. yüzyılda Urfa'nın Halep ile Diyarbakır arasındaki en önemli gümrük ve dokuma merkezlerinden biri olduğu dönem.",
        sosyoKulturelRol: "Su mimarisinin (Balıklıgöl su kanalı) ticaret hanı mimarisiyle nasıl bütünleştiğini gösterir."
      },
      hotspots: [
        {
          id: "kitabe",
          kategori: "Kitabe ve Salname",
          baslik: "1. 1563 Halhallı Behram Paşa İnşası ve 'Gümrük' Adı",
          pos: [0, 2.1, 4.2],
          kisaBilgi: "1563 yılında Kanuni döneminde yaptırılan han, şehre gelen kervanların gümrük işlemlerinin burada yürütülmesi nedeniyle Gümrük Hanı adını almıştır.",
          tarihselKanitIpucu: "Yapının adı, Osmanlı vergi ve ticaret teşkilatındaki resmi işlevini doğrudan belgeleyen dilsel kanıttır.",
          sesliMetin: "Kanuni Sultan Süleyman döneminde 1563 yılında inşa edilen bu yapı, doğudan ve güneyden gelen ticaret kervanlarının vergi ve gümrük işlemlerinin yapıldığı resmi merkez olduğu için Gümrük Hanı adını almıştır."
        },
        {
          id: "plan",
          kategori: "Plan",
          baslik: "2. Avludan Geçen Balıklıgöl Suyu ve Giriş Üstü Mescit",
          pos: [0, 1.0, 0],
          kisaBilgi: "Avlunun ortasını daraltmamak için mescit giriş kapısının üst katına yerleştirilmiş, avlunun ortasından ise Balıklıgöl'den gelen akarsu kanalı geçirilmiştir.",
          tarihselKanitIpucu: "Bursa Koza Han (avlu ortası köşk mescit) ile Urfa Gümrük Hanı (giriş üstü mescit + su kanalı) karşılaştırması, plan çözümlerinin çeşitliliğini gösterir.",
          sesliMetin: "Urfa'nın kavurucu yaz sıcaklarına karşı mimar harika bir çözüm üretmiştir: Balıklıgöl'den gelen serin su kanalını doğrudan hanın avlusunun içinden geçirmiş, mescidi ise avlu ortası yerine giriş kapısının üstüne yerleştirmiştir."
        },
        {
          id: "kullanim",
          kategori: "Kullanım Amacı",
          baslik: "3. Halep-Bağdat Kervan Gümrüğü",
          pos: [-3.0, 1.6, 0],
          kisaBilgi: "Alt katta mallar tartılıp gümrüklenir ve depolanır, üst katta ise tüccarlar konaklardı.",
          tarihselKanitIpucu: "Zemin kattaki geniş tonozlu depolar toptan ticaret hacmini kanıtlar.",
          sesliMetin: "Zemin kattaki serin taş odalarda baharat, ipek ve dokuma balyaları depolanırken, üst kattaki revaklı odalarda tüccarlar konaklardı."
        },
        {
          id: "bugunku",
          kategori: "Bugünkü İşlev",
          baslik: "4. Yaşayan Çarşı ve Geleneksel Zanaatlar",
          pos: [3.0, 1.6, 0],
          kisaBilgi: "Günümüzde geleneksel Urfa kıyafetleri diken terziler, tesbih ustaları ve avluda sohbet eden halk ile 460 yıldır yaşayan bir merkezdir.",
          tarihselKanitIpucu: "Mekânın halktan koparılmadan yaşayan bir sosyal alan olarak korunması kültürel sürekliliği sağlar.",
          sesliMetin: "Gümrük Hanı bugün müzeleştirilip kapatılmış bir yapı değil; avlusunda akan suyun kenarında halkın ve zanaatkârların her gün buluştuğu yaşayan bir tarihtir."
        },
        {
          id: "malzeme",
          kategori: "Malzeme ve Yapı Tekniği",
          baslik: "5. Urfa Kalker Taşı (Nahit Taşı) İşçiliği",
          pos: [-2.8, 2.2, -2.5],
          kisaBilgi: "Ocaktan çıktığında yumuşak olup kolay işlenen, havayla temas ettikçe mermer gibi sertleşen sarı-beyaz Urfa kalker taşı kullanılmıştır.",
          tarihselKanitIpucu: "Urfa taşının yüksek ısı yalıtımı özelliği, yazın 45 dereceyi bulan sıcakta odaları serin tutar.",
          sesliMetin: "Yapıda kullanılan sarı-beyaz Urfa taşı, mükemmel bir doğal ısı yalıtımcısıdır; dışarıda kavurucu sıcak varken hanın taş odaları doğal klima gibi serin kalır."
        },
        {
          id: "mimari",
          kategori: "Mimari Özellikler",
          baslik: "6. İki Renkli Taş Kakmalı Cephe ve Konsollar",
          pos: [0, 2.6, 3.8],
          kisaBilgi: "Dış cephedeki mescit çıkmasını taşıyan mukarnaslı taş konsollar ve kırmızı-beyaz taş geçmeli kemerler.",
          tarihselKanitIpucu: "Taş konsollar ve renkli kemer taşları Güneydoğu Anadolu ve Suriye taş mimarisiyle etkileşimi gösterir.",
          sesliMetin: "Giriş kapısının üzerindeki mescit çıkmasını taşıyan oymalı taş konsollar ve iki renkli kemer taşları Urfa taş ustalarının maharetini sergiler."
        },
        {
          id: "korunma",
          kategori: "Korunma Durumu",
          baslik: "7. Tarihi Hanlar Bölgesi Bütünlüğü",
          pos: [2.5, 2.0, -2.5],
          kisaBilgi: "Gümrük Hanı; hemen bitişiğindeki Kazzaz Pazarı (Bedesten), Sipahi Pazarı ve Hoca Ahmed Camii ile bütüncül olarak korunmuştur.",
          tarihselKanitIpucu: "Tek bir yapının değil tüm tarihi çarşı dokusunun birlikte korunmasının önemini gösterir.",
          sesliMetin: "Gümrük Hanı, bitişiğindeki tarihi bedesten ve kapalı çarşılarla birlikte bütüncül bir Osmanlı ticaret dokusu olarak korunmuştur."
        },
        {
          id: "baglam",
          kategori: "Tarihsel Bağlam",
          baslik: "8. Su ve Ticaretin Buluşması",
          pos: [-2.0, 0.9, 2.8],
          kisaBilgi: "Kutsal kabul edilen Balıklıgöl suyunun ticari hanların avlusundan geçirilmesi, şehir planlamasında suyun ne kadar akılcı dağıtıldığını kanıtlar.",
          tarihselKanitIpucu: "Osmanlı şehir altyapısında su kanallarının cami, han ve hamamları birbirine bağladığını gösterir.",
          sesliMetin: "Balıklıgöl'den doğan suyun kanallarla cami ve han avlularından geçirilmesi, 16. yüzyıl Şanlıurfa'sında suyla serinletilen ekolojik bir şehir tasarımı yapıldığını kanıtlar."
        }
      ],
      karsilastirilabilirEserler: ["diyarbakir-hasan-pasa-hani", "bursa-koza-han", "sivas-behrampasa-hani", "tokat-tashan"],
      kanitTemelliSorular: [
        {
          id: "ugh-q1",
          tip: "gorsel_kanit",
          zorluk: "Kolay",
          ilgiliAlan: "Plan ve İklim Uyumu",
          kanitMetni: "KANIT 1 (Mekânsal Gözlem): Yaz aylarında sıcaklığın çok yüksek olduğu Şanlıurfa'da inşa edilen Gümrük Hanı'nda kalın Urfa kalker taşı kullanılmış ve Balıklıgöl'den gelen su kanalı doğrudan han avlusunun ortasından geçirilmiştir.",
          soru: "Bu mimari tasarımın temel amacı aşağıdakilerden hangisidir?",
          secenekler: [
            "Sıcak ve kurak iklimde taş yalıtımı ve akan suyun buharlaşma etkisiyle avlu içinde doğal serinlik (mikroklima) ve su imkânı sağlamak",
            "Avlu içinde gemi yüzdürmek",
            "Hanı kışın buz pistine dönüştürmek",
            "Tüccarların odalara geçmesini engellemek"
          ],
          dogruIndeks: 0,
          ipucu: "'2. Avludan Geçen Balıklıgöl Suyu' ve '5. Urfa Kalker Taşı' bilgi noktalarını inceleyin.",
          aciklama: "Doğru! Kalın kalker taşı ve avlu içinden geçen akarsu kanalı, sıcak iklim kuşağında doğal serinlik sağlayan ekolojik bir mimari çözümdür.",
          kanitDosyasiBasligi: "Ekolojik Mimari Kanıtı: Avlu İçi Su Kanalı ve Kalker Taşı"
        }
      ],
      kaynakca: [
        "Kültür Portalı, 'Gümrük Hanı - Şanlıurfa', T.C. Kültür ve Turizm Bakanlığı.",
        "Kürkçüoğlu, Cihat (2011). Şanlıurfa Mimari Eserleri."
      ],
      ogretmenNotlari: {
        kazanimlar: [
          "Güneydoğu Anadolu'daki iki Osmanlı hanını (Diyarbakır Hasan Paşa Hanı ve Şanlıurfa Gümrük Hanı) su kullanımı ve taş işçiliği açısından karşılaştırır."
        ],
        etkinlikOnerisi: "Bursa Koza Han (köşk mescitli) ile Şanlıurfa Gümrük Hanı'nı (giriş üstü mescitli ve su kanallı) karşılaştırın."
      }
    },
    {
      id: "kastamonu-nasrullah-kulliyesi",
      eserAdi: "Kastamonu Nasrullah Kadı Külliyesi (Cami, Şadırvan, Medrese ve Köprü)",
      il: "Kastamonu",
      ilId: "kastamonu",
      plaka: "37",
      bolge: "Karadeniz",
      ilce: "Merkez",
      eserTuru: "Cami",
      donem: "Erken Osmanlı (1299–1453)",
      yapimYili: "1506 (II. Bayezid Dönemi)",
      mimar: "Erken Osmanlı Kastamonu Mimarları",
      kullanimDurumu: "Aktif İbadethane ve Kültür Meydanı",
      konum: "Hepkebirler Mahallesi, Karaçomak Deresi Kıyısı, Merkez / Kastamonu (41.3765° K, 33.7762° D)",
      kisaAciklama: "Sultan II. Bayezid dönemi kazaskerlerinden Kadı Nasrullah tarafından 1506'da yaptırılan; 9 kubbeli çok ayaklı camisi, şadırvanı, medresesi ve Karaçomak Deresi üzerindeki Kambur Köprüsü ile Karadeniz Bölgesi'nin en önemli Osmanlı külliyelerinden biridir.",
      ayrintiliAciklama: "Kadı Nasrullah bin Yakup tarafından Hicri 912 (Miladi 1506) yılında Kastamonu merkezinde Karaçomak Deresi'nin batı kıyısında inşa ettirilmiştir. İlk yapıldığında 6 kubbeli olan, 1746'da Reisülküttab Hacı Mustafa Efendi tarafından 9 kubbeye çıkarılan çok kubbeli (Ulu Cami tipi) camisi, avludaki dev kubbeli şadırvanı, Münire Medresesi ve şehrin iki yakasını bağlayan beş kemerli taş 'Kambur Köprü'sü ile bütüncül bir kentsel meydan oluşturur. Ayrıca Milli Mücadele'de Mehmet Akif Ersoy'un 1920'de İstiklal Marşı'nı ilk kez kürsüsünden okuduğu tarihi mekândır.",
      modelTipi: "cami",
      modelConfig: {
        baseColor: "#d9cfbe",
        domeColor: "#505c66",
        minaretCount: 2,
        centralDomeRadius: 1.8,
        baldachin: "multidome"
      },
      kitabeBilgisi: {
        yeri: "Kuzey kapısı üzerindeki Hicri 912 (1506) inşa kitabesi ve Hicri 1159 (1746) genişletme kitabesi",
        metinOzeti: "1506 yılında Sultan II. Bayezid devrinde Kadı Nasrullah tarafından 6 kubbeli olarak yaptırıldığı, 1746'da ise Hacı Mustafa Efendi tarafından 3 kubbe eklenerek 9 kubbeye genişletildiği kayıtlıdır.",
        tarihselKanitDegeri: "İki farklı döneme (1506 ve 1746) ait iki kitabenin aynı yapıda bulunması, nüfus artışına paralel olarak bir Osmanlı camisinin nasıl büyütüldüğünü (mimari değişim ve sürekliliği) kanıtlar."
      },
      planBilgisi: {
        semaTipi: "Çok Ayaklı, 9 Eş Kubbeli (Ulu Cami Tipi) Külliye Planı",
        mekansalDuzen: "İçeride dört kare taş paye üzerine oturan 9 kubbeli harim, 7 bölmeli son cemaat yeri; kuzeyinde iki şadırvan, güneybatısında medrese ve doğusunda Karaçomak Deresi üzerinde Kambur Köprü.",
        planAciklamasi: "Bursa Ulu Camii'nde görülen 'çok ayaklı ve çok eş kubbeli' Erken Osmanlı plan şemasının 16. yüzyıl başında Kastamonu'daki önemli bir temsilcisidir."
      },
      kullanimAmaci: {
        ilkIslev: "Kastamonu'nun merkez Cuma camii, medrese eğitim merkezi, su şadırvanı ve nehir geçiş köprüsü.",
        kullaniciKitlesi: "Kastamonu halkı, medrese öğrencileri, tüccarlar."
      },
      bugunkuIslev: {
        guncelKullanim: "Aktif ibadethane; medresesi el sanatları/kültür alanı ve meydanı kentin ana kamusal odak noktası.",
        degisimVeSureklilik: "520 yıldır ibadet, su ve köprü ulaşım işlevini kesintisiz sürdürmektedir."
      },
      malzemeBilgisi: {
        anaMalzemeler: "Kesme küfeki/kalker taşı, moloz taş, tuğla kubbeler ve kurşun örtü.",
        yapimTeknigi: "Kalın dörtgen taş payeler üzerinde tuğla kubbe örgüsü ve kalemişi bezemeler."
      },
      mimariOzellikler: [
        "Dört kalın taş ayak üzerinde yükselen 9 kubbeli çok ayaklı (Ulu Cami tipi) plan",
        "Meydanın ortasında yer alan sekiz sütunlu, kubbeli anıtsal Nasrullah Şadırvanı",
        "Karaçomak Deresi üzerinde külliyeyi şehre bağlayan 5 kemerli taş 'Kambur Köprü'",
        "Mehmet Akif Ersoy'un Milli Mücadele'de vaaz verdiği tarihi ahşap kürsü ve minber",
        "1506 ve 1746 tarihli iki ayrı inşa/genişletme evresini gösteren mimari izler"
      ],
      korunmaDurumu: {
        durum: "Çok İyi Korunmuş",
        restorasyonBilgisi: "1943 Tosya-Ladik depreminden sonra onarılmış ve son yıllarda Vakıflar Genel Müdürlüğü tarafından restore edilmiştir."
      },
      tarihselBaglam: {
        donemOzelligi: "Candaroğulları Beyliği'nin Osmanlı'ya katılmasından sonra Kastamonu'nun önemli bir Osmanlı ilim ve sancak merkezi olduğu dönem.",
        sosyoKulturelRol: "Hem 16. yüzyıl Osmanlı şehirciliğini hem de 1920 Milli Mücadele hafızasını (Mehmet Akif Ersoy'un Sevr Antlaşması'na karşı tarihi hutbesi) aynı mekânda birleştirir."
      },
      hotspots: [
        {
          id: "kitabe",
          kategori: "Kitabe",
          baslik: "1. 1506 İnşa ve 1746 Genişletme Kitabeleri",
          pos: [0, 2.0, 3.8],
          kisaBilgi: "Caminin 1506'da 6 kubbeli yapıldığını, 1746'da ise cemaatin artması üzerine ön cephesi genişletilerek 9 kubbeye çıkarıldığını belgeleyen iki kitabe.",
          tarihselKanitIpucu: "Bir yapının farklı yüzyıllarda ihtiyaca göre büyütülmesi, tarihsel değişim ve sürekliliğin somut kanıtıdır.",
          sesliMetin: "Nasrullah Camii ilk yapıldığında altı kubbeliydi. İki yüz kırk yıl sonra 1746'da şehir nüfusu artınca yapı yıkılmak yerine önüne üç kubbe daha eklenerek dokuz kubbeli bugünkü haline kavuşturulmuştur."
        },
        {
          id: "plan",
          kategori: "Plan",
          baslik: "2. Çok Kubbeli (Ulu Cami Tipi) Plan Şeması",
          pos: [-2.4, 2.2, 0],
          kisaBilgi: "Tek bir büyük kubbe yerine, içerideki dört taş sütunun taşıdığı 9 eş kubbeli plan şeması uygulanmıştır.",
          tarihselKanitIpucu: "Çok kubbeli bu planı Edirne Selimiye'nin tek kubbeli planıyla karşılaştırmak, Erken Dönem ile Klasik Dönem arasındaki farkı netleştirir.",
          sesliMetin: "Bu caminin planını Edirne Selimiye Camii ile karşılaştırın: Burada iç mekânda dört kalın taş ayak üzerinde dokuz küçük kubbe varken, Mimar Sinan Selimiye'de iç ayakları kaldırıp tüm alanı tek bir dev kubbeyle örtmüştür."
        },
        {
          id: "kullanim",
          kategori: "Kullanım Amacı",
          baslik: "3. Cami, Şadırvan, Medrese ve Köprüden Oluşan Külliye",
          pos: [2.8, 1.5, 2.2],
          kisaBilgi: "Kadı Nasrullah yalnızca cami değil; halkın su ihtiyacı için şadırvan, eğitim için medrese ve nehir geçişi için taş köprü yaptırmıştır.",
          tarihselKanitIpucu: "Tek bir vakıf kurucusunun şehrin tüm temel ihtiyaçlarını (ibadet, su, eğitim, ulaşım) bir arada çözdüğünü gösterir.",
          sesliMetin: "Kadı Nasrullah bu külliyeyi kurarken ibadet için cami, eğitim için medrese, temiz su için şadırvan ve nehrin karşı yakasına geçiş için taş köprüyü tek bir bütün olarak planlamıştır."
        },
        {
          id: "bugunku",
          kategori: "Bugünkü İşlev",
          baslik: "4. Yaşayan Meydan ve Milli Mücadele Hafızası",
          pos: [0, 1.2, -2.5],
          kisaBilgi: "Milli Şairimiz Mehmet Akif Ersoy, 1920 yılında bu caminin kürsüsünden halka seslenerek Milli Mücadele ruhunu ateşlemiştir.",
          tarihselKanitIpucu: "Bir Osmanlı eserinin 20. yüzyılda Kurtuluş Savaşı'nda da tarihsel sahne olması mekânsal hafızanın gücünü gösterir.",
          sesliMetin: "Bu tarihi mekân yalnızca Osmanlı dönemine değil, Kurtuluş Savaşı'mıza da tanıklık etmiştir. Mehmet Akif Ersoy 1920 yılında bu caminin kürsüsünden Sevr Antlaşması'nın iç yüzünü anlatan ünlü vaazını vermiştir."
        },
        {
          id: "malzeme",
          kategori: "Malzeme ve Yapı Tekniği",
          baslik: "5. Kesme Taş Payeler ve Kurşun Kubbeler",
          pos: [-2.2, 2.4, -1.8],
          kisaBilgi: "Dörtgen kesme taş ayaklar, tuğla kubbeler ve Karadeniz'in yağışlı iklimine dayanıklı kurşun kaplama.",
          tarihselKanitIpucu: "Bol yağış alan Karadeniz ikliminde çatı ve kubbelerin kurşunla kaplanması su sızıntısını önlemiştir.",
          sesliMetin: "Karadeniz Bölgesi'nin bol yağışlı iklimine karşı dokuz kubbenin tamamı su geçirmez kurşun levhalarla kaplanmıştır."
        },
        {
          id: "mimari",
          kategori: "Mimari Özellikler",
          baslik: "6. Anıtsal Şadırvan ve Kambur Köprü",
          pos: [2.5, 1.0, -2.0],
          kisaBilgi: "Caminin hemen önündeki kubbeli şadırvan ve doğusundaki kambur kemerli taş köprü külliyenin simgeleridir.",
          tarihselKanitIpucu: "Kambur (dik kemerli) köprü formu, nehir taşkınlarında suyun engelsiz akmasını sağlar.",
          sesliMetin: "Külliyenin hemen doğusundaki beş kemerli taş köprü, ortası yüksek kambur formu sayesinde sel sularının geçişine olanak tanır."
        },
        {
          id: "korunma",
          kategori: "Korunma Durumu",
          baslik: "7. Hat Sanatı ve Kalemişlerinin Korunumu",
          pos: [0, 3.2, 0],
          kisaBilgi: "Kubbe içlerindeki Kastamonulu hattatların sülüs yazıları ve kalemişi bezemeleri korunmuştur.",
          tarihselKanitIpucu: "İç mekân bezemeleri 18. yüzyıl onarım katmanını da yansıtır.",
          sesliMetin: "Kubbe içlerindeki hat yazıları ve kalemişi süslemeler özenle restore edilerek günümüze taşınmıştır."
        },
        {
          id: "baglam",
          kategori: "Tarihsel Bağlam",
          baslik: "8. Kadı Vakıflarının Anadolu Şehirlerindeki Rolü",
          pos: [-1.8, 0.9, 2.8],
          kisaBilgi: "Yalnızca padişah ve paşaların değil, ilmiye sınıfı mensubu kadıların (hâkim ve akademisyenlerin) da şehirlerde büyük külliyeler kurduğunu gösterir.",
          tarihselKanitIpucu: "Baninin 'Kadı Nasrullah' olması, Osmanlı'da hukuk ve bilim insanlarının vakıf kurucusu olarak rolünü kanıtlar.",
          sesliMetin: "Bu külliyenin kurucusu bir padişah veya ordu komutanı değil, döneminin önde gelen hukuk ve bilim insanlarından Kadı Nasrullah'tır."
        }
      ],
      karsilastirilabilirEserler: ["edirne-selimiye-camii", "edirne-uzunkopru", "amasya-bayezid-kulliyesi", "konya-aziziye-camii"],
      kanitTemelliSorular: [
        {
          id: "knk-q1",
          tip: "coktan_secmeli",
          zorluk: "Orta",
          ilgiliAlan: "Kitabe ve Değişim/Süreklilik",
          kanitMetni: "KANIT 1 (Epigrafik ve Mimari Kanıt): Kastamonu Nasrullah Camii'nde 1506 tarihli ilk kitabede yapının 6 kubbeli olarak inşa edildiği, 1746 tarihli ikinci kitabede ise kuzey yönünde 3 kubbe daha eklenerek 9 kubbeye çıkarıldığı görülmektedir.",
          soru: "Aynı yapıda yer alan bu iki kitabe ve mimari ekleme aşağıdakilerden hangisini kanıtlar?",
          secenekler: [
            "Zaman içinde şehir nüfusunun ve cemaatin artmasıyla tarihi yapının yıkılmadan, özgün planına uyumlu biçimde genişletilerek korunduğunu",
            "1506 yılında kubbe yapımının bilinmediğini",
            "Caminin 1746 yılında tamamen yıkılıp fabrikaya dönüştürüldüğünü",
            "Kitabelerin yapının tarihiyle hiçbir ilgisi olmadığını"
          ],
          dogruIndeks: 0,
          ipucu: "'1. 1506 İnşa ve 1746 Genişletme Kitabeleri' bilgi noktasını inceleyin.",
          aciklama: "Harika! Çok kubbeli (Ulu Cami tipi) plan şeması modüler olduğu için, 18. yüzyılda ihtiyaç doğduğunda yapı yıkılmamış, önüne üç eş kubbe daha eklenerek büyütülmüştür.",
          kanitDosyasiBasligi: "Mimari Süreklilik Kanıtı: 6 Kubbeden 9 Kubbeye Modüler Genişleme"
        }
      ],
      kaynakca: [
        "Kültür Portalı, 'Nasrullah Külliyesi - Kastamonu', T.C. Kültür ve Turizm Bakanlığı.",
        "Bilici, Z. Kenan (1991). Kastamonu'da Türk Devri Mimarisi."
      ],
      ogretmenNotlari: {
        kazanimlar: [
          "Çok kubbeli Erken Osmanlı cami planı (Kastamonu Nasrullah Camii) ile tek merkezi kubbeli Klasik Osmanlı planını (Edirne Selimiye Camii) karşılaştırır."
        ],
        etkinlikOnerisi: "Kastamonu Nasrullah Camii (9 eş kubbeli) ile Edirne Selimiye Camii'ni (tek merkezi kubbeli) karşılaştırma ekranında yan yana açarak kubbe ve iç mekân gelişimini inceletin."
      }
    },
    {
      id: "izmir-kizlaragasi-hani",
      eserAdi: "İzmir Kızlarağası Hanı",
      il: "İzmir",
      ilId: "izmir",
      plaka: "35",
      bolge: "Ege",
      ilce: "Konak (Kemeraltı)",
      eserTuru: "Han",
      donem: "Geç Osmanlı / Batılılaşma (1730–1922)",
      yapimYili: "1744–1745 (I. Mahmud Dönemi)",
      mimar: "18. Yüzyıl Osmanlı Mimarları",
      kullanimDurumu: "Yaşayan Tarihi Çarşı, El Sanatları ve Kültür Merkezi",
      konum: "Hisarönü, Kemeraltı Çarşısı, Konak / İzmir (38.4216° K, 27.1318° D)",
      kisaAciklama: "Sultan I. Mahmud dönemi Darüssaade Ağası (Kızlarağası) Hacı Beşir Ağa tarafından 1744'te İzmir Limanı ve Kemeraltı Çarşısı'nda yaptırılan; 18. yüzyıl deniz-kara ticaretini birleştiren anıtsal şehir hanıdır.",
      ayrintiliAciklama: "17. ve 18. yüzyıllarda İzmir'in Doğu Akdeniz'in en büyük ihracat limanı haline gelmesiyle birlikte, Darüssaade Ağası Hacı Beşir Ağa tarafından 1744–1745 yıllarında Hisar Camii yakınında inşa ettirilmiştir. Yaklaşık 4.000 metrekarelik alanı kaplayan, taş ve tuğla almaşık örgülü, iki katlı yapı; Anadolu'dan deve kervanlarıyla gelen pamuk, kuru üzüm, incir ve halıların limandan Avrupa gemilerine yüklenmeden önce toplandığı uluslararası ticaret merkeziydi.",
      modelTipi: "han",
      modelConfig: {
        baseColor: "#d9ccb6",
        brickColor: "#a8442f",
        roofColor: "#54606b",
        hasKioskMasjid: false,
        floors: 2,
        courtyardRatio: 0.56,
        archCountX: 7,
        archCountZ: 5
      },
      kitabeBilgisi: {
        yeri: "Ana giriş kapısı üzerindeki Hicri 1157 (Miladi 1744) tarihli mermer kitabe ve Hacı Beşir Ağa Vakfiyesi",
        metinOzeti: "Darüssaade Ağası Hacı Beşir Ağa tarafından Hicri 1157 (1744) yılında İzmir tüccarları ve kervanları için inşa ettirildiği yazılıdır.",
        tarihselKanitDegeri: "18. yüzyılda ticaret ağırlığının iç kara yollarından (Bursa/Sivas/Tokat) İzmir gibi kıyı liman şehirlerine kaydığını belgeleyen mimari kanıttır."
      },
      planBilgisi: {
        semaTipi: "Dikdörtgen Avlulu, İki Katlı ve İç Çarşı Koridorlu Liman Hanı Planı",
        mekansalDuzen: "Alt katta depolar, ahırlar ve ızgara planlı kapalı çarşı koridorları; üst katta dikdörtgen avluya bakan revaklı tüccar ve acente odaları.",
        planAciklamasi: "Klasik açık avlulu han planı ile kapalı bedesten koridorlarını birleştirerek liman ticaretinin yoğun depolama ve büro ihtiyacına cevap vermiştir."
      },
      kullanimAmaci: {
        ilkIslev: "Anadolu içlerinden gelen deve kervanları ile İzmir Limanı'ndaki Avrupa ticaret gemileri arasındaki mal değişim, depolama ve konaklama merkezi.",
        kullaniciKitlesi: "Deve kervancıları, İzmirli tüccarlar, Levanten ve Avrupalı ticaret acenteleri."
      },
      bugunkuIslev: {
        guncelKullanim: "Tarihi Kemeraltı Çarşısı'nın kalbinde el sanatları, antikacılar, geleneksel kahve ve kültür merkezi.",
        degisimVeSureklilik: "Liman depolama işlevi değişmiş; ancak 280 yıldır Kemeraltı Çarşısı'nın en canlı ticaret ve kültür merkezi olma özelliğini sürdürmektedir."
      },
      malzemeBilgisi: {
        anaMalzemeler: "Kesme taş, kırmızı tuğla (almaşık örgü), kurşun ve kiremit örtü, demir kepenkler.",
        yapimTeknigi: "Üç sıra tuğla ve bir sıra kesme taştan oluşan almaşık duvar örgüsü ile tuğla çapraz tonozlar."
      },
      mimariOzellikler: [
        "Kervan ticareti ile deniz (liman) ticaretini buluşturan 4.000 m² ölçek",
        "Taş ve tuğla almaşık cephe işçiliği ve yüksek kemerli ana girişler",
        "Alt katta kapalı çarşı koridorları, üst katta açık revaklı galeri",
        "Yangın ve depremlere karşı kagir tonozlu ve demir gergili yapı sistemi",
        "Tarihi Kemeraltı Çarşısı ve Hisar Camii ile kentsel bütünlük"
      ],
      korunmaDurumu: {
        durum: "Çok İyi Korunmuş (1988-1993 Restorasyonu)",
        restorasyonBilgisi: "1993 yılında tamamlanan kapsamlı restorasyonla özgün taş-tuğla dokusu ortaya çıkarılmış ve İzmir'in en önemli kültür mirası odaklarından biri olmuştur."
      },
      tarihselBaglam: {
        donemOzelligi: "18. yüzyılda İzmir'in ('Gâvur İzmir / Küçük Paris') Osmanlı İmparatorluğu'nun Avrupa'ya açılan en büyük dış ticaret limanı haline geldiği dönem.",
        sosyoKulturelRol: "15. yüzyıldaki Bursa Koza Han (kara İpek Yolu) ile 18. yüzyıldaki İzmir Kızlarağası Hanı'nı (deniz-liman ticareti) karşılaştırarak Osmanlı iktisat tarihindeki değişimi somutlaştırır."
      },
      hotspots: [
        {
          id: "kitabe",
          kategori: "Kitabe",
          baslik: "1. 1744 Hacı Beşir Ağa Kitabesi",
          pos: [0, 2.2, 4.2],
          kisaBilgi: "Sultan I. Mahmud dönemi Darüssaade Ağası Hacı Beşir Ağa tarafından 1744 yılında yaptırıldığını belgeleyen kitabe.",
          tarihselKanitIpucu: "Hacı Beşir Ağa'nın İstanbul'da kütüphane ve çeşmeler, İzmir'de ise bu büyük hanı yaptırması vakıf ağını gösterir.",
          sesliMetin: "Giriş kapısı üzerindeki kitabe, hanın 1744 yılında Hacı Beşir Ağa tarafından İzmir'in gelişen liman ticaretine hizmet etmek üzere yaptırıldığını belgeler."
        },
        {
          id: "plan",
          kategori: "Plan",
          baslik: "2. Liman Hanı Planı: Kapalı Koridorlar ve Açık Avlu",
          pos: [-3.0, 1.6, 0],
          kisaBilgi: "Alt katta hem açık avlu hem de kapalı bedesten tarzı koridorlar yer alır; üst kat ise ticaret kumpanyalarının ve tüccarların büro/konaklama odalarıdır.",
          tarihselKanitIpucu: "Üst kat odalarının konaklamanın yanı sıra ticaret bürosu/yazıhane olarak kullanılması 18. yüzyıl ticaret modernleşmesini gösterir.",
          sesliMetin: "18. yüzyılda inşa edilen Kızlarağası Hanı'nda üst kat odaları yalnızca yatakhane olarak değil, aynı zamanda yerli ve yabancı tüccarların sözleşme imzaladığı ticaret yazıhaneleri olarak kullanılmıştır."
        },
        {
          id: "kullanim",
          kategori: "Kullanım Amacı",
          baslik: "3. Deve Kervanlarından Yelkenli Gemilere Ticaret Köprüsü",
          pos: [3.0, 1.6, 0],
          kisaBilgi: "Manisa, Aydın ve Denizli'den deve kervanlarıyla gelen pamuk ve kuru meyveler burada toplanır, hemen önündeki iç limandan Avrupa gemilerine yüklenirdi.",
          tarihselKanitIpucu: "Hanın yapıldığı 1744 yılında denizin hemen hanın yakınına (Hisarönü'ne) kadar sokulmuş olması, kara ve deniz ulaşımının birleştiğini kanıtlar.",
          sesliMetin: "Hanın inşa edildiği 1744 yılında İzmir'in iç limanı hemen bu binanın önüne kadar uzanıyordu. Anadolu'dan deve kervanlarıyla gelen mallar hanın bir kapısından girer, diğer kapısından gemilere yüklenirdi."
        },
        {
          id: "bugunku",
          kategori: "Bugünkü İşlev",
          baslik: "4. Kemeraltı Çarşısı'nın Kültür ve El Sanatları Kalbi",
          pos: [0, 1.0, -2.5],
          kisaBilgi: "Günümüzde el sanatları atölyeleri, antikacılar, sahaflar ve geleneksel Türk kahvesi kültürüyle İzmir'in en canlı tarihi mekânıdır.",
          tarihselKanitIpucu: "280 yıldır kesintisiz ticari ve sosyal mekân olarak yaşamaktadır.",
          sesliMetin: "Bugün Kemeraltı Çarşısı'nı gezen herkesin uğradığı Kızlarağası Hanı, geleneksel zanaatları ve sosyal yaşamıyla 18. yüzyıl atmosferini yaşatmaktadır."
        },
        {
          id: "malzeme",
          kategori: "Malzeme ve Yapı Tekniği",
          baslik: "5. Taş-Tuğla Almaşık Duvar ve Demir Gergili Kemerler",
          pos: [-2.8, 2.3, -2.5],
          kisaBilgi: "Ege'nin deprem kuşağında yer alan yapıda taş-tuğla almaşık duvarlar ve kemerleri birbirine bağlayan dövme demir gergiler kullanılmıştır.",
          tarihselKanitIpucu: "Kemerler arasındaki demir gergi çubukları, deprem sarsıntılarında tonozların açılmasını önleyen mühendislik önlemidir.",
          sesliMetin: "Koridorlardaki tuğla kemerlerin arasında gördüğünüz kalın demir gergi çubukları, İzmir'in depremlerine karşı binayı bir arada tutan statik sigortalardır."
        },
        {
          id: "mimari",
          kategori: "Mimari Özellikler",
          baslik: "6. Tonozlu Çarşı Sokakları ve Avlu Revakları",
          pos: [2.8, 2.3, -2.5],
          kisaBilgi: "Tuğla çapraz tonozlarla örtülü serin alt kat koridorları ve geniş üst kat galerileri.",
          tarihselKanitIpucu: "Kalın tuğla tonozlar Ege'nin sıcak yaz günlerinde çarşı içini serin tutar.",
          sesliMetin: "Yüksek tuğla tonozlarla örtülü alt kat koridorları, İzmir'in sıcak yaz günlerinde doğal hava dolaşımıyla serin bir alışveriş ortamı sunar."
        },
        {
          id: "korunma",
          kategori: "Korunma Durumu",
          baslik: "7. 1993 Restorasyonu ve Kentsel Canlandırma",
          pos: [-2.0, 0.9, 2.8],
          kisaBilgi: "1988-1993 yılları arasında restore edilerek Kemeraltı'nın en başarılı koruma projelerinden biri olmuştur.",
          tarihselKanitIpucu: "Restorasyon sonrasında tarihi çarşıya yeniden canlılık kazandırmıştır.",
          sesliMetin: "1993 yılında tamamlanan restorasyonla yapı yeniden İzmir'in kültür ve turizm kalbi haline gelmiştir."
        },
        {
          id: "baglam",
          kategori: "Tarihsel Bağlam",
          baslik: "8. 15. Yüzyıl Bursa'sından 18. Yüzyıl İzmir'ine Ticaretin Yönü",
          pos: [2.0, 0.9, 2.8],
          kisaBilgi: "15. yüzyılda Bursa Koza Han (kara İpek Yolu) öne çıkarken, 18. yüzyılda İzmir Kızlarağası Hanı'nın (deniz liman ticareti) yapılması dünya ticaret yollarındaki değişimi yansıtır.",
          tarihselKanitIpucu: "Farklı dönemlerdeki iki hanı karşılaştırarak küresel ticaret yollarının değişimini okumak mümkündür.",
          sesliMetin: "1491 tarihli Bursa Koza Han ile 1744 tarihli İzmir Kızlarağası Hanı'nı karşılaştırdığınızda, Osmanlı ticaretinin kara İpek Yolu'ndan Akdeniz liman ticaretine doğru nasıl genişlediğini görebilirsiniz."
        }
      ],
      karsilastirilabilirEserler: ["bursa-koza-han", "tokat-tashan", "ankara-mahmud-pasa-bedesteni", "sivas-behrampasa-hani"],
      kanitTemelliSorular: [
        {
          id: "ikh-q1",
          tip: "coktan_secmeli",
          zorluk: "Orta",
          ilgiliAlan: "Dönemsel ve Ekonomik Karşılaştırma",
          kanitMetni: "KANIT 1 (Karşılaştırmalı Tarih Verisi): 15. ve 16. yüzyıllarda büyük Osmanlı ticaret hanları ağırlıklı olarak Bursa, Ankara, Sivas ve Tokat gibi kara kervan yolu kavşaklarında yapılırken; 18. yüzyılda (1744) Anadolu'nun en büyük hanlarından biri olan Kızlarağası Hanı doğrudan İzmir Limanı kıyısında inşa edilmiştir.",
          soru: "Bu tarihsel ve coğrafi değişim, 18. yüzyıl Osmanlı ekonomisi hakkında hangi çıkarımı doğrular?",
          secenekler: [
            "Deniz aşırı ticaretin ve Avrupa ile yapılan ihracat/ithalatın artmasıyla İzmir gibi liman şehirlerinin stratejik ticaret merkezlerine dönüştüğünü",
            "18. yüzyılda deniz ticaretinin tamamen yasaklandığını",
            "İzmir'de yalnızca tarım yapıldığını ve hiç tüccar bulunmadığını",
            "Hanların yalnızca dağ başlarında inşa edildiğini"
          ],
          dogruIndeks: 0,
          ipucu: "'3. Deve Kervanlarından Yelkenli Gemilere Ticaret Köprüsü' ve '8. 15. Yüzyıl Bursa'sından 18. Yüzyıl İzmir'ine' noktalarını inceleyin.",
          aciklama: "Harika bir tarihsel çıkarım! Mimari yatırımların coğrafi dağılımı ve dönemi, ekonomik tarihin yönünü (kara kervan yollarından liman kentlerine yükselişi) doğrudan kanıtlar.",
          kanitDosyasiBasligi: "İktisat Tarihi Kanıtı: Kara Kervan Yollarından Liman Hanlarına"
        }
      ],
      kaynakca: [
        "Kültür Portalı, 'Kızlarağası Hanı - İzmir', T.C. Kültür ve Turizm Bakanlığı.",
        "Kütükoğlu, Mübahat S. (2000). İzmir Tarihinden Kesitler, İzmir Büyükşehir Belediyesi."
      ],
      ogretmenNotlari: {
        kazanimlar: [
          "15. yüzyıl Bursa Koza Han ile 18. yüzyıl İzmir Kızlarağası Hanı'nı karşılaştırarak ticaret yollarındaki tarihsel değişimi analiz eder."
        ],
        etkinlikOnerisi: "Öğrencilerden Bursa Koza Han (1491) ile İzmir Kızlarağası Hanı'nı (1744) karşılaştırma ekranında yan yana incelemelerini isteyin."
      }
    }
  ];

  window.OTTOMAN_MONUMENTS = (window.OTTOMAN_MONUMENTS || []).concat(PART5_MONUMENTS);
})();
