import React, { useState, useEffect } from 'react';
import { MapPin, Sparkles, Heart } from 'lucide-react';
import { COUPLE_DATA, EVENTS_DATA, DOODLE_ASSETS } from '../data/weddingData';
import { CoupleData, EventDetail } from '../types';

interface CountdownAndEventsProps {
  couple?: CoupleData;
  events?: EventDetail[];
}

export const CountdownAndEvents: React.FC<CountdownAndEventsProps> = ({ couple, events }) => {
  const activeCouple = couple || COUPLE_DATA;
  const activeEvents = events || EVENTS_DATA;

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = Math.max(0, activeCouple.targetTimestamp - now);

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [activeCouple.targetTimestamp]);

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan%20${encodeURIComponent(
    `${activeCouple.groom.nickname} & ${activeCouple.bride.nickname}`
  )}&dates=20270214T090000/20270214T140000&details=${encodeURIComponent(
    `Pernikahan ${activeCouple.groom.name} & ${activeCouple.bride.name}`
  )}&location=${encodeURIComponent('Graha Manggala Siliwangi, Bandung')}`;

  return (
    <div className="w-full flex flex-col items-center">
      {/* ============================================================ */}
      {/* 1. SECTION: SAVE THE DATE (FULL-PAGE MOBILE FRIENDLY)        */}
      {/* ============================================================ */}
      <section
        id="save-date"
        className="min-h-dvh w-full px-4 py-8 flex flex-col items-center justify-center relative overflow-hidden"
      >
        {/* Floating Random Doodle Assets */}
        <img
          src={DOODLE_ASSETS.calendar}
          alt=""
          aria-hidden="true"
          className="absolute top-5 left-3 w-14 sm:w-16 h-14 sm:h-16 object-contain pointer-events-none opacity-90 animate-doodle-float z-10"
        />
        <img
          src={DOODLE_ASSETS.heartBalloons}
          alt=""
          aria-hidden="true"
          className="absolute top-6 right-3 w-16 sm:w-20 h-16 sm:h-20 object-contain pointer-events-none opacity-90 animate-doodle-slow z-10"
        />
        <img
          src={DOODLE_ASSETS.rings}
          alt=""
          aria-hidden="true"
          className="absolute bottom-6 left-4 w-12 sm:w-14 h-12 sm:h-14 object-contain pointer-events-none opacity-85 animate-doodle-sway z-10"
        />
        <img
          src={DOODLE_ASSETS.envelopes}
          alt=""
          aria-hidden="true"
          className="absolute bottom-6 right-4 w-12 sm:w-14 h-12 sm:h-14 object-contain pointer-events-none opacity-85 animate-doodle-bob z-10"
        />

        <div className="w-full max-w-[400px] rounded-3xl bg-[#8b965f] p-6 sm:p-8 shadow-[0_14px_45px_rgba(139,150,95,0.25)] text-center flex flex-col items-center relative z-20 my-auto overflow-hidden">
          {/* Top Washi Tape */}
          <div
            className="absolute -top-3 w-28 h-6 cd-tape-pink -rotate-1 rounded-xs shadow-xs pointer-events-none"
            aria-hidden="true"
          />

          {/* Header Cream */}
          <header className="cd-heading cd-heading-cream mb-4 mt-1">
            <span>Menghitung hari</span>
            <h2>SAVE THE DATE</h2>
            <i aria-hidden="true" />
          </header>

          {/* 4 Countdown Cells (Border-free soft boxes) */}
          <div className="grid grid-cols-4 gap-2.5 w-full mb-6" role="timer" aria-label="Hitung mundur acara">
            <div className="rounded-2xl bg-white/95 p-3 shadow-sm flex flex-col items-center">
              <span className="text-[26px] sm:text-[30px] font-black text-[#cc3a63] font-heading leading-tight">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10.5px] font-bold text-[#7a7065] uppercase mt-0.5">Hari</span>
            </div>

            <div className="rounded-2xl bg-white/95 p-3 shadow-sm flex flex-col items-center">
              <span className="text-[26px] sm:text-[30px] font-black text-[#cc3a63] font-heading leading-tight">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10.5px] font-bold text-[#7a7065] uppercase mt-0.5">Jam</span>
            </div>

            <div className="rounded-2xl bg-white/95 p-3 shadow-sm flex flex-col items-center">
              <span className="text-[26px] sm:text-[30px] font-black text-[#cc3a63] font-heading leading-tight">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10.5px] font-bold text-[#7a7065] uppercase mt-0.5">Menit</span>
            </div>

            <div className="rounded-2xl bg-white/95 p-3 shadow-sm flex flex-col items-center">
              <span className="text-[26px] sm:text-[30px] font-black text-[#cc3a63] font-heading leading-tight">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10.5px] font-bold text-[#7a7065] uppercase mt-0.5">Detik</span>
            </div>
          </div>

          {/* Add to Google Calendar Pill */}
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-[#2b2620] text-[13px] font-bold shadow-md hover:bg-[#f9f0e0] active:translate-y-0.5 transition-all cursor-pointer"
          >
            <span>📅 Tambahkan ke Google Calendar</span>
          </a>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. SECTION: DETAIL ACARA (FULL-PAGE MOBILE FRIENDLY)         */}
      {/* ============================================================ */}
      <section
        id="acara"
        className="min-h-dvh w-full px-4 py-8 flex flex-col items-center justify-center relative overflow-hidden"
      >
        {/* Floating Random Doodle Assets */}
        <img
          src={DOODLE_ASSETS.toast}
          alt=""
          aria-hidden="true"
          className="absolute top-5 left-3 w-14 sm:w-16 h-14 sm:h-16 object-contain pointer-events-none opacity-85 animate-doodle-bob z-10"
        />
        <img
          src={DOODLE_ASSETS.bells}
          alt=""
          aria-hidden="true"
          className="absolute top-5 right-3 w-14 sm:w-16 h-14 sm:h-16 object-contain pointer-events-none opacity-85 animate-doodle-sway z-10"
        />
        <img
          src={DOODLE_ASSETS.bouquet}
          alt=""
          aria-hidden="true"
          className="absolute bottom-5 left-4 w-12 sm:w-14 h-12 sm:h-14 object-contain pointer-events-none opacity-85 animate-doodle-float z-10"
        />
        <img
          src={DOODLE_ASSETS.heartArrow}
          alt=""
          aria-hidden="true"
          className="absolute bottom-5 right-4 w-12 sm:w-14 h-12 sm:h-14 object-contain pointer-events-none opacity-85 animate-doodle-slow z-10"
        />

        <div className="w-full max-w-[420px] flex flex-col items-center relative z-20 my-auto">
          {/* Header Coral */}
          <header className="cd-heading cd-heading-coral mb-2">
            <span>Rangkaian prosesi</span>
            <h2>Detail Acara</h2>
            <i aria-hidden="true" />
          </header>

          <p className="text-[12.5px] sm:text-[13px] text-[#524348] text-center max-w-[360px] mb-5 font-sans">
            Kebahagiaan kami akan terasa lengkap dengan kehadiran Anda.
          </p>

          {/* Event Cards (Border-free clean paper cards) */}
          <div className="w-full flex flex-col gap-5">
            {activeEvents.map((evt, idx) => {
              const isAkad = evt.id === 'akad';
              const doodleIcon = isAkad ? DOODLE_ASSETS.toast : DOODLE_ASSETS.bells;
              const eventNumber = String(idx + 1).padStart(2, '0');

              return (
                <article
                  key={evt.id}
                  className="relative rounded-3xl bg-white/95 p-6 sm:p-7 shadow-[0_10px_35px_rgba(74,66,56,0.08)] flex flex-col items-center text-center overflow-hidden"
                >
                  {/* Top Washi Tape */}
                  <div
                    className={`absolute -top-3 w-24 h-5 ${isAkad ? 'cd-tape-pink -rotate-1' : 'cd-tape-sage rotate-1'} rounded-xs shadow-xs pointer-events-none`}
                    aria-hidden="true"
                  />

                  {/* Event Doodle Top */}
                  <img
                    src={doodleIcon}
                    alt=""
                    aria-hidden="true"
                    className="w-12 sm:w-14 h-12 sm:h-14 object-contain mb-1 mt-1 animate-doodle-slow"
                  />

                  {/* Event Number Badge */}
                  <span className="text-[11.5px] font-bold text-[#cc3a63] font-heading tracking-widest block mb-0.5">
                    {eventNumber}
                  </span>

                  {/* Event Title */}
                  <h3 className="text-[20px] sm:text-[22px] font-bold text-[#2b2620] font-heading">
                    {evt.title}
                  </h3>

                  <strong className="text-[14px] text-[#cc3a63] font-bold mt-1 block">
                    {evt.date}
                  </strong>

                  <p className="text-[12.5px] font-semibold text-[#524348] mt-0.5">
                    {evt.time}
                  </p>

                  {/* Hand-drawn divider rule */}
                  <div className="w-16 h-0.5 bg-[#4a4238]/15 my-2.5" />

                  <b className="text-[14.5px] font-bold text-[#2b2620] block">
                    {evt.locationName}
                  </b>

                  <small className="text-[12px] text-[#7a7065] mt-1 max-w-[280px] leading-relaxed block">
                    {evt.address}
                  </small>

                  {/* Maps Location Pill */}
                  <a
                    href={evt.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3.5 inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-full bg-[#cc3a63] text-white text-[12.5px] font-bold shadow-[0_4px_14px_rgba(204,58,99,0.3)] hover:bg-[#b52f53] active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Lihat Lokasi</span>
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
