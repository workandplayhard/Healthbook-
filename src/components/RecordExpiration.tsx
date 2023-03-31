import React from 'react';
import { Text, HStack, VStack } from 'native-base';

interface RecordExpirationProps {
  start: string;
  end: string;
}

export const RecordExpiration: React.FC<RecordExpirationProps> = ({
  start,
  end,
}) => {
  return (
    <>
      <HStack alignItems="center" justifyContent="space-between">
        <VStack marginTop="4px">
          <Text fontSize="sm" fontWeight="500" color="#ADADAD">
            DATE SHARED
          </Text>
          <Text
            fontSize="sm"
            fontWeight="500"
            color="3D3D3D"
            marginTop="4px"
            _dark={{ color: 'white' }}
          >
            {start}
          </Text>
        </VStack>

        <VStack>
          <Text fontSize="sm" fontWeight="500" color="#ADADAD">
            EXPIRATION DATE
          </Text>
          <Text
            fontSize="sm"
            fontWeight="500"
            color="3D3D3D"
            marginTop="4px"
            _dark={{ color: 'white' }}
          >
            {end}
          </Text>
        </VStack>
      </HStack>
    </>
  );
};
