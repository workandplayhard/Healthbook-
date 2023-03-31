import { HStack, Text, VStack } from 'native-base';
import React from 'react';

type ReceivedDocumentProps = {
  data: ReceivedDocument;
};

type Document = {
  id: number;
  fileName: string;
};

type ReceivedDocument = {
  id: number;
  document: Document;
  sender: Sender;
  expirationDateString: string;
};

type Sender = {
  id: number;
  name: string;
};

const ReceivedDocument = ({ data }: ReceivedDocumentProps) => {
  const { expirationDateString, document, sender } = data;

  return (
    <VStack
      px={5}
      py={4}
      borderBottomWidth="1px"
      borderBottomColor="dustyGray.300"
    >
      <Text
        fontSize="14px"
        fontWeight={700}
        color="dustyGray.900"
        _dark={{ color: 'white' }}
      >
        {document.fileName}
      </Text>
      <HStack justifyContent="space-between">
        <VStack>
          <Text fontSize="12px" fontWeight={500} color="dustyGray.500">
            SENDER
          </Text>
          <Text
            fontSize="14px"
            fontWeight={500}
            color="dustyGray.900"
            _dark={{ color: 'white' }}
          >
            {sender.name}
          </Text>
        </VStack>
        <VStack>
          <Text fontSize="12px" fontWeight={500} color="dustyGray.500">
            EXPIRATION DATE
          </Text>
          <Text
            fontSize="14px"
            fontWeight={500}
            color="dustyGray.900"
            _dark={{ color: 'white' }}
          >
            {expirationDateString}
          </Text>
        </VStack>
      </HStack>
    </VStack>
  );
};

export default ReceivedDocument;
