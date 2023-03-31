import { handleAPIError } from 'utils/handleAPIError';
import api from '@src/axios-client';
import { ConditionFormValues } from 'screens/records/condition/components/ConditionForm';
import type { CategoryType, Pagination, RecordResponse, SharedRecord, ReceivedRecord } from './types';
import type { ImmunizationFormValues } from 'screens/records/immunization/components/ImmunizationForm';
import { FamilyHistoryFormValues } from 'screens/records/family-history/components/FamilyHistoryForm';
import { MedicationFormValues } from 'screens/records/medication/components/MedicationForm';
import { SymptomFormValues } from 'screens/symptoms/components/SymptomsForm';
import { SurgeryFormValues } from 'screens/records/surgeries/components/SurgeryForm';
import { MedicalVisitFormValues } from 'screens/records/healthcare-visits/components/HealthcareVisitsForm';
import { TravelHistoryFormValues } from 'screens/records/travel-history-screen/components/TravelHistoryForm';
import { ProcedureFormValues } from 'screens/records/procedure/components/ProcedureForm';
import { useMutation } from '@tanstack/react-query';
import { AllergyFormValues } from 'screens/records/allergy-screen/components/AllergyForm';

type Choices = {
  count: number;
  next: string;
  results: Array<any>;
};

export const getHRChoices = async (
  type: CategoryType,
  { q = '', offset = 0, limit = 10, ...rest }: { [prop: string]: string | number },
) => {
  try {
    const response = await api.get<Choices>(`/hr/choices/${type}/`, {
      params: { q, offset, limit, ...rest },
    });

    return response.data.results;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const getCountPerType = async () => {
  try {
    const response = await api.get<{ [prop: string]: number }>('/hr/count/');

    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const getHealthRecords = async <T extends CategoryType>(type: T) => {
  try {
    const response = await api.get<Pagination<RecordResponse<T>>>(`/hr/${type}/`);

    return response.data.results;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const getHROptions = async (type: CategoryType) => {
  try {
    const response = await api.get(`/hr/${type}/options/`);

    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const getRecord = async <T extends CategoryType>(id: string) => {
  try {
    const response = await api.get<RecordResponse<T>>(`/hr/${id}`);

    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const getSharedRecords = async () => {
  try {
    const response = await api.get<{ response: SharedRecord[] }>('/sharing/get-shared-hr-details/');

    return response.data.response;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const getReceivedRecords = async () => {
  try {
    const response = await api.get<{ response: ReceivedRecord[] }>('/sharing/get-received-hr-details/');

    return response.data.response;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const getAllergyCause = async (queryText: string | undefined, allergyType: string | undefined) => {
  try {
    const response = await api.get(`/hr/choices/allergy/?q=${queryText}&group=${allergyType}&offset=0&limit=10`);
    return response.data.results;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};
export type SocialHabbitFormValues = {
  category: string;
  start_age: string;
  end_age: string;
  specialist_intervention: boolean;
  frequency: string;
  interval: string;
  note: string;
  private: boolean;
};
export type FormValuesPerType = {
  familyhistory: FamilyHistoryFormValues;
  condition: ConditionFormValues;
  immunization: ImmunizationFormValues;
  allergy: AllergyFormValues;
  medication: MedicationFormValues;
  symptom: SymptomFormValues;
  surgery: SurgeryFormValues;
  socialhistory: SocialHabbitFormValues;
  medicalvisit: MedicalVisitFormValues;
  travelhistory: TravelHistoryFormValues;
  procedure: ProcedureFormValues;
} & {
  [Property in CategoryType]: unknown & { test_file?: any };
};

export const updateHealthRecord = async <T extends CategoryType>({
  id,
  data,
}: {
  id: string;
  data: FormValuesPerType[T];
}) => {
  let payload: any = {};
  Object.keys(data).forEach(key => {
    if (data[key as keyof typeof data] !== undefined) {
      payload[key] = data[key as keyof typeof data];
    }
  });

  try {
    const response = await api.put<RecordResponse<T>>(`/hr/${id}`, payload);

    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const addHealthRecord = async <T extends CategoryType>({
  type,
  data,
}: {
  type: T;
  data: FormValuesPerType[T];
}) => {
  try {
    const response = await api.post<RecordResponse<T>>(`/hr/${type}/`, data);

    if (data?.test_file && data.test_file.length) {
      const formData = new FormData();
      data?.test_file.forEach((item: any) => {
        formData.append('test_file', {
          uri: item.uri || item.path,
          type: item.mime || item.type,
          name: item.name || item.filename || item.path.split('/').reverse()[0],
        });
      });

      await api.post(`/hr/${response.data.hr_id}/attachment/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const deleteRecord = async (recordId: number | undefined) => {
  try {
    const response = await api.delete(`/hr/${recordId}`);
    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const deleteHealthRecord = async (id: string) => {
  try {
    const response = await api.delete(`/hr/${id}`);

    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const deleteHRAttachment = async (ids: string[]) => {
  try {
    for (let id of ids) {
      await api.delete(`/hr/attachment/${id}`);
    }
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const generateSharedRecordPDF = async (allergyPayload: { hr_types: string[] }) => {
  try {
    const response = await api.post('/sharing/export/', allergyPayload);

    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

type AddReceivedRecordResponse = {
  results: {
    record: any;
    record_type_label: any;
    record_label: any;
    record_type: any;
    records: { record_type: string }[];
  }[];
  // results: Array<{ records: { record_type: string } }>;
};

export const addReceivedRecord = async (payload: { patient_id: string[] }) => {
  try {
    const response = await api.post<AddReceivedRecordResponse>('/hr/get-senders-hr-records', payload);
    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const getBodySiteList = async () => {
  try {
    const response = await api.get<Array<{ code: string; display: string }>>('/hr/bodysite/');

    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const revokeAccess = async (record_id: number) => {
  try {
    const response = await api.post('/sharing/hr-update-revoke-access/', {
      record_id,
      is_access_revoked: 'True',
    });

    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};
