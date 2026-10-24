const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'js', 'app.js');
console.log('Path exists:', fs.existsSync(appPath));
const content = fs.readFileSync(appPath, 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.includes('admin-nav-container') || l.includes('admin-mobile-nav') || l.includes('triggerUploadModal') || l.includes('isAdminLoggedIn')) {
        console.log(`${i+1}: ${l.trim().slice(0, 100)}`);
    }
}
