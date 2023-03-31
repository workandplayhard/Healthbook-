import React, { useEffect } from 'react';
import { Box, Text, VStack, FormControl, Button } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Masks } from 'react-native-mask-input';
import { useNavigation } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';

import type { RootStackNavigationProps } from '@navigation/types';
import FormInput from 'components/FormInput';
import { useCodeRetrieval } from 'hooks/useAuth';

type PersonInfoValues = {
  firstName: string;
  lastName: string;
  date: string;
};

export const regEx = /^[a-zA-Z]+$/;
const CodeRetrievalScreen = () => {
  const navigation = useNavigation<RootStackNavigationProps>();
  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<PersonInfoValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      date: '',
    },
  });
  const {
    mutate: codeRetrieval,
    isSuccess,
    error: serverError,
  } = useCodeRetrieval();
  const handleSubmitPress = ({
    firstName,
    lastName,
    date,
  }: PersonInfoValues) => {
    codeRetrieval({
      org_id: 3,
      firstName,
      lastName,
      date,
    });

    if (isSuccess) {
      navigation.navigate('ThankYou');
    }
  };

  useEffect(() => {
    if (isSuccess) {
      navigation.navigate('ThankYou');
    }
  }, [isSuccess]);

  useEffect(() => {
    if (serverError) {
      setError('date', { message: serverError.message });
    }
  }, [serverError]);

  return (
    <KeyboardAwareScrollView
      // eslint-disable-next-line react-native/no-inline-styles
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardDismissMode="interactive"
      bounces={false}
    >
      <Box
        safeArea
        h="full"
        _light={{ background: 'white' }}
        _dark={{ background: 'coolGray.800' }}
      >
        <VStack paddingX="24px">
          <Box
            _text={{
              fontSize: 'xl',
              fontWeight: 'bold',
              fontStyle: 'normal',
            }}
            _light={{
              color: 'dustyGray.900',
            }}
          >
            Resend Access Code
          </Box>

          <Text
            mt="20px"
            fontSize="14px"
            lineHeight="30px"
            display="flex"
            textAlign="left"
            fontWeight="light"
            fontStyle="normal"
            _light={{
              color: 'dustyGray.900',
            }}
          >
            Please enter your information below to receive a new code.
          </Text>
        </VStack>

        <VStack width="full" paddingX="24px" mt="20px">
          <Controller
            control={control}
            name="firstName"
            rules={{
              maxLength: { value: 30, message: 'Exceeds max length of 30' },
              pattern: {
                value: regEx,
                message: 'Only alphabets should be contained.',
              },
              required: { value: true, message: 'This field is required.' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl
                paddingTop={'5px'}
                isInvalid={Boolean(errors?.firstName)}
              >
                <FormInput
                  isRequired
                  autoCapitalize="none"
                  keyboardType="default"
                  autoComplete="off"
                  label="First Name"
                  onBlur={onBlur}
                  value={value}
                  onChangeText={onChange}
                >
                  <FormControl.ErrorMessage>
                    {errors.firstName?.message}
                  </FormControl.ErrorMessage>
                </FormInput>
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="lastName"
            rules={{
              maxLength: { value: 30, message: 'Exceeds max length of 30' },
              pattern: {
                value: regEx,
                message: 'Only alphabets should be contained.',
              },
              required: { value: true, message: 'This field is required.' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl
                paddingTop={'5px'}
                isInvalid={Boolean(errors?.lastName)}
              >
                <FormInput
                  isRequired
                  autoCapitalize="none"
                  keyboardType="default"
                  autoComplete="off"
                  label="Last Name"
                  onBlur={onBlur}
                  value={value}
                  onChangeText={onChange}
                >
                  <FormControl.ErrorMessage>
                    {errors.lastName?.message}
                  </FormControl.ErrorMessage>
                </FormInput>
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="date"
            rules={{
              required: { value: true, message: 'Date of Birth is required' },
              maxLength: 30,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl paddingTop={'5px'} isInvalid={Boolean(errors?.date)}>
                <FormInput
                  isRequired
                  autoCapitalize="none"
                  keyboardType="default"
                  autoComplete="off"
                  label="Date Of Birth"
                  onBlur={onBlur}
                  value={value}
                  defaultValue={value}
                  onChangeText={onChange}
                  mask={Masks.DATE_MMDDYYYY}
                >
                  <FormControl.ErrorMessage>
                    {errors.date?.message}
                  </FormControl.ErrorMessage>
                </FormInput>
              </FormControl>
            )}
          />

          <Button
            variant="solid"
            size="lg"
            onPress={handleSubmit(handleSubmitPress)}
            borderRadius="4px"
          >
            Submit
          </Button>
        </VStack>
      </Box>
    </KeyboardAwareScrollView>
  );
};

export default CodeRetrievalScreen;
