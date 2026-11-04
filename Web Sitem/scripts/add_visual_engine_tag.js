const fs = require('fs');

['yaprak-test.html', '../yaprak-test.html'].forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');
  const target = '<script src="js/question_preparation_state.js?v=20261101"></script>';
  const replacement = '<script src="js/question_preparation_state.js?v=20261101"></script>\n  <script src="js/visual_match_engine.js?v=20261101"></script>';
  if (!content.includes('visual_match_engine.js')) {
    content = content.replace(target, replacement);
    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated:', f);
  }
});
