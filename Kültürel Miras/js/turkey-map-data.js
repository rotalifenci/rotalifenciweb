// MİRAS-3B: 81 İl Etkileşimli Türkiye Haritası Coğrafi Veri ve Sınır Katmanı
// TÜBİTAK 2204-B Tarih Projesi — Osmanlı Eserlerine Yönelik Dijital ve Etkileşimli Okul Dışı Öğrenme Platformu

(function () {
  const PROVINCES_RAW = [
    { plaka: "01", id: "adana", name: "Adana", region: "Akdeniz", lat: 37.00, lon: 35.32 },
    { plaka: "02", id: "adiyaman", name: "Adıyaman", region: "Güneydoğu Anadolu", lat: 37.76, lon: 38.28 },
    { plaka: "03", id: "afyonkarahisar", name: "Afyonkarahisar", region: "Ege", lat: 38.75, lon: 30.54 },
    { plaka: "04", id: "agri", name: "Ağrı", region: "Doğu Anadolu", lat: 39.72, lon: 43.05 },
    { plaka: "05", id: "amasya", name: "Amasya", region: "Karadeniz", lat: 40.65, lon: 35.83 },
    { plaka: "06", id: "ankara", name: "Ankara", region: "İç Anadolu", lat: 39.93, lon: 32.85 },
    { plaka: "07", id: "antalya", name: "Antalya", region: "Akdeniz", lat: 36.90, lon: 30.69 },
    { plaka: "08", id: "artvin", name: "Artvin", region: "Karadeniz", lat: 41.18, lon: 41.82 },
    { plaka: "09", id: "aydin", name: "Aydın", region: "Ege", lat: 37.84, lon: 27.84 },
    { plaka: "10", id: "balikesir", name: "Balıkesir", region: "Marmara", lat: 39.65, lon: 27.88 },
    { plaka: "11", id: "bilecik", name: "Bilecik", region: "Marmara", lat: 40.14, lon: 29.98 },
    { plaka: "12", id: "bingol", name: "Bingöl", region: "Doğu Anadolu", lat: 38.88, lon: 40.50 },
    { plaka: "13", id: "bitlis", name: "Bitlis", region: "Doğu Anadolu", lat: 38.40, lon: 42.11 },
    { plaka: "14", id: "bolu", name: "Bolu", region: "Karadeniz", lat: 40.73, lon: 31.61 },
    { plaka: "15", id: "burdur", name: "Burdur", region: "Akdeniz", lat: 37.72, lon: 30.29 },
    { plaka: "16", id: "bursa", name: "Bursa", region: "Marmara", lat: 40.18, lon: 29.06 },
    { plaka: "17", id: "canakkale", name: "Çanakkale", region: "Marmara", lat: 40.15, lon: 26.41 },
    { plaka: "18", id: "cankiri", name: "Çankırı", region: "İç Anadolu", lat: 40.60, lon: 33.62 },
    { plaka: "19", id: "corum", name: "Çorum", region: "Karadeniz", lat: 40.55, lon: 34.95 },
    { plaka: "20", id: "denizli", name: "Denizli", region: "Ege", lat: 37.77, lon: 29.09 },
    { plaka: "21", id: "diyarbakir", name: "Diyarbakır", region: "Güneydoğu Anadolu", lat: 37.91, lon: 40.23 },
    { plaka: "22", id: "edirne", name: "Edirne", region: "Marmara", lat: 41.68, lon: 26.56 },
    { plaka: "23", id: "elazig", name: "Elazığ", region: "Doğu Anadolu", lat: 38.67, lon: 39.22 },
    { plaka: "24", id: "erzincan", name: "Erzincan", region: "Doğu Anadolu", lat: 39.75, lon: 39.49 },
    { plaka: "25", id: "erzurum", name: "Erzurum", region: "Doğu Anadolu", lat: 39.90, lon: 41.27 },
    { plaka: "26", id: "eskisehir", name: "Eskişehir", region: "İç Anadolu", lat: 39.77, lon: 30.52 },
    { plaka: "27", id: "gaziantep", name: "Gaziantep", region: "Güneydoğu Anadolu", lat: 37.06, lon: 37.38 },
    { plaka: "28", id: "giresun", name: "Giresun", region: "Karadeniz", lat: 40.91, lon: 38.39 },
    { plaka: "29", id: "gumushane", name: "Gümüşhane", region: "Karadeniz", lat: 40.46, lon: 39.48 },
    { plaka: "30", id: "hakkari", name: "Hakkâri", region: "Doğu Anadolu", lat: 37.57, lon: 43.74 },
    { plaka: "31", id: "hatay", name: "Hatay", region: "Akdeniz", lat: 36.35, lon: 36.28 },
    { plaka: "32", id: "isparta", name: "Isparta", region: "Akdeniz", lat: 37.82, lon: 30.75 },
    { plaka: "33", id: "mersin", name: "Mersin", region: "Akdeniz", lat: 36.75, lon: 33.95 },
    { plaka: "34", id: "istanbul", name: "İstanbul", region: "Marmara", lat: 41.12, lon: 28.85 },
    { plaka: "35", id: "izmir", name: "İzmir", region: "Ege", lat: 38.42, lon: 27.14 },
    { plaka: "36", id: "kars", name: "Kars", region: "Doğu Anadolu", lat: 40.55, lon: 43.09 },
    { plaka: "37", id: "kastamonu", name: "Kastamonu", region: "Karadeniz", lat: 41.42, lon: 33.78 },
    { plaka: "38", id: "kayseri", name: "Kayseri", region: "İç Anadolu", lat: 38.73, lon: 35.55 },
    { plaka: "39", id: "kirklareli", name: "Kırklareli", region: "Marmara", lat: 41.73, lon: 27.35 },
    { plaka: "40", id: "kirsehir", name: "Kırşehir", region: "İç Anadolu", lat: 39.22, lon: 34.16 },
    { plaka: "41", id: "kocaeli", name: "Kocaeli", region: "Marmara", lat: 40.85, lon: 29.92 },
    { plaka: "42", id: "konya", name: "Konya", region: "İç Anadolu", lat: 37.87, lon: 32.48 },
    { plaka: "43", id: "kutahya", name: "Kütahya", region: "Ege", lat: 39.38, lon: 29.65 },
    { plaka: "44", id: "malatya", name: "Malatya", region: "Doğu Anadolu", lat: 38.38, lon: 38.15 },
    { plaka: "45", id: "manisa", name: "Manisa", region: "Ege", lat: 38.68, lon: 27.95 },
    { plaka: "46", id: "kahramanmaras", name: "Kahramanmaraş", region: "Akdeniz", lat: 37.75, lon: 36.93 },
    { plaka: "47", id: "mardin", name: "Mardin", region: "Güneydoğu Anadolu", lat: 37.31, lon: 40.74 },
    { plaka: "48", id: "mugla", name: "Muğla", region: "Ege", lat: 37.15, lon: 28.45 },
    { plaka: "49", id: "mus", name: "Muş", region: "Doğu Anadolu", lat: 38.85, lon: 41.55 },
    { plaka: "50", id: "nevsehir", name: "Nevşehir", region: "İç Anadolu", lat: 38.68, lon: 34.71 },
    { plaka: "51", id: "nigde", name: "Niğde", region: "İç Anadolu", lat: 37.92, lon: 34.68 },
    { plaka: "52", id: "ordu", name: "Ordu", region: "Karadeniz", lat: 40.88, lon: 37.68 },
    { plaka: "53", id: "rize", name: "Rize", region: "Karadeniz", lat: 40.98, lon: 40.65 },
    { plaka: "54", id: "sakarya", name: "Sakarya", region: "Marmara", lat: 40.75, lon: 30.45 },
    { plaka: "55", id: "samsun", name: "Samsun", region: "Karadeniz", lat: 41.25, lon: 36.33 },
    { plaka: "56", id: "siirt", name: "Siirt", region: "Güneydoğu Anadolu", lat: 37.93, lon: 42.02 },
    { plaka: "57", id: "sinop", name: "Sinop", region: "Karadeniz", lat: 41.82, lon: 34.95 },
    { plaka: "58", id: "sivas", name: "Sivas", region: "İç Anadolu", lat: 39.65, lon: 37.15 },
    { plaka: "59", id: "tekirdag", name: "Tekirdağ", region: "Marmara", lat: 41.08, lon: 27.45 },
    { plaka: "60", id: "tokat", name: "Tokat", region: "Karadeniz", lat: 40.31, lon: 36.65 },
    { plaka: "61", id: "trabzon", name: "Trabzon", region: "Karadeniz", lat: 40.88, lon: 39.72 },
    { plaka: "62", id: "tunceli", name: "Tunceli", region: "Doğu Anadolu", lat: 39.15, lon: 39.55 },
    { plaka: "63", id: "sanliurfa", name: "Şanlıurfa", region: "Güneydoğu Anadolu", lat: 37.16, lon: 38.95 },
    { plaka: "64", id: "usak", name: "Uşak", region: "Ege", lat: 38.58, lon: 29.35 },
    { plaka: "65", id: "van", name: "Van", region: "Doğu Anadolu", lat: 38.49, lon: 43.45 },
    { plaka: "66", id: "yozgat", name: "Yozgat", region: "İç Anadolu", lat: 39.72, lon: 35.05 },
    { plaka: "67", id: "zonguldak", name: "Zonguldak", region: "Karadeniz", lat: 41.38, lon: 31.79 },
    { plaka: "68", id: "aksaray", name: "Aksaray", region: "İç Anadolu", lat: 38.37, lon: 33.95 },
    { plaka: "69", id: "bayburt", name: "Bayburt", region: "Karadeniz", lat: 40.26, lon: 40.25 },
    { plaka: "70", id: "karaman", name: "Karaman", region: "İç Anadolu", lat: 37.18, lon: 33.22 },
    { plaka: "71", id: "kirikkale", name: "Kırıkkale", region: "İç Anadolu", lat: 39.84, lon: 33.61 },
    { plaka: "72", id: "batman", name: "Batman", region: "Güneydoğu Anadolu", lat: 37.88, lon: 41.22 },
    { plaka: "73", id: "sirnak", name: "Şırnak", region: "Güneydoğu Anadolu", lat: 37.45, lon: 42.55 },
    { plaka: "74", id: "bartin", name: "Bartın", region: "Karadeniz", lat: 41.63, lon: 32.42 },
    { plaka: "75", id: "ardahan", name: "Ardahan", region: "Doğu Anadolu", lat: 41.15, lon: 42.75 },
    { plaka: "76", id: "igdir", name: "Iğdır", region: "Doğu Anadolu", lat: 39.92, lon: 44.12 },
    { plaka: "77", id: "yalova", name: "Yalova", region: "Marmara", lat: 40.62, lon: 29.22 },
    { plaka: "78", id: "karabuk", name: "Karabük", region: "Karadeniz", lat: 41.18, lon: 32.68 },
    { plaka: "79", id: "kilis", name: "Kilis", region: "Güneydoğu Anadolu", lat: 36.72, lon: 37.12 },
    { plaka: "80", id: "osmaniye", name: "Osmaniye", region: "Akdeniz", lat: 37.18, lon: 36.25 },
    { plaka: "81", id: "duzce", name: "Düzce", region: "Karadeniz", lat: 40.84, lon: 31.16 }
  ];

  function lonToX(lon) {
    return Number((25 + ((lon - 25.8) / (45.0 - 25.8)) * 950).toFixed(1));
  }
  function latToY(lat) {
    return Number((435 - ((lat - 35.6) / (42.3 - 35.6)) * 410).toFixed(1));
  }

  const TURKEY_COAST_LONLAT = [
    [26.04, 41.72], [26.35, 41.96], [26.72, 41.88], [27.15, 42.06], [27.65, 42.00], [28.05, 41.98],
    [28.25, 41.62], [28.65, 41.36], [29.02, 41.25], [29.18, 41.23], [29.65, 41.18], [30.25, 41.15],
    [30.90, 41.12], [31.40, 41.32], [31.85, 41.52], [32.40, 41.78], [33.05, 41.98], [33.75, 42.04],
    [34.45, 42.06], [35.15, 42.12], [35.38, 41.72], [35.98, 41.74], [36.48, 41.38], [36.82, 41.36],
    [37.28, 41.12], [37.88, 41.02], [38.45, 40.96], [39.15, 41.06], [39.75, 41.04], [40.35, 41.02],
    [40.98, 41.22], [41.55, 41.52], [42.15, 41.50], [42.78, 41.56],
    [43.30, 41.16], [43.65, 40.58], [43.78, 40.12], [44.80, 39.70], [44.52, 39.38], [44.22, 38.98],
    [44.38, 38.45], [44.32, 37.90], [44.78, 37.34],
    [44.10, 37.16], [43.25, 37.20], [42.55, 37.12], [42.10, 37.06], [41.40, 37.05], [40.65, 37.06],
    [39.85, 36.80], [38.80, 36.68], [38.05, 36.78], [37.35, 36.64], [36.70, 36.62], [36.58, 36.15],
    [36.10, 35.84], [35.82, 36.26], [36.12, 36.68], [35.88, 36.88], [35.42, 36.56], [34.82, 36.76],
    [34.22, 36.46], [33.72, 36.10], [32.82, 36.02], [32.12, 36.38], [31.52, 36.68], [30.72, 36.88],
    [30.42, 36.22], [29.62, 36.14], [29.15, 36.58], [28.68, 36.75], [27.95, 36.62], [27.28, 37.02],
    [27.25, 37.55], [26.82, 37.98], [26.28, 38.32], [26.85, 38.58], [26.72, 39.25], [26.95, 39.48],
    [26.12, 39.52], [26.15, 40.04], [26.22, 40.38], [26.02, 40.65], [26.82, 40.65], [26.32, 41.15],
    [26.48, 41.42]
  ];

  const MARMARA_SEA_LONLAT = [
    [26.72, 40.42], [27.35, 40.68], [27.95, 40.98], [28.65, 40.96], [29.12, 40.92],
    [29.38, 40.76], [28.92, 40.62], [29.22, 40.42], [28.45, 40.35], [27.85, 40.46], [27.22, 40.38]
  ];

  const VAN_LAKE_LONLAT = [
    [42.25, 38.48], [42.68, 38.82], [43.18, 38.92], [43.55, 38.68], [43.35, 38.35], [42.75, 38.32]
  ];

  const TUZ_LAKE_LONLAT = [
    [33.15, 39.02], [33.48, 39.08], [33.65, 38.68], [33.38, 38.52], [33.18, 38.72]
  ];

  function polyToPath(lonLatArr) {
    return lonLatArr.map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${lonToX(pt[0])} ${latToY(pt[1])}`).join(' ') + ' Z';
  }

  function clipPolyHalfplane(poly, midX, midY, nx, ny) {
    if (!poly || poly.length === 0) return [];
    const out = [];
    const n = poly.length;
    for (let i = 0; i < n; i++) {
      const cur = poly[i];
      const prev = poly[(i + n - 1) % n];
      const curVal = (cur[0] - midX) * nx + (cur[1] - midY) * ny;
      const prevVal = (prev[0] - midX) * nx + (prev[1] - midY) * ny;
      if (curVal <= 1e-7) {
        if (prevVal > 1e-7) {
          const t = prevVal / (prevVal - curVal);
          out.push([prev[0] + t * (cur[0] - prev[0]), prev[1] + t * (cur[1] - prev[1])]);
        }
        out.push(cur);
      } else if (prevVal <= 1e-7) {
        const t = prevVal / (prevVal - curVal);
        out.push([prev[0] + t * (cur[0] - prev[0]), prev[1] + t * (cur[1] - prev[1])]);
      }
    }
    return out;
  }

  const sites = PROVINCES_RAW.map(p => ({
    ...p,
    sx: lonToX(p.lon),
    sy: latToY(p.lat)
  }));

  const bbox = [[0, 0], [1000, 0], [1000, 460], [0, 460]];

  const provinceCells = sites.map((site, i) => {
    let poly = bbox.slice();
    for (let j = 0; j < sites.length; j++) {
      if (i === j) continue;
      const other = sites[j];
      const mx = 0.5 * (site.sx + other.sx);
      const my = 0.5 * (site.sy + other.sy);
      const nx = other.sx - site.sx;
      const ny = other.sy - site.sy;
      poly = clipPolyHalfplane(poly, mx, my, nx, ny);
    }
    const pathStr = poly.map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt[0].toFixed(1)} ${pt[1].toFixed(1)}`).join(' ') + ' Z';
    return {
      plaka: site.plaka,
      id: site.id,
      name: site.name,
      region: site.region,
      lat: site.lat,
      lon: site.lon,
      cx: site.sx,
      cy: site.sy,
      path: pathStr
    };
  });

  window.TURKEY_MAP_DATA = {
    viewBox: "0 0 1000 460",
    coastlinePath: polyToPath(TURKEY_COAST_LONLAT),
    marmaraSeaPath: polyToPath(MARMARA_SEA_LONLAT),
    vanLakePath: polyToPath(VAN_LAKE_LONLAT),
    tuzLakePath: polyToPath(TUZ_LAKE_LONLAT),
    provinces: provinceCells
  };
})();
