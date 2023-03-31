import React from 'react';

import { Center, Text, VStack } from 'native-base';

import AnalyzingIllustration from '../assets/analyzing-illustration.svg';

const Analyzing = () => {
  return (
    <Center flex={1} _light={{ bg: 'white' }} _dark={{ bg: 'coolGray.800' }}>
      <VStack space="2">
        <Text textAlign="center" fontSize="lg">
          We’re analyzing your answers...
        </Text>
        <Center>
          <AnalyzingIllustration />
        </Center>
      </VStack>
    </Center>
  );
};

export default Analyzing;
