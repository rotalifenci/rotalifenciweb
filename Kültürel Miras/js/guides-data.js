// ============================================================================
// TÜBİTAK 2204-B – SİVAS'IN DİJİTAL TARİH ATLASI
// Dijital Keşif Rehberleri: EREN ve AYBÜKE
// ============================================================================

window.SIVAS_GUIDES = {
  currentGuide: "eren", // 'eren' veya 'aybuke'
  voiceEnabled: true,
  isMinimized: false,

  guides: {
    eren: {
      id: "eren",
      name: "Eren",
      title: "Tarih ve Mimari Kaşifi",
      role: "Saha Araştırmacısı",
      age: "14 Yaşında",
      avatarSvg: `<svg viewBox="0 0 120 120" class="guide-avatar-img">
        <defs>
          <linearGradient id="erenBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1e3a5f"/>
            <stop offset="100%" stop-color="#0f172a"/>
          </linearGradient>
          <linearGradient id="erenSkin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fbd3b6"/>
            <stop offset="100%" stop-color="#e2ab88"/>
          </linearGradient>
          <linearGradient id="erenHair" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#3e2723"/>
            <stop offset="100%" stop-color="#1a0f0d"/>
          </linearGradient>
          <linearGradient id="erenVest" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#d4af37"/>
            <stop offset="100%" stop-color="#b45309"/>
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="56" fill="url(#erenBg)" stroke="#d4af37" stroke-width="3"/>
        <!-- Beden & Saha Yeleği -->
        <path d="M 28,110 C 28,88 42,80 60,80 C 78,80 92,88 92,110 Z" fill="#2d3748"/>
        <path d="M 38,84 L 48,110 L 72,110 L 82,84 Z" fill="url(#erenVest)"/>
        <!-- Yaka & Boyun -->
        <rect x="52" y="72" width="16" height="14" rx="3" fill="url(#erenSkin)"/>
        <!-- Yüz -->
        <ellipse cx="60" cy="52" rx="22" ry="25" fill="url(#erenSkin)"/>
        <!-- Saç -->
        <path d="M 38,46 C 38,28 46,24 60,24 C 74,24 82,28 82,46 C 78,38 72,34 60,34 C 48,34 42,38 38,46 Z" fill="url(#erenHair)"/>
        <!-- Kulaklar -->
        <circle cx="38" cy="54" r="5" fill="url(#erenSkin)"/>
        <circle cx="82" cy="54" r="5" fill="url(#erenSkin)"/>
        <!-- Gözler -->
        <circle cx="51" cy="50" r="3" fill="#1a202c"/>
        <circle cx="69" cy="50" r="3" fill="#1a202c"/>
        <circle cx="52" cy="49" r="1" fill="#ffffff"/>
        <circle cx="70" cy="49" r="1" fill="#ffffff"/>
        <!-- Kaşlar -->
        <path d="M 47,44 Q 52,42 56,44" stroke="#3e2723" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="M 64,44 Q 68,42 73,44" stroke="#3e2723" stroke-width="2" stroke-linecap="round" fill="none"/>
        <!-- Gülümseyen Ağız -->
        <path d="M 53,63 Q 60,69 67,63" stroke="#991b1b" stroke-width="2" stroke-linecap="round" fill="none"/>
        <!-- Burun -->
        <circle cx="60" cy="56" r="1.5" fill="#c68a68"/>
        <!-- Büyüteç Rozeti -->
        <circle cx="80" cy="95" r="9" fill="none" stroke="#f59e0b" stroke-width="2"/>
        <line x1="86" y1="101" x2="94" y2="109" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
      </svg>`,
      desc: "Mimarlık ve arkeoloji meraklısı bir araştırmacı. Eserlerin yapım tekniklerini, taçkapı süslemelerini ve plan şemalarını keşfetmende sana rehberlik edecek.",
      welcomeSpeech: "Merhaba! Ben Eren. Sivas'ın köklü tarihini ve mimari şaheserlerini birlikte keşfedeceğiz. Haritadan bir ilçe seç veya doğrudan bir tarihî esere tıkla!",
      prompts: {
        map: "Sivas'ın 17 ilçesini keşfedebilirsin! Örneğin Divriği'ye tıklayarak UNESCO mirası ulu camiyi görebilir ya da Merkez ilçedeki medreseleri inceleyebilirsin.",
        monuments: "Katalogdaki eserlerin üzerindeki 'Eseri İncele' butonuna basarak 14 başlıklı derinlemesine akademik incelemeyi açabilirsin.",
        viewer3d: "3B model üzerindeki mavi noktalara tıklayarak taçkapı, kitabe ve mukarnas gibi mimari ayrıntıları yakından inceleyelim!",
        inscription: "Kitabe üzerindeki epigrafik filtreleri kullanarak yüzyıllar öncesinden kalan taş yazıtın detaylarını çözebilirsin.",
        comparison: "Aynı meydandaki Çifte Minareli Medrese ile Gök Medrese'yi yan yana karşılaştırıp aralarındaki taş süsleme farklarını gözlemleyelim.",
        timeline: "Zaman çizelgesinde Selçuklu, Mengücekli ve İlhanlı dönemleri arasındaki tarihi geçişleri takip edebilirsin.",
        fieldwork: "Yerinde keşfe çıkmadan önce gezi hedeflerini tamamla ve gözlem notlarını çalışma kâğıdına kaydetmeyi unutma!",
        sources: "TÜBİTAK projemizin bilimsel gücü güvenilir kaynaklara dayanır. Vakıflar ve TTK tescilli kaynakları buradan inceleyebilirsin."
      }
    },

    aybuke: {
      id: "aybuke",
      name: "Aybüke",
      title: "Kültürel Miras ve Epigrafi Uzmanı",
      role: "Belge & Kitabe Araştırmacısı",
      age: "14 Yaşında",
      avatarSvg: `<svg viewBox="0 0 120 120" class="guide-avatar-img">
        <defs>
          <linearGradient id="aybukeBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#134e4a"/>
            <stop offset="100%" stop-color="#0f172a"/>
          </linearGradient>
          <linearGradient id="aybukeSkin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fee3cf"/>
            <stop offset="100%" stop-color="#e8b898"/>
          </linearGradient>
          <linearGradient id="aybukeHair" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#5a2e17"/>
            <stop offset="100%" stop-color="#2a1408"/>
          </linearGradient>
          <linearGradient id="aybukeVest" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0d9488"/>
            <stop offset="100%" stop-color="#042f2e"/>
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="56" fill="url(#aybukeBg)" stroke="#14b8a6" stroke-width="3"/>
        <!-- Beden & Kıyafet -->
        <path d="M 28,110 C 28,88 42,80 60,80 C 78,80 92,88 92,110 Z" fill="#1f2937"/>
        <path d="M 40,84 L 50,110 L 70,110 L 80,84 Z" fill="url(#aybukeVest)"/>
        <!-- Boyun -->
        <rect x="52" y="72" width="16" height="14" rx="3" fill="url(#aybukeSkin)"/>
        <!-- Yüz -->
        <ellipse cx="60" cy="52" rx="21" ry="24" fill="url(#aybukeSkin)"/>
        <!-- Saç (Örgülü & Tokalı) -->
        <path d="M 36,44 C 36,24 45,22 60,22 C 75,22 84,24 84,44 C 84,62 82,72 78,76 C 75,66 76,50 74,44 C 68,36 52,36 46,44 C 44,50 45,66 42,76 C 38,72 36,62 36,44 Z" fill="url(#aybukeHair)"/>
        <!-- Toka / Bandana -->
        <path d="M 37,34 C 45,30 75,30 83,34" stroke="#f59e0b" stroke-width="3" fill="none" stroke-linecap="round"/>
        <!-- Kulaklar -->
        <circle cx="39" cy="54" r="4.5" fill="url(#aybukeSkin)"/>
        <circle cx="81" cy="54" r="4.5" fill="url(#aybukeSkin)"/>
        <circle cx="39" cy="56" r="1.5" fill="#f59e0b"/>
        <circle cx="81" cy="56" r="1.5" fill="#f59e0b"/>
        <!-- Gözler -->
        <circle cx="51" cy="50" r="3" fill="#1e293b"/>
        <circle cx="69" cy="50" r="3" fill="#1e293b"/>
        <circle cx="52" cy="49" r="1" fill="#ffffff"/>
        <circle cx="70" cy="49" r="1" fill="#ffffff"/>
        <!-- Kirpikler -->
        <path d="M 48,46 L 46,44" stroke="#2a1408" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M 72,46 L 74,44" stroke="#2a1408" stroke-width="1.5" stroke-linecap="round"/>
        <!-- Kaşlar -->
        <path d="M 47,43 Q 51,41 55,43" stroke="#3e2723" stroke-width="1.8" stroke-linecap="round" fill="none"/>
        <path d="M 65,43 Q 69,41 73,43" stroke="#3e2723" stroke-width="1.8" stroke-linecap="round" fill="none"/>
        <!-- Gülümseme -->
        <path d="M 54,63 Q 60,68 66,63" stroke="#be123c" stroke-width="2" stroke-linecap="round" fill="none"/>
        <circle cx="60" cy="56" r="1.5" fill="#d99b7b"/>
        <!-- Parşömen İkonu -->
        <rect x="76" y="88" width="16" height="20" rx="2" fill="#fef3c7" stroke="#b45309" stroke-width="1.5"/>
        <line x1="79" y1="93" x2="89" y2="93" stroke="#b45309" stroke-width="1"/>
        <line x1="79" y1="97" x2="89" y2="97" stroke="#b45309" stroke-width="1"/>
        <line x1="79" y1="101" x2="86" y2="101" stroke="#b45309" stroke-width="1"/>
      </svg>`,
      desc: "Yazılı kaynaklar, kitabeler ve kültürel miras bilinci uzmanı. Eserlerin üzerindeki kitabeleri okumanı, banileri ve tarihsel kanıtları değerlendirmeni sağlayacak.",
      welcomeSpeech: "Selam! Ben Aybüke. Taşların üzerindeki kitabeler tarihin en kesin kanıtlarıdır. Birlikte kitabeleri okuyacak ve geçmişin izini süreceğiz!",
      prompts: {
        map: "Haritadaki 17 ilçemizden dilediğini seçebilirsin. Unutma; her eserin konumu kendi gerçek coğrafi noktasında gösterilmektedir.",
        monuments: "Katalogdaki eserlerin kitabelerini ve tarihsel kanıtlarını incele; böylece ezberlemek yerine kanıtlardan sonuca ulaşabilirsin.",
        viewer3d: "Taş işçiliği ve firuze çinileri 3B ortamda yakından görebilirsin. Kitabe noktasına tıkladığında orijinal yazıt ekranı açılacak!",
        inscription: "Kitabe bize eserin banisini, yapılış tarihini ve inşa amacını bildirir. Çeviriyi okuduktan sonra altındaki araştırma sorusunu cevapla!",
        comparison: "Tarihsel çıkarım yaparken 'İddiam → Kanıtım → Gerekçem → Sonucum' şablonunu kullan ve raporunu PDF olarak indir.",
        timeline: "Zaman çizelgesindeki eserlerin hangi devletler döneminde yapıldığını incele; Sivas'ın neden bir kültür başkenti olduğunu daha iyi anlayacaksın.",
        fieldwork: "Okul Dışı Öğrenme modülü ile hem dijital ortamda hem de gerçek mekânda gözlem yaparak araştırma raporunu oluşturabilirsin.",
        sources: "Kullandığımız bütün bilgiler Kültür ve Turizm Bakanlığı, Vakıflar Genel Müdürlüğü ve akademik yayınlarla teyit edilmiştir."
      }
    }
  },

  getActiveGuide() {
    return this.guides[this.currentGuide] || this.guides.eren;
  },

  setGuide(guideId) {
    if (this.guides[guideId]) {
      this.currentGuide = guideId;
      localStorage.setItem("sivas_active_guide", guideId);
      this.updateUI();
      this.speak(this.getActiveGuide().welcomeSpeech);
    }
  },

  toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
    localStorage.setItem("sivas_guide_voice", this.voiceEnabled ? "1" : "0");
    if (!this.voiceEnabled && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.updateUI();
  },

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    const widget = document.getElementById("guideFloatingWidget");
    if (widget) {
      widget.classList.toggle("minimized", this.isMinimized);
    }
  },

  updateUI() {
    const guide = this.getActiveGuide();
    
    // Header / Toolbar Selector Buttons
    document.querySelectorAll(".guide-btn-pick").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-guide") === guide.id);
    });

    // Widget Elements
    const widgetAvatar = document.getElementById("guideWidgetAvatar");
    const widgetName = document.getElementById("guideWidgetName");
    const widgetTitle = document.getElementById("guideWidgetTitle");
    const voiceBtn = document.getElementById("btnToggleGuideVoice");

    if (widgetAvatar) widgetAvatar.innerHTML = guide.avatarSvg;
    if (widgetName) widgetName.textContent = guide.name;
    if (widgetTitle) widgetTitle.textContent = guide.title;
    
    if (voiceBtn) {
      voiceBtn.classList.toggle("active", this.voiceEnabled);
      voiceBtn.innerHTML = this.voiceEnabled ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark"></i>';
      voiceBtn.title = this.voiceEnabled ? "Sesli Anlatımı Kapat" : "Sesli Anlatımı Aç";
    }
  },

  showSpeech(text, contextKey) {
    const guide = this.getActiveGuide();
    const message = text || (contextKey && guide.prompts[contextKey]) || guide.welcomeSpeech;
    
    const bubble = document.getElementById("guideSpeechText");
    const container = document.getElementById("guideSpeechBubble");
    
    if (bubble) {
      bubble.textContent = message;
    }
    if (container) {
      container.style.display = "block";
      container.classList.remove("fade-out");
      container.classList.add("fade-in");
    }

    if (this.voiceEnabled) {
      this.speak(message);
    }
  },

  speak(text) {
    if (!this.voiceEnabled || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Mevcut seslendirmeyi durdur

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "tr-TR";
    utterance.rate = 1.0;
    utterance.pitch = this.currentGuide === "eren" ? 1.05 : 1.15; // Aybüke hafif daha tiz, Eren genç araştırmacı tonu

    // Türkçe ses bulma
    const voices = window.speechSynthesis.getVoices();
    const trVoice = voices.find(v => v.lang.startsWith("tr"));
    if (trVoice) {
      utterance.voice = trVoice;
    }

    window.speechSynthesis.speak(utterance);
  },

  init() {
    const saved = localStorage.getItem("sivas_active_guide");
    if (saved && this.guides[saved]) {
      this.currentGuide = saved;
    }
    const savedVoice = localStorage.getItem("sivas_guide_voice");
    if (savedVoice !== null) {
      this.voiceEnabled = savedVoice === "1";
    }
    this.updateUI();
  }
};
