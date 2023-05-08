import { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RenderOptions, render } from '@testing-library/react';
import { AuthProvider } from '@/context/auth-context';
import { ModalProvider } from '@/context/modal-context';
import { ToastProvider } from '@/context/toast-context';

const queryClient = new QueryClient();

// Custom render
// Wrap with context providers
const WrapperWithProviders = ({ children }: { children: ReactElement }) => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ModalProvider>
        <ToastProvider>{children}</ToastProvider>
      </ModalProvider>
    </AuthProvider>
  </QueryClientProvider>
);

const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) =>
  render(ui, {
    wrapper: WrapperWithProviders,
    ...options,
  });

// re-export everything
export * from '@testing-library/react';

// override render method
export { renderWithProviders };
