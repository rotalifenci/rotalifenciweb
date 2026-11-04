const fs = require('fs');

['js/app.js', '../js/app.js'].forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  // Replace grid and columns in renderHomePage
  const targetRegex = /<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-8">[\s\S]*?<!-- Sağ Görsel Kart[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/;

  const replacement = `<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center mb-8">
                    <!-- Sol Metin & Slogan -->
                    <div class="lg:col-span-6 flex flex-col items-start text-left">
                        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-black tracking-wider uppercase mb-4 shadow-2xs">
                            <i class="fa-solid fa-sparkles text-red-600 animate-pulse"></i>
                            <span>TÜRKİYE'NİN DİJİTAL FEN EĞİTİM PORTALI</span>
                        </div>

                        <h1 class="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-4">
                            Bilimi Keşfet, <br class="hidden sm:inline"/>
                            <span class="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-indigo-900">Rotanı Çiz!</span>
                        </h1>

                        <!-- Kullanıcının İstediği Tam Metin (Eğitim Ağı Formatında Vurgulu & Akıcı Sunum) -->
                        <p class="text-slate-600 text-sm sm:text-base leading-relaxed font-medium mb-6 max-w-xl">
                            <strong class="text-slate-900 font-extrabold">Rotalı Fenci;</strong> PDF ders notları, akıllı tahta sunumları, deney videoları, istasyon etkinlikleri, yeni nesil soru bankası, LGS denemeleri, 3D eğitsel oyunları ve <em class="text-indigo-900 font-bold not-italic">“Bilimin Rotasını Çizenler”</em> köşesiyle akıllı tahta, bilgisayar, tablet ve telefonlarda kesintisiz bir öğrenme deneyimi sunar.
                        </p>

                        <!-- Hızlı Eylem Butonları -->
                        <div class="flex flex-wrap items-center gap-3 mb-6">
                            <a href="#recent" class="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white text-xs sm:text-sm font-black uppercase tracking-wider transition-all shadow-md hover:-translate-y-0.5 flex items-center gap-2">
                                <i class="fa-solid fa-sparkles text-amber-300"></i> Yeni Eklenenleri Gör
                            </a>
                            <a href="#grade/grade-8" class="px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 text-xs sm:text-sm font-black uppercase tracking-wider transition-all border border-slate-300 shadow-2xs flex items-center gap-2">
                                🔴 8. Sınıf LGS Rehberi
                            </a>
                        </div>

                        <!-- Özellik Rozetleri (Checkmark Listesi) -->
                        <div class="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-200/80 text-slate-600 text-xs font-bold">
                            <span class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center gap-1.5">✓ Ünite Ders Notları</span>
                            <span class="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200/80 flex items-center gap-1.5">✓ Akıllı Tahta PPTX</span>
                            <span class="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200/80 flex items-center gap-1.5">✓ 3D Eğitsel Oyunlar</span>
                            <span class="px-2.5 py-1 rounded-lg bg-red-50 text-red-800 border border-red-200/80 flex items-center gap-1.5">✓ LGS Branş Denemeleri</span>
                        </div>
                    </div>

                    <!-- Sağ Görsel Kart (Rotalı Fenci Tanıtım Afişi - Tam Alan Kaplama & Maksimum Netlik) -->
                    <div class="lg:col-span-6 w-full flex items-center justify-center">
                        <div class="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white ring-2 ring-slate-200/90 bg-slate-950 group transition-all duration-300 hover:shadow-red-500/25 hover:scale-[1.01] cursor-pointer" onclick="window.open('assets/rotali-fenci-tanitim.jpg', '_blank')" title="Tam boy görmek için tıklayın">
                            <img src="assets/rotali-fenci-tanitim.jpg" alt="Rotalı Fenci - Rotamız Fen!" class="w-full h-auto block object-cover" style="width: 100%; display: block;" loading="eager">
                            <span class="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-black border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 pointer-events-none shadow-lg">
                                <i class="fa-solid fa-expand text-amber-400"></i> Tam Boy Gör
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </section>`;

  if (targetRegex.test(code)) {
    code = code.replace(targetRegex, replacement);
    fs.writeFileSync(filePath, code, 'utf8');
    console.log('Successfully updated hero section in:', filePath);
  } else {
    console.log('Regex did NOT match in:', filePath);
  }
});
