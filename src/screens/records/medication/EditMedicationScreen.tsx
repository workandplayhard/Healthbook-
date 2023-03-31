import { useMemo } from 'react';
import { useHRRecord, useUpdateHRRecord } from 'hooks/useHealthRecord';
import MedicationForm, {
  MedicationFormValues,
} from './components/MedicationForm';
import { RootStackScreenProps } from 'navigation/types';
import dayjs from 'dayjs';
import { SubmitHandler } from 'react-hook-form';
import { Box } from 'native-base';

const EditMedicationScreen: React.FC<
  RootStackScreenProps<'EditMedication'>
> = ({
  route: {
    params: { id },
  },
}) => {
  const { mutate: updateRecord } = useUpdateHRRecord();
  const { data } = useHRRecord<'medication'>(id);

  const initialValues = useMemo(() => {
    if (data) {
      const {
        record: {
          concentration,
          continuous,
          dosage,
          duration_frequency,
          duration_interval,
          medication,
          end,
          frequency,
          medication_stop,
          medication_stop_date,
          dosage_form,
          start,
          unit,
          interval,
        },
      } = data;

      return {
        test_file: data.attachments,
        note: data.note || undefined,
        start: dayjs(start, 'YYYY-MM-DD').format('MM/DD/YYYY'),
        medication_stop_date: medication_stop_date
          ? dayjs(medication_stop_date, 'YYYY-MM-DD').format('MM/DD/YYYY')
          : undefined,
        unit: unit.key,
        interval,
        dosage_form,
        medication_stop_reason: data.record?.medication_stop_reason?.key,
        concentration,
        continuous,
        dosage,
        duration_frequency: duration_frequency || undefined,
        duration_interval: duration_interval || undefined,
        medication,
        end,
        frequency,
        medication_stop: medication_stop || undefined,
      };
    }
  }, [data]);

  const handleUpdateMedication: SubmitHandler<MedicationFormValues> = data => {
    const { start, medication_stop_date, ...rest } = data;

    updateRecord(
      {
        id: id,
        data: {
          ...rest,
          start: dayjs(start, 'MM/DD/YYYY').format('YYYY-MM-DD'),
          medication_stop_date:
            medication_stop_date &&
            dayjs(medication_stop_date, 'MM/DD/YYYY').format('YYYY-MM-DD'),
        },
      },
      {
        onSuccess: data => {
          console.log(data);
        },
      },
    );
  };

  if (!initialValues) {
    return <Box></Box>;
  }

  return (
    <MedicationForm
      initialValues={initialValues}
      onSubmit={handleUpdateMedication}
    />
  );
};

export default EditMedicationScreen;
