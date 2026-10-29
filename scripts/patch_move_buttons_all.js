const fs = require('fs');
const path = require('path');

function addMoveButtonEverywhere(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Pattern 1: in renderCustomMaterialsSection
    const target1 = `<button type="button" onclick="event.stopPropagation(); editCustomMaterial('\${item.id}')" class="flex-1 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-xl border border-amber-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer" title="Düzenle / Konum Değiştir">`;
    const replacement1 = `<button type="button" onclick="event.stopPropagation(); openQuickMoveModal('\${item.id}')" class="py-1.5 px-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-200 transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95" title="Kategori veya Bölüm Değiştir (Taşı)">
                                            <i class="fa-solid fa-arrows-up-down-left-right text-[10px]"></i> Taşı
                                        </button>
                                        <button type="button" onclick="event.stopPropagation(); editCustomMaterial('\${item.id}')" class="flex-1 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-xl border border-amber-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer" title="Düzenle / Konum Değiştir">`;

    if (content.includes(target1)) {
        content = content.replace(target1, replacement1);
        console.log("Injected Taşı button in renderCustomMaterialsSection in:", filePath);
    }

    // Pattern 2: in renderGradeDersNotuAccordion (units and books)
    const target2 = `<button type="button" onclick="event.stopPropagation(); triggerEditMaterial('\${item.id}')" class="flex-1 py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs active:scale-95" title="Düzenle">`;
    const replacement2 = `<button type="button" onclick="event.stopPropagation(); openQuickMoveModal('\${item.id}')" class="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs active:scale-95" title="Kategori veya Bölüm Değiştir (Taşı)">
                                                                <i class="fa-solid fa-arrows-up-down-left-right text-[10px]"></i> Taşı
                                                            </button>
                                                            <button type="button" onclick="event.stopPropagation(); triggerEditMaterial('\${item.id}')" class="flex-1 py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs active:scale-95" title="Düzenle">`;

    // Only replace target2 if not preceded by openQuickMoveModal
    if (content.includes(target2)) {
        content = content.split(target2).join(replacement2);
        console.log("Replaced target2 with split/join in:", filePath);
    }

    fs.writeFileSync(filePath, content, 'utf8');
}

addMoveButtonEverywhere(path.join(__dirname, '..', 'js', 'app.js'));
addMoveButtonEverywhere(path.join(__dirname, '..', '..', 'js', 'app.js'));
