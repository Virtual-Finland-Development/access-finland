import { ReactNode } from 'react';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import { format, isValid, parseISO } from 'date-fns';
import { DateInput, TextInput } from 'suomifi-ui-components';
import useDimensions from '@/lib/hooks/use-dimensions';

interface FormInputControllerProps<T extends FieldValues> {
  name: Path<T>;
  rules?: RegisterOptions;
  control: Control<T>;
}

interface Props<T extends FieldValues> extends FormInputControllerProps<T> {
  labelText: ReactNode;
  hintText?: string;
  optionalText?: string;
  placeholder?: ReactNode;
  showStatusText?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  type?:
    | 'number'
    | 'text'
    | 'email'
    | 'password'
    | 'tel'
    | 'url'
    | 'date'
    | undefined;
  formatDefaultValue?: (value: any) => any;
  min?: number;
  step?: number;
}

function safeParseDateDefaultValue(value: string): string {
  try {
    return format(new Date(value), 'd.M.yyyy');
  } catch {
    return '';
  }
}

export default function FormInput<T extends FieldValues>(props: Props<T>) {
  const {
    name,
    rules = {},
    control,
    type,
    labelText,
    hintText,
    optionalText,
    showStatusText = true,
    readOnly = false,
    formatDefaultValue,
    min = 1,
    step = 1,
    autoFocus,
  } = props;

  const { width } = useDimensions();

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        ...rules,
        validate: rules?.validate
          ? rules.validate
          : value => {
              if (type === 'date') {
                return !value ? true : isValid(parseISO(value));
              } else {
                return true;
              }
            },
      }}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error, isDirty },
      }) => (
        <>
          {type === 'date' ? (
            <DateInput
              labelText={labelText}
              hintText={hintText}
              optionalText={optionalText}
              datePickerEnabled
              language="en"
              minDate={new Date(0)}
              smallScreen={width <= 640}
              className="!w-suomifi-input-default"
              status={error ? 'error' : 'default'}
              statusText={showStatusText && error ? error.message : ''}
              initialDate={!isDirty && value ? new Date(value) : new Date()}
              defaultValue={safeParseDateDefaultValue(value)}
              onChange={({ value, date }) => {
                if (date instanceof Date && !isNaN(date.getTime())) {
                  onChange(format(date, 'yyyy-MM-dd'));
                } else {
                  onChange(value);
                }
              }}
            />
          ) : (
            <TextInput
              type={type}
              labelText={labelText}
              hintText={hintText}
              optionalText={optionalText}
              status={error ? 'error' : 'default'}
              statusText={showStatusText && error ? error.message : ''}
              defaultValue={
                typeof formatDefaultValue === 'function' && value
                  ? formatDefaultValue(value)
                  : value
              }
              onChange={onChange}
              onBlur={onBlur}
              min={min}
              step={step}
              readOnly={readOnly}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={autoFocus}
            />
          )}
        </>
      )}
    />
  );
}
