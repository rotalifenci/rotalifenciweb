const fs = require('fs');
const path = require('path');

const appPath = path.resolve(__dirname, '../js/app.js');
let appJs = fs.readFileSync(appPath, 'utf8');

// Find start of window.projectFilterData
const filterDataStart = 'window.projectFilterData = function() {';
const renderProjectsPageStart = 'function renderProjectsPage(container) {';

const idxFilterData = appJs.indexOf(filterDataStart);
const idxRenderProjects = appJs.indexOf(renderProjectsPageStart);

if (idxFilterData === -1 || idxRenderProjects === -1) {
    console.error('Points not found!', { idxFilterData, idxRenderProjects });
    process.exit(1);
}

// Find the end of renderProjectsPage - look for `Alpine.initTree(container);` then closing `}`
const alpineInitStr = 'Alpine.initTree(container);';
const idxAlpineInit = appJs.indexOf(alpineInitStr, idxRenderProjects);
if (idxAlpineInit === -1) {
    console.error('idxAlpineInit not found!');
    process.exit(1);
}
const idxRenderProjectsEnd = appJs.indexOf('}', appJs.indexOf('}', idxAlpineInit) + 1) + 1;

console.log('Replacing from', idxFilterData, 'to', idxRenderProjectsEnd);

const newProjectsSectionCode = `window.projectFilterData = function() {
    return {
        codeWeekGradeTab: 'all',
        searchQuery: '',
        isAdmin: localStorage.getItem("rotali_is_admin") === "true",
        codeWeekActivities: window.getCodeWeekActivitiesWithCustom(),
        init() {
            window.addEventListener('rotali-codeweek-updated', () => {
                this.codeWeekActivities = window.getCodeWeekActivitiesWithCustom();
            });
            window.addEventListener('storage', (e) => {
                if (e.key === 'rotali_custom_codeweek_activities') {
                    this.codeWeekActivities = window.getCodeWeekActivitiesWithCustom();
                }
            });
        },
        toggleGradeTab(grade) {
            if (this.codeWeekGradeTab === grade) {
                this.codeWeekGradeTab = 'all';
            } else {
                this.codeWeekGradeTab = grade;
            }
        },
        getGradeActivities(grade) {
            let list = this.codeWeekActivities.filter(a => a.grade === grade);
            if (!this.searchQuery || !this.searchQuery.trim()) return list;
            const q = this.searchQuery.toLowerCase().trim();
            return list.filter(act => 
                (act.title && act.title.toLowerCase().includes(q)) ||
                (act.outcome && act.outcome.toLowerCase().includes(q)) ||
                (act.description && act.description.toLowerCase().includes(q)) ||
                (act.subtitle && act.subtitle.toLowerCase().includes(q)) ||
                (act.badge && act.badge.toLowerCase().includes(q))
            );
        },
        get totalVisibleCount() {
            return this.getGradeActivities('5').length + this.getGradeActivities('6').length + this.getGradeActivities('7').length;
        },
        openCodeWeekModal(act) {
            if (act && act.image) {
                if (typeof openInPageDocumentModal === 'function') {
                    openInPageDocumentModal(act.image, act.title || 'CodeWeek Çalışma Kâğıdı', act.title + '.jpg', true);
                    return;
                }
            }
            if (typeof window.openCodeWeekImageModal === 'function') {
                window.openCodeWeekImageModal(act);
            }
        },
        printCodeWeekActivity(act) {
            if (typeof window.printCodeWeekImage === 'function') {
                window.printCodeWeekImage(act);
            }
        },
        openEditCodeWeekModal(act) {
            if (typeof window.openEditCodeWeekModal === 'function') {
                window.openEditCodeWeekModal(act);
            }
        }
    };
};

function renderProjectsPage(container) {
    const isAdmin = localStorage.getItem("rotali_is_admin") === "true";

    container.innerHTML = \`
        <div x-data="projectFilterData()" x-init="init()" class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 animate-in fade-in duration-300">
            <!-- 🌟 EU CODEWEEK ÖZEL BAŞLIK & VİTRİN BANNERI -->
            <div class="mb-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-sky-950 text-white p-6 sm:p-10 border-2 border-indigo-500/30 shadow-2xl relative overflow-hidden">
                <!-- Dekoratif Işıklar ve Grid -->
                <div class="absolute -top-24 -right-24 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>
                <div class="absolute -bottom-24 -left-24 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>
                <div class="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

                <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div class="space-y-3 max-w-3xl">
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 shadow-xs">
                                <span class="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                                <span>EU CodeWeek 2026</span>
                            </span>
                            <span class="px-3 py-1 rounded-full text-xs font-black bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1.5">
                                <i class="fa-regular fa-calendar text-[11px]"></i>
                                <span>10 – 25 Ekim 2026</span>
                            </span>
                            <span class="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                                <i class="fa-solid fa-leaf text-[11px]"></i>
                                <span>Code for a Greener Planet</span>
                            </span>
                        </div>
                        <h2 class="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                            <span class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-indigo-600/50 border border-indigo-400/40 flex items-center justify-center text-indigo-300 text-xl sm:text-2xl shrink-0">
                                <i class="fa-solid fa-laptop-code"></i>
                            </span>
                            <span>AB Kod Haftası: 5, 6 ve 7. Sınıf Fen & Algoritma Etkinlikleri</span>
                        </h2>
                        <p class="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                            Avrupa Kodlama Haftası (EU Code Week) kapsamında ortaokul Fen Bilimleri dersleri için özel hazırlanan akıllı tahta ve A4 baskı uyumlu algoritmik düşünme, sıralı komutlar, koşullu karar ağaçları ve çevre bilinci çalışma kâğıtları.
                        </p>
                    </div>

                    <!-- İstatistik Rozeti -->
                    <div class="flex sm:flex-col lg:flex-row items-center gap-3 shrink-0 bg-white/10 backdrop-blur-md px-5 py-4 rounded-3xl border border-white/15 shadow-inner">
                        <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white text-xl shadow-md shrink-0">
                            <i class="fa-solid fa-shapes"></i>
                        </div>
                        <div>
                            <div class="text-xs font-bold text-slate-300 uppercase tracking-wider">Etkinlik Koleksiyonu</div>
                            <div class="text-lg font-black text-white">6 Özel Çalışma Kâğıdı</div>
                            <div class="text-[11px] text-emerald-300 font-semibold flex items-center gap-1 mt-0.5">
                                <i class="fa-solid fa-check"></i> Akıllı Tahta & A4 Baskı Uyumlu
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 🔘 SINIF SEVİYESİ SEÇİMİ VE ARAMA KUTUSU (TÜMÜ KALDIRILDI, SINIF SINIF GÖRÜNÜM) -->
            <div class="mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm">
                <!-- Sol: Sınıf Sekmeleri (5, 6, 7. Sınıf) -->
                <div class="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
                    <button 
                        type="button" 
                        @click="toggleGradeTab('5')" 
                        class="px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer select-none active:scale-95 shadow-2xs"
                        :class="codeWeekGradeTab === '5' 
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-[1.02]' 
                            : (codeWeekGradeTab === 'all' ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 ring-2 ring-emerald-500/20' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 opacity-75')"
                        title="5. Sınıf Etkinliklerini Filtrele / Göster"
                    >
                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                        <span>5. Sınıf</span>
                        <span class="px-2 py-0.5 rounded-full text-[11px] font-bold" :class="codeWeekGradeTab === '5' ? 'bg-emerald-800 text-white' : 'bg-emerald-200 text-emerald-900'" x-text="getGradeActivities('5').length"></span>
                    </button>

                    <button 
                        type="button" 
                        @click="toggleGradeTab('6')" 
                        class="px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer select-none active:scale-95 shadow-2xs"
                        :class="codeWeekGradeTab === '6' 
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-[1.02]' 
                            : (codeWeekGradeTab === 'all' ? 'bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 ring-2 ring-blue-500/20' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 opacity-75')"
                        title="6. Sınıf Etkinliklerini Filtrele / Göster"
                    >
                        <span class="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                        <span>6. Sınıf</span>
                        <span class="px-2 py-0.5 rounded-full text-[11px] font-bold" :class="codeWeekGradeTab === '6' ? 'bg-blue-800 text-white' : 'bg-blue-200 text-blue-900'" x-text="getGradeActivities('6').length"></span>
                    </button>

                    <button 
                        type="button" 
                        @click="toggleGradeTab('7')" 
                        class="px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer select-none active:scale-95 shadow-2xs"
                        :class="codeWeekGradeTab === '7' 
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 scale-[1.02]' 
                            : (codeWeekGradeTab === 'all' ? 'bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 ring-2 ring-purple-500/20' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 opacity-75')"
                        title="7. Sınıf Etkinliklerini Filtrele / Göster"
                    >
                        <span class="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                        <span>7. Sınıf</span>
                        <span class="px-2 py-0.5 rounded-full text-[11px] font-bold" :class="codeWeekGradeTab === '7' ? 'bg-purple-800 text-white' : 'bg-purple-200 text-purple-900'" x-text="getGradeActivities('7').length"></span>
                    </button>
                </div>

                <!-- Sağ: Arama Kutusu -->
                <div class="relative min-w-[260px] sm:min-w-[300px]">
                    <input 
                        type="text" 
                        x-model="searchQuery" 
                        placeholder="Etkinlik adı, kazanım veya anahtar kelime..." 
                        class="w-full px-4 py-2.5 pl-10 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-2xs"
                    >
                    <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                    <button 
                        type="button" 
                        x-show="searchQuery" 
                        @click="searchQuery = ''" 
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-600 text-xs font-bold p-1 cursor-pointer"
                        title="Aramayı Temizle"
                    >
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>

            <!-- ============================================================== -->
            <!-- 📦 SINIF SINIF ETKİNLİK LİSTESİ -->
            <!-- ============================================================== -->

            <!-- 🌱 5. SINIF BÖLÜMÜ -->
            <div x-show="(codeWeekGradeTab === 'all' || codeWeekGradeTab === '5') && getGradeActivities('5').length > 0" class="mb-12">
                <div class="flex items-center justify-between pb-3.5 mb-5 border-b-2 border-emerald-500/20 flex-wrap gap-2">
                    <div class="flex items-center gap-3">
                        <span class="w-9 h-9 rounded-2xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center font-black text-sm border border-emerald-500/25 shadow-xs shrink-0">
                            <i class="fa-solid fa-seedling"></i>
                        </span>
                        <div>
                            <h3 class="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <span>5. Sınıf Fen & Algoritma Etkinlikleri</span>
                            </h3>
                            <p class="text-xs text-slate-500 font-medium">Algoritmik düşünme, sıralı komutlar, atık sınıflandırma ve çevre farkındalığı</p>
                        </div>
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
                        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span x-text="getGradeActivities('5').length + ' Çalışma Kâğıdı'"></span>
                    </span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                    <template x-for="act in getGradeActivities('5')" :key="act.id">
                        <div class="bg-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-100 hover:border-emerald-400 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative">
                            <div>
                                <!-- Üst Rozet Satırı -->
                                <div class="flex items-center justify-between gap-2 mb-3.5 flex-wrap">
                                    <span class="px-3 py-1 rounded-xl text-xs font-black border flex items-center gap-2 bg-emerald-50 text-emerald-800 border-emerald-200">
                                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                        <span x-text="act.badge"></span>
                                    </span>
                                    <span class="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-bold text-[11px] border border-slate-200">
                                        <i class="fa-solid fa-code text-emerald-600 mr-1"></i> Fen & Algoritma
                                    </span>
                                </div>

                                <!-- Görsel Önizleme / Tıklanabilir Kart -->
                                <div @click="openCodeWeekModal(act)" class="relative rounded-2xl overflow-hidden mb-4 bg-slate-950 border border-slate-200/80 aspect-[4/3] group-hover:border-emerald-400 cursor-pointer shadow-inner">
                                    <img :src="act.image" :alt="act.title" class="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" loading="lazy">
                                    <div class="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-2xs">
                                        <span class="px-3.5 py-2 rounded-xl bg-white text-slate-950 font-black text-xs shadow-lg flex items-center gap-2">
                                            <i class="fa-solid fa-magnifying-glass-plus text-emerald-600"></i>
                                            <span>Tam Ekran İncele</span>
                                        </span>
                                    </div>
                                </div>

                                <!-- Başlık & Alt Başlık -->
                                <h3 class="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors mb-1.5 leading-snug" x-text="act.title"></h3>
                                <p class="text-xs font-semibold text-slate-500 mb-3" x-text="act.subtitle"></p>

                                <!-- Fen & Algoritma Kazanımı -->
                                <div class="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 mb-4 text-xs text-slate-800 flex items-start gap-2.5">
                                    <span class="w-5 h-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                                        <i class="fa-solid fa-bullseye"></i>
                                    </span>
                                    <div>
                                        <span class="text-[10px] font-black uppercase text-emerald-900 block tracking-wider">Hedef Kazanım</span>
                                        <span class="font-bold text-slate-700 leading-relaxed" x-text="act.outcome"></span>
                                    </div>
                                </div>

                                <!-- Etkinlik Adımları -->
                                <div class="space-y-1.5 mb-4">
                                    <template x-for="(sec, sIdx) in act.sections" :key="sIdx">
                                        <div class="p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 font-medium flex items-start gap-2">
                                            <i class="fa-solid fa-circle-check text-emerald-500 text-[10px] mt-0.5 shrink-0"></i>
                                            <span class="line-clamp-2" x-text="sec"></span>
                                        </div>
                                    </template>
                                </div>

                                <!-- Slogan / Motto -->
                                <div class="py-2 px-3 rounded-xl bg-gradient-to-r from-slate-900 to-emerald-950 text-white text-[11px] font-bold text-center mb-4 border border-emerald-400/20">
                                    <span x-text="act.motto"></span>
                                </div>
                            </div>

                            <!-- Kart Alt Aksiyon Butonları -->
                            <div class="pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                                <button type="button" @click="openCodeWeekModal(act)" class="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer">
                                    <i class="fa-regular fa-eye"></i>
                                    <span>Görüntüle</span>
                                </button>
                                <button type="button" @click="printCodeWeekActivity(act)" class="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-bold active:scale-95 cursor-pointer border border-slate-200" title="A4 Boyutunda Yazdır">
                                    <i class="fa-solid fa-print"></i>
                                </button>
                                <a :href="act.image" :download="act.title + '.jpg'" class="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-bold active:scale-95 cursor-pointer border border-slate-200" title="Yüksek Çözünürlüklü Görseli İndir">
                                    <i class="fa-solid fa-download"></i>
                                </a>
                                <!-- ✏️ YÖNETİCİ DÜZENLEME BUTONU -->
                                <template x-if="isAdmin">
                                    <button type="button" @click="openEditCodeWeekModal(act)" class="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-900 transition-colors text-xs font-black active:scale-95 cursor-pointer border border-amber-300 flex items-center gap-1.5 shadow-2xs" title="Bu Etkinliği Düzenle (Yönetici)">
                                        <i class="fa-solid fa-pen-to-square text-amber-600"></i>
                                        <span>Düzenle</span>
                                    </button>
                                </template>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <!-- 🌊 6. SINIF BÖLÜMÜ -->
            <div x-show="(codeWeekGradeTab === 'all' || codeWeekGradeTab === '6') && getGradeActivities('6').length > 0" class="mb-12">
                <div class="flex items-center justify-between pb-3.5 mb-5 border-b-2 border-blue-500/20 flex-wrap gap-2">
                    <div class="flex items-center gap-3">
                        <span class="w-9 h-9 rounded-2xl bg-blue-500/15 text-blue-700 flex items-center justify-center font-black text-sm border border-blue-500/25 shadow-xs shrink-0">
                            <i class="fa-solid fa-droplet"></i>
                        </span>
                        <div>
                            <h3 class="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <span>6. Sınıf Fen & Algoritma Etkinlikleri</span>
                            </h3>
                            <p class="text-xs text-slate-500 font-medium">Koşullu durumlar (Eğer... ise), döngüler, akış şemaları ve problem çözme</p>
                        </div>
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1.5 shadow-2xs">
                        <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                        <span x-text="getGradeActivities('6').length + ' Çalışma Kâğıdı'"></span>
                    </span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                    <template x-for="act in getGradeActivities('6')" :key="act.id">
                        <div class="bg-white rounded-3xl p-5 sm:p-6 border-2 border-blue-100 hover:border-blue-400 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative">
                            <div>
                                <!-- Üst Rozet Satırı -->
                                <div class="flex items-center justify-between gap-2 mb-3.5 flex-wrap">
                                    <span class="px-3 py-1 rounded-xl text-xs font-black border flex items-center gap-2 bg-blue-50 text-blue-800 border-blue-200">
                                        <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                                        <span x-text="act.badge"></span>
                                    </span>
                                    <span class="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-bold text-[11px] border border-slate-200">
                                        <i class="fa-solid fa-code text-blue-600 mr-1"></i> Fen & Algoritma
                                    </span>
                                </div>

                                <!-- Görsel Önizleme / Tıklanabilir Kart -->
                                <div @click="openCodeWeekModal(act)" class="relative rounded-2xl overflow-hidden mb-4 bg-slate-950 border border-slate-200/80 aspect-[4/3] group-hover:border-blue-400 cursor-pointer shadow-inner">
                                    <img :src="act.image" :alt="act.title" class="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" loading="lazy">
                                    <div class="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-2xs">
                                        <span class="px-3.5 py-2 rounded-xl bg-white text-slate-950 font-black text-xs shadow-lg flex items-center gap-2">
                                            <i class="fa-solid fa-magnifying-glass-plus text-blue-600"></i>
                                            <span>Tam Ekran İncele</span>
                                        </span>
                                    </div>
                                </div>

                                <!-- Başlık & Alt Başlık -->
                                <h3 class="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors mb-1.5 leading-snug" x-text="act.title"></h3>
                                <p class="text-xs font-semibold text-slate-500 mb-3" x-text="act.subtitle"></p>

                                <!-- Fen & Algoritma Kazanımı -->
                                <div class="p-3 rounded-2xl bg-blue-50/70 border border-blue-100 mb-4 text-xs text-slate-800 flex items-start gap-2.5">
                                    <span class="w-5 h-5 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                                        <i class="fa-solid fa-bullseye"></i>
                                    </span>
                                    <div>
                                        <span class="text-[10px] font-black uppercase text-blue-900 block tracking-wider">Hedef Kazanım</span>
                                        <span class="font-bold text-slate-700 leading-relaxed" x-text="act.outcome"></span>
                                    </div>
                                </div>

                                <!-- Etkinlik Adımları -->
                                <div class="space-y-1.5 mb-4">
                                    <template x-for="(sec, sIdx) in act.sections" :key="sIdx">
                                        <div class="p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 font-medium flex items-start gap-2">
                                            <i class="fa-solid fa-circle-check text-blue-500 text-[10px] mt-0.5 shrink-0"></i>
                                            <span class="line-clamp-2" x-text="sec"></span>
                                        </div>
                                    </template>
                                </div>

                                <!-- Slogan / Motto -->
                                <div class="py-2 px-3 rounded-xl bg-gradient-to-r from-slate-900 to-blue-950 text-white text-[11px] font-bold text-center mb-4 border border-blue-400/20">
                                    <span x-text="act.motto"></span>
                                </div>
                            </div>

                            <!-- Kart Alt Aksiyon Butonları -->
                            <div class="pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                                <button type="button" @click="openCodeWeekModal(act)" class="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 active:scale-95 cursor-pointer">
                                    <i class="fa-regular fa-eye"></i>
                                    <span>Görüntüle</span>
                                </button>
                                <button type="button" @click="printCodeWeekActivity(act)" class="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-bold active:scale-95 cursor-pointer border border-slate-200" title="A4 Boyutunda Yazdır">
                                    <i class="fa-solid fa-print"></i>
                                </button>
                                <a :href="act.image" :download="act.title + '.jpg'" class="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-bold active:scale-95 cursor-pointer border border-slate-200" title="Yüksek Çözünürlüklü Görseli İndir">
                                    <i class="fa-solid fa-download"></i>
                                </a>
                                <!-- ✏️ YÖNETİCİ DÜZENLEME BUTONU -->
                                <template x-if="isAdmin">
                                    <button type="button" @click="openEditCodeWeekModal(act)" class="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-900 transition-colors text-xs font-black active:scale-95 cursor-pointer border border-amber-300 flex items-center gap-1.5 shadow-2xs" title="Bu Etkinliği Düzenle (Yönetici)">
                                        <i class="fa-solid fa-pen-to-square text-amber-600"></i>
                                        <span>Düzenle</span>
                                    </button>
                                </template>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <!-- ⚡ 7. SINIF BÖLÜMÜ -->
            <div x-show="(codeWeekGradeTab === 'all' || codeWeekGradeTab === '7') && getGradeActivities('7').length > 0" class="mb-12">
                <div class="flex items-center justify-between pb-3.5 mb-5 border-b-2 border-purple-500/20 flex-wrap gap-2">
                    <div class="flex items-center gap-3">
                        <span class="w-9 h-9 rounded-2xl bg-purple-500/15 text-purple-700 flex items-center justify-center font-black text-sm border border-purple-500/25 shadow-xs shrink-0">
                            <i class="fa-solid fa-bolt"></i>
                        </span>
                        <div>
                            <h3 class="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <span>7. Sınıf Fen & Algoritma Etkinlikleri</span>
                            </h3>
                            <p class="text-xs text-slate-500 font-medium">Sensör verileri, akıllı sera algoritmaları, veri grafiği analizi ve sürdürülebilirlik</p>
                        </div>
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs font-black bg-purple-50 text-purple-800 border border-purple-200 flex items-center gap-1.5 shadow-2xs">
                        <span class="w-2 h-2 rounded-full bg-purple-500"></span>
                        <span x-text="getGradeActivities('7').length + ' Çalışma Kâğıdı'"></span>
                    </span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                    <template x-for="act in getGradeActivities('7')" :key="act.id">
                        <div class="bg-white rounded-3xl p-5 sm:p-6 border-2 border-purple-100 hover:border-purple-400 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative">
                            <div>
                                <!-- Üst Rozet Satırı -->
                                <div class="flex items-center justify-between gap-2 mb-3.5 flex-wrap">
                                    <span class="px-3 py-1 rounded-xl text-xs font-black border flex items-center gap-2 bg-purple-50 text-purple-800 border-purple-200">
                                        <span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                                        <span x-text="act.badge"></span>
                                    </span>
                                    <span class="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-bold text-[11px] border border-slate-200">
                                        <i class="fa-solid fa-code text-purple-600 mr-1"></i> Fen & Algoritma
                                    </span>
                                </div>

                                <!-- Görsel Önizleme / Tıklanabilir Kart -->
                                <div @click="openCodeWeekModal(act)" class="relative rounded-2xl overflow-hidden mb-4 bg-slate-950 border border-slate-200/80 aspect-[4/3] group-hover:border-purple-400 cursor-pointer shadow-inner">
                                    <img :src="act.image" :alt="act.title" class="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" loading="lazy">
                                    <div class="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-2xs">
                                        <span class="px-3.5 py-2 rounded-xl bg-white text-slate-950 font-black text-xs shadow-lg flex items-center gap-2">
                                            <i class="fa-solid fa-magnifying-glass-plus text-purple-600"></i>
                                            <span>Tam Ekran İncele</span>
                                        </span>
                                    </div>
                                </div>

                                <!-- Başlık & Alt Başlık -->
                                <h3 class="text-base sm:text-lg font-black text-slate-900 group-hover:text-purple-700 transition-colors mb-1.5 leading-snug" x-text="act.title"></h3>
                                <p class="text-xs font-semibold text-slate-500 mb-3" x-text="act.subtitle"></p>

                                <!-- Fen & Algoritma Kazanımı -->
                                <div class="p-3 rounded-2xl bg-purple-50/70 border border-purple-100 mb-4 text-xs text-slate-800 flex items-start gap-2.5">
                                    <span class="w-5 h-5 rounded-lg bg-purple-600 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                                        <i class="fa-solid fa-bullseye"></i>
                                    </span>
                                    <div>
                                        <span class="text-[10px] font-black uppercase text-purple-900 block tracking-wider">Hedef Kazanım</span>
                                        <span class="font-bold text-slate-700 leading-relaxed" x-text="act.outcome"></span>
                                    </div>
                                </div>

                                <!-- Etkinlik Adımları -->
                                <div class="space-y-1.5 mb-4">
                                    <template x-for="(sec, sIdx) in act.sections" :key="sIdx">
                                        <div class="p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 font-medium flex items-start gap-2">
                                            <i class="fa-solid fa-circle-check text-purple-500 text-[10px] mt-0.5 shrink-0"></i>
                                            <span class="line-clamp-2" x-text="sec"></span>
                                        </div>
                                    </template>
                                </div>

                                <!-- Slogan / Motto -->
                                <div class="py-2 px-3 rounded-xl bg-gradient-to-r from-slate-900 to-purple-950 text-white text-[11px] font-bold text-center mb-4 border border-purple-400/20">
                                    <span x-text="act.motto"></span>
                                </div>
                            </div>

                            <!-- Kart Alt Aksiyon Butonları -->
                            <div class="pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                                <button type="button" @click="openCodeWeekModal(act)" class="flex-1 py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/20 active:scale-95 cursor-pointer">
                                    <i class="fa-regular fa-eye"></i>
                                    <span>Görüntüle</span>
                                </button>
                                <button type="button" @click="printCodeWeekActivity(act)" class="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-bold active:scale-95 cursor-pointer border border-slate-200" title="A4 Boyutunda Yazdır">
                                    <i class="fa-solid fa-print"></i>
                                </button>
                                <a :href="act.image" :download="act.title + '.jpg'" class="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-bold active:scale-95 cursor-pointer border border-slate-200" title="Yüksek Çözünürlüklü Görseli İndir">
                                    <i class="fa-solid fa-download"></i>
                                </a>
                                <!-- ✏️ YÖNETİCİ DÜZENLEME BUTONU -->
                                <template x-if="isAdmin">
                                    <button type="button" @click="openEditCodeWeekModal(act)" class="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-900 transition-colors text-xs font-black active:scale-95 cursor-pointer border border-amber-300 flex items-center gap-1.5 shadow-2xs" title="Bu Etkinliği Düzenle (Yönetici)">
                                        <i class="fa-solid fa-pen-to-square text-amber-600"></i>
                                        <span>Düzenle</span>
                                    </button>
                                </template>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <!-- ⚠️ ARAMA SONUCU BULUNAMADI -->
            <div x-show="totalVisibleCount === 0" class="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto mb-12 shadow-xs">
                <div class="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl mx-auto mb-3">
                    <i class="fa-solid fa-folder-open"></i>
                </div>
                <h4 class="text-base font-black text-slate-800 mb-1">Eşleşen Etkinlik Bulunamadı</h4>
                <p class="text-xs text-slate-500 mb-4">Arama kriterlerinizi değiştirebilir veya arama kutusunu temizleyebilirsiniz.</p>
                <button type="button" @click="codeWeekGradeTab = 'all'; searchQuery = ''" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer">
                    Filtreleri Temizle
                </button>
            </div>

            \${isAdmin ? \`
            <!-- 🛠️ YÖNETİCİ DOKÜMAN EKLEME ALANI -->
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-gradient-to-r from-indigo-50 via-slate-50 to-blue-50 border border-indigo-200 p-5 rounded-3xl shadow-sm">
                <div class="flex items-center gap-3.5">
                    <div class="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow-md shrink-0">
                        <i class="fa-solid fa-file-circle-plus"></i>
                    </div>
                    <div>
                        <h3 class="text-sm sm:text-base font-black text-slate-900">Kod Haftası & STEM Materyal Yönetimi</h3>
                        <p class="text-xs text-slate-500 font-medium">Bu bölüme dilediğiniz ek çalışma kâğıdını, afişi veya rehber dokümanı yükleyebilirsiniz.</p>
                    </div>
                </div>
                <div class="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                    <button type="button" onclick="openMaterialUploadModal('projeler', 'projeler', null, 'AB Kod Haftası')" class="flex-1 sm:flex-none px-5 py-3 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer">
                        <i class="fa-solid fa-plus-circle text-sm"></i>
                        <span>➕ Yeni Etkinlik / Doküman Ekle</span>
                    </button>
                </div>
            </div>
            \` : ''}

            <!-- Kullanıcının Eklediği Özel Kod Haftası Materyalleri -->
            \${renderCustomMaterialsSection("all", "projeler")}
        </div>
    \`;

    // 🚀 Alpine.js Dinamik Ağaç Başlatma
    if (window.Alpine && typeof Alpine.initTree === "function") {
        try {
            Alpine.initTree(container);
        } catch (e) {
            console.error("Alpine init tree hatası:", e);
        }
    }
}
`;

appJs = appJs.slice(0, idxFilterData) + newProjectsSectionCode + appJs.slice(idxRenderProjectsEnd);
fs.writeFileSync(appPath, appJs, 'utf8');
console.log('Successfully updated renderProjectsPage and projectFilterData');
