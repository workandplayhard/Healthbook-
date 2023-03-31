import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { Button, Box, Text, VStack, FormControl, Icon, IconButton } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Controller, useForm } from 'react-hook-form';
import dayjs from 'dayjs';

import type { RootStackNavigationProps } from '@navigation/types';
import { useValidateUser } from '@hooks/useAuth';
import FormInput from '@components/FormInput';
import { useCalendarPicker } from '@hooks/useCalendarPicker';

const VerifySenderBirthdayScreen = () => {
  const navigation = useNavigation<RootStackNavigationProps>();
  const { openCalendar, closeCalendar } = useCalendarPicker();
  
  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<{ date: string }>();

  const {
    mutate: validateUser,
    error: serverError,
    isLoading,
  } = useValidateUser();
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const handleValidate = ({ date }: { date: string }) => {
    // validateDate(
    //   { org: 3, date },
    //   {
    //     onSuccess: ({ date }) => {
    //       navigation.navigate('CreateAccount', {date});
    //     },
    //   },
    // );
  };

  useEffect(() => {
    if (serverError) {
      setError('date', { message: serverError.message });
    }
  }, [serverError]);

  return (
    <KeyboardAwareScrollView
      // eslint-disable-next-line react-native/no-inline-styles
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardDismissMode={'interactive'}
      bounces={false}
    >
      <Box
        flex="1"
        _light={{ background: 'white' }}
        _dark={{ background: 'coolGray.800' }}
      >
        <VStack paddingX="24px">
          <Text
            paddingTop="109px"
            _light={{
              fontFamily: 'Avenir Next',
              fontSize: '20px',
              fontWeight: '700',
              color: 'dustyGray.900',
              fontStyle: 'normal',
            }}
            _dark={{
              fontFamily: 'Avenir Next',
              fontSize: '20px',
              fontWeight: '700',
              color: 'dustyGray.100',
              fontStyle: 'normal',
            }}
          >
            Gretchen Milbrath has shared health records with you.
          </Text>

          <Text
            _light={{
              fontFamily: 'Avenir Next',
              fontSize: '14',
              fontWeight: '400',
              paddingTop: '20px',
              color: 'dustyGray.900',
              fontStyle: 'normal',
              lineHeight: 21,
            }}
            _dark={{
              fontFamily: 'Avenir Next',
              fontSize: '14',
              fontWeight: '400',
              paddingTop: '20px',
              color: 'dustyGray.100',
              fontStyle: 'normal',
              lineHeight: 21,
            }}
          >
            You have been granted limited access to view this person’s health records. For security purposes, enter the sender’s date of birth
          </Text>

          <Controller
            control={control}
            name="date"
            rules={{
              maxLength: 30,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl mt={4}>
                <FormInput
                  my={0}
                  label="Date"
                  InputRightElement={
                    <IconButton
                      p={0}
                      mr={2}
                      icon={<Icon as={MaterialIcons} name="calendar-today" />}
                      onPress={() => openCalendar({ value, onChange })}
                    />
                  }
                  defaultValue="mm/dd/yyyy"
                  value={value}
                  onFocus={() => setOpenDatePicker(true)}
                  onBlur={onBlur}
                >
                  {openDatePicker && (
                    <DateTimePicker
                      mode="date"
                      display={Platform.OS === 'ios' ? 'compact' : 'calendar'}
                      value={new Date()}
                      maximumDate={new Date()}
                      onChange={e => {
                        setOpenDatePicker(false);
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

        </VStack>
        <VStack paddingX="24px" flex={1}>
          <Button
            position="absolute"
            bottom="24px"
            w="full"
            marginLeft="24px"
            variant="solid"
            size="lg"
            _light={{
              backgroundColor: 'primary.600',
              color: '#FFFFFF',
              fontStyle: 'normal',
            }}
            _dark={{
              backgroundColor: 'tertiary.600',
              color: '#F9F1FB',
              fontStyle: 'normal',
              fontWeight: 500,
              fontFamily: 'Avenir Next',
            }}
            borderRadius="4px"
            onPress={handleSubmit(handleValidate)}
            isLoading={isLoading}
          >
            Access Records
          </Button>
        </VStack>
      </Box>
    </KeyboardAwareScrollView>
  );
};

export default VerifySenderBirthdayScreen;
