import React, { useMemo, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { Avatar, Box, FlatList, HStack, Pressable, Text, useColorMode, VStack } from 'native-base';
import { useTranslation } from 'react-i18next';
import ImageCropPicker from 'react-native-image-crop-picker';

import AccountCircleIcon from '@assets/icons/account_circle.svg';
import EditIcon from '@assets/icons/edit.svg';
import LockIcon from '@assets/icons/lock.svg';
import LogoutIcon from '@assets/icons/logout.svg';
import ManageAccountIcon from '@assets/icons/manage_account.svg';
import PasswordIcon from '@assets/icons/password.svg';
import SupportIcon from '@assets/icons/support.svg';
import SyncIcon from '@assets/icons/sync.svg';
import UserCircleIcon from '@assets/icons/user_circle.svg';
import { useAuthStore } from '@hooks/useAuthStore';
import { useMoodStore } from '@hooks/useMoodStore';
import { useAvatarMutation, useCurrentUser } from '@hooks/useUsers';
import type { User } from '@services/types';
import theme from '@theme';

const ProfileMenuScreen = () => {
  const { colorMode } = useColorMode();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  const { mutate: uploadAvatar } = useAvatarMutation();

  const clearMoodStore = useMoodStore(state => state.clear);
  const clearAuthStore = useAuthStore(state => state.clear);

  const logout = () => {
    queryClient.removeQueries();
    clearMoodStore();
    clearAuthStore();
  };

  const menuItems: Array<{
    Icon: any;
    text: string;
    action?: () => void;
  }> = [
    {
      Icon: ManageAccountIcon,
      text: 'profile.navigation_title.account_info',
      action: () => navigation.navigate('AccountInfo'),
    },
    {
      Icon: AccountCircleIcon,
      text: 'profile.navigation_title.my_profile',
      action: () => navigation.navigate('MyProfile'),
    },
    {
      Icon: UserCircleIcon,
      text: 'profile.navigation_title.caring_circle',
      action: () => navigation.navigate('CaringMemberList'),
    },
    {
      Icon: SyncIcon,
      text: 'profile.navigation_title.connected_health',
      action: () => navigation.navigate('ConnectedHealth'),
    },
    {
      Icon: LockIcon,
      text: 'profile.navigation_title.health_vault',
      action: () => navigation.navigate('HealthVault'),
    },
    {
      Icon: PasswordIcon,
      text: 'profile.navigation_title.security_settings',
      action: () => navigation.navigate('SecuritySettings'),
    },
    {
      Icon: SupportIcon,
      text: 'profile.navigation_title.support',
      action: () => {
        // logout();
      },
    },
    {
      Icon: LogoutIcon,
      text: 'profile.navigation_title.sign_out',
      action: () => {
        logout();
      },
    },
  ];

  const getInitials = () => {
    let result = '';
    if (currentUser?.first_name) {
      result = result + currentUser.first_name[0].toUpperCase();
    }

    if (currentUser?.last_name) {
      result = result + currentUser.last_name[0].toUpperCase();
    }

    return result;
  };

  const i18n = useTranslation();

  const [uri, setUri] = useState<string>();

  const { bgDark, bgLight } = useMemo(() => {
    if (colorMode === 'dark') {
      return {
        bgDark: theme.colors.coolGray[900],
        bgLight: theme.colors.coolGray[800],
      };
    }

    return {
      bgDark: theme.colors.primary[600],
      bgLight: theme.colors.primary[100],
    };
  }, [colorMode]);

  const pickPicture = () => {
    ImageCropPicker.openPicker({
      width: 250,
      height: 250,
      cropping: true,
    })
      .then(image => {
        setUri(image.path);

        uploadAvatar(image, {
          onSuccess: ({ data }) => {
            queryClient.setQueryData<User | undefined>(['me'], user => {
              if (user) {
                return { ...user, profile_picture: data };
              }
            });
          },
        });
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <Box flex={1} bgColor={bgLight}>
      <VStack bgColor={bgDark}>
        <Box justifyContent="center">
          <VStack alignItems="center">
            <Avatar
              bg="secondary.600"
              width="20"
              height="20"
              source={{
                uri: uri ? uri : (currentUser?.profile_picture as string),
              }}
              _text={{
                fontSize: '3xl',
                fontWeight: 'medium',
              }}
            >
              {getInitials()}
              <Avatar.Badge
                width="6"
                height="6"
                bgColor="tertiary.600"
                borderWidth={0}
                alignSelf="flex-end"
                right={7}
                bottom={-11}
                alignItems="center"
                justifyContent="center"
              >
                <EditIcon width="16px" fill="white" height={16} onPress={() => pickPicture()} />
              </Avatar.Badge>
            </Avatar>

            <Text color="white" fontWeight="bold" fontSize="lg" mt={3}>
              {`${currentUser?.first_name} ${currentUser?.last_name}`}
            </Text>

            <Text color={theme.colors.dustyGray[100]} fontSize="sm">
              {currentUser?.email}
            </Text>

            <FlatList
              my={2}
              width="full"
              data={menuItems}
              renderItem={({ item: { Icon, text, action } }) => (
                <Pressable onPress={() => action && action()}>
                  {({ isPressed }) => {
                    return (
                      <Box
                        _light={{
                          bg: isPressed ? 'primary.800' : 'primary.600',
                        }}
                        _dark={{
                          bg: isPressed ? 'coolGray.800' : 'coolGray.900',
                        }}
                      >
                        <HStack justifyContent="flex-start" alignItems="center" height="12" my={1} px={4} space={4}>
                          <Icon width={20} height={20} />
                          <Text fontSize="md" fontWeight="medium" color="white">
                            {i18n.t(text)}
                          </Text>
                        </HStack>
                      </Box>
                    );
                  }}
                </Pressable>
              )}
            />
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default ProfileMenuScreen;
