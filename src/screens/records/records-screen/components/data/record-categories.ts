import MedicalConditionIcon from '@assets/icons/health_records/medical-conditions.svg';
import SymptomsIcon from '@assets/icons/health_records/symptoms.svg';
import SurgeriesIcon from '@assets/icons/health_records/surgeries.svg';
import ProceduresIcon from '@assets/icons/health_records/procedures.svg';
import ImagingIcon from '@assets/icons/health_records/imaging.svg';
import LabsIcon from '@assets/icons/health_records/labs.svg';
import ImmunizationsIcon from '@assets/icons/health_records/immunizations.svg';
import FamilyHistoryIcon from '@assets/icons/health_records/family-history.svg';
import MedicationsIcon from '@assets/icons/health_records/medications.svg';
import SupplementsIcon from '@assets/icons/health_records/supplements.svg';
import AllergiesIcon from '@assets/icons/health_records/allergies.svg';
import SocialsHabitsIcon from '@assets/icons/health_records/social-habits.svg';
import HealthcareVisitsIcon from '@assets/icons/health_records/healthcare-visits.svg';
import TravelHistoryIcon from '@assets/icons/health_records/travel.svg';

export const recordCategories = [
  {
    Icon: AllergiesIcon,
    title: 'Allergies',
    key: 'allergy',
    navigationKey: 'Allergy',
  },
  {
    Icon: FamilyHistoryIcon,
    title: 'Family History',
    key: 'familyhistory',
  },
  {
    Icon: HealthcareVisitsIcon,
    title: 'Healthcare Visit',
    key: 'medicalvisit',
    navigationKey: 'HealthcareVisits',
  },
  {
    Icon: ImagingIcon,
    title: 'Imaging',
    key: 'diagnostic',
  },
  {
    Icon: ImmunizationsIcon,
    title: 'Immunizations',
    key: 'immunization',
  },
  {
    Icon: LabsIcon,
    title: 'Labs',
    key: 'lab',
    navigationKey: 'Lab',
  },
  {
    Icon: MedicalConditionIcon,
    title: 'Medical Conditions',
    key: 'condition',
    navigationKey: 'Category',
  },
  {
    Icon: MedicationsIcon,
    title: 'Medications',
    key: 'medication',
    navigationKey: 'Medication',
  },
  {
    Icon: ProceduresIcon,
    title: 'Procedures',
    key: 'procedure',
    navigationKey: 'Procedure',
  },
  {
    Icon: SupplementsIcon,
    title: 'Supplements',
    key: 'supplement',
  },
  {
    Icon: SocialsHabitsIcon,
    title: 'Socials Habits',
    key: 'socialhistory',
    navigationKey: 'SocialHabbit',
  },
  {
    Icon: SurgeriesIcon,
    title: 'Surgeries',
    key: 'surgery',
    navigationKey: 'Surgeries',
  },

  {
    Icon: SymptomsIcon,
    title: 'Symptoms',
    key: 'symptom',
  },
  {
    Icon: TravelHistoryIcon,
    title: 'Travel History',
    key: 'travelhistory',
    navigationKey: 'TravelHistory',
  },
];
