import React from 'react';
import { ScreenView } from '../types';
import { FEATURED_ARTICLE, DAILY_EDIT_ITEMS, SHORTS_LIST } from '../data/mockData';
import { X, Bookmark, Trash2, ArrowRight, BookOpen, Clock } from 'lucide-react';

interface SavedStoriesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedIds: string[];
  onRemoveSave: (id: string) => void;
  onNavigate: (screen: ScreenView, param?: string) => void;
}

export const SavedStoriesDrawer: React.FC<SavedStoriesDrawerProps> = ({
  isOpen,
  onClose,
  savedIds,
  onRemoveSave,
  onNavigate,
}) => {
  if (!isOpen) return null;

  // Aggregate items that correspond to savedIds
  const allPossibleItems = [
    {
      id: FEATURED_ARTICLE.id,
      title: FEATURED_ARTICLE.title,
      category: FEATURED_ARTICLE.category,
      type: 'Monograph dispatch',
      readTime: FEATURED_ARTICLE.readTime,
      targetScreen: 'article' as ScreenView,
    },
    ...DAILY_EDIT_ITEMS.map((item) => ({
      id: `daily-${item.num}`,
      title: item.title,
      category: item.tag,
      type: 'Daily Edit',
      readTime: item.readTime,
      targetScreen: 'article' as ScreenView,
    })),
    ...SHORTS_LIST.map((short) => ({
      id: short.id,
      title: short.title,
      category: short.category,
      type: 'Tech short',
      readTime: short.duration.split(' ')[0],
      targetScreen: 'shorts' as ScreenView,
    })),
    {
      id: 'search-top',
      title: 'Cross-Border Remittances via Layer-2 Networks Surpass $10B Monthly Run Rate',
      category: 'Fintech',
      type: 'In-depth report',
      readTime: '6 min read',
      targetScreen: 'article' as ScreenView,
    },
  ];

  const savedItems = allPossibleItems.filter((item) => savedIds.includes(item.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#070b10] border-l border-slate-800 text-slate-100 flex flex-col justify-between shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between font-mono">
            <div className="flex items-center space-x-2">
              <Bookmark className="w-4 h-4 text-emerald-400 fill-current" />
              <h2 className="text-base font-bold text-white">
                Your Edit Archive
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                {savedItems.length}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white"
              title="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-xs">
            {savedItems.length === 0 ? (
              <div className="text-center py-16 space-y-3 text-slate-500">
                <BookOpen className="w-10 h-10 mx-auto stroke-[1.5] text-slate-700" />
                <p>No saved dispatches in your telemetry cache.</p>
                <p className="text-[11px] text-slate-600">
                  Click the bookmark icon on any story, monograph, or short to archive here.
                </p>
              </div>
            ) : (
              savedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-lg bg-[#0d141e] border border-slate-800/80 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="text-emerald-400 font-bold">{item.category}</span>
                      <span>{item.type}</span>
                    </div>
                    <h4
                      onClick={() => {
                        onClose();
                        onNavigate(item.targetScreen);
                      }}
                      className="text-xs font-bold text-slate-100 group-hover:text-emerald-300 transition-colors cursor-pointer leading-snug"
                    >
                      {item.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{item.readTime}</span>
                    </span>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => {
                          onClose();
                          onNavigate(item.targetScreen);
                        }}
                        className="text-emerald-400 font-bold hover:underline flex items-center space-x-0.5"
                      >
                        <span>Open</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => onRemoveSave(item.id)}
                        className="text-slate-500 hover:text-red-400 transition-colors"
                        title="Remove from archive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-800 bg-[#05080c] text-xs font-mono space-y-3">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Offline telemetry sync: Active</span>
              <span className="text-emerald-400">Encrypted local</span>
            </div>
            <button
              onClick={() => {
                onClose();
                onNavigate('home');
              }}
              className="w-full py-2.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-bold transition-colors"
            >
              Return to main feed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
