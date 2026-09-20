import React, { useState } from 'react';
import { MagazineIssue, ArticleItem, ContentStatus, MagazineCategory } from '../../types/magazine';
import { CATEGORY_THEMES } from '../../config/brand';
import {
  BookOpen,
  Plus,
  FileText,
  Layers,
  Sparkles,
  Share2,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowRight,
  Edit,
  Eye,
  Trash2,
  Tag,
  Users,
  FolderOpen
} from 'lucide-react';

interface Props {
  issue: MagazineIssue;
  onNavigateTab: (tab: 'dashboard' | 'studio' | 'editor' | 'pages' | 'preview') => void;
  onOpenNewIssueModal: () => void;
  onOpenNewContentForm: () => void;
  onEditArticle: (article: ArticleItem) => void;
  onDeleteArticle?: (articleId: string) => void;
  onStartCanvaExport: () => void;
  onSelectPage: (index: number) => void;
}

export const Dashboard: React.FC<Props> = ({
  issue,
  onNavigateTab,
  onOpenNewIssueModal,
  onOpenNewContentForm,
  onEditArticle,
  onDeleteArticle,
  onStartCanvaExport,
  onSelectPage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Stats
  const totalPages = issue.pages.length;
  const totalArticles = issue.articles.length;
  const approvedArticles = issue.articles.filter(a => a.status === 'Onaylandı' || a.status === 'Yayına Hazır').length;
  const pendingArticles = issue.articles.filter(a => a.status === 'Taslak' || a.status === 'Kontrolde').length;

  // Filtered Articles
  const filteredArticles = issue.articles.filter(art => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.author && art.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
      art.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.targetGrades && art.targetGrades.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (art.tags && art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || art.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8 text-slate-800">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 border border-sky-500/20 p-6 sm:p-8 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider border border-white/30">
                {issue.schoolName}
              </span>
              <span className="text-sky-100 text-xs font-mono font-bold">
                {issue.month.toUpperCase()} SAYISI • SAYI {issue.issueNumber} • {issue.year}
              </span>
            </div>
            <h1 className="font-editorial text-3xl md:text-5xl font-black text-white leading-tight">
              {issue.title} {issue.month} Dergi Masası
            </h1>
            <p className="text-sky-50 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
              Öğretmen ve öğrencilerimizin hazırladığı içerikleri yapay zekâ mizanpajıyla A4 formatına dönüştürün; Canva'ya tam uyumlu PPTX veya PDF olarak dışa aktarın.
            </p>
          </div>

          {/* Primary Quick Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={onOpenNewContentForm}
              className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs md:text-sm px-6 py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2.5 transition-all transform active:scale-95 w-full sm:w-auto ring-2 ring-white/40 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-950" />
              <div className="flex flex-col text-left">
                <span className="leading-tight">İçerik Ekle & AI Stüdyo ✨</span>
                <span className="text-[10px] font-semibold text-slate-800 opacity-90">Hem AI Destekli Hem Manuel</span>
              </div>
            </button>

            <button
              type="button"
              onClick={onStartCanvaExport}
              className="bg-white/15 hover:bg-white/25 text-amber-300 hover:text-amber-200 border border-amber-300/40 font-bold text-xs md:text-sm px-4 py-3 rounded-xl shadow flex items-center justify-center gap-2 transition-all transform active:scale-95 w-full sm:w-auto"
            >
              <Share2 className="w-4 h-4" />
              <span>Canva'ya Aktar</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">A4 Sayfa Sayısı</span>
            <Layers className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-3xl font-mono font-black text-slate-900">{totalPages}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Standart: 210 × 297 mm (A4 Dikey)
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">İçerik & Yazı</span>
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-mono font-black text-slate-900">{totalArticles}</div>
          <p className="text-[11px] text-slate-500 mt-1">Öğretmen ve öğrenci katkıları</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Yayına Hazır</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-mono font-black text-emerald-600">{approvedArticles}</div>
          <p className="text-[11px] text-slate-500 mt-1">Son kontrolden geçmiş yazılar</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Bekleyen / Taslak</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-mono font-black text-amber-600">{pendingArticles}</div>
          <p className="text-[11px] text-slate-500 mt-1">Editör incelemesindeki içerikler</p>
        </div>
      </div>

      {/* Monthly Sections Management Strip */}
      {issue.sections && issue.sections.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-editorial text-lg font-bold text-slate-900 flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-sky-600" />
                <span>{issue.month} Sayısı Bölüm Yönetimi</span>
              </h3>
              <p className="text-xs text-slate-500">
                Bu sayıdaki sayfaların ve yazıların ayrıldığı ana tematik bölümler
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {issue.sections.map((sec) => {
              const count = issue.pages.filter(p => p.sectionId === sec.id).length;
              return (
                <div
                  key={sec.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition-colors flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: sec.color }}
                    />
                    <span className="text-[10px] font-mono font-bold bg-white px-1.5 py-0.5 rounded text-slate-600 border border-slate-200">
                      {count} sayfa
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-800 leading-tight">
                    {sec.name}
                  </h4>
                  {sec.description && (
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                      {sec.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pages Quick Visual Strip */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-editorial text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-sky-600" />
              <span>{issue.month} Sayısı ({issue.pages.length} Sayfa) Sayfa Akışı</span>
            </h3>
            <p className="text-xs text-slate-500">
              Dergi sayfalarının sıralaması, şablon kodları ve sayfa numaraları
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('pages')}
            className="text-xs text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1"
          >
            <span>Sayfa Sıralayıcıyı Aç</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {issue.pages.slice(0, 6).map((page, idx) => {
            const theme = CATEGORY_THEMES[page.category] || CATEGORY_THEMES['Okulumuzdan'];
            const section = issue.sections?.find(s => s.id === page.sectionId);
            return (
              <div
                key={page.id}
                onClick={() => {
                  onSelectPage(idx);
                  onNavigateTab('preview');
                }}
                className="bg-slate-50 hover:bg-sky-50/50 p-3 rounded-xl border border-slate-200 hover:border-sky-400 cursor-pointer transition-all group shadow-xs flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-[10px] mb-2 font-mono">
                  <span className="font-bold text-slate-700">#{page.pageNumber || idx + 1}</span>
                  <span
                    className="px-1.5 py-0.5 rounded text-[8px] font-bold truncate max-w-[65px]"
                    style={{ backgroundColor: section?.color || theme.color, color: '#fff' }}
                  >
                    {section ? section.name : page.templateId}
                  </span>
                </div>
                <h4 className="font-editorial font-bold text-xs text-slate-800 group-hover:text-sky-600 truncate my-1">
                  {page.title || 'Başlıksız'}
                </h4>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">{page.category}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Articles Management Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-editorial text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>{issue.month} Sayısı İçerik ve Yazı Listesi</span>
            </h3>
            <p className="text-xs text-slate-500">
              Sınıf ve kategori etiketleriyle derlenmiş tüm içerikler
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Yazı, sınıf, yazar veya etiket ara..."
                className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white w-48 sm:w-60"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
            >
              <option value="all">Tüm Kategoriler</option>
              {Object.keys(CATEGORY_THEMES).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile Articles Card List (Shown only on small screens) */}
        <div className="md:hidden space-y-3">
          {filteredArticles.length === 0 ? (
            <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              Arama kriterlerine uygun içerik bulunamadı. Yeni içerik eklemek için üstteki "Yeni İçerik Ekle" butonuna tıklayabilirsiniz.
            </div>
          ) : (
            filteredArticles.map((art) => {
              const theme = CATEGORY_THEMES[art.category] || CATEGORY_THEMES['Okulumuzdan'];
              return (
                <div key={art.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span
                        className="px-2 py-0.5 rounded text-[9px] font-bold inline-block mb-1"
                        style={{ backgroundColor: theme.bgLight, color: theme.color }}
                      >
                        {art.category}
                      </span>
                      <h4 className="font-editorial text-sm font-bold text-slate-900 leading-snug">
                        {art.title}
                      </h4>
                      {art.subtitle && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {art.subtitle}
                        </p>
                      )}
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                      art.status === 'Yayına Hazır'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : art.status === 'Onaylandı'
                        ? 'bg-sky-50 text-sky-700 border border-sky-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {art.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                    <div>
                      <span className="font-medium text-slate-700">{art.author || 'Anonim'}</span>
                      {art.authorRole && <span> • {art.authorRole}</span>}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEditArticle(art)}
                        className="p-1.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-lg shadow-xs"
                        title="Düzenle"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      {onDeleteArticle && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`"${art.title}" başlıklı yazıyı silmek istediğinizden emin misiniz?`)) {
                              onDeleteArticle(art.id);
                            }
                          }}
                          className="p-1.5 bg-white border border-slate-200 text-rose-500 hover:text-rose-700 rounded-lg shadow-xs"
                          title="Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onSelectPage(0)}
                        className="p-1.5 bg-sky-50 border border-sky-200 text-sky-700 hover:bg-sky-100 rounded-lg shadow-xs"
                        title="Önizle"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop Articles Table (Hidden on small screens) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              <tr>
                <th className="p-3 rounded-l-lg">Başlık & Spot</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Yazar</th>
                <th className="p-3">Fotoğraf</th>
                <th className="p-3">Durum</th>
                <th className="p-3 text-right rounded-r-lg">Eylemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400">
                    Arama kriterlerine uygun içerik bulunamadı. Yeni içerik eklemek için üstteki "Yeni İçerik Ekle" butonuna tıklayabilirsiniz.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((art) => {
                  const theme = CATEGORY_THEMES[art.category] || CATEGORY_THEMES['Okulumuzdan'];
                  return (
                    <tr key={art.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-semibold text-slate-900 max-w-xs">
                        <div className="font-editorial text-sm">{art.title}</div>
                        {art.subtitle && <div className="text-[11px] text-slate-500 truncate">{art.subtitle}</div>}
                      </td>
                      <td className="p-3">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold"
                          style={{ backgroundColor: theme.bgLight, color: theme.color }}
                        >
                          {art.category}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-slate-800">{art.author || 'Anonim'}</div>
                        <div className="text-[10px] text-slate-500">{art.authorRole}</div>
                      </td>
                      <td className="p-3 font-mono text-slate-600">
                        {art.photos ? art.photos.length : 0} adet
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          art.status === 'Yayına Hazır'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : art.status === 'Onaylandı'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {art.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onEditArticle(art)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded transition-colors"
                            title="Düzenle"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          {onDeleteArticle && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`"${art.title}" başlıklı yazıyı silmek istediğinizden emin misiniz?`)) {
                                  onDeleteArticle(art.id);
                                }
                              }}
                              className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition-colors"
                              title="Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onNavigateTab('preview')}
                            className="p-1.5 hover:bg-sky-50 text-sky-600 hover:text-sky-700 rounded transition-colors"
                            title="Önizle"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
