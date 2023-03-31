import { Text, VStack } from 'native-base';
import React from 'react';
import { Provider } from 'services/types';
interface IProps {
  route: {
    provider: Provider;
  };
}

export const About: React.FC<IProps> = ({ route: { provider } }) => {
  return (
    <VStack>
      <Text fontSize="sm" fontWeight="bold">
        About{' '}
        {`${provider.first_name} ${provider.last_name}, ${provider.speciality}`}
      </Text>
      <Text mb="5">{provider.biography}</Text>
    </VStack>
  );
};
