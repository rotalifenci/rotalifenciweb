/**
 * Magazine Sections & Category Management Service
 * MAİDER Dijital Okul Dergisi
 */

export const DEFAULT_MAGAZINE_SECTIONS: string[] = [
  'AİLE VE TOPLUM',
  'AKIL OYUNLARI VE EĞLENCELİ BİLİM',
  'ATATÜRK KÖŞESİ',
  'BELİRLİ GÜN VE HAFTALAR',
  'BİLGİ ARENASI',
  'BİLİM VE TEKNOLOJİ',
  'BİLİMİN ROTASINI ÇİZENLER',
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
  'SİVAS’IMIZ',
  'SİVAS’IMIZIN DEĞERLERİ',
  'SİZDEN GELENLER',
  'SPOR VE SİVASSPOR',
  'TARİHİMİZ VE MİLLÎ DEĞERLERİMİZ',
  'TÜRKÇE, DİL VE EDEBİYAT'
];

const STORAGE_KEY = 'maider_magazine_sections_v2';

/**
 * Turkish collation sort
 */
export function sortTurkishAlphabetical(list: string[]): string[] {
  return [...list].sort((a, b) => a.localeCompare(b, 'tr-TR', { sensitivity: 'base' }));
}

/**
 * Get all available sections, sorted alphabetically in Turkish
 */
export function getStoredSections(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return sortTurkishAlphabetical(parsed);
      }
    }
  } catch (err) {
    console.error('Error loading sections from storage:', err);
  }
  return sortTurkishAlphabetical(DEFAULT_MAGAZINE_SECTIONS);
}

/**
 * Save sections list to localStorage
 */
export function saveSections(sections: string[]): string[] {
  const sorted = sortTurkishAlphabetical(sections);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
  } catch (err) {
    console.error('Error saving sections to storage:', err);
  }
  return sorted;
}

/**
 * Add a new section to the list
 */
export function addSection(newSectionName: string): string[] {
  const trimmed = newSectionName.trim().toUpperCase();
  if (!trimmed) return getStoredSections();

  const current = getStoredSections();
  if (!current.includes(trimmed)) {
    return saveSections([...current, trimmed]);
  }
  return current;
}

/**
 * Update/rename an existing section
 */
export function updateSection(oldName: string, newName: string): string[] {
  const trimmedNew = newName.trim().toUpperCase();
  if (!trimmedNew) return getStoredSections();

  const current = getStoredSections();
  const updated = current.map(s => s === oldName ? trimmedNew : s);
  return saveSections(updated);
}

/**
 * Remove a section from the list
 */
export function removeSection(sectionToRemove: string): string[] {
  const current = getStoredSections();
  const updated = current.filter(s => s !== sectionToRemove);
  // Ensure list is not completely empty
  if (updated.length === 0) {
    return saveSections(['GENEL İÇERİK']);
  }
  return saveSections(updated);
}

/**
 * Reset to official default 30 sections
 */
export function resetSections(): string[] {
  return saveSections(DEFAULT_MAGAZINE_SECTIONS);
}
