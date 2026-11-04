const THREE = require('three');

function createChildAnimationClips() {
  const fps = 30;

  // Helper to create quaternion track from euler angles (X, Y, Z in degrees or rad)
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

  // 1. IDLE CLIP (2.0s)
  const idleDuration = 2.0;
  const idleTracks = [
    createPosTrack('Hips.position', idleDuration, (p) => [0, 0.70 + Math.sin(p * Math.PI * 2) * 0.008, 0]),
    createQuatTrack('Spine.quaternion', idleDuration, (p) => [Math.sin(p * Math.PI * 2) * 0.02, 0, 0]),
    createQuatTrack('Head.quaternion', idleDuration, (p) => [0, Math.sin(p * Math.PI * 2) * 0.03, 0]),
    createQuatTrack('LeftArm.quaternion', idleDuration, (p) => [Math.sin(p * Math.PI * 2) * 0.02, 0, -0.06]),
    createQuatTrack('RightArm.quaternion', idleDuration, (p) => [-Math.sin(p * Math.PI * 2) * 0.02, 0, 0.06]),
    createQuatTrack('LeftForeArm.quaternion', idleDuration, () => [0.12, 0, 0]),
    createQuatTrack('RightForeArm.quaternion', idleDuration, () => [0.12, 0, 0]),
    createQuatTrack('LeftUpLeg.quaternion', idleDuration, () => [0, 0, 0]),
    createQuatTrack('RightUpLeg.quaternion', idleDuration, () => [0, 0, 0]),
    createQuatTrack('LeftLeg.quaternion', idleDuration, () => [0, 0, 0]),
    createQuatTrack('RightLeg.quaternion', idleDuration, () => [0, 0, 0])
  ];
  const idleClip = new THREE.AnimationClip('idle', idleDuration, idleTracks);

  // 2. WALK CLIP (1.0s)
  const walkDuration = 1.0;
  const walkTracks = [
    createPosTrack('Hips.position', walkDuration, (p) => [0, 0.70 + Math.abs(Math.sin(p * Math.PI * 2)) * 0.035, 0]),
    createQuatTrack('Spine.quaternion', walkDuration, (p) => [0.03, Math.sin(p * Math.PI * 2) * 0.06, 0]),
    createQuatTrack('Head.quaternion', walkDuration, (p) => [0, -Math.sin(p * Math.PI * 2) * 0.04, 0]),
    createQuatTrack('LeftUpLeg.quaternion', walkDuration, (p) => [Math.sin(p * Math.PI * 2) * 0.45, 0, 0]),
    createQuatTrack('RightUpLeg.quaternion', walkDuration, (p) => [-Math.sin(p * Math.PI * 2) * 0.45, 0, 0]),
    createQuatTrack('LeftLeg.quaternion', walkDuration, (p) => [Math.max(0, -Math.sin(p * Math.PI * 2) * 0.55), 0, 0]),
    createQuatTrack('RightLeg.quaternion', walkDuration, (p) => [Math.max(0, Math.sin(p * Math.PI * 2) * 0.55), 0, 0]),
    createQuatTrack('LeftArm.quaternion', walkDuration, (p) => [-Math.sin(p * Math.PI * 2) * 0.40, 0, -0.08]),
    createQuatTrack('RightArm.quaternion', walkDuration, (p) => [Math.sin(p * Math.PI * 2) * 0.40, 0, 0.08]),
    createQuatTrack('LeftForeArm.quaternion', walkDuration, () => [0.18, 0, 0]),
    createQuatTrack('RightForeArm.quaternion', walkDuration, () => [0.18, 0, 0])
  ];
  const walkClip = new THREE.AnimationClip('walk', walkDuration, walkTracks);

  // 3. RUN CLIP (0.65s)
  const runDuration = 0.65;
  const runTracks = [
    createPosTrack('Hips.position', runDuration, (p) => [0, 0.70 + Math.abs(Math.sin(p * Math.PI * 2)) * 0.065, 0]),
    createQuatTrack('Spine.quaternion', runDuration, (p) => [0.14, Math.sin(p * Math.PI * 2) * 0.08, 0]),
    createQuatTrack('Head.quaternion', runDuration, (p) => [-0.06, -Math.sin(p * Math.PI * 2) * 0.04, 0]),
    createQuatTrack('LeftUpLeg.quaternion', runDuration, (p) => [Math.sin(p * Math.PI * 2) * 0.82, 0, 0]),
    createQuatTrack('RightUpLeg.quaternion', runDuration, (p) => [-Math.sin(p * Math.PI * 2) * 0.82, 0, 0]),
    createQuatTrack('LeftLeg.quaternion', runDuration, (p) => [Math.max(0, -Math.sin(p * Math.PI * 2) * 1.1), 0, 0]),
    createQuatTrack('RightLeg.quaternion', runDuration, (p) => [Math.max(0, Math.sin(p * Math.PI * 2) * 1.1), 0, 0]),
    createQuatTrack('LeftArm.quaternion', runDuration, (p) => [-Math.sin(p * Math.PI * 2) * 0.75, 0, -0.15]),
    createQuatTrack('RightArm.quaternion', runDuration, (p) => [Math.sin(p * Math.PI * 2) * 0.75, 0, 0.15]),
    createQuatTrack('LeftForeArm.quaternion', runDuration, () => [0.55, 0, 0]),
    createQuatTrack('RightForeArm.quaternion', runDuration, () => [0.55, 0, 0])
  ];
  const runClip = new THREE.AnimationClip('run', runDuration, runTracks);

  return { idleClip, walkClip, runClip };
}

// Test creating mixer on a hierarchy
const root = new THREE.Group();
const hips = new THREE.Group(); hips.name = 'Hips'; root.add(hips);
const spine = new THREE.Group(); spine.name = 'Spine'; hips.add(spine);
const leftUpLeg = new THREE.Group(); leftUpLeg.name = 'LeftUpLeg'; hips.add(leftUpLeg);

const { idleClip, walkClip, runClip } = createChildAnimationClips();
const mixer = new THREE.AnimationMixer(root);
const idleAction = mixer.clipAction(idleClip);
const walkAction = mixer.clipAction(walkClip);

idleAction.play();
mixer.update(0.1);
console.log('Idle action running, Hips Y:', hips.position.y);

// Crossfade to walk
walkAction.reset();
walkAction.play();
idleAction.crossFadeTo(walkAction, 0.2, true);

for (let i = 0; i < 5; i++) {
  mixer.update(0.05);
  console.log(`Step ${i} (t=${(i+1)*0.05}s): LeftUpLeg rotX:`, leftUpLeg.rotation.x.toFixed(4));
}
console.log('AnimationMixer crossFade test SUCCESSFUL!');
