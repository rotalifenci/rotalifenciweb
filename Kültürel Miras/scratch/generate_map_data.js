const fs = require('fs');

const { districts, projection } = JSON.parse(fs.readFileSync('scratch/sivas_districts_projected.json', 'utf8'));

// District descriptions and cultural significance
const districtInfo = {
  "merkez": {
    fullName: "Sivas Merkez",
    desc: "Selçuklu dârülhadisleri, Osmanlı camileri, Cumhuriyet Kongre Binası ve anıtsal taş eserlerin merkezi.",
    isHub: true
  },
  "divrigi": {
    fullName: "Divriği (Mengücekliler Başkenti)",
    desc: "UNESCO Dünya Kültür Mirası Divriği Ulu Camii ve Darüşşifası'nın ve Mengücek Kalesi'nin bulunduğu anıt ilçe.",
    isHub: true
  },
  "gurun": {
    fullName: "Gürün",
    desc: "Sivas'ın güney kapısı; turkuaz renkli Gökpınar Gölü, Şuğul Kanyonu ve tarihi hanlarıyla ünlü ilçe.",
    isHub: false
  },
  "kangal": {
    fullName: "Kangal",
    desc: "Balıklı Kaplıca, Alacahan Kervansarayı ve dünyaca ünlü Kangal köpekleriyle tanınan kadim ilçe.",
    isHub: false
  },
  "sarkisla": {
    fullName: "Şarkışla",
    desc: "Aşık Veysel'in yurdu (Sivrialan), Emlek yöresi ozanlar geleneği ve tarihi kalıntılarıyla bilinen ilçe.",
    isHub: false
  },
  "gemerek": {
    fullName: "Gemerek",
    desc: "Sızır Şelalesi, İnkışla kalıntıları ve Çepni tarihiyle Sivas'ın batı sınırındaki doğa ve tarih ilçesi.",
    isHub: false
  },
  "yildizeli": {
    fullName: "Yıldızeli",
    desc: "Yıldız Dağı eteklerinde, Horasan harcı Selçuklu köprüleri ve kaplıcalarıyla bilinen tarihi yerleşim.",
    isHub: false
  },
  "hafik": {
    fullName: "Hafik",
    desc: "Hafik Gölü göl yerleşimleri (palafitler), Tuzhisar gölü ve tarihi kaya mağaralarıyla zengin ilçe.",
    isHub: false
  },
  "zara": {
    fullName: "Zara",
    desc: "Tödürge Gölü, kaya kiliseleri ve tarihi ipek yolu konaklama noktalarıyla kadim kültür merkezi.",
    isHub: false
  },
  "imranli": {
    fullName: "İmranlı",
    desc: "Kızılırmak'ın doğduğu Kızıldağ eteklerinde yer alan, yaylaları ve doğal kaynaklarıyla ünlü ilçe.",
    isHub: false
  },
  "susehri": {
    fullName: "Suşehri",
    desc: "Kelkit Vadisi'nde antik Nikopolis kenti kalıntıları ve Çataloluk kilisesi kalıntılarına ev sahipliği yapar.",
    isHub: false
  },
  "akincilar": {
    fullName: "Akıncılar",
    desc: "Kelkit havzasında Doğantepe ve tarihi yerleşim kalıntılarıyla zengin vadi ilçesi.",
    isHub: false
  },
  "golova": {
    fullName: "Gölova",
    desc: "Gölova Göleti çevresindeki tarihi değirmenler ve Doğu Karadeniz geçişindeki vadi yerleşimi.",
    isHub: false
  },
  "koyulhisar": {
    fullName: "Koyulhisar",
    desc: "Fatih Sultan Mehmed'in Otlukbeli Seferi menzili; Eğriçimen Yaylası ve Yukarıkale hisarıyla meşhur ilçe.",
    isHub: false
  },
  "dogansar": {
    fullName: "Doğanşar",
    desc: "Dipsizgöl Şelalesi, tarihi ahşap camileri ve yayla mimarisiyle kuzey orman kuşağı ilçesi.",
    isHub: false
  },
  "ulas": {
    fullName: "Ulaş",
    desc: "Tecer Dağı eteklerinde Ulaş Gölleri ve tarihi Acıyurt kervan geçidiyle ünlü ilçe.",
    isHub: false
  },
  "altinyayla": {
    fullName: "Altınyayla",
    desc: "Sarissa (Kuşaklı) Hitit antik kenti ve kraliyet havuzu kalıntılarıyla dünya arkeoloji merkezi.",
    isHub: false
  }
};

const fullDistricts = districts.map(d => {
  const extra = districtInfo[d.id] || {};
  return {
    id: d.id,
    name: d.name,
    fullName: extra.fullName || d.name,
    center: d.center,
    centerCoords: d.centerCoords,
    isHub: !!extra.isHub,
    desc: extra.desc || `${d.name} ilçesi.`,
    path: d.path,
    color: d.color
  };
});

// Accurate rivers based on real topography
// 1. Kızılırmak: from İmranlı (Kızıldağ) -> Zara -> Hafik -> Merkez -> Şarkışla -> Gemerek
// 2. Kelkit Çayı: through Koyulhisar & Suşehri
const rivers = [
  {
    name: "Kızılırmak Nehri",
    path: "M 810,270 Q 750,285 700,285 T 620,280 T 520,275 T 435,315 T 390,340 T 320,380 T 250,430 T 170,470"
  },
  {
    name: "Kelkit Çayı",
    path: "M 860,185 Q 780,180 710,165 T 610,125 T 560,105"
  },
  {
    name: "Çaltı Suyu",
    path: "M 540,510 Q 590,480 660,460 T 730,440"
  }
];

const jsContent = `// ============================================================================
// TÜBİTAK 2204-B – SİVAS'IN DİJİTAL TARİH ATLASI
// Sivas İli, 17 İlçesi ve Coğrafi Veritabanı
// OpenStreetMap & Harita Genel Müdürlüğü Gerçek Sınırlarıyla Birebir Uyumlu
// ============================================================================

window.SIVAS_MAP_DATA = {
  provinceName: "Sivas",
  viewBox: "0 0 1000 760",
  centerCoords: { lat: 39.7483, lon: 37.0142 },

  // Projeksiyon Dönüşümü (WGS84 Lat/Lon -> SVG X/Y)
  projection: {
    minLon: ${projection.minLon},
    maxLon: ${projection.maxLon},
    minLat: ${projection.minLat},
    maxLat: ${projection.maxLat},
    cosLat: ${projection.cosLat},
    scale: ${projection.scale},
    offsetX: ${projection.offsetX},
    offsetY: ${projection.offsetY},
    project(lon, lat) {
      const x = this.offsetX + (lon - this.minLon) * this.cosLat * this.scale;
      const y = this.offsetY + (this.maxLat - lat) * this.scale;
      return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
    }
  },

  // Sivas'ın 17 İlçesi (Gerçek Coğrafi Sınırlarıyla)
  districts: ${JSON.stringify(fullDistricts, null, 2)},

  // Nehirler
  rivers: ${JSON.stringify(rivers, null, 2)},

  // Bir noktanın (x, y) hangi ilçede olduğunu test eden ray-casting algoritması
  getDistrictAtPoint(x, y) {
    if (!this.parsedPolys) {
      this.parsedPolys = this.districts.map(d => {
        const rings = [];
        const commands = d.path.match(/[ML][^MLZ]+/g) || [];
        let curRing = [];
        commands.forEach(cmd => {
          const type = cmd[0];
          const pts = cmd.substring(1).trim().split(/\\s+/);
          pts.forEach(p => {
            const [px, py] = p.split(',').map(Number);
            if (!isNaN(px) && !isNaN(py)) curRing.push([px, py]);
          });
          if (type === 'M' && curRing.length > 1) {
            rings.push(curRing);
            curRing = [];
          }
        });
        if (curRing.length > 0) rings.push(curRing);
        return { id: d.id, name: d.name, rings };
      });
    }

    for (const dist of this.parsedPolys) {
      for (const ring of dist.rings) {
        let inside = false;
        for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
          const xi = ring[i][0], yi = ring[i][1];
          const xj = ring[j][0], yj = ring[j][1];
          const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
          if (intersect) inside = !inside;
        }
        if (inside) return dist;
      }
    }
    return null;
  }
};
`;

fs.writeFileSync('js/sivas-map-data.js', jsContent, 'utf8');
console.log('js/sivas-map-data.js generated successfully! Total size:', jsContent.length);
