const THREE = require('three');
const fs = require('fs');
const path = require('path');

// Polyfill FileReader for Node.js GLTFExporter
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
 * AUTHENTIC HIGH-FIDELITY 3D CHILDREN CHARACTERS (EREN & AYBÜKE)
 * - True child proportions (11-12 years old, ~1.25m height)
 * - Beautiful organic facial sculpting (zero chipmunk spheres, zero hedgehog spikes, zero flat stickers!)
 * - Aybüke: 100% open face, radiant warm smile with visible clean teeth, traditional crimson velvet headdress,
 *   12 glistening silver akçe coins along hairline, cascading dark curls, cream tunic dress,
 *   crimson embroidered velvet vest, backpack, empty hands!
 * - Eren: Wavy tousled chestnut hair locks, friendly boyish smile, cream shirt,
 *   olive expedition vest with 3D flap pockets, cargo pants, hiking boots, backpack!
 * - Soles grounded strictly at Y = 0.0000
 */

function createMat(name, colorHex = 0xffffff, roughness = 0.65, metalness = 0.05) {
  const mat = new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness: roughness,
    metalness: metalness
  });
  mat.name = name;
  return mat;
}

function buildChildCharacter(type) {
  const root = new THREE.Group();
  root.name = `character_${type}`;

  // Skin & features
  const skinMat = createMat('Mat_Skin', 0xf6d8c4, 0.58, 0.02);
  const blushMat = createMat('Mat_Blush', 0xefa297, 0.65, 0.02);
  const hairMat = createMat('Mat_Hair', type === 'eren' ? 0x4e2e1a : 0x1c120b, 0.75, 0.04);

  // Eyes
  const eyeWhiteMat = createMat('Mat_EyeWhite', 0xfafcff, 0.12, 0.02);
  const eyeIrisMat = createMat('Mat_EyeIris', type === 'eren' ? 0x482a17 : 0x3d2313, 0.18, 0.05);
  const eyeIrisInnerMat = createMat('Mat_EyeIrisInner', type === 'eren' ? 0x8a5229 : 0x784422, 0.22, 0.05);
  const eyePupilMat = createMat('Mat_EyePupil', 0x0c0a0c, 0.08, 0.02);
  const eyeHighlightMat = createMat('Mat_EyeHighlight', 0xffffff, 0.02, 0.98);
  const eyelashMat = createMat('Mat_Eyelash', 0x22130b, 0.70, 0.02);
  const eyebrowMat = createMat('Mat_Eyebrow', type === 'eren' ? 0x3e2515 : 0x28170d, 0.82, 0.02);

  // Mouth & teeth
  const lipMat = createMat('Mat_Lip', type === 'eren' ? 0xc86a60 : 0xd25664, 0.38, 0.02);
  const teethMat = createMat('Mat_Teeth', 0xffffff, 0.15, 0.05);

  // Clothing
  const erenShirtMat = createMat('Mat_ErenShirt', 0xf5efe0, 0.78, 0.02);
  const erenVestMat = createMat('Mat_ErenVest', 0x505a36, 0.68, 0.05);
  const erenVestTrimMat = createMat('Mat_ErenVestTrim', 0x382212, 0.85, 0.05);
  const erenPantsMat = createMat('Mat_ErenPants', 0x422e1e, 0.80, 0.02);
  const bootMat = createMat('Mat_Boots', 0x341f11, 0.75, 0.08);
  const bootSoleMat = createMat('Mat_BootSole', 0x18100a, 0.90, 0.05);
  const buckleMat = createMat('Mat_Buckle', 0xd4af37, 0.25, 0.85);

  const aybukeHeadscarfMat = createMat('Mat_Headscarf', 0x921424, 0.58, 0.06);
  const silverCoinMat = createMat('Mat_SilverCoin', 0xe8eef4, 0.12, 0.96);
  const goldTrimMat = createMat('Mat_GoldTrim', 0xdcb438, 0.28, 0.85);
  const aybukeTunicMat = createMat('Mat_AybukeTunic', 0xf8f3e6, 0.76, 0.02);
  const aybukeVestMat = createMat('Mat_AybukeVest', 0x820e1a, 0.55, 0.08);
  const aybukePantsMat = createMat('Mat_AybukePants', 0xd8c8ac, 0.80, 0.02);
  const aybukeShoesMat = createMat('Mat_AybukeShoes', 0x583720, 0.75, 0.05);

  const backpackMat = createMat('Mat_Backpack', 0x482a18, 0.68, 0.08);
  const backpackStrapMat = createMat('Mat_BackpackStrap', 0x30180a, 0.80, 0.05);

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

  // 1. SKELETAL JOINTS (~1.25m child height, Soles at Y = 0.0000)
  const hips = new THREE.Group(); hips.name = 'Hips'; hips.position.set(0, 0.63, 0); root.add(hips);
  const spine = new THREE.Group(); spine.name = 'Spine'; spine.position.set(0, 0.12, 0); hips.add(spine);
  const chest = new THREE.Group(); chest.name = 'Chest'; chest.position.set(0, 0.16, 0); spine.add(chest);
  const neck = new THREE.Group(); neck.name = 'Neck'; neck.position.set(0, 0.14, 0); chest.add(neck);
  const head = new THREE.Group(); head.name = 'Head'; head.position.set(0, 0.08, 0); neck.add(head);

  // Arms
  const leftShoulder = new THREE.Group(); leftShoulder.name = 'LeftShoulder'; leftShoulder.position.set(0.18, 0.10, 0); chest.add(leftShoulder);
  const leftArm = new THREE.Group(); leftArm.name = 'LeftArm'; leftArm.position.set(0.01, 0, 0); leftShoulder.add(leftArm);
  const leftForeArm = new THREE.Group(); leftForeArm.name = 'LeftForeArm'; leftForeArm.position.set(0, -0.21, 0); leftArm.add(leftForeArm);
  const leftHand = new THREE.Group(); leftHand.name = 'LeftHand'; leftHand.position.set(0, -0.18, 0); leftForeArm.add(leftHand);

  const rightShoulder = new THREE.Group(); rightShoulder.name = 'RightShoulder'; rightShoulder.position.set(-0.18, 0.10, 0); chest.add(rightShoulder);
  const rightArm = new THREE.Group(); rightArm.name = 'RightArm'; rightArm.position.set(-0.01, 0, 0); rightShoulder.add(rightArm);
  const rightForeArm = new THREE.Group(); rightForeArm.name = 'RightForeArm'; rightForeArm.position.set(0, -0.21, 0); rightArm.add(rightForeArm);
  const rightHand = new THREE.Group(); rightHand.name = 'RightHand'; rightHand.position.set(0, -0.18, 0); rightForeArm.add(rightHand);

  // Legs
  const leftUpLeg = new THREE.Group(); leftUpLeg.name = 'LeftUpLeg'; leftUpLeg.position.set(0.09, -0.04, 0); hips.add(leftUpLeg);
  const leftLeg = new THREE.Group(); leftLeg.name = 'LeftLeg'; leftLeg.position.set(0, -0.30, 0); leftUpLeg.add(leftLeg);
  const leftFoot = new THREE.Group(); leftFoot.name = 'LeftFoot'; leftFoot.position.set(0, -0.25, 0); leftLeg.add(leftFoot);

  const rightUpLeg = new THREE.Group(); rightUpLeg.name = 'RightUpLeg'; rightUpLeg.position.set(-0.09, -0.04, 0); hips.add(rightUpLeg);
  const rightLeg = new THREE.Group(); rightLeg.name = 'RightLeg'; rightLeg.position.set(0, -0.30, 0); rightUpLeg.add(rightLeg);
  const rightFoot = new THREE.Group(); rightFoot.name = 'RightFoot'; rightFoot.position.set(0, -0.25, 0); rightLeg.add(rightFoot);

  // 2. TORSO & CLOTHING
  if (type === 'eren') {
    const pelvisGeo = new THREE.CylinderGeometry(0.145, 0.138, 0.18, 24);
    pelvisGeo.scale(1.06, 1.0, 0.86);
    addMesh(hips, pelvisGeo, erenPantsMat, [0, 0.01, 0], [0, 0, 0], [1, 1, 1], 'PantsMesh');

    const abdomenGeo = new THREE.CylinderGeometry(0.140, 0.135, 0.20, 24);
    abdomenGeo.scale(1.05, 1.0, 0.84);
    addMesh(spine, abdomenGeo, erenShirtMat, [0, 0.06, 0]);

    const beltGeo = new THREE.CylinderGeometry(0.148, 0.148, 0.045, 24);
    beltGeo.scale(1.08, 1.0, 0.86);
    addMesh(hips, beltGeo, erenVestTrimMat, [0, 0.08, 0]);
    const buckleGeo = new THREE.BoxGeometry(0.044, 0.038, 0.024);
    addMesh(hips, buckleGeo, buckleMat, [0, 0.08, 0.130]);
  } else {
    // Aybüke: Flowing pleated linen tunic
    const pelvisGeo = new THREE.CylinderGeometry(0.142, 0.138, 0.18, 24);
    pelvisGeo.scale(1.06, 1.0, 0.86);
    addMesh(hips, pelvisGeo, aybukeTunicMat, [0, 0.01, 0], [0, 0, 0], [1, 1, 1], 'TunicPelvisMesh');

    const abdomenGeo = new THREE.CylinderGeometry(0.138, 0.134, 0.20, 24);
    abdomenGeo.scale(1.05, 1.0, 0.84);
    addMesh(spine, abdomenGeo, aybukeTunicMat, [0, 0.06, 0]);

    // Ankle-length flowing pleated tunic
    const skirtGeo = new THREE.CylinderGeometry(0.142, 0.275, 0.44, 32, 6, false);
    const skirtPos = skirtGeo.attributes.position;
    for (let i = 0; i < skirtPos.count; i++) {
      const vx = skirtPos.getX(i);
      const vz = skirtPos.getZ(i);
      const vy = skirtPos.getY(i);
      const angle = Math.atan2(vz, vx);
      const fluting = (0.22 - vy) / 0.44;
      const pleat = Math.sin(angle * 12) * 0.014 * fluting;
      skirtPos.setX(i, vx * (1 + pleat));
      skirtPos.setZ(i, vz * (1 + pleat));
    }
    skirtGeo.computeVertexNormals();
    addMesh(hips, skirtGeo, aybukeTunicMat, [0, -0.12, 0], [0, 0, 0], [1, 1, 1], 'TunicSkirtMesh');

    const skirtHem = new THREE.TorusGeometry(0.276, 0.009, 8, 32);
    skirtHem.rotateX(Math.PI / 2);
    addMesh(hips, skirtHem, goldTrimMat, [0, -0.34, 0]);
  }

  // Inner shirt / tunic chest (sized so outer vests sit comfortably over it!)
  const chestGeo = new THREE.CylinderGeometry(0.142, 0.135, 0.22, 24);
  chestGeo.scale(1.06, 1.0, 0.84);
  addMesh(chest, chestGeo, type === 'eren' ? erenShirtMat : aybukeTunicMat, [0, 0.06, 0]);

  // Open natural child neck
  const neckGeo = new THREE.CylinderGeometry(0.058, 0.068, 0.12, 18);
  addMesh(neck, neckGeo, skinMat, [0, 0.05, 0]);

  // 3. ANATOMICAL 3D HEAD & SCULPTED FACE
  const headGeo = new THREE.SphereGeometry(0.138, 32, 28);
  headGeo.scale(0.92, 1.05, 0.96);
  addMesh(head, headGeo, skinMat, [0, 0.08, 0], [0, 0, 0], [1, 1, 1], 'HeadMesh');

  // Soft subtle natural blush on outer cheekbones (warm soft tone blending naturally with skin)
  [-0.075, 0.075].forEach(cx => {
    const blushGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.002, 16);
    blushGeo.rotateX(Math.PI / 2);
    addMesh(head, blushGeo, blushMat, [cx, 0.068, 0.118]);
  });

  // Soft natural child chin
  const chinGeo = new THREE.SphereGeometry(0.026, 16, 12);
  chinGeo.scale(1.0, 0.72, 0.60);
  addMesh(head, chinGeo, skinMat, [0, 0.018, 0.122]);

  // Lively, Beautiful Stylized 3D Eyes (Refined & Clean)
  [-0.046, 0.046].forEach((ex, i) => {
    // Sclera (White of eye, curved almond shape, flush with head)
    const scleraGeo = new THREE.SphereGeometry(0.020, 18, 16);
    scleraGeo.scale(1.15, 0.94, 0.35);
    addMesh(head, scleraGeo, eyeWhiteMat, [ex, 0.094, 0.128], [0, i === 0 ? 0.05 : -0.05, 0]);

    // Iris (Large radiant warm amber-brown)
    const irisGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.003, 20);
    irisGeo.rotateX(Math.PI / 2);
    addMesh(head, irisGeo, eyeIrisMat, [ex, 0.094, 0.133]);

    // Inner Iris Glow (Golden amber center)
    const innerIrisGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.003, 16);
    innerIrisGeo.rotateX(Math.PI / 2);
    addMesh(head, innerIrisGeo, eyeIrisInnerMat, [ex, 0.094, 0.134]);

    // Pupil
    const pupilGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.003, 16);
    pupilGeo.rotateX(Math.PI / 2);
    addMesh(head, pupilGeo, eyePupilMat, [ex, 0.094, 0.136]);

    // Specular sparkle reflection (upper corner)
    const hlGeo = new THREE.SphereGeometry(0.0028, 8, 8);
    addMesh(head, hlGeo, eyeHighlightMat, [ex + 0.003, 0.098, 0.138]);

    // Eyelid line with soft lashes
    const lidGeo = new THREE.TorusGeometry(0.020, 0.0028, 6, 20, Math.PI * 0.85);
    lidGeo.rotateZ(i === 0 ? -0.10 : 0.10);
    addMesh(head, lidGeo, eyelashMat, [ex, 0.106, 0.128]);
  });

  // Gentle arched eyebrows (warm soft brown, natural thickness)
  [-0.046, 0.046].forEach((bx, i) => {
    const browGeo = new THREE.TorusGeometry(0.024, 0.0028, 6, 18, Math.PI * 0.68);
    browGeo.rotateZ(i === 0 ? -0.16 : 0.16);
    browGeo.rotateX(0.18);
    addMesh(head, browGeo, eyebrowMat, [bx, 0.122, 0.122]);
  });

  // Soft child nose tip
  const noseTipGeo = new THREE.SphereGeometry(0.010, 16, 14);
  noseTipGeo.scale(1.10, 0.90, 0.95);
  addMesh(head, noseTipGeo, skinMat, [0, 0.062, 0.140]);

  // Smiling mouth & lips
  if (type === 'aybuke') {
    // Aybüke: Radiant joyful smile with beautiful teeth curve
    const smileArc = new THREE.TorusGeometry(0.025, 0.0032, 8, 24, Math.PI * 0.82);
    smileArc.rotateZ(Math.PI * 1.09);
    addMesh(head, smileArc, lipMat, [0, 0.040, 0.132]);

    // Full radiant teeth row across the smile
    const teethArc = new THREE.TorusGeometry(0.021, 0.0032, 6, 20, Math.PI * 0.70);
    teethArc.rotateZ(Math.PI * 1.15);
    addMesh(head, teethArc, teethMat, [0, 0.041, 0.133]);

    const btmLipGeo = new THREE.BoxGeometry(0.026, 0.004, 0.008);
    addMesh(head, btmLipGeo, lipMat, [0, 0.033, 0.131]);
  } else {
    // Eren: Friendly confident boyish smile
    const smileArc = new THREE.TorusGeometry(0.023, 0.0032, 8, 20, Math.PI * 0.75);
    smileArc.rotateZ(Math.PI * 1.125);
    addMesh(head, smileArc, lipMat, [0, 0.040, 0.132]);

    const btmLipGeo = new THREE.BoxGeometry(0.022, 0.004, 0.008);
    addMesh(head, btmLipGeo, lipMat, [0, 0.033, 0.131]);
  }

  // Ears
  [-0.13, 0.13].forEach((earX, i) => {
    const earGeo = new THREE.SphereGeometry(0.028, 14, 12);
    earGeo.scale(0.32, 0.85, 0.62);
    addMesh(head, earGeo, skinMat, [earX, 0.08, -0.01], [0, i === 0 ? 0.25 : -0.25, 0]);
  });

  // 4. HAIR & HEADWEAR (AYBÜKE FACE 100% VISIBLE & EREN WAVY HAIR)
  if (type === 'eren') {
    // Eren: Layered tousled wavy chestnut hair (smooth soft volumetric tufts, NO sharp spikes!)
    const hairCapGeo = new THREE.SphereGeometry(0.148, 28, 24);
    hairCapGeo.scale(0.96, 1.04, 1.02);
    addMesh(head, hairCapGeo, hairMat, [0, 0.095, -0.012], [0, 0, 0], [1, 1, 1], 'HairMesh');

    const waves = [
      [0, 0.18, 0.082, 0.045, 0.08, 0.04, 0.15],
      [-0.05, 0.17, 0.075, 0.040, 0.07, 0.04, 0.25],
      [0.05, 0.17, 0.075, 0.040, 0.07, 0.04, -0.15],
      [-0.09, 0.13, 0.055, 0.035, 0.065, 0.035, 0.35],
      [0.09, 0.13, 0.055, 0.035, 0.065, 0.035, -0.30],
      [0, 0.21, 0.005, 0.050, 0.085, 0.05, -0.15],
      [-0.06, 0.20, -0.04, 0.045, 0.08, 0.045, 0.25],
      [0.06, 0.20, -0.04, 0.045, 0.08, 0.045, -0.25],
      [0, 0.16, -0.10, 0.050, 0.08, 0.05, -0.4],
      [-0.06, 0.05, -0.11, 0.038, 0.07, 0.035, -0.3],
      [0.06, 0.05, -0.11, 0.038, 0.07, 0.035, -0.3]
    ];
    waves.forEach(([wx, wy, wz, rx, ry, rz, rotZ]) => {
      const lockGeo = new THREE.SphereGeometry(rx, 14, 12);
      lockGeo.scale(1.0, ry / rx, rz / rx);
      lockGeo.rotateZ(rotZ);
      addMesh(head, lockGeo, hairMat, [wx, wy, wz]);
    });
  } else {
    // Aybüke: Traditional Crimson Velvet Headdress + 12 Silver Akçe Coins + Cascading Curls
    // Cap sits firmly on crown and back — FACE & NECK 100% VISIBLE! NO CHIN COWL!
    const scarfCapGeo = new THREE.SphereGeometry(0.148, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.52);
    scarfCapGeo.scale(0.98, 1.02, 1.02);
    scarfCapGeo.rotateX(-0.28);
    addMesh(head, scarfCapGeo, aybukeHeadscarfMat, [0, 0.096, -0.020], [0, 0, 0], [1, 1, 1], 'HeadscarfMesh');

    // Soft draped velvet down the back of the cranium (NEVER around neck or chin!)
    const backShawlGeo = new THREE.CylinderGeometry(0.144, 0.180, 0.22, 24, 4, true, -Math.PI * 0.40, Math.PI * 0.80);
    backShawlGeo.rotateY(Math.PI);
    addMesh(head, backShawlGeo, aybukeHeadscarfMat, [0, -0.02, -0.05]);

    // Golden diadem band
    const diademBand = new THREE.TorusGeometry(0.140, 0.005, 8, 32, Math.PI * 0.72);
    diademBand.rotateX(0.30);
    diademBand.rotateZ(-Math.PI * 0.36);
    addMesh(head, diademBand, goldTrimMat, [0, 0.155, 0.035]);

    // 12 Shimmering 3D Silver Akçe Coins
    for (let c = 0; c < 12; c++) {
      const frac = (c - 5.5) / 5.5;
      const coinAngle = frac * 0.58;
      const cx = Math.sin(coinAngle) * 0.136;
      const cz = Math.cos(coinAngle) * 0.136 + 0.008;
      const cy = 0.146 - Math.abs(frac) * 0.014;

      const coinGeo = new THREE.CylinderGeometry(0.011, 0.011, 0.003, 14);
      coinGeo.rotateX(Math.PI / 2);
      addMesh(head, coinGeo, silverCoinMat, [cx, cy, cz], [0, -coinAngle * 0.5, 0], [1, 1, 1], `SilverCoin_${c}`);
    }

    // Cascading dark curly hair locks framing temples in front of ears
    [-0.11, 0.11].forEach((curlX, i) => {
      const curlGeo = new THREE.TorusGeometry(0.026, 0.007, 6, 16, Math.PI * 1.5);
      curlGeo.rotateY(i === 0 ? 0.3 : -0.3);
      addMesh(head, curlGeo, hairMat, [curlX, 0.05, 0.06]);

      const curlGeo2 = new THREE.TorusGeometry(0.030, 0.007, 6, 16, Math.PI * 1.6);
      curlGeo2.rotateY(i === 0 ? 0.4 : -0.4);
      addMesh(head, curlGeo2, hairMat, [curlX * 0.95, -0.01, 0.05]);
    });
  }

  // 5. 3D VESTS (PROPERLY OVERLAYS CHEST — 100% VISIBLE FROM FRONT, SIDES & BACK)
  if (type === 'eren') {
    // Eren Olive Utility Vest: Curved panels wrapping around chest
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
    // Aybüke Crimson Velvet Embroidered Vest: Outer shell wrapping around chest with open front
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
  }

  // 6. PROMINENT 3D LEATHER BACKPACK
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

  const bedrollGeo = new THREE.CylinderGeometry(0.048, 0.048, 0.26, 16);
  bedrollGeo.rotateZ(Math.PI / 2);
  addMesh(backpackGroup, bedrollGeo, createMat('Mat_Bedroll', 0x5a4835, 0.8), [0, -0.16, -0.01]);

  [-0.10, 0.10].forEach(sx => {
    const sGeo = new THREE.BoxGeometry(0.038, 0.28, 0.020);
    addMesh(chest, sGeo, backpackStrapMat, [sx, 0.06, 0.105], [0.18, 0, 0]);
  });

  chest.add(backpackGroup);

  // 7. ARMS & HANDS (EMPTY HANDS - NO ITEMS IN HAND!)
  [leftShoulder, rightShoulder].forEach(sh => {
    const deltoidGeo = new THREE.SphereGeometry(0.064, 16, 14);
    addMesh(sh, deltoidGeo, type === 'eren' ? erenShirtMat : aybukeTunicMat, [0, 0, 0]);
  });

  [leftArm, rightArm].forEach(arm => {
    const armGeo = new THREE.CylinderGeometry(0.054, 0.048, 0.21, 16);
    addMesh(arm, armGeo, type === 'eren' ? erenShirtMat : aybukeTunicMat, [0, -0.105, 0]);
    const elbowGeo = new THREE.SphereGeometry(0.048, 14, 12);
    addMesh(arm, elbowGeo, type === 'eren' ? erenShirtMat : aybukeTunicMat, [0, -0.21, 0]);
  });

  [leftForeArm, rightForeArm].forEach(farm => {
    const farmGeo = new THREE.CylinderGeometry(0.047, 0.040, 0.18, 16);
    addMesh(farm, farmGeo, type === 'eren' ? erenShirtMat : aybukeTunicMat, [0, -0.09, 0]);
    const wristGeo = new THREE.SphereGeometry(0.038, 12, 10);
    addMesh(farm, wristGeo, skinMat, [0, -0.18, 0]);
  });

  // Empty hands, naturally resting
  [leftHand, rightHand].forEach((hand, i) => {
    const palmGeo = new THREE.BoxGeometry(0.042, 0.065, 0.024);
    addMesh(hand, palmGeo, skinMat, [0, -0.032, 0]);

    const thumbGeo = new THREE.BoxGeometry(0.016, 0.032, 0.016);
    thumbGeo.rotateZ(i === 0 ? 0.35 : -0.35);
    addMesh(hand, thumbGeo, skinMat, [i === 0 ? -0.022 : 0.022, -0.020, 0.008]);

    const fingersGeo = new THREE.BoxGeometry(0.038, 0.036, 0.020);
    addMesh(hand, fingersGeo, skinMat, [0, -0.075, 0]);
  });

  // 8. LEGS & FOOTWEAR (PLANTED AT Y = 0.0000)
  [leftUpLeg, rightUpLeg].forEach(uleg => {
    const hipGeo = new THREE.SphereGeometry(0.068, 16, 14);
    addMesh(uleg, hipGeo, type === 'eren' ? erenPantsMat : aybukePantsMat, [0, 0, 0]);

    const thighGeo = new THREE.CylinderGeometry(0.066, 0.055, 0.30, 16);
    addMesh(uleg, thighGeo, type === 'eren' ? erenPantsMat : aybukePantsMat, [0, -0.15, 0]);

    if (type === 'eren') {
      const pocketGeo = new THREE.BoxGeometry(0.022, 0.08, 0.09);
      const isLeft = uleg === leftUpLeg;
      addMesh(uleg, pocketGeo, erenPantsMat, [isLeft ? 0.068 : -0.068, -0.14, 0]);
      const pFlap = new THREE.BoxGeometry(0.024, 0.025, 0.094);
      addMesh(uleg, pFlap, erenVestTrimMat, [isLeft ? 0.069 : -0.069, -0.09, 0]);
    }
  });

  [leftLeg, rightLeg].forEach(leg => {
    const kneeGeo = new THREE.SphereGeometry(0.055, 14, 12);
    addMesh(leg, kneeGeo, type === 'eren' ? erenPantsMat : aybukePantsMat, [0, 0, 0]);

    const shinGeo = new THREE.CylinderGeometry(0.054, 0.046, 0.26, 16);
    addMesh(leg, shinGeo, type === 'eren' ? erenPantsMat : aybukePantsMat, [0, -0.13, 0]);

    const ankleSphere = new THREE.SphereGeometry(0.038, 12, 10);
    addMesh(leg, ankleSphere, type === 'eren' ? bootMat : aybukeShoesMat, [0, -0.25, 0]);
  });

  // Soles touch ground at Y = 0.0000
  [leftFoot, rightFoot].forEach(foot => {
    if (type === 'eren') {
      const soleGeo = new THREE.BoxGeometry(0.095, 0.020, 0.22);
      addMesh(foot, soleGeo, bootSoleMat, [0, -0.030, 0.035], [0, 0, 0], [1, 1, 1], 'SoleMesh');

      const bootGeo = new THREE.BoxGeometry(0.090, 0.065, 0.20);
      addMesh(foot, bootGeo, bootMat, [0, 0.010, 0.030]);

      const toeGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.090, 16);
      toeGeo.rotateZ(Math.PI / 2);
      addMesh(foot, toeGeo, bootMat, [0, 0.005, 0.125]);
    } else {
      const soleGeo = new THREE.BoxGeometry(0.088, 0.016, 0.20);
      addMesh(foot, soleGeo, bootSoleMat, [0, -0.032, 0.030], [0, 0, 0], [1, 1, 1], 'SoleMesh');

      const shoeGeo = new THREE.BoxGeometry(0.084, 0.055, 0.18);
      addMesh(foot, shoeGeo, aybukeShoesMat, [0, 0.005, 0.025]);

      const shoeToe = new THREE.CylinderGeometry(0.042, 0.042, 0.084, 16);
      shoeToe.rotateZ(Math.PI / 2);
      addMesh(foot, shoeToe, aybukeShoesMat, [0, 0.002, 0.110]);
    }
  });

  return root;
}

// Animation Clips
function createAnimationClips() {
  const fps = 30;

  function createQuatTrack(trackName, duration, sampleFn) {
    const times = [];
    const values = [];
    const step = 1 / fps;
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();

    for (let t = 0; t <= duration + 0.0001; t += step) {
      times.push(Math.round(t * 1000) / 1000);
      const [rx, ry, rz] = sampleFn(t / duration);
      e.set(rx, ry, rz);
      q.setFromEuler(e);
      values.push(q.x, q.y, q.z, q.w);
    }
    return new THREE.QuaternionKeyframeTrack(trackName, times, values);
  }

  function createPosTrack(trackName, duration, sampleFn) {
    const times = [];
    const values = [];
    const step = 1 / fps;

    for (let t = 0; t <= duration + 0.0001; t += step) {
      times.push(Math.round(t * 1000) / 1000);
      const [x, y, z] = sampleFn(t / duration);
      values.push(x, y, z);
    }
    return new THREE.VectorKeyframeTrack(trackName, times, values);
  }

  const idleDuration = 2.0;
  const idleTracks = [
    createPosTrack('Hips.position', idleDuration, p => [0, 0.63 + Math.sin(p * Math.PI * 2) * 0.006, 0]),
    createQuatTrack('Spine.quaternion', idleDuration, p => [Math.sin(p * Math.PI * 2) * 0.02, 0, 0]),
    createQuatTrack('Head.quaternion', idleDuration, p => [0, Math.sin(p * Math.PI * 2) * 0.025, 0]),
    createQuatTrack('LeftArm.quaternion', idleDuration, p => [Math.sin(p * Math.PI * 2) * 0.02, 0, -0.06]),
    createQuatTrack('RightArm.quaternion', idleDuration, p => [-Math.sin(p * Math.PI * 2) * 0.02, 0, 0.06]),
    createQuatTrack('LeftForeArm.quaternion', idleDuration, () => [0.12, 0, 0]),
    createQuatTrack('RightForeArm.quaternion', idleDuration, () => [0.12, 0, 0]),
    createQuatTrack('LeftUpLeg.quaternion', idleDuration, () => [0, 0, 0]),
    createQuatTrack('RightUpLeg.quaternion', idleDuration, () => [0, 0, 0]),
    createQuatTrack('LeftLeg.quaternion', idleDuration, () => [0, 0, 0]),
    createQuatTrack('RightLeg.quaternion', idleDuration, () => [0, 0, 0])
  ];
  const idleClip = new THREE.AnimationClip('idle', idleDuration, idleTracks);

  const walkDuration = 1.0;
  const walkTracks = [
    createPosTrack('Hips.position', walkDuration, p => [0, 0.63 + Math.abs(Math.sin(p * Math.PI * 2)) * 0.035, 0]),
    createQuatTrack('Spine.quaternion', walkDuration, p => [0.03, Math.sin(p * Math.PI * 2) * 0.06, 0]),
    createQuatTrack('Head.quaternion', walkDuration, p => [0, -Math.sin(p * Math.PI * 2) * 0.04, 0]),
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

  const runDuration = 0.65;
  const runTracks = [
    createPosTrack('Hips.position', runDuration, p => [0, 0.63 + Math.abs(Math.sin(p * Math.PI * 2)) * 0.065, 0]),
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

  return [idleClip, walkClip, runClip];
}

async function exportCharacter(type) {
  const model = buildChildCharacter(type);
  const clips = createAnimationClips();

  const exporter = new GLTFExporter();
  const options = {
    binary: true,
    animations: clips
  };

  return new Promise((resolve, reject) => {
    exporter.parse(
      model,
      glbBuffer => {
        const outDir = path.join(__dirname, '..', 'public', 'assets', 'models');
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        const filePath = path.join(outDir, `${type}.glb`);
        fs.writeFileSync(filePath, Buffer.from(glbBuffer));
        console.log(`Successfully generated ${type}.glb (${glbBuffer.byteLength} bytes)`);
        resolve(filePath);
      },
      error => reject(error),
      options
    );
  });
}

async function main() {
  console.log('Generating authentic 3D models for Eren & Aybüke...');
  await exportCharacter('eren');
  await exportCharacter('aybuke');
  console.log('GLB generation completed successfully!');
}

main().catch(console.error);
