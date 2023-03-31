import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import type { StateCreator } from 'zustand';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  getHVDocuments,
  getHVTags,
  saveDocument,
  getRelationsAndDurations,
  deleteDocuments,
  getSharingDocuments,
  updateDocument,
  saveSharingDocument,
  getFile,
} from '@services/healthVault';

export type HealthVaultState = {
  healthVault?: boolean;
  setHealthVault: (healthVault: boolean) => void;
  clear: () => void;
};

const healthVault: StateCreator<HealthVaultState> = set => ({
  healthVault: undefined,
  setHealthVault: (healthVault: boolean) => set({ healthVault }),
  clear: () =>
    set({
      healthVault: undefined,
    }),
});

export const useHealthVaultFirstTime = create(
  devtools(
    persist(healthVault, { name: 'healthVault', getStorage: () => AsyncStorage }), // TODO: Use secure storage
  ),
);

const getField = (field: string) => {
  switch (field) {
    case 'name':
      return 'document_name';
    case 'date':
    default:
      return 'document_uploaded_at';
  }
};

export const useHVDocuments = (sortBy: string, filterBy: string) => {
  const [order, field] = sortBy.split('-');
  const sort = { order, field: getField(field) };

  return useQuery(['hv-documents', sortBy, filterBy], () =>
    getHVDocuments({ page_count: 1, sort, filter: { field: filterBy } }),
  );
};

export const useHVTags = () => useQuery(['hv-tags'], getHVTags);

export const useSaveDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveDocument,
    onSuccess: () => {
      queryClient.resetQueries(['hv-documents']);
    },
    onError: (err: Error) => { },
  });
};

export const useRelationsAndDurations = () => {
  return useQuery(['hv-sharing-relations-and-durations'], () => getRelationsAndDurations());
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDocuments,
    onSuccess: () => {
      queryClient.resetQueries(['hv-documents']);
    },
    onError: (err: Error) => { },
  });
};

export const useSharingDocuments = () => {
  return useInfiniteQuery(
    ['sharing-documents'],
    ({ pageParam = 1 }) => {
      return getSharingDocuments(pageParam);
    },
    {
      getNextPageParam: lastPage => {
        const { page, number_of_records } = lastPage;
        if (number_of_records > page * 10) return page + 1;
      },
    },
  );
};

export const useUpdateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDocument,
    onSuccess: () => {
      queryClient.invalidateQueries(['hv-documents']);
    },
    onError: (err: Error) => { },
  });
};

export const useSaveSharingDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveSharingDocument,
    onSuccess: () => {
      queryClient.invalidateQueries(['sharing-documents']);
    },
    onError: (err: Error) => { },
  });
};

export const useGetFile = (id: number) => {
  return useQuery(['get-document', id], () => getFile(id));
};
