import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorMode } from 'native-base';

import { screenOptions } from './config';
import CaringCircleNavigator from './CaringCircleNavigator';

const Stack = createNativeStackNavigator();
const ProfileNavigator = () => {
  const { colorMode } = useColorMode();

  return (
    <Stack.Navigator screenOptions={screenOptions(colorMode)}>
      <Stack.Screen
        name="CaringCircle"
        component={CaringCircleNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
