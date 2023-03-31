import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  VStack,
  FormControl,
  HStack,
  Icon,
  Button,
} from 'native-base';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import FormInput from '@components/FormInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import FormTextArea from '@components/FormTextArea';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FormSelect from 'components/FormSelect';
import { intensityVerifiedOptions } from './data';

import DateIcon from '@assets/icons/date.svg';
import AutoComplete from 'components/AutoComplete';
import { useHRChoices, useHROptions } from 'hooks/useHealthRecord';
import { useFormStateStore } from 'hooks/useFormStateStore';
import FormFileAttachments from 'components/FormFileAttachments';

export type SymptomFormValues = {
  symptom: string;
  start: string;
  end: string;
  frequency: string;
  interval: string;
  intensity: string;
  note: string;
  test_file: any;
};

type FormProps = {
  initialValues: Partial<SymptomFormValues>;
  onSubmit: SubmitHandler<SymptomFormValues>;
};

const SymptomsForm: React.FC<FormProps> = ({ initialValues, onSubmit }) => {
  const {
    control,
    formState: { errors, isSubmitSuccessful },
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<SymptomFormValues>({});

  const { formState, files, setFormState, setFiles }: any = useFormStateStore();

  const [startDatePicker, setStartDatePicker] = useState(false);
  const [endDatePicker, setEndDatePicker] = useState(false);

  const [q, setQ] = useState('');
  const { data: choices = [] } = useHRChoices('symptom', { q });
  const { data: options } = useHROptions('symptom');

  useEffect(() => {
    if (formState) {
      reset(formState);
    }

    setFormState(undefined);
  }, [formState]);

  useEffect(() => {
    reset(initialValues);
  }, [initialValues]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  return (
    <Box safeAreaBottom p={4}>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        <VStack width="full">
          <Text fontSize="sm">What's bothering you?</Text>
          <Controller
            control={control}
            name="symptom"
            rules={{
              maxLength: { value: 30, message: 'Exceeds max length of 30' },
              required: { value: true, message: 'This field is required.' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={Boolean(errors?.symptom)} mt={2}>
                <AutoComplete
                  value={value}
                  onChange={onChange}
                  query={q}
                  onQueryChange={setQ}
                  options={
                    choices.map(({ label, name }: any) => ({
                      label,
                      value: name,
                    })) || []
                  }
                />
              </FormControl>
            )}
          />

          <Text fontSize="sm" color={'black'} mt={4}>
            How long have you been experiencing this condition?
          </Text>

          <HStack>
            <Controller
              control={control}
              name="start"
              rules={{
                required: {
                  value: true,
                  message: 'Start date is required to continue',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl
                  isInvalid={Boolean(errors?.start)}
                  flex={1}
                  mt={'8px'}
                >
                  <FormInput
                    isRequired
                    label="Start Date"
                    autoCapitalize="none"
                    keyboardType="default"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    defaultValue={value}
                    value={value}
                    rightElement={
                      <HStack mr="2" alignItems="center" space="2">
                        {startDatePicker && (
                          <DateTimePicker
                            mode="date"
                            value={new Date()}
                            onChange={e => {
                              setStartDatePicker(false);
                              onChange({
                                target: {
                                  value: dayjs(e.nativeEvent.timestamp).format(
                                    'MM/DD/YYYY',
                                  ),
                                },
                              });
                            }}
                          />
                        )}
                        <DateIcon />
                      </HStack>
                    }
                    mb={3}
                    onFocus={() => setStartDatePicker(true)}
                    height={'41px'}
                    paddingLeft={'10px'}
                    fontWeight={'medium'}
                    fontSize={'sm'}
                  />
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name="end"
              rules={{
                maxLength: { value: 30, message: 'Exceeds max length of 30' },
                required: { value: true, message: 'This field is required.' },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl
                  isInvalid={Boolean(errors?.end)}
                  flex={1}
                  paddingLeft={'16px'}
                  mt={'8px'}
                >
                  <FormInput
                    isRequired
                    autoCapitalize="none"
                    keyboardType="default"
                    onBlur={onBlur}
                    defaultValue={value}
                    value={value}
                    label="End Date"
                    rightElement={
                      <HStack mr="2" alignItems="center" space="2">
                        {endDatePicker && (
                          <DateTimePicker
                            mode="date"
                            value={new Date()}
                            onChange={e => {
                              setEndDatePicker(false);
                              onChange({
                                target: {
                                  value: dayjs(e.nativeEvent.timestamp).format(
                                    'MM/DD/YYYY',
                                  ),
                                },
                              });
                            }}
                          />
                        )}
                        <DateIcon />
                      </HStack>
                    }
                    mb={3}
                    onFocus={() => setEndDatePicker(true)}
                    height="41px"
                    fontWeight={'medium'}
                    fontSize={'sm'}
                  />
                </FormControl>
              )}
            />
          </HStack>

          <Text fontSize="sm">How does it occur?</Text>
          <HStack mb={-3}>
            <Controller
              control={control}
              name="frequency"
              rules={{
                required: {
                  value: true,
                  message: 'Email address is required to sign in',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl
                  isInvalid={Boolean(errors.frequency)}
                  flex={1}
                  mt={'8px'}
                >
                  <FormSelect
                    label="Select Frequency"
                    selectedValue={value}
                    onValueChange={onChange}
                    options={(options.frequency || []).map(
                      ({ key, value }: { key: string; value: string }) => ({
                        label: value,
                        value: key,
                      }),
                    )}
                  />
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name="interval"
              rules={{
                required: {
                  value: true,
                  message: 'Email address is required to sign in',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl
                  isInvalid={Boolean(errors.interval)}
                  mt={'8px'}
                  flex={1}
                  paddingLeft={'16px'}
                >
                  <FormSelect
                    label="Interval"
                    selectedValue={value}
                    onValueChange={onChange}
                    options={
                      (options?.interval || []).map(({ key, value }: any) => ({
                        label: value,
                        value: key,
                      })) || []
                    }
                  />
                </FormControl>
              )}
            />
          </HStack>

          <Text fontSize={'sm'}>
            How bad is the intensity? (10 is most intense)
          </Text>
          <Controller
            control={control}
            name="intensity"
            rules={{
              maxLength: { value: 30, message: 'Exceeds max length of 30' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={Boolean(errors?.intensity)}>
                <FormSelect
                  selectedValue={value}
                  onValueChange={onChange}
                  placeholder={'Select intensity'}
                  height="41px"
                  options={intensityVerifiedOptions}
                  marginTop={2}
                  fontSize={'sm'}
                  fontWeight={'medium'}
                  mb={3}
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
                  <FormControl.ErrorMessage>
                    {errors.intensity?.message}
                  </FormControl.ErrorMessage>
                </FormSelect>
              </FormControl>
            )}
          />

          <Text fontSize={'sm'}>
            Any other files or notes you’d like to include?
          </Text>
          <Controller
            control={control}
            name="note"
            rules={{
              maxLength: 200,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={Boolean(errors.note)}>
                <FormTextArea
                  autoCapitalize="words"
                  placeholder="Additional Notes"
                  textAlignVertical="top"
                  multiline={true} // ios fix for centering it at the top-left corner
                  numberOfLines={10}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  fontSize={'sm'}
                  fontWeight={'medium'}
                  marginTop={2}
                  defaultValue={value || ''}
                  value={value || ''}
                  h={106}
                >
                  <FormControl.ErrorMessage>
                    {errors.note?.message}
                  </FormControl.ErrorMessage>
                </FormTextArea>
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="test_file"
            render={({ field: { value, onChange } }) => (
              <FormFileAttachments value={value} onChange={onChange} />
            )}
          />

          <Button
            variant="solid"
            size="lg"
            // isLoading={addSymptomLoader}
            onPress={handleSubmit(onSubmit)}
            _light={{ backgroundColor: 'primary.600' }}
            _dark={{ backgroundColor: 'tertiary.600' }}
            mt="81px"
          >
            Save
          </Button>
        </VStack>
      </KeyboardAwareScrollView>
    </Box>
  );
};

export default SymptomsForm;
