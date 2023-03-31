import React, { useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Box, Divider, Icon, Image, Pressable, ScrollView, Text, VStack } from 'native-base';
import shortid from 'shortid';

import { useAuthStore } from '@hooks/useAuthStore';
import { useMoodStore } from '@hooks/useMoodStore';
import { useRefetchOnFocus } from '@hooks/useRefetchOnFocus';
import { useCurrentUser } from '@hooks/useUsers';
import { useGetVitals, useGetVitalSettings } from '@hooks/useVitals';
import theme from '@theme';
import ActionCard from './components/ActionCard';
import DeviceStatus from './components/DeviceStatus';
import Metric from './components/Metric';
import { Mood } from './components/Mood';
import AddCircleIcon from '@assets/icons/add_circle.svg';
import DeviceIcon from '@assets/icons/device.svg';
import HappyIcon from '@assets/icons/happy.svg';
import ChatbotIcon from '@assets/icons/chatbot.svg';
import HealthQuestionnaireImage from '@assets/images/health-questionnaire.svg';

const DashboardScreen = () => {
  const navigation = useNavigation();
  const mood = useMoodStore(state => state.mood);
  const [hideMood, setHideMood] = useState(mood);

  const { alreadyShowBestHealthAction, setAlreadyShowBestHealthAction } = useAuthStore();
  const key = Object.keys(alreadyShowBestHealthAction)[0];

  const { data: currentUser, refetch: refetchCurrentUser } = useCurrentUser();
  useRefetchOnFocus(refetchCurrentUser);

  const validicUserStatus = currentUser?.validic_user_status ?? 'not_connected';

  const { data: vitalSettings } = useGetVitalSettings();
  const { data: vitalData, refetch: refetchVitals } = useGetVitals();
  useRefetchOnFocus(refetchVitals);

  const vitalMetrics = useMemo(() => {
    const shouldShow = (vitalName: string) =>
      vitalSettings?.find(v => v.vital_name.toLowerCase() === vitalName)?.status === 'Enabled' ?? false;

    const metricsToShow = [];

    // Distance
    if (vitalData?.distance_details && shouldShow('distance')) {
      metricsToShow.push({
        imageSource: require('@assets/images/biometric-distance.png'),
        title: 'Distance',
        dataPoints: [
          {
            title: 'Distance traveled today',
            measurements: [
              {
                value: Number(vitalData.distance_details.today).toLocaleString(),
                unit: 'MILES',
              },
            ],
          },
        ],
      });
    }

    // Steps
    if (vitalData?.steps_details && shouldShow('steps')) {
      metricsToShow.push({
        imageSource: require('@assets/images/biometric-steps.png'),
        title: 'Steps',
        dataPoints: [
          {
            title: 'Current step count',
            measurements: [{ value: Number(vitalData.steps_details.today).toLocaleString() }],
          },
        ],
      });
    }

    // Sleep
    if (vitalData?.sleep && shouldShow('sleep')) {
      metricsToShow.push({
        imageSource: require('@assets/images/biometric-sleep.png'),
        title: 'Sleep',
        dataPoints: [
          {
            title: 'Total sleep duration',
            measurements: [{ value: vitalData.sleep.today }],
          },
        ],
      });
    }

    // Heart Rate
    if (vitalData?.heart_rate_details && shouldShow('heart rate')) {
      metricsToShow.push({
        imageSource: require('@assets/images/biometric-heart-rate.png'),
        title: 'Heart Rate',
        dataPoints: [
          {
            title: 'Average',
            measurements: [
              {
                value: Number(vitalData.heart_rate_details.avg_heart_rate).toString(),
                unit: 'BPM',
              },
            ],
          },
          {
            title: 'Min',
            measurements: [
              {
                value: Number(vitalData.heart_rate_details.min_heart_rate).toString(),
                unit: 'BPM',
              },
            ],
          },
          {
            title: 'Max',
            measurements: [
              {
                value: Number(vitalData.heart_rate_details.max_heart_rate).toString(),
                unit: 'BPM',
              },
            ],
          },
        ],
      });

      // Blood Oxygen
      if (vitalData?.spo2_details && shouldShow('spo2')) {
        metricsToShow.push({
          imageSource: require('@assets/images/biometric-oxygen.png'),
          title: 'Blood Oxygen Level',
          dataPoints: [
            {
              title: 'Average SpO2',
              measurements: [
                {
                  value: Number(vitalData.spo2_details.avg_spo2).toString(),
                  unit: '%',
                },
              ],
            },
            {
              title: 'Minimum',
              measurements: [
                {
                  value: Number(vitalData.spo2_details.min_spo2).toString(),
                  unit: '%',
                },
              ],
            },
            {
              title: 'Maximum',
              measurements: [
                {
                  value: Number(vitalData.spo2_details.max_spo2).toString(),
                  unit: '%',
                },
              ],
            },
          ],
        });
      }
    }

    return metricsToShow;
  }, [vitalSettings, vitalData]);

  useEffect(() => {
    if (currentUser) {
      setAlreadyShowBestHealthAction(currentUser.user_id, false);
    }
  }, [currentUser, setAlreadyShowBestHealthAction]);

  return (
    <Box flex={1} _light={{ bg: 'white' }} _dark={{ bg: 'coolGray.800' }}>
      <Image h="10px" w="full" alt="colorful-separator" source={require('@assets/images/colorful-separator.png')} />
      <ScrollView bounces={false}>
        {!mood || !hideMood ? <Mood onClose={() => setHideMood(true)} /> : null}
        <VStack p="4" space="8">
          {!alreadyShowBestHealthAction[key] && (
            <ActionCard
              variant="primary"
              titleImage={<HealthQuestionnaireImage />}
              title="Guiding you to your next best health action"
              description="Ready to start improving your life? HealthBook+ gives you the ability to own, control and manage your family’s health care and wellness."
              buttonText="Take Health Questionnaire"
              buttonOnPress={() => {
                navigation.navigate('Questionnaire');
                if (currentUser) {
                  setAlreadyShowBestHealthAction(currentUser.user_id, true);
                }
              }}
            />
          )}
          {['Connected', 'Synced'].includes(validicUserStatus) === false ? (
            <ActionCard
              variant="primary"
              title="My Health Dashboard"
              description="Connect your wearable devices so we can analyze your health and recommend your next best health action."
              descriptionLinkText="Check supported devices."
              descriptionLinkOnPress={() => {}}
              buttonText="Connect a Device"
              buttonOnPress={() => navigation.navigate('ConnectDevice')}
            />
          ) : (
            <DeviceStatus noData={!vitalMetrics.length} />
          )}
        </VStack>
        {vitalMetrics.length > 0 ? (
          <>
            <Divider />
            {vitalMetrics.map(metric => (
              <Box key={shortid.generate()}>
                <Box p="4">
                  <Metric {...metric} />
                </Box>
                <Divider />
              </Box>
            ))}
          </>
        ) : null}
        <VStack p="4" space="4">
          <ActionCard
            variant="primary"
            title="Connected Health"
            description="HealthBook+  consolidates and analyzes all your electronic health information to get a complete picture of your health and wellbeing."
            buttonText="Connect provider or health plan"
            buttonOnPress={() => navigation.navigate('ConnectedHealth')}
          />
        </VStack>
      </ScrollView>

      <Box position="absolute" right="0" alignItems="center" top="1/2" flexDirection="column" justifyContent="center">
        <Pressable
          bgColor="secondary.600"
          style={{ transform: [{ rotate: '-90deg' }, { translateY: 30 }] }}
          flexDirection="row"
          p="2.5"
          roundedTop="sm"
          onPress={() => console.log('go to chat field')}
        >
          <ChatbotIcon />
          <Text fontWeight="bold" fontSize="2xs" color="white" ml="1">
            CHATBOT
          </Text>
        </Pressable>
      </Box>
    </Box>
  );
};

export default DashboardScreen;
