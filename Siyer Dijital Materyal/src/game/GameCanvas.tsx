import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CharacterType, MissionData } from '../types';
import { createCharacterModel, RiggedCharacter } from './CharacterModel';
import { buildHistoricalEnvironment, CollisionBox, EnvironmentResult } from './HistoricalEnvironment';
import { audioSystem } from '../utils/audioSynthesizer';
import { getCurrentGraphicsProfile } from '../utils/graphicsSettings';

interface GameCanvasProps {
  characterType: CharacterType;
  currentYear: number;
  sceneEnvironment?: 'mecca' | 'madinah' | 'hira' | 'sevr' | 'badr' | 'uhud' | 'hudaybiyyah';
  activeMission: MissionData | null;
  isPortalActive: boolean;
  onInteractMission: () => void;
  onEnterPortal: () => void;
  onProximityChange: (nearBeacon: boolean, nearPortal: boolean) => void;
  virtualJoystick: { x: number; y: number };
  isVirtualSprint: boolean;
  isVirtualInteract: boolean;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  characterType,
  currentYear,
  sceneEnvironment,
  activeMission,
  isPortalActive,
  onInteractMission,
  onEnterPortal,
  onProximityChange,
  virtualJoystick,
  isVirtualSprint,
  isVirtualInteract
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<RiggedCharacter | null>(null);
  const environmentRef = useRef<EnvironmentResult | null>(null);

  // Fresh props ref to avoid React closure stale state inside requestAnimationFrame loop
  const propsRef = useRef({
    virtualJoystick,
    isVirtualSprint,
    isVirtualInteract
  });
  propsRef.current = {
    virtualJoystick,
    isVirtualSprint,
    isVirtualInteract
  };

  const callbacksRef = useRef({
    onInteractMission,
    onEnterPortal,
    onProximityChange,
    isPortalActive,
    activeMission
  });
  callbacksRef.current = {
    onInteractMission,
    onEnterPortal,
    onProximityChange,
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
      container.clientWidth / container.clientHeight,
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

    // --- CHARACTER SETUP ---
    const char = createCharacterModel(characterType);
    characterRef.current = char;

    // Ground elevation aware spawn position facing Kaaba (-Z)
    const spawnY = env.getGroundHeight(0, 4);
    const playerPos = new THREE.Vector3(0, spawnY, 4);
    char.group.position.copy(playerPos);
    scene.add(char.group);

    // Initial heading: player faces -Z (toward Kaaba)
    let playerHeading = Math.PI; // Heading in radians

    // Camera follow parameters (Optimized to frame player character, entire Kaaba, and mountains)
    let cameraAngleH = 0; // Horizontal orbit angle (radians, 0 = behind player facing -Z)
    let cameraAngleV = 0.26; // Natural third-person elevation angle
    let cameraDistance = 5.2; // Balanced viewing distance
    const cameraLookAt = new THREE.Vector3(playerPos.x, playerPos.y + 1.55, playerPos.z);

    // Position camera immediately behind player at spawn
    const initCamX = playerPos.x + Math.sin(cameraAngleH) * Math.cos(cameraAngleV) * cameraDistance;
    const initCamY = playerPos.y + Math.sin(cameraAngleV) * cameraDistance + 1.25;
    const initCamZ = playerPos.z + Math.cos(cameraAngleH) * Math.cos(cameraAngleV) * cameraDistance;
    camera.position.set(initCamX, initCamY, initCamZ);
    camera.lookAt(cameraLookAt);

    // Debug hook to inspect scene and character
    (window as any).__debugGame = {
      scene,
      camera,
      char,
      playerPos,
      get cameraAngleH() { return cameraAngleH; },
      set cameraAngleH(v: number) { cameraAngleH = v; },
      get cameraAngleV() { return cameraAngleV; },
      set cameraAngleV(v: number) { cameraAngleV = v; },
      get cameraDistance() { return cameraDistance; },
      set cameraDistance(v: number) { cameraDistance = v; }
    };

    let stepSoundTimer = 0;

    // Ensure container has focus for immediate keyboard input
    container.tabIndex = 0;
    container.focus();

    // --- KEYBOARD LISTENERS ---
    const isTextInputActive = (target: EventTarget | null): boolean => {
      if (!target) return false;
      const el = target as HTMLElement;
      return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTextInputActive(e.target)) return;

      const code = e.code;
      const key = (e.key || '').toLowerCase();

      // Prevent arrow keys and space from scrolling browser page
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
      if (code === 'KeyE' || code === 'Space' || key === 'e' || key === ' ') {
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
      if (code === 'KeyE' || code === 'Space' || key === 'e' || key === ' ') {
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

    // --- OPTIONAL MOUSE CONTROLS (Player can still look around if desired) ---
    let lastMouseX = 0;
    let lastMouseY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      inputsRef.current.isMouseDown = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
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

    const handleMouseUp = () => {
      inputsRef.current.isMouseDown = false;
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

    // Touch look around for mobile right side of screen
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

    // Collision check helper
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

    function handleInteractTrigger() {
      const charPos = char.group.position;
      const beaconPos = env.beaconGroup.position;
      const portalPos = env.portalGroup.position;

      const distToBeacon = Math.sqrt(
        Math.pow(charPos.x - beaconPos.x, 2) + Math.pow(charPos.z - beaconPos.z, 2)
      );

      const distToPortal = Math.sqrt(
        Math.pow(charPos.x - portalPos.x, 2) + Math.pow(charPos.z - portalPos.z, 2)
      );

      if (distToBeacon < 3.2 && callbacksRef.current.activeMission) {
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

    const animate = (now: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Read fresh props from propsRef to avoid any React closure stale state
      const currentProps = propsRef.current;
      const vJoy = currentProps.virtualJoystick;
      const isVirtualSprintActive = currentProps.isVirtualSprint;

      // Camera view vectors in the horizontal XZ plane
      const camForwardX = -Math.sin(cameraAngleH);
      const camForwardZ = -Math.cos(cameraAngleH);
      const camRightX = Math.cos(cameraAngleH);
      const camRightZ = -Math.sin(cameraAngleH);

      // --- INTUITIVE CAMERA-RELATIVE MOVEMENT (UP ARROW ALWAYS MOVES FORWARD!) ---
      let inputFwd = 0;
      let inputSide = 0;

      if (inputsRef.current.forward) inputFwd += 1;
      if (inputsRef.current.backward) inputFwd -= 1;
      if (inputsRef.current.left) inputSide -= 1;
      if (inputsRef.current.right) inputSide += 1;

      // Analog Virtual Joystick input
      if (Math.abs(vJoy.y) > 0.10) {
        inputFwd -= vJoy.y; // Pushing up moves forward
      }
      if (Math.abs(vJoy.x) > 0.10) {
        inputSide += vJoy.x; // Pushing right moves right
      }

      const inputMag = Math.sqrt(inputFwd * inputFwd + inputSide * inputSide);
      const isMoving = inputMag > 0.10;
      // Sprint is active if either Shift is held or on-screen "Koş" button toggle is active
      const isSprinting = (inputsRef.current.sprint || isVirtualSprintActive) && isMoving;

      let animState: 'idle' | 'walk' | 'run' = 'idle';

      if (isMoving) {
        animState = isSprinting ? 'run' : 'walk';

        const normFwd = inputFwd / inputMag;
        const normSide = inputSide / inputMag;

        // Motion direction strictly in camera-relative view space
        const moveDirX = camForwardX * normFwd + camRightX * normSide;
        const moveDirZ = camForwardZ * normFwd + camRightZ * normSide;

        const speed = isSprinting ? 6.4 : 3.5;
        const moveDist = speed * delta * Math.min(1.0, inputMag);

        const stepX = moveDirX * moveDist;
        const stepZ = moveDirZ * moveDist;

        // Slide collision checking against environment obstacles
        const newX = playerPos.x + stepX;
        const newZ = playerPos.z + stepZ;

        if (!checkCollision(newX, playerPos.z, env.collisionBoxes)) {
          playerPos.x = newX;
        }
        if (!checkCollision(playerPos.x, newZ, env.collisionBoxes)) {
          playerPos.z = newZ;
        }

        // Clamp inside sanctuary boundaries
        playerPos.x = Math.max(-42, Math.min(42, playerPos.x));
        playerPos.z = Math.max(-42, Math.min(42, playerPos.z));

        // Smoothly orient character to face movement direction
        const targetHeading = Math.atan2(moveDirX, moveDirZ);
        let headingDiff = targetHeading - playerHeading;
        while (headingDiff > Math.PI) headingDiff -= Math.PI * 2;
        while (headingDiff < -Math.PI) headingDiff += Math.PI * 2;
        playerHeading += headingDiff * Math.min(1, delta * 14);

        // Auto camera follow: Camera smoothly rotates to stay directly behind character
        if (!inputsRef.current.isMouseDown && !isTouching) {
          let desiredCameraAngleH = playerHeading - Math.PI;
          let angleDiff = desiredCameraAngleH - cameraAngleH;
          while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
          while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
          cameraAngleH += angleDiff * Math.min(1, delta * 3.8);
        }

        // Footstep sounds
        stepSoundTimer += delta * (isSprinting ? 9.6 : 5.4);
        if (stepSoundTimer > 2.0) {
          stepSoundTimer = 0;
          audioSystem.playFootstep(isSprinting);
        }
      }

      // Ground height tracking: ensure feet ALWAYS stay firmly on the ground without sinking
      playerPos.y = env.getGroundHeight(playerPos.x, playerPos.z);

      // Update character position and animation
      char.group.position.copy(playerPos);
      char.updateAnimation(delta, animState, playerHeading);

      // 3. AUTOMATIC CAMERA ROTATION & TRACKING
      // When moving, camera smoothly catches up behind the character without requiring mouse interaction!
      // When stationary (idle), players can freely look around and admire their character's face and world.
      if ((window as any).__forceFrontView) {
        cameraAngleH = playerHeading; // Directly facing front of character
      } else if (isMoving && !inputsRef.current.isMouseDown && !isTouching) {
        let desiredCameraAngleH = playerHeading - Math.PI;
        while (desiredCameraAngleH > Math.PI) desiredCameraAngleH -= Math.PI * 2;
        while (desiredCameraAngleH < -Math.PI) desiredCameraAngleH += Math.PI * 2;

        let angleDiff = desiredCameraAngleH - cameraAngleH;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        cameraAngleH += angleDiff * Math.min(1, delta * 4.5);
      }

      const desiredCameraX = playerPos.x + Math.sin(cameraAngleH) * Math.cos(cameraAngleV) * cameraDistance;
      const desiredCameraY = playerPos.y + Math.sin(cameraAngleV) * cameraDistance + 1.25;
      const desiredCameraZ = playerPos.z + Math.cos(cameraAngleH) * Math.cos(cameraAngleV) * cameraDistance;

      camera.position.lerp(new THREE.Vector3(desiredCameraX, desiredCameraY, desiredCameraZ), 0.16);

      cameraLookAt.copy(playerPos);
      cameraLookAt.y += 1.55;
      camera.lookAt(cameraLookAt);

      // Update Environment animations (portal vortex, beacon pulse, lanterns)
      env.updateEnvironment(delta, callbacksRef.current.isPortalActive);

      // Proximity checks for UI prompts
      const beaconPos = env.beaconGroup.position;
      const portalPos = env.portalGroup.position;

      const distToBeacon = Math.sqrt(
        Math.pow(playerPos.x - beaconPos.x, 2) + Math.pow(playerPos.z - beaconPos.z, 2)
      );
      const distToPortal = Math.sqrt(
        Math.pow(playerPos.x - portalPos.x, 2) + Math.pow(playerPos.z - portalPos.z, 2)
      );

      const nearBeacon = distToBeacon < 3.2;
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
      camera.aspect = container.clientWidth / container.clientHeight;
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
  }, [characterType, currentYear, sceneEnvironment]);

  useEffect(() => {
    if (environmentRef.current && activeMission) {
      environmentRef.current.setBeaconPosition(activeMission.targetPosition);
    }
  }, [activeMission]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-grab active:cursor-grabbing overflow-hidden focus:outline-none"
    />
  );
};
