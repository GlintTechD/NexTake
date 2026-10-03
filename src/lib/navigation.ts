import type { ScreenView } from '../types';

export interface RouteState {
  screen: ScreenView;
  articleId: string;
}

export const getRouteFromPath = (path: string): RouteState => {
  if (!path || path === '/') {
    return { screen: 'home', articleId: 'dispatch-842' };
  }

  if (path.startsWith('/article/') && path.endsWith('/comments')) {
    const articleId = decodeURIComponent(path.slice('/article/'.length, -'/comments'.length));
    return {
      screen: articleId ? 'comments' : 'home',
      articleId: articleId || 'dispatch-842',
    };
  }

  if (path.startsWith('/article/')) {
    const articleId = decodeURIComponent(path.slice('/article/'.length));
    return {
      screen: articleId ? 'article' : 'home',
      articleId: articleId || 'dispatch-842',
    };
  }

  if (path.startsWith('/startup/')) {
    const startupId = decodeURIComponent(path.slice('/startup/'.length));
    return {
      screen: startupId ? 'startup-article' : 'startups',
      articleId: startupId || 'paystack',
    };
  }

  if (path === '/latest') {
    return { screen: 'latest', articleId: 'dispatch-842' };
  }

  if (path === '/explore') {
    return { screen: 'explore', articleId: 'dispatch-842' };
  }

  if (path === '/shorts') {
    return { screen: 'shorts', articleId: 'dispatch-842' };
  }

  if (path === '/interview') {
    return { screen: 'interview', articleId: 'dispatch-842' };
  }

  if (path === '/startups') {
    return { screen: 'startups', articleId: 'dispatch-842' };
  }

  if (path === '/events') {
    return { screen: 'events', articleId: 'dispatch-842' };
  }

  return { screen: 'home', articleId: 'dispatch-842' };
};
