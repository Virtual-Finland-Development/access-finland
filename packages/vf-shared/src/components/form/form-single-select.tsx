import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import { SingleSelect } from 'suomifi-ui-components';

interface SelectInputControllerProps<T extends FieldValues> {
  name: Path<T>;
  rules?: RegisterOptions;
  control: Control<T>;
}

interface Props<T extends FieldValues> extends SelectInputControllerProps<T> {
  labelText: string;
  hintText?: string;
  optionalText?: string;
  showStatusText?: boolean;
  items: { labelText: string; uniqueItemId: string; disabled?: boolean }[];
}

export default function FormSingleSelect<T extends FieldValues>(
  props: Props<T>
) {
  const {
    name,
    rules,
    control,
    labelText,
    hintText,
    optionalText,
    showStatusText = true,
    items,
  } = props;

  return (
    <Controller
      name={name}
      rules={rules}
      control={control as unknown as Control<FieldValues>}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <SingleSelect
          labelText={labelText}
          hintText={hintText}
          optionalText={optionalText}
          visualPlaceholder="Type to search"
          ariaOptionsAvailableText="Options available"
          clearButtonLabel="clear"
          itemAdditionHelpText=""
          status={error ? 'error' : 'default'}
          statusText={showStatusText && error ? error.message : ''}
          items={items}
          defaultSelectedItem={
            value && items.find(item => item.uniqueItemId === value)
          }
          onItemSelect={selected => {
            onChange(selected);
          }}
        />
      )}
    />
  );
}
