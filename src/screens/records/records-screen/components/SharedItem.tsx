import React, { useState } from 'react';
import { RecordExpiration } from 'components/RecordExpiration';
import {
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  Modal,
  Pressable,
  Text,
  useToast,
  VStack,
} from 'native-base';
import type { SharedRecord } from 'services/types';

import RecordApproveIcon from '@assets/icons/record-approve.svg';
import RecordDisapproveIcon from '@assets/icons/record-disapprove.svg';
import dayjs from 'dayjs';
import { useRevokeAccess } from 'hooks/useHealthRecord';
// import SharedRecords from './Shared';

type Props = {
  item: SharedRecord;
};

const SharedItem: React.FC<Props> = ({ item }) => {
  const [open, setOpen] = useState(false);
  const toast = useToast();

  const { mutate: revokeAccess } = useRevokeAccess();

  const handleClick = () => {
    setOpen(true);
  };
  const handleProceed = () => {
    revokeAccess(item.record_id, {
      onSuccess: () => {
        setOpen(false);
        toast.show({
          description: 'Access Revoked.',
          bgColor: 'green.600',
          color: 'white',
          duration: 2000,
        });
      },
    });
  };

  return (
    <>
      <Pressable onPress={handleClick}>
        <Box p="4">
          <HStack alignItems="center" justifyContent="space-between">
            <Text
              fontSize="sm"
              fontWeight="700"
              color="3D3D3D"
              _dark={{ color: 'white' }}
            >
              {item.sender_name}
            </Text>
            <Icon
              size="6"
              as={
                item.is_access_revoked
                  ? RecordDisapproveIcon
                  : RecordApproveIcon
              }
              _dark={{ color: 'coolGray.100' }}
            />
          </HStack>

          <RecordExpiration
            start={dayjs(item.record_date).format('MM/DD/YYYY')}
            end={
              item.is_access_revoked
                ? 'Revoked'
                : dayjs(item.hr_expiration_date_time).format('MM/DD/YYYY')
            }
          />
        </Box>
        {open && (
          <Modal
            isOpen={open}
            safeAreaTop
            width="full"
            paddingX="25px"
            bottom="100px"
          >
            <Modal.Content
              flex={1}
              width="full"
              maxHeight="195px"
              _dark={{ backgroundColor: '#111827' }}
            >
              <Modal.CloseButton onPress={() => setOpen(false)} />
              <Box mt="62px" alignItems="center" paddingX="19px">
                <VStack alignItems="center">
                  <Text
                    fontWeight="400"
                    fontSize="sm"
                    _light={{
                      color: '#1F2937',
                    }}
                    _dark={{
                      color: '#F9FAFB',
                    }}
                    marginBottom="28px"
                    textAlign="center"
                  >
                    Would you like to revoke access for {item.sender_name}?
                  </Text>
                </VStack>

                <HStack>
                  <Button
                    variant="outline"
                    height="41px"
                    width="136px"
                    marginRight="16px"
                    onPress={() => setOpen(false)}
                    _dark={{ backgroundColor: '#111827' }}
                  >
                    No
                  </Button>

                  <Button
                    _light={{ backgroundColor: '#082787' }}
                    height="41px"
                    width="136px"
                    onPress={handleProceed}
                  >
                    Yes, Proceed
                  </Button>
                </HStack>
              </Box>
            </Modal.Content>
          </Modal>
        )}

        <Divider my="15px" width="100%" />
      </Pressable>
    </>
  );
};

export default SharedItem;
