import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ThankyouScreen from '@screens/questionnaire/thankyou-screen/ThankyouScreen';
import QuestionnaireScreen from '@screens/questionnaire/questionnaire-screen/QuestionnaireScreen';
import { QuestionnaireStackParamList } from './types';

const Stack = createNativeStackNavigator<QuestionnaireStackParamList>();
const QuestionnaireNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Main" component={QuestionnaireScreen} />
      <Stack.Screen name="Thankyou" component={ThankyouScreen} />
    </Stack.Navigator>
  );
};

export default QuestionnaireNavigator;
