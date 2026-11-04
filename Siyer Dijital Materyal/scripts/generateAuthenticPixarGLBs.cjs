const THREE = require('three');
const fs = require('fs');
const path = require('path');

class MockCanvas {
  constructor(w = 512, h = 512) {
    this.width = w;
    this.height = h;
  }
  getContext() {
    return {
      translate: () => {},
      scale: () => {},
      drawImage: () => {},
      getImageData: () => ({ data: new Uint8Array(this.width * this.height * 4) })
    };
  }
  toDataURL() {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  }
}

global.HTMLCanvasElement = MockCanvas;
global.document = {
  createElement: (type) => {
    if (type === 'canvas') return new MockCanvas();
  }
};

global.FileReader = class FileReader {
  readAsArrayBuffer(blob) {
    if (blob && blob.arrayBuffer) {
      blob.arrayBuffer().then(ab => {
        this.result = ab;
        if (this.onloadend) this.onloadend();
      });
    } else {
      this.result = new ArrayBuffer(0);
      if (this.onloadend) this.onloadend();
    }
  }
  readAsDataURL(blob) {
    if (blob && blob.arrayBuffer) {
      blob.arrayBuffer().then(ab => {
        const b = Buffer.from(ab);
        this.result = 'data:image/png;base64,' + b.toString('base64');
        if (this.onloadend) this.onloadend();
      });
    } else {
      this.result = 'data:image/png;base64,';
      if (this.onloadend) this.onloadend();
    }
  }
};

const { GLTFExporter } = require('three/examples/jsm/exporters/GLTFExporter.js');

function createMat(name, colorHex, roughness = 0.55, metalness = 0.02) {
  const mat = new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness: roughness,
    metalness: metalness
  });
  mat.name = name;
  return mat;
}

/**
 * Creates smooth head geometry with front-projected UVs
 */
function createProjectedHeadGeometry(radius = 0.175, widthSegments = 32, heightSegments = 24) {
  const geo = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  const pos = geo.attributes.position;
  const uvs = geo.attributes.uv;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    if (z > -0.01) {
      const u = 0.5 + (x / (radius * 1.62));
      const v = 0.5 + (y / (radius * 1.62));
      uvs.setXY(i, Math.max(0, Math.min(1, u)), Math.max(0, Math.min(1, v)));
    } else {
      uvs.setXY(i, 0.05, 0.95);
    }
  }
  uvs.needsUpdate = true;
  return geo;
}

function createProjectedVestGeometry(width = 0.31, height = 0.29, depth = 0.22) {
  const geo = new THREE.BoxGeometry(width, height, depth, 4, 4, 4);
  const pos = geo.attributes.position;
  const uvs = geo.attributes.uv;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    if (z > depth / 2 - 0.02) {
      const u = 0.5 + (x / width);
      const v = 0.5 + (y / height);
      uvs.setXY(i, Math.max(0, Math.min(1, u)), Math.max(0, Math.min(1, v)));
    } else {
      uvs.setXY(i, 0.05, 0.95);
    }
  }
  uvs.needsUpdate = true;
  return geo;
}

function buildModel(type) {
  const root = new THREE.Group();
  root.name = `character_${type}`;

  // Base materials matching official reference colors
  const skinColor = type === 'eren' ? 0xf5cbb0 : 0xfae0ce;
  const skinMat = createMat('Mat_Skin', skinColor, 0.50, 0.02);
  const hairColor = type === 'eren' ? 0x6e381b : 0x24140b;
  const hairMat = createMat('Mat_Hair', hairColor, 0.65, 0.04);

  // Clothing materials
  const erenShirtMat = createMat('Mat_ErenShirt', 0xf0e5cb, 0.72, 0.02);
  const erenVestMat = createMat('Mat_ErenVest', 0x63683a, 0.65, 0.04);
  const erenPantsMat = createMat('Mat_ErenPants', 0x583520, 0.75, 0.02);
  const bootMat = createMat('Mat_Boots', 0x7c3e1b, 0.70, 0.06);
  const bootSoleMat = createMat('Mat_BootSole', 0x1e1109, 0.88, 0.04);
  const beltMat = createMat('Mat_Belt', 0x482815, 0.65, 0.08);
  const buckleMat = createMat('Mat_Buckle', 0xdfb430, 0.22, 0.85);

  const aybukeHeadscarfMat = createMat('Mat_Headscarf', 0xd02026, 0.52, 0.05);
  const goldCoinMat = createMat('Mat_GoldCoin', 0xdfb430, 0.18, 0.90);
  const goldTrimMat = createMat('Mat_GoldTrim', 0xe2ba38, 0.22, 0.85);
  const aybukeTunicMat = createMat('Mat_AybukeTunic', 0xf3e8cc, 0.74, 0.02);
  const aybukeVestMat = createMat('Mat_AybukeVest', 0xba1622, 0.52, 0.06);
  const aybukePantsMat = createMat('Mat_AybukePants', 0xd2ba92, 0.80, 0.02);
  const aybukeShoesMat = createMat('Mat_AybukeShoes', 0xa66e42, 0.72, 0.04);

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
  const leftShoulder = new THREE.Group(); leftShoulder.name = 'LeftShoulder'; leftShoulder.position.set(0.18, 0.10, 0); chest.add(leftShoulder);
  const rightShoulder = new THREE.Group(); rightShoulder.name = 'RightShoulder'; rightShoulder.position.set(-0.18, 0.10, 0); chest.add(rightShoulder);
  const leftArm = new THREE.Group(); leftArm.name = 'LeftArm'; leftShoulder.add(leftArm);
  const rightArm = new THREE.Group(); rightArm.name = 'RightArm'; rightShoulder.add(rightArm);
  const leftForeArm = new THREE.Group(); leftForeArm.name = 'LeftForeArm'; leftForeArm.position.set(0, -0.20, 0); leftArm.add(leftForeArm);
  const rightForeArm = new THREE.Group(); rightForeArm.name = 'RightForeArm'; rightForeArm.position.set(0, -0.20, 0); rightArm.add(rightForeArm);
  const leftHand = new THREE.Group(); leftHand.name = 'LeftHand'; leftHand.position.set(0, -0.19, 0); leftForeArm.add(leftHand);
  const rightHand = new THREE.Group(); rightHand.name = 'RightHand'; rightHand.position.set(0, -0.19, 0); rightForeArm.add(rightHand);

  // Legs
  const leftUpLeg = new THREE.Group(); leftUpLeg.name = 'LeftUpLeg'; leftUpLeg.position.set(0.095, -0.04, 0); hips.add(leftUpLeg);
  const rightUpLeg = new THREE.Group(); rightUpLeg.name = 'RightUpLeg'; rightUpLeg.position.set(-0.095, -0.04, 0); hips.add(rightUpLeg);
  const leftLeg = new THREE.Group(); leftLeg.name = 'LeftLeg'; leftLeg.position.set(0, -0.26, 0); leftUpLeg.add(leftLeg);
  const rightLeg = new THREE.Group(); rightLeg.name = 'RightLeg'; rightLeg.position.set(0, -0.26, 0); rightUpLeg.add(rightLeg);
  const leftFoot = new THREE.Group(); leftFoot.name = 'LeftFoot'; leftFoot.position.set(0, -0.25, 0); leftLeg.add(leftFoot);
  const rightFoot = new THREE.Group(); rightFoot.name = 'RightFoot'; rightFoot.position.set(0, -0.25, 0); rightLeg.add(rightFoot);

  // --- 1. HEAD & FACE ---
  const neckGeo = new THREE.CylinderGeometry(0.052, 0.064, 0.12, 16);
  addMesh(neck, neckGeo, skinMat, [0, 0.05, 0]);

  const headGeo = createProjectedHeadGeometry(0.18, 32, 24);
  const headMesh = addMesh(head, headGeo, skinMat, [0, 0.06, 0.02], [0, 0, 0], [1, 1, 1], 'HeadMesh');

  // Cute 3D Ears
  [-0.18, 0.18].forEach(xPos => {
    const earGeo = new THREE.SphereGeometry(0.045, 12, 10);
    earGeo.scale(0.4, 0.8, 0.7);
    addMesh(head, earGeo, skinMat, [xPos, 0.06, -0.01], [0, xPos > 0 ? 0.35 : -0.35, 0]);
  });

  if (type === 'eren') {
    // EREN'S HAIR
    const hairCapGeo = new THREE.SphereGeometry(0.195, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.65);
    addMesh(head, hairCapGeo, hairMat, [0, 0.09, -0.01]);

    // Sweeping bangs fringe across forehead
    const bang1Geo = new THREE.SphereGeometry(0.09, 14, 12);
    bang1Geo.scale(1.2, 0.5, 0.7);
    addMesh(head, bang1Geo, hairMat, [-0.04, 0.18, 0.14], [0.2, 0.3, -0.25]);

    const bang2Geo = new THREE.SphereGeometry(0.08, 14, 12);
    bang2Geo.scale(1.1, 0.5, 0.6);
    addMesh(head, bang2Geo, hairMat, [0.08, 0.19, 0.13], [0.15, -0.25, 0.2]);

    // Top crest lock (cowlick)
    const cowlickGeo = new THREE.ConeGeometry(0.035, 0.11, 8);
    cowlickGeo.rotateZ(-0.35);
    cowlickGeo.rotateX(-0.2);
    addMesh(head, cowlickGeo, hairMat, [-0.02, 0.26, 0.02]);

    // Sideburns
    [-0.17, 0.17].forEach(x => {
      const sbGeo = new THREE.ConeGeometry(0.03, 0.08, 6);
      sbGeo.rotateZ(x > 0 ? -0.2 : 0.2);
      addMesh(head, sbGeo, hairMat, [x, 0.08, 0.05]);
    });
  } else {
    // AYBÜKE'S TRADITIONAL SCARLET HEADDRESS & JEWELRY
    const scarfGeo = new THREE.SphereGeometry(0.205, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.75);
    addMesh(head, scarfGeo, aybukeHeadscarfMat, [0, 0.10, -0.02]);

    // Cascading veil drape down back and shoulders
    const drapeGeo = new THREE.CylinderGeometry(0.18, 0.28, 0.40, 20, 1, true, Math.PI * 0.75, Math.PI * 1.5);
    addMesh(head, drapeGeo, aybukeHeadscarfMat, [0, -0.08, -0.06], [0.12, 0, 0]);

    // Golden forehead medallion band
    const bandGeo = new THREE.TorusGeometry(0.185, 0.016, 12, 28, Math.PI * 0.85);
    addMesh(head, bandGeo, goldTrimMat, [0, 0.15, 0.06], [1.2, 0, 0]);

    // 5 Large central gold medallions along the band
    for (let i = 0; i < 5; i++) {
      const angle = (i - 2) * 0.26;
      const x = Math.sin(angle) * 0.19;
      const z = Math.cos(angle) * 0.19;
      const medGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.008, 16);
      addMesh(head, medGeo, goldCoinMat, [x, 0.17, z - 0.02], [1.4, 0, -angle]);
    }

    // 12 Dangling gold coins hanging along the forehead
    for (let i = 0; i < 12; i++) {
      const angle = (i - 5.5) * 0.12;
      const x = Math.sin(angle) * 0.185;
      const z = Math.cos(angle) * 0.185;
      const coinGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.004, 12);
      addMesh(head, coinGeo, goldCoinMat, [x, 0.13, z - 0.01], [0, 0, 0]);
    }

    // Cascading dark wavy curls at temples
    [-0.15, 0.15].forEach(x => {
      const curlGeo = new THREE.CylinderGeometry(0.028, 0.038, 0.18, 10);
      addMesh(head, curlGeo, hairMat, [x, 0.02, 0.08], [0.1, 0, x > 0 ? -0.15 : 0.15]);
    });
  }

  // --- 2. TORSO & CLOTHING ---
  const torsoGeo = new THREE.CylinderGeometry(0.14, 0.12, 0.28, 16);
  addMesh(chest, torsoGeo, type === 'eren' ? erenShirtMat : aybukeTunicMat, [0, 0, 0]);

  const vestGeo = createProjectedVestGeometry(0.31, 0.29, 0.22);
  addMesh(chest, vestGeo, type === 'eren' ? erenVestMat : aybukeVestMat, [0, -0.01, 0], [0, 0, 0], [1, 1, 1], 'VestMesh');

  if (type === 'eren') {
    const beltGeo = new THREE.CylinderGeometry(0.125, 0.125, 0.035, 16);
    addMesh(spine, beltGeo, beltMat, [0, -0.02, 0]);

    const buckleGeo = new THREE.BoxGeometry(0.05, 0.04, 0.015);
    addMesh(spine, buckleGeo, buckleMat, [0, -0.02, 0.13]);

    const colLeft = new THREE.BoxGeometry(0.06, 0.08, 0.015);
    colLeft.rotateZ(0.4);
    addMesh(chest, colLeft, erenShirtMat, [0.06, 0.11, 0.11]);

    const colRight = new THREE.BoxGeometry(0.06, 0.08, 0.015);
    colRight.rotateZ(-0.4);
    addMesh(chest, colRight, erenShirtMat, [-0.06, 0.11, 0.11]);
  } else {
    const dressGeo = new THREE.CylinderGeometry(0.125, 0.22, 0.36, 20, 1, false);
    addMesh(spine, dressGeo, aybukeTunicMat, [0, -0.12, 0]);

    const hemGeo = new THREE.TorusGeometry(0.22, 0.012, 10, 24);
    addMesh(spine, hemGeo, goldTrimMat, [0, -0.30, 0], [Math.PI / 2, 0, 0]);

    const sashGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.035, 16);
    addMesh(spine, sashGeo, createMat('Mat_Sash', 0x86101c, 0.6), [0, 0.02, 0]);
  }

  // --- 3. 3D BACKPACK ---
  const bpGeo = new THREE.BoxGeometry(0.22, 0.26, 0.13);
  addMesh(chest, bpGeo, backpackMat, [0, 0.02, -0.16]);

  const bpFlap = new THREE.BoxGeometry(0.23, 0.08, 0.14);
  addMesh(chest, bpFlap, backpackMat, [0, 0.12, -0.16]);

  [-0.09, 0.09].forEach(x => {
    const strapGeo = new THREE.BoxGeometry(0.035, 0.24, 0.22);
    strapGeo.rotateX(0.1);
    addMesh(chest, strapGeo, backpackStrapMat, [x, 0.03, -0.01]);
  });

  // --- 4. ARMS & HANDS ---
  [leftArm, rightArm].forEach((arm, i) => {
    const uarmGeo = new THREE.CylinderGeometry(0.048, 0.044, 0.20, 14);
    addMesh(arm, uarmGeo, type === 'eren' ? erenShirtMat : aybukeTunicMat, [0, -0.08, 0]);
  });

  [leftForeArm, rightForeArm].forEach((farm, i) => {
    const farmGeo = new THREE.CylinderGeometry(0.044, 0.038, 0.18, 14);
    addMesh(farm, farmGeo, type === 'eren' ? erenShirtMat : aybukeTunicMat, [0, -0.08, 0]);

    const wristGeo = new THREE.SphereGeometry(0.034, 10, 8);
    addMesh(farm, wristGeo, skinMat, [0, -0.17, 0]);
  });

  [leftHand, rightHand].forEach((hand, i) => {
    const handGeo = new THREE.BoxGeometry(0.042, 0.065, 0.024);
    addMesh(hand, handGeo, skinMat, [0, -0.035, 0]);

    const thumbGeo = new THREE.BoxGeometry(0.016, 0.030, 0.016);
    thumbGeo.rotateZ(i === 0 ? 0.35 : -0.35);
    addMesh(hand, thumbGeo, skinMat, [i === 0 ? -0.02 : 0.02, -0.025, 0.008]);
  });

  // --- 5. LEGS & SOLES AT Y = 0.0000 ---
  [leftUpLeg, rightUpLeg].forEach(uleg => {
    const thighGeo = new THREE.CylinderGeometry(0.062, 0.052, 0.28, 14);
    addMesh(uleg, thighGeo, type === 'eren' ? erenPantsMat : aybukePantsMat, [0, -0.13, 0]);

    if (type === 'eren') {
      const pocketGeo = new THREE.BoxGeometry(0.025, 0.08, 0.09);
      const isLeft = uleg === leftUpLeg;
      addMesh(uleg, pocketGeo, erenPantsMat, [isLeft ? 0.065 : -0.065, -0.13, 0]);
    }
  });

  [leftLeg, rightLeg].forEach(leg => {
    const shinGeo = new THREE.CylinderGeometry(0.052, 0.044, 0.25, 14);
    addMesh(leg, shinGeo, type === 'eren' ? erenPantsMat : aybukePantsMat, [0, -0.12, 0]);
  });

  [leftFoot, rightFoot].forEach(foot => {
    if (type === 'eren') {
      const soleGeo = new THREE.BoxGeometry(0.095, 0.022, 0.21);
      addMesh(foot, soleGeo, bootSoleMat, [0, -0.030, 0.035], [0, 0, 0], [1, 1, 1], 'SoleMesh');

      const bootGeo = new THREE.BoxGeometry(0.088, 0.065, 0.19);
      addMesh(foot, bootGeo, bootMat, [0, 0.008, 0.035]);

      const lacesGeo = new THREE.BoxGeometry(0.045, 0.015, 0.09);
      addMesh(foot, lacesGeo, createMat('Mat_Laces', 0x24140b, 0.8), [0, 0.038, 0.045]);
    } else {
      const soleGeo = new THREE.BoxGeometry(0.085, 0.020, 0.19);
      addMesh(foot, soleGeo, bootSoleMat, [0, -0.030, 0.03], [0, 0, 0], [1, 1, 1], 'SoleMesh');

      const shoeGeo = new THREE.BoxGeometry(0.080, 0.058, 0.175);
      addMesh(foot, shoeGeo, aybukeShoesMat, [0, 0.006, 0.03]);
    }
  });

  return root;
}

function createClips() {
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

  // 1. IDLE (2.0s)
  const idleSpine = createQuatTrack('Spine.quaternion', 2.0, p => [Math.sin(p * Math.PI * 2) * 0.025, 0, 0]);
  const idleChest = createQuatTrack('Chest.quaternion', 2.0, p => [Math.sin(p * Math.PI * 2) * 0.015, 0, 0]);
  const idleHead = createQuatTrack('Head.quaternion', 2.0, p => [Math.sin(p * Math.PI * 2 + 0.4) * 0.03, Math.sin(p * Math.PI * 2) * 0.03, 0]);
  const idleLeftArm = createQuatTrack('LeftArm.quaternion', 2.0, p => [0.08 + Math.sin(p * Math.PI * 2) * 0.02, 0, 0.08]);
  const idleRightArm = createQuatTrack('RightArm.quaternion', 2.0, p => [0.08 + Math.sin(p * Math.PI * 2) * 0.02, 0, -0.08]);
  const idleHipsPos = createPosTrack('Hips.position', 2.0, p => [0, 0.60 + Math.sin(p * Math.PI * 2) * 0.004, 0]);
  const idleClip = new THREE.AnimationClip('idle', 2.0, [idleSpine, idleChest, idleHead, idleLeftArm, idleRightArm, idleHipsPos]);

  // 2. WALK (1.0s)
  const walkLeftUpLeg = createQuatTrack('LeftUpLeg.quaternion', 1.0, p => [Math.sin(p * Math.PI * 2) * 0.50, 0, 0]);
  const walkRightUpLeg = createQuatTrack('RightUpLeg.quaternion', 1.0, p => [-Math.sin(p * Math.PI * 2) * 0.50, 0, 0]);
  const walkLeftLeg = createQuatTrack('LeftLeg.quaternion', 1.0, p => [Math.max(0, -Math.sin(p * Math.PI * 2)) * 0.55, 0, 0]);
  const walkRightLeg = createQuatTrack('RightLeg.quaternion', 1.0, p => [Math.max(0, Math.sin(p * Math.PI * 2)) * 0.55, 0, 0]);
  const walkLeftArm = createQuatTrack('LeftArm.quaternion', 1.0, p => [-Math.sin(p * Math.PI * 2) * 0.40, 0, 0.08]);
  const walkRightArm = createQuatTrack('RightArm.quaternion', 1.0, p => [Math.sin(p * Math.PI * 2) * 0.40, 0, -0.08]);
  const walkHipsPos = createPosTrack('Hips.position', 1.0, p => [0, 0.60 + Math.abs(Math.sin(p * Math.PI * 2)) * 0.025, 0]);
  const walkClip = new THREE.AnimationClip('walk', 1.0, [walkLeftUpLeg, walkRightUpLeg, walkLeftLeg, walkRightLeg, walkLeftArm, walkRightArm, walkHipsPos]);

  // 3. RUN (0.65s)
  const runLeftUpLeg = createQuatTrack('LeftUpLeg.quaternion', 0.65, p => [Math.sin(p * Math.PI * 2) * 0.85, 0, 0]);
  const runRightUpLeg = createQuatTrack('RightUpLeg.quaternion', 0.65, p => [-Math.sin(p * Math.PI * 2) * 0.85, 0, 0]);
  const runLeftLeg = createQuatTrack('LeftLeg.quaternion', 0.65, p => [Math.max(0, -Math.sin(p * Math.PI * 2)) * 0.95, 0, 0]);
  const runRightLeg = createQuatTrack('RightLeg.quaternion', 0.65, p => [Math.max(0, Math.sin(p * Math.PI * 2)) * 0.95, 0, 0]);
  const runLeftArm = createQuatTrack('LeftArm.quaternion', 0.65, p => [-Math.sin(p * Math.PI * 2) * 0.80, 0, 0.12]);
  const runRightArm = createQuatTrack('RightArm.quaternion', 0.65, p => [Math.sin(p * Math.PI * 2) * 0.80, 0, -0.12]);
  const runSpine = createQuatTrack('Spine.quaternion', 0.65, () => [0.15, 0, 0]);
  const runHipsPos = createPosTrack('Hips.position', 0.65, p => [0, 0.60 + Math.abs(Math.sin(p * Math.PI * 2)) * 0.045, 0]);
  const runClip = new THREE.AnimationClip('run', 0.65, [runLeftUpLeg, runRightUpLeg, runLeftLeg, runRightLeg, runLeftArm, runRightArm, runSpine, runHipsPos]);

  // 4. WAVE (1.5s)
  const waveRightArm = createQuatTrack('RightArm.quaternion', 1.5, p => [-1.8 + Math.sin(p * Math.PI * 6) * 0.25, 0, -0.5]);
  const waveRightForeArm = createQuatTrack('RightForeArm.quaternion', 1.5, p => [0, 0, Math.sin(p * Math.PI * 8) * 0.4]);
  const waveHead = createQuatTrack('Head.quaternion', 1.5, p => [0, -0.15, 0.08]);
  const waveClip = new THREE.AnimationClip('wave', 1.5, [waveRightArm, waveRightForeArm, waveHead]);

  return [idleClip, walkClip, runClip, waveClip];
}

async function exportGLB(type) {
  const model = buildModel(type);
  const clips = createClips();

  const exporter = new GLTFExporter();
  return new Promise((resolve, reject) => {
    exporter.parse(
      model,
      gltf => {
        const outPublic = path.join(__dirname, '..', 'public', 'models', `${type}.glb`);
        const outPublicAssets = path.join(__dirname, '..', 'public', 'assets', 'models', `${type}.glb`);
        const outDist = path.join(__dirname, '..', 'dist', 'models', `${type}.glb`);
        const outDistAssets = path.join(__dirname, '..', 'dist', 'assets', 'models', `${type}.glb`);

        const buf = Buffer.from(gltf);
        [outPublic, outPublicAssets, outDist, outDistAssets].forEach(p => {
          const dir = path.dirname(p);
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(p, buf);
        });

        console.log(`Exported ${type}.glb (${buf.length} bytes) to all model paths!`);
        resolve();
      },
      error => reject(error),
      {
        binary: true,
        animations: clips
      }
    );
  });
}

async function main() {
  console.log('Generating Eren authentic Pixar 3D GLB...');
  await exportGLB('eren');
  console.log('Generating Aybüke authentic Pixar 3D GLB...');
  await exportGLB('aybuke');
  console.log('Finished generating both GLB models!');
}

main().catch(console.error);
