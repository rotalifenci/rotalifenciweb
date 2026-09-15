
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}


// =============================================================
// ☁️ ROTALI FENCİ — BULUT EŞİTLEME MOTORU & KALICI SİLME YÖNETİMİ
// Telefon, Bilgisayar, Tablet ve Akıllı Tahta Arası Tam Eşitleme
// =============================================================

let ROTALI_MATERIALS_CACHE = null;

function getDeletedMaterialIds() {
    try {
        const stored = localStorage.getItem("rotali_deleted_materials");
        let list = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(list)) list = [];
        // Sadece 'mat-' ile başlayan ID'ler tutulur
        list = list.filter(id => typeof id === "string" && id.startsWith("mat-"));
        // Aktif olarak önbellekte bulunan veya yüklenen hiçbir materyal silinmiş sayılamaz
        if (Array.isArray(ROTALI_MATERIALS_CACHE) && ROTALI_MATERIALS_CACHE.length > 0) {
            const activeIds = new Set(ROTALI_MATERIALS_CACHE.map(m => m && m.id).filter(Boolean));
            list = list.filter(id => !activeIds.has(id));
        }
        return list;
    } catch(e) {
        return [];
    }
}

function addDeletedMaterialId(id) {
    if (!id || typeof id !== "string" || !id.startsWith("mat-")) return;
    const list = getDeletedMaterialIds();
    if (!list.includes(id)) {
        list.push(id);
        try {
            localStorage.setItem("rotali_deleted_materials", JSON.stringify(list));
        } catch(e) {}
    }
}

function removeDeletedMaterialId(id) {
    if (!id) return;
    try {
        const stored = localStorage.getItem("rotali_deleted_materials");
        if (stored) {
            let list = JSON.parse(stored);
            if (Array.isArray(list) && list.includes(id)) {
                list = list.filter(x => x !== id);
                localStorage.setItem("rotali_deleted_materials", JSON.stringify(list));
            }
        }
    } catch(e) {}
}

const CloudSyncManager = {
    // Canlı Vercel API her platformda (Netlify, Localhost, Vercel) anında senkronize eder
    apiEndpoint: (typeof window !== "undefined" && window.location && window.location.hostname.includes("vercel.app")) 
        ? "/api/sync" 
        : "https://rotalifenci.vercel.app/api/sync",
    fallbackGistUrl: "https://gist.githubusercontent.com/rotalifenci/a1bd259d8d4d9e04e93e4e038ef2b0c7/raw/materials.json",
    isSyncing: false,
    lastSyncedAt: null,
    heartbeatStarted: false,

    // Uygulama açılışında otomatik çalışır ve canlı senkronizasyon döngüsünü başlatır
    async init() {
        console.log("☁️ CloudSyncManager başlatılıyor...");
        await this.syncWithCloud(false);
        this.startLiveSync();
    },

    // ⚡ Anlık Canlı Senkronizasyon (Kullanıcı sekmeye dönünce veya 15 saniyede bir)
    startLiveSync() {
        if (this.heartbeatStarted) return;
        this.heartbeatStarted = true;

        window.addEventListener("focus", () => {
            this.syncWithCloud(false);
        });

        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") {
                this.syncWithCloud(false);
            }
        });

        // Sayfa açıkken her 20 saniyede bir sessiz arka plan kontrolü
        setInterval(() => {
            this.syncWithCloud(false);
        }, 20000);
    },

    // Bulut ile iki yönlü akıllı eşitleme
    async syncWithCloud(notify = false) {
        if (this.isSyncing) return;
        this.isSyncing = true;

        if (notify) {
            showToast("☁️ Bulut ile eşitleniyor, lütfen bekleyin...", "info");
        }

        try {
            const deletedIds = new Set(getDeletedMaterialIds());
            deletedIds.add("mat-5-unite-bilgi");
    deletedIds.add("mat-5-lab-guvenlik-gorsel");

            // 1. Buluttaki en güncel materyalleri çek
            let cloudMaterials = [];
            let cloudDeletedIds = [];
            let fetchSuccess = false;

            // Önce API endpoint dene
            try {
                const res = await fetch(`${this.apiEndpoint}?t=${Date.now()}`, {
                    headers: { "Cache-Control": "no-cache" }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data && Array.isArray(data.materials)) {
                        cloudMaterials = data.materials;
                        cloudDeletedIds = Array.isArray(data.deletedIds) ? data.deletedIds : [];
                        fetchSuccess = true;
                    }
                }
            } catch(apiErr) {
                console.warn("api/sync fetch error, trying fallback:", apiErr);
            }

            // Fallback: Canlı rotalifenci.vercel.app/api/sync
            if (!fetchSuccess && this.apiEndpoint !== "https://rotalifenci.vercel.app/api/sync") {
                try {
                    const vRes = await fetch(`https://rotalifenci.vercel.app/api/sync?t=${Date.now()}`, {
                        headers: { "Cache-Control": "no-cache" }
                    });
                    if (vRes.ok) {
                        const vData = await vRes.json();
                        if (vData && Array.isArray(vData.materials)) {
                            cloudMaterials = vData.materials;
                            cloudDeletedIds = Array.isArray(vData.deletedIds) ? vData.deletedIds : [];
                            fetchSuccess = true;
                        }
                    }
                } catch(e) {}
            }

            // Fallback Gist Raw
            if (!fetchSuccess) {
                try {
                    const gistRes = await fetch(`${this.fallbackGistUrl}?t=${Date.now()}`, {
                        headers: { "Cache-Control": "no-cache" }
                    });
                    if (gistRes.ok) {
                        const gistData = await gistRes.json();
                        if (gistData && Array.isArray(gistData.materials)) {
                            cloudMaterials = gistData.materials;
                            cloudDeletedIds = Array.isArray(gistData.deletedIds) ? gistData.deletedIds : [];
                            fetchSuccess = true;
                        }
                    }
                } catch(gistErr) {
                    console.warn("Fallback Gist error:", gistErr);
                }
            }

            // Buluttan gelen aktif materyallerin ID'lerini yerel silinmiş listesinden temizle (Kendi kendini onarma)
            cloudMaterials.forEach(item => {
                if (item && item.id) {
                    removeDeletedMaterialId(item.id);
                }
            });

            // Buluttan gelen silinmiş ID'leri yerel tombstone'a ekle (Sadece geçerli ID'ler)
            cloudDeletedIds.forEach(id => {
                if (typeof id === "string" && id.startsWith("mat-")) {
                    addDeletedMaterialId(id);
                }
            });
            const activeDeletedSet = new Set(getDeletedMaterialIds());
            activeDeletedSet.add("mat-5-unite-bilgi");
            activeDeletedSet.add("mat-5-lab-guvenlik-gorsel");

            // 2. Cihazdaki yerel materyalleri al (Bellek öncelikli)
            let localMaterials = [];
            if (Array.isArray(ROTALI_MATERIALS_CACHE) && ROTALI_MATERIALS_CACHE.length > 0) {
                localMaterials = ROTALI_MATERIALS_CACHE;
            } else {
                try {
                    localMaterials = JSON.parse(localStorage.getItem("rotali_custom_materials") || "[]");
                } catch(e) {
                    localMaterials = [];
                }
            }

            // 3. Birleştir: Sadece gerçekten silinmiş ID'leri hariç tut (Başlıklar asla engellenmez)
            const mergedMap = new Map();

            // Sadece silinmemiş bulut materyalleri
            cloudMaterials.forEach(item => {
                if (item && item.id && !activeDeletedSet.has(item.id)) {
                    mergedMap.set(item.id, item);
                }
            });

            // Yerel cihazdaki materyaller (silinmemiş olanlar)
            let hasNewLocalToUpload = false;
            localMaterials.forEach(item => {
                if (item && item.id && !activeDeletedSet.has(item.id)) {
                    const inCloud = mergedMap.get(item.id);
                    if (!inCloud) {
                        hasNewLocalToUpload = true;
                    }
                    mergedMap.set(item.id, { ...(inCloud || {}), ...item });
                }
            });

            const finalMergedList = Array.from(mergedMap.values());

            // Görsel URL referanslarını güvene al (fileUrl dataURL ise imageUrl olarak da kullanılabilsin)
            finalMergedList.forEach(item => {
                if (item && !item.imageUrl && item.fileUrl && (item.fileUrl.startsWith("data:") || item.fileUrl.startsWith("http") || item.fileUrl.startsWith("assets/"))) {
                    item.imageUrl = item.fileUrl;
                }
            });

            // 4. Bellek ve Yerel hafızaya güvenle kaydet (Mobilde kota aşımına karşı korumalı)
            saveCustomMaterialsSafe(finalMergedList);

            // 5. Eğer bu cihazda bulutta olmayan yerel materyal varsa, buluta gönder
            if (hasNewLocalToUpload) {
                await this.uploadToCloud(finalMergedList, false);
            }

            this.lastSyncedAt = new Date();

            if (notify) {
                showToast(`✅ Eşitleme başarılı! ${finalMergedList.length} materyal tüm cihazlarda aktif.`, "success");
            }

            // Sayfadaki arayüzü anında güncelle (Kullanıcı aşağı kaydırmışsa yukarı sıçratma)
            if (typeof handleRouteChange === "function") {
                handleRouteChange({ preserveScroll: true });
            }
        } catch(err) {
            console.error("Cloud sync general error:", err);
            if (notify) {
                showToast("⚠️ Eşitleme sırasında bir bağlantı sorunu oluştu.", "error");
            }
        } finally {
            this.isSyncing = false;
        }
    },

    // Buluta liste yükle / silme senkronizasyonu yap
    async uploadToCloud(materialsList, isReplace = false) {
        try {
            const deletedIds = getDeletedMaterialIds();
            // Payload'ı gereksiz duplicate base64'lerden arındırarak gönder (Kota dostu)
            const cleanMaterials = materialsList.map(item => {
                const copy = { ...item };
                if (copy.fileUrl && copy.fileUrl.startsWith("data:") && copy.imageUrl && copy.imageUrl === copy.fileUrl) {
                    copy.imageUrl = ""; // Bulutta çift depolamayı önle
                }
                return copy;
            });

            const payload = {
                materials: cleanMaterials,
                deletedIds: deletedIds,
                replace: isReplace
            };

            let res = null;
            try {
                res = await fetch(this.apiEndpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            } catch(e) {
                console.warn("Primary endpoint upload error:", e);
            }

            // Fallback endpoint dene
            if (!res || !res.ok) {
                const fallbackUrl = "https://rotalifenci.vercel.app/api/sync";
                if (this.apiEndpoint !== fallbackUrl) {
                    try {
                        res = await fetch(fallbackUrl, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(payload)
                        });
                    } catch(fbErr) {
                        console.warn("Fallback upload error:", fbErr);
                    }
                }
            }

            if (res && res.ok) {
                console.log("☁️ Bulut veritabanı güncellendi (Kalıcı Silme & Eşitleme Yapıldı)");
                return true;
            } else {
                console.warn("Buluta yükleme başarısız:", res ? res.status : "Bağlantı hatası");
                return false;
            }
        } catch(err) {
            console.warn("Buluta yükleme yapılamadı:", err);
            return false;
        }
    },

    async deleteMaterial(id, updatedList) {
        addDeletedMaterialId(id);
        return await this.uploadToCloud(updatedList, true);
    }
};

// -------------------------------------------------------------
// 📚 ROTALI FENCİ — ÖZEL MATERYAL HAVUZU
// -------------------------------------------------------------

const DEFAULT_CUSTOM_MATERIALS = [
    {
        id: "mat-8-liseye-nasil-gidecegiz",
        grade: "8",
        category: "videolar",
        title: "Liseye Nasıl Gideceğiz?",
        unit: "LGS Rehberlik & Tercih",
        desc: "8. Sınıf LGS ve liselere geçiş sistemi bilgilendirme ve motivasyon videosu.",
        fileName: "Liseye Nasıl Gideceğiz.mp4",
        fileUrl: "#",
        imageUrl: "assets/kapak-8.jpg",
        format: "MP4",
        hasBlob: true,
        tags: ["MEB 2026-2027", "LGS", "Liseye Geçiş", "video", "rehberlik", "ortaokul", "fenbilimleri", "fen"],
        visibility: "public",
        downloadCount: "Yeni",
        createdAt: "15.09.2026",
        updatedAt: "15.09.2026"
    },
    {
        id: "mat-1789502325405",
        grade: "8",
        category: "ders-notu",
        title: "8.Sınıf Fen Bilimleri Ders Kitabı",
        unit: "8. Sınıf Fen Bilimleri",
        desc: "Milli Eğitim Bakanlığı 8. Sınıf Fen Bilimleri Ders Kitabı (MEB 2026-2027).",
        fileName: "8.Sınıf Fen Bilimleri Ders Kitabı.pdf",
        fileUrl: "#",
        imageUrl: "assets/kapak-8.jpg",
        format: "PDF",
        hasBlob: true,
        tags: ["fenbilimleri", "fen", "ortaokul", "MEB 2026-2027"],
        visibility: "public",
        downloadCount: "Yeni",
        createdAt: "15.09.2026"
    },
    {
        id: "mat-1789501786165",
        grade: "5",
        category: "videolar",
        title: "Genel Güvenlik Sembolleri Video",
        unit: "Genel",
        desc: "5. Sınıf Fen Bilimleri Laboratuvar ve Güvenlik Sembolleri video anlatımı.",
        fileName: "Güvenlik Sembolleri.mp4",
        fileUrl: "#",
        imageUrl: "assets/kapak-5.jpg",
        format: "MP4",
        hasBlob: true,
        tags: ["MEB 2026-2027", "video", "güvenlik", "5.sınıf"],
        visibility: "public",
        downloadCount: "Yeni",
        createdAt: "15.09.2026",
        updatedAt: "15.09.2026"
    },
    {
        id: "mat-1789503112888",
        grade: "8",
        category: "videolar",
        title: "8. Sınıf Genel Güvenlik Sembolleri Video",
        unit: "Genel",
        desc: "8. Sınıf Fen Bilimleri Laboratuvar ve Güvenlik Sembolleri video anlatımı.",
        fileName: "Güvenlik Sembolleri.mp4",
        fileUrl: "#",
        imageUrl: "assets/kapak-8.jpg",
        format: "MP4",
        hasBlob: true,
        tags: ["MEB 2026-2027", "video", "güvenlik", "8.sınıf"],
        visibility: "public",
        downloadCount: "Yeni",
        createdAt: "15.09.2026",
        updatedAt: "15.09.2026"
    },
    {
        id: "mat-5-lab-oyun-1",
        grade: "5",
        category: "egitsel-oyunlar",
        title: "Laboratuvar Malzemeleri Eşleştirme",
        unit: "1. Ünite: Güneş, Dünya ve Ay",
        desc: "Bu interaktif eşleştirme oyunu, ortaokul Fen Bilimleri derslerinde kullanılan 30 temel laboratuvar araç-gerecini görsel ve isimleriyle eşleştirerek eğlenceli ve kalıcı bir şekilde öğrenmeyi sağlar.",
        fileName: "Laboratuvar Malzemeleri Eşleştirme",
        fileUrl: "#",
        format: "Web Bağlantısı",
        hasBlob: false,
        tags: ["MEB 2026-2027", "Laboratuvar", "Eşleştirme", "İnteraktif Oyun"],
        visibility: "public",
        downloadCount: "1.450+",
        createdAt: "08.09.2026"
    },
    {
        id: "mat-5-lab-oyun-2",
        grade: "5",
        category: "egitsel-oyunlar",
        title: "5. Sınıf Laboratuvar Malzemeleri ve Güvenlik Kuralları İnteraktif Oyunu",
        unit: "1. Ünite: Laboratuvar ve Fen Dünyası",
        desc: "Beherglas, erlenmayer, dereceli silindir (mezür), deney tüpleri ve laboratuvar güvenlik kurallarını eğlenerek eşleştirin ve tanıyın.",
        fileName: "5. Sınıf Laboratuvar Oyunu",
        fileUrl: "#",
        format: "EĞİTSEL OYUN",
        hasBlob: false,
        tags: ["MEB 2026-2027", "Laboratuvar", "Güvenlik Kuralları", "Fen Dünyası"],
        visibility: "public",
        downloadCount: "2.120+",
        createdAt: "Yeni Yayınlandı"
    },
    {
        id: "mat-8-lgs-deneme-1",
        grade: "8",
        category: "lgs",
        title: "8. Sınıf LGS Fen Bilimleri Branş Denemesi (20 Yeni Nesil Soru)",
        unit: "1. ve 2. Ünite: Mevsimler, İklim ve DNA",
        desc: "LGS formatında tam kapsamlı fen branş denemesi, detaylı çözümlü ve optik formlu.",
        fileName: "8_Sinif_LGS_Deneme.pdf",
        fileUrl: "#",
        format: "PDF",
        hasBlob: false,
        tags: ["MEB 2026-2027", "LGS 2027", "Branş Denemesi", "Yeni Nesil"],
        visibility: "public",
        downloadCount: "3.480+",
        createdAt: "Yeni Yayınlandı"
    },
    {
        id: "mat-1789495187673",
        grade: "5",
        category: "ders-notu",
        title: "5.Sınıf Fen Bilimleri Ders Kitabı-1",
        unit: "5. Sınıf Fen Bilimleri",
        desc: "Milli Eğitim Bakanlığı 5. Sınıf Fen Bilimleri Ders Kitabı 1. Kitap (MEB 2026-2027 Müfredatı).",
        fileName: "fenbilimleri5-1.pdf",
        fileUrl: "https://cdn.eba.gov.tr/temel-egitim/yayin/2026-2027/ktp/fenbilimleri5-1.pdf",
        imageUrl: "assets/kapak-5.jpg",
        format: "PDF",
        hasBlob: false,
        tags: ["MEB 2026-2027", "derskitabı", "fenbilimleri", "ortaokul"],
        visibility: "public",
        downloadCount: "5.100+",
        createdAt: "15.09.2026"
    },
    {
        id: "mat-1789495365682",
        grade: "6",
        category: "ders-notu",
        title: "6.Sınıf Fen Bilimleri Ders Kitabı-1",
        unit: "6. Sınıf Fen Bilimleri",
        desc: "Milli Eğitim Bakanlığı 6. Sınıf Fen Bilimleri Ders Kitabı 1. Kitap (MEB 2026-2027 Müfredatı).",
        fileName: "fenbilimleri6-1.pdf",
        fileUrl: "https://cdn.eba.gov.tr/temel-egitim/yayin/2026-2027/ktp/fenbilimleri6-1.pdf",
        imageUrl: "assets/kapak-6.jpg",
        format: "PDF",
        hasBlob: false,
        tags: ["MEB 2026-2027", "fenbilimleri", "derskitabı", "ortaokul"],
        visibility: "public",
        downloadCount: "4.800+",
        createdAt: "15.09.2026"
    },
    {
        id: "mat-1789495424636",
        grade: "7",
        category: "ders-notu",
        title: "7.Sınıf Fen Bilimleri Ders Kitabı-1",
        unit: "7. Sınıf Fen Bilimleri",
        desc: "Milli Eğitim Bakanlığı 7. Sınıf Fen Bilimleri Ders Kitabı 1. Kitap (MEB 2026-2027 Müfredatı).",
        fileName: "fenbilimleri7-1.pdf",
        fileUrl: "https://cdn.eba.gov.tr/temel-egitim/yayin/2026-2027/ktp/fenbilimleri7-1.pdf",
        imageUrl: "assets/kapak-7.jpg",
        format: "PDF",
        hasBlob: false,
        tags: ["MEB 2026-2027", "fenbilimleri", "derskitabı", "ortaokul"],
        visibility: "public",
        downloadCount: "4.200+",
        createdAt: "15.09.2026"
    },
    {
        id: "mat-8-ders-kitabi-1",
        grade: "8",
        category: "ders-notu",
        title: "8.Sınıf Fen Bilimleri Ders Kitabı-1",
        unit: "8. Sınıf Fen Bilimleri (LGS)",
        desc: "Milli Eğitim Bakanlığı 8. Sınıf Fen Bilimleri Ders Kitabı (MEB 2026-2027 Müfredatı & LGS Hazırlık).",
        fileName: "fenbilimleri8-1.pdf",
        fileUrl: "#",
        imageUrl: "assets/kapak-8.jpg",
        format: "PDF",
        hasBlob: false,
        tags: ["MEB 2026-2027", "fenbilimleri", "derskitabı", "LGS", "ortaokul"],
        visibility: "public",
        downloadCount: "6.900+",
        createdAt: "15.09.2026"
    }
];

function saveCustomMaterialsSafe(list) {
    if (!Array.isArray(list)) return;
    ROTALI_MATERIALS_CACHE = [...list];
    try {
        localStorage.setItem("rotali_custom_materials", JSON.stringify(list));
    } catch (storageErr) {
        console.warn("LocalStorage quota uyarısı, hafifletilmiş önbellek kaydediliyor:", storageErr);
        try {
            // Mobilde LocalStorage kotası dolarsa, bellekteki tam veri korunurken yerel depolama için ağır base64 URL'leri kısaltılır
            const slimList = list.map(item => {
                const copy = { ...item };
                if (copy.fileUrl && copy.fileUrl.startsWith("data:") && copy.fileUrl.length > 80000) {
                    copy.fileUrl = ""; // Tam dosya ROTALI_MATERIALS_CACHE ve IndexedDB'de mevcuttur
                }
                return copy;
            });
            localStorage.setItem("rotali_custom_materials", JSON.stringify(slimList));
        } catch (e2) {}
    }
}

function getCustomMaterialsList() {
    if (Array.isArray(ROTALI_MATERIALS_CACHE) && ROTALI_MATERIALS_CACHE.length > 0) {
        return ROTALI_MATERIALS_CACHE;
    }

    let customList = [];
    const deletedIds = new Set(getDeletedMaterialIds());
    deletedIds.add("mat-5-unite-bilgi");
    deletedIds.add("mat-5-lab-guvenlik-gorsel");

    try {
        const stored = localStorage.getItem("rotali_custom_materials");
        if (stored) {
            customList = JSON.parse(stored);
        }
    } catch (e) {
        customList = [];
    }

    if (!Array.isArray(customList) || customList.length === 0) {
        customList = DEFAULT_CUSTOM_MATERIALS.filter(item => !deletedIds.has(item.id));
        saveCustomMaterialsSafe(customList);
    } else {
        const cleanList = customList.filter(item => item && !deletedIds.has(item.id));
        if (cleanList.length !== customList.length) {
            customList = cleanList;
            saveCustomMaterialsSafe(customList);
        }
    }

    // Görsel URL güvencesi (fileUrl dataURL ise imageUrl olarak da kullan)
    customList.forEach(item => {
        if (item && !item.imageUrl && item.fileUrl && (item.fileUrl.startsWith("data:") || item.fileUrl.startsWith("http") || item.fileUrl.startsWith("assets/"))) {
            item.imageUrl = item.fileUrl;
        }
    });

    ROTALI_MATERIALS_CACHE = customList;
    return customList;
}

function renderCustomMaterialsSection(gradeNumber = "all", subTab = "all") {
    const customList = getCustomMaterialsList();
    const isAdmin = localStorage.getItem("rotali_is_admin") === "true";

    const items = customList.filter(item => {
        // Sınıf Eşleştirmesi ("5", 5, "grade-5", "all")
        const normItemGrade = String(item.grade || "").replace(/^grade-/, "").trim().toLowerCase();
        const normTargetGrade = String(gradeNumber || "").replace(/^grade-/, "").trim().toLowerCase();
        const gradeMatch = (normTargetGrade === "all" || normItemGrade === "all" || normItemGrade === normTargetGrade);

        // Kategori / Sekme Eşleştirmesi
        const itemCat = String(item.category || "").trim().toLowerCase();
        const targetSubTab = String(subTab || "").trim().toLowerCase();
        const itemFormat = String(item.format || "").trim().toLowerCase();
        const itemTitle = String(item.title || "").trim().toLowerCase();

        let categoryMatch = false;
        if (targetSubTab === "all" || targetSubTab === "uniteler") {
            categoryMatch = true;
        } else if (itemCat === targetSubTab) {
            categoryMatch = true;
        } else if (targetSubTab === "egitsel-oyunlar" || targetSubTab === "oyunlar" || targetSubTab === "oyun") {
            categoryMatch = (itemCat === "egitsel-oyunlar" || itemCat === "oyunlar" || itemCat === "oyun" || itemFormat.includes("oyun") || itemTitle.includes("oyun") || itemTitle.includes("eşleştirme"));
        } else if (targetSubTab === "ders-notu") {
            categoryMatch = (itemCat === "ders-notu" || itemCat === "not" || itemCat === "pdf" || (!itemCat && itemFormat.includes("pdf")));
        } else if (targetSubTab === "ders-sunumu") {
            categoryMatch = (itemCat === "ders-sunumu" || itemCat === "sunum" || itemFormat.includes("ppt") || itemFormat.includes("slayt"));
        } else if (targetSubTab === "videolar") {
            categoryMatch = (itemCat === "videolar" || itemCat === "video" || itemFormat.includes("youtube") || itemFormat.includes("video"));
        } else if (targetSubTab === "etkinlikler") {
            categoryMatch = (itemCat === "etkinlikler" || itemCat === "etkinlik" || itemCat === "foy");
        } else if (targetSubTab === "soru-bankasi") {
            categoryMatch = (itemCat === "soru-bankasi" || itemCat === "soru" || itemCat === "test");
        } else if (targetSubTab === "denemeler") {
            categoryMatch = (itemCat === "denemeler" || itemCat === "deneme");
        } else if (targetSubTab === "lgs" || targetSubTab === "lgs-pusulasi") {
            categoryMatch = (itemCat === "lgs" || itemCat === "lgs-pusulasi" || itemTitle.includes("lgs"));
        } else if (targetSubTab === "bilim-insanlari" || targetSubTab === "bilimin-rotasi") {
            categoryMatch = (itemCat === "bilim-insanlari" || itemCat === "bilimin-rotasi");
        } else if (targetSubTab === "projeler") {
            categoryMatch = (itemCat === "projeler" || itemCat === "proje" || itemCat === "stem");
        } else {
            categoryMatch = (itemCat === targetSubTab);
        }

        return gradeMatch && categoryMatch;
    });

    if (!items || items.length === 0) return "";

    return `
        <div class="mb-10 animate-in fade-in duration-300">
            <div class="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
                <h4 class="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-red-600 animate-pulse"></span>
                    <span>✨ Bu Bölüme Eklenen Materyaller (${items.length})</span>
                </h4>
                <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">Rotalı Fenci</span>
                    ${isAdmin ? `
                        <button type="button" onclick="triggerUploadModal('${gradeNumber === 'all' ? '8' : gradeNumber}', '${subTab === 'all' ? 'ders-notu' : subTab}')" class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 shadow-sm">
                            <i class="fa-solid fa-plus"></i> Yeni Ekle
                        </button>
                    ` : ''}
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${items.map(item => {
                    // Görsel & Kapak Çözümleme
                    let validImgUrl = "";
                    const rawImg = (item.imageUrl || "").trim();
                    const rawFile = (item.fileUrl || "").trim();
                    const lowerTitle = (item.title || "").toLocaleLowerCase("tr-TR");
                    const itemGrade = String(item.grade || gradeNumber || "5").replace(/^grade-/, "").trim();

                    if (rawImg && rawImg !== "#" && rawImg !== "null" && !rawImg.includes("cdn.eba.gov.tr")) {
                        validImgUrl = rawImg;
                    } else if (rawFile && rawFile !== "#" && rawFile !== "null" && !rawFile.includes("cdn.eba.gov.tr") && (rawFile.startsWith("data:image") || rawFile.endsWith(".png") || rawFile.endsWith(".jpg") || rawFile.endsWith(".jpeg") || rawFile.endsWith(".svg") || rawFile.endsWith(".webp") || rawFile.startsWith("assets/"))) {
                        validImgUrl = rawFile;
                    } else if (lowerTitle.includes("kitap") || lowerTitle.includes("kitab")) {
                        // 📚 Tüm sınıflar için MEB Fen Bilimleri Ders Kitabı Gerçek Kapak Görseli
                        if (["5", "6", "7", "8"].includes(itemGrade)) {
                            validImgUrl = `assets/kapak-${itemGrade}.jpg`;
                        } else {
                            validImgUrl = "assets/kapak-5.jpg";
                        }
                    } else if ((lowerTitle.includes("ünite") || lowerTitle.includes("üniteler")) && (lowerTitle.includes("bilgi") || lowerTitle.includes("işlenecek"))) {
                        validImgUrl = "assets/unite-bilgilendirmeleri-gorsel.png";
                    } else if (lowerTitle.includes("laboratuvar") && (lowerTitle.includes("güvenli") || lowerTitle.includes("kural")) && !lowerTitle.includes("video") && !lowerTitle.includes("oyun")) {
                        validImgUrl = "assets/lab-guvenligi.svg";
                    }

                    const isVideo = item.category === "videolar" || (item.format && item.format.toUpperCase().includes("VİDEO")) || (item.format && item.format.toUpperCase() === "MP4");
                    const isBook = lowerTitle.includes("kitap") || lowerTitle.includes("kitab");

                    return `
                        <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
                            <div>
                                <!-- Üst Bilgi ve Format -->
                                <div class="flex items-center justify-between gap-2 mb-3">
                                    <span class="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-black tracking-wider uppercase inline-block border border-slate-200">
                                        ${item.grade === 'all' ? 'TÜM SINIFLAR' : item.grade + '. SINIF'} • ${item.format || 'DOKÜMAN'}
                                    </span>
                                    <span class="text-[11px] font-bold text-slate-400">${item.createdAt || 'Bugün'}</span>
                                </div>

                                <!-- Ünite / Konu -->
                                ${item.unit ? `
                                    <div class="text-[11px] font-black text-red-600 mb-1.5 uppercase tracking-wide truncate">
                                        <i class="fa-solid fa-bookmark text-xs mr-1"></i> ${item.unit}
                                    </div>
                                ` : ''}

                                <!-- Başlık -->
                                <h4 class="text-base sm:text-lg font-black text-slate-900 mb-2.5 leading-snug group-hover:text-red-600 transition-colors">
                                    ${item.title}
                                </h4>

                                <!-- Görsel Varsa: Orantılı, Kırpılmayan Net Önizleme Kutusu (Kitaplar İçin Dikey 1 Tam Sayfa) -->
                                ${validImgUrl ? `
                                    <div class="mat-preview-box relative w-full ${isBook ? 'h-80 sm:h-96 bg-gradient-to-b from-slate-100 to-slate-200/90 p-3' : 'h-52 sm:h-60 bg-slate-50 p-2'} rounded-2xl overflow-hidden mb-3.5 border border-slate-200/80 group-hover:border-red-500/40 cursor-pointer shadow-inner flex items-center justify-center transition-all" onclick="openOrDownloadMaterial('${item.id}', '${validImgUrl}')">
                                        <img src="${validImgUrl}" alt="${item.title}" onerror="this.closest('.mat-preview-box').style.display='none';" class="w-auto h-full max-h-full object-contain ${isBook ? 'rounded-xl shadow-lg border border-slate-300/60' : ''} transition-transform duration-300 group-hover:scale-105">
                                        <div class="absolute bottom-2.5 right-2.5">
                                            <span class="px-2.5 py-1 bg-slate-900/85 hover:bg-red-600 text-white text-[10px] font-black uppercase rounded-lg shadow-md backdrop-blur-sm transition-colors flex items-center gap-1.5">
                                                <i class="fa-solid fa-book-open-reader"></i> ${isBook ? 'Kitabı Aç & Sayfaları Çevir' : 'Görseli Aç'}
                                            </span>
                                        </div>
                                    </div>
                                ` : ''}

                                <!-- Açıklama -->
                                <p class="text-xs text-slate-600 leading-relaxed mb-4 font-medium">
                                    ${(item.desc || '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
                                </p>

                                <!-- Etiketler -->
                                ${item.tags && item.tags.length > 0 ? `
                                    <div class="flex flex-wrap gap-1 mb-4">
                                        ${((item && item.tags) || []).map(t => `<span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">#${t}</span>`).join("")}
                                    </div>
                                ` : ''}
                            </div>

                            <!-- Butonlar -->
                            <div class="pt-3 border-t border-slate-100 flex flex-col gap-2">
                                <button type="button" onclick="openOrDownloadMaterial('${item.id}', '${validImgUrl || item.fileUrl || '#'}')" class="w-full py-2.5 bg-gradient-to-r ${isVideo ? 'from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700' : (isBook ? 'from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700' : 'from-slate-900 to-slate-800 hover:from-red-600 hover:to-red-700')} text-white font-black text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-2 shadow-md">
                                    <i class="fa-solid ${isVideo ? 'fa-play' : (validImgUrl ? 'fa-eye' : 'fa-file-lines')}"></i>
                                    <span>${isVideo ? 'Oynat' : (isBook ? 'Kitabı Aç & Oku' : 'Görüntüle')}</span>
                                </button>

                                ${isAdmin ? `
                                    <div class="flex items-center gap-1.5 mt-2">
                                        <button type="button" onclick="moveCustomMaterial('${item.id}', -1)" class="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all flex items-center justify-center" title="Yukarı Taşı">
                                            <i class="fa-solid fa-arrow-up"></i>
                                        </button>
                                        <button type="button" onclick="moveCustomMaterial('${item.id}', 1)" class="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all flex items-center justify-center" title="Aşağı Taşı">
                                            <i class="fa-solid fa-arrow-down"></i>
                                        </button>
                                        <button type="button" onclick="editCustomMaterial('${item.id}')" class="flex-1 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-xl border border-amber-200 transition-all flex items-center justify-center gap-1.5" title="Düzenle / Konum Değiştir">
                                            <i class="fa-solid fa-pen-to-square"></i> Düzenle
                                        </button>
                                        <button type="button" onclick="deleteCustomMaterial('${item.id}')" class="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition-all flex items-center justify-center gap-1.5" title="Sil">
                                            <i class="fa-solid fa-trash-can"></i> Sil
                                        </button>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `;
                }).join("")}
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

    // Geçmişteki hatalı başlık filtrelerini localStorage'dan temizle
    try {
        const storedDel = localStorage.getItem("rotali_deleted_materials");
        if (storedDel) {
            let list = JSON.parse(storedDel);
            if (Array.isArray(list)) {
                const cleaned = list.filter(id => typeof id === "string" && id.startsWith("mat-") && id !== "mat-1789419390441");
                localStorage.setItem("rotali_deleted_materials", JSON.stringify(cleaned));
            }
        }
    } catch(e) {}

    handleRouteChange();
    updateUserInterface();
    CloudSyncManager.init();
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
function handleRouteChange(options = {}) {
    updateAdminNavUI();
    const rawHash = window.location.hash.slice(1);
    const hash = rawHash || "home";
    const appEl = document.getElementById("app");
    if (!appEl) return;

    if (!options || !options.preserveScroll) {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (hash === "home" || hash === "") {
        renderHomePage(appEl);
    } else if (hash === "recent" || hash === "yeni-eklenenler") {
        renderRecentMaterialsPage(appEl);
    } else if (hash === "grades") {
        renderGradesOverview(appEl);
    } else if (hash.startsWith("grade/")) {
        const gradeParam = hash.replace("grade/", "");
        renderGradeDetail(appEl, gradeParam);
    } else if (hash.startsWith("unit/")) {
        const parts = hash.replace("unit/", "").split("/");
        const unitId = parts[0];
        const gradeNum = unitId.split("-")[0] || "5";
        renderGradeDetail(appEl, `grade-${gradeNum}`);
    } else if (hash === "lgs-pusulasi" || hash === "lgs") {
        renderGradeDetail(appEl, "grade-8/lgs");
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

    // Mobil Alt Bar (iOS & Android) Aktiflik Durumu
    document.querySelectorAll(".mobile-bottom-tab").forEach(tab => {
        const href = tab.getAttribute("href") ? tab.getAttribute("href").replace("#", "") : "";
        if (hash === href || (hash === "home" && href === "home") || (href.startsWith("grade/") && hash.startsWith(href))) {
            tab.classList.add("text-brand-red", "font-black");
            tab.classList.remove("text-slate-600");
        } else {
            tab.classList.remove("text-brand-red", "font-black");
            tab.classList.add("text-slate-600");
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

    if (progressFill && progressFill.style) progressFill.style.width = `${percent}%`;
    if (progressText) progressText.innerText = `%${percent} TAMAMLANDI`;
}

// -------------------------------------------------------------
// 1. 🏠 PORTAL KONTROL MERKEZİ (ANA SAYFA)
// -------------------------------------------------------------
function renderHomeRecentMaterialsSection() {
    const customList = getCustomMaterialsList();
    const isAdmin = localStorage.getItem("rotali_is_admin") === "true";

    // Örnek varsayılan son eklenen içerikler
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
            fileUrl: "#",
            tags: ["5. Sınıf", "Oyun", "Laboratuvar"]
        },
        {
            id: "default-rec-2",
            grade: "5",
            category: "egitsel-oyunlar",
            format: "Web Bağlantısı",
            unit: "1. Ünite: Güneş, Dünya ve Ay",
            title: "Laboratuvar Malzemeleri Eşleştirme",
            desc: "Ortaokul Fen Bilimleri derslerinde kullanılan 30 temel laboratuvar araç-gerecini görsel ve isimleriyle eşleştirme oyunu.",
            createdAt: "08.09.2026",
            fileUrl: "#",
            tags: ["5. Sınıf", "Laboratuvar", "Eşleştirme"]
        },
        {
            id: "default-rec-3",
            grade: "8",
            category: "lgs",
            format: "PDF DENEME",
            unit: "1. ve 2. Ünite: Mevsimler, İklim ve DNA",
            title: "8. Sınıf LGS Fen Bilimleri Branş Denemesi (20 Yeni Nesil Soru)",
            desc: "Animasyonlu deney düzenekleri, formül çıkarımları ve MEB çıkmış soru çözümleri içeren deneme.",
            createdAt: "Yeni Yayınlandı",
            fileUrl: "#",
            tags: ["8. Sınıf", "LGS 2027", "Deneme"]
        },
        {
            id: "default-rec-4",
            grade: "7",
            category: "ders-notu",
            format: "PDF NOT",
            unit: "2. Ünite: Hücre ve Bölünmeler",
            title: "7. Sınıf Hücre, Mitoz ve Mayoz Bölünme Karşılaştırma Tablolu Ders Notu",
            desc: "Görsel hafıza teknikleriyle hazırlanmış renkli konu özetleri ve sınavda çıkabilecek tuzak noktalar.",
            createdAt: "Yeni Yayınlandı",
            fileUrl: "#",
            tags: ["7. Sınıf", "Ders Notu", "Mitoz-Mayoz"]
        }
    ];

    // Özel yüklenenleri en başa al, yoksa varsayılanlarla birleştir
    let displayItems = [...customList];
    for (let def of defaultRecent) {
        if (!displayItems.some(i => i.title === def.title)) {
            displayItems.push(def);
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
                                    ${((item && item.tags) || []).map(t => `<span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">#${t}</span>`).join("")}
                                </div>
                            ` : ''}
                        </div>

                        <div class="pt-3 border-t border-slate-100 flex flex-col gap-2">
                            <button type="button" onclick="openOrDownloadMaterial('${item.id}', '${item.fileUrl || '#'}', '${(item.fileName || 'materyal.pdf').replace(/'/g, "\\'")}', '${item.category || ''}', '${(item.title || '').replace(/'/g, "\\'")}')" class="w-full py-2.5 bg-slate-900 hover:bg-red-600 text-white font-black text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-2 shadow-md group-hover:shadow-red-600/20">
                                <i class="fa-solid ${item.category === 'egitsel-oyunlar' || item.format.includes('OYUN') ? 'fa-gamepad' : item.category === 'videolar' ? 'fa-play' : 'fa-eye'}"></i>
                                <span>${item.category === 'egitsel-oyunlar' || item.format.includes('OYUN') ? 'Oyunu Oynat' : item.category === 'videolar' ? 'Videoyu Oynat' : 'Materyali Görüntüle'}</span>
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


// -------------------------------------------------------------
// ✨ YENİ EKLENEN MATERYALLER SAYFASI (EĞİTİM AĞI DİNAMİK VİTRİN)
// -------------------------------------------------------------
function renderRecentMaterialsPage(container, filterGrade = "all", filterCat = "all") {
    const customList = getCustomMaterialsList();
    const isAdmin = localStorage.getItem("rotali_is_admin") === "true";

    let filtered = [...customList];
    if (filterGrade !== "all") {
        filtered = filtered.filter(m => String(m.grade) === String(filterGrade));
    }
    if (filterCat !== "all") {
        filtered = filtered.filter(m => (m.category === filterCat || (m.format && m.format.toLowerCase().includes(filterCat.toLowerCase()))));
    }

    // Tarihe göre sırala (en son eklenen en başta)
    filtered.sort((a, b) => {
        const timeA = a.id && a.id.startsWith("mat-17") ? parseInt(a.id.replace("mat-", "")) : 0;
        const timeB = b.id && b.id.startsWith("mat-17") ? parseInt(b.id.replace("mat-", "")) : 0;
        return timeB - timeA;
    });

    container.innerHTML = `
        <div class="py-8 sm:py-12 bg-slate-50 min-h-[85vh]">
            <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                
                <!-- Başlık Alanı -->
                <div class="bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
                    <div class="relative z-10 max-w-3xl">
                        <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider mb-3">
                            <i class="fa-solid fa-sparkles text-amber-300 animate-pulse"></i> CANLI BULUT ARŞİVİ
                        </span>
                        <h2 class="text-2xl sm:text-4xl font-black mb-2 tracking-tight">✨ Yeni Eklenen Fen Materyalleri</h2>
                        <p class="text-xs sm:text-sm text-amber-50 font-medium leading-relaxed">
                            Öğretmen ve öğrencilerimiz için telefon ve bilgisayardan sisteme yüklenen en güncel ders notları, akıllı tahta sunumları, deney videoları ve eğitsel oyunlar.
                        </p>
                    </div>
                    ${isAdmin ? `
                        <div class="mt-6 relative z-10">
                            <button type="button" onclick="triggerUploadModal('5', 'ders-notu')" class="px-5 py-2.5 bg-white text-orange-700 hover:bg-amber-50 font-black text-xs uppercase rounded-xl transition-all shadow-lg flex items-center gap-2">
                                <i class="fa-solid fa-plus text-sm"></i> Yeni Materyal Yükle
                            </button>
                        </div>
                    ` : ''}
                </div>

                <!-- Filtreleme Butonları (Eğitim Ağı Kapsül Formatı) -->
                <div class="flex flex-wrap items-center justify-between gap-3 mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <!-- Sınıf Filtreleri -->
                    <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                        <button onclick="renderRecentMaterialsPage(document.getElementById('app'), 'all', '${filterCat}')" class="px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${filterGrade === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
                            Tüm Sınıflar (${customList.length})
                        </button>
                        <button onclick="renderRecentMaterialsPage(document.getElementById('app'), '5', '${filterCat}')" class="px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${filterGrade === '5' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'}">
                            🟢 5. Sınıf
                        </button>
                        <button onclick="renderRecentMaterialsPage(document.getElementById('app'), '6', '${filterCat}')" class="px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${filterGrade === '6' ? 'bg-blue-600 text-white shadow-sm' : 'bg-blue-50 text-blue-800 hover:bg-blue-100'}">
                            🔵 6. Sınıf
                        </button>
                        <button onclick="renderRecentMaterialsPage(document.getElementById('app'), '7', '${filterCat}')" class="px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${filterGrade === '7' ? 'bg-amber-600 text-white shadow-sm' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'}">
                            🟡 7. Sınıf
                        </button>
                        <button onclick="renderRecentMaterialsPage(document.getElementById('app'), '8', '${filterCat}')" class="px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${filterGrade === '8' ? 'bg-red-600 text-white shadow-sm' : 'bg-red-50 text-red-800 hover:bg-red-100'}">
                            🔴 8. Sınıf (LGS)
                        </button>
                    </div>

                    <!-- Kategori Filtreleri -->
                    <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                        <button onclick="renderRecentMaterialsPage(document.getElementById('app'), '${filterGrade}', 'all')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterCat === 'all' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}">
                            Tüm Türler
                        </button>
                        <button onclick="renderRecentMaterialsPage(document.getElementById('app'), '${filterGrade}', 'ders-notu')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterCat === 'ders-notu' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}">
                            📝 Ders Notu
                        </button>
                        <button onclick="renderRecentMaterialsPage(document.getElementById('app'), '${filterGrade}', 'videolar')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterCat === 'videolar' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-100'}">
                            🎥 Video
                        </button>
                        <button onclick="renderRecentMaterialsPage(document.getElementById('app'), '${filterGrade}', 'oyun')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterCat === 'oyun' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'}">
                            🎮 Oyun
                        </button>
                    </div>
                </div>

                <!-- Kartlar Listesi -->
                ${filtered.length === 0 ? `
                    <div class="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-xl mx-auto">
                        <div class="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mx-auto mb-4">
                            <i class="fa-solid fa-folder-open"></i>
                        </div>
                        <h4 class="text-lg font-black text-slate-900 mb-1">Henüz Materyal Bulunamadı</h4>
                        <p class="text-xs text-slate-500 mb-6">Seçtiğiniz filtreye ait içerik henüz yüklenmemiş veya güncelleniyor.</p>
                        <a href="#home" class="px-5 py-2.5 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-red-600 transition-colors">
                            Ana Sayfaya Dön
                        </a>
                    </div>
                ` : `
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${filtered.map(item => `
                            <div class="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group">
                                <div>
                                    <!-- Üst Rozet & Sınıf -->
                                    <div class="p-5 pb-3 flex items-center justify-between border-b border-slate-100">
                                        <div class="flex items-center gap-2">
                                            <span class="px-3 py-1 rounded-full ${item.grade === '5' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : item.grade === '6' ? 'bg-blue-50 text-blue-700 border-blue-200' : item.grade === '7' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'} border text-[11px] font-black uppercase">
                                                ${item.grade}. Sınıf
                                            </span>
                                            <span class="text-[11px] font-bold text-slate-400">• ${item.unit || 'Müfredat'}</span>
                                        </div>
                                        <span class="text-[11px] font-bold text-slate-400">${item.createdAt || 'Yeni'}</span>
                                    </div>

                                    <!-- Görsel Önizleme (Varsa) -->
                                    ${item.imageUrl && item.imageUrl !== '#' && !item.imageUrl.includes('placeholder') ? `
                                        <div class="relative w-full aspect-[16/9] bg-slate-50 border-b border-slate-100 overflow-hidden flex items-center justify-center p-2">
                                            <img src="${item.imageUrl}" alt="${item.title}" class="max-h-full max-w-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-300" loading="lazy">
                                        </div>
                                    ` : ''}

                                    <!-- İçerik Başlığı & Açıklaması -->
                                    <div class="p-5">
                                        <div class="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                                            ${item.format || 'FEN MATERYALİ'}
                                        </div>
                                        <h3 class="text-base font-black text-slate-900 leading-snug group-hover:text-red-600 transition-colors mb-2 line-clamp-2">
                                            ${item.title}
                                        </h3>
                                        <p class="text-xs text-slate-600 font-medium leading-relaxed line-clamp-3 mb-4">
                                            ${item.desc || 'MEB müfredatına uygun fen bilimleri materyali.'}
                                        </p>
                                        
                                        <!-- Etiketler -->
                                        ${item.tags && Array.isArray(item.tags) && item.tags.length > 0 ? `
                                            <div class="flex flex-wrap gap-1.5 pt-2">
                                                ${item.tags.map(t => `<span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">#${t}</span>`).join("")}
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>

                                <!-- Alt Butonlar -->
                                <div class="p-5 pt-0 border-t border-slate-100/80 mt-2 space-y-2">
                                    <button type="button" onclick="openOrDownloadMaterial('${item.id}', '${item.fileUrl || '#'}', '${item.fileName || 'materyal'}', '${item.category || ''}', '${item.title || ''}')" class="w-full py-2.5 bg-slate-900 hover:bg-red-600 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
                                        <i class="fa-solid ${item.category === 'egitsel-oyunlar' || (item.format && item.format.includes('OYUN')) ? 'fa-gamepad' : item.category === 'videolar' ? 'fa-play' : 'fa-eye'}"></i>
                                        <span>${item.category === 'egitsel-oyunlar' || (item.format && item.format.includes('OYUN')) ? 'Oyunu Oynat' : item.category === 'videolar' ? 'Videoyu Oynat' : 'Materyali Görüntüle'}</span>
                                    </button>

                                    ${isAdmin ? `
                                        <div class="flex items-center gap-2 pt-1">
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
                `}

            </div>
        </div>
    `;
}

function renderHomePage(container) {
    const profile = DataManager.getStudentProfile();

    container.innerHTML = `
        <!-- Hero Portal Giriş Alanı (Eğitim Ağı Formatı & Zenginleştirilmiş Başlık) -->
        <section class="relative bg-gradient-to-b from-slate-50 via-white to-slate-100/70 border-b border-slate-200 py-10 lg:py-14 overflow-hidden select-none">
            <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
                
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-8">
                    <!-- Sol Metin & Slogan -->
                    <div class="lg:col-span-7 flex flex-col items-start text-left">
                        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-black tracking-wider uppercase mb-4 shadow-2xs">
                            <i class="fa-solid fa-sparkles text-red-600 animate-pulse"></i>
                            <span>TÜRKİYE'NİN DİJİTAL FEN EĞİTİM PORTALI</span>
                        </div>

                        <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-4">
                            Bilimi Keşfet, <br class="hidden sm:inline"/>
                            <span class="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-indigo-900">Rotanı Çiz!</span>
                        </h1>

                        <!-- Kullanıcının İstediği Tam Metin (Eğitim Ağı Formatında Vurgulu & Akıcı Sunum) -->
                        <p class="text-slate-600 text-sm sm:text-base leading-relaxed font-medium mb-6 max-w-2xl">
                            <strong class="text-slate-900 font-extrabold">Rotalı Fenci;</strong> PDF ders notları, akıllı tahta sunumları, deney videoları, istasyon etkinlikleri, yeni nesil soru bankası, LGS denemeleri, 3D eğitsel oyunları ve <em class="text-indigo-900 font-bold not-italic">“Bilimin Rotasını Çizenler”</em> köşesiyle akıllı tahta, bilgisayar, tablet ve telefonlarda kesintisiz bir öğrenme deneyimi sunar.
                        </p>

                        <!-- Hızlı Eylem Butonları -->
                        <div class="flex flex-wrap items-center gap-3 mb-6">
                            <a href="#recent" class="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white text-xs sm:text-sm font-black uppercase tracking-wider transition-all shadow-md hover:-translate-y-0.5 flex items-center gap-2">
                                <i class="fa-solid fa-sparkles text-amber-300"></i> Yeni Eklenenleri Gör
                            </a>
                            <a href="#grade/grade-8" class="px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 text-xs sm:text-sm font-black uppercase tracking-wider transition-all border border-slate-300 shadow-2xs flex items-center gap-2">
                                🔴 8. Sınıf LGS Rehberi
                            </a>
                        </div>

                        <!-- Özellik Rozetleri (Checkmark Listesi) -->
                        <div class="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-200/80 text-slate-600 text-xs font-bold">
                            <span class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center gap-1.5">✓ PDF Ders Föyleri</span>
                            <span class="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200/80 flex items-center gap-1.5">✓ Akıllı Tahta PPTX</span>
                            <span class="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200/80 flex items-center gap-1.5">✓ 3D Eğitsel Oyunlar</span>
                            <span class="px-2.5 py-1 rounded-lg bg-red-50 text-red-800 border border-red-200/80 flex items-center gap-1.5">✓ LGS Branş Denemeleri</span>
                        </div>
                    </div>

                    <!-- Sağ Görsel Kart (Günün Vitrini) -->
                    <div class="lg:col-span-5 relative w-full aspect-[16/11] rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-200 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col justify-between p-6 sm:p-8 text-white group">
                        <div class="flex items-center justify-between">
                            <span class="px-3.5 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider shadow-md">
                                🚀 Rotalı Fenci Hub
                            </span>
                            <span class="text-xs font-bold text-slate-300">MEB 2026-2027</span>
                        </div>

                        <div>
                            <div class="text-2xl sm:text-3xl font-black mb-2 text-white group-hover:text-amber-300 transition-colors">
                                Fen Bilimlerini Eğlenerek Keşfet
                            </div>
                            <p class="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                                Deneyler, simülatörler ve etkileşimli dijital içeriklerle fen dersini her cihazda yaşayın.
                            </p>
                        </div>

                        <div class="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-bold text-slate-300">
                            <span>📱 Mobil & Akıllı Tahta Uyumlu</span>
                            <a href="#stem-lab" class="text-amber-400 hover:text-amber-300 flex items-center gap-1">
                                STEM Keşfet →
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </section>

        <!-- 📊 EĞİTİM AĞI & ROTALI FENCİ PORTAL İSTATİSTİKLERİ (İSTENEN SAYILAR) -->
        <section class="w-full py-6 md:py-8 text-white shadow-md border-y border-red-900/30" style="background: linear-gradient(100deg, #991b1b 0%, #dc2626 45%, #1e1b4b 100%);">
            <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 text-center">
                <div class="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xs hover:bg-white/15 transition-all">
                    <span class="text-2xl sm:text-3xl font-black text-white tracking-tight">4</span>
                    <span class="text-white/90 text-xs font-bold mt-1">Sınıf Düzeyi (5-8)</span>
                </div>
                <div class="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xs hover:bg-white/15 transition-all">
                    <span class="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight">120+</span>
                    <span class="text-white/90 text-xs font-bold mt-1">Paylaşılan Kaynak</span>
                </div>
                <div class="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xs hover:bg-white/15 transition-all">
                    <span class="text-2xl sm:text-3xl font-black text-emerald-300 tracking-tight">45+</span>
                    <span class="text-white/90 text-xs font-bold mt-1">Deney & Video</span>
                </div>
                <div class="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xs hover:bg-white/15 transition-all">
                    <span class="text-2xl sm:text-3xl font-black text-sky-300 tracking-tight">30+</span>
                    <span class="text-white/90 text-xs font-bold mt-1">Eğitsel Oyun & Simülatör</span>
                </div>
                <div class="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xs hover:bg-white/15 transition-all">
                    <span class="text-2xl sm:text-3xl font-black text-orange-300 tracking-tight">28</span>
                    <span class="text-white/90 text-xs font-bold mt-1">Müfredat Ünitesi</span>
                </div>
                <div class="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xs hover:bg-white/15 transition-all">
                    <span class="text-2xl sm:text-3xl font-black text-teal-300 tracking-tight">%100</span>
                    <span class="text-white/90 text-xs font-bold mt-1">Yeni Müfredat Uyumlu</span>
                </div>
            </div>
        </section>

        <section class="py-12 bg-slate-50 border-b border-slate-200">
            <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

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
                                ${(profile?.dailyTasks || []).map(t => `
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
                <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-xs font-bold text-red-700 bg-red-50 px-3.5 py-1.5 rounded-full border border-red-200 self-start sm:self-auto">
                        🏆 İlham Veren Başarı Hikayeleri
                    </span>
                    ${localStorage.getItem("rotali_is_admin") === "true" ? `
                        <button type="button" onclick="triggerUploadModal('${gradeNumber}', 'ders-notu')" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-red-600/20 active:scale-95">
                            <i class="fa-solid fa-plus"></i> + Bilim Notu Ekle
                        </button>
                    ` : ''}
                </div>
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
                        <option value="❌ Açılmayan Dosya / Görüntüleme Sorunu">❌ Açılmayan Dosya / Görüntüleme Sorunu</option>
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
            <!-- Hero Başlık & 8'li Kutu Modül Alanı (KOMPAKT & MODERN) -->
            <div class="bg-gradient-to-r ${grade.color} text-white rounded-2xl p-4 sm:p-6 mb-6 shadow-xl relative overflow-hidden">
                <div class="relative z-10">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div class="flex items-center gap-2">
                            <span class="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-[11px] font-black tracking-wider uppercase inline-block shadow-sm">
                                ${grade.number}. SINIF FEN BİLİMLERİ PORTALI
                            </span>
                            ${grade.isLGS ? '<span class="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black shadow-sm">🔥 LGS MERKEZİ</span>' : ''}
                        </div>
                        ${isAdmin ? `
                        <div class="flex items-center gap-2">
                            <button onclick="triggerUploadModal('${grade.number}', '${subTab}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase rounded-lg transition-all flex items-center gap-1.5 shadow-sm self-start sm:self-auto">
                                <i class="fa-solid fa-cloud-arrow-up"></i> + İçerik Ekle
                            </button>
                        </div>
                    ` : ''}
                    </div>

                    <h2 class="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-1 drop-shadow-sm">${grade.title}</h2>
                    <p class="text-xs sm:text-sm text-white/90 leading-snug max-w-4xl font-medium drop-shadow-sm mb-3">${grade.description}</p>
                    
                    <!-- 8 ALT BÖLÜM KUTULARI (KOMPAKT DİZİLİM) -->
                    <div class="pt-3 border-t border-white/20">
                        <div class="grid grid-cols-2 sm:grid-cols-4 ${grade.number === 8 || grade.isLGS ? "lg:grid-cols-9" : "lg:grid-cols-8"} gap-1.5 sm:gap-2">
                            
                            <!-- 1. Ders Notu -->
                            <button onclick="switchGradeSubTab('${grade.id}', 'ders-notu')" class="group p-2 rounded-xl transition-all flex flex-col items-center justify-center text-center gap-1 ${subTab === 'ders-notu' ? 'bg-white text-slate-900 shadow-lg scale-[1.02] ring-2 ring-white/50' : 'bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/15'}">
                                <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-sm ${subTab === 'ders-notu' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white/20 text-white'}">
                                    <i class="fa-solid fa-file-lines"></i>
                                </div>
                                <span class="text-[10px] font-black tracking-tight uppercase leading-tight">📝 DERS NOTU</span>
                            </button>

                            <!-- 2. Ders Sunumu -->
                            <button onclick="switchGradeSubTab('${grade.id}', 'ders-sunumu')" class="group p-2 rounded-xl transition-all flex flex-col items-center justify-center text-center gap-1 ${subTab === 'ders-sunumu' ? 'bg-white text-slate-900 shadow-lg scale-[1.02] ring-2 ring-white/50' : 'bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/15'}">
                                <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-sm ${subTab === 'ders-sunumu' ? 'bg-orange-600 text-white shadow-sm' : 'bg-white/20 text-white'}">
                                    <i class="fa-solid fa-file-powerpoint"></i>
                                </div>
                                <span class="text-[10px] font-black tracking-tight uppercase leading-tight">📊 DERS SUNUMU</span>
                            </button>

                            <!-- 3. Videolar -->
                            <button onclick="switchGradeSubTab('${grade.id}', 'videolar')" class="group p-2 rounded-xl transition-all flex flex-col items-center justify-center text-center gap-1 ${subTab === 'videolar' ? 'bg-white text-slate-900 shadow-lg scale-[1.02] ring-2 ring-white/50' : 'bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/15'}">
                                <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-sm ${subTab === 'videolar' ? 'bg-rose-600 text-white shadow-sm' : 'bg-white/20 text-white'}">
                                    <i class="fa-solid fa-circle-play"></i>
                                </div>
                                <span class="text-[10px] font-black tracking-tight uppercase leading-tight">🎥 VİDEOLAR</span>
                            </button>

                            <!-- 4. Etkinlikler -->
                            <button onclick="switchGradeSubTab('${grade.id}', 'etkinlikler')" class="group p-2 rounded-xl transition-all flex flex-col items-center justify-center text-center gap-1 ${subTab === 'etkinlikler' ? 'bg-white text-slate-900 shadow-lg scale-[1.02] ring-2 ring-white/50' : 'bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/15'}">
                                <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-sm ${subTab === 'etkinlikler' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white/20 text-white'}">
                                    <i class="fa-solid fa-puzzle-piece"></i>
                                </div>
                                <span class="text-[10px] font-black tracking-tight uppercase leading-tight">🧩 ETKİNLİKLER</span>
                            </button>

                            <!-- 5. Soru Bankası -->
                            <button onclick="switchGradeSubTab('${grade.id}', 'soru-bankasi')" class="group p-2 rounded-xl transition-all flex flex-col items-center justify-center text-center gap-1 ${subTab === 'soru-bankasi' ? 'bg-white text-slate-900 shadow-lg scale-[1.02] ring-2 ring-white/50' : 'bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/15'}">
                                <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-sm ${subTab === 'soru-bankasi' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white/20 text-white'}">
                                    <i class="fa-solid fa-book-open-reader"></i>
                                </div>
                                <span class="text-[10px] font-black tracking-tight uppercase leading-tight">📚 SORU BANKASI</span>
                            </button>

                            <!-- 6. Denemeler -->
                            <button onclick="switchGradeSubTab('${grade.id}', 'denemeler')" class="group p-2 rounded-xl transition-all flex flex-col items-center justify-center text-center gap-1 ${subTab === 'denemeler' ? 'bg-white text-slate-900 shadow-lg scale-[1.02] ring-2 ring-white/50' : 'bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/15'}">
                                <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-sm ${subTab === 'denemeler' ? 'bg-purple-600 text-white shadow-sm' : 'bg-white/20 text-white'}">
                                    <i class="fa-solid fa-bullseye"></i>
                                </div>
                                <span class="text-[10px] font-black tracking-tight uppercase leading-tight">🎯 DENEMELER</span>
                            </button>

                            <!-- 7. Eğitsel Oyunlar -->
                            <button onclick="switchGradeSubTab('${grade.id}', 'egitsel-oyunlar')" class="group p-2 rounded-xl transition-all flex flex-col items-center justify-center text-center gap-1 ${subTab === 'egitsel-oyunlar' ? 'bg-white text-slate-900 shadow-lg scale-[1.02] ring-2 ring-white/50' : 'bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/15'}">
                                <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-sm ${subTab === 'egitsel-oyunlar' ? 'bg-fuchsia-600 text-white shadow-sm' : 'bg-white/20 text-white'}">
                                    <i class="fa-solid fa-gamepad"></i>
                                </div>
                                <span class="text-[10px] font-black tracking-tight uppercase leading-tight">🎮 EĞİTSEL OYUNLAR</span>
                            </button>

                            ${grade.number === 8 || grade.isLGS ? `
                            <!-- 8. LGS Pusulası (8. Sınıfa Özel) -->
                            <button onclick="switchGradeSubTab('${grade.id}', 'lgs')" class="group p-2 rounded-xl transition-all flex flex-col items-center justify-center text-center gap-1 ${subTab === 'lgs' || subTab === 'lgs-pusulasi' ? 'bg-white text-slate-900 shadow-lg scale-[1.02] ring-2 ring-white/50' : 'bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/15'}">
                                <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-sm ${subTab === 'lgs' || subTab === 'lgs-pusulasi' ? 'bg-red-600 text-white shadow-sm' : 'bg-white/20 text-white'}">
                                    <i class="fa-solid fa-graduation-cap"></i>
                                </div>
                                <span class="text-[10px] font-black tracking-tight uppercase leading-tight">🧭 LGS PUSULASI</span>
                            </button>
                            ` : ''}

                            <!-- Bilimin Rotasını Çizenler (EN SONDA) -->
                            <button onclick="switchGradeSubTab('${grade.id}', 'bilim-insanlari')" class="group p-2 rounded-xl transition-all flex flex-col items-center justify-center text-center gap-1 ${subTab === 'bilim-insanlari' ? 'bg-white text-slate-900 shadow-lg scale-[1.02] ring-2 ring-white/50' : 'bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/15'}">
                                <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-sm ${subTab === 'bilim-insanlari' ? 'bg-red-600 text-white shadow-sm' : 'bg-white/20 text-white'}">
                                    <i class="fa-solid fa-telescope"></i>
                                </div>
                                <span class="text-[10px] font-black tracking-tight uppercase leading-tight">🔭 BİLİMİN ROTASINI ÇİZENLER</span>
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
    const isAdmin = localStorage.getItem("rotali_is_admin") === "true";
    if (subTab === "lgs" || subTab === "lgs-pusulasi") {
        return `
            <div class="mb-8">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="px-3.5 py-1 rounded-full bg-gradient-to-r from-red-600 to-rose-700 text-white text-[11px] font-black tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
                                <i class="fa-solid fa-bullseye text-amber-300"></i> HEDEF 20/20 LGS FEN
                            </span>
                            <span class="text-xs font-bold text-slate-500">8. Sınıf LGS Hazırlık & Başarı Merkezi</span>
                        </div>
                        <h3 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">8. Sınıf LGS Pusulası & Çıkmış Soru Analizleri</h3>
                    </div>
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-xs font-bold text-red-700 bg-red-50 px-3.5 py-1.5 rounded-full border border-red-200 self-start sm:self-auto">
                            🔥 MEB Yeni Nesil Standartları
                        </span>
                        ${isAdmin ? `
                            <button type="button" onclick="triggerUploadModal('8', 'lgs')" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-red-600/20 active:scale-95">
                                <i class="fa-solid fa-plus"></i> + LGS Materyali Ekle
                            </button>
                        ` : ''}
                    </div>
                </div>

                ${renderCustomMaterialsSection("8", "lgs")}

                <!-- 4 Altın Kural Strateji Kartları -->
                <div class="mb-10">
                    <h4 class="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                        <i class="fa-solid fa-compass text-red-600"></i> LGS Fen Başarı Rehberi: 4 Altın Kural
                    </h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        ${LGS_PUSULA_DATA.strategyCards.map(s => `
                            <div class="p-6 bg-white border-2 border-slate-200/90 hover:border-red-400 rounded-3xl shadow-sm hover:shadow-md transition-all">
                                <div class="text-3xl font-black text-red-600 mb-2">${s.number}</div>
                                <h5 class="font-black text-base text-slate-900 mb-2">${s.title}</h5>
                                <p class="text-xs text-slate-600 leading-relaxed font-medium">${s.text}</p>
                            </div>
                        `).join("")}
                    </div>
                </div>

                <!-- MEB Çıkmış Soru Çözüm Modelleri -->
                <div class="mb-10">
                    <div class="flex items-center justify-between mb-4">
                        <h4 class="text-lg font-black text-slate-900 flex items-center gap-2">
                            <i class="fa-solid fa-graduation-cap text-indigo-600"></i> MEB Çıkmış Soru & Çözüm Modelleri
                        </h4>
                        <span class="text-xs font-bold text-slate-400">Yıllara Göre Analiz</span>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        ${LGS_PUSULA_DATA.mebQuestions.map(q => `
                            <div class="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                                <div>
                                    <div class="flex items-center justify-between mb-3">
                                        <span class="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-black text-xs border border-indigo-100">${q.year} LGS</span>
                                        <span class="text-xs font-bold text-slate-500">${q.unit}</span>
                                    </div>
                                    <p class="text-xs sm:text-sm font-bold text-slate-800 mb-4 leading-relaxed">${q.questionText}</p>
                                </div>
                                <div class="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs">
                                    <span class="font-black text-emerald-800 block mb-1 flex items-center gap-1.5">
                                        <i class="fa-solid fa-circle-check text-emerald-600"></i> Doğru Cevap: ${q.answer}
                                    </span>
                                    <p class="text-slate-700 leading-relaxed font-medium">${q.solution}</p>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>

                <!-- LGS Hızlı Deneme ve Branş Sınavı Aksiyon Kartı -->
                <div class="p-6 sm:p-8 bg-gradient-to-r from-red-700 via-rose-700 to-slate-900 text-white rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                        <span class="px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-black uppercase tracking-wider inline-block mb-2">
                            TÜRKİYE GENELİ BRANŞ DENEMELERİ
                        </span>
                        <h4 class="text-xl sm:text-2xl font-black mb-1">LGS Tam Kapsamlı Fen Denemesi Çöz</h4>
                        <p class="text-xs sm:text-sm text-slate-200 font-medium">20 soruluk yeni nesil MEB formatında süreli denemeyi başlatın.</p>
                    </div>
                    <a href="#exams" class="px-6 py-3.5 bg-white text-red-700 hover:bg-slate-100 font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all flex items-center gap-2 whitespace-nowrap self-stretch sm:self-auto justify-center">
                        <i class="fa-solid fa-play"></i> Denemeyi Başlat
                    </a>
                </div>
            </div>
        `;
    } else if (subTab === "bilim-insanlari" || subTab === "uniteler" || subTab === "bilimin-rotasi") {
        return renderScientistsModule(grade.number);
    } else if (subTab === "ders-notu") {
        return `
            <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h3 class="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                        <i class="fa-solid fa-file-pdf text-red-600"></i> ${grade.number}. Sınıf Fen Bilimleri PDF Ders Föyleri
                    </h3>
                    <span class="text-xs font-bold text-slate-500">MEB 2026-2027 Müfredatına Uygun Ders Notları & Föyler</span>
                </div>
                ${isAdmin ? `
                    <button type="button" onclick="triggerUploadModal('${grade.number}', 'ders-notu')" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-red-600/20 active:scale-95 self-start sm:self-auto">
                        <i class="fa-solid fa-plus"></i> + Not / Föy Ekle
                    </button>
                ` : ''}
            </div>

            ${renderCustomMaterialsSection(grade.number, "ders-notu")}
            <h4 class="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <i class="fa-solid fa-folder-open text-blue-600"></i> ${grade.number}. Sınıf PDF Ders Föyleri
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
                                <span>👁️ ${item.downloadCount}</span>
                            </div>
                        </div>
                        <button type="button" onclick="openOrDownloadMaterial(null, '${item.fileUrl || '#'}', '${item.title}.pdf', 'ders-notu', '${item.title}')" class="w-full py-2.5 bg-slate-900 hover:bg-red-600 text-white font-black text-xs uppercase rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
                            <i class="fa-solid fa-eye"></i> Materyali Görüntüle
                        </button>
                    </div>
                `).join("")}
            </div>
        `;
    } else if (subTab === "ders-sunumu") {
        return `
            <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h3 class="text-xl font-black text-slate-900 flex items-center gap-2">
                        <i class="fa-solid fa-file-powerpoint text-orange-600"></i> ${grade.number}. Sınıf Akıllı Tahta Ders Sunumları (PPTX / PDF)
                    </h3>
                    <span class="text-xs font-bold text-slate-500">${subData.dersSunumu.length} Sunum Dosyası</span>
                </div>
                ${isAdmin ? `
                    <button type="button" onclick="triggerUploadModal('${grade.number}', 'ders-sunumu')" class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-orange-600/20 active:scale-95 self-start sm:self-auto">
                        <i class="fa-solid fa-plus"></i> + Sunum Ekle
                    </button>
                ` : ''}
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
        const customVideos = getCustomMaterialsList().filter(m => {
            const gMatch = (m.grade === String(grade.number) || m.grade === "all");
            const cMatch = (m.category === "videolar" || m.category === "video");
            return gMatch && cMatch;
        });

        return `
            <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h3 class="text-xl font-black text-slate-900 flex items-center gap-2">
                        <i class="fa-solid fa-circle-play text-red-600"></i> ${grade.number}. Sınıf Videoları
                    </h3>
                    <span class="text-xs font-bold text-slate-500">${customVideos.length} Video</span>
                </div>
                ${isAdmin ? `
                    <button type="button" onclick="triggerUploadModal('${grade.number}', 'videolar')" class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-rose-600/20 active:scale-95 self-start sm:self-auto">
                        <i class="fa-solid fa-plus"></i> + Video Ekle
                    </button>
                ` : ''}
            </div>

            ${renderCustomMaterialsSection(grade.number, "videolar")}

            ${customVideos.length === 0 ? `
                <div class="p-8 sm:p-12 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm">
                    <div class="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-2xl mx-auto mb-4">
                        <i class="fa-solid fa-video"></i>
                    </div>
                    <h4 class="text-base font-black text-slate-800 mb-1">Bu sınıfta henüz video bulunmuyor</h4>
                    <p class="text-xs text-slate-500 mb-4 max-w-sm mx-auto">Yönetici panelinden video yükleyerek sadece kendi videolarınızı burada yayınlayabilirsiniz.</p>
                    ${isAdmin ? `
                        <button type="button" onclick="triggerUploadModal('${grade.number}', 'videolar')" class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5 shadow-sm">
                            <i class="fa-solid fa-plus"></i> Hemen Video Ekle
                        </button>
                    ` : ''}
                </div>
            ` : ''}
        `;
    } else if (subTab === "etkinlikler") {
        return `
            <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h3 class="text-xl font-black text-slate-900 flex items-center gap-2">
                        <i class="fa-solid fa-puzzle-piece text-emerald-600"></i> ${grade.number}. Sınıf Çalışma Föyleri & İstasyon Etkinlikleri
                    </h3>
                    <span class="text-xs font-bold text-slate-500">${subData.etkinlikler.length} Etkinlik Föyü</span>
                </div>
                ${isAdmin ? `
                    <button type="button" onclick="triggerUploadModal('${grade.number}', 'etkinlikler')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 self-start sm:self-auto">
                        <i class="fa-solid fa-plus"></i> + Etkinlik Ekle
                    </button>
                ` : ''}
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
                            <i class="fa-solid fa-eye"></i> Etkinlik Föyünü Görüntüle / Yazdır
                        </button>
                    </div>
                `).join("")}
            </div>
        `;
    } else if (subTab === "soru-bankasi") {
        return `
            <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h3 class="text-xl font-black text-slate-900 flex items-center gap-2">
                        <i class="fa-solid fa-book-open-reader text-blue-600"></i> ${grade.number}. Sınıf Kazanım & Beceri Temelli Soru Bankası
                    </h3>
                    <span class="text-xs font-bold text-slate-500">${subData.soruBankasi.length} Ünite Soru Havuzu</span>
                </div>
                ${isAdmin ? `
                    <button type="button" onclick="triggerUploadModal('${grade.number}', 'soru-bankasi')" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/20 active:scale-95 self-start sm:self-auto">
                        <i class="fa-solid fa-plus"></i> + Soru / Test Ekle
                    </button>
                ` : ''}
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
            <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h3 class="text-xl font-black text-slate-900 flex items-center gap-2">
                        <i class="fa-solid fa-bullseye text-purple-600"></i> ${grade.number}. Sınıf Dönemlik Ortak Sınav & Branş Denemeleri
                    </h3>
                    <span class="text-xs font-bold text-slate-500">${subData.denemeler.length} Deneme Sınavı</span>
                </div>
                ${isAdmin ? `
                    <button type="button" onclick="triggerUploadModal('${grade.number}', 'denemeler')" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-purple-600/20 active:scale-95 self-start sm:self-auto">
                        <i class="fa-solid fa-plus"></i> + Deneme Ekle
                    </button>
                ` : ''}
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
                            <button onclick="window.print()" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors" title="PDF Görüntüle / Yazdır">
                                <i class="fa-solid fa-print"></i>
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
                                                        <i class="fa-solid fa-file-pdf"></i> Sınavı Görüntüle / Yazdır
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
                            Görev Föyünü Görüntüle (A4)
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
                            Proje Rapor Şablonunu Görüntüle (DOCX/PDF)
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
                                    <button onclick="window.print()" class="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm" title="Görüntüle / Yazdır">
                                        <i class="fa-solid fa-eye text-xs"></i>
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
                        ${(profile?.errorNotebook || []).map(err => `
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
                            ${(profile?.dailyTasks || []).map(t => `
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
                            ${(profile?.badges || []).map(b => `
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
                                                <button onclick="openOrDownloadMaterial('${item.id}')" class="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-all" title="Görüntüle / Oynat">
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

    showToast("Portal verileri başarıyla dışa aktarıldı!", "success");
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

        // 9. Kullanıcı / Yönetici Tarafından Yüklenen Materyaller (rotali_custom_materials & rotali_materials)
    try {
        const customMats = getCustomMaterialsList();
        if (Array.isArray(customMats)) {
            customMats.forEach(m => {
                const gNum = parseInt(m.grade) || 0;
                const gradeTitle = gNum === 8 ? "8. Sınıf (LGS)" : (gNum > 0 ? `${gNum}. Sınıf` : "Tüm Sınıflar");
                const isGame = (m.category === "egitsel-oyunlar" || (m.format && m.format.includes("OYUN")) || (m.title && (m.title.toLowerCase().includes("oyun") || m.title.toLowerCase().includes("eşleştirme") || m.title.toLowerCase().includes("laboratuvar"))));
                
                index.push({
                    id: `custom-${m.id}`,
                    title: m.title || "Özel Materyal",
                    category: isGame ? "Eğitsel Oyun & İnteraktif" : (m.format || m.category || "Özel Materyal"),
                    categoryKey: m.category || (isGame ? "egitsel-oyunlar" : "ders-notu"),
                    grade: gradeTitle,
                    gradeNumber: gNum,
                    unit: m.unit || "",
                    description: m.desc || "Yönetici tarafından portala eklenen zenginleştirilmiş fen materyali.",
                    keywords: `laboratuvar malzemeleri eşleştirme interaktif oyun guvenlik kurallari deney meb ${m.tags ? m.tags.join(' ') : ''} ${m.title} ${m.desc || ''}`,
                    icon: isGame ? "fa-solid fa-gamepad" : "fa-solid fa-file-circle-check",
                    iconBg: isGame ? "bg-fuchsia-600" : "bg-emerald-600",
                    url: gNum > 0 ? `#grade/grade-${gNum}/${m.category || (isGame ? 'egitsel-oyunlar' : 'ders-notu')}` : `#home`,
                    action: isGame ? `openInteractiveGameModal('oyun-5-lab', '${(m.title || '').replace(/'/g, "\'")}')` : null
                });
            });
        }
    } catch(e) {
        console.warn("Search custom materials indexing error:", e);
    }

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

    async findFileByTitleOrName(title, fileName) {
        const db = await this.getDB();
        if (!db) return null;
        return new Promise((resolve) => {
            try {
                const tx = db.transaction("files", "readonly");
                const store = tx.objectStore("files");
                const request = store.openCursor();
                const searchTitle = (title || "").trim().toLowerCase();
                const searchFileName = (fileName || "").trim().toLowerCase();
                let match = null;

                request.onsuccess = (e) => {
                    const cursor = e.target.result;
                    if (cursor) {
                        const item = cursor.value;
                        const itemTitle = (item.title || "").trim().toLowerCase();
                        const itemFileName = (item.fileName || "").trim().toLowerCase();
                        if ((searchFileName && itemFileName && (itemFileName === searchFileName || itemFileName.includes(searchFileName) || searchFileName.includes(itemFileName))) ||
                            (searchTitle && itemTitle && (itemTitle === searchTitle || itemTitle.includes(searchTitle) || searchTitle.includes(itemTitle)))) {
                            match = item;
                            resolve(match);
                            return;
                        }
                        cursor.continue();
                    } else {
                        resolve(match);
                    }
                };
                request.onerror = () => resolve(null);
            } catch(e) {
                resolve(null);
            }
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
let currentUploadedCoverDataUrl = '';
let currentTagsList = ["MEB 2026-2027"];
let editingMaterialId = null;

// Toast Bildirimi (En başta tanımlandı)

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
    showToast("🚪 Yönetici oturumundan başarıyla çıkış yapıldı.", "info");
    handleRouteChange();
}

function updateAdminNavUI() {
    const isAdmin = localStorage.getItem("rotali_is_admin") === "true";
    ADMIN_CONFIG.isAdmin = isAdmin;

    // 1. Üst Bar: Sadece Giriş Yapıldığında Çıkış Butonu Göster (Giriş yapılmamışsa buton görünmez)
    const topContainer = document.getElementById("admin-nav-container");
    if (topContainer) {
        if (isAdmin) {
            topContainer.innerHTML = `
                <div class="flex items-center gap-1.5 animate-in fade-in duration-200">
                    <button type="button" onclick="triggerUploadModal('5', 'ders-notu')" class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition-all" title="Hızlı Materyal Ekle">
                        <i class="fa-solid fa-plus text-xs"></i> <span class="hidden md:inline">Ekle</span>
                    </button>
                    <button type="button" onclick="handleAdminLogout()" class="px-3 sm:px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border border-rose-500" title="👑 Yönetici Oturumunu Kapat">
                        <i class="fa-solid fa-arrow-right-from-bracket text-sm"></i>
                        <span>Çıkış Yap</span>
                    </button>
                </div>
            `;
        } else {
            topContainer.innerHTML = "";
        }
    }

    // 2. Alt Bilgi (Footer) Göstergesi
    const footerIndicator = document.getElementById("admin-status-indicator");
    if (footerIndicator) {
        if (isAdmin) {
            footerIndicator.className = "flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-900/60 border border-emerald-500/40 text-xs text-emerald-300";
            footerIndicator.innerHTML = `
                <i class="fa-solid fa-shield-check text-emerald-400"></i>
                <span>Yönetici Aktif</span>
                <button onclick="handleAdminLogout()" class="ml-2 px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold" title="Çıkış Yap"><i class="fa-solid fa-arrow-right-from-bracket mr-1"></i>Çıkış</button>
            `;
        } else {
            footerIndicator.className = "hidden";
            footerIndicator.innerHTML = "";
        }
    }
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
        closeInPageDocumentModal();
    }
});

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

// Materyalin Sırasını Değiştirme (Yukarı / Aşağı Taşıma)
async function moveCustomMaterial(id, direction) {
    if (!checkAdminAccess()) return;
    let customList = getCustomMaterialsList();
    const idx = customList.findIndex(m => m.id === id);
    if (idx === -1) return;
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= customList.length) return;

    const itemToMove = customList.splice(idx, 1)[0];
    customList.splice(targetIdx, 0, itemToMove);

    saveCustomMaterialsSafe(customList);
    showToast("↕️ Materyalin konumu ve sırası güncellendi.", "info");

    if (typeof CloudSyncManager !== "undefined" && CloudSyncManager.uploadToCloud) {
        await CloudSyncManager.uploadToCloud(customList, true);
    }
    handleRouteChange({ preserveScroll: true });
}

async function deleteCustomMaterial(id) {
    if (!checkAdminAccess()) return;
    if (!confirm("Bu materyali tamamen silmek istediğinize emin misiniz?")) return;

    let customList = getCustomMaterialsList();
    addDeletedMaterialId(id);
    customList = customList.filter(item => item && item.id !== id);
    saveCustomMaterialsSafe(customList);

    if (typeof RotaliDB !== "undefined" && RotaliDB.deleteFile) {
        try {
            await RotaliDB.deleteFile(id);
        } catch(e) {}
    }

    showToast("🗑️ Materyal başarıyla silindi.", "info");

    if (typeof CloudSyncManager !== "undefined" && CloudSyncManager.deleteMaterial) {
        await CloudSyncManager.deleteMaterial(id, customList);
    } else if (typeof CloudSyncManager !== "undefined" && CloudSyncManager.uploadToCloud) {
        await CloudSyncManager.uploadToCloud(customList, true);
    }

    handleRouteChange();
}

// Materyal Düzenleme & Taşıma
function editCustomMaterial(id) {
    if (!checkAdminAccess()) return;
    const customList = getCustomMaterialsList();
    const mat = customList.find(item => item.id === id);
    if (!mat) {
        showToast("Materyal bulunamadı!", "error");
        return;
    }
    const cleanGrade = String(mat.grade || "8").replace(/^grade-/, "");
    openMaterialUploadModal(cleanGrade, mat.category || "ders-notu", mat);
}


// -------------------------------------------------------------
// 📖 ROTALI FENCİ DİJİTAL KİTAP OKUYUCU MOTORU (GERÇEK KAPAKLAR, BÜYÜT/KÜÇÜLT & İMLEÇLE KAYDIRMA)
// -------------------------------------------------------------
let DigitalBookState = {
    pdfDoc: null,
    currentPage: 1,
    totalPages: 1,
    currentScale: 1.0,
    isRendering: false,
    pageRenderingQueue: null,
    currentRenderTask: null,
    bookInfo: null,
    fallbackPages: [],
    mode: "fallback", // 'pdf' | 'fallback'
    keyListener: null,
    touchStartX: 0,
    touchStartY: 0,
    // İmleçle Sayfayı Sürükleyip Kaydırma (Pan) Durumu
    panX: 0,
    panY: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    dragStartPanX: 0,
    dragStartPanY: 0
};

let bookZoomDebounceTimer = null;

function updateBookTransform(animate = true) {
    const wrapper = document.getElementById("book-page-wrapper");
    if (!wrapper) return;
    wrapper.style.transition = animate ? "transform 0.1s ease-out" : "none";
    if (DigitalBookState.mode === "pdf") {
        wrapper.style.transform = `translate(${DigitalBookState.panX}px, ${DigitalBookState.panY}px)`;
    } else {
        wrapper.style.transform = `translate(${DigitalBookState.panX}px, ${DigitalBookState.panY}px) scale(${DigitalBookState.currentScale})`;
    }
    wrapper.style.cursor = DigitalBookState.isDragging ? "grabbing" : "grab";
}

function resetBookPosition(resetScale = false) {
    DigitalBookState.panX = 0;
    DigitalBookState.panY = 0;
    const oldScale = DigitalBookState.currentScale;
    if (resetScale) {
        DigitalBookState.currentScale = 1.0;
        const zoomText = document.getElementById("book-zoom-text");
        if (zoomText) zoomText.innerText = "%100";
    }
    const scrollArea = document.getElementById("book-reader-scroll-area");
    if (scrollArea) {
        scrollArea.scrollTop = 0;
        scrollArea.scrollLeft = 0;
    }
    updateBookTransform(true);
    if (resetScale && oldScale !== 1.0 && DigitalBookState.mode === "pdf" && DigitalBookState.pdfDoc) {
        renderBookPage(DigitalBookState.currentPage);
    }
}

function scrollBookVertical(delta) {
    DigitalBookState.panY += delta;
    updateBookTransform(true);
}

function getFallbackPagesForGrade(grade, title) {
    const g = String(grade || "5").replace(/^grade-/, "").trim();
    const coverJpg = ["5", "6", "7", "8"].includes(g) ? `assets/kapak-${g}.jpg` : "assets/kapak-5.jpg";

    const unitsByGrade = {
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
            "3. Ünite: Basınç",
            "4. Ünite: Madde ve Endüstri",
            "5. Ünite: Basit Makineler",
            "6. Ünite: Enerji Dönüşümleri ve Çevre Bilimi",
            "7. Ünite: Elektrik Yükleri ve Elektrik Enerjisi"
        ]
    };

    const units = unitsByGrade[g] || unitsByGrade["5"];

    return [
        {
            pageNum: 1,
            title: "Kitap Ön Kapağı (Orijinal MEB)",
            html: `
                <div class="flex flex-col items-center justify-center p-2 text-center select-none">
                    <img src="${coverJpg}" alt="${title}" class="max-h-[72vh] sm:max-h-[76vh] w-auto object-contain rounded-2xl shadow-2xl border border-slate-300">
                    <p class="text-xs font-bold text-slate-500 mt-3 flex items-center gap-1.5">
                        <i class="fa-solid fa-hand-pointer text-red-600 animate-bounce"></i> Sayfayı çevirmek için <strong>Sonraki ▶</strong> butonuna basın veya imleçle yukarı/aşağı kaydırın
                    </p>
                </div>
            `
        },
        {
            pageNum: 2,
            title: "İstiklâl Marşı & Atatürk",
            html: `
                <div class="max-w-2xl mx-auto py-3 px-2 sm:px-6 text-slate-800 select-none">
                    <div class="text-center border-b-2 border-red-600 pb-3 mb-5">
                        <h2 class="text-xl sm:text-2xl font-black text-red-700 tracking-wider">İSTİKLÂL MARŞI</h2>
                        <p class="text-xs text-slate-500 font-semibold mt-1">Korkma, sönmez bu şafaklarda yüzen al sancak...</p>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm font-serif leading-relaxed text-slate-700 bg-red-50/50 p-4 sm:p-6 rounded-2xl border border-red-100">
                        <div>
                            <p class="mb-3">Korkma, sönmez bu şafaklarda yüzen al sancak;<br>Sönmeden yurdumun üstünde tüten en son ocak.<br>O benim milletimin yıldızıdır, parlayacak;<br>O benimdir, o benim milletimindir ancak.</p>
                            <p>Çatma, kurban olayım çehreni ey nazlı hilâl!<br>Kahraman ırkıma bir gül… ne bu şiddet bu celâl?<br>Sana olmaz dökülen kanlarımız sonra helâl;<br>Hakkıdır, Hakk’a tapan milletimin istiklâl!</p>
                        </div>
                        <div class="flex flex-col justify-between items-center text-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                            <div class="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center border-2 border-slate-300 shadow-inner mb-2">
                                <i class="fa-solid fa-landmark text-3xl text-slate-700"></i>
                            </div>
                            <blockquote class="text-xs italic font-bold text-slate-700 my-2">
                                "Dünyada her şey için, medeniyet için, hayat için, muvaffakiyet için en hakiki mürşit ilimdir, fendir."
                            </blockquote>
                            <span class="text-xs font-black text-red-700">Gazi Mustafa Kemal ATATÜRK</span>
                        </div>
                    </div>
                </div>
            `
        },
        {
            pageNum: 3,
            title: "İçindekiler & Üniteler",
            html: `
                <div class="max-w-2xl mx-auto py-3 px-2 sm:px-6 text-slate-800 select-none">
                    <div class="flex items-center justify-between border-b-2 border-amber-500 pb-3 mb-5">
                        <div>
                            <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
                                <i class="fa-solid fa-list-ol text-amber-500"></i> İÇİNDEKİLER
                            </h2>
                            <p class="text-xs text-slate-500 font-bold mt-0.5">${g}. Sınıf Fen Bilimleri MEB Müfredatı</p>
                        </div>
                        <span class="px-3 py-1 bg-amber-50 text-amber-800 rounded-full font-black text-xs border border-amber-200">2026-2027</span>
                    </div>
                    <div class="space-y-2">
                        ${units.map((u, idx) => `
                            <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 transition-colors">
                                <div class="flex items-center gap-3">
                                    <span class="w-7 h-7 rounded-lg bg-red-600 text-white font-black text-xs flex items-center justify-center">${idx + 1}</span>
                                    <span class="text-xs sm:text-sm font-black text-slate-800">${u}</span>
                                </div>
                                <span class="text-xs font-black text-slate-400">Sayfa ${(idx * 24) + 1}</span>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `
        },
        {
            pageNum: 4,
            title: "1. Üniteye Başlarken",
            html: `
                <div class="max-w-2xl mx-auto py-3 px-2 sm:px-6 text-slate-800 select-none">
                    <div class="bg-gradient-to-r from-red-600 to-rose-600 text-white p-5 sm:p-6 rounded-2xl shadow-lg mb-5">
                        <span class="px-2.5 py-1 bg-white/20 text-white rounded-lg text-xs font-black uppercase tracking-wider">1. ÜNİTE</span>
                        <h2 class="text-xl sm:text-2xl font-black mt-2">${units[0]}</h2>
                        <p class="text-xs sm:text-sm text-red-100 mt-2 font-medium">Bu ünitede fen bilimlerinin temel prensiplerini ve bilimsel düşünme modellerini inceleyeceğiz.</p>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                            <h4 class="text-xs font-black text-amber-900 uppercase flex items-center gap-1.5 mb-2">
                                <i class="fa-solid fa-key text-amber-600"></i> Temel Kavramlar
                            </h4>
                            <div class="flex flex-wrap gap-1.5">
                                <span class="px-2 py-1 bg-white text-amber-800 rounded-lg text-xs font-bold shadow-sm">Gözlem</span>
                                <span class="px-2 py-1 bg-white text-amber-800 rounded-lg text-xs font-bold shadow-sm">Veri</span>
                                <span class="px-2 py-1 bg-white text-amber-800 rounded-lg text-xs font-bold shadow-sm">Modelleme</span>
                                <span class="px-2 py-1 bg-white text-amber-800 rounded-lg text-xs font-bold shadow-sm">Sonuç</span>
                            </div>
                        </div>
                        <div class="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                            <h4 class="text-xs font-black text-blue-900 uppercase flex items-center gap-1.5 mb-2">
                                <i class="fa-solid fa-bullseye text-blue-600"></i> Hedef Kazanımlar
                            </h4>
                            <p class="text-xs text-blue-800 leading-relaxed font-medium">Bilimsel süreç basamaklarını kullanarak araştırma yapma ve problem çözme becerisi geliştirme.</p>
                        </div>
                    </div>
                </div>
            `
        },
        {
            pageNum: 5,
            title: "Konu Anlatımı & Bilimsel Yolculuk",
            html: `
                <div class="max-w-2xl mx-auto py-3 px-2 sm:px-6 text-slate-800 select-none">
                    <div class="flex items-center gap-2 border-b border-slate-200 pb-3 mb-4">
                        <span class="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-black text-sm">
                            <i class="fa-solid fa-flask"></i>
                        </span>
                        <div>
                            <h3 class="text-base sm:text-lg font-black text-slate-900">1. Bölüm: Bilimsel Yolculuk</h3>
                            <span class="text-xs text-slate-500 font-bold">Fen Bilimlerinde Araştırma ve Gözlem</span>
                        </div>
                    </div>

                    <div class="space-y-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                        <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                            <h4 class="font-black text-slate-900 mb-1.5 text-sm flex items-center gap-2">
                                <span class="w-2 h-2 rounded-full bg-red-600"></span> Bilim İnsanları ve Araştırma
                            </h4>
                            <p>Doğayı ve evreni anlama isteği, insanlığın en büyük merak kaynaklarından biridir. Fen bilimleri; gözlem, deney ve mantık yoluyla gerçeği keşfetme sanatıdır.</p>
                        </div>

                        <div class="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                            <h4 class="font-black text-emerald-900 mb-1.5 text-sm flex items-center gap-2">
                                <i class="fa-solid fa-circle-check text-emerald-600"></i> Önemli Hatırlatma
                            </h4>
                            <p class="text-emerald-800 font-medium">Laboratuvarda çalışırken güvenlik sembollerine dikkat edilmeli, koruyucu ekipmanlar kullanılmalı ve öğretmen rehberliğinde deneyler yürütülmelidir.</p>
                        </div>
                    </div>
                </div>
            `
        },
        {
            pageNum: 6,
            title: "Deney ve Laboratuvar Saati",
            html: `
                <div class="max-w-2xl mx-auto py-3 px-2 sm:px-6 text-slate-800 select-none">
                    <div class="p-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl shadow-md mb-4">
                        <span class="text-[11px] font-black uppercase bg-white/25 px-2 py-0.5 rounded-md">Deney Saati</span>
                        <h3 class="text-lg sm:text-xl font-black mt-1">Etkinlik: Gözlem ve Ölçüm Yapalım</h3>
                    </div>

                    <div class="space-y-3.5">
                        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                            <h4 class="text-xs font-black text-slate-900 uppercase mb-2">Gerekli Malzemeler:</h4>
                            <ul class="list-disc list-inside text-xs sm:text-sm text-slate-700 space-y-1">
                                <li>Laboratuvar önlüğü ve koruyucu gözlük</li>
                                <li>Dinamometre veya ölçüm cetveli</li>
                                <li>Gözlem formu ve not defteri</li>
                            </ul>
                        </div>

                        <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                            <h4 class="text-xs font-black text-slate-900 uppercase mb-2">Uygulama Basamakları:</h4>
                            <ol class="list-decimal list-inside text-xs sm:text-sm text-slate-700 space-y-1.5">
                                <li>Ölçüm aletini sıfırlayınız ve kalibre ediniz.</li>
                                <li>Deneyi en az 3 kez tekrarlayıp ortalama değeri bulunuz.</li>
                                <li>Sonuçları sınıf arkadaşlarınızla paylaşınız.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            `
        },
        {
            pageNum: 7,
            title: "Değerlendirme Soruları",
            html: `
                <div class="max-w-2xl mx-auto py-3 px-2 sm:px-6 text-slate-800 select-none">
                    <div class="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                        <h3 class="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                            <i class="fa-solid fa-circle-question text-red-600"></i> Ünite Sonu Değerlendirme
                        </h3>
                        <span class="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">Örnek Sorular</span>
                    </div>

                    <div class="space-y-3.5 text-xs sm:text-sm">
                        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                            <p class="font-black text-slate-900 mb-2">1. Bilimsel bir araştırmada toplanan verilerin grafik ve tablolara dönüştürülmesinin temel amacı nedir?</p>
                            <div class="space-y-1.5 text-slate-700 pl-2">
                                <div>A) Deney süresini uzatmak</div>
                                <div class="font-bold text-emerald-700">B) Verileri anlaşılır ve karşılaştırılabilir kılmak (Doğru)</div>
                                <div>C) Hataları gizlemek</div>
                                <div>D) Raporu renklendirmek</div>
                            </div>
                        </div>

                        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                            <p class="font-black text-slate-900 mb-2">2. Güvenlik kuralları gereği laboratuvarda aşağıdakilerden hangisi kesinlikle yapılmamalıdır?</p>
                            <div class="space-y-1.5 text-slate-700 pl-2">
                                <div>A) Önlük ve gözlük takmak</div>
                                <div class="font-bold text-emerald-700">B) Kimyasal maddelerin tadına bakmak veya koklamak (Doğru)</div>
                                <div>C) Öğretmenin talimatlarına uymak</div>
                                <div>D) Deney sonrasında elleri yıkamak</div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        {
            pageNum: 8,
            title: "Kitap Sonu & EBA",
            html: `
                <div class="max-w-md mx-auto py-6 px-4 text-center text-slate-800 select-none">
                    <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-700 text-white flex items-center justify-center text-2xl mx-auto mb-4 shadow-xl">
                        <i class="fa-solid fa-book-bookmark"></i>
                    </div>
                    <h3 class="text-xl font-black text-slate-900 mb-2">Kitap Önizlemesi Tamamlandı</h3>
                    <p class="text-xs text-slate-600 leading-relaxed mb-6 font-medium">
                        MEB Fen Bilimleri ders kitabının tüm sayfaları (200+ sayfa) dijital olarak incelenebilir.
                    </p>

                    <div class="space-y-3">
                        <button type="button" onclick="goToFirstBookPage()" class="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md">
                            <i class="fa-solid fa-backward-step"></i> Kitabın Başına Dön (Kapak)
                        </button>
                    </div>
                </div>
            `
        }
    ];
}

async function openDigitalBookModal(options = {}) {
    const bookTitle = options.title || "Fen Bilimleri Ders Kitabı";
    const grade = options.grade || "5";
    let fileUrl = options.fileUrl || "";
    const id = options.id || "";

    DigitalBookState.currentPage = 1;
    DigitalBookState.totalPages = 1;
    DigitalBookState.currentScale = 1.0;
    DigitalBookState.panX = 0;
    DigitalBookState.panY = 0;
    DigitalBookState.isDragging = false;
    DigitalBookState.isRendering = false;
    DigitalBookState.pageRenderingQueue = null;
    DigitalBookState.pdfDoc = null;
    DigitalBookState.mode = "fallback";
    DigitalBookState.fallbackPages = getFallbackPagesForGrade(grade, bookTitle);
    DigitalBookState.totalPages = DigitalBookState.fallbackPages.length;
    DigitalBookState.bookInfo = { id, title: bookTitle, grade, fileUrl };

    let modal = document.getElementById("digital-book-modal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "digital-book-modal";
        modal.className = "fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between select-none animate-in fade-in duration-200 overflow-hidden";
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <!-- ÜST KONTROL ÇUBUĞU (TOOLBAR) -->
        <div class="px-2 sm:px-6 py-2 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between shrink-0 gap-1.5 sm:gap-4 shadow-xl z-20">
            <!-- Sol: Başlık & Rozet -->
            <div class="flex items-center gap-2 min-w-0">
                <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 text-white flex items-center justify-center text-sm font-black shadow-md shrink-0">
                    <i class="fa-solid fa-book-open"></i>
                </div>
                <div class="min-w-0">
                    <h3 id="book-modal-title" class="text-xs sm:text-sm font-black truncate max-w-[110px] sm:max-w-xs md:max-w-md text-white">${bookTitle}</h3>
                    <div class="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                        <span class="px-1.5 py-0.2 rounded bg-slate-800 text-red-400 border border-slate-700">${grade}. SINIF MEB</span>
                        <span id="book-modal-status" class="text-slate-400 hidden sm:inline">Açılıyor...</span>
                    </div>
                </div>
            </div>

            <!-- Orta: Sayfa İlerletme ve Sayfa Numarası Butonları -->
            <div class="flex items-center gap-1 sm:gap-1.5 bg-slate-800/90 px-1.5 sm:px-3 py-1 rounded-2xl border border-slate-700 shadow-inner">
                <!-- İlk Sayfa -->
                <button type="button" onclick="goToFirstBookPage()" class="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-700/80 hover:bg-slate-600 text-white flex items-center justify-center text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer" id="book-btn-first" title="İlk Sayfa">
                    <i class="fa-solid fa-backward-step"></i>
                </button>
                
                <!-- Önceki Sayfa (Geri) Butonu -->
                <button type="button" onclick="changeBookPage(-1)" class="px-2 sm:px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-red-600 text-white flex items-center gap-1.5 text-xs font-black transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer" id="book-btn-prev" title="Önceki Sayfa (Sol Ok)">
                    <i class="fa-solid fa-chevron-left"></i>
                    <span class="hidden md:inline text-[11px]">Önceki</span>
                </button>

                <!-- Sayfa Sayacı ve Atlama -->
                <div class="flex items-center gap-1 px-1 text-xs font-bold text-slate-200">
                    <span class="text-[11px] text-slate-400 hidden lg:inline">Sayfa</span>
                    <input type="number" id="book-page-input" min="1" max="${DigitalBookState.totalPages}" value="1" onchange="onBookPageInputChange(this.value)" class="w-10 sm:w-14 text-center py-1 bg-slate-900 border border-slate-600 rounded-lg text-xs font-black text-amber-400 focus:outline-none focus:border-red-500 select-all">
                    <span class="text-slate-400">/</span>
                    <span id="book-total-pages" class="text-slate-300 font-bold min-w-[18px] text-center">${DigitalBookState.totalPages}</span>
                </div>

                <!-- Sonraki Sayfa (İleri) Butonu -->
                <button type="button" onclick="changeBookPage(1)" class="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 text-xs font-black transition-all shadow-md disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer" id="book-btn-next" title="Sonraki Sayfa (Sağ Ok veya Boşluk)">
                    <span class="hidden md:inline text-[11px]">Sonraki</span>
                    <i class="fa-solid fa-chevron-right"></i>
                </button>

                <!-- Son Sayfa -->
                <button type="button" onclick="goToLastBookPage()" class="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-700/80 hover:bg-slate-600 text-white flex items-center justify-center text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer" id="book-btn-last" title="Son Sayfa">
                    <i class="fa-solid fa-forward-step"></i>
                </button>
            </div>

            <!-- Sağ: BÜYÜTME / KÜÇÜLTME & İMLEÇLE HAREKET ARAÇLARI -->
            <div class="flex items-center gap-1 sm:gap-1.5">
                <!-- 🔍 Büyüt / Küçült / Sıfırla Toolbar -->
                <div class="flex items-center gap-0.5 sm:gap-1 bg-slate-800 p-0.5 rounded-xl border border-slate-700 shadow-sm">
                    <button type="button" onclick="changeBookZoom(-0.2)" class="w-7 h-7 rounded-lg bg-slate-700 hover:bg-red-600 text-white flex items-center justify-center text-xs font-black cursor-pointer transition-colors" title="Küçült (-)">
                        <i class="fa-solid fa-magnifying-glass-minus"></i>
                    </button>
                    <button type="button" onclick="resetBookPosition(true)" id="book-zoom-text" class="px-1.5 sm:px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-[10px] sm:text-[11px] font-black text-amber-400 select-none cursor-pointer transition-colors" title="Yakınlaştırmayı ve Konumu Sıfırla (%100)">
                        %100
                    </button>
                    <button type="button" onclick="changeBookZoom(0.2)" class="w-7 h-7 rounded-lg bg-slate-700 hover:bg-emerald-600 text-white flex items-center justify-center text-xs font-black cursor-pointer transition-colors" title="Büyüt (+)">
                        <i class="fa-solid fa-magnifying-glass-plus"></i>
                    </button>
                </div>

                <!-- Sayfayı Yukarı / Aşağı Kaydır Butonları -->
                <div class="hidden md:flex items-center gap-0.5 bg-slate-800 p-0.5 rounded-xl border border-slate-700">
                    <button type="button" onclick="scrollBookVertical(90)" class="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center text-xs font-bold cursor-pointer" title="Sayfayı Yukarı Taşı">
                        <i class="fa-solid fa-arrow-up"></i>
                    </button>
                    <button type="button" onclick="scrollBookVertical(-90)" class="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center text-xs font-bold cursor-pointer" title="Sayfayı Aşağı Taşı">
                        <i class="fa-solid fa-arrow-down"></i>
                    </button>
                </div>

                ${fileUrl && fileUrl.startsWith("http") ? `
                    <a href="${fileUrl}" target="_blank" rel="noopener noreferrer" class="hidden xl:flex px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-[11px] font-bold items-center gap-1.5 transition-all" title="MEB / EBA'da Aç">
                        <i class="fa-solid fa-arrow-up-right-from-square"></i> <span>EBA</span>
                    </a>
                ` : ''}

                <!-- Kapat Butonu -->
                <button type="button" onclick="closeDigitalBookModal()" class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-800 hover:bg-red-600 text-white flex items-center justify-center font-black transition-all shadow-md cursor-pointer ml-1" title="Kapat (ESC)">
                    <i class="fa-solid fa-xmark text-sm"></i>
                </button>
            </div>
        </div>

        <!-- ORTA OKUMA ALANI (KİTAP SAYFASI & İMLEÇLE SÜRÜKLEME ALANI) -->
        <div class="relative flex-1 bg-slate-950 overflow-hidden flex items-center justify-center p-2 sm:p-4 touch-none select-none" id="book-reader-scroll-area" title="İmleç ile basılı tutup sayfayı yukarı ve aşağı serbestçe hareket ettirebilirsiniz">
            <!-- Sol Yüzen Sayfa İlerletme Butonu -->
            <button type="button" onclick="changeBookPage(-1)" class="fixed left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-slate-900/85 hover:bg-red-600 text-white flex items-center justify-center text-lg sm:text-2xl font-black shadow-2xl backdrop-blur-md border border-slate-700 hover:border-red-500 transition-all hover:scale-110 active:scale-95 cursor-pointer disabled:opacity-0 disabled:pointer-events-none" id="book-float-prev" title="Önceki Sayfaya Git (←)">
                <i class="fa-solid fa-angle-left"></i>
            </button>

            <!-- 🖱️ İmleçle Taşıma Bilgi Rozeti (Başlangıçta belirip kaybolur) -->
            <div id="book-drag-hint" class="fixed top-14 left-1/2 -translate-x-1/2 z-30 bg-slate-900/90 text-amber-300 text-[11px] font-black px-3.5 py-1.5 rounded-full border border-slate-700 shadow-xl pointer-events-none transition-opacity duration-700 flex items-center gap-1.5">
                <i class="fa-solid fa-arrows-up-down-left-right text-xs"></i> İmleçle basılı tutup sayfayı aşağı-yukarı kaydırabilirsiniz
            </div>

            <!-- Sayfa Taşıyıcı / Render Alanı -->
            <div id="book-page-wrapper" class="relative max-w-full max-h-full flex items-center justify-center transition-transform duration-100 ease-out cursor-grab select-none" style="transform: translate(0px, 0px) scale(1); transform-origin: center center;">
                <!-- Yükleniyor Göstergesi -->
                <div id="book-loading-spinner" class="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3 text-white rounded-2xl hidden">
                    <div class="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    <div class="text-xs sm:text-sm font-black text-slate-200" id="book-loading-text">Sayfa Yükleniyor...</div>
                </div>

                <!-- 1. PDF Canvas (PDF Render Edildiğinde) -->
                <canvas id="book-canvas" class="hidden rounded-xl shadow-2xl bg-white border border-slate-200/20 select-none block"></canvas>

                <!-- 2. Fallback / Kitap Sayfası Görüntüleyici (PDF yoksa veya yükleme aşamasında) -->
                <div id="book-fallback-container" class="rounded-xl shadow-2xl bg-white max-w-[850px] w-[94vw] sm:w-[88vw] md:w-[720px] min-h-[72vh] max-h-[82vh] overflow-y-auto border border-slate-300 p-4 sm:p-8 text-slate-900 flex flex-col justify-between select-none">
                </div>
            </div>

            <!-- Sağ Yüzen Sayfa İlerletme Butonu -->
            <button type="button" onclick="changeBookPage(1)" class="fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-slate-900/85 hover:bg-red-600 text-white flex items-center justify-center text-lg sm:text-2xl font-black shadow-2xl backdrop-blur-md border border-slate-700 hover:border-red-500 transition-all hover:scale-110 active:scale-95 cursor-pointer disabled:opacity-0 disabled:pointer-events-none" id="book-float-next" title="Sonraki Sayfaya Git (→)">
                <i class="fa-solid fa-angle-right"></i>
            </button>

            <!-- 🎛️ Sağ Kenar Sabit Yüzen Hızlı Kaydırma & Yakınlaştırma Araç Çubuğu -->
            <div class="fixed right-3 sm:right-5 bottom-20 sm:bottom-8 z-30 flex flex-col gap-1.5 bg-slate-900/85 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700 shadow-2xl">
                <button type="button" onclick="scrollBookVertical(100)" class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-red-600 text-white flex items-center justify-center text-xs font-black shadow-sm transition-colors cursor-pointer" title="Yukarı Kaydır (▲)">
                    <i class="fa-solid fa-arrow-up"></i>
                </button>
                <button type="button" onclick="changeBookZoom(0.2)" class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-sm transition-colors cursor-pointer" title="Büyüt (+)">
                    <i class="fa-solid fa-plus"></i>
                </button>
                <button type="button" onclick="resetBookPosition(true)" class="w-8 h-8 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-400 flex items-center justify-center text-[10px] font-black shadow-sm transition-colors cursor-pointer" title="Sıfırla (%100)">
                    %100
                </button>
                <button type="button" onclick="changeBookZoom(-0.2)" class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-red-600 text-white flex items-center justify-center text-xs font-black shadow-sm transition-colors cursor-pointer" title="Küçült (-)">
                    <i class="fa-solid fa-minus"></i>
                </button>
                <button type="button" onclick="scrollBookVertical(-100)" class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-red-600 text-white flex items-center justify-center text-xs font-black shadow-sm transition-colors cursor-pointer" title="Aşağı Kaydır (▼)">
                    <i class="fa-solid fa-arrow-down"></i>
                </button>
            </div>
        </div>

        <!-- MOBİL ALT SAYFA ÇUBUĞU (Parmakla Kolay Geçiş ve Hızlı Büyüt/Küçült) -->
        <div class="sm:hidden px-3 py-2 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-2 shrink-0 z-20">
            <button type="button" onclick="changeBookPage(-1)" class="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 border border-slate-700" id="book-mob-prev">
                <i class="fa-solid fa-arrow-left"></i> Önceki
            </button>
            <div class="flex items-center gap-1 shrink-0 px-2 py-1 bg-slate-800 rounded-xl border border-slate-700">
                <button type="button" onclick="changeBookZoom(-0.2)" class="w-6 h-6 rounded-lg bg-slate-700 text-white text-[10px] font-black"><i class="fa-solid fa-minus"></i></button>
                <span class="text-[11px] font-black text-amber-400 px-1" id="book-mob-counter">1 / ${DigitalBookState.totalPages}</span>
                <button type="button" onclick="changeBookZoom(0.2)" class="w-6 h-6 rounded-lg bg-slate-700 text-white text-[10px] font-black"><i class="fa-solid fa-plus"></i></button>
            </div>
            <button type="button" onclick="changeBookPage(1)" class="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md" id="book-mob-next">
                Sonraki <i class="fa-solid fa-arrow-right"></i>
            </button>
        </div>
    `;

    // İpucu rozetini 3.5 saniye sonra yumuşakça gizle
    setTimeout(() => {
        const hint = document.getElementById("book-drag-hint");
        if (hint) {
            hint.style.opacity = "0";
            setTimeout(() => { if (hint && hint.remove) hint.remove(); }, 700);
        }
    }, 3500);

    // 1. sayfayı hemen render et (Kullanıcı hiç beklemez)
    renderBookPage(1);

    // İmleçle (Mouse & Touch) Sayfa Sürükleme ve Klavye Dinleyicilerini Kur
    initBookEventListeners();

    // Arka Planda PDF Yüklemeyi Başlat
    tryLoadPdfDocument(id, fileUrl);
}

async function tryLoadPdfDocument(id, fileUrl) {
    if (typeof window === "undefined" || !window.pdfjsLib) return;
    if (!window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    }

    const statusEl = document.getElementById("book-modal-status");
    let pdfSource = null;

    // 1. IndexedDB'de bu materyale ait kaydedilmiş Blob var mı?
    if (id && typeof RotaliDB !== "undefined" && RotaliDB.getFile) {
        try {
            const record = await RotaliDB.getFile(id);
            if (record && record.blob) {
                pdfSource = record.blob;
            }
        } catch(e) {}
    }

    // 2. Yoksa ve fileUrl geçerli bir HTTP linki ise
    if (!pdfSource && fileUrl && fileUrl.startsWith("http")) {
        pdfSource = fileUrl;
    }

    if (!pdfSource) {
        if (statusEl) statusEl.innerText = "Önizleme Modu (8 Sayfa)";
        return;
    }

    if (statusEl) statusEl.innerText = "Kitap Yükleniyor...";

    try {
        let loadingTask;
        if (pdfSource instanceof Blob) {
            const ab = await pdfSource.arrayBuffer();
            loadingTask = window.pdfjsLib.getDocument({ data: ab });
        } else {
            loadingTask = window.pdfjsLib.getDocument({
                url: pdfSource,
                cMapUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/",
                cMapPacked: true
            });
        }

        const pdf = await loadingTask.promise;
        DigitalBookState.pdfDoc = pdf;
        DigitalBookState.mode = "pdf";
        DigitalBookState.totalPages = pdf.numPages;

        if (statusEl) statusEl.innerText = "MEB Tam Kitap (" + pdf.numPages + " Sayfa)";

        const totalEl = document.getElementById("book-total-pages");
        if (totalEl) totalEl.innerText = pdf.numPages;

        const inputEl = document.getElementById("book-page-input");
        if (inputEl) inputEl.max = pdf.numPages;

        // PDF moduna geç ve 1. sayfayı render et
        renderBookPage(DigitalBookState.currentPage || 1);
    } catch (err) {
        console.warn("PDF.js yükleme uyarısı (Fallback modunda devam ediliyor):", err);
        if (statusEl) statusEl.innerText = "Önizleme Modu (8 Sayfa)";
    }
}

async function renderBookPage(pageNum) {
    pageNum = Math.max(1, Math.min(pageNum, DigitalBookState.totalPages));
    DigitalBookState.currentPage = pageNum;

    // Sayfa değiştiğinde dikey konumu sıfırla (sayfanın başı görünsün)
    resetBookPosition(false);

    // UI Güncelle
    const inputEl = document.getElementById("book-page-input");
    if (inputEl) inputEl.value = pageNum;

    const totalEl = document.getElementById("book-total-pages");
    if (totalEl) totalEl.innerText = DigitalBookState.totalPages;

    const mobCounter = document.getElementById("book-mob-counter");
    if (mobCounter) mobCounter.innerText = pageNum + " / " + DigitalBookState.totalPages;

    // Buton aktiflik / pasiflik
    const isFirst = pageNum <= 1;
    const isLast = pageNum >= DigitalBookState.totalPages;

    ["book-btn-prev", "book-btn-first", "book-float-prev", "book-mob-prev"].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.disabled = isFirst;
    });

    ["book-btn-next", "book-btn-last", "book-float-next", "book-mob-next"].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.disabled = isLast;
    });

    const canvas = document.getElementById("book-canvas");
    const fallbackBox = document.getElementById("book-fallback-container");

    if (DigitalBookState.mode === "pdf" && DigitalBookState.pdfDoc) {
        if (canvas) canvas.classList.remove("hidden");
        if (fallbackBox) fallbackBox.classList.add("hidden");

        if (DigitalBookState.isRendering) {
            DigitalBookState.pageRenderingQueue = pageNum;
            return;
        }

        DigitalBookState.isRendering = true;
        const spinner = document.getElementById("book-loading-spinner");
        if (spinner) spinner.classList.remove("hidden");

        // Devam eden bir render işlemi varsa iptal et
        if (DigitalBookState.currentRenderTask) {
            try {
                DigitalBookState.currentRenderTask.cancel();
            } catch(e) {}
            DigitalBookState.currentRenderTask = null;
        }

        try {
            const page = await DigitalBookState.pdfDoc.getPage(pageNum);
            const baseViewport = page.getViewport({ scale: 1.0 });
            const scrollArea = document.getElementById("book-reader-scroll-area");
            const targetHeight = (scrollArea ? scrollArea.clientHeight : window.innerHeight) * 0.84;
            const fitScale = targetHeight / baseViewport.height;

            // Gerçek Vektörel HiDPI / Ultra Keskin Render Mantığı (Büyütmede sıfır pikselleşme)
            const zoom = DigitalBookState.currentScale || 1.0;
            const cssWidth = Math.round(baseViewport.width * fitScale * zoom);
            const cssHeight = Math.round(baseViewport.height * fitScale * zoom);

            // DPR: Cihaz piksel oranına göre en az 2.0x, yüksek çözünürlük için süper-örnekleme
            const dpr = Math.min(3.0, Math.max(window.devicePixelRatio || 1.0, 2.0));
            const viewport = page.getViewport({ scale: fitScale * zoom * dpr });

            canvas.width = Math.round(viewport.width);
            canvas.height = Math.round(viewport.height);
            canvas.style.width = cssWidth + "px";
            canvas.style.height = cssHeight + "px";
            canvas.style.maxWidth = "none";
            canvas.style.maxHeight = "none";

            const ctx = canvas.getContext("2d", { alpha: false });
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const renderContext = {
                canvasContext: ctx,
                viewport: viewport,
                intent: "display"
            };
            DigitalBookState.currentRenderTask = page.render(renderContext);
            await DigitalBookState.currentRenderTask.promise;
            DigitalBookState.currentRenderTask = null;

            updateBookTransform(false);
        } catch (e) {
            if (e && e.name !== "RenderingCancelledException") {
                console.error("PDF render hatası:", e);
            }
        } finally {
            DigitalBookState.isRendering = false;
            if (spinner) spinner.classList.add("hidden");
            if (DigitalBookState.pageRenderingQueue !== null) {
                const nextP = DigitalBookState.pageRenderingQueue;
                DigitalBookState.pageRenderingQueue = null;
                renderBookPage(nextP);
            }
        }
    } else {
        // Fallback HTML Modu
        if (canvas) canvas.classList.add("hidden");
        if (fallbackBox) {
            fallbackBox.classList.remove("hidden");
            const pageObj = DigitalBookState.fallbackPages[pageNum - 1];
            if (pageObj) {
                fallbackBox.innerHTML = `
                    <div class="flex items-center justify-between border-b border-slate-100 pb-2 mb-3 shrink-0">
                        <span class="text-xs font-black text-red-600 uppercase tracking-wider">
                            <i class="fa-solid fa-book-bookmark mr-1"></i> ${pageObj.title || 'Sayfa ' + pageNum}
                        </span>
                        <span class="text-xs font-bold text-slate-400">Sayfa ${pageNum} / ${DigitalBookState.totalPages}</span>
                    </div>
                    <div class="flex-1 overflow-y-auto pointer-events-auto">
                        ${pageObj.html}
                    </div>
                `;
                fallbackBox.scrollTop = 0;
            }
        }
        updateBookTransform(false);
    }
}

function changeBookPage(delta) {
    renderBookPage(DigitalBookState.currentPage + delta);
}

function goToFirstBookPage() {
    renderBookPage(1);
}

function goToLastBookPage() {
    renderBookPage(DigitalBookState.totalPages);
}

function onBookPageInputChange(val) {
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
        renderBookPage(num);
    }
}

function changeBookZoom(delta) {
    DigitalBookState.currentScale = Math.min(3.2, Math.max(0.6, parseFloat((DigitalBookState.currentScale + delta).toFixed(2))));
    const zoomText = document.getElementById("book-zoom-text");
    if (zoomText) zoomText.innerText = "%" + Math.round(DigitalBookState.currentScale * 100);

    if (DigitalBookState.mode === "pdf" && DigitalBookState.pdfDoc) {
        clearTimeout(bookZoomDebounceTimer);
        bookZoomDebounceTimer = setTimeout(() => {
            renderBookPage(DigitalBookState.currentPage);
        }, 60);
    } else {
        updateBookTransform(true);
    }
}

function resetBookZoom() {
    resetBookPosition(true);
}

// 🖱️ İMLEÇ İLE SAYFAYI AŞAĞI YUKARI VE SAĞA SOLA SERBESTÇE HAREKET ETTİRME (DRAG & PAN)
function initBookEventListeners() {
    if (DigitalBookState.keyListener) {
        window.removeEventListener("keydown", DigitalBookState.keyListener);
    }

    DigitalBookState.keyListener = (e) => {
        if (!document.getElementById("digital-book-modal")) return;
        if (e.target && e.target.tagName === "INPUT") return;

        if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
            e.preventDefault();
            changeBookPage(1);
        } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
            e.preventDefault();
            changeBookPage(-1);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            scrollBookVertical(70);
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            scrollBookVertical(-70);
        } else if (e.key === "Home") {
            e.preventDefault();
            goToFirstBookPage();
        } else if (e.key === "End") {
            e.preventDefault();
            goToLastBookPage();
        } else if (e.key === "+" || e.key === "=") {
            e.preventDefault();
            changeBookZoom(0.2);
        } else if (e.key === "-") {
            e.preventDefault();
            changeBookZoom(-0.2);
        } else if (e.key === "0") {
            e.preventDefault();
            resetBookPosition(true);
        } else if (e.key === "Escape") {
            closeDigitalBookModal();
        }
    };
    window.addEventListener("keydown", DigitalBookState.keyListener);

    const scrollArea = document.getElementById("book-reader-scroll-area");
    if (!scrollArea) return;

    // 1. Mouse Dragging (İmleçle Basılı Tutup Sayfayı Aşağı-Yukarı Kaydırma)
    const onMouseDown = (e) => {
        if (e.target.closest("button") || e.target.closest("input") || e.target.closest("a")) return;
        if (e.button !== 0) return; // Sadece sol tık
        e.preventDefault();

        DigitalBookState.isDragging = true;
        DigitalBookState.dragStartX = e.clientX;
        DigitalBookState.dragStartY = e.clientY;
        DigitalBookState.dragStartPanX = DigitalBookState.panX;
        DigitalBookState.dragStartPanY = DigitalBookState.panY;
        updateBookTransform(false);
    };

    const onMouseMove = (e) => {
        if (!DigitalBookState.isDragging) return;
        e.preventDefault();

        const deltaX = e.clientX - DigitalBookState.dragStartX;
        const deltaY = e.clientY - DigitalBookState.dragStartY;
        DigitalBookState.panX = DigitalBookState.dragStartPanX + deltaX;
        DigitalBookState.panY = DigitalBookState.dragStartPanY + deltaY;
        updateBookTransform(false);
    };

    const onMouseUp = () => {
        if (DigitalBookState.isDragging) {
            DigitalBookState.isDragging = false;
            updateBookTransform(true);
        }
    };

    // 2. Mouse Wheel Scroll (Fare Tekerleğiyle Sayfayı Aşağı/Yukarı Akıtma)
    const onWheel = (e) => {
        e.preventDefault();
        if (e.ctrlKey || e.metaKey) {
            // Ctrl + Tekerlek -> Büyüt / Küçült
            const delta = e.deltaY < 0 ? 0.15 : -0.15;
            changeBookZoom(delta);
        } else {
            // Normal Tekerlek -> Sayfayı Aşağı / Yukarı Kaydır
            DigitalBookState.panY -= (e.deltaY * 0.9);
            updateBookTransform(false);
        }
    };

    // 3. Touch Dragging (Mobilde ve Dokunmatik Tahtada Parmağı Aşağı-Yukarı Kaydırma)
    const onTouchStart = (e) => {
        if (e.target.closest("button") || e.target.closest("input") || e.target.closest("a")) return;
        if (e.touches.length === 1) {
            DigitalBookState.isDragging = true;
            DigitalBookState.dragStartX = e.touches[0].clientX;
            DigitalBookState.dragStartY = e.touches[0].clientY;
            DigitalBookState.dragStartPanX = DigitalBookState.panX;
            DigitalBookState.dragStartPanY = DigitalBookState.panY;
            DigitalBookState.touchStartX = e.touches[0].clientX;
            DigitalBookState.touchStartY = e.touches[0].clientY;
        }
    };

    const onTouchMove = (e) => {
        if (!DigitalBookState.isDragging || e.touches.length !== 1) return;
        e.preventDefault();

        const deltaX = e.touches[0].clientX - DigitalBookState.dragStartX;
        const deltaY = e.touches[0].clientY - DigitalBookState.dragStartY;
        DigitalBookState.panX = DigitalBookState.dragStartPanX + deltaX;
        DigitalBookState.panY = DigitalBookState.dragStartPanY + deltaY;
        updateBookTransform(false);
    };

    const onTouchEnd = (e) => {
        if (DigitalBookState.isDragging) {
            DigitalBookState.isDragging = false;
            updateBookTransform(true);

            // Yatay swipe kontrolü (hızlı sayfa geçişi için)
            if (e.changedTouches.length === 1) {
                const diffX = e.changedTouches[0].clientX - DigitalBookState.touchStartX;
                const diffY = e.changedTouches[0].clientY - DigitalBookState.touchStartY;
                if (Math.abs(diffX) > 70 && Math.abs(diffX) > Math.abs(diffY) * 2) {
                    if (diffX < 0) {
                        changeBookPage(1); // Sağa kaydırma -> Sonraki
                    } else {
                        changeBookPage(-1); // Sola kaydırma -> Önceki
                    }
                }
            }
        }
    };

    scrollArea.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    scrollArea.addEventListener("wheel", onWheel, { passive: false });
    scrollArea.addEventListener("touchstart", onTouchStart, { passive: false });
    scrollArea.addEventListener("touchmove", onTouchMove, { passive: false });
    scrollArea.addEventListener("touchend", onTouchEnd);
}

function closeDigitalBookModal() {
    const modal = document.getElementById("digital-book-modal");
    if (modal) {
        modal.innerHTML = "";
        modal.remove();
    }
    if (DigitalBookState.keyListener) {
        window.removeEventListener("keydown", DigitalBookState.keyListener);
        DigitalBookState.keyListener = null;
    }
    DigitalBookState.pdfDoc = null;
    DigitalBookState.isRendering = false;
    DigitalBookState.pageRenderingQueue = null;
}



// Materyal Açma / Görüntüleme & Oynatma (İndirme Olmadan Sayfa İçi Önizleme & Oynatıcı)
async function openOrDownloadMaterial(id, fallbackUrl = "#", fileName = "materyal.pdf", category = "", title = "") {
    let found = null;
    if (id) {
        try {
            const allCustom = (typeof getCustomMaterialsList === "function") ? getCustomMaterialsList() : [];
            found = allCustom.find(m => m.id === id);
            if (found) {
                if (!category) category = found.category || "";
                if (!title) title = found.title || "";
                if (!fileName || fileName === "materyal.pdf") fileName = found.fileName || "materyal.pdf";
                if (!fallbackUrl || fallbackUrl === "#") fallbackUrl = found.fileUrl || "#";
            }
        } catch(e) {}
    }

    const checkTitle = ((found && found.title) || title || "").toLocaleLowerCase("tr-TR");
    const isBookMaterial = checkTitle.includes("kitap") || checkTitle.includes("kitab");
    if (isBookMaterial) {
        let pdfTarget = (found && found.fileUrl && found.fileUrl !== "#") ? found.fileUrl : ((fallbackUrl && fallbackUrl !== "#") ? fallbackUrl : "");
        const gradeStr = String((found && found.grade) || "5").replace(/^grade-/, "").trim();
        if (!pdfTarget || pdfTarget === "#" || !pdfTarget.startsWith("http")) {
            if (["5", "6", "7"].includes(gradeStr)) {
                pdfTarget = "https://cdn.eba.gov.tr/temel-egitim/yayin/2026-2027/ktp/fenbilimleri" + gradeStr + "-1.pdf";
            }
        }
        openDigitalBookModal({
            id: id,
            title: (found && found.title) || title || "Fen Bilimleri Ders Kitabı",
            grade: gradeStr,
            fileUrl: pdfTarget,
            fileName: (found && found.fileName) || fileName || "ders-kitabi.pdf"
        });
        return;
    }

    const isVideo = category === "videolar" || (title && title.toLowerCase().includes("video")) || (fileName && (fileName.endsWith(".mp4") || fileName.endsWith(".webm") || fileName.toLowerCase().includes("video")));

        // 1. Video ise sayfayı terketmeden veya indirmeden site içinde video oynatıcıda aç
    if (isVideo) {
        try {
            let fileRecord = await RotaliDB.getFile(id);
            if (!fileRecord || !fileRecord.blob) {
                fileRecord = await RotaliDB.findFileByTitleOrName(title, fileName);
            }
            if (fileRecord && fileRecord.blob) {
                const blobUrl = URL.createObjectURL(fileRecord.blob);
                openInPageVideoModal(blobUrl, title || fileRecord.fileName || "Ders Videosu", true, id);
                return;
            }
        } catch(e) {}

        if (fallbackUrl && fallbackUrl !== "#" && fallbackUrl !== "" && fallbackUrl !== "null" && !fallbackUrl.includes("youtube") && !fallbackUrl.includes("kR1eZq9Q2n4")) {
            openInPageVideoModal(fallbackUrl, title || "Ders Videosu", false, id);
            return;
        } else {
            openInPageVideoModal("", title || "Ders Videosu", false, id);
            return;
        }
    }

    // 2. Eğitsel Oyun veya Eşleştirme ise sayfa içi oyun motorunu çalıştır
    if (category === "egitsel-oyunlar" || category.includes("oyun") || (title && (title.toLowerCase().includes("oyun") || title.toLowerCase().includes("eşleştirme") || title.toLowerCase().includes("laboratuvar")))) {
        if (!fallbackUrl || fallbackUrl === "#" || fallbackUrl === "" || fallbackUrl === "null") {
            openInteractiveGameModal('oyun-5-lab', title || "5. Sınıf Laboratuvar Malzemeleri ve Güvenlik Kuralları Oyunu");
            return;
        }
    }

    // 3. IDB'den dosyayı al ve sayfa içi belge görüntüleyicide göster (İndirme yapmaz!)
    try {
        const fileRecord = await RotaliDB.getFile(id);
        if (fileRecord && fileRecord.blob) {
            const url = URL.createObjectURL(fileRecord.blob);
            const isImg = (fileRecord.type && fileRecord.type.startsWith("image/")) || 
                          (fileRecord.fileName && (/\.(jpg|jpeg|png|webp|svg|gif)$/i).test(fileRecord.fileName)) ||
                          (category && (category === "gorseller" || category.includes("gorsel") || category.includes("infografik")));
            openInPageDocumentModal(url, title || fileRecord.fileName || fileName, fileName, isImg);
            return;
        }
    } catch(err) {
        console.warn("IDB getFile error:", err);
    }

    // 4. Web Bağlantısı veya Data URL ise sayfa içi modalda göster
    if (fallbackUrl && fallbackUrl !== "#" && fallbackUrl !== "" && fallbackUrl !== "null") {
        openInPageDocumentModal(fallbackUrl, title || fileName, fileName);
    } else {
        openInPageDocumentModal("", title || "Fen Bilimleri Ders Dokümanı", fileName);
    }
}

// 📄 SAYFA İÇİ DOKÜMAN & GÖRSEL GÖRÜNTÜLEYİCİ (BÜYÜTME, KÜÇÜLTME & İMLEÇLE SÜRÜKLEYİP KAYDIRMA)
let inPageModalZoom = 1.0;
let inPageModalPanX = 0;
let inPageModalPanY = 0;
let inPageIsDragging = false;
let inPagePanCleanup = null;

function updateImageModalTransform(animate = true) {
    const img = document.getElementById("inpage-modal-zoom-img");
    const container = document.getElementById("inpage-modal-zoom-container");
    if (!img) return;

    if (inPageModalZoom <= 1.0) {
        inPageModalPanX = 0;
        inPageModalPanY = 0;
    }

    img.style.transition = animate ? "transform 0.2s cubic-bezier(0.2, 0, 0, 1)" : "none";
    img.style.transform = `translate(${inPageModalPanX}px, ${inPageModalPanY}px) scale(${inPageModalZoom})`;
    img.style.cursor = inPageModalZoom > 1.0 ? (inPageIsDragging ? "grabbing" : "grab") : "zoom-in";

    if (container) {
        container.style.cursor = inPageModalZoom > 1.0 ? (inPageIsDragging ? "grabbing" : "grab") : "default";
    }
}

function changeImageModalZoom(delta) {
    inPageModalZoom = Math.min(3.5, Math.max(0.6, parseFloat((inPageModalZoom + delta).toFixed(2))));
    if (inPageModalZoom <= 1.0) {
        inPageModalPanX = 0;
        inPageModalPanY = 0;
    }
    const zoomText = document.getElementById("inpage-zoom-level-text");
    if (zoomText) {
        zoomText.innerText = `%${Math.round(inPageModalZoom * 100)}`;
    }
    updateImageModalTransform(true);
}

function resetImageModalZoom() {
    inPageModalZoom = 1.0;
    inPageModalPanX = 0;
    inPageModalPanY = 0;
    const zoomText = document.getElementById("inpage-zoom-level-text");
    if (zoomText) zoomText.innerText = "%100";
    updateImageModalTransform(true);
}

function initImagePanDragListeners() {
    if (inPagePanCleanup) {
        inPagePanCleanup();
        inPagePanCleanup = null;
    }

    const container = document.getElementById("inpage-modal-zoom-container");
    const img = document.getElementById("inpage-modal-zoom-img");
    if (!container || !img) return;

    let startX = 0;
    let startY = 0;
    let initialPanX = 0;
    let initialPanY = 0;

    // Mouse Dragging (İmleç ile basıp sürükleyerek kaydırma)
    const onMouseDown = (e) => {
        if (inPageModalZoom <= 1.0 && e.button !== 0) return;
        e.preventDefault();
        inPageIsDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialPanX = inPageModalPanX;
        initialPanY = inPageModalPanY;
        updateImageModalTransform(false);
    };

    const onMouseMove = (e) => {
        if (!inPageIsDragging) return;
        e.preventDefault();
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        inPageModalPanX = initialPanX + deltaX;
        inPageModalPanY = initialPanY + deltaY;
        updateImageModalTransform(false);
    };

    const onMouseUp = () => {
        if (inPageIsDragging) {
            inPageIsDragging = false;
            updateImageModalTransform(false);
        }
    };

    // Touch Dragging (Mobilde parmakla kaydırma)
    const onTouchStart = (e) => {
        if (e.touches.length === 1) {
            inPageIsDragging = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            initialPanX = inPageModalPanX;
            initialPanY = inPageModalPanY;
            updateImageModalTransform(false);
        }
    };

    const onTouchMove = (e) => {
        if (!inPageIsDragging || e.touches.length !== 1) return;
        e.preventDefault();
        const deltaX = e.touches[0].clientX - startX;
        const deltaY = e.touches[0].clientY - startY;
        inPageModalPanX = initialPanX + deltaX;
        inPageModalPanY = initialPanY + deltaY;
        updateImageModalTransform(false);
    };

    const onTouchEnd = () => {
        if (inPageIsDragging) {
            inPageIsDragging = false;
            updateImageModalTransform(false);
        }
    };

    // Mouse Wheel Zoom (Fare tekerleğiyle hızlı yakınlaştırma)
    const onWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.25 : -0.25;
        changeImageModalZoom(delta);
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    container.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    container.addEventListener("wheel", onWheel, { passive: false });

    inPagePanCleanup = () => {
        container.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        container.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onTouchEnd);
        container.removeEventListener("wheel", onWheel);
    };
}

function openInPageDocumentModal(docUrl, docTitle = "Ders Dokümanı", fileName = "dokuman.pdf", forceImage = false, externalPdf = "") {
    inPageModalZoom = 1.0;
    inPageModalPanX = 0;
    inPageModalPanY = 0;
    inPageIsDragging = false;

    let modal = document.getElementById("inpage-document-modal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "inpage-document-modal";
        modal.className = "fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 transition-all duration-200";
        modal.onclick = function(e) {
            if (e.target === this) closeInPageDocumentModal();
        };
        document.body.appendChild(modal);
    }

    const lowerUrl = (docUrl || "").toLowerCase();
    const lowerFile = (fileName || "").toLowerCase();
    const lowerTitle = (docTitle || "").toLowerCase();

    const isImageDoc = forceImage || 
        lowerUrl.endsWith(".svg") || lowerUrl.endsWith(".jpg") || lowerUrl.endsWith(".jpeg") || lowerUrl.endsWith(".png") || lowerUrl.endsWith(".webp") || lowerUrl.endsWith(".gif") || lowerUrl.includes("data:image") ||
        lowerFile.endsWith(".svg") || lowerFile.endsWith(".jpg") || lowerFile.endsWith(".jpeg") || lowerFile.endsWith(".png") || lowerFile.endsWith(".webp") || lowerFile.endsWith(".gif") ||
        lowerTitle.includes("görsel") || lowerTitle.includes("infografik") || lowerTitle.includes("resim") || lowerTitle.includes("ünite") || lowerTitle.includes("kazanım");

    let contentHtml = "";
    if (isImageDoc) {
        contentHtml = `
            <div class="bg-slate-950 rounded-2xl sm:rounded-3xl w-fit max-w-[96vw] max-h-[96vh] shadow-2xl border border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 mx-auto select-none" onclick="event.stopPropagation()">
                <!-- Üst Başlık & Büyüt/Küçült ve Kapat Butonları -->
                <div class="px-3.5 py-2 bg-slate-900 text-white flex items-center justify-between shrink-0 gap-2 sm:gap-4 border-b border-slate-800">
                    <div class="flex items-center gap-2 min-w-0">
                        <span class="w-6 h-6 rounded-lg bg-red-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                            <i class="fa-solid fa-image"></i>
                        </span>
                        <div class="min-w-0">
                            <h3 class="text-xs sm:text-sm font-black truncate max-w-[140px] sm:max-w-xs">${docTitle}</h3>
                        </div>
                    </div>

                    <!-- Dış Bağlantı & EBA Butonu (Varsa) -->
                    ${externalPdf && externalPdf.startsWith("http") ? `
                        <a href="${externalPdf}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl text-[11px] font-black flex items-center gap-1.5 transition-all shadow-sm shrink-0" title="MEB / EBA Üzerinden Tüm Kitabı Oku">
                            <i class="fa-solid fa-book-open"></i> <span class="hidden sm:inline">Tüm Kitabı Oku</span><span>(EBA)</span>
                        </a>
                    ` : ''}

                    <!-- 🔍 Büyüt / Küçült / Sıfırla Toolbar -->
                    <div class="flex items-center gap-1 sm:gap-1.5 shrink-0 bg-slate-800 p-0.5 sm:p-1 rounded-xl border border-slate-700">
                        <button type="button" onclick="changeImageModalZoom(-0.25)" class="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-700 hover:bg-red-600 text-white flex items-center justify-center text-xs font-black transition-all cursor-pointer" title="Küçült (-)">
                            <i class="fa-solid fa-magnifying-glass-minus"></i>
                        </button>
                        <button type="button" onclick="resetImageModalZoom()" id="inpage-zoom-level-text" class="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-amber-400 font-black text-[10px] sm:text-xs tracking-wide transition-all select-none cursor-pointer" title="Yakınlaştırmayı Sıfırla (%100)">
                            %100
                        </button>
                        <button type="button" onclick="changeImageModalZoom(0.25)" class="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-700 hover:bg-emerald-600 text-white flex items-center justify-center text-xs font-black transition-all cursor-pointer" title="Büyüt (+)">
                            <i class="fa-solid fa-magnifying-glass-plus"></i>
                        </button>
                    </div>

                    <button type="button" onclick="closeInPageDocumentModal()" class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-800 hover:bg-red-600 text-white flex items-center justify-center font-black transition-all shrink-0 cursor-pointer shadow-sm" title="Kapat (ESC)">
                        <i class="fa-solid fa-xmark text-sm"></i>
                    </button>
                </div>

                <!-- Görsel Alanı: Tamamen boşluksuz, sıfır padding, ekrana tam oturan net görsel -->
                <div id="inpage-modal-zoom-container" class="p-0 m-0 bg-slate-950 flex items-center justify-center overflow-hidden relative touch-none select-none cursor-grab" title="İmleçle basılı tutup kaydırabilirsiniz">
                    <img id="inpage-modal-zoom-img" src="${docUrl}" alt="${docTitle}" draggable="false" ondblclick="changeImageModalZoom(inPageModalZoom > 1.0 ? -0.5 : 0.5)" class="max-h-[82vh] sm:max-h-[86vh] max-w-[95vw] sm:max-w-[90vw] w-auto h-auto object-contain block mx-auto select-none pointer-events-auto" style="transform: translate(0px, 0px) scale(1); transform-origin: center center;" loading="lazy">
                </div>
            </div>
        `;
    } else {
        contentHtml = `
            <div class="bg-slate-900 rounded-2xl sm:rounded-3xl max-w-5xl w-full h-[85vh] sm:h-[88vh] overflow-hidden shadow-2xl border border-slate-700 flex flex-col animate-in zoom-in-95 duration-200 mx-2" onclick="event.stopPropagation()">
                <!-- Üst Başlık & Kapat Barı -->
                <div class="px-4 py-2.5 sm:px-5 sm:py-3.5 bg-slate-800 text-white flex items-center justify-between shrink-0 border-b border-slate-700 gap-3">
                    <div class="flex items-center gap-2 min-w-0">
                        <span class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs sm:text-sm font-black shrink-0">
                            <i class="fa-solid fa-file-pdf"></i>
                        </span>
                        <div class="min-w-0">
                            <h3 class="text-xs sm:text-sm font-black truncate">${docTitle}</h3>
                            <span class="text-[10px] text-slate-400">Rotalı Fenci Belge Görüntüleyici</span>
                        </div>
                    </div>
                    <button type="button" onclick="closeInPageDocumentModal()" class="w-8 h-8 rounded-full bg-slate-700 hover:bg-red-600 text-white flex items-center justify-center font-black transition-all shrink-0 cursor-pointer shadow-sm" title="Kapat (ESC)">
                        <i class="fa-solid fa-xmark text-sm"></i>
                    </button>
                </div>

                <!-- Belge Alanı -->
                <div class="flex-1 bg-slate-950 p-2 overflow-hidden">
                    <iframe src="${docUrl}" class="w-full h-full rounded-xl sm:rounded-2xl border-0 bg-white"></iframe>
                </div>
            </div>
        `;
    }

    modal.innerHTML = contentHtml;
    modal.classList.remove("hidden");
    modal.style.display = "flex";

    if (isImageDoc) {
        initImagePanDragListeners();
    }
}

function closeInPageDocumentModal() {
    const modal = document.getElementById("inpage-document-modal");
    if (modal) {
        modal.innerHTML = "";
        modal.remove();
    }
}

// -------------------------------------------------------------
// 🎬 SAYFA İÇİ VİDEO İZLEME & OYNATICI MODAL MOTORU (İNDİRMEDEN SİTE İÇİNDE OYNATMA)
// -------------------------------------------------------------
let activeLabSymbolIndex = 0;
const LAB_SAFETY_SYMBOLS = [
    {
        name: "🔥 Yanıcı Madde",
        desc: "Kolayca alev alabilen ve yangına sebep olabilecek maddelerdir. Isı, kıvılcım ve açık alevden kesinlikle uzak tutulmalıdır.",
        rule: "Ateşe ve güneş ışığına doğrudan maruz bırakmayınız. Çeker ocak altında çalışınız.",
        color: "from-amber-500 to-red-600",
        icon: "fa-fire-flame-curved"
    },
    {
        name: "🧪 Korozif (Aşındırıcı) Madde",
        desc: "Cildi yakan, metalleri ve kumaşları aşındıran kuvvetli asit ve bazlardır (örn: Zaç yağı / H2SO4, Tuz ruhu / HCl).",
        rule: "Asla çıplak elle dokunulmaz. Koruyucu gözlük, asit eldiveni ve önlük mutlaka takılmalıdır.",
        color: "from-blue-600 to-cyan-600",
        icon: "fa-flask-vial"
    },
    {
        name: "☠️ Toksik (Zehirli) Madde",
        desc: "Ağız, solunum ya da deri yoluyla vücuda girdiğinde zehirlenmelere ve ağır sağlık sorunlarına yol açar.",
        rule: "Asla koklanmaz, tadına bakılmaz. Çeker ocakta solunmadan kullanılır.",
        color: "from-purple-600 to-slate-900",
        icon: "fa-skull-crossbones"
    },
    {
        name: "💥 Patlayıcı Madde",
        desc: "Sürtünme, darbe, kıvılcım veya ısı etkisiyle aniden şiddetli patlama riski taşıyan maddelerdir.",
        rule: "Darbe ve sarsıntıdan korunmalı, belirlenen güvenli dolaplarda saklanmalıdır.",
        color: "from-rose-600 to-amber-600",
        icon: "fa-bomb"
    },
    {
        name: "☢️ Radyoaktif Madde",
        desc: "Çevreye zararlı ve canlı hücrelerin genetik yapısını bozan görünmez ışınlar (radyasyon) yayan maddelerdir.",
        rule: "Özel koruyucu kurşun zırhlı odalarda tutulmalı ve özel kıyafet olmadan yaklaşılmamalıdır.",
        color: "from-yellow-500 to-amber-600",
        icon: "fa-radiation"
    },
    {
        name: "☣️ Biyolojik Tehlike",
        desc: "Mikroorganizmalar, virüsler, bakteriler ve enfeksiyon yapıcı biyolojik atıklardır.",
        rule: "Tıbbi atık kutularına atılmalı ve temas halinde derhal dezenfekte edilmelidir.",
        color: "from-emerald-600 to-teal-800",
        icon: "fa-biohazard"
    },
    {
        name: "🐟 Çevreye Zararlı (Ekotoksik) Madde",
        desc: "Doğaya, sulara ve toprağa karıştığında suda yaşayan canlıları ve ekosistemi zehirleyen maddelerdir.",
        rule: "Lavaboya kesinlikle dökülmez! Kimyasal atık toplama bidonlarına boşaltılır.",
        color: "from-teal-600 to-cyan-700",
        icon: "fa-tree"
    },
    {
        name: "🥽 Kişisel Koruyucu Donanım",
        desc: "Laboratuvara giren her araştırmacının can güvenliğini koruyan önlük, koruyucu gözlük ve nitril eldivendir.",
        rule: "Deney başlamadan önce takılır, deney bitip eller yıkanana kadar çıkarılmaz.",
        color: "from-indigo-600 to-blue-700",
        icon: "fa-glasses"
    }
];

let currentPlayingVideoMaterialId = null;

function openInPageVideoModal(videoSrc, videoTitle = "Ders Videosu", isBlob = false, materialId = "") {
    if (materialId) currentPlayingVideoMaterialId = materialId;
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }

    let modal = document.getElementById("inpage-video-modal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "inpage-video-modal";
        modal.className = "fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 transition-all";
        modal.onclick = function(e) {
            if (e.target === this) closeInPageVideoModal();
        };
        document.body.appendChild(modal);
    }

    let ytSrc = "";
    let isDirectVideo = false;

    if (videoSrc && (videoSrc.includes("youtube") || videoSrc.includes("youtu.be"))) {
        let ytId = "";
        let match = videoSrc.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
        if (match && match[1]) {
            ytId = match[1];
        } else if (videoSrc.includes("v=")) {
            ytId = videoSrc.split("v=")[1].split("&")[0];
        } else if (videoSrc.includes("youtu.be/")) {
            ytId = videoSrc.split("youtu.be/")[1].split("?")[0];
        }
        if (ytId) ytSrc = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`;
    } else if (videoSrc && (videoSrc.startsWith("blob:") || videoSrc.startsWith("data:video") || videoSrc.endsWith(".mp4") || videoSrc.endsWith(".webm") || (videoSrc.startsWith("http") && !videoSrc.includes("youtube")))) {
        ytSrc = videoSrc;
        isDirectVideo = true;
    }

    modal.innerHTML = `
        <div class="bg-slate-900 rounded-3xl max-w-4xl w-full border border-slate-700 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200" onclick="event.stopPropagation()">
            <!-- Üst Başlık Barı -->
            <div class="p-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between text-white flex-wrap gap-2">
                <div class="flex items-center gap-3">
                    <span class="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center text-lg font-black shadow-md">
                        <i class="fa-solid fa-circle-play"></i>
                    </span>
                    <div>
                        <h3 class="text-sm sm:text-base font-black truncate max-w-xs sm:max-w-md">${videoTitle}</h3>
                        <span class="text-xs text-slate-400">Rotalı Fenci Canlı Video & Konu Anlatımı</span>
                    </div>
                </div>
                
                <div class="flex items-center gap-2">
                    <div class="flex bg-slate-900/80 rounded-xl p-1 border border-slate-700">
                        <button type="button" id="tab-yt-btn" onclick="switchVideoModalTab('yt')" class="px-3 py-1.5 rounded-lg text-xs font-black transition-all bg-red-600 text-white shadow-sm flex items-center gap-1.5">
                            <i class="fa-solid fa-play"></i> Video Yayını
                        </button>
                        <button type="button" id="tab-interactive-btn" onclick="switchVideoModalTab('interactive')" class="px-3 py-1.5 rounded-lg text-xs font-black transition-all text-slate-300 hover:text-white flex items-center gap-1.5">
                            <i class="fa-solid fa-wand-magic-sparkles"></i> İnteraktif Anlatım
                        </button>
                    </div>
                    <button type="button" onclick="closeInPageVideoModal()" class="w-9 h-9 rounded-full bg-slate-700 hover:bg-rose-600 text-white flex items-center justify-center font-black transition-all" title="Kapat">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>

            <!-- Video Alanı 1: Canlı Video / MP4 / YouTube -->
            <div id="video-tab-yt" class="p-3 sm:p-5 bg-slate-950">
                ${isDirectVideo ? `
                    <div class="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl flex items-center justify-center">
                        <video src="${ytSrc}" controls autoplay playsinline class="w-full h-full rounded-2xl max-h-[70vh] object-contain"></video>
                    </div>
                ` : (ytSrc ? `
                    <div class="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800">
                        <iframe src="${ytSrc}" class="w-full h-full border-0" title="${videoTitle}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                    </div>
                ` : `
                    <div class="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 flex flex-col items-center justify-center p-6 text-center border border-slate-800 shadow-2xl">
                        <div class="w-16 h-16 rounded-2xl bg-red-600/20 text-red-500 flex items-center justify-center text-3xl mb-3 shadow-lg border border-red-500/30">
                            <i class="fa-solid fa-circle-play"></i>
                        </div>
                        <h4 class="text-base sm:text-lg font-black text-white mb-2">${videoTitle}</h4>
                        <p class="text-xs text-slate-300 max-w-md mx-auto mb-4 font-medium leading-relaxed">
                            Bu video yerel cihazınızdan eklenmiştir. Cihazınızdaki MP4 dosyasını seçtiğinizde hem hemen oynatılır hem de bu tarayıcıya güvenle kaydedilerek bir daha sorulmaz.
                        </p>
                        <div class="flex flex-wrap items-center justify-center gap-3">
                            <label class="px-5 py-2.5 bg-red-600 hover:bg-red-700 active:scale-98 text-white rounded-2xl text-xs font-black cursor-pointer shadow-xl transition-all flex items-center gap-2">
                                <i class="fa-solid fa-folder-open text-sm"></i> Cihazdan Bu MP4 Dosyasını Seçip Oynat
                                <input type="file" accept="video/mp4,video/*" onchange="handleSelectAndPlayVideo(event)" class="hidden">
                            </label>
                            <button type="button" onclick="promptVideoUrlForMaterial()" class="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-200 border border-slate-700 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer" title="Tüm cihazlarda doğrudan oynatmak için YouTube veya Drive linki ekle">
                                <i class="fa-brands fa-youtube text-red-500"></i> Video Linki / YouTube Ekle
                            </button>
                        </div>
                    </div>
                `)}
                <div class="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        <span>Site İçi Kesintisiz Oynatma • İndirme Gerekmez</span>
                    </span>
                    <button type="button" onclick="switchVideoModalTab('interactive')" class="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1">
                        Sesli & Görsel Sembol Kartlarına Geç <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>

            <!-- Video Alanı 2: İnteraktif Görsel & Sesli Semboller Dersi (Çevrimdışı ve Garantili) -->
            <div id="video-tab-interactive" class="p-4 sm:p-6 bg-slate-950 hidden">
                <div id="interactive-symbol-container" class="space-y-6">
                    <!-- Dinamik olarak render edilir -->
                </div>
            </div>
        </div>
    `;

    activeLabSymbolIndex = 0;
    renderInteractiveSymbolSlide();
}

function switchVideoModalTab(tab) {
    const ytTab = document.getElementById("video-tab-yt");
    const intTab = document.getElementById("video-tab-interactive");
    const ytBtn = document.getElementById("tab-yt-btn");
    const intBtn = document.getElementById("tab-interactive-btn");

    if (!ytTab || !intTab) return;

    if (tab === "interactive") {
        ytTab.classList.add("hidden");
        intTab.classList.remove("hidden");
        ytBtn.className = "px-3 py-1.5 rounded-lg text-xs font-black transition-all text-slate-300 hover:text-white flex items-center gap-1.5";
        intBtn.className = "px-3 py-1.5 rounded-lg text-xs font-black transition-all bg-emerald-600 text-white shadow-sm flex items-center gap-1.5";
        renderInteractiveSymbolSlide();
    } else {
        intTab.classList.add("hidden");
        ytTab.classList.remove("hidden");
        ytBtn.className = "px-3 py-1.5 rounded-lg text-xs font-black transition-all bg-red-600 text-white shadow-sm flex items-center gap-1.5";
        intBtn.className = "px-3 py-1.5 rounded-lg text-xs font-black transition-all text-slate-300 hover:text-white flex items-center gap-1.5";
        if (window.speechSynthesis) window.speechSynthesis.cancel();
    }
}

function renderInteractiveSymbolSlide() {
    const container = document.getElementById("interactive-symbol-container");
    if (!container) return;

    const sym = LAB_SAFETY_SYMBOLS[activeLabSymbolIndex];
    container.innerHTML = `
        <div class="relative bg-gradient-to-br ${sym.color} p-6 sm:p-8 rounded-3xl text-white shadow-2xl border border-white/20 flex flex-col justify-between min-h-[360px]">
            <div class="flex items-center justify-between mb-4">
                <span class="px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-xs font-black uppercase tracking-wider">
                    Sembol ${activeLabSymbolIndex + 1} / ${LAB_SAFETY_SYMBOLS.length}
                </span>
                <button type="button" onclick="speakCurrentSymbol()" class="px-3 py-1.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 transition-transform">
                    <i class="fa-solid fa-volume-high text-emerald-600"></i> Sesli Dinle
                </button>
            </div>

            <div class="flex flex-col sm:flex-row items-center gap-6 my-4">
                <div class="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-black/30 border-2 border-white/40 flex items-center justify-center text-5xl sm:text-6xl shadow-xl flex-shrink-0">
                    <i class="fa-solid ${sym.icon}"></i>
                </div>
                <div class="text-center sm:text-left space-y-2">
                    <h4 class="text-2xl sm:text-3xl font-black tracking-tight">${sym.name}</h4>
                    <p class="text-sm sm:text-base text-white/90 leading-relaxed font-medium">${sym.desc}</p>
                    <div class="p-3 bg-black/30 backdrop-blur-md rounded-xl border border-white/10 text-xs sm:text-sm font-bold text-amber-200">
                        ⚠️ <strong>Güvenlik Kuralı:</strong> ${sym.rule}
                    </div>
                </div>
            </div>

            <div class="pt-4 border-t border-white/20 flex items-center justify-between gap-3">
                <button type="button" onclick="prevSymbolSlide()" class="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-2 transition-all active:scale-95">
                    <i class="fa-solid fa-chevron-left"></i> Önceki
                </button>
                <div class="flex gap-1.5">
                    ${LAB_SAFETY_SYMBOLS.map((_, i) => `
                        <span onclick="goToSymbolSlide(${i})" class="w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${i === activeLabSymbolIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'}"></span>
                    `).join("")}
                </div>
                <button type="button" onclick="nextSymbolSlide()" class="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-2 transition-all active:scale-95">
                    Sonraki <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>
        </div>
    `;
}

function nextSymbolSlide() {
    activeLabSymbolIndex = (activeLabSymbolIndex + 1) % LAB_SAFETY_SYMBOLS.length;
    renderInteractiveSymbolSlide();
}

function prevSymbolSlide() {
    activeLabSymbolIndex = (activeLabSymbolIndex - 1 + LAB_SAFETY_SYMBOLS.length) % LAB_SAFETY_SYMBOLS.length;
    renderInteractiveSymbolSlide();
}

function goToSymbolSlide(index) {
    activeLabSymbolIndex = index;
    renderInteractiveSymbolSlide();
}

function speakCurrentSymbol() {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const sym = LAB_SAFETY_SYMBOLS[activeLabSymbolIndex];
    const text = `${sym.name}. ${sym.desc}. Güvenlik Kuralı: ${sym.rule}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "tr-TR";
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
}


async function handleSelectAndPlayVideo(e) {
    if (e.target && e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const blobUrl = URL.createObjectURL(file);
        if (currentPlayingVideoMaterialId && typeof RotaliDB !== "undefined" && RotaliDB.saveFile) {
            try {
                await RotaliDB.saveFile(currentPlayingVideoMaterialId, file, file.name, file.type);
                if (typeof showToast === "function") {
                    showToast("✅ Video bu cihaza kaydedildi. Artık doğrudan oynatılacak!", "success");
                }
            } catch(err) {}
        }
        openInPageVideoModal(blobUrl, file.name, true, currentPlayingVideoMaterialId);
    }
}

async function promptVideoUrlForMaterial() {
    const url = prompt("Videonun tüm cihazlarda (telefon, bilgisayar, akıllı tahta) doğrudan oynatılması için YouTube veya Google Drive bağlantısını girin:");
    if (!url || !url.trim()) return;
    const cleanUrl = url.trim();
    if (currentPlayingVideoMaterialId) {
        try {
            const allCustom = (typeof getCustomMaterialsList === "function") ? getCustomMaterialsList() : [];
            const item = allCustom.find(m => m.id === currentPlayingVideoMaterialId);
            if (item) {
                item.fileUrl = cleanUrl;
                if (cleanUrl.includes("youtube") || cleanUrl.includes("youtu.be")) {
                    item.format = "YouTube Video";
                } else if (cleanUrl.includes("drive.google.com")) {
                    item.format = "Google Drive";
                }
                if (typeof saveCustomMaterialsSafe === "function") {
                    saveCustomMaterialsSafe(allCustom);
                }
                if (typeof CloudSyncManager !== "undefined" && CloudSyncManager.saveToCloud) {
                    await CloudSyncManager.saveToCloud(allCustom);
                }
                if (typeof showToast === "function") {
                    showToast("✅ Video bağlantısı başarıyla güncellendi!", "success");
                }
                openInPageVideoModal(cleanUrl, item.title, false, currentPlayingVideoMaterialId);
            }
        } catch(e) {
            console.warn(e);
        }
    }
}

function closeInPageVideoModal() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    const modal = document.getElementById("inpage-video-modal");
    if (modal) {
        modal.innerHTML = "";
        modal.remove();
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
    const rawGameData = INTERACTIVE_GAMES_POOL[gameKeyOrUrl] || (gameKeyOrUrl && gameKeyOrUrl.includes("lab") ? INTERACTIVE_GAMES_POOL["oyun-5-lab"] : (gameKeyOrUrl && gameKeyOrUrl.includes("passaparola") ? INTERACTIVE_GAMES_POOL["oyun-8-passaparola"] : (gameKeyOrUrl && gameKeyOrUrl.includes("hucre") ? INTERACTIVE_GAMES_POOL["oyun-7-hucre"] : null)));

    if (rawGameData) {
        // Rastgele şık dizilimi ve soru sıralaması (Cevapların sürekli A şıkkı çıkmasını engeller)
        const shuffledQuestions = rawGameData.questions.map(origQ => {
            const q = { ...origQ };
            const correctText = origQ.options[origQ.answer !== undefined ? origQ.answer : 0];
            const opts = [...origQ.options];
            for (let i = opts.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [opts[i], opts[j]] = [opts[j], opts[i]];
            }
            q.options = opts;
            q.answer = opts.indexOf(correctText);
            return q;
        });

        // Soru sırasını da karıştır
        for (let i = shuffledQuestions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
        }

        const gameData = {
            ...rawGameData,
            questions: shuffledQuestions
        };

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
    currentTagsList = editMaterial && editMaterial.tags ? [...editMaterial.tags] : ["fenbilimleri", "fen", "ortaokul", "MEB 2026-2027"];
    const targetGradeClean = editMaterial ? String(editMaterial.grade || "").replace(/^grade-/, "") : String(prefillGrade || "8").replace(/^grade-/, "");
    const isEditing = !!editMaterial;
    if (editMaterial) editingMaterialId = editMaterial.id;
    else editingMaterialId = null;

    modal.innerHTML = `
        <div class="bg-white rounded-3xl p-5 sm:p-7 max-w-2xl w-full border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto custom-scrollbar" onclick="event.stopPropagation()">
            
            <!-- Kapatma Çarpı Butonu -->
            <button type="button" onclick="closeMaterialUploadModal()" class="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 flex items-center justify-center font-black text-sm sm:text-base transition-all z-20 shadow-sm" title="Kapat (ESC)">
                <i class="fa-solid fa-xmark"></i>
            </button>

            <!-- Başlık & İkon -->
            <div class="flex items-center gap-3 sm:gap-3.5 mb-5 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-100">
                <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr ${isEditing ? 'from-amber-500 to-orange-600' : 'from-red-600 to-rose-700'} text-white flex items-center justify-center text-lg sm:text-xl shadow-md shrink-0">
                    <i class="fa-solid ${isEditing ? 'fa-pen-to-square' : 'fa-cloud-arrow-up'}"></i>
                </div>
                <div>
                    <h3 class="text-base sm:text-2xl font-black text-slate-900 tracking-tight">
                        ${isEditing ? 'Materyali Düzenle & Taşı' : 'Yeni İçerik & Materyal Ekle'}
                    </h3>
                    <p class="text-[11px] sm:text-xs text-slate-500 font-medium">
                        ${isEditing ? 'Başlığı, sınıfı, konumu veya dosyayı güncelleyin' : 'PDF, Word, PPTX, Video, Ses, Görsel veya Web Bağlantısı'}
                    </p>
                </div>
            </div>

            <form id="adv-material-form" onsubmit="handleAdvMaterialSubmit(event)" class="space-y-5 sm:space-y-6">
                
                <!-- 1. KATEGORİ & BAŞLIK HİYERARŞİSİ -->
                <div class="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 sm:space-y-4">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-red-600"></span> 1. Kategori & Konum Hiyerarşisi
                        </span>
                        <span class="text-[11px] font-bold text-slate-400 hidden sm:inline">İstediğiniz Sınıfa / Bölüme Taşıyın</span>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <!-- Ana Kategori / Sınıf -->
                        <div>
                            <label class="block text-xs font-black uppercase text-slate-700 mb-1">Hedef Sınıf / Seviye</label>
                            <select id="adv-grade-select" onchange="updateCascadingUnits()" class="w-full p-2.5 sm:p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-red-500 shadow-sm">
                                <option value="8" ${targetGradeClean === '8' ? 'selected' : ''}>8. Sınıf & LGS</option>
                                <option value="7" ${targetGradeClean === '7' ? 'selected' : ''}>7. Sınıf Fen Bilimleri</option>
                                <option value="6" ${targetGradeClean === '6' ? 'selected' : ''}>6. Sınıf Fen Bilimleri</option>
                                <option value="5" ${targetGradeClean === '5' ? 'selected' : ''}>5. Sınıf Fen Bilimleri</option>
                                <option value="all" ${(isEditing ? editMaterial.grade === 'all' : prefillGrade === 'all') ? 'selected' : ''}>Proje & Genel Merkez</option>
                            </select>
                        </div>

                        <!-- Alt Kategori -->
                        <div>
                            <label class="block text-xs font-black uppercase text-slate-700 mb-1">Materyal Türü / Sekme</label>
                            <select id="adv-category-select" class="w-full p-2.5 sm:p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-red-500 shadow-sm">
                                <option value="ders-notu" ${(isEditing ? editMaterial.category === 'ders-notu' : prefillTab === 'ders-notu') ? 'selected' : ''}>📝 Ders Notu</option>
                                <option value="ders-sunumu" ${(isEditing ? editMaterial.category === 'ders-sunumu' : prefillTab === 'ders-sunumu') ? 'selected' : ''}>📊 Ders Sunumu</option>
                                <option value="videolar" ${(isEditing ? editMaterial.category === 'videolar' : prefillTab === 'videolar') ? 'selected' : ''}>🎥 Videolar</option>
                                <option value="etkinlikler" ${(isEditing ? editMaterial.category === 'etkinlikler' : prefillTab === 'etkinlikler') ? 'selected' : ''}>🧩 Etkinlikler</option>
                                <option value="soru-bankasi" ${(isEditing ? editMaterial.category === 'soru-bankasi' : prefillTab === 'soru-bankasi') ? 'selected' : ''}>📚 Soru Bankası</option>
                                <option value="denemeler" ${(isEditing ? editMaterial.category === 'denemeler' : prefillTab === 'denemeler') ? 'selected' : ''}>🎯 Denemeler</option>
                                <option value="egitsel-oyunlar" ${(isEditing ? editMaterial.category === 'egitsel-oyunlar' : prefillTab === 'egitsel-oyunlar') ? 'selected' : ''}>🎮 Eğitsel Oyunlar</option>
                                <option value="lgs" ${(isEditing ? editMaterial.category === 'lgs' : prefillTab === 'lgs') ? 'selected' : ''}>🎯 LGS Pusulası (8. Sınıf)</option>
                                <option value="bilim-insanlari" ${(isEditing ? editMaterial.category === 'bilim-insanlari' : prefillTab === 'bilim-insanlari') ? 'selected' : ''}>🔭 Bilimin Rotasını Çizenler</option>
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
                        <select id="adv-unit-select" class="w-full p-2.5 sm:p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-red-500 shadow-sm">
                            <!-- JS ile dolar -->
                        </select>
                        <input type="text" id="adv-custom-topic-input" placeholder="Yeni Özel Başlık / Alt Başlık yazın..." class="hidden w-full mt-2 p-2.5 sm:p-3 bg-white border border-red-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500 shadow-sm">
                    </div>
                </div>

                <!-- 2. İÇERİK BİLGİLERİ -->
                <div class="space-y-3 sm:space-y-4">
                    <div>
                        <label class="block text-xs font-black uppercase text-slate-700 mb-1">
                            İçerik Başlığı <span class="text-red-500">*</span>
                        </label>
                        <input type="text" id="adv-title-input" required value="${isEditing ? (editMaterial.title || '') : ''}" placeholder="Örn: 8. Sınıf Basınç Ünitesi Akıllı Tahta Uyumlu Slayt Seti" class="w-full p-3 sm:p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white transition-all shadow-sm">
                    </div>

                    <div>
                        <label class="block text-xs font-black uppercase text-slate-700 mb-1">Kısa Açıklama / Yönerge</label>
                        <textarea id="adv-desc-input" rows="2" placeholder="Öğrenciler veya öğretmenler için materyal açıklaması..." class="w-full p-2.5 sm:p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white transition-all shadow-sm">${isEditing ? (editMaterial.desc || '') : ''}</textarea>
                    </div>
                </div>

                <!-- 3. DOSYA YÜKLEME VEYA LİNK -->
                <div class="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 sm:space-y-4">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-red-600"></span> 2. Dosya / Bağlantı Kaynağı
                        </span>
                        
                        <!-- Sekme Değiştirici -->
                        <div class="flex items-center p-1 bg-slate-200/80 rounded-xl text-xs font-bold">
                            <button type="button" id="tab-upload-file-btn" onclick="switchUploadMethod('file')" class="px-2.5 sm:px-3 py-1.5 rounded-lg bg-white text-slate-900 shadow-sm transition-all text-xs">
                                📁 Dosya Yükle
                            </button>
                            <button type="button" id="tab-upload-link-btn" onclick="switchUploadMethod('link')" class="px-2.5 sm:px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition-all text-xs">
                                🔗 Web / Drive Linki
                            </button>
                        </div>
                    </div>

                    <!-- Dosya Sürükle Bırak Alanı -->
                    <div id="upload-method-file-container">
                        <div id="drag-drop-zone" ondragover="handleDragOver(event)" ondragleave="handleDragLeave(event)" ondrop="handleFileDrop(event)" class="border-2 border-dashed border-slate-300 hover:border-red-500 bg-white rounded-2xl p-4 sm:p-6 text-center transition-all cursor-pointer group">
                            <input type="file" id="adv-file-input" onchange="handleFileSelected(event)" accept="*/*,image/*,application/pdf,.pdf,.docx,.doc,.pptx,.ppt,.xlsx,.xls,.mp4,.webm,.mp3,.wav,.png,.jpg,.jpeg,.svg,.webp,.zip" class="hidden">
                            <label for="adv-file-input" class="cursor-pointer block">
                                <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-xl sm:text-2xl mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform shadow-sm">
                                    <i class="fa-solid fa-cloud-arrow-up"></i>
                                </div>
                                <span class="block text-xs font-black text-slate-800 mb-0.5 sm:mb-1">Yeni dosya seçmek için <span class="text-red-600 underline">Gözatın</span> veya sürükleyin</span>
                                <span class="block text-[10px] sm:text-[11px] text-slate-400 font-medium">PDF, Word, PPTX, Video, Görsel, ZIP</span>
                            </label>
                        </div>
                    </div>

                    <!-- Embed Link -->
                    <div id="upload-method-link-container" class="hidden space-y-2">
                        <label class="block text-[11px] font-black text-slate-700 uppercase">Google Drive, YouTube, Canva veya Web Dosya Linki</label>
                        <div class="relative">
                            <input type="url" id="adv-link-input" oninput="handleAdvLinkInput(this.value)" value="${isEditing && editMaterial.fileUrl && editMaterial.fileUrl.startsWith('http') ? editMaterial.fileUrl : ''}" placeholder="https://drive.google.com/... veya https://youtube.com/watch?v=..." class="w-full p-3 sm:p-3.5 pl-10 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-red-500 shadow-sm">
                            <i class="fa-solid fa-link absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                        </div>
                    </div>

                    <!-- Önizleme Kartı -->
                    <div id="file-preview-card" class="${isEditing && editMaterial.fileName ? 'block' : 'hidden'} bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in duration-200">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3 overflow-hidden">
                                <div id="preview-file-icon" class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-base sm:text-lg shrink-0">
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

                <!-- 🖼️ 3. KAPAK RESMİ / GÖRSELİ (VİDEO VE İÇERİK AFİŞİ) -->
                <div class="p-4 sm:p-5 bg-gradient-to-br from-amber-50/60 to-orange-50/50 border border-amber-200/90 rounded-2xl space-y-3 sm:space-y-4">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-amber-500"></span> 3. Kapak Resmi / Görseli <span class="text-[10px] sm:text-[11px] font-bold text-amber-800 normal-case bg-amber-100/80 px-2 py-0.5 rounded-md">Video & Materyal Afişi</span>
                        </span>
                        <span class="text-[10px] sm:text-[11px] font-bold text-slate-500">İsteğe Bağlı</span>
                    </div>
                    <p class="text-[11px] text-slate-600 font-medium">
                        Videonuz veya ders notunuz için sitede görünecek özel bir kapak görseli seçebilirsiniz. (Video linki girildiğinde YouTube kapağı otomatik de algılanır).
                    </p>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <!-- Kapak Dosyası Seç (Cihazdan) -->
                        <div>
                            <label class="block text-[11px] font-black uppercase text-slate-700 mb-1">Cihazdan Kapak Resmi Seç</label>
                            <input type="file" id="adv-cover-input" onchange="handleCoverFileSelected(event)" accept="image/*,.png,.jpg,.jpeg,.webp,.svg" class="hidden">
                            <label for="adv-cover-input" class="w-full p-2.5 sm:p-3 bg-white hover:bg-amber-100/40 border border-slate-200 hover:border-amber-400 rounded-xl text-xs font-bold text-slate-700 cursor-pointer flex items-center justify-center gap-2 transition-all shadow-sm group">
                                <i class="fa-solid fa-image text-amber-600 text-sm group-hover:scale-110 transition-transform"></i>
                                <span id="cover-file-btn-text">Kapak Görseli Yükle...</span>
                            </label>
                        </div>

                        <!-- Kapak Resmi URL'si -->
                        <div>
                            <label class="block text-[11px] font-black uppercase text-slate-700 mb-1">veya Kapak Resmi Linki (URL)</label>
                            <div class="relative">
                                <input type="url" id="adv-cover-url-input" oninput="handleCoverUrlInput(this.value)" value="${isEditing && editMaterial.imageUrl ? editMaterial.imageUrl : ''}" placeholder="https://.../kapak.jpg veya YouTube afişi" class="w-full p-2.5 sm:p-3 pl-8 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500 shadow-sm">
                                <i class="fa-solid fa-link absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Kapak Resmi Canlı Önizleme Kartı -->
                    <div id="cover-preview-box" class="${isEditing && editMaterial.imageUrl ? 'flex' : 'hidden'} items-center gap-3 p-3 bg-white rounded-xl border border-amber-200 shadow-sm animate-in fade-in duration-200">
                        <div class="w-20 h-14 sm:w-24 sm:h-16 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
                            <img id="cover-preview-img" src="${isEditing && editMaterial.imageUrl ? editMaterial.imageUrl : ''}" alt="Kapak Önizleme" class="w-full h-full object-cover">
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="text-xs font-black text-slate-800 truncate" id="cover-preview-title">Kapak Resmi Hazır</div>
                            <div class="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                                <i class="fa-solid fa-circle-check"></i> Sitede bu görsel kapak olarak görünecek
                            </div>
                        </div>
                        <button type="button" onclick="removeSelectedCover()" class="p-2 text-slate-400 hover:text-red-600 transition-colors cursor-pointer" title="Kapak Resmini Kaldır">
                            <i class="fa-solid fa-trash-can text-xs"></i>
                        </button>
                    </div>
                </div>

                <!-- 4. ETİKETLER & GÖRÜNÜRLÜK -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div>
                        <label class="block text-xs font-black uppercase text-slate-700 mb-1 sm:mb-1.5">Etiketler</label>
                        <div class="flex flex-wrap gap-1.5 p-2 sm:p-2.5 bg-slate-50 border border-slate-200 rounded-xl min-h-[40px]" id="tags-badge-container"></div>
                        <div class="flex gap-1.5 mt-2">
                            <input type="text" id="adv-tag-input" placeholder="Etiket ekle..." class="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-red-500">
                            <button type="button" onclick="addCustomTag()" class="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-lg">Ekle</button>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-black uppercase text-slate-700 mb-1 sm:mb-1.5">Görünürlük Durumu</label>
                        <select id="adv-visibility-select" class="w-full p-2.5 sm:p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-red-500">
                            <option value="public" ${isEditing && editMaterial.visibility === 'public' ? 'selected' : ''}>🌐 Herkese Açık (Yayında)</option>
                            <option value="draft" ${isEditing && editMaterial.visibility === 'draft' ? 'selected' : ''}>🔒 Taslak (Gizli)</option>
                        </select>
                    </div>
                </div>

                <!-- 5. KAYDET VE YAYINLA BUTONLARI (Görünürlük Durumunun Hemen Altında) -->
                <div class="pt-4 mt-2 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
                    <button type="submit" id="submit-material-btn" class="w-full sm:flex-1 py-3.5 sm:py-4 px-6 bg-gradient-to-r ${isEditing ? 'from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700' : 'from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-800'} text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2.5 transform active:scale-98 cursor-pointer">
                        <i class="fa-solid ${isEditing ? 'fa-check' : 'fa-cloud-arrow-up'} text-base"></i>
                        <span>${isEditing ? 'Değişiklikleri Kaydet & Güncelle' : 'İçeriği Sitede Yayınla ve Kaydet'}</span>
                    </button>
                    <button type="button" onclick="closeMaterialUploadModal()" class="w-full sm:w-auto py-3 sm:py-4 px-6 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-black text-xs uppercase rounded-2xl transition-all text-center">
                        Vazgeç
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


// 🖼️ KAPAK RESMİ / VİDEO AFİŞİ YÖNETİMİ
async function handleCoverFileSelected(e) {
    if (e.target && e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        try {
            const compressed = await compressImageIfNeeded(file);
            currentUploadedCoverDataUrl = compressed || await readFileAsDataURL(file);
        } catch(err) {
            currentUploadedCoverDataUrl = await readFileAsDataURL(file);
        }
        
        const previewImg = document.getElementById("cover-preview-img");
        const previewBox = document.getElementById("cover-preview-box");
        const btnText = document.getElementById("cover-file-btn-text");
        const urlInput = document.getElementById("adv-cover-url-input");

        if (previewImg) previewImg.src = currentUploadedCoverDataUrl;
        if (previewBox) {
            previewBox.classList.remove("hidden");
            previewBox.classList.add("flex");
        }
        if (btnText) btnText.innerText = file.name.length > 20 ? (file.name.substring(0, 18) + '...') : file.name;
        if (urlInput) urlInput.value = "";
    }
}

function handleCoverUrlInput(url) {
    const previewImg = document.getElementById("cover-preview-img");
    const previewBox = document.getElementById("cover-preview-box");
    const cleanUrl = (url || "").trim();

    if (cleanUrl.startsWith("http") || cleanUrl.startsWith("data:image")) {
        currentUploadedCoverDataUrl = cleanUrl;
        if (previewImg) previewImg.src = cleanUrl;
        if (previewBox) {
            previewBox.classList.remove("hidden");
            previewBox.classList.add("flex");
        }
    } else if (!cleanUrl && !currentUploadedCoverDataUrl) {
        if (previewBox) {
            previewBox.classList.add("hidden");
            previewBox.classList.remove("flex");
        }
    }
}

function removeSelectedCover() {
    currentUploadedCoverDataUrl = "";
    const fileInput = document.getElementById("adv-cover-input");
    const urlInput = document.getElementById("adv-cover-url-input");
    const previewBox = document.getElementById("cover-preview-box");
    const btnText = document.getElementById("cover-file-btn-text");

    if (fileInput) fileInput.value = "";
    if (urlInput) urlInput.value = "";
    if (previewBox) {
        previewBox.classList.add("hidden");
        previewBox.classList.remove("flex");
    }
    if (btnText) btnText.innerText = "Kapak Görseli Yükle...";
}

function handleAdvLinkInput(val) {
    if (!val) return;
    const cleanVal = val.trim();
    // YouTube ID Çıkarımı
    const ytMatch = cleanVal.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
        const ytId = ytMatch[1];
        const ytThumb = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
        const urlInput = document.getElementById("adv-cover-url-input");
        const previewBox = document.getElementById("cover-preview-box");
        const previewImg = document.getElementById("cover-preview-img");

        // Eğer kullanıcı elle başka bir dosya yüklemediyse otomatik YouTube afişini yerleştir
        if (!currentUploadedCoverDataUrl || currentUploadedCoverDataUrl.includes("youtube.com")) {
            currentUploadedCoverDataUrl = ytThumb;
            if (urlInput) urlInput.value = ytThumb;
            if (previewImg) previewImg.src = ytThumb;
            if (previewBox) {
                previewBox.classList.remove("hidden");
                previewBox.classList.add("flex");
            }
        }
    }
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
// 💾 FORM KAYDETME & YAYINLAMA FONKSİYONU (TAM KORUMALI & MOBİL UYUMLU)
// -------------------------------------------------------------

async function compressImageIfNeeded(file) {
    if (!file || (!file.type.startsWith("image/") && !/\.(jpg|jpeg|png|webp)$/i.test(file.name))) {
        return null;
    }
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const maxDim = 1200; // Mobilde ve webde kristal netliğinde, kota dostu
                let w = img.width;
                let h = img.height;
                if (w > maxDim || h > maxDim) {
                    if (w > h) {
                        h = Math.round((h * maxDim) / w);
                        w = maxDim;
                    } else {
                        w = Math.round((w * maxDim) / h);
                        h = maxDim;
                    }
                }
                const canvas = document.createElement("canvas");
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, w, h);
                let dataUrl = canvas.toDataURL("image/jpeg", 0.70);
                
                // Mobilde ve bulutta kotayı asla aşmamak için 120KB altına optimize et
                if (dataUrl.length > 150000) {
                    const canvas2 = document.createElement("canvas");
                    canvas2.width = Math.round(w * 0.75);
                    canvas2.height = Math.round(h * 0.75);
                    const ctx2 = canvas2.getContext("2d");
                    ctx2.drawImage(img, 0, 0, canvas2.width, canvas2.height);
                    dataUrl = canvas2.toDataURL("image/jpeg", 0.62);
                }
                
                resolve(dataUrl);
            };
            img.onerror = () => resolve(e.target.result);
            img.src = e.target.result;
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
    });
}

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
    
    // Kapak Resmi Çözümleme
    const coverUrlInput = document.getElementById("adv-cover-url-input");
    let chosenCover = currentUploadedCoverDataUrl || (coverUrlInput ? coverUrlInput.value.trim() : "");
    if (!chosenCover && linkVal) {
        const ytM = linkVal.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
        if (ytM && ytM[1]) chosenCover = `https://img.youtube.com/vi/${ytM[1]}/hqdefault.jpg`;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> İşleniyor ve Kaydediliyor...`;
    }

    try {
        let customList = getCustomMaterialsList();

        const materialId = editingMaterialId || `mat-${Date.now()}`;
        let fileFormat = "PDF";
        let finalFileName = `${title}.pdf`;
        let externalUrl = linkVal || "";
        let hasBlob = false;

        // Dosya veya Link İşleme (Tüm cihazlarda ve mobilde görünmesi için Data URL ve IDB)
        let fileDataUrl = "";
        if (currentUploadedFile) {
            finalFileName = currentUploadedFile.name;
            fileFormat = finalFileName.split('.').pop().toUpperCase();
            hasBlob = true;

            // Görsel ise akıllı sıkıştırma ile DataURL oluştur (Mobilde ve tüm cihazlarda kota aşmadan anında açılır)
            try {
                const compressed = await compressImageIfNeeded(currentUploadedFile);
                if (compressed) {
                    fileDataUrl = compressed;
                } else if (currentUploadedFile.size <= 10 * 1024 * 1024) {
                    fileDataUrl = await readFileAsDataURL(currentUploadedFile);
                }
            } catch(e) {
                console.warn("DataURL conversion error:", e);
                try {
                    fileDataUrl = await readFileAsDataURL(currentUploadedFile);
                } catch(err2) {}
            }

            // IndexedDB'ye de kaydet
            try {
                await RotaliDB.saveFile(materialId, currentUploadedFile, finalFileName, fileFormat);
            } catch(idbErr) {
                console.warn("IDB Save error:", idbErr);
            }
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
                    grade: String(grade).replace(/^grade-/, ""),
                    category: category,
                    title: title,
                    unit: unit,
                    desc: desc,
                    fileName: currentUploadedFile ? finalFileName : customList[idx].fileName,
                    fileUrl: externalUrl || (currentUploadedFile ? fileDataUrl : customList[idx].fileUrl) || "#",
                    imageUrl: chosenCover || (customList[idx].imageUrl || (externalUrl && !externalUrl.startsWith("data:") ? externalUrl : "")),
                    format: fileFormat || customList[idx].format,
                    hasBlob: hasBlob || customList[idx].hasBlob,
                    tags: (currentTagsList && currentTagsList.length > 0) ? [...currentTagsList] : customList[idx].tags,
                    visibility: visibility,
                    updatedAt: new Date().toLocaleDateString("tr-TR")
                };
            }
            editingMaterialId = null;
        } else {
            const newMaterial = {
                id: materialId,
                grade: grade,
                category: category,
                title: title,
                unit: unit,
                desc: desc,
                fileName: finalFileName,
                fileUrl: fileDataUrl || externalUrl || "#",
                imageUrl: chosenCover || ((externalUrl && !externalUrl.startsWith("data:") && (externalUrl.endsWith(".jpg") || externalUrl.endsWith(".png") || externalUrl.endsWith(".webp"))) ? externalUrl : ""),
                format: fileFormat,
                hasBlob: hasBlob,
                tags: (currentTagsList && currentTagsList.length > 0) ? [...currentTagsList] : ["fenbilimleri", "fen", "ortaokul", "MEB 2026-2027"],
                visibility: visibility,
                downloadCount: "Yeni",
                createdAt: new Date().toLocaleDateString("tr-TR")
            };
            customList.unshift(newMaterial);
        }

        // Yerel hafızaya ve bellek havuzuna anında güvenle kaydet
        saveCustomMaterialsSafe(customList);

        // ☁️ Buluta Anında Senkronize Et (Telefondan yüklenen içerik bilgisayarda ve tüm ziyaretçilerde anında görünsün)
        if (submitBtn) {
            submitBtn.innerHTML = `<i class="fa-solid fa-cloud-arrow-up fa-spin"></i> Buluta Senkronize Ediliyor...`;
        }

        if (typeof CloudSyncManager !== "undefined" && CloudSyncManager.uploadToCloud) {
            await CloudSyncManager.uploadToCloud(customList, true);
        }

        showToast(`🎉 "${title}" başarıyla kaydedildi ve tüm cihazlara yayınlandı!`, "success");
        closeMaterialUploadModal();

        // Sayfayı hedefe yönlendir ve anında yenile
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



