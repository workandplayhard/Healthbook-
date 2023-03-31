import React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Center,
  Text,
  useColorMode,
  VStack,
  Modal,
} from 'native-base';
import theme from '@theme';

import { AppointmentDataType, HealthStackScreenProps } from 'navigation/types';
import {
  SceneMap,
  SceneRendererProps,
  TabBar,
  TabBarProps,
  TabView,
} from 'react-native-tab-view';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Meetings } from './components/Meetings';
import { About } from './components/About';
import { Provider } from 'services/types';
import { useBackHandler } from '@hooks/useBackHandler';
import { useGetProviderDetail } from 'hooks/useProvider';

type payload = {
  date: string | undefined;
  provider_type: string | undefined;
  provider_id: number | undefined;
};

type Route = {
  key: string;
  title: string;
  provider?: Provider;
  date?: string;
  update?: boolean | undefined | null;
  currentAppointmentDetails?: AppointmentDataType | undefined;
  oldAppointmentDetails?: AppointmentDataType | undefined;
  payloadProviderDetails?: payload;
};

const renderScene = (props: SceneRendererProps & { route: Route }) => {
  return (
    <Box
      safeAreaBottom
      flexGrow={1}
      py={2}
      _light={{ bg: 'white' }}
      _dark={{ bg: 'coolGray.800' }}
    >
      <KeyboardAwareScrollView
        bounces={false}
        // eslint-disable-next-line react-native/no-inline-styles
        contentContainerStyle={{ flexGrow: 1 }}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ flex: 1 }}
      >
        <Box px="4" py="4">
          {SceneMap<any>({
            meetings: Meetings,
            about: About,
          })(props)}
        </Box>
      </KeyboardAwareScrollView>
    </Box>
  );
};

export const ProviderDetailScreen: React.FC<
  HealthStackScreenProps<'ProviderDetailScreen'>
> = ({
  navigation,
  route: {
    params: { provider, update, currentAppointmentDetails },
  },
}) => {
  const [index, setIndex] = useState(0);

  const { data: providerDetail } = useGetProviderDetail(provider);

  const { colorMode } = useColorMode();
  const { bgLight } = useMemo(() => {
    if (colorMode === 'dark') {
      return {
        bgDark: theme.colors.coolGray[900],
        bgLight: theme.colors.coolGray[800],
      };
    }

    return {
      bgDark: theme.colors.primary[600],
      bgLight: theme.colors.white,
    };
  }, [colorMode]);

  useEffect(() => {
    navigation.setOptions({ title: 'Provider Details' });
  }, [navigation]);

  useEffect(() => {
    if (update) {
      navigation.setOptions({ headerShown: false, gestureEnabled: false });
    } else {
      navigation.setOptions({ headerShown: true });
    }
  }, [update]);
  useBackHandler(() => {
    if (update) {
      return true;
    }
    // we need to stop android default button
    return false;
  });

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
          const selected =
            route.key === navigationState.routes[navigationState.index].key;

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
                  fontWeight="medium"
                  _light={{
                    color: selected
                      ? 'primary.600'
                      : theme.colors.dustyGray[700],
                  }}
                  _dark={{
                    color: selected ? 'white' : theme.colors.dustyGray[400],
                  }}
                >
                  {route.title}
                </Text>
              </Center>
              <Box
                _light={{
                  bgColor: selected
                    ? 'secondary.600'
                    : theme.colors.dustyGray[200],
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

  const tabRoutes: Route[] = [
    {
      key: 'meetings',
      title: 'Telehealth Meetings',
      provider: providerDetail as Provider,
      date: provider?.date,
      payloadProviderDetails: provider,
      oldAppointmentDetails: currentAppointmentDetails,
      update: update,
    },
    {
      key: 'about',
      title: 'About the Provider',
      provider: providerDetail as Provider,
      date: provider?.date,
    },
  ];

  return (
    <VStack flex={1} bgColor={bgLight}>
      {update && (
        <Modal.Header borderBottomWidth={0} marginTop={8} h="12">
          <Modal.CloseButton
            onPress={() => {
              navigation.navigate('BookAppointmentScreen', {
                appointmentDetails: {
                  provider_id: currentAppointmentDetails?.provider_id,
                  availability_det_id:
                    currentAppointmentDetails?.availability_det_id,
                  cancellation_notes:
                    currentAppointmentDetails?.cancellation_notes,
                  appointment_date: currentAppointmentDetails?.appointment_date,
                  provider_name: currentAppointmentDetails?.provider_name,
                  additional_notes: currentAppointmentDetails?.additional_notes,
                },
                providerSpeciality: provider?.provider_type,
              });
            }}
          />
        </Modal.Header>
      )}
      {providerDetail && (
        <>
          <VStack pt="29" minWidth="full" flex={1} px="4" space="1">
            <VStack space="3" alignItems="center">
              <Avatar
                bg="gray.600"
                width={140}
                height={140}
                source={{ uri: providerDetail.profile_picture_url as string }}
              />
              <VStack alignItems="center">
                <Text
                  _light={{ color: 'gray.700' }}
                  _dark={{ color: 'white' }}
                  fontWeight={'bold'}
                  fontSize="xl"
                >
                  {`${providerDetail?.first_name} ${providerDetail?.last_name}`}
                </Text>
                <Text
                  _light={{ color: 'DustyGray.900' }}
                  _dark={{ color: 'white' }}
                  fontWeight={'medium'}
                  fontSize="sm"
                >
                  {providerDetail.speciality}
                </Text>
                <Text
                  _light={{ color: 'DustyGray.900' }}
                  _dark={{ color: 'DustyGray.300' }}
                  fontWeight={'medium'}
                  fontSize="sm"
                >
                  {`${providerDetail.city}, ${providerDetail.state}`}
                </Text>
              </VStack>
            </VStack>
          </VStack>
          <VStack flex={2}>
            <TabView
              navigationState={{ index, routes: tabRoutes }}
              renderScene={renderScene}
              onIndexChange={setIndex}
              renderTabBar={renderTabBar}
            />
          </VStack>
        </>
      )}
    </VStack>
  );
};

export default ProviderDetailScreen;
