import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  HStack,
  Icon,
  Input,
  Select,
  Text,
  TextArea,
  View,
  Pressable,
  IconButton,
} from 'native-base';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDebounce } from 'use-debounce';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import FormInput from 'components/FormInput';
import { useHRChoices, useHROptions } from 'hooks/useHealthRecord';
import { useFormStateStore } from 'hooks/useFormStateStore';
import FormFileAttachments from 'components/FormFileAttachments';
import { useCalendarPicker } from '@hooks/useCalendarPicker';
import { NewAutoComplete as AutoComplete } from 'components/AutoComplete';
import { validationMessages } from 'utils/validationMessages';

const validationSchema = yup.object({
  family_member_name: yup.string().required(validationMessages.required),
  relationship_type: yup.string().required(validationMessages.required),
  deceased: yup.boolean().required(validationMessages.required),
  medical_problem: yup.string().required(validationMessages.required),
  start: yup.string().required(validationMessages.required),
  end: yup.string().required(validationMessages.required),
  outcome: yup.string().required(validationMessages.required),
  note: yup.string().max(200, validationMessages.max),
});

export type FamilyHistoryFormValues = {
  family_member_name: string;
  relationship_type: string;
  deceased: boolean;
  medical_problem: string;
  start: string;
  end: string;
  outcome: string;
  test_file: any;
  note: string;
};

type FormProps = {
  initialValues: Partial<FamilyHistoryFormValues>;
  onSubmit: SubmitHandler<FamilyHistoryFormValues>;
};

const FamilyHistoryForm: React.FC<FormProps> = ({ initialValues, onSubmit }) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitSuccessful, errors },
  } = useForm<FamilyHistoryFormValues>({
    resolver: yupResolver(validationSchema),
  });
  const { formState, setFormState }: any = useFormStateStore();

  const deceased = watch('deceased');
  const name = watch('family_member_name');

  useEffect(() => {
    if (formState) {
      reset(formState);
    }

    setFormState(undefined);
  }, [formState]);

  const [deferredQ] = useDebounce(watch('medical_problem'), 500);
  const { data: choices } = useHRChoices('condition', { q: deferredQ });
  const { data: options } = useHROptions('familyhistory');

  const { openCalendar } = useCalendarPicker();

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
      >
        <Box>
          <Text>What's the family member's name?</Text>
          <Controller
            control={control}
            name="family_member_name"
            render={({ field: { value, onChange } }) => (
              <FormControl mt={2} isInvalid={!!errors.family_member_name}>
                <Input value={value} onChangeText={onChange} />
                <FormControl.ErrorMessage>{errors.family_member_name?.message}</FormControl.ErrorMessage>
              </FormControl>
            )}
          />

          {name && (
            <>
              <Text mt={4}>{`What's your relation to ${name || 'this person'}?`}</Text>
              <Controller
                control={control}
                name="relationship_type"
                render={({ field: { value, onChange } }) => (
                  <FormControl isInvalid={!!errors.relationship_type} mt={2}>
                    <Select selectedValue={value} onValueChange={onChange}>
                      {options?.relationship_type.map(({ key, value }: any) => (
                        <Select.Item key={key} label={value} value={key} />
                      ))}
                    </Select>
                    <FormControl.ErrorMessage>{errors.relationship_type?.message}</FormControl.ErrorMessage>
                  </FormControl>
                )}
              />

              <Text mt={4}>Is this family member deceased?</Text>
              <Controller
                control={control}
                name="deceased"
                render={({ field: { value, onChange } }) => (
                  <FormControl isInvalid={!!errors.deceased}>
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
                    <FormControl.ErrorMessage>{errors.deceased?.message}</FormControl.ErrorMessage>
                  </FormControl>
                )}
              />

              <Text my={4}>{`What${deceased ? ' was' : "'s"} your family member's medical condition?`}</Text>
              <Controller
                control={control}
                name="medical_problem"
                render={({ field: { value, onChange } }) => (
                  <AutoComplete
                    data={choices || []}
                    value={value}
                    onChange={onChange}
                    error={!!errors.medical_problem}
                    helperText={errors.medical_problem?.message}
                    dataStructure={{ key: 'name', value: 'name' }}
                  />
                )}
              />

              <Text mt={4}>{`How long has ${name || 'this person'} been experiencing this condition?`}</Text>
              <HStack space={4} mt={4}>
                <Controller
                  control={control}
                  name="start"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <FormControl isInvalid={!!errors.start} flex={1}>
                      <FormInput
                        isRequired
                        keyboardType="numeric"
                        label="Start Date"
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
                        <FormControl.ErrorMessage>{errors.start?.message}</FormControl.ErrorMessage>
                      </FormInput>
                    </FormControl>
                  )}
                />
                <Controller
                  control={control}
                  name="end"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <FormControl isInvalid={!!errors.end} flex={1}>
                      <FormInput
                        isRequired
                        keyboardType="numeric"
                        label="End Date"
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
                        <FormControl.ErrorMessage>{errors.end?.message}</FormControl.ErrorMessage>
                      </FormInput>
                    </FormControl>
                  )}
                />
              </HStack>

              <Text>Was there any specific outcome related to the condition?</Text>
              <Controller
                control={control}
                name="outcome"
                render={({ field: { value, onChange } }) => (
                  <FormControl isInvalid={!!errors.outcome} mt={2}>
                    <Select selectedValue={value} onValueChange={onChange}>
                      {options?.outcome.map(({ key, value }: any) => (
                        <Select.Item key={key} label={value} value={key} />
                      )) || []}
                    </Select>
                    <FormControl.ErrorMessage>{errors.outcome?.message}</FormControl.ErrorMessage>
                  </FormControl>
                )}
              />
              <Text fontWeight="medium" mt={4}>
                Any other files or notes you'd like to include?
              </Text>
              <Controller
                control={control}
                name="note"
                rules={{
                  maxLength: {
                    value: 200,
                    message: 'This field is not allow to exceed 200 characters',
                  },
                }}
                render={({ field: { value, onChange } }) => (
                  <FormControl isInvalid={!!errors.note}>
                    <TextArea
                      mt={3}
                      value={value}
                      onChangeText={onChange}
                      autoCompleteType=""
                      placeholder="Additional notes"
                    />
                    <FormControl.ErrorMessage>{errors?.note?.message}</FormControl.ErrorMessage>
                  </FormControl>
                )}
              />

              <Controller
                control={control}
                name="test_file"
                render={({ field: { value, onChange } }) => <FormFileAttachments value={value} onChange={onChange} />}
              />
            </>
          )}
        </Box>

        <Button my={4} bottom={0} onPress={handleSubmit(onSubmit)}>
          Save
        </Button>
      </KeyboardAwareScrollView>
    </Box>
  );
};

export default FamilyHistoryForm;
