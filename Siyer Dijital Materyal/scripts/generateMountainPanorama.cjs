const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function createMountainPanorama() {
  const width = 2048;
  const height = 512;
  const raw = Buffer.alloc(width * height * 3);

  // Perlin-like pseudo noise generator
  function pseudoNoise(x, y, freq) {
    const s = Math.sin(x * freq * 1.31 + y * freq * 0.71) * 43758.5453;
    return s - Math.floor(s);
  }

  function smoothNoise(x, freq) {
    const i = Math.floor(x * freq);
    const f = (x * freq) - i;
    const smoothF = f * f * (3 - 2 * f);
    const s1 = Math.sin(i * 12.9898) * 43758.5453;
    const n1 = s1 - Math.floor(s1);
    const s2 = Math.sin((i + 1) * 12.9898) * 43758.5453;
    const n2 = s2 - Math.floor(s2);
    return n1 * (1 - smoothF) + n2 * smoothF;
  }

  function multiOctave(x, octaves = 6) {
    let val = 0;
    let amp = 0.5;
    let freq = 0.005;
    for (let o = 0; o < octaves; o++) {
      val += smoothNoise(x, freq) * amp;
      amp *= 0.52;
      freq *= 2.05;
    }
    return val;
  }

  // Precompute mountain skyline heights (seamless 360-degree wrap)
  const skyline1 = new Float32Array(width);
  const skyline2 = new Float32Array(width);
  const skyline3 = new Float32Array(width);

  for (let x = 0; x < width; x++) {
    const angle = (x / width) * Math.PI * 2;
    // Circular coordinate for seamless wrapping
    const cx = Math.cos(angle);
    const cz = Math.sin(angle);

    // Far mountain range (towering distant massifs: Jabal an-Nur peak, Jabal Thawr)
    const nFar = 
      multiOctave(cx * 800 + cz * 400 + 1000) * 0.6 +
      multiOctave(cz * 700 - cx * 300 + 2000) * 0.4;
    // Peak of Hira / Jabal an-Nur around angle 0.8 (~East-Northeast)
    const hiraPeak = Math.exp(-Math.pow((angle - 1.1) / 0.18, 2)) * 0.45;
    // Jabal Abu Qubays around angle 1.8 (~East)
    const abuQubays = Math.exp(-Math.pow((angle - 1.85) / 0.25, 2)) * 0.35;
    // Jabal Qu'ayqi'an around angle 4.6 (~West)
    const quayqian = Math.exp(-Math.pow((angle - 4.6) / 0.32, 2)) * 0.38;

    skyline1[x] = 0.48 + nFar * 0.28 + hiraPeak + abuQubays + quayqian;

    // Mid mountain range (closer craggy ridge)
    const nMid = multiOctave(cx * 1400 - cz * 800 + 3500) * 0.7;
    skyline2[x] = 0.36 + nMid * 0.24 + abuQubays * 0.6 + quayqian * 0.5;

    // Near mountain foothills & talus
    const nNear = multiOctave(cz * 2000 + cx * 1200 + 5000) * 0.5;
    skyline3[x] = 0.20 + nNear * 0.16;
  }

  // Sun direction: high in sky slightly South-East (~angle 2.4)
  const sunAngle = 2.4;

  for (let y = 0; y < height; y++) {
    // normalized height from bottom (0 = horizon/ground, 1 = top sky)
    const normY = (height - 1 - y) / height;

    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 3;
      const angle = (x / width) * Math.PI * 2;

      // Sunlit factor based on mountain slope facing sun
      const nextX = (x + 2) % width;
      const slope = (skyline2[nextX] - skyline2[x]) * 20.0;
      const sunFacing = Math.max(0.2, Math.min(1.0, 0.65 + slope * 1.5 + Math.cos(angle - sunAngle) * 0.25));

      const h1 = skyline1[x];
      const h2 = skyline2[x];
      const h3 = skyline3[x];

      if (normY > h1) {
        // SKY REGION: Warm Arabian golden desert sky
        // Gradient from desert horizon dust to golden sky to warm azure at zenith
        const skyT = (normY - 0.2) / 0.8;
        // Horizon haze: warm golden sandstone glow
        const rHoriz = 224, gHoriz = 202, bHoriz = 168;
        // Mid sky: warm soft amber/gold
        const rMid = 205, gMid = 188, bMid = 162;
        // Zenith sky: warm desert sky
        const rTop = 165, gTop = 182, bTop = 208;

        let r, g, b;
        if (skyT < 0.45) {
          const t = skyT / 0.45;
          r = rHoriz * (1 - t) + rMid * t;
          g = gHoriz * (1 - t) + gMid * t;
          b = bHoriz * (1 - t) + bMid * t;
        } else {
          const t = (skyT - 0.45) / 0.55;
          r = rMid * (1 - t) + rTop * t;
          g = gMid * (1 - t) + gTop * t;
          b = bMid * (1 - t) + bTop * t;
        }

        // Soft atmospheric desert haze near horizon
        const haze = Math.exp(-Math.pow((normY - h1) / 0.08, 2)) * 0.18;
        r = Math.min(255, r + haze * 40);
        g = Math.min(255, g + haze * 30);
        b = Math.min(255, b + haze * 20);

        raw[idx] = Math.round(r);
        raw[idx + 1] = Math.round(g);
        raw[idx + 2] = Math.round(b);
      } else if (normY > h2) {
        // FAR MOUNTAINS: Atmospheric depth, soft bluish-amber desert haze
        const depthT = (h1 - normY) / (h1 - 0.2);
        const strata = Math.sin(normY * 65 + x * 0.02) * 8;
        const rockNoise = (pseudoNoise(x, y, 0.08) - 0.5) * 16;

        // Base mountain color: warm reddish diorite/granite
        let mr = 158 + strata + rockNoise;
        let mg = 126 + strata * 0.8 + rockNoise;
        let mb = 104 + strata * 0.6 + rockNoise;

        // Apply sunlit slope shading
        mr *= sunFacing * 1.1;
        mg *= sunFacing * 1.05;
        mb *= sunFacing * 0.95;

        // Aerial perspective: blend with atmospheric sky haze (Rayleigh & dust scattering)
        const hazeAmount = 0.42;
        const hr = 212, hg = 194, hb = 168;
        mr = mr * (1 - hazeAmount) + hr * hazeAmount;
        mg = mg * (1 - hazeAmount) + hg * hazeAmount;
        mb = mb * (1 - hazeAmount) + hb * hazeAmount;

        raw[idx] = Math.min(255, Math.max(0, Math.round(mr)));
        raw[idx + 1] = Math.min(255, Math.max(0, Math.round(mg)));
        raw[idx + 2] = Math.min(255, Math.max(0, Math.round(mb)));
      } else if (normY > h3) {
        // MID-RANGE CRAGS & RIDGES: Rich warm red-brown sandstone/diorite with distinct rocky strata
        const strata = Math.sin(normY * 90 + x * 0.035) * 14 + Math.cos(normY * 180) * 6;
        const cragNoise = (pseudoNoise(x, y, 0.12) - 0.5) * 22;

        let mr = 168 + strata + cragNoise;
        let mg = 120 + strata * 0.75 + cragNoise * 0.8;
        let mb = 88 + strata * 0.55 + cragNoise * 0.6;

        mr *= (sunFacing * 1.25);
        mg *= (sunFacing * 1.15);
        mb *= (sunFacing * 1.05);

        // Moderate atmospheric haze
        const hazeAmount = 0.22;
        const hr = 218, hg = 198, hb = 168;
        mr = mr * (1 - hazeAmount) + hr * hazeAmount;
        mg = mg * (1 - hazeAmount) + hg * hazeAmount;
        mb = mb * (1 - hazeAmount) + hb * hazeAmount;

        raw[idx] = Math.min(255, Math.max(0, Math.round(mr)));
        raw[idx + 1] = Math.min(255, Math.max(0, Math.round(mg)));
        raw[idx + 2] = Math.min(255, Math.max(0, Math.round(mb)));
      } else {
        // FOOTHILLS & VALLEY TALUS SLOPES (warm sandy apron blending into ground)
        const talusT = normY / (h3 + 0.001);
        const sandStrata = Math.sin(x * 0.05 + y * 0.08) * 8;
        const noise = (pseudoNoise(x, y, 0.15) - 0.5) * 14;

        // Gradient from valley floor sand (#d9c5a3 = 217, 197, 163) up to rocky scree
        let r = 217 * (1 - talusT) + (178 + sandStrata + noise) * talusT;
        let g = 197 * (1 - talusT) + (138 + sandStrata * 0.8 + noise) * talusT;
        let b = 163 * (1 - talusT) + (108 + sandStrata * 0.6 + noise) * talusT;

        r *= (0.85 + sunFacing * 0.25);
        g *= (0.85 + sunFacing * 0.25);
        b *= (0.85 + sunFacing * 0.25);

        raw[idx] = Math.min(255, Math.max(0, Math.round(r)));
        raw[idx + 1] = Math.min(255, Math.max(0, Math.round(g)));
        raw[idx + 2] = Math.min(255, Math.max(0, Math.round(b)));
      }
    }
  }

  const outDir = path.join(__dirname, '..', 'public', 'assets', 'environment');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, 'mecca_mountain_panorama.jpg');
  await sharp(raw, { raw: { width, height, channels: 3 } })
    .jpeg({ quality: 94 })
    .toFile(outPath);

  console.log('Successfully generated photorealistic 360-degree Mecca mountain panorama:', outPath);
}

createMountainPanorama().catch(console.error);
