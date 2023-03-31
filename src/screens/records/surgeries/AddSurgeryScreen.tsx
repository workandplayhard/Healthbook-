import dayjs from 'dayjs';
import { useAddHealthRecord } from 'hooks/useHealthRecord';
import SurgeryForm from './components/SurgeryForm';

const AddSurgeryScreen = () => {
  const { mutate: addSurgery } = useAddHealthRecord('surgery');

  return (
    <SurgeryForm
      initialValues={{}}
      onSubmit={data => {
        const { date, ...rest } = data;

        addSurgery({
          date: dayjs(date, 'MM/DD/YYYY').format('MM/DD/YYYY'),
          ...rest,
        });
      }}
    />
  );
};

export default AddSurgeryScreen;
