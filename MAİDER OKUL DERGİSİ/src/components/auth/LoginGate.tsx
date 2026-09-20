import React, { useState } from 'react';
import { Lock, KeyRound, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import maiderLogo from '../../assets/maider-logo.png';

interface Props {
  onLoginSuccess: () => void;
}

const CORRECT_PASSWORD = 'Mai767943.';

export const LoginGate: React.FC<Props> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setError('');
      if (rememberMe) {
        localStorage.setItem('maider_auth', 'authenticated');
      } else {
        sessionStorage.setItem('maider_auth', 'authenticated');
      }
      onLoginSuccess();
    } else {
      setError('Girdiğiniz şifre hatalı! Lütfen okul idaresi veya dergi editöründen şifreyi kontrol ediniz.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-3 sm:p-4 select-none">
      {/* Background ambient accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-sky-200/50 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-200/50 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl text-slate-800">
        {/* Header Branding with New Official Logo */}
        <div className="text-center mb-5 sm:mb-6">
          <div className="w-24 h-24 sm:w-36 sm:h-36 mx-auto mb-2 sm:mb-3 flex items-center justify-center filter drop-shadow-md hover:scale-105 transition-transform">
            <img
              src={maiderLogo}
              alt="MAİDER Mehmet Akif İnan Ortaokulu Dergisi Logosu"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
            <span>Korumalı Giriş Masası</span>
          </div>

          <h1 className="font-editorial text-2xl md:text-3xl font-black text-slate-900 tracking-wide">
            MAİDER
          </h1>
          <p className="text-xs font-semibold text-slate-600 mt-0.5">
            Mehmet Akif İnan Ortaokulu E-Dergi Masası
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Dergi hazırlama ve mizanpaj yönetim paneline erişmek için yetkili öğretmen şifresini giriniz.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-sky-600" />
                <span>Giriş Şifresi</span>
              </span>
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Şifrenizi giriniz..."
                required
                autoFocus
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-11 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                title={showPassword ? 'Şifreyi Gizle' : 'Şifreyi Göster'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-800">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
              />
              <span>Bu cihazda beni hatırla</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>GİRİŞ YAP</span>
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            © Mehmet Akif İnan Ortaokulu • Tüm Hakları Saklıdır
          </p>
        </div>
      </div>
    </div>
  );
};
