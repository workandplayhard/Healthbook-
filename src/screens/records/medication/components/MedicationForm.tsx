import { useState, useEffect } from 'react';
import { Box, Button, FormControl, HStack, Icon, IconButton, Text } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDebounce } from 'use-debounce';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import FormInput from 'components/FormInput';
import FormSelect from 'components/FormSelect';
import NumberInput from './NumberInput';
import { useHRChoices, useHROptions } from 'hooks/useHealthRecord';
import FormFileAttachments from 'components/FormFileAttachments';
import FormTextArea from 'components/FormTextArea';
import { useFormStateStore } from 'hooks/useFormStateStore';
import { NewAutoComplete as AutoComplete } from 'components/AutoComplete';
import { useCalendarPicker } from '@hooks/useCalendarPicker';
import { validationMessages } from 'utils/validationMessages';

const validationSchema = yup.object({
  medication: yup.string().required(validationMessages.required),
  dosage: yup.string().required(validationMessages.required),
  dosage_form: yup.string().required(validationMessages.required),
  concentration: yup.string().required(validationMessages.required),
  unit: yup.string().required(validationMessages.required),
  frequency: yup.string().required(validationMessages.required),
  interval: yup.string().required(validationMessages.required),
  start: yup.string().required(validationMessages.required),
  continuous: yup.boolean().required(validationMessages.required),
  note: yup.string().max(20, validationMessages.max),
  duration_frequency: yup.string().when('continuous', {
    is: false,
    then: schema => schema.required(validationMessages.required),
  }),
  duration_interval: yup.string().when('continuous', {
    is: false,
    then: schema => schema.required(validationMessages.required),
  }),
  medication_stop: yup.boolean().when('continuous', {
    is: false,
    then: schema => schema.required(validationMessages.required),
  }),
  medication_stop_date: yup.string().when('medication_stop', {
    is: true,
    then: schema => schema.required(validationMessages.required),
  }),
  medication_stop_reason: yup.string().when('medication_stop', {
    is: true,
    then: schema => schema.required(validationMessages.required),
  }),
});

export type MedicationFormValues = {
  medication: string;
  dosage: string;
  dosage_form: string;
  concentration: string;
  unit: string;
  frequency: string;
  interval: string;
  start: string;
  continuous: boolean;
  note: string;
  test_file: any;
  duration_frequency: string | null;
  duration_interval: string | null;
  medication_stop_date: string | null;
  medication_stop_reason: string | null;
  medication_stop: boolean | null;
};

type MedicationFormProps = {
  initialValues: Partial<MedicationFormValues>;
  onSubmit: (data: MedicationFormValues) => void;
};

const MedicationForm: React.FC<MedicationFormProps> = ({ initialValues, onSubmit }) => {
  const { formState, setFormState }: any = useFormStateStore();
  const { openCalendar } = useCalendarPicker();

  const {
    control,
    watch,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitSuccessful, errors },
  } = useForm<MedicationFormValues>({
    resolver: yupResolver(validationSchema),
  });

  const continuous = watch('continuous');
  const medication_stop = watch('medication_stop');

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
    reset();
    setFormState(undefined);
  }, [isSubmitSuccessful]);

  const [deferredQ] = useDebounce(watch('medication'), 500);

  const { data: medications = [] } = useHRChoices('medication', {
    q: deferredQ,
  });
  const { data: options = [] } = useHROptions('medication');

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
          <Text fontWeight="medium">What's the medication's name?</Text>
          <Controller
            control={control}
            name="medication"
            render={({ field: { value, onChange } }) => (
              <AutoComplete
                data={medications}
                value={value}
                onChange={onChange}
                error={!!errors.medication}
                helperText={errors.medication?.message}
                dataStructure={{ value: 'label' }}
              />
            )}
          />

          <Text fontWeight="medium" mt={4}>
            What amount do you take each time (e.g. morning or night)
          </Text>
          <HStack mt={4} width="full" alignItems="flex-start" space={4}>
            <Controller
              name="dosage"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormControl isInvalid={!!errors.dosage} flex={1}>
                  <NumberInput value={String(value || '0')} onChange={onChange} />
                  <FormControl.ErrorMessage>{errors.dosage?.message}</FormControl.ErrorMessage>
                </FormControl>
              )}
            />
            <Controller
              name="dosage_form"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormControl isInvalid={!!errors.dosage_form} flex={1}>
                  <FormSelect
                    mb={0}
                    label="Type"
                    selectedValue={value}
                    onValueChange={onChange}
                    options={(options.dosage_form || []).map(({ key, value }: { key: string; value: string }) => ({
                      label: value,
                      value: key,
                    }))}
                  />
                  <FormControl.ErrorMessage>{errors.dosage_form?.message}</FormControl.ErrorMessage>
                </FormControl>
              )}
            />
          </HStack>

          <HStack width="full" alignItems="flex-start" space="4" mt={2}>
            <Controller
              name="concentration"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormControl isInvalid={!!errors.concentration} flex={1}>
                  <FormInput
                    mb={0}
                    label="Amount"
                    placeholder="Enter amount"
                    value={value}
                    defaultValue={String(value)}
                    onChangeText={onChange}
                  />
                  <FormControl.ErrorMessage>{errors.concentration?.message}</FormControl.ErrorMessage>
                </FormControl>
              )}
            />

            <Controller
              name="unit"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormControl isInvalid={!!errors.unit} flex={1}>
                  <FormSelect
                    mb={0}
                    label="Unit"
                    selectedValue={value}
                    onValueChange={onChange}
                    options={(options.unit || []).map(({ key, value }: { key: string; value: string }) => ({
                      label: value,
                      value: key,
                    }))}
                  />
                  <FormControl.ErrorMessage>{errors.unit?.message}</FormControl.ErrorMessage>
                </FormControl>
              )}
            />
          </HStack>
          <Text fontWeight="medium" mt={4}>
            How often do you take the above dosage?
          </Text>
          <HStack mt={4} flexGrow={1} space={4}>
            <Controller
              name="frequency"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormControl isInvalid={!!errors.frequency} flex={1}>
                  <NumberInput value={String(value || '0')} onChange={onChange} />
                  <FormControl.ErrorMessage>{errors.frequency?.message}</FormControl.ErrorMessage>
                </FormControl>
              )}
            />
            <Controller
              name="interval"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormControl isInvalid={!!errors.interval} flex={1}>
                  <FormSelect
                    mb={0}
                    label="Repeat"
                    selectedValue={value}
                    onValueChange={onChange}
                    options={(options.interval || []).map(({ key, value }: { key: string; value: string }) => ({
                      label: value,
                      value: key,
                    }))}
                  />
                  <FormControl.ErrorMessage>{errors.interval?.message}</FormControl.ErrorMessage>
                </FormControl>
              )}
            />
          </HStack>
          <Text fontWeight="medium" mt={4}>
            When did you start this medication?
          </Text>
          <Controller
            name="start"
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <FormControl isInvalid={!!errors.start} mt={4}>
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
          <Text fontWeight="medium" mt={4}>
            Is this continuous therapy?
          </Text>
          <Controller
            name="continuous"
            control={control}
            render={({ field: { value, onChange } }) => (
              <FormControl isInvalid={!!errors.continuous}>
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
                <FormControl.ErrorMessage>{errors.continuous?.message}</FormControl.ErrorMessage>
              </FormControl>
            )}
          />
          {!continuous && continuous !== undefined && (
            <>
              <Text fontWeight="medium" mt={4}>
                What is the therapy duration?
              </Text>
              <HStack width="full" space={4} mt={4}>
                <Controller
                  control={control}
                  name="duration_frequency"
                  render={({ field: { value, onChange } }) => (
                    <FormControl isInvalid={!!errors.duration_frequency} flex={1}>
                      <FormSelect
                        mb={0}
                        label="Frequency"
                        selectedValue={value || ''}
                        onValueChange={onChange}
                        options={(options.duration_frequency || []).map(
                          ({ key, value }: { key: string; value: string }) => ({
                            label: value,
                            value: key,
                          }),
                        )}
                      />
                      <FormControl.ErrorMessage>{errors.duration_frequency?.message}</FormControl.ErrorMessage>
                    </FormControl>
                  )}
                />
                <Controller
                  control={control}
                  name="duration_interval"
                  render={({ field: { value, onChange } }) => (
                    <FormControl isInvalid={!!errors.duration_interval} flex={1}>
                      <FormSelect
                        mb={0}
                        label="Interval"
                        selectedValue={value || ''}
                        onValueChange={onChange}
                        options={(options.duration_interval || []).map(
                          ({ key, value }: { key: string; value: string }) => ({
                            label: value,
                            value: key,
                          }),
                        )}
                      />
                      <FormControl.ErrorMessage>{errors.duration_interval?.message}</FormControl.ErrorMessage>
                    </FormControl>
                  )}
                />
              </HStack>

              <Text fontWeight="medium" mt={4}>
                Did you complete the therapy?
              </Text>
              <Controller
                name="medication_stop"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormControl isInvalid={!!errors.medication_stop}>
                    <Button.Group mt={4} space={4}>
                      <Button variant={value ? 'solid' : 'outline'} onPress={() => onChange(true)} flex={1}>
                        No
                      </Button>
                      <Button
                        variant={value || value === undefined ? 'outline' : 'solid'}
                        onPress={() => onChange(false)}
                        flex={1}
                      >
                        Yes
                      </Button>
                    </Button.Group>
                    <FormControl.ErrorMessage>{errors.medication_stop?.message}</FormControl.ErrorMessage>
                  </FormControl>
                )}
              />

              {medication_stop && medication_stop !== undefined && (
                <>
                  <Text fontWeight="medium" mt={4}>
                    When did you stop taking?
                  </Text>
                  <Controller
                    control={control}
                    name="medication_stop_date"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <FormControl isInvalid={!!errors.medication_stop_date} mt={4}>
                        <FormInput
                          isRequired
                          keyboardType="numeric"
                          label="End Date"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          defaultValue={value || ''}
                          value={value || ''}
                          InputRightElement={
                            <IconButton
                              p={0}
                              mr={2}
                              icon={<Icon as={MaterialIcons} name="calendar-today" />}
                              onPress={() => openCalendar({ value: value || '', onChange })}
                            />
                          }
                        >
                          <FormControl.ErrorMessage>{errors.medication_stop_date?.message}</FormControl.ErrorMessage>
                        </FormInput>
                      </FormControl>
                    )}
                  />

                  <Text fontWeight="medium" mt={4}>
                    Why did you stop?
                  </Text>
                  <Controller
                    name="medication_stop_reason"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <FormControl isInvalid={!!errors.medication_stop_reason} flex={1} mt={4}>
                        <FormSelect
                          mb={0}
                          label="Stop Reason"
                          selectedValue={value || ''}
                          onValueChange={onChange}
                          options={(options.medication_stop_reason || []).map(
                            ({ key, value }: { key: string; value: string }) => ({
                              label: value,
                              value: key,
                            }),
                          )}
                        />
                        <FormControl.ErrorMessage>{errors.medication_stop_reason?.message}</FormControl.ErrorMessage>
                      </FormControl>
                    )}
                  />
                </>
              )}
            </>
          )}

          <Text fontWeight="medium" mt={4}>
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

        <Button my={4} bottom={0} onPress={handleSubmit(onSubmit)}>
          Save
        </Button>
      </KeyboardAwareScrollView>
    </Box>
  );
};

export default MedicationForm;
