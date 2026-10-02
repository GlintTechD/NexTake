import React, { useEffect, useState } from "react";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { ScreenView } from "../types";

interface CommentsViewProps {
  onNavigate: (screen: ScreenView, param?: string) => void;
  articleId: string;
}

export const CommentsView: React.FC<CommentsViewProps> = ({
  onNavigate,
  articleId,
}) => {
  const [comments, setComments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    let isMounted = true;

    fetch(`/api/public/article/${encodeURIComponent(articleId)}/engagement`)
      .then(async (response) => {
        if (!response.ok) return;
        const payload = await response.json();
        if (isMounted) setComments(Array.isArray(payload.commentTexts) ? payload.commentTexts : []);
      })
      .catch(() => undefined)
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [articleId]);

  const totalPages = Math.max(1, Math.ceil(comments.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleComments = comments.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div className="min-h-screen bg-white px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => onNavigate("article", articleId)}
          className="mb-8 inline-flex items-center gap-2 text-xs font-bold text-slate-600 transition-colors hover:text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to article
        </button>

        <div className="mb-8 border-b border-slate-200 pb-6">
          <div className="mb-2 flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.18em] text-emerald-700">
            <MessageSquare className="h-4 w-4" />
            Reader discussion
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            All comments
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            The full conversation around this article.
          </p>
        </div>

        {isLoading ? (
          <p className="text-sm text-slate-500">Loading comments...</p>
        ) : comments.length > 0 ? (
          <div className="space-y-4">
            <div className="space-y-3">
              {visibleComments.map((comment, index) => (
                <article
                  key={`${comment}-${index}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700"
                >
                  {comment}
                </article>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  disabled={safePage === 1}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <p className="text-xs font-mono text-slate-500">
                  Page {safePage} of {totalPages}
                </p>

                <button
                  type="button"
                  onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                  disabled={safePage === totalPages}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
            No comments yet.
          </p>
        )}
      </div>
    </div>
  );
};
