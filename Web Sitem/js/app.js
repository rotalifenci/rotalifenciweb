
function renderCustomMaterialsSection(gradeNumber = "all", subTab = "all") {
    let customList = [];
    try {
        customList = JSON.parse(localStorage.getItem("rotali_custom_materials") || "[]");
    } catch (e) {
        customList = [];
    }

    const isAdmin = localStorage.getItem("rotali_is_admin") === "true";
    const items = customList.filter(item => {
        // Sınıf Eşleştirmesi ("5", 5, "grade-5", "all")
        const normItemGrade = String(item.grade || "").replace(/^grade-/, "").trim().toLowerCase();
        const normTargetGrade = String(gradeNumber || "").replace(/^grade-/, "").trim().toLowerCase();
        const gradeMatch = (normTargetGrade === "all" || normItemGrade === "all" || normItemGrade === normTargetGrade);

        // Kategori / Sekme Eşleştirmesi
        const itemCat = String(item.category || "").trim().toLowerCase();
        const targetSubTab = String(subTab || "").trim().toLowerCase();

        let categoryMatch = false;
        if (targetSubTab === "all") {
            categoryMatch = true;
        } else if (targetSubTab === "egitsel-oyunlar" || targetSubTab === "oyunlar" || targetSubTab === "oyun") {
            categoryMatch = (itemCat === "egitsel-oyunlar" || itemCat === "oyunlar" || itemCat === "oyun" || itemCat.includes("oyun") || itemCat.includes("lab") || itemCat.includes("simula"));
        } else {
            categoryMatch = (itemCat === targetSubTab);
        }

        return gradeMatch && categoryMatch;
    });

    if (!items || items.length === 0) return "";

    return `
        <div class="mb-10 animate-in fade-in duration-300">
            <div class="flex items-center justify-between mb-4 pb-2 border-b border-emerald-500/20">
                <h4 class="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>✨ Bu Bölüme Eklenen Özel Materyaller (${items.length})</span>
                </h4>
                <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Rotalı Fenci Farkıyla</span>
                    ${isAdmin ? `
                        <button type="button" onclick="triggerUploadModal('${gradeNumber === 'all' ? '8' : gradeNumber}', '${subTab === 'all' ? 'ders-notu' : subTab}')" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 shadow-sm">
                            <i class="fa-solid fa-plus"></i> Yeni Ekle
                        </button>
                    ` : ''}
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${items.map(item => `
                    <div class="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-6 border-2 border-emerald-500/40 shadow-md hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden group">
                        <div class="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full pointer-events-none"></div>

                        <div>
                            <div class="flex items-center justify-between gap-2 mb-3">
                                <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black tracking-wider uppercase inline-block">
                                    ${item.grade === 'all' ? 'TÜM SINIFLAR' : item.grade + '. SINIF'} • ${item.format || 'DOKÜMAN'}
                                </span>
                                <span class="text-[10px] font-bold text-slate-400">${item.createdAt || 'Bugün'}</span>
                            </div>

                            <div class="text-[11px] font-black text-red-600 mb-1 uppercase tracking-wide truncate">${item.unit || ''}</div>
                            <h4 class="text-base font-black text-slate-900 mb-2 leading-snug group-hover:text-emerald-700 transition-colors">${item.title}</h4>
                            <p class="text-xs text-slate-600 leading-relaxed mb-4 font-medium">${(item.desc || '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>

                            ${item.tags && item.tags.length > 0 ? `
                                <div class="flex flex-wrap gap-1 mb-4">
                                    ${item.tags.map(t => `<span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">#${t}</span>`).join("")}
                                </div>
                            ` : ''}
                        </div>

                        <div class="pt-3 border-t border-slate-200/80 flex flex-col gap-2">
                            <button type="button" onclick="openOrDownloadMaterial('${item.id}', '${item.fileUrl || '#'}', '${(item.fileName || 'materyal.pdf').replace(/'/g, "\'")}')" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20">
                                <i class="fa-solid fa-gamepad"></i> <span>Aç / Başlat / İndir</span>
                            </button>

                            ${isAdmin ? `
                                <div class="flex items-center gap-2 mt-1">
                                    <button type="button" onclick="editCustomMaterial('${item.id}')" class="flex-1 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-xl border border-amber-200 transition-all flex items-center justify-center gap-1.5" title="Düzenle / Konum Değiştir">
                                        <i class="fa-solid fa-pen-to-square"></i> Düzenle
                                    </button>
                                    <button type="button" onclick="deleteCustomMaterial('${item.id}')" class="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition-all flex items-center justify-center gap-1.5" title="Sil">
                                        <i class="fa-solid fa-trash-can"></i> Sil
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}

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
                <p class="text-[11px] text-center text-slate-400">Yetkili Girişi</p>
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

    if ((user === "admin" || user === "rotalifenci") && (pass === "Rotali5822." || pass === "123456")) {
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
        showToast("Hatalı kullanıcı adı veya şifre!", "error");
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
    updateAdminNavUI();
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
        const gradeParam = hash.replace("grade/", "");
        renderGradeDetail(appEl, gradeParam);
    } else if (hash.startsWith("unit/")) {
        const parts = hash.replace("unit/", "").split("/");
        const unitId = parts[0];
        const tab = parts[1] || "ogren";
        renderUnitHub(appEl, unitId, tab);
    } else if (hash === "lgs-pusulasi") {
        renderGradeDetail(appEl, "grade-8");
    } else if (hash.startsWith("exams")) {
        renderExamsPage(appEl, hash);
    } else if (hash === "stem-lab") {
        renderStemLabPage(appEl);
    } else if (hash === "projects") {
        renderProjectsPage(appEl);
    } else if (hash === "teachers-room") {
        renderLgsPusulasiPage(appEl);
    } else if (hash === "student-portal") {
        renderHomePage(appEl);
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
        if (hash === href || (hash === "home" && href === "home") || (href.startsWith("grade/") && hash.startsWith(href))) {
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
function renderHomeRecentMaterialsSection() {
    let customList = [];
    try {
        customList = JSON.parse(localStorage.getItem("rotali_custom_materials") || "[]");
    } catch (e) {
        customList = [];
    }

    const isAdmin = localStorage.getItem("rotali_is_admin") === "true";

    // Örnek varsayılan son eklenen içerikler (Kullanıcı henüz eklemediyse veya azsa vitrin dolu görünür)
    const defaultRecent = [
        {
            id: "default-rec-1",
            grade: "5",
            category: "egitsel-oyunlar",
            format: "EĞİTSEL OYUN",
            unit: "1. Ünite: Laboratuvar ve Fen Dünyası",
            title: "5. Sınıf Laboratuvar Malzemeleri ve Güvenlik Kuralları İnteraktif Oyunu",
            desc: "Beherglas, erlenmayer, dereceli silindir ve deney tüplerini eğlenerek eşleştirin ve tanıyın.",
            createdAt: "Yeni Yayınlandı",
            fileUrl: "#interactive/crossword",
            tags: ["5. Sınıf", "Oyun", "Laboratuvar"]
        },
        {
            id: "default-rec-2",
            grade: "8",
            category: "ders-sunumu",
            format: "PPTX / SUNUM",
            unit: "3. Ünite: Basınç (Katı, Sıvı, Gaz)",
            title: "8. Sınıf LGS Basınç Ünitesi Akıllı Tahta Uyumlu Tam Kapsamlı Slayt Seti",
            desc: "Animasyonlu deney düzenekleri, formül çıkarımları ve MEB çıkmış soru çözümleri içeren sunum.",
            createdAt: "Yeni Yayınlandı",
            fileUrl: "#grade/grade-8/ders-sunumu",
            tags: ["8. Sınıf", "LGS 2026", "Sunum"]
        },
        {
            id: "default-rec-3",
            grade: "7",
            category: "ders-notu",
            format: "PDF NOT",
            unit: "2. Ünite: Hücre ve Bölünmeler",
            title: "7. Sınıf Hücre, Mitoz ve Mayoz Bölünme Karşılaştırma Tablolu Ders Notu",
            desc: "Görsel hafıza teknikleriyle hazırlanmış renkli konu özetleri ve sınavda çıkabilecek tuzak noktalar.",
            createdAt: "Yeni Yayınlandı",
            fileUrl: "#grade/grade-7/ders-notu",
            tags: ["7. Sınıf", "Ders Notu", "Mitoz-Mayoz"]
        },
        {
            id: "default-rec-4",
            grade: "6",
            category: "soru-bankasi",
            format: "TEST / SORU",
            unit: "1. Ünite: Güneş Sistemi ve Tutulmalar",
            title: "6. Sınıf Gezegenler ve Güneş-Ay Tutulmaları Yeni Nesil Beceri Temelli Test",
            desc: "Açık uçlu ve çoktan seçmeli yeni nesil MEB kazanım test föyü ve video çözümleri.",
            createdAt: "Yeni Yayınlandı",
            fileUrl: "#grade/grade-6/soru-bankasi",
            tags: ["6. Sınıf", "Soru Bankası", "MEB Uyumlu"]
        }
    ];

    // Özel yüklenenleri en başa al, yoksa varsayılanlarla birleştir
    let displayItems = [...customList];
    if (displayItems.length < 4) {
        for (let def of defaultRecent) {
            if (!displayItems.some(i => i.title === def.title)) {
                displayItems.push(def);
            }
            if (displayItems.length >= 6) break;
        }
    }

    return `
        <!-- 🔥 SON EKLENENLER & GÜNCEL MATERYAL VİTRİNİ -->
        <div class="mb-14 animate-in fade-in duration-300">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-200">
                <div>
                    <div class="flex items-center gap-2 mb-1">
                        <span class="px-3 py-1 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white text-[11px] font-black tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
                            <i class="fa-solid fa-fire text-amber-300"></i> SON EKLENENLER
                        </span>
                        <span class="text-xs font-bold text-slate-500">Rotalı Fenci Farkıyla Güncel Materyal Akışı</span>
                    </div>
                    <h3 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Yeni Yayınlanan Eğitim Materyalleri</h3>
                </div>

                <div class="flex items-center gap-2">
                    ${isAdmin ? `
                        <button type="button" onclick="triggerUploadModal()" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-1.5">
                            <i class="fa-solid fa-cloud-arrow-up"></i> <span>Yeni Materyal Ekle</span>
                        </button>
                    ` : ''}
                    <a href="#grades" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors">
                        Tüm Sınıflar →
                    </a>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${displayItems.slice(0, 6).map(item => `
                    <div class="bg-white rounded-3xl p-6 border-2 border-slate-200/90 hover:border-red-500/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
                        <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-500/10 via-amber-500/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform"></div>

                        <div>
                            <div class="flex items-center justify-between gap-2 mb-3">
                                <span class="px-3 py-1 rounded-full ${item.grade === '8' ? 'bg-red-100 text-red-800' : item.grade === '7' ? 'bg-amber-100 text-amber-800' : item.grade === '6' ? 'bg-blue-100 text-blue-800' : item.grade === '5' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'} text-[11px] font-black uppercase tracking-wider">
                                    ${item.grade === 'all' ? 'TÜM SINIFLAR' : item.grade + '. SINIF'} • ${item.format || 'DOKÜMAN'}
                                </span>
                                <span class="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                    <i class="fa-regular fa-clock"></i> ${item.createdAt || 'Yeni'}
                                </span>
                            </div>

                            <div class="text-[11px] font-black text-red-600 mb-1 uppercase tracking-wide truncate">${item.unit || ''}</div>
                            <h4 class="text-base font-black text-slate-900 mb-2 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">${item.title}</h4>
                            <p class="text-xs text-slate-600 leading-relaxed mb-4 font-medium line-clamp-2">${(item.desc || '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>

                            ${item.tags && item.tags.length > 0 ? `
                                <div class="flex flex-wrap gap-1 mb-4">
                                    ${item.tags.map(t => `<span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">#${t}</span>`).join("")}
                                </div>
                            ` : ''}
                        </div>

                        <div class="pt-3 border-t border-slate-100 flex flex-col gap-2">
                            <button type="button" onclick="openOrDownloadMaterial('${item.id}', '${item.fileUrl || '#'}', '${(item.fileName || 'materyal.pdf').replace(/'/g, "\\'")}')" class="w-full py-2.5 bg-slate-900 hover:bg-red-600 text-white font-black text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-2 shadow-md group-hover:shadow-red-600/20">
                                <i class="fa-solid ${item.category === 'egitsel-oyunlar' || item.format.includes('OYUN') ? 'fa-gamepad' : item.category === 'videolar' ? 'fa-play' : 'fa-download'}"></i>
                                <span>${item.category === 'egitsel-oyunlar' || item.format.includes('OYUN') ? 'Oyunu Başlat / Oyna' : item.category === 'videolar' ? 'Dersi İzle' : 'Materyali Aç / İndir'}</span>
                            </button>

                            ${isAdmin && !item.id.startsWith('default-rec-') ? `
                                <div class="flex items-center gap-2 mt-1">
                                    <button type="button" onclick="editCustomMaterial('${item.id}')" class="flex-1 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-[11px] font-bold rounded-lg border border-amber-200 transition-all flex items-center justify-center gap-1">
                                        <i class="fa-solid fa-pen-to-square"></i> Düzenle
                                    </button>
                                    <button type="button" onclick="deleteCustomMaterial('${item.id}')" class="flex-1 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold rounded-lg border border-rose-200 transition-all flex items-center justify-center gap-1">
                                        <i class="fa-solid fa-trash-can"></i> Sil
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}

function renderHomePage(container) {
    const profile = DataManager.getStudentProfile();

    container.innerHTML = `
        <!-- Hero Portal Giriş Alanı -->
        <section class="relative bg-gradient-to-b from-white via-slate-50 to-slate-100/70 border-b border-slate-200 py-12 lg:py-16 overflow-hidden">
            <div class="absolute inset-0 bg-[radial-gradient(#dc2626_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

            <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
                
                <!-- Üst Rozet & Başlık -->
                <div class="text-center max-w-4xl mx-auto mb-10">
                    <div class="flex flex-col items-center justify-center mb-5">
                        <img src="assets/logo.jpg" alt="Rotalı Fenci Logo" class="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover shadow-2xl border-4 border-white ring-4 ring-red-500/20 hover:scale-105 transition-all mb-4">
                        <div class="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-red-50 via-white to-blue-50 border border-red-200 text-red-700 text-xs sm:text-sm font-black tracking-widest uppercase hero-glow-badge shadow-sm">
                            <span>ROTALI FENCİ</span>
                            <span class="text-slate-300">•</span>
                            <span class="text-blue-900">DİJİTAL EĞİTİM PORTALI</span>
                        </div>
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
                        <strong>Rotalı Fenci;</strong> PDF ders notları, akıllı tahta sunumları, deney videoları, istasyon etkinlikleri, yeni nesil soru bankası, LGS denemeleri, 3D eğitsel oyunları ve <em>“Bilimin Rotasını Çizenler”</em> köşesiyle akıllı tahta, bilgisayar, tablet ve telefonlarda kesintisiz bir öğrenme deneyimi sunar.
                    </p>

                    <!-- Hızlı Keşif Butonları -->
                    <div class="flex flex-wrap justify-center gap-3">
                        <a href="#grades" class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase rounded-2xl shadow-lg shadow-red-600/25 transition-all flex items-center gap-2">
                            <i class="fa-solid fa-compass"></i> Sınıf Rotalarını Keşfet
                        </a>
                        <a href="#stem-lab" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase rounded-2xl shadow-md transition-all flex items-center gap-2">
                            <i class="fa-solid fa-flask text-amber-300"></i> Sanal Lab & Deneyler
                        </a>
                        <a href="#projects" class="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase rounded-2xl shadow-md transition-all flex items-center gap-2">
                            <i class="fa-solid fa-trophy text-amber-400"></i> Proje Merkezi (TÜBİTAK)
                        </a>
                    </div>
                </div>

                ${renderHomeRecentMaterialsSection()}

                <!-- 🚀 1. HIZLI GEÇİŞ — ROTANI SEÇ (5, 6, 7, 8. SINIF + LGS KARTLARI) -->
                <div class="mb-14">
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <h3 class="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                                <span class="w-4 h-4 rounded-full bg-red-600 shadow-md"></span> 🚀 ROTANI SEÇ — SINIF DÜZEYLERİ
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

                    <a href="#lgs-pusulasi" class="p-5 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200/80 rounded-2xl flex items-center gap-4 hover:shadow-md hover:scale-[1.02] transition-all">
                        <div class="w-12 h-12 rounded-xl bg-indigo-700 text-white flex items-center justify-center text-xl flex-shrink-0 shadow-md shadow-indigo-700/20">
                            <i class="fa-solid fa-compass"></i>
                        </div>
                        <div>
                            <h4 class="text-sm font-black text-slate-900">🧭 LGS Pusulası</h4>
                            <p class="text-xs text-slate-500">Soru Taktikleri & Strateji</p>
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
                            <a href="#student-portal" class="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all" title="Hata Defterimi Aç">📕 Hata Defterim</a>
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

// -------------------------------------------------------------
// 2. 🎒 SINIF DÜZEYLERİ GENEL HUB (7 ALT BÖLÜM VİTRİNİ)
// -------------------------------------------------------------
function renderGradesOverview(container) {
    container.innerHTML = `
        <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div class="mb-10 text-center max-w-3xl mx-auto">
                <span class="px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-black tracking-wider uppercase inline-block mb-3">
                    MÜFREDAT VE ÖĞRENME ALANLARI
                </span>
                <h2 class="text-3xl font-black text-slate-900 tracking-tight mb-3">Sınıf Düzeyleri & Alt Bölüm Merkezleri</h2>
                <p class="text-sm text-slate-600 font-medium">5, 6, 7 ve 8. sınıf Fen Bilimleri derslerine ait 7 ana alt bölüm: Ders Notları, Sunumlar, Videolar, Etkinlikler, Soru Bankası, Denemeler ve Eğitsel Oyunlar.</p>
            </div>

            ${renderCustomMaterialsSection("all", "projeler")}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                ${PORTAL_GRADES.map(g => `
                    <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all">
                        <div>
                            <div class="flex items-center justify-between mb-4">
                                <span class="px-3 py-1 rounded-full text-xs font-black ${g.badgeBg}">
                                    ${g.isLGS ? 'LGS + 8. Sınıf' : `${g.number}. Sınıf`}
                                </span>
                                <span class="text-xs font-bold text-slate-400">${g.unitCount} Ünite Havuzu</span>
                            </div>
                            <h3 class="text-2xl font-black text-slate-900 mb-2">${g.title}</h3>
                            <p class="text-xs text-slate-600 font-medium mb-6">${g.description}</p>

                            <!-- 7 ALT BÖLÜM HIZLI ERİŞİM BUTONLARI -->
                            <div class="mb-6">
                                <div class="text-[11px] font-black uppercase text-slate-400 tracking-wider mb-2.5">
                                    7 Alt Öğrenme Bölümü:
                                </div>
                                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-bold">
                                    <a href="#grade/${g.id}/ders-notu" class="p-2 bg-slate-50 hover:bg-red-50 hover:text-red-700 border border-slate-200/70 rounded-xl flex items-center gap-1.5 transition-colors">
                                        <span>📝</span> <span>Ders Notu</span>
                                    </a>
                                    <a href="#grade/${g.id}/ders-sunumu" class="p-2 bg-slate-50 hover:bg-orange-50 hover:text-orange-700 border border-slate-200/70 rounded-xl flex items-center gap-1.5 transition-colors">
                                        <span>📊</span> <span>Ders Sunumu</span>
                                    </a>
                                    <a href="#grade/${g.id}/videolar" class="p-2 bg-slate-50 hover:bg-red-50 hover:text-red-700 border border-slate-200/70 rounded-xl flex items-center gap-1.5 transition-colors">
                                        <span>🎥</span> <span>Videolar</span>
                                    </a>
                                    <a href="#grade/${g.id}/etkinlikler" class="p-2 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200/70 rounded-xl flex items-center gap-1.5 transition-colors">
                                        <span>🧩</span> <span>Etkinlikler</span>
                                    </a>
                                    <a href="#grade/${g.id}/soru-bankasi" class="p-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/70 rounded-xl flex items-center gap-1.5 transition-colors">
                                        <span>📚</span> <span>Soru Bankası</span>
                                    </a>
                                    <a href="#grade/${g.id}/denemeler" class="p-2 bg-slate-50 hover:bg-purple-50 hover:text-purple-700 border border-slate-200/70 rounded-xl flex items-center gap-1.5 transition-colors">
                                        <span>🎯</span> <span>Denemeler</span>
                                    </a>
                                    <a href="#grade/${g.id}/egitsel-oyunlar" class="p-2 bg-slate-50 hover:bg-amber-50 hover:text-amber-700 border border-slate-200/70 rounded-xl flex items-center gap-1.5 transition-colors col-span-2 sm:col-span-3 text-center justify-center">
                                        <span>🎮</span> <span>Eğitsel Oyunlar & Turnuva</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <a href="#grade/${g.id}" class="w-full py-3 bg-slate-900 hover:bg-red-600 text-white font-black text-xs uppercase tracking-wider rounded-xl text-center transition-colors shadow-md">
                            ${g.number}. Sınıf Tam Merkezini Aç →
                        </a>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}


// -------------------------------------------------------------
// 🎒 SINIF DETAY SAYFASI & 7 ALT BÖLÜM
// 1. Ders Notu, 2. Ders Sunumu, 3. Videolar, 4. Etkinlikler,
// 5. Soru Bankası, 6. Denemeler, 7. Eğitsel Oyunlar
// -------------------------------------------------------------
// -------------------------------------------------------------
// 🔭 BİLİMİN ROTASINI ÇİZENLER (HER SINIF İÇİN BİLİM İNSANLARI & BULUŞLARI)
// -------------------------------------------------------------
const SCIENTISTS_DATA = {
    "5": [
        {
            name: "Galileo Galilei",
            title: "Modern Fiziğin ve Teleskopik Astronominin Babası",
            years: "1564 - 1642",
            badge: "GÜNEŞ, DÜNYA VE AY",
            icon: "fa-solid fa-satellite",
            color: "from-amber-500 to-orange-600",
            curriculumLink: "Güneş Lekeleri, Ay Yüzeyi ve Jüpiter'in Uyduları",
            discovery: "İlk teleskoplardan birini yaparak Ay'ın kraterlerle kaplı olduğunu ve Güneş üzerindeki siyah lekeleri gözlemledi. Dünya'nın döndüğünü kanıtladı.",
            quote: "Ve yine de dönüyor...",
            funFact: "Güneş'e teleskopla doğrudan bakmanın gözleri kör edebileceğini fark ederek gölge izdüşümü yöntemini geliştirdi."
        },
        {
            name: "Ali Kuşçu",
            title: "Büyük Türk-İslam Astronom ve Matematik Bilgini",
            years: "1403 - 1474",
            badge: "GÖKBİLİM & AY HARİTASI",
            icon: "fa-solid fa-moon",
            color: "from-blue-600 to-indigo-700",
            curriculumLink: "Ay'ın Evreleri, Boyutları ve İlk Ay Haritası",
            discovery: "Ay'ın ve Güneş'in hareketlerini dakikası dakikasına hesapladı. Çizdiği detaylı Ay haritası nedeniyle NASA, Ay'daki bir kratere onun adını verdi.",
            quote: "İlim yolunda gösterilen gayret, insanlığa bırakılan en büyük mirastır.",
            funFact: "Fatih Sultan Mehmet'in davetiyle İstanbul'a gelmiş ve Ayasofya Medresesi'nin başmüderrisi olmuştur."
        },
        {
            name: "İbn-i Heysem (Alhazen)",
            title: "Optik ve Işık Biliminin Kurucusu",
            years: "965 - 1040",
            badge: "IŞIĞIN YAYILMASI",
            icon: "fa-solid fa-sun",
            color: "from-red-500 to-rose-700",
            curriculumLink: "Işığın Doğrusal Yayılması ve Karanlık Oda (Camera Obscura)",
            discovery: "Eski Yunan'ın 'Gözden ışık çıkar' yanılgısını yıktı. Görmenin, cisimlerden yansıyan ışığın göze gelmesiyle oluştuğunu ilk kez bilimsel olarak ispatladı.",
            quote: "Işık doğrular boyunca yayılır ve tüm evreni aydınlatır.",
            funFact: "Fotoğraf makinelerinin ve kameraların temel çalışma prensibi olan 'Karanlık Oda'yı 1000 yıl önce inşa etmiştir."
        },
        {
            name: "Louis Pasteur",
            title: "Mikrobiyolojinin ve Aşıların Öncüsü",
            years: "1822 - 1895",
            badge: "CANLILAR DÜNYASI",
            icon: "fa-solid fa-bacterium",
            color: "from-emerald-600 to-teal-700",
            curriculumLink: "Mikroskobik Canlılar, Mantarlar ve Besinlerin Bozulması",
            discovery: "Gözle görülmeyen mikroorganizmaların hastalıklara ve besin bozulmalarına yol açtığını keşfetti. Pastörizasyon yöntemini ve kuduz aşısını geliştirdi.",
            quote: "Şans, ancak hazır olan zihinleri ödüllendirir.",
            funFact: "Mikroskop altında sütün içindeki bakterileri yok etmek için ısıtıp aniden soğutma yöntemini bularak milyonlarca hayat kurtardı."
        }
    ],
    "6": [
        {
            name: "Nicolaus Copernicus & Johannes Kepler",
            title: "Güneş Merkezli Evren ve Gezegen Hareketleri",
            years: "1473 - 1630",
            badge: "GÜNEŞ SİSTEMİ VE GEZEGENLER",
            icon: "fa-solid fa-globe",
            color: "from-purple-600 to-indigo-800",
            curriculumLink: "Gezegenlerin Yörüngeleri ve Güneş-Ay Tutulmaları",
            discovery: "Dünya'nın evrenin merkezinde değil, diğer tüm gezegenler gibi Güneş'in etrafında eliptik yörüngelerde döndüğünü matematiksel kanıtlarla ortaya koydular.",
            quote: "Evrenin mimarisi, kusursuz bir matematiksel ahenkle örülmüştür.",
            funFact: "Kepler, gezegenlerin Güneş'e yaklaştıkça hızlandığını, uzaklaştıkça yavaşladığını 3 temel kanunla formülize etti."
        },
        {
            name: "İbn-i Sina (Avicenna)",
            title: "Tıbbın Hükümdarı ve Dolaşım Öncüsü",
            years: "980 - 1037",
            badge: "VÜCUDUMUZDAKİ SİSTEMLER",
            icon: "fa-solid fa-heart-pulse",
            color: "from-rose-600 to-red-700",
            curriculumLink: "Kan Dolaşımı, Nabız ve İç Organların Fonksiyonları",
            discovery: "Yazdığı 'El-Kanun fi't-Tıbb' kitabı 600 yıl boyunca Avrupa üniversitelerinde temel tıp kitabı olarak okutuldu. Nabız ölçümü ve mikrobik bulaşmayı ilk açıklayanlardandır.",
            quote: "Bilim ve sanat takdir edilmediği yerden göç eder.",
            funFact: "Nabzın ritmi ve damarların esnekliği üzerinden hastalıkların teşhisini gözü kapalı yapabilmekteydi."
        },
        {
            name: "Michael Faraday",
            title: "Elektromanyetizmanın ve İletkenliğin Dâhisi",
            years: "1791 - 1867",
            badge: "ELEKTRİĞİN İLETİMİ",
            icon: "fa-solid fa-bolt",
            color: "from-amber-500 to-yellow-600",
            curriculumLink: "İletken ve Yalıtkan Maddeler, Elektrik Akımı",
            discovery: "Elektrik motorunun ve jeneratörün temelini attı. Maddelerin elektriği ve manyetik alanları nasıl ilettiğini (Faraday Kafesi) gösterdi.",
            quote: "Hiçbir şey gerçekleşemeyecek kadar harika değildir; eğer doğa yasalarına uygunsa.",
            funFact: "Yoksul bir demircinin oğluydu ve ciltçi çırağıyken ciltlediği bilim kitaplarını okuyarak bilimin zirvesine çıktı."
        },
        {
            name: "Sir Isaac Newton (Kuvvet)",
            title: "Kuvvet, Hareket ve Yer Çekimi Kanunları",
            years: "1643 - 1727",
            badge: "KUVVET VE HAREKET",
            icon: "fa-solid fa-apple-whole",
            color: "from-emerald-600 to-cyan-700",
            curriculumLink: "Kuvvetin Ölçülmesi (Newton - N), Sürtünme ve Yer Çekimi",
            discovery: "Kuvvet birimine adını verdi (1 N). Evrensel kütle çekim yasasını ve etki-tepki ilkelerini keşfederek modern fiziğin temelini attı.",
            quote: "Eğer daha ileriyi görebildiysem, bu devlerin omuzlarında durduğum içindir.",
            funFact: "Ağaçtan düşen elmayı gözlemleyerek Dünya'nın Ay'ı aynı çekim kuvvetiyle yörüngesinde tuttuğunu hesapladı."
        }
    ],
    "7": [
        {
            name: "Robert Hooke & Antonie van Leeuwenhoek",
            title: "Hücrenin ve Mikroskobik Dünyanın Kâşifleri",
            years: "1635 - 1723",
            badge: "HÜCRE VE BÖLÜNMELER",
            icon: "fa-solid fa-dna",
            color: "from-emerald-600 to-green-700",
            curriculumLink: "Hücre Teorisi, Organeller, Çekirdek ve Mitoz",
            discovery: "Robert Hooke mantar meşesini inceleyerek içi boş odacıklara 'Cell' (Hücre) adını verdi. Leeuwenhoek ise tek hücreli canlıları ilk kez canlı olarak gözlemledi.",
            quote: "Mikroskop, doğanın en gizli sırlarını gözler önüne seren büyülü bir kapıdır.",
            funFact: "Leeuwenhoek kendi geliştirdiği tek mercekli mikroskoplarla göl suyundaki mikroorganizmaları 'küçük hayvancıklar' (animacules) olarak kaydetti."
        },
        {
            name: "James Prescott Joule & Isaac Newton",
            title: "İş, Enerji ve Kinetik-Potansiyel Dönüşümleri",
            years: "1818 - 1889",
            badge: "KUVVET, İŞ VE ENERJİ",
            icon: "fa-solid fa-gauge-high",
            color: "from-blue-600 to-indigo-700",
            curriculumLink: "İş = Kuvvet x Yol, Joule Birimi ve Enerjinin Korunumu",
            discovery: "Mekanik işin ısıya dönüştüğünü kanıtlayarak enerjinin yok olmadığını, sadece biçim değiştirdiğini ispatladı. Enerji birimi 'Joule' onun adını taşır.",
            quote: "Doğadaki hiçbir enerji kaybolmaz; potansiyelden kinetiğe sonsuz bir dansla akar.",
            funFact: "Balayında bile Alpler'deki şelalenin tepesindeki su ile tabanındaki su arasındaki sıcaklık farkını termometreyle ölçmüştür."
        },
        {
            name: "Dmitri Mendeleyev & John Dalton",
            title: "Atom Modelleri ve Saf Maddelerin Düzeni",
            years: "1834 - 1907",
            badge: "SAF MADDE VE KARIŞIMLAR",
            icon: "fa-solid fa-flask-vial",
            color: "from-amber-600 to-orange-700",
            curriculumLink: "Atom, Molekül, Element Sembolleri ve Karışımların Ayrılması",
            discovery: "Elementleri atom ağırlıklarına ve kimyasal benzerliklerine göre sıralayarak Periyodik Tablo'yu oluşturdu. Henüz keşfedilmemiş elementlerin özelliklerini önceden bildi.",
            quote: "Doğa bana kartların dizilimini gösterdiğinde tek yapmam gereken onları masaya koymaktı.",
            funFact: "Element kartlarıyla trende iskambil oynar gibi periyodik cetvelin ilk taslağını bir rüyasında tamamlamıştır."
        },
        {
            name: "Edwin Hubble",
            title: "Genişleyen Evren ve Galaksilerin Kâşifi",
            years: "1889 - 1953",
            badge: "GÜNEŞ SİSTEMİ VE ÖTESİ",
            icon: "fa-solid fa-star",
            color: "from-purple-700 to-pink-700",
            curriculumLink: "Samanyolu, Bulutsular (Nebula), Yıldızlar ve Işık Yılı",
            discovery: "Samanyolu galaksisinin evrendeki tek galaksi olmadığını, trilyonlarca galaksi bulunduğunu ve evrenin sürekli genişlediğini kanıtladı. Hubble Uzay Teleskobu onun adını taşır.",
            quote: "Evren sandığımızdan sadece daha büyük değil, hayal edebileceğimizden de büyüktür.",
            funFact: "Gençliğinde başarılı bir boksör ve avukattı, ancak gökyüzü tutkusu galip gelerek tarihin en büyük astronomlarından biri oldu."
        }
    ],
    "8": [
        {
            name: "Prof. Dr. Aziz Sancar",
            title: "Nobel Kimya Ödülü Sahibi Türk Bilim İnsanı",
            years: "1946 - Günümüz",
            badge: "DNA VE GENETİK KOD",
            icon: "fa-solid fa-award",
            color: "from-red-600 to-rose-700",
            curriculumLink: "DNA Yapısı, Nükleotidler, Mutasyon ve DNA Onarımı",
            discovery: "Hücrelerin hasar gören DNA'ları nasıl onardığını ve genetik bilgisini nasıl koruduğunu haritalandırarak 2015 Nobel Kimya Ödülü'nü kazandı.",
            quote: "Çoğu insan zekaya inanır, ben inanmıyorum. Bizi birbirimizden ayıran emektir, çalışmaktır.",
            funFact: "Mardin'in Savur ilçesinde okuma yazma bilmeyen 8 çocuklu bir ailenin çocuğu olarak büyümüş, Nobel madalyasını Anıtkabir'e bağışlamıştır."
        },
        {
            name: "Gregor Mendel",
            title: "Genetik ve Kalıtım Biliminin Kurucusu",
            years: "1822 - 1884",
            badge: "KALITIM & ÇAPRAZLAMALAR",
            icon: "fa-solid fa-seedling",
            color: "from-emerald-600 to-teal-700",
            curriculumLink: "Baskın ve Çekinik Genler, Fenotip, Genotip ve Akraba Evliliği",
            discovery: "Manastır bahçesinde binlerce bezelye bitkisini çaprazlayarak karakterlerin nesilden nesile nasıl aktarıldığını (Mendel Kanunları) ortaya koydu.",
            quote: "Benim zamanım bir gün mutlaka gelecek.",
            funFact: "Yaşarken keşfi anlaşılamadı; ölümünden 16 yıl sonra 3 farklı bilim insanı aynı sonuçları bularak Mendel'in hakkını teslim etti."
        },
        {
            name: "Blaise Pascal & Evangelista Torricelli",
            title: "Sıvı ve Gaz Basıncının Büyük Mimarları",
            years: "1608 - 1662",
            badge: "KATI, SIVI VE GAZ BASINCI",
            icon: "fa-solid fa-vial-circle-check",
            color: "from-blue-600 to-indigo-800",
            curriculumLink: "P = h • d • g, Pascal Prensibi (Hidrolik Sistemler), Açık Hava Basıncı (Torriçelli)",
            discovery: "Pascal: Kapalı kaptaki sıvıların basıncı her yöne aynen ilettiğini buldu (Hidrolik frenler, berber koltukları). Torriçelli: Cıvalı barometreyle 76 cm-Hg açık hava basıncını ölçtü.",
            quote: "Doğa boşluktan nefret etmez; hava ağırlığıyla her şeye baskı uygular.",
            funFact: "Pascal ilk mekanik hesap makinesini (Pascaline) vergi memuru olan babasının işlerini kolaylaştırmak için 19 yaşında icat etmiştir."
        },
        {
            name: "Marie Curie",
            title: "2 Farklı Alanda Nobel Kazanan İlk ve Tek Kadın Bilim İnsanı",
            years: "1867 - 1934",
            badge: "MADDE VE ENDÜSTRİ & RADYOAKTİVİTE",
            icon: "fa-solid fa-atom",
            color: "from-purple-600 to-pink-700",
            curriculumLink: "Elementlerin Keşfi (Polonyum, Radyum), Kimyasal Tepkimeler ve Periyodik Sistem",
            discovery: "Radyoaktiviteyi keşfetti. Hem Fizik (1903) hem de Kimya (1911) dallarında iki Nobel Ödülü kazanan tarihteki ilk ve tek bilim insanıdır.",
            quote: "Hayatta hiçbir şeyden korkulmamalıdır, sadece anlaşılmalıdır. Şimdi daha çok anlama zamanıdır.",
            funFact: "Çalışma defterleri bugün bile o kadar radyoaktiftir ki, Paris Ulusal Kütüphanesi'nde kurşun kaplı kutularda korunur ve sadece özel kıyafetlerle incelenebilir."
        }
    ]
};

function renderScientistsModule(gradeNumber) {
    const list = SCIENTISTS_DATA[String(gradeNumber)] || SCIENTISTS_DATA["8"];

    return `
        <div class="mb-10 animate-in fade-in duration-300">
            <!-- Üst Bilgi Başlığı -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-200">
                <div>
                    <div class="flex items-center gap-2 mb-1">
                        <span class="px-3.5 py-1 rounded-full bg-gradient-to-r from-red-600 to-rose-700 text-white text-[11px] font-black tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
                            <i class="fa-solid fa-telescope text-amber-300"></i> BİLİMİN ROTASINI ÇİZENLER
                        </span>
                        <span class="text-xs font-bold text-slate-500">${gradeNumber}. Sınıf Müfredatına Yön Veren Dâhiler</span>
                    </div>
                    <h3 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Tarihi Değiştiren Bilim İnsanları ve Büyük Keşifleri</h3>
                </div>
                <span class="text-xs font-bold text-red-700 bg-red-50 px-3.5 py-1.5 rounded-full border border-red-200 self-start sm:self-auto">
                    🏆 İlham Veren Başarı Hikayeleri
                </span>
            </div>

            <!-- Bilim İnsanları Kartları -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${list.map(sci => `
                    <div onclick="openScientistModal('${sci.name.replace(/'/g, "\\'")}', '${gradeNumber}')" class="bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-200/90 hover:border-red-500/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group cursor-pointer">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${sci.color} opacity-10 rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform"></div>

                        <div>
                            <div class="flex items-start justify-between gap-3 mb-4">
                                <div class="flex items-center gap-3.5">
                                    <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr ${sci.color} text-white flex items-center justify-center text-2xl shadow-md group-hover:rotate-6 transition-transform flex-shrink-0">
                                        <i class="${sci.icon}"></i>
                                    </div>
                                    <div>
                                        <h4 class="text-lg sm:text-xl font-black text-slate-900 leading-tight group-hover:text-red-600 transition-colors">${sci.name}</h4>
                                        <p class="text-xs text-slate-500 font-bold mt-0.5">${sci.title} • <span class="text-slate-400 font-medium">${sci.years}</span></p>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <span class="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-[10px] font-black uppercase tracking-wider border border-red-100">
                                    📌 MÜFREDAT BAĞI: ${sci.curriculumLink}
                                </span>
                            </div>

                            <p class="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed mb-4">
                                ${sci.discovery}
                            </p>

                            <!-- İlham Verici Söz & Eğlenceli Bilgi -->
                            <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 mb-4 text-xs">
                                <div class="text-slate-800 font-bold italic flex items-center gap-2">
                                    <i class="fa-solid fa-quote-left text-red-500 text-xs"></i>
                                    <span>"${sci.quote}"</span>
                                </div>
                                <div class="text-[11px] text-slate-500 font-medium flex items-start gap-1.5 pt-1.5 border-t border-slate-200/60">
                                    <i class="fa-solid fa-lightbulb text-amber-500 mt-0.5 flex-shrink-0"></i>
                                    <span><strong>Biliyor muydunuz?</strong> ${sci.funFact}</span>
                                </div>
                            </div>
                        </div>

                        <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span class="text-[11px] font-black text-slate-400 uppercase tracking-wider">${sci.badge}</span>
                            <button onclick="openScientistModal('${sci.name.replace(/'/g, "\\'")}', '${gradeNumber}')" class="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-black text-xs uppercase rounded-xl transition-all shadow-md shadow-red-600/25 flex items-center gap-1.5 hover:scale-105 transform">
                                <i class="fa-solid fa-atom"></i> Keşif Kartını Oku →
                            </button>
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}

// -------------------------------------------------------------
// 🔬 BİLİM İNSANI DETAYLI ARAŞTIRMA & KEŞİF KARTI MODALI
// -------------------------------------------------------------
function openScientistModal(scientistName, gradeNumber = "8") {
    let modal = document.getElementById("scientist-detail-modal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "scientist-detail-modal";
        modal.className = "fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 transition-all duration-300";
        modal.onclick = function(e) {
            if (e.target === this) closeScientistModal();
        };
        document.body.appendChild(modal);
    }

    // Bilim insanını bul
    let sci = null;
    const allScientists = Object.values(SCIENTISTS_DATA).flat();
    sci = allScientists.find(s => s.name.toLowerCase().includes(scientistName.toLowerCase()) || scientistName.toLowerCase().includes(s.name.toLowerCase())) || allScientists[0];

    // Detaylı Bilimsel İçerik Üretimi (Bilim insanına özel zengin eğitim notu)
    let detailedNotes = "";
    if (sci.name.includes("Galileo")) {
        detailedNotes = `
            <div class="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                <div class="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                    <h5 class="font-black text-amber-900 text-sm mb-1.5 flex items-center gap-2">
                        <i class="fa-solid fa-telescope text-amber-600"></i> 1. Teleskopik Astronomi ve Gökyüzü Gözlemleri
                    </h5>
                    <p>Galileo, 1609 yılında 30 kat büyütme gücüne sahip kendi teleskobunu tasarladı. Gökyüzünü incelediğinde pürüzsüz sanılan <strong>Ay'ın dağlar, vadiler ve kraterlerle kaplı olduğunu</strong>, <strong>Güneş üzerinde koyu lekeler (Güneş Lekeleri)</strong> bulunduğunu ve Güneş'in kendi ekseni etrafında döndüğünü ilk kez ispatladı.</p>
                </div>

                <div class="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                    <h5 class="font-black text-blue-900 text-sm mb-1.5 flex items-center gap-2">
                        <i class="fa-solid fa-globe text-blue-600"></i> 2. Dünya'nın Hareketi ve Jüpiter'in Uyduları
                    </h5>
                    <p>Jüpiter'in etrafında dönen 4 büyük uyduyu (Io, Europa, Ganymede, Callisto) keşfederek her gök cisminin Dünya etrafında dönmediğini kanıtladı. Kopernik'in <em>"Dünya ve diğer gezegenler Güneş etrafında döner"</em> teorisini somut gözlemlerle doğruladı.</p>
                </div>

                <div class="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                    <h5 class="font-black text-emerald-900 text-sm mb-1.5 flex items-center gap-2">
                        <i class="fa-solid fa-flask-vial text-emerald-600"></i> 3. Eğik Düzlem & Serbest Düşme Deneyleri
                    </h5>
                    <p>Pisa Kulesi ve eğik düzlemlerde yaptığı deneylerle; hava sürtünmesi önemsenmediğinde <strong>ağır ve hafif tüm cisimlerin aynı ivmeyle aynı anda yere düştüğünü</strong> göstererek Aristo fiziğini tarihe gömdü.</p>
                </div>
            </div>
        `;
    } else if (sci.name.includes("Aziz Sancar")) {
        detailedNotes = `
            <div class="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                <div class="p-4 bg-red-50 rounded-2xl border border-red-200">
                    <h5 class="font-black text-red-900 text-sm mb-1.5 flex items-center gap-2">
                        <i class="fa-solid fa-dna text-red-600"></i> 1. DNA Onarım Mekanizmaları (Nükleotid Kesip Çıkarma Onarımı)
                    </h5>
                    <p>Güneşten gelen zararlı UV ışınları ve kimyasallar DNA zincirinde mutasyonlara ve hasarlara yol açar. Prof. Dr. Aziz Sancar, hücrelerin hasarlı DNA parçasını adeta bir makas gibi kesip çıkararak yerine sağlam nükleotidleri nasıl yerleştirdiğini moleküler düzeyde haritalandırdı.</p>
                </div>

                <div class="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                    <h5 class="font-black text-amber-900 text-sm mb-1.5 flex items-center gap-2">
                        <i class="fa-solid fa-clock text-amber-600"></i> 2. Biyolojik Saat ve Kanser Tedavisi
                    </h5>
                    <p>Vücudumuzdaki 24 saatlik biyolojik saat döngüsünün (Sirkadiyen Ritim) DNA onarım hızını doğrudan kontrol ettiğini kanıtladı. Bu keşif sayesinde kanser ilaçlarının günün hangi saatinde verilirse daha etkili olacağını belirleyen tedavi yöntemleri geliştirildi.</p>
                </div>
            </div>
        `;
    } else if (sci.name.includes("Pascal") || sci.name.includes("Torricelli")) {
        detailedNotes = `
            <div class="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                <div class="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                    <h5 class="font-black text-blue-900 text-sm mb-1.5 flex items-center gap-2">
                        <i class="fa-solid fa-faucet-drip text-blue-600"></i> 1. Pascal Prensibi (Sıvıların Basıncı İletmesi)
                    </h5>
                    <p>Sıvılar sıkıştırılamaz kabul edilir. Kapalı bir kaptaki sıvıya uygulanan basınç, sıvının temas ettiği <strong>tüm noktalara ve kabın iç yüzeyine aynen ve dik olarak</strong> iletilir. Hidrolik frenler, berber koltukları, itfaiye merdivenleri ve su cendereleri bu ilkeyle çalışır.</p>
                </div>

                <div class="p-4 bg-purple-50 rounded-2xl border border-purple-200">
                    <h5 class="font-black text-purple-900 text-sm mb-1.5 flex items-center gap-2">
                        <i class="fa-solid fa-cloud text-purple-600"></i> 2. Torriçelli Deneyi & Açık Hava Basıncı
                    </h5>
                    <p>Deniz seviyesinde 0°C'de 1 metrelik cam boruyu cıvayla doldurup cıva çanağına batırdığında cıva seviyesinin <strong>76 cm (760 mm-Hg = 1 atm)</strong>'de dengede kaldığını gördü. Açık havanın ağırlığı nedeniyle yeryüzündeki tüm cisimlere basınç uyguladığını ispatladı.</p>
                </div>
            </div>
        `;
    } else if (sci.name.includes("Mendel")) {
        detailedNotes = `
            <div class="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                <div class="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                    <h5 class="font-black text-emerald-900 text-sm mb-1.5 flex items-center gap-2">
                        <i class="fa-solid fa-seedling text-emerald-600"></i> 1. Bezelye Çaprazlamaları & Kalıtım Kanunları
                    </h5>
                    <p>Mendel; kolay yetiştirilmesi, yılda çok döl vermesi ve dış tozlaşmaya kapalı olması nedeniyle bezelyeleri seçti. Sarı-yeşil tohum, düz-buruşuk şekil gibi zıt karakterleri çaprazlayarak <strong>Baskın (Dominant)</strong> ve <strong>Çekinik (Resesif)</strong> gen kavramlarını buldu.</p>
                </div>
            </div>
        `;
    } else {
        detailedNotes = `
            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                <p class="mb-3">${sci.discovery}</p>
                <p>Bu büyük bilim insanının çalışmaları, günümüz modern bilim ve teknolojisinin temel yapı taşlarını oluşturmaktadır. İlgili sınıfın sınavlarında ve MEB kazanımlarında en sık soru gelen temel teorilerin mimarıdır.</p>
            </div>
        `;
    }

    modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto custom-scrollbar flex flex-col" onclick="event.stopPropagation()">
            
            <!-- Üst Kapatma Butonu -->
            <button type="button" onclick="closeScientistModal()" class="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-100/80 hover:bg-red-50 hover:text-red-600 text-slate-600 flex items-center justify-center font-black text-base transition-all z-20 shadow-sm" title="Kapat (ESC)">
                <i class="fa-solid fa-xmark"></i>
            </button>

            <!-- Renkli Hero Başlık -->
            <div class="bg-gradient-to-r ${sci.color} text-white p-6 sm:p-8 rounded-t-3xl relative overflow-hidden flex-shrink-0">
                <div class="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-bl-full pointer-events-none"></div>

                <div class="flex items-center gap-4 relative z-10">
                    <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center text-3xl sm:text-4xl shadow-lg border border-white/30 flex-shrink-0">
                        <i class="${sci.icon}"></i>
                    </div>
                    <div>
                        <div class="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-black tracking-wider uppercase mb-1.5">
                            ${sci.badge}
                        </div>
                        <h3 class="text-2xl sm:text-3xl font-black tracking-tight leading-tight">${sci.name}</h3>
                        <p class="text-xs sm:text-sm text-white/90 font-semibold mt-0.5">${sci.title} (${sci.years})</p>
                    </div>
                </div>
            </div>

            <!-- İçerik Alanı -->
            <div class="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto">
                
                <!-- Müfredat & Kazanım Bağı -->
                <div class="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-xl border border-red-200 text-xs font-bold">
                    <i class="fa-solid fa-bookmark text-red-600 text-sm"></i>
                    <span>MEB Müfredat İlişkisi: <strong>${sci.curriculumLink}</strong></span>
                </div>

                <!-- Detaylı Araştırma Bölümü -->
                <div>
                    <h4 class="text-sm font-black uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-red-600"></span> Bilimsel Keşifleri & Deneyleri
                    </h4>
                    ${detailedNotes}
                </div>

                <!-- İlham Veren Sözü -->
                <div class="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl shadow-md relative overflow-hidden">
                    <i class="fa-solid fa-quote-left absolute -bottom-2 -right-2 text-white/10 text-6xl pointer-events-none"></i>
                    <div class="text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">Bilimsel Vizyonu</div>
                    <div class="text-sm sm:text-base font-bold italic leading-relaxed">"${sci.quote}"</div>
                </div>

                <!-- Biliyor muydunuz? -->
                <div class="p-4 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-start gap-3">
                    <div class="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-base flex-shrink-0 mt-0.5">
                        <i class="fa-solid fa-lightbulb"></i>
                    </div>
                    <div>
                        <h5 class="text-xs font-black text-amber-900 uppercase tracking-wider mb-0.5">Biliyor Muydunuz?</h5>
                        <p class="text-xs text-slate-700 leading-relaxed font-medium">${sci.funFact}</p>
                    </div>
                </div>

                <!-- Alt Butonlar -->
                <div class="pt-3 border-t border-slate-100 flex flex-wrap gap-3">
                    <button type="button" onclick="window.print()" class="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-2">
                        <i class="fa-solid fa-print"></i> Keşif Kartını Yazdır (A4)
                    </button>
                    <button type="button" onclick="closeScientistModal()" class="py-3 px-6 bg-slate-900 hover:bg-red-600 text-white font-black text-xs uppercase rounded-xl transition-all">
                        Kapat
                    </button>
                </div>
            </div>
        </div>
    `;

    modal.style.display = "flex";
    modal.classList.remove("hidden");
}

function closeScientistModal() {
    const modal = document.getElementById("scientist-detail-modal");
    if (modal) {
        modal.style.display = "none";
        modal.classList.add("hidden");
    }
}

// -------------------------------------------------------------
// 🛠️ HATA & EKSİK BİLDİRİM SİSTEMİ (ÖĞRENCİ/ZİYARETÇİ VE YÖNETİCİ)
// -------------------------------------------------------------

function openIssueReportModal() {
    let modal = document.getElementById("issue-report-modal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "issue-report-modal";
        modal.className = "fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 transition-all duration-300";
        modal.onclick = function(e) {
            if (e.target === this) closeIssueReportModal();
        };
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto custom-scrollbar" onclick="event.stopPropagation()">
            
            <!-- Kapat Butonu -->
            <button type="button" onclick="closeIssueReportModal()" class="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 flex items-center justify-center font-black text-base transition-all z-20 shadow-sm" title="Kapat (ESC)">
                <i class="fa-solid fa-xmark"></i>
            </button>

            <!-- Başlık & İkon -->
            <div class="flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-100">
                <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-700 text-white flex items-center justify-center text-xl shadow-md flex-shrink-0">
                    <i class="fa-solid fa-bug"></i>
                </div>
                <div>
                    <h3 class="text-xl font-black text-slate-900 tracking-tight">Hata & Eksik Bildirim Paneli</h3>
                    <p class="text-xs text-slate-500 font-medium">Sayfadaki eksikleri ve açılmayanları buradan bildirebilirsiniz</p>
                </div>
            </div>

            <form onsubmit="handleIssueReportSubmit(event)" class="space-y-4">
                
                <!-- 1. İlgili Bölüm -->
                <div>
                    <label class="block text-xs font-black uppercase text-slate-700 mb-1.5 flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full bg-red-600"></span> İlgili Bölüm
                    </label>
                    <select id="issue-section-select" class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white transition-all">
                        <option value="5. Sınıf Fen Bilimleri">🟢 5. Sınıf Fen Bilimleri</option>
                        <option value="6. Sınıf Fen Bilimleri">🔵 6. Sınıf Fen Bilimleri</option>
                        <option value="7. Sınıf Fen Bilimleri">🟡 7. Sınıf Fen Bilimleri</option>
                        <option value="8. Sınıf (LGS) Fen Bilimleri" selected>🔴 8. Sınıf (LGS) Fen Bilimleri</option>
                        <option value="Proje & STEM Merkezi">🏆 Proje & STEM Merkezi</option>
                        <option value="Bilimin Rotasını Çizenler">🔭 Bilimin Rotasını Çizenler</option>
                        <option value="Yazılı Sınav Merkezi">✏️ Ortak Yazılı Sınav Merkezi</option>
                        <option value="Arama Motoru">🔍 Portal Genel Arama</option>
                        <option value="Genel Portal & Tasarım">🧭 Genel Portal / Tasarım</option>
                    </select>
                </div>

                <!-- 2. Alt Başlık / Modül -->
                <div>
                    <label class="block text-xs font-black uppercase text-slate-700 mb-1.5 flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full bg-amber-500"></span> Sorunlu Alt Başlık / Modül
                    </label>
                    <select id="issue-submodule-select" class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all">
                        <option value="📝 Ders Notu & PDF Föyleri">📝 Ders Notu & PDF Föyleri</option>
                        <option value="📊 Ders Sunumu & Akıllı Tahta Slaytları">📊 Ders Sunumu & Akıllı Tahta Slaytları</option>
                        <option value="🎥 Videolar & Deney Çekimleri">🎥 Videolar & Deney Çekimleri</option>
                        <option value="🧩 Etkinlikler & Çalışma Kağıtları">🧩 Etkinlikler & Çalışma Kağıtları</option>
                        <option value="📚 Soru Bankası & Testler">📚 Soru Bankası & Testler</option>
                        <option value="🎯 Deneme Sınavları">🎯 Deneme Sınavları</option>
                        <option value="🎮 Eğitsel Oyunlar & Simülasyonlar">🎮 Eğitsel Oyunlar & Simülasyonlar</option>
                        <option value="🔭 Bilim İnsanı Araştırma Notu">🔭 Bilim İnsanı Araştırma Notu</option>
                        <option value="✏️ Ortak Yazılı Sınav Kağıtları">✏️ Ortak Yazılı Sınav Kağıtları</option>
                        <option value="🏆 Projeler & STEM Atölyesi">🏆 Projeler & STEM Atölyesi</option>
                        <option value="🃏 3D Bilgi Kartları / Mini Quizler">🃏 3D Bilgi Kartları / Mini Quizler</option>
                        <option value="📱 Mobil Menü & Sayfa Butonları">📱 Mobil Menü & Sayfa Butonları</option>
                        <option value="Diğer Bölüm">Diğer</option>
                    </select>
                </div>

                <!-- 3. Sorun Türü (Genişletilmiş Seçenekler) -->
                <div>
                    <label class="block text-xs font-black uppercase text-slate-700 mb-1.5 flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full bg-blue-600"></span> Sorun Türü
                    </label>
                    <select id="issue-type-select" class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all">
                        <option value="❌ Açılmayan Dosya / Kırık İndirme Linki">❌ Açılmayan Dosya / Kırık İndirme Linki</option>
                        <option value="⚠️ Yanlış / Hatalı Bilgi veya Soru">⚠️ Yanlış / Hatalı Bilgi veya Soru</option>
                        <option value="📭 Eksik İçerik / Yüklenmemiş Materyal">📭 Eksik İçerik / Yüklenmemiş Materyal</option>
                        <option value="🎮 Oyunda / Simülasyonda Çalışmayan Buton veya Hata">🎮 Oyunda / Simülasyonda Çalışmayan Buton veya Hata</option>
                        <option value="📱 Mobilde / Telefonda Görünüm veya Kayma Sorunu">📱 Mobilde / Telefonda Görünüm veya Kayma Sorunu</option>
                        <option value="🎥 Video Oynatılamıyor / Ses Yok">🎥 Video Oynatılamıyor / Ses Yok</option>
                        <option value="📑 Yazım / İmla veya Görsel Hatası">📑 Yazım / İmla veya Görsel Hatası</option>
                        <option value="💡 Yeni İçerik / Materyal / Konu Talebi">💡 Yeni İçerik / Materyal / Konu Talebi</option>
                        <option value="⏱️ Süre / Cevap Anahtarı Hatası">⏱️ Süre / Cevap Anahtarı Hatası</option>
                        <option value="❓ Diğer Teknik Sorun">❓ Diğer Teknik Sorun</option>
                    </select>
                </div>

                <!-- Butonlar -->
                <div class="pt-3 flex gap-3">
                    <button type="button" onclick="closeIssueReportModal()" class="py-3.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase rounded-xl transition-all">
                        Vazgeç
                    </button>
                    <button type="submit" id="submit-issue-btn" class="flex-1 py-3.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2">
                        <i class="fa-solid fa-paper-plane"></i>
                        <span>Bildirimi Kaydet</span>
                    </button>
                </div>
            </form>
        </div>
    `;

    modal.style.display = "flex";
    modal.classList.remove("hidden");
}

function closeIssueReportModal() {
    const modal = document.getElementById("issue-report-modal");
    if (modal) {
        modal.style.display = "none";
        modal.classList.add("hidden");
    }
}

function handleIssueReportSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();

    const sectionSelect = document.getElementById("issue-section-select");
    const submoduleSelect = document.getElementById("issue-submodule-select");
    const typeSelect = document.getElementById("issue-type-select");

    const newReport = {
        id: "issue-" + Date.now(),
        reporter: "Ziyaretçi",
        section: sectionSelect ? sectionSelect.value : "Genel Bölüm",
        grade: sectionSelect ? sectionSelect.value : "Genel",
        subModule: submoduleSelect ? submoduleSelect.value : "Genel Modül",
        type: typeSelect ? typeSelect.value : "Genel Sorun",
        detail: `${sectionSelect ? sectionSelect.value : ''} — ${submoduleSelect ? submoduleSelect.value : ''}`,
        pageUrl: window.location.hash || "#home",
        createdAt: new Date().toLocaleString("tr-TR"),
        status: "Beklemede"
    };

    let list = [];
    try {
        list = JSON.parse(localStorage.getItem("rotali_issue_reports") || "[]");
    } catch(err) {
        list = [];
    }

    list.unshift(newReport);
    localStorage.setItem("rotali_issue_reports", JSON.stringify(list));

    closeIssueReportModal();
    showToast("✅ Bildiriminiz başarıyla iletildi. Teşekkür ederiz!", "success");

    // Yönetici paneli açıksa listeyi yenile
    if (window.location.hash === "#teacher-dashboard" || window.location.hash === "#admin") {
        const appEl = document.getElementById("app");
        if (appEl) renderTeacherDashboardPage(appEl);
    }
}

function deleteIssueReport(issueId) {
    if (!checkAdminAccess()) return;
    if (!confirm("Bu bildirim kaydını silmek istediğinize emin misiniz?")) return;

    let issueList = JSON.parse(localStorage.getItem("rotali_issue_reports") || "[]");
    issueList = issueList.filter(i => i.id !== issueId);
    localStorage.setItem("rotali_issue_reports", JSON.stringify(issueList));
    showToast("🗑️ Bildirim silindi.", "info");
    handleRouteChange();
}

function markIssueResolved(issueId) {
    if (!checkAdminAccess()) return;

    let issueList = JSON.parse(localStorage.getItem("rotali_issue_reports") || "[]");
    const idx = issueList.findIndex(i => i.id === issueId);
    if (idx !== -1) {
        issueList[idx].status = issueList[idx].status === "Çözüldü" ? "Beklemede" : "Çözüldü";
        localStorage.setItem("rotali_issue_reports", JSON.stringify(issueList));
        showToast("✅ Bildirim durumu güncellendi.", "success");
        handleRouteChange();
    }
}

function renderGradeDetail(container, gradeIdWithTab = "grade-8") {
    // Parse gradeId and subTab: e.g. "grade-5/ders-notu" or "grade-5"
    let parts = (gradeIdWithTab || "grade-8").split("/");
    let gradeId = parts[0] || "grade-8";
    let subTab = parts[1] || "ders-notu";
    if (subTab === "uniteler") subTab = "ders-notu";

    // Find grade in PORTAL_GRADES
    const grade = PORTAL_GRADES.find(g => g.id === gradeId || g.slug === gradeId || String(g.number) === gradeId) || PORTAL_GRADES[3];
    const subData = getGradeSubSectionsData(grade.number);
    const isAdmin = localStorage.getItem("rotali_is_admin") === "true";

    container.innerHTML = `
        <div class="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-10">
            <!-- Hero Başlık & 8'li Kutu Modül Alanı (BÜYÜK BÖLÜM İÇERİSİNDE BÜTÜNLEŞİK) -->
            <div class="bg-gradient-to-r ${grade.color} text-white rounded-3xl p-6 sm:p-10 mb-10 shadow-2xl relative overflow-hidden">
                <div class="relative z-10">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div class="flex items-center gap-2">
                            <span class="px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-black tracking-wider uppercase inline-block shadow-sm">
                                ${grade.number}. SINIF FEN BİLİMLERİ PORTALI
                            </span>
                            ${grade.isLGS ? '<span class="px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black shadow-sm">🔥 LGS MERKEZİ</span>' : ''}
                        </div>
                        ${isAdmin ? `
                        <div class="flex items-center gap-2">
                            <button onclick="triggerUploadModal('${grade.number}', '${subTab}')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase rounded-xl transition-all flex items-center gap-1.5 shadow-md self-start md:self-auto">
                                <i class="fa-solid fa-cloud-arrow-up"></i> + Bu Sınıfa İçerik Ekle
                            </button>
                        </div>
                    ` : ''}
                    </div>

                    <h2 class="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-3 drop-shadow-sm">${grade.title}</h2>
                    <p class="text-sm sm:text-base text-white/95 leading-relaxed max-w-4xl font-medium drop-shadow-sm mb-6">${grade.description}</p>
                    
                    <!-- 8 ALT BÖLÜM KUTULARI (BÜYÜK BÖLÜMÜN İÇİNDE TEK SIRA / DUYARLI GRID) -->
                    <div class="pt-6 border-t border-white/25">
                        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-2.5">
                            
                            <!-- 1. Ders Notu -->
                            <button onclick="switchGradeSubTab('${grade.id}', 'ders-notu')" class="group p-2.5 sm:p-3 rounded-2xl transition-all flex flex-col items-center justify-center text-center gap-1.5 ${subTab === 'ders-notu' ? 'bg-white text-slate-900 shadow-xl scale-[1.04] ring-4 ring-white/40' : 'bg-white/15 hover:bg-white/30 backdrop-blur-md text-white border border-white/20 hover:scale-[1.02]'}">
                                <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-base sm:text-lg ${subTab === 'ders-notu' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white/20 text-white group-hover:scale-110'} transition-transform">
                                    <i class="fa-solid fa-file-lines"></i>
                                </div>
                                <span class="text-[10px] sm:text-[11px] font-black tracking-tight uppercase leading-tight">📝 DERS NOTU</span>
                            </button>

                            <!-- 2. Ders Sunumu -->
                            <button onclick="switchGradeSubTab('${grade.id}', 'ders-sunumu')" class="group p-2.5 sm:p-3 rounded-2xl transition-all flex flex-col items-center justify-center text-center gap-1.5 ${subTab === 'ders-sunumu' ? 'bg-white text-slate-900 shadow-xl scale-[1.04] ring-4 ring-white/40' : 'bg-white/15 hover:bg-white/30 backdrop-blur-md text-white border border-white/20 hover:scale-[1.02]'}">
                                <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-base sm:text-lg ${subTab === 'ders-sunumu' ? 'bg-orange-600 text-white shadow-sm' : 'bg-white/20 text-white group-hover:scale-110'} transition-transform">
                                    <i class="fa-solid fa-file-powerpoint"></i>
                                </div>
                                <span class="text-[10px] sm:text-[11px] font-black tracking-tight uppercase leading-tight">📊 DERS SUNUMU</span>
                            </button>

                            <!-- 3. Videolar -->
                            <button onclick="switchGradeSubTab('${grade.id}', 'videolar')" class="group p-2.5 sm:p-3 rounded-2xl transition-all flex flex-col items-center justify-center text-center gap-1.5 ${subTab === 'videolar' ? 'bg-white text-slate-900 shadow-xl scale-[1.04] ring-4 ring-white/40' : 'bg-white/15 hover:bg-white/30 backdrop-blur-md text-white border border-white/20 hover:scale-[1.02]'}">
                                <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-base sm:text-lg ${subTab === 'videolar' ? 'bg-rose-600 text-white shadow-sm' : 'bg-white/20 text-white group-hover:scale-110'} transition-transform">
                                    <i class="fa-solid fa-circle-play"></i>
                                </div>
                                <span class="text-[10px] sm:text-[11px] font-black tracking-tight uppercase leading-tight">🎥 VİDEOLAR</span>
                            </button>

                            <!-- 4. Etkinlikler -->
                            <button onclick="switchGradeSubTab('${grade.id}', 'etkinlikler')" class="group p-2.5 sm:p-3 rounded-2xl transition-all flex flex-col items-center justify-center text-center gap-1.5 ${subTab === 'etkinlikler' ? 'bg-white text-slate-900 shadow-xl scale-[1.04] ring-4 ring-white/40' : 'bg-white/15 hover:bg-white/30 backdrop-blur-md text-white border border-white/20 hover:scale-[1.02]'}">
                                <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-base sm:text-lg ${subTab === 'etkinlikler' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white/20 text-white group-hover:scale-110'} transition-transform">
                                    <i class="fa-solid fa-puzzle-piece"></i>
                                </div>
                                <span class="text-[10px] sm:text-[11px] font-black tracking-tight uppercase leading-tight">🧩 ETKİNLİKLER</span>
                            </button>

                            <!-- 5. Soru Bankası -->
                            <button onclick="switchGradeSubTab('${grade.id}', 'soru-bankasi')" class="group p-2.5 sm:p-3 rounded-2xl transition-all flex flex-col items-center justify-center text-center gap-1.5 ${subTab === 'soru-bankasi' ? 'bg-white text-slate-900 shadow-xl scale-[1.04] ring-4 ring-white/40' : 'bg-white/15 hover:bg-white/30 backdrop-blur-md text-white border border-white/20 hover:scale-[1.02]'}">
                                <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-base sm:text-lg ${subTab === 'soru-bankasi' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white/20 text-white group-hover:scale-110'} transition-transform">
                                    <i class="fa-solid fa-book-open-reader"></i>
                                </div>
                                <span class="text-[10px] sm:text-[11px] font-black tracking-tight uppercase leading-tight">📚 SORU BANKASI</span>
                            </button>

                            <!-- 6. Denemeler -->
                            <button onclick="switchGradeSubTab('${grade.id}', 'denemeler')" class="group p-2.5 sm:p-3 rounded-2xl transition-all flex flex-col items-center justify-center text-center gap-1.5 ${subTab === 'denemeler' ? 'bg-white text-slate-900 shadow-xl scale-[1.04] ring-4 ring-white/40' : 'bg-white/15 hover:bg-white/30 backdrop-blur-md text-white border border-white/20 hover:scale-[1.02]'}">
                                <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-base sm:text-lg ${subTab === 'denemeler' ? 'bg-purple-600 text-white shadow-sm' : 'bg-white/20 text-white group-hover:scale-110'} transition-transform">
                                    <i class="fa-solid fa-bullseye"></i>
                                </div>
                                <span class="text-[10px] sm:text-[11px] font-black tracking-tight uppercase leading-tight">🎯 DENEMELER</span>
                            </button>

                            <!-- 7. Eğitsel Oyunlar -->
                            <button onclick="switchGradeSubTab('${grade.id}', 'egitsel-oyunlar')" class="group p-2.5 sm:p-3 rounded-2xl transition-all flex flex-col items-center justify-center text-center gap-1.5 ${subTab === 'egitsel-oyunlar' ? 'bg-white text-slate-900 shadow-xl scale-[1.04] ring-4 ring-white/40' : 'bg-white/15 hover:bg-white/30 backdrop-blur-md text-white border border-white/20 hover:scale-[1.02]'}">
                                <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-base sm:text-lg ${subTab === 'egitsel-oyunlar' ? 'bg-fuchsia-600 text-white shadow-sm' : 'bg-white/20 text-white group-hover:scale-110'} transition-transform">
                                    <i class="fa-solid fa-gamepad"></i>
                                </div>
                                <span class="text-[10px] sm:text-[11px] font-black tracking-tight uppercase leading-tight">🎮 EĞİTSEL OYUNLAR</span>
                            </button>

                            <!-- 8. Bilimin Rotasını Çizenler (EN SONDA) -->
                            <button onclick="switchGradeSubTab('${grade.id}', 'bilim-insanlari')" class="group p-2.5 sm:p-3 rounded-2xl transition-all flex flex-col items-center justify-center text-center gap-1.5 ${subTab === 'bilim-insanlari' ? 'bg-white text-slate-900 shadow-xl scale-[1.04] ring-4 ring-white/40' : 'bg-white/15 hover:bg-white/30 backdrop-blur-md text-white border border-white/20 hover:scale-[1.02]'}">
                                <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-base sm:text-lg ${subTab === 'bilim-insanlari' ? 'bg-red-600 text-white shadow-sm' : 'bg-white/20 text-white group-hover:scale-110'} transition-transform">
                                    <i class="fa-solid fa-telescope"></i>
                                </div>
                                <span class="text-[10px] sm:text-[11px] font-black tracking-tight uppercase leading-tight">🔭 BİLİMİN ROTASINI ÇİZENLER</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- SEÇİLEN ALT BÖLÜMÜN İÇERİĞİ -->
            <div id="grade-subtab-container" class="animate-in fade-in duration-300">
                ${renderGradeSubTabContent(grade, subData, subTab)}
            </div>
        </div>
    `;
}

function switchGradeSubTab(gradeId, tabName) {
    window.location.hash = `grade/${gradeId}/${tabName}`;
}

function renderGradeSubTabContent(grade, subData, subTab) {
    if (subTab === "bilim-insanlari" || subTab === "uniteler" || subTab === "bilimin-rotasi") {
        return renderScientistsModule(grade.number);
    } else if (subTab === "ders-notu") {
        const enriched = (typeof ENRICHED_GRADE_CONTENT !== "undefined" && ENRICHED_GRADE_CONTENT[String(grade.number)]) ? ENRICHED_GRADE_CONTENT[String(grade.number)] : null;

        return `
            <div class="mb-8">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-2xl font-black text-slate-900 flex items-center gap-2.5">
                        <i class="fa-solid fa-book-open text-red-600"></i> ${grade.number}. Sınıf Fen Bilimleri Detaylı Konu Anlatımı & Özetleri
                    </h3>
                    <span class="text-xs font-bold px-3 py-1 bg-red-50 text-red-700 rounded-full border border-red-200">MEB 2026-2027 Müfredat Uyumlu</span>
                </div>
                <p class="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                    Sınavlarda ve yazılılarda en sık karşılaşılan temel kavramlar, formüller, dikkat edilmesi gereken tuzaklar ve önemli bilimsel kurallar aşağıda özetlenmiştir.
                </p>
            </div>

            ${enriched && enriched.unitSummaries ? `
                <div class="space-y-6 mb-10">
                    ${enriched.unitSummaries.map((uSum, uIdx) => `
                        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                            <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                                <h4 class="text-lg font-black text-slate-900 flex items-center gap-2">
                                    <span class="w-7 h-7 rounded-xl bg-red-600 text-white flex items-center justify-center text-xs font-black">${uIdx + 1}</span>
                                    <span>${uSum.unit}</span>
                                </h4>
                                <button onclick="window.print()" class="text-xs font-black text-red-600 hover:text-red-700 flex items-center gap-1">
                                    <i class="fa-solid fa-print"></i> Yazdır
                                </button>
                            </div>
                            <div class="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                                ${uSum.highlights.map(hl => `
                                    <div class="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex items-start gap-2.5">
                                        <i class="fa-solid fa-circle-check text-emerald-600 mt-1 flex-shrink-0 text-xs"></i>
                                        <div class="prose-sm">${hl.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-black">$1</strong>')}</div>
                                    </div>
                                `).join("")}
                            </div>
                        </div>
                    `).join("")}
                </div>
            ` : ''}

            ${renderCustomMaterialsSection(grade.number, "ders-notu")}
            <h4 class="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <i class="fa-solid fa-folder-open text-blue-600"></i> ${grade.number}. Sınıf İndirilebilir PDF Ders Föyleri
            </h4>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${subData.dersNotu.map(item => `
                    <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <span class="px-3 py-1 rounded-full bg-red-50 text-red-700 text-[11px] font-black tracking-wider uppercase inline-block mb-3">${item.badge}</span>
                            <h4 class="text-base font-black text-slate-900 mb-2">${item.title}</h4>
                            <p class="text-xs text-slate-600 leading-relaxed mb-4 font-medium">${item.desc}</p>
                            <div class="text-[11px] font-bold text-slate-400 mb-4 flex items-center justify-between">
                                <span>📄 ${item.pages}</span>
                                <span>📥 ${item.downloadCount}</span>
                            </div>
                        </div>
                        <button onclick="window.print()" class="w-full py-2.5 bg-slate-900 hover:bg-red-600 text-white font-black text-xs uppercase rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
                            <i class="fa-solid fa-file-pdf"></i> PDF Görüntüle / Yazdır
                        </button>
                    </div>
                `).join("")}
            </div>
        `;
    } else if (subTab === "ders-sunumu") {
        return `
            <div class="mb-6 flex items-center justify-between">
                <h3 class="text-xl font-black text-slate-900 flex items-center gap-2">
                    <i class="fa-solid fa-file-powerpoint text-orange-600"></i> ${grade.number}. Sınıf Akıllı Tahta Ders Sunumları (PPTX / PDF)
                </h3>
                <span class="text-xs font-bold text-slate-500">${subData.dersSunumu.length} Sunum Dosyası</span>
            </div>
            ${renderCustomMaterialsSection(grade.number, "ders-sunumu")}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${subData.dersSunumu.map(item => `
                    <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <span class="px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-[11px] font-black tracking-wider uppercase inline-block mb-3">${item.badge}</span>
                            <h4 class="text-base font-black text-slate-900 mb-2">${item.title}</h4>
                            <p class="text-xs text-slate-600 leading-relaxed mb-4 font-medium">${item.desc}</p>
                            <div class="text-[11px] font-bold text-slate-400 mb-4 flex items-center justify-between">
                                <span>📊 ${item.slides}</span>
                                <span>🖥️ ${item.format}</span>
                            </div>
                        </div>
                        <button onclick="toggleSmartboardMode(true)" class="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md">
                            <i class="fa-solid fa-chalkboard-user"></i> Akıllı Tahtada Başlat
                        </button>
                    </div>
                `).join("")}
            </div>
        `;
    } else if (subTab === "videolar") {
        return `
            <div class="mb-6 flex items-center justify-between">
                <h3 class="text-xl font-black text-slate-900 flex items-center gap-2">
                    <i class="fa-solid fa-circle-play text-red-600"></i> ${grade.number}. Sınıf Konu Anlatımı & Deney Videoları
                </h3>
                <span class="text-xs font-bold text-slate-500">${subData.videolar.length} Video Ders</span>
            </div>
            ${renderCustomMaterialsSection(grade.number, "videolar")}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${subData.videolar.map(item => `
                    <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <div class="relative bg-slate-900 rounded-2xl h-36 flex items-center justify-center text-white mb-4 group cursor-pointer overflow-hidden" onclick="showToast('Video oynatıcı açılıyor...', 'info')">
                                <div class="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform">
                                    <i class="fa-solid fa-play ml-1"></i>
                                </div>
                                <span class="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-bold text-white">${item.duration}</span>
                            </div>
                            <h4 class="text-base font-black text-slate-900 mb-2">${item.title}</h4>
                            <p class="text-xs text-slate-600 leading-relaxed mb-4 font-medium">${item.desc}</p>
                            <div class="text-[11px] font-bold text-slate-400 mb-4 flex items-center justify-between">
                                <span>🎬 ${item.channel}</span>
                                <span>👁️ ${item.views}</span>
                            </div>
                        </div>
                        <button onclick="showToast('${item.title} oynatılıyor', 'success')" class="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md">
                            <i class="fa-solid fa-play"></i> Dersi İzle
                        </button>
                    </div>
                `).join("")}
            </div>
        `;
    } else if (subTab === "etkinlikler") {
        return `
            <div class="mb-6 flex items-center justify-between">
                <h3 class="text-xl font-black text-slate-900 flex items-center gap-2">
                    <i class="fa-solid fa-puzzle-piece text-emerald-600"></i> ${grade.number}. Sınıf Çalışma Föyleri & İstasyon Etkinlikleri
                </h3>
                <span class="text-xs font-bold text-slate-500">${subData.etkinlikler.length} Etkinlik Föyü</span>
            </div>
            ${renderCustomMaterialsSection(grade.number, "etkinlikler")}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${subData.etkinlikler.map(item => `
                    <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <span class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-black tracking-wider uppercase inline-block mb-3">${item.badge}</span>
                            <h4 class="text-base font-black text-slate-900 mb-2">${item.title}</h4>
                            <p class="text-xs text-slate-600 leading-relaxed mb-4 font-medium">${item.desc}</p>
                            <div class="text-[11px] font-bold text-slate-500 bg-slate-50 p-2.5 rounded-xl mb-4">
                                📌 ${item.type}
                            </div>
                        </div>
                        <button onclick="window.print()" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md">
                            <i class="fa-solid fa-print"></i> Etkinlik Föyünü Yazdır (A4)
                        </button>
                    </div>
                `).join("")}
            </div>
        `;
    } else if (subTab === "soru-bankasi") {
        return `
            <div class="mb-6 flex items-center justify-between">
                <h3 class="text-xl font-black text-slate-900 flex items-center gap-2">
                    <i class="fa-solid fa-book-open-reader text-blue-600"></i> ${grade.number}. Sınıf Kazanım & Beceri Temelli Soru Bankası
                </h3>
                <span class="text-xs font-bold text-slate-500">${subData.soruBankasi.length} Ünite Soru Havuzu</span>
            </div>
            ${renderCustomMaterialsSection(grade.number, "soru-bankasi")}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${subData.soruBankasi.map(item => `
                    <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <span class="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-black tracking-wider uppercase inline-block mb-3">${item.badge}</span>
                            <h4 class="text-base font-black text-slate-900 mb-2">${item.title}</h4>
                            <p class="text-xs text-slate-600 leading-relaxed mb-4 font-medium">${item.desc}</p>
                            <div class="text-[11px] font-bold text-slate-400 mb-4 flex items-center justify-between">
                                <span>📝 ${item.count}</span>
                                <span>🎯 ${item.difficulty}</span>
                            </div>
                        </div>
                        <a href="#quizzes" class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md">
                            <i class="fa-solid fa-circle-check"></i> Testi Çözmeye Başla
                        </a>
                    </div>
                `).join("")}
            </div>
        `;
    } else if (subTab === "denemeler") {
        return `
            <div class="mb-6 flex items-center justify-between">
                <h3 class="text-xl font-black text-slate-900 flex items-center gap-2">
                    <i class="fa-solid fa-bullseye text-purple-600"></i> ${grade.number}. Sınıf Dönemlik Ortak Sınav & Branş Denemeleri
                </h3>
                <span class="text-xs font-bold text-slate-500">${subData.denemeler.length} Deneme Sınavı</span>
            </div>
            ${renderCustomMaterialsSection(grade.number, "denemeler")}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${subData.denemeler.map(item => `
                    <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <span class="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-[11px] font-black tracking-wider uppercase inline-block mb-3">${item.type}</span>
                            <h4 class="text-lg font-black text-slate-900 mb-2">${item.title}</h4>
                            <div class="grid grid-cols-2 gap-3 my-4">
                                <div class="p-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-700">
                                    📋 Soru Sayısı: <span class="text-purple-700">${item.questions}</span>
                                </div>
                                <div class="p-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-700">
                                    ⏱️ Sınav Süresi: <span class="text-purple-700">${item.time}</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <a href="#exams" class="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase rounded-xl text-center transition-colors">
                                Denemeyi Başlat
                            </a>
                            <button onclick="window.print()" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors" title="PDF İndir">
                                <i class="fa-solid fa-download"></i>
                            </button>
                        </div>
                    </div>
                `).join("")}
            </div>
        `;
    } else if (subTab === "egitsel-oyunlar" || subTab === "oyunlar") {
        return `
            <div class="mb-6 flex items-center justify-between">
                <div>
                    <h3 class="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                        <i class="fa-solid fa-gamepad text-fuchsia-600"></i> ${grade.number}. Sınıf Eğitsel Oyunlar & İnteraktif Etkinlikler
                    </h3>
                    <p class="text-xs text-slate-500 font-medium mt-1">Eğlenerek öğrenmeyi sağlayan fen laboratuvar simülasyonları, eğitsel oyunlar ve bilgi yarışmaları.</p>
                </div>
                <button onclick="triggerUploadModal('${grade.number}', 'egitsel-oyunlar')" class="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-black text-xs uppercase rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-fuchsia-600/20">
                    <i class="fa-solid fa-plus"></i> Oyun Ekle
                </button>
            </div>

            ${renderCustomMaterialsSection(grade.number, "egitsel-oyunlar")}

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${subData.egitselOyunlar.map(item => `
                    <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <div class="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-md mb-4">
                                <i class="${item.icon}"></i>
                            </div>
                            <span class="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-black tracking-wider uppercase inline-block mb-3">${item.type}</span>
                            <h4 class="text-base font-black text-slate-900 mb-2">${item.title}</h4>
                            <p class="text-xs text-slate-600 leading-relaxed mb-6 font-medium">${item.desc}</p>
                        </div>
                        <button type="button" onclick="openInteractiveGameModal('${item.id}', '${item.title.replace(/'/g, "\'")}')" class="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs uppercase rounded-xl transition-all text-center shadow-md flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95">
                            <i class="fa-solid fa-gamepad text-sm"></i> <span>Oyunu Başlat (Oyna)</span>
                        </button>
                    </div>
                `).join("")}
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

            ${renderCustomMaterialsSection("all", "projeler")}
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
    const isAdmin = localStorage.getItem("rotali_is_admin") === "true";
    if (!isAdmin) {
        container.innerHTML = `
            <div class="max-w-md mx-auto px-4 py-20 text-center animate-in fade-in">
                <div class="w-16 h-16 rounded-3xl bg-red-100 text-brand-red flex items-center justify-center text-2xl mx-auto mb-4 shadow-sm">
                    <i class="fa-solid fa-lock"></i>
                </div>
                <h3 class="text-2xl font-black text-slate-900 mb-2">Yönetici Girişi Gerekli</h3>
                <p class="text-xs text-slate-500 font-medium mb-6">Bu alana erişmek için yönetici şifrenizle giriş yapmanız gerekmektedir.</p>
                <div class="flex gap-3 justify-center">
                    <button type="button" onclick="openAdminLoginModal(() => handleRouteChange())" class="px-6 py-3 bg-brand-red hover:bg-red-700 text-white font-black text-xs uppercase rounded-xl shadow-lg transition-all">
                        👑 Giriş Yap
                    </button>
                    <a href="#home" class="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs uppercase rounded-xl transition-all">
                        🏠 Ana Sayfa
                    </a>
                </div>
            </div>
        `;
        return;
    }
    let customList = [];
    try {
        customList = JSON.parse(localStorage.getItem("rotali_custom_materials") || "[]");
    } catch (e) {
        customList = [];
    }

    container.innerHTML = `
        <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <!-- Header -->
            <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 mb-8 shadow-xl relative overflow-hidden">
                <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div class="flex items-center gap-2 mb-3">
                            <span class="px-3.5 py-1 rounded-full bg-red-600 text-white text-xs font-black tracking-wider uppercase inline-block">
                                👑 YÖNETİCİ KONTROL MERKEZİ
                            </span>
                            <span class="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black">
                                Aktif Oturum: Yetkili
                            </span>
                        </div>
                        <h2 class="text-3xl sm:text-4xl font-black tracking-tight mb-2">Materyal & İçerik Yönetimi</h2>
                        <p class="text-xs sm:text-sm text-slate-300 font-medium">Sitedeki tüm sınıflara ait PDF, slayt seti, video, test ve oyunları buradan ekleyebilir, düzenleyebilir ve yönetebilirsiniz.</p>
                    </div>

                    <div class="flex flex-col sm:flex-row flex-wrap gap-2.5 w-full md:w-auto">
                        <button type="button" onclick="triggerUploadModal()" class="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 transform active:scale-95">
                            <i class="fa-solid fa-cloud-arrow-up text-base"></i> <span>+ Yeni İçerik Ekle</span>
                        </button>
                        <a href="#home" class="w-full sm:w-auto px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl border border-slate-700 transition-all flex items-center justify-center gap-2 shadow-sm">
                            <i class="fa-solid fa-house text-amber-400"></i> <span>Ana Sayfa</span>
                        </a>
                        <button type="button" onclick="handleAdminLogout()" class="w-full sm:w-auto px-5 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 active:scale-95">
                            <i class="fa-solid fa-power-off text-sm"></i> <span>Çıkış Yap</span>
                        </button>
                    </div>
                </div>
            </div>

            
            <!-- 📥 HIZLI İÇERİK EKLEME & SINIF SEÇİM ALANI (MOBİLDE VE MASAÜSTÜNDE ÇOK BELİRGİN) -->
            <div class="bg-gradient-to-br from-white to-slate-50 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-lg mb-8">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
                    <div>
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-[11px] uppercase tracking-wider mb-1">
                            <i class="fa-solid fa-cloud-arrow-up text-emerald-600"></i> İÇERİK EKLEME MERKEZİ
                        </div>
                        <h3 class="text-xl sm:text-2xl font-black text-slate-900">Sisteme Yeni Materyal veya Dosya Ekleyin</h3>
                        <p class="text-xs text-slate-500 font-medium mt-0.5">Aşağıdaki sınıf butonlarına tıklayarak doğrudan o sınıfın ilgili bölümüne dosya yükleyebilirsiniz.</p>
                    </div>
                    <button type="button" onclick="triggerUploadModal('8', 'ders-notu')" class="w-full md:w-auto px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 active:scale-95">
                        <i class="fa-solid fa-plus text-sm"></i>
                        <span>YENİ MATERYAL YÜKLE</span>
                    </button>
                </div>

                <!-- Hızlı Sınıf Butonları -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button type="button" onclick="triggerUploadModal('5', 'ders-notu')" class="p-4 bg-white hover:bg-emerald-50 border-2 border-emerald-200 hover:border-emerald-500 rounded-2xl text-left transition-all flex flex-col justify-between shadow-sm group">
                        <span class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">5</span>
                        <div>
                            <span class="text-xs font-black text-slate-900 block leading-tight">5. Sınıf</span>
                            <span class="text-[11px] text-emerald-700 font-bold">+ İçerik Ekle</span>
                        </div>
                    </button>

                    <button type="button" onclick="triggerUploadModal('6', 'ders-notu')" class="p-4 bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-500 rounded-2xl text-left transition-all flex flex-col justify-between shadow-sm group">
                        <span class="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">6</span>
                        <div>
                            <span class="text-xs font-black text-slate-900 block leading-tight">6. Sınıf</span>
                            <span class="text-[11px] text-blue-700 font-bold">+ İçerik Ekle</span>
                        </div>
                    </button>

                    <button type="button" onclick="triggerUploadModal('7', 'ders-notu')" class="p-4 bg-white hover:bg-amber-50 border-2 border-amber-200 hover:border-amber-500 rounded-2xl text-left transition-all flex flex-col justify-between shadow-sm group">
                        <span class="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 font-black text-xs flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">7</span>
                        <div>
                            <span class="text-xs font-black text-slate-900 block leading-tight">7. Sınıf</span>
                            <span class="text-[11px] text-amber-700 font-bold">+ İçerik Ekle</span>
                        </div>
                    </button>

                    <button type="button" onclick="triggerUploadModal('8', 'ders-notu')" class="p-4 bg-white hover:bg-red-50 border-2 border-red-200 hover:border-red-500 rounded-2xl text-left transition-all flex flex-col justify-between shadow-sm group">
                        <span class="w-8 h-8 rounded-xl bg-red-100 text-brand-red font-black text-xs flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">8</span>
                        <div>
                            <span class="text-xs font-black text-slate-900 block leading-tight">8. Sınıf (LGS)</span>
                            <span class="text-[11px] text-brand-red font-bold">+ İçerik Ekle</span>
                        </div>
                    </button>
                </div>
            </div>

            <!-- İstatistik Kartları -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                    <div class="text-2xl sm:text-3xl font-black text-slate-900 mb-1">${customList.length}</div>
                    <div class="text-xs font-bold text-slate-500 uppercase">Toplam Eklenen Materyal</div>
                </div>
                <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                    <div class="text-2xl sm:text-3xl font-black text-red-600 mb-1">${customList.filter(i => i.grade === "8").length}</div>
                    <div class="text-xs font-bold text-slate-500 uppercase">8. Sınıf & LGS</div>
                </div>
                <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                    <div class="text-2xl sm:text-3xl font-black text-amber-500 mb-1">${customList.filter(i => i.grade === "7").length}</div>
                    <div class="text-xs font-bold text-slate-500 uppercase">7. Sınıf</div>
                </div>
                <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                    <div class="text-2xl sm:text-3xl font-black text-blue-600 mb-1">${customList.filter(i => i.grade === "6" || i.grade === "5").length}</div>
                    <div class="text-xs font-bold text-slate-500 uppercase">5 & 6. Sınıf</div>
                </div>
            </div>

            <!-- Yönetici Hızlı Çıkış ve Ana Sayfa Butonları -->
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-xl font-black">
                        <i class="fa-solid fa-user-shield"></i>
                    </div>
                    <div>
                        <h4 class="text-base font-black text-slate-900">Yönetici Oturumu</h4>
                        <p class="text-xs text-slate-500">İşiniz bittiğinde oturumu kapatmayı unutmayınız.</p>
                    </div>
                </div>
                <div class="flex items-center gap-3 w-full sm:w-auto">
                    <a href="#home" class="flex-1 sm:flex-none px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs uppercase tracking-wider rounded-2xl transition-all text-center">
                        <i class="fa-solid fa-house mr-1"></i> Ana Sayfaya Dön
                    </a>
                    <button type="button" onclick="handleAdminLogout()" class="flex-1 sm:flex-none px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-red-600/30 transition-all text-center">
                        <i class="fa-solid fa-power-off mr-1"></i> Yönetici Çıkışı Yap
                    </button>
                </div>
            </div>

            <!-- 🛠️ GELEN HATA & EKSİK BİLDİRİMLERİ (YÖNETİCİYE ÖZEL) -->
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8">
                <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <div>
                        <h3 class="text-xl font-black text-slate-900 flex items-center gap-2">
                            <i class="fa-solid fa-bug text-red-600"></i> Gelen Hata & Eksik Bildirimleri (${JSON.parse(localStorage.getItem("rotali_issue_reports") || "[]").length})
                        </h3>
                        <p class="text-xs text-slate-500 mt-0.5">Ziyaretçiler tarafından bildirilen sorunlu bölümler, alt modüller ve hata türleri.</p>
                    </div>
                </div>

                ${JSON.parse(localStorage.getItem("rotali_issue_reports") || "[]").length === 0 ? `
                    <div class="text-center py-8 text-xs font-bold text-slate-400">
                        <i class="fa-solid fa-circle-check text-emerald-500 text-lg mb-1 block"></i>
                        Harika! Şu anda bildirilmiş hiçbir hata veya eksik bulunmuyor.
                    </div>
                ` : `
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="bg-slate-50 text-slate-500 font-black uppercase tracking-wider border-b border-slate-200">
                                    <th class="p-3">Tarih</th>
                                    <th class="p-3">İlgili Bölüm</th>
                                    <th class="p-3">Sorunlu Alt Başlık</th>
                                    <th class="p-3">Sorun Türü</th>
                                    <th class="p-3">Durum</th>
                                    <th class="p-3 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
                                ${JSON.parse(localStorage.getItem("rotali_issue_reports") || "[]").map(item => `
                                    <tr class="hover:bg-slate-50/80 transition-colors">
                                        <td class="p-3 text-slate-400 font-bold whitespace-nowrap">${item.createdAt}</td>
                                        <td class="p-3 font-bold text-slate-900">${item.section || item.grade || 'Genel'}</td>
                                        <td class="p-3 font-semibold text-slate-700">${item.subModule || 'Genel'}</td>
                                        <td class="p-3">
                                            <span class="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-[10px] font-black uppercase border border-red-200 inline-block">
                                                ${item.type}
                                            </span>
                                        </td>
                                        <td class="p-3 whitespace-nowrap">
                                            <span class="px-2.5 py-1 rounded-full text-[10px] font-black ${item.status === 'Çözüldü' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                                                ${item.status || 'Beklemede'}
                                            </span>
                                        </td>
                                        <td class="p-3 text-right whitespace-nowrap space-x-1.5">
                                            <button onclick="markIssueResolved('${item.id}')" class="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-xl text-[11px] font-bold border border-emerald-200 transition-colors" title="Çözüldü Olarak İşaretle">
                                                <i class="fa-solid fa-check"></i>
                                            </button>
                                            <button onclick="deleteIssueReport('${item.id}')" class="px-3 py-1.5 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white rounded-xl text-[11px] font-bold border border-rose-200 transition-colors" title="Bildirimi Sil">
                                                <i class="fa-solid fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </div>
                `}
            </div>

            <!-- Canlı Materyal Listesi -->
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
                <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                    <div>
                        <h3 class="text-xl font-black text-slate-900">Yayınlanan Materyal Envanteri</h3>
                        <p class="text-xs text-slate-500 mt-0.5">Tüm sınıflarda ve sekmelerde canlı olarak yayında olan içerikleriniz.</p>
                    </div>
                    <button onclick="triggerUploadModal()" class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase rounded-xl transition-all flex items-center gap-1.5">
                        <i class="fa-solid fa-plus"></i> İçerik Ekle
                    </button>
                </div>

                ${customList.length === 0 ? `
                    <div class="text-center py-16 px-4">
                        <div class="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mx-auto mb-4">
                            <i class="fa-solid fa-box-open"></i>
                        </div>
                        <h4 class="text-base font-black text-slate-800 mb-1">Henüz özel materyal yüklenmedi</h4>
                        <p class="text-xs text-slate-500 max-w-md mx-auto mb-6">Yukarıdaki "Yeni Materyal Yükle" butonuna tıklayarak ilk PDF, sunum veya video dersinizi anında siteye yükleyebilirsiniz.</p>
                        <button onclick="triggerUploadModal()" class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase rounded-xl shadow-md transition-all">
                            İlk Materyali Ekle
                        </button>
                    </div>
                ` : `
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="bg-slate-50 text-slate-500 font-black uppercase tracking-wider border-b border-slate-200">
                                    <th class="p-3.5 rounded-l-xl">Sınıf & Kategori</th>
                                    <th class="p-3.5">Materyal Başlığı</th>
                                    <th class="p-3.5">İlişkili Ünite</th>
                                    <th class="p-3.5">Format / Dosya</th>
                                    <th class="p-3.5">Eklenme Tarihi</th>
                                    <th class="p-3.5 text-right rounded-r-xl">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
                                ${customList.map(item => `
                                    <tr class="hover:bg-slate-50/80 transition-colors">
                                        <td class="p-3.5 font-bold">
                                            <span class="px-2.5 py-1 rounded-lg ${item.grade === '8' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-700'} font-black text-[11px]">
                                                ${item.grade === 'all' ? 'Genel' : item.grade + '. Sınıf'}
                                            </span>
                                            <span class="block text-[10px] text-slate-400 mt-1 uppercase font-bold">${item.category}</span>
                                        </td>
                                        <td class="p-3.5">
                                            <div class="font-black text-slate-900 text-sm leading-snug">${item.title}</div>
                                            <div class="text-[11px] text-slate-500 line-clamp-1 mt-0.5">${item.desc || ''}</div>
                                        </td>
                                        <td class="p-3.5 text-slate-600 text-[11px] max-w-xs truncate">${item.unit || '-'}</td>
                                        <td class="p-3.5 font-bold">
                                            <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase border border-emerald-200">
                                                ${item.format || 'PDF'}
                                            </span>
                                        </td>
                                        <td class="p-3.5 text-slate-400 text-[11px]">${item.createdAt || 'Bugün'}</td>
                                        <td class="p-3.5 text-right">
                                            <div class="flex items-center justify-end gap-1.5">
                                                <button onclick="openOrDownloadMaterial('${item.id}', '${item.fileUrl || '#'}', '${(item.fileName || 'materyal.pdf').replace(/'/g, "\'")}')" class="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-all" title="Görüntüle / İndir">
                                                    <i class="fa-solid fa-eye"></i>
                                                </button>
                                                <button onclick="editCustomMaterial('${item.id}')" class="p-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition-all" title="Düzenle">
                                                    <i class="fa-solid fa-pen-to-square"></i>
                                                </button>
                                                <button onclick="deleteCustomMaterial('${item.id}')" class="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition-all" title="Sil">
                                                    <i class="fa-solid fa-trash-can"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </div>
                `}
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
// 11. 🔍 PORTAL GENEL ARAMA (AKILLI & KAPSAMLI ARAMA MOTORU)
// -------------------------------------------------------------
function normalizeTurkishSearch(text) {
    if (!text) return "";
    return String(text)
        .replace(/İ/g, "i")
        .replace(/I/g, "ı")
        .toLowerCase()
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function getPortalSearchIndex() {
    const index = [];

    // 1. Üniteler ve Konular (PORTAL_GRADES & UNIT_HUBS)
    if (typeof PORTAL_GRADES !== "undefined" && Array.isArray(PORTAL_GRADES)) {
        PORTAL_GRADES.forEach(g => {
            if (g.units && Array.isArray(g.units)) {
                g.units.forEach(u => {
                    index.push({
                        id: `unit-${u.id}`,
                        title: `${g.number}. Sınıf — ${u.name}`,
                        category: "Ünite & Konu Hub'ı",
                        categoryKey: "uniteler",
                        grade: `${g.number}. Sınıf`,
                        gradeNumber: g.number,
                        unit: u.name,
                        description: u.description || `${g.number}. Sınıf Fen Bilimleri ${u.name} ünitesi detaylı konu anlatımları, kazanımlar ve etkileşimli içerikler.`,
                        keywords: `${u.code || ''} ${g.title} fen bilimleri meb mufredat unitesi konulari`,
                        icon: u.icon || "fa-solid fa-atom",
                        iconBg: "bg-blue-600",
                        url: `#unit/${u.id}`
                    });
                });
            }
        });
    }

    // 2. Sınıf Alt Modülleri (Ders Notu, Sunum, Video, Etkinlik, Soru Bankası, Deneme, Eğitsel Oyun, Bilim İnsanları)
    [5, 6, 7, 8].forEach(gNum => {
        const gradeTitle = gNum === 8 ? "8. Sınıf (LGS)" : `${gNum}. Sınıf`;
        const subData = (typeof getGradeSubSectionsData === "function") ? getGradeSubSectionsData(gNum) : null;
        
        if (subData) {
            // Ders Notları
            if (subData.dersNotlari && Array.isArray(subData.dersNotlari)) {
                subData.dersNotlari.forEach((item, idx) => {
                    index.push({
                        id: `not-${gNum}-${idx}`,
                        title: item.title,
                        category: "Ders Notu",
                        categoryKey: "ders-notu",
                        grade: gradeTitle,
                        gradeNumber: gNum,
                        unit: item.unit || "",
                        description: item.desc || `${gradeTitle} ${item.unit || ''} detaylı konu özeti, kavram haritaları ve PDF çalışma föyü.`,
                        keywords: `ders notu pdf foy ozet konu kavrami ${item.size || ''} ${item.format || ''}`,
                        icon: "fa-solid fa-file-lines",
                        iconBg: "bg-blue-600",
                        url: `#grade/grade-${gNum}/ders-notu`
                    });
                });
            }

            // Ders Sunumları
            if (subData.sunumlar && Array.isArray(subData.sunumlar)) {
                subData.sunumlar.forEach((item, idx) => {
                    index.push({
                        id: `sunum-${gNum}-${idx}`,
                        title: item.title,
                        category: "Ders Sunumu",
                        categoryKey: "ders-sunumu",
                        grade: gradeTitle,
                        gradeNumber: gNum,
                        unit: item.unit || "",
                        description: item.desc || `${gradeTitle} ${item.unit || ''} akıllı tahta uyumlu interaktif slayt ve sunum seti.`,
                        keywords: `slayt sunum ppt akilli tahta gorsel anlatim ${item.slides || ''}`,
                        icon: "fa-solid fa-file-powerpoint",
                        iconBg: "bg-orange-600",
                        url: `#grade/grade-${gNum}/ders-sunumu`
                    });
                });
            }

            // Videolar
            if (subData.videolar && Array.isArray(subData.videolar)) {
                subData.videolar.forEach((item, idx) => {
                    index.push({
                        id: `video-${gNum}-${idx}`,
                        title: item.title,
                        category: "Video Anlatım",
                        categoryKey: "videolar",
                        grade: gradeTitle,
                        gradeNumber: gNum,
                        unit: item.unit || "",
                        description: item.desc || `${gradeTitle} ${item.unit || ''} konu anlatım ve deney videosu.`,
                        keywords: `video deney gorsel anlatim hoca ${item.duration || ''} ${item.teacher || ''}`,
                        icon: "fa-solid fa-circle-play",
                        iconBg: "bg-rose-600",
                        url: `#grade/grade-${gNum}/videolar`
                    });
                });
            }

            // Etkinlikler
            if (subData.etkinlikler && Array.isArray(subData.etkinlikler)) {
                subData.etkinlikler.forEach((item, idx) => {
                    index.push({
                        id: `etkinlik-${gNum}-${idx}`,
                        title: item.title,
                        category: "Etkinlik & Çalışma Föyü",
                        categoryKey: "etkinlikler",
                        grade: gradeTitle,
                        gradeNumber: gNum,
                        unit: item.unit || "",
                        description: item.desc || `${gradeTitle} ${item.unit || ''} sınıf içi istasyon çalışması ve etkinlik föyü.`,
                        keywords: `etkinlik calisma foyi istasyon bosluk doldurma eslestirme`,
                        icon: "fa-solid fa-puzzle-piece",
                        iconBg: "bg-emerald-600",
                        url: `#grade/grade-${gNum}/etkinlikler`
                    });
                });
            }

            // Soru Bankası
            if (subData.soruBankasi && Array.isArray(subData.soruBankasi)) {
                subData.soruBankasi.forEach((item, idx) => {
                    index.push({
                        id: `soru-${gNum}-${idx}`,
                        title: item.title,
                        category: "Soru Bankası & Test",
                        categoryKey: "soru-bankasi",
                        grade: gradeTitle,
                        gradeNumber: gNum,
                        unit: item.unit || "",
                        description: item.desc || `${gradeTitle} ${item.unit || ''} MEB kazanım kavrama ve yeni nesil soru bankası testi.`,
                        keywords: `test soru bankasi meb yeni nesil kazanim ${item.difficulty || ''} ${item.questions || ''}`,
                        icon: "fa-solid fa-book-open-reader",
                        iconBg: "bg-indigo-600",
                        url: `#grade/grade-${gNum}/soru-bankasi`
                    });
                });
            }

            // Denemeler
            if (subData.denemeler && Array.isArray(subData.denemeler)) {
                subData.denemeler.forEach((item, idx) => {
                    index.push({
                        id: `deneme-${gNum}-${idx}`,
                        title: item.title,
                        category: "Deneme Sınavı",
                        categoryKey: "denemeler",
                        grade: gradeTitle,
                        gradeNumber: gNum,
                        unit: item.scope || item.unit || "",
                        description: item.desc || `${gradeTitle} branş deneme sınavı ve ölçme değerlendirme testi.`,
                        keywords: `deneme sinav lgs brans sinavi soru cozumu ${item.time || ''}`,
                        icon: "fa-solid fa-bullseye",
                        iconBg: "bg-purple-600",
                        url: `#grade/grade-${gNum}/denemeler`
                    });
                });
            }

            // Eğitsel Oyunlar
            if (subData.egitselOyunlar && Array.isArray(subData.egitselOyunlar)) {
                subData.egitselOyunlar.forEach((item, idx) => {
                    index.push({
                        id: `oyun-${gNum}-${idx}`,
                        title: item.title,
                        category: "Eğitsel Oyun & Simülasyon",
                        categoryKey: "egitsel-oyunlar",
                        grade: gradeTitle,
                        gradeNumber: gNum,
                        unit: item.unit || "",
                        description: item.desc || `${gradeTitle} ${item.unit || ''} interaktif fen oyunu, passaparola ve 3D simülasyon.`,
                        keywords: `oyun egitsel oyun passaparola simulasyon 3d interaktif cark labirent yarisma laboratuvar`,
                        icon: "fa-solid fa-gamepad",
                        iconBg: "bg-amber-500",
                        url: `#grade/grade-${gNum}/egitsel-oyunlar`
                    });
                });
            }
        }
    });

    // 3. Bilimin Rotasını Çizenler (SCIENTISTS_DATA)
    if (typeof SCIENTISTS_DATA !== "undefined") {
        Object.keys(SCIENTISTS_DATA).forEach(key => {
            const sc = SCIENTISTS_DATA[key];
            index.push({
                id: `scientist-${key}`,
                title: `${sc.name} (${sc.title})`,
                category: "Bilimin Rotasını Çizenler",
                categoryKey: "bilim-insani",
                grade: sc.grade || "Tüm Sınıflar",
                gradeNumber: 0,
                unit: sc.era || "Bilim Tarihi",
                description: `${sc.discovery || ''} — ${sc.bio ? sc.bio.substring(0, 160) + '...' : ''}`,
                keywords: `bilim insani mucit kesif icat galileo einstein aziz sancar newton mendel arsimet tesla curie pasteur darwin ali kuscu ${sc.keywords ? sc.keywords.join(' ') : ''}`,
                icon: "fa-solid fa-user-astronaut",
                iconBg: "bg-violet-600",
                url: `#grade/grade-7/bilimin-rotasini-cizenler`,
                action: `openScientistModal('${key}')`
            });
        });
    }

    // 4. Kritik Konu Özetleri ve Sınav İpuçları (ENRICHED_GRADE_CONTENT)
    if (typeof ENRICHED_GRADE_CONTENT !== "undefined") {
        Object.keys(ENRICHED_GRADE_CONTENT).forEach(gKey => {
            const gNum = parseInt(gKey);
            const gradeTitle = gNum === 8 ? "8. Sınıf (LGS)" : `${gNum}. Sınıf`;
            const content = ENRICHED_GRADE_CONTENT[gKey];
            if (content && content.unitSummaries && Array.isArray(content.unitSummaries)) {
                content.unitSummaries.forEach((us, uIdx) => {
                    const cleanHighlights = us.highlights ? us.highlights.map(h => h.replace(/<[^>]*>?/gm, '').replace(/[*_#]/g, '')).join(' ') : '';
                    index.push({
                        id: `summary-${gKey}-${uIdx}`,
                        title: `${gradeTitle}: ${us.unit} (Özet & Kritik Noktalar)`,
                        category: "Kritik Konu Özeti",
                        categoryKey: "ders-notu",
                        grade: gradeTitle,
                        gradeNumber: gNum,
                        unit: us.unit,
                        description: cleanHighlights.substring(0, 180) + '...',
                        keywords: `ozet kritik noktalar formuller tuzak sorular puf noktalari ${cleanHighlights}`,
                        icon: "fa-solid fa-lightbulb",
                        iconBg: "bg-amber-600",
                        url: `#grade/grade-${gKey}/ders-notu`
                    });
                });
            }
        });
    }

    // 5. Yazılı Sınav Merkezi (EXAM_CENTER_DATA)
    if (typeof EXAM_CENTER_DATA !== "undefined") {
        Object.keys(EXAM_CENTER_DATA).forEach(k => {
            const exam = EXAM_CENTER_DATA[k];
            index.push({
                id: `yazili-${k}`,
                title: exam.title || "MEB Ortak Yazılı Sınav Hazırlığı",
                category: "Yazılı Sınav & Örnek Sorular",
                categoryKey: "yazili",
                grade: exam.grade || "Tüm Sınıflar",
                gradeNumber: 0,
                unit: exam.term || "1. ve 2. Dönem Ortak Sınavlar",
                description: exam.desc || "Bakanlık ortak sınav senaryolarına tam uyumlu açık uçlu soru kağıtları ve cevap anahtarları.",
                keywords: "yazili sinav meb acik uclu ortak sinav senaryolari puanlama rubrigi calisma kagidi",
                icon: "fa-solid fa-pen-nib",
                iconBg: "bg-red-600",
                url: `#exam-center`
            });
        });
    }

    // 6. Proje ve STEM Merkezi (PROJECT_CENTER_DATA)
    if (typeof PROJECT_CENTER_DATA !== "undefined" && Array.isArray(PROJECT_CENTER_DATA)) {
        PROJECT_CENTER_DATA.forEach((proj, idx) => {
            index.push({
                id: `proj-${idx}`,
                title: proj.title || "TÜBİTAK 2204-B Projesi",
                category: "Proje & STEM",
                categoryKey: "projeler",
                grade: proj.grade || "5-8. Sınıflar",
                gradeNumber: 0,
                unit: proj.category || "TÜBİTAK & STEM",
                description: proj.desc || "Ortaokul araştırma projeleri, STEM etkinlikleri ve bilim fuarı rehberi.",
                keywords: "tubitak 2204 stem robotik kodlama bilim fuari arastirma projesi",
                icon: "fa-solid fa-trophy",
                iconBg: "bg-amber-500",
                url: `#projects`
            });
        });
    }

    // 7. Mini Testler & Quizler (DEFAULT_QUIZZES)
    if (typeof DEFAULT_QUIZZES !== "undefined" && Array.isArray(DEFAULT_QUIZZES)) {
        DEFAULT_QUIZZES.forEach((q, idx) => {
            index.push({
                id: `quiz-${idx}`,
                title: q.title || "İnteraktif Fen Testi",
                category: "Mini Quiz & Test",
                categoryKey: "quizler",
                grade: q.grade || "Tüm Sınıflar",
                gradeNumber: 0,
                unit: q.unit || "Kazanım Pekiştirme",
                description: `${q.questions ? q.questions.length : 0} soruluk anında geri bildirimli interaktif pekiştirme testi.`,
                keywords: "quiz test mini test interaktif soru cozumu",
                icon: "fa-solid fa-brain",
                iconBg: "bg-purple-600",
                url: `#quizzes`
            });
        });
    }

    // 8. 3D Bilgi Kartları (DEFAULT_FLASHCARDS)
    if (typeof DEFAULT_FLASHCARDS !== "undefined" && Array.isArray(DEFAULT_FLASHCARDS)) {
        DEFAULT_FLASHCARDS.forEach((fc, idx) => {
            index.push({
                id: `flashcard-${idx}`,
                title: `${fc.unit || 'Bilgi Kartı'}: ${fc.question || ''}`,
                category: "3D Bilgi Kartı",
                categoryKey: "quizler",
                grade: "Tüm Sınıflar",
                gradeNumber: 0,
                unit: fc.unit || "Önemli Kavramlar",
                description: `Cevap: ${fc.answer || ''}`,
                keywords: "bilgi karti flashcard hafiza teknikleri kavram soru cevap",
                icon: "fa-solid fa-layer-group",
                iconBg: "bg-teal-600",
                url: `#flashcards`
            });
        });
    }

    // 9. Kullanıcı / Öğretmen Tarafından Yüklenen Materyaller (rotali_materials)
    try {
        const customMats = JSON.parse(localStorage.getItem("rotali_materials") || "[]");
        if (Array.isArray(customMats)) {
            customMats.forEach(m => {
                index.push({
                    id: `custom-${m.id}`,
                    title: m.title || "Yüklenen Materyal",
                    category: m.category || "Özel Materyal",
                    categoryKey: "ozel",
                    grade: m.grade ? `${m.grade}. Sınıf` : "Genel",
                    gradeNumber: parseInt(m.grade) || 0,
                    unit: m.unit || "",
                    description: m.description || "Öğretmen tarafından portala yeni eklenen materyal.",
                    keywords: `yuklenen materyal ozel dosya ogretmen ${m.title} ${m.description}`,
                    icon: "fa-solid fa-file",
                    iconBg: "bg-emerald-600",
                    url: m.grade ? `#grade/grade-${m.grade}` : `#home`
                });
            });
        }
    } catch(e) {}

    // Pre-calculate normalized search blob for ultra high performance
    index.forEach(item => {
        item._normalizedBlob = normalizeTurkishSearch(`${item.title} ${item.category} ${item.grade} ${item.unit} ${item.description} ${item.keywords}`);
    });

    return index;
}

window.portalSearchFilters = {
    category: "all",
    grade: "all"
};

function renderSearchPage(container) {
    window.portalSearchFilters = { category: "all", grade: "all" };

    container.innerHTML = `
        <div class="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
            <!-- Başlık Alanı -->
            <div class="text-center mb-8">
                <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 text-brand-red font-black text-xs uppercase tracking-wider mb-3">
                    <i class="fa-solid fa-magnifying-glass"></i> DİJİTAL FEN ARAMA MOTORU
                </div>
                <h2 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">🔍 Portal Genel Arama</h2>
                <p class="text-xs sm:text-sm text-slate-500 font-medium max-w-xl mx-auto">
                    Tüm sınıflar (5, 6, 7, 8), ders notları, sunumlar, deneyler, sorular, denemeler, eğitsel oyunlar ve bilim insanları içerisinde anında arama yapın.
                </p>
            </div>

            <!-- Arama Kutusu -->
            <div class="bg-white p-3 sm:p-4 rounded-3xl shadow-xl border-2 border-slate-200 focus-within:border-brand-red focus-within:ring-4 focus-within:ring-red-100 transition-all mb-6 relative">
                <div class="flex items-center gap-3">
                    <div class="w-11 h-11 rounded-2xl bg-red-50 flex items-center justify-center text-brand-red flex-shrink-0 text-lg">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <input type="text" id="portal-search-input" oninput="handlePortalSearch(this.value)" placeholder="Örn: Hücre, Mevsimler, Sıvı Basıncı, Galileo, Slayt, Deneme Sınavı, Passaparola..." class="w-full py-2.5 px-1 text-sm sm:text-base text-slate-900 font-bold focus:outline-none placeholder-slate-400 bg-transparent" autofocus>
                    <button type="button" onclick="clearPortalSearch()" id="clear-search-btn" class="hidden w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 items-center justify-center flex-shrink-0 text-xs transition-colors" title="Temizle">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>

            <!-- Popüler Arama Çipleri -->
            <div class="mb-6 flex items-center gap-2 flex-wrap">
                <span class="text-xs font-black text-slate-400 uppercase tracking-wider mr-1">🔥 Popüler:</span>
                <button type="button" onclick="fillSearchInput('Hücre')" class="px-3 py-1 bg-slate-100 hover:bg-red-50 hover:text-brand-red text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all">🧬 Hücre</button>
                <button type="button" onclick="fillSearchInput('Mevsimler ve İklim')" class="px-3 py-1 bg-slate-100 hover:bg-red-50 hover:text-brand-red text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all">🌍 Mevsimler</button>
                <button type="button" onclick="fillSearchInput('Sıvı Basıncı')" class="px-3 py-1 bg-slate-100 hover:bg-red-50 hover:text-brand-red text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all">💧 Basınç</button>
                <button type="button" onclick="fillSearchInput('Galileo Galilei')" class="px-3 py-1 bg-slate-100 hover:bg-red-50 hover:text-brand-red text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all">🔭 Galileo</button>
                <button type="button" onclick="fillSearchInput('Aziz Sancar')" class="px-3 py-1 bg-slate-100 hover:bg-red-50 hover:text-brand-red text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all">🇹🇷 Aziz Sancar</button>
                <button type="button" onclick="fillSearchInput('Passaparola')" class="px-3 py-1 bg-slate-100 hover:bg-red-50 hover:text-brand-red text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all">🎮 Passaparola</button>
                <button type="button" onclick="fillSearchInput('LGS Deneme')" class="px-3 py-1 bg-slate-100 hover:bg-red-50 hover:text-brand-red text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all">🎯 LGS Denemesi</button>
                <button type="button" onclick="fillSearchInput('Ders Sunumu')" class="px-3 py-1 bg-slate-100 hover:bg-red-50 hover:text-brand-red text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all">📊 Ders Sunumları</button>
                <button type="button" onclick="fillSearchInput('Ortak Yazılı')" class="px-3 py-1 bg-slate-100 hover:bg-red-50 hover:text-brand-red text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all">✏️ Ortak Sınav</button>
            </div>

            <!-- Filtre Barı (Sınıf & Kategori) -->
            <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <!-- Sınıf Filtresi -->
                <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="text-xs font-black text-slate-400 uppercase tracking-wider mr-1">Sınıf:</span>
                    <button type="button" onclick="setSearchGrade('all')" class="search-grade-btn px-3 py-1.5 rounded-xl text-xs font-black transition-all bg-slate-900 text-white shadow-sm" data-grade="all">Tümü</button>
                    <button type="button" onclick="setSearchGrade('5')" class="search-grade-btn px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700" data-grade="5">5. Sınıf</button>
                    <button type="button" onclick="setSearchGrade('6')" class="search-grade-btn px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700" data-grade="6">6. Sınıf</button>
                    <button type="button" onclick="setSearchGrade('7')" class="search-grade-btn px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-slate-100 text-slate-700 hover:bg-amber-50 hover:text-amber-700" data-grade="7">7. Sınıf</button>
                    <button type="button" onclick="setSearchGrade('8')" class="search-grade-btn px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-brand-red" data-grade="8">8. Sınıf (LGS)</button>
                </div>

                <!-- Sonuç Sayacı -->
                <div id="search-count-badge" class="text-xs font-black text-slate-500 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200">
                    Hazır • Arama yapın
                </div>
            </div>

            <!-- Sonuç Listesi Kutusu -->
            <div id="search-results-box" class="space-y-3">
                <div class="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
                    <div class="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400 text-2xl mx-auto mb-3">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <h3 class="text-base font-black text-slate-800 mb-1">Aramak istediğiniz konuyu veya terimi yazın</h3>
                    <p class="text-xs text-slate-400 font-medium">Örnek: "hücre", "lgs deneme", "galileo", "kuvvet", "ışık", "slayt"</p>
                </div>
            </div>
        </div>
    `;

    // Varsayılan tüm içerikleri bir kez derle
    window._portalSearchCache = getPortalSearchIndex();
}

function fillSearchInput(term) {
    const input = document.getElementById("portal-search-input");
    if (input) {
        input.value = term;
        handlePortalSearch(term);
        input.focus();
    }
}

function clearPortalSearch() {
    const input = document.getElementById("portal-search-input");
    if (input) {
        input.value = "";
        handlePortalSearch("");
        input.focus();
    }
}

function setSearchGrade(grade) {
    window.portalSearchFilters.grade = grade;
    document.querySelectorAll(".search-grade-btn").forEach(btn => {
        if (btn.dataset.grade === grade) {
            btn.className = "search-grade-btn px-3 py-1.5 rounded-xl text-xs font-black transition-all bg-slate-900 text-white shadow-sm";
        } else {
            btn.className = "search-grade-btn px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-slate-100 text-slate-700 hover:bg-slate-200";
        }
    });

    const input = document.getElementById("portal-search-input");
    handlePortalSearch(input ? input.value : "");
}

function highlightSearchTerms(text, query) {
    if (!query || !text) return text || "";
    const words = query.trim().split(/\s+/).filter(w => w.length > 0);
    let result = String(text);
    words.forEach(word => {
        const regex = new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi");
        result = result.replace(regex, `<mark class="bg-amber-200 text-slate-900 font-bold px-1 rounded">$1</mark>`);
    });
    return result;
}

function handlePortalSearch(query) {
    const box = document.getElementById("search-results-box");
    const countBadge = document.getElementById("search-count-badge");
    const clearBtn = document.getElementById("clear-search-btn");
    if (!box) return;

    if (clearBtn) {
        if (query && query.trim().length > 0) {
            clearBtn.classList.remove("hidden");
            clearBtn.classList.add("flex");
        } else {
            clearBtn.classList.add("hidden");
            clearBtn.classList.remove("flex");
        }
    }

    if (!query || query.trim().length < 2) {
        if (countBadge) countBadge.innerHTML = `Hazır • Arama yapın`;
        box.innerHTML = `
            <div class="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
                <div class="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400 text-2xl mx-auto mb-3">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </div>
                <h3 class="text-base font-black text-slate-800 mb-1">Aramak istediğiniz konuyu veya terimi yazın</h3>
                <p class="text-xs text-slate-400 font-medium">Örnek: "hücre", "lgs deneme", "galileo", "kuvvet", "ışık", "slayt"</p>
            </div>
        `;
        return;
    }

    if (!window._portalSearchCache || window._portalSearchCache.length === 0) {
        window._portalSearchCache = getPortalSearchIndex();
    }

    const normQuery = normalizeTurkishSearch(query);
    const tokens = normQuery.split(" ").filter(t => t.length > 0);
    const selectedGrade = window.portalSearchFilters.grade;

    let matches = [];

    window._portalSearchCache.forEach(item => {
        // Sınıf filtre kontrolü
        if (selectedGrade !== "all") {
            const reqNum = parseInt(selectedGrade);
            if (item.gradeNumber !== reqNum && item.gradeNumber !== 0) {
                return;
            }
        }

        // Token eşleşme puanlaması
        let score = 0;
        let matchedTokens = 0;

        tokens.forEach(tok => {
            if (item._normalizedBlob.includes(tok)) {
                matchedTokens++;
                // Başlıkta tam eşleşme
                if (normalizeTurkishSearch(item.title).includes(tok)) score += 50;
                // Kategori eşleşmesi
                if (normalizeTurkishSearch(item.category).includes(tok)) score += 30;
                // Ünite eşleşmesi
                if (normalizeTurkishSearch(item.unit).includes(tok)) score += 25;
                // Açıklama eşleşmesi
                if (normalizeTurkishSearch(item.description).includes(tok)) score += 10;
                // Anahtar kelime eşleşmesi
                if (normalizeTurkishSearch(item.keywords).includes(tok)) score += 15;
            }
        });

        // En az 1 token uyuşmalı (tüm tokenlar uyuşuyorsa ekstra bonus)
        if (matchedTokens > 0) {
            if (matchedTokens === tokens.length) score += 100;
            matches.push({ item, score });
        }
    });

    // Puan sırasına göre sırala
    matches.sort((a, b) => b.score - a.score);

    if (matches.length === 0) {
        if (countBadge) countBadge.innerHTML = `<span class="text-rose-600 font-bold">0 sonuç</span>`;
        box.innerHTML = `
            <div class="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
                <div class="w-16 h-16 rounded-3xl bg-rose-50 flex items-center justify-center text-rose-500 text-2xl mx-auto mb-3">
                    <i class="fa-solid fa-circle-exclamation"></i>
                </div>
                <h3 class="text-base font-black text-slate-800 mb-1">"${query}" ile eşleşen sonuç bulunamadı</h3>
                <p class="text-xs text-slate-500 font-medium">Lütfen farklı kelimelerle arama yapmayı veya filtreleri sıfırlamayı deneyin.</p>
            </div>
        `;
        return;
    }

    if (countBadge) {
        countBadge.innerHTML = `<span class="text-emerald-700 font-black">🎉 ${matches.length} içerik bulundu</span>`;
    }

    box.innerHTML = matches.map(({ item }) => {
        const highlightedTitle = highlightSearchTerms(item.title, query);
        const highlightedDesc = highlightSearchTerms(item.description, query);
        const clickAction = item.action ? `onclick="${item.action}"` : '';

        return `
            <div class="p-4 sm:p-5 bg-white border border-slate-200 hover:border-red-400 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                <div class="flex items-start gap-3.5">
                    <div class="w-12 h-12 rounded-2xl ${item.iconBg || 'bg-blue-600'} text-white flex items-center justify-center text-xl flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                        <i class="${item.icon || 'fa-solid fa-file'}"></i>
                    </div>
                    <div>
                        <!-- Etiketler -->
                        <div class="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span class="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-black text-[11px] uppercase tracking-wider border border-slate-200">
                                ${item.grade}
                            </span>
                            <span class="px-2.5 py-0.5 rounded-lg bg-red-50 text-brand-red font-black text-[11px] uppercase tracking-wider border border-red-100">
                                ${item.category}
                            </span>
                            ${item.unit ? `
                                <span class="px-2.5 py-0.5 rounded-lg bg-slate-50 text-slate-500 font-bold text-[11px] hidden sm:inline-block">
                                    ${item.unit}
                                </span>
                            ` : ''}
                        </div>
                        
                        <!-- Başlık -->
                        <h4 class="text-base font-black text-slate-900 group-hover:text-brand-red transition-colors mb-1">
                            ${highlightedTitle}
                        </h4>

                        <!-- Açıklama -->
                        <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                            ${highlightedDesc}
                        </p>
                    </div>
                </div>

                <!-- Aksiyon Butonu -->
                <div class="flex-shrink-0 self-end sm:self-center">
                    <a href="${item.url}" ${clickAction} class="px-4 py-2 bg-slate-900 group-hover:bg-brand-red text-white text-xs font-black rounded-xl shadow-sm transition-all flex items-center gap-2 whitespace-nowrap">
                        <span>İçeriği Aç</span> <i class="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
                    </a>
                </div>
            </div>
        `;
    }).join("");
}

// -------------------------------------------------------------
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



// -------------------------------------------------------------

// -------------------------------------------------------------
// 🔐 GÜVENLİ YÖNETİCİ & MATERYAL YÖNETİM SİSTEMİ (INDEXEDDB + LOCALSTORAGE)
// -------------------------------------------------------------

const ADMIN_CONFIG = {
    passwords: ["Rotali5822."],
    isAdmin: localStorage.getItem("rotali_is_admin") === "true"
};

const GRADE_UNITS_MAP = {
    "5": [
        "1. Ünite: Güneş, Dünya ve Ay",
        "2. Ünite: Canlılar Dünyası",
        "3. Ünite: Kuvvetin Ölçülmesi ve Sürtünme",
        "4. Ünite: Madde ve Değişim",
        "5. Ünite: Işığın Yayılması",
        "6. Ünite: İnsan ve Çevre",
        "7. Ünite: Elektrik Devre Elemanları"
    ],
    "6": [
        "1. Ünite: Güneş Sistemi ve Tutulmalar",
        "2. Ünite: Vücudumuzdaki Sistemler",
        "3. Ünite: Kuvvet ve Hareket",
        "4. Ünite: Madde ve Isı",
        "5. Ünite: Ses ve Özellikleri",
        "6. Ünite: Vücudumuzdaki Sistemler ve Sağlığı",
        "7. Ünite: Elektriğin İletimi"
    ],
    "7": [
        "1. Ünite: Güneş Sistemi ve Ötesi",
        "2. Ünite: Hücre ve Bölünmeler",
        "3. Ünite: Kuvvet ve Enerji",
        "4. Ünite: Saf Madde ve Karışımlar",
        "5. Ünite: Işığın Madde ile Etkileşimi",
        "6. Ünite: Canlılarda Üreme, Büyüme ve Gelişme",
        "7. Ünite: Elektrik Devreleri"
    ],
    "8": [
        "1. Ünite: Mevsimler ve İklim",
        "2. Ünite: DNA ve Genetik Kod",
        "3. Ünite: Basınç (Katı, Sıvı, Gaz)",
        "4. Ünite: Madde ve Endüstri",
        "5. Ünite: Basit Makineler",
        "6. Ünite: Enerji Dönüşümleri ve Çevre Bilimi",
        "7. Ünite: Elektrik Yükleri ve Elektrik Enerjisi"
    ],
    "all": [
        "Genel Fen Bilimleri & Bilim Tarihi",
        "TÜBİTAK 2204-B Proje Rehberi",
        "TEKNOFEST Proje Hazırlık",
        "Bilim Fuarı & Deney Protokolleri"
    ]
};

// -------------------------------------------------------------
// 💾 INDEXEDDB DOSYA DEPOLAMA SİSTEMİ (KOTA HATASI OLMADAN SINIRSIZ DOSYA)
// -------------------------------------------------------------
const RotaliDB = {
    dbName: "RotaliFenciDB",
    dbVersion: 1,
    db: null,

    async getDB() {
        if (this.db) return this.db;
        return new Promise((resolve, reject) => {
            if (!window.indexedDB) {
                console.warn("IndexedDB desteklenmiyor, bellek kullanılacak.");
                resolve(null);
                return;
            }
            const request = indexedDB.open(this.dbName, this.dbVersion);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains("files")) {
                    db.createObjectStore("files", { keyPath: "id" });
                }
            };
            request.onsuccess = (e) => {
                this.db = e.target.result;
                resolve(this.db);
            };
            request.onerror = (e) => {
                console.error("IndexedDB açılış hatası:", e);
                resolve(null);
            };
        });
    },

    async saveFile(id, fileBlob, fileName, fileType) {
        const db = await this.getDB();
        if (!db) return false;
        return new Promise((resolve) => {
            try {
                const tx = db.transaction("files", "readwrite");
                const store = tx.objectStore("files");
                store.put({
                    id: id,
                    blob: fileBlob,
                    fileName: fileName,
                    fileType: fileType,
                    savedAt: Date.now()
                });
                tx.oncomplete = () => resolve(true);
                tx.onerror = (err) => {
                    console.error("IDB save error:", err);
                    resolve(false);
                };
            } catch (err) {
                console.error("IDB save catch:", err);
                resolve(false);
            }
        });
    },

    async getFile(id) {
        const db = await this.getDB();
        if (!db) return null;
        return new Promise((resolve) => {
            try {
                const tx = db.transaction("files", "readonly");
                const store = tx.objectStore("files");
                const request = store.get(id);
                request.onsuccess = () => resolve(request.result || null);
                request.onerror = () => resolve(null);
            } catch (err) {
                resolve(null);
            }
        });
    },

    async deleteFile(id) {
        const db = await this.getDB();
        if (!db) return false;
        return new Promise((resolve) => {
            try {
                const tx = db.transaction("files", "readwrite");
                const store = tx.objectStore("files");
                store.delete(id);
                tx.oncomplete = () => resolve(true);
                tx.onerror = () => resolve(false);
            } catch (err) {
                resolve(false);
            }
        });
    }
};

let currentUploadedFile = null;
let currentTagsList = ["MEB 2026-2027"];
let editingMaterialId = null;

// Toast Bildirimi
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
        <div class="px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 font-black text-xs sm:text-sm ${bgColors[type] || bgColors.info} border border-white/20 animate-in slide-in-from-bottom-5">
            <i class="fa-solid ${type === 'success' ? 'fa-circle-check text-base' : type === 'error' ? 'fa-triangle-exclamation text-base' : 'fa-circle-info text-base'}"></i>
            <span>${message}</span>
        </div>
    `;

    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(10px)";
    }, 4000);
}

// Güvenlik & Yetki Kontrolü
function checkAdminAccess(callback) {
    if (localStorage.getItem("rotali_is_admin") === "true") {
        if (typeof callback === "function") callback();
        return true;
    }
    openAdminLoginModal(callback);
    return false;
}

function triggerUploadModal(gradeNumber = "8", subTab = "ders-notu") {
    checkAdminAccess(() => {
        openMaterialUploadModal(gradeNumber, subTab);
    });
}

function openAdminLoginModal(onSuccessCallback = null) {
    let modal = document.getElementById("admin-login-modal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "admin-login-modal";
        modal.className = "fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300";
        modal.onclick = function(e) {
            if (e.target === this) closeAdminLoginModal();
        };
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200" onclick="event.stopPropagation()">
            <button type="button" onclick="closeAdminLoginModal()" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-500 flex items-center justify-center font-bold transition-all" title="Kapat">
                <i class="fa-solid fa-xmark"></i>
            </button>

            <div class="text-center mb-6">
                <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-700 text-white flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg shadow-red-600/30">
                    <i class="fa-solid fa-shield-halved"></i>
                </div>
                <h3 class="text-xl font-black text-slate-900 tracking-tight">Yönetici Girişi</h3>
                <p class="text-xs text-slate-500 mt-1 font-medium">Bu alana sadece Rotalı Fenci yetkilileri erişebilir.</p>
            </div>

            <form onsubmit="handleAdminPasswordSubmit(event)" class="space-y-4">
                <div>
                    <label class="block text-xs font-black uppercase text-slate-700 mb-1.5">Yönetici Şifresi</label>
                    <div class="relative">
                        <input type="password" id="admin-pass-input" placeholder="••••••••" required autofocus
                            class="w-full p-3.5 pl-11 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white transition-all">
                        <i class="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                    </div>
                </div>

                <button type="submit" class="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2">
                    <i class="fa-solid fa-right-to-bracket"></i>
                    <span>Güvenli Giriş Yap</span>
                </button>
            </form>
        </div>
    `;

    modal.style.display = "flex";
    modal.classList.remove("hidden");
    window._adminLoginCallback = onSuccessCallback;

    setTimeout(() => {
        const input = document.getElementById("admin-pass-input");
        if (input) input.focus();
    }, 100);
}

function closeAdminLoginModal() {
    const modal = document.getElementById("admin-login-modal");
    if (modal) {
        modal.style.display = "none";
        modal.classList.add("hidden");
    }
}

function handleAdminPasswordSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const input = document.getElementById("admin-pass-input");
    if (!input) return;

    const val = input.value.trim();
    if (ADMIN_CONFIG.passwords.includes(val)) {
        localStorage.setItem("rotali_is_admin", "true");
        ADMIN_CONFIG.isAdmin = true;
        closeAdminLoginModal();
        updateAdminNavUI();
        showToast("👑 Yönetici Girişi Başarılı! Hoş geldiniz.", "success");
        if (typeof window._adminLoginCallback === "function") {
            window._adminLoginCallback();
            window._adminLoginCallback = null;
        } else {
            handleRouteChange();
        }
    } else {
        input.classList.add("border-red-500", "ring-2", "ring-red-500/20");
        input.value = "";
        showToast("❌ Hatalı şifre! Lütfen tekrar deneyin.", "error");
        input.focus();
    }
}

function handleAdminLogout() {
    localStorage.removeItem("rotali_is_admin");
    ADMIN_CONFIG.isAdmin = false;
    updateAdminNavUI();
    showToast("🚪 Yönetici oturumu güvenle kapatıldı.", "info");
    window.location.hash = "home";
    setTimeout(() => {
        handleRouteChange();
    }, 50);
}

function updateAdminNavUI() {
    const isAdmin = localStorage.getItem("rotali_is_admin") === "true";
    ADMIN_CONFIG.isAdmin = isAdmin;

    // 1. Desktop: Ev (Home) Butonunun Yanına Çıkış Simgesi
    const desktopLogout = document.getElementById("admin-home-logout-desktop");
    if (desktopLogout) {
        if (isAdmin) {
            desktopLogout.innerHTML = `
                <button type="button" onclick="handleAdminLogout()" class="w-11 h-11 rounded-2xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white flex items-center justify-center text-lg transition-all shadow-sm border border-rose-200 hover:scale-105 transform active:scale-95 animate-in fade-in" title="👑 Yönetici Modunu Kapat (Çıkış Yap)">
                    <i class="fa-solid fa-power-off"></i>
                </button>
            `;
        } else {
            desktopLogout.innerHTML = "";
        }
    }

    // 2. Mobil: Ev (Home) Butonunun Yanına Çıkış Simgesi
    const mobileLogout = document.getElementById("admin-home-logout-mobile");
    if (mobileLogout) {
        if (isAdmin) {
            mobileLogout.innerHTML = `
                <button type="button" onclick="handleAdminLogout()" class="w-10 h-10 rounded-2xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white flex items-center justify-center text-base transition-all shadow-sm border border-rose-200 active:scale-95 animate-in fade-in" title="👑 Yönetici Modunu Kapat">
                    <i class="fa-solid fa-power-off"></i>
                </button>
            `;
        } else {
            mobileLogout.innerHTML = "";
        }
    }

    // Floating Quick Admin Bar ve diğer menüleri temizle
    const desktopContainer = document.getElementById("admin-nav-container");
    if (desktopContainer) desktopContainer.innerHTML = "";
    const mobileContainer = document.getElementById("admin-mobile-nav-container");
    if (mobileContainer) mobileContainer.innerHTML = "";
    const floatingBar = document.getElementById("floating-admin-bar");
    if (floatingBar) floatingBar.remove();
}

// Gizli Yönetici Girişi Kısayolu: Ctrl + Shift + A veya Ctrl + Alt + A
document.addEventListener("keydown", function(e) {
    if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") || (e.ctrlKey && e.altKey && e.key.toLowerCase() === "a")) {
        e.preventDefault();
        openAdminLoginModal();
    }
});

// ESC Tuşu ile Modal Kapatma
document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" || e.keyCode === 27) {
        closeMaterialUploadModal();
        closeAdminLoginModal();
    }
});

// Modal Kapatma
function closeMaterialUploadModal() {
    const modal = document.getElementById("material-upload-modal");
    if (modal) {
        modal.style.display = "none";
        modal.classList.add("hidden");
    }
    currentUploadedFile = null;
    editingMaterialId = null;
}

// Materyal Silme
async function deleteCustomMaterial(id) {
    if (!checkAdminAccess()) return;
    if (!confirm("Bu materyali tamamen silmek istediğinize emin misiniz?")) return;

    let customList = JSON.parse(localStorage.getItem("rotali_custom_materials") || "[]");
    customList = customList.filter(item => item.id !== id);
    localStorage.setItem("rotali_custom_materials", JSON.stringify(customList));

    // IDB'den de sil
    await RotaliDB.deleteFile(id);

    showToast("🗑️ Materyal başarıyla silindi.", "info");
    handleRouteChange();
}

// Materyal Düzenleme & Taşıma
function editCustomMaterial(id) {
    if (!checkAdminAccess()) return;
    const customList = JSON.parse(localStorage.getItem("rotali_custom_materials") || "[]");
    const mat = customList.find(item => item.id === id);
    if (!mat) {
        showToast("Materyal bulunamadı!", "error");
        return;
    }
    openMaterialUploadModal(mat.grade || "8", mat.category || "ders-notu", mat);
}

// Materyal Açma / İndirme (IDB & Web Link Uyumlu)
async function openOrDownloadMaterial(id, fallbackUrl = "#", fileName = "materyal.pdf") {
    // Önce IDB'den dosyayı kontrol et
    const fileRecord = await RotaliDB.getFile(id);
    if (fileRecord && fileRecord.blob) {
        const url = URL.createObjectURL(fileRecord.blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileRecord.fileName || fileName;
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            a.remove();
            URL.revokeObjectURL(url);
        }, 1000);
        return;
    }

    // IDB'de yoksa veya harici link ise
    if (fallbackUrl && fallbackUrl !== "#" && fallbackUrl !== "") {
        if (fallbackUrl.startsWith("data:")) {
            const a = document.createElement("a");
            a.href = fallbackUrl;
            a.download = fileName;
            a.target = "_blank";
            document.body.appendChild(a);
            a.click();
            setTimeout(() => a.remove(), 500);
        } else {
            window.open(fallbackUrl, "_blank");
        }
    } else {
        showToast("📄 Bu materyalin çevrimdışı önizlemesi veya web bağlantısı mevcut.", "info");
    }
}

// -------------------------------------------------------------
// 🚀 GELİŞMİŞ YÖNETİCİ İÇERİK & MATERYAL YÜKLEME MODALI
// -------------------------------------------------------------


// -------------------------------------------------------------
// 🎮 İNTERAKTİF SAYFA İÇİ OYUN MOTORU & SİMÜLATÖRÜ (MODAL)
// -------------------------------------------------------------

const INTERACTIVE_GAMES_POOL = {
    "oyun-5-lab": {
        title: "🧪 5. Sınıf Laboratuvar Malzemeleri ve Güvenlik Kuralları Oyunu",
        grade: "5. Sınıf",
        desc: "Laboratuvarın 20 temel araç-gereci, güvenlik sembolleri ve deney kurallarını eğlenerek öğren!",
        questions: [
            {
                q: "Sıvıların hacmini en hassas şekilde ölçmek için üzerinde mililitre (ml) çizgileri bulunan cam kaba ne ad verilir?",
                options: ["Dereceli Silindir (Mezür)", "Beherglas", "Deney Tüpü", "Erlenmayer"],
                answer: 0,
                hint: "Üzerinde ölçü çizgileri (derecelendirme) bulunur.",
                icon: "fa-solid fa-flask-vial"
            },
            {
                q: "Çözelti hazırlama, sıvıları karıştırma ve ısıtma işlemlerinde kullanılan geniş ağızlı silindirik cam kaba ne ad verilir?",
                options: ["Beherglas", "Büret", "Saat Camı", "Huni"],
                answer: 0,
                hint: "Laboratuvarın en temel bardak biçimli cam kabıdır.",
                icon: "fa-solid fa-mug-hot"
            },
            {
                q: "Titrasyon ve çözelti saklamada kullanılan, koni şeklinde tabanı geniş ve dar boyunlu cam kaba ne ad verilir?",
                options: ["Erlenmayer", "Deney Tüpü", "Piset", "Baget"],
                answer: 0,
                hint: "Üçgenimsi koni gövdesiyle çalkalamaya çok uygundur.",
                icon: "fa-solid fa-flask"
            },
            {
                q: "Küçük miktardaki sıvıları test etmek, ısıtmak veya karıştırmak için kullanılan ince uzun cam kaba ne ad verilir?",
                options: ["Deney Tüpü", "Mezür", "Sacayak", "İspirto Ocağı"],
                answer: 0,
                hint: "Tüp standında (spor) yan yana dizilir.",
                icon: "fa-solid fa-vial"
            },
            {
                q: "Cam kapları ısıtma işleminde üzerine koymak için kullanılan üç ayaklı metal düzeneğe ne ad verilir?",
                options: ["Sacayak", "Baget", "Spatül", "Damlalık"],
                answer: 0,
                hint: "Adı üzerinde 3 adet metal ayağı vardır.",
                icon: "fa-solid fa-shapes"
            },
            {
                q: "Çözeltileri homojen bir şekilde karıştırmak için kullanılan cam çubuğa ne ad verilir?",
                options: ["Baget", "Spatül", "Huni", "Saat Camı"],
                answer: 0,
                hint: "Çay kaşığı gibi sıvıları karıştırmaya yarayan cam çubuktur.",
                icon: "fa-solid fa-wand-magic-sparkles"
            },
            {
                q: "Toz veya katı kimyasalları kaptan almak için kullanılan küçük metal veya porselen kaşığa ne ad verilir?",
                options: ["Spatül", "Damlalık", "Piset", "Erlenmayer"],
                answer: 0,
                hint: "Küçük bir kimya kaşığıdır.",
                icon: "fa-solid fa-utensils"
            },
            {
                q: "Sıvı maddeleri damla damla hassas miktarda aktarmak için kullanılan ucu sıkılabilir cam/plastik alete ne ad verilir?",
                options: ["Damlalık", "Büret", "Beherglas", "Sacayak"],
                answer: 0,
                hint: "Sıvıyı damlatarak döker.",
                icon: "fa-solid fa-eye-dropper"
            },
            {
                q: "Laboratuvarda ısıtma deneylerinde kullanılan, içinde ispirto yanan fitilli ısı kaynağına ne ad verilir?",
                options: ["İspirto Ocağı", "Buzdolabı", "Baget", "Termometre"],
                answer: 0,
                hint: "Cam gövdeli ve fitilli klasik laboratuvar ocağıdır.",
                icon: "fa-solid fa-fire"
            },
            {
                q: "Isıtma sırasında alevin cam kap tabanına eşit yayılmasını sağlayan ve sacayak üstüne konan telli levhaya ne ad verilir?",
                options: ["Tel Amyant", "Spatül", "Saat Camı", "Piset"],
                answer: 0,
                hint: "Isıyı dengeli dağıtıp camın çatlamasını önler.",
                icon: "fa-solid fa-border-all"
            },
            {
                q: "Dar ağızlı kaplara sıvı aktarırken veya süzme işlemlerinde filtre kağıdıyla kullanılan koni alete ne ad verilir?",
                options: ["Huni", "Mezür", "Damlalık", "Erlenmayer"],
                answer: 0,
                hint: "Üstü geniş, altı ince boru şeklindedir.",
                icon: "fa-solid fa-filter"
            },
            {
                q: "Az miktardaki katı maddeleri tartmak veya üzerini kapatmak için kullanılan içbükey yuvarlak cama ne ad verilir?",
                options: ["Saat Camı", "Beherglas", "Lam ve Lamel", "Sacayak"],
                answer: 0,
                hint: "Kol saatinin camına benzer.",
                icon: "fa-solid fa-circle-notch"
            },
            {
                q: "Isıtılan sıcak deney tüplerini alev üzerinde güvenle tutmak için kullanılan alete ne ad verilir?",
                options: ["Deney Tüpü Maşası", "Damlalık", "Baget", "Huni"],
                answer: 0,
                hint: "Genellikle ahşap veya metalden yapılmış maşadır.",
                icon: "fa-solid fa-hand"
            },
            {
                q: "İçinde saf su bulunan ve deney kaplarını temizlemek veya su püskürtmek için kullanılan sıkılabilir plastik şişeye ne ad verilir?",
                options: ["Piset", "Büret", "Mezür", "Erlenmayer"],
                answer: 0,
                hint: "Ucu kıvrık borulu yıkama şişesidir.",
                icon: "fa-solid fa-bottle-water"
            },
            {
                q: "Deney ortamının veya sıvı çözeltilerin sıcaklığını Celsius (°C) cinsinden ölçen alete ne ad verilir?",
                options: ["Termometre", "Dinamometre", "Barometre", "Manometre"],
                answer: 0,
                hint: "İçindeki sıvı genleşerek sıcaklığı gösterir.",
                icon: "fa-solid fa-temperature-high"
            },
            {
                q: "Üzerinde alev görseli bulunan laboratuvar güvenlik sembolü neyi ifade eder?",
                options: ["Yanıcı Madde (Ateşten Uzak Tutunuz)", "Zehirli Madde", "Aşındırıcı Asit", "Radyoaktif Madde"],
                answer: 0,
                hint: "Kıvılcım ve alevle temasında kolayca tutuşur.",
                icon: "fa-solid fa-fire-flame-curved"
            },
            {
                q: "Üzerinde kuru kafa ve çapraz kemikler bulunan güvenlik sembolü ne anlama gelir?",
                options: ["Toksik / Zehirli Madde", "Geri Dönüşüm", "Biyo-risk", "Patlayıcı"],
                answer: 0,
                hint: "Solunması, yutulması veya cilde teması ölümcül olabilir.",
                icon: "fa-solid fa-skull-crossbones"
            },
            {
                q: "Ele veya metal yüzeye döküldüğünde aşındıran/yakan asit sembolü nedir?",
                options: ["Korozif (Aşındırıcı) Madde", "Radyoaktif", "Biyolojik Tehlike", "Oksitleyici"],
                answer: 0,
                hint: "Cilde ve eşyalara damlayınca delik açan maddedir.",
                icon: "fa-solid fa-hand-dots"
            },
            {
                q: "Laboratuvara girerken gözleri ve kıyafetleri kimyasal sıçramalarından korumak için ne giyilmelidir?",
                options: ["Laboratuvar Önlüğü ve Koruyucu Gözlük", "Güneş Gözlüğü ve Şapka", "Yağmurluk", "Sadece Eldiven"],
                answer: 0,
                hint: "Temel kişisel koruyucu donanımlardır.",
                icon: "fa-solid fa-glasses"
            },
            {
                q: "Laboratuvarda kapağı açık bir kimyasal şişenin kokusu merak edildiğinde ne yapılmalıdır?",
                options: ["Asla doğrudan koklanmamalı, el ile hafifçe dalgalandırılmalıdır", "Derin nefesle koklanmalıdır", "Tadına bakılmalıdır", "Göze yaklaştırılmalıdır"],
                answer: 0,
                hint: "Doğrudan koklamak solunum yollarına ciddi zarar verebilir.",
                icon: "fa-solid fa-triangle-exclamation"
            }
        ]
    },
    "oyun-8-passaparola": {
        title: "🎯 8. Sınıf LGS Fen Passaparola Terim Yarışması",
        grade: "8. Sınıf (LGS)",
        desc: "LGS Fen Bilimleri kavramlarını A'dan Z'ye sorularda bil, LGS şampiyonu ol!",
        questions: [
            { letter: "A", q: "Maddenin en küçük kimyasal yapı birimi?", options: ["Atom", "Anot", "Alaşım", "Asit"], answer: 0 },
            { letter: "B", q: "Birim yüzeye dik etki eden kuvvetin adı?", options: ["Basınç", "Bileşke", "Bağ", "Buharlaşma"], answer: 0 },
            { letter: "Ç", q: "Hücrenin yönetim ve kalıtım merkezi?", options: ["Çekirdek", "Çeper", "Çözelti", "Çözünürlük"], answer: 0 },
            { letter: "D", q: "Kuvvetin büyüklüğünü ölçen yaylı alet?", options: ["Dinamometre", "Diyot", "Direnç", "Damlalık"], answer: 0 },
            { letter: "F", q: "Bitkilerin güneş ışığıyla besin ve oksijen üretmesi?", options: ["Fotosentez", "Fermantasyon", "Filtreleme", "Füzyon"], answer: 0 },
            { letter: "G", q: "Canlının genetik yapısının tamamına verilen ad?", options: ["Genotip", "Gamet", "Genom", "Glukoz"], answer: 0 },
            { letter: "M", q: "Hücrede oksijenli solunumla enerji (ATP) üreten organel?", options: ["Mitokondri", "Mezofit", "Miyelin", "Maya"], answer: 0 },
            { letter: "P", q: "Elementlerin artan atom numaralarına göre sıralandığı çizelge?", options: ["Periyodik Sistem", "Proton Tablosu", "Plazma Cetveli", "Polimer"], answer: 0 }
        ]
    },
    "oyun-7-hucre": {
        title: "🧬 7. Sınıf Hücre ve Organeller Eşleştirme Oyunu",
        grade: "7. Sınıf",
        desc: "Hücre organellerini görevleriyle hatasız eşleştir!",
        questions: [
            { q: "Hücrenin enerji santralidir. Besin ve oksijeni yakarak enerji üretir.", options: ["Mitokondri", "Ribozom", "Koful", "Lizozom"], answer: 0, icon: "fa-solid fa-bolt" },
            { q: "Tüm canlı hücrelerde bulunur. Protein sentezinden sorumludur.", options: ["Ribozom", "Golgi", "Sentrozom", "Kloroplast"], answer: 0, icon: "fa-solid fa-cubes" },
            { q: "Bitki hücrelerinde fotosentez yaparak besin ve oksijen üretir, yeşil renklidir.", options: ["Kloroplast", "Lökoplast", "Mitokondri", "Lizozom"], answer: 0, icon: "fa-solid fa-leaf" },
            { q: "Salgı maddelerinin (tükürük, ter, süt) üretilmesini ve paketlenmesini sağlar.", options: ["Golgi Cisimciği", "Endoplazmik Retikulum", "Sentrioller", "Koful"], answer: 0, icon: "fa-solid fa-box" },
            { q: "Hücre içi sindirimden sorumludur. Yaşlanmış organelleri ve mikropları parçalar.", options: ["Lizozom", "Ribozom", "Plastid", "Çekirdekçik"], answer: 0, icon: "fa-solid fa-scissors" }
        ]
    }
};

let currentActiveGame = {
    gameKey: null,
    score: 0,
    currentQIdx: 0,
    streak: 0,
    answered: false
};

function openInteractiveGameModal(gameKeyOrUrl, gameTitle = "Eğitsel Fen Oyunu") {
    let modal = document.getElementById("interactive-game-modal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "interactive-game-modal";
        modal.className = "fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 transition-all duration-300";
        modal.onclick = function(e) {
            if (e.target === this) closeInteractiveGameModal();
        };
        document.body.appendChild(modal);
    }

    // Determine if it's a built-in interactive game or external URL
    const gameData = INTERACTIVE_GAMES_POOL[gameKeyOrUrl] || (gameKeyOrUrl && gameKeyOrUrl.includes("lab") ? INTERACTIVE_GAMES_POOL["oyun-5-lab"] : (gameKeyOrUrl && gameKeyOrUrl.includes("passaparola") ? INTERACTIVE_GAMES_POOL["oyun-8-passaparola"] : (gameKeyOrUrl && gameKeyOrUrl.includes("hucre") ? INTERACTIVE_GAMES_POOL["oyun-7-hucre"] : null)));

    if (gameData) {
        currentActiveGame = {
            gameKey: gameKeyOrUrl,
            data: gameData,
            score: 0,
            currentQIdx: 0,
            streak: 0,
            answered: false
        };
        renderInteractiveGameScreen(modal);
    } else {
        // Fallback or Iframe web game player (in-page iframe)
        const embedUrl = (gameKeyOrUrl && gameKeyOrUrl.startsWith("http")) ? gameKeyOrUrl : "#";
        modal.innerHTML = `
            <div class="bg-slate-900 rounded-3xl max-w-4xl w-full border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200" onclick="event.stopPropagation()">
                <div class="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between text-white">
                    <div class="flex items-center gap-3">
                        <span class="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center text-lg font-black">
                            <i class="fa-solid fa-gamepad"></i>
                        </span>
                        <div>
                            <h3 class="text-base font-black">${gameTitle}</h3>
                            <span class="text-xs text-slate-400">Rotalı Fenci İnteraktif Oyun Alanı</span>
                        </div>
                    </div>
                    <button type="button" onclick="closeInteractiveGameModal()" class="w-9 h-9 rounded-full bg-slate-700 hover:bg-rose-600 text-white flex items-center justify-center font-black transition-all">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class="p-6 text-center text-white space-y-4">
                    ${embedUrl !== '#' ? `
                        <div class="w-full h-[65vh] rounded-2xl overflow-hidden bg-white">
                            <iframe src="${embedUrl}" class="w-full h-full border-0" allowfullscreen></iframe>
                        </div>
                    ` : `
                        <div class="py-12 bg-slate-800/60 rounded-2xl border border-slate-700 max-w-lg mx-auto">
                            <div class="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-3xl mx-auto mb-3">
                                <i class="fa-solid fa-flask"></i>
                            </div>
                            <h4 class="text-lg font-black mb-2">${gameTitle}</h4>
                            <p class="text-xs text-slate-300 mb-6 px-4">Bu interaktif oyun doğrudan Rotalı Fenci platformu üzerinde çalışmak üzere hazırlandı.</p>
                            <button type="button" onclick="openInteractiveGameModal('oyun-5-lab')" class="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase rounded-xl shadow-lg transition-all">
                                🎮 Laboratuvar Oyununu Hemen Oyna
                            </button>
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    modal.classList.remove("hidden");
}

function closeInteractiveGameModal() {
    const modal = document.getElementById("interactive-game-modal");
    if (modal) modal.classList.add("hidden");
}

function renderInteractiveGameScreen(modal) {
    const { data, score, currentQIdx, streak, answered } = currentActiveGame;
    const questions = data.questions;
    const isFinished = currentQIdx >= questions.length;

    if (isFinished) {
        modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden p-6 sm:p-8 text-center animate-in zoom-in-95 duration-200" onclick="event.stopPropagation()">
                <div class="w-20 h-20 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center text-4xl mx-auto mb-4 shadow-inner">
                    🏆
                </div>
                <h3 class="text-2xl font-black text-slate-900 mb-1">Tebrikler Şampiyon!</h3>
                <p class="text-xs text-slate-500 font-semibold mb-6">${data.title} tamamlandı.</p>
                
                <div class="p-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl shadow-lg mb-6">
                    <div class="text-xs text-amber-400 font-black uppercase tracking-wider mb-1">Toplam Kazanılan Puan</div>
                    <div class="text-4xl font-black text-white">${score} <span class="text-lg text-amber-400">/ ${questions.length * 10}</span></div>
                    <div class="text-[11px] text-slate-300 mt-2">Doğruluk Oranı: %${Math.round((score / (questions.length * 10)) * 100)}</div>
                </div>

                <div class="flex gap-3">
                    <button type="button" onclick="openInteractiveGameModal('${currentActiveGame.gameKey}')" class="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase rounded-xl transition-all shadow-md">
                        🔄 Yeniden Oyna
                    </button>
                    <button type="button" onclick="closeInteractiveGameModal()" class="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase rounded-xl transition-all shadow-md">
                        ✅ Kapat
                    </button>
                </div>
            </div>
        `;
        return;
    }

    const currentQ = questions[currentQIdx];

    // Helper SVG illustrations
    let illustrationHtml = "";
    const qLower = (currentQ.q + " " + (currentQ.hint || "")).toLowerCase();
    if (qLower.includes("dereceli") || qLower.includes("mezür") || qLower.includes("hacmini")) {
        illustrationHtml = `<div class="w-20 h-24 mx-auto mb-2 flex items-center justify-center p-2 rounded-2xl bg-white shadow-md border border-slate-100">
        <svg viewBox="0 0 64 80" class="w-16 h-20">
            <rect x="22" y="10" width="20" height="60" rx="3" fill="#e0f2fe" stroke="#0284c7" stroke-width="2.5"/>
            <rect x="16" y="70" width="32" height="6" rx="2" fill="#94a3b8" stroke="#475569" stroke-width="1.5"/>
            <rect x="24" y="30" width="16" height="38" fill="#38bdf8" opacity="0.6"/>
            <!-- lines -->
            <line x1="32" y1="20" x2="40" y2="20" stroke="#0284c7" stroke-width="1.5"/>
            <line x1="35" y1="28" x2="40" y2="28" stroke="#0284c7" stroke-width="1"/>
            <line x1="32" y1="36" x2="40" y2="36" stroke="#0284c7" stroke-width="1.5"/>
            <line x1="35" y1="44" x2="40" y2="44" stroke="#0284c7" stroke-width="1"/>
            <line x1="32" y1="52" x2="40" y2="52" stroke="#0284c7" stroke-width="1.5"/>
            <line x1="35" y1="60" x2="40" y2="60" stroke="#0284c7" stroke-width="1"/>
        </svg>
    </div>`;
    } else if (qLower.includes("beher") || qLower.includes("geniş ağızlı")) {
        illustrationHtml = `<div class="w-20 h-24 mx-auto mb-2 flex items-center justify-center p-2 rounded-2xl bg-white shadow-md border border-slate-100">
        <svg viewBox="0 0 64 80" class="w-16 h-20">
            <path d="M14,14 L14,68 Q14,74 20,74 L44,74 Q50,74 50,68 L50,14" fill="#e0f2fe" stroke="#0284c7" stroke-width="2.5"/>
            <!-- spout -->
            <path d="M10,14 L14,14 L50,14" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M16,36 L48,36 L48,68 Q48,72 44,72 L20,72 Q16,72 16,68 Z" fill="#60a5fa" opacity="0.65"/>
            <line x1="16" y1="42" x2="24" y2="42" stroke="#1d4ed8" stroke-width="1.5"/>
            <line x1="16" y1="50" x2="28" y2="50" stroke="#1d4ed8" stroke-width="1.5"/>
            <line x1="16" y1="58" x2="24" y2="58" stroke="#1d4ed8" stroke-width="1.5"/>
        </svg>
    </div>`;
    } else if (qLower.includes("erlenmayer") || qLower.includes("titrasyon") || qLower.includes("koni")) {
        illustrationHtml = `<div class="w-20 h-24 mx-auto mb-2 flex items-center justify-center p-2 rounded-2xl bg-white shadow-md border border-slate-100">
        <svg viewBox="0 0 64 80" class="w-16 h-20">
            <path d="M26,10 L38,10 L38,24 L54,66 Q56,72 50,72 L14,72 Q8,72 10,66 L26,24 Z" fill="#e0f2fe" stroke="#7c3aed" stroke-width="2.5"/>
            <rect x="24" y="8" width="16" height="4" rx="1.5" fill="#c4b5fd" stroke="#7c3aed" stroke-width="1.5"/>
            <path d="M18,48 L46,48 L51,66 Q52,70 48,70 L16,70 Q12,70 13,66 Z" fill="#a78bfa" opacity="0.7"/>
        </svg>
    </div>`;
    } else if (qLower.includes("deney tüpü") || qLower.includes("tüp")) {
        illustrationHtml = `<div class="w-20 h-24 mx-auto mb-2 flex items-center justify-center p-2 rounded-2xl bg-white shadow-md border border-slate-100">
        <svg viewBox="0 0 64 80" class="w-16 h-20">
            <path d="M26,10 L38,10 L38,62 Q38,72 32,72 Q26,72 26,62 Z" fill="#e0f2fe" stroke="#059669" stroke-width="2.5"/>
            <rect x="24" y="8" width="16" height="4" rx="1.5" fill="#a7f3d0" stroke="#059669" stroke-width="1.5"/>
            <path d="M28,38 L36,38 L36,62 Q36,70 32,70 Q28,70 28,62 Z" fill="#34d399" opacity="0.75"/>
        </svg>
    </div>`;
    } else if (qLower.includes("ispirto") || qLower.includes("ısı kaynağı") || qLower.includes("fitil")) {
        illustrationHtml = `<div class="w-20 h-24 mx-auto mb-2 flex items-center justify-center p-2 rounded-2xl bg-white shadow-md border border-slate-100">
        <svg viewBox="0 0 64 80" class="w-16 h-20">
            <circle cx="32" cy="52" r="20" fill="#fef3c7" stroke="#d97706" stroke-width="2.5"/>
            <rect x="28" y="26" width="8" height="8" fill="#94a3b8" stroke="#475569" stroke-width="1.5"/>
            <!-- flame -->
            <path d="M32,10 Q38,18 35,24 Q32,28 29,24 Q26,18 32,10 Z" fill="#f97316"/>
            <path d="M32,14 Q35,20 33,24 Q32,26 31,24 Q29,20 32,14 Z" fill="#facc15"/>
        </svg>
    </div>`;
    } else if (qLower.includes("sacayak") || qLower.includes("üç ayak")) {
        illustrationHtml = `<div class="w-20 h-24 mx-auto mb-2 flex items-center justify-center p-2 rounded-2xl bg-white shadow-md border border-slate-100">
        <svg viewBox="0 0 64 80" class="w-16 h-20">
            <ellipse cx="32" cy="24" rx="22" ry="8" fill="#e2e8f0" stroke="#334155" stroke-width="2.5"/>
            <line x1="16" y1="26" x2="10" y2="72" stroke="#334155" stroke-width="3" stroke-linecap="round"/>
            <line x1="32" y1="30" x2="32" y2="72" stroke="#334155" stroke-width="3" stroke-linecap="round"/>
            <line x1="48" y1="26" x2="54" y2="72" stroke="#334155" stroke-width="3" stroke-linecap="round"/>
        </svg>
    </div>`;
    } else if (qLower.includes("damlalık") || qLower.includes("damla damla")) {
        illustrationHtml = `<div class="w-20 h-24 mx-auto mb-2 flex items-center justify-center p-2 rounded-2xl bg-white shadow-md border border-slate-100">
        <svg viewBox="0 0 64 80" class="w-16 h-20">
            <!-- bulb -->
            <path d="M24,18 Q24,8 32,8 Q40,8 40,18 Q40,24 35,26 L35,62 L32,70 L29,62 L29,26 Q24,24 24,18 Z" fill="#fed7aa" stroke="#ea580c" stroke-width="2"/>
            <circle cx="32" cy="74" r="2" fill="#38bdf8"/>
        </svg>
    </div>`;
    } else if (qLower.includes("sıcaklık") || qLower.includes("termometre") || qLower.includes("celsius")) {
        illustrationHtml = `<div class="w-20 h-24 mx-auto mb-2 flex items-center justify-center p-2 rounded-2xl bg-white shadow-md border border-slate-100">
        <svg viewBox="0 0 64 80" class="w-16 h-20">
            <rect x="28" y="10" width="8" height="52" rx="4" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
            <circle cx="32" cy="62" r="9" fill="#ef4444" stroke="#dc2626" stroke-width="2"/>
            <rect x="30.5" y="24" width="3" height="38" fill="#ef4444"/>
            <!-- marks -->
            <line x1="38" y1="16" x2="42" y2="16" stroke="#991b1b" stroke-width="1"/>
            <line x1="38" y1="24" x2="42" y2="24" stroke="#991b1b" stroke-width="1"/>
            <line x1="38" y1="32" x2="42" y2="32" stroke="#991b1b" stroke-width="1"/>
            <line x1="38" y1="40" x2="42" y2="40" stroke="#991b1b" stroke-width="1"/>
        </svg>
    </div>`;
    } else {
        illustrationHtml = `<div class="w-20 h-24 mx-auto mb-2 flex items-center justify-center p-2 rounded-2xl bg-white shadow-md border border-slate-100">
        <svg viewBox="0 0 64 80" class="w-16 h-20">
            <polygon points="32,10 58,58 6,58" fill="#fef08a" stroke="#ca8a04" stroke-width="3"/>
            <text x="32" y="50" font-size="28" font-weight="900" text-anchor="middle" fill="#854d0e">!</text>
        </svg>
    </div>`;
    }

    modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-200" onclick="event.stopPropagation()">
            
            <!-- Üst Bar -->
            <div class="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center text-lg font-black shadow-sm flex-shrink-0">
                        <i class="${currentQ.icon || 'fa-solid fa-flask'}"></i>
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 rounded bg-white/20 text-[10px] font-black uppercase">${data.grade}</span>
                            <span class="text-xs text-amber-400 font-black">🔥 Seri: ${streak}</span>
                        </div>
                        <h3 class="text-sm font-black text-white truncate max-w-[240px] sm:max-w-xs">${data.title}</h3>
                    </div>
                </div>
                
                <div class="flex items-center gap-2">
                    <div class="text-right">
                        <span class="text-[10px] text-slate-400 block font-bold">PUAN</span>
                        <span class="text-sm font-black text-amber-400">${score}</span>
                    </div>
                    <button type="button" onclick="closeInteractiveGameModal()" class="w-8 h-8 rounded-full bg-white/10 hover:bg-red-600 text-white flex items-center justify-center text-sm transition-all ml-2" title="Kapat (ESC)">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>

            <!-- İlerleme Çubuğu -->
            <div class="w-full bg-slate-100 h-1.5">
                <div class="bg-gradient-to-r from-amber-500 to-emerald-500 h-full transition-all duration-300" style="width: ${(currentQIdx / questions.length) * 100}%"></div>
            </div>

            <!-- Oyun Gövdesi -->
            <div class="p-4 sm:p-6 space-y-4 overflow-y-auto">
                <div class="flex items-center justify-between text-xs font-black text-slate-400">
                    <span>SORU ${currentQIdx + 1} / ${questions.length}</span>
                    <span class="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">+10 Puan</span>
                </div>

                <!-- Soru Kartı & Görsel Laboratuvar İllüstrasyonu -->
                <div class="p-4 sm:p-5 bg-gradient-to-br from-amber-50/70 to-orange-50/70 rounded-2xl border-2 border-amber-200/80 shadow-sm text-center">
                    ${illustrationHtml}
                    <p class="text-base sm:text-lg font-black text-slate-900 leading-snug">
                        ${currentQ.q}
                    </p>
                    ${currentQ.hint ? `
                        <div class="mt-2 text-[11px] font-bold text-amber-800 bg-amber-100/70 py-1 px-3 rounded-lg inline-block">
                            💡 İpucu: ${currentQ.hint}
                        </div>
                    ` : ''}
                </div>

                <!-- Şıklar / Seçenekler (Büyük Dokunmatik Butonlar) -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5" id="game-options-container">
                    ${currentQ.options.map((opt, idx) => `
                        <button type="button" onclick="handleGameAnswer(${idx})" id="opt-btn-${idx}" class="p-3.5 sm:p-4 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-amber-400 rounded-2xl text-left font-black text-xs sm:text-sm text-slate-800 transition-all flex items-center gap-3 shadow-sm hover:scale-[1.02] active:scale-95">
                            <span class="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black flex-shrink-0">
                                ${['A', 'B', 'C', 'D'][idx]}
                            </span>
                            <span class="leading-tight">${opt}</span>
                        </button>
                    `).join("")}
                </div>

                <div id="game-feedback-box" class="hidden text-center p-3 rounded-xl font-bold text-xs"></div>
            </div>
        </div>
    `;
}

function handleGameAnswer(selectedIdx) {
    if (currentActiveGame.answered) return;
    currentActiveGame.answered = true;

    const { data, currentQIdx } = currentActiveGame;
    const currentQ = data.questions[currentQIdx];
    const isCorrect = (selectedIdx === currentQ.answer);

    const selectedBtn = document.getElementById(`opt-btn-${selectedIdx}`);
    const correctBtn = document.getElementById(`opt-btn-${currentQ.answer}`);
    const feedbackBox = document.getElementById("game-feedback-box");

    if (isCorrect) {
        currentActiveGame.score += 10;
        currentActiveGame.streak += 1;
        if (selectedBtn) {
            selectedBtn.className = "p-4 bg-emerald-50 border-2 border-emerald-500 rounded-2xl text-left font-black text-sm text-emerald-900 flex items-center gap-3 shadow-md scale-105 transition-all";
        }
        if (feedbackBox) {
            feedbackBox.className = "text-center p-3 rounded-xl font-black text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 block animate-in fade-in";
            feedbackBox.innerHTML = `🎉 Harika! Doğru Cevap! (+10 Puan)`;
        }
    } else {
        currentActiveGame.streak = 0;
        if (selectedBtn) {
            selectedBtn.className = "p-4 bg-rose-50 border-2 border-rose-500 rounded-2xl text-left font-black text-sm text-rose-900 flex items-center gap-3 shadow-md transition-all";
        }
        if (correctBtn) {
            correctBtn.className = "p-4 bg-emerald-50 border-2 border-emerald-500 rounded-2xl text-left font-black text-sm text-emerald-900 flex items-center gap-3 shadow-md transition-all";
        }
        if (feedbackBox) {
            feedbackBox.className = "text-center p-3 rounded-xl font-black text-xs bg-rose-100 text-rose-800 border border-rose-300 block animate-in fade-in";
            feedbackBox.innerHTML = `❌ Yanlış Cevap. Doğrusu: <strong>${currentQ.options[currentQ.answer]}</strong>`;
        }
    }

    setTimeout(() => {
        currentActiveGame.currentQIdx++;
        currentActiveGame.answered = false;
        const modal = document.getElementById("interactive-game-modal");
        if (modal) renderInteractiveGameScreen(modal);
    }, 1200);
}


function openMaterialUploadModal(prefillGrade = "8", prefillTab = "ders-notu", editMaterial = null) {
    let modal = document.getElementById("material-upload-modal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "material-upload-modal";
        modal.className = "fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 transition-all duration-300";
        modal.onclick = function(e) {
            if (e.target === this) closeMaterialUploadModal();
        };
        document.body.appendChild(modal);
    }

    currentUploadedFile = null;
    currentTagsList = editMaterial && editMaterial.tags ? [...editMaterial.tags] : ["MEB 2026-2027"];
    const isEditing = !!editMaterial;
    if (editMaterial) editingMaterialId = editMaterial.id;
    else editingMaterialId = null;

    modal.innerHTML = `
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto custom-scrollbar" onclick="event.stopPropagation()">
            
            <!-- Kapatma Çarpı Butonu -->
            <button type="button" onclick="closeMaterialUploadModal()" class="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 flex items-center justify-center font-black text-base transition-all z-20 shadow-sm" title="Kapat (ESC)">
                <i class="fa-solid fa-xmark"></i>
            </button>

            <!-- Başlık & İkon -->
            <div class="flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-100">
                <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr ${isEditing ? 'from-amber-500 to-orange-600' : 'from-red-600 to-rose-700'} text-white flex items-center justify-center text-xl shadow-md flex-shrink-0">
                    <i class="fa-solid ${isEditing ? 'fa-pen-to-square' : 'fa-cloud-arrow-up'}"></i>
                </div>
                <div>
                    <h3 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        ${isEditing ? 'Materyali Düzenle & Taşı' : 'Yeni İçerik & Materyal Ekle'}
                    </h3>
                    <p class="text-xs text-slate-500 font-medium">
                        ${isEditing ? 'Başlığı, sınıfı, konumu veya dosyayı güncelleyin' : 'PDF, Word, PPTX, Video, Ses, Görsel veya Web Bağlantısı'}
                    </p>
                </div>
            </div>

            <form id="adv-material-form" onsubmit="handleAdvMaterialSubmit(event)" class="space-y-6">
                
                <!-- 1. KATEGORİ & BAŞLIK HİYERARŞİSİ -->
                <div class="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-red-600"></span> 1. Kategori & Konum Hiyerarşisi
                        </span>
                        <span class="text-[11px] font-bold text-slate-400">İstediğiniz Sınıfa / Bölüme Taşıyın</span>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <!-- Ana Kategori / Sınıf -->
                        <div>
                            <label class="block text-xs font-black uppercase text-slate-700 mb-1">Hedef Sınıf / Seviye</label>
                            <select id="adv-grade-select" onchange="updateCascadingUnits()" class="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-red-500 shadow-sm">
                                <option value="8" ${(isEditing ? editMaterial.grade === '8' : prefillGrade === '8') ? 'selected' : ''}>8. Sınıf & LGS</option>
                                <option value="7" ${(isEditing ? editMaterial.grade === '7' : prefillGrade === '7') ? 'selected' : ''}>7. Sınıf Fen Bilimleri</option>
                                <option value="6" ${(isEditing ? editMaterial.grade === '6' : prefillGrade === '6') ? 'selected' : ''}>6. Sınıf Fen Bilimleri</option>
                                <option value="5" ${(isEditing ? editMaterial.grade === '5' : prefillGrade === '5') ? 'selected' : ''}>5. Sınıf Fen Bilimleri</option>
                                <option value="all" ${(isEditing ? editMaterial.grade === 'all' : prefillGrade === 'all') ? 'selected' : ''}>Proje & Genel Merkez</option>
                            </select>
                        </div>

                        <!-- Alt Kategori -->
                        <div>
                            <label class="block text-xs font-black uppercase text-slate-700 mb-1">Materyal Türü / Sekme</label>
                            <select id="adv-category-select" class="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-red-500 shadow-sm">
                                <option value="ders-notu" ${(isEditing ? editMaterial.category === 'ders-notu' : prefillTab === 'ders-notu') ? 'selected' : ''}>📝 Ders Notu</option>
                                <option value="ders-sunumu" ${(isEditing ? editMaterial.category === 'ders-sunumu' : prefillTab === 'ders-sunumu') ? 'selected' : ''}>📊 Ders Sunumu</option>
                                <option value="videolar" ${(isEditing ? editMaterial.category === 'videolar' : prefillTab === 'videolar') ? 'selected' : ''}>🎥 Videolar</option>
                                <option value="etkinlikler" ${(isEditing ? editMaterial.category === 'etkinlikler' : prefillTab === 'etkinlikler') ? 'selected' : ''}>🧩 Etkinlikler</option>
                                <option value="soru-bankasi" ${(isEditing ? editMaterial.category === 'soru-bankasi' : prefillTab === 'soru-bankasi') ? 'selected' : ''}>📚 Soru Bankası</option>
                                <option value="denemeler" ${(isEditing ? editMaterial.category === 'denemeler' : prefillTab === 'denemeler') ? 'selected' : ''}>🎯 Denemeler</option>
                                <option value="egitsel-oyunlar" ${(isEditing ? editMaterial.category === 'egitsel-oyunlar' : prefillTab === 'egitsel-oyunlar') ? 'selected' : ''}>🎮 Eğitsel Oyunlar</option>
                                <option value="projeler" ${(isEditing ? editMaterial.category === 'projeler' : prefillTab === 'projeler') ? 'selected' : ''}>🚀 TÜBİTAK & Projeler</option>
                            </select>
                        </div>
                    </div>

                    <!-- Ünite / Konu Seçimi -->
                    <div>
                        <div class="flex items-center justify-between mb-1">
                            <label class="block text-xs font-black uppercase text-slate-700">İlişkili Ünite / Başlık</label>
                            <button type="button" onclick="toggleCustomTopicInput()" class="text-[11px] font-bold text-red-600 hover:text-red-700 underline">
                                ➕ Listede Yoksa Yeni Başlık Ekle
                            </button>
                        </div>
                        <select id="adv-unit-select" class="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-red-500 shadow-sm">
                            <!-- JS ile dolar -->
                        </select>
                        <input type="text" id="adv-custom-topic-input" placeholder="Yeni Özel Başlık / Alt Başlık yazın..." class="hidden w-full mt-2 p-3 bg-white border border-red-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500 shadow-sm">
                    </div>
                </div>

                <!-- 2. İÇERİK BİLGİLERİ -->
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-black uppercase text-slate-700 mb-1">
                            İçerik Başlığı <span class="text-red-500">*</span>
                        </label>
                        <input type="text" id="adv-title-input" required value="${isEditing ? (editMaterial.title || '') : ''}" placeholder="Örn: 8. Sınıf Basınç Ünitesi Akıllı Tahta Uyumlu Slayt Seti" class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white transition-all shadow-sm">
                    </div>

                    <div>
                        <label class="block text-xs font-black uppercase text-slate-700 mb-1">Kısa Açıklama / Yönerge</label>
                        <textarea id="adv-desc-input" rows="2" placeholder="Öğrenciler veya öğretmenler için materyal açıklaması..." class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white transition-all shadow-sm">${isEditing ? (editMaterial.desc || '') : ''}</textarea>
                    </div>
                </div>

                <!-- 3. DOSYA YÜKLEME VEYA LİNK -->
                <div class="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-red-600"></span> 2. Dosya / Bağlantı Kaynağı
                        </span>
                        
                        <!-- Sekme Değiştirici -->
                        <div class="flex items-center p-1 bg-slate-200/80 rounded-xl text-xs font-bold">
                            <button type="button" id="tab-upload-file-btn" onclick="switchUploadMethod('file')" class="px-3 py-1.5 rounded-lg bg-white text-slate-900 shadow-sm transition-all">
                                📁 Dosya Yükle
                            </button>
                            <button type="button" id="tab-upload-link-btn" onclick="switchUploadMethod('link')" class="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition-all">
                                🔗 Web / Drive Linki
                            </button>
                        </div>
                    </div>

                    <!-- Dosya Sürükle Bırak Alanı -->
                    <div id="upload-method-file-container">
                        <div id="drag-drop-zone" ondragover="handleDragOver(event)" ondragleave="handleDragLeave(event)" ondrop="handleFileDrop(event)" class="border-2 border-dashed border-slate-300 hover:border-red-500 bg-white rounded-2xl p-6 text-center transition-all cursor-pointer group">
                            <input type="file" id="adv-file-input" onchange="handleFileSelected(event)" accept=".pdf,.docx,.doc,.pptx,.ppt,.xlsx,.xls,.mp4,.webm,.mp3,.wav,.png,.jpg,.jpeg,.svg,.webp,.zip" class="hidden">
                            <label for="adv-file-input" class="cursor-pointer block">
                                <div class="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform shadow-sm">
                                    <i class="fa-solid fa-cloud-arrow-up"></i>
                                </div>
                                <span class="block text-xs font-black text-slate-800 mb-1">Yeni dosya seçmek için <span class="text-red-600 underline">Gözatın</span> veya sürükleyin</span>
                                <span class="block text-[11px] text-slate-400 font-medium">PDF, Word, PPTX, Video, Görsel, ZIP</span>
                            </label>
                        </div>
                    </div>

                    <!-- Embed Link -->
                    <div id="upload-method-link-container" class="hidden space-y-2">
                        <label class="block text-[11px] font-black text-slate-700 uppercase">Google Drive, YouTube, Canva veya Web Dosya Linki</label>
                        <div class="relative">
                            <input type="url" id="adv-link-input" value="${isEditing && editMaterial.fileUrl && editMaterial.fileUrl.startsWith('http') ? editMaterial.fileUrl : ''}" placeholder="https://drive.google.com/... veya https://youtube.com/watch?v=..." class="w-full p-3.5 pl-10 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-red-500 shadow-sm">
                            <i class="fa-solid fa-link absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                        </div>
                    </div>

                    <!-- Önizleme Kartı -->
                    <div id="file-preview-card" class="${isEditing && editMaterial.fileName ? 'block' : 'hidden'} bg-white p-4 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in duration-200">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3 overflow-hidden">
                                <div id="preview-file-icon" class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg flex-shrink-0">
                                    <i class="fa-solid fa-file"></i>
                                </div>
                                <div class="truncate">
                                    <div id="preview-file-name" class="text-xs font-black text-slate-900 truncate">${isEditing ? (editMaterial.fileName || 'Mevcut Dosya') : 'dosya.pdf'}</div>
                                    <div id="preview-file-size" class="text-[10px] text-slate-400 font-bold">${isEditing ? (editMaterial.format || 'Yüklü') : 'Hazır'}</div>
                                </div>
                            </div>
                            <button type="button" onclick="removeSelectedFile()" class="p-2 text-slate-400 hover:text-red-600 text-xs font-bold" title="Dosyayı Kaldır">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 4. ETİKETLER & GÖRÜNÜRLÜK -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-black uppercase text-slate-700 mb-1.5">Etiketler</label>
                        <div class="flex flex-wrap gap-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl min-h-[44px]" id="tags-badge-container"></div>
                        <div class="flex gap-1.5 mt-2">
                            <input type="text" id="adv-tag-input" placeholder="Etiket ekle..." class="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-red-500">
                            <button type="button" onclick="addCustomTag()" class="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-lg">Ekle</button>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-black uppercase text-slate-700 mb-1.5">Görünürlük Durumu</label>
                        <select id="adv-visibility-select" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-red-500">
                            <option value="public" ${isEditing && editMaterial.visibility === 'public' ? 'selected' : ''}>🌐 Herkese Açık (Yayında)</option>
                            <option value="draft" ${isEditing && editMaterial.visibility === 'draft' ? 'selected' : ''}>🔒 Taslak (Gizli)</option>
                        </select>
                    </div>
                </div>

                <!-- SUBMIT & VAZGEÇ BUTONLARI -->
                <div class="pt-2 flex gap-3">
                    <button type="button" onclick="closeMaterialUploadModal()" class="py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase rounded-2xl transition-all">
                        Vazgeç
                    </button>
                    <button type="submit" id="submit-material-btn" class="flex-1 py-4 bg-gradient-to-r ${isEditing ? 'from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700' : 'from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-800'} text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-98">
                        <i class="fa-solid ${isEditing ? 'fa-check' : 'fa-cloud-arrow-up'} text-base"></i>
                        <span>${isEditing ? 'Değişiklikleri Kaydet & Güncelle' : 'İçeriği Sitede Yayınla ve Kaydet'}</span>
                    </button>
                </div>
            </form>
        </div>
    `;

    const initialGrade = isEditing ? editMaterial.grade : prefillGrade;
    updateCascadingUnits(initialGrade);
    
    if (isEditing && editMaterial.unit) {
        const unitSelect = document.getElementById("adv-unit-select");
        if (unitSelect) unitSelect.value = editMaterial.unit;
    }

    renderTagsBadges();
    modal.style.display = "flex";
    modal.classList.remove("hidden");
}

function updateCascadingUnits(forceGrade) {
    const gradeSelect = document.getElementById("adv-grade-select");
    const unitSelect = document.getElementById("adv-unit-select");
    if (!gradeSelect || !unitSelect) return;

    const selectedGrade = forceGrade || gradeSelect.value || "8";
    const units = GRADE_UNITS_MAP[selectedGrade] || GRADE_UNITS_MAP["8"];

    unitSelect.innerHTML = units.map(u => `<option value="${u}">${u}</option>`).join("");
}

function toggleCustomTopicInput() {
    const customInput = document.getElementById("adv-custom-topic-input");
    if (!customInput) return;

    if (customInput.classList.contains("hidden")) {
        customInput.classList.remove("hidden");
        customInput.focus();
    } else {
        customInput.classList.add("hidden");
    }
}

function switchUploadMethod(method) {
    const fileContainer = document.getElementById("upload-method-file-container");
    const linkContainer = document.getElementById("upload-method-link-container");
    const tabFileBtn = document.getElementById("tab-upload-file-btn");
    const tabLinkBtn = document.getElementById("tab-upload-link-btn");

    if (!fileContainer || !linkContainer) return;

    if (method === "file") {
        fileContainer.classList.remove("hidden");
        linkContainer.classList.add("hidden");
        if (tabFileBtn) tabFileBtn.className = "px-3 py-1.5 rounded-lg bg-white text-slate-900 shadow-sm transition-all";
        if (tabLinkBtn) tabLinkBtn.className = "px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition-all";
    } else {
        fileContainer.classList.add("hidden");
        linkContainer.classList.remove("hidden");
        if (tabLinkBtn) tabLinkBtn.className = "px-3 py-1.5 rounded-lg bg-white text-slate-900 shadow-sm transition-all";
        if (tabFileBtn) tabFileBtn.className = "px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition-all";
    }
}

function handleDragOver(e) {
    e.preventDefault();
    const zone = document.getElementById("drag-drop-zone");
    if (zone) zone.classList.add("border-red-500", "bg-red-50/50");
}

function handleDragLeave(e) {
    e.preventDefault();
    const zone = document.getElementById("drag-drop-zone");
    if (zone) zone.classList.remove("border-red-500", "bg-red-50/50");
}

function handleFileDrop(e) {
    e.preventDefault();
    const zone = document.getElementById("drag-drop-zone");
    if (zone) zone.classList.remove("border-red-500", "bg-red-50/50");

    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
        processSelectedFile(e.dataTransfer.files[0]);
    }
}

function handleFileSelected(e) {
    if (e.target && e.target.files && e.target.files[0]) {
        processSelectedFile(e.target.files[0]);
    }
}

function processSelectedFile(file) {
    currentUploadedFile = file;
    const previewCard = document.getElementById("file-preview-card");
    const previewName = document.getElementById("preview-file-name");
    const previewSize = document.getElementById("preview-file-size");
    const previewIcon = document.getElementById("preview-file-icon");

    if (!previewCard || !previewName || !previewSize || !previewIcon) return;

    previewName.innerText = file.name;
    const sizeKB = (file.size / 1024).toFixed(1);
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    const displaySize = file.size > 1048576 ? `${sizeMB} MB` : `${sizeKB} KB`;

    const ext = file.name.split('.').pop().toLowerCase();
    previewSize.innerText = `${displaySize} • ${ext.toUpperCase()} Dosyası`;

    if (ext === "pdf") {
        previewIcon.innerHTML = `<i class="fa-solid fa-file-pdf text-red-600"></i>`;
        previewIcon.className = "w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-lg flex-shrink-0";
    } else if (["docx", "doc"].includes(ext)) {
        previewIcon.innerHTML = `<i class="fa-solid fa-file-word text-blue-600"></i>`;
        previewIcon.className = "w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-lg flex-shrink-0";
    } else if (["pptx", "ppt"].includes(ext)) {
        previewIcon.innerHTML = `<i class="fa-solid fa-file-powerpoint text-orange-600"></i>`;
        previewIcon.className = "w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-lg flex-shrink-0";
    } else {
        previewIcon.innerHTML = `<i class="fa-solid fa-file text-slate-600"></i>`;
        previewIcon.className = "w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center text-lg flex-shrink-0";
    }

    previewCard.classList.remove("hidden");
    previewCard.classList.add("block");
}

function removeSelectedFile() {
    currentUploadedFile = null;
    const fileInput = document.getElementById("adv-file-input");
    if (fileInput) fileInput.value = "";
    const previewCard = document.getElementById("file-preview-card");
    if (previewCard) {
        previewCard.classList.add("hidden");
        previewCard.classList.remove("block");
    }
}

function renderTagsBadges() {
    const container = document.getElementById("tags-badge-container");
    if (!container) return;

    if (!currentTagsList || currentTagsList.length === 0) {
        container.innerHTML = `<span class="text-slate-400 text-xs italic">Etiket eklenmedi</span>`;
        return;
    }

    container.innerHTML = currentTagsList.map((tag, idx) => `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-100/70 text-red-800 text-[11px] font-bold">
            #${tag}
            <button type="button" onclick="removeCustomTag(${idx})" class="hover:text-red-950 font-black">×</button>
        </span>
    `).join("");
}

function addCustomTag() {
    const tagInput = document.getElementById("adv-tag-input");
    if (!tagInput) return;
    const val = tagInput.value.trim().replace(/^#/, "");
    if (val && !currentTagsList.includes(val)) {
        currentTagsList.push(val);
        renderTagsBadges();
        tagInput.value = "";
    }
}

function removeCustomTag(idx) {
    if (currentTagsList && currentTagsList.length > idx) {
        currentTagsList.splice(idx, 1);
        renderTagsBadges();
    }
}

// -------------------------------------------------------------
// 💾 FORM KAYDETME & YAYINLAMA FONKSİYONU (TAM KORUMALI)
// -------------------------------------------------------------

async function handleAdvMaterialSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();

    const titleInput = document.getElementById("adv-title-input");
    const gradeSelect = document.getElementById("adv-grade-select");
    const categorySelect = document.getElementById("adv-category-select");
    const customTopicInput = document.getElementById("adv-custom-topic-input");
    const unitSelect = document.getElementById("adv-unit-select");
    const descInput = document.getElementById("adv-desc-input");
    const linkInput = document.getElementById("adv-link-input");
    const visibilitySelect = document.getElementById("adv-visibility-select");
    const submitBtn = document.getElementById("submit-material-btn");

    if (!titleInput) return;

    const title = titleInput.value.trim();
    if (!title) {
        titleInput.focus();
        titleInput.classList.add("border-red-500", "ring-2", "ring-red-500/30");
        showToast("⚠️ Lütfen bir 'İçerik Başlığı' yazınız!", "error");
        return;
    }

    titleInput.classList.remove("border-red-500", "ring-2", "ring-red-500/30");

    const grade = gradeSelect ? gradeSelect.value : "8";
    const category = categorySelect ? categorySelect.value : "ders-notu";
    const customTopic = customTopicInput ? customTopicInput.value.trim() : "";
    const unit = customTopic || (unitSelect && unitSelect.value ? unitSelect.value : `${grade}. Sınıf Fen Bilimleri`);
    const desc = descInput && descInput.value.trim() ? descInput.value.trim() : "Rotalı Fenci özel eğitim materyali.";
    const linkVal = linkInput ? linkInput.value.trim() : "";
    const visibility = visibilitySelect ? visibilitySelect.value : "public";

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Kaydediliyor...`;
    }

    try {
        let customList = [];
        try {
            customList = JSON.parse(localStorage.getItem("rotali_custom_materials") || "[]");
        } catch (err) {
            customList = [];
        }

        const materialId = editingMaterialId || `mat-${Date.now()}`;
        let fileFormat = "PDF";
        let finalFileName = `${title}.pdf`;
        let externalUrl = linkVal || "";
        let hasBlob = false;

        // Dosya veya Link İşleme
        if (currentUploadedFile) {
            finalFileName = currentUploadedFile.name;
            fileFormat = finalFileName.split('.').pop().toUpperCase();
            hasBlob = true;
            // IDB'ye kaydet
            await RotaliDB.saveFile(materialId, currentUploadedFile, finalFileName, fileFormat);
        } else if (linkVal) {
            if (linkVal.includes("youtube.com") || linkVal.includes("youtu.be")) fileFormat = "YouTube Video";
            else if (linkVal.includes("drive.google.com")) fileFormat = "Google Drive";
            else if (linkVal.includes("canva.com")) fileFormat = "Canva";
            else fileFormat = "Web Bağlantısı";
            finalFileName = linkVal;
        }

        if (editingMaterialId) {
            const idx = customList.findIndex(item => item.id === editingMaterialId);
            if (idx !== -1) {
                customList[idx] = {
                    ...customList[idx],
                    grade: grade,
                    category: category,
                    title: title,
                    unit: unit,
                    desc: desc,
                    fileName: currentUploadedFile ? finalFileName : customList[idx].fileName,
                    fileUrl: externalUrl || customList[idx].fileUrl || "#",
                    format: fileFormat || customList[idx].format,
                    hasBlob: hasBlob || customList[idx].hasBlob,
                    tags: (currentTagsList && currentTagsList.length > 0) ? [...currentTagsList] : customList[idx].tags,
                    visibility: visibility,
                    updatedAt: new Date().toLocaleDateString("tr-TR")
                };
            }
            editingMaterialId = null;
            showToast(`✅ "${title}" başarıyla güncellendi!`, "success");
        } else {
            const newMaterial = {
                id: materialId,
                grade: grade,
                category: category,
                title: title,
                unit: unit,
                desc: desc,
                fileName: finalFileName,
                fileUrl: externalUrl || "#",
                format: fileFormat,
                hasBlob: hasBlob,
                tags: (currentTagsList && currentTagsList.length > 0) ? [...currentTagsList] : ["MEB 2026-2027"],
                visibility: visibility,
                downloadCount: "Yeni",
                createdAt: new Date().toLocaleDateString("tr-TR")
            };
            customList.unshift(newMaterial);
            showToast(`🎉 "${title}" başarıyla yayınlandı ve kaydedildi!`, "success");
        }

        try {
            localStorage.setItem("rotali_custom_materials", JSON.stringify(customList));
        } catch (storageErr) {
            console.warn("LocalStorage hatası:", storageErr);
        }

        closeMaterialUploadModal();

        // Sayfayı hedefe yönlendir ve yenile
        if (grade === "all") {
            window.location.hash = "projects";
        } else {
            window.location.hash = `grade/grade-${grade}/${category}`;
        }

        handleRouteChange();

    } catch (error) {
        console.error("Kaydetme hatası:", error);
        showToast("⚠️ Kayıt sırasında bir hata oluştu: " + error.message, "error");
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> <span>Tekrar Dene</span>`;
        }
    }
}

// -------------------------------------------------------------
// 🎨 ÖZEL MATERYALLERİ LİSTELEME BİLEŞENİ
// -------------------------------------------------------------

function renderCustomMaterialsSection(gradeNumber, subTab) {
    let customList = [];
    try {
        customList = JSON.parse(localStorage.getItem("rotali_custom_materials") || "[]");
    } catch (e) {
        customList = [];
    }

    const isAdmin = localStorage.getItem("rotali_is_admin") === "true";
    const items = customList.filter(item => {
        const gradeMatch = (item.grade === "all" || String(item.grade) === String(gradeNumber));
        const categoryMatch = (subTab === "uniteler" || item.category === subTab);
        return gradeMatch && categoryMatch;
    });

    if (!items || items.length === 0) return "";

    return `
        <div class="mb-10 animate-in fade-in duration-300">
            <div class="flex items-center justify-between mb-4">
                <h4 class="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>✨ Yönetici Tarafından Eklenen Özel Materyaller (${items.length})</span>
                </h4>
                <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">2026-2027 MEB Yayında</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${items.map(item => `
                    <div class="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-6 border-2 border-emerald-500/30 shadow-md hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden group">
                        <div class="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-bl-full pointer-events-none"></div>

                        <div>
                            <div class="flex items-center justify-between gap-2 mb-3">
                                <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black tracking-wider uppercase inline-block">
                                    ${item.format || 'DOKÜMAN'}
                                </span>
                                <span class="text-[10px] font-bold text-slate-400">${item.createdAt || 'Bugün'}</span>
                            </div>

                            <div class="text-[11px] font-black text-red-600 mb-1 uppercase tracking-wide">${item.unit || ''}</div>
                            <h4 class="text-base font-black text-slate-900 mb-2 leading-snug group-hover:text-emerald-700 transition-colors">${item.title}</h4>
                            <p class="text-xs text-slate-600 leading-relaxed mb-4 font-medium">${(item.desc || '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>

                            ${item.tags && item.tags.length > 0 ? `
                                <div class="flex flex-wrap gap-1 mb-4">
                                    ${item.tags.map(t => `<span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">#${t}</span>`).join("")}
                                </div>
                            ` : ''}
                        </div>

                        <div class="pt-3 border-t border-slate-200/80 flex flex-col gap-2">
                            <button type="button" onclick="openOrDownloadMaterial('${item.id}', '${item.fileUrl || '#'}', '${(item.fileName || 'materyal.pdf').replace(/'/g, "\\'")}')" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20">
                                <i class="fa-solid fa-download"></i> <span>Aç / İndir</span>
                            </button>

                            ${isAdmin ? `
                                <div class="flex items-center gap-2 mt-1">
                                    <button type="button" onclick="editCustomMaterial('${item.id}')" class="flex-1 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-xl border border-amber-200 transition-all flex items-center justify-center gap-1.5" title="Düzenle / Konum Değiştir">
                                        <i class="fa-solid fa-pen-to-square"></i> Düzenle
                                    </button>
                                    <button type="button" onclick="deleteCustomMaterial('${item.id}')" class="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition-all flex items-center justify-center gap-1.5" title="Sil">
                                        <i class="fa-solid fa-trash-can"></i> Sil
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}
