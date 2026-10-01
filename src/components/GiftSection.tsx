import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { BANK_ACCOUNTS, DEFAULT_GIFT_ADDRESS } from '../data/weddingData';
import { BankAccount } from '../types';
import { SectionHeading } from './DoodleIcons';
import { DoodleScatter } from './DoodleScatter';

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
      aria-label="Amplop Digital"
      className="mobile-snap-section w-full px-4 py-6 flex flex-col items-center justify-center relative isolate overflow-hidden select-none"
    >
      <DoodleScatter seed="gift" prefer={['giftBox', 'envelopes']} />

      <div className="w-full max-w-[400px] flex flex-col items-center my-auto animate-doodle-in">
        <SectionHeading
          subheadline="Tanda kasih"
          headline="AMPLOP DIGITAL"
          subheadlineColor="#B4533C"
          headlineColor="#181818"
          underlineColor="#B4533C"
          className="mb-1.5"
        />

        <p className="text-[12.5px] text-stone-700 text-center max-w-[340px] leading-relaxed mb-4 font-normal">
          Doa restu Anda merupakan karunia yang sangat berarti bagi kami, dan jika memberi adalah ungkapan tanda kasih, Anda dapat memberi kado secara cashless.
        </p>

        <div className="w-full flex flex-col gap-3.5">
          {/* Bank Accounts */}
          {activeBanks.map((bank) => {
            const isCopied = copiedId === bank.id;
            return (
              <div
                key={bank.id}
                className="w-full doodle-card p-4 sm:p-5 flex flex-col items-center text-center relative"
              >
                <span className="font-delicious text-[20px] font-bold text-[#181818] tracking-wider uppercase">
                  BANK {bank.bankName}
                </span>

                <p className="font-mono text-[18px] sm:text-[20px] font-black text-[#181818] tracking-widest mt-0.5">
                  {bank.accountNumber}
                </p>

                <p className="text-[11.5px] font-medium text-stone-600">
                  a.n. {bank.holderName || bank.accountHolder}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      bank.accountNumber,
                      `No. Rekening ${bank.bankName}`,
                      bank.id
                    )
                  }
                  className="mt-2.5 inline-flex items-center gap-1.5 px-5 py-1.5 rounded-full bg-[#EFE3C6] border-[2px] border-[#181818] shadow-[2.5px_2.5px_0px_#181818] text-[#181818] text-[11.5px] font-bold hover:bg-[#e4dac1] active:translate-y-0.5 transition-all cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#3E5B3D]" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#B4533C]" />
                      <span>Salin No. Rekening</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}

          {/* Physical Gift Card */}
          <div className="w-full doodle-card p-4 sm:p-5 flex flex-col items-center text-center relative">
            <span className="font-delicious text-[19px] font-bold text-[#181818] tracking-wider uppercase">
              Kirim Kado Fisik
            </span>

            <p className="text-[12px] text-stone-700 mt-1 leading-relaxed max-w-[300px]">
              {physicalGiftAddress}
            </p>

            <button
              type="button"
              onClick={() => handleCopy(physicalGiftAddress, 'Alamat', 'address')}
              className="mt-2.5 inline-flex items-center gap-1.5 px-5 py-1.5 rounded-full bg-[#EFE3C6] border-[2px] border-[#181818] shadow-[2.5px_2.5px_0px_#181818] text-[#181818] text-[11.5px] font-bold hover:bg-[#e4dac1] active:translate-y-0.5 transition-all cursor-pointer"
            >
              {copiedId === 'address' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#3E5B3D]" />
                  <span>Alamat Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#B4533C]" />
                  <span>Salin Alamat</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
