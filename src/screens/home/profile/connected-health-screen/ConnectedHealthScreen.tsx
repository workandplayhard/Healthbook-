import React, { useState } from 'react';
import { Box, Center, Text, VStack, View, Fab, AddIcon } from 'native-base';
import IntroModal from './components/IntroModal';
import ConnectedHealthIcon from '@assets/icons/health_records/connected-health-icon.svg';

const ConnectedHealthScreen = () => {
  const [isOpenIntroModal, setIsOpenIntroModal] = useState(true);

  return (
    <VStack
      flex={1}
      _light={{ bgColor: 'white' }}
      _dark={{ bgColor: 'coolGray.800' }}
    >
      <Box
        position="relative"
        height="100%"
        flex={1}
        width="100%"
        alignItems="center"
      >
        <Center>
          <View pt={100} margin={15}>
            <ConnectedHealthIcon width={70} height={70} color="primary.600" />
          </View>
          <Text
            textAlign="center"
            fontWeight="500"
            _light={{ color: 'dustyGray.500' }}
            paddingX="26px"
          >
            You are not connected to any portals. {'\n'}
            Use the Add button below to connect to your provider or health plan.
          </Text>
        </Center>

        <View width="100%" h="100px">
          <Fab
            placement="center"
            size="sm"
            position="absolute"
            bottom={6}
            _light={{
              bgColor: 'primary.600',
            }}
            _dark={{
              bgColor: 'tertiary.600',
            }}
            icon={<AddIcon />}
            alignSelf="center"
          />
        </View>
      </Box>

      <IntroModal
        isOpen={isOpenIntroModal}
        onClose={() => setIsOpenIntroModal(false)}
      />
    </VStack>
  );
};
export default ConnectedHealthScreen;
