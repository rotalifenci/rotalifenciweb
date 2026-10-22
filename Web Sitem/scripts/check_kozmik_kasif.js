const fs = require('fs');
const path = 'oyunlar/kozmik-kasif-3d.html';
console.log('File exists:', fs.existsSync(path));
if (fs.existsSync(path)) {
  const content = fs.readFileSync(path, 'utf8');
  console.log('Size:', content.length, 'lines:', content.split('\n').length);
}
