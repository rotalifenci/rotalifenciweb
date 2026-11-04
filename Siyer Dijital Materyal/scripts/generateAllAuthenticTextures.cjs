const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateAllTextures() {
  const modelsDir = path.join(__dirname, '..', 'public', 'assets', 'models');
  const envDir = path.join(__dirname, '..', 'public', 'assets', 'environment');
  if (!fs.existsSync(modelsDir)) fs.mkdirSync(modelsDir, { recursive: true });
  if (!fs.existsSync(envDir)) fs.mkdirSync(envDir, { recursive: true });

  const menuHeroPath = path.join(__dirname, '..', 'public', 'assets', 'images', 'menu_hero.jpg');

  console.log('Crafting high-fidelity authentic textures matching menu_hero.jpg...');

  // 1. Eren Face (11-12 yr boy, natural friendly smile, expressive eyes, authentic Turkish explorer)
  // Perfectly centered extract from hero concept art
  await sharp(menuHeroPath)
    .extract({ left: 212, top: 142, width: 98, height: 106 })
    .resize(512, 512, { fit: 'cover' })
    .sharpen({ sigma: 1.2, m1: 1.3, m2: 0.6 })
    .jpeg({ quality: 96 })
    .toFile(path.join(modelsDir, 'eren_face_art.jpg'));

  // 2. Aybüke Face (10-11 yr girl, radiant joyful smile, sparkling eyes, rosy cheeks, silver coins, hair curls)
  // Extract and rotate to level her head, producing the exact authentic face from the hero art
  const aybukeHeadCrop = await sharp(menuHeroPath)
    .extract({ left: 590, top: 110, width: 240, height: 240 })
    .toBuffer();
  const aybukeRotated = await sharp(aybukeHeadCrop)
    .rotate(16)
    .toBuffer();
  await sharp(aybukeRotated)
    .extract({ left: 110, top: 65, width: 115, height: 115 })
    .resize(512, 512, { fit: 'cover' })
    .sharpen({ sigma: 1.2, m1: 1.3, m2: 0.6 })
    .jpeg({ quality: 96 })
    .toFile(path.join(modelsDir, 'aybuke_face_art.jpg'));

  // 3. Aybüke Headscarf & Draped Shawl Texture (PURE CRIMSON VELVET + GOLD ARABESQUE EMBROIDERY - ZERO FACES!)
  const scarfW = 512;
  const scarfH = 512;
  const scarfRaw = Buffer.alloc(scarfW * scarfH * 3);
  for (let y = 0; y < scarfH; y++) {
    for (let x = 0; x < scarfW; x++) {
      const idx = (y * scarfW + x) * 3;
      // Rich crimson velvet base with fabric weave variation
      const velvetWeave = Math.sin(x * 0.4) * Math.cos(y * 0.4) * 6;
      const rBase = 145 + velvetWeave;
      const gBase = 22 + velvetWeave * 0.3;
      const bBase = 35 + velvetWeave * 0.4;

      // Ornate Ottoman floral arabesque embroidery in gleaming gold thread
      const p1 = Math.sin((x + y) * 0.08) * Math.cos((x - y) * 0.08);
      const p2 = Math.sin(x * 0.04) * Math.sin(y * 0.04);
      const isGoldBroccade = (p1 > 0.62 || p2 > 0.70);
      const isGoldFineLine = Math.abs(p1 - 0.3) < 0.05 || Math.abs(p2 - 0.3) < 0.05;

      if (isGoldBroccade) {
        scarfRaw[idx] = 225; // Gold thread R
        scarfRaw[idx + 1] = 185; // G
        scarfRaw[idx + 2] = 55;  // B
      } else if (isGoldFineLine) {
        scarfRaw[idx] = 190;
        scarfRaw[idx + 1] = 150;
        scarfRaw[idx + 2] = 45;
      } else {
        scarfRaw[idx] = Math.min(255, Math.max(0, Math.round(rBase)));
        scarfRaw[idx + 1] = Math.min(255, Math.max(0, Math.round(gBase)));
        scarfRaw[idx + 2] = Math.min(255, Math.max(0, Math.round(bBase)));
      }
    }
  }
  await sharp(scarfRaw, { raw: { width: scarfW, height: scarfH, channels: 3 } })
    .jpeg({ quality: 95 })
    .toFile(path.join(modelsDir, 'aybuke_headscarf_art.jpg'));

  // 4. Aybüke Vest (Crimson velvet with ornate gold Ottoman embroidery)
  await sharp(menuHeroPath)
    .extract({ left: 642, top: 348, width: 140, height: 155 })
    .resize(512, 512, { fit: 'cover' })
    .modulate({ saturation: 1.25, brightness: 1.05 })
    .jpeg({ quality: 95 })
    .toFile(path.join(modelsDir, 'aybuke_vest_art.jpg'));

  // 5. Aybüke Tunic Dress (PURE CREAM TEXTURED LINEN FABRIC WITH SOFT PLEATS & GOLD HEM - ZERO HANDS!)
  const tunicW = 512;
  const tunicH = 512;
  const tunicRaw = Buffer.alloc(tunicW * tunicH * 3);
  for (let y = 0; y < tunicH; y++) {
    for (let x = 0; x < tunicW; x++) {
      const idx = (y * tunicW + x) * 3;
      // Soft vertical pleat shading (sinusoidal folds)
      const pleat = Math.sin(x * 0.12) * 10;
      // Fine linen cross-weave
      const weave = ((x % 3 === 0 ? 3 : 0) + (y % 3 === 0 ? 3 : 0));
      
      // Bottom gold embroidery hem (y > 475)
      const isBottomHem = y > 475;
      const isHemDetail = y > 482 && y < 500 && Math.sin(x * 0.25) > 0.3;

      if (isBottomHem) {
        if (isHemDetail) {
          tunicRaw[idx] = 230; tunicRaw[idx + 1] = 190; tunicRaw[idx + 2] = 60; // Brilliant gold
        } else {
          tunicRaw[idx] = 185; tunicRaw[idx + 1] = 145; tunicRaw[idx + 2] = 45; // Dark gold border
        }
      } else {
        const r = 244 + pleat + weave;
        const g = 238 + pleat * 0.9 + weave;
        const b = 224 + pleat * 0.8 + weave;
        tunicRaw[idx] = Math.min(255, Math.max(0, Math.round(r)));
        tunicRaw[idx + 1] = Math.min(255, Math.max(0, Math.round(g)));
        tunicRaw[idx + 2] = Math.min(255, Math.max(0, Math.round(b)));
      }
    }
  }
  await sharp(tunicRaw, { raw: { width: tunicW, height: tunicH, channels: 3 } })
    .jpeg({ quality: 95 })
    .toFile(path.join(modelsDir, 'aybuke_tunic_art.jpg'));

  // 6. Eren Hair (PURE NATURAL WAVY BRUNETTE HAIR STRANDS - ZERO FACES!)
  const hairW = 512;
  const hairH = 512;
  const hairRaw = Buffer.alloc(hairW * hairH * 3);
  for (let y = 0; y < hairH; y++) {
    for (let x = 0; x < hairW; x++) {
      const idx = (y * hairW + x) * 3;
      // Wavy hair strand flow
      const strandWave = Math.sin(x * 0.08 + Math.cos(y * 0.03) * 4) * 20;
      const strandFine = Math.sin(x * 0.35 + y * 0.05) * 12;
      const grain = (Math.random() - 0.5) * 8;
      
      const r = 85 + strandWave + strandFine + grain;
      const g = 55 + strandWave * 0.7 + strandFine * 0.6 + grain * 0.6;
      const b = 32 + strandWave * 0.4 + strandFine * 0.4 + grain * 0.4;
      
      hairRaw[idx] = Math.min(255, Math.max(0, Math.round(r)));
      hairRaw[idx + 1] = Math.min(255, Math.max(0, Math.round(g)));
      hairRaw[idx + 2] = Math.min(255, Math.max(0, Math.round(b)));
    }
  }
  await sharp(hairRaw, { raw: { width: hairW, height: hairH, channels: 3 } })
    .jpeg({ quality: 95 })
    .toFile(path.join(modelsDir, 'eren_hair_art.jpg'));

  // 7. Eren Vest (Olive-green expedition utility vest with pockets and buttons)
  await sharp(menuHeroPath)
    .extract({ left: 212, top: 248, width: 130, height: 155 })
    .resize(512, 512, { fit: 'cover' })
    .jpeg({ quality: 95 })
    .toFile(path.join(modelsDir, 'eren_vest_art.jpg'));

  // 8. Eren Cargo Pants (STURDY COTTON TWILL EXPEDITION BROWN FABRIC WITH STITCHING)
  const pantsW = 512;
  const pantsH = 512;
  const pantsRaw = Buffer.alloc(pantsW * pantsH * 3);
  for (let y = 0; y < pantsH; y++) {
    for (let x = 0; x < pantsW; x++) {
      const idx = (y * pantsW + x) * 3;
      const twill = (x + y) % 4 === 0 ? 5 : 0;
      const isSeam = (x > 250 && x < 256) || (y > 250 && y < 256);
      
      if (isSeam) {
        pantsRaw[idx] = 45; pantsRaw[idx + 1] = 30; pantsRaw[idx + 2] = 18; // Dark stitched seam
      } else {
        const r = 74 + twill;
        const g = 52 + twill;
        const b = 36 + twill;
        pantsRaw[idx] = Math.round(r);
        pantsRaw[idx + 1] = Math.round(g);
        pantsRaw[idx + 2] = Math.round(b);
      }
    }
  }
  await sharp(pantsRaw, { raw: { width: pantsW, height: pantsH, channels: 3 } })
    .jpeg({ quality: 95 })
    .toFile(path.join(modelsDir, 'eren_pants_art.jpg'));

  // 9. Explorer Leather Backpack Texture (RICH WEATHERED BROWN SADDLE LEATHER WITH BRASS ACCENTS)
  const packW = 512;
  const packH = 512;
  const packRaw = Buffer.alloc(packW * packH * 3);
  for (let y = 0; y < packH; y++) {
    for (let x = 0; x < packW; x++) {
      const idx = (y * packW + x) * 3;
      const grain = (Math.random() - 0.5) * 10;
      const isStrapBorder = x < 20 || x > packW - 21 || y < 20 || y > packH - 21;
      const isStitch = (x === 24 || x === packW - 25 || y === 24 || y === packH - 25) && (x % 8 < 5 && y % 8 < 5);
      
      if (isStitch) {
        packRaw[idx] = 205; packRaw[idx + 1] = 175; packRaw[idx + 2] = 120; // Cream saddle stitching
      } else if (isStrapBorder) {
        packRaw[idx] = 52; packRaw[idx + 1] = 32; packRaw[idx + 2] = 18; // Dark burnished leather edge
      } else {
        const r = 78 + grain;
        const g = 48 + grain * 0.7;
        const b = 28 + grain * 0.5;
        packRaw[idx] = Math.min(255, Math.max(0, Math.round(r)));
        packRaw[idx + 1] = Math.min(255, Math.max(0, Math.round(g)));
        packRaw[idx + 2] = Math.min(255, Math.max(0, Math.round(b)));
      }
    }
  }
  await sharp(packRaw, { raw: { width: packW, height: packH, channels: 3 } })
    .jpeg({ quality: 95 })
    .toFile(path.join(modelsDir, 'leather_backpack_art.jpg'));

  // 10. Eren Boots
  await sharp(menuHeroPath)
    .extract({ left: 212, top: 565, width: 160, height: 85 })
    .resize(512, 512, { fit: 'cover' })
    .jpeg({ quality: 95 })
    .toFile(path.join(modelsDir, 'eren_boots_art.jpg'));

  // 11. Aybüke Shoes
  await sharp(menuHeroPath)
    .extract({ left: 605, top: 585, width: 150, height: 65 })
    .resize(512, 512, { fit: 'cover' })
    .jpeg({ quality: 95 })
    .toFile(path.join(modelsDir, 'aybuke_shoes_art.jpg'));

  console.log('Crafting photorealistic environment textures...');

  // 12. Desert Sand
  const sandWidth = 512;
  const sandHeight = 512;
  const sandRaw = Buffer.alloc(sandWidth * sandHeight * 3);
  for (let y = 0; y < sandHeight; y++) {
    for (let x = 0; x < sandWidth; x++) {
      const idx = (y * sandWidth + x) * 3;
      const ripple1 = Math.sin(x * 0.05 + y * 0.02) * 12;
      const ripple2 = Math.cos(x * 0.015 - y * 0.035) * 8;
      const grain = (Math.random() - 0.5) * 14;
      
      const r = Math.min(255, Math.max(0, 218 + ripple1 + ripple2 + grain));
      const g = Math.min(255, Math.max(0, 185 + ripple1 * 0.85 + ripple2 * 0.8 + grain * 0.8));
      const b = Math.min(255, Math.max(0, 142 + ripple1 * 0.65 + ripple2 * 0.6 + grain * 0.6));
      
      sandRaw[idx] = Math.round(r);
      sandRaw[idx + 1] = Math.round(g);
      sandRaw[idx + 2] = Math.round(b);
    }
  }
  await sharp(sandRaw, { raw: { width: sandWidth, height: sandHeight, channels: 3 } })
    .jpeg({ quality: 92 })
    .toFile(path.join(envDir, 'desert_sand_detail.jpg'));

  // 13. Mataf Courtyard Flagstone (Soft historical limestone paving with natural variation, zero harsh aliasing)
  const tileWidth = 512;
  const tileHeight = 512;
  const tileRaw = Buffer.alloc(tileWidth * tileHeight * 3);
  const tileSize = 64;
  for (let y = 0; y < tileHeight; y++) {
    for (let x = 0; x < tileWidth; x++) {
      const idx = (y * tileWidth + x) * 3;
      const gridX = x % tileSize;
      const gridY = y % tileSize;
      const distToEdgeX = Math.min(gridX, tileSize - gridX);
      const distToEdgeY = Math.min(gridY, tileSize - gridY);
      const edgeDist = Math.min(distToEdgeX, distToEdgeY);

      const tileIdxX = Math.floor(x / tileSize);
      const tileIdxY = Math.floor(y / tileSize);
      const tileVariation = Math.sin(tileIdxX * 2.3 + tileIdxY * 4.1) * 8 + Math.cos(tileIdxX * 5.1 - tileIdxY * 1.7) * 6;
      const stoneNoise = ((Math.sin(x * 0.2) + Math.cos(y * 0.2)) * 3) + ((Math.random() - 0.5) * 5);

      if (edgeDist <= 1) {
        // Soft mortar joint (no harsh black lines, perfectly anti-aliased)
        const jointBlend = edgeDist === 0 ? 0.75 : 0.88;
        tileRaw[idx] = Math.round((190 + tileVariation * 0.4) * jointBlend);
        tileRaw[idx + 1] = Math.round((172 + tileVariation * 0.35) * jointBlend);
        tileRaw[idx + 2] = Math.round((148 + tileVariation * 0.3) * jointBlend);
      } else {
        // Warm sandstone limestone flagstone
        const r = Math.min(255, Math.max(0, 230 + tileVariation + stoneNoise));
        const g = Math.min(255, Math.max(0, 215 + tileVariation * 0.85 + stoneNoise * 0.8));
        const b = Math.min(255, Math.max(0, 190 + tileVariation * 0.70 + stoneNoise * 0.6));
        tileRaw[idx] = Math.round(r);
        tileRaw[idx + 1] = Math.round(g);
        tileRaw[idx + 2] = Math.round(b);
      }
    }
  }
  await sharp(tileRaw, { raw: { width: tileWidth, height: tileHeight, channels: 3 } })
    .jpeg({ quality: 92 })
    .toFile(path.join(envDir, 'courtyard_marble_detail.jpg'));

  // 14. Mountain Rock
  const rockWidth = 512;
  const rockHeight = 512;
  const rockRaw = Buffer.alloc(rockWidth * rockHeight * 3);
  for (let y = 0; y < rockHeight; y++) {
    for (let x = 0; x < rockWidth; x++) {
      const idx = (y * rockWidth + x) * 3;
      const stratum = Math.sin(y * 0.08 + Math.cos(x * 0.02) * 3.5) * 25;
      const verticalFissure = Math.sin(x * 0.05 + y * 0.01) * 15;
      const rockNoise = (Math.random() - 0.5) * 18;
      
      const r = Math.min(255, Math.max(0, 115 + stratum + verticalFissure * 0.5 + rockNoise));
      const g = Math.min(255, Math.max(0, 75 + stratum * 0.75 + verticalFissure * 0.4 + rockNoise * 0.7));
      const b = Math.min(255, Math.max(0, 52 + stratum * 0.55 + verticalFissure * 0.3 + rockNoise * 0.5));
      
      rockRaw[idx] = Math.round(r);
      rockRaw[idx + 1] = Math.round(g);
      rockRaw[idx + 2] = Math.round(b);
    }
  }
  await sharp(rockRaw, { raw: { width: rockWidth, height: rockHeight, channels: 3 } })
    .jpeg({ quality: 92 })
    .toFile(path.join(envDir, 'mountain_rock_detail.jpg'));

  // 15. Kaaba Kiswah Golden Calligraphy
  const kiswahW = 512;
  const kiswahH = 96;
  const kiswahRaw = Buffer.alloc(kiswahW * kiswahH * 3);
  for (let y = 0; y < kiswahH; y++) {
    for (let x = 0; x < kiswahW; x++) {
      const idx = (y * kiswahW + x) * 3;
      const isGoldBorder = y < 8 || y > kiswahH - 9 || Math.abs(y - kiswahH * 0.5) < 3;
      const wave = Math.sin(x * 0.15) * Math.cos(y * 0.18);
      const isCalligraphy = wave > 0.45 && y > 12 && y < kiswahH - 13;

      if (isGoldBorder || isCalligraphy) {
        kiswahRaw[idx] = 232; kiswahRaw[idx + 1] = 192; kiswahRaw[idx + 2] = 58;
      } else {
        const silkWeave = (x % 2 === 0 ? 4 : 0);
        kiswahRaw[idx] = 22 + silkWeave;
        kiswahRaw[idx + 1] = 20 + silkWeave;
        kiswahRaw[idx + 2] = 24 + silkWeave;
      }
    }
  }
  await sharp(kiswahRaw, { raw: { width: kiswahW, height: kiswahH, channels: 3 } })
    .jpeg({ quality: 95 })
    .toFile(path.join(envDir, 'kaaba_kiswah_band.jpg'));

  // 16. Bazaar Carpet
  const carpetW = 256;
  const carpetH = 512;
  const carpetRaw = Buffer.alloc(carpetW * carpetH * 3);
  for (let y = 0; y < carpetH; y++) {
    for (let x = 0; x < carpetW; x++) {
      const idx = (y * carpetW + x) * 3;
      const border = x < 18 || x > carpetW - 19 || y < 18 || y > carpetH - 19;
      const diamond = Math.abs((x - carpetW / 2) * 2) + Math.abs((y % 128 - 64) * 2);
      
      if (border) {
        carpetRaw[idx] = 180; carpetRaw[idx + 1] = 140; carpetRaw[idx + 2] = 60;
      } else if (diamond < 75) {
        carpetRaw[idx] = 160; carpetRaw[idx + 1] = 35; carpetRaw[idx + 2] = 42;
      } else if (diamond < 110) {
        carpetRaw[idx] = 30; carpetRaw[idx + 1] = 85; carpetRaw[idx + 2] = 120;
      } else {
        carpetRaw[idx] = 215; carpetRaw[idx + 1] = 190; carpetRaw[idx + 2] = 150;
      }
    }
  }
  await sharp(carpetRaw, { raw: { width: carpetW, height: carpetH, channels: 3 } })
    .jpeg({ quality: 92 })
    .toFile(path.join(envDir, 'carpet_kilim.jpg'));

  // 17. Awning Stripes
  const awningW = 256;
  const awningH = 256;
  const awningRaw = Buffer.alloc(awningW * awningH * 3);
  for (let y = 0; y < awningH; y++) {
    for (let x = 0; x < awningW; x++) {
      const idx = (y * awningW + x) * 3;
      const stripe = Math.floor(x / 32) % 2 === 0;
      if (stripe) {
        awningRaw[idx] = 185; awningRaw[idx + 1] = 45; awningRaw[idx + 2] = 45;
      } else {
        awningRaw[idx] = 240; awningRaw[idx + 1] = 230; awningRaw[idx + 2] = 210;
      }
    }
  }
  await sharp(awningRaw, { raw: { width: awningW, height: awningH, channels: 3 } })
    .jpeg({ quality: 92 })
    .toFile(path.join(envDir, 'awning_stripes.jpg'));

  console.log('All authentic textures generated successfully!');
}

generateAllTextures().catch(console.error);
