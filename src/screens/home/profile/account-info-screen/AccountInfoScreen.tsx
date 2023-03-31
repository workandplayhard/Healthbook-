import React, { useEffect } from 'react';

import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { Box, Button } from 'native-base';
import { useToast } from 'native-base';
import { FormProvider, useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useGetUser, useUpdateUser } from '@hooks/useUsers';

import type { AccountInfoFormValues } from './components/AccountInfoForm';
import AccountInfoForm from './components/AccountInfoForm';

const AccountInfoScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const toast = useToast();

  const formProps = useForm<AccountInfoFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      dob: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      imperialUnits: 'imperial',
      showDigitalAvatar: false,
    },
  });
  const handleSubmit = formProps.handleSubmit;
  const reset = formProps.reset;

  const { data: user } = useGetUser();

  // Reset form values when user changes
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        dob: user.dob ? dayjs(user.dob).format('MM/DD/YYYY' || '') : '',
        email: user.email || '',
        address: user.address || '',
        city: user.city || '',
        state: (user.state as { values: string } | null)?.values || '',
        zip: user.zip_code || '',
        phone: user.phone_number?.replace('+1', '') || '',
        imperialUnits: user.imperial_units ? 'imperial' : 'metric',
      });
    }
  }, [reset, user]);

  const { mutate: updateUser, isLoading } = useUpdateUser();
  const handleSave = (input: AccountInfoFormValues) => {
    if (!user) {
      throw new Error('User is undefined');
    }

    updateUser(
      {
        user_id: user.user_id,
        credential: user.credential || [],
        sex: (user.sex as { key: string } | null)?.key || null,
        gender: (user.gender as { key: string } | null)?.key || null,
        first_name: input.firstName.length ? input.firstName : null,
        last_name: input.lastName.length ? input.lastName : null,
        dob: input.dob.length ? dayjs(input.dob, 'MM/DD/YYYY').format('YYYY-MM-DD') : null,
        email: input.email ? input.email : null,
        address: input.address ? input.address : null,
        city: input.city.length ? input.city : null,
        state: input.state.length ? input.state : null,
        zip: input.zip.length ? input.zip : null,
        phone_number: input.phone.length ? `+1${input.phone.replace(/\+\d/, '')}` : null,
        imperial_units: Boolean(input.imperialUnits === 'imperial'),
      },
      {
        onSuccess: () => {
          toast.show({
            description: 'Changes Saved',
          });
          navigation.goBack();
        },
      },
    );
  };

  return (
    <Box safeAreaBottom flexGrow={1} _light={{ bg: 'white' }} _dark={{ bg: 'coolGray.800' }}>
      <KeyboardAwareScrollView
        bounces={false}
        extraScrollHeight={-insets.bottom}
        // eslint-disable-next-line react-native/no-inline-styles
        contentContainerStyle={{ flexGrow: 1 }}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ flex: 1 }}
      >
        <Box px="4" py="6">
          <FormProvider {...formProps}>
            <AccountInfoForm />
          </FormProvider>
        </Box>
      </KeyboardAwareScrollView>
      <Button.Group p="4" space="2">
        <Button flex={1} variant="solid" isLoading={isLoading} onPress={handleSubmit(handleSave)}>
          SAVE
        </Button>
      </Button.Group>
    </Box>
  );
};

export default AccountInfoScreen;
