import dayjs from 'dayjs';
import { useAddHealthRecord } from 'hooks/useHealthRecord';
import { Box } from 'native-base';
import ProcedureForm from './components/ProcedureForm';

const AddProcedureScreen = () => {
  const { mutate: addProcedure } = useAddHealthRecord('procedure');

  return (
    <Box flex={1}>
      <ProcedureForm
        initialValues={{}}
        onSubmit={data => {
          const { date, ...rest } = data;

          addProcedure({
            date: dayjs(date, 'MM/DD/YYYY').format('MM/DD/YYYY'),
            ...rest,
          });
        }}
      />
    </Box>
  );
};

export default AddProcedureScreen;
