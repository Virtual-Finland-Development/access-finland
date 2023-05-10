import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from 'suomifi-ui-components';
import type { PersonBasicInformation } from '@/types';
import api from '@/lib/api';
import { useCountries } from '@/lib/hooks/codesets';
import { BASIC_INFO_QUERY_KEYS } from '@/lib/hooks/profile';
import { pickRandomName } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/context/toast-context';
import FormInput from '@/components/form/form-input';
import FormPhoneInput from '@/components/form/form-phone-input';
import FormSingleSelect from '@/components/form/form-single-select';
import CustomHeading from '@/components/ui/custom-heading';
import Loading from '@/components/ui/loading';

interface Props {
  personBasicInformation: PersonBasicInformation | undefined;
  onSubmitSuccess: () => void;
}

export default function PersonalProfileForm(props: Props) {
  const { personBasicInformation, onSubmitSuccess } = props;
  const { userEmail } = useAuth();
  const { data: countries, isLoading } = useCountries();
  const toast = useToast();
  const reactQueryClient = useQueryClient();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, dirtyFields },
  } = useForm<PersonBasicInformation>({
    defaultValues: personBasicInformation
      ? {
          ...personBasicInformation,
          email: personBasicInformation.email || userEmail!,
          phoneNumber: personBasicInformation.phoneNumber || '+1 231 231 2312',
        }
      : {
          givenName: pickRandomName('firstName'),
          lastName: pickRandomName('lastName'),
          email: userEmail!,
          phoneNumber: '+1 231 231 2312',
          residency: '',
        },
  });
  const onSubmit: SubmitHandler<PersonBasicInformation> = async values => {
    try {
      if (Object.keys(dirtyFields).length) {
        // save profile and update profile data in react-query
        const response = await api.profile.savePersonBasicInfo(values);
        reactQueryClient.setQueryData(BASIC_INFO_QUERY_KEYS, response);
        toast({
          status: 'neutral',
          title: 'Success',
          content: 'Profile information saved successfully!',
        });
        onSubmitSuccess();
      } else {
        onSubmitSuccess();
      }
    } catch (error: any) {
      toast({
        status: 'error',
        title: 'Error',
        content: error?.message || 'Something went wrong.',
      });
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <CustomHeading variant="h2" suomiFiBlue="dark">
        Personal information
      </CustomHeading>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4 items-start">
          <FormInput
            name={`givenName`}
            labelText="Given name"
            control={control}
            rules={{ required: 'Given name is required.' }}
            readOnly
          />
          <FormInput
            name={`lastName`}
            labelText="Last name"
            control={control}
            rules={{ required: 'Last name is required.' }}
            readOnly
          />
          <FormInput
            type="email"
            name={`email`}
            labelText="Email"
            control={control}
            rules={{ required: 'Email is required.' }}
            readOnly
          />
        </div>
        <div className="flex flex-col gap-4 items-start">
          <FormPhoneInput
            name={`phoneNumber`}
            control={control}
            rules={{ required: 'Phone number is required.' }}
            labelText="Phone number"
            hintText="Use international format (+358xxx)"
            readOnly
          />
          <FormSingleSelect
            name={`residency`}
            control={control}
            rules={{ required: 'Residency is required.' }}
            labelText="Country of residence"
            hintText="Filter by typing or select from dropdown"
            items={
              countries
                ? countries.map(c => ({
                    labelText: c.englishName,
                    uniqueItemId: c.threeLetterISORegionName,
                  }))
                : []
            }
          />
        </div>
      </div>

      <div className="flex flex-row gap-3 mt-6">
        <Button
          variant="secondary"
          icon="arrowLeft"
          onClick={() => router.push('/profile')}
        >
          Back
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
