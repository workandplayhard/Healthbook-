import api from '@src/axios-client';

import { handleAPIError } from '@utils/handleAPIError';
import { Patient } from './types';

export const updatePatient = async ({
  patientId,
  data,
}: {
  patientId: string;
  data: Patient;
}) => {
  try {
    const response = await api.put(`/patients/${patientId}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(handleAPIError(error).message);
  }
};

export const getPatient = async (patientId: string) => {
  try {
    const response = await api.get<Patient>(`/patients/${patientId}`);
    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};
