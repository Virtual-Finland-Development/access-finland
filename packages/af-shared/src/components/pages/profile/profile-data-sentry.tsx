import { Fragment, ReactNode } from 'react';
import {
  FormattedErrorResponse,
  useProfileTosAgreement,
} from '@/lib/hooks/profile';
import ProfileErrors from './profile-errors';
import TosAgreementActions from './tos-agreement-actions';

interface Props {
  errorResponses: (FormattedErrorResponse | undefined)[];
  agreement: ReturnType<typeof useProfileTosAgreement>['data'];
  children: ReactNode;
}

export default function ProfileDataSentry(props: Props) {
  const { errorResponses, agreement, children } = props;

  return (
    <Fragment>
      {/* If any of the profile requests fail (not 404), display errors instead of profile details */}
      {errorResponses.some(response => response?.shouldPrintError) ? (
        <ProfileErrors
          errorMessages={errorResponses
            .filter(response => response) // filter out undefined values
            .map((response: FormattedErrorResponse) => response.message)} // tell TS explicitly map will not return undefined values
        />
      ) : (
        <Fragment>
          {agreement && !agreement.accepted ? (
            <TosAgreementActions agreement={agreement} />
          ) : (
            <Fragment>{children}</Fragment>
          )}
        </Fragment>
      )}
    </Fragment>
  );
}
