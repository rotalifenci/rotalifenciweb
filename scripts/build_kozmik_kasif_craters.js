// scripts/build_kozmik_kasif_craters.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'oyunlar', 'kozmik-kasif-3d.html');
let html = fs.readFileSync(filePath, 'utf8');

console.log('Original file read successfully, length:', html.length);

// 1. Definition of the 20 Moon Craters with user's 20 questions and short answers
const MOON_CRATERS_DATA = [
    {
        id: 1,
        name: "Tycho Krateri",
        desc: "Ay'ın güneyindeki dev ışınsal krater",
        x: 0,
        z: -24,
        r: 7.5,
        depth: 3.2,
        rim: 0.95,
        color: 0x38bdf8,
        shortAns: "Evet.",
        q: {
            category: "AY'IN YAPISI VE ÖZELLİKLERİ • 1. ÜNİTE",
            title: "1. Tycho Krateri: Ay'ın Uyduluk Durumu",
            body: "Ay, Dünya’mızın doğal uydusu mudur?",
            options: [
                { text: "Evet, Dünya'nın tek doğal uydusudur.", correct: true },
                { text: "Hayır, Ay insan yapımı yapay bir uydudur.", correct: false },
                { text: "Hayır, Ay doğrudan Güneş'in uydusudur.", correct: false },
                { text: "Hayır, Ay bağımsız bir cüce gezegendir.", correct: false }
            ],
            explanation: "Tebrikler! Ay, Dünya'mızın tek doğal uydusudur ve Dünya etrafındaki dolanımını yaklaşık 27,3 günde tamamlar."
        }
    },
    {
        id: 2,
        name: "Copernicus Krateri",
        desc: "Fırtınalar Okyanusu'ndaki görkemli ışınsal krater",
        x: -24,
        z: -14,
        r: 8.0,
        depth: 3.4,
        rim: 1.0,
        color: 0x06b6d4,
        shortAns: "Küre.",
        q: {
            category: "AY'IN YAPISI VE ÖZELLİKLERİ • 1. ÜNİTE",
            title: "2. Copernicus Krateri: Ay'ın Geometrik Şekli",
            body: "Ay’ın şekli hangi geometrik şekle benzer?",
            options: [
                { text: "Küre", correct: true },
                { text: "Düz disk / Daire", correct: false },
                { text: "Silindir", correct: false },
                { text: "Üçgen prizma", correct: false }
            ],
            explanation: "Harika! Ay'ın şekli tıpkı Dünya ve Güneş gibi küreye benzer. Kendi kütle çekimi sayesinde yuvarlak küresel bir biçim almıştır."
        }
    },
    {
        id: 3,
        name: "Kepler Krateri",
        desc: "Ay'ın en parlak ışın demetlerine sahip krateri",
        x: -38,
        z: -4,
        r: 6.2,
        depth: 2.8,
        rim: 0.85,
        color: 0xf59e0b,
        shortAns: "Hayır.",
        q: {
            category: "AY'IN YAPISI VE ÖZELLİKLERİ • 1. ÜNİTE",
            title: "3. Kepler Krateri: Işık Kaynağı Özelliği",
            body: "Ay, kendi ışığını üretir mi?",
            options: [
                { text: "Hayır, kendi ışığını üretmez.", correct: true },
                { text: "Evet, yüzeyindeki sıcak lavlarla ışık saçar.", correct: false },
                { text: "Evet, çekirdeğinde nükleer füzyon yaparak parlar.", correct: false },
                { text: "Evet, Ay kendi ışığını üreten bir yıldızdır.", correct: false }
            ],
            explanation: "Doğru! Ay bir ışık kaynağı değildir; aydınlatılmış bir gök cismidir. Tıpkı bir ayna gibi Güneş'ten üzerine gelen ışığı yansıtır."
        }
    },
    {
        id: 4,
        name: "Aristarchus Krateri",
        desc: "Ay yüzeyinin en yüksek yansıtıcılığına sahip tepe",
        x: -42,
        z: 22,
        r: 6.5,
        depth: 2.9,
        rim: 0.9,
        color: 0xa855f7,
        shortAns: "Güneş’ten aldığı ışığı yansıtması.",
        q: {
            category: "AY'IN YAPISI VE ÖZELLİKLERİ • 1. ÜNİTE",
            title: "4. Aristarchus Krateri: Ay'ın Gece Parlaması",
            body: "Ay’ın gece gökyüzünde parlak görünmesinin nedeni nedir?",
            options: [
                { text: "Güneş’ten aldığı ışığı yansıtması", correct: true },
                { text: "Kendi nükleer enerjisini uzaya yayması", correct: false },
                { text: "Dünya'nın yapay şehir ışıklarını yansıtması", correct: false },
                { text: "Yüzeyindeki gazların alev alarak yanması", correct: false }
            ],
            explanation: "Tebrikler! Güneş ışınları Ay yüzeyindeki kayaçlara ve açık renkli regolitle çarpıp Dünya'mıza yansır. Geceleri gördüğümüz parlaklık Güneş'in yansıyan ışığıdır."
        }
    },
    {
        id: 5,
        name: "Clavius Krateri",
        desc: "Ay'ın en büyük ve en derin güney havzalarından biri",
        x: 18,
        z: -42,
        r: 9.5,
        depth: 3.8,
        rim: 1.15,
        color: 0xec4899,
        shortAns: "Krater.",
        q: {
            category: "AY'IN YAPISI VE ÖZELLİKLERİ • 1. ÜNİTE",
            title: "5. Clavius Krateri: Yüzeydeki Çukurlar",
            body: "Ay’ın yüzeyinde bulunan irili ufaklı devasa çukurlara ne ad verilir?",
            options: [
                { text: "Krater", correct: true },
                { text: "Kanyon", correct: false },
                { text: "Obruk", correct: false },
                { text: "Fiyort", correct: false }
            ],
            explanation: "Süper! Ay yüzeyindeki gök taşı çarpmalarıyla oluşan derin dairesel çukurlara 'krater' denir."
        }
    },
    {
        id: 6,
        name: "Plato Krateri",
        desc: "Karanlık düz lav tabanlı dairesel krater",
        x: -12,
        z: 44,
        r: 7.2,
        depth: 2.7,
        rim: 0.8,
        color: 0x10b981,
        shortAns: "Gök taşlarının çarpmasıyla.",
        q: {
            category: "AY'IN YAPISI VE ÖZELLİKLERİ • 1. ÜNİTE",
            title: "6. Plato Krateri: Kraterlerin Oluşumu",
            body: "Ay’ın yüzeyindeki kraterler nasıl oluşmuştur?",
            options: [
                { text: "Gök taşlarının (meteorların) yüksek hızla yüzeye çarpmasıyla", correct: true },
                { text: "Şiddetli rüzgârların ve yağmurların toprağı oymasıyla", correct: false },
                { text: "Ay yüzeyindeki okyanus dalgalarının aşındırmasıyla", correct: false },
                { text: "Ay'ın aşırı soğuktan büzülüp çatlamasıyla", correct: false }
            ],
            explanation: "Doğru! Ay'da koruyucu kalın bir atmosfer olmadığı için uzayda dolaşan meteorlar sürtünmeyle yanmadan doğrudan yüzeye çarparak kraterleri açar."
        }
    },
    {
        id: 7,
        name: "Archimedes Krateri",
        desc: "Yağmurlar Denizi içindeki geniş düz tabanlı krater",
        x: -8,
        z: 22,
        r: 6.8,
        depth: 2.8,
        rim: 0.85,
        color: 0x3b82f6,
        shortAns: "Gök taşı çarpmaları ve kayaların parçalanmasıyla.",
        q: {
            category: "AY'IN YAPISI VE ÖZELLİKLERİ • 1. ÜNİTE",
            title: "7. Archimedes Krateri: Ay Toprağı ve Toz Örtüsü",
            body: "Ay’ın yüzeyi neden toz ve kayalarla (regolit) kaplıdır?",
            options: [
                { text: "Gök taşı çarpmaları ve kayaların parçalanmasıyla", correct: true },
                { text: "Dünya'dan esen fırtınaların kum taşımasıyla", correct: false },
                { text: "Ay'daki bitki örtüsünün kuruyup çürümesiyle", correct: false },
                { text: "Ay'da dev rüzgar fırtınalarının kayaları ufalamasıyla", correct: false }
            ],
            explanation: "Harika! Milyarlarca yıl boyunca durmaksızın çarpan mikrometeoritler ve gök taşları Ay kayalarını un ufak ederek 'regolit' adı verilen ince toz örtüsünü oluşturmuştur."
        }
    },
    {
        id: 8,
        name: "Eratosthenes Krateri",
        desc: "Apennin Dağları silsilesinin ucundaki derin krater",
        x: 14,
        z: 14,
        r: 6.4,
        depth: 2.9,
        rim: 0.9,
        color: 0x14b8a6,
        shortAns: "Hayır.",
        q: {
            category: "AY'IN YAPISI VE ÖZELLİKLERİ • 1. ÜNİTE",
            title: "8. Eratosthenes Krateri: Hava Olayları",
            body: "Ay’da Dünya’daki gibi yağmur, rüzgâr ve fırtına görülür mü?",
            options: [
                { text: "Hayır, hiçbir hava olayı görülmez.", correct: true },
                { text: "Evet, sadece kış aylarında kar yağar.", correct: false },
                { text: "Evet, kraterlerin içinde sis ve yağmur oluşur.", correct: false },
                { text: "Evet, Ay'da her gün hafif rüzgâr eser.", correct: false }
            ],
            explanation: "Mükemmel! Ay'da kalın bir atmosfer ve su döngüsü olmadığı için yağmur, rüzgâr, kar veya fırtına gibi hava olayları kesinlikle yaşanmaz."
        }
    },
    {
        id: 9,
        name: "Theophilus Krateri",
        desc: "Merkezi zirvesiyle ünlü belirgin dağlık krater",
        x: 28,
        z: -10,
        r: 7.4,
        depth: 3.1,
        rim: 0.95,
        color: 0x8b5cf6,
        shortAns: "Çok ince bir gaz tabakası vardır; Dünya’daki gibi bir atmosferi yoktur.",
        q: {
            category: "AY'IN YAPISI VE ÖZELLİKLERİ • 1. ÜNİTE",
            title: "9. Theophilus Krateri: Ay'ın Atmosfer Durumu",
            body: "Ay’ın atmosferi var mıdır?",
            options: [
                { text: "Çok ince bir gaz tabakası vardır; Dünya’daki gibi bir atmosferi yoktur.", correct: true },
                { text: "Evet, Dünya'daki ile tamamen aynı kalınlıkta oksijenli atmosferi vardır.", correct: false },
                { text: "Evet, Dünya atmosferinden 10 kat daha yoğundur.", correct: false },
                { text: "Atmosferi tamamen saf su buharından oluşur.", correct: false }
            ],
            explanation: "Tebrikler! Ay'ın kütle çekimi küçük olduğu için gazları tutamaz. Yok denecek kadar incecik bir ekzosfer (gaz tabakası) vardır, Dünya gibi nefes alınabilir veya koruyucu bir atmosferi yoktur."
        }
    },
    {
        id: 10,
        name: "Langrenus Krateri",
        desc: "Bereket Denizi doğusundaki ışınsal krater",
        x: 48,
        z: -18,
        r: 7.6,
        depth: 3.0,
        rim: 0.9,
        color: 0xf97316,
        shortAns: "Isıyı dengeleyecek belirgin bir atmosferinin olmaması.",
        q: {
            category: "AY'IN YAPISI VE ÖZELLİKLERİ • 1. ÜNİTE",
            title: "10. Langrenus Krateri: Aşırı Sıcaklık Farkları",
            body: "Ay’ın yüzeyindeki gündüz (+120 °C) ve gece (-170 °C) sıcaklık farklarının bu kadar fazla olmasının temel nedeni nedir?",
            options: [
                { text: "Isıyı dengeleyecek belirgin bir atmosferinin olmaması", correct: true },
                { text: "Ay'ın Dünya etrafında çok yavaş dolanması", correct: false },
                { text: "Güneş'in Ay'a Dünya'dan çok daha yakın olması", correct: false },
                { text: "Ay yüzeyinin tamamen metalik aynalarla kaplı olması", correct: false }
            ],
            explanation: "Doğru! Dünya'mızdaki atmosfer sera etkisiyle ısıyı dengeler. Ay'da atmosfer olmadığı için Güneş ışığını doğrudan alan yerler aşırı sıcak (+120°C), gölgede kalan yerler ise dondurucu soğuk (-170°C) olur."
        }
    },
    {
        id: 11,
        name: "Ptolemaeus Krateri",
        desc: "Ay'ın merkezine yakın dev düz tabanlı antik halka",
        x: 6,
        z: -8,
        r: 8.4,
        depth: 3.0,
        rim: 0.85,
        color: 0x0ea5e9,
        shortAns: "Sıvı suyun ve solunabilir havanın bulunmaması, aşırı sıcaklık koşulları.",
        q: {
            category: "AY'IN YAPISI VE ÖZELLİKLERİ • 1. ÜNİTE",
            title: "11. Ptolemaeus Krateri: Yaşam Koşulları",
            body: "Ay’da doğal olarak yaşam için gerekli koşullar neden uygun değildir?",
            options: [
                { text: "Sıvı suyun ve solunabilir havanın bulunmaması, aşırı sıcaklık koşulları", correct: true },
                { text: "Yalnızca yer çekiminin Dünya'dan 10 kat fazla olması", correct: false },
                { text: "Ay toprağında minerallerin bulunmaması", correct: false },
                { text: "Ay'ın Güneş ışığını hiç alamaması", correct: false }
            ],
            explanation: "Harika! Canlıların hayatta kalabilmesi için sıvı su, solunabilir oksijenli hava ve ılıman sıcaklık şarttır. Ay'da bunlar olmadığı için özel uzay giysisi ve yaşam desteği olmadan yaşanamaz."
        }
    },
    {
        id: 12,
        name: "Gassendi Krateri",
        desc: "Nem Denizi'nin kuzey kıyısındaki antik krater",
        x: -36,
        z: -30,
        r: 7.2,
        depth: 2.8,
        rim: 0.85,
        color: 0xeab308,
        shortAns: "Rüzgâr ve yağmurun olmaması.",
        q: {
            category: "AY'IN YAPISI VE ÖZELLİKLERİ • 1. ÜNİTE",
            title: "12. Gassendi Krateri: Ayak İzlerinin Korunması",
            body: "Ay’ın yüzeyindeki astronot ayak izleri neden milyonlarca yıl bozulmadan kalabilir?",
            options: [
                { text: "Rüzgâr ve yağmurun (hava olaylarının) olmaması", correct: true },
                { text: "Ay toprağının anında çimento gibi donması", correct: false },
                { text: "Astronotların ayak izlerine kimyasal vernik sıkması", correct: false },
                { text: "Ay'ın kütle çekiminin Dünya'dan çok daha güçlü olması", correct: false }
            ],
            explanation: "Tebrikler! Yeryüzünde ayak izlerini rüzgâr, sel ve yağmur kısa sürede siler. Ay'da rüzgâr ve yağış olmadığı için 1969'daki Apollo ayak izleri ilk günkü gibi durmaktadır."
        }
    },
    {
        id: 13,
        name: "Stevinus Krateri",
        desc: "Güneydoğu tepelerindeki parlak ışınlı krater",
        x: 36,
        z: -36,
        r: 6.2,
        depth: 2.7,
        rim: 0.8,
        color: 0x6366f1,
        shortAns: "Dünya.",
        q: {
            category: "AY'IN YAPISI VE ÖZELLİKLERİ • 1. ÜNİTE",
            title: "13. Stevinus Krateri: Boyut Karşılaştırması",
            body: "Ay mı yoksa Dünya mı daha büyüktür?",
            options: [
                { text: "Dünya, Ay'dan çok daha büyüktür.", correct: true },
                { text: "Ay, Dünya'dan daha büyüktür.", correct: false },
                { text: "İkisi de tamamen eşit büyüklüktedir.", correct: false },
                { text: "Gündüz Dünya, gece Ay daha büyüktür.", correct: false }
            ],
            explanation: "Doğru! Dünya'mız Ay'dan katbekat büyüktür. Hacim olarak yaklaşık 64 tane Ay bir araya gelirse ancak bir Dünya büyüklüğüne ulaşabilir!"
        }
    },
    {
        id: 14,
        name: "Grimaldi Krateri",
        desc: "Batı ufkundaki devasa koyu renkli havza",
        x: -54,
        z: 2,
        r: 8.0,
        depth: 2.9,
        rim: 0.9,
        color: 0xd946ef,
        shortAns: "Yaklaşık dörtte biri.",
        q: {
            category: "AY'IN YAPISI VE ÖZELLİKLERİ • 1. ÜNİTE",
            title: "14. Grimaldi Krateri: Çap Oranı",
            body: "Ay’ın çapı Dünya’nın çapının yaklaşık kaçta biridir?",
            options: [
                { text: "Yaklaşık 1/4'ü (Dörtte biri)", correct: true },
                { text: "Yaklaşık 1/2'si (Yarısı)", correct: false },
                { text: "Yaklaşık 1/10'u (Onda biri)", correct: false },
                { text: "Yaklaşık 1/100'ü (Yüzde biri)", correct: false }
            ],
            explanation: "Harika matematik ve fen bilgisi! Ay'ın çapı yaklaşık 3.474 km, Dünya'nın çapı ise yaklaşık 12.742 km'dir. Yani Ay'ın çapı Dünya çapının yaklaşık 4'te 1'i kadardır."
        }
    },
    {
        id: 15,
        name: "Posidonius Krateri",
        desc: "Huzur Denizi ile Durgunluk Denizi sınırındaki krater",
        x: 24,
        z: 32,
        r: 7.0,
        depth: 2.8,
        rim: 0.85,
        color: 0x065f46,
        shortAns: "Ay denizleri.",
        q: {
            category: "AY'IN YAPISI VE ÖZELLİKLERİ • 1. ÜNİTE",
            title: "15. Posidonius Krateri: Koyu Düzlükler",
            body: "Ay yüzeyinde Dünya'dan bakıldığında koyu renkli görülen geniş düzlüklere ne ad verilir?",
            options: [
                { text: "Ay denizleri (Mare)", correct: true },
                { text: "Ay okyanusları (Sıvı tuzlu su)", correct: false },
                { text: "Buzul gölleri", correct: false },
                { text: "Ormanlık çayırlar", correct: false }
            ],
            explanation: "Süper! Eski gökbilimciler bu koyu bölgeleri deniz sanarak Latince deniz anlamına gelen 'Mare' (Ay Denizi) demiştir. Aslında su içermez; milyarlarca yıl önce soğumuş bazalt lav ovalarıdır."
        }
    },
    {
        id: 16,
        name: "Byrgius Krateri",
        desc: "Güneybatı sıradağları eteğindeki ışınsal krater",
        x: -50,
        z: -32,
        r: 6.0,
        depth: 2.6,
        rim: 0.75,
        color: 0x84cc16,
        shortAns: "Evet.",
        q: {
            category: "AY'IN YAPISI VE ÖZELLİKLERİ • 1. ÜNİTE",
            title: "16. Byrgius Krateri: Dağlar ve Vadiler",
            body: "Ay’ın yüzeyinde dağlar ve vadiler bulunur mu?",
            options: [
                { text: "Evet, yüksek sıradağlar ve derin vadiler bulunur.", correct: true },
                { text: "Hayır, Ay pürüzsüz düz bir bilardo topu gibidir.", correct: false },
                { text: "Hayır, Ay yüzeyinde sadece kum tepeleri vardır.", correct: false },
                { text: "Sadece buz dağları bulunur, taşlık dağlar yoktur.", correct: false }
            ],
            explanation: "Doğru! Ay yüzeyi oldukça engebelidir; Dünya'daki Alpler veya Everest kadar yüksek Apennin dağları ve 'rille' adı verilen kanyon ve vadiler bulunur."
        }
    },
    {
        id: 17,
        name: "Bullialdus Krateri",
        desc: "Bulutlar Denizi ortasındaki görkemli krater",
        x: -20,
        z: -46,
        r: 6.7,
        depth: 2.9,
        rim: 0.85,
        color: 0xf43f5e,
        shortAns: "Neil Armstrong.",
        q: {
            category: "AY'IN YAPISI VE ÖZELLİKLERİ • 1. ÜNİTE",
            title: "17. Bullialdus Krateri: İlk Ay Astronotu",
            body: "Ay’a ilk ayak basan astronotun adı nedir?",
            options: [
                { text: "Neil Armstrong", correct: true },
                { text: "Yuri Gagarin", correct: false },
                { text: "Galileo Galilei", correct: false },
                { text: "Isaac Newton", correct: false }
            ],
            explanation: "Harika! 20 Temmuz 1969'da Apollo 11 göreviyle astronot Neil Armstrong Ay'a ilk ayak basan insan olmuştur: 'Benim için küçük, insanlık için dev bir adım!'"
        }
    },
    {
        id: 18,
        name: "Manilius Krateri",
        desc: "Buhar Denizi kıyısındaki parlak dairesel krater",
        x: 10,
        z: 36,
        r: 5.8,
        depth: 2.5,
        rim: 0.75,
        color: 0xca8a04,
        shortAns: "1969.",
        q: {
            category: "AY'IN YAPISI VE ÖZELLİKLERİ • 1. ÜNİTE",
            title: "18. Manilius Krateri: Ay'a İlk İniş Yılı",
            body: "İnsanlar Ay’a ilk kez hangi yılda ayak basmıştır?",
            options: [
                { text: "1969", correct: true },
                { text: "1923", correct: false },
                { text: "2000", correct: false },
                { text: "1850", correct: false }
            ],
            explanation: "Tebrikler! Apollo 11 görevi 1969 yılında başarıyla gerçekleşmiş ve insanoğlu ilk kez Dünya dışındaki bir gök cismine ayak basmıştır."
        }
    },
    {
        id: 19,
        name: "Menelaus Krateri",
        desc: "Huzur Denizi güney yamacındaki krater",
        x: 32,
        z: 18,
        r: 5.8,
        depth: 2.6,
        rim: 0.8,
        color: 0x475569,
        shortAns: "Daha azdır (yaklaşık 1/6'sı kadardır).",
        q: {
            category: "AY'IN YAPISI VE ÖZELLİKLERİ • 1. ÜNİTE",
            title: "19. Menelaus Krateri: Yer Çekimi Karşılaştırması",
            body: "Ay’da yer çekimi Dünya’ya göre daha mı azdır, daha mı fazladır?",
            options: [
                { text: "Daha azdır; Dünya yer çekiminin yaklaşık 1/6'sı kadardır.", correct: true },
                { text: "Daha fazladır; Dünya yer çekiminin 6 katıdır.", correct: false },
                { text: "Dünya ile tamamen aynıdır, hiçbir fark yoktur.", correct: false },
                { text: "Ay'da sıfırdır; hiçbir kütle çekim kuvveti yoktur.", correct: false }
            ],
            explanation: "Mükemmel! Ay'ın kütlesi Dünya'dan küçük olduğu için kütle çekimi Dünya'nın yaklaşık altıda biri (1/6) kadardır. Bu yüzden Ay'da çok yükseklere zıplanabilir!"
        }
    },
    {
        id: 20,
        name: "Censorinus Krateri",
        desc: "Sessizlik Denizi kenarındaki parlak beyaz krater",
        x: 44,
        z: 6,
        r: 5.5,
        depth: 2.5,
        rim: 0.75,
        color: 0x0284c7,
        shortAns: "Hava olaylarının ve erozyonun olmaması.",
        q: {
            category: "AY'IN YAPISI VE ÖZELLİKLERİ • 1. ÜNİTE",
            title: "20. Censorinus Krateri: Kraterlerin Korunması",
            body: "Ay’ın yüzeyindeki kraterlerin milyarlarca yıldır bozulmadan korunmasının temel nedeni nedir?",
            options: [
                { text: "Hava olaylarının (rüzgâr, yağmur) ve erozyonun olmaması", correct: true },
                { text: "Kraterlerin cam bir fanusla kapatılmış olması", correct: false },
                { text: "Güneş ışınlarının kraterleri sürekli onarması", correct: false },
                { text: "Ay'ın Dünya etrafında dolanması", correct: false }
            ],
            explanation: "Şampiyon! Dünya'da oluşan kraterler rüzgâr, su ve bitki örtüsüyle aşınarak silinir. Ay'da ise erozyon ve hava olayları olmadığı için kraterler ilk günkü gibi korunur."
        }
    }
];

// Load existing missions 4-10 raw array
const existingOtherMissions = require('./missions_4_to_10_raw.js');
console.log('Loaded other missions count:', existingOtherMissions.length);

// Renumber other missions: 4..10 -> 21..27
const renumberedOtherMissions = existingOtherMissions.map((m, idx) => {
    return {
        ...m,
        id: 21 + idx
    };
});

// Construct missions 1-20 from MOON_CRATERS_DATA
const moonMissions = MOON_CRATERS_DATA.map(c => {
    return {
        id: c.id,
        station: 'moon',
        title: c.name,
        shortDesc: `${c.desc} • Spektrometre ile keşfet.`,
        targetPos: { x: c.x, z: c.z },
        shortAns: c.shortAns,
        questionPool: [c.q]
    };
});

const ALL_MISSIONS = [...moonMissions, ...renumberedOtherMissions];
console.log('Total combined missions:', ALL_MISSIONS.length);

// 2. Prepare code replacements

// Replace MISSIONS definition in html
// Find where MISSIONS begins and ends
const missionsStartIdx = html.indexOf('const MISSIONS = [');
if (missionsStartIdx === -1) {
    throw new Error('Could not find const MISSIONS = [ in html');
}
const missionsEndSearch = '];\n\n        /* -------------------------------------------------------------';
const missionsEndSearchCRLF = '];\r\n\r\n        /* -------------------------------------------------------------';
let missionsEndIdx = html.indexOf(missionsEndSearchCRLF, missionsStartIdx);
if (missionsEndIdx === -1) {
    missionsEndIdx = html.indexOf(missionsEndSearch, missionsStartIdx);
    if (missionsEndIdx === -1) {
        throw new Error('Could not find end of MISSIONS in html');
    }
}

// Generate Javascript code for MOON_CRATERS and ALL_MISSIONS
const moonCratersCode = `        const MOON_CRATERS = ${JSON.stringify(MOON_CRATERS_DATA, null, 12)};\n\n`;
const allMissionsCode = `        const MISSIONS = ${JSON.stringify(ALL_MISSIONS, null, 12)};`;

// Replace the missions section
html = html.slice(0, missionsStartIdx) + moonCratersCode + allMissionsCode + html.slice(missionsEndIdx + 2);
console.log('Replaced MOON_CRATERS and MISSIONS block.');

// 3. Insert `getMoonTerrainHeight(px, pz)` function before `function buildMoonStation()`
const heightFuncCode = `
        function getMoonTerrainHeight(px, pz) {
            let py = Math.sin(px * 0.08) * Math.cos(pz * 0.08) * 0.8;
            for (let i = 0; i < MOON_CRATERS.length; i++) {
                const c = MOON_CRATERS[i];
                const d = Math.hypot(px - c.x, pz - c.z);
                if (d < c.r) {
                    const factor = Math.cos((d / c.r) * Math.PI * 0.5);
                    py -= factor * c.depth;
                    if (d > c.r * 0.65) {
                        const rimFactor = Math.sin(((d - c.r * 0.65) / (c.r * 0.35)) * Math.PI);
                        py += rimFactor * c.rim;
                    }
                } else if (d < c.r * 1.35) {
                    const outerFactor = Math.sin(((c.r * 1.35 - d) / (c.r * 0.35)) * Math.PI * 0.5);
                    py += outerFactor * (c.rim * 0.5);
                }
            }
            return py;
        }
`;

if (!html.includes('function getMoonTerrainHeight(')) {
    html = html.replace('function buildMoonStation() {', heightFuncCode + '\n        function buildMoonStation() {');
    console.log('Injected getMoonTerrainHeight function.');
}

// 4. Update buildMoonStation to carve 20 craters with PlaneGeometry(160, 160, 140, 140) and spawn 20 beacons
// Find the terrain loop inside buildMoonStation
const oldTerrainGeoMatch = /const terrainGeo = new THREE\.PlaneGeometry\(160, 160, \d+, \d+\);[\s\S]*?terrainGeo\.computeVertexNormals\(\);/;
const newTerrainGeoCode = `const terrainGeo = new THREE.PlaneGeometry(160, 160, 140, 140);
            terrainGeo.rotateX(-Math.PI / 2);

            const pos = terrainGeo.attributes.position;
            // Carve all 20 distinct craters into the 3D Moon surface
            for (let i = 0; i < pos.count; i++) {
                const px = pos.getX(i);
                const pz = pos.getZ(i);
                const py = getMoonTerrainHeight(px, pz);
                pos.setY(i, py);
            }
            terrainGeo.computeVertexNormals();`;

if (oldTerrainGeoMatch.test(html)) {
    html = html.replace(oldTerrainGeoMatch, newTerrainGeoCode);
    console.log('Updated terrain mesh and 20-crater procedural height loop.');
} else {
    console.warn('Could not match oldTerrainGeoMatch!');
}

// Replace the 3 hardcoded createMissionBeacon calls with looping over all 20 craters
const oldBeaconsRegex = /createMissionBeacon\(1,[\s\S]*?createMissionBeacon\(3, 20, 18, "Gölge\/Güneş Termal Sensörü", 0xec4899\);/;
const newBeaconsCode = `// Build Target Mission Beacons for all 20 Moon Craters
            MOON_CRATERS.forEach(c => {
                createMissionBeacon(c.id, c.x, c.z, c.name, c.color);
            });`;

if (oldBeaconsRegex.test(html)) {
    html = html.replace(oldBeaconsRegex, newBeaconsCode);
    console.log('Updated createMissionBeacon calls to spawn 20 beacons.');
} else {
    console.warn('Could not match oldBeaconsRegex!');
}

// 5. Update createMissionBeacon to position vertically at getMoonTerrainHeight
const oldCreateBeaconHead = /function createMissionBeacon\(id, x, z, label, colorHex\) \{\s*const beaconGroup = new THREE\.Group\(\);\s*beaconGroup\.position\.set\(x, 0\.1, z\);/;
const newCreateBeaconHead = `function createMissionBeacon(id, x, z, label, colorHex) {
            const beaconGroup = new THREE.Group();
            const groundY = (typeof getMoonTerrainHeight === 'function') ? getMoonTerrainHeight(x, z) : 0;
            beaconGroup.position.set(x, groundY + 0.1, z);`;

if (oldCreateBeaconHead.test(html)) {
    html = html.replace(oldCreateBeaconHead, newCreateBeaconHead);
    console.log('Updated createMissionBeacon elevation.');
} else {
    console.warn('Could not match oldCreateBeaconHead!');
}

// Also ensure pillar in beaconGroup.userData
html = html.replace(
    'beaconGroup.userData = { id, x, z, label, gem, ring };',
    'beaconGroup.userData = { id, x, z, label, gem, ring, pillar };'
);

// 6. Update updateRoverPhysics()
// Update groundY calculation to use getMoonTerrainHeight
const oldGroundYRegex = /const groundY = 0\.4 \+ Math\.sin\(rover\.pos\.x \* 0\.08\) \* Math\.cos\(rover\.pos\.z \* 0\.08\) \* 0\.8;/;
const newGroundYCode = `const groundY = 0.4 + getMoonTerrainHeight(rover.pos.x, rover.pos.z);`;

if (oldGroundYRegex.test(html)) {
    html = html.replace(oldGroundYRegex, newGroundYCode);
    console.log('Updated rover physics groundY to use getMoonTerrainHeight.');
} else {
    console.warn('Could not match oldGroundYRegex!');
}

// Update thermometer HUD and nearest crater HUD in updateRoverPhysics
const oldTempRegex = /\/\/ Update Thermometer HUD based on position[\s\S]*?tempBarEl\.style\.width = '90%';\s*\}/;
const newTempCode = `// Update Thermometer HUD & Nearest Crater HUD based on all 20 craters
            const tempValEl = document.getElementById('moon-temp-val');
            const tempBarEl = document.getElementById('moon-temp-bar');
            let inShadowCrater = false;
            let nearestCraterName = "";
            let nearestDist = 999999;

            for (let i = 0; i < MOON_CRATERS.length; i++) {
                const c = MOON_CRATERS[i];
                const d = Math.hypot(rover.pos.x - c.x, rover.pos.z - c.z);
                if (d < nearestDist) {
                    nearestDist = d;
                    nearestCraterName = c.name;
                }
                if (d < c.r * 0.75) {
                    inShadowCrater = true;
                }
            }

            if (inShadowCrater) {
                tempValEl.innerText = '-170 °C (GÖLGE)';
                tempValEl.className = 'font-orbitron font-bold text-sky-400';
                tempBarEl.style.width = '10%';
            } else {
                tempValEl.innerText = '+120 °C (AYDINLIK)';
                tempValEl.className = 'font-orbitron font-bold text-rose-400';
                tempBarEl.style.width = '90%';
            }

            const craterHudEl = document.getElementById('nearest-crater-hud');
            if (craterHudEl) {
                craterHudEl.innerText = \`En Yakın: \${nearestCraterName} (\${Math.round(nearestDist)}m)\`;
            }`;

if (oldTempRegex.test(html)) {
    html = html.replace(oldTempRegex, newTempCode);
    console.log('Updated thermometer and nearest crater HUD logic.');
} else {
    console.warn('Could not match oldTempRegex!');
}

// 7. Update checkBeaconProximity() to show status (Done vs New) and dynamic prompt
const oldBeaconProxRegex = /function checkBeaconProximity\(\) \{[\s\S]*?delete promptEl\.dataset\.beaconId;\s*\}\s*\}/;
const newBeaconProxCode = `function checkBeaconProximity() {
            let foundBeacon = null;
            let minDist = 9999;
            moonTargetBeacons.forEach(b => {
                const dist = Math.hypot(rover.pos.x - b.userData.x, rover.pos.z - b.userData.z);
                if (dist < 4.5 && dist < minDist) {
                    minDist = dist;
                    foundBeacon = b.userData;
                }
            });

            const promptEl = document.getElementById('center-interaction-prompt');
            const actionText = document.getElementById('prompt-action-text');
            const btnText = document.getElementById('prompt-btn-text');

            if (foundBeacon) {
                promptEl.classList.remove('hidden');
                const isDone = completedMissions.has(foundBeacon.id);
                actionText.innerText = isDone ? \`✅ \${foundBeacon.label} Keşfedildi!\` : \`📍 \${foundBeacon.label} Bölgesindesin!\`;
                btnText.innerText = isDone ? \`Bilgileri Tekrar İncele (\${foundBeacon.label})\` : \`Lazer Spektrometre İle İncele (\${foundBeacon.label})\`;
                promptEl.dataset.beaconId = foundBeacon.id;
            } else {
                promptEl.classList.add('hidden');
                delete promptEl.dataset.beaconId;
            }
        }`;

if (oldBeaconProxRegex.test(html)) {
    html = html.replace(oldBeaconProxRegex, newBeaconProxCode);
    console.log('Updated checkBeaconProximity.');
} else {
    console.warn('Could not match oldBeaconProxRegex!');
}

// 8. Update handleAnswer to show short answer and turn beacon green
const oldHandleAnswerRegex = /function handleAnswer\(selectedOpt, mission\) \{[\s\S]*?feedbackEl\.innerHTML = `❌ <strong>Tekrar Dene!<\/strong> İpucu: Fen kurallarını ve ünite kazanımlarını hatırla\.`;\s*\}\s*\}/;
const newHandleAnswerCode = `function handleAnswer(selectedOpt, mission) {
            const feedbackEl = document.getElementById('q-feedback');
            feedbackEl.classList.remove('hidden');

            const expl = (currentActiveQuestion && currentActiveQuestion.explanation) || (mission.question && mission.question.explanation) || "";
            const shortAns = (currentActiveQuestion && currentActiveQuestion.shortAns) || mission.shortAns || "";

            if (selectedOpt.correct) {
                playSound('correct');
                feedbackEl.className = "p-3 rounded-xl text-xs font-semibold leading-relaxed bg-emerald-950 border border-emerald-500 text-emerald-300 animate-fadeIn";
                let feedbackHtml = \`✅ <strong>Doğru Cevap!</strong>\`;
                if (shortAns) {
                    feedbackHtml += \` <div class="mt-1 text-amber-300 font-bold text-sm">Cevap: \${shortAns}</div>\`;
                }
                feedbackHtml += \` <div class="mt-1 text-slate-200">\${expl}</div>\`;
                feedbackEl.innerHTML = feedbackHtml;

                if (!completedMissions.has(mission.id)) {
                    completedMissions.add(mission.id);
                    playerScore += 100;
                    confetti({ particleCount: 50, spread: 60 });
                    updateStats();

                    // Turn corresponding 3D beacon emerald green
                    const beaconObj = moonTargetBeacons.find(b => b.userData.id === mission.id);
                    if (beaconObj) {
                        if (beaconObj.userData.gem) {
                            beaconObj.userData.gem.material.color.setHex(0x10b981);
                            beaconObj.userData.gem.material.emissive.setHex(0x10b981);
                        }
                        if (beaconObj.userData.ring) {
                            beaconObj.userData.ring.material.color.setHex(0x10b981);
                        }
                        if (beaconObj.userData.pillar) {
                            beaconObj.userData.pillar.material.color.setHex(0x10b981);
                        }
                    }
                }
            } else {
                playSound('wrong');
                feedbackEl.className = "p-3 rounded-xl text-xs font-semibold leading-relaxed bg-rose-950 border border-rose-500 text-rose-300 animate-fadeIn";
                feedbackEl.innerHTML = \`❌ <strong>Tekrar Dene!</strong> İpucu: Fen kurallarını ve ünite kazanımlarını hatırla.\`;
            }
        }`;

if (oldHandleAnswerRegex.test(html)) {
    html = html.replace(oldHandleAnswerRegex, newHandleAnswerCode);
    console.log('Updated handleAnswer function.');
} else {
    console.warn('Could not match oldHandleAnswerRegex!');
}

// 9. Update openQuestionModal to show completed status banner if done
const oldOpenQModalHead = `            document.getElementById('q-category-tag').innerText = q.category;
            document.getElementById('q-title').innerText = q.title;
            document.getElementById('q-body').innerText = q.body;`;

const newOpenQModalHead = `            document.getElementById('q-category-tag').innerText = q.category;
            document.getElementById('q-title').innerText = q.title;
            
            const isCompleted = completedMissions.has(mission.id);
            const shortAns = q.shortAns || mission.shortAns || "";
            let bodyContent = q.body;
            if (isCompleted && shortAns) {
                bodyContent = \`<div class="mb-2 p-2 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center justify-between">
                    <span><i class="fa-solid fa-circle-check text-emerald-400"></i> Bu Krater Keşfedildi!</span>
                    <span class="text-amber-300 font-bold">Cevap: \${shortAns}</span>
                </div>\` + bodyContent;
            }
            document.getElementById('q-body').innerHTML = bodyContent;`;

if (html.includes(oldOpenQModalHead)) {
    html = html.replace(oldOpenQModalHead, newOpenQModalHead);
    console.log('Updated openQuestionModal header with completed status.');
} else {
    console.warn('Could not find oldOpenQModalHead!');
}

// 10. Update callers of openQuestionModal
html = html.replace('openQuestionModal(4); // Mission 4: Güneş Lekeleri', 'openQuestionModal(21); // Mission 21: Güneş Lekeleri');
html = html.replace('openQuestionModal(6); // Mission 6: Güneş Çekirdeği', 'openQuestionModal(23); // Mission 23: Güneş Çekirdeği');
html = html.replace('openQuestionModal(5); // Mission 5: Galileo ve Dönme Yönü', 'openQuestionModal(22); // Mission 22: Galileo ve Dönme Yönü');
html = html.replace("if (phaseName === 'ilkdordun') openQuestionModal(7);", "if (phaseName === 'ilkdordun') openQuestionModal(24);");
html = html.replace("if (phaseName === 'sondordun' || phaseName === 'dolunay') openQuestionModal(8);", "if (phaseName === 'sondordun' || phaseName === 'dolunay') openQuestionModal(25);");
html = html.replace("if (phaseName === 'yeniay') openQuestionModal(9);", "if (phaseName === 'yeniay') openQuestionModal(26);");
html = html.replace('openQuestionModal(10); // Mission 10: Boyut ve Ölçek', 'openQuestionModal(27); // Mission 27: Boyut ve Ölçek');

console.log('Updated openQuestionModal call references.');

// 11. Update updateStats()
const oldUpdateStatsRegex = /function updateStats\(\) \{[\s\S]*?certBtn\.classList\.add\('animate-bounce'\);\s*\}\s*\}/;
const newUpdateStatsCode = `function updateStats() {
            const count = completedMissions.size;
            const total = MISSIONS.length;
            document.getElementById('mission-counter').innerText = \`\${count}/\${total}\`;
            document.getElementById('modal-completed-count').innerText = count;
            document.getElementById('score-counter').innerText = playerScore;

            // Count Moon craters completed (IDs 1-20)
            let moonCompleted = 0;
            completedMissions.forEach(id => {
                if (id <= 20) moonCompleted++;
            });
            const craterCounterEl = document.getElementById('crater-discovery-count');
            if (craterCounterEl) {
                craterCounterEl.innerText = \`\${moonCompleted}/20\`;
            }

            // Ranks
            let rank = "Kozmik Çaylak";
            if (count >= 27) rank = "Baş Kozmoloji Kâşifi 🏆";
            else if (count >= 20) rank = "Ay Jeolojisi Baş Komutanı 🌙";
            else if (count >= 15) rank = "Kozmik Araştırmacı 🚀";
            else if (count >= 10) rank = "Güneş Sistemi Kâşifi ☀️";
            else if (count >= 5) rank = "Ay Kâşifi 🌟";
            document.getElementById('player-rank').innerText = rank;

            // Enable Certificate Button if all 20 Moon craters completed or 20+ missions done
            const certBtn = document.getElementById('btn-open-cert');
            if (count >= 20) {
                certBtn.classList.remove('opacity-50', 'pointer-events-none');
                certBtn.classList.add('animate-bounce');
            }
        }`;

if (oldUpdateStatsRegex.test(html)) {
    html = html.replace(oldUpdateStatsRegex, newUpdateStatsCode);
    console.log('Updated updateStats function.');
} else {
    console.warn('Could not match oldUpdateStatsRegex!');
}

// 12. Update HTML HUD
// 12.1 Header mission counter
html = html.replace(
    '<span id="mission-counter" class="font-orbitron font-black text-amber-400">0/10</span>',
    '<span id="mission-counter" class="font-orbitron font-black text-amber-400">0/27</span>'
);

// 12.2 Widget Moon: add crater discovery counter & nearest crater HUD
const oldWidgetMoonContent = `<div class="text-[9px] text-slate-500 text-center leading-tight">
                    *Hava olayları görülmez, ayak izleri silinmez!
                </div>
            </div>`;

const newWidgetMoonContent = `<div class="text-[9px] text-slate-500 text-center leading-tight">
                    *Hava olayları görülmez, ayak izleri silinmez!
                </div>
                <div class="flex items-center justify-between text-[11px] font-bold text-amber-300 pt-1.5 border-t border-slate-800">
                    <span><i class="fa-solid fa-bullseye text-cyan-400"></i> Krater Keşfi:</span>
                    <span id="crater-discovery-count" class="font-orbitron font-bold text-amber-300">0/20</span>
                </div>
                <div id="nearest-crater-hud" class="text-[9px] text-cyan-300 font-medium truncate text-center bg-slate-900/80 rounded-lg py-0.5 px-1 border border-cyan-500/20">
                    En Yakın: Tycho Krateri (24m)
                </div>
            </div>`;

if (html.includes(oldWidgetMoonContent)) {
    html = html.replace(oldWidgetMoonContent, newWidgetMoonContent);
    console.log('Added crater discovery counter and nearest crater HUD to widget-moon.');
} else {
    console.warn('Could not find oldWidgetMoonContent!');
}

// 12.3 Update Moon Station radio title and body
html = html.replace(
    `titleEl.innerHTML = '<i class="fa-solid fa-compass text-cyan-400"></i> Ay Yüzeyi Görevi: Ayak İzi ve Krater';
                bodyEl.innerText = "Rover'ı kullanarak sarı işaretli Apollo Ayak İzi veya Krater bölgesine sür. Lazer Spektrometre ile tara!";`,
    `titleEl.innerHTML = '<i class="fa-solid fa-compass text-cyan-400"></i> Ay Yüzeyi Görevi: 20 Krater Keşfi ve Fen Bilimleri';
                bodyEl.innerText = "Rover'ı sürerek yüzeydeki 20 krateri keşfet. Işık sütunlarına yaklaş ve Spektrometre ile 20 soruyu yanıtla!";`
);

// Save updated html
fs.writeFileSync(filePath, html, 'utf8');
console.log('Updated oyunlar/kozmik-kasif-3d.html successfully, new size:', html.length);
