/**
 * MAİDER Öğretmen ve Yazar Kadrosu
 * Mehmet Akif İnan Ortaokulu
 */

export interface TeacherProfile {
  name: string;
  branch: string;
}

export const INITIAL_TEACHERS_LIST: TeacherProfile[] = [
  { name: 'Adem KİRİŞ', branch: 'Türkçe Öğretmeni' },
  { name: 'Emel FIRAT KILIÇ', branch: 'Müzik Öğretmeni' },
  { name: 'Emre KAYA', branch: 'İngilizce Öğretmeni' },
  { name: 'Hatice BİÇER', branch: 'Rehberlik Öğretmeni' },
  { name: 'Kübra POLAT', branch: 'Matematik Öğretmeni' },
  { name: 'Murat KUNDAKCI', branch: 'Fen Bilimleri Öğretmeni' },
  { name: 'Pınar GÖKÇE', branch: 'Türkçe Öğretmeni' },
  { name: 'Tuba CAN', branch: 'Türkçe Öğretmeni' },
  { name: 'Zehra Betül ŞAHİN', branch: 'Din Kültürü ve Ahlak Bilgisi Öğretmeni' }
];

const TEACHERS_STORAGE_KEY = 'maider_teachers_list_v2';

export function getStoredTeachers(): TeacherProfile[] {
  try {
    const data = localStorage.getItem(TEACHERS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load teachers from storage:', e);
  }
  return INITIAL_TEACHERS_LIST;
}

export function saveStoredTeachers(list: TeacherProfile[]): void {
  try {
    localStorage.setItem(TEACHERS_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save teachers to storage:', e);
  }
}

export const TEACHERS_LIST: TeacherProfile[] = INITIAL_TEACHERS_LIST;
