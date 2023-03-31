import dayjs from 'dayjs';
import { useAddDependent } from 'hooks/useDependent';
import { useGetOptions } from 'hooks/useOptions';
import { useCurrentUser } from 'hooks/useUsers';
import { useCallback } from 'react';

import PersonStepperForm, {
  type PersonFormValues,
} from './components/PersonForm';

const AddPersonScreen = () => {
  const { data: options } = useGetOptions();
  const { data: currentUser } = useCurrentUser();
  const { mutate: addDependent } = useAddDependent();

  const handleAddUser = useCallback(
    (values: PersonFormValues) => {
      //TODO: API integration for add user to caring circle
      addDependent({
        dependent: {
          relationship: options?.relationship.find(
            ({ key }) => key === values.relationship,
          ),
          sex: options?.sex.find(({ key }) => key === values.sex),
          gender: options?.gender.find(({ key }) => key === values.gender),
          race: options?.race.find(({ key }) => key === values.race),
          email: values.email,
          first_name: values.first_name,
          last_name: values.last_name,
          date_of_birth: dayjs(values.dob, 'MM/DD/YYYY').format('YYYY-MM-DD'),
          occupation: values.occupation,
          phone_number: values.phone_number
            ? '+1' + values.phone_number.replace(/\D/g, '')
            : null,
          weight: currentUser?.imperial_units
            ? (parseFloat(values.weight) / 2.20462).toFixed(1)
            : values.weight,
          height: currentUser?.imperial_units
            ? (
                parseFloat(values.height[0]) * 0.3048 +
                parseFloat(values.height[1]) * 0.0254
              ).toFixed(2)
            : values.height[0],
          notes: '',
        },
        emergency_contact: {
          first_name: null,
          last_name: null,
          address: null,
          city: null,
          state: null,
          zipcode: null,
          phone_number: null,
        },
        physician: {
          first_name: null,
          last_name: null,
          speciality: null,
          hospital: null,
          phone_number: null,
        },
      });
    },
    [options, currentUser],
  );

  return <PersonStepperForm onSubmit={handleAddUser} initialValues={{}} />;
};

export default AddPersonScreen;
