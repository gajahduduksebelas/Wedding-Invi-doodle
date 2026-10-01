import { WhatsAppGuest } from '../types';

export interface WhatsAppTemplateItem {
  id: string;
  name: string;
  category: 'formal' | 'casual' | 'family';
  text: string;
}

export const DEFAULT_WA_TEMPLATES: WhatsAppTemplateItem[] = [
  {
    id: 'formal',
    name: '1. Formal & Sopan (Rekomendasi)',
    category: 'formal',
    text: `Kepada Yth.
*Bpk/Ibu/Saudara/i {nama}*
di Tempat

_Assalamu’alaikum Warahmatullahi Wabarakatuh_

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada pernikahan kami:

💍 *{pasangan}*
📅 *{tanggal}*
📍 *{lokasi}*

Berikut tautan undangan digital kami untuk melihat jadwal lengkap acara, denah lokasi, serta konfirmasi kehadiran (RSVP):
👉 *{link}*

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Terima kasih banyak atas perhatian dan doanya.
_Wassalamu’alaikum Warahmatullahi Wabarakatuh_

Hormat kami,
*{pasangan}* & Keluarga`,
  },
  {
    id: 'casual',
    name: '2. Teman / Sahabat (Akrab & Santai)',
    category: 'casual',
    text: `Halo *{nama}*! 👋✨

Alhamdulillah kabar bahagia! InsyaAllah kami berdua akan melangsungkan pernikahan:

💍 *{pasangan}*
📅 *{tanggal}*
📍 *{lokasi}*

Buka link undangan digital di bawah ini untuk melihat detail acara, video prewedding, dan rute lokasi ya:
👉 *{link}*

Kehadiran dan doa restumu sangat berarti untuk kami. Jangan lupa konfirmasi kehadiranmu di web yaa! See you there! ❤️🥂`,
  },
  {
    id: 'family',
    name: '3. Kerabat & Keluarga Besar',
    category: 'family',
    text: `_Bismillahirrohmanirrohim_
Kepada Yth. Keluarga Besar *{nama}*

Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu sekeluarga untuk menghadiri acara pernikahan putra-putri kami:

🌸 *{pasangan}*
📅 *{tanggal}*
📍 *{lokasi}*

Undangan lengkap beserta peta lokasi & buku tamu dapat diakses melalui link berikut:
🔗 *{link}*

Mohon doa restu agar menjadi keluarga yang sakinah, mawaddah, dan warahmah.

Salam hangat,
Keluarga Besar *{pasangan}*`,
  },
];

export const INITIAL_WA_GUESTS: WhatsAppGuest[] = [
  {
    id: 'g-1',
    name: 'Bapak Ir. Hendra & Keluarga',
    phone: '081234567890',
    category: 'VIP',
    session: 'Akad & Resepsi',
    status: 'pending',
    notes: 'Keluarga kerabat dekat',
  },
  {
    id: 'g-2',
    name: 'Budi Santoso & Partner',
    phone: '085712345678',
    category: 'Sahabat',
    session: 'Resepsi',
    status: 'pending',
    notes: 'Teman sekampus teknik',
  },
  {
    id: 'g-3',
    name: 'Ibu Hj. Aminah & Rekan',
    phone: '081987654321',
    category: 'Keluarga',
    session: 'Akad & Resepsi',
    status: 'pending',
    notes: 'Pengajian komplek',
  },
  {
    id: 'g-4',
    name: 'Dimas Setiawan',
    phone: '081398765432',
    category: 'Rekan Kerja',
    session: 'Resepsi',
    status: 'pending',
    notes: 'Rekan tim kantor',
  },
  {
    id: 'g-5',
    name: 'Rian Prasetya & Istri',
    phone: '087812345678',
    category: 'Sahabat',
    session: 'Resepsi',
    status: 'pending',
    notes: 'Sahabat SMA',
  },
];

/**
 * Sanitize and format phone number for WhatsApp (Indonesian international standard 628...)
 */
export function formatWhatsAppPhone(rawPhone: string): string {
  if (!rawPhone) return '';
  // Remove spaces, hyphens, plus signs, brackets, dots
  let cleaned = rawPhone.replace(/[\s\-\+\(\)\.]/g, '');

  // If starts with '08', change to '628'
  if (cleaned.startsWith('08')) {
    cleaned = '62' + cleaned.slice(1);
  } else if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned;
  } else if (cleaned.startsWith('+62')) {
    cleaned = cleaned.slice(1);
  }

  return cleaned;
}

/**
 * Generate personal invitation URL for a guest
 */
export function generateGuestUrl(guestName: string): string {
  if (typeof window === 'undefined') {
    return `https://undangan.example.com/?to=${encodeURIComponent(guestName)}`;
  }
  // Always link to the invitation's public address (the canonical URL in
  // index.html), even when the CMS is opened on a preview or local address.
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;
  const base = canonical ? new URL(canonical) : window.location;
  return `${base.origin}${base.pathname}?to=${encodeURIComponent(guestName)}`;
}

/**
 * Format message with dynamic placeholders
 */
export function composeWhatsAppMessage(
  template: string,
  variables: {
    nama: string;
    link: string;
    pasangan: string;
    tanggal: string;
    lokasi: string;
    sesi?: string;
  }
): string {
  let message = template;
  message = message.replace(/{nama}/g, variables.nama || 'Tamu Undangan');
  message = message.replace(/{link}/g, variables.link || '');
  message = message.replace(/{pasangan}/g, variables.pasangan || 'kedua mempelai');
  message = message.replace(/{tanggal}/g, variables.tanggal || '');
  message = message.replace(/{lokasi}/g, variables.lokasi || '');
  message = message.replace(/{sesi}/g, variables.sesi || 'Akad & Resepsi');
  return message;
}

/**
 * Build wa.me or API URL to open WhatsApp directly
 */
export function buildWhatsAppLink(phone: string, message: string): string {
  const formattedPhone = formatWhatsAppPhone(phone);
  const encodedText = encodeURIComponent(message);
  if (formattedPhone) {
    return `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedText}`;
  }
  return `https://api.whatsapp.com/send?text=${encodedText}`;
}
