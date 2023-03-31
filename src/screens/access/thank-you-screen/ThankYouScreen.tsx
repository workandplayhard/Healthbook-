import React from 'react';
import {
  Box,
  Text,
  VStack,
  Center,
  Link
} from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';

import type { RootStackNavigationProps } from '@navigation/types';

const ThankYouScreen = () => {
  const navigation = useNavigation<RootStackNavigationProps>();

  return (
    <KeyboardAwareScrollView
      // eslint-disable-next-line react-native/no-inline-styles
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardDismissMode={'interactive'}
      bounces={false}
    >
      <Box
        safeArea
        flex="1"
        _light={{ background: 'white' }}
        _dark={{ background: 'coolGray.800' }}
      >
        <Link
          _text={{
            fontSize: "sm",
            textDecoration: "none",
            color: '#0476D9',
            fontWeight: "600",
            paddingLeft: 19
          }}
          onPress={() => navigation.navigate('CodeRetrieval')}
        >
          Back
        </Link>

        <VStack paddingX="24px" mb="32px" pt="182px">
          <Center _text={{
            fontSize: "3xl",
            letterSpacing: "-0.3px",
            lineHeight: "28px",
            paddingTop: "30px",
            color: "#09101D",
          }}>
            Thank you
          </Center>

          <Text fontSize="20px" lineHeight="30px" color="#09101D" display="flex" textAlign="center">
            Your information has been submitted.
          </Text>
        </VStack>
    </Box>
  </KeyboardAwareScrollView>
)};

export default ThankYouScreen;
