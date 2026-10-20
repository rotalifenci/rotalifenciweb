const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'oyunlar', 'kozmik-kosu-3d.html');
let code = fs.readFileSync(targetPath, 'utf8');

// 1. Update playSound with meteor_impact sound
const oldPlaySoundStart = "function playSound(type) {";
const newPlaySoundCode = `function playSound(type) {
            if (!isAudioEnabled) return;
            initAudio();
            if (!audioCtx) return;

            const t = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            if (type === 'meteor_impact') {
                // Derin meteor patlama ve çarpışma gürlemesi
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(140, t);
                osc.frequency.exponentialRampToValueAtTime(35, t + 0.45);
                gain.gain.setValueAtTime(0.35, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
                osc.start(t);
                osc.stop(t + 0.5);

                // Ekstra düşük frekanslı sarsıntı tonu
                try {
                    const subOsc = audioCtx.createOscillator();
                    const subGain = audioCtx.createGain();
                    subOsc.type = 'sine';
                    subOsc.frequency.setValueAtTime(80, t);
                    subOsc.frequency.exponentialRampToValueAtTime(25, t + 0.6);
                    subGain.gain.setValueAtTime(0.4, t);
                    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
                    subOsc.connect(subGain);
                    subGain.connect(audioCtx.destination);
                    subOsc.start(t);
                    subOsc.stop(t + 0.6);
                } catch(e) {}
                return;
            } else if (type === 'timer_tick') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, t);
                gain.gain.setValueAtTime(0.08, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
                osc.start(t);
                osc.stop(t + 0.05);
                return;
            }`;

code = code.replace(oldPlaySoundStart, newPlaySoundCode);

// 2. Update GAME object state definition
const oldGameObjRegex = /const GAME = \{[\s\S]*?\n\s*\};\n/;
const newGameObjCode = `const GAME = {
            state: 'menu', // 'menu', 'playing', 'paused', 'gameover', 'victory', 'question_pause'
            mode: 'story', // 'story', 'endless', 'class'
            level: 1,
            score: 0,
            stars: 0,
            lives: 3,
            distance: 0,
            speed: 18,
            baseSpeed: 18,
            difficulty: 'easy',
            correctAnswersCount: 0,
            streak: 0,

            // Karakter Pozisyonu & Hareketi
            lane: 0, // -1: Sol, 0: Orta, 1: Sağ
            laneX: 0,
            targetLaneX: 0,
            laneWidth: 2.2,
            playerY: 0,
            playerVY: 0,
            isJumping: false,
            jumpTimer: 0, // Zıplama havada asılı kalma önleme zamanlayıcısı
            isSliding: false,
            slideTimer: 0,
            isInvulnerable: false,
            invulnerableTimer: 0,

            // Bonuslar
            activeBonus: null, // 'jetpack', 'magnet', 'shield', 'double'
            bonusTimer: 0,
            hasShield: false,

            // 50 Soruluk Karışık Havuz Mekaniği
            isQuestionActive: false,
            isPausedForQuestion: false,
            currentQuestion: null,
            nextQuestionDistance: 240,
            shuffledQuestions: [],
            questionPoolIndex: 0,
            questionTimer: 10,
            questionInterval: null,
            activeQuestionOptions: [],
            questionAnswered: false,

            // Sınıf Modu Sayacı
            classTimer: 120,
            classRemainingSeconds: 120,
            classInterval: null
        };

        // Meteor Çarpma ve Krater Sistemi Değişkenleri
        let activeMeteor = null;
        let meteorNextDistance = 90;
        let cameraShakeTimer = 0;
        let meteorWarningMesh = null;
`;

code = code.replace(oldGameObjRegex, newGameObjCode);

// 3. Update updateGameLoop with Jumping Fix, Meteor Falling, and Camera Shake
const oldUpdateLoopStartRegex = /function updateGameLoop\(delta\) \{[\s\S]*?playerGroup\.position\.y = GAME\.playerY;/;
const newUpdateLoopStart = `function updateGameLoop(delta) {
            // Soru beklemesinde veya menüde koşuyu durdur
            if (GAME.state !== 'playing' || GAME.isPausedForQuestion) {
                // Kamera sarsıntısı varsa sonlandır
                if (cameraShakeTimer > 0) {
                    cameraShakeTimer = 0;
                    camera.position.set(0, 3.8, 6.2);
                }
                return;
            }

            // Koşu İlerlemesi ve Mesafe
            const moveDist = GAME.speed * delta;
            GAME.distance += moveDist;
            document.getElementById('hud-distance').textContent = Math.floor(GAME.distance);

            // Karakter Şerit Hareketi (Yumuşak Geçiş / Lerp)
            GAME.targetLaneX = GAME.lane * GAME.laneWidth;
            GAME.laneX += (GAME.targetLaneX - GAME.laneX) * 0.22;
            playerGroup.position.x = GAME.laneX;

            // 🛡️ KESİN ZIPLAMA VE YERÇEKİMİ FİZİĞİ (Havada Asılı Kalmayı %100 Önleyen Koruma)
            if (GAME.isJumping) {
                GAME.jumpTimer += delta;
                GAME.playerY += GAME.playerVY * delta;
                GAME.playerVY -= 38 * delta; // Ay yerçekimi ivmesi

                // Yere basma kontrolü VEYA 0.85sn güvenlik aşımı (asla havada takılı kalmaz)
                if (GAME.playerY <= 0 || GAME.jumpTimer > 0.85) {
                    GAME.playerY = 0;
                    GAME.isJumping = false;
                    GAME.playerVY = 0;
                    GAME.jumpTimer = 0;
                }
            } else if (GAME.activeBonus === 'jetpack') {
                // Jetpack havalanması
                GAME.playerY += (2.5 - GAME.playerY) * 0.15;
            } else {
                // Yerde kalma garantisi (herhangi bir sapmada anında yere çeker)
                if (GAME.playerY > 0) {
                    GAME.playerY -= 22 * delta;
                    if (GAME.playerY < 0) GAME.playerY = 0;
                } else {
                    GAME.playerY = 0;
                }
                GAME.isJumping = false;
                GAME.playerVY = 0;
                GAME.jumpTimer = 0;
            }
            playerGroup.position.y = GAME.playerY;

            // ☄️ DİNAMİK METEOR ÇARPMA VE KRATER OLUŞTURMA MOTORU
            updateMeteorSystem(delta, moveDist);`;

code = code.replace(oldUpdateLoopStartRegex, newUpdateLoopStart);

// 4. Add updateMeteorSystem and triggerMeteorStrike functions
const meteorFunctionsCode = `
        // -----------------------------------------------------------------
        // ☄️ PARKURA METEOR DÜŞME VE KRATER OLUŞTURMA SİSTEMİ
        // -----------------------------------------------------------------
        function updateMeteorSystem(delta, moveDist) {
            // Mesafe kontrolü: Periyodik olarak parkura yeni meteor düşür
            if (!activeMeteor && GAME.distance >= meteorNextDistance && !GAME.isQuestionActive && !GAME.isPausedForQuestion) {
                meteorNextDistance = GAME.distance + 110 + Math.random() * 90;
                triggerMeteorStrike();
            }

            // Aktif Düşen Meteor Hareketi
            if (activeMeteor) {
                // Meteor yere doğru hızla dalış yapar
                activeMeteor.mesh.position.y -= 42 * delta;
                activeMeteor.mesh.position.x += (activeMeteor.targetX - activeMeteor.mesh.position.x) * 0.15;
                activeMeteor.mesh.position.z += moveDist * 0.6; // Parkur hareketine göre yaklaşır
                activeMeteor.mesh.rotation.x += 10 * delta;
                activeMeteor.mesh.rotation.y += 12 * delta;

                // Uyarı hologramı parkurla birlikte yaklaşır
                if (activeMeteor.warningMesh) {
                    activeMeteor.warningMesh.position.z += moveDist;
                    activeMeteor.warningMesh.material.opacity = 0.5 + Math.sin(Date.now() * 0.02) * 0.4;
                }

                // Yere Çarpma Anı (Impact!)
                if (activeMeteor.mesh.position.y <= 0.2) {
                    executeMeteorImpact();
                }
            }

            // Kamera Sarsıntısı Efekti
            if (cameraShakeTimer > 0) {
                cameraShakeTimer -= delta;
                const shakeIntensity = 0.18 * (cameraShakeTimer / 0.28);
                camera.position.x = (Math.random() - 0.5) * shakeIntensity;
                camera.position.y = 3.8 + (Math.random() - 0.5) * shakeIntensity;
                if (cameraShakeTimer <= 0) {
                    camera.position.set(0, 3.8, 6.2);
                }
            }
        }

        function triggerMeteorStrike() {
            // Rastgele şerit seç (-1: Sol, 0: Orta, 1: Sağ)
            const targetLane = Math.floor(Math.random() * 3) - 1;
            const targetX = targetLane * GAME.laneWidth;
            const targetZ = -46;

            // 1. Parkurda Uyarı Hedef Dairesi (Kırmızı Parlayan Hologram)
            const warnGeo = new THREE.RingGeometry(0.5, 1.25, 24);
            warnGeo.rotateX(-Math.PI / 2);
            const warnMat = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
            const warnMesh = new THREE.Mesh(warnGeo, warnMat);
            warnMesh.position.set(targetX, 0.06, targetZ);
            scene.add(warnMesh);

            // 2. Gökyüzünden Düşen 3D Alevli Meteor Taşı
            const meteorGeo = new THREE.DodecahedronGeometry(0.85, 1);
            // Köşeleri rastgele deforme ederek gerçekçi gök taşı şekli ver
            const posAttr = meteorGeo.attributes.position;
            for (let i = 0; i < posAttr.count; i++) {
                const vx = posAttr.getX(i) * (0.8 + Math.random() * 0.4);
                const vy = posAttr.getY(i) * (0.8 + Math.random() * 0.4);
                const vz = posAttr.getZ(i) * (0.8 + Math.random() * 0.4);
                posAttr.setXYZ(i, vx, vy, vz);
            }
            meteorGeo.computeVertexNormals();

            const meteorMat = new THREE.MeshStandardMaterial({
                color: 0x1c1917,
                emissive: 0xea580c,
                emissiveIntensity: 0.85,
                roughness: 0.95
            });
            const meteorMesh = new THREE.Mesh(meteorGeo, meteorMat);

            // Alevli Plazma Hale Katmanı
            const glowGeo = new THREE.SphereGeometry(1.2, 12, 12);
            const glowMat = new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.55 });
            const glowMesh = new THREE.Mesh(glowGeo, glowMat);
            meteorMesh.add(glowMesh);

            // Dinamik Meteor Işığı
            const light = new THREE.PointLight(0xf97316, 3, 25);
            meteorMesh.add(light);

            // Başlangıç: Gökyüzünde yüksekte ve uzakta
            meteorMesh.position.set(targetX + (Math.random() - 0.5) * 4, 28, targetZ - 18);
            scene.add(meteorMesh);

            activeMeteor = {
                mesh: meteorMesh,
                warningMesh: warnMesh,
                targetLane: targetLane,
                targetX: targetX,
                targetZ: targetZ
            };
        }

        function executeMeteorImpact() {
            if (!activeMeteor) return;

            const impactX = activeMeteor.targetX;
            const impactZ = activeMeteor.warningMesh ? activeMeteor.warningMesh.position.z : -46;

            // Sahneden düşen meteoru ve uyarı işaretini temizle
            scene.remove(activeMeteor.mesh);
            if (activeMeteor.warningMesh) scene.remove(activeMeteor.warningMesh);

            // 1. Patlama Sesi ve Kamera Sarsıntısı
            playSound('meteor_impact');
            cameraShakeTimer = 0.28;

            // 2. Patlama Şok Dalgası Görseli (Genişleyen Halka)
            const shockGeo = new THREE.RingGeometry(0.2, 0.6, 24);
            shockGeo.rotateX(-Math.PI / 2);
            const shockMat = new THREE.MeshBasicMaterial({ color: 0xfde047, transparent: true, opacity: 0.95, side: THREE.DoubleSide });
            const shockwave = new THREE.Mesh(shockGeo, shockMat);
            shockwave.position.set(impactX, 0.08, impactZ);
            scene.add(shockwave);

            // Şok dalgası genişleyip kaybolsun
            let shockScale = 1;
            const shockInterval = setInterval(() => {
                shockScale += 0.35;
                shockwave.scale.set(shockScale, shockScale, 1);
                shockMat.opacity -= 0.12;
                if (shockMat.opacity <= 0) {
                    clearInterval(shockInterval);
                    scene.remove(shockwave);
                }
            }, 30);

            // 3. 🌑 YERDE YENİ AY KRATERİ OLUŞTUR VE ENGELLERE EKLE
            spawnDynamicCrater(impactX, impactZ);

            activeMeteor = null;
        }

        function spawnDynamicCrater(x, z) {
            const obsGroup = new THREE.Group();
            obsGroup.position.set(x, 0, z);
            obsGroup.userData = { type: 'crater' };

            // Yükseltilmiş Krater Kenarı (Regolit Torus Halkası)
            const rimGeo = new THREE.TorusGeometry(0.95, 0.26, 12, 28);
            rimGeo.rotateX(Math.PI / 2);
            const rimMat = new THREE.MeshStandardMaterial({
                color: 0x475569,
                roughness: 0.98,
                emissive: 0x7c2d12,
                emissiveIntensity: 0.35
            });
            const rim = new THREE.Mesh(rimGeo, rimMat);
            rim.position.y = 0.14;
            obsGroup.add(rim);

            // Kraterin derin koyu çukuru
            const pitGeo = new THREE.CircleGeometry(0.88, 24);
            pitGeo.rotateX(-Math.PI / 2);
            const pitMat = new THREE.MeshBasicMaterial({ color: 0x020617 });
            const pit = new THREE.Mesh(pitGeo, pitMat);
            pit.position.y = 0.03;
            obsGroup.add(pit);

            // Krater kenarında kor halinde parlayan sıcak gök taşı parçaları
            for (let i = 0; i < 4; i++) {
                const emberGeo = new THREE.DodecahedronGeometry(0.12);
                const emberMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
                const ember = new THREE.Mesh(emberGeo, emberMat);
                const angle = (i / 4) * Math.PI * 2;
                ember.position.set(Math.cos(angle) * 0.9, 0.22, Math.sin(angle) * 0.9);
                obsGroup.add(ember);
            }

            scene.add(obsGroup);
            activeObstacles.push(obsGroup);
        }
`;

// Insert meteor functions before section 6
const section6Anchor = "// -----------------------------------------------------------------\n        // 6. 3 ŞERİTLİ BİLİMSEL SORU GEÇİTLERİ";
code = code.replace(section6Anchor, meteorFunctionsCode + "\n" + section6Anchor);

fs.writeFileSync(targetPath, code, 'utf8');
console.log('Successfully wrote step 2 of updated kozmik-kosu-3d.html');
