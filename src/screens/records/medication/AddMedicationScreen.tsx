import dayjs from 'dayjs';
import { useAddHealthRecord } from 'hooks/useHealthRecord';
import { useCallback } from 'react';
import { SubmitHandler } from 'react-hook-form';
import MedicationForm, {
  MedicationFormValues,
} from './components/MedicationForm';

const AddMedicationScreen = () => {
  const { mutate: addMedication } = useAddHealthRecord('medication');

  const handleAddMedication: SubmitHandler<MedicationFormValues> = useCallback(
    ({ start, medication_stop_date, ...data }) => {
      addMedication({
        ...data,
        start: dayjs(start, 'MM/DD/YYYY').format('YYYY-MM-DD'),
        medication_stop_date:
          medication_stop_date &&
          dayjs(medication_stop_date, 'MM/DD/YYYY').format('YYYY-MM-DD'),
      });
    },
    [addMedication],
  );

  return <MedicationForm initialValues={{}} onSubmit={handleAddMedication} />;
};

export default AddMedicationScreen;
