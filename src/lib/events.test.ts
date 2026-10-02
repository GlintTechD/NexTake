import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import {
  EVENT_REGIONS,
  formatDate,
  formatDateRange,
  formatLocation,
  getEventDay,
  getEventMonth,
  getEventStatus,
  getMapsUrl,
  getRegionsWithEvents,
  getStatusLabel,
  getUpcomingEvents,
  toISODate,
} from './events';
import { EVENTS, EVENTS_LAST_CHECKED } from '../data/eventsData';

test('formats a date range the way it reads on the page', () => {
  assert.equal(formatDateRange('2026-10-13', '2026-10-15'), '13\u201315 Oct 2026');
  assert.equal(formatDateRange('2026-10-13', '2026-10-13'), '13 Oct 2026');
  assert.equal(formatDateRange('2026-11-30', '2026-12-04'), '30 Nov \u2013 4 Dec 2026');
  assert.equal(formatDateRange('2026-12-30', '2027-01-02'), '30 Dec 2026 \u2013 2 Jan 2027');
});

test('splits a date into the month and day shown on the date tile', () => {
  assert.equal(getEventMonth('2027-01-06'), 'Jan');
  assert.equal(getEventDay('2027-01-06'), 6);
  assert.equal(formatDate('2026-10-02'), '2 Oct 2026');
});

test('rejects dates that are not real YYYY-MM-DD calendar days', () => {
  for (const bad of ['2026-13-01', '2026-02-30', '2026-11-3', '13/11/2026', 'tomorrow', '']) {
    assert.throws(() => formatDate(bad), /Invalid calendar date/, `expected "${bad}" to be rejected`);
  }
});

test('toISODate uses the local calendar day', () => {
  assert.equal(toISODate(new Date(2026, 9, 2, 23, 59)), '2026-10-02');
  assert.equal(toISODate(new Date(2027, 0, 6, 0, 1)), '2027-01-06');
});

test('an event is upcoming before it starts, live on every day it runs, and ended after', () => {
  const event = { startDate: '2026-10-13', endDate: '2026-10-15' };

  assert.deepEqual(getEventStatus(event, '2026-10-02'), { kind: 'upcoming', daysUntil: 11 });
  assert.deepEqual(getEventStatus(event, '2026-10-12'), { kind: 'upcoming', daysUntil: 1 });
  assert.deepEqual(getEventStatus(event, '2026-10-13'), { kind: 'live' });
  assert.deepEqual(getEventStatus(event, '2026-10-15'), { kind: 'live' });
  assert.deepEqual(getEventStatus(event, '2026-10-16'), { kind: 'ended' });
});

test('counts days across month and year boundaries', () => {
  const event = { startDate: '2027-01-06', endDate: '2027-01-09' };
  assert.deepEqual(getEventStatus(event, '2026-10-02'), { kind: 'upcoming', daysUntil: 96 });
});

test('status labels', () => {
  assert.equal(getStatusLabel({ kind: 'live' }), 'Happening now');
  assert.equal(getStatusLabel({ kind: 'upcoming', daysUntil: 1 }), 'Tomorrow');
  assert.equal(getStatusLabel({ kind: 'upcoming', daysUntil: 11 }), 'In 11 days');
  assert.equal(getStatusLabel({ kind: 'ended' }), 'Ended');
});

test('hides finished events, keeps today\u2019s, and sorts by start date without mutating the input', () => {
  const events = [
    { id: 'late', startDate: '2026-12-01', endDate: '2026-12-02' },
    { id: 'over', startDate: '2026-09-01', endDate: '2026-09-03' },
    { id: 'last-day', startDate: '2026-10-01', endDate: '2026-10-02' },
    { id: 'soon', startDate: '2026-10-20', endDate: '2026-10-21' },
  ];
  const snapshot = events.map((event) => event.id);

  const upcoming = getUpcomingEvents(events, '2026-10-02');

  assert.deepEqual(
    upcoming.map((event) => event.id),
    ['last-day', 'soon', 'late'],
  );
  assert.deepEqual(
    events.map((event) => event.id),
    snapshot,
  );
  assert.deepEqual(getUpcomingEvents(events, '2027-01-01'), []);
});

test('region filter only offers regions that still have events, in a fixed order', () => {
  assert.deepEqual(
    getRegionsWithEvents([{ region: 'Middle East' }, { region: 'Africa' }, { region: 'Africa' }]),
    ['Africa', 'Middle East'],
  );
  assert.deepEqual(getRegionsWithEvents([]), []);
});

test('builds a readable location and a map link that survives "&" in venue names', () => {
  const place = { venue: 'MEO Arena & FIL Lisboa', city: 'Lisbon', country: 'Portugal' };
  assert.equal(formatLocation(place), 'MEO Arena & FIL Lisboa, Lisbon, Portugal');
  assert.equal(formatLocation({ city: 'Lagos', country: 'Nigeria' }), 'Lagos, Nigeria');
  assert.equal(
    getMapsUrl(place),
    'https://www.google.com/maps/search/?api=1&query=MEO%20Arena%20%26%20FIL%20Lisboa%2C%20Lisbon%2C%20Portugal',
  );
});

test('the hardcoded event list is well formed', () => {
  assert.ok(EVENTS.length > 0);
  assert.equal(new Set(EVENTS.map((event) => event.id)).size, EVENTS.length, 'event ids must be unique');
  assert.ok(EVENTS.filter((event) => event.featured).length <= 1, 'at most one featured event');
  assert.doesNotThrow(() => formatDate(EVENTS_LAST_CHECKED));

  for (const event of EVENTS) {
    const label = `${event.id}`;
    assert.ok(event.name.trim(), `${label}: name`);
    assert.ok(event.category.trim(), `${label}: category`);
    assert.ok(event.summary.trim(), `${label}: summary`);
    assert.ok(event.city.trim() && event.country.trim(), `${label}: city and country`);
    assert.ok(EVENT_REGIONS.includes(event.region), `${label}: unknown region "${event.region}"`);
    assert.match(event.url, /^https:\/\/\S+$/, `${label}: url must be https`);

    // Throws if either date is not a real calendar day.
    formatDateRange(event.startDate, event.endDate);
    assert.ok(event.endDate >= event.startDate, `${label}: ends before it starts`);

    const image = fileURLToPath(new URL(`../Pic/events/${event.image}.jpg`, import.meta.url));
    assert.ok(existsSync(image), `${label}: missing image src/Pic/events/${event.image}.jpg`);
  }
});
