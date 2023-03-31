import React from 'react';
import { Box, HStack, Button, Text } from 'native-base';

import { useCurrentUser } from '@hooks/useUsers';

type WelcomeProps = {
  onNoPress?: () => void;
  onYesPress?: () => void;
};

const Welcome = ({ onNoPress, onYesPress }: WelcomeProps) => {
  const { data: currentUser } = useCurrentUser();

  return (
    <Box>
      <Box
        px="4"
        py="4"
        _light={{ background: 'primary.600' }}
        _dark={{ background: 'coolGray.900' }}
      >
        <Box mb="2">
          <Text color="white" fontWeight="bold" fontSize="lg">
            Welcome {currentUser?.first_name}
          </Text>
          <Text mt="1" color="white" fontSize="sm">
            Do you or a family member have any immediate health concerns?
          </Text>
        </Box>
        <HStack space="4">
          <Button
            variant="outline"
            _light={{
              borderColor: 'white',
              backgroundColor: 'primary.600',
              _text: { color: 'white' },
            }}
            onPress={onNoPress}
          >
            NO
          </Button>
          <Button
            variant="outline"
            _light={{
              borderColor: 'white',
              backgroundColor: 'primary.600',
              _text: { color: 'white' },
            }}
            onPress={onYesPress}
          >
            YES
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

export default Welcome;
