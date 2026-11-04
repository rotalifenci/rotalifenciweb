import { StudentProgress, YearData } from '../types';
import { getAllYearsData } from '../data/yearsData';

const PROGRESS_KEY = 'dijital_siyer_progress_v1';
const CURRICULUM_KEY = 'dijital_siyer_curriculum_v2';
const ALL_STUDENTS_KEY = 'dijital_siyer_all_students_v1';

export function getInitialProgress(): StudentProgress {
  return {
    studentId: 'OGR-' + Math.floor(1000 + Math.random() * 9000),
    studentName: 'Öğrenci',
    character: 'eren',
    currentYear: 571,
    visitedYears: [571],
    explorationPath: [571],
    completedYears: [],
    completedMissionIds: [],
    wrongAnswerCountByYear: {},
    totalCorrect: 0,
    totalWrong: 0,
    hintsUsedCount: 0,
    videosReplayedCount: 0,
    unlockedValues: [],
    valueAnswers: {},
    preTestCompleted: false,
    preTestScore: 0,
    postTestCompleted: false,
    postTestScore: 0,
    lastSavedAt: new Date().toISOString()
  };
}

export function loadProgress(): StudentProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed.visitedYears)) {
        parsed.visitedYears = [parsed.currentYear || 571];
      }
      if (!Array.isArray(parsed.explorationPath)) {
        parsed.explorationPath = [parsed.currentYear || 571];
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load progress from localStorage', e);
  }
  return getInitialProgress();
}

export function saveProgress(progress: StudentProgress) {
  try {
    progress.lastSavedAt = new Date().toISOString();
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));

    // Also update all-students research cohort
    const cohort = loadAllStudents();
    const idx = cohort.findIndex(s => s.studentId === progress.studentId);
    if (idx !== -1) {
      cohort[idx] = progress;
    } else {
      cohort.push(progress);
    }
    localStorage.setItem(ALL_STUDENTS_KEY, JSON.stringify(cohort));
  } catch (e) {
    console.error('Failed to save progress to localStorage', e);
  }
}

export function loadAllStudents(): StudentProgress[] {
  try {
    const raw = localStorage.getItem(ALL_STUDENTS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load all students', e);
  }
  return [];
}

export function loadCurriculum(): YearData[] {
  try {
    const raw = localStorage.getItem(CURRICULUM_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load curriculum from localStorage', e);
  }
  return getAllYearsData();
}

export function saveCurriculum(years: YearData[]) {
  try {
    localStorage.setItem(CURRICULUM_KEY, JSON.stringify(years));
  } catch (e) {
    console.error('Failed to save curriculum to localStorage', e);
  }
}

export function resetProgress(): StudentProgress {
  const fresh = getInitialProgress();
  saveProgress(fresh);
  return fresh;
}
