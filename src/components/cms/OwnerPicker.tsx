import React from 'react';
import { WhatsAppGuest } from '../../types';

type Owner = NonNullable<WhatsAppGuest['owner']>;

interface OwnerPickerProps {
  value: WhatsAppGuest['owner'];
  onChange: (owner: Owner) => void;
  names: { groom: string; bride: string };
  label?: string;
  /** Highlights the picker when the admin tried to continue without choosing. */
  missing?: boolean;
  compact?: boolean;
}

/** "Whose guest is this?" — the groom's or the bride's side. */
export const OwnerPicker: React.FC<OwnerPickerProps> = ({
  value,
  onChange,
  names,
  label = 'Tamu siapa?',
  missing = false,
  compact = false,
}) => (
  <div
    className={`rounded-xl border p-2.5 flex flex-col sm:flex-row sm:items-center gap-2 transition-colors ${
      missing ? 'bg-[#fcecf0] border-[#cc3a63]' : 'bg-white border-[#e6dac5]'
    }`}
    role="radiogroup"
    aria-label={label}
  >
    <span className={`font-bold shrink-0 ${compact ? 'text-[11px] text-[#7a7065] uppercase' : 'text-[12px] text-[#2b2620]'}`}>
      {label}
      {missing && <span className="ml-1 normal-case text-[#cc3a63]">— pilih dulu</span>}
    </span>
    <div className="grid grid-cols-2 gap-1.5 flex-1">
      {(['groom', 'bride'] as Owner[]).map((side) => (
        <button
          key={side}
          type="button"
          role="radio"
          aria-checked={value === side}
          onClick={() => onChange(side)}
          className={`px-3 py-2 rounded-lg text-[12px] font-bold border transition-all cursor-pointer ${
            value === side
              ? 'bg-[#cc3a63] text-white border-[#4a4238] shadow-[2px_2px_0px_#4a4238]'
              : 'bg-[#f9f0e0] text-[#2b2620] border-[#e6dac5] hover:bg-[#edd9bf]'
          }`}
        >
          {value === side ? '✓ ' : ''}Tamu {names[side]}
        </button>
      ))}
    </div>
  </div>
);
