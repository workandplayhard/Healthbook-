import api from '@src/axios-client';

import { handleAPIError } from 'utils/handleAPIError';
import { User } from './types';

type LoginResponse = {
  access: string;
  refresh: string;
  user: User;
};

type validateUserResponse = {
  user_id: number;
  first_name: string;
  last_name: string;
  gender: string;
  email: string;
  dob: string;
};

export const login = async ({ email, password }: { email: string; password: string }) => {
  try {
    const response = await api.post<LoginResponse>('/login/', {
      email,
      password,
      org: 3,
    });

    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const response = await api.post<{ access: string }>('/refresh/', {
      refresh: refreshToken,
    });

    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const resetPassword = async ({ email }: { email: string }) => {
  try {
    const response = await api.post('/reset_password/', {
      email,
      org_id: 3,
    });

    return response.status === 200;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const changePassword = async ({
  password,
  new_password,
  confirm_password,
}: {
  password: string;
  new_password: string;
  confirm_password: string;
}) => {
  try {
    const response = await api.post('/password-change/', {
      password,
      new_password,
      confirm_password,
    });

    return response.status === 200;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const validateUser = async ({ org, code }: { org: number; code: string }) => {
  try {
    const response = await api.post<validateUserResponse>('/users/validate/', {
      org_id: org,
      signup_code: code,
    });

    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

type CodeRetrievalResponse = {
  org_id: number;
  firstName: string;
  lastName: string;
  date: string;
};

export const codeRetrieval = async ({ org_id, firstName, lastName, date }: CodeRetrievalResponse) => {
  try {
    const response = await api.post('users/coderetrieval/', {
      org_id: org_id,
      first_name: firstName,
      last_name: lastName,
      DOB: date,
    });

    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};
