import React, {
  createContext,
  useCallback,
  useState,
  useEffect,
  useContext,
} from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

const TOKEN_KEY = 'GoBarber_token';

const tokenStorage = {
  get: () =>
    Platform.OS === 'web'
      ? AsyncStorage.getItem(TOKEN_KEY)
      : SecureStore.getItemAsync(TOKEN_KEY),
  set: (value: string) =>
    Platform.OS === 'web'
      ? AsyncStorage.setItem(TOKEN_KEY, value)
      : SecureStore.setItemAsync(TOKEN_KEY, value),
  remove: () =>
    Platform.OS === 'web'
      ? AsyncStorage.removeItem(TOKEN_KEY)
      : SecureStore.deleteItemAsync(TOKEN_KEY),
};

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface AuthContextData {
  user: User;
  loading: boolean;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoragedData(): Promise<void> {
      try {
        const [token, userStr] = await Promise.all([
          tokenStorage.get(),
          AsyncStorage.getItem('@GoBarber:user'),
        ]);

        if (token && userStr) {
          api.defaults.headers.authorization = `Bearer ${token}`;
          setData({ token, user: JSON.parse(userStr) });
        }
      } finally {
        setLoading(false);
      }
    }

    loadStoragedData();
  }, []);

  const signIn = useCallback(async ({ email, password }: SignInCredentials) => {
    const response = await api.post('sessions', { email, password });
    const { token, user } = response.data;

    await Promise.all([
      tokenStorage.set(token),
      AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user)),
    ]);

    api.defaults.headers.authorization = `Bearer ${token}`;
    setData({ token, user });
  }, []);

  const signOut = useCallback(async () => {
    await Promise.all([
      tokenStorage.remove(),
      AsyncStorage.removeItem('@GoBarber:user'),
    ]);
    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    async (user: User) => {
      await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user));
      setData({ token: data.token, user });
    },
    [data.token],
  );

  return (
    <AuthContext.Provider value={{ user: data.user, loading, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { useAuth, AuthProvider };
