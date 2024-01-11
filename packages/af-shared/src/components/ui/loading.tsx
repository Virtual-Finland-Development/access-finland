import { ReactNode } from 'react';
import { LoadingSpinner } from 'suomifi-ui-components';

interface Props {
  status?: 'failed' | 'loading' | 'success';
  text?: string;
  textAlign?: 'bottom' | 'right';
  variant?: 'normal' | 'small';
  /** When used, loading indicator is absolute positioned relative to container element. Add 'position: relative' to container element when needed. */
  asOverlay?: boolean;
  /** Background color for the loading overlay. Defaults to 'white'. Use valid CSS color value like HEX, RGB or corresponding string value. */
  overlayBgColor?: string;
}

export default function Loading(props: Props) {
  const {
    status = 'loading',
    text = '',
    textAlign = undefined,
    variant = 'normal',
    asOverlay = false,
    overlayBgColor = 'white',
  } = props;

  const renderLoadingSpinner = (spinner: ReactNode) => {
    if (asOverlay) {
      return (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-[${overlayBgColor}] bg-opacity-60 z-10`}
        >
          {spinner}
        </div>
      );
    }

    return spinner;
  };

  return renderLoadingSpinner(
    <LoadingSpinner
      className="!leading-none"
      status={status}
      text={text}
      textAlign={textAlign}
      variant={variant}
    />
  );
}
