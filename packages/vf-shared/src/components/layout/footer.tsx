import { GrFacebook, GrTwitter } from 'react-icons/gr';
import { Block, Icon } from 'suomifi-ui-components';
import europeImage from '../../images/your_europe_logo.svg';
import CustomHeading from '../ui/custom-heading';
import CustomImage from '../ui/custom-image';
import CustomLink from '../ui/custom-link';
import CustomText from '../ui/custom-text';

const HELP_LINKS = [
  { href: '#', label: 'Who runs this service?' },
  { href: '#', label: 'What are the steps in the imigration process?' },
  { href: '#', label: 'What I need to know about Residence permit?' },
  { href: '#', label: 'EU requirements for those arriving outside region' },
  { href: '#', label: 'What do I need to know about Finland?' },
  { href: '#', label: 'I present a company. What should I do?' },
  { href: '#', label: 'I have family coming with me. What should I do?' },
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
                  <Icon
                    icon="chevronRight"
                    className="-ml-1 text-base flex-shrink-0 text-suomifi-orange"
                  />
                  <CustomLink href={item.href} $base>
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
            Do you need help?
          </CustomHeading>
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <CustomText $base $bold>
                All help channels under one address
              </CustomText>
              <CustomText $base>
                Find help for people, organisations or companies from here:
              </CustomText>
            </div>
            <CustomLink href="">
              Additional information on Public Service Info
            </CustomLink>
          </div>
        </div>
      </Block>
    </>
  );
}

function Social() {
  return (
    <Block
      variant="section"
      className="bg-suomifi-blue-bg-dark px-4 pt-2 pb-14 p-6"
    >
      <div className="container flex flex-col gap-6">
        <div className="flex flex-col gap-3 text-white border-b py-6">
          <div className="flex flex-row items-center gap-2">
            <GrTwitter />
            <CustomText>@virtualfinland</CustomText>
          </div>

          <div className="flex flex-row items-center gap-2">
            <GrFacebook />
            <CustomText>@virtualfinland</CustomText>
          </div>
        </div>
        <CustomImage
          src={europeImage}
          alt="Your Europe image"
          width={250}
          height={75}
          priority
        />
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
      <Social />
    </Block>
  );
}
