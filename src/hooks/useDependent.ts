import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';

import {
  getDependents,
  deleteDependent,
  addDependent,
  updateDependent,
} from '@services/dependents';
import { useNavigation } from '@react-navigation/native';

export const useDependents = () => {
  return useQuery({
    queryKey: ['dependent-list'],
    queryFn: getDependents,
  });
};

export const useDeleteDependent = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteDependent, {
    onError: (error: Error) => console.log('Update User error', error.message),
    onSuccess: () => queryClient.invalidateQueries(['dependent-list']),
  });
};

export const useAddDependent = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  return useMutation(addDependent, {
    onError: (error: Error) =>
      console.log('Add dependent error', error.message),
    onSuccess: () => {
      queryClient.invalidateQueries(['dependent-list']);
      navigation.goBack();
    },
  });
};

export const useUpdateDependent = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  return useMutation(updateDependent, {
    onError: (error: Error) =>
      console.log('Update dependent error', error.message),
    onSuccess: () => {
      queryClient.invalidateQueries(['dependent-list']);
      navigation.goBack();
    },
  });
};
