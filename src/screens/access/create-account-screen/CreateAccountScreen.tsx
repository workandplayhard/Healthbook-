import React, { useState } from 'react';
import { Box, Text, VStack, FormControl, HStack, IconButton, Icon, Checkbox, Button } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Controller, useForm } from 'react-hook-form';
import dayjs from 'dayjs';

import FormInput from 'components/FormInput';
import { useRegisterUser } from 'hooks/useUsers';
import { useNavigation } from '@react-navigation/native';
import FormSelect from 'components/FormSelect';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackNavigatorParamList } from '@navigation/types';

export type PersonInfoValues = {
  first_name: string;
  last_name: string;
  gender: string;
  dob: string;
  email: string;
  password: string;
  confirm_password: string;
  signup_code: string;
  is_terms_privacy_policy_accepted: boolean;
  user_id: number;
};

const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

const CreateAccountScreen: React.FC<NativeStackScreenProps<RootStackNavigatorParamList, 'CreateAccount'>> = ({
  route: {
    params: { first_name, last_name, dob, gender, email, signup_code, user_id },
  },
}) => {
  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
  } = useForm<PersonInfoValues>({
    defaultValues: {
      first_name,
      last_name,
      gender,
      dob: dayjs(dob, 'YYYY-MM-DD').format('MM/DD/YYYY'),
      email,
      password: '',
      confirm_password: '',
      is_terms_privacy_policy_accepted: false,
    },
  });

  const navigation = useNavigation();

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const { mutate: registerUser } = useRegisterUser();

  const handleSubmitPress = (data: PersonInfoValues) => {
    const { dob, ...rest } = data;
    registerUser(
      { ...rest, dob: dayjs(dob, 'MM/DD/YYYY').format('YYYY-MM-DD'), signup_code, user_id },
      { onSuccess: () => navigation.navigate('Welcome') },
    );
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardDismissMode="interactive" bounces={false}>
      <Box safeAreaBottom flex="1" p={4} _light={{ background: 'white' }} _dark={{ background: 'coolGray.800' }}>
        <VStack space={5}>
          <Text fontWeight="bold" fontSize="xl" _light={{ color: 'dustyGray.900' }}>
            Create an account
          </Text>

          <Controller
            control={control}
            name="first_name"
            render={({ field: { value } }) => <FormInput mb={0} isDisabled label="First Name" value={value} />}
          />

          <Controller
            control={control}
            name="last_name"
            render={({ field: { value } }) => <FormInput isDisabled mb={0} label="Last Name" value={value} />}
          />

          <Controller
            control={control}
            name="dob"
            render={({ field: { value } }) => (
              <FormInput
                mb={0}
                isDisabled
                label="Date of Birth"
                InputRightElement={<Icon as={MaterialIcons} name="calendar-today" mr="2" height="1/2" />}
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name="gender"
            render={({ field: { value } }) => (
              <FormSelect
                label="Gender"
                mb={0}
                isDisabled
                selectedValue={value}
                options={['F', 'M'].map(item => ({ value: item, label: item }))}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { value } }) => <FormInput mb={0} isDisabled label="Email" value={value} />}
          />

          <Controller
            control={control}
            name="password"
            rules={{
              required: {
                value: true,
                message: 'Password is required',
              },
              pattern: {
                value: PASSWORD_REGEX,
                message: 'Passwords does not meet requirements',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={Boolean(errors.password)}>
                <FormInput
                  mb={0}
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

          <Controller
            control={control}
            name="confirm_password"
            rules={{
              required: {
                value: true,
                message: 'Confirm password is required',
              },
              validate: {
                matchesPassword: (value: string) => {
                  const { password } = getValues();
                  return password === value || 'Passwords do not match.';
                },
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={Boolean(errors.confirm_password)}>
                <FormInput
                  mb={0}
                  isRequired
                  autoCapitalize="none"
                  keyboardType="default"
                  label="Confirm password"
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

          <Text>
            Passwords must contain at least 8 characters with uppercase and lowercase, a number and a special character.
          </Text>

          <HStack>
            <Controller
              control={control}
              name="is_terms_privacy_policy_accepted"
              rules={{
                validate: {
                  mustBeTrue: value => value || 'Terms and policy must be accepted',
                },
              }}
              render={({ field: { onChange, value } }) => (
                <FormControl isInvalid={Boolean(errors.is_terms_privacy_policy_accepted)}>
                  <Checkbox
                    value="demo"
                    defaultIsChecked
                    accessibilityLabel="Remember me"
                    isChecked={value}
                    onChange={onChange}
                    _text={{
                      fontSize: 'sm',
                      fontWeight: 'normal',
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
                    <Text paddingLeft={'10px'}>
                      I agree to HealthBook+
                      <Text
                        fontSize={'15px'}
                        _light={{ color: 'primary.600' }}
                        _dark={{ color: 'tertiary.600' }}
                        lineHeight={'22.5px'}
                        fontWeight="bold"
                      >
                        Terms of Service
                      </Text>
                      {' and '}
                      <Text
                        fontSize={'15px'}
                        _light={{ color: 'primary.600' }}
                        _dark={{ color: 'tertiary.600' }}
                        lineHeight={'22.5px'}
                        fontWeight="bold"
                      >
                        Privacy Policy
                      </Text>
                    </Text>
                  </Checkbox>

                  <FormControl.ErrorMessage>
                    {errors.is_terms_privacy_policy_accepted?.message}
                  </FormControl.ErrorMessage>
                </FormControl>
              )}
            />
          </HStack>
          <Button variant="solid" onPress={handleSubmit(handleSubmitPress)}>
            Sign Up
          </Button>
        </VStack>
      </Box>
    </KeyboardAwareScrollView>
  );
};

export default CreateAccountScreen;
