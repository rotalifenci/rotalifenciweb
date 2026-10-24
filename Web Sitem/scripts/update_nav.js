const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'js', 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

const startMarker = "function updateAdminNavUI() {";
const endMarker = "// Gizli Yönetici Girişi Kısayolu";

const startIndex = appJs.indexOf(startMarker);
const endIndex = appJs.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const newFunc = `function updateAdminNavUI() {
    const isAdmin = localStorage.getItem("rotali_is_admin") === "true";
    ADMIN_CONFIG.isAdmin = isAdmin;

    // 1. Üst Bar: Sadece Giriş Yapıldığında Yaprak Test & Yönetici Butonlarını Göster
    const topContainer = document.getElementById("admin-nav-container");
    if (topContainer) {
        if (isAdmin) {
            topContainer.innerHTML = \`
                <div class="flex items-center gap-1.5 animate-in fade-in duration-200">
                    <a href="yaprak-test.html" target="_blank" class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer border border-indigo-500" title="📝 Yaprak Test & Soru Bankası Portalı (Yönetici)">
                        <i class="fa-solid fa-file-pen text-amber-300"></i> <span class="hidden md:inline">Yaprak Test</span>
                    </a>
                    <button type="button" onclick="if (window.RotaliCloud) RotaliCloud.openSettingsModal()" class="px-3 py-1.5 rounded-xl bg-indigo-900/80 hover:bg-indigo-800 text-indigo-200 font-black text-xs flex items-center gap-1.5 shadow-sm transition-all border border-indigo-700/60 active:scale-95 cursor-pointer" title="☁️ Supabase Bulut Veritabanı ve Depolama Ayarları">
                        <i class="fa-solid fa-cloud"></i> <span class="hidden md:inline">Bulut Ayarları</span>
                    </button>
                    <button type="button" onclick="triggerManualCloudSync(this)" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-black text-xs flex items-center gap-1.5 shadow-sm transition-all border border-slate-700 active:scale-95 cursor-pointer" title="☁️ Canlı Bulut Eşitlemesini Çalıştır">
                        <i class="fa-solid fa-cloud-arrow-down"></i> <span class="hidden md:inline">Bulut Eşitle</span>
                    </button>
                    <button type="button" onclick="triggerUploadModal('5', 'ders-notu')" class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer" title="Hızlı Materyal Ekle">
                        <i class="fa-solid fa-plus text-xs"></i> <span class="hidden md:inline">Ekle</span>
                    </button>
                    <button type="button" onclick="handleAdminLogout()" class="px-3 sm:px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border border-rose-500" title="👑 Yönetici Oturumunu Kapat">
                        <i class="fa-solid fa-arrow-right-from-bracket text-sm"></i>
                        <span>Çıkış Yap</span>
                    </button>
                </div>
            \`;
        } else {
            topContainer.innerHTML = "";
        }
    }

    // 2. Mobil Menü: Sadece Yönetici Giriş Yapıldığında Yaprak Test & Yönetim Paneli Göster
    const mobileAdminContainer = document.getElementById("admin-mobile-nav-container");
    if (mobileAdminContainer) {
        if (isAdmin) {
            mobileAdminContainer.innerHTML = \`
                <div class="space-y-2 pt-2 border-t border-slate-200 animate-in fade-in duration-200">
                    <div class="text-[11px] font-black uppercase text-slate-400 tracking-wider px-2">👑 Yönetici Özel Portalları</div>
                    <a href="yaprak-test.html" target="_blank" class="block px-4 py-3 rounded-2xl text-base font-black tracking-wider uppercase text-white bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2.5 shadow-md">
                        <i class="fa-solid fa-file-pen text-amber-300 text-lg"></i> <span>📝 YAPRAK TEST & SORU BANKASI</span>
                    </a>
                    <button type="button" onclick="triggerUploadModal('5', 'ders-notu')" class="w-full text-left px-4 py-3 rounded-2xl text-base font-black tracking-wider uppercase text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-2.5 shadow-md cursor-pointer">
                        <i class="fa-solid fa-plus text-lg"></i> <span>YENİ MATERYAL EKLE</span>
                    </button>
                    <button type="button" onclick="handleAdminLogout()" class="w-full text-left px-4 py-3 rounded-2xl text-base font-black tracking-wider uppercase text-white bg-rose-600 hover:bg-rose-700 flex items-center gap-2.5 shadow-md cursor-pointer">
                        <i class="fa-solid fa-arrow-right-from-bracket text-lg"></i> <span>YÖNETİCİ ÇIKIŞ YAP</span>
                    </button>
                </div>
            \`;
        } else {
            mobileAdminContainer.innerHTML = "";
        }
    }

    // 3. Alt Bilgi (Footer) Göstergesi
    const footerIndicator = document.getElementById("admin-status-indicator");
    if (footerIndicator) {
        if (isAdmin) {
            footerIndicator.className = "flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-900/60 border border-emerald-500/40 text-xs text-emerald-300";
            footerIndicator.innerHTML = \`
                <i class="fa-solid fa-shield-check text-emerald-400"></i>
                <span>Yönetici Aktif</span>
                <button onclick="handleAdminLogout()" class="ml-2 px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold" title="Çıkış Yap"><i class="fa-solid fa-arrow-right-from-bracket mr-1"></i>Çıkış</button>
            \`;
        } else {
            footerIndicator.className = "hidden";
            footerIndicator.innerHTML = "";
        }
    }
}

`;

    appJs = appJs.substring(0, startIndex) + newFunc + appJs.substring(endIndex);
    fs.writeFileSync(appJsPath, appJs, 'utf8');
    console.log('✔ updateAdminNavUI successfully updated in js/app.js!');
} else {
    console.error('❌ Markers not found in js/app.js: startIndex=' + startIndex + ', endIndex=' + endIndex);
}
