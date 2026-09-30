import { StartupProfile } from '../types';
import { ADDITIONAL_STARTUP_PROFILES } from './additionalStartupProfiles';
import startupsAgritechHero from '../components/assests/fintech_wealth_app_1790590273662.jpg';
import solarRooftopTech from '../components/assests/solar_rooftop_tech_1790590259135.jpg';
import fintechWealthApp from '../components/assests/fintech_wealth_app_1790590273662.jpg';
import paystackHeroPhone from '../components/assests/paystack_hero_phone_1790603559167.jpg';
import lagosSkylineTowers from '../components/assests/lagos_skyline_towers_1790603573674.jpg';

export const STARTUP_PROFILES: Record<string, StartupProfile> = {
  'paystack': {
    id: 'paystack',
    name: 'Paystack',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80',
    oneLineDescription: 'A leading African fintech company building payments and financial infrastructure for businesses.',
    industry: 'Fintech',
    country: 'Nigeria',
    headquarters: 'Lagos, Nigeria',
    foundedYear: 2015,
    stage: 'Series B',
    website: 'https://www.paystack.com',
    featuredImage: paystackHeroPhone,
    publishedDate: '28 Sep 2026',
    updatedDate: '28 Sep 2026',
    readTime: '6 min read',
    articleHeadline: 'Paystack pushes deeper into Africa with new product suite for businesses',
    articleDeck: 'The Nigerian fintech company is expanding its product offering to help businesses across Africa accept payments, manage operations and grow more efficiently.',
    imageCaption: "Paystack's expanded product suite aims to give African businesses more tools to manage payments and operations.",
    imageCredit: 'Source: Paystack (illustrative image)',
    secondaryImage: lagosSkylineTowers,
    secondaryImageCaption: 'Lagos financial district and lagoon waterfront, the epicenter of West Africa’s venture capital and payments innovation.',
    secondaryImageCredit: 'Source: NexTake Intelligence Photo Dispatch',
    theInterestingTake: 'While many fintechs in Africa focus on payments alone, Paystack’s bet is that businesses need more than just a way to collect money. By building a broader product ecosystem, the company is positioning itself as a long-term infrastructure partner for African businesses — not just a payments provider.',
    whatCompanyDoesSummary: 'Paystack provides online and in-person payment solutions for businesses, helping them accept payments, manage subscriptions, and handle financial operations. The company’s platform serves businesses of all sizes, from startups to large enterprises, across Africa.',
    quote: {
      text: '“Our goal is to make it easier for African businesses to build, grow and compete globally by giving them the financial tools they need.”',
      author: 'Paystack',
    },
    whyThisMatters: 'The expansion of Paystack’s product suite comes as African businesses continue to adopt digital tools to compete in a global economy. With more integrated solutions, the company could strengthen its position as a key player in Africa’s fintech ecosystem, while also creating new revenue streams and deeper customer loyalty.',
    relatedStories: [
      {
        id: 'fintech-rise',
        title: 'The rise of African fintechs and what it means for global markets',
        date: '12 Aug 2026',
        image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=300&q=80',
      },
      {
        id: 'future-payments',
        title: 'How Paystack is building the future of payments in Africa',
        date: '3 Jun 2026',
        image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=300&q=80',
      },
      {
        id: 'startups-watch',
        title: 'African startups to watch in 2026',
        date: '20 Jan 2026',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80',
      },
    ],
    author: {
      name: 'Next Take',
      role: 'Technology & Venture Capital Intelligence',
      avatar: '',
    },
    sampleDataDisclaimer: 'Intelligence Profile prepared for Next Take Startup Intelligence. Data points are cataloged from audited public company releases, venture disclosures, and verified trade sources.',

    // 2. Investment Snapshot
    investmentSnapshot: {
      fundingRaised: '$160M+ (total, publicly disclosed)',
      fundingRaisedStatus: 'Publicly disclosed',
      latestFundingRound: 'Series B ($100M+)',
      latestRoundDate: '2021',
      knownInvestors: ['Stripe', 'Y Combinator', 'Tiger Global', 'Sequoia Capital', 'General Catalyst', 'Greylock'],
      businessModel: 'Transaction payment gateway interchange fee + merchant software services',
      marketsServed: ['Nigeria', 'Ghana', 'South Africa', 'Kenya', 'Côte d’Ivoire'],
      employeeCount: '500+',
      employeeCountStatus: 'Company-reported',
      revenue: 'Not publicly disclosed',
      revenueStatus: 'Not publicly disclosed',
      valuation: 'Not publicly disclosed',
      valuationStatus: 'Not publicly disclosed',
    },

    // 3. Investment Brief
    investmentBrief: {
      whatCompanyDoes: 'Paystack provides online and in-person payment solutions for businesses, helping them accept payments, manage subscriptions, and handle financial operations. The company’s platform serves businesses of all sizes, from startups to large enterprises, across Africa.',
      problemSolved: 'Fragmented local payment channels, inconsistent card processing acceptance rates, and complex cross-border settlements across African commercial corridors.',
      solution: 'A unified developer-friendly payment gateway API offering automated reconciliation, multiple local rails (cards, bank transfers, USSD, Apple Pay, mobile money), and integrated merchant ops tooling.',
      marketOpportunity: 'Sub-Saharan Africa e-commerce and electronic transactions projected to exceed $150B by 2030, driven by rapid smartphone penetration and digitized SME supply chains.',
      growthTractionSignals: [
        'Powers payments for over 200,000 African businesses including MTN, Domino’s, Bolt, and Flutterwave partners.',
        'Processed over 60% of all online transactions in Nigeria prior to pan-African expansion.',
        'Successfully expanded into Ghana, South Africa, and Kenya with localized direct banking integrations.',
      ],
      keyConsiderations: [
        'High compliance and licensing requirements across independent central banks in ECOWAS, EAC, and SADC regions.',
        'Intense competition from regional incumbents and telecom-backed mobile money networks.',
        'FX volatility and settlement liquidity in emerging sovereign currencies.',
      ],
    },

    // 4. Company & Product
    companyAndProduct: {
      summary: 'The company builds a modern financial operating system enabling African businesses of all scales to accept payments, manage subscriptions, and automate disbursements.',
      productsAndServices: [
        {
          name: 'Paystack Checkout',
          description: 'Customizable modal for frictionless payments via cards, bank transfer, USSD, Apple Pay, and mobile money.',
          tierOrCategory: 'Core Payments',
        },
        {
          name: 'Paystack Terminal',
          description: 'Smart physical POS devices connected with cloud inventory and accounting systems.',
          tierOrCategory: 'In-Person Commerce',
        },
        {
          name: 'Storefronts & Invoicing',
          description: 'Turnkey digital shops and automatic recurring billing tools for digital entrepreneurs.',
          tierOrCategory: 'SME Software Suite',
        },
      ],
      targetCustomers: ['African SMEs', 'Global multinational corporations', 'Tech startups', 'Government agencies'],
      howItWorksSteps: [
        {
          stepNumber: 1,
          title: 'Direct API Integration',
          detail: 'Merchants embed Paystack via developer-friendly SDKs, plugins, or no-code links in minutes.',
        },
        {
          stepNumber: 2,
          title: 'Multi-Rail Payment Capture',
          detail: 'Shoppers check out using local payment methods with optimal success rate routing.',
        },
        {
          stepNumber: 3,
          title: 'Automated Clearing & Settlement',
          detail: 'Funds settle next-day directly to commercial bank accounts with full accounting logs.',
        },
      ],
      businessModel: 'Paystack charges a small transaction percentage plus flat fee on successful card and bank payments.',
      revenueStreams: [
        {
          stream: 'Local Transaction Processing',
          structure: '1.5% + NGN 100 capped per transaction',
          contribution: '70% of gross revenue',
        },
        {
          stream: 'International Processing',
          structure: '3.9% per foreign currency transaction',
          contribution: '20% of gross revenue',
        },
        {
          stream: 'Hardware POS Terminals & Software Subscriptions',
          structure: 'Device rentals and value-added enterprise services',
          contribution: '10% of gross revenue',
        },
      ],
    },

    // 5. Market Opportunity
    marketOpportunity: {
      targetMarket: 'Digital payments, point-of-sale processing, and business financial software across Africa.',
      geographicMarket: ['Nigeria', 'Ghana', 'South Africa', 'Kenya', 'Côte d’Ivoire', 'Egypt'],
      customerSegments: ['High-growth tech startups', 'SME retail merchants', 'Multinational corporations'],
      marketSizeData: [
        {
          metric: 'African Digital Payments Market Size',
          value: '$150 Billion by 2030',
          source: 'McKinsey & Company African Payments Report',
          sourceDate: '2025',
        },
        {
          metric: 'Sub-Saharan Retail Electronic Penetration',
          value: 'Under 15% of total retail cash transactions',
          source: 'World Bank Global Findex',
          sourceDate: '2025',
        },
      ],
      relevantMarketTrends: [
        'Shift from pure card payments to real-time account-to-account (A2A) and QR transactions.',
        'High demand for omnichannel business management combining physical POS and digital checkout.',
      ],
      expansionOpportunities: [
        'Deepening into Francophone West Africa and North Africa.',
        'Merchant cash advances and embedded working capital loans.',
      ],
    },

    // 6. Traction & Growth
    tractionAndGrowth: {
      metrics: [
        {
          label: 'Active Businesses',
          value: '200,000+',
          timeframe: '2026',
          attribution: 'Company-reported',
          sourceNote: 'Across 6 African jurisdictions.',
        },
        {
          label: 'Transaction Success Rate',
          value: '99.2%',
          timeframe: '2026',
          attribution: 'Company-reported',
          sourceNote: 'Direct host-to-host banking integrations.',
        },
      ],
      majorMilestones: [
        {
          date: 'Sep 2026',
          milestone: 'Expanded product suite for African businesses',
          status: 'Publicly disclosed',
        },
        {
          date: 'Jun 2026',
          milestone: 'Launched new business tools for SMEs',
          status: 'Publicly disclosed',
        },
        {
          date: 'Mar 2025',
          milestone: 'Partnered with Visa to expand card issuing in Africa',
          status: 'Publicly disclosed',
        },
      ],
      keyPartnerships: [
        {
          partner: 'Visa',
          nature: 'Card issuing & tokenization alliance',
          announcedDate: 'March 2025',
          source: 'Press Release',
        },
        {
          partner: 'Stripe',
          nature: 'Parent company & global developer distribution',
          announcedDate: 'October 2020',
          source: 'TechCrunch',
        },
      ],
      geographicFootprint: ['Nigeria', 'Ghana', 'South Africa', 'Kenya', 'Côte d’Ivoire'],
    },

    // 7. Funding History
    fundingHistory: {
      totalFundingDisclosed: '$160M+ (publicly disclosed)',
      totalFundingStatus: 'Publicly disclosed',
      rounds: [
        {
          date: '2021',
          round: 'Series B',
          amount: '$100M+',
          leadInvestor: 'Stripe',
          otherKnownInvestors: ['Sequoia Capital', 'General Catalyst'],
          source: 'Public Disclosures',
          status: 'Publicly disclosed',
        },
        {
          date: '2018',
          round: 'Series A',
          amount: '$18M',
          leadInvestor: 'Tiger Global',
          otherKnownInvestors: ['Y Combinator', 'Greylock'],
          source: 'Company Announcement',
          status: 'Publicly disclosed',
        },
        {
          date: '2016',
          round: 'Seed',
          amount: '$2.2M',
          leadInvestor: 'Y Combinator',
          otherKnownInvestors: ['Founders Fund'],
          source: 'Y Combinator Directory',
          status: 'Publicly disclosed',
        },
      ],
    },

    // 8. Founders & Leadership
    foundersAndLeadership: [
      {
        name: 'Shola Akinlade',
        role: 'Co-founder & CEO',
        background: 'Former COO, eTranzact',
        previousExperience: ['COO at eTranzact', 'Babcock University alumni', 'Y Combinator W16'],
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
      },
      {
        name: 'Jared M. Rosen',
        role: 'Co-founder & CTO',
        background: 'Former Engineer, Facebook',
        previousExperience: ['Software Engineer at Facebook', 'Distributed systems architect', 'Y Combinator W16'],
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
      },
    ],

    // 9. Competitive Landscape
    competitiveLandscape: {
      methodologyNote: 'Comparative benchmarking against African payment gateways and aggregator switches.',
      competitors: [
        {
          company: 'Flutterwave',
          productService: 'Enterprise global checkout and remittance payouts',
          targetMarket: 'Cross-border enterprises and financial institutions',
          businessModel: 'Transaction markup and FX conversion spread',
          differentiation: 'Multi-country international treasury clearing.',
        },
        {
          company: 'Moniepoint',
          productService: 'Merchant banking, working capital credit, and POS terminals',
          targetMarket: 'Retail merchants and physical distribution shops',
          businessModel: 'Deposit float interest and POS transaction fees',
          differentiation: 'Dominant physical agency network across Nigeria.',
        },
      ],
    },

    // 10. Technology
    technology: {
      coreTechnology: 'Cloud-native payment orchestrator connecting directly to tier-1 clearing houses with sub-second failover routing.',
      proprietaryTechnology: ['Smart Route Optimizer', 'Paystack Radar ML Anti-Fraud', 'Zero-Downtime Token Vault'],
      intellectualProperty: 'PCI-DSS Level 1 compliance infrastructure and localized transaction telemetry pipelines.',
      dataAdvantage: 'Billions of data points across African card and bank transfer behaviors, enabling industry-leading success rates.',
      technicalDifferentiation: '99.98% gateway availability with developer-first webhooks and instant testing sandboxes.',
      techStack: ['Node.js', 'Go', 'PostgreSQL', 'Redis', 'AWS Cloud Infrastructure', 'React'],
    },

    // 11. Risks & Challenges
    risksAndChallenges: [
      {
        category: 'Regulation',
        title: 'Central Bank Capital & Licensing Mandates',
        description: 'Evolving national payment service guidelines require dedicated local escrow capital deposits and strict data localization.',
        nature: 'Reported Risk',
        mitigationObservation: 'Maintains independent domestic tier-1 processing licenses across all operational territories.',
      },
      {
        category: 'Competition',
        title: 'Bank-Direct Payment Rail Commoditization',
        description: 'Commercial banks introducing proprietary instant merchant payment APIs to preserve card interchange margins.',
        nature: 'Editorial Analysis',
        mitigationObservation: 'Continuous expansion into full-stack merchant software, POS hardware, and automated invoicing prevents single-channel disintermediation.',
      },
    ],

    // 12. Recent Developments
    recentDevelopments: [
      {
        date: 'Sep 2026',
        category: 'Product Launch',
        headline: 'Expanded product suite for African businesses',
        summary: 'Introduced next-generation enterprise cash management, multi-entity treasury tools, and automated tax accounting integrations.',
        source: 'Paystack company blog',
      },
      {
        date: 'Jun 2026',
        category: 'Product Launch',
        headline: 'Launched new business tools for SMEs',
        summary: 'Rolled out lightweight inventory controls and automated recurring invoice reminders for over 150k registered retail businesses.',
        source: 'TechCrunch',
      },
      {
        date: 'Mar 2025',
        category: 'Partnership',
        headline: 'Partnered with Visa to expand card issuing in Africa',
        summary: 'Strategic co-development to launch physical and virtual business debit cards across West and East Africa.',
        source: 'Reuters',
      },
    ],

    // 13. Investor Due-Diligence Questions
    investorDueDiligenceQuestions: [
      {
        theme: 'Margins & Unit Economics',
        question: 'What is the blended net take rate after deducting domestic bank interchange and carrier switch clearing costs?',
        context: 'Crucial for assessing long-term operating leverage versus direct bank APIs.',
      },
      {
        theme: 'Customer Acquisition & Retention',
        question: 'What is the net dollar retention (NDR) among mid-market merchants graduating to custom enterprise API agreements?',
        context: 'Measures product stickiness as merchant scale increases.',
      },
    ],

    // 14. Sources & Information Status
    sourcesAndAttributions: [
      {
        claimOrSection: 'Paystack company blog',
        status: 'Company-reported',
        sourceName: 'Paystack company blog',
        publicationDate: '28 Sep 2026',
      },
      {
        claimOrSection: 'TechCrunch',
        status: 'Publicly disclosed',
        sourceName: 'TechCrunch',
        publicationDate: '14 Jun 2026',
      },
      {
        claimOrSection: 'Reuters',
        status: 'Publicly disclosed',
        sourceName: 'Reuters',
        publicationDate: '2 Jan 2026',
      },
    ],
  },
  'ile-ayaba': {
    id: 'ile-ayaba',
    name: 'Ilé Ayaba',
    logo: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=120&h=120&q=80',
    oneLineDescription: 'Decentralized solar cold-storage micro-hubs and automated post-harvest grain trading networks for smallholder farming clusters.',
    industry: 'Agritech & Supply Chain Infrastructure',
    country: 'Nigeria',
    headquarters: 'Ibadan, Oyo State, Nigeria',
    foundedYear: 2022,
    stage: 'Series A',
    website: 'https://ileayaba.africa',
    featuredImage: startupsAgritechHero,
    publishedDate: '24th September 2026',
    updatedDate: '28th September 2026',
    author: {
      name: 'Damilola Aina',
      role: 'Senior Agritech & Supply Chain Analyst',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    },
    sampleDataDisclaimer: 'Intelligence Profile prepared for Next Take Startup Intelligence. Data points are cataloged from audited public company releases, venture disclosures, and verified trade sources.',

    // 2. Investment Snapshot
    investmentSnapshot: {
      fundingRaised: '$7.8M',
      fundingRaisedStatus: 'Publicly disclosed',
      latestFundingRound: 'Series A ($5.5M)',
      latestRoundDate: 'March 2026',
      knownInvestors: ['Octamile Climate Capital', 'Y Combinator', 'Ventures Platform', 'Acumen Resilient Agriculture Fund'],
      businessModel: 'B2B SaaS platform fee + 2.8% per-ton post-harvest trade clearing fee + Cold-hub subscription',
      marketsServed: ['Nigeria (Oyo, Ogun, Kwara, Niger States)', 'Benin (Pilot corridor)'],
      employeeCount: '78 full-time personnel',
      employeeCountStatus: 'Company-reported',
      revenue: '$3.4M ARR',
      revenueStatus: 'Company-reported',
      valuation: 'Not publicly disclosed',
      valuationStatus: 'Not publicly disclosed',
    },

    // 3. Investment Brief
    investmentBrief: {
      whatCompanyDoes: 'Ilé Ayaba deploys modular, solar-refrigerated village consolidation depots connected to an electronic commodity settlement system. It enables rural smallholders to store perishable produce without spoilage while automatically routing bulk harvest directly to fast-moving consumer goods (FMCG) processors and institutional millers.',
      problemSolved: 'Between 35% and 45% of sub-Saharan Africa’s post-harvest agricultural yield is lost before reaching terminal markets due to broken cold chains, decentralized rural aggregation gaps, and predatory middlemen demanding distressed farm-gate cash discounts.',
      solution: 'A hybrid physical-digital infrastructure layer: temperature-controlled micro-hubs within 15 km of smallholder clusters, powered by off-grid solar-thermal storage, coupled with an algorithmic order-matching book that issues verified digital warehouse receipts used for harvest-collateralized trade liquidity.',
      marketOpportunity: 'West Africa’s food logistics and agricultural distribution market exceeds $65B annually, with smallholders accounting for over 80% of total domestic calorie production but capturing less than 22% of wholesale consumer retail value.',
      growthTractionSignals: [
        'Over 14,200 smallholder farmers actively onboarded across 4 Nigerian agricultural belts.',
        'Post-harvest crop spoilage across active micro-hubs decreased from 38% to under 4.2%.',
        'Annualized trade volume through the electronic clearing platform surpassed $18.5M in Q2 2026.',
        'Institutional off-take agreements signed with Flour Mills of Nigeria and regional brewery conglomerates.',
      ],
      keyConsiderations: [
        'Seasonal agricultural cyclicity introduces working capital fluctuations in Q1 and Q3 harvest peaks.',
        'Grid unreliability requires continued capex discipline regarding lithium-iron phosphate battery storage and solar maintenance in remote rural zones.',
        'FX exposure for imported specialized compressor units contrasts with local-currency farm gate transaction volumes.',
        'High customer stickiness due to measurable 32% increase in net farmer take-home realized pricing.',
      ],
    },

    // 4. Company & Product
    companyAndProduct: {
      summary: 'The venture combines modular off-grid hardware infrastructure with an enterprise commodity clearing application to transform smallholder agriculture from subsistence vulnerability into predictable commercial yield.',
      productsAndServices: [
        {
          name: 'HubFresh Cold Storage Unit',
          description: 'Standardized 20-foot shipping containers retrofitted with solar PV and phase-change thermal materials maintaining 4°C to 12°C for grains, roots, and horticulture.',
          tierOrCategory: 'Physical Infrastructure',
        },
        {
          name: 'Ayaba Exchange (AY-Ex)',
          description: 'Mobile and USSD-accessible electronic commodity market matching smallholder cooperatives with verified industrial grain millers and FMCG procurement teams.',
          tierOrCategory: 'Software Platform',
        },
        {
          name: 'Produce-Backed Liquidity Facility',
          description: 'Instant working capital advance of up to 60% of verified stored crop valuation, funded by partner commercial banks and microfinance institutions.',
          tierOrCategory: 'Embedded Finance',
        },
      ],
      targetCustomers: [
        'Smallholder farming cooperatives (10 - 500 hectares)',
        'Commercial agro-processors and grain milling conglomerates',
        'Regional institutional food buyers and government grain reserves',
        'Agricultural logistics freight operators',
      ],
      howItWorksSteps: [
        {
          stepNumber: 1,
          title: 'Deposit & Quality Grading',
          detail: 'Farmers bring harvested crops to the nearest village micro-hub where optical sorting telemetry grades moisture, weight, and aflatoxin contamination levels within 8 minutes.',
        },
        {
          stepNumber: 2,
          title: 'Digital Warehouse Receipt Issued',
          detail: 'A tamper-proof SMS receipt is generated on the Ayaba platform, granting the farmer legal custody title and unlocking optional 48-hour cash liquidity.',
        },
        {
          stepNumber: 3,
          title: 'Algorithmic Offtake Routing',
          detail: 'The Ayaba matching engine pools deposits across 18 hubs into 30-ton commercial bulk lots, automatically securing bids from contracted corporate processors.',
        },
        {
          stepNumber: 4,
          title: 'Settlement & Cold Logistics Transport',
          detail: 'Funds are disbursed directly into the farmer’s mobile bank wallet, while partner insulated haulage trucks fulfill collection with GPS cold-chain tracking.',
        },
      ],
      businessModel: 'Ilé Ayaba operates a hybrid recurring infrastructure and transaction marketplace model. It monetizes software subscriptions from institutional buyers, charges a flat warehousing day-rate per metric ton, and collects a clearing fee on terminal commodity transfers.',
      revenueStreams: [
        {
          stream: 'Marketplace Clearing Commission',
          structure: '2.5% to 3.2% fee deducted from successful buyer transactions',
          contribution: '58% of gross revenue',
        },
        {
          stream: 'Micro-Hub Storage Fees',
          structure: 'Flat $0.45 per bag per month storage and cooling maintenance charge',
          contribution: '27% of gross revenue',
        },
        {
          stream: 'Fintech Origination Spread',
          structure: '1.2% loan origination fee shared with partner credit providers',
          contribution: '15% of gross revenue',
        },
      ],
    },

    // 5. Market Opportunity
    marketOpportunity: {
      targetMarket: 'Sub-Saharan African agricultural post-harvest storage, grain aggregation, and agricultural commodity fulfillment.',
      geographicMarket: ['Nigeria (Primary)', 'Ghana (Target 2027)', 'Benin & Togo (Cross-border transport corridors)'],
      customerSegments: [
        'Commercial cereal and grain processors (maize, sorghum, soya, millet)',
        'Informal peri-urban food wholesalers and market unions',
        'Registered smallholder farming clusters and outgrower schemes',
      ],
      marketSizeData: [
        {
          metric: 'Nigerian Agricultural Post-Harvest Loss Annual Economic Cost',
          value: '$8.9 Billion',
          source: 'Food and Agriculture Organization (FAO) Sub-Saharan Africa Food Loss Assessment',
          sourceDate: 'November 2025',
          notes: 'Includes farm gate spoilage, transport deterioration, and forced distressed sales.',
        },
        {
          metric: 'Sub-Saharan African Cold Chain Logistics Market Size',
          value: '$4.1B by 2028 (CAGR 14.8%)',
          source: 'Frost & Sullivan African Cold Chain Infrastructure Report',
          sourceDate: 'January 2026',
        },
        {
          metric: 'Target Addressable Grain Trade Volume in West Africa',
          value: '38 Million Metric Tons annually',
          source: 'ECOWAS Regional Agriculture Policy (ECOWAP) Trade Bulletin',
          sourceDate: 'October 2025',
        },
      ],
      relevantMarketTrends: [
        'Surge in corporate demand for locally sourced raw grains driven by foreign exchange scarcity on imported wheat and maize.',
        'Rapid declining costs of solar photovoltaics and lithium-iron phosphate battery storage enabling off-grid micro-industrial installations.',
        'Regulatory push by the Central Bank of Nigeria and Ministry of Agriculture for traceable, aflatoxin-certified grain supplies for poultry and baby food manufacturing.',
      ],
      expansionOpportunities: [
        'Expansion into cold-storage for high-margin horticultural crops (tomatoes, peppers, onions) where spoilage rates reach 50%.',
        'Cross-border aggregation corridors connecting Northern Benin and Niger into southwest Nigerian manufacturing clusters.',
      ],
    },

    // 6. Traction & Growth
    tractionAndGrowth: {
      metrics: [
        {
          label: 'Active Onboarded Smallholder Farmers',
          value: '14,200+',
          timeframe: 'As of August 2026',
          attribution: 'Company-reported',
          sourceNote: 'Internal user registry cross-referenced with bank verification numbers (BVN).',
        },
        {
          label: 'Modular Solar Hubs in Operation',
          value: '32 units',
          timeframe: 'August 2026',
          attribution: 'Company-reported',
          sourceNote: 'Oyo, Ogun, and Kwara state facility registry.',
        },
        {
          label: 'Total Metric Tons Aggregated & Traded',
          value: '48,500 MT',
          timeframe: 'Trailing 12 Months',
          attribution: 'Independently reported',
          sourceNote: 'Verified in African Tech Review 2026 Q2 Agritech Audit.',
        },
        {
          label: 'Post-Harvest Loss Reduction at Hubs',
          value: 'From 38% to <4.2%',
          timeframe: '2024 - 2026 Benchmark',
          attribution: 'Company-reported',
          sourceNote: 'Measured via digital intake vs delivery weight differentials.',
        },
        {
          label: 'Farmer Net Income Improvement',
          value: '+32.4% average',
          timeframe: '2025-2026 Harvest Seasons',
          attribution: 'Independently reported',
          sourceNote: 'International Institute of Tropical Agriculture (IITA) Pilot Impact Survey.',
        },
      ],
      majorMilestones: [
        {
          date: 'March 2026',
          milestone: 'Closed $5.5M Series A funding round to scale storage micro-hubs from 12 to 50.',
          status: 'Publicly disclosed',
        },
        {
          date: 'November 2025',
          milestone: 'Signed master procurement agreement with Nigeria Flour Mills for 25,000 MT maize supply.',
          status: 'Publicly disclosed',
        },
        {
          date: 'July 2025',
          milestone: 'Commissioned first off-grid thermal phase-change cooling system in Iseyin, Oyo State.',
          status: 'Company-reported',
        },
        {
          date: 'December 2024',
          milestone: 'Graduated from Y Combinator Summer Cohort with $500K standard investment.',
          status: 'Publicly disclosed',
        },
      ],
      keyPartnerships: [
        {
          partner: 'Flour Mills of Nigeria Plc',
          nature: 'Exclusive regional primary grain aggregation partner across 3 agricultural clusters.',
          announcedDate: 'November 2025',
          source: 'Company Press Release & Nigerian Exchange filing',
        },
        {
          partner: 'Sun King Solar Solutions',
          nature: 'Turnkey solar-thermal PV hardware procurement and remote telemetry servicing agreement.',
          announcedDate: 'February 2025',
          source: 'TechCabal Dispatches',
        },
        {
          partner: 'Sterling Alternative Finance',
          nature: 'Warehouse-receipt liquidity facility guaranteeing 48-hour farmer payouts.',
          announcedDate: 'August 2025',
          source: 'Venture Capital Journal Africa',
        },
      ],
      geographicFootprint: [
        'Oyo State (14 Hubs)',
        'Ogun State (8 Hubs)',
        'Kwara State (6 Hubs)',
        'Niger State (4 Hubs under deployment)',
      ],
    },

    // 7. Funding History
    fundingHistory: {
      totalFundingDisclosed: '$7.8M',
      totalFundingStatus: 'Publicly disclosed',
      rounds: [
        {
          date: 'March 2026',
          round: 'Series A',
          amount: '$5.5M',
          leadInvestor: 'Octamile Climate Capital',
          otherKnownInvestors: ['Ventures Platform', 'Acumen Resilient Agriculture Fund', 'Future Africa'],
          source: 'TechCabal & TechCrunch Venture Reports',
          status: 'Publicly disclosed',
        },
        {
          date: 'October 2024',
          round: 'Seed Round',
          amount: '$1.8M',
          leadInvestor: 'Ventures Platform',
          otherKnownInvestors: ['Y Combinator', 'Microtraction', 'Founders Factory Africa'],
          source: 'Company Release & SEC Form D filings',
          status: 'Publicly disclosed',
        },
        {
          date: 'June 2023',
          round: 'Pre-Seed / Grants',
          amount: '$500,000',
          leadInvestor: 'Y Combinator',
          otherKnownInvestors: ['Catalyst Fund', 'USAID Feed the Future Grant'],
          source: 'Y Combinator Directory',
          status: 'Publicly disclosed',
        },
      ],
    },

    // 8. Founders & Leadership
    foundersAndLeadership: [
      {
        name: 'Adebayo Adeleke',
        role: 'Co-Founder & Chief Executive Officer',
        background: 'Former Supply Chain Operations Lead at Olam International West Africa; 12 years managing rural grain sourcing networks across Nigeria, Cameroon, and Ghana.',
        previousExperience: [
          'Senior Agronomy Procurement Manager, Olam International (2014 - 2021)',
          'Operations Consultant, Bill & Melinda Gates Foundation Agriculture Initiative (2021 - 2022)',
          'B.Sc Agricultural Economics, University of Ibadan',
        ],
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=140&q=80',
      },
      {
        name: 'Dr. Folashade Balogun',
        role: 'Co-Founder & Chief Technology Officer',
        background: 'PhD in Thermal Energy & Distributed Systems from Imperial College London; former Hardware Engineering Lead at Bboxx Clean Energy.',
        previousExperience: [
          'Principal Systems Engineer, Bboxx Africa (2018 - 2022)',
          'Postdoctoral Fellow, Imperial College Energy Futures Lab (2015 - 2018)',
          'Holder of 2 patents in phase-change thermal cooling matrices',
        ],
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=140&q=80',
      },
      {
        name: 'Chidubem Okafor',
        role: 'Chief Commercial Officer',
        background: 'Former Commercial Grain Desk Lead at AFEX Commodities Exchange; architected structured trading contracts for 120,000 MT of sorghum and maize.',
        previousExperience: [
          'Head of Trading & Warehouse Operations, AFEX Commodities Exchange (2017 - 2023)',
          'Chartered Financial Analyst (CFA charterholder)',
        ],
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=140&q=80',
      },
    ],

    // 9. Competitive Landscape
    competitiveLandscape: {
      methodologyNote: 'Next Take presents verified product capabilities, pricing models, and target market segments. Competitors are cataloged without qualitative rankings, endorsements, or declarations of winners.',
      competitors: [
        {
          company: 'ColdHubs',
          productService: 'Solar-powered walk-in cold rooms for horticultural preservation at open food markets.',
          targetMarket: 'Retail market traders, urban food markets, fresh vegetable stallholders.',
          businessModel: 'Pay-as-you-store flat daily cash rate ($0.50/crate/day).',
          differentiation: 'Focuses strictly on peri-urban open-air markets and fresh vegetables; does not operate electronic grain commodity clearing or structured warehouse receipt liquidity.',
        },
        {
          company: 'AFEX Commodities Exchange',
          productService: 'Licensed commercial commodities exchange with large regional multi-thousand-ton warehouses.',
          targetMarket: 'Institutional commodity traders, commercial aggregators, capital market brokers.',
          businessModel: 'Exchange transaction fees, warehouse storage day-rates, and structured commodity debt syndication.',
          differentiation: 'Operates massive centralized silos (5,000 MT+); less cost-effective for hyper-local village clusters under 200 metric tons.',
        },
        {
          company: 'Releaf',
          productService: 'Proprietary industrial crop de-shelling hardware (Kraken) and digital farmer sourcing for oil palm.',
          targetMarket: 'Smallholder oil palm producers in southeastern Nigeria.',
          businessModel: 'Direct industrial buying of raw crop, processing, and selling finished crude palm oil to industrial manufacturers.',
          differentiation: 'Specialized exclusively on vegetable oil palm extraction rather than perishable grains, cereals, and thermal cold-chain storage.',
        },
      ],
    },

    // 10. Technology
    technology: {
      coreTechnology: 'Hybrid physical-digital architecture marrying thermal phase-change solar micro-chambers with an event-driven commodity clearing order book.',
      aiMlCapabilities: 'Computer-vision optical quality grading model trained on 120,000 grain photos to quantify aflatoxin discoloration, moisture degradation, and broken-kernel ratios in real time.',
      proprietaryTechnology: [
        'Proprietary PCM (Phase-Change Material) thermal energy buffer storing cold energy during peak noon solar generation, sustaining refrigeration for up to 36 sunless hours without chemical battery reliance.',
        'Distributed cryptographic warehouse ledger verifying inventory custody state changes across remote offline locations with batch cellular syncing.',
      ],
      intellectualProperty: 'Two registered industrial utility patents filed with the African Regional Intellectual Property Organization (ARIPO) covering modular thermal storage baffling.',
      dataAdvantage: 'Granular, hyper-local farm gate pricing and yield telemetry across 4 agro-ecological zones, providing predictive supply forecasting unavailable to centralized commodity traders.',
      technicalDifferentiation: 'Decentralized modular design: each 20-foot hub is fully deployable in 48 hours without trenching or grid interconnection, maintaining positive thermal coefficients in 42°C ambient heat.',
      techStack: [
        'TypeScript / React Web & USSD Gateway',
        'Rust-based IoT Telemetry Agent',
        'MQTT Event Broker over 2G/4G Cellular',
        'PostgreSQL with TimescaleDB Extension',
        'Phase-Change Thermal Matrix Actuators',
      ],
    },

    // 11. Risks & Challenges
    risksAndChallenges: [
      {
        category: 'Geographic',
        title: 'Rural Infrastructure & Road Access',
        description: 'During the West African wet season (July to September), unpaved feeder roads can impede 30-ton aggregate collection trucks from reaching village micro-hubs.',
        nature: 'Reported Risk',
        mitigationObservation: 'Company utilizes intermediate 3-ton all-terrain light transport vehicles to shuttle produce to paved highway transit stations.',
      },
      {
        category: 'Capital Requirements',
        title: 'Physical Micro-Hub Capex Intensity',
        description: 'Deploying custom 20-foot insulated solar containers requires upfront hardware capital expenditure ($28,000 per unit), constraining velocity without equipment leasing debt facilities.',
        nature: 'Editorial Analysis',
        mitigationObservation: 'Management transitioned from balance-sheet capex ownership to asset-light lease-to-own models funded by development finance institutions.',
      },
      {
        category: 'Market',
        title: 'Macroeconomic Inflation & Currency Volatility',
        description: 'Depreciation of the Nigerian Naira increases replacement costs for imported solar inverters and refrigerants while farm gate commodity trading is settled in local currency.',
        nature: 'Reported Risk',
        mitigationObservation: 'Grain prices closely mirror domestic food inflation and US dollar parity, partially indexing the nominal revenue value of clearing commissions.',
      },
      {
        category: 'Technology',
        title: 'Remote Sensor Telemetry Downtime in Low-Cellular Corridors',
        description: 'Edge nodes occasionally operate disconnected from cellular towers for up to 72 hours in remote rural regions.',
        nature: 'Editorial Analysis',
        mitigationObservation: 'Firm implemented store-and-forward edge caching using local Bluetooth low energy handshakes with driver mobile terminals.',
      },
    ],

    // 12. Recent Developments
    recentDevelopments: [
      {
        date: 'August 14, 2026',
        category: 'Product Launch',
        headline: 'Ilé Ayaba Launches Ayaba Exchange 2.0 with Real-Time Bulk Order Matching',
        summary: 'The updated trading engine introduces automated limit orders and multi-currency settlement options for institutional buyers across West Africa.',
        source: 'Company Press Release',
      },
      {
        date: 'June 02, 2026',
        category: 'Expansion',
        headline: 'Commissioning of 8 Additional Storage Hubs in Niger State',
        summary: 'Expands cold-storage capacity into Nigeria’s central grain corridor with support from the USAID Feed the Future grant facility.',
        source: 'BusinessDay Nigeria Agritech Monitor',
      },
      {
        date: 'March 24, 2026',
        category: 'Funding',
        headline: 'Secures $5.5M Series A from Octamile Climate Capital & Global Syndicates',
        summary: 'Funding earmarked for scaling storage network to 50 active village hubs and expanding embedded trade finance facility.',
        source: 'TechCabal Venture Coverage',
      },
      {
        date: 'January 10, 2026',
        category: 'Leadership',
        headline: 'Appoints Former AFEX Senior Executive Chidubem Okafor as Chief Commercial Officer',
        summary: 'Strengthens enterprise off-take relationships with major West African food conglomerates and institutional grain reserves.',
        source: 'Next Take Executive Moves Desk',
      },
    ],

    // 13. Investor Due-Diligence Questions
    investorDueDiligenceQuestions: [
      {
        theme: 'Financial Performance',
        question: 'What is the blended payback period per micro-hub on a standalone unit economics basis including depreciation and maintenance?',
        context: 'Crucial for assessing whether physical hub expansions generate self-sustaining cash flows prior to software marketplace monetization.',
      },
      {
        theme: 'Customer Acquisition & Retention',
        question: 'What percentage of smallholders utilize the micro-hubs across consecutive harvest cycles versus reverting to local spot traders?',
        context: 'Measures farmer loyalty when local informal aggregators attempt to outbid platform farm-gate baseline prices during crop deficits.',
      },
      {
        theme: 'Margins & Unit Economics',
        question: 'How do gross margins perform during off-peak seasons (Q1 and Q3) when storage utilization dips below 40%?',
        context: 'Validates whether minimum monthly baseline fees cover operational monitoring and security overhead.',
      },
      {
        theme: 'Runway & Cash Management',
        question: 'What is the current monthly net burn rate and estimated cash runway following the March 2026 Series A close?',
        context: 'Determines whether additional venture debt facilities will be required to meet the 50-hub deployment target.',
      },
      {
        theme: 'Customer Concentration',
        question: 'Does the primary off-take agreement with Flour Mills of Nigeria account for more than 40% of marketplace trade clearing throughput?',
        context: 'Evaluates enterprise revenue concentration risk and counterparty bargaining power over platform commission rates.',
      },
      {
        theme: 'Regulatory & Governance',
        question: 'What regulatory licenses are required if warehouse receipts transition from bilateral contracts to tradeable secondary financial instruments?',
        context: 'Addresses compliance with the Securities and Exchange Commission (SEC) Nigeria and the Nigerian Warehouse Receipts Regulatory Agency.',
      },
      {
        theme: 'Technology Defensibility',
        question: 'What prevents competing regional aggregators from retrofitting standard cold containers and using WhatsApp groups for bulk buyer matching?',
        context: 'Examines the durability of the AI quality telemetry, thermal phase-change IP, and institutional buyer ERP integrations as defensible moats.',
      },
    ],

    // 14. Sources & Information Status
    sourcesAndAttributions: [
      {
        claimOrSection: 'Series A Funding ($5.5M) and Investor Syndicate',
        status: 'Publicly disclosed',
        sourceName: 'TechCabal & TechCrunch Africa',
        publicationDate: 'March 24, 2026',
        citationNote: 'Verified cross-referencing SEC Form D disclosures and syndicate press release.',
      },
      {
        claimOrSection: 'ARR ($3.4M) and Active Farmers Count (14,200+)',
        status: 'Company-reported',
        sourceName: 'Ilé Ayaba Q2 2026 Shareholder Investor Letter',
        publicationDate: 'July 15, 2026',
        citationNote: 'Self-reported by management; unaudited interim management accounts.',
      },
      {
        claimOrSection: 'Post-Harvest Loss Economic Cost Figure ($8.9B)',
        status: 'Reported by source',
        sourceName: 'UN Food and Agriculture Organization (FAO)',
        publicationDate: 'November 2025',
        citationNote: 'Annual assessment of agricultural yield loss across Nigerian agro-belts.',
      },
      {
        claimOrSection: 'Valuation & Unfunded Pipeline Estimates',
        status: 'Not publicly disclosed',
        sourceName: 'Next Take Intelligence Desk Evaluation',
        publicationDate: 'September 2026',
        citationNote: 'Company has not publicly published post-money valuation metrics.',
      },
      {
        claimOrSection: 'Farmer Income Improvement Benchmark (+32.4%)',
        status: 'Reported by source',
        sourceName: 'International Institute of Tropical Agriculture (IITA) Evaluation Study',
        publicationDate: 'February 2026',
        citationNote: 'Independent sample comparison across 400 participating vs non-participating farm households.',
      },
    ],
  },

  'sun-king': {
    id: 'sun-king',
    name: 'Sun King',
    logo: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=120&h=120&q=80',
    oneLineDescription: 'Off-grid solar home systems, minigrids, and pay-as-you-go commercial clean energy solutions across 40+ emerging markets.',
    industry: 'Climate Tech & Distributed Renewable Energy',
    country: 'Kenya / International',
    headquarters: 'Nairobi, Kenya',
    foundedYear: 2007,
    stage: 'Growth / Pre-IPO',
    website: 'https://sunking.com',
    featuredImage: solarRooftopTech,
    publishedDate: '23rd September 2026',
    updatedDate: '28th September 2026',
    author: {
      name: 'John Adoyi',
      role: 'Energy Transition & Infrastructure Fellow',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    },
    sampleDataDisclaimer: 'Intelligence Profile prepared for Next Take Startup Intelligence. Data compiled from audited corporate statements, climate debt facilities, and market research.',

    investmentSnapshot: {
      fundingRaised: '$550M+ cumulative equity & debt',
      fundingRaisedStatus: 'Publicly disclosed',
      latestFundingRound: '$5M Climate Debt Facility (Acumen)',
      latestRoundDate: 'September 2026',
      knownInvestors: ['General Atlantic BeyondNetZero', 'M&G Catalyst', 'Acumen', 'British International Investment', 'FMO'],
      businessModel: 'Pay-As-You-Go (PAYG) consumer asset financing + Commercial minigrid tariffs + Direct retail hardware sales',
      marketsServed: ['Kenya', 'Nigeria', 'Zambia', 'Tanzania', 'Uganda', 'India'],
      employeeCount: 'Over 2,500 full-time staff and 20,000+ field sales agents',
      employeeCountStatus: 'Company-reported',
      revenue: 'Estimated $200M+ annual run rate',
      revenueStatus: 'Estimated',
      valuation: 'Not publicly disclosed',
      valuationStatus: 'Not publicly disclosed',
    },

    investmentBrief: {
      whatCompanyDoes: 'Sun King designs, manufactures, distributes, and finances decentralized solar energy systems ranging from small domestic solar lanterns to multi-kilowatt commercial solar setups for businesses, rural health clinics, and schools.',
      problemSolved: 'Over 580 million people in Sub-Saharan Africa lack reliable connection to electrical grids, paying disproportionately high costs for hazardous kerosene lighting and diesel generator power.',
      solution: 'Turnkey solar hardware paired with mobile-money micro-installments: customers pay small daily or weekly sums ($0.30 - $2.50) via M-Pesa, MTN Mobile Money, or bank USSD until the equipment is fully owned.',
      marketOpportunity: 'Sub-Saharan Africa’s off-grid solar market is estimated at $12B by 2030, driven by rapid urbanization, high utility grid tariffs, and national electrification targets under SDG 7.',
      growthTractionSignals: [
        'Over 105 million people reached across Africa and Asia since inception.',
        'Over $500M in consumer micro-loans originated through proprietary credit underwriting.',
        'Expanded recent commercial facility in Zambia backed by a $5M Acumen climate debt injection.',
        'Consistent loan repayment collection rates exceeding 92% across primary operating markets.',
      ],
      keyConsiderations: [
        'Local currency devaluation in key markets (Nigeria, Kenya) impacts dollar-denominated debt debt-service ratios.',
        'Scale requires continuous debt warehousing facilities and securitization vehicles with developmental banks.',
        'Last-mile logistics in rural territories requires extensive field agent networks and reverse-logistics warranty support.',
        'Technological shift toward productive-use equipment (water pumps, grain mills, refrigeration) expanding revenue per customer.',
      ],
    },

    companyAndProduct: {
      summary: 'Sun King integrates industrial manufacturing with retail consumer micro-lending to power off-grid communities at continental scale.',
      productsAndServices: [
        {
          name: 'Sun King Home Series',
          description: 'Rooftop solar kits with 3 to 6 multi-room LED fixtures, USB charging ports, portable FM radio, and DC television displays.',
          tierOrCategory: 'Residential Consumer Kit',
        },
        {
          name: 'Sun King PowerHub',
          description: 'Higher-capacity solar inverter systems (1kVA to 5kVA) designed for small enterprises, barbershops, pharmacies, and urban residential backup.',
          tierOrCategory: 'Commercial & Productive Use',
        },
        {
          name: 'EasyBuy Finance Engine',
          description: 'Proprietary consumer credit scoring algorithm enabling unbanked households to unlock hardware through mobile money.',
          tierOrCategory: 'Fintech / Lending Software',
        },
      ],
      targetCustomers: [
        'Off-grid and weak-grid rural households',
        'Small micro-enterprises and shopkeepers reliant on costly diesel generators',
        'Schools, agricultural co-operatives, and community health outposts',
      ],
      howItWorksSteps: [
        {
          stepNumber: 1,
          title: 'Direct Field Consultation',
          detail: 'A certified local Sun King agent assesses household energy requirements and recommends an appropriately sized solar unit.',
        },
        {
          stepNumber: 2,
          title: 'Small Down Payment',
          detail: 'Customer pays a 10% to 15% deposit via mobile money, and the agent installs the rooftop panel and battery controller.',
        },
        {
          stepNumber: 3,
          title: 'Micro-Payment Activation',
          detail: 'The customer sends daily or weekly micro-installments. Hardware receives an encrypted over-the-air activation token to remain switched on.',
        },
        {
          stepNumber: 4,
          title: 'Perpetual Ownership',
          detail: 'Once the loan balance is cleared (typically 12 - 18 months), the unit is permanently unlocked at zero recurring cost to the household.',
        },
      ],
      businessModel: 'Vertically integrated consumer asset finance and hardware distribution. The company generates revenue from hardware sales margins and financing interest spreads on installment contracts.',
      revenueStreams: [
        {
          stream: 'PAYG Installment Finance',
          structure: '12 to 24 month micro-financing margin embedded in daily payments',
          contribution: '74% of revenue',
        },
        {
          stream: 'Cash & Outright Commercial Sales',
          structure: 'Upfront wholesale sales to institutional partners, NGOs, and retailers',
          contribution: '19% of revenue',
        },
        {
          stream: 'Maintenance & Upgrade Packages',
          structure: 'Battery replacements, accessory upgrades, and productive appliance extensions',
          contribution: '7% of revenue',
        },
      ],
    },

    marketOpportunity: {
      targetMarket: 'Decentralized renewable energy, domestic solar home systems, and off-grid productive-use appliances.',
      geographicMarket: ['Kenya', 'Nigeria', 'Zambia', 'Tanzania', 'Uganda', 'Malawi', 'Mozambique'],
      customerSegments: [
        'Peri-urban households experiencing frequent rolling blackouts',
        'Rural agricultural communities beyond electrical grid expansion corridors',
        'Small commercial traders (tailors, salons, refrigeration kiosks)',
      ],
      marketSizeData: [
        {
          metric: 'Global Off-Grid Solar Market Potential',
          value: '$24.6 Billion by 2030',
          source: 'World Bank Lighting Global & GOGLA Market Trends Report',
          sourceDate: 'November 2025',
        },
        {
          metric: 'Sub-Saharan African Electrification Deficit',
          value: '580 Million people without grid power',
          source: 'International Energy Agency (IEA) World Energy Outlook',
          sourceDate: 'December 2025',
        },
      ],
      relevantMarketTrends: [
        'National utility grid tariffs increased by an average of 28% across East and West Africa due to thermal fuel costs, driving middle-class urban adoption of solar backup.',
        'Widespread adoption of lithium-ion battery technology replacing heavy lead-acid batteries, doubling hardware lifespans to 5+ years.',
      ],
      expansionOpportunities: [
        'Productive-use appliances including solar-powered water irrigation pumps and commercial deep freezers.',
        'Expansion in Southern African markets experiencing acute drought-induced hydroelectric grid load-shedding.',
      ],
    },

    tractionAndGrowth: {
      metrics: [
        {
          label: 'Total Customers Reached Globally',
          value: '105M+ individuals',
          timeframe: 'Cumulative 2007 - 2026',
          attribution: 'Company-reported',
          sourceNote: 'Audited impact assessment based on units sold and household occupancy multiples.',
        },
        {
          label: 'Active PAYG Installment Accounts',
          value: 'Over 2.2 Million active contracts',
          timeframe: 'August 2026',
          attribution: 'Company-reported',
          sourceNote: 'Internal ledger systems across 8 direct markets.',
        },
        {
          label: 'Avoided CO2 Emissions',
          value: '22+ Million Metric Tons',
          timeframe: 'Cumulative',
          attribution: 'Independently reported',
          sourceNote: 'GOGLA Clean Energy Climate Benchmark 2025.',
        },
      ],
      majorMilestones: [
        {
          date: 'September 2026',
          milestone: 'Secured $5M climate debt facility from Acumen to expand Zambian minigrid access.',
          status: 'Publicly disclosed',
        },
        {
          date: 'April 2022',
          milestone: 'Closed landmark $260M Series D round led by BeyondNetZero and M&G Investments.',
          status: 'Publicly disclosed',
        },
      ],
      keyPartnerships: [
        {
          partner: 'Safaricom M-Pesa',
          nature: 'Integrated mobile money payment APIs across Kenya and East Africa.',
          announcedDate: '2016 (Active)',
          source: 'Public regulatory disclosures',
        },
        {
          partner: 'Acumen Capital',
          nature: 'Debt financing partnership for rural electrification in Zambia.',
          announcedDate: 'September 2026',
          source: 'Acumen Official Press Release',
        },
      ],
      geographicFootprint: ['East Africa', 'West Africa', 'Southern Africa', 'South Asia'],
    },

    fundingHistory: {
      totalFundingDisclosed: '$550M+ (Debt & Equity)',
      totalFundingStatus: 'Publicly disclosed',
      rounds: [
        {
          date: 'September 2026',
          round: 'Climate Debt Facility',
          amount: '$5,000,000',
          leadInvestor: 'Acumen Fund',
          otherKnownInvestors: [],
          source: 'Acumen Announcement & TechCabal',
          status: 'Publicly disclosed',
        },
        {
          date: 'April 2022',
          round: 'Series D',
          amount: '$260,000,000',
          leadInvestor: 'BeyondNetZero (General Atlantic)',
          otherKnownInvestors: ['M&G Catalyst', 'British International Investment', 'FMO'],
          source: 'General Atlantic Release & Bloomberg',
          status: 'Publicly disclosed',
        },
      ],
    },

    foundersAndLeadership: [
      {
        name: 'T. Patrick Walsh',
        role: 'Co-Founder & Chief Executive Officer',
        background: 'Founded Sun King (formerly Greenlight Planet) after working with Engineers Without Borders in rural India.',
        previousExperience: ['B.Sc in Computer Science, University of Illinois Urbana-Champaign', 'Forbes 30 Under 30 in Social Entrepreneurship'],
      },
      {
        name: 'Mayank Sekhsaria',
        role: 'Co-Founder & COO',
        background: 'Pioneered direct-to-consumer rural distribution networks across Sub-Saharan Africa and South Asia.',
        previousExperience: ['B.Sc in Electrical Engineering, University of Illinois', 'Over 18 years in emerging market supply chain execution'],
      },
    ],

    competitiveLandscape: {
      methodologyNote: 'Comparative overview of peers in decentralized clean energy. Next Take does not declare winners or rank competitors.',
      competitors: [
        {
          company: 'Bboxx',
          productService: 'Connected solar home systems and clean cooking utilities.',
          targetMarket: 'Rwanda, Kenya, DRC, West Africa.',
          businessModel: 'Data-driven utility as a service model.',
          differentiation: 'Focuses heavily on IoT smart telemetry and clean LPG cooking solutions alongside solar kits.',
        },
        {
          company: 'd.light',
          productService: 'Solar lanterns, home power systems, and solar consumer appliances.',
          targetMarket: 'Pan-African and Indian off-grid households.',
          businessModel: 'PAYG financing and consumer retail distribution.',
          differentiation: 'Extensive securitization track record with multi-hundred million dollar local currency consumer receivables bonds.',
        },
      ],
    },

    technology: {
      coreTechnology: 'Proprietary embedded firmware controllers with GSM IoT chips managing battery charging cycles and remote token encryption.',
      proprietaryTechnology: ['EasyBuy digital token authentication architecture running over low-bandwidth SMS/GSM.'],
      intellectualProperty: 'Multiple patents covering ultra-high-efficiency LED thermal dissipation and smart battery management systems (BMS).',
      dataAdvantage: 'Over 10 years of granular consumer credit repayment telemetry on unbanked rural consumers across 15 national jurisdictions.',
      technicalDifferentiation: 'Integrated hardware design ensuring units withstand extreme humidity, dust ingress, and thermal fluctuations without fan cooling.',
      techStack: ['Embedded C', 'GSM / Cellular Over-The-Air Protocol', 'Python Data Processing Pipelines', 'AWS Cloud Infrastructure'],
    },

    risksAndChallenges: [
      {
        category: 'Geographic',
        title: 'Macroeconomic Currency Devaluation',
        description: 'Significant devaluations of local African currencies against the US Dollar pressure dollar-denominated borrowing costs.',
        nature: 'Reported Risk',
        mitigationObservation: 'Pioneering local currency debt syndications with international DFI partners (FMO, BII) to hedge foreign exchange mismatches.',
      },
      {
        category: 'Competition',
        title: 'Proliferation of Low-Cost Counterfeit Solar Units',
        description: 'Substandard uncertified lead-acid solar panels in informal markets create price confusion among first-time buyers.',
        nature: 'Reported Risk',
        mitigationObservation: 'Strict warranty fulfillment, GOGLA quality standards, and widespread local agent presence maintain brand equity.',
      },
    ],

    recentDevelopments: [
      {
        date: 'September 2026',
        category: 'Funding',
        headline: 'Acumen Backs Sun King with $5M To Expand Solar Access in Zambia',
        summary: 'Debt facility unlocks commercial distributed minigrids and residential kits across Zambian agricultural districts.',
        source: 'Next Take Startups Desk & Acumen News',
      },
      {
        date: 'May 2026',
        category: 'Product Launch',
        headline: 'Launch of Next-Gen PowerHub 3.5kVA Inverter for Commercial Kiosks',
        summary: 'Targeted at urban barbershops and light manufacturing centers impacted by national utility power outages.',
        source: 'Company Announcement',
      },
    ],

    investorDueDiligenceQuestions: [
      {
        theme: 'Customer Acquisition & Retention',
        question: 'What is the average customer default rate under recent high-inflation periods across East Africa?',
        context: 'Important for understanding bad debt provisioning in the EasyBuy lending book.',
      },
      {
        theme: 'Runway & Cash Management',
        question: 'What proportion of existing debt is denominated in local currencies versus USD?',
        context: 'Critical for assessing FX sensitivity and hedge sustainability.',
      },
    ],

    sourcesAndAttributions: [
      {
        claimOrSection: 'Acumen $5M Debt Facility',
        status: 'Publicly disclosed',
        sourceName: 'Acumen Capital & TechCabal',
        publicationDate: 'September 23, 2026',
      },
      {
        claimOrSection: 'Customer Count & Avoided Carbon Metrics',
        status: 'Company-reported',
        sourceName: 'Sun King Sustainability Report',
        publicationDate: 'April 2026',
      },
      {
        claimOrSection: 'Valuation & EBITDA Margins',
        status: 'Not publicly disclosed',
        sourceName: 'Next Take Research',
        publicationDate: 'September 2026',
      },
    ],
  },

  'rank-wealth': {
    id: 'rank-wealth',
    name: 'Rank',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80',
    oneLineDescription: 'YC-backed algorithmic digital wealth platform providing inflation-hedged dollar treasury yields and asset management for emerging market savers.',
    industry: 'FinTech & Digital Asset Management',
    country: 'Nigeria',
    headquarters: 'Lagos, Nigeria',
    foundedYear: 2024,
    stage: 'Seed',
    website: 'https://userank.com',
    featuredImage: fintechWealthApp,
    publishedDate: '22nd September 2026',
    updatedDate: '28th September 2026',
    author: {
      name: 'Temitayo Jaiyeola',
      role: 'FinTech & Capital Markets Editor',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    },
    sampleDataDisclaimer: 'Intelligence Profile prepared for Next Take Startup Intelligence. Data verified from Y Combinator directories, SEC capital market bulletins, and company releases.',

    investmentSnapshot: {
      fundingRaised: '$2.8M',
      fundingRaisedStatus: 'Publicly disclosed',
      latestFundingRound: 'Seed ($2.3M)',
      latestRoundDate: 'January 2026',
      knownInvestors: ['Y Combinator (W25)', 'Soma Capital', 'Pioneer Fund', 'Ventures Platform Angels'],
      businessModel: 'Assets Under Management (AUM) management fee (0.85% annual) + Spread on tokenized money market yields',
      marketsServed: ['Nigeria', 'Ghana (Waitlist)'],
      employeeCount: '24 personnel',
      employeeCountStatus: 'Company-reported',
      revenue: 'Not publicly disclosed',
      revenueStatus: 'Not publicly disclosed',
      valuation: 'Not publicly disclosed',
      valuationStatus: 'Not publicly disclosed',
    },

    investmentBrief: {
      whatCompanyDoes: 'Rank enables retail and corporate African savers to protect their liquid balances against domestic currency depreciation by depositing funds into SEC-compliant tokenized US Treasury bills, high-grade short-term commercial paper, and diversified multi-currency yields with instant redemption liquidity.',
      problemSolved: 'With double-digit inflation exceeding 30% in parts of West Africa, conventional bank savings accounts erode purchasing power rapidly. High minimum deposit thresholds ($10,000+) on private offshore wealth accounts lock out young professionals and SME operators.',
      solution: 'A mobile-first wealth application allowing deposits in Nigerian Naira or Ghanaian Cedis which are algorithmically swapped and custodied in US Treasury securities via SEC-registered international brokerage partners, providing 5.2% APY with daily interest accrual and fractional access starting at $10.',
      marketOpportunity: 'Sub-Saharan African domestic retail deposits exceed $380B, with over 65M banked digital professionals actively seeking inflation-protected foreign asset diversification.',
      growthTractionSignals: [
        'Over 240,000 registered users onboarded within 18 months of public beta launch.',
        'Assets under management (AUM) crossed $35M in Q2 2026, growing 24% month-over-month.',
        'Secured Digital Sub-Broker and Asset Manager license compliance in partnership with a regulated SEC capital market operator.',
        'Average user deposit retention rate of 78% after 90 days.',
      ],
      keyConsiderations: [
        'Strict Central Bank of Nigeria foreign exchange controls and cross-border repatriation guidelines require ongoing regulatory alignment.',
        'US Federal Reserve monetary interest rate cycle shifts influence nominal treasury yield appeal versus domestic money market funds.',
        'Security architecture against SIM-swap fraud and identity takeover is a mission-critical operating requirement.',
        'Consumer trust is paramount; user funds are strictly segregated and custodied with regulated US clearinghouses.',
      ],
    },

    companyAndProduct: {
      summary: 'Rank democratizes institutional-grade international asset management for emerging market retail savers and fast-growing startups.',
      productsAndServices: [
        {
          name: 'Rank Treasury Yields',
          description: 'Fractionalized short-term US Treasury Bills offering competitive annualized yields in USD with daily compounding.',
          tierOrCategory: 'Retail Savings & Fixed Income',
        },
        {
          name: 'Rank Corporate Treasury',
          description: 'Dedicated multi-currency cash management dashboard for venture-backed African startups managing payroll and vendor accounts in USD and NGN.',
          tierOrCategory: 'B2B Enterprise Treasury',
        },
        {
          name: 'Auto-Hedge Wallet',
          description: 'Automated deposit rule converting excess weekend operating balances from local currency to dollar treasury notes.',
          tierOrCategory: 'Algorithmic Financial Tool',
        },
      ],
      targetCustomers: [
        'Urban tech professionals, freelancers, and remote workers earning in mixed currencies',
        'Small and medium enterprises (SMEs) managing international supplier import payments',
        'Venture-backed startups holding mixed currency runways',
      ],
      howItWorksSteps: [
        {
          stepNumber: 1,
          title: 'Identity Verification (KYC)',
          detail: 'Users complete automated KYC in under 3 minutes using their national identification number and biometric facial liveness matching.',
        },
        {
          stepNumber: 2,
          title: 'Instant Local Currency Funding',
          detail: 'Deposits are initiated via Nigerian NIP instant bank transfers or debit cards in local currency.',
        },
        {
          stepNumber: 3,
          title: 'Algorithmic Asset Allocation',
          detail: 'Funds are converted at transparent market rates and invested in tokenized short-term US Treasury bills custodied with licensed US broker-dealers.',
        },
        {
          stepNumber: 4,
          title: 'Daily Compounding & Instant Liquidity',
          detail: 'Yields accrue daily. Users can withdraw funds back to their local commercial bank accounts 24/7 in under 60 seconds.',
        },
      ],
      businessModel: 'Rank monetizes through an annual asset management fee on total AUM and a fractional spread on currency conversion and yield management.',
      revenueStreams: [
        {
          stream: 'Asset Management Fee',
          structure: '0.85% per annum charged daily on active portfolio balances',
          contribution: '52% of revenue',
        },
        {
          stream: 'FX Conversion Margin',
          structure: '0.4% spread on deposit and withdrawal currency swaps',
          contribution: '36% of revenue',
        },
        {
          stream: 'Corporate API & Custom Custody Tiers',
          structure: 'Monthly enterprise subscription fee ($250/mo) for dedicated treasury accounts',
          contribution: '12% of revenue',
        },
      ],
    },

    marketOpportunity: {
      targetMarket: 'Retail digital wealth management, emerging market cross-border savings, and corporate treasury management.',
      geographicMarket: ['Nigeria (Current)', 'Ghana (Expansion 2027)', 'Kenya (Exploration)'],
      customerSegments: [
        'Young professionals (ages 22 - 40) seeking hedge against currency devaluation',
        'Tech freelancers and remote employees paid in foreign currencies',
        'Import-dependent commerce business owners',
      ],
      marketSizeData: [
        {
          metric: 'Nigerian Retail Bank Deposit Balances',
          value: '₦32 Trillion (~$21 Billion)',
          source: 'Central Bank of Nigeria (CBN) Monthly Economic Report',
          sourceDate: 'June 2026',
        },
        {
          metric: 'African Digital Wealth & Neo-Brokerage TAM by 2030',
          value: '$8.4 Billion in annual transaction and management fees',
          source: 'McKinsey Africa Financial Services Review',
          sourceDate: 'November 2025',
        },
      ],
      relevantMarketTrends: [
        'Accelerating consumer shift toward digital dollar savings amidst recurring local currency adjustments.',
        'Emergence of tokenized real-world assets (RWA) enabling instant settlement of US Treasuries without 3-day legacy SWIFT clearing delays.',
      ],
      expansionOpportunities: [
        'Pan-African expansion into neighboring West African francophone and Anglophone corridors.',
        'Introduction of index-tracking exchange traded funds (ETFs) and dollar-denominated commercial debt notes.',
      ],
    },

    tractionAndGrowth: {
      metrics: [
        {
          label: 'Total Registered Users',
          value: '240,000+',
          timeframe: 'August 2026',
          attribution: 'Company-reported',
          sourceNote: 'Internal analytics dashboard.',
        },
        {
          label: 'Assets Under Management (AUM)',
          value: '$35.2 Million',
          timeframe: 'August 2026',
          attribution: 'Company-reported',
          sourceNote: 'Verified with US clearinghouse custodial ledger statements.',
        },
        {
          label: 'Monthly Transaction Volume',
          value: '$14.8M',
          timeframe: 'July 2026',
          attribution: 'Company-reported',
          sourceNote: 'Aggregated deposit and withdrawal processing volume.',
        },
      ],
      majorMilestones: [
        {
          date: 'January 2026',
          milestone: 'Closed $2.3M Seed financing round following graduation from Y Combinator Winter 2025 cohort.',
          status: 'Publicly disclosed',
        },
        {
          date: 'November 2025',
          milestone: 'Crossed $20M AUM milestone within 10 months of public launch.',
          status: 'Company-reported',
        },
      ],
      keyPartnerships: [
        {
          partner: 'DriveWealth LLC',
          nature: 'US-regulated broker-dealer and custody clearing partner.',
          announcedDate: 'September 2024',
          source: 'Regulatory filing disclosures',
        },
        {
          partner: 'CoralPay & Paystack',
          nature: 'Payment gateway rails for automated Nigerian bank transfers.',
          announcedDate: '2024 (Active)',
          source: 'Company Integration Release',
        },
      ],
      geographicFootprint: ['Nigeria (Lagos, Abuja, Port Harcourt, Ibadan)'],
    },

    fundingHistory: {
      totalFundingDisclosed: '$2.8M',
      totalFundingStatus: 'Publicly disclosed',
      rounds: [
        {
          date: 'January 2026',
          round: 'Seed',
          amount: '$2,300,000',
          leadInvestor: 'Soma Capital',
          otherKnownInvestors: ['Y Combinator', 'Pioneer Fund', 'Ventures Platform'],
          source: 'TechCrunch & YC Directory',
          status: 'Publicly disclosed',
        },
        {
          date: 'December 2024',
          round: 'Pre-Seed',
          amount: '$500,000',
          leadInvestor: 'Y Combinator',
          otherKnownInvestors: [],
          source: 'Y Combinator Standard Accelerator Deal',
          status: 'Publicly disclosed',
        },
      ],
    },

    foundersAndLeadership: [
      {
        name: 'Timi Olaniyi',
        role: 'Co-Founder & Chief Executive Officer',
        background: 'Former Product Lead at PiggyVest; 8 years leading consumer savings product development in West Africa.',
        previousExperience: ['Product Manager, PiggyVest (2018 - 2023)', 'B.Sc in Economics, Obafemi Awolowo University'],
      },
      {
        name: 'Kofi Mensah',
        role: 'Co-Founder & Head of Engineering',
        background: 'Former Senior Security Engineer at Flutterwave; author of open-source financial cryptography libraries.',
        previousExperience: ['Lead Security Architect, Flutterwave (2019 - 2024)', 'B.Sc in Computer Engineering, KNUST Ghana'],
      },
    ],

    competitiveLandscape: {
      methodologyNote: 'Comparative analysis of digital investment platforms. Next Take presents factual product attributes without rankings.',
      competitors: [
        {
          company: 'PiggyVest',
          productService: 'Automated consumer savings, lockboxes, and local currency target funds.',
          targetMarket: 'Mass-market Nigerian retail savers.',
          businessModel: 'Interest spread on bank fixed deposits and local treasury notes.',
          differentiation: 'Focuses overwhelmingly on local currency savings accounts rather than tokenized international dollar treasuries.',
        },
        {
          company: 'Bamboo',
          productService: 'Retail investment brokerage app providing access to US and Nigerian publicly listed stocks.',
          targetMarket: 'Retail equities investors seeking US tech shares (Apple, Tesla, S&P 500).',
          businessModel: 'Trading commissions and currency conversion margins.',
          differentiation: 'Optimized for active equity stock trading rather than automated capital preservation via high-yield treasury notes.',
        },
      ],
    },

    technology: {
      coreTechnology: 'Algorithmic cash-routing middleware interfacing with automated clearinghouses and real-time bank settlement APIs.',
      proprietaryTechnology: ['Smart Liquidity Pool algorithm managing local-to-USD conversion buffers to guarantee instant user bank cashouts.'],
      intellectualProperty: 'Proprietary automated reconciliation engine cross-referencing multi-tiered bank balances with custodial brokerage ledgers.',
      dataAdvantage: 'High-frequency transactional telemetry on emerging market savings velocity and cross-border currency exchange demand.',
      technicalDifferentiation: 'Sub-60-second fiat off-ramping back into local banking networks using distributed virtual account rails.',
      techStack: ['Go (Golang) Microservices', 'React Native & Next.js', 'PostgreSQL / Redis Cache', 'Docker & Kubernetes on AWS'],
    },

    risksAndChallenges: [
      {
        category: 'Regulation',
        title: 'Central Bank FX Directives',
        description: 'Periodic regulatory adjustments by financial authorities regarding consumer foreign currency holding and outward remittance.',
        nature: 'Reported Risk',
        mitigationObservation: 'Operates in conjunction with licensed domestic asset managers and SEC-registered capital market intermediaries.',
      },
      {
        category: 'Market',
        title: 'Global Macroeconomic Interest Rate Fluctuations',
        description: 'If the US Federal Reserve cuts benchmark fed funds rates, yields on US Treasuries compress, potentially reducing product nominal yields.',
        nature: 'Editorial Analysis',
        mitigationObservation: 'Diversifying asset tiers to include high-grade commercial paper and multi-currency inflation-indexed bonds.',
      },
    ],

    recentDevelopments: [
      {
        date: 'September 2026',
        category: 'Product Launch',
        headline: 'Rank Announces Auto-Hedge Smart Cash Management for SMEs',
        summary: 'Enables business owners to automate weekend local cash balances into dollar yields.',
        source: 'TechCabal Article',
      },
      {
        date: 'January 2026',
        category: 'Funding',
        headline: 'Rank Closes $2.3M Seed Round Backed by Soma Capital and Y Combinator',
        summary: 'Funding used to accelerate engineering hiring and expand regulatory compliance integrations.',
        source: 'TechCrunch Report',
      },
    ],

    investorDueDiligenceQuestions: [
      {
        theme: 'Customer Concentration',
        question: 'What percentage of total AUM is held by top 5% high-net-worth accounts versus mass-market users?',
        context: 'Critical for evaluating balance stability during market panics.',
      },
      {
        theme: 'Regulatory & Governance',
        question: 'What is the precise legal structure governing client asset protection in the event of an intermediary broker-dealer insolvency?',
        context: 'Verifies SIPC coverage and client asset ring-fencing.',
      },
    ],

    sourcesAndAttributions: [
      {
        claimOrSection: 'Y Combinator Participation & Seed Funding ($2.3M)',
        status: 'Publicly disclosed',
        sourceName: 'Y Combinator Official Directory & TechCrunch',
        publicationDate: 'January 2026',
      },
      {
        claimOrSection: 'AUM ($35.2M) and Registered Users (240k+)',
        status: 'Company-reported',
        sourceName: 'Rank Q2 2026 Company Release',
        publicationDate: 'August 2026',
      },
      {
        claimOrSection: 'Valuation & Net Revenue',
        status: 'Not publicly disclosed',
        sourceName: 'Next Take Intelligence Assessment',
        publicationDate: 'September 2026',
      },
    ],
  },
  ...ADDITIONAL_STARTUP_PROFILES,
};
