import { MagazineCategory } from '../types/magazine';

export const MAIDER_BRAND = {
  name: 'MAİDER',
  subtitle: 'Mehmet Akif İnan Ortaokulu E-Dergisi',
  schoolName: 'Mehmet Akif İnan Ortaokulu',
  defaultSlogan: 'Geleceğe İlham Veren Akıllı Okul Dergisi',
  colors: {
    navy: '#0F172A',
    dark: '#1E293B',
    slate: '#475569',
    cream: '#FDFBF7',
    warmWhite: '#F8F6F0',
    pureWhite: '#FFFFFF',
    gold: '#D97706',
    goldLight: '#F59E0B',
    turkuaz: '#0EA5E9',
    turkuazDark: '#0284C7',
    mor: '#8B5CF6',
    morDark: '#6D28D9',
    turuncu: '#EA580C',
    turuncuLight: '#FB923C',
    yesil: '#10B981',
    bordo: '#991B1B',
  },
  pptxColors: {
    navy: '0F172A',
    dark: '1E293B',
    slate: '475569',
    cream: 'FDFBF7',
    warmWhite: 'F8F6F0',
    white: 'FFFFFF',
    gold: 'D97706',
    turkuaz: '0EA5E9',
    mor: '8B5CF6',
    turuncu: 'EA580C',
    yesil: '10B981',
    bordo: '991B1B',
  }
};

export const CATEGORY_THEMES: Record<MagazineCategory, {
  color: string;
  bgLight: string;
  border: string;
  text: string;
  pptxColor: string;
  label: string;
  iconName: string;
}> = {
  'Kapak': { color: '#0F172A', bgLight: '#F8FAFC', border: '#CBD5E1', text: '#0F172A', pptxColor: '0F172A', label: 'Kapak', iconName: 'BookOpen' },
  'İçindekiler': { color: '#1E293B', bgLight: '#F8FAFC', border: '#E2E8F0', text: '#1E293B', pptxColor: '1E293B', label: 'İçindekiler', iconName: 'ListOrdered' },
  'Editörden': { color: '#0F172A', bgLight: '#FFFBEB', border: '#FDE68A', text: '#92400E', pptxColor: '92400E', label: 'Editörden', iconName: 'PenTool' },
  'Bu Sayının Dosyası': { color: '#0F172A', bgLight: '#F1F5F9', border: '#94A3B8', text: '#0F172A', pptxColor: '0F172A', label: 'Dosya Konusu', iconName: 'FileText' },
  'Okulumuzdan': { color: '#0284C7', bgLight: '#F0F9FF', border: '#BAE6FD', text: '#0369A1', pptxColor: '0284C7', label: 'Okulumuzdan', iconName: 'School' },
  'Bilim': { color: '#0EA5E9', bgLight: '#F0F9FF', border: '#BAE6FD', text: '#0369A1', pptxColor: '0EA5E9', label: 'Bilim & Keşif', iconName: 'Atom' },
  'STEM': { color: '#8B5CF6', bgLight: '#F5F3FF', border: '#DDD6FE', text: '#6D28D9', pptxColor: '8B5CF6', label: 'STEM & Maker', iconName: 'Cpu' },
  'Teknoloji': { color: '#6366F1', bgLight: '#EEF2FF', border: '#C7D2FE', text: '#4338CA', pptxColor: '6366F1', label: 'Bilişim & Robotik', iconName: 'Bot' },
  'Proje': { color: '#0D9488', bgLight: '#F0FDFA', border: '#99F6E4', text: '#0F766E', pptxColor: '0D9488', label: 'TÜBİTAK & Proje', iconName: 'Lightbulb' },
  'eTwinning': { color: '#2563EB', bgLight: '#EFF6FF', border: '#BFDBFE', text: '#1D4ED8', pptxColor: '2563EB', label: 'eTwinning', iconName: 'Globe' },
  'Okul Etkinliği': { color: '#EA580C', bgLight: '#FFF7ED', border: '#FED7AA', text: '#C2410C', pptxColor: 'EA580C', label: 'Etkinlik & Tören', iconName: 'Calendar' },
  'Kültür & Sanat': { color: '#EA580C', bgLight: '#FFF7ED', border: '#FED7AA', text: '#C2410C', pptxColor: 'EA580C', label: 'Kültür & Sanat', iconName: 'Palette' },
  'Şiir': { color: '#BE123C', bgLight: '#FFF1F2', border: '#FECDD3', text: '#9F1239', pptxColor: 'BE123C', label: 'Genç Kalemler / Şiir', iconName: 'Feather' },
  'Hikâye': { color: '#991B1B', bgLight: '#FEF2F2', border: '#FECACA', text: '#7F1D1D', pptxColor: '991B1B', label: 'Hikâye & Deneme', iconName: 'Book' },
  'Deneme': { color: '#854D0E', bgLight: '#FEFCE8', border: '#FEF08A', text: '#713F12', pptxColor: '854D0E', label: 'Edebi Deneme', iconName: 'Scroll' },
  'Röportaj': { color: '#0F766E', bgLight: '#F0FDFA', border: '#99F6E4', text: '#115E59', pptxColor: '0F766E', label: 'Özel Röportaj', iconName: 'MessageSquare' },
  'Kitap Tanıtımı': { color: '#B45309', bgLight: '#FFFBEB', border: '#FDE68A', text: '#78350F', pptxColor: 'B45309', label: 'Kitap Köşesi', iconName: 'Bookmark' },
  'Rehberlik': { color: '#059669', bgLight: '#ECFDF5', border: '#A7F3D0', text: '#047857', pptxColor: '059669', label: 'Rehberlik & Psikoloji', iconName: 'Compass' },
  'Dijital Vatandaşlık': { color: '#4F46E5', bgLight: '#EEF2FF', border: '#C7D2FE', text: '#3730A3', pptxColor: '4F46E5', label: 'Dijital Vatandaşlık', iconName: 'ShieldCheck' },
  'Başarı': { color: '#D97706', bgLight: '#FFFBEB', border: '#FDE68A', text: '#B45309', pptxColor: 'D97706', label: 'Gurur Tablomuz', iconName: 'Trophy' },
  'Fotoğraf Galerisi': { color: '#0284C7', bgLight: '#F0F9FF', border: '#BAE6FD', text: '#0369A1', pptxColor: '0284C7', label: 'Fotoğraf Galerisi', iconName: 'Image' },
  'Oyun': { color: '#7C3AED', bgLight: '#F5F3FF', border: '#DDD6FE', text: '#5B21B6', pptxColor: '7C3AED', label: 'Oyun & Eğlence', iconName: 'Gamepad2' },
  'Bulmaca': { color: '#9333EA', bgLight: '#FAF5FF', border: '#E9D5FF', text: '#6B21A8', pptxColor: '9333EA', label: 'Zeka Bulmacası', iconName: 'HelpCircle' },
  'Ekip': { color: '#334155', bgLight: '#F8FAFC', border: '#E2E8F0', text: '#1E293B', pptxColor: '334155', label: 'MAİDER Ekibi', iconName: 'Users' },
  'Arşiv': { color: '#475569', bgLight: '#F8FAFC', border: '#E2E8F0', text: '#334155', pptxColor: '475569', label: 'Dergi Arşivi', iconName: 'Archive' },
  'Künye': { color: '#0F172A', bgLight: '#F8FAFC', border: '#E2E8F0', text: '#0F172A', pptxColor: '0F172A', label: 'Yayın Künyesi', iconName: 'Info' },
  'Kapanış': { color: '#0F172A', bgLight: '#0F172A', border: '#1E293B', text: '#F8FAFC', pptxColor: '0F172A', label: 'Kapanış', iconName: 'CheckCircle2' },
  'Diğer': { color: '#475569', bgLight: '#F8FAFC', border: '#CBD5E1', text: '#334155', pptxColor: '475569', label: 'Genel İçerik', iconName: 'Layers' },
};

const PALETTE_COLORS = [
  '#0284C7', '#0EA5E9', '#6366F1', '#8B5CF6', '#0D9488',
  '#059669', '#10B981', '#D97706', '#EA580C', '#E11D48',
  '#4F46E5', '#7C3AED', '#0891B2', '#059669', '#B45309'
];

export function getCategoryTheme(category: string) {
  if (!category) return CATEGORY_THEMES['Bilim'];
  if (CATEGORY_THEMES[category]) return CATEGORY_THEMES[category];

  // Derive stable harmonic color for any custom or new section
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % PALETTE_COLORS.length;
  const color = PALETTE_COLORS[colorIndex];

  return {
    color,
    bgLight: '#F8FAFC',
    border: '#E2E8F0',
    text: color,
    pptxColor: color.replace('#', ''),
    label: category,
    iconName: 'Bookmark'
  };
}

/**
 * Full list of MAİDER magazine categories — sorted alphabetically.
 * Includes both standard theme categories and user-defined section names.
 */
export const ALL_CATEGORIES: string[] = [
  'AİLE VE TOPLUM',
  'AKIL OYUNLARI VE EĞLENCELİ BİLİM',
  'ATATÜRK KÖŞESİ',
  'BELİRLİ GÜN VE HAFTALAR',
  'BİLGİ ARENASI',
  'BİLİMİN ROTASINI ÇİZENLER',
  'BİLİM VE TEKNOLOJİ',
  'DEĞERLER EĞİTİMİ',
  'DİNİ BİLGİLER VE PEYGAMBERLER',
  'DOĞA, ÇEVRE VE SÜRDÜRÜLEBİLİRLİK',
  'EĞİTİM VE REHBERLİK',
  'GEZİYORUZ – KEŞFEDİYORUZ',
  'KİTAPLIK',
  'MANEVİ DEĞERLER VE KÜLTÜR',
  'MÜZİK KÖŞESİ',
  'OKULUMUZ',
  'OKULUMUZDAN HABERLER',
  'ÖĞRENCİ KALEMİNDEN',
  'ÖNSÖZ / EDİTÖRDEN',
  'PROJELER VE SOSYAL SORUMLULUK',
  'RÖPORTAJ',
  'SAĞLIK VE GÜVENLİ YAŞAM',
  'SANAT VE KÜLTÜR',
  'SİNEMA VE MEDYA',
  'SİVAS\'IMIZ',
  'SİVAS\'IMIZIN DEĞERLERİ',
  'SİZDEN GELENLER',
  'SPOR VE SİVASSPOR',
  'TARİHİMİZ VE MİLLÎ DEĞERLERİMİZ',
  'TÜRKÇE, DİL VE EDEBİYAT',
  // Standard theme categories
  'Bilim', 'STEM', 'Teknoloji', 'Proje', 'eTwinning',
  'Okul Etkinliği', 'Kültür & Sanat', 'Şiir', 'Hikâye',
  'Deneme', 'Röportaj', 'Kitap Tanıtımı', 'Rehberlik',
  'Dijital Vatandaşlık', 'Başarı', 'Fotoğraf Galerisi',
  'Oyun', 'Bulmaca', 'Ekip', 'Okulumuzdan', 'Diğer',
];