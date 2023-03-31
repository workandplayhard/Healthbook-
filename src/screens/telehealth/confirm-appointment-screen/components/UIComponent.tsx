import React from 'react';
import { Box, Text, Input } from 'native-base';

type UIPropsType = {
  noteValue?: string;
  data: {
    name?: string;
    providerId?: number;
    date?: string;
    speciality?: string;
    slots: {
      start_time?: string;
      end_time?: string;
      isBooked?: boolean;
      availability_det_id?: number;
    };
    credentials: { credential_name?: string }[];
    doxyLink?: string;
  };
  changeText: (value: string) => void;
};

export const UIComponent: React.FC<UIPropsType> = ({
  noteValue = '',
  changeText,
  data,
}) => {
  return (
    <Box>
      <Text
        fontSize="sm"
        fontWeight={400}
        _light={{ color: 'dustyGray.900' }}
        _dark={{ color: 'dustyGray.500' }}
      >
        Date
      </Text>
      <Text
        fontSize="xl"
        paddingBottom={'18px'}
        fontWeight={700}
        _light={{ color: 'dustyGray.900' }}
        _dark={{ color: 'white' }}
      >
        {data?.date}
      </Text>
      <Text
        fontSize="sm"
        fontWeight={400}
        _light={{ color: 'dustyGray.900' }}
        _dark={{ color: 'dustyGray.500' }}
      >
        Time
      </Text>
      <Text
        fontSize="xl"
        paddingBottom={'18px'}
        fontWeight={700}
        _light={{ color: 'dustyGray.900' }}
        _dark={{ color: 'white' }}
      >
        {data?.slots?.start_time}
      </Text>
      <Text
        fontSize="sm"
        fontWeight={400}
        _light={{ color: 'dustyGray.900' }}
        _dark={{ color: 'dustyGray.500' }}
      >
        Provider
      </Text>
      <Text
        fontSize="xl"
        paddingBottom={'18px'}
        fontWeight={700}
        _light={{ color: 'dustyGray.900' }}
        _dark={{ color: 'white' }}
      >
        {data?.name}
      </Text>
      <Text
        fontSize="sm"
        fontWeight={400}
        _light={{ color: 'dustyGray.900' }}
        _dark={{ color: 'dustyGray.500' }}
      >
        Additional Notes (optional)
      </Text>
      <Input
        marginTop="16px"
        flexWrap={'wrap'}
        placeholder={
          'Notes to share with the provider in advance. (200 characters or less)'
        }
        placeholderTextColor={'dustyGray.500'}
        borderColor={'dustyGray.700'}
        _light={{ borderColor: 'dustyGray.400', bg: 'white' }}
        _dark={{ borderColor: 'dustyGray.700', bg: 'coolGray.800' }}
        textAlignVertical={'top'}
        multiline={true} // ios fix for centering it at the top-left corner
        numberOfLines={10}
        autoCapitalize="words"
        height={106}
        onChangeText={changeText}
        value={noteValue}
      />
    </Box>
  );
};
