import React from 'react';
import { Center, HStack, Pressable, Text } from 'native-base';
import type { SvgProps } from 'react-native-svg';

import FileIcon from '@assets/icons/file.svg';
import { useNavigation } from '@react-navigation/native';

const RecordItem = ({
  Icon,
  title,
  count,
  action,
}: {
  Icon: React.FC<SvgProps>;
  title: string;
  count: number;
  action: () => void;
}) => {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => {
        if (action) {
          action();
        }
      }}
    >
      <HStack alignItems="center" p={4} borderTopWidth={1} borderColor="dustyGray.300">
        <Icon height={24} width={24} />
        <Text flex={1} ml={2} fontWeight="bold" fontSize="sm">
          {title}
        </Text>
        <Center mx={1}>
          <FileIcon width={12} height={12} />
        </Center>
        <Text>{count}</Text>
      </HStack>
    </Pressable>
  );
};

export default RecordItem;
