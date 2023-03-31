import api from '@src/axios-client';

import { handleAPIError } from '@utils/handleAPIError';
import { Provider } from './types';

type TypeReasonsResponse = {
  provider_type: { id: number; provider_type: string }[];
  reason: { id: number; reason_name: string }[];
};

export const getProviderTypeReasons = async () => {
  try {
    const response = await api.get<TypeReasonsResponse>(
      '/peercoaching/providertypereasons/',
    );
    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export type GetProvidersListInput = {
  search_text: string;
  provider_type: string;
  date: string;
  filter?: {
    gender?: string;
    language?: string;
  };
  sort?: {
    field: string;
    order: string;
  };
};

export const getProvidersList = async (input: GetProvidersListInput) => {
  try {
    if (input.search_text) {
      const response = await api.post<{ search_result: Provider[] }>(
        '/provider/get_provider_search/',
        input,
      );
      return response.data.search_result;
    } else {
      const response = await api.post<Provider[]>(
        '/provider/get_provider_list/',
        input,
      );
      return response.data;
    }
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export type GetProviderDetailInput = {
  provider_type?: string;
  provider_id?: number;
  date?: string;
};

export const getProviderDetail = async (input: GetProviderDetailInput) => {
  try {
    const response = await api.post<Array<Provider>>(
      '/provider/get_provider_detail/',
      input,
    );

    return response?.data[0];
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};
