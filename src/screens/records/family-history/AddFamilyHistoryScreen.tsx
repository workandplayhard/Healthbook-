import dayjs from 'dayjs';

import { useAddHealthRecord } from 'hooks/useHealthRecord';
import FamilyHistoryForm from './components/FamilyHistoryForm';

const AddFamilyHistoryScreen = () => {
  const { mutate: addFamilyHistory } = useAddHealthRecord('familyhistory');

  return (
    <FamilyHistoryForm
      initialValues={{}}
      onSubmit={data => {
        const { start, end, ...rest } = data;

        addFamilyHistory({
          ...rest,
          start: dayjs(start, 'MM/DD/YYYY').format('YYYY-MM-DD'),
          end: dayjs(end, 'MM/DD/YYYY').format('YYYY-MM-DD'),
        });
      }}
    />
  );
};

export default AddFamilyHistoryScreen;
