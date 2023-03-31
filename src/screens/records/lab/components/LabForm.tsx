import React, { useEffect } from 'react';
import { Box, Button, FormControl, HStack, Icon, IconButton, Select, Text, TextArea, useColorMode } from 'native-base';
import { useForm, Controller } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import FormInput from 'components/FormInput';
import FormSelect from 'components/FormSelect';
import FormFileAttachments from 'components/FormFileAttachments';
import { useCalendarPicker } from '@hooks/useCalendarPicker';
import { validationMessages } from 'utils/validationMessages';

const validationSchema = yup.object({
  category: yup.string().required(validationMessages.required),
  date: yup.string().required(validationMessages.required),
  group_test: yup.boolean().required(validationMessages.required),
  within_normal_value: yup.boolean().when('group_test', {
    is: true,
    then: schema => schema.required(validationMessages.required),
  }),
  result: yup.string().when('group_test', {
    is: false,
    then: schema => schema.required(validationMessages.required),
  }),
  units: yup.string().when('group_test', {
    is: false,
    then: schema => schema.required(validationMessages.required),
  }),
  conclusion: yup.string().max(200, validationMessages.max),
  note: yup.string().max(200, validationMessages.max),
});

export type LabFormValues = {
  category: string;
  conclusion: string;
  date: string;
  note: string;
  test_file: any;
  result: string;
  units: string;
  within_normal_value: boolean;
  group_test: boolean;
};

type LabFormProps = {
  onSubmit: (data: LabFormValues) => void;
};

const LabForm: React.FC<LabFormProps> = ({ onSubmit }) => {
  const {
    control,
    watch,
    formState: { errors, isSubmitSuccessful },
    handleSubmit,
    reset,
  } = useForm<LabFormValues>({
    defaultValues: {
      group_test: true,
    },
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful]);

  const isGroupTest = watch('group_test');

  const { colorMode } = useColorMode();
  const { openCalendar } = useCalendarPicker();

  return (
    <Box safeAreaBottom flex={1} _light={{ bgColor: 'white' }} _dark={{ bgColor: 'coolGray.800' }} px={6} pt={8}>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Text fontWeight="medium">Is this a lab test entry or specific entry?</Text>

        <Controller
          control={control}
          name="group_test"
          render={({ field: { value, onChange } }) => (
            <FormControl isInvalid={!!errors.group_test}>
              <Button.Group mt={4}>
                <Button variant={value ? 'solid' : 'outline'} onPress={() => onChange(true)} flex={1}>
                  Group Test
                </Button>
                <Button variant={value ? 'outline' : 'solid'} onPress={() => onChange(false)} flex={1}>
                  Individual Test
                </Button>
              </Button.Group>
              <FormControl.ErrorMessage>{errors.group_test?.message}</FormControl.ErrorMessage>
            </FormControl>
          )}
        />

        <Text fontWeight="medium" mt={4}>
          What test is this for?
        </Text>
        <Controller
          control={control}
          name="category"
          render={({ field: { value, onChange } }) => (
            <FormControl isInvalid={!!errors.category}>
              <Select mt={2} placeholder="Select one"></Select>
              <FormControl.ErrorMessage>{errors.category?.message}</FormControl.ErrorMessage>
            </FormControl>
          )}
        />

        <Text fontWeight="medium" my={4}>
          When was the test performed
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

        {isGroupTest ? (
          <>
            <Text fontWeight="medium" mt={2}>
              Were your results within normal range?
            </Text>
            <Controller
              control={control}
              name="within_normal_value"
              render={({ field: { value, onChange } }) => (
                <FormControl isInvalid={!!errors.within_normal_value}>
                  <Button.Group mt={4}>
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
                  <FormControl.ErrorMessage>{errors.within_normal_value?.message}</FormControl.ErrorMessage>
                </FormControl>
              )}
            />
          </>
        ) : (
          <>
            <Text fontWeight="medium" mt={2}>
              What was your result?
            </Text>

            <HStack mt={4} space={4}>
              <Controller
                control={control}
                name="result"
                render={({ field: { value, onChange } }) => (
                  <FormControl isInvalid={!!errors.result} flex={1}>
                    <FormInput value={value} onChangeText={onChange} label="Result" placeHolder="Enter number">
                      <FormControl.ErrorMessage>{errors.result?.message}</FormControl.ErrorMessage>
                    </FormInput>
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="units"
                render={({ field: { value, onChange } }) => (
                  <FormControl isInvalid={!!errors.units} flex={1}>
                    <FormSelect selectedValue={value} label="Unit" onValueChange={onChange} options={[]}>
                      <FormControl.ErrorMessage>{errors.units?.message}</FormControl.ErrorMessage>
                    </FormSelect>
                  </FormControl>
                )}
              />
            </HStack>
          </>
        )}

        <Text fontWeight="medium" my={4}>
          Any specific conclusions?
        </Text>

        <Controller
          control={control}
          name="conclusion"
          render={({ field: { value, onChange } }) => (
            <FormControl isInvalid={!!errors.conclusion} flex={1}>
              <TextArea value={value} onChangeText={onChange} autoCompleteType="" placeholder="Additional notes" />
              <FormControl.ErrorMessage>{errors.conclusion?.message}</FormControl.ErrorMessage>
            </FormControl>
          )}
        />

        <Text fontWeight="medium" my={4}>
          Any other files or notes you'd like to include?
        </Text>
        <Controller
          control={control}
          name="note"
          render={({ field: { value, onChange } }) => (
            <FormControl isInvalid={!!errors.note} flex={1}>
              <TextArea value={value} onChangeText={onChange} autoCompleteType="" placeholder="Additional notes" />
              <FormControl.ErrorMessage>{errors.note?.message}</FormControl.ErrorMessage>
            </FormControl>
          )}
        />

        <Controller
          control={control}
          name="test_file"
          render={({ field: { value, onChange } }) => <FormFileAttachments value={value} onChange={onChange} />}
        />

        <Button my={4} onPress={handleSubmit(onSubmit)}>
          Save
        </Button>
      </KeyboardAwareScrollView>
    </Box>
  );
};

export default LabForm;
