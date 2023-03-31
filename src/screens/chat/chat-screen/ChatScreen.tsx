import React from 'react';
import { Box, HStack, Image, Text, VStack } from 'native-base';

import Illustration from '@assets/images/chat-illustration.svg';
import { ChatForm } from './components/ChatForm';

const ChatScreen = () => {
  return (
    <>
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
            Health Chat
          </Text>
          <Text mt={6} _dark={{ color: 'white' }} _light={{ color: 'black' }}>
            Need to speak to immediately to a healthcare provider? Select a
            reason and the type of provider you are seeking and we’ll connect
            you with a somebody for a secure, one-on-one chat session.
          </Text>
        </VStack>
        <ChatForm />
      </Box>
    </>
  );
};

export default ChatScreen;
