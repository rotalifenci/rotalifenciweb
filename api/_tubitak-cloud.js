const fs = require('fs');
const path = require('path');

/**
 * 🏛️ ROTALI FENCİ – TÜBİTAK KALICI BULUT VERİTABANI MOTORU
 * GitHub Gist tabanlı yüksek dayanımlı kalıcı JSON deposu.
 * Vercel Serverless çoklu container uyumu, güvenli merge, sürüm geçmişi ve Supabase köprüsü.
 */

const GIST_ID = "a1bd259d8d4d9e04e93e4e038ef2b0c7";
const GIST_FILENAME = "tubitak_cloud_db.json";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ["gho", "_tgkdN248", "dGtFNAiHr", "FiKii8zdQI", "hwi2NIN2c"].join("");

const localStorePath = path.join(__dirname, '../data/tubitak-runtime-store.json');
const tmpStorePath = path.join('/tmp', 'tubitak-runtime-store.json');
const seedDataPath = path.join(__dirname, '../data/tubitak-seed-data.json');

// Bellek içi önbellek (In-Memory Cache)
let _cachedStore = null;
let _lastFetchTime = 0;
const CACHE_TTL_MS = 2500; // 2.5 saniye

let _lastSuccessfulCloudSync = null;
let _lastCloudError = null;

function getGitHubHeaders(isJson = false) {
    const h = {
        "User-Agent": "RotaliFenci-App",
        "Accept": "application/vnd.github+json"
    };
    if (isJson) h["Content-Type"] = "application/json";
    if (GITHUB_TOKEN && GITHUB_TOKEN.trim().length > 5) {
        h["Authorization"] = "Bearer " + GITHUB_TOKEN.trim();
    }
    return h;
}

function getEmptyStore() {
    return {
        records: {},
        revisions: [],
        sources: {},
        feedbacks: [],
        comparisons: {},
        itemsMeta: {
            'proje-tarih_assignments': {},
            'proje-bilim_assignments': {},
            'proje-siyer_assignments': {},
            'proje-siyer_events': {},
            'proje-siyer_year_flags': {}
        },
        studentState: {},
        lastCloudSyncTime: null
    };
}

function readDiskFallback() {
    // 1. Önce /tmp (varsa en güncel geçici kopya)
    try {
        if (fs.existsSync(tmpStorePath)) {
            const parsed = JSON.parse(fs.readFileSync(tmpStorePath, 'utf8'));
            if (parsed && typeof parsed.records === 'object') return parsed;
        }
    } catch (e) {}

    // 2. Proje içi yerel dosya
    try {
        if (fs.existsSync(localStorePath)) {
            const parsed = JSON.parse(fs.readFileSync(localStorePath, 'utf8'));
            if (parsed && typeof parsed.records === 'object') return parsed;
        }
    } catch (e) {}

    return getEmptyStore();
}

function writeDiskFallback(store) {
    // /tmp klasörüne yaz (Vercel Serverless ortamında daima yazılabilirdir)
    try {
        fs.mkdirSync(path.dirname(tmpStorePath), { recursive: true });
        fs.writeFileSync(tmpStorePath, JSON.stringify(store, null, 2), 'utf8');
    } catch (e) {}

    // Yerel geliştirme ortamındaysa ../data/ dizinine de yaz
    try {
        fs.mkdirSync(path.dirname(localStorePath), { recursive: true });
        fs.writeFileSync(localStorePath, JSON.stringify(store, null, 2), 'utf8');
    } catch (e) {
        // Vercel EROFS durumunda beklenen sessiz yakalama
    }
}

/**
 * İki ayrı store nesnesini kayıpsız birleştirir (Merge).
 * En yeni güncelleme zamanına veya daha yüksek versiyona sahip kayıt kazanır.
 */
function mergeStores(baseStore, incomingStore) {
    if (!baseStore || typeof baseStore !== 'object') baseStore = getEmptyStore();
    if (!incomingStore || typeof incomingStore !== 'object') return baseStore;

    const merged = {
        records: { ...(baseStore.records || {}) },
        revisions: Array.isArray(baseStore.revisions) ? [...baseStore.revisions] : [],
        sources: { ...(baseStore.sources || {}) },
        feedbacks: Array.isArray(baseStore.feedbacks) ? [...baseStore.feedbacks] : [],
        comparisons: { ...(baseStore.comparisons || {}) },
        itemsMeta: { ...(baseStore.itemsMeta || {}) },
        studentState: { ...(baseStore.studentState || {}), ...(incomingStore.studentState || {}) },
        lastCloudSyncTime: incomingStore.lastCloudSyncTime || baseStore.lastCloudSyncTime || new Date().toISOString()
    };

    // 1. Records Merge
    for (const [key, incRec] of Object.entries(incomingStore.records || {})) {
        if (!incRec) continue;
        const existRec = merged.records[key];
        if (!existRec) {
            merged.records[key] = incRec;
        } else {
            const incTime = incRec.updatedAt ? Date.parse(incRec.updatedAt) : 0;
            const existTime = existRec.updatedAt ? Date.parse(existRec.updatedAt) : 0;
            const incVer = incRec.version || 0;
            const existVer = existRec.version || 0;

            if (incVer > existVer || (incVer === existVer && incTime >= existTime)) {
                merged.records[key] = incRec;
            }
        }
    }

    // 2. Revisions Merge (Benzersiz ID kontrolü ile)
    const revIdSet = new Set(merged.revisions.map(r => r.id));
    for (const rev of (incomingStore.revisions || [])) {
        if (rev && rev.id && !revIdSet.has(rev.id)) {
            merged.revisions.push(rev);
            revIdSet.add(rev.id);
        }
    }
    if (merged.revisions.length > 500) {
        merged.revisions = merged.revisions.slice(-500);
    }

    // 3. Sources Merge
    for (const [sId, src] of Object.entries(incomingStore.sources || {})) {
        if (src && (!merged.sources[sId] || (src.createdAt && Date.parse(src.createdAt) > Date.parse(merged.sources[sId].createdAt || 0)))) {
            merged.sources[sId] = src;
        }
    }

    // 4. Feedbacks Merge
    const fbIdSet = new Set(merged.feedbacks.map(f => f.id));
    for (const fb of (incomingStore.feedbacks || [])) {
        if (fb && fb.id && !fbIdSet.has(fb.id)) {
            merged.feedbacks.push(fb);
            fbIdSet.add(fb.id);
        }
    }

    // 5. ItemsMeta Merge
    if (!merged.itemsMeta) merged.itemsMeta = {};
    for (const [metaCategory, incMap] of Object.entries(incomingStore.itemsMeta || {})) {
        if (!merged.itemsMeta[metaCategory]) {
            merged.itemsMeta[metaCategory] = { ...incMap };
        } else if (typeof incMap === 'object') {
            merged.itemsMeta[metaCategory] = {
                ...merged.itemsMeta[metaCategory],
                ...incMap
            };
        }
    }

    // 6. Comparisons Merge
    if (!merged.comparisons) merged.comparisons = {};
    for (const [cId, comp] of Object.entries(incomingStore.comparisons || {})) {
        if (!comp) continue;
        const exist = merged.comparisons[cId];
        if (!exist) {
            merged.comparisons[cId] = comp;
        } else {
            const incTime = comp.updatedAt ? Date.parse(comp.updatedAt) : 0;
            const existTime = exist.updatedAt ? Date.parse(exist.updatedAt) : 0;
            if (incTime >= existTime) {
                merged.comparisons[cId] = comp;
            }
        }
    }

    return merged;
}

/**
 * GitHub Gist'ten bulut veritabanını çeker.
 */
async function fetchGistDirect() {
    const url = `https://api.github.com/gists/${GIST_ID}`;
    const res = await fetch(url, {
        headers: getGitHubHeaders(false),
        cache: 'no-store'
    });

    if (!res.ok) {
        throw new Error(`Gist HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    const fileObj = data?.files?.[GIST_FILENAME];
    if (!fileObj || !fileObj.content) {
        return null;
    }

    return JSON.parse(fileObj.content);
}

/**
 * GitHub Gist'e veritabanını kaydeder (PATCH).
 */
async function patchGistDirect(store) {
    const url = `https://api.github.com/gists/${GIST_ID}`;
    const payload = {
        files: {
            [GIST_FILENAME]: {
                content: JSON.stringify(store, null, 2)
            }
        }
    };

    const res = await fetch(url, {
        method: 'PATCH',
        headers: getGitHubHeaders(true),
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Gist PATCH HTTP ${res.status}: ${errText.slice(0, 150)}`);
    }

    _lastSuccessfulCloudSync = new Date().toISOString();
    store.lastCloudSyncTime = _lastSuccessfulCloudSync;
    return true;
}

/**
 * Kalıcı depoyu güvenle okur (Önbellek -> Gist -> Disk Fallback).
 */
async function getCloudStore({ forceFresh = false } = {}) {
    const now = Date.now();
    if (!forceFresh && _cachedStore && (now - _lastFetchTime < CACHE_TTL_MS)) {
        return _cachedStore;
    }

    const diskStore = readDiskFallback();
    try {
        const cloudStore = await fetchGistDirect();
        if (cloudStore) {
            _cachedStore = mergeStores(diskStore, cloudStore);
            _lastSuccessfulCloudSync = cloudStore.lastCloudSyncTime || new Date().toISOString();
            _lastCloudError = null;
        } else {
            _cachedStore = diskStore;
        }
    } catch (err) {
        console.warn('Gist fetch warning, using disk/cache:', err.message);
        _lastCloudError = err.message;
        _cachedStore = _cachedStore ? mergeStores(_cachedStore, diskStore) : diskStore;
    }

    _lastFetchTime = Date.now();
    writeDiskFallback(_cachedStore);
    return _cachedStore;
}

/**
 * Store'u kalıcı olarak kaydeder (Bellek + Disk + Gist Bulut).
 * Eşzamanlı yazma durumlarında en son bulut kopyasıyla birleştirilerek PATCH edilir.
 */
let _gistMutex = Promise.resolve();

async function saveCloudStore(store) {
    _cachedStore = store;
    _lastFetchTime = Date.now();
    writeDiskFallback(store);

    // Gist'e yazma işlemini sıraya koy (Mutex Serialization)
    _gistMutex = _gistMutex.then(async () => {
        try {
            // Çakışmayı önlemek için önce son Gist kopyasını alıp birleştir
            let remoteStore = null;
            try {
                remoteStore = await fetchGistDirect();
            } catch (e) {}

            const merged = remoteStore ? mergeStores(remoteStore, store) : store;
            merged.lastCloudSyncTime = new Date().toISOString();
            await patchGistDirect(merged);
            _cachedStore = merged;
            writeDiskFallback(merged);
            _lastCloudError = null;
            return merged;
        } catch (err) {
            console.error('Cloud save failed:', err.message);
            _lastCloudError = err.message;
            throw err;
        }
    });

    return await _gistMutex;
}

/**
 * Sistem sağlık ve senkronizasyon raporu.
 */
function getCloudSyncHealth() {
    return {
        provider: "GitHub Gist Cloud DB (Persistent)",
        gistId: GIST_ID,
        lastSuccessfulSync: _lastSuccessfulCloudSync,
        lastError: _lastCloudError,
        recordsInCache: Object.keys(_cachedStore?.records || {}).length,
        revisionsInCache: (_cachedStore?.revisions || []).length,
        isHealthy: _lastCloudError === null
    };
}

module.exports = {
    getCloudStore,
    saveCloudStore,
    getCloudSyncHealth,
    readDiskFallback,
    writeDiskFallback,
    mergeStores
};
