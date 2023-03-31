import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Animated, Dimensions, ViewStyle } from 'react-native';
import { Button, Center, Text, useToast, VStack } from 'native-base';
import PagerView, {
  PagerViewOnPageScrollEventData,
} from 'react-native-pager-view';
import { SlidingDot } from 'react-native-animated-pagination-dots';
import {
  useForm,
  SubmitHandler,
  SubmitErrorHandler,
  FormProvider,
} from 'react-hook-form';

import { QuestionnaireStackScreenProps } from 'navigation/types';
import { getProfileQuestions } from 'services/users';
import { useCurrentUser, useSaveQuestionnaireResult } from 'hooks/useUsers';
import { ProfileQuestion } from 'services/types';
import QuestionnaireForm from './components/QuestionnaireForm';

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);
const { width } = Dimensions.get('window');

const questionsPerPage = [1, 3, 4, 2];

const QuestionnaireScreen = ({
  navigation,
}: QuestionnaireStackScreenProps<'Main'>) => {
  const methods = useForm<{
    [prop: string]: any;
  }>();

  const [questions, setQuestions] = useState<ProfileQuestion[]>([]);

  const { data: currentUser } = useCurrentUser();
  const { mutate: saveResult } = useSaveQuestionnaireResult();

  useEffect(() => {
    getProfileQuestions().then(data => {
      setQuestions(data);
    });
  }, []);

  const toast = useToast();

  const ref = useRef<PagerView>(null);
  const scrollOffsetAnimatedValue = useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = useRef(new Animated.Value(0)).current;
  const inputRange = [0, 5];
  const scrollX = Animated.add(
    scrollOffsetAnimatedValue,
    positionAnimatedValue,
  ).interpolate({
    inputRange,
    outputRange: [0, 5 * width],
  });

  const onPageScroll = useMemo(
    () =>
      Animated.event<PagerViewOnPageScrollEventData>(
        [
          {
            nativeEvent: {
              offset: scrollOffsetAnimatedValue,
              position: positionAnimatedValue,
            },
          },
        ],
        {
          useNativeDriver: false,
        },
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const onSubmit: SubmitHandler<any> = useCallback(data => {
    console.log(data);

    const payload = {
      user_id: currentUser!.user_id,
      user_response: Object.keys(data).map(key => ({
        question_id: key,
        answers: data[key],
      })),
    };

    saveResult(payload);

    navigation.navigate('Thankyou');
  }, []);

  const onError: SubmitErrorHandler<any> = useCallback(() => {
    toast.show({
      description: 'Please fill all the required fields.',
      bgColor: 'red.500',
      color: 'white',
    });
  }, []);

  const pages = useMemo(() => {
    let q = [...questions];

    return questionsPerPage.map((num, idx) => {
      const pageQuestions = q.splice(0, num);

      return <QuestionnaireForm questions={pageQuestions} key={idx} />;
    });
  }, [questions]);

  return (
    <VStack backgroundColor="#F2F9FF" flex={1} paddingBottom="10">
      <Text
        textAlign="center"
        fontSize="28"
        marginTop="28"
        lineHeight="38"
        paddingBottom={7}
      >
        Quick Profile Questionnaire
      </Text>

      <FormProvider {...methods}>
        <AnimatedPagerView
          initialPage={0}
          style={$pagerView}
          ref={ref}
          onPageScroll={onPageScroll}
        >
          {pages}

          <VStack space={4} px={6}>
            <Button
              colorScheme="primary"
              borderRadius="3xl"
              _text={{ fontWeight: 'semibold' }}
              onPress={methods.handleSubmit(onSubmit, onError)}
            >
              Save
            </Button>

            <Button
              variant="ghost"
              colorScheme="primary"
              _text={{ fontWeight: 'bold' }}
            >
              Cancel
            </Button>
          </VStack>
        </AnimatedPagerView>
      </FormProvider>

      <Center>
        <SlidingDot
          marginHorizontal={8}
          containerStyle={$slidingDotContainer}
          data={Array.from({ length: 5 })}
          //@ts-ignore
          scrollX={scrollX}
          dotSize={20}
          lineHeight={30}
        />
      </Center>
    </VStack>
  );
};

const $pagerView: ViewStyle = {
  flex: 1,
  alignItems: 'center',
};

const $slidingDotContainer: ViewStyle = { bottom: 0 };

export default QuestionnaireScreen;
