/**
 * Rotalı Fenci - Bilimsel & Gerçekçi Soru Görsel Motoru
 * MEB ve Türkiye Yüzyılı Maarif Modeli Standartlarına Tam Uyumlu
 */

function normalizeText(str) {
  return String(str || '')
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasWord(normText, word) {
  const normWord = normalizeText(word);
  const regex = new RegExp(`(^|\\s)${normWord}(\\s|$)`);
  return regex.test(normText);
}

function makeImg(src, alt) {
  return `<img src="${src}" alt="${alt}" class="rf-science-img" style="max-width:100%; max-height:48vh; object-fit:contain; border-radius:12px; box-shadow:0 4px 14px rgba(0,0,0,0.08);">`;
}

/**
 * Soru metnini ve seçeneklerini analiz ederek gerçekçi bilimsel görseli belirler.
 */
function getScientificVisual(questionText, options = {}, currentVisual = '') {
  const norm = normalizeText(questionText);
  const cur = String(currentVisual || '');

  // 1. UZAY İSTASYONU (ISS - Uluslararası Uzay İstasyonu)
  if (
    norm.includes('istasyon') ||
    norm.includes('iss') ||
    (norm.includes('uluslararasi') && norm.includes('astronot') && norm.includes('yapi')) ||
    (norm.includes('astronot') && norm.includes('deney') && norm.includes('yapi'))
  ) {
    return makeImg('/assets/science/iss_space_station.jpg', 'Uluslararası Uzay İstasyonu (ISS)');
  }

  // 2. GÖZLEMEVİ / RASATHANE
  if (
    norm.includes('gozlemevi') ||
    norm.includes('rasathane') ||
    (norm.includes('daglarin yuksek zirve') && norm.includes('aynali')) ||
    (norm.includes('aynali sistem') && norm.includes('derinliklerini incelemek')) ||
    norm.includes('isik kirlilig') ||
    (norm.includes('sehir isik') && norm.includes('dag')) ||
    (norm.includes('sehir') && norm.includes('teleskop'))
  ) {
    return makeImg('/assets/science/observatory_dome.jpg', 'Astronomik Gözlemevi (Rasathane)');
  }

  // 3. GALİLEO VE İLK TELESKOP
  if (
    norm.includes('galileo') ||
    norm.includes('1609') ||
    norm.includes('1610') ||
    (norm.includes('teleskobu ilk kullanan') && norm.includes('astronomi'))
  ) {
    return makeImg('/assets/slides/slide_13_galileo.jpg', 'Galileo Galilei ve İlk Teleskop');
  }

  // 4. UZAY TELESKOBU & OPTİK TELESKOPLAR (Hubble, Mercekli, Aynalı)
  if (
    norm.includes('uzay teleskob') ||
    norm.includes('teleskop') ||
    (norm.includes('atmosferin dis') && norm.includes('teleskop')) ||
    (norm.includes('bakim ve onarim') && norm.includes('arac') && norm.includes('uzay')) ||
    (norm.includes('hubble') || norm.includes('james webb')) ||
    norm.includes('mercek') ||
    norm.includes('isigi kirmak suretiyle')
  ) {
    return makeImg('/assets/science/space_telescope.jpg', 'Gelişmiş Optik ve Uzay Teleskobu');
  }

  // 5. ASTRONOT UZAY GİYSİSİ (EMU)
  if (
    norm.includes('uzay giysi') ||
    norm.includes('astronot giysi') ||
    (norm.includes('ozel giysi') && norm.includes('astronot'))
  ) {
    return makeImg('/assets/science/astronaut_spacesuit.jpg', 'Astronot Uzay Giysisi (EMU)');
  }

  // 6. MARS KEŞİF ARACI / ROVER / ROBOTİK SONDA / KIZIL GEZEGEN
  if (
    norm.includes('curiosity') ||
    norm.includes('perseverance') ||
    norm.includes('kizil gezegen') ||
    (norm.includes('mars') && (norm.includes('sonda') || norm.includes('toprak analizi') || norm.includes('gezinti') || norm.includes('inis') || norm.includes('demir oksit') || norm.includes('yuzey')))
  ) {
    return makeImg('/assets/science/mars_rover.jpg', 'Mars Keşif Robotu (Rover)');
  }

  // 7. UZAY KİRLİLİĞİ / UZAY ÇÖPÜ
  if (
    norm.includes('uzay kirlilig') ||
    norm.includes('uzay cop') ||
    norm.includes('yorungede birikmis cesitli atik')
  ) {
    return makeImg('/assets/science/space_debris.jpg', 'Uzay Kirliliği ve Enkazlar');
  }

  // 8. AY'A İNİŞ / APOLLO / AY MODÜLÜ
  if (
    norm.includes('apollo') ||
    (norm.includes('ayak basan') && norm.includes('astronot')) ||
    norm.includes('insanli ay')
  ) {
    return makeImg('/assets/science/apollo_lunar_lander.jpg', 'Apollo Ay Modülü ve Ay Yüzeyi');
  }

  // 9. YAPAY UYDU (Haberleşme, Meteoroloji, Gözlem)
  if (
    norm.includes('yapay uydu') ||
    norm.includes('turksat') ||
    norm.includes('gokturk') ||
    norm.includes('rasat') ||
    norm.includes('imece') ||
    (norm.includes('dunya etrafinda dolanan insan yapimi') && !norm.includes('istasyon'))
  ) {
    return makeImg('/assets/science/satellite_orbit.jpg', 'Yapay Uydu ve Yörüngesi');
  }

  // 10. AY'IN EVRELERİ (Özel Evre İsimleri)
  if (norm.includes('ilk dordun') || (norm.includes('sag yarisi aydinlik') && hasWord(norm, 'ay'))) {
    return makeImg('/assets/slides/slide_29_ilk_dordun.jpg', "Ay'ın İlk Dördün Evresi (D Şekli)");
  }
  if (norm.includes('son dordun') || (norm.includes('sol yarisi aydinlik') && hasWord(norm, 'ay')) || (norm.includes('ters d') && hasWord(norm, 'ay'))) {
    return makeImg('/assets/slides/slide_31_son_dordun.jpg', "Ay'ın Son Dördün Evresi (Ters D)");
  }
  if (norm.includes('dolunay') || (norm.includes('tamami aydinlik') && hasWord(norm, 'ay'))) {
    return makeImg('/assets/slides/slide_30_dolunay.jpg', "Ay'ın Dolunay Evresi");
  }
  if (norm.includes('yeni ay') || (norm.includes('karanlik') && norm.includes('gorunmeyen') && norm.includes('ana evre'))) {
    return makeImg('/assets/slides/slide_28_yeni_ay.jpg', "Ay'ın Yeni Ay Evresi");
  }
  if (hasWord(norm, 'hilal')) {
    return makeImg('/assets/slides/slide_32_hilal.jpg', "Ay'ın Hilal Evresi");
  }
  if (norm.includes('siskin ay')) {
    return makeImg('/assets/slides/slide_33_siskin_ay.jpg', "Ay'ın Şişkin Ay Evresi");
  }
  if (norm.includes('evre') && hasWord(norm, 'ay')) {
    return makeImg('/assets/slides/slide_34_eight_phases.jpg', "Ay'ın Evreleri Bilimsel Modeli");
  }

  // 11. AY'IN YAPISI, KRATERLER, ATMOSFER
  if (norm.includes('krater') || norm.includes('cukurlar') || norm.includes('meteor carpmasi')) {
    return makeImg('/assets/slides/slide_18_krater_detay.jpg', 'Ay Yüzeyindeki Kraterler');
  }
  if (norm.includes('toz tabakasi') || norm.includes('regolit') || (hasWord(norm, 'ay') && norm.includes('atmosfer'))) {
    return makeImg('/assets/slides/slide_19_moon_atmosphere.jpg', "Ay'ın Yüzeyi ve İnce Atmosferi");
  }

  // 12. GÜNEŞ'İN YAPISI, LEKELERİ, KATMANLARI
  if (norm.includes('gunes leke') || (norm.includes('gunes') && norm.includes('koyu renkli bolge'))) {
    return makeImg('/assets/slides/slide_13_sunspots.jpg', 'Güneş Lekeleri (Fotosfer)');
  }
  if (norm.includes('katman') && norm.includes('gunes')) {
    return makeImg('/assets/slides/slide_7_sun_layers.jpg', "Güneş'in İç ve Dış Katmanları");
  }
  if (norm.includes('gunes') && (norm.includes('kendi ekseni etrafinda') || norm.includes('donus'))) {
    return makeImg('/assets/slides/slide_12_sun_rotation.jpg', "Güneş'in Kendi Ekseni Etrafında Dönüşü");
  }
  if (norm.includes('fuzyon') || (norm.includes('isi ve isik kaynagi') && norm.includes('gunes'))) {
    return makeImg('/assets/slides/slide_8_fusion_energy.jpg', "Güneş'in Nükleer Füzyon Enerjisi");
  }

  // 13. BOYUT VE MESAFE KARŞILAŞTIRMASI (Güneş, Dünya, Ay)
  if (
    (norm.includes('karsilastir') || norm.includes('boyut') || norm.includes('buyukluk') || norm.includes('cap')) &&
    (norm.includes('gunes') || norm.includes('dunya') || hasWord(norm, 'ay'))
  ) {
    return makeImg('/assets/slides/slide_10_size_comparison.jpg', 'Güneş, Dünya ve Ay Boyut Karşılaştırması');
  }

  // 14. HÜCRE, ORGANELLER, BİYOLOJİ
  if (norm.includes('hucre') || norm.includes('mitokondri') || norm.includes('kloroplast') || norm.includes('sitoplazma')) {
    return makeImg('/assets/science/cell_structure.jpg', 'Bitki ve Hayvan Hücresi 3D Karşılaştırması');
  }

  // 15. DİNAMOMETRE / KUVVET VE HAREKET
  if (norm.includes('dinamometre') || (norm.includes('kuvvet') && (norm.includes('newton') || norm.includes('yay') || norm.includes('olcum') || norm.includes('surtunme')))) {
    return makeImg('/assets/science/dynamometer.jpg', 'Hassas Dinamometre (Kuvvet Ölçer)');
  }

  // 16. ELEKTRİK DEVRELERİ
  if (norm.includes('devre') || norm.includes('ampul') || norm.includes('anahtar') || norm.includes('pil')) {
    return makeImg('/assets/science/electric_circuit.jpg', 'Basit Elektrik Devresi Deney Seti');
  }

  // 17. DNA VE GENETİK KOD
  if (norm.includes('dna') || norm.includes('genetik') || norm.includes('nukleotid') || norm.includes('kromozom')) {
    return makeImg('/assets/science/dna_structure.jpg', 'DNA Çift Sarmalı ve Genetik Yapı');
  }

  // 18. FOTOSENTEZ & SU DÖNGÜSÜ & HAVA OLAYLARI
  if (norm.includes('fotosentez')) {
    return makeImg('/assets/slides/slide_14_photosynthesis.jpg', 'Fotosentez ve Canlılık');
  }
  if (norm.includes('su dongusu') || norm.includes('buharlas') || norm.includes('yagis')) {
    return makeImg('/assets/slides/slide_14_water_cycle.jpg', 'Doğada Su Döngüsü');
  }

  // 19. DERİN UZAY, GALAKSİ, BULUTSU, EVREN, GEZEGENLER
  if (
    norm.includes('galaksi') ||
    norm.includes('samanyolu') ||
    norm.includes('andromeda') ||
    norm.includes('bulutsu') ||
    norm.includes('nebula') ||
    norm.includes('kara delik') ||
    norm.includes('yildiz') ||
    norm.includes('evren') ||
    norm.includes('gezegen') ||
    norm.includes('jupiter') ||
    norm.includes('saturn') ||
    norm.includes('neptun') ||
    norm.includes('uranus') ||
    norm.includes('merkur') ||
    norm.includes('venus')
  ) {
    return makeImg('/assets/slides/slide_3_universe_space.jpg', 'Derin Uzay, Galaksiler ve Gezegenler');
  }

  // 20. GÜNEŞ KÜRESİ / AY KÜRESİ / DÜNYA KÜRESİ
  if (norm.includes('gunes') && !hasWord(norm, 'ay')) {
    return makeImg('/images/sun.jpg', 'Güneş Küresi');
  }
  if (hasWord(norm, 'ay') && !norm.includes('gunes')) {
    return makeImg('/assets/slides/slide_16_moon_globe.jpg', 'Ay Küresi');
  }
  if (norm.includes('dunya')) {
    return makeImg('/assets/slides/slide_4_earth_globe.jpg', 'Dünya Gezegeni');
  }

  // Eğer eski SVG varsa ve hiçbir kurala uymadıysa, anlamsız/boş çizim yerine derin uzay görselini koy
  if (cur.includes('<svg')) {
    return makeImg('/assets/slides/slide_3_universe_space.jpg', 'Bilimsel Uzay ve Fen İnceleme Modeli');
  }

  return currentVisual;
}

module.exports = {
  getScientificVisual,
  normalizeText,
  hasWord
};
