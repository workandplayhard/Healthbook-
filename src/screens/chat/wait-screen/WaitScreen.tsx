import React, { useEffect, useState } from 'react';
import { Box, HStack, Text, useDisclose, VStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import LoadingDots from 'react-native-loading-dots';
import type { RootStackNavigationProps } from 'navigation/types';

import { ConfirmModal } from 'components/ConfirmModal';

const WaitScreen = () => {
  const {
    isOpen: isEndChatModalOpen,
    onOpen: openEndChatModal,
    onClose: closeEndChatModal,
  } = useDisclose();
  const [isEndChatConfirmed, setIsEndChatConfirmed] = useState(false);

  const navigation = useNavigation<RootStackNavigationProps>();
  const handleEndChat = () => {
    setIsEndChatConfirmed(true);
  };

  useEffect(() => {
    navigation.addListener('beforeRemove', e => {
      if (!isEndChatConfirmed) {
        e.preventDefault();
        openEndChatModal();
        return;
      }

      navigation.dispatch(e.data.action);
    });

    isEndChatConfirmed && navigation.navigate('TabNavigator');

    return () => {
      navigation.removeListener('beforeRemove', () => {});
    };
  }, [navigation, isEndChatConfirmed, openEndChatModal]);

  return (
    <Box>
      <ConfirmModal
        isOpen={isEndChatModalOpen}
        onClose={closeEndChatModal}
        onSubmit={handleEndChat}
        submitButtonName="Yes, end chat"
        size="xl"
      >
        <Text textAlign="center">Are you sure want to end your chat?</Text>
      </ConfirmModal>
      <HStack justifyContent="center" h="full" _dark={{ bg: 'coolGray.800' }}>
        <Box position="absolute" w="1/3" top="157" mx="auto">
          <LoadingDots
            colors={['#8BD0D5', '#8BD0D5', '#8BD0D5', '#8BD0D5']}
            size={23}
          />
        </Box>
        <VStack justifyContent="center" p="16">
          <Box>
            <Text fontSize="md" pb="5" textAlign="center" fontWeight="500">
              Your chat session will begin soon. You are in queue position
              followed by the number in Bold
            </Text>
            <Text textAlign="center" p="5" fontSize="6xl" fontWeight="500">
              5
            </Text>
          </Box>
        </VStack>
      </HStack>
    </Box>
  );
};

export default WaitScreen;
