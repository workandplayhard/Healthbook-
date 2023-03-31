import React, { useState } from 'react';
import {
  Box,
  FormControl,
  HStack,
  Icon,
  Modal,
  Button,
  SearchIcon,
  Text,
  VStack,
  Radio,
  Stack,
} from 'native-base';
import { Controller, useFormContext } from 'react-hook-form';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import FormInput from '@components/FormInput';
import FormSelect from '@components/FormSelect';

const sorts = [
  { label: 'Name A-Z', value: 'first_name:asc' },
  { label: 'Name Z-A', value: 'first_name:desc' },
  { label: 'Nearest time available', value: 'nearest-time' }, // TODO: Need to find correct value here
];

type SearchFormProps = {
  onApply: () => void;
  date?: string;
};

export type SearchFormValues = {
  name: string;
  sort: string;
  filter: string;
};

export const SearchForm: React.FC<SearchFormProps> = ({ date, onApply }) => {
  const { control, reset } = useFormContext<SearchFormValues>();

  const [isOpen, setIsOpen] = useState(false);

  const handleApply = () => {
    onApply();
    setIsOpen(false);
  };

  return (
    <VStack px="4" py="4" borderColor="gray.300">
      <HStack mb="4" justifyContent="space-between">
        <HStack alignItems="center" space="2">
          <Icon
            size="6"
            as={MaterialIcons}
            name="calendar-today"
            _light={{ color: 'primary.600' }}
            _dark={{ color: 'tertiary.600' }}
          />
          <Text
            _light={{ color: 'primary.600' }}
            _dark={{ color: 'tertiary.600' }}
          >
            {date}
          </Text>
        </HStack>
        <Icon
          size="6"
          onPress={() => setIsOpen(true)}
          as={MaterialIcons}
          name="settings-input-component"
          _light={{ color: 'primary.600' }}
          _dark={{ color: 'tertiary.600' }}
        />
      </HStack>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <FormControl>
            <FormInput
              isRequired
              autoCapitalize="none"
              label="Search"
              leftElement={
                <Box pl="3">
                  <SearchIcon />
                </Box>
              }
              mb="0"
              autoComplete="email"
              onChangeText={onChange}
              defaultValue={value}
              value={value}
            />
          </FormControl>
        )}
      />
      <Modal
        isOpen={isOpen}
        animationPreset="slide"
        safeAreaTop={true}
        onClose={() => setIsOpen(false)}
        justifyContent="flex-end"
      >
        <Modal.Content w="full" h={700} borderTopRadius="3xl">
          <VStack px="6" space="6" h="full">
            <HStack justifyContent="space-between" pt="4">
              <Button
                borderWidth="0"
                variant="outline"
                p="0"
                onPress={() => setIsOpen(false)}
              >
                Close
              </Button>
              <Button borderWidth="0" variant="outline" onPress={() => reset()}>
                Clear all
              </Button>
            </HStack>
            <Controller
              control={control}
              name="sort"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => (
                <FormControl>
                  <FormSelect
                    label="Sort by"
                    placeholder="Selection"
                    onValueChange={onChange}
                    selectedValue={value}
                    options={sorts}
                    mb="-6"
                  />
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="filter"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => (
                <FormControl>
                  <Radio.Group
                    value={value}
                    onChange={onChange}
                    name="filterGroup"
                  >
                    <Stack space="4">
                      <Radio value="">Show all providers</Radio>
                      <Radio value="M">Male providers only</Radio>
                      <Radio value="F">Female providers only</Radio>
                    </Stack>
                  </Radio.Group>
                </FormControl>
              )}
            />
            <Button mt="auto" mb="12" onPress={handleApply}>
              Apply
            </Button>
          </VStack>
        </Modal.Content>
      </Modal>
    </VStack>
  );
};
