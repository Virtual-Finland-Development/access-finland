import { Text } from 'suomifi-ui-components';

interface SingleValueProps {
  label: string;
  value: string;
}

export default function SingleValue({ label, value }: SingleValueProps) {
  return (
    <div>
      {label && (
        <Text className="!font-light !subpixel-antialiased">{label}: </Text>
      )}
      <Text className="">{value || '-'}</Text>
    </div>
  );
}
