import React from 'react';

import { ArrowForwardIcon, Button, Center, Text, VStack } from 'native-base';

import IntroIllustration1 from '../assets/ph1-intro-illustration.svg';
import IntroIllustration2 from '../assets/ph2-intro-illustration.svg';

type IntroProps = {
  isLoading: boolean;
  phq: 'phq1' | 'phq2';
  onStartPress: () => void;
};

const intros = {
  phq1: {
    illustration: <IntroIllustration1 />,
    title: 'Getting you on the right path',
    description: 'Answering these questions will help us guide you to your next best health action.',
  },
  phq2: {
    illustration: <IntroIllustration2 />,
    title: 'Depression evaluation',
    description: 'Please indicate if you have been bothered by any of the following problems over the last 2 weeks.',
  },
};

const Intro = ({ isLoading, phq, onStartPress }: IntroProps) => {
  return (
    <VStack p="4" space="8">
      <Center>{intros[phq].illustration}</Center>
      <Text textAlign="center" fontSize="lg" fontWeight="bold">
        {intros[phq].title}
      </Text>
      <Text fontSize="sm" fontWeight="medium">
        {intros[phq].description}
      </Text>
      <Button
        isLoading={isLoading}
        w="full"
        onPress={onStartPress}
        startIcon={<ArrowForwardIcon />}
        _icon={{ size: 'xs' }}
      >
        Start
      </Button>
    </VStack>
  );
};

export default Intro;
