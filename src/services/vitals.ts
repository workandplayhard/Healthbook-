import { handleAPIError } from '@utils/handleAPIError';
import api from '@src/axios-client';

type GetValidicUserMarketplaceResponse = {
  marketplace_url: string;
};

export const getValidicUserMarketplace = async () => {
  try {
    const response = await api.get<GetValidicUserMarketplaceResponse>(
      `/healthdashboard/provision_user/`,
    );
    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

type GetVitalsResponse = {
  distance_details: {
    today: string;
    last_7day_avg: string;
    last_7day_max: string;
    last_7day_min: string;
    unit: string;
  };
  steps_details: {
    today: string;
    last_7day_avg: string;
    last_7day_max: string;
    last_7day_min: string;
    unit: string;
  };
  heart_rate_details: {
    max_heart_rate: string;
    min_heart_rate: string;
    avg_heart_rate: string;
    last_7day_avg: string;
    unit: string;
  };
  spo2_details: {
    max_spo2: string;
    min_spo2: string;
    avg_spo2: string;
    last_7day_avg: string;
    unit: string;
  };
  sleep: {
    today: string;
    last_7day_min: string;
    last_7day_max: string;
    last_7day_avg: string;
    unit: string;
  };
};

export const getVitals = async (uid: string, deviceType: string) => {
  try {
    const response = await api.get<GetVitalsResponse>(
      `/wearables/vitals/?validic_uid=${uid}&device_type=${deviceType}`,
    );
    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

type GetVitalSettingsResponse = {
  vitals_status: {
    vital_id: number;
    vital_name: string;
    status: 'Enabled' | 'Disabled';
  }[];
};

export const getVitalSettings = async (userId: string) => {
  try {
    const response = await api.get<Array<GetVitalSettingsResponse>>(
      `/users/vitals_status/${userId}`,
    );
    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

type UpdateVitalSettingsResponse = {
  vitals_status: { vital_id: number; vital_name: string; show: boolean }[];
};

export const updateVitalSettings = async (
  userId: string,
  vitalsStatus: {
    vital_id: number;
    vital_name: string;
    status: 'Enabled' | 'Disabled';
  }[],
) => {
  try {
    const response = await api.post<UpdateVitalSettingsResponse>(
      '/users/update_vitals_status/',
      { user_id: userId, vitals_status: vitalsStatus },
    );
    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};
