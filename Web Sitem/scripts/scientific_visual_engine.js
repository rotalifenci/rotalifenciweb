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

  // 1. ÖZEL BİLİMSEL MODELLER & DİYAGRAMLAR (Soru Metnindeki Şekil/Model Referansları)

  // 1.1 Güneş Tutulması Numaralandırılmış Model (1: Güneş, 2: Ay, 3: Dünya)
  if (
    (norm.includes('numaralandirilmis') && (norm.includes('golgesinin') || norm.includes('dizilim') || norm.includes('tutulma')) && (norm.includes('2 numarali') || norm.includes('3 numarali'))) ||
    (norm.includes('2 numarali cismin golgesinin') && norm.includes('3 numarali')) ||
    (norm.includes('modelde numaralandirilmis gok cisimleri') && norm.includes('doga olayini'))
  ) {
    return makeImg('/assets/science/gunes_tutulmasi_123.svg', 'Güneş Tutulması Bilimsel Modeli (1: Güneş, 2: Ay, 3: Dünya)');
  }

  // 1.2 Ay Tutulması Harfli Model (G, D, A Dizilimi)
  if (
    (norm.includes('gunes g') && norm.includes('dunya d') && norm.includes('ay a')) ||
    (norm.includes('konumlari verilmistir') && norm.includes('dizilim') && (norm.includes('dolunay') || norm.includes('gece')))
  ) {
    return makeImg('/assets/science/ay_tutulmasi_gda.svg', 'Ay Tutulması Bilimsel Modeli (G: Güneş, D: Dünya, A: Ay)');
  }

  // 1.3 Tutulmalarda X ve Y İle Gösterilen Bilinmeyen Gök Cisimleri
  if (norm.includes('x ile gosterilen') && (norm.includes('tutulma') || norm.includes('golgesinde kalmakta') || norm.includes('ayni dogrultuda'))) {
    return makeImg('/assets/science/ay_tutulmasi_x.svg', 'Ay Tutulması Modeli (Dünya Gölgesindeki X Gök Cismi)');
  }
  if (norm.includes('y ile gosterilen') && (norm.includes('tutulma') || norm.includes('golgesi dunya uzerine') || norm.includes('ayni dogrultuda'))) {
    return makeImg('/assets/science/gunes_tutulmasi_y.svg', 'Güneş Tutulması Modeli (Gölgesi Dünya Üzerine Düşen Y Gök Cismi)');
  }

  // 1.4 Ay'ın Yeni Ay Evresi (Görünmeyen Koyu Kısım & Dünya'dan Görünüm)
  if (
    (norm.includes('koyu renkli kisim') && norm.includes('gorunmeyen kismi') && norm.includes('ana evre')) ||
    (norm.includes('yeni ay') && norm.includes('gunes ile dunya arasindaki'))
  ) {
    return makeImg('/assets/science/ay_yeni_ay_modeli.svg', "Ay'ın Yeni Ay Evresi Bilimsel Modeli (Dünya'dan Görünüm ve Konum)");
  }

  // 1.5 Ay'ın Ardışık Ana Evreleri (A ve B Harfleri ile Gösterilen)
  if (
    (norm.includes('a ve b') || (norm.includes('a evresi') && norm.includes('b evresi'))) &&
    (norm.includes('evre') && (norm.includes('takip eden') || norm.includes('gecis')))
  ) {
    return makeImg('/assets/science/ay_evreleri_a_ve_b.svg', "Ay'ın Ardışık Ana Evreleri (A: İlk Dördün, B: Dolunay)");
  }

  // 1.6 X ve Y Gök Cisimleri (Sıcak gaz bulutu Güneş ve soğuk kayalık Ay)
  if (
    norm.includes('x ve y ile temsil edilen') ||
    (norm.includes('x gok cisminin sicak bir gaz') && norm.includes('y gok cisminin'))
  ) {
    return makeImg('/assets/science/gok_cisimleri_x_y.svg', 'X (Güneş) ve Y (Ay) Gök Cisimleri Karşılaştırmalı Modeli');
  }

  // 1.7 Dış Gezegenler Jüpiter ve Satürn Karşılaştırması
  if (
    (norm.includes('jupiter') && norm.includes('saturn')) ||
    (norm.includes('gazsal gezegenler') && (norm.includes('jupiter') || norm.includes('saturn')))
  ) {
    return makeImg('/assets/science/jupiter_ve_saturn_gazsal_devler.svg', 'Gazsal Dış Gezegenler: Jüpiter ve Satürn');
  }

  // 1.8 Ay'ın Hatalı Yatay Bölünmüş Modeli (Üstü Aydınlık, Altı Karanlık)
  if (
    norm.includes('alt yarisi') && norm.includes('ust yarisi') && (norm.includes('karanlik') || norm.includes('aydinlik'))
  ) {
    return makeImg('/assets/science/ay_hatali_alt_ust_aydinlanma.svg', "Ay'ın Yatay Bölünmüş Hatalı Çizim Modeli");
  }

  // 1.9 Öğrencinin Hazırladığı Güneş Tutulması / Ay Tutulması Modeli
  if (
    norm.includes('ogrenci') && (norm.includes('modeli hazirlamistir') || norm.includes('model hazirlamistir')) &&
    (norm.includes('gunes ay ve dunya') || norm.includes('gunes dunya ve ay') || norm.includes('eksik veya hatali'))
  ) {
    return makeImg('/assets/science/gunes_tutulmasi_123.svg', 'Öğrencinin Hazırladığı Güneş Tutulması Ölçek Modeli');
  }

  // 1.10 Genel Güneş Tutulması
  if (
    norm.includes('gunes tutulma') ||
    (norm.includes('tutulma') && norm.includes('ay') && norm.includes('gunes') && norm.includes('gunduz'))
  ) {
    return makeImg('/assets/science/gunes_tutulmasi_123.svg', 'Güneş Tutulması Bilimsel Şeması ve Gölge Geometrisi');
  }

  // 1.11 Genel Ay Tutulması
  if (
    norm.includes('ay tutulma') ||
    (norm.includes('tutulma') && (norm.includes('kanli ay') || norm.includes('kirmizimsi') || norm.includes('dolunay')))
  ) {
    return makeImg('/assets/science/ay_tutulmasi_gda.svg', 'Ay Tutulması Bilimsel Şeması ve Tam Gölge Konisi');
  }

  // 2. UZAY İSTASYONU (ISS - Uluslararası Uzay İstasyonu)
  if (
    norm.includes('istasyon') ||
    norm.includes('iss') ||
    (norm.includes('insanlarin icinde yasayip') && norm.includes('laboratuvar')) ||
    (norm.includes('astronotlarin icinde yasayip') && norm.includes('deney')) ||
    (norm.includes('uluslararasi is birligi') && norm.includes('uzay'))
  ) {
    return makeImg('/assets/science/iss_space_station.jpg', 'Uluslararası Uzay İstasyonu (ISS)');
  }

  // 3. GÖZLEMEVİ / RASATHANE
  if (
    norm.includes('gozlemevi') ||
    norm.includes('rasathane') ||
    (norm.includes('daglarin yuksek zirve') && norm.includes('aynali')) ||
    (norm.includes('aynali sistem') && norm.includes('derinliklerini incelemek')) ||
    (norm.includes('isik kirlilig') && (norm.includes('gozlem') || norm.includes('teleskop') || norm.includes('sehir'))) ||
    (norm.includes('sehir isik') && norm.includes('dag')) ||
    (norm.includes('sehir') && norm.includes('teleskop'))
  ) {
    return makeImg('/assets/science/observatory_dome.jpg', 'Astronomik Gözlemevi (Rasathane)');
  }

  // 4. GALİLEO VE İLK TELESKOP
  if (
    norm.includes('galileo') ||
    norm.includes('1609') ||
    norm.includes('1610') ||
    (norm.includes('teleskobu ilk kullanan') && norm.includes('astronomi'))
  ) {
    return makeImg('/assets/slides/slide_13_galileo.jpg', 'Galileo Galilei ve İlk Teleskop');
  }

  // 5. UZAY TELESKOBU & OPTİK TELESKOPLAR (Hubble, Mercekli, Aynalı)
  if (
    norm.includes('uzay teleskob') ||
    (norm.includes('teleskop') && !norm.includes('devre')) ||
    (norm.includes('atmosferin dis') && norm.includes('teleskop')) ||
    (norm.includes('hubble') || norm.includes('james webb')) ||
    (norm.includes('mercek') && norm.includes('isigi kirmak'))
  ) {
    return makeImg('/assets/science/space_telescope.jpg', 'Gelişmiş Optik ve Uzay Teleskobu');
  }

  // 6. ASTRONOT UZAY GİYSİSİ (EMU)
  if (
    norm.includes('uzay giysi') ||
    norm.includes('astronot giysi') ||
    (norm.includes('ozel giysi') && norm.includes('astronot'))
  ) {
    return makeImg('/assets/science/astronaut_spacesuit.jpg', 'Astronot Uzay Giysisi (EMU)');
  }

  // 7. MARS KEŞİF ARACI / ROVER / ROBOTİK SONDA / KIZIL GEZEGEN
  if (
    norm.includes('curiosity') ||
    norm.includes('perseverance') ||
    norm.includes('kizil gezegen') ||
    (norm.includes('mars') && (norm.includes('sonda') || norm.includes('toprak analizi') || norm.includes('gezinti') || norm.includes('inis') || norm.includes('demir oksit') || norm.includes('yuzey')))
  ) {
    return makeImg('/assets/science/mars_rover.jpg', 'Mars Keşif Robotu (Rover)');
  }

  // 8. UZAY KİRLİLİĞİ / UZAY ÇÖPÜ
  if (
    norm.includes('uzay kirlilig') ||
    norm.includes('uzay cop') ||
    norm.includes('yorungede birikmis cesitli atik')
  ) {
    return makeImg('/assets/science/space_debris.jpg', 'Uzay Kirliliği ve Enkazlar');
  }

  // 9. AY'A İNİŞ / APOLLO / AY MODÜLÜ
  if (
    norm.includes('apollo') ||
    (norm.includes('ayak basan') && norm.includes('astronot')) ||
    norm.includes('insanli ay')
  ) {
    return makeImg('/assets/science/apollo_lunar_lander.jpg', 'Apollo Ay Modülü ve Ay Yüzeyi');
  }

  // 10. YAPAY UYDU (Haberleşme, Meteoroloji, Gözlem)
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

  // 11. AY'IN EVRELERİ (Özel Evre İsimleri & Döngü)
  if (norm.includes('ilk dordun') || (norm.includes('sag yarisi aydinlik') && (hasWord(norm, 'ay') || norm.includes('model')))) {
    return makeImg('/assets/slides/slide_29_ilk_dordun.jpg', "Ay'ın İlk Dördün Evresi (D Şekli)");
  }
  if (norm.includes('son dordun') || (norm.includes('sol yarisi aydinlik') && (hasWord(norm, 'ay') || norm.includes('model'))) || norm.includes('ters d')) {
    return makeImg('/assets/slides/slide_31_son_dordun.jpg', "Ay'ın Son Dördün Evresi (Ters D)");
  }
  if (norm.includes('dolunay') || norm.includes('tamami aydinlik') || (norm.includes('parlak bir daire') && hasWord(norm, 'ay'))) {
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

  // 12. AY'IN YAPISI, KRATERLER, ATMOSFER
  if (norm.includes('krater') || norm.includes('cukurlar') || norm.includes('meteor carpmasi')) {
    return makeImg('/assets/slides/slide_18_krater_detay.jpg', 'Ay Yüzeyindeki Kraterler');
  }
  if (norm.includes('toz tabakasi') || norm.includes('regolit') || (hasWord(norm, 'ay') && norm.includes('atmosfer'))) {
    return makeImg('/assets/slides/slide_19_moon_atmosphere.jpg', "Ay'ın Yüzeyi ve İnce Atmosferi");
  }

  // 13. GÜNEŞ'İN YAPISI, LEKELERİ, KATMANLARI
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

  // 14. BOYUT VE MESAFE KARŞILAŞTIRMASI (Güneş, Dünya, Ay)
  if (
    (norm.includes('karsilastir') || norm.includes('boyut') || norm.includes('buyukluk') || norm.includes('cap')) &&
    (norm.includes('gunes') || norm.includes('dunya') || hasWord(norm, 'ay'))
  ) {
    return makeImg('/assets/slides/slide_10_size_comparison.jpg', 'Güneş, Dünya ve Ay Boyut Karşılaştırması');
  }

  // 15. HÜCRE, ORGANELLER, BİYOLOJİ
  if (norm.includes('hucre') || norm.includes('mitokondri') || norm.includes('kloroplast') || norm.includes('sitoplazma')) {
    return makeImg('/assets/science/cell_structure.jpg', 'Bitki ve Hayvan Hücresi 3D Karşılaştırması');
  }

  // 16. DİNAMOMETRE / KUVVET VE HAREKET
  if (norm.includes('dinamometre') || (norm.includes('kuvvet') && (norm.includes('newton') || norm.includes('yay') || norm.includes('olcum') || norm.includes('surtunme')))) {
    return makeImg('/assets/science/dynamometer.jpg', 'Hassas Dinamometre (Kuvvet Ölçer)');
  }

  // 17. ELEKTRİK DEVRELERİ (Kesin Kontrol: 'devrim' veya 'evre' ile karışmasın)
  if (
    (hasWord(norm, 'devre') || hasWord(norm, 'devresi') || hasWord(norm, 'devreler') || hasWord(norm, 'devrede')) &&
    (norm.includes('ampul') || norm.includes('anahtar') || norm.includes('pil') || norm.includes('volt') || norm.includes('iletken'))
  ) {
    return makeImg('/assets/science/electric_circuit.jpg', 'Basit Elektrik Devresi Deney Seti');
  }

  // 18. DNA VE GENETİK KOD
  if (norm.includes('dna') || norm.includes('genetik') || norm.includes('nukleotid') || norm.includes('kromozom')) {
    return makeImg('/assets/science/dna_structure.jpg', 'DNA Çift Sarmalı ve Genetik Yapı');
  }

  // 19. FOTOSENTEZ & SU DÖNGÜSÜ & HAVA OLAYLARI
  if (norm.includes('fotosentez')) {
    return makeImg('/assets/slides/slide_14_photosynthesis.jpg', 'Fotosentez ve Canlılık');
  }
  if (norm.includes('su dongusu') || norm.includes('buharlas') || norm.includes('yagis')) {
    return makeImg('/assets/slides/slide_14_water_cycle.jpg', 'Doğada Su Döngüsü');
  }

  // 20. DERİN UZAY, GALAKSİ, BULUTSU, EVREN, GEZEGENLER
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
    norm.includes('neptun') ||
    norm.includes('uranus') ||
    norm.includes('merkur') ||
    norm.includes('venus')
  ) {
    return makeImg('/assets/slides/slide_3_universe_space.jpg', 'Derin Uzay, Galaksiler ve Gezegenler');
  }

  // 21. GÜNEŞ KÜRESİ / AY KÜRESİ / DÜNYA KÜRESİ
  if (norm.includes('gunes') && !hasWord(norm, 'ay')) {
    return makeImg('/images/sun.jpg', 'Güneş Küresi');
  }
  if (hasWord(norm, 'ay') && !norm.includes('gunes')) {
    return makeImg('/assets/slides/slide_16_moon_globe.jpg', 'Ay Küresi');
  }
  if (norm.includes('dunya')) {
    return makeImg('/assets/slides/slide_4_earth_globe.jpg', 'Dünya Gezegeni');
  }

  // Eğer eski anlamsız SVG veya geçersiz görsel varsa derin uzay görseli sağla
  if (cur.includes('<svg') && !cur.includes('rf-science-img')) {
    return makeImg('/assets/slides/slide_3_universe_space.jpg', 'Bilimsel Uzay ve Fen İnceleme Modeli');
  }

  return currentVisual;
}

module.exports = {
  getScientificVisual,
  normalizeText,
  hasWord,
  makeImg
};
