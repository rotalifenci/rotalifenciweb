const fs = require('fs');
const assert = require('assert');

const appJs = fs.readFileSync('./js/app.js', 'utf8');

assert(appJs.includes('rotali-reload-prompt-banner'), 'app.js must contain rotali-reload-prompt-banner');
assert(appJs.includes('function showReloadPrompt'), 'app.js must define showReloadPrompt');
assert(appJs.includes('function triggerHardPageReload'), 'app.js must define triggerHardPageReload');
assert(appJs.includes('function dismissReloadPrompt'), 'app.js must define dismissReloadPrompt');
assert(appJs.includes('window.showReloadPrompt = showReloadPrompt'), 'must be exported on window');

console.log('✔ All reload prompt assertions passed successfully!');
