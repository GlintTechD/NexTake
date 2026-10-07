import test from "node:test";
import assert from "node:assert/strict";
import { getYouTubeEmbedUrl } from "./techMedia";

test("maps supported YouTube links to player URLs", () => {
  assert.equal(getYouTubeEmbedUrl("https://www.youtube.com/watch?v=abcdefghijk"), "https://www.youtube.com/embed/abcdefghijk");
  assert.equal(getYouTubeEmbedUrl("https://youtu.be/abcdefghijk"), "https://www.youtube.com/embed/abcdefghijk");
  assert.equal(getYouTubeEmbedUrl("https://youtube.com/shorts/abcdefghijk"), "https://www.youtube.com/embed/abcdefghijk");
});

test("rejects non-YouTube and malformed video URLs", () => {
  assert.equal(getYouTubeEmbedUrl("https://example.com/watch?v=abcdefghijk"), null);
  assert.equal(getYouTubeEmbedUrl("https://youtube.com/watch?v=short"), null);
});