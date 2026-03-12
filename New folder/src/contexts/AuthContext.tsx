import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: 'free' | 'pro';
  joinedAt: string;
  stats: {
    imagesProcessed: number;
    storageUsed: number;
    toolsUsed: Record<string, number>;
    lastActive: string;
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginWithGithub: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'avatar'>>) => void;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  trackToolUsage: (tool: string) => void;
  incrementImagesProcessed: (count?: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'imagetools_auth';
const USERS_KEY = 'imagetools_users';

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function getStoredUsers(): Record<string, { password: string; user: User }> {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, { password: string; user: User }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getAvatarUrl(name: string): string {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const colors = ['3B82F6', '8B5CF6', 'EC4899', '10B981', 'F59E0B', 'EF4444', '6366F1'];
  const color = colors[name.length % colors.length];
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
      <rect width="80" height="80" rx="40" fill="#${color}"/>
      <text x="40" y="40" dy=".35em" text-anchor="middle" fill="white" font-family="system-ui" font-size="28" font-weight="bold">${initials}</text>
    </svg>`
  )}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Load auth state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const user = JSON.parse(stored) as User;
        setState({ user, isAuthenticated: true, isLoading: false });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Persist auth state
  const persistUser = useCallback((user: User) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    // Also update in users store
    const users = getStoredUsers();
    if (users[user.email]) {
      users[user.email].user = user;
      saveUsers(users);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));

    const users = getStoredUsers();
    const entry = users[email.toLowerCase()];

    if (!entry) {
      return { success: false, error: 'No account found with this email address.' };
    }

    if (entry.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    const user = { ...entry.user, stats: { ...entry.user.stats, lastActive: new Date().toISOString() } };
    persistUser(user);
    setState({ user, isAuthenticated: true, isLoading: false });
    return { success: true };
  }, [persistUser]);

  const signup = useCallback(async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(r => setTimeout(r, 800));

    const users = getStoredUsers();
    const key = email.toLowerCase();

    if (users[key]) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const user: User = {
      id: generateId(),
      name,
      email: key,
      avatar: getAvatarUrl(name),
      plan: 'free',
      joinedAt: new Date().toISOString(),
      stats: {
        imagesProcessed: 0,
        storageUsed: 0,
        toolsUsed: {},
        lastActive: new Date().toISOString(),
      },
    };

    users[key] = { password, user };
    saveUsers(users);
    persistUser(user);
    setState({ user, isAuthenticated: true, isLoading: false });
    return { success: true };
  }, [persistUser]);

  const loginWithGoogle = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    await new Promise(r => setTimeout(r, 1200));

    const name = 'Google User';
    const email = 'user@gmail.com';
    const users = getStoredUsers();

    if (users[email]) {
      const user = { ...users[email].user, stats: { ...users[email].user.stats, lastActive: new Date().toISOString() } };
      persistUser(user);
      setState({ user, isAuthenticated: true, isLoading: false });
      return { success: true };
    }

    const user: User = {
      id: generateId(),
      name,
      email,
      avatar: getAvatarUrl(name),
      plan: 'free',
      joinedAt: new Date().toISOString(),
      stats: { imagesProcessed: 0, storageUsed: 0, toolsUsed: {}, lastActive: new Date().toISOString() },
    };

    users[email] = { password: '', user };
    saveUsers(users);
    persistUser(user);
    setState({ user, isAuthenticated: true, isLoading: false });
    return { success: true };
  }, [persistUser]);

  const loginWithGithub = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    await new Promise(r => setTimeout(r, 1200));

    const name = 'GitHub User';
    const email = 'user@github.com';
    const users = getStoredUsers();

    if (users[email]) {
      const user = { ...users[email].user, stats: { ...users[email].user.stats, lastActive: new Date().toISOString() } };
      persistUser(user);
      setState({ user, isAuthenticated: true, isLoading: false });
      return { success: true };
    }

    const user: User = {
      id: generateId(),
      name,
      email,
      avatar: getAvatarUrl(name),
      plan: 'free',
      joinedAt: new Date().toISOString(),
      stats: { imagesProcessed: 0, storageUsed: 0, toolsUsed: {}, lastActive: new Date().toISOString() },
    };

    users[email] = { password: '', user };
    saveUsers(users);
    persistUser(user);
    setState({ user, isAuthenticated: true, isLoading: false });
    return { success: true };
  }, [persistUser]);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  const updateProfile = useCallback((updates: Partial<Pick<User, 'name' | 'avatar'>>) => {
    setState(prev => {
      if (!prev.user) return prev;
      const updated = {
        ...prev.user,
        ...updates,
        avatar: updates.name ? getAvatarUrl(updates.name) : (updates.avatar || prev.user.avatar),
      };
      persistUser(updated);
      return { ...prev, user: updated };
    });
  }, [persistUser]);

  const resetPassword = useCallback(async (email: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(r => setTimeout(r, 1000));
    const users = getStoredUsers();
    if (!users[email.toLowerCase()]) {
      return { success: false, error: 'No account found with this email.' };
    }
    return { success: true };
  }, []);

  const trackToolUsage = useCallback((tool: string) => {
    setState(prev => {
      if (!prev.user) return prev;
      const toolsUsed = { ...prev.user.stats.toolsUsed };
      toolsUsed[tool] = (toolsUsed[tool] || 0) + 1;
      const updated = {
        ...prev.user,
        stats: { ...prev.user.stats, toolsUsed, lastActive: new Date().toISOString() },
      };
      persistUser(updated);
      return { ...prev, user: updated };
    });
  }, [persistUser]);

  const incrementImagesProcessed = useCallback((count = 1) => {
    setState(prev => {
      if (!prev.user) return prev;
      const updated = {
        ...prev.user,
        stats: {
          ...prev.user.stats,
          imagesProcessed: prev.user.stats.imagesProcessed + count,
          lastActive: new Date().toISOString(),
        },
      };
      persistUser(updated);
      return { ...prev, user: updated };
    });
  }, [persistUser]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        loginWithGoogle,
        loginWithGithub,
        logout,
        updateProfile,
        resetPassword,
        trackToolUsage,
        incrementImagesProcessed,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
