import { useState } from 'react';
import { Box, Button, FormControl, HStack, Icon, Select, Text, TextArea, IconButton } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useForm, Controller } from 'react-hook-form';
import { useEffect } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FormInput from 'components/FormInput';

import { useHRChoices, useHROptions } from 'hooks/useHealthRecord';
import { useFormStateStore } from 'hooks/useFormStateStore';
import FormFileAttachments from 'components/FormFileAttachments';
import { useCalendarPicker } from '@hooks/useCalendarPicker';
import { useDebounce } from 'use-debounce';
import { NewAutoComplete as AutoComplete } from 'components/AutoComplete';

export type ConditionFormValues = {
  condition: string;
  verification_status: string;
  start: string;
  end: string;
  note: string;
  private: boolean;
  test_file: any;
  start_date_part: string;
  end_date_part: string;
};

type ConditionFormProps = {
  initialValues: Partial<ConditionFormValues>;
  onSubmit: (data: ConditionFormValues) => void;
};

const ConditionForm: React.FC<ConditionFormProps> = ({ initialValues, onSubmit }) => {
  const { formState, setFormState }: any = useFormStateStore();

  const {
    control,
    formState: { errors, isSubmitSuccessful },
    handleSubmit,
    watch,
    reset,
  } = useForm<ConditionFormValues>({
    values: formState,
  });

  const [deferredQ] = useDebounce(watch('condition'), 500);
  const { data: conditions } = useHRChoices('condition', { q: deferredQ });
  const { data: options } = useHROptions('condition');
  const { openCalendar } = useCalendarPicker();

  useEffect(() => {
    reset(initialValues);
  }, [initialValues]);

  useEffect(() => {
    if (formState) {
      reset(formState);
    }

    setFormState(undefined);
  }, [formState]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setFormState({} as ConditionFormValues);
    }
  }, [isSubmitSuccessful]);

  return (
    <Box safeAreaBottom flex={1} _light={{ bgColor: 'white' }} _dark={{ bgColor: 'coolGray.800' }} px={6} pt={8}>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'space-between',
          flexDirection: 'column',
        }}
      >
        <Box>
          <Text fontWeight="medium" fontSize="sm">
            Type of medical condition
          </Text>
          <Controller
            name="condition"
            control={control}
            rules={{
              required: { value: true, message: 'This field is required' },
            }}
            render={({ field: { value, onChange }, formState: { errors } }) => (
              <AutoComplete
                data={conditions || []}
                error={!!errors.condition}
                value={value}
                onChange={onChange}
                helperText={errors.condition?.message}
                dataStructure={{ key: 'name', value: 'name' }}
              />
            )}
          />
          <Text fontWeight="medium" mt={4}>
            How long have you been experiencing this condition?
          </Text>

          <HStack space={4} mt={4}>
            <Controller
              control={control}
              name="start"
              rules={{
                required: { value: true, message: 'This field is required' },
              }}
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
              rules={{
                required: { value: true, message: 'This field is required' },
              }}
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

          <Text fontSize="sm" fontWeight="medium">
            Has this condition been verified by a healthcare practitioner?
          </Text>

          <Controller
            name="verification_status"
            control={control}
            rules={{
              required: { value: true, message: 'This field is required' },
            }}
            render={({ field: { value, onChange }, formState: { errors } }) => (
              <FormControl isInvalid={!!errors.verification_status}>
                <Select mt={2} selectedValue={value} onValueChange={onChange}>
                  {options?.verification_status.map(({ key, value }: { key: string; value: string }) => (
                    <Select.Item key={key} value={key} label={value} />
                  ))}
                </Select>
                <FormControl.ErrorMessage>{errors?.verification_status?.message}</FormControl.ErrorMessage>
              </FormControl>
            )}
          />

          <Text fontWeight="medium" mt={4}>
            Any other files or notes you'd like to include?
          </Text>
          <Controller
            name="note"
            control={control}
            rules={{
              maxLength: {
                value: 200,
                message: 'This field is not allow to exceed 200 characters',
              },
            }}
            render={({ field: { value, onChange }, formState: { errors } }) => (
              <FormControl isInvalid={!!errors.note}>
                <TextArea
                  value={value}
                  onChangeText={onChange}
                  autoCompleteType=""
                  mt={3}
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
        </Box>

        <Button my={4} onPress={handleSubmit(onSubmit)}>
          Save
        </Button>
      </KeyboardAwareScrollView>
    </Box>
  );
};

export default ConditionForm;
