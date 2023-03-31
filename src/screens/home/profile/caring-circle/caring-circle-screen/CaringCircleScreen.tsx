import React, { useState } from 'react';
import { Box, Text, Icon, Button, FlatList, useDisclose, Pressable } from 'native-base';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useDependents } from '@hooks/useDependent';
import { useNavigation } from '@react-navigation/native';

import type { Dependent } from '@services/types';

import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import ProfileCard from './components/ProfileCard';
import NodataCard from './components/NoDataCard';

const CaringCircleScreen = () => {
  const { data: dependents } = useDependents();
  const [deleteMember, setDeleteMember] = useState<Dependent>();
  const navigation = useNavigation();

  const { isOpen: isSuccessModalOpen, onOpen: showSuccessModal, onClose: closeSuccessModal } = useDisclose();

  const deleteItem = (item?: Dependent) => {
    setDeleteMember(item);
    showSuccessModal();
  };

  return (
    <Box flex={1} p="4" _light={{ background: 'white' }} _dark={{ background: 'coolGray.800' }}>
      <Text fontWeight={400} paddingBottom="12px">
        Your Caring Circle includes people that you take care of or somebody that takes care of you. For example, this
        could be a family member, legal guardian or a caretaker. Use the “+” button to add a person.
      </Text>

      <FlatList
        data={dependents}
        keyExtractor={item => item.dependent_data.dependent_id.toString()}
        renderItem={({ item }) => {
          return (
            <Pressable py={2} onPress={() => navigation.navigate('EditPerson', { person: item })}>
              <ProfileCard
                title={`${item?.dependent_data.first_name} ${item?.dependent_data.last_name}`}
                relation={item?.dependent_data.relationship?.value}
                onDelete={() => deleteItem(item?.dependent_data)}
              />
            </Pressable>
          );
        }}
        ListEmptyComponent={<NodataCard />}
      />
      <Button
        backgroundColor="primary.600"
        _light={{ backgroundColor: 'primary.600' }}
        _dark={{ backgroundColor: 'tertiary.600' }}
        variant="solid"
        width="56px"
        height="56px"
        borderRadius="9999px"
        shadow="0px 4px 4.65px"
        position="absolute"
        bottom={34}
        alignSelf="center"
        onPress={() => {
          navigation.navigate('AddPerson');
        }}
      >
        <Icon size="6" as={MaterialIcons} name="add" _light={{ color: '#F9FAFB' }} _dark={{ color: 'coolGray.100' }} />
      </Button>

      <DeleteConfirmationModal
        description="You are about to remove this person from your Caring Circle. Are you sure ?"
        isOpen={isSuccessModalOpen}
        selectedItem={deleteMember}
        onCancel={closeSuccessModal}
      />
    </Box>
  );
};

export default CaringCircleScreen;
