const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '../oyunlar/kuvvet-laboratuvari.html');
let html = fs.readFileSync(srcPath, 'utf8');

// 1. Update HTML class and body background
html = html.replace(
  '<html lang="tr" class="h-full bg-slate-950 select-none">',
  '<html lang="tr" class="h-full bg-slate-100 select-none">'
);

html = html.replace(
  '<body class="h-full w-full overflow-hidden flex flex-col justify-between">',
  '<body class="h-full w-full overflow-hidden flex flex-col justify-between bg-slate-100 text-slate-800">'
);

// 2. Update CSS body, html background-color
html = html.replace(
  'background-color: #030712;\n            color: #f8fafc;',
  'background-color: #f1f5f9;\n            color: #0f172a;'
);

// 3. Update hud-glass class to bright/light modern glass
html = html.replace(
  `.hud-glass {
            background: rgba(11, 19, 41, 0.88);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.12);
        }`,
  `.hud-glass {
            background: rgba(255, 255, 255, 0.94);
            backdrop-filter: blur(14px);
            border: 1px solid rgba(226, 232, 240, 0.9);
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
        }`
);

// 4. Update Header bar
html = html.replace(
  '<header class="relative z-20 w-full px-3 py-2 hud-glass border-b border-cyan-500/30 flex items-center justify-between shrink-0 shadow-2xl">',
  '<header class="relative z-20 w-full px-3 py-2 bg-white/95 backdrop-blur-md border-b border-slate-200/90 flex items-center justify-between shrink-0 shadow-sm">'
);

// 5. Update header navigation button styles in JS switchExperiment
html = html.replace(
  "btn.className = 'nav-module-btn px-2.5 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 shrink-0 bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]';",
  "btn.className = 'nav-module-btn px-2.5 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 shrink-0 bg-cyan-600 text-white border border-cyan-600 shadow-md shadow-cyan-600/30';"
);

html = html.replace(
  "btn.className = 'nav-module-btn px-2.5 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:text-white';",
  "btn.className = 'nav-module-btn px-2.5 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 hover:text-slate-900 shadow-xs';"
);

// 6. Update initial navigation buttons HTML
html = html.replace(
  `class="nav-module-btn px-2.5 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 shrink-0 bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]"`,
  `class="nav-module-btn px-2.5 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 shrink-0 bg-cyan-600 text-white border border-cyan-600 shadow-md shadow-cyan-600/30"`
);

const inactiveBtnRegex = /class="nav-module-btn px-2\.5 py-1\.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1\.5 shrink-0 bg-slate-900\/80 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:text-white"/g;
html = html.replace(
  inactiveBtnRegex,
  `class="nav-module-btn px-2.5 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 hover:text-slate-900 shadow-xs"`
);

// 7. Update Three.js Scene colors (AÇIK RENK MODERN LABORATUVAR)
html = html.replace(
  `// Sahne
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x030712);
            scene.fog = new THREE.FogExp2(0x030712, 0.022);`,
  `// Sahne — Açık Renk Temiz Bilim Laboratuvarı
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xf1f5f9);
            scene.fog = new THREE.FogExp2(0xf1f5f9, 0.016);`
);

// Update lights
html = html.replace(
  `// Işıklandırma
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
            scene.add(ambientLight);

            const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
            dirLight.position.set(5, 12, 8);
            dirLight.castShadow = true;
            dirLight.shadow.mapSize.width = 2048;
            dirLight.shadow.mapSize.height = 2048;
            dirLight.shadow.bias = -0.0001;
            scene.add(dirLight);

            const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.5);
            fillLight.position.set(-8, 6, -5);
            scene.add(fillLight);`,
  `// Işıklandırma — Parlak ve Canlı Laboratuvar Işıkları
            const ambientLight = new THREE.AmbientLight(0xffffff, 1.15);
            scene.add(ambientLight);

            const dirLight = new THREE.DirectionalLight(0xffffff, 1.35);
            dirLight.position.set(6, 14, 9);
            dirLight.castShadow = true;
            dirLight.shadow.mapSize.width = 2048;
            dirLight.shadow.mapSize.height = 2048;
            dirLight.shadow.bias = -0.0001;
            scene.add(dirLight);

            const fillLight = new THREE.DirectionalLight(0xbae6fd, 0.65);
            fillLight.position.set(-8, 8, -6);
            scene.add(fillLight);

            const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
            backLight.position.set(0, 6, -10);
            scene.add(backLight);`
);

// Update Floor and Grid (Clean bright floor)
html = html.replace(
  `// Taban grid ızgarası
            const gridHelper = new THREE.GridHelper(40, 40, 0x06b6d4, 0x1e293b);
            gridHelper.position.y = 0;
            scene.add(gridHelper);

            // Parlak modern laboratuvar zemini
            const floorGeo = new THREE.PlaneGeometry(50, 50);
            const floorMat = new THREE.MeshStandardMaterial({
                color: 0x050b1a,
                roughness: 0.35,
                metalness: 0.25
            });`,
  `// Taban grid ızgarası (Temiz açık mavi/gri hatlar)
            const gridHelper = new THREE.GridHelper(50, 50, 0x0284c7, 0xcbd5e1);
            gridHelper.position.y = 0.01;
            scene.add(gridHelper);

            // Parlak modern beyaz laboratuvar zemini
            const floorGeo = new THREE.PlaneGeometry(60, 60);
            const floorMat = new THREE.MeshStandardMaterial({
                color: 0xf8fafc,
                roughness: 0.25,
                metalness: 0.15
            });`
);

// Update Lab Bench (Modern clean white/silver bench with sky-blue accents)
html = html.replace(
  `// Laboratuvar Deney Masası / Pisti
            const benchGeo = new THREE.BoxGeometry(22, 0.6, 3.8);
            const benchMat = new THREE.MeshStandardMaterial({
                color: 0x0f172a,
                metalness: 0.4,
                roughness: 0.2
            });`,
  `// Laboratuvar Deney Masası / Pisti (Açık modern gümüş-beyaz yüzey)
            const benchGeo = new THREE.BoxGeometry(22, 0.6, 3.8);
            const benchMat = new THREE.MeshStandardMaterial({
                color: 0xe2e8f0,
                metalness: 0.2,
                roughness: 0.25
            });`
);

// Add fail-safe OrbitControls and touch drag directly in initThreeScene
const orbitControlsInitRegex = /controls = new THREE\.OrbitControls\(camera, renderer\.domElement\);[\s\S]*?controls\.target\.set\(0, 1\.2, 0\);/;
html = html.replace(
  orbitControlsInitRegex,
  `// Orbit Kontrolleri — MEB / Çevrimdışı Güvenli Başlatıcı
            if (typeof THREE.OrbitControls === 'function') {
                try {
                    controls = new THREE.OrbitControls(camera, renderer.domElement);
                    controls.enableDamping = true;
                    controls.dampingFactor = 0.05;
                    controls.maxPolarAngle = Math.PI / 2 - 0.02;
                    controls.minDistance = 5;
                    controls.maxDistance = 26;
                    controls.target.set(0, 1.2, 0);
                } catch(e) {
                    controls = createFallbackControls(camera, renderer.domElement);
                }
            } else {
                controls = createFallbackControls(camera, renderer.domElement);
            }`
);

// Update animate() controls.update() with safe check and render try-catch
html = html.replace(
  `// Orbit kontrollerini güncelle
            controls.update();

            // Çizim
            renderer.render(scene, camera);`,
  `// Orbit kontrollerini güncelle
            if (controls && typeof controls.update === 'function') {
                try { controls.update(); } catch(e) {}
            }

            // Çizim
            try {
                if (renderer && scene && camera) {
                    renderer.render(scene, camera);
                }
            } catch(e) {
                console.error("Render loop hatası:", e);
            }`
);

// Add createFallbackControls definition before initThreeScene
const fallbackControlsCode = `
        // 🛡️ DAHİLİ YEDEK KAMERA KONTROLCÜSÜ (MEB / Pardus / Çevrimdışı Garantisi)
        function createFallbackControls(cam, dom) {
            let isDragging = false;
            let prevX = 0, prevY = 0;
            let theta = 0, phi = 0.35, radius = 13.5;

            function updatePos() {
                cam.position.x = radius * Math.sin(theta) * Math.cos(phi);
                cam.position.y = Math.max(1.5, radius * Math.sin(phi) + 1.2);
                cam.position.z = radius * Math.cos(theta) * Math.cos(phi);
                cam.lookAt(0, 1.2, 0);
            }

            dom.addEventListener('pointerdown', (e) => {
                isDragging = true;
                prevX = e.clientX;
                prevY = e.clientY;
            });
            window.addEventListener('pointerup', () => { isDragging = false; });
            window.addEventListener('pointermove', (e) => {
                if (!isDragging) return;
                const dx = e.clientX - prevX;
                const dy = e.clientY - prevY;
                prevX = e.clientX;
                prevY = e.clientY;
                theta -= dx * 0.008;
                phi = Math.max(0.08, Math.min(1.2, phi + dy * 0.008));
                updatePos();
            });
            dom.addEventListener('wheel', (e) => {
                radius = Math.max(6, Math.min(24, radius + e.deltaY * 0.01));
                updatePos();
            }, { passive: true });

            updatePos();
            return {
                target: new THREE.Vector3(0, 1.2, 0),
                update: function() {}
            };
        }
`;

html = html.replace('function initThreeScene() {', fallbackControlsCode + '\n        function initThreeScene() {');

// Update footer styling to clean modern white card with light borders
html = html.replace(
  '<footer class="relative z-20 w-full px-3 py-3 hud-glass border-t border-cyan-500/30 shrink-0 shadow-2xl">',
  '<footer class="relative z-20 w-full px-3 py-2.5 sm:py-3 bg-white/95 backdrop-blur-md border-t border-slate-200/90 text-slate-800 shrink-0 shadow-lg">'
);

// Update module control box backgrounds in footer from slate-900 to clean bright cards
html = html.replace(/bg-slate-900\/80/g, 'bg-slate-50 border border-slate-200/90');
html = html.replace(/bg-slate-900\/90/g, 'bg-slate-50 border border-slate-200/90');
html = html.replace(/bg-rose-950\/40/g, 'bg-rose-50 border border-rose-200');
html = html.replace(/bg-sky-950\/40/g, 'bg-sky-50 border border-sky-200');

// Save updated html
fs.writeFileSync(srcPath, html, 'utf8');
console.log('Successfully updated kuvvet-laboratuvari.html with light theme and failsafe controls!');
