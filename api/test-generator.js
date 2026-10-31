const { buildZKitapHtml } = require('./zkitap_engine.js');

/**
 * Rotalı Fenci - Yaprak Test & İnteraktif Sınav Oluşturucu Motoru
 * Hem Çoktan Seçmeli hem de Açık Uçlu (Klasik) ve Kısa Cevaplı sınavları tam ekran MEB formatında destekler.
 * 3D Sinematik 2 Sütunlu Aydınlık (Açık Renk) Slayt / Player Formatı.
 * 
 * Özellikler:
 * - 2 Sütunlu Sayfa Düzeni (%56 Sol İçerik / %42 Sağ Görsel)
 * - Aydınlık (Light Theme) yüksek kontrastlı, okunaklı tipografi (#0f172a)
 * - Sınav esnasında ipucu ve cevaplar KESİNLİKLE GİZLİDİR (display: none)
 * - Kaç soru varsa o kadar süre veren CANLI KRONOMETRE (Örn: 30 soru = 30 dakika)
 * - Sınav bitiminde Sonuç Karnesi ve Çözümleri İnceleme desteği
 * - Sabit (Sticky) alt kontrol menüsü: Önceki, Sayfa No, Kronometre, Sonraki, Soru Rotaları, Ses, Tam Ekran, Yazdır
 * - Sol alt köşede Instagram "@rotalifenci" filigranı
 * - MEB Maarif Modeli A4 yazdırma uyumluluğu
 */

const __fsLogo = require('fs');
const __pathLogo = require('path');

// Logo her ortamda (Vercel / yerel / dosya) görünsün diye veri URI olarak gömülür
let LOGO_SRC = '/assets/rotali-fenci-logo.jpg';
(function loadLogoSrc() {
  const tries = [
    () => require('./_logo-data.js'),
    () => require('../api/_logo-data.js'),
    () => 'data:image/jpeg;base64,' + __fsLogo.readFileSync(__pathLogo.join(process.cwd(), 'assets', 'rotali-fenci-logo.jpg')).toString('base64'),
    () => 'data:image/jpeg;base64,' + __fsLogo.readFileSync(__pathLogo.join(__dirname, '..', 'assets', 'rotali-fenci-logo.jpg')).toString('base64')
  ];
  for (const t of tries) {
    try { const v = t(); if (v) { LOGO_SRC = v; return; } } catch (e) {}
  }
})();

function foldTr(s) {
  return String(s || '')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Şekil/görsel içindeki yazılardan CEVAP sızıntılarını temizler (yerine "?" konur)
const SVG_BANNED_PHRASES = [
  'kure', 'kuresel', 'yildiz', 'isik kaynagi', 'isi kaynagi', 'isi ve isik', 'dogal uydu',
  'geometrik sekil', 'krater', 'atmosfer', 'regolit', 'toz tabakasi', 'gaz kuresi',
  'katman', 'cap', 'perspektif', 'ay tozu', 'gunes lekesi', 'dogru cevap', 'cevap', 'ipucu'
];
function sanitizeVisualSvg(svg, answer) {
  if (!svg || typeof svg !== 'string') return svg;
  const a = foldTr(answer);
  const aWords = a.split(' ').filter(w => w.length >= 3);
  let out = svg.replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '').replace(/<desc[^>]*>[\s\S]*?<\/desc>/gi, '');
  out = out.replace(/<text([^>]*)>([\s\S]*?)<\/text>/gi, (m, attrs, inner) => {
    const raw = inner.replace(/<[^>]+>/g, '').trim();
    const t = foldTr(raw);
    if (!t || raw === '?') return m;
    const words = t.split(' ');
    let leak = SVG_BANNED_PHRASES.some(k => (k.length <= 3 ? words.includes(k) : t.includes(k)));
    if (!leak && a.length >= 2) {
      leak = a.length <= 3 ? words.includes(a) : (t.includes(a) || (t.length >= 4 && a.includes(t)));
    }
    if (!leak && aWords.length) {
      leak = aWords.some(w => words.includes(w) || t.includes(w));
    }
    return leak ? '<text' + attrs + '>?</text>' : m;
  });
  return out;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateSlug(text) {
  const trMap = {
    'ç': 'c', 'Ç': 'c', 'ğ': 'g', 'Ğ': 'g', 'ı': 'i', 'İ': 'i', 'I': 'i',
    'ö': 'o', 'Ö': 'o', 'ş': 's', 'Ş': 's', 'ü': 'u', 'Ü': 'u'
  };
  return String(text || 'test')
    .split('')
    .map(c => trMap[c] || c)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}

function normalizeOptions(rawOpts) {
  if (!rawOpts) return null;
  const normalized = {};

  if (Array.isArray(rawOpts)) {
    const keys = ['A', 'B', 'C', 'D'];
    rawOpts.forEach((val, i) => {
      if (i < 4 && val !== undefined && val !== null) {
        normalized[keys[i]] = String(val).trim();
      }
    });
  } else if (typeof rawOpts === 'object') {
    Object.keys(rawOpts).forEach(k => {
      const cleanKey = k.toUpperCase().replace(/[^ABCD]/g, '').slice(0, 1);
      if (['A', 'B', 'C', 'D'].includes(cleanKey)) {
        normalized[cleanKey] = String(rawOpts[k] || '').trim();
      }
    });
  }

  const validKeys = Object.keys(normalized).filter(k => normalized[k].length > 0);
  if (validKeys.length >= 2) {
    ['A', 'B', 'C', 'D'].forEach(k => {
      if (!normalized[k]) normalized[k] = '';
    });
    return normalized;
  }
  return null;
}

function buildInteractiveTestHtml({
  title,
  grade = "5",
  unit = "1. Ünite: Gökyüzündeki Komşularımız ve Biz",
  subject = "Fen Bilimleri",
  questions = []
}) {
  return buildZKitapHtml({
    title,
    grade,
    unit,
    subject,
    questions,
    logoSrc: LOGO_SRC
  });
}

module.exports = {
  buildInteractiveTestHtml,
  generateSlug,
  normalizeOptions
};
