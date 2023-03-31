import React, { useLayoutEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import {
  Avatar,
  Box,
  Button,
  Heading,
  HStack,
  Spinner,
  Text,
  useColorMode,
  View,
  VStack,
} from 'native-base';
import { useForm, FormProvider } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import dayjs from 'dayjs';

import { HealthStackScreenProps } from '@navigation/types';
import theme from '@theme';
import { useGetProvidersList } from '@hooks/useProvider';

import type { SearchFormValues } from './components/SearchForm';
import { SearchForm } from './components/SearchForm';
import { GetProviderDetailInput } from 'services/provider';

const getMinTimeDiff = (date: string, slots: Array<{ start_time: string }>) => {
  if (slots.length === 0) return Number.MAX_VALUE;

  return slots.reduce((curDiff: number, slot) => {
    let diff: number = dayjs(
      `${date} ${slot.start_time}`,
      'YYYY-MM-DD h:MM A',
    ).diff(dayjs(), 'minutes');

    if (diff < 0) return curDiff;

    return diff < curDiff ? diff : curDiff;
  }, Number.MAX_VALUE);
};

export const ProviderListScreen: React.FC<
  HealthStackScreenProps<'ProviderListScreen'>
> = ({
  navigation,
  route: {
    params: { label = '', date, type },
  },
}) => {
  const { colorMode } = useColorMode();
  const insets = useSafeAreaInsets();

  const [sort, setSort] = useState('first_name:asc');
  const [filter, setFilter] = useState('');

  const { ...formProps } = useForm<SearchFormValues>({
    defaultValues: { name: '', sort, filter },
  });

  const name = formProps.watch('name');
  const [deferredSearch] = useDebounce(name, 500);

  const { data: providersList = [], isLoading } = useGetProvidersList({
    search_text: deferredSearch,
    provider_type: type,
    date: date,
    sort: {
      field: sort.split(':')[0],
      order: sort.split(':')[1],
    },
    filter: {
      gender: filter,
      language: '',
    },
  });

  const handleApplySortFilters = (input: SearchFormValues) => {
    setSort(input.sort);
    setFilter(input.filter);
  };

  const providers = useMemo(() => {
    return (providersList || []).sort((a, b) => {
      if (sort === 'nearest-time') {
        const nearestA = getMinTimeDiff(date, a?.available_slots?.slot);
        const nearestB = getMinTimeDiff(date, b?.available_slots?.slot);

        return nearestA > nearestB ? 1 : nearestA === nearestB ? 0 : -1;
      }
      return 0;
    });
  }, [providersList, sort]);
  const { bgLight } = useMemo(() => {
    if (colorMode === 'dark') {
      return {
        bgDark: theme.colors.coolGray[900],
        bgLight: theme.colors.coolGray[800],
      };
    }

    return {
      bgDark: theme.colors.primary[600],
      bgLight: theme.colors.white,
    };
  }, [colorMode]);

  useLayoutEffect(() => {
    label && navigation.setOptions({ title: label });
  }, [label, navigation]);

  const handleNavigate = (provider: GetProviderDetailInput) => {
    navigation.navigate('ProviderDetailScreen', {
      provider: {
        provider_id: provider?.provider_id,
        provider_type: provider?.provider_type,
        date: provider?.date,
      },
      update: false,
      currentAppointmentDetails: undefined,
    });
  };
  // This loading spinner was added because the current API call is quite long
  if (isLoading) {
    return (
      <View marginTop="15">
        <HStack space={4} justifyContent="center">
          <Spinner size="sm" accessibilityLabel="Loading posts" />
          <Heading color="primary.500" fontSize="sm">
            Loading Providers
          </Heading>
        </HStack>
      </View>
    );
  }
  return (
    <Box bgColor={bgLight}>
      <KeyboardAwareScrollView
        bounces={false}
        extraScrollHeight={-insets.bottom}
        // eslint-disable-next-line react-native/no-inline-styles
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <FormProvider {...formProps}>
          <SearchForm
            date={date}
            onApply={formProps.handleSubmit(handleApplySortFilters)}
          />
        </FormProvider>
        <VStack pb="6">
          {providers?.map((provider, index) => {
            return (
              <Button
                key={`provider-${index}`}
                bgColor={bgLight}
                p="0"
                flex={1}
                onPress={() =>
                  handleNavigate({
                    provider_id: provider.provider_id,
                    provider_type: type,
                    date,
                  })
                }
              >
                <VStack
                  borderBottomWidth="1"
                  pt="3"
                  minWidth="full"
                  flex={1}
                  px="4"
                  space="1"
                  borderColor="gray.300"
                >
                  <HStack space="4">
                    <Avatar
                      bg="gray.600"
                      width={20}
                      height={20}
                      source={{ uri: provider?.profile_picture_url as string }}
                    />
                    <VStack>
                      <Text
                        _light={{ color: 'gray.700' }}
                        _dark={{ color: 'white' }}
                        fontWeight={700}
                        fontSize="16px"
                      >
                        {`${provider.first_name} ${provider.last_name}`}
                      </Text>
                      <Text>{provider.speciality}</Text>
                      <Text>{`${provider.city}, ${provider.state}`}</Text>
                    </VStack>
                  </HStack>
                  <HStack flexWrap="wrap">
                    {provider?.available_slots?.slot &&
                    provider?.available_slots?.slot?.length ? (
                      provider?.available_slots?.slot
                        .map(slot => {
                          if (!slot?.isBooked) {
                            return (
                              <Box
                                key={slot.availability_det_id}
                                width="20%"
                                px="0.5"
                              >
                                <Box
                                  _light={{ bgColor: 'primary.600' }}
                                  _dark={{ bgColor: 'tertiary.600' }}
                                  mb="2"
                                  py="1"
                                  borderRadius="2"
                                >
                                  <Text
                                    textAlign="center"
                                    fontSize="xs"
                                    color="white"
                                  >
                                    {slot.start_time}
                                  </Text>
                                </Box>
                              </Box>
                            );
                          }
                        })
                        .slice(0, 5)
                    ) : (
                      <Text pb="2" textAlign="center" fontSize="xs" w="full">
                        No availability for this date
                      </Text>
                    )}
                  </HStack>
                </VStack>
              </Button>
            );
          })}
        </VStack>
      </KeyboardAwareScrollView>
    </Box>
  );
};

export default ProviderListScreen;
