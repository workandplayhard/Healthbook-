import React from 'react';
import { Box } from 'native-base';
import SocialHabbitForm from './components/SocialHabbitForm';
import dayjs from 'dayjs';
import { useAddHealthRecord } from 'hooks/useHealthRecord';

const AddSocialHabbitScreen = () => {
  const { mutate: addSocialHabbit } = useAddHealthRecord('socialhistory');
  return (
    <Box
      flex={1}
      _light={{ bgColor: 'white' }}
      _dark={{ bgColor: 'coolGray.800' }}
    >
      <SocialHabbitForm
        initialValues={{}}
        onSubmit={data => {
          addSocialHabbit({
            category: data?.category,
            start_age: data?.start_age,
            end_age: data?.end_age,
            specialist_intervention: false,
            frequency: data?.frequency,
            interval: data?.interval,
            note: data?.note,
            private: data?.private,
          });
        }}
      />
    </Box>
  );
};

export default AddSocialHabbitScreen;
