import React, { useMemo, useState } from 'react';
import { Box, Button, FormControl, Link, Text, VStack } from 'native-base';
import { Controller, useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';

import { RootStackNavigationProps } from '@navigation/types';
import { ConfirmModal } from '@components/ConfirmModal';
import FormSelect from '@components/FormSelect';

const reasons = [
  { label: 'COVID', value: 'covid' },
  { label: 'General Consultation', value: 'general-consultationi' },
  { label: 'Sick Vist/Urgent care', value: 'sick-care' },
  { label: 'Mental Health', value: 'mental-health' },
  { label: 'Medication Refill', value: 'medication-refill' },
  { label: 'Chronic (Ongoing) Condition', value: 'chronic-condition' },
  { label: 'Weight Loss', value: 'weight-loss' },
];

const types = [
  { label: 'Cardiology', value: 'cardiology' },
  { label: 'Counselors', value: 'counselors' },
  { label: 'Dermatology', value: 'dermatology' },
  { label: 'Endocrinology', value: 'endocrinology' },
  { label: 'Family Medicine', value: 'family-medicine' },
  { label: 'Internal Medicine', value: 'internal-medicine' },
  { label: 'Nutrition', value: 'nutrition' },
  { label: 'Pediatrics', value: 'pediatrics' },
  { label: 'Peer Coaches', value: 'peer-coaches' },
];

type ChatFormValue = {
  reason: string;
  type: string;
};

export const ChatForm = () => {
  const navigation = useNavigation<RootStackNavigationProps>();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { control, watch } = useForm<ChatFormValue>({
    defaultValues: { reason: '', type: '' },
  });
  const reason = watch('reason');
  const type = watch('type');

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const isDisabled = useMemo(() => {
    return !reason || !type;
  }, [reason, type]);

  const startChat = () => {
    setIsModalOpen(false);
    navigation.navigate('WaitScreen');
  };

  return (
    <Box>
      <VStack space="16px">
        <Controller
          control={control}
          name="reason"
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <FormControl>
              <FormSelect
                label="Reason for chat"
                placeholder="Selection"
                selectedValue={value}
                onValueChange={onChange}
                options={reasons}
              />
            </FormControl>
          )}
        />
        <Controller
          control={control}
          name="type"
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <FormControl>
              <FormSelect
                label="Type of provider"
                placeholder="Selection"
                onValueChange={onChange}
                selectedValue={value}
                options={types}
              />
            </FormControl>
          )}
        />
        <Button onPress={handleOpen} disabled={isDisabled}>
          START HEALTH CHAT
        </Button>
      </VStack>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onSubmit={startChat}
        size="xl"
      >
        <Text textAlign="center">
          During the chat session, your personal health information may be
          securely shared with the provider.
          <Link isUnderlined={false}>
            <Text
              _dark={{ color: 'tertiary.600' }}
              _light={{ color: 'primary.800' }}
              fontWeight="bold"
            >
              View Privacy Policy
            </Text>
          </Link>
        </Text>
      </ConfirmModal>
    </Box>
  );
};
