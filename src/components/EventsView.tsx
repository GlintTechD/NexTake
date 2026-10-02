import React, { useMemo, useState } from 'react';
import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react';
import { EVENTS, EVENTS_LAST_CHECKED } from '../data/eventsData';
import {
  formatDate,
  formatDateRange,
  getEventDay,
  getEventMonth,
  getEventStatus,
  getMapsUrl,
  getRegionsWithEvents,
  getStatusLabel,
  getUpcomingEvents,
  toISODate,
  type EventStatus,
} from '../lib/events';
import type { EventRegion, TechEvent } from '../types';

// Every .jpg in src/Pic/events, keyed by path. Events refer to them by file name.
const EVENT_IMAGES = import.meta.glob('../Pic/events/*.jpg', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

interface EventsViewProps {
  onOpenContact?: () => void;
}

type RegionFilter = 'All' | EventRegion;

interface EventItemProps {
  event: TechEvent;
  status: EventStatus;
}

/** Event photo with the start-date tile and the "In 11 days" / "Happening now" pill on top. */
const EventMedia: React.FC<EventItemProps & { priority?: boolean }> = ({ event, status, priority }) => {
  const src = EVENT_IMAGES[`../Pic/events/${event.image}.jpg`];
  const label = status.kind === 'ended' ? null : getStatusLabel(status);

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
      {src && (
        <img
          src={src}
          alt=""
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      )}

      <div
        aria-hidden="true"
        className="absolute left-3 top-3 w-14 overflow-hidden rounded-md bg-white text-center shadow-md"
      >
        <div className="bg-black py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-white">
          {getEventMonth(event.startDate)}
        </div>
        <div className="py-1.5 text-xl font-black leading-none text-black">{getEventDay(event.startDate)}</div>
      </div>

      {label && (
        <span
          className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-bold shadow-sm ${
            status.kind === 'live' ? 'bg-black text-white' : 'bg-white/95 text-black'
          }`}
        >
          {status.kind === 'live' && (
            <span className="h-1.5 w-1.5 rounded-full bg-[#00f2aa] animate-pulse-slow" aria-hidden="true" />
          )}
          {label}
        </span>
      )}
    </div>
  );
};

/** Date range + location lines. The location links to a map search. */
const EventMeta: React.FC<{ event: TechEvent; large?: boolean }> = ({ event, large }) => (
  <ul className={`space-y-2 text-slate-800 ${large ? 'text-base' : 'text-sm'}`}>
    <li className="flex items-start gap-2.5">
      <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
      <span className="font-semibold">{formatDateRange(event.startDate, event.endDate)}</span>
    </li>
    <li className="flex items-start gap-2.5">
      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
      <a
        href={getMapsUrl(event)}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
      >
        {event.venue && (
          <>
            <span className="font-semibold">{event.venue}</span>
            <span className="text-slate-600">, </span>
          </>
        )}
        <span className="text-slate-600">
          {event.city}, {event.country}
        </span>
        <span className="sr-only"> (view on map, opens in a new tab)</span>
      </a>
    </li>
  </ul>
);

/** The large lead card shown above the grid. */
const FeaturedEvent: React.FC<EventItemProps> = ({ event, status }) => (
  <article className="group grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-10">
    <div className="lg:col-span-7">
      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
        <EventMedia event={event} status={status} priority />
      </div>
    </div>

    <div className="lg:col-span-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-bold uppercase tracking-wider">
        <span className="rounded bg-black px-2 py-0.5 text-white">Featured event</span>
        <span className="text-emerald-700">{event.category}</span>
      </div>

      <h2 className="mt-3 text-3xl font-extrabold leading-tight text-black sm:text-4xl">{event.name}</h2>

      <div className="mt-4">
        <EventMeta event={event} large />
      </div>

      <p className="mt-4 text-base leading-relaxed text-slate-700">{event.summary}</p>

      <div className="mt-6">
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded bg-black px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#00c078] hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          Visit event site
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </div>
  </article>
);

/** Grid card. The title link is stretched over the whole card; the map link sits above it. */
const EventCard: React.FC<EventItemProps> = ({ event, status }) => (
  <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow duration-300 hover:shadow-xl">
    <EventMedia event={event} status={status} />

    <div className="flex flex-1 flex-col p-4 sm:p-5">
      <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">{event.category}</div>

      <h3 className="mt-1.5 text-xl font-extrabold leading-snug text-black transition-colors group-hover:text-emerald-700">
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="focus:outline-none after:absolute after:inset-0 focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-emerald-600"
        >
          {event.name}
          <span className="sr-only"> (official site, opens in a new tab)</span>
        </a>
      </h3>

      <div className="mt-3">
        <EventMeta event={event} />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-600">{event.summary}</p>

      <div
        aria-hidden="true"
        className="mt-auto flex items-center gap-1 pt-4 text-xs font-bold text-black transition-colors group-hover:text-emerald-700"
      >
        <span>Visit event site</span>
        <ArrowUpRight className="h-3.5 w-3.5" />
      </div>
    </div>
  </article>
);

export const EventsView: React.FC<EventsViewProps> = ({ onOpenContact }) => {
  const [region, setRegion] = useState<RegionFilter>('All');

  // "Today" is read once per visit; events that have already ended are dropped.
  const todayISO = useMemo(() => toISODate(new Date()), []);
  const upcoming = useMemo(() => getUpcomingEvents(EVENTS, todayISO), [todayISO]);
  const regions = useMemo(() => getRegionsWithEvents(upcoming), [upcoming]);

  const visible = region === 'All' ? upcoming : upcoming.filter((event) => event.region === region);
  const featured =
    region === 'All' ? (upcoming.find((event) => event.featured) ?? upcoming[0]) : undefined;
  const gridEvents = featured ? visible.filter((event) => event.id !== featured.id) : visible;

  const filters: RegionFilter[] = ['All', ...regions];

  return (
    <div className="min-h-screen bg-white font-sans text-black antialiased selection:bg-[#00c078] selection:text-black">
      {/* Page header + region filter */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-4 pt-6 sm:px-6 sm:pb-5 lg:px-8">
          <h1 className="text-3xl font-black leading-none tracking-tight text-black sm:text-4xl lg:text-[40px]">
            Events
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Conferences, summits and community gatherings on the tech calendar, from Lagos to Las Vegas.
          </p>

          {upcoming.length > 0 && (
            <div role="group" aria-label="Filter events by region" className="mt-4 flex flex-wrap items-center gap-2">
              {filters.map((option) => {
                const isActive = region === option;
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setRegion(option)}
                    className={`rounded-full px-3.5 py-1.5 font-mono text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00c078] ${
                      isActive ? 'bg-black text-white' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {upcoming.length === 0 ? (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
            <h2 className="text-xl font-extrabold text-black">No upcoming events listed right now</h2>
            <p className="mt-2 text-sm text-slate-600">Check back soon for new dates.</p>
          </div>
        </section>
      ) : (
        <>
          {featured && (
            <section aria-label="Featured event" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
              <FeaturedEvent event={featured} status={getEventStatus(featured, todayISO)} />
            </section>
          )}

          {gridEvents.length > 0 && (
            <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-14 lg:px-8">
              {/* The divider lives on this inner wrapper so it lines up with the content edges. */}
              <div className={featured ? 'border-t border-slate-200 pt-10' : 'pt-8'}>
                <div className="mb-6 flex items-end justify-between gap-4">
                  <div>
                    <div className="mb-1 text-xs font-bold uppercase tracking-widest text-emerald-700">
                      On the calendar
                    </div>
                    <h2 className="text-2xl font-extrabold text-black sm:text-3xl">
                      {region === 'All' ? 'More events' : `Events in ${region}`}
                    </h2>
                  </div>
                  <p aria-live="polite" className="whitespace-nowrap text-xs font-semibold text-slate-500">
                    {visible.length} {visible.length === 1 ? 'event' : 'events'}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                  {gridEvents.map((event) => (
                    <EventCard key={event.id} event={event} status={getEventStatus(event, todayISO)} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Closing note + organiser call-to-action */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <h2 className="text-lg font-extrabold text-black sm:text-xl">Organising a tech event?</h2>
            <p className="mt-1 text-sm text-slate-600">
              Get in touch with the NexTake desk and share the dates, venue and a link.
            </p>
          </div>
          {onOpenContact && (
            <button
              type="button"
              onClick={onOpenContact}
              className="shrink-0 self-start rounded bg-black px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#00c078] hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:self-auto"
            >
              Get in touch
            </button>
          )}
        </div>

        <p className="mt-5 text-xs leading-relaxed text-slate-500">
          Dates and venues come from the organisers&rsquo; own announcements and can change. Listings last checked{' '}
          {formatDate(EVENTS_LAST_CHECKED)}; always confirm on the official event page before you travel.
        </p>
      </section>
    </div>
  );
};
