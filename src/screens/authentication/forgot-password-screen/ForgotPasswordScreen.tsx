import React from 'react';
import { Keyboard } from 'react-native';
import {
  Button,
  FormControl,
  Box,
  Text,
  VStack,
  useDisclose,
} from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';

import { Controller, useForm } from 'react-hook-form';
import { useResetPassword } from '@hooks/useAuth';

import type { RootStackNavigationProps } from '@navigation/types';
import FormInput from '@components/FormInput';
import SuccessModal from '@components/SuccessModal';

type ForgotPasswordFormValues = {
  email: string;
};

const EMAIL_REGEX =
  /^[a-z0-9!'#$%&*+\/=?^_`{|}~-]+(?:\.[a-z0-9!'#$%&*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-zA-Z]{2,}$/i;

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<RootStackNavigationProps>();
  const {
    isOpen: isSuccessModalOpen,
    onOpen: showSuccessModal,
    onClose: closeSuccessModal,
  } = useDisclose();

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: { email: '' },
  });

  const { mutate: resetPassword, isLoading: isLoadingLogin } =
    useResetPassword();

  const handleSubmitPress = ({ email }: ForgotPasswordFormValues) => {
    Keyboard.dismiss();

    resetPassword(
      { email },
      {
        onError: error => {
          setError('email', { message: error.message });
        },
        onSuccess: () => {
          reset({ email: '' });
          showSuccessModal();
        },
      },
    );
  };

  const handleSuccess = () => {
    navigation.navigate('SignIn');
  };

  return (
    <KeyboardAwareScrollView
      // eslint-disable-next-line react-native/no-inline-styles
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardDismissMode={'interactive'}
      bounces={false}
    >
      <Box
        safeArea
        flex="1"
        _light={{ background: 'white' }}
        _dark={{ background: 'coolGray.800' }}
      >
        <VStack px="4">
          <Text
            alignItems="center"
            paddingTop="109px"
            alignContent="center"
            fontWeight="bold"
            fontSize="lg"
          >
            Forgot Password?
          </Text>
          <Text
            alignItems="center"
            _light={{ color: 'coolGray.900' }}
            _dark={{ color: 'coolGray.100' }}
            paddingTop="4"
          >
            Not to worry! Enter email address associated with your account and
            we'll send a link and instructions to reset your password.
          </Text>
          <Controller
            control={control}
            name="email"
            rules={{
              required: {
                value: true,
                message: 'Email address is required',
              },
              pattern: {
                value: EMAIL_REGEX,
                message: "It's not a valid email",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl
                paddingTop={'20px'}
                isInvalid={Boolean(errors.email)}
              >
                <FormInput
                  isRequired
                  autoCapitalize="none"
                  keyboardType="email-address"
                  label="Email"
                  autoComplete="email"
                  onBlur={onBlur}
                  value={value}
                  onChangeText={onChange}
                >
                  <FormControl.ErrorMessage>
                    {errors.email?.message}
                  </FormControl.ErrorMessage>
                </FormInput>
              </FormControl>
            )}
          />
          <Button
            isLoading={isLoadingLogin}
            variant="solid"
            size="lg"
            onPress={handleSubmit(handleSubmitPress)}
          >
            SUBMIT
          </Button>
        </VStack>
      </Box>
      <SuccessModal
        description="We sent you an email with instructions on how to reset your password."
        isOpen={isSuccessModalOpen}
        onSubmit={handleSuccess}
        onClose={closeSuccessModal}
      />
    </KeyboardAwareScrollView>
  );
};

export default ForgotPasswordScreen;
