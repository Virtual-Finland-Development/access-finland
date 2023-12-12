import { Fragment, ReactNode } from 'react';
import { useProfileTosAgreement } from '@/lib/hooks/profile';
import { type FormattedErrorResponse } from '@/lib/hooks/utils';
import ProfileErrors from './profile-errors';
import TosAgreementActions from './tos-agreement-actions';

interface Props {
  errors: FormattedErrorResponse[];
  agreement: ReturnType<typeof useProfileTosAgreement>['data'];
  children: ReactNode;
}

export default function ProfileDataSentry(props: Props) {
  const { errors, agreement, children } = props;

  return (
    <Fragment>
      {/* If any of the profile requests fail (not 404), display errors instead of profile details */}
      {errors.some(error => error.shouldPrintError) ? (
        <ProfileErrors
          errorMessages={errors
            .filter(error => error.shouldPrintError)
            .map(error => error.message)}
        />
      ) : (
        <Fragment>
          {agreement && !agreement.hasAcceptedLatest ? (
            <TosAgreementActions agreement={agreement} />
          ) : (
            <Fragment>{children}</Fragment>
          )}
        </Fragment>
      )}
    </Fragment>
  );
}
