import React, { useState, useEffect } from 'react';
import { COUPLE_DATA, EVENTS_DATA } from '../data/weddingData';
import { CoupleData, EventDetail } from '../types';
import {
  DoodleCalendar,
  DoodleToastGlasses,
  DoodleWeddingBells,
  SectionHeading,
} from './DoodleIcons';
import { DoodleScatter } from './DoodleScatter';

interface CountdownAndEventsProps {
  couple?: CoupleData;
  events?: EventDetail[];
}

export const CountdownAndEvents: React.FC<CountdownAndEventsProps> = ({
  couple,
  events,
}) => {
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
    <>
      {/* ============================================================ */}
      {/* 1. SAVE THE DATE SECTION                                     */}
      {/* ============================================================ */}
      <section
        id="save-date"
        aria-label="Hitung Mundur"
        className="mobile-snap-section w-full px-4 py-6 flex flex-col items-center justify-center relative isolate overflow-hidden select-none"
      >
        <DoodleScatter seed="save-date" prefer={['calendar', 'heartBalloons', 'loveLetter']} />

        <div className="w-full max-w-[400px] rounded-[28px] bg-[#EBD9A0] border-[2px] border-dashed border-[#181818] p-6 sm:p-7 relative my-auto animate-doodle-in">
          {/* Hanging Calendar Doodle on Top Right */}
          <div className="absolute -top-6 -right-2 z-10 pointer-events-none">
            <DoodleCalendar className="w-16 sm:w-18 h-auto" />
          </div>

          <SectionHeading
            subheadline="Menghitung hari"
            headline="SAVE THE DATE"
            subheadlineColor="#8D5B4C"
            headlineColor="#181818"
            underlineColor="#8D5B4C"
            className="mb-5 mt-1"
          />

          {/* 4 Countdown Cells */}
          <div
            className="grid grid-cols-4 gap-2.5 w-full mb-6"
            role="timer"
            aria-label="Hitung mundur pernikahan"
          >
            <div className="rounded-2xl bg-white border-[2px] border-[#181818] shadow-[3.5px_3.5px_0px_#181818] py-2.5 px-1 flex flex-col items-center text-center">
              <span className="font-delicious text-[34px] sm:text-[38px] font-black text-[#181818] leading-none">
                {timeLeft.days}
              </span>
              <span className="text-[10px] font-bold text-stone-700 tracking-wider uppercase mt-0.5">
                HARI
              </span>
            </div>

            <div className="rounded-2xl bg-white border-[2px] border-[#181818] shadow-[3.5px_3.5px_0px_#181818] py-2.5 px-1 flex flex-col items-center text-center">
              <span className="font-delicious text-[34px] sm:text-[38px] font-black text-[#181818] leading-none">
                {timeLeft.hours}
              </span>
              <span className="text-[10px] font-bold text-stone-700 tracking-wider uppercase mt-0.5">
                JAM
              </span>
            </div>

            <div className="rounded-2xl bg-white border-[2px] border-[#181818] shadow-[3.5px_3.5px_0px_#181818] py-2.5 px-1 flex flex-col items-center text-center">
              <span className="font-delicious text-[34px] sm:text-[38px] font-black text-[#181818] leading-none">
                {timeLeft.minutes}
              </span>
              <span className="text-[10px] font-bold text-stone-700 tracking-wider uppercase mt-0.5">
                MENIT
              </span>
            </div>

            <div className="rounded-2xl bg-white border-[2px] border-[#181818] shadow-[3.5px_3.5px_0px_#181818] py-2.5 px-1 flex flex-col items-center text-center">
              <span className="font-delicious text-[34px] sm:text-[38px] font-black text-[#181818] leading-none">
                {timeLeft.seconds}
              </span>
              <span className="text-[10px] font-bold text-stone-700 tracking-wider uppercase mt-0.5">
                DETIK
              </span>
            </div>
          </div>

          {/* Add to Google Calendar Pill Button */}
          <div className="w-full flex justify-center">
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-white border-[2px] border-[#181818] shadow-[3.5px_3.5px_0px_#181818] text-[#181818] text-[13px] font-bold hover:bg-[#FAF7EE] active:translate-y-0.5 transition-all cursor-pointer text-center"
            >
              <span>📅 Tambahkan ke Google Calendar</span>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. DETAIL ACARA SECTION                                      */}
      {/* ============================================================ */}
      <section
        id="acara"
        aria-label="Detail Acara"
        className="mobile-snap-section w-full px-4 py-6 flex flex-col items-center justify-center relative isolate overflow-hidden select-none"
      >
        <DoodleScatter seed="acara" prefer={['wineGlasses', 'weddingBells', 'weddingCake']} />

        <div className="w-full max-w-[400px] flex flex-col items-center my-auto animate-doodle-in">
          <SectionHeading
            subheadline="Rangkaian prosesi"
            headline="DETAIL ACARA"
            subheadlineColor="#B4533C"
            headlineColor="#181818"
            underlineColor="#B4533C"
            className="mb-1.5"
          />

          <p className="text-[12.5px] text-stone-700 text-center max-w-[340px] leading-relaxed mb-4 font-normal">
            Kebahagiaan kami akan terasa lengkap dengan kehadiran Anda.
          </p>

          <div className="w-full flex flex-col gap-3.5">
            {activeEvents.map((evt, idx) => {
              const isAkad = evt.id === 'akad' || idx === 0;
              const eventNum = String(idx + 1).padStart(2, '0');

              return (
                <article
                  key={evt.id}
                  className="w-full doodle-card p-4 sm:p-5 flex flex-col items-center text-center relative"
                >
                  {/* Top-Left Order Number */}
                  <span className="absolute top-4 left-5 text-[11px] font-mono font-medium text-stone-400">
                    {eventNum}
                  </span>

                  {/* Top-Right Hand-drawn Doodle */}
                  <div className="absolute top-3.5 right-4 pointer-events-none">
                    {isAkad ? (
                      <DoodleToastGlasses className="w-10 sm:w-12 h-auto" />
                    ) : (
                      <DoodleWeddingBells className="w-10 sm:w-12 h-auto" />
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-[18px] sm:text-[20px] font-bold text-[#181818] tracking-wider uppercase mt-1 mb-0.5">
                    {evt.title}
                  </h3>

                  {/* Date */}
                  <span className="text-[13px] font-bold text-[#B4533C] block">
                    {evt.date}
                  </span>

                  {/* Time */}
                  <span className="text-[12.5px] font-bold text-[#181818] block mt-0.5">
                    {evt.time}
                  </span>

                  {/* Divider line */}
                  <div className="w-12 h-0.5 bg-[#181818]/15 my-2" />

                  {/* Location */}
                  <strong className="text-[13.5px] font-bold text-[#181818] block">
                    {evt.locationName}
                  </strong>

                  <p className="text-[11.5px] text-stone-600 mt-0.5 max-w-[300px] leading-relaxed">
                    {evt.address}
                  </p>

                  {/* Button Lihat Lokasi */}
                  <a
                    href={evt.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center justify-center px-5 py-1.5 rounded-full bg-[#B4533C] text-white border-[2px] border-[#181818] shadow-[3px_3px_0px_#181818] text-[12px] font-bold hover:bg-[#a04630] active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <span>Lihat Lokasi</span>
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};
