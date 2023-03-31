import React, { useEffect } from 'react';
import { Button, Box, Text, VStack, FormControl } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';

import type { RootStackNavigationProps } from '@navigation/types';
import { useValidateUser } from 'hooks/useAuth';
import { Controller, useForm } from 'react-hook-form';
import FormInput from 'components/FormInput';

const EnterAccessScreen = () => {
  const navigation = useNavigation<RootStackNavigationProps>();

  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<{ code: string }>();

  const {
    mutate: validateUser,
    error: serverError,
    isLoading,
  } = useValidateUser();

  const handleValidate = ({ code }: { code: string }) => {
    validateUser(
      { org: 3, code },
      {
        onSuccess: ({ first_name, last_name, dob, email, gender, user_id }) => {
          navigation.navigate('CreateAccount', {
            first_name,
            last_name,
            dob,
            email,
            gender,
            user_id,
            signup_code: code,
          });
        },
      },
    );
  };

  useEffect(() => {
    if (serverError) {
      setError('code', { message: serverError.message });
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
            Enter access code
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
            You must have an access code to create an account. Please check your
            email for an invitation with your access code.
          </Text>

          <Controller
            control={control}
            name="code"
            rules={{
              required: { value: true, message: 'Access code is required' },
              maxLength: 30,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={Boolean(errors.code)} mt="20px">
                <FormInput
                  isRequired
                  label="Access Code"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  defaultValue={value}
                  value={value}
                  height="41px"
                  _light={{
                    color: 'dustyGray.900',
                    fontWeight: '500',
                    fontSize: 14,
                    lineHeight: 21,
                    paddingBottom: 3,
                  }}
                  _dark={{
                    color: 'dustyGray.100',
                    fontWeight: '500',
                    fontSize: 14,
                    lineHeight: 21,
                    paddingBottom: 3,
                  }}
                >
                  <FormControl.ErrorMessage>
                    {errors.code?.message}
                  </FormControl.ErrorMessage>
                </FormInput>
              </FormControl>
            )}
          />

          <Button
            marginTop="-4px"
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
            Enter Code
          </Button>
        </VStack>

        <Text
          style={{
            width: '100%',
            position: 'absolute',
            bottom: 57,
            margin: 'auto',
          }}
          textAlign="center"
          fontSize="14"
          fontWeight="700"
          _light={{
            color: '#082787',
          }}
          _dark={{
            color: 'tertiary.600',
          }}
          fontStyle="normal"
          onPress={() => navigation.navigate('CodeRetrieval')}
        >
          Resend Access Code
        </Text>
      </Box>
    </KeyboardAwareScrollView>
  );
};

export default EnterAccessScreen;
