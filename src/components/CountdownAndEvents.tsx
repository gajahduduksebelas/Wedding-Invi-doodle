import React, { useState, useEffect } from 'react';
import { Hourglass, Clock, MapPin, Map, Calendar, Sparkles, Building2 } from 'lucide-react';
import { COUPLE_DATA, EVENTS_DATA } from '../data/weddingData';
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

  const createGoogleCalendarLink = (event: EventDetail) => {
    const isAkad = event.id === 'akad';
    const startTime = isAkad ? '20270101T010000Z' : '20270101T040000Z'; // 08:00 WIB and 11:00 WIB in UTC
    const endTime = isAkad ? '20270101T030000Z' : '20270101T070000Z';
    const title = encodeURIComponent(`${event.title}: ${activeCouple.groom.nickname} & ${activeCouple.bride.nickname}`);
    const details = encodeURIComponent(`Pernikahan ${activeCouple.groom.name} & ${activeCouple.bride.name} - ${event.title} di ${event.locationName}`);
    const location = encodeURIComponent(`${event.locationName}, ${event.address}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;
  };

  return (
    <section id="scheduleSection" className="px-4 py-4 flex flex-col items-center">
      <div className="w-full max-w-[420px] flex flex-col gap-4">
        <div className="text-center">
          <span className="text-[12px] font-bold text-[#cc3a63] tracking-widest uppercase block">
            Rangkaian Acara
          </span>
          <h2 className="text-[26px] font-bold text-[#2b2620] font-heading mt-0.5">
            Save The Date
          </h2>
        </div>

        {/* Live Countdown Stamp Card */}
        <div className="rounded-2xl bg-[#a2ab73] p-4 text-[#2b2620] shadow-[3px_4px_0px_#4a4238] border-2 border-[#4a4238] flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Hourglass className="w-4 h-4 text-[#2b2620] animate-bounce" />
            <span className="text-[13px] font-bold uppercase tracking-wider text-[#2b2620]">
              Menghitung Hari Bahagia
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 w-full">
            <div className="rounded-xl bg-white p-2.5 shadow-sm border border-[#4a4238]/30 flex flex-col items-center">
              <span className="text-[24px] font-bold text-[#cc3a63] font-heading leading-tight" id="cdDays">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[11px] font-bold text-[#7a7065] mt-0.5">Hari</span>
            </div>
            <div className="rounded-xl bg-white p-2.5 shadow-sm border border-[#4a4238]/30 flex flex-col items-center">
              <span className="text-[24px] font-bold text-[#cc3a63] font-heading leading-tight" id="cdHours">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[11px] font-bold text-[#7a7065] mt-0.5">Jam</span>
            </div>
            <div className="rounded-xl bg-white p-2.5 shadow-sm border border-[#4a4238]/30 flex flex-col items-center">
              <span className="text-[24px] font-bold text-[#cc3a63] font-heading leading-tight" id="cdMinutes">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[11px] font-bold text-[#7a7065] mt-0.5">Menit</span>
            </div>
            <div className="rounded-xl bg-white p-2.5 shadow-sm border border-[#4a4238]/30 flex flex-col items-center">
              <span className="text-[24px] font-bold text-[#cc3a63] font-heading leading-tight" id="cdSeconds">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[11px] font-bold text-[#7a7065] mt-0.5">Detik</span>
            </div>
          </div>
        </div>

        {/* Event Cards */}
        {activeEvents.map((event) => {
          const isAkad = event.id === 'akad';
          return (
            <div
              key={event.id}
              className="rounded-2xl bg-white p-5 shadow-[3px_4px_0px_#4a4238] border-2 border-[#4a4238] flex flex-col gap-2 relative"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full ${event.badgeBg} ${event.badgeText} text-[12px] font-bold border border-[#4a4238] ${
                    isAkad ? '-rotate-2' : 'rotate-1'
                  }`}
                >
                  {event.badge}
                </span>
                {isAkad ? (
                  <Building2 className="w-5 h-5 text-[#cc3a63]" />
                ) : (
                  <Sparkles className="w-5 h-5 text-[#51582f]" />
                )}
              </div>

              <h3 className="text-[19px] font-bold text-[#2b2620] font-heading mt-1">
                {event.date}
              </h3>

              <p className="text-[13px] font-semibold text-[#524348] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#cc3a63] shrink-0" />
                <span>{event.time}</span>
              </p>

              <div className="text-[13px] text-[#2b2620] flex items-start gap-1.5 mt-0.5">
                <MapPin className="w-4 h-4 text-[#51582f] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#2b2620]">{event.locationName}</strong>
                  <span className="text-[#524348] font-normal leading-snug block">
                    {event.address}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <a
                  href={event.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-[#f9f0e0] text-[#2b2620] text-[13px] font-bold shadow-[2px_2px_0px_#4a4238] border border-[#4a4238] active:translate-x-0.5 active:translate-y-0.5 hover:bg-[#edd9bf] transition-all"
                >
                  <Map className="w-3.5 h-3.5 text-[#cc3a63]" />
                  <span>Buka Maps</span>
                </a>
                <a
                  href={createGoogleCalendarLink(event)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-[#fff7eb] text-[#2b2620] text-[13px] font-bold shadow-[2px_2px_0px_#4a4238] border border-[#4a4238] active:translate-x-0.5 active:translate-y-0.5 hover:bg-[#f9f0e0] transition-all"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#51582f]" />
                  <span>+ Kalender</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
