const fs = require('fs');
const path = require('path');

const code = fs.readFileSync(path.join(process.cwd(), 'js/app.js'), 'utf8');

// Try compiling line by line or find exact line of error using esprima or node vm
const vm = require('vm');
try {
  new vm.Script(code, { filename: 'js/app.js' });
} catch (err) {
  console.log('Error stack:', err.stack);
}
