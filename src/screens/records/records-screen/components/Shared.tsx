import React from 'react';
import { Box, Button, HStack, Icon, Text, VStack } from 'native-base';
import { Divider } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import MessageIcon from '@assets/icons/record-message.svg';
import { useSharedRecords } from 'hooks/useHealthRecord';
import SharedItem from './SharedItem';

const SharedRecords = () => {
  const { data: records = [] } = useSharedRecords();

  return (
    <KeyboardAwareScrollView>
      <Box p="4">
        <VStack>
          <Text fontSize="sm" fontWeight="500">
            You can share a link with limited access to your health records with
            a family member, caretaker or provider.
          </Text>
          <Button variant="solid" marginTop="10px" height="45px">
            <HStack alignItems="center" justifyContent="center">
              <Icon
                size="6"
                as={MessageIcon}
                _light={{ background: 'primary.600' }}
                _dark={{ color: 'coolGray.100' }}
              />
              <Text
                color="white"
                fontWeight="500"
                fontSize="sm"
                paddingLeft="10px"
              >
                Share Link To My Records
              </Text>
            </HStack>
          </Button>
        </VStack>
      </Box>
      <Divider />

      {records.map(item => (
        <SharedItem item={item} key={item.record_id} />
      ))}
    </KeyboardAwareScrollView>
  );
};

export default SharedRecords;
