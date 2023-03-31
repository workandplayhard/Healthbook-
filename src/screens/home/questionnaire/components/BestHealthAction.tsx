import React from 'react';

import { useNavigation } from '@react-navigation/core';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Box, Button, HStack, Text, VStack } from 'native-base';

import { useCurrentUser } from '@hooks/useUsers';
import type { RootStackNavigatorParamList } from '@navigation/types';

import BestHealthActionIllustration from '../assets/best-health-action-illustration.svg';

type BestHealthActionProps = {
  phqResult?: string | null;
  phqScore?: number | null;
};

const BestHealthAction = ({ phqResult, phqScore }: BestHealthActionProps) => {
  const navigation = useNavigation<StackNavigationProp<RootStackNavigatorParamList>>();

  const { data: currentUser } = useCurrentUser();
  const shouldShowTelehealth =
    currentUser?.user_org_details && currentUser.user_org_details.length
      ? [4].includes(currentUser.user_org_details[0].org)
      : false;

  return (
    <Box safeAreaBottom _light={{ bg: 'white' }} _dark={{ bg: 'coolGray.800' }} flex="1" p="4">
      <VStack flex="1" space="4">
        <HStack alignItems="center" space="2">
          <BestHealthActionIllustration />
          <Text fontSize="lg" fontWeight="medium">
            Your next best health action
          </Text>
        </HStack>
        <Text fontSize="sm" fontWeight="bold">
          Based on available data, we suggest consulting with a mental health provider or your primary care physician.
          Seeking help early for a mental health issue can make a big difference.
        </Text>
        {shouldShowTelehealth && (
          <>
            <Text fontSize="sm" fontWeight="medium">
              HealthBook+ can help you find a provider and schedule a telehealth meeting. Please follow the button
              below.
            </Text>
            <Button>Schedule telehealth meeting</Button>
          </>
        )}
        <Text fontSize="sm" fontWeight="medium">
          For additional help, check out our suite of health tools.
        </Text>
        <Button variant="outline" onPress={() => navigation.navigate('HealthHelp', { phqResult })}>
          Additional Health Tools
        </Button>
        <Text fontSize="sm" fontWeight="medium">
          If you are experiencing an emergency, call 911.
        </Text>
      </VStack>
      <Text fontSize="xs">
        HealthBook+ provides information to help guide your next action based on available data about your symptoms and
        conditions. HealthBook+ does not provide a medical diagnosis and should not replace licensed healthcare
        practitioners. If you have any questions or concerns about the results of HealthBook+, consult your licensed
        healthcare practitioner.
      </Text>
    </Box>
  );
};

export default BestHealthAction;
