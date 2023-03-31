import React, { useState } from 'react';
import { Box, Button, Modal, Text } from 'native-base';

import HealthRecordImage from '@assets/images/health-record.svg';

const HealthRecordsIntroModal = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => setIsOpen(false);

  return (
    <Modal onClose={handleClose} isOpen={isOpen} px="25px">
      <Modal.Content p="4" width="full">
        <Modal.CloseButton onPress={handleClose} />
        <Box mt="12" alignItems="center" paddingX="19px">
          <HealthRecordImage />
          <Text
            marginY="10px"
            fontWeight="bold"
            fontSize="lg"
            _light={{
              color: '#3D3D3D',
            }}
          >
            Health Records
          </Text>
          <Text
            marginY="10px"
            fontWeight="extrabold"
            fontSize="sm"
            _light={{
              color: '#3D3D3D',
            }}
          >
            Get a complete picture of your health by consolidating all your medical records, lab results, procedures and
            medications. All securely stored and managed by you.
          </Text>
          <Button
            width="full"
            _light={{
              backgroundColor: '#082787',
              height: '45px',
            }}
            onPress={handleClose}
          >
            OK!
          </Button>
        </Box>
      </Modal.Content>
    </Modal>
  );
};

export default HealthRecordsIntroModal;
