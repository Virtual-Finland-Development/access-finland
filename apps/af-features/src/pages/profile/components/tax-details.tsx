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
  data: IncomeTax | undefined;
}

export default function TaxDetails(props: Props) {
  const { data } = props;

  if (!data) {
    return <Text>No tax information found.</Text>;
  }

  return (
    <div className="flex flex-col gap-4">
      <Text>
        Tax payer type:{' '}
        <span className="block font-semibold">
          {capitalizeFirstLetter(data.taxPayerType)}
        </span>
      </Text>
      <Text>
        Tax rate:{' '}
        <span className="block font-semibold">
          {data.withholdingPercentage} %
        </span>
      </Text>
      <Text>
        Income limit for the year {getYear(new Date(data.validityDate))}:{' '}
        <span className="block font-semibold">
          {formatEuro(data.incomeLimit)}
        </span>
      </Text>
      <Text>
        Validity:{' '}
        <span className="block font-semibold">
          {format(parseISO(data.validityDate), 'dd.MM.yyyy')}
        </span>
      </Text>
      <Text>Issued by Vero</Text>
      <CustomImage src={veroLogo} alt="Vero" />
    </div>
  );
}
