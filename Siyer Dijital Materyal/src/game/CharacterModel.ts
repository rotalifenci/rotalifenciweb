import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { CharacterType } from '../types';

export interface RiggedCharacter {
  group: THREE.Group;
  type: CharacterType;
  isLoaded: boolean;
  mixer: THREE.AnimationMixer | null;
  actions: Record<string, THREE.AnimationAction>;
  currentActionName: string;
  updateAnimation: (
    delta: number,
    state: 'idle' | 'walk' | 'run' | 'wave' | 'think' | 'celebrate' | 'portal',
    facingAngle?: number
  ) => void;
  playWaveGreeting: () => void;
  playAction: (name: string) => void;
}

export const ASSET_VERSION = '?v=20261101_eren_new_v6';

// Global cached GLTF models and pre-computed rigged geometries
let cachedErenGLTF: any = null;
let cachedAybukeGLTF: any = null;
const cachedRiggedGeometry: Record<string, THREE.BufferGeometry> = {};
let isPreloading = false;
let preloadPromise: Promise<void> | null = null;

async function loadGltfWithFallback(loader: GLTFLoader, primaryUrl: string, fallbackUrl: string): Promise<any> {
  try {
    return await loader.loadAsync(primaryUrl);
  } catch {
    return await loader.loadAsync(fallbackUrl);
  }
}

export function preloadCharacterModels(): Promise<void> {
  if (preloadPromise) return preloadPromise;
  isPreloading = true;

  const loader = new GLTFLoader();
  const promises: Promise<void>[] = [];

  if (!cachedErenGLTF) {
    promises.push(
      loadGltfWithFallback(loader, `/models/eren.glb${ASSET_VERSION}`, `/assets/models/eren.glb${ASSET_VERSION}`)
        .then(gltf => { cachedErenGLTF = gltf; })
        .catch(e => console.warn('Preload warning for eren.glb:', e))
    );
  }

  if (!cachedAybukeGLTF) {
    promises.push(
      loadGltfWithFallback(loader, `/models/aybuke.glb${ASSET_VERSION}`, `/assets/models/aybuke.glb${ASSET_VERSION}`)
        .then(gltf => { cachedAybukeGLTF = gltf; })
        .catch(e => console.warn('Preload warning for aybuke.glb:', e))
    );
  }

  preloadPromise = Promise.all(promises).then(() => {
    isPreloading = false;
  });

  return preloadPromise;
}

interface CharacterBones {
  hips: THREE.Bone;
  spine: THREE.Bone;
  head: THREE.Bone;
  leftThigh: THREE.Bone;
  leftCalf: THREE.Bone;
  rightThigh: THREE.Bone;
  rightCalf: THREE.Bone;
  leftArm: THREE.Bone;
  rightArm: THREE.Bone;
}

/**
 * Creates a standard child humanoid skeleton and computes smooth skinning weights
 * for the high-detail authentic 3D mesh. Enables true skeletal walking, running,
 * stepping, and posture animation without deforming facial features.
 */
function buildRiggedSkinnedMesh(rawMesh: THREE.Mesh, charType?: CharacterType): { skinnedMesh: THREE.SkinnedMesh; bones: CharacterBones } {
  let geo: THREE.BufferGeometry;

  if (charType && cachedRiggedGeometry[charType]) {
    geo = cachedRiggedGeometry[charType].clone();
  } else {
    geo = rawMesh.geometry.clone();
    const pos = geo.attributes.position;
    const count = pos.count;

    // 2. Compute Vertex Skin Weights & Indices
    const skinIndices = new Uint16Array(count * 4);
    const skinWeights = new Float32Array(count * 4);

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const idx = i * 4;

      if (y >= 0.72) {
        // Head region (face, eyes, headdress, hair) firmly attached to Head bone
        skinIndices[idx] = 2; // Head
        skinWeights[idx] = 1.0;
      } else if (y >= 0.46) {
        // Torso & Arm region
        if (x > 0.07 && z > -0.06) {
          // Left arm and strap-holding hand
          skinIndices[idx] = 7; // LeftArm
          skinWeights[idx] = 0.85;
          skinIndices[idx + 1] = 1; // Spine
          skinWeights[idx + 1] = 0.15;
        } else if (x < -0.07 && z > -0.06) {
          // Right arm and strap-holding hand
          skinIndices[idx] = 8; // RightArm
          skinWeights[idx] = 0.85;
          skinIndices[idx + 1] = 1; // Spine
          skinWeights[idx + 1] = 0.15;
        } else {
          // Central chest and back
          const t = THREE.MathUtils.clamp((y - 0.46) / 0.26, 0, 1);
          skinIndices[idx] = 1; // Spine
          skinWeights[idx] = t;
          skinIndices[idx + 1] = 0; // Hips
          skinWeights[idx + 1] = 1.0 - t;
        }
      } else {
        // Lower body / Leg region
        if (Math.abs(x) < 0.025 && y > 0.38) {
          skinIndices[idx] = 0; // Hips
          skinWeights[idx] = 1.0;
        } else if (x >= 0) {
          // Left Leg
          if (y >= 0.22) {
            const t = THREE.MathUtils.clamp((y - 0.22) / 0.24, 0, 1);
            skinIndices[idx] = 3; // LeftThigh
            skinWeights[idx] = 1.0 - t * 0.35;
            skinIndices[idx + 1] = 0; // Hips
            skinWeights[idx + 1] = t * 0.35;
          } else {
            const t = THREE.MathUtils.clamp(y / 0.22, 0, 1);
            skinIndices[idx] = 4; // LeftCalf & Foot
            skinWeights[idx] = 1.0 - t * 0.30;
            skinIndices[idx + 1] = 3; // LeftThigh
            skinWeights[idx + 1] = t * 0.30;
          }
        } else {
          // Right Leg
          if (y >= 0.22) {
            const t = THREE.MathUtils.clamp((y - 0.22) / 0.24, 0, 1);
            skinIndices[idx] = 5; // RightThigh
            skinWeights[idx] = 1.0 - t * 0.35;
            skinIndices[idx + 1] = 0; // Hips
            skinWeights[idx + 1] = t * 0.35;
          } else {
            const t = THREE.MathUtils.clamp(y / 0.22, 0, 1);
            skinIndices[idx] = 6; // RightCalf & Foot
            skinWeights[idx] = 1.0 - t * 0.30;
            skinIndices[idx + 1] = 5; // RightThigh
            skinWeights[idx + 1] = t * 0.30;
          }
        }
      }
    }

    geo.setAttribute('skinIndex', new THREE.BufferAttribute(skinIndices, 4));
    geo.setAttribute('skinWeight', new THREE.BufferAttribute(skinWeights, 4));

    if (charType) {
      cachedRiggedGeometry[charType] = geo.clone();
    }
  }

  // 1. Create Humanoid Bone Hierarchy
  const hips = new THREE.Bone();
  hips.name = 'Hips';
  hips.position.set(0, 0.48, 0);

  const spine = new THREE.Bone();
  spine.name = 'Spine';
  spine.position.set(0, 0.18, 0);
  hips.add(spine);

  const head = new THREE.Bone();
  head.name = 'Head';
  head.position.set(0, 0.14, 0);
  spine.add(head);

  const leftArm = new THREE.Bone();
  leftArm.name = 'LeftArm';
  leftArm.position.set(0.12, 0.06, 0.04);
  spine.add(leftArm);

  const rightArm = new THREE.Bone();
  rightArm.name = 'RightArm';
  rightArm.position.set(-0.12, 0.06, 0.04);
  spine.add(rightArm);

  const leftThigh = new THREE.Bone();
  leftThigh.name = 'LeftThigh';
  leftThigh.position.set(0.08, -0.05, 0);
  hips.add(leftThigh);

  const leftCalf = new THREE.Bone();
  leftCalf.name = 'LeftCalf';
  leftCalf.position.set(0, -0.22, 0);
  leftThigh.add(leftCalf);

  const rightThigh = new THREE.Bone();
  rightThigh.name = 'RightThigh';
  rightThigh.position.set(-0.08, -0.05, 0);
  hips.add(rightThigh);

  const rightCalf = new THREE.Bone();
  rightCalf.name = 'RightCalf';
  rightCalf.position.set(0, -0.22, 0);
  rightThigh.add(rightCalf);

  const bonesList = [hips, spine, head, leftThigh, leftCalf, rightThigh, rightCalf, leftArm, rightArm];
  const skeleton = new THREE.Skeleton(bonesList);

  // 3. Create SkinnedMesh with PBR material
  let mat = rawMesh.material as THREE.MeshStandardMaterial;
  if (Array.isArray(mat)) mat = mat[0] as THREE.MeshStandardMaterial;
  const clonedMat = mat.clone();
  if (clonedMat.map) {
    clonedMat.map.colorSpace = THREE.SRGBColorSpace;
    clonedMat.map.needsUpdate = true;
  }
  clonedMat.roughness = THREE.MathUtils.clamp(clonedMat.roughness ?? 0.65, 0.40, 0.85);
  clonedMat.metalness = THREE.MathUtils.clamp(clonedMat.metalness ?? 0.05, 0.0, 0.20);

  const skinnedMesh = new THREE.SkinnedMesh(geo, clonedMat);
  skinnedMesh.castShadow = true;
  skinnedMesh.receiveShadow = true;

  skinnedMesh.add(hips);
  skinnedMesh.bind(skeleton);

  return {
    skinnedMesh,
    bones: { hips, spine, head, leftThigh, leftCalf, rightThigh, rightCalf, leftArm, rightArm }
  };
}

/**
 * Creates a clean stylized silhouette proxy mesh if the GLB is still loading
 * for a few milliseconds, ensuring no visual glitch or distorted cutout face.
 */
export function buildSynchronousChildMesh(type: CharacterType): THREE.Group {
  const group = new THREE.Group();
  group.name = `character_mesh_${type}`;

  const mat = new THREE.MeshStandardMaterial({
    color: type === 'eren' ? 0x6e381b : 0xd02026,
    roughness: 0.6,
    metalness: 0.1
  });

  const bodyGeo = new THREE.CapsuleGeometry(0.18, 0.75, 8, 16);
  const mesh = new THREE.Mesh(bodyGeo, mat);
  mesh.position.y = 0.62;
  mesh.castShadow = true;
  group.add(mesh);

  return group;
}

export function createCharacterModel(characterType: CharacterType): RiggedCharacter {
  const type = characterType === 'aybuke' ? 'aybuke' : 'eren';
  const root = new THREE.Group();
  root.name = `character_root_${type}`;

  // Pivot group for overall positioning & orientation
  const meshPivot = new THREE.Group();
  meshPivot.name = `mesh_pivot_${type}`;
  root.add(meshPivot);

  let bonesRef: CharacterBones | null = null;
  let defaultHipsY = 0.48;

  const characterState: RiggedCharacter = {
    group: root,
    type: characterType,
    isLoaded: false,
    mixer: null,
    actions: {},
    currentActionName: 'idle',
    updateAnimation: () => {},
    playWaveGreeting: () => {},
    playAction: () => {}
  };

  let currentFacingAngle = 0;
  let animTime = 0;
  let walkCycle = 0;
  let runCycle = 0;
  let waveTimer = 0;
  let celebrateTimer = 0;
  let thinkTimer = 0;

  function attachModel(sourceGltf: any) {
    while (meshPivot.children.length > 0) {
      meshPivot.remove(meshPivot.children[0]);
    }

    // Find the primary mesh inside GLTF
    let targetMesh: THREE.Mesh | null = null;
    sourceGltf.scene.traverse((child: THREE.Object3D) => {
      if (!targetMesh && (child as THREE.Mesh).isMesh) {
        targetMesh = child as THREE.Mesh;
      }
    });

    if (!targetMesh) {
      console.warn('No mesh found in character GLTF scene');
      return;
    }

    // Build authentic rigged SkinnedMesh with humanoid skeleton (utilizes cached geometry for instant 0ms mount)
    const { skinnedMesh, bones } = buildRiggedSkinnedMesh(targetMesh, type);
    bonesRef = bones;

    // Model Container
    const modelContainer = new THREE.Group();
    modelContainer.name = `rigged_character_${type}`;
    modelContainer.add(skinnedMesh);

    // Compute bounds and scale to child dimensions (Eren: 1.28m, Aybüke: 1.25m)
    const bbox = new THREE.Box3().setFromObject(modelContainer);
    const rawHeight = bbox.max.y - bbox.min.y;
    const targetHeight = type === 'eren' ? 1.28 : 1.25;
    const scale = rawHeight > 0.01 ? targetHeight / rawHeight : 1.0;

    modelContainer.scale.set(scale, scale, scale);
    modelContainer.updateMatrixWorld(true);

    // Anchor precisely at Y = 0.0000 (soles on ground) and centered on X and Z
    const scaledBbox = new THREE.Box3().setFromObject(modelContainer);
    const offsetY = -scaledBbox.min.y;
    const offsetX = -(scaledBbox.min.x + scaledBbox.max.x) / 2;
    const offsetZ = -(scaledBbox.min.z + scaledBbox.max.z) / 2;

    modelContainer.position.set(offsetX, offsetY, offsetZ);
    meshPivot.add(modelContainer);

    defaultHipsY = bones.hips.position.y;
    characterState.isLoaded = true;
  }

  // Check if GLTF is already cached
  const cached = type === 'eren' ? cachedErenGLTF : cachedAybukeGLTF;
  if (cached) {
    attachModel(cached);
  } else {
    const placeholder = buildSynchronousChildMesh(type);
    meshPivot.add(placeholder);

    const modelUrl = `${type === 'eren' ? '/models/eren.glb' : '/models/aybuke.glb'}${ASSET_VERSION}`;
    const fallbackUrl = `${type === 'eren' ? '/assets/models/eren.glb' : '/assets/models/aybuke.glb'}${ASSET_VERSION}`;
    const loader = new GLTFLoader();

    loadGltfWithFallback(loader, modelUrl, fallbackUrl)
      .then(gltf => {
        if (type === 'eren') cachedErenGLTF = gltf;
        else cachedAybukeGLTF = gltf;
        attachModel(gltf);
      })
      .catch(err => {
        console.warn(`Error loading 3D character model ${type}:`, err);
      });
  }

  // --- LOCOMOTION & SKELETAL WALKING CONTROLLER ---
  characterState.updateAnimation = (
    delta: number,
    state: 'idle' | 'walk' | 'run' | 'wave' | 'think' | 'celebrate' | 'portal',
    facingAngle?: number
  ) => {
    animTime += delta;

    if (waveTimer > 0) waveTimer -= delta;
    if (celebrateTimer > 0) celebrateTimer -= delta;
    if (thinkTimer > 0) thinkTimer -= delta;

    // Smooth heading rotation
    if (facingAngle !== undefined) {
      let diff = facingAngle - currentFacingAngle;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      currentFacingAngle += diff * Math.min(delta * 14, 1);
      root.rotation.y = currentFacingAngle;
    }

    characterState.currentActionName = state;

    if (!bonesRef) return;
    const { hips, spine, head, leftThigh, leftCalf, rightThigh, rightCalf, leftArm, rightArm } = bonesRef;

    // Active state routing
    if (waveTimer > 0 || state === 'wave') {
      // Cheerful wave & friendly torso greeting
      leftThigh.rotation.x = THREE.MathUtils.lerp(leftThigh.rotation.x, 0, delta * 8);
      rightThigh.rotation.x = THREE.MathUtils.lerp(rightThigh.rotation.x, 0, delta * 8);
      leftCalf.rotation.x = THREE.MathUtils.lerp(leftCalf.rotation.x, 0, delta * 8);
      rightCalf.rotation.x = THREE.MathUtils.lerp(rightCalf.rotation.x, 0, delta * 8);

      // Right arm waves cheerfully, left arm holds backpack strap
      rightArm.rotation.x = -1.35 + Math.sin(animTime * 8) * 0.28;
      rightArm.rotation.z = -0.45;
      leftArm.rotation.x = THREE.MathUtils.lerp(leftArm.rotation.x, 0, delta * 6);
      leftArm.rotation.z = -0.06;

      hips.position.y = defaultHipsY + Math.sin(animTime * 6) * 0.012;
      hips.rotation.z = Math.sin(animTime * 6) * 0.03;
      spine.rotation.x = 0.02;
      spine.rotation.y = Math.sin(animTime * 6) * 0.08;
      head.rotation.x = Math.sin(animTime * 6) * 0.04;
      head.rotation.z = -0.05;
    } else if (celebrateTimer > 0 || state === 'celebrate') {
      // Joyful jumping celebration
      const jumpProgress = Math.sin(animTime * 8);
      const isUp = jumpProgress > 0;
      hips.position.y = defaultHipsY + Math.abs(jumpProgress) * 0.10;
      leftThigh.rotation.x = isUp ? -0.25 : 0.15;
      rightThigh.rotation.x = isUp ? -0.25 : 0.15;
      leftCalf.rotation.x = isUp ? 0.35 : 0;
      rightCalf.rotation.x = isUp ? 0.35 : 0;
      
      leftArm.rotation.x = isUp ? -0.35 : 0;
      rightArm.rotation.x = isUp ? -0.35 : 0;
      spine.rotation.x = -0.04;
      head.rotation.x = -0.08;
    } else if (thinkTimer > 0 || state === 'think') {
      // Pensive thoughtful stance
      leftThigh.rotation.x = THREE.MathUtils.lerp(leftThigh.rotation.x, 0.05, delta * 6);
      rightThigh.rotation.x = THREE.MathUtils.lerp(rightThigh.rotation.x, -0.05, delta * 6);
      leftCalf.rotation.x = THREE.MathUtils.lerp(leftCalf.rotation.x, 0.02, delta * 6);
      rightCalf.rotation.x = THREE.MathUtils.lerp(rightCalf.rotation.x, 0, delta * 6);

      leftArm.rotation.z = -0.05;
      rightArm.rotation.x = -0.45; // hand near chin/chest
      rightArm.rotation.z = 0.20;

      hips.position.y = defaultHipsY + Math.sin(animTime * 2) * 0.005;
      hips.rotation.z = 0.03;
      spine.rotation.x = 0.04;
      spine.rotation.y = -0.06;
      head.rotation.x = 0.06;
      head.rotation.z = 0.08; // Pensive head tilt
    } else if (state === 'run') {
      // --- DYNAMIC SKELETAL RUNNING (FAST PACED STRIDE & ATHLETIC LEAN) ---
      runCycle += delta * 14.0;

      // Vigorous leg swing
      const runStride = Math.sin(runCycle);
      leftThigh.rotation.x = runStride * 0.85;
      rightThigh.rotation.x = -runStride * 0.85;

      // Dynamic knee flexion during recovery
      leftCalf.rotation.x = Math.max(0, -runStride) * 0.95;
      rightCalf.rotation.x = Math.max(0, runStride) * 0.95;

      // Arms securely hold backpack straps while sprinting
      leftArm.rotation.x = -runStride * 0.20;
      rightArm.rotation.x = runStride * 0.20;
      leftArm.rotation.z = -0.08;
      rightArm.rotation.z = 0.08;

      // Sprinting hip vertical bounce and lateral weight transfer
      hips.position.y = defaultHipsY + Math.abs(Math.sin(runCycle)) * 0.045;
      hips.rotation.z = Math.sin(runCycle * 0.5) * 0.04;

      // Athletic forward torso lean & counter-twist
      spine.rotation.x = 0.14;
      spine.rotation.y = Math.sin(runCycle) * 0.08;

      // Head stable on horizon
      head.rotation.x = -0.05;
      head.rotation.y = -spine.rotation.y * 0.5;
    } else if (state === 'walk') {
      // --- NATURAL SKELETAL WALKING (HOLDING BACKPACK STRAPS & ACTIVE STRIDE) ---
      walkCycle += delta * 8.2;

      // Leg swing: left and right alternate in opposition
      const walkStride = Math.sin(walkCycle);
      leftThigh.rotation.x = walkStride * 0.52;
      rightThigh.rotation.x = -walkStride * 0.52;

      // Natural knee flexion during back swing
      leftCalf.rotation.x = Math.max(0, -walkStride) * 0.62;
      rightCalf.rotation.x = Math.max(0, walkStride) * 0.62;

      // Arms holding backpack straps with rhythmic gentle gait sway
      leftArm.rotation.x = -walkStride * 0.10;
      rightArm.rotation.x = walkStride * 0.10;
      leftArm.rotation.z = -0.06;
      rightArm.rotation.z = 0.06;

      // Stepping vertical rhythm & weight shift
      hips.position.y = defaultHipsY + Math.abs(Math.sin(walkCycle)) * 0.024;
      hips.rotation.z = Math.sin(walkCycle * 0.5) * 0.025;

      // Torso posture & subtle counter-twist
      spine.rotation.x = 0.05;
      spine.rotation.y = Math.sin(walkCycle) * 0.05;

      // Head kept level
      head.rotation.x = -0.02;
      head.rotation.y = -spine.rotation.y * 0.5;
    } else {
      // --- IDLE: CALM NATURAL BREATHING & HANDS RESTING ON BACKPACK STRAPS ---
      leftThigh.rotation.x = THREE.MathUtils.lerp(leftThigh.rotation.x, 0, delta * 8);
      rightThigh.rotation.x = THREE.MathUtils.lerp(rightThigh.rotation.x, 0, delta * 8);
      leftCalf.rotation.x = THREE.MathUtils.lerp(leftCalf.rotation.x, 0, delta * 8);
      rightCalf.rotation.x = THREE.MathUtils.lerp(rightCalf.rotation.x, 0, delta * 8);

      leftArm.rotation.x = THREE.MathUtils.lerp(leftArm.rotation.x, 0, delta * 6);
      rightArm.rotation.x = THREE.MathUtils.lerp(rightArm.rotation.x, 0, delta * 6);
      leftArm.rotation.z = THREE.MathUtils.lerp(leftArm.rotation.z, -0.05, delta * 6);
      rightArm.rotation.z = THREE.MathUtils.lerp(rightArm.rotation.z, 0.05, delta * 6);

      const breath = Math.sin(animTime * 2.2);
      hips.position.y = defaultHipsY + breath * 0.005;
      hips.rotation.z = THREE.MathUtils.lerp(hips.rotation.z, 0, delta * 6);
      spine.rotation.x = breath * 0.012;
      spine.rotation.y = THREE.MathUtils.lerp(spine.rotation.y, 0, delta * 6);
      head.rotation.x = -breath * 0.008;
      head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, 0, delta * 6);
      head.rotation.z = THREE.MathUtils.lerp(head.rotation.z, 0, delta * 6);
    }
  };

  characterState.playWaveGreeting = () => {
    waveTimer = 2.4;
  };

  characterState.playAction = (actionName: string) => {
    const act = actionName.toLowerCase();
    if (act === 'wave') {
      waveTimer = 2.4;
    } else if (act === 'celebrate') {
      celebrateTimer = 2.5;
    } else if (act === 'think') {
      thinkTimer = 3.0;
    }
    characterState.currentActionName = act;
  };

  return characterState;
}
