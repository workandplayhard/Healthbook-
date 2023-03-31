import React from 'react';
import { Button, Modal, Text, View } from 'native-base';

import { useDeleteDependent } from '@hooks/useDependent';

import getInitials from '@utils/getNameInitials';

type DeleteConfirmationModalProps = {
  isOpen: boolean;
  description: string;
  selectedItem?: any;
  onCancel: () => void;
};

const DeleteConfirmationModal = ({
  isOpen,
  description,
  selectedItem,
  onCancel,
}: DeleteConfirmationModalProps) => {
  const { mutate: deleteDependent } = useDeleteDependent();
  const handleSave = () => {
    deleteDependent(selectedItem?.dependent_id, {
      onSuccess: onCancel,
    });
  };

  const name = selectedItem?.first_name + ' ' + selectedItem?.last_name;

  return (
    <Modal
      backdropVisible={true}
      backgroundColor="transparent"
      isOpen={isOpen}
      onClose={onCancel}
      size="xl"
      safeAreaTop={true}
    >
      <Modal.Content maxWidth="350">
        <Modal.Header paddingBottom={10} borderBottomWidth={0}>
          <Modal.CloseButton onPress={onCancel} />
        </Modal.Header>
        <Modal.Body>
          {/* {props.pic ? (
            <Image
              source={props.pic}
              alt={'profilePic-Replace'}
              borderRadius={80}
              resizeMethod={'auto'}
              resizeMode={'cover'}
              width={'64px'}
              height={'64px'}
            />
          ) : ( */}
          <View
            width="64px"
            height="64px"
            borderRadius="80"
            backgroundColor="secondary.600"
            alignSelf="center"
            marginBottom="16px"
            justifyContent="center"
          >
            <Text
              fontStyle="normal"
              fontWeight={500}
              textAlign="center"
              fontSize="24px"
              color="white"
            >
              {getInitials(name)}
            </Text>
          </View>

          <Text textAlign="center">{description}</Text>
        </Modal.Body>
        <Modal.Footer borderTopWidth={0}>
          <View
            flexDirection="row"
            flex={1}
            alignItems="center"
            justifyContent="space-around"
          >
            <Button
              fontSize="14px"
              padding={3}
              width="140px"
              onPress={onCancel}
            >
              NO
            </Button>
            <Button
              fontSize="14px"
              padding={3}
              width="140px"
              onPress={handleSave}
            >
              YES, REMOVE
            </Button>
          </View>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default DeleteConfirmationModal;
