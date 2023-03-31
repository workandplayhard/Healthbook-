import React, { useMemo } from 'react';
import { Alert } from 'react-native';
import { Box, HStack, Pressable, Text, VStack } from 'native-base';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';

import theme from '@theme';
import Attachment from '@assets/icons/attachment.svg';
import AttachmentInactive from '@assets/icons/attachment-inactive.svg';

import type { SharedDocument } from '@services/types';

const SharedDocumentItem = ({ data }: { data: SharedDocument }) => {
  const { document_name, is_deleted, expiry_date, recipient_name } = data;
  const navigation = useNavigation();

  const inactive = useMemo(() => is_deleted || dayjs().isAfter(dayjs(expiry_date)), [is_deleted, expiry_date]);

  const handleOpen = () => {
    if (is_deleted) return Alert.alert('Could not open file.', 'File wes deleted.');

    navigation.navigate('Viewer', { data });
  };

  return (
    <Pressable px={5} py={4} borderBottomWidth="1px" borderBottomColor="dustyGray.300" onPress={handleOpen}>
      <HStack alignItems="center" mb={1}>
        <Text fontSize="14px" fontWeight={700} color="dustyGray.900" _dark={{ color: 'white' }} flex={8}>
          {document_name}
        </Text>
        <Box flex={2} flexDirection="row" justifyContent="flex-end">
          {inactive ? <AttachmentInactive fill="#DC2626" /> : <Attachment fill={theme.colors.secondary[600]} />}
        </Box>
      </HStack>
      <HStack justifyContent="space-between">
        <VStack>
          <Text fontSize="12px" fontWeight={500} color="dustyGray.500">
            RECIPIENT
          </Text>
          <Text fontSize="14px" fontWeight={500} color="dustyGray.900" _dark={{ color: 'white' }}>
            {recipient_name}
          </Text>
        </VStack>
        <VStack>
          <Text fontSize="12px" fontWeight={500} color="dustyGray.500">
            EXPIRATION DATE
          </Text>
          <Text fontSize="14px" fontWeight={500} color="dustyGray.900" _dark={{ color: 'white' }}>
            {dayjs(expiry_date).format('MM/DD/YYYY')}
          </Text>
        </VStack>
      </HStack>
    </Pressable>
  );
};

export default SharedDocumentItem;
