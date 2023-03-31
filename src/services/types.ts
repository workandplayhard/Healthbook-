export type PatientAppointmentDetail = {
  is_booked: boolean;
  is_completed: boolean;
  appointment_time: string;
  appointment_date: string;
  provider_notes: string;
  patient_appointment_id: string;
  patient_id: number;
  availability_det_id: number;
  provider_id: number;
  additional_notes: string;
  provider_name: string;
  provider_speciality: string;
  video_conference_link: string;
  appointment_end_time: string;
};

export type User = {
  user_id: string;
  credential?: any;
  last_name?: string | null;
  first_name?: string | null;
  dob?: string | null;
  /** When posting to server use key:value */
  gender?: string | { key: string; value: string } | null;
  /** When posting to server use key:value */
  sex?: string | { key: string; value: string } | null;
  email?: string | null;
  profile_picture?: string | null;
  phone_number?: string | null;
  address?: string | null;
  city?: string | null;
  /** When posting to server use key:values */
  state?: string | { key: string; values: string } | null;
  /** Use this for retrieving zip code value from server */
  zip_code?: string | null;
  /** Use this for posting zip code value to server */
  zip?: string | null;
  imperial_units?: boolean | null;
  roles?: { patient: string };
  validic_user?: {
    id?: string;
    uid?: string;
    status?: string;
    marketplace?: {
      token: string;
      url: string;
    };
    mobile?: { token: string };
    sources?: { type: string }[];
  } | null;
  validic_user_status?: string | null;
  patient_appointment_details?: Array<PatientAppointmentDetail> | null;
  user_org_details?: Array<{
    org: number;
    org_logo: string;
    org_name: string;
    org_short_name: string;
  }> | null;
  settings?: {
    welcomed?: boolean;
    isVisitedHealthRecords?: boolean;
  };
};

export type PatientAppointmentDetailsType = {
  is_booked: boolean;
  is_completed: boolean;
  appointment_time: string;
  appointment_date: string;
  provider_notes: null;
  patient_appointment_id: number;
  patient_id: number;
  availability_det_id: number;
  provider_id: number;
  additional_notes: string;
  provider_name: string;
  provider_speciality: string;
  provider_credentials: undefined;
  video_conference_link: string;
  appointment_end_time: string;
}[];

export type UserOrgDetailsType = {
  org: number;
  org_short_name: string;
  org_name: string;
  org_logo: string;
}[];

export type Dependent = {
  user_id: number;
  patient_id: number;
  dependent_id: number;
  relationship?: {
    key?: string;
    value?: string;
  };
  gender?: {
    key?: string;
    value?: string;
  };
  race?: {
    key?: string;
    value?: string;
  };
  first_name?: string;
  last_name?: string;
  dob?: string;
  sex?: {
    key?: string;
    value?: string;
  };
  weight?: number;
  height?: number;
  occupation?: string;
  notes?: string;
  phone_number: string;
};

export type UpdateAppointmentDataType = {
  old_availability_det_id: number | undefined;
  old_appointment_date: string | undefined;
  patient: string | undefined;
  patient_first_name: string | undefined;
  patient_last_name: string | undefined;
  appointment_date: string | undefined;
  appointment_time: string | undefined;
  appointment_end_time: string | undefined;
  provider_id: number | undefined;
  provider_name: string | undefined;
  availability_det_id: number | undefined;
  patient_email: string | undefined;
  provider_speciality: string | undefined;
  additional_notes: string | undefined;
  video_conference_link: string | undefined;
};

export type EmergencyContact = {
  emergency_contact_id: string;
  dependent_id: string;
  emergency_contact_type_id: number;
  first_name?: string;
  last_name?: string;
  address?: string;
  city?: string;
  state?: {
    key?: string;
    value?: string;
  };
  zipcode?: string;
  phone_number?: string;
};

export type Physician = {
  dependent_physician_id: number;
  dependent_id: number;
  physician_type_id: number;
  first_name?: string;
  last_name?: string;
  speciality?: string;
  hospital?: string;
  phone_number?: string;
};

export type QuestionnaireResult = {
  user_id: string;
  user_response: Array<{
    question_id: string;
    answers: { [prop: string]: string };
  }>;
};

export type ProfileQuestion = {
  question_id: string;
  question_title: string;
  question_options: { [props: string]: string };
  question_options_default: string;
  question_type: string;
};

export type Patient = {
  weight: string | number | null;
  height: [string, string] | number | string | null;
  race: string | null;
  marital_status: string | null;
  no_children: string | null;
  occupation: string | null;
  personal_doctor_last_name: string | null;
  personal_doctor_first_name: string | null;
  hospital: string | null;
  personal_doctor_specialty: string | null;
  personal_doctor_phone_number: string | null;
  emergency_contact_last_name: string | null;
  emergency_contact_first_name: string | null;
  emergency_contact_address: string | null;
  emergency_contact_phone_number: string | null;
  emergency_zip_code: string | null;
  emergency_city: string | null;
  emergency_state: string | { key: string; value: string } | null;
  imperial_units: boolean;
  gender: string | { key: string; value: string } | null;
  sex: string | { key: string; value: string } | null;
  notes: string | null;
};

export type Provider = {
  provider_id?: number;
  first_name?: string;
  last_name?: string;
  city?: string;
  state?: string;
  profile_picture_url?: string | null;
  biography?: string;
  speciality?: string;
  credentials?: { credential_name?: string }[];
  gender?: string;
  available_slots?: {
    date: string;
    slot: {
      start_time?: string;
      end_time?: string;
      isBooked?: boolean;
      availability_det_id?: number;
    }[];
  };
  doxy_me_link?: string;
};

export type DependentInfo = {
  dependent_data: Dependent;
  emergency_contact_data: EmergencyContact;
  physician_data: Physician;
};

export type SurgeryPayload = {
  surgery: string;
  date: string;
  complication: string;
  hospital: string;
  histology_report: string;
  body_sites: string;
  private: boolean;
  note: string;
};

export type Pagination<T = any> = {
  count: number;
  next: string;
  results: Array<T>;
};

export type SharedRecord = {
  sender_name: string;
  sender_email: string;
  sender_user_id: string;
  sender_patient_id: string;
  hr_expiration_date_time: string;
  record_id: number;
  record_date: string;
  is_access_revoked: boolean;
};

export type ReceivedRecord = {
  key: string;
  sender_email: string;
  sender_user_id: string;
  sender_patient_id: string;
  sender_name: string;
  hr_expiration_date_time: string;
  record_id: number;
  record_date: string;
  is_access_revoked: boolean;
};

export type RecordReceivedPayload = {
  patient_id: string;
};

export type CategoryType =
  | 'condition'
  | 'symptom'
  | 'surgery'
  | 'procedure'
  | 'lab'
  | 'immunization'
  | 'familyhistory'
  | 'medication'
  | 'supplement'
  | 'allergy'
  | 'socialhistory'
  | 'medicalvisit'
  | 'travelhistory';

type Attachment = {
  content_type: string;
  content_type_label: string;
  created_at: string;
  description: string;
  extension: string;
  folder: number;
  id: number;
  modified_at: string;
  name: string;
  object_type: string;
  owner: string;
  size: string;
  url: string;
};

type RecordPerType = {
  condition: {
    condition: string;
    end: string;
    start: string;
    id: number;
    verification_status: { key: string; value: string };
  };
  familyhistory: {
    id: number;
    family_member_name: string;
    relationship_type: {
      key: string;
      value: string;
    };
    deceased: boolean;
    medical_problem: string;
    start: string;
    end: string;
    outcome: {
      key: string;
      value: string;
    };
  };
  medication: {
    id: number;
    medication: string;
    start: string;
    dosage: string;
    dosage_form: string;
    medication_stop: boolean;
    end: string;
    medication_stop_date: string;
    medication_stop_reason: { key: string; value: string };
    continuous: boolean;
    frequency: string;
    concentration: string;
    interval: string;
    duration_frequency: string;
    duration_interval: string;
    unit: {
      key: string;
      value: string;
    };
  };
  immunization: {
    id: number;
    date: string;
    immunization: string;
    dose_number: number;
    series_doses: number;
    reaction: {
      key: string;
      value: string;
    };
  };
  allergy: {
    allergy: string;
    category: string;
    criticality: string;
    id?: number;
    last_occurrence: string;
    last_occurrence_date_part: string;
    last_occurrence_formatted: string;
    reaction: {
      key: string;
      value: string;
    };
    start: string;
    start_date_part: string;
    start_formatted: string;
    type: string;
    verification_status: string;
  };
  symptom: {
    id: number;
    symptom: string;
    start: string;
    end: string;
    intensity: number;
    frequency: {
      key: number;
      value: string;
    };
    interval: {
      key: string;
      value: string;
    };
  };
  surgery: {
    body_sites: Array<{ id: string; code: string; display: string }>;
    complication: string;
    date: string;
    histology_report: string;
    hospital: string;
    implant: string | null;
    surgery: string;
  };
  medicalvisit: {
    body_sites: string[];
    date: string;
    diagnosis: string;
    findings: string;
    professional: string;
    reason: { key: string; value: string };
    symptoms: string;
    treatment: string;
    type_of_visit: string;
  };
  travelhistory: {
    start: string;
    start_date_part: string;
    end: string;
    end_date_part: string;
    country: { key: string; value: string };
    note: string;
    private: boolean;
  };
  socialhistory: {
    category: string;
    start_age: string;
    end_age: string;
    specialist_intervention: boolean;
    frequency: string;
    interval: string;
    note: string;
    private: boolean;
  };
  procedure: {
    body_sites: Array<{ id: string; code: string; display: string }>;
    complication: string;
    date: string;
    histology_report: string;
    hospital: string;
    implant: string | null;
    procedure: string;
  };
} & {
  [Property in CategoryType]: unknown & { test_file?: any };
};

export type RecordResponse<T extends CategoryType> = {
  attachments: Attachment[];
  date: string;
  date_formatted: string;
  group: string;
  hr_id: number;
  note: string;
  record_type: T;
  private: boolean;
  record: RecordPerType[T];
};

export type Tag = {
  id: number;
  tag_name: string;
};

export type Document = {
  document_id: number;
  document_name: string;
  document_path: string;
  document_uploaded_at: string;
  tags: Tag[];
};

export type SharedDocument = {
  document_id: number;
  document_path: string;
  document_name: string;
  expiry_date: string;
  is_deleted: boolean;
  recipient_name: string;
  uploaded_at: string;
};

export type Duration = {
  id: number;
  duration_view: string;
  duration_days: number;
};

export type Relationship = { id: number; recipient_relationship: string };
