import React, { useMemo, useState } from 'react';
import { Box, Button, Spinner, useColorMode } from 'native-base';
import Stepper from 'react-native-step-indicator';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import theme from '@theme';
import First from './components/sharing-steps/First';
import Second from './components/sharing-steps/Second';
import Third from './components/sharing-steps/Third';
import { useRelationsAndDurations, useSaveSharingDocument } from '@hooks/useHealthVault';

import type { RootStackNavigatorParamList } from '@navigation/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { StepIndicatorStyles } from 'react-native-step-indicator/lib/typescript/src/types';
import type { RecipientFormValues } from './components/sharing-steps/First';

const stepLabels = ['Recipient', 'Authorize', 'Confirm'];

const SharingProcessScreen: React.FC<NativeStackScreenProps<RootStackNavigatorParamList, 'SharingProcess'>> = ({
  route: {
    params: { documents },
  },
  navigation,
}) => {
  const [stepperIndex, setStepperIndex] = useState(0);
  const { colorMode } = useColorMode();
  const [recipientValues, setRecipientValues] = useState<RecipientFormValues>({
    name: '',
    email: '',
    duration: '',
    relation: '',
  });
  const { data: relationsAndDurationsData, isLoading: isLoadingRelationsAndDurations } = useRelationsAndDurations();
  const { mutate: saveSharingDocument } = useSaveSharingDocument();

  const stepperStyle: StepIndicatorStyles = useMemo(
    () => ({
      stepIndicatorLabelFontSize: 12,
      currentStepIndicatorLabelFontSize: 12,
      currentStepLabelColor: colorMode === 'dark' ? 'white' : theme.colors.dustyGray[900],
      labelColor: theme.colors.secondary[600],
      stepIndicatorFinishedColor: theme.colors.secondary[600],
      stepIndicatorUnFinishedColor: theme.colors.secondary[600],
      stepIndicatorLabelFinishedColor: 'white',
      stepIndicatorLabelUnFinishedColor: 'white',
      stepIndicatorCurrentColor: 'white',
      stepIndicatorLabelCurrentColor: theme.colors.secondary[600],
      currentStepStrokeWidth: 1,
      stepStrokeCurrentColor: theme.colors.secondary[600],
      stepIndicatorSize: 18,
      currentStepIndicatorSize: 18,
    }),
    [colorMode],
  );

  const handleRecipientFormFinish = (values: RecipientFormValues) => {
    setRecipientValues(values);
    setStepperIndex(1);
  };

  const handleSubmit = () => {
    const { email, name, duration, relation } = recipientValues;

    saveSharingDocument(
      {
        document_list: documents,
        duration: relationsAndDurationsData?.Duration.find(item => item.id === parseInt(duration))!,
        recipient_email: email,
        recipient_name: name,
        relationship: relationsAndDurationsData?.Relationship.find(item => item.id === parseInt(relation))!,
      },
      {
        onSuccess: () => setStepperIndex(2),
      },
    );
  };

  return (
    <Box flex={1} _light={{ backgroundColor: 'primary.600' }} _dark={{ backgroundColor: '#111827' }}>
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
        {isLoadingRelationsAndDurations ? (
          <Box flex={1} justifyContent="center">
            <Spinner size="lg" />
          </Box>
        ) : (
          <>
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
                Close
              </Button>
            </Box>
            <Box mt={5} mb={6}>
              <Stepper
                stepCount={stepLabels.length}
                labels={stepLabels}
                currentPosition={stepperIndex}
                customStyles={stepperStyle}
              />
            </Box>
            <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
              {stepperIndex === 0 && <First onNext={handleRecipientFormFinish} defaultValues={recipientValues} />}
              {stepperIndex === 1 && (
                <Second onNext={handleSubmit} onBack={() => setStepperIndex(0)} data={recipientValues} />
              )}
              {stepperIndex === 2 && <Third onDone={() => navigation.goBack()} />}
            </KeyboardAwareScrollView>
          </>
        )}
      </Box>
    </Box>
  );
};

export default SharingProcessScreen;
