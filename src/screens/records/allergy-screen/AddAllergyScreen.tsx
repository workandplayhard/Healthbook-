import { useAddHealthRecord } from 'hooks/useHealthRecord';
import { SubmitHandler } from 'react-hook-form';
import dayjs from 'dayjs';
import AllergyForm, { AllergyFormValues } from './components/AllergyForm';

const AddAllergyScreen = () => {
  const { mutate: addAllergy, isLoading: addAllergyLoader } = useAddHealthRecord('allergy');

  const handleSaveAllergy: SubmitHandler<AllergyFormValues> = data => {
    const payloadData = {
      allergy: data?.allergy,
      start: dayjs(data?.start, 'MM/DD/YYYY').format('YYYY-MM-DD'),
      start_date_part: 'day',
      last_occurrence: dayjs(data?.last_occurrence, 'MM/DD/YYYY').format('YYYY-MM-DD'),
      last_occurrence_date_part: data?.last_occurrence_date_part,
      category: data?.category,
      type: 'allergy',
      criticality: data?.criticality.toString(),
      reaction: data?.reaction,
      verification_status: data?.verification_status,
      note: data?.note,
      private: false,
    };

    addAllergy(payloadData);
  };
  return <AllergyForm initialValues={{}} onSubmit={handleSaveAllergy} loader={addAllergyLoader} />;
};

export default AddAllergyScreen;
