import React, { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Box, HStack, Icon, IconButton, Text } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import HeaderLogo from '@assets/logos/health-book-logo-header.svg';

const Header: React.FC<{ focusedTab: string | undefined }> = ({ focusedTab }) => {
  const navigation = useNavigation();

  const handleNavigateToProfile = () => {
    navigation.navigate('AccountSettings');
  };

  const title = useMemo(() => {
    switch (focusedTab) {
      case 'RecordsTab':
        return (
          <Text fontSize="18px" fontWeight={500} color="#F9FAFB">
            Health Records
          </Text>
        );
      case 'SymptomsTab':
        return (
          <Text fontSize="18px" fontWeight={500} color="#F9FAFB">
            Health Check
          </Text>
        );
      case 'HomeTab':
      default:
        return <HeaderLogo />;
    }
  }, [focusedTab]);

  return (
    <Box safeAreaTop px="4" _light={{ background: 'primary.600' }} _dark={{ background: 'coolGray.900' }}>
      <HStack alignItems="center" h="64px" space="2" justifyContent="space-between">
        {title}
        <HStack alignItems="center" space="1">
          <IconButton
            colorScheme="light"
            variant="ghost"
            alignSelf="flex-end"
            onPress={() => navigation.navigate('MyCalendar')}
            icon={
              <Icon
                size="6"
                as={MaterialIcons}
                name="calendar-today"
                _light={{ color: 'primary.100' }}
                _dark={{ color: 'dustyGray.500' }}
              />
            }
          />
          <IconButton
            colorScheme="light"
            variant="ghost"
            alignSelf="flex-end"
            icon={
              <Icon
                size="6"
                as={MaterialIcons}
                name="notifications-none"
                _light={{ color: 'primary.100' }}
                _dark={{ color: 'dustyGray.500' }}
              />
            }
          />
          <IconButton
            colorScheme="light"
            variant="ghost"
            alignSelf="flex-end"
            icon={
              <Icon
                size="6"
                as={MaterialIcons}
                name="account-circle"
                _light={{ color: 'primary.100' }}
                _dark={{ color: 'dustyGray.500' }}
              />
            }
            onPress={handleNavigateToProfile}
          />
        </HStack>
      </HStack>
    </Box>
  );
};

export default Header;
