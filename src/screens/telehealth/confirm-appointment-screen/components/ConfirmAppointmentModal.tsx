import React from 'react';
import { Text, Link } from 'native-base';
import { ConfirmModal } from '@components/ConfirmModal';

type modalProps = {
  isModalOpen?: boolean;
  onProceed: () => void;
  closeModal: () => void;
  openPdf: () => void;
  payload?: {
    name?: string;
    date?: string;
    slot?: string;
  };
};

export const ConfirmAppointmentModal: React.FC<modalProps> = ({
  isModalOpen = false,
  closeModal,
  onProceed,
  openPdf,
  payload,
}) => {
  return (
    <ConfirmModal
      isOpen={isModalOpen}
      onClose={closeModal}
      onSubmit={() => {
        onProceed();
      }}
      submitButtonName="PROCEED"
      size="xl"
    >
      <Text textAlign="center">
        During the telehealth meeting, your personal health information may be
        securely shared with the provider.
        <Link
          isUnderlined={false}
          onPress={() => {
            closeModal();
            openPdf();
          }}
        >
          <Text
            _dark={{ color: 'tertiary.600' }}
            _light={{ color: 'primary.800' }}
            fontWeight="bold"
          >
            View Privacy Policy
          </Text>
        </Link>
      </Text>
    </ConfirmModal>
  );
};
