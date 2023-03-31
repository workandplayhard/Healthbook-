import React, { useEffect, useState, useDeferredValue } from 'react';
import {
  Box,
  Button,
  Text,
  FormControl,
  VStack,
  Icon,
  useColorMode,
  Input,
  Select,
  IconButton,
  SmallCloseIcon,
  HStack,
} from 'native-base';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import FormInput from '@components/FormInput';
import FormTextArea from '@components/FormTextArea';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CloudUploadIcon from '@assets/icons/cloud_upload.svg';
import dayjs from 'dayjs';
import DateTimePicker from '@react-native-community/datetimepicker';
import theme from 'theme';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';

import { Platform } from 'react-native';
import AutoComplete from 'components/AutoComplete';
import { useHRChoices, useHROptions } from 'hooks/useHealthRecord';
import { useFormStateStore } from 'hooks/useFormStateStore';

import FilePresentIcon from '@assets/icons/health_records/file-attachment.svg';

export type SurgeryFormValues = {
  surgery: string;
  implant: string | null;
  date: string;
  complication: string;
  hospital: string;
  histology_report: string | null;
  biopsy: string;
  note: string;
  body_sites: string[];
  test_file: any;
};

type Props = {
  initialValues: Partial<SurgeryFormValues>;
  onSubmit: SubmitHandler<SurgeryFormValues>;
};

const SurgeryForm: React.FC<Props> = ({ initialValues, onSubmit }) => {
  const {
    control,
    reset,
    watch,
    formState: { errors, isSubmitSuccessful },
    handleSubmit,
    setValue,
  } = useForm<SurgeryFormValues>({});
  const navigation = useNavigation();

  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [q, setQ] = useState(initialValues.surgery || '');
  const deferredQ = useDeferredValue(q);
  const [implantUsed, setImplantUsed] = useState<boolean | undefined>(
    initialValues.implant !== undefined ? !!initialValues.implant : undefined,
  );

  const { formState, files, setFormState, setFiles, body_sites, setBodySites } =
    useFormStateStore();

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
    setValue('body_sites', body_sites);
  }, [body_sites]);

  useEffect(() => {
    if (!implantUsed) {
      setValue('implant', null);
    }
  }, [implantUsed]);

  const biopsy = watch('biopsy');
  useEffect(() => {
    if (biopsy !== 'significant-findings-present') {
      setValue('histology_report', null);
    }
  }, [biopsy]);

  const { data: choices = [] } = useHRChoices('surgery', { q: deferredQ });
  const { data: options } = useHROptions('surgery');

  const { colorMode } = useColorMode();

  useEffect(() => {
    const { body_sites = [], ...rest } = initialValues;
    reset(rest);
    setBodySites(body_sites);
  }, [initialValues]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  return (
    <VStack
      flex={1}
      _light={{ bgColor: 'white' }}
      _dark={{ bgColor: 'coolGray.800' }}
    >
      <Box safeAreaBottom flexGrow={1} py={4} px="4">
        <KeyboardAwareScrollView
          // eslint-disable-next-line react-native/no-inline-styles
          contentContainerStyle={{
            flexGrow: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Text mt={2} fontWeight="medium">
            What type of surgery is this?
          </Text>
          <Controller
            control={control}
            name="surgery"
            rules={{
              maxLength: { value: 30, message: 'Exceeds max length of 30' },
              required: {
                value: true,
                message: 'Type of surgery is required.',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <FormControl mt={2}>
                <AutoComplete
                  value={value}
                  onChange={onChange}
                  onQueryChange={setQ}
                  query={q}
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
            What's the date of the surgery?
          </Text>
          <Controller
            control={control}
            name="date"
            rules={{
              maxLength: 30,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl mt={4}>
                <FormInput
                  my={0}
                  label="Date"
                  InputRightElement={
                    <Icon
                      as={MaterialIcons}
                      name="calendar-today"
                      mr="2"
                      height="1/2"
                    />
                  }
                  defaultValue="mm/dd/yyyy"
                  value={value}
                  onFocus={() => setOpenDatePicker(true)}
                  onBlur={onBlur}
                >
                  {openDatePicker && (
                    <DateTimePicker
                      mode="date"
                      display={Platform.OS === 'ios' ? 'compact' : 'calendar'}
                      value={new Date()}
                      maximumDate={new Date()}
                      onChange={e => {
                        setOpenDatePicker(false);
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
                </FormInput>
              </FormControl>
            )}
          />

          <Text fontWeight="medium">Any Complications?</Text>
          <Controller
            control={control}
            name="complication"
            render={({ field: { onChange, value } }) => (
              <FormControl isInvalid={Boolean(errors.complication)} mt={2}>
                <Select selectedValue={value} onValueChange={onChange}>
                  {(options?.complication || []).map(({ key, value }: any) => (
                    <Select.Item key={key} label={value} value={key} />
                  )) || []}
                </Select>
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
              required: { value: true, message: 'Field is required.' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={Boolean(errors.hospital)} mt={2}>
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
            Any other files or notes you'd like to include?
          </Text>

          <Controller
            control={control}
            name="note"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={Boolean(errors.note)} mt={2}>
                <FormTextArea
                  mt={2}
                  placeholder="Additional notes"
                  fontSize={15}
                  autoCapitalize="words"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  defaultValue={value}
                  value={value}
                >
                  <FormControl.ErrorMessage>
                    {errors.note?.message}
                  </FormControl.ErrorMessage>
                </FormTextArea>
              </FormControl>
            )}
          />

          <Button
            variant="unstyled"
            my={6}
            startIcon={
              <CloudUploadIcon
                fill={
                  colorMode === 'light'
                    ? theme.colors.primary[600]
                    : theme.colors.tertiary[600]
                }
              />
            }
            width="full"
            justifyContent="flex-start"
            padding={0}
            _text={{
              fontWeight: 'bold',
              _light: { color: 'primary.600' },
              _dark: { color: 'tertiary.600' },
            }}
            onPress={() => navigation.navigate('ImageUpload')}
          >
            Upload an attachment
          </Button>

          <VStack space={4}>
            {test_file.map((data: any, index) => {
              return (
                <HStack key={index}>
                  <FilePresentIcon
                    fill={
                      colorMode === 'light'
                        ? theme.colors.dustyGray[900]
                        : theme.colors.dustyGray[100]
                    }
                  />
                  <Text
                    flex={1}
                    _light={{ color: 'dustyGray.900' }}
                    _dark={{ color: 'dustyGray.100' }}
                  >
                    {data.name ||
                      data.filename ||
                      data.path.split('/').reverse()[0]}
                  </Text>

                  <IconButton
                    p={1}
                    icon={<SmallCloseIcon />}
                    alignItems="flex-start"
                    _icon={{
                      _dark: { color: 'coolGray.800' },
                      _light: { color: 'white' },
                      size: 'sm',
                      bgColor: 'dustyGray.500',
                      rounded: 'full',
                    }}
                    onPress={() => {
                      setValue('test_file', [
                        ...[...test_file].splice(0, index),
                        ...[...test_file].splice(index + 1, test_file.length),
                      ]);
                    }}
                  />
                </HStack>
              );
            })}
          </VStack>

          <Button onPress={handleSubmit(onSubmit)} mt={12}>
            Save
          </Button>
        </KeyboardAwareScrollView>
      </Box>
    </VStack>
  );
};

export default SurgeryForm;
