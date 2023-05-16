'use client';

import { usePathname } from 'next/navigation';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import styled from 'styled-components';
import { AuthConsumer, AuthProvider } from '@/context/auth-context';
import { ModalProvider } from '@/context/modal-context';
import { ToastProvider } from '@/context/toast-context';
import MainLayout from '@/components/layout/main-layout';
import Loading from '@/components/ui/loading';

const queryClient = new QueryClient();

const Container = styled.div.attrs({
  className: 'container flex items-center justify-center h-screen',
})``;

interface Props {
  navigationItems: { name: string; href: string }[];
  children: ReactNode & { provider?: FC<PropsWithChildren> };
}

const NoProvider = ({ children }: { children: ReactNode }) => <>{children}</>;

export default function PagesWrapper({ navigationItems, children }: Props) {
  const pathname = usePathname();
  const ComponentContextProvider = children.provider || NoProvider;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthConsumer>
          {authProvider => {
            if (!authProvider) {
              return null;
            }

            if (authProvider.isLoading) {
              return (
                <Container>
                  <Loading />
                </Container>
              );
            }

            if (pathname === '/auth') {
              return <Container>{children}</Container>;
            }

            return (
              <ToastProvider>
                <ModalProvider>
                  <MainLayout navigationItems={navigationItems}>
                    <ComponentContextProvider>
                      {children}
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
