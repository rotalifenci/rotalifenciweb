const fs = require('fs');

const files = ['js/app.js', '../js/app.js'];

files.forEach(p => {
  if (!fs.existsSync(p)) return;
  let code = fs.readFileSync(p, 'utf8');

  // Replace openInteractiveTestModal implementation cleanly
  const modalFuncStart = 'async function openInteractiveTestModal(targetUrl, title = "İnteraktif Sınav", materialId = "", fileName = "") {';
  const modalFuncEnd = 'window.openInteractiveTestModal = openInteractiveTestModal;';

  const sIdx = code.indexOf(modalFuncStart);
  const eIdx = code.indexOf(modalFuncEnd);

  if (sIdx !== -1 && eIdx !== -1) {
    const newModalCode = `async function openInteractiveTestModal(targetUrl, title = "İnteraktif Sınav", materialId = "", fileName = "") {
    let modal = document.getElementById("interactive-game-modal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "interactive-game-modal";
        document.body.appendChild(modal);
    }
    modal.className = "fixed inset-0 z-[99999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-0 transition-all duration-300";
    modal.style.display = "flex";
    modal.classList.remove("hidden");

    // 1. Tarayıcı önbelleğindeki eski test kalıntılarını temizle (Z-Kitap formatını zorunlu kıl)
    try {
        if (typeof localStorage !== "undefined") {
            for (let i = localStorage.length - 1; i >= 0; i--) {
                const k = localStorage.key(i);
                if (k && (k.startsWith("rotali_test_html_") || k.includes("test_html"))) {
                    localStorage.removeItem(k);
                }
            }
        }
    } catch(e) {}

    const cleanFileName = (fileName || targetUrl.split("/").pop() || "").split("?")[0];
    const viewerUrl = (cleanFileName ? \`/testler/\${cleanFileName}\` : targetUrl) + '?v=' + Date.now();

    modal.innerHTML = \`
        <div class="bg-slate-950 w-screen h-screen max-w-none max-h-none border-0 shadow-2xl overflow-hidden flex flex-col" style="height: 100dvh; height: 100vh; width: 100vw; max-width: 100vw;" onclick="event.stopPropagation()">
            <div class="px-3.5 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white shrink-0 min-h-[46px]" style="padding-top: max(8px, env(safe-area-inset-top)); padding-left: max(10px, env(safe-area-inset-left)); padding-right: max(10px, env(safe-area-inset-right));">
                <div class="flex items-center gap-2.5 min-w-0">
                    <span class="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-rose-600 text-white flex items-center justify-center text-sm font-black shadow-md shrink-0">
                        <i class="fa-solid fa-file-pen"></i>
                    </span>
                    <div class="min-w-0">
                        <h3 class="text-xs sm:text-sm font-black text-white truncate max-w-[200px] sm:max-w-md md:max-w-xl uppercase tracking-wide">\${String(title || '').toLocaleUpperCase('tr-TR')}</h3>
                        <span class="text-[10px] text-slate-400 font-medium hidden sm:inline">Rotalı Fenci • MEB Maarif Modeli Z-Kitap Soru Portalı</span>
                    </div>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                    <button type="button" onclick="const iframe = document.getElementById('interactive-test-iframe'); if(iframe && iframe.contentWindow) iframe.contentWindow.print();" class="px-2.5 py-1.5 bg-slate-800 hover:bg-emerald-600 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-sm cursor-pointer" title="MEB Standartlarında A4 Yazdır veya PDF İndir">
                        <i class="fa-solid fa-print"></i> <span class="hidden md:inline">Yazdır / PDF</span>
                    </button>
                    <a href="\${viewerUrl}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1.5 bg-slate-800 hover:bg-indigo-600 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-sm cursor-pointer" title="Tam Ekran Yeni Sekmede Aç">
                        <i class="fa-solid fa-up-right-from-square"></i> <span class="hidden md:inline">Yeni Sekme</span>
                    </a>
                    <button type="button" onclick="if (!document.fullscreenElement) { document.documentElement.requestFullscreen(); } else { if (document.exitFullscreen) document.exitFullscreen(); }" class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-amber-600 text-white flex items-center justify-center text-xs font-black transition-all cursor-pointer shadow-sm" title="Tam Ekran (F11)">
                        <i class="fa-solid fa-expand"></i>
                    </button>
                    <button type="button" onclick="closeInteractiveGameModal()" class="w-8 h-8 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center font-black transition-all cursor-pointer shadow-sm ml-1" title="Kapat (ESC)">
                        <i class="fa-solid fa-xmark text-sm"></i>
                    </button>
                </div>
            </div>
            <div class="flex-1 w-full h-full bg-slate-950 relative overflow-hidden flex flex-col p-0 m-0">
                <iframe id="interactive-test-iframe" src="\${viewerUrl}" class="w-full h-full flex-1 border-0 block bg-white" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; fullscreen" allowfullscreen></iframe>
            </div>
        </div>
    \`;
}
`;

    code = code.substring(0, sIdx) + newModalCode + code.substring(eIdx);
    fs.writeFileSync(p, code, 'utf8');
    console.log('Successfully updated openInteractiveTestModal in:', p);
  } else {
    console.error('Could not find start or end index in:', p);
  }
});
