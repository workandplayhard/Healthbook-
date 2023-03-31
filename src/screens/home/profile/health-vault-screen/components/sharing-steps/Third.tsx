import { Box, Button, Text } from 'native-base';
import React from 'react';

type ThirdStepProps = {
  onDone: () => void;
};

const Third: React.FC<ThirdStepProps> = ({ onDone }) => {
  return (
    <Box flex={1}>
      <Text fontSize="18px" fontWeight={700} mb={5}>
        Email invite sent
      </Text>
      <Text fontSize="14px" fontWeight={500} flex={1}>
        A temporary link with 30 day access to your documents has been sent to
        suemiller@gmail.com. This link will expire in 24 hours
      </Text>
      <Button onPress={onDone}>Done</Button>
    </Box>
  );
};

export default Third;
