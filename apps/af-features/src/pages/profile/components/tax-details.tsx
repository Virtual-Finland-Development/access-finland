import veroLogo from '@shared/images/logo-vero.svg';
import { format, getYear, parseISO } from 'date-fns';
import { Text } from 'suomifi-ui-components';
import { IncomeTax } from '@shared/types';
import Alert from '@shared/components/ui/alert';
import CustomImage from '@shared/components/ui/custom-image';

function formatPercentage(num: number) {
  return new Intl.NumberFormat('fi-FI', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(num);
}

function formatEuro(num: number) {
  return new Intl.NumberFormat('fi-FI', {
    style: 'currency',
    currency: 'EUR',
  }).format(num);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

interface Props {
  incomeTax: IncomeTax | undefined;
  error: any;
}

export default function TaxDetails(props: Props) {
  const { incomeTax, error } = props;

  if (error) {
    return (
      <Alert status="error" labelText="Error">
        Could not fetch person income tax information:{' '}
        {error.message || 'something went wrong'}
      </Alert>
    );
  }

  if (!incomeTax) {
    return <Text>No tax information found.</Text>;
  }

  const {
    taxPayerType,
    withholdingPercentage,
    additionalPercentage,
    incomeLimit,
    validityDate,
  } = incomeTax;

  return (
    <div className="flex flex-col gap-4">
      <Text>
        Tax payer type:{' '}
        <span className="block font-semibold">
          {capitalizeFirstLetter(taxPayerType)}
        </span>
      </Text>
      <Text>
        Tax rate:{' '}
        <span className="block font-semibold">
          {formatPercentage(withholdingPercentage)}
        </span>
      </Text>
      <Text>
        Additional withholding percentage:{' '}
        <span className="block font-semibold">
          {formatPercentage(additionalPercentage)}
        </span>
      </Text>
      <Text>
        Income ceiling for the entire year {getYear(new Date(validityDate))}:{' '}
        <span className="block font-semibold">{formatEuro(incomeLimit)}</span>
      </Text>

      <Text>
        Validity start date:{' '}
        <span className="block font-semibold">
          {format(parseISO(validityDate), 'dd.MM.yyyy')}
        </span>
      </Text>
      <Text>Issued by Vero</Text>
      <CustomImage src={veroLogo} alt="Vero" />
    </div>
  );
}
