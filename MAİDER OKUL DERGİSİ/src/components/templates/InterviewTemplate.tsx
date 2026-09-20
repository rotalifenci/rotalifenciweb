import React from 'react';
import { MagazinePage } from '../../types/magazine';
import { MessageSquare, HelpCircle } from 'lucide-react';

interface Props {
  page: MagazinePage;
}

export const InterviewTemplate: React.FC<Props> = ({ page }) => {
  const photo = page.photos && page.photos[0];
  const qaList = page.extraData?.interviewData || [
    {
      id: 'qa-1',
      question: 'Hocam, okulumuzda başlatılan STEM ve bilim projelerinin öğrenciler üzerindeki en büyük etkisi nedir?',
      answer: 'Öğrencilerimiz teorik fen bilgilerini gerçek hayatta dokunabildikleri, çalıştırabildikleri projelere dönüştürdüklerinde öğrenme heyecanı katlanıyor. Artık sadece sınav için değil, merak ettikleri için öğreniyorlar.'
    },
    {
      id: 'qa-2',
      question: 'Turnuva sürecinde karşılaştığınız en büyük zorluk neydi ve bunu nasıl aştınız?',
      answer: 'Robotun sensör kalibrasyonu başlangıçta zorladı. Ancak öğrencilerimiz yılmadı; defalarca algoritmayı revize ettiler. Takım ruhu ve birbirlerine olan inançları şampiyonluğu getirdi.'
    },
    {
      id: 'qa-3',
      question: 'Gelecekte mühendislik ve bilim alanını seçecek gençlere tavsiyeniz nedir?',
      answer: 'Hata yapmaktan asla korkmasınlar. Her hata, doğru sonuca giden yolda en kıymetli öğretmendir. Meraklarını daima canlı tutsunlar.'
    }
  ];

  return (
    <div className="w-full h-full bg-[#FDFBF7] text-slate-900 flex flex-col justify-start overflow-visible">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-widest mb-1">
          <MessageSquare className="w-4 h-4" />
          <span>AYIN SÖYLEŞİSİ / ÖZEL RÖPORTAJ</span>
        </div>
        <h1 className="font-editorial text-2xl md:text-3xl font-extrabold text-slate-950 leading-tight">
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="text-slate-600 text-xs md:text-sm italic font-serif mt-1 pb-2 border-b border-teal-200">
            {page.subtitle}
          </p>
        )}
      </div>

      {/* Main Layout */}
      <div className="my-3 grid grid-cols-12 gap-5 flex-1 items-start">
        {/* Guest Profile Left (4 cols) */}
        <div className="col-span-4 bg-teal-50/70 p-4 rounded-xl border border-teal-200/80 flex flex-col items-center text-center">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md mb-3">
            <img
              src={photo?.url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'}
              alt="Konuk"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-editorial font-bold text-slate-900 text-sm">{page.author || 'Söyleşi Konuğu'}</h3>
          <p className="text-xs text-teal-800 font-semibold">{page.authorRole || 'Fen Bilimleri Danışmanı'}</p>
          <p className="text-[11px] text-slate-500 mt-2 italic leading-tight">
            “Röportaj: MAİDER Genç Muhabirleri”
          </p>

          {page.pullQuote && (
            <div className="mt-4 p-2.5 bg-white rounded-lg border-l-2 border-teal-500 shadow-xs text-left">
              <p className="font-editorial italic text-xs text-slate-700">
                “{page.pullQuote}”
              </p>
            </div>
          )}
        </div>

        {/* Q&A Stream Right (8 cols) */}
        <div className="col-span-8 space-y-3 flex-1 overflow-hidden">
          {qaList.map((qa: any, idx: number) => (
            <div key={idx} className="space-y-1 text-xs">
              <div className="flex items-start gap-1.5 text-teal-900 font-bold bg-teal-100/60 p-2 rounded">
                <span className="text-teal-700">S:</span>
                <span>{qa.question}</span>
              </div>
              <div className="text-slate-700 p-2 pl-3 leading-relaxed text-justify bg-white/70 rounded border border-slate-200/60">
                <span className="font-bold text-slate-900 mr-1.5">C:</span>
                {qa.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
