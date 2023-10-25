import { Text } from 'suomifi-ui-components';
import CustomHeading from '@/components/ui/custom-heading';
import CustomLink from '@shared/components/ui/custom-link';
import InfoPagesLayout from '../components/info-pages-layout';

export default function TermsOfUsagePage() {
  return (
    <InfoPagesLayout title="Terms of Use">
      <article className="flex flex-col gap-6">
        <CustomHeading variant="h2">Terms of Use</CustomHeading>
        <Text className="italic !font-bold">
          Access Finland Terms of Use v1.0, 18.09.2023
        </Text>

        <Text>
          These Terms of Use (“Terms of Use”) shall govern the Access Finland
          Service(“Service”) produced by the Ministry of Foreign affairs
          (“Service Provider”). The Service user (“User”) shall assure that they
          have read these Terms of Use and undertake to comply with them when
          using the Service.
        </Text>
        <Text>
          The use of the part of Service that requires logging in, requires that
          the User subscribes to the Service. When subscribing to the Service,
          the User shall become a customer of the Service Provider and the
          User’s data is registered in the Service register.
        </Text>
        <Text>
          In these Terms of Use, Service means the version of the Access
          Finland, which is a publicly funded web service that collects and
          share information given by immigrant for other Finnish services such
          as open vacancies based on profile information and make it easier to
          use such a services.
        </Text>

        <CustomHeading variant="h3">Service Description</CustomHeading>
        <Text>
          The Service Provider aims at producing Service which is as high-grade
          as possible and shall be responsible for ensuring that the content of
          the Service complies with the law and good practice.
        </Text>
        <Text>
          The Service Provider shall have all rights (proprietary rights,
          copyright and other intellectual property rights) relating to the
          Service. The User shall be granted the access right to the Service in
          compliance with these Terms of Use, but the User shall not be granted
          any other rights that relate to the Service.
        </Text>
        <Text>
          The content of the User’s access right is defined in these Terms of
          Use which the User accepts as a binding contract when subscribing to
          the Service.
        </Text>

        <CustomHeading variant="h3">
          Collecting and using information
        </CustomHeading>
        <CustomHeading variant="h4">
          Person basic information{' '}
          <CustomLink
            $bold
            isExternal
            disableVisited
            href="https://definitions.staging.datafinland.dev/definitions/Person/BasicInformation_v0.1"
          >
            Data Definitions Viewer (datafinland.dev)
          </CustomLink>
        </CustomHeading>
        <Text>
          These are basic profile information that are needed to create
          low-level Digital Identity and Access Finland service account.
          Together with Job applicant profile information these can be used for
          example to offer matching vacancies in other services.
        </Text>
        <CustomHeading variant="h4">
          Job applicant profile{' '}
          <CustomLink
            $bold
            isExternal
            disableVisited
            href="https://definitions.staging.datafinland.dev/definitions/Person/JobApplicantProfile_v0.1"
          >
            Data Definitions Viewer (datafinland.dev)
          </CustomLink>
        </CustomHeading>
        <Text>
          This information can be used to provide person list of vacancies that
          match the profile.
        </Text>

        <CustomHeading variant="h3">Storing information</CustomHeading>
        <Text>
          Profile data is stored inside European Union, and the data is stored
          encrypted.
        </Text>

        <CustomHeading variant="h3">Data sharing with 3rd party</CustomHeading>
        <Text>At the moment data is not shared outside of AF application.</Text>

        <CustomHeading variant="h3">Cookies</CustomHeading>
        <Text>
          Access Finland service can use internal cookies: Sinuna low-level
          authentication sets a cookie to enable use of service.
        </Text>

        <CustomHeading variant="h3">
          User’s rights and liabilities
        </CustomHeading>
        <Text>
          A prerequisite for using the service is that the User approves the
          binding Terms of Use.
        </Text>
        <Text>After accepting the Terms of Use, the User shall undertake</Text>
        <ul className="list-outside list-disc ms-8">
          <li>
            <Text>
              to comply with the agreements made with the party that provides
              the ID and the terms and conditions that relate to the use of the
              ID (the Service may only be used with the User’s personal ID),
            </Text>
          </li>
          <li>
            <Text>
              to assume responsibility for only providing truthful information
              that complies with the purpose of the Service, and for not causing
              any disturbance to others or infringing the rights of other users
              or the Service Provider by means of the User’s Service use,
            </Text>
          </li>
          <li>
            <Text>
              to assume responsibility for revealing their identity in a
              situation in which the User, for example, posts links to external
              services to the Service, and
            </Text>
          </li>
          <li>
            <Text>
              to cover all personal costs that may be caused to them for using
              the Service (e.g. Internet connection charges, possible phone
              calls).
            </Text>
          </li>
        </ul>
        <Text>
          The rights that relate to the personal data are described in the data
          protection statement.
        </Text>
        <CustomLink href="/info/data-protection-statement" disableVisited>
          Access Finland’s data protection statement
        </CustomLink>

        <CustomHeading variant="h3">Changing the Terms of Use</CustomHeading>
        <Text>
          The Service Provider constantly develops Access Finland which may
          cause changes to the content of the Service. When the Service Provider
          publish new Terms, Service user must approve them prior logging to
          service.
        </Text>
        <Text>
          If the User does not accept the new Terms of Use, they shall have the
          right to stop using the Service and remove their data from the
          Service.
        </Text>

        <CustomHeading variant="h3">Applicable legislation</CustomHeading>
        <Text>
          These Terms of Use and the Services referred to in them as well as any
          agreement concluded concerning the Service shall be governed by
          Finnish law.
        </Text>

        <div className="flex flex-col gap-4">
          <CustomHeading variant="h3">Contact Information</CustomHeading>
          <Text>
            Access Finland can be contacted by email:{' '}
            <a
              href="mailto:virtualfinland.um@gov.fi"
              className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            >
              virtualfinland.um@gov.fi
            </a>
          </Text>
        </div>
      </article>
    </InfoPagesLayout>
  );
}
