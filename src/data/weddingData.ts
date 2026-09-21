import { EventDetail, GalleryPhoto, BankAccount, Wish, VideoConfig } from '../types';

export const COUPLE_DATA = {
  groom: {
    name: 'Ahmad Fadli, S.T.',
    nickname: 'Ahmad',
    role: 'Putra pertama dari Bpk. Ir. Hendra Gunawan & Ibu Hj. Aminah',
    instagram: 'ahmadfadli',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSSieCXDhIXFK2LzXvL6_Xt1pOJX2_4HFKTTMOX_G_a9wdZjxr8nmF3pRBRWVobD0pMJElq6i41dY-qQAMtYmoAGW1CFOSQEtiQwOlPA8Tr0uGBp7zj7E_W04kILmAHdsj3IzPkjVDmSPOBu0YA_65RlR-PjBnX2DExu3c1plq0T3X8A3D_OA6VtlT5rVDJ6lvDtqzISej9ikY_M_Cf8c3uOrjhiZmlQt3-_kFRQ',
    alt: 'Playful Indonesian groom Ahmad wearing a contemporary cream batik suit, gentle smile, outdoor garden wedding backdrop with soft natural golden sunlight',
  },
  bride: {
    name: 'Siti Nurhaliza, S.Farm.',
    nickname: 'Siti',
    role: 'Putri bungsu dari Bpk. H. Rahmat Hidayat & Ibu Hj. Fatimah',
    instagram: 'sitinurhaliza',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsqc9KK5mPlAQEKIbuB6vc7e18pPu_UoRA5cn0L3LzyVYhjohu2uQPiTqfBpl9ob3PR3enr4eAFUrM649rMzsaYdGpcO8a8oZLf9g9cWaabL91lfMRfSkObNSfVbhgyu7OyBxhWO_IgVg2U1-KpE1uPvViibG7HNkObYDlbW8yQipPv3x465gVvarVzV5kOBVWV_EXduBhQY1dQBpGUjbybK1gLWVl_n08JlsObg',
    alt: 'Indonesian bride Siti wearing modern pastel pink hijab and elegant lace kebaya, joyful candid expression holding a small bouquet of baby\'s breath and pastel roses',
  },
  weddingDate: 'Sabtu, 01 Januari 2027',
  weddingCity: 'Jakarta',
  targetTimestamp: new Date('2027-01-01T08:00:00+07:00').getTime(),
  audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-acoustic-guitar-112191.mp3',
};

export const EVENTS_DATA: EventDetail[] = [
  {
    id: 'akad',
    type: 'akad',
    title: 'Akad Nikah',
    badge: 'Akad Nikah',
    badgeBg: 'bg-[#cc3a63]',
    badgeText: 'text-white',
    date: 'Sabtu, 01 Januari 2027',
    time: '08.00 WIB - Selesai',
    locationName: 'Masjid Raya Al-Ikhlas',
    address: 'Jl. Cipete Raya No. 45, Cilandak, Jakarta Selatan',
    mapsUrl: 'https://maps.google.com/?q=Masjid+Raya+Al-Ikhlas+Cipete+Jakarta',
  },
  {
    id: 'resepsi',
    type: 'resepsi',
    title: 'Resepsi Pernikahan',
    badge: 'Resepsi Pernikahan',
    badgeBg: 'bg-[#a2ab73]',
    badgeText: 'text-[#2b2620]',
    date: 'Sabtu, 01 Januari 2027',
    time: '11.00 WIB - 14.00 WIB',
    locationName: 'Grand Ballroom Hotel Harmoni',
    address: 'Jl. Sudirman Kav. 12, Senayan, Jakarta Pusat',
    mapsUrl: 'https://maps.google.com/?q=Grand+Ballroom+Hotel+Harmoni+Jakarta',
  },
];

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'photo-1',
    title: 'Pertemuan Pertama',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOAcMkxt27HpBRbdagP1mVd_F5X33vaIyHqpsAuiq0LzgrHUI8bu0-0P4R8i_Z3FbE3DYEuH0aYO3TPTsUCWJJPa4YQYE4IKSMhTk2rwt0XKCWLT-XzHoOX8hHqLdbnHjdOpHLFWkCVF10YiPOuemongUqrb8SQ2NBPjMIQ-F0kEhrFkkx2wMqUTqgRyqBuTR940RpDw7Cp9cRBaQtaC1FTipuxi8rJ3wdskEOMg',
    alt: 'Playful engagement portrait of Ahmad and Siti sitting at a rustic outdoor cafe laughing joyfully, pastel colors, vintage film warm tone, organic aesthetic.',
    rotation: '-rotate-1',
  },
  {
    id: 'photo-2',
    title: 'Langkah Bersama',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBL4K01bV9as0w6dO0VX82og9AGXtwF0SOqN2Mh1HtLpUWvaY3yVYNorvivs0E0VVIwBMzucj3CAG2LobmmjuqjK3ZvyHSIMIETjivfRC2pdhvKTxou03pxoAWwwO1LhYkdqyqynbNFFbwa8TpTUsXAWlWQjrkvXt4SzoFJIaOPC4fVfeJLUEqiAxMAe4BpZGy9YBi0tuNpklrHtrxvcuuC38zUiets-Ccnxu6F5w',
    alt: 'Ahmad and Siti walking hand-in-hand along a peaceful pine forest path, couple wearing matching olive green earth-tone sweaters, golden hour rays filtering through trees.',
    rotation: 'rotate-2',
  },
  {
    id: 'photo-3',
    title: 'Hari Lamaran',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEQzXit1Fgsu3ivl3EpU1OumonU9yPoJx6b0wWi4iF39m1m7QFUFHr9lmmegrJc_QQYjW6vzq_YC-lmHoxOt9yjKd2lgXfy22Q9R6ZYOUYYhADuFjaOdEpTicR_7zavIgtrJTCOYlkz99n_3H2AvGjq1mNWo6hfy2GJgUD_2x-gYFZyxMe3E9y1ppCF5Sq39UyqICPvHgK5xwEbQl2yFy6WX3qoHeGYC4BkRI0Xw',
    alt: 'Intimate close up of Ahmad putting a delicate gold engagement ring on Siti\'s finger, gentle smiles, soft cream bokeh background, clean fine-art wedding photograph.',
    rotation: 'rotate-1',
  },
  {
    id: 'photo-4',
    title: 'Kisah Di Balik Hujan',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtHu4wcu3rLQjf0ZOcchKlJaLcZ9Mw16oIz2J24r0TCbb1zx3olhojHfdeZ9Dl0jjirj7yAy6nq_i7lAfXSOZhz-nHpu7z0CUmMnK1UVv7iARloIKaW5nzgtYVDFf9QcjuELDkU6RWR1OlUXUyhhqoQ0phAKRil-ckueyQpEoRQVy1EWLsrmvokQB9tyJ_K_Lbf81FFy_hS21r8I6ILV1iJrh-JmY3Ks-yDIeM-g',
    alt: 'Ahmad and Siti posing playfully under a transparent umbrella in gentle drizzle, smiling under soft ambient street lights, candid aesthetic.',
    rotation: '-rotate-2',
  },
  {
    id: 'photo-5',
    title: 'Taman Cinta',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNdRSM_Hp00nRGx6Yq3hTYrK4dpi1qm7Ponqt5pL4-ZthUSOH58ymgdAZQQWU2Nn-y58ytZk9LpUvpK2XDmpje7TuCH0mEaXNPFcyL4-0aAZ-NY4vCx86ULdTkKs0bj5b_w3Fu_lYWHYwzbXCd-Oi7RodJfHfuGv9P4__43GHU0Ufr_AgK8Aow6ASHxIC9F51eCe18i8c07VhqepuNK4pQC69MYr8U4Y02OrfIGw',
    alt: 'Pre-wedding shoot in a botanical glasshouse conservatory, couple surrounded by lush monstera leaves and pink orchids, soft cinematic pastel daylight.',
    rotation: '-rotate-1',
  },
  {
    id: 'photo-6',
    title: 'Menuju Selamanya',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAX1kdQqaX-STf7nEQMlHSa8x8uFJY0izcrJ3W_8L0f-0bwzywYf5snr7qg_E4vJuEDYddP008ecag-bK500UDQq9xOAueoZf1KAdHNlHaYQqOcwH6KLSajfy7UTBCus1zu6q4tI57AZE4bOPnr1PyQupHr6ipkIovWPhU_mRUSqcDxuAYgftU-IM6BCgcDxmlA8Lr5M3IwCDnpuSRMvXsB4H8vMHUJToSQmpX4MQ',
    alt: 'Silhouetted couple embracing gently on a hill overlooking city sunset lights, warm lavender and peach skies, deeply romantic wedding photography.',
    rotation: 'rotate-1',
  },
];

export const BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'bca',
    bankName: 'Bank BCA',
    accountNumber: '8820491823',
    holderName: 'a.n. Ahmad Fadli',
    badgeBg: 'bg-[#fcecf0]',
    badgeText: 'text-[#cc3a63]',
    btnBg: 'bg-[#cc3a63]',
    btnText: 'text-white',
  },
  {
    id: 'mandiri',
    bankName: 'Bank Mandiri',
    accountNumber: '1370019284712',
    holderName: 'a.n. Siti Nurhaliza',
    badgeBg: 'bg-[#f0f3e3]',
    badgeText: 'text-[#51582f]',
    btnBg: 'bg-[#a2ab73]',
    btnText: 'text-[#2b2620]',
  },
];

export const INITIAL_WISHES: Wish[] = [
  {
    id: 'w-1',
    name: 'Rian & Keluarga',
    status: 'Hadir',
    message: "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fii khair. Selamat menempuh hidup baru Ahmad & Siti!",
    createdAt: 'Baru saja',
    guestCount: 2,
  },
  {
    id: 'w-2',
    name: 'Dina Marlina',
    status: 'Hadir',
    message: 'Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Bahagia selalu sampai kakek nenek! Amin ❤️',
    createdAt: '10 menit lalu',
    guestCount: 1,
  },
  {
    id: 'w-3',
    name: 'Dimas Setiawan & Partner',
    status: 'Hadir',
    message: 'Selamat brader Ahmad dan Siti! Lancar-lancar sampai hari H yaa. See you di Jakarta!',
    createdAt: '1 jam lalu',
    guestCount: 2,
  },
];

export const DEFAULT_VIDEO_CONFIG: VideoConfig = {
  youtubeUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
  title: 'Kisah Kasih & Perjalanan Cinta',
  subtitle: 'Cuplikan momen manis, tawa, dan janji suci perjalanan cinta Ahmad Fadli & Siti Nurhaliza.',
};

export const PRESET_VIDEOS = [
  {
    label: 'Romantic Forest & Nature',
    url: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
  },
  {
    label: 'Acoustic Sunset Moments',
    url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
  },
  {
    label: 'Garden Botanical Teaser',
    url: 'https://www.youtube.com/watch?v=7wtfhZwyrcc',
  },
];

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();
  // Regex supporting youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = cleanUrl.match(regExp);
  if (match && match[1]) {
    return match[1];
  }
  // If user directly pasted 11-char video ID
  if (cleanUrl.length === 11 && !cleanUrl.includes('/') && !cleanUrl.includes('.')) {
    return cleanUrl;
  }
  return null;
}
