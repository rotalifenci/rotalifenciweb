const fs = require('fs');
const path = require('path');
const { generateVisualBrief, checkVisualCompatibility } = require('../js/visual_match_engine.js');

function reconcileTestsInDir(testDir) {
  if (!fs.existsSync(testDir)) return;
  const files = fs.readdirSync(testDir).filter(f => f.endsWith('.html'));

  files.forEach(file => {
    const filePath = path.join(testDir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // rawQuestions JSON dizisini bul
    const rawMatch = html.match(/const\s+rawQuestions\s*=\s*(\[[\s\S]*?\]);/);
    if (rawMatch) {
      try {
        let rawQuestions = JSON.parse(rawMatch[1]);
        rawQuestions.forEach((q, idx) => {
          const brief = generateVisualBrief(q.question, q.options || {}, q.correct || q.correct_answer || '');
          const currentVisual = q.visual_svg || '';

          // Uyumluluk kontrolü
          const check = checkVisualCompatibility(q.question, currentVisual, q.correct || q.correct_answer || '');
          if (!check.isCompatible) {
            console.log(`[${file}] Q${idx + 1} UYUMSUZLUK: ${check.reason}`);
            console.log(`  -> Yeni görsel: ${brief.assetPath}`);
            q.visual_svg = brief.renderedHtml;
            modified = true;

            // HTML içindeki <section class="rf-question-slide" ... data-slide="${idx}" ...> bloğundaki görseli güncelle
            const slideRegex = new RegExp(`(<section[^>]*data-slide=["']${idx}["'][\\s\\S]*?<div class="rf-visual-box">)([\\s\\S]*?)(<\\/div>)`, 'i');
            html = html.replace(slideRegex, (m, prefix, oldVisual, suffix) => {
              return `${prefix}${brief.renderedHtml}${suffix}`;
            });
          }
        });

        if (modified) {
          html = html.replace(/const\s+rawQuestions\s*=\s*\[[\s\S]*?\];/, `const rawQuestions = ${JSON.stringify(rawQuestions)};`);
          fs.writeFileSync(filePath, html, 'utf8');
          console.log(`✅ [${file}] başarıyla güncellendi ve kaydedildi.`);
        }
      } catch (err) {
        console.error(`Error parsing JSON in ${file}:`, err.message);
      }
    }
  });
}

console.log('--- RECONCILING Web Sitem/testler ---');
reconcileTestsInDir('testler');

console.log('--- RECONCILING ../testler ---');
reconcileTestsInDir('../testler');
