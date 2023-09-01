import dynamic from 'next/dynamic';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { REQUEST_NOT_AUTHORIZED } from '@/lib/constants';

const Modal = dynamic(() => import('@/components/ui/modal'));

interface ModalProps {
  title: string;
  content: ReactNode;
  footerContent?: ReactNode;
  onClose?: () => void;
  closeOnEsc?: boolean;
}

interface ModalContextProps {
  openModal: (modal: ModalProps) => void;
  closeModal: () => void;
}

interface ModalProviderProps {
  children: ReactNode;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

function ModalProvider({ children }: ModalProviderProps) {
  const [modal, setModal] = useState<ModalProps | null>(null);

  const openModal = (modal: ModalProps) => {
    setModal(modal);
  };

  const closeModal = useCallback(async () => {
    if (modal && typeof modal.onClose === 'function') {
      modal.onClose();
    }

    setModal(null);
  }, [modal]);

  // Make sure any opened modal is closed when user is presented with alert window about expired token
  useEffect(() => {
    const onWindowMessageEvent = (event: MessageEvent) => {
      if (event.data === REQUEST_NOT_AUTHORIZED) {
        closeModal();
      }
    };
    // make sure Next.js is running on client-side (window is defined), before attempting to add window listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('message', onWindowMessageEvent);
      return () => window.removeEventListener('message', onWindowMessageEvent);
    }
  }, [closeModal]);

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
      }}
    >
      {children}
      {modal && <Modal {...modal} closeModal={closeModal} />}
    </ModalContext.Provider>
  );
}

function useModal() {
  const context = useContext(ModalContext);

  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return context;
}

export { ModalContext, ModalProvider, useModal };
