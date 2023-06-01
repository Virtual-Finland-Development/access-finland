export enum AuthProvider {
  TESTBED = 'testbed',
  SINUNA = 'sinuna',
  SUOMIFI = 'suomifi',
}

export type AppContextObj = {
  appName: string;
  redirectUrl: string | URL;
  guid?: string;
  provider?: string;
  meta?: Record<string, string>;
};

export type LoggedInState = {
  csrfToken?: string; // For !isExport
  idToken?: string; // For isExport
  expiresAt: string;
  profileData: {
    userId: string;
    email: string;
    [key: string]: any;
  };
};
