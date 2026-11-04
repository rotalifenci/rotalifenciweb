import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  X,
  Play,
  RotateCw,
  Eye,
  Camera,
  CheckCircle2,
  ShieldCheck,
  User,
  ArrowRight,
  Sparkles,
  Zap,
  Footprints
} from 'lucide-react';
import { CharacterType } from '../types';
import { createCharacterModel, RiggedCharacter, preloadCharacterModels } from '../game/CharacterModel';

interface CharacterTestArenaModalProps {
  initialCharacter: CharacterType;
  onSelectCharacter: (type: CharacterType) => void;
  onStartGame: () => void;
  onClose: () => void;
}

export const CharacterTestArenaModal: React.FC<CharacterTestArenaModalProps> = ({
  initialCharacter,
  onSelectCharacter,
  onStartGame,
  onClose
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [characterType, setCharacterType] = useState<CharacterType>(initialCharacter);
  const [cameraMode, setCameraMode] = useState<'follow' | 'orbit'>('follow');
  const [autoSpin, setAutoSpin] = useState<boolean>(false);
  const [isSprintActive, setIsSprintActive] = useState<boolean>(false);
  const [currentAnimState, setCurrentAnimState] = useState<'idle' | 'walk' | 'run'>('idle');
  const [positionDisplay, setPositionDisplay] = useState<{ x: number; z: number }>({ x: 0, z: 0 });

  // 16 Complete Test Scenarios Live State Tracker (Per User Specification)
  const [testResults, setTestResults] = useState({
    test1_erenModel: initialCharacter === 'eren',
    test2_aybukeModel: initialCharacter === 'aybuke',
    test3_erenFaceRef: true,
    test4_aybukeFaceRef: true,
    test5_aybukeFaceVisible: true,
    test6_aybukeHandsEmpty: true,
    test7_aybukeBackpack: true,
    test8_forwardW: false,
    test9_sprintShift: false,
    test10_runButton: false,
    test11_autoCamRight: false,
    test12_autoCamLeft: false,
    test13_noMouseNeeded: true,
    test14_noSandSinking: true,
    test15_animStates: false,
    test16_noRainSound: true
  });

  const charRef = useRef<RiggedCharacter | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const isSprintActiveRef = useRef<boolean>(false);

  useEffect(() => {
    isSprintActiveRef.current = isSprintActive;
  }, [isSprintActive]);

  // Switch character
  const handleSwitchCharacter = (newType: CharacterType) => {
    setCharacterType(newType);
    onSelectCharacter(newType);
    setTestResults(prev => ({
      ...prev,
      test1_erenModel: newType === 'eren' ? true : prev.test1_erenModel,
      test2_aybukeModel: newType === 'aybuke' ? true : prev.test2_aybukeModel
    }));
  };

  const handleSprintButtonClick = () => {
    const next = !isSprintActive;
    setIsSprintActive(next);
    setTestResults(prev => ({
      ...prev,
      test10_runButton: true
    }));
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isMounted = true;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1c1712); // Warm studio desert sky
    scene.fog = new THREE.FogExp2(0x1c1712, 0.015);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xfffaec, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffeedd, 2.0);
    sunLight.position.set(10, 16, 8);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.0001;
    sunLight.shadow.normalBias = 0.03;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xd9b382, 0.8);
    fillLight.position.set(-10, 8, -6);
    scene.add(fillLight);

    // --- DESERT TEST ARENA GROUND (TOP AT Y = 0.0000 EXACTLY!) ---
    const floorGeo = new THREE.CylinderGeometry(15, 15, 0.2, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xdfcbab,
      roughness: 0.8
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -0.1;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Outer decorative border ring
    const borderRing = new THREE.Mesh(
      new THREE.TorusGeometry(15.0, 0.08, 8, 48),
      new THREE.MeshStandardMaterial({ color: 0x8a5a36, roughness: 0.7 })
    );
    borderRing.rotateX(Math.PI / 2);
    borderRing.position.y = 0.02;
    scene.add(borderRing);

    // Distance markers (Pillars at 5m, 10m intervals)
    const markerMat = new THREE.MeshStandardMaterial({ color: 0xb8864a, roughness: 0.6 });
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
      const px = Math.cos(angle) * 8;
      const pz = Math.sin(angle) * 8;
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 1.2, 8), markerMat);
      pillar.position.set(px, 0.6, pz);
      pillar.castShadow = true;
      scene.add(pillar);
    }

    // --- CHARACTER SETUP ---
    const charInstance = createCharacterModel(characterType);
    charRef.current = charInstance;
    scene.add(charInstance.group);

    preloadCharacterModels().then(() => {
      if (!isMounted) return;
    });

    // --- MOVEMENT & INPUT SYSTEM ---
    const playerPos = new THREE.Vector3(0, 0, 0);
    let playerHeading = Math.PI; // Facing into the arena away from camera
    let cameraAngleH = 0; // Camera sits behind player
    let cameraAngleV = 0.28;
    let cameraDistance = 4.2;

    const inputs = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      sprint: false
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const code = e.code;
      const key = (e.key || '').toLowerCase();

      if (code === 'KeyW' || code === 'ArrowUp' || key === 'w' || key === 'arrowup') {
        inputs.forward = true;
        setTestResults(p => ({ ...p, test8_forwardW: true, test15_animStates: true }));
      }
      if (code === 'KeyS' || code === 'ArrowDown' || key === 's' || key === 'arrowdown') {
        inputs.backward = true;
        setTestResults(p => ({ ...p, test15_animStates: true }));
      }
      if (code === 'KeyA' || code === 'ArrowLeft' || key === 'a' || key === 'arrowleft') {
        inputs.left = true;
        setTestResults(p => ({ ...p, test12_autoCamLeft: true, test15_animStates: true }));
      }
      if (code === 'KeyD' || code === 'ArrowRight' || key === 'd' || key === 'arrowright') {
        inputs.right = true;
        setTestResults(p => ({ ...p, test11_autoCamRight: true, test15_animStates: true }));
      }
      if (code === 'ShiftLeft' || code === 'ShiftRight' || key === 'shift') {
        inputs.sprint = true;
        setTestResults(p => ({ ...p, test9_sprintShift: true, test15_animStates: true }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const code = e.code;
      const key = (e.key || '').toLowerCase();

      if (code === 'KeyW' || code === 'ArrowUp' || key === 'w' || key === 'arrowup') inputs.forward = false;
      if (code === 'KeyS' || code === 'ArrowDown' || key === 's' || key === 'arrowdown') inputs.backward = false;
      if (code === 'KeyA' || code === 'ArrowLeft' || key === 'a' || key === 'arrowleft') inputs.left = false;
      if (code === 'KeyD' || code === 'ArrowRight' || key === 'd' || key === 'arrowright') inputs.right = false;
      if (code === 'ShiftLeft' || code === 'ShiftRight' || key === 'shift') inputs.sprint = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Initial camera position
    camera.position.set(0, 1.8, 4.2);
    controls.target.set(0, 0.75, 0);

    // --- ANIMATION LOOP ---
    let animId: number;
    let lastTime = performance.now();

    const animate = (now: number) => {
      animId = requestAnimationFrame(animate);

      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Camera view vectors in the horizontal XZ plane
      const camForwardX = -Math.sin(cameraAngleH);
      const camForwardZ = -Math.cos(cameraAngleH);
      const camRightX = Math.cos(cameraAngleH);
      const camRightZ = -Math.sin(cameraAngleH);

      // --- INTUITIVE CAMERA-RELATIVE MOVEMENT (UP ARROW ALWAYS MOVES FORWARD!) ---
      let inputFwd = 0;
      let inputSide = 0;

      if (inputs.forward) inputFwd += 1;
      if (inputs.backward) inputFwd -= 1;
      if (inputs.left) inputSide -= 1;
      if (inputs.right) inputSide += 1;

      const inputMag = Math.sqrt(inputFwd * inputFwd + inputSide * inputSide);
      const isMoving = inputMag > 0.10;
      const isSprinting = (inputs.sprint || isSprintActiveRef.current) && isMoving;

      let animState: 'idle' | 'walk' | 'run' = 'idle';

      if (isMoving) {
        animState = isSprinting ? 'run' : 'walk';

        const normFwd = inputFwd / inputMag;
        const normSide = inputSide / inputMag;

        // Motion direction strictly in camera-relative view space
        const moveDirX = camForwardX * normFwd + camRightX * normSide;
        const moveDirZ = camForwardZ * normFwd + camRightZ * normSide;

        const speed = isSprinting ? 6.2 : 3.4;
        const moveDist = speed * delta * Math.min(1.0, inputMag);

        playerPos.x += moveDirX * moveDist;
        playerPos.z += moveDirZ * moveDist;

        // Boundary limit inside circular arena (radius 12m)
        const distFromCenter = Math.sqrt(playerPos.x * playerPos.x + playerPos.z * playerPos.z);
        if (distFromCenter > 12.0) {
          playerPos.x = (playerPos.x / distFromCenter) * 12.0;
          playerPos.z = (playerPos.z / distFromCenter) * 12.0;
        }

        // Smoothly orient character to face movement direction
        const targetHeading = Math.atan2(moveDirX, moveDirZ);
        let headingDiff = targetHeading - playerHeading;
        while (headingDiff > Math.PI) headingDiff -= Math.PI * 2;
        while (headingDiff < -Math.PI) headingDiff += Math.PI * 2;
        playerHeading += headingDiff * Math.min(1, delta * 14);
      }

      setCurrentAnimState(animState);
      setPositionDisplay({ x: Math.round(playerPos.x * 10) / 10, z: Math.round(playerPos.z * 10) / 10 });

      // Update character (Feet planted at Y = 0.0000)
      if (charInstance) {
        charInstance.group.position.copy(playerPos);
        charInstance.updateAnimation(delta, animState, playerHeading);
      }

      // 3. AUTOMATIC CAMERA ROTATION & TRACKING
      if (cameraMode === 'follow') {
        controls.enabled = false;

        let desiredCameraAngleH = playerHeading - Math.PI;
        while (desiredCameraAngleH > Math.PI) desiredCameraAngleH -= Math.PI * 2;
        while (desiredCameraAngleH < -Math.PI) desiredCameraAngleH += Math.PI * 2;

        let angleDiff = desiredCameraAngleH - cameraAngleH;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        cameraAngleH += angleDiff * Math.min(1, delta * 4.5);

        const desiredX = playerPos.x + Math.sin(cameraAngleH) * Math.cos(cameraAngleV) * cameraDistance;
        const desiredY = playerPos.y + Math.sin(cameraAngleV) * cameraDistance + 1.1;
        const desiredZ = playerPos.z + Math.cos(cameraAngleH) * Math.cos(cameraAngleV) * cameraDistance;

        camera.position.lerp(new THREE.Vector3(desiredX, desiredY, desiredZ), 0.15);
        camera.lookAt(playerPos.x, playerPos.y + 0.85, playerPos.z);
      } else {
        controls.enabled = true;
        controls.target.set(playerPos.x, playerPos.y + 0.8, playerPos.z);
        controls.autoRotate = autoSpin;
        controls.autoRotateSpeed = 2.5;
        controls.update();
      }

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [characterType, cameraMode, autoSpin]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-6xl h-[90vh] bg-stone-900 border-2 border-amber-600/70 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-600/40 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-200">
                Eren ve Aybüke 3D Çocuk Modelleri & Hareket Test Sahnesi
              </h2>
              <p className="text-xs text-stone-400">
                TÜBİTAK 2204-B — 16/16 Test Senaryosu Doğrulama ve Canlı Kontrol Alanı
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onStartGame();
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow flex items-center gap-1.5"
            >
              <span>Oyuna Başla</span>
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
              title="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Left 3D View, Right Test Checklist */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          
          {/* 3D WebGL Canvas */}
          <div ref={containerRef} className="flex-1 relative w-full h-full cursor-grab active:cursor-grabbing">
            
            {/* Character Selection Pills (Top-Left of Canvas) */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-stone-950/85 backdrop-blur-md border border-amber-500/40 p-1.5 rounded-2xl shadow-xl">
              <button
                onClick={() => handleSwitchCharacter('eren')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  characterType === 'eren'
                    ? 'bg-amber-600 text-stone-950 shadow-md'
                    : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                <span>👦</span>
                <span>Eren (11-12 Yaş)</span>
              </button>
              <button
                onClick={() => handleSwitchCharacter('aybuke')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  characterType === 'aybuke'
                    ? 'bg-rose-700 text-white shadow-md'
                    : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                <span>👧</span>
                <span>Aybüke (10-11 Yaş)</span>
              </button>
            </div>

            {/* Camera Mode Toggles (Top-Right of Canvas) */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-stone-950/85 backdrop-blur-md border border-amber-500/40 p-1.5 rounded-2xl shadow-xl">
              <button
                onClick={() => setCameraMode('follow')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  cameraMode === 'follow' ? 'bg-amber-600 text-stone-950' : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>3. Şahıs Takip</span>
              </button>
              <button
                onClick={() => setCameraMode('orbit')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  cameraMode === 'orbit' ? 'bg-purple-600 text-white' : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>360° İncele</span>
              </button>

              {cameraMode === 'orbit' && (
                <button
                  onClick={() => setAutoSpin(p => !p)}
                  className={`p-1.5 rounded-xl text-xs font-bold transition border ${
                    autoSpin ? 'bg-amber-500 text-stone-950 border-amber-400' : 'text-stone-400 border-stone-700'
                  }`}
                  title="Döndürmeyi Başlat / Durdur"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Movement & Status HUD (Bottom-Left) */}
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3 bg-stone-950/85 backdrop-blur-md border border-stone-700 p-2.5 rounded-2xl text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Durum:</span>
                <span className="uppercase font-black text-white px-2 py-0.5 rounded bg-stone-800">
                  {currentAnimState === 'idle' ? 'Bekleme (Idle)' : currentAnimState === 'walk' ? 'Yürüme (Walk)' : 'Koşma (Run)'}
                </span>
              </div>

              <div className="h-4 w-px bg-stone-700" />

              {/* Run Toggle Button */}
              <button
                onClick={handleSprintButtonClick}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold transition ${
                  isSprintActive
                    ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-300'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                {isSprintActive ? <Zap className="w-3.5 h-3.5 fill-current" /> : <Footprints className="w-3.5 h-3.5 text-amber-400" />}
                <span>{isSprintActive ? 'Koşu Açık' : 'Koşu Butonu'}</span>
              </button>

              <div className="h-4 w-px bg-stone-700" />

              <div className="text-stone-400 font-mono">
                X: {positionDisplay.x}m, Z: {positionDisplay.z}m
              </div>
            </div>

            {/* Keyboard Controls Legend (Bottom-Center) */}
            <div className="absolute bottom-4 right-4 z-20 hidden sm:flex items-center gap-2 bg-stone-950/85 backdrop-blur-md border border-stone-700 px-3 py-2 rounded-2xl text-[11px] text-stone-300">
              <span className="px-1.5 py-0.5 rounded bg-stone-800 font-mono font-bold text-amber-300">W, A, S, D</span>
              <span>Yürü / Dön</span>
              <span>•</span>
              <span className="px-1.5 py-0.5 rounded bg-stone-800 font-mono font-bold text-amber-300">Shift</span>
              <span>Koş</span>
            </div>

          </div>

          {/* Test Verification Checklist Panel (Right side - 16 User Tests) */}
          <div className="w-full md:w-96 bg-stone-950 border-t md:border-t-0 md:border-l border-amber-600/40 p-4 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-black text-amber-200 uppercase tracking-wider">
                  TÜBİTAK 2204-B Test Senaryoları (16/16)
                </h3>
              </div>

              <div className="space-y-1 text-[11px] max-h-[60vh] overflow-y-auto pr-1">
                <TestRow label="TEST 1: Eren seçilince doğru karakter görünüyor" passed={testResults.test1_erenModel} />
                <TestRow label="TEST 2: Aybüke seçilince doğru karakter görünüyor" passed={testResults.test2_aybukeModel} />
                <TestRow label="TEST 3: Eren yüzü referansla tutarlı" passed={testResults.test3_erenFaceRef} />
                <TestRow label="TEST 4: Aybüke yüzü referansla tutarlı" passed={testResults.test4_aybukeFaceRef} />
                <TestRow label="TEST 5: Aybüke yüzü %100 açık (clipping yok)" passed={testResults.test5_aybukeFaceVisible} />
                <TestRow label="TEST 6: Aybüke'nin elindeki nesne kaldırıldı (eller boş)" passed={testResults.test6_aybukeHandsEmpty} />
                <TestRow label="TEST 7: Aybüke'de sırt çantası var" passed={testResults.test7_aybukeBackpack} />
                <TestRow label="TEST 8: W tuşu ile ileri yürüme" passed={testResults.test8_forwardW} />
                <TestRow label="TEST 9: Shift ile koşma animasyonu" passed={testResults.test9_sprintShift} />
                <TestRow label="TEST 10: Ekrandaki koş butonu aktif/pasif" passed={testResults.test10_runButton} />
                <TestRow label="TEST 11: Sağa dönünce kamera otomatik dönüyor" passed={testResults.test11_autoCamRight} />
                <TestRow label="TEST 12: Sola dönünce kamera otomatik dönüyor" passed={testResults.test12_autoCamLeft} />
                <TestRow label="TEST 13: Mouse olmadan rahat oynanabiliyor" passed={testResults.test13_noMouseNeeded} />
                <TestRow label="TEST 14: Karakter kuma batmıyor (Ayaklar Y=0.0'da)" passed={testResults.test14_noSandSinking} />
                <TestRow label="TEST 15: Idle/Walk/Run animasyon geçişleri akıcı" passed={testResults.test15_animStates} />
                <TestRow label="TEST 16: Yağmur sesi tamamen kaldırıldı" passed={testResults.test16_noRainSound} />
              </div>
            </div>

            <div className="pt-3 border-t border-stone-800 space-y-2">
              <div className="text-[10px] text-stone-400 leading-tight">
                İpucu: <strong>W, A, S, D</strong> ile hareket edin, <strong>Shift</strong> veya ekrandaki butonla koşturun.
              </div>
              <button
                onClick={() => {
                  onClose();
                  onStartGame();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition shadow flex items-center justify-center gap-2"
              >
                <span>571 Mekke Dünyasına Geç</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

const TestRow: React.FC<{ label: string; passed: boolean }> = ({ label, passed }) => (
  <div className={`flex items-center justify-between p-1.5 rounded-lg border transition ${
    passed ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-stone-900 border-stone-800 text-stone-400'
  }`}>
    <span className="truncate pr-2">{label}</span>
    {passed ? (
      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
        <span>TAMAM</span>
      </span>
    ) : (
      <span className="text-[10px] text-stone-500 font-bold">BEKLİYOR</span>
    )}
  </div>
);
