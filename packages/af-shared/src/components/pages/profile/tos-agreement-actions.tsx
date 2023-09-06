import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button, InlineAlert, Text } from 'suomifi-ui-components';
import api from '@/lib/api';
import { PROFILE_TOS_AGREEMENT_QUERY_KEYS } from '@/lib/hooks/profile';
import { useModal } from '@/context/modal-context';
import { useToast } from '@/context/toast-context';
import CustomHeading from '@/components/ui/custom-heading';
import CustomLink from '@/components/ui/custom-link';
import DangerButton from '@/components/ui/danger-button';
import Loading from '@/components/ui/loading';
import ProfileDeleteConfirmation from './profile-details/profile-delete-confirmation';

interface AgreementProps {
  onAccept: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

function Agreement(props: AgreementProps) {
  const { onAccept, onCancel, isLoading } = props;

  return (
    <div className="flex flex-col items-start gap-6">
      <CustomHeading variant="h3">Tems of Use Agreement</CustomHeading>
      <Text>
        Before you can create a user account and access our services, please
        take a moment to read and accept our Terms of Use. These terms are
        important as they outline the rules and guidelines for using our
        platform. By accepting these terms, you agree to abide by them
        throughout your usage of our services.
      </Text>
      <Text>
        <CustomLink href="/terms-of-use" target="_blank" disableVisited>
          Access Finland Terms of Use
        </CustomLink>
      </Text>
      <Text>
        By clicking &quot;Accept,&quot; you acknowledge that you have read and
        understood our Terms of Use Agreement. You also consent to the
        collection, use, and storage of your personal information as outlined in
        our Privacy Policy. If you do not agree with these terms, please do not
        create an account on Access Finland.
      </Text>
      <div className="flex flex-row items-center gap-3">
        <Button onClick={onAccept} disabled={isLoading}>
          Accept
        </Button>
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          I don’t accept, sign out
        </Button>
        {isLoading && (
          <div className="mt-1 ml-1">
            <Loading variant="small" />
          </div>
        )}
      </div>
    </div>
  );
}

type AgreementChangeProps = Omit<AgreementProps, 'onCancel'>;

function AgreementChange(props: AgreementChangeProps) {
  const { onAccept, isLoading } = props;
  const { openModal, closeModal } = useModal();

  const onDelete = () =>
    openModal({
      title: 'Delete profile',
      content: <ProfileDeleteConfirmation onCancel={closeModal} />,
      onClose: closeModal,
      closeOnEsc: false,
    });

  return (
    <div className="flex flex-col items-start gap-6">
      <CustomHeading variant="h3">Updated Terms of Use Agreement</CustomHeading>
      <Text>
        Before you can continue to access our services, we want to inform you
        that we have recently updated our Terms of Use. These updated terms are
        important as they outline the rules and guidelines for using our
        platform. By continuing to use our services, you agree to abide by these
        updated terms.
      </Text>
      <CustomLink href="/terms-of-use" target="_blank" disableVisited>
        Updated Terms of Use
      </CustomLink>
      <Text>
        By clicking &quot;Accept,&quot; you acknowledge that you have read and
        understood our Updated Terms of Use Agreement. You also consent to the
        collection, use, and storage of your personal information as outlined in
        our Privacy Policy. If you do not agree with these updated terms, you
        are able to delete your Access Finland profile and stop using the
        service.
      </Text>
      <div className="flex flex-row items-center gap-3">
        <Button onClick={onAccept} disabled={isLoading}>
          Accept
        </Button>
        <DangerButton onClick={onDelete} disabled={isLoading}>
          I don’t accept, delete my profile
        </DangerButton>
        {isLoading && (
          <div className="mt-1 ml-1">
            <Loading variant="small" />
          </div>
        )}
      </div>
    </div>
  );
}

interface Props {
  isNewUser: boolean;
}

export default function TosAgreementActions(props: Props) {
  const { isNewUser } = props;
  const reactQueryClient = useQueryClient();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const onAccept = async () => {
    setIsLoading(true);

    try {
      const response = await api.profile.saveProfileTosAgreement();
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

  const onCancel = async () => {
    setIsLoading(true);
    await api.auth.directToAuthLogout();
  };

  return (
    <InlineAlert status={isNewUser ? 'neutral' : 'warning'}>
      {isNewUser ? (
        <Agreement
          onAccept={onAccept}
          onCancel={onCancel}
          isLoading={isLoading}
        />
      ) : (
        <AgreementChange onAccept={onAccept} isLoading={isLoading} />
      )}
    </InlineAlert>
  );
}
