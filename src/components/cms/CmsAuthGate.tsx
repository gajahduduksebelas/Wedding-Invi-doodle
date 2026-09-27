import React, { useState } from 'react';
import { Lock, KeyRound, Eye, EyeOff, ArrowLeft, ShieldCheck, AlertCircle, Mail } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';

interface CmsAuthGateProps {
  onSuccess: () => void;
  onBackToInvitation: () => void;
  onShowToast: (message: string, type?: 'success' | 'copy') => void;
}

export const CmsAuthGate: React.FC<CmsAuthGateProps> = ({
  onSuccess,
  onBackToInvitation,
  onShowToast,
}) => {
  const [email, setEmail] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isSupabaseConfigured || !supabase) {
      setErrorMsg(
        'Supabase belum dikonfigurasi. Tambahkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY untuk mengaktifkan login CMS.'
      );
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: passwordInput,
    });
    setIsSubmitting(false);

    if (error) {
      setErrorMsg('Email atau kata sandi salah.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    onShowToast('🔓 Akses CMS Terbuka! Selamat datang di Admin Panel.', 'success');
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-[#F0F9FF] text-[#1E293B] flex flex-col items-center justify-center p-4 selection:bg-[#FEF9C3] selection:text-[#0284C7]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#BAE6FD]/60 via-[#FED636]/30 to-transparent blur-3xl" />
      </div>

      <div
        className={`w-full max-w-[420px] bg-white/95 backdrop-blur-md rounded-3xl border border-[#BAE6FD] p-7 sm:p-9 shadow-[0_16px_50px_rgba(0,174,224,0.1)] relative z-10 flex flex-col items-center text-center transition-transform ${
          isShaking ? 'animate-bounce' : ''
        }`}
      >
        <div className="w-16 h-16 rounded-2xl bg-[#E0F2FE] border border-[#BAE6FD] text-[#00AEE0] flex items-center justify-center mb-5 shadow-[0_4px_16px_rgba(0,174,224,0.15)]">
          <Lock className="w-8 h-8 stroke-[1.8]" />
        </div>

        <span className="font-script text-[32px] sm:text-[36px] text-[#00AEE0] leading-none mb-1">
          Admin Portal
        </span>
        <h1 className="text-[20px] sm:text-[22px] font-serif font-bold text-[#1E293B] tracking-tight">
          Akses Masuk CMS Undangan
        </h1>
        <p className="text-[12.5px] font-sans text-[#64748B] mt-1.5 leading-relaxed max-w-[320px]">
          Halaman ini dilindungi kata sandi untuk mengelola data pengantin, buku tamu, RSVP, dan WhatsApp Blaster.
        </p>

        <form onSubmit={handleSubmit} className="w-full mt-6 flex flex-col gap-3.5">
          <div className="text-left">
            <label
              htmlFor="cms-email-input"
              className="text-[11px] font-sans font-semibold text-[#64748B] uppercase tracking-wider block mb-1.5"
            >
              Email Admin
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="cms-email-input"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="admin@domainanda.com"
                autoFocus
                autoComplete="username"
                className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] text-[14px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#00AEE0]/30 focus:border-[#00AEE0] transition-all font-sans"
              />
            </div>
          </div>

          <div className="text-left">
            <label
              htmlFor="cms-password-input"
              className="text-[11px] font-sans font-semibold text-[#64748B] uppercase tracking-wider block mb-1.5"
            >
              Kata Sandi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                id="cms-password-input"
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Masukkan kata sandi..."
                autoComplete="current-password"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] text-[14px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#00AEE0]/30 focus:border-[#00AEE0] transition-all font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#64748B] hover:text-[#00AEE0] cursor-pointer"
                title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11.5px] text-left">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-1 inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[#00AEE0] hover:bg-[#0298D4] active:translate-y-0.5 text-white text-[13.5px] font-sans font-semibold shadow-[0_6px_20px_rgba(0,174,224,0.3)] transition-all cursor-pointer disabled:opacity-60"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSubmitting ? 'Memeriksa...' : 'Masuk ke Dashboard CMS'}</span>
          </button>
        </form>

        <div className="mt-5 p-3 w-full rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] text-left">
          <p className="text-[11px] font-sans text-[#64748B] leading-relaxed">
            Belum punya akun admin? Buat satu lewat Supabase Dashboard → Authentication → Users → Add user.
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToInvitation}
          className="mt-6 inline-flex items-center gap-1.5 text-[12px] font-sans font-medium text-[#64748B] hover:text-[#00AEE0] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Halaman Undangan</span>
        </button>
      </div>
    </div>
  );
};
