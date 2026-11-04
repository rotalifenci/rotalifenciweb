const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function createSeamlessHeadTextures() {
  const modelsDir = path.join(__dirname, '..', 'public', 'assets', 'models');
  const menuHeroPath = path.join(__dirname, '..', 'public', 'assets', 'images', 'menu_hero.jpg');

  console.log('Generating seamless 3D head textures with soft organic radial blending...');

  // 1. EREN HEAD TEXTURE (512x512)
  // Skin tone: #f5d6bf (245, 214, 191)
  // Hair tone: #5a341e (90, 52, 30)
  const erenFaceCrop = await sharp(menuHeroPath)
    .extract({ left: 215, top: 145, width: 94, height: 102 })
    .resize(360, 390, { fit: 'cover' })
    .sharpen({ sigma: 1.1 })
    .toBuffer();

  // Create smooth elliptical alpha mask for face blending (no rectangular box edges!)
  const maskW = 360;
  const maskH = 390;
  const maskRaw = Buffer.alloc(maskW * maskH);
  for (let y = 0; y < maskH; y++) {
    const ny = (y - maskH * 0.5) / (maskH * 0.48);
    for (let x = 0; x < maskW; x++) {
      const nx = (x - maskW * 0.5) / (maskW * 0.46);
      const dist = Math.sqrt(nx * nx + ny * ny);
      let alpha = 255;
      if (dist > 0.70) {
        alpha = Math.max(0, Math.min(255, Math.round((1 - (dist - 0.70) / 0.30) * 255)));
      }
      maskRaw[y * maskW + x] = alpha;
    }
  }

  const maskedErenFace = await sharp(erenFaceCrop)
    .ensureAlpha()
    .composite([{
      input: await sharp(maskRaw, { raw: { width: maskW, height: maskH, channels: 1 } }).png().toBuffer(),
      blend: 'dest-in'
    }])
    .png()
    .toBuffer();

  // 512x512 base skin background
  const baseSkinEren = Buffer.alloc(512 * 512 * 3);
  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const idx = (y * 512 + x) * 3;
      // Top fades to hair color, bottom/middle is skin
      if (y < 120) {
        const ht = y / 120;
        baseSkinEren[idx] = Math.round(90 * (1 - ht) + 245 * ht);
        baseSkinEren[idx + 1] = Math.round(52 * (1 - ht) + 214 * ht);
        baseSkinEren[idx + 2] = Math.round(30 * (1 - ht) + 191 * ht);
      } else {
        baseSkinEren[idx] = 245;
        baseSkinEren[idx + 1] = 214;
        baseSkinEren[idx + 2] = 191;
      }
    }
  }

  await sharp(baseSkinEren, { raw: { width: 512, height: 512, channels: 3 } })
    .composite([{ input: maskedErenFace, left: 76, top: 65, blend: 'over' }])
    .jpeg({ quality: 95 })
    .toFile(path.join(modelsDir, 'eren_head_seamless.jpg'));

  console.log('Saved eren_head_seamless.jpg');

  // 2. AYBÜKE HEAD TEXTURE (512x512)
  const aybukeHeadCrop = await sharp(menuHeroPath)
    .extract({ left: 590, top: 110, width: 240, height: 240 })
    .toBuffer();
  const aybukeRotated = await sharp(aybukeHeadCrop)
    .rotate(16)
    .toBuffer();
  const aybukeFaceCrop = await sharp(aybukeRotated)
    .extract({ left: 110, top: 65, width: 115, height: 115 })
    .resize(370, 370, { fit: 'cover' })
    .sharpen({ sigma: 1.1 })
    .toBuffer();

  const maskAybuke = Buffer.alloc(370 * 370);
  for (let y = 0; y < 370; y++) {
    const ny = (y - 185) / 180;
    for (let x = 0; x < 370; x++) {
      const nx = (x - 185) / 175;
      const dist = Math.sqrt(nx * nx + ny * ny);
      let alpha = 255;
      if (dist > 0.68) {
        alpha = Math.max(0, Math.min(255, Math.round((1 - (dist - 0.68) / 0.32) * 255)));
      }
      maskAybuke[y * 370 + x] = alpha;
    }
  }

  const maskedAybukeFace = await sharp(aybukeFaceCrop)
    .ensureAlpha()
    .composite([{
      input: await sharp(maskAybuke, { raw: { width: 370, height: 370, channels: 1 } }).png().toBuffer(),
      blend: 'dest-in'
    }])
    .png()
    .toBuffer();

  const baseSkinAybuke = Buffer.alloc(512 * 512 * 3);
  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const idx = (y * 512 + x) * 3;
      // Top has crimson headscarf tone (#9b1828), sides/center skin
      if (y < 90) {
        const ht = y / 90;
        baseSkinAybuke[idx] = Math.round(155 * (1 - ht) + 246 * ht);
        baseSkinAybuke[idx + 1] = Math.round(24 * (1 - ht) + 216 * ht);
        baseSkinAybuke[idx + 2] = Math.round(40 * (1 - ht) + 193 * ht);
      } else {
        baseSkinAybuke[idx] = 246;
        baseSkinAybuke[idx + 1] = 216;
        baseSkinAybuke[idx + 2] = 193;
      }
    }
  }

  await sharp(baseSkinAybuke, { raw: { width: 512, height: 512, channels: 3 } })
    .composite([{ input: maskedAybukeFace, left: 71, top: 70, blend: 'over' }])
    .jpeg({ quality: 95 })
    .toFile(path.join(modelsDir, 'aybuke_head_seamless.jpg'));

  console.log('Saved aybuke_head_seamless.jpg');
}

createSeamlessHeadTextures().catch(console.error);
