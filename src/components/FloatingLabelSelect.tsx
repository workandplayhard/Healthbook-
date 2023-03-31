import React from 'react';
import { Animated, Platform } from 'react-native';
import { Box, ChevronDownIcon, ISelectProps, Select } from 'native-base';

export type SelectOption = {
  label: string;
  value: string;
};

export type FloatingLabelSelectProps = ISelectProps & {
  label?: string;
  selectedValue?: string;
  labelBGColor?: string;
  labelExisting?: boolean;
  labelColor?: string;
  options: SelectOption[];
  containerWidth?: string | number | { base: string; md: string };
};

const FloatingLabelSelect: React.FC<FloatingLabelSelectProps> = ({
  options,
  selectedValue,
  labelExisting = true,
  ...props
}) => {
  const _animated = new Animated.Value(props.defaultValue === '' ? 0 : 1);

  React.useEffect(() => {
    Animated.timing(_animated, {
      duration: 200,
      useNativeDriver: false,
      toValue: props.defaultValue !== '' ? 1 : 0,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { label, labelBGColor, labelColor } = props;

  const labelContainerStyles: Animated.Animated = {
    position: 'absolute',
    left: 9,
    top: _animated.interpolate({
      inputRange: [0, 1],
      outputRange: ['50%', '0%'],
    }),
    zIndex: 5,
    paddingLeft: 3,
    paddingRight: 3,
    marginTop: -8,
    height: 16,
    backgroundColor: labelBGColor,
    justifyContent: 'center',
  };

  const labelStyle: Animated.Animated = {
    fontWeight: '500',
    fontSize: _animated.interpolate({
      inputRange: [0, 1],
      outputRange: Platform.OS === 'android' ? [13, 12] : [13, 10],
    }),

    marginTop: _animated.interpolate({
      inputRange: [0, 1],
      outputRange: [-3, 0],
    }),
    color: labelColor,
  };

  return (
    <Box w={props.containerWidth}>
      {labelExisting && (
        <Animated.View pointerEvents="none" style={labelContainerStyles}>
          <Animated.Text style={labelStyle}>{label}</Animated.Text>
        </Animated.View>
      )}
      <Select
        {...props}
        selectedValue={selectedValue}
        _dark={{ placeholderTextColor: labelColor }}
        dropdownIcon={<ChevronDownIcon size="2.5" mr="4" />}
      >
        {options.map(option => (
          <Select.Item label={option.label} value={option.value} key={`option-${option.value}`} />
        ))}
      </Select>
    </Box>
  );
};

export default FloatingLabelSelect;
