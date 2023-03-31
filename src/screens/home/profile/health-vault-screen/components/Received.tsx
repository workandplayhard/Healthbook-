import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Text,
  VStack,
  Button,
  HStack,
  useColorMode,
  FlatList,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';

import theme from '@theme';
import ReceivedDocument from './ReceivedDocument';
import { receivedDocuments, myDocuments, users } from './data';

import { useNotification } from '@hooks/useNotification';
import DownloadIcon from '@assets/icons/download.svg';
import DocumentIcon from '@assets/icons/documents.svg';

const Received = () => {
  const { colorMode } = useColorMode();
  const navigation = useNavigation();
  const { setNotification } = useNotification()

  const list = useMemo(() => {
    return receivedDocuments
      .map(item => {
        const expirationDate = dayjs(item.sharedAt).add(
          dayjs.duration({ days: item.expirationDuration }),
        );

        const document = myDocuments.find(({ id }) => item.document === id)!;

        const sender = users.find(({ id }) => item.sender === id)!;

        return {
          ...item,
          document,
          sender,
          expirationDateString: expirationDate.format('DD/MM/YYYY'),
          inactive: expirationDate.isAfter(dayjs()) || document.deleted,
        };
      })
      .filter(item => !item.inactive);
  }, [receivedDocuments, myDocuments, users]);
  let listCount = list.length;

  useEffect(() => {
    if (listCount < list.length) {
      setNotification(true);
      listCount = list.length;
    } else {
      setNotification(false);
    }
  }, []);

  return (
    <Box flex={1} py={4}>
      <Button
        variant="outline"
        mx={6}
        onPress={() => navigation.navigate('AccessDocumentScreen')}
      >
        <HStack alignItems="center" justifyContent="center">
          <DownloadIcon
            fill={
              colorMode === 'light'
                ? theme.colors.primary[600]
                : theme.colors.dustyGray[300]
            }
          />
          <Text ml={3} color="primary.600" _dark={{ color: 'dustyGray.300' }}>
            You've Received New Documents
          </Text>
        </HStack>
      </Button>
      {list.length > 0 ? (
        <FlatList
          data={list}
          keyExtractor={item => `${item.id}`}
          renderItem={({ item }) => <ReceivedDocument data={item} />}
        />
      ) : (
        <VStack alignItems="center" mt="40%">
          <DocumentIcon fill={theme.colors.dustyGray[600]} />
          <Text color="dustyGray.500" fontWeight={500} fontSize="14px" mt={5}>
            There are no documents being shared with you.
          </Text>
        </VStack>
      )}
    </Box>
  );
};

export default Received;
