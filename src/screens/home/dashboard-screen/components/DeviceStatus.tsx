import React from 'react';

import { useNavigation } from '@react-navigation/core';
import { Box, Center, HStack, Pressable, Text, useColorMode } from 'native-base';

import CheckCircleIcon from '@assets/icons/check_circle.svg';
import CloudNoDataIcon from '@assets/icons/cloud_no_data.svg';
import ErrorCircleIcon from '@assets/icons/error_circle.svg';
import SettingsIcon from '@assets/icons/settings.svg';
import { useCurrentUser } from '@hooks/useUsers';
import theme from '@theme';

type DeviceStatusProps = {
  noData: boolean;
};

const formatDeviceName = (str: string) => {
  return str
    .toLowerCase()
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const DeviceStatus = ({ noData }: DeviceStatusProps) => {
  const navigation = useNavigation();
  const { colorMode } = useColorMode();
  const { data: currentUser } = useCurrentUser();

  return (
    <Box>
      <HStack justifyContent="space-between" alignItems="center">
        <Text fontSize="lg" fontWeight="bold">
          My Health Dashboard
        </Text>
        <Pressable onPress={() => navigation.navigate('DashboardSettings')}>
          <SettingsIcon color={colorMode === 'dark' ? theme.colors.tertiary[600] : theme.colors.primary[600]} />
        </Pressable>
      </HStack>

      <HStack mt="2" space="2">
        <CheckCircleIcon />
        <Text flex="1" lineHeight="sm" fontWeight="medium">
          Device(s) Connected:{' '}
          <Text
            onPress={() => navigation.navigate('ConnectDevice')}
            _light={{ color: 'primary.600' }}
            _dark={{ color: 'tertiary.600' }}
            fontWeight="bold"
          >
            {currentUser?.validic_user && currentUser.validic_user.sources
              ? currentUser.validic_user.sources.map(s => formatDeviceName(s.type)).join(', ')
              : 'None'}
          </Text>
        </Text>
      </HStack>

      {noData ? (
        <Box mt="2">
          <HStack space="2">
            <ErrorCircleIcon />
            <Text flex="1" lineHeight="sm" fontWeight="medium" fontSize="sm" color="error.500">
              Data is not being received. Please ensure your device is correctly configured and syncing.
            </Text>
          </HStack>

          <Center mt="8">
            <CloudNoDataIcon />
          </Center>
        </Box>
      ) : null}
    </Box>
  );
};

export default DeviceStatus;
