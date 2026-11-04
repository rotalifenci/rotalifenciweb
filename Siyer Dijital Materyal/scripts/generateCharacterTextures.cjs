const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function makePerfectTextures() {
  const outDir = path.join(__dirname, '..', 'public', 'assets', 'textures');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const erenRef = path.join(__dirname, '..', 'public', 'assets', 'images', 'eren_referans.png');
  const aybukeRef = path.join(__dirname, '..', 'public', 'assets', 'images', 'aybuke_referans.png');

  // 1. EREN FACE (Tight crop so face fills the front of head!)
  // Eren face center is x: 260, y: 155. Crop tighter: x: 165, y: 70, w: 190, h: 180
  const erenCrop = await sharp(erenRef)
    .extract({ left: 165, top: 70, width: 190, height: 180 })
    .resize(512, 512, { fit: 'fill' })
    .toBuffer();

  const maskSvg = Buffer.from(
    '<svg width="512" height="512">' +
    '  <defs>' +
    '    <radialGradient id="g1" cx="50%" cy="50%" r="50%">' +
    '      <stop offset="76%" stop-color="white" stop-opacity="1" />' +
    '      <stop offset="93%" stop-color="white" stop-opacity="0.8" />' +
    '      <stop offset="100%" stop-color="white" stop-opacity="0" />' +
    '    </radialGradient>' +
    '  </defs>' +
    '  <ellipse cx="256" cy="256" rx="240" ry="240" fill="url(#g1)" />' +
    '</svg>'
  );

  const featheredEren = await sharp(erenCrop)
    .composite([{ input: maskSvg, blend: 'dest-in' }])
    .toBuffer();

  const erenSkinBase = Buffer.from(
    '<svg width="512" height="512">' +
    '  <rect width="512" height="512" fill="#f5cbb0" />' +
    '</svg>'
  );

  await sharp(erenSkinBase)
    .composite([{ input: featheredEren, left: 0, top: 0 }])
    .png()
    .toFile(path.join(outDir, 'eren_face.png'));

  console.log('eren_face.png perfected');

  // 2. AYBUKE FACE (Tight crop so glowing smile & eyes fill the front of head!)
  // Aybüke face: x: 155, y: 65, w: 180, h: 175
  const aybukeCrop = await sharp(aybukeRef)
    .extract({ left: 155, top: 65, width: 180, height: 175 })
    .resize(512, 512, { fit: 'fill' })
    .toBuffer();

  const featheredAybuke = await sharp(aybukeCrop)
    .composite([{ input: maskSvg, blend: 'dest-in' }])
    .toBuffer();

  const aybukeSkinBase = Buffer.from(
    '<svg width="512" height="512">' +
    '  <rect width="512" height="512" fill="#fae0ce" />' +
    '</svg>'
  );

  await sharp(aybukeSkinBase)
    .composite([{ input: featheredAybuke, left: 0, top: 0 }])
    .png()
    .toFile(path.join(outDir, 'aybuke_face.png'));

  console.log('aybuke_face.png perfected');

  // 3. EREN VEST - Clean high-res safari vest texture WITHOUT hands!
  const erenVestSvg = Buffer.from(
    '<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">' +
    '  <rect width="512" height="512" fill="#585e33" />' +
    '  <polygon points="170,0 342,0 256,220" fill="#f0e5cb" />' +
    '  <line x1="256" y1="70" x2="256" y2="512" stroke="#e2d5b6" stroke-width="4" />' +
    '  <circle cx="256" cy="120" r="7" fill="#c4b595" />' +
    '  <circle cx="256" cy="170" r="7" fill="#c4b595" />' +
    '  <circle cx="256" cy="230" r="7" fill="#c4b595" />' +
    '  <polygon points="170,0 256,220 230,220 140,0" fill="#424824" />' +
    '  <polygon points="342,0 256,220 282,220 372,0" fill="#424824" />' +
    '  <line x1="170" y1="0" x2="256" y2="220" stroke="#381e0e" stroke-width="6" />' +
    '  <line x1="342" y1="0" x2="256" y2="220" stroke="#381e0e" stroke-width="6" />' +
    '  <line x1="256" y1="220" x2="256" y2="512" stroke="#381e0e" stroke-width="6" />' +
    '  <rect x="55" y="290" width="135" height="155" rx="14" fill="#4e542c" stroke="#381e0e" stroke-width="4" />' +
    '  <polygon points="45,290 200,290 190,325 55,325" fill="#381e0e" />' +
    '  <circle cx="122" cy="312" r="9" fill="#dfb430" />' +
    '  <rect x="322" y="290" width="135" height="155" rx="14" fill="#4e542c" stroke="#381e0e" stroke-width="4" />' +
    '  <polygon points="312,290 467,290 457,325 322,325" fill="#381e0e" />' +
    '  <circle cx="390" cy="312" r="9" fill="#dfb430" />' +
    '  <circle cx="256" cy="270" r="11" fill="#dfb430" stroke="#8a6d14" stroke-width="2" />' +
    '  <circle cx="256" cy="345" r="11" fill="#dfb430" stroke="#8a6d14" stroke-width="2" />' +
    '  <circle cx="256" cy="420" r="11" fill="#dfb430" stroke="#8a6d14" stroke-width="2" />' +
    '</svg>'
  );

  await sharp(erenVestSvg).png().toFile(path.join(outDir, 'eren_vest.png'));
  console.log('eren_vest.png perfected');

  // 4. AYBUKE VEST - Crimson velvet with gold embroidery floral border WITHOUT hands!
  const aybukeVestSvg = Buffer.from(
    '<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">' +
    '  <rect width="512" height="512" fill="#ba1622" />' +
    '  <rect x="180" y="0" width="152" height="512" fill="#f5eedc" />' +
    '  <line x1="218" y1="0" x2="218" y2="512" stroke="#e5dac0" stroke-width="4" />' +
    '  <line x1="256" y1="0" x2="256" y2="512" stroke="#dbcca8" stroke-width="4" />' +
    '  <line x1="294" y1="0" x2="294" y2="512" stroke="#e5dac0" stroke-width="4" />' +
    '  <rect x="0" y="0" width="180" height="512" fill="#ba1622" />' +
    '  <rect x="160" y="0" width="20" height="512" fill="#dfb430" />' +
    '  <line x1="160" y1="0" x2="160" y2="512" stroke="#8c111a" stroke-width="4" />' +
    '  <circle cx="90" cy="140" r="24" fill="none" stroke="#dfb430" stroke-width="6" />' +
    '  <circle cx="90" cy="140" r="8" fill="#dfb430" />' +
    '  <circle cx="90" cy="280" r="32" fill="none" stroke="#dfb430" stroke-width="6" />' +
    '  <circle cx="90" cy="280" r="10" fill="#dfb430" />' +
    '  <circle cx="90" cy="420" r="24" fill="none" stroke="#dfb430" stroke-width="6" />' +
    '  <circle cx="90" cy="420" r="8" fill="#dfb430" />' +
    '  <rect x="332" y="0" width="180" height="512" fill="#ba1622" />' +
    '  <rect x="332" y="0" width="20" height="512" fill="#dfb430" />' +
    '  <line x1="352" y1="0" x2="352" y2="512" stroke="#8c111a" stroke-width="4" />' +
    '  <circle cx="422" cy="140" r="24" fill="none" stroke="#dfb430" stroke-width="6" />' +
    '  <circle cx="422" cy="140" r="8" fill="#dfb430" />' +
    '  <circle cx="422" cy="280" r="32" fill="none" stroke="#dfb430" stroke-width="6" />' +
    '  <circle cx="422" cy="280" r="10" fill="#dfb430" />' +
    '  <circle cx="422" cy="420" r="24" fill="none" stroke="#dfb430" stroke-width="6" />' +
    '  <circle cx="422" cy="420" r="8" fill="#dfb430" />' +
    '  <rect x="0" y="490" width="512" height="22" fill="#dfb430" />' +
    '</svg>'
  );

  await sharp(aybukeVestSvg).png().toFile(path.join(outDir, 'aybuke_vest.png'));
  console.log('aybuke_vest.png perfected');

  // Sync to dist
  const distDir = path.join(__dirname, '..', 'dist', 'assets', 'textures');
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
  fs.copyFileSync(path.join(outDir, 'eren_face.png'), path.join(distDir, 'eren_face.png'));
  fs.copyFileSync(path.join(outDir, 'aybuke_face.png'), path.join(distDir, 'aybuke_face.png'));
  fs.copyFileSync(path.join(outDir, 'eren_vest.png'), path.join(distDir, 'eren_vest.png'));
  fs.copyFileSync(path.join(outDir, 'aybuke_vest.png'), path.join(distDir, 'aybuke_vest.png'));
  console.log('All textures copied to dist/assets/textures');
}

makePerfectTextures().catch(console.error);
