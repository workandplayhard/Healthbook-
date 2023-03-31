import React, { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Dimensions, ViewStyle, ImageStyle } from 'react-native';
import PagerView, { PagerViewOnPageScrollEventData } from 'react-native-pager-view';
import { Box, Button, Center, Text, Image, VStack, AspectRatio, ScrollView } from 'native-base';
import { SlidingDot } from 'react-native-animated-pagination-dots';

import { useCurrentUser, useUpdateCurrentUser } from 'hooks/useUsers';
import { useAuthStore } from 'hooks/useAuthStore';
import { useNavigation } from '@react-navigation/native';

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

const welcomeIllustrationImage = require('@assets/images/Welcome01.png');
const secureMessagingImage = require('@assets/images/Welcome03.png');
const symptomCheckerImage = require('@assets/images/Welcome02.png');
const healthCheckupImage = require('@assets/images/Welcome04.png');
const { width } = Dimensions.get('window');

const WelcomeScreen = () => {
  const { data: currentUser, isLoading, isError } = useCurrentUser();
  const { mutate: updateCurrentUser } = useUpdateCurrentUser();
  const clear = useAuthStore(state => state.clear);

  const navigation = useNavigation();

  useEffect(() => {
    return navigation.addListener('focus', () => {
      updateCurrentUser({ settings: { ...currentUser?.settings, welcomed: true } });
    });
  }, [navigation, currentUser]);

  useEffect(() => {
    if (isError) clear();
  }, [isError]);

  const i18n = useTranslation();

  const pageData = useMemo(() => {
    return [
      {
        key: '1',
        title: i18n.t('welcome_title', { name: currentUser?.first_name }),
        image: welcomeIllustrationImage,
        altImage: 'welcome-illustration',
        description: i18n.t('welcome_description'),
      },
      {
        key: '2',
        image: symptomCheckerImage,
        altImage: 'symptom-checker',
        title: i18n.t('symptom_checker_title'),
        description: i18n.t('symptom_checker_description'),
      },
      // {
      //   key: '3',
      //   title: i18n.t('health_provider_title'),
      //   image: secureMessagingImage,
      //   altImage: 'secure-messaging',
      //   description: i18n.t('health_provider_description'),
      // },
      {
        key: '4',
        title: i18n.t('predictive_analytics_title'),
        image: healthCheckupImage,
        altImage: 'health-checkup',
        description: i18n.t('predictive_analytics_description'),
        button: (
          <Box width="full" px={5} mt={12}>
            <Button
              mb={24}
              onPress={() =>
                navigation.navigate('TabNavigator', {
                  screen: 'HomeTab',
                  params: { screen: 'Dashboard' },
                })
              }
            >
              Get Started
            </Button>
          </Box>
        ),
      },
    ];
  }, [i18n, currentUser, isLoading, navigation]);

  const ref = useRef<PagerView>(null);
  const scrollOffsetAnimatedValue = useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = useRef(new Animated.Value(0)).current;
  const inputRange = [0, pageData.length];
  const scrollX = Animated.add(scrollOffsetAnimatedValue, positionAnimatedValue).interpolate({
    inputRange,
    outputRange: [0, pageData.length * width],
  });

  const onPageScroll = useMemo(
    () =>
      Animated.event<PagerViewOnPageScrollEventData>(
        [
          {
            nativeEvent: {
              offset: scrollOffsetAnimatedValue,
              position: positionAnimatedValue,
            },
          },
        ],
        {
          useNativeDriver: false,
        },
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const pages = useMemo(
    () =>
      pageData.map(({ key, description, title, image, button, altImage }) => (
        <ScrollView
          key={key}
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 48,
          }}
        >
          <VStack space={12}>
            <Box height="20" mt={7}>
              <Text fontSize="lg" textAlign="center" fontWeight="bold" px={5}>
                {title}
              </Text>
            </Box>

            <Box px={12}>
              <AspectRatio width="100%">
                <Image source={image} resizeMode="contain" alt={altImage} width="100%" height="100%" />
              </AspectRatio>
            </Box>

            <Text fontSize="md" px="9">
              {description}
            </Text>
          </VStack>

          {button}
        </ScrollView>
      )),
    [pageData],
  );

  if (isLoading) {
    return (
      <Box>
        <Text>Loading...</Text>
      </Box>
    );
  }

  return (
    <VStack flex={1} justifyContent="space-between" _light={{ bgColor: 'white' }} _dark={{ bgColor: 'coolGray.800' }}>
      <AnimatedPagerView initialPage={0} style={$pagerView} ref={ref} onPageScroll={onPageScroll}>
        {pages}
      </AnimatedPagerView>

      <Center>
        <SlidingDot
          marginHorizontal={8}
          containerStyle={$slidingDotContainer}
          data={pageData}
          //@ts-ignore
          scrollX={scrollX}
          dotSize={20}
        />
      </Center>
    </VStack>
  );
};

export default WelcomeScreen;

const $pagerView: ViewStyle = {
  flex: 1,
};

const $slidingDotContainer: ViewStyle = { bottom: 48 };
