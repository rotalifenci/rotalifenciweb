const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../oyunlar/kozmik-kosu-3d.html');
let html = fs.readFileSync(targetFile, 'utf8');

const startMarker = 'function checkQuestionGateTriggers()';
const endMarker = 'function showFeedbackToast(';

const startIdx = html.indexOf(startMarker);
const endIdx = html.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('Markers not found!');
  process.exit(1);
}

const newQuestionLogic = `function checkQuestionGateTriggers() {
            if (GAME.isQuestionActive || activeGateGroup) return;

            // Her 220 metrede bir bilimsel soru kapılarını piste yerleştir
            if (GAME.distance >= GAME.nextQuestionDistance) {
                triggerQuestionGate();
            }
        }

        // 🚪 2 ŞIKLI KESİNTİSİZ 3D SORU KAPILARI (Sol: A Kapısı, Sağ: B Kapısı)
        function triggerQuestionGate() {
            GAME.isQuestionActive = true;
            GAME.questionAnswered = false;

            // 50 Soruluk Karışık Havuzdan Sıradaki Soruyu Al
            if (!GAME.shuffledQuestions || GAME.shuffledQuestions.length === 0 || GAME.questionPoolIndex >= GAME.shuffledQuestions.length) {
                GAME.shuffledQuestions = shuffleArray(QUESTIONS_POOL_50);
                GAME.questionPoolIndex = 0;
            }

            const qObj = GAME.shuffledQuestions[GAME.questionPoolIndex++];
            GAME.currentQuestion = qObj;

            // 2 Şıkkı (Sol: A, Sağ: B) %50 İhtimalle Rastgele Dağıt
            const isAnsFirst = Math.random() < 0.5;
            GAME.activeGateOptions = {
                A: {
                    key: 'A',
                    text: isAnsFirst ? qObj.ans : qObj.dist,
                    isCorrect: isAnsFirst,
                    lane: -1
                },
                B: {
                    key: 'B',
                    text: isAnsFirst ? qObj.dist : qObj.ans,
                    isCorrect: !isAnsFirst,
                    lane: 1
                }
            };

            // Kapı önündeki engelleri temizle (Oyuncunun rahat şerit değiştirmesi için)
            for (let i = activeObstacles.length - 1; i >= 0; i--) {
                const obs = activeObstacles[i];
                if (obs.position.z < -20 && obs.position.z > -75) {
                    scene.remove(obs);
                    activeObstacles.splice(i, 1);
                }
            }

            // Üst Canlı Soru Banner'ını Güncelle ve Göster
            const qBanner = document.getElementById('live-question-banner');
            const qText = document.getElementById('live-q-text');
            const optAText = document.getElementById('live-opt-a-text');
            const optBText = document.getElementById('live-opt-b-text');
            const qBadge = document.getElementById('live-q-badge');

            if (qText) qText.textContent = qObj.q;
            if (optAText) optAText.textContent = GAME.activeGateOptions.A.text;
            if (optBText) optBText.textContent = GAME.activeGateOptions.B.text;
            if (qBadge) qBadge.textContent = \`5. Sınıf Fen • Soru \${GAME.questionPoolIndex} / 50\`;

            if (qBanner) {
                qBanner.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-4');
                qBanner.classList.add('opacity-100', 'translate-y-0');
            }

            // 3D Sahnede 2 Şeritli Kapıları 62 Metre İleride Oluştur
            build2LaneGateMesh(-62);
        }

        // 🎨 3D Kapı Tabela Dokusu Oluşturucu (Yüksek Çözünürlüklü Canvas Texture)
        function createGateSignTexture(letter, text, primaryColorHex, bgColors) {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 256;
            const ctx = canvas.getContext('2d');

            // Arka plan degrade kutusu
            const grad = ctx.createLinearGradient(0, 0, 512, 256);
            grad.addColorStop(0, bgColors[0]);
            grad.addColorStop(1, bgColors[1]);
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 512, 256);

            // Dış neon çerçeve
            ctx.lineWidth = 12;
            ctx.strokeStyle = primaryColorHex;
            ctx.strokeRect(6, 6, 500, 244);

            // İç ince çerçeve
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.strokeRect(18, 18, 476, 220);

            // Şık Rozeti Dairesi (A veya B)
            ctx.fillStyle = primaryColorHex;
            ctx.beginPath();
            ctx.arc(80, 128, 54, 0, Math.PI * 2);
            ctx.fill();

            // Harf (A / B)
            ctx.fillStyle = '#030712';
            ctx.font = '900 68px Orbitron, Montserrat, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(letter, 80, 131);

            // Cevap Metni (Beyaz, Okunaklı)
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';

            let fontSize = 46;
            if (text.length > 13) fontSize = 36;
            if (text.length > 22) fontSize = 28;
            ctx.font = \`800 \${fontSize}px Poppins, Montserrat, sans-serif\`;

            const words = text.split(' ');
            if (words.length > 2 && text.length > 15) {
                const mid = Math.ceil(words.length / 2);
                const l1 = words.slice(0, mid).join(' ');
                const l2 = words.slice(mid).join(' ');
                ctx.fillText(l1, 155, 96);
                ctx.fillText(l2, 155, 158);
            } else {
                ctx.fillText(text, 155, 128);
            }

            const texture = new THREE.CanvasTexture(canvas);
            texture.minFilter = THREE.LinearFilter;
            return texture;
        }

        // 🎨 3D Orta Bariyer Tabelası (⛔ ORTA KAPALI)
        function createDividerTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 256;
            const ctx = canvas.getContext('2d');

            ctx.fillStyle = '#450a0a';
            ctx.fillRect(0, 0, 512, 256);

            ctx.lineWidth = 10;
            ctx.strokeStyle = '#ef4444';
            ctx.strokeRect(5, 5, 502, 246);

            ctx.fillStyle = '#ef4444';
            ctx.font = '900 38px Orbitron, Montserrat, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('⛔ ORTA KAPALI ⛔', 256, 75);

            ctx.fillStyle = '#fbbf24';
            ctx.font = '800 34px Poppins, Montserrat, sans-serif';
            ctx.fillText('⬅️ [A] KAPI   |   KAPI [B] ➡️', 256, 145);

            ctx.fillStyle = '#fca5a5';
            ctx.font = '600 22px Poppins, sans-serif';
            ctx.fillText('BİR KAPIDAN GEÇ!', 256, 205);

            const texture = new THREE.CanvasTexture(canvas);
            texture.minFilter = THREE.LinearFilter;
            return texture;
        }

        // 3D Sahnede 2 Şeritli Soru Kapısı (Sol: A, Sağ: B, Orta: Bariyer)
        function build2LaneGateMesh(zPos) {
            if (activeGateGroup) scene.remove(activeGateGroup);
            activeGateGroup = new THREE.Group();
            activeGateGroup.position.set(0, 0, zPos);

            const optA = GAME.activeGateOptions.A;
            const optB = GAME.activeGateOptions.B;

            // 1. SOL KAPI (A Şıkkı - x: -2.2)
            const gateA = new THREE.Group();
            gateA.position.set(-2.2, 0, 0);

            // Yan Sütunlar
            [-1.1, 1.1].forEach(px => {
                const post = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.12, 0.12, 4.2, 12),
                    new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x06b6d4, emissiveIntensity: 0.6 })
                );
                post.position.set(px, 2.1, 0);
                gateA.add(post);
            });

            // Üst Kemer
            const topBarA = new THREE.Mesh(
                new THREE.BoxGeometry(2.5, 0.45, 0.3),
                new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x06b6d4, emissiveIntensity: 0.7 })
            );
            topBarA.position.set(0, 4.2, 0);
            gateA.add(topBarA);

            // Tabela (A Şıkkı ve Cevabı)
            const texA = createGateSignTexture('A', optA.text, '#06b6d4', ['#030712', '#082f49']);
            const signA = new THREE.Mesh(
                new THREE.PlaneGeometry(2.4, 1.2),
                new THREE.MeshBasicMaterial({ map: texA, side: THREE.DoubleSide })
            );
            signA.position.set(0, 4.9, 0);
            gateA.add(signA);

            // Geçiş Işık Perdesi (Portal)
            const portalA = new THREE.Mesh(
                new THREE.PlaneGeometry(2.1, 3.8),
                new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.38, side: THREE.DoubleSide })
            );
            portalA.position.set(0, 1.9, 0);
            gateA.userData = { portal: portalA, option: optA };
            gateA.add(portalA);

            activeGateGroup.add(gateA);

            // 2. SAĞ KAPI (B Şıkkı - x: 2.2)
            const gateB = new THREE.Group();
            gateB.position.set(2.2, 0, 0);

            [-1.1, 1.1].forEach(px => {
                const post = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.12, 0.12, 4.2, 12),
                    new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.6 })
                );
                post.position.set(px, 2.1, 0);
                gateB.add(post);
            });

            const topBarB = new THREE.Mesh(
                new THREE.BoxGeometry(2.5, 0.45, 0.3),
                new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.7 })
            );
            topBarB.position.set(0, 4.2, 0);
            gateB.add(topBarB);

            const texB = createGateSignTexture('B', optB.text, '#f59e0b', ['#030712', '#451a03']);
            const signB = new THREE.Mesh(
                new THREE.PlaneGeometry(2.4, 1.2),
                new THREE.MeshBasicMaterial({ map: texB, side: THREE.DoubleSide })
            );
            signB.position.set(0, 4.9, 0);
            gateB.add(signB);

            const portalB = new THREE.Mesh(
                new THREE.PlaneGeometry(2.1, 3.8),
                new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.38, side: THREE.DoubleSide })
            );
            portalB.position.set(0, 1.9, 0);
            gateB.userData = { portal: portalB, option: optB };
            gateB.add(portalB);

            activeGateGroup.add(gateB);

            // 3. ORTA ŞERİT BARİYERİ (x: 0 - Kapalı Geçit Uyarısı)
            const midGroup = new THREE.Group();
            midGroup.position.set(0, 0, 0);

            const midPylon = new THREE.Mesh(
                new THREE.CylinderGeometry(0.16, 0.22, 3.2, 8),
                new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0x991b1b, emissiveIntensity: 0.5 })
            );
            midPylon.position.set(0, 1.6, 0);
            midGroup.add(midPylon);

            const divTex = createDividerTexture();
            const divSign = new THREE.Mesh(
                new THREE.PlaneGeometry(1.9, 0.95),
                new THREE.MeshBasicMaterial({ map: divTex, side: THREE.DoubleSide })
            );
            divSign.position.set(0, 2.5, 0);
            midGroup.add(divSign);

            activeGateGroup.add(midGroup);

            scene.add(activeGateGroup);
        }

        // 🏃 KAPIDAN GEÇİŞİN DEĞERLENDİRİLMESİ (Oyun Durmaz, Koşarak Geçilir)
        function evaluateGateAnswer(lane) {
            if (GAME.questionAnswered) return;
            GAME.questionAnswered = true;

            const optA = GAME.activeGateOptions ? GAME.activeGateOptions.A : null;
            const optB = GAME.activeGateOptions ? GAME.activeGateOptions.B : null;

            let chosen = null;
            if (lane === -1) {
                chosen = optA; // Sol kapıdan geçti (A)
            } else if (lane === 1) {
                chosen = optB; // Sağ kapıdan geçti (B)
            } else {
                chosen = null; // Orta şerit (0): İki kapının ortasındaki bariyere çarptı
            }

            const isCorrect = chosen ? chosen.isCorrect : false;
            const toast = document.getElementById('feedback-toast');
            const toastContent = document.getElementById('feedback-toast-content');

            if (isCorrect) {
                // 🎉 DOĞRU KAPIDAN GEÇTİ!
                playSound('correct');
                confetti({ particleCount: 55, spread: 80, origin: { y: 0.55 } });

                GAME.score += 150;
                GAME.correctAnswersCount++;
                GAME.streak++;
                if (GAME.streak >= 3) {
                    GAME.score += 100;
                }
                document.getElementById('hud-score').textContent = GAME.score;

                if (toast && toastContent) {
                    toast.className = 'absolute bottom-20 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-md z-30 p-3.5 rounded-2xl bg-emerald-950/95 border-2 border-emerald-400 text-center text-xs sm:text-sm font-bold text-white shadow-[0_0_30px_rgba(16,185,129,0.7)] transition-all duration-300 opacity-100 transform translate-y-0';
                    toastContent.innerHTML = \`<span class="text-emerald-300 font-black text-sm sm:text-base">✨ TEBRİKLER! DOĞRU KAPIDAN GEÇTİN (+150 PUAN)</span><br><span class="text-emerald-100 text-xs font-semibold leading-relaxed mt-1 block">\${GAME.currentQuestion.fact}</span>\`;
                    setTimeout(() => {
                        toast.className = 'opacity-0 pointer-events-none transform translate-y-4';
                    }, 3500);
                }

                // Hikâye Modunda 5 Doğru Sonrası Zafer
                if (GAME.mode === 'story' && GAME.correctAnswersCount >= 5) {
                    setTimeout(() => {
                        triggerVictory();
                    }, 1200);
                }

            } else {
                // 💥 YANLIŞ KAPI VEYA ORTA BARİYERE ÇARPMA!
                playSound('hit');
                GAME.streak = 0;
                GAME.lives -= 1;
                updateLivesHUD();
                triggerDamageFlash();
                cameraShakeTimer = 0.35;

                const correctLetter = (optA && optA.isCorrect) ? 'A' : 'B';
                const correctText = (optA && optA.isCorrect) ? optA.text : (optB ? optB.text : '');
                const msg = (lane === 0)
                    ? \`⚠️ ORTA BARİYERE ÇARPTIN! KAPILARDAN BİRİNDEN GEÇMELİSİN!\`
                    : \`❌ YANLIŞ KAPI! DOĞRUSU: [\${correctLetter}] \${correctText}\`;

                if (toast && toastContent) {
                    toast.className = 'absolute bottom-20 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-md z-30 p-3.5 rounded-2xl bg-rose-950/95 border-2 border-rose-400 text-center text-xs sm:text-sm font-bold text-white shadow-[0_0_30px_rgba(244,63,94,0.7)] transition-all duration-300 opacity-100 transform translate-y-0';
                    toastContent.innerHTML = \`<span class="text-rose-300 font-black text-sm sm:text-base">\${msg}</span><br><span class="text-rose-100 text-xs font-semibold leading-relaxed mt-1 block">\${GAME.currentQuestion.fact}</span>\`;
                    setTimeout(() => {
                        toast.className = 'opacity-0 pointer-events-none transform translate-y-4';
                    }, 3800);
                }

                if (GAME.lives <= 0) {
                    setTimeout(() => {
                        triggerGameOver();
                    }, 900);
                }
            }

            // Canlı Soru Banner'ını Gizle ve Bir Sonraki Soruyu Planla
            hideLiveQuestionBanner();
            GAME.nextQuestionDistance = GAME.distance + 240;

            setTimeout(() => {
                GAME.isQuestionActive = false;
            }, 1200);
        }

        function hideLiveQuestionBanner() {
            const qBanner = document.getElementById('live-question-banner');
            if (qBanner) {
                qBanner.classList.add('opacity-0', 'pointer-events-none', '-translate-y-4');
                qBanner.classList.remove('opacity-100', 'translate-y-0');
            }
        }

        `;

html = html.substring(0, startIdx) + newQuestionLogic + html.substring(endIdx);
fs.writeFileSync(targetFile, html, 'utf8');
console.log('✔ Successfully patched new 2-door gate logic in kozmik-kosu-3d.html');
