import { useMemo } from 'react';
import { Box } from 'native-base';
import dayjs from 'dayjs';

import { useHRRecord, useUpdateHRRecord } from 'hooks/useHealthRecord';
import FamilyHistoryForm, { FamilyHistoryFormValues } from './components/FamilyHistoryForm';

import type { RootStackScreenProps } from 'navigation/types';

const EditFamilyHistoryScreen: React.FC<RootStackScreenProps<'EditFamilyhistory'>> = ({
  route: {
    params: { id },
  },
}) => {
  const { data, isFetched } = useHRRecord<'familyhistory'>(id);
  const { mutate: updateFamilyHistory } = useUpdateHRRecord<'familyhistory'>();

  const initialValues: FamilyHistoryFormValues | undefined = useMemo(() => {
    if (isFetched && data) {
      return {
        deceased: data?.record.deceased,
        end: dayjs(data?.record.end, 'YYYY-MM-DD').format('MM/DD/YYYY'),
        start: dayjs(data?.record.start, 'YYYY-MM-DD').format('MM/DD/YYYY'),
        family_member_name: data?.record.family_member_name,
        medical_problem: data?.record.medical_problem,
        outcome: data.record.outcome.key,
        note: data.note || undefined,
        relationship_type: data.record.relationship_type.key,
        test_file: data.attachments,
      };
    }
  }, [isFetched, data]);

  if (!initialValues) {
    return <Box></Box>;
  }

  return (
    <FamilyHistoryForm
      initialValues={initialValues}
      onSubmit={data => {
        const { start, end, ...rest } = data;

        updateFamilyHistory({
          id,
          data: {
            ...rest,
            start: dayjs(start, 'MM/DD/YYYY').format('YYYY-MM-DD'),
            end: dayjs(end, 'MM/DD/YYYY').format('YYYY-MM-DD'),
          },
        });
      }}
    />
  );
};

export default EditFamilyHistoryScreen;
