import Link from 'next/link';
import { useRouter } from 'next/router';
import { Popover, Transition } from '@headlessui/react';
import styled from 'styled-components';
import {
  Button,
  IconBuildings,
  IconClose,
  IconFileCabinet,
  IconHome,
  IconMenu,
  IconUserProfile,
  LanguageMenu,
  LanguageMenuItem,
  ServiceNavigation,
  ServiceNavigationItem,
  Text,
} from 'suomifi-ui-components';
import api from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import CustomHeading from '@/components/ui/custom-heading';
import CustomLink from '@/components/ui/custom-link';
import CustomRouterLink from '@/components/ui/custom-router-link';

const MobileMenuToggleButton = styled(Button).attrs({
  variant: 'secondaryNoBorder',
  className: '!p-0 !px-2',
  'aria-label': 'Toggle menu button',
})`
  &:hover {
    background: transparent !important;
  }
`;

export type NavItems = { name: string; href: string; description: string }[];

const DeskTopNavIcons = {
  '/': IconHome,
  '/profile': IconUserProfile,
  '/company': IconBuildings,
};

const DesktopNavItem = styled(Link).attrs<{
  $isActive: boolean;
  href: boolean;
}>(({ $isActive, href }) => ({
  className: `border-b-4 py-2 px-4 mx-7 hover:border-b-suomifi-light cursor-pointer ${
    $isActive ? 'border-b-suomifi-light' : 'border-b-transparent'
  }`,
  href,
}))<{ $isActive: boolean }>``;

function DesktopMenuPopover({
  navigationItems,
}: {
  navigationItems: NavItems;
}) {
  return (
    <Popover as="div" className="hidden md:block ml-3">
      {({ open, close }) => (
        <>
          <Popover.Button as={MobileMenuToggleButton}>
            {open ? (
              <IconClose className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <IconMenu className="block h-6 w-6" aria-hidden="true" />
            )}
          </Popover.Button>
          <Popover.Panel className="absolute right-0 z-10 mt-3 origin-top-right bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none flex flex-col px-4">
            {navigationItems.map(item => {
              const Icon = DeskTopNavIcons[item.href] || IconFileCabinet;

              return (
                <div
                  key={item.href}
                  className="flex flex-row items-center justify-start gap-4 w-80 border-b last:border-none border-b-gray-300 p-4"
                >
                  <>
                    <Icon className="flex-shrink-0 h-12 w-12" />
                    <div className="flex flex-col">
                      <CustomLink
                        href={item.href}
                        $bold
                        onClick={() => close()}
                      >
                        {item.name}
                      </CustomLink>
                      <Text>{item.description}</Text>
                    </div>
                  </>
                </div>
              );
            })}
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
}

function DesktopNavigation({ navigationItems }: { navigationItems: NavItems }) {
  const router = useRouter();

  return (
    <div className="hidden md:block border-t border-t-gray-300">
      <div className="container px-4">
        <nav className="hidden md:flex flex-wrap gap-4 -mx-7">
          {navigationItems.map(item => (
            <DesktopNavItem
              key={item.name}
              $isActive={
                (item.href === '/' && router.pathname === item.href) ||
                (item.href !== '/' && router.pathname.includes(item.href))
              }
              href={item.href}
            >
              <Text>{item.name}</Text>
            </DesktopNavItem>
          ))}
        </nav>
      </div>
    </div>
  );
}

function MobileMenuPopover({ navigationItems }: { navigationItems: NavItems }) {
  const router = useRouter();

  return (
    <Popover className="md:hidden">
      {({ open, close }) => {
        // scroll to top when opening the menu, disable scrolling (popover has no scroll disabling behavior)
        window.scrollTo(0, 0);
        document.body.classList.toggle('overflow-y-hidden', open);

        return (
          <>
            <Popover.Button as={MobileMenuToggleButton}>
              {open ? (
                <IconClose className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <IconMenu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Popover.Button>

            <Transition show={open}>
              <Popover.Panel className="absolute top-[56px]">
                <Transition.Child
                  enter="transition-opacity duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity duration-150"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div
                    className="fixed inset-0 top-[60px] bg-black/60"
                    aria-hidden="true"
                    onClick={close}
                  />
                </Transition.Child>
                <Transition.Child>
                  <div className="fixed inset-x-0">
                    <div className="bg-white border-t border-solid border-gray-300 border-b border-b-suomifi-light">
                      <ServiceNavigation aria-label="Mobile navigation">
                        {navigationItems.map(item => (
                          <div key={item.name} className="border-b">
                            <ServiceNavigationItem
                              key={item.name}
                              selected={
                                (item.href === '/' &&
                                  router.pathname === item.href) ||
                                (item.href !== '/' &&
                                  router.pathname.includes(item.href))
                              }
                            >
                              <Popover.Button
                                as={CustomRouterLink}
                                href={item.href}
                              >
                                {item.name}
                              </Popover.Button>
                            </ServiceNavigationItem>
                          </div>
                        ))}
                      </ServiceNavigation>
                    </div>
                  </div>
                </Transition.Child>
              </Popover.Panel>
            </Transition>
          </>
        );
      }}
    </Popover>
  );
}

function UserControl({ className }: { className: string }) {
  const { userEmail, setLoading } = useAuth();

  const logoutHandler = async () => {
    setLoading();
    await api.auth.directToAuthLogout();
  };

  return (
    <div className={className}>
      <Text className="!text-sm lg:!text-base !font-bold">{userEmail}</Text>
      <Button
        variant="secondaryNoBorder"
        className="!text-xs !min-h-0 !p-0"
        onClick={logoutHandler}
      >
        LOG OUT
      </Button>
    </div>
  );
}

export default function MainNavigation({
  navigationItems,
  languages,
}: {
  navigationItems: NavItems;
  languages: { code: string; label: string }[];
}) {
  const { isAuthenticated } = useAuth();

  return (
    <header className="z-20">
      <nav className="bg-white border-b border-t-4 border-solid border-t-suomifi-dark border-b-suomifi-light relative">
        <div className="container px-4">
          <div className="relative flex h-14 items-center justify-between">
            {/* Main heading */}
            <Link href="/">
              <CustomHeading
                variant="h1"
                suomiFiBlue="light"
                className="!text-lg !font-bold"
              >
                ACCESS FINLAND
              </CustomHeading>
            </Link>

            {/* Controls */}
            <div className="flex flex-row items-center gap-6">
              {/* Language menu */}
              <LanguageMenu name="EN" className="!font-bold">
                {languages.map(l => (
                  <LanguageMenuItem
                    key={l.code}
                    onSelect={() => {}}
                    selected={l.code === 'en'}
                  >
                    {l.label}
                  </LanguageMenuItem>
                ))}
              </LanguageMenu>

              {/* Desktop user info / log out */}
              {isAuthenticated && (
                <UserControl className="hidden md:flex flex-col items-end" />
              )}

              {/* Desktop menu popover */}
              <DesktopMenuPopover navigationItems={navigationItems} />

              {/* Mobile menu popover */}
              <MobileMenuPopover navigationItems={navigationItems} />
            </div>
          </div>

          {/* Mobile user info / log out */}
          {isAuthenticated && (
            <UserControl className="md:hidden flex flex-row items-center justify-between pb-1 -mt-1" />
          )}
        </div>

        {/* Desktop navigation */}
        <DesktopNavigation navigationItems={navigationItems} />
      </nav>
    </header>
  );
}
