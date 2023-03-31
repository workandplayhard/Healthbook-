import { useQuery } from '@tanstack/react-query';

import { getOptions } from '@services/options';

export const useGetOptions = () => {
  return useQuery({
    queryKey: ['options'],
    queryFn: getOptions,
  });
};
