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
  badgeBg: string;
  badgeText: string;
  btnBg: string;
  btnText: string;
}

export interface VideoConfig {
  youtubeUrl: string;
  title: string;
  subtitle: string;
}

export interface CouplePerson {
  name: string;
  nickname: string;
  role: string;
  instagram: string;
  image: string;
  alt: string;
}

export interface CoupleData {
  groom: CouplePerson;
  bride: CouplePerson;
  weddingDate: string;
  weddingCity: string;
  targetTimestamp: number;
  audioUrl: string;
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

