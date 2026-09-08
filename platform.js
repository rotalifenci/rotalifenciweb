/* ============================================================
   ROTALI FENCİ – Platform JS
   platform.js
   ============================================================ */

'use strict';

/* ── Navbar: hamburger toggle ── */
(function () {
  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('navMobile');
  const overlay    = document.getElementById('mobileOverlay');

  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (overlay) overlay.style.display = 'block';
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    if (overlay) overlay.style.display = 'none';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', function () {
    if (mobileMenu.classList.contains('open')) closeMenu();
    else openMenu();
  });

  if (overlay) overlay.addEventListener('click', closeMenu);

  // Close on mobile link click
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
})();

/* ── Search overlay ── */
(function () {
  const searchBtns   = document.querySelectorAll('[data-search-open]');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchInput   = document.getElementById('searchInput');
  const searchClose   = document.getElementById('searchClose');
  const searchResults = document.getElementById('searchResults');

  if (!searchOverlay) return;

  const searchData = [
    { icon: '🔬', title: 'Konu Anlatımları', sub: 'Tüm sınıflar', href: 'index.html#konular' },
    { icon: '📝', title: 'Testler', sub: 'Tüm sınıflar', href: 'index.html#testler' },
    { icon: '🎮', title: 'Passaparola Oyunu', sub: 'Oyunlar', href: 'passaparola.html' },
    { icon: '🎯', title: 'LGS Fen Bilimleri', sub: '8. Sınıf', href: '8-sinif.html' },
    { icon: '📚', title: '5. Sınıf Konuları', sub: '5. Sınıf', href: '5-sinif.html' },
    { icon: '📚', title: '6. Sınıf Konuları', sub: '6. Sınıf', href: '6-sinif.html' },
    { icon: '📚', title: '7. Sınıf Konuları', sub: '7. Sınıf', href: '7-sinif.html' },
    { icon: '📚', title: '8. Sınıf Konuları', sub: '8. Sınıf', href: '8-sinif.html' },
    { icon: '🧪', title: 'Etkinlikler', sub: 'Deneyler & STEM', href: 'etkinlikler.html' },
    { icon: '📰', title: 'Blog', sub: 'Fen Bilimleri Dünyası', href: 'blog.html' },
    { icon: '⚡', title: 'Elektrik Devreleri', sub: '7. Sınıf', href: '7-sinif.html' },
    { icon: '🌍', title: 'Dünya, Güneş ve Ay', sub: '6. Sınıf', href: '6-sinif.html' },
    { icon: '🧬', title: 'Hücre ve DNA', sub: '8. Sınıf', href: '8-sinif.html' },
    { icon: '⚗️', title: 'Kimyasal Tepkimeler', sub: '8. Sınıf', href: '8-sinif.html' },
    { icon: '💧', title: 'Basınç', sub: '7. Sınıf', href: '7-sinif.html' },
    { icon: '🌱', title: 'Ekosistem ve Doğa', sub: '5. Sınıf', href: '5-sinif.html' },
    { icon: '🔭', title: 'Işık ve Ses', sub: '6. Sınıf', href: '6-sinif.html' },
    { icon: '⚽', title: 'Kuvvet ve Hareket', sub: '6. Sınıf', href: '6-sinif.html' },
    { icon: '🌡️', title: 'Madde ve Isı', sub: '5. Sınıf', href: '5-sinif.html' },
    { icon: '🚀', title: 'Uzay ve Gökyüzü', sub: '7. Sınıf', href: '7-sinif.html' },
    { icon: '🎮', title: 'Fen Bilimleri Quiz', sub: 'Oyunlar', href: 'oyunlar.html' },
    { icon: '⚡', title: 'Hızlı Soru', sub: 'Oyunlar', href: 'oyunlar.html' },
  ];

  function openSearch() {
    searchOverlay.classList.add('open');
    searchInput.focus();
    renderResults('');
  }

  function closeSearch() {
    searchOverlay.classList.remove('open');
    searchInput.value = '';
  }

  searchBtns.forEach(function (btn) {
    btn.addEventListener('click', openSearch);
  });

  if (searchClose) searchClose.addEventListener('click', closeSearch);

  searchOverlay.addEventListener('click', function (e) {
    if (e.target === searchOverlay) closeSearch();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && !searchOverlay.classList.contains('open')) {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape' && searchOverlay.classList.contains('open')) closeSearch();
  });

  function renderResults(query) {
    if (!searchResults) return;
    const q = query.trim().toLowerCase();
    const filtered = q === ''
      ? searchData.slice(0, 8)
      : searchData.filter(function (item) {
          return item.title.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q);
        });

    if (filtered.length === 0) {
      searchResults.innerHTML = '<div class="search-empty">🔎 Sonuç bulunamadı. Farklı bir kelime dene!</div>';
      return;
    }

    searchResults.innerHTML = filtered.map(function (item) {
      return (
        '<a href="' + item.href + '" class="search-result-item">' +
        '<div class="search-result-icon">' + item.icon + '</div>' +
        '<div class="search-result-info"><div style="font-weight:700;font-size:.92rem;color:#1E293B">' + item.title + '</div>' +
        '<small>' + item.sub + '</small></div>' +
        '</a>'
      );
    }).join('');
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      renderResults(searchInput.value);
    });
  }
})();

/* ── Active nav link highlight ── */
(function () {
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__link, .navbar__mobile-link').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && (href === path || (path === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });
})();

/* ── Scroll to top ── */
(function () {
  var btn = document.getElementById('scrollTop');
  if (!btn) return;
  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) btn.classList.add('visible');
    else btn.classList.remove('visible');
  }, { passive: true });
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ── Smooth reveal animation (IntersectionObserver) ── */
(function () {
  if (!window.IntersectionObserver) return;
  var els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    observer.observe(el);
  });

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      el.style.opacity = '';
      el.style.transform = '';
    });
  });

  /* Add revealed style */
  var style = document.createElement('style');
  style.textContent = '[data-reveal]{opacity:0;transform:translateY(20px);transition:opacity .5s ease,transform .5s ease}[data-reveal].revealed{opacity:1!important;transform:none!important}';
  document.head.appendChild(style);
})();

/* ── Tab switching (sınıf sayfaları) ── */
window.initTabs = function () {
  document.querySelectorAll('.tabs').forEach(function (tabGroup) {
    tabGroup.querySelectorAll('.tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.dataset.tab;
        var parent = tabGroup.closest('.tab-section') || document;

        tabGroup.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        parent.querySelectorAll('.tab-panel').forEach(function (panel) {
          panel.hidden = panel.id !== target;
        });
      });
    });
  });
};

document.addEventListener('DOMContentLoaded', function () {
  if (window.initTabs) window.initTabs();
});

/* ── Contact form (frontend only) ── */
(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;
  var msg = document.getElementById('contactMsg');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = form.querySelector('.form-submit');
    btn.textContent = '✓ Mesajınız gönderildi!';
    btn.style.background = '#16A34A';
    btn.disabled = true;
    if (msg) { msg.textContent = 'Teşekkürler! En kısa sürede dönüş yapacağız.'; msg.style.display = 'block'; }
    setTimeout(function () {
      btn.textContent = '📨 Gönder';
      btn.style.background = '';
      btn.disabled = false;
      if (msg) msg.style.display = 'none';
      form.reset();
    }, 4000);
  });
})();
