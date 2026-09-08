/**
 * ROTALI FENCİ — Dijital Fen Bilimleri Eğitim Portalı & LMS Motoru
 * Mimari: SPA Router, 5-Adımlı Ünite Hub, Yazılı Merkezi, STEM, Akıllı Tahta & LMS
 */

const AppState = {
    currentRoute: "home",
    selectedGrade: "all",
    selectedUnitTab: "ogren", // 'ogren' | 'kesfet' | 'uygula' | 'coz' | 'analiz'
    activeQuiz: null,
    quizState: {
        currentIndex: 0,
        selectedAnswers: {},
        score: 0,
        timeRemaining: 0,
        timerInterval: null
    },
    bookmarkedPosts: JSON.parse(localStorage.getItem("rotali_bookmarks") || "[]"),
    isSmartboardMode: false
};

// PORTAL BAŞLATICI
document.addEventListener("DOMContentLoaded", () => {
    initPortal();
});

function initPortal() {
    window.addEventListener("hashchange", handleRouteChange);
    
    // Mobil Menü
    const mobileMenuBtn = document.getElementById("mobile-menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
        });
        document.querySelectorAll("#mobile-menu a").forEach(link => {
            link.addEventListener("click", () => mobileMenu.classList.add("hidden"));
        });
    }

    // ESC Tuşu ile Akıllı Tahta Modundan Çıkış
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && AppState.isSmartboardMode) {
            toggleSmartboardMode(false);
        }
    });

    handleRouteChange();
    updateStudentHeader();
}

// -------------------------------------------------------------
// AKILLI TAHTA / DERS MODU YÖNETİCİSİ
// -------------------------------------------------------------
function toggleSmartboardMode(forceState) {
    if (typeof forceState === "boolean") {
        AppState.isSmartboardMode = forceState;
    } else {
        AppState.isSmartboardMode = !AppState.isSmartboardMode;
    }

    if (AppState.isSmartboardMode) {
        document.body.classList.add("smartboard-mode");
        showToast("🖥️ Akıllı Tahta Modu Aktif (Çıkış için ESC veya sağ üstteki butona basın)", "info");
    } else {
        document.body.classList.remove("smartboard-mode");
        showToast("Akıllı Tahta Modundan çıkıldı.", "info");
    }
}

// -------------------------------------------------------------
// TOAST & BİLDİRİM BİLEŞENİ
// -------------------------------------------------------------
function showToast(message, type = "success") {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "fixed bottom-6 right-6 z-50 transform transition-all duration-300 pointer-events-none";
        document.body.appendChild(toast);
    }
    
    const bgColors = {
        success: "bg-emerald-600 text-white shadow-emerald-600/30",
        error: "bg-rose-600 text-white shadow-rose-600/30",
        info: "bg-slate-900 text-white shadow-slate-900/30"
    };

    toast.innerHTML = `
        <div class="px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 font-bold text-sm ${bgColors[type] || bgColors.info}">
            <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : (type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-info')}"></i>
            <span>${message}</span>
        </div>
    `;

    toast.classList.remove("translate-y-20", "opacity-0");
    toast.classList.add("translate-y-0", "opacity-100");

    setTimeout(() => {
        toast.classList.add("translate-y-20", "opacity-0");
        toast.classList.remove("translate-y-0", "opacity-100");
    }, 3200);
}

// -------------------------------------------------------------
// DİNAMİK PORTAL ROUTER
// -------------------------------------------------------------
function handleRouteChange() {
    const rawHash = window.location.hash.slice(1);
    const hash = rawHash || "home";
    const appEl = document.getElementById("app");
    if (!appEl) return;

    window.scrollTo({ top: 0, behavior: "smooth" });

    // Rota Eşleştirme
    if (hash === "home" || hash === "") {
        renderHomePage(appEl);
    } else if (hash === "grades") {
        renderGradesOverview(appEl);
    } else if (hash.startsWith("grade/")) {
        const gradeId = hash.replace("grade/", "");
        renderGradeDetail(appEl, gradeId);
    } else if (hash.startsWith("unit/")) {
        const parts = hash.replace("unit/", "").split("/");
        const unitId = parts[0];
        const tab = parts[1] || "ogren";
        renderUnitHub(appEl, unitId, tab);
    } else if (hash === "lgs-pusulasi") {
        renderLgsPusulasiPage(appEl);
    } else if (hash.startsWith("exams")) {
        renderExamsPage(appEl, hash);
    } else if (hash === "stem-lab") {
        renderStemLabPage(appEl);
    } else if (hash === "projects") {
        renderProjectsPage(appEl);
    } else if (hash === "teachers-room") {
        renderTeachersRoomPage(appEl);
    } else if (hash === "student-portal") {
        renderStudentPortalPage(appEl);
    } else if (hash === "teacher-dashboard") {
        renderTeacherDashboardPage(appEl);
    } else if (hash === "search") {
        renderSearchPage(appEl);
    } else if (hash.startsWith("quizzes")) {
        renderQuizzesPage(appEl, hash);
    } else if (hash === "flashcards") {
        renderFlashcardsPage(appEl);
    } else if (hash === "about") {
        renderAboutPage(appEl);
    } else if (hash === "contact") {
        renderContactPage(appEl);
    } else if (hash === "bookmarks") {
        renderBookmarksPage(appEl);
    } else if (hash.startsWith("admin")) {
        renderAdminPanel(appEl);
    } else {
        renderNotFound(appEl);
    }

    updateActiveNav(hash);
    updateStudentHeader();
}

function updateActiveNav(hash) {
    document.querySelectorAll(".nav-link").forEach(link => {
        const href = link.getAttribute("href") ? link.getAttribute("href").replace("#", "") : "";
        if (hash === href || (hash === "home" && href === "home") || (hash.startsWith("grade/") && href === "grades")) {
            link.classList.add("text-brand-red", "bg-red-50/80");
            link.classList.remove("text-slate-700");
        } else {
            link.classList.remove("text-brand-red", "bg-red-50/80");
            link.classList.add("text-slate-700");
        }
    });
}

function updateStudentHeader() {
    const profile = DataManager.getStudentProfile();
    const progressFill = document.getElementById("student-progress-fill");
    const progressText = document.getElementById("student-progress-text");

    const totalUnits = 28;
    const completed = profile.completedUnits ? profile.completedUnits.length : 0;
    const percent = Math.min(100, Math.round((completed / totalUnits) * 100));

    if (progressFill) progressFill.style.width = `${percent}%`;
    if (progressText) progressText.innerText = `%${percent} TAMAMLANDI`;
}

// -------------------------------------------------------------
// 1. 🏠 PORTAL KONTROL MERKEZİ (ANA SAYFA)
// -------------------------------------------------------------
function renderHomePage(container) {
    const profile = DataManager.getStudentProfile();

    container.innerHTML = `
        <!-- Hero Portal Giriş Alanı -->
        <section class="relative bg-gradient-to-b from-white via-slate-50 to-slate-100/70 border-b border-slate-200 py-12 lg:py-16 overflow-hidden">
            <div class="absolute inset-0 bg-[radial-gradient(#dc2626_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

            <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
                
                <!-- Üst Rozet & Başlık -->
                <div class="text-center max-w-4xl mx-auto mb-10">
                    <div class="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-red-50 via-white to-blue-50 border border-red-200 text-red-700 text-xs sm:text-sm font-black tracking-widest uppercase hero-glow-badge shadow-sm mb-5">
                        <i class="fa-solid fa-dharmachakra text-red-600 animate-spin" style="animation-duration: 15s;"></i>
                        <span>ROTALI FENCİ</span>
                        <span class="text-slate-300">•</span>
                        <span class="text-blue-900">DİJİTAL EĞİTİM PORTALI</span>
                    </div>

                    <!-- 3 Satırlı Sanatsal Başlık -->
                    <div class="hero-title-artistic mb-5 select-none flex flex-col items-center justify-center space-y-1">
                        <div class="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-red-600 uppercase drop-shadow-sm">
                            BİLİMİ KEŞFET
                        </div>
                        <div class="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-orange-500 uppercase drop-shadow-sm">
                            ROTANI ÇİZ
                        </div>
                        <div class="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#1e3a8a] uppercase drop-shadow-sm">
                            FEN İLE ZİRVEYE ULAŞ!
                        </div>
                    </div>

                    <p class="text-sm sm:text-base md:text-lg text-slate-600 font-semibold leading-relaxed max-w-2xl mx-auto">
                        5, 6, 7 ve 8. sınıf öğrencileri için interaktif ünite hub'ları, LGS yeni nesil soru çözümleri, ortak yazılı sınav merkezi ve öğretmen çalışma odası.
                    </p>
                </div>

                <!-- 🚀 1. HIZLI GEÇİŞ — ROTANI SEÇ (5, 6, 7, 8. SINIF + LGS KARTLARI) -->
                <div class="mb-14">
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <h3 class="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                                <span class="w-3.5 h-3.5 rounded-full bg-red-600"></span> 🚀 ROTANI SEÇ — SINIF DÜZEYLERİ
                            </h3>
                            <p class="text-xs sm:text-sm text-slate-500 font-medium mt-1">Müfredat ünitelerine, konu özetlerine ve interaktif deneylere doğrudan bağlanın.</p>
                        </div>
                        <a href="#grades" class="hidden sm:inline-flex items-center gap-1.5 text-xs font-black text-red-600 hover:text-red-700">
                            Tüm Rotalar <i class="fa-solid fa-arrow-right"></i>
                        </a>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        ${PORTAL_GRADES.map(g => `
                            <a href="#grade/${g.id}" class="group bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
                                <div class="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${g.color} opacity-10 rounded-bl-full group-hover:scale-125 transition-transform"></div>
                                
                                <div>
                                    <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr ${g.color} text-white flex items-center justify-center text-2xl font-black shadow-md mb-4 group-hover:rotate-6 transition-transform">
                                        ${g.number}
                                    </div>
                                    <span class="inline-block px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase mb-2 ${g.badgeBg}">
                                        ${g.isLGS ? 'LGS + FEN BİLİMLERİ' : 'FEN BİLİMLERİ ROTASI'}
                                    </span>
                                    <h4 class="text-lg font-black text-slate-900 group-hover:text-red-600 transition-colors mb-2">
                                        ${g.title}
                                    </h4>
                                    <p class="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed mb-4">
                                        ${g.description}
                                    </p>
                                </div>

                                <div class="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-black text-slate-700 group-hover:text-red-600">
                                    <span>${g.unitCount} Müfredat Ünitesi</span>
                                    <i class="fa-solid fa-arrow-right group-hover:translate-x-1.5 transition-transform"></i>
                                </div>
                            </a>
                        `).join("")}
                    </div>
                </div>

                <!-- ⚡ 2. HIZLI ERİŞİM HUB'LARI (YAZILI, STEM, PROJE, ÖĞRETMEN) -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
                    <a href="#exams" class="p-5 bg-gradient-to-br from-rose-50 to-red-50 border border-rose-200/80 rounded-2xl flex items-center gap-4 hover:shadow-md hover:scale-[1.02] transition-all">
                        <div class="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center text-xl flex-shrink-0 shadow-md shadow-red-600/20">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </div>
                        <div>
                            <h4 class="text-sm font-black text-slate-900">📝 Yazılı Merkezi</h4>
                            <p class="text-xs text-slate-500">MEB Açık Uçlu Ortak Sınavlar</p>
                        </div>
                    </a>

                    <a href="#stem-lab" class="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl flex items-center gap-4 hover:shadow-md hover:scale-[1.02] transition-all">
                        <div class="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl flex-shrink-0 shadow-md shadow-emerald-600/20">
                            <i class="fa-solid fa-flask-vial"></i>
                        </div>
                        <div>
                            <h4 class="text-sm font-black text-slate-900">🧪 STEM & Deney</h4>
                            <p class="text-xs text-slate-500">Görev Kartları & Simülatör</p>
                        </div>
                    </a>

                    <a href="#projects" class="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl flex items-center gap-4 hover:shadow-md hover:scale-[1.02] transition-all">
                        <div class="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xl flex-shrink-0 shadow-md shadow-amber-500/20">
                            <i class="fa-solid fa-trophy"></i>
                        </div>
                        <div>
                            <h4 class="text-sm font-black text-slate-900">🏆 Proje Merkezi</h4>
                            <p class="text-xs text-slate-500">TÜBİTAK 2204-B / TEKNOFEST</p>
                        </div>
                    </a>

                    <a href="#teachers-room" class="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl flex items-center gap-4 hover:shadow-md hover:scale-[1.02] transition-all">
                        <div class="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center text-xl flex-shrink-0 shadow-md shadow-blue-700/20">
                            <i class="fa-solid fa-chalkboard-user"></i>
                        </div>
                        <div>
                            <h4 class="text-sm font-black text-slate-900">👨‍🏫 Öğretmen Odası</h4>
                            <p class="text-xs text-slate-500">Yıllık Planlar & Rubrikler</p>
                        </div>
                    </a>
                </div>

                <!-- 🎯 3. GÜNÜN FEN GÖREVLERİ & KİŞİSEL ROTA VİTRİNİ -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    <!-- Sol: Günün Sorusu & Çözüm -->
                    <div class="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <div class="flex items-center justify-between mb-4">
                                <span class="px-3.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-black tracking-wider uppercase flex items-center gap-1.5">
                                    <i class="fa-solid fa-fire text-red-600"></i> GÜNÜN LGS FEN SORUSU
                                </span>
                                <span class="text-xs text-slate-400 font-bold">8. Sınıf • Basınç</span>
                            </div>
                            <h4 class="text-base sm:text-lg font-black text-slate-900 leading-snug mb-3">
                                Sıvı dolu bir kabın tabanına etki eden sıvı basıncı, sıvının derinliği ve yoğunluğu ile doğru orantılıdır.
                            </h4>
                            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                                Ağzına kadar su dolu özdeş iki kaptan birincisi deniz seviyesinde, ikincisi ise yüksek bir dağın zirvesinde bulunmaktadır. Kap tabanlarındaki sıvı basınçları hakkında hangisi söylenebilir?
                            </p>
                        </div>

                        <div class="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                            <div class="text-xs font-bold text-slate-500">
                                <i class="fa-solid fa-lightbulb text-amber-500 mr-1"></i> İpucu: Sıvı basıncı formülü P = h • d • g'dir.
                            </div>
                            <button onclick="showToast('Cevap: İki kapta da derinlik ve yoğunluk aynı olduğu için kap tabanlarındaki sıvı basınçları eşittir (Açık hava basıncı sıvı basıncını değil, toplam basıncı etkiler).', 'info')" class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shadow-sm">
                                Çözümü Gör
                            </button>
                        </div>
                    </div>

                    <!-- Sağ: Öğrenci İlerleme & Hata Defteri Önizlemesi -->
                    <div class="lg:col-span-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
                        <div>
                            <div class="flex items-center justify-between mb-4">
                                <span class="text-xs font-black text-amber-400 tracking-wider uppercase">BENİM PORTAL DURUMUM</span>
                                <span class="text-xs font-black px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                    ${profile.level}
                                </span>
                            </div>
                            <h4 class="text-xl font-black text-white mb-2">Merhaba, ${profile.name} 👋</h4>
                            <p class="text-xs text-slate-300 mb-6">Bugünkü öğrenme hedeflerini tamamla, bilim rozetlerini topla!</p>

                            <!-- Görevler -->
                            <div class="space-y-2.5 mb-6">
                                ${profile.dailyTasks.map(t => `
                                    <div class="p-2.5 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between text-xs">
                                        <span class="text-slate-200 font-medium">${t.text}</span>
                                        <i class="fa-solid ${t.done ? 'fa-circle-check text-emerald-400' : 'fa-circle text-slate-500'}"></i>
                                    </div>
                                `).join("")}
                            </div>
                        </div>

                        <div class="flex gap-2">
                            <a href="#student-portal" class="flex-1 py-2.5 text-center bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase rounded-xl transition-all shadow-md">
                                Portalıma Git
                            </a>
                            <a href="#student-portal" class="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all" title="Hata Defterim">
                                📕 ${profile.errorNotebook.length} Soru
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    `;
}

// -------------------------------------------------------------
// 2. 🎒 SINIF DÜZEYLERİ GENEL HUB & SINIF ÖZEL SAYFASI
// -------------------------------------------------------------
function renderGradesOverview(container) {
    container.innerHTML = `
        <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div class="mb-10 text-center max-w-3xl mx-auto">
                <span class="px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-black tracking-wider uppercase inline-block mb-3">
                    MÜFREDAT HUB'I
                </span>
                <h2 class="text-3xl font-black text-slate-900 tracking-tight mb-3">Sınıf Düzeyleri & Öğrenme Rotaları</h2>
                <p class="text-sm text-slate-600 font-medium">5, 6, 7 ve 8. sınıf Fen Bilimleri ünitelerine ait konu anlatımları, interaktif deneyler, çalışma föyleri ve sınav hazırlık modülleri.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                ${PORTAL_GRADES.map(g => `
                    <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <div class="flex items-center justify-between mb-4">
                                <span class="px-3 py-1 rounded-full text-xs font-black ${g.badgeBg}">
                                    ${g.isLGS ? 'LGS + 8. Sınıf' : `${g.number}. Sınıf`}
                                </span>
                                <span class="text-xs font-bold text-slate-400">${g.unitCount} Ünite Havuzu</span>
                            </div>
                            <h3 class="text-2xl font-black text-slate-900 mb-2">${g.title}</h3>
                            <p class="text-xs text-slate-600 font-medium mb-6">${g.description}</p>

                            <!-- Ünite Listesi -->
                            <div class="space-y-2 mb-6">
                                ${g.units.map(u => `
                                    <a href="#unit/${u.id}" class="p-3 bg-slate-50 hover:bg-red-50 hover:border-red-200 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs font-bold text-slate-800 transition-all group">
                                        <div class="flex items-center gap-2.5">
                                            <i class="${u.icon} text-red-600"></i>
                                            <span>${u.code} ${u.name}</span>
                                        </div>
                                        <span class="text-slate-400 group-hover:text-red-600">Hub'a Git <i class="fa-solid fa-arrow-right ml-1"></i></span>
                                    </a>
                                `).join("")}
                            </div>
                        </div>

                        <a href="#grade/${g.id}" class="w-full py-3 bg-slate-900 hover:bg-red-600 text-white font-black text-xs uppercase tracking-wider rounded-xl text-center transition-colors">
                            ${g.number}. Sınıf Merkezini Aç
                        </a>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}

function renderGradeDetail(container, gradeId) {
    const grade = PORTAL_GRADES.find(g => g.id === gradeId) || PORTAL_GRADES[0];

    container.innerHTML = `
        <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <!-- Başlık Alanı -->
            <div class="bg-gradient-to-r ${grade.color} text-white rounded-3xl p-8 sm:p-10 mb-10 shadow-xl relative overflow-hidden">
                <div class="relative z-10 max-w-3xl">
                    <span class="px-3.5 py-1 rounded-full bg-white/20 text-white text-xs font-black tracking-wider uppercase inline-block mb-3">
                        FEN BİLİMLERİ EĞİTİM MERKEZİ
                    </span>
                    <h2 class="text-3xl sm:text-4xl font-black mb-3">${grade.title}</h2>
                    <p class="text-sm text-white/90 leading-relaxed mb-6">${grade.description}</p>
                    
                    <div class="flex flex-wrap gap-3">
                        <a href="#exams" class="px-4 py-2.5 bg-white text-slate-900 font-black text-xs rounded-xl shadow-md hover:bg-slate-100 transition-all">
                            📝 ${grade.number}. Sınıf Yazılı Sınavları
                        </a>
                        <button onclick="toggleSmartboardMode(true)" class="px-4 py-2.5 bg-slate-900/80 hover:bg-slate-900 text-white font-black text-xs rounded-xl transition-all flex items-center gap-1.5">
                            <i class="fa-solid fa-display text-amber-400"></i> Akıllı Tahta Modu
                        </button>
                    </div>
                </div>
            </div>

            <!-- Ünite Kartları Grid -->
            <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <i class="fa-solid fa-layer-group text-red-600"></i> Müfredat Üniteleri (5 Adımlı Hub)
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${grade.units.map(u => `
                    <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                        <div>
                            <div class="flex items-center justify-between mb-3">
                                <span class="text-xs font-black px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">${u.code}</span>
                                <span class="text-xs font-bold text-slate-400">${u.hours} Ders Saati</span>
                            </div>
                            <h4 class="text-lg font-black text-slate-900 mb-2 flex items-center gap-2">
                                <i class="${u.icon} text-red-600"></i> ${u.name}
                            </h4>
                            <p class="text-xs text-slate-500 mb-6">${u.topics} Temel Alt Konu ve Öğrenme Çıktısı</p>

                            <!-- 5 Adım Rozetleri -->
                            <div class="grid grid-cols-5 gap-1.5 text-center text-[10px] font-black mb-6">
                                <span class="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg">1.Öğren</span>
                                <span class="p-1.5 bg-purple-50 text-purple-700 rounded-lg">2.Keşfet</span>
                                <span class="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">3.Uygula</span>
                                <span class="p-1.5 bg-rose-50 text-rose-700 rounded-lg">4.Çöz</span>
                                <span class="p-1.5 bg-amber-50 text-amber-700 rounded-lg">5.Analiz</span>
                            </div>
                        </div>

                        <a href="#unit/${u.id}" class="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase rounded-xl text-center transition-colors shadow-md shadow-red-600/20">
                            Ünite Hub'ını Aç
                        </a>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}

// -------------------------------------------------------------
// 3. 📚 ÜNİTE HUB (5-ADIM STANDARDI: ÖĞREN, KEŞFET, UYGULA, ÇÖZ, ANALİZ)
// -------------------------------------------------------------
function renderUnitHub(container, unitId, activeStep = "ogren") {
    const hub = UNIT_HUBS[unitId] || UNIT_HUBS["7-unit-2"];

    container.innerHTML = `
        <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
            
            <!-- Hub Üst Başlık & Akıllı Tahta Düğmesi -->
            <div class="flex flex-wrap items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm mb-8">
                <div class="flex items-center gap-4">
                    <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr ${hub.color} text-white flex items-center justify-center text-2xl shadow-md">
                        <i class="${hub.icon}"></i>
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-black px-2.5 py-0.5 rounded-md bg-red-50 text-red-700">${hub.unitCode}</span>
                            <span class="text-xs font-bold text-slate-500">${hub.grade}</span>
                        </div>
                        <h2 class="text-2xl font-black text-slate-900">${hub.title}</h2>
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <button onclick="toggleSmartboardMode(true)" class="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm">
                        <i class="fa-solid fa-display text-amber-400"></i> Akıllı Tahta Modu
                    </button>
                    <button onclick="window.print()" class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5">
                        <i class="fa-solid fa-print"></i> Yazdır / PDF
                    </button>
                </div>
            </div>

            <!-- 5-ADIM SEKME NAVİGASYONU -->
            <div class="flex border-b border-slate-200 bg-white rounded-t-2xl px-4 overflow-x-auto mb-6">
                <button onclick="window.location.hash='unit/${hub.id}/ogren'" class="hub-step-tab py-4 px-5 text-xs sm:text-sm font-black flex items-center gap-2 whitespace-nowrap ${activeStep === 'ogren' ? 'active' : 'text-slate-600'}">
                    <i class="fa-solid fa-book-open"></i> 1. ÖĞREN (Konu & Sketchnote)
                </button>
                <button onclick="window.location.hash='unit/${hub.id}/kesfet'" class="hub-step-tab py-4 px-5 text-xs sm:text-sm font-black flex items-center gap-2 whitespace-nowrap ${activeStep === 'kesfet' ? 'active' : 'text-slate-600'}">
                    <i class="fa-solid fa-gamepad"></i> 2. KEŞFET (İnteraktif Turnuva)
                </button>
                <button onclick="window.location.hash='unit/${hub.id}/uygula'" class="hub-step-tab py-4 px-5 text-xs sm:text-sm font-black flex items-center gap-2 whitespace-nowrap ${activeStep === 'uygula' ? 'active' : 'text-slate-600'}">
                    <i class="fa-solid fa-flask-vial"></i> 3. UYGULA (Çalışma Kağıdı & Deney)
                </button>
                <button onclick="window.location.hash='unit/${hub.id}/coz'" class="hub-step-tab py-4 px-5 text-xs sm:text-sm font-black flex items-center gap-2 whitespace-nowrap ${activeStep === 'coz' ? 'active' : 'text-slate-600'}">
                    <i class="fa-solid fa-circle-check"></i> 4. ÇÖZ (Beceri Temelli Test)
                </button>
                <button onclick="window.location.hash='unit/${hub.id}/analiz'" class="hub-step-tab py-4 px-5 text-xs sm:text-sm font-black flex items-center gap-2 whitespace-nowrap ${activeStep === 'analiz' ? 'active' : 'text-slate-600'}">
                    <i class="fa-solid fa-chart-pie"></i> 5. ANALİZ (Kazanım & Hata Defteri)
                </button>
            </div>

            <!-- ADIM İÇERİĞİ -->
            <div class="bg-white rounded-b-3xl p-6 sm:p-8 border border-slate-200 shadow-sm min-h-[400px]">
                ${renderUnitStepContent(hub, activeStep)}
            </div>

        </div>
    `;
}

function renderUnitStepContent(hub, step) {
    if (step === "ogren") {
        return `
            <div class="space-y-8">
                <div>
                    <h3 class="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                        <i class="fa-solid fa-book-open text-indigo-600"></i> Konu Anlatımı & Görsel Özet
                    </h3>
                    ${hub.ogren.summaryHtml}
                </div>

                <!-- Terimler Sözlüğü -->
                ${hub.ogren.glossary ? `
                    <div class="pt-6 border-t border-slate-200">
                        <h4 class="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                            <i class="fa-solid fa-spell-check text-amber-500"></i> Ünite Terimler Sözlüğü
                        </h4>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            ${hub.ogren.glossary.map(g => `
                                <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                    <span class="font-black text-xs text-red-600 block mb-1 uppercase">${g.term}</span>
                                    <p class="text-xs text-slate-600 leading-relaxed">${g.def}</p>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    } else if (step === "kesfet") {
        return `
            <div class="space-y-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-black text-slate-900 flex items-center gap-2">
                        <i class="fa-solid fa-gamepad text-purple-600"></i> ${hub.kesfet.title}
                    </h3>
                    <span class="text-xs font-bold text-slate-500">Eşleştirme Oyunu</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${hub.kesfet.pairs.map((p, idx) => `
                        <div class="p-4 bg-purple-50/60 border border-purple-200 rounded-2xl flex items-center justify-between gap-3">
                            <span class="font-black text-xs text-purple-900 uppercase">${p.organel}</span>
                            <span class="text-xs text-slate-600 font-bold bg-white px-3 py-1.5 rounded-xl border border-purple-100">${p.gorev}</span>
                        </div>
                    `).join("")}
                </div>

                <div class="p-6 bg-slate-900 text-white rounded-2xl text-center mt-6">
                    <h4 class="text-base font-black mb-2">🎮 İnteraktif Turnuvayı Başlat</h4>
                    <p class="text-xs text-slate-300 mb-4">Zamana karşı yarışarak organelleri ve kavramları doğru kutulara sürükleyin!</p>
                    <button onclick="showToast('İnteraktif turnuva modu başlatıldı! Tebrikler!', 'success')" class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase rounded-xl shadow-lg transition-all">
                        Turnuvaya Başla
                    </button>
                </div>
            </div>
        `;
    } else if (step === "uygula") {
        return `
            <div class="space-y-8">
                <!-- Çalışma Kağıtları -->
                <div>
                    <h3 class="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                        <i class="fa-solid fa-file-arrow-down text-emerald-600"></i> İndirilebilir Çalışma Kağıtları & Föyler
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${hub.uygula.worksheets.map(ws => `
                            <div class="p-5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between shadow-sm">
                                <div>
                                    <h5 class="font-black text-sm text-slate-900 mb-1">${ws.title}</h5>
                                    <span class="text-xs text-slate-500">${ws.pages} Sayfa • A4 Fotokopiye Uygun</span>
                                </div>
                                <button onclick="window.print()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5">
                                    <i class="fa-solid fa-download"></i> PDF İndir
                                </button>
                            </div>
                        `).join("")}
                    </div>
                </div>

                <!-- Deney Laboratuvarı -->
                ${hub.uygula.experiments ? `
                    <div class="pt-6 border-t border-slate-200">
                        <h4 class="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                            <i class="fa-solid fa-flask text-blue-600"></i> Ünite Laboratuvar Deney Protokolü
                        </h4>
                        ${hub.uygula.experiments.map(exp => `
                            <div class="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                                <h5 class="font-black text-base text-slate-900 mb-2">${exp.title}</h5>
                                <div class="text-xs text-slate-600 mb-2"><strong>Gerekli Malzemeler:</strong> ${exp.materials.join(", ")}</div>
                                <div class="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200 font-medium">⚠️ <strong>Güvenlik Uyarısı:</strong> ${exp.safetyNotes}</div>
                            </div>
                        `).join("")}
                    </div>
                ` : ''}
            </div>
        `;
    } else if (step === "coz") {
        return `
            <div class="space-y-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-black text-slate-900 flex items-center gap-2">
                        <i class="fa-solid fa-circle-check text-rose-600"></i> Beceri Temelli Test Havuzu
                    </h3>
                    <span class="text-xs font-bold text-slate-500">MEB / LGS Standartları</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${hub.coz.testTypes.map(t => `
                        <div class="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between">
                            <div>
                                <span class="px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 text-xs font-bold">${t.difficulty}</span>
                                <h4 class="text-base font-black text-slate-900 mt-2 mb-1">${t.name}</h4>
                                <p class="text-xs text-slate-500 mb-4">${t.count} • Süre: ${t.duration}</p>
                            </div>
                            <a href="#quizzes" class="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase rounded-xl text-center transition-all shadow-md">
                                Testi Başlat
                            </a>
                        </div>
                    `).join("")}
                </div>
            </div>
        `;
    } else if (step === "analiz") {
        return `
            <div class="space-y-6">
                <h3 class="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                    <i class="fa-solid fa-chart-pie text-amber-500"></i> Kazanım & Kavram Yanılgısı Analizi
                </h3>

                <!-- Sık Yapılan Hatalar -->
                <div class="p-5 bg-rose-50 border border-rose-200 rounded-2xl mb-6">
                    <h4 class="font-black text-rose-900 text-sm mb-3 flex items-center gap-2">
                        <i class="fa-solid fa-triangle-exclamation text-rose-600"></i> Bu Ünitede En Sık Yapılan 3 Hata:
                    </h4>
                    <ul class="text-xs text-rose-800 space-y-2 list-disc list-inside">
                        ${hub.analiz.commonMistakes.map(m => `<li>${m}</li>`).join("")}
                    </ul>
                </div>

                <!-- Kazanım Listesi -->
                <div class="space-y-3">
                    <h4 class="font-black text-slate-900 text-sm">Resmi MEB Kazanımları:</h4>
                    ${hub.analiz.learningOutcomes ? hub.analiz.learningOutcomes.map(o => `
                        <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                            <span class="font-bold text-slate-800"><span class="text-red-600 font-black mr-2">${o.code}</span> ${o.text}</span>
                            <i class="fa-solid fa-circle-check text-emerald-500 text-sm"></i>
                        </div>
                    `).join("") : ''}
                </div>
            </div>
        `;
    }
}

// -------------------------------------------------------------
// 4. 🔴 8. SINIF + LGS PUSULASI
// -------------------------------------------------------------
function renderLgsPusulasiPage(container) {
    container.innerHTML = `
        <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <!-- LGS Hero Banner -->
            <div class="bg-gradient-to-r from-red-700 via-rose-700 to-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-10 shadow-2xl relative overflow-hidden">
                <div class="relative z-10 max-w-3xl">
                    <span class="px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-black tracking-wider uppercase inline-block mb-4">
                        🎯 HEDEF 20/20 LGS FEN
                    </span>
                    <h2 class="text-3xl sm:text-5xl font-black mb-4">8. Sınıf + LGS Pusulası</h2>
                    <p class="text-sm sm:text-base text-slate-200 leading-relaxed mb-6">
                        MEB çıkmış sorular, örnek soru analizleri, yeni nesil soru çözüm taktikleri ve Türkiye geneli branş denemeleri tek bir pusulada.
                    </p>
                    <div class="flex flex-wrap gap-3">
                        <a href="#grade/grade-8" class="px-5 py-3 bg-white text-red-700 font-black text-xs uppercase rounded-xl shadow-lg hover:bg-slate-100 transition-all">
                            8. Sınıf Üniteleri
                        </a>
                        <a href="#exams" class="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase rounded-xl transition-all">
                            LGS Deneme Sınavları
                        </a>
                    </div>
                </div>
            </div>

            <!-- 4 Altın LGS Soru Çözüm Stratejisi -->
            <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <i class="fa-solid fa-compass text-red-600"></i> LGS Fen Başarı Rehberi: 4 Altın Kural
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
                ${LGS_PUSULA_DATA.strategyCards.map(s => `
                    <div class="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition-all">
                        <div class="text-3xl font-black text-red-600 mb-2">${s.number}</div>
                        <h4 class="font-black text-base text-slate-900 mb-2">${s.title}</h4>
                        <p class="text-xs text-slate-600 leading-relaxed font-medium">${s.text}</p>
                    </div>
                `).join("")}
            </div>

            <!-- MEB Çıkmış Soru Analizleri -->
            <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <i class="fa-solid fa-graduation-cap text-indigo-600"></i> MEB Çıkmış Soru Çözüm Modelleri
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${LGS_PUSULA_DATA.mebQuestions.map(q => `
                    <div class="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
                        <div class="flex items-center justify-between mb-3">
                            <span class="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-black text-xs">${q.year}</span>
                            <span class="text-xs font-bold text-slate-400">${q.unit}</span>
                        </div>
                        <p class="text-xs font-bold text-slate-800 mb-4 leading-relaxed">${q.questionText}</p>
                        <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                            <span class="font-black text-emerald-700 block mb-1">Doğru Cevap: ${q.answer}</span>
                            <p class="text-slate-600 leading-relaxed">${q.solution}</p>
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}

// -------------------------------------------------------------
// 5. ✏️ YAZILI MERKEZİ (5, 6, 7, 8. SINIF ORTAK SINAV HAZIRLIĞI)
// -------------------------------------------------------------
function renderExamsPage(container) {
    container.innerHTML = `
        <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div class="mb-10 text-center max-w-3xl mx-auto">
                <span class="px-4 py-1.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-black tracking-wider uppercase inline-block mb-3">
                    MEB ORTAK SINAV STANDARTLARI
                </span>
                <h2 class="text-3xl font-black text-slate-900 tracking-tight mb-3">Yazılı Merkezi (5-8. Sınıf)</h2>
                <p class="text-sm text-slate-600 font-medium">Bakanlık ortak sınav senaryoları, açık uçlu sorular, örnek sınav kağıtları ve puanlama rubrikleri.</p>
            </div>

            <!-- Sınıflar Grid -->
            <div class="space-y-8">
                ${EXAM_CENTER_DATA.grades.map(g => `
                    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                        <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                            <h3 class="text-xl font-black text-slate-900 flex items-center gap-2">
                                <span class="w-3 h-3 rounded-full bg-red-600"></span> ${g.gradeNumber}. Sınıf Yazılı Sınav Hazırlığı
                            </h3>
                            <span class="text-xs font-bold text-slate-500">1. ve 2. Dönem Senaryoları</span>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            ${g.terms.map(t => `
                                <div>
                                    <h4 class="font-black text-xs uppercase text-slate-400 mb-3">${t.term}. DÖNEM YAZILILARI</h4>
                                    <div class="space-y-3">
                                        ${t.exams.map(e => `
                                            <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between">
                                                <div>
                                                    <div class="flex items-center justify-between mb-1">
                                                        <span class="font-black text-sm text-slate-900">${e.name}</span>
                                                        <span class="text-[11px] font-bold text-slate-400">${e.questionCount} Soru</span>
                                                    </div>
                                                    <p class="text-xs text-red-600 font-bold mb-2">${e.scenario}</p>
                                                    <div class="text-[11px] text-slate-500 mb-4"><strong>Kapsam:</strong> ${e.topics.join(", ")}</div>
                                                </div>

                                                <div class="flex gap-2">
                                                    <button onclick="window.print()" class="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5">
                                                        <i class="fa-solid fa-file-pdf"></i> Sınavı İndir / Yazdır
                                                    </button>
                                                    <button onclick="showToast('${e.name} cevap anahtarı ve puanlama rubriği hazırlandı.', 'info')" class="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl" title="Cevap Anahtarı">
                                                        <i class="fa-solid fa-key"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        `).join("")}
                                    </div>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}

// -------------------------------------------------------------
// 6. 🧪 STEM & DENEY ATÖLYESİ
// -------------------------------------------------------------
function renderStemLabPage(container) {
    container.innerHTML = `
        <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div class="mb-10 text-center max-w-3xl mx-auto">
                <span class="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black tracking-wider uppercase inline-block mb-3">
                    UYGULAMALI ÖĞRENME MERKEZİ
                </span>
                <h2 class="text-3xl font-black text-slate-900 tracking-tight mb-3">STEM & Deney Atölyesi</h2>
                <p class="text-sm text-slate-600 font-medium">Mühendislik tasarım görevleri, okul laboratuvarı deney protokolleri ve Scratch/Arduino kodlama projeleri.</p>
            </div>

            <!-- STEM Görev Kartları -->
            <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <i class="fa-solid fa-rocket text-emerald-600"></i> Mühendislik STEM Görevleri
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                ${STEM_WORKSHOP_DATA.stemTasks.map(task => `
                    <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <div class="flex items-center justify-between mb-3">
                                <span class="text-xs font-black px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">${task.grade}</span>
                                <span class="text-xs font-bold text-slate-400">${task.topic}</span>
                            </div>
                            <h4 class="text-lg font-black text-slate-900 mb-2">${task.title}</h4>
                            <p class="text-xs text-slate-600 leading-relaxed mb-4"><strong>Problem:</strong> ${task.problem}</p>
                            
                            <div class="space-y-2 mb-6">
                                ${task.stages.map(st => `
                                    <div class="p-2.5 bg-slate-50 rounded-xl text-xs">
                                        <span class="font-black text-slate-800 block">${st.name}</span>
                                        <span class="text-slate-500">${st.text}</span>
                                    </div>
                                `).join("")}
                            </div>
                        </div>

                        <button onclick="window.print()" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase rounded-xl transition-all shadow-md">
                            Görev Föyünü İndir (A4)
                        </button>
                    </div>
                `).join("")}
            </div>

            <!-- Deney Laboratuvarı -->
            <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <i class="fa-solid fa-flask text-blue-600"></i> Okul Laboratuvarı Deneyleri
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                ${STEM_WORKSHOP_DATA.experiments.map(exp => `
                    <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                        <span class="text-xs font-bold text-blue-600">${exp.grade}</span>
                        <h4 class="text-base font-black text-slate-900 mt-1 mb-2">${exp.name}</h4>
                        <p class="text-xs text-slate-500 mb-3"><strong>Malzemeler:</strong> ${exp.materials.join(", ")}</p>
                        <div class="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 mb-4">
                            <strong>Bilimsel Sonuç:</strong> ${exp.scientificConclusion}
                        </div>
                        <button onclick="window.print()" class="w-full py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800">
                            Deney Föyünü Yazdır
                        </button>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}

// -------------------------------------------------------------
// 7. 🏆 PROJE MERKEZİ (TÜBİTAK, TEKNOFEST, eTwinning)
// -------------------------------------------------------------
function renderProjectsPage(container) {
    container.innerHTML = `
        <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div class="mb-10 text-center max-w-3xl mx-auto">
                <span class="px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-black tracking-wider uppercase inline-block mb-3">
                    BİLİMSEL ÜRETİM & YARIŞMALAR
                </span>
                <h2 class="text-3xl font-black text-slate-900 tracking-tight mb-3">Proje Geliştirme Merkezi</h2>
                <p class="text-sm text-slate-600 font-medium">TÜBİTAK 2204-B, TÜBİTAK 4006, TEKNOFEST ve eTwinning için proje şablonları, basamakları ve örnek fikirler.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                ${PROJECT_CENTER_DATA.categories.map(cat => `
                    <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <div class="flex items-center justify-between mb-4">
                                <span class="px-3 py-1 rounded-full bg-amber-50 text-amber-800 font-black text-xs">${cat.badge}</span>
                                <i class="${cat.icon} text-amber-500 text-xl"></i>
                            </div>
                            <h3 class="text-xl font-black text-slate-900 mb-4">${cat.name}</h3>

                            <!-- Basamaklar -->
                            <div class="space-y-2 mb-6">
                                ${cat.steps.map(s => `
                                    <div class="p-3 bg-slate-50 rounded-xl text-xs">
                                        <span class="font-black text-slate-800 block">${s.step}</span>
                                        <span class="text-slate-500">${s.detail}</span>
                                    </div>
                                `).join("")}
                            </div>

                            <!-- Fikirler -->
                            <div class="mb-6">
                                <h5 class="text-xs font-black text-slate-700 uppercase mb-2">💡 Örnek Proje Fikirleri:</h5>
                                <ul class="text-xs text-slate-600 space-y-1 list-disc list-inside">
                                    ${cat.ideas.map(i => `<li>${i}</li>`).join("")}
                                </ul>
                            </div>
                        </div>

                        <button onclick="window.print()" class="w-full py-3 bg-slate-900 hover:bg-amber-600 text-white font-black text-xs uppercase rounded-xl transition-colors">
                            Proje Rapor Şablonunu İndir (DOCX/PDF)
                        </button>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}

// -------------------------------------------------------------
// 8. 👨‍🏫 ÖĞRETMEN ODASI & EVRAK MERKEZİ
// -------------------------------------------------------------
function renderTeachersRoomPage(container) {
    container.innerHTML = `
        <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div class="mb-10 text-center max-w-3xl mx-auto">
                <span class="px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-black tracking-wider uppercase inline-block mb-3">
                    ÖĞRETMEN ÇALIŞMA ALANI
                </span>
                <h2 class="text-3xl font-black text-slate-900 tracking-tight mb-3">Öğretmen Odası & Evrak Merkezi</h2>
                <p class="text-sm text-slate-600 font-medium">Yıllık planlar, zümre tutanakları, 5E ders akışları, ölçme-değerlendirme rubrikleri ve akıllı tahta sunumları.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                ${TEACHERS_ROOM_DATA.categories.map(cat => `
                    <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                        <h3 class="text-base font-black text-slate-900 mb-4 pb-2 border-b border-slate-100">${cat.name}</h3>
                        <div class="space-y-3">
                            ${cat.items.map(item => `
                                <div class="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs">
                                    <div>
                                        <span class="font-bold text-slate-800 block">${item.title}</span>
                                        <span class="text-[11px] text-slate-400">${item.format} • ${item.updated || '2024'}</span>
                                    </div>
                                    <button onclick="window.print()" class="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm" title="İndir / Yazdır">
                                        <i class="fa-solid fa-download text-xs"></i>
                                    </button>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}

// -------------------------------------------------------------
// 9. 👤 ÖĞRENCİ PORTALI (BENİM ROTAM & HATA DEFTERİM)
// -------------------------------------------------------------
function renderStudentPortalPage(container) {
    const profile = DataManager.getStudentProfile();

    container.innerHTML = `
        <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <!-- Profil Kartı -->
            <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 mb-10 shadow-xl flex flex-wrap items-center justify-between gap-6">
                <div>
                    <span class="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase">ÖĞRENCİ PORTALIM</span>
                    <h2 class="text-3xl font-black mt-2 mb-1">${profile.name}</h2>
                    <p class="text-xs text-slate-300 font-semibold">${profile.grade} • ${profile.level} (${profile.xp} XP Puanı)</p>
                </div>
                <div class="flex gap-3">
                    <a href="#home" class="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all">
                        🏠 Kontrol Merkezi
                    </a>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <!-- Sol: Hata Defterim (Faz 2 Özelliği) -->
                <div class="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                    <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                        <div>
                            <h3 class="text-xl font-black text-slate-900 flex items-center gap-2">
                                <i class="fa-solid fa-book-bookmark text-red-600"></i> 📕 Hata Defterim
                            </h3>
                            <p class="text-xs text-slate-500 font-medium">Testlerde yanlış yapılan sorular otomatik kaydedilir.</p>
                        </div>
                        <span class="px-3 py-1 bg-red-50 text-red-700 font-black text-xs rounded-full">${profile.errorNotebook.length} Kayıtlı Soru</span>
                    </div>

                    <div class="space-y-4">
                        ${profile.errorNotebook.map(err => `
                            <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-xs font-black text-indigo-700">${err.unit}</span>
                                    <span class="text-[11px] text-slate-400">${err.date}</span>
                                </div>
                                <p class="text-xs font-bold text-slate-800 mb-2">${err.question}</p>
                                <div class="text-xs space-y-1">
                                    <div class="text-rose-600 font-semibold">❌ Senin Yanıtın: ${err.userWrongAnswer}</div>
                                    <div class="text-emerald-700 font-bold">✅ Doğru Yanıt: ${err.correctAnswer}</div>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>

                <!-- Sağ: Kazanılan Rozetler & İlerleme -->
                <div class="lg:col-span-5 space-y-6">
                    <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                        <h4 class="font-black text-base text-slate-900 mb-4 flex items-center gap-2">
                            <i class="fa-solid fa-medal text-amber-500"></i> Bilim Rozetlerim
                        </h4>
                        <div class="grid grid-cols-3 gap-3 text-center">
                            ${profile.badges.map(b => `
                                <div class="p-4 rounded-2xl border ${b.unlocked ? 'bg-amber-50/60 border-amber-200' : 'bg-slate-50 border-slate-200 opacity-40'}">
                                    <i class="${b.icon} text-2xl ${b.unlocked ? 'text-amber-600' : 'text-slate-400'} mb-2"></i>
                                    <span class="text-xs font-black text-slate-800 block">${b.title}</span>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// -------------------------------------------------------------
// 10. 👨‍🏫 ÖĞRETMEN ÇALIŞMA PANELİ (LMS DASHBOARD)
// -------------------------------------------------------------
function renderTeacherDashboardPage(container) {
    const teacher = DataManager.getTeacherProfile();

    container.innerHTML = `
        <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div class="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-3xl p-8 mb-10 shadow-xl flex items-center justify-between">
                <div>
                    <span class="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-black uppercase">ÖĞRETMEN ÇALIŞMA ALANI</span>
                    <h2 class="text-3xl font-black mt-2 mb-1">${teacher.name}</h2>
                    <p class="text-xs text-slate-300">${teacher.title} • 4 Aktif Şube (${teacher.classes.reduce((a,b)=>a+b.studentCount,0)} Öğrenci)</p>
                </div>
            </div>

            <!-- Sınıflar Grid -->
            <h3 class="text-2xl font-black text-slate-900 mb-6">👥 Sınıf Yönetimi & Başarı Karnesi</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                ${teacher.classes.map(c => `
                    <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <span class="text-xs font-black px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700">${c.name}</span>
                            <h4 class="text-2xl font-black text-slate-900 mt-3 mb-1">${c.avgScore}</h4>
                            <p class="text-xs text-slate-500 mb-4">${c.studentCount} Kayıtlı Öğrenci</p>
                        </div>
                        <button onclick="showToast('${c.name} sınıf analiz raporu yazdırılıyor.', 'info')" class="w-full py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-all">
                            Sınıfı Yönet
                        </button>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}

// -------------------------------------------------------------
// 11. 🔍 PORTAL GENEL ARAMA
// -------------------------------------------------------------
function renderSearchPage(container) {
    container.innerHTML = `
        <div class="max-w-[1000px] mx-auto px-4 py-12">
            <div class="text-center mb-8">
                <h2 class="text-3xl font-black text-slate-900 mb-2">🔍 Portal Genel Arama</h2>
                <p class="text-xs sm:text-sm text-slate-500">Sınıf, ünite, konu, deney veya yazılı sınav materyali arayın.</p>
            </div>

            <div class="bg-white p-3 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-3 mb-8">
                <i class="fa-solid fa-magnifying-glass text-slate-400 ml-3 text-lg"></i>
                <input type="text" id="portal-search-input" onkeyup="handlePortalSearch(this.value)" placeholder="Örn: 7. sınıf hücre, mevsimler, sıvı basıncı, açık uçlu sınav..." class="w-full py-3 px-2 text-sm text-slate-800 focus:outline-none placeholder-slate-400 font-bold">
            </div>

            <div id="search-results-box" class="space-y-4">
                <div class="p-8 text-center text-slate-400 text-xs font-semibold">
                    Aramak istediğiniz terimi yukarıya yazın.
                </div>
            </div>
        </div>
    `;
}

function handlePortalSearch(query) {
    const box = document.getElementById("search-results-box");
    if (!box) return;

    if (!query || query.trim().length < 2) {
        box.innerHTML = `<div class="p-8 text-center text-slate-400 text-xs font-semibold">En az 2 karakter giriniz.</div>`;
        return;
    }

    const q = query.toLowerCase();
    const results = [];

    PORTAL_GRADES.forEach(g => {
        g.units.forEach(u => {
            if (u.name.toLowerCase().includes(q) || g.title.toLowerCase().includes(q) || u.code.toLowerCase().includes(q)) {
                results.push({
                    type: "Ünite Hub'ı",
                    title: `${g.number}. Sınıf — ${u.name}`,
                    link: `#unit/${u.id}`,
                    icon: u.icon
                });
            }
        });
    });

    if (results.length === 0) {
        box.innerHTML = `<div class="p-8 text-center text-slate-500 text-xs font-bold">"${query}" ile eşleşen sonuç bulunamadı.</div>`;
        return;
    }

    box.innerHTML = results.map(r => `
        <a href="${r.link}" class="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between hover:border-red-300 hover:shadow-md transition-all">
            <div class="flex items-center gap-3">
                <i class="${r.icon} text-red-600 text-lg"></i>
                <div>
                    <span class="text-xs text-slate-400 font-bold block">${r.type}</span>
                    <span class="text-sm font-black text-slate-900">${r.title}</span>
                </div>
            </div>
            <i class="fa-solid fa-arrow-right text-slate-400"></i>
        </a>
    `).join("");
}

// -------------------------------------------------------------
// 12. DİĞER MODÜLLER (QUIZ, FLASHCARD, ADMIN, ABOUT)
// -------------------------------------------------------------
function renderQuizzesPage(container) {
    container.innerHTML = `
        <div class="max-w-[1440px] mx-auto px-4 py-10">
            <h2 class="text-3xl font-black text-slate-900 mb-6">🧠 Mini Testler & LGS Denemeleri</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${DEFAULT_QUIZZES.map(q => `
                    <div class="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
                        <span class="text-xs font-bold text-purple-600">${q.grade}</span>
                        <h4 class="text-lg font-black text-slate-900 mt-1 mb-3">${q.title}</h4>
                        <div class="space-y-4 mb-6">
                            ${q.questions.map((ques, idx) => `
                                <div class="p-4 bg-slate-50 rounded-2xl text-xs">
                                    <p class="font-bold text-slate-800 mb-2">${idx + 1}. ${ques.text}</p>
                                    <div class="space-y-1.5">
                                        ${ques.options.map(opt => `
                                            <div class="p-2 bg-white rounded-lg border border-slate-200 text-slate-700">${opt}</div>
                                        `).join("")}
                                    </div>
                                </div>
                            `).join("")}
                        </div>
                        <button onclick="showToast('Test tamamlandı! Başarı oranınız: %100', 'success')" class="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase rounded-xl">
                            Testi Bitir
                        </button>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}

function renderFlashcardsPage(container) {
    container.innerHTML = `
        <div class="max-w-[1000px] mx-auto px-4 py-10">
            <h2 class="text-3xl font-black text-slate-900 mb-6 text-center">🃏 3D Fen Bilgi Kartları</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${DEFAULT_FLASHCARDS.map(f => `
                    <div onclick="this.classList.toggle('flipped')" class="flashcard bg-white rounded-3xl p-6 border border-slate-200 shadow-sm cursor-pointer hover:border-amber-300 transition-all">
                        <span class="text-xs font-black text-amber-600 uppercase block mb-2">${f.unit}</span>
                        <h4 class="text-base font-black text-slate-900 mb-3">${f.question}</h4>
                        <p class="text-xs text-slate-600 bg-amber-50/70 p-3 rounded-xl border border-amber-100 font-medium">${f.answer}</p>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}

function renderAboutPage(container) {
    container.innerHTML = `
        <div class="max-w-[900px] mx-auto px-4 py-12">
            <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h2 class="text-3xl font-black text-slate-900 mb-4">🧭 Rotalı Fenci Hakkında</h2>
                <p class="text-sm text-slate-600 leading-relaxed mb-4">
                    <strong>Rotalı Fenci</strong>, ortaokul 5, 6, 7 ve 8. sınıf öğrencilerinin Fen Bilimleri derslerini öğrenmesini, pekiştirmesini ve değerlendirmesini; 8. sınıf öğrencilerinin LGS'ye hazırlanmasını; öğretmenlerin ise ders, materyal, ölçme-değerlendirme ve proje süreçlerini tek bir dijital ortamdan yönetmesini sağlayan etkileşimli bir Eğitim Portalıdır.
                </p>
                <div class="p-4 bg-red-50 text-red-800 rounded-2xl text-xs font-bold border border-red-100">
                    Öğrenci için öğrenme platformu, öğretmen için çalışma alanı, okul için dijital eğitim merkezi.
                </div>
            </div>
        </div>
    `;
}

function renderContactPage(container) {
    container.innerHTML = `
        <div class="max-w-[800px] mx-auto px-4 py-12">
            <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center">
                <h2 class="text-3xl font-black text-slate-900 mb-2">📬 İletişim</h2>
                <p class="text-xs text-slate-500 mb-6">Portal önerileri ve iş birlikleri için bize ulaşın.</p>
                <a href="https://www.instagram.com/rotalifenci/" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-black text-xs uppercase rounded-2xl shadow-lg">
                    <i class="fa-brands fa-instagram text-base"></i> @rotalifenci Instagram
                </a>
            </div>
        </div>
    `;
}

function renderBookmarksPage(container) {
    renderHomePage(container);
}

function renderAdminPanel(container) {
    container.innerHTML = `
        <div class="max-w-[1000px] mx-auto px-4 py-10">
            <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h2 class="text-2xl font-black text-slate-900 mb-4">⚙️ Portal Yönetim Paneli</h2>
                <p class="text-xs text-slate-500 mb-6">İçerikler, yazılı senaryoları ve sınavlar günceldir.</p>
                <div class="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold">
                    Sistem Durumu: Çevrim İçi (2024-2025 MEB Müfredat Sürümü)
                </div>
            </div>
        </div>
    `;
}

function renderNotFound(container) {
    container.innerHTML = `
        <div class="max-w-[600px] mx-auto px-4 py-20 text-center">
            <h2 class="text-6xl font-black text-red-600 mb-4">404</h2>
            <p class="text-base text-slate-700 font-bold mb-6">Aradığınız eğitim sayfası veya rota bulunamadı.</p>
            <a href="#home" class="px-6 py-3 bg-slate-900 text-white font-bold text-xs uppercase rounded-xl">
                Ana Sayfaya Dön
            </a>
        </div>
    `;
}
