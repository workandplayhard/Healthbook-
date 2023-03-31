import React, { useState, useDeferredValue, useEffect } from 'react';
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
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import FormTextArea from '@components/FormTextArea';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FormSelect from 'components/FormSelect';

import DateIcon from '@assets/icons/date.svg';
import AutoComplete from 'components/AutoComplete';
import { useHRChoices, useHROptions } from 'hooks/useHealthRecord';
import FormFileAttachments from 'components/FormFileAttachments';

export type MedicalVisitFormValues = {
  professional: string;
  type_of_visit: string;
  reason: string;
  findings: string;
  treatment: string;
  diagnosis: string;
  symptoms: string;
  date: string;
  note: string;
  test_file: any;
};

type FormProps = {
  initialValues: Partial<MedicalVisitFormValues>;
  onSubmit: SubmitHandler<MedicalVisitFormValues>;
};

const MedicalVisitFormValues: React.FC<FormProps> = ({
  initialValues,
  onSubmit,
}) => {
  const {
    control,
    formState: { errors, isSubmitSuccessful },
    handleSubmit,
    reset,
  } = useForm<MedicalVisitFormValues>({
    defaultValues: {
      professional: '',
      type_of_visit: '',
      reason: '',
      diagnosis: '',
      treatment: '',
      findings: '',
      symptoms: '',
      date: '',
      note: '',
    },
  });

  const [datePicker, setDatePicker] = useState(false);

  const [symptomQuery, setSymptomQuery] = useState(
    initialValues.symptoms || '',
  );
  const deferredSymptomQuery = useDeferredValue(symptomQuery);
  const [diagnosisQuery, setDiagnosisQuery] = useState(
    initialValues.diagnosis || '',
  );
  const deferredDiagnosisQuery = useDeferredValue(diagnosisQuery);

  const { data: symptomOptions } = useHRChoices('symptom', {
    q: deferredSymptomQuery,
  });
  const { data: diagnosisOptions } = useHRChoices('condition', {
    q: deferredDiagnosisQuery,
  });
  const { data: options } = useHROptions('medicalvisit');

  useEffect(() => {
    reset(initialValues);
  }, [initialValues]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  return (
    <Box safeAreaBottom p={4} backgroundColor="white">
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
          <Text fontSize="sm" color={'3D3D3D'}>
            Which healthcare provider did you meet with?
          </Text>
          <Controller
            control={control}
            name="professional"
            rules={{
              required: {
                value: true,
                message: 'Email address is required to sign in',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl
                isInvalid={Boolean(errors.professional)}
                mt={'8px'}
                flex={1}
              >
                <FormInput
                  isRequired
                  label="Provider"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  defaultValue={value}
                  value={value}
                  mb={3}
                >
                  <FormControl.ErrorMessage>
                    {errors.professional?.message}
                  </FormControl.ErrorMessage>
                </FormInput>
              </FormControl>
            )}
          />

          <Text fontSize="sm" color={'3D3D3D'}>
            When was the visit?
          </Text>
          <Controller
            control={control}
            name="date"
            rules={{
              required: {
                value: true,
                message: 'Visit date is required to continue',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl
                isInvalid={Boolean(errors?.date)}
                flex={1}
                mt={'8px'}
              >
                <FormInput
                  isRequired
                  label="Visit Date"
                  autoCapitalize="none"
                  keyboardType="default"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  defaultValue={value}
                  value={value}
                  rightElement={
                    <HStack mr="2" alignItems="center" space="2">
                      {datePicker && (
                        <DateTimePicker
                          mode="date"
                          value={new Date()}
                          onChange={e => {
                            setDatePicker(false);
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
                  onFocus={() => setDatePicker(true)}
                  height={'41px'}
                  paddingLeft={'10px'}
                  fontWeight={'medium'}
                  fontSize={'sm'}
                />
              </FormControl>
            )}
          />

          <Text fontSize="sm" color={'3D3D3D'}>
            What type of visit was this?
          </Text>
          <Controller
            control={control}
            name="type_of_visit"
            rules={{
              maxLength: { value: 30, message: 'Exceeds max length of 30' },
              required: { value: true, message: 'This field is required.' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={Boolean(errors?.type_of_visit)}>
                <FormSelect
                  label="Category"
                  placeholder={'Type'}
                  selectedValue={value}
                  onValueChange={onChange}
                  options={(options?.type_of_visit || []).map(
                    ({ key, value }: { key: string; value: string }) => ({
                      label: value,
                      value: key,
                    }),
                  )}
                  height="41px"
                  paddingLeft="10px"
                  fontSize={'sm'}
                  labelExisting={false}
                  fontWeight={'medium'}
                  mb={3}
                  marginTop={2}
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
                    {errors.type_of_visit?.message}
                  </FormControl.ErrorMessage>
                </FormSelect>
              </FormControl>
            )}
          />

          <Text fontSize="sm" color={'3D3D3D'}>
            What was the main reason of your visit?
          </Text>
          <Controller
            control={control}
            name="reason"
            rules={{
              maxLength: { value: 30, message: 'Exceeds max length of 30' },
              required: { value: true, message: 'This field is required.' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={Boolean(errors?.reason)}>
                <FormSelect
                  placeholder={'Reason'}
                  selectedValue={value}
                  onValueChange={onChange}
                  options={(options?.reason || []).map(
                    ({ key, value }: { key: string; value: string }) => ({
                      label: value,
                      value: key,
                    }),
                  )}
                  height="41px"
                  paddingLeft="10px"
                  fontSize={'sm'}
                  labelExisting={false}
                  fontWeight={'medium'}
                  mb={3}
                  marginTop={2}
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
                    {errors.reason?.message}
                  </FormControl.ErrorMessage>
                </FormSelect>
              </FormControl>
            )}
          />

          <Text fontSize="sm" color={'3D3D3D'}>
            What's the primary symptom?
          </Text>
          <Controller
            control={control}
            name="symptoms"
            rules={{
              maxLength: { value: 30, message: 'Exceeds max length of 30' },
              required: { value: true, message: 'This field is required.' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={Boolean(errors?.symptoms)} mt={'8px'}>
                <AutoComplete
                  value={value}
                  onChange={onChange}
                  onQueryChange={setSymptomQuery}
                  query={symptomQuery}
                  options={(symptomOptions || []).map(({ label, name }) => ({
                    label,
                    value: name,
                  }))}
                />
              </FormControl>
            )}
          />

          <Text fontSize="sm" color={'3D3D3D'} mt={'8px'}>
            Any new findings you'd like to note?
          </Text>
          <Controller
            control={control}
            name="findings"
            rules={{
              required: {
                value: true,
                message: 'Email address is required to sign in',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl
                isInvalid={Boolean(errors.findings)}
                mt={'8px'}
                flex={1}
              >
                <FormInput
                  isRequired
                  label="Findings"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  defaultValue={value}
                  value={value}
                  mb={3}
                >
                  <FormControl.ErrorMessage>
                    {errors.findings?.message}
                  </FormControl.ErrorMessage>
                </FormInput>
              </FormControl>
            )}
          />

          <Text fontSize="sm" color={'3D3D3D'}>
            What was the diagnosis made during the visit?
          </Text>
          <Controller
            control={control}
            name="diagnosis"
            rules={{
              maxLength: { value: 30, message: 'Exceeds max length of 30' },
              required: { value: true, message: 'This field is required.' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={Boolean(errors?.diagnosis)} mt={'8px'}>
                <AutoComplete
                  value={value}
                  onChange={onChange}
                  onQueryChange={setDiagnosisQuery}
                  query={diagnosisQuery}
                  options={(diagnosisOptions || []).map(({ label, name }) => ({
                    label,
                    value: name,
                  }))}
                />
              </FormControl>
            )}
          />

          <Text fontSize="sm" color={'3D3D3D'} mt={'8px'}>
            What was the treatment?
          </Text>
          <Controller
            control={control}
            name="treatment"
            rules={{
              required: {
                value: true,
                message: 'Email address is required to sign in',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl
                isInvalid={Boolean(errors.treatment)}
                mt={'8px'}
                flex={1}
              >
                <FormInput
                  isRequired
                  label="Treatment"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  defaultValue={value}
                  value={value}
                  mb={3}
                >
                  <FormControl.ErrorMessage>
                    {errors.treatment?.message}
                  </FormControl.ErrorMessage>
                </FormInput>
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

export default MedicalVisitFormValues;
