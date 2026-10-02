export const COMMENT_PAGE_SIZE = 5;

export const normalizeComments = (comments: unknown[] = []) =>
  comments
    .map((comment) => String(comment ?? '').trim())
    .filter(Boolean);

export const getLatestCommentsPage = (
  comments: string[] = [],
  page = 1,
  pageSize = COMMENT_PAGE_SIZE,
) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safePageSize = Math.max(1, Number(pageSize) || 1);
  const ordered = normalizeComments(comments).slice().reverse();
  const start = (safePage - 1) * safePageSize;
  return ordered.slice(start, start + safePageSize);
};

export const getCommentPageCount = (comments: string[] = [], pageSize = COMMENT_PAGE_SIZE) => {
  const total = normalizeComments(comments).length;
  const safePageSize = Math.max(1, Number(pageSize) || 1);
  return total === 0 ? 0 : Math.ceil(total / safePageSize);
};
