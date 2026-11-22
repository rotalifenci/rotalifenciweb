import os

# 1. Update index.html and ../index.html
def update_index(filepath):
    if not os.path.exists(filepath):
        print(f"Not found: {filepath}")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    target = '<script src="js/app.js?v=20261101_1435"></script>'
    replacement = '<script src="js/app.js?v=20261101_1435"></script>\n    <script src="js/tubitak-research.js?v=20261111_0200"></script>'
    if 'tubitak-research.js' not in html and target in html:
        html = html.replace(target, replacement)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"Updated {filepath} with tubitak-research.js script")
    else:
        print(f"Already updated or target not found in {filepath}")

# 2. Update js/app.js and ../js/app.js
def update_app_js(filepath):
    if not os.path.exists(filepath):
        print(f"Not found: {filepath}")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        code = f.read()

    # Route hash 'tubitak'
    if 'hash === "tubitak"' not in code:
        target_route = '} else if (hash === "projects") {'
        replacement_route = '} else if (hash === "projects" || hash === "tubitak" || hash.startsWith("projects/") || hash.startsWith("tubitak/")) {'
        code = code.replace(target_route, replacement_route)
        print(f"Updated hash route in {filepath}")

    # Top tab switcher & tubitak container in renderProjectsPage
    if 'id="tubitak-research-container"' not in code:
        target_render = 'function renderProjectsPage(container) {\n    const isAdmin = localStorage.getItem("rotali_is_admin") === "true";\n\n    container.innerHTML = `\n        <div x-data="projectFilterData()" x-init="init()" class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 animate-in fade-in duration-300">'
        
        replacement_render = '''function renderProjectsPage(container) {
    const isAdmin = localStorage.getItem("rotali_is_admin") === "true";

    container.innerHTML = `
        <div class="max-w-[1540px] mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 animate-in fade-in duration-300">
            <!-- 🏆 PROJE VE BİLİM MERKEZİ ÜST GEÇİŞ SEKMELERİ -->
            <div class="mb-8 flex items-center justify-between gap-3 bg-white p-2.5 sm:p-3 rounded-3xl border border-slate-200/90 shadow-sm overflow-x-auto no-scrollbar">
                <div class="flex items-center gap-2">
                    <button type="button" onclick="switchProjectCenterTab('tubitak-research')" id="tab-btn-tubitak-research" class="px-4 sm:px-6 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer shadow-sm bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-slate-950">
                        <i class="fa-solid fa-microscope text-sm"></i>
                        <span>TÜBİTAK Bilimsel Araştırma Merkezi (3 Proje)</span>
                    </button>
                    <button type="button" onclick="switchProjectCenterTab('codeweek')" id="tab-btn-codeweek" class="px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer text-slate-600 hover:bg-slate-100 hover:text-slate-900">
                        <i class="fa-solid fa-laptop-code text-sm text-indigo-600"></i>
                        <span>AB Kod Haftası Etkinlikleri</span>
                    </button>
                    <button type="button" onclick="switchProjectCenterTab('guides')" id="tab-btn-guides" class="px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer text-slate-600 hover:bg-slate-100 hover:text-slate-900">
                        <i class="fa-solid fa-book-open text-sm text-amber-600"></i>
                        <span>2204-B Rapor Rehberleri</span>
                    </button>
                </div>
            </div>

            <!-- 🔬 1. TÜBİTAK BİLİMSEL ARAŞTIRMA VE OTOMATİK KAYIT SİSTEMİ -->
            <div id="section-tubitak-research" class="transition-all duration-300">
                <div id="tubitak-research-container"></div>
            </div>

            <!-- 🇪🇺 2. AB KOD HAFTASI BÖLÜMÜ (GİZLENEBİLİR) -->
            <div id="section-codeweek" class="hidden transition-all duration-300">
                <div x-data="projectFilterData()" x-init="init()">'''
        
        if target_render in code:
            code = code.replace(target_render, replacement_render)
            
            # Wrap codeweek end
            target_codeweek_end = '''            <!-- Kullanıcının Eklediği Özel Kod Haftası Materyalleri -->
            ${renderCustomMaterialsSection("all", "projeler")}
        </div>
    `;

    // 🚀 Alpine.js Dinamik Ağaç Başlatma'''
            
            replacement_codeweek_end = '''            <!-- Kullanıcının Eklediği Özel Kod Haftası Materyalleri -->
            ${renderCustomMaterialsSection("all", "projeler")}
                </div>
            </div>

            <!-- 📄 3. TÜBİTAK 2204-B RAPOR REHBERLERİ VE ŞABLONLARI -->
            <div id="section-guides" class="hidden transition-all duration-300">
                <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center text-xl font-black">
                            <i class="fa-solid fa-book-open"></i>
                        </div>
                        <div>
                            <span class="text-xs font-black text-amber-600 uppercase">TÜBİTAK 2204-B</span>
                            <h3 class="text-xl font-black text-slate-900">Proje Rapor Rehberi & Şablon Arşivi</h3>
                        </div>
                    </div>
                    <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 leading-relaxed">
                        TÜBİTAK Ortaokul Öğrencileri Araştırma Projeleri Yarışması standart formatına uygun resmî rapor şablonlarını Word (.doc) ve PDF formatında bilgisayarınıza veya telefonunuza indirebilirsiniz.
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
                            <div>
                                <h4 class="font-black text-slate-900 text-sm">TÜBİTAK 2204-B Resmî Proje Rehberi</h4>
                                <p class="text-xs text-slate-500 mt-1">Yarışma kuralları, proje ana ve tematik alanları, etik kurallar ve değerlendirme kriterleri.</p>
                            </div>
                            <a href="assets/docs/2204-b-proje-rehberi.pdf" target="_blank" class="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black self-start flex items-center gap-1.5 hover:bg-slate-800 transition-all">
                                <i class="fa-solid fa-file-pdf text-red-400"></i> Rehberi Aç (PDF)
                            </a>
                        </div>
                        <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
                            <div>
                                <h4 class="font-black text-slate-900 text-sm">Resmî Proje Rapor Şablonu (.doc)</h4>
                                <p class="text-xs text-slate-500 mt-1">Özet, Giriş, Yöntem, Bulgular, Sonuç ve Kaynakça formatında hazırlanmış doldurulabilir şablon.</p>
                            </div>
                            <button type="button" onclick="openProjectTemplateModal('tubitak-2204b')" class="px-4 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-black self-start flex items-center gap-1.5 hover:bg-amber-600 transition-all cursor-pointer">
                                <i class="fa-solid fa-file-word text-blue-900"></i> Şablonu İncele & İndir
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 🔬 TÜBİTAK Araştırma Merkezini Başlat
    setTimeout(() => {
        const tContainer = document.getElementById("tubitak-research-container");
        if (tContainer && window.RotaliTubitak && typeof window.RotaliTubitak.renderMainContainer === "function") {
            window.RotaliTubitak.renderMainContainer(tContainer);
        }
    }, 50);

    // 🚀 Alpine.js Dinamik Ağaç Başlatma'''
            code = code.replace(target_codeweek_end, replacement_codeweek_end)
            print(f"Updated renderProjectsPage layout in {filepath}")

    # Add window.switchProjectCenterTab definition if not exists
    if 'window.switchProjectCenterTab' not in code:
        tab_switcher_func = '''
// 🏆 PROJE VE BİLİM MERKEZİ SEKME DEĞİŞTİRİCİSİ
window.switchProjectCenterTab = function(tabId) {
    const secResearch = document.getElementById("section-tubitak-research");
    const secCodeweek = document.getElementById("section-codeweek");
    const secGuides = document.getElementById("section-guides");

    const btnResearch = document.getElementById("tab-btn-tubitak-research");
    const btnCodeweek = document.getElementById("tab-btn-codeweek");
    const btnGuides = document.getElementById("tab-btn-guides");

    const activeClasses = "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-slate-950 shadow-sm";
    const inactiveClasses = "text-slate-600 hover:bg-slate-100 hover:text-slate-900";

    if (btnResearch) btnResearch.className = `px-4 sm:px-6 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${tabId === 'tubitak-research' ? activeClasses : inactiveClasses}`;
    if (btnCodeweek) btnCodeweek.className = `px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${tabId === 'codeweek' ? activeClasses : inactiveClasses}`;
    if (btnGuides) btnGuides.className = `px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${tabId === 'guides' ? activeClasses : inactiveClasses}`;

    if (secResearch) secResearch.classList.toggle("hidden", tabId !== "tubitak-research");
    if (secCodeweek) secCodeweek.classList.toggle("hidden", tabId !== "codeweek");
    if (secGuides) secGuides.classList.toggle("hidden", tabId !== "guides");

    if (tabId === "tubitak-research" && window.RotaliTubitak && typeof window.RotaliTubitak.renderMainContainer === "function") {
        const tContainer = document.getElementById("tubitak-research-container");
        if (tContainer) window.RotaliTubitak.renderMainContainer(tContainer);
    }
};
'''
        code = code + "\n" + tab_switcher_func
        print(f"Added window.switchProjectCenterTab to {filepath}")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(code)
    print(f"Finished updating {filepath}")

update_index('index.html')
update_index('../index.html')
update_app_js('js/app.js')
update_app_js('../js/app.js')
