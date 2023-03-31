import { useNavigation } from '@react-navigation/native';
import { Box, Button } from 'native-base';

const TravelHistoryScreen = () => {
  const navigation = useNavigation();

  return (
    <Box>
      <Button onPress={() => navigation.navigate('AddTravelHistory')}>
        Add travel history record
      </Button>
    </Box>
  );
};

export default TravelHistoryScreen;
