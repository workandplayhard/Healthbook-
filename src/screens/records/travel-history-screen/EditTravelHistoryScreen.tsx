import React, { useMemo } from 'react';
import TravelHistoryForm, { TravelHistoryFormValues } from './components/TravelHistoryForm';
import { useHRRecord, useUpdateHRRecord } from 'hooks/useHealthRecord';
import dayjs from 'dayjs';
import { Box } from 'native-base';
import { RootStackScreenProps } from 'navigation/types';

const EditTravelHistoryScreen: React.FC<RootStackScreenProps<'EditTravelhistory'>> = ({
  route: {
    params: { id },
  },
}) => {
  const { data, isFetched } = useHRRecord<'travelhistory'>(id);
  const { mutate: updateTravelHistoryRecord } = useUpdateHRRecord<'travelhistory'>();

  const initialValues: TravelHistoryFormValues | undefined = useMemo(() => {
    if (isFetched && data) {
      return {
        start: dayjs(data?.record?.start, 'YYYY-MM-DD').format('MM/DD/YYYY'),
        start_date_part: data?.record?.start_date_part,
        end: dayjs(data?.record?.end, 'YYYY-MM-DD').format('MM/DD/YYYY'),
        end_date_part: data?.record?.end_date_part,
        country: data?.record?.country,
        note: data?.note,
        private: data?.record.private,
        test_file: data?.attachments,
      };
    }
  }, [isFetched, data]);

  if (!initialValues) {
    return <Box></Box>;
  }

  return (
    <Box p="4" flex={1} _light={{ bgColor: 'white' }} _dark={{ bgColor: 'coolGray.800' }}>
      <TravelHistoryForm
        initialValues={initialValues}
        onSubmit={data => {
          const { start, end, ...rest } = data;
          updateTravelHistoryRecord({
            id,
            data: {
              ...rest,
              start: dayjs(start, 'MM/DD/YYYY').format('YYYY-MM-DD'),
              end: dayjs(end, 'MM/DD/YYYY').format('YYYY-MM-DD'),
            },
          });
        }}
      />
    </Box>
  );
};

export default EditTravelHistoryScreen;
