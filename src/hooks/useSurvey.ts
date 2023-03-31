import { useMutation, useQuery } from '@tanstack/react-query';

import { getSurveyQuestions, submitSurveyAnswers } from '@services/survey';

export const useGetSurveyQuestions = (input: { category: string; answer_id: number | null; result: string }) => {
  return useQuery({
    queryKey: ['survey-questions', input],
    queryFn: () => getSurveyQuestions(input),
  });
};

export const useSubmitSurveyAnswers = () => {
  return useMutation({
    mutationFn: submitSurveyAnswers,
  });
};
