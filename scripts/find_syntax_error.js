const fs = require('fs');
const vm = require('vm');

const app = fs.readFileSync('js/app.js', 'utf8');
try {
  new vm.Script(app);
  console.log('Valid!');
} catch (e) {
  console.error(e.message);
  console.error(e.stack);
}
