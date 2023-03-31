import React, { useState } from 'react';
import { Box, FormControl, Input, ISelectProps, Pressable, Select, Text } from 'native-base';
import AutocompleteInput from 'react-native-autocomplete-input';
import { SelectOption } from './FloatingLabelSelect';

type AutoCompleteProps = ISelectProps & {
  value: string;
  onChange: (value: string) => void;
  query: string;
  onQueryChange: (value: string) => void;
  options: SelectOption[];
};

const AutoComplete: React.FC<AutoCompleteProps> = ({
  value,
  query,
  onChange,
  onQueryChange,
  options = [],
  ...props
}) => {
  return (
    <Select
      selectedValue={value}
      onValueChange={onChange}
      placeholder={value}
      _actionSheetBody={{
        minHeight: 700,
        ListHeaderComponent: <Input autoFocus value={query} onChangeText={onQueryChange} />,
      }}
      {...props}
    >
      {options.map(({ value, label }) => (
        <Select.Item value={value} label={label} key={value} />
      ))}
    </Select>
  );
};

type NewAutoCompleteProps = {
  data: any[];
  onChange: (text: string) => void;
  error: boolean;
  helperText: string | undefined;
  value: string;
  dataStructure?: {
    key?: string;
    value?: string;
    label?: string;
  };
};

const NewAutoComplete: React.FC<NewAutoCompleteProps> = ({
  data,
  onChange,
  value,
  error,
  helperText,
  dataStructure,
}) => {
  const [hideResults, setHideResults] = useState(true);
  const { key = 'key', value: valueKey = 'value', label: labelKey = 'label' } = dataStructure || {};

  return (
    <FormControl isInvalid={error} zIndex={99}>
      <AutocompleteInput
        data={data}
        flatListProps={{
          keyExtractor: item => item[key],
          renderItem: ({ item }) => (
            <Pressable
              onPress={() => {
                onChange(item[valueKey]);
                setHideResults(true);
              }}
              p={2}
            >
              <Text>{item[labelKey]}</Text>
            </Pressable>
          ),
        }}
        hideResults={hideResults}
        renderTextInput={() => (
          <Input
            value={value}
            onChangeText={text => {
              onChange(text);
              if (hideResults) setHideResults(false);
            }}
          />
        )}
        inputContainerStyle={{ borderWidth: 0 }}
        containerStyle={{ zIndex: 99, position: 'absolute', width: '100%' }}
      />
      <Box mt={12} />
      <FormControl.ErrorMessage>{helperText}</FormControl.ErrorMessage>
    </FormControl>
  );
};

export { NewAutoComplete };

export default AutoComplete;
