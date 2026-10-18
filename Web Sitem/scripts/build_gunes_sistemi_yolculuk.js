const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../oyunlar/gunes-sistemi-yolculuk-3d.html');

const htmlContent = `<!DOCTYPE html>
<html lang="tr" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>Güneş Sisteminde Yolculuk – 3D Sinematik Animasyon | Rotalı Fenci</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Three.js r128 -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <!-- OrbitControls -->
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
    <!-- FontAwesome 6 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <!-- Canvas Confetti -->
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

        * {
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
            box-sizing: border-box;
        }

        body {
            font-family: 'Outfit', 'Inter', sans-serif;
            overflow: hidden;
            background-color: #020308;
            color: #f8fafc;
            height: 100vh;
            height: 100dvh;
            height: 100svh;
            margin: 0;
            padding: 0;
        }

        .glass-panel {
            background: rgba(8, 14, 30, 0.78);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(56, 189, 248, 0.25);
            box-shadow: 0 12px 36px rgba(0, 0, 0, 0.65);
        }

        .glass-panel-amber {
            background: rgba(26, 17, 8, 0.85);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(245, 158, 11, 0.35);
            box-shadow: 0 12px 36px rgba(0, 0, 0, 0.65);
        }

        .glass-pill {
            background: rgba(15, 23, 42, 0.75);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(148, 163, 184, 0.2);
        }

        /* Özel Kaydırma Çubuğu */
        ::-webkit-scrollbar {
            width: 4px;
            height: 4px;
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(56, 189, 248, 0.4);
            border-radius: 4px;
        }

        /* 3D Etiketler */
        .world-label {
            position: absolute;
            transform: translate(-50%, -100%);
            pointer-events: none;
            white-space: nowrap;
            transition: opacity 0.25s ease-out;
            font-weight: 800;
            text-shadow: 0 2px 6px rgba(0,0,0,0.9);
        }

        /* Sinematik Fade Animasyonu */
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(12px) scale(0.96); }
            15% { opacity: 1; transform: translateY(0) scale(1); }
            85% { opacity: 1; transform: translateY(0) scale(1); }
            100% { opacity: 0; transform: translateY(-8px) scale(0.98); }
        }

        .animate-title-cinematic {
            animation: fadeInOut 6.5s ease-in-out forwards;
        }

        /* Nabız Halkası */
        @keyframes pulseGlow {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.12); opacity: 1; filter: drop-shadow(0 0 14px #38bdf8); }
        }
        .pulse-ring {
            animation: pulseGlow 2.5s infinite ease-in-out;
        }
    </style>
</head>
<body class="relative w-full h-full select-none overflow-hidden bg-black text-slate-100">

    <!-- 🌌 3D WEBGL CONTAINER -->
    <div id="webgl-container" class="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0"></div>

    <!-- 🏷️ 3D DİNAMİK GEZEGEN ETİKETLERİ -->
    <div id="labels-container" class="absolute inset-0 pointer-events-none z-10 overflow-hidden"></div>

    <!-- ============================================================== -->
    <!-- 🌟 ÜST ŞERİT (LOGO, SAHNE BAŞLIĞI, ÖĞRETMEN MODU) -->
    <!-- ============================================================== -->
    <header class="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-3 sm:p-5 pointer-events-none">
        <!-- Sol: Rotalı Fenci Logosu & Başlık -->
        <div class="pointer-events-auto flex items-center gap-3 glass-panel px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl shadow-lg border border-sky-500/30">
            <a href="../index.html" class="flex items-center gap-2.5 group" title="Rotalı Fenci Ana Sayfasına Dön">
                <img src="../assets/rotali-logo-transparent.png" alt="Rotalı Fenci" class="w-8 h-8 sm:w-9 sm:h-9 object-contain group-hover:scale-105 transition-transform" onerror="this.src='../assets/rotali-fenci-logo.jpg'">
                <div class="flex flex-col">
                    <span class="text-xs sm:text-sm font-black tracking-wider text-white flex items-center gap-1.5">
                        <span class="text-sky-400">ROTALI</span> FENCİ
                    </span>
                    <span class="text-[9px] sm:text-[10px] font-bold text-sky-300/80 -mt-0.5">6. Sınıf • Güneş Sistemi</span>
                </div>
            </a>
            <div class="h-6 w-px bg-slate-700/60 hidden sm:block"></div>
            <div class="hidden sm:flex items-center gap-1.5 text-xs font-black text-amber-300 bg-amber-500/15 px-2.5 py-1 rounded-xl border border-amber-500/30">
                <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span id="header-scene-pill">Sahne 1 / 8</span>
            </div>
        </div>

        <!-- Sağ: Öğretmen Modu & Tam Ekran Butonları -->
        <div class="pointer-events-auto flex items-center gap-2">
            <!-- Serbest İnceleme / Animasyona Dön Rozeti -->
            <button id="btn-camera-mode" onclick="toggleFreeCameraMode()" class="glass-panel px-3 py-2 sm:px-4 sm:py-2 rounded-2xl text-xs font-black text-sky-300 border border-sky-400/30 hover:bg-sky-500/20 transition-all flex items-center gap-2 active:scale-95 shadow-lg" title="Kamera Kontrolünü Değiştir">
                <i class="fa-solid fa-video text-xs"></i>
                <span id="camera-mode-label" class="hidden sm:inline">Serbest İnceleme</span>
            </button>

            <!-- Öğretmen Modu Butonu -->
            <button onclick="toggleTeacherModeModal()" class="glass-panel px-3 py-2 sm:px-4 sm:py-2 rounded-2xl text-xs font-black text-amber-300 border border-amber-400/30 hover:bg-amber-500/20 transition-all flex items-center gap-2 active:scale-95 shadow-lg" title="Öğretmen Kontrol Paneli">
                <i class="fa-solid fa-chalkboard-user text-xs"></i>
                <span class="hidden sm:inline">Öğretmen Modu</span>
            </button>

            <!-- Tam Ekran Butonu -->
            <button onclick="toggleFullscreen()" class="glass-panel p-2 sm:p-2.5 rounded-2xl text-xs font-black text-slate-300 hover:text-white border border-slate-700/50 hover:bg-slate-800 transition-all active:scale-95 shadow-lg" title="Tam Ekran Aç / Kapat">
                <i id="fullscreen-icon" class="fa-solid fa-expand"></i>
            </button>
        </div>
    </header>

    <!-- ============================================================== -->
    <!-- 🎬 SAHNE 1: SİNEMATİK AÇILIŞ BAŞLIK KARTI -->
    <!-- ============================================================== -->
    <div id="scene-1-title-overlay" class="absolute inset-0 z-15 flex flex-col items-center justify-center pointer-events-none p-6 text-center transition-opacity duration-700 opacity-0">
        <div class="space-y-4 max-w-2xl animate-title-cinematic">
            <span class="px-4 py-1.5 rounded-full text-xs sm:text-sm font-black bg-sky-500/20 text-sky-300 border border-sky-400/40 inline-flex items-center gap-2 shadow-2xl backdrop-blur-md">
                <span class="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse"></span>
                <span>FEN BİLİMLERİ • 1. ÜNİTE</span>
            </span>
            <h1 class="text-3xl sm:text-6xl font-black text-white tracking-tight drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)] leading-tight">
                GÜNEŞ SİSTEMİNDE<br><span class="bg-gradient-to-r from-amber-300 via-sky-300 to-indigo-300 bg-clip-text text-transparent">YOLCULUK</span>
            </h1>
            <p class="text-sm sm:text-xl font-bold text-slate-200 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                8 Gezegen, Gerçek Boyutlar ve Sonsuz Keşif!
            </p>
        </div>
    </div>

    <!-- ============================================================== -->
    <!-- ℹ️ BİLGİ KARTI HUD (SAHNELERE ÖZEL DİNAMİK BİLGİ PENCERESİ) -->
    <!-- ============================================================== -->
    <div id="info-card-container" class="absolute top-20 right-4 sm:right-6 z-20 max-w-sm w-full transition-all duration-500 pointer-events-none opacity-0 translate-y-3">
        <div id="info-card-content" class="glass-panel p-4 sm:p-5 rounded-3xl pointer-events-auto border-2 border-sky-400/30 text-white shadow-2xl">
            <!-- Dinamik İçerik Buraya Gelecek -->
        </div>
    </div>

    <!-- ============================================================== -->
    <!-- 🏀 SAHNE 5: TOP & GÜNLÜK NESNE KARŞILAŞTIRMA HUD -->
    <!-- ============================================================== -->
    <div id="ball-compare-hud" class="absolute top-20 left-4 sm:left-6 z-20 max-w-md w-full transition-all duration-500 pointer-events-none opacity-0 -translate-y-3">
        <div class="glass-panel-amber p-4 sm:p-5 rounded-3xl pointer-events-auto border-2 border-amber-400/40 text-white shadow-2xl">
            <div class="flex items-center justify-between pb-2.5 mb-3 border-b border-amber-500/20">
                <div class="flex items-center gap-2">
                    <span class="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-black text-sm border border-amber-500/30">
                        <i class="fa-solid fa-volleyball"></i>
                    </span>
                    <div>
                        <h4 class="text-sm sm:text-base font-black text-amber-300">Gezegenler Top Olsaydı?</h4>
                        <p class="text-[11px] text-slate-300">Dünya = 1 cm Çapında Cam Bilye Kabul Edilirse</p>
                    </div>
                </div>
                <span class="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/30">Referans Ölçek</span>
            </div>

            <!-- Liste Karşılaştırması -->
            <div class="space-y-2 text-xs font-semibold max-h-[45vh] overflow-y-auto pr-1">
                <div class="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <span class="flex items-center gap-2 font-bold text-amber-300">
                        <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Güneş
                    </span>
                    <span class="text-right"><strong>109 cm</strong> (Dev Pilates Topu)</span>
                </div>
                <div class="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <span class="flex items-center gap-2 text-slate-300">
                        <span class="w-2 h-2 rounded-full bg-slate-400"></span> Merkür
                    </span>
                    <span class="text-right"><strong>3,8 mm</strong> (Karabiber Tanesi)</span>
                </div>
                <div class="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <span class="flex items-center gap-2 text-yellow-200">
                        <span class="w-2 h-2 rounded-full bg-yellow-400"></span> Venüs
                    </span>
                    <span class="text-right"><strong>9,5 mm</strong> (Küçük Cam Bilye)</span>
                </div>
                <div class="p-2 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-between font-black text-sky-200">
                    <span class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-sky-400"></span> Dünya (Referans)
                    </span>
                    <span class="text-right"><strong>1,0 cm</strong> (Standart Cam Bilye)</span>
                </div>
                <div class="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <span class="flex items-center gap-2 text-rose-300">
                        <span class="w-2 h-2 rounded-full bg-rose-500"></span> Mars
                    </span>
                    <span class="text-right"><strong>5,3 mm</strong> (Nohut Tanesi)</span>
                </div>
                <div class="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <span class="flex items-center gap-2 text-orange-300">
                        <span class="w-2.5 h-2.5 rounded-full bg-orange-400"></span> Jüpiter
                    </span>
                    <span class="text-right"><strong>11,2 cm</strong> (Futbol / Voleybol Topu)</span>
                </div>
                <div class="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <span class="flex items-center gap-2 text-amber-200">
                        <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Satürn
                    </span>
                    <span class="text-right"><strong>9,5 cm</strong> (İri Greyfurt)</span>
                </div>
                <div class="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <span class="flex items-center gap-2 text-cyan-300">
                        <span class="w-2 h-2 rounded-full bg-cyan-400"></span> Uranüs
                    </span>
                    <span class="text-right"><strong>4,0 cm</strong> (Pinpon Topu)</span>
                </div>
                <div class="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <span class="flex items-center gap-2 text-blue-300">
                        <span class="w-2 h-2 rounded-full bg-blue-500"></span> Neptün
                    </span>
                    <span class="text-right"><strong>3,9 cm</strong> (Pinpon Topu)</span>
                </div>
            </div>
        </div>
    </div>

    <!-- ============================================================== -->
    <!-- 📏 SAHNE 6: GERÇEK UZAKLIK ÖLÇEĞİ / SİNEMATİK TOGGLE BUTONU -->
    <!-- ============================================================== -->
    <div id="distance-mode-hud" class="absolute top-20 left-4 sm:left-6 z-20 transition-all duration-500 pointer-events-none opacity-0 -translate-y-3">
        <div class="glass-panel p-3.5 rounded-2xl pointer-events-auto flex items-center gap-2 text-xs font-bold border border-sky-400/30">
            <span class="text-slate-300">Uzaklık Ölçeği:</span>
            <button id="btn-scale-cinematic" onclick="setDistanceScaleMode('cinematic')" class="px-3 py-1.5 rounded-xl bg-sky-600 text-white font-black">Sinematik</button>
            <button id="btn-scale-true" onclick="setDistanceScaleMode('true')" class="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold">Gerçek Uzaklık (AU)</button>
        </div>
    </div>

    <!-- ============================================================== -->
    <!-- 🏆 SAHNE 8: SİNEMATİK FİNAL OVERLAY -->
    <!-- ============================================================== -->
    <div id="scene-8-final-overlay" class="absolute inset-0 z-25 flex flex-col items-center justify-center pointer-events-none p-6 text-center transition-all duration-700 opacity-0 bg-slate-950/60 backdrop-blur-xs">
        <div class="space-y-5 max-w-lg p-8 rounded-3xl glass-panel border-2 border-sky-400/40 pointer-events-auto shadow-2xl">
            <div class="w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center text-3xl mx-auto shadow-xl shadow-sky-500/30">
                <i class="fa-solid fa-rocket"></i>
            </div>
            <div>
                <span class="text-xs font-black uppercase tracking-widest text-sky-400 block mb-1">TEBRİKLER! KEŞİF TAMAMLANDI</span>
                <h2 class="text-2xl sm:text-3xl font-black text-white">ROTALI FENCİ</h2>
                <p class="text-sm font-semibold text-slate-300 mt-1">Güneş Sistemi'ni ve 8 Gezegeni Başarıyla İnceledin!</p>
            </div>
            <div class="pt-2 flex items-center justify-center gap-3">
                <button onclick="jumpToScene(1)" class="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-sky-500/25 active:scale-95 cursor-pointer flex items-center gap-2">
                    <i class="fa-solid fa-rotate-left"></i>
                    <span>Yeniden İzle</span>
                </button>
                <button onclick="toggleTeacherModeModal()" class="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors border border-slate-700 cursor-pointer">
                    Öğretmen Paneli
                </button>
            </div>
        </div>
    </div>

    <!-- ============================================================== -->
    <!-- 🎮 ALT SİNEMATİK KONTROL KONSOLU (TIMELINE & BUTTONS) -->
    <!-- ============================================================== -->
    <div class="absolute bottom-0 left-0 right-0 z-20 p-3 sm:p-5 flex flex-col items-center pointer-events-none">
        <!-- Konsol Kutusu -->
        <div class="glass-panel p-3 sm:p-4 rounded-3xl pointer-events-auto max-w-4xl w-full border border-sky-500/30 shadow-2xl space-y-3">
            
            <!-- Üst: Sahne Başlığı ve İlerleme Çubuğu -->
            <div class="flex items-center justify-between gap-3 text-xs">
                <div class="flex items-center gap-2 min-w-0">
                    <span class="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse shrink-0"></span>
                    <span id="scene-title-badge" class="font-black text-sky-300 truncate">Sahne 1: Güneş Sistemi'ne Giriş</span>
                </div>
                <div class="flex items-center gap-2 text-[11px] text-slate-400 shrink-0 font-mono">
                    <span id="scene-timer-label">00:00</span>
                    <span>/</span>
                    <span id="scene-duration-label">00:10</span>
                </div>
            </div>

            <!-- Sahne Seçim Butonları (1 - 8 Sekmeleri) -->
            <div class="grid grid-cols-4 sm:grid-cols-8 gap-1.5 sm:gap-2">
                <button type="button" onclick="jumpToScene(1)" id="pill-scene-1" class="py-2 px-1 rounded-xl text-[10px] sm:text-[11px] font-black transition-all text-center border truncate bg-sky-600 text-white border-sky-400 shadow-md">1. Giriş</button>
                <button type="button" onclick="jumpToScene(2)" id="pill-scene-2" class="py-2 px-1 rounded-xl text-[10px] sm:text-[11px] font-bold transition-all text-center border truncate bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800">2. Sistem</button>
                <button type="button" onclick="jumpToScene(3)" id="pill-scene-3" class="py-2 px-1 rounded-xl text-[10px] sm:text-[11px] font-bold transition-all text-center border truncate bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800">3. Gezegenler</button>
                <button type="button" onclick="jumpToScene(4)" id="pill-scene-4" class="py-2 px-1 rounded-xl text-[10px] sm:text-[11px] font-bold transition-all text-center border truncate bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800">4. Boyutlar</button>
                <button type="button" onclick="jumpToScene(5)" id="pill-scene-5" class="py-2 px-1 rounded-xl text-[10px] sm:text-[11px] font-bold transition-all text-center border truncate bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800">5. Top Ölçeği</button>
                <button type="button" onclick="jumpToScene(6)" id="pill-scene-6" class="py-2 px-1 rounded-xl text-[10px] sm:text-[11px] font-bold transition-all text-center border truncate bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800">6. Uzaklıklar</button>
                <button type="button" onclick="jumpToScene(7)" id="pill-scene-7" class="py-2 px-1 rounded-xl text-[10px] sm:text-[11px] font-bold transition-all text-center border truncate bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800">7. Hareketler</button>
                <button type="button" onclick="jumpToScene(8)" id="pill-scene-8" class="py-2 px-1 rounded-xl text-[10px] sm:text-[11px] font-bold transition-all text-center border truncate bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800">8. Final</button>
            </div>

            <!-- Sahne İlerleme Çubuğu -->
            <div class="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                <div id="scene-progress-bar" class="h-full bg-gradient-to-r from-sky-400 to-indigo-500 w-0 transition-all duration-150"></div>
            </div>

            <!-- Alt Kontrol Düğmeleri (Oynat, Önceki, Sonraki, Hız) -->
            <div class="flex items-center justify-between gap-3 pt-1">
                <!-- Sol: Önceki / Oynat-Durdur / Sonraki / Baştan -->
                <div class="flex items-center gap-1.5 sm:gap-2">
                    <button type="button" onclick="restartAnimation()" class="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-bold border border-slate-700" title="Baştan Başlat">
                        <i class="fa-solid fa-backward-step"></i>
                    </button>
                    <button type="button" onclick="prevScene()" class="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-bold border border-slate-700" title="Önceki Sahne">
                        <i class="fa-solid fa-chevron-left"></i>
                    </button>
                    <button type="button" id="btn-play-pause" onclick="togglePlayPause()" class="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-black text-xs transition-all shadow-md shadow-sky-500/30 flex items-center gap-2 active:scale-95" title="Oynat / Duraklat">
                        <i id="play-pause-icon" class="fa-solid fa-pause"></i>
                        <span id="play-pause-text" class="hidden sm:inline">Duraklat</span>
                    </button>
                    <button type="button" onclick="nextScene()" class="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-bold border border-slate-700" title="Sonraki Sahne">
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>
                </div>

                <!-- Sağ: Oynatma Hızı Seçici -->
                <div class="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700/60 text-[11px] font-black">
                    <span class="text-slate-400 px-1 hidden sm:inline text-[10px]">HIZ:</span>
                    <button type="button" onclick="setSpeed(0.5)" id="speed-0-5" class="px-2 py-1 rounded-lg text-slate-400 hover:text-white transition-colors">0.5x</button>
                    <button type="button" onclick="setSpeed(1.0)" id="speed-1-0" class="px-2 py-1 rounded-lg bg-sky-600 text-white shadow-xs">1x</button>
                    <button type="button" onclick="setSpeed(1.5)" id="speed-1-5" class="px-2 py-1 rounded-lg text-slate-400 hover:text-white transition-colors">1.5x</button>
                    <button type="button" onclick="setSpeed(2.0)" id="speed-2-0" class="px-2 py-1 rounded-lg text-slate-400 hover:text-white transition-colors">2x</button>
                </div>
            </div>
        </div>
    </div>

    <!-- ============================================================== -->
    <!-- 📸 SAĞ ALT: INSTAGRAM KÜNYESİ (@rotalifenci) -->
    <!-- ============================================================== -->
    <a href="https://www.instagram.com/rotalifenci/" target="_blank" rel="noopener noreferrer" class="absolute bottom-3 right-3 sm:bottom-4 sm:right-5 z-30 pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-slate-300 hover:text-white hover:border-pink-500/50 text-[11px] font-bold transition-all shadow-lg group">
        <i class="fa-brands fa-instagram text-pink-500 text-sm group-hover:scale-110 transition-transform"></i>
        <span>@rotalifenci</span>
    </a>

    <!-- ============================================================== -->
    <!-- 👨‍🏫 ÖĞRETMEN MODU MODALI (SMARTBOARD & DERS KONTROLLERİ) -->
    <!-- ============================================================== -->
    <div id="teacher-modal" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md hidden items-center justify-center p-4 transition-all duration-300" onclick="if(event.target === this) toggleTeacherModeModal()">
        <div class="bg-slate-900 border-2 border-amber-500/40 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative text-white animate-in zoom-in-95 duration-200">
            <!-- Modal Başlık -->
            <div class="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
                <div class="flex items-center gap-3">
                    <span class="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-xl border border-amber-500/30 shadow-md">
                        <i class="fa-solid fa-chalkboard-user"></i>
                    </span>
                    <div>
                        <h3 class="text-lg font-black text-white">Öğretmen Kontrol Paneli</h3>
                        <p class="text-xs text-slate-400">Akıllı tahtada sınıf etkileşimini ve soru-cevap sürecini yönetin</p>
                    </div>
                </div>
                <button type="button" onclick="toggleTeacherModeModal()" class="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer">
                    <i class="fa-solid fa-xmark text-sm"></i>
                </button>
            </div>

            <!-- Ayarlar ve Toggles -->
            <div class="space-y-4">
                <!-- 1. Gezegen İsimlerini Gizle (Soru - Cevap Modu) -->
                <div class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                    <div>
                        <span class="text-xs font-black text-white block">Gezegen İsimlerini Göster</span>
                        <span class="text-[11px] text-slate-400">Kapatıldığında öğrenciler gezegenleri görüntüsünden tahmin eder</span>
                    </div>
                    <button type="button" id="toggle-names-btn" onclick="togglePlanetNamesVisibility()" class="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs">
                        Açık
                    </button>
                </div>

                <!-- 2. Bilgi Kartlarını Göster / Gizle -->
                <div class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                    <div>
                        <span class="text-xs font-black text-white block">Ayrıntılı Bilgi Kartları (HUD)</span>
                        <span class="text-[11px] text-slate-400">Gezegen özellikleri ve bilimsel verileri içeren kartlar</span>
                    </div>
                    <button type="button" id="toggle-info-btn" onclick="toggleInfoCardsVisibility()" class="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs">
                        Açık
                    </button>
                </div>

                <!-- 3. Yörünge Çizgilerini ve Yön Oklarını Göster -->
                <div class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                    <div>
                        <span class="text-xs font-black text-white block">Yörünge Çizgileri & Yön Okları</span>
                        <span class="text-[11px] text-slate-400">Dolanma yörüngeleri ve saat yönünün tersi hareket okları</span>
                    </div>
                    <button type="button" id="toggle-orbits-btn" onclick="toggleOrbitsVisibility()" class="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs">
                        Açık
                    </button>
                </div>

                <!-- Sık Kullanılan Konu Kısayolları -->
                <div class="pt-2">
                    <span class="text-xs font-black uppercase tracking-wider text-amber-300 block mb-2.5">Doğrudan Sahneye Atla</span>
                    <div class="grid grid-cols-2 gap-2">
                        <button type="button" onclick="jumpToScene(3); toggleTeacherModeModal();" class="p-2.5 rounded-xl bg-slate-800 hover:bg-sky-600 text-white text-xs font-bold transition-all text-left flex items-center gap-2 border border-slate-700">
                            <i class="fa-solid fa-magnifying-glass text-sky-400"></i>
                            <span>Gezegen Turu</span>
                        </button>
                        <button type="button" onclick="jumpToScene(4); toggleTeacherModeModal();" class="p-2.5 rounded-xl bg-slate-800 hover:bg-sky-600 text-white text-xs font-bold transition-all text-left flex items-center gap-2 border border-slate-700">
                            <i class="fa-solid fa-arrows-left-right text-amber-400"></i>
                            <span>Gerçek Boyutlar</span>
                        </button>
                        <button type="button" onclick="jumpToScene(5); toggleTeacherModeModal();" class="p-2.5 rounded-xl bg-slate-800 hover:bg-sky-600 text-white text-xs font-bold transition-all text-left flex items-center gap-2 border border-slate-700">
                            <i class="fa-solid fa-volleyball text-emerald-400"></i>
                            <span>Top Ölçeği (Video)</span>
                        </button>
                        <button type="button" onclick="jumpToScene(7); toggleTeacherModeModal();" class="p-2.5 rounded-xl bg-slate-800 hover:bg-sky-600 text-white text-xs font-bold transition-all text-left flex items-center gap-2 border border-slate-700">
                            <i class="fa-solid fa-rotate text-purple-400"></i>
                            <span>Dönme & Dolanma</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Alt Kapatma -->
            <div class="pt-5 mt-5 border-t border-slate-800 flex justify-end">
                <button type="button" onclick="toggleTeacherModeModal()" class="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs transition-colors">
                    Tamam
                </button>
            </div>
        </div>
    </div>

    <!-- ============================================================== -->
    <!-- 🚀 THREE.JS & SİNEMATİK ANİMASYON MOTORU -->
    <!-- ============================================================== -->
    <script>
        /* -------------------------------------------------------------
           1. BİLİMSEL VERİLER (MEB 6. SINIF KAZANIMLARI & NASA VERİLERİ)
        ------------------------------------------------------------- */
        const PLANETS_DATA = [
            {
                id: "mercury",
                name: "Merkür",
                type: "Karasal (İç) Gezegen",
                color: "#94a3b8",
                order: 1,
                realDiameterKm: 4879,
                scaleRadius: 1.2,
                ballObject: "3,8 mm Karabiber Tanesi",
                ballRadius: 0.38,
                rotationPeriod: "58,6 Dünya günü",
                orbitalPeriod: "88 Dünya günü",
                distanceKm: "57,9 milyon km (0,39 AU)",
                lightTime: "3,2 dakika",
                tiltDeg: 0.03,
                retrograde: false,
                fact: "Güneş'e en yakın ve Güneş Sistemi'nin en küçük gezegenidir. Atmosferi neredeyse olmadığı için yüzeyi kraterlerle kaplıdır; gece ile gündüz sıcaklık farkı 600°C'yi bulur!"
            },
            {
                id: "venus",
                name: "Venüs",
                type: "Karasal (İç) Gezegen",
                color: "#fbbf24",
                order: 2,
                realDiameterKm: 12104,
                scaleRadius: 2.8,
                ballObject: "9,5 mm Cam Bilye",
                ballRadius: 0.95,
                rotationPeriod: "243 Dünya günü (Ters Yön)",
                orbitalPeriod: "224,7 Dünya günü",
                distanceKm: "108,2 milyon km (0,72 AU)",
                lightTime: "6,0 dakika",
                tiltDeg: 177.3,
                retrograde: true, // Venüs saat yönünde ters döner!
                fact: "Güneş Sistemi'nin EN SICAK gezegenidir (~465°C). Kalın karbondioksit atmosferi devasa bir sera etkisi yaratır. Diğer gezegenlerin aksine KENDİ EKSENİNDE TERS (DOĞUDAN BATIYA) DÖNER!"
            },
            {
                id: "earth",
                name: "Dünya",
                type: "Karasal (İç) Gezegen",
                color: "#38bdf8",
                order: 3,
                realDiameterKm: 12742,
                scaleRadius: 3.0,
                ballObject: "1,0 cm Cam Bilye (Referans)",
                ballRadius: 1.0,
                rotationPeriod: "24 saat (1 gün)",
                orbitalPeriod: "365 gün 6 saat (1 yıl)",
                distanceKm: "149,6 milyon km (1,0 AU)",
                lightTime: "8,3 dakika",
                tiltDeg: 23.5,
                retrograde: false,
                fact: "Üzerinde yaşam olduğu bilinen tek gök cismidir! Yüzeyinin %71'i sıvı suyla kaplıdır (Mavi Gezegen). 23,5 derecelik eksen eğikliği mevsimlerin oluşmasını sağlar."
            },
            {
                id: "mars",
                name: "Mars",
                type: "Karasal (İç) Gezegen",
                color: "#ea580c",
                order: 4,
                realDiameterKm: 6779,
                scaleRadius: 1.6,
                ballObject: "5,3 mm Nohut Tanesi",
                ballRadius: 0.53,
                rotationPeriod: "24 saat 37 dakika",
                orbitalPeriod: "687 Dünya günü",
                distanceKm: "227,9 milyon km (1,52 AU)",
                lightTime: "12,6 dakika",
                tiltDeg: 25.2,
                retrograde: false,
                fact: "Yüzeyindeki yoğun demir oksit (pas) nedeniyle 'Kızıl Gezegen' olarak bilinir. Güneş Sistemi'nin en yüksek dağı Olympus Mons (22 km) ve kutuplarında buzullar bulunur."
            },
            {
                id: "jupiter",
                name: "Jüpiter",
                type: "Gazsal (Dış) Dev Gezegen",
                color: "#f97316",
                order: 5,
                realDiameterKm: 139820,
                scaleRadius: 11.2,
                ballObject: "11,2 cm Futbol / Voleybol Topu",
                ballRadius: 11.2,
                rotationPeriod: "9 saat 55 dakika (En Hızlı)",
                orbitalPeriod: "11,86 Dünya yılı",
                distanceKm: "778,5 milyon km (5,2 AU)",
                lightTime: "43,2 dakika",
                tiltDeg: 3.1,
                retrograde: false,
                fact: "Güneş Sistemi'nin EN BÜYÜK gezegenidir; içine yaklaşık 1.300 Dünya sığabilir! Üzerindeki asırlardır süren devasa fırtına 'Büyük Kırmızı Leke' Dünya'dan daha geniştir."
            },
            {
                id: "saturn",
                name: "Satürn",
                type: "Gazsal (Dış) Dev Gezegen",
                color: "#eab308",
                order: 6,
                realDiameterKm: 116460,
                scaleRadius: 9.5,
                ballObject: "9,5 cm İri Greyfurt",
                ballRadius: 9.5,
                rotationPeriod: "10 saat 33 dakika",
                orbitalPeriod: "29,45 Dünya yılı",
                distanceKm: "1,43 milyar km (9,58 AU)",
                lightTime: "1 saat 19 dakika",
                tiltDeg: 26.7,
                retrograde: false,
                fact: "Göz alıcı ve muhteşem buz/kayaç halka sistemiyle ünlüdür. Yoğunluğu sudan daha düşüktür; eğer Satürn'ü koyabilecek büyüklükte bir okyanus olsaydı Satürn su üstünde yüzerdi!"
            },
            {
                id: "uranus",
                name: "Uranüs",
                type: "Gazsal (Buz Devi) Gezegen",
                color: "#22d3ee",
                order: 7,
                realDiameterKm: 50724,
                scaleRadius: 4.0,
                ballObject: "4,0 cm Pinpon Topu",
                ballRadius: 4.0,
                rotationPeriod: "17 saat 14 dakika (Ters/Yan)",
                orbitalPeriod: "84 Dünya yılı",
                distanceKm: "2,87 milyar km (19,2 AU)",
                lightTime: "2 saat 40 dakika",
                tiltDeg: 97.8,
                retrograde: true, // Uranüs neredeyse 98 derece yan yatarak yuvarlanır!
                fact: "97,8 derecelik devasa eksen eğikliği nedeniyle yörüngesinde 'yuvarlanan bir varil gibi' yan yatarak dolanır! Atmosferindeki metan gazı ona açık mavi-yeşil rengini verir."
            },
            {
                id: "neptune",
                name: "Neptün",
                type: "Gazsal (Buz Devi) Gezegen",
                color: "#3b82f6",
                order: 8,
                realDiameterKm: 49244,
                scaleRadius: 3.9,
                ballObject: "3,9 cm Pinpon Topu",
                ballRadius: 3.9,
                rotationPeriod: "16 saat 6 dakika",
                orbitalPeriod: "164,8 Dünya yılı",
                distanceKm: "4,50 milyar km (30,1 AU)",
                lightTime: "4 saat 10 dakika",
                tiltDeg: 28.3,
                retrograde: false,
                fact: "Güneş'e en uzak gezegendir. Derin lacivert rengiyle bilinir. Güneş Sistemi'nin EN ŞİDDETLİ RÜZGÂRLARI burada eser (saatte 2.000 km'yi aşan fırtınalar)!"
            }
        ];

        /* -------------------------------------------------------------
           2. PROCEDURAL HIGH-RES NASA PBR KAPLAMALARI (CANVAS ENGINE)
        ------------------------------------------------------------- */
        function createSunCanvasTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');

            // Akkor plazma gradyanı
            const grad = ctx.createLinearGradient(0, 0, 0, 512);
            grad.addColorStop(0, '#ea580c');
            grad.addColorStop(0.2, '#f59e0b');
            grad.addColorStop(0.5, '#fef08a');
            grad.addColorStop(0.8, '#f59e0b');
            grad.addColorStop(1, '#ea580c');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 1024, 512);

            // Granüller (Konveksiyon hücreleri)
            for (let i = 0; i < 450; i++) {
                const x = Math.random() * 1024;
                const y = Math.random() * 512;
                const r = 6 + Math.random() * 22;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fillStyle = Math.random() > 0.4 ? 'rgba(254, 240, 138, 0.45)' : 'rgba(180, 83, 9, 0.35)';
                ctx.fill();
            }

            // Gerçekçi Güneş Lekeleri (Umbra & Penumbra)
            const spots = [
                { x: 320, y: 220, r: 14 },
                { x: 345, y: 225, r: 9 },
                { x: 680, y: 290, r: 16 },
                { x: 705, y: 295, r: 10 },
                { x: 500, y: 190, r: 11 },
                { x: 820, y: 240, r: 13 }
            ];

            spots.forEach(s => {
                // Penumbra (Açık kahverengi aktif bölge)
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = '#7c2d12';
                ctx.fill();
                // Umbra (Karanlık çekirdek ~3.500°C)
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r * 0.55, 0, Math.PI * 2);
                ctx.fillStyle = '#1c0702';
                ctx.fill();
            });

            const tex = new THREE.CanvasTexture(canvas);
            tex.wrapS = THREE.RepeatWrapping;
            return tex;
        }

        function createPlanetCanvasTexture(planetId) {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');

            if (planetId === 'mercury') {
                ctx.fillStyle = '#64748b';
                ctx.fillRect(0, 0, 1024, 512);
                // Kraterler ve dağlık kayaçlar
                for (let i = 0; i < 400; i++) {
                    const x = Math.random() * 1024;
                    const y = Math.random() * 512;
                    const r = 2 + Math.random() * 14;
                    ctx.beginPath();
                    ctx.arc(x, y, r, 0, Math.PI * 2);
                    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(226, 232, 240, 0.35)' : 'rgba(15, 23, 42, 0.5)';
                    ctx.fill();
                }
            } else if (planetId === 'venus') {
                const grad = ctx.createLinearGradient(0, 0, 0, 512);
                grad.addColorStop(0, '#eab308');
                grad.addColorStop(0.3, '#fef08a');
                grad.addColorStop(0.7, '#fef9c3');
                grad.addColorStop(1, '#ca8a04');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, 1024, 512);
                // Kalın kükürtlü bulut şeritleri
                for (let i = 0; i < 30; i++) {
                    ctx.beginPath();
                    ctx.moveTo(0, i * 18);
                    for (let x = 0; x < 1024; x += 40) {
                        ctx.lineTo(x, (i * 18) + Math.sin(x * 0.02) * 12);
                    }
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
                    ctx.lineWidth = 14;
                    ctx.stroke();
                }
            } else if (planetId === 'earth') {
                // Okyanuslar
                ctx.fillStyle = '#0a2e5c';
                ctx.fillRect(0, 0, 1024, 512);
                // Turkuaz kıyılar
                ctx.fillStyle = '#0284c7';
                ctx.globalAlpha = 0.35;
                ctx.fillRect(0, 0, 1024, 512);
                ctx.globalAlpha = 1.0;

                // Kıtalar (Gerçekçi Coğrafya)
                ctx.fillStyle = '#1e7b42';
                // Avrupa & Afrika
                ctx.beginPath();
                ctx.ellipse(510, 240, 80, 110, 0.2, 0, Math.PI * 2);
                ctx.fill();
                // Asya
                ctx.fillStyle = '#15803d';
                ctx.beginPath();
                ctx.ellipse(710, 180, 130, 85, -0.2, 0, Math.PI * 2);
                ctx.fill();
                // Kuzey & Güney Amerika
                ctx.fillStyle = '#166534';
                ctx.beginPath();
                ctx.ellipse(230, 160, 95, 65, 0.4, 0, Math.PI * 2);
                ctx.ellipse(320, 320, 60, 95, -0.2, 0, Math.PI * 2);
                ctx.fill();
                // Avustralya
                ctx.fillStyle = '#b45309';
                ctx.beginPath();
                ctx.ellipse(820, 340, 50, 35, 0.1, 0, Math.PI * 2);
                ctx.fill();
                // Kutuplar
                ctx.fillStyle = '#f8fafc';
                ctx.fillRect(0, 0, 1024, 30);
                ctx.fillRect(0, 482, 1024, 30);
            } else if (planetId === 'mars') {
                ctx.fillStyle = '#c2410c';
                ctx.fillRect(0, 0, 1024, 512);
                // Koyu bazalt lekeleri
                ctx.fillStyle = '#7c2d12';
                for (let i = 0; i < 45; i++) {
                    ctx.beginPath();
                    ctx.arc(Math.random() * 1024, Math.random() * 512, 15 + Math.random() * 45, 0, Math.PI * 2);
                    ctx.fill();
                }
                // Olympus Mons (Dev volkan)
                ctx.beginPath();
                ctx.arc(380, 240, 26, 0, Math.PI * 2);
                ctx.fillStyle = '#9a3412';
                ctx.fill();
                ctx.strokeStyle = '#ea580c';
                ctx.lineWidth = 3;
                ctx.stroke();
                // Beyaz kutup buzulları
                ctx.fillStyle = '#f8fafc';
                ctx.fillRect(0, 0, 1024, 22);
                ctx.fillRect(0, 490, 1024, 22);
            } else if (planetId === 'jupiter') {
                // Gaz kuşakları
                const bands = ['#ea580c', '#fed7aa', '#c2410c', '#ffedd5', '#9a3412', '#fed7aa', '#ea580c', '#c2410c'];
                for (let i = 0; i < bands.length; i++) {
                    ctx.fillStyle = bands[i];
                    ctx.fillRect(0, i * (512 / bands.length), 1024, 512 / bands.length);
                }
                // Dalgalı fırtına kenarları
                for (let y = 40; y < 480; y += 60) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    for (let x = 0; x < 1024; x += 35) {
                        ctx.lineTo(x, y + Math.sin(x * 0.04) * 8);
                    }
                    ctx.lineWidth = 10;
                    ctx.strokeStyle = 'rgba(255, 237, 213, 0.35)';
                    ctx.stroke();
                }
                // Büyük Kırmızı Leke (Great Red Spot)
                ctx.fillStyle = '#991b1b';
                ctx.beginPath();
                ctx.ellipse(660, 310, 48, 26, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#f87171';
                ctx.lineWidth = 4;
                ctx.stroke();
            } else if (planetId === 'saturn') {
                const bands = ['#eab308', '#fef08a', '#ca8a04', '#fef9c3', '#a16207', '#fef08a'];
                for (let i = 0; i < bands.length; i++) {
                    ctx.fillStyle = bands[i];
                    ctx.fillRect(0, i * (512 / bands.length), 1024, 512 / bands.length);
                }
            } else if (planetId === 'uranus') {
                const grad = ctx.createLinearGradient(0, 0, 0, 512);
                grad.addColorStop(0, '#22d3ee');
                grad.addColorStop(0.5, '#a5f3fc');
                grad.addColorStop(1, '#0891b2');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, 1024, 512);
            } else if (planetId === 'neptune') {
                const grad = ctx.createLinearGradient(0, 0, 0, 512);
                grad.addColorStop(0, '#1d4ed8');
                grad.addColorStop(0.5, '#3b82f6');
                grad.addColorStop(1, '#1e3a8a');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, 1024, 512);
                // Beyaz cirrus metan bulutları
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
                ctx.lineWidth = 3.5;
                for (let i = 0; i < 12; i++) {
                    const y = 90 + i * 30;
                    ctx.beginPath();
                    ctx.moveTo(150, y);
                    ctx.lineTo(850, y + 4);
                    ctx.stroke();
                }
            }

            const tex = new THREE.CanvasTexture(canvas);
            tex.wrapS = THREE.RepeatWrapping;
            return tex;
        }

        // ☁️ Dünya Bulutları Dokusu
        function createEarthCloudsTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, 1024, 512);

            ctx.fillStyle = '#ffffff';
            for (let i = 0; i < 140; i++) {
                const x = Math.random() * 1024;
                const y = Math.random() * 512;
                const rx = 25 + Math.random() * 70;
                const ry = 8 + Math.random() * 22;
                ctx.globalAlpha = 0.15 + Math.random() * 0.45;
                ctx.beginPath();
                ctx.ellipse(x, y, rx, ry, Math.random() * 0.4, 0, Math.PI * 2);
                ctx.fill();
            }
            return new THREE.CanvasTexture(canvas);
        }

        // 🪐 Satürn Halkası Dokusu (Cassini Bölümü Dahil)
        function createSaturnRingTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');

            const grad = ctx.createLinearGradient(0, 0, 512, 0);
            grad.addColorStop(0.0, 'rgba(0,0,0,0)');
            grad.addColorStop(0.12, 'rgba(217, 119, 6, 0.55)'); // C Halkası
            grad.addColorStop(0.35, 'rgba(251, 191, 36, 0.95)'); // B Halkası
            grad.addColorStop(0.58, 'rgba(0, 0, 0, 0.05)'); // Cassini Bölümü (Boşluk)
            grad.addColorStop(0.65, 'rgba(245, 158, 11, 0.85)'); // A Halkası
            grad.addColorStop(0.95, 'rgba(217, 119, 6, 0.35)');
            grad.addColorStop(1.0, 'rgba(0,0,0,0)');

            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 512, 64);

            return new THREE.CanvasTexture(canvas);
        }

        /* -------------------------------------------------------------
           3. THREE.JS SAHNE, KAMERA VE RENDER MOTORU
        ------------------------------------------------------------- */
        let scene, camera, renderer, controls;
        const container = document.getElementById('webgl-container');
        const labelsContainer = document.getElementById('labels-container');

        // Nesne Referansları
        let sunMesh, sunCoronaMesh, sunLight;
        let planetGroups = []; // { id, data, mesh, pivot, cloudMesh, ringMesh, labelEl, ballMesh, currentAngle }
        let starfield;
        let orbitLineMeshes = [];

        // Animasyon ve Sahne Durumu
        let currentSceneIndex = 1; // 1 ile 8 arası
        let sceneElapsedTime = 0;
        const SCENE_DURATIONS = [0, 8, 12, 32, 18, 22, 16, 20, 14]; // Saniyeler
        let isPlaying = true;
        let playbackSpeed = 1.0;
        let isFreeCamera = false;
        let distanceScaleMode = 'cinematic'; // 'cinematic' | 'true'
        let currentPlanetTourIndex = 0; // Sahne 3 için

        // Öğretmen Modu Bayrakları
        let isNamesVisible = true;
        let isInfoCardsVisible = true;
        let isOrbitsVisible = true;

        // Kamera Hedefleri (Interpolasyon)
        let camTargetPos = new THREE.Vector3(0, 25, 80);
        let camTargetLookAt = new THREE.Vector3(0, 0, 0);
        let camCurrentLookAt = new THREE.Vector3(0, 0, 0);

        function initThreeEngine() {
            // Sahne
            scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2(0x020308, 0.0008);

            // Kamera
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
            camera.position.set(0, 50, 140);

            // Renderer
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.15;
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            container.appendChild(renderer.domElement);

            // OrbitControls
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.maxDistance = 1200;
            controls.minDistance = 2;
            controls.enabled = false; // Başlangıçta animasyon kamerası aktif

            // Işıklar
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.28);
            scene.add(ambientLight);

            sunLight = new THREE.PointLight(0xfff7ed, 3.2, 2000, 0.3);
            sunLight.position.set(0, 0, 0);
            scene.add(sunLight);

            buildDeepSpaceStarfield();
            buildSun();
            buildPlanets();
            setupLabels();

            window.addEventListener('resize', onWindowResize, false);

            // İlk sahneyi başlat
            jumpToScene(1);

            requestAnimationFrame(animateLoop);
        }

        /* -------------------------------------------------------------
           4. UZAY DERİNLİĞİ & YILDIZLAR
        ------------------------------------------------------------- */
        function buildDeepSpaceStarfield() {
            const starsCount = 2800;
            const starGeo = new THREE.BufferGeometry();
            const starPos = new Float32Array(starsCount * 3);
            const starColors = new Float32Array(starsCount * 3);

            for (let i = 0; i < starsCount * 3; i += 3) {
                const r = 400 + Math.random() * 1200;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos((Math.random() * 2) - 1);

                starPos[i] = r * Math.sin(phi) * Math.cos(theta);
                starPos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
                starPos[i + 2] = r * Math.cos(phi);

                // Beyaz, buz mavisi ve hafif kehribar yıldız renkleri
                const tone = Math.random();
                if (tone > 0.8) {
                    starColors[i] = 0.7; starColors[i + 1] = 0.85; starColors[i + 2] = 1.0; // Mavi dev
                } else if (tone > 0.6) {
                    starColors[i] = 1.0; starColors[i + 1] = 0.85; starColors[i + 2] = 0.6; // Kehribar cüce
                } else {
                    starColors[i] = 1.0; starColors[i + 1] = 1.0; starColors[i + 2] = 1.0; // Beyaz
                }
            }

            starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
            starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

            const starMat = new THREE.PointsMaterial({
                size: 2.2,
                vertexColors: true,
                transparent: true,
                opacity: 0.9,
                depthWrite: false
            });

            starfield = new THREE.Points(starGeo, starMat);
            scene.add(starfield);
        }

        /* -------------------------------------------------------------
           5. GÜNEŞ MODELİ (AKKOR KÜRE & KORONA ETKİSİ)
        ------------------------------------------------------------- */
        function buildSun() {
            const sunGeo = new THREE.SphereGeometry(18, 48, 48);
            const sunMat = new THREE.MeshBasicMaterial({
                map: createSunCanvasTexture()
            });
            sunMesh = new THREE.Mesh(sunGeo, sunMat);
            sunMesh.position.set(0, 0, 0);
            scene.add(sunMesh);

            // Korona Işıma Katmanı
            const coronaGeo = new THREE.SphereGeometry(21.5, 32, 32);
            const coronaMat = new THREE.MeshBasicMaterial({
                color: 0xf59e0b,
                transparent: true,
                opacity: 0.28,
                side: THREE.BackSide,
                blending: THREE.AdditiveBlending
            });
            sunCoronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
            sunMesh.add(sunCoronaMesh);
        }

        /* -------------------------------------------------------------
           6. SEKİZ GEZEGENİN 3D MODELLERİ & YÖRÜNGELERİ
        ------------------------------------------------------------- */
        function buildPlanets() {
            // Sahne 2 & 7 için Sinematik Yörünge Yarıçapları
            const cinematicRadii = [30, 42, 56, 70, 94, 122, 148, 172];

            PLANETS_DATA.forEach((data, index) => {
                const pivot = new THREE.Group();
                scene.add(pivot);

                // Gezegen Küresi
                const geo = new THREE.SphereGeometry(data.scaleRadius, 40, 40);
                const mat = new THREE.MeshStandardMaterial({
                    map: createPlanetCanvasTexture(data.id),
                    roughness: data.id === 'earth' ? 0.45 : 0.7,
                    metalness: 0.05
                });
                const mesh = new THREE.Mesh(geo, mat);
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                // Eksen Eğikliği
                mesh.rotation.z = THREE.MathUtils.degToRad(data.tiltDeg);

                // Başlangıç Sinematik Konumu
                const r = cinematicRadii[index];
                mesh.position.set(r, 0, 0);
                pivot.add(mesh);

                let cloudMesh = null;
                // Dünya Bulut Katmanı
                if (data.id === 'earth') {
                    const cloudGeo = new THREE.SphereGeometry(data.scaleRadius * 1.025, 36, 36);
                    const cloudMat = new THREE.MeshStandardMaterial({
                        map: createEarthCloudsTexture(),
                        transparent: true,
                        opacity: 0.65,
                        blending: THREE.NormalBlending
                    });
                    cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
                    mesh.add(cloudMesh);
                }

                let ringMesh = null;
                // Satürn Halkası
                if (data.id === 'saturn') {
                    const ringGeo = new THREE.RingGeometry(data.scaleRadius * 1.35, data.scaleRadius * 2.5, 64);
                    // Ring geometry düzlemi XY'dir, XZ'ye çevir:
                    ringGeo.rotateX(Math.PI / 2);
                    const ringMat = new THREE.MeshStandardMaterial({
                        map: createSaturnRingTexture(),
                        side: THREE.DoubleSide,
                        transparent: true,
                        opacity: 0.95
                    });
                    ringMesh = new THREE.Mesh(ringGeo, ringMat);
                    ringMesh.rotation.z = THREE.MathUtils.degToRad(26.7);
                    mesh.add(ringMesh);
                }

                // Sahne 5: Günlük Nesne Modeli (Top, nohut, bilye)
                const ballGeo = new THREE.SphereGeometry(data.ballRadius * 0.9, 32, 32);
                let ballColor = 0xffffff;
                if (data.id === 'jupiter') ballColor = 0xf97316; // Basket/voleybol
                if (data.id === 'saturn') ballColor = 0xfacc15; // Greyfurt
                if (data.id === 'mars') ballColor = 0xd97706; // Nohut
                if (data.id === 'earth') ballColor = 0x38bdf8; // Bilye
                if (data.id === 'mercury') ballColor = 0x334155; // Karabiber
                if (data.id === 'venus') ballColor = 0xfef08a; // Bilye
                if (data.id === 'uranus' || data.id === 'neptune') ballColor = 0xffffff; // Pinpon topu

                const ballMat = new THREE.MeshStandardMaterial({
                    color: ballColor,
                    roughness: 0.6,
                    metalness: 0.1
                });
                const ballMesh = new THREE.Mesh(ballGeo, ballMat);
                ballMesh.visible = false;
                scene.add(ballMesh);

                // Yörünge İnce Çizgisi
                const orbitGeo = new THREE.BufferGeometry();
                const orbitPts = [];
                for (let a = 0; a <= 128; a++) {
                    const angle = (a / 128) * Math.PI * 2;
                    orbitPts.push(Math.cos(angle) * r, 0, Math.sin(angle) * r);
                }
                orbitGeo.setAttribute('position', new THREE.Float32BufferAttribute(orbitPts, 3));
                const orbitMat = new THREE.LineBasicMaterial({
                    color: 0x38bdf8,
                    transparent: true,
                    opacity: 0.22
                });
                const orbitLine = new THREE.Line(orbitGeo, orbitMat);
                scene.add(orbitLine);
                orbitLineMeshes.push(orbitLine);

                // Dinamik Etiket
                const label = document.createElement('div');
                label.className = 'world-label px-2.5 py-1 rounded-xl glass-pill text-white text-[11px] font-bold border border-sky-400/30';
                label.innerHTML = \`<span class="w-1.5 h-1.5 rounded-full inline-block mr-1.5" style="background:\${data.color}"></span>\${data.name}\`;
                labelsContainer.appendChild(label);

                planetGroups.push({
                    id: data.id,
                    data,
                    mesh,
                    pivot,
                    cloudMesh,
                    ringMesh,
                    ballMesh,
                    orbitLine,
                    labelEl: label,
                    cinematicRadius: r,
                    currentAngle: (index * (Math.PI / 4)) // Başlangıç fazı
                });
            });
        }

        /* -------------------------------------------------------------
           7. 3D ETİKETLERİN EKRANA PROJEKSİYONU
        ------------------------------------------------------------- */
        const tempVec = new THREE.Vector3();
        function setupLabels() {
            // Başlangıçta etiketler görünür
        }

        function updateLabels() {
            if (!isNamesVisible || currentSceneIndex === 1 || currentSceneIndex === 8) {
                planetGroups.forEach(p => p.labelEl.style.opacity = '0');
                return;
            }

            planetGroups.forEach(p => {
                p.mesh.getWorldPosition(tempVec);
                // Gezegenin biraz üstüne taşı
                tempVec.y += p.data.scaleRadius + 1.2;

                // Kamera arkasında mı?
                tempVec.project(camera);
                if (tempVec.z > 1) {
                    p.labelEl.style.opacity = '0';
                    return;
                }

                const x = (tempVec.x * 0.5 + 0.5) * window.innerWidth;
                const y = (-(tempVec.y * 0.5) + 0.5) * window.innerHeight;

                p.labelEl.style.left = \`\${x}px\`;
                p.labelEl.style.top = \`\${y}px\`;
                p.labelEl.style.opacity = '1';
            });
        }

        /* -------------------------------------------------------------
           8. SEKİZ SİNEMATİK SAHNE YÖNETİMİ
        ------------------------------------------------------------- */
        function jumpToScene(sceneNum) {
            currentSceneIndex = sceneNum;
            sceneElapsedTime = 0;

            // UI Butonlarını Güncelle
            for (let i = 1; i <= 8; i++) {
                const btn = document.getElementById(\`pill-scene-\${i}\`);
                if (btn) {
                    if (i === sceneNum) {
                        btn.className = "py-2 px-1 rounded-xl text-[10px] sm:text-[11px] font-black transition-all text-center border truncate bg-sky-600 text-white border-sky-400 shadow-md";
                    } else {
                        btn.className = "py-2 px-1 rounded-xl text-[10px] sm:text-[11px] font-bold transition-all text-center border truncate bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800";
                    }
                }
            }

            document.getElementById('header-scene-pill').textContent = \`Sahne \${sceneNum} / 8\`;
            document.getElementById('scene-duration-label').textContent = formatTime(SCENE_DURATIONS[sceneNum]);

            // HUD Görünürlüklerini Ayarla
            const s1Title = document.getElementById('scene-1-title-overlay');
            const infoCard = document.getElementById('info-card-container');
            const ballHud = document.getElementById('ball-compare-hud');
            const distHud = document.getElementById('distance-mode-hud');
            const s8Final = document.getElementById('scene-8-final-overlay');

            s1Title.style.opacity = (sceneNum === 1) ? '1' : '0';
            ballHud.style.opacity = (sceneNum === 5) ? '1' : '0';
            distHud.style.opacity = (sceneNum === 6) ? '1' : '0';
            s8Final.style.opacity = (sceneNum === 8) ? '1' : '0';
            infoCard.style.opacity = (sceneNum === 3 && isInfoCardsVisible) ? '1' : '0';

            // Top modellerini gizle (yalnızca sahne 5'te açılacak)
            planetGroups.forEach(p => {
                p.ballMesh.visible = (sceneNum === 5);
                p.mesh.visible = (sceneNum !== 5);
                if (p.ringMesh) p.ringMesh.visible = (sceneNum !== 5);
                if (p.cloudMesh) p.cloudMesh.visible = (sceneNum !== 5);
            });

            // Sahneye göre kamera ve nesne pozisyonlarını kur
            applySceneSetup(sceneNum);
        }

        function applySceneSetup(sceneNum) {
            const badge = document.getElementById('scene-title-badge');

            if (sceneNum === 1) {
                badge.textContent = "Sahne 1: Güneş Sistemi'ne Giriş";
                camTargetPos.set(0, 8, 45);
                camTargetLookAt.set(0, 0, 0);
                sunMesh.position.set(0, 0, 0);
                resetPlanetsToCircularOrbits();
            } else if (sceneNum === 2) {
                badge.textContent = "Sahne 2: Güneş Sisteminin Genel Görünümü";
                camTargetPos.set(0, 85, 210);
                camTargetLookAt.set(30, 0, 0);
                sunMesh.position.set(0, 0, 0);
                resetPlanetsToCircularOrbits();
            } else if (sceneNum === 3) {
                badge.textContent = "Sahne 3: Gezegenleri Yakından Tanıyalım";
                currentPlanetTourIndex = 0;
                tourPlanet(0);
            } else if (sceneNum === 4) {
                badge.textContent = "Sahne 4: Gezegenlerin Gerçek Büyüklükleri";
                setupScene4ScaleLineup();
            } else if (sceneNum === 5) {
                badge.textContent = "Sahne 5: Gezegenler Top Büyüklüğünde Olsaydı (Ölçek)";
                setupScene5BallLineup();
            } else if (sceneNum === 6) {
                badge.textContent = "Sahne 6: Güneş'e Uzaklıklar";
                setupScene6Distances();
            } else if (sceneNum === 7) {
                badge.textContent = "Sahne 7: Gezegenlerin Hareketleri (Dönme & Dolanma)";
                setupScene7OrbitsTopView();
            } else if (sceneNum === 8) {
                badge.textContent = "Sahne 8: Sinematik Final";
                camTargetPos.set(0, 160, 360);
                camTargetLookAt.set(0, 0, 0);
                sunMesh.position.set(0, 0, 0);
                resetPlanetsToCircularOrbits();
                // Konfeti patlat
                if (typeof confetti === 'function') {
                    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
                }
            }
        }

        /* -------------------------------------------------------------
           SAHNE ÖZEL POZİSYONLANDIRMALARI
        ------------------------------------------------------------- */
        function resetPlanetsToCircularOrbits() {
            planetGroups.forEach((p, idx) => {
                p.pivot.position.set(0, 0, 0);
                p.mesh.position.set(p.cinematicRadius, 0, 0);
                p.orbitLine.visible = isOrbitsVisible;
            });
        }

        // Sahne 3: Yakından Tanıma Turu
        function tourPlanet(pIndex) {
            currentPlanetTourIndex = pIndex;
            const p = planetGroups[pIndex];
            if (!p) return;

            // Kamerayı gezegenin hemen yanına ve önüne getir
            const pWorldPos = new THREE.Vector3();
            p.mesh.getWorldPosition(pWorldPos);

            const camDist = p.data.scaleRadius * 3.4 + 4;
            camTargetPos.set(pWorldPos.x + camDist, pWorldPos.y + (camDist * 0.35), pWorldPos.z + camDist);
            camTargetLookAt.copy(pWorldPos);

            // Bilgi Kartını Doldur
            renderInfoCard(p.data);
        }

        function renderInfoCard(data) {
            const container = document.getElementById('info-card-content');
            container.innerHTML = \`
                <div class="flex items-center justify-between pb-2.5 mb-3 border-b border-sky-500/20">
                    <div>
                        <div class="flex items-center gap-1.5">
                            <span class="w-2.5 h-2.5 rounded-full" style="background:\${data.color}"></span>
                            <span class="text-[11px] font-black uppercase text-sky-400 tracking-wider">\${data.order}. Gezegen</span>
                        </div>
                        <h3 class="text-xl font-black text-white leading-tight">\${data.name}</h3>
                    </div>
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-black bg-sky-500/20 text-sky-300 border border-sky-400/30">
                        \${data.type}
                    </span>
                </div>

                <div class="space-y-2 text-xs mb-3.5">
                    <div class="flex justify-between py-1 border-b border-white/5">
                        <span class="text-slate-400 font-medium">Yaklaşık Çap:</span>
                        <span class="font-bold text-white">\${data.realDiameterKm.toLocaleString('tr-TR')} km</span>
                    </div>
                    <div class="flex justify-between py-1 border-b border-white/5">
                        <span class="text-slate-400 font-medium">Kendi Ekseninde Dönme:</span>
                        <span class="font-bold text-amber-300">\${data.rotationPeriod}</span>
                    </div>
                    <div class="flex justify-between py-1 border-b border-white/5">
                        <span class="text-slate-400 font-medium">Güneş Etrafında Dolanma:</span>
                        <span class="font-bold text-sky-300">\${data.orbitalPeriod}</span>
                    </div>
                    <div class="flex justify-between py-1 border-b border-white/5">
                        <span class="text-slate-400 font-medium">Güneş'e Ortalama Uzaklık:</span>
                        <span class="font-bold text-white">\${data.distanceKm}</span>
                    </div>
                </div>

                <div class="p-2.5 rounded-2xl bg-sky-950/60 border border-sky-500/20 text-[11px] text-slate-200 leading-relaxed mb-3">
                    <strong class="text-amber-300 block mb-0.5">💡 Ayırt Edici Özellik:</strong>
                    \${data.fact}
                </div>

                <div class="flex items-center justify-between gap-2 pt-1">
                    <button onclick="prevTourPlanet()" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors flex items-center gap-1">
                        <i class="fa-solid fa-arrow-left text-[10px]"></i> Önceki
                    </button>
                    <span class="text-[11px] font-bold text-slate-400">\${data.order} / 8</span>
                    <button onclick="nextTourPlanet()" class="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors flex items-center gap-1">
                        Sonraki <i class="fa-solid fa-arrow-right text-[10px]"></i>
                    </button>
                </div>
            \`;
        }

        function nextTourPlanet() {
            let next = (currentPlanetTourIndex + 1) % 8;
            tourPlanet(next);
        }

        function prevTourPlanet() {
            let prev = (currentPlanetTourIndex - 1 + 8) % 8;
            tourPlanet(prev);
        }

        // Sahne 4: Gerçek Büyüklükler (Yan Yana Hizalama)
        function setupScene4ScaleLineup() {
            sunMesh.position.set(-90, 0, 0); // Güneş sol tarafta devasa durur

            let currentX = -45;
            planetGroups.forEach((p) => {
                p.orbitLine.visible = false;
                p.pivot.position.set(0, 0, 0);
                currentX += (p.data.scaleRadius + 2.5);
                p.mesh.position.set(currentX, 0, 0);
                currentX += (p.data.scaleRadius + 2.5);
            });

            camTargetPos.set(0, 20, 110);
            camTargetLookAt.set(10, 0, 0);
        }

        // Sahne 5: Top Büyüklüğünde Olsaydı (Bilye & Top Hizalama)
        function setupScene5BallLineup() {
            sunMesh.position.set(-130, 0, 0); // 109 cm pilates topu olarak sol devasa

            let currentX = -60;
            planetGroups.forEach((p) => {
                p.orbitLine.visible = false;
                p.pivot.position.set(0, 0, 0);
                const r = p.data.ballRadius;
                currentX += (r + 2.0);
                p.ballMesh.position.set(currentX, 0, 0);
                currentX += (r + 2.0);
            });

            camTargetPos.set(0, 18, 90);
            camTargetLookAt.set(0, 0, 0);
        }

        // Sahne 6: Güneş'e Uzaklıklar
        function setupScene6Distances() {
            sunMesh.position.set(0, 0, 0);
            setDistanceScaleMode(distanceScaleMode);
        }

        function setDistanceScaleMode(mode) {
            distanceScaleMode = mode;
            const btnCin = document.getElementById('btn-scale-cinematic');
            const btnTrue = document.getElementById('btn-scale-true');

            if (mode === 'cinematic') {
                btnCin.className = "px-3 py-1.5 rounded-xl bg-sky-600 text-white font-black";
                btnTrue.className = "px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold";
                resetPlanetsToCircularOrbits();
                camTargetPos.set(0, 95, 230);
                camTargetLookAt.set(50, 0, 0);
            } else {
                btnCin.className = "px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold";
                btnTrue.className = "px-3 py-1.5 rounded-xl bg-sky-600 text-white font-black";
                
                // Gerçek AU oranlarına göre yarıçaplar (1 AU = 40 birim)
                // Merkür: 0.39 AU -> 16, Venüs: 0.72 -> 29, Dünya: 1.0 -> 40, Mars: 1.52 -> 61, Jüpiter: 5.2 -> 208, Satürn: 9.58 -> 383, Uranüs: 19.2 -> 768, Neptün: 30.1 -> 1204
                const auDistances = [16, 29, 40, 61, 208, 383, 768, 1204];
                planetGroups.forEach((p, idx) => {
                    p.orbitLine.visible = false;
                    p.mesh.position.set(auDistances[idx], 0, 0);
                });
                camTargetPos.set(300, 320, 650);
                camTargetLookAt.set(300, 0, 0);
            }
        }

        // Sahne 7: Gezegenlerin Hareketleri (Üstten Görünüm)
        function setupScene7OrbitsTopView() {
            sunMesh.position.set(0, 0, 0);
            resetPlanetsToCircularOrbits();
            camTargetPos.set(0, 220, 40);
            camTargetLookAt.set(0, 0, 0);
        }

        /* -------------------------------------------------------------
           9. ANİMASYON DÖNGÜSÜ & ZAMAN ÇİZELGESİ (60 FPS)
        ------------------------------------------------------------- */
        let lastFrameTime = performance.now();

        function animateLoop(now) {
            requestAnimationFrame(animateLoop);

            const dt = (now - lastFrameTime) / 1000;
            lastFrameTime = now;

            if (isPlaying) {
                const scaledDt = dt * playbackSpeed;
                sceneElapsedTime += scaledDt;

                // Zaman göstergesi güncelle
                const timerEl = document.getElementById('scene-timer-label');
                if (timerEl) timerEl.textContent = formatTime(sceneElapsedTime);

                // İlerleme çubuğu
                const maxDur = SCENE_DURATIONS[currentSceneIndex] || 10;
                const progressPct = Math.min((sceneElapsedTime / maxDur) * 100, 100);
                const bar = document.getElementById('scene-progress-bar');
                if (bar) bar.style.width = \`\${progressPct}%\`;

                // Sahne otomatik geçişi (Son sahne değilse ve serbest incelemede değilse)
                if (!isFreeCamera && sceneElapsedTime >= maxDur) {
                    if (currentSceneIndex < 8) {
                        jumpToScene(currentSceneIndex + 1);
                    } else {
                        // Final bittiğinde duraklat
                        isPlaying = false;
                        updatePlayPauseUI();
                    }
                }

                // 🌟 GÖK CİSİMLERİNİN HAREKETLERİ 🌟
                // 1. Güneş Eksen Dönüşü
                if (sunMesh) {
                    sunMesh.rotation.y += 0.003 * scaledDt * 60;
                }

                // 2. Gezegenlerin Dönme ve Dolanma Hareketleri
                planetGroups.forEach((p, index) => {
                    // Kendi Ekseninde Dönme
                    let rotSpeed = 0.02;
                    if (p.data.id === 'jupiter') rotSpeed = 0.045; // Çok hızlı döner
                    if (p.data.id === 'saturn') rotSpeed = 0.04;
                    if (p.data.id === 'venus') rotSpeed = -0.004; // Venüs ters döner!
                    if (p.data.id === 'mercury') rotSpeed = 0.005; // Yavaş

                    p.mesh.rotation.y += rotSpeed * scaledDt * 60;

                    // Dünya bulut katmanı hafif farklı hızda döner
                    if (p.cloudMesh) {
                        p.cloudMesh.rotation.y += (rotSpeed * 1.15) * scaledDt * 60;
                    }

                    // Yörüngede Dolanma (Saat Yönünün Tersine - CCW)
                    // Sahne 2, 7 ve 8'de dolanma aktiftir
                    if (currentSceneIndex === 2 || currentSceneIndex === 7 || currentSceneIndex === 8) {
                        // Kepler Hız Oranları (İçtekiler çok hızlı, dıştakiler yavaş)
                        const orbitalSpeeds = [0.035, 0.024, 0.018, 0.012, 0.006, 0.004, 0.002, 0.0012];
                        p.currentAngle += orbitalSpeeds[index] * scaledDt * 60;

                        const r = p.cinematicRadius;
                        p.mesh.position.x = Math.cos(p.currentAngle) * r;
                        p.mesh.position.z = Math.sin(p.currentAngle) * r;
                    }
                });

                // Sahne 3'te kameranın gezegen etrafında yumuşak 360° dönüşü
                if (currentSceneIndex === 3) {
                    const p = planetGroups[currentPlanetTourIndex];
                    if (p) {
                        const pPos = new THREE.Vector3();
                        p.mesh.getWorldPosition(pPos);
                        const tourRadius = p.data.scaleRadius * 3.2 + 3;
                        const tourAngle = sceneElapsedTime * 0.45;
                        camTargetPos.set(
                            pPos.x + Math.cos(tourAngle) * tourRadius,
                            pPos.y + (tourRadius * 0.3),
                            pPos.z + Math.sin(tourAngle) * tourRadius
                        );
                        camTargetLookAt.copy(pPos);
                    }
                }
            }

            // 📷 Kamera Hareketi (Yumuşak LERP Geçişi - Serbest Mod Kapalıyken)
            if (!isFreeCamera) {
                camera.position.lerp(camTargetPos, 0.045);
                camCurrentLookAt.lerp(camTargetLookAt, 0.045);
                camera.lookAt(camCurrentLookAt);
            } else {
                controls.update();
            }

            // 3D Etiketleri Güncelle
            updateLabels();

            // Render
            renderer.render(scene, camera);
        }

        /* -------------------------------------------------------------
           10. KULLANICI KONTROLLERİ VE ARAYÜZ YÖNETİMİ
        ------------------------------------------------------------- */
        function togglePlayPause() {
            isPlaying = !isPlaying;
            updatePlayPauseUI();
        }

        function updatePlayPauseUI() {
            const icon = document.getElementById('play-pause-icon');
            const text = document.getElementById('play-pause-text');
            if (isPlaying) {
                icon.className = "fa-solid fa-pause";
                text.textContent = "Duraklat";
            } else {
                icon.className = "fa-solid fa-play";
                text.textContent = "Oynat";
            }
        }

        function restartAnimation() {
            jumpToScene(1);
            isPlaying = true;
            updatePlayPauseUI();
        }

        function nextScene() {
            if (currentSceneIndex < 8) {
                jumpToScene(currentSceneIndex + 1);
            } else {
                jumpToScene(1);
            }
        }

        function prevScene() {
            if (currentSceneIndex > 1) {
                jumpToScene(currentSceneIndex - 1);
            } else {
                jumpToScene(8);
            }
        }

        function setSpeed(speed) {
            playbackSpeed = speed;
            [0.5, 1.0, 1.5, 2.0].forEach(s => {
                const id = \`speed-\${String(s).replace('.', '-')}\`;
                const btn = document.getElementById(id);
                if (btn) {
                    if (s === speed) {
                        btn.className = "px-2 py-1 rounded-lg bg-sky-600 text-white shadow-xs font-black";
                    } else {
                        btn.className = "px-2 py-1 rounded-lg text-slate-400 hover:text-white transition-colors font-bold";
                    }
                }
            });
        }

        function toggleFreeCameraMode() {
            isFreeCamera = !isFreeCamera;
            controls.enabled = isFreeCamera;

            const btn = document.getElementById('btn-camera-mode');
            const label = document.getElementById('camera-mode-label');

            if (isFreeCamera) {
                btn.className = "glass-panel px-3 py-2 sm:px-4 sm:py-2 rounded-2xl text-xs font-black bg-emerald-600 text-white border border-emerald-400 shadow-lg";
                label.textContent = "Animasyona Dön";
                controls.target.copy(camCurrentLookAt);
            } else {
                btn.className = "glass-panel px-3 py-2 sm:px-4 sm:py-2 rounded-2xl text-xs font-black text-sky-300 border border-sky-400/30 hover:bg-sky-500/20 transition-all";
                label.textContent = "Serbest İnceleme";
            }
        }

        function toggleTeacherModeModal() {
            const modal = document.getElementById('teacher-modal');
            modal.classList.toggle('hidden');
            modal.classList.toggle('flex');
        }

        function togglePlanetNamesVisibility() {
            isNamesVisible = !isNamesVisible;
            const btn = document.getElementById('toggle-names-btn');
            if (isNamesVisible) {
                btn.className = "px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs";
                btn.textContent = "Açık";
            } else {
                btn.className = "px-4 py-2 rounded-xl bg-slate-700 text-slate-300 font-bold text-xs";
                btn.textContent = "Gizli";
            }
            updateLabels();
        }

        function toggleInfoCardsVisibility() {
            isInfoCardsVisible = !isInfoCardsVisible;
            const btn = document.getElementById('toggle-info-btn');
            const card = document.getElementById('info-card-container');
            if (isInfoCardsVisible) {
                btn.className = "px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs";
                btn.textContent = "Açık";
                if (currentSceneIndex === 3) card.style.opacity = '1';
            } else {
                btn.className = "px-4 py-2 rounded-xl bg-slate-700 text-slate-300 font-bold text-xs";
                btn.textContent = "Gizli";
                card.style.opacity = '0';
            }
        }

        function toggleOrbitsVisibility() {
            isOrbitsVisible = !isOrbitsVisible;
            const btn = document.getElementById('toggle-orbits-btn');
            if (isOrbitsVisible) {
                btn.className = "px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs";
                btn.textContent = "Açık";
            } else {
                btn.className = "px-4 py-2 rounded-xl bg-slate-700 text-slate-300 font-bold text-xs";
                btn.textContent = "Gizli";
            }
            orbitLineMeshes.forEach(line => line.visible = isOrbitsVisible);
        }

        function toggleFullscreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
                document.getElementById('fullscreen-icon').className = "fa-solid fa-compress";
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen().catch(() => {});
                    document.getElementById('fullscreen-icon').className = "fa-solid fa-expand";
                }
            }
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function formatTime(sec) {
            const s = Math.floor(sec);
            const m = Math.floor(s / 60);
            const remSec = s % 60;
            return \`\${String(m).padStart(2, '0')}:\${String(remSec).padStart(2, '0')}\`;
        }

        // Başlat
        window.addEventListener('DOMContentLoaded', () => {
            initThreeEngine();
        });
    </script>
</body>
</html>
`;

fs.writeFileSync(targetPath, htmlContent, 'utf8');
console.log('Successfully created oyunlar/gunes-sistemi-yolculuk-3d.html');
