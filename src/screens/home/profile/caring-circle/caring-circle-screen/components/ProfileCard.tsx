import React from 'react';
import {
  VStack,
  Box,
  HStack,
  View,
  Image,
  Text,
  IconButton,
  Icon,
} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import getInitials from '@utils/getNameInitials';

type ProfileCardProps = {
  title?: string;
  relation?: string;
  onDelete?: () => void;
  pic?: any;
};

export default function ProfileCard(props: ProfileCardProps) {
  return (
    <Box borderRadius="md">
      <HStack
        borderStyle="solid"
        borderWidth={1}
        borderRadius="3px"
        borderColor="#D1DFEB"
        height="92px"
      >
        <View
          borderRadius="80"
          backgroundColor="#EAEAEA"
          alignItems="center"
          alignSelf="center"
          justifyContent="center"
          marginX={15}
          width="64px"
          height="64px"
        >
          {props.pic ? (
            <Image
              source={props.pic}
              alt="profilePic-Replace"
              borderRadius={80}
              resizeMethod="auto"
              resizeMode="cover"
              width="64px"
              height="64px"
            />
          ) : (
            <View
              width="64px"
              height="64px"
              borderRadius="80"
              backgroundColor="secondary.600"
              alignItems="center"
              justifyContent="center"
            >
              <Text
                fontStyle="normal"
                fontWeight={500}
                textAlign="center"
                fontSize="24px"
                color="white"
              >
                {getInitials(props.title ? props.title : '')}
              </Text>
            </View>
          )}
        </View>
        <VStack alignSelf="center" width="202px" py="25px">
          <Text
            backgroundColor="blue.400"
            height={29}
            fontWeight={700}
            fontSize={20}
            width={201}
          >
            {props.title}
          </Text>
          <Text
            backgroundColor="red"
            fontWeight={400}
            fontSize={14}
            height={29}
            width={201}
          >
            {props.relation}
          </Text>
        </VStack>
        <IconButton
          mr="1"
          onPress={props.onDelete}
          position="absolute"
          right="20px"
          alignSelf="center"
          variant="unstyled"
          icon={
            <Icon
              width="14px"
              height="18px"
              _light={{ color: '#D1DFEB' }}
              _dark={{ color: 'botticelli.800' }}
              as={MaterialIcons}
              name="delete"
            />
          }
        />
      </HStack>
    </Box>
  );
}
