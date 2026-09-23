import React, { useState } from 'react';
import { Copy, Check, Sparkles, Heart } from 'lucide-react';
import { BANK_ACCOUNTS, DEFAULT_GIFT_ADDRESS, DOODLE_ASSETS } from '../data/weddingData';
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
  const physicalGiftAddress =
    giftAddress || DEFAULT_GIFT_ADDRESS || 'Graha Manggala Siliwangi, Jl. Aceh No. 66, Merdeka, Kota Bandung, Jawa Barat';

  const [copiedId, setCopiedId] = useState<string | null>(null);

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
    <section
      id="gift"
      className="min-h-dvh w-full px-4 py-8 flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Floating Random Doodle Assets */}
      <img
        src={DOODLE_ASSETS.giftMail}
        alt=""
        aria-hidden="true"
        className="absolute top-5 left-3 w-14 sm:w-16 h-14 sm:h-16 object-contain pointer-events-none opacity-85 animate-doodle-float z-10"
      />
      <img
        src={DOODLE_ASSETS.heartBalloons}
        alt=""
        aria-hidden="true"
        className="absolute top-5 right-3 w-16 sm:w-20 h-16 sm:h-20 object-contain pointer-events-none opacity-85 animate-doodle-slow z-10"
      />
      <img
        src={DOODLE_ASSETS.rings}
        alt=""
        aria-hidden="true"
        className="absolute bottom-5 left-3 w-12 sm:w-14 h-12 sm:h-14 object-contain pointer-events-none opacity-85 animate-doodle-sway z-10"
      />
      <img
        src={DOODLE_ASSETS.bouquet}
        alt=""
        aria-hidden="true"
        className="absolute bottom-5 right-3 w-12 sm:w-14 h-12 sm:h-14 object-contain pointer-events-none opacity-85 animate-doodle-bob z-10"
      />

      <div className="absolute top-1/2 left-3 text-[#cc3a63]/30 pointer-events-none animate-doodle-pulse">
        <Heart className="w-4 h-4 fill-current" />
      </div>
      <div className="absolute top-1/2 right-3 text-[#8b965f]/40 pointer-events-none animate-doodle-pulse">
        <Sparkles className="w-5 h-5" />
      </div>

      <div className="w-full max-w-[420px] flex flex-col items-center relative z-20 my-auto">
        {/* Heading Coral */}
        <header className="cd-heading cd-heading-coral mb-2">
          <span>Tanda kasih</span>
          <h2>AMPLOP DIGITAL</h2>
          <i aria-hidden="true" />
        </header>

        <p className="text-[12.5px] sm:text-[13px] text-[#524348] text-center max-w-[360px] leading-relaxed mb-5 font-sans">
          Doa restu Anda merupakan karunia yang sangat berarti bagi kami, dan jika memberi adalah ungkapan tanda kasih, Anda dapat memberi kado secara cashless.
        </p>

        {/* Gift List Wrap (Border-free soft paper cards) */}
        <div className="w-full flex flex-col gap-4">
          {/* Physical Gift Card */}
          <div className="rounded-3xl bg-white/95 p-5 sm:p-6 shadow-[0_10px_35px_rgba(74,66,56,0.08)] flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-5 cd-tape-pink -rotate-1 rounded-xs shadow-xs pointer-events-none" />

            <p className="text-[17px] font-bold text-[#cc3a63] font-heading mt-1">
              Kirim Kado Fisik
            </p>
            <p className="text-[12.5px] text-[#524348] mt-1 leading-relaxed max-w-[300px]">
              {physicalGiftAddress}
            </p>
            <button
              type="button"
              onClick={() => handleCopy(physicalGiftAddress, 'Alamat pengiriman', 'address')}
              className="mt-3.5 inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#f9f0e0] text-[#2b2620] text-[12px] font-bold shadow-xs hover:bg-[#edd9bf] active:translate-y-0.5 transition-all cursor-pointer"
            >
              {copiedId === 'address' ? (
                <>
                  <Check className="w-4 h-4 text-[#8b965f]" />
                  <span>Alamat Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#cc3a63]" />
                  <span>Salin Alamat</span>
                </>
              )}
            </button>
          </div>

          {/* Bank Cards */}
          {activeBanks.map((bank) => {
            const isCopied = copiedId === bank.id;
            return (
              <div
                key={bank.id}
                className="rounded-3xl bg-white/95 p-5 sm:p-6 shadow-[0_10px_35px_rgba(74,66,56,0.08)] flex flex-col items-center text-center relative overflow-hidden"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-5 cd-tape-sage rotate-1 rounded-xs shadow-xs pointer-events-none" />

                <p className="text-[17px] font-bold text-[#cc3a63] font-heading mt-1">
                  {bank.bankName}
                </p>
                <p className="text-[20px] sm:text-[22px] font-mono font-black text-[#2b2620] tracking-wider mt-0.5">
                  {bank.accountNumber}
                </p>
                <p className="text-[12.5px] font-medium text-[#7a7065] mt-0.5">
                  a.n. {bank.holderName || bank.accountHolder}
                </p>

                <button
                  type="button"
                  onClick={() => handleCopy(bank.accountNumber, `No. Rekening ${bank.bankName}`, bank.id)}
                  className="mt-3.5 inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#f9f0e0] text-[#2b2620] text-[12px] font-bold shadow-xs hover:bg-[#edd9bf] active:translate-y-0.5 transition-all cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 text-[#8b965f]" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#cc3a63]" />
                      <span>Salin No. Rekening</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
