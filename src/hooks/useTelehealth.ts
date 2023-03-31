import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  cancelAppointment,
  bookAppointment,
  updateAppointment,
} from '@services/telehealth';

export const useBookAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation(bookAppointment, {
    onError: (error: Error) =>
      console.log('Cancel Appointment Error', error.message),
    onSuccess: response => {
      queryClient.invalidateQueries(['provider-detail']);
      queryClient.invalidateQueries(['providers-list']);
      queryClient.invalidateQueries(['me']);
      return response;
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation(updateAppointment, {
    onError: (error: Error) =>
      console.log('Update Appointment Error', error.message),
    onSuccess: () => {
      queryClient.invalidateQueries(['provider-detail']);
      queryClient.invalidateQueries(['providers-list']);
      queryClient.invalidateQueries(['me']);
    },
  });
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation(cancelAppointment, {
    onError: (error: Error) =>
      console.log('Cancel Appointment Error', error.message),
    onSuccess: response => {
      if (response) {
        queryClient.invalidateQueries(['provider-detail']);
        queryClient.invalidateQueries(['providers-list']);
        queryClient.invalidateQueries(['me']);
        return response;
      }
      return response;
    },
  });
};
