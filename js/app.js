/**
 * ROTALI FENCİ — Dijital Fen Bilimleri Eğitim Portalı & LMS Motoru
 * Sayfa İçi Öğrenci & Öğretmen Panelleri, 5-Adımlı Ünite Hub, Yazılı Merkezi, STEM
 */

const AppState = {
    currentRoute: "home",
    selectedGrade: "all",
    selectedUnitTab: "ogren",
    activeQuiz: null,
    bookmarkedPosts: JSON.parse(localStorage.getItem("rotali_bookmarks") || "[]"),
    isSmartboardMode: false,
    currentUser: JSON.parse(localStorage.getItem("rotali_user") || JSON.stringify({
        role: "student", // 'student' | 'teacher' | 'guest'
        name: "Fen Kaşifi",
        grade: "8. Sınıf",
        xp: 450,
        level: "Seviye 3 - Bilim Yolcusu"
    }))
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
    updateUserInterface();
}

// -------------------------------------------------------------
// SAYFA İÇİ GİRİŞ / ROL YÖNETİMİ (ÖĞRENCİ & ÖĞRETMEN)
// -------------------------------------------------------------
function openAuthModal(defaultTab = "student") {
    let modal = document.getElementById("auth-modal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "auth-modal";
        modal.className = "fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300";
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button onclick="closeAuthModal()" class="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-black text-sm">
                <i class="fa-solid fa-xmark"></i>
            </button>

            <div class="text-center mb-6">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-700 text-white flex items-center justify-center text-2xl mx-auto mb-3 shadow-md">
                    <i class="fa-solid fa-door-open"></i>
                </div>
                <h3 class="text-xl font-black text-slate-900">Portal Giriş Alanı</h3>
                <p class="text-xs text-slate-500 mt-1">Öğrenci veya Öğretmen profilinizi seçin</p>
            </div>

            <!-- Sekmeler -->
            <div class="flex bg-slate-100 p-1 rounded-2xl mb-6">
                <button onclick="switchAuthTab('student')" id="tab-btn-student" class="flex-1 py-2.5 rounded-xl font-black text-xs transition-all ${defaultTab === 'student' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}">
                    🎒 Öğrenci Girişi
                </button>
                <button onclick="switchAuthTab('teacher')" id="tab-btn-teacher" class="flex-1 py-2.5 rounded-xl font-black text-xs transition-all ${defaultTab === 'teacher' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}">
                    👨‍🏫 Öğretmen Girişi
                </button>
            </div>

            <!-- Öğrenci Giriş Formu -->
            <div id="auth-form-student" class="${defaultTab === 'student' ? 'block' : 'hidden'} space-y-4">
                <div>
                    <label class="block text-xs font-black uppercase text-slate-700 mb-1">Adın ve Soyadın</label>
                    <input type="text" id="student-name-input" value="${AppState.currentUser.name || 'Fen Kaşifi'}" required placeholder="Örn: Ahmet Yılmaz" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-red-500">
                </div>
                <div>
                    <label class="block text-xs font-black uppercase text-slate-700 mb-1">Sınıf Düzeyin</label>
                    <select id="student-grade-select" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-red-500">
                        <option value="5. Sınıf">5. Sınıf</option>
                        <option value="6. Sınıf">6. Sınıf</option>
                        <option value="7. Sınıf">7. Sınıf</option>
                        <option value="8. Sınıf" selected>8. Sınıf (LGS)</option>
                    </select>
                </div>
                <button onclick="handleStudentLogin()" class="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all">
                    Öğrenci Olarak Başla 🚀
                </button>
            </div>

            <!-- Öğretmen / Yönetici Giriş Formu -->
            <div id="auth-form-teacher" class="${defaultTab === 'teacher' ? 'block' : 'hidden'} space-y-4">
                <div>
                    <label class="block text-xs font-black uppercase text-slate-700 mb-1">Öğretmen Kullanıcı Adı</label>
                    <input type="text" id="teacher-user-input" value="admin" required class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500">
                </div>
                <div>
                    <label class="block text-xs font-black uppercase text-slate-700 mb-1">Şifre</label>
                    <input type="password" id="teacher-pass-input" placeholder="••••••••" required class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500">
                </div>
                <button onclick="handleTeacherLogin()" class="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all">
                    Öğretmen Paneline Giriş Yap 👨‍🏫
                </button>
                <p class="text-[11px] text-center text-slate-400">Varsayılan: <strong>admin</strong> / <strong>fen2025</strong></p>
            </div>
        </div>
    `;
    modal.classList.remove("hidden");
}

function switchAuthTab(tab) {
    const studentForm = document.getElementById("auth-form-student");
    const teacherForm = document.getElementById("auth-form-teacher");
    const tabStudent = document.getElementById("tab-btn-student");
    const tabTeacher = document.getElementById("tab-btn-teacher");

    if (tab === "student") {
        studentForm.classList.remove("hidden");
        teacherForm.classList.add("hidden");
        tabStudent.className = "flex-1 py-2.5 rounded-xl font-black text-xs transition-all bg-white text-slate-900 shadow-sm";
        tabTeacher.className = "flex-1 py-2.5 rounded-xl font-black text-xs transition-all text-slate-500";
    } else {
        studentForm.classList.add("hidden");
        teacherForm.classList.remove("hidden");
        tabTeacher.className = "flex-1 py-2.5 rounded-xl font-black text-xs transition-all bg-white text-slate-900 shadow-sm";
        tabStudent.className = "flex-1 py-2.5 rounded-xl font-black text-xs transition-all text-slate-500";
    }
}

function closeAuthModal() {
    const modal = document.getElementById("auth-modal");
    if (modal) modal.classList.add("hidden");
}

function handleStudentLogin() {
    const name = document.getElementById("student-name-input").value.trim() || "Fen Kaşifi";
    const grade = document.getElementById("student-grade-select").value;

    AppState.currentUser = {
        role: "student",
        name: name,
        grade: grade,
        xp: 450,
        level: "Seviye 3 - Bilim Yolcusu"
    };

    localStorage.setItem("rotali_user", JSON.stringify(AppState.currentUser));
    closeAuthModal();
    updateUserInterface();
    showToast(`Hoş geldin, ${name}! Öğrenci profilin aktifleştirildi.`, "success");
    window.location.hash = "student-portal";
}

function handleTeacherLogin() {
    const user = document.getElementById("teacher-user-input").value.trim();
    const pass = document.getElementById("teacher-pass-input").value.trim();

    if ((user === "admin" || user === "rotalifenci") && (pass === "fen2025" || pass === "123456")) {
        AppState.currentUser = {
            role: "teacher",
            name: "Rotalı Fenci",
            title: "Fen Bilimleri Zümre Başkanı"
        };
        localStorage.setItem("rotali_user", JSON.stringify(AppState.currentUser));
        closeAuthModal();
        updateUserInterface();
        showToast("Öğretmen & Yönetici Girişi Başarılı! Hoş geldiniz.", "success");
        window.location.hash = "teacher-dashboard";
    } else {
        showToast("Hatalı kullanıcı adı veya şifre! (Varsayılan: admin / fen2025)", "error");
    }
}

function handleLogout() {
    AppState.currentUser = {
        role: "student",
        name: "Fen Kaşifi",
        grade: "8. Sınıf",
        xp: 100,
        level: "Seviye 1 - Başlangıç"
    };
    localStorage.removeItem("rotali_user");
    updateUserInterface();
    showToast("Profil oturumu kapatıldı.", "info");
    window.location.hash = "home";
}

function updateUserInterface() {
    const userBtn = document.getElementById("user-profile-btn");
    if (!userBtn) return;

    if (AppState.currentUser.role === "teacher") {
        userBtn.innerHTML = `
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>👨‍🏫 ÖĞRETMEN: ${AppState.currentUser.name}</span>
        `;
        userBtn.className = "px-3 py-2 bg-gradient-to-r from-blue-700 to-indigo-800 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap";
        userBtn.onclick = () => window.location.hash = "teacher-dashboard";
    } else {
        userBtn.innerHTML = `
            <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>🎒 ${AppState.currentUser.name} (${AppState.currentUser.grade})</span>
        `;
        userBtn.className = "px-3 py-2 bg-gradient-to-r from-brand-red to-rose-600 text-white font-black text-xs rounded-xl shadow-md shadow-brand-red/25 transition-all flex items-center gap-1.5 whitespace-nowrap";
        userBtn.onclick = () => window.location.hash = "student-portal";
    }

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
// TOAST BİLDİRİMİ
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
    } else if (hash === "teacher-dashboard" || hash.startsWith("admin")) {
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

                    <p class="text-sm sm:text-base md:text-lg text-slate-600 font-semibold leading-relaxed max-w-2xl mx-auto mb-6">
                        5, 6, 7 ve 8. sınıf öğrencileri için interaktif ünite hub'ları, LGS yeni nesil soru çözümleri, ortak yazılı sınav merkezi ve öğretmen çalışma odası.
                    </p>

                    <!-- Sayfa İçi Hızlı Giriş & Rol Butonları -->
                    <div class="flex flex-wrap justify-center gap-3">
                        <button onclick="openAuthModal('student')" class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase rounded-2xl shadow-lg shadow-red-600/25 transition-all flex items-center gap-2">
                            <i class="fa-solid fa-user-graduate"></i> Öğrenci Girişi & Rotam
                        </button>
                        <button onclick="openAuthModal('teacher')" class="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase rounded-2xl shadow-md transition-all flex items-center gap-2">
                            <i class="fa-solid fa-chalkboard-user text-amber-400"></i> Öğretmen / Yönetici Girişi
                        </button>
                    </div>
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
                                    ${AppState.currentUser.level || 'Seviye 3'}
                                </span>
                            </div>
                            <h4 class="text-xl font-black text-white mb-2">Merhaba, ${AppState.currentUser.name} 👋</h4>
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
                            <button onclick="openAuthModal('student')" class="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all" title="Profili Değiştir">
                                ⚙️ Profil
                            </button>
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
// 3. 📚 ÜNİTE HUB (5-ADIM STANDARDI)
// -------------------------------------------------------------

function getUnitHubData(unitId) {
    if (UNIT_HUBS[unitId]) {
        return UNIT_HUBS[unitId];
    }

    // Find in PORTAL_GRADES
    let foundGrade = null;
    let foundUnit = null;

    for (const g of PORTAL_GRADES) {
        const u = g.units.find(item => item.id === unitId);
        if (u) {
            foundGrade = g;
            foundUnit = u;
            break;
        }
    }

    if (!foundUnit) {
        return UNIT_HUBS["7-unit-2"];
    }

    // Generate full standard 5-step Hub dynamically for this unit
    return {
        id: foundUnit.id,
        grade: foundGrade.title.split(" ")[0] + ". Sınıf",
        gradeSlug: foundGrade.id,
        unitCode: foundUnit.code,
        title: foundUnit.name,
        icon: foundUnit.icon,
        color: foundGrade.color,
        description: `${foundGrade.title} müfredatına ait ${foundUnit.name} ünitesi konu özeti, kavram haritası, interaktif eşleştirme oyunu, çalışma föyleri, yeni nesil soru testi ve kazanım değerlendirme modülü.`,
        
        ogren: {
            summaryHtml: `
                <div class="space-y-6 text-slate-700">
                    <div class="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-brand-red p-4 rounded-r-xl">
                        <h4 class="font-bold text-slate-900 text-base mb-1">🎯 ${foundUnit.code} ${foundUnit.name} Kazanım Özeti:</h4>
                        <p class="text-sm text-slate-700">Bu ünitede ${foundUnit.name} konusunun temel kavramları, doğadaki işleyişi, deney ve gözlemlere dayalı bilimsel süreç becerileri incelenir.</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                            <h5 class="font-black text-slate-800 flex items-center gap-2 mb-2">
                                <i class="${foundUnit.icon} text-brand-red"></i> Temel Kavramlar & Prensipler
                            </h5>
                            <p class="text-xs text-slate-600 leading-relaxed mb-3">
                                Konu kapsamında yer alan temel tanımlar, MEB kazanım standartlarına uygun olarak adım adım ele alınmıştır.
                            </p>
                            <ul class="text-xs space-y-2 text-slate-600 list-disc list-inside">
                                <li><strong>Öğrenme Alanı:</strong> ${foundUnit.name} kuramsal temelleri</li>
                                <li><strong>Hedef Beceriler:</strong> Bilimsel gözlem, veri analizi ve hipotez kurma</li>
                                <li><strong>Müfredat Ağırlığı:</strong> ${foundUnit.hours} Ders Saati</li>
                            </ul>
                        </div>

                        <div class="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                            <h5 class="font-black text-slate-800 flex items-center gap-2 mb-2">
                                <i class="fa-solid fa-lightbulb text-amber-500"></i> Dikkat Edilecek Kritik Noktalar
                            </h5>
                            <p class="text-xs text-slate-600 leading-relaxed mb-3">
                                Yazılı sınavlarda ve denemelerde en sık karıştırılan kavramlar:
                            </p>
                            <ul class="text-xs space-y-2 text-slate-600 list-disc list-inside">
                                <li>Kavram yanılgılarına dikkat edilmeli ve tanımlar ezber yerine mantıkla kavranmalıdır.</li>
                                <li>Grafik ve tablo yorumlama sorularında eksenlerdeki değişkenler kontrol edilmelidir.</li>
                                <li>Deney sorularında bağımlı, bağımsız ve kontrol edilen değişkenler doğru ayırt edilmelidir.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `,
            glossary: [
                { term: "Bağımsız Değişken", def: "Deneyde araştırmacının bilerek ve isteyerek değiştirdiği değişkendir." },
                { term: "Bağımlı Değişken", def: "Bağımsız değişkene bağlı olarak değişen ve ölçülen sonuçtur." },
                { term: "Sabit Tutulan (Kontrol) Değişken", def: "Deneyin tüm aşamalarında aynı bırakılan ve etkisi sabitlenen faktördür." }
            ]
        },

        kesfet: {
            title: `${foundUnit.name} Kavram Eşleştirme & Etkinlik`,
            pairs: [
                { organel: "Gözlem", gorev: "Duyu organları veya araçlarla yapılan veri toplama" },
                { organel: "Hipotez", gorev: "Probleme getirilen geçici ve test edilebilir çözüm" },
                { organel: "Deney", gorev: "Hipotezin doğruluğunu test etmek için yapılan kontrollü inceleme" },
                { organel: "Sonuç & Rapor", gorev: "Elde edilen bulguların değerlendirilmesi" }
            ]
        },

        uygula: {
            worksheets: [
                { id: `ws-${foundUnit.id}-1`, title: `${foundUnit.code} ${foundUnit.name} Kavram & Etkinlik Föyü`, pages: 2, type: "PDF / A4", downloadCount: "1.250 İndirme" },
                { id: `ws-${foundUnit.id}-2`, title: `${foundUnit.name} Beceri Temelli Açık Uçlu Çalışma Kağıdı`, pages: 3, type: "Yazılı Hazırlık", downloadCount: "890 İndirme" }
            ],
            experiments: [
                {
                    title: `${foundUnit.name} Laboratuvar Gözlem & Deney Protokolü`,
                    safety: ["Güvenlik gözlüğü takınız.", "Öğretmen gözetiminde çalışınız."],
                    steps: [
                        "Deney malzemelerini hazırlayarak çalışma alanını düzenleyiniz.",
                        "Kontrollü deney değişkenlerini (bağımsız, bağımlı, kontrol) belirleyiniz.",
                        "Gözlem sonuçlarınızı deney raporu tablosuna kaydediniz."
                    ]
                }
            ]
        },

        coz: {
            questions: [
                {
                    q: `${foundUnit.name} konusu ile ilgili kontrollü bir deney tasarlayan bir öğrenci, sadece bir özelliği değiştirip diğer tüm faktörleri sabit tutmuştur. Bu deneyde değiştirilen değişken hangisidir?`,
                    options: [
                        "A) Bağımsız değişken",
                        "B) Bağımlı değişken",
                        "C) Kontrol edilen değişken",
                        "D) Sabit değişken"
                    ],
                    correct: 0,
                    explanation: "Deneyde araştırmacının kendi isteğiyle değiştirdiği faktör 'Bağımsız Değişken'dir."
                },
                {
                    q: "Bilimsel bir çalışmada hipotezin doğruluğunu test etmek için aşağıdakilerden hangisi yapılmalıdır?",
                    options: [
                        "A) Hipotezi doğrudan doğru kabul etmek",
                        "B) Kontrollü deneyler ve tekrarlı gözlemler yapmak",
                        "C) Yalnızca teorik tahminlerde bulunmak",
                        "D) Değişkenleri rastgele değiştirmek"
                    ],
                    correct: 1,
                    explanation: "Hipotezlerin geçerliliği kontrollü deneyler ve tekrarlanabilir gözlemlerle sınanır."
                }
            ]
        },

        analiz: {
            checklist: [
                { id: "c1", label: `${foundUnit.name} temel kavram ve tanımlarını tam olarak öğrendim.` },
                { id: "c2", label: "Konuya ait deneylerde bağımlı ve bağımsız değişkenleri ayırt edebiliyorum." },
                { id: "c3", label: "Yeni nesil grafikli ve tablolu soruları doğru analiz edebiliyorum." }
            ],
            recommendedVideos: [
                { title: `${foundUnit.name} 15 Dakikada Pratik Özet`, duration: "14:20" },
                { title: `${foundUnit.name} Yeni Nesil MEB Soru Çözümleri`, duration: "22:15" }
            ]
        }
    };
}

function renderUnitHub(container, unitId, activeStep = "ogren") {
    const hub = getUnitHubData(unitId);

    container.innerHTML = `
        <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
            
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

                <div class="p-5 bg-rose-50 border border-rose-200 rounded-2xl mb-6">
                    <h4 class="font-black text-rose-900 text-sm mb-3 flex items-center gap-2">
                        <i class="fa-solid fa-triangle-exclamation text-rose-600"></i> Bu Ünitede En Sık Yapılan 3 Hata:
                    </h4>
                    <ul class="text-xs text-rose-800 space-y-2 list-disc list-inside">
                        ${hub.analiz.commonMistakes.map(m => `<li>${m}</li>`).join("")}
                    </ul>
                </div>

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

                            <div class="space-y-2 mb-6">
                                ${cat.steps.map(s => `
                                    <div class="p-3 bg-slate-50 rounded-xl text-xs">
                                        <span class="font-black text-slate-800 block">${s.step}</span>
                                        <span class="text-slate-500">${s.detail}</span>
                                    </div>
                                `).join("")}
                            </div>

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
// 9. 👤 ÖĞRENCİ PORTALI (SAYFA İÇİ KİŞİSEL ÇALIŞMA ALANI)
// -------------------------------------------------------------
function renderStudentPortalPage(container) {
    const profile = DataManager.getStudentProfile();

    container.innerHTML = `
        <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <!-- Profil Üst Kartı -->
            <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 mb-10 shadow-xl flex flex-wrap items-center justify-between gap-6">
                <div>
                    <span class="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase">ÖĞRENCİ PORTALIM</span>
                    <h2 class="text-3xl font-black mt-2 mb-1">${AppState.currentUser.name || profile.name}</h2>
                    <p class="text-xs text-slate-300 font-semibold">${AppState.currentUser.grade || profile.grade} • ${AppState.currentUser.level || profile.level} (${AppState.currentUser.xp || profile.xp} XP Puanı)</p>
                </div>
                <div class="flex flex-wrap gap-2">
                    <button onclick="openAuthModal('student')" class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all">
                        ⚙️ Profilimi Değiştir
                    </button>
                    <button onclick="handleLogout()" class="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs rounded-xl transition-all">
                        Çıkış Yap
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <!-- Sol: Hata Defterim -->
                <div class="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                    <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                        <div>
                            <h3 class="text-xl font-black text-slate-900 flex items-center gap-2">
                                <i class="fa-solid fa-book-bookmark text-red-600"></i> 📕 Hata Defterim
                            </h3>
                            <p class="text-xs text-slate-500 font-medium">Testlerde yanlış yaptığınız sorular burada toplanır.</p>
                        </div>
                        <span class="px-3 py-1 bg-red-50 text-red-700 font-black text-xs rounded-full">${profile.errorNotebook.length} Kayıtlı Soru</span>
                    </div>

                    <div class="space-y-4 mb-6">
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

                    <!-- Hızlı Soru Ekleme Alanı -->
                    <div class="p-4 bg-red-50/70 border border-red-200 rounded-2xl">
                        <h4 class="text-xs font-black text-red-900 uppercase mb-2">➕ Hata Defterime Yeni Soru Ekle</h4>
                        <div class="space-y-2 text-xs">
                            <input type="text" id="custom-error-unit" placeholder="Ünite Adı (Örn: 8. Sınıf Basınç)" class="w-full p-2 bg-white border border-red-200 rounded-xl font-bold">
                            <input type="text" id="custom-error-q" placeholder="Hatalı Yaptığın Soru veya Kavram" class="w-full p-2 bg-white border border-red-200 rounded-xl font-medium">
                            <input type="text" id="custom-error-ans" placeholder="Doğru Cevap ve Çözüm Kuralı" class="w-full p-2 bg-white border border-red-200 rounded-xl font-medium">
                            <button onclick="handleAddCustomError()" class="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-black uppercase rounded-xl transition-all shadow-sm">
                                Hata Defterime Kaydet
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Sağ: Günlük Görevler & Kazanılan Rozetler -->
                <div class="lg:col-span-5 space-y-6">
                    <!-- Günlük Görevlerim -->
                    <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                        <h4 class="font-black text-base text-slate-900 mb-3 flex items-center gap-2">
                            <i class="fa-solid fa-list-check text-indigo-600"></i> Günlük Çalışma Rotam
                        </h4>
                        <div class="space-y-2.5">
                            ${profile.dailyTasks.map(t => `
                                <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800">
                                    <span>${t.text}</span>
                                    <i class="fa-solid ${t.done ? 'fa-circle-check text-emerald-500' : 'fa-circle text-slate-300'} text-base"></i>
                                </div>
                            `).join("")}
                        </div>
                    </div>

                    <!-- Rozetler -->
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

function handleAddCustomError() {
    const unit = document.getElementById("custom-error-unit").value.trim();
    const q = document.getElementById("custom-error-q").value.trim();
    const ans = document.getElementById("custom-error-ans").value.trim();

    if (!q || !ans) {
        showToast("Lütfen soru ve doğru cevap alanlarını doldurun.", "error");
        return;
    }

    DataManager.addToErrorNotebook({
        unit: unit || "Fen Bilimleri",
        question: q,
        userWrongAnswer: "Yanlış Çözüm",
        correctAnswer: ans,
        date: new Date().toISOString().split("T")[0]
    });

    showToast("Soru Hata Defterinize eklendi!", "success");
    renderStudentPortalPage(document.getElementById("app"));
}

// -------------------------------------------------------------
// 10. 👨‍🏫 ÖĞRETMEN / YÖNETİCİ ÇALIŞMA PANELİ (LMS & CMS)
// -------------------------------------------------------------
function renderTeacherDashboardPage(container) {
    const teacher = DataManager.getTeacherProfile();
    const posts = DataManager.getPosts();
    const quizzes = DataManager.getQuizzes();

    container.innerHTML = `
        <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <!-- Üst Bar -->
            <div class="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 mb-10 shadow-xl flex flex-wrap items-center justify-between gap-6">
                <div>
                    <span class="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-black uppercase">ÖĞRETMEN & YÖNETİCİ PANELİ</span>
                    <h2 class="text-3xl font-black mt-2 mb-1">${teacher.name}</h2>
                    <p class="text-xs text-slate-300 font-semibold">${teacher.title} • 4 Aktif Şube (${teacher.classes.reduce((a,b)=>a+b.studentCount,0)} Öğrenci)</p>
                </div>
                <div class="flex flex-wrap gap-2">
                    <button onclick="downloadBackupJSON()" class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5">
                        <i class="fa-solid fa-download"></i> Veri Yedeği İndir
                    </button>
                    <button onclick="handleLogout()" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all">
                        Çıkış Yap
                    </button>
                </div>
            </div>

            <!-- Sınıflar Grid -->
            <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <i class="fa-solid fa-users text-blue-700"></i> Şube Başarı Karnesi & Sınıf Yönetimi
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                ${teacher.classes.map(c => `
                    <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <span class="text-xs font-black px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700">${c.name}</span>
                            <h4 class="text-2xl font-black text-slate-900 mt-3 mb-1">${c.avgScore}</h4>
                            <p class="text-xs text-slate-500 mb-4">${c.studentCount} Kayıtlı Öğrenci</p>
                        </div>
                        <button onclick="showToast('${c.name} sınıf başarı raporu hazırlandı.', 'info')" class="w-full py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-all">
                            Sınıfı Yönet
                        </button>
                    </div>
                `).join("")}
            </div>

            <!-- İçerik Ekleme Formları (Sayfa İçi Yönetici Araçları) -->
            <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <i class="fa-solid fa-plus-circle text-red-600"></i> Sayfa İçi İçerik & Soru Ekleme Alanı
            </h3>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- 1. Form: Yeni Ders Notu Ekle -->
                <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                    <h4 class="text-base font-black text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                        <i class="fa-solid fa-file-lines text-red-600"></i> Yeni Ders Notu & Konu Özeti Ekle
                    </h4>
                    <form onsubmit="handleAddPost(event)" class="space-y-4 text-xs">
                        <div>
                            <label class="block font-black text-slate-700 mb-1">Ders Notu Başlığı</label>
                            <input type="text" id="new-post-title" required placeholder="Örn: 8. Sınıf Basit Makineler Taktik Özeti" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold">
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-black text-slate-700 mb-1">Sınıf Düzeyi</label>
                                <select id="new-post-grade" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold">
                                    <option value="5. Sınıf">5. Sınıf</option>
                                    <option value="6. Sınıf">6. Sınıf</option>
                                    <option value="7. Sınıf">7. Sınıf</option>
                                    <option value="8. Sınıf">8. Sınıf (LGS)</option>
                                </select>
                            </div>
                            <div>
                                <label class="block font-black text-slate-700 mb-1">Okuma Süresi</label>
                                <input type="text" id="new-post-time" placeholder="8 dk" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold">
                            </div>
                        </div>
                        <div>
                            <label class="block font-black text-slate-700 mb-1">Kısa Özet</label>
                            <textarea id="new-post-excerpt" rows="2" placeholder="Konunun ana hatlarını belirten özet..." class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"></textarea>
                        </div>
                        <div>
                            <label class="block font-black text-slate-700 mb-1">Konu Anlatımı (HTML/Metin)</label>
                            <textarea id="new-post-content" rows="3" placeholder="Detaylı konu anlatımı, formüller, ipuçları..." class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"></textarea>
                        </div>
                        <button type="submit" class="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black uppercase rounded-xl transition-all shadow-md">
                            Ders Notunu Portala Ekle
                        </button>
                    </form>
                </div>

                <!-- 2. Form: Yeni Test / LGS Sorusu Ekle -->
                <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                    <h4 class="text-base font-black text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                        <i class="fa-solid fa-circle-question text-purple-600"></i> Yeni Test / Soru Ekle
                    </h4>
                    <form onsubmit="handleAddQuestion(event)" class="space-y-3 text-xs">
                        <div>
                            <label class="block font-black text-slate-700 mb-1">Soru Metni</label>
                            <textarea id="new-q-text" rows="2" required placeholder="LGS veya Beceri temelli soru metni..." class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"></textarea>
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <input type="text" id="new-q-a" required placeholder="A Şıkkı" class="p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium">
                            <input type="text" id="new-q-b" required placeholder="B Şıkkı" class="p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium">
                            <input type="text" id="new-q-c" required placeholder="C Şıkkı" class="p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium">
                            <input type="text" id="new-q-d" required placeholder="D Şıkkı" class="p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium">
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-black text-slate-700 mb-1">Doğru Şık</label>
                                <select id="new-q-correct" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold">
                                    <option value="0">A Şıkkı</option>
                                    <option value="1">B Şıkkı</option>
                                    <option value="2">C Şıkkı</option>
                                    <option value="3">D Şıkkı</option>
                                </select>
                            </div>
                            <div>
                                <label class="block font-black text-slate-700 mb-1">Sınıf</label>
                                <select id="new-q-grade" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold">
                                    <option value="8. Sınıf">8. Sınıf (LGS)</option>
                                    <option value="7. Sınıf">7. Sınıf</option>
                                    <option value="6. Sınıf">6. Sınıf</option>
                                    <option value="5. Sınıf">5. Sınıf</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="block font-black text-slate-700 mb-1">Çözüm İpucu & Açıklama</label>
                            <input type="text" id="new-q-exp" placeholder="Bilimsel çözüm açıklaması..." class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium">
                        </div>
                        <button type="submit" class="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-black uppercase rounded-xl transition-all shadow-md">
                            Soruyu Test Havuzuna Kaydet
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
}

function handleAddPost(e) {
    e.preventDefault();
    const title = document.getElementById("new-post-title").value.trim();
    const grade = document.getElementById("new-post-grade").value;
    const readTime = document.getElementById("new-post-time").value.trim() || "8 dk";
    const excerpt = document.getElementById("new-post-excerpt").value.trim();

    const newPost = {
        id: "post-" + Date.now(),
        title: title,
        slug: title.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        category: grade,
        grade: grade,
        readTime: readTime,
        excerpt: excerpt || title,
        date: new Date().toISOString().split("T")[0],
        views: 1,
        likes: 0
    };

    DEFAULT_POSTS.unshift(newPost);
    showToast("Yeni ders notu portala eklendi!", "success");
    renderTeacherDashboardPage(document.getElementById("app"));
}

function handleAddQuestion(e) {
    e.preventDefault();
    const text = document.getElementById("new-q-text").value.trim();
    const a = document.getElementById("new-q-a").value.trim();
    const b = document.getElementById("new-q-b").value.trim();
    const c = document.getElementById("new-q-c").value.trim();
    const d = document.getElementById("new-q-d").value.trim();
    const correct = parseInt(document.getElementById("new-q-correct").value);
    const exp = document.getElementById("new-q-exp").value.trim();

    const newQuestion = {
        id: "q-" + Date.now(),
        text: text,
        options: ["A) " + a, "B) " + b, "C) " + c, "D) " + d],
        correct: correct,
        explanation: exp || "Doğru yanıt belirlendi."
    };

    if (DEFAULT_QUIZZES.length > 0) {
        DEFAULT_QUIZZES[0].questions.push(newQuestion);
    }
    showToast("Yeni soru test havuzuna kaydedildi!", "success");
    renderTeacherDashboardPage(document.getElementById("app"));
}

function downloadBackupJSON() {
    const backupData = {
        grades: PORTAL_GRADES,
        unitHubs: UNIT_HUBS,
        examCenter: EXAM_CENTER_DATA,
        stemWorkshop: STEM_WORKSHOP_DATA,
        projectCenter: PROJECT_CENTER_DATA,
        teachersRoom: TEACHERS_ROOM_DATA,
        lgsPusula: LGS_PUSULA_DATA,
        posts: DEFAULT_POSTS,
        quizzes: DEFAULT_QUIZZES,
        exportedAt: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "rotalifenci-portal-verileri.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast("Portal verileri JSON dosyası olarak indirildi!", "success");
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
// 12. DİĞER MODÜLLER (QUIZ, FLASHCARD, ABOUT, CONTACT)
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


// -------------------------------------------------------------
// 🧪 İNTERAKTİF SANAL LABORATUVAR SİMÜLATÖRÜ (SIVI BASINCI & YOĞUNLUK)
// -------------------------------------------------------------
function renderVirtualLabSection() {
    return `
        <div class="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl mb-12">
            <div class="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
                <div>
                    <span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black tracking-wider uppercase inline-block mb-1.5">
                        <i class="fa-solid fa-atom"></i> SANAL LABORATUVAR SİMÜLATÖRÜ
                    </span>
                    <h3 class="text-2xl font-black text-white">Sıvı Basıncı ve Yoğunluk Simülatörü (P = h • d • g)</h3>
                </div>
                <div class="text-xs font-bold text-slate-400">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block mr-1.5 animate-pulse"></span> Gerçek Zamanlı Fizik Motoru
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <!-- Sol: Kontrol Paneli -->
                <div class="lg:col-span-5 space-y-5 bg-white/5 p-6 rounded-2xl border border-white/10">
                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">1. Sıvı Türü ve Yoğunluğu (d):</span>
                            <span id="lab-density-val" class="text-amber-400 font-black">1.00 g/cm³ (Su)</span>
                        </div>
                        <select id="lab-liquid-select" onchange="updateLabSim()" class="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-red-500">
                            <option value="1.00|Su">💧 Saf Su (d = 1.00 g/cm³)</option>
                            <option value="0.90|Zeytinyağı">🫒 Zeytinyağı (d = 0.90 g/cm³)</option>
                            <option value="1.20|Tuzlu Su">🌊 Tuzlu Su (d = 1.20 g/cm³)</option>
                            <option value="1.26|Gliserin">🧪 Gliserin (d = 1.26 g/cm³)</option>
                            <option value="13.60|Cıva">⚪ Cıva (d = 13.60 g/cm³)</option>
                        </select>
                    </div>

                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">2. Sensör Derinliği (h):</span>
                            <span id="lab-depth-val" class="text-cyan-400 font-black">50 cm</span>
                        </div>
                        <input type="range" id="lab-depth-range" min="5" max="100" value="50" oninput="updateLabSim()" class="w-full accent-cyan-400 cursor-pointer">
                    </div>

                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">3. Ortam / Gezegen (Yerçekimi g):</span>
                            <span id="lab-gravity-val" class="text-emerald-400 font-black">9.81 m/s² (Dünya)</span>
                        </div>
                        <select id="lab-gravity-select" onchange="updateLabSim()" class="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-red-500">
                            <option value="9.81|Dünya">🌍 Dünya (g = 9.81 m/s²)</option>
                            <option value="1.62|Ay">🌕 Ay (g = 1.62 m/s²)</option>
                            <option value="3.72|Mars">🪐 Mars (g = 3.72 m/s²)</option>
                            <option value="24.79|Jüpiter">⚡ Jüpiter (g = 24.79 m/s²)</option>
                        </select>
                    </div>

                    <div class="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
                        <i class="fa-solid fa-lightbulb mr-1 text-amber-400"></i>
                        <strong>Fizik Kuralı:</strong> Sıvı basıncı kabın şekline veya sıvı miktarına bağlı DEĞİLDİR. Sadece <strong>derinlik (h)</strong>, <strong>sıvı yoğunluğu (d)</strong> ve <strong>yerçekimine (g)</strong> bağlıdır!
                    </div>
                </div>

                <!-- Sağ: Görsel Tank & Gösterge Simülasyonu -->
                <div class="lg:col-span-7 flex flex-col items-center">
                    <div class="w-full max-w-md bg-slate-800/80 rounded-2xl border-2 border-slate-700 p-6 flex flex-col items-center relative overflow-hidden shadow-inner">
                        
                        <!-- Manometre / Dijital Basınç Göstergesi -->
                        <div class="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-center mb-6 shadow-lg flex items-center justify-around">
                            <div>
                                <span class="text-[11px] font-black text-slate-400 tracking-wider uppercase block">HESAPLANAN BASINÇ</span>
                                <div id="lab-pressure-pascal" class="text-3xl font-black text-amber-400 tracking-tight">4.905 Pa</div>
                            </div>
                            <div class="border-l border-slate-700 pl-4 text-left">
                                <div class="text-[11px] font-bold text-slate-400">P = h • d • g</div>
                                <div id="lab-formula-breakdown" class="text-xs font-mono text-cyan-300">0.50m × 1000 × 9.81</div>
                            </div>
                        </div>

                        <!-- Sıvı Tankı -->
                        <div class="w-64 h-56 bg-slate-950/60 rounded-b-2xl border-x-4 border-b-4 border-slate-600 relative overflow-hidden flex flex-col justify-end shadow-2xl">
                            <!-- Sıvı -->
                            <div id="lab-liquid-body" class="w-full bg-cyan-600/60 transition-all duration-300 relative border-t-2 border-cyan-300" style="height: 80%;">
                                <!-- Sıvı İçi Sensör Probu -->
                                <div id="lab-sensor-probe" class="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-red-600 border-2 border-white text-white flex items-center justify-center text-xs shadow-lg transition-all duration-300" style="top: 50%;">
                                    <i class="fa-solid fa-crosshairs animate-pulse"></i>
                                </div>
                            </div>
                        </div>

                        <div class="text-xs text-slate-400 mt-4 text-center">
                            Sensör Probunu yukarı/aşağı kaydırarak derinlik değişimini gözlemleyin.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function updateLabSim() {
    const liquidEl = document.getElementById("lab-liquid-select");
    const depthEl = document.getElementById("lab-depth-range");
    const gravityEl = document.getElementById("lab-gravity-select");

    if (!liquidEl || !depthEl || !gravityEl) return;

    const [dVal, dName] = liquidEl.value.split("|");
    const [gVal, gName] = gravityEl.value.split("|");
    const depth = parseFloat(depthEl.value);
    const density = parseFloat(dVal);
    const gravity = parseFloat(gVal);

    // Labels
    document.getElementById("lab-density-val").innerText = `${density.toFixed(2)} g/cm³ (${dName})`;
    document.getElementById("lab-depth-val").innerText = `${depth} cm (${(depth/100).toFixed(2)} m)`;
    document.getElementById("lab-gravity-val").innerText = `${gravity.toFixed(2)} m/s² (${gName})`;

    // Pressure Calculation in Pascals: P = h(m) * d(kg/m^3) * g(m/s^2)
    // 1 g/cm^3 = 1000 kg/m^3
    const hMeter = depth / 100;
    const dKgM3 = density * 1000;
    const pressurePa = Math.round(hMeter * dKgM3 * gravity);

    document.getElementById("lab-pressure-pascal").innerText = `${pressurePa.toLocaleString('tr-TR')} Pa`;
    document.getElementById("lab-formula-breakdown").innerText = `${hMeter.toFixed(2)}m × ${dKgM3} × ${gravity.toFixed(2)}`;

    // Update Probe Position in Tank
    const probeEl = document.getElementById("lab-sensor-probe");
    if (probeEl) {
        probeEl.style.top = `${Math.min(90, Math.max(10, depth))}%`;
    }

    // Liquid Color by density
    const liquidBody = document.getElementById("lab-liquid-body");
    if (liquidBody) {
        if (dName === "Zeytinyağı") {
            liquidBody.className = "w-full bg-amber-500/60 transition-all duration-300 relative border-t-2 border-amber-300";
        } else if (dName === "Cıva") {
            liquidBody.className = "w-full bg-slate-400/80 transition-all duration-300 relative border-t-2 border-slate-200";
        } else if (dName === "Tuzlu Su") {
            liquidBody.className = "w-full bg-blue-700/60 transition-all duration-300 relative border-t-2 border-blue-400";
        } else if (dName === "Gliserin") {
            liquidBody.className = "w-full bg-purple-600/60 transition-all duration-300 relative border-t-2 border-purple-400";
        } else {
            liquidBody.className = "w-full bg-cyan-600/60 transition-all duration-300 relative border-t-2 border-cyan-300";
        }
    }
}
