import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HStack, VStack, Text, Link, Box, useColorMode, Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import Config from 'react-native-config';

import { RootStackNavigationProps } from 'navigation/types';

import Logo from '@assets/logos/health-book-logo.svg';
import SignInForm from './components/SignInForm';

const SignInScreen = () => {
  let insets = useSafeAreaInsets();
  const { toggleColorMode } = useColorMode();
  const navigation = useNavigation<RootStackNavigationProps>();

  return (
    <>
      <Box safeAreaTop flexGrow={1} _light={{ background: 'primary.600' }} _dark={{ background: 'coolGray.900' }}>
        <KeyboardAwareScrollView
          bounces={false}
          extraScrollHeight={-insets.bottom}
          // eslint-disable-next-line react-native/no-inline-styles
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <VStack px="4" mb="5" space="9">
            <VStack space={0.5}>
              <Box mt={50}>
                <Logo />
              </Box>
              <Text
                fontSize="md"
                fontWeight="normal"
                _dark={{
                  color: 'dustyGray.100',
                }}
                _light={{
                  color: 'primary.100',
                }}
              >
                Sign in to continue
              </Text>
            </VStack>
          </VStack>
          <Box
            px="4"
            py="8"
            flex={1}
            _light={{ bg: 'white' }}
            _dark={{ bg: 'coolGray.800' }}
            borderTopLeftRadius="2xl"
            borderTopRightRadius="2xl"
          >
            <SignInForm />
            {Config.ENV === 'development' && (
              <Button onPress={toggleColorMode} my={8} size="xs">
                Toggle Color Mode
              </Button>
            )}
            <HStack space="1" alignItems="center" justifyContent="center" mt="auto">
              <Text
                fontSize="sm"
                fontWeight="normal"
                _light={{ color: 'dustyGray.900' }}
                _dark={{ color: 'coolGray.100' }}
              >
                New to HealthBook+?
              </Text>
              <Link
                _text={{
                  fontSize: 'sm',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                }}
                _light={{
                  _text: {
                    color: 'primary.600',
                  },
                }}
                _dark={{
                  _text: {
                    color: 'tertiary.600',
                  },
                }}
                onPress={() => navigation.navigate('EnterAccess')}
              >
                Enter Access Code
              </Link>
            </HStack>
          </Box>
          <Box _light={{ bg: 'white' }} _dark={{ bg: 'coolGray.800' }}>
            <Text
              fontSize="xs"
              fontWeight="normal"
              textAlign="center"
              _light={{ color: 'dustyGray.900' }}
              _dark={{ color: 'coolGray.100' }}
            >
              {`Version ${DeviceInfo.getVersion()} (${DeviceInfo.getBuildNumber()})`}
            </Text>
          </Box>
        </KeyboardAwareScrollView>
      </Box>
      <Box safeAreaBottom _light={{ bg: 'white' }} _dark={{ bg: 'coolGray.800' }} />
    </>
  );
};

export default SignInScreen;
