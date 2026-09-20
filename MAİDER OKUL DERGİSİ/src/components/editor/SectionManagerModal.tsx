import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Check,
  RotateCcw,
  BookOpen,
  Search
} from 'lucide-react';
import {
  addSection,
  removeSection,
  updateSection,
  resetSections
} from '../../services/magazineSectionsService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sections: string[];
  onSectionsChange: (updated: string[]) => void;
  onSelectSection?: (section: string) => void;
}

export const SectionManagerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  sections,
  onSectionsChange,
  onSelectSection
}) => {
  const [newSectionName, setNewSectionName] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionName.trim()) return;
    const updated = addSection(newSectionName);
    onSectionsChange(updated);
    if (onSelectSection) onSelectSection(newSectionName.trim().toUpperCase());
    setNewSectionName('');
  };

  const handleStartEdit = (idx: number, currentName: string) => {
    setEditingIndex(idx);
    setEditingValue(currentName);
  };

  const handleSaveEdit = (oldName: string) => {
    if (!editingValue.trim()) return;
    const updated = updateSection(oldName, editingValue);
    onSectionsChange(updated);
    setEditingIndex(null);
    setEditingValue('');
  };

  const handleDelete = (name: string) => {
    if (window.confirm(`"${name}" bölümünü listeden çıkarmak istediğinizden emin misiniz?`)) {
      const updated = removeSection(name);
      onSectionsChange(updated);
    }
  };

  const handleReset = () => {
    if (window.confirm('Tüm bölümler varsayılan 30 resmi bölüme sıfırlansın mı?')) {
      const updated = resetSections();
      onSectionsChange(updated);
    }
  };

  const filteredSections = sections.filter(s =>
    s.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-editorial text-lg font-bold text-slate-900">
                Dergi Bölüm Başlıkları Yönetimi
              </h3>
              <p className="text-xs text-slate-500">
                Alfabetik sıralı {sections.length} bölüm • Ekle, düzenle veya çıkar
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Add Section Form */}
        <div className="p-4 bg-sky-50/50 border-b border-sky-100">
          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              type="text"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              placeholder="Yeni bölüm başlığı yazın (Örn: ROBOTİK VE KODLAMA)..."
              className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Bölüm Ekle</span>
            </button>
          </form>

          {/* Search Bar */}
          <div className="mt-3 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Bölüm başlıkları arasında ara..."
              className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Sections List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 divide-y divide-slate-100">
          {filteredSections.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              Aramaya uygun bölüm bulunamadı.
            </div>
          ) : (
            filteredSections.map((sec, idx) => (
              <div
                key={sec}
                className="pt-1.5 first:pt-0 flex items-center justify-between gap-2 p-2 hover:bg-slate-50 rounded-lg transition-colors group"
              >
                {editingIndex === idx ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      className="flex-1 bg-white border border-sky-400 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-bold"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(sec)}
                      className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 text-xs"
                      title="Kaydet"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingIndex(null)}
                      className="p-1 rounded bg-slate-200 text-slate-600 hover:bg-slate-300 text-xs"
                      title="İptal"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div
                      onClick={() => {
                        if (onSelectSection) onSelectSection(sec);
                        onClose();
                      }}
                      className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer"
                    >
                      <span className="text-[11px] font-mono text-slate-400 w-6 text-right shrink-0">
                        {idx + 1}.
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-800 truncate group-hover:text-sky-600">
                        {sec}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(idx, sec)}
                        className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        title="Düzenle / Değiştir"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(sec)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Listeden Çıkar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors cursor-pointer"
            title="Varsayılan 30 bölüme döndür"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Varsayılan 30 Bölüme Sıfırla</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl cursor-pointer"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};
