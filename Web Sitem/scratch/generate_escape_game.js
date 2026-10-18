// scratch/generate_escape_game.js
const fs = require('fs');
const path = require('path');
const gameData = require('./parts/game_data.js');
const roomData = require('./parts/room_puzzles.js');

const targetFile = path.join(__dirname, '..', 'oyunlar', 'uzaydan-kacis-3d.html');

function buildHTML() {
    return `<!DOCTYPE html>
<html lang="tr" class="h-full bg-slate-100">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>Uzaydan Kaçış: 3D Bilimsel Kaçış Odası | Rotalı Fenci</title>
    
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        scifi: {
                            cyan: '#0284c7',
                            neonBlue: '#2563eb',
                            dark: '#0f172a',
                            panel: '#ffffff',
                            border: '#cbd5e1',
                            amber: '#d97706',
                            red: '#dc2626',
                            emerald: '#059669'
                        }
                    },
                    fontFamily: {
                        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace'],
                        orbitron: ['Orbitron', 'sans-serif']
                    }
                }
            }
        }
    </script>

    <!-- Google Fonts & Font Awesome CDN -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

    <!-- Three.js CDN & OrbitControls -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
    <!-- Canvas Confetti CDN -->
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>

    <style>
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
            background: #f1f5f9;
            color: #0f172a;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
        }

        #station-canvas {
            width: 100%;
            height: 100%;
            display: block;
            touch-action: none;
            -webkit-touch-callout: none;
        }

        /* Glassmorphism Light Panels */
        .glass-panel-light {
            background: rgba(255, 255, 255, 0.94);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(226, 232, 240, 0.9);
            box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08);
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 5px;
            height: 5px;
        }
        ::-webkit-scrollbar-track {
            background: #e2e8f0;
        }
        ::-webkit-scrollbar-thumb {
            background: #0284c7;
            border-radius: 4px;
        }
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        @keyframes pulseGlow {
            0%, 100% { transform: scale(1); filter: drop-shadow(0 0 4px rgba(2, 132, 199, 0.5)); }
            50% { transform: scale(1.04); filter: drop-shadow(0 0 10px rgba(2, 132, 199, 0.8)); }
        }
        .pulse-glow {
            animation: pulseGlow 2.5s infinite ease-in-out;
        }

        /* Sci-Fi HUD Crosshair */
        .hud-crosshair {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 24px;
            height: 24px;
            transform: translate(-50%, -50%);
            pointer-events: none;
            opacity: 0.35;
            transition: opacity 0.2s;
        }
        .hud-crosshair::before, .hud-crosshair::after {
            content: '';
            position: absolute;
            background: #0284c7;
        }
        .hud-crosshair::before { top: 11px; left: 0; width: 24px; height: 2px; }
        .hud-crosshair::after { top: 0; left: 11px; width: 2px; height: 24px; }

        /* Draggable elements */
        .drag-source {
            cursor: grab;
            transition: transform 0.15s, box-shadow 0.15s;
        }
        .drag-source:active {
            cursor: grabbing;
            transform: scale(0.96);
        }
        .drop-target-active {
            border-color: #0284c7 !important;
            background: #e0f2fe !important;
        }
    </style>
</head>
<body class="w-full h-full h-[100dvh] h-[100svh] flex flex-col justify-between bg-slate-100 p-1 sm:p-2 overflow-hidden fixed inset-0 select-none">

    <!-- 🚀 1. ÜST KONTROL VE BİLGİ ÇUBUĞU (Ultra Slim Header - 8 Oda Desteği) -->
    <header class="bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/90 px-3 py-1.5 flex items-center justify-between gap-2 shrink-0 z-20 min-h-[44px] max-h-[50px] shadow-sm">
        
        <!-- Sol: Çıkış Butonu, Rotalı Fenci Logo & Başlık -->
        <div class="flex items-center gap-2 shrink-0">
            <button onclick="exitSimulation()" class="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1.5 shadow-sm shrink-0 active:scale-95 touch-manipulation cursor-pointer border border-rose-200" title="İstasyondan Çıkış Yap">
                <i class="fa-solid fa-arrow-left text-[11px]"></i>
                <span class="hidden xs:inline">Çıkış</span>
            </button>
            
            <!-- Rotalı Fenci Logo -->
            <a href="https://rotalifenci.vercel.app" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1.5 shrink-0" title="Rotalı Fenci Ana Sayfa">
                <img src="../assets/rotali-logo-clean.png" onerror="this.src='../assets/logo.jpg'" alt="Rotalı Fenci" class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-contain shadow-sm border border-slate-200 bg-white">
            </a>
            
            <div class="flex flex-col justify-center leading-none">
                <div class="flex items-center gap-1.5">
                    <h1 class="text-xs sm:text-sm font-black font-orbitron text-slate-800 tracking-wider whitespace-nowrap">
                        UZAYDAN KAÇIŞ
                    </h1>
                    <span class="px-1.5 py-0.5 rounded bg-sky-100 border border-sky-300 text-sky-800 text-[9px] font-mono font-black uppercase whitespace-nowrap hidden md:inline">
                        3D BİLİMSEL KAÇIŞ ODASI
                    </span>
                </div>
                <span class="text-[9px] text-slate-500 font-medium hidden sm:inline">ORBITAL-7 Araştırma İstasyonu • 7. Sınıf</span>
            </div>
        </div>

        <!-- Orta: 8 ODA İlerleme Çubuğu -->
        <div class="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 shadow-inner">
            <span class="text-[9px] font-mono font-bold text-slate-500 hidden lg:inline mr-1">ODALAR:</span>
            <div id="room-indicators" class="flex items-center gap-1">
                <button onclick="jumpToRoomIfUnlocked(1)" class="w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center text-[10px] font-bold font-mono transition-all bg-sky-600 text-white shadow-sm ring-2 ring-sky-300" id="room-dot-1" title="Oda 1: Acil Durum Kontrol">1</button>
                <button onclick="jumpToRoomIfUnlocked(2)" class="w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center text-[10px] font-bold font-mono transition-all bg-slate-200 text-slate-600 hover:bg-slate-300" id="room-dot-2" title="Oda 2: Uzay Teknolojileri">2</button>
                <button onclick="jumpToRoomIfUnlocked(3)" class="w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center text-[10px] font-bold font-mono transition-all bg-slate-200 text-slate-600 hover:bg-slate-300" id="room-dot-3" title="Oda 3: Türkiye ve Uydu Merkezi">3</button>
                <button onclick="jumpToRoomIfUnlocked(4)" class="w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center text-[10px] font-bold font-mono transition-all bg-slate-200 text-slate-600 hover:bg-slate-300" id="room-dot-4" title="Oda 4: Uzay Kirliliği">4</button>
                <button onclick="jumpToRoomIfUnlocked(5)" class="w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center text-[10px] font-bold font-mono transition-all bg-slate-200 text-slate-600 hover:bg-slate-300" id="room-dot-5" title="Oda 5: Teleskop Tasarım Labı">5</button>
                <button onclick="jumpToRoomIfUnlocked(6)" class="w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center text-[10px] font-bold font-mono transition-all bg-slate-200 text-slate-600 hover:bg-slate-300" id="room-dot-6" title="Oda 6: Yıldızların Yaşamı">6</button>
                <button onclick="jumpToRoomIfUnlocked(7)" class="w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center text-[10px] font-bold font-mono transition-all bg-slate-200 text-slate-600 hover:bg-slate-300" id="room-dot-7" title="Oda 7: Galaksi ve Evren Haritası">7</button>
                <button onclick="jumpToRoomIfUnlocked(8)" class="w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center text-[10px] font-bold font-mono transition-all bg-slate-200 text-slate-600 hover:bg-slate-300" id="room-dot-8" title="Oda 8: Dünya'ya Güvenli Dönüş">8</button>
            </div>
            <div class="ml-1 text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 flex items-center gap-1" id="timer-display">
                <i class="fa-solid fa-stopwatch text-[9px]"></i> <span id="clock-text">00:00</span>
            </div>
        </div>

        <!-- Sağ: NOVA AI Asistan, İpucu, Ses, Öğretmen & Tam Ekran -->
        <div class="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <!-- NOVA Asistan Butonu -->
            <button id="btn-nova" onclick="openNovaModal()" class="px-2 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-800 text-xs font-bold transition-all flex items-center gap-1 shadow-sm active:scale-95" title="Yapay Zekâ Asistanı NOVA">
                <div class="w-2 h-2 rounded-full bg-sky-500 animate-ping"></div>
                <span class="font-orbitron text-[11px] font-black text-sky-700">NOVA</span>
            </button>

            <!-- Kademeli İpucu Butonu -->
            <button id="btn-hint" onclick="openHintModal()" class="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold transition-all flex items-center gap-1 shadow-sm active:scale-95" title="Kademeli 3 Aşamalı İpucu">
                <i class="fa-solid fa-lightbulb text-amber-500 text-xs"></i>
                <span class="hidden md:inline text-[11px]">İpucu</span>
                <span class="w-4 h-4 rounded-full bg-amber-500 text-white font-bold text-[9px] flex items-center justify-center" id="hint-count-badge">3</span>
            </button>

            <!-- Ses Aç/Kapa -->
            <button id="btn-audio" onclick="toggleAudio()" class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 flex items-center justify-center transition-all" title="Ses Efektlerini Aç/Kapat">
                <i id="audio-icon" class="fa-solid fa-volume-high text-xs text-sky-600"></i>
            </button>

            <!-- Türkçe Sesli Rehber -->
            <button id="btn-speech" onclick="toggleSpeech()" class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 flex items-center justify-center transition-all" title="Türkçe Sesli Anlatımı Aç/Kapat">
                <i id="speech-icon" class="fa-solid fa-headset text-xs text-sky-600"></i>
            </button>

            <!-- Öğretmen Modu -->
            <button onclick="openTeacherModal()" class="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95" title="Öğretmen ve Akıllı Tahta Modu">
                <i class="fa-solid fa-chalkboard-user text-xs"></i>
                <span class="hidden lg:inline text-[11px]">Öğretmen</span>
            </button>

            <!-- Tam Ekran -->
            <button onclick="toggleFullScreen()" class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 flex items-center justify-center transition-all" title="Tam Ekran Modu">
                <i class="fa-solid fa-expand text-xs"></i>
            </button>
        </div>
    </header>

    <!-- 🌌 2. ANA ORTA BÖLÜM: 3D THREE.JS İSTASYON SAHNESİ + GELİŞMİŞ HUD -->
    <main class="flex-1 w-full relative min-h-0 overflow-hidden my-1 sm:my-1.5 rounded-2xl border border-slate-300 bg-slate-900 shadow-md flex flex-col">
        <!-- Three.js Canvas -->
        <canvas id="station-canvas" class="w-full h-full cursor-grab active:cursor-grabbing"></canvas>

        <!-- Nişangah HUD (First-Person Look) -->
        <div class="hud-crosshair"></div>

        <!-- Sol Üst: Mevcut Oda & Bilimsel Kazanım Rozeti -->
        <div class="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 pointer-events-none max-w-[80%] sm:max-w-md">
            <div class="bg-white/95 backdrop-blur-md border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-2 text-slate-800 shadow-md">
                <span class="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping shrink-0"></span>
                <span class="text-xs font-orbitron font-bold text-sky-700 truncate" id="room-status-badge">ODA 1: ACİL DURUM: İSTASYONU KURTAR</span>
            </div>
            <div id="room-alert-msg" class="bg-amber-50/95 border border-amber-300 text-amber-900 px-3 py-1 rounded-xl text-xs font-medium flex items-center gap-2 shadow-sm">
                <i class="fa-solid fa-triangle-exclamation text-amber-600 shrink-0"></i>
                <span id="alert-text" class="truncate">Kritik Arıza! Kontrol paneline yaklaş ve enerji akışını sırayla aç.</span>
            </div>
        </div>

        <!-- Sağ Üst: Kamera Kontrolleri & Serbest Süzülme Modu (Zero-G Float) -->
        <div class="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5 items-end">
            <div class="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200 shadow-sm">
                <button onclick="resetCameraView()" class="px-2 py-1 bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 rounded-lg text-[11px] font-bold font-mono flex items-center gap-1 active:scale-95 cursor-pointer" title="Bakış Açısını Sıfırla">
                    <i class="fa-solid fa-camera-rotate text-sky-600"></i>
                    <span class="hidden sm:inline">Merkez</span>
                </button>
                <button id="btn-zerog" onclick="toggleZeroGMode()" class="px-2 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-lg text-[11px] font-bold font-mono flex items-center gap-1 active:scale-95 cursor-pointer" title="Mikro Yerçekimi Serbest Süzülme Modu">
                    <i class="fa-solid fa-feather-pointed text-indigo-600"></i>
                    <span class="hidden sm:inline">Süzülme</span>
                </button>
                <button onclick="inspectCurrentObject()" class="px-2 py-1 bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 rounded-lg text-[11px] font-bold font-mono flex items-center gap-1 active:scale-95 cursor-pointer" title="Seçili 3D Modeli 360° İncele">
                    <i class="fa-solid fa-rotate text-sky-600"></i>
                    <span class="hidden sm:inline">360° İncele</span>
                </button>
            </div>
        </div>

        <!-- 3D Nesne Hologram Bilgi Kartı (Tıklandığında Açılan Dinamik Bilgi) -->
        <div id="object-hologram-banner" class="absolute bottom-3 left-3 right-3 sm:left-5 sm:right-auto sm:max-w-md bg-white/95 backdrop-blur-md border border-sky-300 p-3 sm:p-4 rounded-2xl shadow-xl z-10 transition-all duration-300 opacity-0 pointer-events-none transform translate-y-3">
            <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-2.5">
                    <span class="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center text-sm" id="holo-icon"><i class="fa-solid fa-cube"></i></span>
                    <h4 class="text-sm font-black font-orbitron text-slate-800" id="holo-title">NESNE ADI</h4>
                </div>
                <button onclick="closeHologramBanner()" class="text-slate-400 hover:text-slate-700 pointer-events-auto p-1 text-sm"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <p class="text-xs text-slate-600 mt-2 leading-relaxed" id="holo-desc">Bilimsel açıklama yükleniyor...</p>
        </div>

        <!-- Sağ Alt: Marka ve Instagram Linki (@rotalifenci) -->
        <div class="absolute bottom-2 right-3 z-10 pointer-events-auto">
            <a href="https://www.instagram.com/rotalifenci/" target="_blank" rel="noopener noreferrer" class="bg-white/90 hover:bg-white backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-200 text-slate-700 hover:text-rose-600 text-[11px] font-bold font-mono flex items-center gap-1.5 shadow-sm transition-all hover:scale-105" title="Instagram'da @rotalifenci Takip Et">
                <i class="fa-brands fa-instagram text-rose-500 text-xs"></i>
                <span>@rotalifenci</span>
            </a>
        </div>
    </main>

    <!-- 🎛️ 3. ALT BÖLÜM: BİLİMSEL BULMACA & ETKİLEŞİM TERMİNALİ (Aydınlık & Zengin Panel) -->
    <footer class="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-2 sm:p-2.5 shrink-0 z-20 flex flex-col gap-1.5 shadow-sm min-h-[145px] max-h-[195px]">
        
        <!-- Üst HUD Bar: Görev Başlığı, Şifre Butonu & Sesli Brifing -->
        <div class="flex items-center justify-between gap-2 border-b border-slate-200 pb-1.5 shrink-0">
            <div class="flex items-center gap-2 min-w-0">
                <span class="w-6 h-6 rounded-lg bg-sky-100 border border-sky-300 text-sky-700 flex items-center justify-center text-xs shrink-0">
                    <i class="fa-solid fa-terminal"></i>
                </span>
                <span class="text-xs sm:text-sm font-bold text-slate-800 truncate" id="puzzle-header-title">Görev Yükleniyor...</span>
            </div>

            <div class="flex items-center gap-1.5 shrink-0">
                <!-- Şifre Giriş / Terminal Açma Butonu -->
                <button onclick="openKeypadModal()" class="px-2.5 sm:px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer">
                    <i class="fa-solid fa-key text-[11px]"></i>
                    <span id="btn-keypad-text">ŞİFRE GİR</span>
                </button>
                <!-- Sesli Rehber Dinle -->
                <button onclick="speakRoomBriefing()" class="px-2 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 active:scale-95 cursor-pointer" title="NOVA Görev Anlatımı">
                    <i class="fa-solid fa-volume-high text-xs text-sky-600"></i>
                    <span class="hidden sm:inline">Dinle</span>
                </button>
            </div>
        </div>

        <!-- Dinamik Bulmaca İçerik Alanı (8 Odanın Her Biri İçin Farklı Etkileşimler) -->
        <div id="dynamic-puzzle-container" class="flex-1 overflow-y-auto no-scrollbar flex items-center">
            <!-- JS tarafından her oda için özel yüklenir -->
        </div>
    </footer>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- MODALLAR: NOVA ASİSTAN, ŞİFRE PANELİ, İPUCU, ÖĞRETMEN, ZAFER   -->
    <!-- ═══════════════════════════════════════════════════════════════ -->

    <!-- 🤖 1. NOVA AKILLI OYUN REHBERİ MODALI -->
    <div id="modal-nova" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 hidden" onclick="if(event.target===this) closeNovaModal()">
        <div class="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl text-slate-800 flex flex-col gap-3.5 relative">
            <div class="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <div class="flex items-center gap-2.5">
                    <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center text-xl shadow-md">
                        <i class="fa-solid fa-robot"></i>
                    </div>
                    <div>
                        <h3 class="text-sm sm:text-base font-black font-orbitron text-slate-800">NOVA YZ ASİSTANI</h3>
                        <span class="text-xs text-sky-600 font-mono font-bold">ORBITAL-7 İstasyon Rehberi</span>
                    </div>
                </div>
                <button onclick="closeNovaModal()" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 flex items-center justify-center text-sm transition-all"><i class="fa-solid fa-xmark"></i></button>
            </div>

            <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex gap-3 items-start">
                <div class="w-3 h-3 rounded-full bg-emerald-500 mt-1 animate-pulse shrink-0"></div>
                <div class="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans" id="nova-dialog-text">
                    "Uzay kâşifi, dikkat! ORBITAL-7 istasyonunda kritik bir sistem arızası tespit edildi. Dünya ile bağlantımız kesildi. Güvenli dönüş sistemini etkinleştirmek için bilimsel görevleri tamamlamalısın. Hazır mısın?"
                </div>
            </div>

            <!-- Bilimsel İlerleme & İstatistik -->
            <div class="grid grid-cols-2 gap-2 text-xs font-mono">
                <div class="bg-sky-50 p-2.5 rounded-xl border border-sky-200">
                    <div class="text-slate-500 text-[10px]">GÖREV İLERLEMESİ</div>
                    <div class="font-bold text-sky-800 text-sm" id="nova-progress-text">1 / 8 Tamamlandı</div>
                </div>
                <div class="bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    <div class="text-slate-500 text-[10px]">BİLİM SKORU</div>
                    <div class="font-bold text-amber-700 text-sm" id="nova-score-text">0 Puan</div>
                </div>
            </div>

            <div class="flex gap-2">
                <button onclick="speakRoomBriefing(); closeNovaModal();" class="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase flex items-center justify-center gap-1.5 shadow-sm">
                    <i class="fa-solid fa-volume-high"></i> Sesli Anlat
                </button>
                <button onclick="closeNovaModal()" class="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase">
                    Tamam, Devam Et
                </button>
            </div>
        </div>
    </div>

    <!-- 🔢 2. DİJİTAL ŞİFRE GİRİŞ MODALI -->
    <div id="modal-keypad" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 hidden" onclick="if(event.target===this) closeKeypadModal()">
        <div class="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 w-full max-w-sm shadow-2xl text-slate-800 flex flex-col gap-3 relative">
            <div class="flex items-center justify-between border-b border-slate-200 pb-2">
                <div class="flex items-center gap-2">
                    <span class="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center text-sm"><i class="fa-solid fa-lock"></i></span>
                    <div>
                        <h3 class="text-sm font-black font-orbitron text-slate-800" id="keypad-title">GÜVENLİK TERMİNALİ</h3>
                        <span class="text-[11px] text-slate-500 font-mono" id="keypad-subtitle">Bilimsel 4 Haneli Şifreyi Girin</span>
                    </div>
                </div>
                <button onclick="closeKeypadModal()" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 flex items-center justify-center text-sm transition-all"><i class="fa-solid fa-xmark"></i></button>
            </div>

            <!-- Kod Ekranı -->
            <div class="bg-slate-50 border-2 border-sky-300 rounded-2xl p-3 flex flex-col items-center justify-center shadow-inner">
                <div class="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-widest mb-0.5">GİRİLEN KOD:</div>
                <div class="text-3xl sm:text-4xl font-black font-mono tracking-[0.3em] text-sky-700" id="keypad-screen">----</div>
                <div class="text-xs text-rose-600 font-mono font-bold mt-1 hidden" id="keypad-error-msg">⚠️ HATALI ŞİFRE! TEKRAR DENE.</div>
                <div class="text-xs text-emerald-600 font-mono font-bold mt-1 hidden" id="keypad-success-msg">✅ ONAYLANDI! KAPI AÇILIYOR...</div>
            </div>

            <!-- Tuş Takımı (1-9, SİL, 0, ONAY) -->
            <div class="grid grid-cols-3 gap-2">
                <button onclick="pressKeypad('1')" class="py-2.5 rounded-2xl bg-slate-50 hover:bg-sky-100 text-slate-800 font-mono font-black text-lg border border-slate-200 active:scale-95 transition-all">1</button>
                <button onclick="pressKeypad('2')" class="py-2.5 rounded-2xl bg-slate-50 hover:bg-sky-100 text-slate-800 font-mono font-black text-lg border border-slate-200 active:scale-95 transition-all">2</button>
                <button onclick="pressKeypad('3')" class="py-2.5 rounded-2xl bg-slate-50 hover:bg-sky-100 text-slate-800 font-mono font-black text-lg border border-slate-200 active:scale-95 transition-all">3</button>
                <button onclick="pressKeypad('4')" class="py-2.5 rounded-2xl bg-slate-50 hover:bg-sky-100 text-slate-800 font-mono font-black text-lg border border-slate-200 active:scale-95 transition-all">4</button>
                <button onclick="pressKeypad('5')" class="py-2.5 rounded-2xl bg-slate-50 hover:bg-sky-100 text-slate-800 font-mono font-black text-lg border border-slate-200 active:scale-95 transition-all">5</button>
                <button onclick="pressKeypad('6')" class="py-2.5 rounded-2xl bg-slate-50 hover:bg-sky-100 text-slate-800 font-mono font-black text-lg border border-slate-200 active:scale-95 transition-all">6</button>
                <button onclick="pressKeypad('7')" class="py-2.5 rounded-2xl bg-slate-50 hover:bg-sky-100 text-slate-800 font-mono font-black text-lg border border-slate-200 active:scale-95 transition-all">7</button>
                <button onclick="pressKeypad('8')" class="py-2.5 rounded-2xl bg-slate-50 hover:bg-sky-100 text-slate-800 font-mono font-black text-lg border border-slate-200 active:scale-95 transition-all">8</button>
                <button onclick="pressKeypad('9')" class="py-2.5 rounded-2xl bg-slate-50 hover:bg-sky-100 text-slate-800 font-mono font-black text-lg border border-slate-200 active:scale-95 transition-all">9</button>
                <button onclick="clearKeypad()" class="py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-mono font-black text-xs border border-rose-200 active:scale-95 transition-all">SİL</button>
                <button onclick="pressKeypad('0')" class="py-2.5 rounded-2xl bg-slate-50 hover:bg-sky-100 text-slate-800 font-mono font-black text-lg border border-slate-200 active:scale-95 transition-all">0</button>
                <button onclick="submitKeypad()" class="py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-black text-xs border border-emerald-500 shadow-md active:scale-95 transition-all">ONAY</button>
            </div>
        </div>
    </div>

    <!-- 💡 3. KADEMELİ 3 AŞAMALI İPUCU SİSTEMİ -->
    <div id="modal-hint" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 hidden" onclick="if(event.target===this) closeHintModal()">
        <div class="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl text-slate-800 flex flex-col gap-3">
            <div class="flex items-center justify-between border-b border-slate-200 pb-2">
                <div class="flex items-center gap-2">
                    <span class="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-sm"><i class="fa-solid fa-lightbulb"></i></span>
                    <div>
                        <h3 class="text-sm sm:text-base font-black font-orbitron text-slate-800">3 AŞAMALI BİLİMSEL İPUCU</h3>
                        <span class="text-xs text-slate-500 font-mono">Düşünerek öğrenme rehberi</span>
                    </div>
                </div>
                <button onclick="closeHintModal()" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 flex items-center justify-center text-sm transition-all"><i class="fa-solid fa-xmark"></i></button>
            </div>

            <div class="flex flex-col gap-2.5" id="hint-levels-list">
                <!-- Seviye 1: Yönlendirme -->
                <div class="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
                    <div class="flex items-center justify-between text-xs font-bold text-slate-800">
                        <span class="flex items-center gap-1.5"><i class="fa-solid fa-compass text-sky-600"></i> Aşama 1: Nesneye Odaklan</span>
                        <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">AÇIK</span>
                    </div>
                    <p class="text-xs text-slate-600 leading-relaxed" id="hint-text-1">Yönlendirme metni...</p>
                </div>
                <!-- Seviye 2: Kavram Hatırlatma -->
                <div class="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
                    <div class="flex items-center justify-between text-xs font-bold text-slate-800">
                        <span class="flex items-center gap-1.5"><i class="fa-solid fa-atom text-amber-600"></i> Aşama 2: Bilimsel Kavram</span>
                        <button onclick="revealHintLevel(2)" id="btn-unlock-hint-2" class="px-2 py-0.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-black text-[11px] shadow-sm">GÖSTER</button>
                    </div>
                    <p class="text-xs text-slate-700 italic hidden bg-white p-2 rounded-xl border border-amber-200" id="hint-text-2">Kavram metni...</p>
                </div>
                <!-- Seviye 3: Çözüm Yolu -->
                <div class="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
                    <div class="flex items-center justify-between text-xs font-bold text-slate-800">
                        <span class="flex items-center gap-1.5"><i class="fa-solid fa-key text-rose-600"></i> Aşama 3: Çözüm Yolu</span>
                        <button onclick="revealHintLevel(3)" id="btn-unlock-hint-3" class="px-2 py-0.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-black text-[11px] shadow-sm">GÖSTER</button>
                    </div>
                    <p class="text-xs text-slate-700 italic hidden bg-white p-2 rounded-xl border border-amber-200" id="hint-text-3">Çözüm metni...</p>
                </div>
            </div>

            <button onclick="closeHintModal()" class="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase transition-all mt-1">Anladım, Göreve Dön</button>
        </div>
    </div>

    <!-- 👨‍🏫 4. ÖĞRETMEN & AKILLI TAHTA KONTROL PANELİ (Sınıf Yarışması Dahil) -->
    <div id="modal-teacher" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 hidden" onclick="if(event.target===this) closeTeacherModal()">
        <div class="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl text-slate-800 flex flex-col gap-3.5 max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <div class="flex items-center gap-2">
                    <span class="w-9 h-9 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg"><i class="fa-solid fa-chalkboard-user"></i></span>
                    <div>
                        <h3 class="text-sm sm:text-base font-black font-orbitron text-slate-800">ÖĞRETMEN KONTROLÜ & AKILLI TAHTA</h3>
                        <span class="text-xs text-slate-500 font-mono">Bölüm atlama ve sınıf yarışma modu</span>
                    </div>
                </div>
                <button onclick="closeTeacherModal()" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 flex items-center justify-center text-sm transition-all"><i class="fa-solid fa-xmark"></i></button>
            </div>

            <!-- 8 Odaya Doğrudan Geçiş -->
            <div>
                <h4 class="text-xs font-bold text-slate-700 mb-1.5 font-mono uppercase">Doğrudan Odaya Geç (8 Laboratuvar):</h4>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    <button onclick="teacherJumpToRoom(1)" class="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-left text-xs font-bold"><span class="text-indigo-600 font-mono block">Oda 1</span>Acil Durum</button>
                    <button onclick="teacherJumpToRoom(2)" class="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-left text-xs font-bold"><span class="text-indigo-600 font-mono block">Oda 2</span>Uzay Teknolojisi</button>
                    <button onclick="teacherJumpToRoom(3)" class="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-left text-xs font-bold"><span class="text-indigo-600 font-mono block">Oda 3</span>Millî Uydular</button>
                    <button onclick="teacherJumpToRoom(4)" class="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-left text-xs font-bold"><span class="text-indigo-600 font-mono block">Oda 4</span>Uzay Kirliliği</button>
                    <button onclick="teacherJumpToRoom(5)" class="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-left text-xs font-bold"><span class="text-indigo-600 font-mono block">Oda 5</span>Teleskop Tasarım</button>
                    <button onclick="teacherJumpToRoom(6)" class="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-left text-xs font-bold"><span class="text-indigo-600 font-mono block">Oda 6</span>Yıldız Döngüsü</button>
                    <button onclick="teacherJumpToRoom(7)" class="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-left text-xs font-bold"><span class="text-indigo-600 font-mono block">Oda 7</span>Galaksi & Evren</button>
                    <button onclick="teacherJumpToRoom(8)" class="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-left text-xs font-bold"><span class="text-indigo-600 font-mono block">Oda 8</span>Dünya'ya Dönüş</button>
                </div>
            </div>

            <!-- Sınıf Takım Yarışması Modu (Takım A vs Takım B) -->
            <div class="bg-indigo-50/70 p-3 rounded-2xl border border-indigo-200 flex flex-col gap-2">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-indigo-900 font-mono uppercase flex items-center gap-1.5">
                        <i class="fa-solid fa-users text-indigo-600"></i> Sınıf Takım Yarışması Modu
                    </span>
                    <button onclick="resetTeamScores()" class="text-[10px] text-indigo-600 underline font-mono">Puanları Sıfırla</button>
                </div>
                <div class="grid grid-cols-2 gap-2 text-center">
                    <div class="bg-white p-2.5 rounded-xl border border-indigo-200">
                        <div class="text-xs font-bold text-sky-700">TAKIM A</div>
                        <div class="text-2xl font-black font-mono text-slate-800 my-0.5" id="team-a-score">0</div>
                        <div class="flex gap-1 justify-center">
                            <button onclick="addTeamScore('A', 10)" class="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">+10</button>
                            <button onclick="addTeamScore('A', -10)" class="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded">-10</button>
                        </div>
                    </div>
                    <div class="bg-white p-2.5 rounded-xl border border-indigo-200">
                        <div class="text-xs font-bold text-indigo-700">TAKIM B</div>
                        <div class="text-2xl font-black font-mono text-slate-800 my-0.5" id="team-b-score">0</div>
                        <div class="flex gap-1 justify-center">
                            <button onclick="addTeamScore('B', 10)" class="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">+10</button>
                            <button onclick="addTeamScore('B', -10)" class="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded">-10</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Şifre Anahtarı (Öğretmen Referansı) -->
            <div class="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs font-mono text-slate-700">
                <div class="font-bold text-amber-800 mb-1">Bilimsel Cevap Anahtarı:</div>
                <div class="grid grid-cols-2 gap-1 text-[11px]">
                    <div>• Oda 1: <strong>2045</strong> (Arıza Yılı)</div>
                    <div>• Oda 2: <strong>1957</strong> (Sputnik 1)</div>
                    <div>• Oda 3: <strong>1994</strong> (Türksat 1B)</div>
                    <div>• Oda 4: <strong>7800</strong> (Yörünge Hızı)</div>
                    <div>• Oda 5: <strong>1609</strong> (Galileo Teleskop)</div>
                    <div>• Oda 6: <strong>5800</strong> (Güneş Sıcaklık)</div>
                    <div>• Oda 7: <strong>9460</strong> (Işık Yılı trilyon km)</div>
                    <div>• Oda 8: <strong>2026</strong> (Maarif/Giriş)</div>
                </div>
            </div>

            <div class="flex gap-2">
                <button onclick="unlockAllRoomsForClass()" class="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase">
                    Tüm Odaları Aç
                </button>
                <button onclick="resetGameProgress()" class="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-black uppercase">
                    İlerlemeyi Sıfırla
                </button>
            </div>
        </div>
    </div>

    <!-- 🏆 5. ÜSTÜN BAŞARI SERTİFİKASI & ZAFER MODALI -->
    <div id="modal-victory" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 hidden">
        <div class="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 w-full max-w-lg shadow-2xl text-slate-800 flex flex-col items-center text-center gap-3 relative overflow-hidden max-h-[90vh] overflow-y-auto">
            
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center text-3xl sm:text-4xl shadow-inner border border-amber-200">
                <i class="fa-solid fa-trophy"></i>
            </div>

            <div>
                <span class="px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-black uppercase tracking-wider">
                    GÖREV BAŞARIYLA TAMAMLANDI!
                </span>
                <h2 class="text-xl sm:text-2xl font-black font-orbitron text-slate-800 mt-2">
                    DÜNYA'YA GÜVENLE DÖNDÜN!
                </h2>
                <p class="text-xs text-slate-600 mt-1 max-w-md">
                    ORBITAL-7 İstasyonu'ndaki 8 bilimsel güvenlik kilidini 7. sınıf uzay bilimleri bilginle çözdün ve dönüş kapsülüyle Dünya'ya güvenle iniş yaptın!
                </p>
            </div>

            <!-- Rozet Galerisi (8 Rozet) -->
            <div class="w-full">
                <div class="text-[11px] font-mono font-bold text-slate-500 mb-1.5 uppercase">Kazanılan Başarı Rozetleri:</div>
                <div class="grid grid-cols-4 gap-1.5 w-full" id="victory-badges-grid">
                    <!-- Rozetler JS ile doldurulur -->
                </div>
            </div>

            <!-- İstatistik Kartları -->
            <div class="grid grid-cols-3 gap-2 w-full max-w-sm">
                <div class="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                    <div class="text-[9px] text-slate-500 font-mono font-bold">SÜRE</div>
                    <div class="text-base font-black font-mono text-sky-700" id="victory-final-time">00:00</div>
                </div>
                <div class="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                    <div class="text-[9px] text-slate-500 font-mono font-bold">BİLİM PUANI</div>
                    <div class="text-base font-black font-mono text-amber-600" id="victory-final-score">100 / 100</div>
                </div>
                <div class="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                    <div class="text-[9px] text-slate-500 font-mono font-bold">RÜTBE</div>
                    <div class="text-[11px] font-black text-emerald-700 truncate mt-1">UZAY KAHRAMANI</div>
                </div>
            </div>

            <!-- Sertifika İsim Girişi -->
            <div class="w-full max-w-xs flex flex-col gap-2">
                <input type="text" id="student-name-input" placeholder="Adınızı ve Soyadınızı Yazın" class="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-center font-bold text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                <button onclick="downloadCertificate()" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all cursor-pointer">
                    <i class="fa-solid fa-certificate mr-1.5"></i> Başarı Sertifikasını İndir
                </button>
            </div>

            <div class="flex gap-2 w-full max-w-xs">
                <button onclick="location.reload()" class="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase">Yeniden Oyna</button>
                <button onclick="exitSimulation()" class="flex-1 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs uppercase">Çıkış</button>
            </div>
        </div>
    </div>

    <!-- 📜 6. BAŞLANGIÇ HİKÂYESİ & ZORLUK SEÇİMİ MODALI -->
    <div id="modal-intro" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3">
        <div class="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 w-full max-w-md shadow-2xl text-slate-800 flex flex-col gap-3.5 relative">
            <div class="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center text-2xl mx-auto border border-sky-200 shadow-sm">
                <i class="fa-solid fa-user-astronaut"></i>
            </div>
            
            <div class="text-center">
                <span class="px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 font-mono text-[10px] font-bold uppercase">
                    YIL: 2045 • ORBITAL-7 BİLİM İSTASYONU
                </span>
                <h3 class="text-lg sm:text-xl font-black font-orbitron text-slate-800 mt-1.5">
                    UZAYDAN KAÇIŞ: 3D BİLİMSEL KAÇIŞ ODASI
                </h3>
                <p class="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Yörüngedeki istasyonda teknik arıza meydana geldi, Dünya ile iletişim koptu ve acil durum kilitleri devreye girdi. 7. sınıf Fen Bilimleri uzay teknolojileri bilginle 8 odayı çöz, istasyonu onar ve dönüş kapsülüyle Dünya'ya dön!
                </p>
            </div>

            <!-- Zorluk Seviyesi Seçimi -->
            <div>
                <label class="text-[11px] font-mono font-bold text-slate-600 block mb-1">Zorluk Seviyesi:</label>
                <div class="grid grid-cols-3 gap-1.5 text-center">
                    <button onclick="setGameDifficulty('easy')" id="diff-easy" class="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-sky-50 text-xs font-bold transition-all">
                        Kolay
                    </button>
                    <button onclick="setGameDifficulty('normal')" id="diff-normal" class="p-2 rounded-xl border-2 border-sky-500 bg-sky-50 text-sky-900 text-xs font-black transition-all">
                        Normal
                    </button>
                    <button onclick="setGameDifficulty('expert')" id="diff-expert" class="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-sky-50 text-xs font-bold transition-all">
                        Uzman
                    </button>
                </div>
            </div>

            <div class="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 text-xs text-slate-700 font-mono space-y-1 shadow-inner text-[11px]">
                <div>🔒 8 Etkileşimli Kaçış Odası & 3D Keşif</div>
                <div>📡 Türkiye'nin Uyduları, Uzay Kirliliği & Teleskoplar</div>
                <div>⭐ Yıldızların Yaşam Döngüsü & Galaksi Haritası</div>
                <div>🤖 Akıllı Rehber NOVA & 3 Aşamalı İpucu</div>
            </div>

            <button onclick="startGameMission()" class="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white font-black font-orbitron text-xs sm:text-sm uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer">
                <i class="fa-solid fa-play mr-1.5"></i> İSTASYONA GİRİŞ YAP
            </button>
        </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- JAVASCRIPT: 8 ODA, THREE.JS 3D MOTORU, PBR MATERYALLER, BULMACALAR -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <script>
        // -----------------------------------------------------------------
        // 1. SES SENTEZLEYİCİSİ (Web Audio API - Telsiz, Uyarı, Lazer, Hidrolik)
        // -----------------------------------------------------------------
        let audioCtx = null;
        let isAudioEnabled = true;
        let isSpeechEnabled = true;

        function initAudio() {
            if (!audioCtx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                audioCtx = new AudioContext();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
        }

        function playSciFiSound(type) {
            if (!isAudioEnabled) return;
            initAudio();
            if (!audioCtx) return;

            const t = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            if (type === 'beep') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, t);
                gain.gain.setValueAtTime(0.12, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
                osc.start(t);
                osc.stop(t + 0.08);
            } else if (type === 'door') {
                // Hidrolik kapı açılma puf ve süzülme sesi
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(160, t);
                osc.frequency.exponentialRampToValueAtTime(45, t + 0.7);
                gain.gain.setValueAtTime(0.2, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
                osc.start(t);
                osc.stop(t + 0.7);
            } else if (type === 'grant') {
                // Pozitif onay melodisi (C-E-G-C)
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, t);
                osc.frequency.setValueAtTime(659.25, t + 0.09);
                osc.frequency.setValueAtTime(783.99, t + 0.18);
                osc.frequency.setValueAtTime(1046.50, t + 0.27);
                gain.gain.setValueAtTime(0.2, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
                osc.start(t);
                osc.stop(t + 0.6);
            } else if (type === 'error') {
                // Hatalı şifre uyarısı
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(180, t);
                osc.frequency.setValueAtTime(120, t + 0.12);
                gain.gain.setValueAtTime(0.25, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
                osc.start(t);
                osc.stop(t + 0.35);
            } else if (type === 'laser') {
                // Enkaz savar lazer ışını
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(1400, t);
                osc.frequency.exponentialRampToValueAtTime(120, t + 0.3);
                gain.gain.setValueAtTime(0.22, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
                osc.start(t);
                osc.stop(t + 0.3);
            } else if (type === 'victory') {
                // Zafer Fanfarı
                const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
                notes.forEach((freq, i) => {
                    const o = audioCtx.createOscillator();
                    const g = audioCtx.createGain();
                    o.connect(g);
                    g.connect(audioCtx.destination);
                    o.type = 'triangle';
                    o.frequency.setValueAtTime(freq, t + i * 0.12);
                    g.gain.setValueAtTime(0.22, t + i * 0.12);
                    g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.45);
                    o.start(t + i * 0.12);
                    o.stop(t + i * 0.12 + 0.45);
                });
            }
        }

        function toggleAudio() {
            isAudioEnabled = !isAudioEnabled;
            const icon = document.getElementById('audio-icon');
            if (isAudioEnabled) {
                icon.className = 'fa-solid fa-volume-high text-xs text-sky-600';
                initAudio();
                playSciFiSound('beep');
            } else {
                icon.className = 'fa-solid fa-volume-xmark text-xs text-slate-500';
            }
        }

        // Web Speech API - Türkçe Sesli Rehber (NOVA)
        function speakText(text) {
            if (!isSpeechEnabled || !('speechSynthesis' in window)) return;
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'tr-TR';
            utterance.rate = 1.0;
            utterance.pitch = 1.05;
            window.speechSynthesis.speak(utterance);
        }

        function toggleSpeech() {
            isSpeechEnabled = !isSpeechEnabled;
            const icon = document.getElementById('speech-icon');
            if (isSpeechEnabled) {
                icon.className = 'fa-solid fa-headset text-xs text-sky-600';
                speakText("NOVA Türkçe sesli rehberi devrede.");
            } else {
                icon.className = 'fa-solid fa-headset text-xs text-slate-500 line-through';
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            }
        }

        // -----------------------------------------------------------------
        // 2. OYUN DURUMU & 8 ODA VERİ MODELİ
        // -----------------------------------------------------------------
        const GAME_DATA = {
            currentRoom: 1,
            unlockedRooms: 1,
            score: 0,
            elapsedSeconds: 0,
            timerInterval: null,
            difficulty: 'normal',
            zeroGMode: false,
            teamScores: { A: 0, B: 0 },
            badgesEarned: [],
            roomCodes: {
                1: '2045', // İstasyon arıza yılı
                2: '1957', // Sputnik 1
                3: '1994', // Türksat 1B
                4: '7800', // Yörünge hızı (7.8 km/s)
                5: '1609', // Galileo teleskop
                6: '5800', // Güneş yüzey sıcaklığı
                7: '9460', // 1 Işık Yılı (~9.46 trilyon km)
                8: '2026'  // Türkiye Yüzyılı Maarif Modeli
            },
            roomBriefings: {
                1: "Uzay kâşifi, dikkat! ORBITAL-7 istasyonunda kritik bir sistem arızası tespit edildi. Dünya ile bağlantımız kesildi. Güvenli dönüş sistemini etkinleştirmek için kontrol odasındaki üç terminali incele, enerji akışını sırayla aç ve ana şalteri kaldır!",
                2: "Uzay Teknolojileri Laboratuvarındasın. Karşında roket, yapay uydu, uzay sondası, uzay mekiği, istasyon ve uzay teleskobu bulunuyor. Modelleri 360 derece incele, görevleriyle eşleştir ve kapı şifresini çöz!",
                3: "Türkiye ve Uydu Kontrol Merkezindesin. Pencereden mavi Dünya görünüyor. TÜRKSAT 6A, İMECE ve RASAT uydularımızın görevlerini analiz et, parabolik anteni 42 dereceye kilitle ve Dünya ile bağlantı kur!",
                4: "Dikkat! Radar sistemi yaklaşan bir uzay enkazı tespit etti! İşlevini yitirmiş uydular ve roket parçaları 7.8 kilometre saniye hızla dönüyor. Patlatmak kirliliği artırır; güvenli kaçınma manevrasını seç ve kalkanı devreye sok!",
                5: "Teleskop Tasarım Laboratuvarındasın. Işık kirliliğinden uzak bir gözlem sistemi kurmamız gerekiyor. Mercek, çukur ayna ve sensör parçalarını birleştir; Hubble ve James Webb teleskoplarının farklarını analiz ederek kubbeyi aç!",
                6: "Holografik Yıldız Laboratuvarındasın. Yıldızlar bulutsularda doğar ve kütlelerine göre farklı yollarla ölür. Küçük kütleli ve büyük kütleli yıldızların yaşam evrelerini doğru sıraya diz ve simülasyonu çalıştır!",
                7: "Kozmik Harita Odasındasın! Samanyolu galaksisi, Andromeda, Büyükayı ve Avcı takımyıldızları parıldıyor. Takımyıldızların desen olduğunu, ışık yılının zaman değil mesafe olduğunu ortaya koy ve haritayı onar!",
                8: "Tebrikler kâşif! Tüm sistemleri kurtardın. Şimdi ana kontrol odasındaki dönüş kapsülünü hazırla, atmosfere giriş açısını ve ısı kalkanını doğrula. Dünya'ya güvenle dönmeye hazır mısın? Motorları ateşle!"
            },
            hints: {
                1: [
                    "Kontrol odasındaki 3 terminali sırayla incele.",
                    "Bilimsel ipucu: Uzay istasyonunda ana enerji reaktörü ve yaşam destek devreye girmeden diğer laboratuvarların kapıları açılamaz.",
                    "Çözüm: Terminalleri sırayla 'Reaktör', 'Yaşam Destek' ve 'Haberleşme' olarak aktif et veya terminale 2045 yaz."
                ],
                2: [
                    "3D modelleri tıkla: Roket fırlatır, sonda uzayı gezer, uydu yörüngede dolanır, mekik uçak gibi iner.",
                    "Bilimsel ipucu: Uzay mekiği insanlıdır ve tekrar kullanılabilir; uzay sondaları ise insansız derin uzay kâşifleridir.",
                    "Çözüm: Görev istasyonuna uygun araçları yerleştir veya ilk yapay uydunun yılı olan 1957 kodunu gir."
                ],
                3: [
                    "TÜRKSAT haberleşme, İMECE ve RASAT yer gözlem uydumuzdur.",
                    "Bilimsel ipucu: Türkiye'nin ilk yerli ve millî haberleşme uydusu TÜRKSAT 6A'dır. Alper Gezeravcı ilk astronotumuzdur.",
                    "Çözüm: Anten açısını 42°'ye getir veya Türksat 1B'nin yılı olan 1994'ü yaz."
                ],
                4: [
                    "Uzay kirliliği: Ömrü tükenen uydular, roket parçaları ve yakıt tanklarıdır. Doğal meteorlar kirlilik değildir.",
                    "Bilimsel ipucu: Enkazı patlatmak sorunu çözmez; binlerce yeni parça üretir! Doğru çözüm: Kaçınma manevrası ve kontrollü atmosfere sokmadır.",
                    "Çözüm: Kaçınma manevrasını onayla veya yörünge hızı olan 7800 kodunu gir."
                ],
                5: [
                    "Rasathaneler neden şehirden uzağa kurulur? Işık kirliliği, hava kirliliği ve bulutluluk az olsun diye.",
                    "Bilimsel ipucu: Hubble Dünya yörüngesinde, James Webb ise Dünya'dan 1.5 milyon km uzakta Güneş-Dünya L2 noktasındadır.",
                    "Çözüm: Optik parçaları birleştir veya Galileo'nun teleskobu gökyüzüne çevirdiği 1609 yılını gir."
                ],
                6: [
                    "Küçük kütleli yol: Bulutsu → Önyıldız → Ana Kol (Güneş) → Kırmızı Dev → Gezegenimsi Bulutsu → Beyaz Cüce.",
                    "Büyük kütleli yol: Bulutsu → Önyıldız → Kırmızı Süperdev → Süpernova → Nötron Yıldızı veya Kara Delik.",
                    "Çözüm: Güneş asla süpernova patlamaz ve kara deliğe dönüşmez! Güneş yüzey sıcaklık kodu olan 5800'ü gir."
                ],
                7: [
                    "Hiyerarşi: Gezegen → Yıldız (Güneş) → Yıldız Sistemi → Galaksi (Samanyolu) → Uzay → Evren.",
                    "Bilimsel ipucu: Işık yılı ZAMAN birimi DEĞİLDİR! Işığın 1 yılda aldığı devasa mesafe birimidir (~9.46 trilyon km).",
                    "Çözüm: Hiyerarşiyi sırala veya 1 ışık yılı mesafe kodu olan 9460'ı gir."
                ],
                8: [
                    "Dünya atmosferine giriş açısı çok dik olursa kapsül basınca dayanamaz, çok yatay olursa uzaya geri seker.",
                    "Bilimsel ipucu: Isı kalkanı sürtünme sıcaklığını önler, paraşütler güvenli iniş sağlar.",
                    "Çözüm: Son onay kodu olan 2026'yı gir ve dönüşü başlat!"
                ]
            }
        };

        // -----------------------------------------------------------------
        // 3. THREE.JS 3D GRAFİK MOTORU (İstasyon Odaları, Kapılar, PBR Modeller)
        // -----------------------------------------------------------------
        let scene, camera, renderer, controls;
        let stationGroup, currentRoomGroup, doorMeshLeft, doorMeshRight;
        let animatedObjects = [];
        let raycaster, mouse;

        function initThreeJS() {
            const canvas = document.getElementById('station-canvas');
            const container = canvas.parentElement;
            const w = container.clientWidth;
            const h = container.clientHeight;

            // Sahne (Aydınlık & Ferah Fütüristik Uzay Laboratuvarı)
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xdbeafe);
            scene.fog = new THREE.FogExp2(0xe0f2fe, 0.012);

            // Kamera
            camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100);
            camera.position.set(0, 1.6, 4.5);

            // Renderer
            renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
            renderer.setSize(w, h);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.25;

            // OrbitControls
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.maxDistance = 8.5;
            controls.minDistance = 1.2;
            controls.maxPolarAngle = Math.PI / 2 + 0.1;
            controls.target.set(0, 1.2, 0);

            // Raycaster
            raycaster = new THREE.Raycaster();
            mouse = new THREE.Vector2();

            // Işıklandırma
            setupStationLighting();

            // Derin Uzay & Dünya Görünümü
            createDeepSpaceEnvironment();

            // İstasyon Temel Mimarisi
            stationGroup = new THREE.Group();
            scene.add(stationGroup);
            buildStationArchitecture();

            // Aktif Oda Nesnelerini Oluştur
            loadRoom3DEnvironment(GAME_DATA.currentRoom);

            // Event Listeners
            window.addEventListener('resize', onWindowResize);
            canvas.addEventListener('pointerdown', onCanvasPointerDown);

            // Render Döngüsü
            animate();
        }

        function setupStationLighting() {
            const ambient = new THREE.AmbientLight(0xffffff, 1.35);
            scene.add(ambient);

            const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
            mainLight.position.set(5, 10, 7);
            scene.add(mainLight);

            const ceilingLight = new THREE.PointLight(0x38bdf8, 1.6, 16);
            ceilingLight.position.set(0, 3.2, 0);
            scene.add(ceilingLight);

            // Kapı Durum LED Işığı (Kırmızı: Kilitli, Yeşil: Açık)
            window.doorLight = new THREE.PointLight(0xef4444, 2.5, 6);
            window.doorLight.position.set(0, 2.7, -3.8);
            scene.add(window.doorLight);

            // Hologram Alt Işığı
            const holoLight = new THREE.SpotLight(0x0ea5e9, 2.8, 10, Math.PI / 4, 0.4);
            holoLight.position.set(0, 0.1, 0);
            holoLight.target.position.set(0, 1.5, 0);
            scene.add(holoLight);
            scene.add(holoLight.target);
        }

        function createDeepSpaceEnvironment() {
            // Yıldız parçacıkları
            const starsGeo = new THREE.BufferGeometry();
            const count = 1200;
            const positions = new Float32Array(count * 3);
            for (let i = 0; i < count * 3; i += 3) {
                positions[i] = (Math.random() - 0.5) * 80;
                positions[i + 1] = (Math.random() - 0.5) * 80;
                positions[i + 2] = (Math.random() - 0.5) * 80;
            }
            starsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            const starsMat = new THREE.PointsMaterial({ color: 0x38bdf8, size: 0.3, transparent: true, opacity: 0.85 });
            const starField = new THREE.Points(starsGeo, starsMat);
            scene.add(starField);

            // Uzay Penceresinden Görünen Gerçekçi 3D Dünya Küresi
            const earthGeo = new THREE.SphereGeometry(14, 32, 32);
            const earthMat = new THREE.MeshStandardMaterial({
                color: 0x2563eb,
                roughness: 0.4,
                metalness: 0.1
            });
            const earthMesh = new THREE.Mesh(earthGeo, earthMat);
            earthMesh.position.set(22, -10, -28);
            scene.add(earthMesh);
            animatedObjects.push({ mesh: earthMesh, rotY: 0.001, isPermanent: true });
        }

        function buildStationArchitecture() {
            // Zemin: Parlak Açık Metalik Paneller
            const floorGeo = new THREE.PlaneGeometry(8, 9);
            const floorMat = new THREE.MeshStandardMaterial({
                color: 0xf1f5f9,
                roughness: 0.2,
                metalness: 0.4
            });
            const floor = new THREE.Mesh(floorGeo, floorMat);
            floor.rotation.x = -Math.PI / 2;
            stationGroup.add(floor);

            // Zemin Sci-Fi Işık Çizgileri
            const lineMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
            const lineGeo = new THREE.BoxGeometry(0.08, 0.02, 8.5);
            const leftLine = new THREE.Mesh(lineGeo, lineMat);
            leftLine.position.set(-2.2, 0.01, 0);
            const rightLine = new THREE.Mesh(lineGeo, lineMat);
            rightLine.position.set(2.2, 0.01, 0);
            stationGroup.add(leftLine, rightLine);

            // Tavan
            const ceiling = new THREE.Mesh(floorGeo, new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 }));
            ceiling.position.y = 3.4;
            ceiling.rotation.x = Math.PI / 2;
            stationGroup.add(ceiling);

            // Yan Duvarlar
            const wallMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.2 });
            const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(9, 3.4), wallMat);
            leftWall.position.set(-3.8, 1.7, 0);
            leftWall.rotation.y = Math.PI / 2;
            stationGroup.add(leftWall);

            const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(9, 3.4), wallMat);
            rightWall.position.set(3.8, 1.7, 0);
            rightWall.rotation.y = -Math.PI / 2;
            stationGroup.add(rightWall);

            // Sağ Duvarda Büyük Uzay Gözlem Penceresi
            const winFrame = new THREE.Mesh(new THREE.RingGeometry(1.2, 1.4, 24), new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8 }));
            winFrame.position.set(3.78, 1.8, -1.2);
            winFrame.rotation.y = -Math.PI / 2;
            stationGroup.add(winFrame);

            // Arka Duvar & Hidrolik Blast Kapısı
            const backWallGeo = new THREE.PlaneGeometry(8, 3.4);
            const backWall = new THREE.Mesh(backWallGeo, new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.3 }));
            backWall.position.set(0, 1.7, -4.2);
            stationGroup.add(backWall);

            // Kapı Çerçevesi
            const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.7, 0.15), new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8 }));
            doorFrame.position.set(0, 1.35, -4.15);
            stationGroup.add(doorFrame);

            // Sol Kapı Kanadı
            const doorPartGeo = new THREE.BoxGeometry(1.05, 2.5, 0.08);
            const doorMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.6, roughness: 0.2 });
            doorMeshLeft = new THREE.Mesh(doorPartGeo, doorMat);
            doorMeshLeft.position.set(-0.55, 1.35, -4.12);
            stationGroup.add(doorMeshLeft);

            // Sağ Kapı Kanadı
            doorMeshRight = new THREE.Mesh(doorPartGeo, doorMat);
            doorMeshRight.position.set(0.55, 1.35, -4.12);
            stationGroup.add(doorMeshRight);

            // Kapı Üstü Durum LED Ekranı
            const ledGeo = new THREE.BoxGeometry(0.8, 0.15, 0.05);
            window.ledStatusMesh = new THREE.Mesh(ledGeo, new THREE.MeshBasicMaterial({ color: 0xef4444 }));
            window.ledStatusMesh.position.set(0, 2.7, -4.1);
            stationGroup.add(window.ledStatusMesh);
        }

        function animateDoorOpen() {
            playSciFiSound('door');
            if (window.doorLight) window.doorLight.color.setHex(0x10b981);
            if (window.ledStatusMesh) window.ledStatusMesh.material.color.setHex(0x10b981);

            let progress = 0;
            const doorInterval = setInterval(() => {
                progress += 0.04;
                if (doorMeshLeft && doorMeshRight) {
                    doorMeshLeft.position.x = -0.55 - progress * 0.75;
                    doorMeshRight.position.x = 0.55 + progress * 0.75;
                }
                if (progress >= 1) {
                    clearInterval(doorInterval);
                }
            }, 25);
        }

        function resetDoor() {
            if (doorMeshLeft && doorMeshRight) {
                doorMeshLeft.position.x = -0.55;
                doorMeshRight.position.x = 0.55;
            }
            if (window.doorLight) window.doorLight.color.setHex(0xef4444);
            if (window.ledStatusMesh) window.ledStatusMesh.material.color.setHex(0xef4444);
        }

        // 8 ODANIN 3D NESNELERİNİ YÜKLE
        function loadRoom3DEnvironment(roomNum) {
            if (currentRoomGroup) {
                scene.remove(currentRoomGroup);
            }
            currentRoomGroup = new THREE.Group();
            scene.add(currentRoomGroup);
            animatedObjects = animatedObjects.filter(o => o.isPermanent);
            resetDoor();

            switch (roomNum) {
                case 1: buildRoom1Objects(); break;
                case 2: buildRoom2Objects(); break;
                case 3: buildRoom3Objects(); break;
                case 4: buildRoom4Objects(); break;
                case 5: buildRoom5Objects(); break;
                case 6: buildRoom6Objects(); break;
                case 7: buildRoom7Objects(); break;
                case 8: buildRoom8Objects(); break;
            }

            renderDynamicPuzzleUI(roomNum);
        }

        // -----------------------------------------------------------------
        // 4. 8 ODA İÇİN 3D MODELLER (PBR, DETAYLI GEOMETRİ)
        // -----------------------------------------------------------------

        // ODA 1: Kontrol Odası & 3 Terminal
        function buildRoom1Objects() {
            const consoleGroup = new THREE.Group();
            // Ana Konsol Masası
            const desk = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.9, 1.2), new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 }));
            desk.position.set(0, 0.45, -1.2);
            consoleGroup.add(desk);

            // 3 Holografik Monitör
            [-1.0, 0, 1.0].forEach((x, idx) => {
                const screenFrame = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.04), new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 }));
                screenFrame.position.set(x, 1.15, -1.15);
                const display = new THREE.Mesh(new THREE.PlaneGeometry(0.74, 0.44), new THREE.MeshBasicMaterial({ color: idx === 0 ? 0x0284c7 : (idx === 1 ? 0x059669 : 0xd97706) }));
                display.position.set(x, 1.15, -1.12);
                consoleGroup.add(screenFrame, display);
            });

            consoleGroup.userData = {
                title: "ORBITAL-7 ANA ENERJİ KONSOLU",
                desc: "İstasyonun füzyon reaktörü, yaşam destek kabinleri ve telemetri antenlerini kontrol eden merkezi yönetim ünitesidir."
            };
            currentRoomGroup.add(consoleGroup);
        }

        // ODA 2: Uzay Teknolojileri Laboratuvarı (Roket, Yapay Uydu, Uzay Sondası)
        function buildRoom2Objects() {
            const labGroup = new THREE.Group();
            // Kaide
            const ped = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 0.3, 32), new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9 }));
            ped.position.set(0, 0.15, 0);
            labGroup.add(ped);

            // 1. Roket
            const rocketGroup = new THREE.Group();
            const body = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 1.4, 16), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3 }));
            const cone = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 16), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
            cone.position.y = 0.95;
            rocketGroup.add(body, cone);
            rocketGroup.position.set(-1.4, 1.2, -0.4);
            rocketGroup.userData = {
                title: "UZAY ROKETİ",
                desc: "Uzay araçlarını ve uyduları yerçekimini yenerek Dünya atmosferinden çıkaran tek veya çok kademeli itki aracıdır."
            };
            labGroup.add(rocketGroup);
            animatedObjects.push({ mesh: rocketGroup, rotY: 0.015 });

            // 2. Yapay Uydu
            const satGroup = new THREE.Group();
            const satBody = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8 }));
            const wings = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.02, 0.35), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
            satGroup.add(satBody, wings);
            satGroup.position.set(0, 1.3, 0);
            satGroup.userData = {
                title: "YAPAY UYDU",
                desc: "Dünya yörüngesinde dolanarak iletişim, hava tahmini ve yeryüzü gözlemi yapan insan yapımı araçtır."
            };
            labGroup.add(satGroup);
            animatedObjects.push({ mesh: satGroup, rotY: 0.01 });

            // 3. Uzay Sondası
            const probeGroup = new THREE.Group();
            const pSphere = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), new THREE.MeshStandardMaterial({ color: 0x94a3b8 }));
            const dish = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.15, 16), new THREE.MeshStandardMaterial({ color: 0xf8fafc }));
            dish.rotation.x = Math.PI / 2;
            dish.position.z = 0.25;
            probeGroup.add(pSphere, dish);
            probeGroup.position.set(1.4, 1.2, -0.4);
            probeGroup.userData = {
                title: "UZAY SONDASI",
                desc: "Gezegenleri, ayları veya gök cisimlerini yakından incelemek üzere Dünya'dan uzaya gönderilen insansız araştırma aracıdır."
            };
            labGroup.add(probeGroup);
            animatedObjects.push({ mesh: probeGroup, rotY: 0.012 });

            currentRoomGroup.add(labGroup);
        }

        // ODA 3: Türkiye ve Uydu Kontrol Merkezi
        function buildRoom3Objects() {
            const uyduGroup = new THREE.Group();
            // Parabolik Yer İstasyonu Çanağı
            const base = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 0.8, 16), new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 }));
            uyduGroup.add(base);

            const dishGeo = new THREE.SphereGeometry(1.2, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2.5);
            window.satelliteDishMesh = new THREE.Mesh(dishGeo, new THREE.MeshStandardMaterial({ color: 0xe2e8f0, side: THREE.DoubleSide, metalness: 0.7 }));
            window.satelliteDishMesh.position.set(0, 1.3, 0);
            window.satelliteDishMesh.rotation.x = Math.PI / 3;
            uyduGroup.add(window.satelliteDishMesh);

            // Veri Lazer Demeti
            const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.08, 3.5, 8), new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.7 }));
            beam.position.set(0, 2.5, -0.5);
            beam.rotation.x = Math.PI / 6;
            uyduGroup.add(beam);

            uyduGroup.position.set(0, 0.4, 0);
            uyduGroup.userData = {
                title: "TÜRKİYE MİLLÎ UYDU FREKANS İSTASYONU",
                desc: "TÜRKSAT 6A ve İMECE uydularıyla 42° Doğu yörüngesinde güvenli haberleşme ve yüksek çözünürlüklü gözlem sinyali kurar."
            };
            currentRoomGroup.add(uyduGroup);
        }

        // ODA 4: Uzay Kirliliği: Çarpışmayı Önle (Kessler Kuşağı & Enkazlar)
        function buildRoom4Objects() {
            const debrisGroup = new THREE.Group();
            // Mini Dünya Modeli
            const globe = new THREE.Mesh(new THREE.SphereGeometry(1.0, 32, 32), new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.4 }));
            debrisGroup.add(globe);

            // Yörüngede Dönen 28 Enkaz Parçası
            const junkMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.9 });
            for (let i = 0; i < 28; i++) {
                const junk = new THREE.Mesh(new THREE.DodecahedronGeometry(0.05 + Math.random() * 0.04), junkMat);
                const r = 1.35 + Math.random() * 0.85;
                const theta = Math.random() * Math.PI * 2;
                const phi = (Math.random() - 0.5) * Math.PI;
                junk.position.set(r * Math.cos(theta) * Math.cos(phi), r * Math.sin(phi), r * Math.sin(theta) * Math.cos(phi));
                debrisGroup.add(junk);
            }

            debrisGroup.position.set(0, 1.3, 0);
            debrisGroup.userData = {
                title: "YÖRÜNGE ENKAZ VE KİRLİLİK RADARI",
                desc: "İşlevini yitirmiş 30.000'den fazla yapay uydu ve roket gövdesi saatte 28.000 km hızla dönerek uzay istasyonlarını tehdit eder."
            };
            currentRoomGroup.add(debrisGroup);
            animatedObjects.push({ mesh: debrisGroup, rotY: 0.018, rotX: 0.006 });
        }

        // ODA 5: Teleskop Tasarım Laboratuvarı (Optik Tüp, Ayna & Mercek)
        function buildRoom5Objects() {
            const telGroup = new THREE.Group();
            // Tripod
            const legMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 });
            for (let i = 0; i < 3; i++) {
                const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.3, 8), legMat);
                const angle = (i * Math.PI * 2) / 3;
                leg.position.set(Math.sin(angle) * 0.45, 0.65, Math.cos(angle) * 0.45);
                leg.rotation.z = Math.sin(angle) * 0.25;
                leg.rotation.x = Math.cos(angle) * 0.25;
                telGroup.add(leg);
            }

            // Teleskop Optik Gövdesi
            const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 1.6, 24), new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.7 }));
            tube.rotation.x = Math.PI / 4;
            tube.position.set(0, 1.4, 0);
            telGroup.add(tube);

            telGroup.position.set(0, 0, 0);
            telGroup.userData = {
                title: "OPTİK GÖZLEMEVİ TELESKOBU",
                desc: "Çukur ayna ve mercekler yardımıyla uzaktaki gök cisimlerinin ışığını toplayıp odaklayan bilimsel gözlem aygıtıdır."
            };
            currentRoomGroup.add(telGroup);
            animatedObjects.push({ mesh: telGroup, rotY: 0.006 });
        }

        // ODA 6: Yıldızların Yaşam Döngüsü (Nebula & Füzyon Küresi)
        function buildRoom6Objects() {
            const starLabGroup = new THREE.Group();
            // Merkezi Parlayan Yıldız Küresi
            const starGeo = new THREE.SphereGeometry(0.85, 32, 32);
            const starMat = new THREE.MeshStandardMaterial({
                color: 0xfbbf24,
                emissive: 0xd97706,
                emissiveIntensity: 0.6,
                roughness: 0.3
            });
            const starMesh = new THREE.Mesh(starGeo, starMat);
            starMesh.position.set(0, 1.4, 0);
            starLabGroup.add(starMesh);

            // Korona ve Nebula Parçacık Halkası
            const ringGeo = new THREE.RingGeometry(1.1, 1.6, 32);
            const ringMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide, transparent: true, opacity: 0.45 });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.position.set(0, 1.4, 0);
            ring.rotation.x = Math.PI / 3;
            starLabGroup.add(ring);

            starLabGroup.userData = {
                title: "HOLOGRAFİK YILDIZ EVRİM SİMÜLATÖRÜ",
                desc: "Yıldızların bulutsudan (nebula) doğuşunu ve başlangıç kütlesine göre beyaz cüce, nötron yıldızı veya kara deliğe dönüşümünü simüle eder."
            };
            currentRoomGroup.add(starLabGroup);
            animatedObjects.push({ mesh: starMesh, rotY: 0.01 }, { mesh: ring, rotZ: 0.015 });
        }

        // ODA 7: Galaksi ve Evren Haritası (Spiral Galaksi & Takımyıldızlar)
        function buildRoom7Objects() {
            const galaxyGroup = new THREE.Group();
            // Spiral Galaksi Parçacıkları (Samanyolu Temsili)
            const count = 900;
            const geo = new THREE.BufferGeometry();
            const pos = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);

            for (let i = 0; i < count; i++) {
                const r = Math.pow(Math.random(), 2) * 2.2;
                const arms = 2;
                const spin = r * 3.5;
                const armAngle = ((i % arms) * 2 * Math.PI) / arms;
                const angle = armAngle + spin + (Math.random() - 0.5) * 0.4;

                pos[i * 3] = Math.cos(angle) * r;
                pos[i * 3 + 1] = (Math.random() - 0.5) * 0.25;
                pos[i * 3 + 2] = Math.sin(angle) * r;

                // Mavi ve Altın çekirdek renkleri
                colors[i * 3] = 0.4 + (1 - r / 2.2) * 0.6;
                colors[i * 3 + 1] = 0.6 + Math.random() * 0.3;
                colors[i * 3 + 2] = 0.9;
            }
            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const mat = new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, opacity: 0.85 });
            const galaxyMesh = new THREE.Points(geo, mat);
            galaxyMesh.position.set(0, 1.4, 0);
            galaxyGroup.add(galaxyMesh);

            galaxyGroup.userData = {
                title: "SAMANYOLU GALAKSİSİ VE EVREN HARİTASI",
                desc: "Güneş Sistemi'mizin içinde bulunduğu milyarlarca yıldız barındıran sarmal galaksi modelidir. Işık yılı bir mesafe birimidir."
            };
            currentRoomGroup.add(galaxyGroup);
            animatedObjects.push({ mesh: galaxyMesh, rotY: 0.008 });
        }

        // ODA 8: Dünya'ya Dönüş Kapsülü (Isı Kalkanlı Kapsül)
        function buildRoom8Objects() {
            const capsuleGroup = new THREE.Group();
            // Koni Kapsül Gövdesi
            const cap = new THREE.Mesh(new THREE.ConeGeometry(1.2, 1.5, 32), new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.8, roughness: 0.2 }));
            cap.position.y = 1.0;

            // Isı Kalkanı Tabanı
            const shield = new THREE.Mesh(new THREE.CylinderGeometry(1.22, 1.25, 0.2, 32), new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.9 }));
            shield.position.y = 0.2;

            capsuleGroup.add(cap, shield);
            capsuleGroup.position.set(0, 0.2, 0);
            capsuleGroup.userData = {
                title: "DÜNYA'YA GÜVENLİ DÖNÜŞ KAPSÜLÜ",
                desc: "Atmosfere 28.000 km/s hızla girerken oluşan 2000°C sürtünme sıcaklığına dayanıklı kalkanı ve paraşütleriyle mürettebatı sağ salim Dünya'ya ulaştırır."
            };
            currentRoomGroup.add(capsuleGroup);
            animatedObjects.push({ mesh: capsuleGroup, rotY: 0.012 });
        }

        // -----------------------------------------------------------------
        // 5. ETKİLEŞİM & BULMACA ARAYÜZÜ (8 ODANIN TAMAMI)
        // -----------------------------------------------------------------
        function renderDynamicPuzzleUI(roomNum) {
            const container = document.getElementById('dynamic-puzzle-container');
            const titleEl = document.getElementById('puzzle-header-title');
            const alertText = document.getElementById('alert-text');
            const statusBadge = document.getElementById('room-status-badge');

            // Header Indicator Dots
            for (let i = 1; i <= 8; i++) {
                const dot = document.getElementById(\`room-dot-\${i}\`);
                if (dot) {
                    if (i === roomNum) {
                        dot.className = "w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center text-[10px] font-bold font-mono transition-all bg-sky-600 text-white shadow-sm ring-2 ring-sky-300";
                    } else if (i <= GAME_DATA.unlockedRooms) {
                        dot.className = "w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center text-[10px] font-bold font-mono transition-all bg-emerald-600 text-white";
                    } else {
                        dot.className = "w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center text-[10px] font-bold font-mono transition-all bg-slate-200 text-slate-500";
                    }
                }
            }

            switch (roomNum) {
                case 1:
                    statusBadge.textContent = "ODA 1: ACİL DURUM: İSTASYONU KURTAR";
                    titleEl.textContent = "Görev 1: Enerji Terminallerini Sırayla Aç (Reaktör → Yaşam Destek → Haberleşme)";
                    alertText.textContent = "Enerji Sistemi Arızası! 3 Terminali sırayla aktive et ve 2045 kodunu gir.";
                    container.innerHTML = \`
                        <div class="w-full flex flex-wrap items-center justify-between gap-2 py-1">
                            <div class="flex flex-wrap items-center gap-1.5" id="r1-terminals">
                                <button onclick="activateR1Terminal(this, 1)" class="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-300 text-slate-700 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer" id="r1-t1">
                                    ⚡ 1. Füzyon Reaktörü
                                </button>
                                <button onclick="activateR1Terminal(this, 2)" class="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-300 text-slate-700 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer opacity-50" id="r1-t2" disabled>
                                    🌱 2. Yaşam Destek (O₂)
                                </button>
                                <button onclick="activateR1Terminal(this, 3)" class="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-300 text-slate-700 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer opacity-50" id="r1-t3" disabled>
                                    📡 3. Haberleşme Gücü
                                </button>
                            </div>
                            <div class="flex items-center gap-2">
                                <span id="r1-status" class="text-xs font-mono font-bold text-slate-500">Adım: (0/3)</span>
                                <button onclick="openKeypadModalWithCode('2045')" class="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-mono text-xs font-bold shadow-sm transition-all active:scale-95">
                                    KODU GİR (2045)
                                </button>
                            </div>
                        </div>
                    \`;
                    break;

                case 2:
                    statusBadge.textContent = "ODA 2: UZAY TEKNOLOJİLERİ LABORATUVARI";
                    titleEl.textContent = "Görev 2: Göreve Uygun Doğru Uzay Teknolojisini Seç";
                    alertText.textContent = "3D modelleri incele. Uzak gök cismi keşfi ve haberleşme teknolojilerini eşleştir.";
                    container.innerHTML = \`
                        <div class="w-full flex flex-col sm:flex-row items-center justify-between gap-2 py-1">
                            <div class="flex flex-wrap items-center gap-1.5">
                                <button onclick="selectTechVehicle(this, 'sonda')" class="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-300 text-slate-700 text-xs font-bold shadow-sm active:scale-95 cursor-pointer">
                                    🛸 İnsansız Derin Uzay Keşfi: <strong>Uzay Sondası</strong>
                                </button>
                                <button onclick="selectTechVehicle(this, 'uydu')" class="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-300 text-slate-700 text-xs font-bold shadow-sm active:scale-95 cursor-pointer">
                                    🛰️ Dünya Yörünge İletişimi: <strong>Yapay Uydu</strong>
                                </button>
                            </div>
                            <button onclick="openKeypadModalWithCode('1957')" class="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-mono text-xs font-bold shadow-sm transition-all active:scale-95">
                                SPUTNIK YILI (1957) İLE AÇ
                            </button>
                        </div>
                    \`;
                    break;

                case 3:
                    statusBadge.textContent = "ODA 3: TÜRKİYE VE UYDU KONTROL MERKEZİ";
                    titleEl.textContent = "Görev 3: Parabolik Anteni 42° Türksat Frekansına Kilitle";
                    alertText.textContent = "Türksat 6A & İMECE sinyalini yakalamak için açıyı 42°'ye getir.";
                    container.innerHTML = \`
                        <div class="w-full flex flex-col sm:flex-row items-center justify-between gap-2.5 py-1">
                            <div class="flex items-center gap-3 w-full sm:w-auto">
                                <span class="text-xs font-mono font-bold text-slate-700">Anten Açısı:</span>
                                <input type="range" id="antenna-slider" min="0" max="90" value="15" oninput="updateAntennaAngle(this.value)" class="flex-1 sm:w-44 cursor-pointer accent-sky-600">
                                <span class="text-xs font-mono font-black text-sky-700 w-12 text-right bg-sky-50 px-2 py-0.5 rounded border border-sky-200" id="angle-val">15°</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <button onclick="autoTuneAntenna()" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 shadow-sm">
                                    <i class="fa-solid fa-satellite-dish mr-1 text-sky-600"></i> Otomatik 42°
                                </button>
                                <button onclick="lockAntennaSignal()" class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 text-white font-mono text-xs font-bold shadow-sm active:scale-95">
                                    KİLİTLE & GEÇ (1994)
                                </button>
                            </div>
                        </div>
                    \`;
                    break;

                case 4:
                    statusBadge.textContent = "ODA 4: UZAY KİRLİLİĞİ: ÇARPIŞMAYI ÖNLE";
                    titleEl.textContent = "Görev 4: Güvenli Kaçınma Manevrasını Seç (Hız: 7.8 km/s)";
                    alertText.textContent = "Kessler Sendromu Uyarısı! Enkazı patlatma, yörüngeyi yükseltip kaçın.";
                    container.innerHTML = \`
                        <div class="w-full flex flex-col sm:flex-row items-center justify-between gap-2.5 py-1">
                            <div class="flex items-center gap-2 text-xs font-mono">
                                <span class="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-bold">
                                    ⚠️ Enkaz Hızı: 7.8 km/s
                                </span>
                                <button onclick="chooseDebrisAction('blast')" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-700 text-xs font-bold border border-slate-300">
                                    Enkazı Patlat (Yanlış)
                                </button>
                                <button onclick="chooseDebrisAction('dodge')" id="btn-dodge" class="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                                    🛡️ Kaçınma Manevrası (Doğru)
                                </button>
                            </div>
                            <button onclick="openKeypadModalWithCode('7800')" class="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-mono text-xs font-bold shadow-sm active:scale-95">
                                7800 İLE KAPIYI AÇ
                            </button>
                        </div>
                    \`;
                    break;

                case 5:
                    statusBadge.textContent = "ODA 5: TELESKOP TASARIM LABORATUVARI";
                    titleEl.textContent = "Görev 5: Optik Odak Ayarını Yap ve Rasathane Konumunu Seç";
                    alertText.textContent = "Şehir Işıkları Görüşü Kapatıyor! Yüksek ve bulutsuz dağ tepesine odaklan.";
                    container.innerHTML = \`
                        <div class="w-full flex flex-col sm:flex-row items-center justify-between gap-2.5 py-1">
                            <div class="flex items-center gap-2 text-xs font-mono text-slate-700">
                                <span>Odak Netliği:</span>
                                <input type="range" id="focus-slider" min="1" max="100" value="30" oninput="updateTelescopeFocus(this.value)" class="w-32 cursor-pointer accent-sky-600">
                                <span id="focus-text" class="font-bold text-rose-600">Bulanık (%30)</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-xs font-mono text-slate-600 hidden md:inline">Galileo Yılı: <strong>1609</strong></span>
                                <button onclick="openKeypadModalWithCode('1609')" class="px-3.5 py-1.5 bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-xl font-mono text-xs font-bold shadow-sm active:scale-95">
                                    1609 İLE KAPIYI AÇ
                                </button>
                            </div>
                        </div>
                    \`;
                    break;

                case 6:
                    statusBadge.textContent = "ODA 6: YILDIZLARIN YAŞAM DÖNGÜSÜ";
                    titleEl.textContent = "Görev 6: Küçük/Orta Kütleli Yıldızın Yaşam Evrelerini Sırala";
                    alertText.textContent = "Güneş Benzeri Yıldız Döngüsü: Bulutsu → Kırmızı Dev → Beyaz Cüce";
                    container.innerHTML = \`
                        <div class="w-full flex flex-col sm:flex-row items-center justify-between gap-2 py-1">
                            <div class="flex flex-wrap items-center gap-1.5 text-xs font-mono" id="star-cycle-container">
                                <span class="px-2 py-1 bg-sky-50 border border-sky-300 rounded text-sky-800 font-bold">1. Bulutsu</span>
                                <span class="text-slate-400">→</span>
                                <span class="px-2 py-1 bg-amber-50 border border-amber-300 rounded text-amber-800 font-bold">2. Ana Kol</span>
                                <span class="text-slate-400">→</span>
                                <span class="px-2 py-1 bg-rose-50 border border-rose-300 rounded text-rose-800 font-bold">3. Kırmızı Dev</span>
                                <span class="text-slate-400">→</span>
                                <span class="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-slate-800 font-bold">4. Beyaz Cüce</span>
                            </div>
                            <button onclick="openKeypadModalWithCode('5800')" class="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-mono text-xs font-bold shadow-sm active:scale-95">
                                GÜNEŞ SICAKLIK KODU (5800)
                            </button>
                        </div>
                    \`;
                    break;

                case 7:
                    statusBadge.textContent = "ODA 7: GALAKSİ VE EVREN HARİTASI";
                    titleEl.textContent = "Görev 7: Kozmik Büyüklük Merdivenini Doğrula ve Işık Yılını Kanıtla";
                    alertText.textContent = "Işık Yılı Zaman Değil Mesafe Birimidir (~9.46 Trilyon Kilometre).";
                    container.innerHTML = \`
                        <div class="w-full flex flex-col sm:flex-row items-center justify-between gap-2 py-1">
                            <div class="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                                <span class="px-2 py-1 bg-indigo-50 border border-indigo-200 rounded text-indigo-900 font-bold">
                                    Güneş &lt; Samanyolu Galaksisi &lt; Evren
                                </span>
                                <span class="px-2 py-1 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 font-bold">
                                    1 Işık Yılı = 9.46 Trilyon km
                                </span>
                            </div>
                            <button onclick="openKeypadModalWithCode('9460')" class="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-mono text-xs font-bold shadow-sm active:scale-95">
                                MESAFE KODU (9460) İLE AÇ
                            </button>
                        </div>
                    \`;
                    break;

                case 8:
                    statusBadge.textContent = "ODA 8: DÜNYA'YA DÖNÜŞ: GÜVENLİ İNİŞ";
                    titleEl.textContent = "Görev 8: Isı Kalkanı ve Atmosfere Giriş Açısını Onayla!";
                    alertText.textContent = "TÜM SİSTEMLER HAZIR! Türkiye Yüzyılı Maarif Modeli Kodu: 2026";
                    container.innerHTML = \`
                        <div class="w-full flex flex-col sm:flex-row items-center justify-between gap-2.5 py-1">
                            <div class="flex items-center gap-2 text-xs font-mono">
                                <span class="px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-bold">
                                    🛡️ Isı Kalkanı: %100 Sağlam
                                </span>
                                <span class="px-2.5 py-1 bg-sky-50 border border-sky-200 rounded-lg text-sky-800 font-bold">
                                    🎯 Giriş Açısı: 6.2° (Güvenli)
                                </span>
                            </div>
                            <button onclick="launchReturnCapsule()" class="px-5 py-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-orbitron text-xs font-black uppercase tracking-wider shadow-md active:scale-95 transition-all">
                                <i class="fa-solid fa-earth-americas mr-1.5"></i> DÜNYA'YA DÖNÜŞÜ BAŞLAT (2026)
                            </button>
                        </div>
                    \`;
                    break;
            }
        }

        // -----------------------------------------------------------------
        // 6. ŞİFRE GİRİŞ, ODA TAMAMLAMA & ETKİLEŞİM HANDLERLARI
        // -----------------------------------------------------------------
        let currentEnteredKey = "";

        function openKeypadModal() {
            currentEnteredKey = "";
            document.getElementById('keypad-screen').textContent = "----";
            document.getElementById('keypad-error-msg').classList.add('hidden');
            document.getElementById('keypad-success-msg').classList.add('hidden');
            document.getElementById('modal-keypad').classList.remove('hidden');
            playSciFiSound('beep');
        }

        function openKeypadModalWithCode(code) {
            openKeypadModal();
            currentEnteredKey = code;
            document.getElementById('keypad-screen').textContent = code;
        }

        function closeKeypadModal() {
            document.getElementById('modal-keypad').classList.add('hidden');
        }

        function pressKeypad(num) {
            if (currentEnteredKey.length < 4) {
                currentEnteredKey += num;
                document.getElementById('keypad-screen').textContent = currentEnteredKey.padEnd(4, '-');
                playSciFiSound('beep');
            }
        }

        function clearKeypad() {
            currentEnteredKey = "";
            document.getElementById('keypad-screen').textContent = "----";
            playSciFiSound('beep');
        }

        function submitKeypad() {
            const correctCode = GAME_DATA.roomCodes[GAME_DATA.currentRoom];
            if (currentEnteredKey === correctCode) {
                document.getElementById('keypad-success-msg').classList.remove('hidden');
                document.getElementById('keypad-error-msg').classList.add('hidden');
                playSciFiSound('grant');
                confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });

                setTimeout(() => {
                    closeKeypadModal();
                    completeCurrentRoom();
                }, 850);
            } else {
                document.getElementById('keypad-error-msg').classList.remove('hidden');
                playSciFiSound('error');
                const screen = document.getElementById('keypad-screen');
                screen.classList.add('text-rose-500');
                setTimeout(() => {
                    screen.classList.remove('text-rose-500');
                }, 600);
            }
        }

        function completeCurrentRoom() {
            animateDoorOpen();
            GAME_DATA.score += 15;

            // Rozet kazan
            addBadgeForCurrentRoom();

            if (GAME_DATA.currentRoom < 8) {
                GAME_DATA.unlockedRooms = Math.max(GAME_DATA.unlockedRooms, GAME_DATA.currentRoom + 1);
                setTimeout(() => {
                    GAME_DATA.currentRoom++;
                    loadRoom3DEnvironment(GAME_DATA.currentRoom);
                    saveGameProgress();
                    speakRoomBriefing();
                }, 1300);
            } else {
                triggerVictory();
            }
        }

        function addBadgeForCurrentRoom() {
            const badges = [
                "İstasyon Mühendisi", "Uzay Teknolojileri Uzmanı", "Uydu Operatörü",
                "Uzay Kirliliği Dedektifi", "Teleskop Tasarımcısı", "Yıldız Astrofizikçisi",
                "Kozmik Galaksi Kâşifi", "Uzaydan Kaçış Kahramanı"
            ];
            const badge = badges[GAME_DATA.currentRoom - 1];
            if (badge && !GAME_DATA.badgesEarned.includes(badge)) {
                GAME_DATA.badgesEarned.push(badge);
            }
        }

        // Oda 1 Terminal Sırası
        let r1Step = 0;
        function activateR1Terminal(btn, step) {
            if (step === r1Step + 1) {
                r1Step = step;
                btn.classList.remove('bg-slate-50', 'text-slate-700');
                btn.classList.add('bg-emerald-600', 'text-white', 'border-emerald-700');
                playSciFiSound('grant');

                const nextBtn = document.getElementById(\`r1-t\${step + 1}\`);
                if (nextBtn) {
                    nextBtn.disabled = false;
                    nextBtn.classList.remove('opacity-50');
                }

                document.getElementById('r1-status').textContent = \`Adım: (\${r1Step}/3)\`;

                if (r1Step === 3) {
                    confetti({ particleCount: 30, spread: 50, origin: { y: 0.85 } });
                    document.getElementById('r1-status').textContent = "Harika! Şifre: 2045";
                }
            } else {
                playSciFiSound('error');
            }
        }

        // Oda 2 Araç Seçimi
        function selectTechVehicle(btn, type) {
            btn.classList.remove('bg-slate-50', 'text-slate-700');
            btn.classList.add('bg-sky-600', 'text-white', 'border-sky-700');
            playSciFiSound('grant');
            confetti({ particleCount: 20, spread: 45, origin: { y: 0.85 } });
        }

        // Oda 3 Anten Açısı
        function updateAntennaAngle(val) {
            document.getElementById('angle-val').textContent = \`\${val}°\`;
            if (window.satelliteDishMesh) {
                window.satelliteDishMesh.rotation.x = (val * Math.PI) / 180;
            }
        }

        function autoTuneAntenna() {
            const slider = document.getElementById('antenna-slider');
            if (slider) {
                slider.value = 42;
                updateAntennaAngle(42);
                playSciFiSound('grant');
            }
        }

        function lockAntennaSignal() {
            autoTuneAntenna();
            completeCurrentRoom();
        }

        // Oda 4 Uzay Kirliliği Seçimi
        function chooseDebrisAction(action) {
            if (action === 'dodge') {
                playSciFiSound('grant');
                confetti({ particleCount: 35, spread: 55, colors: ['#059669', '#0284c7'] });
                document.getElementById('btn-dodge').classList.add('ring-2', 'ring-emerald-400');
            } else {
                playSciFiSound('error');
                alert("Uyarı: Enkazı patlatmak binlerce küçük şarapnel parçası üreterek tehlikeyi artırır! Doğru çözüm kaçınma manevrasıdır.");
            }
        }

        // Oda 5 Teleskop Netliği
        function updateTelescopeFocus(val) {
            const text = document.getElementById('focus-text');
            if (text) {
                if (val >= 90) {
                    text.textContent = "Kusursuz Netlik (%100)";
                    text.className = "font-bold text-emerald-600";
                    playSciFiSound('grant');
                } else if (val >= 50) {
                    text.textContent = \`Odaklanıyor (%\${val})\`;
                    text.className = "font-bold text-amber-600";
                } else {
                    text.textContent = \`Bulanık (%\${val})\`;
                    text.className = "font-bold text-rose-600";
                }
            }
        }

        // Oda 8 Dönüşü Başlat
        function launchReturnCapsule() {
            playSciFiSound('victory');
            triggerVictory();
        }

        // -----------------------------------------------------------------
        // 7. ZAFER, SERTİFİKA & BİTİŞ EKRANI
        // -----------------------------------------------------------------
        function triggerVictory() {
            clearInterval(GAME_DATA.timerInterval);
            playSciFiSound('victory');
            confetti({ particleCount: 160, spread: 100, origin: { y: 0.5 } });

            const min = Math.floor(GAME_DATA.elapsedSeconds / 60);
            const sec = GAME_DATA.elapsedSeconds % 60;
            const timeStr = \`\${String(min).padStart(2, '0')}:\${String(sec).padStart(2, '0')}\`;

            document.getElementById('victory-final-time').textContent = timeStr;
            document.getElementById('victory-final-score').textContent = \`\${GAME_DATA.score} / 100\`;

            // Rozetleri doldur
            const badgesContainer = document.getElementById('victory-badges-grid');
            if (badgesContainer) {
                const badgeIcons = [
                    { name: "İstasyon Mühendisi", icon: "fa-bolt" },
                    { name: "Uzay Teknolojileri", icon: "fa-rocket" },
                    { name: "Uydu Operatörü", icon: "fa-satellite" },
                    { name: "Kirlilik Dedektifi", icon: "fa-shield-halved" },
                    { name: "Teleskop Tasarımı", icon: "fa-eye" },
                    { name: "Yıldız Bilimci", icon: "fa-sun" },
                    { name: "Galaksi Kâşifi", icon: "fa-compass" },
                    { name: "Uzay Kahramanı", icon: "fa-award" }
                ];
                badgesContainer.innerHTML = badgeIcons.map(b => \`
                    <div class="p-1.5 rounded-xl bg-amber-50 border border-amber-200 flex flex-col items-center text-center">
                        <i class="fa-solid \${b.icon} text-amber-600 text-sm"></i>
                        <span class="text-[9px] font-bold text-slate-700 mt-0.5 leading-tight">\${b.name}</span>
                    </div>
                \`).join('');
            }

            document.getElementById('modal-victory').classList.remove('hidden');
            speakText("Tebrikler Uzay Kâşifi! Bilimsel bilgin ve doğru kararların sayesinde görevimizi başarıyla tamamladık. Dünya'ya güvenli dönüş gerçekleştirildi!");
        }

        function downloadCertificate() {
            const studentName = document.getElementById('student-name-input').value.trim() || "Genç Uzay Kâşifi";
            
            const certCanvas = document.createElement('canvas');
            certCanvas.width = 1200;
            certCanvas.height = 800;
            const ctx = certCanvas.getContext('2d');

            // Arka Plan
            const grad = ctx.createLinearGradient(0, 0, 1200, 800);
            grad.addColorStop(0, '#030712');
            grad.addColorStop(0.5, '#0f172a');
            grad.addColorStop(1, '#1e1b4b');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 1200, 800);

            // Altın Çerçeve
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 10;
            ctx.strokeRect(30, 30, 1140, 740);

            ctx.strokeStyle = '#06b6d4';
            ctx.lineWidth = 2;
            ctx.strokeRect(45, 45, 1110, 710);

            // Başlıklar
            ctx.fillStyle = '#f59e0b';
            ctx.font = 'bold 34px Orbitron, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText("ROTALI FENCİ EĞİTİM PLATFORMU", 600, 110);

            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 22px Plus Jakarta Sans, sans-serif';
            ctx.fillText("7. SINIF FEN BİLİMLERİ – 1. ÜNİTE: UZAY ÇAĞI", 600, 155);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 42px Orbitron, sans-serif';
            ctx.fillText("ÜSTÜN BAŞARI UZAY SERTİFİKASI", 600, 225);

            ctx.fillStyle = '#94a3b8';
            ctx.font = '20px Plus Jakarta Sans, sans-serif';
            ctx.fillText("Bu belge, ORBITAL-7 Araştırma İstasyonu'ndaki 8 bilimsel kaçış görevini üstün başarıyla tamamlayan;", 600, 295);

            // Öğrenci Adı
            ctx.fillStyle = '#f59e0b';
            ctx.font = 'bold 48px Plus Jakarta Sans, sans-serif';
            ctx.fillText(studentName, 600, 375);

            ctx.fillStyle = '#e2e8f0';
            ctx.font = '20px Plus Jakarta Sans, sans-serif';
            ctx.fillText("adlı genç araştırmacıya Fen Bilimleri dersi üstün başarısı nedeniyle takdim edilmiştir.", 600, 435);

            // İstatistik
            ctx.fillStyle = '#06b6d4';
            ctx.font = 'bold 22px JetBrains Mono, monospace';
            ctx.fillText(\`Tamamlama Süresi: \${document.getElementById('victory-final-time').textContent}   |   Bilim Skoru: 100/100   |   8/8 Rozet\`, 600, 515);

            // Alt Bilgi
            ctx.fillStyle = '#64748b';
            ctx.font = '16px Plus Jakarta Sans, sans-serif';
            ctx.fillText("Türkiye Yüzyılı Maarif Modeli Uyumlu • @rotalifenci • 2045 ORBITAL-7", 600, 680);

            const link = document.createElement('a');
            link.download = \`Uzaydan_Kacis_Sertifika_\${studentName.replace(/\\s+/g, '_')}.png\`;
            link.href = certCanvas.toDataURL('image/png');
            link.click();
        }

        // -----------------------------------------------------------------
        // 8. NOVA ASİSTAN, İPUÇLARI, ÖĞRETMEN VE KAMERA MODLARI
        // -----------------------------------------------------------------
        function openNovaModal() {
            document.getElementById('nova-dialog-text').textContent = GAME_DATA.roomBriefings[GAME_DATA.currentRoom];
            document.getElementById('nova-progress-text').textContent = \`\${GAME_DATA.currentRoom} / 8 Görev\`;
            document.getElementById('nova-score-text').textContent = \`\${GAME_DATA.score} Puan\`;
            document.getElementById('modal-nova').classList.remove('hidden');
            playSciFiSound('beep');
        }

        function closeNovaModal() {
            document.getElementById('modal-nova').classList.add('hidden');
        }

        function openHintModal() {
            const hints = GAME_DATA.hints[GAME_DATA.currentRoom];
            document.getElementById('hint-text-1').textContent = hints[0];
            document.getElementById('hint-text-2').textContent = hints[1];
            document.getElementById('hint-text-3').textContent = hints[2];

            document.getElementById('hint-text-2').classList.add('hidden');
            document.getElementById('btn-unlock-hint-2').classList.remove('hidden');
            document.getElementById('hint-text-3').classList.add('hidden');
            document.getElementById('btn-unlock-hint-3').classList.remove('hidden');

            document.getElementById('modal-hint').classList.remove('hidden');
            playSciFiSound('beep');
        }

        function closeHintModal() {
            document.getElementById('modal-hint').classList.add('hidden');
        }

        function revealHintLevel(lvl) {
            document.getElementById(\`hint-text-\${lvl}\`).classList.remove('hidden');
            document.getElementById(\`btn-unlock-hint-\${lvl}\`).classList.add('hidden');
            playSciFiSound('beep');
        }

        function speakRoomBriefing() {
            const text = GAME_DATA.roomBriefings[GAME_DATA.currentRoom];
            speakText(text);
        }

        function jumpToRoomIfUnlocked(num) {
            if (num <= GAME_DATA.unlockedRooms) {
                GAME_DATA.currentRoom = num;
                loadRoom3DEnvironment(num);
                playSciFiSound('beep');
            } else {
                playSciFiSound('error');
            }
        }

        function teacherJumpToRoom(num) {
            GAME_DATA.unlockedRooms = Math.max(GAME_DATA.unlockedRooms, num);
            GAME_DATA.currentRoom = num;
            loadRoom3DEnvironment(num);
            closeTeacherModal();
            playSciFiSound('grant');
        }

        function unlockAllRoomsForClass() {
            GAME_DATA.unlockedRooms = 8;
            renderDynamicPuzzleUI(GAME_DATA.currentRoom);
            closeTeacherModal();
            playSciFiSound('grant');
        }

        function resetGameProgress() {
            localStorage.removeItem('rotali_uzay_kacis_progress');
            location.reload();
        }

        function openTeacherModal() {
            document.getElementById('modal-teacher').classList.remove('hidden');
            playSciFiSound('beep');
        }

        function closeTeacherModal() {
            document.getElementById('modal-teacher').classList.add('hidden');
        }

        function addTeamScore(team, val) {
            GAME_DATA.teamScores[team] = Math.max(0, GAME_DATA.teamScores[team] + val);
            document.getElementById(\`team-\${team.toLowerCase()}-score\`).textContent = GAME_DATA.teamScores[team];
            playSciFiSound('beep');
        }

        function resetTeamScores() {
            GAME_DATA.teamScores = { A: 0, B: 0 };
            document.getElementById('team-a-score').textContent = "0";
            document.getElementById('team-b-score').textContent = "0";
        }

        function setGameDifficulty(level) {
            GAME_DATA.difficulty = level;
            ['easy', 'normal', 'expert'].forEach(l => {
                const el = document.getElementById(\`diff-\${l}\`);
                if (el) {
                    if (l === level) {
                        el.className = "p-2 rounded-xl border-2 border-sky-500 bg-sky-50 text-sky-900 text-xs font-black transition-all";
                    } else {
                        el.className = "p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-sky-50 text-xs font-bold transition-all";
                    }
                }
            });
            playSciFiSound('beep');
        }

        function toggleZeroGMode() {
            GAME_DATA.zeroGMode = !GAME_DATA.zeroGMode;
            const btn = document.getElementById('btn-zerog');
            if (GAME_DATA.zeroGMode) {
                btn.className = "px-2 py-1 bg-indigo-600 text-white rounded-lg text-[11px] font-bold font-mono flex items-center gap-1 active:scale-95 cursor-pointer shadow-sm";
                speakText("Mikro yerçekimi serbest süzülme devrede.");
            } else {
                btn.className = "px-2 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-lg text-[11px] font-bold font-mono flex items-center gap-1 active:scale-95 cursor-pointer";
            }
            playSciFiSound('beep');
        }

        function resetCameraView() {
            camera.position.set(0, 1.6, 4.5);
            controls.target.set(0, 1.2, 0);
            controls.update();
            playSciFiSound('beep');
        }

        function inspectCurrentObject() {
            if (currentRoomGroup && currentRoomGroup.children.length > 0) {
                const targetObj = currentRoomGroup.children.find(c => c.userData && c.userData.title) || currentRoomGroup.children[0];
                if (targetObj && targetObj.userData && targetObj.userData.title) {
                    showHologramBanner(targetObj.userData.title, targetObj.userData.desc);
                    playSciFiSound('beep');
                }
            }
        }

        function showHologramBanner(title, desc) {
            const banner = document.getElementById('object-hologram-banner');
            document.getElementById('holo-title').textContent = title;
            document.getElementById('holo-desc').textContent = desc;
            banner.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-3');
            banner.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
        }

        function closeHologramBanner() {
            const banner = document.getElementById('object-hologram-banner');
            banner.classList.add('opacity-0', 'pointer-events-none', 'translate-y-3');
            banner.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
        }

        function onCanvasPointerDown(e) {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            if (!currentRoomGroup) return;

            const intersects = raycaster.intersectObjects(currentRoomGroup.children, true);
            if (intersects.length > 0) {
                let obj = intersects[0].object;
                while (obj.parent && obj.parent !== currentRoomGroup && !obj.userData.title) {
                    obj = obj.parent;
                }
                if (obj.userData && obj.userData.title) {
                    showHologramBanner(obj.userData.title, obj.userData.desc);
                    playSciFiSound('beep');
                }
            }
        }

        function onWindowResize() {
            const canvas = document.getElementById('station-canvas');
            const container = canvas.parentElement;
            if (!container) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        }

        function toggleFullScreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            } else {
                if (document.exitFullscreen) document.exitFullscreen();
            }
        }

        function exitSimulation() {
            if (window.parent && window.parent !== window && typeof window.parent.closeInteractiveGameModal === 'function') {
                window.parent.closeInteractiveGameModal();
            } else if (window.opener) {
                window.close();
            } else {
                window.location.href = '../index.html#grade/grade-7/egitsel-oyunlar';
            }
        }

        function startGameMission() {
            initAudio();
            document.getElementById('modal-intro').classList.add('hidden');
            startTimer();
            speakRoomBriefing();
            playSciFiSound('door');
        }

        function startTimer() {
            if (GAME_DATA.timerInterval) clearInterval(GAME_DATA.timerInterval);
            GAME_DATA.timerInterval = setInterval(() => {
                GAME_DATA.elapsedSeconds++;
                const min = Math.floor(GAME_DATA.elapsedSeconds / 60);
                const sec = GAME_DATA.elapsedSeconds % 60;
                document.getElementById('clock-text').textContent = \`\${String(min).padStart(2, '0')}:\${String(sec).padStart(2, '0')}\`;
            }, 1000);
        }

        function saveGameProgress() {
            try {
                localStorage.setItem('rotali_uzay_kacis_progress', JSON.stringify({
                    room: GAME_DATA.currentRoom,
                    unlocked: GAME_DATA.unlockedRooms,
                    score: GAME_DATA.score,
                    seconds: GAME_DATA.elapsedSeconds
                }));
            } catch(e) {}
        }

        function loadSavedGameProgress() {
            try {
                const saved = localStorage.getItem('rotali_uzay_kacis_progress');
                if (saved) {
                    const data = JSON.parse(saved);
                    if (data && data.room && data.unlocked) {
                        GAME_DATA.currentRoom = data.room;
                        GAME_DATA.unlockedRooms = data.unlocked;
                        GAME_DATA.score = data.score || 0;
                        GAME_DATA.elapsedSeconds = data.seconds || 0;
                    }
                }
            } catch(e) {}
        }

        function animate() {
            requestAnimationFrame(animate);
            controls.update();

            // Zero-G mikro salınım efekti
            if (GAME_DATA.zeroGMode) {
                camera.position.y += Math.sin(Date.now() * 0.0015) * 0.0015;
            }

            animatedObjects.forEach(item => {
                if (item.rotY) item.mesh.rotation.y += item.rotY;
                if (item.rotX) item.mesh.rotation.x += item.rotX;
                if (item.rotZ) item.mesh.rotation.z += item.rotZ;
            });

            renderer.render(scene, camera);
        }

        // Başlat
        window.addEventListener('DOMContentLoaded', () => {
            loadSavedGameProgress();
            initThreeJS();
        });
    </script>
</body>
</html>
`;
}

// Generate the file
const htmlContent = buildHTML();
fs.writeFileSync(targetFile, htmlContent, 'utf8');
console.log("Successfully generated:", targetFile, "Bytes:", htmlContent.length);
