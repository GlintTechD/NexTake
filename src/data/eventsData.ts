import type { TechEvent } from '../types';

/**
 * Hardcoded tech events shown on the Events page.
 *
 * - Dates are ISO calendar days (YYYY-MM-DD); `endDate` is the last day of the event.
 * - Events whose `endDate` has passed are hidden automatically, so old entries
 *   can stay in the file without ever showing up as stale.
 * - `image` is the file name (without extension) of a .jpg in src/Pic/events.
 * - Mark at most one event `featured` to make it the large lead card.
 *
 * Dates, venues and links were taken from each organiser's own site or
 * announcements (see EVENTS_LAST_CHECKED). Organisers do change them, so
 * re-check before relying on an entry.
 */
export const EVENTS_LAST_CHECKED = '2026-10-02';

export const EVENTS: TechEvent[] = [
  {
    id: 'techcrunch-disrupt',
    name: 'TechCrunch Disrupt 2026',
    category: 'Startup conference',
    startDate: '2026-10-13',
    endDate: '2026-10-15',
    venue: 'Moscone West',
    city: 'San Francisco',
    country: 'United States',
    region: 'Americas',
    summary:
      'Three days of founder talks, investor roundtables and the Startup Battlefield pitch competition, with side events running across San Francisco.',
    url: 'https://techcrunch.com/events/techcrunch-disrupt/',
    image: 'techcrunch-disrupt',
  },
  {
    id: 'inspire-africa',
    name: 'Inspire Africa Conference 2026',
    category: 'Product & innovation',
    startDate: '2026-10-14',
    endDate: '2026-10-15',
    venue: 'Eko Hotel & Suites',
    city: 'Lagos',
    country: 'Nigeria',
    region: 'Africa',
    summary:
      "The fourth edition of the Innovate Africa Foundation's two-day conference for product builders and innovators from across the continent.",
    url: 'https://www.eventbrite.com/e/inspire-africa-conference-2026-tickets-1985903121696',
    image: 'inspire-africa',
  },
  {
    id: 'moonshot-techcabal',
    name: 'Moonshot by TechCabal 2026',
    category: 'Pan-African tech conference',
    startDate: '2026-10-28',
    endDate: '2026-10-29',
    venue: 'National Theatre',
    city: 'Lagos',
    country: 'Nigeria',
    region: 'Africa',
    summary:
      "TechCabal's flagship conference returns for its fourth edition, bringing founders, investors, operators and policymakers together to set the agenda for African tech.",
    url: 'https://moonshot.techcabal.com',
    image: 'moonshot-techcabal',
    featured: true,
  },
  {
    id: 'web-summit',
    name: 'Web Summit 2026',
    category: 'Global tech conference',
    startDate: '2026-11-09',
    endDate: '2026-11-12',
    venue: 'MEO Arena & FIL Lisboa',
    city: 'Lisbon',
    country: 'Portugal',
    region: 'Europe',
    summary:
      "Europe's largest tech conference fills Lisbon's Parque das Nações for four days of keynotes, startup exhibits and investor meetings across 17 content tracks.",
    url: 'https://websummit.com',
    image: 'web-summit',
  },
  {
    id: 'devfest-lagos',
    name: 'DevFest Lagos 2026',
    category: 'Developer community',
    startDate: '2026-11-13',
    endDate: '2026-11-14',
    city: 'Lagos',
    country: 'Nigeria',
    region: 'Africa',
    summary:
      'The 14th edition of the Google Developer Groups Lagos community conference: two days of talks, workshops and hackathons across AI, cloud, web, mobile and design.',
    url: 'https://devfestlagos.com',
    image: 'devfest-lagos',
  },
  {
    id: 'africa-tech-festival',
    name: 'Africa Tech Festival 2026',
    category: 'Telecoms & digital economy',
    startDate: '2026-11-16',
    endDate: '2026-11-19',
    venue: 'Cape Town International Convention Centre',
    city: 'Cape Town',
    country: 'South Africa',
    region: 'Africa',
    summary:
      "The continent's longest-running technology event reaches its 29th edition, spanning telecoms, data centres, AI, cybersecurity, startups and digital transformation.",
    url: 'https://africatechfestival.com',
    image: 'africa-tech-festival',
  },
  {
    id: 'slush',
    name: 'Slush 2026',
    category: 'Startup & investor event',
    startDate: '2026-11-18',
    endDate: '2026-11-19',
    venue: 'Messukeskus',
    city: 'Helsinki',
    country: 'Finland',
    region: 'Europe',
    summary:
      "Europe's flagship founder-focused conference brings startup showcases, investor matchmaking and a wave of side events to Helsinki over two days in November.",
    url: 'https://slush.org',
    image: 'slush',
  },
  {
    id: 'gitex-global',
    name: 'GITEX Global 2026',
    category: 'Technology expo',
    startDate: '2026-12-07',
    endDate: '2026-12-11',
    venue: 'Expo City Dubai',
    city: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    summary:
      'The GITEX Summit opens on 7 December, followed by a four-day expo covering AI, robotics, quantum, cybersecurity and mobility, now at its new home in Expo City Dubai.',
    url: 'https://www.gitex.com',
    image: 'gitex-global',
  },
  {
    id: 'ces-2027',
    name: 'CES 2027',
    category: 'Consumer tech show',
    startDate: '2027-01-06',
    endDate: '2027-01-09',
    venue: 'Las Vegas Convention Center',
    city: 'Las Vegas',
    country: 'United States',
    region: 'Americas',
    summary:
      "The Consumer Technology Association's annual show returns to Las Vegas for four days of product launches, keynotes and exhibits spanning AI, mobility, robotics and digital health.",
    url: 'https://www.ces.tech',
    image: 'ces-2027',
  },
];
