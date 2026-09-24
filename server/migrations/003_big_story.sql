-- Allow editors to explicitly choose the article shown in the homepage Big Story slot.
ALTER TABLE IF EXISTS public.articles
  ADD COLUMN IF NOT EXISTS is_big_story boolean NOT NULL DEFAULT false;

CREATE UNIQUE INDEX IF NOT EXISTS articles_single_big_story_idx
  ON public.articles (is_big_story)
  WHERE is_big_story = true;