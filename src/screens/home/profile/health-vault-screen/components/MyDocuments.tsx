import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Text,
  Modal,
  Center,
  View,
  AddIcon,
  FlatList,
  IconButton,
  HStack,
  Checkbox,
  ShareIcon,
  DeleteIcon,
  VStack,
  Spinner,
  useToast,
} from 'native-base';
import HealthVaultImage from '@assets/images/health-vault.svg';
import HealthRecordIcon from '@assets/icons/health_records/health-record-icon.svg';

import Document from './Document';
import theme from 'theme';
import SortIcon from '@assets/icons/sort.svg';
import { useNavigation } from '@react-navigation/native';
import DocumentPicker, { types as DocumentPickerTypes } from 'react-native-document-picker';
import SortFilterModal from './SortFilterModal';
import { useHVTags, useHVDocuments, useDeleteDocument, useHealthVaultFirstTime } from '@hooks/useHealthVault';
import DeleteModal from './DeleteModal';

export type SortFilterOptions = {
  sortBy: string;
  filterBy: string;
};

const MyDocuments = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const navigation = useNavigation();
  const [firstTime, setFirstTime] = useState<boolean>(false);
  const { healthVault, setHealthVault } = useHealthVaultFirstTime();
  useEffect(() => {
    if (!firstTime) {
      setFirstTime(true);
    }

    return () => {
      setHealthVault(false);
    };
  }, []);

  const [checkedDocuments, setCheckedDocuments] = useState<number[]>([]);
  const [isOpenSortModal, setIsOpenSortModal] = useState(false);
  const [deleteModalInfo, setDeleteModalInfo] = useState<{
    type: 'multiple' | 'single';
    document?: number;
  } | null>(null);
  const [sortBy, setSortBy] = useState('desc-date');
  const [filterBy, setFilterBy] = useState('');
  const { isLoading: isLoadingTags } = useHVTags();
  const { data: documentsData, isLoading: isLoadingDocuments } = useHVDocuments(sortBy, filterBy);
  const { mutate: deleteDocuments, isLoading: isDeletingDocuments } = useDeleteDocument();
  const toast = useToast();

  const isCheckedDocument = useCallback((id: number) => checkedDocuments.includes(id), [checkedDocuments]);

  const handleCheck = (id: number) => {
    setCheckedDocuments(state => (state.includes(id) ? state.filter(item => item !== id) : [...state, id]));
  };

  const isCheckedAllDocuments = useMemo(
    () =>
      !isLoadingDocuments &&
      documentsData!?.records.length > 0 &&
      documentsData!?.records.length === checkedDocuments.length,
    [documentsData, checkedDocuments, isLoadingDocuments],
  );

  const handleCheckAll = () => {
    if (isLoadingDocuments || documentsData!?.records.length === 0) return;
    if (documentsData!?.records.length === checkedDocuments.length) setCheckedDocuments([]);
    else setCheckedDocuments(documentsData!?.records.map(document => document.document_id));
  };

  const handleSelectFile = async () => {
    try {
      const pickedFile = await DocumentPicker.pickSingle({
        type: [DocumentPickerTypes.pdf, DocumentPickerTypes.images],
      });

      navigation.navigate('UploadDocumentTagScreen', { file: pickedFile });
    } catch (err) {
      console.warn(err);
    }
  };

  const handleSortFilterOptionsApply = ({ sortBy, filterBy }: SortFilterOptions) => {
    setSortBy(sortBy);
    setFilterBy(filterBy);
    setIsOpenSortModal(false);
  };

  const handleDeleteDocuments = () => {
    const { type, document } = deleteModalInfo!;

    const documents =
      type === 'multiple'
        ? checkedDocuments.map(documentId => ({
            id: documentId,
            name: documentsData?.records.find(item => item.document_id === documentId)?.document_name!,
          }))
        : [
            {
              id: document!,
              name: documentsData?.records.find(item => item.document_id === document)?.document_name!,
            },
          ];

    deleteDocuments(documents, {
      onSuccess: () => {
        toast.show({
          description: 'Document has been deleted',
          duration: 2000,
          bgColor: 'green.600',
          color: 'white',
        });
        setDeleteModalInfo(null);
        setCheckedDocuments([]);
      },
    });
  };

  return (
    <>
      {isLoadingTags || isLoadingDocuments ? (
        <Box flex={1} justifyContent="center">
          <Spinner size="lg" />
        </Box>
      ) : (
        <Box my={2} flexDirection="column" flex={1}>
          <VStack flex={1} mb={2}>
            <HStack
              justifyContent="space-between"
              alignItems="center"
              px={5}
              py={2}
              borderBottomColor="dustyGray.300"
              borderBottomWidth="1px"
            >
              <Checkbox
                value="select all"
                accessibilityLabel="Select all"
                isChecked={isCheckedAllDocuments}
                _light={{ bgColor: 'white' }}
                _dark={{ bgColor: 'coolGray.800' }}
                _checked={{
                  _light: { bgColor: 'primary.600' },
                  _dark: { bgColor: 'tertiary.600' },
                  _icon: { color: 'white' },
                }}
                onChange={handleCheckAll}
              ></Checkbox>
              <IconButton
                p={0}
                _icon={{
                  fill: theme.colors.primary[600],
                }}
                icon={<SortIcon />}
                _dark={{ _icon: { fill: theme.colors.tertiary[600] } }}
                onPress={() => setIsOpenSortModal(true)}
              />
            </HStack>
            {documentsData!?.records.length ? (
              <FlatList
                data={documentsData!?.records}
                renderItem={({ item }) => (
                  <Document
                    data={item}
                    isChecked={isCheckedDocument(item.document_id)}
                    onChecked={() => handleCheck(item.document_id)}
                    onDelete={() =>
                      setDeleteModalInfo({
                        type: 'single',
                        document: item.document_id,
                      })
                    }
                    onUpdate={() => navigation.navigate('EditDocumentScreen', { document: item })}
                  />
                )}
              />
            ) : (
              <Center>
                <View pt={100} margin={15}>
                  <HealthRecordIcon width={70} height={70} color="primary.600" />
                </View>
                <Text>There are no documents here</Text>
              </Center>
            )}
          </VStack>

          <HStack
            justifyContent="space-between"
            direction="row-reverse"
            width="full"
            px="4"
            position="absolute"
            bottom="2"
          >
            <IconButton
              borderRadius="full"
              _light={{ bgColor: 'primary.600' }}
              _dark={{ bgColor: 'tertiary.600' }}
              color="white"
              _icon={{
                fill: 'white',
                width: '14px',
                height: '14px',
                color: 'white',
              }}
              onPress={handleSelectFile}
              icon={<AddIcon />}
            />
            {checkedDocuments.length > 0 && (
              <>
                <IconButton
                  borderRadius="full"
                  _light={{ bgColor: 'primary.600' }}
                  _dark={{ bgColor: 'tertiary.600' }}
                  color="white"
                  _icon={{
                    fill: 'white',
                    width: '14px',
                    height: '14px',
                    color: 'white',
                  }}
                  icon={<ShareIcon />}
                  onPress={() =>
                    navigation.navigate('SharingProcess', {
                      documents: checkedDocuments.map(documentId => ({
                        id: documentId,
                        name: documentsData?.records.find(item => item.document_id === documentId)?.document_name!,
                      })),
                    })
                  }
                />
                <IconButton
                  borderRadius="full"
                  _light={{ bgColor: 'primary.600' }}
                  _dark={{ bgColor: 'tertiary.600' }}
                  color="white"
                  _icon={{
                    fill: 'white',
                    width: '14px',
                    height: '14px',
                    color: 'white',
                  }}
                  icon={<DeleteIcon />}
                  onPress={() => setDeleteModalInfo({ type: 'multiple' })}
                />
              </>
            )}
          </HStack>

          {healthVault && firstTime && (
            <Modal isOpen={isOpen} px="35px">
              <Modal.Content width="full" h="439px">
                <Modal.CloseButton onPress={() => setIsOpen(false)} />
                <Box mt="62px" alignItems="center" paddingX="19px">
                  <HealthVaultImage />
                  <Text
                    marginY="10px"
                    fontWeight="bold"
                    fontSize="xl"
                    _light={{
                      color: '#3D3D3D',
                    }}
                  >
                    Health Vault
                  </Text>
                  <Text
                    fontStyle="normal"
                    fontSize="sm"
                    lineHeight="21px"
                    _light={{
                      color: 'red',
                      backgroundColor: 'white',
                    }}
                    _dark={{
                      color: 'dustyGray.100',
                      backgroundColor: '#111827',
                    }}
                  >
                    Upload and store all your healthcare related documents in one secure place. This may include medical
                    bills, insurance statements, legal paperwork or identification cards. You can select and share
                    documents with others and specify the amount of time they can access and view them.
                  </Text>
                  <Box w="full" paddingX="5px">
                    <Button
                      my="10px"
                      width="full"
                      _light={{
                        backgroundColor: '#082787',
                        height: '45px',
                      }}
                      onPress={() => setIsOpen(false)}
                    >
                      OK!
                    </Button>
                  </Box>
                </Box>
              </Modal.Content>
            </Modal>
          )}

          <SortFilterModal
            isOpen={isOpenSortModal}
            data={{ sortBy, filterBy }}
            onApply={handleSortFilterOptionsApply}
            onClose={() => setIsOpenSortModal(false)}
          />

          <DeleteModal
            isOpen={!!deleteModalInfo}
            documentsCnt={deleteModalInfo?.type === 'single' ? 1 : checkedDocuments.length}
            onClose={() => setDeleteModalInfo(null)}
            onConfirm={handleDeleteDocuments}
            isDeleting={isDeletingDocuments}
          />
        </Box>
      )}
    </>
  );
};

export default MyDocuments;
