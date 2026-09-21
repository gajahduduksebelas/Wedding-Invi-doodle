import React, { useState } from 'react';
import { Landmark, Wallet, Copy, Check, Gift, Package, ChevronDown, ChevronUp } from 'lucide-react';
import { BANK_ACCOUNTS, DEFAULT_GIFT_ADDRESS } from '../data/weddingData';
import { BankAccount } from '../types';

interface GiftSectionProps {
  onShowToast: (message: string, type?: 'success' | 'copy') => void;
  banks?: BankAccount[];
  giftAddress?: string;
}

export const GiftSection: React.FC<GiftSectionProps> = ({
  onShowToast,
  banks,
  giftAddress,
}) => {
  const activeBanks = banks || BANK_ACCOUNTS;
  const physicalGiftAddress = giftAddress || DEFAULT_GIFT_ADDRESS;

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddress, setShowAddress] = useState(false);

  const handleCopy = (text: string, label: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedId(id);
    onShowToast(`${label} berhasil disalin! ✨`, 'copy');
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  return (
    <section id="giftSection" className="px-4 py-4 flex flex-col items-center">
      <div className="w-full max-w-[420px] flex flex-col gap-4">
        <div className="text-center">
          <span className="text-[12px] font-bold text-[#cc3a63] tracking-widest uppercase block">
            Tanda Kasih
          </span>
          <h2 className="text-[26px] font-bold text-[#2b2620] font-heading mt-0.5">
            Amplop Digital
          </h2>
          <p className="text-[13px] font-medium text-[#524348] mt-1 leading-relaxed">
            Doa restu Anda adalah karunia terindah. Bagi yang ingin memberi tanda kasih, dapat mengirimkan melalui:
          </p>
        </div>

        {/* Bank Cards */}
        {activeBanks.map((bank) => {
          const isBCA = bank.id === 'bca';
          const isCopied = copiedId === bank.id;

          return (
            <div
              key={bank.id}
              className="rounded-2xl bg-white p-5 shadow-[3px_4px_0px_#4a4238] border-2 border-[#4a4238] flex flex-col gap-2 relative"
            >
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full ${bank.badgeBg} text-[13px] ${bank.badgeText} font-bold border border-[#e6dac5]`}>
                  {bank.bankName}
                </span>
                {isBCA ? (
                  <Landmark className="w-5 h-5 text-[#cc3a63]" />
                ) : (
                  <Wallet className="w-5 h-5 text-[#51582f]" />
                )}
              </div>

              <div className="mt-2">
                <span className="text-[11px] font-bold text-[#7a7065] uppercase tracking-wider block">
                  Nomor Rekening:
                </span>
                <div className="flex items-center justify-between mt-1 gap-2">
                  <span className="text-[20px] font-bold text-[#2b2620] font-heading tracking-wider">
                    {bank.accountNumber}
                  </span>
                  <button
                    onClick={() => handleCopy(bank.accountNumber, `Nomor ${bank.bankName}`, bank.id)}
                    className={`px-3.5 py-1.5 rounded-full ${bank.btnBg} ${bank.btnText} text-[12px] font-bold shadow-[2px_2px_0px_#4a4238] border border-[#4a4238] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-700" />
                        <span>Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>
                <span className="text-[13px] text-[#2b2620] font-semibold mt-1 block">
                  {bank.holderName}
                </span>
              </div>
            </div>
          );
        })}

        {/* Physical Gift Delivery Toggle Card */}
        <div className="rounded-2xl bg-[#f9f0e0] p-4 shadow-[2px_3px_0px_#4a4238] border-2 border-[#4a4238] flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setShowAddress(!showAddress)}
            className="flex items-center justify-between w-full text-left cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-[#a2ab73] text-[#2b2620] border border-[#4a4238]">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[13px] font-bold text-[#2b2620] block">
                  Kirim Kado Fisik?
                </span>
                <span className="text-[11px] font-medium text-[#7a7065]">
                  Klik untuk melihat alamat pengiriman paket
                </span>
              </div>
            </div>
            {showAddress ? (
              <ChevronUp className="w-4 h-4 text-[#524348]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#524348]" />
            )}
          </button>

          {showAddress && (
            <div className="mt-2 pt-2 border-t border-[#e6dac5] flex flex-col gap-2 text-[12px]">
              <div className="flex items-start gap-1.5">
                <Package className="w-4 h-4 text-[#cc3a63] shrink-0 mt-0.5" />
                <p className="text-[#2b2620] leading-relaxed">
                  {physicalGiftAddress}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(physicalGiftAddress, 'Alamat pengiriman kado', 'address')}
                className="mt-1 self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff7eb] hover:bg-[#edd9bf] text-[#2b2620] text-[11px] font-bold border border-[#4a4238] shadow-[1px_2px_0px_#4a4238] active:translate-y-0.5 cursor-pointer"
              >
                {copiedId === 'address' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-700" />
                    <span>Alamat Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Alamat Kado</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
