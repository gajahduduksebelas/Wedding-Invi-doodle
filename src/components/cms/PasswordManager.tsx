import React, { useState } from 'react';
import {
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Link as LinkIcon,
} from 'lucide-react';

interface PasswordManagerProps {
  onShowToast: (message: string, type?: 'success' | 'copy') => void;
  onLogout?: () => void;
  onSwitchToInvitation: () => void;
}

export const PasswordManager: React.FC<PasswordManagerProps> = ({
  onShowToast,
  onLogout,
  onSwitchToInvitation,
}) => {
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const getStoredPassword = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wedding_cms_password');
      if (saved && saved.trim().length > 0) {
        return saved;
      }
    }
    return 'admin123';
  };

  const isUsingDefault = getStoredPassword() === 'admin123';

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const actualCurrent = getStoredPassword();

    if (currentPasswordInput.trim() !== actualCurrent.trim()) {
      setErrorMsg('Kata sandi saat ini tidak sesuai. Password bawaan awal adalah: admin123');
      return;
    }

    if (!newPassword.trim()) {
      setErrorMsg('Kata sandi baru tidak boleh kosong.');
      return;
    }

    if (newPassword.trim().length < 4) {
      setErrorMsg('Kata sandi baru minimal 4 karakter demi keamanan.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('wedding_cms_password', newPassword.trim());
    }

    setCurrentPasswordInput('');
    setNewPassword('');
    setConfirmPassword('');
    setSuccessMsg('Kata sandi CMS berhasil diperbarui! Simpan kata sandi ini dengan baik.');
    onShowToast('🔒 Kata sandi CMS berhasil diperbarui!', 'success');
  };

  const handleResetToDefault = () => {
    if (confirm('Kembalikan kata sandi ke password bawaan (admin123)?')) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('wedding_cms_password', 'admin123');
      }
      setCurrentPasswordInput('');
      setNewPassword('');
      setConfirmPassword('');
      setErrorMsg('');
      setSuccessMsg('Kata sandi telah dikembalikan ke bawaan: admin123');
      onShowToast('🔄 Password direset ke bawaan: admin123', 'success');
    }
  };

  const handleCopySecretUrl = () => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const pathname = window.location.pathname;
      const secretUrl = `${origin}${pathname}#cms`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(secretUrl).then(() => {
          onShowToast('📋 URL rahasia /#cms berhasil disalin ke clipboard!', 'copy');
        }).catch(() => {
          onShowToast('📋 URL: ' + secretUrl, 'copy');
        });
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-[800px] mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border-2 border-[#1E293B] shadow-[4px_5px_0px_#1E293B] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#00AEE0] text-white border-2 border-[#1E293B] shadow-[2px_2px_0px_#1E293B] flex items-center justify-center shrink-0">
              <KeyRound className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-[20px] font-serif font-bold text-[#1E293B]">
                Keamanan &amp; Kata Sandi CMS
              </h2>
              <p className="text-[12.5px] font-sans text-[#64748B]">
                Kelola kata sandi admin dan tautan akses tersembunyi <code className="bg-[#F0F9FF] text-[#00AEE0] font-bold px-1.5 py-0.5 rounded border border-[#BAE6FD]">/#cms</code>
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0F9FF] border border-[#BAE6FD] text-[11.5px] font-sans font-semibold text-[#0284C7]">
            <Sparkles className="w-3.5 h-3.5 text-[#FED636]" />
            <span>Status: {isUsingDefault ? 'Password Bawaan (admin123)' : 'Password Kustom Aktif'}</span>
          </div>
        </div>
      </div>

      {/* Secret Access /#cms Explanation Card */}
      <div className="p-6 rounded-3xl bg-[#F0F9FF] border-2 border-[#1E293B] shadow-[4px_5px_0px_#1E293B] relative">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#FED636] text-[#1E293B] border-2 border-[#1E293B] shadow-[2px_2px_0px_#1E293B] flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5 stroke-[2]" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-[15px] font-serif font-bold text-[#1E293B]">
              Akses Rahasia via <span className="text-[#00AEE0]">/#cms</span>
            </h3>
            <p className="text-[12.5px] font-sans text-[#64748B] leading-relaxed">
              Sesuai permintaan Anda, <strong>tombol CMS telah dihilangkan dari seluruh halaman undangan/tema</strong>. Tamu undangan tidak akan melihat akses atau tombol ke halaman admin ini.
            </p>
            <p className="text-[12.5px] font-sans text-[#1E293B] leading-relaxed">
              Untuk membuka panel CMS ini kapan pun, Anda hanya perlu menambahkan <strong className="text-[#00AEE0]">/#cms</strong> di akhir URL website undangan Anda pada browser:
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-3 pt-1">
              <div className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#1E293B] shadow-[2px_2px_0px_#1E293B] text-[13px] font-mono text-[#0284C7] truncate select-all">
                {typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}#cms` : 'https://undangan-anda.com/#cms'}
              </div>
              <button
                type="button"
                onClick={handleCopySecretUrl}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#00AEE0] hover:bg-[#0298D4] text-white border-2 border-[#1E293B] shadow-[2px_2px_0px_#1E293B] active:translate-x-[1px] active:translate-y-[1px] text-[12.5px] font-sans font-bold cursor-pointer transition-all shrink-0"
              >
                <Copy className="w-4 h-4" />
                <span>Salin URL /#cms</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Form Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#1E293B] shadow-[4px_5px_0px_#1E293B] relative">
        <div className="flex items-center justify-between pb-4 border-b border-[#BAE6FD]/60 mb-6">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-[#00AEE0]" />
            <h3 className="text-[17px] font-serif font-bold text-[#1E293B]">
              Form Ubah Kata Sandi
            </h3>
          </div>
          <span className="text-[11.5px] font-sans font-medium text-[#64748B]">
            Default: <strong className="font-mono text-[#00AEE0]">admin123</strong>
          </span>
        </div>

        {errorMsg && (
          <div className="mb-5 flex items-center gap-2.5 p-3 rounded-2xl bg-red-50 border-2 border-red-300 text-red-800 text-[12.5px] font-sans">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-800 text-[12.5px] font-sans">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="text-[12px] font-sans font-semibold text-[#1E293B] block mb-1">
              Kata Sandi Saat Ini <span className="text-[#64748B] font-normal">(bawaan awal: admin123)</span>
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                required
                value={currentPasswordInput}
                onChange={(e) => setCurrentPasswordInput(e.target.value)}
                placeholder="Masukkan kata sandi saat ini (default: admin123)"
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border-2 border-[#1E293B] bg-[#F0F9FF] text-[13.5px] font-sans text-[#1E293B] focus:outline-none focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#64748B] hover:text-[#00AEE0] cursor-pointer"
                title={showCurrent ? 'Sembunyikan' : 'Lihat'}
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] font-sans font-semibold text-[#1E293B] block mb-1">
                Kata Sandi Baru <span className="text-[#64748B] font-normal">(min. 4 karakter)</span>
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Ketik kata sandi baru..."
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border-2 border-[#1E293B] bg-[#F0F9FF] text-[13.5px] font-sans text-[#1E293B] focus:outline-none focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#64748B] hover:text-[#00AEE0] cursor-pointer"
                  title={showNew ? 'Sembunyikan' : 'Lihat'}
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="text-[12px] font-sans font-semibold text-[#1E293B] block mb-1">
                Konfirmasi Kata Sandi Baru
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru..."
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border-2 border-[#1E293B] bg-[#F0F9FF] text-[13.5px] font-sans text-[#1E293B] focus:outline-none focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#64748B] hover:text-[#00AEE0] cursor-pointer"
                  title={showConfirm ? 'Sembunyikan' : 'Lihat'}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#00AEE0] hover:bg-[#0298D4] text-white border-2 border-[#1E293B] shadow-[3px_4px_0px_#1E293B] active:translate-x-[1px] active:translate-y-[1px] text-[13px] font-sans font-bold cursor-pointer transition-all"
            >
              Simpan Kata Sandi Baru
            </button>

            <button
              type="button"
              onClick={handleResetToDefault}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#FEF9C3] hover:bg-[#FED636] text-[#1E293B] border-2 border-[#1E293B] shadow-[2px_2px_0px_#1E293B] text-[12px] font-sans font-semibold cursor-pointer transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset ke Bawaan (admin123)</span>
            </button>
          </div>
        </form>
      </div>

      {/* Quick Access Guidance */}
      <div className="p-5 rounded-2xl bg-white border border-[#BAE6FD] text-[12px] font-sans text-[#64748B] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-[#00AEE0] shrink-0" />
          <span>Ingin kembali ke undangan tamu?</span>
        </div>
        <button
          type="button"
          onClick={onSwitchToInvitation}
          className="text-[#00AEE0] font-bold hover:underline cursor-pointer"
        >
          Lihat Halaman Undangan &rarr;
        </button>
      </div>
    </div>
  );
};
