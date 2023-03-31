import { useEffect } from 'react';
import { Platform } from 'react-native';

import ValidicAggregatorFit from 'react-native-validic-aggregator-fit';
import ValidicHealthKit from 'react-native-validic-aggregator-ios';
import ValidicSession, { ValidicLog } from 'react-native-validic-session';

import { useCurrentUser } from '@hooks/useUsers';

const Validic = () => {
  const { data: currentUser } = useCurrentUser();

  useEffect(() => {
    ValidicLog.enable();

    console.log('validic session version : %s ', ValidicSession.version);

    if (Platform.OS === 'ios') {
      ValidicHealthKit.getCurrentSubscriptions(subscriptions => {
        console.log('validic current subscriptions: %s', subscriptions);
      });
      ValidicHealthKit.observeCurrentSubscriptions();
    }

    if (Platform.OS === 'android') {
      ValidicAggregatorFit.currentSubscriptions().then(subscriptions => {
        console.log('validic current subscriptions: %s', subscriptions);
      });
    }
  }, []);

  useEffect(() => {
    ValidicSession.getUser().then(async validicSessionUser => {
      if (validicSessionUser) {
        console.log('validic user : %s', JSON.stringify(validicSessionUser));

        if (currentUser && currentUser.validic_user && currentUser.validic_user.id !== validicSessionUser.user_id) {
          if (Platform.OS === 'ios') {
            ValidicHealthKit.setSubscriptions([]);
          }

          if (Platform.OS === 'android') {
            ValidicAggregatorFit.disconnect();
          }

          ValidicSession.endSession();
        }

        if (Platform.OS === 'ios') {
          ValidicHealthKit.getCurrentSubscriptions(subscriptions => {
            console.log('validic current subscriptions: %s', subscriptions);
          });
          ValidicHealthKit.observeCurrentSubscriptions();
        }

        if (Platform.OS === 'android') {
          ValidicAggregatorFit.currentSubscriptions().then(subscriptions => {
            console.log('validic current subscriptions: %s', subscriptions);
          });
        }
      }
    });
  }, [currentUser]);

  return null;
};

export default Validic;
