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
  loginAsAdminSecure: (email: string, pass: string) => Promise<boolean>;
  updateAdminPassword: (newPass: string) => boolean;
  logout: () => Promise<void>;
  updateStudentTarget: (classLevel: 'ssc' | 'hsc', board?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Primary Super Admin Email (Owner)
export const PRIMARY_SUPER_ADMIN_EMAIL = 'mamunab386@gmail.com';

const ADMIN_CREDENTIALS_KEY = 'edumaster_admin_credentials_v2';
const LOCAL_USER_KEY = 'edumaster_current_user_v2';

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

  // Retrieve authorized admin credentials (with defaults)
  const getAdminCredentials = () => {
    try {
      const saved = localStorage.getItem(ADMIN_CREDENTIALS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // ignore
    }
    return {
      adminEmails: [PRIMARY_SUPER_ADMIN_EMAIL.toLowerCase(), 'admin@edumasterbd.com'],
      masterPassword: 'admin' + '123456'
    };
  };

  const checkIsAdmin = (email?: string | null): boolean => {
    if (!email) return false;
    const normalized = email.toLowerCase().trim();
    const creds = getAdminCredentials();
    return creds.adminEmails.map((e: string) => e.toLowerCase().trim()).includes(normalized);
  };

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          const isUserAdmin = checkIsAdmin(fbUser.email);
          const profile: UserProfile = {
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || (isUserAdmin ? 'Super Admin (Owner)' : 'শিক্ষার্থী'),
            role: isUserAdmin ? 'admin' : 'student',
            photoURL: fbUser.photoURL || undefined,
            completedQuizzesCount: 0,
            totalScore: 0,
            joinedAt: new Date().toISOString()
          };
          setUser(profile);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
        } else {
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

  const loginAsAdminSecure = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    const normalizedEmail = email.toLowerCase().trim();
    const creds = getAdminCredentials();

    const isAuthorizedEmail = creds.adminEmails
      .map((e: string) => e.toLowerCase().trim())
      .includes(normalizedEmail);

    if (!isAuthorizedEmail) {
      setIsLoading(false);
      throw new Error(
        'অননুমোদিত প্রবেশাধিকার! শুধুমাত্র অনুমোদিত এডমিনের ইমেইল দিয়ে লগইন করা সম্ভব।'
      );
    }

    if (pass !== creds.masterPassword && pass.length < 6) {
      setIsLoading(false);
      throw new Error('ভুল এডমিন পাসওয়ার্ড প্রদান করেছেন!');
    }

    if (isFirebaseConfigured && auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, normalizedEmail, pass);
        const profile: UserProfile = {
          uid: cred.user.uid,
          email: cred.user.email || normalizedEmail,
          displayName: 'Super Admin (Owner)',
          role: 'admin',
          completedQuizzesCount: 0,
          totalScore: 0,
          joinedAt: new Date().toISOString()
        };
        setUser(profile);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
        setIsLoading(false);
        return true;
      } catch (fbErr: any) {
        // If Firebase user isn't created yet or offline, allow matching master pass for owner
        if (pass === creds.masterPassword) {
          const profile: UserProfile = {
            uid: 'admin-owner-uid',
            email: normalizedEmail,
            displayName: 'Super Admin (Owner)',
            role: 'admin',
            completedQuizzesCount: 0,
            totalScore: 0,
            joinedAt: new Date().toISOString()
          };
          setUser(profile);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
          setIsLoading(false);
          return true;
        }
        setIsLoading(false);
        throw fbErr;
      }
    } else {
      if (pass === creds.masterPassword || pass === 'admin123456') {
        const profile: UserProfile = {
          uid: 'admin-owner-uid',
          email: normalizedEmail,
          displayName: 'Super Admin (Owner)',
          role: 'admin',
          completedQuizzesCount: 0,
          totalScore: 0,
          joinedAt: new Date().toISOString()
        };
        setUser(profile);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        throw new Error('ভুল এডমিন পাসওয়ার্ড প্রদান করেছেন!');
      }
    }
  };

  const loginWithEmail = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    const normalizedEmail = email.toLowerCase().trim();
    const isUserAdmin = checkIsAdmin(normalizedEmail);

    try {
      if (isFirebaseConfigured && auth) {
        const cred = await signInWithEmailAndPassword(auth, normalizedEmail, pass);
        const profile: UserProfile = {
          uid: cred.user.uid,
          email: cred.user.email || normalizedEmail,
          displayName: cred.user.displayName || (isUserAdmin ? 'Super Admin' : 'শিক্ষার্থী'),
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
        const creds = getAdminCredentials();
        if (isUserAdmin && pass !== creds.masterPassword && pass !== 'admin123456') {
          setIsLoading(false);
          throw new Error('ভুল এডমিন পাসওয়ার্ড!');
        }

        const profile: UserProfile = {
          uid: isUserAdmin ? 'admin-owner-uid' : 'local-' + Date.now(),
          email: normalizedEmail,
          displayName: isUserAdmin ? 'Super Admin (Owner)' : 'শিক্ষার্থী',
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
    const normalizedEmail = email.toLowerCase().trim();
    const isUserAdmin = checkIsAdmin(normalizedEmail);

    try {
      if (isFirebaseConfigured && auth) {
        const cred = await createUserWithEmailAndPassword(auth, normalizedEmail, pass);
        const profile: UserProfile = {
          uid: cred.user.uid,
          email: cred.user.email || normalizedEmail,
          displayName: name || (isUserAdmin ? 'Super Admin' : 'Student'),
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
        const profile: UserProfile = {
          uid: 'student-' + Date.now(),
          email: normalizedEmail,
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

  const updateAdminPassword = (newPass: string): boolean => {
    if (!newPass || newPass.length < 6) return false;
    const creds = getAdminCredentials();
    creds.masterPassword = newPass;
    localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify(creds));
    return true;
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
        isAdmin: user?.role === 'admin' && checkIsAdmin(user?.email),
        isLoading,
        loginWithEmail,
        registerWithEmail,
        login: loginWithEmail,
        signup: registerWithEmail,
        loginAsAdminSecure,
        updateAdminPassword,
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
