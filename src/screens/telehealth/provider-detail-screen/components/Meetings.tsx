import React, { useEffect, useState } from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  HStack,
  Icon,
  Text,
  VStack,
  Box,
  Button,
  useColorMode,
} from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Provider } from 'services/types';
import { AppointmentDataType } from 'navigation/types';
import dayjs from 'dayjs';
import { useGetProviderDetail } from 'hooks/useProvider';

type payload = {
  date: string | undefined;
  provider_type: string | undefined;
  provider_id: number | undefined;
};

type MeetingProps = {
  route: {
    provider: Provider;
    date: string;
    update: boolean | undefined | null;
    oldAppointmentDetails?: AppointmentDataType;
    payloadProviderDetails: payload;
  };
};

export const Meetings: React.FC<MeetingProps> = ({
  route: {
    provider,
    date,
    update,
    oldAppointmentDetails,
    payloadProviderDetails,
  },
}) => {
  const [show, setShow] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(date));
  const [newDate, setNewDate] = useState<string>(
    dayjs(date).format('YYYY-MM-DD'),
  );
  const [data, setData] = useState<Provider | undefined>(provider);
  const [mode, setMode] = useState('date');
  const { colorMode, toggleColorMode } = useColorMode();
  // const { mutate: newProviderDetails, isLoading } = useUpdateProviderDetail();
  const navigation = useNavigation();
  const [providerType, setProviderType] = useState(
    payloadProviderDetails?.provider_type,
  );

  const [providerId, setProviderId] = useState(
    payloadProviderDetails?.provider_id,
  );
  const { data: providerDetail } = useGetProviderDetail({
    provider_id: providerId,
    date: dayjs(selectedDate).format('YYYY-MM-DD'),
    provider_type: providerType,
  });
  const onChange = (event: any, value: any) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    setSelectedDate(value);
  };
  useEffect(() => {
    setData(providerDetail);
  }, [providerDetail, selectedDate]);

  return (
    <VStack>
      {Platform.OS === 'android' ? (
        <Box>
          <TouchableOpacity
            onPress={() => {
              setShow(true);
            }}
            activeOpacity={1}
          >
            <HStack alignItems="center" space="2">
              <Icon
                size="6"
                as={MaterialIcons}
                name={'calendar-today'}
                _dark={{ color: 'tertiary.600' }}
                _light={{ color: 'primary.600' }}
              />

              <Text
                _dark={{ color: 'tertiary.600', fontWeight: 'bold' }}
                _light={{ color: 'primary.600', fontWeight: 'bold' }}
              >
                {dayjs(selectedDate).format('MMMM D, YYYY')}
              </Text>
            </HStack>
          </TouchableOpacity>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={new Date(selectedDate)}
              themeVariant={colorMode == 'dark' ? 'dark' : 'light'}
              display={'default'}
              mode="date"
              is24Hour={true}
              onChange={onChange}
            />
          )}
        </Box>
      ) : (
        <Box>
          <HStack alignItems="center" space="2">
            <Icon
              size="6"
              as={MaterialIcons}
              name={'calendar-today'}
              _dark={{ color: 'tertiary.600' }}
              _light={{ color: 'primary.600' }}
            />

            <DateTimePicker
              testID="dateTimePicker"
              value={new Date(selectedDate)}
              themeVariant={colorMode == 'dark' ? 'dark' : 'light'}
              display={Platform.OS == 'ios' ? 'default' : 'default'}
              mode="date"
              is24Hour={true}
              onChange={onChange}
            />
          </HStack>
        </Box>
      )}
      <HStack flexWrap="wrap" mt="4">
        {data?.available_slots?.slot ? (
          data?.available_slots?.slot.map(slot => {
            if (!slot?.isBooked) {
              return (
                <Box px="0.5" key={slot.availability_det_id} width="25%">
                  <Button
                    textAlign="center"
                    _light={{ bgColor: 'primary.600' }}
                    _dark={{ bgColor: 'tertiary.600' }}
                    mb="2"
                    flexShrink={1}
                    borderRadius="2"
                    onPress={() =>
                      navigation.navigate('ConfirmAppointmentScreen', {
                        payloadData: {
                          name: `${data?.first_name} ${data.last_name}`,
                          date: data?.available_slots?.date,
                          providerId: data?.provider_id,
                          speciality: data?.speciality,
                          slots: slot,
                          credentials: data?.credentials,
                          doxyLink: data?.doxy_me_link,
                        },
                        update: update,
                        oldAvailabilityDetId:
                          oldAppointmentDetails?.availability_det_id,
                        oldAppointmentDate:
                          oldAppointmentDetails?.appointment_date,
                      })
                    }
                    py="2.5"
                    px="0"
                    fontWeight="bold"
                    color="white"
                  >
                    {slot.start_time}
                  </Button>
                </Box>
              );
            }
          })
        ) : (
          <Text textAlign="center" w="full">
            No availability for this date
          </Text>
        )}
      </HStack>
    </VStack>
  );
};
