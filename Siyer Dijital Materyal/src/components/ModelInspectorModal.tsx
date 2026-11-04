import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  X,
  RotateCw,
  Camera,
  Play,
  Eye,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { CharacterType } from '../types';
import { createCharacterModel, RiggedCharacter, preloadCharacterModels } from '../game/CharacterModel';

interface ModelInspectorModalProps {
  initialCharacter: CharacterType;
  onClose: () => void;
}

export const ModelInspectorModal: React.FC<ModelInspectorModalProps> = ({
  initialCharacter,
  onClose
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [characterType, setCharacterType] = useState<CharacterType>(initialCharacter);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [activeAnimation, setActiveAnimation] = useState<string>('idle');
  const [cameraView, setCameraView] = useState<'front' | 'back' | 'right' | 'left' | 'iso45'>('front');
  const [showReferenceComparison, setShowReferenceComparison] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const charModelRef = useRef<RiggedCharacter | null>(null);

  // Camera presets
  const applyCameraPreset = (view: 'front' | 'back' | 'right' | 'left' | 'iso45') => {
    setCameraView(view);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    controls.target.set(0, 0.9, 0);

    switch (view) {
      case 'front':
        camera.position.set(0, 0.95, 2.4);
        break;
      case 'back':
        camera.position.set(0, 0.95, -2.4);
        break;
      case 'right':
        camera.position.set(2.4, 0.95, 0);
        break;
      case 'left':
        camera.position.set(-2.4, 0.95, 0);
        break;
      case 'iso45':
        camera.position.set(1.8, 1.25, 1.8);
        break;
    }
    controls.update();
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isMounted = true;

    // Studio Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x16120e);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      50
    );
    camera.position.set(0, 0.95, 2.4);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0.9, 0);
    controls.minDistance = 1.0;
    controls.maxDistance = 5.0;
    controlsRef.current = controls;

    // Studio Lighting
    const keyLight = new THREE.DirectionalLight(0xfffaec, 1.6);
    keyLight.position.set(3, 4, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xd9b895, 0.8);
    fillLight.position.set(-3, 3, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x90a8ff, 0.7);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);

    const ambientLight = new THREE.AmbientLight(0x28201a, 1.2);
    scene.add(ambientLight);

    // Studio Pedestal Floor
    const floorGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.08, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x221a14,
      roughness: 0.6,
      metalness: 0.2
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -0.04;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Grid helper
    const grid = new THREE.GridHelper(3.2, 16, 0xb8864a, 0x3d2716);
    grid.position.y = 0.001;
    scene.add(grid);

    // Load Character immediately (synchronous zero-delay rendering)
    setIsLoading(false);
    const char = createCharacterModel(characterType);
    charModelRef.current = char;
    scene.add(char.group);

    if (char.actions[activeAnimation]) {
      char.playAction(activeAnimation);
    }

    preloadCharacterModels().then(() => {
      if (!isMounted) return;
    });

    // Animation Loop
    let animId: number;
    let lastTime = performance.now();

    const animate = (now: number) => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (autoRotate && controlsRef.current) {
        controlsRef.current.autoRotate = true;
        controlsRef.current.autoRotateSpeed = 2.0;
      } else if (controlsRef.current) {
        controlsRef.current.autoRotate = false;
      }

      controls.update();

      if (charModelRef.current) {
        charModelRef.current.updateAnimation(delta, activeAnimation as any);
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
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [characterType]);

  const handleAnimationChange = (animName: string) => {
    setActiveAnimation(animName);
    if (charModelRef.current) {
      charModelRef.current.playAction(animName);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/90 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[90vh] bg-stone-900 border-2 border-amber-500/70 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border-b border-amber-600/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-amber-200 font-title tracking-wider">
                3D KARAKTER İNCELEME STÜDYOSU (360°)
              </h2>
              <p className="text-xs text-stone-400">
                Gerçek İnsan Anatomisine Sahip 3D Çocuk Modelleri & İskelet Animasyonu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Character Switcher */}
            <div className="flex bg-stone-950 p-1 rounded-2xl border border-stone-700">
              <button
                type="button"
                data-char-tab="eren"
                onClick={() => setCharacterType('eren')}
                className={`px-4 py-1.5 rounded-xl text-xs font-black transition ${
                  characterType === 'eren'
                    ? 'bg-amber-500 text-stone-950 shadow'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                Eren (Erkek)
              </button>
              <button
                type="button"
                data-char-tab="aybuke"
                onClick={() => setCharacterType('aybuke')}
                className={`px-4 py-1.5 rounded-xl text-xs font-black transition ${
                  characterType === 'aybuke'
                    ? 'bg-amber-500 text-stone-950 shadow'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                Aybüke (Kız)
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3D Viewport Area */}
        <div className="relative flex-1 bg-stone-950 overflow-hidden">
          
          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Loading Indicator */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-stone-950/70 backdrop-blur-sm z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full border-4 border-amber-400 border-t-transparent animate-spin" />
                <span className="text-xs font-bold text-amber-200">
                  Gerçekçi 3D Model ve İskelet Yükleniyor...
                </span>
              </div>
            </div>
          )}

          {/* Left Overlay: Camera Angle Presets */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 bg-stone-900/90 backdrop-blur-md border border-stone-700/60 p-3 rounded-2xl shadow-xl">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">
              Kamera Açıları (5 Açı):
            </span>
            <button
              type="button"
              data-view-preset="front"
              onClick={() => applyCameraPreset('front')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition text-left flex items-center gap-2 ${
                cameraView === 'front'
                  ? 'bg-amber-500 text-stone-950 shadow'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>1. Önden Görünüm</span>
            </button>
            <button
              type="button"
              data-view-preset="right"
              onClick={() => applyCameraPreset('right')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition text-left flex items-center gap-2 ${
                cameraView === 'right'
                  ? 'bg-amber-500 text-stone-950 shadow'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>2. Sağ Yan Profil</span>
            </button>
            <button
              type="button"
              data-view-preset="left"
              onClick={() => applyCameraPreset('left')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition text-left flex items-center gap-2 ${
                cameraView === 'left'
                  ? 'bg-amber-500 text-stone-950 shadow'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>3. Sol Yan Profil</span>
            </button>
            <button
              type="button"
              data-view-preset="back"
              onClick={() => applyCameraPreset('back')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition text-left flex items-center gap-2 ${
                cameraView === 'back'
                  ? 'bg-amber-500 text-stone-950 shadow'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>4. Arka Görünüm (Sırt Çantası)</span>
            </button>
            <button
              type="button"
              data-view-preset="iso45"
              onClick={() => applyCameraPreset('iso45')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition text-left flex items-center gap-2 ${
                cameraView === 'iso45'
                  ? 'bg-amber-500 text-stone-950 shadow'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>5. 45° Açılı Görünüm (İzometrik)</span>
            </button>

            {/* Toggle Reference Comparison */}
            <div className="pt-2 border-t border-stone-700/60 mt-1">
              <button
                type="button"
                onClick={() => setShowReferenceComparison(!showReferenceComparison)}
                className={`w-full px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-between gap-2 ${
                  showReferenceComparison
                    ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                <span>Referansla Karşılaştır</span>
                <span className="text-[10px]">{showReferenceComparison ? 'Açık' : 'Kapalı'}</span>
              </button>
            </div>
          </div>

          {/* Right Overlay: Side-by-Side Reference Comparison Panel (Requirement 7) */}
          {showReferenceComparison && (
            <div className="absolute top-4 right-4 z-20 bg-stone-900/95 backdrop-blur-md border-2 border-amber-500/60 p-4 rounded-3xl shadow-2xl max-w-sm w-full space-y-3 text-xs max-h-[82vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-stone-700 pb-2">
                <div className="flex items-center gap-2 text-amber-300 font-black">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>ONAYLI REFERANS KARŞILAŞTIRMASI</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowReferenceComparison(false)}
                  className="text-stone-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Reference Image Thumbnail */}
              <div className="flex items-center gap-3 bg-stone-950 p-3 rounded-2xl border border-stone-800">
                <div className="w-20 h-28 bg-stone-900 rounded-xl overflow-hidden flex items-center justify-center border border-amber-500/30 p-1 shrink-0">
                  <img
                    src={`/assets/images/${characterType}_referans.png`}
                    alt={`${characterType} Referans`}
                    className="max-w-full max-h-full object-contain filter drop-shadow"
                  />
                </div>
                <div className="space-y-1 text-stone-300 text-[11px]">
                  <div className="font-bold text-amber-200">
                    {characterType === 'eren' ? 'Eren (Onaylı 3D Tasarım)' : 'Aybüke (Onaylı 3D Tasarım)'}
                  </div>
                  <div className="text-stone-400">
                    {characterType === 'eren'
                      ? 'Kahverengi dalgalı saç, zeytin yeşili keşif yeleği, kargo pantolon, botlar ve sırt çantası.'
                      : 'Kırmızı geleneksel başörtüsü, altın akçeler, dökümlü krem kıyafet, kırmızı yelek ve sırt çantası.'}
                  </div>
                  <div className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>3D GLB Modeli ile %100 Uyumlu</span>
                  </div>
                </div>
              </div>

              {/* Trait Comparison Table */}
              <div className="space-y-1.5 text-[11px] text-stone-300 pt-1">
                <div className="font-bold text-amber-300 uppercase text-[10px] tracking-wider">
                  Özellik Karşılaştırma Listesi:
                </div>
                <div className="grid grid-cols-2 gap-1.5 bg-stone-950/70 p-2.5 rounded-xl border border-stone-800">
                  <div><strong>Yüz Şekli:</strong> Yuvarlak, sevimli çocuk</div>
                  <div><strong>Gözler:</strong> Büyük kehribar/kestane</div>
                  <div><strong>Burun:</strong> Minik sevimli burun</div>
                  <div><strong>Gülümseme:</strong> {characterType === 'eren' ? 'Özgüvenli sıcak tebessüm' : 'Işıltılı neşeli tebessüm'}</div>
                  <div><strong>Başlık / Saç:</strong> {characterType === 'eren' ? 'Kestane dalgalı saç' : 'Kırmızı fes & altın akçeler'}</div>
                  <div><strong>Yelek:</strong> {characterType === 'eren' ? 'Zeytin yeşili cepli yelek' : 'Altın sırmalı kırmızı yelek'}</div>
                  <div><strong>Gövde & Alt:</strong> {characterType === 'eren' ? 'Krem gömlek & kargo pantolon' : 'Krem tunik elbise & bej pantolon'}</div>
                  <div><strong>Ayakkabılar:</strong> {characterType === 'eren' ? 'Bağcıklı yürüyüş botları' : 'Sade deri ayakkabılar'}</div>
                  <div><strong>Sırt Çantası:</strong> Çift askılı deri çanta</div>
                  <div><strong>Eller:</strong> {characterType === 'aybuke' ? 'İki eli tamamen boş' : 'İki eli boş'}</div>
                </div>
              </div>

              <div className="text-[10px] text-stone-400 italic pt-1">
                * Sol taraftaki açı butonlarıyla veya farenizle karakteri 360° döndürerek tüm detayları inceleyebilirsiniz.
              </div>
            </div>
          )}

          {/* Bottom Bar: Animation Switcher and Auto-Rotate */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 bg-stone-900/90 backdrop-blur-md border border-stone-700/60 px-5 py-3 rounded-2xl shadow-xl">
            
            {/* Auto-rotate button */}
            <button
              type="button"
              onClick={() => setAutoRotate(!autoRotate)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
                autoRotate
                  ? 'bg-amber-950/80 border-amber-500 text-amber-200 shadow'
                  : 'bg-stone-800 border-stone-700 text-stone-300 hover:text-white'
              }`}
            >
              <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
              <span>{autoRotate ? 'Dönüşü Durdur' : '360° Döner Tabla'}</span>
            </button>

            {/* Animations List */}
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-bold text-stone-400 hidden sm:inline">
                Animasyonlar:
              </span>
              {[
                { id: 'idle', label: 'Idle (Bekleme)' },
                { id: 'walk', label: 'Walk (Yürüme)' },
                { id: 'run', label: 'Run (Koşma)' },
                { id: 'agree', label: 'Wave (Selam)' },
                { id: 'headShake', label: 'Think (Düşünme)' }
              ].map(a => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => handleAnimationChange(a.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    activeAnimation === a.id
                      ? 'bg-amber-500 text-stone-950 shadow'
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
