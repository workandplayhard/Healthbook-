import React, { useCallback, useState } from 'react';
import { Box, Button, Center, Image, Text, VStack } from 'native-base';
import { SceneMap, TabBar, type TabBarProps, TabView } from 'react-native-tab-view';

import MyRecords from './components/MyRecords';
import SharedRecords from './components/Shared';
import ReceivedRecords from './components/Received';

type Route = {
  key: string;
  title: string;
};

const routes: Route[] = [
  { key: 'my_records', title: 'My Records' },
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
  my_records: MyRecords,
  shared: SharedRecords,
  received: ReceivedRecords,
});

const RecordsScreen = () => {
  const [index, setIndex] = useState(0);

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
        }}
        renderTabBarItem={({ route, navigationState }) => {
          const selected = route.key === navigationState.routes[navigationState.index].key;

          return (
            <Button
              _light={{ bgColor: 'white' }}
              _dark={{ bgColor: 'coolGray.800' }}
              p={0}
              onPress={() => props.jumpTo(route.key)}
            >
              <Center paddingX={2.5} paddingY={2}>
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
                height={0.5}
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
    <>
      <Image h="10px" w="full" alt="colorful-separator" source={require('@assets/images/colorful-separator.png')} />
      <VStack justifyContent="space-between" flex={1} _light={{ bgColor: 'white' }} _dark={{ bgColor: 'coolGray.800' }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderTabBar={renderTabBar}
        />
      </VStack>
    </>
  );
};

export default RecordsScreen;
