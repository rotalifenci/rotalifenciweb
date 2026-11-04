import React, { useState, useEffect, useMemo } from 'react';
import {
  YearData,
  StudentProgress,
  EventStationData,
  RootValueDefinition,
  RootValueId
} from '../types';
import {
  getAllRootValuesList,
  loadCustomValues,
  saveCustomValues
} from '../data/rootValues';
import { loadAllStudents } from '../utils/storage';
import {
  authenticateTeacher,
  isTeacherSessionValid,
  logoutTeacherSession
} from '../utils/teacherAuth';
import {
  validateAudioFile,
  validateVideoFile,
  saveMediaFile,
  getMediaObjectUrl,
  getMediaMetadata,
  deleteMediaFile
} from '../utils/mediaStore';
import {
  GraduationCap,
  Save,
  RotateCcw,
  X,
  CheckCircle2,
  Download,
  Upload,
  Lock,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Volume2,
  Film,
  HelpCircle,
  Heart,
  MessageSquare,
  Eye,
  AlertTriangle,
  Sparkles,
  BookOpen,
  LogOut
} from 'lucide-react';

interface TeacherPanelModalProps {
  years: YearData[];
  progress: StudentProgress;
  onUpdateCurriculum: (years: YearData[]) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

type TeacherTabId =
  | 'tab_1_event'
  | 'tab_2_audio'
  | 'tab_3_video'
  | 'tab_4_event_questions'
  | 'tab_5_values'
  | 'tab_6_value_questions'
  | 'tab_7_daily_life'
  | 'tab_8_preview_publish';

const TABS: Array<{ id: TeacherTabId; label: string; shortLabel: string }> = [
  { id: 'tab_1_event', label: '1. Tarihsel Olay', shortLabel: '1. Olay' },
  { id: 'tab_2_audio', label: '2. Sesli Anlatım', shortLabel: '2. Ses' },
  { id: 'tab_3_video', label: '3. Animasyon / Video', shortLabel: '3. Video' },
  { id: 'tab_4_event_questions', label: '4. Olay Soruları', shortLabel: '4. Olay Sorusu' },
  { id: 'tab_5_values', label: '5. Değerler', shortLabel: '5. Değerler' },
  { id: 'tab_6_value_questions', label: '6. Değer Soruları', shortLabel: '6. Değer Sorusu' },
  { id: 'tab_7_daily_life', label: '7. Günlük Hayat Soruları', shortLabel: '7. Günlük Hayat' },
  { id: 'tab_8_preview_publish', label: '8. Ön İzleme ve Yayınlama', shortLabel: '8. Yayınla' }
];

const DEFAULT_3D_POSITIONS: [number, number, number][] = [
  [-6.5, 0.15, -2.5],
  [6.5, 0.15, -4.5],
  [-8.0, 0.15, -12.0],
  [8.5, 0.15, -13.5],
  [0.0, 0.0, 14.0]
];

function createBlankEventStation(year: number, nextId: number): EventStationData {
  return {
    id: nextId,
    status: 'published',
    npc: `Rehber Muallim (${nextId}. Durak)`,
    npcRole: `${nextId}. Olay Durağı • Soru Rehber Karakteri`,
    npcAvatar: 'scholar',
    positionX: Math.min(82, 34 + (nextId - 1) * 20),
    position3D: DEFAULT_3D_POSITIONS[(nextId - 1) % DEFAULT_3D_POSITIONS.length],
    storytellerName: 'Ak Sakallı Tarih Anlatıcısı',
    storytellerAudioId: `audio_${year}_station_${nextId}`,
    storytellerAudioUrl: '',
    storytellerAudioTitle: `${year} Yılı – ${nextId}. Olay Durağı Sesli Anlatımı`,
    videoId: `video_${year}_station_${nextId}`,
    videoTitle: `${year} Yılı – ${nextId}. Olay Durağı Animasyonu`,
    videoDescription: '',
    animation: '',
    animationScene: {
      badge: `${year} Yılı • ${nextId}. Olay Durağı`,
      title: `${year} Yılı Yeni Tarihsel Olay Durağı`,
      narration: 'Bu olay durağı için tarihsel anlatım metnini buraya yazabilirsiniz.',
      keyPoints: ['Olayın temel tarihsel önemi', 'Peygamber Efendimizin (s.a.v.) örnek ahlakı'],
      historicalSource: 'Sîret-i İbn Hişâm & TDV İslam Ansiklopedisi'
    },
    eventQuestion: {
      questionType: 'multiple_choice',
      questionText: `${year} yılındaki bu tarihsel olayla ilgili temel soru metnini giriniz:`,
      options: ['Doğru Seçenek', '2. Seçenek', '3. Seçenek', '4. Seçenek'],
      correctIndex: 0,
      explanation: 'Doğru cevabın tarihsel açıklaması.'
    },
    hint: 'Öğrenci yanlış cevap verdiğinde gösterilecek yönlendirici ipucu.',
    associatedValueIds: ['merhamet'],
    valueRecognitionQuestion: {
      questionText: 'Bu olayda hangi değer ön plana çıkmaktadır?',
      options: ['Merhamet', 'Acelecilik', 'Gösteriş', 'Kayıtsızlık'],
      correctIndex: 0,
      correctValueId: 'merhamet',
      hint: 'Olaydaki şefkat ve iyilik yönünü düşün.',
      explanation: 'Bu tarihsel olayda Merhamet değeri ön plana çıkmaktadır.'
    },
    dailyLifeQuestion: {
      questionType: 'multiple_choice',
      questionText: 'Bu olaydan öğrendiğimiz değeri günlük hayatımızda nasıl uygulayabiliriz?',
      options: [
        {
          id: `dl_${year}_${nextId}_1`,
          text: 'Çevremdeki insanlara ve canlılara karşı her zaman merhametli, adil ve yapıcı davranırım.',
          isAppropriate: true,
          feedback: 'Tebrikler! Öğrendiğin değeri günlük hayatla çok güzel ilişkilendirdin.'
        },
        {
          id: `dl_${year}_${nextId}_2`,
          text: 'Sadece kendi çıkarımı düşünürüm.',
          isAppropriate: false,
          feedback: 'Tekrar düşünelim: Peygamberimiz her zaman şefkat ve adaleti öğütlemiştir.'
        }
      ],
      openEndedGuide: 'Sen olsaydın bu değeri okulda veya evde nasıl yaşatırdın?',
      openEndedFeedback: 'Düşünceni paylaştığın için teşekkürler! Bu değeri yaşatmak çevremize huzur katar.'
    },
    valueQuestion: {
      valueId: 'merhamet',
      valueName: 'Merhamet',
      historicalConnection: 'Bu tarihsel olay bize merhamet ve adaletin önemini öğretir.',
      questionText: 'Bu olaydan öğrendiğimiz değeri günlük hayatımızda nasıl uygulayabiliriz?',
      options: [
        {
          id: `dl_${year}_${nextId}_1`,
          text: 'Çevremdeki insanlara ve canlılara karşı her zaman merhametli, adil ve yapıcı davranırım.',
          isAppropriate: true,
          feedback: 'Tebrikler! Öğrendiğin değeri günlük hayatla çok güzel ilişkilendirdin.'
        },
        {
          id: `dl_${year}_${nextId}_2`,
          text: 'Sadece kendi çıkarımı düşünürüm.',
          isAppropriate: false,
          feedback: 'Tekrar düşünelim: Peygamberimiz her zaman şefkat ve adaleti öğütlemiştir.'
        }
      ]
    }
  };
}

export const TeacherPanelModal: React.FC<TeacherPanelModalProps> = ({
  years,
  progress,
  onUpdateCurriculum,
  onResetProgress,
  onClose
}) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingSession, setIsCheckingSession] = useState<boolean>(true);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Editable curriculum & values state
  const [editableYears, setEditableYears] = useState<YearData[]>(years);
  const [allValuesList, setAllValuesList] = useState<RootValueDefinition[]>(() =>
    getAllRootValuesList()
  );

  // Active navigation state
  const [selectedYearNum, setSelectedYearNum] = useState<number>(progress.currentYear || 571);
  const [selectedStationIndex, setSelectedStationIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<TeacherTabId>('tab_1_event');

  // Status banner
  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'warning' | 'error';
    text: string;
  } | null>(null);

  // Media preview state for Tab 2 (Audio) & Tab 3 (Video)
  const [previewAudioUrl, setPreviewAudioUrl] = useState<string | null>(null);
  const [previewAudioMeta, setPreviewAudioMeta] = useState<string | null>(null);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [previewVideoMeta, setPreviewVideoMeta] = useState<string | null>(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState<boolean>(false);

  // Tab 5: New Custom Value inputs
  const [newValName, setNewValName] = useState<string>('');
  const [newValShortDesc, setNewValShortDesc] = useState<string>('');
  const [newValFullDesc, setNewValFullDesc] = useState<string>('');

  // Verify existing teacher session on mount
  useEffect(() => {
    let mounted = true;
    isTeacherSessionValid().then(valid => {
      if (mounted) {
        setIsAuthenticated(valid);
        setIsCheckingSession(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const selectedYear = useMemo(
    () => editableYears.find(y => y.year === selectedYearNum) || editableYears[0],
    [editableYears, selectedYearNum]
  );

  const stationsInYear: EventStationData[] = useMemo(
    () => selectedYear.eventStations || [],
    [selectedYear]
  );

  const activeStation: EventStationData | null = useMemo(
    () => stationsInYear[selectedStationIndex] || stationsInYear[0] || null,
    [stationsInYear, selectedStationIndex]
  );

  // Load audio & video previews whenever active station changes
  useEffect(() => {
    let mounted = true;
    async function refreshPreviews() {
      if (!activeStation) {
        setPreviewAudioUrl(null);
        setPreviewAudioMeta(null);
        setPreviewVideoUrl(null);
        setPreviewVideoMeta(null);
        return;
      }

      // Audio preview
      if (activeStation.storytellerAudioId) {
        const aUrl = await getMediaObjectUrl(activeStation.storytellerAudioId);
        const aMeta = await getMediaMetadata(activeStation.storytellerAudioId);
        if (mounted && aUrl) {
          setPreviewAudioUrl(aUrl);
          setPreviewAudioMeta(
            aMeta
              ? `${aMeta.fileName} (${(aMeta.sizeBytes / (1024 * 1024)).toFixed(2)} MB)`
              : 'IndexedDB Ses Kaydı'
          );
        } else if (mounted) {
          setPreviewAudioUrl(activeStation.storytellerAudioUrl || null);
          setPreviewAudioMeta(activeStation.storytellerAudioUrl ? 'Harici Ses Bağlantısı' : null);
        }
      } else if (mounted) {
        setPreviewAudioUrl(activeStation.storytellerAudioUrl || null);
        setPreviewAudioMeta(activeStation.storytellerAudioUrl ? 'Harici Ses Bağlantısı' : null);
      }

      // Video preview
      if (activeStation.videoId) {
        const vUrl = await getMediaObjectUrl(activeStation.videoId);
        const vMeta = await getMediaMetadata(activeStation.videoId);
        if (mounted && vUrl) {
          setPreviewVideoUrl(vUrl);
          setPreviewVideoMeta(
            vMeta
              ? `${vMeta.fileName} (${(vMeta.sizeBytes / (1024 * 1024)).toFixed(2)} MB)`
              : 'IndexedDB Video Kaydı'
          );
        } else if (mounted) {
          setPreviewVideoUrl(activeStation.animation || null);
          setPreviewVideoMeta(activeStation.animation ? 'Harici Video Bağlantısı' : null);
        }
      } else if (mounted) {
        setPreviewVideoUrl(activeStation.animation || null);
        setPreviewVideoMeta(activeStation.animation ? 'Harici Video Bağlantısı' : null);
      }
    }

    refreshPreviews();
    return () => {
      mounted = false;
    };
  }, [activeStation]);

  const showBanner = (type: 'success' | 'warning' | 'error', text: string) => {
    setStatusBanner({ type, text });
    setTimeout(() => setStatusBanner(null), 4000);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const res = await authenticateTeacher(passwordInput);
    if (res.ok) {
      setIsAuthenticated(true);
      setPasswordInput('');
    } else {
      setAuthError(res.error || 'Parola doğrulanamadı.');
    }
  };

  const handleLogout = () => {
    logoutTeacherSession();
    setIsAuthenticated(false);
  };

  // Update helper for current year
  const updateSelectedYear = (updater: (yearObj: YearData) => YearData) => {
    setEditableYears(prev => {
      const next = prev.map(y => (y.year === selectedYearNum ? updater(y) : y));
      return next;
    });
  };

  // Update helper for current station
  const updateActiveStation = (updater: (st: EventStationData) => EventStationData) => {
    if (!activeStation) return;
    updateSelectedYear(y => {
      const list = [...(y.eventStations || [])];
      const idx = list.findIndex(s => s.id === activeStation.id);
      if (idx === -1) return y;
      list[idx] = updater(list[idx]);
      return {
        ...y,
        hasVerifiedContent: true,
        eventStations: list
      };
    });
  };

  // Add a new event station to the selected year
  const handleAddStationToYear = () => {
    const nextId =
      stationsInYear.length > 0 ? Math.max(...stationsInYear.map(s => s.id)) + 1 : 1;
    const newStation = createBlankEventStation(selectedYearNum, nextId);

    updateSelectedYear(y => {
      const updatedStations = [...(y.eventStations || []), newStation];
      return {
        ...y,
        hasVerifiedContent: true,
        status: 'published',
        title: y.title === `${y.year} Yılı` ? `${y.year} Yılı Tarihsel Olayları` : y.title,
        eventStations: updatedStations
      };
    });
    setSelectedStationIndex(stationsInYear.length);
    showBanner('success', `${selectedYearNum} yılına ${nextId}. Olay Durağı eklendi!`);
  };

  // Delete an event station
  const handleDeleteStation = (stationId: number) => {
    if (!window.confirm('Bu olay durağını silmek istediğinize emin misiniz?')) return;
    updateSelectedYear(y => {
      const filtered = (y.eventStations || []).filter(s => s.id !== stationId);
      return {
        ...y,
        hasVerifiedContent: filtered.length > 0,
        eventStations: filtered
      };
    });
    setSelectedStationIndex(0);
    showBanner('warning', 'Olay durağı silindi.');
  };

  // Reorder station up or down
  const handleMoveStationOrder = (index: number, direction: -1 | 1) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= stationsInYear.length) return;
    updateSelectedYear(y => {
      const list = [...(y.eventStations || [])];
      const temp = list[index];
      list[index] = list[targetIdx];
      list[targetIdx] = temp;
      // Re-index IDs & 3D positions sequentially
      const reindexed = list.map((st, i) => ({
        ...st,
        id: i + 1,
        position3D: DEFAULT_3D_POSITIONS[i % DEFAULT_3D_POSITIONS.length]
      }));
      return {
        ...y,
        eventStations: reindexed
      };
    });
    setSelectedStationIndex(targetIdx);
  };

  // Save all changes live into curriculum
  const handleSaveCurriculumNow = (publishStatus?: 'published' | 'draft') => {
    let nextYears = editableYears;
    if (publishStatus && activeStation) {
      nextYears = editableYears.map(y => {
        if (y.year !== selectedYearNum) return y;
        const updatedStations = (y.eventStations || []).map(st =>
          st.id === activeStation.id ? { ...st, status: publishStatus } : st
        );
        return {
          ...y,
          hasVerifiedContent: updatedStations.length > 0,
          eventStations: updatedStations
        };
      });
      setEditableYears(nextYears);
    }

    onUpdateCurriculum(nextYears);
    showBanner(
      'success',
      publishStatus === 'draft'
        ? 'Değişiklikler taslak olarak kaydedildi!'
        : 'Tüm değişiklikler kaydedildi ve öğrenci ekranında yayınlandı!'
    );
  };

  // TAB 2: Upload Audio File (MP3, WAV, M4A) to IndexedDB
  const handleAudioFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeStation) return;

    const validation = validateAudioFile(file);
    if (!validation.valid) {
      showBanner('error', validation.error || 'Geçersiz ses dosyası.');
      e.target.value = '';
      return;
    }

    setIsUploadingMedia(true);
    try {
      const mediaId = `audio_${selectedYearNum}_station_${activeStation.id}`;
      const objUrl = await saveMediaFile({
        id: mediaId,
        category: 'audio',
        year: selectedYearNum,
        stationId: activeStation.id,
        fileName: file.name,
        mimeType: file.type || 'audio/mpeg',
        sizeBytes: file.size,
        title: activeStation.storytellerAudioTitle || file.name,
        blob: file,
        updatedAt: new Date().toISOString()
      });

      updateActiveStation(st => ({
        ...st,
        storytellerAudioId: mediaId,
        storytellerAudioTitle: st.storytellerAudioTitle || file.name.replace(/\.[^.]+$/, '')
      }));

      setPreviewAudioUrl(objUrl);
      setPreviewAudioMeta(`${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
      showBanner(
        'success',
        `"${file.name}" ses dosyası yüklendi ve ${activeStation.id}. Durak Ak Sakallı Tarih Anlatıcısına bağlandı!`
      );
    } catch {
      showBanner('error', 'Ses dosyası kaydedilirken bir hata oluştu.');
    } finally {
      setIsUploadingMedia(false);
      e.target.value = '';
    }
  };

  const handleRemoveAudioFile = async () => {
    if (!activeStation) return;
    if (activeStation.storytellerAudioId) {
      await deleteMediaFile(activeStation.storytellerAudioId);
    }
    updateActiveStation(st => ({
      ...st,
      storytellerAudioUrl: ''
    }));
    setPreviewAudioUrl(null);
    setPreviewAudioMeta(null);
    showBanner('warning', 'Bu durağa ait sesli anlatım kaldırıldı.');
  };

  // TAB 3: Upload Video File (MP4, WebM) to IndexedDB
  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeStation) return;

    const validation = validateVideoFile(file);
    if (!validation.valid) {
      showBanner('error', validation.error || 'Geçersiz video dosyası.');
      e.target.value = '';
      return;
    }

    setIsUploadingMedia(true);
    try {
      const mediaId = `video_${selectedYearNum}_station_${activeStation.id}`;
      const objUrl = await saveMediaFile({
        id: mediaId,
        category: 'video',
        year: selectedYearNum,
        stationId: activeStation.id,
        fileName: file.name,
        mimeType: file.type || 'video/mp4',
        sizeBytes: file.size,
        title: activeStation.videoTitle || file.name,
        description: activeStation.videoDescription || '',
        blob: file,
        updatedAt: new Date().toISOString()
      });

      updateActiveStation(st => ({
        ...st,
        videoId: mediaId,
        videoTitle: st.videoTitle || file.name.replace(/\.[^.]+$/, '')
      }));

      setPreviewVideoUrl(objUrl);
      setPreviewVideoMeta(`${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
      showBanner(
        'success',
        `"${file.name}" animasyon/video dosyası yüklendi ve ${activeStation.id}. Durağa bağlandı!`
      );
    } catch {
      showBanner('error', 'Video dosyası kaydedilirken bir hata oluştu.');
    } finally {
      setIsUploadingMedia(false);
      e.target.value = '';
    }
  };

  const handleRemoveVideoFile = async () => {
    if (!activeStation) return;
    if (activeStation.videoId) {
      await deleteMediaFile(activeStation.videoId);
    }
    updateActiveStation(st => ({
      ...st,
      animation: ''
    }));
    setPreviewVideoUrl(null);
    setPreviewVideoMeta(null);
    showBanner('warning', 'Bu durağa ait animasyon/video dosyası kaldırıldı.');
  };

  // TAB 5: Add Custom Value
  const handleAddCustomValue = () => {
    const cleanName = newValName.trim();
    if (!cleanName) {
      showBanner('error', 'Lütfen eklenecek değerin adını yazınız.');
      return;
    }
    const idSlug = cleanName
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '_');

    const newVal: RootValueDefinition = {
      id: idSlug,
      name: cleanName,
      shortDesc: newValShortDesc.trim() || `${cleanName} ahlaki değeri.`,
      description:
        newValFullDesc.trim() ||
        `Peygamber Efendimizin (s.a.v.) hayatında örneklediği ${cleanName} değerini günlük hayatımızda yaşatmak.`,
      icon: 'Heart',
      color: '#10b981',
      badgeBg: 'bg-emerald-600',
      isCustom: true
    };

    const existingCustom = loadCustomValues().filter(v => v.id !== idSlug);
    const updatedCustom = [...existingCustom, newVal];
    saveCustomValues(updatedCustom);
    setAllValuesList(getAllRootValuesList());
    setNewValName('');
    setNewValShortDesc('');
    setNewValFullDesc('');
    showBanner('success', `"${cleanName}" değeri değerler listesine eklendi!`);
  };

  // Export & Import JSON backup
  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(editableYears, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', 'dijital_siyer_mufredat_yedek.json');
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (Array.isArray(parsed)) {
          setEditableYears(parsed);
          onUpdateCurriculum(parsed);
          showBanner('success', 'Müfredat JSON yedeği başarıyla yüklendi ve yayınlandı!');
        }
      } catch {
        showBanner('error', 'Geçersiz JSON dosyası.');
      }
    };
    reader.readAsText(file);
  };

  const allStudents = useMemo(() => loadAllStudents(), []);

  return (
    <div
      id="teacher-management-panel-modal"
      className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-6xl bg-stone-900 border-2 border-purple-500/50 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[94dvh]">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-purple-950 via-stone-900 to-purple-950 px-4 sm:px-6 py-3.5 border-b border-purple-500/30 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-black text-purple-300 uppercase tracking-widest block">
                TÜBİTAK 2204-B • Kodsuz İçerik ve Medya Yönetim Sistemi
              </span>
              <h2 className="text-base sm:text-lg font-black text-white">
                Öğretmen Yönetim Paneli (571–632 Tüm Yıllar & Olay Durakları)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <button
                  type="button"
                  id="btn-teacher-save-publish"
                  onClick={() => handleSaveCurriculumNow('published')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-stone-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg transition active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Kaydet ve Yayınla</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-600"
                  title="Oturumu Kapat"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-600"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* STATUS BANNER */}
        {statusBanner && (
          <div
            className={`px-5 py-2.5 text-xs sm:text-sm font-black flex items-center gap-2 border-b shrink-0 ${
              statusBanner.type === 'success'
                ? 'bg-emerald-950 text-emerald-200 border-emerald-500/50'
                : statusBanner.type === 'warning'
                ? 'bg-amber-950 text-amber-200 border-amber-500/50'
                : 'bg-rose-950 text-rose-200 border-rose-500/50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusBanner.text}</span>
          </div>
        )}

        {/* AUTHENTICATION SCREEN IF NOT LOGGED IN */}
        {isCheckingSession ? (
          <div className="p-12 text-center text-stone-300 text-sm font-bold">
            Yetki kontrol ediliyor...
          </div>
        ) : !isAuthenticated ? (
          <form onSubmit={handleLoginSubmit} className="p-6 sm:p-10 max-w-md mx-auto text-center space-y-5 my-auto">
            <div className="w-16 h-16 rounded-2xl bg-purple-950 border-2 border-purple-500/50 flex items-center justify-center mx-auto text-purple-300 shadow-xl">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white mb-1">Yetkili Öğretmen Girişi</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                571–632 yılları arasındaki tarihsel olayları, Ak Sakallı Tarih Anlatıcısı ses dosyalarını, animasyon videolarını, değerleri ve soruları düzenlemek için öğretmen parolasını giriniz.
              </p>
              <p className="text-[11px] text-purple-300/90 mt-2 font-mono bg-purple-950/50 py-1 px-3 rounded-lg border border-purple-500/30 inline-block">
                Varsayılan Öğretmen Parolası: siyer2026
              </p>
            </div>

            <input
              type="password"
              id="teacher-password-input"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              placeholder="Öğretmen parolası..."
              className="w-full bg-stone-950 border-2 border-stone-700 focus:border-purple-500 rounded-xl px-4 py-3 text-white text-center font-bold focus:outline-none"
              autoFocus
            />

            {authError && (
              <p className="text-xs text-rose-400 font-bold bg-rose-950/60 p-2.5 rounded-xl border border-rose-500/40">
                {authError}
              </p>
            )}

            <button
              type="submit"
              id="btn-teacher-login-submit"
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-sm shadow-lg transition"
            >
              Yönetim Paneline Giriş Yap
            </button>
          </form>
        ) : (
          /* ================================================================= */
          /* AUTHENTICATED 8-TAB TEACHER CMS WORKSPACE                         */
          /* ================================================================= */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* TOP BAR: YEAR SELECTOR (571-632) & EVENT STATION SELECTOR */}
            <div className="bg-stone-950/90 px-4 sm:px-6 py-3 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
              {/* Year Selector (All 62 Years 571-632) */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-black text-amber-300 whitespace-nowrap">
                  Yıl Seçimi (571–632):
                </label>
                <select
                  id="teacher-year-select"
                  value={selectedYearNum}
                  onChange={e => {
                    setSelectedYearNum(Number(e.target.value));
                    setSelectedStationIndex(0);
                  }}
                  className="bg-stone-900 border border-amber-500/50 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-black text-white focus:outline-none"
                >
                  {editableYears.map(y => {
                    const count = (y.eventStations || []).length;
                    return (
                      <option key={y.year} value={y.year}>
                        {y.year} – {y.title} ({count} Olay Durağı)
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Event Station Selector + Add/Reorder/Delete */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-stone-400">Olay Durağı:</span>
                {stationsInYear.map((st, idx) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSelectedStationIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black border transition flex items-center gap-1.5 ${
                      selectedStationIndex === idx
                        ? 'bg-purple-600 text-white border-purple-300 shadow'
                        : 'bg-stone-900 text-stone-300 border-stone-700 hover:bg-stone-800'
                    }`}
                  >
                    <span>{idx + 1}. Durak</span>
                    {st.status === 'draft' && (
                      <span className="px-1.5 py-0.2 bg-amber-500/30 text-amber-300 rounded text-[9px]">
                        Taslak
                      </span>
                    )}
                  </button>
                ))}

                <button
                  type="button"
                  id="btn-teacher-add-station"
                  onClick={handleAddStationToYear}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1 shadow transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Yeni Olay Durağı Ekle</span>
                </button>
              </div>
            </div>

            {/* 8 NAVIGATION TABS */}
            <div className="bg-stone-900 px-3 sm:px-6 pt-2 border-b border-stone-800 flex items-center gap-1.5 overflow-x-auto shrink-0">
              {TABS.map(t => (
                <button
                  key={t.id}
                  type="button"
                  id={`teacher-${t.id}`}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-3.5 py-2 rounded-t-xl text-xs font-black whitespace-nowrap border-t border-x transition ${
                    activeTab === t.id
                      ? 'bg-stone-950 text-amber-300 border-purple-500/60'
                      : 'bg-stone-900/60 text-stone-400 border-transparent hover:text-stone-200'
                  }`}
                >
                  <span className="hidden md:inline">{t.label}</span>
                  <span className="md:hidden">{t.shortLabel}</span>
                </button>
              ))}
            </div>

            {/* TAB CONTENT AREA */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-950/60">
              {!activeStation && activeTab !== 'tab_5_values' && activeTab !== 'tab_8_preview_publish' ? (
                <div className="max-w-xl mx-auto my-8 rounded-2xl bg-stone-900 border border-amber-500/40 p-6 text-center space-y-4">
                  <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
                  <h4 className="text-base font-black text-white">
                    {selectedYearNum} Yılında Henüz Olay Durağı Bulunmuyor
                  </h4>
                  <p className="text-xs text-stone-300">
                    Bu yıla yeni bir tarihsel olay durağı, sesli anlatım, animasyon ve soru eklemek için aşağıdaki butona tıklayın.
                  </p>
                  <button
                    type="button"
                    onClick={handleAddStationToYear}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{selectedYearNum} Yılına 1. Olay Durağını Ekle</span>
                  </button>
                </div>
              ) : (
                <>
                  {/* ========================================================= */}
                  {/* SEKME 1: TARİHSEL OLAY                                    */}
                  {/* ========================================================= */}
                  {activeTab === 'tab_1_event' && activeStation && (
                    <div className="space-y-5 max-w-4xl mx-auto">
                      <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-900 p-4 rounded-2xl border border-stone-800">
                        <div>
                          <span className="text-xs font-black text-purple-300 uppercase">
                            {selectedYearNum} Yılı • {selectedStationIndex + 1}. Olay Durağı Düzenleme
                          </span>
                          <h4 className="text-sm font-black text-white">
                            {activeStation.animationScene.title}
                          </h4>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleMoveStationOrder(selectedStationIndex, -1)}
                            disabled={selectedStationIndex === 0}
                            className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-200 border border-stone-700"
                            title="Sırayı Yukarı Taşı"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveStationOrder(selectedStationIndex, 1)}
                            disabled={selectedStationIndex >= stationsInYear.length - 1}
                            className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-200 border border-stone-700"
                            title="Sırayı Aşağı Taşı"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>

                          <select
                            value={activeStation.status || 'published'}
                            onChange={e =>
                              updateActiveStation(st => ({
                                ...st,
                                status: e.target.value as 'published' | 'draft'
                              }))
                            }
                            className="bg-stone-950 border border-amber-500/40 rounded-xl px-3 py-1.5 text-xs font-black text-amber-300"
                          >
                            <option value="published">Durum: Yayında</option>
                            <option value="draft">Durum: Taslak</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => handleDeleteStation(activeStation.id)}
                            className="px-3 py-1.5 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-500/40 text-xs font-bold flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Durağı Sil</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-900 p-5 rounded-2xl border border-stone-800">
                        <div>
                          <label className="block text-xs font-bold text-stone-300 mb-1">
                            Yıl Genel Başlığı ({selectedYearNum}):
                          </label>
                          <input
                            type="text"
                            value={selectedYear.title}
                            onChange={e =>
                              updateSelectedYear(y => ({ ...y, title: e.target.value }))
                            }
                            className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-300 mb-1">
                            Tarihsel Mekân Adı:
                          </label>
                          <input
                            type="text"
                            value={selectedYear.location}
                            onChange={e =>
                              updateSelectedYear(y => ({ ...y, location: e.target.value }))
                            }
                            className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-amber-300 mb-1">
                            {selectedStationIndex + 1}. Olay Durağı Başlığı:
                          </label>
                          <input
                            type="text"
                            id="input-station-title"
                            value={activeStation.animationScene.title}
                            onChange={e =>
                              updateActiveStation(st => ({
                                ...st,
                                animationScene: { ...st.animationScene, title: e.target.value }
                              }))
                            }
                            className="w-full bg-stone-950 border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-300 mb-1">
                            Soru Rehber Karakteri Adı:
                          </label>
                          <input
                            type="text"
                            value={activeStation.npc}
                            onChange={e =>
                              updateActiveStation(st => ({ ...st, npc: e.target.value }))
                            }
                            className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-300 mb-1">
                            3B Tarihsel Sahne Ortamı:
                          </label>
                          <select
                            value={selectedYear.sceneEnvironment}
                            onChange={e =>
                              updateSelectedYear(y => ({
                                ...y,
                                sceneEnvironment: e.target.value as any
                              }))
                            }
                            className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                          >
                            <option value="mecca">Mekke-i Mükerreme ve Kâbe Avlusu</option>
                            <option value="hira">Cebel-i Nûr ve Hira Mağarası</option>
                            <option value="sevr">Sevr Dağı ve Hicret Yolu</option>
                            <option value="madinah">Medine-i Münevvere ve Mescid-i Nebevî</option>
                            <option value="badr">Bedir Vadisi</option>
                            <option value="uhud">Uhud Dağı ve Okçular Tepesi</option>
                            <option value="hudaybiyyah">Hudeybiye Meydanı</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-300 mb-1">
                            Tarihsel Kaynak Bilgisi:
                          </label>
                          <input
                            type="text"
                            value={activeStation.animationScene.historicalSource}
                            onChange={e =>
                              updateActiveStation(st => ({
                                ...st,
                                animationScene: {
                                  ...st.animationScene,
                                  historicalSource: e.target.value
                                }
                              }))
                            }
                            className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-stone-300 mb-1">
                            Olay Durağı Tarihsel Anlatımı / Özeti:
                          </label>
                          <textarea
                            rows={4}
                            value={activeStation.animationScene.narration}
                            onChange={e =>
                              updateActiveStation(st => ({
                                ...st,
                                animationScene: {
                                  ...st.animationScene,
                                  narration: e.target.value
                                }
                              }))
                            }
                            className="w-full bg-stone-950 border border-stone-700 rounded-xl p-3 text-xs text-white leading-relaxed"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* SEKME 2: SESLİ ANLATIM (AK SAKALLI TARİH ANLATICISI)       */}
                  {/* ========================================================= */}
                  {activeTab === 'tab_2_audio' && activeStation && (
                    <div className="space-y-5 max-w-3xl mx-auto">
                      <div className="rounded-2xl bg-amber-950/30 border border-amber-500/40 p-5 space-y-3">
                        <div className="flex items-center gap-3">
                          <Volume2 className="w-6 h-6 text-amber-400 shrink-0" />
                          <div>
                            <h4 className="text-sm sm:text-base font-black text-amber-200">
                              Ak Sakallı Yaşlı Tarih Anlatıcısı Ses Dosyası ({selectedYearNum} Yılı • {selectedStationIndex + 1}. Durak)
                            </h4>
                            <p className="text-xs text-stone-300">
                              Buradan yüklediğiniz MP3, WAV veya M4A ses dosyası doğrudan 3B sahnedeki Ak Sakallı Tarih Anlatıcısına bağlanır. Öğrenci "Olayı Dinle" dediğinde bu ses çalınır.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-stone-900 border border-stone-800 p-5 space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-stone-300 mb-1">
                            Sesli Anlatım Başlığı:
                          </label>
                          <input
                            type="text"
                            value={activeStation.storytellerAudioTitle || ''}
                            onChange={e =>
                              updateActiveStation(st => ({
                                ...st,
                                storytellerAudioTitle: e.target.value
                              }))
                            }
                            placeholder="Örn: 610 Yılı İlk Vahiy Hadisesi Sesli Anlatımı"
                            className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>

                        {/* File Upload Box */}
                        <div className="rounded-2xl border-2 border-dashed border-amber-500/50 bg-stone-950/70 p-5 text-center space-y-3">
                          <Upload className="w-8 h-8 text-amber-400 mx-auto" />
                          <div className="text-xs text-stone-300">
                            <span className="font-black text-amber-200 block">
                              Bilgisayardan Ses Dosyası Yükle (MP3, WAV, M4A)
                            </span>
                            <span>Maksimum 50 MB • Tarayıcı veritabanına (IndexedDB) kalıcı olarak kaydedilir</span>
                          </div>
                          <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs cursor-pointer shadow-lg transition">
                            <Upload className="w-4 h-4" />
                            <span>{isUploadingMedia ? 'Yükleniyor...' : 'Ses Dosyası Seç (.mp3, .wav, .m4a)'}</span>
                            <input
                              type="file"
                              accept=".mp3,.wav,.m4a,audio/mpeg,audio/wav,audio/mp4,audio/x-m4a"
                              onChange={handleAudioFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* Optional Direct Audio URL */}
                        <div>
                          <label className="block text-xs font-bold text-stone-400 mb-1">
                            Veya Harici Ses Dosyası Bağlantısı (URL - İsteğe Bağlı):
                          </label>
                          <input
                            type="text"
                            value={activeStation.storytellerAudioUrl || ''}
                            onChange={e =>
                              updateActiveStation(st => ({
                                ...st,
                                storytellerAudioUrl: e.target.value
                              }))
                            }
                            placeholder="Örn: /assets/audio/610_vahiy.mp3 veya https://..."
                            className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>

                        {/* Audio Preview Player */}
                        {previewAudioUrl ? (
                          <div className="rounded-2xl bg-stone-950 border border-emerald-500/40 p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-emerald-300">
                                Yüklü Ses Ön İzleme: {previewAudioMeta}
                              </span>
                              <button
                                type="button"
                                onClick={handleRemoveAudioFile}
                                className="px-3 py-1 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-200 text-xs font-bold border border-rose-500/40 flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Ses Dosyasını Kaldır</span>
                              </button>
                            </div>
                            <audio src={previewAudioUrl} controls className="w-full h-10" />
                          </div>
                        ) : (
                          <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-400">
                            Bu olay durağı için henüz ses dosyası yüklenmedi. Öğrenci ekranında "Sesli anlatım henüz eklenmedi." bilgisi gösterilir.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* SEKME 3: ANİMASYON / VİDEO                                 */}
                  {/* ========================================================= */}
                  {activeTab === 'tab_3_video' && activeStation && (
                    <div className="space-y-5 max-w-3xl mx-auto">
                      <div className="rounded-2xl bg-sky-950/30 border border-sky-500/40 p-5 space-y-2">
                        <div className="flex items-center gap-3">
                          <Film className="w-6 h-6 text-sky-400 shrink-0" />
                          <div>
                            <h4 className="text-sm sm:text-base font-black text-sky-200">
                              Olay Durağı Animasyon / Video Yönetimi ({selectedYearNum} Yılı • {selectedStationIndex + 1}. Durak)
                            </h4>
                            <p className="text-xs text-stone-300">
                              Soru Rehber Karakterine tıklandığında sorular başlamadan önce (Aşama 2) bu animasyon/video oynatılır.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-stone-900 border border-stone-800 p-5 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-stone-300 mb-1">
                              Video Başlığı:
                            </label>
                            <input
                              type="text"
                              value={activeStation.videoTitle || ''}
                              onChange={e =>
                                updateActiveStation(st => ({ ...st, videoTitle: e.target.value }))
                              }
                              className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-stone-300 mb-1">
                              Video Kısa Açıklaması:
                            </label>
                            <input
                              type="text"
                              value={activeStation.videoDescription || ''}
                              onChange={e =>
                                updateActiveStation(st => ({
                                  ...st,
                                  videoDescription: e.target.value
                                }))
                              }
                              className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                            />
                          </div>
                        </div>

                        {/* Video Upload Box */}
                        <div className="rounded-2xl border-2 border-dashed border-sky-500/50 bg-stone-950/70 p-5 text-center space-y-3">
                          <Film className="w-8 h-8 text-sky-400 mx-auto" />
                          <div className="text-xs text-stone-300">
                            <span className="font-black text-sky-200 block">
                              Bilgisayardan Animasyon / Video Yükle (MP4, WebM)
                            </span>
                            <span>Maksimum 250 MB • Tarayıcı veritabanına (IndexedDB) kalıcı olarak kaydedilir</span>
                          </div>
                          <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-stone-950 font-black text-xs cursor-pointer shadow-lg transition">
                            <Upload className="w-4 h-4" />
                            <span>{isUploadingMedia ? 'Yükleniyor...' : 'Video Dosyası Seç (.mp4, .webm)'}</span>
                            <input
                              type="file"
                              accept=".mp4,.webm,video/mp4,video/webm"
                              onChange={handleVideoFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-400 mb-1">
                            Veya Harici Video Bağlantısı (MP4 / WebM URL):
                          </label>
                          <input
                            type="text"
                            value={activeStation.animation || ''}
                            onChange={e =>
                              updateActiveStation(st => ({ ...st, animation: e.target.value }))
                            }
                            placeholder="Örn: /assets/videos/610_hira.mp4 veya https://..."
                            className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>

                        {previewVideoUrl ? (
                          <div className="rounded-2xl bg-stone-950 border border-emerald-500/40 p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-emerald-300">
                                Yüklü Video Ön İzleme: {previewVideoMeta}
                              </span>
                              <button
                                type="button"
                                onClick={handleRemoveVideoFile}
                                className="px-3 py-1 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-200 text-xs font-bold border border-rose-500/40 flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Videoyu Kaldır</span>
                              </button>
                            </div>
                            <video
                              src={previewVideoUrl}
                              controls
                              className="w-full max-h-60 rounded-xl bg-black"
                            />
                          </div>
                        ) : (
                          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>
                              Uyarı: Bu olay durağı yayında ancak henüz MP4/WebM video dosyası yüklenmedi. Öğrenci kilitlenmeden yazılı sahne anlatımıyla soruya geçebilir.
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* SEKME 4: OLAY SORULARI                                    */}
                  {/* ========================================================= */}
                  {activeTab === 'tab_4_event_questions' && activeStation && (
                    <div className="space-y-5 max-w-3xl mx-auto">
                      <div className="rounded-2xl bg-stone-900 border border-stone-800 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm sm:text-base font-black text-amber-300 flex items-center gap-2">
                            <HelpCircle className="w-5 h-5 text-amber-400" />
                            <span>Aşama 3 • Tarihsel Olay Sorusu Düzenleme</span>
                          </h4>

                          <select
                            value={activeStation.eventQuestion.questionType || 'multiple_choice'}
                            onChange={e => {
                              const qType = e.target.value as any;
                              updateActiveStation(st => ({
                                ...st,
                                eventQuestion: {
                                  ...st.eventQuestion,
                                  questionType: qType,
                                  options:
                                    qType === 'true_false'
                                      ? ['Doğru', 'Yanlış']
                                      : st.eventQuestion.options.length < 2
                                      ? ['1. Seçenek', '2. Seçenek', '3. Seçenek', '4. Seçenek']
                                      : st.eventQuestion.options,
                                  correctIndex: 0
                                }
                              }));
                            }}
                            className="bg-stone-950 border border-amber-500/40 rounded-xl px-3 py-1.5 text-xs font-bold text-amber-200"
                          >
                            <option value="multiple_choice">Tür: Çoktan Seçmeli</option>
                            <option value="true_false">Tür: Doğru / Yanlış</option>
                            <option value="open_ended">Tür: Açık Uçlu</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-300 mb-1">
                            Olay Sorusu Metni:
                          </label>
                          <textarea
                            rows={2}
                            value={activeStation.eventQuestion.questionText}
                            onChange={e =>
                              updateActiveStation(st => ({
                                ...st,
                                eventQuestion: {
                                  ...st.eventQuestion,
                                  questionText: e.target.value
                                }
                              }))
                            }
                            className="w-full bg-stone-950 border border-stone-700 rounded-xl p-3 text-xs text-white font-bold"
                          />
                        </div>

                        {activeStation.eventQuestion.questionType !== 'open_ended' && (
                          <div className="space-y-2.5">
                            <label className="block text-xs font-bold text-emerald-300">
                              Şıklar ve Doğru Cevap Seçimi (Doğru şıkkın yanındaki kutuyu işaretleyin):
                            </label>
                            {activeStation.eventQuestion.options.map((opt, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="correctEventOption"
                                  checked={activeStation.eventQuestion.correctIndex === idx}
                                  onChange={() =>
                                    updateActiveStation(st => ({
                                      ...st,
                                      eventQuestion: { ...st.eventQuestion, correctIndex: idx }
                                    }))
                                  }
                                  className="accent-emerald-500 w-4 h-4 cursor-pointer"
                                />
                                <span className="text-xs font-black text-amber-300 w-6">
                                  {String.fromCharCode(65 + idx)})
                                </span>
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={e => {
                                    const val = e.target.value;
                                    updateActiveStation(st => {
                                      const nextOpts = [...st.eventQuestion.options];
                                      nextOpts[idx] = val;
                                      return {
                                        ...st,
                                        eventQuestion: { ...st.eventQuestion, options: nextOpts }
                                      };
                                    });
                                  }}
                                  className="flex-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        <div>
                          <label className="block text-xs font-bold text-amber-300 mb-1">
                            Yanlış Cevapta Gösterilecek İpucu Metni:
                          </label>
                          <input
                            type="text"
                            value={activeStation.hint}
                            onChange={e =>
                              updateActiveStation(st => ({ ...st, hint: e.target.value }))
                            }
                            className="w-full bg-stone-950 border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-emerald-300 mb-1">
                            Doğru Cevap Sonrası Gösterilecek Açıklama:
                          </label>
                          <textarea
                            rows={2}
                            value={activeStation.eventQuestion.explanation}
                            onChange={e =>
                              updateActiveStation(st => ({
                                ...st,
                                eventQuestion: {
                                  ...st.eventQuestion,
                                  explanation: e.target.value
                                }
                              }))
                            }
                            className="w-full bg-stone-950 border border-stone-700 rounded-xl p-3 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* SEKME 5: DEĞERLER YÖNETİMİ                                */}
                  {/* ========================================================= */}
                  {activeTab === 'tab_5_values' && (
                    <div className="space-y-6 max-w-4xl mx-auto">
                      {/* Associate Values with Current Event Station */}
                      {activeStation && (
                        <div className="rounded-2xl bg-stone-900 border border-stone-800 p-5 space-y-3">
                          <h4 className="text-sm font-black text-emerald-300 flex items-center gap-2">
                            <Heart className="w-4 h-4 text-emerald-400" />
                            <span>
                              {selectedYearNum} Yılı ({selectedStationIndex + 1}. Durak) İle İlişkili Değerleri Seçin:
                            </span>
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {allValuesList.map(v => {
                              const currentIds = activeStation.associatedValueIds || [
                                activeStation.valueQuestion.valueId
                              ];
                              const isSelected = currentIds.includes(v.id);
                              return (
                                <button
                                  key={v.id}
                                  type="button"
                                  onClick={() => {
                                    updateActiveStation(st => {
                                      const prevIds = st.associatedValueIds || [
                                        st.valueQuestion.valueId
                                      ];
                                      const nextIds = prevIds.includes(v.id)
                                        ? prevIds.length > 1
                                          ? prevIds.filter(id => id !== v.id)
                                          : prevIds
                                        : [...prevIds, v.id];
                                      const primaryVal =
                                        allValuesList.find(item => item.id === nextIds[0]) || v;
                                      return {
                                        ...st,
                                        associatedValueIds: nextIds,
                                        valueQuestion: {
                                          ...st.valueQuestion,
                                          valueId: primaryVal.id,
                                          valueName: primaryVal.name
                                        }
                                      };
                                    });
                                  }}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                                    isSelected
                                      ? 'bg-emerald-600 text-white border-emerald-300 shadow'
                                      : 'bg-stone-950 text-stone-300 border-stone-700 hover:bg-stone-800'
                                  }`}
                                >
                                  {v.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Add New Custom Value */}
                      <div className="rounded-2xl bg-stone-900 border border-purple-500/40 p-5 space-y-4">
                        <h4 className="text-sm font-black text-purple-300 flex items-center gap-2">
                          <Plus className="w-4 h-4" />
                          <span>Sisteme Yeni Değer Ekle</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            id="input-new-value-name"
                            value={newValName}
                            onChange={e => setNewValName(e.target.value)}
                            placeholder="Değer Adı (Örn: Tevazu, Cömertlik, Emanet...)"
                            className="bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                          />
                          <input
                            type="text"
                            value={newValShortDesc}
                            onChange={e => setNewValShortDesc(e.target.value)}
                            placeholder="Kısa Tanım..."
                            className="bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                          />
                          <textarea
                            rows={2}
                            value={newValFullDesc}
                            onChange={e => setNewValFullDesc(e.target.value)}
                            placeholder="Değerin ayrıntılı pedagojik açıklaması..."
                            className="sm:col-span-2 bg-stone-950 border border-stone-700 rounded-xl p-3 text-xs text-white"
                          />
                        </div>
                        <button
                          type="button"
                          id="btn-add-custom-value"
                          onClick={handleAddCustomValue}
                          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs"
                        >
                          + Değeri Listeye Kaydet
                        </button>
                      </div>

                      {/* All Values Directory */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {allValuesList.map(v => (
                          <div
                            key={v.id}
                            className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-amber-300">{v.name}</span>
                              {v.isCustom && (
                                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300">
                                  Öğretmen Ekledi
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-stone-300">{v.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* SEKME 6: DEĞER SORULARI                                   */}
                  {/* ========================================================= */}
                  {activeTab === 'tab_6_value_questions' && activeStation && (
                    <div className="space-y-5 max-w-3xl mx-auto">
                      <div className="rounded-2xl bg-stone-900 border border-stone-800 p-5 space-y-4">
                        <h4 className="text-sm sm:text-base font-black text-emerald-300 flex items-center gap-2">
                          <Heart className="w-5 h-5 text-emerald-400" />
                          <span>Aşama 4 • Değer Keşfi Sorusu ("Bu olayda hangi değer ön plana çıkmaktadır?")</span>
                        </h4>

                        <div>
                          <label className="block text-xs font-bold text-stone-300 mb-1">
                            Değer Sorusu Metni:
                          </label>
                          <input
                            type="text"
                            value={
                              activeStation.valueRecognitionQuestion?.questionText ||
                              'Bu olayda hangi değer ön plana çıkmaktadır?'
                            }
                            onChange={e =>
                              updateActiveStation(st => ({
                                ...st,
                                valueRecognitionQuestion: {
                                  ...(st.valueRecognitionQuestion || {
                                    options: [st.valueQuestion.valueName, 'Acelecilik', 'Gösteriş', 'Kayıtsızlık'],
                                    correctIndex: 0,
                                    correctValueId: st.valueQuestion.valueId,
                                    hint: st.valueQuestion.historicalConnection,
                                    explanation: `${st.valueQuestion.valueName} değeri ön plana çıkmaktadır.`
                                  }),
                                  questionText: e.target.value
                                }
                              }))
                            }
                            className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white font-bold"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-emerald-300">
                            Değer Seçenekleri ve Doğru Değer:
                          </label>
                          {(
                            activeStation.valueRecognitionQuestion?.options || [
                              activeStation.valueQuestion.valueName,
                              'Acelecilik',
                              'Gösteriş',
                              'Kayıtsızlık'
                            ]
                          ).map((opt, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="correctValueRecOption"
                                checked={
                                  (activeStation.valueRecognitionQuestion?.correctIndex ?? 0) === idx
                                }
                                onChange={() =>
                                  updateActiveStation(st => ({
                                    ...st,
                                    valueRecognitionQuestion: {
                                      ...(st.valueRecognitionQuestion || {
                                        questionText: 'Bu olayda hangi değer ön plana çıkmaktadır?',
                                        options: [st.valueQuestion.valueName, 'Acelecilik', 'Gösteriş', 'Kayıtsızlık'],
                                        correctValueId: st.valueQuestion.valueId,
                                        hint: st.valueQuestion.historicalConnection,
                                        explanation: `${st.valueQuestion.valueName} değeri ön plana çıkmaktadır.`
                                      }),
                                      correctIndex: idx
                                    }
                                  }))
                                }
                                className="accent-emerald-500 w-4 h-4 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={opt}
                                onChange={e => {
                                  const val = e.target.value;
                                  updateActiveStation(st => {
                                    const base = st.valueRecognitionQuestion || {
                                      questionText: 'Bu olayda hangi değer ön plana çıkmaktadır?',
                                      options: [st.valueQuestion.valueName, 'Acelecilik', 'Gösteriş', 'Kayıtsızlık'],
                                      correctIndex: 0,
                                      correctValueId: st.valueQuestion.valueId,
                                      hint: st.valueQuestion.historicalConnection,
                                      explanation: `${st.valueQuestion.valueName} değeri ön plana çıkmaktadır.`
                                    };
                                    const nextOpts = [...base.options];
                                    nextOpts[idx] = val;
                                    return {
                                      ...st,
                                      valueRecognitionQuestion: { ...base, options: nextOpts }
                                    };
                                  });
                                }}
                                className="flex-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                              />
                            </div>
                          ))}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-amber-300 mb-1">
                            Değer Sorusu Yanlış Cevap İpucu:
                          </label>
                          <input
                            type="text"
                            value={
                              activeStation.valueRecognitionQuestion?.hint ||
                              activeStation.valueQuestion.historicalConnection
                            }
                            onChange={e =>
                              updateActiveStation(st => ({
                                ...st,
                                valueRecognitionQuestion: {
                                  ...(st.valueRecognitionQuestion || {
                                    questionText: 'Bu olayda hangi değer ön plana çıkmaktadır?',
                                    options: [st.valueQuestion.valueName, 'Acelecilik', 'Gösteriş', 'Kayıtsızlık'],
                                    correctIndex: 0,
                                    correctValueId: st.valueQuestion.valueId,
                                    explanation: `${st.valueQuestion.valueName} değeri ön plana çıkmaktadır.`
                                  }),
                                  hint: e.target.value
                                },
                                valueQuestion: {
                                  ...st.valueQuestion,
                                  historicalConnection: e.target.value
                                }
                              }))
                            }
                            className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* SEKME 7: GÜNLÜK HAYAT SORULARI                            */}
                  {/* ========================================================= */}
                  {activeTab === 'tab_7_daily_life' && activeStation && (
                    <div className="space-y-5 max-w-3xl mx-auto">
                      <div className="rounded-2xl bg-stone-900 border border-stone-800 p-5 space-y-4">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm sm:text-base font-black text-sky-300 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-sky-400" />
                            <span>Aşama 5 • Değeri Günlük Hayatla İlişkilendirme Sorusu</span>
                          </h4>

                          <select
                            value={activeStation.dailyLifeQuestion?.questionType || 'multiple_choice'}
                            onChange={e => {
                              const qType = e.target.value as any;
                              updateActiveStation(st => ({
                                ...st,
                                dailyLifeQuestion: {
                                  ...(st.dailyLifeQuestion || {
                                    questionText: st.valueQuestion.questionText,
                                    options: st.valueQuestion.options
                                  }),
                                  questionType: qType
                                }
                              }));
                            }}
                            className="bg-stone-950 border border-sky-500/40 rounded-xl px-3 py-1.5 text-xs font-bold text-sky-200"
                          >
                            <option value="multiple_choice">Tür: Çoktan Seçmeli / Örnek Durum</option>
                            <option value="open_ended">Tür: Açık Uçlu Düşünme Sorusu</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-300 mb-1">
                            Günlük Hayat Sorusu / Senaryo Metni:
                          </label>
                          <textarea
                            rows={2}
                            value={
                              activeStation.dailyLifeQuestion?.questionText ||
                              activeStation.valueQuestion.questionText
                            }
                            onChange={e =>
                              updateActiveStation(st => ({
                                ...st,
                                dailyLifeQuestion: {
                                  ...(st.dailyLifeQuestion || {
                                    questionType: 'multiple_choice',
                                    options: st.valueQuestion.options
                                  }),
                                  questionText: e.target.value
                                },
                                valueQuestion: {
                                  ...st.valueQuestion,
                                  questionText: e.target.value
                                }
                              }))
                            }
                            className="w-full bg-stone-950 border border-stone-700 rounded-xl p-3 text-xs text-white font-bold"
                          />
                        </div>

                        {(activeStation.dailyLifeQuestion?.questionType || 'multiple_choice') ===
                        'open_ended' ? (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-bold text-amber-300 mb-1">
                                Öğrenciye Gösterilecek Düşünme Rehberi:
                              </label>
                              <input
                                type="text"
                                value={activeStation.dailyLifeQuestion?.openEndedGuide || ''}
                                onChange={e =>
                                  updateActiveStation(st => ({
                                    ...st,
                                    dailyLifeQuestion: {
                                      ...(st.dailyLifeQuestion || {
                                        questionType: 'open_ended',
                                        questionText: st.valueQuestion.questionText,
                                        options: st.valueQuestion.options
                                      }),
                                      openEndedGuide: e.target.value
                                    }
                                  }))
                                }
                                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-emerald-300 mb-1">
                                Öğrenci Düşüncesini Yazdığında Gösterilecek Yapıcı Geri Bildirim:
                              </label>
                              <textarea
                                rows={2}
                                value={activeStation.dailyLifeQuestion?.openEndedFeedback || ''}
                                onChange={e =>
                                  updateActiveStation(st => ({
                                    ...st,
                                    dailyLifeQuestion: {
                                      ...(st.dailyLifeQuestion || {
                                        questionType: 'open_ended',
                                        questionText: st.valueQuestion.questionText,
                                        options: st.valueQuestion.options
                                      }),
                                      openEndedFeedback: e.target.value
                                    }
                                  }))
                                }
                                className="w-full bg-stone-950 border border-stone-700 rounded-xl p-3 text-xs text-white"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <label className="block text-xs font-bold text-sky-300">
                              Davranış Seçenekleri ve Öğrenciye Gösterilecek Geri Bildirimler:
                            </label>
                            {(
                              activeStation.dailyLifeQuestion?.options ||
                              activeStation.valueQuestion.options
                            ).map((opt, idx) => (
                              <div
                                key={opt.id}
                                className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-2"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <label className="flex items-center gap-2 text-xs font-bold text-emerald-300 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={opt.isAppropriate}
                                      onChange={e => {
                                        const checked = e.target.checked;
                                        updateActiveStation(st => {
                                          const baseOpts = [
                                            ...(st.dailyLifeQuestion?.options ||
                                              st.valueQuestion.options)
                                          ];
                                          baseOpts[idx] = { ...baseOpts[idx], isAppropriate: checked };
                                          return {
                                            ...st,
                                            dailyLifeQuestion: {
                                              ...(st.dailyLifeQuestion || {
                                                questionType: 'multiple_choice',
                                                questionText: st.valueQuestion.questionText
                                              }),
                                              options: baseOpts
                                            },
                                            valueQuestion: {
                                              ...st.valueQuestion,
                                              options: baseOpts
                                            }
                                          };
                                        });
                                      }}
                                      className="accent-emerald-500 w-4 h-4"
                                    />
                                    <span>Doğru / Uygun Davranış Seçeneği</span>
                                  </label>
                                </div>

                                <input
                                  type="text"
                                  value={opt.text}
                                  onChange={e => {
                                    const val = e.target.value;
                                    updateActiveStation(st => {
                                      const baseOpts = [
                                        ...(st.dailyLifeQuestion?.options || st.valueQuestion.options)
                                      ];
                                      baseOpts[idx] = { ...baseOpts[idx], text: val };
                                      return {
                                        ...st,
                                        dailyLifeQuestion: {
                                          ...(st.dailyLifeQuestion || {
                                            questionType: 'multiple_choice',
                                            questionText: st.valueQuestion.questionText
                                          }),
                                          options: baseOpts
                                        },
                                        valueQuestion: {
                                          ...st.valueQuestion,
                                          options: baseOpts
                                        }
                                      };
                                    });
                                  }}
                                  placeholder="Davranış seçeneği metni..."
                                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-white"
                                />

                                <input
                                  type="text"
                                  value={opt.feedback}
                                  onChange={e => {
                                    const val = e.target.value;
                                    updateActiveStation(st => {
                                      const baseOpts = [
                                        ...(st.dailyLifeQuestion?.options || st.valueQuestion.options)
                                      ];
                                      baseOpts[idx] = { ...baseOpts[idx], feedback: val };
                                      return {
                                        ...st,
                                        dailyLifeQuestion: {
                                          ...(st.dailyLifeQuestion || {
                                            questionType: 'multiple_choice',
                                            questionText: st.valueQuestion.questionText
                                          }),
                                          options: baseOpts
                                        },
                                        valueQuestion: {
                                          ...st.valueQuestion,
                                          options: baseOpts
                                        }
                                      };
                                    });
                                  }}
                                  placeholder="Bu seçenek seçildiğinde öğrenciye gösterilecek geri bildirim..."
                                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-amber-200"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* SEKME 8: ÖN İZLEME VE YAYINLAMA                           */}
                  {/* ========================================================= */}
                  {activeTab === 'tab_8_preview_publish' && (
                    <div className="space-y-6 max-w-4xl mx-auto">
                      {/* Student Preview Summary Card */}
                      {activeStation && (
                        <div className="rounded-2xl bg-stone-900 border-2 border-amber-500/40 p-5 space-y-4">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-3">
                            <div>
                              <span className="text-xs font-black text-amber-400 uppercase flex items-center gap-1.5">
                                <Eye className="w-4 h-4" />
                                Öğrenci Gözünden Ön İzleme ({selectedYearNum} Yılı • {selectedStationIndex + 1}. Durak)
                              </span>
                              <h4 className="text-base font-black text-white mt-0.5">
                                {activeStation.animationScene.title}
                              </h4>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleSaveCurriculumNow('draft')}
                                className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-200 text-xs font-bold border border-amber-500/40"
                              >
                                Taslak Olarak Kaydet
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveCurriculumNow('published')}
                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg"
                              >
                                Yayınla ve Öğrenci Ekranına Aktar
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                              <span className="text-stone-400 block">Ak Sakallı Anlatıcı Sesi:</span>
                              <strong className={previewAudioUrl ? 'text-emerald-300' : 'text-amber-300'}>
                                {previewAudioUrl ? 'Ses Dosyası Hazır' : 'Henüz Eklenmedi'}
                              </strong>
                            </div>
                            <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                              <span className="text-stone-400 block">Animasyon / Video:</span>
                              <strong className={previewVideoUrl ? 'text-emerald-300' : 'text-amber-300'}>
                                {previewVideoUrl ? 'Video Hazır' : 'Yazılı Sahne Aktif (Video Yok)'}
                              </strong>
                            </div>
                            <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                              <span className="text-stone-400 block">İlişkili Değer:</span>
                              <strong className="text-emerald-300">
                                {activeStation.valueQuestion.valueName}
                              </strong>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Backup Export / Import & Reset */}
                      <div className="rounded-2xl bg-stone-900 border border-stone-800 p-5 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-black text-white">
                            Müfredat Yedekleme ve Öğrenci İlerlemesi ({allStudents.length} Kayıtlı Öğrenci)
                          </h4>
                          <p className="text-xs text-stone-400">
                            Yaptığınız tüm içerik düzenlemelerini JSON dosyası olarak yedekleyebilir veya başka bir akıllı tahtaya yükleyebilirsiniz.
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={handleExportJSON}
                            className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold border border-stone-700 flex items-center gap-1.5"
                          >
                            <Download className="w-4 h-4 text-amber-400" />
                            <span>JSON Yedek İndir</span>
                          </button>

                          <label className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold border border-stone-700 flex items-center gap-1.5 cursor-pointer">
                            <Upload className="w-4 h-4 text-emerald-400" />
                            <span>JSON Yedek Yükle</span>
                            <input
                              type="file"
                              accept=".json"
                              onChange={handleImportJSON}
                              className="hidden"
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              if (
                                window.confirm(
                                  'Mevcut öğrencinin ilerlemesini sıfırlamak istediğinize emin misiniz?'
                                )
                              ) {
                                onResetProgress();
                                showBanner('warning', 'Öğrenci ilerlemesi sıfırlandı.');
                              }
                            }}
                            className="px-3.5 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 text-xs font-bold border border-rose-500/40 flex items-center gap-1.5"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Öğrenciyi Sıfırla</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
