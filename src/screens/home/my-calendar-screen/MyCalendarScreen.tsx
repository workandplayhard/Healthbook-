import { useMemo, useState } from 'react';
import { Center, HStack, Icon, IconButton, Text, VStack, ScrollView } from 'native-base';
import dayjs from 'dayjs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import theme from '@theme';
import { useCurrentUser } from '@hooks/useUsers';
import DateItem from './components/DateItem';
import EventItem from './components/EventItem';

import type { PatientAppointmentDetail } from '@services/types';

type EventsPerDay = { [prop: string]: Array<PatientAppointmentDetail> };

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MyCalendarScreen = () => {
  const [date, setDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const { data: currentUser } = useCurrentUser();

  const weeksInCalendar = useMemo(() => {
    const dates: Array<string[]> = [];
    let datesInWeek: Array<string> = [];

    const monthStart = date.startOf('month');
    const getDayOfMonthStart = monthStart.day();

    for (let i = 0; i < 35; i++) {
      datesInWeek.push(monthStart.add(i - getDayOfMonthStart, 'd').format('YYYY-MM-DD'));

      if (datesInWeek.length === 7) {
        dates.push(datesInWeek);
        datesInWeek = [];
      }
    }

    return dates;
  }, [date]);

  const eventsPerday = useMemo<EventsPerDay>(() => {
    return (
      currentUser?.patient_appointment_details?.reduce((res, item) => {
        return !res[item.appointment_date]
          ? { ...res, [item.appointment_date as string]: [item] }
          : {
              ...res,
              [item.appointment_date]: [...res[item.appointment_date], item],
            };
      }, {} as EventsPerDay) || {}
    );
  }, [currentUser]);

  const eventList = useMemo(() => {
    return (eventsPerday[date.format('YYYY-MM-DD')] || [])
      .sort((a, b) => {
        const diff = dayjs(`2000-01-01 ${a.appointment_time}`, 'YYYY-MM-DD hh:mm:ss').diff(
          dayjs(`2000-01-01 ${b.appointment_time}`, 'YYYY-MM-DD hh:mm:ss'),
        );

        return diff > 0 ? 1 : diff === 0 ? 0 : -1;
      })
      .map((item, index) => <EventItem key={index} item={item} />);
  }, [date]);

  return (
    <ScrollView flex={1} _light={{ bgColor: theme.colors.botticelli[300] }} _dark={{ bgColor: 'coolGray.800' }}>
      <VStack py={4} _light={{ bgColor: 'white' }} _dark={{ bgColor: 'coolGray.900' }} space={4}>
        <HStack justifyContent="space-between" alignItems="center" px={3.5}>
          <IconButton
            colorScheme="light"
            variant="ghost"
            width={30}
            height={30}
            borderWidth={1}
            borderColor={theme.colors.botticelli[600]}
            onPress={() => setDate(date => date.add(-1, 'month'))}
            borderRadius={4}
            icon={
              <Icon
                as={MaterialIcons}
                name="chevron-left"
                _light={{ color: 'primary.600' }}
                _dark={{ color: 'tertiary.600' }}
              />
            }
          />

          <VStack justifyContent="center" alignItems="center">
            <Text
              fontSize="xl"
              fontWeight="medium"
              _light={{
                color: theme.colors.dustyGray[900],
              }}
              _dark={{
                color: 'white',
              }}
            >
              {date.format('MMMM')}
            </Text>

            <Text fontSize="sm" fontWeight="medium" color={theme.colors.dustyGray[600]}>
              {date.format('YYYY')}
            </Text>
          </VStack>

          <IconButton
            colorScheme="light"
            variant="ghost"
            width={30}
            height={30}
            borderWidth={1}
            borderColor={theme.colors.botticelli[600]}
            onPress={() => setDate(date => date.add(1, 'month'))}
            borderRadius={4}
            icon={
              <Icon
                as={MaterialIcons}
                name="chevron-right"
                _light={{ color: 'primary.600' }}
                _dark={{ color: 'tertiary.600' }}
              />
            }
          />
        </HStack>

        <HStack px={4} justifyContent="space-between">
          {daysOfWeek.map(day => (
            <DateItem isHeader bold key={day}>
              {day}
            </DateItem>
          ))}
        </HStack>

        {weeksInCalendar.map((datesInWeek, index) => (
          <HStack px={4} justifyContent="space-between" key={index}>
            {datesInWeek.map((day, index) => (
              <DateItem
                key={index}
                bold={dayjs(day).isSame(dayjs(), 'day')}
                selected={selectedDate.isSame(dayjs(day), 'day')}
                onPress={() => {
                  setSelectedDate(dayjs(day));
                }}
                border={eventsPerday[day]?.length > 0}
                secondary={!date.isSame(dayjs(day), 'M')}
              >
                {dayjs(day).date()}
              </DateItem>
            ))}
          </HStack>
        ))}
      </VStack>

      {eventList.length ? (
        <VStack mt={5} space={3}>
          {eventList}
        </VStack>
      ) : (
        <Center mt={10}>
          <Text fontSize="sm">Nothing scheduled on this day.</Text>
        </Center>
      )}
    </ScrollView>
  );
};

export default MyCalendarScreen;
