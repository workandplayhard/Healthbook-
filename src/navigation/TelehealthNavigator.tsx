import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorMode } from 'native-base';

import TelehealthScreen from '@screens/telehealth/telehealth-screen/TelehealthScreen';
import ProviderListScreen from '@screens/telehealth/provider-list-screen/ProviderListScreen';
import ProviderDetailScreen from '@screens/telehealth/provider-detail-screen/ProviderDetailScreen';

import { screenOptions } from './config';
import { ConfirmAppointmentScreen } from '@screens/telehealth/confirm-appointment-screen/ConfirmAppointmentScreen';
import { HealthStackNavigatorParamList } from './types';
import BookAppointmentScreen from 'screens/telehealth/book-appointment-screen/BookAppointmentScreen';

const Stack = createNativeStackNavigator<HealthStackNavigatorParamList>();
const TelehealthNavigator = () => {
  const { colorMode } = useColorMode();
  return (
    <Stack.Navigator screenOptions={screenOptions(colorMode)}>
      <Stack.Screen name="Telehealth" component={TelehealthScreen} />
      <Stack.Screen name="ProviderListScreen" component={ProviderListScreen} />
      <Stack.Screen
        name="ProviderDetailScreen"
        component={ProviderDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ConfirmAppointmentScreen"
        options={{ title: 'Confirm Telehealth Meeting' }}
        component={ConfirmAppointmentScreen}
      />
      <Stack.Screen
        name="BookAppointmentScreen"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
        component={BookAppointmentScreen}
      />
    </Stack.Navigator>
  );
};

export default TelehealthNavigator;
