import { Fragment, ReactNode, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button, InlineAlert, Text } from 'suomifi-ui-components';
import api from '@/lib/api';
import {
  PROFILE_TOS_AGREEMENT_QUERY_KEYS,
  useProfileTosAgreement,
} from '@/lib/hooks/profile';
import { useModal } from '@/context/modal-context';
import { useToast } from '@/context/toast-context';
import CustomHeading from '@/components/ui/custom-heading';
import CustomLink from '@/components/ui/custom-link';
import DangerButton from '@/components/ui/danger-button';
import Loading from '@/components/ui/loading';
import ProfileDeleteConfirmation from './profile-details/profile-delete-confirmation';

const TITLE = {
  new: 'Terms of Use Agreement',
  change: 'Updated Terms of Use Agreement',
};
const LINK_TITLE = {
  new: 'Access Finland Terms of Use',
  change: 'Updated Terms of Use',
};
const CONTENT_1 = {
  new: 'Before you can create a digital profile and access our services, please take a moment to read and accept our Terms of Use. These terms are important as they outline the rules and guidelines for using our platform. By accepting these terms, you agree to abide by them throughout your usage of our services.',
  change:
    'Before you can continue to access our services, we want to inform you that we have recently updated our Terms of Use. These updated terms are important as they outline the rules and guidelines for using our platform. By continuing to use our services, you agree to abide by these updated terms.',
};
const CONTENT_2 = {
  new: 'By clicking "Accept," you acknowledge that you have read and understood our Terms of Use Agreement. You also consent to the collection, use, and storage of your personal information as outlined in our Privacy Policy. If you do not agree with these terms, please do not create a profile on Access Finland.',
  change:
    'By clicking "Accept," you acknowledge that you have read and understood our Updated Terms of Use Agreement. You also consent to the collection, use, and storage of your personal information as outlined in our Privacy Policy. If you do not agree with these updated terms, you are able to delete your Access Finland profile and stop using the service.',
};

interface AgreementProps {
  contentKey: 'new' | 'change';
  children?: ReactNode;
}

function AgreementContent(props: AgreementProps) {
  const { contentKey, children } = props;

  return (
    <div className="flex flex-col items-start gap-6">
      <CustomHeading variant="h3">{TITLE[contentKey]}</CustomHeading>
      <Text>{CONTENT_1[contentKey]}</Text>
      <Text>
        <CustomLink href="/terms-of-use" target="_blank" disableVisited>
          {LINK_TITLE[contentKey]}
        </CustomLink>
      </Text>
      <Text>{CONTENT_2[contentKey]}</Text>
      <div className="flex flex-row items-center gap-3">{children}</div>
    </div>
  );
}

interface Props {
  agreement: ReturnType<typeof useProfileTosAgreement>['data'];
}

export default function TosAgreementActions(props: Props) {
  const { agreement } = props;
  const reactQueryClient = useQueryClient();
  const toast = useToast();
  const { openModal, closeModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const isNewUser = !agreement?.acceptedPreviousVersion;

  const onAccept = async () => {
    setIsLoading(true);

    try {
      const response = await api.profile.saveProfileTosAgreement({
        version: agreement?.version!,
        accepted: true,
      });
      reactQueryClient.setQueryData(PROFILE_TOS_AGREEMENT_QUERY_KEYS, response);
    } catch (error) {
      toast({
        status: 'error',
        title: 'Error',
        content: error?.message || 'Something went wrong.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDeny = async () => {
    if (isNewUser) {
      setIsLoading(true);
      await api.auth.directToAuthLogout();
    } else {
      openModal({
        title: 'Delete profile',
        content: <ProfileDeleteConfirmation onCancel={closeModal} />,
        onClose: closeModal,
        closeOnEsc: false,
      });
    }
  };

  return (
    <InlineAlert status={isNewUser ? 'neutral' : 'warning'}>
      <AgreementContent contentKey={isNewUser ? 'new' : 'change'}>
        <Fragment>
          <Button onClick={onAccept} disabled={isLoading}>
            Accept
          </Button>
          {isNewUser ? (
            <Button variant="secondary" onClick={onDeny} disabled={isLoading}>
              I don’t accept
            </Button>
          ) : (
            <DangerButton onClick={onDeny} disabled={isLoading}>
              I don’t accept, delete my profile
            </DangerButton>
          )}
          {isLoading && (
            <div className="mt-1 ml-1">
              <Loading variant="small" />
            </div>
          )}
        </Fragment>
      </AgreementContent>
    </InlineAlert>
  );
}
