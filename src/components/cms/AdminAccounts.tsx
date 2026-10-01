import React, { useCallback, useEffect, useState } from 'react';
import { Users, UserPlus, Loader2, ShieldCheck, Info } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';

interface AdminRow {
  user_id: string;
  email: string;
  added_at: string;
  is_me: boolean;
}

interface AdminAccountsProps {
  onShowToast: (message: string, type?: 'success' | 'copy') => void;
}

/**
 * Lists the accounts that may use the CMS and lets an admin add another one
 * (e.g. the partner) by email. The account itself is created in Supabase
 * (Authentication → Users → Add user); this grants it admin access.
 */
export const AdminAccounts: React.FC<AdminAccountsProps> = ({ onShowToast }) => {
  const [admins, setAdmins] = useState<AdminRow[] | null>(null);
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: 'ok' | 'warn'; text: string } | null>(null);

  const load = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    const { data, error } = await supabase.rpc('list_admins');
    if (error) {
      console.error('[supabase] list_admins failed', error);
      setAdmins([]);
      return;
    }
    setAdmins((data as AdminRow[]) || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setMessage({ kind: 'warn', text: 'Format email belum benar.' });
      return;
    }
    if (!supabase) return;
    setBusy(true);
    setMessage(null);
    const { data, error } = await supabase.rpc('add_admin', { admin_email: value });
    setBusy(false);
    if (error) {
      setMessage({ kind: 'warn', text: 'Gagal menambahkan admin. Coba lagi.' });
      return;
    }
    if (data === 'not_found') {
      setMessage({
        kind: 'warn',
        text: `Akun ${value} belum ada. Buat dulu di Supabase (lihat langkah di bawah), lalu tambahkan lagi di sini.`,
      });
      return;
    }
    if (data === 'already_admin') {
      setMessage({ kind: 'ok', text: `${value} sudah menjadi admin.` });
      return;
    }
    setEmail('');
    setMessage({ kind: 'ok', text: `${value} sekarang bisa masuk ke CMS. 🎉` });
    onShowToast(`👥 ${value} ditambahkan sebagai admin`, 'success');
    load();
  };

  if (!isSupabaseConfigured) return null;

  return (
    <div className="p-6 rounded-3xl bg-white border-2 border-[#1E293B] shadow-[4px_5px_0px_#1E293B] space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#FFCC00] text-[#1E293B] border-2 border-[#1E293B] shadow-[2px_2px_0px_#1E293B] flex items-center justify-center shrink-0">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-[17px] font-serif font-bold text-[#1E293B]">Akun Admin</h3>
          <p className="text-[12px] text-slate-600">
            Setiap admin login dengan akunnya sendiri dan bisa mengedit & blast undangan bersamaan dari perangkat berbeda.
          </p>
        </div>
      </div>

      <ul className="divide-y divide-slate-200 rounded-2xl border border-slate-200 overflow-hidden">
        {admins === null && (
          <li className="px-4 py-3 text-[13px] text-slate-500 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Memuat daftar admin…
          </li>
        )}
        {admins?.map((a) => (
          <li key={a.user_id} className="px-4 py-3 flex items-center justify-between gap-3 bg-slate-50/60">
            <div className="flex items-center gap-2 min-w-0">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-[13px] font-bold text-[#1E293B] truncate">{a.email}</span>
            </div>
            {a.is_me && (
              <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-[#E0F7FD] text-[#007EA3] border border-[#00AEE0]/40 shrink-0">
                Anda
              </span>
            )}
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email.pasangan@gmail.com"
          autoComplete="off"
          className="flex-1 px-3.5 py-2.5 rounded-xl border-2 border-[#1E293B] bg-white text-[13px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#00AEE0]"
        />
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#00AEE0] hover:bg-[#0096c2] text-white text-[13px] font-bold border-2 border-[#1E293B] shadow-[2px_2px_0px_#1E293B] disabled:opacity-60 cursor-pointer"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
          Jadikan Admin
        </button>
      </form>

      {message && (
        <p
          className={`text-[12.5px] font-medium px-3 py-2 rounded-xl border ${
            message.kind === 'ok'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-amber-50 text-amber-900 border-amber-200'
          }`}
        >
          {message.text}
        </p>
      )}

      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-[12px] text-slate-700 space-y-1.5">
        <p className="font-bold text-[#1E293B] flex items-center gap-1.5">
          <Info className="w-4 h-4 text-[#00AEE0]" /> Cara menambah akun pasangan
        </p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>
            Buka <b>Supabase → Authentication → Users → Add user → Create new user</b>.
          </li>
          <li>
            Isi email & kata sandi pasangan, centang <b>Auto Confirm User</b>, lalu simpan.
          </li>
          <li>Masukkan email yang sama di kolom di atas, lalu tekan <b>Jadikan Admin</b>.</li>
          <li>Pasangan bisa langsung login ke CMS dengan email & kata sandinya sendiri.</li>
        </ol>
        <p className="text-slate-500">
          Menghapus akses admin dilakukan di Supabase (Table Editor → <code>admins</code>).
        </p>
      </div>
    </div>
  );
};
