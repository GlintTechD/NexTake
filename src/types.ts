export type ScreenView = 'home' | 'article' | 'explore' | 'shorts' | 'interview' | 'startups' | 'startup-article' | 'comments' | 'postings';

export interface HeroSlideStory {
  id: string;
  number: string;
  category: string;
  subCategory?: string;
  headline: string;
  summary: string;
  readTime: string;
  updatedAgo: string;
  date: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  image: string;
  imageAperture?: string;
  articleId: string;
}

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  dispatchTag: string;
  dispatchNumber: string;
  readTime: string;
  date: string;
  updatedAgo: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  heroImage: string;
  heroAperture: string;
  executivePoints: {
    num: string;
    title: string;
    description: string;
  }[];
  contentSections: {
    heading?: string;
    subheading?: string;
    paragraphs: string[];
    quote?: {
      text: string;
      author: string;
      role: string;
    };
    hasFigure?: boolean;
    hasShortEmbed?: boolean;
  }[];
  indexedEntities: {
    name: string;
    location: string;
    type: 'ORG' | 'TECH' | 'PERSON';
  }[];
  verificationRuntime: {
    percentage: string;
    thresholdNote: string;
    tokensTested: string;
  };
}

export interface ShortItem {
  id: string;
  episodeNumber: number;
  category: string;
  subCategory: string;
  title: string;
  description: string;
  author: string;
  authorRole: string;
  views: string;
  duration: string;
  durationSeconds: number;
  likes: string;
  shares: string;
  thumbnail: string;
  videoUrl?: string;
  videoType: 'silicon' | 'network' | 'energy' | 'quantum' | 'cyber';
  relatedArticleId?: string;
  relatedInterviewId?: string;
  companyId?: string;
  tags: string[];
}

export interface Interview {
  id: string;
  episodeNumber: number;
  title: string;
  guest: {
    name: string;
    role: string;
    company: string;
    avatar: string;
  };
  host: {
    name: string;
    role: string;
  };
  recId: string;
  quality: string;
  duration: string;
  durationSeconds: number;
  recordedDate: string;
  recordedLocation: string;
  thumbnail: string;
  executiveBrief: string[];
  quote: {
    text: string;
    timestamp: string;
  };
  chapters: {
    time: string;
    seconds: number;
    title: string;
    description: string;
  }[];
  transcript: {
    speaker: string;
    role: string;
    time: string;
    seconds: number;
    text: string;
    highlighted?: boolean;
  }[];
  relatedShortId: string;
  relatedArticleId: string;
}

export interface Operator {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  dispatchCount: number;
  isFollowing?: boolean;
  latestDispatch?: string;
}

export interface CompanyOrg {
  id: string;
  name: string;
  tag: string;
  badge: string;
  hq: string;
  valuation: string;
  dispatchesCount: number;
  summary: string;
  isFollowing?: boolean;
  founded?: string;
  leadership?: string;
  leadershipRole?: string;
  keyTech?: string[];
  recentMilestone?: string;
  stage?: string;
  website?: string;
}

export interface SearchResultItem {
  id: string;
  type: 'story' | 'dossier' | 'short' | 'operator' | 'interview';
  title: string;
  badge?: string;
  category: string;
  readTime?: string;
  timeAgo?: string;
  summary: string;
  author?: string;
  thumbnail?: string;
  meta?: string;
  views?: string;
  valuation?: string;
  hq?: string;
  avatar?: string;
  role?: string;
  episode?: string;
  duration?: string;
  articleId?: string;
  tags?: string[];
}

export interface Startup {
  id: string;
  name: string;
  ticker: string;
  tagline: string;
  category: string;
  stage: string;
  hq: string;
  founded: string;
  valuation: string;
  totalRaised: string;
  arr: string;
  growthYoY: string;
  burnMultiple: string;
  runway: string;
  nrr: string;
  unicornProbability: number;
  investmentScore: 'AAA' | 'AA+' | 'AA' | 'A+';
  isTrending: boolean;
  isLikelyToUnicorn: boolean;
  isLikelyToInvest: boolean;
  founders: {
    name: string;
    role: string;
    pedigree: string;
    avatar?: string;
  }[];
  keyInvestors: string[];
  thesis: string;
  moat: string;
  milestones: string[];
  techStack: string[];
  riskFactor: string;
  marketSize: string;
  image?: string;
}

export type InformationDisclosureStatus =
  | 'Publicly disclosed'
  | 'Company-reported'
  | 'Reported by source'
  | 'Estimated'
  | 'Not publicly disclosed';

export interface StartupProfile {
  // 1. Startup Header
  id: string;
  name: string;
  logo?: string;
  oneLineDescription: string;
  industry: string;
  country: string;
  headquarters: string;
  foundedYear: number | string;
  stage: string;
  website: string;
  featuredImage: string;
  publishedDate: string;
  updatedDate: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  sampleDataDisclaimer?: string;

  // Editorial Article Representation
  articleHeadline?: string;
  articleDeck?: string;
  readTime?: string;
  imageCaption?: string;
  imageCredit?: string;
  secondaryImage?: string;
  secondaryImageCaption?: string;
  secondaryImageCredit?: string;
  quote?: {
    text: string;
    author: string;
    role?: string;
  };
  theInterestingTake?: string;
  whatCompanyDoesSummary?: string;
  whyThisMatters?: string;
  relatedStories?: {
    id: string;
    title: string;
    date: string;
    image: string;
    link?: string;
  }[];

  // 2. Investment Snapshot
  investmentSnapshot: {
    fundingRaised: string;
    fundingRaisedStatus: InformationDisclosureStatus;
    latestFundingRound: string;
    latestRoundDate: string;
    knownInvestors: string[];
    businessModel: string;
    marketsServed: string[];
    employeeCount: string;
    employeeCountStatus: InformationDisclosureStatus;
    revenue: string;
    revenueStatus: InformationDisclosureStatus;
    valuation: string;
    valuationStatus: InformationDisclosureStatus;
  };

  // 3. Investment Brief
  investmentBrief: {
    whatCompanyDoes: string;
    problemSolved: string;
    solution: string;
    marketOpportunity: string;
    growthTractionSignals: string[];
    keyConsiderations: string[];
  };

  // 4. Company & Product
  companyAndProduct: {
    summary: string;
    productsAndServices: {
      name: string;
      description: string;
      tierOrCategory: string;
    }[];
    targetCustomers: string[];
    howItWorksSteps: {
      stepNumber: number;
      title: string;
      detail: string;
    }[];
    businessModel: string;
    revenueStreams: {
      stream: string;
      structure: string;
      contribution?: string;
    }[];
  };

  // 5. Market Opportunity
  marketOpportunity: {
    targetMarket: string;
    geographicMarket: string[];
    customerSegments: string[];
    marketSizeData: {
      metric: string;
      value: string;
      source: string;
      sourceDate: string;
      notes?: string;
    }[];
    relevantMarketTrends: string[];
    expansionOpportunities: string[];
  };

  // 6. Traction & Growth
  tractionAndGrowth: {
    metrics: {
      label: string;
      value: string;
      timeframe: string;
      attribution: 'Company-reported' | 'Independently reported' | 'Public regulatory filing';
      sourceNote: string;
    }[];
    majorMilestones: {
      date: string;
      milestone: string;
      status: InformationDisclosureStatus;
    }[];
    keyPartnerships: {
      partner: string;
      nature: string;
      announcedDate: string;
      source: string;
    }[];
    geographicFootprint: string[];
  };

  // 7. Funding History
  fundingHistory: {
    totalFundingDisclosed: string;
    totalFundingStatus: InformationDisclosureStatus;
    rounds: {
      date: string;
      round: string;
      amount: string;
      leadInvestor: string;
      otherKnownInvestors: string[];
      source: string;
      status: InformationDisclosureStatus;
    }[];
  };

  // 8. Founders & Leadership
  foundersAndLeadership: {
    name: string;
    role: string;
    background: string;
    previousExperience: string[];
    avatar?: string;
  }[];

  // 9. Competitive Landscape
  competitiveLandscape: {
    methodologyNote: string;
    competitors: {
      company: string;
      productService: string;
      targetMarket: string;
      businessModel: string;
      differentiation: string;
    }[];
  };

  // 10. Technology
  technology: {
    coreTechnology: string;
    aiMlCapabilities?: string;
    proprietaryTechnology: string[];
    intellectualProperty: string;
    dataAdvantage: string;
    technicalDifferentiation: string;
    techStack: string[];
  };

  // 11. Risks & Challenges
  risksAndChallenges: {
    category: 'Market' | 'Competition' | 'Regulation' | 'Technology' | 'Capital Requirements' | 'Business Model' | 'Execution' | 'Geographic';
    title: string;
    description: string;
    nature: 'Reported Risk' | 'Editorial Analysis';
    mitigationObservation?: string;
  }[];

  // 12. Recent Developments
  recentDevelopments: {
    date: string;
    category: 'Funding' | 'Product Launch' | 'Partnership' | 'Expansion' | 'Acquisition' | 'Major Contract' | 'Leadership' | 'Regulation';
    headline: string;
    summary: string;
    source: string;
  }[];

  // 13. Investor Due-Diligence Questions
  investorDueDiligenceQuestions: {
    theme: 'Financial Performance' | 'Customer Acquisition & Retention' | 'Margins & Unit Economics' | 'Runway & Cash Management' | 'Customer Concentration' | 'Regulatory & Governance' | 'Technology Defensibility' | 'Competitive Position';
    question: string;
    context: string;
  }[];

  // 14. Sources & Information Status
  sourcesAndAttributions: {
    claimOrSection: string;
    status: InformationDisclosureStatus;
    sourceName: string;
    publicationDate: string;
    citationNote?: string;
  }[];
}
