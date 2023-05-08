import dynamic from 'next/dynamic';
import { ReactNode } from 'react';
import {
  ModalContent,
  ModalTitle,
  Modal as SuomiFiModal,
} from 'suomifi-ui-components';
import useDimensions from '@/lib/hooks/use-dimensions';

const ModalFooter = dynamic(() =>
  import('suomifi-ui-components').then(mod => mod.ModalFooter)
);

interface Props {
  title: string;
  content: ReactNode;
  footerContent?: ReactNode;
  closeOnEsc?: boolean;
  closeModal: () => void;
}

export default function Modal(props: Props) {
  const {
    title,
    content,
    footerContent,
    closeOnEsc = true,
    closeModal,
  } = props;

  const { width } = useDimensions();

  return (
    <SuomiFiModal
      appElementId="__next"
      visible
      variant={width > 640 ? 'default' : 'smallScreen'}
      onEscKeyDown={() => closeOnEsc && closeModal()}
    >
      <ModalContent>
        <ModalTitle>{title}</ModalTitle>
        {content}
      </ModalContent>
      {footerContent && <ModalFooter>{footerContent}</ModalFooter>}
    </SuomiFiModal>
  );
}
