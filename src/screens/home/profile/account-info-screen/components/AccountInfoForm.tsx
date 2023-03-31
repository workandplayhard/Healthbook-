import React from 'react';

import { FormControl, HStack, Icon, IconButton, Image, Radio, Text } from 'native-base';
import { Controller, useFormContext } from 'react-hook-form';
import { Masks } from 'react-native-mask-input';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import FormInput from '@components/FormInput';
import FormSelect from '@components/FormSelect';
import { useCalendarPicker } from '@hooks/useCalendarPicker';
import { useGetOptions } from '@hooks/useOptions';
import { EMAIL_REGEX } from '@utils/constants';

export type AccountInfoFormValues = {
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  imperialUnits: 'imperial' | 'metric';
  showDigitalAvatar: boolean;
};

const AccountInfoForm = () => {
  const { openCalendar } = useCalendarPicker();

  const {
    control,
    formState: { errors, dirtyFields },
  } = useFormContext<AccountInfoFormValues>();

  const { data: options } = useGetOptions();

  return (
    <>
      {/* First Name */}
      <Controller
        control={control}
        name="firstName"
        rules={{
          required: { value: true, message: 'First name is required' },
          maxLength: 30,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isInvalid={Boolean(errors.firstName)}>
            <FormInput
              isRequired
              autoCapitalize="words"
              label="First Name"
              maxLength={30}
              onBlur={onBlur}
              onChangeText={onChange}
              defaultValue={value}
              value={value}
            >
              <FormControl.ErrorMessage>{errors.firstName?.message}</FormControl.ErrorMessage>
            </FormInput>
          </FormControl>
        )}
      />

      {/* Last Name */}
      <Controller
        control={control}
        name="lastName"
        rules={{
          required: { value: true, message: 'Last name is required' },
          maxLength: 30,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isInvalid={Boolean(errors.lastName)}>
            <FormInput
              isRequired
              autoCapitalize="words"
              label="Last Name"
              maxLength={30}
              onBlur={onBlur}
              onChangeText={onChange}
              defaultValue={value}
              value={value}
            >
              <FormControl.ErrorMessage>{errors.lastName?.message}</FormControl.ErrorMessage>
            </FormInput>
          </FormControl>
        )}
      />

      {/* DOB */}
      <Controller
        control={control}
        name="dob"
        rules={{
          required: { value: true, message: 'Date of Birth is required' },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isInvalid={Boolean(errors.dob)}>
            <FormInput
              isRequired
              keyboardType="numeric"
              label="Date of Birth"
              onBlur={onBlur}
              onChangeText={onChange}
              defaultValue={value}
              value={value}
              mask={Masks.DATE_MMDDYYYY}
              InputRightElement={
                <IconButton
                  p={0}
                  mr={2}
                  icon={<Icon as={MaterialIcons} name="calendar-today" />}
                  onPress={() => openCalendar({ value, onChange })}
                />
              }
            >
              <FormControl.ErrorMessage>{errors.dob?.message}</FormControl.ErrorMessage>
            </FormInput>
          </FormControl>
        )}
      />

      {/* Email */}
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
              {dirtyFields.email && (
                <FormControl.HelperText>
                  Email is required for sign in. Verify your change for accuracy.
                </FormControl.HelperText>
              )}
            </FormInput>
          </FormControl>
        )}
      />

      {/* Street Address */}
      <Controller
        control={control}
        name="address"
        rules={{
          maxLength: 100,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isInvalid={Boolean(errors.address)}>
            <FormInput
              autoCapitalize="words"
              label="Street Address"
              maxLength={100}
              onBlur={onBlur}
              onChangeText={onChange}
              defaultValue={value}
              value={value}
            >
              <FormControl.ErrorMessage>{errors.address?.message}</FormControl.ErrorMessage>
            </FormInput>
          </FormControl>
        )}
      />

      {/* City */}
      <Controller
        control={control}
        name="city"
        rules={{
          maxLength: 30,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isInvalid={Boolean(errors.city)}>
            <FormInput
              autoCapitalize="words"
              label="City"
              onBlur={onBlur}
              maxLength={30}
              onChangeText={text => onChange(text.replace(/[^a-z]/gi, ''))}
              defaultValue={value}
              value={value}
            >
              <FormControl.ErrorMessage>{errors.city?.message}</FormControl.ErrorMessage>
            </FormInput>
          </FormControl>
        )}
      />

      {/* State */}
      <Controller
        control={control}
        name="state"
        render={({ field: { onChange, value } }) => (
          <FormControl>
            <FormSelect
              label="State"
              onValueChange={onChange}
              defaultValue={value}
              selectedValue={value}
              options={
                options?.states.map(state => ({
                  value: state.value,
                  label: state.value,
                })) || []
              }
            />
          </FormControl>
        )}
      />

      {/* Zip */}
      <Controller
        control={control}
        name="zip"
        rules={{
          pattern: {
            value: /(^\d{5}$)|(^\d{10}$)|(^\d{5}-\d{4}$)/,
            message: 'Invalid Zip Code. It should be in the format of 12345 or 12345-1234',
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isInvalid={Boolean(errors.zip)}>
            <FormInput
              keyboardType="numeric"
              label="Zip"
              maxLength={10}
              onBlur={onBlur}
              onChangeText={onChange}
              defaultValue={value}
              value={value}
              mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
            >
              <FormControl.ErrorMessage>{errors.zip?.message}</FormControl.ErrorMessage>
            </FormInput>
          </FormControl>
        )}
      />

      {/* Phone Number */}
      <Controller
        control={control}
        name="phone"
        rules={{
          pattern: {
            value: /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/,
            message: 'Please enter a valid phone number',
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isInvalid={Boolean(errors.phone)}>
            <FormInput
              keyboardType="phone-pad"
              label="Phone Number"
              maxLength={14}
              onBlur={onBlur}
              onChangeText={onChange}
              defaultValue={value}
              value={value}
              mask={Masks.USA_PHONE}
              InputLeftElement={
                <HStack alignItems="center" space={2} ml={2}>
                  <Image
                    alt="flag"
                    source={require('@assets/images/us-flag.png')}
                    width={6}
                    height={5}
                    resizeMode="contain"
                  />
                  <Text>+1</Text>
                </HStack>
              }
            >
              <FormControl.ErrorMessage>{errors.phone?.message}</FormControl.ErrorMessage>
            </FormInput>
          </FormControl>
        )}
      />

      {/*  Measurement System */}
      <Controller
        control={control}
        name="imperialUnits"
        render={({ field: { onChange, value } }) => (
          <FormControl>
            <FormControl.Label>Measurement System</FormControl.Label>
            <Radio.Group direction="row" name="system" space="8" onChange={onChange} defaultValue={value} value={value}>
              <Radio value="imperial">Imperial</Radio>
              <Radio value="metric">Metric</Radio>
            </Radio.Group>
          </FormControl>
        )}
      />
    </>
  );
};

export default AccountInfoForm;
