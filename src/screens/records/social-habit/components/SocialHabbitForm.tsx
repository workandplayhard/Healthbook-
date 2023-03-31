import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  VStack,
  FormControl,
  HStack,
  Icon,
  Button,
  Link,
  Radio,
  View,
} from 'native-base';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import FormInput from '@components/FormInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormTextArea from '@components/FormTextArea';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FormSelect from 'components/FormSelect';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFormStateStore } from 'hooks/useFormStateStore';

import { habitOptions, frequencyOptions } from './data';
import { useHROptions } from 'hooks/useHealthRecord';

export type SocialHabbit = {
  note: string;
  help?: string;
  frequency: string;
  interval: string;
  start_age: string;
  end_age: string;
  category: string;
  specialist_intervention: boolean;
  habit: string;
  private: boolean;
  test_file?: any;
};

type FormProps = {
  initialValues: Partial<SocialHabbit>;
  onSubmit: SubmitHandler<SocialHabbit>;
};

const SocialHabbitForm: React.FC<FormProps> = ({ initialValues, onSubmit }) => {
  const navigation = useNavigation();

  const {
    control,
    formState: { errors, isSubmitSuccessful },
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
  } = useForm<SocialHabbit>({
    defaultValues: {
      help: '',
      start_age: '0',
      end_age: '',
      category: '',
      habit: '',
      frequency: '',
      note: '',
    },
  });

  const { formState, files, setFormState, setFiles }: any = useFormStateStore();
  const { start_age } = getValues();

  // const { mutate: addSocialHabbit, isLoading: addSocialHabbitLoader } = useAddSocialHabbit();
  const [checkHabbit, setCheckHabbit] = useState('');
  const [startAgeCount, setstartAgeCount] = useState('');

  const { data: options = [] } = useHROptions('socialhistory');
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
            What is this habbit related to?
          </Text>
          <Controller
            control={control}
            name="category"
            rules={{
              maxLength: { value: 30, message: 'Exceeds max length of 30' },
              required: { value: true, message: 'This field is required.' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={Boolean(errors?.category)}>
                <FormSelect
                  label="Category"
                  placeholder={'Type'}
                  selectedValue={value}
                  onValueChange={val => {
                    onChange(val);
                    setCheckHabbit(val);
                  }}
                  options={habitOptions}
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
                    {errors.category?.message}
                  </FormControl.ErrorMessage>
                </FormSelect>
              </FormControl>
            )}
          />

          {checkHabbit === 'other' && (
            <Controller
              control={control}
              name="habit"
              rules={{
                required: {
                  value: true,
                  message: 'Email address is required to sign in',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl
                  isInvalid={Boolean(errors.habit)}
                  mt={'8px'}
                  flex={1}
                >
                  <FormInput
                    label={'Habit'}
                    isRequired
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    defaultValue={value}
                    value={value}
                    mb={3}
                  >
                    <FormControl.ErrorMessage>
                      {errors.habit?.message}
                    </FormControl.ErrorMessage>
                  </FormInput>
                </FormControl>
              )}
            />
          )}

          <Text fontSize="sm" color={'3D3D3D'}>
            At what age do you remember starting this habit?
          </Text>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
          >
            <Controller
              control={control}
              name="start_age"
              rules={{
                required: {
                  value: true,
                  message: 'Email address is required to sign in',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TouchableOpacity
                    disabled={true && Number(value) < 1}
                    onPress={() => {
                      onChange(String(Number(value) - 1));
                    }}
                  >
                    <View
                      width="24px"
                      height="24px"
                      style={{
                        borderColor:
                          Number(value) > 0 ? '#0476d9' : '#00000061',
                        borderWidth: 2,
                        borderRadius: 12,
                        alignContent: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      <Text
                        fontSize="6xl"
                        color={Number(value) > 0 ? '#0476d9' : '#00000061'}
                        position="absolute"
                        paddingBottom="9px"
                      >
                        -
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <FormControl
                    isInvalid={Boolean(errors.start_age)}
                    mt={'8px'}
                    width="90px"
                    marginX="30px"
                  >
                    <FormInput
                      isRequired
                      autoCapitalize="none"
                      paddingLeft={Number(value) < 10 ? '39px' : '35px'}
                      onBlur={onBlur}
                      onChangeText={val => {
                        onChange(val);
                        setstartAgeCount(val);
                      }}
                      defaultValue={'0'}
                      value={value}
                      labelExisting={false}
                      mb={3}
                    >
                      <FormControl.ErrorMessage>
                        {errors.start_age?.message}
                      </FormControl.ErrorMessage>
                    </FormInput>
                  </FormControl>
                  <TouchableOpacity
                    disabled={true && Number(value) >= 34}
                    onPress={() => {
                      onChange(String(Number(value) + 1));
                    }}
                  >
                    <View
                      width="24px"
                      height="24px"
                      style={{
                        borderColor:
                          Number(value) < 34 ? '#0476d9' : '#00000061',
                        borderWidth: 2,
                        borderRadius: 12,
                        alignContent: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      <Text
                        fontSize="3xl"
                        color={Number(value) < 34 ? '#0476d9' : '#00000061'}
                        position="absolute"
                      >
                        +
                      </Text>
                    </View>
                  </TouchableOpacity>
                </>
              )}
            />
          </Box>

          <Text fontSize="sm" color={'3D3D3D'}>
            Is this habit still ongoing ?
          </Text>
          <Controller
            control={control}
            name="help"
            rules={{
              maxLength: { value: 30, message: 'Exceeds max length of 30' },
              required: { value: true, message: 'This field is required.' },
            }}
            render={({ field: { onChange } }) => (
              <FormControl
                isInvalid={Boolean(errors?.category)}
                display="flex"
                alignItems="center"
              >
                <Radio.Group
                  name="gender"
                  flexDirection="row"
                  onChange={val => onChange(val)}
                >
                  <Radio value="no" colorScheme="pink">
                    <Text mx={1}>No</Text>
                  </Radio>
                  <Radio value="yes" colorScheme="blue" ml="10px">
                    <Text mx={1}>Yes</Text>
                  </Radio>
                </Radio.Group>
              </FormControl>
            )}
          />

          {/* {<><Text fontSize="sm" color={'3D3D3D'}>
            At what age do you remember starting this habit?
          </Text>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
          >
            <Controller
              control={control}
              name="age"
              rules={{
                required: {
                  value: true,
                  message: 'Email address is required to sign in',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TouchableOpacity
                    disabled={true && Number(value) < 1}
                    onPress={() => {
                      onChange(String(Number(value) - 1));
                    }}
                  >
                    <View
                      width="24px"
                      height="24px"
                      style={{
                        borderColor:
                          Number(value) > 0 ? '#0476d9' : '#00000061',
                        borderWidth: 2,
                        borderRadius: 12,
                        alignContent: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      <Text
                        fontSize="6xl"
                        color={Number(value) > 0 ? '#0476d9' : '#00000061'}
                        position="absolute"
                        paddingBottom="9px"
                      >
                        -
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <FormControl
                    isInvalid={Boolean(errors.age)}
                    mt={'8px'}
                    width="90px"
                    marginX="30px"
                  >
                    <FormInput
                      isRequired
                      autoCapitalize="none"
                      paddingLeft={Number(value) < 10 ? '39px' : '35px'}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      defaultValue={'0'}
                      value={value}
                      labelExisting={false}
                      mb={3}
                    >
                      <FormControl.ErrorMessage>
                        {errors.age?.message}
                      </FormControl.ErrorMessage>
                    </FormInput>
                  </FormControl>
                  <TouchableOpacity
                    disabled={true && Number(value) >= 34}
                    onPress={() => {
                      onChange(String(Number(value) + 1));
                    }}
                  >
                    <View
                      width="24px"
                      height="24px"
                      style={{
                        borderColor:
                          Number(value) < 34 ? '#0476d9' : '#00000061',
                        borderWidth: 2,
                        borderRadius: 12,
                        alignContent: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      <Text
                        fontSize="3xl"
                        color={Number(value) < 34 ? '#0476d9' : '#00000061'}
                        position="absolute"
                      >
                        +
                      </Text>
                    </View>
                  </TouchableOpacity>
                </>
              )}
            />
          </Box>
          </>
          } */}

          <Text fontSize="sm" color={'3D3D3D'}>
            What was the main reason of your visit?
          </Text>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Controller
              control={control}
              name="frequency"
              rules={{
                maxLength: { value: 30, message: 'Exceeds max length of 30' },
                required: { value: true, message: 'This field is required.' },
              }}
              render={({ field: { onChange, value } }) => (
                <FormControl isInvalid={Boolean(errors?.frequency)} flex={0.48}>
                  <FormSelect
                    placeholder={'Frequency'}
                    selectedValue={value}
                    onValueChange={onChange}
                    options={(options.frequency || []).map(
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
                      {errors.frequency?.message}
                    </FormControl.ErrorMessage>
                  </FormSelect>
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name="interval"
              rules={{
                maxLength: { value: 30, message: 'Exceeds max length of 30' },
                required: { value: true, message: 'This field is required.' },
              }}
              render={({ field: { onChange, value } }) => (
                <FormControl isInvalid={Boolean(errors?.interval)} flex={0.48}>
                  <FormSelect
                    placeholder={'Interval'}
                    selectedValue={value}
                    onValueChange={onChange}
                    options={(options.interval || []).map(
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
                      {errors.interval?.message}
                    </FormControl.ErrorMessage>
                  </FormSelect>
                </FormControl>
              )}
            />
          </Box>

          <Text fontSize="sm" color={'3D3D3D'}>
            Have you received any help from specialists regarding this habit?
          </Text>
          <Controller
            control={control}
            name="help"
            rules={{
              maxLength: { value: 30, message: 'Exceeds max length of 30' },
              required: { value: true, message: 'This field is required.' },
            }}
            render={({ field: { onChange } }) => (
              <FormControl
                isInvalid={Boolean(errors?.category)}
                display="flex"
                alignItems="center"
              >
                <Radio.Group
                  name="gender"
                  flexDirection="row"
                  onChange={val => onChange(val)}
                >
                  <Radio value="no" colorScheme="pink">
                    <Text mx={1}>No</Text>
                  </Radio>
                  <Radio value="yes" colorScheme="blue" ml="10px">
                    <Text mx={1}>Yes</Text>
                  </Radio>
                </Radio.Group>
              </FormControl>
            )}
          />

          <Text fontSize={'sm'} mt="10px">
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
          <HStack>
            <Icon
              size="5"
              color="primary.600"
              as={AntDesign}
              marginRight={4}
              name="clouduploado"
            />
            <Link>
              <Text
                fontWeight={'bold'}
                _light={{ color: 'primary.600' }}
                _dark={{ color: 'tertiary.600' }}
              >
                Upload an attachment
              </Text>
            </Link>
          </HStack>
          <Button
            variant="solid"
            size="lg"
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

export default SocialHabbitForm;
