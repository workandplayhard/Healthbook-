import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorModeValue } from 'native-base';
import { NavigationState } from '@react-navigation/native';

import theme from '@theme';
import { useCurrentUser } from '@hooks/useUsers';
import TelehealthNavigator from './TelehealthNavigator';
import DashboardScreen from '@screens/home/dashboard-screen/DashboardScreen';
import SymptomsCheckerScreen from '@screens/symptom-checker/SymptomsCheckerScreen';
import RecordsScreen from '@screens/records/records-screen/RecordsScreen';
import ChatScreen from '@screens/chat/chat-screen/ChatScreen';
import HomeIcon from '@assets/icons/home.svg';
import SymptomsIcon from '@assets/icons/symptoms.svg';
import ChatIcon from '@assets/icons/chat.svg';
import TelehealthIcon from '@assets/icons/telehealth.svg';
import RecordsIcon from '@assets/icons/records.svg';

const getActiveRouteState = function (route: NavigationState): NavigationState {
  if (!route.routes || route.routes.length === 0 || route.index >= route.routes.length) {
    return route;
  }

  const childActiveRoute = route.routes[route.index].state as NavigationState;
  return getActiveRouteState(childActiveRoute);
};

const Tab = createBottomTabNavigator();
const TabNavigator = () => {
  const { data: currentUser } = useCurrentUser();

  const shouldShowTelehealth =
    currentUser?.user_org_details && currentUser.user_org_details.length
      ? [4].includes(currentUser.user_org_details[0].org)
      : false;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: useColorModeValue(theme.colors.secondary[600], theme.colors.secondary[600]),
        tabBarInactiveTintColor: useColorModeValue(theme.colors.primary[200], theme.colors.primary[200]),
        tabBarInactiveBackgroundColor: useColorModeValue(theme.colors.primary[600], theme.colors.coolGray[900]),
        tabBarLabelStyle: {
          fontSize: 8.1,
          textTransform: 'none',
        },
        tabBarActiveBackgroundColor: useColorModeValue(theme.colors.primary[600], theme.colors.coolGray[900]),
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: useColorModeValue(theme.colors.primary[600], theme.colors.coolGray[900]),
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={DashboardScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <HomeIcon width={24} height={24} fill={color} />,
        }}
      />
      <Tab.Screen
        name="SymptomsTab"
        component={SymptomsCheckerScreen}
        options={{
          title: 'Health Check',
          tabBarIcon: ({ color }) => <SymptomsIcon width={24} height={24} fill={color} />,
        }}
      />
      <Tab.Screen
        name="RecordsTab"
        component={RecordsScreen}
        options={{
          title: 'Records',
          tabBarIcon: ({ color }) => <RecordsIcon width={24} height={24} fill={color} />,
        }}
      />
      {shouldShowTelehealth && (
        <Tab.Screen
          name="ChatTab"
          component={ChatScreen}
          options={{
            title: 'Chat',
            tabBarIcon: ({ color }) => <ChatIcon width={24} height={24} fill={color} />,
          }}
        />
      )}
      {shouldShowTelehealth && (
        <Tab.Screen
          name="TelehealthTab"
          component={TelehealthNavigator}
          options={{
            title: 'Telehealth',
            tabBarIcon: ({ color }) => <TelehealthIcon width={24} height={24} fill={color} />,
          }}
        />
      )}
    </Tab.Navigator>
  );
};

export default TabNavigator;
