import { HStack, Modal, VStack, Button, Box, Text, Select } from 'native-base';
import React, { useState, useLayoutEffect } from 'react';
import type { SortFilterOptions } from './MyDocuments';
import { useHVTags } from 'hooks/useHealthVault';

type SortFilterModalProps = {
  isOpen: boolean;
  data: SortFilterOptions;
  onApply: (options: SortFilterOptions) => void;
  onClose: () => void;
};

const SortFilterModal: React.FC<SortFilterModalProps> = ({
  isOpen,
  data,
  onApply,
  onClose,
}) => {
  const [sortBy, setSortBy] = useState('');
  const [filterBy, setFilterBy] = useState('');
  const { data: tagsData } = useHVTags();

  useLayoutEffect(() => {
    setSortBy(data.sortBy);
    setFilterBy(data.filterBy);
  }, [isOpen]);

  const handleClear = () => {
    setSortBy('desc-date');
    setFilterBy('');
  };

  return (
    <Modal isOpen={isOpen} size="full" onClose={onClose}>
      <Modal.Content maxHeight="full">
        <Box
          h="full"
          _light={{ backgroundColor: 'primary.600' }}
          _dark={{ backgroundColor: '#111827' }}
        >
          <Box
            mt={12}
            backgroundColor="white"
            borderTopRadius={12}
            px={6}
            pt={6}
            pb={8}
            flex={1}
            _dark={{ backgroundColor: '#1f2937' }}
          >
            <HStack justifyContent="space-between" mb={9}>
              <Button
                p={0}
                variant="ghost"
                onPress={onClose}
                _text={{
                  fontSize: '14px',
                  fontWeight: 700,
                }}
                _dark={{
                  _text: { color: 'tertiary.600' },
                }}
              >
                Close
              </Button>
              <Button
                p={0}
                variant="ghost"
                onPress={handleClear}
                _text={{
                  fontSize: '14px',
                  fontWeight: 700,
                }}
                _dark={{
                  _text: { color: 'tertiary.600' },
                }}
              >
                Clear All
              </Button>
            </HStack>
            <VStack space={6} flex={1}>
              <Box>
                <Text mb={2} _dark={{ color: 'dustyGray.100' }}>
                  Sort by
                </Text>
                <Select
                  selectedValue={sortBy}
                  onValueChange={value => setSortBy(value)}
                >
                  <Select.Item
                    label="Most recently uploaded"
                    value="desc-date"
                  />
                  <Select.Item label="Name A-Z" value="asc-name" />
                  <Select.Item label="Name Z-A" value="desc-name" />
                </Select>
              </Box>
              <Box>
                <Text mb={2} _dark={{ color: 'dustyGray.100' }}>
                  Filter by
                </Text>
                <Select
                  selectedValue={filterBy}
                  onValueChange={value => setFilterBy(value)}
                >
                  <Select.Item label="Show All" value="" />
                  {tagsData?.Tags.map(tag => (
                    <Select.Item
                      label={tag.tag_name}
                      value={tag.tag_name}
                      key={tag.id}
                    />
                  ))}
                </Select>
              </Box>
            </VStack>
            <Button onPress={() => onApply({ sortBy, filterBy })}>Apply</Button>
          </Box>
        </Box>
      </Modal.Content>
    </Modal>
  );
};

export default SortFilterModal;
