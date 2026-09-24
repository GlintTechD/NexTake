const VISITOR_KEY = 'nextake_visitor_id';
const PROFILE_KEY = 'nextake_visitor_profile';
const HISTORY_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export interface VisitorProfile {
  interests: string[];
  history: Array<{ articleId: string; keywords: string[]; openedAt: number }>;
  shownArticleIds: string[];
}

const createVisitorId = () => {
  const existing = localStorage.getItem(VISITOR_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(VISITOR_KEY, id);
  return id;
};

export const getVisitorId = () => {
  if (typeof window === 'undefined') return null;
  return createVisitorId();
};

export const getVisitorProfile = (): VisitorProfile => {
  if (typeof window === 'undefined') return { interests: [], history: [], shownArticleIds: [] };
  try {
    const parsed = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}') as Partial<VisitorProfile>;
    const cutoff = Date.now() - HISTORY_TTL_MS;
    return {
      interests: parsed.interests ?? [],
      history: (parsed.history ?? []).filter((entry) => entry.openedAt >= cutoff),
      shownArticleIds: parsed.shownArticleIds ?? [],
    };
  } catch {
    return { interests: [], history: [], shownArticleIds: [] };
  }
};

const saveProfile = (profile: VisitorProfile) => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const setVisitorInterests = (interests: string[]) => {
  const profile = getVisitorProfile();
  saveProfile({ ...profile, interests: [...new Set(interests)].slice(0, 12) });
};

export const recordArticleOpen = (articleId: string, keywords: string[] = []) => {
  const profile = getVisitorProfile();
  const history = [
    { articleId, keywords, openedAt: Date.now() },
    ...profile.history.filter((entry) => entry.articleId !== articleId),
  ].slice(0, 100);
  saveProfile({ ...profile, history });
};

export const rememberShownArticles = (articleIds: string[]) => {
  const profile = getVisitorProfile();
  saveProfile({ ...profile, shownArticleIds: [...new Set([...profile.shownArticleIds, ...articleIds])].slice(-100) });
};

export const clearVisitorHistory = () => {
  const profile = getVisitorProfile();
  saveProfile({ ...profile, history: [], shownArticleIds: [] });
};
