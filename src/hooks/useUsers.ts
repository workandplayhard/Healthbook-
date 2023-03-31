import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';

import {
  getCurrentUser,
  getUser,
  uploadImage,
  updateUser,
  saveQuestionnaireResult,
  register,
  moodCapture,
  updateCurrentUser,
} from '@services/users';
import { useAuthStore } from '@hooks/useAuthStore';
import { MoodStatus, useMoodStore } from './useMoodStore';

export const useCurrentUser = () => {
  const access = useAuthStore(state => state.access);

  return useQuery({
    queryKey: ['me'],
    queryFn: () => getCurrentUser(),
    enabled: !!access,
  });
};

export const useUpdateCurrentUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCurrentUser,
    onError: (error: Error) => {},
    onSuccess: () => {
      queryClient.invalidateQueries(['me']);
    },
  });
};

export const useGetUser = () => {
  const access = useAuthStore(state => state.access);
  const userId = useAuthStore(state => state.userId);

  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId as string),
    enabled: !!access && !!userId,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    onError: (error: Error) => console.log('Update User error', error.message),
    onSuccess: () => {
      queryClient.invalidateQueries(['user']);
      queryClient.invalidateQueries(['me']);
    },
  });
};

export const useAvatarMutation = () => {
  return useMutation({ mutationFn: uploadImage });
};

export const useSaveQuestionnaireResult = () => {
  return useMutation({ mutationFn: saveQuestionnaireResult });
};

export const useRegisterUser = () => {
  const { setAccess, setRefresh } = useAuthStore();

  return useMutation({
    mutationFn: register,
    onError: (error: Error) => console.log('Register User error', error.message),
    onSuccess: ({ access, refresh }) => {
      setAccess(access);
      setRefresh(refresh);
    },
  });
};

export const useMoodCapture = () => {
  const setMood = useMoodStore(state => state.setMood);
  const { data: currentUser } = useCurrentUser();

  return useMutation({
    mutationFn: (mood: string) => moodCapture({ user_id: currentUser!.user_id, user_mood: mood }),
    onSuccess: (_, mood) => {
      setMood(mood as MoodStatus);
    },
  });
};
