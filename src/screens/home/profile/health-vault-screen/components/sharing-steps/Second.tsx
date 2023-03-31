import React, { useState } from 'react';
import { Box, Button, HStack, Text, VStack, Checkbox } from 'native-base';

import EncryptIcon from '@assets/icons/encrypt.svg';
import theme from 'theme';
import { useRelationsAndDurations } from 'hooks/useHealthVault';

import type { RecipientFormValues } from './First';

type SecondStepProps = {
  onNext: () => void;
  onBack: () => void;
  data: RecipientFormValues;
};

const Second: React.FC<SecondStepProps> = ({ onNext, onBack, data }) => {
  const [authorized, setAuthorized] = useState(false);

  const { data: relationsAndDurationsData } = useRelationsAndDurations();

  return (
    <Box>
      <Text fontSize="18px" fontWeight={700} mb={5}>
        You are about to share a link to your documents.
      </Text>
      <VStack space={8}>
        <Text fontSize="14px" fontWeight={500}>
          An email invite will be sent to
        </Text>
        <Text fontSize="14px" fontWeight={700}>
          {data.email}
        </Text>
        <Text fontSize="14px" fontWeight={500}>
          with a private link that will expire in 24 hours. Your recipient must click on the link and enter your date of
          birth before viewing your documents.
        </Text>
        <HStack space={2} alignItems="flex-start">
          <EncryptIcon fill={theme.colors.dustyGray[500]} />
          <Text fontSize="14px" fontWeight={700}>
            {data.name} will have read-only access to your documents for{' '}
            {relationsAndDurationsData?.Duration.find(item => item.id === parseInt(data.duration))?.duration_view}.
          </Text>
        </HStack>
        <Checkbox
          value=""
          isChecked={authorized}
          onChange={setAuthorized}
          _text={{ fontSize: '14px', fontWeight: 500 }}
          _dark={{ _text: { color: 'white' } }}
        >
          I am authorized to share these documents under applicable law.
        </Checkbox>
      </VStack>
      <HStack mt={5} space={4}>
        <Button variant="outline" onPress={onBack}>
          Back
        </Button>
        <Button onPress={onNext} flex={1} isDisabled={!authorized}>
          Next
        </Button>
      </HStack>
    </Box>
  );
};

export default Second;
