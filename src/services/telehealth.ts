import api from '@src/axios-client';

import { handleAPIError } from '@utils/handleAPIError';

type CancelAppointmentPayloadDataType = {
  provider_id?: number;
  availability_det_id?: number;
  cancellation_notes?: string;
  appointment_date?: string;
  is_cancel_from_provider?: boolean;
};

type BookAppointmentPayloadDataType = {
  patient?: string;
  provider_id?: number;
  availability_det_id?: number;
  provider_name?: string;
  provider_speciality?: string;
  provider_credentials?: { credential_name?: string }[];
  appointment_date?: string;
  appointment_end_time?: string;
  appointment_time?: string;
  additional_notes?: string;
  video_conference_link?: string;
};

type BookingCofirmationType = {
  provider_id: number;
  availability_det_id: number;
  cancellation_notes: string;
  appointment_date: string;
  is_cancel_from_provider: boolean;
  provider_name: string;
  additional_notes: string;
};
type UpdateAppointmentPayloadType = {
  old_availability_det_id: number | undefined | null;
  old_appointment_date: string | undefined | null;
  patient: string | undefined | null;
  patient_first_name: string | undefined | null;
  patient_last_name: string | undefined | null;
  appointment_date: string | undefined | null;
  appointment_time: string | undefined | null;
  appointment_end_time: string | undefined | null;
  provider_id: number | undefined | null;
  provider_name: string | undefined | null;
  availability_det_id: number | undefined | null;
  patient_email: string | undefined | null;
  provider_speciality: string | undefined | null;
  additional_notes: string | undefined | null;
  video_conference_link: string | undefined | null;
};

export const bookAppointment = async (
  payloadData: BookAppointmentPayloadDataType,
) => {
  try {
    const response = await api.post<BookingCofirmationType>(
      '/patients/book_appointment/',
      payloadData,
    );

    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};
export const cancelAppointment = async ({
  data,
}: {
  data: CancelAppointmentPayloadDataType;
}) => {
  try {
    const response = await api.post('/provider/cancel_appointment/', data);

    return response.status === 200;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const updateAppointment = async (
  payloadData: UpdateAppointmentPayloadType | undefined,
) => {
  try {
    const response = await api.post<BookingCofirmationType>(
      '/patients/update_appointment/',
      payloadData,
    );

    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};
