export enum AuthProvider {
  TESTBED = 'testbed',
  SINUNA = 'sinuna',
  SUOMIFI = 'suomifi',
  VIRTUALFINLAND = 'virtualfinland',
}

export type AppContextObj = {
  appName: string;
  redirectUrl: string | URL;
  guid?: string;
  provider?: string;
  meta?: Record<string, string>;
};

export type LoggedInState = {
  idToken?: string; // For isExportedApplication
  expiresAt: string;
  provider?: AuthProvider;
  profileData: {
    userId: string;
    email: string;
    [key: string]: any;
  };
};
