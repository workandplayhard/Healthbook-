import api from '@src/axios-client';
import { handleAPIError } from '@utils/handleAPIError';

type GetSurveyQuestionsResponse = {
  status: string | null;
  survey_ans: {
    itr1_answers: {
      ans: { key: number; value: string };
      model_input_key: string;
      ques_id: number;
      ques_title: string;
      ques_type: string;
    }[];
  };
  survey_questionnaire: Array<{
    question_id: number;
    question_title: string;
    question_options: { key: number; value: string }[];
    question_type: string;
    dependent_question_id: number | null;
    model_input_key: string;
  }> | null;
};

export const getSurveyQuestions = async ({
  category,
  answer_id,
  result,
}: {
  category: string;
  answer_id: number | null;
  result: string;
}) => {
  try {
    const response = await api.post<GetSurveyQuestionsResponse>('/survey/get_survey_questions/', {
      category,
      answer_id,
      result,
    });

    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

type SubmitSurveyAnswersInput = {
  ans_id: number | null;
  answers: {
    ans: { key: number; value: string };
    model_input_key: string;
    ques_id: number;
    ques_title: string;
    ques_type: string;
  }[];
  category: string;
  phq_number: number;
  validic_details: {
    device_type: string | null;
    validic_uid: string | null;
  };
};

type SubmitSurveyAnswersResponse = {
  message: string | null;
  result: string | null;
  score: number | null;
  phq_number: number | null;
  ans_id: number | null;
  survey_message: string | null;
};

export const submitSurveyAnswers = async (input: SubmitSurveyAnswersInput) => {
  try {
    const response = await api.post<SubmitSurveyAnswersResponse>('/survey/survey_answers/', input);
    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};
