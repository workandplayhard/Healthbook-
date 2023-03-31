import React from 'react';

import { Box } from 'native-base';
import { WebView } from 'react-native-webview';

const SymptomsQuestionnaireScreen = () => {
  return (
    <Box flex={1} _light={{ bg: 'white' }} _dark={{ bg: 'coolGray.800' }}>
      <Box flex={1} height="full">
        <WebView
          startInLoadingState={true}
          source={{
            uri: 'https://symptom-checker-mymedcare-dev.infermedica.com/form/en/?token=6aa8632e-2c18-4010-ba24-4f707e895c57',
          }}
        />
      </Box>
    </Box>
  );
};

export default SymptomsQuestionnaireScreen;
