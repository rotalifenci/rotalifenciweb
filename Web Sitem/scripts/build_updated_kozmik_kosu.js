const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'oyunlar', 'kozmik-kosu-3d.html');
const parentPath = path.join(__dirname, '..', '..', 'oyunlar', 'kozmik-kosu-3d.html');

console.log('Reading template and injecting 50 questions, meteor mechanics, 10s timer, 2-options, and jump fixes...');

// We will read the file and replace the relevant sections cleanly.
let code = fs.readFileSync(targetPath, 'utf8');

// 1. QUESTION_BANK -> 50 Soruluk Ay'ın Evreleri Havuzu (2 Şıklı, Her Oyunda Karışık)
const poolCode = `
        // -----------------------------------------------------------------
        // 2. 50 SORULUK BİLİMSEL AY'IN EVRELERİ SORU HAVUZU (2 ŞIKLI & KARIŞIK)
        // -----------------------------------------------------------------
        const QUESTIONS_POOL_50 = [
            { q: "Ay, ışığını hangi gök cisminden alır?", ans: "Güneş", dist: "Dünya", fact: "Ay kendi ışığını üretemez; ayna gibi Güneş'ten aldığı ışığı yansıtır." },
            { q: "Ay'ın kendine ait ışığı var mıdır?", ans: "Hayır (Işık Kaynağı Değildir)", dist: "Evet (Kendi Işığı Vardır)", fact: "Ay bir ışık kaynağı değildir, sadece Güneş ışığını yansıtır." },
            { q: "Ay'ın Dünya etrafında dolanması sonucunda ne oluşur?", ans: "Ay'ın Evreleri", dist: "Mevsimler", fact: "Ay Dünya çevresinde dolandıkça Güneş ışığı alan aydınlık kısmının görünümü değişir ve evreler oluşur." },
            { q: "Ay'ın kaç ana evresi vardır?", ans: "4 Ana Evre", dist: "8 Ana Evre", fact: "Ay'ın 4 ana evresi (Yeni Ay, İlk Dördün, Dolunay, Son Dördün) ve 4 ara evresi (Hilal, Şişkin Ay) vardır." },
            { q: "Ay'ın ana evrelerinden biri hangisidir?", ans: "Dolunay (Ana Evre)", dist: "Hilal (Ara Evre)", fact: "Yeni Ay, İlk Dördün, Dolunay ve Son Dördün ana evrelerdir. Hilal ise ara evredir." },
            { q: "Ay'ın ara evrelerinden biri hangisidir?", ans: "Hilal (Ara Evre)", dist: "İlk Dördün (Ana Evre)", fact: "Hilal ve Şişkin Ay ara evre; İlk Dördün ve Son Dördün ana evredir." },
            { q: "Ay'ın Dünya'dan görünmediği evrenin adı nedir?", ans: "Yeni Ay", dist: "Dolunay", fact: "Yeni Ay evresinde Ay'ın aydınlık yüzü Güneş'e, karanlık yüzü Dünya'ya dönüktür." },
            { q: "Ay'ın tamamen aydınlık ve yuvarlak göründüğü evre hangisidir?", ans: "Dolunay", dist: "Son Dördün", fact: "Dolunay evresinde Dünya Güneş ile Ay arasındadır ve Ay tam bir daire gibi parlar." },
            { q: "Ay'ın sağ yarısının aydınlık göründüğü (D harfi) ana evre hangisidir?", ans: "İlk Dördün (D Harfi)", dist: "Son Dördün (Ters D)", fact: "İlk dördün evresinde Ay'ın sağ yarısı aydınlıktır ve düz 'D' harfine benzer." },
            { q: "Ay'ın sol yarısının aydınlık göründüğü (ters D) ana evre hangisidir?", ans: "Son Dördün (Ters D)", dist: "İlk Dördün (D Harfi)", fact: "Son dördün evresinde Ay'ın sol yarısı aydınlıktır ve ters 'D' harfine benzer." },
            { q: "Yeni ay evresinden sonra hangi ara evre görülür?", ans: "Hilal", dist: "Şişkin Ay", fact: "Yeni ay ile ilk dördün arasında ince yay biçiminde Hilal görülür." },
            { q: "İlk dördün evresinden sonra hangi ara evre görülür?", ans: "Şişkin Ay", dist: "Hilal", fact: "İlk dördün ile dolunay arasında yarısından fazlası aydınlık Şişkin Ay görülür." },
            { q: "Dolunay evresinden sonra hangi ara evre görülür?", ans: "Şişkin Ay", dist: "Yeni Ay", fact: "Dolunaydan son dördüne geçerken Ay küçülen şişkin ay evresindedir." },
            { q: "Son dördün evresinden sonra hangi ara evre görülür?", ans: "Hilal", dist: "Dolunay", fact: "Son dördünden yeni aya geçerken Ay ince bir hilal halini alır." },
            { q: "Ay'ın ince, yay şeklinde göründüğü evreye ne denir?", ans: "Hilal", dist: "Şişkin Ay", fact: "Hilal evresinde Ay gökyüzünde ince bir yay veya 'C' harfi şeklinde ışıldar." },
            { q: "Ay'ın yarısından fazlasının aydınlık göründüğü ara evre hangisidir?", ans: "Şişkin Ay", dist: "Hilal", fact: "Yarıdan fazlası aydınlık ancak tam dolunay olmayan ara evre Şişkin Ay'dır." },
            { q: "Ay'ın iki ana evresi arasında yaklaşık kaç gün vardır?", ans: "7 Gün (1 Hafta)", dist: "14 Gün (2 Hafta)", fact: "Her ana evre arasında yaklaşık 1 haftalık (7 gün) bir süre geçer." },
            { q: "Ay'ın evreleri yaklaşık kaç günde tamamlanır?", ans: "29,5 Gün (Yaklaşık 1 Ay)", dist: "365 Gün (1 Yıl)", fact: "Yeni Ay'dan bir sonraki Yeni Ay'a kadar evre döngüsü 29,5 günde tamamlanır." },
            { q: "Bir ay içinde yaklaşık kaç kez dolunay görülür?", ans: "Genellikle 1 Kez", dist: "Genellikle 4 Kez", fact: "Evre döngüsü 29,5 gün olduğu için bir takvim ayında kural olarak 1 kez dolunay yaşanır." },
            { q: "Ay'ın evrelerinin oluşmasına neden olan Ay hareketi hangisidir?", ans: "Dünya Çevresinde Dolanma", dist: "Kendi Ekseninde Dönme", fact: "Ay Dünya çevresinde dolandığı için Güneş ışığını gören kısmı farklı açılardan izlenir." },
            { q: "Yeni ay evresinden yaklaşık bir hafta sonra hangi evre görülür?", ans: "İlk Dördün", dist: "Dolunay", fact: "Yeni Ay'dan 1 hafta sonra sağ tarafı aydınlık İlk Dördün oluşur." },
            { q: "Yeni ay evresinden yaklaşık iki hafta sonra hangi evre görülür?", ans: "Dolunay", dist: "Son Dördün", fact: "Yeni Ay'dan 14 gün sonra Ay Güneş'in tam karşısına geçerek Dolunay olur." },
            { q: "Yeni ay evresinden yaklaşık üç hafta sonra hangi evre görülür?", ans: "Son Dördün", dist: "İlk Dördün", fact: "Yeni Ay ➔ İlk Dördün (1. hafta) ➔ Dolunay (2. hafta) ➔ Son Dördün (3. hafta)." },
            { q: "Dolunaydan yaklaşık bir hafta sonra hangi ana evre görülür?", ans: "Son Dördün", dist: "Yeni Ay", fact: "Dolunaydan 7 gün sonra sol tarafı aydınlık olan Son Dördün evresi gelir." },
            { q: "İlk dördünden yaklaşık bir hafta sonra hangi evre görülür?", ans: "Dolunay", dist: "Yeni Ay", fact: "İlk Dördün'den 1 hafta sonra Ay'ın aydınlık yüzü büyüyerek Dolunay'a ulaşır." },
            { q: "Son dördünden yaklaşık bir hafta sonra hangi evre görülür?", ans: "Yeni Ay", dist: "Dolunay", fact: "Son Dördün'den 1 hafta sonra döngü başa döner ve Yeni Ay oluşur." },
            { q: "İlk dördün ile dolunay arasında hangi ara evre bulunur?", ans: "Şişkin Ay", dist: "Hilal", fact: "İlk Dördün ve Dolunay arasındaki ara evre büyüyen Şişkin Ay'dır." },
            { q: "Dolunay ile son dördün arasında hangi ara evre bulunur?", ans: "Şişkin Ay", dist: "Hilal", fact: "Dolunaydan sonra Ay yavaşça küçülen Şişkin Ay evresine geçer." },
            { q: "Yeni ay ile ilk dördün arasında hangi ara evre bulunur?", ans: "Hilal", dist: "Şişkin Ay", fact: "Yeni Ay'dan hemen sonra Ay ince bir Hilal şeklinde parlamaya başlar." },
            { q: "Son dördün ile yeni ay arasında hangi ara evre bulunur?", ans: "Hilal", dist: "Şişkin Ay", fact: "Son Dördün'den Yeni Ay'a giderken gökyüzünde son olarak Hilal izlenir." },
            { q: "Ay'ın aydınlık görünen kısmının giderek büyümesine ne denir?", ans: "Büyüyen Ay", dist: "Küçülen Ay", fact: "Yeni Ay'dan Dolunay'a doğru aydınlık kısım artar, buna Büyüyen Ay denir." },
            { q: "Ay'ın aydınlık görünen kısmının giderek küçülmesine ne denir?", ans: "Küçülen Ay", dist: "Büyüyen Ay", fact: "Dolunay'dan Yeni Ay'a doğru aydınlık kısım azalır, buna Küçülen Ay denir." },
            { q: "Ay'ın hangi ana evresinde aydınlık görünen kısmı en fazladır?", ans: "Dolunay", dist: "Yeni Ay", fact: "Dolunay evresinde Ay'ın Dünya'ya bakan yüzünün tamamı (%100) aydınlıktır." },
            { q: "Ay'ın hangi ana evresinde aydınlık görünen kısmı en azdır?", ans: "Yeni Ay", dist: "Dolunay", fact: "Yeni Ay evresinde Dünya'ya bakan yüzü hiç ışık almadığı için %0 görünür." },
            { q: "İlk dördün evresinde Ay'ın görünen yüzünün ne kadarı aydınlıktır?", ans: "Yarısı (%50)", dist: "Tamamı (%100)", fact: "İlk dördünde Ay'ın sağ yarısı aydınlık görünür." },
            { q: "Son dördün evresinde Ay'ın görünen yüzünün ne kadarı aydınlıktır?", ans: "Yarısı (%50)", dist: "Çeyreği (%25)", fact: "Son dördünde Ay'ın sol yarısı aydınlık görünür." },
            { q: "Ay'ın evreleri Dünya'nın gölgesinden mi kaynaklanır?", ans: "Hayır (Gölgeden Değildir)", dist: "Evet (Dünya Gölgesidir)", fact: "Büyük kavram yanılgısı! Evreler gölge değil, Ay dolanırken bakış açımızın değişmesidir." },
            { q: "Ay'ın evreleri Dünya'nın hangi hareketi nedeniyle oluşmaz?", ans: "Dünya'nın Kendi Ekseninde Dönmesi", dist: "Dünya'nın Güneş Çevresinde Dolanması", fact: "Dünya'nın kendi ekseninde dönmesi gece-gündüzü oluşturur, Ay evrelerine etkisi yoktur." },
            { q: "Dünya'nın kuzey kutbu üzerinden bakıldığında Ay'ın dolanma yönü nedir?", ans: "Saat Yönünün Tersi", dist: "Saat Yönünde", fact: "Güneş, Dünya ve Ay'ın dönme ve dolanma yönleri saat yönünün tersinedir (Batıdan Doğuya)." },
            { q: "Ay'ın dört ana evresi arasında toplam kaç ara evre geçişi bulunur?", ans: "4 (İki Hilal, İki Şişkin Ay)", dist: "2 (Sadece İki Hilal)", fact: "Ana evreler arasında iki hilal ve iki şişkin ay olmak üzere 4 ara evre yer alır." },
            { q: "Güneş, Ay ve Dünya aynı doğrultudayken Ay'ın hangi iki evresi oluşur?", ans: "Yeni Ay ve Dolunay", dist: "İlk Dördün ve Son Dördün", fact: "Aynı doğrultuda Yeni Ay ve Dolunay; dik açıda ise Dördünler oluşur." },
            { q: "Yeni ay evresinde Ay, Dünya ile Güneş'in neresinde bulunur?", ans: "Güneş ile Dünya'nın Arasında", dist: "Dünya'nın Arkasında", fact: "Güneş ➔ Ay ➔ Dünya dizilimi Yeni Ay evresini oluşturur." },
            { q: "Dolunay evresinde Dünya, hangi iki gök cisminin yaklaşık arasında bulunur?", ans: "Güneş ve Ay'ın Arasında", dist: "Ay ve Mars'ın Arasında", fact: "Güneş ➔ Dünya ➔ Ay diziliminde Ay tamamen aydınlanır (Dolunay)." },
            { q: "Ay'ın Dünya'ya dönük yüzünün tamamına yakınının aydınlık olduğu evre hangisidir?", ans: "Dolunay", dist: "Yeni Ay", fact: "Dünya'ya dönük küre yüzeyinin tamamı Güneş ışığıyla parlar." },
            { q: "İlk dördün evresinden dört gün sonra Ay hangi ara evrede olabilir?", ans: "Şişkin Ay", dist: "Hilal", fact: "İlk dördünden sonra Ay dolunaya doğru büyür ve şişkin ay evresindedir." },
            { q: "Dolunaydan dört gün sonra Ay hangi ara evrede olabilir?", ans: "Şişkin Ay", dist: "Hilal", fact: "Dolunaydan sonra Ay son dördüne doğru küçülürken yine şişkin aydır." },
            { q: "Ay'ın aydınlık görünen kısmı artarken dolunaydan hemen önce hangi evre yaşanır?", ans: "Şişkin Ay", dist: "Hilal", fact: "Dolunaydan önceki son ara evre büyüyen Şişkin Ay'dır." },
            { q: "Ay'ın aydınlık görünen kısmı azalırken yeni aydan hemen önce hangi evre yaşanır?", ans: "Hilal", dist: "Şişkin Ay", fact: "Yeni Ay'dan önceki son ara evre küçülen Hilal'dir." },
            { q: "Ay neden Dünya'nın her yerinden aynı anda gözlemlenemez?", ans: "Dünya'nın Küresel Şekli ve Dönmesi", dist: "Ay'ın Işığının Yetersiz Olması", fact: "Dünya küreseldir ve döner; bir taraf gündüz iken diğer taraf geceyi yaşar." },
            { q: "Ay'ın dolanma süresi ile evre döngüsünün süresi aynı mıdır?", ans: "Hayır (27,3 Gün ve 29,5 Gün)", dist: "Evet (Her İkisi de 30 Gün)", fact: "Dünya da Güneş etrafında ilerlediği için evre döngüsü (29.5 gün) dolanma süresinden (27.3 gün) biraz uzundur." }
        ];

        function shuffleArray(arr) {
            const copy = [...arr];
            for (let i = copy.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [copy[i], copy[j]] = [copy[j], copy[i]];
            }
            return copy;
        }
`;

// Replace QUESTION_BANK definition
const qBankRegex = /\/\/\s*2\.\s*50 SORULUK BİLİMSEL SORU HAVUZU[\s\S]*?const QUESTION_BANK\s*=\s*\{[\s\S]*?\};\n/;
code = code.replace(qBankRegex, poolCode);

// 2. Update HTML Question Card (Full interactive modal with 10s countdown bar and 2 Options A & B)
const oldHudRegex = /<!-- ❓ 3D BİLİMSEL SORU VE GEÇİT BİLGİ KARTI[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
const newHudCode = `<!-- ❓ 3D BİLİMSEL SORU KARTI (10 Saniyelik Bekleme & 2 Şıklı Seçenek A - B) -->
        <div id="question-hud" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md transition-all duration-300 opacity-0 pointer-events-none">
            <div class="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-cyan-400/90 p-4 sm:p-6 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.5)] text-white transform transition-transform duration-300 scale-95" id="question-card-inner">
                
                <!-- Üst Bilgi Başlığı ve 10sn Geri Sayım Sayacı -->
                <div class="flex items-center justify-between border-b border-cyan-500/30 pb-3 mb-3">
                    <div class="flex items-center gap-2">
                        <span class="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 text-slate-950 flex items-center justify-center font-black text-sm shadow-md">
                            <i class="fa-solid fa-moon"></i>
                        </span>
                        <div>
                            <span class="text-[10px] font-orbitron tracking-wider text-cyan-300 font-extrabold uppercase block">AY'IN EVRELERİ SORU GEÇİDİ</span>
                            <span class="text-[9px] text-slate-400 font-semibold" id="question-level-badge">5. Sınıf Fen Bilimleri • 1. Ünite</span>
                        </div>
                    </div>

                    <!-- 10 Saniyelik Canlı Geri Sayım Rozeti -->
                    <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950 border border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                        <i class="fa-solid fa-stopwatch text-amber-400 text-xs animate-pulse"></i>
                        <span id="question-timer-text" class="text-xs sm:text-sm font-black font-mono text-amber-300">10.0s</span>
                    </div>
                </div>

                <!-- 10sn Süre İlerleme Çubuğu -->
                <div class="w-full bg-slate-800 rounded-full h-2 mb-4 overflow-hidden border border-slate-700/50">
                    <div id="question-timer-bar" class="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-emerald-400 transition-all duration-100" style="width: 100%;"></div>
                </div>

                <!-- Soru Metni -->
                <h3 class="text-sm sm:text-base md:text-lg font-black text-white text-center leading-snug mb-5 px-1 min-h-[50px] flex items-center justify-center" id="question-text">
                    Soru metni yükleniyor...
                </h3>

                <!-- 2 Şıklı Cevap Butonları (A ve B) -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <!-- ŞIK A -->
                    <button type="button" id="btn-option-a" onclick="handleQuestionAnswerChoice(0)" class="group p-3.5 sm:p-4 rounded-2xl bg-slate-950/90 hover:bg-cyan-950/80 border-2 border-cyan-500/50 hover:border-cyan-400 text-left transition-all duration-200 shadow-lg active:scale-95 flex items-center gap-3 cursor-pointer">
                        <span class="w-9 h-9 rounded-xl bg-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-slate-950 border border-cyan-400 text-cyan-300 font-orbitron font-black text-sm flex items-center justify-center shrink-0 transition-colors">
                            A
                        </span>
                        <div class="flex-1 min-w-0">
                            <span class="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-white leading-tight block" id="option-a-text">Seçenek A</span>
                            <span class="text-[9px] text-cyan-400/80 font-mono mt-0.5 block hidden sm:block">[ Klavye: A / 1 / ◀ ]</span>
                        </div>
                    </button>

                    <!-- ŞIK B -->
                    <button type="button" id="btn-option-b" onclick="handleQuestionAnswerChoice(1)" class="group p-3.5 sm:p-4 rounded-2xl bg-slate-950/90 hover:bg-amber-950/80 border-2 border-amber-500/50 hover:border-amber-400 text-left transition-all duration-200 shadow-lg active:scale-95 flex items-center gap-3 cursor-pointer">
                        <span class="w-9 h-9 rounded-xl bg-amber-500/20 group-hover:bg-amber-500 group-hover:text-slate-950 border border-amber-400 text-amber-300 font-orbitron font-black text-sm flex items-center justify-center shrink-0 transition-colors">
                            B
                        </span>
                        <div class="flex-1 min-w-0">
                            <span class="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-white leading-tight block" id="option-b-text">Seçenek B</span>
                            <span class="text-[9px] text-amber-400/80 font-mono mt-0.5 block hidden sm:block">[ Klavye: B / 2 / ▶ ]</span>
                        </div>
                    </button>
                </div>

                <!-- Bilimsel Açıklama / Anında İpucu Kutusu (Cevaplandıktan sonra görünür) -->
                <div id="question-fact-box" class="hidden p-3 rounded-xl bg-slate-950/90 border border-slate-700 text-xs font-medium text-slate-200 leading-relaxed text-center">
                    <span id="question-fact-content">Bilimsel açıklama</span>
                </div>
            </div>
        </div>`;

code = code.replace(oldHudRegex, newHudCode);

fs.writeFileSync(targetPath, code, 'utf8');
console.log('Successfully wrote step 1 of updated kozmik-kosu-3d.html');
