import React from 'react';
import { Box, HStack, Image, Text } from 'native-base';

const profilePicReplace = require('@assets/images/profilePic-placeholder.png');

export default function NodataCard() {
  return (
    <Box borderRadius="md">
      <HStack
        borderStyle="dotted"
        borderWidth={1}
        p={4}
        borderRadius="3px"
        borderColor="#D1DFEB"
        height="92px"
      >
        <Image
          source={profilePicReplace}
          alt="profilePic-Replace"
          backgroundColor="#EAEAEA"
          alignSelf="center"
          borderRadius={80}
          resizeMode="contain"
          width="65px"
          height="65px"
        />
        <Text
          fontWeight={400}
          alignSelf="center"
          color="botticelli.700"
          paddingLeft={4}
          fontSize={14}
          height={29}
          width={201}
        >
          Your Caring Circle is empty.
        </Text>
      </HStack>
    </Box>
  );
}
