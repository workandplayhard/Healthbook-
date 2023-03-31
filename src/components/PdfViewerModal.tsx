import React from 'react';
import { IModalProps, Modal, Button, Box, Text } from 'native-base';
import { ThemeComponentSizeType } from 'native-base/lib/typescript/components/types';
import Pdf from 'react-native-pdf';

interface PdfViewerModalProps extends IModalProps {
  onSubmit: () => void;
  cancelButtonName?: string;
  handleClose: () => void;
  pdfURL?: string;
  buttonSize?: ThemeComponentSizeType<'Button'>;
  submitButtonName?: string;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen = false,
  children,
  handleClose,
  onSubmit,
  pdfURL,
  cancelButtonName = 'Cancel',
  submitButtonName = 'Proceed',
  buttonSize = 'sm',
  ...props
}) => {
  const source = {
    uri: pdfURL,
    cache: true,
  };
  return (
    <Modal isOpen={isOpen} flex={1} safeAreaTop={true} {...props}>
      <Modal.Content flex={1}>
        <Modal.Header height={'48px'}>
          <Text height={'30px'} fontWeight={'bold'} fontSize={'sm'}>
            Privacy Policy
          </Text>
          <Modal.CloseButton height={'30px'} onPress={handleClose} />
        </Modal.Header>
        <Box bg={'red'} p={4} flex={1}>
          <Pdf trustAllCerts={false} source={source} style={{ flex: 1 }} />
        </Box>
        <Modal.Footer borderTopWidth={0} padding="16px">
          <Button.Group space={4} w="full">
            <Button
              size={buttonSize}
              flex={1}
              variant={'outline'}
              onPress={handleClose}
            >
              {cancelButtonName.toUpperCase()}
            </Button>
            <Button size={buttonSize} flex={1} onPress={onSubmit}>
              {submitButtonName.toUpperCase()}
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
