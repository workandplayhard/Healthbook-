import { Box, VStack } from 'native-base';

const SupportScreen = () => {
  return (
    <VStack
      justifyContent="space-between"
      flex={1}
      _light={{ bgColor: 'white' }}
      _dark={{ bgColor: 'coolGray.800' }}
    >
      <Box>
        Support Screen
      </Box>
    </VStack>
  );
};

export default SupportScreen;
