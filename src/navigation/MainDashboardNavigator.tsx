import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { HStack, IconButton, Image } from 'native-base';
import { ViewStyle } from 'react-native';
import QuestionnaireNavigator from './QuestionnaireNavigator';

import MenuIcon from '@assets/icons/menu.svg';
import NotificationIcon from '@assets/icons/notification.svg';
import CalendarIcon from '@assets/icons/calendar.svg';

const headerImage = require('@assets/images/header.png');

const Drawer = createDrawerNavigator();

const MainDashboardNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: $header,
        headerLeft: () => (
          <IconButton
            icon={<MenuIcon height={48} width={48} />}
            p={1}
            onPress={() => navigation.openDrawer()}
          />
        ),
        headerTitle: () => (
          <Image
            source={headerImage}
            alt="header"
            resizeMode="contain"
            height="12"
          />
        ),
        headerTitleContainerStyle: { marginLeft: 0 },
        headerRight: () => (
          <HStack style={$headerRight} space="xs" alignItems="center">
            <CalendarIcon width={28} height={28} />
            <NotificationIcon width={20} height={21} />
          </HStack>
        ),
      })}
    >
      <Drawer.Screen
        name="Quick Questionnaire"
        component={QuestionnaireNavigator}
      />
    </Drawer.Navigator>
  );
};

export default MainDashboardNavigator;

const $header: ViewStyle = {
  shadowColor: 'black',
  shadowOpacity: 0.25,
  shadowOffset: {
    height: 4,
    width: 0,
  },
  shadowRadius: 4,
};

const $headerRight: ViewStyle = {
  marginRight: 16,
};
