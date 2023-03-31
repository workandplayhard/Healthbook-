import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useNavigation } from '@react-navigation/core';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Box, Button, ChevronLeftIcon, HStack, IconButton, Progress } from 'native-base';
import PagerView from 'react-native-pager-view';

import { useGetSurveyQuestions, useSubmitSurveyAnswers } from '@hooks/useSurvey';
import { useCurrentUser } from '@hooks/useUsers';
import type { RootStackNavigatorParamList } from '@navigation/types';

import Analyzing from './components/Analyzing';
import Intro from './components/Intro';
import Question from './components/Question';
import ThankYou from './components/ThankYou';

const QuestionnaireScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackNavigatorParamList>>();

  const pagerRef = React.useRef<PagerView>(null);

  const [survey, setSurvey] = useState<{
    category: string;
    answer_id: number | null;
    result: string;
    phq_number: number;
  }>({
    category: 'Depression',
    answer_id: 0,
    result: '',
    phq_number: 0,
  });

  const [currentPage, setCurrentPage] = useState(0);
  const [showThankYou, setShowThankYou] = useState(false);
  const [responses, setResponses] = useState<{
    [question_id: string]: {
      ans: { key: number; value: string };
      model_input_key: string;
      ques_id: number;
      ques_title: string;
      ques_type: string;
    };
  }>({});

  const { data: currentUser } = useCurrentUser();

  const { data: surveyQuestionsData, isLoading: isLoadingGetSurveyQuestions } = useGetSurveyQuestions(survey);

  useEffect(() => {
    if (surveyQuestionsData?.survey_ans && surveyQuestionsData.survey_ans.itr1_answers) {
      const previousResponses = {} as typeof responses;
      surveyQuestionsData.survey_ans.itr1_answers.forEach(answer => {
        previousResponses[answer.ques_id] = answer;
      });

      setResponses(previousResponses);
    }
  }, [surveyQuestionsData?.survey_ans]);

  const questions = useMemo(() => {
    return surveyQuestionsData?.survey_questionnaire ?? [];
  }, [surveyQuestionsData]);

  const primaryQuestions = useMemo(() => questions.filter(q => q.dependent_question_id === null), [questions]);

  const { mutate: submitSurveyAnswers, isLoading: submitSurveyAnswersIsLoading } = useSubmitSurveyAnswers();

  const handleSubmitSurveyAnswers = () => {
    const validic_user = currentUser?.validic_user;
    const validic_uid = validic_user && validic_user.uid ? validic_user.uid : null;
    const device_type =
      validic_user && validic_user.sources?.length && validic_user.sources.length > 0
        ? validic_user.sources[0].type
        : null;

    submitSurveyAnswers(
      {
        ans_id: survey.answer_id,
        answers: Object.values(responses).filter(r => questions.map(q => q.question_id).includes(r.ques_id)),
        category: survey.category,
        phq_number: survey.phq_number,
        validic_details: {
          validic_uid,
          device_type,
        },
      },
      {
        onSuccess: ({ ans_id, result, survey_message: message }) => {
          pagerRef.current && pagerRef.current.setPage(0);
          setCurrentPage(0);

          // PHQ-0
          if (survey.phq_number === 0 && result) {
            let phq_number = 2;
            if (result === 'Moderate') {
              phq_number = 9;
            }

            setSurvey({
              category: 'Depression',
              answer_id: ans_id,
              result: result,
              phq_number: phq_number,
            });

            return;
          }

          // PHQ-2
          if (survey.phq_number === 2 && result === 'Moderate') {
            setSurvey({
              category: 'Depression',
              answer_id: ans_id,
              result: result,
              phq_number: 9,
            });

            return;
          }

          if (result && ['Negative', 'None'].includes(result)) {
            setShowThankYou(true);
            return;
          }

          navigation.replace('HealthHelp', { message });
        },
      },
    );
  };

  const handleSelectAnswer = useCallback(
    (questionId: number, answer: { key: number; value: string }) => {
      const question = questions.find(q => q.question_id === questionId);
      setResponses({
        ...responses,
        [questionId]: {
          ans: answer,
          ques_id: question?.question_id,
          model_input_key: question?.model_input_key,
          ques_title: question?.question_title,
          ques_type: question?.question_type,
        },
      });

      const hasDependantQuestion = questions.some(q => q.dependent_question_id === questionId);

      if ((hasDependantQuestion && answer.key === 2) || currentPage === primaryQuestions.length) {
        return;
      } else if (pagerRef.current) {
        pagerRef.current.setPage(currentPage + 1);
      }
    },
    [responses, questions, currentPage, primaryQuestions.length],
  );

  const renderDependantQuestion = useCallback(
    (questionId: number) => {
      const dependantQuestion = questions.find(q => q.dependent_question_id === questionId);

      // If the question has a dependant question and the answer is 'Yes' then render the dependant question
      if (dependantQuestion && responses[questionId] && responses[questionId].ans.key === 2) {
        return (
          <Box mt="8">
            <Question
              question={dependantQuestion}
              selectedAnswer={responses[dependantQuestion.question_id] && responses[dependantQuestion.question_id].ans}
              onSelectAnswer={handleSelectAnswer}
            />
          </Box>
        );
      }
    },
    [handleSelectAnswer, questions, responses],
  );

  const pages = useMemo(
    () => [
      {
        key: 'intro',
        component: (
          <Intro
            isLoading={isLoadingGetSurveyQuestions}
            phq={!survey.answer_id ? 'phq1' : 'phq2'}
            onStartPress={() => pagerRef.current?.setPage(currentPage + 1)}
          />
        ),
      },
      ...primaryQuestions.map(question => ({
        key: `question-${question.question_id}`,
        component: (
          <Box p="4">
            <Question
              question={question}
              selectedAnswer={responses[question.question_id] && responses[question.question_id].ans}
              onSelectAnswer={handleSelectAnswer}
            />
            {renderDependantQuestion(question.question_id)}
          </Box>
        ),
      })),
    ],
    [
      isLoadingGetSurveyQuestions,
      survey.answer_id,
      primaryQuestions,
      currentPage,
      responses,
      handleSelectAnswer,
      renderDependantQuestion,
    ],
  );

  if (showThankYou) {
    return <ThankYou />;
  }

  if (submitSurveyAnswersIsLoading) {
    return <Analyzing />;
  }

  return (
    <Box flex={1} _light={{ bg: 'white' }} _dark={{ bg: 'coolGray.800' }}>
      <Box h="12" mb="8">
        {currentPage > 0 && (
          <HStack p="4" space="4" justifyContent="space-between" alignItems="center">
            <IconButton
              p="0"
              disabled={currentPage === 1}
              opacity={currentPage === 1 ? 0 : 1}
              onPress={() => pagerRef.current?.setPage(currentPage - 1)}
              _icon={{
                color: 'dustyGray.500',
              }}
              icon={<ChevronLeftIcon />}
            />
            <Progress
              size="sm"
              flex="1"
              rounded="none"
              bg="coolGray.100"
              _filledTrack={{
                bg: 'lime.500',
                rounded: 'none',
              }}
              value={(currentPage / (pages.length - 1)) * 100}
            />
          </HStack>
        )}
      </Box>
      <PagerView
        ref={pagerRef}
        scrollEnabled={false}
        style={{ flex: 1 }} // eslint-disable-line react-native/no-inline-styles
        onPageSelected={e => setCurrentPage(e.nativeEvent.position)}
        initialPage={0}
      >
        {pages.map(page => (
          <Box key={page.key}>{page.component}</Box>
        ))}
      </PagerView>
      <Box safeAreaBottom p="4">
        {currentPage > 0 &&
        currentPage === pages.length - 1 &&
        responses[primaryQuestions[currentPage - 1].question_id] ? (
          <Button isLoading={submitSurveyAnswersIsLoading} onPress={handleSubmitSurveyAnswers}>
            Get Results
          </Button>
        ) : null}
      </Box>
    </Box>
  );
};

export default QuestionnaireScreen;
