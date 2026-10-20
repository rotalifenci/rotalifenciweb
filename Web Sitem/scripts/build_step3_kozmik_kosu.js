const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'oyunlar', 'kozmik-kosu-3d.html');
const parentPath = path.join(__dirname, '..', '..', 'oyunlar', 'kozmik-kosu-3d.html');
let code = fs.readFileSync(targetPath, 'utf8');

// Replace Section 6 completely (from checkQuestionGateTriggers to evaluateGateAnswer)
const oldSection6Regex = /\/\/\s*6\.\s*3 ŞERİTLİ BİLİMSEL SORU GEÇİTLERİ[\s\S]*?function showFeedbackToast\(msg, isSuccess\) \{/;

const newSection6Code = `// -----------------------------------------------------------------
        // 6. 10 SANİYE BEKLEMELİ & 2 ŞIKLI BİLİMSEL SORU GEÇİTLERİ
        // -----------------------------------------------------------------
        function checkQuestionGateTriggers() {
            if (GAME.isQuestionActive || GAME.isPausedForQuestion || activeGateGroup) return;

            // Her 240 metrede bir bilimsel soru geçidi aç
            if (GAME.distance >= GAME.nextQuestionDistance) {
                triggerQuestionGate();
            }
        }

        function triggerQuestionGate() {
            GAME.isQuestionActive = true;
            GAME.isPausedForQuestion = true;
            GAME.questionAnswered = false;

            // Karakteri havada kalmaması için anında yere oturt
            GAME.playerY = 0;
            playerGroup.position.y = 0;
            GAME.isJumping = false;
            GAME.playerVY = 0;
            GAME.jumpTimer = 0;

            // 50 Soruluk Karışık Havuzdan Sıradaki Soruyu Seç
            if (!GAME.shuffledQuestions || GAME.shuffledQuestions.length === 0 || GAME.questionPoolIndex >= GAME.shuffledQuestions.length) {
                GAME.shuffledQuestions = shuffleArray(QUESTIONS_POOL_50);
                GAME.questionPoolIndex = 0;
            }

            const qObj = GAME.shuffledQuestions[GAME.questionPoolIndex++];
            GAME.currentQuestion = qObj;

            // 2 Şıkkı (A ve B) %50 İhtimalle Rastgele Dağıt
            const isAnsFirst = Math.random() < 0.5;
            GAME.activeQuestionOptions = [
                {
                    key: 'A',
                    text: isAnsFirst ? qObj.ans : qObj.dist,
                    isCorrect: isAnsFirst
                },
                {
                    key: 'B',
                    text: isAnsFirst ? qObj.dist : qObj.ans,
                    isCorrect: !isAnsFirst
                }
            ];

            // UI Metinlerini Doldur
            document.getElementById('question-text').textContent = qObj.q;
            document.getElementById('option-a-text').textContent = GAME.activeQuestionOptions[0].text;
            document.getElementById('option-b-text').textContent = GAME.activeQuestionOptions[1].text;
            document.getElementById('question-level-badge').textContent = \`5. Sınıf Fen • Soru \${GAME.questionPoolIndex} / 50\`;

            // Buton Stillerini Sıfırla
            resetOptionButtonStyles();

            // Açıklama Kutusunu Gizle
            const factBox = document.getElementById('question-fact-box');
            factBox.className = 'hidden';

            // Soru Modalını Aç (Koşuyu Durdurur)
            const qHud = document.getElementById('question-hud');
            qHud.classList.remove('opacity-0', 'pointer-events-none');
            qHud.classList.add('opacity-100');
            const cardInner = document.getElementById('question-card-inner');
            if (cardInner) {
                cardInner.classList.remove('scale-95');
                cardInner.classList.add('scale-100');
            }

            // 3D Sahnede 2 Şeritli Kemer İnşa Et (Sol: A, Sağ: B)
            build2LaneGateMesh(-35);

            // 10 Saniyelik Bekleme Sayacını Başlat
            startQuestionCountdown(10);
        }

        function resetOptionButtonStyles() {
            const btnA = document.getElementById('btn-option-a');
            const btnB = document.getElementById('btn-option-b');
            if (btnA) {
                btnA.className = 'group p-3.5 sm:p-4 rounded-2xl bg-slate-950/90 hover:bg-cyan-950/80 border-2 border-cyan-500/50 hover:border-cyan-400 text-left transition-all duration-200 shadow-lg active:scale-95 flex items-center gap-3 cursor-pointer';
                btnA.disabled = false;
            }
            if (btnB) {
                btnB.className = 'group p-3.5 sm:p-4 rounded-2xl bg-slate-950/90 hover:bg-amber-950/80 border-2 border-amber-500/50 hover:border-amber-400 text-left transition-all duration-200 shadow-lg active:scale-95 flex items-center gap-3 cursor-pointer';
                btnB.disabled = false;
            }
        }

        // ⏱️ 10 Saniyelik Canlı Geri Sayım Zamanlayıcısı
        function startQuestionCountdown(seconds) {
            if (GAME.questionInterval) clearInterval(GAME.questionInterval);

            GAME.questionTimer = seconds;
            const timerText = document.getElementById('question-timer-text');
            const timerBar = document.getElementById('question-timer-bar');

            if (timerText) timerText.textContent = \`\${GAME.questionTimer.toFixed(1)}s\`;
            if (timerBar) {
                timerBar.style.width = '100%';
                timerBar.className = 'h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-emerald-400 transition-all duration-100';
            }

            const startTime = performance.now();
            const totalDuration = seconds * 1000;

            GAME.questionInterval = setInterval(() => {
                if (GAME.questionAnswered) {
                    clearInterval(GAME.questionInterval);
                    return;
                }

                const elapsed = performance.now() - startTime;
                const remaining = Math.max(0, (totalDuration - elapsed) / 1000);
                GAME.questionTimer = remaining;

                if (timerText) {
                    timerText.textContent = \`\${remaining.toFixed(1)}s\`;
                    if (remaining <= 3.0) {
                        timerText.className = 'text-xs sm:text-sm font-black font-mono text-rose-400 animate-pulse';
                    } else {
                        timerText.className = 'text-xs sm:text-sm font-black font-mono text-amber-300';
                    }
                }

                if (timerBar) {
                    const pct = Math.max(0, (remaining / seconds) * 100);
                    timerBar.style.width = \`\${pct}%\`;
                    if (remaining <= 3.0) {
                        timerBar.className = 'h-full bg-rose-500 transition-all duration-100';
                    }
                }

                // Süre Doldu!
                if (remaining <= 0) {
                    clearInterval(GAME.questionInterval);
                    handleQuestionTimeout();
                }
            }, 50);
        }

        // 3D Sahnede 2 Şeritli Soru Kapısı (Sol: A, Sağ: B)
        function build2LaneGateMesh(zPos) {
            if (activeGateGroup) scene.remove(activeGateGroup);
            activeGateGroup = new THREE.Group();
            activeGateGroup.position.set(0, 0, zPos);

            // 2 Şerit (Sol: x = -2.2 [A], Sağ: x = 2.2 [B])
            const gateConfigs = [
                { x: -2.2, color: 0x06b6d4, letter: 'A' },
                { x: 2.2, color: 0xf59e0b, letter: 'B' }
            ];

            gateConfigs.forEach(cfg => {
                const archGroup = new THREE.Group();
                archGroup.position.set(cfg.x, 0, 0);

                // Yan Direkler
                [-1.0, 1.0].forEach(px => {
                    const post = new THREE.Mesh(
                        new THREE.CylinderGeometry(0.08, 0.08, 3.4, 8),
                        new THREE.MeshStandardMaterial({ color: cfg.color, emissive: cfg.color, emissiveIntensity: 0.4 })
                    );
                    post.position.set(px, 1.7, 0);
                    archGroup.add(post);
                });

                // Üst Kemer
                const topBar = new THREE.Mesh(
                    new THREE.BoxGeometry(2.3, 0.45, 0.25),
                    new THREE.MeshStandardMaterial({ color: cfg.color, emissive: cfg.color, emissiveIntensity: 0.5 })
                );
                topBar.position.set(0, 3.4, 0);
                archGroup.add(topBar);

                // Şeffaf Işıltılı Portal
                const portalGeo = new THREE.PlaneGeometry(2.0, 3.1);
                const portalMat = new THREE.MeshBasicMaterial({ color: cfg.color, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
                const portal = new THREE.Mesh(portalGeo, portalMat);
                portal.position.set(0, 1.6, 0);
                archGroup.add(portal);

                activeGateGroup.add(archGroup);
            });

            scene.add(activeGateGroup);
        }

        // Kullanıcı A veya B Şıkkını Seçtiğinde
        function handleQuestionAnswerChoice(choiceIndex) {
            if (GAME.questionAnswered || !GAME.isPausedForQuestion) return;
            GAME.questionAnswered = true;

            if (GAME.questionInterval) clearInterval(GAME.questionInterval);

            const chosen = GAME.activeQuestionOptions[choiceIndex];
            const isCorrect = chosen ? chosen.isCorrect : false;

            const btnA = document.getElementById('btn-option-a');
            const btnB = document.getElementById('btn-option-b');
            if (btnA) btnA.disabled = true;
            if (btnB) btnB.disabled = true;

            const chosenBtn = choiceIndex === 0 ? btnA : btnB;
            const otherBtn = choiceIndex === 0 ? btnB : btnA;

            const factBox = document.getElementById('question-fact-box');
            const factContent = document.getElementById('question-fact-content');

            if (isCorrect) {
                // DOĞRU CEVAP
                playSound('correct');
                confetti({ particleCount: 45, spread: 70, origin: { y: 0.5 } });

                if (chosenBtn) {
                    chosenBtn.className = 'p-3.5 sm:p-4 rounded-2xl bg-emerald-600/95 border-2 border-emerald-300 text-left transition-all shadow-[0_0_25px_rgba(16,185,129,0.7)] flex items-center gap-3';
                }

                GAME.score += 100;
                GAME.correctAnswersCount++;
                GAME.streak++;
                if (GAME.streak >= 3) {
                    GAME.score += 150; // Süper seri bonusu
                }
                document.getElementById('hud-score').textContent = GAME.score;

                if (factBox && factContent) {
                    factBox.className = 'block p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/70 text-xs font-bold text-emerald-200 text-center animate-in fade-in';
                    factContent.innerHTML = \`<span class="text-emerald-400 font-black">✓ TEBRİKLER! DOĞRU CEVAP</span><br>\${GAME.currentQuestion.fact}\`;
                }

                // 1.25 saniye sonra soru ekranını kapat ve koşuyu devam ettir
                setTimeout(() => {
                    closeQuestionModalAndResume();
                }, 1300);

            } else {
                // YANLIŞ CEVAP
                playSound('hit');
                GAME.streak = 0;
                GAME.lives -= 1;
                updateLivesHUD();
                triggerDamageFlash();

                if (chosenBtn) {
                    chosenBtn.className = 'p-3.5 sm:p-4 rounded-2xl bg-rose-600/95 border-2 border-rose-300 text-left transition-all shadow-[0_0_25px_rgba(244,63,94,0.7)] flex items-center gap-3';
                }
                // Doğru olan şıkkı yeşil olarak göster
                if (otherBtn) {
                    otherBtn.className = 'p-3.5 sm:p-4 rounded-2xl bg-emerald-700/80 border-2 border-emerald-400 text-left transition-all flex items-center gap-3';
                }

                if (factBox && factContent) {
                    factBox.className = 'block p-3 rounded-xl bg-rose-950/90 border border-rose-500/70 text-xs font-bold text-rose-200 text-center animate-in fade-in';
                    factContent.innerHTML = \`<span class="text-rose-400 font-black">✗ YANLIŞ CEVAP (DOĞRUSU: \${GAME.currentQuestion.ans})</span><br>\${GAME.currentQuestion.fact}\`;
                }

                if (GAME.lives <= 0) {
                    setTimeout(() => {
                        closeQuestionModalAndResume();
                        triggerGameOver();
                    }, 1700);
                } else {
                    setTimeout(() => {
                        closeQuestionModalAndResume();
                    }, 1700);
                }
            }
        }

        // 10 Saniye Süre Dolduğunda
        function handleQuestionTimeout() {
            if (GAME.questionAnswered || !GAME.isPausedForQuestion) return;
            GAME.questionAnswered = true;

            playSound('hit');
            GAME.streak = 0;
            GAME.lives -= 1;
            updateLivesHUD();
            triggerDamageFlash();

            const btnA = document.getElementById('btn-option-a');
            const btnB = document.getElementById('btn-option-b');
            if (btnA) btnA.disabled = true;
            if (btnB) btnB.disabled = true;

            // Doğru olan butonu yeşil göster
            const correctIndex = GAME.activeQuestionOptions.findIndex(o => o.isCorrect);
            const correctBtn = correctIndex === 0 ? btnA : btnB;
            if (correctBtn) {
                correctBtn.className = 'p-3.5 sm:p-4 rounded-2xl bg-emerald-700/90 border-2 border-emerald-400 text-left transition-all flex items-center gap-3';
            }

            const factBox = document.getElementById('question-fact-box');
            const factContent = document.getElementById('question-fact-content');
            if (factBox && factContent) {
                factBox.className = 'block p-3 rounded-xl bg-amber-950/95 border border-amber-500/80 text-xs font-bold text-amber-200 text-center animate-in fade-in';
                factContent.innerHTML = \`<span class="text-amber-400 font-black">⏰ 10 SANİYELİK SÜRE DOLDU! (DOĞRUSU: \${GAME.currentQuestion.ans})</span><br>\${GAME.currentQuestion.fact}\`;
            }

            if (GAME.lives <= 0) {
                setTimeout(() => {
                    closeQuestionModalAndResume();
                    triggerGameOver();
                }, 1800);
            } else {
                setTimeout(() => {
                    closeQuestionModalAndResume();
                }, 1800);
            }
        }

        function closeQuestionModalAndResume() {
            const qHud = document.getElementById('question-hud');
            if (qHud) {
                qHud.classList.add('opacity-0', 'pointer-events-none');
                qHud.classList.remove('opacity-100');
            }
            const cardInner = document.getElementById('question-card-inner');
            if (cardInner) {
                cardInner.classList.add('scale-95');
                cardInner.classList.remove('scale-100');
            }

            // 3D Kapı Kemerini Kaldır
            if (activeGateGroup) {
                scene.remove(activeGateGroup);
                activeGateGroup = null;
            }

            // Koşuyu Kesintisiz ve Yere Oturmuş Olarak Devam Ettir
            GAME.playerY = 0;
            playerGroup.position.y = 0;
            GAME.isJumping = false;
            GAME.playerVY = 0;
            GAME.jumpTimer = 0;

            GAME.isPausedForQuestion = false;
            GAME.isQuestionActive = false;
            GAME.questionAnswered = false;
            GAME.state = 'playing';

            GAME.speed = GAME.baseSpeed;
            GAME.nextQuestionDistance = GAME.distance + 240;

            // Hikâye Modunda 5 Doğru Sonrası Zafer
            if (GAME.mode === 'story' && GAME.correctAnswersCount >= 5) {
                triggerVictory();
            }
        }

        function showFeedbackToast(msg, isSuccess) {`;

code = code.replace(oldSection6Regex, newSection6Code);

// Update doJump and doSlide with ground lock and fast-fall
const oldDoJumpRegex = /function doJump\(\) \{[\s\S]*?\}\s*function doSlide\(\) \{[\s\S]*?\}/;
const newDoJumpSlide = `function doJump() {
            // Soru beklemesinde veya havada iken tekrar zıplamaya izin verme
            if (GAME.state !== 'playing' || GAME.isPausedForQuestion || GAME.isQuestionActive) return;

            // Karakter yalnızca yerde iken ve jetpack yokken zıplayabilir
            if (!GAME.isJumping && GAME.playerY <= 0.05 && GAME.activeBonus !== 'jetpack') {
                GAME.isJumping = true;
                GAME.playerVY = 14;
                GAME.jumpTimer = 0;
                playSound('jump');
            }
        }

        function doSlide() {
            if (GAME.state !== 'playing' || GAME.isPausedForQuestion) return;

            // Karakter zıplarken aşağı kayma tuşuna basarsa anında yere çakılır (Fast-fall Subway Surfers mekaniği)
            if (GAME.isJumping) {
                GAME.playerY = 0;
                playerGroup.position.y = 0;
                GAME.isJumping = false;
                GAME.playerVY = 0;
                GAME.jumpTimer = 0;
            }

            if (!GAME.isSliding) {
                GAME.isSliding = true;
                GAME.slideTimer = 0.75;
                playSound('slide');
            }
        }`;

code = code.replace(oldDoJumpRegex, newDoJumpSlide);

// Update keyboard listener to support A, B, 1, 2, Arrows during question pause
const oldKeydownRegex = /window\.addEventListener\('keydown', \(e\) => \{[\s\S]*?if \(GAME\.state !== 'playing'\) return;/;
const newKeydownStart = `window.addEventListener('keydown', (e) => {
            // Soru bekleme anında A, B, 1, 2 veya Ok tuşlarıyla cevap verme
            if (GAME.isPausedForQuestion) {
                const k = e.key.toLowerCase();
                if (k === 'a' || k === '1' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    handleQuestionAnswerChoice(0);
                    return;
                } else if (k === 'b' || k === '2' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    handleQuestionAnswerChoice(1);
                    return;
                }
            }

            if (GAME.state !== 'playing') return;`;

code = code.replace(oldKeydownRegex, newKeydownStart);

// Update startGameMode to initialize shuffled questions and ground player
const oldStartGameModeRegex = /function startGameMode\(mode\) \{[\s\S]*?updateLivesHUD\(\);/;
const newStartGameMode = `function startGameMode(mode) {
            initAudio();
            GAME.mode = mode;
            GAME.state = 'playing';
            GAME.lives = 3;
            GAME.score = 0;
            GAME.stars = 0;
            GAME.distance = 0;
            GAME.correctAnswersCount = 0;
            GAME.lane = 0;
            GAME.isPausedForQuestion = false;
            GAME.isQuestionActive = false;
            GAME.questionAnswered = false;

            // 50 Soruluk Ay'ın Evreleri Havuzunu Her Oyunda Yeniden Rastgele Karıştır
            GAME.shuffledQuestions = shuffleArray(QUESTIONS_POOL_50);
            GAME.questionPoolIndex = 0;

            // Karakteri kesinlikle yerde başlat
            GAME.playerY = 0;
            playerGroup.position.y = 0;
            GAME.isJumping = false;
            GAME.playerVY = 0;
            GAME.jumpTimer = 0;

            // Meteor ve krater zamanlayıcılarını sıfırla
            if (activeMeteor) {
                scene.remove(activeMeteor.mesh);
                if (activeMeteor.warningMesh) scene.remove(activeMeteor.warningMesh);
                activeMeteor = null;
            }
            meteorNextDistance = 90;

            updateLivesHUD();`;

code = code.replace(oldStartGameModeRegex, newStartGameMode);

fs.writeFileSync(targetPath, code, 'utf8');
if (fs.existsSync(parentPath)) {
    fs.writeFileSync(parentPath, code, 'utf8');
    console.log(`Also synced to parent: ${parentPath}`);
}
console.log('Successfully wrote step 3 of updated kozmik-kosu-3d.html');
