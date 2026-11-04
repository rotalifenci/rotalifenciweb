const fs = require('fs');

// ==========================================
// 1. UPDATE api/publish-test.js
// ==========================================
let pubCode = fs.readFileSync('api/publish-test.js', 'utf8');

// In-memory deduplication cache
if (!pubCode.includes('const recentPublishes = new Map();')) {
  pubCode = pubCode.replace(
    'const GITHUB_REPO = "rotalifenci/rotalifenciweb";',
    `const recentPublishes = new Map();\nconst GITHUB_REPO = "rotalifenci/rotalifenciweb";`
  );
}

// Extract additional hierarchy fields from req.body
if (!pubCode.includes('isAllOutcomes = false,')) {
  pubCode = pubCode.replace(
    '      subject = "Fen Bilimleri"\n    } = req.body || {};',
    `      subject = "Fen Bilimleri",\n      topic = "",\n      subtopic = "",\n      isAllOutcomes = false,\n      learning_outcome = "",\n      question_type = ""\n    } = req.body || {};`
  );
}

// Deduplication check
if (!pubCode.includes('// Deduplication check')) {
  pubCode = pubCode.replace(
    '    if (!questions || !Array.isArray(questions) || questions.length === 0) {',
    `    // Deduplication check\n    const dedupKey = \`\${cleanGrade || grade}_\${targetSection}_\${title}_\${questions.length}\`;\n    const now = Date.now();\n    if (recentPublishes.has(dedupKey) && (now - recentPublishes.get(dedupKey).time < 5000)) {\n      return res.status(200).json(recentPublishes.get(dedupKey).data);\n    }\n\n    if (!questions || !Array.isArray(questions) || questions.length === 0) {`
  );
}

// Add hierarchy fields to newMaterial
if (!pubCode.includes('isAllOutcomes: Boolean(isAllOutcomes),')) {
  pubCode = pubCode.replace(
    '      format: isActivity ? "ETKİNLİK" : (isOpenEnded ? "AÇIK UÇLU SINAV" : (isShortAnswer ? "KISA CEVAPLI TEST" : "YAPRAK TEST")),',
    `      format: isActivity ? "ETKİNLİK" : (isOpenEnded ? "AÇIK UÇLU SINAV" : (isShortAnswer ? "KISA CEVAPLI TEST" : "YAPRAK TEST")),
      topic: topic || unit,
      subtopic: (isAllOutcomes || subtopic === "Tüm Kazanımlar") ? "Tüm Kazanımlar" : (subtopic || "Genel"),
      isAllOutcomes: Boolean(isAllOutcomes || subtopic === "Tüm Kazanımlar"),
      learning_outcome: learning_outcome || (questions[0] && questions[0].learning_outcome) || "",`
  );
}

// Save dedup cache before returning
if (!pubCode.includes('recentPublishes.set(dedupKey,')) {
  pubCode = pubCode.replace(
    '    res.setHeader(\'Content-Type\', \'application/json; charset=utf-8\');\n    return res.status(200).json({',
    `    const responsePayload = {\n      success: true,\n      message: "Test başarıyla yayınlandı ve web sitenize eklendi.",\n      material: newMaterial,\n      fileUrl: \`testler/\${fileName}\`,\n      webSectionUrl: \`index.html#grade-\${cleanGrade}\`,\n      sectionUrl: \`index.html#grade-\${cleanGrade}\`,\n      htmlContent: htmlContent\n    };\n    recentPublishes.set(dedupKey, { time: now, data: responsePayload });\n    res.setHeader('Content-Type', 'application/json; charset=utf-8');\n    return res.status(200).json(responsePayload);`
  );
}

fs.writeFileSync('api/publish-test.js', pubCode, 'utf8');
fs.writeFileSync('../api/publish-test.js', pubCode, 'utf8');
console.log('Updated api/publish-test.js and ../api/publish-test.js');
