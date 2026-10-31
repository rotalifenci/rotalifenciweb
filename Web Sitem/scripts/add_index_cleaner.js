const fs = require('fs');

const files = ['index.html', '../index.html'];

files.forEach(p => {
  if (!fs.existsSync(p)) return;
  let html = fs.readFileSync(p, 'utf8');

  // Add cleanup script if not present
  if (!html.includes('rotali_test_html_cleaner')) {
    const cleanerScript = `<script id="rotali_test_html_cleaner">
    try {
      if (typeof localStorage !== 'undefined') {
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const k = localStorage.key(i);
          if (k && (k.startsWith('rotali_test_html_') || k.includes('test_html'))) {
            localStorage.removeItem(k);
          }
        }
      }
    } catch(e) {}
  </script>`;
    html = html.replace('<head>', '<head>\n  ' + cleanerScript);
  }

  // Update app.js query string
  const v = Date.now();
  html = html.replace(/js\/app\.js\?v=[^"']+/g, `js/app.js?v=${v}`);
  fs.writeFileSync(p, html, 'utf8');
  console.log('Updated', p, 'with cleaner script and cache-buster', v);
});
