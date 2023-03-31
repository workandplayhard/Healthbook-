import { useNavigation } from '@react-navigation/native';
import { Box, Button } from 'native-base';

const AllergyScreen = () => {
  const navigation = useNavigation();

  return (
    <Box>
      <Button onPress={() => navigation.navigate('AddAllergy')}>
        Add allergy record
      </Button>
    </Box>
  );
};

export default AllergyScreen;
