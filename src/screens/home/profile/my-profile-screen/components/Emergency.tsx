import React, { useMemo } from 'react';
import { FormControl, HStack, Image, Text } from 'native-base';
import { Controller, useFormContext } from 'react-hook-form';
import FormInput from 'components/FormInput';
import FormSelect from 'components/FormSelect';
import { useGetOptions } from 'hooks/useOptions';
import { Masks } from 'react-native-mask-input';
import type { Patient } from 'services/types';
import { regEx } from './MyInfo';

const usFlag = require('@assets/images/us-flag.png');

export const isZipCode = (value: string) => {
  if (value.length === 5 || value.length === 10)
    return true

  return false
}

export const isAlphabetCheck = (values: String) => {
  if (values.match(regEx))
    return true

  return false
}

export const Emergency = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<Patient>();

  const { data: options } = useGetOptions();

  const states = useMemo(() => {
    return options?.states.map(state => ({
      label: state.value,
      value: state.key,
    }));
  }, [options]);

  return (
    <>
      <Controller
        control={control}
        name="emergency_contact_first_name"
        rules={{
          maxLength: {
            value: 30,
            message: 'Length should be less than 30',
          },
          pattern: {
            value: regEx,
            message: "Only alphabets should be contained."
          }
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isInvalid={Boolean(errors.emergency_contact_first_name)}>
            <FormInput
              autoCapitalize="words"
              label="First Name"
              onBlur={onBlur}
              onChangeText={onChange}
              defaultValue={value || ''}
              value={value || ''}
            >
              <FormControl.ErrorMessage>
                {errors.emergency_contact_first_name?.message}
              </FormControl.ErrorMessage>
            </FormInput>
          </FormControl>
        )}
      />
      {/* Last Name */}
      <Controller
        control={control}
        name="emergency_contact_last_name"
        rules={{
          maxLength: {
            value: 30,
            message: 'Length should be less than 30',
          },
          pattern: {
            value: regEx,
            message: "Only alphabets should be contained."
          }
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isInvalid={Boolean(errors.emergency_contact_last_name)}>
            <FormInput
              autoCapitalize="words"
              label="Last Name"
              onBlur={onBlur}
              onChangeText={onChange}
              defaultValue={value || ''}
              value={value || ''}
            >
              <FormControl.ErrorMessage>
                {errors.emergency_contact_last_name?.message}
              </FormControl.ErrorMessage>
            </FormInput>
          </FormControl>
        )}
      />

      <Controller
        control={control}
        name="emergency_contact_address"
        rules={{
          maxLength: {
            value: 100,
            message: 'Length should be less than 30',
          },
          pattern: {
            value: regEx,
            message: "Only alphabets should be contained."
          }
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isInvalid={Boolean(errors.emergency_contact_address)}>
            <FormInput
              label="Street Address"
              onBlur={onBlur}
              onChangeText={onChange}
              defaultValue={value || '' || ''}
              value={value || '' || ''}
            >
              <FormControl.ErrorMessage>
                {errors.emergency_contact_address?.message}
              </FormControl.ErrorMessage>
            </FormInput>
          </FormControl>
        )}
      />

      <Controller
        control={control}
        name="emergency_city"
        rules={{
          maxLength: {
            value: 30,
            message: 'Length should be less than 30',
          },
          pattern: {
            value: regEx,
            message: 'City should contain only letters',
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isInvalid={Boolean(errors.emergency_city)}>
            <FormInput
              autoCapitalize="words"
              label="City"
              onBlur={onBlur}
              onChangeText={onChange}
              defaultValue={value || ''}
              value={value || ''}
            >
              <FormControl.ErrorMessage>
                {errors.emergency_city?.message}
              </FormControl.ErrorMessage>
            </FormInput>
          </FormControl>
        )}
      />

      <HStack space={2}>
        <Controller
          control={control}
          name="emergency_state"
          rules={{
            maxLength: 30,
          }}
          render={({ field: { onChange, value } }) => (
            <FormControl isInvalid={Boolean(errors.emergency_state)} flex={2.5}>
              <FormSelect
                label="State"
                defaultValue={value as string}
                selectedValue={value as string}
                onValueChange={onChange}
                options={states || []}
              >
                <FormControl.ErrorMessage>
                  {errors.emergency_state?.message}
                </FormControl.ErrorMessage>
              </FormSelect>
            </FormControl>
          )}
        />
        <Controller
          control={control}
          name="emergency_zip_code"
          rules={{
            minLength: 5,
            maxLength: 10,
            pattern: {
              value: /(^\d{5}$)|(^\d{10}$)|(^\d{5}-\d{4}$)/,
              message: '12345-1234',
            },
            validate: isZipCode,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormControl
              isInvalid={Boolean(errors.emergency_zip_code)}
              flex={1}
            >
              <FormInput
                isRequired
                autoCapitalize="words"
                label="ZIP"
                placeholder="12345"
                onBlur={onBlur}
                onChangeText={onChange}
                defaultValue={value || ''}
                value={value || ''}
              >
                <FormControl.ErrorMessage>
                  12345-1234
                </FormControl.ErrorMessage>
              </FormInput>
            </FormControl>
          )}
        />
      </HStack>

      <Controller
        control={control}
        name="emergency_contact_phone_number"
        rules={{
          maxLength: 30,
        }}
        render={({ field: { onChange, onBlur, value = '' } }) => (
          <FormControl
            isInvalid={Boolean(errors.emergency_contact_phone_number)}
          >
            <FormInput
              autoCapitalize="words"
              label="Phone Number"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="555-555-5555"
              defaultValue={value || ''}
              value={value || ''}
              mask={Masks.USA_PHONE}
              InputLeftElement={
                <HStack alignItems="center" space={2} ml={2}>
                  <Image
                    alt="flag"
                    source={usFlag}
                    width={6}
                    height={5}
                    resizeMode="contain"
                  />
                  <Text>+1</Text>
                </HStack>
              }
            >
              <FormControl.ErrorMessage>
                {errors.emergency_contact_phone_number?.message}
              </FormControl.ErrorMessage>
            </FormInput>
          </FormControl>
        )}
      />
    </>
  );
};
