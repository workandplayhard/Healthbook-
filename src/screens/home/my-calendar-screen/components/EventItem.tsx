import dayjs from 'dayjs';
import { HStack, Pressable, Text, VStack } from 'native-base';
import { PatientAppointmentDetail } from 'services/types';
import theme from 'theme';

const EventItem: React.FC<{
  item: PatientAppointmentDetail;
  onPress?: () => void;
}> = ({ item: { appointment_time, provider_name }, onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <VStack
        mx={4}
        p={2.5}
        borderWidth={1}
        borderColor={theme.colors.glacier[600]}
        borderRadius={4}
        _light={{ bgColor: 'white' }}
        _dark={{ bgColor: 'coolGray.900' }}
      >
        <HStack
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Text fontSize="md" fontWeight="bold">
            Telehealth Meeting
          </Text>
          <Text fontSize="sm" fontWeight="bold" color={theme.colors.glacier[600]}>
            {dayjs(appointment_time, 'hh:mm:ss').format('h:mm A')}
          </Text>
        </HStack>
        <Text fontSize="sm" _dark={{ color: theme.colors.dustyGray[500] }}>
          {provider_name}
        </Text>
      </VStack>
    </Pressable>
  );
};

export default EventItem;
