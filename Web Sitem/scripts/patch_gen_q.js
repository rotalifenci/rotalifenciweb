const fs = require('fs');

let content = fs.readFileSync('api/generate-questions.js', 'utf8');

// 1. Add above -> beside replacement in cleanTurkishAndLatex
if (!content.includes("text.replace(/\\bYukarıdaki\\b/g, 'Yandaki')")) {
  const target = "text = text.replace(/([A-Za-zÇĞİÖŞÜçğıöşü]+)\\s*<\\s*([A-Za-zÇĞİÖŞÜçğıöşü]+)/g, '$1 < $2');";
  const replacement = `${target}
  text = text.replace(/\\bYukarıdaki\\b/g, 'Yandaki');
  text = text.replace(/\\byukarıdaki\\b/g, 'yandaki');
  text = text.replace(/\\bYukarıda\\b/g, 'Yanda');
  text = text.replace(/\\byukarıda\\b/g, 'yanda');
  text = text.replace(/\\bYukardaki\\b/g, 'Yandaki');
  text = text.replace(/\\byukardaki\\b/g, 'yandaki');
  text = text.replace(/yukarıda\\s+verilen/gi, 'yanda verilen');
  text = text.replace(/yukarıdaki\\s+görsel/gi, 'yandaki görsel');
  text = text.replace(/yukarıdaki\\s+model/gi, 'yandaki model');
  text = text.replace(/yukarıdaki\\s+şekil/gi, 'yandaki şekil');`;
  
  content = content.replace(target, replacement);
  console.log('cleanTurkishAndLatex patched successfully');
}

fs.writeFileSync('api/generate-questions.js', content, 'utf8');
fs.writeFileSync('../api/generate-questions.js', content, 'utf8');
console.log('Updated both api/generate-questions.js files');
