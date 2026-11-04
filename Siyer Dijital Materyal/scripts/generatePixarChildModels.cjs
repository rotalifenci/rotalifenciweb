const THREE = require('three');
const fs = require('fs');
const path = require('path');

// Node.js FileReader polyfill for GLTFExporter
global.FileReader = class FileReader {
  readAsArrayBuffer(blob) {
    if (blob && blob.arrayBuffer) {
      blob.arrayBuffer().then(ab => {
        this.result = ab;
        if (this.onloadend) this.onloadend();
      });
    } else {
      this.result = blob instanceof ArrayBuffer ? blob : new ArrayBuffer(0);
      if (this.onloadend) this.onloadend();
    }
  }
};

const { GLTFExporter } = require('three/examples/jsm/exporters/GLTFExporter.js');

/**
 * EXACT 3D PIXAR/DISNEY STYLIZED CHARACTER GENERATOR
 * Faithful to `eren_referans.png` and `aybuke_referans.png`:
 *
 * EREN:
 * - Swept chestnut stylized hair with rounded volume and cowlick
 * - Big expressive dark chocolate cartoon eyes with golden hazel glow & dual sparkles
 * - Cute button nose, gentle boyish smile
 * - Cream explorer shirt with V-neck collar
 * - Olive safari vest with 3D flap pockets
 * - Brown cargo pants with thigh pockets & rolled cuffs
 * - Classic hiking boots with laces (soles at Y = 0.0000)
 * - Brown leather backpack on shoulders
 *
 * AYBÜKE:
 * - Big expressive dark eyes, round cheerful face, radiant joyful smile with clean white teeth
 * - Traditional scarlet headdress with golden medallions and dangling gold coins
 * - Face, neck and collar 100% visible and unobstructed (NO CHIN COWL!)
 * - Cascading dark wavy curls at temples
 * - Cream pleated tunic dress with golden hem & belt
 * - Traditional scarlet embroidered vest with floral gold motifs
 * - Beige trousers, cognac shoes, backpack, hands completely empty!
 */

function createMat(name, colorHex = 0xffffff, roughness = 0.55, metalness = 0.02) {
  const mat = new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness: roughness,
    metalness: metalness
  });
  mat.name = name;
  return mat;
}

function buildCharacterMesh(type) {
  const root = new THREE.Group();
  root.name = `character_${type}`;

  // 1. Materials tuned to exact reference palettes
  const skinMat = createMat('Mat_Skin', type === 'eren' ? 0xf5cbb0 : 0xfae0ce, 0.50, 0.02);
  const blushMat = createMat('Mat_Blush', type === 'eren' ? 0xf0b299 : 0xf2a99d, 0.65, 0.01);
  const hairMat = createMat('Mat_Hair', type === 'eren' ? 0x723a1c : 0x24140b, 0.68, 0.04);

  // Eyes
  const eyeWhiteMat = createMat('Mat_EyeWhite', 0xf6f8fc, 0.10, 0.02);
  const eyeIrisMat = createMat('Mat_EyeIris', type === 'eren' ? 0x361d10 : 0x24130a, 0.15, 0.04);
  const eyeIrisInnerMat = createMat('Mat_EyeIrisInner', type === 'eren' ? 0x723e1e : 0x5a2f14, 0.20, 0.04);
  const eyePupilMat = createMat('Mat_EyePupil', 0x080608, 0.06, 0.02);
  const eyeHighlightMat = createMat('Mat_EyeHighlight', 0xffffff, 0.02, 0.98);
  const eyelashMat = createMat('Mat_Eyelash', 0x201008, 0.65, 0.02);
  const eyebrowMat = createMat('Mat_Eyebrow', type === 'eren' ? 0x4a2816 : 0x28160c, 0.75, 0.02);

  // Mouth & teeth
  const lipMat = createMat('Mat_Lip', type === 'eren' ? 0xb85248 : 0xd64f60, 0.35, 0.02);
  const teethMat = createMat('Mat_Teeth', 0xffffff, 0.12, 0.04);

  // Eren clothing
  const erenShirtMat = createMat('Mat_ErenShirt', 0xf0e5cb, 0.72, 0.02);
  const erenVestMat = createMat('Mat_ErenVest', 0x63683a, 0.65, 0.04);
  const erenVestTrimMat = createMat('Mat_ErenVestTrim', 0x3e2314, 0.80, 0.04);
  const erenPantsMat = createMat('Mat_ErenPants', 0x5c3822, 0.78, 0.02);
  const bootMat = createMat('Mat_Boots', 0x82421c, 0.70, 0.06);
  const bootSoleMat = createMat('Mat_BootSole', 0x1e1109, 0.88, 0.04);
  const buckleMat = createMat('Mat_Buckle', 0xdfb430, 0.22, 0.85);

  // Aybüke clothing
  const aybukeHeadscarfMat = createMat('Mat_Headscarf', 0xd02026, 0.52, 0.05);
  const goldCoinMat = createMat('Mat_GoldCoin', 0xdfb430, 0.18, 0.90);
  const goldTrimMat = createMat('Mat_GoldTrim', 0xe2ba38, 0.22, 0.85);
  const tasselMat = createMat('Mat_Tassels', 0xe24a2c, 0.60, 0.04);
  const aybukeTunicMat = createMat('Mat_AybukeTunic', 0xf3e8cc, 0.74, 0.02);
  const aybukeVestMat = createMat('Mat_AybukeVest', 0xba1622, 0.52, 0.06);
  const aybukePantsMat = createMat('Mat_AybukePants', 0xd2ba92, 0.80, 0.02);
  const aybukeShoesMat = createMat('Mat_AybukeShoes', 0xa66e42, 0.72, 0.04);

  // Backpack
  const backpackMat = createMat('Mat_Backpack', 0x6e371b, 0.68, 0.06);
  const backpackStrapMat = createMat('Mat_BackpackStrap', 0x422010, 0.78, 0.04);

  function addMesh(parent, geo, mat, pos = [0, 0, 0], rot = [0, 0, 0], scale = [1, 1, 1], name = '') {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...pos);
    mesh.rotation.set(...rot);
    mesh.scale.set(...scale);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    if (name) mesh.name = name;
    parent.add(mesh);
    return mesh;
  }

  // SKELETON HIERARCHY (~1.25m height, Soles firmly at Y = 0.0000)
  const hips = new THREE.Group(); hips.name = 'Hips'; hips.position.set(0, 0.60, 0); root.add(hips);
  const spine = new THREE.Group(); spine.name = 'Spine'; spine.position.set(0, 0.11, 0); hips.add(spine);
  const chest = new THREE.Group(); chest.name = 'Chest'; chest.position.set(0, 0.15, 0); spine.add(chest);
  const neck = new THREE.Group(); neck.name = 'Neck'; neck.position.set(0, 0.14, 0); chest.add(neck);
  const head = new THREE.Group(); head.name = 'Head'; head.position.set(0, 0.08, 0); neck.add(head);

  // Arms
  const leftShoulder = new THREE.Group(); leftShoulder.name = 'LeftShoulder'; leftShoulder.position.set(0.18, 0.09, 0); chest.add(leftShoulder);
  const leftArm = new THREE.Group(); leftArm.name = 'LeftArm'; leftArm.position.set(0.01, 0, 0); leftShoulder.add(leftArm);
  const leftForeArm = new THREE.Group(); leftForeArm.name = 'LeftForeArm'; leftForeArm.position.set(0, -0.20, 0); leftArm.add(leftForeArm);
  const leftHand = new THREE.Group(); leftHand.name = 'LeftHand'; leftHand.position.set(0, -0.17, 0); leftForeArm.add(leftHand);

  const rightShoulder = new THREE.Group(); rightShoulder.name = 'RightShoulder'; rightShoulder.position.set(-0.18, 0.09, 0); chest.add(rightShoulder);
  const rightArm = new THREE.Group(); rightArm.name = 'RightArm'; rightArm.position.set(-0.01, 0, 0); rightShoulder.add(rightArm);
  const rightForeArm = new THREE.Group(); rightForeArm.name = 'RightForeArm'; rightForeArm.position.set(0, -0.20, 0); rightArm.add(rightForeArm);
  const rightHand = new THREE.Group(); rightHand.name = 'RightHand'; rightHand.position.set(0, -0.17, 0); rightForeArm.add(rightHand);

  // Legs
  const leftUpLeg = new THREE.Group(); leftUpLeg.name = 'LeftUpLeg'; leftUpLeg.position.set(0.09, -0.04, 0); hips.add(leftUpLeg);
  const leftLeg = new THREE.Group(); leftLeg.name = 'LeftLeg'; leftLeg.position.set(0, -0.28, 0); leftUpLeg.add(leftLeg);
  const leftFoot = new THREE.Group(); leftFoot.name = 'LeftFoot'; leftFoot.position.set(0, -0.24, 0); leftLeg.add(leftFoot);

  const rightUpLeg = new THREE.Group(); rightUpLeg.name = 'RightUpLeg'; rightUpLeg.position.set(-0.09, -0.04, 0); hips.add(rightUpLeg);
  const rightLeg = new THREE.Group(); rightLeg.name = 'RightLeg'; rightLeg.position.set(0, -0.28, 0); rightUpLeg.add(rightLeg);
  const rightFoot = new THREE.Group(); rightFoot.name = 'RightFoot'; rightFoot.position.set(0, -0.24, 0); rightLeg.add(rightFoot);

  // 2. TORSO & LEGS
  if (type === 'eren') {
    // Brown cargo trousers
    const pelvisGeo = new THREE.CylinderGeometry(0.145, 0.138, 0.17, 24);
    pelvisGeo.scale(1.06, 1.0, 0.86);
    addMesh(hips, pelvisGeo, erenPantsMat, [0, 0.01, 0], [0, 0, 0], [1, 1, 1], 'PantsMesh');

    const abdomenGeo = new THREE.CylinderGeometry(0.140, 0.134, 0.19, 24);
    abdomenGeo.scale(1.05, 1.0, 0.84);
    addMesh(spine, abdomenGeo, erenShirtMat, [0, 0.05, 0]);

    // Belt with rectangular brass buckle
    const beltGeo = new THREE.CylinderGeometry(0.148, 0.148, 0.042, 24);
    beltGeo.scale(1.08, 1.0, 0.86);
    addMesh(hips, beltGeo, erenVestTrimMat, [0, 0.08, 0]);
    const buckleGeo = new THREE.BoxGeometry(0.044, 0.038, 0.024);
    addMesh(hips, buckleGeo, buckleMat, [0, 0.08, 0.130]);
  } else {
    // Aybüke: Flowing pleated linen tunic dress
    const pelvisGeo = new THREE.CylinderGeometry(0.142, 0.138, 0.17, 24);
    pelvisGeo.scale(1.06, 1.0, 0.86);
    addMesh(hips, pelvisGeo, aybukeTunicMat, [0, 0.01, 0], [0, 0, 0], [1, 1, 1], 'TunicPelvisMesh');

    const abdomenGeo = new THREE.CylinderGeometry(0.138, 0.134, 0.19, 24);
    abdomenGeo.scale(1.05, 1.0, 0.84);
    addMesh(spine, abdomenGeo, aybukeTunicMat, [0, 0.05, 0]);

    // Waist belt sash
    const beltGeo = new THREE.CylinderGeometry(0.144, 0.144, 0.036, 24);
    beltGeo.scale(1.06, 1.0, 0.86);
    addMesh(hips, beltGeo, createMat('Mat_Sash', 0x8a522a, 0.75), [0, 0.07, 0]);

    // Pleated bell skirt ending at mid-calf
    const skirtGeo = new THREE.CylinderGeometry(0.140, 0.265, 0.42, 32, 6, false);
    const skirtPos = skirtGeo.attributes.position;
    for (let i = 0; i < skirtPos.count; i++) {
      const vx = skirtPos.getX(i);
      const vz = skirtPos.getZ(i);
      const vy = skirtPos.getY(i);
      const angle = Math.atan2(vz, vx);
      const fluting = (0.21 - vy) / 0.42;
      const pleat = Math.sin(angle * 12) * 0.014 * fluting;
      skirtPos.setX(i, vx * (1 + pleat));
      skirtPos.setZ(i, vz * (1 + pleat));
    }
    skirtGeo.computeVertexNormals();
    addMesh(hips, skirtGeo, aybukeTunicMat, [0, -0.12, 0], [0, 0, 0], [1, 1, 1], 'TunicSkirtMesh');

    // Golden hem trim
    const skirtHem = new THREE.TorusGeometry(0.266, 0.008, 8, 32);
    skirtHem.rotateX(Math.PI / 2);
    addMesh(hips, skirtHem, goldTrimMat, [0, -0.33, 0]);
  }

  // Inner shirt / tunic chest (sized so outer vests sit comfortably over it)
  const chestGeo = new THREE.CylinderGeometry(0.142, 0.135, 0.21, 24);
  chestGeo.scale(1.06, 1.0, 0.84);
  addMesh(chest, chestGeo, type === 'eren' ? erenShirtMat : aybukeTunicMat, [0, 0.06, 0]);

  // Open natural child neck
  const neckGeo = new THREE.CylinderGeometry(0.058, 0.068, 0.11, 18);
  addMesh(neck, neckGeo, skinMat, [0, 0.05, 0]);

  // 3. 3D HEAD & SCULPTED CUTE FACE (Exact Pixar Stylized Proportions)
  const headGeo = new THREE.SphereGeometry(0.142, 32, 28);
  headGeo.scale(0.96, 1.02, 0.94);
  addMesh(head, headGeo, skinMat, [0, 0.08, 0], [0, 0, 0], [1, 1, 1], 'HeadMesh');

  // Soft rosy smiling child cheeks
  [-0.076, 0.076].forEach(cx => {
    const blushGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.002, 16);
    blushGeo.rotateX(Math.PI / 2);
    addMesh(head, blushGeo, blushMat, [cx, 0.068, 0.118]);
  });

  // Soft natural chin
  const chinGeo = new THREE.SphereGeometry(0.026, 16, 12);
  chinGeo.scale(1.0, 0.70, 0.60);
  addMesh(head, chinGeo, skinMat, [0, 0.016, 0.122]);

  // Big Expressive Pixar Stylized Eyes
  [-0.048, 0.048].forEach((ex, i) => {
    // Sclera (White of eye, curved almond shape, flush with head)
    const scleraGeo = new THREE.SphereGeometry(0.022, 18, 16);
    scleraGeo.scale(1.15, 0.94, 0.35);
    addMesh(head, scleraGeo, eyeWhiteMat, [ex, 0.095, 0.128], [0, i === 0 ? 0.05 : -0.05, 0]);

    // Iris (Large radiant dark chocolate)
    const irisGeo = new THREE.CylinderGeometry(0.0135, 0.0135, 0.003, 20);
    irisGeo.rotateX(Math.PI / 2);
    addMesh(head, irisGeo, eyeIrisMat, [ex, 0.095, 0.133]);

    // Inner Iris Glow (Warm golden hazel center)
    const innerIrisGeo = new THREE.CylinderGeometry(0.009, 0.009, 0.003, 16);
    innerIrisGeo.rotateX(Math.PI / 2);
    addMesh(head, innerIrisGeo, eyeIrisInnerMat, [ex, 0.095, 0.134]);

    // Pupil
    const pupilGeo = new THREE.CylinderGeometry(0.0055, 0.0055, 0.003, 16);
    pupilGeo.rotateX(Math.PI / 2);
    addMesh(head, pupilGeo, eyePupilMat, [ex, 0.095, 0.136]);

    // Primary bright specular sparkle (upper corner)
    const hlGeo = new THREE.SphereGeometry(0.0032, 10, 8);
    addMesh(head, hlGeo, eyeHighlightMat, [ex + 0.0035, 0.100, 0.138]);

    // Secondary subtle sparkle (lower opposite corner)
    const hl2Geo = new THREE.SphereGeometry(0.0016, 8, 8);
    addMesh(head, hl2Geo, eyeHighlightMat, [ex - 0.0035, 0.090, 0.137]);

    // Soft stylized upper lash line
    const lidGeo = new THREE.TorusGeometry(0.022, 0.0028, 6, 20, Math.PI * 0.85);
    lidGeo.rotateZ(i === 0 ? -0.10 : 0.10);
    addMesh(head, lidGeo, eyelashMat, [ex, 0.108, 0.128]);
  });

  // Soft curved eyebrows
  [-0.048, 0.048].forEach((bx, i) => {
    const browGeo = new THREE.TorusGeometry(0.025, 0.0032, 6, 18, Math.PI * 0.68);
    browGeo.rotateZ(i === 0 ? -0.16 : 0.16);
    browGeo.rotateX(0.18);
    addMesh(head, browGeo, eyebrowMat, [bx, 0.124, 0.122]);
  });

  // Cute rounded button nose
  const noseTipGeo = new THREE.SphereGeometry(0.012, 16, 14);
  noseTipGeo.scale(1.10, 0.90, 0.95);
  addMesh(head, noseTipGeo, skinMat, [0, 0.062, 0.142]);

  // Smiling mouth & lips
  if (type === 'aybuke') {
    // Aybüke: Radiant joyful smile with beautiful teeth curve (matching reference!)
    const smileArc = new THREE.TorusGeometry(0.026, 0.0034, 8, 24, Math.PI * 0.84);
    smileArc.rotateZ(Math.PI * 1.08);
    addMesh(head, smileArc, lipMat, [0, 0.038, 0.132]);

    // Clean white teeth band inside smile
    const teethArc = new THREE.TorusGeometry(0.022, 0.0032, 6, 20, Math.PI * 0.72);
    teethArc.rotateZ(Math.PI * 1.14);
    addMesh(head, teethArc, teethMat, [0, 0.040, 0.133]);

    const btmLipGeo = new THREE.BoxGeometry(0.028, 0.004, 0.008);
    addMesh(head, btmLipGeo, lipMat, [0, 0.031, 0.131]);
  } else {
    // Eren: Gentle, friendly, boyish smile (matching reference!)
    const smileArc = new THREE.TorusGeometry(0.024, 0.0032, 8, 20, Math.PI * 0.74);
    smileArc.rotateZ(Math.PI * 1.13);
    addMesh(head, smileArc, lipMat, [0, 0.039, 0.132]);

    const btmLipGeo = new THREE.BoxGeometry(0.024, 0.004, 0.008);
    addMesh(head, btmLipGeo, lipMat, [0, 0.032, 0.131]);
  }

  // Soft cupped child ears
  [-0.135, 0.135].forEach((earX, i) => {
    const earGeo = new THREE.SphereGeometry(0.030, 14, 12);
    earGeo.scale(0.35, 0.88, 0.65);
    addMesh(head, earGeo, skinMat, [earX, 0.08, -0.01], [0, i === 0 ? 0.25 : -0.25, 0]);
  });

  // 4. HAIR & HEADWEAR
  if (type === 'eren') {
    // Eren: Swept chestnut stylized hair with rounded volume and cowlick
    const hairCapGeo = new THREE.SphereGeometry(0.150, 28, 24);
    hairCapGeo.scale(0.98, 1.04, 1.02);
    addMesh(head, hairCapGeo, hairMat, [0, 0.095, -0.012], [0, 0, 0], [1, 1, 1], 'HairMesh');

    // Curved volumetric locks sweeping across forehead
    const locks = [
      [0.02, 0.18, 0.085, 0.050, 0.085, 0.045, 0.15],
      [-0.04, 0.17, 0.080, 0.044, 0.075, 0.042, 0.25],
      [0.07, 0.17, 0.078, 0.042, 0.075, 0.042, -0.15],
      [-0.09, 0.13, 0.060, 0.038, 0.070, 0.038, 0.35],
      [0.09, 0.13, 0.060, 0.038, 0.070, 0.038, -0.30],
      [0.01, 0.22, 0.008, 0.052, 0.090, 0.052, -0.15],
      [-0.06, 0.21, -0.04, 0.046, 0.085, 0.048, 0.25],
      [0.06, 0.21, -0.04, 0.046, 0.085, 0.048, -0.25],
      // Cowlick at crown
      [-0.01, 0.24, -0.02, 0.028, 0.050, 0.028, 0.35]
    ];
    locks.forEach(([wx, wy, wz, rx, ry, rz, rotZ]) => {
      const lockGeo = new THREE.SphereGeometry(rx, 14, 12);
      lockGeo.scale(1.0, ry / rx, rz / rx);
      lockGeo.rotateZ(rotZ);
      addMesh(head, lockGeo, hairMat, [wx, wy, wz]);
    });
  } else {
    // Aybüke: Traditional Scarlet Headdress + Gold Medallions + Cascading Curls
    // Cap sits firmly on crown and back — FACE & NECK 100% VISIBLE! NO CHIN COWL!
    const scarfCapGeo = new THREE.SphereGeometry(0.152, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.54);
    scarfCapGeo.scale(0.98, 1.02, 1.02);
    scarfCapGeo.rotateX(-0.28);
    addMesh(head, scarfCapGeo, aybukeHeadscarfMat, [0, 0.096, -0.020], [0, 0, 0], [1, 1, 1], 'HeadscarfMesh');

    // Draped scarlet velvet cloth down the back of the neck & shoulders (completely open in front)
    const backDrapeGeo = new THREE.CylinderGeometry(0.146, 0.210, 0.28, 28, 4, true, -Math.PI * 0.42, Math.PI * 0.84);
    backDrapeGeo.rotateY(Math.PI);
    addMesh(head, backDrapeGeo, aybukeHeadscarfMat, [0, -0.04, -0.06]);

    // Front forehead gold diadem band
    const diademBand = new THREE.TorusGeometry(0.142, 0.006, 8, 32, Math.PI * 0.72);
    diademBand.rotateX(0.30);
    diademBand.rotateZ(-Math.PI * 0.36);
    addMesh(head, diademBand, goldTrimMat, [0, 0.155, 0.035]);

    // 5 Large central gold medallions (matching reference image!)
    for (let m = 0; m < 5; m++) {
      const frac = (m - 2) / 2;
      const angle = frac * 0.42;
      const mx = Math.sin(angle) * 0.140;
      const mz = Math.cos(angle) * 0.140 + 0.010;
      const my = 0.160 - Math.abs(frac) * 0.012;

      const medGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.004, 16);
      medGeo.rotateX(Math.PI / 2);
      addMesh(head, medGeo, goldCoinMat, [mx, my, mz], [0, -angle * 0.5, 0], [1, 1, 1], `GoldMedallion_${m}`);
    }

    // 12 Dangling gold coins below the medallions
    for (let c = 0; c < 12; c++) {
      const frac = (c - 5.5) / 5.5;
      const coinAngle = frac * 0.58;
      const cx = Math.sin(coinAngle) * 0.138;
      const cz = Math.cos(coinAngle) * 0.138 + 0.008;
      const cy = 0.144 - Math.abs(frac) * 0.014;

      const coinGeo = new THREE.CylinderGeometry(0.009, 0.009, 0.003, 14);
      coinGeo.rotateX(Math.PI / 2);
      addMesh(head, coinGeo, goldCoinMat, [cx, cy, cz], [0, -coinAngle * 0.5, 0], [1, 1, 1], `GoldCoin_${c}`);
    }

    // Hanging decorative tassels along the hood perimeter
    for (let t = 0; t < 10; t++) {
      const tAngle = (t - 4.5) * 0.28;
      const tx = Math.sin(tAngle) * 0.165;
      const tz = -Math.cos(tAngle) * 0.150;
      const ty = -0.14;
      const tasselGeo = new THREE.ConeGeometry(0.007, 0.022, 8);
      tasselGeo.rotateX(Math.PI);
      addMesh(head, tasselGeo, tasselMat, [tx, ty, tz]);
    }

    // Cascading dark curly hair locks framing temples in front of ears
    [-0.115, 0.115].forEach((curlX, i) => {
      const curlGeo = new THREE.TorusGeometry(0.028, 0.008, 6, 16, Math.PI * 1.5);
      curlGeo.rotateY(i === 0 ? 0.3 : -0.3);
      addMesh(head, curlGeo, hairMat, [curlX, 0.05, 0.06]);

      const curlGeo2 = new THREE.TorusGeometry(0.032, 0.008, 6, 16, Math.PI * 1.6);
      curlGeo2.rotateY(i === 0 ? 0.4 : -0.4);
      addMesh(head, curlGeo2, hairMat, [curlX * 0.95, -0.01, 0.05]);
    });
  }

  // 5. 3D VESTS (Overlays chest naturally, 100% visible from front, sides & back)
  if (type === 'eren') {
    // Eren Olive Expedition Vest: Outer shell wrapping around chest with open front
    const vestShellGeo = new THREE.CylinderGeometry(0.165, 0.156, 0.23, 24, 1, false, 0.42, Math.PI * 2 - 0.84);
    vestShellGeo.scale(1.08, 1.0, 0.88);
    addMesh(chest, vestShellGeo, erenVestMat, [0, 0.06, 0], [0, 0, 0], [1, 1, 1], 'VestMesh');

    // Leather trim lapels down both front openings
    [-0.065, 0.065].forEach(lx => {
      const lapelGeo = new THREE.BoxGeometry(0.022, 0.23, 0.035);
      addMesh(chest, lapelGeo, erenVestTrimMat, [lx, 0.06, 0.125]);
    });

    // 3D Chest Utility Pockets with Flaps and Brass Buttons
    [-0.10, 0.10].forEach(px => {
      const pocketGeo = new THREE.BoxGeometry(0.050, 0.058, 0.024);
      addMesh(chest, pocketGeo, erenVestMat, [px, 0.050, 0.130]);
      const flapGeo = new THREE.BoxGeometry(0.054, 0.018, 0.028);
      addMesh(chest, flapGeo, erenVestTrimMat, [px, 0.082, 0.132]);
      const btnGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.006, 8);
      btnGeo.rotateX(Math.PI / 2);
      addMesh(chest, btnGeo, buckleMat, [px, 0.080, 0.146]);
    });
  } else {
    // Aybüke Traditional Scarlet Embroidered Vest: Outer shell wrapping around chest with open front
    const vestShellGeo = new THREE.CylinderGeometry(0.162, 0.154, 0.23, 24, 1, false, 0.45, Math.PI * 2 - 0.90);
    vestShellGeo.scale(1.08, 1.0, 0.88);
    addMesh(chest, vestShellGeo, aybukeVestMat, [0, 0.06, 0], [0, 0, 0], [1, 1, 1], 'VestMesh');

    // Golden filigree piping down both front openings
    [-0.062, 0.062].forEach(lx => {
      const goldTrim = new THREE.BoxGeometry(0.018, 0.235, 0.032);
      addMesh(chest, goldTrim, goldTrimMat, [lx, 0.06, 0.124]);
    });

    // Golden filigree bottom hem
    const bottomGoldTrim = new THREE.TorusGeometry(0.165, 0.007, 6, 24, Math.PI * 1.5);
    bottomGoldTrim.rotateX(Math.PI / 2);
    bottomGoldTrim.rotateZ(-Math.PI * 0.75);
    bottomGoldTrim.scale(1.08, 0.88, 1.0);
    addMesh(chest, bottomGoldTrim, goldTrimMat, [0, -0.055, 0]);

    // Golden floral embroidery relief buttons on vest
    [-0.09, 0.09].forEach(fx => {
      const flowerGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.004, 8);
      flowerGeo.rotateX(Math.PI / 2);
      addMesh(chest, flowerGeo, goldTrimMat, [fx, 0.05, 0.128]);
    });
  }

  // 6. PROMINENT 3D LEATHER BACKPACK (Matches both references!)
  const backpackGroup = new THREE.Group();
  backpackGroup.name = 'BackpackGroup';
  backpackGroup.position.set(0, 0.03, -0.19);

  const packBodyGeo = new THREE.BoxGeometry(0.24, 0.26, 0.14);
  addMesh(backpackGroup, packBodyGeo, backpackMat, [0, 0, 0], [0, 0, 0], [1, 1, 1], 'BackpackBody');

  const flapGeo = new THREE.BoxGeometry(0.25, 0.09, 0.15);
  addMesh(backpackGroup, flapGeo, backpackMat, [0, 0.11, 0.01]);

  [-0.07, 0.07].forEach(bx => {
    const strapGeo = new THREE.BoxGeometry(0.022, 0.22, 0.018);
    addMesh(backpackGroup, strapGeo, backpackStrapMat, [bx, 0.01, -0.072]);
    const bGeo = new THREE.BoxGeometry(0.030, 0.022, 0.022);
    addMesh(backpackGroup, bGeo, buckleMat, [bx, -0.04, -0.074]);
  });

  // Bedroll under backpack
  const bedrollGeo = new THREE.CylinderGeometry(0.046, 0.046, 0.26, 16);
  bedrollGeo.rotateZ(Math.PI / 2);
  addMesh(backpackGroup, bedrollGeo, createMat('Mat_Bedroll', 0x5a4835, 0.8), [0, -0.16, -0.01]);

  // Shoulder straps over chest
  [-0.10, 0.10].forEach(sx => {
    const sGeo = new THREE.BoxGeometry(0.038, 0.28, 0.020);
    addMesh(chest, sGeo, backpackStrapMat, [sx, 0.06, 0.105], [0.18, 0, 0]);
  });

  chest.add(backpackGroup);

  // 7. ARMS & EMPTY HANDS (NO ITEMS IN HAND!)
  [leftShoulder, rightShoulder].forEach(sh => {
    const deltoidGeo = new THREE.SphereGeometry(0.062, 16, 14);
    addMesh(sh, deltoidGeo, type === 'eren' ? erenShirtMat : aybukeTunicMat, [0, 0, 0]);
  });

  [leftArm, rightArm].forEach(arm => {
    const armGeo = new THREE.CylinderGeometry(0.052, 0.046, 0.20, 16);
    addMesh(arm, armGeo, type === 'eren' ? erenShirtMat : aybukeTunicMat, [0, -0.10, 0]);
    const elbowGeo = new THREE.SphereGeometry(0.046, 14, 12);
    addMesh(arm, elbowGeo, type === 'eren' ? erenShirtMat : aybukeTunicMat, [0, -0.20, 0]);
  });

  [leftForeArm, rightForeArm].forEach(farm => {
    const farmGeo = new THREE.CylinderGeometry(0.045, 0.038, 0.17, 16);
    addMesh(farm, farmGeo, type === 'eren' ? erenShirtMat : aybukeTunicMat, [0, -0.085, 0]);
    const wristGeo = new THREE.SphereGeometry(0.036, 12, 10);
    addMesh(farm, wristGeo, skinMat, [0, -0.17, 0]);
  });

  [leftHand, rightHand].forEach((hand, i) => {
    const palmGeo = new THREE.BoxGeometry(0.040, 0.060, 0.022);
    addMesh(hand, palmGeo, skinMat, [0, -0.030, 0]);

    const thumbGeo = new THREE.BoxGeometry(0.015, 0.030, 0.015);
    thumbGeo.rotateZ(i === 0 ? 0.35 : -0.35);
    addMesh(hand, thumbGeo, skinMat, [i === 0 ? -0.020 : 0.020, -0.018, 0.008]);

    const fingersGeo = new THREE.BoxGeometry(0.036, 0.034, 0.018);
    addMesh(hand, fingersGeo, skinMat, [0, -0.070, 0]);
  });

  // 8. LEGS & SOLES (Grounded strictly at Y = 0.0000)
  [leftUpLeg, rightUpLeg].forEach(uleg => {
    const hipGeo = new THREE.SphereGeometry(0.065, 16, 14);
    addMesh(uleg, hipGeo, type === 'eren' ? erenPantsMat : aybukePantsMat, [0, 0, 0]);

    const thighGeo = new THREE.CylinderGeometry(0.064, 0.052, 0.28, 16);
    addMesh(uleg, thighGeo, type === 'eren' ? erenPantsMat : aybukePantsMat, [0, -0.14, 0]);

    // Eren: 3D Cargo Flap Pockets on outer thighs
    if (type === 'eren') {
      const pocketGeo = new THREE.BoxGeometry(0.024, 0.08, 0.09);
      const isLeft = uleg === leftUpLeg;
      addMesh(uleg, pocketGeo, erenPantsMat, [isLeft ? 0.068 : -0.068, -0.13, 0]);
      const pFlap = new THREE.BoxGeometry(0.026, 0.025, 0.094);
      addMesh(uleg, pFlap, erenVestTrimMat, [isLeft ? 0.069 : -0.069, -0.08, 0]);
    }
  });

  [leftLeg, rightLeg].forEach(leg => {
    const kneeGeo = new THREE.SphereGeometry(0.052, 14, 12);
    addMesh(leg, kneeGeo, type === 'eren' ? erenPantsMat : aybukePantsMat, [0, 0, 0]);

    const shinGeo = new THREE.CylinderGeometry(0.052, 0.044, 0.24, 16);
    addMesh(leg, shinGeo, type === 'eren' ? erenPantsMat : aybukePantsMat, [0, -0.12, 0]);

    const ankleSphere = new THREE.SphereGeometry(0.036, 12, 10);
    addMesh(leg, ankleSphere, type === 'eren' ? bootMat : aybukeShoesMat, [0, -0.24, 0]);

    // Eren: Rolled cuffs above boots
    if (type === 'eren') {
      const cuffGeo = new THREE.TorusGeometry(0.052, 0.012, 8, 20);
      cuffGeo.rotateX(Math.PI / 2);
      addMesh(leg, cuffGeo, erenPantsMat, [0, -0.21, 0]);
    }
  });

  [leftFoot, rightFoot].forEach(foot => {
    if (type === 'eren') {
      // Classic leather hiking boots with thick treaded soles
      const soleGeo = new THREE.BoxGeometry(0.095, 0.022, 0.22);
      addMesh(foot, soleGeo, bootSoleMat, [0, -0.030, 0.035], [0, 0, 0], [1, 1, 1], 'SoleMesh');

      const bootGeo = new THREE.BoxGeometry(0.090, 0.065, 0.20);
      addMesh(foot, bootGeo, bootMat, [0, 0.008, 0.035]);

      // Cross-tied laces
      const lacesGeo = new THREE.BoxGeometry(0.042, 0.015, 0.09);
      addMesh(foot, lacesGeo, createMat('Mat_Laces', 0x1a120d, 0.8), [0, 0.035, 0.045]);
    } else {
      // Aybüke: Light cognac slip-on leather shoes
      const soleGeo = new THREE.BoxGeometry(0.088, 0.020, 0.20);
      addMesh(foot, soleGeo, bootSoleMat, [0, -0.030, 0.03], [0, 0, 0], [1, 1, 1], 'SoleMesh');

      const shoeGeo = new THREE.BoxGeometry(0.084, 0.058, 0.185);
      addMesh(foot, shoeGeo, aybukeShoesMat, [0, 0.006, 0.03]);
    }
  });

  return root;
}

// Full animation clips for GLB (Idle, Walk, Run, Turn, Interact)
function createAnimationClips() {
  const fps = 30;

  function createQuatTrack(trackName, duration, sampleFn) {
    const times = [];
    const values = [];
    const step = 1 / fps;
    const numFrames = Math.round(duration * fps);
    const euler = new THREE.Euler(0, 0, 0, 'XYZ');
    const quat = new THREE.Quaternion();

    for (let i = 0; i <= numFrames; i++) {
      const t = Math.min(i * step, duration);
      const [rx, ry, rz] = sampleFn(t / duration);
      euler.set(rx, ry, rz);
      quat.setFromEuler(euler);
      times.push(t);
      values.push(quat.x, quat.y, quat.z, quat.w);
    }
    return new THREE.QuaternionKeyframeTrack(trackName, times, values);
  }

  function createPosTrack(trackName, duration, sampleFn) {
    const times = [];
    const values = [];
    const step = 1 / fps;
    const numFrames = Math.round(duration * fps);

    for (let i = 0; i <= numFrames; i++) {
      const t = Math.min(i * step, duration);
      const [x, y, z] = sampleFn(t / duration);
      times.push(t);
      values.push(x, y, z);
    }
    return new THREE.VectorKeyframeTrack(trackName, times, values);
  }

  // 1. IDLE (2.0s)
  const idleDuration = 2.0;
  const idleTracks = [
    createPosTrack('Hips.position', idleDuration, p => [0, 0.60 + Math.sin(p * Math.PI * 2) * 0.012, 0]),
    createQuatTrack('Spine.quaternion', idleDuration, p => [Math.sin(p * Math.PI * 2) * 0.025, 0, 0]),
    createQuatTrack('Chest.quaternion', idleDuration, p => [Math.sin(p * Math.PI * 2) * 0.030, 0, 0]),
    createQuatTrack('Head.quaternion', idleDuration, p => [-Math.sin(p * Math.PI * 2) * 0.018, Math.sin(p * Math.PI * 2) * 0.015, 0]),
    createQuatTrack('LeftArm.quaternion', idleDuration, p => [0, 0, -0.06 - Math.sin(p * Math.PI * 2) * 0.015]),
    createQuatTrack('RightArm.quaternion', idleDuration, p => [0, 0, 0.06 + Math.sin(p * Math.PI * 2) * 0.015]),
    createQuatTrack('LeftForeArm.quaternion', idleDuration, () => [0.15, 0, 0]),
    createQuatTrack('RightForeArm.quaternion', idleDuration, () => [0.15, 0, 0])
  ];
  const idleClip = new THREE.AnimationClip('idle', idleDuration, idleTracks);

  // 2. WALK (1.0s)
  const walkDuration = 1.0;
  const walkTracks = [
    createPosTrack('Hips.position', walkDuration, p => [0, 0.60 + Math.abs(Math.sin(p * Math.PI * 2)) * 0.035, 0]),
    createQuatTrack('Spine.quaternion', walkDuration, p => [0.06, Math.sin(p * Math.PI * 2) * 0.05, 0]),
    createQuatTrack('Head.quaternion', walkDuration, p => [-0.03, -Math.sin(p * Math.PI * 2) * 0.03, 0]),
    createQuatTrack('LeftUpLeg.quaternion', walkDuration, p => [Math.sin(p * Math.PI * 2) * 0.44, 0, 0]),
    createQuatTrack('RightUpLeg.quaternion', walkDuration, p => [-Math.sin(p * Math.PI * 2) * 0.44, 0, 0]),
    createQuatTrack('LeftLeg.quaternion', walkDuration, p => [Math.max(0, -Math.sin(p * Math.PI * 2) * 0.52), 0, 0]),
    createQuatTrack('RightLeg.quaternion', walkDuration, p => [Math.max(0, Math.sin(p * Math.PI * 2) * 0.52), 0, 0]),
    createQuatTrack('LeftArm.quaternion', walkDuration, p => [-Math.sin(p * Math.PI * 2) * 0.4, 0, -0.08]),
    createQuatTrack('RightArm.quaternion', walkDuration, p => [Math.sin(p * Math.PI * 2) * 0.4, 0, 0.08]),
    createQuatTrack('LeftForeArm.quaternion', walkDuration, () => [0.18, 0, 0]),
    createQuatTrack('RightForeArm.quaternion', walkDuration, () => [0.18, 0, 0])
  ];
  const walkClip = new THREE.AnimationClip('walk', walkDuration, walkTracks);

  // 3. RUN (0.65s)
  const runDuration = 0.65;
  const runTracks = [
    createPosTrack('Hips.position', runDuration, p => [0, 0.61 + Math.abs(Math.sin(p * Math.PI * 2)) * 0.065, 0]),
    createQuatTrack('Spine.quaternion', runDuration, p => [0.14, Math.sin(p * Math.PI * 2) * 0.08, 0]),
    createQuatTrack('Head.quaternion', runDuration, p => [-0.06, -Math.sin(p * Math.PI * 2) * 0.04, 0]),
    createQuatTrack('LeftUpLeg.quaternion', runDuration, p => [Math.sin(p * Math.PI * 2) * 0.78, 0, 0]),
    createQuatTrack('RightUpLeg.quaternion', runDuration, p => [-Math.sin(p * Math.PI * 2) * 0.78, 0, 0]),
    createQuatTrack('LeftLeg.quaternion', runDuration, p => [Math.max(0, -Math.sin(p * Math.PI * 2) * 1.05), 0, 0]),
    createQuatTrack('RightLeg.quaternion', runDuration, p => [Math.max(0, Math.sin(p * Math.PI * 2) * 1.05), 0, 0]),
    createQuatTrack('LeftArm.quaternion', runDuration, p => [-Math.sin(p * Math.PI * 2) * 0.72, 0, -0.14]),
    createQuatTrack('RightArm.quaternion', runDuration, p => [Math.sin(p * Math.PI * 2) * 0.72, 0, 0.14]),
    createQuatTrack('LeftForeArm.quaternion', runDuration, () => [0.55, 0, 0]),
    createQuatTrack('RightForeArm.quaternion', runDuration, () => [0.55, 0, 0])
  ];
  const runClip = new THREE.AnimationClip('run', runDuration, runTracks);

  // 4. INTERACT / WAVE (1.5s)
  const interactDuration = 1.5;
  const interactTracks = [
    createPosTrack('Hips.position', interactDuration, () => [0, 0.60, 0]),
    createQuatTrack('Spine.quaternion', interactDuration, p => [0, Math.sin(p * Math.PI * 2) * 0.04, 0]),
    createQuatTrack('Head.quaternion', interactDuration, p => [0.04, 0, 0.04]),
    createQuatTrack('RightArm.quaternion', interactDuration, p => [-1.4, 0, 0.6 + Math.sin(p * Math.PI * 6) * 0.25]),
    createQuatTrack('RightForeArm.quaternion', interactDuration, p => [0.6, 0, Math.sin(p * Math.PI * 6) * 0.35]),
    createQuatTrack('LeftArm.quaternion', interactDuration, () => [0, 0, -0.1]),
    createQuatTrack('LeftForeArm.quaternion', interactDuration, () => [0.2, 0, 0])
  ];
  const interactClip = new THREE.AnimationClip('interact', interactDuration, interactTracks);

  return [idleClip, walkClip, runClip, interactClip];
}

async function exportGLB(type, targetDirs) {
  console.log(`Building 3D Pixar Model for ${type}...`);
  const scene = new THREE.Scene();
  const charMesh = buildCharacterMesh(type);
  scene.add(charMesh);

  const animations = createAnimationClips();

  const exporter = new GLTFExporter();
  const options = {
    binary: true,
    animations: animations,
    embedImages: true
  };

  return new Promise((resolve, reject) => {
    exporter.parse(
      scene,
      gltfBuffer => {
        targetDirs.forEach(dir => {
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          const outPath = path.join(dir, `${type}.glb`);
          fs.writeFileSync(outPath, Buffer.from(gltfBuffer));
          console.log(`Saved: ${outPath} (${gltfBuffer.byteLength} bytes)`);
        });
        resolve();
      },
      error => reject(error),
      options
    );
  });
}

async function run() {
  const rootDir = path.join(__dirname, '..');
  const targetDirs = [
    path.join(rootDir, 'public', 'models'),
    path.join(rootDir, 'public', 'assets', 'models'),
    path.join(rootDir, 'dist', 'models'),
    path.join(rootDir, 'dist', 'assets', 'models')
  ];

  await exportGLB('eren', targetDirs);
  await exportGLB('aybuke', targetDirs);
  console.log('Successfully generated authentic Pixar 3D GLB models for Eren and Aybüke!');
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
