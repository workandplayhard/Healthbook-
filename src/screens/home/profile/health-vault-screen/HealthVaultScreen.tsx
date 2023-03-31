import { Box, Button, Center, Text, View, VStack } from 'native-base';
import { useCallback, useState } from 'react';
import { SceneMap, TabBar, TabBarProps, TabView } from 'react-native-tab-view';

import MyDocuments from './components/MyDocuments';
import Received from './components/Received';
import Shared from './components/Shared';

import { useNotification } from '@hooks/useNotification';
import NotificationIcon from '@assets/icons/notification.svg';

type Route = {
  key: string;
  title: string;
};

const routes: Route[] = [
  { key: 'my_documents', title: 'My Documents' },
  {
    key: 'shared',
    title: 'Shared',
  },
  {
    key: 'received',
    title: 'Received',
  },
];

const renderScene = SceneMap({
  my_documents: MyDocuments,
  shared: Shared,
  received: Received,
});

const HealthVaultScreen = () => {
  const [index, setIndex] = useState(0);
  const { notification } = useNotification()

  const renderTabBar = useCallback(
    (props: TabBarProps<Route>) => (
      <TabBar
        {...props}
        tabStyle={{
          width: 'auto',
        }}
        style={{
          backgroundColor: 'auto',
          elevation: 0,
          shadowOpacity: 0,
          marginTop: 8,
        }}
        renderTabBarItem={({ route, navigationState }) => {
          const selected =
            route.key === navigationState.routes[navigationState.index].key;

          return (
            <Button
              _light={{ bgColor: 'white' }}
              _dark={{ bgColor: 'coolGray.800' }}
              p={0}
              onPress={() => props.jumpTo(route.key)}
            >
              <Center paddingX={2.5} paddingY={2} position="relative">
                <Text
                  flex={0}
                  fontSize="sm"
                  fontWeight={500}
                  _light={{
                    color: selected ? 'primary.600' : 'dustyGray.700',
                  }}
                  _dark={{
                    color: selected ? 'white' : 'dustyGray.400',
                  }}
                >
                  {route.title}
                </Text>
              </Center>
              <Box
                _light={{
                  bgColor: selected ? 'secondary.600' : 'dustyGray.200',
                }}
                _dark={{
                  bgColor: selected ? 'secondary.600' : 'coolGray.700',
                }}
                borderTopRadius={4}
                height={1}
              />
            </Button>
          );
        }}
        contentContainerStyle={{
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          borderWidth: 0,
        }}
      />
    ),
    [],
  );

  return (
    <VStack
      justifyContent="space-between"
      flex={1}
      _light={{ bgColor: 'white' }}
      _dark={{ bgColor: 'coolGray.800' }}
    >
      {notification && <View
        position="absolute"
        right="3"
        style={{
          zIndex: 100,
          elevation: 3,
        }}
      >
        <NotificationIcon width={20} height={21} />
      </View>}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
      />
      </VStack>
  );
};

export default HealthVaultScreen;
