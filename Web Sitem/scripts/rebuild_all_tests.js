const fs = require('fs');
const path = require('path');
const { buildZKitapHtml } = require('./zkitap_engine.js');
const { getScientificVisual } = require('./scientific_visual_engine.js');

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
  // 1. Direct JSON from rawQuestions script tag if available
  const rawQMatch = html.match(/const rawQuestions = (\[[\s\S]*?\]);/);
  if (rawQMatch) {
    try {
      const parsed = JSON.parse(rawQMatch[1]);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Also extract options from html if needed
        return parsed.map((p, idx) => {
          let options = p.options || null;
          let visualSvg = p.visual_svg || '';

          // If options missing in JSON, extract from slide
          if (!options && (p.type === 'multiple_choice' || !p.type)) {
            const slideRegex = new RegExp(`<section[^>]*id="rf-slide-${idx}"[\\s\\S]*?<\\/section>|<section[^>]*id="zk-slide-${idx}"[\\s\\S]*?<\\/section>`);
            const sMatch = html.match(slideRegex);
            if (sMatch) {
              const sHtml = sMatch[0];
              const optRegex = /data-opt="([ABCD])"[\s\S]*?<div class="rf-opt-text">([\s\S]*?)<\/div>|data-opt="([ABCD])"[\s\S]*?<span class="zk-opt-text">([\s\S]*?)<\/span>/g;
              let om;
              const extractedOpts = {};
              while ((om = optRegex.exec(sHtml)) !== null) {
                const letter = om[1] || om[3];
                const text = om[2] || om[4];
                if (letter && text) extractedOpts[letter] = unescapeHtml(text.trim());
              }
              if (Object.keys(extractedOpts).length >= 2) {
                options = extractedOpts;
              }
            }
          }

          // Extract visualSvg if missing
          if (!visualSvg) {
            const slideRegex = new RegExp(`<section[^>]*id="rf-slide-${idx}"[\\s\\S]*?<\\/section>|<section[^>]*id="zk-slide-${idx}"[\\s\\S]*?<\\/section>`);
            const sMatch = html.match(slideRegex);
            if (sMatch) {
              const vMatch = sMatch[0].match(/<div class="rf-visual-box">([\s\S]*?)<\/div>|<div class="zk-visual-container">([\s\S]*?)<\/div>/);
              if (vMatch) visualSvg = (vMatch[1] || vMatch[2]).trim();
            }
          }

          return {
            id: p.id || (idx + 1),
            type: options ? 'multiple_choice' : (p.type || 'open_ended'),
            question: p.question || `Soru ${idx + 1}`,
            options: options,
            correct_answer: p.correct || p.correct_answer || '',
            explanation: p.explanation || '',
            visual_svg: visualSvg
          };
        });
      }
    } catch(e) {}
  }

  const questions = [];

  // 2. Check rf-question-slide format
  if (html.includes('rf-question-slide')) {
    const rfParts = html.split(/<section[^>]+class=["'][^"']*rf-question-slide/);
    for (let i = 1; i < rfParts.length; i++) {
      const part = rfParts[i];
      let qText = '';
      const textMatch = part.match(/<div class="rf-stem-text">([\s\S]*?)<\/div>/);
      if (textMatch) qText = unescapeHtml(textMatch[1].trim());

      let visualSvg = '';
      const vMatch = part.match(/<div class="rf-visual-box">([\s\S]*?)<\/div>/);
      if (vMatch) visualSvg = vMatch[1].trim();

      let options = null;
      let type = 'short_answer';
      if (part.includes('rf-options-list')) {
        type = 'multiple_choice';
        options = {};
        const optRegex = /<div class="rf-option-card[^"]*"[^>]*data-opt="([ABCD])"[^>]*>[\s\S]*?<div class="rf-opt-text">([\s\S]*?)<\/div>/g;
        let om;
        while ((om = optRegex.exec(part)) !== null) {
          options[om[1]] = unescapeHtml(om[2].trim());
        }
      } else if (part.includes('rf-open-textarea')) {
        type = 'open_ended';
      }

      questions.push({
        id: i,
        type,
        question: qText,
        options,
        correct_answer: '',
        explanation: '',
        visual_svg: visualSvg
      });
    }
  }

  // 3. Check zk-slide-section format
  if (questions.length === 0 && html.includes('zk-slide-section')) {
    const zkParts = html.split(/<section[^>]+class=["'][^"']*zk-slide-section/);
    for (let i = 1; i < zkParts.length; i++) {
      const zPart = zkParts[i];
      let qText = '';
      const stemMatch = zPart.match(/<div class="zk-question-stem[^"]*">([\s\S]*?)<\/div>/);
      if (stemMatch) qText = unescapeHtml(stemMatch[1].replace(/<strong>\s*\d+\.\s*<\/strong>/i, '').trim());

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
        id: i,
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

function detectGradeAndUnit(fileName, html) {
  let grade = "5";
  let unit = "1. Ünite: Gökyüzündeki Komşularımız ve Biz";

  if (fileName.startsWith('6-sinif') || html.includes('6. SINIF') || html.includes('6. Sınıf')) {
    grade = "6";
    unit = "1. Ünite: Güneş Sistemi ve Tutulmalar";
  } else if (fileName.startsWith('7-sinif') || html.includes('7. SINIF') || html.includes('7. Sınıf')) {
    grade = "7";
    unit = "1. Ünite: Uzay Çağı";
  } else if (fileName.startsWith('8-sinif') || html.includes('8. SINIF') || html.includes('8. Sınıf') || fileName.includes('lgs')) {
    grade = "8";
    unit = "1. Ünite: Mevsimler ve İklim";
  }

  return { grade, unit };
}

function detectTitle(fileName, html) {
  const m = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (m) {
    return unescapeHtml(m[1].replace(/\s*[-|•]\s*Rotalı Fenci.*$/i, '').trim());
  }
  return path.basename(fileName, '.html').replace(/-/g, ' ');
}

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
        questions.forEach(q => { q.visual_svg = getScientificVisual(q.question, q.options, q.visual_svg); });

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
          questions
        });

        fs.writeFileSync(fullPath, newHtml, 'utf8');
        console.log(`✅ [${grade}. Sınıf • ${questions.length} Soru • ${questions.length * 2} Dk] Rebuilt in Reference Mode: ${f}`);
        count++;
      } catch (err) {
        console.error(`❌ Error rebuilding ${f}:`, err.message);
      }
    });
  });

  console.log(`\n🎉 Rebuild complete! Upgraded ${count} test files to Reference Layout & 2x Duration Mode.`);
}

rebuildAllTests();
