import { MagazineCategory } from '../types/magazine';

export interface TemplateMeta {
  id: string;
  code: string;
  name: string;
  category: MagazineCategory;
  description: string;
  variants: ('A' | 'B' | 'C')[];
  minPhotos: number;
  maxPhotos: number;
  supportsStem?: boolean;
  supportsInterview?: boolean;
  supportsPoetry?: boolean;
  supportsInteractive?: boolean;
  supportsBook?: boolean;
  idealWordCount: string;
}

export const TEMPLATES_LIBRARY: TemplateMeta[] = [
  {
    id: 'M01',
    code: 'M01',
    name: 'Kapak',
    category: 'Kapak',
    description: 'Büyük görsel, çarpıcı tipografi, sayı ve konu başlıkları içeren ana kapak tasarımı.',
    variants: ['A', 'B', 'C'],
    minPhotos: 1,
    maxPhotos: 1,
    idealWordCount: '20-40 kelime (Başlık & Spotlar)'
  },
  {
    id: 'M02',
    code: 'M02',
    name: 'İçindekiler',
    category: 'İçindekiler',
    description: 'Dergideki tüm bölümleri, renk kodlarını ve sayfa numaralarını otomatik listeleyen şık mizanpaj.',
    variants: ['A', 'B'],
    minPhotos: 0,
    maxPhotos: 2,
    idealWordCount: 'Dinamik liste'
  },
  {
    id: 'M03',
    code: 'M03',
    name: 'Editörden',
    category: 'Editörden',
    description: 'Okul Müdürü veya Yayın Yönetmeni fotoğrafı, özel alıntı ve açılış yazısı.',
    variants: ['A', 'B'],
    minPhotos: 1,
    maxPhotos: 1,
    idealWordCount: '150-300 kelime'
  },
  {
    id: 'M04',
    code: 'M04',
    name: 'Tek Görselli Klasik Makale',
    category: 'Okulumuzdan',
    description: 'Büyük hero görsel, drop-cap başlangıç harfi, iki sütunlu akıcı metin ve vurgu alıntısı.',
    variants: ['A', 'B', 'C'],
    minPhotos: 1,
    maxPhotos: 1,
    idealWordCount: '200-400 kelime'
  },
  {
    id: 'M05',
    code: 'M05',
    name: 'İki Görselli Editorial',
    category: 'Okulumuzdan',
    description: 'Biri büyük, diğeri destekleyici iki fotoğraf ile zenginleştirilmiş dengeli sayfa düzeni.',
    variants: ['A', 'B', 'C'],
    minPhotos: 2,
    maxPhotos: 2,
    idealWordCount: '200-350 kelime'
  },
  {
    id: 'M06',
    code: 'M06',
    name: 'Uzun Makale / Dosya Konusu',
    category: 'Bu Sayının Dosyası',
    description: 'Çok sayfalı yazılar için özel devam sayfası mizanpajı (üst bilgi ve sayfa numaralı).',
    variants: ['A', 'B'],
    minPhotos: 0,
    maxPhotos: 2,
    idealWordCount: '400-800 kelime'
  },
  {
    id: 'M07',
    code: 'M07',
    name: 'Bilim & Keşif',
    category: 'Bilim',
    description: 'Turkuaz vurgulu, "Biliyor Muydunuz?" bilgi kutusu, büyük bilimsel görsel ve merak uyandıran maddeler.',
    variants: ['A', 'B', 'C'],
    minPhotos: 1,
    maxPhotos: 3,
    idealWordCount: '150-350 kelime'
  },
  {
    id: 'M08',
    code: 'M08',
    name: 'STEM & Robotik Projeleri',
    category: 'STEM',
    description: 'Problem, Amaç, Süreç ve Sonuç kartlarına ayrılmış yapılandırılmış fen ve teknoloji şablonu.',
    variants: ['A', 'B'],
    minPhotos: 1,
    maxPhotos: 4,
    supportsStem: true,
    idealWordCount: '200-400 kelime'
  },
  {
    id: 'M09',
    code: 'M09',
    name: 'TÜBİTAK & Projeler',
    category: 'Proje',
    description: 'Danışman öğretmen, öğrenci ekibi künyesi, proje hedefi ve QR kod bağlantılı proje vitrini.',
    variants: ['A', 'B'],
    minPhotos: 1,
    maxPhotos: 3,
    idealWordCount: '200-350 kelime'
  },
  {
    id: 'M10',
    code: 'M10',
    name: 'Okul Etkinliği & Tören',
    category: 'Okul Etkinliği',
    description: 'Tarih rozeti, etkinlik özeti ve 3-6 fotoğraflık dinamik editorial fotoğraf ızgarası.',
    variants: ['A', 'B', 'C'],
    minPhotos: 2,
    maxPhotos: 6,
    idealWordCount: '100-250 kelime'
  },
  {
    id: 'M11',
    code: 'M11',
    name: 'Röportaj & Söyleşi',
    category: 'Röportaj',
    description: 'Konuk portresi, tanıtım kartı ve soru-cevap blokları içeren karşılıklı söyleşi mizanpajı.',
    variants: ['A', 'B'],
    minPhotos: 1,
    maxPhotos: 2,
    supportsInterview: true,
    idealWordCount: '300-600 kelime'
  },
  {
    id: 'M12',
    code: 'M12',
    name: 'Şiir & Genç Kalemler',
    category: 'Şiir',
    description: 'Sanatsal tipografi, mısra boşlukları, tırnak süslemeleri ve ferah edebi düzen.',
    variants: ['A', 'B'],
    minPhotos: 0,
    maxPhotos: 1,
    supportsPoetry: true,
    idealWordCount: '50-150 kelime (Mısralar)'
  },
  {
    id: 'M13',
    code: 'M13',
    name: 'Hikâye & Edebiyat',
    category: 'Hikâye',
    description: 'Kitap havasında klasik serif yazı karakteri, bölüm başı süsü ve derin okuma mizanpajı.',
    variants: ['A', 'B'],
    minPhotos: 0,
    maxPhotos: 2,
    idealWordCount: '300-600 kelime'
  },
  {
    id: 'M14',
    code: 'M14',
    name: 'Sanat Galerisi / Öğrenci Eseri',
    category: 'Kültür & Sanat',
    description: 'Resim veya sanat eserini dev merkezde sergileyen, üzerine metin bindirmeyen müze kalitesinde vitrin.',
    variants: ['A', 'B'],
    minPhotos: 1,
    maxPhotos: 2,
    idealWordCount: '30-80 kelime (Eser künyesi ve açıklaması)'
  },
  {
    id: 'M15',
    code: 'M15',
    name: 'Fotoğraf Galerisi',
    category: 'Fotoğraf Galerisi',
    description: '6 ile 10 adet fotoğrafı estetik kolaj ve altyazılarla birleştiren görsel şölen sayfası.',
    variants: ['A', 'B'],
    minPhotos: 4,
    maxPhotos: 8,
    idealWordCount: '30-100 kelime (Giriş & Altyazılar)'
  },
  {
    id: 'M16',
    code: 'M16',
    name: 'Kitap & Film Tanıtımı',
    category: 'Kitap Tanıtımı',
    description: 'Kapak görseli, yıldız değerlendirmesi, alıntı kutusu ve "Neden Okunmalı?" tavsiye bölümü.',
    variants: ['A', 'B'],
    minPhotos: 1,
    maxPhotos: 2,
    supportsBook: true,
    idealWordCount: '150-300 kelime'
  },
  {
    id: 'M17',
    code: 'M17',
    name: 'Gurur Tablomuz (Başarı)',
    category: 'Başarı',
    description: 'Altın rozetler, kupa/madalya fotoğrafları ve dereceye giren öğrencilerin başarı panosu.',
    variants: ['A', 'B'],
    minPhotos: 1,
    maxPhotos: 4,
    idealWordCount: '100-250 kelime'
  },
  {
    id: 'M18',
    code: 'M18',
    name: 'Bilgi Kartları / Hap Bilgiler',
    category: 'Rehberlik',
    description: '3 veya 4 bağımsız renkli bilgi kartı ile hızlı tüketilebilir pratik ipuçları ve öneriler.',
    variants: ['A', 'B'],
    minPhotos: 0,
    maxPhotos: 2,
    idealWordCount: '150-300 kelime'
  },
  {
    id: 'M19',
    code: 'M19',
    name: 'Zeka Oyunları & Bulmaca',
    category: 'Bulmaca',
    description: 'Kelime avı ızgarası, bilmeceler, mini test ve zeka sorularından oluşan eğlenceli sayfa.',
    variants: ['A', 'B'],
    minPhotos: 0,
    maxPhotos: 2,
    idealWordCount: 'Bulmaca soruları & kelime listeleri'
  },
  {
    id: 'M20',
    code: 'M20',
    name: 'Dijital Vatandaşlık',
    category: 'Dijital Vatandaşlık',
    description: 'Yapay zekâ, güvenli internet, siber zorbalık ve dijital ayak izi için rehberlik kartları.',
    variants: ['A', 'B'],
    minPhotos: 1,
    maxPhotos: 2,
    idealWordCount: '150-300 kelime'
  },
  {
    id: 'M21',
    code: 'M21',
    name: 'MAİDER Yayın Ekibi',
    category: 'Ekip',
    description: 'Dergiyi hazırlayan öğretmen ve öğrenci yayın kurulunun fotoğraflı kurumsal tanıtım sayfası.',
    variants: ['A'],
    minPhotos: 4,
    maxPhotos: 12,
    idealWordCount: 'Ekip listesi'
  },
  {
    id: 'M22',
    code: 'M22',
    name: 'Dergi Arşivi',
    category: 'Arşiv',
    description: 'Geçmiş sayıların kapakları, yayın tarihleri ve doğrudan Canva dijital okuma linkleri/QR kodları.',
    variants: ['A'],
    minPhotos: 2,
    maxPhotos: 8,
    idealWordCount: 'Arşiv bilgileri'
  },
  {
    id: 'M23',
    code: 'M23',
    name: 'Yayın Künyesi',
    category: 'Künye',
    description: 'Mehmet Akif İnan Ortaokulu resmi yönetim, yayın kurulu, iletişim ve yasal haklar sayfası.',
    variants: ['A'],
    minPhotos: 0,
    maxPhotos: 1,
    idealWordCount: 'Sabit künye bilgileri'
  },
  {
    id: 'M24',
    code: 'M24',
    name: 'Etkileşimli İçerik / Wordwall & Video',
    category: 'Oyun',
    description: 'Oyun/Video önizleme görseli, büyük taranabilir QR kod ve "OYUNU BAŞLAT 🎮" etkileşim butonu.',
    variants: ['A', 'B'],
    minPhotos: 1,
    maxPhotos: 2,
    supportsInteractive: true,
    idealWordCount: '80-150 kelime'
  },
  {
    id: 'M25',
    code: 'M25',
    name: 'Kapanış & Arka Kapak',
    category: 'Kapanış',
    description: 'Okul mottosu, sosyal medya hesapları, gelecek sayı duyurusu ve prestijli arka kapak tasarımı.',
    variants: ['A', 'B'],
    minPhotos: 1,
    maxPhotos: 2,
    idealWordCount: 'Kapanış mesajı ve iletişim'
  }
];
