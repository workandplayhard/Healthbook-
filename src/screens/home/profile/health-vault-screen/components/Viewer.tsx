import React, { useLayoutEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Box, Image, Spinner } from 'native-base';
import Pdf from 'react-native-pdf';

import type { RootStackNavigatorParamList } from '@navigation/types';
import { useGetFile } from '@hooks/useHealthVault';

const Viewer: React.FC<NativeStackScreenProps<RootStackNavigatorParamList, 'Viewer'>> = ({
  route: {
    params: { data },
  },
  navigation,
}) => {
  const extension = data.document_name.split('.').reverse()[0];
  const { data: file, isLoading } = useGetFile(data.document_id);

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: data.document_name });
  }, []);

  return (
    <Box flex={1}>
      {isLoading ? (
        <Box flex={1} justifyContent="center">
          <Spinner size="lg" />
        </Box>
      ) : extension === 'pdf' || extension === 'PDF' ? (
        <Pdf
          trustAllCerts={false}
          source={{ uri: file.file_url, cache: true }}
          style={{ flex: 1 }}
          onError={err => console.log(err)}
        />
      ) : (
        <Image source={{ uri: file.file_url }} alt={file.file_name} resizeMode="contain" h="full" />
      )}
    </Box>
  );
};

export default Viewer;
