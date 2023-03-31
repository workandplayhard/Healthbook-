import React from 'react';
import { Button, HStack, Modal, Text, VStack } from 'native-base';

type DeleteModalProps = {
  isOpen: boolean;
  documentsCnt: number;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
};

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, documentsCnt, onClose, onConfirm, isDeleting }) => {
  const onCloseHandler = isDeleting ? () => {} : onClose;

  return (
    <Modal isOpen={isOpen} onClose={onCloseHandler}>
      <Modal.Content>
        <Modal.Header backgroundColor="primary.600" h={12}>
          <Text color="white">Delete Record</Text>
          <Modal.CloseButton />
        </Modal.Header>
        <VStack p={4} borderBottomWidth="1px" borderBottomColor="dustyGray.300">
          <Text>Are you sure to Delete {documentsCnt} documents?</Text>
          <Text>Shared access will be removed.</Text>
        </VStack>
        <HStack justifyContent="flex-end" py={1}>
          <Button
            variant="ghost"
            _text={{ color: 'black', fontWeight: 500 }}
            py={2}
            onPress={onConfirm}
            isLoading={isDeleting}
          >
            Yes
          </Button>
          <Button variant="ghost" _text={{ color: 'black', fontWeight: 500 }} py={2} onPress={onCloseHandler}>
            Cancel
          </Button>
        </HStack>
      </Modal.Content>
    </Modal>
  );
};

export default DeleteModal;
