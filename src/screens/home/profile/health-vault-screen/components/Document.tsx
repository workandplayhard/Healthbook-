import React, { useState } from 'react';
import Accordion from 'react-native-collapsible-accordion';
import { Checkbox, HStack, IconButton, Text, VStack } from 'native-base';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';

import theme from 'theme';
import EditIcon from '@assets/icons/edit.svg';
import ViewIcon from '@assets/icons/view.svg';
import DeleteIcon from '@assets/icons/delete.svg';

import type { Document } from 'services/types';

type DocumentItemProps = {
  data: Document;
  isChecked: boolean;
  onChecked: (state: boolean) => void;
  onDelete: () => void;
  onUpdate: () => void;
};

const DocumentItem: React.FC<DocumentItemProps> = ({ data, isChecked, onChecked, onDelete, onUpdate }) => {
  const navigation = useNavigation();
  const [isOpenAccordion, setIsOpenAccordion] = useState(false);

  const renderContent = (data: Document) => {
    return (
      <VStack
        my={3}
        px="55px"
        space={4}
        borderBottomColor="dustyGray.300"
        borderBottomWidth={isOpenAccordion ? 0 : '1px'}
      >
        <HStack space={8}>
          <VStack>
            <Text color="dustyGray.500" fontStyle="normal" fontWeight={500} fontSize="12px">
              UPLOADED
            </Text>
            <Text _light={{ color: 'black' }} _dark={{ color: 'white' }} fontSize="14px" fontWeight={500}>
              {dayjs(data.document_uploaded_at).format('MM/DD/YYYY')}
            </Text>
          </VStack>
          <VStack>
            <Text color="dustyGray.500" fontStyle="normal" fontWeight={500} fontSize="12px">
              TAGS
            </Text>
            <Text _light={{ color: 'black' }} _dark={{ color: 'white' }} fontSize="14px" fontWeight={500}>
              {data.tags.map(tag => tag.tag_name).join(', ')}
            </Text>
          </VStack>
        </HStack>
        <HStack space={16}>
          <VStack alignItems="center" space={1}>
            <IconButton
              variant="outline"
              borderRadius="full"
              p={3}
              _icon={{
                fill: theme.colors.primary[600],
                width: '14px',
                height: '14px',
              }}
              _dark={{
                _icon: {
                  fill: theme.colors.tertiary[600],
                },
                borderColor: 'tertiary.600',
              }}
              icon={<DeleteIcon />}
              onPress={onDelete}
            />
            <Text color="primary.600" fontSize="12px" fontWeight={500} _dark={{ color: 'tertiary.600' }}>
              Delete
            </Text>
          </VStack>
          <VStack alignItems="center" space={1}>
            <IconButton
              variant="outline"
              borderRadius="full"
              p={3}
              _icon={{
                fill: theme.colors.primary[600],
                width: '14px',
                height: '14px',
              }}
              _dark={{
                _icon: {
                  fill: theme.colors.tertiary[600],
                },
                borderColor: 'tertiary.600',
              }}
              icon={<EditIcon />}
              onPress={onUpdate}
            />
            <Text color="primary.600" fontSize="12px" fontWeight={500} _dark={{ color: 'tertiary.600' }}>
              Edit
            </Text>
          </VStack>
          <VStack alignItems="center" space={1}>
            <IconButton
              variant="outline"
              borderRadius="full"
              p={3}
              _icon={{
                fill: theme.colors.primary[600],
                width: '14px',
                height: '14px',
              }}
              _dark={{
                _icon: {
                  fill: theme.colors.tertiary[600],
                },
                borderColor: 'tertiary.600',
              }}
              icon={<ViewIcon />}
              onPress={() => navigation.navigate('Viewer', { data })}
            />
            <Text color="primary.600" fontSize="12px" fontWeight={500} _dark={{ color: 'tertiary.600' }}>
              View
            </Text>
          </VStack>
        </HStack>
      </VStack>
    );
  };

  return (
    <Accordion
      onChangeVisibility={() => setIsOpenAccordion(state => !state)}
      renderHeader={() => (
        <HStack
          alignItems="center"
          px={5}
          py={4}
          borderBottomColor="dustyGray.300"
          borderBottomWidth={isOpenAccordion ? '1px' : 0}
        >
          <Checkbox
            value="document select"
            accessibilityLabel="document select"
            isChecked={isChecked}
            _light={{ bgColor: 'white' }}
            _dark={{ bgColor: 'coolGray.800' }}
            _checked={{
              _light: { bgColor: 'primary.600' },
              _dark: { bgColor: 'tertiary.600' },
              _icon: { color: 'white' },
            }}
            onChange={onChecked}
          ></Checkbox>
          <Text ml={3} color="black" fontStyle="normal" fontWeight={700} fontSize="14px" _dark={{ color: 'white' }}>
            {data.document_name}
          </Text>
        </HStack>
      )}
      renderContent={() => renderContent(data)}
    />
  );
};

export default DocumentItem;
