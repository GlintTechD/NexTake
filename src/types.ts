export type ScreenView = 'home' | 'article' | 'explore' | 'shorts' | 'interview';

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
}
