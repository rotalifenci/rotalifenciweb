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
  | 'yardimseverlik'
  | 'merhamet'
  | 'guvenilirlik'
  | 'hosgoru'
  | 'vefa'
  | 'cesaret'
  | 'paylasma'
  | 'kardeslik'
  | string;

export interface RootValueDefinition {
  id: RootValueId;
  name: string;
  shortDesc: string;
  description: string;
  icon: string;
  color: string;
  badgeBg: string;
  isCustom?: boolean;
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

export type QuestionFormatType = 'multiple_choice' | 'true_false' | 'open_ended' | 'situational';

export interface EventQuestionItem {
  id: string;
  questionType: QuestionFormatType;
  questionText: string;
  options: string[];
  correctIndex: number;
  acceptableKeywords?: string[];
  hint: string;
  explanation: string;
  imageUrl?: string;
}

export interface ValueRecognitionQuestionItem {
  questionText: string; // e.g. "Bu olayda hangi değer ön plana çıkmaktadır?"
  options: string[];
  correctIndex: number;
  correctValueId: RootValueId;
  hint: string;
  explanation: string;
}

export interface DailyLifeQuestionOption {
  id: string;
  text: string;
  isAppropriate: boolean;
  feedback: string;
}

export interface DailyLifeQuestionItem {
  questionType: 'multiple_choice' | 'situational' | 'open_ended';
  questionText: string;
  options: DailyLifeQuestionOption[];
  openEndedGuide?: string;
  openEndedFeedback?: string;
  imageUrl?: string;
}

export interface EventStationData {
  id: number;
  status?: 'published' | 'draft'; // Teacher publish state
  npc: string;
  npcRole: string;
  npcAvatar: 'scholar' | 'chronicler' | 'teacher' | 'companion_guide';
  positionX: number; // Horizontal percentage on 2.5D overview bar (e.g. 32, 68)
  position3D?: [number, number, number]; // [x, y, z] in the 3D historical environment
  // Storyteller (Ak Sakallı Yaşlı Tarih Anlatıcısı) Audio fields
  storytellerName?: string;
  storytellerAudioId?: string; // IndexedDB media ID (e.g. "audio_571_station_1")
  storytellerAudioUrl?: string; // Direct URL or Data URL if set
  storytellerAudioTitle?: string;
  // Animation / Video fields (Stage 2)
  videoId?: string; // IndexedDB media ID (e.g. "video_571_station_1")
  videoTitle?: string;
  videoDescription?: string;
  animation: string; // Optional teacher/user video URL (.mp4, .webm, or YouTube embed)
  animationScene: {
    badge: string;
    title: string;
    narration: string;
    keyPoints: string[];
    historicalSource: string;
  };
  // Stage 3: Event Question(s)
  eventQuestion: {
    questionType?: QuestionFormatType;
    questionText: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    imageUrl?: string;
  };
  eventQuestions?: EventQuestionItem[];
  hint: string;
  // Stage 4: Value Discovery Question ("Bu olayda hangi değer ön plana çıkmaktadır?")
  associatedValueIds?: RootValueId[];
  valueRecognitionQuestion?: ValueRecognitionQuestionItem;
  // Stage 5: Daily Life Question (Connecting the value to daily life)
  dailyLifeQuestion?: DailyLifeQuestionItem;
  // Legacy combined valueQuestion kept in sync for backward compatibility
  valueQuestion: {
    valueId: RootValueId;
    valueName: string;
    historicalConnection: string;
    questionText: string;
    options: DailyLifeQuestionOption[];
  };
}

export interface YearData {
  year: number; // 571 - 632
  status?: 'published' | 'draft';
  hasVerifiedContent?: boolean;
  title: string;
  subTitle: string;
  location: string;
  sceneEnvironment: 'mecca' | 'madinah' | 'hira' | 'sevr' | 'badr' | 'uhud' | 'hudaybiyyah';
  historicalSummary: string;
  historicalSource: HistoricalSource;
  missions: MissionData[];
  // Interactive 3D & Multi-Station Pedagogical Flow fields
  introAnimation?: string;
  eventStations?: EventStationData[];
  completionMessage?: string;
  nextYear?: number | null;
  previousYear?: number | null;
  // Structured fields for compatibility
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
  completedStationKeys?: string[]; // e.g. "610_1", "610_2"
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
