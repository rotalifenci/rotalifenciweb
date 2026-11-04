const fs = require('fs');
const https = require('https');

const html = fs.readFileSync('c:/Users/my pc/.gemini/antigravity/brain/03f413f9-7691-4ee7-91af-b86ce64f3df4/.system_generated/steps/3249/output.txt', 'utf8');
const chunks = Array.from(html.matchAll(/https:\/\/cdn\.meshy\.ai\/webapp-build-assets\/production\/_next\/static\/chunks\/[a-zA-Z0-9_\-]+\.js/g)).map(m => m[0]);

async function findMeshyLoader() {
  console.log('Searching', chunks.length, 'chunks for "cdn-models" or "model.meshy"...');
  for (const url of chunks) {
    try {
      const content = await new Promise((resolve, reject) => {
        https.get(url, res => {
          let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(d));
        }).on('error', reject);
      });

      if (content.includes('cdn-models') || content.includes('model.meshy') || content.includes('.meshy?')) {
        console.log('FOUND IN CHUNK:', url);
        const idx = content.indexOf('cdn-models') !== -1 ? content.indexOf('cdn-models') : content.indexOf('model.meshy');
        console.log('Context:', content.slice(Math.max(0, idx - 150), idx + 250));
        fs.writeFileSync('meshy_loader.js', content);
        return;
      }
    } catch(e) {}
  }
  console.log('Not found in static chunks, checking wasm or worker...');
}

findMeshyLoader().catch(console.error);
