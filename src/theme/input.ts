export default {
  defaultProps: {
    size: 'md',
  },
  variants: {
    outline: () => {
      return {
        _text: {
          fontWeight: 'normal',
        },
        rounded: 'md',
        py: '2.5',
        px: '3',
        _dark: {
          borderColor: 'dustyGray.500',
          color: 'dustyGray.100',
          bg: 'coolGray.800',
          cursorColor: 'tertiary.500',
          focusOutlineColor: 'tertiary.500',
          _focus: {
            bg: 'coolGray.800',
          },
        },
        _light: {
          borderColor: 'dustyGray.500',
          color: 'dustyGray.900',
          bg: 'white',
          _focus: {
            bg: 'white',
          },
        },
      };
    },
  },
};
