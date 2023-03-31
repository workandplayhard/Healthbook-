import dayjs from 'dayjs';
import { useAddHealthRecord } from 'hooks/useHealthRecord';
import { Box } from 'native-base';
import { SubmitHandler } from 'react-hook-form';
import ConditionForm, { ConditionFormValues } from './components/ConditionForm';

const AddConditionScreen = () => {
  const { mutate: addConditionRecord } = useAddHealthRecord('condition');

  const handleAddCondition: SubmitHandler<ConditionFormValues> = data => {
    const { start, end, ...rest } = data;

    addConditionRecord(
      {
        ...rest,
        start: dayjs(start, 'MM/DD/YYYY').format('YYYY-MM-DD'),
        end: dayjs(end, 'MM/DD/YYYY').format('YYYY-MM-DD'),
      },
      {
        onSuccess: data => {
          console.log(data);
        },
      },
    );
  };

  return (
    <Box flex={1}>
      <ConditionForm initialValues={{}} onSubmit={handleAddCondition} />
    </Box>
  );
};

export default AddConditionScreen;
