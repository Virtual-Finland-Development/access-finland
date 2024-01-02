import { LoadingSpinner } from 'suomifi-ui-components';

interface Props {
  status?: 'failed' | 'loading' | 'success';
  text?: string;
  textAlign?: 'bottom' | 'right';
  variant?: 'normal' | 'small';
}

export default function Loading(props: Props) {
  const {
    status = 'loading',
    text = '',
    textAlign = undefined,
    variant = 'normal',
  } = props;

  return (
    <LoadingSpinner
      status={status}
      text={text}
      textAlign={textAlign}
      variant={variant}
    />
  );
}
