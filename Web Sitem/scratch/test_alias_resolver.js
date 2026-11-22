const fs = require('fs');
const seed = JSON.parse(fs.readFileSync('data/tubitak-seed-data.json', 'utf8'));
const store = JSON.parse(fs.readFileSync('data/tubitak-runtime-store.json', 'utf8'));
const runtimeRecords = store.records;

const CRITERION_ALIASES = {
    "c4_konumu": ["c1_location", "c5_konum_ada_parsel", "c2_tescil_konum"],
    "c5_yaptiran": ["c3_banisi"],
    "c7_mimari_tarz": ["c4_mimari", "c8_susleme_sanat", "c3_mimari_ozellik", "c1_mimari"],
    "c10_yapim_malzemesi": ["c6_kullanilan_malzeme"],
    "c11_plan": ["c7_plan_tipi"],
    "c14_restorasyon": ["c13_onarimlar"],
    "c15_kulturel_miras_tescil": ["c14_gunumuz_durumu"],
    "c18_kaynak": ["c16_kaynakca", "c18_degerlendirme"]
};

const ITEM_ALIASES = {
    "divrigi-ulu-camii": "divrigi-ulu-camii-darussifasi",
    "divrigi-ulu-camii-darussifasi": "divrigi-ulu-camii",
    "bilim-01-bircendi": "bircendi",
    "bircendi": "bilim-01-bircendi"
};

function getRecordWithAliases(itemId, critKey) {
    if (!itemId || !critKey) return null;
    const directKey = `${itemId}__${critKey}`;
    let rec = runtimeRecords[directKey];
    if (rec && rec.content && rec.content.trim().length > 0) return rec;

    const altItemId = ITEM_ALIASES[itemId];
    if (altItemId) {
        const altKey = `${altItemId}__${critKey}`;
        const altRec = runtimeRecords[altKey];
        if (altRec && altRec.content && altRec.content.trim().length > 0) return altRec;
    }

    const critAliases = CRITERION_ALIASES[critKey] || [];
    for (const aKey of critAliases) {
        const k1 = `${itemId}__${aKey}`;
        const r1 = runtimeRecords[k1];
        if (r1 && r1.content && r1.content.trim().length > 0) return r1;

        if (altItemId) {
            const k2 = `${altItemId}__${aKey}`;
            const r2 = runtimeRecords[k2];
            if (r2 && r2.content && r2.content.trim().length > 0) return r2;
        }
    }

    return rec || (altItemId ? runtimeRecords[`${altItemId}__${critKey}`] : null) || null;
}

// Test with Divrigi Ulu Camii and Cifte Minareli Medrese
console.log('Divrigi c4_konumu:', getRecordWithAliases('divrigi-ulu-camii', 'c4_konumu')?.content?.slice(0, 40));
console.log('Divrigi c5_yaptiran:', getRecordWithAliases('divrigi-ulu-camii', 'c5_yaptiran')?.content?.slice(0, 40));
console.log('Cifte Minareli c4_konumu:', getRecordWithAliases('cifte-minareli-medrese', 'c4_konumu')?.content?.slice(0, 40));
console.log('Kangal Merkez c1_yapi_adi:', getRecordWithAliases('kangal-merkez-camii', 'c1_yapi_adi')?.content?.slice(0, 40));
console.log('Altınyayla c1_yapi_adi:', getRecordWithAliases('altinyayla-merkez-camii', 'c1_yapi_adi')?.content?.slice(0, 40));
