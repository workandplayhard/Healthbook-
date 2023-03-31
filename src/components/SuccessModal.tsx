import React from 'react';
import { Button, Modal, Text } from 'native-base';

type SuccessModalProps = {
  isOpen: boolean;
  description: string;
  onSubmit: () => void;
  onClose: () => void;
};

const SuccessModal = ({
  isOpen,
  description,
  onSubmit,
  onClose,
}: SuccessModalProps) => {
  return (
    <Modal
      backdropVisible={true}
      backgroundColor="transparent"
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      safeAreaTop={true}
    >
      <Modal.Content maxWidth="350">
        <Modal.Header h="12" borderBottomWidth={0}>
          <Modal.CloseButton alignItems={'center'} onPress={onClose} />
        </Modal.Header>
        <Modal.Body>
          <Text textAlign="center">{description}</Text>
        </Modal.Body>
        <Modal.Footer borderTopWidth={0} padding="16px">
          <Button flex="1" onPress={onSubmit}>
            OK
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default SuccessModal;
