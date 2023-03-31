import React from 'react';
import { Box, Text, VStack, FormControl, HStack, Icon, FlatList, useColorMode } from 'native-base';
import { Controller, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

import FormSelect from 'components/FormSelect';
import { ReceivedRecord } from 'services/types';
import { useAddReceivedRecord, useCountPerType, useReceivedRecords } from 'hooks/useHealthRecord';
import RecordItem from './RecordItem';
import EmptyPlaceholder from './EmptyPlaceholder';
import { recordCategories } from './data/record-categories';

import type { RootStackNavigationProps } from 'navigation/types';

const ReceivedRecords = () => {
  const {
    control,
    formState: { errors },
  } = useForm<ReceivedRecord>({});
  const { colorMode } = useColorMode();

  const { data: records } = useReceivedRecords();
  const { data: countPerTypes } = useCountPerType();
  const navigation = useNavigation<RootStackNavigationProps>();

  const addPatientRecord = (singleRecord: any) => {
    let id = singleRecord.map((i: any) => i.sender_patient_id);
    let payload = id.toString();
    addReceivedRecord({ patient_id: payload });
  };

  const { mutate: addReceivedRecord } = useAddReceivedRecord();

  const date = records && records[0].hr_expiration_date_time;

  return (
    <Box safeAreaBottom flex={1} _light={{ bgColor: 'white' }} _dark={{ bgColor: 'coolGray.800' }} p={4}>
      <VStack width="full">
        <Text fontSize="sm" fontWeight="medium" _light={{ color: 'dustyGray.900' }} _dark={{ color: 'dustyGray.100' }}>
          Other HealthBook+ members can share their health records with you. Contact them to share an access link.
        </Text>
        <Controller
          control={control}
          name="sender_name"
          rules={{
            required: { value: true, message: 'This field is required.' },
          }}
          render={({ field: { onChange, value } }) => (
            <FormControl isInvalid={Boolean(errors?.sender_name)}>
              <FormSelect
                selectedValue={value}
                defaultValue={value}
                onValueChange={itemValue => {
                  let singleRecord = (records || []).filter(record => record.sender_name === itemValue);
                  addPatientRecord(singleRecord);
                  onChange(itemValue);
                }}
                options={(records || []).map(r => ({
                  value: r.sender_name,
                  label: r.sender_name,
                }))}
                placeholder="Select Member"
                mt={2}
                paddingLeft="10px"
                fontSize={'sm'}
                mb={3}
                fontWeight={'medium'}
                dropdownIcon={
                  <HStack mr="1" alignItems="center" space="2">
                    <Icon
                      size="9"
                      as={MaterialCommunityIcons}
                      name="chevron-down"
                      _light={{ color: 'dustyGray.400' }}
                      _dark={{ color: 'dustyGray.400' }}
                    />
                  </HStack>
                }
              >
                {records ? (
                  <Text fontSize="xs" mt="2" mb="2" color="dustyGray.500">
                    {` Your access to these records will expire on ${dayjs(date).format('MM/DD/YYYY')}`}
                  </Text>
                ) : null}

                <FlatList
                  contentContainerStyle={{ flexGrow: 1 }}
                  data={recordCategories ?? []}
                  keyExtractor={item => item.key}
                  renderItem={({ item: { Icon, key, title } }) => (
                    <RecordItem
                      Icon={Icon}
                      title={title}
                      key={key}
                      count={countPerTypes ? countPerTypes[key] : 0}
                      action={() => navigation.navigate('Category', { type: key })}
                    />
                  )}
                  ListEmptyComponent={<EmptyPlaceholder description="There are no records being shared with you." />}
                />

                <FormControl.ErrorMessage>{errors.sender_name?.message}</FormControl.ErrorMessage>
              </FormSelect>
            </FormControl>
          )}
        />
      </VStack>
    </Box>
  );
};

export default ReceivedRecords;
