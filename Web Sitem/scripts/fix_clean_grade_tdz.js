const fs = require('fs');

function fixPublishApi(filePath) {
  let raw = fs.readFileSync(filePath, 'utf8');
  const isCrlf = raw.includes('\r\n');
  let code = raw.replace(/\r\n/g, '\n');

  const target = `    // Deduplication check
    const dedupKey = \`\${cleanGrade || grade}_\${targetSection}_\${title}_\${questions.length}\`;
    const now = Date.now();
    if (recentPublishes.has(dedupKey) && (now - recentPublishes.get(dedupKey).time < 5000)) {
      return res.status(200).json(recentPublishes.get(dedupKey).data);
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "Yayınlanacak soru listesi eksik." });
    }

    const cleanGrade = String(grade).replace(/^grade-/, '').trim() || "5";
    const cleanSection = String(targetSection).replace(/^unit/i, '').replace(/[^0-9]/g, '') || "1";
    const finalCategory = category === "denemeler" ? "denemeler" : "soru-bankasi";`;

  const replacement = `    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "Yayınlanacak soru listesi eksik." });
    }

    const cleanGrade = String(grade).replace(/^grade-/, '').trim() || "5";
    const cleanSection = String(targetSection).replace(/^unit/i, '').replace(/[^0-9]/g, '') || "1";
    const finalCategory = category === "denemeler" ? "denemeler" : "soru-bankasi";

    // Deduplication check
    const dedupKey = \`\${cleanGrade}_\${cleanSection}_\${title}_\${questions.length}\`;
    const now = Date.now();
    if (recentPublishes.has(dedupKey) && (now - recentPublishes.get(dedupKey).time < 5000)) {
      return res.status(200).json(recentPublishes.get(dedupKey).data);
    }`;

  if (code.includes(target)) {
    code = code.replace(target, replacement);
    if (isCrlf) code = code.replace(/\n/g, '\r\n');
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`Successfully fixed cleanGrade TDZ in ${filePath}`);
  } else {
    console.error(`Target not found in ${filePath}`);
  }
}

fixPublishApi('api/publish-test.js');
fixPublishApi('../api/publish-test.js');
