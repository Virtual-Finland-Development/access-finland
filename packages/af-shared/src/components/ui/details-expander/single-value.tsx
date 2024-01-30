import { Text } from 'suomifi-ui-components';

interface SingleValueProps {
  label: string;
  value: string;
}

export default function SingleValue({ label, value }: SingleValueProps) {
  return (
    <div>
      {label && (
        <Text smallScreen variant="bold">
          {label}:{' '}
        </Text>
      )}
      <Text smallScreen>{value || '—'}</Text>
    </div>
  );
}
