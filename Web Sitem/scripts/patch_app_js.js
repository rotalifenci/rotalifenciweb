const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const appJsPath = path.join(rootDir, 'js', 'app.js');
const rootAppJsPath = path.join(rootDir, '..', 'js', 'app.js');

let code = fs.readFileSync(appJsPath, 'utf8');

// Replace top badge
code = code.replace(
  '<span class="text-[11px] font-bold text-slate-400 shrink-0">\r\n                                        ${item.format || \'DOKÜMAN\'}\r\n                                    </span>',
  '<span class="px-2.5 py-0.5 rounded-lg text-[10.5px] font-black uppercase tracking-wider border shrink-0 ${trueTypeBadgeClass}">\r\n                                        ${trueTypeBadge}\r\n                                    </span>'
);
code = code.replace(
  '<span class="text-[11px] font-bold text-slate-400 shrink-0">\n                                        ${item.format || \'DOKÜMAN\'}\n                                    </span>',
  '<span class="px-2.5 py-0.5 rounded-lg text-[10.5px] font-black uppercase tracking-wider border shrink-0 ${trueTypeBadgeClass}">\n                                        ${trueTypeBadge}\n                                    </span>'
);

// Insert cardOutcomeHtml
const targetImgEnd = '<!-- On plan kapak gorseli (Kesilme yok, baslik ve detaylar 100% net ve gorunur) -->\r\n                                    <img src="${resolveMaterialCover(item) || validImgUrl || \'assets/kapak-5.jpg\'}" alt="${item.title}" class="relative z-10 w-auto h-full max-h-full max-w-full object-contain rounded-md shadow-md transition-transform duration-300 group-hover:scale-105" loading="lazy" />\r\n                                </div>';

const targetImgEndLF = '<!-- On plan kapak gorseli (Kesilme yok, baslik ve detaylar 100% net ve gorunur) -->\n                                    <img src="${resolveMaterialCover(item) || validImgUrl || \'assets/kapak-5.jpg\'}" alt="${item.title}" class="relative z-10 w-auto h-full max-h-full max-w-full object-contain rounded-md shadow-md transition-transform duration-300 group-hover:scale-105" loading="lazy" />\n                                </div>';

if (code.includes(targetImgEnd)) {
  code = code.replace(targetImgEnd, targetImgEnd + '\r\n                                ${cardOutcomeHtml}');
  console.log("Outcome HTML inserted (CRLF)!");
} else if (code.includes(targetImgEndLF)) {
  code = code.replace(targetImgEndLF, targetImgEndLF + '\n                                ${cardOutcomeHtml}');
  console.log("Outcome HTML inserted (LF)!");
} else {
  console.log("Could not find targetImgEnd!");
}

fs.writeFileSync(appJsPath, code, 'utf8');
if (fs.existsSync(rootAppJsPath)) {
  fs.writeFileSync(rootAppJsPath, code, 'utf8');
}
console.log("Done!");
