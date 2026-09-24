// =========================================================================
// ☁️ ROTALI FENCİ - BULUT VERİTABANI VE DEPOLAMA YÖNETİCİSİ (SUPABASE)
// Çoklu cihaz (Telefon, Masaüstü, Tablet, Akıllı Tahta) anlık senkronizasyonu
// =========================================================================

(function() {
    // 1. Varsayılan Yapılandırma
    // Aşağıdaki alanlara Supabase bilgilerinizi yazabilir veya
    // Sitedeki "Yönetici Paneli > Bulut Ayarları" penceresinden doğrudan girebilirsiniz.
    const DEFAULT_CONFIG = {
        supabaseUrl: "", // Örn: https://xyzcompany.supabase.co
        supabaseAnonKey: "", // Örn: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
        bucketName: "rotali-files",
        tableName: "materials"
    };

    // Yerel depodan kaydedilmiş anahtarları oku (Cihaz üzerinden ayarlama desteği)
    function getStoredConfig() {
        try {
            const raw = localStorage.getItem("rotali_supabase_config");
            if (raw) {
                const parsed = JSON.parse(raw);
                return {
                    supabaseUrl: (parsed.supabaseUrl || "").trim() || DEFAULT_CONFIG.supabaseUrl,
                    supabaseAnonKey: (parsed.supabaseAnonKey || "").trim() || DEFAULT_CONFIG.supabaseAnonKey,
                    bucketName: (parsed.bucketName || "").trim() || DEFAULT_CONFIG.bucketName,
                    tableName: (parsed.tableName || "").trim() || DEFAULT_CONFIG.tableName
                };
            }
        } catch (e) {}
        return { ...DEFAULT_CONFIG };
    }

    let currentConfig = getStoredConfig();
    let supabaseClient = null;
    let realtimeSubscription = null;

    // Supabase İstemcisini Başlat
    function initClient() {
        currentConfig = getStoredConfig();
        if (typeof window.supabase !== "undefined" && currentConfig.supabaseUrl && currentConfig.supabaseAnonKey) {
            try {
                supabaseClient = window.supabase.createClient(currentConfig.supabaseUrl, currentConfig.supabaseAnonKey, {
                    auth: { persistSession: false }
                });
                console.log("☁️ Supabase bulut istemcisi başarıyla başlatıldı:", currentConfig.supabaseUrl);
                return true;
            } catch (err) {
                console.error("❌ Supabase başlatma hatası:", err);
                supabaseClient = null;
                return false;
            }
        }
        return false;
    }

    // RotaliCloud Servis Nesnesi
    window.RotaliCloud = {
        getConfig() {
            return { ...currentConfig };
        },

        isConfigured() {
            return !!(currentConfig.supabaseUrl && currentConfig.supabaseAnonKey && supabaseClient);
        },

        saveConfig(url, key, bucket = "rotali-files", table = "materials") {
            const cleanUrl = (url || "").trim().replace(/\/+$/, "");
            const cleanKey = (key || "").trim();
            const cleanBucket = (bucket || "rotali-files").trim();
            const cleanTable = (table || "materials").trim();

            const newCfg = {
                supabaseUrl: cleanUrl,
                supabaseAnonKey: cleanKey,
                bucketName: cleanBucket,
                tableName: cleanTable
            };

            localStorage.setItem("rotali_supabase_config", JSON.stringify(newCfg));
            currentConfig = newCfg;
            const ok = initClient();
            if (ok) {
                this.setupRealtimeListener();
            }
            return ok;
        },

        getClient() {
            if (!supabaseClient) initClient();
            return supabaseClient;
        },

        // 📥 BULUTTAN TÜM MATERYALLERİ ÇEK (Asenkron)
        async fetchMaterials() {
            const client = this.getClient();
            if (!client) {
                console.log("ℹ️ Bulut yapılandırılmamış, yerel veri kullanılıyor.");
                return null;
            }

            try {
                const { data, error } = await client
                    .from(currentConfig.tableName)
                    .select("*")
                    .order("created_at", { ascending: false });

                if (error) {
                    console.warn("⚠️ Supabase fetchMaterials hatası:", error.message);
                    return null;
                }

                if (Array.isArray(data)) {
                    // Veritabanı sütun isimlerini frontend modeline uyarla
                    return data.map(row => ({
                        id: row.id,
                        title: row.title || "Başlıksız Materyal",
                        grade: String(row.grade || "5"),
                        category: row.category || "ders-notu",
                        targetSection: row.target_section || "1",
                        unit: row.unit || "",
                        desc: row.description || "",
                        fileName: row.file_name || row.title || "materyal",
                        fileUrl: row.file_url || "#",
                        imageUrl: row.image_url || "",
                        kapakResmi: row.image_url || "",
                        format: row.format || "PDF",
                        tags: Array.isArray(row.tags) ? row.tags : [],
                        visibility: row.visibility || "public",
                        downloadCount: row.download_count || "Yeni",
                        createdAt: row.created_at || new Date().toISOString(),
                        updatedAt: row.updated_at || new Date().toISOString(),
                        isCloud: true
                    }));
                }
                return [];
            } catch (err) {
                console.error("❌ fetchMaterials beklenmeyen hata:", err);
                return null;
            }
        },

        // 📤 BULUTA MATERYAL VEYA LINK KAYDET / GÜNCELLE
        async saveMaterial(mat) {
            const client = this.getClient();
            if (!client || !mat) return false;

            try {
                const payload = {
                    id: String(mat.id || ("mat-" + Date.now())),
                    title: mat.title || "Yeni Materyal",
                    grade: String(mat.grade || "5"),
                    category: mat.category || "ders-notu",
                    target_section: String(mat.targetSection || "1"),
                    unit: mat.unit || "",
                    description: mat.desc || "",
                    file_name: mat.fileName || mat.name || mat.title || "dosya",
                    file_url: mat.fileUrl || mat.url || "#",
                    image_url: mat.imageUrl || mat.kapakResmi || "",
                    format: mat.format || "Web Bağlantısı",
                    tags: Array.isArray(mat.tags) ? mat.tags : [],
                    visibility: mat.visibility || "public",
                    download_count: mat.downloadCount || "Yeni",
                    updated_at: new Date().toISOString()
                };

                const { error } = await client
                    .from(currentConfig.tableName)
                    .upsert(payload, { onConflict: "id" });

                if (error) {
                    console.error("❌ Supabase saveMaterial hatası:", error);
                    return false;
                }
                console.log("✅ Materyal buluta başarıyla kaydedildi:", payload.id);
                return true;
            } catch (err) {
                console.error("❌ saveMaterial beklenmeyen hata:", err);
                return false;
            }
        },

        // 🗑️ BULUTTAN MATERYAL SİL
        async deleteMaterial(id) {
            const client = this.getClient();
            if (!client || !id) return false;

            try {
                const { error } = await client
                    .from(currentConfig.tableName)
                    .delete()
                    .eq("id", id);

                if (error) {
                    console.error("❌ Supabase deleteMaterial hatası:", error);
                    return false;
                }
                console.log("✅ Materyal buluttan silindi:", id);
                return true;
            } catch (err) {
                console.error("❌ deleteMaterial hata:", err);
                return false;
            }
        },

        // 📦 FİZİKSEL DOSYA YÜKLEME (SUPABASE STORAGE BUCKET)
        // PDF, Görsel, Video, PPTX dosyalarını doğrudan Storage'a yükler ve kalıcı CDN linki döndürür
        async uploadFile(file, folder = "uploads") {
            const client = this.getClient();
            if (!client) {
                throw new Error("Bulut istemcisi yapılandırılmamış.");
            }

            if (!file) throw new Error("Yüklenecek dosya seçilmedi.");

            // Dosya adını temizle ve benzersiz bir anahtar üret
            const cleanName = (file.name || "dosya")
                .toLowerCase()
                .replace(/[^a-z0-9._-]/g, "_")
                .replace(/_+/g, "_");
            const fileExt = cleanName.split('.').pop() || "bin";
            const uniquePath = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${fileExt}`;

            console.log(`📤 Dosya Supabase Storage'a yükleniyor (${currentConfig.bucketName}): ${uniquePath}`);

            const { data, error } = await client.storage
                .from(currentConfig.bucketName)
                .upload(uniquePath, file, {
                    cacheControl: "3600",
                    upsert: false
                });

            if (error) {
                console.error("❌ Storage yükleme hatası:", error);
                throw error;
            }

            // Genel erişim (Public CDN) bağlantısını al
            const { data: pubData } = client.storage
                .from(currentConfig.bucketName)
                .getPublicUrl(uniquePath);

            const publicUrl = pubData ? pubData.publicUrl : "";
            console.log("✅ Dosya başarıyla yüklendi! Genel URL:", publicUrl);

            return {
                path: uniquePath,
                publicUrl: publicUrl,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type
            };
        },

        // ⚡ GERÇEK ZAMANLI (REALTIME) SENKRONİZASYON DİNLEYİCİSİ
        // Bir cihazdan veri eklendiğinde veya silindiğinde diğer cihazları anında tetikler
        setupRealtimeListener(onDataChange) {
            const client = this.getClient();
            if (!client) return;

            try {
                if (realtimeSubscription) {
                    client.removeChannel(realtimeSubscription);
                }

                realtimeSubscription = client
                    .channel("public:" + currentConfig.tableName)
                    .on(
                        "postgres_changes",
                        { event: "*", schema: "public", table: currentConfig.tableName },
                        (payload) => {
                            console.log("🔔 [Supabase Realtime] Veritabanında değişiklik algılandı:", payload.eventType);
                            if (typeof onDataChange === "function") {
                                onDataChange(payload);
                            }
                            // Genel event yayınla
                            window.dispatchEvent(new CustomEvent("rotali-cloud-sync", { detail: payload }));
                        }
                    )
                    .subscribe((status) => {
                        console.log("📡 Realtime abonelik durumu:", status);
                    });
            } catch (e) {
                console.warn("Realtime listener başlatılamadı:", e);
            }
        },

        // ⚙️ KULLANICI İÇİN BULUT AYARLARI MODALI
        openSettingsModal() {
            let existing = document.getElementById("rotali-cloud-settings-modal");
            if (existing) existing.remove();

            const cfg = getStoredConfig();
            const modal = document.createElement("div");
            modal.id = "rotali-cloud-settings-modal";
            modal.className = "fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto";
            modal.innerHTML = `
                <div class="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onclick="event.stopPropagation()">
                    <div class="p-5 sm:p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <span class="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xl font-black border border-indigo-400/30">
                                <i class="fa-solid fa-cloud"></i>
                            </span>
                            <div>
                                <h3 class="text-base sm:text-lg font-black">Bulut Veritabanı ve Senkronizasyon</h3>
                                <p class="text-xs text-indigo-200/80">Telefon, bilgisayar ve akıllı tahta anlık eşitleme</p>
                            </div>
                        </div>
                        <button type="button" onclick="document.getElementById('rotali-cloud-settings-modal').remove()" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-black transition-all">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    <div class="p-5 sm:p-6 space-y-4 text-xs">
                        <div class="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-blue-900 leading-relaxed">
                            <div class="font-black flex items-center gap-1.5 mb-1 text-blue-950">
                                <i class="fa-solid fa-circle-info text-blue-600"></i> Supabase ile Ücretsiz Bulut Kurulumu
                            </div>
                            <ol class="list-decimal pl-4 space-y-1 font-medium text-[11px]">
                                <li><a href="https://supabase.com" target="_blank" class="font-bold underline text-blue-700">supabase.com</a> adresinde ücretsiz bir proje açın.</li>
                                <li><strong>Project Settings > API</strong> sekmesinden <code>Project URL</code> ve <code>anon public</code> anahtarını kopyalayıp aşağıdaki alanlara yapıştırın.</li>
                                <li><strong>Storage</strong> sekmesinde <code>rotali-files</code> adında <strong>Public</strong> bir kova (bucket) oluşturun.</li>
                            </ol>
                        </div>

                        <div>
                            <label class="block font-black uppercase text-slate-700 mb-1">Project URL <span class="text-red-500">*</span></label>
                            <input type="text" id="cfg-supabase-url" value="${cfg.supabaseUrl || ''}" placeholder="https://xxxxxxxxxxxx.supabase.co" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:border-indigo-500">
                        </div>

                        <div>
                            <label class="block font-black uppercase text-slate-700 mb-1">Anon Public Key <span class="text-red-500">*</span></label>
                            <input type="password" id="cfg-supabase-key" value="${cfg.supabaseAnonKey || ''}" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:border-indigo-500">
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-black uppercase text-slate-700 mb-1">Storage Bucket</label>
                                <input type="text" id="cfg-supabase-bucket" value="${cfg.bucketName || 'rotali-files'}" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:border-indigo-500">
                            </div>
                            <div>
                                <label class="block font-black uppercase text-slate-700 mb-1">Veri Tablosu</label>
                                <input type="text" id="cfg-supabase-table" value="${cfg.tableName || 'materials'}" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:border-indigo-500">
                            </div>
                        </div>

                        <div id="cfg-test-status" class="hidden p-3 rounded-xl font-bold text-xs"></div>

                        <div class="flex items-center justify-between pt-2 border-t border-slate-100">
                            <button type="button" onclick="RotaliCloud.testConnectionUI()" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer">
                                🔌 Bağlantıyı Sına
                            </button>
                            <div class="flex items-center gap-2">
                                <button type="button" onclick="document.getElementById('rotali-cloud-settings-modal').remove()" class="px-4 py-2.5 text-slate-500 hover:text-slate-800 font-bold">
                                    Vazgeç
                                </button>
                                <button type="button" onclick="RotaliCloud.saveSettingsFromUI()" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-md transition-all cursor-pointer">
                                    💾 Kaydet ve Senkronize Et
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        },

        async testConnectionUI() {
            const statusBox = document.getElementById("cfg-test-status");
            const url = (document.getElementById("cfg-supabase-url").value || "").trim();
            const key = (document.getElementById("cfg-supabase-key").value || "").trim();
            const table = (document.getElementById("cfg-supabase-table").value || "materials").trim();

            if (!url || !key) {
                statusBox.className = "p-3 rounded-xl font-bold text-xs bg-amber-50 text-amber-800 border border-amber-200 block";
                statusBox.innerHTML = "⚠️ Lütfen hem Project URL hem de Anon Key alanlarını doldurun.";
                return;
            }

            statusBox.className = "p-3 rounded-xl font-bold text-xs bg-slate-100 text-slate-700 border border-slate-200 block";
            statusBox.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Supabase sunucusuna bağlanılıyor...`;

            try {
                if (typeof window.supabase === "undefined") {
                    throw new Error("Supabase kütüphanesi henüz yüklenmedi. İnternet bağlantınızı kontrol edin.");
                }
                const testClient = window.supabase.createClient(url, key);
                const { data, error } = await testClient.from(table).select("count", { count: "exact", head: true });
                if (error) throw error;

                statusBox.className = "p-3 rounded-xl font-bold text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 block";
                statusBox.innerHTML = `✅ Bağlantı Başarılı! Supabase '${table}' tablosuyla sorunsuz iletişim kuruldu.`;
            } catch (err) {
                statusBox.className = "p-3 rounded-xl font-bold text-xs bg-red-50 text-red-800 border border-red-200 block";
                statusBox.innerHTML = `❌ Bağlantı Başarısız: ${err.message || err}`;
            }
        },

        async saveSettingsFromUI() {
            const url = (document.getElementById("cfg-supabase-url").value || "").trim();
            const key = (document.getElementById("cfg-supabase-key").value || "").trim();
            const bucket = (document.getElementById("cfg-supabase-bucket").value || "rotali-files").trim();
            const table = (document.getElementById("cfg-supabase-table").value || "materials").trim();

            const ok = this.saveConfig(url, key, bucket, table);
            if (ok) {
                if (typeof showToast === "function") {
                    showToast("✅ Bulut bağlantısı kaydedildi! Veriler eşitleniyor...", "success");
                }
                document.getElementById("rotali-cloud-settings-modal").remove();
                
                // Anında senkronizasyonu tetikle
                if (typeof CloudSyncManager !== "undefined" && CloudSyncManager.syncWithCloud) {
                    await CloudSyncManager.syncWithCloud(true);
                }
                if (typeof handleRouteChange === "function") {
                    handleRouteChange({ preserveScroll: true });
                }
            } else {
                alert("Lütfen geçerli bir URL ve Anon Key giriniz.");
            }
        }
    };

    // İlk yüklemede istemciyi başlat
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            initClient();
            RotaliCloud.setupRealtimeListener();
        });
    } else {
        initClient();
        RotaliCloud.setupRealtimeListener();
    }
})();
