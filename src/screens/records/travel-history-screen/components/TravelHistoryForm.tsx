import React, { useState, useEffect } from 'react';
import { Box, Text, VStack, FormControl, HStack, Icon, IconButton, Button, Link, TextArea } from 'native-base';

import { countryOptions } from './data';

import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import FormInput from '@components/FormInput';
import { useNavigation } from '@react-navigation/native';
import { useCalendarPicker } from '@hooks/useCalendarPicker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useFormStateStore } from 'hooks/useFormStateStore';
import FormFileAttachments from 'components/FormFileAttachments';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import DateIcon from '@assets/icons/date.svg';
import FormSelect from 'components/FormSelect';
import FormTextArea from 'components/FormTextArea';

export type TravelHistoryFormValues = {
  start: string;
  start_date_part: string;
  end: string;
  end_date_part: string;
  country: { key: string; value: string };
  note: string;
  private: boolean;
  test_file?: any;
};

type FormProps = {
  initialValues: Partial<TravelHistoryFormValues>;
  onSubmit: SubmitHandler<TravelHistoryFormValues>;
};

const TravelHistoryForm: React.FC<FormProps> = ({ initialValues, onSubmit }) => {
  const navigation = useNavigation();
  const {
    control,
    formState: { errors, isSubmitSuccessful },
    reset,
    handleSubmit,
    setValue,
    watch,
  } = useForm<TravelHistoryFormValues>({
    defaultValues: {
      start: '',
      start_date_part: '',
      end: '',
      end_date_part: '',
      country: {},
      note: '',
      private: false,
    },
  });
  const { formState, files, setFormState, setFiles }: any = useFormStateStore();
  const { openCalendar } = useCalendarPicker();

  const [startDatePicker, setStartDatePicker] = useState(false);
  const [endDatePicker, setEndDatePicker] = useState(false);
  const test_file = watch('test_file') || [];

  useEffect(() => {
    if (formState) {
      reset(formState);
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
          <Text fontSize="sm">Where did you travel to?</Text>
          <Controller
            control={control}
            name="country"
            rules={{
              required: { value: true, message: 'This field is required.' },
            }}
            render={({ field: { onChange, value } }) => (
              <FormControl isInvalid={Boolean(errors?.country)}>
                <FormSelect
                  selectedValue={value.key}
                  onValueChange={onChange}
                  options={countryOptions}
                  placeholder={'Select Country'}
                  mt={2}
                  paddingLeft="10px"
                  fontSize={'sm'}
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
                  <FormControl.ErrorMessage>{errors.country?.message}</FormControl.ErrorMessage>
                </FormSelect>
              </FormControl>
            )}
          />

          <Text fontSize="sm">When was the trip?</Text>
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
                <FormControl isInvalid={Boolean(errors?.start)} flex={1} mt={'8px'}>
                  <FormInput
                    isRequired
                    label="Start Date"
                    autoCapitalize="none"
                    keyboardType="default"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    defaultValue={value}
                    value={value}
                    InputRightElement={
                      <IconButton
                        p={0}
                        mr={2}
                        icon={<Icon as={MaterialIcons} name="calendar-today" />}
                        onPress={() => openCalendar({ value, onChange })}
                      />
                    }
                    mb={3}
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
                <FormControl isInvalid={Boolean(errors?.end)} flex={1} paddingLeft={'16px'} mt={'8px'}>
                  <FormInput
                    isRequired
                    autoCapitalize="none"
                    keyboardType="default"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    defaultValue={value}
                    value={value}
                    label="End Date"
                    InputRightElement={
                      <IconButton
                        p={0}
                        mr={2}
                        icon={<Icon as={MaterialIcons} name="calendar-today" />}
                        onPress={() => openCalendar({ value, onChange })}
                      />
                    }
                    mb={3}
                    onFocus={() => setEndDatePicker(true)}
                    fontWeight={'medium'}
                    fontSize={'sm'}
                  />
                </FormControl>
              )}
            />
          </HStack>

          <Text fontSize="sm">Any other files or notes you'd like to include?</Text>
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
                  h={100}
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
            // isLoading={}
            onPress={handleSubmit(onSubmit)}
            _light={{ backgroundColor: 'primary.600' }}
            _dark={{ backgroundColor: 'tertiary.600' }}
            mt="80%"
          >
            Save
          </Button>
        </Box>
      </KeyboardAwareScrollView>
    </Box>
  );
};

export default TravelHistoryForm;
