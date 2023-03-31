import { useEffect } from 'react';
import {
  Button,
  HStack,
  IconButton,
  SmallCloseIcon,
  Text,
  useColorMode,
  VStack,
} from 'native-base';
import CloudUploadIcon from '@assets/icons/cloud_upload.svg';
import theme from 'theme';
import { useNavigation } from '@react-navigation/native';
import { useFormStateStore } from 'hooks/useFormStateStore';
import FilePresentIcon from '@assets/icons/health_records/file-attachment.svg';

type Props = {
  value: any;
  onChange: (v: any) => void;
};

const FormFileAttachments: React.FC<Props> = ({ value = [], onChange }) => {
  const navigation = useNavigation();
  const { colorMode } = useColorMode();

  const { files, setFiles }: any = useFormStateStore();

  useEffect(() => {
    if (files && files.length) {
      onChange([...value, ...files]);
    }

    setFiles(undefined);
  }, [files]);

  return (
    <VStack>
      <Button
        variant="unstyled"
        my={6}
        startIcon={
          <CloudUploadIcon
            fill={
              colorMode === 'light'
                ? theme.colors.primary[600]
                : theme.colors.tertiary[600]
            }
          />
        }
        width="full"
        justifyContent="flex-start"
        padding={0}
        _text={{
          fontWeight: 'bold',
          _light: { color: 'primary.600' },
          _dark: { color: 'tertiary.600' },
        }}
        onPress={() => navigation.navigate('ImageUpload')}
      >
        Upload an attachment
      </Button>

      <VStack space={4}>
        {value.map((data: any, index) => {
          return (
            <HStack key={index}>
              <FilePresentIcon
                fill={
                  colorMode === 'light'
                    ? theme.colors.dustyGray[900]
                    : theme.colors.dustyGray[100]
                }
              />
              <Text
                flex={1}
                _light={{ color: 'dustyGray.900' }}
                _dark={{ color: 'dustyGray.100' }}
              >
                {data.name ||
                  data.filename ||
                  data.path.split('/').reverse()[0]}
              </Text>

              <IconButton
                p={1}
                icon={<SmallCloseIcon />}
                alignItems="flex-start"
                _icon={{
                  _dark: { color: 'coolGray.800' },
                  _light: { color: 'white' },
                  size: 'sm',
                  bgColor: 'dustyGray.500',
                  rounded: 'full',
                }}
                onPress={() => {
                  onChange([
                    ...[...value].splice(0, index),
                    ...[...value].splice(index + 1, value.length),
                  ]);
                }}
              />
            </HStack>
          );
        })}
      </VStack>
    </VStack>
  );
};

export default FormFileAttachments;
