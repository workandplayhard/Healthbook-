import React from 'react';
import { Box, Button, FormControl, Input, Select, Text, VStack } from 'native-base';
import { Controller, useForm } from 'react-hook-form';

import { EMAIL_REGEX } from '@utils/constants';
import { useRelationsAndDurations } from '@hooks/useHealthVault';
import { validationMessages } from '@utils/validationMessages';

export type RecipientFormValues = {
  name: string;
  email: string;
  relation: string;
  duration: string;
};

type FirstStepProps = {
  onNext: (values: RecipientFormValues) => void;
  defaultValues: RecipientFormValues;
};

const First: React.FC<FirstStepProps> = ({ onNext, defaultValues }) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<RecipientFormValues>({
    defaultValues,
  });
  const { data: relationsAndDurationsData } = useRelationsAndDurations();

  return (
    <Box>
      <Text fontSize="18px" fontWeight={700} mb={5}>
        Share a temporary link to the documents you’ve selected
      </Text>
      <Text fontSize="14px" fontWeight={500} mb={5}>
        The recipient will have limited access based on the number of days you choose.
      </Text>
      <VStack space={5}>
        <Controller
          control={control}
          name="name"
          rules={{
            required: {
              value: true,
              message: validationMessages.required,
            },
          }}
          render={({ field: { onChange, value } }) => (
            <FormControl isInvalid={!!errors.name}>
              <FormControl.Label>What is the recipient’s full name?</FormControl.Label>
              <Input onChangeText={onChange} value={value} />
              <FormControl.ErrorMessage>{errors.name?.message}</FormControl.ErrorMessage>
            </FormControl>
          )}
        />
        <Controller
          control={control}
          name="email"
          rules={{
            required: {
              value: true,
              message: validationMessages.required,
            },
            pattern: {
              value: EMAIL_REGEX,
              message: 'Please enter a valid email',
            },
          }}
          render={({ field: { onChange, value } }) => (
            <FormControl isInvalid={!!errors.email}>
              <FormControl.Label>What is this recipient’s email?</FormControl.Label>
              <Input onChangeText={onChange} value={value} />
              <FormControl.ErrorMessage>{errors.email?.message}</FormControl.ErrorMessage>
            </FormControl>
          )}
        />
        <Controller
          control={control}
          name="relation"
          rules={{
            required: {
              value: true,
              message: validationMessages.required,
            },
          }}
          render={({ field: { onChange, value } }) => (
            <FormControl isInvalid={!!errors.relation}>
              <FormControl.Label>What is this person’s relationship to you?</FormControl.Label>
              <Select selectedValue={value} onValueChange={onChange}>
                {relationsAndDurationsData?.Relationship.map(item => (
                  <Select.Item key={item.id} value={`${item.id}`} label={item.recipient_relationship} />
                ))}
              </Select>
              <FormControl.ErrorMessage>{errors.relation?.message}</FormControl.ErrorMessage>
            </FormControl>
          )}
        />
        <Controller
          control={control}
          name="duration"
          rules={{
            required: {
              value: true,
              message: validationMessages.required,
            },
          }}
          render={({ field: { onChange, value } }) => (
            <FormControl isInvalid={!!errors.duration}>
              <FormControl.Label>Allow access to my documents for</FormControl.Label>
              <Select selectedValue={value} onValueChange={onChange}>
                {relationsAndDurationsData?.Duration.map(item => (
                  <Select.Item key={item.id} value={`${item.id}`} label={item.duration_view} />
                ))}
              </Select>
              <FormControl.ErrorMessage>{errors.duration?.message}</FormControl.ErrorMessage>
            </FormControl>
          )}
        />
      </VStack>
      <Button mt={5} onPress={handleSubmit(onNext)}>
        Next
      </Button>
    </Box>
  );
};

export default First;
