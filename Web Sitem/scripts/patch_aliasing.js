const fs = require('fs');

['js/tubitak-research.js', '../js/tubitak-research.js'].forEach(p => {
    let code = fs.readFileSync(p, 'utf8');

    // 1. In renderActiveItemForm
    const target1 = 'const saved = runtimeRecords[recordKey];';
    const rep1 = 'const saved = runtimeRecords[recordKey] || (item.id === "divrigi-ulu-camii" ? runtimeRecords[`divrigi-ulu-camii-darussifasi__${crit.key}`] : null) || (item.id === "divrigi-ulu-camii-darussifasi" ? runtimeRecords[`divrigi-ulu-camii__${crit.key}`] : null) || (item.id === "bilim-01-bircendi" ? runtimeRecords[`bircendi__${crit.key}`] : null) || (item.id === "bircendi" ? runtimeRecords[`bilim-01-bircendi__${crit.key}`] : null);';

    // 2. In countItemFilledCriteria
    const target2 = 'const rec = runtimeRecords[`${evId}__${crit.key}`];';
    const rep2 = 'const rec = runtimeRecords[`${evId}__${crit.key}`] || (evId === "divrigi-ulu-camii" ? runtimeRecords[`divrigi-ulu-camii-darussifasi__${crit.key}`] : null) || (evId === "divrigi-ulu-camii-darussifasi" ? runtimeRecords[`divrigi-ulu-camii__${crit.key}`] : null) || (evId === "bilim-01-bircendi" ? runtimeRecords[`bircendi__${crit.key}`] : null) || (evId === "bircendi" ? runtimeRecords[`bilim-01-bircendi__${crit.key}`] : null);';

    if (!code.includes(target1) || !code.includes(target2)) {
        console.error('Targets not found in', p);
    } else {
        code = code.replace(target1, rep1).replace(target2, rep2);
        fs.writeFileSync(p, code, 'utf8');
        console.log('Successfully updated aliasing in', p);
    }
});
