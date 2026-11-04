export interface TestQuestion {
  id: number;
  dimension: 'siyer' | 'values';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const PRE_TEST_QUESTIONS: TestQuestion[] = [
  {
    id: 1,
    dimension: 'siyer',
    question: 'Hz. Muhammed (s.a.v.) hangi yılda ve hangi şehirde dünyaya gelmiştir?',
    options: ['571 - Mekke', '622 - Medine', '610 - Taif', '632 - Kudüs'],
    correctIndex: 0,
    explanation: 'Peygamberimiz miladi 571 yılında Mekke\'de dünyaya gelmiştir.'
  },
  {
    id: 2,
    dimension: 'siyer',
    question: 'Hz. Muhammed\'e (s.a.v.) peygamberlik öncesinde doğruluğu ve güvenilirliği sebebiyle Mekkeliler hangi unvanı vermiştir?',
    options: ['el-Emîn (Muhammedü\'l-Emîn)', 'el-Fatih', 'Seyfullah', 'el-Adil'],
    correctIndex: 0,
    explanation: 'Mekkeliler Peygamberimize "en güvenilir kişi" manasına gelen "el-Emîn" lakabını vermişlerdir.'
  },
  {
    id: 3,
    dimension: 'siyer',
    question: 'İlk vahiy hangi dağda ve hangi mağarada nazil olmuştur?',
    options: ['Nur Dağı - Hira Mağarası', 'Sevr Dağı - Sevr Mağarası', 'Uhud Dağı', 'Cudi Dağı'],
    correctIndex: 0,
    explanation: 'İlk vahiy 610 yılında Nur Dağı\'ndaki Hira Mağarası\'nda Alak Sûresi\'nin ilk beş ayetiyle inmiştir.'
  },
  {
    id: 4,
    dimension: 'siyer',
    question: 'Müslümanların Mekke\'den Medine\'ye gerçekleştirdikleri tarihi göçe ne ad verilir?',
    options: ['Hicret', 'Miraç', 'Gazve', 'Biat'],
    correctIndex: 0,
    explanation: '622 yılında gerçekleşen bu kutlu göçe "Hicret" denir.'
  },
  {
    id: 5,
    dimension: 'siyer',
    question: 'Peygamberimizin 632 yılında Arafat\'ta yüz bini aşkın Müslümana irad ettiği evrensel insan hakları bildirisi niteliğindeki hitap hangisidir?',
    options: ['Veda Hutbesi', 'Medine Vesikası', 'Hudeybiye Barışı', 'Akabe Biatı'],
    correctIndex: 0,
    explanation: '632 yılında irad edilen Veda Hutbesi evrensel insan hakları prensiplerini içerir.'
  },
  {
    id: 6,
    dimension: 'values',
    question: 'Mekke\'de haksızlığa uğrayan mazlum tüccarların hakkını zorbaya karşı aramak için kurulan Hilfü\'l-Fudûl topluluğu en çok hangi kök değeri temsil eder?',
    options: ['Adalet', 'Tasarruf', 'Hız', 'Rekabet'],
    correctIndex: 0,
    explanation: 'Mazluma hakkını teslim etmek adaletin en temel göstergesidir.'
  },
  {
    id: 7,
    dimension: 'values',
    question: 'Medineli Müslümanların (Ensar) evlerini ve tarlalarını hiçbir karşılık beklemeden Mekkeli Muhacirlerle paylaşması hangi kök değerin örneğidir?',
    options: ['Yardımseverlik', 'Öfke', 'Gösteriş', 'Tembellik'],
    correctIndex: 0,
    explanation: 'İhtiyaç sahipleriyle elindeki imkânları paylaşmak yardımseverlik ve cömertlik erdemidir.'
  },
  {
    id: 8,
    dimension: 'values',
    question: 'Uhud Savaşı\'nda okçuların tepeyi terk etmeyip verilen emre sadık kalmaları gerekirdi. Bu durum hangi kök değerle en yakından ilişkilidir?',
    options: ['Öz Denetim ve Sorumluluk', 'Mizah', 'Müsriflik', 'Kibir'],
    correctIndex: 0,
    explanation: 'Kurallara uymak ve anlık isteklerine gem vurmak öz denetim erdemidir.'
  },
  {
    id: 9,
    dimension: 'values',
    question: 'Peygamberimizin Tâif\'te kendisini taşlayan insanlara beddua etmek yerine onların hidayeti için dua etmesi hangi kök değeri ifade eder?',
    options: ['Sevgi ve Merhamet', 'İntikam', 'Korku', 'Zayıflık'],
    correctIndex: 0,
    explanation: 'Affedebilmek ve düşmanının bile iyiliğini istemek en yüce merhamet ve sevgi ahlakıdır.'
  },
  {
    id: 10,
    dimension: 'values',
    question: 'Hz. Ebubekir\'in Sevr Mağarası\'nda ve bütün tehlikeli yolculukta Peygamberimizi yalnız bırakmaması hangi kök değeri simgeler?',
    options: ['Sadık Dostluk', 'Bencillik', 'Çıkarcılık', 'Gurur'],
    correctIndex: 0,
    explanation: 'Zor zamanda arkadaşının yanında dimdik durmak sadık dostluktur.'
  }
];

export const POST_TEST_QUESTIONS: TestQuestion[] = [
  {
    id: 1,
    dimension: 'siyer',
    question: '571 yılında Kâbe\'yi fillerle yıkmak isteyen Yemen valisi Ebrehe ordusunu helak eden kuşlara ne ad verilir?',
    options: ['Ebâbîl Kuşları', 'Turnalar', 'Hüdhüd', 'Karasinekler'],
    correctIndex: 0,
    explanation: 'Fil Sûresi\'nde bildirildiği üzere Kâbe\'yi koruyan kuşlar Ebâbîl kuşlarıdır.'
  },
  {
    id: 2,
    dimension: 'siyer',
    question: 'Kâbe tamiratında Hacerülesved taşının yerine konulması krizini bütün kabileleri birleştirerek çözen olay hangisidir?',
    options: ['Kâbe Hakemliği', 'Ficar Savaşı', 'Bedir Gazvesi', 'Mekke Fethi'],
    correctIndex: 0,
    explanation: 'Peygamberimiz hırkasıyla taşı ortaklaşa taşıtarak Kâbe Hakemliği yapmıştır.'
  },
  {
    id: 3,
    dimension: 'siyer',
    question: 'Müslümanların Medine\'de müşriklerle yaptıkları ilk büyük meydan savaşı hangisidir?',
    options: ['Bedir Gazvesi (624)', 'Uhud Gazvesi', 'Hendek Gazvesi', 'Tebük Seferi'],
    correctIndex: 0,
    explanation: '624 yılında yapılan Bedir Gazvesi İslam tarihinin ilk büyük zaferidir.'
  },
  {
    id: 4,
    dimension: 'siyer',
    question: 'Mekke\'nin fethi günü (630) Peygamberimizin kendisine yıllarca zulmeden Mekkelilere karşı tutumu ne olmuştur?',
    options: ['Genel Af ilan etmiş ve hepsini bağışlamıştır', 'Hepsini hapsetmiştir', 'Mallarını müsadere etmiştir', 'Şehirden sürmüştür'],
    correctIndex: 0,
    explanation: '"Bugün size bir kınama yoktur, serbestsiniz" diyerek Genel Af ilan etmiştir.'
  },
  {
    id: 5,
    dimension: 'siyer',
    question: 'Hendek Savaşı\'nda şehrin etrafına savunma amaçlı hendek kazılması fikrini Peygamberimize sunan sahabi kimdir?',
    options: ['Selmân-ı Fârisî', 'Hz. Ali', 'Hz. Ömer', 'Bilal-i Habeşi'],
    correctIndex: 0,
    explanation: 'İranlı sahabi Selmân-ı Fârisî\'nin istişaredeki teklifi uygulanmıştır.'
  },
  {
    id: 6,
    dimension: 'values',
    question: 'Veda Hutbesi\'nde "Arabın Aceme, Acemin Araba üstünlüğü yoktur" denilerek hangi temel değer vurgulanmıştır?',
    options: ['Adalet ve İnsan Onuruna Saygı', 'Kabilecilik', 'Ayrımcılık', 'Üstünlük taslama'],
    correctIndex: 0,
    explanation: 'Bütün insanların eşit yaratıldığını ve ırk ayrımının reddedildiğini ilan eder.'
  },
  {
    id: 7,
    dimension: 'values',
    question: 'Müşriklerin acımasız Şi\'b-i Ebî Tâlib boykotu altında üç yıl boyunca açlık ve yokluğa karşı inancından taviz vermeyen Müslümanların hali hangi değeri öğretir?',
    options: ['Sabır', 'Müsriflik', 'Kibir', 'Öfke'],
    correctIndex: 0,
    explanation: 'Zorluklara karşı metanet ve inançla direnmek sabrın zirvesidir.'
  },
  {
    id: 8,
    dimension: 'values',
    question: 'Hz. Hatice\'nin Peygamberimiz ilk vahiyden sonra titreyerek eve geldiğinde ona güven vermesi ve yanında durması hangi değeri yansıtır?',
    options: ['Sevgi ve Vefa', 'Kıskançlık', 'Korku', 'Çıkarcılık'],
    correctIndex: 0,
    explanation: 'Zor zamanlarda eşe ve dosta güven verip yanında olmak sevgi ve vefadır.'
  },
  {
    id: 9,
    dimension: 'values',
    question: 'Peygamberimizin henüz gençken ailesine yük olmamak için çobanlık yapıp emeğiyle geçinmesi hangi değeri gösterir?',
    options: ['Sorumluluk', 'Tembellik', 'Makam sevgisi', 'Hırs'],
    correctIndex: 0,
    explanation: 'Kendi rızkını emekle kazanmak bireysel sorumluluk bilincidir.'
  },
  {
    id: 10,
    dimension: 'values',
    question: 'Bir kimsenin ticaret yaparken malının kusurunu gizlememesi ve tartıyı tam yapması hangi kök değerin gereğidir?',
    options: ['Dürüstlük', 'Kurnazlık', 'Gösteriş', 'Tasarruf'],
    correctIndex: 0,
    explanation: 'Muhammedü\'l-Emîn ahlakının temeli her durumda dürüst olmaktır.'
  }
];
