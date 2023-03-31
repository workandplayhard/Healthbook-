import React, { useEffect, useMemo, useState } from 'react';
import { Keyboard } from 'react-native';
import { Button, FormControl, Box, Text, VStack, IconButton, Icon } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Controller, useForm } from 'react-hook-form';
import { useChangePassword } from '@hooks/useAuth';

import type { RootStackNavigationProps } from '@navigation/types';
import FormInput from '@components/FormInput';
import { onChange } from 'react-native-reanimated';

type SecuritySettings = {
  password: string;
  new_password: string;
  confirm_password: string;
};

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const SecuritySettings = () => {
  const navigation = useNavigation<RootStackNavigationProps>();

  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [successConfirm, setSuccessConfirm] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    reset,
    register,
    getValues,
    formState: { errors, isValid, dirtyFields },
  } = useForm<SecuritySettings>({
    mode: 'onChange',
    defaultValues: { password: '', new_password: '', confirm_password: '' },
  });

  const { mutate: changePassword, isLoading: isLoadingLogin } = useChangePassword();

  const handleSubmitPress = ({ password, new_password, confirm_password }: SecuritySettings) => {
    setResponseMessage('');
    Keyboard.dismiss();

    changePassword(
      {
        password,
        new_password,
        confirm_password,
      },
      {
        onError: error => {
          if (error.message === 'Incorrect old password') {
            setError('password', { message: error.message });
          } else if (error.message === 'Unauthorized') {
            setResponseMessage('Token expired, try again.');
            reset({ password: '', new_password: '', confirm_password: '' });
          } else {
            setError('new_password', { message: error.message });
          }
          setSuccessConfirm(false);
        },
        onSuccess: () => {
          reset({ password: '', new_password: '', confirm_password: '' });
          setSuccessConfirm(true);
          setResponseMessage('Your password has been changed!');
        },
      },
    );
  };

  return (
    <KeyboardAwareScrollView
      // eslint-disable-next-line react-native/no-inline-styles
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardDismissMode={'interactive'}
      bounces={false}
    >
      <Box safeArea flex="1" _light={{ background: 'white' }} _dark={{ background: 'coolGray.800' }}>
        <VStack px="4" py="81">
          <Controller
            control={control}
            name="password"
            rules={{
              required: {
                value: true,
                message: 'Password is required',
              },
              validate: {
                matchesPassword: (value: string) => {
                  const { new_password } = getValues();
                  return (
                    new_password !== value ||
                    'You entered the same old password and new password. To change your password use a different password'
                  );
                },
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={Boolean(errors.password)}>
                <FormInput
                  isRequired
                  {...register('password')}
                  autoCapitalize="none"
                  keyboardType="default"
                  label="Old Password"
                  autoComplete="password"
                  secureTextEntry={!showOldPass}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  defaultValue={value}
                  value={value}
                  InputRightElement={
                    <IconButton
                      mr="1"
                      variant="unstyled"
                      icon={
                        <Icon
                          size="5"
                          color="coolGray.400"
                          as={MaterialIcons}
                          name={showOldPass ? 'visibility' : 'visibility-off'}
                        />
                      }
                      onPress={() => {
                        setShowOldPass(!showOldPass);
                      }}
                    />
                  }
                >
                  <FormControl.ErrorMessage>{errors.password?.message}</FormControl.ErrorMessage>
                </FormInput>
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="new_password"
            rules={{
              required: {
                value: true,
                message: 'Password is required',
              },
              pattern: {
                value: PASSWORD_REGEX,
                message:
                  'Passwords must contain at least 8 characters with uppercase and lowercase, a number and a special character.',
              },
              validate: {
                matchesPassword: (value: string) => {
                  const { password } = getValues();
                  return (
                    password !== value ||
                    'You entered the same old password and new password. To change your password use a different password'
                  );
                },
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={Boolean(errors.new_password)}>
                <FormInput
                  isRequired
                  {...register('new_password')}
                  autoCapitalize="none"
                  keyboardType="default"
                  label="New Password"
                  autoComplete="password"
                  secureTextEntry={!showNewPass}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  defaultValue={value}
                  value={value}
                  InputRightElement={
                    <IconButton
                      mr="1"
                      variant="unstyled"
                      icon={
                        <Icon
                          size="5"
                          color="coolGray.400"
                          as={MaterialIcons}
                          name={showNewPass ? 'visibility' : 'visibility-off'}
                        />
                      }
                      onPress={() => {
                        setShowNewPass(!showNewPass);
                      }}
                    />
                  }
                >
                  <FormControl.ErrorMessage>{errors?.new_password?.message}</FormControl.ErrorMessage>
                </FormInput>
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="confirm_password"
            rules={{
              required: {
                value: true,
                message: 'Password is required',
              },
              validate: {
                matchesPassword: (value: string) => {
                  const { new_password } = getValues();
                  return new_password === value || 'Passwords do not match';
                },
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={Boolean(errors.confirm_password)}>
                <FormInput
                  isRequired
                  {...register('confirm_password')}
                  autoCapitalize="none"
                  keyboardType="default"
                  label="Confirm Password"
                  autoComplete="password"
                  secureTextEntry={!showConfirmPass}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  defaultValue={value}
                  value={value}
                  InputRightElement={
                    <IconButton
                      mr="1"
                      variant="unstyled"
                      icon={
                        <Icon
                          size="5"
                          color="coolGray.400"
                          as={MaterialIcons}
                          name={showConfirmPass ? 'visibility' : 'visibility-off'}
                        />
                      }
                      onPress={() => {
                        setShowConfirmPass(!showConfirmPass);
                      }}
                    />
                  }
                >
                  <FormControl.ErrorMessage>{errors.confirm_password?.message}</FormControl.ErrorMessage>
                </FormInput>
              </FormControl>
            )}
          />
          <Button
            disabled={
              dirtyFields.password && dirtyFields.new_password && dirtyFields.confirm_password && isValid ? false : true
            }
            opacity={
              dirtyFields.password && dirtyFields.new_password && dirtyFields.confirm_password && isValid ? 1 : 0.5
            }
            isLoading={isLoadingLogin}
            variant="solid"
            size="lg"
            onPress={handleSubmit(handleSubmitPress)}
          >
            UPDATE
          </Button>
          {responseMessage && responseMessage.length > 0 && (
            <Text pt="3" color={successConfirm && responseMessage.length > 0 ? 'green.600' : 'red.600'}>
              {responseMessage}
            </Text>
          )}
        </VStack>
      </Box>
    </KeyboardAwareScrollView>
  );
};

export default SecuritySettings;
