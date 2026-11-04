export type CharacterType = 'eren' | 'aybuke';

export type RootValueId =
  | 'adalet'
  | 'dostluk'
  | 'durustluk'
  | 'oz_denetim'
  | 'sabir'
  | 'saygi'
  | 'sevgi'
  | 'sorumluluk'
  | 'vatanseverlik'
  | 'yardimseverlik';

export interface RootValueDefinition {
  id: RootValueId;
  name: string;
  shortDesc: string;
  description: string;
  icon: string;
  color: string;
  badgeBg: string;
}

export interface HistoricalSource {
  sourceName: string;
  authorOrRef: string;
  certaintyLevel: 'Mütevatir / Kesin' | 'Sahih / Kuvvetli' | 'Tarihsel Rivayet / Temsili';
  notes?: string;
}

export interface ValueDiscoveryData {
  valueId: RootValueId;
  recognitionQuestion: string;
  recognitionOptions: string[];
  correctRecognitionIndex: number;
  explanationPrompt: string;
  explanationGuide: string;
  scenarioTitle: string;
  scenarioQuestion: string;
  scenarioOptions: {
    id: string;
    text: string;
    isAppropriate: boolean;
    feedback: string;
  }[];
}

export interface ReinforcementActivity {
  instruction: string;
  question: string;
  options: string[];
  correctIndex: number;
  reinforcementNote: string;
}

export interface MissionData {
  id: string;
  title: string;
  brief: string;
  targetPosition: [number, number, number];
  targetLabel: string;
  animationVideoUrl?: string; // MP4 URL if provided by teacher
  animationVoiceUrl?: string;
  narrativeText: string;
  subtitles: { time: number; text: string }[];
  question: string;
  correctAnswer: string;
  alternativeAnswers: string[];
  hint1: string;
  hint2: string;
  thirdLevelExplanation: string;
  reinforcement: ReinforcementActivity;
  valueDiscovery?: ValueDiscoveryData;
}

export interface YearData {
  year: number; // 571 - 632
  hasVerifiedContent?: boolean;
  title: string;
  subTitle: string;
  location: string;
  sceneEnvironment: 'mecca' | 'madinah' | 'hira' | 'sevr' | 'badr' | 'uhud' | 'hudaybiyyah';
  historicalSummary: string;
  historicalSource: HistoricalSource;
  missions: MissionData[];
  // Structured fields for Section 8 compatibility
  events?: MissionData[];
  values?: RootValueId[];
  sources?: HistoricalSource[];
  images?: string[];
  audio?: string[];
}

export interface StudentProgress {
  studentId: string;
  studentName: string;
  character: CharacterType;
  currentYear: number;
  visitedYears: number[];
  explorationPath: number[];
  completedYears: number[];
  completedMissionIds: string[];
  wrongAnswerCountByYear: Record<number, number>;
  totalCorrect: number;
  totalWrong: number;
  hintsUsedCount: number;
  videosReplayedCount: number;
  unlockedValues: RootValueId[];
  valueAnswers: Record<string, {
    valueId: RootValueId;
    userExplanation: string;
    scenarioChoiceId: string;
    isAppropriate: boolean;
    timestamp: string;
  }>;
  preTestCompleted: boolean;
  preTestScore: number;
  preTestAnswers?: Record<number, number>;
  postTestCompleted: boolean;
  postTestScore: number;
  postTestAnswers?: Record<number, number>;
  lastSavedAt: string;
}

export type GameScreen =
  | 'menu'
  | 'character_select'
  | 'doors_hub'
  | 'year_content'
  | 'game_3d'
  | 'pre_test'
  | 'teacher_panel'
  | 'research_panel'
  | 'final_celebration';

export type ActiveOverlay =
  | null
  | 'mission_cinematic'
  | 'question_modal'
  | 'reinforcement_modal'
  | 'value_discovery_modal'
  | 'history_journal'
  | 'values_journal'
  | 'settings_modal'
  | 'map_modal'
  | 'timeline_selector'
  | 'year_transition'
  | 'teacher_panel'
  | 'research_panel'
  | 'model_inspector'
  | 'test_arena';
