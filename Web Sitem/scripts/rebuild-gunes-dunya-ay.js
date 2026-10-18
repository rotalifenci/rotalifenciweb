const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'oyunlar', 'gunes-dunya-ay-3d.html');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Replace the entire HTML body markup from <body ...> down to <script>
const bodyStartPattern = /<body[\s\S]*?<!-- 🪐 JAVASCRIPT: THREE\.JS 3D MOTORU/i;

const newBodyHtml = `<body class="relative w-full h-full overflow-hidden bg-slate-950 text-slate-100 flex flex-col select-none">

    <!-- 🌌 3D WEBGL SAHNESİ (Tam Ekran Arka Plan) -->
    <div class="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <canvas id="webgl-canvas"></canvas>
    </div>

    <!-- 🌟 ÜST BAŞLIK BARI (HEADER) - Tek Satır, Sade ve Ferah -->
    <header class="relative z-20 w-full px-3 sm:px-5 py-2 glass-panel border-b border-white/10 flex items-center justify-between gap-2 shrink-0">
        <!-- Sol: Logo & Başlık -->
        <div class="flex items-center gap-2 sm:gap-3 min-w-0">
            <a href="../#home" class="flex items-center gap-2 shrink-0 group hover:opacity-95 transition-opacity" title="Rotalı Fenci Ana Sayfa">
                <img src="../assets/logo.jpg" alt="Rotalı Fenci" class="w-8 h-8 rounded-xl object-cover border border-amber-400/40 shadow-sm" onerror="this.src='../assets/rotali-fenci-logo.png'">
                <div class="hidden sm:block">
                    <div class="font-black text-xs sm:text-sm tracking-wider text-amber-400 uppercase leading-none font-orbitron">ROTALI FENCİ</div>
                    <div class="text-[9px] font-bold text-slate-300 tracking-widest uppercase mt-0.5">3D HAREKET LABORATUVARI</div>
                </div>
            </a>
            <div class="h-6 w-px bg-white/15 hidden sm:block"></div>
            <div class="min-w-0">
                <span class="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    5. SINIF FEN
                </span>
                <span class="text-xs sm:text-sm font-black text-white ml-1.5 truncate hidden md:inline">Güneş, Dünya ve Ay</span>
            </div>
        </div>

        <!-- Orta: Aktif Mod Rozeti (Tıklanınca Menüyü Açar) -->
        <button onclick="toggleSideMenu()" id="header-active-mode-btn" class="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs sm:text-sm font-black flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 transition-all truncate max-w-[190px] sm:max-w-none" title="Simülasyon Modunu Değiştirmek İçin Menüyü Aç">
            <i class="fa-solid fa-shapes text-amber-400 text-xs"></i>
            <span id="header-mode-title" class="truncate">7. Güneş + Dünya + Ay</span>
            <i class="fa-solid fa-chevron-down text-[10px] text-slate-400"></i>
        </button>

        <!-- Sağ: Menü Açma Butonu & Tam Ekran & Yardım -->
        <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <!-- ☰ YAN MENÜ BUTONU (Çok Belirgin, Tıklanınca Yan Menüyü Açar) -->
            <button onclick="toggleSideMenu()" id="btn-open-menu" class="px-3 sm:px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95 transition-all" title="Kontroller ve Modlar Menüsü">
                <i class="fa-solid fa-bars text-sm"></i>
                <span>Menü</span>
            </button>

            <!-- Tam Ekran -->
            <button onclick="toggleFullScreen()" class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center justify-center cursor-pointer border border-white/10 text-xs active:scale-95" title="Tam Ekran">
                <i class="fa-solid fa-expand" id="fullscreen-icon"></i>
            </button>

            <!-- Yardım / Bilimsel Rehber -->
            <button onclick="toggleHelpModal()" class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center justify-center cursor-pointer border border-white/10 text-xs active:scale-95" title="Bilimsel Rehber">
                <i class="fa-solid fa-circle-question text-amber-300"></i>
            </button>
        </div>
    </header>

    <!-- 🚀 ORTA ALAN (Tamamen Temiz 3D Görünüm, Ekranı Kapatan Hiçbir Kutu Yok) -->
    <div class="relative flex-1 w-full h-full pointer-events-none overflow-hidden">
        <!-- Öğretmen Tahmin Kartı (Yalnızca Öğretmen Modunda Açılır) -->
        <div id="teacher-quiz-overlay" class="pointer-events-auto absolute top-4 left-1/2 -translate-x-1/2 z-30 max-w-lg w-[92%] glass-panel rounded-3xl p-4 sm:p-5 border-2 border-amber-500/50 shadow-2xl transition-all duration-300 hidden">
            <div class="flex items-center justify-between mb-2.5">
                <span class="px-2.5 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                    <i class="fa-solid fa-graduation-cap"></i> ÖĞRETMEN MODU: ÖNCE TAHMİN ET
                </span>
                <button onclick="toggleTeacherMode()" class="text-slate-400 hover:text-white p-1 cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <h3 id="quiz-question-title" class="text-xs sm:text-sm font-black text-white mb-2 leading-snug">
                Dünya kendi ekseni etrafında hangi yönde döner?
            </h3>
            <p id="quiz-question-sub" class="text-[11px] text-slate-300 mb-3">
                Öğrencilerden tahminleri aldıktan sonra doğru hareketi ve yön ibresini başlatmak için seçeneğe dokunun.
            </p>
            <div class="grid grid-cols-2 gap-2.5 mb-2.5">
                <button onclick="checkTeacherAnswer('cw')" class="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/20 text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5">
                    <i class="fa-solid fa-clock-rotate-left text-amber-400"></i> Saat Yönünde
                </button>
                <button onclick="checkTeacherAnswer('ccw')" class="py-2 px-3 rounded-xl bg-cyan-700/80 hover:bg-cyan-600 border border-cyan-400/40 text-xs font-black text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg">
                    <i class="fa-solid fa-rotate-left text-cyan-200"></i> Saat Yönünün Tersi
                </button>
            </div>
            <div id="quiz-feedback-box" class="hidden p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-200 font-medium"></div>
        </div>
    </div>

    <!-- 🎮 ALT TEK EKRAN OYNATMA BARI (FOOTER) - Sabit, Kaydırma Yok, Her Zaman Görünür -->
    <footer class="relative z-20 w-full px-3 sm:px-5 py-2 glass-panel border-t border-white/10 shrink-0 select-none">
        <div class="max-w-7xl mx-auto flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
            
            <!-- Sol: Oynat/Durdur Butonu (Büyük, Belirgin, Tek Dokunuşla Çalışır) -->
            <div class="flex items-center gap-1.5 sm:gap-2">
                <button id="btn-master-play" onclick="toggleMasterPlay()" class="h-10 sm:h-11 px-4 sm:px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-black text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg shadow-amber-500/25 active:scale-95 cursor-pointer shrink-0">
                    <i class="fa-solid fa-play text-sm" id="master-play-icon"></i>
                    <span id="master-play-text">Başlat</span>
                </button>

                <!-- Hız Butonları -->
                <div class="flex items-center gap-0.5 bg-black/50 p-1 rounded-2xl border border-white/10">
                    <button onclick="setSpeed(0.5)" class="speed-btn h-8 px-2 sm:px-2.5 rounded-xl text-[11px] sm:text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer" data-speed="0.5">0.5x</button>
                    <button onclick="setSpeed(1)" class="speed-btn h-8 px-2 sm:px-2.5 rounded-xl text-[11px] sm:text-xs font-black bg-amber-500 text-slate-950 transition-all cursor-pointer" data-speed="1">1x</button>
                    <button onclick="setSpeed(5)" class="speed-btn h-8 px-2 sm:px-2.5 rounded-xl text-[11px] sm:text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer" data-speed="5">5x</button>
                    <button onclick="setSpeed(20)" class="speed-btn h-8 px-2 sm:px-2.5 rounded-xl text-[11px] sm:text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer hidden xs:inline" data-speed="20">20x</button>
                </div>

                <!-- Sıfırla Butonu -->
                <button onclick="resetAllPositions()" class="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] sm:text-xs font-bold border border-white/10 transition-all flex items-center gap-1 active:scale-95 cursor-pointer" title="Konumları ve Açıları Başa Sar">
                    <i class="fa-solid fa-rotate-left"></i>
                    <span class="hidden sm:inline">Sıfırla</span>
                </button>
            </div>

            <!-- Sağ: Kamera Açısı Seçici -->
            <div class="flex items-center gap-1 bg-black/50 p-1 rounded-2xl border border-white/10 text-xs shrink-0">
                <button onclick="setCameraView('perspective')" class="h-8 px-2 sm:px-2.5 rounded-xl font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer flex items-center gap-1" title="Serbest 3D Kamera">
                    <i class="fa-solid fa-video text-[10px]"></i>
                    <span class="text-[11px]">Serbest</span>
                </button>
                <button onclick="setCameraView('top')" class="h-8 px-2 sm:px-2.5 rounded-xl font-bold text-emerald-300 hover:text-emerald-200 hover:bg-white/10 transition-all cursor-pointer flex items-center gap-1" title="Kuzey Kutbu Kuşbakışı">
                    <i class="fa-solid fa-arrows-up-to-line text-[10px]"></i>
                    <span class="text-[11px]">Kuzeyden</span>
                </button>
                <button onclick="setCameraView('earth')" class="h-8 px-2 sm:px-2.5 rounded-xl font-bold text-cyan-300 hover:text-cyan-200 hover:bg-white/10 transition-all cursor-pointer flex items-center gap-1" title="Dünya'ya Odaklan">
                    <i class="fa-solid fa-earth-americas text-[10px]"></i>
                    <span class="text-[11px]">Dünya</span>
                </button>
                <button onclick="setCameraView('moon')" class="h-8 px-2 sm:px-2.5 rounded-xl font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer flex items-center gap-1" title="Ay'a Odaklan">
                    <i class="fa-solid fa-moon text-[10px]"></i>
                    <span class="text-[11px]">Ay</span>
                </button>
            </div>

        </div>
    </footer>

    <!-- ============================================================== -->
    <!-- 🧭 YAN MENÜ ÇEKMECESİ (SIDE DRAWER - HEM MOBİL HEM PC İÇİN)   -->
    <!-- ============================================================== -->
    <!-- Karartma Perdesi -->
    <div id="side-menu-backdrop" onclick="closeSideMenu()" class="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300"></div>

    <!-- Yan Menü Paneli -->
    <aside id="side-drawer" class="fixed inset-y-0 left-0 z-50 w-80 sm:w-96 max-w-[88vw] bg-slate-950/95 backdrop-blur-2xl border-r border-white/15 shadow-2xl flex flex-col -translate-x-full transition-transform duration-300 ease-in-out">
        <!-- Menü Üst Başlık & Kapat Butonu -->
        <div class="p-3.5 sm:p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/80 shrink-0">
            <div class="flex items-center gap-2.5">
                <span class="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm border border-amber-500/30">
                    <i class="fa-solid fa-sliders"></i>
                </span>
                <div>
                    <h2 class="text-xs sm:text-sm font-black text-white uppercase tracking-wider font-orbitron">Simülasyon Menüsü</h2>
                    <p class="text-[10px] text-slate-400 font-medium">Hareketler, modlar ve rehberler</p>
                </div>
            </div>
            <button onclick="closeSideMenu()" class="w-8 h-8 rounded-xl bg-white/10 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors flex items-center justify-center cursor-pointer text-xs" title="Menüyü Kapat">
                <i class="fa-solid fa-xmark text-sm"></i>
            </button>
        </div>

        <!-- Menü İçeriği (Kaydırılabilir) -->
        <div class="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4 no-scrollbar">

            <!-- 1. SİMÜLASYON MODU (7 MOD) -->
            <div class="space-y-2">
                <div class="flex items-center justify-between">
                    <span class="text-[11px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                        <i class="fa-solid fa-shapes"></i> 7 Simülasyon Modu
                    </span>
                    <span class="text-[9px] text-slate-400">Seçmek için tıkla</span>
                </div>
                <div class="grid grid-cols-1 gap-1.5 text-xs">
                    <button onclick="selectSimModeFromMenu(1)" id="menu-mode-1" class="menu-mode-btn p-2.5 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-bold flex items-center justify-between text-left transition-all cursor-pointer">
                        <span>☀️ 1. Yalnız Güneş</span>
                        <i class="fa-solid fa-chevron-right text-[10px] text-slate-500"></i>
                    </button>
                    <button onclick="selectSimModeFromMenu(2)" id="menu-mode-2" class="menu-mode-btn p-2.5 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-bold flex items-center justify-between text-left transition-all cursor-pointer">
                        <span>🌍 2. Yalnız Dünya</span>
                        <i class="fa-solid fa-chevron-right text-[10px] text-slate-500"></i>
                    </button>
                    <button onclick="selectSimModeFromMenu(3)" id="menu-mode-3" class="menu-mode-btn p-2.5 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-bold flex items-center justify-between text-left transition-all cursor-pointer">
                        <span>🌕 3. Yalnız Ay</span>
                        <i class="fa-solid fa-chevron-right text-[10px] text-slate-500"></i>
                    </button>
                    <button onclick="selectSimModeFromMenu(4)" id="menu-mode-4" class="menu-mode-btn p-2.5 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-bold flex items-center justify-between text-left transition-all cursor-pointer">
                        <span>☀️🌍 4. Güneş + Dünya</span>
                        <i class="fa-solid fa-chevron-right text-[10px] text-slate-500"></i>
                    </button>
                    <button onclick="selectSimModeFromMenu(5)" id="menu-mode-5" class="menu-mode-btn p-2.5 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-bold flex items-center justify-between text-left transition-all cursor-pointer">
                        <span>🌍🌕 5. Dünya + Ay</span>
                        <i class="fa-solid fa-chevron-right text-[10px] text-slate-500"></i>
                    </button>
                    <button onclick="selectSimModeFromMenu(6)" id="menu-mode-6" class="menu-mode-btn p-2.5 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-bold flex items-center justify-between text-left transition-all cursor-pointer">
                        <span>☀️🌕 6. Güneş + Ay</span>
                        <i class="fa-solid fa-chevron-right text-[10px] text-slate-500"></i>
                    </button>
                    <button onclick="selectSimModeFromMenu(7)" id="menu-mode-7" class="menu-mode-btn p-2.5 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black flex items-center justify-between text-left shadow-md transition-all cursor-pointer">
                        <span>🌌 7. Güneş + Dünya + Ay (Ana Mod)</span>
                        <i class="fa-solid fa-check text-xs"></i>
                    </button>
                </div>
            </div>

            <!-- 2. BAĞIMSIZ HAREKET ANAHTARLARI -->
            <div class="space-y-2 pt-2 border-t border-white/10">
                <span class="text-[11px] font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                    <i class="fa-solid fa-toggle-on"></i> Bağımsız Hareket Anahtarları
                </span>

                <!-- Güneş Kontrolleri -->
                <div class="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/20">
                    <div class="flex items-center justify-between mb-1.5">
                        <span class="text-xs font-black text-amber-300 flex items-center gap-1.5">
                            <i class="fa-solid fa-sun"></i> GÜNEŞ
                        </span>
                        <span class="text-[10px] text-amber-300/70 font-mono">~25 Gün</span>
                    </div>
                    <label class="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-black/60 transition-colors cursor-pointer text-xs">
                        <span class="font-bold text-slate-200 text-[11px]">Kendi Ekseninde Dönme</span>
                        <input type="checkbox" id="chk-sun-rot" onchange="updateMovementStates()" class="w-4 h-4 rounded text-amber-500 accent-amber-500 cursor-pointer">
                    </label>
                </div>

                <!-- Dünya Kontrolleri -->
                <div class="p-2.5 rounded-xl bg-blue-950/30 border border-blue-500/20 space-y-1.5">
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-xs font-black text-cyan-300 flex items-center gap-1.5">
                            <i class="fa-solid fa-earth-americas"></i> DÜNYA
                        </span>
                        <span class="text-[10px] text-cyan-300/70 font-mono">24 Sa / 365 Gün</span>
                    </div>
                    <label class="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-black/60 transition-colors cursor-pointer text-xs">
                        <span class="font-bold text-slate-200 text-[11px]">Kendi Ekseninde Dönme (Gece-Gündüz)</span>
                        <input type="checkbox" id="chk-earth-rot" onchange="updateMovementStates()" class="w-4 h-4 rounded text-cyan-500 accent-cyan-500 cursor-pointer">
                    </label>
                    <label class="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-black/60 transition-colors cursor-pointer text-xs">
                        <span class="font-bold text-slate-200 text-[11px]">Güneş Çevresinde Dolanma (1 Yıl)</span>
                        <input type="checkbox" id="chk-earth-rev" onchange="updateMovementStates()" class="w-4 h-4 rounded text-cyan-500 accent-cyan-500 cursor-pointer">
                    </label>
                </div>

                <!-- Ay Kontrolleri -->
                <div class="p-2.5 rounded-xl bg-slate-900/60 border border-slate-400/20 space-y-1.5">
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-xs font-black text-slate-200 flex items-center gap-1.5">
                            <i class="fa-solid fa-moon"></i> AY
                        </span>
                        <span class="text-[10px] text-slate-400 font-mono">~27,3 Gün (Eşzamanlı)</span>
                    </div>
                    <label class="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-black/60 transition-colors cursor-pointer text-xs">
                        <div>
                            <span class="font-bold text-slate-200 text-[11px] block">Dönme ve Dolanma Hareketi</span>
                            <span class="text-[9px] text-slate-400">1 dönme süresi = 1 dolanma süresi</span>
                        </div>
                        <input type="checkbox" id="chk-moon-motion" onchange="updateMovementStates()" class="w-4 h-4 rounded text-slate-300 accent-slate-300 cursor-pointer">
                    </label>
                    <label class="flex items-center justify-between p-2 rounded-lg bg-purple-950/40 border border-purple-500/30 hover:bg-purple-950/60 transition-colors cursor-pointer text-xs">
                        <span class="font-bold text-purple-200 text-[11px] flex items-center gap-1">
                            <i class="fa-solid fa-thumbtack text-rose-400"></i> "Aynı Yüz" Türk Bayrağı & Çizgi
                        </span>
                        <input type="checkbox" id="chk-same-face" onchange="toggleSameFaceMarker()" checked class="w-4 h-4 rounded text-purple-400 accent-purple-400 cursor-pointer">
                    </label>
                </div>

                <!-- Toplu Başlat/Durdur -->
                <div class="grid grid-cols-2 gap-2 pt-1">
                    <button type="button" onclick="startAllMovements()" class="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all shadow flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer">
                        <i class="fa-solid fa-play"></i> Tümünü Başlat
                    </button>
                    <button type="button" onclick="pauseAllMovements()" class="py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs transition-all shadow flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer">
                        <i class="fa-solid fa-pause"></i> Tümünü Durdur
                    </button>
                </div>
            </div>

            <!-- 3. GÖRSEL KATMANLAR -->
            <div class="space-y-2 pt-2 border-t border-white/10">
                <span class="text-[11px] font-black uppercase text-amber-300 tracking-wider flex items-center gap-1.5">
                    <i class="fa-solid fa-layer-group"></i> Görsel Katmanlar & Oklar
                </span>
                <div class="grid grid-cols-2 gap-1.5 text-[11px]">
                    <label class="flex items-center gap-1.5 p-2 rounded-lg bg-black/40 hover:bg-black/60 cursor-pointer">
                        <input type="checkbox" id="chk-show-orbits" checked onchange="toggleOrbits()" class="rounded text-amber-500 accent-amber-500">
                        <span class="text-slate-300">Yörüngeler</span>
                    </label>
                    <label class="flex items-center gap-1.5 p-2 rounded-lg bg-black/40 hover:bg-black/60 cursor-pointer">
                        <input type="checkbox" id="chk-show-arrows" checked onchange="toggleArrows()" class="rounded text-cyan-500 accent-cyan-500">
                        <span class="text-slate-300">3D Yön Okları</span>
                    </label>
                    <label class="flex items-center gap-1.5 p-2 rounded-lg bg-black/40 hover:bg-black/60 cursor-pointer">
                        <input type="checkbox" id="chk-show-axes" checked onchange="toggleAxes()" class="rounded text-yellow-500 accent-yellow-500">
                        <span class="text-slate-300">Dönüş Eksenleri</span>
                    </label>
                    <label class="flex items-center gap-1.5 p-2 rounded-lg bg-black/40 hover:bg-black/60 cursor-pointer">
                        <input type="checkbox" id="chk-show-orrery" onchange="toggleOrreryArms()" class="rounded text-amber-500 accent-amber-500">
                        <span class="text-slate-300 font-bold text-amber-300">Mekanik Kol</span>
                    </label>
                </div>
            </div>

            <!-- 4. HAREKET YÖNÜ REHBERİ (ANALOG SAAT) -->
            <div class="space-y-2 pt-2 border-t border-white/10">
                <div class="flex items-center justify-between">
                    <span class="text-[11px] font-black uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                        <i class="fa-solid fa-compass"></i> Hareket Yönü Rehberi
                    </span>
                    <span class="text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">KUZEYDEN</span>
                </div>
                
                <!-- Saat vs Gök Cismi -->
                <div class="grid grid-cols-2 gap-2">
                    <div class="p-2 rounded-xl bg-slate-900/80 border border-rose-500/30 flex flex-col items-center text-center">
                        <span class="text-[9px] font-bold text-rose-400">NORMAL SAAT</span>
                        <div class="relative w-12 h-12 my-1">
                            <svg viewBox="0 0 60 60" class="w-full h-full">
                                <circle cx="30" cy="30" r="26" fill="#0f172a" stroke="#ef4444" stroke-width="1.5" />
                                <text x="30" y="11" font-size="6.5" fill="#94a3b8" text-anchor="middle" font-weight="900">12</text>
                                <text x="51" y="32" font-size="6.5" fill="#94a3b8" text-anchor="middle" font-weight="900">3</text>
                                <text x="30" y="53" font-size="6.5" fill="#94a3b8" text-anchor="middle" font-weight="900">6</text>
                                <text x="9" y="32" font-size="6.5" fill="#94a3b8" text-anchor="middle" font-weight="900">9</text>
                                <path d="M 32 8 A 20 20 0 0 1 50 28" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="2 1.5" />
                                <polygon points="50,28 47,23 52,24" fill="#ef4444" />
                                <line x1="30" y1="30" x2="43" y2="21" stroke="#ef4444" stroke-width="2.2" stroke-linecap="round" />
                                <circle cx="30" cy="30" r="2.5" fill="#f87171" />
                            </svg>
                        </div>
                        <span class="text-[9px] font-black text-rose-300">Saat Yönü ↻</span>
                    </div>
                    <div class="p-2 rounded-xl bg-emerald-950/50 border-2 border-emerald-500/60 flex flex-col items-center text-center">
                        <span class="text-[9px] font-black text-emerald-300">GÖK CİSİMLERİ</span>
                        <div class="relative w-12 h-12 my-1">
                            <svg viewBox="0 0 60 60" class="w-full h-full">
                                <circle cx="30" cy="30" r="26" fill="#022c22" stroke="#10b981" stroke-width="2" />
                                <text x="30" y="11" font-size="6.5" fill="#6ee7b7" text-anchor="middle" font-weight="900">12</text>
                                <text x="9" y="32" font-size="6.5" fill="#6ee7b7" text-anchor="middle" font-weight="900">9</text>
                                <text x="30" y="53" font-size="6.5" fill="#6ee7b7" text-anchor="middle" font-weight="900">6</text>
                                <text x="51" y="32" font-size="6.5" fill="#6ee7b7" text-anchor="middle" font-weight="900">3</text>
                                <path d="M 28 8 A 20 20 0 0 0 10 28" fill="none" stroke="#34d399" stroke-width="2.5" />
                                <polygon points="10,28 14,24 8,24" fill="#34d399" />
                                <line id="clock-hand" x1="30" y1="30" x2="30" y2="12" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" />
                                <circle cx="30" cy="30" r="3" fill="#10b981" />
                                <circle cx="30" cy="30" r="1.5" fill="#ffffff" />
                            </svg>
                        </div>
                        <span class="text-[9px] font-black text-emerald-300">Saat Yönünün Tersi ↺</span>
                    </div>
                </div>

                <!-- Kuşbakışı Butonu -->
                <button type="button" onclick="focusTopViewAndDemonstrate(); closeSideMenu();" class="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-black transition-all shadow flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer">
                    <i class="fa-solid fa-satellite"></i>
                    <span>🔭 Kuşbakışı Kuzeyden Canlı Gör</span>
                </button>

                <!-- Sayaç -->
                <div class="bg-black/50 p-2 rounded-xl flex items-center justify-between text-xs font-mono border border-white/10">
                    <div>
                        <span class="text-[9px] text-slate-400 block font-sans uppercase">Geçen Süre</span>
                        <span id="elapsed-time-counter" class="text-amber-400 font-bold">0 Gün 00 Sa</span>
                    </div>
                    <div class="text-right">
                        <span class="text-[9px] text-slate-400 block font-sans uppercase">Dünya Turu</span>
                        <span id="earth-orbit-counter" class="text-cyan-400 font-bold">0.00 Yıl</span>
                    </div>
                </div>
            </div>

            <!-- 5. DÜNYA'DAN AY GÖRÜNÜMÜ (EVRE PENCERESİ - ARTIK MENÜDE!) -->
            <div class="space-y-2 pt-2 border-t border-white/10">
                <div class="flex items-center justify-between">
                    <span class="text-[11px] font-black uppercase text-indigo-300 tracking-wider flex items-center gap-1.5">
                        <i class="fa-solid fa-moon"></i> Dünya'dan Ay Görünümü
                    </span>
                    <span id="phase-name-badge" class="text-[10px] font-bold text-amber-400">Yeni Ay</span>
                </div>
                <div class="relative w-36 h-36 mx-auto bg-slate-950 rounded-2xl overflow-hidden border border-white/15 flex items-center justify-center shadow-lg">
                    <canvas id="moon-phase-canvas" width="160" height="160" class="w-full h-full object-contain"></canvas>
                    <div class="absolute bottom-1.5 left-0 right-0 text-center">
                        <span id="phase-label" class="text-[9px] font-black bg-black/80 px-2 py-0.5 rounded-full text-slate-200">Karanlık Yüzey</span>
                    </div>
                </div>
            </div>

            <!-- 6. ÖĞRETMEN MODU & ETKİLEŞİMLİ DENEYLER -->
            <div class="space-y-2 pt-2 border-t border-white/10 pb-4">
                <span class="text-[11px] font-black uppercase text-purple-300 tracking-wider flex items-center gap-1.5">
                    <i class="fa-solid fa-graduation-cap"></i> Eğitim Modülleri
                </span>
                <div class="grid grid-cols-2 gap-2">
                    <button onclick="toggleTeacherMode(); closeSideMenu();" class="p-2.5 rounded-xl bg-slate-900 border border-amber-500/30 hover:bg-amber-600 text-slate-200 hover:text-white font-black text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer">
                        <i class="fa-solid fa-chalkboard-user text-amber-400"></i>
                        <span>Öğretmen Modu</span>
                    </button>
                    <button onclick="toggleExperimentModal(); closeSideMenu();" class="p-2.5 rounded-xl bg-indigo-900/60 border border-indigo-400/30 hover:bg-indigo-600 text-white font-black text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer">
                        <i class="fa-solid fa-flask-vial text-cyan-300"></i>
                        <span>4 Deney</span>
                    </button>
                </div>
            </div>

        </div>
    </aside>

    <!-- 🧪 4 ETKİLEŞİMLİ DENEY MODALI -->
    <div id="modal-experiments" class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 transition-all duration-300 hidden">
        <div class="bg-slate-900 border border-indigo-500/30 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden" onclick="event.stopPropagation()">
            <div class="p-4 sm:p-5 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-b border-indigo-500/20 flex items-center justify-between text-white">
                <div class="flex items-center gap-2.5">
                    <span class="w-8 h-8 rounded-xl bg-indigo-500/20 text-cyan-300 flex items-center justify-center text-sm border border-indigo-500/30">
                        <i class="fa-solid fa-flask-vial"></i>
                    </span>
                    <div>
                        <h3 class="text-sm sm:text-base font-black font-orbitron">5. Sınıf 3D Etkileşimli Deneyler</h3>
                        <p class="text-[11px] text-slate-300">Yaparak ve deneyerek astronomik kavramları keşfet!</p>
                    </div>
                </div>
                <button onclick="toggleExperimentModal()" class="w-8 h-8 rounded-xl bg-white/10 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors flex items-center justify-center cursor-pointer text-sm">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
                <div class="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-amber-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <span class="text-[10px] font-black uppercase text-amber-400">Deney 1</span>
                        <h4 class="text-sm font-black text-white">Dönme mi, Dolanma mı?</h4>
                        <p class="text-xs text-slate-300 mt-1">Gök cisimlerinin kendi ekseninde dönmesi ile bir başkası çevresinde dolanmasını test et.</p>
                    </div>
                    <button onclick="launchExperiment(1)" class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shrink-0 cursor-pointer shadow-md">
                        Deneyi Başlat
                    </button>
                </div>
                <div class="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-cyan-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <span class="text-[10px] font-black uppercase text-cyan-400">Deney 2</span>
                        <h4 class="text-sm font-black text-white">Hareket Yönünü Bul (Analog Saat)</h4>
                        <p class="text-xs text-slate-300 mt-1">Kuzey kutbundan bakışta analog saatin ibresi ile gök cisminin dönme yönünü eşleştir.</p>
                    </div>
                    <button onclick="launchExperiment(2)" class="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shrink-0 cursor-pointer shadow-md">
                        Deneyi Başlat
                    </button>
                </div>
                <div class="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-purple-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <span class="text-[10px] font-black uppercase text-purple-400">Deney 3</span>
                        <h4 class="text-sm font-black text-white">Ay Neden Hep Aynı Yüzünü Gösterir?</h4>
                        <p class="text-xs text-slate-300 mt-1">Ay'ın dönme ve dolanma sürelerinin eşitliğini "Aynı Yüz" pini ile kanıtla.</p>
                    </div>
                    <button onclick="launchExperiment(3)" class="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-black text-xs shrink-0 cursor-pointer shadow-md">
                        Deneyi Başlat
                    </button>
                </div>
                <div class="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-emerald-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <span class="text-[10px] font-black uppercase text-emerald-400">Deney 4</span>
                        <h4 class="text-sm font-black text-white">Bir Gün, Bir Ay ve Bir Yıl</h4>
                        <p class="text-xs text-slate-300 mt-1">Dünya'nın 24 saatlik dönüşü ile Ay'ın 27.3 günü ve Dünya'nın 365 gününü karşılaştır.</p>
                    </div>
                    <button onclick="launchExperiment(4)" class="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shrink-0 cursor-pointer shadow-md">
                        Deneyi Başlat
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- 📚 BİLİMSEL REHBER VE YARDIM MODALI -->
    <div id="modal-help" class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 transition-all duration-300 hidden">
        <div class="bg-slate-900 border border-white/20 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden" onclick="event.stopPropagation()">
            <div class="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border-b border-white/10 flex items-center justify-between text-white">
                <div class="flex items-center gap-2.5">
                    <span class="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-sm border border-amber-500/30">
                        <i class="fa-solid fa-book-open"></i>
                    </span>
                    <h3 class="text-sm sm:text-base font-black font-orbitron">Güneş, Dünya ve Ay Bilimsel Rehberi</h3>
                </div>
                <button onclick="toggleHelpModal()" class="w-8 h-8 rounded-xl bg-white/10 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors flex items-center justify-center cursor-pointer text-sm">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed">
                <div class="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/20">
                    <h4 class="font-black text-amber-300 text-sm mb-1">☀️ Güneş'in Hareketleri</h4>
                    <p>Güneş kendi ekseni etrafında döner (Ekvator bölgesinde yaklaşık 25 Dünya günü). Dönme yönü kuzey kutbundan bakıldığında saat yönünün tersinedir (batıdan doğuya). Güneş katı bir küre olmadığı için (plazma/gaz) farklı enlemleri farklı hızlarda döner. Güneş Sistemi ile birlikte Samanyolu Galaksisi merkezi etrafında dolanır (Dünya çevresinde dolanmaz!).</p>
                </div>
                <div class="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-500/20">
                    <h4 class="font-black text-cyan-300 text-sm mb-1">🌍 Dünya'nın Hareketleri</h4>
                    <p>Dünya kendi ekseni etrafında saat yönünün tersine (batıdan doğuya) 24 saatte döner; böylece gece ve gündüz ardalanır. Güneş çevresinde ise elips bir yörüngede yaklaşık 365 gün 6 saatte (1 yılda) dolanır. Dolanma yönü de saat yönünün tersinedir. 23.5° eksen eğikliği mevsimlerin oluşmasını sağlar.</p>
                </div>
                <div class="p-3.5 rounded-2xl bg-slate-800/40 border border-white/10">
                    <h4 class="font-black text-slate-200 text-sm mb-1">🌕 Ay'ın Hareketleri ve "Aynı Yüz"</h4>
                    <p>Ay kendi ekseni etrafındaki dönmesini yaklaşık 27,3 günde tamamlar. Dünya çevresindeki dolanmasını da yaklaşık 27,3 günde tamamlar. <strong>Dönme ve dolanma süreleri birbirine eşit olduğu için Dünya'dan bakıldığında Ay'ın hep aynı yüzü görülür (Kütleçekim Kilidi / Synchronous Rotation).</strong> Her iki hareketin yönü de saat yönünün tersinedir.</p>
                </div>
            </div>
        </div>
    </div>

    <!-- 🪐 JAVASCRIPT: THREE.JS 3D MOTORU`;

content = content.replace(bodyStartPattern, newBodyHtml);

// 2. Add side menu management functions and update setSimMode
const sideMenuScript = `
        // -------------------------------------------------------------
        // 🧭 YAN MENÜ (SIDE DRAWER) YÖNETİMİ (MOBİL VE PC UYUMLU)
        // -------------------------------------------------------------
        function toggleSideMenu() {
            const drawer = document.getElementById('side-drawer');
            const backdrop = document.getElementById('side-menu-backdrop');
            if (!drawer || !backdrop) return;
            const isOpen = !drawer.classList.contains('-translate-x-full');
            if (isOpen) {
                closeSideMenu();
            } else {
                openSideMenu();
            }
        }

        function openSideMenu() {
            const drawer = document.getElementById('side-drawer');
            const backdrop = document.getElementById('side-menu-backdrop');
            if (!drawer || !backdrop) return;
            drawer.classList.remove('-translate-x-full');
            backdrop.classList.remove('opacity-0', 'pointer-events-none');
            backdrop.classList.add('opacity-100', 'pointer-events-auto');
        }

        function closeSideMenu() {
            const drawer = document.getElementById('side-drawer');
            const backdrop = document.getElementById('side-menu-backdrop');
            if (!drawer || !backdrop) return;
            drawer.classList.add('-translate-x-full');
            backdrop.classList.add('opacity-0', 'pointer-events-none');
            backdrop.classList.remove('opacity-100', 'pointer-events-auto');
        }

        function selectSimModeFromMenu(modeNum) {
            setSimMode(modeNum);
            closeSideMenu();
        }

        function updateMenuModeHighlight(modeNum) {
            const modeNames = [
                '1. Yalnız Güneş',
                '2. Yalnız Dünya',
                '3. Yalnız Ay',
                '4. Güneş + Dünya',
                '5. Dünya + Ay',
                '6. Güneş + Ay',
                '7. Güneş + Dünya + Ay'
            ];

            // Üst başlık rozetini güncelle
            const headerTitle = document.getElementById('header-mode-title');
            if (headerTitle && modeNames[modeNum - 1]) {
                headerTitle.innerText = modeNames[modeNum - 1];
            }

            // Yan menüdeki butonları güncelle
            for (let i = 1; i <= 7; i++) {
                const btn = document.getElementById('menu-mode-' + i);
                if (!btn) continue;
                if (i === modeNum) {
                    btn.className = 'menu-mode-btn p-2.5 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black flex items-center justify-between text-left shadow-md transition-all cursor-pointer';
                    const icon = btn.querySelector('i');
                    if (icon) icon.className = 'fa-solid fa-check text-xs';
                } else {
                    btn.className = 'menu-mode-btn p-2.5 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-bold flex items-center justify-between text-left transition-all cursor-pointer';
                    const icon = btn.querySelector('i');
                    if (icon) icon.className = 'fa-solid fa-chevron-right text-[10px] text-slate-500';
                }
            }
        }
`;

// Insert sideMenuScript right after `// 🎛️ 7 SİMÜLASYON MODU YÖNETİMİ`
const simModeComment = '// 🎛️ 7 SİMÜLASYON MODU YÖNETİMİ';
content = content.replace(simModeComment, sideMenuScript + '\n        ' + simModeComment);

// Update setSimMode to call updateMenuModeHighlight
const setSimModePattern = /function setSimMode\(modeNum\)\s*\{[\s\S]*?\/\/ Gök cisimlerinin görünürlükleri/;
const newSetSimModeHead = `function setSimMode(modeNum) {
            state.currentMode = modeNum;

            // Yan menü ve üst bar rozetini güncelle
            updateMenuModeHighlight(modeNum);

            // Gök cisimlerinin görünürlükleri`;

content = content.replace(setSimModePattern, newSetSimModeHead);

// Clean up styles to ensure clean layout
const stylePattern = /<style>[\s\S]*?<\/style>/i;
const newStyles = `<style>
        * {
            box-sizing: border-box;
            user-select: none;
            -webkit-user-select: none;
        }
        html, body {
            width: 100%;
            height: 100%;
            height: 100dvh;
            height: 100svh;
            margin: 0;
            padding: 0;
            overflow: hidden;
            position: fixed;
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: #030712;
            color: #f8fafc;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
        }
        #webgl-canvas {
            width: 100%;
            height: 100%;
            display: block;
            touch-action: none;
        }
        .glass-panel {
            background: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.12);
        }
        .glass-panel-light {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 5px;
            height: 5px;
        }
        ::-webkit-scrollbar-track {
            background: rgba(15, 23, 42, 0.3);
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(245, 158, 11, 0.4);
            border-radius: 9999px;
        }
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    </style>`;

content = content.replace(stylePattern, newStyles);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully rebuilt gunes-dunya-ay-3d.html! New length:', content.length);
