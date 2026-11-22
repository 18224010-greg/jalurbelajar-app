import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import ApiService, { setAuthToken, setUnauthorizedHandler } from '../services/ApiService';

const TOKEN_KEY = 'jb_token';
const USER_KEY = 'jb_user';

const AuthContext = createContext(null);

async function saveSession(token, user) {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  } catch {
    // Penyimpanan gagal: sesi tetap berjalan, hanya tidak diingat setelah aplikasi ditutup.
  }
}

async function clearSession() {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
  } catch {
    // diabaikan
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const signOut = useCallback(async () => {
    setAuthToken(null);
    setUser(null);
    await clearSession();
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      signOut();
    });
    return () => setUnauthorizedHandler(null);
  }, [signOut]);

  // Saat aplikasi dibuka: pulihkan sesi tersimpan lalu pastikan tokennya masih berlaku.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token) {
          setAuthToken(token);
          const me = await ApiService.getMe();
          if (active) setUser(me);
        }
      } catch (error) {
        // Token ditolak atau server tidak terjangkau: mulai dari layar login.
        if (error && error.status === 0) {
          const cached = await SecureStore.getItemAsync(USER_KEY).catch(() => null);
          if (cached && active) {
            setUser(JSON.parse(cached));
            return;
          }
        }
        setAuthToken(null);
        await clearSession();
      } finally {
        if (active) setInitializing(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async (email, password) => {
    const result = await ApiService.login(email.trim(), password);
    setAuthToken(result.access_token);
    await saveSession(result.access_token, result.user);
    setUser(result.user);
  }, []);

  const signUp = useCallback(
    async (name, email, password) => {
      await ApiService.register(name.trim(), email.trim(), password);
      await signIn(email, password);
    },
    [signIn],
  );

  const value = useMemo(
    () => ({ user, initializing, signIn, signUp, signOut }),
    [user, initializing, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return ctx;
}

export { AuthContext };
