import React, { useState } from 'react';

import { useNavigation } from '@react-navigation/core';
import { Box, Button, HStack, Icon, Text, VStack } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import CelebrateIcon from '@assets/icons/celebration.svg';
import SunnyIcon from '@assets/icons/wb_sunny.svg';
import { MoodStatus, useMoodStore } from '@hooks/useMoodStore';
import { useCurrentUser, useMoodCapture } from '@hooks/useUsers';

type IProps = {
  onClose: () => void;
};

export const Mood: React.FC<IProps> = ({ onClose }) => {
  const navigation = useNavigation();

  const { data: currentUser } = useCurrentUser();
  const { mood } = useMoodStore();
  const [chat, setChat] = useState(true);

  const { mutate: moodCapture } = useMoodCapture();

  const handleClose = () => {
    setTimeout(onClose, 2000);
  };

  return (
    <VStack
      alignItems="flex-start"
      _light={{ bgColor: 'botticelli.200', borderColor: 'botticelli.600' }}
      justifyContent="center"
      p={4}
      borderWidth={1}
    >
      <Box>
        <Text fontSize="lg" fontWeight="bold">
          {!mood || mood !== MoodStatus.BAD ? `Welcome ${currentUser?.first_name}` : "Hmm, you're feeling bad?"}
        </Text>
        <Text fontWeight="medium">
          {!mood || mood !== MoodStatus.BAD ? 'How are you feeling today?' : 'Would you like some help with that?'}
        </Text>
      </Box>
      <HStack mt={2} space={1.5} alignItems="center">
        {!mood && (
          <>
            <Button
              borderWidth="1"
              variant="outline"
              width="full"
              onPress={() => moodCapture(MoodStatus.BAD)}
              flex={1}
              py="2.5"
            >
              <HStack alignItems="center" space={1}>
                <Icon
                  as={MaterialCommunityIcons}
                  name="emoticon-sad-outline"
                  size="4"
                  _light={{ color: 'primary.600' }}
                  _dark={{ color: 'dustyGray.300' }}
                />
                <Text
                  textAlign="center"
                  _light={{ color: 'primary.600' }}
                  _dark={{ color: 'dustyGray.300' }}
                  fontWeight="medium"
                >
                  Bad
                </Text>
              </HStack>
            </Button>
            <Button
              borderWidth="1"
              variant="outline"
              width="full"
              onPress={() => {
                moodCapture(MoodStatus.OK);
                handleClose();
              }}
              flex={1}
              py="2.5"
            >
              <HStack alignItems="center" space={1}>
                <Icon
                  as={MaterialCommunityIcons}
                  name="emoticon-neutral-outline"
                  size="4"
                  _light={{ color: 'primary.600' }}
                  _dark={{ color: 'dustyGray.300' }}
                />
                <Text
                  textAlign="center"
                  _light={{ color: 'primary.600' }}
                  _dark={{ color: 'dustyGray.300' }}
                  fontWeight="medium"
                >
                  Just OK
                </Text>
              </HStack>
            </Button>
            <Button
              borderWidth="1"
              variant="outline"
              width="full"
              onPress={() => {
                moodCapture(MoodStatus.GREAT);
                handleClose();
              }}
              flex={1}
              py="2.5"
            >
              <HStack alignItems="center" space={1}>
                <Icon
                  as={MaterialCommunityIcons}
                  name="emoticon-happy-outline"
                  size="4"
                  _light={{ color: 'primary.600' }}
                  _dark={{ color: 'dustyGray.300' }}
                />
                <Text
                  textAlign="center"
                  _light={{ color: 'primary.600' }}
                  _dark={{ color: 'dustyGray.300' }}
                  fontWeight="medium"
                >
                  Great!
                </Text>
              </HStack>
            </Button>
          </>
        )}
        {mood === MoodStatus.BAD &&
          (chat ? (
            <Button.Group>
              <Button
                variant="outline"
                flex={1}
                onPress={() => {
                  setChat(false);
                  handleClose();
                }}
                py="2.5"
              >
                No
              </Button>
              <Button
                variant="outline"
                flex={1}
                onPress={() => {
                  handleClose();
                  navigation.navigate('HealthHelp');
                }}
                py="2.5"
              >
                Yes
              </Button>
            </Button.Group>
          ) : (
            <>
              <SunnyIcon />
              <Text color="pelorous.600" fontWeight="bold">
                OK, have a good day.
              </Text>
            </>
          ))}
        {mood === MoodStatus.OK && (
          <>
            <SunnyIcon />
            <Text color="pelorous.600" fontWeight="bold">
              OK, have a good day.
            </Text>
          </>
        )}
        {mood === MoodStatus.GREAT && (
          <>
            <CelebrateIcon />
            <Text color="secondary.600" fontWeight="bold">
              Fantastic!
            </Text>
          </>
        )}
      </HStack>
    </VStack>
  );
};
