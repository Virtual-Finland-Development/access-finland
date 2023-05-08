import { ReactNode } from 'react';
import { MdDone, MdOutlineInfo } from 'react-icons/md';
import {
  Expander,
  ExpanderContent,
  ExpanderTitleButton,
} from 'suomifi-ui-components';
import CustomHeading from '@/components/ui/custom-heading';
import MultiValue from './multi-value';
import SingleValue from './single-value';

interface DetailsExpanderProps<T> {
  title: string;
  hasValues?: boolean;
  showStatusIcons?: boolean;
  values: Partial<Record<keyof T, any>> | undefined;
  labels: Record<string, any>;
  children?: ReactNode;
}

export default function DetailsExpander<T>(props: DetailsExpanderProps<T>) {
  const {
    title,
    hasValues,
    showStatusIcons = true,
    values,
    labels,
    children,
  } = props;

  return (
    <Expander>
      <ExpanderTitleButton>
        <div className="flex flex-row gap-2 items-center">
          <span>{title}</span>{' '}
          {typeof hasValues === 'boolean' && showStatusIcons && (
            <>
              {hasValues ? (
                <MdDone size={22} color="green" />
              ) : (
                <MdOutlineInfo size={22} color="orange" />
              )}
            </>
          )}
        </div>
      </ExpanderTitleButton>
      <ExpanderContent className="!text-base">
        <div className="flex flex-col gap-4 mt-4">
          {typeof hasValues === 'boolean' && !hasValues && (
            <CustomHeading variant="h4">No information provided.</CustomHeading>
          )}

          {values !== undefined &&
            Object.keys(values).map(dataKey => {
              const value: any = values[dataKey as keyof typeof values];
              const isArray = Array.isArray(value);
              const isArrayOfObjects =
                isArray && value.every(i => typeof i === 'object');
              const isString =
                typeof value === 'string' || value instanceof String;

              return (
                <div key={dataKey}>
                  {labels[dataKey] && (
                    <CustomHeading variant="h4">
                      {labels[dataKey]}
                    </CustomHeading>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 mt-2 gap-4">
                    {isArray && value.length < 1 && <span>-</span>}

                    {isArrayOfObjects &&
                      value.map((_, index: number) => (
                        <MultiValue
                          key={`${dataKey}-${index}`}
                          index={index}
                          valueObj={value[index]}
                          labels={labels}
                        />
                      ))}

                    {!isArrayOfObjects && !isString && (
                      <div>
                        {value &&
                          Object.keys(value).map((key, i) => {
                            const nestedValue =
                              value[key as keyof typeof value];
                            const isArrayOfObjects =
                              Array.isArray(nestedValue) &&
                              nestedValue.every(i => typeof i === 'object');

                            return !isArrayOfObjects ? (
                              <SingleValue
                                key={i}
                                label={labels[key] || ''}
                                value={nestedValue as string}
                              />
                            ) : (
                              <MultiValue
                                key={i}
                                index={i}
                                valueObj={nestedValue}
                                labels={labels}
                              />
                            );
                          })}
                      </div>
                    )}

                    {isString && (
                      <SingleValue
                        label={labels[dataKey] || ''}
                        value={value as string}
                      />
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        {/* render any optional children content */}
        {children && <>{children}</>}
      </ExpanderContent>
    </Expander>
  );
}
