import { useQuery } from '@tanstack/react-query';

import {
  getProviderDetail,
  GetProviderDetailInput,
  GetProvidersListInput,
} from '@services/provider';
import { getProviderTypeReasons, getProvidersList } from '@services/provider';

export const useGetProviderTypeReasons = () => {
  return useQuery({
    queryKey: ['provider-types-reasons'],
    queryFn: getProviderTypeReasons,
  });
};

export const useGetProvidersList = (input: GetProvidersListInput) => {
  return useQuery({
    queryKey: ['providers-list', input],
    queryFn: () => getProvidersList(input),
  });
};

export const useGetProviderDetail = (input: GetProviderDetailInput) => {
  return useQuery({
    queryKey: ['provider-detail', input],
    queryFn: () => getProviderDetail(input),
  });
};
