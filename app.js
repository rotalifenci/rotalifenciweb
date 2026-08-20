// Web Audio API Sound Generator (Zero External Dependencies)
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  playTone(freq, type = 'sine', duration = 0.15, startTime = 0) {
    if (!this.enabled) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime + startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + startTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + startTime);
      osc.stop(this.ctx.currentTime + startTime + duration);
    } catch (e) {}
  }

  correct() {
    this.init();
    this.playTone(523.25, 'triangle', 0.1, 0);       // C5
    this.playTone(659.25, 'triangle', 0.1, 0.08);    // E5
    this.playTone(783.99, 'triangle', 0.25, 0.16);   // G5
    this.playTone(1046.50, 'triangle', 0.4, 0.24);   // C6
  }

  wrong() {
    this.init();
    this.playTone(180, 'sawtooth', 0.2, 0);
    this.playTone(140, 'sawtooth', 0.35, 0.15);
  }

  pass() {
    this.init();
    this.playTone(440, 'sine', 0.1, 0);
    this.playTone(330, 'sine', 0.15, 0.08);
  }

  win() {
    this.init();
    const notes = [523.25, 523.25, 523.25, 659.25, 783.99, 1046.50];
    const delays = [0, 0.12, 0.24, 0.36, 0.52, 0.72];
    notes.forEach((n, i) => this.playTone(n, 'triangle', 0.35, delays[i]));
  }
}

// Game State & Engine
class PassaparolaGame {
  constructor(questions) {
    this.questions = questions;
    this.currentIndex = 0;
    this.state = new Array(questions.length).fill('unanswered'); // unanswered, correct, wrong, passed
    this.sound = new SoundFX();

    // Timer Settings
    this.initialTime = 240; // 4 minutes default
    this.timeLeft = this.initialTime;
    this.timerInterval = null;
    this.isTimerRunning = false;

    // Team Mode
    this.isTwoTeams = false;
    this.activeTeam = 'A'; // 'A' or 'B'
    this.scores = { A: 0, B: 0 };

    this.initDOM();
    this.renderWheel();
    this.bindEvents();
    this.loadQuestion(0);
  }

  initDOM() {
    this.wheelContainer = document.getElementById('wheelContainer');
    this.centerLetter = document.getElementById('centerLetter');
    this.centerStats = document.getElementById('centerStats');
    this.qBadge = document.getElementById('qBadge');
    this.qGrade = document.getElementById('qGrade');
    this.qText = document.getElementById('qText');
    this.qReveal = document.getElementById('qReveal');
    this.txtAnswer = document.getElementById('txtAnswer');
    this.timerText = document.getElementById('timerText');
    this.timerBox = document.getElementById('timerBox');

    this.btnCorrect = document.getElementById('btnCorrect');
    this.btnWrong = document.getElementById('btnWrong');
    this.btnPass = document.getElementById('btnPass');
    this.btnShowAnswer = document.getElementById('btnShowAnswer');
    this.btnTimerToggle = document.getElementById('btnTimerToggle');
    this.btnReset = document.getElementById('btnReset');
    this.btnSound = document.getElementById('btnSound');
    this.btnFullscreen = document.getElementById('btnFullscreen');
    this.btnTeamMode = document.getElementById('btnTeamMode');

    this.teamBar = document.getElementById('teamBar');
    this.teamACard = document.getElementById('teamACard');
    this.teamBCard = document.getElementById('teamBCard');
    this.teamAScore = document.getElementById('teamAScore');
    this.teamBScore = document.getElementById('teamBScore');

    this.endModal = document.getElementById('endModal');
    this.btnPlayAgain = document.getElementById('btnPlayAgain');
  }

  renderWheel() {
    this.wheelContainer.innerHTML = '';
    const total = this.questions.length;
    const radius = 200; // px
    const centerX = 240;
    const centerY = 240;

    this.nodes = [];

    this.questions.forEach((item, index) => {
      const node = document.createElement('div');
      node.className = 'letter-node';
      node.innerText = item.letter;
      node.dataset.index = index;

      // Calculate position around circular track
      const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle) - 22;
      const y = centerY + radius * Math.sin(angle) - 22;

      node.style.left = `${x}px`;
      node.style.top = `${y}px`;

      node.addEventListener('click', () => {
        this.loadQuestion(index);
      });

      this.wheelContainer.appendChild(node);
      this.nodes.push(node);
    });

    // Re-append center element
    const center = document.getElementById('wheelCenter');
    if (center) this.wheelContainer.appendChild(center);
  }

  loadQuestion(index) {
    this.currentIndex = index;
    const item = this.questions[index];

    // Update Wheel classes
    this.nodes.forEach((n, idx) => {
      n.className = `letter-node ${this.state[idx]}`;
      if (idx === index) n.classList.add('active');
    });

    // Center display
    this.centerLetter.innerText = item.letter;
    this.qBadge.innerText = `${item.letter} Harfi (${item.category})`;
    this.qGrade.innerText = item.grade;
    this.qText.innerText = item.question;

    // Reset Answer Input & Reveal
    this.txtAnswer.value = '';
    this.qReveal.classList.remove('show');
    this.qReveal.innerText = item.answer;

    this.updateStats();
  }

  answer(status) {
    if (!this.isTimerRunning && this.initialTime > 0) {
      this.startTimer();
    }

    this.state[this.currentIndex] = status;

    if (status === 'correct') {
      this.sound.correct();
      this.scores[this.activeTeam] += 10;
    } else if (status === 'wrong') {
      this.sound.wrong();
    } else if (status === 'passed') {
      this.sound.pass();
    }

    this.updateStats();
    this.moveToNextUnanswered();
  }

  moveToNextUnanswered() {
    // Check if any unanswered or passed questions remain
    const remainingIndices = [];
    
    // First pass: try to find next truly unanswered
    for (let i = 0; i < this.questions.length; i++) {
      const idx = (this.currentIndex + 1 + i) % this.questions.length;
      if (this.state[idx] === 'unanswered') {
        this.loadQuestion(idx);
        return;
      }
    }

    // Second pass: if no unanswered, check for passed
    for (let i = 0; i < this.questions.length; i++) {
      const idx = (this.currentIndex + 1 + i) % this.questions.length;
      if (this.state[idx] === 'passed') {
        this.loadQuestion(idx);
        return;
      }
    }

    // If all are answered (correct or wrong), end game!
    this.endGame();
  }

  updateStats() {
    const dCount = this.state.filter(s => s === 'correct').length;
    const yCount = this.state.filter(s => s === 'wrong').length;
    const pCount = this.state.filter(s => s === 'passed').length;

    document.getElementById('statD').innerText = dCount;
    document.getElementById('statY').innerText = yCount;
    document.getElementById('statP').innerText = pCount;

    this.teamAScore.innerText = this.scores.A;
    this.teamBScore.innerText = this.scores.B;
  }

  startTimer() {
    if (this.initialTime === 0) return; // infinite mode
    if (this.isTimerRunning) return;
    this.isTimerRunning = true;
    this.btnTimerToggle.innerHTML = `<span>⏸️</span> Süreyi Durdur`;

    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.updateTimerDisplay();

      if (this.timeLeft <= 0) {
        this.stopTimer();
        this.sound.wrong();
        this.endGame(true);
      }
    }, 1000);
  }

  stopTimer() {
    this.isTimerRunning = false;
    clearInterval(this.timerInterval);
    this.btnTimerToggle.innerHTML = `<span>▶️</span> Süreyi Başlat`;
  }

  toggleTimer() {
    if (this.isTimerRunning) this.stopTimer();
    else this.startTimer();
  }

  updateTimerDisplay() {
    const mins = Math.floor(this.timeLeft / 60);
    const secs = this.timeLeft % 60;
    this.timerText.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    if (this.timeLeft <= 30) {
      this.timerBox.classList.add('warning');
    } else {
      this.timerBox.classList.remove('warning');
    }
  }

  endGame(isTimeOut = false) {
    this.stopTimer();
    this.sound.win();
    this.triggerConfetti();

    const dCount = this.state.filter(s => s === 'correct').length;
    const yCount = this.state.filter(s => s === 'wrong').length;
    const pCount = this.state.filter(s => s === 'passed').length;

    document.getElementById('mStatD').innerText = dCount;
    document.getElementById('mStatY').innerText = yCount;
    document.getElementById('mStatScore').innerText = `${this.scores[this.activeTeam]} Puan`;

    const title = document.getElementById('modalTitle');
    const subtitle = document.getElementById('modalSubtitle');

    if (isTimeOut) {
      title.innerText = "⏰ Süre Bitti!";
      subtitle.innerText = `Harika bir performans sergilediniz! Toplam ${dCount} doğru cevapladınız.`;
    } else {
      title.innerText = "🏆 Tebrikler! Çark Tamamlandı!";
      subtitle.innerText = `Fen Bilimleri Şampiyonu! 28 soruyu tamamladınız.`;
    }

    this.endModal.classList.add('open');
  }

  resetGame() {
    this.stopTimer();
    this.timeLeft = this.initialTime;
    this.updateTimerDisplay();
    this.state.fill('unanswered');
    this.scores = { A: 0, B: 0 };
    this.endModal.classList.remove('open');
    this.nodes.forEach(n => n.className = 'letter-node');
    this.loadQuestion(0);
  }

  triggerConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#00e5ff', '#00e676', '#ffd600', '#ff1744', '#7c4dff', '#ffffff'];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 18,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1
      });
    }

    let frames = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3; // gravity
        p.alpha -= 0.008;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      frames++;
      if (frames < 140) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    animate();
  }

  bindEvents() {
    // Action Buttons
    this.btnCorrect.addEventListener('click', () => this.answer('correct'));
    this.btnWrong.addEventListener('click', () => this.answer('wrong'));
    this.btnPass.addEventListener('click', () => this.answer('passed'));

    this.btnShowAnswer.addEventListener('click', () => {
      this.qReveal.classList.toggle('show');
    });

    this.btnTimerToggle.addEventListener('click', () => this.toggleTimer());
    this.btnReset.addEventListener('click', () => {
      if (confirm("Oyunu sıfırlamak istediğinize emin misiniz?")) this.resetGame();
    });

    this.btnPlayAgain.addEventListener('click', () => this.resetGame());

    // Sound Toggle
    this.btnSound.addEventListener('click', () => {
      this.sound.enabled = !this.sound.enabled;
      this.btnSound.innerHTML = this.sound.enabled ? `<span>🔊</span> Ses Açık` : `<span>🔇</span> Ses Kapalı`;
    });

    // Fullscreen
    this.btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    // Team Switch
    this.btnTeamMode.addEventListener('click', () => {
      this.isTwoTeams = !this.isTwoTeams;
      this.teamBar.style.display = this.isTwoTeams ? 'flex' : 'none';
      this.btnTeamMode.innerHTML = this.isTwoTeams ? `<span>👥</span> 2 Takım Modu` : `<span>👤</span> Tekli Mod`;
    });

    this.teamACard.addEventListener('click', () => {
      this.activeTeam = 'A';
      this.teamACard.classList.add('active-team');
      this.teamBCard.classList.remove('active-team');
    });

    this.teamBCard.addEventListener('click', () => {
      this.activeTeam = 'B';
      this.teamBCard.classList.add('active-team');
      this.teamACard.classList.remove('active-team');
    });

    // Answer text input enter check
    this.txtAnswer.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = this.txtAnswer.value.trim().toUpperCase();
        const currentAns = this.questions[this.currentIndex].answer.toUpperCase();
        if (val === currentAns) {
          this.answer('correct');
        } else if (val.length > 0) {
          this.answer('wrong');
        }
      }
    });

    // Keyboard Hotkeys for Teacher
    window.addEventListener('keydown', (e) => {
      if (document.activeElement === this.txtAnswer) return;

      const key = e.key.toUpperCase();
      if (key === 'D') this.answer('correct');
      else if (key === 'Y') this.answer('wrong');
      else if (key === 'P' || e.key === ' ') {
        e.preventDefault();
        this.answer('passed');
      } else if (key === 'C') {
        this.qReveal.classList.toggle('show');
      } else if (key === 'T') {
        this.toggleTimer();
      }
    });
  }
}

// Start Game on DOM Load
window.addEventListener('DOMContentLoaded', () => {
  window.game = new PassaparolaGame(PASSAPAROLA_DATA);
});
