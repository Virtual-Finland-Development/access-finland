import type { NextComponentType } from 'next';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import styled from 'styled-components';
import reportAccessibility from '@shared/lib/utils/reportAccessibility';
import { AuthConsumer, AuthProvider } from '@shared/context/auth-context';
import 'vf-shared/src/styles.css';
import '../styles/globals.css';
import 'suomifi-ui-components/dist/main.css';
import 'react-phone-number-input/style.css';
import 'react-toastify/dist/ReactToastify.css';

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

const NAV_ITEMS = [
  { name: 'Home', href: '/' },
  { name: 'Profile', href: '/profile' },
];

const LANGUAGES = [{ code: 'en', label: 'In English (EN)' }];

const queryClient = new QueryClient();

const Container = styled.div.attrs({
  className: 'container flex items-center justify-center h-screen',
})``;

const NoProvider = ({ children }: { children: ReactNode }) => <>{children}</>;

export default function App({ Component, pageProps }: ExtendedAppProps) {
  const ComponentContextProvider = Component.provider || NoProvider;
  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Head>
          <title>Virtual Finland</title>
          <meta name="description" content="Virtual Finland demo app" />
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

            if (router.pathname === '/auth') {
              return (
                <Container>
                  <Component {...pageProps} />
                </Container>
              );
            }

            return (
              <ToastProvider>
                <ModalProvider>
                  <MainLayout navigationItems={NAV_ITEMS} languages={LANGUAGES}>
                    <ComponentContextProvider>
                      <Component {...pageProps} />
                    </ComponentContextProvider>
                  </MainLayout>
                </ModalProvider>
              </ToastProvider>
            );
          }}
        </AuthConsumer>
      </AuthProvider>
    </QueryClientProvider>
  );
}
