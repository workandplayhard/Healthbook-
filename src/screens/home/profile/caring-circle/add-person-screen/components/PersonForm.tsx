import { useMemo, useState } from 'react';
import { Box, VStack, FormControl, Button, Text, HStack, Avatar, Icon, Image, IconButton } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useForm, type DeepPartial, Controller } from 'react-hook-form';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import theme from 'theme';

import ProfileIcon from '@assets/icons/profile.svg';
import { validationMessages } from 'utils/validationMessages';

import { useCalendarPicker } from '@hooks/useCalendarPicker';

const EMAIL_REGEX =
  /^[a-z0-9!'#$%&*+\/=?^_`{|}~-]+(?:\.[a-z0-9!'#$%&*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-zA-Z]{2,}$/i;

const regEx = /^[a-zA-Z]+$/;

export type PersonFormValues = {
  first_name: string;
  last_name: string;
  relationship: string;
  dob: string;
  sex: string;
  gender: string;
  weight: string;
  height: [string, string];
  race: string;
  occupation: string;
  email: string;
  phone_number: string;
};

type Props = {
  initialValues: DeepPartial<PersonFormValues>;
  onSubmit: (data: PersonFormValues) => void;
};

import ImageCropPicker from 'react-native-image-crop-picker';
import FormInput from 'components/FormInput';
import FormSelect from 'components/FormSelect';
import { useGetOptions } from 'hooks/useOptions';
import { useCurrentUser } from 'hooks/useUsers';
import { Masks } from 'react-native-mask-input';

const usFlag = require('@assets/images/us-flag.png');

const PersonStepperForm: React.FC<Props> = ({ initialValues, onSubmit }) => {
  const { data: options } = useGetOptions();
  const { data: currentUser } = useCurrentUser();

  const { openCalendar } = useCalendarPicker();

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm<PersonFormValues>({
    defaultValues: initialValues,
  });

  const [uri, setUri] = useState<string>();

  const [error, setError] = useState<string>('');

  const initials = useMemo(() => {
    if (initialValues.first_name && initialValues.last_name)
      return (initialValues.first_name[0] + initialValues.last_name[0]).toUpperCase();

    return '';
  }, []);

  const pickPicture = () => {
    ImageCropPicker.openPicker({
      width: 1000,
      height: 1000,
      cropping: true,
    })
      .then(image => {
        if (image.size > 1024 * 1024 * 2) {
          setError('Failed to upload an image. The image maximum size is 2MB.');
        } else {
          setUri(image.path);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <VStack justifyContent="space-between" flex={1} _light={{ bgColor: 'white' }} _dark={{ bgColor: 'coolGray.800' }}>
      <Box safeAreaBottom flexGrow={1} py={4} _light={{ bg: 'white' }} _dark={{ bg: 'coolGray.800' }}>
        <KeyboardAwareScrollView
          bounces={false}
          // eslint-disable-next-line react-native/no-inline-styles
          contentContainerStyle={{ flexGrow: 1 }}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{ flex: 1 }}
        >
          <VStack p="4">
            <Text fontSize="sm">Add any relevant information for this person.</Text>

            <Box justifyContent="center" mt={5}>
              <HStack flex={1} alignItems="center">
                <Avatar
                  bg="gray.600"
                  width="16"
                  mr="5"
                  height="16"
                  source={{ uri: uri }}
                  _text={{
                    fontSize: '3xl',
                    fontWeight: 'medium',
                  }}
                >
                  <Avatar.Badge
                    width="6"
                    height="6"
                    bgColor="tertiary.600"
                    borderWidth={0}
                    alignSelf="flex-end"
                    right={6}
                    bottom={-8}
                    alignItems="center"
                    justifyContent="center"
                    _light={{ backgroundColor: 'primary.600' }}
                    _dark={{ backgroundColor: 'tertiary.600' }}
                  >
                    <Icon as={MaterialIcons} name="edit" color="white" size="xs" onPress={() => pickPicture()} />
                  </Avatar.Badge>
                  {!uri && !!initials ? initials : <ProfileIcon />}
                </Avatar>

                <Box>
                  <Text fontSize="sm" fontWeight="600" py="2">
                    Profile Picture
                  </Text>

                  <VStack _text={{ color: theme.colors.dustyGray[500] }}>
                    <Text fontSize="xs" lineHeight="sm" color={theme.colors.dustyGray[500]}>
                      Format: JPG or PNG
                    </Text>
                    <Text fontSize="xs" lineHeight="sm" color={theme.colors.dustyGray[500]}>
                      Maximum file size: 2MB
                    </Text>
                    <Text fontSize="xs" lineHeight="sm" color={theme.colors.dustyGray[500]}>
                      Ideal size: at least 200x200 pixels
                    </Text>
                  </VStack>
                </Box>
              </HStack>

              <FormControl isInvalid={!!error} justifyContent="center">
                <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>
              </FormControl>
            </Box>

            <Controller
              control={control}
              name="first_name"
              rules={{
                maxLength: { value: 30, message: 'Exceeds max length of 30' },
                required: { value: true, message: validationMessages.required },
                pattern: {
                  value: regEx,
                  message: 'Only alphabets should be contained.',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl isInvalid={Boolean(errors.first_name)} mt={5}>
                  <FormInput
                    isRequired
                    autoCapitalize="words"
                    label="First Name"
                    maxLength={30}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    defaultValue={value}
                    value={value}
                  >
                    <FormControl.ErrorMessage>{errors.first_name?.message}</FormControl.ErrorMessage>
                  </FormInput>
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name="last_name"
              rules={{
                maxLength: { value: 30, message: 'Exceeds max length of 30' },
                required: { value: true, message: validationMessages.required },
                pattern: {
                  value: regEx,
                  message: 'Only alphabets should be contained.',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl isInvalid={Boolean(errors.last_name)}>
                  <FormInput
                    isRequired
                    autoCapitalize="words"
                    label="Last Name"
                    maxLength={30}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    defaultValue={value}
                    value={value}
                  >
                    <FormControl.ErrorMessage>{errors.last_name?.message}</FormControl.ErrorMessage>
                  </FormInput>
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name="relationship"
              rules={{
                required: { value: true, message: validationMessages.required },
              }}
              render={({ field: { onChange, value } }) => (
                <FormControl isInvalid={Boolean(errors.relationship)} flex={1}>
                  <FormSelect
                    label="Relationship to me"
                    defaultValue={value}
                    selectedValue={value}
                    onValueChange={onChange}
                    options={
                      options?.relationship.map(({ key, value }) => ({
                        label: value,
                        value: key,
                      })) || []
                    }
                  >
                    <FormControl.ErrorMessage>{errors.relationship?.message}</FormControl.ErrorMessage>
                  </FormSelect>
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name="dob"
              rules={{
                required: { value: true, message: validationMessages.required },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl isInvalid={Boolean(errors.dob)} flex={1}>
                  <FormInput
                    isRequired
                    keyboardType="numeric"
                    label="Date of Birth"
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
                    <FormControl.ErrorMessage>{errors.dob?.message}</FormControl.ErrorMessage>
                  </FormInput>
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name="sex"
              rules={{
                required: { value: true, message: validationMessages.required },
              }}
              render={({ field: { onChange, value } }) => (
                <FormControl isInvalid={Boolean(errors.sex)} flex={1}>
                  <FormSelect
                    label="Sex"
                    defaultValue={value}
                    selectedValue={value}
                    onValueChange={onChange}
                    options={
                      options?.sex.map(({ key, value }) => ({
                        label: value,
                        value: key,
                      })) || []
                    }
                  >
                    <FormControl.ErrorMessage>{errors.sex?.message}</FormControl.ErrorMessage>
                  </FormSelect>
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, value } }) => (
                <FormControl isInvalid={Boolean(errors.gender)} flex={1}>
                  <FormSelect
                    label="Gender Identity"
                    defaultValue={value}
                    selectedValue={value}
                    onValueChange={onChange}
                    options={
                      options?.gender.map(({ key, value }) => ({
                        label: value,
                        value: key,
                      })) || []
                    }
                  >
                    <FormControl.ErrorMessage>{errors.gender?.message}</FormControl.ErrorMessage>
                  </FormSelect>
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name="weight"
              rules={{
                pattern: {
                  value: currentUser?.imperial_units ? /^\d{1,4}(?:\.\d{1,2})?$/ : /^\d{1,3}(?:\.\d{1,2})?$/,
                  message: 'Not a valid weight',
                },
                validate: {
                  isValidWeight: value => {
                    if (currentUser?.imperial_units) {
                      return parseFloat(value) < 650 || 'Less than 650 lbs';
                    } else {
                      return parseFloat(value) < 300 || 'Less than 300 kg';
                    }
                  },
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl isInvalid={Boolean(errors.weight)}>
                  <FormInput
                    isRequired
                    label="Weight"
                    InputRightElement={<Text mr={2}>{currentUser?.imperial_units ? 'lbs' : 'kg'}</Text>}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    defaultValue={value}
                    value={value}
                  >
                    <FormControl.HelperText>
                      {`Less than ${currentUser?.imperial_units ? '650 lbs' : '300 kg'}`}
                    </FormControl.HelperText>
                  </FormInput>
                </FormControl>
              )}
            />

            <HStack space={3}>
              <Controller
                control={control}
                name="height.0"
                rules={
                  currentUser?.imperial_units
                    ? {
                        max: { value: 8, message: 'Value must be between 0-8' },
                        validate: {
                          isValidHeight: value => {
                            return (
                              !(
                                parseFloat(value) >= 8 ||
                                (parseFloat(value) === 7 && parseFloat(getValues('height.1')) >= 10)
                              ) || 'Less than 7 ft and 10 inches'
                            );
                          },
                        },
                      }
                    : {
                        pattern: {
                          value: /^\d{1}(?:\.\d{1,2})?$/,
                          message: 'Not a valid height.',
                        },
                        max: 2.4,
                      }
                }
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormControl isInvalid={Boolean(errors.height)} flex={1}>
                    <FormInput
                      isRequired
                      autoCapitalize="words"
                      label={`Height in ${currentUser?.imperial_units ? 'feet' : 'meters'}`}
                      InputRightElement={<Text mr={2}>{currentUser?.imperial_units ? 'ft' : 'm'}</Text>}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      defaultValue={value}
                      value={value}
                    >
                      <FormControl.HelperText>
                        {`Less than ${currentUser?.imperial_units ? '7 ft and 10 inches' : '2.4 m'}`}
                      </FormControl.HelperText>
                      <FormControl.ErrorMessage>
                        {errors.height?.type === 'validate' ? 'Invalid height format' : errors.height?.message}
                      </FormControl.ErrorMessage>
                    </FormInput>
                  </FormControl>
                )}
              />

              {currentUser?.imperial_units && (
                <Controller
                  control={control}
                  name="height.1"
                  rules={{
                    max: 11,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <FormControl isInvalid={Boolean(errors.height)} flex={1}>
                      <FormInput
                        isRequired
                        label="Height in inches"
                        InputRightElement={<Text mr={2}>In</Text>}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        defaultValue={value}
                        value={value}
                      >
                        <FormControl.ErrorMessage>{errors.height?.message}</FormControl.ErrorMessage>
                      </FormInput>
                    </FormControl>
                  )}
                />
              )}
            </HStack>

            <Controller
              control={control}
              name="race"
              render={({ field: { onChange, value } }) => (
                <FormControl isInvalid={Boolean(errors.race)} flex={1}>
                  <FormSelect
                    label="Race/Ethnicity"
                    defaultValue={value}
                    selectedValue={value}
                    onValueChange={onChange}
                    options={
                      options?.race.map(({ key, value }) => ({
                        label: value,
                        value: key,
                      })) || []
                    }
                  >
                    <FormControl.ErrorMessage>{errors.race?.message}</FormControl.ErrorMessage>
                  </FormSelect>
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name="occupation"
              rules={{
                maxLength: { value: 30, message: 'Exceeds max length of 30' },
                pattern: {
                  value: regEx,
                  message: 'Only alphabets should be contained.',
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <FormControl isInvalid={Boolean(errors.occupation)} flex={1}>
                  <FormInput
                    isRequired
                    label="Occupation"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    defaultValue={value}
                    value={value}
                  >
                    <FormControl.ErrorMessage>{errors.occupation?.message}</FormControl.ErrorMessage>
                  </FormInput>
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name="email"
              rules={{
                maxLength: 30,
                pattern: {
                  value: EMAIL_REGEX,
                  message: 'E-mail must be valid',
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <FormControl isInvalid={Boolean(errors.email)} flex={1}>
                  <FormInput
                    isRequired
                    autoCapitalize="none"
                    label="Email"
                    keyboardType="email-address"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    defaultValue={value}
                    value={value}
                  >
                    <FormControl.ErrorMessage>{errors.email?.message}</FormControl.ErrorMessage>
                  </FormInput>
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name="phone_number"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl isInvalid={Boolean(errors?.phone_number)}>
                  <FormInput
                    keyboardType="phone-pad"
                    label="Phone Number"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    defaultValue={value}
                    value={value}
                    mask={Masks.USA_PHONE}
                    InputLeftElement={
                      <HStack alignItems="center" space={2} ml={2}>
                        <Image source={usFlag} width={6} height={5} resizeMode="contain" alt="flag" />
                        <Text>+1</Text>
                      </HStack>
                    }
                  />
                </FormControl>
              )}
            />

            <Button onPress={handleSubmit(onSubmit)}>Save</Button>
          </VStack>
        </KeyboardAwareScrollView>
      </Box>
    </VStack>
  );
};

export default PersonStepperForm;
