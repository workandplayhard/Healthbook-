import React, { useCallback, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

import { useNavigation } from '@react-navigation/core';
import { Box, Button, Center, Spinner } from 'native-base';
import Config from 'react-native-config';
import { DataType, ValidicAggregatorFit } from 'react-native-validic-aggregator-fit';
import ValidicHealthKit, { SampleTypes } from 'react-native-validic-aggregator-ios';
import ValidicSession from 'react-native-validic-session';
import { WebView } from 'react-native-webview';

import { useCurrentUser } from '@hooks/useUsers';
import { useGetValidicUserMarketplace } from '@hooks/useVitals';

const VALIDIC_ORG_ID = Config.VALIDIC_ORG_ID || '';

const ConnectDevice = () => {
  const navigation = useNavigation();
  const { data, isLoading } = useGetValidicUserMarketplace();
  const { data: currentUser } = useCurrentUser();

  const [isConnected, setIsConnected] = React.useState(false);

  useEffect(() => {
    ValidicSession.getUser().then(validicSessionUser => {
      if (validicSessionUser) {
        setIsConnected(true);
      }
    });
  }, []);

  const handleConnectAppleHealth = useCallback(async () => {
    if (
      currentUser &&
      currentUser.validic_user &&
      currentUser.validic_user.id &&
      currentUser.validic_user.mobile &&
      currentUser.validic_user.mobile.token
    ) {
      const user = {
        user_id: currentUser.validic_user.id,
        org_id: VALIDIC_ORG_ID,
        user_token: currentUser.validic_user.mobile.token,
      };

      await ValidicSession.startSession(user);

      console.log('Started Session for user: ' + user.user_id);

      ValidicHealthKit.setSubscriptions([
        SampleTypes.HKQuantityTypeIdentifierStepCount,
        SampleTypes.HKQuantityTypeIdentifierDistanceWalkingRunning,
        SampleTypes.HKQuantityTypeIdentifierHeartRate,
        SampleTypes.HKQuantityTypeIdentifierOxygenSaturation,
        SampleTypes.HKCategoryTypeIdentifierSleepAnalysis,
      ]);

      ValidicHealthKit.observeCurrentSubscriptions();

      navigation.goBack();
    }
  }, [currentUser, navigation]);

  const handleConnectGoogleHealth = useCallback(async () => {
    if (
      currentUser &&
      currentUser.validic_user &&
      currentUser.validic_user.id &&
      currentUser.validic_user.mobile &&
      currentUser.validic_user.mobile.token
    ) {
      const user = {
        user_id: currentUser.validic_user.id,
        org_id: VALIDIC_ORG_ID,
        user_token: currentUser.validic_user.mobile.token,
      };

      await ValidicSession.startSession(user);

      let permissionGranted = await PermissionsAndroid.check('android.permission.ACTIVITY_RECOGNITION');
      if (!permissionGranted) {
        const requestPermission = await PermissionsAndroid.request('android.permission.ACTIVITY_RECOGNITION', {
          title: 'HealthBook Plus',
          message: 'HealthBook Plus needs access to Activity Recognition',
          buttonPositive: 'OK',
        });

        if (requestPermission !== PermissionsAndroid.RESULTS.GRANTED) {
          return;
        }
      }

      const res = await ValidicAggregatorFit.requestPermissions([
        DataType.DataTypeStepCount,
        DataType.DataTypeDistance,
        DataType.DataTypeHeartRate,
      ]);

      console.log('validic request permissions: %s', res);

      ValidicAggregatorFit.subscribe([
        DataType.DataTypeStepCount,
        DataType.DataTypeDistance,
        DataType.DataTypeHeartRate,
      ]);

      ValidicAggregatorFit.currentSubscriptions().then(subscriptions => {
        console.log('validic current subscriptions: %s', subscriptions);
      });

      navigation.goBack();
    }
  }, [currentUser, navigation]);

  const handleDisconnectGoogleHealth = useCallback(() => {
    ValidicAggregatorFit.disconnect();
    ValidicSession.endSession();
    setIsConnected(false);
  }, []);

  if (isLoading || !data) {
    return (
      <Center flex={1}>
        <Spinner size="sm" />
      </Center>
    );
  }

  return (
    <>
      {Platform.OS === 'ios' && currentUser?.validic_user ? (
        <Box p="4">
          <Button onPress={handleConnectAppleHealth}>Connect Apple Health</Button>
        </Box>
      ) : null}
      {Platform.OS === 'android' && currentUser?.validic_user ? (
        <Box p="4">
          {isConnected ? (
            <Button onPress={handleDisconnectGoogleHealth}>Disconnect Google Fit</Button>
          ) : (
            <Button onPress={handleConnectGoogleHealth}>Connect Google Fit</Button>
          )}
        </Box>
      ) : null}
      <WebView startInLoadingState={true} source={{ uri: data.marketplace_url }} />
    </>
  );
};

export default ConnectDevice;
