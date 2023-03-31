import dayjs from 'dayjs';
import { useUpdateDependent } from 'hooks/useDependent';
import { useGetOptions } from 'hooks/useOptions';
import { useCurrentUser } from 'hooks/useUsers';
import type { CaringCircleStackScreenProps } from 'navigation/types';
import { useCallback, useMemo } from 'react';
import type { DeepPartial } from 'react-hook-form';

import PersonStepperForm, { type PersonFormValues } from './components/PersonForm';

const EditPersonScreen: React.FC<CaringCircleStackScreenProps<'EditPerson'>> = ({
  route: {
    params: { person },
  },
}) => {
  const { data: options } = useGetOptions();
  const { data: currentUser } = useCurrentUser();
  const { mutate: updateDependent } = useUpdateDependent();

  const initialValues = useMemo<DeepPartial<PersonFormValues>>(() => {
    const { weight, height } = person.dependent_data;
    return {
      ...person.dependent_data,
      relationship: person.dependent_data.relationship?.key,
      race: person.dependent_data.race?.key,
      gender: person.dependent_data.gender?.key,
      dob: dayjs(person.dependent_data.dob).format('MM/DD/YYYY'),
      sex: person.dependent_data.sex?.key,
      weight: currentUser?.imperial_units ? weight && (weight * 2.20462).toFixed(2) : weight?.toFixed(2),
      height: currentUser?.imperial_units
        ? height && [Math.floor(height / 0.3048).toString(), Math.round((height % 0.3048) / 0.0254).toString()]
        : [height?.toFixed(2) || '', ''],
      phone_number: person.dependent_data.phone_number && person.dependent_data.phone_number.slice(2),
    };
  }, [person]);

  const handleUpdatePerson = useCallback(
    (values: PersonFormValues) => {
      //TODO: API integration for add user to caring circle
      updateDependent({
        dependent: {
          dependent_id: person.dependent_data.dependent_id,
          relationship: options?.relationship.find(({ key }) => key === values.relationship),
          sex: options?.sex.find(({ key }) => key === values.sex),
          gender: options?.gender.find(({ key }) => key === values.gender),
          race: options?.race.find(({ key }) => key === values.race),
          email: values.email,
          first_name: values.first_name,
          last_name: values.last_name,
          date_of_birth: dayjs(values.dob, 'MM/DD/YYYY').format('YYYY-MM-DD'),
          occupation: values.occupation,
          phone_number: values.phone_number ? '+1' + values.phone_number.replace(/\D/g, '') : null,
          weight: currentUser?.imperial_units ? parseFloat(values.weight) / 2.20462 : values.weight,
          height: currentUser?.imperial_units
            ? parseFloat(values.height[0]) * 0.3048 + parseFloat(values.height[1]) * 0.0254
            : values.height[0],
          notes: '',
        },
        emergency_contact: {
          dependent_id: person.dependent_data.dependent_id,
          emergency_contact_id: null,
          first_name: null,
          last_name: null,
          address: null,
          city: null,
          state: null,
          zipcode: null,
          phone_number: null,
        },
        physician: {
          dependent_id: person.dependent_data.dependent_id,
          dependent_physician_id: null,
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

  return <PersonStepperForm onSubmit={handleUpdatePerson} initialValues={initialValues} />;
};

export default EditPersonScreen;
