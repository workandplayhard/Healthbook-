import React from 'react';
import { FormControl, HStack, Image, Text } from 'native-base';
import { Masks } from 'react-native-mask-input';
import { Controller, useFormContext } from 'react-hook-form';

import FormInput from '@components/FormInput';
import FormTextArea from '@components/FormTextArea';
import type { Patient } from 'services/types';

import { regEx } from './MyInfo';

const usFlag = require('@assets/images/us-flag.png');

export const isPhoneNumber = (value: string) => {
  if (value.length === 12)
    return true;

  return false;
}

export const isCheckStringLength = (index: number) => (value: string) => {
  if (value.length < index)
    return true;
  
  return false;
}

const Physician = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<Patient>();

  return (
    <>
      <Controller
        control={control}
        name="personal_doctor_first_name"
        rules={{
          required: { value: true, message: 'First name is required' },
          maxLength: {
            value: 30,
            message: 'Length should be less than 30',
          },
          pattern: {
            value: regEx,
            message: 'Only alphabets should be contained.',
          },
          validate: isCheckStringLength(30)
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isInvalid={Boolean(errors.personal_doctor_first_name)}>
            <FormInput
              isRequired
              autoCapitalize="words"
              label="First Name"
              onBlur={onBlur}
              onChangeText={onChange}
              defaultValue={value || ''}
              value={value || ''}
            >
              <FormControl.ErrorMessage>
                {errors.personal_doctor_first_name?.message}
              </FormControl.ErrorMessage>
            </FormInput>
          </FormControl>
        )}
      />
      {/* Last Name */}
      <Controller
        control={control}
        name="personal_doctor_last_name"
        rules={{
          required: { value: true, message: 'Last name is required' },
          maxLength: {
            value: 30,
            message: 'Length should be less than 30',
          },
          pattern: {
            value: regEx,
            message: 'Only alphabets should be contained.',
          },
          validate: isCheckStringLength(30)
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isInvalid={Boolean(errors.personal_doctor_last_name)}>
            <FormInput
              isRequired
              autoCapitalize="words"
              label="Last Name"
              onBlur={onBlur}
              onChangeText={onChange}
              defaultValue={value || ''}
              value={value || ''}
            >
              <FormControl.ErrorMessage>
                {errors.personal_doctor_last_name?.message}
              </FormControl.ErrorMessage>
            </FormInput>
          </FormControl>
        )}
      />

      <Controller
        control={control}
        name="personal_doctor_specialty"
        rules={{
          required: { value: true, message: 'Specialty is required' },
          maxLength: {
            value: 30,
            message: 'Length should be less than 30',
          },
          pattern: {
            value: regEx,
            message: 'Only alphabets should be contained.',
          },
          validate: isCheckStringLength(30)
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isInvalid={Boolean(errors.personal_doctor_specialty)}>
            <FormInput
              isRequired
              label="Specialty"
              onBlur={onBlur}
              onChangeText={onChange}
              defaultValue={value || ''}
              value={value || ''}
            >
              <FormControl.ErrorMessage>
                {errors.personal_doctor_specialty?.message}
              </FormControl.ErrorMessage>
            </FormInput>
          </FormControl>
        )}
      />

      <Controller
        control={control}
        name="hospital"
        rules={{
          maxLength: {
            value: 100,
            message: 'Length should be less than 100',
          },
          pattern: {
            value: regEx,
            message: 'Only alphabets should be contained.',
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isInvalid={Boolean(errors.hospital)}>
            <FormInput
              isRequired
              autoCapitalize="words"
              label="Hospital"
              onBlur={onBlur}
              onChangeText={onChange}
              defaultValue={value || ''}
              value={value || ''}
            >
              <FormControl.ErrorMessage>
                {errors.hospital?.message}
              </FormControl.ErrorMessage>
            </FormInput>
          </FormControl>
        )}
      />

      <Controller
        control={control}
        name="personal_doctor_phone_number"
        rules={{
          maxLength: 13,
          pattern: {
            value: /(^\d{3}-\d{3}-\d{4}$)/,
            message: '555-555-5555'
          },
          validate: isPhoneNumber
        }}
        render={({ field: { onChange, onBlur, value = '' } }) => (
          <FormControl isInvalid={Boolean(errors.personal_doctor_phone_number)}>
            <FormInput
              isRequired
              autoCapitalize="words"
              label="Phone Number"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="555-555-5555"
              defaultValue={value || ''}
              value={value || ''}
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
                555-555-5555
              </FormControl.ErrorMessage>
            </FormInput>
          </FormControl>
        )}
      />

      <Controller
        control={control}
        name="notes"
        rules={{
          maxLength: {
            value: 200,
            message: 'Length should be less than 200',
          },
          pattern: {
            value: regEx,
            message: 'Only alphabets should be contained.',
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isInvalid={Boolean(errors.notes)}>
            <FormTextArea
              autoCapitalize="words"
              label="Notes"
              onBlur={onBlur}
              onChangeText={onChange}
              defaultValue={value || ''}
              value={value || ''}
            >
              <FormControl.ErrorMessage>
                {errors.notes?.message}
              </FormControl.ErrorMessage>
            </FormTextArea>
          </FormControl>
        )}
      />
    </>
  );
};

export default Physician;
