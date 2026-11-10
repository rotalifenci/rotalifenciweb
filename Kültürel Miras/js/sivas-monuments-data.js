// ============================================================================
// TÜBİTAK 2204-B – SİVAS'IN DİJİTAL TARİH ATLASI
// 10 Tarihî Eserin Bilimsel ve Doğrulanmış Veritabanı
// ============================================================================

window.SIVAS_MONUMENTS = [
  {
    id: "cifte-minareli-medrese",
    name: "Çifte Minareli Medrese (Dârülhadis)",
    district: "Merkez",
    locationDesc: "Sivas Tarihî Kent Meydanı, Şifaiye Medresesi Karşısı",
    lat: 39.7483,
    lon: 37.0142,
    period: "İlhanlı / Selçuklu Dönemi",
    periodGroup: "ilhanli", // selcuklu, beylikler, ilhanli, osmanli, cumhuriyet
    buildYear: "1271–1272 (H. 670)",
    century: "13. Yüzyıl",
    type: "Medrese (Dârülhadis)",
    typeGroup: "medrese", // medrese, cami, darussifa, kopru, muze, idari
    builder: "Şemseddin Muhammed el-Cüveynî (İlhanlı Başveziri / Sahip-Divan)",
    architect: "Bilinmiyor (Mimari üslup Tebriz ve Azerbaycan tesirli Selçuklu taş ustalarına işaret eder)",
    featured: true,
    hasImage3D: true, // Uses window.CIFTE_MINARELI_IMAGE
    thumbnail: "assets/images/cifte_thumb.jpg",
    
    // 3. Bölüm: Günümüze Ulaşan vs Ulaşmayan Bölümler (Bilimsel Ayrım)
    condition: {
      surviving: "Doğu cephe taçkapısı, mermer ve kesme taş ön cephe duvarı, çinili ve tuğla örgülü iki minaresi ile iki yanındaki köşe kuleleri/payandaları.",
      lost: "Taçkapının arkasında yer alan iki katlı, dört eyvanlı, revaklı açık avlulu asıl medrese yapısı ve öğrenci hücreleri 19. yüzyıl sonunda (1880'lerde askeri rüştiye/hastane yapımı sırasında) tamamen yıkılmıştır. 1963 yılında Prof. Dr. Haluk Karamağara tarafından yapılan arkeolojik kazılarla temel izleri ve planı tespit edilmiştir.",
      survivingNote: "Günümüzde ayakta duran görkemli cephe duvarı ve çifte minaresi, orijinal medresenin yalnızca doğu taçkapı giriş cephesidir."
    },

    // 4. Bölüm: Dijital Bilgi Kitabesi (Taş Görünümlü 8 Zorunlu Alan)
    digitalTablet: {
      name: "Çifte Minareli Medrese (Dârülhadis)",
      buildDate: "1271–1272 (Hicri 670)",
      period: "İlhanlı ve Anadolu Selçuklu Çağı",
      patron: "İlhanlı Veziri Şemseddin Muhammed Cüveynî",
      originalFunction: "Hadis ilimlerinin okutulduğu yükseköğretim kurumu (Dârülhadis)",
      architecturalFeatures: "Görkemli mermer ve kalker taçkapı, mukarnaslı kavsara, turkuaz sırlı tuğla ve firuze çinili ikiz minareler, rumi ve palmetli derin taş kabartmalar.",
      historicalImportance: "1271 yılında Sivas'ta aynı anda yükselen üç büyük medreseden biridir; Anadolu Selçuklu taş işçiliği ile İlhanlı dönemi çini sanatının doruk noktasını temsil eder.",
      currentStatus: "Açık hava anıtı ve tarihî meydan odak noktası olarak koruma altındadır."
    },

    // Gerçek Tarihî Kitabe (Doğrulanmış Transkripsiyon ve Anlam)
    realInscription: {
      location: "Doğu taçkapısının kavsara kuşağı üzerinde, iki satırlık sülüs hatlı Arapça kitabe",
      originalScript: "امر بعمارة هذه المدرسة المباركة دار الحديث في ايام دولة السلطان الاعظم غياث الدنيا والدين كikhusrev بن قليج ارسلان خلد الله دولته الصاحب الاعظم شمس الدنيا والدين محمد بن محمد الجويني صاحب الديوان... في سنة سبعين وستمائة",
      transcription: "Emere bi-imâreti hâzihi'l-medreseti'l-mubâreketi Dâri'l-Hadîs fî eyyâmi devleti's-sultâni'l-a'zam Gıyâsi'd-dünyâ ve'd-dîn Keyhüsrev bin Kılıçarslan halledallâhu devletehû es-Sâhibü'l-a'zam Şemsü'd-dünyâ ve'd-dîn Muhammed bin Muhammed el-Cüveynî Sâhib-i Dîvân... fî seneti seb'îne ve sitte-mie [670]",
      translation: "Bu mübarek Dârülhadis Medresesi'nin inşasını, ulu sultan Kılıçarslan oğlu Gıyaseddin Keyhüsrev'in -Allah saltanatını ebedi kılsın- saltanatı günlerinde, yüce sahip, dünya ve dinin güneşi Sahip-Divan Şemseddin Muhammed bin Muhammed el-Cüveynî 670 yılında (M. 1271-1272) emretti.",
      verificationStatus: "Kitabe yerinde mevcuttur; Vakıflar Genel Müdürlüğü ve Türk Tarih Kurumu kitabe korpusunda tescillidir."
    },

    // 5. Bölüm: İşitsel, Yazılı ve Görsel Anlatım
    writtenHistory: `Çifte Minareli Medrese, 1271 (Hicri 670) yılında İlhanlı Devleti'nin ünlü devlet adamı ve veziri Şemseddin Muhammed Cüveynî tarafından bir Dârülhadis (hadis araştırma ve yükseköğretim medresesi) olarak inşa ettirilmiştir. 13. yüzyılda Sivas, Anadolu Selçuklu Devleti'nin ticaret, kültür ve ilim başkentlerinden ("Dârü'l-A'lâ") biriydi. 1271 senesinde şehirde olağanüstü bir imar hamlesi yaşanmış; Çifte Minareli Medrese, Gök Medrese ve Buruciye Medresesi aynı yıl içinde yükselmiştir.

Medresenin en çarpıcı bölümü günümüze kadar sapasağlam ulaşan doğu taçkapısı ve üzerindeki çift minaredir. Taçkapı, zengin mermer mukarnasları, geometrik geçmeleri, bitkisel rumi-palmet motifleri ve rumi örgülü bordürleriyle Anadolu taş oyma sanatının zirve örneklerindendir. Taçkapının iki yanında yükselen silindirik tuğla minareler, firuze (turkuaz) sırlı tuğlalar ve lacivert çini mozaiklerle süslenmiştir. 

19. yüzyılın sonlarında medresenin arka avlusu ve iki katlı öğrenci odaları yıkılmış ve alan uzun süre boş kalmıştır. 1963 yılında yapılan bilimsel kazılarda yapının özgün planının iki katlı, dört eyvanlı ve açık avlulu klasik Selçuklu medrese şemasına sahip olduğu anlaşılmıştır. Günümüzde Sivas Kent Meydanı'nın simgesi olan eser, karşısındaki Şifaiye Medresesi ile birlikte eşsiz bir mimari diyalog kurmaktadır.`,

    audioGuide: {
      title: "Çifte Minareli Medrese Sesli Rehberi",
      duration: "2 dk 45 sn",
      text: "Merhaba tarih kâşifi! Şu anda Sivas Tarihî Kent Meydanı'nda, Anadolu'nun en görkemli taş ve çini yapılarından biri olan Çifte Minareli Medrese'nin önündesin. Bu eser, 1271 yılında İlhanlı Veziri Şemseddin Cüveynî tarafından hadis ilimlerinin öğretilmesi için yaptırılmıştır. Önündeki taçkapıya dikkatlice bak: Taşın adeta bir dantel gibi oyulduğunu, ışık-gölge oyunlarının yüzeye derinlik kattığını görebilirsin. Taçkapının üstünde yükselen çift minareye gözlerini çevirdiğinde ise gökyüzüne uzanan firuze renkli çiniler ve tuğla örgü sanatı seni karşılar. Arkandaki boşluk seni yanıltmasın; 19. yüzyılda yıkılan iki katlı medrese avlusu burada bulunuyordu. Şimdi dijital model üzerinde gezintiye çıkıp mimari detayları keşfedebilirsin!"
    },

    // 3B Sahne Etkileşimli Bölümleri (Hotspots)
    hotspots: [
      { id: "tackapi", name: "Mukarnaslı Taçkapı", pos: [0, 1.8, 0.4], desc: "Kalker ve mermerden yontulmuş, kademeli sivri kemerli ve mukarnas hücreli anıtsal giriş kapısı. Üzerinde geometrik yıldız geçmeler ve Rumi tezyinat yer alır." },
      { id: "minare-sol", name: "Sol Çinili Minare", pos: [-1.4, 4.8, 0.1], desc: "Sekizgen kaide üzerine silindirik tuğla gövdeli minare. Firuze renkli sırlı tuğlalarla örülmüş geometrik zikzak örgüler ve çini mozaik bilezikler taşır." },
      { id: "minare-sag", name: "Sağ Çinili Minare", pos: [1.4, 4.8, 0.1], desc: "Sol minare ile simetrik; petek ve şerefe altı mukarnas süslemelidir. Üst kısmı külahla sonlanır." },
      { id: "kitabe", name: "Tarihî Taş Kitabe Kuşağı", pos: [0, 2.8, 0.35], desc: "Taçkapı kemeri üzerinde kabartma sülüs hatla yazılmış, H. 670 (1271) yapım tarihini ve banisi Şemseddin Cüveyni'yi belirten mermer kitabe kuşağı." },
      { id: "kose-kulesi", name: "Kabartmalı Köşe Payandaları", pos: [-3.2, 1.2, 0.2], desc: "Ön cephenin iki ucunda yer alan yarım silindirik yivli destek kuleleri; cepheye hem statik güç hem de anıtsallık katar." },
      { id: "avlu-izleri", name: "Arkeolojik Avlu İzi (Yıkılmış Bölüm)", pos: [0, 0.4, -2.5], desc: "1963 kazılarında temelleri ortaya çıkarılan dört eyvanlı, revaklı açık medrese avlusu ve iki katlı talebe hücrelerinin zemin izi." }
    ],

    // Karşılaştırma Matrisi Verileri (10 Kriter)
    comparisonData: {
      buildYear: "1271–1272",
      period: "İlhanlı / Selçuklu",
      patron: "Şemseddin Muhammed Cüveynî (İlhanlı Veziri)",
      purpose: "Dârülhadis (Hadis Medresesi)",
      plan: "İki katlı, dört eyvanlı açık avlulu (temellerden tespitli)",
      materials: "Ön cephede mermer ve kesme taş, minarelerde tuğla ve firuze çini",
      stonework: "Yüksek kabartma mukarnas, geometrik yıldız geçmeler, rumi motifler",
      function: "Hadis öğretimi, kütüphane, ilmi münazaralar",
      changes: "Arka avlu ve hücreler 19. yy sonlarında yıkıldı; cephe ve minareler restore edildi",
      currentUsage: "Açık hava mimari anıtı, tarihi meydan odak noktası"
    },

    // 8. Bölüm: Okul Dışı Öğrenme (Gözlem, Araştırma, Yerinde Keşif)
    fieldStudy: {
      tasks: [
        "Taçkapıdaki taş kabartmalar arasında yer alan geometrik yıldız motiflerinin köşelerini sayınız ve örüntüyü çiziniz.",
        "Minare gövdesindeki firuze renkli çinilerin hangi geometrik deseni oluşturduğunu yerinde veya 3B model üzerinde inceleyiniz.",
        "Taçkapının karşısında yer alan Şifaiye Medresesi ile Çifte Minareli Medrese'nin giriş kapılarını oran ve bezeme yoğunluğu açısından karşılaştırınız.",
        "Günümüze sadece ön cephesinin ulaşmış olmasının nedenlerini tarihsel olaylar (savaşlar, şehirleşme ve ihmal) ışığında tartışınız."
      ]
    },

    // Kaynakça
    references: [
      "Karamağara, H. (1964). Sivas Çifte Minareli Medrese Kazısı. Türk Arkeoloji Dergisi, XIII(2), 220-235.",
      "Kuran, A. (1969). Anadolu Medreseleri, Cilt I. Ankara: ODTÜ Mimarlık Fakültesi Yayınları.",
      "Sözen, M. (1970). Anadolu Medreseleri: Selçuklu ve Beylikler Devri. İstanbul: İTÜ Mimarlık Tarihi Kürsüsü.",
      "Öney, G. (1992). Anadolu Selçuklu Çini Sanatı. Ankara: Türkiye İş Bankası Kültür Yayınları.",
      "T.C. Kültür ve Turizm Bakanlığı Sivas Kültür Varlıklarını Koruma Bölge Kurulu Envanteri, Eser No: 58.00.01."
    ]
  },

  {
    id: "gok-medrese",
    name: "Gök Medrese (Sahip Ata Medresesi)",
    district: "Merkez",
    locationDesc: "Sivas Merkez, Kaleardı Mahallesi",
    lat: 39.7441,
    lon: 37.0168,
    period: "Anadolu Selçuklu Dönemi",
    periodGroup: "selcuklu",
    buildYear: "1271 (H. 670)",
    century: "13. Yüzyıl",
    type: "Medrese ve Mescid",
    typeGroup: "medrese",
    builder: "Sahip Ata Fahreddin Ali (Selçuklu Başveziri)",
    architect: "Kölük bin Abdullah",
    featured: true,
    thumbnail: "assets/images/gok_thumb.jpg",

    condition: {
      surviving: "Mermer taçkapı, çift minare, mescid, darülhadis eyvanı, revaklı avlu ve çinili mescid bütünüyle günümüze ulaşmıştır.",
      lost: "İkinci kat ahşap revaklarının bir kısmı ve hamam bölümü zamanla tahrip olmuş, kapsamlı restorasyonla ihya edilmiştir.",
      survivingNote: "Sivas'ta 1271 yapımı üç medrese arasında bütün mimari unsurlarıyla (avlusu, odaları ve minareleriyle) bütünüyle ayakta kalan tek yapıdır."
    },

    digitalTablet: {
      name: "Gök Medrese (Sahip Ata Medresesi)",
      buildDate: "1271 (Hicri 670)",
      period: "Anadolu Selçuklu Devleti",
      patron: "Selçuklu Veziri Sahip Ata Fahreddin Ali",
      originalFunction: "Dini ilimler ve fen bilimleri medresesi, mescid ve imaret",
      architecturalFeatures: "Beyaz mermer taçkapı, hayat ağacı ve hayvan figürlü kabartmalar, 25 metre yüksekliğinde çinili çift minare, açık avlulu ve revaklı plan.",
      historicalImportance: "Mimar Kölük bin Abdullah'ın başyapıtıdır; Türk-İslam sanatında figürlü taş kabartmaları ve çini tezyinatı birleştiren en önemli anıttır.",
      currentStatus: "Vakıf Müzesi olarak ziyarete açıktır."
    },

    realInscription: {
      location: "Mermer taçkapının giriş kemeri üzerinde",
      originalScript: "امر ببناء هذه المدرسة المباركة في ايام دولة السلطان الاعظم غياث الدنيا والدين كikhusrev بن قليج ارسلان العبد الضعيف المحتاج الى رحمة الله علي بن الحسين... في سنة سبعين وستمائة",
      transcription: "Emere bi-binâi hâzihi'l-medreseti'l-mubâreketi fî eyyâmi devleti's-sultâni'l-a'zam Gıyâsi'd-dünyâ ve'd-dîn Keyhüsrev bin Kılıçarslan el-abdü'd-daîf el-muhtâc ilâ rahmetillâh Ali bin el-Hüseyin... fî seneti seb'îne ve sitte-mie [670]",
      translation: "Bu mübarek medresenin inşasını, ulu sultan Kılıçarslan oğlu Gıyaseddin Keyhüsrev'in saltanatı günlerinde, Allah'ın rahmetine muhtaç zayıf kul Ali bin el-Hüseyin (Sahip Ata) 670 yılında (M. 1271) emretti.",
      verificationStatus: "Kitabe yerinde tam ve eksiksiz mevcuttur."
    },

    writtenHistory: `Gök Medrese, Selçuklu Veziri Sahip Ata Fahreddin Ali tarafından 1271 yılında Konyalı mimar Kölük bin Abdullah'a yaptırılmıştır. Adını minarelerindeki gök mavisi (firuze) çinilerden alan eser, Selçuklu mimarisinin mermer işçiliğindeki zirvesidir. 

Yapının taçkapısı bütünüyle beyaz mermerden inşa edilmiş olup bitkisel, geometrik motifler yanında şamanist kökenli Selçuklu simgeleri olan hayat ağacı, nar meyveleri, kartal ve kuş figürleriyle bezenmiştir. İki katlı, dört eyvanlı açık avlulu medresenin giriş eyvanının üzerinde yer alan mescidin kubbe ve duvarları firuze ve patlıcan moru çinilerle kaplıdır.`,

    audioGuide: {
      title: "Gök Medrese Sesli Rehberi",
      duration: "2 dk 30 sn",
      text: "Şu anda Selçuklu Veziri Sahip Ata'nın Sivas'a armağan ettiği Gök Medrese'nin önündesiniz. Taçkapının beyaz mermerine yakından bakın. Burada hayat ağacı motiflerini, dallarındaki kuşları ve nar tanelerini göreceksiniz. Minarelerdeki firuze çiniler ise gökyüzünün sonsuzluğunu temsil eder."
    },

    hotspots: [
      { id: "gok-tackapi", name: "Beyaz Mermer Taçkapı", pos: [0, 1.8, 0.4], desc: "Türk taş heykel sanatının zirvesi; hayat ağacı, kuş figürleri ve mukarnaslı bezemeler içerir." },
      { id: "gok-minare-sol", name: "Sol Çinili Minare", pos: [-1.3, 4.5, 0.1], desc: "Tuğla örgülü gövdesinde geometrik firuze çiniler ve kabartmalı şerefe altlığı bulunur." },
      { id: "gok-minare-sag", name: "Sağ Çinili Minare", pos: [1.3, 4.5, 0.1], desc: "Simetrik sağ kule; çini mozaik panolarla süslüdür." },
      { id: "gok-avlu", name: "Revaklı Açık Avlu", pos: [0, 0.8, -1.8], desc: "Dört eyvanlı plan şemasına sahip, mermer sütunlu revaklarla çevrili açık avlu." },
      { id: "gok-mescid", name: "Çinili Mescid", pos: [0.8, 1.2, 0.1], desc: "Girişin hemen sağında yer alan, firuze çini mozaiklerle kaplı özgün Selçuklu mescidi." }
    ],

    comparisonData: {
      buildYear: "1271",
      period: "Anadolu Selçuklu",
      patron: "Sahip Ata Fahreddin Ali (Selçuklu Başveziri)",
      purpose: "Medrese, mescid ve imaret",
      plan: "İki katlı, dört eyvanlı, revaklı açık avlulu",
      materials: "Beyaz mermer taçkapı, moloz ve kesme taş beden duvarları, tuğla ve çini minareler",
      stonework: "Mermer üzeri figürlü ve kabartma taş işçiliği (Hayat Ağacı, kuşlar)",
      function: "İslami ilimler ve fen eğitimi, ibadet",
      changes: "Zamanla ikinci kat revakları yıpranmış, Vakıflar tarafından restore edilerek müzeye çevrilmiştir",
      currentUsage: "Vakıf Müzesi olarak ziyarete açık"
    },

    fieldStudy: {
      tasks: [
        "Taçkapıdaki 'Hayat Ağacı' kabartmasını bulunuz ve üzerindeki kuş figürlerini sayınız.",
        "Gök Medrese'nin çift minaresi ile Çifte Minareli Medrese'nin minarelerini çini yoğunluğu bakımından karşılaştırınız."
      ]
    },

    references: [
      "Kuran, A. (1969). Anadolu Medreseleri, Cilt I. Ankara: ODTÜ.",
      "Sözen, M. (1970). Anadolu Medreseleri. İstanbul: İTÜ.",
      "Vakıflar Genel Müdürlüğü Sivas Gök Medrese Restorasyon Raporu (2019)."
    ]
  },

  {
    id: "buruciye-medresesi",
    name: "Buruciye Medresesi",
    district: "Merkez",
    locationDesc: "Sivas Tarihî Kent Meydanı, Çifte Minareli Medrese Bitişiği",
    lat: 39.7489,
    lon: 37.0137,
    period: "Anadolu Selçuklu Dönemi",
    periodGroup: "selcuklu",
    buildYear: "1271 (H. 670)",
    century: "13. Yüzyıl",
    type: "Medrese (Pozitif İlimler ve Astronomi)",
    typeGroup: "medrese",
    builder: "Muzaffereddin Burucirdi (İran'ın Burucerd şehrinden gelme tüccar/hayırsever)",
    architect: "Bilinmiyor",
    featured: true,
    thumbnail: "assets/images/buruciye_thumb.jpg",

    condition: {
      surviving: "Taçkapı, dört eyvanlı açık avlu, talebe hücreleri, revaklar ve baninin çinili türbesi eksiksiz ayaktadır.",
      lost: "Özgün yapının minaresi yoktur (medrese olarak minaresiz planlanmıştır); ahşap kapı kanatları müzeye kaldırılmıştır.",
      survivingNote: "Anadolu Selçuklu açık avlulu medreseleri içinde planı en simetrik ve en kusursuz korunmuş yapıdır."
    },

    digitalTablet: {
      name: "Buruciye Medresesi",
      buildDate: "1271 (Hicri 670)",
      period: "Anadolu Selçuklu Devleti",
      patron: "Muzaffereddin Mübarek el-Burucirdi",
      originalFunction: "Pozitif ilimler (fizik, kimya, astronomi) ve dini ilimler medresesi",
      architecturalFeatures: "Kusursuz dört eyvanlı açık avlulu simetrik plan, dantel gibi oyulmuş kalker taçkapı, firuze çinili bani türbesi.",
      historicalImportance: "1271 yılında Sivas'ta yapılan üçüncü büyük medresedir; Selçuklu plan geometrisinin en dengeli örneğidir.",
      currentStatus: "Kültür merkezi ve çay bahçesi olarak hizmet vermektedir."
    },

    realInscription: {
      location: "Taçkapı kavsarasının üst kemer bordüründe",
      originalScript: "امر بعمارة هذه المدرسة المباركة العبد الضعيف المحتاج الى رحمة الله تعالى مظفر بن هبة الله البروجردي... في سنة سبعين وستمائة",
      transcription: "Emere bi-imâreti hâzihi'l-medreseti'l-mubâreketi el-abdü'd-daîf el-muhtâc ilâ rahmetillâhi teâlâ Muzaffer bin Hibetillâh el-Burûcirdî... fî seneti seb'îne ve sitte-mie [670]",
      translation: "Bu mübarek medresenin inşasını, Allah Teâlâ'nın rahmetine muhtaç zayıf kul Hibetullah oğlu Muzaffer el-Burucirdi 670 yılında (M. 1271) emretti.",
      verificationStatus: "Kitabe yerinde mevcuttur."
    },

    writtenHistory: `Buruciye Medresesi, 1271 yılında Muzaffereddin Burucirdi tarafından pozitif ilimlerin (fizik, kimya, tıp, astronomi) tahsili amacıyla yaptırılmıştır. Selçuklu mimarisinin simetri ve oran anlayışını en yetkin yansıtan eserdir. 

Ön cephedeki anıtsal kalker taçkapı, adeta taşa oyulmuş bir danteli andırır. Girişin solunda medresenin banisi Muzaffereddin Burucirdi ve evlatlarının yattığı firuze ve lacivert mozaik çinilerle kaplı kubbeli türbe odası yer alır.`,

    audioGuide: {
      title: "Buruciye Medresesi Sesli Rehberi",
      duration: "2 dk 15 sn",
      text: "Buruciye Medresesi, Selçuklu mimarisinde simetrinin mükemmel temsilcisidir. Girişteki taş oyma bezemelere dikkat edin. İçeri girdiğinizde ortada açık bir avlu, dört yönde eyvanlar ve etrafında öğrenci odalarını göreceksiniz."
    },

    hotspots: [
      { id: "bur-tackapi", name: "Dantel Taş Taçkapı", pos: [0, 1.8, 0.4], desc: "Kalker taştan oyulmuş, derin gölgeli rumi ve geometrik bordürlü Selçuklu taçkapısı." },
      { id: "bur-turbe", name: "Muzaffereddin Türbesi", pos: [-1.4, 1.2, -0.4], desc: "Giriş eyvanının solunda, firuze ve lacivert çini mozaiklerle kaplı bani sandukası." },
      { id: "bur-avlu", name: "Dört Eyvanlı Avlu", pos: [0, 0.8, -1.8], desc: "Ortasında havuz bulunan, simetrik iki katlı revak dizilerine sahip açık avlu." }
    ],

    comparisonData: {
      buildYear: "1271",
      period: "Anadolu Selçuklu",
      patron: "Muzaffereddin Burucirdi (Tüccar/Bani)",
      purpose: "Pozitif ilimler (Fizik, Kimya, Astronomi) ve İslami ilimler",
      plan: "Tek katlı, dört eyvanlı, revaklı açık avlulu kusursuz simetrik plan",
      materials: "Sarı kalker kesme taş, moloz dolgu, kubbede tuğla ve çini",
      stonework: "Derin yontulu dantel gibi bitkisel ve geometrik rumi bordürler",
      function: "Fen bilimleri ve dini eğitim, türbe",
      changes: "Plan bütünlüğü günümüze dek en iyi korunan Selçuklu medresesidir",
      currentUsage: "Kültür ve sanat merkezi, dinlenme alanı"
    },

    fieldStudy: {
      tasks: [
        "1271 yılında aynı meydanda yapılan Çifte Minareli Medrese ile Buruciye Medresesi'nin plan ve mimari elemanlarını karşılaştırınız: Neden Buruciye'de minare yoktur?",
        "Medrese avlusundaki dört eyvanın derslik ve dinlenme amacıyla nasıl kullanıldığını yerinde gözlemleyiniz."
      ]
    },

    references: [
      "Kuran, A. (1969). Anadolu Medreseleri. Ankara: ODTÜ.",
      "Sözen, M. (1970). Anadolu Medreseleri. İstanbul: İTÜ."
    ]
  },

  {
    id: "sifaiye-medresesi",
    name: "Şifaiye Medresesi (Sivas Darüşşifası)",
    district: "Merkez",
    locationDesc: "Sivas Tarihî Kent Meydanı, Çifte Minareli Medrese Karşısı",
    lat: 39.7485,
    lon: 37.0146,
    period: "Anadolu Selçuklu Dönemi",
    periodGroup: "selcuklu",
    buildYear: "1217–1218 (H. 614)",
    century: "13. Yüzyıl Başı",
    type: "Darüşşifa (Hastane ve Tıp Medresesi)",
    typeGroup: "darussifa",
    builder: "I. İzzeddin Keykavus (Anadolu Selçuklu Sultanı)",
    architect: "Bilinmiyor",
    featured: true,
    thumbnail: "assets/images/sifaiye_thumb.jpg",

    condition: {
      surviving: "Görkemli taçkapı, dört eyvanlı açık avlu, hasta koğuşları, revaklar ve Sultan I. İzzeddin Keykavus'un çinili türbesi ayaktadır.",
      lost: "Güney eyvanı Osmanlı devrinde medreseye çevrilmiş, revak tonozlarının bir kısmı onarımlarla yenilenmiştir.",
      survivingNote: "Dünyanın günümüze ulaşabilen en büyük ve en eski tıp eğitimi ve hastane komplekslerinden biridir."
    },

    digitalTablet: {
      name: "Şifaiye Medresesi (Keykavus Darüşşifası)",
      buildDate: "1217–1218 (Hicri 614)",
      period: "Anadolu Selçuklu Sultanlığı",
      patron: "Sultan I. İzzeddin Keykavus",
      originalFunction: "Hastane (Darüşşifa), akıl ve sinir hastalıkları tedavisi, tıp okulu",
      architecturalFeatures: "Güneş ve ay sembollü insan başı kabartmaları, devasa açık avlu, zengin tuğla ve sırlı çinili Sultan Türbesi.",
      historicalImportance: "İslam medeniyetinde tıp eğitiminin ve modern klinik hastane anlayışının taşla vücut bulmuş anıtıdır.",
      currentStatus: "Geleneksel el sanatları çarşısı ve turistik dinlenme alanı."
    },

    realInscription: {
      location: "Ön cephe taçkapı kemeri üzerinde ve Sultan Türbesi cephesinde",
      originalScript: "امر ببناء هذا المارستان المبارك دار الشفاء... السلطان الاعظم عز الدنيا والدين كikhusrev بن كيقباد... في سنة اربع عشرة وستمائة",
      transcription: "Emere bi-binâi hâze'l-mâristâni'l-mubârek Dâri'ş-Şifâ... es-sultânü'l-a'zam 'İzzü'd-dünyâ ve'd-dîn Keykâvus bin Keyhusrev... fî seneti erba'a 'aşrate ve sitte-mie [614]",
      translation: "Bu mübarek şifahane ve hastanenin inşasını ulu sultan Keyhüsrev oğlu İzzeddin Keykavus 614 yılında (M. 1217) emretti.",
      verificationStatus: "Kitabe yerinde sapasağlam durmaktadır."
    },

    writtenHistory: `Şifaiye Medresesi, Anadolu Selçuklu Sultanı I. İzzeddin Keykavus tarafından 1217 yılında bir hastane (bimaristan/darüşşifa) ve tıp fakültesi olarak yaptırılmıştır. Selçuklu tıp hekimleri burada hem hastaları tedavi etmiş hem de usta-çırak usulüyle tıp öğrencisi yetiştirmiştir. 

Taçkapısında sağda ve solda yer alan kadın ve erkek büstleri (Güneş ve Ay sembolleri) eserin sağlık ve hayatla olan bağını simgeler. Sultan I. İzzeddin Keykavus genç yaşta veremden vefat edince vasiyeti üzerine darüşşifanın güney eyvanına inşa edilen görkemli çinili türbeye defnedilmiştir.`,

    audioGuide: {
      title: "Şifaiye Medresesi Sesli Rehberi",
      duration: "2 dk 40 sn",
      text: "Şu anda Selçuklu döneminin en büyük hastanesinin avlusundasınız. 800 yıl önce burada su sesi ve musikiyle ruhsal hastalıklar tedavi ediliyor, cerrahlar ameliyat yapıyordu. Güneydeki türbede eseri yaptıran Sultan İzzeddin Keykavus ebedi istirahatgâhındadır."
    },

    hotspots: [
      { id: "sif-tackapi", name: "Güneş-Ay Figürlü Taçkapı", pos: [0, 1.8, 0.4], desc: "İnsan yüzü kabartmaları (gece ve gündüzü, sıhhat ve devayı simgeleyen) içeren anıtsal giriş kapısı." },
      { id: "sif-turbe", name: "İzzeddin Keykavus Türbesi", pos: [1.8, 1.4, -0.8], desc: "Firuze, lacivert ve patlıcan moru geometrik çinilerle kaplı, kufi kitabeli sultan türbesi cephesi." },
      { id: "sif-avlu", name: "Hastane Avlusu ve Koğuşlar", pos: [0, 0.8, -1.8], desc: "Hasta odaları ve hekim muayenehanelerinin açıldığı geniş revaklı avlu." }
    ],

    comparisonData: {
      buildYear: "1217–1218",
      period: "Anadolu Selçuklu",
      patron: "Sultan I. İzzeddin Keykavus",
      purpose: "Darüşşifa (Hastane ve Tıp Medresesi) + Sultan Türbesi",
      plan: "Dört eyvanlı, revaklı açık avlulu büyük tıp kompleksi",
      materials: "Kesme taş, tuğla tonozlar, türbede mozaik sırlı çiniler",
      stonework: "Taçkapıda insan başı kabartmaları (kadın/erkek - Güneş/Ay tasvirleri)",
      function: "Hastalıkların tedavisi, tıp eğitimi, musikiyle terapi",
      changes: "1768'de medreseye dönüştürüldü; günümüzde kültür ve el sanatları çarşısı",
      currentUsage: "Kültür ve turizm merkezi, hediyelik eşya dükkanları"
    },

    fieldStudy: {
      tasks: [
        "Taçkapının sağ ve sol kemer köşeliklerindeki Güneş ve Ay simgeli insan yüzü kabartmalarını inceleyiniz.",
        "Sultan Keykavus Türbesi'nin cephesindeki tuğla ve çini süslemeleri diğer medreselerle kıyaslayınız."
      ]
    },

    references: [
      "Cantay, G. (1992). Anadolu Selçuklu Dönemi Şifahaneleri. Ankara: Atatürk Kültür Merkezi.",
      "Kuran, A. (1969). Anadolu Medreseleri. Ankara."
    ]
  },

  {
    id: "sivas-ulu-camii",
    name: "Sivas Ulu Camii",
    district: "Merkez",
    locationDesc: "Sivas Merkez, Cami-i Kebir Mahallesi",
    lat: 39.7463,
    lon: 37.0159,
    period: "Danişmendli / Anadolu Selçuklu Geçiş Dönemi",
    periodGroup: "selcuklu",
    buildYear: "1196–1197 (H. 593)",
    century: "12. Yüzyıl Sonu",
    type: "Ulu Cami (Çok Ayaklı / Kufi Ulu Cami)",
    typeGroup: "cami",
    builder: "Kızılarslan bin İbrahim (Kutbeddin Melikşah dönemi)",
    architect: "Bilinmiyor",
    featured: true,
    thumbnail: "assets/images/ulucami_thumb.jpg",

    condition: {
      surviving: "50 adet taş paye, düz ahşap tavan örtüsü ve 1213 yılında eklenen eğik tuğla minaresi ayaktadır.",
      lost: "İlk minber ve özgün ahşap kısımlar yangın ve onarımlarla yenilenmiştir.",
      survivingNote: "İtalya'daki Pisa Kulesi'nden daha eğik olan kırmızı tuğla minaresiyle ünlüdür."
    },

    digitalTablet: {
      name: "Sivas Ulu Camii",
      buildDate: "1196–1197 (Hicri 593)",
      period: "Danişmendliler ve Anadolu Selçuklu Çağı",
      patron: "Kızılarslan bin İbrahim",
      originalFunction: "Şehrin cuma namazı kılınan en büyük ana camisi (Cami-i Kebir)",
      architecturalFeatures: "50 adet taş ayak üzerine oturan basık çok destekli iç mekân, düz dam örtüsü, 1213 tarihli eğik silindirik tuğla minare.",
      historicalImportance: "Anadolu'nun en eski ulu camilerinden biridir; eğik minaresi Selçuklu tuğla işçiliğinin şaheseridir.",
      currentStatus: "Aktif ibadethane olarak hizmet vermektedir."
    },

    realInscription: {
      location: "Caminin güney duvarında ve minare kaidesinde",
      originalScript: "بني هذا الجامع المبارك في ايام السلطان كليج ارسلان بن مسعود... سنة ثلاث وتسعين وخمسمائة",
      transcription: "Büniye hâze'l-câmi'u'l-mubârek fî eyyâmi's-sultân... senete selâsin ve tis'îne ve hamse-mie [593]",
      translation: "Bu mübarek ulu cami Kutbeddin Melikşah döneminde Kızılarslan bin İbrahim tarafından 593 yılında (M. 1196-1197) inşa edilmiştir.",
      verificationStatus: "Kitabe cami cephesinde mevcuttur."
    },

    writtenHistory: `Sivas Ulu Camii, Anadolu Selçuklu Sultanı II. Kılıçarslan'ın oğlu Kutbeddin Melikşah'ın hükümdarlığı döneminde, Kızılarslan bin İbrahim tarafından 1196-1197 yıllarında yaptırılmıştır. 

Cami, erken dönem İslam ulu camileri (Kufe tipi) geleneğinde çok ayaklı (hipostil) plan şemasına sahiptir. İç mekânda kıbleye dik uzanan 11 sahnı taşıyan 50 adet yığma taş paye yer alır. Caminin güneydoğu köşesindeki silindirik tuğla minare 1213 yılında I. İzzeddin Keykavus devrinde eklenmiştir. Minare zemin hareketleri sebebiyle belirgin bir eğikliğe sahiptir ve bu özelliğiyle Pisa Kulesi'ne benzetilir.`,

    audioGuide: {
      title: "Sivas Ulu Camii Sesli Rehberi",
      duration: "2 dk 20 sn",
      text: "Sivas'ın en eski ibadethanesinin huzurlu sessizliğindesiniz. İçerideki 50 adet taş paye, İslam'ın ilk dönem camilerindeki birlik ve tevazu hissini yaşatır. Dışarıdaki kırmızı tuğla minare ise yüzyıllardır eğik duruşuyla zamana meydan okumaktadır."
    },

    hotspots: [
      { id: "ulu-minare", name: "Tarihî Eğik Minare", pos: [2.2, 3.5, 0], desc: "1213 tarihli, tuğla örgülü, zemin oturması sebebiyle ekseninden eğilmiş Selçuklu minaresi." },
      { id: "ulu-harim", name: "50 Payeli Harim", pos: [0, 0.8, -1.2], desc: "Kıbleye dikey sıralanmış 50 adet taş ayağın taşıdığı geniş ve sade ibadet alanı." }
    ],

    comparisonData: {
      buildYear: "1196–1197",
      period: "Danişmendli / Selçuklu Geçiş",
      patron: "Kızılarslan bin İbrahim",
      purpose: "Şehrin ana ulu camisi (Cuma ibadeti)",
      plan: "Kufe tipi çok ayaklı (hipostil), 50 payeli, kıbleye dik sahınlı",
      materials: "Kesme taş payeler, ahşap kirişli tavan, tuğla minare",
      stonework: "Sade taş işçiliği; bezeme yerine mekânsal sadelik ve oran ön plandadır",
      function: "Cuma namazları, şehir meclisleri ve vaazlar",
      changes: "Minare 1213'te eklendi; tavan ve döşemeler muhtelif tarihlerde onarıldı",
      currentUsage: "Aktif cami ve ibadethane"
    },

    fieldStudy: {
      tasks: [
        "Minarenin eğimini gözlemleyiniz ve neden yıkılmadan ayakta durabildiğini inşa tekniği açısından tartışınız.",
        "Ulu Cami'nin sade iç mekânı ile Divriği Ulu Camii'nin zengin taş işlemelerini karşılaştırınız."
      ]
    },

    references: [
      "Gabriel, A. (1934). Monuments Turcs d'Anatolie, Tome II: Sivas, Amasya. Paris: De Boccard.",
      "Aslanapa, O. (1989). Türk Sanatı. İstanbul: Remzi Kitabevi."
    ]
  },

  {
    id: "kale-camii",
    name: "Kale Camii (Mahmud Paşa Camii)",
    district: "Merkez",
    locationDesc: "Sivas Tarihî Kent Meydanı, Valilik Yanı",
    lat: 39.7478,
    lon: 37.0138,
    period: "Klasik Osmanlı Dönemi",
    periodGroup: "osmanli",
    buildYear: "1580 (H. 988)",
    century: "16. Yüzyıl",
    type: "Cami (Klasik Osmanlı Tek Kubbeli Cami)",
    typeGroup: "cami",
    builder: "Ali Bey oğlu Mahmud Paşa (Sultan III. Murad dönemi Sivas Valisi)",
    architect: "Mimar Sinan Ekolü Osmanlı Mimarı",
    featured: true,
    thumbnail: "assets/images/kalecamii_thumb.jpg",

    condition: {
      surviving: "Kare planlı harim, tek kubbe, üç gözlü son cemaat yeri ve kesme taş minare özgün olarak ayaktadır.",
      lost: "Özgün çevre haziresi ve bazı vakıf eklentileri meydan düzenlemeleri sırasında taşınmıştır.",
      survivingNote: "Sivas Meydanı'ndaki Selçuklu eserleri arasında Osmanlı Klasik üslubunu temsil eden tek anıt camidir."
    },

    digitalTablet: {
      name: "Kale Camii (Mahmud Paşa Camii)",
      buildDate: "1580 (Hicri 988)",
      period: "Klasik Osmanlı Dönemi (Sultan III. Murad Devri)",
      patron: "Sivas Valisi Mahmud Paşa",
      originalFunction: "Kale muhafızları ve halk için ibadethane",
      architecturalFeatures: "Kare mekân üzerine tek kubbe, kesme taştan zarif minare, üç kemerli son cemaat mahalli, taş kuşevi.",
      historicalImportance: "Mimar Sinan dönemi klasik Osmanlı mimarisinin Sivas'taki en seçkin örneğidir.",
      currentStatus: "Aktif ibadethane olarak hizmet vermektedir."
    },

    realInscription: {
      location: "Son cemaat yeri giriş kapısı mermer lentosu üzerinde",
      originalScript: "بنى هذا المسجد لوجه الله تعالى صاحب الخيرات محمود باشا... في سنة ثمان وثمانين وتسعمائة",
      transcription: "Benâ hâze'l-mescide li-vechillâhi teâlâ sâhibü'l-hayrât Mahmûd Paşa... fî seneti semânin ve semânîne ve tis'a-mie [988]",
      translation: "Bu mescidi hayır sahibi Mahmud Paşa Allah rızası için 988 yılında (M. 1580) yaptırmıştır.",
      verificationStatus: "Mermer kitabe özgün olarak kapı üstünde durmaktadır."
    },

    writtenHistory: `Kale Camii, III. Murad devrinde Sivas Valiliği yapan Mahmud Paşa tarafından 1580 yılında inşa ettirilmiştir. Sivas Kent Meydanı'nda Selçuklu medreselerinin çevrelediği tarihî doku içerisinde Klasik Osmanlı mimarisini temsil eden en zarif yapıdır.

Yapı, kesme sarı traverten taşından inşa edilmiş kare planlı ve tek kubbeli bir mekândır. Kuzey cephesinde üç bölümlü, sivri kemerli ve mermer sütunlu son cemaat yeri uzanır. Cephesinde yer alan küçük taş kuşevi, Osmanlı'nın canlılara ve çevreye verdiği merhamet anlayışını somutlaştırır.`,

    audioGuide: {
      title: "Kale Camii Sesli Rehberi",
      duration: "2 dk 10 sn",
      text: "Etrafındaki devasa Selçuklu medreselerinden farklı olarak karşımızda tek kubbeli, sade ve dengeli bir Osmanlı şaheseri var. Cami duvarlarındaki taş kuşevini fark ettiniz mi? Osmanlı mimarları minik kuşları bile unutmamış."
    },

    hotspots: [
      { id: "kale-kubbe", name: "Merkezi Kubbe", pos: [0, 2.5, 0], desc: "Sekizgen kasnak üzerine oturan kurşun kaplı klasik Osmanlı kubbesi." },
      { id: "kale-kusevi", name: "Taş Kuşevi", pos: [-1.2, 1.8, 0.5], desc: "Caminin dış duvarına oyulmuş, serçeler ve güvercinlerin sığınması için yapılmış minyatür taş saray." }
    ],

    comparisonData: {
      buildYear: "1580",
      period: "Klasik Osmanlı",
      patron: "Mahmud Paşa (Sivas Valisi)",
      purpose: "İbadethane ve mahalle camisi",
      plan: "Kare planlı, tek kubbeli, üç gözlü son cemaat yeri",
      materials: "İnce yontu sarı traverten taş, kurşun kaplı kubbe",
      stonework: "Sade ve orantılı Klasik Osmanlı üslubu; dış duvarda taş kuşevi",
      function: "İbadet ve dini eğitim",
      changes: "Depremler sonrası onarılmış, özgün kubbe ve kemer hatları korunmuştur",
      currentUsage: "Aktif cami"
    },

    fieldStudy: {
      tasks: [
        "Kale Camii'nin dış duvarındaki taş kuşevini bulunuz ve fotoğraflayınız.",
        "Aynı meydandaki Selçuklu Çifte Minareli Medrese ile Osmanlı Kale Camii arasındaki oran, kubbe ve malzeme farklarını not ediniz."
      ]
    },

    references: [
      "Yüksel, İ. A. (1983). Osmanlı Mimarisinde Klasik Devir. İstanbul: Fetih Cemiyeti."
    ]
  },

  {
    id: "egri-kopru",
    name: "Eğri Köprü",
    district: "Merkez",
    locationDesc: "Sivas Merkez, Kızılırmak Üzeri (Kardeşler Tepesi Eteği)",
    lat: 39.7267,
    lon: 37.0322,
    period: "Selçuklu Temelli / Osmanlı Onarımlı",
    periodGroup: "selcuklu",
    buildYear: "13. Yüzyıl (Selçuklu) - 16. Yüzyıl Onarımı",
    century: "13. ve 16. Yüzyıl",
    type: "Tarihî Taş Köprü",
    typeGroup: "kopru",
    builder: "Selçuklu Sultanları (Osmanlı Döneminde Genişletildi)",
    architect: "Bilinmiyor",
    featured: true,
    thumbnail: "assets/images/egrikopru_thumb.jpg",

    condition: {
      surviving: "179.6 metre uzunluğundaki 18 kemerli kırık eksenli taş gövdesi ve selyaranları ayaktadır.",
      lost: "Orijinal korkuluk taşlarının bir kısmı zamanla aşınmış, son restorasyonlarda yenilenmiştir.",
      survivingNote: "Kızılırmak'ın azgın sularına karşı nehir akışına göre 130 derecelik açı yapacak şekilde 'eğri' inşa edilmiştir."
    },

    digitalTablet: {
      name: "Eğri Köprü",
      buildDate: "13. Yüzyıl (Selçuklu Dönemi)",
      period: "Anadolu Selçuklu ve Osmanlı Dönemleri",
      patron: "Selçuklu Devleti (Bağdat ve İpek Yolu Güzergâhı)",
      originalFunction: "Kızılırmak geçişini sağlayan kervan ve ordu köprüsü",
      architecturalFeatures: "179.6 m boy, 18 sivri kemer, nehir ortasında 130 derecelik kırık aks, üçgen selyaranlar.",
      historicalImportance: "Kızılırmak akıntısını kırmak amacıyla nehir tabanına kırık eksenli oturtulmuş dünyadaki nadir mühendislik harikalarındandır.",
      currentStatus: "Yaya trafiğine açık tarihî anıt köprü."
    },

    realInscription: {
      location: "Köprü üzerinde özgün yapım kitabesi günümüze ulaşmamıştır",
      originalScript: "Kitabesi mevcut değildir (Osmanlı tahrir defterlerinde 'Kantara-i Cisr-i Kebir' adıyla anılır).",
      transcription: "Kitabe bulunmamaktadır.",
      translation: "Tarihî kaynaklar ve kemer yapı tekniği eserin Selçuklu çağında inşa edilip Osmanlı döneminde onarıldığını kanıtlar.",
      verificationStatus: "Kitabesiz tarihî anıt."
    },

    writtenHistory: `Eğri Köprü, Sivas'ın güneyinde Kızılırmak üzerinde, tarihi Bağdat kervan yolu üzerinde yer alır. Köprünün en şaşırtıcı özelliği dümdüz bir hat yerine 12. kemerden sonra yaklaşık 130 derecelik bir açıyla sola kırılarak devam etmesidir.

Bu eğimin nedeni, ilkbaharda karlar eridiğinde azgınca akan Kızılırmak'ın taşkın gücünü kırmak ve nehrin debisini paylaştırmaktır. 18 adet sivri kemere sahip köprü, Selçuklu mühendislerinin hidrolik ve statik bilgisini gözler önüne serer.`,

    audioGuide: {
      title: "Eğri Köprü Sesli Rehberi",
      duration: "2 dk 05 sn",
      text: "Kızılırmak'ın kıyısındasınız. Bu köprü neden eğri yapılmıştır? Cevap Kızılırmak'ın taşkın sularında gizli. Köprünün ortasındaki dirsek, suyun yıkıcı gücünü dağıtır."
    },

    hotspots: [
      { id: "kopru-kırık", name: "Kırık Eksen (Dirsek)", pos: [0, 0.5, 0], desc: "Köprünün 130 derece kırıldığı mühendislik noktası; suyun debisini azaltır." },
      { id: "kopru-selyaran", name: "Üçgen Selyaranlar", pos: [-1.2, -0.3, 0.8], desc: "Kızılırmak akıntısına karşı yerleştirilmiş sivri mahmuzlar." }
    ],

    comparisonData: {
      buildYear: "13. Yüzyıl (Selçuklu)",
      period: "Selçuklu / Osmanlı",
      patron: "Selçuklu Devleti",
      purpose: "Kervan yolu Kızılırmak geçişi",
      plan: "18 sivri kemerli, 179.6 m uzunluğunda, kırık eksenli köprü",
      materials: "Kesme kalker ve moloz taş, hidrolik harç",
      stonework: "Sağlam yontu taşlar, üçgen ve yuvarlak selyaranlar",
      function: "Ulaşım, ticaret, askeri sefer geçidi",
      changes: "Osmanlı döneminde onarıldı, yakın dönemde yayalaştırıldı",
      currentUsage: "Yaya gezi güzergâhı"
    },

    fieldStudy: {
      tasks: [
        "Köprünün nehir akış yönüne göre kırılma açısını yerinde tespit edip bir mühendislik taslağı çiziniz."
      ]
    },

    references: [
      "Çulpan, C. (1975). Türk Taş Köprüleri. Ankara: Türk Tarih Kurumu."
    ]
  },

  {
    id: "divrigi-ulu-camii",
    name: "Divriği Ulu Camii ve Darüşşifası",
    district: "Divriği",
    locationDesc: "Divriği İlçesi, Kale Mahallesi Eteği",
    lat: 39.3712,
    lon: 38.1236,
    period: "Mengücekliler Beyliği Dönemi",
    periodGroup: "beylikler",
    buildYear: "1228–1229 (H. 626)",
    century: "13. Yüzyıl",
    type: "Külliye (Ulu Cami ve Şifahane)",
    typeGroup: "darussifa",
    builder: "Ahmed Şah (Mengücek Beyi) ve eşi Melike Turan Melek",
    architect: "Ahlatlı Hürremşah",
    featured: true,
    thumbnail: "assets/images/divrigi_thumb.jpg",

    condition: {
      surviving: "Cami, darüşşifa, türbe, dört anıtsal kapı ve eşsiz taş kabartmaların tamamı ayaktadır.",
      lost: "Özgün çatının bir kısmı Osmanlı devrinde kiremitle örtülmüş, modern restorasyonla koruyucu çatı sistemi yapılmıştır.",
      survivingNote: "1985 yılında Türkiye'den UNESCO Dünya Mirası Listesi'ne giren İLK kültürel varlıktır."
    },

    digitalTablet: {
      name: "Divriği Ulu Camii ve Darüşşifası",
      buildDate: "1228–1229 (Hicri 626)",
      period: "Mengücekliler Beyliği (Selçuklu Tabi Devleti)",
      patron: "Mengücek Hükümdarı Ahmed Şah ve eşi Melike Turan Melek",
      originalFunction: "Cuma camisi, tıp şifahanesi, akıl hastanesi ve hanedan türbesi",
      architecturalFeatures: "Cennet Kapısı, Batı Kapısı (Namaz Kılan İnsan Silueti), Şah Mahfili, su sesi havuzu, üç boyutlu barok taş heykeltıraşlığı.",
      historicalImportance: "UNESCO Dünya Kültür Mirası (1985). 'Anadolu'nun Elhamra'sı' olarak anılan, dünyada hiçbir motifi tekrar etmeyen benzersiz şaheser.",
      currentStatus: "Müze ve aktif ibadethane (Kapsamlı restorasyonu tamamlanmıştır)."
    },

    realInscription: {
      location: "Cennet Kapısı (Kuzey Taçkapı) ve Darüşşifa Taçkapısı üzerinde",
      originalScript: "امر بعمارة هذا الجامع المبارك في ايام دولة السلطan الاعظم علاء الدنيا والدين كيقباد... العبد الضعيف احمد شاه بن سليمان شاه... سنة ست وعشرين وستمائة",
      transcription: "Emere bi-imâreti hâze'l-câmi'i'l-mubârek fî eyyâmi devleti's-sultâni'l-a'zam 'Alâi'd-dünyâ ve'd-dîn Keykubâd... el-abdü'd-daîf Ahmed Şâh bin Süleymân Şâh... senete sittin ve 'işrîne ve sitte-mie [626]",
      translation: "Bu mübarek caminin inşasını, ulu sultan Alâeddin Keykubad'ın saltanat günlerinde, zayıf kul Süleyman Şah oğlu Ahmed Şah 626 yılında (M. 1228-1229) emretti.",
      verificationStatus: "Kitabeler kapılarda eksiksiz mevcuttur; mimar Ahlatlı Hürremşah'ın imzası da yer alır."
    },

    writtenHistory: `Divriği Ulu Camii ve Darüşşifası, Mengücekli Beyliği döneminde Süleyman Şah'ın oğlu Ahmed Şah ve eşi Melike Turan Melek tarafından 1228-1229 yıllarında yaptırılmıştır. Mimar Ahlatlı Hürremşah'ın dehasını yansıtan eser, İslam sanatında 'üç boyutlu heykelimsi taş süslemenin' zirve noktasıdır.

Eserde yer alan on binlerce bitkisel, geometrik ve figüratif motifin hiçbiri birbirinin aynı değildir. Batı Taçkapısı'nda ikindi vaktinde oluşan gölge oyunu, namaz kılan bir insan silüeti meydana getirir. 1985 yılında UNESCO Dünya Mirası Listesi'ne alınarak Türkiye'nin dünya çapında tescillenen ilk anıtı olmuştur.`,

    audioGuide: {
      title: "Divriği Ulu Camii ve Darüşşifası Sesli Rehberi",
      duration: "3 dk 10 sn",
      text: "Şu anda dünya mirasının en nadide köşelerinden birindesiniz: Divriği Ulu Camii ve Darüşşifası. Taşın adeta hamur gibi yoğrulduğu Cennet Kapısı'na bakın. Mimar Hürremşah burada evrenin dengesini taşa nakşetmiştir."
    },

    hotspots: [
      { id: "div-cennet", name: "Cennet Kapısı (Kuzey Taçkapı)", pos: [0, 2.2, 0.4], desc: "Aşırı zengin barok taşkabartmalarıyla Cennet tasvirini yansıtan ana anıtsal kapı." },
      { id: "div-bati", name: "Batı Kapısı (Siluet Kapısı)", pos: [-2.2, 1.8, 0], desc: "İkindi güneşinde namaz kılan insan gölgesinin belirdiği kapı." },
      { id: "div-sifahane", name: "Darüşşifa ve Müzikli Havuz", pos: [1.5, 0.8, -1.5], desc: "Su sesi ve ney tınılarıyla akıl hastalarının tedavi edildiği revaklı kapalı avlu." }
    ],

    comparisonData: {
      buildYear: "1228–1229",
      period: "Mengücekliler (Beylikler)",
      patron: "Ahmed Şah ve Melike Turan Melek",
      purpose: "Ulu Cami ve Şifahane kompleksi",
      plan: "Bitişik cami ve kapalı avlulu darüşşifa",
      materials: "Yöresel sarı-gri kalker kesme taş",
      stonework: "Dünyada eşi olmayan yüksek kabartma taş oymacılığı (asimetrik, tekrar etmeyen motifler)",
      function: "İbadet, şifa yurdu, tıp eğitimi ve türbe",
      changes: "UNESCO korumasında; yakın zamanda dev restorasyon tamamlandı",
      currentUsage: "UNESCO Dünya Miras Alanı, müze ve ibadethane"
    },

    fieldStudy: {
      tasks: [
        "Cennet Kapısı üzerindeki yaprak ve çiçek motiflerini inceleyerek simetrik olup olmadıklarını gözlemleyiniz.",
        "Divriği Darüşşifası ile Sivas Şifaiye Medresesi'nin plan ve akustik çözümlerini karşılaştırınız."
      ]
    },

    references: [
      "Önge, Y., Ateş, İ., & Bayram, S. (1978). Divriği Ulu Camii ve Darüşşifası. Ankara: Vakıflar Genel Müdürlüğü.",
      "Kuban, D. (2001). Cennetin Kapıları: Divriği Ulu Camii ve Şifahanesi. İstanbul: YKY."
    ]
  },

  {
    id: "ataturk-kongre-muzesi",
    name: "Sivas Atatürk ve Kongre Müzesi",
    district: "Merkez",
    locationDesc: "Sivas Tarihî Kent Meydanı, İstasyon Caddesi Girişi",
    lat: 39.7491,
    lon: 37.0128,
    period: "Geç Osmanlı & Cumhuriyet / Milli Mücadele",
    periodGroup: "cumhuriyet",
    buildYear: "1892 (Kongre: 4-11 Eylül 1919)",
    century: "19. Yüzyıl Sonu / 20. Yüzyıl Başı",
    type: "İdari Yapı / Tarihî Müze",
    typeGroup: "muze",
    builder: "Sivas Valisi Mazlum Paşazade Mehmed Memduh Bey (Mülki İdadi Olarak)",
    architect: "Bilinmiyor",
    featured: true,
    thumbnail: "assets/images/kongre_thumb.jpg",

    condition: {
      surviving: "Üç katlı taş bina, ahşap tavanlar, kongre salonu ve Mustafa Kemal Paşa'nın çalışma odası orijinal haliyle korunmaktadır.",
      lost: "Yapının ilk dönem bahçe müştemilatının bir kısmı şehir planlamasıyla caddeye dahil edilmiştir.",
      survivingNote: "Milli Mücadele'nin 108 gün boyunca karargâhı olmuş, Cumhuriyet'in temellerinin atıldığı binadır."
    },

    digitalTablet: {
      name: "Sivas Atatürk ve Kongre Müzesi",
      buildDate: "1892 (İnşa) / 4–11 Eylül 1919 (Sivas Kongresi)",
      period: "Geç Osmanlı ve Cumhuriyet / Millî Mücadele Dönemi",
      patron: "Sivas Valisi Mehmed Memduh Bey (Okul Olarak) / Mustafa Kemal Paşa",
      originalFunction: "Sivas Mekteb-i İdâdî-i Mülkîsi (Lise) ve Heyet-i Temsiliye Karargâhı",
      architecturalFeatures: "19. yüzyıl Geç Osmanlı sivil mimarisi, kesme taş dış cephe, iç sofalı ahşap döşemeli plan, anıtsal giriş merdiveni.",
      historicalImportance: "'Manda ve himaye kabul olunamaz' kararının alındığı, vatanın bölünmez bütünlüğünün tescillendiği tarihî merkezdir.",
      currentStatus: "Atatürk ve Kongre Müzesi olarak ziyarete açıktır."
    },

    realInscription: {
      location: "Giriş kapısı üzerinde inşa kitabesi",
      originalScript: "Mekteb-i İdâdî-i Mülkî binası olarak 1310 (1892) senesinde Valî Memduh Bey tarafından inşa olunmuştur.",
      transcription: "Mekteb-i İdâdî-i Mülkî - Sene 1310",
      translation: "Sivas Sivil Lise Binası - Hicri 1310 (Miladi 1892).",
      verificationStatus: "Kitabe ve arşiv kayıtları doğrulanmıştır."
    },

    writtenHistory: `Bina, 1892 yılında Sivas Valisi Mazlum Paşazade Mehmed Memduh Bey tarafından Mekteb-i İdâdî-i Mülkî (sivil lise) olarak inşa ettirilmiştir. Geç Osmanlı sivil mimarisinin görkemli bir örneğidir.

Bina, Türk ve dünya tarihi açısından asıl büyük önemini 4-11 Eylül 1919 tarihleri arasında toplanan Sivas Kongresi'ne ev sahipliği yapmasıyla kazanmıştır. Mustafa Kemal Atatürk ve Heyet-i Temsiliye üyeleri 108 gün boyunca bu binada kalmış, Milli Mücadele'yi buradan yönetmiştir. Günümüzde kongre salonu ve Atatürk'ün yatak ve çalışma odası o günkü eşyalarıyla sergilenmektedir.`,

    audioGuide: {
      title: "Atatürk ve Kongre Müzesi Sesli Rehberi",
      duration: "2 dk 50 sn",
      text: "Cumhuriyet'in temellerinin atıldığı mekândasınız. 4 Eylül 1919 günü Mustafa Kemal Paşa ve delegeler bu salonda toplandı ve 'Milli sınırlar içinde vatan bir bütündür, bölünemez!' haykırışıyla tüm dünyaya bağımsızlık kararımızı ilan etti."
    },

    hotspots: [
      { id: "kongre-salon", name: "Tarihî Kongre Salonu", pos: [0, 1.2, -0.5], desc: "Sivas Kongresi kararlarının alındığı, delegelerin oturduğu özgün sıralar ve başkanlık kürsüsü." },
      { id: "kongre-ataturk", name: "Atatürk'ün Çalışma Odası", pos: [1.2, 1.2, 0.5], desc: "Mustafa Kemal Paşa'nın 108 gün boyunca kaldığı, telgraf muhaberatını yürüttüğü oda." }
    ],

    comparisonData: {
      buildYear: "1892 (Kongre: 1919)",
      period: "Geç Osmanlı / Millî Mücadele",
      patron: "Sivas Valisi Mehmed Memduh Bey",
      purpose: "Eğitim kurumu (İdadi) / Millî Mücadele Karargâhı",
      plan: "Üç katlı, orta sofalı, simetrik Geç Osmanlı kamu binası",
      materials: "Kesme taş dış duvarlar, ahşap bağdadi tavan ve döşemeler",
      stonework: "Neoklasik pencereler, profilli taş silmeler ve üçgen alınlık",
      function: "Lise eğitimi, Millî Mücadele hükümet merkezi, müze",
      changes: "Lise ve kütüphane olarak kullanıldıktan sonra 1981'de müzeye dönüştürüldü",
      currentUsage: "Atatürk ve Kongre Müzesi"
    },

    fieldStudy: {
      tasks: [
        "Müzedeki telgraf odasını inceleyerek telgrafın Millî Mücadele'nin kazanılmasındaki iletişimsel rolünü tartışınız.",
        "Binanın 13. yüzyıl Selçuklu medreseleriyle malzeme ve plan açısından farklarını belirleyiniz."
      ]
    },

    references: [
      "Atatürk, M. K. (1927). Nutuk. Ankara: Türk Tarih Kurumu.",
      "Sivas Valiliği (2019). 100. Yılında Sivas Kongresi. Sivas."
    ]
  },

  {
    id: "sivas-hukumet-konagi",
    name: "Sivas Hükümet Konağı",
    district: "Merkez",
    locationDesc: "Sivas Tarihî Kent Meydanı, Kale Camii Karşısı",
    lat: 39.7496,
    lon: 37.0143,
    period: "Geç Osmanlı Dönemi",
    periodGroup: "osmanli",
    buildYear: "1884 (H. 1301)",
    century: "19. Yüzyıl Sonu",
    type: "İdari Yapı (Vilayet Konağı)",
    typeGroup: "idari",
    builder: "Halil Rıfat Paşa (Sivas Valisi, sonradan Osmanlı Sadrazamı)",
    architect: "Bilinmiyor",
    featured: true,
    thumbnail: "assets/images/valilik_thumb.jpg",

    condition: {
      surviving: "Dış kesme taş beden duvarları, anıtsal giriş kapısı ve kat silmeleri özgün biçimiyle ayaktadır.",
      lost: "1979 yılındaki talihsiz yangında binanın ahşap iç mekânı ve çatısı yanmış, aslına sadık kalınarak yeniden inşa edilmiştir.",
      survivingNote: "'Gidemediğin yer senin değildir' sözünün sahibi Halil Rıfat Paşa'nın eseridir."
    },

    digitalTablet: {
      name: "Sivas Hükümet Konağı",
      buildDate: "1884 (Hicri 1301)",
      period: "Geç Osmanlı Devleti (Sultan II. Abdülhamid Devri)",
      patron: "Sivas Valisi Halil Rıfat Paşa",
      originalFunction: "Sivas Vilayeti İdare ve Hükümet Merkezi",
      architecturalFeatures: "İki katlı kesme taş mimari, simetrik cephe düzeni, neoklasik üçgen alınlık, anıtsal çift kollu merdiven.",
      historicalImportance: "Osmanlı modernleşme döneminde taşrada inşa edilen ilk ve en anıtsal taş vilayet konaklarındandır.",
      currentStatus: "Sivas Valiliği Hizmet Binası olarak kullanılmaktadır."
    },

    realInscription: {
      location: "Giriş kapısı üzerindeki mermer kitabe panosu",
      originalScript: "Devlet-i Aliyye-i Osmâniyye Sivas Vilâyeti Hükûmet Konağı - İnşâsı: Valî Halil Rıfat Paşa, Sene 1301",
      transcription: "Sivas Vilâyeti Hükûmet Konağı - Fî sene 1301",
      translation: "Sivas Vilayeti Hükümet Konağı - Sene 1884.",
      verificationStatus: "Mermer kitabe cephede yer almaktadır."
    },

    writtenHistory: `Sivas Hükümet Konağı, 'Gidemediğin yer senin değildir' vecizesiyle tanınan efsanevi Sivas Valisi Halil Rıfat Paşa tarafından 1884 yılında yaptırılmıştır. 19. yüzyıl Tanzimat sonrası Osmanlı vilayet idaresinin kurumsallaşmasını simgeleyen taş bir yapıdır.

Bina iki katlı olarak kesme taştan inşa edilmiş, daha sonra 1913 yılında üzerine üçüncü bir kat ahşap olarak eklenmiştir. 1979 yılında geçirdiği büyük yangın sonrası üçüncü kat kaldırılarak bina özgün iki katlı taş haline sadık kalınarak restore edilmiştir. Günümüzde Sivas Valiliği olarak işlevini sürdürmektedir.`,

    audioGuide: {
      title: "Sivas Hükümet Konağı Sesli Rehberi",
      duration: "2 dk 00 sn",
      text: "Karşınızdaki zarif taş bina, Osmanlı'nın büyük devlet adamı Halil Rıfat Paşa'nın Sivas'a hediyesidir. Sivas'tan Karadeniz'e yollar açan Paşa, bu binadan koca bir vilayeti yönetmiştir."
    },

    hotspots: [
      { id: "huk-giris", name: "Anıtsal Giriş Portali", pos: [0, 1.5, 0.4], desc: "Barok ve Neoklasik etkiler taşıyan iki katlı sütunlu giriş merdiveni." }
    ],

    comparisonData: {
      buildYear: "1884",
      period: "Geç Osmanlı",
      patron: "Halil Rıfat Paşa (Sivas Valisi)",
      purpose: "Vilayet idare merkezi (Valilik)",
      plan: "İki katlı, simetrik dikdörtgen plan, orta koridorlu idari şema",
      materials: "Yöresel yontu kesme taş, demir korkuluklar",
      stonework: "Neoklasik cephe silmeleri, pencereler üstü kemerli taş söveler",
      function: "Devlet yönetimi ve adli hizmetler",
      changes: "1979 yangını sonrası özgün iki katlı taş yapısına döndürüldü",
      currentUsage: "Sivas Valiliği makamı ve idari bina"
    },

    fieldStudy: {
      tasks: [
        "Hükümet Konağı'nın simetrik cephe düzenini inceleyerek Cumhuriyet dönemi kamu binalarıyla benzerliklerini araştırınız."
      ]
    },

    references: [
      "Sivas Vilayet Salnameleri (1301/1884).",
      "Kaya, İ. (2004). Halil Rıfat Paşa ve Sivas. Sivas Araştırmaları."
    ]
  }
];

// ============================================================================
// OKUL DIŞI ÖĞRENME: ÖN TEST VE SON TEST DEĞERLENDİRME SORULARI
// (TÜBİTAK 2204-B Bilimsel Veri Analizi İçin 5 Maddelik Çoktan Seçmeli Test)
// ============================================================================

window.SIVAS_ASSESSMENT = {
  title: "Sivas Kültürel Mirası Ön Test / Son Test Değerlendirme Aracı",
  description: "Öğrencilerin okul dışı veya dijital gezi öncesi ve sonrasındaki tarihsel bilgi, kanıt kullanma ve çıkarım düzeylerini ölçmek için hazırlanmıştır.",
  questions: [
    {
      id: "q1",
      question: "Çifte Minareli Medrese'nin günümüze sadece ön taçkapı cephesinin ulaşmış olmasının ve arkasında açık bir alan bulunmasının temel sebebi nedir?",
      options: [
        "A) Başlangıçta sadece bir zafer takı olarak inşa edilmiş olması",
        "B) Arka kısımdaki iki katlı avlu ve öğrenci hücrelerinin 19. yüzyıl sonunda yıkılmış olması",
        "C) Mimarının inşaatı yarım bırakıp şehirden ayrılması",
        "D) Selçuklu medreselerinin hiçbirinde kapalı oda geleneğinin bulunmaması"
      ],
      correct: 1,
      evidence: "1963 yılında Prof. Dr. Haluk Karamağara kazılarıyla 4 eyvanlı 2 katlı medrese temelleri ortaya çıkarılmıştır."
    },
    {
      id: "q2",
      question: "1271 (Hicri 670) yılında Sivas'ta aynı anda yükselen üç büyük Selçuklu/İlhanlı medresesi hangi seçenekte doğru verilmiştir?",
      options: [
        "A) Çifte Minareli Medrese - Gök Medrese - Buruciye Medresesi",
        "B) Şifaiye Medresesi - Ulu Cami - Kale Camii",
        "C) Divriği Ulu Camii - Eğri Köprü - Hükümet Konağı",
        "D) Buruciye Medresesi - Kongre Müzesi - Şifaiye Medresesi"
      ],
      correct: 0,
      evidence: "Her üç eserin de kitabelerinde H. 670 (M. 1271) tarihi kayıtlıdır."
    },
    {
      id: "q3",
      question: "Eğri Köprü'nün Kızılırmak üzerinde dümdüz değil de 130 derecelik bir açıyla 'kırık eksenli' inşa edilmesinin temel mühendislik sebebi nedir?",
      options: [
        "A) Taş ocağının köprünün sol tarafında yer alması",
        "B) O dönemin hükümdarının böyle bir şekil istemiş olması",
        "C) İlkbaharda coşan Kızılırmak'ın taşkın su gücünü kırmak ve debiyi dağıtmak",
        "D) Kervanların köprü üzerinde daha yavaş yürümesini sağlamak"
      ],
      correct: 2,
      evidence: "Hidrolik mühendislik ilkesi gereği suyun cepheden çarpma basıncını düşürmek için kırık aks uygulanmıştır."
    },
    {
      id: "q4",
      question: "1985 yılında Türkiye'den UNESCO Dünya Kültür Mirası Listesi'ne giren İLK anıt eser aşağıdakilerden hangisidir?",
      options: [
        "A) İstanbul Ayasofya Camii",
        "B) Sivas Gök Medrese",
        "C) Çifte Minareli Medrese",
        "D) Divriği Ulu Camii ve Darüşşifası"
      ],
      correct: 3,
      evidence: "Divriği Ulu Camii ve Darüşşifası 1985 yılında UNESCO Dünya Mirası Listesi'ne 358 numara ile kaydedilmiştir."
    },
    {
      id: "q5",
      question: "Sivas Atatürk ve Kongre Müzesi binası, 4-11 Eylül 1919 tarihindeki kongreden önce özgün olarak hangi amaçla inşa edilmiştir?",
      options: [
        "A) Mekteb-i İdâdî-i Mülkî (Sivil Lise Binası)",
        "B) Askeri Kışla Binası",
        "C) Osmanlı Vilayet Postanesi",
        "D) Ticaret Kervansarayı"
      ],
      correct: 0,
      evidence: "1892 yılında Vali Mazlum Paşazade Memduh Bey tarafından lise binası olarak yaptırılmıştır."
    }
  ]
};
