import React, { useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from 'hooks/useAuthStore';
import { Button, Checkbox, FormControl, Icon, IconButton, Link } from 'native-base';
import { Controller, useForm } from 'react-hook-form';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import FormInput from '@components/FormInput';
import { useLogin } from '@hooks/useAuth';
import { useHealthVaultFirstTime } from '@hooks/useHealthVault';
import type { RootStackNavigationProps } from '@navigation/types';
type SignInFormValues = {
  email: string;
  password: string;
};

const EMAIL_REGEX =
  /^[a-z0-9!'#$%&*+\/=?^_`{|}~-]+(?:\.[a-z0-9!'#$%&*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-zA-Z]{2,}$/i;

const SignInForm = () => {
  const navigation = useNavigation<RootStackNavigationProps>();
  const { setHealthVault } = useHealthVaultFirstTime()

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<SignInFormValues>({
    defaultValues: { email: '', password: '' },
  });

  const rememberMe = useAuthStore(state => state.rememberMe);
  const setRememberMe = useAuthStore(state => state.setRememberMe);

  const { mutate: login, isLoading: isLoadingLogin } = useLogin();
  const handleLogin = ({ email, password }: SignInFormValues) => {
    login(
      { email, password },
      {
        onError: error => {
          if (error.message === 'Wrong password') error.message = 'Your password was entered incorrectly';

          setError('password', { message: error.message });
        },
        onSuccess: () => {
          reset({ email: '', password: '' });
          setHealthVault(true);
        },
      },
    );
  };

  const [showPass, setShowPass] = useState(false);

  return (
    <>
      <Controller
        control={control}
        name="email"
        rules={{
          required: {
            value: true,
            message: 'Email address is required to sign in',
          },
          pattern: {
            value: EMAIL_REGEX,
            message: 'Please enter a valid email',
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isInvalid={Boolean(errors.email)}>
            <FormInput
              isRequired
              autoCapitalize="none"
              keyboardType="email-address"
              label="Email"
              autoComplete="email"
              onBlur={onBlur}
              onChangeText={onChange}
              defaultValue={value}
              value={value}
            >
              <FormControl.ErrorMessage>{errors.email?.message}</FormControl.ErrorMessage>
            </FormInput>
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="password"
        rules={{
          required: {
            value: true,
            message: 'Password is required to sign in',
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isInvalid={Boolean(errors.password)}>
            <FormInput
              isRequired
              autoCapitalize="none"
              keyboardType="default"
              label="Password"
              autoComplete="password"
              secureTextEntry={!showPass}
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
                      name={showPass ? 'visibility' : 'visibility-off'}
                    />
                  }
                  onPress={() => {
                    setShowPass(!showPass);
                  }}
                />
              }
            >
              <FormControl.ErrorMessage>{errors.password?.message}</FormControl.ErrorMessage>
            </FormInput>
          </FormControl>
        )}
      />
      <Link
        ml="auto"
        _text={{
          fontSize: 'sm',
          fontWeight: 'bold',
          textDecoration: 'none',
        }}
        _light={{
          _text: {
            color: 'primary.600',
          },
        }}
        _dark={{
          _text: {
            color: 'tertiary.600',
          },
        }}
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        Forgot password?
      </Link>
      <Checkbox
        value="demo"
        isChecked={rememberMe}
        onChange={setRememberMe}
        defaultIsChecked
        accessibilityLabel="Remember me"
        my="5"
        _text={{
          fontSize: 'sm',
          fontWeight: 'normal',
          pl: 0,
        }}
        _dark={{
          _checked: {
            value: 'checkbox',
            bg: 'tertiary.600',
            borderColor: 'tertiary.600',
            _icon: { color: 'coolGray.50' },
          },
          _text: {
            color: 'dustyGray.100',
          },
        }}
        _light={{
          _checked: {
            value: 'checkbox',
            bg: 'primary.600',
            borderColor: 'primary.600',
          },
          _text: {
            color: 'dustyGray.900',
          },
        }}
      >
        Remember me and keep me logged in
      </Checkbox>
      <Button isLoading={isLoadingLogin} variant="solid" size="lg" mt="5" onPress={handleSubmit(handleLogin)}>
        SIGN IN
      </Button>
    </>
  );
};

export default SignInForm;
