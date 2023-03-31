import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  login,
  resetPassword,
  changePassword,
  validateUser,
  codeRetrieval,
} from '@services/auth';
import { useAuthStore } from '@hooks/useAuthStore';

export const useLogin = () => {
  const queryClient = useQueryClient();

  const setAccess = useAuthStore(state => state.setAccess);
  const setRefresh = useAuthStore(state => state.setRefresh);
  const setUserId = useAuthStore(state => state.setUserId);

  return useMutation(login, {
    onError: (error: Error) => {
      console.log('Login error', error);
    },
    onSuccess: response => {
      queryClient.setQueryData(['me'], response.user);
      setAccess(response.access);
      setRefresh(response.refresh);
      setUserId(response.user.user_id);
    },
  });
};

export const useResetPassword = () => {
  return useMutation(resetPassword, {
    onError: (error: Error) => {
      console.log('Reset Password error', error.message);
    },
    onSuccess: response => {
      return response;
    },
  });
};

export const useChangePassword = () => {
  return useMutation(changePassword, {
    onError: (error: Error) => {
      console.log('Change Password error', error.message);
    },
    onSuccess: response => {
      return response;
    },
  });
};

export const useValidateUser = () => {
  return useMutation(validateUser, {
    onError: (error: Error) => {
      console.log('Validate user error', error.message);
    },
    onSuccess: response => {
      return response;
    },
  });
};

export const useCodeRetrieval = () => {
  return useMutation(codeRetrieval, {
    onError: (error: Error) => {
      console.log('Code Retrieval error', error.message);
    },
    onSuccess: response => {
      return response;
    },
  })
}
