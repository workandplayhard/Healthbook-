import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getValidicUserMarketplace, getVitals, getVitalSettings, updateVitalSettings } from '@services/vitals';

import { useCurrentUser } from './useUsers';

export const useGetValidicUserMarketplace = () => {
  const queryClient = useQueryClient();

  const { data: user } = useCurrentUser();
  const userId = user?.user_id;

  return useQuery({
    queryKey: ['validic-user-marketplace', userId],
    queryFn: () => getValidicUserMarketplace(),
    onSuccess: () => queryClient.invalidateQueries(['me']),
    enabled: Boolean(userId),
  });
};

export const useGetVitals = () => {
  // Get the user's validic UID and device type
  const { data: user } = useCurrentUser();
  const validicUser = user?.validic_user;
  const validicUID = validicUser ? validicUser.uid : undefined;
  const validicDeviceType =
    validicUser && validicUser.sources && validicUser.sources.length > 0 ? validicUser.sources[0].type : undefined;

  return useQuery({
    queryKey: ['vitals', validicUID, validicDeviceType],
    queryFn: () => getVitals(validicUID!, validicDeviceType!),
    enabled: Boolean(validicUID && validicDeviceType),
  });
};

export const useGetVitalSettings = () => {
  const { data: user } = useCurrentUser();
  const userId = user?.user_id;

  return useQuery({
    queryKey: ['vital-settings', userId],
    queryFn: () => getVitalSettings(userId!),
    select: data => data[0].vitals_status,
    enabled: Boolean(userId),
  });
};

export const useUpdateVitalsSettings = () => {
  const { data } = useCurrentUser();
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  return useMutation(
    (
      values: {
        vital_id: number;
        vital_name: string;
        status: 'Enabled' | 'Disabled';
      }[],
    ) => updateVitalSettings(data!.user_id, values),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['vital-settings']);

        navigation.goBack();
      },
    },
  );
};
