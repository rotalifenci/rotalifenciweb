import React, { useRef, useState } from 'react';
import { MagazineIssue } from '../../types/magazine';
import {
  LayoutDashboard,
  PlusCircle,
  Layers,
  BookOpen,
  Share2,
  FileDown,
  ShieldCheck,
  Save,
  Upload,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import maiderLogo from '../../assets/maider-logo.png';

interface Props {
  issue: MagazineIssue;
  activeTab: 'dashboard' | 'studio' | 'editor' | 'pages' | 'preview';
  onSelectTab: (tab: 'dashboard' | 'studio' | 'editor' | 'pages' | 'preview') => void;
  onOpenIssueModal: () => void;
  onOpenPreflightModal: () => void;
  onExportPptx: () => void;
  onExportPdf: () => void;
  onExportBackup: () => void;
  onImportBackup: (file: File) => void;
  isExporting: boolean;
  onLogout?: () => void;
}

export const Navbar: React.FC<Props> = ({
  issue,
  activeTab,
  onSelectTab,
  onOpenIssueModal,
  onOpenPreflightModal,
  onExportPptx,
  onExportPdf,
  onExportBackup,
  onImportBackup,
  isExporting,
  onLogout,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImportBackup(e.target.files[0]);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 select-none shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand & Issue Info */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div
              onClick={() => onSelectTab('dashboard')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform overflow-hidden p-0.5">
                <img src={maiderLogo} alt="MAİDER" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-editorial text-base sm:text-lg font-black tracking-wide text-slate-900">MAİDER</span>
                  <span className="text-[9px] sm:text-[10px] bg-sky-50 text-sky-600 font-bold px-1.5 py-0.2 rounded border border-sky-200">
                    PRO
                  </span>
                </div>
                <p className="text-[8px] sm:text-[9px] text-slate-500 font-medium tracking-tight truncate max-w-[120px] sm:max-w-none">
                  Mehmet Akif İnan O.O.
                </p>
              </div>
            </div>

            {/* Issue Selector Pill */}
            <button
              type="button"
              onClick={onOpenIssueModal}
              className="flex items-center gap-1 sm:gap-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 px-2 sm:px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] sm:text-xs transition-colors"
              title="Sayı Ayarları"
            >
              <span className="font-bold text-sky-600">{issue.month}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600 font-mono">S.{issue.issueNumber}</span>
              <Settings className="w-3 h-3 text-slate-400 ml-0.5 hidden sm:inline" />
            </button>
          </div>

          {/* Desktop Central Navigation Tabs (Hidden on Mobile, replaced with Bottom Nav) */}
          <nav className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => onSelectTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-white text-sky-600 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Panel</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('editor')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'editor' || activeTab === 'studio'
                  ? 'bg-gradient-to-r from-indigo-600 to-sky-600 text-white shadow-xs'
                  : 'text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50/70'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>İçerik Ekle & AI Stüdyo ✨</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('pages')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                activeTab === 'pages'
                  ? 'bg-white text-sky-600 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Sayfalar ({issue.pages.length})</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                activeTab === 'preview'
                  ? 'bg-white text-sky-600 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Önizleme</span>
            </button>
          </nav>

          {/* Right Actions: Canva Export, PDF, Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Core Canva Export Button */}
            <button
              type="button"
              onClick={onExportPptx}
              disabled={isExporting}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-[11px] sm:text-xs px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-xs flex items-center gap-1 sm:gap-1.5 transition-all transform active:scale-95 disabled:opacity-50"
              title="Canva'ya Aktarılabilir PPTX Dosyası Oluştur"
            >
              <Share2 className="w-3.5 h-3.5 fill-current shrink-0" />
              <span className="hidden xs:inline">{isExporting ? 'Aktarılıyor...' : "Canva'ya Aktar"}</span>
              <span className="xs:hidden">PPTX</span>
            </button>

            {/* Desktop PDF Download Button */}
            <button
              type="button"
              onClick={onExportPdf}
              className="hidden md:flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold transition-colors"
              title="Yüksek Çözünürlüklü A4 PDF İndir"
            >
              <FileDown className="w-3.5 h-3.5 text-rose-500" />
              <span>PDF İndir</span>
            </button>

            {/* Desktop Pre-flight Audit */}
            <button
              type="button"
              onClick={onOpenPreflightModal}
              className="hidden lg:flex p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-emerald-600 hover:text-emerald-700 border border-slate-200 transition-colors"
              title="Yayın Öncesi Denetim"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>

            {/* Desktop Backup */}
            <button
              type="button"
              onClick={onExportBackup}
              className="hidden xl:flex p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
              title="Projeyi Yedekle (.maider)"
            >
              <Save className="w-4 h-4" />
            </button>

            {/* Desktop Restore */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="hidden xl:flex p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
              title="Yedek Yükle"
            >
              <Upload className="w-4 h-4" />
              <input
                ref={fileInputRef}
                type="file"
                accept=".maider,.json"
                className="hidden"
                onChange={handleFileImport}
              />
            </button>

            {/* Mobile Actions Drawer Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
              title="Ek İşlemler Menüsü"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            {/* Logout Button */}
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="hidden sm:flex p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition-colors"
                title="Güvenli Çıkış Yap"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Menu for extra actions */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onExportPdf();
                }}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2"
              >
                <FileDown className="w-4 h-4 text-rose-500" />
                <span>A4 PDF İndir</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenPreflightModal();
                }}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Denetim</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onExportBackup();
                }}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-sky-600" />
                <span>Yedek İndir</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  fileInputRef.current?.click();
                }}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2"
              >
                <Upload className="w-4 h-4 text-indigo-600" />
                <span>Yedek Yükle</span>
              </button>
            </div>

            {onLogout && (
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full mt-2 p-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold text-rose-700 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Güvenli Çıkış Yap</span>
              </button>
            )}
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation Bar (Thumb Friendly Dock) */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-2 flex justify-around items-center shadow-lg select-none">
        <button
          type="button"
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-colors ${
            activeTab === 'dashboard' ? 'text-sky-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Panel</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('editor')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-[10px] font-bold transition-colors ${
            activeTab === 'editor' || activeTab === 'studio' ? 'text-indigo-600 font-black' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>İçerik & AI</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('pages')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-[10px] font-bold transition-colors ${
            activeTab === 'pages' ? 'text-sky-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Sayfalar</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('preview')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-[10px] font-bold transition-colors ${
            activeTab === 'preview' ? 'text-sky-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Önizle</span>
        </button>
      </nav>
    </>
  );
};
