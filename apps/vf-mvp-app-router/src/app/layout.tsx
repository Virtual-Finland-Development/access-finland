import { ReactNode } from 'react';
import StyledComponentsRegistry from '@/lib/registry';
import PagesWrapper from './pages-wrapper';
import 'vf-shared/src/styles.css';
import '../styles/globals.css';
import 'suomifi-ui-components/dist/main.css';
import 'react-phone-number-input/style.css';
import 'react-toastify/dist/ReactToastify.css';

const NAV_ITEMS = [
  { name: 'Home', href: '/' },
  { name: 'Profile', href: '/profile' },
];

export const metadata = {
  title: 'Virtual Finland',
  description: 'Virtual Finland demo app',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  // favicon???
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <PagesWrapper navigationItems={NAV_ITEMS}>{children}</PagesWrapper>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
