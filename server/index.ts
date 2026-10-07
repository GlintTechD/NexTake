import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import { config, isProduction } from './config';
import { buildOtpHash, buildResendFromAddress, createOtp, constantTimeEqual, isExpired, signSessionId } from './auth';
import { initializeDatabase, isDatabaseEnabled, pool } from './db';
import {
  createContentRecord,
  deleteContentRecord,
  getPublishedContent,
  listAdminContent,
  updateContentRecord,
  getContentBySlug,
  getContentById,
} from './content-service';
import { isPubliclyVisible, normalizeSlug } from './content';
import { getLatestCommentsPage, normalizeComments } from './engagement';


declare global {
  namespace Express {
    interface Request {
      user?: { username: string };
    }
  }
}

type ContentStatus = 'draft' | 'scheduled' | 'published' | 'unpublished';

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  body: string;
  contentType: 'blog' | 'news' | 'announcement' | 'project' | 'event' | 'media' | 'opportunity';
  status: ContentStatus;
  author: string;
  category: string;
  tags: string[];
  coverImage?: string;
  externalLink?: string;
  videoUrl?: string;
  scheduledFor?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
  featuredPriority?: number;
}

interface OtpChallenge {
  username: string;
  hash: string;
  createdAt: number;
  expiresAt: number;
  attempts: number;
  used: boolean;
}

interface SessionRecord {
  username: string;
  sessionId: string;
  expiresAt: number;
}

export const app = express();
const port = config.PORT;

const otpChallenges = new Map<string, OtpChallenge>();
const sessions = new Map<string, SessionRecord>();
const contentStore = new Map<string, ContentItem>();
const newsletterSubscribers = new Set<string>();
const pageViews = new Map<string, number>();
const publicActivities: Array<{
  id: string;
  action: string;
  target: string;
  timestamp: string;
  user: string;
  type: 'publish' | 'edit' | 'subscriber' | 'system';
}> = [];
type ArticleEngagement = {
  views: number;
  likes: number;
  comments: number;
  saves: number;
  commentTexts: string[];
};

const engagementFilePath = path.join(process.cwd(), 'server', '.engagement.json');
const articleEngagement = new Map<string, ArticleEngagement>();

const persistArticleEngagement = () => {
  fs.writeFileSync(
    engagementFilePath,
    JSON.stringify(Object.fromEntries(articleEngagement), null, 2),
    'utf8',
  );
};

try {
  const storedEngagement = JSON.parse(fs.readFileSync(engagementFilePath, 'utf8')) as Record<string, ArticleEngagement>;
  for (const [articleId, engagement] of Object.entries(storedEngagement)) {
    articleEngagement.set(articleId, {
      views: Number(engagement.views ?? 0),
      likes: Number(engagement.likes ?? 0),
      comments: Number(engagement.comments ?? engagement.commentTexts?.length ?? 0),
      saves: Number(engagement.saves ?? 0),
      commentTexts: normalizeComments(Array.isArray(engagement.commentTexts) ? engagement.commentTexts : []),
    });
  }
} catch {
  // Start with empty engagement data when the file is missing or invalid.
}

const getOrCreateArticleEngagement = (articleId: string) => {
  const existing = articleEngagement.get(articleId);
  if (existing) return existing;

  const fresh = {
    views: 0,
    likes: 0,
    comments: 0,
    saves: 0,
    commentTexts: [],
  };

  articleEngagement.set(articleId, fresh);
  return fresh;
};

const recordPublicActivity = (activity: Omit<(typeof publicActivities)[number], 'id' | 'timestamp'>) => {
  publicActivities.unshift({
    ...activity,
    id: `public-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
  });

  if (publicActivities.length > 100) {
    publicActivities.length = 100;
  }
};

const getLocalAdminContent = () =>
  Array.from(contentStore.values()).sort((a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

const getLocalPublishedContent = () =>
  Array.from(contentStore.values())
    .filter((item) => item.status === 'published')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

const ensureStoredContent = async (item: ContentItem) => {
  if (isDatabaseEnabled()) {
    const persisted = await createContentRecord(item);
    return persisted ?? item;
  }
  contentStore.set(item.id, item);
  return item;
};

const updateStoredContent = async (id: string, next: Partial<ContentItem>) => {
  if (isDatabaseEnabled()) {
    const persisted = await updateContentRecord(id, next as any);
    if (persisted) {
      return persisted;
    }
  }

  const existing = contentStore.get(id);
  if (!existing) {
    return null;
  }

  const updated = { ...existing, ...next, updatedAt: new Date().toISOString() };
  contentStore.set(id, updated);
  return updated;
};

const removeStoredContent = async (id: string) => {
  if (isDatabaseEnabled()) {
    return await deleteContentRecord(id);
  }

  return contentStore.delete(id);
};

const parseCookieHeader = (cookieHeader = '') => {
  const map = new Map<string, string>();
  for (const rawCookie of (cookieHeader ?? '').split(';')) {
    const trimmed = rawCookie.trim();
    if (!trimmed) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    const value = trimmed.slice(eq + 1);
    map.set(key, value);
  }
  return map;
};

const getSessionFromRequest = (request: express.Request) => {
  const cookieMap = parseCookieHeader(request.headers.cookie);
  const rawValue = cookieMap.get('nextedit_admin');
  if (!rawValue) return null;

  const [sessionId, signature] = rawValue.split('.');
  if (!sessionId || !signature) return null;

  const expectedSignature = signSessionId(sessionId, config.SESSION_SECRET);
  if (!constantTimeEqual(signature, expectedSignature)) {
    return null;
  }

  const session = sessions.get(sessionId);
  if (!session) return null;
  if (isExpired(session.expiresAt)) {
    sessions.delete(sessionId);
    return null;
  }

  return session;
};

const requireAdmin = (request: express.Request, response: express.Response, next: express.NextFunction) => {
  const session = getSessionFromRequest(request);
  if (!session) {
    response.status(401).json({ ok: false, message: 'Unauthorized.' });
    return;
  }

  request.user = { username: session.username } as any;
  next();
};

const sendOtpEmail = async (username: string, otp: string) => {
  if (!config.RESEND_API_KEY) {
    if (isProduction) {
      throw new Error('RESEND_API_KEY is required in production.');
    }
    console.warn(`[auth] OTP for ${username}: ${otp}`);
    return;
  }

  const fromAddress = buildResendFromAddress(config.RESEND_FROM_EMAIL, config.RESEND_FROM_NAME);

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromAddress,
      to: [config.ADMIN_EMAIL],
      subject: 'Your NextEdit admin OTP',
      html: `<p>Your OTP is <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
    }),
  });

  if (!response.ok) {
    let payload: any = null;
    try {
      payload = await response.json();
    } catch {
      payload = await response.text();
    }

    const message =
      typeof payload === 'string'
        ? payload
        : payload?.message || payload?.error || 'Failed to send OTP email.';

    throw new Error(
      `${message}. Check that RESEND_FROM_EMAIL is a verified sender in your Resend dashboard.`,
    );
  }
};

interface ContactSubmission {
  name: string;
  email: string;
  organization?: string;
  inquiryType: string;
  message: string;
}

const sendContactEmail = async (submission: ContactSubmission) => {
  const recipientEmail = config.CONTACT_RECIPIENT_EMAIL || config.ADMIN_EMAIL;
  const inquiryLabel =
    {
      editorial: 'Editorial Story Pitch',
      tip: 'Secure Leak / Whistleblower Tip',
      press: 'Press Desk Inquiry',
      corporate: 'Corporate Partnership',
    }[submission.inquiryType] || submission.inquiryType;

  if (!config.RESEND_API_KEY) {
    if (isProduction) {
      throw new Error('RESEND_API_KEY is required in production.');
    }
    console.warn(`[contact] Submission received (RESEND_API_KEY not configured):`, submission);
    return;
  }

  const fromAddress = buildResendFromAddress(config.RESEND_FROM_EMAIL, config.RESEND_FROM_NAME);

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
      <div style="border-bottom: 2px solid #00f2aa; padding-bottom: 12px; margin-bottom: 20px;">
        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; font-weight: bold;">NexTake Editorial Desk</span>
        <h2 style="margin: 6px 0 0; color: #0f172a; font-size: 20px;">New Contact Inquiry: ${inquiryLabel}</h2>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0; color: #64748b; width: 140px; font-weight: 600;">Sender Name:</td>
          <td style="padding: 8px 0; color: #0f172a; font-weight: bold;">${submission.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Email:</td>
          <td style="padding: 8px 0;"><a href="mailto:${submission.email}" style="color: #059669; font-weight: 600; text-decoration: none;">${submission.email}</a></td>
        </tr>
        ${
          submission.organization
            ? `
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Organization:</td>
          <td style="padding: 8px 0; color: #0f172a;">${submission.organization}</td>
        </tr>`
            : ''
        }
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Routing Type:</td>
          <td style="padding: 8px 0; color: #0f172a;"><span style="background: #f1f5f9; padding: 3px 8px; border-radius: 6px; font-size: 12px;">${inquiryLabel}</span></td>
        </tr>
      </table>

      <div style="background: #f8fafc; border-left: 4px solid #00f2aa; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
        <div style="font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 600; margin-bottom: 8px;">Message:</div>
        <div style="font-size: 14px; color: #1e293b; line-height: 1.6; white-space: pre-wrap;">${submission.message}</div>
      </div>

      <div style="font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px;">
        Delivered by NexTake Telemetry Switch. Reply directly to this email to contact the sender.
      </div>
    </div>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromAddress,
      to: [recipientEmail],
      reply_to: submission.email,
      subject: `[NexTake Desk] ${inquiryLabel} from ${submission.name}`,
      html: htmlContent,
    }),
  });

  if (!response.ok) {
    let payload: any = null;
    try {
      payload = await response.json();
    } catch {
      payload = await response.text();
    }

    const message =
      typeof payload === 'string'
        ? payload
        : payload?.message || payload?.error || 'Failed to send contact email via Resend.';

    throw new Error(
      `${message}. Check that RESEND_FROM_EMAIL is a verified sender in your Resend dashboard.`,
    );
  }
};

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, status: 'healthy', timestamp: new Date().toISOString() });
});

app.post('/api/auth/start', async (request, response) => {
  const username = String(request.body?.username ?? '').trim();

  if (!username || username !== config.ADMIN_USERNAME) {
    response.status(401).json({ ok: false, message: 'Authentication failed.' });
    return;
  }

  const otp = createOtp();
  const hash = buildOtpHash(otp, config.SESSION_SECRET);
  const challenge = {
    username,
    hash,
    createdAt: Date.now(),
    expiresAt: Date.now() + 10 * 60 * 1000,
    attempts: 0,
    used: false,
  };

  otpChallenges.set(username, challenge);

  try {
    await sendOtpEmail(username, otp);
    response.json({ ok: true, message: 'An OTP was sent to your configured admin email.' });
  } catch (error) {
    otpChallenges.delete(username);
    console.error('[auth] OTP send failed:', error);
    response.status(503).json({ ok: false, message: 'Authentication service unavailable.' });
  }
});

app.post('/api/auth/verify', (request, response) => {
  const username = String(request.body?.username ?? '').trim();
  const otp = String(request.body?.otp ?? '');

  if (!username || username !== config.ADMIN_USERNAME) {
    response.status(401).json({ ok: false, message: 'Authentication failed.' });
    return;
  }

  const challenge = otpChallenges.get(username);
  if (!challenge || challenge.used || isExpired(challenge.expiresAt)) {
    otpChallenges.delete(username);
    response.status(401).json({ ok: false, message: 'Authentication failed.' });
    return;
  }

  if (challenge.attempts >= 5) {
    otpChallenges.delete(username);
    response.status(429).json({ ok: false, message: 'Too many failed attempts.' });
    return;
  }

  challenge.attempts += 1;
  const incomingHash = buildOtpHash(otp, config.SESSION_SECRET);
  if (!constantTimeEqual(challenge.hash, incomingHash)) {
    response.status(401).json({ ok: false, message: 'Authentication failed.' });
    return;
  }

  challenge.used = true;
  otpChallenges.delete(username);

  const sessionId = crypto.randomUUID();
  const cookieValue = `${sessionId}.${signSessionId(sessionId, config.SESSION_SECRET)}`;
  const secureCookie = isProduction ? ' Secure;' : '';
  const expiresAt = Date.now() + 60 * 60 * 1000;

  sessions.set(sessionId, {
    username,
    sessionId,
    expiresAt,
  });

  response.setHeader(
    'Set-Cookie',
    `nextedit_admin=${cookieValue}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600;${secureCookie}`,
  );

  response.json({ ok: true, username });
});

app.post('/api/auth/logout', (request, response) => {
  const cookieMap = parseCookieHeader(request.headers.cookie);
  const rawValue = cookieMap.get('nextedit_admin');

  if (rawValue) {
    const [sessionId] = rawValue.split('.');
    if (sessionId) {
      sessions.delete(sessionId);
    }
  }

  response.setHeader(
    'Set-Cookie',
    'nextedit_admin=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0;',
  );
  response.json({ ok: true, message: 'Logged out.' });
});

app.get('/api/admin/me', requireAdmin, (request, response) => {
  response.json({ ok: true, username: request.user!.username });
});

app.get('/api/admin/content', requireAdmin, async (_request, response) => {
  try {
    const items = isDatabaseEnabled() ? await listAdminContent() : getLocalAdminContent();
    response.json({ ok: true, items });
  } catch (error) {
    console.error('[content] admin list failed', error);
    response.status(500).json({ ok: false, message: 'Unable to load content.' });
  }
});

app.get('/api/public/content', async (_request, response) => {
  try {
    const items = isDatabaseEnabled()
      ? (await getPublishedContent()).filter((item) => isPubliclyVisible(item.status, item.scheduledFor, item.publishedAt))
      : getLocalPublishedContent().filter((item) => isPubliclyVisible(item.status, item.scheduledFor, item.publishedAt));
    response.json({ ok: true, items });
  } catch (error) {
    console.error('[content] public list failed', error);
    response.status(500).json({ ok: false, message: 'Unable to load public content.' });
  }
});

app.get('/api/public/articles', async (_request, response) => {
  try {
    const items = isDatabaseEnabled()
      ? (await getPublishedContent()).filter((item) => isPubliclyVisible(item.status, item.scheduledFor, item.publishedAt))
      : getLocalPublishedContent().filter((item) => isPubliclyVisible(item.status, item.scheduledFor, item.publishedAt));

    const payload = items.map((item) => {
      const engagement = getOrCreateArticleEngagement(item.id);
      return {
        id: item.id,
        title: item.title,
        category: item.category,
        author: item.author,
        excerpt: item.description,
        status: item.status,
        views: engagement.views,
        likes: engagement.likes,
        comments: engagement.comments,
        saves: engagement.saves,
        updatedAt: item.updatedAt ?? item.createdAt,
      };
    });

    response.json({ ok: true, items: payload });
  } catch (error) {
    console.error('[content] public articles failed', error);
    response.status(500).json({ ok: false, message: 'Unable to load article stats.' });
  }
});

app.get('/api/public/metrics', async (_request, response) => {
  try {
    const items = isDatabaseEnabled()
      ? (await getPublishedContent()).filter((item) => isPubliclyVisible(item.status, item.scheduledFor, item.publishedAt))
      : getLocalPublishedContent().filter((item) => isPubliclyVisible(item.status, item.scheduledFor, item.publishedAt));

    const totalPageViews = Array.from(pageViews.values()).reduce((sum, value) => sum + value, 0);
    const totalArticleViews = Array.from(articleEngagement.values()).reduce(
      (sum, engagement) => sum + engagement.views,
      0,
    );
    const newsletterSubscribersCount = newsletterSubscribers.size;
    const publishedCount = items.length;
    const monthlyVisitors = totalPageViews + totalArticleViews;

    response.json({
      ok: true,
      publishedArticles: publishedCount,
      monthlyVisitors,
      newsletterSubscribers: newsletterSubscribersCount,
      systemHealth: {
        status: 'healthy',
        availability: 99.98,
        latencyMs: 42,
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[metrics] public metrics failed', error);
    response.status(500).json({ ok: false, message: 'Unable to load site metrics.' });
  }
});

app.get('/api/public/activity', async (_request, response) => {
  response.json({
    ok: true,
    items: publicActivities.slice(0, 25),
  });
});

app.get('/api/public/article/:id/engagement', async (request, response) => {
  const articleId = request.params.id;
  const engagement = getOrCreateArticleEngagement(articleId);
  const orderedComments = normalizeComments(engagement.commentTexts).slice().reverse();

  response.json({
    ok: true,
    id: articleId,
    views: engagement.views,
    likes: engagement.likes,
    comments: engagement.comments,
    saves: engagement.saves,
    commentTexts: orderedComments,
    commentPageSize: 5,
    commentPageCount: Math.max(1, Math.ceil(orderedComments.length / 5)) || 0,
    commentPage: 1,
  });
});

app.post('/api/public/article/:id/engagement', async (request, response) => {
  const articleId = request.params.id;
  const action = String(request.body?.action ?? '').toLowerCase();
  const engagement = getOrCreateArticleEngagement(articleId);

  if (action === 'view') {
    engagement.views += 1;
    persistArticleEngagement();
    recordPublicActivity({
      action: 'Article viewed',
      target: articleId,
      user: 'Public Site',
      type: 'system',
    });
  }

  if (action === 'like') {
    engagement.likes += 1;
    persistArticleEngagement();
    recordPublicActivity({
      action: 'Article liked',
      target: articleId,
      user: 'Public Site',
      type: 'system',
    });
  }

  if (action === 'unlike') {
    engagement.likes = Math.max(0, engagement.likes - 1);
    persistArticleEngagement();
  }

  if (action === 'save') {
    engagement.saves += 1;
    persistArticleEngagement();
    recordPublicActivity({
      action: 'Article saved',
      target: articleId,
      user: 'Public Site',
      type: 'system',
    });
  }

  if (action === 'unsave') {
    engagement.saves = Math.max(0, engagement.saves - 1);
    persistArticleEngagement();
  }

  if (action === 'comment') {
    const comment = String(request.body?.comment ?? '').trim();
    if (comment) {
      const comments = normalizeComments(engagement.commentTexts);
      comments.push(comment);
      engagement.commentTexts = comments;
      engagement.comments = engagement.commentTexts.length;
      persistArticleEngagement();
      recordPublicActivity({
        action: 'New article comment',
        target: articleId,
        user: 'Public Site',
        type: 'system',
      });
    }
  }

  const orderedComments = normalizeComments(engagement.commentTexts).slice().reverse();
  response.json({
    ok: true,
    id: articleId,
    views: engagement.views,
    likes: engagement.likes,
    comments: engagement.comments,
    saves: engagement.saves,
    commentTexts: orderedComments,
    commentPageSize: 5,
    commentPageCount: Math.max(1, Math.ceil(orderedComments.length / 5)) || 0,
    commentPage: 1,
  });
});

app.post('/api/public/newsletter', async (request, response) => {
  const email = String(request.body?.email ?? '').trim().toLowerCase();
  const frequency = String(request.body?.frequency ?? 'daily');

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    response.status(400).json({ ok: false, message: 'Enter a valid email address.' });
    return;
  }

  const isNewSubscriber = !newsletterSubscribers.has(email);
  newsletterSubscribers.add(email);

  if (isNewSubscriber) {
    recordPublicActivity({
      action: 'New newsletter subscriber',
      target: email,
      user: 'Public Site',
      type: 'subscriber',
    });
  }

  response.json({
    ok: true,
    message: 'Subscription saved.',
    email,
    frequency,
    newsletterSubscribers: newsletterSubscribers.size,
  });
});

app.post('/api/public/contact', async (request, response) => {
  const name = String(request.body?.name ?? '').trim();
  const email = String(request.body?.email ?? '').trim().toLowerCase();
  const organization = String(request.body?.organization ?? '').trim();
  const inquiryType = String(request.body?.inquiryType ?? request.body?.inquiry_type ?? 'editorial').trim();
  const message = String(request.body?.message ?? '').trim();

  if (!name) {
    response.status(400).json({ ok: false, message: 'Your name is required.' });
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    response.status(400).json({ ok: false, message: 'Enter a valid email address.' });
    return;
  }

  if (!message) {
    response.status(400).json({ ok: false, message: 'Message content cannot be empty.' });
    return;
  }

  try {
    await sendContactEmail({ name, email, organization, inquiryType, message });

    recordPublicActivity({
      action: 'Contact inquiry received',
      target: `${name} (${inquiryType})`,
      user: 'Public Site',
      type: 'edit',
    });

    response.json({
      ok: true,
      message: 'Your dispatch has been successfully transmitted to the editorial desk.',
    });
  } catch (error) {
    console.error('[contact] Error sending message:', error);
    const msg = error instanceof Error ? error.message : 'Unable to transmit message.';
    response.status(500).json({ ok: false, message: msg });
  }
});

app.get('/api/public/content/:slug', async (request, response) => {
  try {
    const slug = request.params.slug;
    const item = isDatabaseEnabled()
      ? (await getContentBySlug(slug)) ?? (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug) ? await getContentById(slug) : null)
      : Array.from(contentStore.values()).find((entry) => entry.slug === slug || entry.id === slug) ?? null;

    const record = item as (ContentItem & { scheduled_for?: string; published_at?: string }) | null;
    if (!record || !isPubliclyVisible(
      record.status,
      record.scheduledFor ?? record.scheduled_for,
      record.publishedAt ?? record.published_at,
    )) {
      response.status(404).json({ ok: false, message: 'Content not found.' });
      return;
    }

    pageViews.set(slug, (pageViews.get(slug) ?? 0) + 1);
    response.json({ ok: true, item });
  } catch (error) {
    console.error('[content] public item failed', error);
    response.status(500).json({ ok: false, message: 'Unable to load content.' });
  }
});

app.get('/api/admin/content/:id/preview', requireAdmin, async (request, response) => {
  try {
    const item = isDatabaseEnabled()
      ? await getContentById(request.params.id)
      : contentStore.get(request.params.id) ?? null;

    if (!item) {
      response.status(404).json({ ok: false, message: 'Preview not found.' });
      return;
    }

    response.json({ ok: true, item });
  } catch (error) {
    console.error('[content] preview failed', error);
    response.status(500).json({ ok: false, message: 'Unable to preview content.' });
  }
});

app.post('/api/admin/content', requireAdmin, async (request, response) => {
  const payload = request.body ?? {};
  const title = String(payload.title ?? '').trim();
  const description = String(payload.description ?? '').trim();
  const body = String(payload.body ?? '').trim();
  const contentType = String(payload.contentType ?? 'blog');

  if (!title || !description || !body) {
    response.status(400).json({ ok: false, message: 'Title, description, and body are required.' });
    return;
  }

  const now = new Date().toISOString();
  const requestedSlug = String(payload.slug ?? title).trim();
  const slug = requestedSlug ? normalizeSlug(requestedSlug) : normalizeSlug(title);

  const status = (payload.status ?? 'draft') as ContentStatus;
  const item: ContentItem = {
    id: crypto.randomUUID(),
    title,
    slug,
    description,
    body,
    contentType: contentType as ContentItem['contentType'],
    status,
    author: String(payload.author ?? 'Glint'),
    category: String(payload.category ?? 'General'),
    tags: Array.isArray(payload.tags) ? payload.tags.map(String) : [],
    coverImage: payload.coverImage ? String(payload.coverImage) : undefined,
    externalLink: payload.externalLink ? String(payload.externalLink) : undefined,
    videoUrl: payload.videoUrl ? String(payload.videoUrl) : undefined,
    scheduledFor: payload.scheduledFor ? String(payload.scheduledFor) : undefined,
    publishedAt: status === 'published' && !payload.publishedAt ? now : payload.publishedAt ? String(payload.publishedAt) : undefined,
    createdAt: now,
    updatedAt: now,
    featured: Boolean(payload.featured),
    featuredPriority: Number(payload.featuredPriority ?? 0),
  };

  try {
    const persisted = await ensureStoredContent(item);
    response.status(201).json({ ok: true, item: persisted });
  } catch (error) {
    console.error('[content] create failed', error);
    const message = error instanceof Error && /duplicate key|content_slug_key|23505/i.test(error.message)
      ? 'A story with a similar title already exists. Please change the title or slug.'
      : 'Could not create content.';
    response.status(409).json({ ok: false, message });
  }
});

app.put('/api/admin/content/:id', requireAdmin, async (request, response) => {
  const existing = isDatabaseEnabled() ? await getContentById(request.params.id) : contentStore.get(request.params.id) ?? null;
  if (!existing) {
    response.status(404).json({ ok: false, message: 'Content not found.' });
    return;
  }

  try {
    const next = {
      ...existing,
      ...request.body,
      updatedAt: new Date().toISOString(),
      slug: normalizeSlug(String(request.body?.slug ?? existing.slug)),
    } as ContentItem;

    if (request.body?.slug) {
      next.slug = normalizeSlug(String(request.body.slug));
    }

    if (!next.slug || next.slug === 'untitled') {
      next.slug = normalizeSlug(existing.title);
    }

    if (next.status === 'published' && !next.publishedAt) {
      next.publishedAt = new Date().toISOString();
    }

    const updated = await updateStoredContent(existing.id, next);
    response.json({ ok: true, item: updated });
  } catch (error) {
    console.error('[content] update failed', error);
    const message = error instanceof Error && /duplicate key|content_slug_key|23505/i.test(error.message)
      ? 'A story with this slug already exists. Please change the title or slug.'
      : 'Could not update content.';
    response.status(409).json({ ok: false, message });
  }
});

app.delete('/api/admin/content/:id', requireAdmin, async (request, response) => {
  const existing = isDatabaseEnabled() ? await getContentById(request.params.id) : contentStore.get(request.params.id) ?? null;
  if (!existing) {
    response.status(404).json({ ok: false, message: 'Content not found.' });
    return;
  }

  try {
    const removed = await removeStoredContent(existing.id);
    response.json({ ok: true, deleted: removed, id: request.params.id });
  } catch (error) {
    console.error('[content] delete failed', error);
    response.status(500).json({ ok: false, message: 'Could not delete content.' });
  }
});

const distPath = path.resolve(process.cwd(), 'dist');
const indexHtmlPath = path.resolve(process.cwd(), 'index.html');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (request, response, next) => {
    if (request.path.startsWith('/api')) {
      next();
      return;
    }
    response.sendFile(path.join(distPath, 'index.html'));
  });
} else if (fs.existsSync(indexHtmlPath)) {
  app.get('*', (request, response, next) => {
    if (request.path.startsWith('/api')) {
      next();
      return;
    }
    response.sendFile(indexHtmlPath);
  });
}

const startServer = async () => {
  try {
    await initializeDatabase();
  } catch (error) {
    console.error('[db] initialization failed', error);
  }

  app.listen(port, config.HOST, () => {
    console.log(`NextEdit API listening on http://${config.HOST}:${port}`);
  });
};

if (!process.env.VERCEL) {
  void startServer();
}
