import { ReactNode } from 'react';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import OtpInput from 'react-otp-input';
import { HintText, Label, StatusText } from 'suomifi-ui-components';

interface CodeInputControllerProps<T extends FieldValues> {
  name: Path<T>;
  rules?: RegisterOptions;
  control: Control<T>;
}

interface Props<T extends FieldValues> extends CodeInputControllerProps<T> {
  labelText: ReactNode;
  hintText?: string;
  optionalText?: string;
  showStatusText?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  fullWidth?: boolean;
  numInputs: number;
}

const inputErrorStyles = {
  borderWidth: '2px',
  borderColor: 'hsl(3,59%,48%)',
};

export default function FormCodeInput<T extends FieldValues>(props: Props<T>) {
  const {
    name,
    rules = {},
    control,
    labelText,
    hintText,
    optionalText,
    showStatusText = true,
    readOnly = false,
    autoFocus,
    fullWidth,
    numInputs,
  } = props;

  return (
    <Controller
      name={name}
      control={control as unknown as Control<FieldValues>}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <div className="flex flex-row gap-1">
            <Label>{labelText}</Label>
            {optionalText && <HintText>({optionalText})</HintText>}
          </div>

          {hintText && <HintText className="!-mt-2">{hintText}</HintText>}

          <div className="-mt-3">
            <OtpInput
              value={value}
              onChange={onChange}
              numInputs={numInputs}
              shouldAutoFocus={autoFocus}
              renderInput={({ className, ...rest }) => (
                <input className="otp-input" {...rest} readOnly={readOnly} />
              )}
              containerStyle={{
                width: fullWidth ? 'calc(100% + 8px)' : '298px',
                marginLeft: '-4px',
                marginRight: '-4px',
              }}
              inputStyle={{
                width: `calc(100% / ${numInputs})`,
                ...(error && inputErrorStyles),
              }}
            />
            {error && showStatusText && (
              <StatusText className="!text-[hsl(3,59%,48%)]">
                {error.message}
              </StatusText>
            )}
          </div>
        </>
      )}
    />
  );
}
