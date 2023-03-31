import { ImageOrVideo } from 'react-native-image-crop-picker';

import { handleAPIError } from '@utils/handleAPIError';
import api from '@src/axios-client';

import type { ProfileQuestion, User } from './types';
import { PersonInfoValues } from 'screens/access/create-account-screen/CreateAccountScreen';

export const register = async (data: PersonInfoValues) => {
  const {
    first_name,
    last_name,
    email,
    password,
    user_id,
    gender,
    signup_code,
    dob,
    is_terms_privacy_policy_accepted,
  } = data;

  try {
    const response = await api.post<{ access: string; refresh: string }>('/users/register/', {
      first_name,
      last_name,
      email,
      password,
      user_id,
      dob,
      is_terms_privacy_policy_accepted,
      originalData: {
        first_name,
        last_name,
        email,
        password,
        sex: gender,
        user_id,
        dob,
      },
      signup_code,
      is_mobile: true,
    });

    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get<User>('/me/');
    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const updateCurrentUser = async (data: Partial<User>) => {
  try {
    const response = await api.put<User>('/me/', data);

    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const getUser = async (id: string) => {
  try {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const getProfileQuestions = async () => {
  try {
    const response = await api.get<ProfileQuestion[]>('/users/profile_questions/');
    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

type QuestionnaireResult = {
  user_id: string;
  user_response: Array<{
    question_id: string;
    answers: { [prop: string]: string };
  }>;
};

export const saveQuestionnaireResult = async (data: QuestionnaireResult) => {
  try {
    const response = await api.post('/users/profile_answers/', data);

    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const updateUser = async (data: User) => {
  try {
    const response = await api.put<User>(`/users/${data.user_id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const uploadImage = (data: ImageOrVideo) => {
  const formData = new FormData();

  formData.append('photo', { uri: data.path, type: data.mime, name: 'avatar' });

  return api({
    method: 'post',
    url: '/users/avatar/',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
    },
  });
};

export const moodCapture = async ({ user_id, user_mood }: { user_id: number | string; user_mood: string }) => {
  try {
    const response = await api.post('/mood-capture/', { user_id, user_mood });

    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};
