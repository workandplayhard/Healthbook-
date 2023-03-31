import React from 'react';
import { Button, FlatList, Checkbox, Box, Text, Spinner } from 'native-base';
import { useNavigation } from '@react-navigation/native';

import { useFormStateStore } from 'hooks/useFormStateStore';
import { useBodySiteList } from 'hooks/useHealthRecord';

export const BodyPartListScreen: React.FC = () => {
  const navigation = useNavigation();

  const { data: bodySiteData, isLoading: isLoadingBodySiteData } =
    useBodySiteList();

  const { setBodySites, body_sites } = useFormStateStore();

  const [groupValue, setGroupValue] = React.useState(body_sites);

  const handleSubmit = () => {
    setBodySites(groupValue);
    navigation.goBack();
  };

  return (
    <Box
      flex={1}
      _light={{ backgroundColor: 'primary.600' }}
      _dark={{ backgroundColor: '#111827' }}
    >
      {isLoadingBodySiteData ? (
        <Box flex={1} justifyContent="center">
          <Spinner size="lg" />
        </Box>
      ) : (
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
          <Text mt={5} mb={6}>
            Indicate parts of body related to this health record
          </Text>
          <FlatList
            mb={4}
            data={bodySiteData}
            renderItem={({ item: { code, display } }) => (
              <Checkbox
                value={code}
                my={2}
                isChecked={groupValue?.includes(code)}
                onChange={isSelected => {
                  if (isSelected) {
                    setGroupValue(v => [...v, code]);
                  } else {
                    setGroupValue(groupValue =>
                      groupValue?.filter(v => v !== code),
                    );
                  }
                }}
              >
                {display}
              </Checkbox>
            )}
          />
          <Button onPress={handleSubmit}>Save</Button>
        </Box>
      )}
    </Box>
  );
};
export default BodyPartListScreen;
