import React from 'react';
import { Box, HStack, Image, ScrollView, Text, VStack } from 'native-base';

import Illustration from '@assets/images/telehealth-illustration.svg';
import { TelehealthForm } from './components/TelehealthForm';

const TelehealthScreen = () => {
  return (
    <ScrollView>
      <Image
        h="10px"
        w="full"
        alt="colorful-separator"
        source={require('@assets/images/colorful-separator.png')}
      />
      <Box
        p="4"
        height="full"
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.800' }}
      >
        <VStack py="6">
          <HStack justifyContent="center">
            <Illustration />
          </HStack>
          <Text
            pt="2"
            fontSize="2xl"
            textAlign="center"
            _dark={{ color: 'white' }}
            _light={{ color: 'black' }}
          >
            Telehealth
          </Text>
          <Text mt={6} _dark={{ color: 'white' }} _light={{ color: 'black' }}>
            We connect you with the right healthcare provider to help you with
            any medical or mental health condition. Simply choose the type of
            provider you’re looking for and select a date for available times.
          </Text>
        </VStack>
        <TelehealthForm />
      </Box>
    </ScrollView>
  );
};

export default TelehealthScreen;
