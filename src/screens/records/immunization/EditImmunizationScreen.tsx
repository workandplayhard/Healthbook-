import dayjs from 'dayjs';
import { useHRRecord, useUpdateHRRecord } from 'hooks/useHealthRecord';
import { RootStackScreenProps } from 'navigation/types';
import { useMemo } from 'react';
import ImmunizationForm, {
  ImmunizationFormValues,
} from './components/ImmunizationForm';

const EditImmunizationScreen: React.FC<
  RootStackScreenProps<'EditImmunization'>
> = ({
  route: {
    params: { id },
  },
}) => {
  const { data, isFetched } = useHRRecord<'immunization'>(id);

  const { mutate: updateImmunization } = useUpdateHRRecord<'immunization'>();

  const initialData: Partial<ImmunizationFormValues> | undefined =
    useMemo(() => {
      if (isFetched && data?.record_type === 'immunization') {
        return {
          immunization: data.record.immunization,
          date: dayjs(data.record.date, 'YYYY-MM-DD').format('MM/DD/YYYY'),
          reaction: data.record.reaction.key,
          dose_number: data.record.dose_number || undefined,
          series_doses: data.record.series_doses || undefined,
          note: data.note || undefined,
          multiple: !!data.record.dose_number,
        };
      }
    }, [isFetched, data]);

  if (!initialData) {
    return <></>;
  }

  return (
    <ImmunizationForm
      initialValues={initialData}
      onSubmit={data => {
        const { date, ...rest } = data;

        updateImmunization({
          id,
          data: {
            date: dayjs(date, 'MM/DD/YYYY').format('YYYY-MM-DD'),
            ...rest,
          },
        });
      }}
    />
  );
};

export default EditImmunizationScreen;
