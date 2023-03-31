import React from 'react';
import { Animated, Platform } from 'react-native';
import { ITextAreaProps, TextArea } from 'native-base';
import { Box } from 'native-base';

export type FloatingLabelTextAreaProps = ITextAreaProps & {
  label?: string;
  labelBGColor?: string;
  labelExisting?: boolean;
  labelColor?: string;
  placeHolder?: string;
  containerWidth?: string | number | { base: string; md: string };
};

const FloatingLabelTextArea = ({
  label,
  labelBGColor,
  labelColor,
  containerWidth,
  labelExisting = true,
  placeHolder,
  value,
  height,
  ...rest
}: FloatingLabelTextAreaProps) => {
  const _animatedIsFocused = new Animated.Value(rest.defaultValue === '' ? 0 : 1);

  const [isFocused, setIsFocused] = React.useState(false);

  function handleFocus() {
    setIsFocused(true);
  }

  function handleBlur() {
    setIsFocused(false);
  }

  React.useEffect(() => {
    Animated.timing(_animatedIsFocused, {
      duration: 200,
      useNativeDriver: false,
      toValue: isFocused || rest.defaultValue !== '' ? 1 : 0,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

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
      outputRange: Platform.OS === 'android' ? [13, 12] : [16, 12],
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
      <TextArea
        {...rest}
        value={value}
        placeholder={placeHolder}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoCompleteType=""
      />
    </Box>
  );
};

export default FloatingLabelTextArea;
