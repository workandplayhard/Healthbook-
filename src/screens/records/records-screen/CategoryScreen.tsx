import React, { useCallback, useState, useEffect } from 'react';
import {
  AddIcon,
  Box,
  Button,
  Center,
  Fab,
  FlatList,
  Icon,
  Modal,
  Pressable,
  Text,
  useToast,
  View,
  VStack,
} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Accordion from 'react-native-collapsible-accordion';
import FileAttachmentIcon from '@assets/icons/health_records/file-attachment.svg';
import HealthRecordIcon from '@assets/icons/health_records/health-record-icon.svg';
import { useDeleteHealthRecord, useHealthRecords } from 'hooks/useHealthRecord';
import { RootStackScreenProps } from 'navigation/types';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';

type CategoryData = {
  [prop: string]: {
    fields: Array<{ key: string; label: string; width?: string }>;
    addScreen?: string;
    editScreen?: string;
    headerTitle: string;
    delete?: boolean;
  };
};

const categoryData: CategoryData = {
  condition: {
    fields: [
      {
        key: 'condition',
        label: 'title',
      },
      { key: 'start', label: 'START DATE', width: '1/2' },
      { key: 'end', label: 'END DATE', width: '1/2' },
      { key: 'verification_status', label: 'VERIFIED' },
    ],
    headerTitle: 'Medical Conditions',
    addScreen: 'AddCondition',
    editScreen: 'EditCondition',
  },
  symptom: {
    fields: [
      {
        key: 'symptom',
        label: 'title',
      },
      {
        key: 'start',
        label: 'START DATE',
        width: '1/2',
      },
      {
        key: 'end',
        label: 'END DATE',
        width: '1/2',
      },
      {
        key: 'intensity',
        label: 'INTENSITY',
      },
      {
        key: 'frequency',
        label: 'FREQUENCY',
      },
    ],
    headerTitle: 'Symptoms',
    addScreen: 'AddSymptom',
    editScreen: 'EditSymptom',
  },
  surgery: {
    fields: [
      {
        key: 'surgery',
        label: 'title',
      },
      { key: 'date', label: 'DATE' },
      { key: 'date', label: 'DATE' },
      { key: 'histology_report', label: 'BIOPSY' },
      {
        key: 'complication',
        label: 'COMPLICATIONS',
      },
      {
        key: 'hospital',
        label: 'FACILITY',
      },
    ],
    headerTitle: 'Surgeries',
    addScreen: 'AddSurgery',
    editScreen: 'EditSurgery',
  },
  procedure: {
    fields: [
      {
        key: 'procedure',
        label: 'title',
      },
      { key: 'date', label: 'DATE' },
      { key: 'histology_report', label: 'BIOPSY' },
      {
        key: 'complication',
        label: 'COMPLICATIONS',
      },
      {
        key: 'hospital',
        label: 'FACILITY',
      },
    ],
    headerTitle: 'Procedures',
    addScreen: 'AddProcedure',
    editScreen: 'EditProcedure',
  },
  diagnostic: {
    fields: [{ key: 'date', label: 'DATE' }],
    headerTitle: 'Imaging',
  },
  lab: {
    fields: [
      {
        key: 'lab',
        label: 'title',
      },
      { key: 'date', label: 'DATE' },
      { key: 'result', label: 'RESULT' },
      { key: 'within_normal_value', label: 'WITHIN NORMAL RANGE?' },
    ],
    headerTitle: 'Labs',
    addScreen: 'AddLab',
  },
  immunization: {
    fields: [
      {
        key: 'immunization',
        label: 'title',
      },
      { key: 'date', label: 'DATE' },
      { key: 'dose_number', label: 'DOSE' },
      { key: 'reaction', label: 'Reaction' },
    ],
    headerTitle: 'Immunizations',
    addScreen: 'AddImmunization',
    editScreen: 'EditImmunization',
  },
  familyhistory: {
    fields: [
      {
        key: 'familyhistory',
        label: 'title',
      },
      { key: 'medical_problem', label: 'title' },
      { key: 'family_member_name', label: 'NAME' },
      {
        key: 'relationship_type',
        label: 'RELATIONSHIP',
      },
      {
        key: 'outcome',
        label: 'OUTCOME',
      },
    ],
    headerTitle: 'Family History',
    addScreen: 'AddFamilyhistory',
    editScreen: 'EditFamilyhistory',
  },
  medication: {
    fields: [
      {
        key: 'medication',
        label: 'title',
      },
      { key: 'start', label: 'START DATE', width: '1/2' },
      {
        key: 'end',
        label: 'END DATE',
        width: '1/2',
      },
      {
        key: 'frequency_and_dosage',
        label: 'FREQUENCY',
      },
    ],
    headerTitle: 'Medications',
    addScreen: 'AddMedication',
    editScreen: 'EditMedication',
  },
  supplement: {
    fields: [
      {
        key: 'supplement',
        label: 'title',
      },
      { key: 'start', label: 'START DATE', width: '1/2' },
      {
        key: 'emd',
        label: 'END DATE',
        width: '1/2',
      },
      {
        key: 'frequency',
        label: 'FREQUENCY',
      },
    ],
    headerTitle: 'Supplements',
  },
  allergy: {
    fields: [
      { key: 'allergy', label: 'title' },
      { key: 'start', label: 'Onset Date' },
      { key: 'category', label: 'Category' },
    ],
    headerTitle: 'Allergies',
    addScreen: 'AddAllergy',
    editScreen: 'EditAllergy',
    delete: true,
  },
  socialhistory: {
    fields: [
      { key: 'category', label: 'title' },
      { key: 'start_age', label: 'START AGE', width: '1/2' },
      {
        key: 'end_age',
        label: 'END AGE',
        width: '1/2',
      },
      {
        key: 'frequency',
        label: 'FREQUENCY',
      },
    ],
    headerTitle: 'Social History',
    addScreen: 'AddSocialhistory',
    editScreen: 'EditSocialhistory',
  },
  medicalvisit: {
    fields: [
      {
        key: 'date',
        label: 'title',
      },
      {
        key: 'professional',
        label: 'PROFESSIONAL',
      },
      {
        key: 'reason',
        label: 'REASON OF VISIT',
      },
      {
        key: 'symptoms',
        label: 'SYMPTOMS',
      },
      {
        key: 'diagnosis',
        label: 'DIAGNOSIS',
      },
    ],
    headerTitle: 'Healthcare Visit',
    addScreen: 'AddMedicalvisit',
    editScreen: 'EditMedicalvisit',
  },
  travelhistory: {
    fields: [
      {
        key: 'label',
        label: 'title',
      },
      {
        key: 'country',
        label: 'Country',
      },
      {
        key: 'start',
        label: 'START DATE',
        width: '1/2',
      },
      {
        key: 'end',
        label: 'END DATE',
        width: '1/2',
      },
    ],
    headerTitle: 'Travel History',
    addScreen: 'AddTravelhistory',
    editScreen: 'EditTravelhistory',
  },
};

const CategoryScreen: React.FC<RootStackScreenProps<'Category'>> = ({
  route: {
    params: { type },
  },
}) => {
  const [openItem, setOpenItem] = useState<any>();
  const [modalOpen, setModalOpen] = useState(false);
  const navigation = useNavigation();

  const toast = useToast();

  const { data: records = [], isLoading } = useHealthRecords(type);
  const { mutate: deleteRecord } = useDeleteHealthRecord();

  useEffect(() => {
    navigation.setOptions({ headerTitle: categoryData[type].headerTitle });
  }, [type]);

  const deleteItem = useCallback(() => {
    if (openItem) {
      deleteRecord(
        {
          hr: openItem.hr_id,
          attachments: (openItem.attachment || []).map(({ id }: { id: string }) => id),
        },
        {
          onSuccess: () => {
            toast.show({
              description: 'Record has been deleted.',
              duration: 2000,
              bgColor: 'green.600',
              color: 'white',
            });
          },
        },
      );
    }

    setModalOpen(false);
  }, [openItem]);

  const renderContent = useCallback(
    (item: any) => {
      return () => {
        const fieldList = categoryData[type as keyof typeof categoryData].fields;

        return (
          <Box px={4} flexDirection="row" flexWrap="wrap" key={item.hr_id}>
            {fieldList.map(field => {
              if (field.label === 'title') return <></>;
              if (field.key === 'verification_status') {
                return (
                  <VStack width={field?.width ? field.width : 'full'} mb="2.5">
                    <Text fontSize="xs" color="dustyGray.500">
                      {field.label}
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {item.record.verification_status.key}
                    </Text>
                  </VStack>
                );
              }
              if (field.key === 'result' && type === 'lab') {
                return (
                  <VStack width={field?.width ? field.width : 'full'} mb="2.5">
                    <Text fontSize="xs" color="dustyGray.500">
                      {field.label}
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {`${item.record.result} ${item.record.units}`}
                    </Text>
                  </VStack>
                );
              }

              if (field.key === 'reason' && type === 'medicalvisit') {
                return (
                  <VStack width={field?.width ? field.width : 'full'} mb="2.5">
                    <Text fontSize="xs" color="dustyGray.500">
                      {field.label}
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {item.record.reason.value}
                    </Text>
                  </VStack>
                );
              }

              if (field.key === 'frequency' && (type === 'medication' || type === 'supplement')) {
                return (
                  <VStack width={field?.width ? field.width : 'full'} mb="2.5">
                    <Text fontSize="xs" color="dustyGray.500">
                      {field.label}
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {`${item.record.frequency} times ${item.record.interval}, ${item.record.dosage}`}
                    </Text>
                  </VStack>
                );
              }

              if (field.key === 'country' && type === 'travelhistory') {
                return (
                  <VStack width={field?.width ? field.width : 'full'} mb="2.5">
                    <Text fontSize="xs" color="dustyGray.500">
                      {field.label}
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {`${item?.record.country.value}`}
                    </Text>
                  </VStack>
                );
              }

              if (field.key === 'frequency' || field.key === 'interval') {
                return (
                  <VStack width={field?.width ? field.width : 'full'} mb="2.5">
                    <Text fontSize="xs" color="dustyGray.500">
                      {field.label}
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {item.record[field.key].value}
                    </Text>
                  </VStack>
                );
              }

              if (field.key === 'category' && type === 'allergy') {
                return (
                  <VStack width={field?.width ? field.width : 'full'} mb="2.5">
                    <Text fontSize="xs" color="dustyGray.500">
                      {field.label}
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {`${item.record.category.value}`}
                    </Text>
                  </VStack>
                );
              }

              if (field.key === 'relationship_type') {
                return (
                  <VStack width={field?.width ? field.width : 'full'} mb="2.5">
                    <Text fontSize="xs" color="dustyGray.500">
                      {field.label}
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {item.record.relationship_type.value}
                    </Text>
                  </VStack>
                );
              }

              if (field.key === 'outcome') {
                return (
                  <VStack width={field?.width ? field.width : 'full'} mb="2.5">
                    <Text fontSize="xs" color="dustyGray.500">
                      {field.label}
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {item.record.outcome.value}
                    </Text>
                  </VStack>
                );
              }

              if (field.key === 'reaction') {
                return (
                  <VStack width={field?.width ? field.width : 'full'} mb="2.5">
                    <Text fontSize="xs" color="dustyGray.500">
                      {field.label}
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {item.record.reaction.value}
                    </Text>
                  </VStack>
                );
              }
              if (field.key === 'dose_number') {
                return (
                  <VStack width={field?.width ? field.width : 'full'} mb="2.5">
                    <Text fontSize="xs" color="dustyGray.500">
                      {field.label}
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {item.record.dose_number || 1}
                    </Text>
                  </VStack>
                );
              }
              if (field.key === 'start' || field.key === 'end') {
                return (
                  <VStack width={field?.width ? field.width : 'full'} mb="2.5">
                    <Text fontSize="xs" color="dustyGray.500">
                      {field.label}
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {dayjs(item.record[field.key]).format('MM/DD/YYYY')}
                    </Text>
                  </VStack>
                );
              }

              return (
                <VStack width={field?.width ? field.width : 'full'} mb="2.5">
                  <Text fontSize="xs" color="dustyGray.500">
                    {field.label}
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {item.record[field.key]}
                  </Text>
                </VStack>
              );
            })}

            {item.attachments.map(({ name }: { name: string }) => (
              <Box mt={2} flexDirection="row" width="full">
                <FileAttachmentIcon width={20} height={21} color="primary.600" />
                <Text color="primary.600">{name}</Text>
              </Box>
            ))}

            <View flexDirection="row" mt="15" mb="15">
              <Box mr="15%">
                <Pressable
                  borderColor="primary.600"
                  borderWidth={1}
                  borderRadius={100}
                  p={3}
                  onPress={() => {
                    setModalOpen(true);
                    setOpenItem(item);
                  }}
                >
                  <Icon
                    as={MaterialCommunityIcons}
                    name="delete-outline"
                    size="lg"
                    _light={{ color: 'primary.600' }}
                    _dark={{ color: 'tertiary.600' }}
                  />
                </Pressable>
                <Text alignSelf="center">Delete</Text>
              </Box>

              <Box>
                <Pressable
                  borderColor="primary.600"
                  borderWidth={1}
                  borderRadius={100}
                  p={3}
                  onPress={() => {
                    if (categoryData[type].editScreen) {
                      navigation.navigate(
                        ...([
                          categoryData[type].editScreen,
                          {
                            id: item.hr_id,
                          },
                        ] as any),
                      );
                    }
                  }}
                >
                  <Icon
                    as={MaterialCommunityIcons}
                    name="pencil"
                    size="lg"
                    _light={{ color: 'primary.600' }}
                    _dark={{ color: 'tertiary.600' }}
                  />
                </Pressable>
                <Text alignSelf="center">Edit</Text>
              </Box>
            </View>
          </Box>
        );
      };
    },
    [records, type],
  );

  if (!records.length && !isLoading) {
    return (
      <VStack justifyContent="space-between" flex={1} _light={{ bgColor: 'white' }} _dark={{ bgColor: 'coolGray.800' }}>
        <Center>
          <View pt={100} margin={15}>
            <HealthRecordIcon width={70} height={70} color="primary.600" />
          </View>
          <Text>There are no records here</Text>
        </Center>

        <Fab
          renderInPortal={false}
          shadow={2}
          size="sm"
          bottom={6}
          right={6}
          bgColor="primary.600"
          onPress={() => navigation.navigate(categoryData[type].addScreen)}
          icon={<AddIcon />}
        ></Fab>
      </VStack>
    );
  } else {
    return (
      <VStack flex={1} _light={{ bgColor: 'white' }} _dark={{ bgColor: 'coolGray.800' }}>
        <FlatList
          data={records}
          renderItem={({ item }: any) => (
            <Box borderBottomColor="#DDD" borderBottomWidth={1}>
              <Accordion
                onChangeVisibility={(value: any) => {}}
                renderHeader={() => (
                  <Box px="4" py="3">
                    <Text fontWeight="bold" fontSize="md">
                      {item.record[type as any]
                        ? categoryData[type as keyof typeof categoryData].fields[0].label === 'title' &&
                          item.record[categoryData[type as keyof typeof categoryData].fields[0].key]
                        : item.label}
                    </Text>
                  </Box>
                )}
                renderContent={renderContent(item)}
              />
            </Box>
          )}
        />

        <Fab
          renderInPortal={false}
          shadow={2}
          placement="bottom-right"
          size="sm"
          position="absolute"
          bottom={6}
          right={6}
          onPress={() => navigation.navigate(categoryData[type]?.addScreen)}
          bgColor="primary.600"
          icon={<AddIcon />}
        ></Fab>

        {openItem && (
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
            <Modal.Content>
              <Modal.CloseButton />
              <Modal.Header
                _text={{ color: 'white' }}
                _light={{ bgColor: 'primary.600' }}
                _dark={{ bgColor: 'tertiary.600' }}
              >
                Delete record
              </Modal.Header>
              <Modal.Body>{`Are you sure to delete ${type} (${
                openItem.record[type as any] ||
                (categoryData[type as keyof typeof categoryData].fields[0].label === 'title' &&
                  openItem.record[categoryData[type as keyof typeof categoryData].fields[0].key])
              }) ?`}</Modal.Body>
              <Modal.Footer py={0}>
                <Button.Group>
                  <Button variant="unstyled" _text={{ fontWeight: 'medium' }} onPress={deleteItem}>
                    Yes
                  </Button>
                  <Button variant="unstyled" _text={{ fontWeight: 'medium' }} onPress={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                </Button.Group>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        )}
      </VStack>
    );
  }
};

export default CategoryScreen;
