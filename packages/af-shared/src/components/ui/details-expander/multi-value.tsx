import { Text } from 'suomifi-ui-components';
import { COMPANY_DATA_LABELS } from '@/lib/constants';
import SingleValue from './single-value';

interface MultiValueProps {
  index: number;
  valueObj: Record<string, any>;
  labels: Record<string, any>;
}

export default function MultiValue(props: MultiValueProps) {
  const { index, valueObj, labels } = props;

  try {
    return (
      <div className="flex flex-row">
        <Text className="!font-bold shrink-0">{index + 1}.</Text>

        <div className="ml-2">
          {Object.keys(valueObj)
            .filter(valueKey => valueObj[valueKey])
            .map(valueKey => {
              const value = valueObj[valueKey];
              const isArrayOfObjects =
                Array.isArray(value) && value.every(i => typeof i === 'object');

              return !isArrayOfObjects ? (
                <SingleValue
                  key={valueKey}
                  label={labels[valueKey] || ''}
                  value={value}
                />
              ) : (
                <div key={valueKey}>
                  <Text className="!text-base">
                    {COMPANY_DATA_LABELS[valueKey] || ''}:
                  </Text>
                  {valueObj[valueKey].map(
                    (obj: Record<string, any>, i: number) => (
                      <MultiValue
                        key={i}
                        index={i}
                        valueObj={obj}
                        labels={labels}
                      />
                    )
                  )}
                </div>
              );
            })}
        </div>
      </div>
    );
  } catch (err) {
    return null;
  }
}
