import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CharacterType, EventStationData, MissionData } from '../types';
import { createCharacterModel, RiggedCharacter } from './CharacterModel';
import { buildHistoricalEnvironment, CollisionBox, EnvironmentResult } from './HistoricalEnvironment';
import { buildStationsAndGuidePath3D, Station3DInstance } from './StationNPCModels';
import { audioSystem } from '../utils/audioSynthesizer';
import { getCurrentGraphicsProfile } from '../utils/graphicsSettings';

export interface NearbyStationPrompt {
  stationId: number;
  targetType: 'storyteller' | 'guide';
  distance: number;
}

interface GameCanvasProps {
  characterType: CharacterType;
  currentYear: number;
  sceneEnvironment?: 'mecca' | 'madinah' | 'hira' | 'sevr' | 'badr' | 'uhud' | 'hudaybiyyah';
  activeMission: MissionData | null;
  eventStations?: EventStationData[];
  completedStationIds?: number[];
  isPortalActive: boolean;
  isPaused?: boolean;
  teleportTarget?: { stationId: number; tick: number } | null;
  onInteractMission: () => void;
  onInteractStoryteller?: (stationId: number) => void;
  onInteractGuide?: (stationId: number) => void;
  onEnterPortal: () => void;
  onProximityChange: (nearBeacon: boolean, nearPortal: boolean) => void;
  onStationProximityChange?: (nearby: NearbyStationPrompt | null) => void;
  virtualJoystick: { x: number; y: number };
  isVirtualSprint: boolean;
  isVirtualInteract: boolean;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  characterType,
  currentYear,
  sceneEnvironment,
  activeMission,
  eventStations = [],
  completedStationIds = [],
  isPortalActive,
  isPaused = false,
  teleportTarget = null,
  onInteractMission,
  onInteractStoryteller,
  onInteractGuide,
  onEnterPortal,
  onProximityChange,
  onStationProximityChange,
  virtualJoystick,
  isVirtualSprint,
  isVirtualInteract
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<RiggedCharacter | null>(null);
  const environmentRef = useRef<EnvironmentResult | null>(null);
  const stationInstancesRef = useRef<Station3DInstance[]>([]);
  const playerPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 6));

  // Fresh props ref to avoid React closure stale state inside requestAnimationFrame loop
  const propsRef = useRef({
    virtualJoystick,
    isVirtualSprint,
    isVirtualInteract,
    isPaused
  });
  propsRef.current = {
    virtualJoystick,
    isVirtualSprint,
    isVirtualInteract,
    isPaused
  };

  const callbacksRef = useRef({
    onInteractMission,
    onInteractStoryteller,
    onInteractGuide,
    onEnterPortal,
    onProximityChange,
    onStationProximityChange,
    isPortalActive,
    activeMission
  });
  callbacksRef.current = {
    onInteractMission,
    onInteractStoryteller,
    onInteractGuide,
    onEnterPortal,
    onProximityChange,
    onStationProximityChange,
    isPortalActive,
    activeMission
  };

  const inputsRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
    interact: false,
    isMouseDown: false
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const profile = getCurrentGraphicsProfile();

    // --- THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xd7c49e); // Warm golden desert sky
    scene.fog = new THREE.Fog(0xd7c49e, 65, Math.min(250, profile.viewDistance));

    const camera = new THREE.PerspectiveCamera(
      52,
      Math.max(1, container.clientWidth) / Math.max(1, container.clientHeight),
      0.25,
      profile.viewDistance
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: profile.antialias,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(profile.pixelRatio);
    renderer.shadowMap.enabled = profile.shadowsEnabled;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xfffaec, 0.95);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff5e0, 1.4);
    sunLight.position.set(45, 65, 35);
    if (profile.shadowsEnabled) {
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = profile.shadowMapSize;
      sunLight.shadow.mapSize.height = profile.shadowMapSize;
      sunLight.shadow.camera.near = 10;
      sunLight.shadow.camera.far = 180;
      sunLight.shadow.camera.left = -45;
      sunLight.shadow.camera.right = 45;
      sunLight.shadow.camera.top = 45;
      sunLight.shadow.camera.bottom = -45;
      sunLight.shadow.bias = -0.0001;
      sunLight.shadow.normalBias = 0.045;
    } else {
      sunLight.castShadow = false;
    }
    scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0xfff2d4, 0x8a5d3b, 0.65);
    scene.add(hemiLight);

    // --- ENVIRONMENT ---
    const env = buildHistoricalEnvironment(sceneEnvironment || 'mecca');
    environmentRef.current = env;
    scene.add(env.sceneGroup);

    if (activeMission) {
      env.setBeaconPosition(activeMission.targetPosition);
    }

    // --- 3D EVENT STATIONS (AK SAKALLI TARİH ANLATICISI + SORU REHBER KARAKTERİ) ---
    const stations3D = buildStationsAndGuidePath3D(
      eventStations,
      completedStationIds,
      env.getGroundHeight
    );
    scene.add(stations3D.containerGroup);
    stationInstancesRef.current = stations3D.stationInstances;

    // --- CHARACTER SETUP ---
    const char = createCharacterModel(characterType);
    characterRef.current = char;

    // Ground elevation aware spawn position facing Kaaba & Stations (-Z)
    const spawnY = env.getGroundHeight(0, 6);
    const playerPos = new THREE.Vector3(0, spawnY, 6);
    playerPosRef.current = playerPos;
    char.group.position.copy(playerPos);
    scene.add(char.group);

    let playerHeading = Math.PI; // Facing -Z
    let cameraAngleH = 0;
    let cameraAngleV = 0.28;
    let cameraDistance = 5.4;
    const cameraLookAt = new THREE.Vector3(playerPos.x, playerPos.y + 1.55, playerPos.z);

    const initCamX = playerPos.x + Math.sin(cameraAngleH) * Math.cos(cameraAngleV) * cameraDistance;
    const initCamY = playerPos.y + Math.sin(cameraAngleV) * cameraDistance + 1.25;
    const initCamZ = playerPos.z + Math.cos(cameraAngleH) * Math.cos(cameraAngleV) * cameraDistance;
    camera.position.set(initCamX, initCamY, initCamZ);
    camera.lookAt(cameraLookAt);

    (window as any).__debugGame = {
      scene,
      camera,
      char,
      playerPos,
      stations: stations3D.stationInstances
    };

    let stepSoundTimer = 0;

    container.tabIndex = 0;
    container.focus();

    const isTextInputActive = (target: EventTarget | null): boolean => {
      if (!target) return false;
      const el = target as HTMLElement;
      return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTextInputActive(e.target) || propsRef.current.isPaused) return;

      const code = e.code;
      const key = (e.key || '').toLowerCase();

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(code)) {
        e.preventDefault();
      }

      if (code === 'KeyW' || code === 'ArrowUp' || key === 'w' || key === 'arrowup') {
        inputsRef.current.forward = true;
      }
      if (code === 'KeyS' || code === 'ArrowDown' || key === 's' || key === 'arrowdown') {
        inputsRef.current.backward = true;
      }
      if (code === 'KeyA' || code === 'ArrowLeft' || key === 'a' || key === 'arrowleft') {
        inputsRef.current.left = true;
      }
      if (code === 'KeyD' || code === 'ArrowRight' || key === 'd' || key === 'arrowright') {
        inputsRef.current.right = true;
      }
      if (code === 'ShiftLeft' || code === 'ShiftRight' || key === 'shift') {
        inputsRef.current.sprint = true;
      }
      if (code === 'KeyE' || code === 'Space' || code === 'Enter' || key === 'e' || key === ' ') {
        inputsRef.current.interact = true;
        handleInteractTrigger();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const code = e.code;
      const key = (e.key || '').toLowerCase();

      if (code === 'KeyW' || code === 'ArrowUp' || key === 'w' || key === 'arrowup') {
        inputsRef.current.forward = false;
      }
      if (code === 'KeyS' || code === 'ArrowDown' || key === 's' || key === 'arrowdown') {
        inputsRef.current.backward = false;
      }
      if (code === 'KeyA' || code === 'ArrowLeft' || key === 'a' || key === 'arrowleft') {
        inputsRef.current.left = false;
      }
      if (code === 'KeyD' || code === 'ArrowRight' || key === 'd' || key === 'arrowright') {
        inputsRef.current.right = false;
      }
      if (code === 'ShiftLeft' || code === 'ShiftRight' || key === 'shift') {
        inputsRef.current.sprint = false;
      }
      if (code === 'KeyE' || code === 'Space' || code === 'Enter' || key === 'e' || key === ' ') {
        inputsRef.current.interact = false;
      }
    };

    const handleWindowBlur = () => {
      inputsRef.current.forward = false;
      inputsRef.current.backward = false;
      inputsRef.current.left = false;
      inputsRef.current.right = false;
      inputsRef.current.sprint = false;
      inputsRef.current.interact = false;
      inputsRef.current.isMouseDown = false;
    };

    // --- MOUSE & RAYCASTING CLICK SUPPORT ON 3D NPCs ---
    let lastMouseX = 0;
    let lastMouseY = 0;
    let mouseDownStartX = 0;
    let mouseDownStartY = 0;
    const raycaster = new THREE.Raycaster();
    const pointerNDC = new THREE.Vector2();

    const handleMouseDown = (e: MouseEvent) => {
      inputsRef.current.isMouseDown = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      mouseDownStartX = e.clientX;
      mouseDownStartY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!inputsRef.current.isMouseDown) return;
      const deltaX = e.clientX - lastMouseX;
      const deltaY = e.clientY - lastMouseY;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;

      cameraAngleH -= deltaX * 0.005;
      cameraAngleV = Math.max(0.1, Math.min(1.1, cameraAngleV + deltaY * 0.004));
    };

    const handleMouseUp = (e: MouseEvent) => {
      const wasDown = inputsRef.current.isMouseDown;
      inputsRef.current.isMouseDown = false;
      if (!wasDown || propsRef.current.isPaused) return;

      const dragDist = Math.hypot(e.clientX - mouseDownStartX, e.clientY - mouseDownStartY);
      if (dragDist < 8) {
        // Click raycast against 3D Station NPCs
        const rect = renderer.domElement.getBoundingClientRect();
        pointerNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointerNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointerNDC, camera);

        const hits = raycaster.intersectObjects(stations3D.containerGroup.children, true);
        for (const hit of hits) {
          let obj: THREE.Object3D | null = hit.object;
          while (obj) {
            if (obj.userData && obj.userData.interactType && obj.userData.stationId) {
              const stId = Number(obj.userData.stationId);
              const iType = obj.userData.interactType as 'storyteller' | 'guide';

              // Move character near the clicked station & trigger interaction
              const inst = stationInstancesRef.current.find(s => s.stationId === stId);
              if (inst) {
                const targetWorld =
                  iType === 'storyteller' ? inst.storytellerWorldPos : inst.guideWorldPos;
                playerPos.set(targetWorld.x, env.getGroundHeight(targetWorld.x, targetWorld.z + 2.1), targetWorld.z + 2.1);
                char.group.position.copy(playerPos);
              }

              audioSystem.playButtonClick();
              if (iType === 'storyteller') {
                callbacksRef.current.onInteractStoryteller?.(stId);
              } else {
                callbacksRef.current.onInteractGuide?.(stId);
              }
              return;
            }
            obj = obj.parent;
          }
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      cameraDistance = Math.max(2.4, Math.min(8.5, cameraDistance + e.deltaY * 0.003));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleWindowBlur);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: true });

    // Touch look around for mobile / smartboard
    let lastTouchX = 0;
    let lastTouchY = 0;
    let isTouching = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1 && e.touches[0].clientX > window.innerWidth * 0.45) {
        isTouching = true;
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouching || e.touches.length === 0) return;
      const touch = e.touches[0];
      const deltaX = touch.clientX - lastTouchX;
      const deltaY = touch.clientY - lastTouchY;
      lastTouchX = touch.clientX;
      lastTouchY = touch.clientY;

      cameraAngleH -= deltaX * 0.007;
      cameraAngleV = Math.max(0.1, Math.min(1.1, cameraAngleV + deltaY * 0.005));
    };

    const handleTouchEnd = () => {
      isTouching = false;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd);

    function checkCollision(x: number, z: number, colliders: CollisionBox[]): boolean {
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

    function findNearestStationTarget(pos: THREE.Vector3): NearbyStationPrompt | null {
      let best: NearbyStationPrompt | null = null;
      for (const inst of stationInstancesRef.current) {
        const dStory = Math.hypot(
          pos.x - inst.storytellerWorldPos.x,
          pos.z - inst.storytellerWorldPos.z
        );
        if (dStory < 3.6 && (!best || dStory < best.distance)) {
          best = { stationId: inst.stationId, targetType: 'storyteller', distance: dStory };
        }
        const dGuide = Math.hypot(
          pos.x - inst.guideWorldPos.x,
          pos.z - inst.guideWorldPos.z
        );
        if (dGuide < 3.6 && (!best || dGuide < best.distance)) {
          best = { stationId: inst.stationId, targetType: 'guide', distance: dGuide };
        }
      }
      return best;
    }

    function handleInteractTrigger() {
      const charPos = char.group.position;

      // 1. Check proximity to any 3D Station NPC (Storyteller or Question Guide)
      const nearestNPC = findNearestStationTarget(charPos);
      if (nearestNPC) {
        audioSystem.playButtonClick();
        char.updateAnimation(0, 'think');
        if (nearestNPC.targetType === 'storyteller') {
          callbacksRef.current.onInteractStoryteller?.(nearestNPC.stationId);
        } else {
          callbacksRef.current.onInteractGuide?.(nearestNPC.stationId);
        }
        return;
      }

      // 2. Legacy Beacon & Portal fallback
      const beaconPos = env.beaconGroup.position;
      const portalPos = env.portalGroup.position;

      const distToBeacon = Math.hypot(charPos.x - beaconPos.x, charPos.z - beaconPos.z);
      const distToPortal = Math.hypot(charPos.x - portalPos.x, charPos.z - portalPos.z);

      if (distToBeacon < 3.4 && callbacksRef.current.activeMission) {
        audioSystem.playButtonClick();
        char.updateAnimation(0, 'think');
        callbacksRef.current.onInteractMission();
        return;
      }

      if (distToPortal < 3.8 && callbacksRef.current.isPortalActive) {
        audioSystem.playPortalWarp();
        char.updateAnimation(0, 'portal');
        callbacksRef.current.onEnterPortal();
      }
    }

    // --- ANIMATION & PHYSICS LOOP ---
    let animationFrameId: number;
    let lastTime = performance.now();
    let lastReportedKey = '';

    const animate = (now: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const currentProps = propsRef.current;

      // Pause heavy 3D updates while a video/question modal is open to save CPU/GPU
      if (currentProps.isPaused) {
        return;
      }

      const vJoy = currentProps.virtualJoystick;
      const isVirtualSprintActive = currentProps.isVirtualSprint;

      const camForwardX = -Math.sin(cameraAngleH);
      const camForwardZ = -Math.cos(cameraAngleH);
      const camRightX = Math.cos(cameraAngleH);
      const camRightZ = -Math.sin(cameraAngleH);

      let inputFwd = 0;
      let inputSide = 0;

      if (inputsRef.current.forward) inputFwd += 1;
      if (inputsRef.current.backward) inputFwd -= 1;
      if (inputsRef.current.left) inputSide -= 1;
      if (inputsRef.current.right) inputSide += 1;

      if (Math.abs(vJoy.y) > 0.1) {
        inputFwd -= vJoy.y;
      }
      if (Math.abs(vJoy.x) > 0.1) {
        inputSide += vJoy.x;
      }

      const inputMag = Math.sqrt(inputFwd * inputFwd + inputSide * inputSide);
      const isMoving = inputMag > 0.1;
      const isSprinting = (inputsRef.current.sprint || isVirtualSprintActive) && isMoving;

      let animState: 'idle' | 'walk' | 'run' = 'idle';

      if (isMoving) {
        animState = isSprinting ? 'run' : 'walk';

        const normFwd = inputFwd / inputMag;
        const normSide = inputSide / inputMag;

        const moveDirX = camForwardX * normFwd + camRightX * normSide;
        const moveDirZ = camForwardZ * normFwd + camRightZ * normSide;

        const speed = isSprinting ? 6.6 : 3.8;
        const moveDist = speed * delta * Math.min(1.0, inputMag);

        const stepX = moveDirX * moveDist;
        const stepZ = moveDirZ * moveDist;

        const newX = playerPos.x + stepX;
        const newZ = playerPos.z + stepZ;

        if (!checkCollision(newX, playerPos.z, env.collisionBoxes)) {
          playerPos.x = newX;
        }
        if (!checkCollision(playerPos.x, newZ, env.collisionBoxes)) {
          playerPos.z = newZ;
        }

        playerPos.x = Math.max(-42, Math.min(42, playerPos.x));
        playerPos.z = Math.max(-42, Math.min(42, playerPos.z));

        const targetHeading = Math.atan2(moveDirX, moveDirZ);
        let headingDiff = targetHeading - playerHeading;
        while (headingDiff > Math.PI) headingDiff -= Math.PI * 2;
        while (headingDiff < -Math.PI) headingDiff += Math.PI * 2;
        playerHeading += headingDiff * Math.min(1, delta * 14);

        if (!inputsRef.current.isMouseDown && !isTouching) {
          let desiredCameraAngleH = playerHeading - Math.PI;
          let angleDiff = desiredCameraAngleH - cameraAngleH;
          while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
          while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
          cameraAngleH += angleDiff * Math.min(1, delta * 3.8);
        }

        stepSoundTimer += delta * (isSprinting ? 9.6 : 5.4);
        if (stepSoundTimer > 2.0) {
          stepSoundTimer = 0;
          audioSystem.playFootstep(isSprinting);
        }
      }

      playerPos.y = env.getGroundHeight(playerPos.x, playerPos.z);

      char.group.position.copy(playerPos);
      char.updateAnimation(delta, animState, playerHeading);

      const desiredCameraX = playerPos.x + Math.sin(cameraAngleH) * Math.cos(cameraAngleV) * cameraDistance;
      const desiredCameraY = playerPos.y + Math.sin(cameraAngleV) * cameraDistance + 1.25;
      const desiredCameraZ = playerPos.z + Math.cos(cameraAngleH) * Math.cos(cameraAngleV) * cameraDistance;

      camera.position.lerp(new THREE.Vector3(desiredCameraX, desiredCameraY, desiredCameraZ), 0.16);

      cameraLookAt.copy(playerPos);
      cameraLookAt.y += 1.55;
      camera.lookAt(cameraLookAt);

      // Update Environment & 3D Stations (Storyteller greeting wave, floating books, path stones)
      env.updateEnvironment(delta, callbacksRef.current.isPortalActive);
      stations3D.updateStations(delta, playerPos);

      // Station NPC proximity check
      const nearestNPC = findNearestStationTarget(playerPos);
      const nextKey = nearestNPC ? `${nearestNPC.stationId}_${nearestNPC.targetType}` : '';
      if (nextKey !== lastReportedKey) {
        lastReportedKey = nextKey;
        callbacksRef.current.onStationProximityChange?.(nearestNPC);
      }

      // Beacon & Portal proximity check
      const beaconPos = env.beaconGroup.position;
      const portalPos = env.portalGroup.position;
      const distToBeacon = Math.hypot(playerPos.x - beaconPos.x, playerPos.z - beaconPos.z);
      const distToPortal = Math.hypot(playerPos.x - portalPos.x, playerPos.z - portalPos.z);

      const nearBeacon = distToBeacon < 3.4 || Boolean(nearestNPC);
      const nearPortal = distToPortal < 3.8 && callbacksRef.current.isPortalActive;
      callbacksRef.current.onProximityChange(nearBeacon, nearPortal);

      if (currentProps.isVirtualInteract) {
        handleInteractTrigger();
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = Math.max(1, container.clientWidth) / Math.max(1, container.clientHeight);
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleWindowBlur);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);

      // Deep dispose scene objects to prevent memory leaks when switching years
      scene.traverse(obj => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(m => {
              if ((m as any).map) (m as any).map.dispose();
              m.dispose();
            });
          } else if (mesh.material) {
            if ((mesh.material as any).map) (mesh.material as any).map.dispose();
            mesh.material.dispose();
          }
        }
      });
      scene.clear();

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [characterType, currentYear, sceneEnvironment, eventStations, completedStationIds]);

  // Teleport character directly in front of a requested station when triggered from the HUD
  useEffect(() => {
    if (!teleportTarget || !environmentRef.current || !characterRef.current) return;
    const inst = stationInstancesRef.current.find(s => s.stationId === teleportTarget.stationId);
    if (!inst) return;

    const rootPos = inst.rootGroup.position;
    const targetX = rootPos.x;
    const targetZ = rootPos.z + 2.6;
    const targetY = environmentRef.current.getGroundHeight(targetX, targetZ);

    playerPosRef.current.set(targetX, targetY, targetZ);
    characterRef.current.group.position.copy(playerPosRef.current);
  }, [teleportTarget]);

  useEffect(() => {
    if (environmentRef.current && activeMission) {
      environmentRef.current.setBeaconPosition(activeMission.targetPosition);
    }
  }, [activeMission]);

  return (
    <div
      ref={containerRef}
      id="historical-3d-canvas-container"
      className="relative w-full h-full cursor-grab active:cursor-grabbing overflow-hidden focus:outline-none"
    />
  );
};
