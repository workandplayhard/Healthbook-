import React from 'react';
import { Animated, NativeSyntheticEvent, Platform, TextInputFocusEventData } from 'react-native';
import type { IInputProps } from 'native-base';
import { Input, Box } from 'native-base';
import type { MaskInputProps } from 'react-native-mask-input';
import { useMaskedInputProps } from 'react-native-mask-input';

export type FloatingLabelInputProps = IInputProps &
  MaskInputProps & {
    label?: string;
    labelBGColor?: string;
    labelColor?: string;
    labelExisting?: boolean;
    containerWidth?: string | number | { base: string; md: string };
    placeHolder?: string;
  };

const FloatingLabelInput = ({
  label,
  labelBGColor,
  labelColor,
  containerWidth,
  placeHolder,
  labelExisting = true,
  ...inputProps
}: FloatingLabelInputProps) => {
  const _animatedIsFocused = new Animated.Value(
    inputProps.leftElement || inputProps.mask || !(inputProps.defaultValue === '' || undefined) ? 1 : 0,
  );

  const [isFocused, setIsFocused] = React.useState(false);

  const maskedInputProps = useMaskedInputProps({
    value: inputProps.value || '',
    onChangeText: inputProps.onChangeText,
    mask: inputProps.mask,
  });

  function handleFocus(e: NativeSyntheticEvent<TextInputFocusEventData>) {
    if (inputProps.onFocus) inputProps.onFocus(e);

    setIsFocused(true);
  }

  function handleBlur() {
    setIsFocused(false);
  }

  React.useEffect(() => {
    Animated.timing(_animatedIsFocused, {
      duration: 200,
      useNativeDriver: false,
      toValue: inputProps.leftElement || isFocused || inputProps.defaultValue !== '' ? 1 : 0,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, inputProps.value]);

  const labelContainerStyles: Animated.Animated = {
    position: 'absolute',
    left: 9,
    top: _animatedIsFocused.interpolate({
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
    fontSize: _animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: Platform.OS === 'android' ? [13, 12] : [13, 10],
    }),

    marginTop: _animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [-3, 0],
    }),
    color: labelColor,
  };

  return (
    <Box w={containerWidth}>
      {labelExisting && (
        <Animated.View pointerEvents="none" style={labelContainerStyles}>
          <Animated.Text style={labelStyle}>{label}</Animated.Text>
        </Animated.View>
      )}
      <Input
        {...inputProps}
        {...maskedInputProps}
        onChangeText={inputProps.onChangeText}
        placeholder={placeHolder}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </Box>
  );
};

export default FloatingLabelInput;
