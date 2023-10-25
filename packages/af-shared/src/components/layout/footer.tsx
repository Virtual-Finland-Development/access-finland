import { GrFacebook, GrTwitter } from 'react-icons/gr';
import virtualFinlandLogo from '@/images/virtualfinland_logo_small.png';
import { Block, IconChevronRight, Text } from 'suomifi-ui-components';
import { isExportedApplication } from '@/lib/utils';
import CustomHeading from '@/components/ui/custom-heading';
import CustomImage from '@/components/ui/custom-image';
import CustomLink from '@/components/ui/custom-link';
import CustomText from '@/components/ui/custom-text';

const isExportedApp = isExportedApplication();

const HELP_LINKS = [
  {
    href: 'https://jobsinfinland.fi/',
    label: 'Jobs in Finland - Looking for a job in Finland?',
  },
  {
    href: 'https://www.infofinland.fi/',
    label: 'Info Finland - Your guide to living in Finland!',
  },
  {
    href: 'https://finland.fi/',
    label:
      'This is Finland – Things you should and shouldn’t know about Finland!',
  },
  {
    href: 'https://enterfinland.fi/',
    label: 'Enter Finland - Are you ready move to Finland?',
  },
];

function Help() {
  return (
    <>
      <Block variant="section" className="bg-white px-4 py-6">
        <div className="container md:px-4">
          <CustomHeading variant="h3" className="!text-lg">
            Helpful links
          </CustomHeading>
          <ul className="mt-4">
            {HELP_LINKS.map(item => (
              <li key={item.label}>
                <div className="flex flex-row gap-1 items-center">
                  <IconChevronRight className="-ml-1 text-base flex-shrink-0 text-suomifi-orange" />
                  <CustomLink href={item.href} $base isExternal>
                    {item.label}
                  </CustomLink>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Block>
      <Block variant="section" className="bg-suomifi-blue-bg-light px-4 py-6">
        <div className="container md:px-4">
          <CustomHeading variant="h3" className="!text-lg">
            Do you need help with this application or profile?
          </CustomHeading>
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex flex-col gap-1 items-start">
              <CustomText $base>
                Send email to us and describe your problem:{' '}
                <a
                  href="mailto:virtualfinland.um@gov.fi"
                  className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                >
                  virtualfinland.um@gov.fi
                </a>
              </CustomText>
              {!isExportedApp && (
                <div className="flex flex-col items-start">
                  <CustomLink href="/info/terms-of-use" disableVisited $base>
                    Terms of Use
                  </CustomLink>
                  <CustomLink
                    href="/info/data-protection-statement"
                    disableVisited
                    $base
                  >
                    Data protection statement
                  </CustomLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </Block>
    </>
  );
}

function Info() {
  return (
    <Block
      variant="section"
      className="bg-suomifi-blue-bg-dark px-4 pt-2 pb-14 p-6"
      style={{
        background: 'linear-gradient(270deg, #01041c 0%, #002da1 100%)',
      }}
    >
      <div className="container flex flex-col">
        {isExportedApp && (
          <div className="flex flex-col gap-3 text-white border-b py-8">
            <div className="flex flex-row items-center gap-2">
              <GrTwitter />
              <CustomText>@virtualfinland</CustomText>
            </div>

            <div className="flex flex-row items-center gap-2">
              <GrFacebook />
              <CustomText>@virtualfinland</CustomText>
            </div>
          </div>
        )}
        <div className="pt-8 text-white">
          <a
            href="https://thevirtualfinland.fi/en/"
            target="_blank"
            rel="noreferrer noopener"
          >
            <CustomImage
              src={virtualFinlandLogo}
              alt="Virtual Finland"
              width={250}
              height={75}
              priority
            />
          </a>
          <div className="flex flex-col gap-1 mt-6">
            <CustomText $base $bold>
              Virtual Finland aims to make it easier for foreign employees,
              companies, and students to relocate to Finland
            </CustomText>
          </div>
        </div>
      </div>
    </Block>
  );
}

export default function Footer() {
  return (
    <Block
      variant="footer"
      className="border-t-4 border-solid border-t-suomifi-dark bg-white"
    >
      <Help />
      <Info />
    </Block>
  );
}
