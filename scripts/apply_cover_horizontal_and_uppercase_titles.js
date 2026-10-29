const fs = require('fs');
const path = require('path');
const vm = require('vm');

const appJsPath = path.join(__dirname, '..', 'js', 'app.js');
let rawContent = fs.readFileSync(appJsPath, 'utf8');

const isCRLF = rawContent.includes('\r\n');
let lines = rawContent.replace(/\r\n/g, '\n').split('\n');

console.log('Total lines in js/app.js:', lines.length);

// 0. ADD openMaterialCoverModal helper at the top if not present
let helperAdded = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('function openMaterialCoverModal')) {
        helperAdded = true;
        break;
    }
}
if (!helperAdded) {
    const helperLines = [
        '// 🖼️ Materyal Kapak Görselini Tam Ekran Yatay Görüntüleyici',
        'function openMaterialCoverModal(itemId) {',
        '    let cover = "assets/kapak-5.jpg";',
        '    let title = "Materyal Kapağı";',
        '    if (typeof getCustomMaterialsList === "function") {',
        '        const customList = getCustomMaterialsList();',
        '        const found = customList.find(m => m && m.id === itemId);',
        '        if (found) {',
        '            cover = (typeof resolveMaterialCover === "function" ? resolveMaterialCover(found) : "") || found.cover || found.kapakResmi || found.imageUrl || cover;',
        '            title = found.title || title;',
        '        }',
        '    }',
        '    if (itemId && itemId.startsWith("book-")) {',
        '        const g = itemId.replace("book-", "");',
        '        cover = "assets/kapak-" + g + ".jpg";',
        '        title = g + ". Sınıf Fen Bilimleri MEB Ders Kitabı";',
        '    }',
        '    if (typeof openInPageDocumentModal === "function") {',
        '        openInPageDocumentModal(cover, title, title + ".jpg", true);',
        '    }',
        '}',
        'window.openMaterialCoverModal = openMaterialCoverModal;',
        ''
    ];
    lines.unshift(...helperLines);
    console.log('✔ openMaterialCoverModal fonksiyonu app.js başına eklendi.');
}

// 1. UPDATE material card blocks
for (let i = 0; i < lines.length; i++) {
    // A. allKitapItems card (Ders Kitabı & Ünite PDF'leri)
    if (lines[i].includes('aspect-[4/3] max-h-56 bg-slate-100')) {
        console.log('Updating allKitapItems at line', i + 1);
        if (lines[i-3] && lines[i-3].includes('<h4')) {
            lines[i-3] = lines[i-3].replace('class="', 'class="uppercase tracking-tight ');
        }
        if (lines[i-2] && lines[i-2].includes('${item.title}')) {
            lines[i-2] = lines[i-2].replace('${item.title}', "${String(item.title || '').toLocaleUpperCase('tr-TR')}");
        }
        lines[i] = lines[i].replace('aspect-[4/3] max-h-56 bg-slate-100', 'aspect-[16/9] max-h-56 sm:max-h-60 bg-slate-950')
                           .replace('border-slate-200', 'border-slate-800 shadow-inner group')
                           .replace('onclick="${openFunc}"', 'onclick="openMaterialCoverModal(\'${item.id}\')" title="Kapağı Tam Ekran Yatay Görüntüle"');
        
        lines[i+1] = lines[i+1].replace('object-contain p-2', 'w-full h-full object-contain group-hover:scale-105 transition-transform duration-300') +
            `\n                                            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2.5">\n` +
            `                                                <span class="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase flex items-center gap-1.5 shadow-md"><i class="fa-solid fa-expand text-[10px]"></i> Tam Ekran Gör</span>\n` +
            `                                                <span class="text-[10px] font-bold text-slate-300 drop-shadow">Yatay Kapak</span>\n` +
            `                                            </div>`;
    }

    // B. unitCustomNotes (1-7. Ünite Not ve Sunumları) & renderPortalSection
    if (lines[i].includes('aspect-[4/3] max-h-56 sm:max-h-64 bg-slate-100')) {
        console.log('Updating unitCustomNotes / portal card at line', i + 1);
        if (lines[i-5] && lines[i-5].includes('<h4')) {
            lines[i-5] = lines[i-5].replace('class="', 'class="uppercase tracking-tight ');
        }
        if (lines[i-4] && lines[i-4].includes('${item.title}')) {
            lines[i-4] = lines[i-4].replace('${item.title}', "${String(item.title || '').toLocaleUpperCase('tr-TR')}");
        }
        lines[i] = lines[i].replace('aspect-[4/3] max-h-56 sm:max-h-64 bg-slate-100', 'aspect-[16/9] max-h-56 sm:max-h-60 bg-slate-950')
                           .replace('border-slate-200/60', 'border-slate-800 shadow-inner group')
                           .replace('onclick="openOrDownloadMaterial(\'${item.id}\')"', 'onclick="openMaterialCoverModal(\'${item.id}\')" title="Kapağı Tam Ekran Yatay Görüntüle"');
        
        lines[i+1] = lines[i+1].replace('object-contain p-2', 'w-full h-full object-contain group-hover:scale-105 transition-transform duration-300') +
            `\n                                                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2.5">\n` +
            `                                                            <span class="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase flex items-center gap-1.5 shadow-md"><i class="fa-solid fa-expand text-[10px]"></i> Tam Ekran Gör</span>\n` +
            `                                                            <span class="text-[10px] font-bold text-slate-300 drop-shadow">Yatay Kapak</span>\n` +
            `                                                        </div>`;
    }
}

let content = lines.join('\n');

// 2. UPDATE CodeWeek cards (aspect-[4/3] to aspect-[16/9] and uppercase title)
content = content.replace(/class="relative rounded-2xl overflow-hidden mb-4 bg-slate-950 border border-slate-200\/80 aspect-\[4\/3\]/g, 'class="relative rounded-2xl overflow-hidden mb-4 bg-slate-950 border border-slate-200/80 aspect-[16/9]');
content = content.replace(/<h3 class="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors mb-1\.5 leading-snug" x-text="act\.title"><\/h3>/g, '<h3 class="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors mb-1.5 leading-snug uppercase tracking-tight" x-text="act.title ? act.title.toLocaleUpperCase(\'tr-TR\') : \'\'"></h3>');
content = content.replace(/<h3 class="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors mb-1\.5 leading-snug" x-text="act\.title"><\/h3>/g, '<h3 class="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors mb-1.5 leading-snug uppercase tracking-tight" x-text="act.title ? act.title.toLocaleUpperCase(\'tr-TR\') : \'\'"></h3>');
content = content.replace(/<h3 class="text-base sm:text-lg font-black text-slate-900 group-hover:text-purple-700 transition-colors mb-1\.5 leading-snug" x-text="act\.title"><\/h3>/g, '<h3 class="text-base sm:text-lg font-black text-slate-900 group-hover:text-purple-700 transition-colors mb-1.5 leading-snug uppercase tracking-tight" x-text="act.title ? act.title.toLocaleUpperCase(\'tr-TR\') : \'\'"></h3>');

// 3. UPDATE Modal Title Banners to UPPERCASE
content = content.replace(
    `<h3 class="text-xs sm:text-sm font-black truncate max-w-[160px] sm:max-w-md">\${docTitle}</h3>`,
    `<h3 class="text-xs sm:text-sm font-black truncate max-w-[160px] sm:max-w-md uppercase tracking-wide">\${String(docTitle || '').toLocaleUpperCase('tr-TR')}</h3>`
);

content = content.replace(
    `<h3 id="book-modal-title" class="text-xs sm:text-sm font-black truncate max-w-[120px] sm:max-w-xs md:max-w-md text-white">\${bookTitle}</h3>`,
    `<h3 id="book-modal-title" class="text-xs sm:text-sm font-black truncate max-w-[120px] sm:max-w-xs md:max-w-md text-white uppercase tracking-wide">\${String(bookTitle || '').toLocaleUpperCase('tr-TR')}</h3>`
);

// 4. UPDATE other material titles across the site to UPPERCASE
content = content.replace(
    `<h4 class="text-base font-black text-slate-900 mb-2 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">\${item.title}</h4>`,
    `<h4 class="text-base font-black text-slate-900 mb-2 leading-snug group-hover:text-red-600 transition-colors line-clamp-2 uppercase tracking-tight">\${String(item.title || '').toLocaleUpperCase('tr-TR')}</h4>`
);

content = content.replace(
    `<h3 class="text-base font-black text-slate-900 leading-snug group-hover:text-red-600 transition-colors mb-2 line-clamp-2">\n                                            \${item.title}\n                                        </h3>`,
    `<h3 class="text-base font-black text-slate-900 leading-snug group-hover:text-red-600 transition-colors mb-2 line-clamp-2 uppercase tracking-tight">\n                                            \${String(item.title || '').toLocaleUpperCase('tr-TR')}\n                                        </h3>`
);

content = content.replace(
    `<h5 class="text-base font-black text-slate-900 mb-1.5 group-hover:text-emerald-600 transition-colors">\${item.title}</h5>`,
    `<h5 class="text-base font-black text-slate-900 mb-1.5 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">\${String(item.title || '').toLocaleUpperCase('tr-TR')}</h5>`
);

content = content.replace(
    `<h5 class="text-sm font-black text-slate-900 mb-1.5 leading-snug group-hover:\${cfg.colorText} transition-colors">\n                                                        \${item.title}\n                                                    </h5>`,
    `<h5 class="text-sm font-black text-slate-900 mb-1.5 leading-snug group-hover:\${cfg.colorText} transition-colors uppercase tracking-tight">\n                                                        \${String(item.title || '').toLocaleUpperCase('tr-TR')}\n                                                    </h5>`
);

content = content.replace(
    `<h5 class="text-sm font-black text-slate-900 mb-1.5 group-hover:text-fuchsia-700 transition-colors">\${item.title}</h5>`,
    `<h5 class="text-sm font-black text-slate-900 mb-1.5 group-hover:text-fuchsia-700 transition-colors uppercase tracking-tight">\${String(item.title || '').toLocaleUpperCase('tr-TR')}</h5>`
);

content = content.replace(
    `<h5 class="text-base font-black text-slate-900 mb-1.5 group-hover:text-emerald-700 transition-colors">\${item.title}</h5>`,
    `<h5 class="text-base font-black text-slate-900 mb-1.5 group-hover:text-emerald-700 transition-colors uppercase tracking-tight">\${String(item.title || '').toLocaleUpperCase('tr-TR')}</h5>`
);

// 5. UPDATE other mat-preview-box containers from tall h-56/h-64 to horizontal aspect-[16/9]
content = content.replace(
    /class="mat-preview-box relative w-full h-56 sm:h-64 bg-gradient-to-b from-slate-100 to-slate-200\/90 p-2\.5 rounded-2xl overflow-hidden mb-3 border border-slate-200\/80/g,
    'class="mat-preview-box relative w-full aspect-[16/9] max-h-56 sm:max-h-60 bg-slate-950 rounded-2xl overflow-hidden mb-3 border border-slate-800 shadow-inner'
);
content = content.replace(
    /class="mat-preview-box relative w-full h-52 sm:h-60 bg-gradient-to-b from-slate-100 to-slate-200\/90 p-2\.5 rounded-2xl overflow-hidden mb-3 border border-slate-200\/80/g,
    'class="mat-preview-box relative w-full aspect-[16/9] max-h-56 sm:max-h-60 bg-slate-950 rounded-2xl overflow-hidden mb-3 border border-slate-800 shadow-inner'
);
content = content.replace(
    /class="mat-preview-box relative w-full h-64 sm:h-72 bg-gradient-to-b from-slate-100 to-slate-200\/90 p-2\.5 rounded-2xl overflow-hidden mb-3 border border-slate-200\/80/g,
    'class="mat-preview-box relative w-full aspect-[16/9] max-h-56 sm:max-h-60 bg-slate-950 rounded-2xl overflow-hidden mb-3 border border-slate-800 shadow-inner'
);

// 6. Verify syntax with vm.Script
console.log('Verifying syntax with vm.Script...');
new vm.Script(content);
console.log('Syntax OK!');

// Restore line endings if originally CRLF
if (isCRLF) {
    content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(appJsPath, content, 'utf8');
console.log('js/app.js başarıyla güncellendi! Yeni boyut:', content.length);
