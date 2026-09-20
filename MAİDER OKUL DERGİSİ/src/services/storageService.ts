import { MagazineIssue } from '../types/magazine';
import { DEFAULT_MAIDER_ISSUE } from '../mock/defaultIssue';

const STORAGE_KEY_ISSUES_V2 = 'maider_magazine_issues_v2';
const STORAGE_KEY_ACTIVE_MONTH = 'maider_active_month_index_v2';

export function saveAllIssuesToStorage(issues: MagazineIssue[]): void {
  try {
    if (!issues || issues.length === 0) return;
    localStorage.setItem(STORAGE_KEY_ISSUES_V2, JSON.stringify(issues));
  } catch (err) {
    console.error('LocalStorage save error:', err);
  }
}

export function loadAllIssuesFromStorage(): MagazineIssue[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ISSUES_V2);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Guarantee September 2026 (monthIndex 8, Sayı 9) has Page 15 Çifte Minareli Medrese
      const sept = parsed.find((i: MagazineIssue) => i.monthIndex === 8);
      const p15Template = DEFAULT_MAIDER_ISSUE.pages.find(p => p.pageNumber === 15);
      if (sept && p15Template && !sept.pages.some((p: any) => p.pageNumber === 15 && p.title?.includes('MEDRESE'))) {
        sept.pages = [
          ...sept.pages.filter((p: any) => p.pageNumber !== 15),
          { ...p15Template, issueId: sept.id }
        ].sort((a: any, b: any) => a.pageNumber - b.pageNumber);
      }
      return parsed as MagazineIssue[];
    }
    return null;
  } catch (err) {
    console.error('LocalStorage load error:', err);
    return null;
  }
}

export function saveActiveMonthIndex(index: number): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_MONTH, String(index));
  } catch (err) {
    console.error('LocalStorage active month save error:', err);
  }
}

export function loadActiveMonthIndex(): number {
  try {
    const val = localStorage.getItem(STORAGE_KEY_ACTIVE_MONTH);
    if (val !== null) {
      const parsed = parseInt(val, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 11) {
        return parsed;
      }
    }
    // Default to current month index (0 to 11) or 9 (Ekim)
    const currentMonth = new Date().getMonth();
    return currentMonth >= 0 && currentMonth <= 11 ? currentMonth : 9;
  } catch (err) {
    return 9;
  }
}

// Export project as downloadable .maider JSON file
export function exportProjectToJson(issue: MagazineIssue): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(issue, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `MAIDER-Sayi-${issue.issueNumber}-${issue.month}-${issue.year}.maider`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Import project from .maider JSON file
export function importProjectFromJson(file: File): Promise<MagazineIssue> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        resolve(parsed);
      } catch (err) {
        reject(new Error('Geçersiz MAİDER proje dosyası.'));
      }
    };
    reader.onerror = () => reject(new Error('Dosya okunamadı.'));
    reader.readAsText(file);
  });
}
