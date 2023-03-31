import React, { useMemo, useState } from 'react';
import { Box, Button, Checkbox, Text, VStack } from 'native-base';

import { useHVTags, useSaveDocument } from '@hooks/useHealthVault';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackNavigatorParamList } from '@navigation/types';

type TagItemProps = {
  tagName: string;
  isChecked: boolean;
  onCheck: () => void;
};

const TagItem: React.FC<TagItemProps> = ({ tagName, isChecked, onCheck }) => {
  return (
    <Box flexDirection="row">
      <Checkbox
        value="tag select"
        accessibilityLabel="tag select"
        isChecked={isChecked}
        _light={{ bgColor: 'white' }}
        _dark={{ bgColor: 'coolGray.800', _text: { color: 'white' } }}
        _checked={{
          _light: { bgColor: 'primary.600' },
          _dark: { bgColor: 'tertiary.600' },
          _icon: { color: 'white' },
        }}
        onChange={onCheck}
        _text={{
          fontSize: '14px',
          fontWeight: 500,
        }}
      >
        {tagName}
      </Checkbox>
    </Box>
  );
};

const TagsModal: React.FC<NativeStackScreenProps<RootStackNavigatorParamList, 'UploadDocumentTagScreen'>> = ({
  route: {
    params: { file },
  },
  navigation,
}) => {
  const [tagIds, setTagIds] = useState<number[]>([]);
  const { data: tagsData } = useHVTags();
  const { mutate: saveDocument } = useSaveDocument();
  const [error, setError] = useState<{ file?: string; tags?: string }>({});

  const handleCheck = (id: number) => {
    setTagIds(state => (state.includes(id) ? state.filter(item => item !== id) : [...state, id]));
    setError({});
  };

  const handleSubmit = () => {
    if (tagIds.length === 0)
      return setError({
        tags: 'Please select at least one tag to proceed',
      });
    else setError({});

    saveDocument(
      {
        file,
        tags: tagIds.map(id => tagsData?.Tags.find(item => item.id === id)!),
      },
      {
        onSuccess: () => navigation.navigate('HealthVault'),
        onError: err => {
          setError({ file: err.message });
        },
      },
    );
  };

  return (
    <Box flex={1} _light={{ backgroundColor: 'primary.600' }} _dark={{ backgroundColor: '#111827' }}>
      <Box
        mt={7}
        backgroundColor="white"
        borderTopRadius={12}
        px={6}
        pt={7}
        pb={3}
        flex={1}
        _dark={{ backgroundColor: '#1f2937' }}
      >
        <Box flexDirection="row">
          <Button
            onPress={() => navigation.goBack()}
            variant="ghost"
            p={0}
            _text={{
              fontSize: '14px',
              fontWeight: 700,
            }}
            _dark={{
              _text: { color: 'tertiary.600' },
            }}
          >
            Cancel
          </Button>
        </Box>
        <Box px={2} mt={5} flex={1}>
          <Text fontSize="14px" fontWeight={500}>
            You've selected the file
          </Text>
          <Text fontSize="14px" fontWeight={700} my={2}>
            {file.name}
          </Text>
          {!!error.file && (
            <Text fontSize="14px" fontWeight={500} color="#DC2626">
              {error.file}
            </Text>
          )}
          <Text fontSize="14px" fontWeight={500} my={1}>
            Select the tags you’d like to apply to this document
          </Text>
          <VStack space={5} my={2}>
            {tagsData?.Tags.map(tag => (
              <TagItem
                key={tag.id}
                isChecked={tagIds.includes(tag.id)}
                onCheck={() => handleCheck(tag.id)}
                tagName={tag.tag_name}
              />
            ))}
            {!!error.tags && (
              <Text fontSize="14px" fontWeight={500} color="#DC2626">
                {error.tags}
              </Text>
            )}
          </VStack>
        </Box>
        <Button onPress={handleSubmit}>Add To Health Vault</Button>
      </Box>
    </Box>
  );
};

export default TagsModal;
