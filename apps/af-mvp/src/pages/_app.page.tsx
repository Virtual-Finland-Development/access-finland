import reportAccessibility from '@shared/lib/utils/reportAccessibility';
import { AuthConsumer, AuthProvider } from '@shared/context/auth-context';
import '@shared/styles.css';
import type { NextComponentType } from 'next';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { FC, PropsWithChildren, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-phone-number-input/style.css';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import 'suomifi-ui-components/dist/main.css';
import '../styles/globals.css';

// axe-core a11y reporting
reportAccessibility(React);

const Loading = dynamic(() => import('@shared/components/ui/loading'));
const ToastProvider = dynamic(() =>
  import('@shared/context/toast-context').then(mod => mod.ToastProvider)
);
const ModalProvider = dynamic(() =>
  import('@shared/context/modal-context').then(mod => mod.ModalProvider)
);
const MainLayout = dynamic(
  () => import('@shared/components/layout/main-layout')
);

type ExtendedAppProps = AppProps & {
  Component: NextComponentType & { provider?: FC<PropsWithChildren> };
};

const AUTH_ROUTES = ['/auth', '/auth/sign-in'];

const NAV_ITEMS = [
  { name: 'Home', href: '/', description: 'Your journey begins here' },
  {
    name: 'Profile',
    href: '/profile',
    description: 'Your Access Finland profile',
  },
];

const LANGUAGES = [{ code: 'en', label: 'In English (EN)' }];

const queryClient = new QueryClient();

const Container = styled.div.attrs({
  className: 'container flex items-center justify-center h-screen',
})``;

const NoProvider = ({ children }: { children: ReactNode }) => <>{children}</>;

function UiUtilsProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <ModalProvider>{children}</ModalProvider>
    </ToastProvider>
  );
}

export default function App({ Component, pageProps }: ExtendedAppProps) {
  const ComponentContextProvider = Component.provider || NoProvider;
  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Head>
          <title>Access Finland</title>
          <meta name="description" content="Access Finland app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <AuthConsumer>
          {provider => {
            if (!provider) {
              return null;
            }

            if (provider.isLoading) {
              return (
                <Container>
                  <Loading />
                </Container>
              );
            }

            if (AUTH_ROUTES.includes(router.pathname)) {
              return (
                <UiUtilsProviders>
                  <Container>
                    <Component {...pageProps} />
                  </Container>
                </UiUtilsProviders>
              );
            }

            return (
              <UiUtilsProviders>
                <MainLayout navigationItems={NAV_ITEMS} languages={LANGUAGES}>
                  <ComponentContextProvider>
                    <Component {...pageProps} />
                  </ComponentContextProvider>
                </MainLayout>
              </UiUtilsProviders>
            );
          }}
        </AuthConsumer>
      </AuthProvider>
    </QueryClientProvider>
  );
}
