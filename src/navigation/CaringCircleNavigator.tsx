import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddPersonScreen from '@screens/home/profile/caring-circle/add-person-screen/AddPersonScreen';
import CaringCircleScreen from '@screens/home/profile/caring-circle/caring-circle-screen/CaringCircleScreen';
import { useColorMode } from 'native-base';
import { screenOptions } from './config';
import EditPersonScreen from 'screens/home/profile/caring-circle/add-person-screen/EditPersonScreen';
import { CaringCircleNavigatorParamList } from './types';

const Stack = createNativeStackNavigator<CaringCircleNavigatorParamList>();
const CaringCircleNavigator = () => {
  const { colorMode } = useColorMode();

  return (
    <Stack.Navigator screenOptions={screenOptions(colorMode)}>
      <Stack.Screen name="CaringMemberList" component={CaringCircleScreen} options={{ headerTitle: 'Caring Circle' }} />
      <Stack.Screen name="AddPerson" component={AddPersonScreen} options={{ headerTitle: "Person's Details" }} />
      <Stack.Screen name="EditPerson" component={EditPersonScreen} options={{ headerTitle: "Person's Details" }} />
    </Stack.Navigator>
  );
};

export default CaringCircleNavigator;
