import { useNavigation } from '@react-navigation/native';
import { Box, Button } from 'native-base';

const SocialHabbitScreen = () => {
  const navigation = useNavigation();

  return (
    <Box>
      <Button onPress={() => navigation.navigate('AddSocialHabbit')}>Healthcare Visit record</Button>
    </Box>
  );
};

export default SocialHabbitScreen;
