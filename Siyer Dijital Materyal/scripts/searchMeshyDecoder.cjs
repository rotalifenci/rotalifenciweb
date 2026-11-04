const fs = require('fs');
const https = require('https');

// Read the html to get all chunk URLs
const html = fs.readFileSync('c:/Users/my pc/.gemini/antigravity/brain/03f413f9-7691-4ee7-91af-b86ce64f3df4/.system_generated/steps/3249/output.txt', 'utf8');
const chunks = Array.from(html.matchAll(/https:\/\/cdn\.meshy\.ai\/webapp-build-assets\/production\/_next\/static\/chunks\/[a-zA-Z0-9_\-]+\.js/g)).map(m => m[0]);
console.log('Total chunks:', chunks.length);

async function downloadAndSearch() {
  for (const url of chunks) {
    try {
      const content = await new Promise((resolve, reject) => {
        https.get(url, res => {
          let data = '';
          res.on('data', c => data += c);
          res.on('end', () => resolve(data));
        }).on('error', reject);
      });

      if (content.includes('MESHY.AI') || content.includes('.meshy') || content.includes('model.meshy')) {
        console.log('FOUND MATCH IN CHUNK:', url);
        const idx = content.indexOf('MESHY.AI') !== -1 ? content.indexOf('MESHY.AI') : content.indexOf('.meshy');
        console.log('Snippet:', content.slice(Math.max(0, idx - 200), idx + 200));
        fs.writeFileSync('meshy_decoder_chunk.js', content);
        break;
      }
    } catch (e) {
      // ignore
    }
  }
}

downloadAndSearch().catch(console.error);
