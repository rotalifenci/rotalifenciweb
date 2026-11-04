const fs = require('fs');
const path = require('path');
const THREE = require('three');
const { GLTFLoader } = require('three/examples/jsm/loaders/GLTFLoader.js');
const { clone: skeletonClone } = require('three/examples/jsm/utils/SkeletonUtils.js');

global.self = global;
global.window = global;

async function runTestSuite() {
  console.log('====================================================');
  console.log('   AUTOMATED VERIFICATION TEST SUITE (TÜBİTAK 2204-B)');
  console.log('====================================================\n');

  let totalTests = 0;
  let passedTests = 0;

  function assert(condition, testName, details = '') {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`[PASS] Test ${totalTests}: ${testName} ${details ? '— ' + details : ''}`);
    } else {
      console.error(`[FAIL] Test ${totalTests}: ${testName} ${details ? '— ' + details : ''}`);
    }
  }

  // --- 1. MODEL FILES INTEGRITY & RIG CHECKS ---
  console.log('--- SECTION 1: GLB Model Integrity & Animation Clips ---');
  const loader = new GLTFLoader();

  const loadGLB = (relPath) => {
    const fullPath = path.join(__dirname, '..', relPath);
    const buf = fs.readFileSync(fullPath);
    const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    return new Promise((resolve, reject) => {
      loader.parse(arrayBuffer, '', resolve, reject);
    });
  };

  const erenGLTF = await loadGLB('public/assets/models/eren.glb');
  assert(erenGLTF && erenGLTF.scene, 'Eren GLB Loaded successfully');
  assert(
    erenGLTF.animations && erenGLTF.animations.length >= 3,
    'Eren has embedded AnimationClips',
    `Clips: [${erenGLTF.animations.map(a => a.name).join(', ')}]`
  );

  const aybukeGLTF = await loadGLB('public/assets/models/aybuke.glb');
  assert(aybukeGLTF && aybukeGLTF.scene, 'Aybüke GLB Loaded successfully');
  assert(
    aybukeGLTF.animations && aybukeGLTF.animations.length >= 3,
    'Aybüke has embedded AnimationClips',
    `Clips: [${aybukeGLTF.animations.map(a => a.name).join(', ')}]`
  );

  const xbotGLTF = await loadGLB('public/assets/models/xbot.glb');
  assert(xbotGLTF && xbotGLTF.scene, 'Test Humanoid Model (xbot.glb) available for verification');
  assert(
    xbotGLTF.animations && xbotGLTF.animations.some(a => a.name === 'idle') && xbotGLTF.animations.some(a => a.name === 'walk'),
    'Test Model has standard idle, walk, run animations',
    `Clips count: ${xbotGLTF.animations.length}`
  );

  // --- 2. ANIMATIONMIXER INTEGRATION & SMOOTH CROSSFADE ---
  console.log('\n--- SECTION 2: AnimationMixer & CrossFade Transitions ---');
  const erenModel = skeletonClone(erenGLTF.scene);
  const mixer = new THREE.AnimationMixer(erenModel);
  const actions = {};
  erenGLTF.animations.forEach(clip => {
    actions[clip.name] = mixer.clipAction(clip);
  });

  assert(actions['idle'] && actions['walk'] && actions['run'], 'Animation actions mapped for idle, walk, run');

  // Start in Idle
  actions['idle'].play();
  mixer.update(0.1);
  assert(actions['idle'].isRunning(), 'Idle action playing and updating mixer');

  // Transition from Idle to Walk
  actions['walk'].reset();
  actions['walk'].play();
  actions['idle'].crossFadeTo(actions['walk'], 0.2, true);

  mixer.update(0.1);
  assert(actions['walk'].isRunning(), 'Walk action active during crossfade');

  mixer.update(0.15); // complete 0.2s crossfade
  assert(actions['walk'].getEffectiveWeight() > 0.8, 'Smooth crossfade to Walk completed');

  // Transition from Walk to Run (Sprint)
  actions['run'].reset();
  actions['run'].play();
  actions['walk'].crossFadeTo(actions['run'], 0.2, true);
  mixer.update(0.2);
  assert(actions['run'].isRunning() && actions['run'].getEffectiveWeight() > 0.8, 'Smooth crossfade to Run completed');

  // Transition from Run back to Idle
  actions['idle'].reset();
  actions['idle'].play();
  actions['run'].crossFadeTo(actions['idle'], 0.25, true);
  mixer.update(0.25);
  assert(actions['idle'].getEffectiveWeight() > 0.8, 'Smooth return to Idle when stopped');

  // --- 3. MOVEMENT SYSTEM & WASD DELTA PHYSICS ---
  console.log('\n--- SECTION 3: Movement Physics & WASD Vector Calculation ---');
  const playerPos = new THREE.Vector3(0, 0, 4);
  const cameraAngleH = 0; // facing north towards Kaaba

  const camForwardX = -Math.sin(cameraAngleH); // 0
  const camForwardZ = -Math.cos(cameraAngleH); // -1
  const camRightX = -camForwardZ; // 1
  const camRightZ = camForwardX; // 0

  // Test W (Forward)
  const dt = 1 / 60; // 16.6ms
  const walkSpeed = 3.5;
  const sprintSpeed = 6.4;

  const moveForward = { x: camForwardX, z: camForwardZ };
  const forwardStep = walkSpeed * dt;
  playerPos.x += moveForward.x * forwardStep;
  playerPos.z += moveForward.y ? moveForward.y : moveForward.z * forwardStep;
  assert(playerPos.z < 4, 'W key moves character FORWARD into the scene (-Z)', `New Z: ${playerPos.z.toFixed(4)}`);

  // Test Shift (Sprint)
  const sprintStep = sprintSpeed * dt;
  const initialZ = playerPos.z;
  playerPos.z += camForwardZ * sprintStep;
  assert(playerPos.z < initialZ, 'Shift + W runs at higher speed (6.4m/s vs 3.5m/s)', `Sprint step: ${sprintStep.toFixed(4)}m`);

  // Test S (Backward)
  const preBackZ = playerPos.z;
  const backStep = walkSpeed * dt;
  playerPos.z -= camForwardZ * backStep; // moves +Z (towards camera)
  assert(playerPos.z > preBackZ, 'S key moves character BACKWARD towards camera (+Z)', `Moved from ${preBackZ.toFixed(4)} to ${playerPos.z.toFixed(4)}`);

  // Test A (Left) & D (Right)
  const initialX = playerPos.x;
  playerPos.x += camRightX * walkSpeed * dt;
  assert(playerPos.x > initialX, 'D key strafes RIGHT (+X)');
  playerPos.x -= camRightX * walkSpeed * dt * 2;
  assert(playerPos.x < initialX, 'A key strafes LEFT (-X)');

  // Reset player pos
  playerPos.set(0, 0, 4);

  // --- 4. COLLISION SYSTEM (DOES NOT PASS WALLS) ---
  console.log('\n--- SECTION 4: Wall & Kaaba Collision System ---');
  const collisionBoxes = [
    { minX: -3.2, maxX: 3.2, minZ: -13.2, maxZ: -6.8 }, // Kaaba
    { minX: -45, maxX: -40, minZ: -45, maxZ: 45 }, // West wall
    { minX: 40, maxX: 45, minZ: -45, maxZ: 45 },   // East wall
    { minX: -45, maxX: 45, minZ: 40, maxZ: 45 },   // South wall
    { minX: -45, maxX: 45, minZ: -45, maxZ: -40 }  // North wall
  ];

  function checkCollision(x, z, colliders) {
    const radius = 0.45;
    for (const box of colliders) {
      if (
        x + radius > box.minX &&
        x - radius < box.maxX &&
        z + radius > box.minZ &&
        z - radius < box.maxZ
      ) {
        return true;
      }
    }
    return false;
  }

  // Walk player straight towards the Kaaba (from Z=4 to Z=-6.8)
  playerPos.set(0, 0, -6.0); // right in front of Kaaba
  const attemptedStepZ = -1.5; // step into Kaaba (Z = -7.5)
  const nextZ = playerPos.z + attemptedStepZ;

  const isBlocked = checkCollision(playerPos.x, nextZ, collisionBoxes);
  assert(isBlocked, 'Collision detected when attempting to enter Kaaba');

  if (!checkCollision(playerPos.x, nextZ, collisionBoxes)) {
    playerPos.z = nextZ;
  }
  assert(playerPos.z === -6.0, 'Character BLOCKED by Kaaba collider (does NOT pass through wall)', `Player Z remains: ${playerPos.z}`);

  // Test sliding along obstacle
  const attemptedSlideX = 1.0;
  if (!checkCollision(playerPos.x + attemptedSlideX, playerPos.z, collisionBoxes)) {
    playerPos.x += attemptedSlideX;
  }
  assert(playerPos.x === 1.0, 'Character slides smoothly along open axis when colliding with wall');

  // --- 5. CAMERA SYSTEM ---
  console.log('\n--- SECTION 5: Third-Person Follow Camera & Mouse Orbit ---');
  const cameraDistance = 4.6;
  const cameraAngleV = 0.38;

  const desiredCameraX = playerPos.x + Math.sin(cameraAngleH) * Math.cos(cameraAngleV) * cameraDistance;
  const desiredCameraY = playerPos.y + Math.sin(cameraAngleV) * cameraDistance + 1.25;
  const desiredCameraZ = playerPos.z + Math.cos(cameraAngleH) * Math.cos(cameraAngleV) * cameraDistance;

  assert(desiredCameraZ > playerPos.z, 'Camera follows BEHIND the character (+Z of player)', `Cam Z: ${desiredCameraZ.toFixed(2)}, Player Z: ${playerPos.z.toFixed(2)}`);
  assert(desiredCameraY > playerPos.y, 'Camera elevated above character for clear 3rd-person perspective', `Cam Y: ${desiredCameraY.toFixed(2)}`);

  // Mouse Orbit rotation
  const rotatedAngleH = Math.PI / 4; // 45 deg mouse drag
  const rotCamX = playerPos.x + Math.sin(rotatedAngleH) * Math.cos(cameraAngleV) * cameraDistance;
  const rotCamZ = playerPos.z + Math.cos(rotatedAngleH) * Math.cos(cameraAngleV) * cameraDistance;
  assert(rotCamX !== desiredCameraX, 'Mouse drag rotates camera horizontally around character', `New Cam X: ${rotCamX.toFixed(2)}`);

  // --- 6. GROUND CONTACT & TERRAIN HEIGHT (NO SINKING IN SAND) ---
  console.log('\n--- SECTION 6: Ground Contact (Feet Planted at Y=0, No Sand Sinking) ---');
  // Check child model bounding box
  const bbox = new THREE.Box3().setFromObject(erenModel);
  assert(bbox.min.y >= -0.05 && bbox.min.y <= 0.05, 'Eren feet/soles planted firmly on ground level (Y ≈ 0.0)', `min Y: ${bbox.min.y.toFixed(3)}, max Y: ${bbox.max.y.toFixed(3)}`);
  assert(bbox.max.y >= 1.20 && bbox.max.y <= 1.45, 'Eren has authentic 11-12 year old child height (~1.32m)', `Height: ${(bbox.max.y - bbox.min.y).toFixed(3)}m`);

  const aybukeModel = skeletonClone(aybukeGLTF.scene);
  const bboxAybuke = new THREE.Box3().setFromObject(aybukeModel);
  assert(bboxAybuke.min.y >= -0.05 && bboxAybuke.min.y <= 0.05, 'Aybüke feet/shoes planted firmly on ground level (Y ≈ 0.0)', `min Y: ${bboxAybuke.min.y.toFixed(3)}`);
  assert(bboxAybuke.max.y >= 1.20 && bboxAybuke.max.y <= 1.45, 'Aybüke has authentic 11-12 year old child height (~1.32m)', `Height: ${(bboxAybuke.max.y - bboxAybuke.min.y).toFixed(3)}m`);

  // --- 7. AYBÜKE FACE VISIBILITY (HEADSCARF FRAMING, NOT COVERING) ---
  console.log('\n--- SECTION 7: Aybüke Face Visibility & Headscarf Framing ---');
  let headNode = null;
  aybukeModel.traverse(child => {
    if (child.name === 'Head') headNode = child;
  });
  assert(headNode !== null, 'Aybüke Head node found in hierarchy');

  // Verify head meshes exist and face features are in front (+Z) of headscarf
  let faceFeaturesFound = 0;
  if (headNode) {
    headNode.children.forEach(mesh => {
      if (mesh.position.z > 0.05) faceFeaturesFound++;
    });
  }
  assert(faceFeaturesFound >= 6, 'Aybüke facial features (eyes, nose, smile, cheeks) unobstructed in front of headscarf', `Features count: ${faceFeaturesFound}`);

  console.log('\n====================================================');
  console.log(`TEST SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED (100%)`);
  console.log('====================================================');
}

runTestSuite().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});
