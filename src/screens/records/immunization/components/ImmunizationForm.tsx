import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, HStack, Icon, IconButton, Input, Pressable, Text, View } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDebounce } from 'use-debounce';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import FormInput from 'components/FormInput';
import FormTextArea from 'components/FormTextArea';
import FormFileAttachments from 'components/FormFileAttachments';
import NumberInput from 'screens/records/medication/components/NumberInput';
import { useHRChoices, useHROptions } from 'hooks/useHealthRecord';
import { useCalendarPicker } from '@hooks/useCalendarPicker';
import { NewAutoComplete as AutoComplete } from 'components/AutoComplete';
import { validationMessages } from 'utils/validationMessages';

const validationSchema = yup.object({
  immunization: yup.string().required(validationMessages.required),
  date: yup.string().required(validationMessages.required),
  reaction: yup.string().required(validationMessages.required),
  note: yup.string().max(200, validationMessages.max),
  multiple: yup.boolean().required(validationMessages.required),
  dose_number: yup.string().when('multiple', {
    is: true,
    then: schema => schema.required(validationMessages.required),
  }),
  series_doses: yup.string().when('multiple', {
    is: true,
    then: schema => schema.required(validationMessages.required),
  }),
});

export type ImmunizationFormValues = {
  immunization: string;
  date: string;
  dose_number: string;
  series_doses: string;
  reaction: string;
  test_file: any;
  note: string;
  multiple: boolean;
};

type Props = {
  initialValues: Partial<ImmunizationFormValues>;
  onSubmit: SubmitHandler<ImmunizationFormValues>;
};

const ImmunizationForm: React.FC<Props> = ({ initialValues, onSubmit }) => {
  const {
    control,
    watch,
    reset,
    formState: { isSubmitSuccessful, errors },
    handleSubmit,
  } = useForm<ImmunizationFormValues>({
    resolver: yupResolver(validationSchema),
  });

  const [deferredQ] = useDebounce(watch('immunization'), 500);
  const { data: choices = [] } = useHRChoices('immunization', { q: deferredQ });
  const { data: options } = useHROptions('immunization');

  const multiple = watch('multiple');

  const { openCalendar } = useCalendarPicker();

  useEffect(() => {
    reset(initialValues);
  }, [initialValues]);

  useEffect(() => {
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful]);

  return (
    <Box safeAreaBottom flex={1} _light={{ bgColor: 'white' }} _dark={{ bgColor: 'coolGray.800' }} p={4}>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Text fontWeight="medium" my={4}>
            What's the name of the vaccine?
          </Text>
          <Controller
            control={control}
            name="immunization"
            render={({ field: { value, onChange } }) => (
              <AutoComplete
                data={choices}
                error={!!errors.immunization}
                helperText={errors.immunization?.message}
                value={value}
                onChange={onChange}
                dataStructure={{ key: 'product_name', value: 'product_name' }}
              />
            )}
          />

          <Text fontWeight="medium" mt={4}>
            Does it involve multiple dosages?
          </Text>

          <Controller
            control={control}
            name="multiple"
            render={({ field: { value, onChange } }) => (
              <FormControl isInvalid={!!errors.multiple}>
                <Button.Group mt={4} space={4}>
                  <Button
                    variant={value || value === undefined ? 'outline' : 'solid'}
                    onPress={() => onChange(false)}
                    flex={1}
                  >
                    No
                  </Button>
                  <Button variant={value ? 'solid' : 'outline'} onPress={() => onChange(true)} flex={1}>
                    Yes
                  </Button>
                </Button.Group>
                <FormControl.ErrorMessage>{errors.multiple?.message}</FormControl.ErrorMessage>
              </FormControl>
            )}
          />

          {multiple && (
            <>
              <HStack my={4} space={2}>
                <Text fontWeight="medium">How many dosages?</Text>
                <Text fontWeight="medium">What dose number was this?</Text>
              </HStack>

              <HStack>
                <Controller
                  control={control}
                  name="series_doses"
                  render={({ field: { value, onChange } }) => (
                    <FormControl isInvalid={!!errors.series_doses} flex={1}>
                      <NumberInput value={value} onChange={onChange} />
                      <FormControl.ErrorMessage>{errors.series_doses?.message}</FormControl.ErrorMessage>
                    </FormControl>
                  )}
                />

                <Controller
                  control={control}
                  name="dose_number"
                  render={({ field: { value, onChange } }) => (
                    <FormControl isInvalid={!!errors.dose_number} flex={1}>
                      <NumberInput value={value} onChange={onChange} />
                      <FormControl.ErrorMessage>{errors.dose_number?.message}</FormControl.ErrorMessage>
                    </FormControl>
                  )}
                />
              </HStack>
            </>
          )}

          <Text fontWeight="medium" my={4}>
            When did the immunization happen?
          </Text>

          <Controller
            control={control}
            name="date"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={!!errors.date} flex={1}>
                <FormInput
                  isRequired
                  keyboardType="numeric"
                  label="Date"
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
                >
                  <FormControl.ErrorMessage>{errors.date?.message}</FormControl.ErrorMessage>
                </FormInput>
              </FormControl>
            )}
          />

          <Text fontWeight="medium">Any reactions to the vaccine?</Text>

          <Controller
            control={control}
            name="reaction"
            render={({ field: { value, onChange } }) => (
              <FormControl isInvalid={!!errors.reaction}>
                <Button.Group mt={4} space={4}>
                  {options?.reaction.map(item => (
                    <Button
                      key={item.key}
                      onPress={() => onChange(item.key)}
                      variant={value === item.key ? 'solid' : 'outline'}
                      flex={1}
                    >
                      {item.value}
                    </Button>
                  ))}
                </Button.Group>
                <FormControl.ErrorMessage>{errors.reaction?.message}</FormControl.ErrorMessage>
              </FormControl>
            )}
          />

          <Text fontWeight="medium" my={4}>
            Any other files or notes you'd like to include?
          </Text>

          <Controller
            control={control}
            name="note"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={!!errors.note}>
                <FormTextArea
                  autoCapitalize="words"
                  placeholder="Additional Notes"
                  textAlignVertical="top"
                  multiline={true}
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
        </Box>

        <Button mt={4} onPress={handleSubmit(onSubmit)}>
          Save
        </Button>
      </KeyboardAwareScrollView>
    </Box>
  );
};

export default ImmunizationForm;
