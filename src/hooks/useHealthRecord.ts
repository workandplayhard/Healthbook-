import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCountPerType,
  getHealthRecords,
  getHRChoices,
  getHROptions,
  getAllergyCause,
  getRecord,
  getSharedRecords,
  deleteHealthRecord,
  deleteHRAttachment,
  FormValuesPerType,
  addHealthRecord,
  updateHealthRecord,
  generateSharedRecordPDF,
  getReceivedRecords,
  addReceivedRecord,
  getBodySiteList,
  revokeAccess,
  deleteRecord,
} from 'services/healthrecords';
import { CategoryType } from 'services/types';
import create from 'zustand';

export const useHRChoices = (
  type: CategoryType,
  query: { [prop: string]: string | number },
) => {
  return useQuery(
    ['hr-choices', type, query],
    () => getHRChoices(type, query),
    {
      enabled: !!query.q,
    },
  );
};

export const useHROptions = (type: CategoryType) => {
  return useQuery(['hr-options', type], () => getHROptions(type));
};

export const useCountPerType = () => {
  return useQuery(['hr-counts-per-type'], getCountPerType);
};

export const useHRRecord = <T extends CategoryType>(id: string) => {
  return useQuery(['hr-record-detail', id], () => getRecord<T>(id), {
    enabled: !!id,
  });
};

export const useUpdateHRRecord = <T extends CategoryType>() => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  return useMutation({
    mutationFn: updateHealthRecord<T>,
    onSuccess: () => {
      queryClient.invalidateQueries(['hr-record-detail']);
      queryClient.invalidateQueries(['hr-records-per-type']);

      navigation.goBack();
    },
    onError: () => {
      console.log('Updating record error');
    },
  });
};

export const useHealthRecords = <T extends CategoryType>(type: T) => {
  return useQuery(['hr-records-per-type', type], () => getHealthRecords(type), {
    enabled: !!type,
  });
};

export const useSharedRecords = () => {
  return useQuery(['shared-hr-records'], getSharedRecords);
};

export const useReceivedRecords = () => {
  return useQuery(['received-hr-records'], getReceivedRecords);
};

export const useIsVisited = create<{
  isVisited: boolean;
  setIsVisited: (isVisited: boolean) => void;
}>(set => ({
  isVisited: false,
  setIsVisited: (isVisited: boolean) => set({ isVisited }),
}));

export const useIsHealthVaultVisited = create<{
  isVisited: boolean;
  setIsVisited: (isVisited: boolean) => void;
}>(set => ({
  isVisited: false,
  setIsVisited: (isVisited: boolean) => set({ isVisited }),
}));

export const useGetAllergyOptions = (
  queryText: string,
  allergyType: string,
) => {
  return useQuery({
    queryKey: ['allergy-causes', queryText, allergyType],
    queryFn: () => getAllergyCause(queryText, allergyType),
  });
};

export const useAddHealthRecord = <T extends keyof FormValuesPerType>(
  type: T,
) => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  return useMutation({
    mutationFn: (data: FormValuesPerType[T]) => addHealthRecord({ type, data }),
    onSuccess: response => {
      queryClient.invalidateQueries(['hr-records-per-type']);
      queryClient.invalidateQueries(['hr-counts-per-type']);
      navigation.goBack();
    },
    onError: () => {
      console.log('Add immunization error');
    },
  });
};

export const useDeleteHealthRecord = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ hr, attachments }: { hr: string; attachments?: string[] }) => {
      try {
        await deleteHealthRecord(hr);
        if (attachments && attachments.length) {
          await deleteHRAttachment(attachments);
        }

        return 'success';
      } catch (error) {
        console.log(error);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['hr-records-per-type']);
        queryClient.invalidateQueries(['hr-counts-per-type']);
      },
      onError: () => {
        console.log('Add immunization error');
      },
    },
  );
};
export const useGenerateSharedRecordPDF = () => {
  return useMutation(generateSharedRecordPDF, {
    onError: (error: Error) =>
      console.log('Generate Shared Record PDF Error', error.message),
    onSuccess: response => {
      return response;
    },
  });
};

export const useAddReceivedRecord = () => {
  return useMutation(addReceivedRecord, {
    onError: (error: Error) =>
      console.log('Generate Received Record Error', error.message),
    onSuccess: response => {
      return response;
    },
  });
};

export const useBodySiteList = () => {
  return useQuery(['hr-body-sites'], getBodySiteList);
};

export const useRevokeAccess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: revokeAccess,
    onSuccess: data => {
      queryClient.invalidateQueries(['shared-hr-records']);
    },
  });
};

export const useDeleteRecord = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteRecord, {
    onError: (error: Error) => console.log('Update User error', error.message),
    onSuccess: () => {
      queryClient.invalidateQueries(['hr-records-per-type']);
      queryClient.invalidateQueries(['hr-counts-per-type']);
    },
  });
};
