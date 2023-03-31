import React from 'react';

import SymptomsForm from '../components/SymptomsForm';
import { useAddHealthRecord } from 'hooks/useHealthRecord';
import dayjs from 'dayjs';
import { Box } from 'native-base';

const AddSymptomScreen = () => {
  const { mutate: addSymptom } = useAddHealthRecord('symptom');

  return (
    <Box
      p="4"
      _light={{ bgColor: 'white' }}
      _dark={{ bgColor: 'coolGray.800' }}
    >
      <SymptomsForm
        initialValues={{}}
        onSubmit={data => {
          const { start, end, ...rest } = data;
          addSymptom({
            ...rest,
            start: dayjs(start, 'MM/DD/YYYY').format('YYYY-MM-DD'),
            end: dayjs(end, 'MM/DD/YYYY').format('YYYY-MM-DD'),
          });
        }}
      />
    </Box>
  );
};

export default AddSymptomScreen;
