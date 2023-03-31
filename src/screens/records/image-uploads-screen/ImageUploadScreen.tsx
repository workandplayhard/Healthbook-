import { useState } from 'react';

import { Box, Button, Text, useColorMode, VStack } from 'native-base';

import CameraIcon from '@assets/icons/camera_alt.svg';
import PhotoLibraryIcon from '@assets/icons/photo_library.svg';
import FolderIcon from '@assets/icons/folder.svg';
import theme from 'theme';

import { PermissionsAndroid, Platform } from 'react-native';

import ImagePicker, { type ImageOrVideo } from 'react-native-image-crop-picker';
import DocumentPicker, {
  type DocumentPickerResponse,
} from 'react-native-document-picker';
import { useNavigation } from '@react-navigation/native';
import { useFormStateStore } from 'hooks/useFormStateStore';

const ImageUploadScreen = () => {
  const { colorMode } = useColorMode();
  const navigation = useNavigation();

  const { setFiles: setFormFiles, files: formFiles } = useFormStateStore();

  const pickFileFromDevice = async () => {
    const res = await DocumentPicker.pickMultiple({
      type: [DocumentPicker.types.allFiles],
    });

    goBackToForm(res);
  };

  async function hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    console.log('hasPermission :', hasPermission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    console.log('status :', status);
    return status === 'granted';
  }

  const pickPictureFromStorage = async () => {
    console.log('Platform.OS :', Platform.OS);
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    }

    const res = await ImagePicker.openPicker({ multiple: true });

    goBackToForm(res);
  };

  const pickPictureFromCamera = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const images = await ImagePicker.openCamera({ multiple: true });

        goBackToForm(images);
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const color =
    colorMode === 'light'
      ? theme.colors.primary[600]
      : theme.colors.tertiary[600];

  const goBackToForm = (
    files: ImageOrVideo[] | DocumentPickerResponse[] = [],
  ) => {
    setFormFiles([...(formFiles || []), ...files]);
    navigation.goBack();
  };

  return (
    <Box
      flex={1}
      _light={{ bgColor: 'primary.600' }}
      _dark={{ bgColor: 'coolGray.900' }}
      pt={3}
      safeArea
    >
      <VStack
        flex={1}
        borderTopRadius="xl"
        _light={{ bgColor: 'white' }}
        _dark={{ bgColor: 'coolGray.800' }}
      >
        <Button
          variant="unstyled"
          _text={{
            fontSize: 'sm',
            fontWeight: 'bold',
            _light: { color: 'primary.600' },
            _dark: { color: 'tertiary.600' },
          }}
          alignSelf="flex-start"
          onPress={() => goBackToForm()}
        >
          Close
        </Button>

        <VStack mx={8} my={4} flex={1} alignItems="flex-start">
          <Text fontSize="sm">
            Upload PDFs, documents or images to attach to this record
          </Text>

          <Button
            variant="unstyled"
            py={3}
            px={0}
            startIcon={<FolderIcon fill={color} />}
            _text={{
              fontWeight: 'bold',
              color,
            }}
            onPress={pickFileFromDevice}
          >
            Browse files on device
          </Button>
          <Button
            variant="unstyled"
            py={3}
            px={0}
            startIcon={<PhotoLibraryIcon fill={color} />}
            _text={{
              fontWeight: 'bold',
              color,
            }}
            onPress={pickPictureFromStorage}
          >
            Select from photos
          </Button>
          <Button
            variant="unstyled"
            py={3}
            px={0}
            startIcon={<CameraIcon fill={color} />}
            _text={{
              fontWeight: 'bold',
              color,
            }}
            onPress={pickPictureFromCamera}
          >
            Take a photo with camera
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
};

export default ImageUploadScreen;
