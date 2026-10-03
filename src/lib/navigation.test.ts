import test from 'node:test';
import assert from 'node:assert/strict';

import { getRouteFromPath } from './navigation';

test('maps startup article paths to the startup article screen', () => {
  assert.deepStrictEqual(getRouteFromPath('/startup/paystack'), {
    screen: 'startup-article',
    articleId: 'paystack',
  });
});

test('maps startup routes without ids back to the startups list', () => {
  assert.deepStrictEqual(getRouteFromPath('/startups'), {
    screen: 'startups',
    articleId: 'dispatch-842',
  });
});

test('maps the latest route to the published story feed', () => {
  assert.deepStrictEqual(getRouteFromPath('/latest'), {
    screen: 'latest',
    articleId: 'dispatch-842',
  });
});

test('maps the events route to the events screen', () => {
  assert.deepStrictEqual(getRouteFromPath('/events'), {
    screen: 'events',
    articleId: 'dispatch-842',
  });
});
