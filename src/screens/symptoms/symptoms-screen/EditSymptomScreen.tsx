import React, { useMemo } from 'react';

import SymptomsForm, { SymptomFormValues } from '../components/SymptomsForm';
import { useHRRecord, useUpdateHRRecord } from 'hooks/useHealthRecord';
import dayjs from 'dayjs';
import { Box } from 'native-base';
import { RootStackScreenProps } from 'navigation/types';

const EditSymptomScreen: React.FC<RootStackScreenProps<'EditSymptom'>> = ({
  route: {
    params: { id },
  },
}) => {
  const { data, isFetched } = useHRRecord<'symptom'>(id);
  const { mutate: updateSymptom } = useUpdateHRRecord<'symptom'>();

  const initialValues: SymptomFormValues | undefined = useMemo(() => {
    if (isFetched && data) {
      return {
        symptom: data.record.symptom,
        start: dayjs(data.record.start).format('MM/DD/YYYY'),
        end: dayjs(data.record.end).format('MM/DD/YYYY'),
        frequency: String(data.record.frequency.key || 0),
        intensity: String(data.record.intensity || 0),
        interval: data.record.interval.key,
        note: data.note,
        test_file: data.attachments,
      };
    }
  }, [isFetched, data]);

  if (!initialValues) {
    return <Box></Box>;
  }

  return (
    <Box
      p="4"
      _light={{ bgColor: 'white' }}
      _dark={{ bgColor: 'coolGray.800' }}
    >
      <SymptomsForm
        initialValues={initialValues}
        onSubmit={data => {
          const { start, end, ...rest } = data;
          updateSymptom({
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

export default EditSymptomScreen;
