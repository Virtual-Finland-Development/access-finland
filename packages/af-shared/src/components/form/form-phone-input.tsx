import { ReactNode, forwardRef } from 'react';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input';
import PhoneInput from 'react-phone-number-input/react-hook-form-input';
import { TextInput, TextInputProps } from 'suomifi-ui-components';

interface PhoneInputControllerProps<T extends FieldValues> {
  name: Path<T>;
  rules?: RegisterOptions;
  control: Control<T>;
}

interface Props<T extends FieldValues> extends PhoneInputControllerProps<T> {
  labelText: ReactNode;
  hintText?: string;
  optionalText?: string;
  readOnly?: boolean;
  showStatusText?: boolean;
}

const PhoneInputComponent = forwardRef<
  HTMLInputElement,
  Pick<
    TextInputProps,
    | 'labelText'
    | 'hintText'
    | 'status'
    | 'statusText'
    | 'optionalText'
    | 'readOnly'
  >
>((props, ref) => {
  return <TextInput ref={ref} {...props} autoComplete="off" />;
});

PhoneInputComponent.displayName = 'PhoneInputComponent';

export default function FormPhoneInput<T extends FieldValues>(props: Props<T>) {
  const {
    name,
    control,
    rules,
    labelText,
    hintText,
    readOnly = false,
    showStatusText = true,
  } = props;

  const phoneFieldValidation = (value: any) => {
    if (!value) return true;
    const isValid = isValidPhoneNumber(value);
    return isValid || 'Invalid phone number form.';
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{ ...rules, validate: phoneFieldValidation }}
      render={({ fieldState: { error } }) => (
        <PhoneInput
          name={name}
          control={control}
          inputComponent={PhoneInputComponent}
          labelText={labelText}
          hintText={hintText}
          status={error ? 'error' : 'default'}
          statusText={showStatusText && error ? error.message : ''}
          readOnly={readOnly}
        />
      )}
    />
  );
}
