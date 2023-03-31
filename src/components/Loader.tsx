import React from 'react';
import {
  IModalProps,
  Modal,
  Button,
  Box,
  HStack,
  Spinner,
  Heading,
} from 'native-base';
import { ActivityIndicator } from 'react-native';
import { ThemeComponentSizeType } from 'native-base/lib/typescript/components/types';

interface IProps extends IModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Loader: React.FC<IProps> = ({
  isOpen = false,
  onClose,
  ...props
}) => {
  return (
    <Modal isOpen={isOpen} safeAreaTop={true} onClose={onClose} {...props}>
      <HStack space={2} justifyContent="center">
        <Spinner accessibilityLabel="Loading posts" />
        <Heading color="primary.500" fontSize="md">
          Loading
        </Heading>
      </HStack>
      ;
    </Modal>
  );
};
