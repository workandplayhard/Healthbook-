import api from '@src/axios-client';

import { handleAPIError } from '@utils/handleAPIError';

type GetOptionsResponse = {
  marital_status: { key: string; value: string }[];
  race: { key: string; value: string }[];
  gender: { key: string; value: string }[];
  sex: { key: string; value: string }[];
  relationship: { key: string; value: string }[];
  states: { key: string; value: string }[];
  credentials: {
    credential_id: number;
    credential_name: string;
    credential_description: string;
    organization_id: number;
  }[];
};

export const getOptions = async () => {
  try {
    const response = await api.get<GetOptionsResponse>('/options/');
    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};
