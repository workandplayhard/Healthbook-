import axios from 'axios';

import api from '@src/axios-client';
import { handleAPIError } from '@utils/handleAPIError';
import type { DependentInfo } from './types';

export const getDependents = async () => {
  try {
    const response = await api.get<DependentInfo[]>(
      '/dependents/get_dependents/',
    );
    return response?.data;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response?.data === 'Dependent Details Not Found.'
    ) {
      return [];
    } else {
      throw new Error(handleAPIError(error).message);
    }
  }
};

export const deleteDependent = async (dependentId: number | undefined) => {
  try {
    const response = await api.delete(
      `/dependents/delete_dependent/${dependentId}`,
    );
    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const addDependent = async (dependentInfo: any) => {
  try {
    const response = await api.post(
      '/dependents/add_dependent/',
      dependentInfo,
    );

    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const updateDependent = async (dependentInfo: any) => {
  try {
    const response = await api.put(
      '/dependents/update_dependent/',
      dependentInfo,
    );

    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};
