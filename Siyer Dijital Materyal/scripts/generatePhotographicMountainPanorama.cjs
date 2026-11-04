const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function buildAuthenticMeccaPanorama() {
  const panoW = 2048;
  const panoH = 512;
  const outPath = path.join(__dirname, '..', 'public', 'assets', 'environment', 'mecca_mountain_panorama.jpg');

  // 1. Extract pure mountain peak slice from menu_hero (220x46)
  const menuHeroPath = path.join(__dirname, '..', 'public', 'assets', 'images', 'menu_hero.jpg');
  const mountainPeakBuffer = await sharp(menuHeroPath)
    .extract({ left: 745, top: 45, width: 220, height: 46 })
    .resize(512, 190, { fit: 'fill' })
    .toBuffer();

  const mountainPeakFlip = await sharp(mountainPeakBuffer)
    .flop()
    .toBuffer();

  // Pure rock texture for 3D meshes (512x512)
  await sharp(menuHeroPath)
    .extract({ left: 780, top: 58, width: 60, height: 60 })
    .resize(512, 512, { fit: 'cover' })
    .modulate({ brightness: 1.05, saturation: 1.15 })
    .sharpen({ sigma: 1.2 })
    .jpeg({ quality: 94 })
    .toFile(path.join(__dirname, '..', 'public', 'assets', 'environment', 'mountain_rock_detail.jpg'));

  // 2. Base Sky & Horizon gradient (2048x512)
  const skyRaw = Buffer.alloc(panoW * panoH * 3);
  for (let y = 0; y < panoH; y++) {
    const t = y / panoH; // 0 = top, 1 = bottom
    let r, g, b;
    if (t < 0.45) {
      const st = t / 0.45;
      // Sky: clear azure blue to warm horizon glow
      r = 96 * (1 - st) + 218 * st;
      g = 145 * (1 - st) + 200 * st;
      b = 210 * (1 - st) + 168 * st;
    } else {
      const st = (t - 0.45) / 0.55;
      // Horizon gold to desert valley sand
      r = 218 * (1 - st) + 217 * st;
      g = 200 * (1 - st) + 197 * st;
      b = 168 * (1 - st) + 163 * st;
    }

    for (let x = 0; x < panoW; x++) {
      const idx = (y * panoW + x) * 3;
      skyRaw[idx] = Math.round(r);
      skyRaw[idx + 1] = Math.round(g);
      skyRaw[idx + 2] = Math.round(b);
    }
  }

  // 3. Composite 4 alternating photographic mountain segments at the horizon (y = 195)
  const w4 = panoW / 4;
  await sharp(skyRaw, { raw: { width: panoW, height: panoH, channels: 3 } })
    .composite([
      { input: mountainPeakBuffer, left: 0, top: 195, blend: 'over' },
      { input: mountainPeakFlip, left: w4, top: 190, blend: 'over' },
      { input: mountainPeakBuffer, left: w4 * 2, top: 198, blend: 'over' },
      { input: mountainPeakFlip, left: w4 * 3, top: 192, blend: 'over' }
    ])
    .jpeg({ quality: 96 })
    .toFile(outPath);

  console.log('Authentic Mecca Panorama generated successfully:', outPath);
}

buildAuthenticMeccaPanorama().catch(console.error);
