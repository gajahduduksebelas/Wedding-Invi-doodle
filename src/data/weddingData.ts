import { EventDetail, GalleryPhoto, BankAccount, Wish, VideoConfig, CoupleData } from '../types';

export const DOODLE_ASSETS = {
  loveBirds: 'https://dev.janjiharmoni.id/themes/cute-doodle/doodle-love-birds.webp',
  heartBalloons: 'https://dev.janjiharmoni.id/themes/cute-doodle/doodle-heart-balloons.webp',
  loveBorder: 'https://dev.janjiharmoni.id/themes/cute-doodle/love-border.png',
  rings: 'https://dev.janjiharmoni.id/themes/cute-doodle/doodle-rings.webp',
  floralBanner: 'https://dev.janjiharmoni.id/themes/cute-doodle/floral-banner.webp',
  calendar: 'https://dev.janjiharmoni.id/themes/cute-doodle/doodle-calendar.webp',
  toast: 'https://dev.janjiharmoni.id/themes/cute-doodle/doodle-toast.webp',
  bells: 'https://dev.janjiharmoni.id/themes/cute-doodle/doodle-bells.webp',
  heartArrow: 'https://dev.janjiharmoni.id/themes/cute-doodle/doodle-heart-arrow.webp',
  bouquet: 'https://dev.janjiharmoni.id/themes/cute-doodle/doodle-bouquet.webp',
  envelopes: 'https://dev.janjiharmoni.id/themes/cute-doodle/doodle-envelopes.webp',
  giftMail: 'https://dev.janjiharmoni.id/themes/cute-doodle/doodle-gift-mail.webp',
  floralEnvelope: 'https://dev.janjiharmoni.id/themes/cute-doodle/floral-envelope.webp',
};

export const COUPLE_DATA: CoupleData = {
  groom: {
    name: 'Arga Pratama Wijaya',
    nickname: 'Arga',
    role: 'Putra Pertama dari Bapak Surya Wijaya & Ibu Ratih Purnamasari',
    instagram: 'argapratama',
    image: 'https://dev.janjiharmoni.id/themes/cute-doodle/groom.webp',
    alt: 'Arga Pratama Wijaya',
  },
  bride: {
    name: 'Kirana Maharani Putri',
    nickname: 'Kirana',
    role: 'Putri Kedua dari Bapak Dimas Hartono & Ibu Lestari Handayani',
    instagram: 'kiranamaharani',
    image: 'https://dev.janjiharmoni.id/themes/cute-doodle/bride.webp',
    alt: 'Kirana Maharani Putri',
  },
  weddingDate: 'Minggu, 14 Februari 2027',
  weddingCity: 'Bandung',
  targetTimestamp: new Date('2027-02-14T09:00:00+07:00').getTime(),
  audioUrl: 'https://dev.janjiharmoni.id/themes/cute-doodle/music.mp3',
  audioTitle: 'Cute Doodle Theme Song',
  loveStory: [
    {
      id: 'story-1',
      stepNumber: 1,
      label: 'Awal Cerita',
      title: 'Pertama kali bertemu',
      text: 'Kisah kami dimulai tanpa rencana. Sebuah perkenalan membawa kami pada banyak percakapan, pertemuan, dan momen sederhana yang perlahan terasa istimewa.',
    },
    {
      id: 'story-2',
      stepNumber: 2,
      label: 'Lamaran',
      title: 'Menjalin cerita',
      text: 'Setelah melewati berbagai perjalanan bersama, kami semakin yakin untuk membawa hubungan ini menuju masa depan. Di hadapan keluarga, kami menyampaikan niat dan mengikat komitmen untuk melangkah bersama.',
    },
    {
      id: 'story-3',
      stepNumber: 3,
      label: 'Pernikahan',
      title: 'Menuju babak baru',
      text: 'Dengan penuh syukur, kami tiba pada awal perjalanan baru. Bukan sebagai akhir dari kisah cinta, tetapi sebagai permulaan untuk tumbuh, berbagi, dan membangun kehidupan bersama.',
    },
  ],
  liveStream: {
    enabled: true,
    platformUrl: 'https://youtube.com/live/argakirana',
    date: 'Minggu, 14 Februari 2027',
    time: '09:00',
    timezone: 'WIB',
  },
};

export const EVENTS_DATA: EventDetail[] = [
  {
    id: 'akad',
    type: 'akad',
    title: 'Akad Nikah',
    badge: '01',
    badgeBg: 'bg-[#cc3a63]',
    badgeText: 'text-white',
    date: 'Minggu, 14 Februari 2027',
    time: '09:00 WIB',
    locationName: 'Graha Manggala Siliwangi',
    address: 'Jl. Aceh No. 66, Merdeka, Kota Bandung, Jawa Barat',
    mapsUrl: 'https://maps.google.com/maps?q=Graha+Manggala+Siliwangi+Bandung',
  },
  {
    id: 'resepsi',
    type: 'resepsi',
    title: 'Resepsi',
    badge: '02',
    badgeBg: 'bg-[#a2ab73]',
    badgeText: 'text-[#2b2620]',
    date: 'Minggu, 14 Februari 2027',
    time: '11:00 WIB',
    locationName: 'Graha Manggala Siliwangi',
    address: 'Jl. Aceh No. 66, Merdeka, Kota Bandung, Jawa Barat',
    mapsUrl: 'https://maps.google.com/maps?q=Graha+Manggala+Siliwangi+Bandung',
  },
];

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'photo-1',
    title: 'Galeri pernikahan 1',
    src: 'https://dev.janjiharmoni.id/themes/cute-doodle/1.webp',
    alt: 'Galeri pernikahan 1',
    rotation: '-rotate-2',
  },
  {
    id: 'photo-2',
    title: 'Galeri pernikahan 2',
    src: 'https://dev.janjiharmoni.id/themes/cute-doodle/2.webp',
    alt: 'Galeri pernikahan 2',
    rotation: 'rotate-2',
  },
  {
    id: 'photo-3',
    title: 'Galeri pernikahan 3',
    src: 'https://dev.janjiharmoni.id/themes/cute-doodle/3.webp',
    alt: 'Galeri pernikahan 3',
    rotation: '-rotate-1',
  },
  {
    id: 'photo-4',
    title: 'Galeri pernikahan 4',
    src: 'https://dev.janjiharmoni.id/themes/cute-doodle/4.webp',
    alt: 'Galeri pernikahan 4',
    rotation: 'rotate-2',
  },
  {
    id: 'photo-5',
    title: 'Galeri pernikahan 5',
    src: 'https://dev.janjiharmoni.id/themes/cute-doodle/5.webp',
    alt: 'Galeri pernikahan 5',
    rotation: '-rotate-2',
  },
  {
    id: 'photo-6',
    title: 'Galeri pernikahan 6',
    src: 'https://dev.janjiharmoni.id/themes/cute-doodle/6.webp',
    alt: 'Galeri pernikahan 6',
    rotation: 'rotate-1',
  },
  {
    id: 'photo-7',
    title: 'Galeri pernikahan 7',
    src: 'https://dev.janjiharmoni.id/themes/cute-doodle/7.webp',
    alt: 'Galeri pernikahan 7',
    rotation: '-rotate-1',
  },
  {
    id: 'photo-8',
    title: 'Galeri pernikahan 8',
    src: 'https://dev.janjiharmoni.id/themes/cute-doodle/8.webp',
    alt: 'Galeri pernikahan 8',
    rotation: 'rotate-2',
  },
  {
    id: 'photo-9',
    title: 'Galeri pernikahan 9',
    src: 'https://dev.janjiharmoni.id/themes/cute-doodle/9.webp',
    alt: 'Galeri pernikahan 9',
    rotation: '-rotate-2',
  },
  {
    id: 'photo-10',
    title: 'Galeri pernikahan 10',
    src: 'https://dev.janjiharmoni.id/themes/cute-doodle/10.webp',
    alt: 'Galeri pernikahan 10',
    rotation: 'rotate-1',
  },
];

export const BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'bca',
    bankName: 'BCA',
    accountNumber: '9876543210',
    holderName: 'a.n. Kirana Maharani Putri',
    badgeBg: 'bg-[#fcecf0]',
    badgeText: 'text-[#cc3a63]',
    btnBg: 'bg-[#cc3a63]',
    btnText: 'text-white',
  },
];

export const INITIAL_WISHES: Wish[] = [
  {
    id: 'w-1',
    name: 'Budi & Maya',
    status: 'Hadir',
    message: "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fii khair. Selamat menempuh hidup baru Arga & Kirana! Bahagia selamanya ❤️",
    createdAt: 'Baru saja',
    guestCount: 2,
  },
  {
    id: 'w-2',
    name: 'Dinda Lestari',
    status: 'Hadir',
    message: 'Selamat Kirana & Kak Arga! Semoga menjadi keluarga yang sakinah mawaddah warahmah, lancar acaranya sampai hari H! 🌸',
    createdAt: '15 menit lalu',
    guestCount: 1,
  },
  {
    id: 'w-3',
    name: 'Reno Pratama',
    status: 'Hadir',
    message: 'Congrats bro Arga & Kirana! Turut berbahagia untuk kalian berdua. See you on the big day!',
    createdAt: '1 jam lalu',
    guestCount: 2,
  },
];

export const DEFAULT_VIDEO_CONFIG: VideoConfig = {
  directVideoUrl: 'https://dev.janjiharmoni.id/themes/shared/gallery-video.webm',
  youtubeUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
  embedUrl: 'https://dev.janjiharmoni.id/themes/shared/gallery-video.webm',
  title: 'Video Prewedding',
  subtitle: 'Momen manis dan hangat perjalanan cinta Kirana & Arga.',
};

export const PRESET_VIDEOS = [
  {
    label: 'Cute Romantic Prewedding (Default Video)',
    url: 'https://dev.janjiharmoni.id/themes/shared/gallery-video.webm',
  },
  {
    label: 'Cinematic Prewedding Outdoor Nature',
    url: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
  },
  {
    label: 'Romantic Minimalist Studio',
    url: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
  },
];

export const DEFAULT_GIFT_ADDRESS = 'Graha Manggala Siliwangi, Jl. Aceh No. 66, Merdeka, Kota Bandung, Jawa Barat';

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = cleanUrl.match(regExp);
  if (match && match[1]) {
    return match[1];
  }
  if (cleanUrl.length === 11 && !cleanUrl.includes('/') && !cleanUrl.includes('.')) {
    return cleanUrl;
  }
  return null;
}
