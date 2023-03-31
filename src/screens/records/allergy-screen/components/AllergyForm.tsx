import React, { useState, useEffect, useDeferredValue } from 'react';
import { Box, Text, VStack, IconButton, FormControl, HStack, Icon, Button, Link } from 'native-base';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import { useFormStateStore } from 'hooks/useFormStateStore';
import FormInput from '@components/FormInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FormTextArea from '@components/FormTextArea';
import FormFileAttachments from '@components/FormFileAttachments';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useGetAllergyOptions, useHROptions } from '@hooks/useHealthRecord';
import { useCalendarPicker } from '@hooks/useCalendarPicker';

import FormSelect from 'components/FormSelect';
import { NewAutoComplete as AutoComplete } from 'components/AutoComplete';
import { useDebounce } from 'use-debounce';
import { Masks } from 'react-native-mask-input';

export type AllergyFormValues = {
  id?: number;
  allergy: string;
  start: string;
  start_date_part: string;
  last_occurrence: string;
  last_occurrence_date_part: string;
  category: string;
  type: string;
  criticality: string;
  reaction: string;
  verification_status: string;
  note: string;
  private: boolean;
  test_file?: any;
};

type AllergyFormProps = {
  initialValues: Partial<AllergyFormValues>;
  onSubmit: SubmitHandler<AllergyFormValues>;
  loader: boolean;
};

const AllergyForm: React.FC<AllergyFormProps> = ({ initialValues, onSubmit, loader }) => {
  const {
    control,
    formState: { errors, isSubmitSuccessful, isSubmitting },
    handleSubmit,
    reset,
    setValue,
    register,
    getValues,
    watch,
  } = useForm<AllergyFormValues>({
    defaultValues: {
      start: '',
      last_occurrence: '',
      category: '',
      criticality: '',
      verification_status: '',
      reaction: '',
      allergy: '',
      note: '',
    },
  });

  const { formState, files, setFormState, setFiles }: any = useFormStateStore();
  const { openCalendar } = useCalendarPicker();

  const [startPicker, setStartPicker] = useState(false);
  const [allergyType, setAllergyType] = useState('');

  const [deferredQ] = useDebounce(watch('allergy'), 500);
  const test_file = watch('test_file') || [];

  const category = watch('category');

  const { data } = useHROptions('allergy');

  const { data: allergyCause = [] } = useGetAllergyOptions(deferredQ, category);

  useEffect(() => {
    if (formState) {
      reset(formState);
      setAllergyType('');
    }

    setFormState(undefined);
  }, [formState]);

  useEffect(() => {
    if (files && files.length) {
      setValue('test_file', [...test_file, ...files]);
    }

    setFiles(undefined);
  }, [files]);

  useEffect(() => {
    reset(initialValues);
  }, [initialValues]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setAllergyType('');
    }
  }, [isSubmitSuccessful]);
  return (
    <Box safeAreaBottom flex={1} _light={{ bgColor: 'white' }} _dark={{ bgColor: 'coolGray.800' }} p={4}>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        <Box>
          <Text fontSize="sm" mt={4}>
            When was the first time you remember this allergy occurring?
          </Text>
          <Controller
            control={control}
            name="start"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={Boolean(errors?.start)} mt={3}>
                <FormInput
                  {...register('start')}
                  label="Onset Date"
                  placeHolder="Onset Date"
                  labelExisting={false}
                  value={value}
                  onChangeText={onChange}
                  showSoftInputOnFocus={false}
                  showObfuscatedValue={false}
                  mask={Masks.DATE_MMDDYYYY}
                  onFocus={() => {
                    openCalendar({ value, onChange });
                  }}
                  onBlur={onBlur}
                  fontWeight="medium"
                  mb={3}
                  fontSize="sm"
                  InputRightElement={
                    <IconButton
                      mr="2"
                      w="0.5"
                      icon={<Icon as={MaterialIcons} name="calendar-today" />}
                      onPress={() => openCalendar({ value, onChange })}
                    />
                  }
                />
              </FormControl>
            )}
          />
          <Text fontSize="sm">What about the last occurrence?</Text>
          <Controller
            control={control}
            name="last_occurrence"
            rules={{
              maxLength: { value: 30, message: 'Exceeds max length of 30' },
              required: { value: true, message: 'This field is required.' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={!!errors.last_occurrence} mt={3}>
                <FormInput
                  isRequired
                  {...register('last_occurrence')}
                  label="Last Occurrence"
                  labelExisting={false}
                  placeHolder={'Last Occurrence'}
                  value={value}
                  mask={Masks.DATE_MMDDYYYY}
                  onChangeText={onChange}
                  showSoftInputOnFocus={false}
                  onFocus={() => {
                    openCalendar({ value, onChange });
                  }}
                  onBlur={onBlur}
                  fontSize="sm"
                  mb={3}
                  fontWeight="medium"
                  InputRightElement={
                    <IconButton
                      mr="2"
                      w="0.5"
                      icon={<Icon as={MaterialIcons} name="calendar-today" />}
                      onPress={() => openCalendar({ value, onChange })}
                    />
                  }
                >
                  <FormControl.ErrorMessage>{errors.last_occurrence?.message}</FormControl.ErrorMessage>
                </FormInput>
              </FormControl>
            )}
          />
          <Text fontSize="sm">What type of allergy is this?</Text>
          <Controller
            control={control}
            name="category"
            rules={{
              maxLength: { value: 30, message: 'Exceeds max length of 30' },
              required: { value: true, message: 'This field is required.' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={Boolean(errors?.category)} mt={3}>
                <FormSelect
                  label="Category"
                  {...register('category')}
                  placeholder={'e.g. food, medication, etc'}
                  selectedValue={value}
                  onValueChange={val => {
                    onChange(val);
                    setAllergyType(val);
                  }}
                  options={
                    (data?.category || []).map(({ key, value }: { key: string; value: string }) => ({
                      label: value,
                      value: key,
                    })) || []
                  }
                  fontSize="sm"
                  mb={3}
                  labelExisting={false}
                  fontWeight="medium"
                  dropdownIcon={
                    <HStack mr={1} alignItems="center" space="2">
                      <Icon
                        size="md"
                        as={MaterialCommunityIcons}
                        name="chevron-down"
                        _light={{ color: 'dustyGray.400' }}
                        _dark={{ color: 'dustyGray.400' }}
                      />
                    </HStack>
                  }
                >
                  <FormControl.ErrorMessage>{errors.category?.message}</FormControl.ErrorMessage>
                </FormSelect>
              </FormControl>
            )}
          />

          {(allergyType.length > 0 || initialValues?.category) && (
            <>
              <Text fontSize="sm">What is causing your allergy?</Text>
              <Controller
                control={control}
                name="allergy"
                rules={{
                  required: { value: true, message: 'This field is required.' },
                }}
                render={({ field: { onChange, value } }) => (
                  <AutoComplete
                    data={allergyCause}
                    value={value}
                    onChange={onChange}
                    error={!!errors.allergy}
                    helperText={errors.allergy?.message}
                    dataStructure={{ value: 'label' }}
                  />
                )}
              />
            </>
          )}

          <Text fontSize="sm">What’s the primary symptom?</Text>
          <Controller
            control={control}
            name="reaction"
            rules={{
              maxLength: { value: 30, message: 'Exceeds max length of 30' },
              required: { value: true, message: 'This field is required.' },
            }}
            render={({ field: { onChange, value } }) => (
              <FormControl isInvalid={Boolean(errors?.reaction)} mt={3}>
                <FormSelect
                  selectedValue={value}
                  {...register('reaction')}
                  onValueChange={onChange}
                  labelExisting={false}
                  placeholder={'e.g. runny nose, etc'}
                  fontSize="sm"
                  options={
                    (data?.reaction || []).map(({ key, value }: { key: string; value: string }) => ({
                      label: value,
                      value: key,
                    })) || []
                  }
                  fontWeight="medium"
                  mb={3}
                  dropdownIcon={
                    <HStack mr="1" alignItems="center" space="2">
                      <Icon
                        size="sm"
                        as={MaterialCommunityIcons}
                        name="chevron-down"
                        _light={{ color: 'dustyGray.400' }}
                        _dark={{ color: 'dustyGray.400' }}
                      />
                    </HStack>
                  }
                >
                  <FormControl.ErrorMessage>{errors.reaction?.message}</FormControl.ErrorMessage>
                </FormSelect>
              </FormControl>
            )}
          />
          <Text fontSize="sm">How would you rate it’s severity? (4 being the most severe)</Text>
          <Controller
            control={control}
            name="criticality"
            rules={{
              maxLength: { value: 30, message: 'Exceeds max length of 30' },
              required: { value: true, message: 'This field is required.' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={Boolean(errors?.criticality)} mt={3}>
                <FormSelect
                  selectedValue={value}
                  {...register('criticality')}
                  onValueChange={onChange}
                  options={
                    (data?.criticality || []).map(({ key, value }: { key: number; value: string }) => ({
                      label: value,
                      value: key.toString(),
                    })) || []
                  }
                  placeholder={'Select severity'}
                  labelExisting={false}
                  fontSize="sm"
                  mb={3}
                  fontWeight={'medium'}
                  dropdownIcon={
                    <HStack mr="1" alignItems="center" space="2">
                      <Icon
                        size="9"
                        as={MaterialCommunityIcons}
                        name="chevron-down"
                        _light={{ color: 'dustyGray.400' }}
                        _dark={{ color: 'dustyGray.400' }}
                      />
                    </HStack>
                  }
                >
                  <FormControl.ErrorMessage>{errors.criticality?.message}</FormControl.ErrorMessage>
                </FormSelect>
              </FormControl>
            )}
          />
          <Text fontSize="sm">Has this allergy been verified?</Text>
          <Controller
            control={control}
            name="verification_status"
            rules={{
              maxLength: { value: 30, message: 'Exceeds max length of 30' },
              required: { value: true, message: 'This field is required.' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={Boolean(errors?.verification_status)} mt={3}>
                <FormSelect
                  selectedValue={value || ''}
                  {...register('verification_status')}
                  onValueChange={onChange}
                  placeholder={'Select verification'}
                  options={
                    (data?.verification_status || []).map(({ key, value }: any) => ({
                      label: value,
                      value: key,
                    })) || []
                  }
                  fontSize="sm"
                  mb={3}
                  labelExisting={false}
                  fontWeight={'medium'}
                  dropdownIcon={
                    <HStack mr="1" alignItems="center" space="2">
                      <Icon
                        size="9"
                        as={MaterialCommunityIcons}
                        name="chevron-down"
                        _light={{ color: 'dustyGray.400' }}
                        _dark={{ color: 'dustyGray.400' }}
                      />
                    </HStack>
                  }
                >
                  <FormControl.ErrorMessage>{errors.verification_status?.message}</FormControl.ErrorMessage>
                </FormSelect>
              </FormControl>
            )}
          />
          <Text fontSize="sm">Any other files or notes you’d like to include?</Text>
          <Controller
            control={control}
            name="note"
            rules={{
              maxLength: 200,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={Boolean(errors.note)} mt={3}>
                <FormTextArea
                  label="Additional Notes"
                  autoCapitalize="words"
                  placeHolder="Additional Notes"
                  labelExisting={false}
                  textAlignVertical="top"
                  multiline={true} // ios fix for centering it at the top-left corner
                  numberOfLines={10}
                  onBlur={onBlur}
                  mb={3}
                  onChangeText={onChange}
                  fontSize="sm"
                  fontWeight="medium"
                  value={value || ''}
                >
                  <FormControl.ErrorMessage>{errors.note?.message}</FormControl.ErrorMessage>
                </FormTextArea>
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="test_file"
            render={({ field: { value, onChange } }) => <FormFileAttachments value={value} onChange={onChange} />}
          />
          <Button
            variant="solid"
            size="lg"
            isLoading={isSubmitting}
            onPress={handleSubmit(onSubmit)}
            _light={{ backgroundColor: 'primary.600' }}
            _dark={{ backgroundColor: 'tertiary.600' }}
            mt="23px"
          >
            Save
          </Button>
        </Box>
      </KeyboardAwareScrollView>
    </Box>
  );
};

export default AllergyForm;
