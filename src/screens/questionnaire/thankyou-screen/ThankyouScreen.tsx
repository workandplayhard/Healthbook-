import React, { FC } from 'react';
import { Button, Text, VStack } from 'native-base';
import { QuestionnaireStackScreenProps } from 'navigation/types';

const ThankyouScreen: FC<QuestionnaireStackScreenProps<'Thankyou'>> = ({
  navigation,
}) => {
  return (
    <VStack
      space={3}
      flex={1}
      px={6}
      mb={16}
      alignItems="center"
      justifyContent="center"
    >
      <Text fontSize="lg">Thank you!</Text>
      <Text fontSize="md" textAlign="center">
        This helps us to get know you better and how we can better serve your
        health needs.
      </Text>
      <Button
        colorScheme="primary"
        borderRadius="3xl"
        width="full"
        height="12"
        py={0}
        _text={{
          fontWeight: 'semibold',
          fontSize: 'lg',
        }}
        onPress={() =>
          navigation.navigate('TabNavigator', {
            screen: 'HomeTab',
            params: { screen: 'Dashboard' },
          })
        }
      >
        Return to dashboard
      </Button>
    </VStack>
  );
};

export default ThankyouScreen;
