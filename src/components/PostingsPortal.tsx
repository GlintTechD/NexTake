import React, { useEffect, useState } from 'react';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  body: string;
  contentType: string;
  status: string;
  author: string;
  category: string;
  tags: string[];
  slug: string;
  coverImage?: string;
  externalLink?: string;
  videoUrl?: string;
  scheduledFor?: string;
  featured?: boolean;
  featuredPriority?: number;
}

const defaultForm = {
  title: '',
  description: '',
  body: '',
  contentType: 'blog',
  status: 'published',
  author: 'Glint',
  category: '',
  tags: '',
  coverImage: '',
  externalLink: '',
  videoUrl: '',
  scheduledFor: '',
  featured: true,
  featuredPriority: 10,
};

const suggestionPreview = {
  title: 'The next wave of AI is already changing how operators work',
  description: 'A practical look at how autonomous systems, governance layers, and operator design are reshaping enterprise execution across high-trust teams.',
};

const fetchJson = async (path: string, options: RequestInit = {}) => {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message ?? 'Request failed.');
  }

  return payload;
};

export const PostingsPortal: React.FC = () => {
  const [username, setUsername] = useState('Glint');
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState('Enter your admin username to begin.');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [items, setItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);

  const loadContent = async () => {
    try {
      const response = await fetchJson('/api/admin/content');
      setItems(response.items ?? []);
    } catch (error) {
      console.error(error);
    }
  };

  const checkSession = async () => {
    try {
      const response = await fetchJson('/api/admin/me');
      setIsAuthenticated(true);
      setAdminName(response.username || 'Glint');
      await loadContent();
    } catch {
      setIsAuthenticated(false);
      setAdminName('');
    }
  };

  useEffect(() => {
    void checkSession();
  }, []);

  const handleStartAuth = async () => {
    setIsLoading(true);
    try {
      await fetchJson('/api/auth/start', {
        method: 'POST',
        body: JSON.stringify({ username }),
      });
      setStatus('A one-time password was generated and sent to the configured admin inbox.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    try {
      await fetchJson('/api/auth/verify', {
        method: 'POST',
        body: JSON.stringify({ username, otp }),
      });
      setStatus('Authenticated. The admin dashboard is now active.');
      setIsAuthenticated(true);
      setAdminName(username);
      await loadContent();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetchJson('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setAdminName('');
      setOtp('');
      setStatus('Session ended.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not log out.');
    }
  };

  const handleCreateContent = async () => {
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      };

      await fetchJson('/api/admin/content', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setStatus('Content created successfully.');
      await loadContent();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not create content.');
    }
  };

  const handleFieldChange = (key: keyof typeof form, value: string | boolean | number) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleFieldFocus = (key: string) => {
    setFocusedField(key);
    setShowHint(true);
  };

  const handleFieldBlur = () => {
    setFocusedField(null);
    setShowHint(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900">
        <div className="mx-auto max-w-xl px-4 pt-16">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6">
              <div className="text-xs font-mono font-bold tracking-[0.2em] text-slate-400 uppercase">
                NexTake admin
              </div>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Secure posting portal</h1>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Username
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-emerald-500"
                  placeholder="Glint"
                />
              </label>

              <button
                type="button"
                onClick={handleStartAuth}
                disabled={isLoading}
                className="w-full rounded-lg bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? 'Sending OTP…' : 'Request one-time password'}
              </button>

              <label className="block text-sm font-medium text-slate-700">
                One-time password
                <input
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-emerald-500"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                />
              </label>

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isLoading || otp.length !== 6}
                className="w-full rounded-lg bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Verify and sign in
              </button>
            </div>

            <p className="mt-5 text-sm text-slate-600">{status}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-mono font-bold tracking-[0.2em] text-slate-400 uppercase">Publishing dashboard</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Publish to the public site</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
              {adminName || 'Glint'}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:border-slate-400"
            >
              Log out
            </button>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
          <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.75),rgba(248,250,252,0.95))]" />
            {showHint && focusedField && (
              <div className="pointer-events-none absolute inset-x-5 bottom-6 rounded-2xl border border-slate-200/80 bg-white/35 p-4 shadow-[0_12px_28px_rgba(15,23,42,0.04)] backdrop-blur-[1px] opacity-90">
                <div className="flex items-center justify-between gap-3 pb-2">
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-emerald-700">
                    Suggestion
                  </span>
                  <span className="text-[10px] font-mono uppercase text-slate-400">Example</span>
                </div>
                <div className="mb-2 h-2.5 w-16 rounded-full bg-slate-200/70" />
                <h3 className="max-w-md text-lg font-black tracking-tight text-slate-500">{suggestionPreview.title}</h3>
                <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">{suggestionPreview.description}</p>
              </div>
            )}

            <div className="relative z-10">
              <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-950">Publishing editor</h2>
                  <p className="mt-1 text-xs text-slate-500">Anything published here appears on the public interface.</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-mono font-bold uppercase text-slate-600">
                  {form.status}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700 md:col-span-2">
                Title
                <input
                  value={form.title}
                  placeholder="Write a headline for your story"
                  onFocus={() => handleFieldFocus('title')}
                  onBlur={handleFieldBlur}
                  onChange={(event) => handleFieldChange('title', event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-500"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700 md:col-span-2">
                Description
                <textarea
                  value={form.description}
                  placeholder="Add a short summary for the public listing"
                  onFocus={() => handleFieldFocus('description')}
                  onBlur={handleFieldBlur}
                  onChange={(event) => handleFieldChange('description', event.target.value)}
                  className="mt-2 min-h-24 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-500"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700 md:col-span-2">
                Body
                <textarea
                  value={form.body}
                  placeholder="Write the story, memo, update, or announcement"
                  onFocus={() => handleFieldFocus('body')}
                  onBlur={handleFieldBlur}
                  onChange={(event) => handleFieldChange('body', event.target.value)}
                  className="mt-2 min-h-40 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-500"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Content type
                <select
                  value={form.contentType}
                  onChange={(event) => handleFieldChange('contentType', event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-500"
                >
                  <option value="blog">Blog</option>
                  <option value="news">News</option>
                  <option value="announcement">Announcement</option>
                  <option value="project">Project</option>
                  <option value="event">Event</option>
                  <option value="media">Media</option>
                  <option value="opportunity">Opportunity</option>
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Status
                <select
                  value={form.status}
                  onChange={(event) => handleFieldChange('status', event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-500"
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                  <option value="unpublished">Unpublished</option>
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Author
                <input
                  value={form.author}
                  onChange={(event) => handleFieldChange('author', event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-500"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Category
                <input
                  value={form.category}
                  onChange={(event) => handleFieldChange('category', event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-500"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700 md:col-span-2">
                Tags
                <input
                  value={form.tags}
                  onChange={(event) => handleFieldChange('tags', event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-500"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Cover image URL
                <input
                  value={form.coverImage}
                  onChange={(event) => handleFieldChange('coverImage', event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-500"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                External link
                <input
                  value={form.externalLink}
                  onChange={(event) => handleFieldChange('externalLink', event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-500"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Video URL
                <input
                  value={form.videoUrl}
                  onChange={(event) => handleFieldChange('videoUrl', event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-500"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Scheduled for
                <input
                  type="datetime-local"
                  value={form.scheduledFor}
                  onChange={(event) => handleFieldChange('scheduledFor', event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-500"
                />
              </label>

              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) => handleFieldChange('featured', event.target.checked)}
                />
                Feature on homepage
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Prioritization
                <input
                  type="number"
                  value={form.featuredPriority}
                  onChange={(event) => handleFieldChange('featuredPriority', Number(event.target.value))}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-500"
                />
              </label>
              </div>
            </div>

            <div className="relative z-10 mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleCreateContent}
                className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-600"
              >
                Publish to public site
              </button>
              <button
                type="button"
                onClick={() => handleFieldChange('status', 'draft')}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-slate-400"
              >
                Save draft
              </button>
            </div>
          </section>

          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">Public content queue</h2>

            <div className="mt-5 space-y-3">
              {items.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                  No public content yet. Published stories will appear here.
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-slate-900">{item.title}</h3>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-mono font-bold uppercase text-emerald-700">
                        {item.status}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-600">{item.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-mono text-slate-500">
                      <span>{item.contentType}</span>
                      <span>•</span>
                      <span>{item.category}</span>
                      <span>•</span>
                      <span>{item.author}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
