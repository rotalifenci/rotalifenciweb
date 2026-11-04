const sharp = require('sharp');

async function testOverlay() {
  const width = 1024, height = 683;
  const svg = `
    <svg width="${width}" height="${height}">
      <!-- Eren box -->
      <rect x="36" y="145" width="330" height="465" rx="24" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" stroke-width="4" />
      <!-- Aybüke box -->
      <rect x="605" y="145" width="375" height="465" rx="24" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" stroke-width="4" />
      <!-- Başla button box -->
      <rect x="385" y="528" width="224" height="52" rx="26" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" stroke-width="3" />
    </svg>
  `;

  await sharp('public/assets/images/menu_hero.jpg')
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg()
    .toFile('C:/Users/my pc/.gemini/antigravity/brain/03f413f9-7691-4ee7-91af-b86ce64f3df4/scratch/bounds_test.jpg');

  console.log('Bounds test generated!');
}
testOverlay();
