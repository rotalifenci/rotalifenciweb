/**
 * ROTALI FENCİ — Dijital Fen Bilimleri Eğitim Portalı & LMS Veri Merkezi
 * MEB Güncel Müfredatı, LGS Standartları ve Öğretmen Çalışma Alanı
 */

const PORTAL_CONFIG = {
    brandName: "ROTALI FENCİ",
    portalTitle: "Dijital Fen Bilimleri Eğitim Portalı",
    tagline: "Öğrenci için öğrenme platformu, öğretmen için çalışma alanı, okul için dijital eğitim merkezi.",
    academicYear: "2026-2027 MEB Müfredat Sürümü",
    activeRole: "student", // 'student' | 'teacher'
    stats: [
        { label: "Aktif Öğrenci & Öğretmen", value: "24.500+", icon: "fa-solid fa-users" },
        { label: "Kazanım & Ünite Hub'ı", value: "32 Ünite", icon: "fa-solid fa-layer-group" },
        { label: "LGS Soru & Deneme Havuzu", value: "1.250+", icon: "fa-solid fa-trophy" },
        { label: "STEM & Deney Protokolü", value: "48 Deney", icon: "fa-solid fa-flask" },
        { label: "Öğretmen Evrak & Materyali", value: "180+ Belge", icon: "fa-solid fa-folder-open" }
    ]
};

// 1. SINIF DÜZEYLERİ & MÜFREDAT HARİTASI
const PORTAL_GRADES = [
    {
        id: "grade-5",
        number: 5,
        title: "5. Sınıf Fen Bilimleri",
        slug: "5-sinif",
        color: "from-emerald-500 to-teal-600",
        badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        accentColor: "#10b981",
        description: "Güneş, Dünya ve Ay; Canlılar Dünyası; Kuvvetin Ölçülmesi ve Sürtünme; Madde ve Değişim; Işığın Yayılması.",
        unitCount: 7,
        units: [
            { id: "5-unit-1", code: "F.5.1", name: "Güneş, Dünya ve Ay", icon: "fa-solid fa-sun", topics: 3, hours: 16 },
            { id: "5-unit-2", code: "F.5.2", name: "Canlılar Dünyası", icon: "fa-solid fa-paw", topics: 4, hours: 20 },
            { id: "5-unit-3", code: "F.5.3", name: "Kuvvetin Ölçülmesi ve Sürtünme", icon: "fa-solid fa-weight-hanging", topics: 2, hours: 14 },
            { id: "5-unit-4", code: "F.5.4", name: "Madde ve Değişim", icon: "fa-solid fa-flask-vial", topics: 4, hours: 24 },
            { id: "5-unit-5", code: "F.5.5", name: "Işığın Yayılması", icon: "fa-solid fa-lightbulb", topics: 3, hours: 16 },
            { id: "5-unit-6", code: "F.5.6", name: "İnsan ve Çevre", icon: "fa-solid fa-tree", topics: 2, hours: 12 },
            { id: "5-unit-7", code: "F.5.7", name: "Elektrik Devre Elemanları", icon: "fa-solid fa-bolt", topics: 2, hours: 10 }
        ]
    },
    {
        id: "grade-6",
        number: 6,
        title: "6. Sınıf Fen Bilimleri",
        slug: "6-sinif",
        color: "from-blue-500 to-indigo-600",
        badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
        accentColor: "#3b82f6",
        description: "Güneş Sistemi ve Tutulmalar; Vücudumuzdaki Sistemler; Kuvvet ve Hareket; Madde ve Isı; Ses ve Özellikleri.",
        unitCount: 7,
        units: [
            { id: "6-unit-1", code: "F.6.1", name: "Güneş Sistemi ve Tutulmalar", icon: "fa-solid fa-globe", topics: 2, hours: 14 },
            { id: "6-unit-2", code: "F.6.2", name: "Vücudumuzdaki Sistemler", icon: "fa-solid fa-heart-pulse", topics: 5, hours: 26 },
            { id: "6-unit-3", code: "F.6.3", name: "Kuvvet ve Hareket", icon: "fa-solid fa-gauge-high", topics: 2, hours: 16 },
            { id: "6-unit-4", code: "F.6.4", name: "Madde ve Isı", icon: "fa-solid fa-temperature-arrow-up", topics: 3, hours: 18 },
            { id: "6-unit-5", code: "F.6.5", name: "Ses ve Özellikleri", icon: "fa-solid fa-volume-high", topics: 3, hours: 14 },
            { id: "6-unit-6", code: "F.6.6", name: "Vücudumuzdaki Sistemler ve Sağlığı", icon: "fa-solid fa-brain", topics: 3, hours: 12 },
            { id: "6-unit-7", code: "F.6.7", name: "Elektriğin İletimi", icon: "fa-solid fa-plug", topics: 2, hours: 12 }
        ]
    },
    {
        id: "grade-7",
        number: 7,
        title: "7. Sınıf Fen Bilimleri",
        slug: "7-sinif",
        color: "from-amber-500 to-orange-600",
        badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
        accentColor: "#f59e0b",
        description: "Güneş Sistemi ve Ötesi; Hücre ve Bölünmeler; Kuvvet ve Enerji; Saf Madde ve Karışımlar; Işığın Madde ile Etkileşimi.",
        unitCount: 7,
        units: [
            { id: "7-unit-1", code: "F.7.1", name: "Güneş Sistemi ve Ötesi", icon: "fa-solid fa-satellite", topics: 2, hours: 14 },
            { id: "7-unit-2", code: "F.7.2", name: "Hücre ve Bölünmeler", icon: "fa-solid fa-dna", topics: 3, hours: 22, featured: true },
            { id: "7-unit-3", code: "F.7.3", name: "Kuvvet ve Enerji", icon: "fa-solid fa-arrows-spin", topics: 3, hours: 20 },
            { id: "7-unit-4", code: "F.7.4", name: "Saf Madde ve Karışımlar", icon: "fa-solid fa-atom", topics: 4, hours: 22 },
            { id: "7-unit-5", code: "F.7.5", name: "Işığın Madde ile Etkileşimi", icon: "fa-solid fa-glasses", topics: 3, hours: 16 },
            { id: "7-unit-6", code: "F.7.6", name: "Canlılarda Üreme, Büyüme ve Gelişme", icon: "fa-solid fa-seedling", topics: 2, hours: 14 },
            { id: "7-unit-7", code: "F.7.7", name: "Elektrik Devreleri", icon: "fa-solid fa-microchip", topics: 2, hours: 12 }
        ]
    },
    {
        id: "grade-8",
        number: 8,
        title: "8. Sınıf + LGS Pusulası",
        slug: "8-sinif-lgs",
        color: "from-red-600 to-rose-700",
        badgeBg: "bg-red-50 text-red-700 border-red-200",
        accentColor: "#dc2626",
        description: "Mevsimler ve İklim; DNA ve Genetik Kod; Basınç; Madde ve Endüstri; Basit Makineler; Enerji Dönüşümleri.",
        unitCount: 7,
        isLGS: true,
        units: [
            { id: "8-unit-1", code: "F.8.1", name: "Mevsimler ve İklim", icon: "fa-solid fa-cloud-sun", topics: 2, hours: 16, lgsQuestions: 2, featured: true },
            { id: "8-unit-2", code: "F.8.2", name: "DNA ve Genetik Kod", icon: "fa-solid fa-dna", topics: 4, hours: 24, lgsQuestions: 4 },
            { id: "8-unit-3", code: "F.8.3", name: "Basınç (Katı, Sıvı, Gaz)", icon: "fa-solid fa-gauge", topics: 3, hours: 20, lgsQuestions: 2, featured: true },
            { id: "8-unit-4", code: "F.8.4", name: "Madde ve Endüstri", icon: "fa-solid fa-vial-circle-check", topics: 6, hours: 32, lgsQuestions: 5 },
            { id: "8-unit-5", code: "F.8.5", name: "Basit Makineler", icon: "fa-solid fa-gears", topics: 2, hours: 16, lgsQuestions: 2 },
            { id: "8-unit-6", code: "F.8.6", name: "Enerji Dönüşümleri ve Çevre Bilimi", icon: "fa-solid fa-leaf", topics: 4, hours: 20, lgsQuestions: 3 },
            { id: "8-unit-7", code: "F.8.7", name: "Elektrik Yükleri ve Elektrik Enerjisi", icon: "fa-solid fa-bolt-lightning", topics: 3, hours: 16, lgsQuestions: 2 }
        ]
    }
];

// 2. ÜNİTE HUB STANDARDI (5 ADIMLI: ÖĞREN, KEŞFET, UYGULA, ÇÖZ, ANALİZ)
const UNIT_HUBS = {
    "7-unit-2": {
        id: "7-unit-2",
        grade: "7. Sınıf",
        gradeSlug: "grade-7",
        unitCode: "F.7.2",
        title: "Hücre ve Bölünmeler",
        icon: "fa-solid fa-dna",
        color: "from-indigo-600 to-purple-700",
        description: "Hücrenin temel kısımları, bitki ve hayvan hücresi farkları, organeller, mitoz ve mayoz bölünme evreleri.",
        
        // 1. ADIM: ÖĞREN
        ogren: {
            summaryHtml: `
                <div class="space-y-6 text-slate-700">
                    <div class="bg-indigo-50/80 border-l-4 border-indigo-600 p-4 rounded-r-xl">
                        <h4 class="font-bold text-indigo-900 text-base mb-1">🎯 Ünite Kazanım Özeti:</h4>
                        <p class="text-sm text-indigo-800">Hayvan ve bitki hücrelerini karşılaştırarak temel kısımlarını ve organellerini açıklar. Mitoz ve Mayoz bölünmenin canlılar için önemini ve evrelerini kavrar.</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                            <h5 class="font-black text-slate-800 flex items-center gap-2 mb-2">
                                <i class="fa-solid fa-leaf text-emerald-600"></i> Bitki Hücresi
                            </h5>
                            <ul class="text-xs space-y-1.5 text-slate-600 list-disc list-inside">
                                <li>Hücre duvarı (çeperi) <strong>vardır</strong> (selüloz yapılı, sert).</li>
                                <li>Şekli köşelidir. Kloroplast organeli bulunur.</li>
                                <li>Kofulları büyük ve az sayıdadır. Sentrozom bulunmaz.</li>
                            </ul>
                        </div>
                        <div class="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                            <h5 class="font-black text-slate-800 flex items-center gap-2 mb-2">
                                <i class="fa-solid fa-dog text-amber-600"></i> Hayvan Hücresi
                            </h5>
                            <ul class="text-xs space-y-1.5 text-slate-600 list-disc list-inside">
                                <li>Hücre duvarı (çeperi) <strong>yoktur</strong>.</li>
                                <li>Şekli yuvarlaktır. Kloroplast bulunmaz.</li>
                                <li>Kofulları küçük ve çok sayıdadır. Sentrozom bulunur.</li>
                            </ul>
                        </div>
                    </div>

                    <div class="bg-amber-50 border border-amber-200 p-4 rounded-xl">
                        <h5 class="font-bold text-amber-900 mb-2 flex items-center gap-2">
                            <i class="fa-solid fa-scale-balanced text-amber-600"></i> Mitoz ve Mayoz Karşılaştırma Tablosu
                        </h5>
                        <div class="overflow-x-auto">
                            <table class="w-full text-xs text-left text-slate-700">
                                <thead class="bg-amber-100/70 text-amber-900 font-bold">
                                    <tr>
                                        <th class="p-2">Özellik</th>
                                        <th class="p-2">Mitoz Bölünme</th>
                                        <th class="p-2">Mayoz Bölünme</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-amber-200">
                                    <tr><td class="p-2 font-medium">Görüldüğü Hücre</td><td class="p-2">Vücut hücrelerinde (2n)</td><td class="p-2">Üreme ana hücrelerinde (2n)</td></tr>
                                    <tr><td class="p-2 font-medium">Oluşan Hücre Sayısı</td><td class="p-2">2 yeni hücre</td><td class="p-2">4 yeni hücre (n)</td></tr>
                                    <tr><td class="p-2 font-medium">Kromozom Sayısı</td><td class="p-2">Sabit kalır (2n -> 2n)</td><td class="p-2">Yarıya iner (2n -> n)</td></tr>
                                    <tr><td class="p-2 font-medium">Çeşitlilik</td><td class="p-2">Genetik çeşitlilik oluşmaz (Kalıtsal kopya)</td><td class="p-2">Parça değişimi (Crossing-over) ile çeşitlilik sağlanır</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `,
            glossary: [
                { term: "Organel", def: "Sitoplazma içinde yaşamsal faaliyetleri (solunum, sindirim, sentez vb.) yürüten özelleşmiş yapılar." },
                { term: "Sentrozom", def: "Hayvan hücresinde hücre bölünmesi sırasında iğ ipliklerini oluşturan organel." },
                { term: "Crossing-over (Parça Değişimi)", def: "Mayoz I profaz evresinde homolog kromozomların kardeş olmayan kromatitleri arasındaki gen alışverişi." }
            ]
        },

        // 2. ADIM: KEŞFET (İNTERAKTİF ETKİNLİKLER)
        kesfet: {
            title: "Organel ve Fonksiyon Eşleştirme Turnuvası",
            pairs: [
                { organel: "Mitokondri", gorev: "Hücresel Enerji Üretimi (ATP)" },
                { organel: "Ribozom", gorev: "Protein Sentezi" },
                { organel: "Kloroplast", gorev: "Fotosentez ile Besin ve Oksijen Üretimi" },
                { organel: "Lizozom", gorev: "Hücre İçi Sindirim" },
                { organel: "Golgi Aygıtı", gorev: "Salgı Üretimi ve Paketleme" },
                { organel: "Endoplazmik Retikulum", gorev: "Madde İletimi ve Taşınması" }
            ]
        },

        // 3. ADIM: UYGULA (ÇALIŞMA KAĞITLARI & DENEYLER)
        uygula: {
            worksheets: [
                { id: "ws-7-1", title: "7.2 Hücre ve Organelleri Kavram Çalışma Kağıdı", pages: 2, type: "PDF / A4", downloadCount: "1.420 İndirme" },
                { id: "ws-7-2", title: "Mitoz ve Mayoz Bölünme Karşılaştırma İstasyon Föyü", pages: 3, type: "Grup Etkinliği", downloadCount: "980 İndirme" }
            ],
            experiments: [
                {
                    id: "exp-7-1",
                    title: "Mikroskop Altında Ağız İçi Epitel ve Soğan Zarı Hücresi İncelemesi",
                    duration: "40 dk",
                    materials: ["Işık mikroskobu", "Lam ve lamel", "Metilen mavisi / İyot", "Kürdan", "Soğan zarı"],
                    safetyNotes: "Metilen mavisi damlatırken eldiven kullanın, lamel kırılmalarına dikkat edin."
                }
            ],
            stemTask: {
                title: "3D Biyo-Mühendislik: Geri Dönüşüm Malzemeleriyle Fonksiyonel Hücre Modeli Tasarımı",
                problem: "Hücre organellerinin işlevlerini ve birbirleriyle olan madde iletim bağlarını gösteren dinamik bir 3D model geliştirilmesi.",
                stages: ["Problem Tespiti", "Malzeme Analizi", "Tasarım & Çizim", "Prototip Üretimi", "Test ve Sunum"]
            }
        },

        // 4. ADIM: ÇÖZ (MİNİ TEST & LGS YENİ NESİL TEST)
        coz: {
            quizId: "q-hucre-7",
            testTypes: [
                { name: "Kazanım Pekiştirme Testi", count: "12 Soru", duration: "18 dk", difficulty: "Orta" },
                { name: "Beceri Temelli / Görsel Analiz Testi", count: "10 Soru", duration: "20 dk", difficulty: "Zor" }
            ]
        },

        // 5. ADIM: ANALİZ (ÖĞRENCİ PERFORMANSI & HATA DEFTERİ)
        analiz: {
            commonMistakes: [
                "Sentrozomun bitki hücresinde var olduğu yanılgısı.",
                "Mitoz bölünme ile mayoz bölünmenin kromozom sayısına etkisini karıştırmak.",
                "Kloroplast ile mitokondrinin ürettiği gazları ters eşleştirmek."
            ],
            learningOutcomes: [
                { code: "F.7.2.1.1", text: "Hayvan ve bitki hücrelerini temel kısımları ve organelleri açısından karşılaştırır." },
                { code: "F.7.2.2.1", text: "Mitoz bölünmenin canlılar için önemini açıklar ve evrelerini modellerle gösterir." },
                { code: "F.7.2.3.1", text: "Mayoz bölünmenin canlılar için önemini ve üremedeki rolünü kavrar." }
            ]
        }
    },

    "8-unit-1": {
        id: "8-unit-1",
        grade: "8. Sınıf (LGS)",
        gradeSlug: "grade-8",
        unitCode: "F.8.1",
        title: "Mevsimler ve İklim",
        icon: "fa-solid fa-cloud-sun",
        color: "from-rose-600 to-red-700",
        description: "Dünya'nın eksen eğikliği ve dolanma hareketi, mevsimlerin oluşumu, güneş ışınlarının geliş açısı, iklim ve hava hareketleri.",
        ogren: {
            summaryHtml: `
                <div class="space-y-6 text-slate-700">
                    <div class="bg-rose-50 border-l-4 border-rose-600 p-4 rounded-r-xl">
                        <h4 class="font-bold text-rose-900 text-base mb-1">🎯 LGS Kritik Kazanım:</h4>
                        <p class="text-sm text-rose-800">Mevsimlerin oluşumunda iki temel faktör vardır: 1) Dünya'nın 23° 27' eksen eğikliği, 2) Dünya'nın Güneş etrafındaki dolanma hareketi. Dünya'nın Güneş'e olan uzaklığı mevsimlerin oluşumunu ETKİLEMEZ!</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div class="p-3 bg-white border border-slate-200 rounded-xl text-center">
                            <span class="text-xs font-black text-rose-600 block">21 HAZİRAN</span>
                            <span class="text-xs font-bold text-slate-800">Yengeç Dönencesi</span>
                            <p class="text-[11px] text-slate-500 mt-1">KYK Yaz, GYK Kış başlar. KYK'de en uzun gündüz yaşanır.</p>
                        </div>
                        <div class="p-3 bg-white border border-slate-200 rounded-xl text-center">
                            <span class="text-xs font-black text-rose-600 block">23 EYLÜL</span>
                            <span class="text-xs font-bold text-slate-800">Ekinoks (Ekvator)</span>
                            <p class="text-[11px] text-slate-500 mt-1">Gece-gündüz eşitliği (12s-12s). KYK Sonbahar, GYK İlkbahar.</p>
                        </div>
                        <div class="p-3 bg-white border border-slate-200 rounded-xl text-center">
                            <span class="text-xs font-black text-rose-600 block">21 ARALIK</span>
                            <span class="text-xs font-bold text-slate-800">Oğlak Dönencesi</span>
                            <p class="text-[11px] text-slate-500 mt-1">GYK Yaz, KYK Kış başlar. GYK'de en uzun gündüz yaşanır.</p>
                        </div>
                        <div class="p-3 bg-white border border-slate-200 rounded-xl text-center">
                            <span class="text-xs font-black text-rose-600 block">21 MART</span>
                            <span class="text-xs font-bold text-slate-800">Ekinoks (Ekvator)</span>
                            <p class="text-[11px] text-slate-500 mt-1">Gece-gündüz eşitliği. KYK İlkbahar, GYK Sonbahar.</p>
                        </div>
                    </div>
                </div>
            `,
            glossary: [
                { term: "Eksen Eğikliği", def: "Dünya'nın dönme ekseni ile yörünge düzlemi arasındaki 23° 27'lik açı." },
                { term: "Alçak Basınç (AB)", def: "Isınan havanın yükselmesiyle oluşan, bulutlu ve yağış ihtimali yüksek hava durumu." },
                { term: "Yüksek Basınç (YB)", def: "Soğuyan havanın alçalmasıyla oluşan, açık ve güneşli hava durumu. Rüzgar YB'den AB'ye doğru eser." }
            ]
        },
        kesfet: {
            title: "Güneş Işınlarının Geliş Açısı ve Gölge Boyu Eşleştirme",
            pairs: [
                { organel: "Dik Açı (90°)", gorev: "Maksimum Isı Transferi, En Kısa Gölge Boyu" },
                { organel: "Eğik Açı (<45°)", gorev: "Geniş Alan Aydınlanması, Uzun Gölge Boyu" },
                { organel: "Yüksek Basınç Alanı", gorev: "Alçalıcı Hava Hareketi, Açık ve Güneşli Gökyüzü" },
                { organel: "Alçak Basınç Alanı", gorev: "Yükselici Hava Hareketi, Bulutlu ve Yağış İhtimali" }
            ]
        },
        uygula: {
            worksheets: [
                { id: "ws-8-1", title: "LGS Mevsimler & İklim Grafik Yorumlama Föyü", pages: 3, type: "PDF", downloadCount: "3.200 İndirme" }
            ],
            experiments: [
                { id: "exp-8-1", title: "Farklı Açılarla Aydınlatılan Termometrelerin Sıcaklık Artışı Deneyi" }
            ]
        },
        coz: {
            quizId: "q-mevsimler-8",
            testTypes: [
                { name: "LGS Çıkmış & Örnek Soru Analiz Testi", count: "15 Soru", duration: "25 dk", difficulty: "LGS Düzeyi" }
            ]
        },
        analiz: {
            commonMistakes: [
                "Dünya'nın Güneşe yaklaştığında yaz olduğunu düşünmek (En büyük kavram yanılgısı!).",
                "Rüzgarın Alçak Basınçtan Yüksek Basınca estiğini sanmak."
            ]
        }
    },

    "8-unit-3": {
        id: "8-unit-3",
        grade: "8. Sınıf (LGS)",
        gradeSlug: "grade-8",
        unitCode: "F.8.3",
        title: "Basınç (Katı, Sıvı ve Gaz)",
        icon: "fa-solid fa-gauge",
        color: "from-blue-600 to-cyan-700",
        description: "Katı basıncı formülü (P=G/S), Sıvı basıncı değişkenleri (P=h.d.g), Pascal Prensibi ve Açık Hava Basıncı (Torricelli).",
        ogren: {
            summaryHtml: `
                <div class="space-y-4 text-slate-700">
                    <div class="bg-cyan-50 border-l-4 border-cyan-600 p-4 rounded-r-xl">
                        <h4 class="font-bold text-cyan-900 text-base mb-1">🎯 LGS Basınç Formülleri & Taktikleri:</h4>
                        <p class="text-sm text-cyan-800">Katı Basıncı: Ağırlıkla doğru, yüzey alanıyla ters orantılıdır. Sıvı Basıncı: Derinlik (h) ve yoğunlukla (d) doğru orantılıdır, kabın şekline ve sıvı miktarına bağlı DEĞİLDİR!</p>
                    </div>
                </div>
            `,
            glossary: [
                { term: "Pascal Prensibi", def: "Kapalı bir kaptaki sıvıya uygulanan basıncın sıvının her noktasına aynen iletilmesi ilkesi." },
                { term: "Torricelli Deneyi", def: "Deniz seviyesinde 0°C'de açık hava basıncının 76 cm-Cıva olduğunu ispatlayan deney." }
            ]
        },
        kesfet: {
            title: "Pascal Prensibi & Sıvı Basıncı Eşleştirme",
            pairs: [
                { organel: "Sıvı Derinliği (h)", gorev: "Derinlik arttıkça sıvı basıncı doğru orantılı artar" },
                { organel: "Sıvı Yoğunluğu (d)", gorev: "Yoğunluk arttıkça sıvı basıncı doğru orantılı artar" },
                { organel: "Hidrolik Fren Sistemi", gorev: "Pascal Prensibi (Sıvıların basıncı aynen iletmesi)" },
                { organel: "Açık Hava Basıncı", gorev: "Torricelli Deneyi (76 cm-Hg cıva yüksekliği)" }
            ]
        },
        uygula: {
            worksheets: [
                { id: "ws-8-3", title: "LGS Sıvı ve Katı Basıncı Değişken Analiz Föyü", pages: 4, type: "PDF" }
            ],
            experiments: [
                { id: "exp-8-3", title: "Haşlanmış Yumurta ve Şişe ile Açık Hava Basıncı İspatı Deneyi" }
            ]
        },
        coz: {
            quizId: "q-basinc-8",
            testTypes: [
                { name: "Basınç Yeni Nesil Soru Çözüm Paketi", count: "15 Soru", duration: "30 dk", difficulty: "Zor" }
            ]
        },
        analiz: {
            commonMistakes: [
                "Sıvı basıncının kabın taban alanına veya şekline bağlı olduğunu düşünmek.",
                "Katı basıncında ağırlık ve temas alanı aynı oranda arttığında basıncın arttığını sanmak (Sabit kalır!)."
            ]
        }
    }
};

// 3. YAZILI MERKEZİ VERİ HAVUZU (5, 6, 7, 8. SINIF ORTAK SINAV HAZIRLIĞI)
const EXAM_CENTER_DATA = {
    title: "MEB Ortak Yazılı Sınav Hazırlık Merkezi",
    description: "MEB senaryolarına tam uyumlu açık uçlu sorular, örnek sınav kağıtları, cevap anahtarları ve değerlendirme rubrikleri.",
    grades: [
        {
            gradeNumber: 5,
            terms: [
                {
                    term: 1,
                    exams: [
                        {
                            id: "exam-5-1-1",
                            name: "5. Sınıf 1. Dönem 1. Yazılı",
                            scenario: "MEB 1. Senaryo (Güneş, Dünya ve Ay)",
                            questionCount: 8,
                            format: "Açık Uçlu & Kısa Cevaplı",
                            topics: ["Güneş'in Yapısı ve Özellikleri", "Ay'ın Evreleri", "Güneş ve Ay Hareketleri"]
                        },
                        {
                            id: "exam-5-1-2",
                            name: "5. Sınıf 1. Dönem 2. Yazılı (Ortak)",
                            scenario: "MEB Ortak Yazılı Senaryosu (Ünite 1-2)",
                            questionCount: 10,
                            format: "Açık Uçlu & Beceri Temelli",
                            topics: ["Ay'ın Evreleri", "Canlıların Sınıflandırılması", "Kuvvetin Ölçülmesi"]
                        }
                    ]
                },
                {
                    term: 2,
                    exams: [
                        {
                            id: "exam-5-2-1",
                            name: "5. Sınıf 2. Dönem 1. Yazılı",
                            scenario: "MEB 2. Senaryo (Madde ve Değişim)",
                            questionCount: 8,
                            format: "Açık Uçlu & Tablo Yorumlama",
                            topics: ["Maddenin Hâl Değişimi", "Maddenin Ayırt Edici Özellikleri", "Isı ve Sıcaklık"]
                        }
                    ]
                }
            ]
        },
        {
            gradeNumber: 6,
            terms: [
                {
                    term: 1,
                    exams: [
                        {
                            id: "exam-6-1-1",
                            name: "6. Sınıf 1. Dönem 1. Yazılı",
                            scenario: "MEB 1. Senaryo (Güneş Sistemi & Tutulmalar)",
                            questionCount: 8,
                            format: "Açık Uçlu",
                            topics: ["Gezegenler", "Güneş ve Ay Tutulması", "Destek ve Hareket Sistemi"]
                        },
                        {
                            id: "exam-6-1-2",
                            name: "6. Sınıf 1. Dönem 2. Yazılı (Ortak)",
                            scenario: "MEB Ortak Yazılı Senaryosu (Ünite 1-2-3)",
                            questionCount: 10,
                            format: "Açık Uçlu & Deney Analizi",
                            topics: ["Sindirim & Dolaşım Sistemi", "Kuvvet ve Hareket", "Bileşke Kuvvet"]
                        }
                    ]
                }
            ]
        },
        {
            gradeNumber: 7,
            terms: [
                {
                    term: 1,
                    exams: [
                        {
                            id: "exam-7-1-1",
                            name: "7. Sınıf 1. Dönem 1. Yazılı",
                            scenario: "MEB 1. Senaryo (Uzay & Hücre)",
                            questionCount: 8,
                            format: "Açık Uçlu & Şema Çizimli",
                            topics: ["Uzay Araştırmaları", "Gök Cisimleri", "Hücre ve Organeller"]
                        },
                        {
                            id: "exam-7-1-2",
                            name: "7. Sınıf 1. Dönem 2. Yazılı (Ortak)",
                            scenario: "MEB Ortak Sınav 2. Senaryo (Hücre + Mitoz/Mayoz + Enerji)",
                            questionCount: 10,
                            format: "Açık Uçlu & Karşılaştırmalı",
                            topics: ["Mitoz ve Mayoz Bölünme", "Kütle ve Ağırlık", "Kinetik ve Potansiyel Enerji"]
                        }
                    ]
                }
            ]
        },
        {
            gradeNumber: 8,
            terms: [
                {
                    term: 1,
                    exams: [
                        {
                            id: "exam-8-1-1",
                            name: "8. Sınıf 1. Dönem 1. Yazılı (LGS Formatı)",
                            scenario: "MEB 1. Senaryo (Mevsimler ve İklim & DNA)",
                            questionCount: 8,
                            format: "Açık Uçlu & Yeni Nesil LGS Tipi",
                            topics: ["Mevsimlerin Oluşumu", "İklim ve Hava Hareketleri", "DNA ve Replikasyon", "Kalıtım & Çaprazlama"]
                        },
                        {
                            id: "exam-8-1-2",
                            name: "8. Sınıf 1. Dönem 2. Yazılı (Bakanlık Ortak Sınavı)",
                            scenario: "MEB Ülke Geneli Ortak Sınav Standart Senaryosu",
                            questionCount: 10,
                            format: "Açık Uçlu & Grafik-Deney Analizli",
                            topics: ["Mutasyon-Modifikasyon", "Katı-Sıvı Basıncı", "Periyodik Sistem", "Fiziksel-Kimyasal Değişim"]
                        }
                    ]
                }
            ]
        }
    ]
};

// 4. STEM & DENEY ATÖLYESİ
const STEM_WORKSHOP_DATA = {
    title: "STEM & Bilimsel Deney Laboratuvarı",
    description: "Mühendislik tasarım döngüsü (Problem -> Çözüm -> Prototip) ve okul laboratuvarı deney föyleri.",
    stemTasks: [
        {
            id: "stem-1",
            grade: "8. Sınıf",
            title: "Depreme Dayanıklı Hidrolik Bina Tasarımı",
            topic: "Basınç & Mühendislik",
            problem: "Sıvıların basıncı iletme prensibinden (Pascal) yararlanarak sismik titreşimleri sönümleyen hidrolik amortisörlü bir bina modeli tasarlayınız.",
            stages: [
                { name: "1. Problem & Araştırma", text: "Deprem dalgalarının rezonans etkilerini ve hidrolik pistonların çalışma mantığını araştırın." },
                { name: "2. Tasarım & Planlama", text: "Şırıngalar, plastik borular, su ve mukavva kullanarak kat planı çiziniz." },
                { name: "3. Prototip Üretimi", text: "Birbirine bağlı şırınga sistemini tabana monte ederek binayı inşa ediniz." },
                { name: "4. Test ve İyileştirme", text: "Deprem sarsıntı tablasında test ederek sıvı miktarını optimize ediniz." }
            ]
        },
        {
            id: "stem-2",
            grade: "7. Sınıf",
            title: "Güneş Enerjili Akıllı Sera Otomasyonu",
            topic: "Işık & Enerji Dönüşümleri",
            problem: "Kış aylarında bitki gelişimini hızlandırmak için güneş ışığını odaklayan ve sıcaklığı koruyan pasif solar sera prototipi geliştiriniz.",
            stages: [
                { name: "1. Problem & Araştırma", text: "Işığın soğurulması, aynalar ve sera etkisi mekanizmasını inceleyin." },
                { name: "2. Tasarım & Malzeme", text: "İçbükey yansıtıcı yüzeyler, şeffaf asetat ve ısı sensörü kullanın." },
                { name: "3. Üretim & Test", text: "Sıcaklık artış grafiğini çizerek verimi raporlayın." }
            ]
        },
        {
            id: "stem-3",
            grade: "6. Sınıf",
            title: "Biyonik El ve Kas-İskelet Mekaniği",
            topic: "Vücudumuzdaki Sistemler",
            problem: "İp, pipet ve mukavva kullanarak parmak hareketlerini taklit eden mekanik bir biyonik el yapınız.",
            stages: [
                { name: "1. Araştırma", text: "Tendon ve eklemlerin çalışma prensiplerini inceleyiniz." },
                { name: "2. Montaj", text: "Pipet eklemlerinden geçen misinalarla kavrama testleri yapınız." }
            ]
        }
    ],
    experiments: [
        {
            id: "exp-1",
            grade: "8. Sınıf",
            name: "Katı Basıncında Temas Alanı ve Ağırlık Değişken Analizi",
            materials: ["Özdeş sünger bloklar", "Özdeş tuğlalar/ağırlıklar", "Cetvel"],
            safety: "Ağırlıkları düşürmemeye dikkat ediniz.",
            steps: [
                "1. Tuğlayı geniş yüzeyi süngerin üzerine gelecek şekilde yerleştirin, batma miktarını ölçün.",
                "2. Tuğlayı dar yüzeyi süngerin üzerine gelecek şekilde koyun, batma miktarını ölçün.",
                "3. Üst üste iki tuğla koyarak ağırlığın etkisini gözlemleyin."
            ],
            scientificConclusion: "Basınç temas yüzeyi küçüldükçe artar; ağırlık arttıkça artar."
        },
        {
            id: "exp-2",
            grade: "7. Sınıf",
            name: "Işığın Farklı Renklerde Soğurulması ve Sıcaklık Değişimi",
            materials: ["Siyah ve beyaz kaplı özdeş kutular", "2 adet termometre", "Işık kaynağı / Güneş"],
            safety: "Işık kaynağına doğrudan uzun süre bakmayınız.",
            steps: [
                "1. Termometreleri siyah ve beyaz kutuların içine koyup başlangıç sıcaklıklarını kaydedin.",
                "2. 15 dakika boyunca eşit mesafeden ışığa maruz bırakın.",
                "3. Son sıcaklıkları karşılaştırın."
            ],
            scientificConclusion: "Koyu renkli yüzeyler ışığı daha çok soğurur ve sıcaklığı daha çok artar."
        },
        {
            id: "exp-3",
            grade: "5. Sınıf",
            name: "Dinamometre Yapımı ve Yay Esnekliği",
            materials: ["Paket lastiği / Sarmal yay", "Şeffaf şerit cetvel", "Ataş", "Farklı ağırlıklar"],
            safety: "Yayı esneklik sınırının üzerinde zorlamayınız.",
            steps: ["Yayın ucuna ağırlık taktıkça uzama miktarını ölçerek kuvvet kalibrasyonu yapınız."],
            scientificConclusion: "Uygulanan kuvvet arttıkça esnek cismin uzama miktarı doğru orantılı olarak artar."
        }
    ],
    codingProjects: [
        {
            id: "code-1",
            title: "Scratch ile Fen Simülatörü: Ay'ın Evreleri Animasyonu",
            platform: "Scratch 3.0",
            level: "Başlangıç / Orta",
            description: "Dünya ve Güneş etrafında dönen Ay'ın görünüm evrelerini kodlayarak interaktif bir simülasyon geliştirin."
        },
        {
            id: "code-2",
            title: "mBlock & Arduino ile Akıllı Sera Nem Sensörü",
            platform: "mBlock & Arduino UNO",
            level: "Orta / İleri",
            description: "Toprak nem sensöründen gelen değere göre otomatik su motorunu çalıştıran algoritmayı bloklarla kodlayın."
        }
    ]
};

// 5. PROJE MERKEZİ (TÜBİTAK 2204-B, 4006, TEKNOFEST, eTwinning)
const PROJECT_CENTER_DATA = {
    title: "Bilimsel Proje Geliştirme Merkezi",
    description: "Öğretmen ve öğrenciler için TÜBİTAK, TEKNOFEST ve eTwinning proje rehberleri, şablonları ve araştırma basamakları.",
    categories: [
        {
            id: "tubitak-2204b",
            name: "TÜBİTAK 2204-B Ortaokul Öğrencileri Araştırma Projeleri",
            badge: "Ulusal Yarışma",
            icon: "fa-solid fa-microscope",
            steps: [
                { step: "1. Konu & Problem", detail: "Özgün, yerel veya küresel bir fen/çevre problemini belirleyin." },
                { step: "2. Hipotez & Amaç", detail: "Sınanabilir bilimsel hipotezinizi kurun ve projenin amacını yazın." },
                { step: "3. Yöntem & Deney", detail: "Kontrollü deney, anket veya veri toplama adımlarını detaylandırın." },
                { step: "4. Bulgular & Analiz", detail: "Elde edilen verileri grafik ve istatistiklerle sunun." },
                { step: "5. Proje Raporu", detail: "Özet (150-250 kelime), Giriş, Yöntem, Bulgular, Sonuç ve Kaynakça formatına uyun." }
            ],
            ideas: [
                "Biyoplastik Üretimi: Meyve Kabuklarından Biyo-Çözünür Poşet Geliştirilmesi",
                "Akıllı Tarım: Manyetik Alanın Tohum Çimlenme Hızına Etkisi",
                "Su Tasarrufu: Gri Suyun Zeolit Filtre ile Geri Kazanımı"
            ]
        },
        {
            id: "tubitak-4006",
            name: "TÜBİTAK 4006 Bilim Fuarları Destekleme Programı",
            badge: "Okul Bilim Fuarı",
            icon: "fa-solid fa-school-flag",
            steps: [
                { step: "1. Alt Proje Türü Seçimi", detail: "Araştırma, İnceleme veya Tasarım projesi kategorisinden birini seçin." },
                { step: "2. Başvuru Metni", detail: "Amaç, Yöntem ve Beklenen Sonuç alanlarını 50-150 kelime aralığında yazın." },
                { step: "3. Fuar Sergisi", detail: "Afiş şablonu (Poster) ve öğrenci sunum kartlarını hazırlayın." }
            ],
            ideas: [
                "Farklı Sıvıların Yüzey Gerilimlerinin Karşılaştırılması (Araştırma)",
                "Geleneksel ve Modern İzolasyon Malzemelerinin Isı Yalıtım Performansı (Tasarım)",
                "Yöremizdeki Endemik Bitkilerin Tıbbi Özellikleri (İnceleme)"
            ]
        },
        {
            id: "teknofest",
            name: "TEKNOFEST Havacılık, Uzay ve Teknoloji Festivali",
            badge: "Teknoloji Yarışması",
            icon: "fa-solid fa-rocket",
            steps: [
                { step: "1. Kategori Belirleme", detail: "Eğitim Teknolojileri, İnsanlık Yararına Teknoloji, Çevre ve Enerji kategorileri." },
                { step: "2. Ön Değerlendirme Raporu", detail: "Proje özeti, çözülen problem ve yerlilik/özgünlük analizi." },
                { step: "3. Detay Raporu & Prototip", detail: "Çalışan prototip videosu ve teknik çizimler." }
            ],
            ideas: [
                "Yapay Zekâ Destekli Görme Engelliler İçin Akıllı Fen Laboratuvar Asistanı",
                "Mikroalg Filtreli Kentsel Hava Temizleme Kulesi"
            ]
        },
        {
            id: "etwinning",
            name: "eTwinning Uluslararası Eğitim Projeleri",
            badge: "Avrupa Topluluğu",
            icon: "fa-solid fa-earth-europe",
            steps: [
                { step: "1. Ortak Bulma", detail: "Avrupa'dan veya Türkiye'den Fen Bilimleri öğretmenleri ile ortaklık kurun." },
                { step: "2. TwinSpace Yönetimi", detail: "Öğrencilerin dijital güvenlik kurallarına uygun olarak etkinlik paylaşmasını sağlayın." },
                { step: "3. Ulusal Kalite Etiketi", detail: "Proje çıktıları, ortak ürün ve değerlendirme anketleri ile başvurun." }
            ],
            ideas: [
                "Young Scientists for Green Planet (Sürdürülebilir Çevre Projesi)",
                "STEM Without Borders (Sınırsız STEM Görevleri)"
            ]
        }
    ]
};

// 6. ÖĞRETMEN ODASI & EVRAK MERKEZİ (ÖĞRETMEN ÇALIŞMA ALANI)
const TEACHERS_ROOM_DATA = {
    title: "Öğretmen Çalışma Odası & Evrak Merkezi",
    description: "Fen Bilimleri zümre başkanları ve öğretmenleri için resmi evraklar, yıllık planlar, ders materyalleri ve ölçme formları.",
    categories: [
        {
            id: "docs-plans",
            name: "📂 Yıllık & Ders Planları",
            items: [
                { title: "2026-2027 5. Sınıf Fen Bilimleri Ünitelendirilmiş Yıllık Planı (MEB)", format: "DOCX / PDF", updated: "Eylül 2024" },
                { title: "2026-2027 6. Sınıf Fen Bilimleri Ünitelendirilmiş Yıllık Planı (MEB)", format: "DOCX / PDF", updated: "Eylül 2024" },
                { title: "2026-2027 7. Sınıf Fen Bilimleri Ünitelendirilmiş Yıllık Planı (MEB)", format: "DOCX / PDF", updated: "Eylül 2024" },
                { title: "2026-2027 8. Sınıf LGS Fen Bilimleri Ünitelendirilmiş Yıllık Planı", format: "DOCX / PDF", updated: "Eylül 2024" },
                { title: "Giriş-Gelişme-Sonuç Odaklı 5E Modeli Günlük Ders Akış Şablonu", format: "DOCX", updated: "Güncel" }
            ]
        },
        {
            id: "docs-zumre",
            name: "📋 Zümre Tutanakları & Resmi Formlar",
            items: [
                { title: "Sene Başı Fen Bilimleri Zümre Öğretmenler Kurulu Toplantı Tutanağı", format: "DOCX", updated: "2024 Güz" },
                { title: "2. Dönem Başı Fen Bilimleri Zümre Toplantı Tutanağı", format: "DOCX", updated: "2025 Bahar" },
                { title: "Okul Fen Laboratuvarı Güvenlik ve Demirbaş Talimatnamesi", format: "PDF / Yazdır", updated: "Standart" },
                { title: "Deney İzin ve Veli Bilgilendirme Formu", format: "DOCX", updated: "Standart" }
            ]
        },
        {
            id: "docs-rubrics",
            name: "📊 Ölçme-Değerlendirme & Rubrikler",
            items: [
                { title: "MEB Açık Uçlu Ortak Sınav Değerlendirme Dereceli Puanlama Anahtarı (Rubrik)", format: "A4 Yazdır / PDF" },
                { title: "Fen Laboratuvarı Deney ve Rapor Değerlendirme Kontrol Listesi", format: "A4 Yazdır / PDF" },
                { title: "Öğrenci Proje ve STEM Görevi Analitik Değerlendirme Rubriği", format: "A4 Yazdır / PDF" },
                { title: "Öğrenci Akran ve Öz Değerlendirme Formu", format: "A4 Yazdır" }
            ]
        }
    ]
};

// 7. 8. SINIF + LGS PUSULASI VERİLERİ
const LGS_PUSULA_DATA = {
    title: "8. Sınıf + LGS Fen Bilimleri Pusulası",
    description: "MEB çıkmış sorular, örnek soru analizleri, yeni nesil soru çözüm taktikleri ve branş denemeleri.",
    strategyCards: [
        {
            number: "01",
            title: "Değişken Analizi Kuralı",
            text: "LGS'de bağımsız değişken 'senin değiştirdiğin', bağımlı değişken 'ölçtüğün sonuç', kontrol edilen değişken 'sabit tuttuğun' faktördür. Deney sorularında önce değişkenleri tespit edin!",
            icon: "fa-solid fa-sliders"
        },
        {
            number: "02",
            title: "Grafik & Tablo Okuma",
            text: "Eksen başlıklarına (X ve Y) ve birimlere çok dikkat edin. Sıcaklık artış grafiğinde kütle ve öz ısı ilişkisini her zaman göz önünde bulundurun.",
            icon: "fa-solid fa-chart-line"
        },
        {
            number: "03",
            title: "Kavram Yanılgılarına Dikkat",
            text: "Dünya Güneş'e en yakın olduğunda (3 Ocak) Kuzey Yarımküre'de kış yaşanır. Yakınlık-uzaklık mevsimleri etkilemez, tek etken eksen eğikliği ve geliş açısıdır!",
            icon: "fa-solid fa-triangle-exclamation"
        },
        {
            number: "04",
            title: "Soru Kökünü ve Öncülleri Çiz",
            text: "'Kesinlikle doğrudur', 'Ulaşılamaz', 'Yalnızca grafiğe göre' gibi sınırlayıcı ifadelere odaklanın. Kendi genel bilginizi değil, sorunun verdiği deneyi yorumlayın.",
            icon: "fa-solid fa-highlighter"
        }
    ],
    mebQuestions: [
        {
            year: "2024 LGS",
            unit: "Mevsimler ve İklim",
            questionText: "Güneş ışınlarının öğle vakti birim yüzeye düşen enerji miktarı ile gölge boyu arasındaki ilişkiyi gösteren grafik...",
            answer: "A",
            solution: "Güneş ışınları dik açıyla (90°) geldiğinde birim yüzeye düşen enerji maksimum olur, gölge boyu ise minimum olur. Bu nedenle gölge boyu ile sıcaklık artışı ters orantılıdır."
        },
        {
            year: "2023 LGS",
            unit: "Basınç",
            questionText: "Özdeş küplerle oluşturulan K, L ve M düzeneklerinin kum zeminde bıraktıkları iz derinlikleri...",
            answer: "C",
            solution: "Katı basıncı formülü P = G / S'dir. L düzeneğinde ağırlık 2 katına çıkarken temas alanı 1 birim kaldığı için basınç en büyüktür."
        }
    ],
    branchExams: [
        { id: "lgs-deneme-1", title: "LGS Fen Bilimleri 1. Dönem Genel Branş Denemesi", questionCount: 20, time: 40, difficulty: "LGS Standart" },
        { id: "lgs-deneme-2", title: "LGS Fen Bilimleri Full Müfredat Türkiye Geneli Deneme", questionCount: 20, time: 40, difficulty: "Zor / Seçici" }
    ]
};

// 8. DATA MANAGER (LOCALSTORAGE & LMS İLERLEME YÖNETİCİSİ)
const DataManager = {
    getStudentProfile: function() {
        const stored = localStorage.getItem("rotali_student_profile");
        if (stored) {
            try { return JSON.parse(stored); } catch(e) {}
        }
        return {
            name: "Fen Kaşifi",
            grade: "8. Sınıf",
            level: "Seviye 3 - Bilim Yolcusu",
            xp: 450,
            completedUnits: ["5-unit-1", "6-unit-1", "7-unit-2"],
            completedQuizzes: ["q-hucre-7", "q-mevsimler-8"],
            errorNotebook: [
                {
                    unit: "Hücre ve Bölünmeler",
                    question: "Bitki hücrelerinde sentrozom bulunur mu?",
                    userWrongAnswer: "Evet",
                    correctAnswer: "Hayır (Sentrozom sadece hayvan hücresinde bulunur)",
                    date: "2024-10-14"
                },
                {
                    unit: "Mevsimler ve İklim",
                    question: "21 Haziran'da Yengeç Dönencesinde hangi mevsim başlar?",
                    userWrongAnswer: "Kış",
                    correctAnswer: "Yaz (Kuzey Yarımküre)",
                    date: "2024-10-18"
                }
            ],
            dailyTasks: [
                { id: "task-1", text: "7. Sınıf Hücre Sketchnote özetini incele", done: true },
                { id: "task-2", text: "8. Sınıf Mevsimler Mini Testini tamamla (10 Soru)", done: false },
                { id: "task-3", text: "Sanal Pascal Simülatöründe deney yap", done: false }
            ],
            badges: [
                { id: "b-1", title: "İlk Rota", desc: "İlk fen ünitesini tamamladı", icon: "fa-solid fa-flag-checkered", unlocked: true },
                { id: "b-2", title: "Deney Ustası", desc: "3 sanal deneyi başarıyla tamamladı", icon: "fa-solid fa-flask", unlocked: true },
                { id: "b-3", title: "LGS Canavarı", desc: "LGS denemesinde 18+ net yaptı", icon: "fa-solid fa-crown", unlocked: false }
            ]
        };
    },

    saveStudentProfile: function(profile) {
        localStorage.setItem("rotali_student_profile", JSON.stringify(profile));
    },

    addToErrorNotebook: function(item) {
        const profile = this.getStudentProfile();
        profile.errorNotebook.unshift(item);
        this.saveStudentProfile(profile);
    },

    markUnitCompleted: function(unitId) {
        const profile = this.getStudentProfile();
        if (!profile.completedUnits.includes(unitId)) {
            profile.completedUnits.push(unitId);
            profile.xp += 100;
            this.saveStudentProfile(profile);
        }
    },

    getTeacherProfile: function() {
        return {
            name: "Rotalı Fenci",
            title: "Fen Bilimleri Zümre Başkanı",
            classes: [
                { id: "c-5a", name: "5-A Sınıfı", studentCount: 26, avgScore: "%84" },
                { id: "c-6b", name: "6-B Sınıfı", studentCount: 28, avgScore: "%78" },
                { id: "c-7c", name: "7-C Sınıfı", studentCount: 24, avgScore: "%91" },
                { id: "c-8a", name: "8-A (LGS)", studentCount: 30, avgScore: "%88" }
            ],
            pendingAssignments: 3,
            recentTests: 8
        };
    },

    getCategories: function() { return PORTAL_GRADES; },
    getPosts: function() { return typeof DEFAULT_POSTS !== 'undefined' ? DEFAULT_POSTS : []; },
    getQuizzes: function() { return typeof DEFAULT_QUIZZES !== 'undefined' ? DEFAULT_QUIZZES : []; },
    getFlashcards: function() { return typeof DEFAULT_FLASHCARDS !== 'undefined' ? DEFAULT_FLASHCARDS : []; },
    isUnitCompleted: function(id) {
        const profile = this.getStudentProfile();
        return profile.completedUnits.includes(id);
    }
};

const DEFAULT_POSTS = [
    {
        id: "post-1",
        title: "7. Sınıf Hücre ve Organelleri Görsel Sketchnote ve Tam Özet",
        slug: "7-sinif-hucre-ve-organelleri",
        category: "7. Sınıf",
        categorySlug: "grade-7",
        grade: "7. Sınıf",
        unitId: "7-unit-2",
        excerpt: "Bitki ve hayvan hücresi farkları, organellerin görevleri ve hücre bölünmelerine giriş.",
        image: "assets/posts/hucre.jpg",
        readTime: "8 dk",
        date: "2024-10-12",
        views: 4820,
        likes: 340,
        featured: true,
        tags: ["Hücre", "Organeller", "Mitoz", "Mayoz", "7. Sınıf"]
    },
    {
        id: "post-2",
        title: "8. Sınıf LGS Mevsimlerin Oluşumu ve Eksen Eğikliği Taktikleri",
        slug: "8-sinif-lgs-mevsimlerin-olusumu",
        category: "8. Sınıf (LGS)",
        categorySlug: "grade-8",
        grade: "8. Sınıf",
        unitId: "8-unit-1",
        excerpt: "21 Haziran, 21 Aralık, 21 Mart ve 23 Eylül tarihlerinde gölge boyu ve sıcaklık analizi.",
        image: "assets/posts/mevsimler.jpg",
        readTime: "10 dk",
        date: "2024-10-15",
        views: 6540,
        likes: 512,
        featured: true,
        tags: ["Mevsimler", "LGS", "Eksen Eğikliği", "Gölge Boyu", "8. Sınıf"]
    },
    {
        id: "post-3",
        title: "8. Sınıf Katı ve Sıvı Basıncı Değişken Analizi ve Formüller",
        slug: "8-sinif-kati-sivi-basinci",
        category: "8. Sınıf (LGS)",
        categorySlug: "grade-8",
        grade: "8. Sınıf",
        unitId: "8-unit-3",
        excerpt: "Katı ve sıvı basıncı deney sorularında bağımsız değişken nasıl bulunur? Pascal prensibi detayları.",
        image: "assets/posts/basinc.jpg",
        readTime: "9 dk",
        date: "2024-10-18",
        views: 5210,
        likes: 420,
        featured: true,
        tags: ["Basınç", "Pascal", "Sıvı Basıncı", "LGS Fen", "8. Sınıf"]
    }
];

const DEFAULT_QUIZZES = [
    {
        id: "q-hucre-7",
        title: "7. Sınıf Hücre ve Bölünmeler Beceri Temelli Mini Test",
        unitId: "7-unit-2",
        grade: "7. Sınıf",
        timeLimit: 15,
        questions: [
            {
                id: "q1",
                text: "Bitki ve hayvan hücresi karşılaştırıldığında aşağıdakilerden hangisi yalnızca bitki hücresinde gözlemlenir?",
                options: [
                    "A) Sentrozom organeli",
                    "B) Hücre zarı ve sitoplazma",
                    "C) Kloroplast ve hücre duvarı",
                    "D) Mitokondri organeli"
                ],
                correct: 2,
                explanation: "Kloroplast ve sert selüloz hücre duvarı sadece bitki hücrelerinde bulunur; sentrozom ise hayvan hücrelerinde bulunur."
            },
            {
                id: "q2",
                text: "Mitoz bölünme ile ilgili verilen ifadelerden hangisi DOĞRUDUR?",
                options: [
                    "A) Kromozom sayısı yarıya iner.",
                    "B) Sonucunda kalıtsal olarak ana hücreyle aynı 2 yeni hücre oluşur.",
                    "C) Sadece üreme ana hücrelerinde görülür.",
                    "D) Parça değişimi (crossing-over) ile genetik çeşitlilik sağlanır."
                ],
                correct: 1,
                explanation: "Mitoz bölünmede kromozom sayısı sabit kalır ve genetik olarak birbirinin aynısı 2 yavru hücre oluşur."
            }
        ]
    },
    {
        id: "q-mevsimler-8",
        title: "8. Sınıf LGS Mevsimler ve İklim Yeni Nesil Test",
        unitId: "8-unit-1",
        grade: "8. Sınıf",
        timeLimit: 20,
        questions: [
            {
                id: "q1",
                text: "21 Haziran tarihinde Kuzey Yarımküre'de bulunan bir cismin öğle vaktindeki gölge boyu ile ilgili hangisi doğrudur?",
                options: [
                    "A) Yıl içindeki en uzun gölge boyu oluşur.",
                    "B) Güneş ışınları en dar açıyla geldiği için gölge oluşmaz.",
                    "C) Yıl içindeki en kısa gölge boyu oluşur çünkü ışınlar en büyük açıyla gelir.",
                    "D) Gece ve gündüz süresi eşit olduğu için gölge boyu sabittir."
                ],
                correct: 2,
                explanation: "21 Haziran'da KYK'ye Güneş ışınları yıl içindeki en büyük (en dik) açıyla geldiği için gölge boyu en kısa olur."
            }
        ]
    }
];

const DEFAULT_FLASHCARDS = [
    { id: "fc-1", unit: "7. Sınıf - Hücre", question: "Mitokondri organelinin görevi nedir?", answer: "Hücrenin enerji (ATP) santralidir; besin ve oksijeni yakarak enerji üretir." },
    { id: "fc-2", unit: "7. Sınıf - Hücre", question: "Mitoz ile Mayoz arasındaki en belirgin fark nedir?", answer: "Mitozda 2 kopya hücre oluşur ve kromozom sayısı değişmez; Mayozda 4 hücre oluşur ve kromozom sayısı yarıya iner." },
    { id: "fc-3", unit: "8. Sınıf - Mevsimler", question: "Mevsimlerin oluşmasının 2 temel sebebi nedir?", answer: "1. Dünya'nın 23° 27'lik eksen eğikliği. 2. Dünya'nın Güneş etrafındaki dolanma hareketi." },
    { id: "fc-4", unit: "8. Sınıf - Basınç", question: "Sıvı basıncı hangi değişkenlere bağlıdır?", answer: "Sıvının derinliğine (h) ve sıvının yoğunluğuna (d) bağlıdır. Kabın şekline bağlı değildir!" }
];

console.log("Rotalı Fenci Portal Data Modeli Yüklendi.");


// -------------------------------------------------------------
// 7 ALT BÖLÜM VERİ HAVUZU (TÜM SINIFLAR İÇİN)
// 1. Ders Notu, 2. Ders Sunumu, 3. Videolar, 4. Etkinlikler,
// 5. Soru Bankası, 6. Denemeler, 7. Eğitsel Oyunlar
// -------------------------------------------------------------
function getGradeSubSectionsData(gradeNumber) {
    const gNum = parseInt(gradeNumber) || 8;
    const isLGS = gNum === 8;

    const unitTitles = {
        5: ["Güneş, Dünya ve Ay", "Canlılar Dünyası", "Kuvvetin Ölçülmesi", "Madde ve Değişim", "Işığın Yayılması", "İnsan ve Çevre", "Elektrik Devreleri"],
        6: ["Güneş Sistemi ve Tutulmalar", "Vücudumuzdaki Sistemler", "Kuvvet ve Hareket", "Madde ve Isı", "Ses ve Özellikleri", "Sistemler ve Sağlığı", "Elektriğin İletimi"],
        7: ["Güneş Sistemi ve Ötesi", "Hücre ve Bölünmeler", "Kuvvet ve Enerji", "Saf Madde ve Karışımlar", "Işığın Madde ile Etkileşimi", "Canlılarda Üreme", "Elektrik Devreleri"],
        8: ["Mevsimler ve İklim", "DNA ve Genetik Kod", "Basınç (Katı-Sıvı-Gaz)", "Madde ve Endüstri", "Basit Makineler", "Enerji Dönüşümleri", "Elektrik Yükleri"]
    }[gNum] || ["1. Ünite", "2. Ünite", "3. Ünite", "4. Ünite", "5. Ünite", "6. Ünite", "7. Ünite"];

    return {
        // 1. DERS NOTLARI
        dersNotu: unitTitles.map((uName, idx) => ({
            id: `not-${gNum}-${idx+1}`,
            title: `${gNum}. Sınıf ${idx+1}. Ünite: ${uName} Ders Notu`,
            unit: `${idx+1}. Ünite • ${uName}`,
            pages: "4-6 Sayfa",
            desc: "Renkli kavram haritaları, MEB kazanım özetleri, formül tabloları ve dikkat edilmesi gereken püf noktalar.",
            badge: "PDF / Renkli Özet",
            downloadCount: `${1200 + idx * 85} İndirme`
        })),

        // 2. DERS SUNUMLARI
        dersSunumu: unitTitles.map((uName, idx) => ({
            id: `sunum-${gNum}-${idx+1}`,
            title: `${gNum}. Sınıf ${uName} Akıllı Tahta Dersi Sunumu`,
            unit: `${idx+1}. Ünite • ${uName}`,
            slides: "24-38 Slayt",
            desc: "Sınıf içi projeksiyon ve akıllı tahta uyumlu, yüksek çözünürlüklü görseller ve interaktif animasyonlar içeren PPTX/PDF sunumu.",
            badge: "Akıllı Tahta (PPTX / PDF)",
            format: "16:9 Geniş Ekran"
        })),

        // 3. VİDEOLAR
        videolar: unitTitles.map((uName, idx) => ({
            id: `video-${gNum}-${idx+1}`,
            title: `${gNum}. Sınıf ${uName} Konu Anlatımı & Deney Videosu`,
            unit: `${idx+1}. Ünite • ${uName}`,
            duration: `${12 + (idx % 4) * 3}:45 Dakika`,
            desc: "Animasyonlu kavram anlatımları, laboratuvar deney çekimleri ve MEB yeni nesil soru çözüm analizleri.",
            channel: "Rotalı Fenci Akademi",
            views: `${4500 + idx * 320} İzlenme`
        })),

        // 4. ETKİNLİKLER
        etkinlikler: unitTitles.map((uName, idx) => ({
            id: `etk-${gNum}-${idx+1}`,
            title: `${gNum}. Sınıf ${uName} İnteraktif Çalışma Kağıdı & Bulmaca`,
            unit: `${idx+1}. Ünite • ${uName}`,
            type: "Eşleştirme / Boşluk Doldurma / Doğru-Yanlış",
            desc: "Bireysel ve grup çalışmalarına uygun istasyon etkinlikleri, kavram çengelleri ve fen bulmacaları.",
            badge: "A4 Yazdırılabilir Föy"
        })),

        // 5. SORU BANKASI
        soruBankasi: unitTitles.map((uName, idx) => ({
            id: `sb-${gNum}-${idx+1}`,
            title: `${gNum}. Sınıf ${uName} Beceri Temelli Soru Bankası`,
            unit: `${idx+1}. Ünite • ${uName}`,
            count: isLGS ? "45 Yeni Nesil Soru" : "30 Kazanım Testi",
            difficulty: isLGS ? "LGS Seviyesi / Zor" : "Orta - İleri Düzey",
            desc: "Grafik, tablo ve deney düzeneği yorumlama soruları, video çözümlü kazanım pekiştirme testleri.",
            badge: isLGS ? "🔥 LGS MEB Formatı" : "✅ MEB Kazanım Uyumlu"
        })),

        // 6. DENEMELER
        denemeler: [
            { id: `deneme-${gNum}-1`, title: `${gNum}. Sınıf 1. Dönem 1. Ortak Yazılı Deneme Sınavı`, type: "Açık Uçlu MEB Senaryosu", questions: "10 Açık Uçlu Soru", time: "40 Dakika" },
            { id: `deneme-${gNum}-2`, title: `${gNum}. Sınıf 1. Dönem Genel Değerlendirme Branş Denemesi`, type: "Çoktan Seçmeli", questions: "20 Beceri Temelli Soru", time: "40 Dakika" },
            { id: `deneme-${gNum}-3`, title: `${gNum}. Sınıf 2. Dönem 1. Ortak Yazılı Deneme Sınavı`, type: "Açık Uçlu MEB Senaryosu", questions: "10 Açık Uçlu Soru", time: "40 Dakika" },
            { id: `deneme-${gNum}-4`, title: isLGS ? "8. Sınıf LGS Türkiye Geneli Fen Bilimleri Denemesi" : `${gNum}. Sınıf Yıl Sonu Genel Fen Denemesi`, type: "Tam Müfredat", questions: "20 Soru", time: "40 Dakika" }
        ],

        // 7. EĞİTSEL OYUNLAR
        egitselOyunlar: [
            { id: `oyun-${gNum}-1`, title: `${gNum}. Sınıf Fen Çarkıfeleği & Terim Yarışması`, icon: "fa-solid fa-dharmachakra", desc: "Çarkı çevir, gelen kavramı tanımla veya soruyu 30 saniyede bilip puanları topla!", type: "İnteraktif Çark" },
            { id: `oyun-${gNum}-2`, title: `${gNum}. Sınıf Kavram & Organel Eşleştirme Turnuvası`, icon: "fa-solid fa-puzzle-piece", desc: "Zamana karşı yarışarak kavramları doğru açıklamalarıyla eşleştir, liderlik tablosuna adını yazdır.", type: "Hızlı Eşleştirme" },
            { id: `oyun-${gNum}-3`, title: `${gNum}. Sınıf Bilim Milyoneri (Fen Kim Milyoner Olmak İster?)`, icon: "fa-solid fa-trophy", desc: "15 aşamalı fen sorularını bil, jokerlerini kullan ve fen şampiyonu ol!", type: "Yarışma Formatı" }
        ]
    };
}


// -------------------------------------------------------------
// DERİNLEŞTİRİLMİŞ MÜFREDAT VE ÖĞRENME İÇERİKLERİ HAVUZU
// -------------------------------------------------------------
const ENRICHED_GRADE_CONTENT = {
    "5": {
        unitSummaries: [
            {
                unit: "1. Ünite: Güneş, Dünya ve Ay",
                highlights: [
                    "☀️ **Güneş:** Orta büyüklükte bir yıldızdır, katmanlardan oluşur (Çekirdek, Işık küre, Renk küre, Taç küre). Yüzeyinde daha soğuk bölgeler olan 'Güneş Lekeleri' bulunur. Kendi ekseni etrafında saat yönünün tersine döner.",
                    "🌕 **Ay:** Dünya'nın tek doğal uydusudur. Atmosferi yok denecek kadar incedir (bu yüzden rüzgar, yağmur olmaz; gece-gündüz sıcaklık farkı çok fazladır; kraterler bozulmaz).",
                    "🔄 **Ay'ın Evreleri (29.5 Gün):** 1. *Yeni Ay* (Karanlık), 2. *İlk Dördün* ('D' harfi şeklinde aydınlık), 3. *Dolunay* (Tamamen parlak daire), 4. *Son Dördün* (Ters 'D' harfi).",
                    "⏱️ **Ay'ın Dönme ve Dolanma Eşitliği:** Ay'ın kendi ekseni etrafındaki dönme süresi ile Dünya etrafındaki dolanma süresi eşit (~27.3 gün) olduğu için Dünya'dan bakıldığında daima Ay'ın aynı yüzü görülür."
                ]
            },
            {
                unit: "2. Ünite: Canlılar Dünyası",
                highlights: [
                    "🦠 **Mikroskobik Canlılar:** Yalnızca mikroskopla görülebilen canlılardır (Bakteriler, Amip, Öglena, Paramesyum). Yararlı bakteriler (yoğurt, peynir, sirke yapımı), zararlı bakteriler (hastalık yapıcılar) vardır.",
                    "🍄 **Mantarlar:** Bitki DEĞİLDİR (kendi besinini üretemez, klorofili yoktur). Şapkalı mantarlar, Küf mantarları (besinleri çürütür, penisilin ilacı üretilir), Maya mantarları (hamurun kabarması), Parazit mantarlar (pamukçuk, saçkıran).",
                    "🌱 **Bitkiler:** 1. *Çiçeksiz Bitkiler* (Karayosunu, Eğrelti otu, Atkuyruğu), 2. *Çiçekli Bitkiler* (Kök, Gövde, Yaprak, Çiçek). Yaprakta fotosentez ve terleme gerçekleşir.",
                    "🐾 **Hayvanlar:** 1. *Omurgasızlar* (Sünger, Salyangoz, Solucan, Böcekler, Yengeç), 2. *Omurgalılar* (Balıklar, Kurbağalar, Sürüngenler, Kuşlar, Memeliler). Yarasa ve Balina memelidir!"
                ]
            },
            {
                unit: "3. Ünite: Kuvvetin Ölçülmesi ve Sürtünme",
                highlights: [
                    "⚖️ **Dinamometre:** Kuvveti ölçen alettir. Birimi Newton'dur (N). İçindeki yayın esneklik özelliğinden yararlanılır. Kalın yaylar büyük kuvvetleri, ince yaylar hassas küçük kuvvetleri ölçer.",
                    "🛑 **Sürtünme Kuvveti:** Hareketi engelleyen veya zorlaştıran, daima hareket yönüne zıt kuvvettir. Pürüzlü yüzeylerde sürtünme fazla, kaygan yüzeylerde azdır.",
                    "💨 **Hava ve Su Direnci:** Havanın ve suyun cisimlerin hareketine karşı gösterdiği sürtünme kuvvetidir. Uçakların ve gemilerin burunlarının 'V' şeklinde (aerodinamik) yapılması direnci azaltır."
                ]
            }
        ]
    },
    "6": {
        unitSummaries: [
            {
                unit: "1. Ünite: Güneş Sistemi ve Tutulmalar",
                highlights: [
                    "🪐 **Güneş'e Yakınlık Sırası:** Merkür ➔ Venüs ➔ Dünya ➔ Mars ➔ (Asteroit Kuşağı) ➔ Jüpiter ➔ Satürn ➔ Uranüs ➔ Neptün.",
                    "🪨 **Karasal (İç) Gezegenler:** Merkür, Venüs, Dünya, Mars (Kayalık yüzeyli, halkaları yok).",
                    "💨 **Gazsal (Dış) Gezegenler:** Jüpiter, Satürn, Uranüs, Neptün (Dev gaz kütleleri, hepsinin halkası ve çok sayıda uydusu vardır).",
                    "🌑 **Güneş Tutulması:** Ay, Güneş ile Dünya'nın arasına girer (G-A-D). Gündüz vakti ve Yeni Ay evresinde gözlenir.",
                    "🌕 **Ay Tutulması:** Dünya, Güneş ile Ay'ın arasına girer (G-D-A). Gece vakti ve Dolunay evresinde gözlenir."
                ]
            },
            {
                unit: "2. Ünite: Vücudumuzdaki Sistemler",
                highlights: [
                    "🦴 **Destek ve Hareket:** Kemikler (Uzun, Kısa, Yassı), Eklemler (Oynar, Yarı oynar, Oynamaz), Kaslar (Çizgili/İskelet, Düz, Kalp kası).",
                    "🍔 **Sindirim Sistemi:** Ağız (tükürük ile karbonhidrat) ➔ Mide (mide özsuyu ile protein) ➔ İnce Bağırsak (pankreas özsuyu ile yağ, protein, karbonhidrat sindirimi tamamlanır ve villuslarla emilim olur). Karaciğer 'safra' salgısıyla yağların mekanik sindirimini sağlar.",
                    "❤️ **Dolaşım Sistemi:** Kalp 4 odacıktan oluşur (2 kulakçık, 2 karıncık). *Küçük Dolaşım:* Kalp (sağ karıncık) ➔ Akciğer (kan temizlenir) ➔ Kalp (sol kulakçık). *Büyük Dolaşım:* Kalp (sol karıncık - Aort) ➔ Bütün Vücut ➔ Kalp (sağ kulakçık)."
                ]
            }
        ]
    },
    "7": {
        unitSummaries: [
            {
                unit: "1. Ünite: Güneş Sistemi ve Ötesi",
                highlights: [
                    "🚀 **Uzay Teknolojileri:** Yapay uydular (Haberleşme: Türksat 4A/5A/5B, Gözlem: Göktürk-1/2, Rasat). Ömrü biten uydular ve roket parçaları 'Uzay Kirliliği' oluşturur.",
                    "🔭 **Teleskoplar:** Aynalı, Mercekli ve Radyo teleskopları. Dünyanın atmosferik olumsuzluklarından etkilenmemek için Hubble ve James Webb uzay teleskopları uzaya fırlatılmıştır.",
                    "✨ **Yıldızların Yaşamı:** Bulutsu (Nebula) içinde doğarlar. Küçük kütleli yıldızlar ➔ Kızıl dev ➔ Gezegenimsi bulutsu ➔ Beyaz cüce olur. Büyük kütleli yıldızlar ➔ Süpernova patlaması ➔ Nötron yıldızı veya Karadelik olur."
                ]
            },
            {
                unit: "2. Ünite: Hücre ve Bölünmeler",
                highlights: [
                    "🔬 **Organeller:** Mitokondri (Enerji/ATP), Kloroplast (Bitkide fotosentez), Ribozom (Protein), Golgi (Salgı ve paketleme), ER (Taşıma), Lizozom (Hücre içi sindirim), Sentrozom (Hayvanda bölünme iğ iplikleri).",
                    "🧬 **Mitoz:** Vücut hücrelerinde görülür. 2n ➔ 2n (2 yavru hücre). Kromozom sayısı ve genetik yapı değişmez. Tek hücrelilerde üreme, çok hücrelilerde büyüme, onarım ve gelişmeyi sağlar.",
                    "🌱 **Mayoz:** Üreme ana hücrelerinde (2n) görülür, üreme hücreleri (n - sperm, yumurta, polen) oluşur. Kromozom sayısı yarıya iner (2n ➔ n, 4 yavru hücre). Parça değişimi (Crossing-over) sayesinde kalıtsal çeşitlilik oluşur."
                ]
            },
            {
                unit: "3. Ünite: Kuvvet ve Enerji",
                highlights: [
                    "⚖️ **Kütle vs Ağırlık:** Kütle değişmeyen madde miktarıdır (kg/g, eşit kollu terazi ile ölçülür). Ağırlık bir kuvvettir ($G = m \\cdot g$, Newton, dinamometre ile ölçülür; yerçekimine göre değişir).",
                    "⚙️ **Fiziksel İş (W):** Bir kuvvetin iş yapabilmesi için cisme kendi doğrultusunda yol aldırması şarttır ($W = F \\cdot \\Delta x$).",
                    "⚡ **Mekanik Enerjinin Korunumu:** Sürtünmesiz ortamda Kinetik Enerji ($E_k = \\frac{1}{2}mv^2$) ile Çekim Potansiyel Enerjisi ($E_p = mgh$) birbirine dönüşür, toplam mekanik enerji sabit kalır!"
                ]
            }
        ]
    },
    "8": {
        unitSummaries: [
            {
                unit: "1. Ünite: Mevsimler ve İklim",
                highlights: [
                    "🌍 **Mevsimlerin Oluşma Nedenleri:** 1. Dünya'nın Güneş etrafında dolanması, 2. Dünya'nın ekseninin $23^\\circ 27'$ eğik olması. Güneş'e olan mesafe mevsimleri ETKİLEMEZ!",
                    "☀️ **Güneş Işınlarının Geliş Açısı:** Işınlar dik veya dike yakın gelirse (yaz), birim yüzeye düşen enerji fazla olur ve gölge boyu kısa olur. Eğik gelirse (kış), geniş alana yayılır ve gölge boyu uzun olur.",
                    "📅 **Önemli Tarihler:** 21 Haziran (Yengeç Dönencesine dik, KYK Yaz - GYK Kış), 21 Aralık (Oğlak Dönencesine dik, GYK Yaz - KYK Kış), 21 Mart & 23 Eylül (Ekinoks, Ekvatora dik, Gece=Gündüz 12 saat).",
                    "🌬️ **Rüzgar Oluşumu:** Yüksek Basınç Alanından (Soğuk, Alçalıcı hava, açık hava) ➔ Alçak Basınç Alanına (Sıcak, Yükselici hava, bulutlu) doğru yatay yönlü hava hareketidir."
                ]
            },
            {
                unit: "2. Ünite: DNA ve Genetik Kod",
                highlights: [
                    "🧬 **Karmaşıktan Basite Sıralama (KEDİGENİ):** Kromozom > DNA > Gen > Nükleotid.",
                    "🧪 **Nükleotid Yapısı:** Fosfat + Deoksiriboz Şekeri + Organik Baz (Adenin, Timin, Guanin, Sitozin). $A = T$ ve $G = C$.",
                    "🌿 **Kalıtım (Mendel):** Saf Döl (Homozigot: $AA$ veya $aa$), Melez Döl (Heterozigot: $Aa$). Baskın Gen ($A$), Çekinik Gen ($a$). İki melez çaprazlandığında ($Aa \\times Aa$): %25 $AA$, %50 $Aa$, %25 $aa$ (%75 Baskın Fenotip, %25 Çekinik Fenotip).",
                    "🧬 **Kavramlar:** *Mutasyon* (Gen yapısının bozulması: Van kedisi, Down sendromu, Orak hücre), *Modifikasyon* (Çevre etkisiyle genin işleyişinin değişmesi: Çuha çiçeği, Himalaya tavşanı, Spor yapanın kaslanması - kalıtsal değildir!), *Adaptasyon* (Canlının yaşama ve üreme şansını artıran kalıtsal uyum: Kutup ayısının beyaz kürkü, Kaktüsün iğne yaprağı)."
                ]
            },
            {
                unit: "3. Ünite: Basınç (Katı, Sıvı, Gaz)",
                highlights: [
                    "🧱 **Katı Basıncı ($P = \\frac{G}{S}$):** Basınç, cismin ağırlığı (kuvvet) ile doğru, yere temas eden yüzey alanı ile ters orantılıdır. Yüzey küçüldükçe basınç artar (Bıçak ağzı, çivi ucu). Yüzey büyüdükçe basınç azalır (Tır tekeri, ördek ayak perdesi).",
                    "💧 **Sıvı Basıncı ($P = h \\cdot d \\cdot g$):** Sıvı basıncı sıvının derinliği ($h$) ve sıvının yoğunluğu ($d$) ile doğru orantılıdır. Kabın şekline ve sıvı miktarına bağlı DEĞİLDİR!",
                    "🚗 **Pascal Prensibi:** Kapalı kaplardaki sıvılar, üzerlerine uygulanan basıncı her doğrultuda ve aynı büyüklükte iletir (Hidrolik fren, berber koltuğu, su cenderesi, hidrolik liftler).",
                    "🎈 **Açık Hava Basıncı ($P_0$):** Toriçelli deneyi deniz seviyesinde $0^\\circ\\text{C}$'de cıva ile $76\\text{ cm-Hg}$ ölçülmüştür. Denizden yükseklere çıkıldıkça açık hava basıncı AZALIR!"
                ]
            },
            {
                unit: "4. Ünite: Madde ve Endüstri",
                highlights: [
                    "📊 **Periyodik Sistem:** Elementler artan atom numaralarına (proton sayılarına) göre dizilmiştir (Moseley). 7 Periyot (yatay) ve 18 Grup (8 adet A, 10 adet B grubu dikey) bulunur.",
                    "⚙️ **Element Sınıfları:** *Metaller* (Sol tarafta, parlak, elektriği iletir, tel ve levha olur), *Ametaller* (Sağ tarafta, mat, kırılgandır, $1\\text{A}$'daki Hidrojen ametaldir!), *Soygazlar* ($8\\text{A}$, kararlıdır, bağ yapmaz).",
                    "🧪 **Kimyasal Tepkimeler:** Atom türü ve atom sayısı daima KORUNUR! Toplam kütle KORUNUR! Molekül sayısı ve hacim değişebilir.",
                    "🍋 **Asitler ve Bazlar:** Asitler ($0-7$ arası, ekşidir, $\\text{H}^+$ iyonu verir, mavi turnusolu kırmızıya çevirir, metaller ve mermerle tepkimeye girer). Bazlar ($7-14$ arası, acıdır, kayganlık hissi verir, $\\text{OH}^-$ iyonu verir, kırmızı turnusolu maviye çevirir, cam ve porseleni matlaştırır)."
                ]
            }
        ]
    }
};
