import { useMemo } from 'react';
import { useHRRecord, useUpdateHRRecord } from 'hooks/useHealthRecord';
import { RootStackScreenProps } from 'navigation/types';
import SurgeryForm, { SurgeryFormValues } from './components/SurgeryForm';
import dayjs from 'dayjs';
import { Box } from 'native-base';

const EditSurgeryScreen: React.FC<RootStackScreenProps<'EditSurgery'>> = ({
  route: {
    params: { id },
  },
}) => {
  const { data, isFetched } = useHRRecord<'surgery'>(id);
  const { mutate: updateSurgery } = useUpdateHRRecord<'surgery'>();

  const initialValues: SurgeryFormValues | undefined = useMemo(() => {
    if (isFetched && data) {
      const {
        surgery,
        implant,
        date,
        complication,
        hospital,
        histology_report,
        body_sites,
      } = data.record;

      return {
        surgery,
        implant,
        date: dayjs(date).format('MM/DD/YYYY'),
        complication,
        hospital,
        body_sites: body_sites.map(({ code }) => code),
        histology_report,
        test_file: data.attachments,
        biopsy: !!histology_report
          ? 'significant-findings-present'
          : 'no-significant-findings',
        note: data.note,
      };
    }
  }, [data, isFetched]);

  if (!initialValues) {
    return <Box></Box>;
  }

  return (
    <SurgeryForm
      initialValues={initialValues}
      onSubmit={data => {
        const { date, ...rest } = data;

        updateSurgery({
          id,
          data: {
            date: dayjs(date, 'MM/DD/YYYY').format('MM/DD/YYYY'),
            ...rest,
          },
        });
      }}
    />
  );
};

export default EditSurgeryScreen;
