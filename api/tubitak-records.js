const fs = require('fs');
const path = require('path');
const { verifyToken } = require('./tubitak-auth.js');
const {
    getCloudStore,
    saveCloudStore,
    getCloudSyncHealth
} = require('./_tubitak-cloud.js');
const {
    buildAsciiFallbackFilename,
    generateMonumentDocxBuffer,
    generateAllMonumentsZipBuffer,
    generateSiyerYearDocxBuffer,
    generateAllSiyerYearsZipBuffer,
    generateComparisonDocxBuffer
} = require('./_tubitak-docx.js');
const {
    MONUMENTS_CLASSIFICATION,
    COMPARISON_GROUPS
} = require('./_tubitak-comparison.js');

/**
 * 📊 ROTALI FENCİ - TÜBİTAK ARAŞTIRMA VERİLERİ & OTO-KAYIT API'Sİ
 * GitHub Gist tabanlı kalıcı bulut veritabanı, Supabase köprüsü,
 * sürüm geçmişi, çakışma önleme ve öğretmen onay motoru.
 */

const seedDataPath = path.join(__dirname, '../data/tubitak-seed-data.json');

const _cachedProjectSeeds = {};
function getProjectSeed(projectId = 'proje-tarih') {
    const targetId = projectId || 'proje-tarih';
    if (_cachedProjectSeeds[targetId]) return _cachedProjectSeeds[targetId];
    try {
        if (fs.existsSync(seedDataPath)) {
            const parsed = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));
            const proj = parsed?.projects?.[targetId];
            if (proj) {
                const students = Array.isArray(proj.studentTeam) ? proj.studentTeam : [];
                const itemMap = {};
                (proj.items || []).forEach((it) => {
                    itemMap[it.id] = it.assignedStudentId || null;
                });
                _cachedProjectSeeds[targetId] = { students, itemMap };
                return _cachedProjectSeeds[targetId];
            }
        }
    } catch (e) {}
    return { students: [], itemMap: {} };
}

function normalizeTrName(str) {
    return String(str || '')
        .toLocaleLowerCase('tr-TR')
        .replace(/ı/g, 'i')
        .replace(/İ/gi, 'i')
        .replace(/ş/g, 's')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/\s+/g, ' ')
        .trim();
}

function resolveSessionStudentId(session, projectId = 'proje-tarih') {
    const { students } = getProjectSeed(projectId);
    const rawId = String(session?.studentId || '').trim();
    if (students.some((s) => s.id === rawId)) return rawId;
    const normName = normalizeTrName(session?.studentName || '');
    if (!normName) return null;
    for (const s of students) {
        const sNorm = normalizeTrName(s.name);
        const firstWord = sNorm.split(' ')[0];
        if (normName === sNorm || (firstWord && normName.includes(firstWord))) {
            return s.id;
        }
    }
    return null;
}

function getEffectiveAssignedStudentId(store, projectId, itemId) {
    if (itemId === undefined) {
        itemId = projectId;
        projectId = 'proje-tarih';
    }
    const baseId = projectId === 'proje-siyer' ? String(itemId || '').split('__ev_')[0] : itemId;
    const metaKey = `${projectId}_assignments`;
    const custom = store?.itemsMeta?.[metaKey]?.[baseId]?.assignedStudentId;
    if (custom) return custom;
    const { itemMap } = getProjectSeed(projectId);
    return itemMap[baseId] || null;
}

// İsteğe bağlı Supabase REST istemcisi (Varsa ikincil yedek olarak PostgreSQL'e yazar)
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
    } catch (err) {}
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
            const forceFresh = req.query.fresh === "true" || userRole === "teacher";
            const store = await getCloudStore({ forceFresh });

            // Dışa Aktarma (Word .docx / Toplu ZIP / Karşılaştırma Raporu)
            const exportDocxMode = req.query.exportDocx;
            if (exportDocxMode === "comparison") {
                const comparisonId = String(req.query.comparisonId || '').trim();
                const comparison = (store.comparisons && store.comparisons[comparisonId]) || null;
                if (!comparison) {
                    return res.status(404).json({ ok: false, error: "İstenen karşılaştırma kaydı bulunamadı." });
                }
                const docxResult = await generateComparisonDocxBuffer(comparison, MONUMENTS_CLASSIFICATION);
                if (!docxResult) {
                    return res.status(500).json({ ok: false, error: "Karşılaştırma Word belgesi oluşturulamadı." });
                }
                const asciiName = buildAsciiFallbackFilename(docxResult.filename);
                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
                res.setHeader("Content-Disposition", `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(docxResult.filename)}`);
                res.setHeader("X-Export-Paragraph-Count", String(docxResult.paragraphCount));
                return res.status(200).send(docxResult.buffer);
            }

            if (exportDocxMode === "single" || exportDocxMode === "all") {
                if (userRole !== "teacher") {
                    return res.status(403).json({ ok: false, error: "Word belgesi indirme işlemi yalnızca yetkili öğretmen hesabından yapılabilir." });
                }

                const exportProjId = (reqProj === "proje-bilim" || reqProj === "proje-tarih" || reqProj === "proje-siyer") ? reqProj : "proje-tarih";
                const parsedSeed = fs.existsSync(seedDataPath) ? JSON.parse(fs.readFileSync(seedDataPath, 'utf8')) : null;
                const projObj = parsedSeed?.projects?.[exportProjId];
                if (!projObj || !Array.isArray(projObj.items) || !Array.isArray(projObj.criteriaList)) {
                    return res.status(500).json({ ok: false, error: "Proje veri şablonu okunamadı." });
                }

                const mergedRecords = {};
                for (const [k, v] of Object.entries(store.records || {})) {
                    if (v && v.projectId === exportProjId) {
                        mergedRecords[k] = v;
                    }
                }

                if (exportDocxMode === "single") {
                    const targetItemId = String(req.query.itemId || '').trim();
                    const item = projObj.items.find((it) => it.id === targetItemId || (exportProjId === "proje-siyer" && String(it.year) === targetItemId));
                    if (!item) {
                        return res.status(404).json({ ok: false, error: "İstenen araştırma kaydı bulunamadı." });
                    }
                    let docxResult;
                    if (exportProjId === "proje-siyer") {
                        const extraIds = (store.itemsMeta && store.itemsMeta['proje-siyer_events'] && store.itemsMeta['proje-siyer_events'][item.id]) || [];
                        const eventIds = [item.id, ...extraIds.filter((id) => id && id !== item.id)];
                        docxResult = await generateSiyerYearDocxBuffer(item, eventIds, projObj.criteriaList, mergedRecords);
                    } else {
                        docxResult = await generateMonumentDocxBuffer(item, projObj.criteriaList, mergedRecords);
                    }
                    if (!docxResult) {
                        return res.status(404).json({ ok: false, error: "Bu kayıt için veritabanında kaydedilmiş araştırma metni bulunamadı." });
                    }
                    const asciiName = buildAsciiFallbackFilename(docxResult.filename);
                    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
                    res.setHeader("Content-Disposition", `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(docxResult.filename)}`);
                    res.setHeader("X-Export-Paragraph-Count", String(docxResult.paragraphCount));
                    return res.status(200).send(docxResult.buffer);
                }

                const zipName = exportProjId === "proje-bilim"
                    ? "Matematik_Tarihinde_Bilim_Insanlari_Arastirma_Metinleri.zip"
                    : (exportProjId === "proje-siyer"
                        ? "Siyer_571_632_Arastirma_Metinleri.zip"
                        : "Sivas_Tarihi_Eserler_Arastirma_Metinleri.zip");
                const zipResult = exportProjId === "proje-siyer"
                    ? await generateAllSiyerYearsZipBuffer(
                        projObj.items,
                        (store.itemsMeta && store.itemsMeta['proje-siyer_events']) || {},
                        projObj.criteriaList,
                        mergedRecords,
                        zipName
                    )
                    : await generateAllMonumentsZipBuffer(projObj.items, projObj.criteriaList, mergedRecords, zipName);
                if (!zipResult.buffer) {
                    return res.status(404).json({ ok: false, error: "Hiçbir kayıt için veritabanında kaydedilmiş araştırma metni bulunamadı." });
                }
                res.setHeader("Content-Type", "application/zip");
                res.setHeader("Content-Disposition", `attachment; filename="${zipResult.filename}"`);
                res.setHeader("X-Export-Included-Count", String(zipResult.included.length));
                res.setHeader("X-Export-Skipped-Count", String(zipResult.skipped.length));
                if (zipResult.skipped.length > 0) {
                    res.setHeader("X-Export-Skipped-Years", zipResult.skipped.slice(0, 65).join(', '));
                }
                return res.status(200).send(zipResult.buffer);
            }

            // Öğrenci sadece kendi projesini görebilir
            if (userRole !== "teacher" && userProjectId !== "all" && reqProj !== userProjectId) {
                return res.status(403).json({ ok: false, error: "Bu projenin kayıtlarına erişim yetkiniz bulunmuyor." });
            }

            const projRecords = {};
            for (const [k, v] of Object.entries(store.records || {})) {
                if (reqProj === "all" || v.projectId === reqProj) {
                    projRecords[k] = v;
                }
            }

            const projRevisions = (store.revisions || []).filter(r => reqProj === "all" || r.projectId === reqProj);
            const projSources = {};
            for (const [k, v] of Object.entries(store.sources || {})) {
                if (reqProj === "all" || v.projectId === reqProj) {
                    projSources[k] = v;
                }
            }
            const projFeedbacks = (store.feedbacks || []).filter(f => reqProj === "all" || f.projectId === reqProj);

            const projAssignments = reqProj === "all"
                ? {
                    ...((store.itemsMeta && store.itemsMeta['proje-tarih_assignments']) || {}),
                    ...((store.itemsMeta && store.itemsMeta['proje-bilim_assignments']) || {}),
                    ...((store.itemsMeta && store.itemsMeta['proje-siyer_assignments']) || {})
                }
                : ((store.itemsMeta && store.itemsMeta[`${reqProj}_assignments`]) || {});

            const includeSiyerMeta = reqProj === "all" || reqProj === "proje-siyer";
            return res.status(200).json({
                ok: true,
                projectId: reqProj,
                records: projRecords,
                revisions: projRevisions.slice(-100), // Son 100 revizyon
                sources: projSources,
                feedbacks: projFeedbacks,
                assignments: projAssignments,
                siyerEvents: includeSiyerMeta ? ((store.itemsMeta && store.itemsMeta['proje-siyer_events']) || {}) : {},
                siyerYearFlags: includeSiyerMeta ? ((store.itemsMeta && store.itemsMeta['proje-siyer_year_flags']) || {}) : {},
                comparisons: store.comparisons || {},
                syncHealth: getCloudSyncHealth()
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
            const store = await getCloudStore();

            // Güvenlik: Proje 1, Proje 2 ve Proje 3'te tanımlı öğrenci yalnızca kendi atanmış kayıtlarını düzenleyebilir
            if (userRole !== "teacher" && (projectId === "proje-tarih" || projectId === "proje-bilim" || projectId === "proje-siyer")) {
                const sessionStuId = resolveSessionStudentId(session, projectId);
                const assignedStuId = getEffectiveAssignedStudentId(store, projectId, itemId);
                if (sessionStuId && assignedStuId && sessionStuId !== assignedStuId) {
                    return res.status(403).json({ ok: false, error: "Bu kayıt başka bir öğrenciye atanmıştır. Yalnızca kendi atanmış kayıtlarınızı düzenleyebilirsiniz." });
                }
            }

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
            if (!store.revisions) store.revisions = [];
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

            if (store.revisions.length > 500) {
                store.revisions = store.revisions.slice(-500);
            }

            // KALICI BULUT VERİTABANINA YAZ (GitHub Gist)
            // Başarılı teyit alınmadan kullanıcıya "Kaydedildi" dönülmez!
            await saveCloudStore(store);

            // Supabase bulut PostgreSQL eşitlemesi (İkincil yedek - arkaplanda)
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
                message: "Kayıt başarıyla doğrulandı ve kalıcı veritabanına işlendi.",
                version: newVersion,
                updatedAt: now,
                recordKey,
                isConflict,
                studentName: session.studentName
            });
        } catch (err) {
            console.error("Save Record Error:", err);
            return res.status(500).json({ ok: false, status: "error", error: "Kayıt bulut veritabanına yazılamadı: " + err.message });
        }
    }

    // 4. PUT İsteği: Revizyon Geri Yükleme, İncelemeye Gönderme & Öğretmen Onayı
    if (req.method === "PUT") {
        try {
            const { action, revisionId, recordKey, itemId, projectId, status, feedbackMessage } = req.body || {};
            const store = await getCloudStore();
            const now = new Date().toISOString();

            // A) Eski Sürümü Geri Yükle
            if (action === "restore_revision") {
                const targetRev = (store.revisions || []).find(r => r.id === revisionId);
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

                await saveCloudStore(store);

                return res.status(200).json({
                    ok: true,
                    message: `Sürüm v${targetRev.version} başarıyla yeni sürüm v${restoredVersion} olarak geri yüklendi!`,
                    record: store.records[recKey]
                });
            }

            // B) İncelemeye Gönder (Öğrenci)
            if (action === "submit_review") {
                if (userRole !== "teacher" && (projectId === "proje-tarih" || projectId === "proje-bilim" || projectId === "proje-siyer")) {
                    const sessionStuId = resolveSessionStudentId(session, projectId);
                    const assignedStuId = getEffectiveAssignedStudentId(store, projectId, itemId);
                    if (sessionStuId && assignedStuId && sessionStuId !== assignedStuId) {
                        return res.status(403).json({ ok: false, error: "Başka bir öğrenciye ait kaydı incelemeye gönderemezsiniz." });
                    }
                }
                for (const [k, rec] of Object.entries(store.records || {})) {
                    const isMatchingItem = rec.itemId === itemId || (projectId === "proje-siyer" && String(rec.itemId || '').startsWith(`${itemId}__ev_`));
                    if (isMatchingItem && rec.projectId === projectId) {
                        rec.status = "in_review";
                        rec.updatedAt = now;
                    }
                }
                await saveCloudStore(store);
                return res.status(200).json({ ok: true, message: "Araştırma inceleme için öğretmene iletildi." });
            }

            // B2) Öğretmen Görev Ataması Güncelleme (Yalnızca Öğretmen)
            if (action === "reassign_item") {
                if (userRole !== "teacher") {
                    return res.status(403).json({ ok: false, error: "Görev atama değişikliğini yalnızca yetkili öğretmen yapabilir." });
                }
                const targetProjId = (projectId === "proje-bilim" || projectId === "proje-tarih" || projectId === "proje-siyer") ? projectId : "proje-tarih";
                const { assignedStudentId } = req.body || {};
                const { students, itemMap } = getProjectSeed(targetProjId);
                if (!itemId || !Object.prototype.hasOwnProperty.call(itemMap, itemId)) {
                    return res.status(404).json({ ok: false, error: "Atanacak kayıt bulunamadı." });
                }
                if (!students.some((s) => s.id === assignedStudentId)) {
                    return res.status(400).json({ ok: false, error: "Geçersiz öğrenci seçimi." });
                }
                const metaKey = `${targetProjId}_assignments`;
                if (!store.itemsMeta) store.itemsMeta = {};
                if (!store.itemsMeta[metaKey]) store.itemsMeta[metaKey] = {};
                store.itemsMeta[metaKey][itemId] = {
                    itemId,
                    assignedStudentId,
                    updatedAt: now,
                    assignedBy: session.studentName || "Öğretmen"
                };
                await saveCloudStore(store);
                return res.status(200).json({
                    ok: true,
                    message: "Görev ataması güncellendi.",
                    assignments: store.itemsMeta[metaKey]
                });
            }

            // C) Öğretmen Onay / Düzeltme Talebi (Yalnızca Öğretmen Yetkili)
            if (action === "teacher_review") {
                if (userRole !== "teacher") {
                    return res.status(403).json({ ok: false, error: "Bu işlemi yalnızca yetkili öğretmen gerçekleştirebilir." });
                }

                const validStatuses = ["approved", "correction_requested", "draft", "in_review"];
                const targetStatus = validStatuses.includes(status) ? status : "approved";

                for (const [k, rec] of Object.entries(store.records || {})) {
                    const isMatchingItem = rec.itemId === itemId || (projectId === "proje-siyer" && String(rec.itemId || '').startsWith(`${itemId}__ev_`));
                    if (isMatchingItem && (projectId === "all" || rec.projectId === projectId)) {
                        rec.status = targetStatus;
                        rec.updatedAt = now;
                    }
                }

                if (feedbackMessage) {
                    if (!store.feedbacks) store.feedbacks = [];
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

                await saveCloudStore(store);

                return res.status(200).json({
                    ok: true,
                    message: targetStatus === "approved" ? "Araştırma başarıyla onaylandı!" : "Düzeltme talebi ve geri bildirim öğrenciye iletildi.",
                    status: targetStatus
                });
            }

            // D) Proje 3 (Siyer) Yıla Yeni Olay Ekleme
            if (action === "add_siyer_event") {
                const yearId = String(req.body?.yearId || itemId || '').trim();
                const { itemMap } = getProjectSeed('proje-siyer');
                if (!yearId || !Object.prototype.hasOwnProperty.call(itemMap, yearId)) {
                    return res.status(404).json({ ok: false, error: "Olay eklenecek yıl bulunamadı." });
                }
                if (userRole !== "teacher") {
                    const sessionStuId = resolveSessionStudentId(session, 'proje-siyer');
                    const assignedStuId = getEffectiveAssignedStudentId(store, 'proje-siyer', yearId);
                    if (sessionStuId && assignedStuId && sessionStuId !== assignedStuId) {
                        return res.status(403).json({ ok: false, error: "Bu yıl başka bir öğrenciye atanmıştır." });
                    }
                }
                if (!store.itemsMeta) store.itemsMeta = {};
                if (!store.itemsMeta['proje-siyer_events']) store.itemsMeta['proje-siyer_events'] = {};
                const list = Array.isArray(store.itemsMeta['proje-siyer_events'][yearId])
                    ? [...store.itemsMeta['proje-siyer_events'][yearId]]
                    : [];
                let nextIdx = 2;
                while (list.includes(`${yearId}__ev_${nextIdx}`)) {
                    nextIdx++;
                }
                const newEventId = `${yearId}__ev_${nextIdx}`;
                list.push(newEventId);
                store.itemsMeta['proje-siyer_events'][yearId] = list;
                await saveCloudStore(store);
                return res.status(200).json({
                    ok: true,
                    eventId: newEventId,
                    yearId,
                    siyerEvents: store.itemsMeta['proje-siyer_events']
                });
            }

            // E) Proje 3 (Siyer) Olayı Başka Yıla Taşıma
            if (action === "move_siyer_event") {
                const eventId = String(req.body?.eventId || itemId || '').trim();
                const fromYearId = String(req.body?.fromYearId || eventId.split('__ev_')[0] || '').trim();
                const toYearId = String(req.body?.toYearId || '').trim();
                const { itemMap } = getProjectSeed('proje-siyer');

                if (!eventId || !fromYearId || !toYearId || fromYearId === toYearId) {
                    return res.status(400).json({ ok: false, error: "Geçersiz kaynak veya hedef yıl seçimi." });
                }
                if (!Object.prototype.hasOwnProperty.call(itemMap, fromYearId) || !Object.prototype.hasOwnProperty.call(itemMap, toYearId)) {
                    return res.status(404).json({ ok: false, error: "Kaynak veya hedef yıl sistemde bulunamadı." });
                }
                if (userRole !== "teacher") {
                    const sessionStuId = resolveSessionStudentId(session, 'proje-siyer');
                    const fromStuId = getEffectiveAssignedStudentId(store, 'proje-siyer', fromYearId);
                    const toStuId = getEffectiveAssignedStudentId(store, 'proje-siyer', toYearId);
                    if (sessionStuId && ((fromStuId && sessionStuId !== fromStuId) || (toStuId && sessionStuId !== toStuId))) {
                        return res.status(403).json({ ok: false, error: "Yalnızca kendi atanmış yıllarınız arasında olay taşıyabilirsiniz." });
                    }
                }

                if (!store.itemsMeta) store.itemsMeta = {};
                if (!store.itemsMeta['proje-siyer_events']) store.itemsMeta['proje-siyer_events'] = {};
                const eventsMeta = store.itemsMeta['proje-siyer_events'];

                // Hedef yılda varsayılan slot dolu mu kontrol et
                const hasDefaultContent = Object.values(store.records || {}).some(
                    (rec) => rec && rec.projectId === 'proje-siyer' && rec.itemId === toYearId && String(rec.content || '').trim().length > 0
                );
                let newEventId = toYearId;
                if (hasDefaultContent) {
                    const toList = Array.isArray(eventsMeta[toYearId]) ? [...eventsMeta[toYearId]] : [];
                    let nextIdx = 2;
                    while (toList.includes(`${toYearId}__ev_${nextIdx}`)) {
                        nextIdx++;
                    }
                    newEventId = `${toYearId}__ev_${nextIdx}`;
                    toList.push(newEventId);
                    eventsMeta[toYearId] = toList;
                }

                // Kayıtları taşı
                const movedRecords = {};
                for (const [k, rec] of Object.entries(store.records || {})) {
                    if (rec && rec.projectId === 'proje-siyer' && rec.itemId === eventId) {
                        const newKey = `${newEventId}__${rec.criterionKey}`;
                        movedRecords[newKey] = {
                            ...rec,
                            id: newKey,
                            itemId: newEventId,
                            updatedAt: now
                        };
                        delete store.records[k];
                    }
                }
                Object.assign(store.records, movedRecords);

                // Kaynakçaları taşı
                for (const src of Object.values(store.sources || {})) {
                    if (src && src.projectId === 'proje-siyer' && src.itemId === eventId) {
                        src.itemId = newEventId;
                    }
                }

                // Kaynak yıl ek olay listesinden çıkar
                if (eventId !== fromYearId && Array.isArray(eventsMeta[fromYearId])) {
                    eventsMeta[fromYearId] = eventsMeta[fromYearId].filter((id) => id !== eventId);
                }

                await saveCloudStore(store);

                const projRecords = {};
                for (const [k, v] of Object.entries(store.records || {})) {
                    if (v && v.projectId === 'proje-siyer') projRecords[k] = v;
                }
                const projSources = {};
                for (const [k, v] of Object.entries(store.sources || {})) {
                    if (v && v.projectId === 'proje-siyer') projSources[k] = v;
                }

                return res.status(200).json({
                    ok: true,
                    oldEventId: eventId,
                    newEventId,
                    fromYearId,
                    toYearId,
                    siyerEvents: eventsMeta,
                    records: projRecords,
                    sources: projSources
                });
            }

            // F) Proje 3 (Siyer) Öğretmen Yıl Durum İşareti ("Araştırıldı – Olay tespit edilemedi")
            if (action === "mark_siyer_year_flag") {
                if (userRole !== "teacher") {
                    return res.status(403).json({ ok: false, error: "Bu işlemi yalnızca yetkili öğretmen gerçekleştirebilir." });
                }
                const yearId = String(itemId || req.body?.yearId || '').trim();
                const flag = String(req.body?.flag || '').trim();
                const { itemMap } = getProjectSeed('proje-siyer');
                if (!yearId || !Object.prototype.hasOwnProperty.call(itemMap, yearId)) {
                    return res.status(404).json({ ok: false, error: "İşaretlenecek yıl bulunamadı." });
                }
                if (!store.itemsMeta) store.itemsMeta = {};
                if (!store.itemsMeta['proje-siyer_year_flags']) store.itemsMeta['proje-siyer_year_flags'] = {};
                if (flag === 'no_event_found') {
                    store.itemsMeta['proje-siyer_year_flags'][yearId] = {
                        status: 'no_event_found',
                        label: 'Araştırıldı – Olay tespit edilemedi',
                        updatedAt: now,
                        updatedBy: session.studentName || 'Öğretmen'
                    };
                } else {
                    delete store.itemsMeta['proje-siyer_year_flags'][yearId];
                }
                await saveCloudStore(store);
                return res.status(200).json({
                    ok: true,
                    siyerYearFlags: store.itemsMeta['proje-siyer_year_flags']
                });
            }

            // 11. Karşılaştırma Kaydet (Save Comparison)
            if (action === "save_comparison") {
                const compData = req.body?.comparison;
                if (!compData || typeof compData !== 'object') {
                    return res.status(400).json({ ok: false, error: "Geçersiz karşılaştırma verisi gönderildi." });
                }
                const compId = String(compData.id || `comp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`).trim();
                if (!store.comparisons) store.comparisons = {};

                const existing = store.comparisons[compId];
                if (existing && userRole !== "teacher" && existing.studentId && existing.studentId !== userStudentId) {
                    return res.status(403).json({ ok: false, error: "Yalnızca kendi karşılaştırma araştırmanızı düzenleyebilirsiniz." });
                }

                const monIds = Array.isArray(compData.monumentIds) ? compData.monumentIds.slice(0, 3) : [];
                if (monIds.length < 2) {
                    return res.status(400).json({ ok: false, error: "Karşılaştırma için en az 2 tarihî eser seçilmelidir." });
                }

                const comparison = {
                    id: compId,
                    projectId: "proje-tarih",
                    groupId: String(compData.groupId || 'genel').trim(),
                    groupTitle: String(compData.groupTitle || 'Tarihî Yapılar').trim(),
                    monumentIds: monIds,
                    studentId: existing?.studentId || userStudentId || 'ogrenci',
                    studentName: existing?.studentName || session.studentName || 'Öğrenci',
                    question: String(compData.question || '').trim(),
                    similarities: String(compData.similarities || '').trim(),
                    differences: String(compData.differences || '').trim(),
                    continuity: String(compData.continuity || '').trim(),
                    evidenceAnalysis: String(compData.evidenceAnalysis || '').trim(),
                    conclusion: String(compData.conclusion || '').trim(),
                    tableData: (compData.tableData && typeof compData.tableData === 'object') ? compData.tableData : {},
                    evidences: Array.isArray(compData.evidences) ? compData.evidences : [],
                    status: (compData.status === 'submitted' || compData.status === 'draft') ? compData.status : (existing?.status || 'draft'),
                    rubric: existing?.rubric || null,
                    createdAt: existing?.createdAt || now,
                    updatedAt: now
                };

                store.comparisons[compId] = comparison;

                // Revizyon kaydı
                if (!store.revisions) store.revisions = [];
                store.revisions.push({
                    id: `rev_comp_${Date.now()}`,
                    recordKey: `comp_${compId}`,
                    projectId: "proje-tarih",
                    itemId: compId,
                    criterionKey: "comparative_analysis",
                    content: comparison.conclusion || comparison.question,
                    studentId: comparison.studentId,
                    studentName: comparison.studentName,
                    version: ((existing?.version || 0) + 1),
                    createdAt: now
                });
                if (store.revisions.length > 500) {
                    store.revisions = store.revisions.slice(-500);
                }

                await saveCloudStore(store);
                return res.status(200).json({
                    ok: true,
                    comparison,
                    syncHealth: getCloudSyncHealth()
                });
            }

            // 12. Karşılaştırma Sil (Delete Comparison)
            if (action === "delete_comparison") {
                const compId = String(req.body?.comparisonId || '').trim();
                if (!compId) {
                    return res.status(400).json({ ok: false, error: "Silinecek karşılaştırma ID'si belirtilmedi." });
                }
                if (!store.comparisons || !store.comparisons[compId]) {
                    return res.status(404).json({ ok: false, error: "Silinecek karşılaştırma bulunamadı." });
                }
                const targetComp = store.comparisons[compId];
                if (userRole !== "teacher" && targetComp.studentId && targetComp.studentId !== userStudentId) {
                    return res.status(403).json({ ok: false, error: "Yalnızca kendi karşılaştırma taslağınızı silebilirsiniz." });
                }
                delete store.comparisons[compId];
                await saveCloudStore(store);
                return res.status(200).json({ ok: true, deletedId: compId });
            }

            // 13. Öğretmen Karşılaştırma İnceleme & Rubrik Değerlendirme (Teacher Review Comparison)
            if (action === "review_comparison") {
                if (userRole !== "teacher") {
                    return res.status(403).json({ ok: false, error: "Bu işlemi yalnızca yetkili öğretmen gerçekleştirebilir." });
                }
                const compId = String(req.body?.comparisonId || '').trim();
                if (!compId || !store.comparisons || !store.comparisons[compId]) {
                    return res.status(404).json({ ok: false, error: "Değerlendirilecek karşılaştırma bulunamadı." });
                }

                const comp = store.comparisons[compId];
                const newStatus = String(req.body?.status || '').trim();
                if (['approved', 'revision_requested', 'submitted', 'draft'].includes(newStatus)) {
                    comp.status = newStatus;
                }

                const rubricInput = req.body?.rubric || {};
                const d1 = Math.max(1, Math.min(4, Number(rubricInput.dim1_accuracy) || 3));
                const d2 = Math.max(1, Math.min(4, Number(rubricInput.dim2_evidence) || 3));
                const d3 = Math.max(1, Math.min(4, Number(rubricInput.dim3_comparison) || 3));
                const d4 = Math.max(1, Math.min(4, Number(rubricInput.dim4_continuity) || 3));
                const d5 = Math.max(1, Math.min(4, Number(rubricInput.dim5_conclusion) || 3));
                const totalScore = d1 + d2 + d3 + d4 + d5;

                comp.rubric = {
                    dim1_accuracy: d1,
                    dim2_evidence: d2,
                    dim3_comparison: d3,
                    dim4_continuity: d4,
                    dim5_conclusion: d5,
                    total: totalScore,
                    feedback: String(req.body?.feedback || rubricInput.feedback || '').trim(),
                    reviewedAt: now,
                    reviewedBy: session.studentName || 'Danışman Öğretmen'
                };
                comp.updatedAt = now;

                await saveCloudStore(store);
                return res.status(200).json({
                    ok: true,
                    comparison: comp,
                    syncHealth: getCloudSyncHealth()
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
                const store = await getCloudStore();
                if (store.sources && store.sources[sourceId]) {
                    delete store.sources[sourceId];
                    await saveCloudStore(store);
                    return res.status(200).json({ ok: true, message: "Kaynak başarıyla silindi." });
                }
                return res.status(404).json({ ok: false, error: "Silinecek kaynak bulunamadı." });
            }
            return res.status(400).json({ ok: false, error: "Silinecek kaynak ID belirtilmedi." });
        } catch (err) {
            return res.status(500).json({ ok: false, error: "Silme işlemi başarısız: " + err.message });
        }
    }

    return res.status(405).json({ ok: false, error: "Method not allowed." });
};
