const sharp = require('sharp');
const fs = require('fs');

async function processEren() {
  const input = 'C:/Users/my pc/.gemini/antigravity/brain/03f413f9-7691-4ee7-91af-b86ce64f3df4/.user_uploaded/media_1793474721842_23b1f831.jpg';
  
  // Precise crop box for Eren
  const cropBox = { left: 190, top: 140, width: 170, height: 505 };
  
  const { data, info } = await sharp(input)
    .extract(cropBox)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const out = Buffer.from(data);

  // Background segmentation:
  // Eren's bounds horizontally:
  // Head: y 0..120, x roughly 40..130
  // Torso / arms: y 120..270, x roughly 22..155
  // Legs: y 270..450, left leg x 35..75, right leg x 95..145 (gap in between x 75..95)
  // Boots: y 450..500, left boot x 25..80, right boot x 95..155

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      let isBg = false;

      // 1. Outside Eren's general envelope
      // Head region (y < 125)
      if (y < 125) {
        // Head is roughly from x=45 to x=125
        if (x < 42 || x > 130) isBg = true;
        // Above hair
        if (y < 12) isBg = true;
        // Mountain background colors (bluish or desaturated warm rock)
        if (x < 55 && y < 65) isBg = true;
        if (x > 120 && y < 70) isBg = true;
      }
      
      // Upper body & arms (y 125..275)
      else if (y < 275) {
        // Left of his backpack / arm: x < 20
        if (x < 18) isBg = true;
        // Right of his elbow: x > 158
        if (x > 158) isBg = true;
        // Parchment card on the left (very light cream)
        if (x < 36 && r > 210 && g > 180 && b > 140) isBg = true;
        // Parchment scroll on the right
        if (x > 145 && r > 200 && g > 160) isBg = true;
      }

      // Waist and legs (y 275..455)
      else if (y < 455) {
        // Left of left leg
        if (x < 24) isBg = true;
        // Right of right leg
        if (x > 150) isBg = true;
        // Parchment on left
        if (x < 38 && r > 200 && g > 170) isBg = true;
        // Parchment on right
        if (x > 136 && r > 180 && g > 140 && b > 90) isBg = true;
        // Gap between legs (x between ~74 and ~96)
        if (x > 75 && x < 97 && y > 300) {
          // If color is the light stone wall/ground
          if (r > 160 && g > 120) isBg = true;
        }
      }

      // Boots and ground (y >= 455)
      else {
        // Left of left boot
        if (x < 22) isBg = true;
        // Right of right boot
        if (x > 158) isBg = true;
        // Below boots
        if (y > 498) isBg = true;
        // Gap between boots
        if (x > 78 && x < 96 && y > 440) {
          if (r > 170 && g > 130) isBg = true;
        }
      }

      // Parchment color detector (cream paper [230..255, 190..235, 140..195])
      if ((x < 35 || x > 138) && r > 210 && g > 175 && b > 130) {
        isBg = true;
      }

      if (isBg) {
        out[idx + 3] = 0; // Transparent
      } else {
        out[idx + 3] = 255;
      }
    }
  }

  await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toFile('public/assets/images/eren_cutout.png');

  console.log('Eren cutout created.');
}

async function processAybuke() {
  const input = 'C:/Users/my pc/.gemini/antigravity/brain/03f413f9-7691-4ee7-91af-b86ce64f3df4/.user_uploaded/media_1793474721842_23b1f831.jpg';
  
  // Precise crop box for Aybüke
  const cropBox = { left: 590, top: 165, width: 215, height: 480 };
  
  const { data, info } = await sharp(input)
    .extract(cropBox)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const out = Buffer.from(data);

  // Aybüke's bounds horizontally:
  // Headdress top: y 0..100, x 70..170
  // Face & shoulders: y 100..200, x 45..195
  // Vest & dress: y 200..380, x 40..200
  // Dress bottom & shoes: y 380..475, x 40..185

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      let isBg = false;

      // Top headdress area (y < 95)
      if (y < 95) {
        if (x < 65 || x > 175) isBg = true;
        if (y < 12) isBg = true;
      }
      // Upper body & book (y 95..250)
      else if (y < 250) {
        if (x < 22 || x > 198) isBg = true;
        // Left parchment
        if (x < 38 && r > 200 && g > 160 && b > 110) isBg = true;
        // Right card
        if (x > 185 && r > 210 && g > 175) isBg = true;
      }
      // Dress / skirt (y 250..410)
      else if (y < 410) {
        if (x < 20 || x > 190) isBg = true;
        if (x < 32 && r > 200 && g > 160) isBg = true;
        if (x > 178 && r > 200 && g > 160) isBg = true;
      }
      // Shoes / bottom (y >= 410)
      else {
        if (x < 28 || x > 185) isBg = true;
        if (y > 470) isBg = true;
      }

      // Cream parchment card detection
      if ((x < 32 || x > 180) && r > 215 && g > 180 && b > 140) {
        isBg = true;
      }

      if (isBg) {
        out[idx + 3] = 0;
      } else {
        out[idx + 3] = 255;
      }
    }
  }

  await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toFile('public/assets/images/aybuke_cutout.png');

  console.log('Aybüke cutout created.');
}

async function run() {
  await processEren();
  await processAybuke();
}
run();
