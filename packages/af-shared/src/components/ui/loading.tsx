import { LoadingSpinner } from 'suomifi-ui-components';

interface Props {
  status?: 'failed' | 'loading' | 'success';
  text?: string;
  variant?: 'normal' | 'small';
}

export default function Loading(props: Props) {
  const { status = 'loading', text = '', variant = 'normal' } = props;

  return (
    <LoadingSpinner
      status={status}
      text={text}
      textAlign="bottom"
      variant={variant}
    />
  );
}
