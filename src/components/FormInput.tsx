import React from 'react';
import { useColorModeValue, VStack } from 'native-base';

import type { FloatingLabelInputProps } from '@components/FloatingLabelInput';
import FloatingLabelInput from '@components/FloatingLabelInput';

const FormInput = ({ children, placeHolder, labelExisting, mb, ...props }: FloatingLabelInputProps) => (
  <VStack mb={mb ?? '6'}>
    <FloatingLabelInput
      {...props}
      labelColor="#9CA3AF"
      placeHolder={placeHolder}
      labelExisting={labelExisting}
      labelBGColor={useColorModeValue('#fff', '#1F2937')}
    />
    {children}
  </VStack>
);

export default FormInput;
