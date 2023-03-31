import React from 'react';

import { Box, Button, HStack, Link, Text, VStack } from 'native-base';

type ActionCardProps = {
  variant: 'primary' | 'secondary';
  titleImage?: JSX.Element;
  title: string;
  description: string;
  descriptionLinkText?: string;
  descriptionLinkOnPress?: () => void;
  buttonIcon?: JSX.Element;
  buttonText: string;
  buttonOnPress: () => void;
  width?: string;
};

const ActionCard = ({
  variant,
  titleImage,
  title,
  description,
  descriptionLinkText,
  descriptionLinkOnPress,
  buttonIcon,
  buttonText,
  buttonOnPress,
  width,
}: ActionCardProps) => {
  return (
    <Box
      px={variant === 'primary' ? '0' : '4'}
      _light={{
        background: variant === 'primary' ? 'white' : '#F7FDFF',
        borderWidth: variant === 'primary' ? undefined : '1',
        borderColor: variant === 'primary' ? undefined : 'glacier.300',
        borderRadius: variant === 'primary' ? undefined : 'md',
      }}
      _dark={{
        background: variant === 'primary' ? 'coolGray.800' : 'coolGray.900',
        borderWidth: variant === 'primary' ? undefined : '1',
        borderColor: variant === 'primary' ? undefined : 'dustyGray.700',
        borderRadius: variant === 'primary' ? undefined : 'md',
      }}
    >
      <VStack space="4">
        <HStack space="2" alignItems="center">
          {titleImage}
          <Text
            flex="1"
            fontSize="lg"
            fontWeight="bold"
            _light={{
              color: variant === 'primary' ? 'dustyGray.900' : 'secondary.600',
            }}
            _dark={{
              color: variant === 'primary' ? 'white' : 'secondary.600',
            }}
          >
            {title}
          </Text>
        </HStack>

        <Text fontSize="sm">
          {description}{' '}
          {descriptionLinkText && (
            <Link
              isUnderlined={false}
              onPress={descriptionLinkOnPress}
              _light={{ _text: { fontWeight: 'bold', color: 'primary.600' } }}
              _dark={{ _text: { fontWeight: 'bold', color: 'tertiary.600' } }}
            >
              {descriptionLinkText}
            </Link>
          )}
        </Text>

        {variant === 'primary' ? (
          <Button
            alignSelf="flex-start"
            width={width}
            leftIcon={buttonIcon}
            _light={{
              _icon: { color: 'tertiary.300' },
            }}
            onPress={buttonOnPress}
          >
            {buttonText}
          </Button>
        ) : (
          <Button
            alignSelf="flex-start"
            leftIcon={buttonIcon}
            variant="link"
            py="1"
            px="0"
            _dark={{
              _icon: { color: 'tertiary.600' },
              _text: { color: 'tertiary.600' },
            }}
            onPress={buttonOnPress}
          >
            {buttonText}
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default ActionCard;
