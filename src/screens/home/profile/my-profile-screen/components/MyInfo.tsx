import React from 'react';
import FormInput from 'components/FormInput';
import FormSelect from 'components/FormSelect';
import { useGetOptions } from 'hooks/useOptions';
import { useCurrentUser } from 'hooks/useUsers';
import { FormControl, HStack, Text } from 'native-base';
import { Controller, useFormContext } from 'react-hook-form';
import type { Patient } from 'services/types';

const numsOfChildren = [
  { label: 'None', value: 'none' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '10+', value: '10+' },
];

export const regEx = /^[a-zA-Z]+$/;

export const isImperialWeight = (value: string) => {
  if (isNaN(Number(value)) || value.length === 0) return false;

  const [whole, fraction] = value.split('.');

  if (Number(value) > 650 || whole.length > 4 || (fraction && fraction.length > 2)) return false;

  return true;
};

export const isMetricWeight = (value: string) => {
  if (isNaN(Number(value)) || value.length === 0) return false;

  const [whole, fraction] = value.split('.');

  if (whole.length > 3 || (fraction && fraction.length > 2)) return false;

  return true;
};

export const isImperialHeight0 = (value: string) => {
  if (Number(value) > 7 || Number(value) < 1 || value.length === 0)
    return false;

  const [, fraction] = value.split('.');

  if (fraction) return false;

  return true;
};

export const isMetricHeight0 = (value: string) => {
  const [whole, fraction] = value.split('.');
  if (Number(value) > 2.4 || value.length === 0) return false;

  if (whole.length === 1 && fraction.length === 2) return true;

  return false;
};

export const isHeight1 = (value: string) => {
  if (Number(value) > 10 || value.length === 0) return false;

  return true;
};

export const isOccupation = (value: string) => {
  if (value.length <= 30 && value.match(regEx)) return true;

  return false;
};

const MyInfo = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<Patient>();

  const { data: options } = useGetOptions();
  const { data: currentUser } = useCurrentUser();

  return (
    <>
      <Controller
        control={control}
        name="sex"
        rules={{
          required: { value: true, message: 'This field is required.' },
        }}
        render={({ field: { onChange, value } }) => (
          <FormControl isInvalid={Boolean(errors.sex)} flex={1}>
            <FormSelect
              label="Sex"
              defaultValue={value as string}
              selectedValue={value as string}
              onValueChange={onChange}
              options={
                options?.sex.map(({ key, value }) => ({
                  label: value,
                  value: key,
                })) || []
              }
            >
              <FormControl.ErrorMessage>
                {errors.sex?.message}
              </FormControl.ErrorMessage>
            </FormSelect>
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="gender"
        rules={{
          required: { value: true, message: 'This field is required.' },
        }}
        render={({ field: { onChange, value } }) => (
          <FormControl isInvalid={Boolean(errors.gender)} flex={1}>
            <FormSelect
              label="Gender Identity"
              defaultValue={value as string}
              selectedValue={value as string}
              onValueChange={onChange}
              options={
                options?.gender.map(({ key, value }) => ({
                  label: value,
                  value: key,
                })) || []
              }
            >
              <FormControl.ErrorMessage>
                {errors.gender?.message}
              </FormControl.ErrorMessage>
            </FormSelect>
          </FormControl>
        )}
      />

      <Controller
        control={control}
        name="weight"
        rules={{
          required: { value: true, message: 'This field is required.' },
          validate: currentUser?.imperial_units
            ? isImperialWeight
            : isMetricWeight,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isInvalid={Boolean(errors.weight)}>
            <FormInput
              isRequired
              label="Weight"
              InputRightElement={
                <Text mr={2}>{currentUser?.imperial_units ? 'lbs' : 'kg'}</Text>
              }
              onBlur={onBlur}
              onChangeText={onChange}
              defaultValue={value as string}
              value={value as string}
            >
              <FormControl.ErrorMessage>
                {errors.weight?.type === 'validate'
                  ? (currentUser?.imperial_units ? ( Number(value) > 650 ? 'Less than 650 lbs' : 'Invalid weight format' ) : ( Number(value) > 300 ? 'Less than 300 kgs' : 'Invalid weight format' ))
                  : errors.weight?.message}
              </FormControl.ErrorMessage>
            </FormInput>
          </FormControl>
        )}
      />

      <HStack space={3}>
        <Controller
          control={control}
          name="height.0"
          rules={{
            required: { value: true, message: 'This field is required.' },
            validate: currentUser?.imperial_units
              ? isImperialHeight0
              : isMetricHeight0,
          }}
          render={({ field: { onChange, onBlur, value } }) => {
            const height = errors?.height as unknown as any[]
            
            return (
              <FormControl isInvalid={Boolean(height?.[0]?.ref?.name === 'height.0')} flex={1}>
                <FormInput
                  isRequired
                  autoCapitalize="words"
                  label={`Height in ${
                    currentUser?.imperial_units ? 'feet' : 'meters'
                  }`}
                  InputRightElement={
                    <Text mr={2}>{currentUser?.imperial_units ? 'ft' : 'm'}</Text>
                  }
                  onBlur={onBlur}
                  onChangeText={onChange}
                  defaultValue={value}
                  value={value}
                >
                  <FormControl.ErrorMessage>
                    {currentUser?.imperial_units
                      ? ( Number(value) > 7 ? 'Less than 7 ft 10 inches' : 'Invalid height format' )
                      : ( Number(value) > 2.4 ? 'Less than 2.4m' : 'Invalid height format' )}
                  </FormControl.ErrorMessage>
                </FormInput>
              </FormControl>
          )}}
        />

        {currentUser?.imperial_units && (
          <Controller
            control={control}
            name="height.1"
            rules={{
              validate: isHeight1
            }}
            render={({ field: { onChange, onBlur, value } }) => {
              const height = errors?.height as unknown as any[]

              return (
                <FormControl isInvalid={Boolean(height?.[1]?.ref?.name === 'height.1')} flex={1}>
                  <FormInput
                    isRequired
                    label="Height in inches"
                    InputRightElement={<Text mr={2}>In</Text>}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    defaultValue={value}
                    value={value}
                  >
                    <FormControl.ErrorMessage>
                      {Number(value) > 10 ? 'Less than 7 ft 10 inches' : 'Invalid height format'}
                    </FormControl.ErrorMessage>
                  </FormInput>
                </FormControl>
              )}}
          />
        )}
      </HStack>

      <Controller
        control={control}
        name="race"
        rules={{
          required: { value: true, message: 'This field is required.' },
        }}
        render={({ field: { onChange, value } }) => (
          <FormControl isInvalid={Boolean(errors.race)} flex={1}>
            <FormSelect
              label="Race/Ethnicity"
              defaultValue={value as string}
              selectedValue={value as string}
              onValueChange={onChange}
              options={
                options?.race.map(({ key, value }) => ({
                  value: key,
                  label: value,
                })) || []
              }
            >
              <FormControl.ErrorMessage>
                {errors.race?.message}
              </FormControl.ErrorMessage>
            </FormSelect>
          </FormControl>
        )}
      />

      <Controller
        control={control}
        name="marital_status"
        rules={{
          required: { value: true, message: 'This field is required.' },
        }}
        render={({ field: { onChange, value } }) => (
          <FormControl isInvalid={Boolean(errors.marital_status)} flex={1}>
            <FormSelect
              label="Marital Status"
              defaultValue={value as string}
              selectedValue={value as string}
              onValueChange={onChange}
              options={
                options?.marital_status.map(({ key, value }) => ({
                  value: key,
                  label: value,
                })) || []
              }
            >
              <FormControl.ErrorMessage>
                {errors.marital_status?.message}
              </FormControl.ErrorMessage>
            </FormSelect>
          </FormControl>
        )}
      />

      <Controller
        control={control}
        name="no_children"
        rules={{
          required: { value: true, message: 'This field is required.' },
        }}
        render={({ field: { onChange, value } }) => (
          <FormControl isInvalid={Boolean(errors.no_children)} flex={1}>
            <FormSelect
              label="# of children"
              defaultValue={value as string}
              selectedValue={value as string}
              onValueChange={onChange}
              options={numsOfChildren}
            >
              <FormControl.ErrorMessage>
                {errors.no_children?.message}
              </FormControl.ErrorMessage>
            </FormSelect>
          </FormControl>
        )}
      />

      <Controller
        control={control}
        name="occupation"
        rules={{
          minLength: 3,
          maxLength: 30,
          required: { value: true, message: 'This field is required.' },
          pattern: {
            value: regEx,
            message: 'Only alphabets should be contained.',
          },
        }}
        render={({ field: { onChange, value, onBlur } }) => (
          <FormControl isInvalid={Boolean(errors.occupation)} flex={1}>
            <FormInput
              isRequired
              label="Occupation"
              onBlur={onBlur}
              onChangeText={onChange}
              defaultValue={value as string}
              value={value as string}
            >
              <FormControl.ErrorMessage>
                {errors.occupation?.message}
              </FormControl.ErrorMessage>
            </FormInput>
          </FormControl>
        )}
      />
    </>
  );
};

export default MyInfo;
