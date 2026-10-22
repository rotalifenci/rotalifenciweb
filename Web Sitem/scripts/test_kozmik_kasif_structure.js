const fs = require('fs');

const path = 'oyunlar/kozmik-kasif-3d.html';
const content = fs.readFileSync(path, 'utf8');

console.log('Total characters in kozmik-kasif-3d.html:', content.length);

// Check if all needed elements exist in the html
const checkIds = [
  'modal-question', 'q-category-tag', 'q-title', 'q-body', 'q-options', 'q-feedback',
  'center-interaction-prompt', 'prompt-action-text', 'prompt-btn-text',
  'widget-moon', 'moon-temp-val', 'moon-temp-bar',
  'modal-missions', 'missions-list-container', 'modal-completed-count', 'btn-open-cert',
  'mission-counter', 'score-counter'
];

checkIds.forEach(id => {
  console.log(id + ' exists: ' + content.includes('id="' + id + '"'));
});
