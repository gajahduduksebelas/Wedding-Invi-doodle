import React, { useState } from 'react';
import { Landmark, Plus, Trash2, Save, RotateCcw, MapPin, Sparkles } from 'lucide-react';
import { BankAccount } from '../../types';
import { BANK_ACCOUNTS, DEFAULT_GIFT_ADDRESS } from '../../data/weddingData';

interface GiftsEditorProps {
  banks: BankAccount[];
  giftAddress: string;
  onSave: (newBanks: BankAccount[], newAddress: string) => void;
  onShowToast: (message: string) => void;
}

export const GiftsEditor: React.FC<GiftsEditorProps> = ({
  banks,
  giftAddress,
  onSave,
  onShowToast,
}) => {
  const [bankList, setBankList] = useState<BankAccount[]>(banks);
  const [address, setAddress] = useState<string>(giftAddress);

  const [newBankName, setNewBankName] = useState('');
  const [newAccountNumber, setNewAccountNumber] = useState('');
  const [newHolderName, setNewHolderName] = useState('');

  const handleAddBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBankName.trim() || !newAccountNumber.trim()) return;

    const newAccount: BankAccount = {
      id: `bank-${Date.now()}`,
      bankName: newBankName.trim(),
      accountNumber: newAccountNumber.trim(),
      holderName: newHolderName.trim() || 'a.n. Mempelai',
      badgeBg: 'bg-[#fcecf0]',
      badgeText: 'text-[#cc3a63]',
      btnBg: 'bg-[#cc3a63]',
      btnText: 'text-white',
    };

    setBankList([...bankList, newAccount]);
    setNewBankName('');
    setNewAccountNumber('');
    setNewHolderName('');
    onShowToast(`Rekening ${newAccount.bankName} ditambahkan!`);
  };

  const handleRemoveBank = (id: string, name: string) => {
    if (confirm(`Hapus rekening ${name}?`)) {
      setBankList(bankList.filter((b) => b.id !== id));
      onShowToast(`Rekening ${name} dihapus.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(bankList, address);
    onShowToast('Pengaturan Amplop Digital & Kado berhasil disimpan! 💳');
  };

  const handleReset = () => {
    setBankList(BANK_ACCOUNTS);
    setAddress(DEFAULT_GIFT_ADDRESS);
    onSave(BANK_ACCOUNTS, DEFAULT_GIFT_ADDRESS);
    onShowToast('Data amplop di-reset ke default.');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-[960px] mx-auto pb-12">
      <div className="rounded-2xl bg-white p-5 sm:p-6 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#fcecf0] text-[#cc3a63] text-[11px] font-bold border border-[#cc3a63]/20 uppercase tracking-wider">
            <Landmark className="w-3.5 h-3.5" />
            Amplop Digital &amp; Kado Fisik
          </span>
          <h2 className="text-[24px] sm:text-[28px] font-bold text-[#2b2620] font-heading mt-1">
            Pengaturan Rekening &amp; Alamat Kado
          </h2>
          <p className="text-[13px] text-[#7a7065] mt-1">
            Atur nomor rekening transfer bank, e-wallet (GoPay/OVO/Dana), serta alamat pengiriman kado fisik bagi para tamu.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#f9f0e0] hover:bg-[#edd9bf] text-[#2b2620] text-[12px] font-bold border border-[#4a4238] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#7a7065]" />
            <span>Reset Bawaan</span>
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#cc3a63] hover:bg-[#b52d53] text-white text-[13px] font-bold shadow-[2px_2px_0px_#4a4238] border border-[#4a4238] active:translate-y-0.5 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Rekening</span>
          </button>
        </div>
      </div>

      {/* List Existing Bank Accounts */}
      <div className="rounded-2xl bg-white p-5 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col gap-4">
        <h3 className="text-[17px] font-bold text-[#2b2620] font-heading">
          Daftar Rekening Transfer Bank &amp; E-Wallet
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {bankList.map((bank, idx) => (
            <div
              key={bank.id}
              className="rounded-xl bg-[#fdfaf5] p-4 border-2 border-[#4a4238] shadow-[2px_2px_0px_#4a4238] flex flex-col justify-between gap-3 relative"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[14px] text-[#cc3a63] font-heading">
                  {bank.bankName}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveBank(bank.id, bank.bankName)}
                  className="p-1 rounded text-[#cc3a63] hover:bg-[#fcecf0] cursor-pointer"
                  title="Hapus rekening"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-bold text-[#7a7065] block uppercase">
                    Nomor Rekening
                  </label>
                  <input
                    type="text"
                    value={bank.accountNumber}
                    onChange={(e) => {
                      const updated = [...bankList];
                      updated[idx] = { ...updated[idx], accountNumber: e.target.value };
                      setBankList(updated);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#4a4238] bg-white text-[13px] font-mono font-bold text-[#2b2620] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#7a7065] block uppercase">
                    Atas Nama (Pemilik Rekening)
                  </label>
                  <input
                    type="text"
                    value={bank.holderName}
                    onChange={(e) => {
                      const updated = [...bankList];
                      updated[idx] = { ...updated[idx], holderName: e.target.value };
                      setBankList(updated);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#4a4238] bg-white text-[12px] font-semibold text-[#2b2620] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Bank Mini Form */}
        <div className="rounded-xl bg-[#f9f0e0] p-4 border border-[#e6dac5] mt-2">
          <span className="text-[12px] font-bold text-[#2b2620] block mb-2">
            + Tambah Rekening / E-Wallet Baru
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-4">
              <input
                type="text"
                value={newBankName}
                onChange={(e) => setNewBankName(e.target.value)}
                placeholder="Nama Bank (BCA, BRI, BSI, GoPay...)"
                className="w-full px-3 py-2 rounded-lg border border-[#4a4238] bg-white text-[12px] focus:outline-none"
              />
            </div>
            <div className="sm:col-span-4">
              <input
                type="text"
                value={newAccountNumber}
                onChange={(e) => setNewAccountNumber(e.target.value)}
                placeholder="Nomor Rekening / No. HP E-Wallet"
                className="w-full px-3 py-2 rounded-lg border border-[#4a4238] bg-white text-[12px] font-mono focus:outline-none"
              />
            </div>
            <div className="sm:col-span-3">
              <input
                type="text"
                value={newHolderName}
                onChange={(e) => setNewHolderName(e.target.value)}
                placeholder="a.n. Pemilik Rekening"
                className="w-full px-3 py-2 rounded-lg border border-[#4a4238] bg-white text-[12px] focus:outline-none"
              />
            </div>
            <div className="sm:col-span-1">
              <button
                type="button"
                onClick={handleAddBank}
                className="w-full h-full py-2 rounded-lg bg-[#cc3a63] hover:bg-[#b52d53] text-white flex items-center justify-center font-bold text-[12px] shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Physical Gift Address */}
      <div className="rounded-2xl bg-white p-5 border-2 border-[#4a4238] shadow-[3px_4px_0px_#4a4238] flex flex-col gap-3">
        <div className="flex items-center gap-2 pb-2 border-b border-[#e6dac5]">
          <MapPin className="w-5 h-5 text-[#cc3a63]" />
          <h3 className="text-[17px] font-bold text-[#2b2620] font-heading">
            Alamat Pengiriman Kado Fisik
          </h3>
        </div>

        <p className="text-[12px] text-[#7a7065]">
          Alamat lengkap ini akan ditampilkan ketika tamu mengetuk opsi "Kirim Kado Fisik" pada halaman undangan.
        </p>

        <textarea
          rows={3}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-3 rounded-xl border border-[#4a4238] bg-[#fdfaf5] text-[13px] text-[#2b2620] focus:outline-none leading-relaxed"
        />
      </div>
    </form>
  );
};
