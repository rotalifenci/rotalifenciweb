import React from 'react';
import { MagazinePage, MagazineIssue } from '../../types/magazine';
import { FileText, Shield, Mail, Globe, MapPin } from 'lucide-react';

interface Props {
  page: MagazinePage;
  issue: MagazineIssue;
}

export const MastheadTemplate: React.FC<Props> = ({ page, issue }) => {
  const m = issue.masthead;

  return (
    <div className="w-full h-full bg-[#FDFBF7] text-slate-900 flex flex-col justify-start overflow-visible">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-slate-700 text-xs font-bold uppercase tracking-widest mb-1">
          <FileText className="w-4 h-4" />
          <span>YASAL KÜNYE VE YAYIN BİLGİLERİ</span>
        </div>
        <h1 className="font-editorial text-2xl md:text-3xl font-extrabold text-slate-950 leading-tight">
          {page.title || 'MAİDER Yayın Künyesi'}
        </h1>
        <p className="text-slate-600 text-xs italic font-serif mt-1 pb-1.5 border-b border-slate-300">
          Mehmet Akif İnan Ortaokulu Adına Sahibi ve Yayın Kurulu
        </p>
      </div>

      {/* Masthead Grid */}
      <div className="my-3 grid grid-cols-2 gap-5 flex-1 text-xs">
        {/* Left Column: Official Roles */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2.5">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">İMTİYAZ SAHİBİ</span>
            <p className="font-editorial font-bold text-slate-900 text-sm">{m.principal}</p>
            <p className="text-[11px] text-slate-500">Okul Müdürü</p>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">GENEL YAYIN YÖNETMENİ</span>
            <p className="font-editorial font-bold text-slate-900 text-sm">{m.editorInChief}</p>
            <p className="text-[11px] text-slate-500">Fen Bilimleri Öğretmeni</p>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">YAYIN VE İNCELEME KURULU</span>
            <p className="text-slate-700 text-xs leading-relaxed">{m.editorialBoard.join(', ')}</p>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">DİJİTAL MİZANPAJ VE GRAFİK</span>
            <p className="text-slate-700 text-xs leading-relaxed">{m.graphicDesign.join(', ')}</p>
          </div>
        </div>

        {/* Right Column: Contact & Legal Notice */}
        <div className="flex flex-col justify-start">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-editorial font-bold text-xs text-slate-900 uppercase">İLETİŞİM VE DAĞITIM</h4>
            <div className="flex items-center gap-2 text-slate-600">
              <Mail className="w-3.5 h-3.5 text-sky-600" />
              <span>{m.contactEmail}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Globe className="w-3.5 h-3.5 text-sky-600" />
              <span>{m.website}</span>
            </div>
            <div className="flex items-start gap-2 text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
              <span>{m.schoolAddress}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
            <div className="flex items-center gap-1.5 text-slate-700 font-bold mb-1">
              <Shield className="w-3.5 h-3.5" />
              <span>YASAL HAKLAR</span>
            </div>
            {m.legalNotice}
          </div>
        </div>
      </div>
    </div>
  );
};
