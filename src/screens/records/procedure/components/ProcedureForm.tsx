import React, { useEffect, useState, useDeferredValue } from 'react';
import {
  Box,
  Text,
  VStack,
  FormControl,
  HStack,
  Icon,
  Button,
  Input,
  Select,
} from 'native-base';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import dayjs from 'dayjs';

import FormInput from '@components/FormInput';
import FormTextArea from '@components/FormTextArea';
import FormSelect from 'components/FormSelect';
import AutoComplete from 'components/AutoComplete';
import { useFormStateStore } from 'hooks/useFormStateStore';

import DateIcon from '@assets/icons/date.svg';
import FormFileAttachments from 'components/FormFileAttachments';
import { useHRChoices, useHROptions } from 'hooks/useHealthRecord';
import { useDebounce } from 'use-debounce';
import { useNavigation } from '@react-navigation/native';

export type ProcedureFormValues = {
  hospital: string;
  eye: string;
  complication: string;
  procedure: string;
  implant: string;
  date: string;
  note: string;
  body_sites: string[];
  biopsy: string;
  histology_report: string;
  test_file: any;
};

type ProcedureFormProps = {
  initialValues: Partial<ProcedureFormValues>;
  onSubmit: SubmitHandler<ProcedureFormValues>;
};

const ProcedureForm: React.FC<ProcedureFormProps> = ({
  initialValues,
  onSubmit,
}) => {
  const navigation = useNavigation();
  const {
    control,
    formState: { errors, isSubmitSuccessful },
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<ProcedureFormValues>({
    defaultValues: {
      hospital: '',
      eye: '',
      procedure: '',
      implant: '',
      date: '',
      note: '',
      complication: '',
      histology_report: '',
    },
  });
  const { formState, setFormState, body_sites, setBodySites }: any =
    useFormStateStore();
  const [datePicker, setDatePicker] = useState(false);
  const [procedureQuery, setProcedureQuery] = useState(
    initialValues.procedure || '',
  );
  const [deferredQ] = useDebounce(procedureQuery, 500);
  const { data: choices = [] } = useHRChoices('procedure', { q: deferredQ });
  const { data: options } = useHROptions('procedure');

  const [implantUsed, setImplantUsed] = useState<boolean | undefined>(
    initialValues.implant !== undefined ? !!initialValues.implant : undefined,
  );

  const biopsy = watch('biopsy');
  useEffect(() => {
    if (biopsy !== 'significant-findings-present') {
      setValue('histology_report', null);
    }
  }, [biopsy]);

  useEffect(() => {
    if (formState) {
      reset(formState);
    }

    setFormState(undefined);
  }, [formState]);

  useEffect(() => {
    setValue('body_sites', body_sites);
  }, [body_sites]);

  useEffect(() => {
    const { body_sites = [], ...rest } = initialValues;
    reset(rest);
    setBodySites(body_sites);
  }, [initialValues]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setFormState({} as ProcedureFormValues);
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
          <Text mt={2} fontWeight="medium">
            What type of procedure is this?
          </Text>
          <Controller
            control={control}
            name="procedure"
            rules={{
              maxLength: { value: 30, message: 'Exceeds max length of 30' },
              required: { value: true, message: 'This field is required.' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={Boolean(errors?.procedure)} mt={'8px'}>
                <AutoComplete
                  value={value}
                  onChange={onChange}
                  onQueryChange={setProcedureQuery}
                  query={procedureQuery}
                  options={choices.map(({ label, name }) => ({
                    label,
                    value: name,
                  }))}
                />
              </FormControl>
            )}
          />

          <Text mt={4} fontWeight="medium">
            Is there any implant or material involved in the surgery?
          </Text>

          <Button.Group mt={4}>
            <Button
              variant={
                implantUsed || implantUsed === undefined ? 'outline' : 'solid'
              }
              onPress={() => setImplantUsed(false)}
              flex={1}
            >
              No
            </Button>
            <Button
              variant={implantUsed ? 'solid' : 'outline'}
              onPress={() => setImplantUsed(true)}
              flex={1}
            >
              Yes
            </Button>
          </Button.Group>

          {implantUsed && (
            <>
              <Text mt={4} fontWeight="medium">
                What's the name of the implant or material?
              </Text>
              <Controller
                control={control}
                name="implant"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormControl isInvalid={Boolean(errors.implant)} mt={2}>
                    <Input
                      isRequired
                      autoCapitalize="words"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      defaultValue={value}
                      value={value}
                    />
                  </FormControl>
                )}
              />
            </>
          )}

          <Text mt={4} fontWeight="medium">
            What's the date of procedure?
          </Text>
          <Controller
            control={control}
            name="date"
            rules={{
              maxLength: { value: 30, message: 'Exceeds max length of 30' },
              required: { value: true, message: 'This field is required.' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={Boolean(errors?.date)}>
                <FormInput
                  placeHolder="Date"
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
                  labelExisting={false}
                  mb={3}
                  value={value}
                  onFocus={() => setDatePicker(true)}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  height="41px"
                  marginTop={2}
                  paddingLeft="10px"
                  fontWeight={'medium'}
                  fontSize={'sm'}
                />
              </FormControl>
            )}
          />

          <Text fontWeight="medium"> Any complications?</Text>
          <Controller
            control={control}
            name="complication"
            rules={{
              maxLength: { value: 30, message: 'Exceeds max length of 30' },
              required: { value: true, message: 'This field is required.' },
            }}
            render={({ field: { onChange, value } }) => (
              <FormControl
                isInvalid={Boolean(errors?.complication)}
                flex={0.48}
              >
                <FormSelect
                  placeholder={'Select Complication'}
                  selectedValue={value}
                  onValueChange={onChange}
                  options={(options?.complication || []).map(
                    ({ key, value }: any) => ({ label: value, value: key }),
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
                    {errors.complication?.message}
                  </FormControl.ErrorMessage>
                </FormSelect>
              </FormControl>
            )}
          />

          <Text mt={4} fontWeight="medium">
            What healthcare facility was this performed at?
          </Text>
          <Controller
            control={control}
            name="hospital"
            rules={{
              required: {
                value: true,
                message: 'Email address is required to sign in',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl
                isInvalid={Boolean(errors.hospital)}
                mt={'8px'}
                flex={1}
              >
                <FormInput
                  isRequired
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  defaultValue={value}
                  value={value}
                  mb={3}
                  labelExisting={false}
                  placeHolder={'e.g. Massachusetts General Hospital'}
                >
                  <FormControl.ErrorMessage>
                    {errors.hospital?.message}
                  </FormControl.ErrorMessage>
                </FormInput>
              </FormControl>
            )}
          />

          <Text mt={4} fontWeight="medium">
            Are there any associated biopsy results?
          </Text>
          <Controller
            control={control}
            name="biopsy"
            rules={{
              required: { value: true, message: 'Selection is required.' },
            }}
            render={({ field: { onChange, value } }) => (
              <FormControl isInvalid={Boolean(errors.biopsy)} mt={2}>
                <Select selectedValue={value} onValueChange={onChange}>
                  {(options?.histology_report || []).map(
                    ({ key, value }: any) => (
                      <Select.Item key={key} label={value} value={key} />
                    ),
                  ) || []}
                </Select>
              </FormControl>
            )}
          />

          {biopsy === 'significant-findings-present' && (
            <>
              <Text mt={4} fontWeight="medium">
                Enter significant findings?
              </Text>
              <Controller
                control={control}
                name="histology_report"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.histology_report)}
                    mt={2}
                  >
                    <Input
                      isRequired
                      autoCapitalize="words"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      defaultValue={value}
                      value={value}
                    />
                  </FormControl>
                )}
              />
            </>
          )}

          <Button
            variant={'outline'}
            mt={4}
            onPress={() => navigation.navigate('BodyParts')}
          >
            Indicate parts of body
          </Button>

          <Text fontWeight="medium" mt={4}>
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

export default ProcedureForm;
