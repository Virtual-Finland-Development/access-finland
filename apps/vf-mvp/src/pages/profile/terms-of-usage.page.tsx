import type { InferGetStaticPropsType } from 'next';
import DOMPurify from 'dompurify';
import parse, { Element, domToReact } from 'html-react-parser';
import { JSDOM } from 'jsdom';
import { Text } from 'suomifi-ui-components';
import { HeadingProps } from 'suomifi-ui-components';
import Page from '@shared/components/layout/page';
import CustomHeading from '@shared/components/ui/custom-heading';

export async function getStaticProps() {
  // html string
  // would be fetched from api
  const htmlString = `
    <h3> Your privacy is important to us</h3>

    <p>Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
    tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex
    ea commodi consequat. Quis aute iure reprehenderit in voluptate
    velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
    obcaecat cupiditat non proident, sunt in culpa qui officia deserunt
    mollit anim id est laborum.</p>

    <h3>What information do we process?</h3>

    <p>Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
    tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex
    ea commodi consequat. Quis aute iure reprehenderit in voluptate
    velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
    obcaecat cupiditat non proident, sunt in culpa qui officia deserunt
    mollit anim id est laborum.</p>

    <ul>
      <li>
        Lorem impsun dolor sit amet
      </li>
      <li>
        Lorem impsun dolor sit amet
      </li>
      <li>
        Lorem impsun dolor sit amet
      </li>
    </ul>

    <p>
      The controller of your personal data is Virtual Finland, located
      at Address 5, 00240 Helsinki.
    </p>
    <p>
      In matters concerning data protection, you can send email to
      <a href="mailto:">
        virtulfinland@virtualfinland.com.
      </a>
    </p>
    <p>
      If you change your mind about the terms of usage after profile
      creation, we encourage you to delete your profile data. Nothing
      will be stored about you after this process.
    </p>
  `;

  // sanitize html content (XSS clean up)
  const window = new JSDOM('').window;
  const purify = DOMPurify(window);
  const cleanContent = purify.sanitize(htmlString);

  return {
    props: { htmlContent: cleanContent },
  };
}

const parserOptions = {
  replace: domNode => {
    if (!(domNode instanceof Element)) {
      return;
    }

    const { name, children } = domNode;

    if (['h1', 'h2', 'h3', 'h4', 'h5'].includes(name)) {
      return (
        <CustomHeading variant={name as HeadingProps['variant']}>
          {domToReact(children, parserOptions)}
        </CustomHeading>
      );
    }

    if (name === 'p') {
      return <Text>{domToReact(children, parserOptions)}</Text>;
    }

    if (name === 'a') {
      return (
        <a
          href={domNode.attribs.href}
          className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
        >
          {domToReact(children, parserOptions)}
        </a>
      );
    }

    if (name === 'ul') {
      return (
        <ul className="list-inside list-disc">
          {domToReact(children, parserOptions)}
        </ul>
      );
    }
  },
};

export default function TermsOfUsagePage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { htmlContent } = props;
  const parsedContent = parse(htmlContent, parserOptions);

  return (
    <Page title="Terms of Usage">
      <Page.Block className="bg-white">
        <div className="flex flex-col gap-3">
          {/* Render parsed html with suomifi-brand/tailwind styling */}
          {parsedContent}
        </div>
      </Page.Block>
    </Page>
  );
}

/* <CustomHeading variant="h3">
            Your privacy is important to us
          </CustomHeading>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
            tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex
            ea commodi consequat. Quis aute iure reprehenderit in voluptate
            velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
            obcaecat cupiditat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </Text>
          <CustomHeading variant="h3">
            What information do we process?
          </CustomHeading>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
            tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex
            ea commodi consequat. Quis aute iure reprehenderit in voluptate
            velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
            obcaecat cupiditat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </Text>
          <CustomHeading variant="h4">
            1. The information you provide to Virtual
          </CustomHeading>
          <Text>
            Depending on the service, we process the following information that
            you provide to Virtual Finland:
          </Text>
          <ul className="list-inside list-disc">
            <li>
              <Text>Lorem impsun dolor sit amet</Text>
            </li>
            <li>
              <Text>Lorem impsun dolor sit amet</Text>
            </li>
            <li>
              <Text>Lorem impsun dolor sit amet</Text>
            </li>
          </ul>
          <CustomHeading variant="h4">
            2. Information derived from the use of services
          </CustomHeading>
          <ul className="list-inside list-disc">
            <li>
              <Text>Lorem impsun dolor sit amet</Text>
            </li>
            <li>
              <Text>Lorem impsun dolor sit amet</Text>
            </li>
            <li>
              <Text>Lorem impsun dolor sit amet</Text>
            </li>
          </ul>
          <CustomHeading variant="h3">
            What is the purpose of us processing personal data?
          </CustomHeading>
          <Text>
            We process your personal data for one or more of the purposes
            described below.
          </Text>
          <CustomHeading variant="h4">
            1. The provision and personalisation of services
          </CustomHeading>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
            tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex
            ea commodi consequat. Quis aute iure reprehenderit in voluptate
            velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
            obcaecat cupiditat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </Text>
          <CustomHeading variant="h4">
            2. The provision and personalisation of services
          </CustomHeading>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
            tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex
            ea commodi consequat. Quis aute iure reprehenderit in voluptate
            velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
            obcaecat cupiditat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </Text>
          <CustomHeading variant="h4">
            3. Customer service and feedback
          </CustomHeading>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
            tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex
            ea commodi consequat. Quis aute iure reprehenderit in voluptate
            velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
            obcaecat cupiditat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </Text>
          <CustomHeading variant="h3">
            Will the data be shared with any third parties?
          </CustomHeading>
          <Text>
            We will only disclose information to parties outside Virtual Finland
            in the following situations:
          </Text>
          <ul className="list-inside list-disc">
            <li>
              <Text>Lorem impsun dolor sit amet</Text>
            </li>
            <li>
              <Text>Lorem impsun dolor sit amet</Text>
            </li>
            <li>
              <Text>Lorem impsun dolor sit amet</Text>
            </li>
          </ul>
          <CustomHeading variant="h3">
            Who processes your personal data?
          </CustomHeading>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
            tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex
            ea commodi consequat. Quis aute iure reprehenderit in voluptate
            velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
            obcaecat cupiditat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </Text>
          <CustomHeading variant="h3">
            Is data processed outside the EU or the EEA?
          </CustomHeading>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
            tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex
            ea commodi consequat. Quis aute iure reprehenderit in voluptate
            velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
            obcaecat cupiditat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </Text>
          <CustomHeading variant="h3">
            What do we do to protect your personal data?
          </CustomHeading>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
            tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex
            ea commodi consequat. Quis aute iure reprehenderit in voluptate
            velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
            obcaecat cupiditat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </Text>
          <CustomHeading variant="h3">
            How long do we store your data?
          </CustomHeading>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
            tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex
            ea commodi consequat. Quis aute iure reprehenderit in voluptate
            velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
            obcaecat cupiditat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </Text>
          <CustomHeading variant="h3">
            Changes to this privacy statement
          </CustomHeading>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
            tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex
            ea commodi consequat. Quis aute iure reprehenderit in voluptate
            velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
            obcaecat cupiditat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </Text>
          <CustomHeading variant="h3">
            Who is the data controller and how can I contact them?
          </CustomHeading>
          <div className="flex flex-col gap-4">
            <Text>
              The controller of your personal data is Virtual Finland, located
              at Address 5, 00240 Helsinki.
            </Text>
            <Text>
              In matters concerning data protection, you can send email to{' '}
              <a
                href="mailto:"
                className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
              >
                virtulfinland@virtualfinland.com.
              </a>
            </Text>
            <Text>
              If you change your mind about the terms of usage after profile
              creation, we encourage you to delete your profile data. Nothing
              will be stored about you after this process.
            </Text>
          </div> */
