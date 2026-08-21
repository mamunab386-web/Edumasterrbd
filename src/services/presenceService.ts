import { db } from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  getDocs,
  writeBatch
} from 'firebase/firestore';

export interface ActiveSession {
  sessionId: string;
  lastActive: number;
  currentPath: string;
  category: 'ssc' | 'hsc' | 'test' | 'notes' | 'general';
  deviceType: 'mobile' | 'desktop' | 'tablet';
}

export interface PresenceStats {
  totalActive: number;
  sscCount: number;
  hscCount: number;
  testCount: number;
  notesCount: number;
  generalCount: number;
}

const SESSION_KEY = 'edumaster_session_id';
const LOCAL_PRESENCE_KEY = 'edumaster_local_presence_sessions';
const HEARTBEAT_INTERVAL_MS = 15000;
const SESSION_TIMEOUT_MS = 45000; // considered inactive after 45s

// Generate or retrieve current tab/device unique session ID
export const getSessionId = (): string => {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = 'sess_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
};

const getCategoryFromPath = (path: string): 'ssc' | 'hsc' | 'test' | 'notes' | 'general' => {
  if (path.startsWith('/ssc')) return 'ssc';
  if (path.startsWith('/hsc')) return 'hsc';
  if (path.startsWith('/test')) return 'test';
  if (path.startsWith('/notes') || path.startsWith('/pdf') || path.startsWith('/board')) return 'notes';
  return 'general';
};

const getDeviceType = (): 'mobile' | 'desktop' | 'tablet' => {
  const ua = navigator.userAgent.toLowerCase();
  if (/mobile|android|iphone|ipod/.test(ua)) return 'mobile';
  if (/ipad|tablet/.test(ua)) return 'tablet';
  return 'desktop';
};

class PresenceManager {
  private sessionId: string;
  private heartbeatTimer: any = null;
  private unsubscribeFirestore: (() => void) | null = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private listeners: Set<(stats: PresenceStats) => void> = new Set();
  private currentStats: PresenceStats = {
    totalActive: 1,
    sscCount: 0,
    hscCount: 0,
    testCount: 0,
    notesCount: 0,
    generalCount: 1
  };

  constructor() {
    this.sessionId = getSessionId();
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.broadcastChannel = new BroadcastChannel('edumaster_realtime_presence');
      this.broadcastChannel.onmessage = () => {
        this.syncLocalSessions();
      };
    }
  }

  public startTracking(currentPath: string = window.location.pathname) {
    this.updateHeartbeat(currentPath);

    // Run heartbeat every 15s
    if (!this.heartbeatTimer) {
      this.heartbeatTimer = setInterval(() => {
        this.updateHeartbeat(window.location.pathname);
      }, HEARTBEAT_INTERVAL_MS);
    }

    // Subscribe to real active users
    if (db) {
      this.initFirestorePresence();
    } else {
      this.syncLocalSessions();
    }

    // Unload listener to quickly remove current session
    window.addEventListener('beforeunload', this.handleUnload);
    window.addEventListener('pagehide', this.handleUnload);
  }

  public stopTracking() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.unsubscribeFirestore) {
      this.unsubscribeFirestore();
      this.unsubscribeFirestore = null;
    }
    this.handleUnload();
    window.removeEventListener('beforeunload', this.handleUnload);
    window.removeEventListener('pagehide', this.handleUnload);
  }

  public subscribe(callback: (stats: PresenceStats) => void): () => void {
    this.listeners.add(callback);
    callback(this.currentStats);
    return () => {
      this.listeners.delete(callback);
    };
  }

  public getCurrentStats(): PresenceStats {
    return this.currentStats;
  }

  private notifyListeners() {
    this.listeners.forEach((cb) => cb(this.currentStats));
  }

  private async updateHeartbeat(currentPath: string) {
    const sessionData: ActiveSession = {
      sessionId: this.sessionId,
      lastActive: Date.now(),
      currentPath,
      category: getCategoryFromPath(currentPath),
      deviceType: getDeviceType()
    };

    // 1. Firebase Firestore updates if available
    if (db) {
      try {
        const sessionRef = doc(db, 'presence_sessions', this.sessionId);
        await setDoc(sessionRef, sessionData);
      } catch (err) {
        // Fallback to local storage if Firestore write fails
        this.saveLocalSession(sessionData);
      }
    } else {
      // 2. Local session synchronization across open tabs & windows
      this.saveLocalSession(sessionData);
    }
  }

  private handleUnload = () => {
    // Firestore delete
    if (db) {
      try {
        const sessionRef = doc(db, 'presence_sessions', this.sessionId);
        deleteDoc(sessionRef);
      } catch (e) {
        // ignore on unload
      }
    }

    // Local storage delete
    try {
      const raw = localStorage.getItem(LOCAL_PRESENCE_KEY);
      if (raw) {
        const sessions: Record<string, ActiveSession> = JSON.parse(raw);
        delete sessions[this.sessionId];
        localStorage.setItem(LOCAL_PRESENCE_KEY, JSON.stringify(sessions));
        this.broadcastChannel?.postMessage({ type: 'session_removed', id: this.sessionId });
      }
    } catch (e) {
      // ignore
    }
  };

  private initFirestorePresence() {
    if (!db) return;
    try {
      const colRef = collection(db, 'presence_sessions');
      this.unsubscribeFirestore = onSnapshot(colRef, (snapshot) => {
        const now = Date.now();
        let ssc = 0;
        let hsc = 0;
        let test = 0;
        let notes = 0;
        let general = 0;
        let activeTotal = 0;

        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as ActiveSession;
          if (now - (data.lastActive || 0) < SESSION_TIMEOUT_MS) {
            activeTotal++;
            if (data.category === 'ssc') ssc++;
            else if (data.category === 'hsc') hsc++;
            else if (data.category === 'test') test++;
            else if (data.category === 'notes') notes++;
            else general++;
          }
        });

        // Always at least 1 (the current user)
        const total = Math.max(1, activeTotal);

        this.currentStats = {
          totalActive: total,
          sscCount: ssc,
          hscCount: hsc,
          testCount: test,
          notesCount: notes,
          generalCount: Math.max(1, general)
        };
        this.notifyListeners();
      });
    } catch (err) {
      console.warn('Firestore presence subscription error, falling back to local:', err);
      this.syncLocalSessions();
    }
  }

  private saveLocalSession(sessionData: ActiveSession) {
    try {
      const raw = localStorage.getItem(LOCAL_PRESENCE_KEY);
      const sessions: Record<string, ActiveSession> = raw ? JSON.parse(raw) : {};
      sessions[this.sessionId] = sessionData;

      // Filter out stale sessions (> 45s)
      const now = Date.now();
      const cleaned: Record<string, ActiveSession> = {};
      Object.entries(sessions).forEach(([id, sess]) => {
        if (now - sess.lastActive < SESSION_TIMEOUT_MS) {
          cleaned[id] = sess;
        }
      });

      localStorage.setItem(LOCAL_PRESENCE_KEY, JSON.stringify(cleaned));
      this.broadcastChannel?.postMessage({ type: 'session_heartbeat' });
      this.calculateStatsFromLocal(cleaned);
    } catch (e) {
      // Fallback minimum 1
      this.currentStats = {
        totalActive: 1,
        sscCount: 0,
        hscCount: 0,
        testCount: 0,
        notesCount: 0,
        generalCount: 1
      };
      this.notifyListeners();
    }
  }

  private syncLocalSessions() {
    try {
      const raw = localStorage.getItem(LOCAL_PRESENCE_KEY);
      const sessions: Record<string, ActiveSession> = raw ? JSON.parse(raw) : {};
      const now = Date.now();
      const cleaned: Record<string, ActiveSession> = {};
      Object.entries(sessions).forEach(([id, sess]) => {
        if (now - sess.lastActive < SESSION_TIMEOUT_MS) {
          cleaned[id] = sess;
        }
      });
      this.calculateStatsFromLocal(cleaned);
    } catch (e) {
      this.calculateStatsFromLocal({});
    }
  }

  private calculateStatsFromLocal(sessions: Record<string, ActiveSession>) {
    let ssc = 0;
    let hsc = 0;
    let test = 0;
    let notes = 0;
    let general = 0;
    let total = 0;

    Object.values(sessions).forEach((sess) => {
      total++;
      if (sess.category === 'ssc') ssc++;
      else if (sess.category === 'hsc') hsc++;
      else if (sess.category === 'test') test++;
      else if (sess.category === 'notes') notes++;
      else general++;
    });

    const activeTotal = Math.max(1, total);

    this.currentStats = {
      totalActive: activeTotal,
      sscCount: ssc,
      hscCount: hsc,
      testCount: test,
      notesCount: notes,
      generalCount: Math.max(1, general)
    };
    this.notifyListeners();
  }
}

export const presenceService = new PresenceManager();
