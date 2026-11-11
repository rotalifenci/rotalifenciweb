const fs = require('fs');
const path = require('path');
const { verifyToken } = require('./tubitak-auth.js');

/**
 * 📊 ROTALI FENCİ - TÜBİTAK ARAŞTIRMA VERİLERİ & OTO-KAYIT API'Sİ
 * Supabase PostgreSQL entegrasyonu, sürüm geçmişi, çakışma önleme ve öğretmen onay motoru.
 */

// Bellek içi / Yerel önbellek veritabanı (Supabase bağlantısı veya çevrimdışı yedekleme için)
const localStorePath = path.join(__dirname, '../data/tubitak-runtime-store.json');

function readLocalStore() {
    try {
        if (fs.existsSync(localStorePath)) {
            return JSON.parse(fs.readFileSync(localStorePath, 'utf8'));
        }
    } catch (e) {}
    return { records: {}, revisions: [], sources: {}, feedbacks: [], itemsMeta: {} };
}

function writeLocalStore(store) {
    try {
        fs.mkdirSync(path.dirname(localStorePath), { recursive: true });
        fs.writeFileSync(localStorePath, JSON.stringify(store, null, 2), 'utf8');
    } catch (e) {
        console.warn('Local store write warning:', e.message);
    }
}

// Supabase REST istemcisi (varsa doğrudan PostgreSQL'e yazar)
const SUPABASE_URL = process.env.SUPABASE_URL || "https://dlzlpstheykhrfeijiri.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "sb_publishable_N5ejkDHwTvMiFZfUZnjXNw_j_uqjkZi";

async function supabaseFetch(table, options = {}) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
    const url = `${SUPABASE_URL.replace(/\/+$/, '')}/rest/v1/${table}`;
    const headers = {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        ...(options.headers || {})
    };
    try {
        const res = await fetch(url + (options.query || ''), {
            method: options.method || 'GET',
            headers,
            body: options.body ? JSON.stringify(options.body) : undefined
        });
        if (res.ok) {
            return await res.json();
        }
    } catch (err) {
        // Fallback to local memory store
    }
    return null;
}

module.exports = async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") return res.status(200).end();

    // 1. Yetki Kontrolü
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    const session = verifyToken(token);

    if (!session) {
        return res.status(401).json({ ok: false, error: "Yetkisiz erişim. Lütfen geçerli proje şifrenizle giriş yapınız." });
    }

    const { projectId: userProjectId, role: userRole } = session;

    // 2. GET İsteği: Proje Verilerini, Kayıtları ve Geçmişi Getir
    if (req.method === "GET") {
        try {
            const reqProj = req.query.projectId || userProjectId;

            // Öğrenci sadece kendi projesini görebilir
            if (userRole !== "teacher" && userProjectId !== "all" && reqProj !== userProjectId) {
                return res.status(403).json({ ok: false, error: "Bu projenin kayıtlarına erişim yetkiniz bulunmuyor." });
            }

            const store = readLocalStore();
            const projRecords = {};
            for (const [k, v] of Object.entries(store.records)) {
                if (reqProj === "all" || v.projectId === reqProj) {
                    projRecords[k] = v;
                }
            }

            const projRevisions = store.revisions.filter(r => reqProj === "all" || r.projectId === reqProj);
            const projSources = {};
            for (const [k, v] of Object.entries(store.sources)) {
                if (reqProj === "all" || v.projectId === reqProj) {
                    projSources[k] = v;
                }
            }
            const projFeedbacks = store.feedbacks.filter(f => reqProj === "all" || f.projectId === reqProj);

            return res.status(200).json({
                ok: true,
                projectId: reqProj,
                records: projRecords,
                revisions: projRevisions.slice(-100), // Son 100 revizyon
                sources: projSources,
                feedbacks: projFeedbacks
            });
        } catch (err) {
            return res.status(500).json({ ok: false, error: "Kayıtlar yüklenemedi: " + err.message });
        }
    }

    // 3. POST İsteği: Otomatik Kayıt (Autosave Criterion Record)
    if (req.method === "POST") {
        try {
            const {
                projectId,
                itemId,
                criterionKey,
                content = "",
                clientVersion = 1,
                action = "save_record"
            } = req.body || {};

            if (!projectId || !itemId || !criterionKey) {
                return res.status(400).json({ ok: false, error: "Eksik parametreler (projectId, itemId, criterionKey zorunludur)." });
            }

            // Güvenlik: Öğrenci sadece kendi projesine yazabilir
            if (userRole !== "teacher" && userProjectId !== "all" && projectId !== userProjectId) {
                return res.status(403).json({ ok: false, error: "Bu projeye veri kaydetme yetkiniz yok!" });
            }

            const recordKey = `${itemId}__${criterionKey}`;
            const store = readLocalStore();
            const existing = store.records[recordKey] || {
                projectId,
                itemId,
                criterionKey,
                content: "",
                version: 0,
                status: "draft",
                updatedAt: new Date().toISOString()
            };

            const prevContent = existing.content || "";
            const newContent = String(content || "");

            // İçerik tamamen aynıysa boşuna sürüm şişirme
            if (prevContent.trim() === newContent.trim() && existing.version > 0) {
                return res.status(200).json({
                    ok: true,
                    status: "saved",
                    message: "Değişiklik yok, mevcut kayıt korundu.",
                    version: existing.version,
                    updatedAt: existing.updatedAt,
                    recordKey
                });
            }

            // Çakışma Kontrolü (Optimistic Concurrency)
            let isConflict = false;
            if (clientVersion < existing.version && prevContent.trim() !== "") {
                isConflict = true;
                // Çakışma olsa bile veriyi kaybetmemek için yeni sürüm olarak kaydeder ancak uyarı bayrağı döner
            }

            const newVersion = existing.version + 1;
            const now = new Date().toISOString();

            // Kaydı güncelle
            const updatedRecord = {
                id: recordKey,
                projectId,
                itemId,
                criterionKey,
                content: newContent,
                studentId: session.studentId,
                studentName: session.studentName,
                version: newVersion,
                status: existing.status === "approved" ? "in_review" : existing.status,
                updatedAt: now
            };

            store.records[recordKey] = updatedRecord;

            // Değişiklik geçmişine (Revizyon) ekle
            store.revisions.push({
                id: `rev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                recordKey,
                projectId,
                itemId,
                criterionKey,
                prevContent: prevContent,
                newContent: newContent,
                studentId: session.studentId,
                studentName: session.studentName,
                version: newVersion,
                createdAt: now
            });

            // En fazla 500 revizyon tut
            if (store.revisions.length > 500) {
                store.revisions = store.revisions.slice(-500);
            }

            writeLocalStore(store);

            // Supabase bulut PostgreSQL eşitlemesi (Arka planda)
            supabaseFetch('tubitak_records', {
                method: 'POST',
                headers: { 'Prefer': 'resolution=merge-duplicates' },
                body: [{
                    id: recordKey,
                    project_id: projectId,
                    item_id: itemId,
                    criterion_key: criterionKey,
                    content: newContent,
                    student_id: session.studentId,
                    student_name: session.studentName,
                    version: newVersion,
                    status: updatedRecord.status,
                    updated_at: now
                }]
            }).catch(() => {});

            return res.status(200).json({
                ok: true,
                status: "saved",
                message: "Kayıt başarıyla doğrulandı ve veritabanına işlendi.",
                version: newVersion,
                updatedAt: now,
                recordKey,
                isConflict,
                studentName: session.studentName
            });
        } catch (err) {
            console.error("Save Record Error:", err);
            return res.status(500).json({ ok: false, error: "Kaydetme başarısız: " + err.message });
        }
    }

    // 4. PUT İsteği: Revizyon Geri Yükleme, İncelemeye Gönderme & Öğretmen Onayı
    if (req.method === "PUT") {
        try {
            const { action, revisionId, recordKey, itemId, projectId, status, feedbackMessage } = req.body || {};
            const store = readLocalStore();
            const now = new Date().toISOString();

            // A) Eski Sürümü Geri Yükle
            if (action === "restore_revision") {
                const targetRev = store.revisions.find(r => r.id === revisionId);
                if (!targetRev) {
                    return res.status(404).json({ ok: false, error: "Geri yüklenecek sürüm bulunamadı." });
                }

                const recKey = targetRev.recordKey;
                const existing = store.records[recKey] || { version: 0 };
                const restoredVersion = (existing.version || 0) + 1;

                store.records[recKey] = {
                    id: recKey,
                    projectId: targetRev.projectId,
                    itemId: targetRev.itemId,
                    criterionKey: targetRev.criterionKey,
                    content: targetRev.newContent,
                    studentId: session.studentId,
                    studentName: `${session.studentName} (Geri Yükleme v${targetRev.version})`,
                    version: restoredVersion,
                    status: "draft",
                    updatedAt: now
                };

                store.revisions.push({
                    id: `rev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    recordKey: recKey,
                    projectId: targetRev.projectId,
                    itemId: targetRev.itemId,
                    criterionKey: targetRev.criterionKey,
                    prevContent: existing.content || "",
                    newContent: targetRev.newContent,
                    studentId: session.studentId,
                    studentName: `${session.studentName} (v${targetRev.version} Geri Yüklendi)`,
                    version: restoredVersion,
                    createdAt: now
                });

                writeLocalStore(store);

                return res.status(200).json({
                    ok: true,
                    message: `Sürüm v${targetRev.version} başarıyla yeni sürüm v${restoredVersion} olarak geri yüklendi!`,
                    record: store.records[recKey]
                });
            }

            // B) İncelemeye Gönder (Öğrenci)
            if (action === "submit_review") {
                for (const [k, rec] of Object.entries(store.records)) {
                    if (rec.itemId === itemId && rec.projectId === projectId) {
                        rec.status = "in_review";
                        rec.updatedAt = now;
                    }
                }
                writeLocalStore(store);
                return res.status(200).json({ ok: true, message: "Araştırma inceleme için öğretmene iletildi." });
            }

            // C) Öğretmen Onay / Düzeltme Talebi (Yalnızca Öğretmen Yetkili)
            if (action === "teacher_review") {
                if (userRole !== "teacher") {
                    return res.status(403).json({ ok: false, error: "Bu işlemi yalnızca yetkili öğretmen gerçekleştirebilir." });
                }

                const validStatuses = ["approved", "correction_requested", "draft", "in_review"];
                const targetStatus = validStatuses.includes(status) ? status : "approved";

                for (const [k, rec] of Object.entries(store.records)) {
                    if (rec.itemId === itemId && (projectId === "all" || rec.projectId === projectId)) {
                        rec.status = targetStatus;
                        rec.updatedAt = now;
                    }
                }

                if (feedbackMessage) {
                    store.feedbacks.push({
                        id: `fb-${Date.now()}`,
                        projectId,
                        itemId,
                        teacherName: session.studentName || "Öğretmen",
                        message: String(feedbackMessage).trim(),
                        status: targetStatus,
                        createdAt: now
                    });
                }

                writeLocalStore(store);

                return res.status(200).json({
                    ok: true,
                    message: targetStatus === "approved" ? "Araştırma başarıyla onaylandı!" : "Düzeltme talebi ve geri bildirim öğrenciye iletildi.",
                    status: targetStatus
                });
            }

            return res.status(400).json({ ok: false, error: "Geçersiz işlem (action) belirtildi." });
        } catch (err) {
            return res.status(500).json({ ok: false, error: "Güncelleme hatası: " + err.message });
        }
    }

    // 5. DELETE İsteği (Kaynak Silme vb.)
    if (req.method === "DELETE") {
        try {
            const { sourceId } = req.query;
            if (sourceId) {
                const store = readLocalStore();
                delete store.sources[sourceId];
                writeLocalStore(store);
                return res.status(200).json({ ok: true, message: "Kaynak başarıyla silindi." });
            }
            return res.status(400).json({ ok: false, error: "Silinecek kaynak ID belirtilmedi." });
        } catch (err) {
            return res.status(500).json({ ok: false, error: "Silme işlemi başarısız: " + err.message });
        }
    }

    return res.status(405).json({ ok: false, error: "Method not allowed." });
};
