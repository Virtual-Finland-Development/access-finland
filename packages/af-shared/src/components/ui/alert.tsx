import { ReactNode } from 'react';
import { InlineAlert } from 'suomifi-ui-components';

interface Props {
  labelText?: string;
  status?: 'error' | 'neutral' | 'warning';
  children: ReactNode;
}

export default function Alert(props: Props) {
  const { status = 'neutral', labelText = '', children } = props;

  return (
    <InlineAlert status={status} labelText={labelText}>
      {children}
    </InlineAlert>
  );
}
