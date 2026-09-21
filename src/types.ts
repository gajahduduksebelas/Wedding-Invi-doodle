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
