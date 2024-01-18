import { ReactNode } from 'react';
import { MdDone, MdOutlineInfo } from 'react-icons/md';
import {
  Expander,
  ExpanderContent,
  ExpanderTitleButton,
} from 'suomifi-ui-components';
import CustomHeading from '@/components/ui/custom-heading';
import Loading from '../loading';
import MultiValue from './multi-value';
import SingleValue from './single-value';

interface DetailsExpanderProps<T> {
  title: string;
  hasValues?: boolean;
  showStatusIcons?: boolean;
  values: Partial<Record<keyof T, any>> | undefined;
  labels: Record<string, any>;
  children?: ReactNode;
  isLoading?: boolean;
}

export default function DetailsExpander<T>(props: DetailsExpanderProps<T>) {
  const {
    title,
    hasValues,
    showStatusIcons = true,
    values,
    labels,
    children,
    isLoading = false,
  } = props;

  return (
    <Expander>
      <ExpanderTitleButton>
        <div className="flex flex-row gap-2 items-center">
          <div className="flex flex-row items-center gap-2 items-start">
            <span>{title}</span>
            {isLoading && <Loading variant="small" />}
          </div>

          {!isLoading && typeof hasValues === 'boolean' && showStatusIcons && (
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
        {isLoading ? (
          <div className="flex items-center justify-center py-2">
            <Loading
              text={`Loading ${title.toLowerCase()}...`}
              textAlign="right"
            />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 mt-4">
              {typeof hasValues === 'boolean' && !hasValues && (
                <CustomHeading variant="h3" className="!text-lg">
                  No information provided.
                </CustomHeading>
              )}

              {values !== undefined &&
                Object.keys(values).map(dataKey => {
                  const value: any = values[dataKey as keyof typeof values];
                  const isArray = Array.isArray(value);
                  const isArrayOfObjects =
                    isArray && value.every(i => typeof i === 'object');
                  const isString =
                    typeof value === 'string' || value instanceof String;
                  const GridContainerClassName = isArray
                    ? 'grid grid-cols-1 md:grid-cols-2 mt-2 gap-4'
                    : 'grid grid-cols-1 mt-2 gap-4';

                  return (
                    <div key={dataKey}>
                      {labels[dataKey] && (
                        <CustomHeading variant="h3" className="!text-lg">
                          {labels[dataKey]}
                        </CustomHeading>
                      )}

                      <div className={GridContainerClassName}>
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
          </>
        )}
      </ExpanderContent>
    </Expander>
  );
}
