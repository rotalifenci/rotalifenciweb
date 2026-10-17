import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update openFullScreenPresentationModal
old_modal_start = """async function openFullScreenPresentationModal(item) {
    if (!item) return;

    let targetUrl = item.fileUrl || item.downloadUrl || item.rawUrl || "";
    if (targetUrl && !targetUrl.startsWith("http") && !targetUrl.startsWith("data:") && !targetUrl.startsWith("blob:") && targetUrl !== "#") {
        try {
            targetUrl = new URL(targetUrl, window.location.origin + "/").href;
        } catch (e) {}
    }
    let downloadUrl = targetUrl;
    const fileId = item.id || "";
    const fileName = item.fileName || item.title || "sunum.pptx";
    const fileTitle = item.title || fileName || "Ders Sunumu";

    if (typeof RotaliDB !== "undefined" && RotaliDB.getFile && fileId) {
        try {
            const record = await RotaliDB.getFile(fileId);
            if (record && record.blob) {
                downloadUrl = URL.createObjectURL(record.blob);
            }
        } catch (e) {}
    }

    const slides = getPresentationSlidesForMaterial(item);
    const isEmbeddablePresentation = targetUrl && targetUrl.startsWith("http") && (
        targetUrl.includes("drive.google.com/presentation") ||
        targetUrl.includes("canva.com") ||
        targetUrl.includes("slides.google.com") ||
        /\\.pptx?(\\?|$)/i.test(targetUrl)
    );
    presentationModalState = {
        item: {
            ...item,
            title: fileTitle,
            fileName: fileName,
            downloadUrl: downloadUrl,
            rawUrl: targetUrl
        },
        currentSlide: 1,
        totalSlides: slides.length,
        slides: slides,
        viewMode: isEmbeddablePresentation ? "embed" : "slides",
        solutionRevealed: false
    };

    renderFullScreenPresentationModal();
    initPresentationKeyboardListeners();

    try {
        const modalEl = document.getElementById("fullscreen-presentation-modal");
        if (modalEl && modalEl.requestFullscreen) {
            modalEl.requestFullscreen().catch(() => {});
        }
    } catch(e) {}
}"""

new_modal_start = """async function openFullScreenPresentationModal(item) {
    if (!item) return;

    let targetUrl = item.fileUrl || item.downloadUrl || item.rawUrl || "";
    if (targetUrl && !targetUrl.startsWith("http") && !targetUrl.startsWith("data:") && !targetUrl.startsWith("blob:") && targetUrl !== "#") {
        try {
            targetUrl = new URL(targetUrl, window.location.origin + "/").href;
        } catch (e) {}
    }
    let downloadUrl = targetUrl;
    const fileId = item.id || "";
    const fileName = item.fileName || item.title || "sunum.pptx";
    const fileTitle = item.title || fileName || "Ders Sunumu";

    if (typeof RotaliDB !== "undefined" && RotaliDB.getFile && fileId) {
        try {
            const record = await RotaliDB.getFile(fileId);
            if (record && record.blob) {
                downloadUrl = URL.createObjectURL(record.blob);
            }
        } catch (e) {}
    }

    const isHtmlEmbed = !!(item.isHtmlEmbed || (targetUrl && (targetUrl.includes(".html") || targetUrl.endsWith(".html"))) || (fileName && fileName.endsWith(".html")));
    const slides = isHtmlEmbed ? [] : getPresentationSlidesForMaterial(item);
    const isEmbeddablePresentation = !isHtmlEmbed && targetUrl && targetUrl.startsWith("http") && (
        targetUrl.includes("drive.google.com/presentation") ||
        targetUrl.includes("canva.com") ||
        targetUrl.includes("slides.google.com") ||
        /\\.pptx?(\\?|$)/i.test(targetUrl)
    );
    presentationModalState = {
        item: {
            ...item,
            title: fileTitle,
            fileName: fileName,
            downloadUrl: downloadUrl,
            rawUrl: targetUrl
        },
        currentSlide: 1,
        totalSlides: isHtmlEmbed ? 41 : slides.length,
        slides: slides,
        viewMode: isHtmlEmbed ? "html" : (isEmbeddablePresentation ? "embed" : "slides"),
        isHtmlEmbed: isHtmlEmbed,
        solutionRevealed: false
    };

    renderFullScreenPresentationModal();
    initPresentationKeyboardListeners();
}"""

if old_modal_start in code:
    code = code.replace(old_modal_start, new_modal_start)
    print("SUCCESS: Replaced openFullScreenPresentationModal!")
else:
    print("WARNING: Could not find exact old_modal_start!")

# 2. Add sendPresentationCommand
send_cmd_fn = """
function sendPresentationCommand(cmd, arg) {
    const iframe = document.getElementById("presentation-html-frame");
    if (iframe && iframe.contentWindow) {
        try {
            if (typeof iframe.contentWindow[cmd] === "function") {
                iframe.contentWindow[cmd](arg);
                return;
            }
        } catch (e) {}
        try {
            iframe.contentWindow.postMessage({ type: "ROTALI_SLIDE_CMD", command: cmd, arg: arg }, "*");
        } catch (e) {}
    }
}
"""

if "function sendPresentationCommand" not in code:
    code = code.replace("function renderFullScreenPresentationModal() {", send_cmd_fn + "\nfunction renderFullScreenPresentationModal() {")
    print("SUCCESS: Injected sendPresentationCommand!")

# 3. Replace bodyHtml and header/footer inside renderFullScreenPresentationModal
old_render_block = """    let bodyHtml = "";
    if (viewMode === "embed" && isWebUrl) {
        bodyHtml = `
            <div class="flex-1 w-full h-full p-2 bg-slate-950 flex flex-col items-center justify-center">
                <iframe src="${googleDocsViewerUrl}" class="w-full h-full rounded-2xl border border-slate-800 shadow-2xl bg-white" allow="autoplay; fullscreen; encrypted-media"></iframe>
            </div>
        `;
    } else {"""

new_render_block = """    const isHtmlEmbed = !!(presentationModalState.isHtmlEmbed || (item.rawUrl && item.rawUrl.includes(".html")));

    let bodyHtml = "";
    if (isHtmlEmbed) {
        bodyHtml = `
            <div class="flex-1 w-full h-full relative bg-slate-950 flex items-center justify-center p-0 overflow-hidden">
                <iframe id="presentation-html-frame" src="${item.rawUrl}" class="w-full h-full border-0 bg-black" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowfullscreen></iframe>
            </div>
        `;
    } else if (viewMode === "embed" && isWebUrl) {
        bodyHtml = `
            <div class="flex-1 w-full h-full p-2 bg-slate-950 flex flex-col items-center justify-center">
                <iframe src="${googleDocsViewerUrl}" class="w-full h-full rounded-2xl border border-slate-800 shadow-2xl bg-white" allow="autoplay; fullscreen; encrypted-media"></iframe>
            </div>
        `;
    } else {"""

if old_render_block in code:
    code = code.replace(old_render_block, new_render_block)
    print("SUCCESS: Updated bodyHtml inside renderFullScreenPresentationModal!")
else:
    print("WARNING: Could not find exact old_render_block!")

# 4. Update the modal Header & Footer HTML in renderFullScreenPresentationModal
old_modal_markup = """            <div class="flex items-center gap-1.5 sm:gap-2">
                <button type="button" onclick="changePresentationSlide(-1)" class="p-1.5 sm:px-3 sm:py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 cursor-pointer ${currentSlide === 1 ? 'opacity-30 pointer-events-none' : ''}">
                    <i class="fa-solid fa-chevron-left"></i> <span class="hidden sm:inline">Önceki</span>
                </button>
                <span class="px-3 py-1 bg-slate-800 text-amber-400 font-black text-xs rounded-full border border-slate-700 shadow-inner">
                    Slayt ${currentSlide} / ${totalSlides}
                </span>
                <button type="button" onclick="changePresentationSlide(1)" class="p-1.5 sm:px-3 sm:py-1 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs cursor-pointer ${currentSlide === totalSlides ? 'opacity-30 pointer-events-none' : ''}">
                    <span class="hidden sm:inline">Sonraki</span> <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>

            <div class="flex items-center gap-1.5 sm:gap-2">
                ${isWebUrl ? `
                    <button type="button" onclick="togglePresentationViewMode()" class="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer">
                        <i class="fa-solid ${viewMode === 'embed' ? 'fa-table-cells' : 'fa-globe'}"></i>
                        <span class="hidden md:inline">${viewMode === 'embed' ? 'Slayt Modu' : 'Web Önizleme'}</span>
                    </button>
                ` : ''}

                ${hasDownload ? `
                    <button type="button" onclick="triggerDirectDownload('${item.downloadUrl}', '${item.fileName.replace(/'/g, "\\\\'")}')" class="px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer" title="Sunumu İndir / Cihazda Aç">
                        <i class="fa-solid fa-download"></i> <span class="hidden md:inline">İndir (PPTX)</span>
                    </button>
                ` : ''}

                <button type="button" onclick="togglePresentationNativeFullscreen()" class="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer shadow-sm" title="Tam Ekran (F11)">
                    <i class="fa-solid fa-expand text-xs"></i> <span class="hidden md:inline">Tam Ekran</span>
                </button>

                <button type="button" onclick="closeFullScreenPresentationModal()" class="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-600 text-white flex items-center justify-center font-black transition-all cursor-pointer shadow-sm" title="Kapat (ESC)">
                    <i class="fa-solid fa-xmark text-sm"></i>
                </button>
            </div>
        </div>

        ${bodyHtml}

        <div class="px-3 sm:px-6 py-2 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0 z-50">
            <div class="flex items-center gap-1.5">
                <span class="text-[10px] sm:text-xs font-bold text-slate-400 mr-2 hidden sm:inline">Hızlı Slayt:</span>
                ${slides.map((_, i) => `
                    <button type="button" onclick="goToPresentationSlide(${i+1})" class="w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-black text-xs transition-all cursor-pointer ${currentSlide === (i+1) ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30 ring-2 ring-orange-500/50' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}">
                        ${i+1}
                    </button>
                `).join("")}
            </div>

            <div class="flex items-center gap-3 text-[11px] font-medium text-slate-400">
                <span class="hidden lg:inline"><i class="fa-regular fa-keyboard mr-1"></i> Yön tuşları veya Boşluk (Space) ile slayt geçişi yapabilirsiniz</span>
                <span class="text-amber-400 font-bold flex items-center gap-1"><i class="fa-solid fa-chalkboard-user"></i> Akıllı Tahta Uyumlu</span>
            </div>
        </div>"""

new_modal_markup = """            <div class="flex items-center gap-1.5 sm:gap-2">
                ${isHtmlEmbed ? `
                    <button type="button" onclick="sendPresentationCommand('prevSlide')" class="p-1.5 sm:px-3 sm:py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 cursor-pointer shadow-sm">
                        <i class="fa-solid fa-chevron-left"></i> <span class="hidden sm:inline">Önceki</span>
                    </button>
                    <button type="button" onclick="sendPresentationCommand('toggleDrawer')" class="px-3 py-1 bg-slate-800 text-amber-400 hover:bg-slate-700 font-black text-xs rounded-full border border-slate-700 shadow-inner flex items-center gap-1.5 cursor-pointer" title="Slayt Listesi">
                        <i class="fa-solid fa-list-ol"></i> <span>41 Slayt</span>
                    </button>
                    <button type="button" onclick="sendPresentationCommand('nextSlide')" class="p-1.5 sm:px-3 sm:py-1 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs cursor-pointer shadow-md">
                        <span class="hidden sm:inline">Sonraki</span> <i class="fa-solid fa-chevron-right"></i>
                    </button>
                ` : `
                    <button type="button" onclick="changePresentationSlide(-1)" class="p-1.5 sm:px-3 sm:py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 cursor-pointer ${currentSlide === 1 ? 'opacity-30 pointer-events-none' : ''}">
                        <i class="fa-solid fa-chevron-left"></i> <span class="hidden sm:inline">Önceki</span>
                    </button>
                    <span class="px-3 py-1 bg-slate-800 text-amber-400 font-black text-xs rounded-full border border-slate-700 shadow-inner">
                        Slayt ${currentSlide} / ${totalSlides}
                    </span>
                    <button type="button" onclick="changePresentationSlide(1)" class="p-1.5 sm:px-3 sm:py-1 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs cursor-pointer ${currentSlide === totalSlides ? 'opacity-30 pointer-events-none' : ''}">
                        <span class="hidden sm:inline">Sonraki</span> <i class="fa-solid fa-chevron-right"></i>
                    </button>
                `}
            </div>

            <div class="flex items-center gap-1.5 sm:gap-2">
                ${isHtmlEmbed ? `
                    <button type="button" onclick="sendPresentationCommand('toggleDrawer')" class="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer hidden md:flex" title="Ünite Rotaları">
                        <i class="fa-solid fa-compass"></i> <span>Ünite Rotaları</span>
                    </button>
                ` : (isWebUrl ? `
                    <button type="button" onclick="togglePresentationViewMode()" class="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer">
                        <i class="fa-solid ${viewMode === 'embed' ? 'fa-table-cells' : 'fa-globe'}"></i>
                        <span class="hidden md:inline">${viewMode === 'embed' ? 'Slayt Modu' : 'Web Önizleme'}</span>
                    </button>
                ` : '')}

                ${hasDownload && !isHtmlEmbed ? `
                    <button type="button" onclick="triggerDirectDownload('${item.downloadUrl}', '${item.fileName.replace(/'/g, "\\\\'")}')" class="px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer" title="Sunumu İndir / Cihazda Aç">
                        <i class="fa-solid fa-download"></i> <span class="hidden md:inline">İndir (PPTX)</span>
                    </button>
                ` : ''}

                <button type="button" id="btn-toggle-native-fs" onclick="togglePresentationNativeFullscreen()" class="px-3.5 py-1.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-lg active:scale-95 cursor-pointer" title="Tam Ekran (F11)">
                    <i class="fa-solid fa-expand text-xs"></i> <span>Tam Ekran</span>
                </button>

                <button type="button" onclick="closeFullScreenPresentationModal()" class="w-8 h-8 rounded-full bg-slate-800 hover:bg-rose-600 text-white flex items-center justify-center font-black transition-all cursor-pointer shadow-sm" title="Kapat (ESC)">
                    <i class="fa-solid fa-xmark text-sm"></i>
                </button>
            </div>
        </div>

        ${bodyHtml}

        <div class="px-3 sm:px-6 py-2 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0 z-50">
            <div class="flex items-center gap-2">
                <span class="text-amber-400 font-bold flex items-center gap-1.5">
                    <i class="fa-solid fa-chalkboard-user"></i> ${isHtmlEmbed ? '5. Sınıf • 1. Ünite: Güneş, Dünya ve Ay (3D Sinematik Sunum)' : 'Akıllı Tahta Sunum Modu'}
                </span>
                <span class="hidden lg:inline text-slate-600">|</span>
                <span class="hidden lg:inline text-[11px] text-slate-400">
                    <i class="fa-regular fa-keyboard mr-1"></i> Yön tuşları veya Space ile slayt geçişi yapabilirsiniz
                </span>
            </div>

            <div class="flex items-center gap-2">
                <button type="button" onclick="togglePresentationNativeFullscreen()" class="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-lg border border-slate-700 flex items-center gap-1.5 cursor-pointer">
                    <i class="fa-solid fa-expand"></i> <span>Tüm Ekranı Aç (F11)</span>
                </button>
                <span class="text-emerald-400 font-bold hidden sm:flex items-center gap-1">
                    <i class="fa-solid fa-circle-check"></i> Akıllı Tahta Uyumlu
                </span>
            </div>
        </div>"""

if old_modal_markup in code:
    code = code.replace(old_modal_markup, new_modal_markup)
    print("SUCCESS: Updated modal Header & Footer markup!")
else:
    print("WARNING: Could not find exact old_modal_markup!")

# 5. Update handlePresentationKeyNavigation for isHtmlEmbed
old_key_nav = """function handlePresentationKeyNavigation(e) {
    const modal = document.getElementById("fullscreen-presentation-modal");
    if (!modal || modal.classList.contains("hidden")) return;

    if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        changePresentationSlide(1);
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        changePresentationSlide(-1);
    } else if (e.key === "Escape") {
        closeFullScreenPresentationModal();
    } else if (e.key === "f" || e.key === "F" || e.key === "F11") {
        e.preventDefault();
        togglePresentationNativeFullscreen();
    }
}"""

new_key_nav = """function handlePresentationKeyNavigation(e) {
    const modal = document.getElementById("fullscreen-presentation-modal");
    if (!modal || modal.classList.contains("hidden")) return;

    const isHtmlEmbed = presentationModalState && presentationModalState.isHtmlEmbed;

    if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        if (isHtmlEmbed) {
            sendPresentationCommand("nextSlide");
        } else {
            changePresentationSlide(1);
        }
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        if (isHtmlEmbed) {
            sendPresentationCommand("prevSlide");
        } else {
            changePresentationSlide(-1);
        }
    } else if (e.key === "Escape") {
        if (!document.fullscreenElement) {
            closeFullScreenPresentationModal();
        }
    } else if (e.key === "f" || e.key === "F" || e.key === "F11") {
        e.preventDefault();
        togglePresentationNativeFullscreen();
    }
}"""

if old_key_nav in code:
    code = code.replace(old_key_nav, new_key_nav)
    print("SUCCESS: Updated handlePresentationKeyNavigation!")
else:
    print("WARNING: Could not find exact old_key_nav!")

# 6. Add fullscreenchange listener update
fs_listener = """
document.addEventListener("fullscreenchange", () => {
    const btn = document.getElementById("btn-toggle-native-fs");
    if (!btn) return;
    if (document.fullscreenElement) {
        btn.innerHTML = `<i class="fa-solid fa-compress text-xs"></i> <span>Tam Ekrandan Çık</span>`;
        btn.classList.remove("from-orange-600", "to-amber-600");
        btn.classList.add("from-slate-700", "to-slate-800");
    } else {
        btn.innerHTML = `<i class="fa-solid fa-expand text-xs"></i> <span>Tam Ekran</span>`;
        btn.classList.add("from-orange-600", "to-amber-600");
        btn.classList.remove("from-slate-700", "to-slate-800");
    }
});
"""

if "btn-toggle-native-fs" not in code or "fullscreenchange" not in code:
    code = code + "\n" + fs_listener
    print("SUCCESS: Added fullscreenchange listener!")

# 7. Also update openOrDownloadMaterial
old_html_block = """    // 🚀 1.8 🌟 İNTERAKTİF HTML5 AKILLI TAHTA SUNUMLARI (3D Sinematik Sunum)
    const isHtmlPresentation = (checkFile.endsWith(".html") || (targetUrl && targetUrl.includes(".html")) || checkFormat.includes("İNTERAKTİF SUNUM") || checkFormat.includes("HTML SUNUM"));
    if (isHtmlPresentation && targetUrl && targetUrl !== "#") {
        const fullUrl = targetUrl.startsWith("http") ? targetUrl : new URL(targetUrl, window.location.origin + window.location.pathname.replace(/\\/[^/]*$/, "/")).href;
        const win = window.open(fullUrl, '_blank');
        if (!win || win.closed || typeof win.closed === 'undefined') {
            window.location.href = fullUrl;
        }
        return;
    }"""

new_html_block = """    // 🚀 1.8 🌟 İNTERAKTİF HTML5 AKILLI TAHTA SUNUMLARI (3D Sinematik Sunum)
    const isHtmlPresentation = (checkFile.endsWith(".html") || (targetUrl && targetUrl.includes(".html")) || checkFormat.includes("İNTERAKTİF SUNUM") || checkFormat.includes("HTML SUNUM"));
    if (isHtmlPresentation && targetUrl && targetUrl !== "#") {
        const fullUrl = targetUrl.startsWith("http") ? targetUrl : new URL(targetUrl, window.location.origin + window.location.pathname.replace(/\\/[^/]*$/, "/")).href;
        await openFullScreenPresentationModal({
            id: (found && found.id) || id,
            title: (found && found.title) || title || "Akıllı Tahta 3D Ders Sunumu",
            fileName: (found && found.fileName) || fileName || "sunum.html",
            fileUrl: fullUrl,
            format: "İNTERAKTİF SUNUM",
            unit: (found && found.unit) || "",
            grade: gradeStr,
            cover: coverUrl,
            isHtmlEmbed: true
        });
        return;
    }"""

if old_html_block in code:
    code = code.replace(old_html_block, new_html_block)
    print("SUCCESS: Updated isHtmlPresentation in openOrDownloadMaterial!")
else:
    print("Note: isHtmlPresentation already updated or regex needed")

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Saved js/app.js successfully!")
