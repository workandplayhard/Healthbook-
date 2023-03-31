import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { updatePatient, getPatient } from 'services/patients';

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePatient,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['patient', variables.patientId]);
    },
  });
};

export const useGetPatient = (
  patientId: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => getPatient(patientId),
    ...options,
  });
};
