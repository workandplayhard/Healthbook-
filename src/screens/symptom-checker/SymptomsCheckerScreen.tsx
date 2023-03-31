import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Box, HStack, Image, Text, VStack, Button } from 'native-base';

import Illustration from '@assets/images/symptom-checker-logo.svg';

const SymptomsCheckerScreen = () => {
  const navigation = useNavigation();

  return (
    <>
      <Image h="10px" w="full" alt="colorful-separator" source={require('@assets/images/colorful-separator.png')} />
      <Box p="4" height="full" _light={{ bg: 'white' }} _dark={{ bg: 'coolGray.800' }}>
        <VStack py="6">
          <HStack justifyContent="center">
            <Illustration />
          </HStack>
          <Text
            mt={28}
            fontSize="lg"
            fontWeight="bold"
            fontFamily="heading"
            textAlign="center"
            _dark={{ color: 'white' }}
            _light={{ color: 'black' }}
          >
            Health Check
          </Text>
          <Text mt={6} mb={19} fontSize="md" fontWeight="normal" _dark={{ color: 'white' }} _light={{ color: 'black' }}>
            You’re about to use a short, safe and anonymous health checkup. Your answers will be carefully analyzed and
            you’ll learn about possible causes of your symptoms.
          </Text>

          <Button
            mb={24}
            onPress={() => {
              navigation.navigate('SymptomsQuestionnaire');
            }}
          >
            Start Health Check
          </Button>
        </VStack>
      </Box>
    </>
  );
};

export default SymptomsCheckerScreen;
