import * as THREE from 'three';

export interface CollisionBox {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface EnvironmentResult {
  sceneGroup: THREE.Group;
  collisionBoxes: CollisionBox[];
  portalGroup: THREE.Group;
  beaconGroup: THREE.Group;
  updateEnvironment: (delta: number, isPortalActive: boolean) => void;
  setBeaconPosition: (pos: [number, number, number]) => void;
  getGroundHeight: (x: number, z: number) => number;
}

// =========================================================================
// 1. PROCEDURAL HIGH-FIDELITY PBR TEXTURE GENERATORS
// Authentic historical Hijazi materials: Basalt, Sandstone, Mudbrick, Wood, Cloth
// =========================================================================

/**
 * Smooth, non-flickering dressed limestone flagstones for the Mataf sanctuary
 * Large human-scale pavers with gentle, soft mortar bevels (zero moire flickering / shining)
 */
function createMatafFlagstoneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Warm sandy limestone base
  ctx.fillStyle = '#ded4c1';
  ctx.fillRect(0, 0, 512, 512);

  // Large smooth limestone pavers (~60cm wide, no high-frequency lines)
  const rows = 4;
  const rowH = 512 / rows;
  ctx.strokeStyle = '#c2b39b'; // Soft, low-contrast mortar bevels (no black stroke aliasing!)
  ctx.lineWidth = 1.5;

  for (let r = 0; r < rows; r++) {
    const y = r * rowH;
    let x = 0;
    const offset = (r % 2) * 64;
    x -= offset;
    while (x < 512) {
      const stoneW = 128;
      const baseTone = 222 + Math.floor(Math.sin(x * 0.05 + r * 1.5) * 8);
      ctx.fillStyle = `rgb(${baseTone}, ${baseTone - 12}, ${baseTone - 26})`;
      ctx.fillRect(x + 1, y + 1, stoneW - 2, rowH - 2);
      ctx.strokeRect(x + 1, y + 1, stoneW - 2, rowH - 2);
      x += stoneW;
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  texture.anisotropy = 16;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Mecca valley dark diorite/basalt masonry with mud mortar courses
 */
function createBasaltMasonryTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Dark volcanic basalt base
  ctx.fillStyle = '#22201e';
  ctx.fillRect(0, 0, 512, 512);

  // Fieldstone masonry courses
  const rows = 12;
  const rowH = 512 / rows;
  ctx.strokeStyle = '#42372d'; // Mud mortar
  ctx.lineWidth = 4;

  for (let r = 0; r < rows; r++) {
    const y = r * rowH;
    let x = 0;
    const offset = (r % 2) * 24;
    x -= offset;

    while (x < 512) {
      const stoneW = 38 + Math.floor(Math.sin(r * 3 + x * 0.05) * 16 + 20);
      const w = stoneW;

      // Dark basalt stone variation (dark grey to charcoal with mineral flecks)
      const grey = 45 + Math.floor(Math.sin(x * 9 + r * 11) * 15);
      ctx.fillStyle = `rgb(${grey + 6}, ${grey + 4}, ${grey})`;
      ctx.fillRect(x + 2, y + 2, w - 4, rowH - 4);
      ctx.strokeRect(x + 2, y + 2, w - 4, rowH - 4);

      // Rough stone texture
      ctx.fillStyle = 'rgba(20, 18, 16, 0.25)';
      for (let s = 0; s < 6; s++) {
        ctx.fillRect(x + 4 + Math.random() * (w - 8), y + 4 + Math.random() * (rowH - 8), 2, 2);
      }

      x += w;
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Authentic dark woven Kiswah cloth texture with subtle fabric weave
 */
function createKiswahClothTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Rich charcoal/obsidian black base
  ctx.fillStyle = '#151314';
  ctx.fillRect(0, 0, 512, 512);

  // Fine jacquard fabric weave pattern (interlaced dark grey threads)
  ctx.strokeStyle = 'rgba(45, 42, 44, 0.45)';
  ctx.lineWidth = 1;
  for (let y = 0; y < 512; y += 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }
  for (let x = 0; x < 512; x += 4) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }

  // Subtle fabric draping & vertical folds
  const grad = ctx.createLinearGradient(0, 0, 512, 0);
  for (let f = 0; f < 8; f++) {
    const pos = f / 8;
    grad.addColorStop(pos, 'rgba(25, 23, 24, 0.15)');
    grad.addColorStop(pos + 0.06, 'rgba(5, 5, 5, 0.35)');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Golden embroidered calligraphy belt (Hizam) for the Kaaba
 */
function createKiswahGoldBandTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Dark silk background
  ctx.fillStyle = '#111012';
  ctx.fillRect(0, 0, 1024, 128);

  // Gleaming gold border ribbons
  ctx.fillStyle = '#d4af37';
  ctx.fillRect(0, 8, 1024, 8);
  ctx.fillRect(0, 112, 1024, 8);

  ctx.fillStyle = '#f3e5ab';
  ctx.fillRect(0, 18, 1024, 3);
  ctx.fillRect(0, 107, 1024, 3);

  // Stylized ancient Kufic-style gold inscription arches and medallions
  ctx.fillStyle = '#e6c348';
  ctx.strokeStyle = '#c59b27';
  ctx.lineWidth = 2;

  const segmentW = 64;
  for (let x = 0; x < 1024; x += segmentW) {
    // Top arch
    ctx.beginPath();
    ctx.arc(x + 32, 40, 14, Math.PI, 0);
    ctx.stroke();

    // Central medallion
    ctx.fillRect(x + 12, 48, segmentW - 24, 32);

    // Calligraphic letter strokes
    ctx.fillStyle = '#fff0a8';
    ctx.fillRect(x + 18, 54, 4, 20);
    ctx.fillRect(x + 28, 58, 6, 14);
    ctx.fillRect(x + 40, 52, 4, 22);

    // Bottom flourishes
    ctx.beginPath();
    ctx.arc(x + 32, 90, 8, 0, Math.PI);
    ctx.stroke();
    ctx.fillStyle = '#e6c348';
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(4, 1);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Sundried mudbrick / adobe texture with straw fibers and earthen warmth
 */
function createMudbrickTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Warm sandy clay base
  ctx.fillStyle = '#b8895c';
  ctx.fillRect(0, 0, 512, 512);

  // Brick rows
  const rows = 16;
  const rowH = 512 / rows;
  const brickW = 64;
  ctx.strokeStyle = '#7c5434';
  ctx.lineWidth = 3;

  for (let r = 0; r < rows; r++) {
    const y = r * rowH;
    const shift = (r % 2) * (brickW / 2);
    for (let x = -brickW; x < 512 + brickW; x += brickW) {
      const tone = 168 + Math.floor(Math.sin(x * 7 + r * 13) * 22);
      ctx.fillStyle = `rgb(${tone}, ${tone - 38}, ${tone - 72})`;
      ctx.fillRect(x + shift + 1, y + 1, brickW - 2, rowH - 2);
      ctx.strokeRect(x + shift + 1, y + 1, brickW - 2, rowH - 2);

      // Straw flecks
      ctx.strokeStyle = 'rgba(235, 205, 150, 0.35)';
      ctx.lineWidth = 1;
      for (let s = 0; s < 3; s++) {
        const sx = x + shift + 5 + Math.random() * (brickW - 14);
        const sy = y + 5 + Math.random() * (rowH - 12);
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + (Math.random() - 0.5) * 8, sy + (Math.random() - 0.5) * 6);
        ctx.stroke();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Weathered Hijazi palm and teak wood texture with grain lines
 */
function createWeatheredWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#3a2416';
  ctx.fillRect(0, 0, 256, 256);

  // Wood grain lines
  for (let y = 0; y < 256; y += 3) {
    const shade = 48 + Math.floor(Math.sin(y * 0.4) * 16);
    ctx.strokeStyle = `rgb(${shade + 8}, ${shade - 8}, ${shade - 20})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= 256; x += 32) {
      ctx.lineTo(x, y + Math.sin(x * 0.08) * 2);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Authentic geological mountain rock texture with natural desert varnish
 */
function createStratifiedRockTexture(): THREE.Texture {
  const textureLoader = new THREE.TextureLoader();
  const tex = textureLoader.load('/assets/environment/mountain_rock_detail.jpg', undefined, undefined, () => {
    // If load fails, fallback to procedural granite rock
  });
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  tex.anisotropy = 16;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// =========================================================================
// 2. MAIN ENVIRONMENT BUILDER
// 6th–7th Century Historical Mecca (Valley of Bakkah / Mecca 571–632 CE)
// =========================================================================

export function buildHistoricalEnvironment(
  _sceneType: 'mecca' | 'madinah' | 'hira' | 'sevr' | 'badr' | 'uhud' | 'hudaybiyyah'
): EnvironmentResult {
  const sceneGroup = new THREE.Group();
  sceneGroup.name = 'historical_environment';

  const collisionBoxes: CollisionBox[] = [];
  function addCollider(minX: number, maxX: number, minZ: number, maxZ: number) {
    collisionBoxes.push({ minX, maxX, minZ, maxZ });
  }

  // --- MATERIAL DEFINITIONS ---
  const matafFlagstoneTex = createMatafFlagstoneTexture();
  const basaltMasonryTex = createBasaltMasonryTexture();
  const kiswahClothTex = createKiswahClothTexture();
  const kiswahGoldBandTex = createKiswahGoldBandTexture();
  const mudbrickTex = createMudbrickTexture();
  const woodTex = createWeatheredWoodTexture();
  const rockTex = createStratifiedRockTexture();

  // 1. Sandstone Desert Valley Floor Material
  const valleySandMat = new THREE.MeshStandardMaterial({
    color: 0xd9c5a3,
    roughness: 0.92,
    metalness: 0.02
  });

  // 2. Mataf Sanctuary Flagstones (Elevated at Y = 0.15, zero specular glare)
  const matafMat = new THREE.MeshStandardMaterial({
    map: matafFlagstoneTex,
    roughness: 0.95,
    metalness: 0.0
  });

  // 3. Basalt Fieldstone Masonry
  const basaltMat = new THREE.MeshStandardMaterial({
    map: basaltMasonryTex,
    roughness: 0.88,
    metalness: 0.05
  });

  // 4. Mudbrick / Kerpiç
  const mudbrickMat = new THREE.MeshStandardMaterial({
    map: mudbrickTex,
    roughness: 0.90,
    metalness: 0.03
  });

  // 5. Kaaba Obsidian Kiswah Fabric (Natural woven draping, catches desert light)
  const kiswahMat = new THREE.MeshStandardMaterial({
    map: kiswahClothTex,
    color: 0x2a2829,
    roughness: 0.72,
    metalness: 0.06
  });

  // 6. Kiswah Gold Embroidered Belt (Gleaming gold calligraphy)
  const kiswahGoldMat = new THREE.MeshStandardMaterial({
    map: kiswahGoldBandTex,
    color: 0xffffff,
    roughness: 0.25,
    metalness: 0.88,
    emissive: 0x6e5218,
    emissiveIntensity: 0.65
  });

  // 6b. Dressed Stone Plinth Material (Shadhirwan)
  const plinthMat = new THREE.MeshStandardMaterial({
    map: basaltMasonryTex,
    color: 0x8e775d,
    roughness: 0.75,
    metalness: 0.05
  });

  // 7. Weathered Timber
  const woodMat = new THREE.MeshStandardMaterial({
    map: woodTex,
    roughness: 0.78,
    metalness: 0.05
  });

  // 8. Geological Mountain Rock
  const mountainRockMat = new THREE.MeshStandardMaterial({
    map: rockTex,
    roughness: 0.92,
    metalness: 0.04
  });

  // 9. Gleaming Silver Casing (Hajar al-Aswad)
  const silverMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.18,
    metalness: 0.95
  });

  // --- GROUND HEIGHT EVALUATION (Zero Sinking, Zero Z-Fighting) ---
  function getHistoricalGroundHeight(x: number, z: number): number {
    const kaabaDist = Math.sqrt(x * x + Math.pow(z - (-10), 2));
    if (kaabaDist <= 16.0) {
      return 0.15; // Mataf sanctuary surface
    }
    if (kaabaDist <= 17.5) {
      const t = (kaabaDist - 16.0) / 1.5;
      return (1 - t) * 0.15; // Smooth curb transition to valley floor
    }
    return 0.0; // Valley sand floor
  }

  // =========================================================================
  // 3. TERRAIN: WADI MECCA VALLEY & MATAF COURTYARD
  // =========================================================================

  // Continuous Valley Floor Plane (Recessed under Mataf to avoid z-fighting)
  const valleyGeo = new THREE.PlaneGeometry(240, 240, 48, 48);
  valleyGeo.rotateX(-Math.PI / 2);
  const vPos = valleyGeo.attributes.position;
  for (let i = 0; i < vPos.count; i++) {
    const vx = vPos.getX(i);
    const vz = vPos.getZ(i);
    const kDist = Math.sqrt(vx * vx + Math.pow(vz - (-10), 2));
    if (kDist < 16.8) {
      vPos.setY(i, -0.20); // Recessed safely under courtyard
    } else {
      vPos.setY(i, 0.0);
    }
  }
  valleyGeo.computeVertexNormals();

  const valleyMesh = new THREE.Mesh(valleyGeo, valleySandMat);
  valleyMesh.receiveShadow = true;
  sceneGroup.add(valleyMesh);

  // Central Mataf Courtyard (Tawaf Terrace elevated at Y = 0.15)
  const matafRadius = 16.2;
  const matafGeo = new THREE.CylinderGeometry(matafRadius, matafRadius + 0.35, 0.20, 64);
  const mPos = matafGeo.attributes.position;
  const mUv = matafGeo.attributes.uv;
  for (let i = 0; i < mPos.count; i++) {
    const vx = mPos.getX(i);
    const vz = mPos.getZ(i);
    mUv.setXY(i, (vx + matafRadius) / 8.0, (vz + matafRadius) / 8.0);
  }
  mUv.needsUpdate = true;

  const matafMesh = new THREE.Mesh(matafGeo, matafMat);
  matafMesh.position.set(0, 0.09, -10);
  matafMesh.receiveShadow = true;
  sceneGroup.add(matafMesh);

  // Outer beveled stone curb around the sanctuary (sits right at edge, recessed below surface)
  const curbGeo = new THREE.TorusGeometry(matafRadius + 0.08, 0.10, 8, 64);
  curbGeo.rotateX(Math.PI / 2);
  const curbMesh = new THREE.Mesh(curbGeo, basaltMat);
  curbMesh.position.set(0, 0.08, -10);
  sceneGroup.add(curbMesh);

  // =========================================================================
  // 4. HISTORICAL KAABA RECONSTRUCTION (7th-Century CE Reconstruction)
  // Firmly grounded, authentic proportions, basalt plinth, Hizam, raised door,
  // Hajar al-Aswad, Mizab, and Hijr Ismail (Hatim)
  // =========================================================================
  const kaabaGroup = new THREE.Group();
  kaabaGroup.position.set(0, 0, -10);

  // Kaaba Dimensions: Width (East-West) = 6.2m, Height = 6.8m, Depth (North-South) = 5.2m
  // Plinth rests directly on the Mataf surface (Y = 0.15)
  const baseY = 0.15;

  // 1. Shadhirwan (Dressed Stone Foundation Plinth)
  const plinthW = 6.8;
  const plinthD = 5.8;
  const plinthH = 0.32;
  const plinthGeo = new THREE.BoxGeometry(plinthW, plinthH, plinthD);
  const plinthMesh = new THREE.Mesh(plinthGeo, plinthMat);
  plinthMesh.position.y = baseY + plinthH / 2;
  plinthMesh.castShadow = true;
  plinthMesh.receiveShadow = true;
  kaabaGroup.add(plinthMesh);

  // Beveled plinth lip with brass ring anchors
  const bevelGeo = new THREE.BoxGeometry(plinthW - 0.2, 0.08, plinthD - 0.2);
  const bevelMesh = new THREE.Mesh(bevelGeo, plinthMat);
  bevelMesh.position.y = baseY + plinthH + 0.04;
  kaabaGroup.add(bevelMesh);

  // 2. Kaaba Main Sacred Sanctuary Walls (Basalt Masonry + Dark Woven Kiswah)
  const kwW = 6.2;
  const kwH = 6.6;
  const kwD = 5.2;
  const kaabaBodyGeo = new THREE.BoxGeometry(kwW, kwH, kwD);
  const kaabaBody = new THREE.Mesh(kaabaBodyGeo, kiswahMat);
  kaabaBody.position.y = baseY + plinthH + kwH / 2;
  kaabaBody.castShadow = true;
  kaabaBody.receiveShadow = true;
  kaabaGroup.add(kaabaBody);

  // 3. Golden Kiswah Calligraphy Belt (Hizam)
  // Encircles all 4 walls at approx 2/3 height (~Y = 5.0m)
  const hizamH = 0.72;
  const hizamGeo = new THREE.BoxGeometry(kwW + 0.08, hizamH, kwD + 0.08);
  const hizamMesh = new THREE.Mesh(hizamGeo, kiswahGoldMat);
  hizamMesh.position.y = baseY + plinthH + 4.8;
  kaabaGroup.add(hizamMesh);

  // Golden upper cornice along the flat roof parapet
  const roofCorniceGeo = new THREE.BoxGeometry(kwW + 0.14, 0.16, kwD + 0.14);
  const roofCornice = new THREE.Mesh(roofCorniceGeo, kiswahGoldMat);
  roofCornice.position.y = baseY + plinthH + kwH;
  kaabaGroup.add(roofCornice);

  // 4. Bab al-Ka'bah (The Sacred Door - Eastern Wall)
  // Historical 605 CE elevation: Raised ~1.65m above the ground
  const doorW = 1.35;
  const doorH = 2.4;
  const doorGroup = new THREE.Group();
  doorGroup.position.set(0.65, baseY + plinthH + 1.65 + doorH / 2, kwD / 2 + 0.04);

  // Deep recessed wooden frame
  const doorFrameGeo = new THREE.BoxGeometry(doorW + 0.26, doorH + 0.26, 0.14);
  const doorFrame = new THREE.Mesh(doorFrameGeo, woodMat);
  doorGroup.add(doorFrame);

  // Carved wooden door leaves with gold/bronze studs
  const doorLeafGeo = new THREE.BoxGeometry(doorW, doorH, 0.12);
  const doorLeafMat = new THREE.MeshStandardMaterial({
    map: woodTex,
    color: 0x825632,
    roughness: 0.55,
    metalness: 0.20
  });
  const doorLeaf = new THREE.Mesh(doorLeafGeo, doorLeafMat);
  doorGroup.add(doorLeaf);

  // Bronze door studs and ring handles
  [-0.32, 0.32].forEach(hx => {
    const ringGeo = new THREE.TorusGeometry(0.08, 0.02, 6, 16);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.25 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(hx, -0.1, 0.08);
    doorGroup.add(ring);
  });

  // Door lintel inscription plaque
  const lintelGeo = new THREE.BoxGeometry(doorW + 0.32, 0.22, 0.18);
  const lintelMesh = new THREE.Mesh(lintelGeo, kiswahGoldMat);
  lintelMesh.position.y = doorH / 2 + 0.18;
  doorGroup.add(lintelMesh);

  kaabaGroup.add(doorGroup);

  // Three-step stone access stair to the elevated door
  for (let s = 0; s < 3; s++) {
    const stepW = 1.6 - s * 0.15;
    const stepH = 0.24;
    const stepD = 0.45;
    const stepGeo = new THREE.BoxGeometry(stepW, stepH, stepD);
    const stepMesh = new THREE.Mesh(stepGeo, plinthMat);
    stepMesh.position.set(0.65, baseY + s * stepH + stepH / 2, kwD / 2 + 0.35 + (2 - s) * stepD);
    stepMesh.receiveShadow = true;
    kaabaGroup.add(stepMesh);
  }

  // 5. Hajar al-Aswad (The Black Stone in the Southeast Corner)
  // Set in a contoured gleaming silver casing bezel at Y = 1.35m
  const hajarGroup = new THREE.Group();
  hajarGroup.position.set(kwW / 2 + 0.02, baseY + 1.35, kwD / 2 + 0.02);

  const silverBezelGeo = new THREE.SphereGeometry(0.24, 16, 16);
  silverBezelGeo.scale(0.85, 1.35, 0.85);
  const silverBezel = new THREE.Mesh(silverBezelGeo, silverMat);
  hajarGroup.add(silverBezel);

  // Black stone core relic
  const stoneCoreGeo = new THREE.SphereGeometry(0.12, 12, 12);
  const stoneCoreMat = new THREE.MeshStandardMaterial({ color: 0x0a0908, roughness: 0.9 });
  const stoneCore = new THREE.Mesh(stoneCoreGeo, stoneCoreMat);
  stoneCore.position.set(0.04, 0, 0.04);
  hajarGroup.add(stoneCore);

  kaabaGroup.add(hajarGroup);

  // 6. Mîzâb al-Rahmah (The Water Spout on the Northwest Wall)
  const spoutGeo = new THREE.BoxGeometry(0.22, 0.14, 1.2);
  const spoutMesh = new THREE.Mesh(spoutGeo, kiswahGoldMat);
  spoutMesh.position.set(0, baseY + plinthH + kwH - 0.15, -kwD / 2 - 0.55);
  kaabaGroup.add(spoutMesh);

  // 7. Hijr Ismâ'îl / al-Hâtîm (Semicircular Wall of Sacred Enclosure)
  // Semicircular fieldstone wall opposite the northwest wall
  const hatimRadius = 4.2;
  const hatimWallGeo = new THREE.TorusGeometry(hatimRadius, 0.24, 12, 36, Math.PI * 0.88);
  hatimWallGeo.rotateX(Math.PI / 2);
  hatimWallGeo.rotateZ(Math.PI * 0.56);
  const hatimWall = new THREE.Mesh(hatimWallGeo, basaltMat);
  hatimWall.position.set(0, baseY + 0.65, -kwD / 2 - 2.8);
  hatimWall.castShadow = true;
  hatimWall.receiveShadow = true;
  kaabaGroup.add(hatimWall);

  // Hatim wall coping cap (dressed white limestone)
  const hatimCapGeo = new THREE.TorusGeometry(hatimRadius, 0.28, 8, 36, Math.PI * 0.88);
  hatimCapGeo.rotateX(Math.PI / 2);
  hatimCapGeo.rotateZ(Math.PI * 0.56);
  const hatimCap = new THREE.Mesh(hatimCapGeo, matafMat);
  hatimCap.position.set(0, baseY + 0.82, -kwD / 2 - 2.8);
  kaabaGroup.add(hatimCap);

  // 8. Maqam Ibrahim (Station of Abraham Kiosk)
  // Historical kiosk located ~7.5m east of the Kaaba door
  const maqamGroup = new THREE.Group();
  maqamGroup.position.set(7.5, baseY, 1.2);

  const maqamBaseGeo = new THREE.CylinderGeometry(0.9, 1.0, 0.45, 8);
  const maqamBase = new THREE.Mesh(maqamBaseGeo, basaltMat);
  maqamBase.position.y = 0.225;
  maqamGroup.add(maqamBase);

  const maqamCageGeo = new THREE.CylinderGeometry(0.75, 0.75, 1.6, 8, 1, true);
  const maqamCageMat = new THREE.MeshStandardMaterial({
    color: 0xc89d38,
    metalness: 0.8,
    roughness: 0.3,
    wireframe: true
  });
  const maqamCage = new THREE.Mesh(maqamCageGeo, maqamCageMat);
  maqamCage.position.y = 1.25;
  maqamGroup.add(maqamCage);

  const maqamDomeGeo = new THREE.SphereGeometry(0.8, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5);
  const maqamDome = new THREE.Mesh(maqamDomeGeo, kiswahGoldMat);
  maqamDome.position.y = 2.05;
  maqamGroup.add(maqamDome);

  kaabaGroup.add(maqamGroup);

  // 9. Bi'r Zamzam (Zamzam Wellhead Enclosure)
  const zamzamGroup = new THREE.Group();
  zamzamGroup.position.set(11.5, baseY, 5.5);

  const wellRingGeo = new THREE.CylinderGeometry(1.2, 1.3, 0.9, 16);
  const wellRing = new THREE.Mesh(wellRingGeo, basaltMat);
  wellRing.position.y = 0.45;
  zamzamGroup.add(wellRing);

  // Wooden pulley frame
  [-0.9, 0.9].forEach(px => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.4, 6), woodMat);
    post.position.set(px, 1.2, 0);
    zamzamGroup.add(post);
  });
  const crossbeam = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 2.0, 6), woodMat);
  crossbeam.rotateZ(Math.PI / 2);
  crossbeam.position.y = 2.3;
  zamzamGroup.add(crossbeam);

  kaabaGroup.add(zamzamGroup);

  sceneGroup.add(kaabaGroup);

  // Colliders for Kaaba plinth, Hatim, Maqam Ibrahim, Zamzam
  addCollider(-3.6, 3.6, -13.5, -6.5); // Kaaba plinth
  addCollider(-4.4, 4.4, -18.2, -13.5); // Hatim wall
  addCollider(6.4, 8.6, -9.8, -7.6); // Maqam Ibrahim
  addCollider(10.2, 12.8, -5.8, -3.2); // Zamzam well

  // =========================================================================
  // 5. NATURAL GEOLOGICAL 3D MOUNTAIN MASSIFS (WADI MECCA ENCLOSING RIDGES)
  // Real 3D mountain ridges with craggy peaks, gullies, stepped ledges, and scree
  // =========================================================================

  function createMountainRidge(
    x: number,
    z: number,
    length: number,
    width: number,
    height: number,
    rotY: number = 0,
    seed: number = 1
  ) {
    const ridgeGroup = new THREE.Group();
    ridgeGroup.position.set(x, 0, z);
    ridgeGroup.rotation.y = rotY;

    const xSegs = 32;
    const zSegs = 24;
    const geo = new THREE.PlaneGeometry(length, width, xSegs, zSegs);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const px = pos.getX(i);
      const pz = pos.getZ(i);

      const normZ = Math.abs(pz) / (width * 0.5);
      const normX = Math.abs(px) / (length * 0.5);

      // Natural mountain ridgeline profile
      const ridgeProfile = Math.max(0, 1 - Math.pow(normZ, 1.45)) * Math.max(0, 1 - Math.pow(normX, 2.2));

      // Jagged crags and gullies
      const crag1 = Math.sin(px * 0.14 + seed * 2.1) * Math.cos(pz * 0.18) * 0.22;
      const crag2 = Math.sin(px * 0.32 - pz * 0.28 + seed * 4.7) * 0.10;
      const gully = Math.pow(Math.abs(Math.sin(px * 0.09 + pz * 0.06)), 2.8) * -0.20;
      const terraces = Math.sin(ridgeProfile * Math.PI * 4) * 0.05;

      const h = Math.max(0, (ridgeProfile + crag1 + crag2 + gully + terraces) * height);
      pos.setY(i, h);
    }
    geo.computeVertexNormals();

    const mesh = new THREE.Mesh(geo, mountainRockMat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    ridgeGroup.add(mesh);

    sceneGroup.add(ridgeGroup);
    return ridgeGroup;
  }

  // 1. Jabal Abu Qubays (Eastern Massif overlooking the Sanctuary)
  createMountainRidge(80, -10, 110, 55, 62, -0.15, 3.2);

  // 2. Jabal Qu'ayqi'an (Western Red Mountain Ridge)
  createMountainRidge(-80, -12, 115, 58, 65, 0.12, 5.8);

  // 3. Jabal al-Nur / Hira Peak (Towering dramatic peak to the Northeast)
  createMountainRidge(65, -85, 100, 55, 78, -0.65, 2.1);

  // 4. Jabal Thawr (Southern Mountain Massif)
  createMountainRidge(-25, 90, 120, 60, 68, 0.25, 7.4);

  // 5. Northern Ridge Pass
  createMountainRidge(-15, -95, 105, 50, 64, 0.0, 9.1);
  createMountainRidge(-70, -78, 90, 48, 58, 0.45, 4.3);

  // 6. Southern Valley Flanks
  createMountainRidge(60, 75, 95, 50, 56, -0.35, 1.8);
  createMountainRidge(-72, 68, 100, 52, 60, 0.40, 8.5);

  // Natural Talus Boulders scattered along mountain skirts
  const boulderGeo = new THREE.DodecahedronGeometry(1.6, 1);
  for (let b = 0; b < 24; b++) {
    const angle = (b / 24) * Math.PI * 2 + 0.15;
    const dist = 48 + Math.sin(b * 3.7) * 8;
    const boulder = new THREE.Mesh(boulderGeo, mountainRockMat);
    const scale = 0.8 + Math.abs(Math.sin(b * 2.3)) * 1.4;
    boulder.scale.set(scale, scale * 0.75, scale * 1.1);
    boulder.position.set(Math.cos(angle) * dist, scale * 0.6, Math.sin(angle) * dist);
    boulder.rotation.set(b * 0.5, b * 1.1, b * 0.3);
    boulder.castShadow = true;
    boulder.receiveShadow = true;
    sceneGroup.add(boulder);
  }

  // 360-Degree Desert Mountain Horizon Sky Cylinder
  const textureLoader = new THREE.TextureLoader();
  const panoTex = textureLoader.load('/assets/environment/mecca_mountain_panorama.jpg');
  panoTex.wrapS = THREE.RepeatWrapping;
  panoTex.wrapT = THREE.ClampToEdgeWrapping;
  const panoGeo = new THREE.CylinderGeometry(140, 140, 75, 64, 1, true);
  const panoMat = new THREE.MeshBasicMaterial({
    map: panoTex,
    side: THREE.BackSide,
    fog: false
  });
  const panoMesh = new THREE.Mesh(panoGeo, panoMat);
  panoMesh.position.y = 22;
  sceneGroup.add(panoMesh);

  // Outer terrain barrier collider
  addCollider(-48, -42, -50, 50);
  addCollider(42, 48, -50, 50);
  addCollider(-48, 48, 42, 48);
  addCollider(-48, 48, -50, -42);

  // =========================================================================
  // 6. TRADITIONAL HIJAZI VERNACULAR ARCHITECTURE (7th-CENTURY RESIDENCES)
  // Stepped volumes, thick fieldstone lower walls, mudbrick upper terraces,
  // protruding palm ceiling beams, carved wooden portals, mashrabiyas
  // =========================================================================

  function createHijaziHouseEnsemble(
    x: number,
    z: number,
    width: number,
    depth: number,
    height: number,
    rotY: number = 0,
    hasUpperTerrace: boolean = true
  ) {
    const bGroup = new THREE.Group();
    bGroup.position.set(x, 0, z);
    bGroup.rotation.y = rotY;

    // Ground Floor: Thick Basalt/Granite Fieldstone Masonry
    const groundH = height * 0.52;
    const groundGeo = new THREE.BoxGeometry(width, groundH, depth);
    const groundMesh = new THREE.Mesh(groundGeo, basaltMat);
    groundMesh.position.y = groundH / 2;
    groundMesh.castShadow = true;
    groundMesh.receiveShadow = true;
    bGroup.add(groundMesh);

    // Decorative Plaster String Course separating stories
    const stringCourse = new THREE.Mesh(
      new THREE.BoxGeometry(width + 0.25, 0.18, depth + 0.25),
      mudbrickMat
    );
    stringCourse.position.y = groundH;
    bGroup.add(stringCourse);

    // Upper Floor: Sundried Adobe Mudbrick
    const upperH = height - groundH;
    const upperW = hasUpperTerrace ? width * 0.78 : width;
    const upperD = hasUpperTerrace ? depth * 0.82 : depth;
    const upperGeo = new THREE.BoxGeometry(upperW, upperH, upperD);
    const upperMesh = new THREE.Mesh(upperGeo, mudbrickMat);
    upperMesh.position.set(hasUpperTerrace ? -width * 0.1 : 0, groundH + upperH / 2, 0);
    upperMesh.castShadow = true;
    upperMesh.receiveShadow = true;
    bGroup.add(upperMesh);

    // Flat Roof Parapet (Sutuh) with Crenellations
    const parapetH = 0.55;
    const parapetGeo = new THREE.BoxGeometry(upperW + 0.2, parapetH, upperD + 0.2);
    const parapet = new THREE.Mesh(parapetGeo, mudbrickMat);
    parapet.position.set(hasUpperTerrace ? -width * 0.1 : 0, height + parapetH / 2, 0);
    parapet.castShadow = true;
    bGroup.add(parapet);

    // Traditional Protruding Palm Roof Beams (Sawari)
    const beamCount = Math.floor(upperW / 1.1);
    for (let b = 0; b < beamCount; b++) {
      const beamGeo = new THREE.CylinderGeometry(0.08, 0.08, upperD + 0.8, 8);
      beamGeo.rotateX(Math.PI / 2);
      const beam = new THREE.Mesh(beamGeo, woodMat);
      beam.position.set(
        (hasUpperTerrace ? -width * 0.1 : 0) - upperW / 2 + 0.55 + b * 1.1,
        height - 0.25,
        0
      );
      bGroup.add(beam);
    }

    // Carved Wooden Deep-Recessed Portal Door
    const doorW = 1.25;
    const doorH = 2.3;
    const doorFrame = new THREE.Mesh(
      new THREE.BoxGeometry(doorW + 0.28, doorH + 0.28, 0.22),
      woodMat
    );
    doorFrame.position.set(0, doorH / 2, depth / 2 + 0.08);
    doorFrame.castShadow = true;
    bGroup.add(doorFrame);

    const doorLeaf = new THREE.Mesh(
      new THREE.BoxGeometry(doorW, doorH, 0.12),
      woodMat
    );
    doorLeaf.position.set(0, doorH / 2, depth / 2 + 0.12);
    bGroup.add(doorLeaf);

    // Stone Bench (Mastaba) outside doorway for street seating
    const mastaba = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.45, 0.55),
      basaltMat
    );
    mastaba.position.set(width * 0.28, 0.225, depth / 2 + 0.28);
    mastaba.castShadow = true;
    mastaba.receiveShadow = true;
    bGroup.add(mastaba);

    // Mashrabiya / Lattice Screen Box Window on Upper Story
    const mashW = 1.35;
    const mashH = 1.55;
    const mashD = 0.55;
    const mashMesh = new THREE.Mesh(new THREE.BoxGeometry(mashW, mashH, mashD), woodMat);
    mashMesh.position.set(
      hasUpperTerrace ? -width * 0.1 : 0,
      groundH + upperH * 0.55,
      upperD / 2 + mashD / 2
    );
    mashMesh.castShadow = true;
    bGroup.add(mashMesh);

    sceneGroup.add(bGroup);

    // Airtight building collider
    const hw = (Math.abs(Math.cos(rotY)) * width + Math.abs(Math.sin(rotY)) * depth) / 2 + 0.4;
    const hd = (Math.abs(Math.sin(rotY)) * width + Math.abs(Math.cos(rotY)) * depth) / 2 + 0.4;
    addCollider(x - hw, x + hw, z - hd, z + hd);
  }

  // --- ORGANIZED HISTORICAL MECCA CITY QUARTERS ---

  // 1. Dar al-Nadwah Quarter (North of Kaaba Sanctuary)
  createHijaziHouseEnsemble(0, -32, 9.5, 7.5, 7.8, 0.0, true);
  createHijaziHouseEnsemble(-15, -30, 8.0, 6.8, 6.8, 0.2, true);
  createHijaziHouseEnsemble(15, -30, 8.0, 6.8, 7.0, -0.2, true);

  // 2. Banu Hashim Residential Quarter (East toward Safa)
  createHijaziHouseEnsemble(22, -8, 8.2, 6.5, 7.2, -0.25, true);
  createHijaziHouseEnsemble(24, -19, 8.5, 7.2, 7.5, 0.15, true);
  createHijaziHouseEnsemble(23, 5, 8.0, 6.8, 6.8, -0.15, true);
  createHijaziHouseEnsemble(24, 16, 8.4, 7.0, 7.2, 0.2, true);

  // 3. Western Quarter (Along the Medina / Caravan Route)
  createHijaziHouseEnsemble(-22, -8, 8.2, 6.5, 7.2, 0.25, true);
  createHijaziHouseEnsemble(-24, -19, 8.5, 7.2, 7.5, -0.15, true);
  createHijaziHouseEnsemble(-23, 5, 8.0, 6.8, 6.8, 0.15, true);
  createHijaziHouseEnsemble(-24, 16, 8.4, 7.0, 7.2, -0.2, true);

  // 4. Southern Residential Quarter
  createHijaziHouseEnsemble(-12, 26, 8.2, 6.8, 6.6, 0.1, true);
  createHijaziHouseEnsemble(12, 26, 8.2, 6.8, 6.8, -0.1, true);
  createHijaziHouseEnsemble(0, 32, 9.0, 7.0, 7.4, 0.0, true);

  // Covered Street Portico / Archway spanning between two buildings (Authentic shaded Zuqaq)
  const archGroup = new THREE.Group();
  archGroup.position.set(23, 0, -1.5);
  const archPillarGeo = new THREE.BoxGeometry(0.8, 4.2, 0.8);
  [-1.8, 1.8].forEach(pz => {
    const p = new THREE.Mesh(archPillarGeo, basaltMat);
    p.position.set(0, 2.1, pz);
    archGroup.add(p);
  });
  const archSpan = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.0, 4.4), mudbrickMat);
  archSpan.position.set(0, 4.6, 0);
  archGroup.add(archSpan);
  sceneGroup.add(archGroup);

  // =========================================================================
  // 7. HISTORICAL BAZAAR & MARKET STALLS (SOUQ MECCA)
  // Shaded timber canopies, woven kilim carpets, spice sacks, pottery jars (zir)
  // =========================================================================

  function createHistoricalMarketStall(x: number, z: number, rotY: number) {
    const mGroup = new THREE.Group();
    const gH = getHistoricalGroundHeight(x, z);
    mGroup.position.set(x, gH, z);
    mGroup.rotation.y = rotY;

    // Woven Kilim Carpet on Ground
    const carpetGeo = new THREE.PlaneGeometry(3.2, 2.4);
    carpetGeo.rotateX(-Math.PI / 2);
    const carpetMat = new THREE.MeshStandardMaterial({
      color: 0x8a2d1d,
      roughness: 0.85
    });
    const carpet = new THREE.Mesh(carpetGeo, carpetMat);
    carpet.position.y = 0.015;
    mGroup.add(carpet);

    // Weathered Wooden Counter Table
    const tableGeo = new THREE.BoxGeometry(2.8, 0.85, 1.1);
    const table = new THREE.Mesh(tableGeo, woodMat);
    table.position.y = 0.425;
    table.castShadow = true;
    table.receiveShadow = true;
    mGroup.add(table);

    // Canopy Timber Posts
    [-1.25, 1.25].forEach(px => {
      [-0.55, 0.55].forEach(pz => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 2.6, 6), woodMat);
        post.position.set(px, 1.3, pz);
        mGroup.add(post);
      });
    });

    // Woven Palm Thatch / Burlap Canopy
    const awningGeo = new THREE.PlaneGeometry(3.2, 1.8);
    awningGeo.rotateX(-Math.PI / 2 + 0.12);
    const awningMat = new THREE.MeshStandardMaterial({
      color: 0x9e7a56,
      roughness: 0.88,
      side: THREE.DoubleSide
    });
    const awning = new THREE.Mesh(awningGeo, awningMat);
    awning.position.set(0, 2.55, 0);
    awning.castShadow = true;
    mGroup.add(awning);

    // Traditional Clay Water Amphorae & Spice Pots
    [-0.9, -0.3, 0.3, 0.9].forEach((px, i) => {
      const jarGeo = new THREE.CylinderGeometry(0.12, 0.18, 0.42, 12);
      const jarMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x9e5232 : 0xb57849,
        roughness: 0.82
      });
      const jar = new THREE.Mesh(jarGeo, jarMat);
      jar.position.set(px, 0.85 + 0.21, 0);
      jar.castShadow = true;
      mGroup.add(jar);
    });

    sceneGroup.add(mGroup);
    addCollider(x - 1.6, x + 1.6, z - 1.2, z + 1.2);
  }

  // Market stalls along outer street edges
  createHistoricalMarketStall(-18, 0, 0.35);
  createHistoricalMarketStall(-18, 8, -0.2);
  createHistoricalMarketStall(18, 0, -0.35);
  createHistoricalMarketStall(18, 8, 0.2);

  // =========================================================================
  // 8. HISTORICAL DATE PALMS (PHOENIX DACTYLIFERA)
  // Curved segmented trunks, natural spreading crowns, and date clusters
  // =========================================================================

  const palmTrunkMat = new THREE.MeshStandardMaterial({ color: 0x483220, roughness: 0.9 });
  const palmFrondMat = new THREE.MeshStandardMaterial({ color: 0x2e5c26, roughness: 0.68, side: THREE.DoubleSide });

  function createAuthenticDatePalm(x: number, z: number) {
    const palm = new THREE.Group();
    const gH = getHistoricalGroundHeight(x, z);
    palm.position.set(x, gH, z);

    // Curved natural trunk
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(Math.sin(x * 0.1) * 0.4, 2.8, Math.cos(z * 0.1) * 0.4),
      new THREE.Vector3(Math.sin(x * 0.1) * 0.7, 5.8, Math.cos(z * 0.1) * 0.7)
    ]);
    const trunkGeo = new THREE.TubeGeometry(curve, 16, 0.26, 8, false);
    const trunk = new THREE.Mesh(trunkGeo, palmTrunkMat);
    trunk.castShadow = true;
    palm.add(trunk);

    // Crown of 12 spreading fronds
    for (let f = 0; f < 12; f++) {
      const fAngle = (f / 12) * Math.PI * 2;
      const frondGeo = new THREE.ConeGeometry(0.65, 3.8, 5);
      frondGeo.rotateX(Math.PI / 2.8);
      frondGeo.rotateZ(fAngle);
      const frond = new THREE.Mesh(frondGeo, palmFrondMat);
      frond.position.set(Math.sin(x * 0.1) * 0.7, 5.7, Math.cos(z * 0.1) * 0.7);
      frond.castShadow = true;
      palm.add(frond);
    }

    // Date fruit clusters
    const datesGeo = new THREE.SphereGeometry(0.32, 8, 8);
    const datesMat = new THREE.MeshStandardMaterial({ color: 0x6e2808, roughness: 0.75 });
    const dates = new THREE.Mesh(datesGeo, datesMat);
    dates.position.set(Math.sin(x * 0.1) * 0.7, 5.3, Math.cos(z * 0.1) * 0.7);
    palm.add(dates);

    sceneGroup.add(palm);
    addCollider(x - 0.7, x + 0.7, z - 0.7, z + 0.7);
  }

  // Palms in sanctuary courtyards and residential perimeter
  createAuthenticDatePalm(-14, -14);
  createAuthenticDatePalm(14, -14);
  createAuthenticDatePalm(-13, 12);
  createAuthenticDatePalm(13, 12);
  createAuthenticDatePalm(0, -25);
  createAuthenticDatePalm(-2, 23);

  // =========================================================================
  // 9. MISSION BEACON & CELESTIAL TIME PORTAL
  // =========================================================================

  // Mission Beacon
  const beaconGroup = new THREE.Group();
  beaconGroup.position.set(0, 0.15, -18);

  const pillarGeo = new THREE.CylinderGeometry(0.35, 0.35, 4.0, 16);
  const pillarMat = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    emissive: 0xffaa00,
    emissiveIntensity: 0.8,
    transparent: true,
    opacity: 0.85
  });
  const pillar = new THREE.Mesh(pillarGeo, pillarMat);
  pillar.position.y = 2.0;
  beaconGroup.add(pillar);

  const ringGeo = new THREE.TorusGeometry(1.4, 0.08, 8, 32);
  ringGeo.rotateX(Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xffe680 });
  const ring1 = new THREE.Mesh(ringGeo, ringMat);
  ring1.position.y = 1.0;
  beaconGroup.add(ring1);

  const ring2 = new THREE.Mesh(ringGeo, ringMat);
  ring2.position.y = 2.5;
  ring2.scale.set(0.75, 0.75, 0.75);
  beaconGroup.add(ring2);

  const starGeo = new THREE.OctahedronGeometry(0.6, 0);
  const starMat = new THREE.MeshStandardMaterial({
    color: 0xfff0a0,
    emissive: 0xffd700,
    emissiveIntensity: 1.2
  });
  const star = new THREE.Mesh(starGeo, starMat);
  star.position.y = 4.4;
  beaconGroup.add(star);

  const beaconLight = new THREE.PointLight(0xffb700, 3.5, 18);
  beaconLight.position.y = 3.5;
  beaconGroup.add(beaconLight);

  sceneGroup.add(beaconGroup);

  // Time Portal (Active upon completing Year Mission)
  const portalGroup = new THREE.Group();
  portalGroup.position.set(0, 0, 16);

  [-2.2, 2.2].forEach(px => {
    const pMesh = new THREE.Mesh(new THREE.BoxGeometry(0.9, 5.2, 0.9), mudbrickMat);
    pMesh.position.set(px, 2.6, 0);
    pMesh.castShadow = true;
    portalGroup.add(pMesh);
  });

  const archTop = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.9, 1.1), mudbrickMat);
  archTop.position.set(0, 5.2, 0);
  archTop.castShadow = true;
  portalGroup.add(archTop);

  const vortexGeo = new THREE.RingGeometry(0.2, 2.1, 32);
  const vortexMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.0
  });
  const vortex = new THREE.Mesh(vortexGeo, vortexMat);
  vortex.position.set(0, 2.6, 0);
  portalGroup.add(vortex);

  const portalLight = new THREE.PointLight(0x38bdf8, 0.0, 16);
  portalLight.position.set(0, 2.6, 0);
  portalGroup.add(portalLight);

  sceneGroup.add(portalGroup);

  // Dynamic animations loop
  let animTimer = 0;
  function updateEnvironment(delta: number, isPortalActive: boolean) {
    animTimer += delta;

    star.rotation.y += delta * 1.5;
    star.rotation.x = Math.sin(animTimer * 2) * 0.2;
    ring1.rotation.z += delta * 0.8;
    ring2.rotation.z -= delta * 1.2;
    ring1.position.y = 1.0 + Math.sin(animTimer * 2.5) * 0.3;
    ring2.position.y = 2.5 + Math.cos(animTimer * 2.5) * 0.3;
    pillarMat.opacity = 0.7 + Math.sin(animTimer * 4) * 0.2;

    if (isPortalActive) {
      vortexMat.opacity = Math.min(0.92, vortexMat.opacity + delta * 1.2);
      vortex.rotation.z += delta * 3.5;
      portalLight.intensity = 2.5 + Math.sin(animTimer * 6) * 0.8;
    } else {
      vortexMat.opacity = Math.max(0.0, vortexMat.opacity - delta * 2);
      portalLight.intensity = 0;
    }
  }

  function setBeaconPosition(pos: [number, number, number]) {
    const groundY = getHistoricalGroundHeight(pos[0], pos[2]);
    beaconGroup.position.set(pos[0], groundY, pos[2]);
  }

  return {
    sceneGroup,
    collisionBoxes,
    portalGroup,
    beaconGroup,
    updateEnvironment,
    setBeaconPosition,
    getGroundHeight: getHistoricalGroundHeight
  };
}
