const fs = require('fs');
const path = require('path');

const appPath = path.resolve(__dirname, '../js/app.js');
let appJs = fs.readFileSync(appPath, 'utf8');

// 1. Replace window.CODEWEEK_ACTIVITIES definition with window.DEFAULT_CODEWEEK_ACTIVITIES and helper
const targetStart = 'window.CODEWEEK_ACTIVITIES = [';
const targetEnd = 'window.projectFilterData = function() {';

const idxStart = appJs.indexOf(targetStart);
const idxEnd = appJs.indexOf(targetEnd);

if (idxStart === -1 || idxEnd === -1) {
    console.error('Target not found!', { idxStart, idxEnd });
    process.exit(1);
}

// Extract the array content between targetStart and targetEnd
let activitiesArrayCode = appJs.slice(idxStart + 'window.CODEWEEK_ACTIVITIES = ['.length, idxEnd).trim();
// Remove trailing '];'
if (activitiesArrayCode.endsWith('];')) {
    activitiesArrayCode = activitiesArrayCode.slice(0, -2).trim();
}

const newDefinitions = `window.DEFAULT_CODEWEEK_ACTIVITIES = [
${activitiesArrayCode}
];

// 🌟 Özelleştirilmiş ve Yönetici Tarafından Düzenlenmiş Kod Haftası Etkinliklerini Yükle
window.getCodeWeekActivitiesWithCustom = function() {
    let customMap = {};
    try {
        const stored = localStorage.getItem("rotali_custom_codeweek_activities");
        if (stored) customMap = JSON.parse(stored);
    } catch(e) {
        console.error("Custom codeweek parse error:", e);
    }
    return window.DEFAULT_CODEWEEK_ACTIVITIES.map(act => {
        const ovr = customMap && customMap[act.id];
        if (!ovr) return { ...act, sections: [...(act.sections || [])] };
        return {
            ...act,
            title: (ovr.title !== undefined && ovr.title.trim() !== '') ? ovr.title : act.title,
            subtitle: (ovr.subtitle !== undefined && ovr.subtitle.trim() !== '') ? ovr.subtitle : act.subtitle,
            badge: (ovr.badge !== undefined && ovr.badge.trim() !== '') ? ovr.badge : act.badge,
            grade: (ovr.grade !== undefined && ovr.grade.trim() !== '') ? ovr.grade : act.grade,
            outcome: (ovr.outcome !== undefined && ovr.outcome.trim() !== '') ? ovr.outcome : act.outcome,
            description: (ovr.description !== undefined && ovr.description.trim() !== '') ? ovr.description : act.description,
            image: (ovr.image !== undefined && ovr.image.trim() !== '') ? ovr.image : act.image,
            sections: (Array.isArray(ovr.sections) && ovr.sections.length > 0) ? ovr.sections : [...(act.sections || [])],
            motto: (ovr.motto !== undefined && ovr.motto.trim() !== '') ? ovr.motto : act.motto
        };
    });
};

window.CODEWEEK_ACTIVITIES = window.getCodeWeekActivitiesWithCustom();

`;

appJs = appJs.slice(0, idxStart) + newDefinitions + appJs.slice(idxEnd);

fs.writeFileSync(appPath, appJs, 'utf8');
console.log('Successfully updated DEFAULT_CODEWEEK_ACTIVITIES and getCodeWeekActivitiesWithCustom');
