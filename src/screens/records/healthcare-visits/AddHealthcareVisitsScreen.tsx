import dayjs from 'dayjs';
import { useAddHealthRecord } from 'hooks/useHealthRecord';
import { Box } from 'native-base';
import HealthcareVisitForm from './components/HealthcareVisitsForm';

const AddHealthcareVisitScreen = () => {
  const { mutate: addHealthcareVisit } = useAddHealthRecord('medicalvisit');

  return (
    <Box flex={1}>
      <HealthcareVisitForm
        initialValues={{}}
        onSubmit={data => {
          const { date, ...rest } = data;

          addHealthcareVisit({
            date: dayjs(date, 'MM/DD/YYYY').format('MM/DD/YYYY'),
            ...rest,
          });
        }}
      />
    </Box>
  );
};

export default AddHealthcareVisitScreen;
