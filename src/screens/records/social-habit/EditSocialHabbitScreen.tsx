import React, { useMemo } from 'react';

import SocialHabbitForm, { SocialHabbit } from './components/SocialHabbitForm';
import { useHRRecord, useUpdateHRRecord } from 'hooks/useHealthRecord';
import dayjs from 'dayjs';
import { Box } from 'native-base';
import { RootStackScreenProps } from 'navigation/types';
import { SocialHabbitFormValues } from 'services/healthrecords';

const EditSocialHabbitScreen: React.FC<
  RootStackScreenProps<'EditSocialhistory'>
> = ({
  route: {
    params: { id },
  },
}) => {
  const { data, isFetched } = useHRRecord<'socialhistory'>(id);
  const { mutate: updateSocialHabbit } = useUpdateHRRecord<'socialhistory'>();

  const initialValues: SocialHabbitFormValues | undefined = useMemo(() => {
    if (isFetched && data) {
      return {
        category: data?.record?.category,
        start_age: dayjs(data?.record?.start_age).format('MM/DD/YYYY'),
        end_age: dayjs(data?.record?.end_age).format('MM/DD/YYYY'),
        specialist_intervention: data?.record?.specialist_intervention,
        frequency: data?.record?.frequency,
        interval: data?.record?.interval,
        note: data?.note,
        private: data?.record?.private,
      };
    }
  }, [isFetched, data]);

  if (!initialValues) {
    return <Box></Box>;
  }
  return (
    <Box flex={1}>
      <SocialHabbitForm
        initialValues={initialValues}
        onSubmit={data => {
          updateSocialHabbit({
            id,
            data: {
              category: data?.category,
              start_age: data?.start_age,
              end_age: data?.end_age,
              specialist_intervention: data?.specialist_intervention,
              frequency: data?.frequency,
              interval: data?.interval,
              note: data?.note,
              private: false,
            },
          });
        }}
      />
    </Box>
  );
};

export default EditSocialHabbitScreen;
