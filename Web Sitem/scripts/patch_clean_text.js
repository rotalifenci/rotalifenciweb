const fs = require('fs');

['js/yaprak-test.js', '../js/yaprak-test.js'].forEach(p => {
  if (!fs.existsSync(p)) return;
  let code = fs.readFileSync(p, 'utf8');

  // 1. cleanTurkishAndLatex in question-body
  const target1 = '<div class="question-body">${escapeHtml(q.question)}</div>';
  const repl1 = '<div class="question-body">${escapeHtml(cleanTurkishAndLatex(q.question))}</div>';
  if (code.includes(target1)) {
    code = code.replace(target1, repl1);
    console.log('Replaced target1 in', p);
  }

  // 2. Also in Z-Kitap formatQuestionStemText
  const target2 = 'function formatQuestionStemText(rawText) {';
  if (code.includes(target2)) {
    const repl2 = 'function formatQuestionStemText(rawText) {\r\n    rawText = cleanTurkishAndLatex(rawText);';
    if (!code.includes('rawText = cleanTurkishAndLatex(rawText);')) {
      code = code.replace(target2, repl2);
      console.log('Replaced target2 in', p);
    }
  }

  fs.writeFileSync(p, code, 'utf8');
});
console.log('Done!');
