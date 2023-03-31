import React, { useState } from 'react';
import { Box, Text, Button, FormControl, Icon } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { RootStackNavigatorParamList } from 'navigation/types';
import { Controller, useForm } from 'react-hook-form';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import FormInput from 'components/FormInput';
import { users, receivedDocuments } from './components/data';

type DateFormValue = {
  date: string;
}

type Props = {
  initialValue: DateFormValue;
  onSubmit: (data: DateFormValue) => void;
}

const AccessDocumentScreen: React.FC<
  NativeStackScreenProps<RootStackNavigatorParamList, 'AccessDocumentScreen'> & Props
> = ({ navigation, initialValue, onSubmit }) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<DateFormValue>({
    defaultValues: initialValue,
  })

  const newReceivedDocument = receivedDocuments[0];
  const sender = users.find(user => user.id === newReceivedDocument.sender)!;
  const [datePicker, setDatePicker] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState<{ birthDate: string }>();

  onSubmit = () => {
    if (birthDate === sender.birthDate) return navigation.goBack();

    setError({ birthDate: 'Birthdate is incorrect!' });
  };

  return (
    <Box
      px={6}
      pb={6}
      pt={20}
      flex={1}
      _dark={{ backgroundColor: '#1F2937' }}
      _light={{ backgroundColor: 'white' }}
    >
      <Box flex={1}>
        <Text fontSize="18px" fontWeight={700} mb={5}>
          {`${sender.name}`} has shared documents with you.
        </Text>
        <Text fontSize="14px" fontWeight={500} mb={3}>
          You have been granted limited access to view these documents. For
          security purposes, enter the sender’s date of birth
        </Text>

        <Controller
          control={control}
          name="date"
          render={({
            field: { onChange, onBlur, value },
            fieldState: {},
          }) => (
            <FormControl isInvalid={Boolean(errors.date)} flex={1} mt="10px">
              <FormInput
                label="Sender's date of birth"
                InputRightElement={
                  <Icon
                    as={MaterialIcons}
                    name="calendar-today"
                    mr="2"
                    height="1/2"
                  />
                }
                defaultValue="mm/dd/yyyy"
                value={value}
                onFocus={() => setDatePicker(true)}
                onBlur={onBlur}
              >
                {datePicker && (
                  <DateTimePicker
                    mode="date"
                    display="compact"
                    value={new Date()}
                    maximumDate={new Date()}
                    onChange={e => {
                      setDatePicker(false);
                      setBirthDate(dayjs(e.nativeEvent.timestamp).format('MM/DD/YYYY'))
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
              </FormInput>
            </FormControl>
          )}
        />
      </Box>

      <Button onPress={handleSubmit(onSubmit)}>Access Documents</Button>
    </Box>
  );
};

export default AccessDocumentScreen;
