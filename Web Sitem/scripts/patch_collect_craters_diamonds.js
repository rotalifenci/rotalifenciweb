// scripts/patch_collect_craters_diamonds.js
const fs = require('fs');
let html = fs.readFileSync('oyunlar/kozmik-kasif-3d.html', 'utf8');

console.log('Original html length:', html.length);

// 1. Add toast notification in HTML (just before center-interaction-prompt)
const oldCenterPrompt = '<div id="center-interaction-prompt"';
const toastHtml = `<!-- GEM COLLECTED TOAST NOTIFICATION -->
            <div id="gem-collect-toast" class="fixed top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none hidden flex-col items-center gap-1 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-slate-950 font-black shadow-[0_0_40px_rgba(245,158,11,0.85)] border-2 border-white animate-bounce">
                <div class="flex items-center gap-2 text-xs sm:text-sm tracking-wide">
                    <i class="fa-solid fa-gem text-base"></i>
                    <span id="gem-toast-title">TEBRİKLER! KRATER ELMASI TOPLANDI!</span>
                </div>
                <div class="text-[10px] font-bold tracking-wider uppercase text-slate-900/80">+100 PUAN • AY KÂŞİFİ ENVANTERİNE EKLENDİ 💎</div>
            </div>

            <div id="center-interaction-prompt"`;

if (html.includes(oldCenterPrompt) && !html.includes('id="gem-collect-toast"')) {
    html = html.replace(oldCenterPrompt, toastHtml);
    console.log('1. Injected gem-collect-toast into HTML.');
}

// 2. Update widget-moon text in HTML
html = html.replace(
    '<span><i class="fa-solid fa-bullseye text-cyan-400"></i> Krater Keşfi:</span>',
    '<span><i class="fa-solid fa-gem text-amber-400"></i> Toplanan Elmas:</span>'
);

// 3. Add sound effect 'gem' / 'diamond' into playSound
const oldPlaySoundCorrect = `} else if (type === 'correct') {`;
const newPlaySoundGem = `} else if (type === 'gem' || type === 'diamond') {
                    // Crystalline chime for collecting crater diamond
                    const osc2 = audioCtx.createOscillator();
                    const gain2 = audioCtx.createGain();
                    osc2.connect(gain2);
                    gain2.connect(audioCtx.destination);

                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(1046.50, now); // C6
                    osc.frequency.setValueAtTime(1318.51, now + 0.07); // E6
                    osc.frequency.setValueAtTime(1567.98, now + 0.14); // G6
                    osc.frequency.setValueAtTime(2093.00, now + 0.21); // C7
                    gain.gain.setValueAtTime(0.25, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
                    osc.start(now);
                    osc.stop(now + 0.55);

                    osc2.type = 'triangle';
                    osc2.frequency.setValueAtTime(2093.00, now);
                    osc2.frequency.exponentialRampToValueAtTime(3135.96, now + 0.25);
                    gain2.gain.setValueAtTime(0.15, now);
                    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
                    osc2.start(now);
                    osc2.stop(now + 0.45);
                } else if (type === 'correct') {`;

if (html.includes(oldPlaySoundCorrect) && !html.includes("type === 'gem'")) {
    html = html.replace(oldPlaySoundCorrect, newPlaySoundGem);
    console.log('2. Injected gem sound effect into playSound.');
}

// 4. Inject sprite helper functions and collectDiamondBeacon function
const spriteHelpersCode = `
        function createCraterLabelSprite(text, isDone) {
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');

            ctx.fillStyle = isDone ? 'rgba(6, 78, 59, 0.90)' : 'rgba(15, 23, 42, 0.88)';
            ctx.strokeStyle = isDone ? '#34d399' : '#38bdf8';
            ctx.lineWidth = 3;

            const x = 6, y = 6, w = 244, h = 52, r = 24;
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + w - r, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + r);
            ctx.lineTo(x + w, y + h - r);
            ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            ctx.lineTo(x + r, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = isDone ? '#a7f3d0' : '#ffffff';
            ctx.font = 'bold 20px system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, 128, 32);

            const texture = new THREE.CanvasTexture(canvas);
            texture.minFilter = THREE.LinearFilter;
            const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
            const sprite = new THREE.Sprite(spriteMat);
            sprite.scale.set(5.5, 1.4, 1);
            sprite.position.y = 5.2;
            return sprite;
        }

        function updateCraterLabelSprite(beaconGroup, text, isDone) {
            if (!beaconGroup || !beaconGroup.userData || !beaconGroup.userData.labelSprite) return;
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');

            ctx.fillStyle = isDone ? 'rgba(6, 78, 59, 0.92)' : 'rgba(15, 23, 42, 0.88)';
            ctx.strokeStyle = isDone ? '#34d399' : '#38bdf8';
            ctx.lineWidth = 3;

            const x = 6, y = 6, w = 244, h = 52, r = 24;
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + w - r, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + r);
            ctx.lineTo(x + w, y + h - r);
            ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            ctx.lineTo(x + r, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = isDone ? '#a7f3d0' : '#ffffff';
            ctx.font = 'bold 20px system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, 128, 32);

            beaconGroup.userData.labelSprite.material.map.dispose();
            beaconGroup.userData.labelSprite.material.map = new THREE.CanvasTexture(canvas);
            beaconGroup.userData.labelSprite.material.needsUpdate = true;
        }

        function collectDiamondBeacon(beaconObj) {
            if (!beaconObj || beaconObj.userData.isCollected) return;
            beaconObj.userData.isCollected = true;

            // 1. Diamond Collection Animation: Float up, spin fast, disappear
            if (beaconObj.userData.gem) {
                const gem = beaconObj.userData.gem;
                let step = 0;
                const animInterval = setInterval(() => {
                    step++;
                    gem.position.y += 0.2;
                    gem.rotation.y += 0.3;
                    gem.scale.multiplyScalar(0.9);
                    if (step >= 20) {
                        clearInterval(animInterval);
                        gem.visible = false;
                    }
                }, 25);
            }

            // 2. Extinguish the tall beacon light beam (unanswered marker)
            if (beaconObj.userData.pillar) {
                beaconObj.userData.pillar.visible = false;
            }

            // 3. Turn the ground ring to vibrant green
            if (beaconObj.userData.ring) {
                beaconObj.userData.ring.material.color.setHex(0x10b981);
                beaconObj.userData.ring.material.opacity = 0.95;
            }

            // 4. Reveal the completed Lunar Science Flag & Checkmark
            if (beaconObj.userData.flagGroup) {
                beaconObj.userData.flagGroup.visible = true;
            }

            // 5. Update the 3D billboard sprite
            updateCraterLabelSprite(beaconObj, "✅ " + beaconObj.userData.label + " ✓", true);
        }

        function showGemCollectToast(craterTitle) {
            const toast = document.getElementById('gem-collect-toast');
            const toastTitle = document.getElementById('gem-toast-title');
            if (!toast) return;
            if (toastTitle && craterTitle) {
                toastTitle.innerText = "TEBRİKLER! " + craterTitle.toUpperCase() + " ELMASI TOPLANDI!";
            }
            toast.classList.remove('hidden');
            toast.classList.add('flex');
            setTimeout(() => {
                toast.classList.add('hidden');
                toast.classList.remove('flex');
            }, 3500);
        }
`;

// Inject helper functions before createMissionBeacon
const beaconFuncMarker = 'function createMissionBeacon(id, x, z, label, colorHex) {';
if (!html.includes('function createCraterLabelSprite')) {
    html = html.replace(beaconFuncMarker, spriteHelpersCode + '\n        ' + beaconFuncMarker);
    console.log('3. Injected sprite helpers, toast, and collectDiamondBeacon functions.');
}

// 5. Update createMissionBeacon function to add flagGroup and labelSprite
const oldCreateBeaconRegex = /function createMissionBeacon\(id, x, z, label, colorHex\) \{[\s\S]*?moonTargetBeacons\.push\(beaconGroup\);\s*\}/;

const newCreateBeaconCode = `function createMissionBeacon(id, x, z, label, colorHex) {
            const beaconGroup = new THREE.Group();
            const groundY = (typeof getMoonTerrainHeight === 'function') ? getMoonTerrainHeight(x, z) : 0;
            beaconGroup.position.set(x, groundY + 0.1, z);

            // Glowing ring on ground
            const ringGeo = new THREE.RingGeometry(1.2, 1.8, 32);
            ringGeo.rotateX(-Math.PI / 2);
            const ringMat = new THREE.MeshBasicMaterial({
                color: colorHex,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.7
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            beaconGroup.add(ring);

            // Vertical Beacon Light Pillar (tall beam visible across horizon)
            const pillarGeo = new THREE.CylinderGeometry(0.12, 0.75, 14, 16);
            const pillarMat = new THREE.MeshBasicMaterial({
                color: colorHex,
                transparent: true,
                opacity: 0.4
            });
            const pillar = new THREE.Mesh(pillarGeo, pillarMat);
            pillar.position.y = 7;
            beaconGroup.add(pillar);

            // Floating Diamond / Gem (Collected & hidden when question answered)
            const gemGeo = new THREE.OctahedronGeometry(0.85);
            const gemMat = new THREE.MeshStandardMaterial({
                color: colorHex,
                emissive: colorHex,
                emissiveIntensity: 0.9,
                roughness: 0.1,
                metalness: 0.8
            });
            const gem = new THREE.Mesh(gemGeo, gemMat);
            gem.position.y = 3.6;
            beaconGroup.add(gem);

            // Completed Flag Group (astronaut flag + holographic checkmark, visible after collection)
            const flagGroup = new THREE.Group();
            
            // Silver Flagpole
            const poleGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.4, 8);
            const poleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
            const pole = new THREE.Mesh(poleGeo, poleMat);
            pole.position.y = 1.7;
            flagGroup.add(pole);

            // Green Victory Flag banner
            const flagGeo = new THREE.PlaneGeometry(1.3, 0.8);
            const flagMat = new THREE.MeshStandardMaterial({
                color: 0x10b981,
                side: THREE.DoubleSide,
                emissive: 0x065f46,
                emissiveIntensity: 0.6
            });
            const flag = new THREE.Mesh(flagGeo, flagMat);
            flag.position.set(0.7, 2.7, 0);
            flagGroup.add(flag);

            // Rotating Hologram Checkmark Ring
            const checkGeo = new THREE.TorusGeometry(0.45, 0.08, 8, 24);
            const checkMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
            const checkRing = new THREE.Mesh(checkGeo, checkMat);
            checkRing.position.set(0.7, 3.7, 0);
            flagGroup.add(checkRing);

            flagGroup.visible = false; // Hidden until collected!
            beaconGroup.add(flagGroup);

            // Floating 3D Billboard Label Sprite above beacon
            const labelSprite = createCraterLabelSprite("💎 " + label, false);
            beaconGroup.add(labelSprite);

            beaconGroup.userData = { 
                id, x, z, label, 
                gem, ring, pillar, 
                flagGroup, flag, checkRing, 
                labelSprite, 
                isCollected: false 
            };
            moonGroup.add(beaconGroup);
            moonTargetBeacons.push(beaconGroup);
        }`;

if (oldCreateBeaconRegex.test(html)) {
    html = html.replace(oldCreateBeaconRegex, newCreateBeaconCode);
    console.log('4. Replaced createMissionBeacon with flagGroup and labelSprite.');
} else {
    console.warn('Could not match oldCreateBeaconRegex!');
}

// 6. Update animate loop to flutter flag and rotate checkRing
const oldBeaconAnim = `            // Beacon Floating Gem Animation
            moonTargetBeacons.forEach(b => {
                if (b.userData.gem) {
                    b.userData.gem.rotation.y += 0.02;
                    b.userData.gem.position.y = 3.5 + Math.sin(Date.now() * 0.003 + b.userData.id) * 0.3;
                }
            });`;

const newBeaconAnim = `            // Beacon Floating Gem & Flag Animation
            moonTargetBeacons.forEach(b => {
                if (b.userData.gem && b.userData.gem.visible) {
                    b.userData.gem.rotation.y += 0.025;
                    b.userData.gem.position.y = 3.6 + Math.sin(Date.now() * 0.003 + b.userData.id) * 0.35;
                }
                if (b.userData.flagGroup && b.userData.flagGroup.visible) {
                    b.userData.flag.rotation.y = Math.sin(Date.now() * 0.004 + b.userData.id) * 0.2;
                    b.userData.checkRing.rotation.y += 0.03;
                }
            });`;

if (html.includes(oldBeaconAnim)) {
    html = html.replace(oldBeaconAnim, newBeaconAnim);
    console.log('5. Updated animate loop for gem and flag.');
}

// 7. Update handleAnswer to play gem sound, show toast, and call collectDiamondBeacon
const oldHandleAnswerRegex = /function handleAnswer\(selectedOpt, mission\) \{[\s\S]*?feedbackEl\.innerHTML = `❌ <strong>Tekrar Dene!<\/strong> İpucu: Fen kurallarını ve ünite kazanımlarını hatırla\.`;\s*\}\s*\}/;

const newHandleAnswerCode = `function handleAnswer(selectedOpt, mission) {
            const feedbackEl = document.getElementById('q-feedback');
            feedbackEl.classList.remove('hidden');

            const expl = (currentActiveQuestion && currentActiveQuestion.explanation) || (mission.question && mission.question.explanation) || "";
            const shortAns = (currentActiveQuestion && currentActiveQuestion.shortAns) || mission.shortAns || "";

            if (selectedOpt.correct) {
                playSound('gem');
                feedbackEl.className = "p-3 rounded-xl text-xs font-semibold leading-relaxed bg-emerald-950 border border-emerald-500 text-emerald-300 animate-fadeIn";
                let feedbackHtml = \`✅ <strong>Harika! Soru Doğru Yanıtlandı ve Elmas Toplandı!</strong>\`;
                if (shortAns) {
                    feedbackHtml += \` <div class="mt-1 text-amber-300 font-bold text-sm">Cevap: \${shortAns}</div>\`;
                }
                feedbackHtml += \` <div class="mt-1 text-slate-200">\${expl}</div>\`;
                feedbackEl.innerHTML = feedbackHtml;

                if (!completedMissions.has(mission.id)) {
                    completedMissions.add(mission.id);
                    playerScore += 100;
                    confetti({ particleCount: 60, spread: 70 });
                    updateStats();
                    showGemCollectToast(mission.title);

                    // Collect diamond & transform 3D beacon
                    const beaconObj = moonTargetBeacons.find(b => b.userData.id === mission.id);
                    if (beaconObj) {
                        collectDiamondBeacon(beaconObj);
                    }
                }
            } else {
                playSound('wrong');
                feedbackEl.className = "p-3 rounded-xl text-xs font-semibold leading-relaxed bg-rose-950 border border-rose-500 text-rose-300 animate-fadeIn";
                feedbackEl.innerHTML = \`❌ <strong>Tekrar Dene!</strong> İpucu: Fen kurallarını ve ünite kazanımlarını hatırla.\`;
            }
        }`;

if (oldHandleAnswerRegex.test(html)) {
    html = html.replace(oldHandleAnswerRegex, newHandleAnswerCode);
    console.log('6. Updated handleAnswer to collect diamond and show toast.');
}

// 8. Update checkBeaconProximity and nearest crater HUD in updateRoverPhysics
const oldRoverCraterHudRegex = /const craterHudEl = document\.getElementById\('nearest-crater-hud'\);[\s\S]*?craterHudEl\.innerText = `En Yakın: \$\{nearestCraterName\} \(\$\{Math\.round\(nearestDist\)\}m\)`;\s*\}/;

const newRoverCraterHudCode = `const craterHudEl = document.getElementById('nearest-crater-hud');
            if (craterHudEl && nearestCraterName) {
                let nearestCraterObj = MOON_CRATERS.find(c => c.name === nearestCraterName);
                let isNearestDone = nearestCraterObj ? completedMissions.has(nearestCraterObj.id) : false;
                if (isNearestDone) {
                    craterHudEl.className = "text-[10px] font-bold truncate text-center bg-emerald-950/90 rounded-xl py-1 px-2 border border-emerald-500/50 text-emerald-300 shadow-md";
                    craterHudEl.innerHTML = \`En Yakın: ✅ \${nearestCraterName} (\${Math.round(nearestDist)}m) - <strong class="text-white">TOPLANDI</strong>\`;
                } else {
                    craterHudEl.className = "text-[10px] font-bold truncate text-center bg-slate-900/90 rounded-xl py-1 px-2 border border-amber-400/50 text-amber-300 shadow-md";
                    craterHudEl.innerHTML = \`En Yakın: 💎 \${nearestCraterName} (\${Math.round(nearestDist)}m) - <strong class="text-rose-300 animate-pulse">ELMAS BEKLİYOR</strong>\`;
                }
            }`;

if (oldRoverCraterHudRegex.test(html)) {
    html = html.replace(oldRoverCraterHudRegex, newRoverCraterHudCode);
    console.log('7. Updated nearest-crater-hud with completed / waiting diamond status.');
}

// 9. Update checkBeaconProximity to clearly distinguish completed vs uncompleted
const oldCheckBeaconProxRegex = /function checkBeaconProximity\(\) \{[\s\S]*?delete promptEl\.dataset\.beaconId;\s*\}\s*\}/;

const newCheckBeaconProxCode = `function checkBeaconProximity() {
            let foundBeacon = null;
            let minDist = 9999;
            moonTargetBeacons.forEach(b => {
                const dist = Math.hypot(rover.pos.x - b.userData.x, rover.pos.z - b.userData.z);
                if (dist < 4.8 && dist < minDist) {
                    minDist = dist;
                    foundBeacon = b.userData;
                }
            });

            const promptEl = document.getElementById('center-interaction-prompt');
            const actionText = document.getElementById('prompt-action-text');
            const btnText = document.getElementById('prompt-btn-text');

            if (foundBeacon) {
                promptEl.classList.remove('hidden');
                const isDone = completedMissions.has(foundBeacon.id);
                if (isDone) {
                    promptEl.className = "pointer-events-auto flex flex-col items-center gap-2 p-3 bg-emerald-950/90 backdrop-blur-lg rounded-2xl border-2 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.5)]";
                    actionText.innerHTML = \`<span class="text-emerald-300 font-bold flex items-center gap-2 text-xs sm:text-sm"><i class="fa-solid fa-circle-check text-emerald-400 text-base"></i> \${foundBeacon.label} • ELMAS TOPLANDI!</span>\`;
                    btnText.innerHTML = \`<i class="fa-solid fa-book-open"></i> Bilgileri ve Kısa Cevabı İncele (\${foundBeacon.label})\`;
                } else {
                    promptEl.className = "pointer-events-auto flex flex-col items-center gap-2 p-3 bg-slate-950/90 backdrop-blur-lg rounded-2xl border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.6)] animate-bounce";
                    actionText.innerHTML = \`<span class="text-amber-300 font-black flex items-center gap-2 text-xs sm:text-sm"><i class="fa-solid fa-gem text-amber-400 text-base animate-pulse"></i> \${foundBeacon.label} • 💎 ELMAS SENİ BEKLİYOR!</span>\`;
                    btnText.innerHTML = \`<i class="fa-solid fa-satellite-dish"></i> Soruyu Çöz ve Elması Topla (\${foundBeacon.label})\`;
                }
                promptEl.dataset.beaconId = foundBeacon.id;
            } else {
                promptEl.classList.add('hidden');
                delete promptEl.dataset.beaconId;
            }
        }`;

if (oldCheckBeaconProxRegex.test(html)) {
    html = html.replace(oldCheckBeaconProxRegex, newCheckBeaconProxCode);
    console.log('8. Updated checkBeaconProximity prompt styling.');
}

// 10. Update openQuestionModal to show completed banner if done
const oldQModalBodyCheck = `if (isCompleted && shortAns) {`;
if (html.includes(oldQModalBodyCheck)) {
    const oldBannerRegex = /if \(isCompleted && shortAns\) \{[\s\S]*?bodyContent = `<div class="mb-2 p-2 rounded-xl bg-emerald-950\/70[\s\S]*?<\/div>` \+ bodyContent;\s*\}/;
    const newBannerCode = `if (isCompleted && shortAns) {
                bodyContent = \`<div class="mb-3 p-3 rounded-2xl bg-emerald-950/90 border-2 border-emerald-400 text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-lg animate-fadeIn">
                    <div class="flex items-center gap-2.5">
                        <span class="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-sm shrink-0">
                            <i class="fa-solid fa-check"></i>
                        </span>
                        <div>
                            <div class="text-emerald-300 font-bold text-xs uppercase">💎 Bu Kraterin Elması Toplandı!</div>
                            <div class="text-slate-300 text-[11px]">Kısa Cevap: <strong class="text-amber-300">\${shortAns}</strong></div>
                        </div>
                    </div>
                    <span class="px-2 py-1 rounded-lg bg-emerald-900 border border-emerald-500/50 text-emerald-300 font-black text-[10px] uppercase">
                        TAMAMLANDI
                    </span>
                </div>\` + bodyContent;
            }`;
    if (oldBannerRegex.test(html)) {
        html = html.replace(oldBannerRegex, newBannerCode);
        console.log('9. Updated question modal completed banner.');
    }
}

fs.writeFileSync('oyunlar/kozmik-kasif-3d.html', html, 'utf8');
console.log('Successfully saved updated oyunlar/kozmik-kasif-3d.html! New length:', html.length);
