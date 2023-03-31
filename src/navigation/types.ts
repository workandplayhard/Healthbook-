import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DocumentPickerResponse } from 'react-native-document-picker';

import type { CategoryType, DependentInfo, Document } from '@services/types';

type AddRecordScreens = {
  [Property in CategoryType as `Add${Capitalize<Property>}`]: undefined;
};
type EditRecordScreens = {
  [Property in CategoryType as `Edit${Capitalize<Property>}`]: { id: string };
};

export type RootStackNavigatorParamList = {
  MyCalendar: undefined;
  AccountSettings: undefined;
  Viewer: { data: { document_id: number; document_name: string } };
  AccessDocumentScreen: undefined;
  VerifySenderBirthday: undefined;
  SharingProcess: { documents: { id: number; name: string }[] };
  UploadDocumentTagScreen: { file: DocumentPickerResponse };
  EditDocumentScreen: { document: Document };
  SignIn: undefined;
  ForgotPassword: undefined;
  TabNavigator: NavigatorScreenParams<TabNavigatorParamList>;
  Welcome: undefined;
  WaitScreen: undefined;
  MainDashboardNavigator: NavigatorScreenParams<MainDashboardDrawerParamList>;
  AccountInfo: undefined;
  CaringMemberList: undefined;
  AddPerson: undefined;
  EditPerson: { person: DependentInfo };
  MyProfile: undefined;
  ConnectDevice: undefined;
  ConfirmAppointmentScreen: {
    payloadData: {
      name?: string;
      providerId?: number;
      date?: string;
      speciality?: string;
      slots: {
        start_time?: string;
        end_time?: string;
        isBooked?: boolean;
        availability_det_id?: number;
      };
      credentials: { credential_name?: string }[] | undefined;
      doxyLink?: string;
    };
    update: boolean | undefined | null;
    oldAvailabilityDetId: number | undefined | null;
    oldAppointmentDate: string | undefined | null;
  };
  BookAppointmentScreen: {
    appointmentDetails: AppointmentDataType;
    providerSpeciality: string | undefined;
  };
  ProviderListScreen: { type: string; label: string; date: string };
  ProviderDetailScreen: {
    provider: {
      date: string | undefined;
      provider_type: string | undefined;
      provider_id: number | undefined;
    };
    update: boolean | undefined | null;
    currentAppointmentDetails: AppointmentDataType | undefined;
  };
  SecuritySettings: undefined;
  EnterAccess: undefined;
  CodeRetrieval: undefined;
  ThankYou: undefined;
  CreateAccount: {
    first_name: string;
    last_name: string;
    dob: string;
    gender: string;
    email: string;
    signup_code: string;
    user_id: number;
  };
  DashboardSettings: undefined;
  HealthVault: undefined;
  Support: undefined;
  ConnectedHealth: undefined;
  TravelHistory: undefined;
  AddTravelHistory: undefined;
  EditTravelHistory: { id: string };
  ExportPDF: undefined;
  SymptomsChecker: undefined;
  SymptomsQuestionnaire: undefined;
  ImageUpload: undefined;
  AddSocialHabbit: undefined;
  EditSocialhistory: { id: string };
  Category: { type: CategoryType };
  Lab: undefined;
  BodyParts: undefined;
  Questionnaire: undefined;
  HealthHelp: { message?: string | null } | undefined;
} & AddRecordScreens &
  EditRecordScreens;

export type HealthStackNavigatorParamList = {
  ConfirmAppointmentScreen: {
    payloadData: {
      name?: string;
      providerId?: number;
      date?: string;
      speciality?: string;
      slots: {
        start_time?: string;
        end_time?: string;
        isBooked?: boolean;
        availability_det_id?: number;
      };
      credentials: { credential_name?: string }[];
      doxyLink?: string;
    };
    update: boolean | undefined | null;
    oldAvailabilityDetId: number | undefined | null;
    oldAppointmentDate: string | undefined | null;
  };
  BookAppointmentScreen: {
    appointmentDetails?: AppointmentDataType;
    providerSpeciality: string | undefined;
  };
  Telehealth: undefined;
  ProviderListScreen: { type: string; label: string; date: string };
  ProviderDetailScreen: {
    provider: {
      date: string | undefined;
      provider_type: string | undefined;
      provider_id: number | undefined;
    };
    update: boolean | undefined | null;
    currentAppointmentDetails: AppointmentDataType | undefined;
  };
  DashboardSettings: undefined;
  Dashboard: undefined;
  ChatTab: undefined;
};

export type HealthStackScreenProps<T extends keyof HealthStackNavigatorParamList> = CompositeScreenProps<
  NativeStackScreenProps<HealthStackNavigatorParamList, T>,
  CompositeScreenProps<BottomTabScreenProps<TabNavigatorParamList>, NativeStackScreenProps<RootStackNavigatorParamList>>
>;

export type RootStackNavigationProps = NativeStackNavigationProp<
  RootStackNavigatorParamList,
  'ForgotPassword',
  'SecuritySettings'
>;

export type TabNavigatorParamList = {
  TelehealthTab: NavigatorScreenParams<TelehealthStackNavigatorParamList>;
};

export type ChatStackNavigatorParamList = {
  Chat: undefined;
};

export type TelehealthStackNavigatorParamList = {
  Telehealth: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackNavigatorParamList> = NativeStackScreenProps<
  RootStackNavigatorParamList,
  T
>;

export type MainDashboardDrawerParamList = {
  'Quick Qustionairre': NavigatorScreenParams<QuestionnaireStackParamList>;
};

export type MainDashboardDrawerScreenProps<T extends keyof MainDashboardDrawerParamList> = DrawerScreenProps<
  MainDashboardDrawerParamList,
  T
>;

export type QuestionnaireStackParamList = {
  Main: undefined;
  Thankyou: undefined;
};

export type QuestionnaireStackScreenProps<T extends keyof QuestionnaireStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<QuestionnaireStackParamList, T>,
  CompositeScreenProps<
    DrawerScreenProps<MainDashboardDrawerParamList>,
    NativeStackScreenProps<RootStackNavigatorParamList>
  >
>;

export type CaringCircleNavigatorParamList = {
  CaringMemberList: undefined;
  AddPerson: undefined;
  EditPerson: { person: DependentInfo };
};

export type CaringCircleStackScreenProps<T extends keyof CaringCircleNavigatorParamList> = CompositeScreenProps<
  NativeStackScreenProps<CaringCircleNavigatorParamList, T>,
  NativeStackScreenProps<RootStackNavigatorParamList>
>;

export type AppointmentDataType = {
  provider_id: number | undefined;
  availability_det_id: number | undefined;
  cancellation_notes: string | undefined;
  appointment_date: string | undefined;
  provider_name: string | undefined;
  additional_notes: string | undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackNavigatorParamList {}
  }
}
