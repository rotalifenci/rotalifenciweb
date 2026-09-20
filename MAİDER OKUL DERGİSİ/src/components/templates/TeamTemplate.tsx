import React from 'react';
import { MagazinePage, MagazineIssue } from '../../types/magazine';
import { Users } from 'lucide-react';

interface Props {
  page: MagazinePage;
  issue: MagazineIssue;
}

export const TeamTemplate: React.FC<Props> = ({ page, issue }) => {
  const members = issue.teamMembers || [];

  return (
    <div className="w-full h-full bg-[#FDFBF7] text-slate-900 flex flex-col justify-start overflow-visible">
      <div>
        <div className="flex items-center gap-2 text-slate-700 text-xs font-bold uppercase tracking-widest mb-1">
          <Users className="w-4 h-4" />
          <span>EMEĞİ GEÇENLER</span>
        </div>
        <h1 className="font-editorial text-2xl md:text-3xl font-extrabold text-slate-950 leading-tight">
          {page.title || 'MAİDER Yayın Kurulu ve Ekibi'}
        </h1>
        <p className="text-slate-600 text-xs italic font-serif mt-1 pb-2 border-b border-slate-200">
          Dergimizin 10. sayısını hazırlayan öğretmen ve öğrencilerimiz
        </p>
      </div>

      <div className="my-3 grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
        {members.map((member) => (
          <div key={member.id} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm border border-slate-300 shrink-0">
              {member.photoUrl ? (
                <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                member.name.split(' ').map(n => n[0]).join('')
              )}
            </div>
            <div>
              <h4 className="font-editorial font-bold text-xs text-slate-900 leading-tight">{member.name}</h4>
              <p className="text-[11px] text-sky-700 font-medium mt-0.5">{member.role}</p>
              <span className="inline-block text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded mt-1">
                {member.group}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
