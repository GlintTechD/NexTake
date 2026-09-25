import React, { useState, useEffect } from 'react';
import { ScreenView } from './types';
import { Navbar } from './components/Navbar';
import { HomeFeed } from './components/HomeFeed';
import { ArticleView } from './components/ArticleView';
import { ExploreView } from './components/ExploreView';
import { ShortsStage } from './components/ShortsStage';
import { InterviewView } from './components/InterviewView';
import { Footer } from './components/Footer';
import { SavedStoriesDrawer } from './components/SavedStoriesDrawer';
import { DailyEditModal } from './components/DailyEditModal';
import { ContactModal } from './components/ContactModal';
import { PostingsPortal } from './components/PostingsPortal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenView>('home');
  const [selectedArticleId, setSelectedArticleId] = useState<string>('dispatch-842');

  const syncCurrentScreenFromPath = () => {
    const path = window.location.pathname;
    if (path === '/postings') {
      return;
    }
    if (path.startsWith('/article/')) {
      const articleId = decodeURIComponent(path.slice('/article/'.length));
      if (articleId) {
        setSelectedArticleId(articleId);
      }
      setCurrentScreen('article');
      return;
    }
    if (path === '/explore') {
      setCurrentScreen('explore');
      return;
    }
    if (path === '/shorts') {
      setCurrentScreen('shorts');
      return;
    }
    if (path === '/interview') {
      setCurrentScreen('interview');
      return;
    }
    setCurrentScreen('home');
  };

  useEffect(() => {
    syncCurrentScreenFromPath();
    const onPopState = () => syncCurrentScreenFromPath();
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const [savedIds, setSavedIds] = useState<string[]>([
    'dispatch-842',
    'search-top',
    'short-1',
  ]);
  const [exploreQuery, setExploreQuery] = useState<string>('Fintech');
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isDailyEditOpen, setIsDailyEditOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Global Keyboard shortcuts: ⌘K or / to Explore
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCurrentScreen('explore');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (screen: ScreenView, param?: string) => {
    if (param) {
      if (screen === 'explore') {
        setExploreQuery(param);
      } else if (screen === 'article') {
        setSelectedArticleId(param);
      }
    }

    if (screen === 'home') {
      window.history.pushState({}, '', '/');
    } else if (screen === 'explore') {
      window.history.pushState({}, '', '/explore');
    } else if (screen === 'shorts') {
      window.history.pushState({}, '', '/shorts');
    } else if (screen === 'interview') {
      window.history.pushState({}, '', '/interview');
    } else if (screen === 'article') {
      const articleId = param ?? selectedArticleId;
      window.history.pushState({}, '', `/article/${articleId}`);
    } else if (screen === 'postings') {
      window.history.pushState({}, '', '/postings');
    }

    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRemoveSave = (id: string) => {
    setSavedIds((prev) => prev.filter((item) => item !== id));
  };

  if (window.location.pathname === '/postings') {
    return <PostingsPortal />;
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 flex flex-col font-sans selection:bg-emerald-400 selection:text-slate-950">
      {/* Top Main Navbar (visible across screens, shorts has custom header or full screen) */}
      {currentScreen !== 'shorts' && (
        <Navbar
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          savedCount={savedIds.length}
          onOpenSaved={() => setIsSavedDrawerOpen(true)}
          onOpenDailyEdit={() => setIsDailyEditOpen(true)}
          onOpenContact={() => setIsContactOpen(true)}
        />
      )}

      {/* Main View Switcher */}
      <main className="flex-1">
        {currentScreen === 'home' && (
          <HomeFeed
            onNavigate={handleNavigate}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            onOpenDailyEdit={() => setIsDailyEditOpen(true)}
            onOpenContact={() => setIsContactOpen(true)}
          />
        )}

        {currentScreen === 'article' && (
          <ArticleView
            onNavigate={handleNavigate}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            articleId={selectedArticleId}
          />
        )}

        {currentScreen === 'explore' && (
          <ExploreView
            onNavigate={handleNavigate}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            initialQuery={exploreQuery}
            onOpenDailyEdit={() => setIsDailyEditOpen(true)}
          />
        )}

        {currentScreen === 'shorts' && (
          <ShortsStage
            onNavigate={handleNavigate}
            onClose={() => setCurrentScreen('home')}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
          />
        )}

        {currentScreen === 'interview' && (
          <InterviewView
            onNavigate={handleNavigate}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
          />
        )}
      </main>

      {/* Global Footer (shown on all screens except shorts stage) */}
      {currentScreen !== 'shorts' && (
        <Footer
          onNavigate={handleNavigate}
          onOpenDailyEdit={() => setIsDailyEditOpen(true)}
          onOpenContact={() => setIsContactOpen(true)}
        />
      )}

      {/* "YOUR EDIT" Saved Stories Drawer */}
      <SavedStoriesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedIds={savedIds}
        onRemoveSave={handleRemoveSave}
        onNavigate={handleNavigate}
      />

      {/* "GET THE DAILY EDIT" Modal */}
      <DailyEditModal
        isOpen={isDailyEditOpen}
        onClose={() => setIsDailyEditOpen(false)}
      />

      {/* "CONTACT US" Editorial & Bureau Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}
