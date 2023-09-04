import { Text } from 'suomifi-ui-components';
import Alert from '@/components/ui/alert';

interface Props {
  errorMessages: string[];
}

export default function ProfileErrors(props: Props) {
  const { errorMessages } = props;

  return (
    <Alert status="error" labelText="Error">
      <div className="flex flex-col gap-3">
        <Text>Something went wrong!</Text>
        <div className="flex flex-col">
          {errorMessages.map(message => (
            <Text key={message} className="!font-bold">
              {message}
            </Text>
          ))}
        </div>
      </div>
    </Alert>
  );
}
