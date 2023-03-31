import { useCallback, useEffect, useMemo } from 'react';

import {
  Box,
  Button,
  HStack,
  Pressable,
  Switch,
  Text,
  VStack,
} from 'native-base';
import { RootStackScreenProps } from 'navigation/types';
import { useGetVitalSettings, useUpdateVitalsSettings } from 'hooks/useVitals';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const DashboardSettingsScreen: React.FC<
  RootStackScreenProps<'DashboardSettings'>
> = ({ navigation }) => {
  const { data: dashboardSettings } = useGetVitalSettings();
  const { mutate: updateVitalSettings } = useUpdateVitalsSettings();
  const { control, setValue, handleSubmit } = useForm<{
    [name: string]: boolean;
  }>();

  useEffect(() => {
    if (dashboardSettings) {
      dashboardSettings.forEach(({ vital_name, status }) =>
        setValue(vital_name, status === 'Enabled'),
      );
    }
  }, [dashboardSettings]);

  const submit: SubmitHandler<{ [name: string]: boolean }> = useCallback(
    values => {
      if (dashboardSettings) {
        updateVitalSettings(
          dashboardSettings.map(({ vital_id, vital_name }) => ({
            status: values[vital_name] ? 'Enabled' : 'Disabled',
            vital_id,
            vital_name,
          })),
        );
      }
    },
    [dashboardSettings],
  );

  const widgetList = useMemo(() => {
    return (dashboardSettings || []).map(({ vital_id, vital_name }) => (
      <HStack
        borderBottomWidth={1}
        key={vital_id}
        alignItems="center"
        justifyContent="space-between"
        py={2}
      >
        <Text fontSize="sm" fontWeight="bold">
          {vital_name}
        </Text>
        <Controller
          control={control}
          name={vital_name}
          render={({ field: { value, onChange } }) => (
            <Switch
              size="md"
              onTrackColor="secondary.600"
              value={value}
              onValueChange={onChange}
            />
          )}
        />
      </HStack>
    ));
  }, [dashboardSettings]);

  return (
    <VStack flex={1} p={6}>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'space-between',
          flexDirection: 'column',
        }}
      >
        <VStack>
          <Pressable
            onPress={() =>
              navigation.navigate('TabNavigator', {
                screen: 'HomeTab',
                params: { screen: 'Dashboard' },
              })
            }
          >
            <Text color="primary.600" fontWeight="bold" fontSize="sm">
              Cancel
            </Text>
          </Pressable>

          <Box mt={6}>
            <Text fontSize="xl" fontWeight="bold">
              Display Widgets
            </Text>
          </Box>

          <Box flex={1} borderTopWidth={1} mt={6}>
            {widgetList}
          </Box>
        </VStack>

        <Button onPress={handleSubmit(submit)}>Save</Button>
      </KeyboardAwareScrollView>
    </VStack>
  );
};

export default DashboardSettingsScreen;
