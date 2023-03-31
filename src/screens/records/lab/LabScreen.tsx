import { useNavigation } from '@react-navigation/native';
import { Box, Button } from 'native-base';

const LabScreen = () => {
  const navigation = useNavigation();

  return (
    <Box>
      <Button onPress={() => navigation.navigate('AddLab')}>
        Add lab record
      </Button>
    </Box>
  );
};

export default LabScreen;
