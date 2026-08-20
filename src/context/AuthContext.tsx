import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../types';
import { auth, isFirebaseConfigured } from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  registerWithEmail: (email: string, pass: string, name: string, classLevel?: 'ssc' | 'hsc') => Promise<boolean>;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (email: string, pass: string, name: string, classLevel?: 'ssc' | 'hsc') => Promise<boolean>;
  loginAsDemoAdmin: () => void;
  loginWithDemoAdmin: () => void;
  loginAsDemoStudent: (name?: string, classLevel?: 'ssc' | 'hsc') => void;
  loginWithDemoStudent: (name?: string, classLevel?: 'ssc' | 'hsc') => void;
  logout: () => Promise<void>;
  updateStudentTarget: (classLevel: 'ssc' | 'hsc', board?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = (
  import.meta.env.VITE_ADMIN_EMAILS || 'admin@edumasterbd.com,mamunab386@gmail.com'
)
  .toLowerCase()
  .split(',')
  .map((e: string) => e.trim());

const LOCAL_USER_KEY = 'edumaster_current_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkIsAdmin = (email?: string | null): boolean => {
    if (!email) return false;
    const normalized = email.toLowerCase().trim();
    return ADMIN_EMAILS.includes(normalized) || normalized.includes('admin@');
  };

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          const isUserAdmin = checkIsAdmin(fbUser.email);
          const profile: UserProfile = {
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || (isUserAdmin ? 'Admin Manager' : 'Student'),
            role: isUserAdmin ? 'admin' : 'student',
            photoURL: fbUser.photoURL || undefined,
            completedQuizzesCount: 0,
            totalScore: 0,
            joinedAt: new Date().toISOString()
          };
          setUser(profile);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
        } else {
          // If no firebase user, retain local guest/demo unless explicitly logged out
          const saved = localStorage.getItem(LOCAL_USER_KEY);
          if (saved) {
            try {
              setUser(JSON.parse(saved));
            } catch {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
        setIsLoading(false);
      });
      return () => unsubscribe();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loginWithEmail = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        const isUserAdmin = checkIsAdmin(cred.user.email);
        const profile: UserProfile = {
          uid: cred.user.uid,
          email: cred.user.email || email,
          displayName: cred.user.displayName || (isUserAdmin ? 'এডমিন ম্যানেজার' : 'শিক্ষার্থী'),
          role: isUserAdmin ? 'admin' : 'student',
          completedQuizzesCount: 0,
          totalScore: 0,
          joinedAt: new Date().toISOString()
        };
        setUser(profile);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
        setIsLoading(false);
        return true;
      } else {
        // Fallback for offline / demo mode
        const isUserAdmin = checkIsAdmin(email) || email === 'admin@edumasterbd.com';
        const profile: UserProfile = {
          uid: 'local-' + Date.now(),
          email,
          displayName: isUserAdmin ? 'এডমিন ম্যানেজার' : 'শিক্ষার্থী',
          role: isUserAdmin ? 'admin' : 'student',
          completedQuizzesCount: 0,
          totalScore: 0,
          joinedAt: new Date().toISOString()
        };
        setUser(profile);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
        setIsLoading(false);
        return true;
      }
    } catch (e: any) {
      console.error('Login error:', e);
      setIsLoading(false);
      throw e;
    }
  };

  const registerWithEmail = async (
    email: string,
    pass: string,
    name: string,
    classLevel: 'ssc' | 'hsc' = 'ssc'
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        const isUserAdmin = checkIsAdmin(cred.user.email);
        const profile: UserProfile = {
          uid: cred.user.uid,
          email: cred.user.email || email,
          displayName: name || 'Student',
          role: isUserAdmin ? 'admin' : 'student',
          classLevel,
          completedQuizzesCount: 0,
          totalScore: 0,
          joinedAt: new Date().toISOString()
        };
        setUser(profile);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
        setIsLoading(false);
        return true;
      } else {
        const isUserAdmin = checkIsAdmin(email);
        const profile: UserProfile = {
          uid: 'local-' + Date.now(),
          email,
          displayName: name || 'Student',
          role: isUserAdmin ? 'admin' : 'student',
          classLevel,
          completedQuizzesCount: 0,
          totalScore: 0,
          joinedAt: new Date().toISOString()
        };
        setUser(profile);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
        setIsLoading(false);
        return true;
      }
    } catch (e: any) {
      console.error('Registration error:', e);
      setIsLoading(false);
      throw e;
    }
  };

  const loginAsDemoAdmin = () => {
    const adminUser: UserProfile = {
      uid: 'admin-master-uid',
      email: 'admin@edumasterbd.com',
      displayName: 'প্রধান এডমিন ও মডারেটর',
      role: 'admin',
      completedQuizzesCount: 0,
      totalScore: 0,
      joinedAt: new Date().toISOString()
    };
    setUser(adminUser);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(adminUser));
  };

  const loginAsDemoStudent = (name: string = 'রাকিব আহমেদ', classLevel: 'ssc' | 'hsc' = 'ssc') => {
    const studentUser: UserProfile = {
      uid: 'student-demo-' + Math.floor(Math.random() * 1000),
      email: 'student@example.com',
      displayName: name,
      role: 'student',
      classLevel,
      targetBoard: 'Dhaka',
      completedQuizzesCount: 4,
      totalScore: 78,
      joinedAt: new Date().toISOString()
    };
    setUser(studentUser);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(studentUser));
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.error('SignOut error:', e);
      }
    }
    setUser(null);
    localStorage.removeItem(LOCAL_USER_KEY);
  };

  const updateStudentTarget = (classLevel: 'ssc' | 'hsc', board?: string) => {
    if (user) {
      const updated: UserProfile = {
        ...user,
        classLevel,
        targetBoard: (board as any) || user.targetBoard
      };
      setUser(updated);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === 'admin' || checkIsAdmin(user?.email),
        isLoading,
        loginWithEmail,
        registerWithEmail,
        login: loginWithEmail,
        signup: registerWithEmail,
        loginAsDemoAdmin,
        loginWithDemoAdmin: loginAsDemoAdmin,
        loginAsDemoStudent,
        loginWithDemoStudent: loginAsDemoStudent,
        logout,
        updateStudentTarget
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
