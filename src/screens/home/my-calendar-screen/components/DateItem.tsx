import { Center, Pressable, Text } from 'native-base';
import { PropsWithChildren } from 'react';
import theme from 'theme';

const DateItem: React.FC<
  PropsWithChildren<{
    isHeader?: boolean;
    bold?: boolean;
    border?: boolean;
    selected?: boolean;
    secondary?: boolean;
    onPress?: () => void;
  }>
> = ({ children, isHeader, bold, border, selected, onPress, secondary }) => {
  return (
    <Pressable
      _light={{ bgColor: selected ? 'secondary.600' : 'white' }}
      _dark={{ bgColor: selected ? 'secondary.600' : 'coolGray.900' }}
      onPress={onPress}
    >
      <Center
        width={35}
        height={35}
        borderWidth={border ? 1 : 0}
        borderColor={theme.colors.glacier[600]}
        borderRadius={3}
      >
        <Text
          fontSize={isHeader ? 'sm' : 'md'}
          fontWeight={bold || selected ? 'bold' : 'medium'}
          _light={{
            color: isHeader
              ? theme.colors.glacier[600]
              : selected
              ? 'white'
              : secondary
              ? theme.colors.dustyGray[400]
              : theme.colors.dustyGray[900],
          }}
          _dark={{
            color: isHeader
              ? theme.colors.glacier[600]
              : secondary
              ? theme.colors.dustyGray[700]
              : 'white',
          }}
          textAlign="center"
        >
          {children}
        </Text>
      </Center>
    </Pressable>
  );
};

export default DateItem;
