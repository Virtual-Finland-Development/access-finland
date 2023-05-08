import { ReactNode, createContext, useCallback, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { InlineAlert } from 'suomifi-ui-components';

interface ToastProps {
  status: 'error' | 'neutral' | 'warning';
  title: string;
  content: ReactNode;
}

interface ToastContextProps {
  toast: (toastProps: ToastProps) => void;
}

interface ToastProviderProps {
  children: ReactNode;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

function ToastProvider({ children }: ToastProviderProps) {
  const setNewToast = useCallback(
    (newToast: ToastProps) =>
      toast(
        <InlineAlert labelText={newToast.title} status={newToast.status}>
          {newToast.content}
        </InlineAlert>
      ),
    []
  );

  return (
    <ToastContext.Provider
      value={{
        toast: setNewToast,
      }}
    >
      <ToastContainer
        hideProgressBar={true}
        closeButton={false}
        closeOnClick={false}
        pauseOnHover={false}
        draggable={false}
      />
      {children}
    </ToastContext.Provider>
  );
}

function useToast() {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context.toast;
}

export { ToastContext, ToastProvider, useToast };
