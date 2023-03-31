import React from 'react';
import { useColorModeValue, VStack } from 'native-base';

import type { FloatingLabelSelectProps } from '@components/FloatingLabelSelect';
import FloatingLabelSelect from '@components/FloatingLabelSelect';

const FormSelect = ({
  mb,
  selectedValue,
  children,
  ...props
}: FloatingLabelSelectProps) => (
  <VStack mb={mb ?? 6}>
    <FloatingLabelSelect
      {...props}
      selectedValue={selectedValue}
      labelColor="#9CA3AF"
      labelBGColor={useColorModeValue('#fff', '#1F2937')}
    />
    {children}
  </VStack>
);

export default FormSelect;
