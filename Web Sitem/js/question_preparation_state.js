/**
 * Rotalı Fenci - Soru Hazırlama Modülü Kararlı Durum ve Mantık Motoru
 * (State Manager & Business Logic Engine)
 * 
 * Özellikler:
 * 1. Çoktan Seçmeli, Kısa Cevaplı, Açık Uçlu ve Etkinlik türlerinin durumlarını tam bağımsız yönetir.
 * 2. 13 Özel Etkinlik türünü eksiksiz korur ve her birinin sayısını/seçimini izole tutar.
 * 3. Bir soru türündeki değişiklik diğer türleri kesinlikle bozmaz.
 * 4. Çıktı formatı değiştiğinde soru seçimleri ve sayıları korunur.
 * 5. Hem tarayıcıda hem Node.js test ortamında çalışır.
 */

(function (global) {
  'use strict';

  // 13 Alt Etkinlik Türü Sabitleri
  const ACTIVITY_SUBTYPES_DEF = {
    matching: {
      title: 'Eşleştirme Etkinliği',
      icon: '🧩',
      desc: 'Kavram-tanım ve olay-sonuç',
      defaultCount: 2
    },
    ordering: {
      title: 'Sıralama Etkinliği',
      icon: '🔢',
      desc: 'Oluşum sırası ve basamaklar',
      defaultCount: 1
    },
    table_completion: {
      title: 'Tablo Tamamlama Etkinliği',
      icon: '📊',
      desc: 'Özellik ve veri matrisi',
      defaultCount: 2
    },
    image_analysis: {
      title: 'Görsel İnceleme ve Yorumlama',
      icon: '🔍',
      desc: 'Görsel üzerinden çıkarım',
      defaultCount: 2
    },
    diagram_labeling: {
      title: 'Şekil Üzerinde Kavram Yerleştirme',
      icon: '🏷️',
      desc: 'Model ve şema üzerinde',
      defaultCount: 1
    },
    visual_tagging: {
      title: 'Görsel Etiketleme',
      icon: '📌',
      desc: 'Yapı ve kısımları adlandırma',
      defaultCount: 1
    },
    classification: {
      title: 'Sınıflandırma Etkinliği',
      icon: '📂',
      desc: 'Kategorilere ve gruplara ayırma',
      defaultCount: 2
    },
    experiment_analysis: {
      title: 'Deney Düzeneği İnceleme',
      icon: '🧪',
      desc: 'Bağımlı/bağımsız değişken & hipotez',
      defaultCount: 1
    },
    chart_interpretation: {
      title: 'Grafik Okuma ve Yorumlama',
      icon: '📈',
      desc: 'Veri analizi ve değişim yorumu',
      defaultCount: 1
    },
    scientific_process: {
      title: 'Bilimsel Süreç Becerileri',
      icon: '🔬',
      desc: 'Gözlem, tahmin, veriye dayalı karar',
      defaultCount: 1
    },
    daily_life_problem: {
      title: 'Günlük Yaşam Problemi Çözme',
      icon: '💡',
      desc: 'Fen ilkeleriyle pratik çözüm',
      defaultCount: 1
    },
    cut_paste_coloring: {
      title: 'Kes-Yapıştır ve Boyama',
      icon: '✂️',
      desc: 'Kesim çizgili etkileşimli kartlar',
      defaultCount: 1
    },
    stem_design: {
      title: 'STEM Tasarım Etkinliği',
      icon: '🚀',
      desc: 'Mühendislik problemi & çizim',
      defaultCount: 1
    }
  };

  const QUESTION_TYPES_DEF = {
    multiple_choice: {
      label: 'Çoktan Seçmeli',
      icon: '🔘',
      sub: '4 Seçenekli LGS / MEB Sınav Formatı',
      unitLabel: 'soru',
      min: 1,
      max: 30,
      defaultCount: 10,
      defaultEnabled: true
    },
    short_answer: {
      label: 'Kısa Cevaplı / Boşluk Doldurma',
      icon: '✏️',
      sub: 'Tek Kelimelik / Kısa İfadeli Net Cevaplar',
      unitLabel: 'soru',
      min: 1,
      max: 30,
      defaultCount: 5,
      defaultEnabled: false
    },
    open_ended: {
      label: 'Açık Uçlu (Klasik)',
      icon: '📝',
      sub: 'Bilimsel Süreç, Deney Analizi ve Gerekçe',
      unitLabel: 'soru',
      min: 1,
      max: 30,
      defaultCount: 5,
      defaultEnabled: false
    },
    activity: {
      label: 'Etkinlik (13 Özel Etkinlik Türü)',
      icon: '🎯',
      sub: 'Eşleştirme, Sıralama, Tablo, Deney & STEM Becerileri',
      unitLabel: 'etkinlik',
      min: 1,
      max: 50,
      defaultCount: 5,
      defaultEnabled: false
    }
  };

  function createInitialState() {
    const types = {};
    Object.keys(QUESTION_TYPES_DEF).forEach(k => {
      const def = QUESTION_TYPES_DEF[k];
      types[k] = {
        key: k,
        label: def.label,
        icon: def.icon,
        enabled: def.defaultEnabled,
        count: def.defaultCount,
        min: def.min,
        max: def.max
      };
    });

    const activitySubtypes = {};
    Object.keys(ACTIVITY_SUBTYPES_DEF).forEach(k => {
      const def = ACTIVITY_SUBTYPES_DEF[k];
      activitySubtypes[k] = {
        key: k,
        title: def.title,
        icon: def.icon,
        desc: def.desc,
        enabled: ['matching', 'ordering', 'table_completion'].includes(k),
        count: def.defaultCount
      };
    });

    return {
      types,
      activitySubtypes,
      outputMode: 'separate', // 'separate' | 'combined'
      batches: {}, // generated batches indexed by type
      activeBatchKey: null,
      testSequenceCounter: 1
    };
  }

  class QuestionPreparationEngine {
    constructor(initialState) {
      this.state = initialState || createInitialState();
      this.listeners = [];
    }

    subscribe(fn) {
      if (typeof fn === 'function') {
        this.listeners.push(fn);
      }
      return () => {
        this.listeners = this.listeners.filter(l => l !== fn);
      };
    }

    notify(event, data) {
      this.listeners.forEach(fn => {
        try {
          fn(event, data, this.state);
        } catch (e) {
          console.error('[QuestionPreparationEngine] Listener error:', e);
        }
      });
    }

    // --- Soru Türü Seçimleri (Tam Bağımsız Yönetim) ---

    setTypeEnabled(typeKey, isEnabled) {
      if (!this.state.types[typeKey]) return false;
      this.state.types[typeKey].enabled = Boolean(isEnabled);
      this.notify('typeEnabledChanged', { type: typeKey, enabled: Boolean(isEnabled) });
      return true;
    }

    setTypeCount(typeKey, count) {
      if (!this.state.types[typeKey]) return false;
      const def = QUESTION_TYPES_DEF[typeKey];
      let val = parseInt(count, 10);
      if (isNaN(val) || val < def.min) val = def.min;
      if (val > def.max) val = def.max;
      this.state.types[typeKey].count = val;
      this.notify('typeCountChanged', { type: typeKey, count: val });
      return true;
    }

    getType(typeKey) {
      return this.state.types[typeKey] ? { ...this.state.types[typeKey] } : null;
    }

    getSelectedTypes() {
      const selected = [];
      Object.keys(this.state.types).forEach(k => {
        const item = this.state.types[k];
        if (item.enabled) {
          const res = {
            type: item.key,
            label: item.label,
            icon: item.icon,
            count: item.count
          };
          if (item.key === 'activity') {
            res.activity_types = this.getSelectedActivitySubtypes();
          }
          selected.push(res);
        }
      });
      return selected;
    }

    // --- 13 Özel Etkinlik Türü Yönetimi ---

    setActivitySubtypeEnabled(subKey, isEnabled) {
      if (!this.state.activitySubtypes[subKey]) return false;
      this.state.activitySubtypes[subKey].enabled = Boolean(isEnabled);
      this._syncActivityTotalCount();
      this.notify('activitySubtypeEnabledChanged', { subtype: subKey, enabled: Boolean(isEnabled) });
      return true;
    }

    setActivitySubtypeCount(subKey, count) {
      if (!this.state.activitySubtypes[subKey]) return false;
      let val = parseInt(count, 10);
      if (isNaN(val) || val < 1) val = 1;
      if (val > 20) val = 20;
      this.state.activitySubtypes[subKey].count = val;
      this._syncActivityTotalCount();
      this.notify('activitySubtypeCountChanged', { subtype: subKey, count: val });
      return true;
    }

    selectAllActivities() {
      Object.keys(this.state.activitySubtypes).forEach(k => {
        this.state.activitySubtypes[k].enabled = true;
      });
      this._syncActivityTotalCount();
      this.notify('allActivitiesSelected', {});
    }

    clearAllActivities() {
      Object.keys(this.state.activitySubtypes).forEach(k => {
        this.state.activitySubtypes[k].enabled = false;
      });
      this._syncActivityTotalCount();
      this.notify('allActivitiesCleared', {});
    }

    distributeDefaultActivities() {
      const top5 = ['matching', 'ordering', 'table_completion', 'classification', 'experiment_analysis'];
      Object.keys(this.state.activitySubtypes).forEach(k => {
        const isTop = top5.includes(k);
        this.state.activitySubtypes[k].enabled = isTop;
        this.state.activitySubtypes[k].count = isTop ? 2 : 1;
      });
      this._syncActivityTotalCount();
      this.notify('activitiesDistributed', {});
    }

    getSelectedActivitySubtypes() {
      const res = [];
      Object.keys(this.state.activitySubtypes).forEach(k => {
        const item = this.state.activitySubtypes[k];
        if (item.enabled) {
          res.push({
            type: item.key,
            title: item.title,
            count: item.count,
            icon: item.icon
          });
        }
      });
      return res;
    }

    getActivitySubtypesTotalCount() {
      return this.getSelectedActivitySubtypes().reduce((sum, item) => sum + item.count, 0);
    }

    _syncActivityTotalCount() {
      const subTotal = this.getActivitySubtypesTotalCount();
      if (subTotal > 0 && this.state.types.activity) {
        this.state.types.activity.count = Math.min(50, subTotal);
      }
    }

    // --- Çıktı Formatı Yönetimi ---

    setOutputMode(mode) {
      if (mode !== 'separate' && mode !== 'combined') return false;
      this.state.outputMode = mode;
      this.notify('outputModeChanged', { mode });
      return true;
    }

    getOutputMode() {
      return this.state.outputMode;
    }

    // --- Toplam İçerik Hesaplayıcı ---

    getTotalCount() {
      return this.getSelectedTypes().reduce((sum, item) => sum + item.count, 0);
    }

    // --- Yapay Zekâ İstek Yükü Oluşturucu (AI Payload Builder) ---

    buildGenerationRequests(params = {}) {
      const selected = this.getSelectedTypes();
      if (selected.length === 0) {
        throw new Error('Lütfen en az bir soru türü seçiniz (Çoktan Seçmeli, Kısa Cevaplı, Açık Uçlu veya Etkinlik).');
      }

      const {
        grade = '5',
        subject = 'Fen Bilimleri',
        learning_area = 'Genel',
        selected_outcomes = [],
        difficulty = 'medium',
        api_key = '',
        source_text = '',
        source_files = []
      } = params;

      return selected.map(item => {
        let actSubTypes = [];
        if (item.type === 'activity') {
          actSubTypes = item.activity_types || this.getSelectedActivitySubtypes();
          if (actSubTypes.length === 0) {
            actSubTypes = [
              { type: 'matching', title: 'Eşleştirme', count: 2 },
              { type: 'ordering', title: 'Sıralama', count: 1 },
              { type: 'table_completion', title: 'Tablo Tamamlama', count: 2 }
            ];
          }
        }

        return {
          type: item.type,
          label: item.label,
          icon: item.icon,
          count: item.count,
          payload: {
            api_key,
            grade,
            subject,
            learning_area,
            selected_outcomes,
            question_count: item.count,
            difficulty,
            question_type: item.type,
            activity_types: actSubTypes,
            source_text,
            source_files
          }
        };
      });
    }

    // --- Üretim Sonuçlarını Güvenli Ayrıştırma ve Saklama ---

    saveBatch(typeKey, batchData) {
      if (!typeKey || !batchData) return;
      this.state.batches[typeKey] = {
        type: typeKey,
        label: batchData.label || typeKey,
        icon: batchData.icon || '📄',
        count: Array.isArray(batchData.questions) ? batchData.questions.length : 0,
        questions: batchData.questions || [],
        meta: batchData.meta || {},
        smartTitle: batchData.smartTitle || `${batchData.label} Yaprak Testi`
      };
      if (!this.state.activeBatchKey) {
        this.state.activeBatchKey = typeKey;
      }
      this.notify('batchSaved', { type: typeKey });
    }

    getBatch(typeKey) {
      return this.state.batches[typeKey] || null;
    }

    getAllBatches() {
      return { ...this.state.batches };
    }

    setActiveBatch(typeKey) {
      if (!this.state.batches[typeKey]) return false;
      this.state.activeBatchKey = typeKey;
      this.notify('activeBatchChanged', { type: typeKey });
      return true;
    }

    getActiveBatch() {
      return this.state.activeBatchKey ? this.state.batches[this.state.activeBatchKey] : null;
    }

    getMergedQuestions() {
      const merged = [];
      Object.keys(this.state.batches).forEach(k => {
        const b = this.state.batches[k];
        if (b && Array.isArray(b.questions)) {
          merged.push(...b.questions);
        }
      });
      // Re-index questions 1 to N
      return merged.map((q, idx) => ({ ...q, id: idx + 1 }));
    }

    // --- Web Sitesi Yayınlama Yükleri Oluşturucu ---

    buildPublishPayloads(commonMeta = {}) {
      const batches = this.getAllBatches();
      const keys = Object.keys(batches);
      if (keys.length === 0) return [];

      const mode = this.getOutputMode();
      const payloads = [];

      if (mode === 'separate') {
        keys.forEach(k => {
          const b = batches[k];
          payloads.push({
            filename_hint: `${commonMeta.grade || '5'}-sinif-${b.type}`,
            questions: b.questions,
            grade: commonMeta.grade || '5',
            unit: commonMeta.learning_area || 'Genel',
            targetSection: commonMeta.targetSection || 1,
            category: b.type === 'open_ended' ? 'denemeler' : 'soru-bankasi',
            title: b.smartTitle,
            desc: `${commonMeta.grade || '5'}. Sınıf ${commonMeta.learning_area || 'Genel'} - ${b.label} Yaprak Testi (${b.questions.length} Soru).`,
            subject: commonMeta.subject || 'Fen Bilimleri',
            autoDeploy: true
          });
        });
      } else {
        const merged = this.getMergedQuestions();
        payloads.push({
          filename_hint: `${commonMeta.grade || '5'}-sinif-butunlesik-test`,
          questions: merged,
          grade: commonMeta.grade || '5',
          unit: commonMeta.learning_area || 'Genel',
          targetSection: commonMeta.targetSection || 1,
          category: 'soru-bankasi',
          title: `Bütünleşik Fen Bilimleri Sınavı (${merged.length} Soru)`,
          desc: `${commonMeta.grade || '5'}. Sınıf ${commonMeta.learning_area || 'Genel'} - Çoktan Seçmeli, Kısa Cevaplı, Açık Uçlu ve Etkinlikler (${merged.length} İçerik).`,
          subject: commonMeta.subject || 'Fen Bilimleri',
          autoDeploy: true
        });
      }

      return payloads;
    }
  }

  // Dışa aktarma
  const instance = new QuestionPreparationEngine();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      QuestionPreparationEngine,
      QUESTION_TYPES_DEF,
      ACTIVITY_SUBTYPES_DEF,
      createInitialState,
      defaultEngine: instance
    };
  }

  global.QuestionPreparationEngine = QuestionPreparationEngine;
  global.questionPrepEngine = instance;
  global.QUESTION_TYPES_DEF = QUESTION_TYPES_DEF;
  global.ACTIVITY_SUBTYPES_DEF = ACTIVITY_SUBTYPES_DEF;

})(typeof window !== 'undefined' ? window : globalThis);
