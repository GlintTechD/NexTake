import React, { useEffect, useState } from "react";
import { ScreenView } from "../types";
import { getArticleById } from "../lib/supabase";

import {
  Bookmark,
  Share2,
  ArrowRight,
  Zap,
  Play,
  ArrowUp,
} from "lucide-react";

interface ArticleViewProps {
  onNavigate: (screen: ScreenView, param?: string) => void;
  savedIds?: string[];
  onToggleSave: (id: string) => void;
  articleId?: string;
}

interface Article {
  id: string;
  title: string;
  category?: string;
  excerpt?: string;
  content?: string;
  author?: string;
  avatar?: string;
  image?: string;
  date?: string;
  readTime?: string;
  read_time?: string;
  status?: string;
  created_at?: string;
  heroAperture?: string;
  views?: number;
  likes?: number;
  comments?: number;
  saves?: number;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  onNavigate,
  savedIds = [],
  onToggleSave,
  articleId,
}) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [commentDraft, setCommentDraft] = useState<string>('');
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [commentList, setCommentList] = useState<string[]>([]);

  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  /*
   * Load the selected article from Supabase with cleanup handling.
   */
  useEffect(() => {
    let isMounted = true;

    const loadArticle = async () => {
      if (!articleId) {
        if (isMounted) {
          setArticle(null);
          setLoading(false);
        }
        return;
      }

      if (isMounted) setLoading(true);

      try {
        const data = await getArticleById(articleId);

        if (isMounted) {
          if (data) {
            const statsResponse = await fetch(`/api/public/article/${encodeURIComponent(articleId)}/engagement`);
            const stats = statsResponse.ok ? await statsResponse.json() : null;
            const resolved = {
              ...(data as Article),
              views: Number(stats?.views ?? (data as Article).views ?? 0),
              likes: Number(stats?.likes ?? 0),
              comments: Number(stats?.comments ?? 0),
              saves: Number(stats?.saves ?? 0),
            };
            setArticle(resolved);
            setCommentList(stats?.commentTexts ?? []);
            setIsSaved((savedIds ?? []).includes(articleId));
            setIsLiked(window.localStorage.getItem(`nextake-liked-${articleId}`) === 'true');
          } else {
            setArticle(null);
          }
        }

        if (isMounted) {
          fetch(`/api/public/article/${encodeURIComponent(articleId)}/engagement`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'view' }),
          }).catch(() => undefined);
        }
      } catch (error) {
        console.error("Error loading article:", error);
        if (isMounted) {
          setArticle(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadArticle();

    return () => {
      isMounted = false;
    };
  }, [articleId, savedIds]);

  const toggleFollow = (name: string) => {
    setFollowingMap((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
   * Loading state
   */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-sm font-mono text-slate-400">Loading article...</p>
      </div>
    );
  }

  /*
   * Article not found
   */
  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <h1 className="text-2xl font-black text-slate-900">
          Article not found
        </h1>

        <p className="text-sm text-slate-500 mt-2 mb-6 text-center max-w-md">
          This article may have been removed, does not exist, or is no longer
          published.
        </p>

        <button
          onClick={() => onNavigate("home")}
          className="px-4 py-2 bg-slate-950 text-white rounded text-sm font-mono hover:bg-slate-800 transition-colors"
        >
          Back to home
        </button>
      </div>
    );
  }

  const articleReadTime =
    article.readTime || article.read_time || "5 min read";

  const formattedDate =
    article.date ||
    (article.created_at
      ? new Date(article.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Recently published");

  const articleCategory = article.category || "General";
  const articleAuthor = article.author || "Editorial Team";

  return (
    <div className="bg-white text-slate-900 min-h-screen pb-24">
      {/* =========================================
          ARTICLE CONTAINER
      ========================================== */}
      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        {/* =========================================
            HEADER BREADCRUMB / CLASSIFICATION
        ========================================== */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-2 text-emerald-700 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>• {articleCategory}</span>
          </div>

          <div className="text-slate-500 flex items-center space-x-2">
            <span
              style={{
                fontFamily: "var(--font-mono, 'Inter', sans-serif)",
              }}
            >
              Peer verified
            </span>

            <span>•</span>

            <span
              style={{
                fontFamily: "var(--font-mono, 'Inter', sans-serif)",
              }}
            >
              Archival grade
            </span>
          </div>
        </div>

        {/* =========================================
            TITLE & SUBTITLE
        ========================================== */}
        <div className="pt-6 pb-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 leading-[1.12] mb-5">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-slate-600 text-lg sm:text-xl font-normal leading-relaxed max-w-4xl">
              {article.excerpt}
            </p>
          )}
        </div>

        {/* =========================================
            AUTHOR METADATA BAR
        ========================================== */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200 mb-8">
          <div className="flex items-center space-x-3">
            <img
              src={article.avatar || "https://i.pravatar.cc/64?img=60"}
              alt={articleAuthor}
              className="w-9 h-9 rounded-full object-cover border border-slate-300"
            />

            <div>
              <div className="text-xs font-mono font-bold text-slate-900">
                {articleAuthor}
              </div>

              <div className="text-[11px] font-mono text-slate-500">
                {formattedDate} • {articleReadTime}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-wrap">
            <button
              onClick={async () => {
                const nextState = !isSaved;
                setIsSaved(nextState);
                onToggleSave(article.id);
                await fetch(`/api/public/article/${encodeURIComponent(article.id)}/engagement`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ action: nextState ? 'save' : 'unsave' }),
                });
                setArticle((current) => current ? { ...current, saves: Math.max(0, (current.saves ?? 0) + (nextState ? 1 : -1)) } : current);
              }}
              className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded text-xs font-mono font-bold transition-colors ${
                isSaved
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                  : "bg-slate-950 text-white hover:bg-slate-800"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>{isSaved ? "Saved" : "Save story"}</span>
            </button>

            <button
              onClick={async () => {
                const nextState = !isLiked;
                setIsLiked(nextState);
                if (nextState) {
                  window.localStorage.setItem(`nextake-liked-${article.id}`, 'true');
                } else {
                  window.localStorage.removeItem(`nextake-liked-${article.id}`);
                }
                await fetch(`/api/public/article/${encodeURIComponent(article.id)}/engagement`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ action: nextState ? 'like' : 'unlike' }),
                });
                setArticle((current) => current ? { ...current, likes: Math.max(0, (current.likes ?? 0) + (nextState ? 1 : -1)) } : current);
              }}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold transition-colors ${
                isLiked ? 'bg-rose-50 text-rose-700 border border-rose-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{isLiked ? 'Liked' : 'Like'}</span>
              <span>{(article.likes ?? 0).toLocaleString()}</span>
            </button>

            <button
              onClick={() => {
                const articleUrl = `${window.location.origin}/article/${encodeURIComponent(article.id)}`;
                if (navigator.clipboard?.writeText) {
                  navigator.clipboard
                    .writeText(articleUrl)
                    .then(() => {
                      alert("Article link copied to clipboard.");
                    })
                    .catch(() => {
                      alert(`Share this article: ${articleUrl}`);
                    });
                } else {
                  alert(`Share this article: ${articleUrl}`);
                }
              }}
              className="p-1.5 rounded border border-slate-300 hover:bg-slate-50 text-slate-600 transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* =========================================
            HERO IMAGE
        ========================================== */}
        {article.image && (
          <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 mb-8 shadow-lg">
            <div className="relative aspect-video sm:aspect-[21/9]">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover opacity-90"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              {/* Bottom HUD Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-slate-950/90 backdrop-blur-sm border-t border-slate-800 px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-slate-300 gap-1">
                <span className="text-emerald-400 truncate max-w-[70%]">
                  {article.heroAperture ||
                    `${articleCategory} • Published article`}
                </span>

                <span className="text-slate-400 shrink-0">
                  Published • {articleReadTime}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            MULTI-COLUMN PROSE + SIDEBAR
        ========================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* =======================================
              MAIN ARTICLE
          ======================================== */}
          <div className="lg:col-span-8 space-y-8 text-slate-800 font-editorial text-lg leading-[1.8]">
            {/* =====================================
                REAL ARTICLE CONTENT FROM SUPABASE
            ====================================== */}
            <div className="font-editorial text-lg text-slate-800 leading-[1.8] whitespace-pre-wrap">
              {article.content ? (
                article.content
              ) : (
                <p className="text-slate-400">No article content available.</p>
              )}
            </div>

            {article.excerpt && (
              <div className="rounded-xl border-2 border-[#00f2aa]/70 bg-gradient-to-br from-emerald-50/50 to-cyan-50/30 p-6 sm:p-8 relative shadow-sm">
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-emerald-500/20">
                  <div className="flex items-center space-x-2 font-mono text-xs font-bold text-emerald-900 tracking-wider">
                    <span>What should I know?</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] border border-emerald-300">
                      Article summary
                    </span>
                  </div>

                  <Zap className="w-4 h-4 text-emerald-600" />
                </div>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
            )}

            <div className="rounded-xl bg-[#090d14] text-white p-5 sm:p-6 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
              <div className="flex items-center space-x-4">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onNavigate("shorts")}
                  onKeyDown={(e) => e.key === "Enter" && onNavigate("shorts")}
                  className="w-16 h-20 rounded bg-slate-800 overflow-hidden relative group cursor-pointer shrink-0 border border-slate-700"
                >
                  <img
                    src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=200&q=80"
                    alt="Short Preview"
                    className="w-full h-full object-cover opacity-80"
                  />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shadow">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-mono text-emerald-400 font-bold mb-1">
                    • The 60-second edit • Vertical brief
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white mb-1">
                    Continue exploring the latest stories
                  </h3>

                  <p className="text-xs text-slate-400">
                    Discover more short-form stories and editorial briefs.
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate("shorts")}
                className="px-4 py-2 rounded bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-mono font-bold tracking-wider shrink-0 transition-colors flex items-center space-x-1"
              >
                <span>Open shorts viewer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5" aria-label="Article activity">
              <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-600">Activity</h2>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-600">
                <span className="inline-flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-emerald-600" /> {(article.views ?? 0).toLocaleString()} views</span>
                <span className="inline-flex items-center gap-1.5"><ArrowUp className="h-3.5 w-3.5 text-emerald-600" /> {(article.likes ?? 0).toLocaleString()} likes</span>
                <span className="inline-flex items-center gap-1.5"><Bookmark className="h-3.5 w-3.5 text-emerald-600" /> {(article.saves ?? 0).toLocaleString()} saves</span>
                <span className="inline-flex items-center gap-1.5"><Share2 className="h-3.5 w-3.5 text-emerald-600" /> {(article.comments ?? 0).toLocaleString()} comments</span>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5" aria-label="Comments">
              <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-600">Comments</h2>
              <div className="mt-4 space-y-3">
                {commentList.length > 0 ? (
                  commentList.slice(0, 5).map((comment, index) => (
                    <div key={`${comment}-${index}`} className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
                      {comment}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No comments yet. Be the first to comment.</p>
                )}
              </div>

              {commentList.length > 5 && (
                <button
                  type="button"
                  onClick={() => onNavigate("comments", article.id)}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline"
                >
                  <span>View more comments</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}

              <form
                className="mt-5 flex flex-col gap-3 sm:flex-row"
                onSubmit={async (event) => {
                  event.preventDefault();
                  const trimmed = commentDraft.trim();
                  if (!trimmed) return;

                  const response = await fetch(`/api/public/article/${encodeURIComponent(article.id)}/engagement`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'comment', comment: trimmed }),
                  });

                  if (response.ok) {
                    const payload = await response.json();
                    setCommentList(payload.commentTexts ?? []);
                    setArticle((current) => current ? { ...current, comments: Number(payload.comments ?? current.comments ?? 0) } : current);
                  }

                  setCommentDraft('');
                }}
              >
                <input
                  type="text"
                  value={commentDraft}
                  onChange={(event) => setCommentDraft(event.target.value)}
                  placeholder="Drop a thought on the article"
                  className="flex-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-slate-800"
                >
                  Post Comment
                </button>
              </form>
            </section>

            {/* =====================================
                SECTION 02
            ====================================== */}
            <div className="pt-8 font-sans">
              <div className="text-xs font-mono text-slate-400 tracking-wider font-bold mb-1">
                Article analysis
              </div>

              <h2 className="text-2xl font-black tracking-tight text-slate-950 font-sans mb-4">
                {articleCategory} / Editorial Analysis
              </h2>

              <p className="font-editorial text-lg text-slate-800 leading-[1.8] mb-6">
                This section contains the published analysis associated with
                this story. The article content above is loaded directly from
                the published record in Supabase.
              </p>

              {/* =================================
                  FIGURE / ARTICLE DATA CARD
              ================================== */}
              <div className="my-8 rounded-xl border border-slate-200 bg-slate-50 p-5 font-mono">
                <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-200 mb-4">
                  <span className="font-bold text-slate-800">
                    Article metadata
                  </span>
                  <span>Published</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-slate-400 mb-1">Category</div>
                    <div className="font-bold text-slate-800">
                      {articleCategory}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-400 mb-1">Author</div>
                    <div className="font-bold text-slate-800">
                      {articleAuthor}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-400 mb-1">Read time</div>
                    <div className="font-bold text-slate-800">
                      {articleReadTime}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-400 mb-1">Status</div>
                    <div className="font-bold text-emerald-700 capitalize">
                      {article.status || "published"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =======================================
              ARTICLE SIDEBAR
          ======================================== */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 rounded-lg border border-slate-200 bg-slate-50 p-5">
              <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-4">
                Article information
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Category</span>
                  <span className="font-semibold text-slate-900 text-right">
                    {articleCategory}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Author</span>
                  <span className="font-semibold text-slate-900 text-right">
                    {articleAuthor}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Published</span>
                  <span className="font-semibold text-slate-900 text-right">
                    {formattedDate}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Read time</span>
                  <span className="font-semibold text-slate-900 text-right">
                    {articleReadTime}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Status</span>
                  <span className="font-semibold text-emerald-700 text-right capitalize">
                    {article.status || "published"}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* =========================================
            GO DEEPER
        ========================================== */}
        <section className="mt-16 pt-12 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-2">
            <div>
              <span className="text-xs font-mono font-bold tracking-wider text-slate-400">
                Synthesis intelligence
              </span>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">
                Go Deeper
              </h2>
            </div>

            <span className="text-xs font-mono text-slate-500">
              Explore more from this publication
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Related Article */}
            <div
              onClick={() => onNavigate("home")}
              className="bg-slate-50 rounded-lg border border-slate-200 p-5 hover:border-slate-400 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-3">
                  <span className="text-slate-700 font-bold">
                    [Latest articles]
                  </span>
                  <span>Explore</span>
                </div>

                <div className="aspect-video bg-slate-900 rounded overflow-hidden mb-3">
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-mono">
                      No image
                    </div>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">
                  Explore more published stories
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2">
                  Return to the latest stories and discover more published
                  articles.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200 flex items-center space-x-1 text-xs font-mono font-bold text-emerald-700 group-hover:underline">
                <span>Read more stories</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Interview */}
            <div
              onClick={() => onNavigate("interview")}
              className="bg-slate-50 rounded-lg border border-slate-200 p-5 hover:border-slate-400 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-3">
                  <span className="text-slate-700 font-bold">
                    [Related interview]
                  </span>
                  <span>Video</span>
                </div>

                <div className="aspect-video bg-slate-900 rounded overflow-hidden mb-3 relative">
                  <img
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80"
                    alt="Interview"
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform"
                  />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">
                  Explore our latest interviews
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2">
                  Watch conversations and interviews from the publication.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200 flex items-center space-x-1 text-xs font-mono font-bold text-emerald-700 group-hover:underline">
                <span>Watch conversation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Shorts */}
            <div
              onClick={() => onNavigate("shorts")}
              className="bg-slate-50 rounded-lg border border-slate-200 p-5 hover:border-slate-400 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-3">
                  <span className="text-slate-700 font-bold">
                    [Related short]
                  </span>
                  <span>Short</span>
                </div>

                <div className="aspect-video bg-slate-900 rounded overflow-hidden mb-3 relative">
                  <img
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80"
                    alt="Technology short"
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform"
                  />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">
                  Watch the latest short-form stories
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2">
                  Get quick visual breakdowns of the latest stories.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200 flex items-center space-x-1 text-xs font-mono font-bold text-emerald-700 group-hover:underline">
                <span>Play short</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            DISPATCH CUSTOMIZATION
        ========================================== */}
        <section className="mt-12 p-6 rounded-xl bg-slate-100 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-slate-400 font-bold">
              Dispatch customization protocol
            </span>

            <h3 className="text-base font-bold text-slate-900">
              Stay Ahead of the Latest Stories
            </h3>

            <p className="text-xs text-slate-500">
              Follow the category or author of this article to configure your
              editorial interests.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {[
              { label: "Category", name: articleCategory },
              { label: "Author", name: articleAuthor },
            ].map((ent) => {
              const followed = followingMap[ent.name];

              return (
                <div key={`${ent.label}-${ent.name}`} className="text-center">
                  <div className="text-[9px] font-mono text-slate-400 mb-0.5">
                    {ent.label}
                  </div>

                  <button
                    onClick={() => toggleFollow(ent.name)}
                    className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-colors ${
                      followed
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-950 hover:bg-slate-800 text-white"
                    }`}
                  >
                    {ent.name} {followed ? "✓" : "+"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================
            BACK TO HOME
        ========================================== */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <button
            onClick={() => onNavigate("home")}
            className="inline-flex items-center space-x-2 text-sm font-mono font-bold text-slate-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span>Back to latest stories</span>
          </button>
        </div>
      </article>

      {/* =========================================
          STICKY BOTTOM READING BAR
      ========================================== */}
      <aside
        aria-label="Reading controls"
        className="fixed bottom-0 inset-x-0 bg-[#070b10] border-t border-[#1f2937] text-white py-3 px-4 z-30 shadow-2xl"
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-3 truncate mr-4">
            <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold shrink-0 border border-emerald-500/40">
              Reading
            </span>

            <span className="text-slate-300 truncate font-semibold">
              {article.title}
            </span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => onToggleSave(article.id)}
              className="px-3 py-1.5 rounded border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center space-x-1.5 transition-colors"
            >
              <Bookmark className="w-3 h-3 fill-current" />
              <span>{isSaved ? "Saved" : "Save"}</span>
            </button>

            <button
              onClick={scrollToTop}
              className="p-1.5 rounded border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Scroll to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};