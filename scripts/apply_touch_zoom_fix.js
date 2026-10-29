const fs = require('fs');
const path = require('path');
const vm = require('vm');

const appJsPath = path.join(__dirname, '..', 'js', 'app.js');
let rawContent = fs.readFileSync(appJsPath, 'utf8');

// Normalize line endings to \n for matching, preserving \r\n on save if desired
const isCRLF = rawContent.includes('\r\n');
let content = rawContent.replace(/\r\n/g, '\n');

console.log('Original js/app.js lines:', content.split('\n').length);

// 1. Locate the zoom/pan block
const oldZoomBlock = `let inPageModalZoom = 1.0;
let inPageModalPanX = 0;
let inPageModalPanY = 0;
let inPageIsDragging = false;
let inPageDragStartX = 0;
let inPageDragStartY = 0;

function changeImageModalZoom(delta) {
    inPageModalZoom = Math.max(0.5, Math.min(4.0, inPageModalZoom + delta));
    applyImageModalTransform();
}

function resetImageModalZoom() {
    inPageModalZoom = 1.0;
    inPageModalPanX = 0;
    inPageModalPanY = 0;
    applyImageModalTransform();
}

function applyImageModalTransform() {
    const img = document.getElementById("inpage-modal-zoom-img");
    const text = document.getElementById("inpage-zoom-level-text");
    if (img) {
        img.style.transform = \`translate(\${inPageModalPanX}px, \${inPageModalPanY}px) scale(\${inPageModalZoom})\`;
    }
    if (text) {
        text.textContent = \`%\${Math.round(inPageModalZoom * 100)}\`;
    }
}

function initImagePanDragListeners() {
    const container = document.getElementById("inpage-modal-zoom-container");
    if (!container) return;

    container.onmousedown = (e) => {
        inPageIsDragging = true;
        inPageDragStartX = e.clientX - inPageModalPanX;
        inPageDragStartY = e.clientY - inPageModalPanY;
        container.style.cursor = "grabbing";
    };

    window.onmousemove = (e) => {
        if (!inPageIsDragging) return;
        inPageModalPanX = e.clientX - inPageDragStartX;
        inPageModalPanY = e.clientY - inPageDragStartY;
        applyImageModalTransform();
    };

    window.onmouseup = () => {
        inPageIsDragging = false;
        if (container) container.style.cursor = "grab";
    };
}`;

if (!content.includes(oldZoomBlock)) {
    console.error('HATA: oldZoomBlock bulunamadı!');
    process.exit(1);
}

const newZoomBlock = `// -------------------------------------------------------------
// 🔍 TAM EKRAN GÖRSEL / ÇALIŞMA KÂĞIDI DOKUNMATİK & ZOOM MOTORU
// (Akıllı Tahta / Pardus & Mobil Pinch-to-Zoom, Touch Pan Desteği)
// -------------------------------------------------------------
let inPageModalZoom = 1.0;
let inPageModalPanX = 0;
let inPageModalPanY = 0;
let inPageIsDragging = false;
let inPageDragStartX = 0;
let inPageDragStartY = 0;

// Çift Parmak Pinch-to-Zoom ve Dokunmatik Durumları
let inPageIsPinching = false;
let inPageInitialPinchDist = 0;
let inPageInitialPinchZoom = 1.0;
let inPageInitialPinchCenterX = 0;
let inPageInitialPinchCenterY = 0;
let inPageInitialPinchPanX = 0;
let inPageInitialPinchPanY = 0;
let inPageLastTapTime = 0;
let inPageLastTapX = 0;
let inPageLastTapY = 0;

// Olay dinleyicilerini temizlemek için referanslar
let inPageWindowMouseMoveHandler = null;
let inPageWindowMouseUpHandler = null;
let inPageWindowKeyDownHandler = null;

function clampModalPan() {
    const container = document.getElementById("inpage-modal-zoom-container");
    const boundX = container ? Math.max(container.clientWidth * (inPageModalZoom + 0.6), window.innerWidth * 2.2) : 2500;
    const boundY = container ? Math.max(container.clientHeight * (inPageModalZoom + 0.6), window.innerHeight * 2.2) : 2500;
    inPageModalPanX = Math.max(-boundX, Math.min(boundX, inPageModalPanX));
    inPageModalPanY = Math.max(-boundY, Math.min(boundY, inPageModalPanY));
}

function applyImageModalTransform(withTransition = false) {
    const img = document.getElementById("inpage-modal-zoom-img");
    const text = document.getElementById("inpage-zoom-level-text");
    const dpad = document.getElementById("inpage-modal-touch-controls");
    if (img) {
        img.style.transition = withTransition ? "transform 0.18s cubic-bezier(0.2, 0, 0, 1)" : "none";
        img.style.transform = \`translate(\${inPageModalPanX}px, \${inPageModalPanY}px) scale(\${inPageModalZoom})\`;
    }
    if (text) {
        text.textContent = \`%\${Math.round(inPageModalZoom * 100)}\`;
    }
    if (dpad) {
        dpad.style.opacity = inPageModalZoom > 1.05 ? "1" : "0.85";
    }
}

function zoomImageToPoint(targetZoom, clientX, clientY, withTransition = true) {
    const container = document.getElementById("inpage-modal-zoom-container");
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const pointX = (clientX !== undefined ? clientX : centerX) - centerX;
    const pointY = (clientY !== undefined ? clientY : centerY) - centerY;

    const oldZoom = inPageModalZoom;
    const newZoom = Math.max(0.5, Math.min(5.0, targetZoom));
    const ratio = newZoom / oldZoom;

    inPageModalPanX = inPageModalPanX - pointX * (ratio - 1);
    inPageModalPanY = inPageModalPanY - pointY * (ratio - 1);
    inPageModalZoom = newZoom;

    clampModalPan();
    applyImageModalTransform(withTransition);
}

function changeImageModalZoom(delta) {
    const targetZoom = Math.max(0.5, Math.min(5.0, inPageModalZoom + delta));
    zoomImageToPoint(targetZoom, undefined, undefined, true);
}

function resetImageModalZoom() {
    inPageModalZoom = 1.0;
    inPageModalPanX = 0;
    inPageModalPanY = 0;
    applyImageModalTransform(true);
}

function panImageModal(deltaX, deltaY) {
    inPageModalPanX += deltaX;
    inPageModalPanY += deltaY;
    clampModalPan();
    applyImageModalTransform(true);
}

function cleanupImageModalListeners() {
    if (inPageWindowMouseMoveHandler) {
        window.removeEventListener("mousemove", inPageWindowMouseMoveHandler);
        inPageWindowMouseMoveHandler = null;
    }
    if (inPageWindowMouseUpHandler) {
        window.removeEventListener("mouseup", inPageWindowMouseUpHandler);
        inPageWindowMouseUpHandler = null;
    }
    if (inPageWindowKeyDownHandler) {
        window.removeEventListener("keydown", inPageWindowKeyDownHandler);
        inPageWindowKeyDownHandler = null;
    }
}

function initImagePanDragListeners() {
    const container = document.getElementById("inpage-modal-zoom-container");
    if (!container) return;

    cleanupImageModalListeners();

    // 1. Dokunmatik Olayları (Akıllı Tahta / Pardus & Mobil Pinch-to-Zoom & Pan)
    container.addEventListener("touchstart", (e) => {
        if (e.touches.length === 1) {
            inPageIsPinching = false;
            inPageIsDragging = true;
            const touch = e.touches[0];
            inPageDragStartX = touch.clientX - inPageModalPanX;
            inPageDragStartY = touch.clientY - inPageModalPanY;

            // Çift Dokunma (Double Tap) Algılama: %100 ile %220 arasında hızlı geçiş
            const now = Date.now();
            const distFromLastTap = Math.hypot(touch.clientX - inPageLastTapX, touch.clientY - inPageLastTapY);
            if (now - inPageLastTapTime < 340 && distFromLastTap < 40) {
                e.preventDefault();
                if (inPageModalZoom > 1.2) {
                    resetImageModalZoom();
                } else {
                    zoomImageToPoint(2.2, touch.clientX, touch.clientY, true);
                }
                inPageLastTapTime = 0;
                inPageIsDragging = false;
                return;
            }
            inPageLastTapTime = now;
            inPageLastTapX = touch.clientX;
            inPageLastTapY = touch.clientY;
        } else if (e.touches.length >= 2) {
            // İki Parmakla Yakınlaştırma (Pinch-to-Zoom) Başlangıcı
            inPageIsDragging = false;
            inPageIsPinching = true;
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            inPageInitialPinchDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
            inPageInitialPinchZoom = inPageModalZoom;
            inPageInitialPinchCenterX = (t1.clientX + t2.clientX) / 2;
            inPageInitialPinchCenterY = (t1.clientY + t2.clientY) / 2;
            inPageInitialPinchPanX = inPageModalPanX;
            inPageInitialPinchPanY = inPageModalPanY;
        }
    }, { passive: false });

    container.addEventListener("touchmove", (e) => {
        if (e.touches.length === 1 && inPageIsDragging && !inPageIsPinching) {
            // Tek parmakla sağa, sola, yukarı, aşağıya serbest kaydırma
            e.preventDefault();
            const touch = e.touches[0];
            inPageModalPanX = touch.clientX - inPageDragStartX;
            inPageModalPanY = touch.clientY - inPageDragStartY;
            clampModalPan();
            applyImageModalTransform(false);
        } else if (e.touches.length >= 2 && inPageIsPinching && inPageInitialPinchDist > 5) {
            // İki parmakla ekrandan büyütme / küçültme (Pinch)
            e.preventDefault();
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            const currentDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
            const currentCenterX = (t1.clientX + t2.clientX) / 2;
            const currentCenterY = (t1.clientY + t2.clientY) / 2;

            const scaleRatio = currentDist / inPageInitialPinchDist;
            const targetZoom = Math.max(0.5, Math.min(5.0, inPageInitialPinchZoom * scaleRatio));

            const rect = container.getBoundingClientRect();
            const contCenterX = rect.left + rect.width / 2;
            const contCenterY = rect.top + rect.height / 2;

            const originX = inPageInitialPinchCenterX - contCenterX - inPageInitialPinchPanX;
            const originY = inPageInitialPinchCenterY - contCenterY - inPageInitialPinchPanY;
            const zoomRatio = targetZoom / inPageInitialPinchZoom;

            inPageModalZoom = targetZoom;
            inPageModalPanX = inPageInitialPinchCenterX - contCenterX - originX * zoomRatio + (currentCenterX - inPageInitialPinchCenterX);
            inPageModalPanY = inPageInitialPinchCenterY - contCenterY - originY * zoomRatio + (currentCenterY - inPageInitialPinchCenterY);

            clampModalPan();
            applyImageModalTransform(false);
        }
    }, { passive: false });

    const handleTouchEnd = (e) => {
        if (e.touches.length === 0) {
            inPageIsDragging = false;
            inPageIsPinching = false;
            inPageInitialPinchDist = 0;
        } else if (e.touches.length === 1) {
            inPageIsPinching = false;
            inPageIsDragging = true;
            const touch = e.touches[0];
            inPageDragStartX = touch.clientX - inPageModalPanX;
            inPageDragStartY = touch.clientY - inPageModalPanY;
        }
    };
    container.addEventListener("touchend", handleTouchEnd);
    container.addEventListener("touchcancel", handleTouchEnd);

    // 2. Fare ve Akıllı Tahta Kalemi Olayları
    container.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return;
        inPageIsDragging = true;
        inPageDragStartX = e.clientX - inPageModalPanX;
        inPageDragStartY = e.clientY - inPageModalPanY;
        container.style.cursor = "grabbing";
    });

    inPageWindowMouseMoveHandler = (e) => {
        if (!inPageIsDragging || inPageIsPinching) return;
        inPageModalPanX = e.clientX - inPageDragStartX;
        inPageModalPanY = e.clientY - inPageDragStartY;
        clampModalPan();
        applyImageModalTransform(false);
    };
    window.addEventListener("mousemove", inPageWindowMouseMoveHandler);

    inPageWindowMouseUpHandler = () => {
        inPageIsDragging = false;
        const c = document.getElementById("inpage-modal-zoom-container");
        if (c) c.style.cursor = "grab";
    };
    window.addEventListener("mouseup", inPageWindowMouseUpHandler);

    // 3. Fare Tekerleği ile İmlece Doğru Büyütme/Küçültme
    container.addEventListener("wheel", (e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.2 : -0.2;
        const targetZoom = Math.max(0.5, Math.min(5.0, inPageModalZoom + delta));
        zoomImageToPoint(targetZoom, e.clientX, e.clientY, true);
    }, { passive: false });

    // 4. Klavye Yön Tuşları ile Kaydırma ve Zoom (+, -, Oklar)
    inPageWindowKeyDownHandler = (e) => {
        const modal = document.getElementById("inpage-document-modal");
        if (!modal) return;
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            panImageModal(80, 0);
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            panImageModal(-80, 0);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            panImageModal(0, 80);
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            panImageModal(0, -80);
        } else if (e.key === "+" || e.key === "=") {
            e.preventDefault();
            changeImageModalZoom(0.25);
        } else if (e.key === "-" || e.key === "_") {
            e.preventDefault();
            changeImageModalZoom(-0.25);
        } else if (e.key === "0") {
            e.preventDefault();
            resetImageModalZoom();
        }
    };
    window.addEventListener("keydown", inPageWindowKeyDownHandler);
}

window.changeImageModalZoom = changeImageModalZoom;
window.resetImageModalZoom = resetImageModalZoom;
window.panImageModal = panImageModal;
window.zoomImageToPoint = zoomImageToPoint;
window.cleanupImageModalListeners = cleanupImageModalListeners;`;

content = content.replace(oldZoomBlock, newZoomBlock);

// 2. Update the HTML container block inside openInPageDocumentModal
const oldContainerHtml = `<div id="inpage-modal-zoom-container" class="flex-1 w-full h-full p-1 sm:p-2 m-0 bg-slate-950 flex items-center justify-center overflow-hidden relative touch-none select-none cursor-grab" title="İmleçle basılı tutup kaydırabilirsiniz">
                    \${docUrl ? \`<img id="inpage-modal-zoom-img" src="\${docUrl}" alt="\${docTitle}" draggable="false" ondblclick="changeImageModalZoom(inPageModalZoom > 1.0 ? -0.5 : 0.5)" onerror="handleInPageModalImageError(this, \\\`\${(fallbackCover || '').replace(/'/g, "\\\\'")}\\\`, \\\`\${(docTitle || '').replace(/'/g, "\\\\'")}\\\`, \\\`\${(externalPdf || '').replace(/'/g, "\\\\'")}\\\`)" class="w-full h-full max-h-[calc(100dvh-52px)] max-w-[99vw] object-contain block mx-auto select-none pointer-events-auto" style="transform: translate(0px, 0px) scale(1); transform-origin: center center;">\` : \``;

if (!content.includes(oldContainerHtml)) {
    console.error('HATA: oldContainerHtml bulunamadı!');
    process.exit(1);
}

const newContainerHtml = `<div id="inpage-modal-zoom-container" class="flex-1 w-full h-full p-1 sm:p-2 m-0 bg-slate-950 flex items-center justify-center overflow-hidden relative select-none cursor-grab" style="touch-action: none; -webkit-touch-callout: none; -webkit-user-select: none; user-select: none;" title="İmleçle basılı tutup kaydırabilir, ekrana dokunarak çift parmakla büyütebilirsiniz">
                    \${docUrl ? \`
                        <img id="inpage-modal-zoom-img" src="\${docUrl}" alt="\${docTitle}" draggable="false" ondblclick="changeImageModalZoom(inPageModalZoom > 1.2 ? -0.5 : 0.5)" onerror="handleInPageModalImageError(this, \\\`\${(fallbackCover || '').replace(/'/g, "\\\\'")}\\\`, \\\`\${(docTitle || '').replace(/'/g, "\\\\'")}\\\`, \\\`\${(externalPdf || '').replace(/'/g, "\\\\'")}\\\`)" class="w-full h-full max-h-[calc(100dvh-52px)] max-w-[99vw] object-contain block mx-auto select-none pointer-events-auto cursor-grab active:cursor-grabbing" style="touch-action: none; -webkit-touch-callout: none; -webkit-user-select: none; user-select: none; -webkit-user-drag: none; transform: translate(0px, 0px) scale(1); transform-origin: center center;">
                        
                        <!-- Akıllı Tahta & Dokunmatik Ekranlar için Hızlı Yön Paneli (D-Pad) -->
                        <div id="inpage-modal-touch-controls" class="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 z-30 flex flex-col items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl border border-slate-700/80 shadow-2xl select-none" onclick="event.stopPropagation()">
                            <div class="text-[9px] font-black text-amber-400 uppercase tracking-widest px-1 flex items-center gap-1 mb-0.5">
                                <i class="fa-solid fa-arrows-up-down-left-right text-[10px]"></i> <span>Yön</span>
                            </div>
                            <button type="button" onclick="panImageModal(0, 140)" class="w-8 h-8 sm:w-9 sm:h-8 rounded-lg bg-slate-800 hover:bg-indigo-600 text-white flex items-center justify-center text-sm font-black transition-all shadow active:scale-95 cursor-pointer" title="Yukarı Kaydır">
                                <i class="fa-solid fa-chevron-up"></i>
                            </button>
                            <div class="flex items-center gap-1">
                                <button type="button" onclick="panImageModal(140, 0)" class="w-8 h-8 sm:w-9 sm:h-8 rounded-lg bg-slate-800 hover:bg-indigo-600 text-white flex items-center justify-center text-sm font-black transition-all shadow active:scale-95 cursor-pointer" title="Sola Kaydır">
                                    <i class="fa-solid fa-chevron-left"></i>
                                </button>
                                <button type="button" onclick="resetImageModalZoom()" class="w-8 h-8 sm:w-9 sm:h-8 rounded-lg bg-slate-950 hover:bg-amber-600 text-amber-400 hover:text-white flex items-center justify-center text-xs font-black transition-all shadow active:scale-95 cursor-pointer" title="Ortala & %100 Sıfırla">
                                    <i class="fa-solid fa-arrows-to-dot"></i>
                                </button>
                                <button type="button" onclick="panImageModal(-140, 0)" class="w-8 h-8 sm:w-9 sm:h-8 rounded-lg bg-slate-800 hover:bg-indigo-600 text-white flex items-center justify-center text-sm font-black transition-all shadow active:scale-95 cursor-pointer" title="Sağa Kaydır">
                                    <i class="fa-solid fa-chevron-right"></i>
                                </button>
                            </div>
                            <button type="button" onclick="panImageModal(0, -140)" class="w-8 h-8 sm:w-9 sm:h-8 rounded-lg bg-slate-800 hover:bg-indigo-600 text-white flex items-center justify-center text-sm font-black transition-all shadow active:scale-95 cursor-pointer" title="Aşağı Kaydır">
                                <i class="fa-solid fa-chevron-down"></i>
                            </button>
                        </div>

                        <!-- Dokunmatik Kullanım İpucu Rozeti -->
                        <div class="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 z-20 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-slate-300 text-[11px] font-bold shadow-lg">
                            <i class="fa-solid fa-hand-pointer text-amber-400"></i>
                            <span>Çift parmakla büyütme • Dokunup sürükleyerek kaydırma</span>
                        </div>
                    \` : \``;

content = content.replace(oldContainerHtml, newContainerHtml);

// 3. Update closeInPageDocumentModal to call cleanupImageModalListeners
const oldCloseModal = `function closeInPageDocumentModal() {
    inPageModalZoom = 1.0;
    inPageModalPanX = 0;
    inPageModalPanY = 0;
    inPageIsDragging = false;
    const modal = document.getElementById("inpage-document-modal");
    if (modal) {
        modal.innerHTML = "";
        modal.remove();
    }
}`;

if (!content.includes(oldCloseModal)) {
    console.error('HATA: oldCloseModal bulunamadı!');
    process.exit(1);
}

const newCloseModal = `function closeInPageDocumentModal() {
    if (typeof cleanupImageModalListeners === "function") {
        cleanupImageModalListeners();
    }
    inPageModalZoom = 1.0;
    inPageModalPanX = 0;
    inPageModalPanY = 0;
    inPageIsDragging = false;
    inPageIsPinching = false;
    const modal = document.getElementById("inpage-document-modal");
    if (modal) {
        modal.innerHTML = "";
        modal.remove();
    }
}`;

content = content.replace(oldCloseModal, newCloseModal);

// Verify syntax
console.log('Verifying syntax with vm.Script...');
new vm.Script(content);
console.log('Syntax OK!');

// Restore line endings if originally CRLF
if (isCRLF) {
    content = content.replace(/\n/g, '\r\n');
}

// Write file
fs.writeFileSync(appJsPath, content, 'utf8');
console.log('js/app.js başarıyla güncellendi! Yeni boyut:', content.length);
