const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function generatePBRTextures() {
  const modelsDir = path.join(__dirname, '..', 'public', 'assets', 'models');
  const envDir = path.join(__dirname, '..', 'public', 'assets', 'environment');
  if (!fs.existsSync(modelsDir)) fs.mkdirSync(modelsDir, { recursive: true });
  if (!fs.existsSync(envDir)) fs.mkdirSync(envDir, { recursive: true });

  console.log('Generating high-end stylized PBR textures for Eren & Aybüke...');

  // 1. Stylized Child Eye Iris Texture (256x256)
  function createEyeTexture(irisColorR, irisColorG, irisColorB) {
    const size = 256;
    const raw = Buffer.alloc(size * size * 4);
    const center = size / 2;
    const radius = size * 0.46;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        const dx = (x - center);
        const dy = (y - center);
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        if (dist > radius) {
          // Transparent outside cornea
          raw[idx] = 255; raw[idx + 1] = 255; raw[idx + 2] = 255; raw[idx + 3] = 0;
        } else {
          const normDist = dist / radius; // 0 at center, 1 at edge
          let r, g, b;

          if (normDist < 0.38) {
            // Pupil (deep rich black)
            r = 18; g = 14; b = 16;
          } else {
            // Iris with radial striations and depth gradient
            const irisT = (normDist - 0.38) / 0.62;
            const striation = Math.sin(angle * 32) * 12 + Math.cos(angle * 64) * 6;
            
            // Warm inner gold-amber fading to deep chestnut at the limbal ring
            const innerR = irisColorR + 35, innerG = irisColorG + 25, innerB = irisColorB;
            const outerR = irisColorR * 0.6, outerG = irisColorG * 0.5, outerB = irisColorB * 0.4;
            
            r = innerR * (1 - irisT) + outerR * irisT + striation;
            g = innerG * (1 - irisT) + outerG * irisT + striation * 0.8;
            b = innerB * (1 - irisT) + outerB * irisT + striation * 0.5;

            // Dark limbal ring at the outer perimeter
            if (irisT > 0.82) {
              const ringT = (irisT - 0.82) / 0.18;
              r = r * (1 - ringT) + 25 * ringT;
              g = g * (1 - ringT) + 18 * ringT;
              b = b * (1 - ringT) + 20 * ringT;
            }
          }

          // Sparkling primary highlight
          const hlDist = Math.sqrt(Math.pow(x - center * 0.72, 2) + Math.pow(y - center * 0.72, 2));
          if (hlDist < 18) {
            const hAlpha = Math.max(0, 1 - hlDist / 18);
            r = r * (1 - hAlpha) + 255 * hAlpha;
            g = g * (1 - hAlpha) + 255 * hAlpha;
            b = b * (1 - hAlpha) + 255 * hAlpha;
          }

          // Secondary soft reflection
          const hl2Dist = Math.sqrt(Math.pow(x - center * 1.35, 2) + Math.pow(y - center * 1.25, 2));
          if (hl2Dist < 10) {
            const h2Alpha = Math.max(0, 1 - hl2Dist / 10) * 0.65;
            r = r * (1 - h2Alpha) + 255 * h2Alpha;
            g = g * (1 - h2Alpha) + 255 * h2Alpha;
            b = b * (1 - h2Alpha) + 255 * h2Alpha;
          }

          raw[idx] = Math.min(255, Math.max(0, Math.round(r)));
          raw[idx + 1] = Math.min(255, Math.max(0, Math.round(g)));
          raw[idx + 2] = Math.min(255, Math.max(0, Math.round(b)));
          raw[idx + 3] = 255;
        }
      }
    }
    return raw;
  }

  // Aybüke warm brown eye (105, 52, 28)
  const aybukeEyeRaw = createEyeTexture(115, 60, 32);
  await sharp(aybukeEyeRaw, { raw: { width: 256, height: 256, channels: 4 } })
    .png()
    .toFile(path.join(modelsDir, 'aybuke_eye_pbr.png'));

  // Eren warm chestnut eye (125, 68, 38)
  const erenEyeRaw = createEyeTexture(130, 72, 38);
  await sharp(erenEyeRaw, { raw: { width: 256, height: 256, channels: 4 } })
    .png()
    .toFile(path.join(modelsDir, 'eren_eye_pbr.png'));

  // 2. Aybüke Crimson Velvet Vest with Gold Arabesque Filigree (512x512)
  const vestW = 512, vestH = 512;
  const vestRaw = Buffer.alloc(vestW * vestH * 3);
  for (let y = 0; y < vestH; y++) {
    for (let x = 0; x < vestW; x++) {
      const idx = (y * vestW + x) * 3;
      // Rich deep ruby velvet
      const velvet = Math.sin(x * 0.3) * Math.cos(y * 0.3) * 5;
      let r = 138 + velvet;
      let g = 18 + velvet * 0.3;
      let b = 32 + velvet * 0.4;

      // Ornate Ottoman filigree border along vertical openings and hem
      const isHem = y > 465 || y < 35;
      const isOpenBorder = Math.abs(x - 60) < 18 || Math.abs(x - (vestW - 60)) < 18;
      const arabesque = (Math.sin(x * 0.08) * Math.cos(y * 0.08) > 0.65) && (y > 100 && y < 450);

      if (isHem || isOpenBorder || arabesque) {
        // Gleaming gold thread (#dcb438 = 220, 180, 56)
        r = 225 + Math.sin(x * 0.5 + y * 0.5) * 15;
        g = 182 + Math.sin(x * 0.5 + y * 0.5) * 12;
        b = 58;
      }

      vestRaw[idx] = Math.min(255, Math.max(0, Math.round(r)));
      vestRaw[idx + 1] = Math.min(255, Math.max(0, Math.round(g)));
      vestRaw[idx + 2] = Math.min(255, Math.max(0, Math.round(b)));
    }
  }
  await sharp(vestRaw, { raw: { width: vestW, height: vestH, channels: 3 } })
    .jpeg({ quality: 94 })
    .toFile(path.join(modelsDir, 'aybuke_vest_pbr.jpg'));

  // 3. Aybüke Headscarf Crimson Velvet (512x512)
  const scarfRaw = Buffer.alloc(512 * 512 * 3);
  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const idx = (y * 512 + x) * 3;
      const v = Math.sin(x * 0.2) * Math.cos(y * 0.2) * 6;
      let r = 152 + v, g = 22 + v * 0.3, b = 38 + v * 0.4;
      // Delicate gold star embroidery pattern
      const star = (Math.abs(Math.sin(x * 0.12)) * Math.abs(Math.cos(y * 0.12))) > 0.88;
      if (star) {
        r = 228; g = 188; b = 64;
      }
      scarfRaw[idx] = Math.min(255, Math.max(0, Math.round(r)));
      scarfRaw[idx + 1] = Math.min(255, Math.max(0, Math.round(g)));
      scarfRaw[idx + 2] = Math.min(255, Math.max(0, Math.round(b)));
    }
  }
  await sharp(scarfRaw, { raw: { width: 512, height: 512, channels: 3 } })
    .jpeg({ quality: 94 })
    .toFile(path.join(modelsDir, 'aybuke_scarf_pbr.jpg'));

  // 4. Eren Olive Expedition Vest Fabric with Stitch Details (512x512)
  const erenVestRaw = Buffer.alloc(512 * 512 * 3);
  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const idx = (y * 512 + x) * 3;
      const canvasWeave = (Math.sin(x * 0.8) + Math.cos(y * 0.8)) * 4;
      // Olive expedition green (#555d3a = 85, 93, 58)
      let r = 88 + canvasWeave;
      let g = 96 + canvasWeave;
      let b = 62 + canvasWeave * 0.7;

      // Heavy brown leather trim & stitch lines
      const isTrim = (x < 24 || x > 488 || y < 20 || y > 492);
      if (isTrim) {
        r = 62; g = 42; b = 26; // Dark brown leather trim
      }

      erenVestRaw[idx] = Math.min(255, Math.max(0, Math.round(r)));
      erenVestRaw[idx + 1] = Math.min(255, Math.max(0, Math.round(g)));
      erenVestRaw[idx + 2] = Math.min(255, Math.max(0, Math.round(b)));
    }
  }
  await sharp(erenVestRaw, { raw: { width: 512, height: 512, channels: 3 } })
    .jpeg({ quality: 94 })
    .toFile(path.join(modelsDir, 'eren_vest_pbr.jpg'));

  // 5. Aged Leather Backpack Texture (512x512)
  const leatherRaw = Buffer.alloc(512 * 512 * 3);
  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const idx = (y * 512 + x) * 3;
      const grain = Math.sin(x * 0.5 + Math.cos(y * 0.3) * 3) * 6;
      let r = 78 + grain;
      let g = 46 + grain * 0.7;
      let b = 28 + grain * 0.5;

      leatherRaw[idx] = Math.min(255, Math.max(0, Math.round(r)));
      leatherRaw[idx + 1] = Math.min(255, Math.max(0, Math.round(g)));
      leatherRaw[idx + 2] = Math.min(255, Math.max(0, Math.round(b)));
    }
  }
  await sharp(leatherRaw, { raw: { width: 512, height: 512, channels: 3 } })
    .jpeg({ quality: 94 })
    .toFile(path.join(modelsDir, 'leather_backpack_pbr.jpg'));

  console.log('All PBR textures generated successfully!');
}

generatePBRTextures().catch(console.error);
