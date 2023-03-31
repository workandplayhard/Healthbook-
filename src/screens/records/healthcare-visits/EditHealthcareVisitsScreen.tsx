import { useMemo } from 'react';
import { useHRRecord, useUpdateHRRecord } from 'hooks/useHealthRecord';
import { Box } from 'native-base';
import { RootStackScreenProps } from 'navigation/types';
import HealthcareVisitsForm from './components/HealthcareVisitsForm';
import dayjs from 'dayjs';

const EditHealthcareVisitsScreen: React.FC<
  RootStackScreenProps<'EditMedicalvisit'>
> = ({
  route: {
    params: { id },
  },
}) => {
  const { data, isFetched } = useHRRecord<'medicalvisit'>(id);
  const { mutate: updateHealthcareVisit } = useUpdateHRRecord<'medicalvisit'>();

  const initialValues = useMemo(() => {
    if (data && isFetched) {
      const {
        professional,
        type_of_visit,
        reason,
        findings,
        treatment,
        diagnosis,
        symptoms,
        date,
      } = data.record;

      return {
        professional,
        type_of_visit,
        reason: reason.key,
        findings,
        treatment,
        diagnosis,
        symptoms,
        date: dayjs(date).format('MM/DD/YYYY'),
        note: data.note,
        test_file: data.attachments,
      };
    }
  }, [data, isFetched]);

  if (!initialValues) {
    return <Box></Box>;
  }

  return (
    <Box flex={1}>
      <HealthcareVisitsForm
        initialValues={initialValues}
        onSubmit={data => {
          const { date, ...rest } = data;

          updateHealthcareVisit({
            id,
            data: {
              date: dayjs(date, 'MM/DD/YYYY').format('MM/DD/YYYY'),
              ...rest,
            },
          });
        }}
      />
    </Box>
  );
};

export default EditHealthcareVisitsScreen;
