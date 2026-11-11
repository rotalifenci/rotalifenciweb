window.TUBITAK_SEED_DATA = {
  "projects": {
    "proje-tarih": {
      "id": "proje-tarih",
      "title": "Sivas Tarihî Eserler Araştırma Sistemi",
      "code": "TUBITAK-2204-TARIH",
      "badge": "TÜBİTAK 2204-B Tarih & Kültürel Miras",
      "description": "Sivas kent merkezi ve ilçelerindeki Selçuklu, İlhanlı, Beylikler ve Osmanlı mimari eserlerinin bilimsel araştırma ve arşivleme sistemi.",
      "icon": "fa-solid fa-monument",
      "color": "from-amber-600 via-orange-600 to-amber-700",
      "criteriaList": [
        {
          "key": "c1_location",
          "title": "1. Eserin Adı ve Bulunduğu Yer",
          "placeholder": "Eserin tam bilimsel adı, il/ilçe, mahalle ve coğrafi konumu...",
          "required": true
        },
        {
          "key": "c2_date_period",
          "title": "2. İnşa Tarihi ve Tarihsel Dönemi",
          "placeholder": "Hicri ve miladi inşa yılı, ait olduğu devlet/dönem...",
          "required": true
        },
        {
          "key": "c3_builder_purpose",
          "title": "3. Banisi ve Yapılış Amacı",
          "placeholder": "Eseri kim, hangi vakıf geliri ve amaçla yaptırdı? Mimarı kimdir?...",
          "required": true
        },
        {
          "key": "c4_architecture",
          "title": "4. Mimari ve Sanatsal Özellikleri",
          "placeholder": "Plan tipi, kullanılan taş/malzeme, taçkapı, süslemeler, kubbe/tonoz detayları...",
          "required": true
        },
        {
          "key": "c5_inscription",
          "title": "5. Kitabe Bilgileri",
          "placeholder": "Taçkapı, minare veya çeşme kitabesinin transkripsiyonu ve anlamı...",
          "required": false
        },
        {
          "key": "c6_historical_changes",
          "title": "6. Tarihsel Süreçte Geçirdiği Değişimler",
          "placeholder": "Geçirdiği yangın, deprem, yıkım ve bilimsel restorasyonlar...",
          "required": false
        },
        {
          "key": "c7_comparative_history",
          "title": "7. Karşılaştırmalı Tarih Araştırması",
          "placeholder": "Dönemin diğer eserleriyle benzerlik ve ayrışan yönleri...",
          "required": false
        },
        {
          "key": "c8_sources",
          "title": "8. Kaynakça ve Belgeler",
          "placeholder": "İncelenen akademik kitaplar, makaleler, arşiv belgeleri ve arşiv fotoğrafları...",
          "required": true
        }
      ],
      "items": [
        {
          "id": "cifte-minareli-medrese",
          "title": "Çifte Minareli Medrese (Dârülhadis)",
          "district": "Merkez",
          "period": "İlhanlı / Selçuklu Dönemi",
          "periodGroup": "ilhanli",
          "buildYear": "1271–1272 (H. 670)",
          "builder": "Şemseddin Muhammed el-Cüveynî (İlhanlı Sahip-Divanı)",
          "location": "Sivas Tarihî Kent Meydanı",
          "summary": "1271 yılında İlhanlı veziri Şemseddin Cüveynî tarafından yaptırılan, Anadolu Selçuklu taş işçiliğinin ve çinili tuğla minare mimarisinin şaheseridir.",
          "criteria": {
            "c1_location": "Sivas Tarihî Kent Meydanı, Şifaiye Medresesi karşısı. Merkez / SİVAS (39.7483° K, 37.0142° D).",
            "c2_date_period": "1271–1272 (Hicri 670). İlhanlılar hâkimiyetindeki Anadolu Selçuklu devri.",
            "c3_builder_purpose": "Bani: İlhanlı veziri ve Sahip-Divan Şemseddin Muhammed el-Cüveynî. Yapılış amacı: Hadis ilimlerinin okutulduğu yüksek ihtisas medresesi (Dârülhadis).",
            "c4_architecture": "İki katlı, dört eyvanlı açık avlulu plan şemasına sahipti. Günümüze anıtsal doğu taçkapısı ve iki çinili minaresi ulaşmıştır. Taçkapıda geometrik geçmeler, rumi motifler ve mukarnas dolgular yer alır.",
            "c5_inscription": "Taçkapı nişinin üzerinde sülüs hatla yazılmış Arapça kitabe kuşağı mevcuttur. Kitabede eserin banisi ve yapım tarihi açıkça belirtilmiştir.",
            "c6_historical_changes": "1882 yılında Sivas Valisi Halil Rıfat Paşa döneminde medrese binasının büyük kısmı yıkılarak yerine sivil hastane inşa edilmiştir; yalnızca ön cephe korunmuştur.",
            "c7_comparative_history": "Erzurum Çifte Minareli Medrese ve Sivas Gök Medrese ile karşılaştırıldığında taş işçiliğindeki derin oyma tekniği ve çinili tuğla süslemeleriyle Tebriz-Azerbaycan etkisini yansıtır.",
            "c8_sources": "Konyalı, İ. H. (1955). Abideleri ve Kitabeleriyle Sivas Tarihi. TDV İslâm Ansiklopedisi, 'Çifte Minareli Medrese' maddesi."
          }
        },
        {
          "id": "gok-medrese",
          "title": "Gök Medrese (Sahip Ata Medresesi)",
          "district": "Merkez",
          "period": "Anadolu Selçuklu Devleti",
          "periodGroup": "selcuklu",
          "buildYear": "1271 (H. 670)",
          "builder": "Sahip Ata Fahreddin Ali (Selçuklu Başveziri)",
          "location": "Gökmedrese Mahallesi, Merkez / SİVAS",
          "summary": "Mermer kaplama görkemli taçkapısı, kabartma hayat ağacı motifleri ve gök mavisi çinileriyle Selçuklu sanatının doruk noktasıdır.",
          "criteria": {
            "c1_location": "Gökmedrese Caddesi, Merkez / SİVAS.",
            "c2_date_period": "1271 (Hicri 670), III. Gıyaseddin Keyhüsrev dönemi Anadolu Selçuklu Devleti.",
            "c3_builder_purpose": "Bani: Selçuklu veziri Sahip Ata Fahreddin Ali. Mimar: Konyalı Kaluyan. İslami ilimler ve fıkıh tedrisatı için yaptırılmıştır.",
            "c4_architecture": "Açık avlulu, iki katlı, dört eyvanlı medrese. Taçkapısı tamamen beyaz mermerden yapılmış olup kabartma hayat ağacı, nar motifleri ve çift başlı kartal figürleriyle süslenmiştir.",
            "c5_inscription": "Mermer taçkapı üzerinde celi sülüs hatla yazılmış üç satırlık kitabe ve minare kaidelerinde Ayetü'l-Kürsi kuşağı yer alır.",
            "c6_historical_changes": "1926 yılında müzeye dönüştürülmüş, 2006-2019 yılları arasında Vakıflar Genel Müdürlüğü tarafından kapsamlı bilimsel restorasyondan geçirilmiştir.",
            "c7_comparative_history": "Konya İnce Minareli Medrese ve Sahip Ata Külliyesi ile mimari benzerlik taşır; Selçuklu barok üslubunun en seçkin örneğidir.",
            "c8_sources": "Sözen, M. (1970). Anadolu Medreseleri. İstanbul: İTÜ Mimarlık Fakültesi Yayınları."
          }
        },
        {
          "id": "buruciye-medresesi",
          "title": "Buruciye Medresesi",
          "district": "Merkez",
          "period": "Anadolu Selçuklu Devleti",
          "periodGroup": "selcuklu",
          "buildYear": "1271 (H. 670)",
          "builder": "Muzaffer Burucerdî",
          "location": "Sivas Kent Meydanı, Şifaiye Yanı",
          "summary": "Anadolu Selçuklu taş oymacılığının dantel zarafetindeki en kusursuz simetrik planlı dört eyvanlı medresesidir.",
          "criteria": {
            "c1_location": "Sivas Kent Meydanı, Çifte Minareli Medrese batısı.",
            "c2_date_period": "1271 yılı, Anadolu Selçuklu Devri.",
            "c3_builder_purpose": "Bani: İran'ın Burucerd şehrinden gelip Sivas'a yerleşen tüccar Hacı Muzaffer Burucerdî. Pozitif bilimler ve astronomi eğitimi için inşa edilmiştir.",
            "c4_architecture": "Açık avlulu, dört eyvanlı, revaklı medrese plan tipinin en dengeli ve simetrik yapısıdır. Sarımtırak kalker taşından oyulmuş taçkapısı adeta bir dantel gibidir.",
            "c5_inscription": "Giriş portalinde banisinin adını ve yapılış amacını belirten sülüs kitabe kuşağı mevcuttur.",
            "c6_historical_changes": "Uzun yıllar bakımsız kaldıktan sonra 1960'larda ve 2010'lu yıllarda restore edilerek kültür merkezi olarak ziyarete açılmıştır.",
            "c7_comparative_history": "Kayseri Hunat Hatun ve Sivas Şifaiye Medreseleriyle revak düzeni bakımından paraleldir.",
            "c8_sources": "Gabriel, A. (1934). Monuments Turcs d'Anatolie. Paris: De Boccard."
          }
        },
        {
          "id": "sifaiye-medresesi",
          "title": "Şifaiye Medresesi (Dârüşşifası)",
          "district": "Merkez",
          "period": "Anadolu Selçuklu Devleti",
          "periodGroup": "selcuklu",
          "buildYear": "1217 (H. 614)",
          "builder": "I. İzzeddin Keykavus (Selçuklu Sultanı)",
          "location": "Sivas Kent Meydanı",
          "summary": "Dünyanın günümüze ulaşabilmiş en eski ve en büyük tıp fakültesi ve hastane komplekslerinden biri olup sultan türbesini de barındırır.",
          "criteria": {
            "c1_location": "Sivas Tarihî Kent Meydanı, Çifte Minare karşısı.",
            "c2_date_period": "1217 (Hicri 614), I. İzzeddin Keykavus dönemi.",
            "c3_builder_purpose": "Bani: Selçuklu Sultanı I. İzzeddin Keykavus. Yapılış amacı: Hastaların ücretsiz tedavi edildiği bimaristan (hastane) ve hekim yetiştiren tıp medresesi.",
            "c4_architecture": "Dört eyvanlı açık avlulu plan. Taçkapısında astrolojik Güneş ve Aslan kabartmaları, insan başı figürleri yer alır. Güney eyvanında sultanın çinili türbesi bulunur.",
            "c5_inscription": "Vakfiye niteliğindeki uzun anıtsal kitabesinde hastanenin işleyişi ve geliri vakfedilen köyler anlatılır.",
            "c6_historical_changes": "Osmanlı döneminde 1768 fermanıyla medreseye dönüştürülmüş, I. Dünya Savaşı'nda levazım ambarı olarak kullanılmıştır.",
            "c7_comparative_history": "Divriği Turan Melek Dârüşşifası ve Gevher Nesibe Tıp Medresesi ile birlikte Selçuklu tıbbının temel sütunudur.",
            "c8_sources": "Bayat, A. H. (2000). Osmanlı Öncesi Anadolu Türk Tıp Tarihi. İzmir."
          }
        },
        {
          "id": "divrigi-ulu-camii",
          "title": "Divriği Ulu Camii ve Dârüşşifası",
          "district": "Divriği",
          "period": "Mengücekliler Dönemi",
          "periodGroup": "beylikler",
          "buildYear": "1228–1229",
          "builder": "Ahmet Şah ve Melike Turan Melek",
          "location": "Divriği Kalesi eteği, Divriği / SİVAS",
          "summary": "UNESCO Dünya Mirası Listesi'nde yer alan, taşın adeta hamur gibi yoğrulduğu Cennet Kapısı ve namaz kılan insan siluetiyle dünya mimarlık harikasıdır.",
          "criteria": {
            "c1_location": "Divriği ilçe merkezi, kale yamacı, Divriği / SİVAS.",
            "c2_date_period": "1228–1229 yılları, Mengücekli Beyliği.",
            "c3_builder_purpose": "Bani: Mengücek hükümdarı Ahmet Şah ve eşi Melike Turan Melek. Başmimar: Ahlatlı Hürremşah. İbadet, tıp ve akıl sağlığı tedavisi.",
            "c4_architecture": "Cami ve darüşşifadan oluşan birleşik külliye. Gotik, Barok ve Selçuklu taş oymacılığını harmanlayan Cennet Kapısı, Batı Kapısı ve Şah Mahfili bulunur. İkindi güneşinde namaz kılan insan silueti oluşur.",
            "c5_inscription": "Her taçkapıda ve minberde sülüs ve kufi hatla ayetler ve kitabeler bulunmaktadır. Minberi abanoz ağacından kündekari tekniğiyle yapılmıştır.",
            "c6_historical_changes": "1985 yılında UNESCO Dünya Mirası Listesi'ne Türkiye'den giren ilk mimari eserdir. 2015-2024 yılları arasında asrın restorasyonu yapılmıştır.",
            "c7_comparative_history": "Evliya Çelebi eseri 'Üstat elinden çıkmış öyle bir yapıdır ki benzerini anlatmaya diller kısır, kalemler kırıktır' sözleriyle tanımlamıştır.",
            "c8_sources": "Kuban, D. (2001). Divriği Mucizesi: Selçuklu Çağında İslam Bezeme Sanatı Harikası. YKY."
          }
        },
        {
          "id": "sivas-ulu-camii",
          "title": "Sivas Ulu Camii",
          "district": "Merkez",
          "period": "Danişmendliler / Selçuklu",
          "periodGroup": "beylikler",
          "buildYear": "1197 (H. 593)",
          "builder": "Kutalmışoğlu Melikşah dönemi / Kul Ahi",
          "location": "Ulucami Mahallesi, Merkez / SİVAS",
          "summary": "50 ahşap direğiyle Anadolu'nun en eski ahşap direkli camilerinden biri ve Pisa Kulesi'nden daha eğik tarihî tuğla minaresiyle ünlüdür.",
          "criteria": {
            "c1_location": "Merkez Ulucami Mahallesi, SİVAS.",
            "c2_date_period": "1197 (Hicri 593), Danişmendliler hâkimiyeti.",
            "c3_builder_purpose": "Bani: Kul Ahi ve Kutalmışoğlu Melikşah. Cuma namazları ve ulu toplanmalar için cami-i kebir olarak inşa edilmiştir.",
            "c4_architecture": "Kıbleye dikey uzanan nefli, 50 adet yontma taş paye üzerine oturan düz toprak damlı ulu cami plan şeması. Eğik tuğla minaresi 1230'larda eklenmiştir.",
            "c5_inscription": "Cami girişinde ve minare kaidesinde sülüs kufi kitabeler bulunur.",
            "c6_historical_changes": "1955 yılında Vakıflar Genel Müdürlüğü tarafından çatı onarımı yapılmış, minare eğikliği düzenli lazer sensörlerle izlenmektedir.",
            "c7_comparative_history": "Konya Alâeddin Camii ve Diyarbakır Ulu Camii ile erken dönem Anadolu İslam mimarisini temsil eder.",
            "c8_sources": "Konyalı, İ. H. (1955). Abideleri ve Kitabeleriyle Sivas Tarihi."
          }
        },
        {
          "id": "egri-kopru",
          "title": "Tarihî Eğri Köprü",
          "district": "Merkez",
          "period": "Selçuklu Dönemi",
          "periodGroup": "selcuklu",
          "buildYear": "13. Yüzyıl (Selçuklu)",
          "builder": "Selçuklu Sultanlığı İmar Teşkilatı",
          "location": "Kızılırmak Nehri üzeri, Kardeşler Tepe Eteği",
          "summary": "Kızılırmak'ın azgın debisini kırmak için ortasında 45 derecelik kırık eksenle (dirsekle) inşa edilmiş 18 kemerli mühendislik harikasıdır.",
          "criteria": {
            "c1_location": "Sivas-Malatya eski İpek Yolu güzergâhı, Kızılırmak nehri üzerinde.",
            "c2_date_period": "13. yüzyıl Selçuklu yapımı, 16. yüzyıl Osmanlı onarımı.",
            "c3_builder_purpose": "İpek Yolu kervanlarının ve ordunun Kızılırmak'ı güvenle geçebilmesi için kervan yolu köprüsü olarak inşa edilmiştir.",
            "c4_architecture": "179 metre uzunluğunda, 18 sivri kemerli taş köprü. Nehrin akış yönüne karşı kırık açıyla (V biçimli) kıvrılarak suyun hidrolik basıncını dağıtan özel statik tasarıma sahiptir.",
            "c5_inscription": "Köprü üzerinde onarım kitabesi yer almaktadır.",
            "c6_historical_changes": "Cumhuriyet döneminde yanına yeni betonarme köprü yapılana kadar ana karayolu olarak hizmet vermiş, günümüzde yayalaştırılmıştır.",
            "c7_comparative_history": "Amasya Alçak Köprü ve Tokat Hıdırlık Köprüsü ile benzer Selçuklu kervan köprüleri ailesindendir.",
            "c8_sources": "Çulpan, C. (1975). Türk Taş Köprüleri. Ankara: TTK Yayınları."
          }
        },
        {
          "id": "ataturk-kongre-muzesi",
          "title": "Sivas Atatürk ve Kongre Müzesi (Mekteb-i Sultânî)",
          "district": "Merkez",
          "period": "Geç Osmanlı & Cumhuriyet",
          "periodGroup": "cumhuriyet",
          "buildYear": "1892 (Mektep) / 1919 (Kongre)",
          "builder": "Sivas Valisi Mazlum Paşazade Mehmed Memduh Bey",
          "location": "İnönü Bulvarı, Kent Meydanı, SİVAS",
          "summary": "Mustafa Kemal Atatürk ve Heyet-i Temsiliye'nin 108 gün boyunca Milli Mücadele'yi yönettiği, Cumhuriyetin temellerinin atıldığı tarihî mektep binasıdır.",
          "criteria": {
            "c1_location": "Sivas Kent Meydanı, İnönü Bulvarı, Merkez / SİVAS.",
            "c2_date_period": "1892'de Mülkî İdadi/Sultani olarak inşa edildi; 4-11 Eylül 1919 Sivas Kongresi'ne ev sahipliği yaptı.",
            "c3_builder_purpose": "Bani: Sivas Valisi Mehmed Memduh Bey. Mimar: Sivaslı Ermeni Mimar Kirkor. Eğitim binası olarak inşa edilmiş, İstiklal Mücadelesi karargâhı olmuştur.",
            "c4_architecture": "Geç dönem Osmanlı neoklasik sivil mimarisi. Üç katlı, kesme taş ve tuğla örgülü, geniş iç avlulu anıtsal idadi binası.",
            "c5_inscription": "Giriş kapısı üzerinde 1892 tarihli Osmanlıca inşa kitabesi bulunmaktadır.",
            "c6_historical_changes": "1919'da Kongre Salonu ve karargâh, ardından Sivas Lisesi olarak hizmet vermiş, 1984'te müze yapılmıştır.",
            "c7_comparative_history": "Erzurum Kongre Binası ve Ankara 1. TBMM Binası ile birlikte Milli Mücadele'nin kutsal üçgenini oluşturur.",
            "c8_sources": "Atatürk, M. K. (1927). Nutuk. Türk İnkılap Tarihi Enstitüsü."
          }
        }
      ]
    },
    "proje-bilim": {
      "id": "proje-bilim",
      "title": "Türk-İslam Bilim İnsanları Araştırma Sistemi",
      "code": "TUBITAK-2204-BILIM",
      "badge": "TÜBİTAK 2204-B Bilim Tarihi & Felsefe",
      "description": "Ortaçağ İslam dünyasında yetişmiş ve dünya bilim mirasına yön vermiş Türk-İslam bilginlerinin biyografi ve buluşları arşivi.",
      "icon": "fa-solid fa-atom",
      "color": "from-cyan-600 via-blue-600 to-indigo-700",
      "criteriaList": [
        {
          "key": "c1_name_dates",
          "title": "1. Adı ve Doğum-Ölüm Tarihleri",
          "placeholder": "Bilim insanının tam künyesi, lakabı, doğum ve ölüm yılları/yerleri...",
          "required": true
        },
        {
          "key": "c2_period_geography",
          "title": "2. Yaşadığı Dönem ve Coğrafya",
          "placeholder": "Hangi yüzyılda, hangi devlet ve şehirlerde yaşadı?...",
          "required": true
        },
        {
          "key": "c3_education",
          "title": "3. Eğitim Hayatı",
          "placeholder": "Hangi medreselerde tahsil gördü, kimlerden ders aldı?...",
          "required": true
        },
        {
          "key": "c4_biography",
          "title": "4. Hayat Hikâyesi",
          "placeholder": "Çocukluğu, saray/rasathane görevleri, seyahatleri ve önemli dönüm noktaları...",
          "required": true
        },
        {
          "key": "c5_fields",
          "title": "5. İlgilendiği Bilim Dalları",
          "placeholder": "Astronomi, matematik, tıp, optik, mekanik vb. çalışma alanları...",
          "required": true
        },
        {
          "key": "c6_contributions",
          "title": "6. Bilimsel Çalışmaları ve Katkıları",
          "placeholder": "Geliştirdiği aletler, deneyler, teoriler ve dünya bilimine öncü katkıları...",
          "required": true
        },
        {
          "key": "c7_works",
          "title": "7. Yazdığı Eserler",
          "placeholder": "Kaleme aldığı risale ve kitapların adları, içerikleri ve günümüzdeki kütüphane kayıtları...",
          "required": true
        },
        {
          "key": "c8_sources",
          "title": "8. Kaynakça ve Belgeler",
          "placeholder": "Akademik kaynaklar, yazma eserler ve çağdaş bilim tarihi yayınları...",
          "required": true
        }
      ],
      "items": [
        {
          "id": "ali-kuscu",
          "title": "Ali Kuşçu",
          "lifespan": "1403 - 1474",
          "field": "Astronomi ve Matematik",
          "fieldGroup": "astronomi",
          "geography": "Semerkant - Tebriz - İstanbul",
          "summary": "Semerkant Rasathanesi'nde yetişen, Fatih Sultan Mehmet tarafından İstanbul'a davet edilen ve Ay'ın ilk detaylı haritasını çıkaran büyük astronom.",
          "criteria": {
            "c1_name_dates": "Ali Kuşçu (Alâeddin Ali bin Muhammed). Doğum: 1403 (Semerkant), Vefat: 16 Aralık 1474 (İstanbul).",
            "c2_period_geography": "15. Yüzyıl Timur İmparatorluğu, Akkoyunlu Devleti ve Osmanlı İmparatorluğu (Fatih Sultan Mehmet dönemi). Semerkant, Tebriz, İstanbul.",
            "c3_education": "Uluğ Bey, Kadızâde-i Rûmî ve Gıyaseddin Cemşid el-Kâşî'den Semerkant Medresesi'nde astronomi, geometri ve riyaziye tahsil etti. Kirman'da öğrenimini derinleştirdi.",
            "c4_biography": "Uluğ Bey'in doğancıbaşısı olan babası nedeniyle 'Kuşçu' lakabını aldı. Uluğ Bey'in vefatı sonrası Akkoyunlu hükümdarı Uzun Hasan'a elçi oldu. Fatih'in ısrarlı davetiyle İstanbul'a gelerek Ayasofya Medresesi başmüderrisi oldu.",
            "c5_fields": "Gökbilim (Astronomi), Matematik, Geometri, Trigonometri, Dilbilim (Kelâm ve Belâgat).",
            "c6_contributions": "Dünya'nın eğikliğini (ekliptik eğimi) 23 derece 30 dakika 17 saniye olarak inanılmaz bir hassasiyetle hesapladı. Yer çekimi benzeri kuvvet fikirleri tartıştı. NASA, Ay'daki kraterlerden birine onun adını vermiştir.",
            "c7_works": "Risâle fi'l-Hey'e (Astronomi risalesi), er-Risâletü'l-Fethiyye (Fatih'e ithaf ettiği astronomi kitabı), er-Risâletü'l-Muhammediyye (Matematik kitabı), Şerh-i Zîc-i Uluğ Bey.",
            "c8_sources": "İhsanoğlu, E. (1992). Osmanlılar ve Bilim. Sayılı, A. (1960). The Observatory in Islam. TDV İA 'Ali Kuşçu' maddesi."
          }
        },
        {
          "id": "ibn-i-sina",
          "title": "İbn-i Sina (Avicenna)",
          "lifespan": "980 - 1037",
          "field": "Tıp ve Felsefe",
          "fieldGroup": "tip",
          "geography": "Buhara - Hemedan - İsfahan",
          "summary": "Modern tıbbın babalarından biri kabul edilen, yazdığı 'El-Kanun fi't-Tıbb' eseri 600 yıl Avrupa üniversitelerinde başucu kitabı okutulan deha.",
          "criteria": {
            "c1_name_dates": "Ebu Ali el-Hüseyin İbn Abdullah İbn Sina. Batı'da 'Avicenna' olarak bilinir. 980 (Afşana/Buhara) - 1037 (Hemedan).",
            "c2_period_geography": "İslam'ın Altın Çağı, Samanîler ve Gazneliler devri. Horasan ve İran coğrafyası.",
            "c3_education": "10 yaşında Kur'an ve edebiyatı tamamladı. Mantık, geometri ve astronomiyi Ebu Abdullah en-Nâtilî'den öğrendi. 16 yaşında hekimliğe adım attı ve yeni tedavi yöntemleri keşfetti.",
            "c4_biography": "Samanî hükümdarı Nuh bin Mansur'u tedavi edince saray kütüphanesine erişim kazandı. Hayatı boyunca vezirlik, hekimlik ve hocalık yaptı.",
            "c5_fields": "Tıp, Farmakoloji, Felsefe (Meşşâiyye), Psikoloji, Fizik, Kimya, Müzik.",
            "c6_contributions": "Hastalıkların gözle görülmeyen minik kurtçuklarla (mikroplarla) havadan ve sudan bulaştığını savundu. Kan dolaşımı, nabız ritimleri, anestezi ve karantina kavramının temellerini attı.",
            "c7_works": "El-Kânûn fi't-Tıbb (Tıbbın Kanunu - 5 ciltlik anıtsal tıp ansiklopedisi), Kitâbü'ş-Şifâ (Felsefe ve tabiat ilimleri ansiklopedisi), Kitâbü'n-Necât.",
            "c8_sources": "Nasr, S. H. (1993). İslam ve İlim. TDV İslâm Ansiklopedisi 'İbn Sînâ' maddesi."
          }
        },
        {
          "id": "ibn-i-heysem",
          "title": "İbn-i Heysem (Alhazen)",
          "lifespan": "965 - 1040",
          "field": "Optik ve Fizik",
          "fieldGroup": "fizik",
          "geography": "Basra - Kahire",
          "summary": "Optik biliminin kurucusu, görme teorisini bilimsel deneylerle kökten değiştiren ve Karanlık Oda (Camera Obscura) prensibini bulan dâhi.",
          "criteria": {
            "c1_name_dates": "Ebu Ali el-Hasan İbnü'l-Heysem. Batı dünyasında 'Alhazen'. 965 (Basra) - 1040 (Kahire).",
            "c2_period_geography": "10–11. Yüzyıl Abbâsîler ve Fâtımîler Devleti dönemi. Irak ve Mısır.",
            "c3_education": "Basra'da dini ve felsefi ilimleri öğrendikten sonra Bağdat'a giderek matematik, fizik ve astronomi alanında ileri eğitim aldı.",
            "c4_biography": "Nil Nehri'nin taşkınlarını düzenleyecek bir baraj projesi tasarladı; teknik imkânsızlıklar nedeniyle Fâtımî halifesinin gazabından korunmak için bir süre inzivaya çekildi ve odasında ışık deneylerine odaklandı.",
            "c5_fields": "Optik, Işık Fiziği, Geometri, Astronomi, Bilimsel Metodoloji.",
            "c6_contributions": "Eski Yunan'ın 'Gözden ışın çıkar' iddiasını çürüttü. Görmenin, cisimlerden yansıyan ışınların göz merceğine girmesiyle oluştuğunu ispatladı. Fotoğraf makinesinin atası olan Karanlık Oda'yı (Beytü'l-Muzlim) kurdu.",
            "c7_works": "Kitâbü'l-Menâzır (Optik Kitabı - 7 cilt, modern optiğin temel taşı), Makâle fi'd-Dav' (Işık Üzerine Makale).",
            "c8_sources": "Sabra, A. I. (1989). The Optics of Ibn al-Haytham. London: Warburg Institute."
          }
        },
        {
          "id": "el-biruni",
          "title": "El-Bîrûnî (Abu Rayhan al-Biruni)",
          "lifespan": "973 - 1048",
          "field": "Astronomi, Coğrafya ve Matematik",
          "fieldGroup": "astronomi",
          "geography": "Hârizm - Gazne - Hindistan",
          "summary": "Gazneli Mahmud'un 'Sarayımın en değerli hazinesi' dediği, Dünya'nın yarıçapını ve çevresini sadece %1 hata payıyla hesaplayan evrensel hezârfen.",
          "criteria": {
            "c1_name_dates": "Ebu Reyhan Muhammed bin Ahmed el-Bîrûnî. 4 Eylül 973 (Kât/Hârizm) - 13 Aralık 1048 (Gazne).",
            "c2_period_geography": "10-11. Yüzyıl, Samanîler ve Gazneliler Devleti dönemi. Orta Asya ve Hindistan.",
            "c3_education": "Ebu Nasr Mansur'dan ileri matematik ve astronomi eğitimi aldı. Arapça, Farsça, Süryanice, İbranice, Grekçe ve Sanskritçe öğrendi.",
            "c4_biography": "Sultan Gazneli Mahmud ile birlikte Hindistan seferlerine katıldı; Hint kültürünü, dinlerini ve coğrafyasını yerinde inceledi.",
            "c5_fields": "Astronomi, Jeodezi, Coğrafya, Trigonometri, Karşılaştırmalı Dinler Tarihi, Madencilik ve Eczacılık.",
            "c6_contributions": "Dünya'nın kendi ekseni etrafında döndüğünü savundu. Trigonometrik formüllerle Dünya'nın yarıçapını 6339.6 km (gerçeğe %1 yakın) olarak ölçtü. Kıble yönü tayini için matematiksel modeller geliştirdi.",
            "c7_works": "el-Kānûnü'l-Mes'ûdî (Astronomi ansiklopedisi), Kitâbü't-Tahkîk mâ li'l-Hind (Hindistan Tarihi), Kitâbü's-Saydene fi't-Tıb (Eczacılık kitabı), Tahdîdü Nihâyâti'l-Emâkin.",
            "c8_sources": "Sezgin, F. (2008). İslam'da Bilim ve Teknik. TÜBİTAK Yayınları."
          }
        },
        {
          "id": "el-harezmi",
          "title": "El-Hârizmî (Algoritmanın Babası)",
          "lifespan": "780 - 850",
          "field": "Matematik ve Astronomi",
          "fieldGroup": "matematik",
          "geography": "Hârizm - Bağdat (Beytü'l-Hikme)",
          "summary": "Cebir biliminin bağımsız bir disiplin olarak kurucusu, sıfır (0) rakamını matematiğe kazandıran ve algoritma kavramına adını veren dahi.",
          "criteria": {
            "c1_name_dates": "Ebu Abdullah Muhammed bin Musa el-Hârizmî. Batı'da 'Algoritmi'. 780 (Hârizm) - 850 (Bağdat).",
            "c2_period_geography": "9. Yüzyıl Abbasi Devleti, Halife Me'mûn dönemi. Bağdat.",
            "c3_education": "Bağdat'taki Beytü'l-Hikme'de (Bilgelik Evi) dönemin en seçkin bilginleriyle birlikte çalışarak Babil, Hint ve Grek matematik metinlerini inceledi.",
            "c4_biography": "Halife Me'mûn tarafından Beytü'l-Hikme kütüphane yöneticiliğine getirildi. Halife adına yeryüzü haritası hazırlayan heyetin başına geçti.",
            "c5_fields": "Cebir (Algebra), Algoritmik Matematik, Astronomi, Coğrafya.",
            "c6_contributions": "Birinci ve ikinci dereceden denklemleri cebirsel olarak çözme yöntemlerini kurdu. 'Cebir' ve 'Algoritma' kelimeleri onun eserinden ve isminden türemiştir. Sıfır (0) rakamını ve onluk konumsal sayı sistemini dünyaya tanıttı.",
            "c7_works": "El-Kitâbü'l-Muhtasar fî Hisâbi'l-Cebr ve'l-Mukābele (Cebir kitabı), Kitâbü'l-Cem' ve't-Tefrîk bi-Hisâbi'l-Hind (Hint Hesabı Üzerine), Sûretü'l-Ard (Coğrafya kitabı), Zîcü's-Sindhind.",
            "c8_sources": "Rashed, R. (1994). The Development of Arabic Mathematics. Dordrecht: Kluwer."
          }
        },
        {
          "id": "el-cezeri",
          "title": "El-Cezerî (Sibernetiğin Öncüsü)",
          "lifespan": "1136 - 1206",
          "field": "Mekanik ve Robotik",
          "fieldGroup": "mekanik",
          "geography": "Cizre - Diyarbakır (Artuklular)",
          "summary": "Robotik, otomasyon ve hidrolik makinelerin babası; su saatleri, otomatik abdest otomatı ve şifreli kilitlerin mucidi Artuklu saray mühendisi.",
          "criteria": {
            "c1_name_dates": "Bedîuzzamân Ebû el-'İzz İsmâ'îl İbnü'r-Rezzâz el-Cezerî. 1136 (Cizre) - 1206 (Cizre).",
            "c2_period_geography": "12. Yüzyıl sonu - 13. Yüzyıl başı. Artuklular Beyliği, Diyarbakır ve Cizre.",
            "c3_education": "Babası gibi Artuklu sarayında başmühendislik yaptı; mekanik araçlar, kaldıraçlar ve hidrolik sistemler üzerine uygulamalı usta-çırak geleneğinde yetişti.",
            "c4_biography": "25 yıl boyunca Diyarbakır Artuklu hükümdarlarına başmühendis olarak hizmet etti. Hükümdar Nasîrüddin Mahmud'un isteği üzerine icatlarını kitaplaştırdı.",
            "c5_fields": "Mekanik Mühendisliği, Sibernetik, Otomasyon, Hidrolik, Robotik.",
            "c6_contributions": "Krank mili ve piston mekanizmasını icat ederek dairesel hareketi doğrusal harekete çevirdi (modern otomobil motorlarının temeli). Programlanabilir müzisyen insansı robotlar, Filli Su Saati ve akıllı şamandıra sistemleri yaptı.",
            "c7_works": "El-Câmi' Beyne'l-'İlm ve'l-'Ameli'n-Nâfi' fî Sınâ'ati'l-Hiyel (Mekanik Hareketlerden Mühendislikte Faydalanma Kitabı).",
            "c8_sources": "Hill, D. R. (1974). The Book of Knowledge of Ingenious Mechanical Devices. Dordrecht."
          }
        },
        {
          "id": "ulug-bey",
          "title": "Uluğ Bey",
          "lifespan": "1394 - 1449",
          "field": "Astronomi ve Matematik",
          "fieldGroup": "astronomi",
          "geography": "Semerkant - Horasan",
          "summary": "Timur'un torunu olan sultan ve astronom; Semerkant Rasathanesi'ni kurarak 1018 yıldızın konumunu dakik hesaplayan 'Zîc-i Uluğ Bey'i yazmıştır.",
          "criteria": {
            "c1_name_dates": "Muhammed Taragay Uluğ Bey. 22 Mart 1394 (Sultaniye) - 27 Ekim 1449 (Semerkant).",
            "c2_period_geography": "15. Yüzyıl Timur İmparatorluğu dönemi. Semerkant.",
            "c3_education": "Bursalı Kadızâde-i Rûmî ve Gıyaseddin Cemşid el-Kâşî'den matematik ve astronomi tahsil etti.",
            "c4_biography": "Devlet yöneticiliğinden ziyade kendini bilime adadı. Semerkant'ı bir bilim ve kültür başkentine dönüştürdü; büyük bir medrese ve devasa bir rasathane inşa ettirdi.",
            "c5_fields": "Gözlemsel Astronomi, Küresel Geometri, Trigonometri.",
            "c6_contributions": "Döneminin en büyük meridyen sekstantını (40 metre yarıçaplı fahrî sekstant) kurdu. 1 yılın uzunluğunu 365 gün 5 saat 49 dakika 15 saniye olarak hesapladı (hata payı sadece 25 saniye).",
            "c7_works": "Zîc-i Uluğ Bey (Zîc-i Sultânî - 1018 yıldızın koordinatlarını içeren şaheser yıldız kataloğu), Risâle fî İshârci Ceyb Derece Vâhida.",
            "c8_sources": "Sayılı, A. (1960). The Observatory in Islam. Ankara: Türk Tarih Kurumu."
          }
        },
        {
          "id": "el-farabi",
          "title": "El-Fârâbî (Alpharabius - Muallim-i Sânî)",
          "lifespan": "872 - 950",
          "field": "Felsefe, Mantık ve Müzik",
          "fieldGroup": "felsefe",
          "geography": "Farab (Otrar) - Bağdat - Şam",
          "summary": "Aristo'dan sonra 'İkinci Öğretmen' (Muallim-i Sânî) unvanını kazanan, mantık, siyaset felsefesi ve kanun sazını icat eden büyük Türk filozofu.",
          "criteria": {
            "c1_name_dates": "Ebu Nasr Muhammed bin Muhammed el-Fârâbî. Batı'da 'Alpharabius'. 872 (Farab/Kazakistan) - 950 (Şam).",
            "c2_period_geography": "9-10. Yüzyıl Abbâsîler ve Hamdânîler dönemi. Türkistan, Bağdat, Halep, Şam.",
            "c3_education": "Farab ve Buhara'da ilk tahsilini yaptıktan sonra Bağdat'a giderek mantıkçı Ebû Bişr Mettâ bin Yûnus'tan ve Yuhanna bin Haylan'dan Grek felsefesi ve mantık okudu.",
            "c4_biography": "Sade ve dervişane bir hayat sürdü. Halep emiri Seyfüddevle'nin sarayında ilmi meclislerde bulundu.",
            "c5_fields": "Felsefe, Mantık, Siyaset Teorisi, Müzik Teorisi, Psikoloji, Sosyoloji.",
            "c6_contributions": "İslam felsefesini sistemleştirdi. Aristo mantığını şerh etti. 'El-Medînetü'l-Fâzıla' eserinde ideal erdemli devleti tarif etti. Ses fiziği ve akustiğin kurucularındandır; müzikte ses perdelerini matematiksel olarak açıklamış ve 'kanun' enstrümanını geliştirmiştir.",
            "c7_works": "el-Medînetü'l-Fâzıla (Erdemli Şehir), Kitâbü'l-Mûsîka'l-Kebîr (Büyük Müzik Kitabı), İhsâ'ü'l-Ulûm (İlimlerin Sayımı - ilk bilimler tasnifi), et-Ta'lîkāt.",
            "c8_sources": "Kaya, M. (1995). Fârâbî: Hayatı, Eserleri ve Felsefesi. İstanbul."
          }
        }
      ]
    },
    "proje-siyer": {
      "id": "proje-siyer",
      "title": "Siyer Kronolojik Araştırma Sistemi (571–632)",
      "code": "TUBITAK-2204-SIYER",
      "badge": "TÜBİTAK 2204-B Dijital Siyer Atlası",
      "description": "571 yılından 632 yılına kadar Peygamber Efendimiz'in (s.a.v.) hayatındaki tüm hadiselerin kronolojik zaman çizelgesi ve analitik araştırması.",
      "icon": "fa-solid fa-timeline",
      "color": "from-emerald-600 via-teal-600 to-emerald-800",
      "criteriaList": [
        {
          "key": "c1_event_name_year",
          "title": "1. Olayın Adı ve Yılı",
          "placeholder": "Tarihsel olayın kesin adı, miladi ve hicri yılı...",
          "required": true
        },
        {
          "key": "c2_location",
          "title": "2. Olayın Geçtiği Yer",
          "placeholder": "Hadisenin cereyan ettiği şehir, mevki veya coğrafi koordinat...",
          "required": true
        },
        {
          "key": "c3_historical_explanation",
          "title": "3. Olayın Tarihsel Açıklaması",
          "placeholder": "Olayın başlangıcı, arka planı ve tarihsel bağlamı...",
          "required": true
        },
        {
          "key": "c4_development_results",
          "title": "4. Olayın Gelişimi ve Sonuçları",
          "placeholder": "Olay esnasında yaşananlar, taraflar ve İslam tarihindeki neticeleri...",
          "required": true
        },
        {
          "key": "c5_values",
          "title": "5. Olayla İlişkili Değer veya Değerler",
          "placeholder": "Adalet, merhamet, sabır, vefa, istişare, kardeşlik gibi çıkarılan kök değerler...",
          "required": false
        },
        {
          "key": "c6_sources",
          "title": "6. Kaynakça ve Belgeler",
          "placeholder": "Kur'an ayetleri, sahih hadis kaynakları (Kütüb-i Sitte) ve klasik siyer kaynakları...",
          "required": true
        }
      ],
      "items": [
        {
          "id": "siyer-571",
          "year": 571,
          "title": "Fil Hadisesi ve Hz. Muhammed'in (s.a.v.) Dünyaya Teşrifi",
          "location": "Mekke-i Mükerreme",
          "summary": "Ebrehe'nin Kâbe'yi yıkma girişiminin hüsranla sonuçlanması ve 12 Rebiülevvel (20 Nisan 571) Pazartesi günü Peygamber Efendimiz'in doğumu.",
          "criteria": {
            "c1_event_name_year": "Peygamber Efendimiz Hz. Muhammed'in (s.a.v.) Dünyaya Teşrifi ve Fil Hadisesi (Miladi 571).",
            "c2_location": "Mekke-i Mükerreme, Hâşimoğulları Mahallesi, Şi'b-i Ebî Tâlib civarı.",
            "c3_historical_explanation": "Hz. Peygamber doğmadan birkaç ay önce babası Abdullah vefat etmiştir. Dedesi Abdülmuttalib tarafından 'Muhammed' ismi verilmiştir.",
            "c4_development_results": "İnsanlığın cehalet karanlığına gömüldüğü bir dönemde son elçi dünyaya teşrif etmiş, Fil Ordusu mucizevi şekilde helak edilmiştir.",
            "c5_values": "Merhamet, Adalet, Vefa ve Şükür.",
            "c6_sources": "İbn Hişâm, es-Sîretü'n-Nebeviyye, I, 156-168. İbn Sa'd, et-Tabakātü'l-Kübrâ, I, 100-112. Diyanet İslam Ansiklopedisi, 'Fil Vak'ası'."
          }
        },
        {
          "id": "siyer-575",
          "year": 575,
          "title": "Sütanne Halime'nin Yanında Geçen Çocukluk ve Mekke'ye Dönüş",
          "location": "Sa'doğulları Yurdu & Mekke",
          "summary": "Mekke ikliminin ağırlığı nedeniyle havası temiz çöl bölgesinde Sa'doğulları yurdunda sütannesi Halime bint Ebî Züeyb'in himayesinde geçen 4 yıl.",
          "criteria": {
            "c1_event_name_year": "Sa'doğulları Yurdunda İkamet ve Şakku's-Sadr Hadisesi (Miladi 571–575).",
            "c2_location": "Tâif yakınlarında Benî Sa'd çöl obaları.",
            "c3_historical_explanation": "Kureyş eşrafının çocuklarını fasih Arapça öğrenmeleri ve sağlıklı büyümeleri için sahra kabilelerine emanet etme geleneğine uygun olarak Hz. Halime'ye verildi.",
            "c4_development_results": "Beni Sa'd yurdu berekete kavuştu. Peygamber Efendimiz en saf ve duru Arapça lehçesiyle büyüdü.",
            "c5_values": "Emanet, Anne Sevgisi, Sabır ve Şefkat.",
            "c6_sources": "İbn İshâk, Sîretü İbn İshâk. Köksal, M. A. (2008). İslâm Tarihi (Mekke Devri)."
          }
        },
        {
          "id": "siyer-577",
          "year": 577,
          "title": "Medine Ziyareti ve Annesi Hz. Âmine'nin Ebvâ'da Vefatı",
          "location": "Ebvâ Köyü (Mekke - Medine Yolu)",
          "summary": "Hz. Âmine'nin eşinin kabrini ve akrabalarını ziyaret için gittiği Yesrib (Medine) dönüşünde Ebvâ'da vefatı.",
          "criteria": {
            "c1_event_name_year": "Hz. Âmine'nin Vefatı ve Ebvâ'da Defni (Miladi 577, Efendimiz 6 yaşında).",
            "c2_location": "Ebvâ köyü (Mekke ile Medine arasındaki konak yeri).",
            "c3_historical_explanation": "Hz. Âmine, sadık hizmetkâr Ümmü Eymen ile birlikte yetim oğlunu babasının kabrine götürdü. Dönüş yolunda hastalanarak Ebvâ'da vefat etti.",
            "c4_development_results": "Sevgili Peygamberimiz hem öksüz hem yetim kaldı. Ümmü Eymen onu Mekke'ye getirip dedesi Abdülmuttalib'e teslim etti.",
            "c5_values": "Sabır, Metanet, Vefa ve Anne Hakkı.",
            "c6_sources": "İbn Sa'd, et-Tabakāt, I, 116. İbnü'l-Esîr, el-Kâmil fi't-Târîh."
          }
        },
        {
          "id": "siyer-579",
          "year": 579,
          "title": "Dedesi Abdülmuttalib'in Vefatı ve Amcası Ebû Tâlib'in Himayesi",
          "location": "Mekke-i Mükerreme",
          "summary": "Kureyş'in reisi olan dedesi Abdülmuttalib'in 8 yaşında vefat etmesi üzerine sevgili torununu koruma görevini amcası Ebû Tâlib'e vasiyet etmesi.",
          "criteria": {
            "c1_event_name_year": "Abdülmuttalib'in Vefatı ve Ebû Tâlib'in Yanına Geçiş (Miladi 579).",
            "c2_location": "Mekke-i Mükerreme.",
            "c3_historical_explanation": "Abdülmuttalib vefat döşeğindeyken oğulları arasından en şefkatli ve cömert olan Ebû Tâlib'i çağırarak yeğenini emanet etti.",
            "c4_development_results": "Ebû Tâlib ve eşi Fâtıma bint Esed, Efendimiz'i öz çocuklarından üstün tutarak büyüttü.",
            "c5_values": "Akrabalık Bağı (Sıla-i Rahim), Ahde Vefa ve Fedakârlık.",
            "c6_sources": "Belâzürî, Ensâbü'l-Eşrâf. Sarıçam, İ. (2004). Hz. Muhammed ve Evrensel Mesajı."
          }
        },
        {
          "id": "siyer-582",
          "year": 582,
          "title": "Şam Ticaret Seferi ve Râhip Bahîrâ Olayı",
          "location": "Busra (Güney Suriye)",
          "summary": "12 yaşındayken amcası Ebû Tâlib ile katıldığı Şam kervanında Hristiyan din bilgini Râhip Bahîrâ'nın peygamberlik alametlerini teşhis etmesi.",
          "criteria": {
            "c1_event_name_year": "Busra Ticaret Seyahati ve Râhip Bahîrâ Hadisesi (Miladi 582).",
            "c2_location": "Busra kasabası (Şam ticaret güzergâhında menzil).",
            "c3_historical_explanation": "Kervanı gölgeleyen bir bulutu ve ağaçların secde edercesine eğildiğini gören Bahîrâ, kervana ziyafet verdi ve çocuğun iki küreği arasındaki nübüvvet mührünü gördü.",
            "c4_development_results": "Bahîrâ'nın 'Onu Şam'daki Yahudilerden koru' tavsiyesi üzerine Ebû Tâlib mallarını Busra'da satarak derhal Mekke'ye döndü.",
            "c5_values": "Firasat, İlahi Koruma ve Tedbir.",
            "c6_sources": "Tirmizî, Menâkıb, 3. İbn Hişâm, es-Sîre, I, 180-183."
          }
        },
        {
          "id": "siyer-591",
          "year": 591,
          "title": "Ficâr Savaşı ve Hilfü'l-Fudûl (Erdemliler İttifakı)",
          "location": "Mekke, Abdullah bin Cüd'ân'ın Evi",
          "summary": "Zulme ve haksızlığa uğrayan yabancı tüccarları korumak amacıyla kurulan ilk insan hakları ve sivil savunma cemiyetine Hz. Muhammed'in katılımı.",
          "criteria": {
            "c1_event_name_year": "Hilfü'l-Fudûl (Erdemliler Antlaşması) Kuruluşu (Miladi 591, 20 yaşında).",
            "c2_location": "Mekke, Abdullah b. Cüd'ân'ın evi.",
            "c3_historical_explanation": "Yemenli bir tüccarın malını gasp eden Âs bin Vâil'e karşı Mekke'nin ileri gelen kabileleri toplanarak 'Mekke'de yerli ya da yabancı kime zulmedilirse hakkı alınıncaya kadar mazlumun yanında olacağız' diye yemin ettiler.",
            "c4_development_results": "Peygamberimiz peygamberliğinden sonra 'Bugün de böyle bir cemiyete çağrılsam yine katılırım' buyurarak adaletin evrenselliğini tescillemiştir.",
            "c5_values": "Adalet, Hak Arama, Mazlumun Yanında Olma, Sivil Dayanışma.",
            "c6_sources": "Ahmed b. Hanbel, el-Müsned, I, 190. TDV İslâm Ansiklopedisi, 'Hilfü'l-Fudûl' maddesi."
          }
        },
        {
          "id": "siyer-595",
          "year": 595,
          "title": "Hz. Hatice ile Evliliği ve Muhammedü'l-Emîn Vasfı",
          "location": "Mekke-i Mükerreme",
          "summary": "Güvenilirliği, doğruluğu ve ahlakı sebebiyle Kureyş'in 'El-Emîn' unvanını verdiği Efendimiz'in Hz. Hatice Validemiz ile evlenmesi.",
          "criteria": {
            "c1_event_name_year": "Hz. Hatice ile Evlilik (Miladi 595, Efendimiz 25, Hz. Hatice 40 veya 28 yaşında).",
            "c2_location": "Mekke-i Mükerreme, Hz. Hatice'nin evi.",
            "c3_historical_explanation": "Hz. Hatice'nin kervanını Şam'a götüren Efendimiz'in dürüstlüğüne ve kölesi Meysere'nin tanıklık ettiği güzel ahlakına hayran olan Hz. Hatice evlilik teklifinde bulundu.",
            "c4_development_results": "25 yıl süren huzurlu bir yuva kuruldu; Kāsım, Abdullah, Zeyneb, Rukıyye, Ümmü Külsûm ve Fâtıma dünyaya geldi.",
            "c5_values": "Sadakat, Dürüstlük, Aile Sevgisi, Güven (Emanet).",
            "c6_sources": "Buhârî, Bed'ü'l-Vahy, 3. İbn Hişâm, I, 199-203."
          }
        },
        {
          "id": "siyer-605",
          "year": 605,
          "title": "Kâbe Hakemliği ve Hacerü'l-Esved'in Yerine Konulması",
          "location": "Kâbe-i Muazzama",
          "summary": "Kâbe'nin tamirinde kabileler arasında kanlı bir savaşa yol açacak Hacerü'l-Esved taşını koyma krizini dâhiyane adaletiyle çözmesi.",
          "criteria": {
            "c1_event_name_year": "Kâbe Tamiri ve Kâbe Hakemliği Hadisesi (Miladi 605, 35 yaşında).",
            "c2_location": "Kâbe-i Muazzama avlusu.",
            "c3_historical_explanation": "Sel ve yangınla hasar gören Kâbe yeniden inşa edildi. Hacerü'l-Esved'i yerine yerleştirme şerefi için kabileler kılıç çekti. Kâbe kapısından ilk girenin hakem tayin edilmesine karar verildi; giren 'El-Emîn' Muhammed oldu.",
            "c4_development_results": "Hırkasını yere sererek taşı üzerine koydurdu, her kabile reisine hırkanın bir ucundan tutturup taşı birlikte yükselttiler. Kan dökülmesi önlendi.",
            "c5_values": "Barış, İstişare, Adalet, Kriz Çözme Kabiliyeti ve Tarafsızlık.",
            "c6_sources": "İbn Hişâm, I, 204-210. Taberî, Târîhu'l-Ümem ve'l-Mülûk."
          }
        },
        {
          "id": "siyer-610",
          "year": 610,
          "title": "Hira Mağarası ve İlk Vahiy: 'İkra!' (Oku!)",
          "location": "Nur Dağı, Hira Mağarası",
          "summary": "Kadir Gecesi'nde Cebrail Aleyhisselam'ın Alak Suresi'nin ilk beş ayetini indirmesi ve son peygamberlik görevinin resmen başlaması.",
          "criteria": {
            "c1_event_name_year": "İlk Vahyin İnişi ve Nübüvvetin Başlangıcı (Miladi 610, Ramazan ayı, 40 yaşında).",
            "c2_location": "Mekke'nin kuzeydoğusundaki Cebel-i Nûr (Nur Dağı), Hira Mağarası.",
            "c3_historical_explanation": "Mekke'deki ahlaki çöküntüden uzaklaşarak tefekküre çekildiği Hira'da Cebrail geldi ve 'Oku! Yaratan Rabbinin adıyla oku!' emrini tebliğ etti.",
            "c4_development_results": "İslam çağının kapısı aralandı. Hz. Hatice ve amcasının oğlu Varaka bin Nevfel hadiseyi doğruladı ve ilk Müslüman Hz. Hatice oldu.",
            "c5_values": "İlim, Tefekkür, Hakikati Arama, Vahye İtaat.",
            "c6_sources": "Buhârî, Bed'ü'l-Vahy, 1. Müslim, Îmân, 252."
          }
        },
        {
          "id": "siyer-615",
          "year": 615,
          "title": "Habeşistan'a Birinci Hicret ve Necaşî'nin Huzurunda Cafer'in Tebliği",
          "location": "Aksum Krallığı (Habeşistan)",
          "summary": "Müşriklerin dayanılmaz işkencelerine maruz kalan ilk Müslümanların adalet timsali Hristiyan Kral Necaşî Ashame'ye sığınması.",
          "criteria": {
            "c1_event_name_year": "Habeşistan'a Hicretler (Miladi 615).",
            "c2_location": "Kızıldeniz üzerinden Habeşistan (bugünkü Etiyopya).",
            "c3_historical_explanation": "Hz. Osman ve eşi Hz. Rukıyye'nin de aralarında bulunduğu kafile Habeşistan'a gitti. Cafer bin Ebî Tâlib Necaşî'nin sarayında Meryem Suresi'ni okudu.",
            "c4_development_results": "Necaşî Müslümanları müşriklere teslim etmedi; inanç özgürlüğünü korudu. İslamiyet ilk kez Arap Yarımadası dışına ulaştı.",
            "c5_values": "İnanç Hürriyeti, Hicret Fedakârlığı, Adaletli Yöneticiye Sığınma.",
            "c6_sources": "İbn Hişâm, I, 321-341. Ahmed b. Hanbel, Müsned, V, 290."
          }
        },
        {
          "id": "siyer-620",
          "year": 620,
          "title": "Hüzün Yılı (Âmü'l-Hüzn), Tâif Seferi ve İsrâ-Miraç Mucizesi",
          "location": "Mekke, Tâif & Mescid-i Aksâ - Semavat",
          "summary": "Hz. Hatice ve Ebû Tâlib'in peş peşe vefatı, Tâif'teki taşlanmaya karşı 'Rabbim onlar bilmiyorlar' duası ve Kudüs ile göklere yükseliş.",
          "criteria": {
            "c1_event_name_year": "Hüzün Yılı, Tâif Yolculuğu ve İsrâ-Mi'râc Mucizesi (Miladi 620).",
            "c2_location": "Mekke, Tâif vadisi, Mescid-i Aksâ (Kudüs) ve Sidretü'l-Müntehâ.",
            "c3_historical_explanation": "İki büyük hamisinin vefatı sonrası Tâif'e giden Efendimiz taşlandı. Ardından Mescid-i Haram'dan Aksa'ya gece yürüyüşü ve Miraç gerçekleşti.",
            "c4_development_results": "5 vakit namaz farz kılındı, Bakara Suresi'nin son ayetleri indirildi ve ümmetine şefaat müjdesi verildi.",
            "c5_values": "Affedicilik, Dua, Sabır, Yüce Makamlara Teslimiyet ve Namaz Şuuru.",
            "c6_sources": "İsra Suresi 17/1. Necm Suresi 53/1-18. Buhârî, Salât, 1."
          }
        },
        {
          "id": "siyer-622",
          "year": 622,
          "title": "Yesrib'e Büyük Hicret, Sevr Mağarası ve Mescid-i Nebevî",
          "location": "Mekke - Medine (Yesrib)",
          "summary": "Akabe biatlarının ardından Hz. Ebû Bekir ile Sevr Mağarası üzerinden Medine'ye hicret ve İslam Devleti'nin kuruluşu.",
          "criteria": {
            "c1_event_name_year": "Medine'ye Hicret ve Hicri Takvimin Başlangıcı (Miladi 622).",
            "c2_location": "Mekke, Sevr Mağarası, Kubâ Köyü ve Medine-i Münevvere.",
            "c3_historical_explanation": "Müşriklerin suikast planı üzerine Hz. Ali yatağına yattı, Efendimiz ve Hz. Ebû Bekir Sevr'e sığındı. Kuba'da ilk mescid yapıldı; Medine sevinçle karşıladı.",
            "c4_development_results": "Ensar ile Muhacir kardeş ilan edildi (Muâhât), Medine Sözleşmesi ile ilk anayasa yapıldı, Mescid-i Nebevî inşa edildi.",
            "c5_values": "Kardeşlik, Paylaşma, Birlik, Tevekkül ve Planlama.",
            "c6_sources": "Tevbe Suresi 9/40. Buhârî, Menâkıbü'l-Ensâr, 45."
          }
        },
        {
          "id": "siyer-624",
          "year": 624,
          "title": "Bedir Zaferi ve Ramazan Orucu Farzı",
          "location": "Bedir Kuyuları Civarı",
          "summary": "İslam ordusunun üç katı büyüklükteki Kureyş müşrik ordusuna karşı kazandığı ilk büyük zafer ve hakkın batıla galebesi.",
          "criteria": {
            "c1_event_name_year": "Bedir Gazvesi (Hicri 2 / Miladi Mart 624).",
            "c2_location": "Medine'nin 130 km güneybatısındaki Bedir mevkii.",
            "c3_historical_explanation": "313 kişilik mücahit ordusu, Ebû Cehil komutasındaki 1000 kişilik tam donanımlı Kureyş ordusunu Allah'ın meleklerle yardımı sayesinde mağlup etti.",
            "c4_development_results": "İslamiyet Arap Yarımadası'nda ciddiye alınan bir güç haline geldi. Esirler 10 Müslümana okuma-yazma öğretmeleri karşılığı serbest bırakıldı.",
            "c5_values": "İman, Dua, İstişare, Eğitime Verilen Kıymet, Esire Merhamet.",
            "c6_sources": "Âl-i İmrân Suresi 3/123-126. Enfâl Suresi 8/9-19. Müslim, Cihâd, 58."
          }
        },
        {
          "id": "siyer-628",
          "year": 628,
          "title": "Hudeybiye Barış Antlaşması ve Hükümdarlara İslâm'a Davet Mektupları",
          "location": "Hudeybiye & Medine",
          "summary": "Görünüşte aleyhte gibi duran ancak Kur'an'ın 'Feth-i Mübîn' (Açık bir fetih) dediği 10 yıllık barış antlaşması ve cihan hükümdarlarına mektuplar.",
          "criteria": {
            "c1_event_name_year": "Hudeybiye Barışı ve Bey'atü'r-Rıdvân (Hicri 6 / Miladi 628).",
            "c2_location": "Mekke yakınlarındaki Hudeybiye kuyusu.",
            "c3_historical_explanation": "Umre için yola çıkan Müslümanların yolu kesilince kan dökülmeden 10 yıllık barış yapıldı. Barış ortamında Bizans, Sasani, Mısır ve Habeş hükümdarlarına davet elçileri gönderildi.",
            "c4_development_results": "İslam barış ortamında hızla yayıldı; Halid bin Velid ve Amr bin Âs gibi askerî dehalar Müslüman oldu.",
            "c5_values": "Diplomasi, Barış, Ahde Sadakat, İleri Görüşlülük.",
            "c6_sources": "Fetih Suresi 48/1-18. Buhârî, Şurût, 15."
          }
        },
        {
          "id": "siyer-630",
          "year": 630,
          "title": "Mekke'nin Fethi ve Kâbe'nin Putlardan Temizlenmesi",
          "location": "Mekke-i Mükerreme",
          "summary": "Kureyş'in anlaşmayı bozması üzerine 10.000 kişilik orduyla kan dökülmeden gerçekleşen fetih ve 'Bugün size kınama yoktur, hepiniz serbestsiniz' genel affı.",
          "criteria": {
            "c1_event_name_year": "Mekke'nin Fethi (Hicri 8 / Miladi Ocak 630).",
            "c2_location": "Mekke-i Mükerreme ve Kâbe-i Muazzama.",
            "c3_historical_explanation": "Peygamber Efendimiz devesinin üzerinde şükürden başı eğik vaziyette Mekke'ye girdi. 360 put devrildi, genel af ilan edildi.",
            "c4_development_results": "Kâbe tevhide kavuştu, Mekke halkı kitleler halinde İslam'a girdi. İntikam yerine engin bir bağışlama örneği sergilendi.",
            "c5_values": "Af, Alçakgönüllülük (Tevazu), Hakkaniyet, Şefkat.",
            "c6_sources": "İsrâ Suresi 17/81. Nasr Suresi 110/1-3. Buhârî, Meğāzî, 48."
          }
        },
        {
          "id": "siyer-632",
          "year": 632,
          "title": "Veda Haccı, Veda Hutbesi ve Refîk-i A'lâ'ya Vuslat",
          "location": "Arafat Vadisi & Medine-i Münevvere",
          "summary": "120.000 sahabiye irad edilen evrensel insan hakları beyannamesi mahiyetindeki Veda Hutbesi ve 13 Rebiülevvel (8 Haziran 632) tarihinde vefatı.",
          "criteria": {
            "c1_event_name_year": "Veda Haccı, Veda Hutbesi ve İrtihâl (Hicri 10-11 / Miladi 632).",
            "c2_location": "Arafat, Müzdelife, Mina ve Medine-i Münevvere (Hücre-i Saâdet).",
            "c3_historical_explanation": "Efendimiz Arafat'ta 'Ey insanlar! Kanlarınız, mallarınız, canlarınız mukaddestir. Arap'ın Arap olmayana üstünlüğü yoktur; üstünlük ancak takva iledir' buyurdu. Medine'de Hz. Âişe'nin odasında vefat etti.",
            "c4_development_results": "Din kemale erdi (Maide Suresi 3. ayet). Hz. Ebû Bekir 'Kim Muhammed'e tapıyorsa bilsin ki o vefat etmiştir; kim Allah'a ibadet ediyorsa bilsin ki O diridir' diyerek ümmeti teskin etti.",
            "c5_values": "Evrensel İnsan Hakları, Eşitlik, Kadın Hakları, Emanet Bilinci, Vefa.",
            "c6_sources": "Müslim, Hac, 147. Ebû Dâvûd, Menâsik, 56. Tirmizî, Tefsîr, 9."
          }
        }
      ]
    }
  }
};
