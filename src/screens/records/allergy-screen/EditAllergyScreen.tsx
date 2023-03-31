import dayjs from 'dayjs';
import { useHRRecord, useUpdateHRRecord } from 'hooks/useHealthRecord';
import { RootStackScreenProps } from 'navigation/types';
import { SubmitHandler } from 'react-hook-form';
import { useMemo } from 'react';
import AllergyForm, { AllergyFormValues } from './components/AllergyForm';

const EditAllergyScreen: React.FC<RootStackScreenProps<'EditAllergy'>> = ({
  route: {
    params: { id },
  },
}) => {
  const { data } = useHRRecord<'allergy'>(id);

  const { mutate: updateAllergyRecord } = useUpdateHRRecord<'allergy'>();

  const initialData: Partial<AllergyFormValues> | undefined = useMemo(() => {
    if (!data) return {};

    return {
      allergy: data?.record?.allergy,
      start: dayjs(data.record?.start, 'YYYY-MM-DD').format('MM/DD/YYYY'),
      start_date_part: data?.record?.start_date_part,
      last_occurrence: dayjs(data?.record?.last_occurrence, 'YYYY-MM-DD').format('MM/DD/YYYY'),
      last_occurrence_date_part: data?.record?.last_occurrence_date_part,
      category: data?.record?.category?.key?.toString(),
      type: data?.record?.type,
      criticality: data?.record?.criticality?.key.toString(),
      reaction: data?.record?.reaction,
      verification_status: data?.record?.verification_status?.key?.toString(),
      note: data?.note,
      private: data?.private,
      id: data?.record?.id,
    };
  }, [data]);

  if (!initialData) {
    return <></>;
  }
  const handleUpdateAllergy: SubmitHandler<AllergyFormValues> = (data: AllergyFormValues) => {
    const { start, category, allergy, last_occurrence, criticality, note, ...rest } = data;

    updateAllergyRecord(
      {
        id: id,
        data: {
          ...rest,
          start: dayjs(start, 'MM/DD/YYYY').format('YYYY-MM-DD'),
          last_occurrence: dayjs(last_occurrence, 'MM/DD/YYYY').format('YYYY-MM-DD'),
          category: category,
          note: note,
          reaction: data?.reaction,
          allergy: allergy,
          criticality: criticality.toString(),
        },
      },
      {
        onSuccess: data => {
          console.log(data);
        },
      },
    );
  };
  return <AllergyForm initialValues={initialData} onSubmit={handleUpdateAllergy} />;
};

export default EditAllergyScreen;
