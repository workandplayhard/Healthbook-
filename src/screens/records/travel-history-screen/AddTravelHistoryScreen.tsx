import React from 'react';
import TravelHistoryForm from './components/TravelHistoryForm';
import { useAddHealthRecord } from 'hooks/useHealthRecord';
import { Box } from 'native-base';
import dayjs from 'dayjs';

const AddTravelHistoryScreen = () => {
  const { mutate: addTravelHistory } = useAddHealthRecord('travelhistory');
  return (
    <Box p="4" flex={1} _light={{ bgColor: 'white' }} _dark={{ bgColor: 'coolGray.800' }}>
      <TravelHistoryForm
        initialValues={{}}
        onSubmit={data => {
          const { start, end, country, note } = data;
          addTravelHistory({
            start: dayjs(start, 'MM/DD/YYYY').format('YYYY-MM-DD'),
            start_date_part: 'day',
            end: dayjs(end, 'MM/DD/YYYY').format('YYYY-MM-DD'),
            end_date_part: 'day',
            country: country,
            note: note,
            private: false,
          });
        }}
      />
    </Box>
  );
};

export default AddTravelHistoryScreen;
