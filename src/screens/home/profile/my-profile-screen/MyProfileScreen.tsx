import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { Box, Button, VStack, useColorMode, useToast } from 'native-base';

import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';

import Physician from './components/Physician';
import { Emergency, isAlphabetCheck, isZipCode } from './components/Emergency';
import MyInfo, {
  isHeight1,
  isImperialHeight0,
  isImperialWeight,
  isMetricHeight0,
  isMetricWeight,
  isOccupation,
} from './components/MyInfo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import theme from '@theme';

import { useCurrentUser } from '@hooks/useUsers';
import { useGetPatient, useUpdatePatient } from '@hooks/usePatient';

import type { Patient } from 'services/types';
import StepIndicator from 'react-native-step-indicator';
import { StepIndicatorStyles } from 'react-native-step-indicator/lib/typescript/src/types';
import { useGetOptions } from 'hooks/useOptions';

const labels = ['Info', 'Emergency', 'Physician'];

const scenes = [MyInfo, Emergency, Physician];

const MyProfileScreen = () => {
  const [index, setIndex] = useState(0);
  const { colorMode } = useColorMode();
  const toast = useToast();

  const { data: currentUser } = useCurrentUser();
  const { data: patient } = useGetPatient(currentUser!?.roles.patient, {
    enabled: !!currentUser?.roles?.patient,
  });
  const { data: options } = useGetOptions();

  const { mutate: updatePatient } = useUpdatePatient();

  const methods = useForm<Patient>();

  const handleAddUser: SubmitHandler<Patient> = useCallback(
    values => {
      const {
        height,
        gender,
        sex,
        emergency_state,
        emergency_contact_phone_number,
        personal_doctor_phone_number,
        ...rest
      } = values;

      const h = height as [string, string];

      updatePatient(
        {
          patientId: currentUser!.roles.patient,
          data: {
            ...rest,
            height: `${h[0]}.${h[1] || '0'}`,
            gender:
              options?.gender.find(({ key: itemKey }) => itemKey === gender) ||
              null,
            sex:
              options?.sex.find(({ key: itemKey }) => itemKey === sex) || null,
            emergency_state:
              options?.states.find(
                ({ key: itemKey }) => itemKey === emergency_state,
              ) || null,
            emergency_contact_phone_number: emergency_contact_phone_number
              ? '+1' + emergency_contact_phone_number.replace(/\D/g, '')
              : null,
            personal_doctor_phone_number: personal_doctor_phone_number
              ? '+1' + personal_doctor_phone_number.replace(/\D/g, '')
              : null,
          },
        },
        {
          onSuccess: () => {
            toast.show({
              description: 'Saved successfully.',
              bgColor: 'green.600',
              color: 'white',
            });
          },
        },
      );
    },
    [options, options, updatePatient],
  );

  useEffect(() => {
    if (patient) {
      methods.reset({
        ...patient,
        sex: (patient.sex as { key: string }).key,
        height: patient.height
          ? ((patient.height as number).toString().split('.') as [
              string,
              string,
            ])
          : ['0', '0'],
        weight: patient?.weight?.toString() || '',
        no_children: patient.no_children
          ? patient.no_children.toString()
          : 'None',
        gender: (patient.gender as { key: string } | null)?.key || '',
        emergency_state:
          (patient.emergency_state as { key: string } | null)?.key || '',
        emergency_contact_phone_number:
          patient.emergency_contact_phone_number?.replace('+1', '') || '',
        personal_doctor_phone_number:
          patient.personal_doctor_phone_number?.replace('+1', '') || '',
      });
    }
  }, [methods, patient]);

  const stepperStyle: StepIndicatorStyles = useMemo(
    () => ({
      stepIndicatorLabelFontSize: 12,
      currentStepIndicatorLabelFontSize: 12,
      currentStepLabelColor:
        colorMode === 'dark' ? 'white' : theme.colors.dustyGray[900],
      labelColor: theme.colors.secondary[600],
      stepIndicatorFinishedColor: theme.colors.secondary[600],
      stepIndicatorUnFinishedColor: theme.colors.secondary[600],
      stepIndicatorLabelFinishedColor: 'white',
      stepIndicatorLabelUnFinishedColor: 'white',
      stepIndicatorCurrentColor: 'white',
      stepIndicatorLabelCurrentColor: theme.colors.secondary[600],
      currentStepStrokeWidth: 1,
      stepStrokeCurrentColor: theme.colors.secondary[600],
      stepIndicatorSize: 18,
      currentStepIndicatorSize: 18,
    }),
    [colorMode],
  );

  const handleNext = (index: number) => {
    const weight = methods.control['_formValues']['weight'];
    const height0 = methods.control['_formValues']['height'][0];
    const height1 = methods.control['_formValues']['height'][1];
    const occupation = methods.control['_formValues']['occupation'];
    const firstName =
      methods.control['_formValues']['emergency_contact_first_name'];
    const lastName =
      methods.control['_formValues']['emergency_contact_last_name'];
    const zipCode = methods.control['_formValues']['emergency_zip_code'];
    const address = methods.control['_formValues']['emergency_contact_address'];
    const city = methods.control['_formValues']['emergency_city'];
    const weightValidate = currentUser?.imperial_units
      ? isImperialWeight(weight)
      : isMetricWeight(weight);
    const heightValidate = currentUser?.imperial_units
      ? isImperialHeight0(height0)
      : isMetricHeight0(height0);
    console.log(methods.control['_formValues']);
    const occupationValidate = isOccupation(occupation);
    const firstNameValidation = isAlphabetCheck(firstName);
    const lastNameValidation = isAlphabetCheck(lastName);
    const addressValidation = isAlphabetCheck(address);
    const cityValidation = isAlphabetCheck(city);
    const inchValidation = isHeight1(height1);
    const zipcodeValidation = isZipCode(zipCode);

    if (
      weightValidate &&
      heightValidate &&
      occupationValidate &&
      firstNameValidation &&
      lastNameValidation &&
      addressValidation &&
      cityValidation &&
      inchValidation &&
      zipcodeValidation
    )
      setIndex(index + 1);
    else {
      methods.handleSubmit(handleAddUser)();
    }
  };

  const CurrentScene = useMemo(() => scenes[index], [index]);
  return (
    <FormProvider {...methods}>
      <VStack
        justifyContent="space-between"
        flex={1}
        _light={{ bgColor: 'white' }}
        _dark={{ bgColor: 'coolGray.800' }}
      >
        <Box mt={6}>
          <StepIndicator
            currentPosition={index}
            labels={labels}
            stepCount={3}
            customStyles={stepperStyle}
          />
        </Box>

        <Box
          safeAreaBottom
          flexGrow={1}
          py={4}
          _light={{ bg: 'white' }}
          _dark={{ bg: 'coolGray.800' }}
        >
          <KeyboardAwareScrollView
            bounces={false}
            // eslint-disable-next-line react-native/no-inline-styles
            contentContainerStyle={{ flexGrow: 1 }}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ flex: 1 }}
          >
            <Box px="4" py="4">
              <CurrentScene />
            </Box>
          </KeyboardAwareScrollView>
        </Box>

        <Button.Group pb={6} px={4} width="100%" space={2}>
          {index === 0 ? (
            <></>
          ) : (
            <Button
              p={0}
              flex={1}
              variant="outline"
              height="12"
              onPress={() => setIndex(index => index - 1)}
            >
              BACK
            </Button>
          )}

          {index === 2 ? (
            <Button
              p={0}
              flex={3}
              variant="solid"
              height="12"
              onPress={methods.handleSubmit(handleAddUser)}
            >
              SAVE
            </Button>
          ) : (
            <Button
              p={0}
              flex={3}
              variant="solid"
              height="12"
              onPress={() => handleNext(index)}
            >
              NEXT
            </Button>
          )}
        </Button.Group>
      </VStack>
    </FormProvider>
  );
};

export default MyProfileScreen;
