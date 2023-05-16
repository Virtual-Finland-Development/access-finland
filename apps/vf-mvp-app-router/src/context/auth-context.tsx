import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { LoggedInState } from '@/types';
import {
  LOCAL_STORAGE_AUTH_KEY,
  REQUEST_NOT_AUTHORIZED,
} from '@/lib/constants';
import { getValidAuthState } from '@/lib/utils';
import { JSONLocalStorage } from '@/lib/utils/JSONStorage';

interface AuthContextProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  userEmail: string | null;
  setLoading: () => void;
  logIn: (loggedInState: LoggedInState) => void;
  logOut: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);
const AuthConsumer = AuthContext.Consumer;

function AuthProvider(props: AuthProviderProps) {
  const { children } = props;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuthStateFromStorage = () => {
      const { isValid, storedAuthState } = getValidAuthState();

      if (isValid) {
        setUserEmail(storedAuthState.profileData?.email || null);
        setIsAuthenticated(true);
      }

      setLoading(false);
    };

    loadAuthStateFromStorage();
  }, []);

  const logIn = useCallback(async (loggedInState: LoggedInState) => {
    if (loggedInState) {
      JSONLocalStorage.set(LOCAL_STORAGE_AUTH_KEY, loggedInState);
      setUserEmail(loggedInState.profileData?.email || null);
      setIsAuthenticated(true);
    }
  }, []);

  const logOut = useCallback(() => {
    JSONLocalStorage.clear();
    setUserEmail(null);
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    const onWindowMessageEvent = (event: MessageEvent) => {
      if (event.data === REQUEST_NOT_AUTHORIZED) {
        alert('Your session has expired, please authenticate to continue.');
        logOut();
      }
    };
    // make sure Next.js is running on client-side (window is defined), before attempting to add window listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('message', onWindowMessageEvent);
      return () => window.removeEventListener('message', onWindowMessageEvent);
    }
  }, [logOut]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        userEmail,
        setLoading: () => setLoading(true),
        logIn,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext) as AuthContextProps;

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }

  return context;
}

export { AuthProvider, AuthConsumer, useAuth };
