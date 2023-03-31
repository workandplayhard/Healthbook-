import React from 'react';
import {
  Box,
  Text,
  Button,
  Link,
  HStack,
  Icon,
  useDisclose,
} from 'native-base';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { HealthStackScreenProps } from '@navigation/types';

import { ConfirmModal } from '@components/ConfirmModal';
import { useBackHandler } from '@hooks/useBackHandler';
import { useCancelAppointment } from '@hooks/useTelehealth';

export const BookAppointmentScreen: React.FC<
  HealthStackScreenProps<'BookAppointmentScreen'>
> = ({
  navigation,
  route: {
    params: { appointmentDetails, providerSpeciality },
  },
}) => {
  const {
    isOpen: isConfirmationModalOpen,
    onOpen: openConfirmationModal,
    onClose: closeConfirmationModal,
  } = useDisclose();

  const handleReschedule = () => {
    navigation.navigate('ProviderDetailScreen', {
      provider: {
        date: appointmentDetails?.appointment_date,
        provider_type: providerSpeciality,
        provider_id: appointmentDetails?.provider_id,
      },
      update: true,
      currentAppointmentDetails: appointmentDetails,
    });
  };

  const { mutate: cancelAppointment, isLoading: isCancelLoader } =
    useCancelAppointment();
  //Added the static values for testing the API, will be removed once the data received from Provider Details page.
  const onCancelAppointment = () => {
    const data = {
      provider_id: appointmentDetails?.provider_id,
      availability_det_id: appointmentDetails?.availability_det_id,
      cancellation_notes: 'Due to some urgent call, I need to cancel', // It will remain static as there is no field for entering the cancellation notes both in mobile and web design.
      appointment_date: appointmentDetails?.appointment_date,
      is_cancel_from_provider: false,
    };

    cancelAppointment(
      { data },
      {
        onError: error => {
          console.log('error.message', error.message);
        },
        onSuccess: () => {
          closeConfirmationModal();
          navigation.popToTop();
          navigation.navigate('TabNavigator', {
            screen: 'HomeTab',
            params: { screen: 'Dashboard' },
          });
        },
      },
    );
  };
  useBackHandler(() => {
    // we need to stop android default button
    return true;
  });
  return (
    <Box
      flex={1}
      _dark={{ backgroundColor: 'coolGray.900' }}
      _light={{ backgroundColor: 'primary.600' }}
    >
      <Box
        flex={1}
        marginTop={20}
        borderTopRadius="16px"
        _dark={{ backgroundColor: 'coolGray.800' }}
        _light={{ backgroundColor: 'white' }}
        px={4}
      >
        <Link
          onPress={() => {
            navigation.navigate('TabNavigator', {
              screen: 'HomeTab',
              params: { screen: 'Dashboard' },
            });
            navigation.popToTop();
          }}
          paddingTop="24px"
          paddingBottom="27px"
        >
          <Text
            _light={{ color: 'primary.600' }}
            _dark={{ color: 'tertiary.600' }}
            fontWeight={700}
            fontSize="sm"
            color="primary.600"
          >
            Close
          </Text>
        </Link>
        <Text
          _dark={{ color: 'dustyGray.500' }}
          _light={{ color: 'dustyGray.900' }}
        >
          Event
        </Text>
        <Text
          _dark={{ color: 'white' }}
          _light={{ color: 'dustyGray.900' }}
          fontWeight={700}
          fontSize="xl"
        >
          Telehealth Meeting
        </Text>
        <Text
          _dark={{ color: 'dustyGray.500' }}
          _light={{ color: 'dustyGray.900' }}
          paddingTop={'18px'}
        >
          Date
        </Text>
        <Text
          _dark={{ color: 'white' }}
          _light={{ color: 'dustyGray.900' }}
          fontWeight={700}
          fontSize="xl"
        >
          {appointmentDetails?.appointment_date}
        </Text>
        <Text
          _dark={{ color: 'dustyGray.500' }}
          _light={{ color: 'dustyGray.900' }}
          paddingTop={'18px'}
        >
          Provider
        </Text>
        <Text
          _dark={{ color: 'white' }}
          _light={{ color: 'dustyGray.900' }}
          fontWeight={700}
          fontSize="xl"
        >
          {appointmentDetails?.provider_name}
        </Text>
        {/* <Text paddingTop={'18px'} fontSize={'14px'}>
          Notify Me
        </Text>
        <HStack alignItems="center">
          <Text fontWeight={'bold'}>ON</Text>
          <Switch size="sm" />
          <Text fontWeight={'bold'}>OFF</Text>
        </HStack> */}
        <Text
          _dark={{ color: 'dustyGray.500' }}
          _light={{ color: 'dustyGray.900' }}
          paddingTop={'18px'}
          fontSize="sm"
        >
          Additional Notes
        </Text>
        <Text
          _dark={{ color: 'dustyGray.300' }}
          _light={{ color: 'dustyGray.900' }}
          fontSize="sm"
        >
          {appointmentDetails?.additional_notes}
        </Text>
        <Text
          _dark={{ color: 'dustyGray.500' }}
          _light={{ color: 'dustyGray.900' }}
          paddingTop={'18px'}
          fontSize="sm"
        >
          Instructions
        </Text>
        <Text
          _dark={{ color: 'dustyGray.300' }}
          _light={{ color: 'dustyGray.900' }}
          fontSize="sm"
        >
          At the scheduled time, select ENTER WAITING ROOM and your web browser
          will open to your provider’s waiting room. Follow the instructions
          there and wait for your provider to start the telehealth meeting.
        </Text>
        <HStack paddingTop={'18px'} justifyContent={'space-between'}>
          <Link onPress={handleReschedule}>
            <Text
              fontWeight={700}
              _light={{ color: 'primary.600' }}
              _dark={{ color: 'tertiary.600' }}
            >
              Reschedule
            </Text>
          </Link>
          <Link
            onPress={() => {
              openConfirmationModal();
            }}
          >
            <Text
              fontWeight={700}
              _light={{ color: 'primary.600' }}
              _dark={{ color: 'tertiary.600' }}
            >
              Cancel Meeting
            </Text>
          </Link>
        </HStack>
        <Button
          height="45px"
          marginTop="50px"
          _light={{ bg: 'primary.600' }}
          _dark={{ bg: 'tertiary.600' }}
        >
          <HStack>
            <Icon
              size="5"
              as={MaterialIcons}
              name="sensor-door"
              _light={{ color: 'primary.100' }}
              _dark={{ color: 'dustyGray.500' }}
              marginRight="12px"
            />
            <Text fontWeight="bold" color="coolGray.50">
              ENTER WAITING ROOM
            </Text>
          </HStack>
        </Button>
      </Box>
      <ConfirmModal
        isOpen={isConfirmationModalOpen}
        onClose={closeConfirmationModal}
        onSubmit={() => {
          onCancelAppointment();
        }}
        cancelButtonName="NO"
        loader={isCancelLoader}
        submitButtonName="YES, CANCEL IT"
        buttonSize="xs"
        size="lg"
      >
        <Text textAlign="center">
          Are you sure you want to cancel this meeting?
        </Text>
      </ConfirmModal>
    </Box>
  );
};
export default BookAppointmentScreen;
