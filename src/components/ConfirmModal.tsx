import React from 'react';
import { IModalProps, Modal, Button, Box } from 'native-base';
import { ThemeComponentSizeType } from 'native-base/lib/typescript/components/types';

interface IProps extends IModalProps {
  children?: JSX.Element | JSX.Element[];
  onSubmit: () => void;
  cancelButtonName?: string;
  buttonSize?: ThemeComponentSizeType<'Button'>;
  submitButtonName?: string;
  loader?: boolean | undefined;
}

export const ConfirmModal: React.FC<IProps> = ({
  isOpen = false,
  onClose,
  children,
  onSubmit,
  cancelButtonName = 'Cancel',
  submitButtonName = 'Proceed',
  buttonSize = 'sm',
  loader,
  ...props
}) => {
  return (
    <Modal isOpen={isOpen} safeAreaTop={true} onClose={onClose} {...props}>
      <Modal.Content>
        <Modal.Header borderBottomWidth={0} h="12">
          <Modal.CloseButton onPress={onClose} />
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer borderTopWidth={0} padding="16px">
          <Button.Group space="4" w="full">
            <Button
              size={buttonSize}
              flex="1"
              variant="outline"
              onPress={onClose}
            >
              {cancelButtonName.toUpperCase()}
            </Button>
            <Button
              isLoading={loader}
              size={buttonSize}
              flex="1"
              onPress={onSubmit}
            >
              {submitButtonName.toUpperCase()}
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
