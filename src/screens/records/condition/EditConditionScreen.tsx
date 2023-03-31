import dayjs from 'dayjs';
import { useHRRecord, useUpdateHRRecord } from 'hooks/useHealthRecord';
import { Box } from 'native-base';
import { RootStackScreenProps } from 'navigation/types';
import { SubmitHandler } from 'react-hook-form';
import ConditionForm, { ConditionFormValues } from './components/ConditionForm';
import { useMemo } from 'react';

const EditConditionScreen: React.FC<RootStackScreenProps<'EditCondition'>> = ({
  route: {
    params: { id },
  },
}) => {
  const { mutate: updateRecord } = useUpdateHRRecord();
  const { data } = useHRRecord<'condition'>(id);

  const initialValues = useMemo(() => {
    if (data) {
      return {
        ...data.record,
        verification_status: data.record.verification_status.key,
        test_file: data.attachments,
        note: data.note,
        start: dayjs(data.record.start, 'YYYY-MM-DD').format('MM/DD/YYYY'),
        end: dayjs(data.record.end, 'YYYY-MM-DD').format('MM/DD/YYYY'),
      };
    }
  }, [data]);

  const handleUpdateCondition: SubmitHandler<ConditionFormValues> = data => {
    const { start, end, ...rest } = data;

    updateRecord(
      {
        id,
        data: {
          ...rest,
          start: dayjs(start, 'MM/DD/YYYY').format('YYYY-MM-DD'),
          end: dayjs(end, 'MM/DD/YYYY').format('YYYY-MM-DD'),
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
    <Box flex={1}>
      <ConditionForm
        initialValues={initialValues}
        onSubmit={handleUpdateCondition}
      />
    </Box>
  );
};

export default EditConditionScreen;
