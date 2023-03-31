import React, { useState } from 'react';
import { Box, useDisclose } from 'native-base';
import moment from 'moment';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { useNavigation } from '@react-navigation/native';
import {
  HealthStackScreenProps,
  RootStackNavigationProps,
} from '@navigation/types';
import { useBookAppointment } from '@hooks/useTelehealth';
import { useUpdateAppointment } from '@hooks/useTelehealth';
import { UIComponent } from './components/UIComponent';
import { PdfViewerModal } from '@components/PdfViewerModal';
import { ButtonComponent } from './components/ButtonComponent';
import { ConfirmAppointmentModal } from './components/ConfirmAppointmentModal';
import { useCurrentUser } from 'hooks/useUsers';

type AppointmentDataType = {
  provider_id: number | undefined;
  availability_det_id: number | undefined;
  cancellation_notes: string | undefined;
  appointment_date: string | undefined;
  provider_name: string | undefined;
  additional_notes: string | undefined;
};

export const ConfirmAppointmentScreen: React.FC<
  HealthStackScreenProps<'ConfirmAppointmentScreen'>
> = ({
  route: {
    params: { payloadData, update, oldAvailabilityDetId, oldAppointmentDate },
  },
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<RootStackNavigationProps>();
  const {
    isOpen: isConfirmationModalOpen,
    onOpen: openConfirmationModal,
    onClose: closeConfirmationModal,
  } = useDisclose();

  const {
    isOpen: isPdfViewModalOpen,
    onOpen: openPdfViewModal,
    onClose: closePdfViewModal,
  } = useDisclose();

  const [notes, setNotes] = useState('');

  const { mutate: updateAppointment, isLoading: updateLoader } =
    useUpdateAppointment();

  const { mutate: confirmAppointment, isLoading: isAppointmentConfirmLoader } =
    useBookAppointment();

  const { data: CompleteUserData } = useCurrentUser();

  const bookAppointmentPayload = {
    patient: CompleteUserData?.roles?.patient,
    provider_id: payloadData?.providerId,
    availability_det_id: payloadData?.slots?.availability_det_id,
    provider_name: payloadData?.name,
    provider_speciality: payloadData?.speciality,
    provider_credentials: payloadData?.credentials,
    appointment_date: payloadData?.date,
    appointment_end_time: moment(payloadData?.slots?.end_time, 'h:mm A').format(
      'HH:mm:ss',
    ),
    appointment_time: moment(payloadData?.slots?.start_time, 'h:mm A').format(
      'HH:mm:ss',
    ),
    additional_notes: notes,
    video_conference_link: payloadData?.doxyLink,
  };

  const updateAppointmentPayload = {
    old_availability_det_id: oldAvailabilityDetId,
    old_appointment_date: oldAppointmentDate,
    patient: CompleteUserData?.roles?.patient,
    patient_first_name: CompleteUserData?.first_name,
    patient_last_name: CompleteUserData?.last_name,
    appointment_date: payloadData?.date,
    appointment_time: moment(payloadData?.slots?.start_time, 'h:mm A').format(
      'HH:mm:ss',
    ),
    appointment_end_time: moment(payloadData?.slots?.end_time, 'h:mm A').format(
      'HH:mm:ss',
    ),
    provider_id: payloadData?.providerId,
    provider_name: payloadData?.name,
    availability_det_id: payloadData?.slots?.availability_det_id,
    patient_email: CompleteUserData?.email,
    provider_speciality: payloadData?.speciality,
    additional_notes: notes,
    video_conference_link: payloadData?.doxyLink,
  };
  const handleProceed = () => {
    if (update) {
      updateAppointment(updateAppointmentPayload, {
        onError: error => {
          console.log('error.message', error.message);
        },
        onSuccess: response => {
          if (response) {
            const newData = {
              provider_id: payloadData.providerId,
              availability_det_id: payloadData?.slots?.availability_det_id,
              cancellation_notes: 'Due to some urgent call',
              appointment_date: payloadData?.date,
              provider_name: payloadData?.name,
              additional_notes: notes,
            };
            navigation.navigate('BookAppointmentScreen', {
              appointmentDetails: newData,
              providerSpeciality: payloadData?.speciality,
            });
            closeConfirmationModal();
          }
        },
      });
    } else {
      confirmAppointment(bookAppointmentPayload, {
        onError: error => {
          console.log('error.message', error.message);
        },
        onSuccess: response => {
          if (response) {
            closeConfirmationModal();
            navigation.navigate('BookAppointmentScreen', {
              appointmentDetails: response,
              providerSpeciality: payloadData?.speciality,
            });
          }
        },
      });
    }
  };

  const pdfUrlLink =
    'https://healthbookplus.com/wp-content/uploads/2021/12/HealthBook-Privacy-Policy.pdf';
  return (
    <Box
      safeAreaBottom
      flexGrow={1}
      _light={{ bg: 'white' }}
      _dark={{ bg: 'coolGray.800' }}
    >
      <KeyboardAwareScrollView
        bounces={false}
        extraScrollHeight={-insets.bottom}
        // eslint-disable-next-line react-native/no-inline-styles
        contentContainerStyle={{ flexGrow: 1 }}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ flex: 1 }}
      >
        <Box px="4" py="6">
          <ConfirmAppointmentModal
            isModalOpen={isConfirmationModalOpen}
            onProceed={() => {
              handleProceed();
            }}
            closeModal={closeConfirmationModal}
            openPdf={openPdfViewModal}
          />
          <PdfViewerModal
            isOpen={isPdfViewModalOpen}
            handleClose={() => {
              closePdfViewModal();
              openConfirmationModal();
            }}
            onSubmit={() => {
              closePdfViewModal();
              handleProceed();
            }}
            submitButtonName="PROCEED"
            pdfURL={pdfUrlLink}
            size="xl"
          />
          <UIComponent
            changeText={value => {
              setNotes(value);
            }}
            data={payloadData}
            noteValue={notes}
          />
        </Box>
      </KeyboardAwareScrollView>
      <ButtonComponent openModal={openConfirmationModal} />
    </Box>
  );
};
