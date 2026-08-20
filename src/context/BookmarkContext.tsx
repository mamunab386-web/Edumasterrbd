import React, { createContext, useContext, useEffect, useState } from 'react';
import { BookmarkItem } from '../types';
import { useToast } from './ToastContext';

interface BookmarkContextType {
  bookmarks: BookmarkItem[];
  addBookmark: (item: Omit<BookmarkItem, 'id' | 'savedAt'>) => void;
  removeBookmark: (itemId: string) => void;
  clearBookmarks: () => void;
  isBookmarked: (itemId: string) => boolean;
  recentlyViewed: { id: string; title: string; link: string; type: string; timestamp: number }[];
  addRecentlyViewed: (item: { id: string; title: string; link: string; type: string }) => void;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

const BOOKMARK_KEY = 'edumaster_bookmarks_v1';
const RECENT_KEY = 'edumaster_recent_views_v1';

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKMARK_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentlyViewed, setRecentlyViewed] = useState<
    { id: string; title: string; link: string; type: string; timestamp: number }[]
  >(() => {
    try {
      const saved = localStorage.getItem(RECENT_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem(RECENT_KEY, JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const isBookmarked = (itemId: string): boolean => {
    return bookmarks.some((b) => b.itemId === itemId);
  };

  const addBookmark = (item: Omit<BookmarkItem, 'id' | 'savedAt'>) => {
    if (isBookmarked(item.itemId)) {
      removeBookmark(item.itemId);
      return;
    }
    const newItem: BookmarkItem = {
      ...item,
      id: 'bm-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      savedAt: new Date().toISOString()
    };
    setBookmarks((prev) => [newItem, ...prev]);
    showToast('বুকমার্কে সংরক্ষণ করা হয়েছে', 'success');
  };

  const removeBookmark = (itemId: string) => {
    setBookmarks((prev) => prev.filter((b) => b.itemId !== itemId));
    showToast('বুকমার্ক থেকে মুছে ফেলা হয়েছে', 'info');
  };

  const clearBookmarks = () => {
    setBookmarks([]);
    showToast('সকল বুকমার্ক মুছে ফেলা হয়েছে', 'info');
  };

  const addRecentlyViewed = (item: { id: string; title: string; link: string; type: string }) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== item.id);
      return [{ ...item, timestamp: Date.now() }, ...filtered].slice(0, 10);
    });
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
        recentlyViewed,
        addRecentlyViewed
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = (): BookmarkContextType => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
};
