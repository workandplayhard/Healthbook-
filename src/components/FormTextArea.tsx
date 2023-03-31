import React from 'react';
import { useColorModeValue, VStack } from 'native-base';

import type { FloatingLabelTextAreaProps } from '@components/FloatingLabelTextArea';
import FloatingLabelTextArea from '@components/FloatingLabelTextArea';

const FormTextArea = ({ children, labelExisting, placeHolder, value, ...props }: FloatingLabelTextAreaProps) => (
  <VStack mb="6">
    <FloatingLabelTextArea
      {...props}
      labelColor="#9CA3AF"
      value={value}
      placeHolder={placeHolder}
      labelExisting={labelExisting}
      labelBGColor={useColorModeValue('#fff', '#1F2937')}
    />
    {children}
  </VStack>
);

export default FormTextArea;
