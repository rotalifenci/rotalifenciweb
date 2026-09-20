import React from 'react';
import { MagazinePage } from '../../types/magazine';
import { Puzzle, HelpCircle, CheckSquare } from 'lucide-react';

interface Props {
  page: MagazinePage;
}

export const PuzzleTemplate: React.FC<Props> = ({ page }) => {
  // Sample 8x8 Word Search Matrix
  const grid = [
    ['B', 'İ', 'L', 'İ', 'M', 'R', 'O', 'B'],
    ['S', 'E', 'N', 'S', 'Ö', 'R', 'K', 'O'],
    ['T', 'E', 'K', 'N', 'O', 'F', 'E', 'T'],
    ['E', 'K', 'O', 'L', 'O', 'J', 'İ', 'İ'],
    ['M', 'A', 'İ', 'D', 'E', 'R', 'L', 'K'],
    ['Y', 'A', 'P', 'A', 'Y', 'Z', 'E', 'K'],
    ['A', 'T', 'Ö', 'L', 'Y', 'E', 'S', 'İ'],
    ['K', 'O dynamics', 'D', 'L', 'A', 'M', 'A', 'X']
  ];

  return (
    <div className="w-full h-full bg-[#FDFBF7] text-slate-900 flex flex-col justify-start overflow-visible">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-purple-700 text-xs font-bold uppercase tracking-widest mb-1">
          <Puzzle className="w-4 h-4" />
          <span>EĞLENCE VE ZEKA OYUNLARI</span>
        </div>
        <h1 className="font-editorial text-2xl md:text-3xl font-extrabold text-slate-950 leading-tight">
          {page.title || 'Fen ve Teknoloji Kelime Avı'}
        </h1>
        <p className="text-slate-600 text-xs italic font-serif mt-1 pb-2 border-b border-purple-200">
          Tabloya gizlenmiş 6 bilimsel terimi bulabilecek misiniz?
        </p>
      </div>

      {/* Main Grid: Word Search + Clues */}
      <div className="my-3 grid grid-cols-12 gap-5 flex-1 items-center">
        {/* Word Search Grid (7 cols) */}
        <div className="col-span-7 bg-white p-4 rounded-xl border border-purple-200 shadow-sm flex flex-col items-center">
          <div className="grid grid-cols-8 gap-1 w-full max-w-xs font-mono font-bold text-center">
            {grid.map((row, rIdx) =>
              row.map((char, cIdx) => (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className="w-7 h-7 flex items-center justify-center rounded border border-purple-100 bg-purple-50/50 text-xs text-purple-900 hover:bg-purple-200 cursor-pointer transition-colors"
                >
                  {char[0]}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Word List & Riddles Right (5 cols) */}
        <div className="col-span-5 space-y-3">
          <div className="bg-purple-50/70 p-3.5 rounded-xl border border-purple-200">
            <h4 className="text-xs font-bold text-purple-900 uppercase mb-2 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>GİZLİ KELİMELER:</span>
            </h4>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-700 font-semibold">
              <span>• BİLİM</span>
              <span>• STEM</span>
              <span>• SENSÖR</span>
              <span>• ROBOTİK</span>
              <span>• MAİDER</span>
              <span>• YAPAY ZEKA</span>
            </div>
          </div>

          <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-200">
            <h4 className="text-xs font-bold text-amber-900 uppercase mb-1 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>GÜNÜN BİLMECESİ:</span>
            </h4>
            <p className="text-xs text-slate-700 italic">
              "Kendi çalışır durmadan, dünyayı gezdirir yerinden kalkmadan. Bir tıkla bağlar bizi, bil bakalım nedir bu?"
            </p>
            <p className="text-[10px] text-slate-400 mt-2 text-right">(Cevap: İnternet)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
