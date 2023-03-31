import React, { useMemo } from 'react';
import { Pressable } from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Box, HStack, ScrollView, Text, VStack } from 'native-base';

import { useCurrentUser } from '@hooks/useUsers';
import type { RootStackNavigatorParamList } from '@navigation/types';

import ChatBotIcon from './assets/chatbot-icon.svg';
import HealthChatIcon from './assets/health-chat-icon.svg';
import HealthCheckIcon from './assets/health-check-icon.svg';
import QuestionnaireIcon from './assets/questionnaire-icon.svg';
import SereaIcon from './assets/serea-icon.svg';
import TelehealthIcon from './assets/telehealth-icon.svg';
import VideosIcon from './assets/videos-icon.svg';

const HealthHelpScreen: React.FC<NativeStackScreenProps<RootStackNavigatorParamList, 'HealthHelp'>> = ({
  navigation,
  route,
}) => {
  const message = route.params?.message;
  const { data: currentUser } = useCurrentUser();

  const helpSections = useMemo(() => {
    const shouldShowTelehealth =
      currentUser?.user_org_details && currentUser.user_org_details.length
        ? [4].includes(currentUser.user_org_details[0].org)
        : false;

    const shouldShowHealthChat =
      currentUser?.user_org_details && currentUser.user_org_details.length
        ? [4].includes(currentUser.user_org_details[0].org)
        : false;

    const shouldShowVideos =
      currentUser?.user_org_details && currentUser.user_org_details.length
        ? [4].includes(currentUser.user_org_details[0].org)
        : false;

    const sections = [
      {
        key: 'questionnaire',
        icon: QuestionnaireIcon,
        title: 'Questionnaire',
        description: 'Let’s dive a little deeper to get you the right help',
        navigateFn: () => navigation.navigate('Questionnaire'),
      },
      {
        key: 'health-check',
        icon: HealthCheckIcon,
        title: 'Health Check',
        description: 'Uncover the possible causes of your symptoms',
        navigateFn: () => navigation.navigate('TabNavigator', { screen: 'SymptomsTab' }),
      },
      {
        key: 'chatbot',
        icon: ChatBotIcon,
        title: 'Chatbot',
        description: 'Ask our intelligent chatbot to get quick answers',
        navigateFn: () => console.log('navigate to chatbot'), // TODO: navigate to chatbot
      },
      {
        key: 'serea',
        icon: SereaIcon,
        title: 'Seréa - Digital Person',
        description: 'Have a conversation with Seréa to help guide you',
      },
    ];

    if (shouldShowHealthChat) {
      sections.push({
        key: 'health-chat',
        icon: HealthChatIcon,
        title: 'Health Chat',
        description: 'Chat immediately with a medical professional',
        navigateFn: () => navigation.navigate('TabNavigator', { screen: 'ChatTab' }),
      });
    }

    if (shouldShowTelehealth) {
      sections.push({
        key: 'telehealth',
        icon: TelehealthIcon,
        title: 'Telehealth',
        description: 'Schedule an online video meeting with a provider',
        navigateFn: () => navigation.navigate('TabNavigator', { screen: 'TelehealthTab' }),
      });
    }

    if (shouldShowVideos) {
      sections.push({
        key: 'videos',
        icon: VideosIcon,
        title: 'Videos',
        description: 'Watch curated videos on informative health topics',
      });
    }

    return sections;
  }, [currentUser?.user_org_details, navigation]);

  return (
    <Box flex={1} _light={{ bg: 'white' }} _dark={{ bg: 'coolGray.800' }}>
      <ScrollView bounces={false}>
        <VStack p="4">
          <Text fontSize="lg" fontWeight="bold">
            Get Health Help
          </Text>
          {message ? (
            <Text mt="2" fontSize="sm">
              {message}
            </Text>
          ) : null}
        </VStack>
        <VStack space="4" p="4">
          {helpSections.map(section => (
            <Pressable key={section.key} onPress={section.navigateFn}>
              <Box px="4" py="2" borderColor="botticelli.600" borderWidth={1} borderRadius="md">
                <HStack alignItems="center" space="2">
                  {section.icon && <section.icon />}
                  <VStack p="2">
                    <Text fontSize="sm" fontWeight="bold">
                      {section.title}
                    </Text>
                    <Text mt="1" fontSize="xs">
                      {section.description}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            </Pressable>
          ))}
        </VStack>
      </ScrollView>
      <Box safeAreaBottom />
    </Box>
  );
};

export default HealthHelpScreen;
