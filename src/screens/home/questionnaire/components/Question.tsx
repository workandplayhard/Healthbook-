import React from 'react';

import { Button, Stack, Text, VStack } from 'native-base';

type QuestionProps = {
  question: {
    question_id: number;
    question_title: string;
    question_options: { key: number; value: string }[];
    question_type: string;
  };
  selectedAnswer?: { key: number; value: string };
  onSelectAnswer: (questionId: number, answer: { key: number; value: string }) => void;
};

const Question = ({ question, selectedAnswer, onSelectAnswer }: QuestionProps) => {
  return (
    <VStack space="4" key={question.question_id}>
      <Text textAlign="center" fontSize="md">
        {question.question_title}
      </Text>
      <Stack space="2" direction={question.question_options.length === 2 ? 'row' : 'column'}>
        {question.question_options.map(option => (
          <Button
            key={option.key}
            flex={question.question_options.length === 2 ? '1' : '0'}
            size="sm"
            variant={selectedAnswer?.key === option.key ? 'solid' : 'outline'}
            onPress={() => onSelectAnswer(question.question_id, option)}
          >
            {option.value}
          </Button>
        ))}
      </Stack>
    </VStack>
  );
};

export default Question;
