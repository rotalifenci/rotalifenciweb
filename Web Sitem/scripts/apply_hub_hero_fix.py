import os

target_files = ['js/app.js', '../js/app.js']

hero_markup = '''            <!-- 🌟 1. ÜNİTE ÖNE ÇIKAN BAŞYAPIT OYUNU (UZAY EKSPRESİ) -->
            ${normSubTab === 'egitsel-oyunlar' && (gNum === "6" || gNum === "7") ? `
            <div class="relative bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 border-2 border-amber-400/90 rounded-3xl p-5 sm:p-7 lg:p-8 mb-6 shadow-2xl overflow-hidden text-white group hover:border-amber-400 transition-all">
                <div class="absolute -right-16 -bottom-16 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
                <div class="absolute -left-16 -top-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
                
                <div class="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-5 lg:gap-8">
                    <div class="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5">
                        <div class="relative shrink-0">
                            <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-1 bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-300 shadow-[0_0_35px_rgba(245,158,11,0.5)] flex items-center justify-center transform group-hover:scale-105 transition-transform overflow-hidden">
                                <img src="assets/rotali-uzay-ekspresi.jpg" alt="Rotalı Fenci - Uzay Ekspresi" class="w-full h-full object-cover rounded-[22px] bg-slate-900" onerror="this.src='rotali-fenci-logo.png'">
                            </div>
                            <span class="absolute -bottom-2 -right-2 px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black uppercase rounded-lg shadow font-mono">
                                🚂 3D TREN
                            </span>
                        </div>

                        <div class="max-w-xl">
                            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                                <span class="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-[11px] font-black tracking-wider uppercase flex items-center gap-1.5">
                                    <i class="fa-solid fa-trophy text-amber-400"></i> 1. ÜNİTE BAŞYAPIT OYUNU
                                </span>
                                <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-400/30">
                                    ✓ Maarif Modeli & Akıllı Tahta Uyumlu
                                </span>
                            </div>
                            <h4 class="text-2xl sm:text-3xl font-black font-orbitron tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-400 mb-2">
                                ${gNum === "7" ? "Rotalı Fenci - Uzay Ekspresi: Güneş Sistemi ve Ötesi" : "Rotalı Fenci - Uzay Ekspresi: Güneş Sistemi Keşfi"}
                            </h4>
                            <p class="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium mb-3">
                                ${gNum === "7" 
                                    ? "Uzay boşluğunda kuantum raylarında koş! Uzay araştırmalarını, gök adaları, bulutsuları, yıldızları ve kara delikleri keşfet, 140 soruluk Türkiye Yüzyılı Maarif Modeli bilgi kapılarından doğru geçerek rekor kır!"
                                    : "Uzay boşluğunda ilerleyen yüksek teknolojili Bilim Treni'nin kuantum raylarında koş! NASA dokulu gezegenleri keşfet, meteor ve uydu enkazlarından kaç, Türkiye Yüzyılı Maarif Modeli bilgi kapılarından doğru geçerek rekor kır!"}
                            </p>
                            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] font-bold text-slate-300">
                                <span class="px-2.5 py-1 rounded-xl bg-white/10 border border-white/10 flex items-center gap-1">
                                    ${gNum === "7" ? "🌌 Güneş Sistemi & Ötesi" : "🪐 8 Gezegen (İç & Dış)"}
                                </span>
                                <span class="px-2.5 py-1 rounded-xl bg-white/10 border border-white/10 flex items-center gap-1">
                                    ${gNum === "7" ? "🛰️ Uzay Teknolojileri & ISS" : "🚆 3 Şeritli Bilim Treni"}
                                </span>
                                <span class="px-2.5 py-1 rounded-xl bg-white/10 border border-white/10 flex items-center gap-1">
                                    ${gNum === "7" ? "🚪 140 Maarif Bilgi Kapısı" : "🚪 Maarif Modeli Kapıları"}
                                </span>
                                <span class="px-2.5 py-1 rounded-xl bg-white/10 border border-white/10 flex items-center gap-1">
                                    ❤️ 3 Can & Asistan Robot
                                </span>
                                <span class="px-2.5 py-1 rounded-xl bg-white/10 border border-white/10 flex items-center gap-1">
                                    ✨ Işık Yılı & Yıldız Skoru
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
                        <button type="button" onclick="openInteractiveGameModal('${gNum === "7" ? "builtin-oyun-7-uzay-ekspresi" : "oyun-uzay-ekspresi"}', '${gNum === "7" ? "Rotalı Fenci - Uzay Ekspresi: Güneş Sistemi ve Ötesi" : "Rotalı Fenci - Uzay Ekspresi"}')" class="px-8 py-3.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black rounded-2xl text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer border-2 border-amber-300">
                            <i class="fa-solid fa-play text-base"></i> OYUNU AÇ (TAM EKRAN)
                        </button>
                        <a href="${gNum === "7" ? "oyunlar/uzay-ekspresi-7.html" : "oyunlar/uzay-ekspresi.html"}" target="_blank" rel="noopener noreferrer" class="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all border border-white/20 flex items-center justify-center gap-2 text-center">
                            <i class="fa-solid fa-up-right-from-square"></i> Tam Ekran Yeni Sekmede Aç
                        </a>
                    </div>
                </div>
            </div>
            ` : ''}'''

for fpath in target_files:
    if not os.path.exists(fpath):
        continue

    with open(fpath, 'r', encoding='utf-8') as f:
        code = f.read()

    # 1. Update unitTitlesMap "1. Ünite: Uzay Çağı" -> "1. Ünite: Güneş Sistemi ve Ötesi"
    code = code.replace('"1. Ünite: Uzay Çağı"', '"1. Ünite: Güneş Sistemi ve Ötesi"')
    code = code.replace('"Uzay Çağı"', '"Güneş Sistemi ve Ötesi"')
    print(f"Updated unit name to Güneş Sistemi ve Ötesi in {fpath}")

    # 2. Insert Hero Card into renderGradeUnitBasedHub
    comment_target = '<!-- Özel materyaller doğrudan kendi ünite akordeonlarına yerleştirildi -->'
    if comment_target in code and '🌟 1. ÜNİTE ÖNE ÇIKAN BAŞYAPIT OYUNU (UZAY EKSPRESİ)' not in code:
        code = code.replace(comment_target, hero_markup + '\n\n            ' + comment_target, 1)
        print(f"Inserted Hero Card into renderGradeUnitBasedHub in {fpath}")

    # 3. Fix actionCall for Uzay Ekspresi in accordion
    old_call = "actionCall = `openInteractiveGameModal('oyun-uzay-ekspresi', 'Rotalı Fenci - Uzay Ekspresi: Güneş Sistemi Keşfi')`;"
    new_call = """if (gNum === "7" || (item.fileUrl && item.fileUrl.includes("uzay-ekspresi-7")) || (item.title && item.title.includes("Ötesi"))) {
                                                actionCall = `openInteractiveGameModal('builtin-oyun-7-uzay-ekspresi', 'Rotalı Fenci - Uzay Ekspresi: Güneş Sistemi ve Ötesi')`;
                                            } else {
                                                actionCall = `openInteractiveGameModal('oyun-uzay-ekspresi', 'Rotalı Fenci - Uzay Ekspresi: Güneş Sistemi Keşfi')`;
                                            }"""
    if old_call in code:
        code = code.replace(old_call, new_call, 1)
        print(f"Fixed accordion actionCall in {fpath}")

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(code)

print("Saved all updates!")
