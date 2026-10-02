import type { EventRegion, TechEvent } from '../types';

type EventDates = Pick<TechEvent, 'startDate' | 'endDate'>;
type EventPlace = Pick<TechEvent, 'venue' | 'city' | 'country'>;

/** Order in which the region filter chips are shown. */
export const EVENT_REGIONS: readonly EventRegion[] = ['Africa', 'Europe', 'Americas', 'Middle East'];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_MS = 24 * 60 * 60 * 1000;

interface DateParts {
  year: number;
  /** 1-12 */
  month: number;
  day: number;
}

/**
 * Strictly parses a YYYY-MM-DD calendar date. Throws on anything else so a typo
 * in the hardcoded event list is caught immediately instead of showing "NaN".
 */
const parseISODate = (value: string): DateParts => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const check = new Date(Date.UTC(year, month - 1, day));
    if (
      check.getUTCFullYear() === year &&
      check.getUTCMonth() === month - 1 &&
      check.getUTCDate() === day
    ) {
      return { year, month, day };
    }
  }
  throw new Error(`Invalid calendar date "${value}" (expected YYYY-MM-DD)`);
};

const toUTCDay = ({ year, month, day }: DateParts): number => Date.UTC(year, month - 1, day);

/** Today's calendar date in the visitor's local time zone, as YYYY-MM-DD. */
export const toISODate = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

/** "Oct" for 2026-10-13 */
export const getEventMonth = (isoDate: string): string => MONTHS[parseISODate(isoDate).month - 1];

/** 13 for 2026-10-13 */
export const getEventDay = (isoDate: string): number => parseISODate(isoDate).day;

/**
 * "13 Oct 2026", "13–15 Oct 2026", "30 Nov – 4 Dec 2026" or
 * "30 Dec 2026 – 2 Jan 2027", depending on how the dates line up.
 */
export const formatDateRange = (startDate: string, endDate: string): string => {
  const start = parseISODate(startDate);
  const end = parseISODate(endDate);
  const startMonth = MONTHS[start.month - 1];
  const endMonth = MONTHS[end.month - 1];

  if (start.year === end.year && start.month === end.month) {
    return start.day === end.day
      ? `${start.day} ${startMonth} ${start.year}`
      : `${start.day}\u2013${end.day} ${startMonth} ${start.year}`;
  }
  if (start.year === end.year) {
    return `${start.day} ${startMonth} \u2013 ${end.day} ${endMonth} ${end.year}`;
  }
  return `${start.day} ${startMonth} ${start.year} \u2013 ${end.day} ${endMonth} ${end.year}`;
};

/** "2 Oct 2026" */
export const formatDate = (isoDate: string): string => formatDateRange(isoDate, isoDate);

export type EventStatus =
  | { kind: 'live' }
  | { kind: 'upcoming'; daysUntil: number }
  | { kind: 'ended' };

/** Compares whole calendar days, so an event is "live" on every day it runs. */
export const getEventStatus = (event: EventDates, todayISO: string): EventStatus => {
  const today = toUTCDay(parseISODate(todayISO));
  const start = toUTCDay(parseISODate(event.startDate));
  const end = toUTCDay(parseISODate(event.endDate));

  if (today > end) return { kind: 'ended' };
  if (today >= start) return { kind: 'live' };
  return { kind: 'upcoming', daysUntil: Math.round((start - today) / DAY_MS) };
};

export const getStatusLabel = (status: EventStatus): string => {
  if (status.kind === 'live') return 'Happening now';
  if (status.kind === 'ended') return 'Ended';
  return status.daysUntil === 1 ? 'Tomorrow' : `In ${status.daysUntil} days`;
};

/**
 * Drops events that have already finished and sorts the rest by start date, so
 * the hardcoded list never shows stale events. Does not mutate its input.
 */
export const getUpcomingEvents = <T extends EventDates>(events: readonly T[], todayISO: string): T[] =>
  events
    .filter((event) => event.endDate >= todayISO)
    .sort((a, b) => a.startDate.localeCompare(b.startDate) || a.endDate.localeCompare(b.endDate));

/** Regions that still have at least one event, in filter-chip order. */
export const getRegionsWithEvents = (events: readonly Pick<TechEvent, 'region'>[]): EventRegion[] =>
  EVENT_REGIONS.filter((region) => events.some((event) => event.region === region));

/** "Moscone West, San Francisco, United States" (venue is optional). */
export const formatLocation = ({ venue, city, country }: EventPlace): string =>
  [venue, city, country].filter(Boolean).join(', ');

export const getMapsUrl = (place: EventPlace): string =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formatLocation(place))}`;
