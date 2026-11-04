const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const PUBLIC_IMAGES = path.join(__dirname, '..', 'public', 'assets', 'images');
const UPLOADED_REF = 'C:/Users/my pc/.gemini/antigravity/brain/03f413f9-7691-4ee7-91af-b86ce64f3df4/.user_uploaded/media_1793807852194_b4eacb36.jpg';

async function removeSolidBackgroundFloodFill(inputPath, outputWebp, outputPng) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const visited = new Uint8Array(width * height);

  // Sample corner color
  const r0 = data[0], g0 = data[1], b0 = data[2];

  const isBg = (idx) => {
    const p = idx * 4;
    const r = data[p], g = data[p + 1], b = data[p + 2];
    const diff = Math.abs(r - r0) + Math.abs(g - g0) + Math.abs(b - b0);
    // Light gray/white background tolerance
    return diff < 42 && r > 215 && g > 215 && b > 215;
  };

  const queue = [];
  const push = (x, y) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const idx = y * width + x;
    if (visited[idx]) return;
    if (isBg(idx)) {
      visited[idx] = 1;
      queue.push(idx);
    }
  };

  // Seed all 4 borders
  for (let x = 0; x < width; x++) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    push(0, y);
    push(width - 1, y);
  }

  let head = 0;
  while (head < queue.length) {
    const idx = queue[head++];
    const x = idx % width;
    const y = (idx / width) | 0;

    // Make transparent
    data[idx * 4 + 3] = 0;

    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }

  // Soften 1px edge around background
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      if (!visited[idx]) {
        const neighborsBg =
          visited[idx - 1] +
          visited[idx + 1] +
          visited[idx - width] +
          visited[idx + width];
        if (neighborsBg > 0) {
          const p = idx * 4;
          const r = data[p], g = data[p + 1], b = data[p + 2];
          if (r > 200 && g > 200 && b > 200) {
            data[p + 3] = Math.round(data[p + 3] * 0.4);
          }
        }
      }
    }
  }

  await sharp(data, { raw: { width, height, channels: 4 } })
    .resize({ height: 640, withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 95 })
    .toFile(outputWebp);

  await sharp(data, { raw: { width, height, channels: 4 } })
    .resize({ height: 640, withoutEnlargement: true })
    .png({ compressionLevel: 8 })
    .toFile(outputPng);
}

async function run() {
  console.log('1. Optimizing Eren 3D character cutout...');
  await removeSolidBackgroundFloodFill(
    path.join(PUBLIC_IMAGES, 'eren_referans.png'),
    path.join(PUBLIC_IMAGES, 'eren_3d_clean.webp'),
    path.join(PUBLIC_IMAGES, 'eren_3d_clean.png')
  );

  console.log('2. Optimizing Aybuke 3D character cutout...');
  await sharp(path.join(PUBLIC_IMAGES, 'aybuke_referans.png'))
    .resize({ height: 640, withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 95 })
    .toFile(path.join(PUBLIC_IMAGES, 'aybuke_3d_clean.webp'));

  await sharp(path.join(PUBLIC_IMAGES, 'aybuke_referans.png'))
    .resize({ height: 640, withoutEnlargement: true })
    .png({ compressionLevel: 8 })
    .toFile(path.join(PUBLIC_IMAGES, 'aybuke_3d_clean.png'));

  console.log('3. Optimizing menu_hero.webp...');
  await sharp(path.join(PUBLIC_IMAGES, 'menu_hero.jpg'))
    .webp({ quality: 86 })
    .toFile(path.join(PUBLIC_IMAGES, 'menu_hero.webp'));

  if (fs.existsSync(UPLOADED_REF)) {
    console.log('4. Creating doors_backdrop.webp from reference image...');
    await sharp(UPLOADED_REF)
      .webp({ quality: 86 })
      .toFile(path.join(PUBLIC_IMAGES, 'doors_backdrop.webp'));
  }

  console.log('✅ All assets optimized successfully!');
}

run().catch(console.error);
