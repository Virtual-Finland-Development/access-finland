import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { confirmSignIn, signIn, signUp } from '@mvp/lib/frontend/aws-cognito';
import { Button, Text } from 'suomifi-ui-components';
import FormInput from '@shared/components/form/form-input';
import CustomHeading from '@shared/components/ui/custom-heading';
import Loading from '@shared/components/ui/loading';

interface SubmitProps {
  text: string;
  isSubmitting: boolean;
}

interface FormProps {
  handleFormSubmit: (value: string) => Promise<void>;
}

type EmailForm = { email: string };
type CodeForm = { code: string };

function Submit({ text, isSubmitting }: SubmitProps) {
  return (
    <div className="flex flex-row gap-3 items-center">
      <Button type="submit">{text}</Button>
      {isSubmitting && (
        <div className="mt-1 ml-1">
          <Loading variant="small" />
        </div>
      )}
    </div>
  );
}

function EmailForm({ handleFormSubmit }: FormProps) {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<EmailForm>();

  const onSubmit: SubmitHandler<EmailForm> = async ({ email }) => {
    await handleFormSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 items-start">
        <CustomHeading variant="h4">Log in</CustomHeading>
        <Text>
          Enter your email address you use in Access Finland. We will send you a
          verification code to your email address.
        </Text>
        <FormInput
          name="email"
          type="email"
          labelText="Your email address"
          control={control}
          rules={{ required: 'Email is required' }}
        />
        <Submit text="Send me a code" isSubmitting={isSubmitting} />
      </div>
    </form>
  );
}

function CodeForm({ handleFormSubmit }: FormProps) {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<CodeForm>();

  const onSubmit: SubmitHandler<CodeForm> = async ({ code }) => {
    await handleFormSubmit(code);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 items-start">
        <CustomHeading variant="h4">Enter the vefication code</CustomHeading>
        <Text>
          If you did not receive a verification code in your email, please check
          your spam folder. Also make sure you entered the same email address
          you used to sign in to Access Finland.
        </Text>
        <FormInput
          name="code"
          type="text"
          labelText="Your code"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          control={control}
          rules={{ required: 'Code is required' }}
        />
        <Submit text="Sign in with code" isSubmitting={isSubmitting} />
      </div>
    </form>
  );
}

const sleep = () => new Promise(resolve => setTimeout(resolve, 1500));

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [isCodeSent, setCodeSent] = useState(false);

  const handleEmailSubmit = async (email: string) => {
    setEmail(email);

    try {
      // TODO: Check if user exists before signing up
      await signUp(email);
    } catch (error) {
      if (!String(error).startsWith('UsernameExistsException')) {
        throw error;
      }
    }

    await signIn(email);

    setCodeSent(true);
  };

  const handleCodeSubmit = async (code: string) => {
    await confirmSignIn(code);
  };

  return (
    <div className="flex flex-col gap-4 items-start">
      {!isCodeSent ? (
        <EmailForm handleFormSubmit={handleEmailSubmit} />
      ) : (
        <CodeForm handleFormSubmit={handleCodeSubmit} />
      )}
      <button
        className="text-blue-600 hover:text-blue-800 visited:text-purple-600 !text-base"
        onClick={() => setCodeSent(!isCodeSent)}
      >
        {isCodeSent ? 'I need a new code' : 'I already have a code'}
      </button>
    </div>
  );
}
