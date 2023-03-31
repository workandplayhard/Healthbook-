import dayjs from 'dayjs';
import { useHRRecord, useUpdateHRRecord } from 'hooks/useHealthRecord';
import { Box } from 'native-base';
import { RootStackScreenProps } from 'navigation/types';
import { useMemo } from 'react';
import ProcedureForm, { ProcedureFormValues } from './components/ProcedureForm';

const EditProcedureScreen: React.FC<RootStackScreenProps<'EditProcedure'>> = ({
  route: {
    params: { id },
  },
}) => {
  const { data, isFetched } = useHRRecord<'procedure'>(id);
  const { mutate: updateProcedure } = useUpdateHRRecord<'procedure'>();

  const initialValues: ProcedureFormValues | undefined = useMemo(() => {
    if (isFetched && data) {
      const {
        procedure,
        implant,
        date,
        complication,
        hospital,
        histology_report,
        body_sites,
      } = data.record;

      return {
        procedure,
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
    <Box flex={1}>
      <ProcedureForm
        initialValues={initialValues}
        onSubmit={data => {
          const { date, ...rest } = data;

          updateProcedure({
            id,
            data: {
              date: dayjs(date, 'MM/DD/YYYY').format('MM/DD/YYYY'),
              ...rest,
            },
          });
        }}
      />
    </Box>
  );
};

export default EditProcedureScreen;
