import React from 'react';

import { useNavigation } from '@react-navigation/core';
import { Box, Button, Center, Text, VStack } from 'native-base';

import ThankYouCheck from '../assets/thank-you-check.svg';

const ThankYou = () => {
  const navigation = useNavigation();

  return (
    <Box flex={1} _light={{ bg: 'white' }} _dark={{ bg: 'coolGray.800' }} pt="1/3">
      <VStack p="4" space="4">
        <VStack space="4">
          <Center>
            <ThankYouCheck />
          </Center>
          <Text textAlign="center" fontWeight="bold" fontSize="lg">
            Thanks for your responses
          </Text>
          <Text fontSize="sm">
            If you ever experience symptoms of depression, you can proceed to Health Check and share this information
            with your healthcare provider
          </Text>
        </VStack>
        <Button w="full" onPress={navigation.goBack}>
          Ok
        </Button>
      </VStack>
    </Box>
  );
};

export default ThankYou;
