import React from 'react';
import { Modal, Box, Text, Button, ScrollView } from 'native-base';
import ConnectHealthIcon from '@assets/icons/connected-health.svg';

type ConnectedHealthIntroModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ConnectedHealthIntroModal: React.FC<ConnectedHealthIntroModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} px="35px" onClose={onClose}>
      <Modal.Content width="full" _dark={{ backgroundColor: '#111827' }}>
        <Modal.CloseButton onPress={onClose} />
        <ScrollView
          mt={16}
          contentContainerStyle={{
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          <ConnectHealthIcon />
          <Text
            marginY="10px"
            fontWeight="bold"
            fontSize="xl"
            _light={{
              color: '#3D3D3D',
            }}
          >
            Connected Health
          </Text>
          <Text
            fontSize="14px"
            fontWeight={500}
            _light={{
              color: 'red',
              backgroundColor: 'white',
            }}
            _dark={{
              color: 'dustyGray.100',
              backgroundColor: '#111827',
            }}
          >
            HealthBook+ allows you to connect and aggregate all your electronic
            health information using standardized health data formats. Get a
            complete picture of your health by consolidating all your medical
            records, lab results, procedures, medications and insurance claims.
            HealthBook+ creates a seamless experience across all your data to
            provide your next best health action.
          </Text>
          <Button
            my="10px"
            backgroundColor="#082787"
            onPress={onClose}
            w="full"
            _dark={{ backgroundColor: 'tertiary.600' }}
          >
            OK!
          </Button>
        </ScrollView>
      </Modal.Content>
    </Modal>
  );
};

export default ConnectedHealthIntroModal;
