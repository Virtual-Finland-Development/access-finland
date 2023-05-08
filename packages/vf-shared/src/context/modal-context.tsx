import dynamic from 'next/dynamic';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

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
