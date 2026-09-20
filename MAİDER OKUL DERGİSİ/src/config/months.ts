import { MagazineSection } from '../types/magazine';

export interface MonthInfo {
  index: number; // 0 to 11
  name: string; // "Ocak", "Şubat", ...
  shortName: string; // "Oca", "Şub", ...
  defaultIssueNumber: number;
  season: 'Güz Dönemi' | 'Bahar Dönemi' | 'Yaz / Tatil';
  themeColor: string;
}

export const MONTHS_DATA: MonthInfo[] = [
  { index: 0, name: 'Ocak', shortName: 'Oca', defaultIssueNumber: 1, season: 'Güz Dönemi', themeColor: '#0284C7' },
  { index: 1, name: 'Şubat', shortName: 'Şub', defaultIssueNumber: 2, season: 'Bahar Dönemi', themeColor: '#0EA5E9' },
  { index: 2, name: 'Mart', shortName: 'Mar', defaultIssueNumber: 3, season: 'Bahar Dönemi', themeColor: '#10B981' },
  { index: 3, name: 'Nisan', shortName: 'Nis', defaultIssueNumber: 4, season: 'Bahar Dönemi', themeColor: '#059669' },
  { index: 4, name: 'Mayıs', shortName: 'May', defaultIssueNumber: 5, season: 'Bahar Dönemi', themeColor: '#8B5CF6' },
  { index: 5, name: 'Haziran', shortName: 'Haz', defaultIssueNumber: 6, season: 'Bahar Dönemi', themeColor: '#EC4899' },
  { index: 6, name: 'Temmuz', shortName: 'Tem', defaultIssueNumber: 7, season: 'Yaz / Tatil', themeColor: '#F59E0B' },
  { index: 7, name: 'Ağustos', shortName: 'Ağu', defaultIssueNumber: 8, season: 'Yaz / Tatil', themeColor: '#EA580C' },
  { index: 8, name: 'Eylül', shortName: 'Eyl', defaultIssueNumber: 9, season: 'Güz Dönemi', themeColor: '#3B82F6' },
  { index: 9, name: 'Ekim', shortName: 'Eki', defaultIssueNumber: 10, season: 'Güz Dönemi', themeColor: '#6366F1' },
  { index: 10, name: 'Kasım', shortName: 'Kas', defaultIssueNumber: 11, season: 'Güz Dönemi', themeColor: '#D97706' },
  { index: 11, name: 'Aralık', shortName: 'Ara', defaultIssueNumber: 12, season: 'Güz Dönemi', themeColor: '#0D9488' },
];

export const DEFAULT_MAGAZINE_SECTIONS: MagazineSection[] = [
  { id: 'sec-kapak', name: 'Kapak & Açılış', color: '#0F172A', description: 'Ana kapak, künye ve içindekiler' },
  { id: 'sec-editor', name: 'Editörden / Başyazı', color: '#B45309', description: 'Okul müdürü ve yayın yönetmeni mesajı' },
  { id: 'sec-stem', name: 'STEM & Bilim Köşesi', color: '#8B5CF6', description: 'Laboratuvar, robotik ve teknoloji projeleri' },
  { id: 'sec-etkinlik', name: 'Okul Etkinlikleri & Projeler', color: '#0284C7', description: 'TÜBİTAK, eTwinning ve törenler' },
  { id: 'sec-ogrenci', name: 'Öğrenci Eserleri & Edebiyat', color: '#BE123C', description: 'Şiir, hikâye, deneme ve resimler' },
  { id: 'sec-kultur', name: 'Kültür, Sanat & Kitap', color: '#EA580C', description: 'Kitap incelemeleri, sanat ve sergiler' },
  { id: 'sec-roportaj', name: 'Röportaj & Başarı Hikayeleri', color: '#0F766E', description: 'Öğretmen, mezun ve öğrenci söyleşileri' },
  { id: 'sec-oyun', name: 'Oyun, Bulmaca & Kapanış', color: '#7C3AED', description: 'Zeka oyunları, etkileşimli linkler ve arka kapak' },
];

export const GRADE_OPTIONS = [
  '5-A', '5-B', '5-C', '5-D',
  '6-A', '6-B', '6-C', '6-D',
  '7-A', '7-B', '7-C', '7-D',
  '8-A', '8-B', '8-C', '8-D',
  'Tüm Okul',
  'Bilişim Kulübü',
  'Robotik & STEM Takımı',
  'TÜBİTAK Proje Grubu',
  'Genç Kalemler Kulübü'
];

export const COMMON_TAGS = [
  'Bilim',
  'STEM',
  'Yapay Zekâ',
  'Robotik',
  'Kodlama',
  'TÜBİTAK',
  'eTwinning',
  'Resim',
  'Şiir',
  'Deneme',
  'Tarih & Kültür',
  'Çevre & Doğa',
  'Spor',
  'Rehberlik',
  'Okul Başarısı'
];
