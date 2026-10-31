const fs = require('fs');
const path = require('path');
const { buildZKitapHtml, escapeHtml, formatQuestionStem } = require('./zkitap_engine.js');

// Logo data loader
let LOGO_SRC = '/assets/rotali-fenci-logo.jpg';
try {
  const logoPath = path.join(__dirname, '..', 'assets', 'rotali-fenci-logo.jpg');
  if (fs.existsSync(logoPath)) {
    LOGO_SRC = 'data:image/jpeg;base64,' + fs.readFileSync(logoPath).toString('base64');
  }
} catch (e) {}

function unescapeHtml(str) {
  return String(str || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'");
}

function parseQuestionsFromHtml(html) {
  const questions = [];

  // 1. Check legacy question-block format
  if (html.includes('<div class="question-block"')) {
    const parts = html.split('<div class="question-block"');
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      const attrEnd = part.indexOf('>');
      const attrStr = part.substring(0, attrEnd);
      const innerHtml = part.substring(attrEnd + 1);

      const qidMatch = attrStr.match(/data-qid="([^"]*)"/);
      const typeMatch = attrStr.match(/data-type="([^"]*)"/);
      const correctMatch = attrStr.match(/data-correct="([^"]*)"/);
      const explMatch = attrStr.match(/data-explanation="([^"]*)"/);

      const qid = qidMatch ? qidMatch[1] : (questions.length + 1);
      const type = typeMatch ? typeMatch[1] : 'multiple_choice';
      const correct = correctMatch ? unescapeHtml(correctMatch[1]) : '';
      const explanation = explMatch ? unescapeHtml(explMatch[1]) : '';

      let visualSvg = '';
      const visualMatch = innerHtml.match(/<div class="question-visual-box">([\s\S]*?)<\/div>/);
      if (visualMatch) visualSvg = visualMatch[1].trim();

      let questionText = '';
      const textMatch = innerHtml.match(/<div class="q-text">([\s\S]*?)<\/div>/);
      if (textMatch) questionText = unescapeHtml(textMatch[1].trim());

      let options = null;
      if (type === 'multiple_choice') {
        options = {};
        const optRegex = /<label class="opt-label"[^>]*data-opt="([ABCD])"[^>]*>[\s\S]*?<span class="opt-text">([\s\S]*?)<\/span>/g;
        let optMatch;
        while ((optMatch = optRegex.exec(innerHtml)) !== null) {
          options[optMatch[1]] = unescapeHtml(optMatch[2].trim());
        }
        if (Object.keys(options).length === 0) {
          const altOptRegex = /<span class="opt-circle">([ABCD])<\/span>\s*<span class="opt-text">([\s\S]*?)<\/span>/g;
          while ((optMatch = altOptRegex.exec(innerHtml)) !== null) {
            options[optMatch[1]] = unescapeHtml(optMatch[2].trim());
          }
        }
      }

      questions.push({
        id: parseInt(qid, 10) || (questions.length + 1),
        type,
        question: questionText,
        options,
        correct_answer: correct,
        explanation,
        visual_svg: visualSvg
      });
    }
  }

  // 2. Check previous yp-space-slide-section format
  if (questions.length === 0 && html.includes('yp-space-slide-section')) {
    const slideParts = html.split(/<section[^>]+class=["'][^"']*yp-space-slide-section/);
    for (let i = 1; i < slideParts.length; i++) {
      const sPart = slideParts[i];
      const qNum = i;

      let qText = '';
      const cardMatch = sPart.match(/<div class="yp-neon-card[^"]*">([\s\S]*?)<\/div>/);
      if (cardMatch) {
        qText = unescapeHtml(cardMatch[1].replace(/<strong>Soru\s*\d+:<\/strong>/i, '').trim());
        for (let k = 0; k < 4; k++) qText = qText.replace(/<\/?div[^>]*>/gi, '').trim();
      }

      let visualSvg = '';
      const vMatch = sPart.match(/<div class="yp-space-visual-frame">([\s\S]*?)<\/div>/);
      if (vMatch) visualSvg = vMatch[1].trim();

      let correctAns = '';
      let expl = '';
      const goldenMatch = sPart.match(/<div class="yp-golden-rule-content">[\s\S]*?<span>(?:Do[ğg]ru Cevap|Cevap):\s*(.*?)\s*(?:—|–|-)\s*([\s\S]*?)<\/span>/i) ||
                          sPart.match(/<div class="yp-golden-rule-content">[\s\S]*?<span>([\s\S]*?)<\/span>/i);
      if (goldenMatch) {
        if (goldenMatch[2] !== undefined) {
          correctAns = unescapeHtml(goldenMatch[1].trim());
          expl = unescapeHtml(goldenMatch[2].trim());
        } else {
          correctAns = unescapeHtml(goldenMatch[1].trim());
        }
      }

      let options = null;
      let type = 'short_answer';
      if (sPart.includes('slide-options-grid')) {
        type = 'multiple_choice';
        options = {};
        const optRegex = /<div class="slide-opt-card[^"]*"[^>]*data-opt="([ABCD])"[^>]*>[\s\S]*?<span class="slide-opt-text">([\s\S]*?)<\/span>/g;
        let optM;
        while ((optM = optRegex.exec(sPart)) !== null) {
          options[optM[1]] = unescapeHtml(optM[2].trim());
        }
      } else if (sPart.includes('slide-open-ended-box')) {
        type = 'open_ended';
      }

      questions.push({
        id: qNum,
        type,
        question: qText,
        options,
        correct_answer: correctAns,
        explanation: expl,
        visual_svg: visualSvg
      });
    }
  }

  // 3. Check zk-slide-section format (Z-Kitap)
  if (questions.length === 0 && html.includes('zk-slide-section')) {
    const zkParts = html.split(/<section[^>]+class=["'][^"']*zk-slide-section/);
    for (let i = 1; i < zkParts.length; i++) {
      const zPart = zkParts[i];
      const qNum = i;

      let qText = '';
      const stemMatch = zPart.match(/<div class="zk-question-stem[^"]*">([\s\S]*?)<\/div>/);
      if (stemMatch) {
        qText = unescapeHtml(stemMatch[1].replace(/<strong>\s*\d+\.\s*<\/strong>/i, '').trim());
      }

      let visualSvg = '';
      const vMatch = zPart.match(/<div class="zk-visual-container">([\s\S]*?)<\/div>/);
      if (vMatch) visualSvg = vMatch[1].trim();

      let correctAns = '';
      let expl = '';
      const cMatch = zPart.match(/<span class="zk-correct-val">([\s\S]*?)<\/span>/i);
      if (cMatch) correctAns = unescapeHtml(cMatch[1].trim());
      const eMatch = zPart.match(/<p class="zk-expl-text">([\s\S]*?)<\/p>/i);
      if (eMatch) expl = unescapeHtml(eMatch[1].trim());

      let options = null;
      let type = 'short_answer';
      if (zPart.includes('zk-options-list')) {
        type = 'multiple_choice';
        options = {};
        const optRegex = /<div class="zk-option-item[^"]*"[^>]*data-opt="([ABCD])"[^>]*>[\s\S]*?<span class="zk-opt-text">([\s\S]*?)<\/span>/g;
        let optM;
        while ((optM = optRegex.exec(zPart)) !== null) {
          options[optM[1]] = unescapeHtml(optM[2].trim());
        }
      } else if (zPart.includes('zk-open-textarea')) {
        type = 'open_ended';
      }

      questions.push({
        id: qNum,
        type,
        question: qText,
        options,
        correct_answer: correctAns,
        explanation: expl,
        visual_svg: visualSvg
      });
    }
  }

  return questions;
}

// Unit name mappings for clean Maarif display
function detectGradeAndUnit(fileName, html) {
  let grade = "5";
  let unit = "1. Ünite: Gökyüzündeki Komşularımız ve Biz";

  if (fileName.startsWith('6-sinif') || html.includes('6. SINIF') || html.includes('6. Sınıf')) {
    grade = "6";
    unit = "1. Ünite: Güneş Sistemi ve Tutulmalar";
  } else if (fileName.startsWith('7-sinif') || html.includes('7. SINIF') || html.includes('7. Sınıf')) {
    grade = "7";
    unit = "1. Ünite: Uzay Çağı";
  }

  // Check specific unit mentions
  if (fileName.includes('2-unite') || html.includes('2. ÜNİTE')) {
    if (grade === "5") unit = "2. Ünite: Kuvveti Tanıyalım";
    if (grade === "6") unit = "2. Ünite: Kuvvetin Etkisinde Hareket";
    if (grade === "7") unit = "2. Ünite: Kuvvet ve Enerjiyi Keşfedelim";
  }

  return { grade, unit };
}

function detectTitle(fileName, html) {
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (titleMatch) {
    let t = titleMatch[1].replace(/- Rotalı Fenci.*$/i, '').trim();
    if (t) return t;
  }
  return path.basename(fileName, '.html').replace(/-/g, ' ');
}

// Rebuild ALL test files in testler/
function rebuildAllTests() {
  const targetDirs = ['testler', '../testler'];
  let count = 0;

  targetDirs.forEach(dirPath => {
    if (!fs.existsSync(dirPath)) return;
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.html'));
    console.log(`\n📂 Scanning ${dirPath}: Found ${files.length} test files...`);

    files.forEach(f => {
      const fullPath = path.join(dirPath, f);
      try {
        const rawHtml = fs.readFileSync(fullPath, 'utf8');
        const questions = parseQuestionsFromHtml(rawHtml);

        if (questions.length === 0) {
          console.warn(`⚠️ No questions parsed in ${f}, skipping.`);
          return;
        }

        const { grade, unit } = detectGradeAndUnit(f, rawHtml);
        const title = detectTitle(f, rawHtml);

        const newHtml = buildZKitapHtml({
          title,
          grade,
          unit,
          subject: 'Fen Bilimleri',
          questions,
          logoSrc: LOGO_SRC
        });

        fs.writeFileSync(fullPath, newHtml, 'utf8');
        console.log(`✅ [${grade}. Sınıf • ${questions.length} Soru] Rebuilt in Z-Kitap Mode: ${f}`);
        count++;
      } catch (err) {
        console.error(`❌ Error rebuilding ${f}:`, err.message);
      }
    });
  });

  console.log(`\n🎉 Rebuild complete! Upgraded ${count} test files to Z-Kitap Soru Gösterim Modu.`);
}

rebuildAllTests();

module.exports = {
  buildZKitapHtml,
  parseQuestionsFromHtml,
  rebuildAllTests
};
