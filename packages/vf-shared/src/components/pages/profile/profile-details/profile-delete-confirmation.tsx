import { useState } from 'react';
import { Button, Text } from 'suomifi-ui-components';
import api from '@shared/lib/api';
import { useToast } from '@shared/context/toast-context';
import DangerButton from '@shared/components/ui/danger-button';
import Loading from '@shared/components/ui/loading';

interface Props {
  onCancel: () => void;
}

export default function ProfileDeleteConfirmation(props: Props) {
  const { onCancel } = props;
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const onDelete = async () => {
    setIsLoading(true);

    try {
      await api.profile.deleteProfile();
      await api.auth.directToAuthLogout();
    } catch (error: any) {
      setIsLoading(false);
      toast({
        status: 'error',
        title: 'Error',
        content: error?.message || 'Something went wrong.',
      });
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
        tempor incidunt ut labore et dolore magna aliqua.
      </Text>
      <Text>
        All the profile information you have provided will be deleted. You will
        be logged out once deletion completes. Are you sure you wish to delete
        your profile information?
      </Text>
      <div className="flex flex-row gap-3 mt-3 items-center">
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <DangerButton onClick={onDelete} disabled={isLoading}>
          Yes, Delete
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
