import dayjs from 'dayjs';
import { useAddHealthRecord } from 'hooks/useHealthRecord';
import ImmunizationForm from './components/ImmunizationForm';

const AddImmunizationScreen = () => {
  const { mutate: addImmunization } = useAddHealthRecord('immunization');

  return (
    <ImmunizationForm
      initialValues={{}}
      onSubmit={data => {
        const { date, ...rest } = data;

        addImmunization({
          date: dayjs(date, 'MM/DD/YYYY').format('YYYY-MM-DD'),
          ...rest,
        });
      }}
    />
  );
};

export default AddImmunizationScreen;
