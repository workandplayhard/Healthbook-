import React, { useMemo, useState } from 'react';
import { Box, Button, FormControl, HStack, VStack } from 'native-base';
import { Controller, useForm } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { Masks } from 'react-native-mask-input';
import { useNavigation } from '@react-navigation/native';

import DateIcon from '@assets/icons/date.svg';
import FormSelect from '@components/FormSelect';
import FormInput from '@components/FormInput';
import { RootStackNavigationProps } from '@navigation/types';
import { useGetProviderTypeReasons } from '@hooks/useProvider';

type TelehealthFormValues = {
  type: string;
  date: string;
};

export const TelehealthForm = () => {
  const navigation = useNavigation<RootStackNavigationProps>();

  const { control, watch } = useForm<TelehealthFormValues>({
    defaultValues: { type: '', date: '' },
  });

  const { data: typeReasons } = useGetProviderTypeReasons();
  const types = useMemo(() => {
    return (
      typeReasons?.provider_type?.map(current => ({
        label: current.provider_type,
        value: current.provider_type,
      })) ?? []
    );
  }, [typeReasons]);

  const type = watch('type');
  const date = watch('date');

  const isDisabled = useMemo(() => {
    return !watch('date') || !watch('date');
  }, [watch('type'), watch('date')]);

  const search = () => {
    navigation.navigate('ProviderListScreen', {
      type: watch('type'),
      label: types.filter(current => current.value === type)[0]?.label,
      date: dayjs(date, 'MM/DD/YYYY').format('YYYY-MM-DD'),
    });
  };

  const [datePicker, setDatePicker] = useState(false);

  return (
    <Box>
      <VStack space="16px">
        <Controller
          control={control}
          name="type"
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <FormControl>
              <FormSelect
                label="Select type of provider"
                placeholder="Selection"
                selectedValue={value}
                onValueChange={onChange}
                options={types}
              />
            </FormControl>
          )}
        />
        <Controller
          control={control}
          name="date"
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormControl>
              <FormInput
                label="Date"
                rightElement={
                  <HStack mr="2" alignItems="center" space="2">
                    {datePicker && (
                      <DateTimePicker
                        placeholderText="Select Date"
                        mode="date"
                        value={new Date()}
                        onChange={e => {
                          setDatePicker(false);
                          onChange({
                            target: {
                              value: dayjs(e.nativeEvent.timestamp).format(
                                'MM/DD/YYYY',
                              ),
                            },
                          });
                        }}
                      />
                    )}
                    <DateIcon />
                  </HStack>
                }
                value={value}
                onFocus={() => setDatePicker(true)}
                onChangeText={onChange}
                onBlur={onBlur}
                mask={Masks.DATE_MMDDYYYY}
              />
            </FormControl>
          )}
        />
        <Button disabled={isDisabled} onPress={search}>
          SEARCH PROVIDERS
        </Button>
      </VStack>
    </Box>
  );
};
