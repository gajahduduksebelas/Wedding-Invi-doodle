export interface Wish {
  id: string;
  name: string;
  status: 'Hadir' | 'Masih Ragu' | 'Tidak Hadir';
  message: string;
  createdAt: string;
  guestCount?: number;
}

export interface EventDetail {
  id: string;
  type: 'akad' | 'resepsi';
  title: string;
  badge: string;
  badgeBg: string;
  badgeText: string;
  date: string;
  time: string;
  locationName: string;
  address: string;
  mapsUrl: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  src: string;
  alt: string;
  rotation: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  holderName: string;
  accountHolder?: string;
  badgeBg: string;
  badgeText: string;
  btnBg: string;
  btnText: string;
}

export interface VideoConfig {
  sourceType?: 'youtube' | 'upload' | 'direct';
  youtubeUrl: string;
  directVideoUrl?: string;
  embedUrl?: string;
  videoFileName?: string;
  title: string;
  subtitle: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export interface CouplePerson {
  name: string;
  nickname: string;
  role: string;
  instagram: string;
  image: string;
  alt: string;
}

export interface LoveStoryItem {
  id: string;
  stepNumber: number;
  label: string;
  title: string;
  text: string;
}

export interface LiveStreamConfig {
  enabled: boolean;
  platformUrl: string;
  date: string;
  time: string;
  timezone: string;
}

export interface CoupleData {
  groom: CouplePerson;
  bride: CouplePerson;
  weddingDate: string;
  weddingCity: string;
  targetTimestamp: number;
  audioUrl: string;
  audioFileName?: string;
  audioTitle?: string;
  loveStory?: LoveStoryItem[];
  liveStream?: LiveStreamConfig;
}

export interface DressCodeColor {
  id: string;
  name: string;
  hex: string;
}

export interface DressCodeConfig {
  enabled: boolean;
  /** Outfit style, e.g. "Semi Formal · Batik / Kebaya Modern". */
  attire: string;
  description: string;
  colors: DressCodeColor[];
  /** Colors guests are asked not to wear (e.g. white, reserved for the bride). */
  avoidColors: DressCodeColor[];
  notes: string[];
}

export interface WhatsAppGuest {
  id: string;
  name: string;
  phone: string;
  category: 'Keluarga' | 'Sahabat' | 'VIP' | 'Rekan Kerja' | 'Tetangga' | 'Umum';
  session: 'Akad & Resepsi' | 'Resepsi' | 'Akad Saja';
  status: 'pending' | 'sent';
  sentAt?: string;
  notes?: string;
}

export interface AppSettings {
  couple: CoupleData;
  events: EventDetail[];
  video: VideoConfig;
  banks: BankAccount[];
  photos: GalleryPhoto[];
  giftAddress: string;
}

// State of the CMS content save to the database, shown by the global save button.
export type SaveStatus = 'idle' | 'pending' | 'saving' | 'saved' | 'error';
