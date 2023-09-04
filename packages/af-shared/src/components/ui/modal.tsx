import dynamic from 'next/dynamic';
import { ReactNode } from 'react';
import FocusLockUI from 'react-focus-lock/UI';
import {
  ModalContent,
  ModalTitle,
  Modal as SuomiFiModal,
} from 'suomifi-ui-components';
import { sidecar } from 'use-sidecar';
import useDimensions from '@/lib/hooks/use-dimensions';

const ModalFooter = dynamic(() =>
  import('suomifi-ui-components').then(mod => mod.ModalFooter)
);

// https://github.com/theKashey/react-focus-lock#separated-usage
const FocusLockSidecar = sidecar(
  () => import(/* webpackPrefetch: true */ 'react-focus-lock/sidecar')
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
      // for unit tests not to fail when modal is included, resolve appElementId by using querySelector
      // will be undefined in tests, which is fine
      appElementId={document.querySelector('#__next')?.id as string}
      visible
      variant={width > 640 ? 'default' : 'smallScreen'}
      onEscKeyDown={() => closeOnEsc && closeModal()}
    >
      <FocusLockUI sideCar={FocusLockSidecar} className="overflow-auto">
        <ModalContent>
          <ModalTitle>{title}</ModalTitle>
          {content}
        </ModalContent>
        {footerContent && <ModalFooter>{footerContent}</ModalFooter>}
      </FocusLockUI>
    </SuomiFiModal>
  );
}
