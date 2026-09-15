// ============================================================
// FEN BILIMLERI PASSAPAROLA - OYUN MOTORU & SESLER (UTF-8)
// ============================================================

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

  playTone(freq, type, duration, startTime) {
    if (!this.enabled) return;
    this.init();
    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + (startTime || 0));
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime + (startTime || 0));
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (startTime || 0) + (duration || 0.15));
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + (startTime || 0));
      osc.stop(this.ctx.currentTime + (startTime || 0) + (duration || 0.15));
    } catch (e) {}
  }

  correct() {
    this.init();
    this.playTone(523.25, 'triangle', 0.1, 0);     // C5
    this.playTone(659.25, 'triangle', 0.1, 0.08);  // E5
    this.playTone(783.99, 'triangle', 0.2, 0.16);  // G5
    this.playTone(1046.50, 'triangle', 0.35, 0.24); // C6
  }

  wrong() {
    this.init();
    this.playTone(180, 'sawtooth', 0.18, 0);
    this.playTone(130, 'sawtooth', 0.32, 0.14);
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

// Turkce Karakter Buyutme ve Karsilastirma Yardimcisi
function trUpper(str) {
  return (str || '').trim().toLocaleUpperCase('tr-TR');
}

class PassaparolaGame {
  constructor(questions) {
    this.questions = questions;
    this.currentIndex = 0;
    this.state = new Array(questions.length).fill('unanswered');
    this.sound = new SoundFX();

    this.initialTime = 240; // 4 dakika
    this.timeLeft = this.initialTime;
    this.timerInterval = null;
    this.isTimerRunning = false;

    this.isTwoTeams = false;
    this.activeTeam = 'A';
    this.scores = { A: 0, B: 0 };

    this.initDOM();
    this.renderWheel();
    this.bindEvents();
    this.loadQuestion(0);
  }

  initDOM() {
    this.wheelContainer = document.getElementById('wheelContainer');
    this.centerLetter = document.getElementById('centerLetter');
    this.qBadge = document.getElementById('qBadge');
    this.qGrade = document.getElementById('qGrade');
    this.qText = document.getElementById('qText');
    this.qReveal = document.getElementById('qReveal');
    this.txtAnswer = document.getElementById('txtAnswer');
    this.timerText = document.getElementById('timerText');
    this.timerChip = document.getElementById('timerChip');

    this.statPuan = document.getElementById('statPuan');
    this.statDogru = document.getElementById('statDogru');
    this.statYanlis = document.getElementById('statYanlis');
    this.statPas = document.getElementById('statPas');

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
    this.teamAPill = document.getElementById('teamAPill');
    this.teamBPill = document.getElementById('teamBPill');
    this.teamAScore = document.getElementById('teamAScore');
    this.teamBScore = document.getElementById('teamBScore');

    this.endModal = document.getElementById('endModal');
    this.btnPlayAgain = document.getElementById('btnPlayAgain');
  }

  renderWheel() {
    const center = document.getElementById('wheelCenter');
    this.wheelContainer.innerHTML = '';
    if (center) this.wheelContainer.appendChild(center);

    const total = this.questions.length;
    const size = this.wheelContainer.clientWidth || 360;
    const centerX = size / 2;
    const centerY = size / 2;

    let nodeRadius = 18;
    if (size <= 260) nodeRadius = 12;
    else if (size <= 320) nodeRadius = 14;

    const trackRadius = centerX - nodeRadius - 8;
    this.nodes = [];

    this.questions.forEach((item, index) => {
      const node = document.createElement('div');
      node.className = 'letter-node ' + this.state[index];
      if (index === this.currentIndex) node.classList.add('active');
      node.innerText = item.letter;
      node.dataset.index = index;

      const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
      const x = centerX + trackRadius * Math.cos(angle) - nodeRadius;
      const y = centerY + trackRadius * Math.sin(angle) - nodeRadius;

      node.style.left = x + 'px';
      node.style.top = y + 'px';

      node.addEventListener('click', () => {
        this.loadQuestion(index);
      });

      this.wheelContainer.appendChild(node);
      this.nodes.push(node);
    });
  }

  loadQuestion(index) {
    this.currentIndex = index;
    const item = this.questions[index];

    this.nodes.forEach((n, idx) => {
      n.className = 'letter-node ' + this.state[idx];
      if (idx === index) n.classList.add('active');
    });

    this.centerLetter.innerText = item.letter;
    this.qBadge.innerText = item.letter + ' HARFİ (' + item.category + ')';
    this.qGrade.innerText = item.grade;
    this.qText.innerText = item.question;

    this.txtAnswer.value = '';
    this.qReveal.classList.remove('show');
    this.qReveal.innerText = 'DOĞRU CEVAP: ' + item.answer;

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
    // 1. Tur: Yanıtlanmamış soruları ara
    for (let i = 0; i < this.questions.length; i++) {
      const idx = (this.currentIndex + 1 + i) % this.questions.length;
      if (this.state[idx] === 'unanswered') {
        this.loadQuestion(idx);
        return;
      }
    }

    // 2. Tur: Pas geçilen sorulara geri dön (Passaparola mantığı)
    for (let i = 0; i < this.questions.length; i++) {
      const idx = (this.currentIndex + 1 + i) % this.questions.length;
      if (this.state[idx] === 'passed') {
        this.loadQuestion(idx);
        return;
      }
    }

    // Tüm sorular tamamlandı!
    this.endGame();
  }

  updateStats() {
    const dCount = this.state.filter(s => s === 'correct').length;
    const yCount = this.state.filter(s => s === 'wrong').length;
    const pCount = this.state.filter(s => s === 'passed').length;

    this.statDogru.innerText = dCount;
    this.statYanlis.innerText = yCount;
    this.statPas.innerText = pCount;
    this.statPuan.innerText = this.scores[this.activeTeam];

    this.teamAScore.innerText = this.scores.A;
    this.teamBScore.innerText = this.scores.B;
  }

  startTimer() {
    if (this.initialTime === 0) return;
    if (this.isTimerRunning) return;
    this.isTimerRunning = true;
    this.btnTimerToggle.innerHTML = '<span>⏸️</span> Durdur';

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
    this.btnTimerToggle.innerHTML = '<span>▶️</span> Başlat';
  }

  toggleTimer() {
    if (this.isTimerRunning) this.stopTimer();
    else this.startTimer();
  }

  updateTimerDisplay() {
    const mins = Math.floor(this.timeLeft / 60);
    const secs = this.timeLeft % 60;
    this.timerText.innerText = (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;

    // Süre Uyarıları
    this.timerChip.classList.remove('warn-orange', 'warn-red');
    if (this.timeLeft <= 10) {
      this.timerChip.classList.add('warn-red');
    } else if (this.timeLeft <= 30) {
      this.timerChip.classList.add('warn-orange');
    }
  }

  endGame(isTimeOut) {
    this.stopTimer();
    this.sound.win();
    this.triggerConfetti();

    const dCount = this.state.filter(s => s === 'correct').length;
    const yCount = this.state.filter(s => s === 'wrong').length;
    const pCount = this.state.filter(s => s === 'passed').length;

    document.getElementById('mStatD').innerText = dCount;
    document.getElementById('mStatY').innerText = yCount;
    document.getElementById('mStatP').innerText = pCount;
    document.getElementById('mStatScore').innerText = this.scores[this.activeTeam] + ' Puan';

    const title = document.getElementById('modalTitle');
    const subtitle = document.getElementById('modalSubtitle');

    if (isTimeOut) {
      title.innerText = '⏰ Süre Bitti!';
      subtitle.innerText = 'Tebrikler! Toplam ' + dCount + ' doğru ile harika bir Fen performansı sergilediniz.';
    } else {
      title.innerText = '🎉 TEBRİKLER!';
      subtitle.innerText = 'Tüm Passaparola çarkını tamamladınız! Harika bir Fen Şampiyonu!';
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
    this.renderWheel();
    this.loadQuestion(0);
  }

  triggerConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#00e5ff', '#16a34a', '#ffd600', '#dc2626', '#7c4dff', '#ffffff'];

    for (let i = 0; i < 140; i++) {
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
        p.vy += 0.3;
        p.alpha -= 0.009;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      frames++;
      if (frames < 130) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    animate();
  }

  bindEvents() {
    this.btnCorrect.addEventListener('click', () => this.answer('correct'));
    this.btnWrong.addEventListener('click', () => this.answer('wrong'));
    this.btnPass.addEventListener('click', () => this.answer('passed'));

    this.btnShowAnswer.addEventListener('click', () => {
      this.qReveal.classList.toggle('show');
    });

    this.btnTimerToggle.addEventListener('click', () => this.toggleTimer());
    this.btnReset.addEventListener('click', () => {
      if (confirm('Oyunu sıfırlamak istediğinize emin misiniz?')) this.resetGame();
    });

    this.btnPlayAgain.addEventListener('click', () => this.resetGame());

    this.btnSound.addEventListener('click', () => {
      this.sound.enabled = !this.sound.enabled;
      this.btnSound.innerHTML = this.sound.enabled ? '<span>🔊</span> Ses Açık' : '<span>🔇</span> Ses Kapalı';
    });

    this.btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    this.btnTeamMode.addEventListener('click', () => {
      this.isTwoTeams = !this.isTwoTeams;
      this.teamBar.style.display = this.isTwoTeams ? 'flex' : 'none';
      this.btnTeamMode.innerHTML = this.isTwoTeams ? '<span>👥</span> 2 Takım' : '<span>👤</span> Tekli';
    });

    this.teamAPill.addEventListener('click', () => {
      this.activeTeam = 'A';
      this.teamAPill.classList.add('active');
      this.teamBPill.classList.remove('active');
      this.updateStats();
    });

    this.teamBPill.addEventListener('click', () => {
      this.activeTeam = 'B';
      this.teamBPill.classList.add('active');
      this.teamAPill.classList.remove('active');
      this.updateStats();
    });

    // Turkce Karakter Destekli Enter Kontrolu
    this.txtAnswer.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = trUpper(this.txtAnswer.value);
        const currentAns = trUpper(this.questions[this.currentIndex].answer);
        if (val === currentAns || (currentAns.includes(val) && val.length >= 3)) {
          this.answer('correct');
        } else if (val.length > 0) {
          this.answer('wrong');
        }
      }
    });

    // Klavye Kısayolları (D, Y, P, C, T)
    window.addEventListener('keydown', (e) => {
      if (document.activeElement === this.txtAnswer) return;

      const key = trUpper(e.key);
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

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.renderWheel();
      }, 100);
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.game = new PassaparolaGame(PASSAPAROLA_DATA);
});
