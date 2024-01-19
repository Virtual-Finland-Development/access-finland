import { useState } from 'react';
import { Button, IconLogin, IconLogout, Text } from 'suomifi-ui-components';
import { useModal } from '@shared/context/modal-context';
import DangerButton from '@shared/components/ui/danger-button';
import Loading from '@shared/components/ui/loading';

interface Props {
  handleLogin: () => void;
  handleLogout: () => void;
  handleDelete: () => void;
}

type ConfirmProps = Pick<Props, 'handleDelete'> & {
  handleClose: () => void;
};

function Confirm(props: ConfirmProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { handleDelete, handleClose } = props;

  const handleDeleteClick = async () => {
    setIsLoading(true);
    await handleDelete();
    handleClose();
  };

  return (
    <div className="flex flex-col gap-3">
      <Text>
        You can delete your Virtual Finland identity at any time. Please note
        that deleting your account cannot be undone.
      </Text>
      <Text>
        You are using Virtual Finland account for the following services and you
        will no longer be able to log in via Virtual Finland after deleting your
        ID:
      </Text>
      <ul className="list-disc list-outside text-base ml-[17px]">
        <li>
          <Text>Access Finland</Text>
        </li>
      </ul>
      <div className="flex flex-row gap-3 mt-3 items-center">
        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <DangerButton onClick={handleDeleteClick} disabled={isLoading}>
          Delete my ID
        </DangerButton>
        {isLoading && (
          <div className="ml-1">
            <Loading variant="small" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function SignedIn(props: Props) {
  const { handleLogin, handleLogout, handleDelete } = props;
  const { openModal, closeModal } = useModal();

  const handleConfirmDelete = () =>
    openModal({
      title: 'Delete Your Virtual Finland Identity',
      content: <Confirm handleDelete={handleDelete} handleClose={closeModal} />,
      closeOnEsc: false,
    });

  return (
    <div className="flex flex-col gap-6 h-full justify-center">
      <div className="flex flex-col gap-6 md:grow justify-center">
        <div className="flex flex-col gap-2">
          <Text className="!text-base">Finish login to the Access Finland</Text>
          <Button onClick={handleLogin} icon={<IconLogin />}>
            Login to Access Finland
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <Text className="!text-base">
            Logout from your Virtual Finland login session
          </Text>
          <Button
            variant="secondary"
            onClick={handleLogout}
            icon={<IconLogout />}
          >
            Log out from Virtual Finland
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Text className="!text-base">Delete Your Virtual Finland Identity</Text>
        <DangerButton onClick={handleConfirmDelete} variant="secondary">
          Delete My Virtual Finland ID
        </DangerButton>
      </div>
    </div>
  );
}
