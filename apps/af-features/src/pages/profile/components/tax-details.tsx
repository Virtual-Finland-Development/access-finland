import veroLogo from '@shared/images/logo-vero.svg';
import { format, getYear, parseISO } from 'date-fns';
import { Text } from 'suomifi-ui-components';
import { IncomeTax } from '@shared/types';
import CustomImage from '@shared/components/ui/custom-image';

function formatEuro(num) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(num);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

interface Props {
  incomeTax: IncomeTax | undefined;
}

export default function TaxDetails(props: Props) {
  const { incomeTax } = props;

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
        <span className="block font-semibold">{withholdingPercentage} %</span>
      </Text>
      <Text>
        Additional withholding percentage:{' '}
        <span className="block font-semibold">{additionalPercentage} %</span>
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
