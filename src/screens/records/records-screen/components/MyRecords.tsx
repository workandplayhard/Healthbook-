import React, { useEffect } from 'react';
import { Box, Button, FlatList, HStack, useColorMode } from 'native-base';
import { useNavigation } from '@react-navigation/native';

import theme from 'theme';
import { useCountPerType } from 'hooks/useHealthRecord';
import FileDownloadIcon from '@assets/icons/file_download.svg';
import { recordCategories } from './data/record-categories';
import RecordItem from './RecordItem';
import IntroModal from './IntroModal';
import { useCurrentUser, useUpdateCurrentUser } from 'hooks/useUsers';

const MyRecords = () => {
  const { colorMode } = useColorMode();
  const navigation = useNavigation();
  const { data: currentUser } = useCurrentUser();
  const { mutate: updateCurrentUser } = useUpdateCurrentUser();
  const { data: countPerTypes } = useCountPerType();

  useEffect(() => {
    return navigation.addListener('focus', () => {
      if (!currentUser?.settings?.isVisitedHealthRecords)
        updateCurrentUser({
          settings: { ...currentUser?.settings, isVisitedHealthRecords: true },
        });
    });
  }, [navigation, currentUser]);

  return (
    <Box my={2} flexDirection="column">
      {!currentUser?.settings?.isVisitedHealthRecords && <IntroModal />}

      <FlatList
        data={recordCategories}
        renderItem={({ item: { Icon, title, key, navigationKey } }) => (
          <RecordItem
            Icon={Icon}
            title={title}
            key={key}
            action={() => navigation.navigate('Category', { type: key })}
            count={countPerTypes ? countPerTypes[key] : 0}
          />
        )}
        ListFooterComponent={
          <HStack alignItems="center" py={2} borderBottomWidth={1} borderTopWidth={1} borderColor="dustyGray.300">
            <Button
              variant="unstyled"
              leftIcon={
                <FileDownloadIcon
                  fill={colorMode === 'light' ? theme.colors.primary[600] : theme.colors.tertiary[600]}
                  height={20}
                  width={20}
                />
              }
              _text={{
                _light: { color: 'primary.600' },
                _dark: { color: 'tertiary.600' },
                fontWeight: 'bold',
                fontSize: 'sm',
                ml: 2,
              }}
              onPress={() => navigation.navigate('ExportPDF')}
            >
              Export PDF
            </Button>
          </HStack>
        }
      />
    </Box>
  );
};

export default MyRecords;
