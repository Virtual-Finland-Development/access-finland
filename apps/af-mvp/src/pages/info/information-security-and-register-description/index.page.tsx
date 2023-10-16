import { Text } from 'suomifi-ui-components';
import CustomHeading from '@/components/ui/custom-heading';
import CustomLink from '@shared/components/ui/custom-link';
import InfoPagesLayout from '../components/info-pages-layout';

export default function InformationSecurityAndRegisterDescriptionPage() {
  return (
    <InfoPagesLayout title="Information Security and Register Description">
      <article className="flex flex-col gap-6">
        <CustomHeading variant="h2">
          Access Finland data protection statement
        </CustomHeading>
        <Text className="italic !font-bold">
          <span className="block">
            Regulation (EU) 2016/679 of the European Parliament and of the
            Council
          </span>
          <span className="block">First version issued 16 October 2023</span>
        </Text>

        <CustomHeading variant="h3">1. Controller</CustomHeading>
        <Text>
          <span className="block">Ulkoministeriö, Post Box 176</span>
          <span className="block">FI-00023 Valtioneuvosto</span>
        </Text>
        <Text>
          <a
            href="mailto:virtualfinland.um@gov.fi"
            className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
          >
            virtualfinland.um@gov.fi
          </a>
        </Text>

        <CustomHeading variant="h3">
          2. Contact person for matters concerning the register
        </CustomHeading>
        <Text>
          <span className="block">Data Protection Officer:</span>
          <span className="block">
            <a
              href="mailto:tietosuoja.um@gov.fi"
              className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            >
              tietosuoja.UM@gov.fi
            </a>
          </span>
        </Text>
        <Text>
          <span className="block">
            Contacts on matters concerning the register:
          </span>
          <span className="block">
            <a
              href="mailto:virtualfinland.um@gov.fi"
              className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            >
              virtualfinland.um@gov.fi
            </a>
          </span>
        </Text>

        <CustomHeading variant="h3">3. Name of the register</CustomHeading>
        <Text>Access Finland (the Service)</Text>

        <CustomHeading variant="h3">
          4. Purpose of personal data processing
        </CustomHeading>
        <Text>
          The register data in the information system is used for easing up job
          finding for registered immigrants. The processing of personal data is
          required to be able to match job opportunities for registered service
          users, based on their job application profile.
        </Text>

        <CustomHeading variant="h3">5. Register’s data content</CustomHeading>
        <Text>
          In the service, personal data processing is consented by the user. The
          following information concerning identified private customers will be
          stored:
        </Text>
        <ul className="list-outside list-disc ms-8">
          <li>
            <Text>
              personal identification data: Digital Id, name, email address,
              phone number
            </Text>
          </li>
          <li>
            <Text>
              data concerning education, work experience and expertise
            </Text>
          </li>
          <li>
            <Text>transaction data time stamps</Text>
          </li>
          <li>
            <Text>country of residence</Text>
          </li>
        </ul>
        <Text>
          The Service user is responsible for the correctness of data they have
          supplied themselves.
        </Text>

        <CustomHeading variant="h4">
          5.1 Analytics and feedback system
        </CustomHeading>
        <Text>
          Access Finland collect analytics about service usage. Examples of such
          data:
        </Text>
        <ul className="list-outside list-disc ms-8">
          <li>
            <Text>User count</Text>
          </li>
        </ul>
        <Text>
          The data collected by the analytics tool never includes the person’s
          name, personal Id, or other similar identifying data. Service does not
          use this data to attempt to identify individual website visitors.
        </Text>

        <CustomHeading variant="h3">
          6. Regular sources of information
        </CustomHeading>
        <Text>
          Information stored in the service is based solely on the information
          given by the User.
        </Text>

        <CustomHeading variant="h3">
          7. Regular disclosures of data
        </CustomHeading>
        <Text>
          Personal data or other information in the service will not be
          disclosed to an authority or other body without the consent of the
          user or a party authorised by the user or without the right to obtain
          information as defined in legislation.
        </Text>

        <CustomHeading variant="h3">
          8. Transferring data outside of the EU or the EEA
        </CustomHeading>
        <Text>
          The data is stored in the EU/EEA area on a cloud server that is
          protected by physical and software protection by, for example,
          encrypting the databases and data communication.
        </Text>

        <CustomHeading variant="h3">9. Data storage period</CustomHeading>
        <Text>
          The data will be stored for a year from the time the user last logged
          in or until the user deletes the account or requests the controller to
          delete the account.
        </Text>

        <CustomHeading variant="h3">10. Right to review</CustomHeading>
        <Text>
          The registered person has the right to check the data stored in the
          personal data file. You can check the data under “Profile” in the
          service. Preferably, you should inspect the data yourself.
        </Text>
        <Text>
          It is also possible to submit an inspection request by e-mail to{` `}
          <a
            href="mailto:virtualfinland.um@gov.fi"
            className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
          >
            virtualfinland.um@gov.fi
          </a>
        </Text>

        <CustomHeading variant="h3">
          11. Right to demand rectification of data
        </CustomHeading>
        <Text>
          A Registered user can correct his/hers own data by using the Service.
        </Text>

        <CustomHeading variant="h3">12. Right to erasure</CustomHeading>
        <Text>
          Data subjects shall be entitled to erase their personal data in the
          register. Primarily, the data subjects delete the information
          themselves under ”Profile” in the Service. This removes the data from
          the service immediately upon deletion.
        </Text>

        <CustomHeading variant="h3">
          13. Other rights related to the processing of personal data
        </CustomHeading>
        <Text>
          Personal data are neither used nor disclosed for the purpose of direct
          advertising, distance marketing or other directing marketing, market
          and opinion research, registers of individuals, or genealogies.
        </Text>

        <CustomHeading variant="h3">14. Cookies</CustomHeading>
        <Text>
          Cookies are used in the Service. A cookie is a small text file, sent
          to the user’s computer and stored in the computer, that enables the
          service to identify frequent visitors to a website, facilitate the
          login process of visitors to a website, and enable the preparation of
          combined data on visitors. Cookies do not cause any damage to users’
          computers or files. When cookies are used, customised information and
          services can be provided to the users of the Service depending on
          their needs.
        </Text>
        <Text>
          If you do not want to allow cookies, you may block cookies from the
          banner appearing at the bottom of the site or from your Internet
          browser settings. Some cookies are necessary for the functioning of
          the service and for this reason, the use of the service requires
          accepting them.
        </Text>

        <CustomHeading variant="h3">15. Log data</CustomHeading>
        <Text>
          Log files are compiled on the use of the Service that contain event
          rows related to data security and the operation of the service. Data
          stored in the log file does not contain information saved by the user.
          Data in the log file are only used for investigating any disruptions
          in the Service and possible data security threats and violations.
          Access to the log data is only permitted to persons who participate in
          theresolving of the above-mentioned issue.
        </Text>

        <CustomHeading variant="h3">
          16. Notifications and complaints concerning the processing of personal
          data
        </CustomHeading>
        <Text>
          <span className="block">
            If necessary, a user can lodge a complaint or appeal with the Data
            Protection Ombudsman concerning the processing of their personal
            data.
          </span>
        </Text>
        <CustomLink
          href="https://tietosuoja.fi/en/home"
          isExternal
          disableVisited
        >
          Office of the data protection (tietosuoja.fi)
        </CustomLink>
      </article>
    </InfoPagesLayout>
  );
}
