import React from 'react';
import { Box, Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import type { RootStackNavigationProps } from '@navigation/types';

type ButtonProps = {
  openModal: () => void;
};

export const ButtonComponent: React.FC<ButtonProps> = ({ openModal }) => {
  const navigation = useNavigation<RootStackNavigationProps>();
  return (
    <Box>
      <Button.Group p="4" space="2">
        <Button variant="outline" onPress={navigation.goBack}>
          CANCEL
        </Button>
        <Button flex={3} variant="solid" onPress={openModal}>
          BOOK MEETING
        </Button>
      </Button.Group>
    </Box>
  );
};
