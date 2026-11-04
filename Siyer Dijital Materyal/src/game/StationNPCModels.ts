import * as THREE from 'three';
import { EventStationData } from '../types';

export interface Station3DInstance {
  stationId: number;
  rootGroup: THREE.Group;
  storytellerGroup: THREE.Group;
  storytellerRightArm: THREE.Group;
  guideGroup: THREE.Group;
  guideBookMesh: THREE.Mesh;
  beaconRing: THREE.Mesh;
  storytellerWorldPos: THREE.Vector3;
  guideWorldPos: THREE.Vector3;
}

function createOverheadLabelSprite(
  topBadgeText: string,
  mainText: string,
  theme: 'storyteller' | 'guide_active' | 'guide_completed' | 'guide_locked'
): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 144;
  const ctx = canvas.getContext('2d')!;

  const bgColors = {
    storyteller: { bg: 'rgba(45, 23, 6, 0.94)', border: '#fbbf24', badge: '#f59e0b', text: '#fef3c7' },
    guide_active: { bg: 'rgba(6, 46, 36, 0.94)', border: '#34d399', badge: '#10b981', text: '#ecfdf5' },
    guide_completed: { bg: 'rgba(12, 52, 32, 0.92)', border: '#4ade80', badge: '#22c55e', text: '#dcfce7' },
    guide_locked: { bg: 'rgba(28, 25, 23, 0.88)', border: '#78716c', badge: '#57534e', text: '#d6d3d1' }
  }[theme];

  // Rounded pill background
  ctx.fillStyle = bgColors.bg;
  ctx.strokeStyle = bgColors.border;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(12, 12, 488, 120, 28);
  ctx.fill();
  ctx.stroke();

  // Top badge
  ctx.fillStyle = bgColors.badge;
  ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(topBadgeText, 256, 52);

  // Main title
  ctx.fillStyle = bgColors.text;
  ctx.font = '900 26px system-ui, -apple-system, sans-serif';
  const truncated = mainText.length > 30 ? mainText.slice(0, 29) + '…' : mainText;
  ctx.fillText(truncated, 256, 98);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(2.9, 0.82, 1);
  sprite.renderOrder = 10;
  return sprite;
}

/**
 * Builds the 3D Wise White-Bearded Historical Storyteller (Ak Sakallı Yaşlı Tarih Anlatıcısı).
 * Strictly a fictional elderly narrator in traditional Hijazi scholarly attire.
 */
function buildStorytellerMesh(stationId: number): {
  group: THREE.Group;
  rightArm: THREE.Group;
} {
  const group = new THREE.Group();
  group.name = `storyteller_npc_${stationId}`;

  const robeMat = new THREE.MeshStandardMaterial({ color: 0xd6c7b2, roughness: 0.85 });
  const cloakMat = new THREE.MeshStandardMaterial({ color: 0x5c4028, roughness: 0.82 });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xe8be96, roughness: 0.65 });
  const beardMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.75 });
  const turbanMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.7 });
  const goldBandMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.65,
    roughness: 0.3
  });
  const woodStaffMat = new THREE.MeshStandardMaterial({ color: 0x4a2c11, roughness: 0.8 });

  // Inner Tunic / Robe
  const robe = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.42, 1.32, 14), robeMat);
  robe.position.y = 0.66;
  robe.castShadow = true;
  robe.receiveShadow = true;
  group.add(robe);

  // Outer Scholarly Cloak (Aba)
  const cloak = new THREE.Mesh(
    new THREE.CylinderGeometry(0.31, 0.45, 1.28, 14, 1, false, 0.3, Math.PI * 1.4),
    cloakMat
  );
  cloak.position.y = 0.66;
  cloak.castShadow = true;
  group.add(cloak);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), skinMat);
  head.position.y = 1.52;
  head.castShadow = true;
  group.add(head);

  // Wise Eyes & White Eyebrows
  const eyeGeo = new THREE.SphereGeometry(0.025, 8, 8);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1c1917 });
  [-0.07, 0.07].forEach(ex => {
    const eye = new THREE.Mesh(eyeGeo, eyeMat);
    eye.position.set(ex, 1.55, 0.19);
    group.add(eye);

    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.018, 0.02), beardMat);
    brow.position.set(ex, 1.59, 0.20);
    group.add(brow);
  });

  // Long Flowing White Beard (Ak Sakal)
  const beardUpper = new THREE.Mesh(new THREE.SphereGeometry(0.19, 12, 12), beardMat);
  beardUpper.scale.set(1.0, 1.25, 0.75);
  beardUpper.position.set(0, 1.38, 0.10);
  group.add(beardUpper);

  const beardTip = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.42, 12), beardMat);
  beardTip.rotation.x = Math.PI;
  beardTip.position.set(0, 1.15, 0.13);
  group.add(beardTip);

  // Traditional Scholar Turban (Sarık)
  const turban = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.085, 10, 20), turbanMat);
  turban.rotation.x = Math.PI / 2 - 0.1;
  turban.position.set(0, 1.67, 0);
  group.add(turban);

  const turbanCap = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 10), goldBandMat);
  turbanCap.position.set(0, 1.71, 0);
  group.add(turbanCap);

  // Left Arm + Wooden Walking Staff (Asa)
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.34, 1.22, 0);
  const leftSleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.52, 10), cloakMat);
  leftSleeve.position.set(0, -0.22, 0.12);
  leftSleeve.rotation.x = -0.45;
  leftArm.add(leftSleeve);

  const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.024, 1.75, 8), woodStaffMat);
  staff.position.set(-0.04, -0.35, 0.28);
  staff.castShadow = true;
  leftArm.add(staff);
  group.add(leftArm);

  // Right Arm (Rigged for gentle greeting wave when student approaches)
  const rightArm = new THREE.Group();
  rightArm.position.set(0.34, 1.22, 0);
  const rightSleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.52, 10), cloakMat);
  rightSleeve.position.set(0, -0.22, 0.08);
  rightArm.add(rightSleeve);
  const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), skinMat);
  rightHand.position.set(0, -0.48, 0.10);
  rightArm.add(rightHand);
  group.add(rightArm);

  // Tag all meshes for raycasting click detection
  group.traverse(child => {
    child.userData = {
      interactType: 'storyteller',
      stationId
    };
  });

  return { group, rightArm };
}

/**
 * Builds the 3D Question Guide Character (Soru Rehber Karakteri).
 */
function buildQuestionGuideMesh(
  stationId: number,
  isCompleted: boolean
): {
  group: THREE.Group;
  bookMesh: THREE.Mesh;
} {
  const group = new THREE.Group();
  group.name = `guide_npc_${stationId}`;

  const robeColor = isCompleted ? 0x15803d : 0x0f766e;
  const robeMat = new THREE.MeshStandardMaterial({ color: robeColor, roughness: 0.78 });
  const sashMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4, metalness: 0.3 });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xe6b88a, roughness: 0.65 });
  const headwearMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });

  // Robe Body
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.38, 1.30, 14), robeMat);
  body.position.y = 0.65;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Golden Sash
  const sash = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.30, 0.16, 14), sashMat);
  sash.position.y = 0.85;
  group.add(sash);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.21, 16, 16), skinMat);
  head.position.y = 1.50;
  head.castShadow = true;
  group.add(head);

  // Eyes & Friendly Smile
  const eyeGeo = new THREE.SphereGeometry(0.025, 8, 8);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
  [-0.065, 0.065].forEach(ex => {
    const eye = new THREE.Mesh(eyeGeo, eyeMat);
    eye.position.set(ex, 1.52, 0.185);
    group.add(eye);
  });

  // Short neat beard & Scholarly Kufi Cap
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.21, 0.16, 14), headwearMat);
  cap.position.y = 1.65;
  group.add(cap);

  // Floating Golden Activity Book / Scroll in front of the Guide
  const bookGeo = new THREE.BoxGeometry(0.34, 0.24, 0.06);
  const bookMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xd97706,
    emissiveIntensity: 0.45,
    metalness: 0.5,
    roughness: 0.3
  });
  const bookMesh = new THREE.Mesh(bookGeo, bookMat);
  bookMesh.position.set(0, 1.15, 0.38);
  bookMesh.rotation.x = -0.35;
  group.add(bookMesh);

  group.traverse(child => {
    child.userData = {
      interactType: 'guide',
      stationId
    };
  });

  return { group, bookMesh };
}

/**
 * Spawns all 3D Event Stations (each containing both the Ak Sakallı Yaşlı Tarih Anlatıcısı
 * and the Soru Rehber Karakteri) plus directional golden ground markers leading to the active station.
 */
export function buildStationsAndGuidePath3D(
  stations: EventStationData[],
  completedStationIds: number[],
  getGroundHeight: (x: number, z: number) => number
): {
  containerGroup: THREE.Group;
  stationInstances: Station3DInstance[];
  pathMarkers: THREE.Mesh[];
  updateStations: (delta: number, playerPos: THREE.Vector3) => void;
} {
  const containerGroup = new THREE.Group();
  containerGroup.name = 'year_event_stations_3d';

  const stationInstances: Station3DInstance[] = [];
  const pathMarkers: THREE.Mesh[] = [];

  const defaultPositions: [number, number, number][] = [
    [-6.5, 0.15, -2.5],
    [6.5, 0.15, -4.5],
    [-8.0, 0.15, -12.0],
    [8.5, 0.15, -13.5],
    [0.0, 0.0, 14.0]
  ];

  const publishedStations = stations.filter(s => s.status !== 'draft');

  publishedStations.forEach((st, idx) => {
    const pos3D = st.position3D || defaultPositions[idx % defaultPositions.length];
    const groundY = getGroundHeight(pos3D[0], pos3D[2]);
    const isCompleted = completedStationIds.includes(st.id);
    const isUnlocked =
      idx === 0 || completedStationIds.includes(publishedStations[idx - 1].id);

    const rootGroup = new THREE.Group();
    rootGroup.position.set(pos3D[0], groundY, pos3D[2]);

    // Orient station toward player spawn [0, 0, 8]
    const lookAngle = Math.atan2(0 - pos3D[0], 8 - pos3D[2]);
    rootGroup.rotation.y = lookAngle;

    // Stone Dais Platform under the station
    const daisGeo = new THREE.CylinderGeometry(2.6, 2.85, 0.16, 24);
    const daisMat = new THREE.MeshStandardMaterial({
      color: isCompleted ? 0x14532d : 0x78350f,
      roughness: 0.85
    });
    const dais = new THREE.Mesh(daisGeo, daisMat);
    dais.position.y = 0.08;
    dais.receiveShadow = true;
    rootGroup.add(dais);

    // Glowing Ring around station
    const ringGeo = new THREE.TorusGeometry(2.65, 0.06, 8, 36);
    ringGeo.rotateX(Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: isCompleted ? 0x4ade80 : isUnlocked ? 0xfbbf24 : 0x78716c
    });
    const beaconRing = new THREE.Mesh(ringGeo, ringMat);
    beaconRing.position.y = 0.16;
    rootGroup.add(beaconRing);

    // 1. Ak Sakallı Yaşlı Tarih Anlatıcısı (Positioned on Left of Station Dais: x = -1.15)
    const { group: storytellerGroup, rightArm: storytellerRightArm } = buildStorytellerMesh(st.id);
    storytellerGroup.position.set(-1.15, 0.16, 0.15);
    const storytellerLabel = createOverheadLabelSprite(
      '🔊 OLAYI DİNLE (SESLİ ANLATIM)',
      st.storytellerName || 'Ak Sakallı Tarih Anlatıcısı',
      'storyteller'
    );
    storytellerLabel.position.set(0, 2.38, 0);
    storytellerLabel.userData = { interactType: 'storyteller', stationId: st.id };
    storytellerGroup.add(storytellerLabel);
    rootGroup.add(storytellerGroup);

    // 2. Soru Rehber Karakteri (Positioned on Right of Station Dais: x = +1.15)
    const { group: guideGroup, bookMesh: guideBookMesh } = buildQuestionGuideMesh(st.id, isCompleted);
    guideGroup.position.set(1.15, 0.16, 0.15);
    const guideTheme = isCompleted
      ? 'guide_completed'
      : isUnlocked
      ? 'guide_active'
      : 'guide_locked';
    const guideBadge = isCompleted
      ? `✓ ${st.id}. OLAY DURAĞI TAMAMLANDI`
      : `❓ ${st.id}. OLAY DURAĞI • ETKİNLİĞE BAŞLA`;
    const guideLabel = createOverheadLabelSprite(guideBadge, st.npc, guideTheme);
    guideLabel.position.set(0, 2.38, 0);
    guideLabel.userData = { interactType: 'guide', stationId: st.id };
    guideGroup.add(guideLabel);
    rootGroup.add(guideGroup);

    containerGroup.add(rootGroup);

    // Compute world positions for accurate proximity detection
    rootGroup.updateMatrixWorld(true);
    const storytellerWorldPos = new THREE.Vector3();
    storytellerGroup.getWorldPosition(storytellerWorldPos);
    const guideWorldPos = new THREE.Vector3();
    guideGroup.getWorldPosition(guideWorldPos);

    stationInstances.push({
      stationId: st.id,
      rootGroup,
      storytellerGroup,
      storytellerRightArm,
      guideGroup,
      guideBookMesh,
      beaconRing,
      storytellerWorldPos,
      guideWorldPos
    });
  });

  // Build Glowing Golden Guide Path Stones from Player Spawn [0, 0, 8] to Active Unlocked Station
  const nextActiveIdx = publishedStations.findIndex(s => !completedStationIds.includes(s.id));
  const targetStationIdx = nextActiveIdx !== -1 ? nextActiveIdx : 0;

  if (publishedStations.length > 0 && stationInstances[targetStationIdx]) {
    const startPt =
      targetStationIdx === 0
        ? new THREE.Vector3(0, 0, 7.2)
        : stationInstances[targetStationIdx - 1].rootGroup.position.clone();
    const endPt = stationInstances[targetStationIdx].rootGroup.position.clone();

    const stepCount = 9;
    const markerGeo = new THREE.CylinderGeometry(0.32, 0.36, 0.06, 16);
    for (let i = 1; i < stepCount; i++) {
      const t = i / stepCount;
      const mx = THREE.MathUtils.lerp(startPt.x, endPt.x, t);
      const mz = THREE.MathUtils.lerp(startPt.z, endPt.z, t);
      const my = getGroundHeight(mx, mz) + 0.04;

      const markerMat = new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        transparent: true,
        opacity: 0.85
      });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.set(mx, my, mz);
      containerGroup.add(marker);
      pathMarkers.push(marker);
    }
  }

  let animClock = 0;
  function updateStations(delta: number, playerPos: THREE.Vector3) {
    animClock += delta;

    stationInstances.forEach((inst, idx) => {
      // Gentle floating book animation on the Question Guide NPC
      inst.guideBookMesh.position.y = 1.15 + Math.sin(animClock * 2.6 + idx) * 0.06;
      inst.beaconRing.rotation.z += delta * 0.5;

      // Storyteller gentle greeting wave when player approaches within 5.5m
      const distToStoryteller = playerPos.distanceTo(inst.storytellerWorldPos);
      if (distToStoryteller < 5.5) {
        inst.storytellerRightArm.rotation.x = -0.85 + Math.sin(animClock * 5.0) * 0.28;
        inst.storytellerRightArm.rotation.z = 0.25 + Math.cos(animClock * 5.0) * 0.15;
      } else {
        inst.storytellerRightArm.rotation.x = THREE.MathUtils.lerp(
          inst.storytellerRightArm.rotation.x,
          0,
          delta * 5
        );
        inst.storytellerRightArm.rotation.z = THREE.MathUtils.lerp(
          inst.storytellerRightArm.rotation.z,
          0,
          delta * 5
        );
      }
    });

    // Pulse directional guide stones sequentially toward the active station
    pathMarkers.forEach((m, i) => {
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.45 + 0.45 * Math.sin(animClock * 4.0 - i * 0.6);
      const s = 0.9 + 0.18 * Math.sin(animClock * 4.0 - i * 0.6);
      m.scale.set(s, 1, s);
    });
  }

  return {
    containerGroup,
    stationInstances,
    pathMarkers,
    updateStations
  };
}
