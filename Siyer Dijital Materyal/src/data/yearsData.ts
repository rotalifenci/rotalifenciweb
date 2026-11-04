import { YearData } from '../types';

export const INITIAL_YEARS_DATA: YearData[] = [
  // 571 - Fil Yılı ve Doğum
  {
    year: 571,
    title: 'Fil Yılı ve Peygamberimizin Doğumu',
    subTitle: 'Karanlık Çağda Doğan Bir Nur',
    location: 'Mekke-i Mükerreme',
    sceneEnvironment: 'mecca',
    historicalSummary: '571 yılında Mekke\'de, Kâbe\'yi yıkmak isteyen Ebrehe ordusu hezimete uğramış (Fil Vak\'ası), aynı yılın Rebîülevvel ayında Hz. Muhammed (s.a.v.) dünyayı teşrif etmiştir. Babası Abdullah doğumundan önce vefat etmiş, dedesi Abdülmuttalib torununa "övgüye layık" anlamına gelen "Muhammed" adını vermiştir.',
    historicalSource: {
      sourceName: 'Sîret-i İbn Hişâm & TDV İslam Ansiklopedisi',
      authorOrRef: 'İbn Hişâm, Cilt 1, s. 158-166; TDV İA "Muhammed" maddesi',
      certaintyLevel: 'Sahih / Kuvvetli',
      notes: 'Doğum yılı miladi 571 (veya bazı rivayetlerde 570) olarak kabul edilir. Rebîülevvel ayının 12. gecesi meşhur kabuldür.'
    },
    missions: [
      {
        id: 'm_571_1',
        title: 'Fil Hadisesi ve Kâbe\'nin Korunması',
        brief: 'Mekke girişindeki vadide toplanan insanların yanına git ve Kâbe\'nin nasıl korunduğunu öğren.',
        targetPosition: [0, 0, -18],
        targetLabel: 'Mekke Vadisi & Kâbe Çevresi',
        narrativeText: 'Yemen Valisi Ebrehe, fillerle donatılmış ordusuyla Kâbe\'yi yıkmak için Mekke\'ye yürüdü. Mekkelilerin bu orduya karşı koyacak gücü yoktu. Dedesi Abdülmuttalib, "Ben develerin sahibiyim, bu Ev\'in de elbette bir koruyucusu vardır" diyerek halkıyla dağlara çekildi. Cenab-ı Hak, Ebâbîl kuşlarıyla Ebrehe ordusunu helak etti ve Beytullah\'ı korudu.',
        subtitles: [
          { time: 0, text: '571 yılı... Mekke büyük bir tehdit altındaydı.' },
          { time: 4, text: 'Ebrehe Kâbe\'yi yıkmak istedi, ancak Ebâbîl kuşları orduyu durdurdu.' },
          { time: 8, text: 'Bu kutlu yılda, insanlığa rahmet olarak Hz. Muhammed (s.a.v.) dünyaya geldi.' }
        ],
        question: 'Kâbe\'yi yıkmak amacıyla Mekke üzerine yürüyen Yemen valisinin adı nedir?',
        correctAnswer: 'Ebrehe',
        alternativeAnswers: ['ebrehe', 'ebrehe ordusu', 'vali ebrehe', 'ebrehe el-eşrem'],
        hint1: 'Yemen hükümdarı adına hareket eden ve ordusunda filler bulunan komutandır.',
        hint2: 'İsmi "E" harfiyle başlar, Kur\'an-ı Kerim\'de Fil Sûresi\'nde ordusunun başına gelenler anlatılır.',
        thirdLevelExplanation: 'Doğru cevap "Ebrehe"dir. Yemen valisi Ebrehe, San\'a\'da yaptırdığı kiliseye Arapların rağbet etmemesi üzerine Kâbe\'yi yıkmak için filleriyle hücuma geçmiş ancak ilahî kudret tarafından helak edilmiştir.',
        reinforcement: {
          instruction: 'Tarihsel bilgiyi pekiştirmek için aşağıdaki soruyu cevaplayınız:',
          question: 'Kâbe\'yi korumak için gönderilen ve taşlar yağdıran kuşların adı nedir?',
          options: ['Ebâbîl Kuşları', 'Hüdhüd Kuşları', 'Turnalar', 'Kırlangıçlar'],
          correctIndex: 0,
          reinforcementNote: 'Kur\'an-ı Kerim\'de Fil Sûresi\'nde Ebâbîl kuşlarının orduyu "yenilmiş ekin yaprağına" çevirdiği bildirilmektedir.'
        },
        valueDiscovery: {
          valueId: 'adalet',
          recognitionQuestion: 'Ebrehe\'nin haksızca Kâbe\'yi yıkmaya kalkışması ve mazlum Mekke halkına saldırması hangi kök değerin çiğnenmesidir?',
          recognitionOptions: ['Adalet', 'Öz Denetim', 'Tasarruf', 'Çalışkanlık'],
          correctRecognitionIndex: 0,
          explanationPrompt: 'Sence haksızlığa uğrayan birini gördüğümüzde adaletli bir insan nasıl davranmalıdır?',
          explanationGuide: 'Adalet; gücün değil, hakkın üstün tutulmasıdır. Mazluma yardım etmek adaletin gereğidir.',
          scenarioTitle: 'Okul Bahçesinde Hakkaniyet',
          scenarioQuestion: 'Okul bahçesinde sıraya girmişken, senden daha büyük bir öğrenci senin ve arkadaşlarının önüne geçmek istedi. Ne yaparsın?',
          scenarioOptions: [
            {
              id: 'opt_1',
              text: 'Korkup sessizce geri çekilirim, sıramı ona veririm.',
              isAppropriate: false,
              feedback: 'Haksızlığa sessiz kalmak, haksızlığı yapan kişiyi cesaretlendirir.'
            },
            {
              id: 'opt_2',
              text: 'Nezaketle herkesin sıraya saygı göstermesi gerektiğini hatırlatır, gerekirse nöbetçi öğretmenden adil bir çözüm isterim.',
              isAppropriate: true,
              feedback: 'Tebrikler! Hem saygılı hem de adaletli bir tavır sergiledin. Hak ararken nezaketi elden bırakmamak erdemdir.'
            },
            {
              id: 'opt_3',
              text: 'Ona bağırıp kavga başlatırım.',
              isAppropriate: false,
              feedback: 'Kavga etmek adalet getirmez, yeni haksızlıklara yol açar.'
            }
          ]
        }
      }
    ]
  },

  // 572 - Sütanneye Veriliş
  {
    year: 572,
    title: 'Sütanne Halime ve Çöl Hayatı',
    subTitle: 'Temiz Çöl Havası ve Fasih Arapça',
    location: 'Beni Sa\'d Yurdu',
    sceneEnvironment: 'mecca',
    historicalSummary: 'Mekke\'nin boğucu havasından uzaklaşması ve fasih (düzgün) Arapça öğrenmesi amacıyla Arap geleneğine uygun olarak sütanne arandı. Beni Sa\'d kabilesinden Halime bint Ebî Züeyb, yetim bebeği şefkatle bağrına bastı. Halime\'nin hanesine bereket yağdı.',
    historicalSource: {
      sourceName: 'İbn Sa\'d, et-Tabakâtü\'l-Kübrâ',
      authorOrRef: 'İbn Sa\'d, Cilt 1, s. 110-115',
      certaintyLevel: 'Sahih / Kuvvetli'
    },
    missions: [
      {
        id: 'm_572_1',
        title: 'Beni Sa\'d Obasında Bereket',
        brief: 'Beni Sa\'d çadırlarının yanına git ve sütanne Halime\'nin ailesiyle tanış.',
        targetPosition: [15, 0, -10],
        targetLabel: 'Beni Sa\'d Çadırları',
        narrativeText: 'Mekke\'nin zengin aileleri çocuklarını emzirmesi için zengin sütanneleri seçerken, Halime kimsenin almak istemediği babasız yetim çocuğu kalbinde büyük bir sevgi duyarak kabul etti. O andan itibaren sütannesi ve ailesinin develeri bol süt verdi, kurak toprakları yeşerdi.',
        subtitles: [
          { time: 0, text: 'Halime, yetim bebeğe kalbini ve yuvasını açtı.' },
          { time: 4, text: 'Beni Sa\'d kabilesinin temiz çöl havasında 4 yıl geçirdi.' }
        ],
        question: 'Peygamberimize sütannelik yapan ve onu Beni Sa\'d yurduna götüren hanımefendinin adı nedir?',
        correctAnswer: 'Halime',
        alternativeAnswers: ['halime', 'hz halime', 'halime binti ebi zueyb', 'sütanne halime'],
        hint1: 'İsmi Türkçede "yumuşak huylu, şefkatli" anlamına gelir.',
        hint2: '"H" harfiyle başlar, Beni Sa\'d kabilesindendir.',
        thirdLevelExplanation: 'Doğru cevap "Halime"dir (Hz. Halime). Beni Sa\'d yurdunda Hz. Peygamber hem sağlıklı bir bedene kavuşmuş hem de pürüzsüz fasih Arapça öğrenmiştir.',
        reinforcement: {
          instruction: 'Tarihsel bilgiyi pekiştiriniz:',
          question: 'Mekkeliler çocuklarını çöl kabilelerine neden sütanneye gönderirlerdi?',
          options: ['Temiz hava alıp fasih Arapça öğrenmeleri için', 'Ticaret yapmaları için', 'Şehirden kaçmak için', 'Askerlik eğitimi için'],
          correctIndex: 0,
          reinforcementNote: 'Çölün temiz havası çocukların sağlığını güçlendirir, kabilelerin duru dili ise kusursuz konuşma kabiliyeti kazandırırdı.'
        },
        valueDiscovery: {
          valueId: 'sevgi',
          recognitionQuestion: 'Halime\'nin hiçbir maddi karşılık beklemeden yetim bir yavruya kucağını açması hangi kök değerin en güzel örneğidir?',
          recognitionOptions: ['Sevgi', 'Vatanseverlik', 'Tasarruf', 'Liderlik'],
          correctRecognitionIndex: 0,
          explanationPrompt: 'Karşılık beklemeden birine şefkat göstermek hayatımızda neleri değiştirir?',
          explanationGuide: 'Sevgi ve şefkat, insanları birbirine bağlayan ve hayatı bereketlendiren en yüce duygudur.',
          scenarioTitle: 'Yalnız Kalan Küçük Kardeş',
          scenarioQuestion: 'Parkta küçük bir çocuğun annesini kaybedip ağladığını gördün. Ne yaparsın?',
          scenarioOptions: [
            {
              id: 's_1',
              text: 'Umursamayıp oyun oynamaya devam ederim.',
              isAppropriate: false,
              feedback: 'Zor durumdaki bir çocuğa kayıtsız kalmak sevgi ve merhamet değerine uymaz.'
            },
            {
              id: 's_2',
              text: 'Yanına gidip onu teselli eder, hemen güvenilir bir görevliye veya aile büyüklerime haber vererek annesini bulmasına yardımcı olurum.',
              isAppropriate: true,
              feedback: 'Harikasın! Şefkat ve merhamet dolu, örnek bir davranış sergiledin.'
            }
          ]
        }
      }
    ]
  },

  // 573 - 576: Çocukluk Yılları
  {
    year: 573,
    title: 'Çöl Hayatında Çocukluk',
    subTitle: 'Sağlıklı Gelişim ve Doğayla İç İçe Yaşam',
    location: 'Beni Sa\'d Vadisi',
    sceneEnvironment: 'mecca',
    historicalSummary: 'Hz. Muhammed (s.a.v.) iki yaşına kadar sütannesi Halime\'nin yanında kaldı. Sütkardeşleri Şeyma, Abdullah ve Üneys ile birlikte büyüdü.',
    historicalSource: {
      sourceName: 'İbn İshâk, es-Siyer',
      authorOrRef: 'İbn İshâk, s. 28-32',
      certaintyLevel: 'Sahih / Kuvvetli'
    },
    missions: [
      {
        id: 'm_573_1',
        title: 'Süt Kardeşlerle Paylaşım',
        brief: 'Ovadaki kuzu sürülerinin yanındaki izleri takip et.',
        targetPosition: [18, 0, -25],
        targetLabel: 'Kuzu Otlatma Alanı',
        narrativeText: 'Küçük Muhammed, sütkardeşleriyle birlikte doğayı ve hayvanları severek büyüdü. Halime, sütten kesildikten sonra bile onun bereketinden ayrılmak istemediği için iki yıl daha yanında kalması için annesi Âmine\'den rica etti.',
        subtitles: [
          { time: 0, text: 'Beni Sa\'d obasında kardeşlik ve sevgi bağı kuruldu.' }
        ],
        question: 'Peygamberimizin Beni Sa\'d yurdunda birlikte büyüdüğü ve ona ablalık yapan sütkardeşinin adı nedir?',
        correctAnswer: 'Şeyma',
        alternativeAnswers: ['şeyma', 'seyma', 'hz seyma', 'es-şeyma'],
        hint1: 'Yıllar sonra Huneyn Gazvesi sonrasında esirler arasında Peygamberimizle karşılaşmış ve büyük hürmet görmüştür.',
        hint2: '"Ş" harfiyle başlar, kız kardeşidir.',
        thirdLevelExplanation: 'Doğru cevap "Şeyma"dır (eş-Şeymâ). Peygamberimiz yıllar sonra onu görünce hırkasını yere sermiş ve büyük bir hürmetle ağırlamıştır.',
        reinforcement: {
          instruction: 'Kardeşlik ve vefa bilginizi pekiştiriniz:',
          question: 'Peygamberimizin sütkardeşlerine gösterdiği hürmet hangi ahlaki ilkeyi gösterir?',
          options: ['Vefa ve Kardeşlik Sevgisi', 'Kibir', 'Öfke', 'Kıskançlık'],
          correctIndex: 0,
          reinforcementNote: 'Vefa, geçmişte yapılan iyilikleri asla unutmama erdemidir.'
        }
      }
    ]
  },

  {
    year: 574,
    title: 'Çöl İklimi ve Doğal Yaşam',
    subTitle: 'Kır Hayatında Büyüyen Masumiyet',
    location: 'Beni Sa\'d Vadisi',
    sceneEnvironment: 'mecca',
    historicalSummary: 'Peygamberimiz kır hayatında hayvan sevgisi, doğanın dili ve sabırlı olmayı bizzat yaşayarak tecrübe etti.',
    historicalSource: {
      sourceName: 'TDV İslam Ansiklopedisi',
      authorOrRef: 'Cilt 30, "Muhammed" maddesi',
      certaintyLevel: 'Tarihsel Rivayet / Temsili'
    },
    missions: [
      {
        id: 'm_574_1',
        title: 'Kır Hayatında Sabır ve Gözlem',
        brief: 'Su kuyusunun yanındaki yaşlı kervancı ile konuş.',
        targetPosition: [-12, 0, -14],
        targetLabel: 'Bedevi Su Kuyusu',
        narrativeText: 'Çöl ikliminde su çok kıymetliydi. İnsanlar sabrı, suyu tasarrufla kullanmayı ve birbirlerinin hakkına saygı göstermeyi kuyubaşında öğrenirdi.',
        subtitles: [{ time: 0, text: 'Çölde su hayattır; paylaşmak ise erdemdir.' }],
        question: 'Kurak çöl ortamında insanların bir arada barış içinde yaşamasını sağlayan en önemli ahlaki tutum nedir?',
        correctAnswer: 'Sabır ve paylaşma',
        alternativeAnswers: ['sabır', 'paylaşma', 'yardımlaşma', 'sabir', 'tasarruf'],
        hint1: 'Zorluklara tahammül etmek ve elindekini bölüşmektir.',
        hint2: 'Kök değerlerimizden biri sabırdır.',
        thirdLevelExplanation: 'Çöl şartlarında sabır ve yardımlaşma hayatta kalmanın ve toplumsal barışın temelidir.',
        reinforcement: {
          instruction: 'Doğal kaynakların korunması:',
          question: 'Kısıtlı su kaynaklarını kullanırken hangi değere dikkat etmeliyiz?',
          options: ['Öz denetim ve Tasarruf', 'İsraf', 'Acelecilik', 'Dikkatsizlik'],
          correctIndex: 0,
          reinforcementNote: 'Peygamberimiz akan bir nehir kenarında bile abdest alırken israf edilmemesini emretmiştir.'
        }
      }
    ]
  },

  {
    year: 575,
    title: 'Mekke\'ye Dönüş ve Anne Şefkati',
    subTitle: 'Hz. Âmine\'nin Kucağında',
    location: 'Mekke-i Mükerreme',
    sceneEnvironment: 'mecca',
    historicalSummary: 'Dört yaşına gelen Hz. Muhammed (s.a.v.), sütannesi Halime tarafından Mekke\'ye getirilerek öz annesi Hz. Âmine\'ye teslim edildi. Anne ve oğul sevgiyle kavuştu.',
    historicalSource: {
      sourceName: 'İbn Hişâm',
      authorOrRef: 'es-Sîre, Cilt 1, s. 168',
      certaintyLevel: 'Sahih / Kuvvetli'
    },
    missions: [
      {
        id: 'm_575_1',
        title: 'Mekke\'deki Evin Sevinci',
        brief: 'Mekke sokaklarındaki taş kemerli evin avlusuna ilerle.',
        targetPosition: [5, 0, -8],
        targetLabel: 'Hz. Âmine\'nin Evi',
        narrativeText: 'Hz. Âmine, sevgili oğlunu hasretle kucakladı. Yetim yavrusunun gözlerindeki derin edep ve nur, bütün ailenin kalbini aydınlatıyordu. Dede Abdülmuttalib torununun dönüşüyle büyük sevinç yaşadı.',
        subtitles: [{ time: 0, text: 'Anne kucağı, yeryüzünün en huzurlu limanıdır.' }],
        question: 'Peygamberimizin mübarek annesinin adı nedir?',
        correctAnswer: 'Amine',
        alternativeAnswers: ['amine', 'hz amine', 'âmine', 'hazreti amine'],
        hint1: 'Kureyş\'in Zühreoğulları kolundandır.',
        hint2: '"A" harfiyle başlar, güven veren, emin anlamına gelir.',
        thirdLevelExplanation: 'Doğru cevap "Hz. Âmine"dir. Vehb b. Abdümenâf\'ın kızı olan Hz. Âmine, nezaketi ve iffetiyle tanınırdı.',
        reinforcement: {
          instruction: 'Anne sevgisi ve hürmet:',
          question: 'İslam ahlakında anneye gösterilmesi gereken temel tutum nedir?',
          options: ['Hürmet, şefkat ve itaat', 'Mesafe', 'İlgisizlik', 'Öfke'],
          correctIndex: 0,
          reinforcementNote: 'Peygamberimiz "Cennet annelerin ayakları altındadır" buyurmuştur.'
        },
        valueDiscovery: {
          valueId: 'sevgi',
          recognitionQuestion: 'Evlat ile anne arasındaki bu eşsiz bağ hangi kök değerin temelidir?',
          recognitionOptions: ['Sevgi', 'Cesaret', 'Disiplin', 'Güç'],
          correctRecognitionIndex: 0,
          explanationPrompt: 'Annemize ve ailemize olan sevgimizi günlük hayatta nasıl hissettirebiliriz?',
          explanationGuide: 'Güler yüz, tatlı bir söz ve ev işlerinde yardımcı olmak sevgimizi göstermenin en samimi yoludur.',
          scenarioTitle: 'Yorgun Bir Gün',
          scenarioQuestion: 'Akşam okuldan geldiğinde annenin çok yorgun olduğunu ve yemek hazırlamaya çalıştığını gördün. Ne yaparsın?',
          scenarioOptions: [
            {
              id: 'c_1',
              text: 'Hemen odama geçer, bilgisayar oyunu oynarım.',
              isAppropriate: false,
              feedback: 'Ailemizin yükünü hafifletmek yerine duyarsız kalmak sevgiye yakışmaz.'
            },
            {
              id: 'c_2',
              text: 'Yanına gidip sofrayı kurmaya yardım eder, ona güler yüzle teşekkür ederim.',
              isAppropriate: true,
              feedback: 'Mükemmel! Aile sevgisi ve sorumluluk bilincini çok güzel ortaya koydun.'
            }
          ]
        }
      }
    ]
  },

  {
    year: 576,
    title: 'Yesrib Yolculuğu',
    subTitle: 'Akraba Ziyareti ve Vefa',
    location: 'Yesrib (Medine) Yolu',
    sceneEnvironment: 'mecca',
    historicalSummary: 'Hz. Âmine, altı yaşındaki oğlu Muhammed\'i ve sadık hizmetçileri Ümmü Eymen\'i yanına alarak eşi Abdullah\'ın kabrini ve Neccâroğulları akrabalarını ziyaret etmek için Medine\'ye gitti.',
    historicalSource: {
      sourceName: 'Taberî, Târîhu\'l-Ümem ve\'l-Mülûk',
      authorOrRef: 'Taberî, Cilt 2, s. 124',
      certaintyLevel: 'Sahih / Kuvvetli'
    },
    missions: [
      {
        id: 'm_576_1',
        title: 'Medine Hurmalıkları ve Akraba Bağı',
        brief: 'Kervan mola yerindeki dinlenme çadırına git.',
        targetPosition: [-8, 0, -22],
        targetLabel: 'Kervan Mola Yeri',
        narrativeText: 'Yaklaşık bir ay boyunca Yesrib\'de kaldılar. Küçük Muhammed burada dayıları Neccâroğullarının çocuklarıyla yüzme öğrendi, bahçelerinde koştu ve babasının kabrini ziyaret edip dua etti.',
        subtitles: [{ time: 0, text: 'Akrabaları ziyaret etmek ve geçmişe vefa göstermek soylu bir adettir.' }],
        question: 'Peygamberimiz ve annesine bu kutlu yolculukta eşlik eden fedakâr hanım hizmetçinin adı nedir?',
        correctAnswer: 'Ümmü Eymen',
        alternativeAnswers: ['ümmu eymen', 'ummu eymen', 'ummu ayman', 'bereke'],
        hint1: 'Asıl adı Bereke olan bu hanıma Peygamberimiz daha sonra "Annemden sonraki annem" demiştir.',
        hint2: '"Ü" harfiyle başlar.',
        thirdLevelExplanation: 'Doğru cevap "Ümmü Eymen"dir (Bereke). Peygamberimize küçüklüğünden itibaren büyük bir şefkat ve sadakatle hizmet etmiştir.',
        reinforcement: {
          instruction: 'Akraba ziyareti (Sıla-i rahim):',
          question: 'Akrabaları ziyaret etmeye ve onlarla bağı korumaya İslam\'da ne ad verilir?',
          options: ['Sıla-i Rahim', 'Ticaret', 'Seyahat', 'Gözlem'],
          correctIndex: 0,
          reinforcementNote: 'Sıla-i rahim, aile ve akrabalık bağlarını sevgi ve saygıyla canlı tutmaktır.'
        }
      }
    ]
  },

  // 577 - Ebva ve Hz. Âmine'nin Vefatı
  {
    year: 577,
    title: 'Ebvâ ve Anneye Veda',
    subTitle: 'Yetim Kalbin Hüznü ve Tevekkül',
    location: 'Ebvâ Köyü',
    sceneEnvironment: 'mecca',
    historicalSummary: 'Yesrib dönüşünde Hz. Âmine Ebvâ köyünde hastalandı ve vefat etti. Altı yaşındaki Hz. Muhammed (s.a.v.) hem öksüz hem yetim kaldı. Ümmü Eymen onu şefkatle Mekke\'ye, dedesi Abdülmuttalib\'e getirdi.',
    historicalSource: {
      sourceName: 'İbn Hişâm',
      authorOrRef: 'es-Sîre, Cilt 1, s. 169',
      certaintyLevel: 'Mütevatir / Kesin'
    },
    missions: [
      {
        id: 'm_577_1',
        title: 'Ebvâ Hüznü ve Dede Kucağı',
        brief: 'Mekke girişindeki Abdülmuttalib meclisine doğru yürü.',
        targetPosition: [0, 0, -12],
        targetLabel: 'Dede Abdülmuttalib Meclisi',
        narrativeText: 'Abdülmuttalib, torununun başını okşadı ve onu bağrına bastı. Kâbe\'nin gölgesindeki özel minderine sadece bu kutlu yetimi oturturdu. İnsanlar onu kaldırmak istediğinde dedesi "Bırakın yavrumu, onun gelecekte büyük bir şanı olacaktır" derdi.',
        subtitles: [
          { time: 0, text: 'Annesini Ebvâ\'da kaybeden yetim çocuk, dedesinin kanatları altına girdi.' }
        ],
        question: 'Hz. Âmine\'nin vefat ettiği ve kabrinin bulunduğu Mekke ile Medine arasındaki yerin adı nedir?',
        correctAnswer: 'Ebva',
        alternativeAnswers: ['ebva', 'ebvâ', 'ebva koyu', 'ebva mevkii'],
        hint1: 'Kızıldeniz sahiline yakın bir vadide bulunan meşhur bir duraktır.',
        hint2: '"E" harfiyle başlar, dört harflidir.',
        thirdLevelExplanation: 'Doğru cevap "Ebvâ"dır. Hz. Âmine burada vefat etmiş, yıllar sonra Mekke\'nin fethinde Peygamberimiz annesinin kabrini ziyaret edip gözyaşı dökmüştür.',
        reinforcement: {
          instruction: 'Sabır ve merhamet:',
          question: 'Yetim ve öksüz çocuklara karşı toplumun sergilemesi gereken tavır nedir?',
          options: ['Şefkat, himaye ve koruma', 'Dışlama', 'Ayrımcılık', 'İlgisizlik'],
          correctIndex: 0,
          reinforcementNote: 'Kur\'an-ı Kerim Duha Sûresi\'nde "Öyleyse yetimi sakın ezme!" buyurmaktadır.'
        },
        valueDiscovery: {
          valueId: 'sabir',
          recognitionQuestion: 'Küçük yaşta anne ve babasını kaybeden bir çocuğun metanet göstermesi hangi kök değeri yansıtır?',
          recognitionOptions: ['Sabır', 'Mizah', 'Gurur', 'Hırs'],
          correctRecognitionIndex: 0,
          explanationPrompt: 'Hayatta karşılaştığımız üzücü ve zor durumlarda sabırlı olmak bize ne kazandırır?',
          explanationGuide: 'Sabır güçsüzlük değil; zorluklar karşısında dimdik ayakta kalma ve Allah\'a güvenme iradesidir.',
          scenarioTitle: 'Sıkıntılı Bir An',
          scenarioQuestion: 'Çok hazırlandığın bir projede istemeden bir hata yaptın ve projen bozuldu. Ne hissedip yaparsın?',
          scenarioOptions: [
            {
              id: 'p_1',
              text: 'Öfkelenip malzemeleri fırlatır, vazgeçerim.',
              isAppropriate: false,
              feedback: 'Öfke sorunları çözmez, sabırsızlık hata yapma ihtimalini artırır.'
            },
            {
              id: 'p_2',
              text: 'Derin bir nefes alıp sakinleşir, hatamdan ders çıkararak projemi yeniden ve daha dikkatli yapmaya koyulurum.',
              isAppropriate: true,
              feedback: 'Harika bir sabır ve irade örneği! Başarıya sabırla ulaşılır.'
            }
          ]
        }
      }
    ]
  },

  // 578 - 579: Abdülmuttalib'in Vefatı ve Ebu Talib'in Himayesi
  {
    year: 578,
    title: 'Dede Abdülmuttalib\'in Yanında',
    subTitle: 'Kâbe\'nin Gölgesinde Bir Çocuk',
    location: 'Kâbe Avlusu',
    sceneEnvironment: 'mecca',
    historicalSummary: 'Abdülmuttalib torununu gözünden sakınır, nereye gitse yanından ayırmazdı. Ona duyduğu sevgi Mekke halkının dikkatini çekerdi.',
    historicalSource: {
      sourceName: 'İbn Sa\'d',
      authorOrRef: 'et-Tabakât, Cilt 1, s. 118',
      certaintyLevel: 'Sahih / Kuvvetli'
    },
    missions: [
      {
        id: 'm_578_1',
        title: 'Minderdeki Yer',
        brief: 'Kâbe duvarının dibindeki taş kemerli gölgeliğe ulaş.',
        targetPosition: [2, 0, -6],
        targetLabel: 'Kâbe Gölgeliği',
        narrativeText: 'Kâbe yanında Kureyş reisleri otururken, sekiz yaşındaki Muhammed meclise geldiğinde dedesi onu yanına çağırır ve özel yerine oturturdu.',
        subtitles: [{ time: 0, text: 'Büyüklere saygı, küçüklere derin bir sevgi...' }],
        question: 'Peygamberimizin dedesi Abdülmuttalib Kureyş kabilesinin hangi önemli görevini üstlenmişti?',
        correctAnswer: 'Hacılara su ve yiyecek temini (Sikaye ve Rifade)',
        alternativeAnswers: ['sikaye', 'rifade', 'sikaye ve rifade', 'su dagitimi', 'hacilara su vermek', 'kabe bakımı'],
        hint1: 'Zemzem kuyusunu yeniden açan ve hacılara ikram eden kimsedir.',
        hint2: 'Su ve ziyafetle ilgilidir.',
        thirdLevelExplanation: 'Abdülmuttalib, Kureyş\'in reisi olarak hacılara su sağlama (sikāye) ve yemek yedirme (rifāde) görevlerini şerefle yürütmüştür.',
        reinforcement: {
          instruction: 'Tarihsel görevler:',
          question: 'Kâbe hacılarına karşılıksız ikramda bulunmak hangi kök değerle ilgilidir?',
          options: ['Yardımseverlik ve Misafirperverlik', 'Kibir', 'Ticaret', 'Savaşçılık'],
          correctIndex: 0,
          reinforcementNote: 'Hacılara hizmet etmek o dönemde en büyük cömertlik sayılırdı.'
        }
      }
    ]
  },

  {
    year: 579,
    title: 'Dedeye Veda ve Ebu Talib\'in Himayesi',
    subTitle: 'Şefkatli Bir Amca ve Geniş Bir Aile',
    location: 'Mekke-i Mükerreme',
    sceneEnvironment: 'mecca',
    historicalSummary: 'Abdülmuttalib seksen yaşını aşmışken vefat etti. Vefatından önce sevgili torununu, öz kardeşi olan amcası Ebu Talib\'e emanet etti. Ebu Talib ve eşi Fatıma bint Esed, Muhammed\'i kendi öz çocuklarından üstün tuttular.',
    historicalSource: {
      sourceName: 'İbn Hişâm',
      authorOrRef: 'es-Sîre, Cilt 1, s. 179',
      certaintyLevel: 'Mütevatir / Kesin'
    },
    missions: [
      {
        id: 'm_579_1',
        title: 'Ebu Talib\'in Evinde Sevgi',
        brief: 'Ebu Talib\'in taş evine yönel.',
        targetPosition: [12, 0, -4],
        targetLabel: 'Ebu Talib\'in Evi',
        narrativeText: 'Ebu Talib kalabalık bir aileye sahipti fakat zengin değildi. Küçük Muhammed sofraya oturunca herkes doyar, bereket artardı. Yengesi Fatıma bint Esed onu önce doyurur, saçlarını tarar ve evladı gibi severdi.',
        subtitles: [{ time: 0, text: 'Emanete sadakat gösteren fedakâr bir amca...' }],
        question: 'Dedesinin vefatından sonra Peygamberimizi himayesine alan amcasının adı nedir?',
        correctAnswer: 'Ebu Talib',
        alternativeAnswers: ['ebu talib', 'ebu talip', 'amcası ebu talib', 'hz ebu talib'],
        hint1: 'Hz. Ali\'nin babasıdır.',
        hint2: '"E" harfiyle başlar, Peygamberimizi peygamberliğinden sonra da Kureyş\'e karşı savunmuştur.',
        thirdLevelExplanation: 'Doğru cevap "Ebu Talib"dir. Ebu Talib, yeğenini kırk yılı aşkın süre korumuş, ona babalık yapmıştır.',
        reinforcement: {
          instruction: 'Emanete sahip çıkma:',
          question: 'Yetim bir akrabayı koruyup gözetmek hangi ahlaki görevin örneğidir?',
          options: ['Sorumluluk ve Merhamet', 'Çıkarcılık', 'Bencillik', 'Korku'],
          correctIndex: 0,
          reinforcementNote: 'Emanete sahip çıkmak hem dinî hem ahlaki bir sorumluluktur.'
        },
        valueDiscovery: {
          valueId: 'sorumluluk',
          recognitionQuestion: 'Ebu Talib\'in maddi durumu elverişli olmadığı halde yetim yeğenini bağrına basması hangi kök değerdir?',
          recognitionOptions: ['Sorumluluk', 'Eğlence', 'Şöhret', 'Maddi Kazanç'],
          correctRecognitionIndex: 0,
          explanationPrompt: 'Verdiğimiz sözleri ve üzerimize düşen görevleri yerine getirmek neden önemlidir?',
          explanationGuide: 'Sorumluluk sahibi insanlar toplumda güven inşa eder ve sevilirler.',
          scenarioTitle: 'Grup Ödevinde Görev Dağılımı',
          scenarioQuestion: 'Fen dersinde 4 kişilik bir grup projeniz var ve sana deney malzemelerini temin etme görevi verildi. Ne yaparsın?',
          scenarioOptions: [
            {
              id: 'g_1',
              text: 'Unutursam bir şey olmaz, arkadaşlarım nasılsa halleder derim.',
              isAppropriate: false,
              feedback: 'Sorumluluğu başkasına yıkmak dürüstlük ve sorumluluğa uymaz.'
            },
            {
              id: 'g_2',
              text: 'Gereken malzemeleri erkenden hazırlar, zamanında getirerek projeye katkı sunarım.',
              isAppropriate: true,
              feedback: 'Tebrikler! Güvenilir ve sorumluluk sahibi bir öğrenci örneği sergiledin.'
            }
          ]
        }
      }
    ]
  },

  // 582 - Şam Ticaret Kervanı ve Bahira
  {
    year: 582,
    title: 'Şam Ticaret Kervanı ve Bahîrâ',
    subTitle: 'Kervan Yollarında Bir Çocuk',
    location: 'Busra (Şam Yolu)',
    sceneEnvironment: 'mecca',
    historicalSummary: 'On iki yaşındayken amcası Ebu Talib ile birlikte Şam\'a giden ticaret kervanına katıldı. Busra kasabasında rahip Bahîrâ, kervanın üzerinde bir bulutun gölge ettiğini ve ağaçların secde edercesine eğildiğini fark etti. Ebu Talib\'e bu çocuğun geleceğin peygamberi olduğunu söyleyip onu korumasını tavsiye etti.',
    historicalSource: {
      sourceName: 'Tirmizî, Menâkıb & İbn Hişâm',
      authorOrRef: 'Tirmizî, Cilt 5, s. 590, Hadis no: 3620; İbn Hişâm, Cilt 1, s. 180-183',
      certaintyLevel: 'Sahih / Kuvvetli'
    },
    missions: [
      {
        id: 'm_582_1',
        title: 'Busra Manastırı ve Kervan Sofrası',
        brief: 'Busra mola yerindeki hurma ağaçlarının yanına git.',
        targetPosition: [-16, 0, -30],
        targetLabel: 'Busra Kervan Mola Yeri',
        narrativeText: 'Rahip Bahîrâ eski kutsal kitaplardaki işaretleri inceliyordu. Kervan yaklaşırken gökteki tek bir bulutun sadece bu çocuğu takip ettiğini gördü. Kervandakileri yemeğe davet etti ve Muhammed\'in sırtındaki peygamberlik mührünü inceledi.',
        subtitles: [
          { time: 0, text: 'Ticaret kervanı Şam yolunda ilerliyor...' },
          { time: 4, text: 'Busra\'da rahip Bahîrâ, gelecek peygamberin işaretlerini fark etti.' }
        ],
        question: 'Şam ticaret yolunda Busra kasabasında Peygamberimizdeki peygamberlik alametlerini fark eden rahibin adı nedir?',
        correctAnswer: 'Bahira',
        alternativeAnswers: ['bahira', 'rahip bahira', 'bahîrâ', 'buheyra'],
        hint1: 'Hristiyan din adamıdır ve Busra\'daki manastırda yaşamaktadır.',
        hint2: '"B" harfiyle başlar.',
        thirdLevelExplanation: 'Doğru cevap "Bahîrâ"dır. Bahîrâ, Ebu Talib\'e yeğenini Şam\'a götürmeyip Mekke\'ye geri göndermesini, zira hasetçilerin ona zarar verebileceğini söylemiştir.',
        reinforcement: {
          instruction: 'Tarihsel gözlem:',
          question: 'Ebu Talib Rahip Bahîrâ\'nın uyarısı üzerine ne yapmıştır?',
          options: ['Yeğenini korumak için Mekke\'ye geri göndermiştir', 'Kervanı Şam\'a sürmüştür', 'Bahîrâ ile tartışmıştır', 'Seyahati bırakmıştır'],
          correctIndex: 0,
          reinforcementNote: 'Ebu Talib mallarını Busra\'da satıp yeğeniyle birlikte hemen Mekke\'ye dönmüştür.'
        }
      }
    ]
  },

  // 591 - Hilfü'l-Fudûl (Erdemliler İttifakı)
  {
    year: 591,
    title: 'Hilfü\'l-Fudûl (Erdemliler İttifakı)',
    subTitle: 'Zulme Karşı Adalet ve Hakkaniyet Yemini',
    location: 'Mekke - Abdullah b. Cüd\'ân\'ın Evi',
    sceneEnvironment: 'mecca',
    historicalSummary: 'Yemenli bir tüccarın malını gasp eden Mekkeli Âs b. Vâil\'e karşı mazlumun hakkını aramak için Mekke\'nin ileri gelenleri Abdullah b. Cüd\'ân\'ın evinde toplandı. Zulme uğrayan kim olursa olsun hakkını teslim etmeye yemin ettiler. Yirmi yaşındaki Hz. Muhammed (s.a.v.) bu adalet paktına coşkuyla katıldı.',
    historicalSource: {
      sourceName: 'Ahmed b. Hanbel, el-Müsned & İbn Sa\'d',
      authorOrRef: 'Müsned, Cilt 1, s. 190; TDV İA "Hilfü\'l-Fudûl" maddesi',
      certaintyLevel: 'Mütevatir / Kesin'
    },
    missions: [
      {
        id: 'm_591_1',
        title: 'Zulme Karşı Ortak Yemin',
        brief: 'Abdullah b. Cüd\'ân\'ın meclis kapısına doğru ilerle.',
        targetPosition: [6, 0, -15],
        targetLabel: 'Erdemliler Toplantı Evi',
        narrativeText: 'Peygamberimiz peygamberliğinden sonra bile bu yemini hatırlayarak şöyle buyurmuştur: "Abdullah b. Cüd\'ân\'ın evinde öyle bir yemine şahit oldum ki, ona kızıl develer verilse değişmem. Bugün İslam\'da böyle bir yemine çağrılsam yine katılırım."',
        subtitles: [
          { time: 0, text: 'Zayıfın ve mazlumun hakkını korumak için erdemli insanlar bir araya geldi.' }
        ],
        question: 'Mekke\'de haksızlığa uğrayan mazlumların hakkını korumak için kurulan ve Peygamberimizin de katıldığı ittifakın adı nedir?',
        correctAnswer: 'Hilfül Fudul',
        alternativeAnswers: ['hilful fudul', 'hilfü\'l-fudûl', 'erdemliler ittifakı', 'erdemliler yemini', 'hilful fudul cemiyeti'],
        hint1: 'Arapça "Erdemliler Anlaşması / Yemini" anlamına gelir.',
        hint2: '"H" harfiyle başlar, Fudûl kelimesini içerir.',
        thirdLevelExplanation: 'Doğru cevap "Hilfü\'l-Fudûl"dür (Erdemliler İttifakı). Mekke\'de adaletin ve ticaret güvenliğinin tesisi için atılmış en önemli tarihsel adımdır.',
        reinforcement: {
          instruction: 'Adalet ve Hakkaniyet:',
          question: 'Peygamberimizin İslamiyet geldikten sonra bile Hilfü\'l-Fudûl\'ü övmesi neyi gösterir?',
          options: ['Adaletin evrensel ve vazgeçilmez bir değer olduğunu', 'Sadece kendi kabilesini koruduğunu', 'Geleneklere körü körüne bağlılığı', 'Ticari kazanç arzusunu'],
          correctIndex: 0,
          reinforcementNote: 'İslam, adalet ve hakkaniyet içeren her güzel hareketi destekler.'
        },
        valueDiscovery: {
          valueId: 'adalet',
          recognitionQuestion: 'Mazlumun hakkını zorbaya karşı savunmak hangi kök değerin en açık tezahürüdür?',
          recognitionOptions: ['Adalet', 'Tasarruf', 'Hız', 'Gösteriş'],
          correctRecognitionIndex: 0,
          explanationPrompt: 'Bir haksızlık gördüğümüzde adaletli bir birey olarak nasıl bir tavır almalıyız?',
          explanationGuide: 'Haksızlığa ortak olmamak ve gücümüz yettiğince mazluma destek olmak adalet duygusunun gereğidir.',
          scenarioTitle: 'Haksızlığa Uğrayan Arkadaş',
          scenarioQuestion: 'Sınıfta bir eşya kırıldı ve suçu hiç suçu olmayan sessiz bir arkadaşının üzerine attılar. Sen ise olayı kimin yaptığını bizzat gördün. Ne yaparsın?',
          scenarioOptions: [
            {
              id: 'a_1',
              text: 'Bana dokunmayan yılan bin yaşasın der, karışmam.',
              isAppropriate: false,
              feedback: 'Haksızlığa sessiz kalmak adaletsizliği büyütür.'
            },
            {
              id: 'a_2',
              text: 'Öğretmenimin yanına gidip suçsuz arkadaşımın haksız yere suçlandığını açıklar, gerçeğin ortaya çıkmasını sağlarım.',
              isAppropriate: true,
              feedback: 'Tebrikler! Hilfü\'l-Fudûl ruhuna uygun, cesur ve adil bir davranış sergiledin.'
            }
          ]
        }
      }
    ]
  },

  // 595 - Hz. Hatice ile Evlilik ve Muhammedü'l-Emîn
  {
    year: 595,
    title: 'Muhammedü\'l-Emîn ve Hz. Hatice ile Evlilik',
    subTitle: 'Güvenin Zirvesi ve Kutlu Yuva',
    location: 'Mekke-i Mükerreme',
    sceneEnvironment: 'mecca',
    historicalSummary: 'Yüksek ahlakı ve dürüstlüğü sebebiyle Mekkeliler ona "el-Emîn" (en güvenilir kişi) lakabını vermişlerdi. Mekke\'nin saygın ve asil hanımefendisi Hz. Hatice, ticaret kervanının başına onu getirdi. Yardımcısı Meysere\'nin şahit olduğu dürüstlük ve bereket neticesinde Hz. Hatice evlilik teklifinde bulundu.',
    historicalSource: {
      sourceName: 'Buhârî, Bed\'ü\'l-Vahy & İbn Hişâm',
      authorOrRef: 'Buhârî, Sahîh, Hadis no: 3; İbn Hişâm, Cilt 1, s. 199-203',
      certaintyLevel: 'Mütevatir / Kesin'
    },
    missions: [
      {
        id: 'm_595_1',
        title: 'Mekke Ticaret Çarşısı ve Dürüstlük',
        brief: 'Mekke çarşısındaki baharat ve kumaş tezgâhına yürü.',
        targetPosition: [-4, 0, -10],
        targetLabel: 'Mekke Çarşısı',
        narrativeText: 'Peygamberimiz ticaret yaparken asla yalan söylemez, kusurlu malı gizlemez, tartıda hile yapmazdı. Hz. Hatice\'nin hizmetkârı Meysere, Şam yolculuğu boyunca onun edep, adalet ve doğruluğuna hayran kalmıştı.',
        subtitles: [
          { time: 0, text: 'Mekke halkı onu "el-Emîn" yani "en güvenilir insan" olarak tanırdı.' }
        ],
        question: 'Mekkelilerin dürüstlüğü ve doğruluğu sebebiyle Peygamberimize verdikleri lakap nedir?',
        correctAnswer: 'Muhammedül Emin',
        alternativeAnswers: ['muhammedul emin', 'el-emin', 'el emin', 'muhammedu\'l-emin', 'emin'],
        hint1: 'Türkçe anlamı "Güvenilir Muhammed" demektir.',
        hint2: '"E" harfiyle biten "el-Emîn" kelimesidir.',
        thirdLevelExplanation: 'Doğru cevap "Muhammedü\'l-Emîn" (el-Emîn)dir. O henüz peygamber olmadan önce bile putperest Mekkeliler en kıymetli eşyalarını ona emanet ederlerdi.',
        reinforcement: {
          instruction: 'Dürüstlük ve Güvenilirlik:',
          question: 'Ticarette tartıyı tam yapmak ve kusurları söylemek hangi kök değerin gereğidir?',
          options: ['Dürüstlük', 'Kurnazlık', 'Hızlılık', 'Gösteriş'],
          correctIndex: 0,
          reinforcementNote: 'Dürüstlük, sözde ve özde bir olmaktır.'
        },
        valueDiscovery: {
          valueId: 'durustluk',
          recognitionQuestion: 'Mekke halkının güvenini kazanarak "el-Emîn" unvanını alması hangi kök değerle ilgilidir?',
          recognitionOptions: ['Dürüstlük', 'Öfke', 'Mizah', 'Güçlülük'],
          correctRecognitionIndex: 0,
          explanationPrompt: 'Toplumda "güvenilir" bir insan olmak neden en büyük zenginliktir?',
          explanationGuide: 'Güvenilirlik, insanın karakterine duyulan saygıdır. Dürüst insan her zaman kazanır.',
          scenarioTitle: 'Fazla Verilen Para Üstü',
          scenarioQuestion: 'Bakkaldan ekmek aldın, bakkal amca dalgınlıkla sana 20 TL yerine 50 TL para üstü verdi. Ne yaparsın?',
          scenarioOptions: [
            {
              id: 'd_1',
              text: 'Parayı hemen cebime atıp hızlıca bakkaldan çıkarım.',
              isAppropriate: false,
              feedback: 'Haksız kazanç dürüstlük ve kul hakkı bilincine tamamen aykırıdır.'
            },
            {
              id: 'd_2',
              text: 'Parayı hemen geri uzatıp "Bakkal amca sanırım dalgınlıkla fazla verdiniz" diyerek iade ederim.',
              isAppropriate: true,
              feedback: 'Mükemmel! el-Emîn ahlakına yakışır, tertemiz bir dürüstlük sergiledin.'
            }
          ]
        }
      }
    ]
  },

  // 605 - Kâbe Hakemliği
  {
    year: 605,
    title: 'Kâbe Hakemliği ve Barışın Tesisi',
    subTitle: 'Kabileler Arası Savaşa Engel Olan Adalet',
    location: 'Kâbe-i Muazzama',
    sceneEnvironment: 'mecca',
    historicalSummary: 'Sel baskını ve yangınla hasar gören Kâbe Kureyş tarafından yeniden inşa edildi. Sıra Hacerülesved taşını yerine koymaya gelince kabileler arasında kanlı bir çatışma çıkmak üzereydi. Kureyş\'in yaşlısı Ebû Ümeyye, Benî Şeybe kapısından ilk girecek kişinin hakem olmasını teklif etti. Kapıdan Hz. Muhammed (s.a.v.) girince herkes sevinçle "İşte el-Emîn! Onun vereceği karara razıyız" dediler.',
    historicalSource: {
      sourceName: 'İbn Hişâm & Ahmed b. Hanbel',
      authorOrRef: 'es-Sîre, Cilt 1, s. 209-214',
      certaintyLevel: 'Mütevatir / Kesin'
    },
    missions: [
      {
        id: 'm_605_1',
        title: 'Hacerülesved ve Birlik Örtüsü',
        brief: 'Kâbe duvarının yanındaki Hacerülesved kaidesine yaklaş.',
        targetPosition: [0, 0, -2],
        targetLabel: 'Kâbe Köşesi',
        narrativeText: 'Otuz beş yaşındaki Hz. Muhammed (s.a.v.) hırkasını yere serdi. Hacerülesved taşını hırkanın ortasına koydu. Her kabile reisine hırkanın bir ucundan tutturarak taşı konulacağı yere kadar birlikte taşıttı. Taşı kendi elleriyle yerine yerleştirdi. Böylece büyük bir kabile savaşı önlendi.',
        subtitles: [
          { time: 0, text: 'Kâbe yeniden inşa ediliyor, Hacerülesved için kabileler kılıç çekmek üzere...' },
          { time: 4, text: 'el-Emîn\'in zekice ve adil çözümü bütün kabileleri birleştirdi.' }
        ],
        question: 'Kâbe tamiratında kabileler arasında kavgaya sebep olan ve yerine yerleştirilmek istenen kutsal taşın adı nedir?',
        correctAnswer: 'Hacerülesved',
        alternativeAnswers: ['hacerulesved', 'hacerul esved', 'hacer-i esved', 'siyah tas', 'hacerü\'l-esved'],
        hint1: 'Arapça "Siyah Taş" anlamına gelir.',
        hint2: '"H" harfiyle başlar, Kâbe\'nin doğu köşesindedir.',
        thirdLevelExplanation: 'Doğru cevap "Hacerülesved"dir. Peygamberimizin her kabileye örtünün ucundan tutturtması, ortak katılım ve barışçı adaletin şaheser bir örneğidir.',
        reinforcement: {
          instruction: 'Hakemlik ve Adalet:',
          question: 'Peygamberimizin bütün kabile reislerine örtüyü tutturması hangi yönünü ortaya koyar?',
          options: ['Birleştirici, adil ve akılcı kriz çözücülüğünü', 'Taraf tuttuğunu', 'Çekingenliğini', 'Aceleciliğini'],
          correctIndex: 0,
          reinforcementNote: 'Adalet, tarafların hepsini onurlandıran ve hakkaniyeti gözeten çözümler üretmektir.'
        },
        valueDiscovery: {
          valueId: 'adalet',
          recognitionQuestion: 'Bütün kabilelerin onurunu koruyarak savaşı önleyen bu çözüm hangi kök değerin örneğidir?',
          recognitionOptions: ['Adalet', 'Öfke', 'Miras', 'İsraf'],
          correctRecognitionIndex: 0,
          explanationPrompt: 'Arkadaşların arasında bir anlaşmazlık çıktığında nasıl uzlaştırıcı olabilirsin?',
          explanationGuide: 'Tarafsız dinlemek, kimseyi dışlamamak ve herkesi ortak bir doğruda buluşturmak adaletin gereğidir.',
          scenarioTitle: 'Oyun Alanı Anlaşmazlığı',
          scenarioQuestion: 'Okul sahasında maç yapmak isteyen iki grup kavga etmeye başladı. Sen hakemlik yapsan nasıl bir çözüm önerirsin?',
          scenarioOptions: [
            {
              id: 'k_1',
              text: 'Kendi yakın arkadaşlarıma sahayı veririm, diğerleri gitsin.',
              isAppropriate: false,
              feedback: 'Taraf tutmak adalete ve barışa zarar verir.'
            },
            {
              id: 'k_2',
              text: 'Süreyi eşit iki yarıya bölerek veya takımları karma yaparak herkesin adilce oynamasını teklif ederim.',
              isAppropriate: true,
              feedback: 'Bravo! Peygamberimizin Kâbe Hakemliğindeki birleştirici adaletini örnek aldın.'
            }
          ]
        }
      }
    ]
  },

  // 610 - İlk Vahiy (Hira Mağarası)
  {
    year: 610,
    title: 'Hira Mağarası ve İlk Vahiy',
    subTitle: 'Oku! Yaratan Rabbinin Adıyla Oku!',
    location: 'Nur Dağı - Hira Mağarası',
    sceneEnvironment: 'hira',
    historicalSummary: 'Kırk yaşına gelen Hz. Muhammed (s.a.v.), Mekke\'deki putperestlikten ve ahlaki çöküntüden uzaklaşarak Hira Mağarası\'nda tefekküre çekilirdi. 610 yılı Ramazan ayının Kadir Gecesi\'nde Cebrail (a.s.) geldi ve ilk vahiy olan Alak Sûresi\'nin ilk beş ayetini tebliğ etti: "Yaratan Rabbinin adıyla oku!"',
    historicalSource: {
      sourceName: 'Buhârî, Bed\'ü\'l-Vahy & Müslim',
      authorOrRef: 'Buhârî, Sahîh, Hadis no: 3; Müslim, Îmân, Hadis no: 252',
      certaintyLevel: 'Mütevatir / Kesin'
    },
    missions: [
      {
        id: 'm_610_1',
        title: 'Nur Dağı\'nın Zirvesinde İlk Sesleniş',
        brief: 'Nur Dağı patikasını tırmanarak Hira Mağarası ağzına ulaş.',
        targetPosition: [0, 8, -35],
        targetLabel: 'Hira Mağarası Ağzı',
        narrativeText: 'Cebrail (a.s.) ona "Oku!" (İkra\') dedi. Peygamberimiz "Ben okuma bilmem" cevabını verdi. Melek onu üç kez kucaklayıp sıktıktan sonra Alak Sûresi\'nin ayetlerini vahyetti. Peygamberimiz heyecan ve haşyet içinde evine dönüp eşi Hz. Hatice\'ye "Beni örtünüz!" dedi. Hz. Hatice ona büyük bir güven vererek destek oldu.',
        subtitles: [
          { time: 0, text: 'Hira Mağarası... İnsanlık tarihinin dönüm noktası.' },
          { time: 4, text: 'Cebrail (a.s.) vahyi getirdi: "Yaratan Rabbinin adıyla oku!"' }
        ],
        question: 'Hz. Muhammed\'e (s.a.v.) ilk vahyin geldiği mağaranın ve dağın adı nedir?',
        correctAnswer: 'Hira Mağarası (Nur Dağı)',
        alternativeAnswers: ['hira', 'hira magarasi', 'hira mağarası', 'nur dagi', 'nur dağı', 'hira nur dağı'],
        hint1: 'Mekke\'nin kuzeydoğusundaki Cebel-i Nûr üzerindedir.',
        hint2: '"H" harfiyle başlar, dört harflidir.',
        thirdLevelExplanation: 'Doğru cevap "Hira Mağarası"dır (Nur Dağı). İlk inen ayetler Alak Sûresi\'nin ilk beş ayetidir ve ilmin, okumanın önemini vurgular.',
        reinforcement: {
          instruction: 'İlk Vahyin Mesajı:',
          question: 'İslam dininin ilk emri nedir?',
          options: ['Oku!', 'Savaş!', 'Gez!', 'Topla!'],
          correctIndex: 0,
          reinforcementNote: '"İkra\'" emri, insanın kainatı ve kendini Allah\'ın adıyla anlamlandırmasını emreder.'
        },
        valueDiscovery: {
          valueId: 'sorumluluk',
          recognitionQuestion: 'İlahi vahyin tebliği gibi muazzam bir görevi üstlenmek hangi kök değerin en yüksek seviyesidir?',
          recognitionOptions: ['Sorumluluk', 'Rahatlık', 'Hırs', 'Zenginlik'],
          correctRecognitionIndex: 0,
          explanationPrompt: 'Öğrenmek, okumak ve faydalı bir insan olmak bize hangi sorumlulukları yükler?',
          explanationGuide: 'İlim öğrenmek ve öğrendiğimiz doğruları hayatımıza uygulamak topluma karşı sorumluluğumuzdur.',
          scenarioTitle: 'Kitap ve Bilgi Arayışı',
          scenarioQuestion: 'Okulda kütüphane kulübünde bir araştırma yapman gerekiyor, internette doğrulanmamış kulaktan dolma bilgiler var. Ne yaparsın?',
          scenarioOptions: [
            {
              id: 'i_1',
              text: 'İlk bulduğum yazıyı kopyalar yapıştırırım, kimse anlamaz.',
              isAppropriate: false,
              feedback: 'Doğrulanmamış bilgiyi yaymak ilmin ve dürüstlüğün sorumluluğuna uymaz.'
            },
            {
              id: 'i_2',
              text: 'Güvenilir kitap ve kaynaklardan araştırır, doğru bilgiyi öğrenerek sunarım.',
              isAppropriate: true,
              feedback: 'Harikasın! "Yaratan Rabbinin adıyla oku" emrinin ruhuna uygun bilimsel ve dürüst bir yaklaşım.'
            }
          ]
        }
      }
    ]
  },

  // 613 - Safâ Tepesi ve Yakın Akrabayı Davet
  {
    year: 613,
    title: 'Açık Tebliğ ve Safâ Tepesi',
    subTitle: 'Şu Dağın Ardında Düşman Var Desem İnanır mısınız?',
    location: 'Mekke - Safâ Tepesi',
    sceneEnvironment: 'mecca',
    historicalSummary: 'Üç yıl süren gizli davet döneminden sonra "En yakın akrabalarını uyar" (Şuara, 214) ayeti nazil oldu. Peygamberimiz Safâ Tepesi\'ne çıkarak Kureyş kabilelerini çağırdı ve onlara dürüstlüğünü ikrar ettirdi.',
    historicalSource: {
      sourceName: 'Buhârî, Tefsîr & Müslim',
      authorOrRef: 'Buhârî, Cilt 6, s. 140; Müslim, Îmân, 355',
      certaintyLevel: 'Mütevatir / Kesin'
    },
    missions: [
      {
        id: 'm_613_1',
        title: 'Safâ Kayalıkları Üzerinden Hitap',
        brief: 'Kâbe\'nin yanındaki Safâ Tepesi taş basamaklarına çık.',
        targetPosition: [8, 2, -18],
        targetLabel: 'Safâ Tepesi Zirvesi',
        narrativeText: 'Peygamberimiz seslendi: "Ey Kureyşliler! Size şu dağın arkasında bir düşman ordusu var, size saldırmak üzere desem bana inanır mısınız?" Kureyşliler tereddütsüz: "Evet inanırız, çünkü senin bugüne kadar yalan söylediğini hiç görmedik!" dediler.',
        subtitles: [
          { time: 0, text: 'Safâ Tepesi\'nde açık davet başladı.' },
          { time: 4, text: '"Senin yalan söylediğini hiç görmedik" dediler.' }
        ],
        question: 'Peygamberimizin akrabalarını açıkça İslam\'a davet etmek için çıktığı meşhur tepenin adı nedir?',
        correctAnswer: 'Safa Tepesi',
        alternativeAnswers: ['safa', 'safâ', 'safa tepesi', 'safâ tepesi'],
        hint1: 'Kâbe\'nin yanında bulunan ve hacda aralarında sa\'y yapılan iki tepeden biridir.',
        hint2: '"S" harfiyle başlar, Merve\'nin kardeşidir.',
        thirdLevelExplanation: 'Doğru cevap "Safâ Tepesi"dir. Peygamberimiz burada tevhid inancını açıkça duyurmuş ve dürüstlüğünün onayını düşmanlarından bile almıştır.',
        reinforcement: {
          instruction: 'Tebliğ ve Karakter:',
          question: 'Kureyşlilerin "Senin yalan söylediğini hiç görmedik" demeleri Peygamberimizin hangi özelliğini kanıtlar?',
          options: ['Kusursuz dürüstlük ve güvenilirliğini', 'Zenginliğini', 'Fiziksel gücünü', 'Sertliğini'],
          correctIndex: 0,
          reinforcementNote: 'En büyük ikna gücü, insanın güvenilir ve temiz ahlakıdır.'
        }
      }
    ]
  },

  // 615 - Habeşistan'a Birinci Hicret
  {
    year: 615,
    title: 'Habeşistan\'a Hicret ve Âdil Hükümdar',
    subTitle: 'Zulümden Adalete Sığınış',
    location: 'Habeşistan Krallığı (Aksum)',
    sceneEnvironment: 'mecca',
    historicalSummary: 'Müşriklerin Mekke\'de Müslümanlara işkence ve baskıları artınca Peygamberimiz, "Habeş ülkesinde bir hükümdar vardır ki, onun yanında kimseye zulmedilmez" diyerek Müslümanların oraya hicret etmesine izin verdi. 11 erkek 4 kadın deniz yoluyla Habeşistan\'a gitti.',
    historicalSource: {
      sourceName: 'İbn Hişâm',
      authorOrRef: 'es-Sîre, Cilt 1, s. 321-325',
      certaintyLevel: 'Sahih / Kuvvetli'
    },
    missions: [
      {
        id: 'm_615_1',
        title: 'Cidde Sahili ve Göç Hazırlığı',
        brief: 'Mekke çıkışındaki sahil yoluna doğru ilerle.',
        targetPosition: [-15, 0, -5],
        targetLabel: 'Kızıldeniz Yolu Çıkışı',
        narrativeText: 'Müslümanlar inançlarını özgürce yaşayabilmek için vatanlarını terk ettiler. Habeş Necaşisi Ashame, Mekkeli elçilerin rüşvetlerine rağmen Ca\'fer b. Ebî Tâlib\'in Meryem Sûresi\'nden okuduğu ayetleri dinleyip ağladı ve Müslümanları teslim etmedi.',
        subtitles: [
          { time: 0, text: 'Zulüm dayanılmaz hale gelince adil bir sığınak arandı.' }
        ],
        question: 'Peygamberimizin "Yanında kimseye zulmedilmez" dediği ve Müslümanları koruyan Habeş kralının unvanı nedir?',
        correctAnswer: 'Necaşi',
        alternativeAnswers: ['necaşi', 'necasi', 'necaşî', 'kral necasi', 'ashame'],
        hint1: 'Habeşistan hükümdarlarına verilen genel unvandır; asıl adı Ashame\'dir.',
        hint2: '"N" harfiyle başlar.',
        thirdLevelExplanation: 'Doğru cevap "Necâşî"dir (Ashame). Hristiyan olan Necâşî adaletiyle meşhurdu ve sonradan İslam\'ı kabul etmiştir.',
        reinforcement: {
          instruction: 'Adalet ve İnanç Özgürlüğü:',
          question: 'Necâşî\'nin Mekkeli müşriklerin hediyelerini reddedip mazlumları koruması hangi erdemdir?',
          options: ['Adalet ve Hakkaniyet', 'Açgözlülük', 'Korkaklık', 'Tembellik'],
          correctIndex: 0,
          reinforcementNote: 'Gerçek bir yönetici dini ne olursa olsun adaleti ayakta tutandır.'
        },
        valueDiscovery: {
          valueId: 'adalet',
          recognitionQuestion: 'Farklı dinden olsa dahi mazlumun hakkını koruyan Necâşî hangi kök değeri sergilemiştir?',
          recognitionOptions: ['Adalet', 'Tasarruf', 'Acelecilik', 'Makam Sevgisi'],
          correctRecognitionIndex: 0,
          explanationPrompt: 'Bir kimse bizden farklı fikirde olsa bile ona adil davranmak neden zorunludur?',
          explanationGuide: 'Adalet bütün insanlığın ortak hakkıdır; inanç veya ırk ayrımı yapılmaksızın herkese adil davranılır.',
          scenarioTitle: 'Yeni Gelen Yabancı Öğrenci',
          scenarioQuestion: 'Sınıfınıza Türkçe\'yi az bilen yabancı uyruklu yeni bir öğrenci geldi. Bazı öğrenciler onunla alay etmeye çalışıyor. Ne yaparsın?',
          scenarioOptions: [
            {
              id: 'n_1',
              text: 'Sessiz kalır, ben de gülerim.',
              isAppropriate: false,
              feedback: 'Mazlumun alaya alınmasına ortak olmak haksızlıktır.'
            },
            {
              id: 'n_2',
              text: 'Alay edenleri uyarır, yeni gelen arkadaşın yanına oturup derslerde ve dil öğrenmesinde ona yardımcı olurum.',
              isAppropriate: true,
              feedback: 'Muhteşem! Necâşî\'nin adalet ve kucaklayıcı ahlakını sınıfta yaşattın.'
            }
          ]
        }
      }
    ]
  },

  // 616 - 619: Boykot Yılları (Şi'b-i Ebî Tâlib)
  {
    year: 617,
    title: 'Şi\'b-i Ebî Tâlib Boykotu ve Sabır',
    subTitle: 'Açlık, Abluka ve Sarsılmaz Direniş',
    location: 'Mekke - Şi\'b-i Ebî Tâlib Mahallesi',
    sceneEnvironment: 'mecca',
    historicalSummary: 'Müşrikler Haşimoğullarına ve Müslümanlara karşı acımasız bir boykot başlattılar. Kız alıp verilmeyecek, ticaret yapılmayacak, konuşulmayacaktı. Kâbe duvarına asılan boykot sahifesi üç yıl sürdü. Müslümanlar açlık içinde ağaç yaprakları yiyerek sabrettiler.',
    historicalSource: {
      sourceName: 'İbn Sa\'d & İbn Hişâm',
      authorOrRef: 'et-Tabakât, Cilt 1, s. 208-210',
      certaintyLevel: 'Mütevatir / Kesin'
    },
    missions: [
      {
        id: 'm_617_1',
        title: 'Abluka Vadisinde Sabır İmtihanı',
        brief: 'Ebu Talib mahallesinin girişindeki nöbetçi kayalıklarına git.',
        targetPosition: [14, 0, -22],
        targetLabel: 'Abluka Mahallesi Girişi',
        narrativeText: 'Çocukların açlıktan ağlama sesleri Mekke sokaklarında yankılanıyordu. Müslümanlar dinlerinden asla taviz vermediler. Nihayet Kâbe\'deki boykot metnini bir güve kurdunun (araza) yediği ve sadece "Bismikellahümme" (Allah\'ım senin adınla) yazısının kaldığı ortaya çıktı ve boykot kalktı.',
        subtitles: [
          { time: 0, text: 'Üç yıl süren acımasız abluka...' },
          { time: 4, text: 'Müslümanlar sabır ve tevekkülle direndiler.' }
        ],
        question: 'Müslümanların üç yıl boyunca boykot ve abluka altında tutuldukları Mekke vadisinin adı nedir?',
        correctAnswer: 'Şibi Ebi Talib',
        alternativeAnswers: ['şib-i ebi talib', 'şi\'b-i ebî tâlib', 'ebu talib mahallesi', 'şibi ebi talip', 'şi\'b'],
        hint1: 'Ebu Talib\'in ailesine ait dar bir vadi/mahalle adıdır.',
        hint2: '"Ş" harfiyle başlar.',
        thirdLevelExplanation: 'Doğru cevap "Şi\'b-i Ebî Tâlib"dir. Bu boykot dönemi İslam tarihinin en büyük sabır ve sadakat destanlarından biridir.',
        reinforcement: {
          instruction: 'Sabır ve Sadakat:',
          question: 'Müslümanların bu ağır ablukaya rağmen inançlarından vazgeçmemeleri hangi değeri gösterir?',
          options: ['Sarsılmaz Sabır ve Sadakat', 'Maddi çıkar', 'Karamsarlık', 'Korku'],
          correctIndex: 0,
          reinforcementNote: 'Sabır, hak yolda sebat etmektir.'
        },
        valueDiscovery: {
          valueId: 'sabir',
          recognitionQuestion: 'Açlık ve yokluk karşısında inancından vazgeçmemek hangi kök değerin şaheseridir?',
          recognitionOptions: ['Sabır', 'Lüks', 'Rahatlık', 'Hırs'],
          correctRecognitionIndex: 0,
          explanationPrompt: 'Hedeflerimize ulaşırken karşımıza çıkan zorluklara karşı nasıl sabırlı olabiliriz?',
          explanationGuide: 'Zorluklar geçicidir; azim ve sabırla çalışanlar nihayetinde aydınlığa kavuşurlar.',
          scenarioTitle: 'Zorlu Bir Sınav Dönemi',
          scenarioQuestion: 'Liselere giriş sınavına hazırlanırken bazı konuları anlamakta çok zorlanıyorsun ve denemelerde puanın düştü. Ne yaparsın?',
          scenarioOptions: [
            {
              id: 'sb_1',
              text: 'Çalışmayı bırakır, pes ederim.',
              isAppropriate: false,
              feedback: 'Pes etmek sabra ve mücadele azmine uymaz.'
            },
            {
              id: 'sb_2',
              text: 'Eksiklerimi tespit eder, öğretmenlerimden yardım ister ve sabırla planlı çalışmaya devam ederim.',
              isAppropriate: true,
              feedback: 'Mükemmel! Sabır ve gayretle her zorluk aşılır.'
            }
          ]
        }
      }
    ]
  },

  // 620 - Hüzün Yılı ve Tâif Seferi
  {
    year: 620,
    title: 'Hüzün Yılı ve Tâif Yolculuğu',
    subTitle: 'Taşlanan Ayaklar ve Merhamet Dolu Dua',
    location: 'Tâif Bahçeleri',
    sceneEnvironment: 'mecca',
    historicalSummary: 'Boykotun kalkmasından kısa bir süre sonra Peygamberimizin koruyucusu amcası Ebu Talib ve en büyük destekçisi eşi Hz. Hatice vefat etti. Bu yıla "Hüzün Yılı" (Senetü\'l-Hüzn) dendi. Peygamberimiz tebliğ için gittiği Tâif\'te taşlandı, ayakları kan içinde kaldı. Cebrail (a.s.) dağları üzerlerine devirmeyi teklif ettiğinde o: "Hayır! Umulur ki onların soyundan Allah\'a ibadet eden bir nesil gelir" diyerek af diledi.',
    historicalSource: {
      sourceName: 'Buhârî, Bed\'ü\'l-Halk & Müslim',
      authorOrRef: 'Buhârî, Cilt 4, s. 82, Hadis no: 3231; Müslim, Cihâd, 111',
      certaintyLevel: 'Mütevatir / Kesin'
    },
    missions: [
      {
        id: 'm_620_1',
        title: 'Tâif Üzüm Bağı ve Haddas\'ın İmanı',
        brief: 'Tâif bahçesindeki asma kütüklerinin yanına git.',
        targetPosition: [-20, 0, -15],
        targetLabel: 'Tâif Bahçesi',
        narrativeText: 'Peygamberimiz bir üzüm bağında dinlenirken Utbe ve Şeybe\'nin kölesi Ninovalı Hristiyan Addas ona üzüm ikram etti. Peygamberimizin "Bismillah" diyerek yemesi üzerine hayret eden Addas, onunla sohbet edip iman etti.',
        subtitles: [
          { time: 0, text: 'Hüzün yılı... İki büyük destekçinin vefatı.' },
          { time: 4, text: 'Tâif\'te taşlanırken bile beddua etmeyen bir rahmet peygamberi.' }
        ],
        question: 'Tâif\'te Peygamberimize üzüm ikram eden ve onun peygamber olduğunu anlayarak iman eden kölenin adı nedir?',
        correctAnswer: 'Addas',
        alternativeAnswers: ['addas', 'haddas', 'köle addas', 'addâs'],
        hint1: 'Ninovalı (Yunus a.s.\'ın memleketi) bir gençtir.',
        hint2: '"A" harfiyle başlar, beş harflidir.',
        thirdLevelExplanation: 'Doğru cevap "Addas"tır. Peygamberimiz Tâif\'te en zor anında bile şefkatini kaybetmemiş, tek bir kişinin hidayetiyle teselli bulmuştur.',
        reinforcement: {
          instruction: 'Af ve Merhamet:',
          question: 'Peygamberimizin kendisini taşlayan Tâiflilere beddua etmek yerine hidayet dilemesi neyin göstergesidir?',
          options: ['Evrensel merhamet ve sevgi peygamberi olduğunun', 'Korktuğunun', 'İlgisizliğinin', 'Unuttuğunun',],
          correctIndex: 0,
          reinforcementNote: 'Kur\'an-ı Kerim\'de "Biz seni ancak alemlere rahmet olarak gönderdik" (Enbiya, 107) buyrulmaktadır.'
        },
        valueDiscovery: {
          valueId: 'sevgi',
          recognitionQuestion: 'Düşmanlarına dahi merhamet edip iyiliklerini istemek hangi kök değerin en yüce basamağıdır?',
          recognitionOptions: ['Sevgi ve Merhamet', 'Öç Alma', 'Kibir', 'Öfke'],
          correctRecognitionIndex: 0,
          explanationPrompt: 'Bize kötülük yapan birine iyilikle karşılık vermek kalpleri nasıl yumuşatır?',
          explanationGuide: 'Affetmek ve merhamet göstermek, düşmanlıkları dostluğa dönüştüren en güçlü iyiliktir.',
          scenarioTitle: 'Kasıtlı Çelme',
          scenarioQuestion: 'Okul koridorunda koşarken bir arkadaşın bilerek ayağını uzattı ve düştün, dizin acıdı. Arkadaşın ise hatasını anlayıp mahcup oldu. Ne yaparsın?',
          scenarioOptions: [
            {
              id: 'af_1',
              text: 'Yerden kalkıp ona yumruk atarım.',
              isAppropriate: false,
              feedback: 'Şiddet uygulamak merhamete ve öz denetime sığmaz.'
            },
            {
              id: 'af_2',
              text: 'Öfkelenmeden kalkar, "Yaptığın tehlikeliydi ama özür dilediğin için seni affediyorum" derim.',
              isAppropriate: true,
              feedback: 'Harikasın! Tâif\'teki rahmet ve af ahlakını kendi hayatında gösterdin.'
            }
          ]
        }
      }
    ]
  },

  // 622 - Hicret ve Medine'ye Varış
  {
    year: 622,
    title: 'Hicret: Sevr Mağarası ve Medine',
    subTitle: 'Karanlıktan Aydınlığa Kutlu Yolculuk',
    location: 'Sevr Mağarası & Kuba & Medine',
    sceneEnvironment: 'sevr',
    historicalSummary: 'Müşriklerin suikast planı üzerine Hz. Ali Peygamberimizin yatağına yattı. Peygamberimiz ve sadık dostu Hz. Ebubekir Sevr Mağarası\'nda üç gün gizlendi. Örümcek ağı ve güvercin yuvası onları gizledi. Ardından Medine\'ye ulaştılar, Kuba Mescidi inşa edildi ve Medineli Ensar onları coşkuyla karşıladı.',
    historicalSource: {
      sourceName: 'Buhârî, Menâkıbu\'l-Ensâr & Tevbe Sûresi, 40',
      authorOrRef: 'Buhârî, Cilt 5, Hadis no: 3905; Kur\'an-ı Kerim 9:40',
      certaintyLevel: 'Mütevatir / Kesin'
    },
    missions: [
      {
        id: 'm_622_1',
        title: 'Sevr Mağarası ve Kutlu Dostluk',
        brief: 'Sevr Dağı\'nın kayalık geçidine doğru tırman.',
        targetPosition: [0, 5, -28],
        targetLabel: 'Sevr Mağarası Girişi',
        narrativeText: 'Müşrikler mağara ağzına kadar geldiklerinde Hz. Ebubekir endişelendi. Peygamberimiz tarihe geçen şu sözü söyledi: "Üzülme! Allah bizimle beraberdir." (Lâ tahzen, innallâhe meanâ). Sadık dost Ebubekir canını tehlikeye atarak ona yoldaş oldu.',
        subtitles: [
          { time: 0, text: '622 yılı... Sevr Mağarası ve Hicret yolculuğu.' },
          { time: 4, text: '"Üzülme! Allah bizimle beraberdir."' }
        ],
        question: 'Hicret yolculuğunda Peygamberimize sadık bir yol arkadaşı olan, "Sıddîk" lakaplı ilk halife kimdir?',
        correctAnswer: 'Hz. Ebubekir',
        alternativeAnswers: ['ebubekir', 'hz ebubekir', 'ebû bekir', 'hz. ebu bekir', 'ebu bekir es-sıddık'],
        hint1: 'Peygamberimizin en yakın dostu ve mağara arkadaşıdır (yâr-ı gâr).',
        hint2: '"E" harfiyle başlar.',
        thirdLevelExplanation: 'Doğru cevap "Hz. Ebubekir"dir. Malını ve canını feda ederek Hicret yolunda Peygamberimize yoldaşlık etmiş, Kur\'an\'da "ikinin ikincisi" olarak anılmıştır.',
        reinforcement: {
          instruction: 'Dostluk ve Vefa:',
          question: 'Hz. Ebubekir\'in Sevr Mağarası\'ndaki ve Hicret\'teki duruşu hangi kök değerin timsalidir?',
          options: ['Sadık Dostluk ve Vefa', 'Bencillik', 'Korku', 'Makam Sevgisi'],
          correctIndex: 0,
          reinforcementNote: 'Gerçek dost, en tehlikeli anda arkadaşını yalnız bırakmayandır.'
        },
        valueDiscovery: {
          valueId: 'dostluk',
          recognitionQuestion: 'Hz. Ebubekir\'in canını tehlikeye atarak Peygamberimizin yanında yürümesi hangi kök değerdir?',
          recognitionOptions: ['Dostluk', 'Tasarruf', 'Hız', 'Rekabet'],
          correctRecognitionIndex: 0,
          explanationPrompt: 'İyi bir arkadaş ve dost olmak günlük yaşamımızda neleri gerektirir?',
          explanationGuide: 'Dostluk güven, sadakat ve zor günlerde koşulsuz destek olmayı gerektirir.',
          scenarioTitle: 'Zor Durumdaki Arkadaş',
          scenarioQuestion: 'Yakın arkadaşın okulda önemli bir ödevini evde unuttu ve çok üzgün. Ne yaparsın?',
          scenarioOptions: [
            {
              id: 'ds_1',
              text: '"Senin dikkatsizliğin" deyip alay ederim.',
              isAppropriate: false,
              feedback: 'Arkadaşının üzüntüsüyle eğlenmek gerçek dostluğa uymaz.'
            },
            {
              id: 'ds_2',
              text: 'Onu teselli eder, öğretmenimize durumu dürüstçe açıklaması için cesaret verir ve moralini yüksek tutarım.',
              isAppropriate: true,
              feedback: 'Tebrikler! Sevr mağarasındaki sadık dostluk anlayışını yansıttın.'
            }
          ]
        }
      }
    ]
  },

  // 623 - Mescid-i Nebevî ve Muâhât (Kardeşlik)
  {
    year: 623,
    title: 'Mescid-i Nebevî ve Muâhât (Kardeşlik)',
    subTitle: 'Paylaşmanın Zirvesi: Ensar ve Muhacir',
    location: 'Medine-i Münevvere',
    sceneEnvironment: 'madinah',
    historicalSummary: 'Medine\'de Peygamberimizin devesi Kusvâ\'nın çöktüğü yere Mescid-i Nebevî inşa edildi. Peygamberimiz bizzat kerpiç taşıdı. Mekke\'den her şeylerini bırakıp gelen Muhacirler ile Medineli Ensar arasında "Muâhât" (kardeşlik) ilan edildi. Ensar evlerini ve tarlalarını muhacir kardeşleriyle yarı yarıya paylaştı.',
    historicalSource: {
      sourceName: 'Buhârî, Menâkıbu\'l-Ensâr & Müslim',
      authorOrRef: 'Buhârî, Hadis no: 3937; TDV İA "Muâhât" maddesi',
      certaintyLevel: 'Mütevatir / Kesin'
    },
    missions: [
      {
        id: 'm_623_1',
        title: 'Mescid-i Nebevî İnşası ve Suffe',
        brief: 'Medine meydanındaki hurma direkli mescid avlusuna yürü.',
        targetPosition: [0, 0, -10],
        targetLabel: 'Mescid-i Nebevî Avlusu',
        narrativeText: 'Mescidin bir köşesine "Suffe" adı verilen bir gölgelik yapıldı. Burada kimsesiz ve ilim öğrenmek isteyen sahabiler kalıyordu. Ashab-ı Suffe İslam ilimlerinin yayılmasında en büyük rolü oynadı.',
        subtitles: [
          { time: 0, text: 'Medine\'de sevgi ve kardeşlik şehri kuruluyor.' },
          { time: 4, text: 'Ensar ve Muhacir kardeş oldu, her şeylerini paylaştılar.' }
        ],
        question: 'Medineli Müslümanlar (Ensar) ile Mekke\'den göç eden Müslümanlar arasında ilan edilen kardeşlik sözleşmesine ne ad verilir?',
        correctAnswer: 'Muahat',
        alternativeAnswers: ['muahat', 'muâhât', 'kardeslik', 'kardeşlik antlaşması', 'kardeslik sozlesmesi'],
        hint1: 'Arapça kökenli bir kelimedir ve "kardeşleşme" anlamına gelir.',
        hint2: '"M" harfiyle başlar.',
        thirdLevelExplanation: 'Doğru cevap "Muâhât"tır. Bu kardeşlik insanlık tarihinin gördüğü en fedakârca dayanışma ve paylaşma örneğidir.',
        reinforcement: {
          instruction: 'Kardeşlik ve Paylaşım:',
          question: 'Medineli Ensar\'ın evlerini ve tarlalarını Muhacirlerle paylaşması hangi değeri temsil eder?',
          options: ['Yardımseverlik ve Cömertlik', 'Kıskançlık', 'Ticarethane açma', 'Gösteriş'],
          correctIndex: 0,
          reinforcementNote: 'Yardımseverlik, karşılık beklemeden elindekini kardeşinle paylaşmaktır.'
        },
        valueDiscovery: {
          valueId: 'yardimseverlik',
          recognitionQuestion: 'Ensar\'ın malını muhacir kardeşiyle bölüşmesi hangi kök değerin en parlak örneğidir?',
          recognitionOptions: ['Yardımseverlik', 'İsraf', 'Tembellik', 'Gurur'],
          correctRecognitionIndex: 0,
          explanationPrompt: 'Toplumumuzdaki ihtiyaç sahiplerine yardım etmek toplumsal huzuru nasıl güçlendirir?',
          explanationGuide: 'Yardımlaşma insanlar arasındaki sevgiyi artırır, fakirlik ve yalnızlık hissini ortadan kaldırır.',
          scenarioTitle: 'Beslenme Çantasını Unutan Arkadaş',
          scenarioQuestion: 'Öğle arasında sınıf arkadaşının beslenmesini evde unuttuğunu ve bir köşede üzgün oturduğunu fark ettin. Ne yaparsın?',
          scenarioOptions: [
            {
              id: 'yd_1',
              text: 'Ona bakmadan kendi yemeğimi hızlıca yerim.',
              isAppropriate: false,
              feedback: 'Yanı başındaki aç bir arkadaşına duyarsız kalmak yardımseverliğe aykırıdır.'
            },
            {
              id: 'yd_2',
              text: 'Yanına gidip yemeğimi onunla seve seve yarı yarıya paylaşır, birlikte yerim.',
              isAppropriate: true,
              feedback: 'Bravo! Medineli Ensar\'ın yardımseverlik ve cömertlik ruhunu yaşattın.'
            }
          ]
        }
      }
    ]
  },

  // 624 - Bedir Zaferi
  {
    year: 624,
    title: 'Bedir Zaferi ve Hak ile Batılın Ayrılışı',
    subTitle: 'Azlığın Çokluğa Galebe Çaldığı Gün',
    location: 'Bedir Kuyuları',
    sceneEnvironment: 'badr',
    historicalSummary: 'Müşriklerin Mekke\'de Müslümanların mallarını yağmalaması ve tehditleri sonucu Bedir Gazvesi gerçekleşti. 313 kişilik Müslüman ordusu, 1000 kişilik teçhizatlı müşrik ordusunu Allah\'ın yardımıyla mağlup etti. Esirlere güzel davranıldı; on Müslümana okuma yazma öğreten esir serbest bırakıldı.',
    historicalSource: {
      sourceName: 'Buhârî, Meğâzî & Enfâl Sûresi',
      authorOrRef: 'Buhârî, Cilt 5, s. 92; Kur\'an-ı Kerim 8:9-17',
      certaintyLevel: 'Mütevatir / Kesin'
    },
    missions: [
      {
        id: 'm_624_1',
        title: 'Bedir Kuyuları ve Esirlere Muamele',
        brief: 'Bedir mevkiindeki palmiye ve çadırların yanına ulaş.',
        targetPosition: [0, 0, -25],
        targetLabel: 'Bedir Mola Yeri',
        narrativeText: 'Savaş sonrası alınan esirler sahabilerin evlerine paylaştırıldı. Sahabeler kendi ekmeklerini esirlere verir, kendileri hurma ile yetinirlerdi. Peygamberimiz okuma-yazma bilen esirlerin on Müslüman çocuğa okuma yazma öğretmesi şartıyla serbest kalacağını bildirdi.',
        subtitles: [
          { time: 0, text: '624 yılı... Bedir Gazvesi ve büyük zafer.' },
          { time: 4, text: 'Savaş esirlerine bile ilim ve insan onuruyla yaklaşıldı.' }
        ],
        question: 'Bedir Gazvesi sonrasında okuma yazma bilen esirlerin serbest kalması için konulan şart neydi?',
        correctAnswer: 'On Müslümana okuma yazma öğretmek',
        alternativeAnswers: ['okuma yazma ogretmek', '10 muslumana okuma yazma', 'on kisiye okuma yazma ogretmek', 'cocuklara okuma yazma'],
        hint1: 'İlim ve eğitimle ilgilidir.',
        hint2: 'On çocuğa bir beceri kazandırmaktır.',
        thirdLevelExplanation: 'Peygamberimiz esirlerin kurtuluş fidyesi olarak on Müslüman çocuğa okuma yazma öğretmelerini istemiştir. Bu, İslam\'ın eğitime verdiği eşsiz değerin kanıtıdır.',
        reinforcement: {
          instruction: 'İlim ve İnsan Onuru:',
          question: 'Peygamberimizin esirlerin fidyelerini okuma yazma öğretmeye bağlaması neyi gösterir?',
          options: ['Eğitim ve ilme verilen muazzam önemi', 'Paraya olan düşkünlüğü', 'Savaş arzusunu', 'İlgisizliği'],
          correctIndex: 0,
          reinforcementNote: 'İslam, en zorlu savaş ortamında dahi cehaletle mücadeleyi ve insan onurunu öncelemiştir.'
        }
      }
    ]
  },

  // 625 - Uhud Savaşı ve Okçular Tepesi
  {
    year: 625,
    title: 'Uhud Savaşı ve Okçular Tepesi',
    subTitle: 'Emre İtaat, Öz Denetim ve Birlik Dersi',
    location: 'Uhud Dağı Etekleri',
    sceneEnvironment: 'uhud',
    historicalSummary: 'Bedir\'in intikamını almak isteyen Kureyş 3000 kişilik orduyla Medine yakınlarına geldi. Peygamberimiz Uhud Dağı eteklerinde Ayneyn Tepesi\'ne (Okçular Tepesi) Abdullah b. Cübeyr komutasında 50 okçu yerleştirdi ve "Kuşların cesetlerimizi kaptığını görseniz dahi yerinizden ayrılmayın" buyurdu. Ancak savaş kazanıldı sanılarak tepe terk edilince müşrik süvarileri arkadan saldırdı.',
    historicalSource: {
      sourceName: 'Buhârî, Meğâzî & Âl-i İmrân Sûresi',
      authorOrRef: 'Buhârî, Hadis no: 4043; Kur\'an-ı Kerim 3:152',
      certaintyLevel: 'Mütevatir / Kesin'
    },
    missions: [
      {
        id: 'm_625_1',
        title: 'Ayneyn (Okçular) Tepesi\'nin Dersi',
        brief: 'Uhud vadisindeki Okçular Tepesi kayalığına çık.',
        targetPosition: [-5, 4, -20],
        targetLabel: 'Ayneyn (Okçular) Tepesi',
        narrativeText: 'Tepenin terk edilmesi sonucu Hz. Hamza şehit oldu, Peygamberimizin mübarek dişi kırıldı ve yanağı yaralandı. Ancak Peygamberimiz ashabına kızıp azarlamadı, af diledi. Bu olay, kurallara uymanın ve öz denetimin hayati önemini bütün çağlara öğretti.',
        subtitles: [
          { time: 0, text: 'Uhud... Emre itaatin ve öz denetimin büyük dersi.' },
          { time: 4, text: 'Okçular yerlerini terk edince savaşın seyri değişti.' }
        ],
        question: 'Uhud Savaşı\'nda Peygamberimizin kesin emrine rağmen okçuların çoğunun terk ettiği meşhur tepenin adı nedir?',
        correctAnswer: 'Okçular Tepesi (Ayneyn Tepesi)',
        alternativeAnswers: ['okcular tepesi', 'okçular tepesi', 'ayneyn tepesi', 'cebelur rumat', 'cebelür rumât'],
        hint1: 'Türkçe yaygın adıyla "Okçular..." olarak bilinir.',
        hint2: '"O" harfiyle başlar.',
        thirdLevelExplanation: 'Doğru cevap "Okçular Tepesi"dir (Cebelü\'r-Rumât / Ayneyn). Bu hadise, disiplinin, kurallara uymanın ve anlık heveslere kapılmamanın (öz denetim) önemini gösterir.',
        reinforcement: {
          instruction: 'Öz Denetim ve Kurallara Uymak:',
          question: 'Okçuların yerlerini terk etmesi hangi ilkenin eksikliğinden kaynaklanmıştır?',
          options: ['Öz denetim ve Emre Sadakat', 'Cesaret fazlalığı', 'Hız', 'Bilgisizlik'],
          correctIndex: 0,
          reinforcementNote: 'Toplu başarılarda kural ve sorumluluklara sadakat en belirleyici unsurdur.'
        },
        valueDiscovery: {
          valueId: 'oz_denetim',
          recognitionQuestion: 'Kurallara ve liderin talimatına sadık kalıp nefsin isteklerine direnmek hangi kök değerdir?',
          recognitionOptions: ['Öz Denetim', 'Tembellik', 'Müsriflik', 'Öfke'],
          correctRecognitionIndex: 0,
          explanationPrompt: 'Öz denetim sahibi bir birey günlük hayatında kurallara neden titizlikle uyar?',
          explanationGuide: 'Öz denetim; kimse görmese bile doğru davranabilmek ve sorumluluklarının bilincinde olmaktır.',
          scenarioTitle: 'Trafik Işığı ve Boş Yol',
          scenarioQuestion: 'Gece vakti karşıdan karşıya geçeceksin, yolda hiç araba yok fakat yayalara kırmızı ışık yanıyor. Ne yaparsın?',
          scenarioOptions: [
            {
              id: 'oz_1',
              text: 'Nasılsa araba yok ve kimse görmüyor der, hemen geçerim.',
              isAppropriate: false,
              feedback: 'Kurallar sadece birileri varken değil, her zaman uyulmak içindir.'
            },
            {
              id: 'oz_2',
              text: 'Yeşil ışık yanana kadar sabırla bekler, kurallara kendi irademle uyarım.',
              isAppropriate: true,
              feedback: 'Harikasın! Uhud\'daki Okçular Tepesi dersini anlayıp mükemmel bir öz denetim sergiledin.'
            }
          ]
        }
      }
    ]
  },

  // 627 - Hendek Savaşı
  {
    year: 627,
    title: 'Hendek Savaşı ve İstişare',
    subTitle: 'Akıl, Fikir Birliği ve Dayanışma',
    location: 'Medine Kuzey Sınırı',
    sceneEnvironment: 'madinah',
    historicalSummary: 'Müşrikler ve müttefik kabileler 10.000 kişilik dev bir orduyla (Ahzâb) Medine\'yi kuşattı. Peygamberimiz ashabıyla istişare etti. İranlı sahabi Selmân-ı Fârisî\'nin teklifiyle Medine\'nin açık olan kuzey kısmına hendek kazıldı. Peygamberimiz bizzat kazma vurup hendek kazdı. Soğuk ve şiddetli fırtına ile müşrik ordusu dağıldı.',
    historicalSource: {
      sourceName: 'Buhârî, Meğâzî & Ahzâb Sûresi',
      authorOrRef: 'Buhârî, Hadis no: 4101; Kur\'an-ı Kerim 33:9-25',
      certaintyLevel: 'Mütevatir / Kesin'
    },
    missions: [
      {
        id: 'm_627_1',
        title: 'Hendek Kazısı ve Selmân-ı Fârisî',
        brief: 'Medine kuzeyindeki toprak siper hattına yürü.',
        targetPosition: [0, 0, -20],
        targetLabel: 'Hendek Savunma Hattı',
        narrativeText: 'Kuşatma haftalarca sürdü. Sahabeler açlıktan karınlarına taş bağlamıştı. Peygamberimiz de karnına taş bağlamış halde ashabıyla birlikte taş kırıyor ve onlara moral veriyordu: "Allah\'ım! Asıl hayat ahiret hayatıdır, sen Ensar ve Muhacir\'i bağışla!"',
        subtitles: [
          { time: 0, text: '627 yılı... Medine Hendek ile savunuluyor.' },
          { time: 4, text: 'İstişare ile Selmân-ı Fârisî\'nin fikri kabul edildi.' }
        ],
        question: 'Hendek Savaşı\'nda şehrin etrafına hendek kazılması fikrini teklif eden sahabi kimdir?',
        correctAnswer: 'Selman-ı Farisi',
        alternativeAnswers: ['selman', 'selman-ı farisi', 'selman farisi', 'selman-i farisi', 'selmân'],
        hint1: 'İran kökenli meşhur sahabidir.',
        hint2: '"S" harfiyle başlar.',
        thirdLevelExplanation: 'Doğru cevap "Selmân-ı Fârisî"dir. Peygamberimiz onun fikrini benimsemiş ve "Selmân bizdendir, Ehl-i Beyt\'tendir" buyurmuştur.',
        reinforcement: {
          instruction: 'İstişare ve Dayanışma:',
          question: 'Peygamberimizin ashabının fikrini alıp hendek kazdırması hangi ilkeyi gösterir?',
          options: ['İstişare (Danışma) ve Ortak Akıl', 'Tek adamlık', 'Kararsızlık', 'Gelişigüzellik'],
          correctIndex: 0,
          reinforcementNote: 'İstişare etmek, işleri ehline danışarak en doğru çözümü bulmaktır.'
        }
      }
    ]
  },

  // 628 - Hudeybiye Barış Antlaşması
  {
    year: 628,
    title: 'Hudeybiye Barış Antlaşması ve Rıdvân Biatı',
    subTitle: 'Zahiren Ağır, Hakikatte Apaçık Bir Zafer (Feth-i Mübîn)',
    location: 'Hudeybiye Kuyusu',
    sceneEnvironment: 'hudaybiyyah',
    historicalSummary: 'Peygamberimiz 1400 sahabiyle sadece umre yapmak üzere Mekke\'ye doğru yola çıktı. Silahsız olan Müslümanların Mekke\'ye girmesi engellendi. Hudeybiye\'de çetin müzakereler sonucu barış antlaşması imzalandı. İlk bakışta aleyhte görünen maddeler, İslam\'ın barış ortamında hızla yayılmasını sağladı. Kur\'an bu antlaşmayı "Apaçık bir fetih" (Fethan Mübînâ) olarak niteledi.',
    historicalSource: {
      sourceName: 'Buhârî, Şurût & Fetih Sûresi',
      authorOrRef: 'Buhârî, Hadis no: 2731; Kur\'an-ı Kerim 48:1',
      certaintyLevel: 'Mütevatir / Kesin'
    },
    missions: [
      {
        id: 'm_628_1',
        title: 'Hudeybiye Ağacı Altında Sadakat',
        brief: 'Hudeybiye vadisindeki gölgelik akasya ağacına doğru yürü.',
        targetPosition: [0, 0, -16],
        targetLabel: 'Rıdvân Ağacı Altı',
        narrativeText: 'Hz. Osman Mekke\'ye elçi gönderilmiş fakat şehit edildiği haberi gelmişti. Peygamberimiz bir ağaç altında ashabından son nefese kadar ayrılmayacaklarına dair biat aldı (Rıdvân Biatı). Ardından Mekkeli Süheyl b. Amr ile 10 yıllık barış antlaşması imzalandı.',
        subtitles: [
          { time: 0, text: 'Hudeybiye... Barışın ve sabırlı diplomasinin zaferi.' },
          { time: 4, text: 'Kur\'an bu barışı "Apaçık bir fetih" olarak müjdeledi.' }
        ],
        question: 'Hudeybiye\'de sahabilerin Peygamberimize sonuna kadar sadakatle bağlılık sözü verdikleri biatın adı nedir?',
        correctAnswer: 'Rıdvan Biatı',
        alternativeAnswers: ['ridvan biati', 'rıdvan biatı', 'bey\'atür rıdvan', 'rıdvan'],
        hint1: 'Allah\'ın kendilerinden razı olduğu bildirilen kutlu biattır.',
        hint2: '"R" harfiyle başlar.',
        thirdLevelExplanation: 'Doğru cevap "Rıdvân Biatı"dır. Hudeybiye Antlaşması ile Mekkeliler ilk kez İslam devletini resmen tanımış, oluşan barış ikliminde iki yıl içinde önceki 18 yıldan daha çok insan Müslüman olmuştur.',
        reinforcement: {
          instruction: 'Barış ve Diplomasi:',
          question: 'Hudeybiye Barışı\'nın İslamiyet\'e en büyük faydası ne olmuştur?',
          options: ['Barış ortamında İslam\'ın hızla ve gönüllere girerek yayılması', 'Savaşların artması', 'Mekke\'nin hemen terk edilmesi', 'Zenginleşme'],
          correctIndex: 0,
          reinforcementNote: 'İslam barış dinidir; barış ortamında hakikat çok daha kolay anlaşılır.'
        },
        valueDiscovery: {
          valueId: 'sabir',
          recognitionQuestion: 'Maddeleri ilk bakışta ağır görünse de barış için sabredip anlaşmaya imza atmak hangi kök değerdir?',
          recognitionOptions: ['Sabır ve Barışseverlik', 'Kibir', 'Öfke', 'Gösteriş'],
          correctRecognitionIndex: 0,
          explanationPrompt: 'Öfkeyle hareket etmek yerine sabırla barış yolunu seçmek bize neler kazandırır?',
          explanationGuide: 'Sabırla atılan adımlar kalıcı huzur ve adalet getirir.',
          scenarioTitle: 'Küskünlük ve Barışma',
          scenarioQuestion: 'İki arkadaşın ufak bir iddia yüzünden küstü ve birbirleriyle konuşmuyor. Ne yaparsın?',
          scenarioOptions: [
            {
              id: 'hb_1',
              text: 'Aralarını daha da açacak dedikodular yayarım.',
              isAppropriate: false,
              feedback: 'İnsanların arasını bozmak ahlaka ve barışa sığmaz.'
            },
            {
              id: 'hb_2',
              text: 'İkisini de sakince dinler, ortak noktalarını hatırlatarak barışmalarını sağlarım.',
              isAppropriate: true,
              feedback: 'Mükemmel! Hudeybiye\'deki barış yapıcı ruhu canlandırdın.'
            }
          ]
        }
      }
    ]
  },

  // 630 - Mekke'nin Fethi
  {
    year: 630,
    title: 'Mekke\'nin Fethi ve Genel Af',
    subTitle: 'İntikam Değil Merhamet Günü: Bugün Size Kınama Yok!',
    location: 'Mekke-i Mükerreme & Kâbe Avlusu',
    sceneEnvironment: 'mecca',
    historicalSummary: 'Müşriklerin Hudeybiye antlaşmasını bozmaları üzerine 10.000 kişilik İslam ordusu Mekke\'ye yürüdü. Kan dökülmeden Mekke fethedildi. Peygamberimiz Kâbe\'ye girdiğinde putları birer birer temizledi. Kendisine yıllarca zulmeden, işkence eden ve vatanından süren Mekkelilere: "Bugün size bir kınama ve ceza yoktur. Gidiniz, hepiniz serbestsiniz!" buyurdu.',
    historicalSource: {
      sourceName: 'Buhârî, Meğâzî & İbn Hişâm',
      authorOrRef: 'Buhârî, Hadis no: 4280; İbn Hişâm, Cilt 2, s. 411-413',
      certaintyLevel: 'Mütevatir / Kesin'
    },
    missions: [
      {
        id: 'm_630_1',
        title: 'Kâbe Kapısında Genel Af İlanı',
        brief: 'Kâbe kapısının önüne doğru vakarla ilerle.',
        targetPosition: [0, 0, -4],
        targetLabel: 'Kâbe Kapısı Önü',
        narrativeText: 'Mekke halkı korku ve endişe içinde Kâbe etrafında toplanmış, Peygamberimizin ağzından çıkacak kararı bekliyordu. Peygamberimiz Hz. Yusuf\'un kardeşlerine söylediği sözü hatırlattı: "Bugün size başa kakma ve ayıplama yok! Allah sizi bağışlasın. O merhametlilerin en merhametlisidir." Bütün Mekke bu eşsiz affedicilik karşısında hayran kaldı.',
        subtitles: [
          { time: 0, text: '630 yılı... Mekke kansız fethedildi.' },
          { time: 4, text: '"Bugün size bir kınama yoktur, hepiniz serbestsiniz!"' }
        ],
        question: 'Mekke\'nin fethi günü Peygamberimizin Kâbe kapısında toplanan halka yönelik ilan ettiği affedici karar nedir?',
        correctAnswer: 'Genel Af',
        alternativeAnswers: ['genel af', 'af', 'hepiniz serbestsiniz', 'af ilani', 'bagislama'],
        hint1: 'İntikam almak yerine herkesi bağışlamıştır.',
        hint2: '"G" harfiyle başlar, hukuki bir terimdir.',
        thirdLevelExplanation: 'Doğru cevap "Genel Af"tır. Zafer anında mağrur olmak yerine devesinin üzerinde secde edercesine eğilen ve can düşmanlarını bile bağışlayan Peygamberimiz, tarihte benzeri olmayan bir ahlak abidesi olmuştur.',
        reinforcement: {
          instruction: 'Af ve Merhamet:',
          question: 'Peygamberimizin gücü elindeyken can düşmanlarını bağışlaması hangi ahlaki zirveyi gösterir?',
          options: ['Eşsiz Merhamet, Adalet ve Tevazu', 'Korkaklık', 'Zayıflık', 'Unutkanlık'],
          correctIndex: 0,
          reinforcementNote: 'Gerçek güç, intikam alabilme gücüne sahipken affedebilmektir.'
        },
        valueDiscovery: {
          valueId: 'adalet',
          recognitionQuestion: 'Güç elindeyken intikam peşinde koşmayıp hakkı ve barışı üstün tutmak hangi kök değerle ilgilidir?',
          recognitionOptions: ['Adalet ve Merhamet', 'Hırs', 'Kibir', 'Öç'],
          correctRecognitionIndex: 0,
          explanationPrompt: 'Güçlü olduğumuzda zayıflara ve hatalı olanlara nasıl davranmalıyız?',
          explanationGuide: 'Güç affetmek ve adaleti korumak için bir emanettir, ezmek için bir araç değildir.',
          scenarioTitle: 'Kazanılan Maçın Ardından',
          scenarioQuestion: 'Okullar arası turnuva finalinde rakip takımı yendiniz. Rakip oyuncular çok üzgün ve ağlıyor. Ne yaparsın?',
          scenarioOptions: [
            {
              id: 'mf_1',
              text: 'Onların karşısına geçip alay eder, sevinç çığlıklarıyla onları kızdırırım.',
              isAppropriate: false,
              feedback: 'Kaybedenle alay etmek spor ahlakına ve merhamete uymaz.'
            },
            {
              id: 'mf_2',
              text: 'Yanlarına gidip ellerini sıkar, "Çok iyi mücadele ettiniz, tebrik ederiz" diyerek onları teselli ederim.',
              isAppropriate: true,
              feedback: 'Bravo! Fethin tevazu ve asalet dolu ahlakını sahada sergiledin.'
            }
          ]
        }
      }
    ]
  },

  // 632 - Veda Haccı, Veda Hutbesi ve İrtihal
  {
    year: 632,
    title: 'Veda Haccı ve Veda Hutbesi',
    subTitle: 'Evrensel İnsan Hakları ve Kutlu Veda',
    location: 'Arafat Meydanı & Medine-i Münevvere',
    sceneEnvironment: 'mecca',
    historicalSummary: 'Peygamberimiz 100.000\'i aşkın sahabiyle hac yaptı. Arafat Vadisi\'nde devesi Kasva\'nın üzerinde meşhur Veda Hutbesi\'ni irad etti. Can, mal ve namus dokunulmazlığını, kadın haklarını, ırk üstünlüğünün reddini ilan etti: "Ey insanlar! Rabbiniz birdir, babanız birdir. Arabın Aceme, Acemin Araba üstünlüğü yoktur. Üstünlük ancak takva iledir." Aynı yılın Rebîülevvel ayında Medine\'de vefat ederek Refîk-i A\'lâ\'ya kavuştu.',
    historicalSource: {
      sourceName: 'Buhârî, Hac & Müslim, Hac, 147',
      authorOrRef: 'Buhârî, Hadis no: 1741; Müslim, Hac, Hadis no: 1218',
      certaintyLevel: 'Mütevatir / Kesin'
    },
    missions: [
      {
        id: 'm_632_1',
        title: 'Arafat Vadisi ve İnsan Hakları Bildirgesi',
        brief: 'Arafat Meydanı\'ndaki Rahmet Tepesi kaidesine yaklaş.',
        targetPosition: [0, 0, -20],
        targetLabel: 'Arafat Rahmet Tepesi',
        narrativeText: 'Peygamberimiz hutbesini bitirince parmağını semaya kaldırdı ve sordu: "Tebliğ ettim mi? Şahit oldunuz mu?" Yüz bini aşkın sahabi "Evet, şahit olduk!" diye haykırdı. Peygamberimiz: "Şahit ol ya Rab! Şahit ol ya Rab!" buyurdu.',
        subtitles: [
          { time: 0, text: '632 yılı... Arafat Vadisi ve Veda Hutbesi.' },
          { time: 4, text: '"Ey insanlar! Rabbiniz birdir, babanız birdir; üstünlük ancak takvadadır."' }
        ],
        question: 'Peygamberimizin 632 yılında Arafat\'ta yüz bini aşkın Müslümana irad ettiği evrensel insan hakları niteliğindeki hitabın adı nedir?',
        correctAnswer: 'Veda Hutbesi',
        alternativeAnswers: ['veda hutbesi', 'hutbetul veda', 'veda hutbesı', 'veda konusmasi'],
        hint1: 'Son haccında yaptığı veda konuşmasıdır.',
        hint2: '"V" harfiyle başlar.',
        thirdLevelExplanation: 'Doğru cevap "Veda Hutbesi"dir. Irkçılığı, kan davalarını ve tefeciliği ayaklar altına alan, insan haklarının ilk ve en kapsamlı evrensel bildirgesidir.',
        reinforcement: {
          instruction: 'Evrensel Eşitlik ve Adalet:',
          question: 'Veda Hutbesi\'nde insanların ırk ve renk farkı gözetilmeksizin eşit olduğunun belirtilmesi hangi ilkeyi temel alır?',
          options: ['Evrensel İnsan Onuru ve Eşitlik', 'Kabilecilik', 'Ayrımcılık', 'Üstünlük Taslama'],
          correctIndex: 0,
          reinforcementNote: 'Bütün insanlar bir tarağın dişleri gibi eşittir; üstünlük ancak ahlak ve sorumluluk bilincindedir.'
        },
        valueDiscovery: {
          valueId: 'saygi',
          recognitionQuestion: 'Bütün insanların can, mal, ırk ve haklarına dokunulmazlık tanımak hangi kök değerin temelidir?',
          recognitionOptions: ['Saygı ve Adalet', 'Ayrımcılık', 'Kibir', 'Öfke'],
          correctRecognitionIndex: 0,
          explanationPrompt: 'Farklı ırk, dil ve kültürden olan insanlara neden saygı duymalıyız?',
          explanationGuide: 'İnsan olmak başlı başına saygıya layıktır. Farklılıklar tanışmak ve zenginleşmek içindir.',
          scenarioTitle: 'Ten Rengi ve Dili Farklı Bir Arkadaş',
          scenarioQuestion: 'Farklı bir ülkeden gelen ve farklı bir dilde konuşan bir çocukla parkta karşılaştın. Ne yaparsın?',
          scenarioOptions: [
            {
              id: 'vd_1',
              text: 'Ona yabancı gözlerle bakar, yanına yaklaşmam.',
              isAppropriate: false,
              feedback: 'İnsanları dış görünüş veya kökenine göre ayırmak Veda Hutbesi\'nin ruhuna aykırıdır.'
            },
            {
              id: 'vd_2',
              text: 'Gülümseyerek el sallar, oyunuma davet eder ve sevgiyle iletişim kurarım.',
              isAppropriate: true,
              feedback: 'Harikasın! "Arabın Aceme üstünlüğü yoktur" evrensel düsturunu kalbinde yaşattın.'
            }
          ]
        }
      }
    ]
  },

  // 616 - Hz. Hamza ve Hz. Ömer'in Müslüman Olması
  {
    year: 616,
    title: 'Hz. Hamza ve Hz. Ömer\'in İslam\'ı Kabulü',
    subTitle: 'Müslümanlara Güç ve Cesaret Veren İki Kutlu İman',
    location: 'Mekke-i Mükerreme - Dârü\'l-Erkâm',
    sceneEnvironment: 'mecca',
    historicalSummary: '616 yılında Peygamberimizin kahraman amcası Hz. Hamza ve ardından adaletiyle meşhur Hz. Ömer Dârü\'l-Erkâm\'da Müslüman oldu. Hz. Ömer\'in İslam\'a girmesiyle Müslümanlar Kâbe\'de ilk kez açıktan saf tutarak namaz kıldılar.',
    historicalSource: {
      sourceName: 'İbn Hişâm, es-Sîre & İbn Sa\'d',
      authorOrRef: 'İbn Hişâm, Cilt 1, s. 291-342; et-Tabakât, Cilt 3, s. 267',
      certaintyLevel: 'Sahih / Kuvvetli'
    },
    missions: [
      {
        id: 'm_616_1',
        title: 'Dârü\'l-Erkâm\'dan Kâbe\'ye Yürüyüş',
        brief: 'Dârü\'l-Erkâm\'da yaşanan hidayet hadisesini ve adaletin gücünü incele.',
        targetPosition: [4, 0, -14],
        targetLabel: 'Dârü\'l-Erkâm ve Kâbe Avlusu',
        narrativeText: 'Hz. Ömer kız kardeşi Fâtıma\'nın evinde okunan Tâhâ Sûresi\'nin ayetlerinden derinden etkilenerek kalbi yumuşamış, Dârü\'l-Erkâm\'a giderek kelime-i şehadet getirmiştir. Peygamberimiz kendisine hak ile batılı ayıran anlamında "el-Fârûk" unvanını vermiştir.',
        subtitles: [
          { time: 0, text: '616 yılı... Hz. Hamza ve Hz. Ömer İslam ile şereflendi.' },
          { time: 4, text: 'Müslümanlar Kâbe\'de açıktan ibadet etmeye başladı.' }
        ],
        question: 'Müslüman olmasıyla İslam\'a büyük güç katan ve Peygamberimizin "el-Fârûk" (hak ile batılı ayıran) lakabını verdiği sahabi kimdir?',
        correctAnswer: 'Hz. Ömer',
        alternativeAnswers: ['ömer', 'hz ömer', 'hz. ömer', 'omer', 'hz omer', 'ömer bin hattab'],
        hint1: 'İkinci halifedir ve adaletiyle tüm dünyada tanınır.',
        hint2: '"Ö" harfiyle başlar.',
        thirdLevelExplanation: 'Doğru cevap "Hz. Ömer"dir. Onun İslam\'ı kabulü Müslümanlara büyük bir güven ve cesaret kazandırmıştır.',
        reinforcement: {
          instruction: 'Tarihsel bilgiyi pekiştiriniz:',
          question: 'Hz. Ömer\'in Müslüman olmasına vesile olan Kur\'an sûresi hangisidir?',
          options: ['Tâhâ Sûresi', 'Fil Sûresi', 'Kevser Sûresi', 'İhlas Sûresi'],
          correctIndex: 0,
          reinforcementNote: 'Kız kardeşi Hz. Fâtıma\'nın evinde okunan Tâhâ Sûresi\'nin ilk ayetleri Hz. Ömer\'in kalbini aydınlatmıştır.'
        },
        valueDiscovery: {
          valueId: 'adalet',
          recognitionQuestion: 'Hakikati gördüğünde ön yargılarını bırakıp doğrudan ve adaletten yana tavır almak hangi kök değerdir?',
          recognitionOptions: ['Adalet ve Dürüstlük', 'İnatçılık', 'Kibir', 'Bencillik'],
          correctRecognitionIndex: 0,
          explanationPrompt: 'Bir konuda yanıldığımızı anladığımızda doğruyu kabul etmek neden bir erdemdir?',
          explanationGuide: 'Adil ve erdemli insan, gerçeği öğrendiğinde hatasından dönme cesareti gösteren insandır.',
          scenarioTitle: 'Ön Yargıyı Aşmak',
          scenarioQuestion: 'Hakkında yanlış düşündüğün bir sınıf arkadaşının aslında çok dürüst ve yardımsever bir iyilik yaptığını gördün. Ne yaparsın?',
          scenarioOptions: [
            {
              id: 'om_1',
              text: 'Yanıldığımı kabul etmem, eski fikrimde ısrar ederim.',
              isAppropriate: false,
              feedback: 'Ön yargıda ısrar etmek adalete ve dürüstlüğe uymaz.'
            },
            {
              id: 'om_2',
              text: 'Ön yargımı bırakır, arkadaşımı tebrik ederek ona hak ettiği saygıyı gösteririm.',
              isAppropriate: true,
              feedback: 'Tebrikler! Hakikatin ve adaletin yanında duran erdemli bir davranış sergiledin.'
            }
          ]
        }
      }
    ]
  },

  // 619 - Boykotun Sona Ermesi
  {
    year: 619,
    title: 'Boykotun Sona Ermesi ve Özgürlüğe Kavuşma',
    subTitle: 'Üç Yıllık Ablukanın Ardından Gelen Ferahlık',
    location: 'Mekke - Şi\'b-i Ebî Tâlib',
    sceneEnvironment: 'mecca',
    historicalSummary: '619 yılında, Kureyş içerisindeki vicdan sahibi insanların da girişimiyle üç yıl süren zalimane boykot sona erdi. Kâbe duvarındaki boykot sahifesinin güve kurdu tarafından yenildiği ve sadece Allah\'ın adının kaldığı görüldü.',
    historicalSource: {
      sourceName: 'İbn Hişâm & İbn Sa\'d',
      authorOrRef: 'es-Sîre, Cilt 1, s. 375-378',
      certaintyLevel: 'Sahih / Kuvvetli'
    },
    missions: [
      {
        id: 'm_619_1',
        title: 'Boykot Sahifesinin Yırtılması',
        brief: 'Üç yıllık sabır imtihanının nasıl sona erdiğini incele.',
        targetPosition: [2, 0, -9],
        targetLabel: 'Kâbe Avlusu',
        narrativeText: 'Heksam b. Amr ve Züheyr b. Ebî Ümeyye gibi insaf sahibi Mekkeliler, "Biz yiyip içerken Haşimoğullarının açlıktan helak olmasına razı olamayız" diyerek haksız boykot belgesini geçersiz kıldılar.',
        subtitles: [
          { time: 0, text: '619 yılı... Üç yıllık boykot ve abluka sona erdi.' },
          { time: 4, text: 'Sabrın ve vicdanın sesi zulme galip geldi.' }
        ],
        question: 'Kâbe duvarına asılan boykot belgesinde güve kurdunun dokunmadığı ve sağlam kalan tek ifade hangisidir?',
        correctAnswer: 'Bismikellahümme',
        alternativeAnswers: ['bismikellahümme', 'bismikellahumme', 'allahın adı', 'allahım senin adınla', 'allah'],
        hint1: '"Allah\'ım senin adınla" anlamına gelen ibaredir.',
        hint2: '"B" harfiyle başlar.',
        thirdLevelExplanation: 'Doğru cevap "Bismikellahümme" (Allah\'ım senin adınla) ifadesidir. Zulüm maddelerinin tamamı silinmiş, yalnızca Allah\'ın adı kalmıştır.',
        reinforcement: {
          instruction: 'Sabır ve Dayanışma:',
          question: 'Haksız bir uygulamaya karşı vicdan sahibi insanların ses yükseltmesi hangi değeri yansıtır?',
          options: ['Adalet ve Yardımseverlik', 'Kayıtsızlık', 'Korku', 'Bencillik'],
          correctIndex: 0,
          reinforcementNote: 'Zulme rıza göstermemek ve mazlumun yanında durmak insanlık görevidir.'
        }
      }
    ]
  },

  // 621 - Birinci ve İkinci Akabe Biatları
  {
    year: 621,
    title: 'Akabe Biatları ve Medine\'ye Davet',
    subTitle: 'Yesrib\'den Doğan Kardeşlik ve Sadakat Sözü',
    location: 'Mekke - Akabe Mevkii',
    sceneEnvironment: 'mecca',
    historicalSummary: '621 ve 622 hac mevsimlerinde Yesrib\'den (Medine) gelen Evs ve Hazrec kabilesi mensupları Akabe vadisinde Peygamberimizle buluşarak İslam\'ı kabul ettiler. Mus\'ab b. Umeyr Medine\'ye ilk öğretmen olarak gönderildi.',
    historicalSource: {
      sourceName: 'Buhârî, Menâkıbu\'l-Ensâr & İbn Hişâm',
      authorOrRef: 'Buhârî, Hadis no: 3892; İbn Hişâm, Cilt 2, s. 36-50',
      certaintyLevel: 'Mütevatir / Kesin'
    },
    missions: [
      {
        id: 'm_621_1',
        title: 'Akabe Vadisi ve İlk İslam Öğretmeni',
        brief: 'Akabe Biatı\'nı ve Mus\'ab b. Umeyr\'in eğitim vazifesini incele.',
        targetPosition: [10, 0, -18],
        targetLabel: 'Akabe Tepesi',
        narrativeText: 'Akabe\'de Medineliler şirk koşmamak, hırsızlık yapmamak, iftira etmemek ve iyilikte Peygamberimize itaat etmek üzere söz verdiler. Peygamberimiz Kur\'an\'ı ve İslam\'ı öğretmek üzere genç sahabi Mus\'ab b. Umeyr\'i Medine\'ye muallim olarak görevlendirdi.',
        subtitles: [
          { time: 0, text: '621 yılı... Akabe\'de verilen sadakat sözü.' },
          { time: 4, text: 'Mus\'ab b. Umeyr Medine\'ye ilk öğretmen olarak gönderildi.' }
        ],
        question: 'Birinci Akabe Biatı sonrasında Medinelilere Kur\'an ve İslam\'ı öğretmek için gönderilen ilk İslam öğretmeni kimdir?',
        correctAnswer: 'Musab bin Umeyr',
        alternativeAnswers: ['musab bin umeyr', 'mus\'ab b. umeyr', 'musab', 'hz musab', 'mus\'ab bin umeyr'],
        hint1: 'Mekke\'nin en zengin ve zarif genciyken her şeyini İslam için feda eden sahabidir.',
        hint2: '"M" harfiyle başlar.',
        thirdLevelExplanation: 'Doğru cevap "Mus\'ab b. Umeyr"dir. Onun tatlı dili ve hikmetli anlatımı sayesinde bir yıl içinde Medine\'de İslam\'ın girmediği ev kalmamıştır.',
        reinforcement: {
          instruction: 'İlim ve Sorumluluk:',
          question: 'Peygamberimizin Medine\'ye komutan değil bir öğretmen (Mus\'ab b. Umeyr) göndermesi neyi gösterir?',
          options: ['İslam\'ın ilim, ikna ve eğitimle gönülleri fethettiğini', 'Askeri gücü', 'Ticareti', 'Yolculuğu'],
          correctIndex: 0,
          reinforcementNote: 'Medine\'nin fethi kılıçla değil, Kur\'an ve eğitimle gerçekleşmiştir.'
        },
        valueDiscovery: {
          valueId: 'sorumluluk',
          recognitionQuestion: 'Genç yaşta bir şehrin eğitim ve rehberlik görevini üstlenmek hangi kök değerin örneğidir?',
          recognitionOptions: ['Sorumluluk', 'Rahatlık', 'Gösteriş', 'Tembellik'],
          correctRecognitionIndex: 0,
          explanationPrompt: 'Bilgimizi arkadaşlarımızla paylaşmak neden önemli bir sorumluluktur?',
          explanationGuide: 'Bilgi paylaşıldıkça çoğalır; bildiğimizi başkalarına nezaketle öğretmek en güzel hizmettir.',
          scenarioTitle: 'Konuyu Anlamayan Arkadaşa Yardım',
          scenarioQuestion: 'Matematik dersinde senin çok iyi anladığın bir konuyu sıra arkadaşın anlamakta zorlanıyor. Ne yaparsın?',
          scenarioOptions: [
            {
              id: 'ak_1',
              text: '"Ben anladım, sen de dinleseydin" der geçerim.',
              isAppropriate: false,
              feedback: 'Bilgiyi saklamak ve kibirlenmek dostluğa ve sorumluluğa yakışmaz.'
            },
            {
              id: 'ak_2',
              text: 'Teneffüste sabırla ve güler yüzle konuyu arkadaşıma anlatarak öğrenmesine destek olurum.',
              isAppropriate: true,
              feedback: 'Harikasın! Mus\'ab b. Umeyr\'in eğitim ve paylaşım ruhunu sınıfta yaşattın.'
            }
          ]
        }
      }
    ]
  },

  // 629 - Hayber ve İslam'a Davet Mektupları
  {
    year: 629,
    title: 'İslam\'a Davet Mektupları ve Hayber',
    subTitle: 'Evrensel Çağrı ve Kaza Umresi',
    location: 'Medine & Hayber & Mekke',
    sceneEnvironment: 'madinah',
    historicalSummary: '629 yılında Peygamberimiz Bizans, İran (Kisrâ), Habeşistan ve Mısır hükümdarlarına elçiler ve davet mektupları göndererek İslam\'ın evrensel mesajını ulaştırdı. Aynı yıl Hayber fethedildi ve Hudeybiye anlaşması gereği Kaza Umresi gerçekleştirildi.',
    historicalSource: {
      sourceName: 'Buhârî, Meğâzî & Müslim',
      authorOrRef: 'Buhârî, Hadis no: 4196; Müslim, Cihâd, 74',
      certaintyLevel: 'Mütevatir / Kesin'
    },
    missions: [
      {
        id: 'm_629_1',
        title: 'Hükümdarlara Gönderilen Evrensel Mektuplar',
        brief: 'İslam\'ın barış ve tevhid çağrısının komşu ülkelere nasıl ulaştırıldığını incele.',
        targetPosition: [0, 0, -14],
        targetLabel: 'Mescid-i Nebevî Elçiler Durağı',
        narrativeText: 'Üzerinde "Muhammed Resûlullah" yazılı gümüş mühürle mühürlenen davet mektupları altı farklı elçiyle komşu imparatorluklara gönderildi. Elçiler gittikleri ülkelerin dillerini konuşuyor ve diplomatik nezaketle hareket ediyorlardı.',
        subtitles: [
          { time: 0, text: '629 yılı... İslam\'a davet mektupları komşu hükümdarlara gönderildi.' },
          { time: 4, text: 'Barış içinde Kaza Umresi eda edildi.' }
        ],
        question: 'Peygamberimizin komşu devlet hükümdarlarına gönderdiği resmi davet mektuplarını mühürlemek için kullandığı yüzükte hangi ifade yazılıydı?',
        correctAnswer: 'Muhammed Resulullah',
        alternativeAnswers: ['muhammed resulullah', 'muhammed rasulullah', 'allah resulullah muhammed'],
        hint1: 'Yukarıdan aşağıya Allah - Resûl - Muhammed kelimelerinden oluşur.',
        hint2: '"M" harfiyle başlar.',
        thirdLevelExplanation: 'Doğru cevap "Muhammed Resûlullah"tır. Bu mektuplar İslam\'ın sadece Arap yarımadasına değil tüm insanlığa gönderildiğinin tarihsel belgesidir.',
        reinforcement: {
          instruction: 'İletişim ve Diplomasi:',
          question: 'Peygamberimizin devlet başkanlarına mektup yazarken kullandığı üslup nasıldı?',
          options: ['Saygılı, açık, hikmetli ve barışa davet eden bir üslup', 'Kaba ve tehditkâr', 'Belirsiz', 'Karmaşık'],
          correctIndex: 0,
          reinforcementNote: 'İslam tebliğinde tatlı dil, saygı ve hikmet esastır.'
        }
      }
    ]
  },

  // 631 - Tebük Seferi ve Elçiler Yılı (Senetü'l-Vüfûd)
  {
    year: 631,
    title: 'Tebük Seferi ve Elçiler Yılı (Senetü\'l-Vüfûd)',
    subTitle: 'Fedakârlık Yarışı ve Kabilelerin İslam\'a Koşuşu',
    location: 'Medine-i Münevvere & Tebük',
    sceneEnvironment: 'madinah',
    historicalSummary: '631 yılında sıcak mevsimde ve kıtlık döneminde gerçekleştirilen Tebük Seferi için sahabiler büyük bir infak ve yardımlaşma seferberliği başlattı. Sefer dönüşünde Arap yarımadasının dört bir yanından gelen 70\'ten fazla kabile heyeti Medine\'ye gelerek İslam\'ı kabul etti; bu yıla "Elçiler Yılı" (Senetü\'l-Vüfûd) adı verildi.',
    historicalSource: {
      sourceName: 'İbn Hişâm & İbn Sa\'d',
      authorOrRef: 'es-Sîre, Cilt 2, s. 515-560; et-Tabakât, Cilt 1, s. 291',
      certaintyLevel: 'Mütevatir / Kesin'
    },
    missions: [
      {
        id: 'm_631_1',
        title: 'İnfak Seferberliği ve Elçilerin Kabulü',
        brief: 'Tebük hazırlığındaki yardımlaşmayı ve Elçiler Yılı\'nı incele.',
        targetPosition: [0, 0, -12],
        targetLabel: 'Mescid-i Nebevî Elçiler Sütunu',
        narrativeText: 'Hz. Ebubekir malının tamamını, Hz. Ömer yarısını, Hz. Osman ise yüzlerce deveyi donatarak "Ceyşü\'l-Usre" (Zorluk Ordusu) için bağışladı. Mescid-i Nebevî\'de gelen elçi heyetleri büyük bir misafirperverlik ve saygıyla ağırlandı.',
        subtitles: [
          { time: 0, text: '631 yılı... Elçiler Yılı (Senetü\'l-Vüfûd).' },
          { time: 4, text: 'Dört bir yandan gelen heyetler barış içinde İslam\'a girdi.' }
        ],
        question: '631 yılında Arap yarımadasının her köşesinden çok sayıda kabile heyetinin Medine\'ye gelerek Müslüman olması sebebiyle bu yıla ne ad verilmiştir?',
        correctAnswer: 'Elçiler Yılı (Senetül Vüfud)',
        alternativeAnswers: ['elçiler yılı', 'elciler yili', 'senetül vüfud', 'senetü\'l-vüfûd', 'heyetler yılı'],
        hint1: 'Gelen temsilci heyetlere "elçi" (vüfûd) denmesiyle ilgilidir.',
        hint2: '"E" harfiyle başlar.',
        thirdLevelExplanation: 'Doğru cevap "Elçiler Yılı"dır (Senetü\'l-Vüfûd). Peygamberimiz gelen her heyeti güler yüzle karşılamış, onlara ikramda bulunmuş ve öğretmenler göndermiştir.',
        reinforcement: {
          instruction: 'Cömertlik ve Misafirperverlik:',
          question: 'Zorluk zamanında elindeki imkânları toplumun iyiliği için paylaşmak hangi kök değerdir?',
          options: ['Yardımseverlik ve Vatanseverlik', 'Cimrilik', 'Korku', 'Bencillik'],
          correctIndex: 0,
          reinforcementNote: 'Zor günlerde yapılan fedakârlık ve yardımlaşma birlik ruhunu güçlendirir.'
        },
        valueDiscovery: {
          valueId: 'vatanseverlik',
          recognitionQuestion: 'Toplumun güvenliği ve huzuru için en zor şartlarda fedakârlık yapmak hangi kök değerdir?',
          recognitionOptions: ['Vatanseverlik ve Yardımseverlik', 'Rahatlık', 'Bencillik', 'İsraf'],
          correctRecognitionIndex: 0,
          explanationPrompt: 'Ülkemizin ve toplumumuzun huzuru için bir öğrenci olarak üzerimize düşen görevler nelerdir?',
          explanationGuide: 'Görevlerimizi en iyi şekilde yapmak, yardımlaşmak ve toplumsal birliği korumak vatanseverliğin gereğidir.',
          scenarioTitle: 'Afet Dayanışma Kampanyası',
          scenarioQuestion: 'Ülkemizde yaşanan bir doğal afet sonrasında okulunuzda yardım kampanyası başlatıldı. Ne yaparsın?',
          scenarioOptions: [
            {
              id: 'tb_1',
              text: 'Beni ilgilendirmez diyerek hiçbir katkıda bulunmam.',
              isAppropriate: false,
              feedback: 'Toplumun zor gününde duyarsız kalmak yardımlaşma ve vatanseverliğe uymaz.'
            },
            {
              id: 'tb_2',
              text: 'Harçlığımdan ve temiz eşyalarımdan ayırarak kampanyaya gönülden destek olur, paketlemeye yardım ederim.',
              isAppropriate: true,
              feedback: 'Tebrikler! Tebük\'teki dayanışma ve fedakârlık ruhunu çok güzel yaşattın.'
            }
          ]
        }
      }
    ]
  }
];

// Programmatic array of all 62 years from 571 to 632 (inclusive)
export const ALL_SIYER_YEARS: number[] = Array.from(
  { length: 632 - 571 + 1 },
  (_, index) => 571 + index
);

const ENVIRONMENT_IMAGES: Record<string, string> = {
  mecca: '/assets/images/menu_hero.webp',
  madinah: '/assets/images/doors_backdrop.webp',
  hira: '/assets/environment/mecca_mountain_panorama.jpg',
  sevr: '/assets/environment/pure_mountains.jpg',
  badr: '/assets/environment/desert_sand_detail.jpg',
  uhud: '/assets/environment/mountain_rock_detail.jpg',
  hudaybiyyah: '/assets/environment/courtyard_marble_detail.jpg'
};

// Build all 62 years (571-632) without fabricating or copying events into unverified years.
export function getAllYearsData(): YearData[] {
  const existingMap = new Map<number, YearData>();
  INITIAL_YEARS_DATA.forEach(y => existingMap.set(y.year, y));

  return ALL_SIYER_YEARS.map((year) => {
    const verified = existingMap.get(year);
    if (verified && verified.missions && verified.missions.length > 0) {
      const values = verified.missions
        .map(m => m.valueDiscovery?.valueId)
        .filter((v): v is any => Boolean(v));
      const img = ENVIRONMENT_IMAGES[verified.sceneEnvironment] || '/assets/images/menu_hero.webp';
      const audio = verified.missions
        .map(m => m.animationVoiceUrl)
        .filter((a): a is string => Boolean(a));

      return {
        ...verified,
        hasVerifiedContent: true,
        events: verified.missions,
        values,
        sources: [verified.historicalSource],
        images: [img],
        audio
      };
    }

    // Year without specific verified event record — do NOT invent or copy events from other years!
    const periodLabel =
      year < 610
        ? 'Peygamberlik Öncesi Mekke Dönemi (571–609)'
        : year < 622
        ? 'Mekke Risalet Dönemi (610–621)'
        : 'Medine Dönemi (622–632)';
    const location = year < 622 ? 'Mekke-i Mükerreme' : 'Medine-i Münevvere';
    const environment: 'mecca' | 'madinah' = year < 622 ? 'mecca' : 'madinah';

    return {
      year,
      hasVerifiedContent: false,
      title: `${year} Yılı`,
      subTitle: periodLabel,
      location,
      sceneEnvironment: environment,
      historicalSummary: 'Bu yıla ait doğrulanmış içerik henüz eklenmedi.',
      historicalSource: {
        sourceName: 'Doğrulanmış Kayıt Bekleniyor',
        authorOrRef: `Siyer Kronolojisi (${year})`,
        certaintyLevel: 'Tarihsel Rivayet / Temsili',
        notes: 'Bu yıla ait doğrulanmış içerik henüz eklenmedi.'
      },
      missions: [],
      events: [],
      values: [],
      sources: [],
      images: [],
      audio: []
    };
  });
}

